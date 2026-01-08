import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'setting-l-acc-confirmation-modal',
    templateUrl: './confirmation.modal.component.html'
})

export class SettingLinkedAccountsConfirmationModalComponent {

    @Input() public message: string;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public onConfirmation() {
        this.closeModelEvent.emit(true);
    }

    public onCancel() {
        this.closeModelEvent.emit(false);
    }
}
