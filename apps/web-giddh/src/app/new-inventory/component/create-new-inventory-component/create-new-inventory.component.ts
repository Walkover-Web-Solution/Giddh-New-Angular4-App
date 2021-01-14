import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'create-new-inventory',
    templateUrl: './create-new-inventory.component.html',
    styleUrls: ['./create-new-inventory.component.scss'],

})

export class CreateNewInventoryComponent implements OnInit {
    /* add readonly if bulk edit is true */
    public editBulk: boolean = false;
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
