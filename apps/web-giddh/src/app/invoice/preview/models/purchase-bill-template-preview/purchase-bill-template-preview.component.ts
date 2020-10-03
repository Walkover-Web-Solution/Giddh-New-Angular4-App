import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'purchase-bill-template',
    templateUrl: './purchase-bill-template-preview.component.html',
    styleUrls: ['./purchase-bill-template-preview.component.scss']
})
export class PurchaseBillTemplateComponent implements OnInit {
    public modelRef: BsModalRef;
    public modalRef: BsModalRef;
    public isMulticurrencyAccount: true;
    public orderHistoryAsideState: string = 'out';
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }


}
