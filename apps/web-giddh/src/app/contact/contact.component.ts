import { animate, state, style, transition, trigger } from "@angular/animations";
import { BreakpointObserver } from "@angular/cdk/layout";
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { saveAs } from "file-saver";
import * as dayjs from "dayjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { PaginationComponent } from "ngx-bootstrap/pagination";
import { BehaviorSubject, combineLatest, Observable, of as observableOf, ReplaySubject, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from "rxjs/operators";
import { cloneDeep, find, isEqual, map as lodashMap, uniq } from "../../app/lodash-optimized";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { SettingsProfileActions } from "../actions/settings/profile/settings.profile.action";
import { SettingsIntegrationActions } from "../actions/settings/settings.integration.action";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../app.constant";
import { OnboardingFormRequest } from "../models/api-models/Common";
import {
    ContactAdvanceSearchCommonModal,
    ContactAdvanceSearchModal,
    DueAmountReportQueryRequest,
    DueAmountReportResponse,
} from "../models/api-models/Contact";
import { BulkEmailRequest } from "../models/api-models/Search";
import { CashfreeClass } from "../models/api-models/SettingsIntegraion";
import { IFlattenAccountsResultItem } from "../models/interfaces/flattenAccountsResultItem.interface";
import { CompanyService } from "../services/companyService.service";
import { ContactService } from "../services/contact.service";
import { GeneralService } from "../services/general.service";
import { ToasterService } from "../services/toaster.service";
import { ElementViewContainerRef } from "../shared/helpers/directives/elementViewChild/element.viewchild.directive";
import { AppState } from "../store";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../shared/helpers/defaultDateFormat";
import { SettingsBranchActions } from "../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../models/user-login-state";
import { GiddhCurrencyPipe } from "../shared/helpers/pipes/currencyPipe/currencyType.pipe";
import { FormControl } from "@angular/forms";
import { Lightbox } from "ngx-lightbox";
import { MatCheckboxChange } from "@angular/material/checkbox/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { CustomFieldsService } from "../services/custom-fields.service";

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
    public dayjs = dayjs;
    public toDate: string;
    public fromDate: string;
    public selectAllVendor: boolean = false;
    public selectAllCustomer: boolean = false;
    public selectedCheckedContacts: string[] = [];
    public activeAccountDetails: any;
    public allSelectionModel: boolean = false;
    public localStorageKeysForFilters = { customer: "customerFilterStorageV2", vendor: "vendorFilterStorageV2" };
    public isMobileScreen: boolean = false;
    public isICICIIntegrated: boolean = false;
    public selectedWhileHovering: string;
    public searchLoader$: Observable<boolean>;
    /** sorting */
    public key: string = "name"; // set default
    public order: string = "asc";
    public showFieldFilter: {
        [columnname: string]: {
            displayName: string;
            visibility: boolean
        }
    } = {};
    public updateCommentIdx: number = null;
    public searchStr$ = new Subject<string>();
    public searchStr: string = "";
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("paginationChild", { static: true }) public paginationChild: ElementViewContainerRef;
    @ViewChild("staticTabs", { static: true }) public staticTabs: MatTableModule;
    @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>;
    @ViewChild("messageBox", { static: false }) public messageBox: ElementRef;
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
    // public bulkPaymentModalRef: BsModalRef;
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
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
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
    /** Instance of mail modal */
    @ViewChild("mailModal") public mailModalComponent: TemplateRef<any>;
    /** Instance of bulk payment modal */
    @ViewChild("template") public bulkPaymentModalRef: TemplateRef<any>;
    public displayColumns: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    public displayColumns$: Observable<string[]> = this.displayColumns.asObservable().pipe(takeUntil(this.destroyed$), distinctUntilChanged(isEqual));
    public customerColumns: string[] = ["customerName", "sales", "receipt", "closing"];
    public vendorColumns: string[] = ["vendorName", "purchase", "payment", "closing"];
    /** True/false if select all is checked */
    public selectAll: boolean = false;
    /** Holds count of available columns on the page */
    public availableColumnsCount: any[] = [];
    /** True if we should select all checkbox */
    public showSelectAll: boolean = false;
    /** True if custom fields finished loading */
    public customFieldsLoaded: boolean = true;
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'account'
    };
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /** True if it's default load */
    public defaultLoad: boolean = true;

    constructor(
        public dialog: MatDialog,
        private store: Store<AppState>,
        private router: Router,
        private companyServices: CompanyService,
        private commonActions: CommonActions,
        private toaster: ToasterService,
        private contactService: ContactService,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private route: ActivatedRoute,
        private generalAction: GeneralActions,
        private breakPointObservar: BreakpointObserver,
        private modalService: BsModalService,
        private settingsProfileActions: SettingsProfileActions,
        private settingsBranchAction: SettingsBranchActions,
        public currencyPipe: GiddhCurrencyPipe,
        private lightbox: Lightbox,
        private renderer: Renderer2,
        private customFieldsService: CustomFieldsService) {

        this.searchLoader$ = this.store.pipe(select(state => state.search.searchLoader), takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));

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
        this.renderer.addClass(document.body, 'contact-body');
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.store.dispatch(this.companyActions.getAllRegistrations());
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.isAddAndManageOpenedFromOutside$ = this.store.pipe(select(appStore => appStore.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$));
        // localStorage supported
        if (window.localStorage) {
            let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"]));
            if (showColumnObj) {
                if (showColumnObj.closingBalance !== undefined) {
                    delete showColumnObj.closingBalance;
                }
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
                    const activeTab = this.activeTab;
                    if (activeTab !== "customer") {
                        this.setActiveTab("customer");
                    }
                    if (activeTab === "vendor" && this.localeData?.page_heading) {
                        this.availableColumnsCount = [];
                        this.showNameSearch = false;
                        this.searchedName?.reset();
                        this.translationComplete(true);
                    }
                } else if ((params["type"] && params["type"].indexOf("vendor") > -1) || (queryParams && queryParams.tab && queryParams.tab === "vendor")) {
                    const activeTab = this.activeTab;
                    if (activeTab !== "vendor") {
                        this.setActiveTab("vendor");
                    }
                    if (activeTab === "customer" && this.localeData?.page_heading) {
                        this.availableColumnsCount = [];
                        this.showNameSearch = false;
                        this.searchedName?.reset();
                        this.translationComplete(true);
                    }
                } else {
                    this.setActiveTab("aging-report");
                }
                this.setDisplayColumns();
            }
        });

        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);

                setTimeout(() => {

                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;

                        if (this.universalDate && !this.todaySelected) {
                            this.fromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.toDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                            this.selectedDateRange = {
                                startDate: dayjs(this.universalDate[0]),
                                endDate: dayjs(this.universalDate[1]),
                            };
                            this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
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

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.accountAsideMenuState === "in") {
                    this.toggleAccountAsidePane();
                }
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });

        this.store.pipe(select(state => state.sales.updatedAccountDetails), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((term: any) => {
                if (!this.defaultLoad) {
                    this.searchStr = term;
                    this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, term, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                }
                this.defaultLoad = false;
            });

        if (this.activeCompany && this.activeCompany.countryV2) {
            this.getOnboardingForm(this.activeCompany.countryV2.alpha2CountryCode);
        }

        this.store.pipe(select(store => store.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.balanceDecimalPlaces) {
                    this.giddhDecimalPlaces = response.balanceDecimalPlaces;
                } else {
                    this.giddhDecimalPlaces = 2;
                }
            } else {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch?.alias,
                    value: branch?.uniqueName,
                    name: branch?.name,
                    parentBranch: branch?.parentBranch
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
                        this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
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
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.searchStr$.next(searchedText);
            }
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
            this.router.navigate([`/pages/${part}/${accUniqueName}`]);
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
                this.currentBranch.uniqueName = this.activeCompany?.uniqueName;
                this.currentBranch.alias = this.activeCompany.nameAlias ? this.activeCompany.nameAlias : this.activeCompany.name;
            }
        }

        if (tabName !== this.activeTab) {
            this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
            this.commonRequest = new ContactAdvanceSearchCommonModal();
            this.isAdvanceSearchApplied = false;
            this.key = (tabName === "vendor") ? "amountDue" : "name";
            this.order = (tabName === "vendor") ? "desc" : "asc";
            this.activeTab = tabName;

            if (this.universalDate && this.universalDate[0] && this.universalDate[1] && !this.todaySelected) {
                this.selectedDateRange = {
                    startDate: dayjs(this.universalDate[0]),
                    endDate: dayjs(this.universalDate[1]),
                };
                this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
            } else {
                this.fromDate = "";
                this.toDate = "";
            }

            if (this.activeTab !== "aging-report") {
                this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, "", this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
            }

            this.store.dispatch(this.generalAction.setAppTitle(`/pages/contact/${tabName}`));
            this.router.navigate(["/pages/contact/", tabName], { replaceUrl: true });
        }
    }

    public setActiveTab(tabName: "customer" | "aging-report" | "vendor") {
        this.searchStr = "";
        this.tabSelected(tabName);
        this.showFieldFilter = {};
        let showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"]));
        if (showColumnObj) {
            if (showColumnObj.closingBalance !== undefined) {
                delete showColumnObj.closingBalance;
            }
            this.showFieldFilter = showColumnObj;
            this.setTableColspan();
        }

        if (tabName === "vendor") {
            this.store.dispatch(this.companyActions.getAllIntegratedBankInCompany(this.activeCompany?.uniqueName));
        }
    }

    public ngOnDestroy() {
        this.renderer.removeClass(document.body, 'contact-body');
        localStorage.removeItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"]);
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

    public getUpdatedList(grpName?: any): void {
        if (grpName) {
            this.store.pipe(select(state => state.groupwithaccounts.createAccountInProcess), takeUntil(this.destroyed$)).subscribe(response => {
                if (!response && this.accountAsideMenuState === "in") {
                    this.toggleAccountAsidePane();
                    this.getAccounts(this.fromDate, this.toDate, null, "true", PAGINATION_LIMIT, this.searchStr, this.key, this.order, (this.currentBranch ? this.currentBranch.uniqueName : ""));
                }
            });
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
            this.toaster.showSnackBar("error", this.localeData?.cashfree_details_required_message, this.commonLocaleData?.app_validation);
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

    /**
     * Update Comment
     *
     * @param {*} account
     * @memberof ContactComponent
     */
    public updateComment(account) {
        if (account.comment) {
            let canUpdate = this.canUpdateComment(account?.uniqueName, account?.comment);
            if (canUpdate) {
                this.addComment(account);
            } else {
                this.updateCommentIdx = null;
            }
        } else {
            let canDelete = this.canDeleteComment(account?.uniqueName);
            if (canDelete) {
                this.deleteComment(account?.uniqueName);
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
                if (res?.status === "success") {
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
                return o?.uniqueName === accountUniqueName;
            });
        } else {
            account = find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
                return o?.uniqueName === accountUniqueName;
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
                return o?.uniqueName === accountUniqueName;
            });
        } else {
            account = find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
                return o?.uniqueName === accountUniqueName;
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
            this.contactService.addComment(account?.comment, account?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res?.status === 'success') {
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
        let after = text.substring(end, text?.length);
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + newText?.length;
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
        this.dialog.open(this.mailModalComponent, {
            panelClass: 'mail-model-container'
        });
    }

    /**
     * Closes all dialogs
     *
     * @memberof ContactComponent
     */
    public closeAllDialogs(): void {
        this.dialog.closeAll();
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
                    r?.status === "success" ? this.toaster.showSnackBar("success", r?.body) : this.toaster.showSnackBar("error", r?.message);
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
                    r?.status === "success" ? this.toaster.showSnackBar("success", r?.body) : this.toaster.showSnackBar("error", r?.message);
                    this.checkboxInfo = {
                        selectedPage: 1,
                    };
                    this.selectedItems = [];
                    this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;

                });
        }

        if (this.mailModalComponent) {
            this.dialog.closeAll();
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
            componentInstance.totalPages = s.totalPages;
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
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

    public selectAccount(ev: MatCheckboxChange, item: any) {
        this.prepareSelectedContactsList(item, ev.checked);
        if (!ev.checked) {
            this.checkboxInfo[this.checkboxInfo.selectedPage] = false;
            this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
            if (this.selectedCheckedContacts?.length === 0) {
                this.selectAllCustomer = false;
                this.selectAllVendor = false;
                this.selectedWhileHovering = "";
            }
        }
    }

    public resetAdvanceSearch() {
        this.showClearFilter = false;
        this.advanceSearchRequestModal = new ContactAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.key = (this.activeTab === "vendor") ? "amountDue" : "name";
        this.order = (this.activeTab === "vendor") ? "desc" : "asc";
        if (!this.searchedName?.value) {
            this.getAccounts(this.fromDate, this.toDate,
                null, "true", PAGINATION_LIMIT, "", "", null, (this.currentBranch ? this.currentBranch.uniqueName : ""));
        }
        this.searchedName?.reset();
        this.searchStr = "";
        this.showNameSearch = false;
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
            if (res?.status === "success") {
                let blobData = this.generalService.base64ToBlob(res?.body, "text/csv", 512);
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

        if (this.activeTab === "aging-report" || (!this.todaySelected && (!fromDate || !toDate))) {
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
                        // let customFields = [];
                        // element.customFields?.forEach(field => {
                        //     customFields[field?.uniqueName] = [];
                        //     customFields[field?.uniqueName] = field;
                        // });

                        // element.customFields = customFields;

                        let indexOfItem = this.selectedCheckedContacts?.indexOf(element?.uniqueName);
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
                        // let customFields = [];
                        // element.customFields?.forEach(field => {
                        //     customFields[field?.uniqueName] = [];
                        //     customFields[field?.uniqueName] = field;
                        // });

                        // element.customFields = customFields;

                        let indexOfItem = this.selectedCheckedContacts?.indexOf(element?.uniqueName);
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
                        startDate: dayjs(res.body.fromDate, GIDDH_DATE_FORMAT),
                        endDate: dayjs(res.body.toDate, GIDDH_DATE_FORMAT),
                    };
                    this.selectedDateRangeUi = dayjs(res.body.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(res.body.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                }

                this.allSelectionModel = this.checkboxInfo[this.checkboxInfo.selectedPage] ? true : false;
                this.detectChanges();
            }
            this.isGetAccountsInProcess = false;
        });
    }

    public columnFilter(event: boolean, column: string) {
        if (this.showFieldFilter[column]) {
            this.showFieldFilter[column].visibility = event;
        }
        this.setTableColspan();

        this.selectAll = Object.keys(this.showFieldFilter).every(filterName => this.showFieldFilter[filterName].visibility);

        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"], JSON.stringify(this.showFieldFilter));
        }
        this.setDisplayColumns();
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
        let balancesColsArr = ['openingBalance'];
        let length = Object.keys(this.showFieldFilter)?.filter(f => this.showFieldFilter[f])?.filter(f => balancesColsArr.includes(f))?.length;
        this.tableColsPan = length > 0 ? 4 : 3;
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
            this.dialog.closeAll();
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
        Object.keys(this.showFieldFilter).forEach(key => this.showFieldFilter[key].visibility = event);
        this.setTableColspan();
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === "vendor" ? "vendor" : "customer"], JSON.stringify(this.showFieldFilter));
        }
        this.setDisplayColumns();
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
        let accountExists = this.selectedAccountsList?.filter(account => account?.uniqueName === element?.uniqueName);
        if (!accountExists?.length && isChecked) {
            this.selectedAccountsList.push(element);
        } else if (accountExists?.length > 0 && !isChecked) {
            this.selectedAccountsList = this.selectedAccountsList?.filter(account => account?.uniqueName !== element?.uniqueName);
        }
        // selected contacts list
        let indexOfEntrySelected = this.selectedCheckedContacts?.indexOf(element?.uniqueName);
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
        this.customFieldsService.list(this.customFieldsRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success") {
                if (response.body?.results?.length) {
                    let customFields = response.body.results?.map(field => {
                        return {
                            key: field.fieldName,
                            uniqueName: field?.uniqueName
                        }
                    });

                    this.colspanLength = 11 + customFields?.length;
                    this.addNewFieldFilters(customFields);
                    this.companyCustomFields$ = observableOf(customFields);
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
            this.customFieldsLoaded = true;
            this.cdRef.detectChanges();
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
                let index = Object.keys(this.showFieldFilter).length;
                if (!this.showFieldFilter[key?.uniqueName]) {
                    this.showFieldFilter[key?.uniqueName] = {
                        visibility: false,
                        displayName: key.key,
                    };
                }

                let isColumnAvailable = this.availableColumnsCount?.filter(column => column.value === key?.uniqueName);
                if (!isColumnAvailable?.length) {
                    this.availableColumnsCount.push({ key: index, value: key?.uniqueName });
                }
            }
        }
        this.setDisplayColumns();

        this.selectAll = Object.keys(this.showFieldFilter).every(filterName => this.showFieldFilter[filterName].visibility);
    }

    /**
     * To add new properties in showFieldFilter object
     *
     * @memberof ContactComponent
     */
    public setDisplayColumns(): void {
        const defaultColumms: string[] = this.activeTab === "customer" ? this.customerColumns : this.vendorColumns;
        let computedColumns: string[] = [...defaultColumms, ...Object.keys(this.showFieldFilter)?.filter(key => this.showFieldFilter[key].visibility)];
        if (this.activeTab === "vendor" && computedColumns?.length) {
            computedColumns?.push("action");
        }
        if (computedColumns.findIndex(s => s === "openingBalance") > -1) {
            computedColumns = computedColumns?.filter(s => s !== "openingBalance");
            computedColumns.splice(1, 0, "openingBalance");
        }
        if (computedColumns.findIndex(s => s === "parentGroup") > -1) {
            computedColumns = computedColumns?.filter(s => s !== "parentGroup");
            computedColumns.splice(1, 0, "parentGroup");
        }
        this.displayColumns.next(computedColumns);
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

            const availableColumns = [
                {
                    key: this.commonLocaleData?.app_parent_group,
                    uniqueName: 'parentGroup'
                },
                {
                    key: this.localeData?.opening,
                    uniqueName: 'openingBalance'
                },
                {
                    key: this.localeData?.contacts,
                    uniqueName: 'contact'
                },
                {
                    key: this.commonLocaleData?.app_state,
                    uniqueName: 'state'
                },
                {
                    key: this.commonLocaleData?.app_tax_number,
                    uniqueName: 'gstin'
                },
                {
                    key: this.localeData?.comment,
                    uniqueName: 'comment'
                }
            ];

            this.addNewFieldFilters(availableColumns);
            this.setTableColspan();

            //this.getCompanyCustomField();
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
        this.showClearFilter = false;
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
     * @memberof ContactComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showNameSearch = true;
        }
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
     * @memberof ContactComponent
     */
    public openBulkPaymentModal(item?: any): void {
        this.isBulkPaymentShow = true;
        this.selectedAccForPayment = null;
        if (this.selectedAccountsList?.length) {
            this.selectedAccountsList = this.selectedAccountsList.filter(itemObject => {
                return itemObject?.bankPaymentDetails === true;
            });
            this.selectedAccountsList = this.selectedAccountsList.filter((data, index) => {
                return this.selectedAccountsList?.indexOf(data) === index;
            });
        }
        if (!this.selectedAccountsList?.length && item) {
            if (item.bankPaymentDetails) {
                this.selectedAccForPayment = item;
            }
        }
        if (this.selectedAccountsList?.length < this.selectedCheckedContacts?.length) {
            let message = this.localeData?.bank_transactions_message;
            message = message?.replace("[SUCCESS]", this.selectedCheckedContacts?.length - this.selectedAccountsList?.length);
            message = message?.replace("[TOTAL]", this.selectedCheckedContacts?.length);

            this.toaster.showSnackBar("info", message);
            return;
        }
        if (this.selectedAccountsList?.length > 1) {
            this.toaster.showSnackBar("warning", this.localeData?.bulk_payment_unsupported_error);
        } else {
            if (this.selectedAccountsList?.length || this.selectedAccForPayment) {
                this.dialog.open(this.bulkPaymentModalRef, {
                    width: '980px',
                    panelClass: 'contact-modal'
                });
            }
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
        this.showClearFilter = true;
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

    /**
     * Callback for tab change event
     *
     * @param {*} event
     * @memberof ContactComponent
     */
    public tabChange(event: any): void {
        if (event?.tab?.textLabel === this.localeData?.customer) {
            this.tabSelected("customer");
            this.resetColumns();
        } else if (event?.tab?.textLabel === this.localeData?.vendor) {
            this.tabSelected("vendor");
        } else if (event?.tab?.textLabel === this.localeData?.aging_report) {
            this.tabSelected("aging-report");
        }
    }

    /**
     * This function will use for reset columns
     *
     * @memberof ContactComponent
     */
    private resetColumns(): void {
        this.availableColumnsCount = [];
        this.showFieldFilter = {};
        this.translationComplete(true);
    }
}
