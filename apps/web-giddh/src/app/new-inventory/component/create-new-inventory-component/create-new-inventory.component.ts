import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'create-new-inventory',
    templateUrl: './create-new-inventory.component.html',
    styleUrls: ['./create-new-inventory.component.scss'],

})

export class CreateNewInventoryComponent implements OnInit {
    /* add readonly if bulk edit is true */
    public editBulk: boolean = false;

    public ngOnInit() {

    }
}
