import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { InvoiceService } from "../services/invoice.service";
import { ToasterService } from "../services/toaster.service";

@Component({
    selector: "verify-email",
    templateUrl: "./verify-email.component.html",
    styleUrls: ["./verify-email.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private invoiceService: InvoiceService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof VerifyEmailComponent
     */
    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.verifyEmail(response);
            }
        });
    }

    /**
     * Verifies the email
     *
     * @param {*} params
     * @memberof VerifyEmailComponent
     */
    public verifyEmail(params: any): void {
        this.invoiceService.verifyEmail(params).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toaster.showSnackBar("success", response?.body);
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
            this.router.navigate([params.redirect]);
        });
    }

    /**
     * Releases the memory
     *
     * @memberof VerifyEmailComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}