import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface PeriodicElement {
  date: string,
  voucher_no: number,
  finished_variant: string,
  stock: string,
  qty_outwards: number,
  qty_outwards_unit:string,
  material_used: string,
  qty_inwards: number,
  qty_inwards_unit:string,
  warehouse: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date: '24 May 2023', voucher_no: 1,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'Nos', warehouse: 'Warehouse 1' },
  {date: '25 May 2023', voucher_no: 2,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'L', warehouse: 'Warehouse 2' },
  {date: '26 May 2023', voucher_no: 3,finished_variant: 'G2 F1', stock: 'stock 4',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'R', warehouse: 'Warehouse 1' },
  {date: '24 May 2023', voucher_no: 4,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'Nos', warehouse: 'Warehouse 1' },
  {date: '25 May 2023', voucher_no: 5,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'L', warehouse: 'Warehouse 2' },
  {date: '24 May 2023', voucher_no: 6,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'Nos', warehouse: 'Warehouse 1' },
  {date: '25 May 2023', voucher_no: 7,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'L', warehouse: 'Warehouse 2' },
  {date: '26 May 2023', voucher_no: 8,finished_variant: 'G2 F1', stock: 'stock 4',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'R', warehouse: 'Warehouse 1' },
  {date: '24 May 2023', voucher_no: 9,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'Nos', warehouse: 'Warehouse 1' },
  {date: '25 May 2023', voucher_no: 10,finished_variant: 'G2 F1', stock: 'stock 1',qty_outwards: 1, qty_outwards_unit: 'Nos', material_used: ' G2 R2', qty_inwards: 1, qty_inwards_unit: 'L', warehouse: 'Warehouse 2' },
];
@Component({
  selector: 'list-manufacturing',
  templateUrl: './list-manufacturing.component.html',
  styleUrls: ['./list-manufacturing.component.scss']
})
export class ListManufacturingComponent implements OnInit {
   /** Manufacturing list  product dropdown items*/
   public product:any = [];
  /** Material table elements */
   displayedColumns: string[] = ['date', 'voucher_no', 'finished_variant', 'stock', 'qty_outwards', 'qty_outwards_unit', 'material_used', 'qty_inwards', 'qty_inwards_unit', 'warehouse'];
   dataSource = ELEMENT_DATA;
   /** Instance of Mat Dialog for Advance Filter */
  @ViewChild("advance_filter_dialog") public advanceFilterComponent: TemplateRef<any>;
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
 *  Function to open Dialog on click on Advance Filter Button
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
