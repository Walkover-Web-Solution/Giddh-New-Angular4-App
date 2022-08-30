import { Injectable } from '@angular/core';
import { GIDDH_VOUCHER_FORM } from '../../app.constant';
import {
    ConfirmationModalButton,
    ConfirmationModalConfiguration,
} from '../../common/confirmation-modal/confirmation-modal.interface';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { VoucherForm } from '../../models/api-models/Voucher';

@Injectable({
    providedIn: 'any'
})
export class ProformaInvoiceUtilityService {

    /**
     * Returns the popup configuration for purchase record confirmation popup
     *
     * @returns {ConfirmationModalConfiguration} Popup configuration for purchase record confirmation popup
     * @memberof ProformaInvoiceUtilityService
     */
    public getPurchaseRecordConfirmationConfiguration(localeData: any, commonLocaleData: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            cssClass: 'btn btn-success'
        },
        {
            text: commonLocaleData?.app_no,
            cssClass: 'btn btn-danger'
        }];
        const headerText: string = localeData?.purchase_record_confirmation_heading;
        const headerCssClass: string = 'd-inline-block mr-1 purchase-record-confirm-header';
        const messageCssClass: string = 'mr-b1';
        const footerCssClass: string = 'mr-b1 text-light';
        return {
            headerText,
            headerCssClass,
            messageText: '<span class="mr-b1 text-light">' + localeData?.purchase_record_note1 + '</span><span class="mr-b1"> ' + localeData?.purchase_record_note2 + '<span>',
            messageCssClass,
            footerText: localeData?.purchase_record_footer_note,
            footerCssClass,
            buttons
        };
    }

    /**
     * Returns the transformed request object required for new voucher APIs
     *
     * @param {*} data Old request object
     * @return {*} {*} New request object
     * @memberof ProformaInvoiceUtilityService
     */
    public getVoucherRequestObjectForInvoice(data: any): any {
        data.type = this.parseVoucherType(data.type);
        if (data.account) {
            data.account.customerName = data.account.name;
            delete data.account.name;
            delete data.account.country;
            if (data.account.billingDetails) {
                data.account.billingDetails.taxNumber = (data.account.billingDetails.gstNumber) ? data.account.billingDetails.gstNumber : (data.account.billingDetails.taxNumber && data.uniqueName) ? data.account.billingDetails.taxNumber : "";
                data.account.billingDetails.country = {
                    code: data.account.billingDetails.countryCode,
                    name: data.account.billingDetails.countryName
                };
                delete data.account.billingDetails.gstNumber;
                delete data.account.billingDetails.stateCode;
                delete data.account.billingDetails.stateName;
                delete data.account.billingDetails.countryName;
                delete data.account.billingDetails.countryCode;
            }
            if (data.account.shippingDetails) {
                data.account.shippingDetails.taxNumber = (data.account.shippingDetails.gstNumber) ? data.account.shippingDetails.gstNumber : (data.account.shippingDetails.taxNumber && data.uniqueName) ? data.account.shippingDetails.taxNumber : "";
                data.account.shippingDetails.country = {
                    code: data.account.shippingDetails.countryCode,
                    name: data.account.shippingDetails.countryName
                };
                delete data.account.shippingDetails.gstNumber;
                delete data.account.shippingDetails.stateCode;
                delete data.account.shippingDetails.stateName;
                delete data.account.shippingDetails.countryName;
                delete data.account.shippingDetails.countryCode;
            }
        }
        if (data?.entries?.length) {
            // TODO: Remove this once the API issue is resolved
            data?.entries?.forEach(entry => {
                entry.discounts = entry?.discounts?.filter(discount => (discount?.name && discount?.particular) || discount?.discountValue);
                entry?.transactions?.forEach(transaction => {
                    if (transaction?.stock) {
                        transaction.stock.rate.rateForAccount = transaction.stock.rate?.amountForAccount;
                        delete transaction.stock.rate?.amountForAccount;
                    }
                });
            });
        }
        if(data?.company) {
            if (data.company.billingDetails) {
                data.company.billingDetails.taxNumber = data.company.billingDetails.gstNumber;
            }
            if (data.company.shippingDetails) {
                data.company.shippingDetails.taxNumber = data.company.shippingDetails.gstNumber;
            }
        }
        if([VoucherTypeEnum.debitNote, VoucherTypeEnum.creditNote].includes(data.type)) {
            data.number = data.invoiceNumberAgainstVoucher || data.number || '';
        }
        return data;
    }

    /**
     * Returns 'sales' because we don't have 'cash' as voucher type in api so we have to handle it manually
     *
     * @param {VoucherTypeEnum} voucher Voucher type
     * @return {string} Parsed voucher type
     * @memberof ProformaInvoiceUtilityService
     */
    public parseVoucherType(voucher: VoucherTypeEnum): string {
        if (voucher === VoucherTypeEnum.cash) {
            return VoucherTypeEnum.sales;
        }
        return voucher;
    }

    /**
     * Prepares the voucher form based on current voucher type
     *
     * @param {VoucherTypeEnum} voucherType Current voucher type
     * @param {*} [formConfiguration] If form configuration are loaded from the API
     * @return {VoucherForm} Voucher form configuration for current voucher
     * @memberof ProformaInvoiceUtilityService
     */
    public prepareVoucherForm(voucherType: VoucherTypeEnum, formConfiguration?: any): VoucherForm {
        if (formConfiguration) {
            return formConfiguration.find(form => form.type === voucherType);
        } else {
            return GIDDH_VOUCHER_FORM.find(form => form.type === voucherType);
        }
    }
}
