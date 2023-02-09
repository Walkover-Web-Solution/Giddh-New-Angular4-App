import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChildren } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject, of as observableOf, Observable } from 'rxjs';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { adjustmentTypes, AdjustmentTypesEnum } from "../../../../shared/helpers/adjustmentTypes";
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { KEYS } from '../../journal-voucher.component';
import { VOUCHERS } from '../../../constants/accounting.constant';

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
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
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
    public isValidForm: boolean = true;
    /* Error message for amount comparision with transaction amount */
    public amountErrorMessage: string = "";
    /* Error message for comparision of adjusted amount with invoice */
    public invoiceAmountErrorMessage: string = "";
    /* Error message for invalid adjustment amount */
    public invalidAmountErrorMessage: string = "";
    /* Error message for invalid adjustment amount */
    public invoiceErrorMessage: string = "";
    /* Error message for amount comparision with transaction amount */
    public entryAmountErrorMessage: string = "";
    /* This will hold list of tax */
    public taxList: any[] = [];
    /* Observable for list of tax */
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    /* Object for pending invoices list search params */
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: VOUCHERS.RECEIPT
    };
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
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
        this.amountErrorMessage = this.localeData?.total_amount_error;
        this.invoiceAmountErrorMessage = this.localeData?.invoice_amount_error;
        this.invalidAmountErrorMessage = this.localeData?.invalid_amount_error;
        this.invoiceErrorMessage = this.localeData?.invoice_error;
        this.entryAmountErrorMessage = this.localeData?.entry_amount_error;

        if (this.transaction && this.transaction.selectedAccount) {
            if (this.transaction.voucherAdjustments) {
                this.receiptEntries = this.transaction.voucherAdjustments;
                this.totalEntries = this.receiptEntries?.length;
                this.validateEntries(false);
            } else {
                this.addNewEntry();
            }

            this.pendingInvoicesListParams.accountUniqueNames.push(this.transaction.selectedAccount?.UniqueName);
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
            let getAdjustmentTypes = this.prepareAdjustmentTypes(this.totalEntries);

            this.receiptEntries[this.totalEntries] = {
                allowedTypes: getAdjustmentTypes,
                type: (this.totalEntries > 0) ? AdjustmentTypesEnum.againstReference : AdjustmentTypesEnum.receipt,
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
                amount: (this.totalEntries === 0) ? this.transaction.amount : 0
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
        if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB) && this.transaction && this.transaction.amount) {
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

        if (entry.type === AdjustmentTypesEnum.receipt || entry.type === AdjustmentTypesEnum.advanceReceipt) {
            if (parseFloat(entry.amount) !== this.transaction.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.entryAmountErrorMessage);
                this.isValidForm = false;
                return;
            }
        }

        if (entry.type === AdjustmentTypesEnum.againstReference && !entry.invoice?.uniqueName) {
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
            if (receipt.type === AdjustmentTypesEnum.againstReference) {
                receiptTotal += parseFloat(receipt.amount);
            }
        });

        if (receiptTotal < this.transaction.amount) {
            if (entry.type === AdjustmentTypesEnum.againstReference) {
                let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice?.uniqueName].balanceDue.amountForAccount);
                if (invoiceBalanceDue >= entry.amount) {
                    this.addNewEntry();
                    this.validateEntries(false);
                } else if (invoiceBalanceDue < entry.amount) {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(this.invoiceAmountErrorMessage);
                    this.isValidForm = false;
                }
            } else {
                this.addNewEntry();
                this.validateEntries(false);
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
        this.validateEntries(true);

        if (this.isValidForm) {
            this.transaction.voucherAdjustments = this.receiptEntries;
            this.entriesList.emit(this.transaction);
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
                if (res.taxes) {
                    let taxList: IOption[] = [];
                    Object.keys(res.taxes).forEach(key => {
                        taxList.push({ label: res.taxes[key].name, value: res.taxes[key]?.uniqueName });

                        this.taxList[res.taxes[key]?.uniqueName] = [];
                        this.taxList[res.taxes[key]?.uniqueName] = res.taxes[key];
                    });
                    this.taxListSource$ = observableOf(taxList);
                }
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
        this.salesService.getInvoiceList(this.pendingInvoicesListParams, dayjs(this.voucherDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
                let pendingInvoiceList: IOption[] = [];

                Object.keys(response.body.results).forEach(key => {
                    this.pendingInvoiceList[response.body.results[key]?.uniqueName] = [];
                    this.pendingInvoiceList[response.body.results[key]?.uniqueName] = response.body.results[key];

                    pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr, value: response.body.results[key]?.uniqueName });
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
                amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr,
                uniqueName: event.value,
                type: this.pendingInvoiceList[event.value].voucherType
            };
            if (this.pendingInvoiceList[event.value].balanceDue.amountForAccount < entry.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.invoiceAmountErrorMessage);
            }
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
        let adjustmentTotal = 0;
        let isValid = true;
        let invoiceRequired = false;
        let invoiceAmountError = false;

        this.receiptEntries.forEach(receipt => {
            if (isValid) {
                if (parseFloat(receipt.amount) === 0 || isNaN(parseFloat(receipt.amount))) {
                    isValid = false;
                } else {
                    if (receipt.type === AdjustmentTypesEnum.againstReference) {
                        adjustmentTotal += parseFloat(receipt.amount);
                    } else {
                        receiptTotal += parseFloat(receipt.amount);
                    }
                }

                if (isValid && receipt.type === AdjustmentTypesEnum.againstReference && !receipt.invoice?.uniqueName) {
                    isValid = false;
                    invoiceRequired = true;
                } else if (isValid && receipt.type === AdjustmentTypesEnum.againstReference && receipt.invoice?.uniqueName && parseFloat(receipt.invoice.amount) < parseFloat(receipt.amount)) {
                    isValid = false;
                    invoiceAmountError = true;
                }
            }
        });

        if (isValid) {
            if (receiptTotal != this.transaction.amount || adjustmentTotal > this.transaction.amount) {
                this.isValidForm = false;

                if (showErrorMessage) {
                    this.toaster.errorToast(this.amountErrorMessage);
                }
            } else {
                this.isValidForm = true;
            }
        } else {
            this.isValidForm = false;

            if (showErrorMessage) {
                this.toaster.clearAllToaster();

                if (invoiceRequired) {
                    this.toaster.errorToast(this.invoiceErrorMessage);
                } else if (invoiceAmountError) {
                    this.toaster.errorToast(this.invoiceAmountErrorMessage);
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
     * @param {any} entry
     * @returns {IOption[]}
     * @memberof ReceiptEntryModalComponent
     */
    public prepareAdjustmentTypes(index: number, entry?: any): IOption[] {
        let adjustmentTypesOptions: IOption[] = [];

        adjustmentTypes.map(type => {
            if ((index === 0 && (type?.value === AdjustmentTypesEnum.receipt || type?.value === AdjustmentTypesEnum.advanceReceipt)) || (index > 0 && type?.value === AdjustmentTypesEnum.againstReference) || (entry && type?.value === entry.type)) {
                adjustmentTypesOptions.push({ label: type.label, value: type?.value });
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
        if (this.receiptEntries && this.receiptEntries.length > 0) {
            let loop = 0;
            this.receiptEntries.forEach(entry => {
                entry.allowedTypes = this.prepareAdjustmentTypes(loop, entry);
                loop++;
            });
        }
    }

    /**
     * Callback for select type in adjustment
     *
     * @param {*} event
     * @param {*} entry
     * @memberof ReceiptEntryModalComponent
     */
    public onSelectAdjustmentType(event: any, entry: any): void {
        if (event && event.value === AdjustmentTypesEnum.receipt) {
            entry.tax = {
                name: '',
                uniqueName: '',
                percent: 0,
                value: 0
            };
            this.forceClear$ = observableOf({ status: true });
        }
    }
}
