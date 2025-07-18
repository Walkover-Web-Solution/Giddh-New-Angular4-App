import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, ReplaySubject, take, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { PAGE_SIZE_OPTIONS } from '../../app.constant';
import { SalesBifurcationDetailsStore } from './utility/sales-bifurcation-details.store';
import { SalesBifurcationDetailsActionEnum } from './utility/sales-bifurcation-details.constant';
import { SalesBifurcationDetailsService } from './utility/sales-bifurcation-details.service';

@Component({
    selector: 'sales-bifurcation-details',
    templateUrl: './sales-bifurcation-details.component.html',
    styleUrls: ['./sales-bifurcation-details.component.scss'],
    providers: [SalesBifurcationDetailsService, SalesBifurcationDetailsStore]
})

export class SalesBifurcationDetailsComponent implements OnInit, OnDestroy {
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form submission flag */
    public isFormSubmitted: boolean = false;
    /** Create form group of Name, Email and Mobile Number */
    public salesPersonForm: FormGroup;
    /** Sales Bifurcation Details Store */
    public salesBifurcationDetailsList$: Observable<any> = this.componentStore.salesBifurcationDetailsList$;
    /** Sales Bifurcation Details Save In Progress */
    public salesBifurcationDetailsListInProgress$: Observable<boolean> = this.componentStore.salesBifurcationDetailsListInProgress$;
    /** Displayed columns for sales person table */
    public displayedColumns: string[] = [];
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds advance Filters keys */
    public requestParams: any = {
        page: 1,
        count: this.pageSizeOptions[0],
        value: '',
        type: '',
        dataType: '',
        q: '',
        sort: 'asc',
        fromDate: '',
        toDate: ''
    };
    /** Hold Sales Bifurcation Details Client List */
    public salesBifurcationDetailsClientList: any = [];
    /** Hold Sales Bifurcation Details Invoice List */
    public salesBifurcationDetailsInvoiceList: any = [];
    /** Stores the searched name value for the Name filter */
    public searchValue: FormControl = new FormControl<string>('');
    /** Displayed columns for client table */
    public clientDisplayedColumns: string[] = ['name', 'uniqueName', 'action'];
    /** Displayed columns for invoice table */
    public invoiceDisplayedColumns: string[] = ['date', 'invoiceNumber', 'customerName', 'amount'];
    /** Holds advance Filters keys */
    public showClearFilter: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** Selected invoice details */
    public selectedItem: any;
    // public invoiceData: any = {
    //     "page": 1,
    //     "totalPages": 0,
    //     "totalItems": 0,
    //     "count": 0,
    //     "invoiceDetails": [
    //       {
    //         "date": "2025-07-15T00:00:00.000+0000",
    //         "invoiceNumber": "INV-001",
    //         "customerName": "Acme Corporation",
    //         "amount": 12500.75,
    //         "voucherUniqueName": "inv-001-acme"
    //       },
    //       {
    //         "date": "2025-07-12T00:00:00.000+0000",
    //         "invoiceNumber": "INV-002",
    //         "customerName": "Beta Ltd.",
    //         "amount": 9800.00,
    //         "voucherUniqueName": "inv-002-beta"
    //       }
    //     ]
    // };
    // public clientData: any = {
    //     "page": 1,
    //     "totalPages": 0,
    //     "totalItems": 0,
    //     "count": 0,
    //     "clientDetails": [
    //         {
    //           "name": "Acme Corporation",
    //           "uniqueName": "acme-corp"
    //         },
    //         {
    //           "name": "Beta Ltd.",
    //           "uniqueName": "beta-ltd"
    //         }
    //       ]
    // };
    constructor(
        @Inject(MAT_DIALOG_DATA) public salesBifurcationDetailsData: any,
        public dialogRef: MatDialogRef<any>,
        private componentStore: SalesBifurcationDetailsStore,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public ngOnInit(): void {
        console.log(this.salesBifurcationDetailsData);
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";

        this.requestParams.type = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.type;
        this.requestParams.dataType = this.salesBifurcationDetailsData?.subType;
        this.requestParams.fromDate = this.salesBifurcationDetailsData?.newVsOldInvoicesData?.fromDate;
        this.requestParams.toDate = this.salesBifurcationDetailsData?.newVsOldInvoicesData?.toDate;
        this.requestParams.value = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.value;

        this.salesBifurcationDetailsList$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe(data => {
            console.log(data);
            if (this.salesBifurcationDetailsData?.subType === 'client') {
                this.salesBifurcationDetailsClientList = data?.clientDetails;
            } else {
                this.salesBifurcationDetailsInvoiceList = data?.invoiceDetails;
            }
        });

        this.searchValue?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText || searchedText === '') {
                this.showClearFilter = true;
                this.requestParams.q = searchedText;
                this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
            }
        });

        this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });

    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof SalesBifurcationDetailsComponent
     */
    public handlePageChange(event: any): void {
        this.requestParams.page = event.pageIndex + 1;
        this.requestParams.count = event.pageSize;
        this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
    }

    /**
     * Closes the dialog
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public closeDialog(): void {
        this.dialogRef?.close();
    }

    /**
     * Reset filter
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public resetFilter(): void {
        this.showClearFilter = false;
        this.requestParams.q = '';
        this.searchValue?.setValue(null);
        this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
    }

    /**
     *This will be use for table sorting
     *
     * @param {*} event
     * @memberof SalesBifurcationDetailsComponent
     */
    public sortChange(event: any): void {
        this.requestParams.sort = event?.direction ? event?.direction : 'asc';
        this.requestParams.sortBy = event?.active;
        this.requestParams.page = 1;
        this.showClearFilter = true;
        this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
    }

    /**
     * Shows the attachments popup
     *
     * @param {*} transaction
     * @memberof SalesBifurcationDetailsComponent
     */
    public openInvoice(templateRef: TemplateRef<any>, transaction: any): void {
        console.log(transaction);
        transaction['voucherNumber'] = transaction?.invoiceNumber;
        this.selectedItem = transaction;

        let dialogRef = this.dialog.open(templateRef, {
            width: '70%',
            height: '790px',
            role: 'alertdialog',
            ariaLabel: 'template'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
            this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
        });
    }

    /**
     * Releases memory
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}