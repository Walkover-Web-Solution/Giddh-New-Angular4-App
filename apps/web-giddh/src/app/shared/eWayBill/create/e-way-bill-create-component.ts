import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, TemplateRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from 'rxjs';
import { GIDDH_DATE_FORMAT_DD_MM_YYYY } from '../../helpers/defaultDateFormat';
import { IAllTransporterDetails, IEwayBillfilter, IEwayBillTransporter } from '../../../models/api-models/Invoice';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { EWayBillComponentStore } from '../eWayBill.store';
import { ASIDE_PANE_CONFIG, IOption, PAGINATION_LIMIT } from '../../../app.constant';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-e-way-bill-create',
    templateUrl: './e-way-bill-create-component.html',
    styleUrls: [`./e-way-bill-create-component.scss`],
    providers: [EWayBillComponentStore],
    standalone: false
})
export class EWayBillCreateComponent implements OnInit, OnDestroy {
    /** Template reference for invoice removal confirmation dialog */
    @ViewChild('invoiceRemoveConfirmationModel', { static: true }) public invoiceRemoveConfirmationModel: TemplateRef<any>;
    /** Template reference for account aside menu */
    @ViewChild('accountAsideMenu', { static: true }) public accountAsideMenu: TemplateRef<any>;
    /** Form group for generating e-Way Bill */
    public generateEwayBillform: FormGroup;
    /** Form group for creating a new transporter */
    public generateNewTransporterForm: FormGroup;
    /** Dropdown options for transporters */
    public transporterDropdown$: Observable<IOption[]>;
    /** Flag for transport edit mode */
    public transportEditMode: boolean = false;
    /** Observable list of transporters */
    public transporterList$: Observable<IEwayBillTransporter[]>;
    /** Details of all transporters */
    public transporterListDetails: IAllTransporterDetails;
    /** Transporter filter request */
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    /** Current transporter ID */
    public currenTransporterId: string;
    /** Subject for managing component destruction*/
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds local JSON data */
    public localeData: any = {};
    /** Holds common JSON data */
    public commonLocaleData: any = {};
    /** True, If Form is valid */
    public isFormInvalid: boolean = false;
    /** Getter for vehicle number form control */
    public get vehicleNo(): FormControl {
        return this.generateEwayBillform.get('vehNo') as FormControl;
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
        private componentStore: EWayBillComponentStore,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public currentVoucher: any
    ) {
        this.transporterList$ = this.componentStore.transporterList$;
    }

