import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GIDDH_DATE_FORMAT } from '../../helpers/defaultDateFormat';
import { IAllTransporterDetails, IEwayBillfilter, IEwayBillTransporter } from '../../../models/api-models/Invoice';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-e-way-bill-create',
    templateUrl: './eWayBill.create.component.html',
    styleUrls: [`./eWayBill.create.component.scss`]
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
    /** EWay Bill Credentials template reference  */
    @ViewChild('eWayBillCredentials', { static: true }) public eWayBillCredentials: TemplateRef<any>;
    /** Template reference for invoice removal confirmation dialog */
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
    /** Selected invoices */
    public selectedInvoices: any[] = [];
    /** Supply type data */
    public supplyType: any = [{}];
    /** Flag for transport mode road */
    public isTransModeRoad: boolean = false;
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

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private dialogRef: MatDialogRef<any>,
        private _invoiceService: InvoiceService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _cdRef: ChangeDetectorRef
    ) {
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
    }

    public toggleEwayBillCredentialsPopup() {
        // this.eWayBillCredentials.toggle();
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
     * Initializes the form to generate an e-Way Bill with necessary fields and validators
     *
     * @private
     * @memberof EWayBillCreateComponent
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
     * Initializes the form to generate a new transporter with required fields and validators
     *
     * @private
     * @memberof EWayBillCreateComponent
     */
    private initGenerateNewTransporterForm(): void {
        this.generateNewTransporterForm = this.formBuilder.group({
            transporterId: [null, Validators.required],
            transporterName: [null, Validators.required],
        });
    }

    /**
     * Clears the transporter form by resetting its fields
     *
     * @memberof EWayBillCreateComponent
     */
    public clearTransportForm() {
        this.generateNewTransporterForm.get('transporterId').patchValue(null);
        this.generateNewTransporterForm.get('transporterName').patchValue(null);
    }

    /**
     * Closes the dialog and sends a response
     *
     * @param {*} response The response data to send when closing the dialog
     * @memberof EWayBillCreateComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef.close(response);
    }

    /**
     * Handles the submission of the e-Way Bill form; sends data if user is logged in, otherwise opens login credentials
     *
     * @memberof EWayBillCreateComponent
     */
    public onSubmitEwaybill() {
        if (this.isUserlogedIn) {
            this.sendResponse(this.generateEwayBillform?.value);
        } else {
            // this.eWayBillCredentials.toggle();
            // Convert dialog
        }
        this.detectChanges();
    }
    /**
     * Resets the e-Way Bill form to its initial state
     *
     * @memberof EWayBillCreateComponent
     */
    public onResetGenerateBillForm() {
        this.generateEwayBillform.get('toPinCode').patchValue(this.voucherDetails?.account?.billingDetails?.pincode || null);
        this.generateEwayBillform.get('transDistance').patchValue(null);
        this.generateEwayBillform.get('transMode').patchValue(null);
        this.generateEwayBillform.get('vehicleType').patchValue(null);
        this.generateEwayBillform.get('vehicleNo').patchValue(null);
        this.generateEwayBillform.get('transDocNo').patchValue(null);
        this.generateEwayBillform.get('transDocDate').patchValue(null);
    }

    /**
     * Opens the transporter model dialog
     *
     * @memberof ExpenseDetailsComponent
     */
    public OpenTransporterModel(): void {
        this.dialog.closeAll();
        this.dialog.open(this.accountAsideMenu, {
            width: 'var(--aside-pane-width)',
            position: {
                right: '0',
                top: '0'
            },
            height: '100vh',
            disableClose: true
        });
    }

    /**
     * Dispatches actions to generate a new transporter and update the transporter list
     *
     * @memberof EWayBillCreateComponent
     */
    public generateTransporter() {
        this.store.dispatch(this.invoiceActions.addEwayBillTransporter(this.generateNewTransporterForm?.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.clearTransportForm();
        this.detectChanges();
    }

    /**
     * Dispatches actions to update transporter details and refresh the transporter list
     *
     * @memberof EWayBillCreateComponent
     */
    public updateTransporter() {
        this.store.dispatch(this.invoiceActions.updateEwayBillTransporter(this.currenTransporterId, this.generateNewTransporterForm?.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.transportEditMode = false;
        this.detectChanges();
    }

    /**
     * Cleans up resources when the component is destroyed
     *
     * @memberof EWayBillCreateComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Enables edit mode for the selected transporter and populates its details in the form
     *
     * @param {*} trans The transporter details to edit
     * @memberof EWayBillCreateComponent
     */
    public editTransporter(trans: any) {
        this.setTransporterDetail(trans);
        this.transportEditMode = true;
    }

    /**
     * Populates the transporter form with the given details
     *
     * @param {*} trans The transporter details
     * @memberof EWayBillCreateComponent
     */
    public setTransporterDetail(trans) {
        if (trans !== undefined && trans) {
            this.generateNewTransporterForm.get('transporterId').patchValue(trans.transporterId);
            this.generateNewTransporterForm.get('transporterName').patchValue(trans.transporterName);
            this.currenTransporterId = trans.transporterId;
        }
        this.detectChanges();
    }

    /**
     * Deletes the specified transporter and refreshes the transporter list
     *
     * @param {IEwayBillTransporter} trans The transporter to delete
     * @memberof EWayBillCreateComponent
     */
    public deleteTransporter(trans: IEwayBillTransporter) {
        this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.OpenTransporterModel();
        this.detectChanges();
    }

    /**
     * Detects and applies changes to the view
     *
     * @memberof EWayBillCreateComponent
     */
    public detectChanges(): void {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    /**
     * Handles pagination for the transporter list
     *
     * @param {*} event The pagination event
     * @memberof EWayBillCreateComponent
     */
    public pageChanged(event: any): void {
        this.transporterFilterRequest.page = event.page;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    /**
     * Sorts the transporter list based on column and order
     *
     * @param {'asc' | 'desc'} type The sort order
     * @param {string} columnName The column to sort by
     * @memberof EWayBillCreateComponent
     */
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        this.transporterFilterRequest.sort = type;
        this.transporterFilterRequest.sortBy = columnName;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    /**
     * Callback for translation completion, initializes dropdown lists for subtypes, supply types, and document types
     *
     * @param {*} event The translation event
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
            this.prefillSubType();
        }
    }

    /**
     * Prefills the subtype based on the active company's currency and invoice details
     *
     * @private
     * @memberof EWayBillCreateComponent
     */
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
}
