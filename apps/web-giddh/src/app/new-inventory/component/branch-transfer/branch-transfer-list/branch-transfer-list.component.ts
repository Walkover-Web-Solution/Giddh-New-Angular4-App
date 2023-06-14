import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface PeriodicElement {
  date: string,
  voucher_type: string,
  voucher_no: string,
  sender_receiver: string,
  from_warehouse: string,
  to_warehouse:string,
  total_amount: string,
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date: '24 May 2023',voucher_type: 'Receipt Note', voucher_no: 'RN-20230304-1',sender_receiver: 'AAAA', from_warehouse: 'Palasia',to_warehouse: 'GST Warehouse', total_amount: '₹ 12.00'},
  {date: '25 May 2023',voucher_type: 'Receipt Note', voucher_no: 'RN-20230304-1',sender_receiver: 'BBBB', from_warehouse: 'Palasia',to_warehouse: 'GST Warehouse', total_amount: '₹ 12.00'},
  {date: '26 May 2023',voucher_type: 'Receipt Note', voucher_no: 'RN-20230304-1',sender_receiver: 'CCCC', from_warehouse: 'Palasia',to_warehouse: 'GST Warehouse', total_amount: '₹ 12.00'}
];
@Component({
  selector: 'branch-transfer-list',
  templateUrl: './branch-transfer-list.component.html',
  styleUrls: ['./branch-transfer-list.component.scss']
})
export class BranchTransferListComponent implements OnInit {
   /** Manufacturing list  product dropdown items*/
   public product:any = [];
  /** Material table elements */
   displayedColumns: string[] = ['s_no','date', 'voucher_type', 'voucher_no', 'sender_receiver', 'from_warehouse', 'to_warehouse', 'total_amount','action'];
   dataSource = ELEMENT_DATA;
   /** Instance of Mat Dialog for Advance Filter */
   @ViewChild("advanceFilterDialog") public advanceFilterComponent: TemplateRef<any>;
   /** directive to get reference of element */
   @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
      /** Selected range label */
    public selectedRangeLabel: any = "";
      /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    public modalRef: BsModalRef;
     /** Pagination limit */
     public paginationLimit: number = PAGINATION_LIMIT;

  constructor(
    public dialog: MatDialog,
    private modalService: BsModalService,
    private generalService: GeneralService,
    ) { }

  ngOnInit() {
   
  }

/**
 *  Function to open Dialog on Advance Filter Button
 */
  openAdvanceFilterDialog(){
      this.dialog.open(this.advanceFilterComponent,{
        width: '630px',
      })
  }

  /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof ListManufacturingComponent
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
     * @memberof InvoicePreviewComponent
     */
   public hideGiddhDatepicker(): void {
    this.modalRef.hide();
}
    
}
