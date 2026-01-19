import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { KeyboardNavigationHelper } from '../helpers/keyboard-navigation.helper';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ReplaySubject, takeUntil } from "rxjs";
import { isEqual } from "../../lodash-optimized";
import { GeneralService } from "../../services/general.service";
import { MatMenuTrigger, MenuCloseReason } from "@angular/material/menu";

/**
 * Handles Component functionality
 */
@Component({
    selector: "discount-dropdown",
    templateUrl: "./discount-dropdown.component.html",
    styleUrls: ["./discount-dropdown.component.scss"],
    standalone: false
})
/**
 * DiscountDropdownComponent component
 * Handles discountdropdown functionality and user interactions
 */
export class DiscountDropdownComponent implements OnInit, OnChanges, OnDestroy {
    /** Element ref for mat menu */
    @ViewChild('menuTrigger') public menuTrigger: MatMenuTrigger;
    /** Element ref for discount input */
    @ViewChild('discountInput') public discountInput: ElementRef<HTMLInputElement>;
    /** List of discounsts */
    @Input() public discountsList: any[] = [];
    /** List of selected discounts */
    @Input() public selectedDiscountsList: any[] = [];
    /** Amount for discount */
    @Input() public amount: any;
    /** Holds active company decimal place 2 or 4 */
    @Input() public companyDecimalPlaces: number = 2;
    /** Account currency */
    @Input() public currency: any;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Holds true to show Create new discount option */
    @Input() public showCreateNew: boolean = true;
    /* Holds true to show mat menu with backdrop */
    @Input() public hasBackdrop: boolean = true;
    /** Emitter for create new discount */
    @Output() public createNewDiscount: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emitter for selected discounts */
    @Output() public selectedDiscounts: EventEmitter<any> = new EventEmitter<any>();
    /** Emitter for discount total */
    @Output() public totalDiscount: EventEmitter<any> = new EventEmitter<any>();
    /** Emitter for close discount dropdown */
    @Output() public closeDiscountDropdown: EventEmitter<any> = new EventEmitter<any>();
    /** Form Group for discount form */
    public discountForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to calculate discount value based on selected discounts */
    private allowDiscountValueChanges: boolean = false;
    /** Total discount amount */
    public totalDiscountAmount: number = 0;
    /** True if field is readonly */
    @Input() public readonly: boolean = false;
    /** Stores last saved form values when menu opens */
    private lastSavedFormValues: any = null;

