import { Component, OnInit, TemplateRef, Input, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap'

@Component({
    selector: 'purchase-order-preview',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewComponent implements OnInit {
    @Input() public purchaseOrders: any;

    public modalRef: BsModalRef;
    public orderHistoryAsideState: string = 'out';

    constructor(private modalService: BsModalService) {

    }

    public ngOnInit(): void {

    }

    public toggleOrderHistoryAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.orderHistoryAsideState = this.orderHistoryAsideState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass(): void {
        if (this.orderHistoryAsideState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public openModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template);
    }

}