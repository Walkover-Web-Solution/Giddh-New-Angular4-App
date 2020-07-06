import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import {
    BsDropdownDirective,
    BsModalRef,
    BsModalService,
    ModalDirective,
    ModalOptions,
    TabsetComponent
    , PopoverDirective
} from 'ngx-bootstrap'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
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
