import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'setting-l-acc-confirmation-modal',
    templateUrl: './confirmation.modal.component.html',
    standalone: false
})

/**
 * SettingLinkedAccountsConfirmationModalComponent component
 * Handles settinglinkedaccountsconfirmationmodal functionality and user interactions
 */
export class SettingLinkedAccountsConfirmationModalComponent {

    @Input() public message: string;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
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
