import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'purchase-send-email-modal',
    templateUrl: './purchase-send-email.component.html',
    styleUrls: ['./purchase-send-email.component.scss']
})

export class PurchaseSendEmailModalComponent implements OnInit {
    @Input() public sendEmailRequest: any;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();

    public emailId: any = '';

    constructor(public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService) {

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public ngOnInit(): void {
        if (this.sendEmailRequest && this.sendEmailRequest.email) {
            this.emailId = this.sendEmailRequest.email;
        }
    }

    /**
     * This will send the email
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public sendEmail(): void {
        let getRequest = { companyUniqueName: this.sendEmailRequest.companyUniqueName, accountUniqueName: this.sendEmailRequest.accountUniqueName, poUniqueName: this.sendEmailRequest.uniqueName };
        let postRequest = { emailId: [this.emailId] };

        this.purchaseOrderService.sendEmail(getRequest, postRequest).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.toaster.successToast(res.body);
                    this.hideModal();
                } else {
                    this.toaster.errorToast(res.message);
                }
            }
        });
    }

    /**
     * This will hide the modal
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public hideModal(): void {
        this.closeModelEvent.emit(true);
    }
}