import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'app/services/invoice.service';
import { SelectedInvoices } from 'app/models/api-models/Invoice';

@Component({
  selector: 'app-generate-ewaybill-modal',
  templateUrl: './generateEWayBill.component.html',
  styleUrls: [`./generateEWayBill.component.scss`]
})

export class GenerateEWayBillComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public ChildSelectedInvoicesList: any[];
public invoiceList: SelectedInvoices[] = [];
  constructor(private router: Router, private _invoiceService: InvoiceService) {
    //
  }

  public ngOnInit(): void {
    //
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  public createEWayBill() {
    this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
  }
}
