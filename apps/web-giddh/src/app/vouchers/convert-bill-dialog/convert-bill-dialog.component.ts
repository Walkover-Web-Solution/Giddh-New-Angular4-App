import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-convert-bill-dialog',
    templateUrl: './convert-bill-dialog.component.html',
    styleUrls: ['./convert-bill-dialog.component.scss'],
    standalone: false
})
/**
 * ConvertBillDialogComponent component
 * Handles convertbilldialog functionality and user interactions
 */
export class ConvertBillDialogComponent implements OnInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emits convert To Bill form value */
    @Output() public convertToBill = new EventEmitter<any>();
    /** Hold Form group */
    public convertToBillForm: FormGroup;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public vouchers,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder
    ) {
        this.initForm();
    }

    /**
     * Initializes the component
     *
     * @memberof ConvertBillDialogComponent
     */
    public ngOnInit(): void {
        /**
         * Handles if functionality
         */
        if (this.vouchers?.length) {
            let formArray = this.convertToBillForm.get('purchaseOrders') as FormArray;
            (Array.isArray(this.vouchers) ? this.vouchers : []).forEach(voucher => {
                formArray.push(this.getPurchaseOrderFormGroup(voucher));
            });  
        }
    }

    /**
     * Initialise Form
     *
     * @private
     * @memberof ConvertBillDialogComponent
     */
    private initForm(): void {
        this.convertToBillForm = this.formBuilder.group({
            purchaseOrders: this.formBuilder.array([]) // Properly initialize the FormArray
        });
    }

    /**
     * Set Purchase Order Value
     *
     * @private
     * @param {*} voucher
     * @return {*}  {FormGroup}
     * @memberof ConvertBillDialogComponent
     */
    private getPurchaseOrderFormGroup(voucher?: any): FormGroup {
        return this.formBuilder.group({
            orderNumber: [voucher?.voucherNumber ?? ''],
            purchaseNumber: ['']
        });
    }

    /**
     * Handle Form Submit 
     *
     * @memberof ConvertBillDialogComponent
     */
    public onFormSubmit(): void {
        this.convertToBill.emit(this.convertToBillForm.value);
    }
}
