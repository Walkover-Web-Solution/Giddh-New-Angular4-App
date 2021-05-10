import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedInvoices } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-generate-ewaybill-modal',
    templateUrl: './generateEWayBill.component.html',
    styleUrls: [`./generateEWayBill.component.scss`]
})

export class GenerateEWayBillComponent implements OnInit {
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Input() public ChildSelectedInvoicesList: any[];
    public invoiceList: SelectedInvoices[] = [];
    public modalRef: BsModalRef;

    constructor(private router: Router, private modalService: BsModalService) {

    }

    public ngOnInit(): void {

    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    public createEWayBill() {
        this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
    }
    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-455' });
    }

}
