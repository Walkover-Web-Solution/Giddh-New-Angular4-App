import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'delete-tax-confirmation-model',
    templateUrl: './confirmation.model.component.html'
})

export class DeleteTaxConfirmationModelComponent {

    @Input() public message: string;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public userConfirmationEvent: EventEmitter<boolean> = new EventEmitter(false);

    public onConfirmation() {
        this.userConfirmationEvent.emit(true);
    }

    public onCancel() {
        this.userConfirmationEvent.emit(false);
    }
}
