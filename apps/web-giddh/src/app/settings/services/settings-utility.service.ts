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
     * @returns {*} Request object for warehouse create request
     * @memberof SettingsUtilityService
     */
    public getCreateWarehouseRequestObject(formControls: any): any {
        return {
            name: (formControls.name) ? formControls.name.value : '',
            addresses: [{
                address: (formControls.address) ? formControls.address.value : '',
                stateCode: (formControls.state) ? formControls.state.value : '',
                isDefault: true
            }],
            isDefault: false,
            countryCode: (formControls.country) ? formControls.country.value : '',
            currencyCode: (formControls.baseCurrency) ? formControls.baseCurrency.value : '',
            callingCode: (formControls.phoneCode) ? formControls.phoneCode.value : '',
            mobileNumber: (formControls.contactNo) ? formControls.contactNo.value : ''
        };
    }

    /**
     * Returns the formatted warehouse data by appending 'label' and 'value' with
     * warehouse name and uniqueName respectively
     *
     * @param {Array<any>} warehouses Warehouse data received from the service
     * @returns {*} Formatted warehouse data
     * @memberof SettingsUtilityService
     */
    public getFormattedWarehouseData(warehouses: Array<any>): any {
        let defaultWarehouse: any = {};
        const formattedWarehouses = warehouses.map((warehouse: any) => {
            if (warehouse.isDefault) {
                defaultWarehouse = warehouse;
            }
            return { ...warehouse, label: warehouse.name, value: warehouse.uniqueName };
        });
        return { formattedWarehouses, defaultWarehouse };
    }
}
