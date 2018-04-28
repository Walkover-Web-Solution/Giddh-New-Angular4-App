import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
  selector: 'delete-tax-confirmation-model',
  templateUrl: './confirmation.model.component.html'
})

export class DeleteTaxConfirmationModelComponent {

  @Input() public message: string;
  @Output() public userConfirmationEvent: EventEmitter<boolean> = new EventEmitter(false);

  public onConfirmation() {
    this.userConfirmationEvent.emit(true);
  }

  public onCancel() {
    this.userConfirmationEvent.emit(false);
  }
}
