import { Injectable } from '@angular/core';
import { SettingsServiceModule } from '../settings-service.module';

@Injectable({
    providedIn: SettingsServiceModule
})
export class SettingsUtilityService {
    /** @ignore */
    constructor() { }

    /**
     * Returns the request object for warehouse create request
     *
     * @public
     * @param {*} formControls Form controls received from Welcome page
     * @param {Array<any>} taxDetails Tax details for warehouse creation
     * @returns {*} Request object for warehouse create request
     * @memberof WarehouseComponent
     */
    public getCreateWarehouseRequestObject(formControls: any, taxDetails: Array<any>): any {
        let taxType = '';
        if (taxDetails) {
            taxType = taxDetails['taxName'] ? taxDetails['taxName'].label : '';
        }
        return {
            name: (formControls.name) ? formControls.name.value : '',
            address: (formControls.address) ? formControls.address.value : '',
            countryCode: (formControls.country) ? formControls.country.value : '',
            currencyCode: (formControls.baseCurrency) ? formControls.baseCurrency.value : '',
            callingCode: (formControls.phoneCode) ? formControls.phoneCode.value : '',
            mobileNumber: (formControls.contactNo) ? formControls.contactNo.value : '',
            businessNature: (formControls.businessNature) ? formControls.businessNature.value : '',
            taxType,
            taxNumber: (formControls.gstNumber) ? formControls.gstNumber.value : '',
            stateCode: (formControls.state) ? formControls.state.value : ''
        };
    }
}
