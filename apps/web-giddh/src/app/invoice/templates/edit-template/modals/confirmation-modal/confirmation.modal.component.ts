import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
    selector: 'delete-template-confirmation-modal',
    templateUrl: './confirmation.modal.component.html'
})

export class DeleteTemplateConfirmationModelComponent {

    @Input() public message: string;
    @Input() public flag: string;
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter(null);

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
}
