import { Component, Input } from "@angular/core";
import { TaxType } from "../utility/vouchers.const";

@Component({
    selector: "full-address",
    templateUrl: "./full-address.component.html",
    styleUrls: ["./full-address.component.scss"]
})
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
}