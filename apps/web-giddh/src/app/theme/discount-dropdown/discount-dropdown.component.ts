import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ReplaySubject, takeUntil } from "rxjs";

@Component({
    selector: "discount-dropdown",
    templateUrl: "./discount-dropdown.component.html",
    styleUrls: ["./discount-dropdown.component.scss"]
})
export class DiscountDropdownComponent implements OnInit, OnChanges, OnDestroy {
    /** List of discounsts */
    @Input() public discountsList: any[] = [];
    /** List of discounsts */
    @Input() public selectedDiscountsList: any[] = [];
    /** Amount for discount */
    @Input() public amount: any;
    /** Account currency */
    @Input() public currency: any;
    /** Callback for create new discount */
    @Output() public createNewDiscount: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Callback for create new discount */
    @Output() public selectedDiscounts: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Form Group for invoice form */
    public discountForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to calculate discount value based on selected discounts */
    private allowDiscountValueChanges: boolean = false;
    /** Total discount amount */
    public totalDiscountAmount: number = 0;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.discountForm = this.formBuilder.group({
            percentage: [''],
            fixedValue: [''],
            discounts: this.formBuilder.array([])
        });
    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof DiscountDropdownComponent
     */
    public ngOnInit(): void {
        this.discountForm.get('discounts')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });

        this.discountForm.get('percentage')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });

        this.discountForm.get('fixedValue')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });
    }

    /**
     * Lifecycle hook for input value changes
     *
     * @param {SimpleChanges} changes
     * @memberof DiscountDropdownComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.selectedDiscountsList?.currentValue) {
            const hasManualDiscount = this.selectedDiscountsList?.filter(selectedDiscount => !selectedDiscount?.uniqueName);
            if (hasManualDiscount?.length) {
                if (hasManualDiscount[0].calculationMethod === 'FIX_AMOUNT') {
                    this.discountForm.get('fixedValue').patchValue(hasManualDiscount[0].discountValue);
                } else {
                    this.discountForm.get('percentage').patchValue(hasManualDiscount[0].discountValue);
                }
            }
        }
        if (changes?.discountsList?.currentValue) {
            this.addDiscountsInForm();
        }
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof DiscountDropdownComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Adds discounts in form group
     *
     * @private
     * @memberof DiscountDropdownComponent
     */
    private addDiscountsInForm(): void {
        const discounts = this.discountForm.get('discounts') as FormArray;
        this.discountsList.forEach(discount => {
            const isDiscountSelected = this.selectedDiscountsList?.filter(selectedDiscount => selectedDiscount?.uniqueName === discount.uniqueName);
            discount.isActive = isDiscountSelected?.length > 0;
            discounts.push(this.getDiscountFormGroup(discount));
        });
        this.allowDiscountValueChanges = true;
        this.calculateDiscountAmount();
    }

    /**
     * Returns discount form group
     *
     * @private
     * @param {*} discount
     * @return {*}  {FormGroup}
     * @memberof DiscountDropdownComponent
     */
    private getDiscountFormGroup(discount: any): FormGroup {
        return this.formBuilder.group({
            name: [discount?.name],
            uniqueName: [discount?.uniqueName],
            discountType: [discount?.discountType],
            discountValue: [discount?.discountValue],
            isActive: [discount.isActive ?? false]
        });
    }

    /**
     * Calculates discount
     *
     * @private
     * @memberof DiscountDropdownComponent
     */
    private calculateDiscountAmount(): void {
        this.totalDiscountAmount = 0;

        this.totalDiscountAmount += this.discountForm.get('fixedValue')?.value ? Number(this.discountForm.get('fixedValue')?.value) : 0;
        this.totalDiscountAmount += this.discountForm.get('percentage')?.value ? ((Number(this.discountForm.get('percentage')?.value) / Number(this.amount)) * 100) : 0;

        const discounts = this.discountForm.get('discounts') as FormArray;
        for (let i = 0; i <= discounts.length; i++) {
            if (discounts.controls[i]?.get('isActive')?.value) {
                if (discounts.controls[i].get('discountType')?.value === 'FIX_AMOUNT') {
                    this.totalDiscountAmount += Number(discounts.controls[i].get('discountValue')?.value);
                } else {
                    this.totalDiscountAmount += ((Number(discounts.controls[i].get('discountValue')?.value) / Number(this.amount)) * 100);
                }
            }
        }

        this.emitSelectedDiscounts();
    }

    /**
     * Emits selected discounts
     *
     * @memberof DiscountDropdownComponent
     */
    public emitSelectedDiscounts(): void {
        const discounts = this.discountForm.get('discounts') as FormArray;
        let selectedDiscounts = discounts.value?.filter(discount => discount.isActive);

        if (this.discountForm.get('fixedValue')?.value) {
            selectedDiscounts.unshift(this.getFixedDiscountObject(this.discountForm.get('fixedValue')?.value, 'FIX_AMOUNT'));
        } else if (this.discountForm.get('percentage')?.value) {
            selectedDiscounts.unshift(this.getFixedDiscountObject(this.discountForm.get('percentage')?.value, 'PERCENTAGE'));
        }

        this.selectedDiscounts.emit(selectedDiscounts);
    }

    /**
     * Returns fixed discount object
     *
     * @private
     * @param {number} discountValue
     * @param {string} discountType
     * @return {*}  {*}
     * @memberof DiscountDropdownComponent
     */
    private getFixedDiscountObject(discountValue: number, discountType: string): any {
        return {
            name: "",
            uniqueName: "",
            discountType: discountType,
            discountValue: discountValue,
            isActive: true
        };
    }

    /**
     * Emits create new discount event
     *
     * @memberof DiscountDropdownComponent
     */
    public createNew(): void {
        this.createNewDiscount.emit();
    }
}