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
    /** Amount for discount */
    @Input() public amount: any;
    /** Callback for create new option selected */
    @Output() public createOption: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Form Group for invoice form */
    public discountForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to calculate discount value based on selected discounts */
    private allowDiscountValueChanges: boolean = false;
    /** Total discount amount */
    public totalDiscountAmount: any = '0';

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.discountForm = this.formBuilder.group({
            percentage: [''],
            fixedValue: [''],
            discounts: this.formBuilder.array([])
        });
    }

    public ngOnInit(): void {
        this.discountForm.get('discounts')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.discountsList?.currentValue) {
            this.addDiscountsInForm();
        }
    }

    public ngOnDestroy(): void {

    }

    private addDiscountsInForm(): void {
        const discounts = this.discountForm.get('discounts') as FormArray;
        this.discountsList.forEach(discount => {
            discounts.push(this.getDiscountFormGroup(discount));
        });
        this.allowDiscountValueChanges = true;
        this.calculateDiscountAmount();
    }

    private getDiscountFormGroup(discount: any): FormGroup {
        return this.formBuilder.group({
            name: [discount?.name],
            uniqueName: [discount?.uniqueName],
            discountType: [discount?.discountType],
            discountValue: [discount?.discountValue],
            isActive: [false]
        });
    }

    private calculateDiscountAmount(): void {
        this.totalDiscountAmount = 0;
        const discounts = this.discountForm.get('discounts') as FormArray;
        for (let i = 0; i <= discounts.length; i++) {
            if (discounts.get('isActive')?.value) {
                if (discounts.get('discountType')?.value === 'FIX_AMOUNT') {
                    this.totalDiscountAmount += Number(this.amount) - Number(discounts.get('discountValue')?.value);
                } else {
                    this.totalDiscountAmount += Number(this.amount) - ((Number(discounts.get('discountValue')?.value) / Number(this.amount)) * 100);
                }
            }
        }
    }

    public createNewDiscount(): void {
        this.createOption.emit();
    }
}