import { takeUntil } from 'rxjs/operators';
import { TallyModuleService } from './tally-service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { SidebarAction } from '../actions/inventory/sidebar.actions';

export const PAGE_SHORTCUT_MAPPING = [
    {
        keyCode: 118, // 'F7',
        inputForFn: {
            page: 'Journal',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120, // 'F9',
        inputForFn: {
            page: 'Purchase',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119, // 'F8',
        inputForFn: {
            page: 'Sales',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120, // 'F9',
        altKey: true,
        inputForFn: {
            page: 'Debit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119, // 'F8',
        altKey: true,
        inputForFn: {
            page: 'Credit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 116, // 'F5',
        inputForFn: {
            page: 'Payment',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 117, // 'F6',
        inputForFn: {
            page: 'Receipt',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 115, // 'F4',
        inputForFn: {
            page: 'Contra',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    }
];

export const PAGES_WITH_CHILD = ['Purchase', 'Sales', 'Credit note', 'Debit note'];

@Component({
    templateUrl: './accounting.component.html',
    styleUrls: ['./accounting.component.scss']
})

export class AccountingComponent implements OnInit, OnDestroy {

    public gridType: string = 'voucher';
    public selectedPage: string = 'journal';
    public flattenAccounts: any = [];
    public openDatePicker: boolean = false;
    public openCreateAccountPopupInVoucher: boolean = false;
    public openCreateAccountPopupInInvoice: boolean = false;
    public saveEntryInVoucher: boolean = false;
    public saveEntryInInvoice: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private _tallyModuleService: TallyModuleService,
        private sidebarAction: SidebarAction) {
        this._tallyModuleService.selectedPageInfo.pipe(takeUntil(this.destroyed$)).subscribe((d) => {
            if (d) {
                this.gridType = d.gridType;
                this.selectedPage = d.page;
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    public beforeunloadHandler(event: KeyboardEvent) {
        return (event.which || event.keyCode) !== 116;
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.which === 65) { // Ctrl + A
            event.preventDefault();
            event.stopPropagation();
            if (this.gridType === 'voucher') {
                this.saveEntryInVoucher = true;
                this.saveEntryInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = true;
            }
            setTimeout(() => {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = false;
            }, 100);
        } else if (event.altKey && event.which === 86) { // Handling Alt + V and Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo?.value;
            if (PAGES_WITH_CHILD?.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage?.uniqueName,
                    gridType: 'voucher'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 73) { // Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo?.value;
            if (PAGES_WITH_CHILD?.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage?.uniqueName,
                    gridType: 'invoice'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 67) { // Alt + C
            if (this.gridType === 'voucher') {
                this.openCreateAccountPopupInVoucher = true;
                this.openCreateAccountPopupInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = true;
            }
            setTimeout(() => {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = false;
            }, 100);
        } else {
            let selectedPageIndx = PAGE_SHORTCUT_MAPPING.findIndex((page: any) => {
                if (event.altKey) {
                    return page.keyCode === event.which && page.altKey;
                } else {
                    return page.keyCode === event.which;
                }
            });
            if (selectedPageIndx > -1) {
                this._tallyModuleService.setVoucher(PAGE_SHORTCUT_MAPPING[selectedPageIndx].inputForFn);
            } else if (event.which === 113) { // F2
                this.openDatePicker = !this.openDatePicker;
            }
        }
    }

    public ngOnInit(): void {
        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}


/** y functions voucher.componen k hai
    * This will add new row for adjusment
    *
    * @memberof AccountAsVoucherComponent
    */
// public addNewAdjustmentEntry(): void {
//     if (this.totalEntries === 0 || (this.receiptEntries[this.totalEntries - 1] && this.receiptEntries[this.totalEntries - 1] !== undefined && parseFloat(this.receiptEntries[this.totalEntries - 1].amount) > 0)) {
//         let getAdjustmentTypes = this.prepareAdjustmentTypes(this.totalEntries);

//         this.receiptEntries[this.totalEntries] = {
//             allowedTypes: getAdjustmentTypes,
//             type: (this.advanceReceiptExists) ? AdjustmentTypesEnum.advanceReceipt : AdjustmentTypesEnum.receipt,
//             //note: '',
//             tax: {
//                 name: '',
//                 uniqueName: '',
//                 percent: 0,
//                 value: 0
//             },
//             invoice: {
//                 number: '',
//                 date: '',
//                 amount: 0,
//                 uniqueName: '',
//                 type: ''
//             },
//             amount: 0
//         }
//         this.totalEntries++;
//     }
// }

/**
 * This will get called on enter/tab in adjustment amount field
 *
 * @param {KeyboardEvent} event
 * @param {*} entry
 * @memberof AccountAsVoucherComponent
 */
// public validateAmount(event: KeyboardEvent, entry: any): void {
//     if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB) && this.adjustmentTransaction && this.adjustmentTransaction.amount) {
//         this.validateEntry(entry);
//     }
// }

/**
 * This will validate the adjustment entry
 *
 * @param {*} entry
 * @returns {*}
 * @memberof AccountAsVoucherComponent
 */
// public validateEntry(entry: any): any {
//     if (!entry.amount) {
//         this._toaster.clearAllToaster();
//         this._toaster.errorToast(this.invalidAmountErrorMessage);
//         this.isValidForm = false;
//         return;
//     } else if (isNaN(parseFloat(entry.amount)) || entry.amount <= 0) {
//         this._toaster.clearAllToaster();
//         this._toaster.errorToast(this.invalidAmountErrorMessage);
//         this.isValidForm = false;
//         return;
//     }

//     if (entry.type === AdjustmentTypesEnum.receipt || entry.type === AdjustmentTypesEnum.advanceReceipt) {
//         if (parseFloat(entry.amount) !== this.adjustmentTransaction.amount) {
//             this._toaster.clearAllToaster();
//             this._toaster.errorToast(this.entryAmountErrorMessage);
//             this.isValidForm = false;
//             return;
//         }
//     }

//     if (entry.type === AdjustmentTypesEnum.againstReference && !entry.invoice?.uniqueName) {
//         this._toaster.clearAllToaster();
//         this._toaster.errorToast(this.invoiceErrorMessage);
//         this.isValidForm = false;
//         return;
//     }

//     if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
//         entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
//     } else {
//         entry.tax.value = 0;
//     }

//     let receiptTotal = 0;

//     this.receiptEntries.forEach(receipt => {
//         if (receipt.type === AdjustmentTypesEnum.againstReference) {
//             receiptTotal += parseFloat(receipt.amount);
//         }
//     });

//     if (receiptTotal < this.adjustmentTransaction.amount) {
//         if (entry.type === AdjustmentTypesEnum.againstReference) {
//             let invoiceBalanceDue = parseFloat(this.pendingInvoiceList[entry.invoice?.uniqueName].balanceDue.amountForAccount);
//             if (invoiceBalanceDue >= entry.amount) {
//                 this.addNewAdjustmentEntry();
//                 this.validateEntries(false);
//             } else if (invoiceBalanceDue < entry.amount) {
//                 this._toaster.clearAllToaster();
//                 this._toaster.errorToast(this.invoiceAmountErrorMessage);
//                 this.isValidForm = false;
//             }
//         } else {
//             this.addNewAdjustmentEntry();
//             this.validateEntries(false);
//         }
//     } else if (receiptTotal > this.adjustmentTransaction.amount) {
//         this._toaster.clearAllToaster();
//         this._toaster.errorToast(this.amountErrorMessage);
//         this.isValidForm = false;
//     } else {
//         entry.amount = parseFloat(entry.amount);
//         this.validateEntries(true);
//     }
// }

/**
 * This will open the adjustment popup if voucher is receipt and transaction is To/Cr
 *
 * @param {KeyboardEvent} event
 * @param {*} transaction
 * @param {TemplateRef<any>} template
 * @memberof AccountAsVoucherComponent
 */
// public openAdjustmentModal(event: KeyboardEvent, transaction: any, template: TemplateRef<any>): void {
//     if (event && (event.key === KEYS.ENTER || event.key === KEYS.TAB)) {
//         this.validateAndOpenAdjustmentPopup(transaction, template);
//     }
// }

/**
 * This will format the amount
 *
 * @param {*} entry
 * @memberof AccountAsVoucherComponent
 */
// public formatAmount(entry: any): void {
//     entry.amount = Number(entry.amount);
// }

/**
 * This will prepare the list of adjusment types
 *
 * @returns {IOption[]}
 * @memberof AccountAsVoucherComponent
 */
// public prepareAdjustmentTypes(index: number, entry?: any): IOption[] {
//     let adjustmentTypesOptions: IOption[] = [];

//     adjustmentTypes.map(type => {
//         if ((index === 0 && (type?.value === AdjustmentTypesEnum.receipt || type?.value === AdjustmentTypesEnum.advanceReceipt)) || (index > 0 && type?.value === AdjustmentTypesEnum.againstReference) || (entry && type?.value === entry.type)) {
//             adjustmentTypesOptions.push({ label: type.label, value: type?.value });
//         }
//     });

//     return adjustmentTypesOptions;
// }

/**
 * This will initiate update of adjustment types of all adjustments
 *
 * @param {string} action
 * @memberof AccountAsVoucherComponent
 */
// public updateAdjustmentTypes(action: string): void {
//     if (this.receiptEntries && this.receiptEntries.length > 0) {
//         let loop = 0;
//         this.receiptEntries.forEach(entry => {
//             entry.allowedTypes = this.prepareAdjustmentTypes(loop, action);
//             loop++;
//         });
//     }
// }

/**
 * Callback for select type in adjustment
 *
 * @param {*} event
 * @param {*} entry
 * @memberof AccountAsVoucherComponent
 */
// public onSelectAdjustmentType(event: any, entry: any): void {
//     if (event && event?.value === AdjustmentTypesEnum.receipt) {
//         entry.tax = {
//             name: '',
//             uniqueName: '',
//             percent: 0,
//             value: 0
//         };
//         this.forceClear$ = observableOf({ status: true });
//     }
// }

/**
 * This will validate the transaction and adjustments and will open popup if required
 *
 * @param {*} transaction
 * @param {TemplateRef<any>} template
 * @memberof AccountAsVoucherComponent
 */
// public validateAndOpenAdjustmentPopup(transaction: any, template: TemplateRef<any>): void {
//     if (this.requestObj.voucherType === VOUCHERS.RECEIPT && transaction && transaction.type === "to" && !transaction.voucherAdjustments) {
//         if (transaction.amount && Number(transaction.amount) > 0) {
//             if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
//                 this.pendingInvoicesListParams.accountUniqueNames = [];
//                 this.pendingInvoicesListParams.accountUniqueNames.push(transaction.selectedAccount?.UniqueName);
//             }

//             this.getInvoiceListForReceiptVoucher();
//             this.currentTransaction = transaction;
//             this.modalRef = this.modalService.show(
//                 template,
//                 Object.assign({}, { class: 'modal-lg', ignoreBackdropClick: true })
//             );
//         }
//     }
// }

/**
* openStockList
*/
// public openStockList() {
//     this.showLedgerAccountList = false;
//     this.showStockList = true;
//     // this.showStockList.next(true);
// }

/**
 * onSelectStock
 */
// public onSelectStock(item) {
//     if (item) {
//         let idx = this.selectedStockIdx;
//         let entryItem = cloneDeep(item);
//         this.prepareEntry(entryItem, this.selectedIdx);
//         // setTimeout(() => {
//         //   this.selectedStk.focus();
//         //   this.showStockList = false;
//         // }, 50);
//     } else {
//         this.requestObj.transactions[this.selectedIdx].inventory.splice(this.selectedStockIdx, 1);
//     }
// }

/**
 * prepareEntry
 */
// public prepareEntry(item, idx) {
//     let i = this.selectedStockIdx;
//     if (item && item.stockUnit) {
//         let defaultUnit = {
//             stockUnitCode: item.stockUnit.name,
//             code: item.stockUnit.code,
//             rate: 0
//         };

//         // this.requestObj.transactions[idx].inventory[i].unit.rate = item.rate;

//         //Check if the Unit is initialized

//         if (this.requestObj.transactions[idx].inventory[i].unit) {
//             this.requestObj.transactions[idx].inventory[i].unit.rate = item.amount / item.openingQuantity; // Kunal
//             this.requestObj.transactions[idx].inventory[i].unit.code = item.stockUnit.code;
//             this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;
//         }

//         // this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
//         this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item?.uniqueName };
//         // this.requestObj.transactions[idx].selectedAccount?.uniqueName = item.accountStockDetails.accountUniqueName;
//         this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
//     }

// }

/**
 * changePrice
 */
// public changePrice(idx, val) {
//     let i = this.selectedIdx;
//     this.requestObj.transactions[i].inventory[idx].unit.rate = !Number.isNaN(val) ? Number(cloneDeep(val)) : 0;
//     this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
//     this.amountChanged(idx);
// }

// public amountChanged(invIdx) {
//     let i = this.selectedIdx;
//     if (this.requestObj.transactions && this.requestObj.transactions[i].inventory[invIdx].stock && this.requestObj.transactions[i].inventory[invIdx].quantity) {
//         this.requestObj.transactions[i].inventory[invIdx].unit.rate = Number((this.requestObj.transactions[i].inventory[invIdx].amount / this.requestObj.transactions[i].inventory[invIdx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
//     }
//     let total = this.calculateTransactionTotal(this.requestObj.transactions[i].inventory);
//     this.requestObj.transactions[i].total = total;
//     this.requestObj.transactions[i].amount = total;
// }

/**
 * calculateTransactionTotal
 */
// public calculateTransactionTotal(inventory) {
//     let total = 0;
//     inventory.forEach((inv) => {
//         total = total + Number(inv.amount);
//     });
//     return total;
// }

// public changeQuantity(idx, val) {
//     let i = this.selectedIdx;
//     this.requestObj.transactions[i].inventory[idx].quantity = Number(val);
//     this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(this.giddhBalanceDecimalPlaces));
//     this.amountChanged(idx);
// }

// public validateAndAddNewStock(idx) {
//     let i = this.selectedIdx;
//     if (this.requestObj.transactions[i]?.inventory?.length - 1 === idx) {
//         this.requestObj.transactions[i].inventory.push(this.initInventory());
//     }
// }

// public onStockFocus(ev, stockIndx: number, indx: number) {
//     this.selectedStockInputField = ev.target;
//     this.showConfirmationBox = false;
//     this.selectedStockIdx = stockIndx;
//     this.selectedIdx = indx;
//     this.getStock(this.groupUniqueName);
//     this.getStock();
//     this.showLedgerAccountList = true;
//     setTimeout(() => {
//         this.selectedField = 'stock';
//     }, 100);
// }

// public openCreateAccountPopupIfRequired(e) {
//     if (e && this.isNoAccFound) {
//         // this.showQuickAccountModal();
//     }
// }

/**
* getStock
*/
// public getStock(parentGrpUnqName?, q?: string, forceRefresh: boolean = false, needToFocusStockInputField: boolean = false) {
//     if (this.allStocks && this.allStocks.length && !forceRefresh) {
//         // this.inputForList = cloneDeep(this.allStocks);
//         this.sortStockItems(cloneDeep(this.allStocks));
//     } else {
//         this.inventoryService.GetStocks().pipe(takeUntil(this.destroyed$)).subscribe(data => {
//             if (data?.status === 'success') {
//                 this.allStocks = cloneDeep(data?.body?.results);
//                 this.sortStockItems(this.allStocks);
//                 if (needToFocusStockInputField) {
//                     this.selectedStockInputField.value = '';
//                     this.selectedStockInputField.focus();
//                 }
//                 // this.inputForList = cloneDeep(this.allStocks);
//             } else {
//                 // this.noResult = true;
//             }
//         });
//     }
// }

/**
 * sortStockItems
 */
// public sortStockItems(ItemArr) {
//     let stockAccountArr: IOption[] = [];
//     forEach(ItemArr, (obj: any) => {
//         stockAccountArr.push({
//             label: `${obj.name} (${obj?.uniqueName})`,
//             value: obj?.uniqueName,
//             additional: obj
//         });
//     });
//     this.stockList = stockAccountArr;
//     this.inputForList = cloneDeep(this.stockList);
// }

// public loadQuickAccountComponent() {
//     if (this.quickAccountModal && this.quickAccountModal.config) {
//         this.quickAccountModal.config.backdrop = false;
//     }
//     let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
//     let viewContainerRef = this.quickAccountComponent.viewContainerRef;
//     viewContainerRef.remove();
//     let componentRef = viewContainerRef.createComponent(componentFactory);
//     let componentInstance = componentRef.instance as QuickAccountComponent;
//     componentInstance.needAutoFocus = true;
//     componentInstance.closeQuickAccountModal.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
//         this.hideQuickAccountModal();
//         componentInstance.newAccountForm.reset();
//         componentInstance.destroyed$.next(true);
//         componentInstance.destroyed$.complete();
//         this.isNoAccFound = false;
//         this.dateField?.nativeElement?.focus();
//     });
// }

// public showQuickAccountModal() {
//     // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
//     // this.selectedAccountInputField = selectedField;
//     if (this.selectedField === 'account') {
//         this.loadQuickAccountComponent();
//         this.quickAccountModal?.show();
//     } else if (this.selectedField === 'stock') {
//         this.asideMenuStateForProductService = 'in';
//         this.autoFocusStockGroupField = true;
//     }
// }

// public hideQuickAccountModal() {
//     this.quickAccountModal.hide();
//     this.dateField?.nativeElement?.focus();
//     return setTimeout(() => {
//         this.selectedAccountInputField.value = '';
//         this.selectedAccountInputField.focus();
//     }, 200);
// }

// public closeCreateStock() {
//     this.asideMenuStateForProductService = 'out';
//     this.autoFocusStockGroupField = false;
//     // after creating stock, get all stocks again
//     this.filterByText = '';
//     this.dateField?.nativeElement?.focus();
//     this.getStock(null, null, true, true);
// }

/**
* This will create list of accounts depending on voucher type
*
* @memberof AccountAsVoucherComponent
*/
// public createAccountsList(): void {
//     if (this.allAccounts) {
//         let accList: IOption[] = [];
//         let accountList = [];
//         this.allAccounts.forEach((acc: IFlattenAccountsResultItem) => {
//             if (!accountList[acc?.uniqueName] && this.activeCompany && acc.currency === this.activeCompany?.baseCurrency) {
//                 if (this.requestObj.voucherType === VOUCHERS.CONTRA) {
//                     const isContraAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || pg?.uniqueName === 'currentliabilities' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft')));
//                     const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'dutiestaxes'));
//                     if (isContraAccount && !isDisallowedAccount) {
//                         accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
//                         accountList[acc?.uniqueName] = true;
//                     }
//                 } else if (this.requestObj.voucherType === VOUCHERS.RECEIPT) {
//                     let isReceiptAccount;

//                     if (this.selectedTransactionType === 'to') {
//                         isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
//                     } else {
//                         isReceiptAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'bankaccounts' || pg?.uniqueName === 'cash' || (this.generalService.voucherApiVersion === 2 && pg?.uniqueName === 'loanandoverdraft') || pg?.uniqueName === 'currentliabilities' || pg?.uniqueName === 'sundrycreditors' || pg?.uniqueName === 'sundrydebtors'));
//                     }

//                     const isDisallowedAccount = acc?.parentGroups.find((pg) => (pg?.uniqueName === 'dutiestaxes'));
//                     if (isReceiptAccount && !isDisallowedAccount) {
//                         accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
//                         accountList[acc?.uniqueName] = true;
//                     }
//                 } else {
//                     accList.push({ label: `${acc.name} (${acc?.uniqueName})`, value: acc?.uniqueName, additional: acc });
//                     accountList[acc?.uniqueName] = true;
//                 }
//             }
//         });
//         this.flattenAccounts = accList;
//         this.inputForList = cloneDeep(this.flattenAccounts);
//     }
// }

/**
 * Callback for adjusment popup close event
 *
 * @param {*} event
 * @memberof AccountAsVoucherComponent
 */
// public handleEntries(event): void {
//     this.receiptEntries = event.voucherAdjustments;
//     this.totalEntries = (this.receiptEntries) ? this.receiptEntries.length : 0;
//     this.adjustmentTransaction = event;
//     // this.getTaxList();
//     this.updateAdjustmentTypes("update");
//     this.modalRef.hide();
// }

/**
 * This will get tax list
 *
 * @memberof AccountAsVoucherComponent
 */
// public getTaxList(): void {
//     this.store.pipe(select(companyStore => companyStore.company), takeUntil(this.destroyed$)).subscribe(res => {
//         if (res) {
//             if (res.taxes) {
//                 let taxList: IOption[] = [];
//                 Object.keys(res.taxes).forEach(key => {
//                     taxList.push({ label: res.taxes[key].name, value: res.taxes[key]?.uniqueName });

//                     this.taxList[res.taxes[key]?.uniqueName] = [];
//                     this.taxList[res.taxes[key]?.uniqueName] = res.taxes[key];
//                 });
//                 this.taxListSource$ = observableOf(taxList);
//             }
//         } else {
//             this.store.dispatch(this.companyActions.getTax());
//         }
//     });
// }

/**
 * This will get list of all pending invoices
 *
 * @memberof AccountAsVoucherComponent
 */
// public getInvoiceListForReceiptVoucher(): void {
//     let pendingInvoiceList: IOption[] = [];
//     this.pendingInvoiceList = [];
//     this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);

//     this.salesService.getInvoiceList(this.pendingInvoicesListParams, dayjs(this.journalDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
//         if (response && response.status === "success" && response.body && response.body.results && response.body.results.length > 0) {
//             Object.keys(response.body.results).forEach(key => {
//                 this.pendingInvoiceList[response.body.results[key]?.uniqueName] = [];
//                 this.pendingInvoiceList[response.body.results[key]?.uniqueName] = response.body.results[key];

//                 pendingInvoiceList.push({ label: response.body.results[key].voucherNumber + ", " + response.body.results[key].voucherDate + ", " + response.body.results[key].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr, value: response.body.results[key]?.uniqueName });
//             });
//             this.pendingInvoiceListSource$ = observableOf(pendingInvoiceList);
//         }
//     });
// }

/**
 * Callback for select tax in adjustment
 *
 * @param {*} event
 * @param {*} entry
 * @memberof AccountAsVoucherComponent
 */
// public onSelectTax(event: any, entry: any): void {
//     if (event && event.value) {
//         entry.tax.name = this.taxList[event.value].name;
//         entry.tax.percent = this.taxList[event.value].taxDetail[0].taxValue;

//         if (entry.amount && !isNaN(parseFloat(entry.amount)) && entry.tax.percent) {
//             entry.tax.value = parseFloat(entry.amount) / entry.tax.percent;
//         } else {
//             entry.tax.value = 0;
//         }
//     } else {
//         entry.tax = {
//             name: '',
//             uniqueName: '',
//             percent: 0,
//             value: 0
//         }
//     }
// }

/**
 * Callback for select invoice in adjustment
 *
 * @param {*} event
 * @param {*} entry
 * @memberof AccountAsVoucherComponent
 */
// public onSelectInvoice(event: any, entry: any): void {
//     if (event && event.value) {
//         entry.invoice = {
//             number: this.pendingInvoiceList[event.value].voucherNumber,
//             date: this.pendingInvoiceList[event.value].voucherDate,
//             amount: this.pendingInvoiceList[event.value].balanceDue.amountForAccount + " " + this.commonLocaleData?.app_cr,
//             uniqueName: event.value,
//             type: this.pendingInvoiceList[event.value].voucherType
//         };
//         if (this.pendingInvoiceList[event.value].balanceDue.amountForAccount < entry.amount) {
//             this._toaster.clearAllToaster();
//             this._toaster.errorToast(this.invoiceAmountErrorMessage);
//         }
//     } else {
//         entry.invoice = {
//             number: '',
//             date: '',
//             amount: 0,
//             uniqueName: '',
//             type: ''
//         };
//     }

//     this.validateEntries(false);
// }

/**
 * This will remove the adjustment entry
 *
 * @param {number} index
 * @memberof AccountAsVoucherComponent
 */
// public removeReceiptEntry(index: number): void {
//     let receiptEntries = [];
//     let loop = 0;
//     this.receiptEntries.forEach(entry => {
//         if (loop !== index) {
//             receiptEntries.push(entry);
//         }
//         loop++;
//     });

//     this.receiptEntries = receiptEntries;
//     this.totalEntries--;
//     this.validateEntries(false);
// }

