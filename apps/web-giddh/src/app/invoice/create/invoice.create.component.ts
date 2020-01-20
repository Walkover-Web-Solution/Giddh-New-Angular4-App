import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { GenerateInvoiceRequestClass, GstEntry, ICommonItemOfTransaction, IContentCommon, IInvoiceTax, IInvoiceTransaction, InvoiceTemplateDetailsResponse, ISection } from '../../models/api-models/Invoice';
import { InvoiceService } from '../../services/invoice.service';
import { ToasterService } from '../../services/toaster.service';
import { OtherSalesItemClass, SalesEntryClass, SalesTransactionItemClass } from '../../models/api-models/Sales';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { SelectComponent } from '../../theme/ng-select/ng-select';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerActions } from 'apps/web-giddh/src/app/actions/ledger/ledger.actions';
import { ReciptRequest } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { StatesRequest, TaxResponse } from '../../models/api-models/Company';
import { DiscountListComponent } from '../../sales/discount-list/discountList.component';

let THEAD_ARR_READONLY = [
    {
        display: true,
        label: '#'
    },

    {
        display: true,
        label: 'Product/Service  Description '
    },

    {
        display: true,
        label: 'Qty/Unit'
    },
    {
        display: true,
        label: 'Rate'
    },
    {
        display: true,
        label: 'Amount'
    },
    {
        display: true,
        label: 'Discount'
    },

    {
        display: true,
        label: 'Tax'
    },
    {
        display: true,
        label: 'Total'
    }
];

@Component({
    styleUrls: ['../../sales/create/sales.invoice.component.scss'],
    selector: 'invoice-create',
    templateUrl: './invoice.create.component.html'
})

export class InvoiceCreateComponent implements OnInit, OnDestroy {
    @Input() public showCloseButton: boolean;
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();
    @Input() public isGenerateInvoice: boolean = true;
    public invFormData: any; // PreviewInvoiceResponseClass
    public tableCond: ISection;
    public headerCond: ISection;
    public templateHeader: any = {};
    public invTempCond: InvoiceTemplateDetailsResponse;
    // public customThead: IContent[] = THEAD;
    public updtFlag: boolean = false;
    public totalBalance: number = null;
    public invoiceDataFound: boolean = false;
    public isInvoiceGenerated$: Observable<boolean>;
    public updateMode: boolean;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public autoFillShipping: boolean = true;
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public maxDueDate: Date;
    public selectedVoucher: string = 'invoice';
    public theadArrReadOnly: IContentCommon[] = THEAD_ARR_READONLY;
    public tthead: IContentCommon[] = [];
    public activeGroupUniqueName$: Observable<string>;
    public companyTaxesList$: Observable<TaxResponse[]>;
    public activeIndx: number;
    public moment = moment;
    public selectedTaxes: string[] = [];
    public dueAmount: number = 0;
    public isOthrDtlCollapsed: boolean = false;
    public totalTax: number = 0;
    public tx_discount: number = 0;
    public tx_total: number = 0;
    public states: any[] = [];

