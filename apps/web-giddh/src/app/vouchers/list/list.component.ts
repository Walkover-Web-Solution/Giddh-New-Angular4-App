import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

export interface PeriodicElement {
    invoice: string;
    position: number;
    customer: string;
    invoicedate: string;
    amount: string;
    balance: string;
    duedate: string;
    invoicestatus: string;
    status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, invoice: 'Hydrogen', customer: '1.0079', invoicedate: 'H', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
];

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class VoucherListComponent implements OnInit, OnDestroy {
    public moduleType: string = "";
    // This will store selected date range to use in api
    public selectedDateRange: any;
    // This will store selected date range to show on UI
    public selectedDateRangeUi: any;
    // Selected range label
    public selectedRangeLabel: any = "";
    // table data
    displayedColumns: string[] = ['position', 'invoice', 'customer', 'invoicedate', 'amount', 'balance', 'duedate', 'invoicestatus', 'status'];
    dataSource = ELEMENT_DATA;

    // advance search dialog
    @ViewChild('advancesearch', { static: true }) public advancesearch: TemplateRef<any>;
    // export dialog
    @ViewChild('export', { static: true }) public export: TemplateRef<any>;
    // export dialog
    @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    // adjust payment dialog
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog
    ) {

    }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {

    }
    // filter dialog 
    public advanceSearchDialog():void {
        this.dialog.open(this.advancesearch, {
            panelClass: ['mat-dialog-md']
        })
    }
    // export dialog
    public exportDialog():void {
        this.dialog.open(this.export, {
            panelClass: ['mat-dialog-md']
        })
    }
    // paid dialog
    public onPerformAction():void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        })
    }
    // adjust payment dialog
    public adjustPayment():void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        })
    }
}