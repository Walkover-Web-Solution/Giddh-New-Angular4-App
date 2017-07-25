import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'delete-role-confirmation-model',
  templateUrl: './confirmation.model.component.html'
})

export class DeleteRoleConfirmationModelComponent {

  @Input() public selectedRoleName: string;
  @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public onConfirmation() {
    this.confirmDeleteEvent.emit(true);
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
