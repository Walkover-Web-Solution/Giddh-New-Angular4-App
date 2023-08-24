import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { NewBranchTransferDownloadRequest, NewBranchTransferListGetRequestParams, NewBranchTransferListPostRequestParams, NewBranchTransferListResponse } from 'apps/web-giddh/src/app/models/api-models/BranchTransfer';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { branchTransferVoucherTypes, branchTransferAmountOperators } from "../../../../shared/helpers/branchTransferFilters";
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ConfirmationModalConfiguration } from 'apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.interface';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'branch-transfer-list',
    templateUrl: './branch-transfer-list.component.html',
    styleUrls: ['./branch-transfer-list.component.scss']
})
export class BranchTransferListComponent implements OnInit {
    /** Manufacturing list  product dropdown items*/
    public product: any = [];
    /** Material table elements */
    public displayedColumns: string[] = [];
    /** Instance of Mat Dialog for Advance Filter */
    @ViewChild("advanceFilterDialog") public advanceFilterComponent: TemplateRef<any>;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    @ViewChild('senderReceiverField', { static: true }) public senderReceiverField;
    @ViewChild('warehouseNameField', { static: true }) public warehouseNameField;
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    public modalRef: BsModalRef;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompany: any;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    public datePicker: any[] = [];
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    public universalDate$: Observable<any>;
    public isLoading: boolean = false;
    public branchTransferGetRequestParams: NewBranchTransferListGetRequestParams = {
        from: '',
        to: '',
        page: 1,
        count: PAGINATION_LIMIT,
        sort: '',
        sortBy: '',
        branchUniqueName: ''
    };
    /** This will use for activity logs object */
    public branchTransferPaginationObject = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: PAGINATION_LIMIT
    }
    public branchTransferPostRequestParams: NewBranchTransferListPostRequestParams = {
        amountOperator: null,
        amount: null,
        voucherType: null,
        date: null,
        voucherNo: null,
        senderReceiver: null,
        warehouseName: null,
        sender: null,
        receiver: null
    };
    public branchTransferTempPostRequestParams: any = {
        amountOperator: null,
        amount: null,
        voucherType: null
    };
    public clearFilter: boolean = false;
    public branchTransferResponse = null;
    public voucherTypes: IOption[] = [];
    public amountOperators: IOption[] = [];
    public inlineSearch: any = '';
    public timeout: any;
    public editBranchTransferUniqueName: string = '';
    public branchTransferMode: string = '';
    public selectedBranchTransfer: any = '';
    public selectedBranchTransferType: any = '';
    /** Branch Transfer confirmation popup configuration */
    public branchTransferConfirmationConfiguration: ConfirmationModalConfiguration;

    constructor(
        public dialog: MatDialog,
        private modalService: BsModalService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
        private inventoryService: InventoryService,
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService
    ) {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        if (this.currentOrganizationType === 'BRANCH') {
            this.displayedColumns = ['s_no', 'date', 'voucher_type', 'voucher_no', 'sender_receiver', 'from_warehouse', 'to_warehouse', 'total_amount', 'action'];
        } else {
            this.displayedColumns = ['s_no', 'date', 'voucher_type', 'voucher_no', 'sender', 'receiver', 'from_warehouse', 'to_warehouse', 'total_amount', 'action'];
        }
        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        document.querySelector("body")?.classList?.add("new-branch-list-page");
        branchTransferVoucherTypes.map(voucherType => {
            this.voucherTypes.push({ label: voucherType.label, value: voucherType.value });
        });

        branchTransferAmountOperators.map(amountOperator => {
            this.amountOperators.push({ label: amountOperator.label, value: amountOperator.value });
        });
        this.store.pipe(select(stateStore => stateStore.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePicker = [dayjs(universalDate[0], GIDDH_DATE_FORMAT).toDate(), dayjs(universalDate[1], GIDDH_DATE_FORMAT).toDate()];
                this.branchTransferGetRequestParams.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.branchTransferGetRequestParams.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getBranchTransferList(false);
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

    }

    public focusOnColumnSearch(inlineSearch) {
        this.inlineSearch = inlineSearch;

        setTimeout(() => {
            if (this.inlineSearch === 'senderReceiver') {
                if (this.senderReceiverField && this.senderReceiverField.nativeElement) {
                    this.senderReceiverField.nativeElement.focus();
                }
            } else if (this.inlineSearch === 'warehouseName') {
                if (this.warehouseNameField && this.warehouseNameField.nativeElement) {
                    this.warehouseNameField.nativeElement.focus();
                }
            }
        }, 200);
    }

    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getBranchTransferList(true);
        }, 700);
    }

    public downloadBranchTransfer(item): void {
        let downloadBranchTransferRequest = new NewBranchTransferDownloadRequest();
        downloadBranchTransferRequest.uniqueName = item?.uniqueName;

        this.inventoryService.downloadBranchTransfer(this.activeCompany?.uniqueName, downloadBranchTransferRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res?.body, 'application/pdf', 512);
                return saveAs(blob, item.voucherNo + `.pdf`);
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(res?.message);
            }
        });
    }


    public showEditBranchTransferPopup(item): void {
        this.branchTransferMode = item.voucherType;
        this.editBranchTransferUniqueName = item?.uniqueName;
        // this.openModal();
    }

    public showDeleteBranchTransferModal(item): void {
        this.selectedBranchTransfer = item?.uniqueName;
        this.selectedBranchTransferType = (item.voucherType === "receiptnote") ? "Receipt Note" : "Delivery Challan";
        this.branchTransferConfirmationConfiguration = this.generalService.getDeleteBranchTransferConfiguration(this.localeData, this.commonLocaleData, this.selectedBranchTransferType,);

        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.branchTransferConfirmationConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            console.log(response);
            if (response === 'Yes') {
                this.deleteNewBranchTransfer()
            } else {
                this.dialog.closeAll();
            }
        });
    }

    public deleteNewBranchTransfer(): void {
        this.dialog.closeAll();
        this.inventoryService.deleteNewBranchTransfer(this.selectedBranchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                this.toaster.successToast(response?.body);
                this.getBranchTransferList(false);
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }

    /**
  * Branch change handler
  *
  * @memberof VatReportComponent
  */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
    }

    public pageChanged(event: any): void {
        this.branchTransferResponse = [];
        this.branchTransferPaginationObject.page = event?.page;
        this.getBranchTransferList(false);
    }

    /**
     *  Function to open Dialog on Advance Filter Button
     */
    public openAdvanceFilterDialog(): void {
        this.dialog.open(this.advanceFilterComponent, {
            width: '630px',
        })
    }

    /**
      *To show the datepicker
      *
      * @param {*} element
      * @memberof ListManufacturingComponent
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
      * This will hide the datepicker
      *
      * @memberof InvoicePreviewComponent
      */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof NewBranchTransferListComponent
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
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.branchTransferGetRequestParams.from = this.fromDate;
            this.branchTransferGetRequestParams.to = this.toDate;
            this.getBranchTransferList(true);
        }
    }

    /**
 * This will use for sorting filters
 *
 * @param {*} event
 * @memberof ReportsComponent
 */
    public sortChange(event: any): void {
        this.branchTransferGetRequestParams.sort = event?.direction ? event?.direction : 'asc';
        this.branchTransferGetRequestParams.sortBy = event?.active;
        this.branchTransferGetRequestParams.page = 1;
        this.getBranchTransferList(false);
    }

    public clearFilters(): void {
        this.branchTransferPostRequestParams.senderReceiver = null;
        this.branchTransferPostRequestParams.warehouseName = null;
        this.branchTransferPostRequestParams.voucherType = null;
        this.branchTransferPostRequestParams.amountOperator = null;
        this.branchTransferPostRequestParams.amount = null;
        this.branchTransferPostRequestParams.sender = null;
        this.branchTransferPostRequestParams.receiver = null;
        this.branchTransferPostRequestParams.fromWarehouse = null;
        this.branchTransferPostRequestParams.toWarehouse = null;
        this.branchTransferTempPostRequestParams.voucherType = null;
        this.branchTransferTempPostRequestParams.amountOperator = null;
        this.branchTransferTempPostRequestParams.amount = null;
        this.branchTransferGetRequestParams.sort = "";
        this.branchTransferGetRequestParams.sortBy = "";

        this.clearFilter = true;
        this.getBranchTransferList(true);
    }

    public getBranchTransferList(resetPage: boolean): void {
        this.isLoading = true;

        if (resetPage) {
            this.branchTransferPaginationObject.page = 1;
        }
        this.branchTransferGetRequestParams.page = this.branchTransferPaginationObject.page;
        this.inventoryService.getBranchTransferList(this.branchTransferGetRequestParams, this.branchTransferPostRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response?.status === "success") {
                console.log(response);
                this.branchTransferPaginationObject.page = response.body.page;
                this.branchTransferPaginationObject.totalPages = response.body.totalPages;
                this.branchTransferPaginationObject.totalItems = response.body.totalItems;
                this.branchTransferPaginationObject.count = response.body.count;
                this.branchTransferResponse = response.body?.items;
            } else {
                this.branchTransferResponse = [];
                this.branchTransferPaginationObject.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }
    public checkIfFiltersApplied(): boolean {
        if (
            this.branchTransferPostRequestParams.senderReceiver ||
            this.branchTransferPostRequestParams.fromWarehouse ||
            this.branchTransferPostRequestParams.toWarehouse ||
            this.branchTransferPostRequestParams.sender ||
            this.branchTransferPostRequestParams.receiver ||
            this.branchTransferPostRequestParams.voucherType ||
            this.branchTransferPostRequestParams.amountOperator ||
            this.branchTransferPostRequestParams.amount) {
            return true;
        } else {
            return false;
        }
        return
    }

    public ngOnDestroy() {
        document.querySelector("body")?.classList?.remove("new-branch-list-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
