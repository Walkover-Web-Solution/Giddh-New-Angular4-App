import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from '../lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as dayjs from 'dayjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../actions/company.actions';
import { TaxResponse } from '../models/api-models/Company';
import { DaybookQueryRequest, DayBookRequestModel, ExportBodyRequest } from '../models/api-models/DaybookRequest';
import { DaterangePickerComponent } from '../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { ASIDE_PANE_CONFIG, BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS } from '../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { GeneralService } from '../services/general.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { LedgerVM } from '../ledger/ledger.vm';
import { SalesOtherTaxesModal } from '../models/api-models/Sales';
import { UpdateLedgerEntryPanelComponent } from '../ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component';
import { DaybookService } from '../services/daybook.service';
import { ToasterService } from '../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { LedgerService } from '../services/ledger.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';

@Component({
    selector: 'daybook',
    templateUrl: './daybook.component.html',
    styleUrls: [`./daybook.component.scss`],
    standalone:false
})

export class DaybookComponent implements OnInit, OnDestroy {
    public companyName: string;
    /** True, If loader is working */
    public showLoader: boolean = false;
    public isAllExpanded: boolean = false;
    public daybookQueryRequest: DaybookQueryRequest;
    public daybookExportRequestType: 'get' | 'post';
    /** Page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** True, If advance search applied */
    public showAdvanceSearchIcon: boolean = false;
    @ViewChild('advanceSearchModal', { static: true }) public advanceSearchModal: any;
    @ViewChild('exportDaybookModal', { static: true }) public exportDaybookModal: any;
    @ViewChild('dateRangePickerCmp', { read: DaterangePickerComponent, static: false }) public dateRangePickerCmp: DaterangePickerComponent;
    /** Update ledger modal reference */
    @ViewChild('updateLedgerModal', { static: false }) public updateLedgerModal: any;
    /** Update ledger component reference */
    @ViewChild(UpdateLedgerEntryPanelComponent, { static: false }) public updateLedgerComponent: UpdateLedgerEntryPanelComponent;
    /** Instance of Aside Menu State For Other Taxes dialog */
    @ViewChild("asideMenuStateForOtherTaxes") public asideMenuStateForOtherTaxes: TemplateRef<any>;
    /** True, if entry expanded (at least one entry) */
    public isEntryExpanded: boolean = false;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private searchFilterData: any = null;
    /** This will hold the daybook api response */
    public daybookData: any = {};
    /** This will hold if today is selected in universal */
    public todaySelected: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Ledger object */
    public lc: LedgerVM;
    /** Company taxes list */
    public companyTaxesList: TaxResponse[] = [];
    /** True if initial api got called */
    public initialApiCalled: boolean = false;
    /** Table columns for daybook report */
    public tableColumns: string[] = ['entry_date', 'particular', 'voucher_name', 'voucher_no', 'debit_amount', 'credit_amount'];
    /** Table columns for daybook report in expanded mode */
    public tableAllColumns: string[] = ['entry_date', 'particular', 'voucher_name', 'voucher_no', 'debit_amount', 'credit_amount', 'product_service', 'quantity', 'unit', 'rate', 'hsn_sac', 'sku', 'warehouse'];
    /** Sub Table columns for daybook report in expanded mode */
    public tableExpandedColumns: string[] = ['expanded_entry_date', 'expanded_particular', 'expanded_voucher_name', 'expanded_voucher_no', 'expanded_debit_amount', 'expanded_credit_amount'];
    /** Sub Table all columns for daybook report in expanded mode */
    public tableExpandedAllColumns: string[] = ['expanded_entry_date', 'expanded_particular', 'expanded_voucher_name', 'expanded_voucher_no', 'expanded_debit_amount', 'expanded_credit_amount', 'expanded_product_service', 'expanded_quantity', 'expanded_unit', 'expanded_rate', 'expanded_hsn_sac', 'expanded_sku', 'expanded_warehouse'];
    /** Instance of modal */
    public modalDialogRef: any;
    /** Last touched transaction (for ipad and tablet) */
    public touchedTransaction: any;
    /** Holds side of entry (dr/cr) */
    public entrySide: string = "";
    /** Holds Aside Menu State For Other Taxes DialogRef */
    public asideMenuStateForOtherTaxesDialogRef: any;
    /** Ledger aside pan modal */
    private ledgerAsidePaneModal: any;
    /** Instance of ledger aside pane modal */
    @ViewChild("ledgerAsidePane") public ledgerAsidePane: TemplateRef<any>;
    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        let hasParticularSelected = this.lc.blankLedger.transactions?.filter(txn => txn?.particular);
        return (hasParticularSelected?.length) ? true : false;
    }
    /** This will hold the file type extension for expand */
    public fileTypeExtension: string = 'base64';
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private companyActions: CompanyActions,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private ledgerActions: LedgerActions,
        private daybookService: DaybookService,
        private toasterService: ToasterService,
        private dialog: MatDialog,
        private ledgerService: LedgerService,
        private router: Router,
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) {

        this.daybookQueryRequest = new DaybookQueryRequest();
        this.showAdvanceSearchIcon = false;
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.lc = new LedgerVM();
        this.currentOrganizationType = this.generalService.currentOrganizationType;

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
                if (!this.currentBranch || !this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
                this.daybookQueryRequest.branchUniqueName = (this.currentBranch) ? this.currentBranch?.uniqueName : "";
                if (!this.initialApiCalled) {
                    this.initialApiCalled = true;
                    this.initialRequest();
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        // get company taxes
        this.getCompanyTaxes();
    }

    public selectedDate(value: any) {
        let from = dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        let to = dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        if ((this.daybookQueryRequest.from !== from) || (this.daybookQueryRequest.to !== to)) {
            this.daybookQueryRequest.from = from;
            this.daybookQueryRequest.to = to;
            this.daybookQueryRequest.page = 0;
            this.getDaybook();
        }
    }

    public onOpenAdvanceSearch() {
        this.modalDialogRef = this.dialog.open(this.advanceSearchModal, {
            maxWidth: '1000px'
        });
    }

    /**
     * if closing triggers from advance search filter
     * @param obj contains search params
     */
    public closeAdvanceSearchPopup(reqObj: any): void {
        if (!reqObj.cancle) {
            this.searchFilterData = cloneDeep(reqObj.dataToSend);
            if (this.dateRangePickerCmp) {
                this.dateRangePickerCmp.render();
            }
            this.daybookQueryRequest.from = (reqObj.fromDate) ? reqObj.fromDate : this.todaySelected ? '' : this.daybookQueryRequest.from;
            this.daybookQueryRequest.to = (reqObj.toDate) ? reqObj.toDate : this.todaySelected ? '' : this.daybookQueryRequest.to;
            this.daybookQueryRequest.page = 0;
            if (reqObj.action === 'search') {
                this.modalDialogRef.close();
                this.getDaybook(this.searchFilterData);
                this.showAdvanceSearchIcon = true;
            } else if (reqObj.action === 'export') {
                this.exportDaybook();
            }
        } else {
            this.modalDialogRef.close();
        }
    }

    /**
     * Fetching the daybook records
     *
     * @param {*} [withFilters=null]
     * @memberof DaybookComponent
     */
    public getDaybook(withFilters: DayBookRequestModel = null): void {
        this.showLoader = true;
        let daybookRequest = cloneDeep(withFilters);
        if (withFilters) {
            delete daybookRequest.defaultVouchersLabel;
            delete daybookRequest.defaultTagsLabel;
            delete daybookRequest.defaultParticularsLabel;
            delete daybookRequest.inventory.defaultInventoriesLabel;
        }
        this.daybookService.GetDaybook(daybookRequest, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body?.entries?.length > 0) {
                    this.daybookQueryRequest.page = response?.body?.page;
                    response?.body?.entries.map(item => {
                        item.isExpanded = this.isAllExpanded;
                    });

                    this.daybookData = response?.body;
                    this.checkIsStockEntryAvailable();
                } else {
                    this.daybookData = { entries: [], totalItems: 0, page: 0 };
                }
                if (this.todaySelected) {
                    this.daybookQueryRequest.from = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.daybookQueryRequest.to = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

                    this.fromDate = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.selectedDateRange = { startDate: dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT), endDate: dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT) };
                    this.selectedDateRangeUi = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                }

            } else {
                if (response?.message) {
                    this.daybookData = { entries: [], totalItems: 0, page: 0 };
                    this.toasterService.showSnackBar("error", response?.message);
                } else {
                    this.daybookData = response?.body;
                }
            }
            this.showLoader = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    public toggleExpand() {
        this.isAllExpanded = !this.isAllExpanded;
        if (this.daybookData) {
            this.daybookData.entries?.map(entry => {
                entry.isExpanded = this.isAllExpanded;
                return entry;
            });
        }
        this.checkIsStockEntryAvailable();
    }

    public initialRequest() {
        this.searchFilterData = null;
        this.showAdvanceSearchIcon = false;

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);

                this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                    this.todaySelected = response;

                    if (!this.todaySelected) {
                        this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                        this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                        this.daybookQueryRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.daybookQueryRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    } else {
                        this.daybookQueryRequest.from = "";
                        this.daybookQueryRequest.to = "";
                    }
                    this.daybookQueryRequest.page = 0;
                    this.getDaybook();
                });
            }
        });
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof DaybookComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.daybookQueryRequest.page = this.daybookData.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.daybookQueryRequest.count = event.pageSize;
        this.getDaybook(this.searchFilterData);
    }

    public exportDaybook() {
        this.daybookExportRequestType = 'post';
        this.modalDialogRef = this.dialog.open(this.exportDaybookModal, {
                    width: '630px',
                });
    }

    public hideExportDaybookModal(response: any) {
        this.modalDialogRef.close();
        if (response !== 'close') {
            if ((response.type === 'admin-detailed' || response.type === 'view-detailed') || (response.type === 'admin-condensed' || response.type === 'view-condensed')) {
                this.daybookQueryRequest.type = response.type;
                this.daybookQueryRequest.format = response.fileType;
                this.daybookQueryRequest.sort = response.order;
                if (this.daybookExportRequestType === 'post') {
                    if (response.fileType === "csv") {
                        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
                        exportBodyRequest.from = this.daybookQueryRequest.from;
                        exportBodyRequest.to = this.daybookQueryRequest.to;
                        exportBodyRequest.exportType = "DAYBOOK";
                        exportBodyRequest.showVoucherNumber = response.showVoucherNumber;
                        exportBodyRequest.showEntryVoucher = response.showEntryVoucher;
                        exportBodyRequest.sort = response.order?.toUpperCase();
                        exportBodyRequest.fileType = "CSV";
                        exportBodyRequest.tagNames = this.searchFilterData?.tags;
                        exportBodyRequest.includeTag = this.searchFilterData?.includeTag;
                        this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                            if (response?.status === 'success') {
                                if (typeof response?.body === "string") {
                                    this.toasterService.showSnackBar("success", response?.body);
                                    this.router.navigate(["/pages/downloads"]);
                                } else {
                                    let blob = this.generalService.base64ToBlob(response?.body?.encodedData, response?.queryString?.requestType, 512);
                                    saveAs(blob, response?.body?.name);
                                }
                            } else {
                                this.toasterService.showSnackBar("error", response?.message);
                            }
                        });
                    } else {
                        this.daybookService.ExportDaybookPost(this.searchFilterData, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                            if (response?.status === 'success') {
                                if (response?.body?.type === "message") {
                                    this.toasterService.showSnackBar("success", response?.body?.file);
                                } else {
                                    let blob = this.generalService.base64ToBlob(response?.body?.data, response?.queryString?.requestType, 512);
                                    saveAs(blob, response?.body?.name);
                                }
                            } else {
                                this.toasterService.showSnackBar("error", response?.message);
                            }
                        });
                    }
                } else if (this.daybookExportRequestType === 'get') {
                    this.daybookService.ExportDaybook(null, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                        if (response?.status === 'success') {
                            if (response?.body?.type === "message") {
                                this.toasterService.showSnackBar("success", response?.body?.file);
                            } else {
                                let blob = this.generalService.base64ToBlob(response?.body?.data, response?.queryString?.requestType, 512);
                                saveAs(blob, response?.body?.name);
                            }
                        } else {
                            this.toasterService.showSnackBar("error", response?.message);
                        }
                    });
                }
            } else {
                // for expanded option download
                let exportBodyRequestObj: ExportBodyRequest = new ExportBodyRequest();
                exportBodyRequestObj.from = this.daybookQueryRequest.from;
                exportBodyRequestObj.to = this.daybookQueryRequest.to;
                exportBodyRequestObj.fileType = this.fileTypeExtension;
                exportBodyRequestObj.exportType = "ENTRIES_EXPORT";
                let branchUniqueName = this.generalService.currentBranchUniqueName ? this.generalService.currentBranchUniqueName : this.currentBranch ? this.currentBranch?.uniqueName : "";
                this.daybookService.exportDaybookExpandedPost(exportBodyRequestObj, branchUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success') {
                        if (typeof response?.body === "string") {
                            this.toasterService.showSnackBar("success", response?.body);
                            this.router.navigate(["/pages/downloads"]);
                        } else {
                            let blob = this.generalService.base64ToBlob(response?.body?.encodedData, response?.queryString?.requestType, 512);
                            saveAs(blob, response?.body?.name);
                        }
                    } else {
                        this.toasterService.showSnackBar("error", response?.message);
                    }
                });
            }
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To check is entry expanded
     *
     * @param {*} entry Transaction object
     * @memberof DaybookComponent
     */
    public expandEntry(entry: any): any {
        setTimeout(() => {
            let isInventory: boolean = false;
            entry.isExpanded = !entry.isExpanded;
            if (entry && entry.otherTransactions) {
                isInventory = entry.otherTransactions.some(otherTrasaction => {
                    if (otherTrasaction && otherTrasaction.inventory) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            if (isInventory && entry.isExpanded) {
                this.isEntryExpanded = true;
            } else if (isInventory && !entry.isExpanded) {
                this.checkIsStockEntryAvailable();
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     *To check is there any stock entry available
     *
     * @memberof DaybookComponent
     */
    public checkIsStockEntryAvailable(): any {
        if (this.daybookData) {
            this.isEntryExpanded = this.daybookData.entries.some(entry => {
                if (entry.isExpanded && entry.otherTransactions) {
                    return entry.otherTransactions.some(otherTrasaction => {
                        if (otherTrasaction && otherTrasaction.inventory) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                };
            });
        }
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof DaybookComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * This will hide the datepicker
     *
     * @memberof DaybookComponent
     */

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof DaybookComponent
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
        this.todaySelected = false;
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);

            this.daybookQueryRequest.from = this.fromDate;
            this.daybookQueryRequest.to = this.toDate;
            this.daybookQueryRequest.page = 0;
            this.getDaybook(this.searchFilterData);
        }
    }

    /**
     * Branch change handler
     *
     * @memberof DaybookComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.daybookQueryRequest.branchUniqueName = selectedEntity?.value;
        this.getDaybook();
    }

    /**
     * This will show update ledger modal
     *
     * @param {*} txn
     * @memberof DaybookComponent
     */
    public showUpdateLedgerModal(txn: any): void {
        if (txn.creditAmount === null) {
            this.entrySide = "dr";
        } else {
            this.entrySide = "cr";
        }
        this.store.dispatch(this.ledgerActions.setAccountForEdit(txn?.otherTransactions[0]?.particular?.uniqueName));
        this.store.dispatch(this.ledgerActions.setTxnForEdit(txn?.uniqueName));
        this.lc.selectedTxnUniqueName = txn?.uniqueName;
        this.modalDialogRef = this.dialog.open(this.updateLedgerModal, {
                    width: '70%',
                    disableClose: true
                });

        this.modalDialogRef.afterOpened().subscribe(response => {
            this.updateLedgerComponent?.loadDefaultSearchSuggestions();
        });

        this.modalDialogRef.afterClosed().subscribe(response => {
            document.querySelector('body').classList.remove('update-ledger-overlay');
            this.getDaybook(this.searchFilterData);
        });

        document.querySelector('body').classList.add('update-ledger-overlay');
    }

    /**
     * Toggle's other taxes aside pan
     *
     * @memberof DaybookComponent
     */
    public toggleOtherTaxesAsidePane(): void {
        this.asideMenuStateForOtherTaxesDialogRef = this.dialog.open(this.asideMenuStateForOtherTaxes, ASIDE_PANE_CONFIG)
    }

    /**
     * Hide's update ledger modal
     *
     * @memberof DaybookComponent
     */
    public hideUpdateLedgerModal(): void {
        this.modalDialogRef.close();
    }

    /**
     * Calculate's other taxes
     *
     * @param {SalesOtherTaxesModal} modal
     * @memberof DaybookComponent
     */
    public calculateOtherTaxes(modal: SalesOtherTaxesModal): void {
        this.updateLedgerComponent.vm.calculateOtherTaxes(modal);
    }

    /**
     * Fetching the company taxes list
     *
     * @private
     * @memberof DaybookComponent
     */
    private getCompanyTaxes(): void {
        this.store.dispatch(this.companyActions.getTax());
        this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });
    }

    /**
     * This will keep the track of touch event and will check if double clicked on any transaction, it will open the update ledger modal
     *
     * @param {any} txn
     * @memberof DaybookComponent
     */
    public showUpdateLedgerModalIpad(txn: any): void {
        if (this.touchedTransaction?.uniqueName === txn?.uniqueName) {
            this.showUpdateLedgerModal(txn);
        } else {
            this.touchedTransaction = txn;
        }

        setTimeout(() => {
            this.touchedTransaction = {};
        }, 200);
    }

    /**
     * This will be use for toggle aside pan from daybook
     *
     * @param {*} [event]
     * @memberof DaybookComponent
     */
    public toggleAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.ledgerAsidePaneModal = this.dialog.open(this.ledgerAsidePane, ASIDE_PANE_CONFIG);
        this.ledgerAsidePaneModal.afterClosed().subscribe(response => {
            setTimeout(() => {
                if (this.showPageLeaveConfirmation) {
                    this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                }
            }, 100);
        });

        this.changeDetectorRef.detectChanges();
    }
}
