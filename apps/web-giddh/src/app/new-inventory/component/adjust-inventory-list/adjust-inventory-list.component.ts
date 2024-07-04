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
    public displayedColumns: string[] = ['companyName', 'billingAccountName', 'subscriberName', 'countryName', 'planName', 'status', 'renewalDate'];
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
    /* True if billing account show */
    public showBillingAccount = false;
    /* True if  subscriber show */
    public showSubscriber = false;
    /* True if  country show */
    public showCountry = false;
    /* True if  name show */
    public showName = false;
    /* True if Plan Name show */
    public showPlanSubName = false;
    /* True if status show */
    public showStatus = false;
    /* True if duration show */
    public showMonthlyYearly = false;
    /* True if show header */
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

    public ngOnInit(): void{

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
                // this.getBranchTransferList(false);
            }
        });

        this.initForm();
        this.getAllAdjusmentReports(true);

        /** Get Discount List */
        this.adjustmentInventoryList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response) {
                this.adjustmentInventoryList = response?.body?.results;
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
                if (this.dataSource?.filteredData?.length || this.adjustInventoryListForm?.controls['companyName']?.value ||
                    this.adjustInventoryListForm?.controls['billingAccountName']?.value ||
                    this.adjustInventoryListForm?.controls['subscriberName']?.value ||
                    this.adjustInventoryListForm?.controls['countryName']?.value ||
                    this.adjustInventoryListForm?.controls['planName']?.value ||
                    this.adjustInventoryListForm?.controls['status']?.value ||
                    this.adjustInventoryListForm?.controls['duration']?.value) {
                    this.showData = true;
                } else {
                    this.showData = false;
                }
                this.dataSource.paginator = this.paginator;
                // this.adjustInventoryListRequestParams.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.adjustmentInventoryList = [];
                this.showData = false;
                // this.adjustInventoryListRequestParams.totalItems = 0;
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
            companyName: null,
            billingAccountName: null,
            subscriberName: null,
            countryName: null,
            planName: null,
            status: null,
            duration: null
        });
    }

    public getAllAdjusmentReports(resetPage: boolean): void {
        if (resetPage) {
            this.adjustInventoryListRequest.page = 1;
        }
        this.componentStore.getAllAdjustmentInventoryReport(this.adjustInventoryListRequest);

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
    public adjustInventory(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

}
