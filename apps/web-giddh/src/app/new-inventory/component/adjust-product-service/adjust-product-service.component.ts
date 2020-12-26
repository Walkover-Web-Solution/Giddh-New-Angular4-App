import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
@Component({
    selector: 'adjust-product-service',
    templateUrl: './adjust-product-service.component.html',
    styleUrls: ['./adjust-product-service.component.scss'],

})

export class AdjustProductServiceComponent implements OnInit {

    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will store modal reference */
    public modalRef: BsModalRef;

    @ViewChildren('selectAccount') public selectAccount: ShSelectComponent;

    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    /*datepicker funcation*/
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }
    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService
    ){ }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'gray modal-xl' })
        );
    }

    public ngOnInit() {

    }
}
