import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { ConfirmationModalConfiguration } from "../../theme/confirmation-modal/confirmation-modal.interface";
import { GeneralService } from "../../services/general.service";

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
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus:'', status:'' },
];

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class VoucherListComponent implements OnInit, OnDestroy, AfterViewInit {
    public moduleType: string = "";
    // This will store selected date range to use in api
    public selectedDateRange: any;
    // This will store selected date range to show on UI
    public selectedDateRangeUi: any;
    // Selected range label
    public selectedRangeLabel: any = "";
    // table data
    displayedColumns: string[] = ['position', 'invoice', 'customer', 'invoicedate', 'amount', 'balance', 'duedate', 'invoicestatus', 'status'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);;

    // advance search dialog
    @ViewChild('advancesearch', { static: true }) public advancesearch: TemplateRef<any>;
    // export dialog
    @ViewChild('export', { static: true }) public export: TemplateRef<any>;
    // export dialog
    @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    // adjust payment dialog
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    // bulk update dialog
    @ViewChild('bulkUpdate', { static: true }) public bulkUpdate: TemplateRef<any>;
    // table paginator
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // table sorting
    @ViewChild(MatSort) sort: MatSort;
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
      }
    public showNameSearch: boolean;
    /** Invoice confirmation popup configuration */
    public InvoiceConfirmationConfiguration: ConfirmationModalConfiguration;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Hold invoice  type*/
    public selectedInvoiceType: any = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private generalService: GeneralService
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
        });
    }
    // export dialog
    public exportDialog():void {
        this.dialog.open(this.export, {
            width: '600px'
        });
    }
    // paid dialog
    public onPerformAction():void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // adjust payment dialog
    public adjustPayment():void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // bulk update dialog 
    public bulkUpdateDialog():void {
        this.dialog.open(this.bulkUpdate, {
            panelClass: ['mat-dialog-md']
        });
    }
    // delete confirmation dialog
    public deleteVoucherDialog():void {
        this.InvoiceConfirmationConfiguration = this.generalService.getDeleteBranchTransferConfiguration(this.localeData, this.commonLocaleData, this.selectedInvoiceType,);
        this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.InvoiceConfirmationConfiguration
            }
        });
    }

    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showNameSearch = true;
        }
    }
}