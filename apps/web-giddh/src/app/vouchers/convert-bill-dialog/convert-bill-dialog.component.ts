import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-convert-bill-dialog',
  templateUrl: './convert-bill-dialog.component.html',
  styleUrls: ['./convert-bill-dialog.component.scss']
})
export class ConvertBillDialogComponent implements OnInit {
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

  private initForm(): void {
    this.form = this.formBuilder.group({
      purchaseOrders: this.formBuilder.array([]) // Properly initialize the FormArray
    });
  }

  private setPurchaseOrderValue(voucher): FormGroup {
    return this.formBuilder.group({
      orderNumber: [voucher?.voucherNumber ?? ''],
      purchaseNumber: [voucher?.purchaseNumber ?? null]
    });
  }

  public onFormSubmit(): void {
    this.convertToBill.emit(this.form.value);
  }
}
