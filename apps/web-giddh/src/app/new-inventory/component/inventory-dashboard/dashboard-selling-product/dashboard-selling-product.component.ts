import { Component, Inject, OnInit } from '@angular/core';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

@Component({
    selector: 'dashboard-selling-product',
    templateUrl: './dashboard-selling-product.component.html',
    styleUrls: ['./dashboard-selling-product.component.scss'],
})

export class DashboardSellingProduct implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
