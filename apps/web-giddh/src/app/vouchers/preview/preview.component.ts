import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SendEmailInvoiceComponent } from "../../shared/send-email-invoice/send-email-invoice.component";
import { RevisionHistoryComponent } from "../../shared/revision-history/revision-history.component";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"]
})
export class VouchersPreviewComponent {
    /** Instance of cdk scrollbar */
    @ViewChild(CdkVirtualScrollViewport) cdkScrollbar: CdkVirtualScrollViewport;
    // export dialog
    @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    // adjust payment dialog
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    // history dialog
    @ViewChild('historyAsideDialog', { static: true }) public historyAsideDialog: TemplateRef<any>;
    // email dialog
    @ViewChild('emailSendDialog', { static: true }) public emailSendDialog: TemplateRef<any>;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    constructor(
        public dialog: MatDialog
    ) {

    }
    // paid dialog
    public onPerformAction():void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // adjust payment dialog
    public adjustPayment():void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // email send dialog
    public openEmailSendDialog():void {
        this.dialog.open(this.emailSendDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // history dialog
    public toggleActivityHistoryAsidePane():void {
        this.dialog.open(this.historyAsideDialog, {
            position: {
                right: '0'
            },
            maxWidth: '760px',
            width: '100%',
            height: '100vh',
            maxHeight: '100vh'
        });
    }
}