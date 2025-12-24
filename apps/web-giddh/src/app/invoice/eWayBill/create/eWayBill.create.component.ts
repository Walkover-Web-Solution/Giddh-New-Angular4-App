import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { GenerateEwayBill, IEwayBillTransporter, IAllTransporterDetails, IEwayBillfilter } from '../../../models/api-models/Invoice';
import { IOption } from '../../../app.constant';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MM_YYYY } from '../../../shared/helpers/defaultDateFormat';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { PageEvent } from '@angular/material/paginator';
import { ASIDE_PANE_CONFIG, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-e-way-bill-create',
    templateUrl: './eWayBill.create.component.html',
    styleUrls: [`./eWayBill.create.component.scss`],
    standalone:false
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds eWayBillCredentialsTemplate reference */
    @ViewChild('eWayBillCredentialsTemplate', { static: true }) public eWayBillCredentialsTemplate: TemplateRef<any>;
    /** Holds generateInvForm reference */
    @ViewChild('generateInvForm', { static: true }) public generateEwayBillForm: NgForm;
    /** Holds generateTransporterForm reference */
    @ViewChild('generateTransporterForm', { static: true }) public generateNewTransporterForm: NgForm;
    /** Transporter template reference */
    @ViewChild('transporterTemplate', { static: true }) public transporterTemplate: TemplateRef<any>;
    /** Transporter dialog reference */
    public transporterDialogRef: MatDialogRef<any>;

    public invoiceNumber: string = '';
    public invoiceBillingGstinNo: string = '';
    public generateBill: any[] = [];
    public isEwaybillGenerateInProcess$: Observable<boolean>;
    public isEwaybillGeneratedSuccessfully$: Observable<boolean>;
    public isGenarateTransporterInProcess$: Observable<boolean>;
    public isGenarateTransporterSuccessfully$: Observable<boolean>;
    public updateTransporterInProcess$: Observable<boolean>;
    public updateTransporterSuccess$: Observable<boolean>;
    public isUserAddedSuccessfully$: Observable<boolean>;
    public isLoggedInUserEwayBill$: Observable<boolean>;
    public transporterDropdown$: Observable<IOption[]>;
    public keydownClassAdded: boolean = false;
    public transportEditMode: boolean = false;
    public transporterList$: Observable<IEwayBillTransporter[]>;
    public transporterListDetails$: Observable<IAllTransporterDetails>;
    public transporterListDetails: IAllTransporterDetails;
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public currenTransporterId: string;
    public isUserlogedIn: boolean;
    public showClear: boolean = false;
    public generateEwayBillform: GenerateEwayBill = {
        supplyType: null,
        subSupplyType: null,
        transMode: null,
        toPinCode: null,
        transDistance: null,
        invoiceNumber: null,
        transporterName: null,
        transporterId: null,
        transDocNo: null,
        transDocDate: null,
        vehicleNo: null,
        vehicleType: null,
        transactionType: null,
        docType: null,
        toGstIn: null,
        uniqueName: null
    };
    public generateNewTransporter: IEwayBillTransporter = {
        transporterId: null,
        transporterName: null
    };
    public selectedInvoices: any[] = [];
    public supplyType: any = [{}];
    public isTransModeRoad: boolean = false;
    public SubsupplyTypesList: IOption[] = [];
    public SupplyTypesList: IOption[] = [];
    public ModifiedTransporterDocType: IOption[] = [];
    public TransporterDocType = [];
    public transactionType: IOption[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds selected subtype label */
    public selectedSubType: string = "";
    /** Holds selected doctype label */
    public selectedDocType: string = "";
    /** Voucher details */
    public voucherDetails: any;
    /** Transaction type dropdown - (Regular [1] | Bill to - ship to [2] | Bill from - Dispatch from [3] | Combination [4]) */
    public transactionSubType: IOption[] = [];
    /** Dialog reference for eWayBill credentials */
    private eWayBillCredentialsDialogRef: MatDialogRef<any>;
    /** Dialog reference for invoice remove confirmation */
    private invoiceRemoveConfirmationDialogRef: MatDialogRef<any>;
    /** Data source for transporter table */
    public transporterDataSource = new MatTableDataSource<IEwayBillTransporter>();
    /** Displayed columns for transporter table */
    public displayedColumns: string[] = ['transporterName', 'transporterId', 'actions'];

    constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions,
        private _invoiceService: InvoiceService, private router: Router,
        private _cdRef: ChangeDetectorRef, private toaster: ToasterService, private generalService: GeneralService,
        private dialog: MatDialog) {
        this.isEwaybillGenerateInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isGenerateEwaybillInProcess), takeUntil(this.destroyed$));
        this.isEwaybillGeneratedSuccessfully$ = this.store.pipe(select(p => p.ewaybillstate.isGenerateEwaybilSuccess), takeUntil(this.destroyed$));
        this.isGenarateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterSuccess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterSuccess), takeUntil(this.destroyed$));
        this.isGenarateTransporterSuccessfully$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$));
        this.transporterListDetails$ = this.store.pipe(select(p => p.ewaybillstate.TransporterListDetails), takeUntil(this.destroyed$));
        this.transporterList$ = this.store.pipe(select(p => p.ewaybillstate.TransporterList), takeUntil(this.destroyed$));
        this.isLoggedInUserEwayBill$ = this.store.pipe(select(p => p.ewaybillstate.isUserLoggedInEwaybillSuccess), takeUntil(this.destroyed$));
        this.isUserAddedSuccessfully$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillUserCreationSuccess), takeUntil(this.destroyed$));
        this.invoiceBillingGstinNo = this.selectedInvoices?.length ? this.selectedInvoices[0]?.billingGstNumber : '';
        this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
        this.generateEwayBillform.transactionType = '1'; // transactionType is default 1 for Regular
    }

    /**
     * Opens or closes the eWayBill credentials dialog
     *
     * @memberof EWayBillCreateComponent
     */
    public toggleEwayBillCredentialsPopup(): void {
        if (this.eWayBillCredentialsDialogRef) {
            this.eWayBillCredentialsDialogRef.close();
            this.eWayBillCredentialsDialogRef = null;
        } else {
            this.eWayBillCredentialsDialogRef = this.dialog.open(this.eWayBillCredentialsTemplate, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        }
    }

    public ngOnInit() {
        if (this.generalService.voucherApiVersion === 1) {
            this.router.navigate(['pages', 'home']);
            return;
        }
        this.transporterFilterRequest.page = 1;
        this.transporterFilterRequest.count = PAGINATION_LIMIT;
        this._invoiceService.IsUserLoginEwayBill().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.isUserlogedIn = true;
                if (res.body && res.body?.gstIn) {
                    this.invoiceBillingGstinNo = this.generateEwayBillform.toGstIn = res.body.gstIn;
                }
            } else {
                this.isUserlogedIn = false;
            }
        });
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;

        this.transporterListDetails$.subscribe(op => {
            this.transporterListDetails = op;
        });

        this.transporterList$.subscribe(transporters => {
            if (transporters) {
                this.transporterDataSource.data = transporters;
            }
        });
        this.store.pipe(select(state => state.ewaybillstate.TransporterList), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.length) {
                let transporterDropdown = null;
                let transporterArr = null;
                transporterDropdown = p;
                transporterArr = transporterDropdown.map(trans => {
                    return { label: trans.transporterName, value: trans.transporterId };
                });
                this.transporterDropdown$ = of(transporterArr);
            }
        });
        this.invoiceNumber = this.selectedInvoices?.length ? this.selectedInvoices[0]?.voucherNumber : '';
        this.invoiceBillingGstinNo = this.selectedInvoices?.length ? this.selectedInvoices[0]?.billingGstNumber : null;
        if (this.invoiceBillingGstinNo) {
            this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
        } else {
            this.generateEwayBillform.toGstIn = 'URP';
        }
        if (this.selectedInvoices?.length === 0) {
            this.redirectToSalesInvoice();
        }
        this.isEwaybillGeneratedSuccessfully$.subscribe(s => {
            if (s) {
                this.generateEwayBillForm.reset();
            }
        });
        this.updateTransporterSuccess$.subscribe(s => {
            if (s) {
                this.generateNewTransporterForm.reset();
            }
        });

        this.store.pipe(select(state => state.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.clearTransportForm();
            }
        });
    }

    public clearTransportForm() {
        this.generateNewTransporter.transporterId = this.generateNewTransporter.transporterName = null;
    }

    // generate Eway
    public onSubmitEwaybill(generateBillform: NgForm) {
        this._invoiceService.IsUserLoginEwayBill().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.isUserlogedIn = true;
            } else {
                this.isUserlogedIn = false;
            }
        });
        if (this.isUserlogedIn) {
            this.generateBill = generateBillform?.value;
            this.generateBill['supplyType'] = 'O';                     // O is for Outword in case of invoice
            this.generateBill['invoiceNumber'] = this.invoiceNumber;
            this.generateBill['toGstIn'] = this.invoiceBillingGstinNo ? this.invoiceBillingGstinNo : 'URP';
            this.generateBill['transDocDate'] = this.generateBill['transDocDate'] ? dayjs(this.generateBill['transDocDate']).format(GIDDH_DATE_FORMAT_DD_MM_YYYY) : null;
            this.generateBill['uniqueName'] = this.generateEwayBillform?.uniqueName;

            if (generateBillform.valid) {
                this.store.dispatch(this.invoiceActions.GenerateNewEwaybill(generateBillform?.value));
            }
        } else {
            this.toggleEwayBillCredentialsPopup();
        }
        this.detectChanges();
    }

    public onCancelGenerateBill() {
        this.generateEwayBillform.toPinCode = this.voucherDetails?.account?.billingDetails?.pincode || '';
        this.generateEwayBillform.transDistance = null;
        this.generateEwayBillform.transMode = null;
        this.generateEwayBillform.vehicleType = null;
        this.generateEwayBillform.vehicleNo = null;
        this.generateEwayBillform.transDocNo = null;
        this.generateEwayBillform.transDocDate = null;
        this.generateEwayBillform.transactionType = '1';
    }

    public selectTransporter(e) {
        this.showClear = true;
        this.generateEwayBillform.transporterName = e.label;
    }

    public keydownPressed(e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.openTransporterDialog();
        } else {
            this.keydownClassAdded = false;
        }
    }

    /**
     * Opens the transporter dialog
     *
     * @memberof EWayBillCreateComponent
     */
    public openTransporterDialog(): void {
        this.transporterDialogRef = this.dialog.open(this.transporterTemplate, ASIDE_PANE_CONFIG);
        this.generateNewTransporterForm.reset();
        this.transportEditMode = false;
    }

    public generateTransporter(generateTransporterForm: NgForm) {
        this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm?.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    public updateTransporter(generateTransporterForm: NgForm) {
        this.store.dispatch(this.invoiceActions.updateEwayBillTransporter(this.currenTransporterId, generateTransporterForm?.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.transportEditMode = false;
        this.detectChanges();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public editTransporter(trans: any) {
        this.seTransporterDetail(trans);
        this.transportEditMode = true;
    }

    public seTransporterDetail(trans) {
        if (trans !== undefined && trans) {
            this.generateNewTransporter.transporterId = trans.transporterId;
            this.generateNewTransporter.transporterName = trans.transporterName;
            this.currenTransporterId = trans.transporterId;
        }
        this.detectChanges();
    }

    public deleteTransporter(trans: IEwayBillTransporter) {
        this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.openTransporterDialog();
        this.detectChanges();
    }

    /**
     * Opens the invoice remove confirmation dialog
     *
     * @param {any[]} invoice Invoice to be removed
     * @memberof EWayBillCreateComponent
     */
    public removeInvoice(invoice: any[]): void {
        let removeInvoice = this.localeData?.remove_invoice;
        removeInvoice = removeInvoice?.replace("[VOUCHER_NUMBER]", this.selectedInvoices[0]?.voucherNumber);
        this.invoiceRemoveConfirmationDialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(removeInvoice, this.commonLocaleData)
            }
        });
        this.invoiceRemoveConfirmationDialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.selectedInvoices?.splice(0, 1);
                if (this.selectedInvoices?.length === 0) {
                    this.redirectToSalesInvoice();
                }
            }
        });
    }

    detectChanges() {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof EWayBillCreateComponent
     */
    public handlePageEvent(event: PageEvent): void {
        // For transporter list, we always use event.pageIndex + 1 since page size is fixed at 1
        if (this.transporterFilterRequest.count !== event.pageSize) {
            this.transporterFilterRequest.page = 1;
        } else {
            this.transporterFilterRequest.page = event.pageIndex + 1;
        }
        this.transporterFilterRequest.count = event.pageSize;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    /**
     * Handles sorting events and updates API parameters
     *
     * @param {any} event - Contains sorting details
     * @memberof EWayBillCreateComponent
     */
    public sortChange(event: any): void {
        this.transporterFilterRequest.sort = event?.direction;
        this.transporterFilterRequest.sortBy = event?.active;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    public selectedModeOfTrans(mode: string) {
        if (mode !== 'road') {
            this.isTransModeRoad = true;
        } else {
            this.isTransModeRoad = false;
        }
    }
    public subTypeElementSelected(event) {
        this.TransporterDocType = this.ModifiedTransporterDocType;
        if (event) {
            if (event.label === this.localeData?.subsupply_types_list?.supply || event.label === this.localeData?.subsupply_types_list?.export) {
                this.TransporterDocType = this.TransporterDocType?.filter((item) => item?.value !== 'CHL');
            } else if (event.label === this.localeData?.subsupply_types_list?.job_work) {
                this.TransporterDocType = this.TransporterDocType?.filter((item) => item?.value !== 'INV' && item?.value !== 'BIL');
            } else {
                this.TransporterDocType = this.ModifiedTransporterDocType;
            }
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof EWayBillCreateComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.SubsupplyTypesList = [
                { value: '1', label: this.localeData?.subsupply_types_list?.supply },
                { value: '3', label: this.localeData?.subsupply_types_list?.export },
                { value: '4', label: this.localeData?.subsupply_types_list?.job_work },
                { value: '9', label: this.localeData?.subsupply_types_list?.skd_ckd_lots }
            ];

            this.SupplyTypesList = [
                { value: 'O', label: this.localeData?.supply_types_list?.inward },
                { value: 'I', label: this.localeData?.supply_types_list?.outward }
            ];

            this.ModifiedTransporterDocType = [
                { value: 'INV', label: this.localeData?.modified_transporter_doc_type?.invoice },
                { value: 'BIL', label: this.localeData?.modified_transporter_doc_type?.bill_supply },
                { value: 'CHL', label: this.localeData?.modified_transporter_doc_type?.delivery_challan }
            ];

            this.TransporterDocType = [
                { value: 'INV', label: this.localeData?.modified_transporter_doc_type?.invoice },
                { value: 'BIL', label: this.localeData?.modified_transporter_doc_type?.bill_supply },
                { value: 'CHL', label: this.localeData?.modified_transporter_doc_type?.delivery_challan }
            ];

            this.transactionType = [
                { value: '1', label: this.localeData?.transaction_type?.regular },
                { value: '2', label: this.localeData?.transaction_type?.credit_notes },
                { value: '3', label: this.localeData?.transaction_type?.delivery_challan }
            ];
            this.transactionSubType = [
                { value: '1', label: this.localeData?.transaction_sub_type?.regular },
                { value: '2', label: this.localeData?.transaction_sub_type?.bill_to_ship_to },
                { value: '3', label: this.localeData?.transaction_sub_type?.bill_from_dispatch_from },
                { value: '4', label: this.localeData?.transaction_sub_type?.combination }
            ];
            this.prefillDocType();
            this.prefillSubType();
        }
    }

    private prefillSubType(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (activeCompany.baseCurrency === this.selectedInvoices[0]?.account?.currency?.code) {
                    this.generateEwayBillform.subSupplyType = '1';
                    this.selectedSubType = this.localeData?.subsupply_types_list?.supply;
                } else {
                    this.generateEwayBillform.subSupplyType = '3';
                    this.selectedSubType = this.localeData?.subsupply_types_list?.export;
                }
            }
        });
    }

    private prefillDocType(): void {
        this.store.pipe(select(state => state.receipt.voucher), takeUntil(this.destroyed$)).subscribe((voucher: any) => {
            if (voucher) {

                if (!voucher?.account?.billingDetails?.pincode) {
                    this.toaster.errorToast(this.localeData?.pincode_required);
                    this.redirectToSalesInvoice();
                }

                this.voucherDetails = voucher;

                let hasNonNilRatedTax = false;

                voucher?.entries?.forEach(entry => {
                    entry?.taxes?.forEach(tax => {
                        if (tax.taxPercent !== 0) {
                            hasNonNilRatedTax = true;
                        }
                    });
                });

                if (hasNonNilRatedTax) {
                    this.generateEwayBillform.docType = 'INV';
                    this.selectedDocType = this.localeData?.modified_transporter_doc_type?.invoice;
                } else {
                    this.generateEwayBillform.docType = 'BIL';
                    this.selectedDocType = this.localeData?.modified_transporter_doc_type?.bill_supply;
                }

                this.generateEwayBillform.toPinCode = voucher?.account?.billingDetails?.pincode;

                if (this.invoiceBillingGstinNo) {
                    this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
                } else {
                    this.generateEwayBillform.toGstIn = 'URP';
                }

                this.generateEwayBillform.uniqueName = voucher?.uniqueName;

                this._cdRef.detectChanges();
            }
        });
    }

    /**
     * Redirect Sales invoice get all page based on voucher version
     *
     * @private
     * @memberof EWayBillCreateComponent
     */
    private redirectToSalesInvoice(): void {
        if (this.generalService.voucherApiVersion === 2) {
            this.router.navigate(['/pages/vouchers/preview/sales/list']);
        } else {
            this.router.navigate(['/pages/invoice/preview/sales']);
        }
    }
}
