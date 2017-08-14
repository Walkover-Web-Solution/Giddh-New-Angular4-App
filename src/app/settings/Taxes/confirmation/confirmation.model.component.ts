import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
  selector: 'delete-tax-confirmation-model',
  templateUrl: './confirmation.model.component.html'
})

export class DeleteTaxConfirmationModelComponent {

  @Input() public selectedTaxForDelete: string;
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(false);

  public onConfirmation() {
    this.confirmDeleteEvent.emit(true);
  }

  public onCancel() {
    this.confirmDeleteEvent.emit(false);
  }
}
