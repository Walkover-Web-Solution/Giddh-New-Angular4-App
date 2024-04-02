import { Injectable } from "@angular/core";
import { SearchType, TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";
import { GeneralService } from "../../services/general.service";
import { VoucherForm } from "../../models/api-models/Voucher";
import { GIDDH_VOUCHER_FORM, PAGINATION_LIMIT } from "../../app.constant";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";

@Injectable()
export class VouchersUtilityService {

    public voucherTypes: any[] = [VoucherTypeEnum.cashCreditNote, VoucherTypeEnum.cash, VoucherTypeEnum.cashDebitNote, VoucherTypeEnum.cashBill];

    constructor(
        private generalService: GeneralService
    ) {

    }

    public showTaxTypeByCountry(countryCode: string, companyCountryCode: string): TaxType {
        if (companyCountryCode === countryCode) {
            if (countryCode === TaxSupportedCountries.IN) {
                return TaxType.GST;
            } else if (countryCode === TaxSupportedCountries.UAE) {
                return TaxType.TRN;
            } else if (countryCode === TaxSupportedCountries.UK) {
                return TaxType.VAT;
            }
        } else {
            return null;
        }
    }

    public getVoucherType(voucherType: string, accountUniqueName: string = '', isLastInvoiceCopied: boolean = false): any {
        let isSalesInvoice = voucherType === VoucherTypeEnum.sales;
        let isCashInvoice = this.voucherTypes.includes(voucherType);
        let isCreditNote = voucherType === VoucherTypeEnum.creditNote;
        let isDebitNote = voucherType === VoucherTypeEnum.debitNote;
        let isPurchaseInvoice = voucherType === VoucherTypeEnum.purchase;
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
        return voucherType = !(voucherType === VoucherTypeEnum.purchaseOrder) ? voucherType.toString().replace("-", " ") : VoucherTypeEnum.purchaseOrder;
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
            withStocks = !!query;
        } else if (searchType === SearchType.BANK) {
            group = 'bankaccounts, cash, loanandoverdraft';
        }

        const requestObject = {
            q: encodeURIComponent(query),
            page,
            count: PAGINATION_LIMIT,
            group: encodeURIComponent(group)
        };
        if (withStocks) {
            requestObject['withStocks'] = withStocks;
        }
        return requestObject;
    }

    public getVoucherNameByType(voucherType: string, localeData: any): string {
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
                voucherName = localeData?.invoice_types?.sales;
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
                voucherName = localeData?.invoice_types?.cash;
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
                voucherName = "Purchase Order";
                break;

            default:
                voucherName = voucherType;
                break;
        }

        return voucherName;
    }

    public getParentGroupForAccountCreate(voucherType: string): string {
        if (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) {
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

    public getVoucherTotals(entries: any[], balanceDecimalPlaces: number, applyRoundOff: boolean): any {
        let voucherTotals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalTaxableValue: 0,
            totalTaxWithoutCess: 0,
            totalCess: 0,
            grandTotal: 0,
            roundOff: 0
        };

        entries?.forEach(entry => {
            voucherTotals.totalAmount += (Number(entry.transactions[0]?.amount?.amountForAccount));
            voucherTotals.totalDiscount += (Number(entry.totalDiscount));
            voucherTotals.totalTaxableValue += ((Number(entry.transactions[0]?.amount?.amountForAccount)) - (Number(entry.totalDiscount)));
            voucherTotals.totalTaxWithoutCess += (Number(entry.totalTaxWithoutCess));
            voucherTotals.totalCess += (Number(entry.totalCess));
            voucherTotals.grandTotal += (Number(entry.total?.amountForAccount));
        });

        voucherTotals.totalAmount = giddhRoundOff(voucherTotals.totalAmount, balanceDecimalPlaces);
        voucherTotals.totalDiscount = giddhRoundOff(voucherTotals.totalDiscount, balanceDecimalPlaces);
        voucherTotals.totalTaxableValue = giddhRoundOff(voucherTotals.totalTaxableValue, balanceDecimalPlaces);
        voucherTotals.totalTaxWithoutCess = giddhRoundOff(voucherTotals.totalTaxWithoutCess, balanceDecimalPlaces);
        voucherTotals.totalCess = giddhRoundOff(voucherTotals.totalCess, balanceDecimalPlaces);
        voucherTotals.grandTotal = giddhRoundOff(voucherTotals.grandTotal, balanceDecimalPlaces);
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
        delete invoiceForm.account.billingAddress.index;
        delete invoiceForm.account.shippingAddress.index;
        delete invoiceForm.company.billingAddress.index;
        delete invoiceForm.company.shippingAddress.index;

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

            delete entry.otherTax;
        });

        return invoiceForm;
    }

    public formatBillingShippingAddress(invoiceForm: any): any {
        if (invoiceForm?.account?.shippingDetails?.address?.length && invoiceForm?.account?.shippingDetails?.address[0]?.length > 0) {
            invoiceForm.account.shippingDetails.address[0] = invoiceForm.account.shippingDetails.address[0]?.trim();
            invoiceForm.account.shippingDetails.address[0] = invoiceForm.account.shippingDetails.address[0]?.replace(/\n/g, '<br />');
            invoiceForm.account.shippingDetails.address = invoiceForm.account.shippingDetails.address[0]?.split('<br />');
        }
        if (invoiceForm?.account?.billingDetails?.address?.length && invoiceForm?.account?.billingDetails?.address[0]?.length > 0) {
            invoiceForm.account.billingDetails.address[0] = invoiceForm.account.billingDetails.address[0]?.trim();
            invoiceForm.account.billingDetails.address[0] = invoiceForm.account.billingDetails.address[0]?.replace(/\n/g, '<br />');
            invoiceForm.account.billingDetails.address = invoiceForm.account.billingDetails.address[0]?.split('<br />');
        }

        if (invoiceForm?.company?.shippingDetails?.address?.length && invoiceForm?.company?.shippingDetails?.address[0]?.length > 0) {
            invoiceForm.company.shippingDetails.address[0] = invoiceForm.company.shippingDetails.address[0]?.trim();
            invoiceForm.company.shippingDetails.address[0] = invoiceForm.company.shippingDetails.address[0]?.replace(/\n/g, '<br />');
            invoiceForm.company.shippingDetails.address = invoiceForm.company.shippingDetails.address[0]?.split('<br />');
        }
        if (invoiceForm?.company?.billingDetails?.address?.length && invoiceForm?.company?.billingDetails?.address[0]?.length > 0) {
            invoiceForm.company.billingDetails.address[0] = invoiceForm.company.billingDetails.address[0]?.trim();
            invoiceForm.company.billingDetails.address[0] = invoiceForm.company.billingDetails.address[0]?.replace(/\n/g, '<br />');
            invoiceForm.company.billingDetails.address = invoiceForm.company.billingDetails.address[0]?.split('<br />');
        }

        return invoiceForm;
    }

    public formatVoucherObject(invoiceForm: any): any {
        invoiceForm.date = this.convertDateToString(invoiceForm.date);
        invoiceForm.dueDate = this.convertDateToString(invoiceForm.dueDate);
        invoiceForm.templateDetails.other.shippingDate = this.convertDateToString(invoiceForm.templateDetails.other.shippingDate);

        invoiceForm = this.formatBillingShippingAddress(invoiceForm);
        return invoiceForm;
    }
}