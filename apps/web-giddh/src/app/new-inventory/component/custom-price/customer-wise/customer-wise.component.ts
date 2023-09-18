import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";

export interface PeriodicElement {
    name: string;
    price: string;
    radio: string;
    discount: string;
    quantity: string;
    delete: string;
}

const ELEMENT_DATA: any[] = [
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: ''},
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' }
];

@Component({
    selector: "customer-wise",
    templateUrl: "./customer-wise.component.html",
    styleUrls: ["./customer-wise.component.scss"]
})
export class CustomerWiseComponent implements OnInit, OnDestroy {
    /** Instance of Mat Dialog for Add Customer */
    @ViewChild("addCustomer") public addCustomer: TemplateRef<any>;
    /** Instance of Mat Dialog for Add Inventory */
    @ViewChild("addSearchModal") public addSearchModal: TemplateRef<any>;
    /** Instance of Mat Dialog for Add Variant */
    @ViewChild("addVariant") public addVariant: TemplateRef<any>;
    /*--- table ---*/
    displayedColumns: string[] = ['name', 'price', 'radio', 'discount', 'quantity', 'delete'];
    dataSource = ELEMENT_DATA;
    dataSourceChild = ELEMENT_DATA;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    public commandkDialogRef: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog
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
     * Open Add customer modal
     *
     * @memberof CustomerWiseComponent
     */
    public openAddCustomer(): void {
        this.dialog.open(this.addCustomer, {
            width: '500px',
            height: '200px'
        });
    }

    /**
     * Open Add customer modal
     *
     * @memberof CustomerWiseComponent
     */
    public openSearchModal(): void {
        this.dialog.open(this.addSearchModal, {
            width: '650px'
        });
    }
    

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnDestroy(): void {
    }
}