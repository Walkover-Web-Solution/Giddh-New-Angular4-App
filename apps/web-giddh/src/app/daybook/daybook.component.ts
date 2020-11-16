import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DaybookActions } from 'apps/web-giddh/src/app/actions/daybook/daybook.actions';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as moment from 'moment/moment';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { DaybookQueryRequest } from '../models/api-models/DaybookRequest';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { DaterangePickerComponent } from '../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { DaybookAdvanceSearchModelComponent } from './advance-search/daybook-advance-search.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { GeneralService } from '../services/general.service';

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
    /** True, If loader is working */
    public showLoader: boolean = false;
    public isAllExpanded: boolean = false;
    public daybookQueryRequest: DaybookQueryRequest;
    public daybookData$: Observable<DayBookResponseModel>;
    public daybookExportRequestType: 'get' | 'post';
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** True, If advance search applied */
    public showAdvanceSearchIcon: boolean = false;
    @ViewChild('advanceSearchModel', {static: true}) public advanceSearchModel: ModalDirective;
    @ViewChild('exportDaybookModal', {static: true}) public exportDaybookModal: ModalDirective;
    @ViewChild('dateRangePickerCmp', { read: DaterangePickerComponent, static: false }) public dateRangePickerCmp: DaterangePickerComponent;
    @ViewChild('paginationChild', {static: false}) public paginationChild: ElementViewContainerRef;
    /** Daybook advance search component reference */
    @ViewChild('daybookAdvanceSearch', {static: true}) public daybookAdvanceSearchModelComponent: DaybookAdvanceSearchModelComponent;
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
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private searchFilterData: any = null;


    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private _companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _daybookActions: DaybookActions,
        private store: Store<AppState>, private generalService: GeneralService, private modalService: BsModalService
    ) {

        this.daybookQueryRequest = new DaybookQueryRequest();
        this.initialRequest();
        let companyUniqueName;
        let company;

        this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$))
            .subscribe(p => companyUniqueName = p);

        this.store.pipe(select(p => p.session.companies), takeUntil(this.destroyed$))
            .subscribe(p => {
                company = p.find(q => q.uniqueName === companyUniqueName);
            });
        this.companyName = company.name;
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        // set state details
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'daybook';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.store.pipe(select(state => state.daybook.data), takeUntil(this.destroyed$)).subscribe((data) => {
            if (data && data.entries) {
                this.daybookQueryRequest.page = data.page;
                data.entries.map(item => {
                    item.isExpanded = this.isAllExpanded;
                });
                this.loadPaginationComponent(data);
                this.daybookData$ = observableOf(data);
                this.checkIsStockEntryAvailable();
            }
            this.showLoader = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    public selectedDate(value: any) {
        let from = moment(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        let to = moment(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        if ((this.daybookQueryRequest.from !== from) || (this.daybookQueryRequest.to !== to)) {
            this.showLoader = true;
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
            if (this.dateRangePickerCmp) {
                this.dateRangePickerCmp.render();
            }
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
                this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.daybookQueryRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.daybookQueryRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.go();
            }
        });
        this.showAdvanceSearchIcon = false;
        if (this.daybookAdvanceSearchModelComponent) {
            this.daybookAdvanceSearchModelComponent.advanceSearchForm.reset();
            this.daybookAdvanceSearchModelComponent.resetShselectForceClear();
            this.daybookAdvanceSearchModelComponent.initializeDaybookAdvanceSearchForm();
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
        this.daybookData$.subscribe(item => {
            this.isEntryExpanded = item.entries.some(entry => {
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
        });
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
            if ((this.daybookQueryRequest.from !== this.fromDate) || (this.daybookQueryRequest.to !== this.toDate)) {
                this.showLoader = true;
                this.daybookQueryRequest.from = this.fromDate;
                this.daybookQueryRequest.to = this.toDate;
                this.daybookQueryRequest.page = 0;
                this.go();
            }
        }
    }
}

