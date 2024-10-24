import { Injectable } from "@angular/core";
import { SearchType, TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";
import { VoucherForm } from "../../models/api-models/Voucher";
import { ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT, EInvoiceStatus, GIDDH_VOUCHER_FORM } from "../../app.constant";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import * as cleaner from 'fast-clean';
import { ReceiptItem } from "../../models/api-models/recipt";

@Injectable()
export class VouchersUtilityService {
    public voucherTypes: any[] = [VoucherTypeEnum.cashCreditNote, VoucherTypeEnum.cash, VoucherTypeEnum.cashDebitNote, VoucherTypeEnum.cashBill];

    public showTaxTypeByCountry(countryCode: string, companyCountryCode: string): TaxType {
        if (companyCountryCode === countryCode) {
            if (countryCode === TaxSupportedCountries.IN) {
                return TaxType.GST;
            } else if (countryCode === TaxSupportedCountries.UAE) {
                return TaxType.TRN;
            } else if (countryCode === TaxSupportedCountries.GB || countryCode === TaxSupportedCountries.ZW || countryCode === TaxSupportedCountries.KE) {
                return TaxType.VAT;
            } else if (countryCode === TaxSupportedCountries.US) {
                return TaxType.SALES_TAX;
            }
        } else {
            return null;
        }
    }
    public getVoucherType(voucherType: string, isCashVoucher?: any, accountUniqueName: string = '', isLastInvoiceCopied: boolean = false): any {
        let isSalesInvoice;
        let isCashInvoice;
        if (isCashVoucher === undefined) {
            isSalesInvoice = voucherType === VoucherTypeEnum.sales;
            isCashInvoice = this.voucherTypes.includes(voucherType);
        } else {
            isSalesInvoice = !isCashVoucher;
            isCashInvoice = isCashVoucher;
        }
        let isCreditNote = voucherType === VoucherTypeEnum.creditNote || voucherType === VoucherTypeEnum.cashCreditNote;
        let isDebitNote = voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.cashDebitNote;
        let isPurchaseInvoice = voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill;
        let isProformaInvoice = voucherType === VoucherTypeEnum.proforma || voucherType === VoucherTypeEnum.generateProforma;
        let isEstimateInvoice = voucherType === VoucherTypeEnum.estimate || voucherType === VoucherTypeEnum.generateEstimate;
        let isPurchaseOrder = voucherType === VoucherTypeEnum.purchaseOrder;
        let isReceiptInvoice = voucherType === VoucherTypeEnum.receipt;
        let isPaymentInvoice = voucherType === VoucherTypeEnum.payment;

        // special case when we double click on account name and that accountUniqueName is cash then we have to mark as Cash Invoice
        if (isSalesInvoice && !isLastInvoiceCopied) {
            if (accountUniqueName === 'cash') {
                isSalesInvoice = false;
                isCashInvoice = true;
            }
        }

        return { isSalesInvoice, isCashInvoice, isCreditNote, isDebitNote, isPurchaseInvoice, isProformaInvoice, isEstimateInvoice, isPurchaseOrder, isReceiptInvoice, isPaymentInvoice };
    }

    public parseVoucherType(voucherType: string): string {
        return voucherType = voucherType !== VoucherTypeEnum.purchaseOrder ? voucherType.toString().replace(/-/g, " ") : VoucherTypeEnum.purchaseOrder;
    }

    public createQueryString(url: string, model: any): string {
        url += '?';
        Object.keys(model).forEach((key, index) => {
            const delimiter = index === 0 ? '' : '&'
            if (model[key] !== undefined) {
                url += `${delimiter}${key}=${model[key]}`
            }
        });
        return url;
    }

    /**
     * Returns the search request object
     *
     * @param {string} query Query to be searched
     * @param {number} [page=1] Page for which search is to be made
     * @param {string} searchType Type of search to be performed
     * @returns {*} Search request object
     * @memberof VoucherComponent
     */
    public getSearchRequestObject(voucherType: string, query: string, page: number = 1, searchType: string): any {
        let withStocks: boolean;
        let group: string;

        if (searchType === SearchType.CUSTOMER) {
            group = (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.payment) ? 'sundrycreditors' : 'sundrydebtors';
        } else if (searchType === SearchType.ITEM) {
            group = voucherType === VoucherTypeEnum.receipt || voucherType === VoucherTypeEnum.payment ? 'bankaccounts, cash, loanandoverdraft' : (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote || voucherType === VoucherTypeEnum.purchaseOrder) ? 'operatingcost, indirectexpenses, fixedassets' : 'otherincome, revenuefromoperations, fixedassets';
            withStocks = true;
        } else if (searchType === SearchType.BANK) {
            group = 'bankaccounts, cash, loanandoverdraft';
        }

        const requestObject = {
            q: encodeURIComponent(query),
            page,
            count: ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT,
            group: encodeURIComponent(group)
        };
        if (withStocks) {
            requestObject['withStocks'] = withStocks;
        }
        return requestObject;
    }

    /**
     * Returns the voucher name by voucher type
     *
     * @param {string} voucherType
     * @param {*} localeData
     * @param {boolean} isCopyVoucher
     * @memberof VoucherComponent
     */
    public getVoucherNameByType(voucherType: string, localeData: any, isCopyVoucher: boolean = false): string {
        let voucherName = "";

        switch (voucherType) {
            case VoucherTypeEnum.proforma:
                voucherName = localeData?.invoice_types?.proforma;
                break;

            case VoucherTypeEnum.generateProforma:
                voucherName = localeData?.invoice_types?.proforma;
                break;

            case VoucherTypeEnum.estimate:
                voucherName = localeData?.invoice_types?.estimate;
                break;

            case VoucherTypeEnum.generateEstimate:
                voucherName = localeData?.invoice_types?.estimate;
                break;

            case VoucherTypeEnum.sales:
                voucherName = isCopyVoucher ? localeData?.invoice_types?.sales : localeData?.invoice_types?.invoice;
                break;

            case VoucherTypeEnum.creditNote:
                voucherName = localeData?.invoice_types?.credit_note;
                break;

            case VoucherTypeEnum.debitNote:
                voucherName = localeData?.invoice_types?.debit_note;
                break;

            case VoucherTypeEnum.purchase:
                voucherName = localeData?.invoice_types?.purchase;
                break;

            case VoucherTypeEnum.cash:
                voucherName = localeData?.invoice_types?.cash_invoice;
                break;

            case VoucherTypeEnum.cashBill:
                voucherName = localeData?.invoice_types?.cash_bill;
                break;

            case VoucherTypeEnum.cashCreditNote:
                voucherName = localeData?.invoice_types?.cash_credit_note;
                break;

            case VoucherTypeEnum.cashDebitNote:
                voucherName = localeData?.invoice_types?.cash_debit_note;
                break;

            case VoucherTypeEnum.purchaseOrder:
                voucherName = localeData?.invoice_types?.purchase_order;
                break;

            case VoucherTypeEnum.receipt:
                voucherName = localeData?.invoice_types?.receipt;
                break;

            case VoucherTypeEnum.payment:
                voucherName = localeData?.invoice_types?.payment;
                break;

            default:
                voucherName = voucherType;
                break;
        }

        return voucherName;
    }

    public getParentGroupForAccountCreate(voucherType: string): string {
        if (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote || voucherType === VoucherTypeEnum.payment) {
            return 'sundrycreditors';
        } else {
            return 'sundrydebtors';
        }
    }

    public getDefaultAddress(accountData: any): any {
        let defaultAddress = null;
        let defaultAddressIndex = null;

        if (accountData.addresses?.length === 1) {
            defaultAddress = accountData.addresses[0];
            defaultAddressIndex = 0;
        } else {
            accountData.addresses?.forEach((address, index) => {
                if (address.isDefault) {
                    defaultAddress = address;
                    defaultAddressIndex = index;
                }
            });
        }

        if (!defaultAddress?.state?.code && defaultAddress?.stateCode) {
            defaultAddress.state = {
                code: defaultAddress.stateCode,
                name: defaultAddress.stateName
            };
        }

        return { defaultAddress, defaultAddressIndex };
    }

    /**
     * Prepares the voucher form based on current voucher type
     *
     * @param {string} voucherType Current voucher type
     * @param {*} [formConfiguration] If form configuration are loaded from the API
     * @return {VoucherForm} Voucher form configuration for current voucher
     * @memberof VouchersUtilityService
     */
    public prepareVoucherForm(voucherType: string, formConfiguration?: any): VoucherForm {
        if (formConfiguration) {
            return formConfiguration.find(form => form.type === voucherType);
        } else {
            return GIDDH_VOUCHER_FORM.find(form => form.type === voucherType);
        }
    }

    public getVoucherTotals(entries: any[], balanceDecimalPlaces: number, applyRoundOff: boolean, exchangeRate: number): any {
        let voucherTotals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalTaxableValue: 0,
            totalTaxWithoutCess: 0,
            totalCess: 0,
            grandTotal: 0,
            grandTotalMultiCurrency: 0,
            roundOff: 0,
            tcsTotal: 0,
            tdsTotal: 0,
            balanceDue: 0
        };

        entries?.forEach(entry => {
            voucherTotals.totalAmount += (Number(entry.transactions[0]?.amount?.amountForAccount));
            voucherTotals.totalDiscount += (Number(entry.totalDiscount));
            if (entry.transactions[0]?.taxableValue) {
                voucherTotals.totalTaxableValue += Number(entry.transactions[0]?.taxableValue?.amountForAccount);
            } else {
                voucherTotals.totalTaxableValue += (Number(entry.transactions[0]?.amount?.amountForAccount)) - (Number(entry.totalDiscount));
            }
            voucherTotals.totalTaxWithoutCess += Number(entry.totalTaxWithoutCess);
            voucherTotals.totalCess += Number(entry.totalCess);

            if (entry.grandTotal) {
                voucherTotals.grandTotal += Number(entry.grandTotal?.amountForAccount);
            } else {
                voucherTotals.grandTotal += Number(entry.total?.amountForAccount);
            }

            if (entry.otherTax?.type === 'tcs') {
                voucherTotals.tcsTotal += entry.otherTax?.amount;
            } else if (entry.otherTax?.type === 'tds') {
                voucherTotals.tdsTotal += entry.otherTax?.amount;
            }
        });

        voucherTotals.totalAmount = giddhRoundOff(voucherTotals.totalAmount, balanceDecimalPlaces);
        voucherTotals.totalDiscount = giddhRoundOff(voucherTotals.totalDiscount, balanceDecimalPlaces);
        voucherTotals.totalTaxableValue = giddhRoundOff(voucherTotals.totalTaxableValue, balanceDecimalPlaces);
        voucherTotals.totalTaxWithoutCess = giddhRoundOff(voucherTotals.totalTaxWithoutCess, balanceDecimalPlaces);
        voucherTotals.totalCess = giddhRoundOff(voucherTotals.totalCess, balanceDecimalPlaces);
        voucherTotals.grandTotal = giddhRoundOff(voucherTotals.grandTotal, balanceDecimalPlaces);
        voucherTotals.grandTotalMultiCurrency = giddhRoundOff(voucherTotals.grandTotal * exchangeRate, balanceDecimalPlaces);
        voucherTotals.roundOff = (applyRoundOff) ? Number((Math.round(voucherTotals.grandTotal) - voucherTotals.grandTotal).toFixed(balanceDecimalPlaces)) : Number((0).toFixed(balanceDecimalPlaces));

        return voucherTotals;
    }

    public convertDateToString(value: any): string {
        if (value) {
            // To check val is DD-MM-YY format already so it will be string then return val
            if (typeof value === 'string') {
                if (value.includes('-')) {
                    return value;
                } else {
                    return '';
                }
            } else {
                try {
                    return dayjs(value).format(GIDDH_DATE_FORMAT);
                } catch (error) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    public cleanVoucherObject(invoiceForm: any): any {
        if (invoiceForm) {
            invoiceForm.deposits?.forEach((response) => {
                delete response.currencySymbol;
                delete response.type;
            });

            delete invoiceForm.account.billingDetails.index;
            delete invoiceForm.account.shippingDetails.index;
            delete invoiceForm.company.billingDetails.index;
            delete invoiceForm.company.shippingDetails.index;
            delete invoiceForm.grandTotalMultiCurrency;
            delete invoiceForm.chequeNumber;
            delete invoiceForm.chequeClearanceDate;
            delete invoiceForm.isAdvanceReceipt;
            delete invoiceForm.salesPurchaseAsReceiptPayment;

            invoiceForm.entries?.forEach(entry => {
                delete entry.showCodeType;
                delete entry.totalDiscount;
                delete entry.totalTax;
                delete entry.totalTaxWithoutCess;
                delete entry.totalCess;
                delete entry.total;
                delete entry.requiredTax;
                delete entry.calculateTotal;

                entry.taxes?.forEach(tax => {
                    delete tax.taxType;
                    delete tax.taxDetail;
                });

                if (entry.otherTax?.uniqueName && entry.otherTax?.calculationMethod) {
                    if (!entry.taxes) {
                        entry.taxes = [];
                    }

                    entry.taxes.push({
                        uniqueName: entry.otherTax?.uniqueName,
                        calculationMethod: entry.otherTax?.calculationMethod
                    });
                }

                if (!entry.transactions[0]?.stock?.uniqueName) {
                    delete entry.transactions[0].stock;
                }

                if (entry.transactions[0].stock) {
                    delete entry.transactions[0].stock.maxQuantity;
                }

                delete entry.otherTax;
            });

            invoiceForm = cleaner?.clean(invoiceForm, {
                nullCleaner: true
            });

            return invoiceForm;
        }
    }

    /**
     * Remove key from object whose value is null
     *
     * @param {*} object
     * @return {*}  {*}
     * @memberof VouchersUtilityService
     */
    public cleanObject(object: any): any {
        return cleaner?.clean(object, {
            nullCleaner: true
        });
    }

    private getAddress(address: any): string {
        return (typeof address === "string") ? address : address[0];
    }

    public formatBillingShippingAddress(invoiceForm: any): any {
        if (invoiceForm?.account?.billingDetails?.address?.length) {
            invoiceForm.account.billingDetails.address = [this.getAddress(invoiceForm.account.billingDetails.address)?.trim()?.replace(/\n/g, '<br />')];
            invoiceForm.account.billingDetails.address = invoiceForm.account.billingDetails.address[0]?.split('<br />');
        }

        if (invoiceForm?.account?.shippingDetails?.address?.length) {
            invoiceForm.account.shippingDetails.address = [this.getAddress(invoiceForm.account.shippingDetails.address)?.trim()?.replace(/\n/g, '<br />')];
            invoiceForm.account.shippingDetails.address = invoiceForm.account.shippingDetails.address[0]?.split('<br />');
        }

        if (invoiceForm?.company?.billingDetails?.address?.length) {
            invoiceForm.company.billingDetails.address = [this.getAddress(invoiceForm.company.billingDetails.address)?.trim()?.replace(/\n/g, '<br />')];
            invoiceForm.company.billingDetails.address = invoiceForm.company.billingDetails.address[0]?.split('<br />');
        }

        if (invoiceForm?.company?.shippingDetails?.address?.length) {
            invoiceForm.company.shippingDetails.address = [this.getAddress(invoiceForm.company.shippingDetails.address)?.trim()?.replace(/\n/g, '<br />')];
            invoiceForm.company.shippingDetails.address = invoiceForm.company.shippingDetails.address[0]?.split('<br />');
        }

        return invoiceForm;
    }

    public formatVoucherObject(invoiceForm: any): any {
        invoiceForm.date = this.convertDateToString(invoiceForm.date);
        invoiceForm.dueDate = this.convertDateToString(invoiceForm.dueDate);
        if (invoiceForm.templateDetails?.other?.shippingDate) {
            invoiceForm.templateDetails.other.shippingDate = this.convertDateToString(invoiceForm.templateDetails.other.shippingDate);
        }

        invoiceForm = this.formatBillingShippingAddress(invoiceForm);
        return invoiceForm;
    }

    public calculateInclusiveRate(entry: any, companyTaxes: any[], balanceDecimalPlaces: any, entryTotal: number = null): number {
        if (entryTotal === null) {
            if (entry.transactions[0].stock?.uniqueName) {
                entryTotal = giddhRoundOff(Number(entry.transactions[0].stock?.quantity) * Number(entry.transactions[0].stock?.rate?.rateForAccount));
            } else {
                entryTotal = giddhRoundOff(Number(entry.transactions[0].amount.amountForAccount));
            }
        }

        // Calculate percentage discount total
        let percentageDiscountTotal = entry.discounts?.filter(activeDiscount => activeDiscount.discountType === 'PERCENTAGE' || activeDiscount.calculationMethod === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        // Calculate fixed discount total
        let fixedDiscountTotal = entry.discounts?.filter(activeDiscount => activeDiscount.discountType === 'FIX_AMOUNT' || activeDiscount.calculationMethod === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        // Calculate tax
        let taxTotal: number = 0;
        entry?.taxes?.forEach(selectedTax => {
            companyTaxes?.forEach(tax => {
                if (tax.uniqueName === selectedTax?.uniqueName) {
                    taxTotal = Number(tax.taxDetail[0].taxValue);
                }
            });
        });

        return giddhRoundOff(((entryTotal + fixedDiscountTotal + 0.01 * fixedDiscountTotal * Number(taxTotal)) / (1 - 0.01 * percentageDiscountTotal + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscountTotal * Number(taxTotal))), balanceDecimalPlaces);
    }

    public copyAccountStateToCounty(invoiceForm: any): any {
        if (invoiceForm.account?.billingDetails?.state?.code) {
            invoiceForm.account.billingDetails.county = {
                name: invoiceForm.account.billingDetails.state?.name,
                code: invoiceForm.account.billingDetails.state?.code
            };
        }

        if (invoiceForm.account?.shippingDetails?.state?.code) {
            invoiceForm.account.shippingDetails.county = {
                name: invoiceForm.account.shippingDetails.state?.name,
                code: invoiceForm.account.shippingDetails.state?.code
            };
        }

        return invoiceForm;
    }

    public copyCompanyStateToCounty(invoiceForm: any): any {
        if (invoiceForm.company?.billingDetails?.state?.code) {
            invoiceForm.company.billingDetails.county = {
                name: invoiceForm.company.billingDetails.state?.name,
                code: invoiceForm.company.billingDetails.state?.code
            };
        }

        if (invoiceForm.company?.shippingDetails?.state?.code) {
            invoiceForm.company.shippingDetails.county = {
                name: invoiceForm.company.shippingDetails.state?.name,
                code: invoiceForm.company.shippingDetails.state?.code
            };
        }

        return invoiceForm;
    }

    /**
     * Returns the index of selected address from the address list
     *
     * @param {*} addressList
     * @param {*} selectedAddress
     * @memberof VoucherComponent
     */
    public getSelectedAddressIndex(addressList: any[], selectedAddress: any): number {
        let selectedAddressIndex = -1;
        addressList?.forEach((add, index) => {
            const address = typeof add?.address === "undefined" ? "" : typeof add?.address === "string" ? add?.address : add?.address[0];
            const state = add?.state?.name ? add?.state?.name : add?.stateName ? add?.stateName : "";
            const taxNumber = !selectedAddress?.taxNumber ? "" : selectedAddress?.taxNumber;

            if (address === selectedAddress?.address[0] && state === selectedAddress?.state?.name && (add?.taxNumber === selectedAddress?.gstNumber || add?.taxNumber === taxNumber)) {
                selectedAddressIndex = index;
            }
        });

        return selectedAddressIndex;
    }

    /**
     * Get Translated file name respect to given voucher
     *
     * @private
     * @param {string} type
     * @param {boolean} isAllItemsSelected
     * @param {*} localeData
     * @returns {string}
     * @memberof VouchersUtilityService
     */
    public getExportFileNameByVoucherType(type: string, isAllItemsSelected: boolean, localeData: any): string {
        switch (type) {
            case VoucherTypeEnum.sales: return isAllItemsSelected ? localeData?.all_invoices : localeData?.invoices;
            case VoucherTypeEnum.purchase: return isAllItemsSelected ? localeData?.all_purchases : localeData?.purchases;
            case VoucherTypeEnum.creditNote: return isAllItemsSelected ? localeData?.all_credit_notes : localeData?.credit_notes;
            case VoucherTypeEnum.debitNote: return isAllItemsSelected ? localeData?.all_debit_notes : localeData?.debit_notes;
            case VoucherTypeEnum.receipt: return isAllItemsSelected ? localeData?.all_receipts : localeData?.receipts;
            case VoucherTypeEnum.payment: return isAllItemsSelected ? localeData?.all_payments : localeData?.payments;
        }
    }

    /**
     * Returns the Estimate Proforma tooltip text
     *
     * @param {*} item
     * @param {*} giddhBalanceDecimalPlaces
     * @param {string} baseCurrency
     * @return {*}  {string}
     * @memberof VouchersUtilityService
     */
    public addEstimateProformaToolTiptext(item: any, giddhBalanceDecimalPlaces: any, baseCurrency: string): string {
        try {
            let grandTotalAmountForCompany,
                grandTotalAmountForAccount;

            if (item.amount) {
                grandTotalAmountForCompany = Number(item.amount.amountForCompany) || 0;
                grandTotalAmountForAccount = Number(item.amount.amountForAccount) || 0;
            }

            let grandTotalConversionRate = 0;
            if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(giddhBalanceDecimalPlaces);
            }

            item['grandTotalTooltipText'] = `In ${baseCurrency}: ${grandTotalAmountForCompany}\n(Conversion Rate: ${grandTotalConversionRate})`;
        } catch (error) {

        }
        return item;
    }

    /**
     * Returns the E-invoice tooltip text
     *
     * @param {ReceiptItem} item
     * @param {*} localeData
     * @return {*}  {string}
     * @memberof VouchersUtilityService
     */
    public getEInvoiceTooltipText(item: ReceiptItem, localeData: any): string {
        switch (item?.status?.toLowerCase()) {
            case EInvoiceStatus.YetToBePushed:
                return localeData?.e_invoice_statuses.yet_to_be_pushed;
            case EInvoiceStatus.Pushed:
                return localeData?.e_invoice_statuses.pushed;
            case EInvoiceStatus.PushInitiated:
                return localeData?.e_invoice_statuses.push_initiated;
            case EInvoiceStatus.Cancelled:
                // E-invoice got cancelled but invoice didn't cancel
                return item.balanceStatus !== 'cancel' ? localeData?.e_invoice_statuses.giddh_invoice_not_cancelled : localeData?.e_invoice_statuses.cancelled;
            case EInvoiceStatus.MarkedAsCancelled:
                return localeData?.e_invoice_statuses.mark_as_cancelled;
            case EInvoiceStatus.Failed:
                return item.errorMessage ?? localeData?.e_invoice_statuses.failed;
            case EInvoiceStatus.NA:
                // When invoice is B2C or B2B cancelled invoice
                return item.errorMessage ?? localeData?.e_invoice_statuses.na;
            default: return '';
        }
    }
}