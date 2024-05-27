import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';

@Component({
    selector: 'liability-report-component',
    templateUrl: './liability-report.component.html',
    styleUrls: ['./liability-report.component.scss']
})

export class LiabilityReportComponent implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if current organization is company */
    public isCompanyMode: boolean;
    /** Holds Branch List */
    public branchList: any;
    /** Holds Tax Number List */
    public taxesList: any;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public modalRef: BsModalRef;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Holds true if multiple branches in the company */
    public isMultipleBranch: boolean;
    /** Holds Obligations Fromgroup  */
    public liabilityReportForm: UntypedFormGroup
    /** Holds Obligations table data */
    public tableDataSource: any[] = [];
    /** Holds Obligations table columns */
    public displayedColumns = ['start', 'end', 'due', 'status', 'action'];
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Holds Currency List for Zimbabwe Amount exchange rate */
    public vatReportCurrencyList: any[] = [
        { label: 'BWP', value: 'BWP', additional: { symbol: 'P' } },
        { label: 'USD', value: 'USD', additional: { symbol: '$' } },
        { label: 'GBP', value: 'GBP', additional: { symbol: '£' } },
        { label: 'INR', value: 'INR', additional: { symbol: '₹' } },
        { label: 'EUR', value: 'EUR', additional: { symbol: '€' } }
    ];
    /** Holds Current Currency Symbol for Zimbabwe report */
    public vatReportCurrencySymbol: string = this.vatReportCurrencyList[0].additional.symbol;
    /** True if Current branch has Tax Number */
    public hasTaxNumber: boolean = false;
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** Holds Table Data  */
    public vatLiabilityOverviewReport: any[];

    constructor(
        private gstReconcileService: GstReconcileService,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vatService: VatService,
        private toaster: ToasterService,
        private modalService: BsModalService,
        public dialog: MatDialog,
        private route: Router
    ) {
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof LiabilityReportComponent
    */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.initLiabilityReport();
        this.getUniversalDatePickerDate();
        this.isCompanyMode = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.loadTaxDetails();

        if (this.isCompanyMode) {
            this.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    if (response?.length > 1) {
                        this.isMultipleBranch = true;
                        let unarchivedBranches = response.filter(branch => branch.isArchived === false);
                        this.branchList = unarchivedBranches?.sort(this.generalService.sortBranches);
                        this.branchList = this.branchList.map(branch => {
                            return {
                                label: branch?.alias,
                                value: branch?.uniqueName
                            };
                        });
                    } else {
                        this.isMultipleBranch = false;
                        if (response.uniqueName) {
                            this.getFormControl('branchUniqueName').setValue(response.uniqueName);
                        }
                    }
                }
            });
        } else {
            this.getFormControl('branchUniqueName').setValue(this.generalService.currentBranchUniqueName);
        }
    }

    /**
    * VAT Obligations API Call
    *
    * @memberof LiabilityReportComponent
    */
    public getVatLiabilityReport(): void {
        this.isLoading = true;
        this.vatService.getVatLiabilityReport(this.liabilityReportForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === "success" && response.body?.sections) {
                this.vatLiabilityOverviewReport = response.body.sections

                this.getFormControl('currencyCode').patchValue(response.body?.currency?.code);
                this.vatReportCurrencySymbol = this.vatReportCurrencyList.filter(item => item.label === response.body?.currency?.code).map(item => item.additional.symbol).join();

            } else if (response?.body?.message) {
                this.toaster.showSnackBar('error', response?.body?.message);
            } else if (response?.message) {
                this.toaster.showSnackBar('error', response?.message);
            }
        });
    }

    public viewDetailedReport(report): void {
        if (report) {
            let formValue = this.liabilityReportForm.value;
            let section = report?.section === "Input VAT Total" ? 'inputVat' : 'outputVat';

            this.route.navigate(['pages', 'vat-report', 'liability-report', 'detailed'], { queryParams: { from: formValue.from, to: formValue.to, taxNumber: formValue.taxNumber, currencyCode: formValue.currencyCode, section: section } });
        }
    }

    /**
    * Translation Complete Callback
    *
    * @param {*} event
    * @memberof LiabilityReportComponent
    */
    public translationComplete(event: any): void {
        if (event) {
        }
    }

    /**
    * Handle Dropdown callback for Tax Number and save value to form
    *
    * @param {*} event
    * @memberof LiabilityReportComponent
    */
    public taxNumberSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('taxNumber').setValue(event.value);
            this.getVatLiabilityReport();
        }
    }

    /**
    * Handle Dropdown callback for Branch and save value to form
    *
    * @param {*} event
    * @memberof LiabilityReportComponent
    */
    public branchSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('branchUniqueName').setValue(event.value);
        }
    }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof LiabilityReportComponent
    */
    private initLiabilityReport(): void {
        this.liabilityReportForm = this.formBuilder.group({
            branchUniqueName: [''],
            currencyCode: ['BWP'],
            taxNumber: [''],
            from: [''],
            to: ['']
        });
    }

    /**
    * Get Universal Date Observable from Store and subscribed
    *
    * @private
    * @memberof LiabilityReportComponent
    */
    private getUniversalDatePickerDate(): void {
        this.store.pipe(select(stateStore => stateStore.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.getFormControl('from').setValue(dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT));
                this.getFormControl('to').setValue(dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT));
            }
        });
    }

    /**
    * Loads the tax details of a company
    *
    * @private
    * @memberof LiabilityReportComponent
    */
    private loadTaxDetails(): void {
        this.isTaxApiInProgress = true;
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.length) {
                this.taxesList = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
                this.isTaxApiInProgress = false;
                this.hasTaxNumber = true;
                this.getVatLiabilityReport();
            } else {
                this.hasTaxNumber = false;
            }
        });
    }

    /**
    * This will be use for show datepicker
    *
    * @param {*} element
    * @memberof LiabilityReportComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
    * This will be use for hide datepicker
    *
    * @memberof LiabilityReportComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof LiabilityReportComponent
    */
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
            this.getFormControl('from').setValue(dayjs(value.startDate).format(GIDDH_DATE_FORMAT));
            this.getFormControl('to').setValue(dayjs(value.endDate).format(GIDDH_DATE_FORMAT));
        }
    }

    /**
    * Used to get and set form control value
    *
    * @param {string} control
    * @returns {*}
    * @memberof LiabilityReportComponent
    */
    public getFormControl(control: string): any {
        return this.liabilityReportForm.get(control)
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof LiabilityReportComponent
    */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }

    /**
     * Handle Currency change dropdown and call VAT Report API
     *
     * @param {*} event
     * @memberof LiabilityReportComponent
     */
    public onCurrencyChange(event: any): void {
        if (event) {
            this.getFormControl('currencyCode').patchValue(event.value);
            this.getVatLiabilityReport();
        }
    }

    /**
     * Export Liability report based on currency and tax number
     *
     * @memberof LiabilityReportComponent
     */
    public downloadVatReport(): void {
        this.liabilityReportForm.value
        let vatReportRequest = this.liabilityReportForm.value;

        delete vatReportRequest.section;
        delete vatReportRequest.page;
        delete vatReportRequest.count;

        this.vatService.downloadVatLiabilityReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, 'VatLiabilityReport.xlsx');
            } else {
                this.toaster.showSnackBar('error', res?.message);
            }
        });
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof LiabilityReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }
}
