import { Component, Inject, OnInit } from '@angular/core';
import { ServiceConfig } from '../../../services/service.config';

@Component({
    selector: 'inventory-combo-list',
    templateUrl: './inventory-combo-list.component.html',
    styleUrls: ['./inventory-combo-list.component.scss'],

})

export class InventoryComboListComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
