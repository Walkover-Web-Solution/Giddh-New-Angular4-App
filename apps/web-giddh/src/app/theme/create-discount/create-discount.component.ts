import { Component } from "@angular/core";

@Component({
    selector: "create-discount",
    templateUrl: "./create-discount.component.html",
    styleUrls: ["./create-discount.component.scss"]
})
export class CreateDiscountComponent {

    public dummyOptions: any[] = [
        { label: "Tax 1", value: 1 },
        { label: "Tax 2", value: 2 },
        { label: "Tax 3", value: 3 },
        { label: "Tax 4", value: 4 }
    ];
        
    public selectTax(event: any): void { }
}