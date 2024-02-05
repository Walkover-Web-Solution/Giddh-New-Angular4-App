import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, ReplaySubject, takeUntil, of as observableOf } from "rxjs";
import { CreateDiscountComponentStore } from "./utility/create-discount.store";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "create-discount",
    templateUrl: "./create-discount.component.html",
    styleUrls: ["./create-discount.component.scss"],
    providers: [CreateDiscountComponentStore]
})
export class CreateDiscountComponent implements OnInit, OnDestroy {
    /** Discounts list Observable */
    public discountsAccountList$: Observable<any> = this.componentStore.discountsAccountList$;
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Form Group for invoice form */
    public createDiscountForm: UntypedFormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Hold selected country */
    public selectedDiscountAccount: string = '';
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Save discount state Observable */
    public saveDiscountDataInProgress$: Observable<boolean>;
    /** Save discount state Observable */
    public saveDiscountDataSuccess$: Observable<boolean>;

    constructor(private componentStore: CreateDiscountComponentStore,
        private formBuilder: UntypedFormBuilder,
        private generalService: GeneralService,
        public dialogRef: MatDialogRef<any>) {
            
        this.saveDiscountDataSuccess$ = this.componentStore.createDiscountSuccess$;
        this.saveDiscountDataInProgress$ = this.componentStore.createDiscountInProgress$;

        this.saveDiscountDataSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.createDiscountForm.reset();
            }
        });
    }
    /**
     * This will be use for component initialization
     *
     * @memberof CreateDiscountComponent
     */
    public ngOnInit(): void {
        this.getVoucherVersion();
        this.initDiscountForm();
        this.getDiscountAccounts();
    }

    /**
     * Gets voucher version
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private getVoucherVersion(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private initDiscountForm(): void {
        this.createDiscountForm = this.formBuilder.group({
            type: ['', Validators.required],
            name: ['', Validators.required],
            discountValue: ['', Validators.required],
            accountUniqueName: ['', Validators.required],
        });
    }

    /**
     * Gets company discount account list
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private getDiscountAccounts(): void {
        this.discountsAccountList$.pipe(takeUntil(this.destroyed$)).subscribe(discountsAccountList => {
            if (!discountsAccountList) {
                this.componentStore.getDiscountsAccountList();
            } else {
                this.discountsAccountList$ = observableOf(discountsAccountList);
            }

        });
    }
    /**
     * This will be use for reset and select discount account
     *
     * @param {*} event
     * @param {*} isClear
     * @memberof CreateDiscountComponent
     */
    public selectAccount(event: any, isClear: any): void {
        if (isClear) {
            this.createDiscountForm.reset();
        } else {
            this.createDiscountForm.get("linkedAccount")?.patchValue(event?.label);
        }
    }

    /**
     * This will be use for save discount 
     *
     * @return {*}  {void}
     * @memberof CreateDiscountComponent
     */
    public saveDiscount(): void {
        console.log(this.createDiscountForm)
        this.isFormSubmitted = false;
        if (this.createDiscountForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        this.componentStore.saveDiscount(this.createDiscountForm.value);
    }

    /**
     * This will be use for cancel discount popup
     *
     * @memberof CreateDiscountComponent
     */
    public cancelDiscount(): void {
        this.dialogRef.close();
    }

    /**
     * This will be use for clear discount
     *
     * @memberof CreateDiscountComponent
     */
    public clearDiscount(): void {
        this.createDiscountForm.reset();
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof CreateDiscountComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}