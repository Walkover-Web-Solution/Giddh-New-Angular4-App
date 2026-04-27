import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';
import { SalesBifurcationDetailsStore } from './utility/sales-bifurcation-details.store';
import { SalesBifurcationDetailsService } from './utility/sales-bifurcation-details.service';
import { SalesBifurcationDetailsActionEnum } from './utility/sales-bifurcation-details.constant';
import { PageEvent } from '@angular/material/paginator';
import { ServiceConfig } from '../../services/service.config';

@Component({
    selector: 'sales-bifurcation-details',
    templateUrl: './sales-bifurcation-details.component.html',
    styleUrls: ['./sales-bifurcation-details.component.scss'],
    providers: [SalesBifurcationDetailsService, SalesBifurcationDetailsStore],
    standalone:false
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
        count: PAGINATION_LIMIT,
        value: '',
        type: '',
        dataType: '',
        q: '',
        sort: 'asc',
        sortBy: '',
        fromDate: null,
        toDate: null,
        salesFrom: null,
        salesPersonUniqueNames: null
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
    /** Holds Sales Bifurcation Details Action Enum */
    public salesBifurcationDetailsActionEnum: typeof SalesBifurcationDetailsActionEnum = SalesBifurcationDetailsActionEnum;
    /** Sales Bifurcation Details Query Request */
    public goToLedgerDateRangeFrom: any;
    /** Sales Bifurcation Details Query Request */
    public goToLedgerDateRangeTo: any;


    constructor(
        @Inject(MAT_DIALOG_DATA) public salesBifurcationDetailsData: any,
        public dialogRef: MatDialogRef<any>,
        private componentStore: SalesBifurcationDetailsStore,
        private dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public ngOnInit(): void {
        this.goToLedgerDateRangeFrom = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.fromDate;
        this.goToLedgerDateRangeTo = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.toDate;
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.requestParams.type = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.type;
        this.requestParams.dataType = this.salesBifurcationDetailsData?.subType;
        this.requestParams.fromDate = this.salesBifurcationDetailsData?.newVsOldInvoicesData?.fromDate ?? null;
        this.requestParams.toDate = this.salesBifurcationDetailsData?.newVsOldInvoicesData?.toDate ?? null;
        this.requestParams.value = this.salesBifurcationDetailsData?.newVsOldInvoicesQueryRequest?.value;
        this.requestParams.salesFrom = this.salesBifurcationDetailsData?.salesFrom;
        this.requestParams.salesPersonUniqueNames = this.salesBifurcationDetailsData?.salesPersonUniqueNames ?? null;

        this.salesBifurcationDetailsList$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe(data => {
            if (this.salesBifurcationDetailsData?.subType === this.salesBifurcationDetailsActionEnum.Client) {
                this.salesBifurcationDetailsClientList = data?.clientDetails;
            } else {
                this.salesBifurcationDetailsInvoiceList = data?.invoiceDetails;
            }
        });

        this.initApiCall();

        this.searchValue?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText) {
                this.showClearFilter = true;
                this.requestParams.q = searchedText;
                this.requestParams.page = 1;
                this.requestParams.count = PAGINATION_LIMIT;
                this.initApiCall();
            } else if (searchedText === '') {
                this.showClearFilter = false;
                this.requestParams.q = '';
                this.requestParams.page = 1;
                this.requestParams.count = PAGINATION_LIMIT;
                this.initApiCall();
            }
        });
    }

    /**
     * Init API call
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public initApiCall(): void {
        this.componentStore.getAllSalesBifurcationDetails({ params: this.requestParams });
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof SalesBifurcationDetailsComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.requestParams.page = this.requestParams.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.requestParams.count = event.pageSize;
        this.initApiCall();
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
        this.initApiCall();
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
        this.initApiCall();
    }

    /**
     * Shows the attachments popup
     *
     * @param {*} transaction
     * @memberof SalesBifurcationDetailsComponent
     */
    public openInvoice(templateRef: TemplateRef<any>, transaction: any): void {
        transaction['voucherNumber'] = transaction?.invoiceNumber;
        transaction['salesBifurcation'] = true;
        this.selectedItem = transaction;

        this.dialog.open(templateRef, {
                    width: '70%',
                    height: '790px',
                    maxHeight: '90vh',
                    role: 'alertdialog',
                    ariaLabel: 'template',
                    autoFocus: false
                });
    }

    /**
     * Edit account
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public updateAccount(): void {
        this.resetFilter();
    }

    /**
     * This will be use for send email
     *
     * @memberof SalesBifurcationDetailsComponent
     */
    public sendEmailSuccess(event: any): void {
        if (event) {
            this.requestParams.q = '';
            this.requestParams.page = 1;
            this.requestParams.count = PAGINATION_LIMIT;
            this.initApiCall();
        }
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
