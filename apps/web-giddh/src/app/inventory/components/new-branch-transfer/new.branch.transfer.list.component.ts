import {
    Component,
    TemplateRef,
    OnDestroy,
    OnInit,
    ViewChild,
    HostListener
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InventoryService } from '../../../services/inventory.service';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { takeUntil } from 'rxjs/operators';
import { NewBranchTransferListResponse, NewBranchTransferListPostRequestParams, NewBranchTransferListGetRequestParams, NewBranchTransferDownloadRequest } from '../../../models/api-models/BranchTransfer';
import { branchTransferVoucherTypes, branchTransferAmountOperators } from "../../../shared/helpers/branchTransferFilters";
import { IOption } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { PageEvent } from '@angular/material/paginator';
import { ASIDE_PANE_CONFIG, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { ToasterService } from '../../../services/toaster.service';
import { IForceClear } from '../../../models/api-models/Sales';
import { saveAs } from "file-saver";
import { ESCAPE } from '@angular/cdk/keycodes';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { Router } from "@angular/router";
import { cloneDeep, isEmpty } from '../../../lodash-optimized';
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
    selector: "new-branch-transfer-list",
    templateUrl: "./new.branch.transfer.list.component.html",
    styleUrls: ["./new.branch.transfer.component.scss"],
    standalone: false
})

export class NewBranchTransferListComponent implements OnInit, OnDestroy {

    @ViewChild('branchtransfertemplate', { static: true }) public branchtransfertemplate: TemplateRef<any>;
    @ViewChild('searchDialog', { static: true }) public searchDialog: TemplateRef<any>;
    @ViewChild('deleteBranchTransferDialog', { static: true }) public deleteBranchTransferDialog: TemplateRef<any>;
    /** Reference to delete branch transfer dialog */
    private deleteBranchTransferDialogRef: MatDialogRef<any>;
    @ViewChild('senderReceiverField', { static: true }) public senderReceiverField;
    @ViewChild('warehouseNameField', { static: true }) public warehouseNameField;
    /** Reference to aside transfer pane template */
    @ViewChild('asideTransferPaneTemplate', { static: true }) public asideTransferPaneTemplate: TemplateRef<any>;
    /** Reference to aside transfer pane dialog */
    public asideTransferPaneDialogRef: MatDialogRef<any>;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompany: any = {};
    public voucherTypes: IOption[] = [];
    public amountOperators: IOption[] = [];
    public branchTransferResponse: NewBranchTransferListResponse;
    public universalDate$: Observable<any>;
    public datePicker: any[] = [];
    public dayjs = dayjs;
    public asidePaneState: string = 'out';
    public asideTransferPaneState: string = 'out';
    public branchTransferMode: string = '';
    public inlineSearch: any = '';
    public timeout: any;
    public selectedBranchTransfer: any = '';
    public selectedBranchTransferType: any = '';
    public editBranchTransferUniqueName: string = '';
    public isLoading: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public clearFilter: boolean = false;
    public selectedVoucherType: string = '';
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    public branchTransferGetRequestParams: NewBranchTransferListGetRequestParams = {
        from: '',
        to: '',
        page: 1,
        count: PAGINATION_LIMIT,
        sort: '',
        sortBy: '',
        branchUniqueName: ''
    };
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
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;

