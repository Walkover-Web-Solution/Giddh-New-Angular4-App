import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'export-ledger',
  templateUrl: './exportLedger.component.html'
})
export class ExportLedgerComponent implements OnInit {
  @Output() public closeExportLedgerModal: EventEmitter<boolean> = new EventEmitter();
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
