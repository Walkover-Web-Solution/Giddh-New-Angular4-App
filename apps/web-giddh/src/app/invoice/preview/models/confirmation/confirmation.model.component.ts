import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import { confirmationMessages } from "../../../../shared/helpers/confirmationMessages";

@Component({
    selector: 'delete-role-confirmation-model',
    templateUrl: './confirmation.model.component.html'
})

export class DeleteInvoiceConfirmationModelComponent implements OnInit {
    @Input() public module: string = '';
    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public confirmationMessages: any[] = [];

    constructor() {

    }

    public ngOnInit() {
        confirmationMessages.map(c => {
            this.confirmationMessages[c.module] = c;
        });
    }

    public onConfirmation() {
        this.confirmDeleteEvent.emit(true);
    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }
}