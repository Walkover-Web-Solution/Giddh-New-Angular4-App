import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';

@Component({
  selector: 'perform-action-on-invoice-model',
  templateUrl: './invoice.action.model.component.html'
})

export class PerformActionOnInvoiceModelComponent {

  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();

  public onConfirmation(amount) {
    this.closeModelEvent.emit(amount);
  }

  public onCancel() {
    this.closeModelEvent.emit(0);
  }
}
