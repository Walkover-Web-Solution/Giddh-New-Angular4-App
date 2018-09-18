import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'download-receipt-component',
  templateUrl: 'download-receipt.component.html'
})

export class DownloadReceiptComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<string> = new EventEmitter();
  public fileType: string = 'pdf';

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