    constructor(
        private _generalService: GeneralService,
        private dialog: MatDialog,
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private _toasty: ToasterService,
        private settingsBranchAction: SettingsBranchActions,
        private router: Router
    ) {
        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !isEmpty(o)) {
                let companyInfo = cloneDeep(o);
                this.activeCompany = companyInfo;
            }
        });
        this.currentOrganizationType = this._generalService.currentOrganizationType;
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        document.querySelector("body")?.classList?.add("new-branch-list-page");
        this.initBranchTransferListResponse();
        branchTransferVoucherTypes.map(voucherType => {
            this.voucherTypes.push({ label: voucherType.label, value: voucherType.value });
        });

        branchTransferAmountOperators.map(amountOperator => {
            this.amountOperators.push({ label: amountOperator.label, value: amountOperator.value });
        });

        this.store.pipe(select(stateStore => stateStore.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
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
        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany?.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this._generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
                this.branchTransferGetRequestParams.branchUniqueName = this.currentBranch?.uniqueName;
            } else {
                if (this._generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("new-branch-list-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens the search dialog using Angular Material
     *
     * @param {TemplateRef<any>} template - Template reference for the dialog content
     * @memberof NewBranchTransferListComponent
     */
    public openSearchModal(template: TemplateRef<any>): void {
        // Open dialog using Angular Material
        const dialogRef = this.dialog.open(template, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });

        setTimeout(() => {
            if (this.clearFilter) {
                this.forceClear$ = observableOf({ status: true });
                this.clearFilter = false;
            }
        }, 200);
    }

    /**
     * Closes the search dialog
     *
     * @memberof NewBranchTransferListComponent
     */
    public closeSearchDialog(): void {
        this.dialog.closeAll();
    }

    public initBranchTransferListResponse(): void {
        this.branchTransferResponse = {
            items: null,
            fromDate: null,
            toDate: null,
            page: null,
            count: null,
            totalPages: null,
            totalItems: null,
        };
    }

    public getBranchTransferList(resetPage: boolean): void {
        this.isLoading = true;

        if (resetPage) {
            this.branchTransferGetRequestParams.page = 1;
        }

        this.inventoryService.getBranchTransferList(this.branchTransferGetRequestParams, this.branchTransferPostRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                this.branchTransferResponse = response?.body;
            } else {
                this.initBranchTransferListResponse();
            }
            this.isLoading = false;
        });
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof NewBranchTransferListComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.branchTransferResponse.items = [];
        this.branchTransferGetRequestParams.page = this.branchTransferGetRequestParams.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.branchTransferGetRequestParams.count = event.pageSize;
        this.getBranchTransferList(false);
    }

    public changeFilterDate(date): void {
        if (date) {
            this.branchTransferGetRequestParams.from = dayjs(date[0]).format(GIDDH_DATE_FORMAT);
            this.branchTransferGetRequestParams.to = dayjs(date[1]).format(GIDDH_DATE_FORMAT);
            this.getBranchTransferList(true);
        }
    }

    /**
     * Applies search filters and closes the search dialog
     *
     * @memberof NewBranchTransferListComponent
     */
    public search(): void {
        this.branchTransferPostRequestParams.voucherType = this.branchTransferTempPostRequestParams.voucherType;
        this.branchTransferPostRequestParams.amountOperator = this.branchTransferTempPostRequestParams.amountOperator;
        this.branchTransferPostRequestParams.amount = this.branchTransferTempPostRequestParams.amount;
        this.getBranchTransferList(true);
        this.closeSearchDialog();
    }

    /**
     * Opens the transfer aside pane dialog
     *
     * @memberof NewBranchTransferListComponent
     */
    public openTransferAsidePaneDialog(): void {
        this.editBranchTransferUniqueName = '';
        this.asideTransferPaneDialogRef = this.dialog.open(this.asideTransferPaneTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Opens the branch transfer dialog using Angular Material
     *
     * @memberof NewBranchTransferListComponent
     */
    public openModal(): void {
        this.dialog.open(
            this.branchtransfertemplate,
            {
                panelClass: ['mat-dialog-lg', 'receipt-note-modal', 'mb-0', 'pt-custom-85'],
                disableClose: true
            }
        );
    }

    /**
     * Hides the modal/dialog and optionally refreshes the list
     *
     * @param {boolean} refreshList - Whether to refresh the branch transfer list
     * @memberof NewBranchTransferListComponent
     */
    public hideModal(refreshList: boolean): void {
        this.router.navigate(['/pages/inventory/report']);
        if (refreshList) {
            this.getBranchTransferList(true);
        }
        // Close all open dialogs
        this.dialog.closeAll();
    }

    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getBranchTransferList(true);
        }, 700);
    }

    public deleteNewBranchTransfer(): void {
        this.hideBranchTransferModal();
        this.inventoryService.deleteNewBranchTransfer(this.selectedBranchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                this._toasty.successToast(response?.body);
                this.getBranchTransferList(false);
            } else {
                this._toasty.errorToast(response?.message);
            }
        });
    }

    /**
     * Opens the delete branch transfer confirmation dialog
     *
     * @param {any} item - Branch transfer item to delete
     * @memberof NewBranchTransferListComponent
     */
    public showDeleteBranchTransferModal(item): void {
        this.selectedBranchTransfer = item?.uniqueName;
        this.selectedBranchTransferType = (item.voucherType === "receiptnote") ? "Receipt Note" : "Delivery Challan";

        // Open the dialog using Angular Material
        this.deleteBranchTransferDialogRef = this.dialog.open(this.deleteBranchTransferDialog, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Closes the delete branch transfer confirmation dialog
     *
     * @memberof NewBranchTransferListComponent
     */
    public hideBranchTransferModal(): void {
        this.deleteBranchTransferDialogRef?.close();
    }

    public sortBranchTransferList(sortBy): void {
        let sort = "asc";

        if (this.branchTransferGetRequestParams.sortBy === sortBy) {
            sort = (this.branchTransferGetRequestParams.sort === "asc") ? "desc" : "asc";
        } else {
            sort = "asc";
        }

        this.branchTransferGetRequestParams.sort = sort;
        this.branchTransferGetRequestParams.sortBy = sortBy;

        this.getBranchTransferList(true);
    }

    public showEditBranchTransferPopup(item): void {
        this.branchTransferMode = item.voucherType;
        this.editBranchTransferUniqueName = item?.uniqueName;
        this.openModal();
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
    }

    public checkIfAmountEmpty(): void {
        if (this.branchTransferPostRequestParams.amountOperator && !this.branchTransferPostRequestParams.amount) {
            this.branchTransferPostRequestParams.amount = 0;
        }
    }

    public openBranchTransferPopup(event): void {
        this.branchTransferMode = event;
        this.openTransferAsidePaneDialog();
        this.openModal();
    }

    public refreshTempPostParams(): void {
        this.branchTransferTempPostRequestParams.voucherType = this.branchTransferPostRequestParams.voucherType;
        this.branchTransferTempPostRequestParams.amountOperator = this.branchTransferPostRequestParams.amountOperator;
        this.branchTransferTempPostRequestParams.amount = this.branchTransferPostRequestParams.amount;
    }

    public downloadBranchTransfer(item): void {
        let downloadBranchTransferRequest = new NewBranchTransferDownloadRequest();
        downloadBranchTransferRequest.uniqueName = item?.uniqueName;

        this.inventoryService.downloadBranchTransfer(this.activeCompany?.uniqueName, downloadBranchTransferRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this._generalService.base64ToBlob(res?.body, 'application/pdf', 512);
                return saveAs(blob, item.voucherNo + `.pdf`);
            } else {
                this._toasty.clearAllToaster();
                this._toasty.errorToast(res?.message);
            }
        });
    }

    /**
     * Branch change handler
     *
     * @memberof NewBranchTransferListComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.branchTransferGetRequestParams.branchUniqueName = selectedEntity.value;
        this.getBranchTransferList(true);
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.altKey && event.which === 78) { // Alt + N
            event.preventDefault();
            event.stopPropagation();
            this.openTransferAsidePaneDialog();
        }

        if (event.which === ESCAPE) {
            this.editBranchTransferUniqueName = '';
            this.asideTransferPaneDialogRef?.close();
        }
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

    /**
    * This will show the datepicker
    *
    * @param {boolean} isOpen
    * @memberof NewBranchTransferListComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof NewBranchTransferListComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
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
}
