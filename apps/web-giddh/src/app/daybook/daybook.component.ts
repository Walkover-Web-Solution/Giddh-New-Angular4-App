import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as moment from 'moment/moment';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest, TaxResponse } from '../models/api-models/Company';
import { DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { DaterangePickerComponent } from '../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { DaybookAdvanceSearchModelComponent } from './advance-search/daybook-advance-search.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { GeneralService } from '../services/general.service';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../models/user-login-state';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { LedgerVM } from '../ledger/ledger.vm';
import { SalesOtherTaxesModal } from '../models/api-models/Sales';
import { UpdateLedgerEntryPanelComponent } from '../ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DaybookService } from '../services/daybook.service';
import { ToasterService } from '../services/toaster.service';

@Component({
    selector: 'daybook',
    templateUrl: './daybook.component.html',
    styleUrls: [`./daybook.component.scss`],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class DaybookComponent implements OnInit, OnDestroy {
    public companyName: string;
    /** True, If loader is working */
    public showLoader: boolean = false;
    public isAllExpanded: boolean = false;
    public daybookQueryRequest: DaybookQueryRequest;
    public daybookExportRequestType: 'get' | 'post';
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** True, If advance search applied */
    public showAdvanceSearchIcon: boolean = false;
    @ViewChild('advanceSearchModel', { static: true }) public advanceSearchModel: ModalDirective;
    @ViewChild('exportDaybookModal', { static: true }) public exportDaybookModal: ModalDirective;
    @ViewChild('dateRangePickerCmp', { read: DaterangePickerComponent, static: false }) public dateRangePickerCmp: DaterangePickerComponent;
    /** Daybook advance search component reference */
    @ViewChild('daybookAdvanceSearch', { static: false }) public daybookAdvanceSearchModelComponent: DaybookAdvanceSearchModelComponent;
    /** Update ledger modal reference */
    @ViewChild('updateLedgerModal', { static: false }) public updateLedgerModal: ModalDirective;
    /** Update ledger component reference */
    @ViewChild(UpdateLedgerEntryPanelComponent, { static: false }) public updateLedgerComponent: UpdateLedgerEntryPanelComponent;
    /** True, if entry expanded (at least one entry) */
    public isEntryExpanded: boolean = false;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Moment object */
    public moment = moment;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
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
    /** Set to true the first time advance search modal is opened, done
     * to prevent the API call only when the advance search filter is opened
     * by user and not when the user visits the page
     */
    public isAdvanceSearchOpened: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    // aside menu properties
    public asideMenuStateForOtherTaxes: string = 'out';
    // aside menu properties
    public asideMenuState: string = 'out';
    /** Ledger object */
    public lc: LedgerVM;
    /** Company taxes list */
    public companyTaxesList: TaxResponse[] = [];
    /** True if initial api got called */
    public initialApiCalled: boolean = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private companyActions: CompanyActions,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private settingsBranchAction: SettingsBranchActions,
        private ledgerActions: LedgerActions,
        private daybookService: DaybookService,
        private toasterService: ToasterService
    ) {

        this.daybookQueryRequest = new DaybookQueryRequest();
        this.showAdvanceSearchIcon = false;
        if (this.daybookAdvanceSearchModelComponent) {
            this.daybookAdvanceSearchModelComponent.advanceSearchForm.reset();
            this.daybookAdvanceSearchModelComponent.resetShselectForceClear();
            this.daybookAdvanceSearchModelComponent.initializeDaybookAdvanceSearchForm();
            this.searchFilterData = null;
        }

        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.lc = new LedgerVM();
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'daybook';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this.store.pipe(
            select(appState => appState.session.activeCompany), take(1)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
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
                if (!this.currentBranch || !this.currentBranch.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                }
                this.daybookQueryRequest.branchUniqueName = (this.currentBranch) ? this.currentBranch.uniqueName : "";
                if (!this.initialApiCalled) {
                    this.initialApiCalled = true;
                    this.initialRequest();
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });

        // get company taxes
        this.getCompanyTaxes();
    }

    public selectedDate(value: any) {
        let from = moment(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        let to = moment(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        if ((this.daybookQueryRequest.from !== from) || (this.daybookQueryRequest.to !== to)) {
            this.daybookQueryRequest.from = from;
            this.daybookQueryRequest.to = to;
            this.daybookQueryRequest.page = 0;
            this.getDaybook();
        }
    }

    public onOpenAdvanceSearch() {
        if (!this.isAdvanceSearchOpened) {
            this.isAdvanceSearchOpened = true;
        }
        if (!this.showAdvanceSearchIcon && this.daybookAdvanceSearchModelComponent) {
            // Reset the advance search form if filters are not already applied and the user
            // clicks on advance search
            this.daybookAdvanceSearchModelComponent.advanceSearchForm.reset();
            this.daybookAdvanceSearchModelComponent.resetShselectForceClear();
            this.daybookAdvanceSearchModelComponent.initializeDaybookAdvanceSearchForm();
            this.searchFilterData = null;
        }
        this.advanceSearchModel.show();
    }

    /**
     * if closing triggers from advance search filter
     * @param obj contains search params
     */
    public closeAdvanceSearchPopup(obj) {
        this.searchFilterData = null;
        if (!obj.cancle) {
            this.searchFilterData = cloneDeep(obj.dataToSend);
            if (this.dateRangePickerCmp) {
                this.dateRangePickerCmp.render();
            }
            this.daybookQueryRequest.from = (obj.fromDate) ? obj.fromDate : this.todaySelected ? '' : this.daybookQueryRequest.from;
            this.daybookQueryRequest.to = (obj.toDate) ? obj.toDate : this.todaySelected ? '' : this.daybookQueryRequest.to;
            this.daybookQueryRequest.page = 0;
            if (obj.action === 'search') {
                this.advanceSearchModel.hide();
                this.getDaybook(this.searchFilterData);
                this.showAdvanceSearchIcon = true;
            } else if (obj.action === 'export') {
                this.daybookExportRequestType = 'post';
                this.exportDaybookModal.show();
            }
        } else {
            this.advanceSearchModel.hide();
        }
    }

    /**
     * Fetching the daybook records
     *
     * @param {*} [withFilters=null]
     * @memberof DaybookComponent
     */
    public getDaybook(withFilters = null): void {
        this.showLoader = true;
        this.daybookService.GetDaybook(withFilters, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.entries?.length > 0) {
                this.daybookQueryRequest.page = response?.body?.page;
                response?.body?.entries.map(item => {
                    item.isExpanded = this.isAllExpanded;
                });

                if (this.todaySelected) {
                    this.daybookQueryRequest.from = moment(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.daybookQueryRequest.to = moment(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

                    this.selectedDateRange = { startDate: moment(response?.body?.fromDate, GIDDH_DATE_FORMAT), endDate: moment(response?.body?.toDate, GIDDH_DATE_FORMAT) };
                    this.selectedDateRangeUi = moment(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = moment(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.toDate = moment(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }

                this.daybookData = response?.body;
                this.checkIsStockEntryAvailable();
            } else {
                this.toasterService.clearAllToaster();
                this.toasterService.errorToast(response?.message);
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
        this.showAdvanceSearchIcon = false;
        if (this.daybookAdvanceSearchModelComponent) {
            this.daybookAdvanceSearchModelComponent.advanceSearchForm.reset();
            this.daybookAdvanceSearchModelComponent.resetShselectForceClear();
            this.daybookAdvanceSearchModelComponent.initializeDaybookAdvanceSearchForm();
            this.searchFilterData = null;
        }

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);

                this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                    this.todaySelected = response;
                    if (!response) {
                        this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                        this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                        this.daybookQueryRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.daybookQueryRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
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

    public pageChanged(event: any): void {
        if (this.daybookQueryRequest.page !== event.page) {
            this.daybookQueryRequest.page = event.page;
            this.getDaybook(this.searchFilterData);
        }
    }

    public exportDaybook() {
        this.daybookExportRequestType = 'post';
        this.exportDaybookModal.show();
    }

    public hideExportDaybookModal(response: any) {
        this.exportDaybookModal.hide();
        if (response !== 'close') {
            this.daybookQueryRequest.type = response.type;
            this.daybookQueryRequest.format = response.fileType;
            this.daybookQueryRequest.sort = response.order;
            if (this.daybookExportRequestType === 'post') {
                this.daybookService.ExportDaybookPost(this.searchFilterData, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success') {
                        if (response?.body?.type === "message") {
                            this.toasterService.successToast(response?.body?.file);
                        } else {
                            let blob = this.generalService.base64ToBlob(response?.body?.file, response?.queryString?.requestType, 512);
                            let type = response?.queryString?.requestType === 'application/pdf' ? '.pdf' : '.xls';
                            saveAs(blob, 'response' + type);
                        }
                    } else {
                        this.toasterService.clearAllToaster();
                        this.toasterService.errorToast(response?.message);
                    }
                });
            } else if (this.daybookExportRequestType === 'get') {
                this.daybookService.ExportDaybook(null, this.daybookQueryRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === 'success') {
                        if (response?.body?.type === "message") {
                            this.toasterService.successToast(response?.body?.file);
                        } else {
                            let blob = this.generalService.base64ToBlob(response?.body?.file, response?.queryString?.requestType, 512);
                            let type = response?.queryString?.requestType === 'application/pdf' ? '.pdf' : '.xls';
                            saveAs(blob, 'response' + type);
                        }
                    } else {
                        this.toasterService.clearAllToaster();
                        this.toasterService.errorToast(response?.message);
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
    public expandEntry(entry): any {
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
     * @memberof DaybookComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof DaybookComponent
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
        this.todaySelected = false;
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            if ((this.daybookQueryRequest.from !== this.fromDate) || (this.daybookQueryRequest.to !== this.toDate)) {
                this.daybookQueryRequest.from = this.fromDate;
                this.daybookQueryRequest.to = this.toDate;
                this.daybookQueryRequest.page = 0;
                this.getDaybook(this.searchFilterData);
            }
        }
    }

    /**
     * Branch change handler
     *
     * @memberof DaybookComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.daybookQueryRequest.branchUniqueName = selectedEntity.value;
        this.getDaybook();
    }

    /**
     * This will show update ledger modal
     *
     * @param {*} txn
     * @memberof DaybookComponent
     */
    public showUpdateLedgerModal(txn: any): void {
        this.store.dispatch(this.ledgerActions.setAccountForEdit(txn?.otherTransactions[0]?.particular?.uniqueName));
        this.store.dispatch(this.ledgerActions.setTxnForEdit(txn.uniqueName));
        this.lc.selectedTxnUniqueName = txn.uniqueName;
        this.updateLedgerModal.show();
        document.querySelector('body').classList.add('update-ledger-overlay');

        setTimeout(() => {
            this.updateLedgerComponent.loadDefaultSearchSuggestions();
        }, 20);
    }

    /**
     * Toggle's other taxes aside pan
     *
     * @memberof DaybookComponent
     */
    public toggleOtherTaxesAsidePane(): void {
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Toggle's fixed class in body
     *
     * @memberof DaybookComponent
     */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Hide's update ledger modal
     *
     * @memberof DaybookComponent
     */
    public hideUpdateLedgerModal(): void {
        this.updateLedgerModal.hide();
        document.querySelector('body').classList.remove('update-ledger-overlay');
        this.getDaybook(this.searchFilterData);
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
        this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });
    }
}
