import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
    selector: 'delete-template-confirmation-modal',
    templateUrl: './confirmation.modal.component.html'
})

export class DeleteTemplateConfirmationModelComponent implements OnChanges {

    @Input() public message: string;
    @Input() public flag: string;
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter(null);
    public messageBody: string = '';
    public messageHeader: string = '';

    /** True, if message contails body and header message  */
    public isMessageTextOrHeading: boolean = false;

    public onConfirmation() {
        if (this.flag === 'closeConfirmation') {
            this.closeModelEvent.emit({ response: true, close: 'closeConfirmation' });
        } else {
            this.closeModelEvent.emit({ response: true, close: 'deleteConfirmation' });
        }
    }

    public onCancel() {
        if (this.flag === 'closeConfirmation') {
            this.closeModelEvent.emit({ response: false, close: 'closeConfirmation' });
        } else {
            this.closeModelEvent.emit({ response: false, close: 'deleteConfirmation' });
        }
    }

    /**
     * hook to detect input directive changes
     *
     * @param {SimpleChanges} changes params to detect simple changes
     *
     * @memberof DeleteTemplateConfirmationModelComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['flag'] && changes['flag'].currentValue) {
            if (changes['flag'].currentValue === 'text-paragraph') {
                this.isMessageTextOrHeading = true;
            } else {
                this.isMessageTextOrHeading = false;
            }
            if (changes['flag'].currentValue === 'text-paragraph' && changes['message'].currentValue) {
                let msg = changes['message'].currentValue.split('&');
                this.messageHeader = msg[0];
                this.messageBody = msg[1];
            }
        }
    }
}
