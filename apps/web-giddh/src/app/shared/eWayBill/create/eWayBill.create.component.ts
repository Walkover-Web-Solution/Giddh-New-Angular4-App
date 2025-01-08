import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../helpers/defaultDateFormat';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { GenerateEwayBill, IAllTransporterDetails, IEwayBillfilter, IEwayBillTransporter } from '../../../models/api-models/Invoice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-e-way-bill-create',
    templateUrl: './eWayBill.create.component.html',
    styleUrls: [`./eWayBill.create.component.scss`]
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
    /** Modal directive for e-Way Bill credentials */
    @ViewChild('eWayBillCredentials', { static: true }) public eWayBillCredentials: ModalDirective;
    /** Template reference for invoice removal confirmation modal */
    @ViewChild('invoiceRemoveConfirmationModel', { static: true }) public invoiceRemoveConfirmationModel: TemplateRef<any>;
    /** Holds subgroup information */
    @ViewChild('subgrp', { static: true }) public subgrp: any;
    /** Holds document types */
    @ViewChild('doctypes', { static: true }) public doctype: any;
    /** Holds transport details */
    @ViewChild('trans', { static: true }) public transport: any;
    /** Template reference for account aside menu */
    @ViewChild('accountAsideMenu', { static: true }) public accountAsideMenu: TemplateRef<any>;
    /** Form group for generating e-Way Bill */
    public generateEwayBillform: FormGroup;
    /** Form group for creating a new transporter */
    public generateNewTransporterForm: FormGroup;
    /** Holds invoice number */
    public invoiceNumber: string = '';
    /** Holds billing GSTIN number */
    public invoiceBillingGstinNo: string = null;
    /** Holds generated bills */
    public generateBill: any[] = [];
    /** Observable indicating if e-Way Bill generation is in process */
    public isEwaybillGenerateInProcess$: Observable<boolean>;
    /** Observable indicating if e-Way Bill was generated successfully */
    public isEwaybillGeneratedSuccessfully$: Observable<boolean>;
    /** Observable indicating if transporter generation is in process */
    public isGenarateTransporterInProcess$: Observable<boolean>;
    /** Observable indicating if transporter was generated successfully */
    public isGenarateTransporterSuccessfully$: Observable<boolean>;
    /** Observable indicating if transporter update is in process */
    public updateTransporterInProcess$: Observable<boolean>;
    /** Observable indicating if transporter update was successful */
    public updateTransporterSuccess$: Observable<boolean>;
    /** Observable indicating if a user was added successfully */
    public isUserAddedSuccessfully$: Observable<boolean>;
    /** Observable indicating if the logged-in user has access to e-Way Bill */
    public isLoggedInUserEwayBill$: Observable<boolean>;
    /** Dropdown options for transporters */
    public transporterDropdown$: Observable<IOption[]>;
    /** Flag for keydown class */
    public keydownClassAdded: boolean = false;
    /** Status of the component */
    public status: boolean = true;
    /** Flag for transport edit mode */
    public transportEditMode: boolean = false;
    /** Observable list of transporters */
    public transporterList$: Observable<IEwayBillTransporter[]>;
    /** Observable details of all transporters */
    public transporterListDetails$: Observable<IAllTransporterDetails>;
    /** Details of all transporters */
    public transporterListDetails: IAllTransporterDetails;
    /** Transporter filter request */
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    /** Current transporter ID */
    public currenTransporterId: string;
    /** Flag indicating if the user is logged in */
    public isUserlogedIn: boolean;
    /** Confirmation message for delete template */
    public deleteTemplateConfirmationMessage: string;
    /** Confirmation flag */
    public confirmationFlag: string;
    /** Flag for showing the clear button */
    public showClear: boolean = false;
    // public generateEwayBillform: GenerateEwayBill = {
    //     supplyType: null,
    //     subSupplyType: null,
    //     transMode: null,
    //     toPinCode: null,
    //     transDistance: null,
    //     invoiceNumber: null,
    //     transporterName: null,
    //     transporterId: null,
    //     transDocNo: null,
    //     transDocDate: null,
    //     vehicleNo: null,
    //     vehicleType: null,
    //     transactionType: null,
    //     docType: null,
    //     toGstIn: null,
    //     uniqueName: null
    // };

    // public generateNewTransporter: IEwayBillTransporter = {
    //     transporterId: null,
    //     transporterName: null
    // };
    
    /** Selected invoices */
    public selectedInvoices: any[] = [];
    /** Supply type data */
    public supplyType: any = [{}];
    /** Flag for transport mode road */
    public isTransModeRoad: boolean = false;
    /** Configuration for modal settings */
    public modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    /** List of sub-supply types */
    public SubsupplyTypesList: IOption[] = [];
    /** List of supply types */
    public SupplyTypesList: IOption[] = [];
    /** Modified transporter document type */
    public ModifiedTransporterDocType: IOption[] = [];
    /** Transporter document type */
    public TransporterDocType = [];
    /** List of transaction types */
    public transactionType: IOption[] = [];
    /** Subject for managing component destruction*/
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Holds local JSON data */
    public localeData: any = {};
    /** Holds common JSON data */
    public commonLocaleData: any = {};
    /** Selected subtype label */
    public selectedSubType: string = "";
    /** Selected document type label */
    public selectedDocType: string = "";
    /** Voucher details */
    public voucherDetails: any;
    /** Getter for vehicle number form control */
    public get vehicleNo(): FormControl {
        return this.generateEwayBillform.get('vehicleNo') as FormControl;
    }
    /** Getter for transporter ID form control */
    public get transporterId(): FormControl {
        return this.generateNewTransporterForm.get('transporterId') as FormControl;
    }
    /** Getter for transporter name form control */
    public get transporterName(): FormControl {
        return this.generateNewTransporterForm.get('transporterName') as FormControl;
    }

    constructor(private store: Store<AppState>, private invoiceActions: InvoiceActions, private dialogRef: MatDialogRef<any>,
        private _invoiceService: InvoiceService, private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog,
        private _cdRef: ChangeDetectorRef, private toaster: ToasterService, private generalService: GeneralService) {
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
        this.invoiceBillingGstinNo = this.selectedInvoices?.length ? this.selectedInvoices[0]?.billingGstNumber : null;
        // this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
    }

    public toggleEwayBillCredentialsPopup() {
        this.eWayBillCredentials.toggle();
    }

    public ngOnInit() {
        this.initGenerateEwayBillForm();
        this.initGenerateNewTransporterForm();
        this.transporterFilterRequest.page = 1;
        this.transporterFilterRequest.count = 10;
        this._invoiceService.IsUserLoginEwayBill().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.isUserlogedIn = true;
                if (res.body && res.body?.gstIn) {
                    // this.invoiceBillingGstinNo = this.generateEwayBillform.toGstIn = res.body.gstIn;
                    this.invoiceBillingGstinNo = res.body.gstIn;
                    this.generateEwayBillform.get('toGstIn').patchValue(res.body.gstIn);
                }
            } else {
                this.isUserlogedIn = false;
            }
        });
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.selectedInvoices = this._invoiceService.getSelectedInvoicesList;

        this.transporterListDetails$.subscribe(op => {
            this.transporterListDetails = op;
        })
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
            this.generateEwayBillform.get('toGstIn').patchValue(this.invoiceBillingGstinNo);
        } else {
            this.generateEwayBillform.get('toGstIn').patchValue('URP');
        }
        // if (this.selectedInvoices?.length === 0) {
        //     this.redirectToSalesInvoice();
        // }
        this.isEwaybillGeneratedSuccessfully$.subscribe(s => {
            if (s) {
                this.generateEwayBillform.reset();
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

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private initGenerateEwayBillForm(): void {
        this.generateEwayBillform = this.formBuilder.group({
            supplyType: [null],
            subSupplyType: [null],
            transMode: [null],
            toPinCode: [null, Validators.required],
            transDistance: [null],
            invoiceNumber: [null],
            transporterName: [null, Validators.required],
            transporterId: [null, Validators.required],
            transDocNo: [null],
            transDocDate: [null],
            vehicleNo: [null],
            vehicleType: [null],
            transactionType: [null],
            docType: [this.localeData?.modified_transporter_doc_type?.invoice],
            toGstIn: [this.invoiceBillingGstinNo],
            uniqueName: [null]
        });
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private initGenerateNewTransporterForm(): void {
        this.generateNewTransporterForm = this.formBuilder.group({
            transporterId: [null, Validators.required],
            transporterName: [null, Validators.required],
        });
    }
    public clearTransportForm() {
        this.generateNewTransporterForm.get('transporterId').patchValue(null);
        this.generateNewTransporterForm.get('transporterId').patchValue(null);
    }

    /**
     * This will close the dialog and will send response
     *
     * @param {*} response
     * @memberof VoucherCreateComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef.close(response);
    }

    // generate Eway
    public onSubmitEwaybill() {
        this._invoiceService.IsUserLoginEwayBill().pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.sendResponse(this.generateEwayBillform?.value);
            } else {
                this.eWayBillCredentials.toggle();
            }
        });
        this.detectChanges();
    }

    public onCancelGenerateBill() {
        // this.transport.clear();
        // this.generateEwayBillform.get('toPinCode').patchValue(this.voucherDetails?.account?.billingDetails?.pincode || null);
        // this.generateEwayBillform.get('transDistance').patchValue(null);
        // this.generateEwayBillform.get('transMode').patchValue(null);
        // this.generateEwayBillform.get('vehicleType').patchValue(null);
        // this.generateEwayBillform.get('vehicleNo').patchValue(null);
        // this.generateEwayBillform.get('transDocNo').patchValue(null);
        // this.generateEwayBillform.get('transDocDate').patchValue(null);
        this.generateEwayBillform.reset();
    }

    // public selectTransporter(e) {
    //     this.showClear = true;
    //     this.generateEwayBillform.get('transporterName').patchValue(e.label);
    // }

    // public keydownPressed(e) {
    //     if (e.code === 'ArrowDown') {
    //         this.keydownClassAdded = true;
    //     } else if (e.code === 'Enter' && this.keydownClassAdded) {
    //         this.keydownClassAdded = true;
    //         this.OpenTransporterModel();
    //     } else {
    //         this.keydownClassAdded = false;
    //     }
    // }

    /**
     * This will open reject dialog
     *
     * @param {TemplateRef<any>} rejectionReason
     * @memberof ExpenseDetailsComponent
     */
    public OpenTransporterModel(): void {
        this.dialog.closeAll();
        this.dialog.open(this.accountAsideMenu, {
            width: '715px',  //var(--aside-pane-width)
            position: {
                right: '0',
                top: '0'
            },
            height: '100vh',
            disableClose: true
        });
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
            this.generateNewTransporterForm.get('transporterId').patchValue(trans.transporterId);
            this.generateNewTransporterForm.get('transporterName').patchValue(trans.transporterName);
            this.currenTransporterId = trans.transporterId;
        }
        this.detectChanges();
    }

    public deleteTransporter(trans: IEwayBillTransporter) {
        this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.OpenTransporterModel();
        this.detectChanges();
    }

    detectChanges() {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    public pageChanged(event: any): void {
        this.transporterFilterRequest.page = event.page;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        this.transporterFilterRequest.sort = type;
        this.transporterFilterRequest.sortBy = columnName;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    // public selectedModeOfTrans(mode: string) {
    //     if (mode !== 'road') {
    //         this.isTransModeRoad = true;
    //     } else {
    //         this.isTransModeRoad = false;
    //     }
    // }
    // public subTypeElementSelected(event) {
    //     this.doctype.clear();
    //     this.TransporterDocType = this.ModifiedTransporterDocType;
    //     if (event) {
    //         if (event.label === this.localeData?.subsupply_types_list?.supply || event.label === this.localeData?.subsupply_types_list?.export) {
    //             this.TransporterDocType = this.TransporterDocType?.filter((item) => item?.value !== 'CHL');
    //         } else if (event.label === this.localeData?.subsupply_types_list?.job_work) {
    //             this.TransporterDocType = this.TransporterDocType?.filter((item) => item?.value !== 'INV' && item?.value !== 'BIL');
    //         } else {
    //             this.TransporterDocType = this.ModifiedTransporterDocType;
    //         }
    //     }
    // }

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
            // this.prefillDocType();
            this.prefillSubType();
        }
    }

    private prefillSubType(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (activeCompany.baseCurrency === this.selectedInvoices[0]?.account?.currency?.code) {
                    this.generateEwayBillform.get('subSupplyType').patchValue('1');
                    this.selectedSubType = this.localeData?.subsupply_types_list?.supply;
                } else {
                    this.generateEwayBillform.get('subSupplyType').patchValue('3');
                    this.selectedSubType = this.localeData?.subsupply_types_list?.export;
                }
            }
        });
    }

    // private prefillDocType(): void {
    //     this.store.pipe(select(state => state.receipt.voucher), takeUntil(this.destroyed$)).subscribe((voucher: any) => {
    //         console.log("voucher  " , voucher);
    //         if (voucher) {
    //             console.log("voucher1 " , voucher);

    //             if (!voucher?.account?.billingDetails?.pincode) {
    //                 this.toaster.errorToast(this.localeData?.pincode_required);
    //                 this.redirectToSalesInvoice();
    //             }

    //             this.voucherDetails = voucher;

    //             let hasNonNilRatedTax = false;

    //             voucher?.entries?.forEach(entry => {
    //                 entry?.taxes?.forEach(tax => {
    //                     if (tax.taxPercent !== 0) {
    //                         hasNonNilRatedTax = true;
    //                     }
    //                 });
    //             });

    //             if (hasNonNilRatedTax) {
    //                 // this.generateEwayBillform.docType = 'INV';
    //                 this.generateEwayBillform.get('docType').patchValue('INV');
    //                 this.selectedDocType = this.localeData?.modified_transporter_doc_type?.invoice;
    //             } else {
    //                 // this.generateEwayBillform.docType = 'BIL';
    //                 this.generateEwayBillform.get('docType').patchValue('BIL');
    //                 this.selectedDocType = this.localeData?.modified_transporter_doc_type?.bill_supply;
    //             }

    //             // this.generateEwayBillform.toPinCode = voucher?.account?.billingDetails?.pincode;
    //             this.generateEwayBillform.get('toPinCode').patchValue(voucher?.account?.billingDetails?.pincode);

    //             if (this.invoiceBillingGstinNo) {
    //                 // this.generateEwayBillform.toGstIn = this.invoiceBillingGstinNo;
    //                 this.generateEwayBillform.get('toGstIn').patchValue(this.invoiceBillingGstinNo);
    //             } else {
    //                 // this.generateEwayBillform.toGstIn = 'URP';
    //                 this.generateEwayBillform.get('toGstIn').patchValue('URP');
    //             }

    //             // this.generateEwayBillform.uniqueName = voucher?.uniqueName;
    //             this.generateEwayBillform.get('uniqueName').patchValue(voucher?.uniqueName);
    //             console.log(this.selectedDocType);

    //             this._cdRef.detectChanges();
    //         }
    //     });
    // }

    // /**
    //  * Redirect Sales invoice get all page based on voucher version
    //  *
    //  * @private
    //  * @memberof EWayBillCreateComponent
    //  */
    // private redirectToSalesInvoice(): void {
    //     if (this.generalService.voucherApiVersion === 2) {
    //         // this.router.navigate(['/pages/vouchers/preview/sales/list']);
    //     } else {
    //         // this.router.navigate(['/pages/invoice/preview/sales']);
    //     }
    // }
}
