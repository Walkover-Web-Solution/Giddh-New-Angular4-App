import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
  selector: 'setting-l-acc-confirmation-modal',
  templateUrl: './confirmation.modal.component.html'
})

export class SettingLinkedAccountsConfirmationModalComponent {

  @Input() public message: string;
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public onConfirmation() {
    this.closeModelEvent.emit(true);
  }

  public onCancel() {
    this.closeModelEvent.emit(false);
  }
}
