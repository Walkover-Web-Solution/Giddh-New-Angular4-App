import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: 'invoice-bulk-export',
    templateUrl: './bulk-export.component.html',
    styleUrls: [`./bulk-export.component.scss`]
})

export class BulkExportModal implements OnInit {
    modalRef: BsModalRef;
    constructor(private modalService: BsModalService) { }

    openModalWithClass(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
        Object.assign({}, { class: 'modal-md' }));
    }
    public ngOnInit() {

    }
}
