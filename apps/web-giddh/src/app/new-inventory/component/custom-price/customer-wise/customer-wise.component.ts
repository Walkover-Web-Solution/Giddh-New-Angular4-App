import { Component, OnDestroy, OnInit } from "@angular/core";

export interface PeriodicElement {
    name: string;
    price: string;
    radio: string;
    discount: string;
    quantity: string;
    delete: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { name: 'Hydrogen', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' }
];

@Component({
    selector: "customer-wise",
    templateUrl: "./customer-wise.component.html",
    styleUrls: ["./customer-wise.component.scss"]
})
export class CustomerWiseComponent implements OnInit, OnDestroy {
    /*--- table ---*/
    displayedColumns: string[] = ['name', 'price', 'radio', 'discount', 'quantity', 'delete'];
    dataSource = ELEMENT_DATA;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnInit(): void {
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnDestroy(): void {
    }
}