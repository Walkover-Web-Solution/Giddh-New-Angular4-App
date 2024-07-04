import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
@Component({
    selector: 'adjust-inventory',
    templateUrl: './adjust-inventory.component.html',
    styleUrls: ['./adjust-inventory.component.scss'],

})

export class AdjustInventroyComponent implements OnInit {

    public  panelOpenState = false;
    constructor(

    ) { }


    public countries: any[] = [
        {
            label: 'option-1',
            value: '#',

        },
        {
            label: 'option-2',
            value: '@',

        },
        {
            label: 'option-3',
            value: '$',

        },
        {
            label: 'option-4',
            value: '&',

        },
    ];
    public method: any[] = [
        {
            label: 'Percentage',
            value: 'PERCENTAGE',

        },
        {
            label: 'Number',
            value: '#',

        },
    ];
    public displayedColumns: any[] = ['select', 'position', 'name', 'weight', 'symbol'];
    public dataSource: any[] = [
        { position: 'Red', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Green', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Blue', name: 5000, weight: 500, symbol: 5500 },
    ];
    public ngOnInit(): void {

    }
}
