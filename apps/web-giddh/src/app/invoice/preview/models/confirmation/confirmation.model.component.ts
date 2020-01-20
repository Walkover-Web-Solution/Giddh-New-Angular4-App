import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';

@Component({
	selector: 'delete-role-confirmation-model',
	templateUrl: './confirmation.model.component.html'
})

export class DeleteInvoiceConfirmationModelComponent {

	@Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
	@Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

	public onConfirmation() {
		this.confirmDeleteEvent.emit(true);
	}

	public onCancel() {
		this.closeModelEvent.emit(true);
	}
}
