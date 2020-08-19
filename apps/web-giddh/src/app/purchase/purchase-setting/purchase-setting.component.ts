import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'purchase-setting',
    templateUrl: './purchase-setting.component.html',
    styleUrls: ['./purchase-setting.component.scss']
})
export class PurchaseSettingComponent implements OnInit {
    public modelRef: BsModalRef;
    public isInvalidfield: boolean = true;
    public modalRef: BsModalRef;
    public isMulticurrencyAccount: true;
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }



}
