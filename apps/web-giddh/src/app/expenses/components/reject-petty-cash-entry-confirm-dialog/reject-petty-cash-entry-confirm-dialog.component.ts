import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActionPettycashRequest, ExpenseActionRequest, ExpenseResults } from "../../../models/api-models/Expences";
import { ExpenseService } from "../../../services/expences.service";
import { ToasterService } from "../../../services/toaster.service";

@Component({
    selector: "petty-cash-reject-confirm-dialog",
    templateUrl: "./reject-petty-cash-entry-confirm-dialog.component.html"
})
export class RejectPettyCashEntryConfirmDialogComponent implements OnInit, OnDestroy {
    @Input() public selectedItem: ExpenseResults;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emits boolean based on reject completed or not */
    @Output() rejectEntry: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** This will hold creator name */
    public byCreator: string = '';
    /** Form control for the reject reason field */
    public rejectReason = new FormControl();
    /** Post body for the api request */
    public actionPettyCashRequestBody: ExpenseActionRequest;
    /** Data for query params */
    public actionPettyCashRequest: ActionPettycashRequest = new ActionPettycashRequest();
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private expenseService: ExpenseService,
        private toaster: ToasterService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof RejectPettyCashEntryConfirmDialogComponent
     */
    public ngOnInit(): void {
        this.buildCreatorString();
    }

    /**
     * Destroyes the component
     *
     * @memberof RejectPettyCashEntryConfirmDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Submits the reject request
     *
     * @memberof RejectPettyCashEntryConfirmDialogComponent
     */
    public submitReject(): void {
        this.actionPettyCashRequestBody = new ExpenseActionRequest();
        this.actionPettyCashRequestBody.message = this.rejectReason?.value;
        this.actionPettyCashRequest.actionType = 'reject';
        this.actionPettyCashRequest.uniqueName = this.selectedItem?.uniqueName;
        this.actionPettyCashRequest.accountUniqueName = this.selectedItem.particularAccount?.uniqueName

        this.expenseService.actionPettycashReports(this.actionPettyCashRequest, this.actionPettyCashRequestBody).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.toaster.showSnackBar("success", res?.body);
                this.rejectEntry.emit(true);
            } else {
                this.toaster.showSnackBar("error", res?.body ?? res?.message);
                this.rejectEntry.emit(false);
            }
        });
    }

    /**
     * This will build the creator name string
     *
     * @memberof RejectPettyCashEntryConfirmDialogComponent
     */
    public buildCreatorString(): void {
        if (this.selectedItem && this.selectedItem.createdBy) {
            this.byCreator = this.localeData?.by_creator;
            this.byCreator = this.byCreator?.replace("[CREATOR_NAME]", this.selectedItem.createdBy.name);
        } else {
            this.byCreator = "";
        }
    }
}
