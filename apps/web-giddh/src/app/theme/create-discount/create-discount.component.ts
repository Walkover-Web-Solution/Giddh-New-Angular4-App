import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, ReplaySubject, takeUntil, of as observableOf } from "rxjs";
import { CreateDiscountComponentStore } from "./utility/create-discount.store";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "create-discount",
    templateUrl: "./create-discount.component.html",
    styleUrls: ["./create-discount.component.scss"],
    providers: [CreateDiscountComponentStore]
})
export class CreateDiscountComponent implements OnInit, OnDestroy {
    /** Discounts list Observable */
    public discountsAccountList$: Observable<any> = observableOf(null);
    /** Form Group for invoice form */
    public createDiscountForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected country */
    public selectedDiscountAccount: string = '';
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Save discount state Observable */
    public createDiscountInProgress$: Observable<any> = this.componentStore.createDiscountInProgress$;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private componentStore: CreateDiscountComponentStore,
        private formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<any>) {
        
    }

    /**
     * This will be use for component initialization
     *
     * @memberof CreateDiscountComponent
     */
    public ngOnInit(): void {
        this.initDiscountForm();
        this.getDiscountAccounts();

        this.componentStore.createDiscountSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialogRef.close(true);
            }
        });
    }

    /**
     * Initializes discount form
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private initDiscountForm(): void {
        this.createDiscountForm = this.formBuilder.group({
            type: ['PERCENTAGE', Validators.required],
            name: ['', Validators.required],
            discountValue: ['', Validators.required],
            accountUniqueName: ['', Validators.required],
            accountName: ['']
        });
    }

    /**
     * Gets company discount account list
     *
     * @private
     * @memberof CreateDiscountComponent
     */
    private getDiscountAccounts(): void {
        this.componentStore.discountsAccountList$.pipe(takeUntil(this.destroyed$)).subscribe(discountsAccountList => {
            if (!discountsAccountList) {
                this.componentStore.getDiscountsAccountList();
            } else {
                this.discountsAccountList$ = observableOf(discountsAccountList);

                if (discountsAccountList?.length === 1) {
                    this.createDiscountForm.get('accountName')?.patchValue(discountsAccountList[0]?.label);
                    this.createDiscountForm.get('accountUniqueName')?.patchValue(discountsAccountList[0]?.value);
                }
            }
        });
    }

    /**
     * This will be use for reset and select discount account
     *
     * @memberof CreateDiscountComponent
     */
    public clearAccount(): void {
        this.createDiscountForm.get('accountUniqueName')?.patchValue('');
    }

    /**
     * This will be use for save discount 
     *
     * @return {*}  {void}
     * @memberof CreateDiscountComponent
     */
    public saveDiscount(): void {
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
        this.isFormSubmitted = false;
        this.createDiscountForm.get('type')?.patchValue('PERCENTAGE');
        this.createDiscountForm.get('name')?.patchValue('');
        this.createDiscountForm.get('discountValue')?.patchValue('');
        this.createDiscountForm.get('accountUniqueName')?.patchValue('');
        this.createDiscountForm.get('accountName')?.patchValue('');
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

    /**
     * Callback for select discount
     *
     * @param {*} event
     * @memberof CreateDiscountComponent
     */
    public selectDiscount(event: any): void {
        this.createDiscountForm.get('accountName')?.patchValue(event?.label);
    }
}