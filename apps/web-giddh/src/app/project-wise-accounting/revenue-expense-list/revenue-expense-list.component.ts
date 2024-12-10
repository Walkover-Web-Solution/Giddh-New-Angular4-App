import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';

export interface Details {
    name: string;
    position: number;
    status: string;
    symbol: string;
    action: string;
  }
  
  const ELEMENT_DATA: Details[] = [
    {position: 1, name: 'Project 1', status: 'ACTIVE', symbol: 'H', action: ''},
    {position: 2, name: 'Project 2', status: 'ACTIVE', symbol: 'He',action: ''},
    {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},
  ];

@Component({
    selector: 'revenue-expense-list.',
    styleUrls: ['./revenue-expense-list.component.scss'],
    templateUrl: './revenue-expense-list.component.html'
})
export class RevenueExpenseListComponent implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public modalRef: BsModalRef;
    public dataSource: Details[] = [
        {position: 1, name: 'Project 1', status: 'ACTIVE', symbol: 'H', action: ''},
        {position: 2, name: 'Project 2', status: 'ACTIVE', symbol: 'He',action: ''},
        {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},
        {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},

        {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},

        {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},

      ];

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];

    public selecteAccount = [
        {
            label: 'Option 1',
            value: 1
        },
        {
            label: 'Option 2',
            value: 2
        },
        {
            label: 'Option 3',
            value: 3
        }
    ]
    public selectedTab = [
        {
            label: 'Tab 1',
            value: 1
        },
        {
            label: 'Tab 2',
            value: 2
        },
        {
            label: 'Tab 3',
            value: 3
        }
    ]
    public selectedProject = [
        {
            label: 'Project 1',
            value: 1
        },
        {
            label: 'Project 2',
            value: 2
        },
        {
            label: 'Project 3',
            value: 3
        }
    ]
    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService
    ) { }

    public ngOnInit() {
       
     }

    public ngOnDestroy() {

    }
    /**
     * This will be use for show datepicker
     *
     * @param {*} element
     * @memberof ListBranchTransfer
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
     * This will be use for hide datepicker
     *
     * @memberof ListBranchTransfer
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof ListBranchTransfer
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
            
        }
    }

    public selectProject(event:any){

    }
}
