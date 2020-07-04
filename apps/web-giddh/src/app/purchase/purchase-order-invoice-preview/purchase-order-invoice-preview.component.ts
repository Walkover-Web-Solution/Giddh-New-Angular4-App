import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import {
    BsDropdownDirective,
    BsModalRef,
    BsModalService,
    ModalDirective,
    ModalOptions,
    TabsetComponent, 
    PopoverDirective
} from 'ngx-bootstrap'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
@Component({
    selector: 'purchase-order-invoice-preview',
    templateUrl: './purchase-order-invoice-preview.component.html',
    styleUrls: ['./purchase-order-invoice-preview.component.scss']
})
export class PurchaseOrderInvoicePreviewComponent implements OnInit {
    public modelRef: BsModalRef;
    public modalRef: BsModalRef;
    public  isMulticurrencyAccount : true;
    public orderHistoryAsideState: string = 'out';
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }
    public toggleOrderHistoryAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.orderHistoryAsideState = this.orderHistoryAsideState === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }
    public toggleBodyClass() {
        if (this.orderHistoryAsideState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
  
}