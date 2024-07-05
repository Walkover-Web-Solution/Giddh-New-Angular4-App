import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { API_COUNT_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AdjustmentInventoryListComponentStore } from './utility/adjust-inventory-list.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AdjustmentInventoryListResponse, InventorytAdjustmentReportQueryRequest } from '../../../models/api-models/Inventory';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
    selector: 'adjust-inventory-list',
    templateUrl: './adjust-inventory-list.component.html',
    styleUrls: ['./adjust-inventory-list.component.scss'],
    providers: [AdjustmentInventoryListComponentStore]
})

export class AdjustInventoryLisComponent implements OnInit {
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Holds Datepicker Reference */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['referenceNo', 'name', 'reason', 'status', 'ADJUSTED_BY', 'TYPE', 'DATE'];
    /** Hold the data of subscriptions */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Adjustment inventory  observable*/
    public adjustmentInventoryList$ = this.componentStore.select(state => state.adjustInventroyList);
    /** Holds Store Adjustment inventory list in progress API success state as observable*/
    public adjustmentInventoryInProgress$ = this.componentStore.select(state => state.adjustInventroyListInProgress);
    /* This will hold list of subscriptions */
    public adjustmentInventoryList: AdjustmentInventoryListResponse[] = [];
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will use for subscription pagination logs object */
    public adjustInventoryListRequest: InventorytAdjustmentReportQueryRequest;
    /** Hold table page index number*/
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: any[] = [20,
        50,
        100];
    /* Hold list searching value */
    public inlineSearch: any = '';
    /** Form Group for subscription form */
    public adjustInventoryListForm: FormGroup;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /* True if show Reason show */
    public reason: boolean = false;
    /* True if show Reference No show */
    public referenceNo: boolean = false;
    /* True if show Adjusted by show */
    public adjustedBy: boolean = false;
    /* True if show Status by show */
    public status: boolean = false;
    /* True if show Stock/Group Name show */
    public name: boolean = false;
    public inventoryType: 'stock' | 'group';
    public showData: boolean = true;


    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private readonly componentStore: AdjustmentInventoryListComponentStore,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.adjustInventoryListRequest = new InventorytAdjustmentReportQueryRequest();

    }

    public ngOnInit(): void {

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                // this.branchTransferGetRequestParams.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                // this.branchTransferGetRequestParams.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAllAdjusmentReports(false);
            }
        });

        this.initForm();
        this.getAllAdjusmentReports(true);

        /** Get Discount List */
        this.adjustmentInventoryList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.adjustmentInventoryList = response?.body?.results;
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
                if (this.dataSource?.filteredData?.length || this.adjustInventoryListForm?.controls['referenceNo']?.value ||
                    this.adjustInventoryListForm?.controls['name']?.value ||
                    this.adjustInventoryListForm?.controls['status']?.value ||
                    this.adjustInventoryListForm?.controls['reason']?.value) {
                    this.showData = true;
                } else {
                    this.showData = false;
                }
                this.dataSource.paginator = this.paginator;
                this.adjustInventoryListRequest.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.adjustmentInventoryList = [];
                this.showData = false;
                this.adjustInventoryListRequest.totalItems = 0;
            }
        });
    }

    /**
  * This will use for init subscription form
  *
  * @memberof SubscriptionComponent
  */
    public initForm(): void {
        this.adjustInventoryListForm = this.formBuilder.group({
            referenceNo: null,
            name: null,
            reason: null,
            status: null
        });
    }

    public getAllAdjusmentReports(resetPage: boolean): void {
        if (resetPage) {
            this.adjustInventoryListRequest.page = 1;
        }
        this.componentStore.getAllAdjustmentInventoryReport(this.adjustInventoryListRequest);
    }

    /**
 * This will be use for table sorting
 *
 * @param {*} event
 * @memberof AdjustInventoryComponent
 */
    public sortChange(event: any): void {
        this.adjustInventoryListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.adjustInventoryListRequest.sortBy = event?.active;
        this.adjustInventoryListRequest.page = 1;
        this.getAllAdjusmentReports(false);
    }

    public selectedInventoryType(inventoryType: string): void {
        this.adjustInventoryListRequest.sortBy = inventoryType;
        this.adjustInventoryListRequest.page = 1;
        this.getAllAdjusmentReports(false);
    }

    /*datepicker funcation*/
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
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }
    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /* Create combo aside pane open function */
    public addInventory(): void {

    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof SubscriptionComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.changeDetection.detectChanges();
        }
    }


    /**
   * Returns the search field text
   *
   * @param {*} title
   * @returns {string}
   * @memberof SubscriptionComponent
   */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

    /**
     * Handles clicks outside the specified element for filtering in the SubscriptionComponent.
     *
     * @param event - The event triggered by the click.
     * @param element - The element outside of which the click occurred.
     * @param searchedFieldName - The name of the field being searched for.
     * @memberof SubscriptionComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        console.log(event, element, searchedFieldName);
        if (searchedFieldName === 'name') {
            if (this.adjustInventoryListForm?.controls['name'].value !== null && this.adjustInventoryListForm?.controls['name'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'reason') {
            if (this.adjustInventoryListForm?.controls['reason'].value !== null && this.adjustInventoryListForm?.controls['reason'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'status') {
            if (this.adjustInventoryListForm?.controls['status'].value !== null && this.adjustInventoryListForm?.controls['status'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'referenceNo') {
            if (this.adjustInventoryListForm?.controls['referenceNo'].value !== null && this.adjustInventoryListForm?.controls['referenceNo'].value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === 'reason') {
                this.reason = false;
            } else if (searchedFieldName === 'referenceNo') {
                this.referenceNo = false;
            } else if (searchedFieldName === 'adjustedBy') {
                this.adjustedBy = false;
            } else if (searchedFieldName === 'name') {
                this.name = false;
            } else if (searchedFieldName === 'status') {
                this.status = false;
            }
        }
    }

    /**
     * This will be use for toggle search field
     *
     * @param {string} fieldName
     * @param {*} el
     * @memberof SubscriptionComponent
     */
    public toggleSearch(fieldName: string): void {
        console.log(fieldName);
        if (fieldName === 'reason') {
            this.reason = true;
        }
        if (fieldName === 'referenceNo') {
            this.referenceNo = true;
        }
        if (fieldName === 'adjustedBy') {
            this.adjustedBy = true;
        }
        if (fieldName === 'name') {
            this.name = true;
        }
        if (fieldName === 'status') {
            this.status = true;
        }
    }

}
