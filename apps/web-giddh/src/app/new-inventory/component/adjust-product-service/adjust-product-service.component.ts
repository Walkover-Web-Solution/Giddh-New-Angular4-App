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
    /* this will store image path*/
    public imgPath: string = '';

    public modalRef: BsModalRef;
    /* for sh-select dropdown */
    @ViewChildren('selectAccount') public selectAccount: ShSelectComponent;

    constructor(
        private modalService: BsModalService
    ) { }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'gray modal-xl' })
        );
    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
