import { Component } from "@angular/core";

@Component({
    selector: "other-tax",
    templateUrl: "./other-tax.component.html",
    styleUrls: ["./other-tax.component.scss"]
})
export class OtherTaxComponent {
    public dummyOptions: any[] = [
        { label: "Tax 1", value: 1 },
        { label: "Tax 2", value: 2 },
        { label: "Tax 3", value: 3 },
        { label: "Tax 4", value: 4 }
    ];
        
    public selectTax(event: any): void {

    }
}