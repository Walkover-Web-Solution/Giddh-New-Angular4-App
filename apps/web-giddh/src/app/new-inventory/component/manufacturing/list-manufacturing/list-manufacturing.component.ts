import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
