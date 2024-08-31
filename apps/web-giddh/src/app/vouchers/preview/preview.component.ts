import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SendEmailInvoiceComponent } from "../../shared/send-email-invoice/send-email-invoice.component";
import { RevisionHistoryComponent } from "../../shared/revision-history/revision-history.component";
import { ActivatedRoute } from "@angular/router";
import { delay, ReplaySubject, takeUntil } from "rxjs";

@Component({
    selector: "preview",
    templateUrl: "./preview.component.html",
    styleUrls: ["./preview.component.scss"]
})
export class VouchersPreviewComponent implements OnInit, OnDestroy {
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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
    ) { }

  
     /**
     * Initializes the component
     *
     * @memberof VoucherListComponent
     */
     public ngOnInit(): void {
        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                // console.log(params?.voucherType);
            }
        });
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


    /**
     * Lifecycle hook for destroy
     *
     * @memberof VoucherListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}