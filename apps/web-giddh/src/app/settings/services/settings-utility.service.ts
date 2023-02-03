import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
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
            name: (formControls.name) ? formControls.name?.value : '',
            addresses: [{
                address: (formControls.address) ? formControls.address?.value : '',
                stateCode: (formControls.state) ? formControls.state?.value : '',
                isDefault: true
            }],
            isDefault: false,
            countryCode: (formControls.country) ? formControls.country?.value : '',
            currencyCode: (formControls?.baseCurrency) ? formControls?.baseCurrency?.value : '',
            callingCode: (formControls.phoneCode) ? formControls.phoneCode?.value : '',
            mobileNumber: (formControls.contactNo) ? formControls.contactNo?.value : ''
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
            return { ...warehouse, label: warehouse?.name, value: warehouse?.uniqueName };
        });

        if(!defaultWarehouse?.uniqueName && formattedWarehouses?.length > 0) {
            defaultWarehouse = formattedWarehouses[0];
        }

        return { formattedWarehouses, defaultWarehouse };
    }

    /**
     * Returns the formatted company addresses
     *
     * @param {Array<any>} response Response received from API
     * @returns {Array<any>} Formatted address
     * @memberof SettingsUtilityService
     */
    public getFormattedCompanyAddresses(response: Array<any>): Array<any> {
        const formattedCompanyAddresses = [];
        response.forEach(address => {
            formattedCompanyAddresses.push({
                taxType: address.taxType,
                stateCode: address.stateCode,
                pincode: address.pincode,
                stateName: address.stateName,
                taxNumber: address.taxNumber,
                address: address.address,
                name: address.name,
                uniqueName: address?.uniqueName,
                linkedEntities: this.getLinkedEntities(address)
            });
        });
        return formattedCompanyAddresses;
    }

    /**
     * Returns the formatted branch addresses
     *
     * @param {Array<any>} response API response
     * @returns {Array<any>} Formatted address
     * @memberof SettingsUtilityService
     */
    public getFormattedBranchAddresses(response: Array<any>): Array<any> {
        const formattedCompanyAddresses = [];
        if (response) {
            response.forEach(address => {
                formattedCompanyAddresses.push({
                    stateCode: address.stateCode,
                    stateName: address.stateName,
                    pincode: address.pincode,
                    taxNumber: address.taxNumber,
                    taxType: address.taxType,
                    address: address.address,
                    isDefault: address.isDefault,
                    name: address.name,
                    uniqueName: address?.uniqueName,
                });
            });
        }
        return formattedCompanyAddresses;
    }

    /**
     * Retuns update branch request object
     *
     * @param {*} branchDetails Branch details
     * @returns {*} Update branch request object
     * @memberof SettingsUtilityService
     */
    public getUpdateBranchRequestObject(branchDetails: any): any {
        branchDetails.addresses = branchDetails.addresses || [];
        return {
            name: branchDetails.name,
            alias: branchDetails.alias,
            linkAddresses: (branchDetails.addresses && branchDetails.addresses.length > 0) ? branchDetails.addresses.map(address => ({ uniqueName: address?.uniqueName, isDefault: address.isDefault })) : []
        };
    }

    /**
     * Returns the formatted linked entities
     *
     * @private
     * @param {*} address Address
     * @returns {Array<any>} Formatted linked entities
     * @memberof SettingsUtilityService
     */
    private getLinkedEntities(address: any): Array<any> {
        const linkedEntities = [];
        if (address.branches && address.branches.length) {
            address.branches.forEach(branch => {
                linkedEntities.push({
                    ...branch,
                    isBranch: true
                })
            });
        }
        if (address.warehouses && address.warehouses.length) {
            address.warehouses.forEach(warehouse => {
                linkedEntities.push({
                    ...warehouse,
                    isWarehouse: true
                })
            });
        }
        return linkedEntities;
    }
}
