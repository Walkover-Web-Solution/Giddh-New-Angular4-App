import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'create-manufacturing',
    templateUrl: './create-manufacturing.component.html',
    styleUrls: ['./create-manufacturing.component.scss']
})
export class CreateManufacturingComponent implements OnInit {
    /** Create Manufacturing dropdown items*/
    public product:any = [];

    constructor() { }

    ngOnInit() {
    }

}
