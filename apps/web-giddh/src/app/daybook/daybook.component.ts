import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { DaybookActions } from 'apps/web-giddh/src/app/actions/daybook/daybook.actions';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as moment from 'moment/moment';
import { ModalDirective, PaginationComponent } from 'ngx-bootstrap';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { DaterangePickerComponent } from '../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { DaybookAdvanceSearchModelComponent } from './advance-search/daybook-advance-search.component';

@Component({
    selector: 'daybook',
    templateUrl: './daybook.component.html',
    styleUrls: [`./daybook.component.scss`],
    styles: [`
    .table-container section div > div {
      padding: 8px 8px;
    }

    .trial-balance.table-container > div > section {
      border-left: 0;
    }
  `]
})
export class DaybookComponent implements OnInit, OnDestroy {
    public companyName: string;
    public isAllExpanded: boolean = false;
    public daybookQueryRequest: DaybookQueryRequest;
    public daybookData$: Observable<DayBookResponseModel>;
    public daybookExportRequestType: 'get' | 'post';
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** True, If advance search applied */
    public showAdvanceSearchIcon: boolean = false;
    @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
    @ViewChild('exportDaybookModal') public exportDaybookModal: ModalDirective;
    @ViewChild('dateRangePickerCmp', { read: DaterangePickerComponent }) public dateRangePickerCmp: DaterangePickerComponent;
    @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
    /** Daybook advance search component reference */
    @ViewChild('daybookAdvanceSearch') public daybookAdvanceSearchModelComponent: DaybookAdvanceSearchModelComponent;
    public datePickerOptions: any = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'Last 1 Day': [
                moment().subtract(1, 'days'),
                moment()
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days'),
                moment()
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days'),
                moment()
            ],
            'Last 6 Months': [
                moment().subtract(6, 'months'),
                moment()
            ],
            'Last 1 Year': [
                moment().subtract(12, 'months'),
                moment()
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    /** True, if entry expanded (at least one entry) */
    public isEntryExpanded: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private searchFilterData: any = null;


    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private _companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _daybookActions: DaybookActions,
        private store: Store<AppState>
    ) {

        this.daybookQueryRequest = new DaybookQueryRequest();
        this.initialRequest();
        let companyUniqueName;
        let company;
        store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$))
            .subscribe(p => companyUniqueName = p);

        store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$))
            .subscribe(p => {
                company = p.find(q => q.uniqueName === companyUniqueName);
            });
        this.companyName = company.name;
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        // set state details
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'daybook';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.store.pipe(select(state => state.daybook.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.entries) {
                this.daybookQueryRequest.page = data.page;
                data.entries.map(a => {
                    a.isExpanded = false;
                });
                this.loadPaginationComponent(data);
                this.daybookData$ = observableOf(data);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    public selectedDate(value: any) {
        let from = moment(value.picker.startDate).format('DD-MM-YYYY');
        let to = moment(value.picker.endDate).format('DD-MM-YYYY');
        if ((this.daybookQueryRequest.from !== from) || (this.daybookQueryRequest.to !== to)) {
            this.daybookQueryRequest.from = from;
            this.daybookQueryRequest.to = to;
            this.daybookQueryRequest.page = 0;
            this.go();
        }
    }

    public onOpenAdvanceSearch() {
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
            this.datePickerOptions = {
                ...this.datePickerOptions, startDate: moment(obj.fromDate, GIDDH_DATE_FORMAT).toDate(),
                endDate: moment(obj.toDate, GIDDH_DATE_FORMAT).toDate()
            };
            this.dateRangePickerCmp.render();
            this.daybookQueryRequest.from = obj.fromDate;
            this.daybookQueryRequest.to = obj.toDate;
            this.daybookQueryRequest.page = 0;
            if (obj.action === 'search') {
                this.advanceSearchModel.hide();
                this.go(this.searchFilterData);
                this.showAdvanceSearchIcon = true;
            } else if (obj.action === 'export') {
                this.daybookExportRequestType = 'post';
                this.exportDaybookModal.show();
            }
        } else {
            this.advanceSearchModel.hide();
        }
    }

    public go(withFilters = null) {
        this.store.dispatch(this._daybookActions.GetDaybook(withFilters, this.daybookQueryRequest));
    }

    public toggleExpand() {
        this.isAllExpanded = !this.isAllExpanded;
        this.daybookData$ = this.daybookData$.pipe(map(sc => {
            sc.entries.map(e => e.isExpanded = this.isAllExpanded);
            return sc;
        }));
        this.checkIsStockEntryAvailable();
    }

    public initialRequest() {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(universalDate[1], GIDDH_DATE_FORMAT).toDate()
                };

                this.daybookQueryRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.daybookQueryRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.go();
            }
        });
        this.showAdvanceSearchIcon = false;
        if (this.daybookAdvanceSearchModelComponent) {
            this.daybookAdvanceSearchModelComponent.advanceSearchForm.reset();
        }
    }

    public pageChanged(event: any): void {
        this.daybookQueryRequest.page = event.page;
        this.go(this.searchFilterData);
    }

    /**
     * Loads the pagination component based on data received from the service
     *
     * @param {*} data Data received from the service
     * @memberof DaybookComponent
     */
    public loadPaginationComponent(data: any): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
        if (this.paginationChild && this.paginationChild.viewContainerRef) {
            let viewContainerRef = this.paginationChild.viewContainerRef;
            viewContainerRef.remove();
            if (data && data.totalItems > 20) { // Show pagination only if total number of items are more than 20
                let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
                viewContainerRef.insert(componentInstanceView.hostView);

                let componentInstance = componentInstanceView.instance as PaginationComponent;
                componentInstance.totalItems = data.count * data.totalPages;
                componentInstance.itemsPerPage = data.count;
                componentInstance.maxSize = 5;
                componentInstance.writeValue(data.page);
                componentInstance.boundaryLinks = true;
                componentInstance.pageChanged.subscribe(e => {
                    this.pageChanged(e);
                });
            }
        }
    }

    public exportDaybook() {
        this.daybookExportRequestType = 'get';
        this.exportDaybookModal.show();
    }

    public hideExportDaybookModal(response: any) {
        this.exportDaybookModal.hide();
        if (response !== 'close') {
            this.daybookQueryRequest.type = response.type;
            this.daybookQueryRequest.format = response.fileType;
            this.daybookQueryRequest.sort = response.order;
            if (this.daybookExportRequestType === 'post') {
                this.store.dispatch(this._daybookActions.ExportDaybookPost(this.searchFilterData, this.daybookQueryRequest));
            } else if (this.daybookExportRequestType === 'get') {
                this.store.dispatch(this._daybookActions.ExportDaybook(null, this.daybookQueryRequest));
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
            this.checkIsStockEntryAvailable();
        }
    }

    /**
     *To check is there any stock entry available
     *
     * @memberof DaybookComponent
     */
    public checkIsStockEntryAvailable(): any {
        this.daybookData$.subscribe(item => {
            this.isEntryExpanded = item.entries.some(element => {
                if (element.isExpanded && element.otherTransactions) {
                    return element.otherTransactions.some(otherTrasaction => {
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
        });
    }

    // /**
    //  * To reset advance search form
    //  *
    //  * @memberof DaybookComponent
    //  */
    // public resetAdvanceSearch(): void {
    //     this.showAdvanceSearchIcon = false;
    //     let universalDate;
    //     // get application date
    //     this.universalDate$.pipe(take(1)).subscribe(date => {
    //         universalDate = date;
    //     });

    //     // set date picker date as application date
    //     if (universalDate.length > 1) {
    //         this.daybookQueryRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
    //         this.daybookQueryRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
    //         this.datePickerOptions = {
    //             ...this.datePickerOptions,
    //             startDate: moment(new Date(universalDate[0]), 'DD-MM-YYYY').toDate(),
    //             endDate: moment(new Date(universalDate[1]), 'DD-MM-YYYY').toDate(),
    //             chosenLabel: universalDate[2]
    //         };
    //     }
    //      this.go(this.searchFilterData);
    // }
}

