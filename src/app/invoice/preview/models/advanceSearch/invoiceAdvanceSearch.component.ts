import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'invoice-advance-search-component',
  templateUrl: './invoiceAdvanceSearch.component.html',
  styleUrls: [`./invoiceAdvanceSearch.component.scss`]
})

export class InvoiceAdvanceSearchComponent implements OnInit {
  @Input() public type: 'invoice' | 'drcr' | 'receipt';
  @Output() public applyFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public save() {
    this.applyFilterEvent.emit();
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
