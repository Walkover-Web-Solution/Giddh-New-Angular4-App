import { Component } from "@angular/core";

@Component({
    selector: 'adjustment',
    templateUrl: "./adjustment.component.html",
    styleUrls: ["./adjustment.component.scss"]
})
export class AdjustmentComponent {
[x: string]: any;
    constructor(

    ) {

    }
    public countries:any[] = [
        {
            label:'option-1',
            value:'#',

        },
        {
            label:'option-2',
            value:'@',

        },
        {
            label:'option-3',
            value:'$',

        },
        {
            label:'option-4',
            value:'&',

        },
    ];
    public method:any[] = [
        {
            label:'Percentage',
            value:'PERCENTAGE',

        },
        {
            label:'Number',
            value:'#',

        },
    ];
    public displayedColumns: any[] = [ 'select', 'position', 'name', 'weight', 'symbol'];
    public dataSource: any[] = [
        {position: 'Red', name: 5000, weight: 500, symbol:5500},
        {position: 'Green', name: 5000, weight: 500, symbol:5500},
        {position: 'Blue', name: 5000, weight: 500, symbol:5500},
      ];
}