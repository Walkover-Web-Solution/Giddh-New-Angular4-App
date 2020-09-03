import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'purchase-order-preview-modal',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewModalComponent implements OnInit {
    /* Taking input all the params */
    @Input() public purchaseOrderUniqueName: any;
    /* Output emitter (boolean) */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();

    constructor(public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService) {

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public ngOnInit(): void {

    }

    /**
     * This will hide the modal
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public hideModal(): void {
        this.closeModelEvent.emit(true);
    }
}