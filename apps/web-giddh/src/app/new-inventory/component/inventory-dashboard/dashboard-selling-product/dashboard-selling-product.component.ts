import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
@Component({
    selector: 'dashboard-selling-product',
    templateUrl: './dashboard-selling-product.component.html',
    styleUrls: ['./dashboard-selling-product.component.scss'],
})

export class DashboardSellingProduct implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