    /**
    * Initializes the component
    *
    * @private
    * @memberof EWayBillCreateComponent
    */
    public ngOnInit(): void {
        this.initGenerateEwayBillForm();
        this.initGenerateNewTransporterForm();
        this.transporterFilterRequest.page = 1;
        this.transporterFilterRequest.count = PAGINATION_LIMIT;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));

        this.componentStore.transporterListDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.transporterListDetails = response;
            }
        })

        this.componentStore.transporterList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length) {
                let transporterDropdown = null;
                let transporterArr = null;
                transporterDropdown = response;
                transporterArr = transporterDropdown.map(trans => {
                    return { label: trans.transporterName, value: trans.transporterId };
                });
                this.transporterDropdown$ = of(transporterArr);
            }
        });

        this.componentStore.isEwaybillGeneratedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.generateEwayBillform.reset();
            }
        });

        this.componentStore.updateTransporterSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.generateNewTransporterForm.reset();
            }
        });

        this.componentStore.isGenarateTransporterSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
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
            toGstIn: [this.currentVoucher?.gstNumber ?? null, Validators.required],
            toPinCode: [this.currentVoucher?.pincode || null, Validators.required],
            transName: [null, Validators.required],
            transId: [null, Validators.required],
            distance: [null, Validators.required],
            transMode: [null],
            vehType: [null],
            transDocNo: [null],
            transDocDt: [null],
            vehNo: [null]
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
            transporterName: [null, Validators.required]
        });
    }

    /**
     * Clears the transporter form by resetting its fields
     *
     * @memberof EWayBillCreateComponent
     */
    public clearTransportForm(): void {
        this.generateNewTransporterForm.reset();
    }

    /**
     * Closes the dialog and sends a response
     *
     * @param {*} response The response data to send when closing the dialog
     * @memberof EWayBillCreateComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef?.close(response);
    }

    /**
     * Handles the submission of the e-Way Bill form; sends data if user is logged in, otherwise opens login credentials
     *
     * @memberof EWayBillCreateComponent
     */
    public onSubmitEwaybill(): void {
        this.isFormInvalid = this.generateEwayBillform.invalid;
        if (!this.isFormInvalid) {
            const formData = this.generateEwayBillform?.value;
            Object.keys(formData).forEach(key => {
                if (formData[key] === null || (typeof formData[key] === "string" && formData[key].trim() === "")) {
                    delete formData[key];
                }
            });
            if (formData.transDocDt) {
                const formattedDate = dayjs(formData.transDocDt).format(GIDDH_DATE_FORMAT_DD_MM_YYYY);
                if (dayjs(formData.transDocDt).isValid()) {
                    formData.transDocDt = formattedDate;
                } else {
                    delete formData.transDocDt;
                }
            }
            this.sendResponse(formData);
        }
    }

    /**
     * Resets the e-Way Bill form to its initial state
     *
     * @memberof EWayBillCreateComponent
     */
    public onResetGenerateBillForm(): void {
        Object.keys(this.generateEwayBillform.controls).forEach((key) => {
            if (key !== 'toGstIn' && key !== 'toPinCode') {
                this.generateEwayBillform.get(key)?.reset(null);
            }
        });
    }

    /**
     * Opens the transporter model dialog
     *
     * @memberof ExpenseDetailsComponent
     */
    public openTransporterModel(): void {
        this.dialog.open(this.accountAsideMenu, ASIDE_PANE_CONFIG);
    }

    /**
     * Dispatches actions to generate a new transporter and update the transporter list
     *
     * @memberof EWayBillCreateComponent
     */
    public generateTransporter(): void {
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
    public updateTransporter(): void {
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
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Enables edit mode for the selected transporter and populates its details in the form
     *
     * @param {*} trans The transporter details to edit
     * @memberof EWayBillCreateComponent
     */
    public editTransporter(trans: any): void {
        this.setTransporterDetail(trans);
        this.transportEditMode = true;
    }

    /**
     * Populates the transporter form with the given details
     *
     * @param {*} trans The transporter details
     * @memberof EWayBillCreateComponent
     */
    public setTransporterDetail(trans: any): void {
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
    public deleteTransporter(trans: IEwayBillTransporter): void {
        this.store.dispatch(this.invoiceActions.deleteTransporter(trans.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    /**
     * Detects and applies changes to the view
     *
     * @memberof EWayBillCreateComponent
     */
    public detectChanges(): void {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }



    /**
     * Sorts the transporter list based on column and order
     *
     * @param {'asc' | 'desc'} type The sort order
     * @param {string} columnName The column to sort by
     * @memberof EWayBillCreateComponent
     */
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string): void {
        this.transporterFilterRequest.sort = type;
        this.transporterFilterRequest.sortBy = columnName;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    /**
     * Updates a specific field in the `generateEwayBillform` with the given value.
     *
     * @param {string} field - The name of the form control to update.
     * @param {any} value - The new value to set for the form control.
     * @memberof EWayBillCreateComponent
     */
    public updateField(field: string, value: number | string): void {
        this.generateEwayBillform.get(field).patchValue(value);
    }


    /**
     * This will use for page change
     *
     * @param {*} event
     * @memberof LiabilityDetailedReportComponent
     */
    public pageChanged(event: PageEvent): void {
        this.transporterFilterRequest.page = this.transporterFilterRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.transporterFilterRequest.count = event.pageSize;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

}
