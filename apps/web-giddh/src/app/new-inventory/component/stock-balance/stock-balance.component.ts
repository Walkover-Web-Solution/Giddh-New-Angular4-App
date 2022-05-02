import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

interface Food {
  value: string;
  viewValue: string;
}
interface quantity {
  value: string;
  viewValue: string;
}
interface unit {
  value: string;
  viewValue: string;
}
@Component({
    selector: 'stock-balance',
    templateUrl: './stock-balance.component.html',
    styleUrls: ['./stock-balance.component.scss'],
})

export class StockBalanceComponent implements OnInit{
    
    /** Image path variable */
    public imgPath: string = '';
    
    toppings = new FormControl();
    toppingList: string[] = ['Warehouse 1', 'Warehouse 2', 'Warehouse 3', 'Warehouse 4', 'Warehouse 5', 'Warehouse 6'];

    foods: Food[] = [
    {value: 'small-0', viewValue: 'Small'},
    {value: 'medium-1', viewValue: 'Medium'},
    {value: 'large-2', viewValue: 'Large'},
    {value: 'extra-large-3', viewValue: 'Extra Large'},
    {value: 'extra-extra-large-4', viewValue: 'Extra Extra Large'},
  ];

  quantites: quantity[] = [
    {value: 'dummy-1', viewValue: 'Dummy 1'},
    {value: 'dummy-2', viewValue: 'Dummy 2'},
    {value: 'dummy-3', viewValue: 'Dummy 3'},
  ];

  units: unit[] = [
    {value: 'pc', viewValue: 'Pc'},
    {value: 'kg', viewValue: 'Kg'},
    {value: 'ltr', viewValue: 'Ltr'},
    {value: 'nos', viewValue: 'Nos'},
    {value: 'pcs', viewValue: 'Pcs'},
  ];


    ngOnInit() {
        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}