import { Injectable } from "@angular/core";
import { TaxSupportedCountries, TaxType, VoucherTypeEnum } from "./vouchers.const";


@Injectable({
    providedIn: 'any'
})
export class VouchersUtilityService {

    public voucherTypes: any[] = [VoucherTypeEnum.cashCreditNote, VoucherTypeEnum.cash, VoucherTypeEnum.cashDebitNote, VoucherTypeEnum.cashBill];

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

    public getVoucherType(voucherType: string, selectedAccountUniqueName: string = '', isLastInvoiceCopied: boolean = false): any {
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
            if (selectedAccountUniqueName === 'cash') {
                isSalesInvoice = false;
                isCashInvoice = true;
            }
        }

        return { isSalesInvoice, isCashInvoice, isCreditNote, isDebitNote, isPurchaseInvoice, isProformaInvoice, isEstimateInvoice, isPurchaseOrder };
    }

    public parseVoucherType(voucherType: string): string {
        return voucherType.toString().replace("-", " ");
    }
}