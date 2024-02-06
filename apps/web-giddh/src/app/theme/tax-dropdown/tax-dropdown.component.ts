import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "tax-dropdown",
    templateUrl: "./tax-dropdown.component.html",
    styleUrls: ["./tax-dropdown.component.scss"]
})
export class TaxDropdownComponent {
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();

    public createNewDiscount(): void {
        this.createOption.emit();
    }
}