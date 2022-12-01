import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedInvoices } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-generate-ewaybill-modal',
    templateUrl: './generateEWayBill.component.html',
    styleUrls: [`./generateEWayBill.component.scss`]
})

export class GenerateEWayBillComponent {
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Create E-way bill event emitter */
    @Output() public createEWayBillEvent: EventEmitter<void> = new EventEmitter();
    @Input() public ChildSelectedInvoicesList: any[];
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public invoiceList: SelectedInvoices[] = [];
    public modalRef: BsModalRef;

    constructor(private router: Router, private modalService: BsModalService) {

    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    public createEWayBill() {
        this.createEWayBillEvent.emit();
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-455' });
    }

}
