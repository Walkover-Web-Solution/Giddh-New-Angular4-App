import { Injectable } from "@angular/core";
import { SearchType, TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";
import { GeneralService } from "../../services/general.service";
import { VoucherForm } from "../../models/api-models/Voucher";
import { GIDDH_VOUCHER_FORM } from "../../app.constant";

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
        return voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.creditNote ? voucherType.toString().replace("-", " ") : voucherType;
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
            group = (voucherType === VoucherTypeEnum.debitNote) ? 'sundrycreditors' : (voucherType === VoucherTypeEnum.purchaseOrder) ? (this.generalService.voucherApiVersion === 2) ? 'sundrycreditors' : 'sundrycreditors, bankaccounts, cash' : 'sundrydebtors';
        } else if (searchType === SearchType.ITEM) {
            group = (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) ?
                'operatingcost, indirectexpenses' : 'otherincome, revenuefromoperations';
            withStocks = !!query;

            if (this.generalService.voucherApiVersion === 2) {
                group += ", fixedassets";
            }
        } else if (searchType === SearchType.BANK) {
            group = 'bankaccounts, cash';
            if (this.generalService.voucherApiVersion === 2) {
                group += ", loanandoverdraft";
            }
        }
        const requestObject = {
            q: encodeURIComponent(query),
            page,
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
}