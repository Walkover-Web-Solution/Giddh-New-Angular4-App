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
    selector: 'purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
    public dateFieldPosition: any = { x: 0, y: 0 };
    public modelRef: BsModalRef;
    public modalRef: BsModalRef;
    public isMobileSite: boolean;
    public selectedDateRangeUi: any;
    public selectOverDate: IOption[] = [
        { label: "rakesh", value: "1234" }, { label: "rakesh2", value: "1235" },
        { label: "rakesh", value: "1234" },
        { label: "rakesh3", value: "1235" }];

    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    constructor(
        private modalService: BsModalService,
        private generalService: GeneralService,
    ) { }
    ngOnInit() {
    }

    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
            if (!this.isMobileSite && this.dateFieldPosition) {
                this.dateFieldPosition.x -= 60;
            }
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileSite })
        );
    }
    openModalBulkUpdate(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-sm' })
        );
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }


}
