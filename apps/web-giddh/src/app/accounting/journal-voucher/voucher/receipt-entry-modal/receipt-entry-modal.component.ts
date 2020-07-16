import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject, of as observableOf, Observable } from 'rxjs';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { adjustmentTypes } from "../../../../shared/helpers/adjustmentTypes";
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';

@Component({
    selector: 'receipt-entry',
    templateUrl: './receipt-entry-modal.component.html',
    styleUrls: ['./receipt-entry-modal.component.scss'],
})

export class ReceiptEntryModalComponent implements OnInit, OnDestroy {
    @Input() public transaction: any;
    @Input() public activeCompany: any;
    @Input() public voucherDate: any;
    @Output() public entriesList: EventEmitter<any> = new EventEmitter();

    public receiptEntries: any[] = [];
    public modalRef: BsModalRef;
    public pendingInvoiceList: any[] = [];
    public pendingInvoiceListSource$: Observable<IOption[]> = observableOf([]);
    public adjustmentTypes: IOption[] = [];
    public totalEntries: number = 0;
    public isValidForm: boolean = false;
    public amountErrorMessage: string = "Amount can't be greater than Credit Amount.";
    public invoiceAmountErrorMessage: string = "Amount can't be greater than Invoice Balance Due.";
    public taxList: any[] = [];
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    public pendingInvoicesList: any[] = [];
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: "receipt"
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private toaster: ToasterService, private store: Store<AppState>, private salesService: SalesService, private companyActions: CompanyActions) {

    }

    public ngOnInit(): void {
        adjustmentTypes.map(type => {
            this.adjustmentTypes.push({ label: type.label, value: type.value });
        });

        if (this.transaction && this.transaction.selectedAccount) {
            if (this.transaction.voucherAdjustments) {
                this.receiptEntries = this.transaction.voucherAdjustments;
                this.totalEntries = this.receiptEntries.length;
                this.validateEntries(false);
            } else {
                this.addNewEntry();
            }

            this.pendingInvoicesListParams.accountUniqueNames.push(this.transaction.selectedAccount.UniqueName);
            this.getInvoiceListForReceiptVoucher();
        }

        this.getTaxList();
    }

    public addNewEntry(): void {
        if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
            this.receiptEntries[this.totalEntries] = {
                type: 'receipt',
                note: '',
                tax: {
                    name: '',
                    uniqueName: '',
                    percent: 0,
                    value: 0
                },
                invoice: {
                    number: '',
                    date: '',
                    amount: 0,
                    uniqueName: ''
                },
                amount: 0
            }
            this.totalEntries++;
        }
    }

    public validateAmount(event: KeyboardEvent, entry: any): void {
        if ((event.keyCode === 9 || event.keyCode === 13) && this.transaction && this.transaction.amount) {
            this.validateEntry(entry);
        }
    }

    public validateEntry(entry: any): void {
        if (!entry.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast("Please enter amount");
        } else if (isNaN(parseFloat(entry.amount)) || entry.amount <= 0) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast("Please enter valid amount");
        }

        if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
            entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
        } else {
            entry.tax.value = 0;
        }

        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += parseFloat(receipt.amount);
        });

        if (receiptTotal < this.transaction.amount) {
            if (entry.type === "againstReference") {
                let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice.uniqueName].balanceDue.amountForAccount);
                if (invoiceBalanceDue >= entry.amount) {
                    this.addNewEntry();
                } else if (invoiceBalanceDue < entry.amount) {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(this.invoiceAmountErrorMessage);
                }
            } else {
                this.addNewEntry();
            }
        } else if (receiptTotal > this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
        } else {
            entry.amount = parseFloat(entry.amount);
            this.isValidForm = true;
        }
    }

    public emitEntries(): void {
        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += parseFloat(receipt.amount);
        });

        if (receiptTotal < this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
        } else if (receiptTotal > this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
        } else {
            this.transaction.voucherAdjustments = this.receiptEntries;
            this.entriesList.emit(this.transaction);
        }
    }

    public getTaxList(): void {
        this.store.pipe(select(state => state.company), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                let taxList: IOption[] = [];
                Object.keys(res.taxes).forEach(key => {
                    taxList.push({ label: res.taxes[key].name, value: res.taxes[key].uniqueName });

                    this.taxList[res.taxes[key].uniqueName] = [];
                    this.taxList[res.taxes[key].uniqueName] = res.taxes[key];
                });
                this.taxListSource$ = observableOf(taxList);
            } else {
                this.store.dispatch(this.companyActions.getTax());
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getInvoiceListForReceiptVoucher(): void {
        this.salesService.getInvoiceListForReceiptVoucher(this.voucherDate, this.pendingInvoicesListParams).subscribe(response => {
            if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
                let pendingInvoiceList: IOption[] = [];

                Object.keys(response.body.results).forEach(key => {
                    this.pendingInvoiceList[response.body.results[key].uniqueName] = [];
                    this.pendingInvoiceList[response.body.results[key].uniqueName] = response.body.results[key];

                    pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " cr.", value: response.body.results[key].uniqueName });
                });
                this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);
            }
        });
    }

    public onSelectTax(event: any, entry: any): void {
        if (event && event.value) {
            entry.tax.name = this.taxList[event.value].name;
            entry.tax.percent = this.taxList[event.value].taxDetail[0].taxValue;

            if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
                entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
            } else {
                entry.tax.value = 0;
            }
        } else {
            entry.tax = {
                name: '',
                uniqueName: '',
                percent: 0,
                value: 0
            }
        }
    }

    public onSelectInvoice(event: any, entry: any): void {
        if (event && event.value) {
            entry.invoice = {
                number: this.pendingInvoiceList[event.value].voucherNumber,
                date: this.pendingInvoiceList[event.value].voucherDate,
                amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " cr.",
                uniqueName: event.value
            };
        } else {
            entry.invoice = {
                number: '',
                date: '',
                amount: 0,
                uniqueName: ''
            };
        }
    }

    public removeReceiptEntry(index: number): void {
        let receiptEntries = [];
        let loop = 0;
        this.receiptEntries.forEach(entry => {
            if (loop !== index) {
                receiptEntries.push(entry);
            }
            loop++;
        });

        this.receiptEntries = receiptEntries;
        this.totalEntries--;

        this.validateEntries(true);
    }

    public closePopup(): void {
        this.entriesList.emit(this.transaction);
    }

    public validateEntries(addEntryIfInvalid: boolean): void {
        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += parseFloat(receipt.amount);
        });

        if (receiptTotal !== this.transaction.amount) {
            this.isValidForm = false;
            if (addEntryIfInvalid) {
                this.addNewEntry();
            }
        } else {
            this.isValidForm = true;
        }
    }

    public formatAmount(entry): void {
        entry.amount = Number(entry.amount);
    }
}