import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'connect-bank-modal',
  templateUrl: './connect.bank.modal.component.html',
  styles: [`iframe {
              width: 100%;
              height: 400px;
          }`]
})

export class ConnectBankModalComponent {

  @Input() public sourceOfIframe: string;
  @Output() public modalCloseEvent: EventEmitter<boolean> = new EventEmitter(false);

  constructor(public sanitizer: DomSanitizer) {}

  public onCancel() {
    this.modalCloseEvent.emit(true);
  }
}
