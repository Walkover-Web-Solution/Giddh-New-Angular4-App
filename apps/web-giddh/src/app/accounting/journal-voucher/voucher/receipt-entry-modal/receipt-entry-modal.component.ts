import { TemplateRef, Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
@Component({
    selector: 'receipt-entry',
    templateUrl: './receipt-entry-modal.component.html',
    styleUrls: ['./receipt-entry-modal.component.scss'],
})

export class ReceiptEntryModalComponent implements OnInit {
    @Input() public transaction: any;

    @ViewChild('referenceType') public referenceType: ShSelectComponent;

    public modalRef: BsModalRef;
    public selectTax: IOption[] = [];
    public selectInvNoDateAmount: IOption[] = [];
    public selectRef: IOption[] = [
        { label: "Receipt", value: "receipt" },
        { label: "Advance Receipt", value: "advanceReceipt" },
        { label: "Against  Reference", value: "againstReference" }
    ];
    public receiptEntries: any[] = [];
    public totalEntries: number = 0;
    public isValidForm: boolean = false;

    constructor(private modalService: BsModalService, private toaster: ToasterService) {

    }

    public ngOnInit(): void {
        this.addNewEntry();
    }

    public addNewEntry(): void {
        this.receiptEntries[this.totalEntries] = {
            type: '',
            note: '',
            tax: '',
            invoiceNo: '',
            amount: 0
        }

        // setTimeout(() => {
        //     if(this.referenceType) {
        //         this.referenceType.show('');
        //     }
        // }, 100);
    }

    public validateAmount(event: KeyboardEvent): void {
        if((event.keyCode === 9 || event.keyCode === 13) && this.transaction && this.transaction.amount) {
            let receiptTotal = 0;

            this.receiptEntries.forEach(receipt => {
                receiptTotal += parseFloat(receipt.amount);
            });

            if(receiptTotal < this.transaction.amount) {
                this.totalEntries++;
                this.addNewEntry();
            } else if(receiptTotal > this.transaction.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast("Amount can't be greater than Credit Amount.");
            } else {
                this.isValidForm = true;
            }
        }
    }
}