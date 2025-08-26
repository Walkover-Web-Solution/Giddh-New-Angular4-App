import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { ServiceConfig } from "apps/web-giddh/src/app/services/service.config";


export interface PeriodicElement {
    group: string;
    items: string;
    openingValue: string;
    inwardValue: string;
    outwardValue: string;
    closingValue: string;
    // lessStock: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        // lessStock: "42",
    },

];

@Component({
    selector: "list-group",
    templateUrl: "./list-group.component.html",
    styleUrls: ["./list-group.component.scss"],

})

export class ListGroupComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = "";
    public showValueCondition = false;
    displayedColumns: string[] = ["select", "group", "openingValue", "inwardValue", "outwardValue", "closingValue"];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    constructor(@Inject(ServiceConfig) private serviceConfig ){}

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected?.length;
        const numRows = this.dataSource.data?.length;
        return numSelected === numRows;
    }

    showValue() {
        this.showValueCondition = true;
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

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? "assets/images/" : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + "assets/images/";
    }
}
