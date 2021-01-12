import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'inventory-group',
    templateUrl: './inventory-group.component.html',
    styleUrls: ['./inventory-group.component.scss'],

})

export class NewInventoryGroupComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
