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
    public getPurchaseRecordConfirmationConfiguration(): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: 'Yes',
            cssClass: 'btn btn-success'
        },
        {
            text: 'No',
            cssClass: 'btn btn-danger'
        }];
        const headerText: string = 'Purchase Record Confirmation';
        const headerCssClass: string = 'd-inline-block mr-1 purchase-record-confirm-header';
        const messageCssClass: string = 'mrB1';
        const footerCssClass: string = 'mrB1 text-light';
        return {
            headerText,
            headerCssClass,
            messageText: `<span class="mrB1 text-light">You have already created a purchase record with the same invoice number, invoice date and vendor details.</span><span class="mrB1"> Do you want to merge this transaction with the previous one?<span>`,
            messageCssClass,
            footerText: 'If no then change either purchase invoice number or vendor details.',
            footerCssClass,
            buttons
        };
    }
}
