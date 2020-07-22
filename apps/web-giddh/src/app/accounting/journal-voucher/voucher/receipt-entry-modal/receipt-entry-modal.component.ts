import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChildren } from '@angular/core';
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
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as moment from 'moment';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'receipt-entry',
    templateUrl: './receipt-entry-modal.component.html',
    styleUrls: ['./receipt-entry-modal.component.scss'],
})

export class ReceiptEntryModalComponent implements OnInit, OnDestroy {
    /* Selector for adjustment type field */
    @ViewChildren('adjustmentTypesField') public adjustmentTypesField: ShSelectComponent;
    /* Selected transaction for adjusment */
    @Input() public transaction: any;
    /* Active company object */
    @Input() public activeCompany: any;
    /* Selected voucher date */
    @Input() public voucherDate: any;
    /* Event emitter for the adjustment entries */
    @Output() public entriesList: EventEmitter<any> = new EventEmitter();
    /* List of adjustment entries */
    public receiptEntries: any[] = [];
    /* Object of bootstrap modal */
    public modalRef: BsModalRef;
    /* This will hold list of pending invoices */
    public pendingInvoiceList: any[] = [];
    /* Observable for list of pending invoices */
    public pendingInvoiceListSource$: Observable<IOption[]> = observableOf([]);
    /* This will hold list of adjustment types */
    public adjustmentTypes: IOption[] = [];
    /* Total number of adjusment entries */
    public totalEntries: number = 0;
    /* Will check if form is valid */
    public isValidForm: boolean = false;
    /* Error message for amount comparision with transaction amount */
    public amountErrorMessage: string = "Amount can't be greater than Credit Amount";
    /* Error message for comparision of adjusted amount with invoice */
    public invoiceAmountErrorMessage: string = "Amount can't be greater than Invoice Balance Due";
    /* Error message for invalid adjustment amount */
    public invalidAmountErrorMessage: string = "Please enter valid amount";
    /* Error message for invalid adjustment amount */
    public invoiceErrorMessage: string = "Please select invoice";
    /* This will hold list of tax */
    public taxList: any[] = [];
    /* Observable for list of tax */
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    /* Object for pending invoices list search params */
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: "receipt"
    };
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private toaster: ToasterService, private store: Store<AppState>, private salesService: SalesService, private companyActions: CompanyActions) {

    }

    /**
     * Initializes the component
     *
     * @memberof ReceiptEntryModalComponent
     */
    public ngOnInit(): void {
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

    /**
     * This will add new entry for adjusment
     *
     * @memberof ReceiptEntryModalComponent
     */
    public addNewEntry(): void {
        if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
            let getAdjustmentTypes = this.prepareAdjustmentTypes();

            this.receiptEntries[this.totalEntries] = {
                allowedTypes: getAdjustmentTypes,
                type: (getAdjustmentTypes && getAdjustmentTypes.length === 3) ? 'receipt' : 'againstReference',
                //note: '',
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
                    uniqueName: '',
                    type: ''
                },
                amount: 0
            }
            this.totalEntries++;
        }
    }

    /**
     * This will get called on enter/tab in adjustment amount field
     *
     * @param {KeyboardEvent} event
     * @param {*} entry
     * @memberof ReceiptEntryModalComponent
     */
    public validateAmount(event: KeyboardEvent, entry: any): void {
        if ((event.keyCode === 9 || event.keyCode === 13) && this.transaction && this.transaction.amount) {
            this.validateEntry(entry);
        }
    }

    /**
     * This will validate the adjustment entry
     *
     * @param {*} entry
     * @returns {*}
     * @memberof ReceiptEntryModalComponent
     */
    public validateEntry(entry: any): any {
        if (!entry.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.invalidAmountErrorMessage);
            this.isValidForm = false;
            return;
        } else if (isNaN(parseFloat(entry.amount)) || entry.amount <= 0) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.invalidAmountErrorMessage);
            this.isValidForm = false;
            return;
        }

        if (entry.type === "againstReference" && !entry.invoice.uniqueName) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.invoiceErrorMessage);
            this.isValidForm = false;
            return;
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
                    this.isValidForm = false;
                }
            } else {
                this.addNewEntry();
            }
        } else if (receiptTotal > this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
            this.isValidForm = false;
        } else {
            entry.amount = parseFloat(entry.amount);
            this.validateEntries(true);
        }
    }

    /**
     * This will output/emit the adjusments 
     *
     * @memberof ReceiptEntryModalComponent
     */
    public emitEntries(): void {
        let receiptTotal = 0;
        let isValid = true;

        this.receiptEntries.forEach(receipt => {
            if (parseFloat(receipt.amount) === 0 || isNaN(parseFloat(receipt.amount))) {
                isValid = false;
            } else {
                receiptTotal += parseFloat(receipt.amount);
            }
        });

        if (isValid) {
            if (receiptTotal < this.transaction.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.amountErrorMessage);
                this.isValidForm = false;
            } else if (receiptTotal > this.transaction.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.amountErrorMessage);
                this.isValidForm = false;
            } else {
                this.transaction.voucherAdjustments = this.receiptEntries;
                this.entriesList.emit(this.transaction);
            }
        } else {
            this.isValidForm = false;
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.invalidAmountErrorMessage);
        }
    }

    /**
     * This will get tax list
     *
     * @memberof ReceiptEntryModalComponent
     */
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

    /**
     * Releases the memory
     *
     * @memberof ReceiptEntryModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will get list of all pending invoices
     *
     * @memberof ReceiptEntryModalComponent
     */
    public getInvoiceListForReceiptVoucher(): void {
        this.salesService.getInvoiceListForReceiptVoucher(moment(this.voucherDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT), this.pendingInvoicesListParams).subscribe(response => {
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

    /**
     * Callback for select tax in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof ReceiptEntryModalComponent
     */
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

    /**
     * Callback for select invoice in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof ReceiptEntryModalComponent
     */
    public onSelectInvoice(event: any, entry: any): void {
        if (event && event.value) {
            entry.invoice = {
                number: this.pendingInvoiceList[event.value].voucherNumber,
                date: this.pendingInvoiceList[event.value].voucherDate,
                amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " cr.",
                uniqueName: event.value,
                type: this.pendingInvoiceList[event.value].voucherType
            };
        } else {
            entry.invoice = {
                number: '',
                date: '',
                amount: 0,
                uniqueName: '',
                type: ''
            };
        }

        this.validateEntries(false);
    }

    /**
     * This will remove the adjustment entry
     *
     * @param {number} index
     * @memberof ReceiptEntryModalComponent
     */
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
        this.updateAdjustmentTypes();
        this.validateEntries(false);
    }

    /**
     * This will close the popup and will emit the entries
     *
     * @memberof ReceiptEntryModalComponent
     */
    public closePopup(): void {
        this.entriesList.emit(this.transaction);
    }

    /**
     * This will validate all the adjustment entries
     *
     * @memberof ReceiptEntryModalComponent
     */
    public validateEntries(showErrorMessage: boolean): void {
        let receiptTotal = 0;
        let isValid = true;
        let invoiceRequired = false;

        this.receiptEntries.forEach(receipt => {
            if (parseFloat(receipt.amount) === 0 || isNaN(parseFloat(receipt.amount))) {
                isValid = false;
            } else {
                receiptTotal += parseFloat(receipt.amount);
            }

            if (receipt.type === "againstReference" && !receipt.invoice.uniqueName) {
                isValid = false;
                invoiceRequired = true;
            }
        });

        if (isValid) {
            if (invoiceRequired) {
                this.isValidForm = false;

                if (showErrorMessage) {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(this.invoiceErrorMessage);
                }
            } else {
                if (receiptTotal !== this.transaction.amount) {
                    this.isValidForm = false;
                } else {
                    this.isValidForm = true;
                }
            }
        } else {
            this.isValidForm = false;

            if (showErrorMessage) {
                this.toaster.clearAllToaster();

                if (invoiceRequired) {
                    this.toaster.errorToast(this.invoiceErrorMessage);
                } else {
                    this.toaster.errorToast(this.invalidAmountErrorMessage);
                }
            }
        }
    }

    /**
     * This will format the amount
     *
     * @param {*} entry
     * @memberof ReceiptEntryModalComponent
     */
    public formatAmount(entry: any): void {
        entry.amount = Number(entry.amount);
    }

    /**
     * This will prepare the list of adjusment types
     *
     * @returns {IOption[]}
     * @memberof ReceiptEntryModalComponent
     */
    public prepareAdjustmentTypes(entry?: any): IOption[] {
        let receiptExists = false;
        let advanceReceiptExists = false;
        this.receiptEntries.forEach(receipt => {
            if (receipt.type === "receipt") {
                receiptExists = true;
            } else if (receipt.type === "advanceReceipt") {
                advanceReceiptExists = true;
            }
        });

        let adjustmentTypesOptions: IOption[] = [];

        adjustmentTypes.map(type => {
            if (((type.value === "receipt" || type.value === "advanceReceipt") && (!(receiptExists || advanceReceiptExists) || (entry && (entry.type === "receipt" || entry.type === "advanceReceipt")))) || type.value === "againstReference" || (entry && entry.type === type.value)) {
                adjustmentTypesOptions.push({ label: type.label, value: type.value });
            }
        });

        return adjustmentTypesOptions;
    }

    /**
     * This will initiate update of adjustment types of all adjustments
     *
     * @memberof ReceiptEntryModalComponent
     */
    public updateAdjustmentTypes(): void {
        this.receiptEntries.forEach(entry => {
            entry.allowedTypes = this.prepareAdjustmentTypes(entry);
        });
    }
}