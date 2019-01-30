import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'invoice-advance-search-component',
  templateUrl: './invoiceAdvanceSearch.component.html',
  styleUrls: [`./invoiceAdvanceSearch.component.scss`]
})

export class InvoiceAdvanceSearchComponent implements OnInit {

  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
