import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { PAGINATION_LIMIT } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'aside-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
    /* Taking PO details as input */
    @Input() public purchaseOrder: any;
    /* Emitting the close popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /* This will hold the query params of get all PO versions api */
    public purchaseOrderVersionsGetRequest: any = {
        companyUniqueName: '',
        accountUniqueName: '',
        page: 1,
        count: PAGINATION_LIMIT
    };
    /* This will hold the post params of get all PO versions api */
    public purchaseOrderVersionsPostRequest: any = {
        purchaseNumber: ''
    };
    /* This will hold purchase order versions */
    public purchaseOrderVersions: any = {};
    /* This will hold giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService, private generalService: GeneralService) {

    }

    public ngOnInit(): void {
        this.purchaseOrderVersionsGetRequest.companyUniqueName = this.purchaseOrder.company.uniqueName;
        this.purchaseOrderVersionsGetRequest.accountUniqueName = this.purchaseOrder.account.uniqueName;
        this.purchaseOrderVersionsPostRequest.purchaseNumber = this.purchaseOrder.number;

        this.getPurchaseOrderVersions();
    }

    public closeAsidePane(): void {
        this.closeAsideEvent.emit(true);
    }

    public getPurchaseOrderVersions(): void {
        if (this.purchaseOrderVersionsGetRequest.companyUniqueName && this.purchaseOrderVersionsPostRequest.purchaseNumber) {
            this.purchaseOrderVersions = {};

            this.purchaseOrderService.getAllVersions(this.purchaseOrderVersionsGetRequest, this.purchaseOrderVersionsPostRequest).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {
                        if (res.body) {
                            let versions = res.body;

                            if (versions.results && versions.results.length > 0) {
                                versions.results.forEach(result => {
                                    result.versionTime = new Date(result.versionTime);
                                    if (result.changes && result.changes.length > 0) {
                                        result.changes.forEach(change => {
                                            change.message = this.getVersionMessage("po", change);
                                        });
                                    }
                                });
                            }

                            this.purchaseOrderVersions = res.body;
                        }
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        }
    }

    public getVersionMessage(type: string, change: any): string {
        let message = "";
        let revisionField = this.generalService.getRevisionField(change.type);

        if (change.optType === "CREATE") {
            if (type === "po") {
                message += "Purchase Order created for " + change.newValue;
            } else {
                message += "Purchase Bill created for " + change.newValue;
            }
        } else {
            message += revisionField + " updated to " + change.newValue;
        }

        return message;
    }
}