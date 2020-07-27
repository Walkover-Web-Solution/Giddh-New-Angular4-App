import {Directive, Input} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import * as moment from "moment";
import {VoucherTypeEnum} from "../../models/api-models/Sales";

@Directive({
    selector: '[validateDate]',
    providers: [{provide: NG_VALIDATORS, useExisting: ValidateDatesDirective, multi: true}]
})
export class ValidateDatesDirective implements Validator {
    @Input('validateDate') dateControls: string[] = [];

    validate(formGroup: FormGroup): ValidationErrors {
        return validateDate(this.dateControls[0], this.dateControls[1], this.dateControls[2], this.dateControls[3])(formGroup);
    }
}

export function validateDate(invoiceDate: string, invoiceDueDate: string, voucherItems: string, invoiceType: string) {
    return (formGroup: FormGroup) => {
        const invoiceDateControl = formGroup.controls[invoiceDate];
        const invoiceDueDateControl = formGroup.controls[invoiceDueDate];
        const entryLength = parseInt(voucherItems);
        const type = invoiceType as VoucherTypeEnum;
        // return null if controls haven't initialised yet
        if ((!invoiceDateControl)) {
            return null;
        }
        if (!invoiceDueDateControl && (type === VoucherTypeEnum.purchase || type === VoucherTypeEnum.sales ||
                type === VoucherTypeEnum.generateProforma || type === VoucherTypeEnum.generateEstimate)) {
            return null
        }
        // return null if another validator has already found an error on the invoiceDueDateControl
        if (invoiceDueDateControl && invoiceDueDateControl.errors && !invoiceDueDateControl.errors.mustGrater) {
            return null;
        }

        // set errors on entry dates
        if (entryLength && !isNaN(entryLength)) {
            let invalidIndex: number[] = [];
            if (type === VoucherTypeEnum.generateProforma ||
                type === VoucherTypeEnum.generateEstimate ||
                type === VoucherTypeEnum.sales ||
                type === VoucherTypeEnum.cash ||
                type === VoucherTypeEnum.creditNote ||
                type === VoucherTypeEnum.debitNote) {
                for (let i = 0; i < entryLength; i++) {
                    if (formGroup.controls['transaction.date_' + i.toString()]) {
                        const entryDate = formGroup.controls['transaction.date_' + i.toString()].value;
                        if (moment(invoiceDateControl.value).isBefore(moment(entryDate))) {
                            invalidIndex = [...invalidIndex, i];
                        }
                    }
                }
            } else if (type === VoucherTypeEnum.purchase) {
                for (let i = 0; i < entryLength; i++) {
                    if (formGroup.controls['transaction.date_' + i.toString()]) {
                        const entryDate = formGroup.controls['transaction.date_' + i.toString()].value;
                        if ((moment(invoiceDateControl.value).get('month') !== moment(entryDate).get('month')) || (moment(invoiceDateControl.value).get('year') !== moment(entryDate).get('year'))) {
                            invalidIndex = [...invalidIndex, i];
                        }
                    }
                }
            }
            if (invalidIndex && invalidIndex.length) {
                invalidIndex.forEach(index => {
                    if (type !== VoucherTypeEnum.purchase) {
                        formGroup.controls['transaction.date_' + index.toString()].setErrors({beforeEntry: true});
                    } else {
                        formGroup.controls['transaction.date_' + index.toString()].setErrors({sameMMDD: true});
                    }
                })
            } else {
                for (let i = 0; i < entryLength; i++) {
                    if (formGroup.controls['transaction.date_' + i.toString()]) {
                        formGroup.controls['transaction.date_' + i.toString()].setErrors(null)
                    }
                }
            }
        }
        // set error on invoiceDueDateControl if validation fails
        if(invoiceDueDateControl && invoiceDueDateControl.value) {
            if (moment(invoiceDateControl.value).isSameOrBefore(moment(invoiceDueDateControl.value), 'day')) {
                invoiceDueDateControl.setErrors(null);
            } else {
                invoiceDueDateControl.setErrors({mustGrater: true});
            }
        }
    }
}
