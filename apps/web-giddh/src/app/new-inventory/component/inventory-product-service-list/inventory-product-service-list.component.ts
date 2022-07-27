import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { Router } from '@angular/router';
@Component({
    selector: 'inventory-product-service-list',
    templateUrl: './inventory-product-service-list.component.html',
    styleUrls: ['./inventory-product-service-list.component.scss'],

})

export class ProductServiceListComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    constructor(private _router: Router) {

    }
    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
