import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'delete-tax-confirmation-model',
    templateUrl: './confirmation.model.component.html',
    standalone: false
})

/**
 * DeleteTaxConfirmationModelComponent component
 * Handles deletetaxconfirmationmodel functionality and user interactions
 */
export class DeleteTaxConfirmationModelComponent {

    @Input() public message: string;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public userConfirmationEvent: EventEmitter<boolean> = new EventEmitter(false);

    /**
     * Handles confirmation event
     */
    public onConfirmation() {
        this.userConfirmationEvent.emit(true);
    }

    /**
     * Handles cancel event
     */
    public onCancel() {
        this.userConfirmationEvent.emit(false);
    }
}
