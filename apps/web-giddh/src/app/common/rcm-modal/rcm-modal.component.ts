import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RcmModalConfiguration } from './rcm-modal.interface';

@Component({
    selector: 'rcm-modal',
    styleUrls: ['./rcm-modal.component.scss'],
    templateUrl: './rcm-modal.component.html'
})
export class RcmModalComponent {

    /** RCM modal configuration */
    @Input() configuration: RcmModalConfiguration;
    /** Emits clicked button information */
    @Output() buttonClicked: EventEmitter<string> = new EventEmitter();

    /**
     * Button click handler
     *
     * @param {string} clickedButtonText Text of the clicked button
     * @memberof RcmModalComponent
     */
    public handleButtonClick(clickedButtonText: string): void {
        this.buttonClicked.emit(clickedButtonText);
    }
}
