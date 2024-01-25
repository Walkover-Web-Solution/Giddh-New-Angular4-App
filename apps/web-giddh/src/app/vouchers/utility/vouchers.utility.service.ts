import { Injectable } from "@angular/core";
import { SEARCH_TYPE, TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";
import { GeneralService } from "../../services/general.service";

@Injectable({
    providedIn: 'any'
})
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
        return voucherType.toString().replace("-", " ");
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
        
        if (searchType === SEARCH_TYPE.CUSTOMER) {
            group = (voucherType === VoucherTypeEnum.debitNote) ? 'sundrycreditors' : (voucherType === VoucherTypeEnum.purchase) ? (this.generalService.voucherApiVersion === 2) ? 'sundrycreditors' : 'sundrycreditors, bankaccounts, cash' : 'sundrydebtors';
        } else if (searchType === SEARCH_TYPE.ITEM) {
            group = (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) ?
                'operatingcost, indirectexpenses' : 'otherincome, revenuefromoperations';
            withStocks = !!query;

            if (this.generalService.voucherApiVersion === 2) {
                group += ", fixedassets";
            }
        } else if (searchType === SEARCH_TYPE.BANK) {
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
}