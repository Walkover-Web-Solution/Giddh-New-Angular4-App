import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'delete-manufacturing-confirmation-modal',
    templateUrl: './confirmation.model.component.html',
    standalone:false
})

/**
 * DeleteManufacturingConfirmationModelComponent component
 * Handles deletemanufacturingconfirmationmodel functionality and user interactions
 */
export class DeleteManufacturingConfirmationModelComponent {

    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    /**
     * Handles confirmation event
     */
    public onConfirmation() {
        this.closeModelEvent.emit(true);
    }

    /**
     * Handles cancel event
     */
    public onCancel() {
        this.closeModelEvent.emit(false);
    }
}
