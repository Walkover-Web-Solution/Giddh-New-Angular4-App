import { Component, EventEmitter, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'invoice-template-preview-modal',
    templateUrl: './template-preview.modal.component.html'
})

export class InvoiceTemplatePreviewModelComponent {

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
