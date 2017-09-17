import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'invoice-template-preview-modal',
  templateUrl: './template-preview.modal.component.html'
})

export class InvoiceTemplatePreviewModelComponent {

  @Input() public templateSections: any;
  @Input() public templateId: any;
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor(public sanitizer: DomSanitizer) {
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  public getObjectUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
