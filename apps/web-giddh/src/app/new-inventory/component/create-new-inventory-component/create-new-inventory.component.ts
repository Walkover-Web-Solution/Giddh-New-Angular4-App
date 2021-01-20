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
    /* this will store hsn boolean value */
    public isHSN: boolean = true;
    /* this will store product boolean value */
    public isProduct: boolean = true;
    public isService: boolean = false;
    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
    selectCode(isHSN) {
        this.isHSN = isHSN;
    }

}
