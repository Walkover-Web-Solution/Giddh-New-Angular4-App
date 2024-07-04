import { Injectable } from "@angular/core";
import { SearchType, TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";
import { VoucherForm } from "../../models/api-models/Voucher";
import { ACCOUNT_SEARCH_RESULTS_PAGINATION_LIMIT, GIDDH_VOUCHER_FORM, PAGINATION_LIMIT } from "../../app.constant";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import * as cleaner from 'fast-clean';

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
            } else if(countryCode === TaxSupportedCountries.US) {
                return TaxType.SALES_TAX;
            }
        } else {
            return null;
        }
    }

    public getVoucherType(voucherType: string, accountUniqueName: string = '', isLastInvoiceCopied: boolean = false): any {
        let isSalesInvoice = voucherType === VoucherTypeEnum.sales;
        let isCashInvoice = this.voucherTypes.includes(voucherType);
        let isCreditNote = voucherType === VoucherTypeEnum.creditNote || voucherType === VoucherTypeEnum.cashCreditNote;
        let isDebitNote = voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.cashDebitNote;
        let isPurchaseInvoice = voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill;
        let isProformaInvoice = voucherType === VoucherTypeEnum.proforma || voucherType === VoucherTypeEnum.generateProforma;
        let isEstimateInvoice = voucherType === VoucherTypeEnum.estimate || voucherType === VoucherTypeEnum.generateEstimate;
        let isPurchaseOrder = voucherType === VoucherTypeEnum.purchaseOrder;

        // special case when we double click on account name and that accountUniqueName is cash then we have to mark as Cash Invoice
        if (isSalesInvoice && !isLastInvoiceCopied) {
            if (accountUniqueName === 'cash') {
                isSalesInvoice = false;
                isCashInvoice = true;
            }
        }

        return { isSalesInvoice, isCashInvoice, isCreditNote, isDebitNote, isPurchaseInvoice, isProformaInvoice, isEstimateInvoice, isPurchaseOrder };
    }

    public parseVoucherType(voucherType: string): string {
        return voucherType = voucherType !== VoucherTypeEnum.purchaseOrder ? voucherType.toString().replace(/-/g, " ") : VoucherTypeEnum.purchaseOrder;
    }

    public createQueryString(url: string, model: any): string {
        Object.keys(model).forEach((key, index) => {
            const delimiter = index === 0 ? '?' : '&'
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
            group = (voucherType === VoucherTypeEnum.debitNote) ? 'sundrycreditors' : (voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder) ? 'sundrycreditors' : 'sundrydebtors';
        } else if (searchType === SearchType.ITEM) {
            group = (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote || voucherType === VoucherTypeEnum.purchaseOrder) ?
                'operatingcost, indirectexpenses, fixedassets' : 'otherincome, revenuefromoperations, fixedassets';
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

            default:
                voucherName = voucherType;
                break;
        }

        return voucherName;
    }

    public getParentGroupForAccountCreate(voucherType: string): string {
        if (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) {
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
            voucherTotals.totalTaxableValue += ((Number(entry.transactions[0]?.amount?.amountForAccount)) - (Number(entry.totalDiscount)));
            voucherTotals.totalTaxWithoutCess += (Number(entry.totalTaxWithoutCess));
            voucherTotals.totalCess += (Number(entry.totalCess));
            voucherTotals.grandTotal += (Number(entry.total?.amountForAccount));

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
        delete invoiceForm.deposit.currencySymbol;
        delete invoiceForm.account.billingDetails.index;
        delete invoiceForm.account.shippingDetails.index;
        delete invoiceForm.company.billingDetails.index;
        delete invoiceForm.company.shippingDetails.index;
        delete invoiceForm.salesPurchaseAsReceiptPayment;

        invoiceForm?.entries?.forEach(entry => {
            delete entry.showCodeType;
            delete entry.totalDiscount;
            delete entry.totalTax;
            delete entry.totalTaxWithoutCess;
            delete entry.totalCess;
            delete entry.total;
            delete entry.requiredTax;

            entry.taxes?.forEach(tax => {
                delete tax.taxType;
                delete tax.taxDetail;
            });

            if (entry.otherTax?.uniqueName && entry.otherTax?.calculationMethod) {
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
            entryTotal = giddhRoundOff(Number(entry.transactions[0].stock?.quantity) * Number(entry.transactions[0].stock?.rate?.rateForAccount));
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
}
