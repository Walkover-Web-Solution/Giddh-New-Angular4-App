import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
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
    selector: 'create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss']
})
export class CreatePurchaseOrderComponent implements OnInit {
    public modelRef: BsModalRef;
    public isInvalidfield: boolean = true;
    public modalRef: BsModalRef;
    public isMulticurrencyAccount: true;
    public isMobileScreen: boolean = true;
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
        private _breakPointObservar: BreakpointObserver,
    ) { }
    ngOnInit() {
        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]);
    }



}
