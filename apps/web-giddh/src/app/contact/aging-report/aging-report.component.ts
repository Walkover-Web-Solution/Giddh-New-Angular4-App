import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';

import { AgingAdvanceSearchModal, AgingDropDownoptions, ContactAdvanceSearchCommonModal, DueAmountReportQueryRequest, DueAmountReportResponse } from '../../models/api-models/Contact';

import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';
import { AgingReportActions } from '../../actions/aging-report.actions';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import * as _ from 'lodash';
import { ContactService } from '../../services/contact.service';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { BsDropdownDirective, ModalDirective, ModalOptions, PaginationComponent } from 'ngx-bootstrap';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as moment from 'moment/moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
    selector: 'aging-report',
    templateUrl: 'aging-report.component.html',
    styleUrls: ['aging-report.component.scss']
})
export class AgingReportComponent implements OnInit {
    public totalDueSelectedOption: string = '0';
    public totalDueAmount: number = 0;
    public includeName: boolean = false;
    public names: any = [];
    public dueAmountReportRequest: DueAmountReportQueryRequest;
    public sundryDebtorsAccountsForAgingReport: IOption[] = [];
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

    @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
    @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
    @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
    @Output() public creteNewCustomerEvent: EventEmitter<boolean> = new EventEmitter();
    private createAccountIsSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private _toasty: ToasterService,
        private router: Router, private _agingReportActions: AgingReportActions,
        private _contactService: ContactService,
        private _cdr: ChangeDetectorRef,
        private _breakpointObserver: BreakpointObserver,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.agingDropDownoptions$ = this.store.select(s => s.agingreport.agingDropDownoptions).pipe(takeUntil(this.destroyed$));
        this.dueAmountReportRequest = new DueAmountReportQueryRequest();
        this.setDueRangeOpen$ = this.store.select(s => s.agingreport.setDueRangeOpen).pipe(takeUntil(this.destroyed$));
        this.getDueAmountreportData();
        this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    public getDueAmountreportData() {
        this.store.select(s => s.agingreport.data).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.results) {
                this.dueAmountReportRequest.page = data.page;
                setTimeout(() => this.loadPaginationComponent(data)); // Pagination issue fix
                this.totalDueAmounts = data.overAllDueAmount;
                this.totalFutureDueAmounts = data.overAllFutureDueAmount;;
            }
            this.dueAmountReportData$ = of(data);
            if (data) {
                _.map(data.results, (obj: any) => {
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
        this.store.dispatch(this._agingReportActions.GetDueReport(this.agingAdvanceSearchModal, this.dueAmountReportRequest));
    }
    public detetcChanges() {
        this._cdr.detectChanges();
    }
    public ngOnInit() {

        this.universalDate$.subscribe(a => {
            if (a) {
                this.fromDate = moment(a[0]).format('DD-MM-YYYY');
                this.toDate = moment(a[1]).format('DD-MM-YYYY');

                // get sundry accounts when application date changes
                this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
            }
        });
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'aging-report';
        this.dueAmountReportRequest.from = this.fromDate;
        this.dueAmountReportRequest.to = this.toDate;

        this.getDueReport();

        // this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

        this.store.dispatch(this._agingReportActions.GetDueRange());
        this.agingDropDownoptions$.subscribe(p => {
            this.agingDropDownoptions = _.cloneDeep(p);
        });

        this.searchStr$.pipe(
            debounceTime(1000),
            distinctUntilChanged()
        ).subscribe(term => {
            this.dueAmountReportRequest.q = term;
            this.getDueReport();
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
            }
        });

        this._breakpointObserver
            .observe(['(max-width: 768px)'])
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                this.getDueAmountreportData();
            });

    }

    public openAgingDropDown() {
        this.store.dispatch(this._agingReportActions.OpenDueRange());
    }

    public closeAgingDropDownop(options: AgingDropDownoptions) {
        //
    }

    public hideListItems() {
        this.filterDropDownList.hide();
    }

    public pageChangedDueReport(event: any): void {
        this.dueAmountReportRequest.page = event.page;
        this.getDueReport();
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

    public resetAdvanceSearch() {
        this.agingAdvanceSearchModal = new AgingAdvanceSearchModal();
        this.commonRequest = new ContactAdvanceSearchCommonModal();
        this.isAdvanceSearchApplied = false;
        this.getDueReport();
    }

    public applyAdvanceSearch(request: ContactAdvanceSearchCommonModal) {
        this.commonRequest = request;
        this.agingAdvanceSearchModal.totalDueAmount = request.amount;
        if (request.category === 'totalDue') {
            //this.agingAdvanceSearchModal.includeTotalDueAmount = true;
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

    private getSundrydebtorsAccounts(fromDate: string, toDate: string, count: number = 200000) {
        this._contactService.GetContacts(fromDate, toDate, 'sundrydebtors', 1, 'false', count).subscribe((res) => {
            if (res.status === 'success') {
                this.sundryDebtorsAccountsForAgingReport = _.cloneDeep(res.body.results).map(p => ({
                    label: p.name,
                    value: p.uniqueName
                }));
            }
        });
    }
}
