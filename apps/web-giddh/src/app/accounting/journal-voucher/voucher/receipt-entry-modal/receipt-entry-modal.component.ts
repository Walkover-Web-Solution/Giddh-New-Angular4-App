import { Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
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

    @ViewChild('referenceType') public referenceType: ShSelectComponent;

    public receiptEntries: any[] = [];
    public modalRef: BsModalRef;
    public pendingInvoiceList: any[] = [];
    public pendingInvoiceListSource$: Observable<IOption[]> = observableOf([]);
    public adjustmentTypes: IOption[] = [];
    public totalEntries: number = 0;
    public isValidForm: boolean = false;
    public amountErrorMessage: string = "Amount can't be greater than Credit Amount.";
    public invoiceAmountErrorMessage: string = "Amount can't be greater than Invoice Balance Due.";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public taxList: any[] = [];
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    public pendingInvoicesList: any[] = [];
    public pendingInvoicesListParams: any = {
        accountUniqueNames: [],
        voucherType: "receipt"
    };

    constructor(private toaster: ToasterService, private store: Store<AppState>, private salesService: SalesService, private companyActions: CompanyActions) {

    }

    public ngOnInit(): void {
        adjustmentTypes.map(c => {
            this.adjustmentTypes.push({ label: c.label, value: c.value });
        });

        if (this.transaction && this.transaction.selectedAccount) {
            this.pendingInvoicesListParams.accountUniqueNames.push(this.transaction.selectedAccount.UniqueName);
            this.getInvoiceListForReceiptVoucher();
        }

        this.getTaxList();
        this.addNewEntry();
    }

    public addNewEntry(): void {
        if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && Number(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
            this.receiptEntries[this.totalEntries] = {
                type: '',
                note: '',
                tax: {
                    name: '',
                    uniqueName: '',
                    percent: 0,
                    value: 0
                },
                invoiceNo: '',
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
        if (entry.amount && !isNaN(Number(entry.amount)) && entry.tax.percent) {
            entry.tax.value = Number(entry.amount) / entry.tax.percent;
        } else {
            entry.tax.value = 0;
        }

        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += Number(receipt.amount);
        });

        if (receiptTotal < this.transaction.amount) {
            if (entry.type === "againstReference") {
                let invoiceBalanceDue = Number(this.pendingInvoiceList[entry.invoiceNo].balanceDue.amountForAccount);
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
            this.isValidForm = true;
        }
    }

    public emitEntries(): void {
        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += Number(receipt.amount);
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
                    taxList.push({ label: res.taxes[key].name, value: res.taxes[key].taxType });

                    this.taxList[res.taxes[key].taxType] = [];
                    this.taxList[res.taxes[key].taxType] = res.taxes[key];
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
            if (response && response.status === "success" && response.body && response.body.length > 0) {
                let pendingInvoiceList: IOption[] = [];

                Object.keys(response.body).forEach(key => {
                    this.pendingInvoiceList[response.body[key].invoiceUniqueName] = [];
                    this.pendingInvoiceList[response.body[key].invoiceUniqueName] = response.body[key];

                    pendingInvoiceList.push({ label: response.body[key].invoiceNumber + ", " + response.body[key].invoiceDate + ", " + response.body[key].balanceDue.amountForAccount + " cr.", value: response.body[key].invoiceUniqueName });
                });
                this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);
            }
        });
    }

    public onSelectTax(event: any, entry: any): void {
        entry.tax.name = this.taxList[event.value].name;
        entry.tax.percent = this.taxList[event.value].taxDetail[0].taxValue;

        if (entry.amount && !isNaN(Number(entry.amount)) && entry.tax.percent) {
            entry.tax.value = Number(entry.amount) / entry.tax.percent;
        } else {
            entry.tax.value = 0;
        }
    }
}