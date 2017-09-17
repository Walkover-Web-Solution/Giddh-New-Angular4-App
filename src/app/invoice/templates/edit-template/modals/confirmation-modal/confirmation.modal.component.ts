import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
  selector: 'delete-template-confirmation-modal',
  templateUrl: './confirmation.modal.component.html'
})

export class DeleteTemplateConfirmationModelComponent {

  @Input() public message: string;
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public onConfirmation() {
    this.closeModelEvent.emit(true);
  }

  public onCancel() {
    this.closeModelEvent.emit(false);
  }
}
