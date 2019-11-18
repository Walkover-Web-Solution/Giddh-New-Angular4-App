import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'petty-cash-approve-confirm-dialog',
    templateUrl: './approve-petty-cash-entry-confirm-dialog.component.html'
})

export class ApprovePettyCashEntryConfirmDialogComponent implements OnInit {
    @Input() selectedEntryForApprove: any;
    @Input() approveEntryRequestInProcess: boolean;
    @Output() approveEntry: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }
}
