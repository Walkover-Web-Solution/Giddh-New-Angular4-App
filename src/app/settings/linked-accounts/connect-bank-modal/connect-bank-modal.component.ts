import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'connect-bank-modal',
  templateUrl: './connect-bank-modal.component.html'
})
export class ConnectBankModalComponent implements OnInit {
  @Input() public connectUrl: string = 'http://www.google.com';
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
