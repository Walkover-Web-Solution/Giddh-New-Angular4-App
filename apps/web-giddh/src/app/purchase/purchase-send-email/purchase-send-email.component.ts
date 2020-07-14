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
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
@Component({
    selector: 'purchase-send-email-modal',
    templateUrl: './purchase-send-email.component.html',
    styleUrls: ['./purchase-send-email.component.scss']
})
export class PurchaseSendEmailModalComponent implements OnInit {
    // public dateFieldPosition: any = { x: 0, y: 0 };
    // public modelRef: BsModalRef;
    // public modalRef: BsModalRef;
    // public isMobileSite: boolean;
    // public selectedDateRangeUi: any;
    // public selectOverDate: IOption[] = [
    //     { label: "rakesh", value: "1234" }, { label: "rakesh2", value: "1235" },
    //     { label: "rakesh", value: "1234" },
    //     { label: "rakesh3", value: "1235" }];

    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }



}
