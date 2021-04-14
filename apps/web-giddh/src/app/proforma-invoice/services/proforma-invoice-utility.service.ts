import { Injectable } from '@angular/core';

import {
    ConfirmationModalButton,
    ConfirmationModalConfiguration,
} from '../../common/confirmation-modal/confirmation-modal.interface';

@Injectable({
    providedIn: 'root'
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
}
