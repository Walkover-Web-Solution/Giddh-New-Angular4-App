import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-convert-bill-dialog',
  templateUrl: './convert-bill-dialog.component.html',
  styleUrls: ['./convert-bill-dialog.component.scss']
})
export class ConvertBillDialogComponent implements OnInit {
  /** Emits convert To Bill form value */
  @Output() public convertToBill = new EventEmitter<any>();
  public form: FormGroup;
  public showForm: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public vouchers,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  /**
   * Lifecycle hook for destroy
   *
   * @memberof ConvertBillDialogComponent
   */
  public ngOnInit(): void {
    if (this.vouchers) {
      let formArray = this.form.get('purchaseOrders') as FormArray;
      if (this.vouchers?.length) {
        this.vouchers.forEach(voucher => {
          formArray.push(this.setPurchaseOrderValue(voucher));
        });
      } else {
        let formAarry = this.form.get('purchaseOrders') as FormArray;
        formAarry.push(this.setPurchaseOrderValue(this.vouchers));
      }
    }
  }

  /**
   * Initialise Form
   *
   * @private
   * @memberof ConvertBillDialogComponent
   */
  private initForm(): void {
    this.form = this.formBuilder.group({
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
  private setPurchaseOrderValue(voucher): FormGroup {
    return this.formBuilder.group({
      orderNumber: [voucher?.voucherNumber ?? ''],
      purchaseNumber: [voucher?.purchaseNumber ?? null]
    });
  }

  /**
   * Handle Form Submit 
   *
   * @memberof ConvertBillDialogComponent
   */
  public onFormSubmit(): void {
    this.convertToBill.emit(this.form.value);
  }
}
