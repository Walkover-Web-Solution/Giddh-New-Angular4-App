import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationModalConfiguration } from './confirmation-modal.interface';

@Component({
    selector: 'confirmation-modal',
    styleUrls: ['./confirmation-modal.component.scss'],
    templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {

    /** Confirmation modal configuration */
    @Input() configuration: ConfirmationModalConfiguration;
    /** Emits clicked button information */
    @Output() buttonClicked: EventEmitter<string> = new EventEmitter();

    /**
     * Button click handler
     *
     * @param {string} clickedButtonText Text of the clicked button
     * @memberof ConfirmationModalComponent
     */
    public handleButtonClick(clickedButtonText: string): void {
        this.buttonClicked.emit(clickedButtonText);
    }
}
