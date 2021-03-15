import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { AgingAdvanceSearchModal, AgingDropDownoptions, ContactAdvanceSearchCommonModal, DueAmountReportQueryRequest, DueAmountReportResponse } from '../../models/api-models/Contact';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AgingReportActions } from '../../actions/aging-report.actions';
import { cloneDeep, map as lodashMap } from '../../lodash-optimized';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import {ModalOptions} from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as moment from 'moment/moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ContactAdvanceSearchComponent } from '../advanceSearch/contactAdvanceSearch.component';
import { GeneralService } from '../../services/general.service';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../models/user-login-state';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'aging-report',
    templateUrl: 'aging-report.component.html',
    styleUrls: ['aging-report.component.scss']
})

export class AgingReportComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    public totalDueSelectedOption: string = '0';
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
    public universalDate$: Observable<any>;
    public toDate: string;
    public fromDate: string;
    public moment = moment;
    public key: string = 'name';
    public order: string = 'asc';
    public filter: string = '';
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    public searchStr$ = new Subject<string>();
    public searchStr: string = '';
    public isMobileScreen: boolean = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public isAdvanceSearchApplied: boolean = false;
    public agingAdvanceSearchModal: AgingAdvanceSearchModal = new AgingAdvanceSearchModal();
    public commonRequest: ContactAdvanceSearchCommonModal = new ContactAdvanceSearchCommonModal();

    @ViewChild('advanceSearch', {static: true}) public advanceSearch: ModalDirective;
    @ViewChild('paginationChild', {static: true}) public paginationChild: ElementViewContainerRef;
    @ViewChild('filterDropDownList', {static: true}) public filterDropDownList: BsDropdownDirective;
    /** Advance search component instance */
    @ViewChild('agingReportAdvanceSearch', { read: ContactAdvanceSearchComponent, static: true }) public agingReportAdvanceSearch: ContactAdvanceSearchComponent;
    @Output() public creteNewCustomerEvent: EventEmitter<boolean> = new EventEmitter();

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private agingReportActions: AgingReportActions,
        private _cdr: ChangeDetectorRef,
        private _breakpointObserver: BreakpointObserver,
        private componentFactoryResolver: ComponentFactoryResolver,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService) {
        this.agingDropDownoptions$ = this.store.pipe(select(s => s.agingreport.agingDropDownoptions), takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.setDueRangeOpen$ = this.store.pipe(select(s => s.agingreport.setDueRangeOpen), takeUntil(this.destroyed$));
        this.getDueAmountreportData();
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public getDueAmountreportData() {
        this.store.pipe(select(s => s.agingreport.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.dueAmountReportRequest.page = data.page;
                setTimeout(() => this.loadPaginationComponent(data)); // Pagination issue fix
                this.totalDueAmounts = data.overAllDueAmount;
                this.totalFutureDueAmounts = data.overAllFutureDueAmount;;
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
                this.detetcChanges();
            }, 60000);
        });
    }

    public getDueReport() {
        this.store.dispatch(this.agingReportActions.GetDueReport(this.agingAdvanceSearchModal, this.dueAmountReportRequest, this.currentBranch.uniqueName));
    }

    public detetcChanges() {
        this._cdr.detectChanges();
    }

    public ngOnInit() {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.universalDate$.subscribe(a => {
            if (a) {
                this.fromDate = moment(a[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(a[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'aging-report';
        this.dueAmountReportRequest.from = this.fromDate;
        this.dueAmountReportRequest.to = this.toDate;

        this.getDueReport();

        this.store.dispatch(this.agingReportActions.GetDueRange());
        this.agingDropDownoptions$.subscribe(p => {
            this.agingDropDownoptions = cloneDeep(p);
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(term => {
            this.dueAmountReportRequest.q = term;
            this.getDueReport();
        });

        this._breakpointObserver
            .observe(['(max-width: 768px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                this.getDueAmountreportData();
            });
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
                if (!this.currentBranch.uniqueName) {
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
                    this.currentBranch.name = this.currentBranch.name + (this.currentBranch && this.currentBranch.alias ? ` (${this.currentBranch.alias})` : '');
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
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
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = s.count;
            componentInstance.maxSize = 5;
            componentInstance.writeValue(s.page);
            componentInstance.boundaryLinks = true;
            componentInstance.pageChanged.pipe(takeUntil(this.destroyed$)).subscribe(e => {
                this.pageChangedDueReport(e);
            });
        }
    }

    public resetAdvanceSearch() {
        this.agingAdvanceSearchModal = new AgingAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.getDueReport();

        if(this.agingReportAdvanceSearch) {
            this.agingReportAdvanceSearch.reset();
        }
    }

    public applyAdvanceSearch(request: ContactAdvanceSearchCommonModal) {
        this.commonRequest = request;
        this.agingAdvanceSearchModal.totalDueAmount = request.amount;
        if (request.category === 'totalDue') {
            switch (request.amountType) {
                case 'GreaterThan':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = true;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
                case 'LessThan':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = true;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
                case 'Exclude':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = true;
                    break;
                case 'Equals':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = true;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
            }
        } else {
            // Code here for Future Due category
            this.agingAdvanceSearchModal.includeTotalDueAmount = false;
        }
        this.isAdvanceSearchApplied = true;
        this.getDueReport();
    }

    public sort(key: string, ord: 'asc' | 'desc' = 'asc') {
        if (key.includes('range')) {
            this.dueAmountReportRequest.rangeCol = parseInt(key.replace('range', ''));
            this.dueAmountReportRequest.sortBy = 'range';
        } else {
            this.dueAmountReportRequest.rangeCol = null;
            this.dueAmountReportRequest.sortBy = key;
        }

        this.key = key;
        this.order = ord;

        this.dueAmountReportRequest.sort = ord;
        this.getDueReport();
    }

    public toggleAdvanceSearchPopup() {
        this.advanceSearch.toggle();
    }

    /**
     * Branch change handler
     *
     * @memberof AgingReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.getDueReport();
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
}
