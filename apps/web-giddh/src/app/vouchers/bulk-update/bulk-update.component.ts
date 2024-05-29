import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-bulk-update',
    templateUrl: './bulk-update.component.html',
    styleUrls: ['./bulk-update.component.scss']
})
export class BulkUpdateComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData
    ) { 
        
    }

    public ngOnInit(): void {
        console.log(this.inputData);
    }

}
