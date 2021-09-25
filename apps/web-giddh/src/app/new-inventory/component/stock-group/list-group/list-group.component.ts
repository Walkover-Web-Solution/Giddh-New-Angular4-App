import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";


export interface PeriodicElement {
    group: string;
    items: string;
    openingValue: string;
    inwardValue: string;
    outwardValue: string;
    closingValue: string;
    lessStock: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
    },
    {
        group: "product Name",
        items: "50 Items",
        openingValue: "₹17,48,242.86",
        inwardValue: "₹17,48,242.86",
        closingValue: "₹17,48,242.86",
        outwardValue: "₹17,48,242.86",
        lessStock: "42",
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

    displayedColumns: string[] = ["select", "group", "openingValue", "inwardValue", "outwardValue", "closingValue", "lessStock"];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);


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

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }
}
