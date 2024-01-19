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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public dummyOptions:any = [
        { label: 'Option 1' , value: 1 },
        { label: 'Option 2' , value: 2 },
        { label: 'Option 3' , value: 3 }
    ]

    constructor(
        private modalService: BsModalService
    ) { }

    /**
     *
     *
     * @param {*} event
     * @memberof AdjustProductServiceComponent
     */
    public selectDate(event: any): void {
        console.log('selectDate: ', event);
    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    /**
     *
     *
     * @param {*} event
     * @memberof AdjustProductServiceComponent
     */
    public selectAccount(event: any): void {

    }
}
