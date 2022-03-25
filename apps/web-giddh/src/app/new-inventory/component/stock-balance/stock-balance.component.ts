import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

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

    ngOnInit() {
        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}