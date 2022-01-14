import { Component, OnInit, ViewChildren } from "@angular/core";
import { ShSelectComponent } from "../../../theme/ng-virtual-select/sh-select.component";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

export interface PeriodicElement {
    name: string;
    type: string;
    group: string;
    SKU: string;
    HSN_SAC: string;
    accounts: string;
    purRate: string;
    saleRate: string;
    closingQty: string;
    sales: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
    {
        name: "Product Name",
        type: "Product",
        group: "Group 1",
        SKU: "23124",
        HSN_SAC: "12345",
        accounts: "Cost Of Goods Sold ",
        sales: "Sales 2",
        purRate: "₹10,00,000.00",
        saleRate: "₹10,00,000.00",
        closingQty: "50",
    },
];


@Component({
    selector: "inventory-product-service-list",
    templateUrl: "./inventory-product-service-list.component.html",
    styleUrls: ["./inventory-product-service-list.component.scss"],

})

export class ProductServiceListComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = "";
    displayedColumns: string[] = ["select", "name", "type", "group", "SKU", "HSN_SAC", "accounts", "purRate", "saleRate", "closingQty"];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    constructor(private _router: Router) {

    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }

    // @ViewChild(MatSort) sort: MatSort;
    //
    // // tslint:disable-next-line:use-life-cycle-interface
    // ngAfterViewInit() {
    //     this.dataSource.sort = this.sort;
    // }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? "deselect" : "select"} all`;
        }
        // @ts-ignore
        return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
    }


}
