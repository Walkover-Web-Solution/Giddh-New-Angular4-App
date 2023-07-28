import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { VatReportRequest } from '../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { VatService } from "../services/vat.service";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../shared/helpers/defaultDateFormat";
import { saveAs } from "file-saver";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { IOption } from '../theme/ng-select/ng-select';
import { GstReconcileService } from '../services/gst-reconcile.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { cloneDeep } from '../lodash-optimized';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// export interface PeriodicElement {
//     number: string;
//     name: string;
//     description: string;
//     aed_amt: string;
//     vat_amt: string;
//     adjustment: string;
// }
// export interface PeriodicElement {
//     number: string;
//     name: string;
//     description: string;
//     aed_amt: string;
//     vat_amt: string;
//     adjustment: string;
// }
@Component({
    selector: 'app-vat-report',
    styleUrls: ['./vat-report.component.scss'],
    templateUrl: './vat-report.component.html'
})
export class VatReportComponent implements OnInit, OnDestroy {
    public vatReport: any[] = [];
    public activeCompany: any;
    public datePickerOptions: any = {
        alwaysShowCalendars: true,
        startDate: dayjs().subtract(30, 'day'),
        endDate: dayjs()
    };
    public dayjs = dayjs;
    public fromDate: string = '';
    public toDate: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @ViewChild('monthWise', { static: true }) public monthWise: BsDropdownDirective;
    @ViewChild('periodDropdown', { static: true }) public periodDropdown;
    public from: string = dayjs().subtract(30, 'day').format(GIDDH_DATE_FORMAT);
    public to: string = dayjs().format(GIDDH_DATE_FORMAT);
    public isMonthSelected: boolean = true;
    public selectedMonth: any = null;
    public currentPeriod: any = {};
    public showCalendar: boolean = false;
    public datepickerVisibility: any = 'hidden';
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** Tax number */
    public taxNumber: string;
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Datepicker modal reference */
    public modalRef: BsModalRef;
    /** Directive to get reference of element */
    @ViewChild('datepickerEntryTemplate') public datepickerEntryTemplate: ElementRef;
    /** Directive to get reference of element */
    @ViewChild('datepickerVoucherTemplate') public datepickerVoucherTemplate: ElementRef;
    /** This will store universalDate */
    public universalDate: any;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to use in api */
    public selectedEntryDateRange: any;
    /** This will store selected entry date range to show on UI */
    public selectedEntryDateRangeUi: any;
    /** This will store selected date range to use in api */
    public selectedVoucherDateRange: any;
    /** This will store selected entry date range to show on UI */
    public selectedVoucherDateRangeUi: any;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /*-- mat-table --*/
    displayedColumns: string[] = ['number', 'name', 'description', 'aed_amt', 'vat_amt', 'adjustment'];
    netdisplayedColumns: string[] = ['number', 'description', 'tooltip'];


    constructor(
        private gstReconcileService: GstReconcileService,
        private store: Store<AppState>,
        private vatService: VatService,
        private generalService: GeneralService,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private route: Router,
        private settingsBranchAction: SettingsBranchActions,
        private breakpointObserver: BreakpointObserver,
        private modalService: BsModalService,
    ) {

    }

    public ngOnInit() {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.breakpointObserver
        .observe(['(max-width: 767px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
            if (!this.isMobileScreen) {
                this.asideGstSidebarMenuState = 'in';
            }
        });
        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.loadTaxDetails();
        this.currentPeriod = {
            from: dayjs().startOf('month').format(GIDDH_DATE_FORMAT),
            to: dayjs().endOf('month').format(GIDDH_DATE_FORMAT)
        };
        this.taxNumber = window.history.state.taxNumber || '';
        if (window.history.state.from && window.history.state.to) {
            this.currentPeriod = {
                from: window.history.state.from,
                to: window.history.state.to
            };
        }
        this.selectedMonth = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
        this.fromDate = this.currentPeriod.from;
        this.toDate = this.currentPeriod.to;

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });
        if (this.taxNumber) {
            this.getVatReport();
        }
        /** Universal date observer */
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

    public getVatReport(event?: any) {
        console.log(event)
        if (event && event.value) {
            this.taxNumber = event.value;
        }

        if (this.taxNumber) {
            let vatReportRequest = new VatReportRequest();
            vatReportRequest.from = this.fromDate;
            vatReportRequest.to = this.toDate;
            vatReportRequest.taxNumber = this.taxNumber;
            vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;
            this.vatReport = [];

            this.vatService.getVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        this.vatReport = res.body?.sections;
                        
                    } else {
                        this.toasty.errorToast(res.message);
                    }
                }
                this.cdRef.detectChanges();
            });
        }
    }

    public downloadVatReport() {
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.fromDate;
        vatReportRequest.to = this.toDate;
        vatReportRequest.taxNumber = this.taxNumber;
        vatReportRequest.branchUniqueName = this.currentBranch?.uniqueName;
        this.vatService.downloadVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, `VatReport.xlsx`);
            } else {
                this.toasty.clearAllToaster();
                this.toasty.errorToast(res?.message);
            }
        });
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
                from: dayjs(ev.picker.startDate.d).format(GIDDH_DATE_FORMAT),
                to: dayjs(ev.picker.endDate.d).format(GIDDH_DATE_FORMAT)
            };
            this.fromDate = dayjs(ev.picker.startDate.d).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(ev.picker.endDate.d).format(GIDDH_DATE_FORMAT);
            this.isMonthSelected = false;
        } else {
            this.currentPeriod = {
                from: dayjs(ev).startOf('month').format(GIDDH_DATE_FORMAT),
                to: dayjs(ev).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.fromDate = dayjs(ev).startOf('month').format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(ev).endOf('month').format(GIDDH_DATE_FORMAT);
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
            if (this.datepickerVisibility === "hidden" && this.monthWise && this.monthWise.isOpen === false) {
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
            if (this.datepickerVisibility === "hidden") {
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
        this.route.navigate(['pages', 'vat-report', 'transactions', 'section', section], { queryParams: { from: this.currentPeriod.from, to: this.currentPeriod.to, taxNumber: this.taxNumber } });
    }

    /**
     * Branch change handler
     *
     * @memberof VatReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.getVatReport();
    }

    /**
     * Loads the tax details of a company
     *
     * @private
     * @memberof VatReportComponent
     */
    private loadTaxDetails(): void {
        this.isTaxApiInProgress = true;
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
            }
            this.isTaxApiInProgress = false;
        });
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof VatReportComponent
     */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }
}
