import { Injectable } from '@angular/core';
import {
    ConfirmationModalButton,
    ConfirmationModalConfiguration,
} from '../../common/confirmation-modal/confirmation-modal.interface';

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
        if (data.account) {
            data.account.customerName = data.account.name;
            delete data.account.name;
            if (data.account.billingDetails) {
                data.account.billingDetails.taxNumber = data.account.billingDetails.gstNumber;
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
                data.account.shippingDetails.taxNumber = data.account.shippingDetails.gstNumber;
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
        return data;
    }
}
