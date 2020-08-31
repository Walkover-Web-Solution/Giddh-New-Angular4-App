import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import {
    BsDropdownDirective,
    BsModalRef,
    BsModalService,
    ModalDirective,
    ModalOptions,
    TabsetComponent, 
    PopoverDirective
} from 'ngx-bootstrap'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
@Component({
    selector: 'aside-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{
    public modelRef: BsModalRef;
    public modalRef: BsModalRef;
    public  isMulticurrencyAccount : true;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }
   
    public closeAsidePane(event) {
        this.closeAsideEvent.emit(event);
    }

}