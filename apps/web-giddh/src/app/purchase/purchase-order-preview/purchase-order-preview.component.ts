import { Component, OnInit, TemplateRef, Input, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap'
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';

@Component({
    selector: 'purchase-order-preview',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewComponent implements OnInit, OnChanges {
    @Input() public purchaseOrders: any;
    @Input() public companyUniqueName: any;
    @Input() public purchaseOrderUniqueName: any;

    /* Confirm box */
    @ViewChild('poConfirmationModel') public poConfirmationModel: ModalDirective;

    public modalRef: BsModalRef;
    public orderHistoryAsideState: string = 'out';
    public purchaseOrder: any = {};
    public sendEmailRequest: any = {};
    public isLoading: boolean = false;

    constructor(private modalService: BsModalService, public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService, public router: Router) {

    }

    public ngOnInit(): void {
        this.getPurchaseOrder();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(changes.purchaseOrderUniqueName && changes.purchaseOrderUniqueName.currentValue && changes.purchaseOrderUniqueName.currentValue !== this.purchaseOrder.uniqueName) {
            this.purchaseOrderUniqueName = changes.purchaseOrderUniqueName.currentValue;
            this.getPurchaseOrder();
        }
    }

    public getPurchaseOrder(): void {
        if(this.isLoading) {
            return;
        }

        this.isLoading = true;
        let getRequest = { companyUniqueName: this.companyUniqueName, poUniqueName: this.purchaseOrderUniqueName };
        this.purchaseOrderService.get(getRequest).subscribe(response => {
            this.isLoading = false;
            if (response) {
                if (response.status === "success") {
                    this.purchaseOrder = response.body;
                } else {
                    this.toaster.errorToast(response.message);
                }
            } else {
                this.router.navigate(['/pages/purchase-management/purchase-orders']);
            }
        });
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

    public openSendMailModal(template: TemplateRef<any>): void {
        this.sendEmailRequest.email = this.purchaseOrder.account.email;
        this.sendEmailRequest.uniqueName = this.purchaseOrder.uniqueName;
        this.sendEmailRequest.accountUniqueName = this.purchaseOrder.account.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.companyUniqueName;
        this.modalRef = this.modalService.show(template);
    }

    public showPurchaseOrderPreview(poUniqueName: any): void {
        this.router.navigate(['/pages/purchase-management/purchase-order-preview/' + poUniqueName]);
    }

    public closeSendMailPopup(event: any): void {
        if(event) {
            this.modalRef.hide();
        }
    }

    public closeConfirmationPopup(): void {
        this.poConfirmationModel.hide();
    }

    public deleteItem(): void {
        let getRequest = { companyUniqueName: this.companyUniqueName, poUniqueName: this.purchaseOrder.uniqueName };

        this.purchaseOrderService.delete(getRequest).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.closeConfirmationPopup();
                    this.toaster.successToast(res.body);
                    this.router.navigate(['/pages/purchase-management/purchase-orders']);
                } else {
                    this.closeConfirmationPopup();
                    this.toaster.errorToast(res.message);
                }
            }
        });
    }

    public confirmDelete(): void {
        this.poConfirmationModel.show();
    }

    public statusUpdate(action: any): void {
        if (this.purchaseOrder && this.purchaseOrder.number) {
            let getRequest = { companyUniqueName: this.companyUniqueName, accountUniqueName: this.purchaseOrder.account.uniqueName };
            let postRequest = { purchaseNumber: this.purchaseOrder.number, action: action };

            this.purchaseOrderService.statusUpdate(getRequest, postRequest).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        this.getPurchaseOrder();
                        this.toaster.successToast(res.body);
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        } else {
            this.toaster.errorToast("Invalid Purchase Order");
        }
    }
}