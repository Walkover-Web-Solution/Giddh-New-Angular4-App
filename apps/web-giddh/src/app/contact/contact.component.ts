import { animate, state, style, transition, trigger } from "@angular/animations";
import { BreakpointObserver } from "@angular/cdk/layout";
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { saveAs } from "file-saver";
import * as moment from "moment/moment";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from "ngx-bootstrap/modal";
import { PaginationComponent } from "ngx-bootstrap/pagination";
import { TabsetComponent } from "ngx-bootstrap/tabs";
import { combineLatest, Observable, of as observableOf, ReplaySubject, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from "rxjs/operators";
import { cloneDeep, find, map as lodashMap, uniq } from "../../app/lodash-optimized";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { GroupWithAccountsAction } from "../actions/groupwithaccounts.actions";
import { SettingsProfileActions } from "../actions/settings/profile/settings.profile.action";
import { SettingsIntegrationActions } from "../actions/settings/settings.integration.action";
import { PAGINATION_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from "../app.constant";
import { OnboardingFormRequest } from "../models/api-models/Common";
import { StateDetailsRequest } from "../models/api-models/Company";
import {
    ContactAdvanceSearchCommonModal,
    ContactAdvanceSearchModal,
    CustomerVendorFiledFilter,
    DueAmountReportQueryRequest,
    DueAmountReportResponse,
} from "../models/api-models/Contact";
import { BulkEmailRequest } from "../models/api-models/Search";
import { CashfreeClass } from "../models/api-models/SettingsIntegraion";
import { IFlattenAccountsResultItem } from "../models/interfaces/flattenAccountsResultItem.interface";
import { CompanyService } from "../services/companyService.service";
import { ContactService } from "../services/contact.service";
import { GeneralService } from "../services/general.service";
import { GroupService } from "../services/group.service";
import { ToasterService } from "../services/toaster.service";
import { ElementViewContainerRef } from "../shared/helpers/directives/elementViewChild/element.viewchild.directive";
import { AppState } from "../store";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "./../shared/helpers/defaultDateFormat";
import { SettingsBranchActions } from "../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../models/user-login-state";
import { GiddhCurrencyPipe } from "../shared/helpers/pipes/currencyPipe/currencyType.pipe";
import { FormControl } from "@angular/forms";
import { Lightbox } from "ngx-lightbox";
import { MatCheckboxChange } from "@angular/material/checkbox/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
    selector: "contact-detail",
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"],
    animations: [
        trigger("slideInOut", [
            state("in", style({
                transform: "translate3d(0, 0, 0)",
            })),
            state("out", style({
                transform: "translate3d(100%, 0, 0)",
            })),
            transition("in => out", animate("400ms ease-in-out")),
            transition("out => in", animate("400ms ease-in-out")),
        ]),
    ],
})
export class ContactComponent implements OnInit, OnDestroy {
    // vendorDataColumns: string[] = ["app_parent_group", "opening", "app_sales_app_purchase", "app_receipt_app_payment",'closing','contacts','app_tax_number','app_state','comment','app_action'];
    // customerDataColumns: string[] = ["position", "name", "weight", "symbol"];
    // dataSource = this.sundryDebtorsAccounts [];

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
    public activeTab: any = "";
    public groupUniqueName: any;
    public accountAsideMenuState: string = "out";
    public paymentAsideMenuState: string = "out";
    public selectedAccForPayment: any;
    public dueAmountReportRequest: DueAmountReportQueryRequest;
    public selectedGroupForCreateAcc: "sundrydebtors" | "sundrycreditors" = "sundrydebtors";
    public cashFreeAvailableBalance: number;
    public payoutForm: CashfreeClass;
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
    public LOCAL_STORAGE_KEY_FOR_TABLE_COLUMN = "showTableColumn";
    public localStorageKeysForFilters = { customer: "customerFilterStorage", vendor: "vendorFilterStorage" };
    public isMobileScreen: boolean = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: "static",
        ignoreBackdropClick: true,
    };
    public isICICIIntegrated: boolean = false;
    public selectedWhileHovering: string;
    public searchLoader$: Observable<boolean>;
    /** sorting */
    public key: string = "name"; // set default
    public order: string = "asc";
    public showFieldFilter: CustomerVendorFiledFilter = new CustomerVendorFiledFilter();
    public updateCommentIdx: number = null;
    public searchStr$ = new Subject<string>();
    public searchStr: string = "";
    @ViewChild("filterDropDownList") public filterDropDownList: BsDropdownDirective;
    @ViewChild("paginationChild", { static: true }) public paginationChild: ElementViewContainerRef;
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;
    // @ViewChild("staticTabs", { static: true }) public staticTabs: MatTableModule;

    // @Output() selectedTabChange: EventEmitter<string>;

    @ViewChild("mailModal", { static: false }) public mailModal: ModalDirective;
    @ViewChild("messageBox", { static: false }) public messageBox: ElementRef;
    @ViewChild("advanceSearch", { static: true }) public advanceSearch: ModalDirective;
    @ViewChild("datepickerTemplate", { static: true }) public datepickerTemplate: ElementRef;
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public universalDate$: Observable<any>;
    public messageBody = {
        header: {
            email: "Send Email",
            sms: "Send Sms",
            set: "",
        },
        btn: {
            email: "Send Email",
            sms: "Send Sms",
            set: "",
        },
        type: "",
        msg: "",
        subject: "",
    };
    public dataVariables = [];
    public selectedItems: string[] = [];
    public totalSales: number = 0;
    public totalReceipts: number = 0;
    /** Total customers */
    public totalCustomers = 0;
    /** Total vendors */
    public totalVendors = 0;
    public accInfo: IFlattenAccountsResultItem;
    public purchaseOrSales: "sales" | "purchase";
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
    /** Pagination count */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Giddh decimal places set by user */
    public giddhDecimalPlaces = 2;
    private checkboxInfo: any = {
        selectedPage: 1,
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private createAccountIsSuccess$: Observable<boolean>;
    public universalDate: any;
    /** model reference to open/close bulk payment model */
    public bulkPaymentModalRef: BsModalRef;
    public modalRef: BsModalRef;
    public selectedRangeLabel: any = "";
    public dateFieldPosition: any = { x: 0, y: 0 };
    /**True, if get accounts request in process */
    public isGetAccountsInProcess: boolean = false;
    /** This will hold the current page number */
    public currentPage: number = 1;
    /** company custom fields list */
    public companyCustomFields$: Observable<any[]>;
    /** Column span length */
    public colspanLength: number = 11;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: "", uniqueName: "" };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current branch data */
    public currentBranchData: any;
    /** This will hold opening balance object */
    public openingBalance: any;
    /** This will hold closing balance amount */
    public closingBalance: number = 0;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Listens for Master open/close event, required to load the data once master is closed */
    public isAddAndManageOpenedFromOutside$: Observable<boolean>;
    /** This will store screen size */
    public isMobileView: boolean = false;
    /** Stores the searched name value for the Name filter */
    public searchedName: FormControl = new FormControl();
    /** True, if name search field is to be shown in the filters */
    public showNameSearch: boolean;
    /** True if today selected */
    public todaySelected: boolean = false;
    /** Holds company name if bank accounts are loaded in case of vendor */
    public bankAccountsLoadedForCompany: boolean = false;
    /** Is get all integrated bank api in progress */
    public isGetAllIntegratedBankInProgress: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** True if single icici bank account is there and is pending for approval */
    public isIciciAccountPendingForApproval: boolean = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private companyServices: CompanyService,
        private commonActions: CommonActions,
        private toaster: ToasterService,
        private contactService: ContactService,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private route: ActivatedRoute,
        private generalAction: GeneralActions,
        private breakPointObservar: BreakpointObserver,
        private modalService: BsModalService,
        private settingsProfileActions: SettingsProfileActions,
        private groupService: GroupService,
        private settingsBranchAction: SettingsBranchActions,
        public currencyPipe: GiddhCurrencyPipe,
        private lightbox: Lightbox) {
        this.searchLoader$ = this.store.pipe(select(p => p.search.searchLoader), takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.agingreport.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.dueAmountReportRequest.page = data.page;
                this.loadPaginationComponent(data);
            }
            this.dueAmountReportData$ = observableOf(data);
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                if (this.activeTab === "vendor" && this.activeCompany?.uniqueName && this.bankAccountsLoadedForCompany !== this.activeCompany?.uniqueName) {
                    this.bankAccountsLoadedForCompany = this.activeCompany?.uniqueName;
                    this.store.dispatch(this.companyActions.getAllIntegratedBankInCompany(this.activeCompany?.uniqueName));
                }
            }
        });
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        this.store.dispatch(this.companyActions.getAllRegistrations());
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.getCompanyCustomField();
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.isAddAndManageOpenedFromOutside$ = this.store.pipe(select(appStore => appStore.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$));
        // localStorage supported
        if (window.localStorage) {
            let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"]));
            if (showColumnObj) {
                if (showColumnObj.closingBalance !== undefined) {
                    delete showColumnObj.closingBalance;
                }
                ;
                this.showFieldFilter = showColumnObj;
                this.setTableColspan();
            }
        }

        this.breakPointObservar.observe([
            "(max-width: 1023px)",
            "(max-width: 767px)",
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result?.breakpoints["(max-width: 1023px)"];
            this.isMobileView = result?.breakpoints["(max-width: 767px)"];
        });

        combineLatest([this.route.params, this.route.queryParams]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            let params = result[0];
            let queryParams = result[1];

            if (params) {
                if ((params["type"] && params["type"].indexOf("customer") > -1) || (queryParams && queryParams.tab && queryParams.tab === "customer")) {
                    this.setActiveTab("customer");
                } else if ((params["type"] && params["type"].indexOf("vendor") > -1) || (queryParams && queryParams.tab && queryParams.tab === "vendor")) {
                    this.setActiveTab("vendor");
                } else {
                    this.setActiveTab("aging-report");
                }
            }
        });

        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);

                setTimeout(() => {
                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;

                        if (this.universalDate && !this.todaySelected) {
                            this.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                            this.selectedDateRange = {
                                startDate: moment(this.universalDate[0]),
                                endDate: moment(this.universalDate[1]),
                            };
                            this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        } else {
                            this.universalDate = [];
                            this.fromDate = "";
                            this.toDate = "";
                        }

                        this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                    });
                }, 100);
            }
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes && this.accountAsideMenuState === "in") {
                this.toggleAccountAsidePane();
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((term: any) => {
                this.searchStr = term;
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, term, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            });

        if (this.activeCompany && this.activeCompany.countryV2) {
            this.getOnboardingForm(this.activeCompany.countryV2.alpha2CountryCode);
        }

        this.store.pipe(select(store => store.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.balanceDecimalPlaces) {
                this.giddhDecimalPlaces = response.balanceDecimalPlaces;
            } else {
                this.giddhDecimalPlaces = 2;
            }
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : "",
                    name: this.activeCompany ? this.activeCompany.name : "",
                    value: this.activeCompany ? this.activeCompany.uniqueName : "",
                    isCompany: true,
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : "";
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : "",
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : "",
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : "",
                        };
                    }
                    this.currentBranchData = _.cloneDeep(this.currentBranch);
                    if (this.currentBranch) {
                        this.currentBranch.name = this.currentBranch.name + (this.currentBranch && this.currentBranch.alias ? ` (${this.currentBranch.alias})` : "");
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: "", to: "" }));
                }
            }
        });
        this.isAddAndManageOpenedFromOutside$.pipe(filter(event => !event)).subscribe(response => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });
        this.searchedName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.searchStr$.next(searchedText);
        });

        this.store.pipe(select(state => state.company), takeUntil(this.destroyed$)).subscribe(response => {
            this.isIciciAccountPendingForApproval = false;
            this.isGetAllIntegratedBankInProgress = response?.isGetAllIntegratedBankInProgress;
            if (response?.integratedBankList?.length > 0) {
                let approvalPendingAccounts = response?.integratedBankList.filter(account => !account.errorMessage);
                if (!approvalPendingAccounts?.length) {
                    this.isIciciAccountPendingForApproval = true;
                }

                this.isICICIIntegrated = true;
            } else {
                this.isICICIIntegrated = false;
            }
            this.cdRef.detectChanges();
        });
    }

    public performActions(type: number, account: any, event?: any) {
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(account.name));
                this.store.dispatch(this.groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
                break;

            case 1: // go to ledger
                this.goToRoute("ledger", `/${this.fromDate}/${this.toDate}`, account?.uniqueName);
                break;

            case 2: // go to sales or purchase
                this.purchaseOrSales = this.activeTab === "customer" ? "sales" : "purchase";
                if (this.purchaseOrSales === "purchase") {
                    this.goToRoute("proforma-invoice/invoice/purchase", "", account?.uniqueName);
                } else {
                    let isCashInvoice = account?.uniqueName === "cash";
                    this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? "cash" : "sales"}`, "", account?.uniqueName);
                }
                break;
            // case 3: // send sms
            //     if (event) {
            //         event.stopPropagation();
            //     }
            //     this.openSmsDialog();
            //     break;
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

    public goToRoute(part: string, additionalParams: string = "", accUniqueName: string) {
        let url = location.href + `?returnUrl=${part}/${accUniqueName}`;

        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }

        if (isElectron) {
            let ipcRenderer = (window as any).require("electron").ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${part}/${accUniqueName}`;
            console.log(ipcRenderer.send("open-url", url));
        } else {
            (window as any).open(url);
        }
    }

    public tabSelected(tabName: "customer" | "aging-report" | "vendor") {
        if (!this.searchStr) {
            this.searchStr = "";
            this.selectedCheckedContacts = [];
            this.selectedAccountsList = [];
            this.allSelectionModel = false;
            this.checkboxInfo = {
                selectedPage: 1,
            };
        }
        if (this.activeCompany && this.currentBranchData) {
            if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                this.currentBranch.name = this.currentBranchData.name;
                this.currentBranch.uniqueName = this.currentBranchData.uniqueName;
                this.currentBranch.alias = this.currentBranchData.alias;
            } else {
                this.currentBranch.name = this.activeCompany.name;
                this.currentBranch.uniqueName = this.activeCompany.uniqueName;
                this.currentBranch.alias = this.activeCompany.nameAlias ? this.activeCompany.nameAlias : this.activeCompany.name;
            }
        }

        if (tabName !== this.activeTab) {
            this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
            this.commonRequest = new ContactAdvanceSearchCommonModal();
            this.isAdvanceSearchApplied = false;
            this.key = "name";
            this.order = "asc";
            this.activeTab = tabName;

            if (this.universalDate && this.universalDate[0] && this.universalDate[1] && !this.todaySelected) {
                this.selectedDateRange = {
                    startDate: moment(this.universalDate[0]),
                    endDate: moment(this.universalDate[1]),
                };
                this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
            } else {
                this.fromDate = "";
                this.toDate = "";
            }

            if (this.activeTab !== "aging-report") {
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, "", this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }

            this.store.dispatch(this.generalAction.setAppTitle(`/pages/contact/${tabName}`));

            if (this.activeTab !== "aging-report") {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
            } else {
                this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
            }
            this.router.navigate(["/pages/contact/", tabName], { replaceUrl: true });
        }
    }

    public setActiveTab(tabName: "customer" | "aging-report" | "vendor") {
        this.searchStr = "";
        this.tabSelected(tabName);
        this.showFieldFilter = new CustomerVendorFiledFilter();
        let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"]));
        if (showColumnObj) {
            if (showColumnObj.closingBalance !== undefined) {
                delete showColumnObj.closingBalance;
            }
            ;
            this.showFieldFilter = showColumnObj;
            this.setTableColspan();
        }

        if (tabName === "vendor") {
            this.store.dispatch(this.companyActions.getAllIntegratedBankInCompany(this.activeCompany?.uniqueName));
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public detectChanges() {
        if (!this.cdRef["destroyed"]) {
            this.cdRef.detectChanges();
        }
    }

    public updateCustomerAcc(openFor: "customer" | "vendor", account: any) {
        this.activeAccountDetails = account;
        this.isUpdateAccount = true;
        this.selectedGroupForCreateAcc = account ? account.groupUniqueName : openFor === "customer" ? "sundrydebtors" : "sundrycreditors";
        this.toggleAccountAsidePane();
    }

    public openAddAndManage(openFor: "customer" | "vendor") {
        this.isUpdateAccount = false;
        this.selectedGroupForCreateAcc = openFor === "customer" ? "sundrydebtors" : "sundrycreditors";
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === "out" ? "in" : "out";

        this.toggleBodyClass();
    }

    public getUpdatedList(grpName?): void {
        if (grpName) {
            if (this.accountAsideMenuState === "in") {
                this.toggleAccountAsidePane();
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        }
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === "in") {
            document.querySelector("body").classList.add("fixed");
        } else {
            document.querySelector("body").classList.remove("fixed");
        }
    }

    public submitCashfreeDetail(f) {
        if (f && f.userName && f.password) {
            let objToSend = cloneDeep(f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        } else {
            this.toaster.errorToast(this.localeData?.cashfree_details_required_message, "Validation");
            return;
        }
    }

    public pageChanged(event: any): void {
        if (this.currentPage !== event.page) {
            this.checkboxInfo.selectedPage = event.page;
            this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
            this.getAccounts(this.fromDate, this.toDate, event.page, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
        }
    }

    public hideListItems() {
        if (this.filterDropDownList) {
            this.filterDropDownList.hide();
        }
    }

    /**
     * Update Comment
     *
     * @param {*} account
     * @memberof ContactComponent
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
     * Delete Comment
     *
     * @param {*} accountUniqueName
     * @memberof ContactComponent
     */
    public deleteComment(accountUniqueName) {
        setTimeout(() => {
            this.contactService.deleteComment(accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res.status === "success") {
                    this.updateCommentIdx = null;
                }
            });
        }, 500);
    }

    /**
     * Checks if we can delete the comments
     *
     * @param {*} accountUniqueName
     * @returns {boolean}
     * @memberof ContactComponent
     */
    public canDeleteComment(accountUniqueName): boolean {
        let account;
        if (this.activeTab === "customer") {
            account = find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        } else {
            account = find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
                return o.uniqueName === accountUniqueName;
            });
        }
        if (account.comment) {
            account.comment = "";
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if we can update the comments
     *
     * @param {*} accountUniqueName
     * @param {*} comment
     * @returns {boolean}
     * @memberof ContactComponent
     */
    public canUpdateComment(accountUniqueName, comment): boolean {
        let account;
        if (this.activeTab === "customer") {
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
            this.contactService.addComment(account.comment, account.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res.status === "success") {
                    this.updateCommentIdx = null;
                    account.comment = cloneDeep(res.body.description);
                }
            });
        }, 500);
    }

    /**
     * Add Selected Value to Message Body
     *
     * @param {*} val
     * @memberof ContactComponent
     */
    public addValueToMsg(val: any) {
        this.typeInTextarea(val.value);
    }

    public typeInTextarea(newText) {
        let el: HTMLInputElement = this.messageBox?.nativeElement;
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

    /**
     * Open Modal for Email
     *
     * @memberof ContactComponent
     */
    public openEmailDialog() {
        this.messageBody.msg = "";
        this.messageBody.subject = "";
        this.messageBody.type = "Email";
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    }

    /**
     * Open Modal for SMS
     *
     * @memberof ContactComponent
     */
    // public openSmsDialog() {
    //     this.messageBody.msg = '';
    //     this.messageBody.type = 'sms';
    //     this.messageBody.btn.set = this.messageBody.btn.sms;
    //     this.messageBody.header.set = this.messageBody.header.sms;
    //     this.mailModal.show();
    // }

    /**
     * Send Email/Sms for Accounts
     *
     * @param {string} groupsUniqueName
     * @returns
     * @memberof ContactComponent
     */
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
                groupUniqueName: groupsUniqueName,
                sortBy: this.key,
                sort: this.order,
            },
        };

        if (this.messageBody.btn.set === this.commonLocaleData?.app_send_email) {
            return this.companyServices.sendEmail(request).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r.status === "success" ? this.toaster.successToast(r.body) : this.toaster.errorToast(r.message);
                    this.checkboxInfo = {
                        selectedPage: 1,
                    };
                    this.selectedItems = [];
                    this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
                });
        } else if (this.messageBody.btn.set === this.commonLocaleData?.app_send_sms) {
            let temp = request;
            delete temp.data["subject"];
            return this.companyServices.sendSms(temp).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r.status === "success" ? this.toaster.successToast(r.body) : this.toaster.errorToast(r.message);
                    this.checkboxInfo = {
                        selectedPage: 1,
                    };
                    this.selectedItems = [];
                    this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;

                });
        }

        if (this.mailModal) {
            this.mailModal.hide();
        }
    }

    public pageChangedDueReport(event: any): void {
        this.dueAmountReportRequest.page = event.page;
    }

    public loadPaginationComponent(s) {
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
            componentInstance.firstText = this.commonLocaleData?.app_first;
            componentInstance.previousText = this.commonLocaleData?.app_previous;
            componentInstance.nextText = this.commonLocaleData?.app_next;
            componentInstance.lastText = this.commonLocaleData?.app_last;
            componentInstance.pageChanged.pipe(takeUntil(this.destroyed$)).subscribe(e => {
                this.pageChangedDueReport(e);
            });
        }
    }

    public selectedDate(value?: any): void {
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
            this.todaySelected = false;
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            this.detectChanges();
        }
    }

    public toggleAllSelection(action: boolean) {
        if (action) {
            this.selectedAccountsList = [];
        }
        this.checkboxInfo[this.checkboxInfo.selectedPage] = action;
        this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
        if (action) {
            if (this.activeTab === "customer") {
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
            if (this.activeTab === "customer") {
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

    public selectAccount(ev: MatCheckboxChange, item: any) {

        this.prepareSelectedContactsList(item, ev.checked);
        if (!ev.checked) {
            this.checkboxInfo[this.checkboxInfo.selectedPage] = false;
            this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
            if (this.selectedCheckedContacts.length === 0) {
                this.selectAllCustomer = false;
                this.selectAllVendor = false;
                this.selectedWhileHovering = "";
            }
        }
    }

    public resetAdvanceSearch() {
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.key = "name";
        this.order = "asc";
        this.getAccounts(this.fromDate, this.toDate,
            null, "true", PAGINATION_LIMIT, "", "", null, (this.currentBranch ? this.currentBranch.uniqueName : ""));
    }

    public applyAdvanceSearch(request: ContactAdvanceSearchCommonModal) {
        this.commonRequest = request;
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        let category = request.category;
        if (category === "openingBalance") {
            this.advanceSearchRequestModal.openingBalanceType = "debit"; // default
            this.advanceSearchRequestModal.openingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        } else if (category === "closingBalance") {
            this.advanceSearchRequestModal.closingBalanceType = "debit"; // default
            this.advanceSearchRequestModal.closingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        } else if (category === "sales") {
            this.advanceSearchRequestModal.debitTotal = request.amount;
            category = "debitTotal";
            this.setAmountType(category, request.amountType);
        } else if (category === "receipt") {
            category = "creditTotal";
            this.advanceSearchRequestModal.creditTotal = request.amount;
            this.setAmountType(category, request.amountType);
        }
        switch (request.amountType) {
            case "GreaterThan":
                this.advanceSearchRequestModal[category + "GreaterThan"] = true;
                this.advanceSearchRequestModal[category + "LessThan"] = false;
                this.advanceSearchRequestModal[category + "Equal"] = false;
                this.advanceSearchRequestModal[category + "NotEqual"] = false;
                break;
            case "LessThan":
                this.advanceSearchRequestModal[category + "GreaterThan"] = false;
                this.advanceSearchRequestModal[category + "LessThan"] = true;
                this.advanceSearchRequestModal[category + "Equal"] = false;
                this.advanceSearchRequestModal[category + "NotEqual"] = false;
                break;
            case "Equals":
                this.advanceSearchRequestModal[category + "GreaterThan"] = false;
                this.advanceSearchRequestModal[category + "LessThan"] = false;
                this.advanceSearchRequestModal[category + "Equal"] = true;
                this.advanceSearchRequestModal[category + "NotEqual"] = false;
                break;
            case "Exclude":
                this.advanceSearchRequestModal[category + "GreaterThan"] = false;
                this.advanceSearchRequestModal[category + "LessThan"] = false;
                this.advanceSearchRequestModal[category + "Equal"] = false;
                this.advanceSearchRequestModal[category + "NotEqual"] = true;
                break;
        }
        this.isAdvanceSearchApplied = true;
        this.getAccounts(this.fromDate, this.toDate,
            null, "true", PAGINATION_LIMIT, "", this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
    }

    public setAmountType(category: string, amountType: string) {
        this.advanceSearchRequestModal[category + "GreaterThan"] = false;
        this.advanceSearchRequestModal[category + "LessThan"] = false;
        this.advanceSearchRequestModal[category + "Equal"] = false;
        this.advanceSearchRequestModal[category + "NotEqual"] = false;
    }

    /**
     * Save CSV File with data from Table
     *
     * @memberof ContactComponent
     */
    public downloadCSV() {
        if (this.activeTab === "customer") {
            this.groupUniqueName = "sundrydebtors";
        } else {
            this.groupUniqueName = "sundrycreditors";
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
                groupUniqueName: this.groupUniqueName,
                sortBy: this.key,
                sort: this.order,
            },
            branchUniqueName: (this.currentBranch ? this.currentBranch.uniqueName : ""),
        };

        this.companyServices.downloadCSV(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.searchLoader$ = observableOf(false);
            if (res.status === "success") {
                let blobData = this.generalService.base64ToBlob(res.body, "text/csv", 512);
                return saveAs(blobData, `${this.groupUniqueName}.csv`);
            }
        });

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
     * @param {string} [branchUniqueName] Current branch selected
     * @memberof ContactComponent
     */
    private getAccounts(fromDate: string, toDate: string, pageNumber?: number, refresh?: string, count: number = PAGINATION_LIMIT, query?: string,
                        sortBy: string = "", order: string = "asc", branchUniqueName?: string): void {
        this.isGetAccountsInProcess = true;
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : "false";
        fromDate = (fromDate) ? fromDate : "";
        toDate = (toDate) ? toDate : "";
        this.currentPage = pageNumber;
        let groupUniqueName = (this.activeTab === "customer") ? "sundrydebtors" : "sundrycreditors";

        if (this.activeTab === "aging-report") {
            return;
        }

        this.contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order, this.advanceSearchRequestModal, branchUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && res.body && res.status === "success") {
                this.openingBalance = res.body.openingBalance;

                if (this.activeTab === "customer" && this.openingBalance) {
                    if (this.openingBalance.type === "CREDIT") {
                        this.closingBalance = Number("-" + this.openingBalance.amount) || 0;
                    } else if (this.openingBalance.type === "DEBIT") {
                        this.closingBalance = Number(this.openingBalance.amount) || 0;
                    }
                }

                if (this.activeTab === "vendor" && this.openingBalance) {
                    if (this.openingBalance.type === "CREDIT") {
                        this.closingBalance = Number(this.openingBalance.amount) || 0;
                    } else if (this.openingBalance.type === "DEBIT") {
                        this.closingBalance = Number("-" + this.openingBalance.amount) || 0;
                    }
                }

                if (this.activeTab === "customer") {
                    this.closingBalance = Number((this.closingBalance + (res.body.debitTotal - res.body.creditTotal)).toFixed(this.giddhDecimalPlaces)) || 0;
                } else {
                    this.closingBalance = Number((this.closingBalance + (res.body.creditTotal - res.body.debitTotal)).toFixed(this.giddhDecimalPlaces)) || 0;
                }

                this.totalSales = (this.activeTab === "customer" ? res.body.debitTotal : res.body.creditTotal) || 0;
                this.totalReceipts = (this.activeTab === "customer" ? res.body.creditTotal : res.body.debitTotal) || 0;

                if (groupUniqueName === "sundrydebtors") {
                    this.sundryDebtorsAccountsBackup = cloneDeep(res.body);
                    this.totalCustomers = res.body.totalItems;
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
                    this.totalVendors = res.body.totalItems;
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

                if (this.todaySelected) {
                    this.selectedDateRange = {
                        startDate: moment(res.body.fromDate, GIDDH_DATE_FORMAT),
                        endDate: moment(res.body.toDate, GIDDH_DATE_FORMAT),
                    };
                    this.selectedDateRangeUi = moment(res.body.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(res.body.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                }

                this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
                this.detectChanges();
            }
            this.isGetAccountsInProcess = false;
        });
    }

    public editCustomerPosition(ev) {
        let offset = $("#edit-model-basic").position();
        if (offset) {
            let exactPositionTop = offset.top;

            $("#edit-model-basic").css("top", exactPositionTop);
        }
    }

    public columnFilter(event, column) {
        this.showFieldFilter[column] = event;
        this.setTableColspan();
        this.showFieldFilter.selectAll = Object.keys(this.showFieldFilter).filter((filterName) => filterName !== "selectAll").every(filterName => this.showFieldFilter[filterName]);
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"], JSON.stringify(this.showFieldFilter));
        }
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
                    if (formFields && formFields["taxName"]) {
                        this.shouldShowTaxFilter = true;
                    } else {
                        this.shouldShowTaxFilter = false;
                    }
                }
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = "onboarding";
                onboardingFormRequest.country = countryCode;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    private setTableColspan() {
        let balancesColsArr = ["openingBalance"];
        let length = Object.keys(this.showFieldFilter).filter(f => this.showFieldFilter[f]).filter(f => balancesColsArr.includes(f)).length;
        this.tableColsPan = length > 0 ? 4 : 3;
    }

    /**
     * save last state with active tab
     *
     * @private
     * @param {*} url
     * @memberof ContactComponent
     */
    private setStateDetails(url) {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `contact/${url}`;

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
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

        if (this.bulkPaymentModalRef) {
            this.bulkPaymentModalRef.hide();
        }
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
        Object.keys(this.showFieldFilter).forEach(key => this.showFieldFilter[key] = event);
        this.setTableColspan();
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"], JSON.stringify(this.showFieldFilter));
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
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, {
                class: "modal-xl giddh-datepicker-modal",
                backdrop: false,
                ignoreBackdropClick: this.isMobileScreen,
            }),
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
        } else if (indexOfEntry > -1 && !isChecked) {
            this.selectedAccountsList.splice(indexOfEntry, 1);
        }
        // selected contacts list
        let indexOfEntrySelected = this.selectedCheckedContacts.indexOf(element?.uniqueName);
        if (indexOfEntrySelected === -1 && isChecked) {
            this.selectedCheckedContacts.push(element?.uniqueName);
        } else if (indexOfEntrySelected > -1 && !isChecked) {
            this.selectedCheckedContacts.splice(indexOfEntrySelected, 1);
        }

        if (this.activeTab === "customer") {
            this.allSelectionModel = this.sundryDebtorsAccounts?.length === this.selectedCheckedContacts?.length;
        } else {
            this.allSelectionModel = this.sundryCreditorsAccounts?.length === this.selectedCheckedContacts?.length;
        }
    }

    /**
     * To clear selected contacts list
     *
     * @memberof ContactComponent
     */
    public clearSelectedContacts(resetPage: boolean = true): void {
        if (resetPage) {
            this.checkboxInfo = {
                selectedPage: 1,
            };
            this.searchStr = "";
            this.selectedCheckedContacts = [];
            this.selectedAccountsList = [];
            this.allSelectionModel = false;
        }

        this.getAccounts(this.fromDate, this.toDate, this.checkboxInfo.selectedPage, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
    }

    /**
     * API call to get custom field data
     *
     * @memberof ContactComponent
     */
    public getCompanyCustomField(): void {
        this.groupService.getCompanyCustomField().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success") {
                this.companyCustomFields$ = observableOf(response.body);
                if (response.body) {
                    this.colspanLength = 11 + response.body.length;
                    this.addNewFieldFilters(response.body);
                }
            } else {
                this.toaster.errorToast(response.message);
            }
        });
    }

    /**
     * To add new properties in showFieldFilter object
     *
     * @param {*} field
     * @memberof ContactComponent
     */
    public addNewFieldFilters(field: any): void {
        for (let key of field) {
            if (key?.uniqueName) {
                this.showFieldFilter[key.uniqueName] = false;
            }
        }
    }

    /**
     * Branch change handler
     *
     * @memberof ContactComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
    }

    /**
     * This will format the amount in currency format
     *
     * @param {*} amount
     * @returns {*}
     * @memberof ContactComponent
     */
    public formatAmountInCurrency(amount: any): any {
        let formattedAmount = this.currencyPipe.transform(amount);
        formattedAmount = formattedAmount?.replace(/,/g, "");
        formattedAmount = formattedAmount?.replace(/'/g, "");
        formattedAmount = formattedAmount?.replace(/ /g, "");
        return formattedAmount;
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof ContactComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.messageBody.header.email = this.commonLocaleData?.app_send_email;
            this.messageBody.header.sms = this.commonLocaleData?.app_send_sms;

            this.messageBody.btn.email = this.commonLocaleData?.app_send_email;
            this.messageBody.btn.sms = this.commonLocaleData?.app_send_sms;

            this.dataVariables = [
                {
                    name: this.localeData?.data_variables?.opening_balance,
                    value: "%s_OB",
                },
                {
                    name: this.localeData?.data_variables?.closing_balance,
                    value: "%s_CB",
                },
                {
                    name: this.localeData?.data_variables?.credit_total,
                    value: "%s_CT",
                },
                {
                    name: this.localeData?.data_variables?.debit_total,
                    value: "%s_DT",
                },
                {
                    name: this.localeData?.data_variables?.from_date,
                    value: "%s_FD",
                },
                {
                    name: this.localeData?.data_variables?.to_date,
                    value: "%s_TD",
                },
                {
                    name: this.localeData?.data_variables?.magic_link,
                    value: "%s_ML",
                },
                {
                    name: this.localeData?.data_variables?.account_name,
                    value: "%s_AN",
                },
            ];
        }
    }

    /**
     * Click outside handler for Name field search
     *
     * @param {*} event Click outside event
     * @param {*} element Focused element
     * @param {string} searchedFieldName Name of the field through which search is to be performed
     * @return {*}  {void}
     * @memberof ContactComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.searchedName.value) {
                return;
            }
            if (this.generalService.childOf(event.target, element)) {
                return;
            } else {
                this.showNameSearch = false;
            }
        }
    }

    /**
     * Toogles the search field
     *
     * @param {string} fieldName Field name to toggle
     * @param {*} el Element reference for focusing
     * @memberof ContactComponent
     */
    public toggleSearch(fieldName: string, el: any): void {
        if (fieldName === "name") {
            this.showNameSearch = true;
        }
        setTimeout(() => {
            el.focus();
        });
    }

    /**
     * Returns the placeholder for the current searched field
     *
     * @param {string} fieldName Field name for which placeholder is required
     * @returns {string} Placeholder text
     * @memberof ContactComponent
     */
    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name") {
            return this.localeData?.search_name;
        }
        return "";
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
            let message = this.localeData?.bank_transactions_message;
            message = message.replace("[SUCCESS]", this.selectedCheckedContacts.length - this.selectedAccountsList.length);
            message = message.replace("[TOTAL]", this.selectedCheckedContacts.length);

            this.toaster.infoToast(message);
        }
        if (this.selectedAccountsList.length || this.selectedAccForPayment) {
            this.selectedAccountsList = [this.selectedAccountsList[0]]; // since we don't have bulk payment now, we are only passing 1st available value, once bulk payment is done from API, we will remove this line of code
            this.bulkPaymentModalRef = this.modalService.show(template,
                Object.assign({}, { class: "payment-modal modal-xl" }),
            );
        }
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof ContactComponent
     */
    public getPageHeading(): string {
        if (this.isMobileView) {
            if (this.activeTab === "aging-report") {
                return this.localeData?.aging_report;
            } else if (this.activeTab !== "aging-report") {
                return this.localeData?.customer;
            }
        } else {
            return "";
        }
    }

    public sort(key, ord = "asc") {
        this.key = key;
        this.order = ord;

        this.getAccounts(this.fromDate, this.toDate, null, "false", PAGINATION_LIMIT, this.searchStr, key, ord, (this.currentBranch ? this.currentBranch.uniqueName : ""));
    }

    /**
     * This will show the integration process GIF in lightbox
     *
     * @memberof ContactComponent
     */
    public showIntegrationProcess(): void {
        const images = [];
        images.push({ src: this.imgPath + "icici-integration-process.gif" });
        this.lightbox.open(images, 0);
    }
}
