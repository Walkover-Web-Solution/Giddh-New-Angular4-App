import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
  selector: 'delete-manufacturing-confirmation-modal',
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
