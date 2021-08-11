import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'petty-cash-approve-confirm-dialog',
    templateUrl: './approve-petty-cash-entry-confirm-dialog.component.html'
})

export class ApprovePettyCashEntryConfirmDialogComponent implements OnInit {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() selectedEntryForApprove: any;
    @Input() approveEntryRequestInProcess: boolean;
    /** This holds Entry object */
    @Input() public pettyCashEntry: any = null;
    /** This holds Entry against object */
    @Input() public entryAgainstObject: any = null;
    @Output() approveEntry: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** This will hold creator name */
    public byCreator: string = '';

    constructor() {
    }

    public ngOnInit(): void {
        this.buildCreatorString();
    }

    /**
     * This will build the creator name string
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public buildCreatorString(): void {
        if (this.selectedEntryForApprove && this.selectedEntryForApprove.createdBy) {
            this.byCreator = this.localeData?.by_creator;
            this.byCreator = this.byCreator.replace("[CREATOR_NAME]", this.selectedEntryForApprove.createdBy.name);
        } else {
            this.byCreator = "";
        }
    }
}