    public isMenuOpened: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private formBuilder: FormBuilder,
        private generalService: GeneralService
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
            /**
             * Handles if functionality
             */
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });

        this.discountForm.get('percentage')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            /**
             * Handles if functionality
             */
            if (this.allowDiscountValueChanges) {
                this.calculateDiscountAmount();
            }
        });

        this.discountForm.get('fixedValue')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if ((!isEqual(changes?.selectedDiscountsList?.currentValue, changes?.selectedDiscountsList?.previousValue)) || (!isEqual(changes?.amount?.currentValue, changes?.amount?.previousValue))) {
            const hasManualDiscount = this.selectedDiscountsList?.filter(selectedDiscount => !selectedDiscount?.uniqueName);
            /**
             * Handles if functionality
             */
            if (hasManualDiscount?.length && hasManualDiscount[0]) {
                /**
                 * Handles if functionality
                 */
                if (hasManualDiscount[0]?.calculationMethod === 'FIX_AMOUNT') {
                    this.discountForm.get('fixedValue').patchValue(hasManualDiscount[0]?.discountValue);
                } else {
                    this.discountForm.get('percentage').patchValue(hasManualDiscount[0]?.discountValue);
                }
            }
            this.addDiscountsInForm();
        }
        /**
         * Handles if functionality
         */
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
        discounts?.clear();
        this.discountsList?.forEach(discount => {
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
        this.totalDiscountAmount += this.discountForm.get('percentage')?.value ? ((Number(this.discountForm.get('percentage')?.value) / 100) * Number(this.amount)) : 0;

        const discounts = this.discountForm.get('discounts') as FormArray;
        /**
         * Handles for functionality
         */
        for (let i = 0; i < discounts.length; i++) {
            /**
             * Handles if functionality
             */
            if (discounts.controls[i]?.get('isActive')?.value) {
                /**
                 * Handles if functionality
                 */
                if (discounts.controls[i].get('discountType')?.value === 'FIX_AMOUNT') {
                    this.totalDiscountAmount += Number(discounts.controls[i].get('discountValue')?.value);
                } else {
                    this.totalDiscountAmount += ((Number(discounts.controls[i].get('discountValue')?.value) / 100) * Number(this.amount));
                }
            }
        }
        this.totalDiscountAmount = this.generalService.roundOffValueByCompanyDecimalPlace(this.totalDiscountAmount, this.companyDecimalPlaces);

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

        /**
         * Handles if functionality
         */
        if (this.discountForm.get('fixedValue')?.value) {
            selectedDiscounts.unshift(this.getFixedDiscountObject(this.discountForm.get('fixedValue')?.value, 'FIX_AMOUNT'));
        } else if (this.discountForm.get('percentage')?.value) {
            selectedDiscounts.unshift(this.getFixedDiscountObject(this.discountForm.get('percentage')?.value, 'PERCENTAGE'));
        }

        this.selectedDiscounts.emit(selectedDiscounts);
        this.totalDiscount.emit(this.totalDiscountAmount);
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

    /**
     * Close discount menu
     *
     * @memberof DiscountDropdownComponent
     */
    public closeDiscountMenu(): void {
        this.menuTrigger?.closeMenu();
    }

    /**
     * Handles menu opened event and saves current form values
     *
     * @memberof DiscountDropdownComponent
     */
    public handleMenuOpened(): void {
        this.lastSavedFormValues = {
            percentage: this.discountForm.get('percentage')?.value,
            fixedValue: this.discountForm.get('fixedValue')?.value,
            discounts: this.discountForm.get('discounts')?.value
        };

        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.isMenuOpened = true;
        }, 100);
    }

    /**
     * Handles menu closed event and resets menu state
     *
     * @param reason The reason the menu was closed
     * @memberof DiscountDropdownComponent
     */
    public handleMenuClosed(reason: MenuCloseReason): void {
        /**
         * Handles if functionality
         */
        if (!reason) return;
        this.isMenuOpened = false;
        const isClosedByEscape = reason === 'keydown';   
        /**
         * Handles if functionality
         */
        if (isClosedByEscape && this.lastSavedFormValues) {
            this.allowDiscountValueChanges = false;
            this.discountForm.patchValue({
                percentage: this.lastSavedFormValues.percentage,
                fixedValue: this.lastSavedFormValues.fixedValue
            });
            
            const discountsArray = this.discountForm.get('discounts') as FormArray;
            this.lastSavedFormValues.discounts?.forEach((discount: any, index: number) => {
                /**
                 * Handles if functionality
                 */
                if (discountsArray.controls[index]) {
                    discountsArray.controls[index].patchValue(discount);
                }
            });
            
            this.allowDiscountValueChanges = true;
            this.calculateDiscountAmount();
        }
        this.lastSavedFormValues = null;
    }

    /**
     * Emits close discount dropdown event with the trigger element
     *
     * @memberof DiscountDropdownComponent
     */
    protected emitCloseDiscountDropdown(): void {
        // Always emit close event for focus management
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            const triggerElement = this.discountInput?.nativeElement || null;
            const syntheticEvent = {
                target: triggerElement
            };
            this.closeDiscountDropdown.emit(syntheticEvent);
        }, 50);
    }

    /**
     * Focuses the next available checkbox in the discount list
     *
     * @param {HTMLElement} currentElement - The currently focused checkbox element
     * @param {number} currentIndex - The index of the current checkbox
     * @memberof DiscountDropdownComponent
     */
    public handleTabNavigation(event: KeyboardEvent): void {
        KeyboardNavigationHelper.handleTabNavigation(event);
    }

    /**
     * Focuses the discount dropdown input element
     *
     * @memberof DiscountDropdownComponent
     */
    public focusDiscountDropdown(): void {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.discountInput?.nativeElement) {
                this.discountInput.nativeElement.focus();
            }
        }, 100);
    }
}
