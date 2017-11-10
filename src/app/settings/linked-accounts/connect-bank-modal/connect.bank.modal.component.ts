import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'connect-bank-modal',
  templateUrl: './connect.bank.modal.component.html',
  styles: [`iframe {
              width: 100%;
              height: 400px;
          }
          .connect-page .page-title {
                margin-top: 0;
          }`]
})

export class ConnectBankModalComponent implements OnChanges {

  @Input() public sourceOfIframe: string;
  @Output() public modalCloseEvent: EventEmitter<boolean> = new EventEmitter(false);

  public url: SafeResourceUrl = null;

  public iframeSrc: string = '';
  public isIframeLoading: boolean = false;
  constructor(public sanitizer: DomSanitizer) {
  }

  public ngOnChanges(changes) {
    this.isIframeLoading = true;
    if (changes.sourceOfIframe.currentValue) {
      this.iframeSrc = this.sourceOfIframe;
      this.isIframeLoading = false;
      this.getIframeUrl(this.iframeSrc);
    }
  }
  public getIframeUrl(path) {
    if (!this.url) {
      this.url =  this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  }
  public onCancel() {
    this.modalCloseEvent.emit(true);
    this.iframeSrc = undefined;
  }
}
