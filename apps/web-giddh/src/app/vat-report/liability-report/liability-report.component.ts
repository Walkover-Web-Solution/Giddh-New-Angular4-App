import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES, MOBILE_NUMBER_SELF_URL } from '../../app.constant';
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
import { FileReturnComponent } from '../file-return/file-return.component';
import { ViewReturnComponent } from '../view-return/view-return.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    public obligationsForm: UntypedFormGroup
    /** Holds Obligations table data */
    public tableDataSource: any[] = [];
    /** Holds Obligations table columns */
    public displayedColumns = ['start', 'end', 'due', 'status', 'action'];
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';

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
    ) { }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof ObligationsComponent
    */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.iniObligationsForm();
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
    * @memberof ObligationsComponent
    */
    public getVatObligations(): void {
        this.isLoading = true;
        this.vatService.getVatLiabilityReport(this.obligationsForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response?.status === "success" && response?.body?.obligations) {
                this.tableDataSource = response?.body?.obligations.map(item => {
                    item.start = dayjs(item.start).format(GIDDH_DATE_FORMAT);
                    item.end = dayjs(item.end).format(GIDDH_DATE_FORMAT);
                    item.due = dayjs(item.due).format(GIDDH_DATE_FORMAT);

                    return item;
                });
            } else if (response?.body?.message) {
                this.toaster.showSnackBar('error', response?.body?.message);
            } else if (response?.message) {
                this.toaster.showSnackBar('error', response?.message);
            }
        });
    }

    /**
    * Translation Complete Callback
    *
    * @param {*} event
    * @memberof ObligationsComponent
    */
    public translationComplete(event: any): void {
        if (event) {
        }
    }

    /**
    * Handle Dropdown callback for Tax Number and save value to form
    *
    * @param {*} event
    * @memberof ObligationsComponent
    */
    public taxNumberSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('taxNumber').setValue(event.value);
        }
    }

    /**
    * Handle Dropdown callback for Status and save value to form
    *
    * @param {*} event
    * @memberof ObligationsComponent
    */
    // public statusSelected(event: any): void {
    //     if (event?.value || event?.value === '') {
    //         this.getFormControl('status').setValue(event.value);
    //     }
    // }

    /**
    * Handle Dropdown callback for Branch and save value to form
    *
    * @param {*} event
    * @memberof ObligationsComponent
    */
    // public branchSelected(event: any): void {
    //     if (event?.value) {
    //         this.getFormControl('branchUniqueName').setValue(event.value);
    //     }
    // }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof ObligationsComponent
    */
    private iniObligationsForm(): void {
        this.obligationsForm = this.formBuilder.group({
            branchUniqueName: [''],
            taxNumber: [''],
            status: [''],
            from: [''],
            to: ['']
        });
    }

    /**
    * Get Universal Date Observable from Store and subscribed
    *
    * @private
    * @memberof ObligationsComponent
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
    * @memberof ObligationsComponent
    */
    private loadTaxDetails(): void {
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.length) {
                this.taxesList = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));
            }
        });
    }

    /**
    * This will be use for show datepicker
    *
    * @param {*} element
    * @memberof ObligationsComponent
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
    * @memberof ObligationsComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof ObligationsComponent
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
    * @memberof ObligationsComponent
    */
    public getFormControl(control: string): any {
        return this.obligationsForm.get(control)
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof ObligationsComponent
    */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }


    /**
    * Lifecycle hook for destroy
    *
    * @memberof ObligationsComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }
}
