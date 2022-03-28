import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

interface Food {
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

    public stockListBoxIndex: number;
    public stockListBox = document.getElementsByClassName("stock-list-box");
    
    toppings = new FormControl();
    toppingList: string[] = ['Warehouse 1', 'Warehouse 2', 'Warehouse 3', 'Warehouse 4', 'Warehouse 5', 'Warehouse 6'];

    foods: Food[] = [
    {value: 'small-0', viewValue: 'Small'},
    {value: 'medius-1', viewValue: 'Medium'},
    {value: 'large-2', viewValue: 'Large'},
    {value: 'extra-large-3', viewValue: 'Extra Large'},
    {value: 'extra-extra-large-4', viewValue: 'Extra Extra Large'},
  ];


    ngOnInit() {
        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        for(this.stockListBoxIndex = 0 ; this.stockListBoxIndex<this.stockListBox.length; this.stockListBoxIndex++ ){
            this.stockListBox[this.stockListBoxIndex].addEventListener('click',function(){
                this.classList.toggle("active");
            })
        }
    }
}