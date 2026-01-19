import { Component, Input } from "@angular/core";
import { TaxType } from "../utility/vouchers.const";

/**
 * Handles Component functionality
 */
@Component({
    selector: "full-address",
    templateUrl: "./full-address.component.html",
    styleUrls: ["./full-address.component.scss"],
    standalone: false
})
/**
 * FullAddressComponent component
 * Handles fulladdress functionality and user interactions
 */
export class FullAddressComponent {
    /** Address details */
    @Input() public address: any;
    /** Local translation */
    @Input() public localeData: any;
    /** Global translation */
    @Input() public commonLocaleData: any;
    /** Address Index */
    @Input() public addressNo: number;
    /** Company details */
    @Input() public company: any;
    /** Holds tax types */
    public taxTypes: any = TaxType;

    /**
     * Gets the address display text, showing name if available or address number as fallback
     *
     * @returns {string} The formatted address display text
     * @memberof FullAddressComponent
     */
    public getAddressDisplayText(): string {
        // If address has a name, use it; otherwise use addressNo
        const displayValue = this.address?.name || (this.addressNo ? `${this.commonLocaleData?.app_address} ${this.addressNo}` : '');
        
        return displayValue;
    }
}