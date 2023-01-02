import {
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    ChangeDetectorRef,
    Input,
    OnDestroy,
    TemplateRef,
} from "@angular/core";
import {
    AgingAdvanceSearchModal,
    AgingDropDownoptions,
    ContactAdvanceSearchCommonModal,
    DueAmountReportQueryRequest,
    DueAmountReportResponse, Result,
} from "../../models/api-models/Contact";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../store";
import { AgingReportActions } from "../../actions/aging-report.actions";
import { cloneDeep, map as lodashMap } from "../../lodash-optimized";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { PaginationComponent } from "ngx-bootstrap/pagination";
import { ElementViewContainerRef } from "../../shared/helpers/directives/elementViewChild/element.viewchild.directive";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import * as dayjs from "dayjs";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { ContactAdvanceSearchComponent } from "../advanceSearch/contactAdvanceSearch.component";
import { GeneralService } from "../../services/general.service";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../../models/user-login-state";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatMenuTrigger } from "@angular/material/menu";
import { PAGINATION_LIMIT } from "../../app.constant";
@Component({
    selector: "aging-report",
    templateUrl: "aging-report.component.html",
    styleUrls: ["aging-report.component.scss"],
})
export class AgingReportComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public totalDueSelectedOption: string = "0";
    public totalDueAmount: number = 0;
    public includeName: boolean = false;
    public names: any = [];
    public dueAmountReportRequest: DueAmountReportQueryRequest;
    public setDueRangeOpen$: Observable<boolean>;
    public agingDropDownoptions$: Observable<AgingDropDownoptions>;
    public agingDropDownoptions: AgingDropDownoptions;
    public dueAmountReportData$: Observable<DueAmountReportResponse>;
    public totalDueAmounts: number = 0;
    public totalFutureDueAmounts: number = 0;
    public dayjs = dayjs;
    public key: string = "name";
    public order: string = "asc";
    public filter: string = "";
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    public searchStr$ = new Subject<string>();
    public searchStr: string = "";
    public isMobileScreen: boolean = false;
    public isAdvanceSearchApplied: boolean = false;
    public agingAdvanceSearchModal: AgingAdvanceSearchModal = new AgingAdvanceSearchModal();
    public commonRequest: ContactAdvanceSearchCommonModal = new ContactAdvanceSearchCommonModal();
    @ViewChild("advanceSearch") advanceSearchTemplate: TemplateRef<any>;
    @ViewChild("paginationChild", { static: false }) public paginationChild: ElementViewContainerRef;
    @ViewChild("filterDropDownList", { static: true }) public filterDropDownList: BsDropdownDirective;
    /** Advance search component instance */
    @ViewChild("agingReportAdvanceSearch", { read: ContactAdvanceSearchComponent, static: true }) public agingReportAdvanceSearch: ContactAdvanceSearchComponent;
    @Output() public createNewCustomerEvent: EventEmitter<boolean> = new EventEmitter();
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: "", uniqueName: "" };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the searched name value for the Name filter */
    public searchedName: FormControl = new FormControl();
    /** True, if name search field is to be shown in the filters */
    public showNameSearch: boolean;
    /** Observable if loading in process */
    public getAgingReportRequestInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if due range request is in progress */
    private isDueRangeRequestInProgress: boolean = false;
    /** List of columns for table */
    public agingReportDisplayedColumns: string[] = ['customerName', 'parentGroup', 'app_upcoming_due', 'app_days_1', 'app_days_2', 'app_days_3', 'app_days_4', 'app_total_due'];
    /** Datasource of aging report */
    public agingReportDataSource = new MatTableDataSource<Result>([]);
    /** Mat menu instance reference */
    @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** False for on init call */
    public defaultLoad: boolean = true;

    constructor(
        public dialog: MatDialog,
        private store: Store<AppState>,
        private agingReportActions: AgingReportActions,
        private cdr: ChangeDetectorRef,
        private breakpointObserver: BreakpointObserver,
        private componentFactoryResolver: ComponentFactoryResolver,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService) {
        this.agingDropDownoptions$ = this.store.pipe(select(s => s.agingreport.agingDropDownoptions), takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.dueAmountReportRequest.count = PAGINATION_LIMIT;
        this.setDueRangeOpen$ = this.store.pipe(select(s => s.agingreport.setDueRangeOpen), takeUntil(this.destroyed$));
        this.getAgingReportRequestInProcess$ = this.store.pipe(select(s => s.agingreport.getAgingReportRequestInFlight), takeUntil(this.destroyed$));
    }

    public getDueAmountreportData() {
        this.store.pipe(select(s => s.agingreport.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.agingReportDataSource.data = data.results;
                this.dueAmountReportRequest.page = data.page;
                setTimeout(() => this.loadPaginationComponent(data)); // Pagination issue fix
                this.totalDueAmounts = data.overAllDueAmount;
                this.totalFutureDueAmounts = data.overAllFutureDueAmount;
            }
            this.dueAmountReportData$ = of(data);
            if (data) {
                lodashMap(data.results, (obj: any) => {
                    obj.depositAmount = obj.currentAndPastDueAmount[0].dueAmount;
                    obj.dueAmount1 = obj.currentAndPastDueAmount[1].dueAmount;
                    obj.dueAmount2 = obj.currentAndPastDueAmount[2].dueAmount;
                    obj.dueAmount3 = obj.currentAndPastDueAmount[3].dueAmount;
                });
            }
            setTimeout(() => {
                this.detectChanges();
            }, 60000);
        });
    }

    public getDueReport() {
        this.store.dispatch(this.agingReportActions.GetDueReport(this.agingAdvanceSearchModal, this.dueAmountReportRequest, this.currentBranch?.uniqueName));
    }

    public detectChanges() {
        this.cdr.detectChanges();
    }

    public ngOnInit() {
        this.getDueReport();
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        this.getDueAmountreportData();
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.dispatch(this.agingReportActions.GetDueRange());
        this.agingDropDownoptions$.subscribe(p => {
            this.agingDropDownoptions = cloneDeep(p);
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(term => {
            if (!this.defaultLoad) {
                this.showClearFilter = (term) ? true : false;
                this.dueAmountReportRequest.q = term;
                this.getDueReport();
            }
            this.defaultLoad = false;
        });

        this.breakpointObserver
            .observe(["(max-width: 768px)"])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                this.getDueAmountreportData();
            });
        this.store.pipe(
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$),
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
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
                        this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : "";
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : "",
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : "",
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : "",
                        };
                    }
                    this.currentBranch.name = this.currentBranch.name + (this.currentBranch && this.currentBranch.alias ? ` (${this.currentBranch.alias})` : "");
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: "", to: "" }));
                }
            }
        });
        this.searchedName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.searchStr$.next(searchedText);
        });

        this.store.pipe(select(state => state.agingreport.setDueRangeRequestInFlight), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isDueRangeRequestInProgress = true;
            } else {
                if (this.isDueRangeRequestInProgress) {
                    this.isDueRangeRequestInProgress = false;
                    this.getDueReport();
                }
            }
        });
    }

    public openAgingDropDown() {
        this.store.dispatch(this.agingReportActions.OpenDueRange());
    }

    public hideListItems() {
        this.filterDropDownList.hide();
    }

    public pageChangedDueReport(event: any): void {
        this.dueAmountReportRequest.page = event.page;
        this.getDueReport();
    }

    public loadPaginationComponent(s) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
        if (this.paginationChild && this.paginationChild.viewContainerRef) {
            let viewContainerRef = this.paginationChild.viewContainerRef;
            viewContainerRef.remove();

            let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
            viewContainerRef.insert(componentInstanceView.hostView);

            let componentInstance = componentInstanceView.instance as PaginationComponent;
            componentInstance.totalPages = s.totalPages;
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = s.count;
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

    public resetAdvanceSearch() {
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.agingAdvanceSearchModal = new AgingAdvanceSearchModal();
        if (this.agingReportAdvanceSearch) {
            this.agingReportAdvanceSearch.reset();
        }
        this.searchStr$.next('');
        this.searchedName?.reset();
        this.searchStr = "";
        this.showNameSearch = false;
        this.isAdvanceSearchApplied = false;
        this.dueAmountReportRequest.q = '';
        this.sort("name", "asc");
        this.showClearFilter = false;
        this.defaultLoad = true;
    }

    public applyAdvanceSearch(request: ContactAdvanceSearchCommonModal) {
        this.commonRequest = request;
        this.agingAdvanceSearchModal.totalDueAmount = request.amount;
        if (request.category === "totalDue") {
            this.agingAdvanceSearchModal.includeTotalDueAmount = true;
        } else {
            this.agingAdvanceSearchModal.includeTotalDueAmount = false;
        }
        switch (request.amountType) {
            case "GreaterThan":
                this.agingAdvanceSearchModal.totalDueAmountGreaterThan = true;
                this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                break;
            case "LessThan":
                this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                this.agingAdvanceSearchModal.totalDueAmountLessThan = true;
                this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                break;
            case "Exclude":
                this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = true;
                break;
            case "Equals":
                this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                this.agingAdvanceSearchModal.totalDueAmountEqualTo = true;
                this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                break;

            default:
                this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                break;
        }

        this.isAdvanceSearchApplied = true;
        this.showClearFilter = true;
        this.getDueReport();
    }

    public sort(key: string, ord: "asc" | "desc" = "asc") {
        this.showClearFilter = true;
        if (key.includes("range")) {
            this.dueAmountReportRequest.rangeCol = parseInt(key?.replace("range", ""));
            this.dueAmountReportRequest.sortBy = "range";
        } else {
            this.dueAmountReportRequest.rangeCol = null;
            this.dueAmountReportRequest.sortBy = key;
        }

        this.key = key;
        this.order = ord;

        this.dueAmountReportRequest.sort = ord;
        this.getDueReport();
    }

    /**
     * Shows advance search popup
     *
     * @memberof AgingReportComponent
     */
    public showAdvanceSearchPopup(): void {
        this.dialog.open(this.advanceSearchTemplate, {
            width: '630px',
        });
    }

    /**
     * Hides the advance search popup
     *
     * @memberof AgingReportComponent
     */
    public hideAdvanceSearchPopup(): void {
        this.dialog.closeAll();
    }

    /**
     * Branch change handler
     *
     * @memberof AgingReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.getDueReport();
    }

    /**
     * Click outside handler for Name field search
     *
     * @param {*} event Click outside event
     * @param {*} element Focused element
     * @param {string} searchedFieldName Name of the field through which search is to be performed
     * @return {*}  {void}
     * @memberof AgingReportComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        this.showClearFilter = true;
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
     * @memberof AgingReportComponent
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
     * @memberof AgingReportComponent
     */
    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name") {
            return this.localeData?.search_name;
        }
        return "";
    }

    /**
     * Releases memory
     *
     * @memberof AgingReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function will use for emit after click outside on component
     *
     * @memberof AgingReportComponent
     */
    public onCloseMenu() {
        this.menu?.closeMenu();
    }

}
