import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'confirmation.model',
standalone: false,
    templateUrl: './confirmation.model.component.html'
})

export class DeleteManufacturingConfirmationModelComponent {

    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public onConfirmation() {
        this.closeModelEvent.emit(true);
    }

    public onCancel() {
        this.closeModelEvent.emit(false);
    }
}
