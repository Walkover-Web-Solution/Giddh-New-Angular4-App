import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'stock-group-list',
    templateUrl: './stock-group-list.component.html',
    styleUrls: ['./stock-group-list.component.scss'],
})

export class StockGroupListComponent implements OnInit {
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* Selected range label */
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
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService) {

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
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    public ngOnInit() {

    }
}
