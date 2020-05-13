import { CompanyService } from '../services/companyService.service';
import { BulkEmailRequest } from '../models/api-models/Search';
import { combineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { DashboardService } from '../services/dashboard.service';
import { ContactService } from '../services/contact.service';
import { BsDropdownDirective, ModalDirective, ModalOptions, PaginationComponent, TabsetComponent } from 'ngx-bootstrap';
import { CashfreeClass } from '../models/api-models/SettingsIntegraion';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import * as _ from 'lodash';
import {
    ContactAdvanceSearchCommonModal,
    ContactAdvanceSearchModal,
    CustomerVendorFiledFilter,
    DueAmountReportQueryRequest,
    DueAmountReportResponse
} from '../models/api-models/Contact';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as moment from 'moment/moment';
import { saveAs } from 'file-saver';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { createSelector } from 'reselect';
import { GeneralActions } from '../actions/general/general.actions';
import { GeneralService } from '../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './../shared/helpers/defaultDateFormat';
import { OnboardingFormRequest } from '../models/api-models/Common';
import { CommonActions } from '../actions/common.actions';

const CustomerType = [
    { label: 'Customer', value: 'customer' },
    { label: 'Vendor', value: 'vendor' }
];

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

export class ContactComponent implements OnInit, OnDestroy, OnChanges {
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
    // public modalUniqueName: string;

    // public showAsideOverlay = true;
    // sorting
    public key: string = 'name'; // set default
    public order: string = 'asc';

    public showFieldFilter: CustomerVendorFiledFilter = new CustomerVendorFiledFilter();
    public updateCommentIdx: number = null;
    public searchStr$ = new Subject<string>();
    public searchStr: string = '';
    @ViewChild('payNowModal') public payNowModal: ModalDirective;
    @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
    @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
    @ViewChild('staticTabs') public staticTabs: TabsetComponent;
    @ViewChild('mailModal') public mailModal: ModalDirective;
    @ViewChild('messageBox') public messageBox: ElementRef;
    @ViewChild('advanceSearch') public advanceSearch: ModalDirective;

    // @Input('sort-direction')
    // sortDirection: string = '';

    // @HostListener('click')
    // sort() {
    //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    // }

    public datePickerOptions: any;
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
    public isAllChecked: boolean = false;
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

    private checkboxInfo: any = {
        selectedPage: 1
    };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private createAccountIsSuccess$: Observable<boolean>;
    /** Selected company */
    private selectedCompany: any;
    public universalDate: any;
    /** Selects/Unselects extra columns based on Select All Checkbox */
    public selectAll: boolean = false;

    constructor(
        private store: Store<AppState>,
        private _toasty: ToasterService,
        private router: Router,
        private _companyServices: CompanyService,
        private commonActions: CommonActions,
        private _toaster: ToasterService,
        private _dashboardService: DashboardService,
        private _contactService: ContactService,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private _companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _groupWithAccountsAction: GroupWithAccountsAction,
        private _cdRef: ChangeDetectorRef, private _generalService: GeneralService,
        private _route: ActivatedRoute, private _generalAction: GeneralActions,
        private _router: Router, private _breakPointObservar: BreakpointObserver) {
        this.searchLoader$ = this.store.select(p => p.search.searchLoader);
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));

        this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
        this.store.select(s => s.agingreport.data).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.dueAmountReportRequest.page = data.page;
                this.loadPaginationComponent(data);
            }
            this.dueAmountReportData$ = observableOf(data);
        });
        this.store.pipe(select(store => {
            if (!store.session.companies) {
                return;
            }
            // store.session.companies.forEach(company => {
            //     if (company.uniqueName === store.session.companyUniqueName) {
            //         this.selectedCompany = company;
            //     }
            // });
            this.selectedCompany = store.session.companies.find((company) => company.uniqueName === store.session.companyUniqueName);
        }), takeUntil(this.destroyed$)).subscribe();
        this.store.dispatch(this._companyActions.getAllRegistrations());
    }

    public sort(key, ord = 'asc') {
        this.key = key;
        this.order = ord;

        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
            null, 'false', 20, this.searchStr, key, ord);
    }

    public ngOnInit() {

        // get default datepicker options from store
        this.store.pipe(select(p => p.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.datePickerOptions = a;
                this.fromDate = moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT);
            }
        });

        // localStorage supported
        if (window.localStorage) {
            let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
            if (showColumnObj) {
                this.showFieldFilter = showColumnObj;
                this.setTableColspan();
            }
        }

        this.store.select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format('DD-MM-YYYY');
                this.toDate = moment(universalDate[1]).format('DD-MM-YYYY');
                this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', 20, this.searchStr);
            }
        })).pipe(takeUntil(this.destroyed$)).subscribe();

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                    this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', 20, this.searchStr);
                }
            }
        });

        this.getCashFreeBalance();

        this.flattenAccountsStream$.subscribe(data => {

            if (data) {
                let accounts: IOption[] = [];
                let bankAccounts: IOption[] = [];
                _.forEach(data, (item) => {
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
            distinctUntilChanged())
            .subscribe((term: any) => {
                this.searchStr = term;
                if (this.activeTab === 'customer') {
                    this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, 'true', 20, term, this.key, this.order);
                } else {
                    this.getAccounts(this.fromDate, this.toDate, 'sundrycreditors', null, 'true', 20, term, this.key, this.order);
                }
            });
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        combineLatest([this._route.params, this._route.queryParams])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                let params = result[0];
                let queryParams = result[1];

                if (params) {
                    if (params['type'] === 'customer') {
                        this.setActiveTab(params['type'], 'sundrydebtors');
                    } else if (params['type'] === 'vendor') {
                        this.setActiveTab(params['type'], 'sundrycreditors');
                    } else {
                        this.setActiveTab('aging-report', '');
                    }
                    if (queryParams && queryParams.tab) {

                    }
                }
            });

        // this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
        //   if (val && val.tab && val.tabIndex) {
        //     let tabIndex = Number(val.tabIndex);
        //     if (this.staticTabs && this.staticTabs.tabs) {
        //       if (val.tab === 'aging-report' && tabIndex === 1) {
        //         this.setActiveTab('aging-report', '');
        //         this.staticTabs.tabs[tabIndex].active = true;
        //       } else if (val.tab === 'vendor' && tabIndex === 0) {
        //         this.setActiveTab('vendor', 'sundrycreditors');
        //         this.staticTabs.tabs[tabIndex].active = true;
        //       } else {
        //         this.setActiveTab('customer', 'sundrydebtors');
        //         this.staticTabs.tabs[0].active = true;
        //       }
        //     }
        //   }
        // });

        this.store
            .pipe(select(p => p.company.isAccountInfoLoading), takeUntil(this.destroyed$))
            .subscribe(result => {
                //ToDo logic to stop loader
                // if (result && this.taxAsideMenuState === 'in') {
                //   this.toggleTaxAsidePane();
                // }
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
    }

    public ngOnChanges(changes: SimpleChanges): void {
    }

    public performActions(type: number, account: any, event?: any) {
        this.selectedCheckedContacts = [];
        this.selectedCheckedContacts.push(account.uniqueName);

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
        this.searchStr = '';
        this.selectedCheckedContacts = [];
        if (tabName !== this.activeTab) {
            this.activeTab = tabName;
            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', 20, '');

            this.store.dispatch(this._generalAction.setAppTitle(`/pages/contact/${tabName}`));

            if (this.activeTab !== 'aging-report') {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
            } else {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
            }
            this.router.navigate(['pages/contact/', tabName], { replaceUrl: true });
        }
    }

    public setActiveTab(tabName: 'customer' | 'aging-report' | 'vendor', type: string) {
        this.tabSelected(tabName);
        this.searchStr = '';
        if (tabName === 'vendor') {
            this.getAccounts(this.fromDate, this.toDate, type, null, 'true', 20, '');
        }
        this.showFieldFilter = new CustomerVendorFiledFilter();
        let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
        if (showColumnObj) {
            this.showFieldFilter = showColumnObj;
            this.setTableColspan();
        }

        // if (this.activeTab !== 'aging-report') {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
        // } else {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
        // }
    }

    public ngOnDestroy() {
        // if (this.activeTab !== 'aging-report') {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
        // } else {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
        // }

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

    public openPaymentAside(acc: string) {
        this.selectedAccForPayment = acc;
        this.togglePaymentPane();
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }

    public togglePaymentPane(event?) {
        if (event) {
            event.preventDefault();
        }
        this.paymentAsideMenuState = this.paymentAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public getUpdatedList(grpName?): void {
        setTimeout(() => {
            if (grpName) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                    this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', 20, '');
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

    public payNow(acc: string) {
        this.selectedAccForPayment = acc;
        this.payNowModal.show();
    }

    public onPaymentModalCancel() {
        this.payNowModal.hide();
    }

    public onConfirmation(amountToPay: string) {
        let payNowData: PayNowRequest = {
            accountUniqueName: this.selectedAccForPayment.uniqueName,
            amount: Number(amountToPay),
            description: ''
        };

        this._contactService.payNow(payNowData).subscribe((res) => {
            if (res.status === 'success') {
                this._toasty.successToast('Payment done successfully with reference id: ' + res.body.referenceId);
            } else {
                this._toasty.errorToast(res.message, res.code);
            }
        });
    }

    public selectCashfreeAccount(event: IOption, objToApnd) {
        let accObj = {
            name: event.label,
            uniqueName: event.value
        };
        objToApnd.account = accObj;
    }

    public submitCashfreeDetail(f) {
        if (f && f.userName && f.password) {
            let objToSend = _.cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        } else {
            this._toasty.errorToast('Please enter Cashfree details.', 'Validation');
            return;
        }
    }

    public pageChanged(event: any): void {
        let selectedGrp = this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.selectedCheckedContacts = [];
        this.getAccounts(this.fromDate, this.toDate, selectedGrp, event.page, 'true', 20, this.searchStr, this.key, this.order);
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
            account = _.find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        } else {
            account = _.find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
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
            account = _.find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        } else {
            account = _.find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
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
                    account.comment = _.cloneDeep(res.body.description);
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
                accounts: _.uniq(this.selectedCheckedContacts),
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
                    this.isAllChecked = false;
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
                    this.isAllChecked = false;
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

            let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
            viewContainerRef.insert(componentInstanceView.hostView);

            let componentInstance = componentInstanceView.instance as PaginationComponent;
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = s.count;
            componentInstance.maxSize = 5;
            componentInstance.writeValue(s.page);
            componentInstance.boundaryLinks = true;
            componentInstance.pageChanged.subscribe(e => {
                this.pageChangedDueReport(e);
            });
        }
    }

    public selectedDate(value: any) {
        if (value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, 'true', 20, this.searchStr);
            this.detectChanges();
        }
    }

    public toggleAllSelection(action: boolean) {
        if (action) {
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(m => {
                    m.isSelected = action;
                    return m;
                });
                this.selectedCheckedContacts = this.sundryDebtorsAccounts.map(m => m.uniqueName);
            } else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(m => {
                    m.isSelected = action;
                    return m;
                });
                this.selectedCheckedContacts = this.sundryCreditorsAccounts.map(m => m.uniqueName);
            }
        } else {
            this.selectedCheckedContacts = [];
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(m => {
                    m.isSelected = action;
                    return m;
                });
            } else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(m => {
                    m.isSelected = action;
                    return m;
                });
            }
        }
    }

    public toggleAdvanceSearchPopup() {
        this.advanceSearch.toggle();
    }

    public selectAccount(ev: any, uniqueName: string) {
        // this.selectedcus = true;
        if (ev.target.checked) {
            this.selectedCheckedContacts.push(uniqueName);
            // this.selectCustomer = true;
        } else {
            // this.selectCustomer = false;
            let itemIndx = this.selectedCheckedContacts.findIndex((item) => item === uniqueName);
            this.selectedCheckedContacts.splice(itemIndx, 1);

            if (this.selectedCheckedContacts.length === 0) {
                this.selectAllCustomer = false;
                this.selectAllVendor = false;
                this.selectedWhileHovering = '';
            }
            // this.lc.selectedTxnUniqueName = null;
            // this.store.dispatch(this._ledgerActions.DeSelectGivenEntries([uniqueName]));
        }
    }

    public resetAdvanceSearch() {
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
            null, 'true', 20, '');
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
        } else {

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
            null, 'true', 20, '');
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
    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, refresh?: string, count: number = 20, query?: string,
        sortBy: string = '', order: string = 'asc'): void {
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';
        this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order, this.advanceSearchRequestModal).subscribe((res) => {
            if (res.status === 'success') {
                this.totalDue = res.body.closingBalance.amount || 0;
                this.totalSales = (this.activeTab === 'customer' ? res.body.creditTotal : res.body.debitTotal) || 0;
                this.totalReceipts = (this.activeTab === 'customer' ? res.body.debitTotal : res.body.creditTotal) || 0;
                this.Totalcontacts = 0;

                if (groupUniqueName === 'sundrydebtors') {
                    this.sundryDebtorsAccountsBackup = _.cloneDeep(res.body);
                    this.Totalcontacts = res.body.totalItems;
                    _.map(res.body.results, (obj) => {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    this.sundryDebtorsAccounts = _.cloneDeep(res.body.results);

                } else {
                    this.Totalcontacts = res.body.totalItems;
                    this.sundryCreditorsAccountsBackup = _.cloneDeep(res.body);
                    _.map(res.body.results, (obj) => {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    this.sundryCreditorsAccounts = _.cloneDeep(res.body.results);

                }
                this.detectChanges();
            }
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

    private getCashFreeBalance() {
        this._contactService.GetCashFreeBalance().subscribe((res) => {
            if (res.status === 'success') {
                this.cashFreeAvailableBalance = res.body.availableBalance;
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
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `contact/${url}`;

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
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
    }
}
