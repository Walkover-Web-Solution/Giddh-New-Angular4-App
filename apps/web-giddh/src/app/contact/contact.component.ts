import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { saveAs } from 'file-saver';
import * as moment from 'moment/moment';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { createSelector } from 'reselect';
import { combineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { cloneDeep, find, forEach, map as lodashMap, uniq } from '../../app/lodash-optimized';
import { CommonActions } from '../actions/common.actions';
import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { PAGINATION_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { OnboardingFormRequest } from '../models/api-models/Common';
import { StateDetailsRequest } from '../models/api-models/Company';
import {
    ContactAdvanceSearchCommonModal,
    ContactAdvanceSearchModal,
    CustomerVendorFiledFilter,
    DueAmountReportQueryRequest,
    DueAmountReportResponse,
} from '../models/api-models/Contact';
import { BulkEmailRequest } from '../models/api-models/Search';
import { CashfreeClass } from '../models/api-models/SettingsIntegraion';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { CompanyService } from '../services/companyService.service';
import { ContactService } from '../services/contact.service';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../store';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './../shared/helpers/defaultDateFormat';
import { GroupService } from '../services/group.service';

export interface PayNowRequest {
    accountUniqueName: string;
    amount: number;
    description: string;
}

@Component({
    selector: 'contact-detail',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
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

export class ContactComponent implements OnInit, OnDestroy {
    /** Stores the current range of date picker */
    public selectedDateRange: any;
    public selectedDateRangeUi: any;
    public flattenAccounts: any = [];
    public sundryDebtorsAccountsBackup: any = {};
    public sundryDebtorsAccountsForAgingReport: IOption[] = [];
    public sundryDebtorsAccounts$: Observable<any>;
    public sundryDebtorsAccounts: any[] = [];
    public sundryCreditorsAccountsBackup: any = {};
    public sundryCreditorsAccounts$: Observable<any>;
    public sundryCreditorsAccounts: any[] = [];
    public activeTab: any = '';
    public groupUniqueName: any;
    public accountAsideMenuState: string = 'out';
    public paymentAsideMenuState: string = 'out';
    public selectedAccForPayment: any;
    public dueAmountReportRequest: DueAmountReportQueryRequest;
    public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
    public cashFreeAvailableBalance: number;
    public payoutForm: CashfreeClass;
    public bankAccounts$: Observable<IOption[]>;
    public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
    public payoutObj: CashfreeClass = new CashfreeClass();
    public dueAmountReportData$: Observable<DueAmountReportResponse>;
    public moment = moment;
    public toDate: string;
    public fromDate: string;
    public selectAllVendor: boolean = false;
    public selectAllCustomer: boolean = false;
    public selectedCheckedContacts: string[] = [];
    public activeAccountDetails: any;
    public allSelectionModel: boolean = false;
    public LOCAL_STORAGE_KEY_FOR_TABLE_COLUMN = 'showTableColumn';
    public localStorageKeysForFilters = { customer: 'customerFilterStorage', vendor: 'vendorFilterStorage' };
    public isMobileScreen: boolean = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public isICICIIntegrated: boolean = false;

    public selectedWhileHovering: string;
    public searchLoader$: Observable<boolean>;
    // sorting
    public key: string = 'name'; // set default
    public order: string = 'asc';

    public showFieldFilter: CustomerVendorFiledFilter = new CustomerVendorFiledFilter();
    public updateCommentIdx: number = null;
    public searchStr$ = new Subject<string>();
    public searchStr: string = '';
    @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
    @ViewChild('paginationChild', {static: true}) public paginationChild: ElementViewContainerRef;
    @ViewChild('staticTabs', {static: true}) public staticTabs: TabsetComponent;
    @ViewChild('mailModal', {static: false}) public mailModal: ModalDirective;
    @ViewChild('messageBox', {static: false}) public messageBox: ElementRef;
    @ViewChild('advanceSearch', {static: true}) public advanceSearch: ModalDirective;
    @ViewChild('datepickerTemplate', {static: true}) public datepickerTemplate: ElementRef;

    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public universalDate$: Observable<any>;
    public messageBody = {
        header: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: ''
        },
        btn: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: '',
        },
        type: '',
        msg: '',
        subject: ''
    };
    public dataVariables = [
        {
            name: 'Opening Balance',
            value: '%s_OB',
        },
        {
            name: 'Closing Balance',
            value: '%s_CB',
        },
        {
            name: 'Credit Total',
            value: '%s_CT',
        },
        {
            name: 'Debit Total',
            value: '%s_DT',
        },
        {
            name: 'From Date',
            value: '%s_FD',
        },
        {
            name: 'To Date',
            value: '%s_TD',
        },
        {
            name: 'Magic Link',
            value: '%s_ML',
        },
        {
            name: 'Account Name',
            value: '%s_AN',
        },
    ];
    public selectedItems: string[] = [];
    public totalSales: number = 0;
    public totalDue: number = 0;
    public totalReceipts: number = 0;
    public Totalcontacts = 0;
    public accInfo: IFlattenAccountsResultItem;
    public purchaseOrSales: 'sales' | 'purchase';
    public accountUniqueName: string;
    public isUpdateAccount: boolean = false;
    public isAdvanceSearchApplied: boolean = false;
    public advanceSearchRequestModal: ContactAdvanceSearchModal = new ContactAdvanceSearchModal();
    public commonRequest: ContactAdvanceSearchCommonModal = new ContactAdvanceSearchCommonModal();
    public tableColsPan: number = 3;
    /** True, if company country's taxation is supported in Giddh */
    public shouldShowTaxFilter: boolean;
    /** true if bulk payment model need to open */
    public isBulkPaymentShow: boolean = false;
    /** selected account list array */
    public selectedAccountsList: any[] = [];
    /**pagination count */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Giddh decimal places set by user */
    public giddhDecimalPlaces = 2;

    private checkboxInfo: any = {
        selectedPage: 1
    };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private createAccountIsSuccess$: Observable<boolean>;
    /** Selected company */
    private selectedCompany: any;
    public universalDate: any;
    /** model reference to open/close bulk payment model */
    public bulkPaymentModalRef: BsModalRef;
    public modalRef: BsModalRef;
    public selectedRangeLabel: any = "";
    public dateFieldPosition: any = { x: 0, y: 0 };
    /**True, if get accounts request in process */
    public isGetAccountsInProcess: boolean = false;
    /* This will hold the current page number */
    public currentPage: number = 1;
    /** company custom fields list */
    public companyCustomFields$: Observable<any[]>;
    /** Column span length */
    public colspanLength: number = 11;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private _companyServices: CompanyService,
        private commonActions: CommonActions,
        private _toaster: ToasterService,
        private _contactService: ContactService,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private _companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _groupWithAccountsAction: GroupWithAccountsAction,
        private _cdRef: ChangeDetectorRef, private _generalService: GeneralService,
        private _route: ActivatedRoute, private _generalAction: GeneralActions,
        private _breakPointObservar: BreakpointObserver, private modalService: BsModalService,
        private settingsProfileActions: SettingsProfileActions,  private groupService: GroupService) {
        this.searchLoader$ = this.store.pipe(select(p => p.search.searchLoader), takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.agingreport.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.dueAmountReportRequest.page = data.page;
                this.loadPaginationComponent(data);
            }
            this.dueAmountReportData$ = observableOf(data);
        });
        this.store.pipe(select(appState => {
            if (!appState.session.companies) {
                return;
            }
            this.selectedCompany = appState.session.companies.find((company) => company.uniqueName === appState.session.companyUniqueName);
        }), takeUntil(this.destroyed$)).subscribe();
        this.store.dispatch(this._companyActions.getAllRegistrations());
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.getCompanyCustomField();
    }

    /**
     * To open bulk payment model
     *
     * @param {TemplateRef<any>} template template/model hash reference
     * @memberof ContactComponent
     */
    public openBulkPaymentModal(template: TemplateRef<any>, item?: any): void {
        this.isBulkPaymentShow = true;
        this.selectedAccForPayment = null;
        if (this.selectedAccountsList.length) {
            this.selectedAccountsList = this.selectedAccountsList.filter(itemObject => {
                return itemObject.bankPaymentDetails === true;
            });
            this.selectedAccountsList = this.selectedAccountsList.filter((data, index) => {
                return this.selectedAccountsList.indexOf(data) === index;
            });
        }
        if (!this.selectedAccountsList.length && item) {
            if (item.bankPaymentDetails) {
                this.selectedAccForPayment = item;
            }
        }
        if (this.selectedAccountsList.length < this.selectedCheckedContacts.length) {
            this._toaster.infoToast(`${this.selectedCheckedContacts.length - this.selectedAccountsList.length} out of ${this.selectedCheckedContacts.length} transactions could not be processed as bank details of those accounts are not updated.`);
        }
        if (this.selectedAccountsList.length || this.selectedAccForPayment) {
            this.bulkPaymentModalRef = this.modalService.show(template,
                Object.assign({}, { class: 'payment-modal modal-xl' })
            );
        }
    }

    public sort(key, ord = 'asc') {
        this.key = key;
        this.order = ord;

        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
            null, 'false', PAGINATION_LIMIT, this.searchStr, key, ord);
    }

    public ngOnInit() {
        // localStorage supported
        if (window.localStorage) {
            let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
            if (showColumnObj) {
                if (showColumnObj.closingBalance !== undefined) {
                    delete showColumnObj.closingBalance;
                };
                this.showFieldFilter = showColumnObj;
                this.setTableColspan();
            }
        }

        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(this.universalDate[0]), endDate: moment(this.universalDate[1]) };
                this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
            }
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                    this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
                }
            }
        });

        this.flattenAccountsStream$.subscribe(data => {

            if (data) {
                let accounts: IOption[] = [];
                let bankAccounts: IOption[] = [];
                forEach(data, (item) => {
                    accounts.push({ label: item.name, value: item.uniqueName });
                    let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts');
                    if (findBankIndx !== -1) {
                        bankAccounts.push({ label: item.name, value: item.uniqueName });
                    }
                });
                this.bankAccounts$ = observableOf(accounts);
            }
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((term: any) => {
                this.searchStr = term;
                if (this.activeTab === 'customer') {
                    this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, 'true', PAGINATION_LIMIT, term, this.key, this.order);
                } else {
                    this.getAccounts(this.fromDate, this.toDate, 'sundrycreditors', null, 'true', PAGINATION_LIMIT, term, this.key, this.order);
                }
            });

        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        combineLatest([this._route.params, this._route.queryParams])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                let params = result[0];
                let queryParams = result[1];

                if (params) {
                    if ((params['type'] && params['type'].indexOf('customer') > -1) || (queryParams && queryParams.tab && queryParams.tab === "customer")) {
                        this.setActiveTab("customer", 'sundrydebtors');
                    } else if ((params['type'] && params['type'].indexOf('vendor') > -1) || (queryParams && queryParams.tab && queryParams.tab === "vendor")) {
                        this.setActiveTab("vendor", 'sundrycreditors');
                    } else {
                        this.setActiveTab('aging-report', '');
                    }
                }
            });

        this.store
            .pipe(
                select(p => p.company.account), takeUntil(this.destroyed$)
            )
            .subscribe(res => {
                if (res && Array.isArray(res)) {
                    this.isICICIIntegrated = res.length > 0;
                } else {
                    this.isICICIIntegrated = false;
                }
            });
        if (this.selectedCompany && this.selectedCompany.countryV2) {
            this.getOnboardingForm(this.selectedCompany.countryV2.alpha2CountryCode);
        }
        this.store.pipe(select(store => store.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.balanceDecimalPlaces) {
                this.giddhDecimalPlaces = response.balanceDecimalPlaces;
            } else {
                this.giddhDecimalPlaces = 2;
            }
        });
    }

    public performActions(type: number, account: any, event?: any) {
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(account.name));
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
                break;

            case 1: // go to ledger
                this.goToRoute('ledger', `/${this.fromDate}/${this.toDate}`, account.uniqueName);
                break;

            case 2: // go to sales or purchase
                this.purchaseOrSales = this.activeTab === 'customer' ? 'sales' : 'purchase';
                if (this.purchaseOrSales === 'purchase') {
                    this.goToRoute('proforma-invoice/invoice/purchase', '', account.uniqueName);
                } else {
                    let isCashInvoice = account.uniqueName === 'cash';
                    this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? 'cash' : 'sales'}`, '', account.uniqueName);
                }
                break;
            case 3: // send sms
                if (event) {
                    event.stopPropagation();
                }
                this.openSmsDialog();
                break;
            case 4: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openEmailDialog();
                break;
            default:
                break;
        }
    }

    public goToRoute(part: string, additionalParams: string = '', accUniqueName: string) {
        let url = location.href + `?returnUrl=${part}/${accUniqueName}`;

        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }

        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${part}/${accUniqueName}`;
            console.log(ipcRenderer.send('open-url', url));
        } else {
            (window as any).open(url);
        }
    }

    public tabSelected(tabName: 'customer' | 'aging-report' | 'vendor') {
        if (!this.searchStr) {
            this.searchStr = '';
            this.selectedCheckedContacts = [];
            this.selectedAccountsList = [];
            this.allSelectionModel = false;
            this.checkboxInfo = {
                selectedPage: 1
            };
        }

        if (tabName !== this.activeTab) {
            this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
            this.commonRequest = new ContactAdvanceSearchCommonModal();
            this.isAdvanceSearchApplied = false;
            this.key = 'name';
            this.order = 'asc';
            this.activeTab = tabName;

            if(this.universalDate) {
                this.selectedDateRange = { startDate: moment(this.universalDate[0]), endDate: moment(this.universalDate[1]) };
                this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
            }

            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', PAGINATION_LIMIT, '');

            this.store.dispatch(this._generalAction.setAppTitle(`/pages/contact/${tabName}`));

            if (this.activeTab !== 'aging-report') {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
            } else {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
            }
            this.router.navigate(['/pages/contact/', tabName], { replaceUrl: true });
        }
    }

    public setActiveTab(tabName: 'customer' | 'aging-report' | 'vendor', type: string) {
        this.searchStr = '';
        this.tabSelected(tabName);
        if (tabName === 'vendor') {
            this.getAccounts(this.fromDate, this.toDate, type, null, 'true', PAGINATION_LIMIT, '');
        }
        this.showFieldFilter = new CustomerVendorFiledFilter();
        let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
        if (showColumnObj) {
            if (showColumnObj.closingBalance !== undefined) {
                delete showColumnObj.closingBalance;
            };
            this.showFieldFilter = showColumnObj;
            this.setTableColspan();
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    detectChanges() {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    public updateCustomerAcc(openFor: 'customer' | 'vendor', account: any) {
        this.activeAccountDetails = account;
        this.isUpdateAccount = true;
        this.selectedGroupForCreateAcc = account ? account.groupUniqueName : openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.toggleAccountAsidePane();
    }

    public openAddAndManage(openFor: 'customer' | 'vendor') {
        this.isUpdateAccount = false;
        this.selectedGroupForCreateAcc = openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.toggleAccountAsidePane();
    }

    //  commenting for now may be use later for reference
    // public openPaymentAside(acc: string) {
    //     this.selectedAccForPayment = acc;
    //     this.togglePaymentPane();
    // }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }

    //  commenting for now may be use later for reference
    // public togglePaymentPane(event?) {
    //     if (event) {
    //         event.preventDefault();
    //     }
    //     this.paymentAsideMenuState = this.paymentAsideMenuState === 'out' ? 'in' : 'out';
    //     this.toggleBodyClass();
    // }

    public getUpdatedList(grpName?): void {
        setTimeout(() => {
            if (grpName) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                    this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
                }
            }
        }, 1000);
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public submitCashfreeDetail(f) {
        if (f && f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        } else {
            this._toaster.errorToast('Please enter Cashfree details.', 'Validation');
            return;
        }
    }

    public pageChanged(event: any): void {
        if (this.currentPage !== event.page) {
            this.checkboxInfo.selectedPage = event.page;
            this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
            let selectedGrp = this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
            this.getAccounts(this.fromDate, this.toDate, selectedGrp, event.page, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
        }
    }

    public hideListItems() {
        this.filterDropDownList.hide();
    }

    /**
     * updateComment
     */
    public updateComment(account) {
        if (account.comment) {
            let canUpdate = this.canUpdateComment(account.uniqueName, account.comment);
            if (canUpdate) {
                this.addComment(account);
            } else {
                this.updateCommentIdx = null;
            }
        } else {
            let canDelete = this.canDeleteComment(account.uniqueName);
            if (canDelete) {
                this.deleteComment(account.uniqueName);
            } else {
                this.updateCommentIdx = null;
            }
        }

    }

    /**
     * deleteComment
     */
    public deleteComment(accountUniqueName) {
        setTimeout(() => {
            this._contactService.deleteComment(accountUniqueName).subscribe(res => {
                if (res.status === 'success') {
                    this.updateCommentIdx = null;
                }
            });
        }, 500);
    }

    /**
     * canDeleteComment
     */
    public canDeleteComment(accountUniqueName) {
        let account;
        if (this.activeTab === 'customer') {
            account = find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        } else {
            account = find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        }
        if (account.comment) {
            account.comment = '';
            return true;
        } else {
            return false;
        }
    }

    /**
     * canDeleteComment
     */
    public canUpdateComment(accountUniqueName, comment) {
        let account;
        if (this.activeTab === 'customer') {
            account = find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        } else {
            account = find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        }
        if (account.comment !== comment) {
            account.comment = comment;
            return true;
        } else {
            return false;
        }
    }

    public addComment(account) {
        setTimeout(() => {
            this._contactService.addComment(account.comment, account.uniqueName).subscribe(res => {
                if (res.status === 'success') {
                    this.updateCommentIdx = null;
                    account.comment = cloneDeep(res.body.description);
                    this.updateInList(account.uniqueName, account.comment);
                }
            });
        }, 500);
    }

    // Add Selected Value to Message Body
    public addValueToMsg(val: any) {
        this.typeInTextarea(val.value);
        // this.messageBody.msg += ` ${val.value} `;
    }

    public typeInTextarea(newText) {
        let el: HTMLInputElement = this.messageBox.nativeElement;
        let start = el.selectionStart;
        let end = el.selectionEnd;
        let text = el.value;
        let before = text.substring(0, start);
        let after = text.substring(end, text.length);
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + newText.length;
        el.focus();
        this.messageBody.msg = el.value;
    }

    // Open Modal for Email
    public openEmailDialog() {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    }

    // Open Modal for SMS
    public openSmsDialog() {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    }

    // Send Email/Sms for Accounts
    public async send(groupsUniqueName: string) {
        let request: BulkEmailRequest = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: uniq(this.selectedCheckedContacts),
            },
            params: {
                from: this.fromDate,
                to: this.toDate,
                groupUniqueName: groupsUniqueName
            }
        };
        // uncomment it
        // request.data = Object.assign({} , request.data, this.formattedQuery);

        if (this.messageBody.btn.set === 'Send Email') {
            return this._companyServices.sendEmail(request)
                .subscribe((r) => {
                    r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
                    this.checkboxInfo = {
                        selectedPage: 1
                    };
                    this.selectedItems = [];
                    this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
                });
        } else if (this.messageBody.btn.set === 'Send Sms') {
            let temp = request;
            delete temp.data['subject'];
            return this._companyServices.sendSms(temp)
                .subscribe((r) => {
                    r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
                    this.checkboxInfo = {
                        selectedPage: 1
                    };
                    this.selectedItems = [];
                    this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;

                });
        }
        this.mailModal.hide();
    }

    /**
     * updateInList
     */
    public updateInList(accountUniqueName, comment) {
        if (this.activeTab === 'customer') {
            //
        }
    }

    public pageChangedDueReport(event: any): void {
        this.dueAmountReportRequest.page = event.page;
    }

    public loadPaginationComponent(s) {
        let transactionData = null;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
        if (this.paginationChild && this.paginationChild.viewContainerRef) {
            let viewContainerRef = this.paginationChild.viewContainerRef;
            viewContainerRef.remove();

            let componentInstanceView = componentFactory.create(viewContainerRef.injector);
            viewContainerRef.insert(componentInstanceView.hostView);

            let componentInstance = componentInstanceView.instance as PaginationComponent;
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = this.paginationLimit;
            componentInstance.maxSize = 5;
            componentInstance.writeValue(s.page);
            componentInstance.boundaryLinks = true;
            componentInstance.pageChanged.subscribe(e => {
                this.pageChangedDueReport(e);
            });
        }
    }

    public selectedDate(value?: any): void {
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }

        this.hideGiddhDatepicker();

        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
            this.detectChanges();
        }
    }

    public toggleAllSelection(action: boolean) {

        this.checkboxInfo[this.checkboxInfo.selectedPage] = action;
        this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
        if (action) {
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(element => {
                    element.isSelected = action;
                    this.prepareSelectedContactsList(element, true);
                    return element;
                });
            } else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(element => {
                    element.isSelected = action;
                    this.prepareSelectedContactsList(element, true);
                    return element;
                });
            }

        } else {
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(element => {
                    element.isSelected = action;
                    this.prepareSelectedContactsList(element, false);
                    return element;
                });
            } else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(element => {
                    element.isSelected = action;
                    this.prepareSelectedContactsList(element, false);
                    return element;
                });
            }

        }
    }

    public toggleAdvanceSearchPopup() {
        this.advanceSearch.toggle();
    }

    public selectAccount(ev: any, item: any) {
        this.prepareSelectedContactsList(item, ev.target.checked);
        if (!ev.target.checked) {
            this.checkboxInfo[this.checkboxInfo.selectedPage] = false;
            this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
            if (this.selectedCheckedContacts.length === 0) {
                this.selectAllCustomer = false;
                this.selectAllVendor = false;
                this.selectedWhileHovering = '';
            }
        }
    }

    public resetAdvanceSearch() {
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
            null, 'true', PAGINATION_LIMIT, '');
    }

    public applyAdvanceSearch(request: ContactAdvanceSearchCommonModal) {
        this.commonRequest = request;
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        let category = request.category;
        if (category === 'openingBalance') {
            this.advanceSearchRequestModal.openingBalanceType = 'debit'; // default
            this.advanceSearchRequestModal.openingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        } else if (category === 'closingBalance') {
            this.advanceSearchRequestModal.closingBalanceType = 'debit'; // default
            this.advanceSearchRequestModal.closingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        } else if (category === 'sales') {
            this.advanceSearchRequestModal.debitTotal = request.amount;
            category = 'debitTotal';
            this.setAmountType(category, request.amountType);
        } else if (category === 'receipt') {
            category = 'creditTotal';
            this.advanceSearchRequestModal.creditTotal = request.amount;
            this.setAmountType(category, request.amountType);
        }

        switch (request.amountType) {
            case 'GreaterThan':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = true;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'LessThan':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = true;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'Equals':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = true;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'Exclude':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = true;
                break;
        }
        this.isAdvanceSearchApplied = true;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
            null, 'true', PAGINATION_LIMIT, '', this.key, this.order);
    }

    public setAmountType(category: string, amountType: string) {
        this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
        this.advanceSearchRequestModal[category + 'LessThan'] = false;
        this.advanceSearchRequestModal[category + 'Equal'] = false;
        this.advanceSearchRequestModal[category + 'NotEqual'] = false;
    }

    // Save CSV File with data from Table...
    public downloadCSV() {
        if (this.activeTab === 'customer') {
            this.groupUniqueName = 'sundrydebtors';
        } else {
            this.groupUniqueName = 'sundrycreditors';
        }

        let request: BulkEmailRequest = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: this.selectedCheckedContacts,
            },
            params: {
                from: this.fromDate,
                to: this.toDate,
                groupUniqueName: this.groupUniqueName
            }
        };

        this._companyServices.downloadCSV(request).subscribe((res) => {
            this.searchLoader$ = observableOf(false);
            if (res.status === 'success') {
                let blobData = this.base64ToBlob(res.body, 'text/csv', 512);
                return saveAs(blobData, `${this.groupUniqueName}.csv`);
            }
        });

    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        while (offset < byteCharacters.length) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            let i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    }

    /**
     * Method to fetch account details from service
     *
     * @private
     * @param {string} fromDate From date
     * @param {string} toDate To date
     * @param {string} groupUniqueName Group unique name ('sundrycreditors' or 'sundrydebtors')
     * @param {number} [pageNumber] Page number of the data to be fetched
     * @param {string} [refresh] If true, then fetch the most refreshed data instead of cached data
     * @param {number} [count=20] Page size
     * @param {string} [query] Query string to be searched such as customer name
     * @param {string} [sortBy=''] Sorting entity by which we need to sort such as debitTotal, creditTotal or name
     * @param {string} [order='asc'] Order of sorting (asc or desc)
     * @memberof ContactComponent
     */
    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, refresh?: string, count: number = PAGINATION_LIMIT, query?: string,
        sortBy: string = '', order: string = 'asc'): void {
        this.isGetAccountsInProcess = true;
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';
        fromDate = (fromDate) ? fromDate : '';
        toDate = (toDate) ? toDate : '';
        this.currentPage = pageNumber;

        this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order, this.advanceSearchRequestModal).subscribe((res) => {
            if (res && res.body && res.status === 'success') {
                this.totalDue = Number(Math.abs(res.body.debitTotal - res.body.creditTotal).toFixed(this.giddhDecimalPlaces)) || 0;
                this.totalSales = (this.activeTab === 'customer' ? res.body.debitTotal : res.body.creditTotal) || 0;
                this.totalReceipts = (this.activeTab === 'customer' ? res.body.creditTotal : res.body.debitTotal) || 0;
                this.Totalcontacts = 0;


                if (groupUniqueName === 'sundrydebtors') {
                    this.sundryDebtorsAccountsBackup = cloneDeep(res.body);
                    this.Totalcontacts = res.body.totalItems;
                    lodashMap(res.body.results, (obj) => {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    this.sundryDebtorsAccounts = cloneDeep(res.body.results);
                    this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(element => {
                        let indexOfItem = this.selectedCheckedContacts.indexOf(element.uniqueName);
                        if (indexOfItem === -1) {
                            element.isSelected = false;
                        } else {
                            element.isSelected = true;
                        }
                        return element;
                    });

                } else {
                    this.Totalcontacts = res.body.totalItems;
                    this.sundryCreditorsAccountsBackup = cloneDeep(res.body);
                    lodashMap(res.body.results, (obj) => {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    this.sundryCreditorsAccounts = cloneDeep(res.body.results);
                    this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(element => {
                        let indexOfItem = this.selectedCheckedContacts.indexOf(element.uniqueName);
                        if (indexOfItem === -1) {
                            element.isSelected = false;
                        } else {
                            element.isSelected = true;
                        }
                        return element;
                    });

                }
                this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
                this.detectChanges();
            }
            this.isGetAccountsInProcess = false;
        });
    }

    public editCustomerPosition(ev) {
        let offset = $('#edit-model-basic').position();
        if (offset) {
            let exactPositionTop = offset.top;
            let exactPositionLeft = offset.left;

            $('#edit-model-basic').css('top', exactPositionTop);
        }
    }

    public columnFilter(event, column) {
        // if (event && column) {
        this.showFieldFilter[column] = event;
        this.setTableColspan();
        this.showFieldFilter.selectAll = Object.keys(this.showFieldFilter).filter((filterName) => filterName !== 'selectAll').every(filterName => this.showFieldFilter[filterName]);
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer'], JSON.stringify(this.showFieldFilter));
        }
        // }
    }

    /**
     * Fetches the details for country and sets the visibility of tax filter
     * if country taxation is supported in Giddh
     *
     * @param {string} countryCode Active company country code
     * @memberof ContactComponent
     */
    public getOnboardingForm(countryCode: string): void {
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    const formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            formFields[res.fields[key].name] = [];
                            formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                    if (formFields && formFields['taxName']) {
                        this.shouldShowTaxFilter = true;
                    } else {
                        this.shouldShowTaxFilter = false;
                    }
                }
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = 'onboarding';
                onboardingFormRequest.country = countryCode;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    private setTableColspan() {
        let balancesColsArr = ['openingBalance'];
        let length = Object.keys(this.showFieldFilter).filter(f => this.showFieldFilter[f]).filter(f => balancesColsArr.includes(f)).length;
        this.tableColsPan = length > 0 ? 4 : 3;
    }

    /*
    * Register Account navigation
    * */
    private registerAccount() {
        this.router.navigate(['settings'], { queryParams: { tab: 'integration', tabIndex: 1, subTab: 4 } });
    }

    private setStateDetails(url) {
        // save last state with active tab
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `contact/${url}`;

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    }

    /**
     * To close bulk payment model
     *
     * @memberof ContactComponent
     */
    public closeBulkPaymentModel(event: any): void {
        //  if bulk paymemt success then clear all selected contacts lists
        if (event) {
            this.clearSelectedContacts(false);
        }
        this.isBulkPaymentShow = false;
        this.selectedAccForPayment = null;
        this.bulkPaymentModalRef.hide();
    }

    /**
     *To check is bank account details added in account
     *
     * @param {*} item account object
     * @returns {boolean} true if added bank accounts details
     * @memberof ContactComponent
     */
    public isBankAccountAddedAccount(item: any): boolean {
        if (item) {
            return item.accountBankDetails && item.accountBankDetails.bankAccountNo ? true : false;
        } else {
            return false;
        }
    }
    /**
        * This will toggle all columns
        *
        * @param {boolean} event
        * @memberof ContactComponent
        */
    public selectAllColumns(event: boolean): void {
        this.showFieldFilter.parentGroup = event;
        this.showFieldFilter.openingBalance = event;
        this.showFieldFilter.mobile = event;
        this.showFieldFilter.email = event;
        this.showFieldFilter.state = event;
        this.showFieldFilter.gstin = event;
        this.showFieldFilter.comment = event;
        this.setTableColspan();
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer'], JSON.stringify(this.showFieldFilter));
        }
    }

    /**
     * This will show datepicker
     *
     * @param {*} element
     * @memberof ContactComponent
     */
    public showGiddhDatepicker(element): void {
        if (element) {
            this.dateFieldPosition = this._generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide datepicker
     *
     * @memberof ContactComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * To prepare selected contacts list
     *
     * @param {*} element Selected contact
     * @param {boolean} [isChecked] To check is check box selected
     * @memberof ContactComponent
     */
    public prepareSelectedContactsList(element: any, isChecked: boolean): void {
        // selected accounts or creditors list for bulk payment
        let indexOfEntry = this.selectedAccountsList.indexOf(element);
        if (indexOfEntry === -1 && isChecked) {
            this.selectedAccountsList.push(element);
        } else if (indexOfEntry > -1 && !this.allSelectionModel) {
            this.selectedAccountsList.splice(indexOfEntry, 1);
        }
        // selected contacts list
        let indexOfEntrySelected = this.selectedCheckedContacts.indexOf(element.uniqueName);
        if (indexOfEntrySelected === -1 && isChecked) {
            this.selectedCheckedContacts.push(element.uniqueName);
        } else if (indexOfEntrySelected > -1 && !this.allSelectionModel) {
            this.selectedCheckedContacts.splice(indexOfEntrySelected, 1);
        }
    }

    /**
     * To clear selected contacts list
     *
     * @memberof ContactComponent
     */
    public clearSelectedContacts(resetPage:boolean = true): void {
        if(resetPage) {
            this.checkboxInfo = {
                selectedPage: 1
            };
            this.searchStr = '';
            this.selectedCheckedContacts = [];
            this.selectedAccountsList = [];
            this.allSelectionModel = false;
        }

        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', this.checkboxInfo.selectedPage, 'true', PAGINATION_LIMIT, this.searchStr, this.key, this.order);
    }

     /**
     * API call to get custom field data
     *
     * @memberof ContactComponent
     */
    public getCompanyCustomField(): void {
        this.groupService.getCompanyCustomField().subscribe(response => {
            if (response && response.status === 'success') {
                this.companyCustomFields$ = observableOf(response.body);
                if (response.body) {
                    this.colspanLength = 11 + response.body.length;
                }
            } else {
                this._toaster.errorToast(response.message);
            }
        });
    }
}
