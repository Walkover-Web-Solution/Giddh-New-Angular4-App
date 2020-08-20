import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
