import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { VatReportRequest } from '../models/api-models/Vat';
import * as _ from '../lodash-optimized';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { VatService } from "../services/vat.service";
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from "../shared/helpers/defaultDateFormat";
import { saveAs } from "file-saver";
import { StateDetailsRequest } from "../models/api-models/Company";
import { CompanyActions } from "../actions/company.actions";
import { BsDropdownDirective } from "ngx-bootstrap";

@Component({
    selector: 'app-vat-report',
    styleUrls: ['./vatReport.component.scss'],
    templateUrl: './vatReport.component.html'
})

export class VatReportComponent implements OnInit, OnDestroy {
    public vatReport: any[] = [];
    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any;
    public datePickerOptions: any = {
        alwaysShowCalendars: true,
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public moment = moment;
    public fromDate: string = '';
    public toDate: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public allowVatReportAccess: boolean = false;
    @ViewChild('monthWise', { static: false }) public monthWise: BsDropdownDirective;
    @ViewChild('periodDropdown', { static: true }) public periodDropdown;
    public isMonthSelected: boolean = true;
    public selectedMonth: any = null;
    public currentPeriod: any = {};
    public showCalendar: boolean = false;
    public datepickerVisibility: any = 'hidden';

    constructor(private store: Store<AppState>, private vatService: VatService, private _generalService: GeneralService, private _toasty: ToasterService, private cdRef: ChangeDetectorRef, private companyActions: CompanyActions, private _route: Router) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
    }

    public ngOnInit() {
        this.currentPeriod = {
            from: moment().startOf('month').format(GIDDH_DATE_FORMAT),
            to: moment().endOf('month').format(GIDDH_DATE_FORMAT)
        };

        this.selectedMonth = moment(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
        this.fromDate = this.currentPeriod.from;
        this.toDate = this.currentPeriod.to;

        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                res.forEach(cmp => {
                    if (cmp.uniqueName === activeCompanyName) {
                        this.activeCompany = cmp;

                        if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
                            this.activeCompany.addresses = [_.find(this.activeCompany.addresses, (tax) => tax.isDefault)];
                            this.saveLastState(activeCompanyName);
                            this.allowVatReportAccess = true;
                            this.getVatReport();
                        }
                    }
                });
            });
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getVatReport() {
        if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
            let vatReportRequest = new VatReportRequest();
            vatReportRequest.from = this.fromDate;
            vatReportRequest.to = this.toDate;
            vatReportRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

            this.vatReport = [];

            this.vatService.getVatReport(vatReportRequest).subscribe((res) => {
                if(res) {
                    if (res.status === 'success') {
                        this.vatReport = res.body.sections;
                        this.cdRef.detectChanges();
                    } else {
                        this._toasty.errorToast(res.message);
                    }
                }
            });
        }
    }

    public downloadVatReport() {
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.fromDate;
        vatReportRequest.to = this.toDate;
        vatReportRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

        this.vatService.downloadVatReport(vatReportRequest).subscribe((res) => {
            if (res.status === "success") {
                let blob = this._generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, `VatReport.xlsx`);
            } else {
                this._toasty.clearAllToaster();
                this._toasty.errorToast(res.message);
            }
        });
    }

    public saveLastState(companyUniqueName) {
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'pages/vat-report';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    public onOpenChange(data: boolean) {
        this.openMonthWiseCalendar(data);
    }

    public openMonthWiseCalendar(ev) {
        if (ev && this.monthWise) {
            ev ? this.monthWise.show() : this.monthWise.hide();
        }
    }

    public periodChanged(ev) {
        if (ev && ev.picker) {
            this.currentPeriod = {
                from: moment(ev.picker.startDate._d).format(GIDDH_DATE_FORMAT),
                to: moment(ev.picker.endDate._d).format(GIDDH_DATE_FORMAT)
            };
            this.fromDate = moment(ev.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(ev.picker.endDate._d).format(GIDDH_DATE_FORMAT);
            this.isMonthSelected = false;
        } else {
            this.currentPeriod = {
                from: moment(ev).startOf('month').format(GIDDH_DATE_FORMAT),
                to: moment(ev).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.fromDate = moment(ev).startOf('month').format(GIDDH_DATE_FORMAT);
            this.toDate = moment(ev).endOf('month').format(GIDDH_DATE_FORMAT);
            this.selectedMonth = ev;
            this.isMonthSelected = true;
        }
        this.showCalendar = false;

        this.getVatReport();
    }

    /**
     * This function will update the visibility of datepicker
     *
     * @param {*} visibility
     * @memberof VatReportComponent
     */
    public updateDatepickerVisibility(visibility) {
        this.datepickerVisibility = visibility;

        setTimeout(() => {
            if(this.datepickerVisibility === "hidden" && this.monthWise.isOpen === false) {
                this.hidePeriodDropdown();
            }
        }, 500);
    }

    /**
     * This function will hide datepicker dropdown if month and datepicker options are closed
     *
     * @memberof VatReportComponent
     */
    public checkIfDatepickerVisible() {
        setTimeout(() => {
            if(this.datepickerVisibility === "hidden") {
                this.hidePeriodDropdown();
            }
        }, 500);    
    }

    /**
     * This will hide the datepicker dropdown
     *
     * @memberof VatReportComponent
     */
    public hidePeriodDropdown() {
        this.periodDropdown.hide();
        document.querySelector(".btn-group.dropdown").classList.remove("open");
        document.querySelector(".btn-group.dropdown").classList.remove("show");
    }

    /**
     * This will redirect to vat report detail page
     *
     * @param {*} section
     * @memberof VatReportComponent
     */
    public viewVatReportTransactions(section) {
        this._route.navigate(['pages', 'vat-report', 'transactions', 'section', section], { queryParams: { from: this.currentPeriod.from, to: this.currentPeriod.to } });
    }
}