    @ViewChild('discountComponent') public discountComponent: DiscountListComponent;
    // public methods above
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _toasty: ToasterService,
        private invoiceService: InvoiceService,
        private salesService: SalesService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _ledgerActions: LedgerActions,
        private receiptActions: InvoiceReceiptActions
    ) {
        this.isInvoiceGenerated$ = this.store.select(state => state.invoice.isInvoiceGenerated).pipe(takeUntil(this.destroyed$), distinctUntilChanged());
    }

    public ngOnInit() {

        this._activatedRoute.params.subscribe(a => {
            if (a) {
                this.selectedVoucher = a.voucherType;
            }
        });

        this.store.select(p => p.company.taxes).pipe(takeUntil(this.destroyed$)).subscribe((o: TaxResponse[]) => {
            if (o) {
                this.companyTaxesList$ = observableOf(o);
                _.map(this.theadArrReadOnly, (item: IContentCommon) => {
                    // show tax label
                    if (item.label === 'Tax') {
                        item.display = true;
                    }
                    return item;
                });
            } else {
                this.companyTaxesList$ = observableOf([]);
            }
        });
        this.theadArrReadOnly.forEach(ele => {

            this.tthead.push(ele);
        });
        this.store.select(p => p.receipt.voucher).pipe(
            takeUntil(this.destroyed$),
            distinctUntilChanged())
            .subscribe((o: any) => {
                if (o && o.voucherDetails) {
                    this.invFormData = _.cloneDeep(o);

                    if (this.invFormData.entries && this.invFormData.entries.length > 0) {
                        for (let loop = 0; loop < this.invFormData.entries.length; loop++) {
                            if (this.invFormData.entries[loop].entryDate) {
                                this.invFormData.entries[loop].entryDate = this.invFormData.entries[loop].entryDate.split("-").reverse().join("-");
                            }
                        }
                    }

                    if (o.voucherDetails.voucherDate) {
                        let d = o.voucherDetails.voucherDate.split('-');
                        if (d.length === 3) {
                            this.invFormData.voucherDetails.voucherDate = new Date(d[2], d[1] - 1, d[0]);
                        } else {
                            this.invFormData.voucherDetails.voucherDate = '';
                        }
                        if (this.invFormData.voucherDetails.invoiceNumber === '##########') {
                            this.invFormData.voucherDetails.invoiceNumber = null;
                        }
                    }
                    if (o.voucherDetails.dueDate) {
                        let d = o.voucherDetails.dueDate.split('-');
                        if (d.length === 3) {
                            this.invFormData.voucherDetails.dueDate = new Date(d[2], d[1] - 1, d[0]);
                        } else {
                            this.invFormData.voucherDetails.dueDate = '';
                        }
                    }
                    // if address found prepare local var due to array and string issue
                    this.prepareAddressForUI('billingDetails');
                    this.prepareAddressForUI('shippingDetails');
                    if (!this.invFormData.other) {
                        this.invFormData.other = new OtherSalesItemClass();
                    }

                    // replace br to /n in case of message
                    // if (this.invFormData.other.message2 && this.invFormData.other.message2.length > 0) {
                    //   this.invFormData.other.message2 = this.invFormData.other.message2.replace(/<br \/>/g, '\n');
                    // }
                    this.setMaxDueDate(this.invFormData.entries);
                    this.invoiceDataFound = true;
                } else {
                    this.invoiceDataFound = false;
                }
            }
            );

        this.store.select(p => p.invoice.invoiceTemplateConditions).pipe(
            takeUntil(this.destroyed$),
            distinctUntilChanged())
            .subscribe((o: InvoiceTemplateDetailsResponse) => {
                if (o) {
                    this.invTempCond = _.cloneDeep(o);
                    let obj = _.cloneDeep(o);
                    // this.tableCond = _.find(obj.sections, {sectionName: 'table'});
                    // this.headerCond = _.find(obj.sections, {sectionName: 'header'});
                    this.tableCond = obj.sections;
                    this.headerCond = obj.sections;
                    this.prepareThead();
                    this.prepareTemplateHeader();
                }
            }
            );

        this.isInvoiceGenerated$.subscribe((o) => {
            if (o) {
                let action = (this.updateMode) ? 'update' : 'generate';
                this.closePopupEvent({ action });
            }
        });

        this.store.select(state => state.invoice.visitedFromPreview).pipe(
            takeUntil(this.destroyed$),
            distinctUntilChanged())
            .subscribe((val: boolean) => {
                this.updateMode = val;
            }
            );

        // bind state sources
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                });
                this.statesSource$ = observableOf(this.states);
            }
        });
    }

    public getArrayFromString(str) {
        if (str && str.length > 0) {
            return str.split('\n');
        } else {
            return [];
        }
    }

    public getStringFromArr(arr) {
        if (Array.isArray(arr) && arr.length > 0) {
            return arr.toString().replace(RegExp(',', 'g'), '\n');
        } else {
            return null;
        }
    }

    public prepareAddressForUI(type: string) {
        this.invFormData.accountDetails[type].address = this.getStringFromArr(this.invFormData.accountDetails[type].address);
    }

    public prepareAddressForAPI(type: string) {
        this.invFormData.accountDetails[type].address = this.getArrayFromString(this.invFormData.accountDetails[type].address);
    }

    public prepareTemplateHeader() {
        this.templateHeader = _.cloneDeep(this.headerCond.header.data);
        // let obj = _.cloneDeep(this.headerCond.header.data);
        // let dummyObj = {};
        // _.forEach(obj, (item: IContent) => {
        //   dummyObj[item.field] = item;
        // });
        // // sorting object
        // Object.keys(dummyObj).sort().forEach((key) => {
        //   this.templateHeader[key] = dummyObj[key];
        // });
    }

    public selectedTaxEvent(arr: string[]) {
        let entry: SalesEntryClass = this.invFormData.entries[this.activeIndx];
        if (!entry) {
            return;
        }
        this.selectedTaxes = arr;
        entry.taxList = arr;
        entry.taxes = [];
        // if (this.selectedTaxes.length > 0) {
        //   this.companyTaxesList$.pipe(take(1)).subscribe(data => {
        //     data.map((item: any) => {
        //       if (_.indexOf(arr, item.uniqueName) !== -1 && item.accounts.length > 0) {
        //         let o: IInvoiceTax = {
        //           accountName: item.accounts[0].name,
        //           accountUniqueName: item.accounts[0].uniqueName,
        //           rate: item.taxDetail[0].taxValue,
        //           amount: item.taxDetail[0].taxValue,
        //           uniqueName: item.uniqueName
        //         };
        //         entry.taxes.push(o);
        //         // entry.taxSum += o.amount;
        //       }
        //     });
        //   });
        // }
    }

    public selectedDiscountEvent(txn: SalesTransactionItemClass, entry: SalesEntryClass) {

        // call taxableValue method
        txn.setAmount(entry);
        this.txnChangeOccurred();
        // entry.discountSum = _.sumBy(entry.discounts, (o) => {
        //   return o.amount;
        // });
    }

    public generateTotalAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        _.forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.quantity && txn.rate) {
                res += this.checkForInfinity(txn.rate) * this.checkForInfinity(txn.quantity);
            } else {
                res += Number(this.checkForInfinity(txn.amount));
            }
        });
        return res;
    }

    public txnChangeOccurred(disc?: DiscountListComponent) {
        if (disc) {
            disc.change();
        }
        let DISCOUNT: number = 0;
        let TAX: number = 0;
        let AMOUNT: number = 0;
        let TAXABLE_VALUE: number = 0;
        let GRAND_TOTAL: number = 0;
        setTimeout(() => {
            _.forEach(this.invFormData.entries, (entry) => {
                // get discount
                DISCOUNT += Number(entry.discountSum);

                // get total amount of entries
                AMOUNT += Number(this.generateTotalAmount(entry.transactions));

                // get taxable value
                TAXABLE_VALUE += Number(this.generateTotalTaxableValue(entry.transactions));

                // generate total tax amount
                TAX += Number(this.generateTotalTaxAmount(entry.transactions));

                // generate Grand Total
                GRAND_TOTAL += Number(this.generateGrandTotal(entry.transactions));
            });

            this.invFormData.voucherDetails.subTotal = Number(AMOUNT);
            this.invFormData.voucherDetails.totalDiscount = Number(DISCOUNT);
            this.invFormData.voucherDetails.totalTaxableValue = Number(TAXABLE_VALUE);
            this.invFormData.voucherDetails.gstTaxesTotal = Number(TAX);
            this.invFormData.voucherDetails.grandTotal = Number(GRAND_TOTAL);

            // due amount
            this.invFormData.voucherDetails.balanceDue = Number(GRAND_TOTAL);
            if (this.dueAmount) {
                this.invFormData.voucherDetails.balanceDue = Number(GRAND_TOTAL) - Number(this.dueAmount);
            }

        }, 700);
    }

    /**
     * checkForInfinity
     * @returns {number} always
     */
    public checkForInfinity(value): number {
        return (value === Infinity) ? 0 : value;
    }

    /**
     * generate total taxable value
     * @returns {number}
     */
    public generateTotalTaxableValue(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        _.forEach(txns, (txn: SalesTransactionItemClass) => {
            res += this.checkForInfinity(txn.taxableValue);
        });
        return res;
    }

    /**
     * generate total tax amount
     * @returns {number}
     */
    public generateTotalTaxAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        _.forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.total === 0) {
                res += 0;
            } else {
                res += this.checkForInfinity((txn.total - txn.taxableValue));
            }
        });
        return res;
    }

    /**
     * generate grand total
     * @returns {number}
     */
    public generateGrandTotal(txns: SalesTransactionItemClass[]) {
        return txns.reduce((pv, cv) => {
            return cv.total ? pv + cv.total : pv;
        }, 0);
    }

    public prepareThead() {
        this.theadArrReadOnly = _.cloneDeep(this.tableCond.table.data);
        // let obj = _.cloneDeep(this.tableCond.table.data);
        // _.map(this.customThead, (item: IContent) => {
        //   let res = _.find(this.tableCond.table.data, {field: item.field});
        //   if (res) {
        //     item.display = res.display;
        //     item.label = res.label;
        //   }
        // });
    }

    public setActiveIndxs(indx: number) {
        this.activeIndx = indx;
    }

    public closeDiscountPopup() {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    }

    public setUpdateAccFlag() {
        this.updtFlag = true;
        this.onSubmitInvoiceForm();
    }

    public convertDateForAPI(val: any): string {
        if (val) {
            try {
                return moment(val).format(GIDDH_DATE_FORMAT);
            } catch (error) {
                return '';
            }
        } else {
            return '';
        }
    }

    public onSubmitInvoiceForm() {
        let model: GenerateInvoiceRequestClass = new GenerateInvoiceRequestClass();
        let data: any = _.cloneDeep(this.invFormData);

        // replace /n to br in case of message
        // if (data.other.message2 && data.other.message2.length > 0) {
        //   data.other.message2 = data.other.message2.replace(/\n/g, '<br />');
        // }

        // convert address string to array
        data.accountDetails['billingDetails'].address = this.getArrayFromString(data.accountDetails['billingDetails'].address);
        data.accountDetails['shippingDetails'].address = this.getArrayFromString(data.accountDetails['shippingDetails'].address);

        // convert date object
        data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        let accountUniqueName = this.invFormData.accountDetails.uniqueName;
        if (accountUniqueName) {

            model.voucher = data;
            model.voucher.entries = model.voucher.entries.map((entry) => {
                entry.voucherType = this.selectedVoucher;
                return entry;
            });

            model.voucher.voucherDetails.voucherType = this.selectedVoucher;

            model.uniqueNames = this.getEntryUniqueNames(this.invFormData.entries);
            model.validateTax = true;
            model.updateAccountDetails = this.updtFlag;

            if (this.updateMode) {
                let request: ReciptRequest = {
                    voucher: model.voucher,
                    entryUniqueNames: model.uniqueNames,
                    updateAccountDetails: true
                };
                this.store.dispatch(this.receiptActions.UpdateInvoiceReceiptRequest(request, model.voucher.accountDetails.uniqueName));
            } else {
                this.store.dispatch(this._ledgerActions.GenerateBulkLedgerInvoice({ combined: false }, [{ accountUniqueName: model.voucher.accountDetails.uniqueName, entries: _.cloneDeep(model.uniqueNames) }], 'invoice'));
            }
            this.updtFlag = false;
        } else {
            this._toasty.warningToast('Something went wrong, please reload the page');
        }
    }

    public getEntryUniqueNames(entryArr: GstEntry[]): string[] {
        let arr: string[] = [];
        _.forEach(entryArr, (item: GstEntry) => {
            arr.push(item.uniqueName);
        });
        return arr;
    }

    public getTransactionTotalTax(taxArr: IInvoiceTax[]): any {
        let count: number = 0;
        if (taxArr.length > 0) {
            _.forEach(taxArr, (item: IInvoiceTax) => {
                count += item.amount;
            });
        }
        if (count > 0) {
            this.totalTax = count;
            return count;
        } else {
            return null;
        }
    }

    public getEntryTotal(entry: GstEntry, idx: number): any {
        let count: number = 0;
        count = this.getEntryTaxableAmount(entry.transactions[idx], entry.discounts) + this.getTransactionTotalTax(entry.taxes);
        if (count > 0) {
            this.tx_total = count;
            return count;
        } else {
            return null;
        }
    }

    public getEntryTaxableAmount(transaction: IInvoiceTransaction, discountArr: ICommonItemOfTransaction[]): any {
        let count: number = 0;
        if (transaction.quantity && transaction.rate) {
            count = (transaction.rate * transaction.quantity) - this.getEntryTotalDiscount(discountArr);
        } else {
            count = transaction.amount - this.getEntryTotalDiscount(discountArr);
        }
        if (count > 0) {
            return count;
        } else {
            return null;
        }
    }

    public getEntryTotalDiscount(discountArr: ICommonItemOfTransaction[]): any {
        let count: number = 0;
        if (discountArr.length > 0) {
            _.forEach(discountArr, (item: ICommonItemOfTransaction) => {
                count += Math.abs(item.amount);
            });
        }
        if (count > 0) {
            this.tx_discount = count;
            return count;
        } else {
            return null;
        }
    }

    public closePopupEvent(o) {
        this.closeEvent.emit(o);
    }

    public getSerialNos(entryIndex: number, transIndex: number) {
        // logic
        return entryIndex + 1 + transIndex;
    }

    public autoFillShippingDetails() {
        // auto fill shipping address
        if (this.autoFillShipping) {
            this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
        }
    }

    public getStateCode(type: string, statesEle: SelectComponent) {
        let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
        if (gstVal && gstVal.length >= 2) {
            this.statesSource$.pipe(take(1)).subscribe(st => {
                let s = st.find(item => item.value === gstVal.substr(0, 2));
                if (s) {
                    this.invFormData.accountDetails[type].stateCode = s.value;
                } else {
                    this.invFormData.accountDetails[type].stateCode = null;
                    this._toasty.clearAllToaster();
                    this._toasty.warningToast('Invalid GSTIN.');
                }
                statesEle.disabled = true;
            });
        } else {
            statesEle.disabled = false;
            this.invFormData.accountDetails[type].stateCode = null;
        }
    }

    /**
     * setMaxDueDate
     */
    public setMaxDueDate(entries) {
        let maxDateEnrty = _.maxBy(entries, (o) => {
            if (o.entryDate) {
                return o.entryDate;
            }
        });
        if (maxDateEnrty && maxDateEnrty.entryDate) {
            this.maxDueDate = moment(maxDateEnrty.entryDate, 'DD-MM-YYYY').toDate();
        }
    }

    public goToLeger() {
        this._router.navigate(['pages', 'ledger', 'sales']);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
