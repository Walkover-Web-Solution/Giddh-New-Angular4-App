import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { PurchaseRecordService } from '../../services/purchase-record.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'purchase-send-email-modal',
    templateUrl: './purchase-send-email.component.html',
    styleUrls: ['./purchase-send-email.component.scss']
})

export class PurchaseSendEmailModalComponent implements OnInit, OnDestroy {
    /* Taking input module name for send email */
    @Input() public module: string;
    /* Taking input all the params */
    @Input() public sendEmailRequest: any;
    /* Output emitter (boolean) */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();

    /* This will hold email id of receiver */
    public emailId: any = '';
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService, public purchaseRecordService: PurchaseRecordService) {

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
        let getRequest = { companyUniqueName: this.sendEmailRequest?.companyUniqueName, accountUniqueName: this.sendEmailRequest?.accountUniqueName, uniqueName: this.sendEmailRequest?.uniqueName };
        let postRequest = { emailId: [this.emailId] };

        if (this.module === "purchase-order") {
            this.purchaseOrderService.sendEmail(getRequest, postRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        this.toaster.successToast(res.body);
                        this.hideModal();
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        } else if (this.module === "purchase-bill") {
            this.purchaseRecordService.sendEmail(getRequest, postRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
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
    }

    /**
     * This will hide the modal
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public hideModal(): void {
        this.closeModelEvent.emit(true);
    }

    /**
     * Releases memory
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
