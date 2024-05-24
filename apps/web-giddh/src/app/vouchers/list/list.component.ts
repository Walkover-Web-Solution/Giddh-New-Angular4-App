import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { ConfirmationModalConfiguration } from "../../theme/confirmation-modal/confirmation-modal.interface";
import { GeneralService } from "../../services/general.service";
import { TemplatePreviewDialogComponent } from "../template-preview-dialog/template-preview-dialog.component";
import { TemplateEditDialogComponent } from "../template-edit-dialog/template-edit-dialog.component";
import { ReplaySubject, delay, takeUntil } from "rxjs";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { VoucherTypeEnum } from "../utility/vouchers.const";

// invoice-table
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
// invoice-table
const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, invoice: 'Hydrogen', customer: '1.0079', invoicedate: 'H', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
    { position: 2, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
    { position: 3, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
    { position: 4, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
    { position: 5, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
    { position: 6, invoice: 'Helium', customer: '4.0026', invoicedate: 'He', amount: 'H', balance: '', duedate: '', invoicestatus: '', status: '' },
];

// estimate-table
export interface PeriodicElementEstimate {
    estimate: string;
    position: number;
    customer: string;
    estimatedate: string;
    amount: string;
    expirydate: string;
    status: string;
    action: string;
}
// estimate-table
const ESTIMATE_DATA: PeriodicElementEstimate[] = [
    { position: 1, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 2, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 3, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 4, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 5, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 6, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
];

// prforma-table
export interface PeriodicElementProforma {
    proforma: string;
    position: number;
    customer: string;
    proformadate: string;
    amount: string;
    expirydate: string;
    status: string;
    action: string;
}
// prforma-table
const PROFORMA_DATA: PeriodicElementProforma[] = [
    { position: 1, proforma: 'PR-20240111-2', customer: '00000000', proformadate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
];

// pending-table
export interface PeriodicElementPending {
    date: string;
    position: number;
    particular: string;
    amount: string;
    account: string;
    total: string;
    description: string;
}
// pending-table
const PENDING_DATA: PeriodicElementPending[] = [
    { position: 1, date: '08-04-2023', particular: 'Sales', amount: 'H', account: 'USA debtor', total: '₹23.1', description: '' }
];

// credit-table
export interface PeriodicElementCredit {
    credit: string;
    position: number;
    customer: string;
    date: string;
    linked: string;
    amount: string;
    einvoicestatus: string;
    status: string;
}
// credit-table
const CREDIT_DATA: PeriodicElementCredit[] = [
    { position: 1, credit: 'Hydrogen', customer: '1.0079', date: 'H', linked: 'H', amount: '', einvoicestatus: '', status: '' }
];

// purchase-table
export interface PeriodicElementPurchase {
    date: string;
    position: number;
    purchase: string;
    vendorname: string;
    amount: string;
    delivery: string;
    status: string;
}
// purchase-table
const PURCHASE_DATA: PeriodicElementPurchase[] = [
    { position: 1, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 2, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 3, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 4, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' }
];

// bill-table
export interface PeriodicElementBill {
    bill: string;
    position: number;
    vendor: string;
    billdate: string;
    order: string;
    amount: string;
    duedate: string;
    status: string;
}
// bill-table
const BILL_DATA: PeriodicElementBill[] = [
    { position: 1, bill: 'Hydrogen', vendor: 'Ashish RANJAN', billdate: 'H', order: 'H', amount: '', duedate: '', status: '' }
];

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherListComponent implements OnInit, OnDestroy, AfterViewInit {
    public moduleType: string = "";
    // This will store selected date range to use in api
    public selectedDateRange: any;
    // This will store selected date range to show on UI
    public selectedDateRangeUi: any;
    // Selected range label
    public selectedRangeLabel: any = "";
    // invoice table data
    displayedColumns: string[] = ['position', 'invoice', 'customer', 'invoicedate', 'amount', 'balance', 'duedate', 'invoicestatus', 'status'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    // estimate-table
    displayedColumnEstimate: string[] = ['position', 'estimate', 'customer', 'estimatedate', 'amount', 'expirydate', 'status', 'action'];
    dataSourceEstimate = new MatTableDataSource<PeriodicElementEstimate>(ESTIMATE_DATA);
    // proforma-table
    displayedColumnProforma: string[] = ['position', 'proforma', 'customer', 'proformadate', 'amount', 'expirydate', 'status', 'action'];
    dataSourceProforma = new MatTableDataSource<PeriodicElementProforma>(PROFORMA_DATA);
    // pending-table
    displayedColumnPending: string[] = ['position', 'date', 'particular', 'amount', 'account', 'total', 'description'];
    dataSourcePending = new MatTableDataSource<PeriodicElementPending>(PENDING_DATA);
    // credit-table
    displayedColumnsCredit: string[] = ['position', 'credit', 'customer', 'date', 'linked', 'amount', 'einvoicestatus', 'status'];
    dataSourceCredit = new MatTableDataSource<PeriodicElementCredit>(CREDIT_DATA);
    // purchase-table
    displayedColumnPurchase: string[] = ['position', 'date', 'purchase', 'vendorname', 'amount', 'delivery', 'status'];
    dataSourcePurchase = new MatTableDataSource<PeriodicElementPurchase>(PURCHASE_DATA);
    // bill-table
    displayedColumnsBill: string[] = ['position', 'bill', 'vendor', 'billdate', 'order', 'amount', 'duedate', 'status'];
    dataSourceBill = new MatTableDataSource<PeriodicElementBill>(BILL_DATA);

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
    // convert bill dialog
    @ViewChild('convertBill', { static: true }) public convertBill: TemplateRef<any>;
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
    public voucherType: any = '';

    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public activeTabGroup: number = 0;
    public activeModule: string = "list";
    public tabsGroups: any[][] = [
        ["estimates", "proformas", "sales"],
        ["debit note", "credit note"],
        ["purchase-order", "purchase"]
    ];
    public selectedTabIndex: number = 2;
    /** Holds universal date */
    public universalDate: any;
    public advanceFilters: any = {};
    public voucherBalances: any = {
        grandTotal: 0,
        totalDue: 0
    };
    /** Holds company specific data */
    public company: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: ''
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vouchersUtilityService: VouchersUtilityService

    ) {

    }

    public ngOnInit(): void {
        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);
            this.activeModule = params.module;

            this.activeTabGroup = this.tabsGroups.findIndex(group => group.includes(this.voucherType));
            if (this.activeTabGroup === -1) {
                this.activeTabGroup = 0; // default to the first group if not found
            }

            this.getSelectedTabIndex();

            if (this.universalDate) {
                this.getVoucherBalances();
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                try {
                    this.universalDate = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                    this.advanceFilters.from = dayjs(response[0]).format(GIDDH_DATE_FORMAT);
                    this.advanceFilters.to = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                    this.getVoucherBalances();
                } catch (e) {
                    this.universalDate = dayjs().format(GIDDH_DATE_FORMAT);
                }
            }
        });

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
            }
        });

        this.componentStore.voucherBalances$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.voucherBalances = response;
            }
        });
    }

    private getSelectedTabIndex(): void {
        if (this.activeTabGroup === 0) {
            if (this.voucherType === 'estimates' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'proformas' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'sales' && this.activeModule === 'list') {
                this.selectedTabIndex = 2;
            } else if (this.voucherType === 'sales' && this.activeModule === 'pending') {
                this.selectedTabIndex = 3;
            } else if (this.voucherType === 'sales' && this.activeModule === 'settings') {
                this.selectedTabIndex = 4;
            } else if (this.voucherType === 'sales' && this.activeModule === 'templates') {
                this.selectedTabIndex = 5;
            }
        } else if (this.activeTabGroup === 1) {
            if (this.voucherType === 'debit note' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'credit note' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'pending') {
                this.selectedTabIndex = 2;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'settings') {
                this.selectedTabIndex = 3;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'templates') {
                this.selectedTabIndex = 4;
            }
        } else if (this.activeTabGroup === 2) {
            if (this.voucherType === 'purchase-order' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'purchase' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'purchase' && this.activeModule === 'settings') {
                this.selectedTabIndex = 2;
            }
        }
    }

    private redirectToSelectedTab(selectedTabIndex: number): void {
        let voucherType = "";
        let activeModule = "";
        if (this.activeTabGroup === 0) {
            if (selectedTabIndex === 0) {
                voucherType = "estimates";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "proformas";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "sales";
                activeModule = "list";
            } else if (selectedTabIndex === 3) {
                voucherType = "sales";
                activeModule = "pending";
            } else if (selectedTabIndex === 4) {
                voucherType = "sales";
                activeModule = "settings";
            } else if (selectedTabIndex === 5) {
                voucherType = "sales";
                activeModule = "templates";
            } 
        } else if (this.activeTabGroup === 1) {
            if (selectedTabIndex === 0) {
                voucherType = "debit-note";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "credit-note";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "debit-note";
                activeModule = "pending";
            } else if (selectedTabIndex === 3) {
                voucherType = "debit-note";
                activeModule = "settings";
            } else if (selectedTabIndex === 4) {
                voucherType = "debit-note";
                activeModule = "templates";
            } 
        } else if (this.activeTabGroup === 2) {
            if (selectedTabIndex === 0) {
                voucherType = "purchase-order";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "purchase";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "purchase";
                activeModule = "settings";
            }
        }

        this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule]);
    }

    public tabChanged(selectedTabIndex: any): void {
        this.selectedTabIndex = selectedTabIndex;
        this.redirectToSelectedTab(selectedTabIndex);
    }

    public getVoucherBalances(): void {
        if (this.voucherType === VoucherTypeEnum.sales) {
            this.componentStore.getVoucherBalances({ requestType: this.voucherType, payload: this.advanceFilters });
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    // filter dialog 
    public advanceSearchDialog(): void {
        this.dialog.open(this.advancesearch, {
            panelClass: ['mat-dialog-md']
        });
    }
    // export dialog
    public exportDialog(): void {
        this.dialog.open(this.export, {
            width: '600px'
        });
    }
    // paid dialog
    public onPerformAction(): void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // adjust payment dialog
    public adjustPayment(): void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // bulk update dialog 
    public bulkUpdateDialog(): void {
        this.dialog.open(this.bulkUpdate, {
            panelClass: ['mat-dialog-md']
        });
    }
    // delete confirmation dialog
    public deleteVoucherDialog(): void {
        this.InvoiceConfirmationConfiguration = this.generalService.getDeleteBranchTransferConfiguration(this.localeData, this.commonLocaleData, this.voucherType,);
        this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.InvoiceConfirmationConfiguration
            }
        });
    }
    // template dialog
    public templateDialog(): void {
        this.dialog.open(TemplatePreviewDialogComponent, {
            width: '980px'
        });
    }
    // template edit dialog
    public templateEdit(): void {
        this.dialog.open(TemplateEditDialogComponent, {
            width: '100%',
            height: '100vh'
        });
    }

    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showNameSearch = true;
        }
    }

    // convert bill dialog
    public ConvertBillDialog(): void {
        this.dialog.open(this.convertBill, {
            width: '600px'
        })
    }
}