import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "discount-dropdown",
    templateUrl: "./discount-dropdown.component.html",
    styleUrls: ["./discount-dropdown.component.scss"]
})
export class DiscountDropdownComponent {
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();

    public createNewDiscount(): void {
        this.createOption.emit();
    }
}