import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'adjust-inventory-list',
    templateUrl: './adjust-inventory-list.component.html',
    styleUrls: ['./adjust-inventory-list.component.scss'],
})

export class AdjustInventoryComponent implements OnInit {
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Template Reference of Universal Datepicker */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    @ViewChild('addAdjustmentAsidepan') public addAdjustmentAsidepan: TemplateRef<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
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
    public displayedColumns: string[] = ['date', 'reference-no', 'type', 'name', 'reason', 'adjusted-by'];
    public dataSource: any[] = [
        { date: "15-10-2024", referenceNo: 234423, reason: "Stock on fire", type: "Group", name: 'Name of Group', adjustedBy: "Shubhendra Agarawal" },
        { date: "16-10-2024", referenceNo: 255552, reason: "Stock on earthquake", type: "Stock", name: 'Name of  Stock', adjustedBy: "Raju Pandiya" },
        { date: "18-10-2024", referenceNo: 625222, reason: "Stock on tornado", type: "Group", name: 'Name of Group', adjustedBy: "Mukesh Rajaj" }
    ];
    public moduleType: string = 'inventory-adjustment';
    private addAdjustmentAsidepanRef: MatDialogRef<any>;
    public inventoryAdjusmentGetRequestParams = {
        from: '',
        to: '',
        page: 1,
        count: PAGINATION_LIMIT,
        sort: '',
        sortBy: ''
    }
    /* True if show Reason show */
    public reason: boolean = false;
    /* True if show Reference No show */
    public referenceNo: boolean = false;
    /* True if show Adjusted by show */
    public adjustedBy: boolean = false;
    /* True if show Stock/Group Name show */
    public name: boolean = false;
    public inventoryType: 'stock' | 'group';

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private dialog: MatDialog,
    ) { }

/**
 * Show datepicker
 *
 * @param {*} element
 * @memberof AdjustInventoryComponent
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
     * @memberof AdjustInventoryComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AdjustInventoryComponent
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

    /* Open Add Adjustment Asidepane */
    public adjustInventory(): void {
        this.addAdjustmentAsidepanRef = this.dialog.open(this.addAdjustmentAsidepan, {
            position: { top: '0', right: '0' },
        });
    }

    /* Close Add Adjustment Asidepane */
    public closeAsideMenu(): void {
        this.addAdjustmentAsidepanRef.close()
    }

    /**
     * This will be use for table sorting
     *
     * @param {*} event
     * @memberof AdjustInventoryComponent
     */
    public sortChange(event: any): void {
        this.inventoryAdjusmentGetRequestParams.sort = event?.direction ? event?.direction : 'asc';
        this.inventoryAdjusmentGetRequestParams.sortBy = event?.active;
        this.inventoryAdjusmentGetRequestParams.page = 1;
    }

    /**
     * This will be use for toggle search field
     *
     * @param {string} fieldName
     * @param {*} el
     * @memberof AdjustInventoryComponent
     */
    public toggleSearch(fieldName: string) {
        console.log("referenceNo", fieldName);

        if (fieldName === 'reason') {
            this.reason = true;
        }
        if (fieldName === 'reference-no') {
            this.referenceNo = true;
        }
        if (fieldName === 'adjusted-by') {
            this.adjustedBy = true;
        }
        if (fieldName === 'name') {
            this.name = true;
        }
    }

    /**
     *This will be use for click outsie for search field hidden
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === 'reason') {
                this.reason = false;
            } else if (searchedFieldName === 'reference-no') {
                this.referenceNo = false;
            } else if (searchedFieldName === 'adjusted-by') {
                this.adjustedBy = false;
            } else if (searchedFieldName === 'name') {
                this.name = false;
            }
        }
    }

    /**
     * Returns the search field text
     *
     * @param {*} title
     * @returns {string}
     * @memberof AdjustInventoryComponent
     */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

    /**
     * This will use for filter by check for Inventory type column
     *
     * @memberof AdjustInventoryComponent
     */
    public selectedInventoryType(): void {
        console.log(this.inventoryType);
    }

    /**
    * Handle Pagination
    *
    * @param {*} event
    * @memberof AdjustInventoryComponent
    */
    public pageChanged(event: any): void {
        console.log("pageChanged", event);
    }

}
