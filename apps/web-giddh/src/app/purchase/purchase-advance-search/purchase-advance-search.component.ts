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
    selector: 'purchase-advance-search',
    templateUrl: './purchase-advance-search.component.html',
    styleUrls: ['./purchase-advance-search.component.scss']
})
export class PurchaseAdvanceSearchComponent implements OnInit {
    public dateFieldPosition: any = { x: 0, y: 0 };
    public modelRef: BsModalRef;
    constructor(

    ) { }
    ngOnInit() {
    }



}
