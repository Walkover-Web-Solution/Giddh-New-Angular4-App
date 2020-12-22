import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { Router } from '@angular/router';
@Component({
    selector: 'inventory-product-service-list',
    templateUrl: './inventory-product-service-list.component.html',
    styleUrls: ['./inventory-product-service-list.component.scss'],

})

export class ProductServiceListComponent implements OnInit {
    constructor(private _router: Router) {

    }
    public ngOnInit() {

    }
}
