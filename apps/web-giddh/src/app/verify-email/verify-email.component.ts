import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { InvoiceService } from "../services/invoice.service";
import { PurchaseOrderService } from "../services/purchase-order.service";
import { ToasterService } from "../services/toaster.service";
import { GeneralService } from "../services/general.service";

/**
 * Handles Component functionality
 */
@Component({
    selector: "verify-email",
    templateUrl: "./verify-email.component.html",
    styleUrls: ["./verify-email.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:false
})
/**
 * VerifyEmailComponent component
 * Handles verifyemail functionality and user interactions
 */
export class VerifyEmailComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private invoiceService: InvoiceService,
        private purchaseOrderService: PurchaseOrderService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private generalService: GeneralService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof VerifyEmailComponent
     */
    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
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
        let apiObservable;

        /**
         * Handles if functionality
         */
        if (params?.module === "invoice") {
            apiObservable = this.invoiceService.verifyEmail(params);
        } else if (params?.module === "purchase") {
            apiObservable = this.purchaseOrderService.verifyEmail(params);
        }

        apiObservable?.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === "success") {
                this.toaster.showSnackBar("success", response?.body);
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
            this.emailVerificationCompleted(params);
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

    /**
     * This will do the after verification process
     *
     * @private
     * @param {*} params
     * @memberof VerifyEmailComponent
     */
    private emailVerificationCompleted(params: any): void {
        let redirect = "/pages/home";
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            /**
             * Handles if functionality
             */
            if (params?.module === "invoice") {
                // redirect = this.generalService.voucherApiVersion === 1 ? "/pages/invoice/preview/settings/sales" : "/pages/vouchers/preview/sales/settings";
                redirect = "/pages/vouchers/preview/sales/settings";
            } else if (params?.module === "purchase") {
                // redirect = this.generalService.voucherApiVersion === 1 ? "/pages/purchase-management/purchase/settings" : "/pages/vouchers/preview/purchase/settings";
                redirect = "/pages/vouchers/preview/purchase/settings";
            }
        }

        this.router.navigate([redirect]);
    }
}