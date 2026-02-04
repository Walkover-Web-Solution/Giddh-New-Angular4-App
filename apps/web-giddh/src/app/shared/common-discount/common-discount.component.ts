import { Component, ElementRef, OnDestroy, OnInit, ViewChild, input, output, effect, computed, signal, ChangeDetectorRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HIGH_RATE_FIELD_PRECISION } from '../../app.constant';
import { LedgerDiscountClass } from '../../models/api-models/SettingsDiscount';
import { giddhRoundOff } from '../helpers/helperFunctions';
import { cloneDeep, isEqual } from '../../lodash-optimized';
import { MatMenuTrigger, MenuCloseReason } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { DecimalDigitsModule } from '../helpers/directives/decimalDigits/decimalDigits.module';
import { A11yModule } from '@angular/cdk/a11y';
import { ClickOutsideModule } from 'ng-click-outside';

/**
 * Common Discount Component (Angular 21)
 * 
 * A reusable standalone component for managing discounts in ledger entries, vouchers, and invoices.
 * Converted from ledger-discount component to use Angular 21 signals API.
 * 
 * @example
 * <common-discount
 *   [commonLocaleData]="localeData"
 *   [discountAccountsDetails]="discounts"
 *   [amountForDiscount]="amount"
 *   [maskInput]="mask"
 *   [prefixInput]="prefix"
 *   [suffixInput]="suffix"
 *   [discountsList]="availableDiscounts"
 *   [giddhBalanceDecimalPlaces]="2"
 *   [readonly]="false"
 *   (discountTotalUpdated)="onDiscountUpdate($event)"
 *   (createNewDiscount)="onCreateNew()"
 *   (hideOtherPopups)="onHidePopups($event)"
 * ></common-discount>
 */
@Component({
    selector: 'common-discount',
    templateUrl: './common-discount.component.html',
    styleUrls: ['./common-discount.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatMenuModule,
        NgxMaskModule,
        FormFieldsModule,
        DecimalDigitsModule,
        A11yModule,
        ClickOutsideModule
    ]
})
export class CommonDiscountComponent implements OnInit, OnDestroy {

    /**
     * Gets the default discount (manual discount without uniqueName)
     */
    public defaultDiscount = computed<LedgerDiscountClass>(() => {
        const hasManualDiscount = this.discountAccounts()?.filter(selectedDiscount => !selectedDiscount?.uniqueName);
        return hasManualDiscount?.[0] ?? this.createDefaultManualDiscount();
    });

    /**
     * Creates a default manual discount object
     */
    private createDefaultManualDiscount(): LedgerDiscountClass {
        return Object.assign(new LedgerDiscountClass(), {
            discountValue: 0,
            amount: 0,
            discountType: 'PERCENTAGE',
            isActive: false
        });
    }

    /** Common locale data for translations (Angular 21 signal input) */
    public commonLocaleData = input<any>({});
    
    /** Array of discount account details (Angular 21 signal input) */
    public discountAccountsDetails = input<LedgerDiscountClass[]>([]);
    
    /** Internal writable signal for managing discounts (merged from inputs) */
    public discountAccounts = signal<LedgerDiscountClass[]>([]);
    
    /** Amount for discount calculation (Angular 21 signal input) */
    public amountForDiscount = input<number>(0);
    
    
    /** Emits when discount total is updated (Angular 21 signal output) */
    public discountTotalUpdated = output<number>();
    
    /** Current discount total value (writable signal) */
    public discountTotal = signal<number>(0);
    
    /** Flag to enable/disable percentage input (writable signal) */
    public discountFromPer = signal<boolean>(true);
    
    /** Flag to enable/disable fixed value input (writable signal) */
    public discountFromVal = signal<boolean>(true);
    
    /** Discount percentage modal value (writable signal) */
    public discountPercentageModal = signal<number>(0);
    
    /** Discount fixed value modal (writable signal) */
    public discountFixedValueModal = signal<number>(0);
    
    /** ViewChild reference to discount input element */
    @ViewChild('disInptEle', { static: true }) public disInptEle: ElementRef;
    
    /** ViewChild reference to mat menu trigger */
    @ViewChild(MatMenuTrigger) discountMenu: MatMenuTrigger;
    
    /** Flag to track if menu is opened (writable signal) */
    public isMenuOpened = signal<boolean>(false);
    
    /** Stores last saved discount values when menu opens (writable signal) */
    private lastSavedValues = signal<{ percentage: number, fixedValue: number, discounts: any[] } | null>(null);
    
    /** Input mask format (Angular 21 signal input) */
    public maskInput = input<string>('');
    
    /** Prefix for currency display (Angular 21 signal input) */
    public prefixInput = input<string>('');
    
    /** Suffix for currency display (Angular 21 signal input) */
    public suffixInput = input<string>('');

    /** RxJS subject for cleanup on component destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    
    /** List of available discounts (Angular 21 signal input) */
    public discountsList = input<any[]>([]);
    
    /** Company balance decimal places (Angular 21 signal input) */
    public giddhBalanceDecimalPlaces = input<number>(2);
    
    /** High precision rate constant for calculations */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    
    /** Readonly state flag (Angular 21 signal input) */
    public readonly = input<boolean>(false);
    
    /** Disabled state flag - prevents menu from opening (Angular 21 signal input) */
    public disabled = input<boolean>(false);
    
    /** Show create new discount option (Angular 21 signal input) */
    public showCreateNew = input<boolean>(true);
    
    /** Mat menu backdrop flag (Angular 21 signal input) */
    public hasBackdrop = input<boolean>(true);
    
    /** Currency symbol (Angular 21 signal input) */
    public currency = input<string>('');
    
    /** Show mat form field wrapper (Angular 21 signal input) - false shows plain input */
    public showMatFormField = input<boolean>(true);
    
    /** Emits when create new discount is clicked (Angular 21 signal output) */
    public createNewDiscount = output<boolean>();
    
    /** Emits to hide other popups (Angular 21 signal output) */
    public hideOtherPopups = output<boolean>();
    
    /** Emits selected discounts (Angular 21 signal output) */
    public selectedDiscountsEvent = output<any[]>();

    /** Previous state for tracking input changes */
    private previousDiscountData = {
        discountAccountsDetails: [] as LedgerDiscountClass[],
        discountsList: [] as any[],
        amountForDiscount: 0
    };

    /** Computed signal to track all discount-related inputs */
    private discountInputTracker = computed(() => {
        return {
            discountAccountsDetails: this.discountAccountsDetails() || [],
            discountsList: this.discountsList() || [],
            amountForDiscount: this.amountForDiscount() || 0
        };
    });

    constructor(private cdr: ChangeDetectorRef) {
        // Effect to track discount input changes and process them
        effect(() => {
            const discountData = cloneDeep(this.discountInputTracker());
            const discountAccountsChanged = !isEqual(discountData.discountAccountsDetails, this.previousDiscountData.discountAccountsDetails);
            const discountsListChanged = !isEqual(discountData.discountsList, this.previousDiscountData.discountsList);
            const amountForDiscountChanged = discountData.amountForDiscount !== this.previousDiscountData.amountForDiscount;

            
            if (discountAccountsChanged || amountForDiscountChanged || discountsListChanged) {
                this.previousDiscountData.discountAccountsDetails = discountData.discountAccountsDetails;
                this.previousDiscountData.amountForDiscount = discountData.amountForDiscount;
                this.previousDiscountData.discountsList = discountData.discountsList;
                this.processDiscountList();

                if (this.defaultDiscount() && this.defaultDiscount().discountType === 'FIX_AMOUNT') {
                    this.discountFixedValueModal.set(this.defaultDiscount().discountValue);
                } else if (this.defaultDiscount()) {
                    this.discountPercentageModal.set(this.defaultDiscount().discountValue);
                }
                    
                this.change();
            }
        }, { allowSignalWrites: true });
    }

    /**
     * Handles focus on last div for keyboard navigation
     * Moves focus to next focusable element in ledger panel
     * 
     * @param el - Event element
     * @returns false to prevent default behavior
     */
    public onFocusLastDiv(el): boolean {
        el.stopPropagation();
        el.preventDefault();
        let focussableElements = '.ledger-panel input[type=text]:not([disabled]),.ledger-panel [tabindex]:not([disabled]):not([tabindex="-1"])';
        let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
            (element) => {
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
            });
        let index = focussable?.indexOf(document.activeElement);
        if (index > -1) {
            let nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
        return false;
    }

    /**
     * Angular lifecycle hook - component initialization
     */
    public ngOnInit() {
        // Effect is now in constructor
    }

    /**
     * Processes discount list and adds new discounts to account details
     * Creates LedgerDiscountClass objects for each discount
     * 
     * @private
     */
    private processDiscountList(): void {
        const discountDetails = this.discountAccountsDetails();
        const discountsList = this.discountsList();
        
        // Initialize from discountAccountsDetails input if provided
        const accounts: LedgerDiscountClass[] = discountDetails?.length > 0 
            ? discountDetails.map(discount => ({
                ...discount,
                amount: discount.amount ?? discount.discountValue,
                isActive: discount.isActive ?? true,
                discountUniqueName: discount.discountUniqueName ?? discount.uniqueName,
                uniqueName: discount.discountUniqueName ?? discount.uniqueName,
            }))
            : [this.createDefaultManualDiscount()];
        // Use Set for O(1) lookup instead of array.some() for better performance
        const existingUniqueNames = new Set(
            accounts.map(acc => acc.discountUniqueName ?? acc.uniqueName).filter(Boolean)
        );
        if(discountsList?.length > 0) {
            // Add new discounts from discountsList that don't already exist
            discountsList?.forEach(acc => {
                if (!existingUniqueNames.has(acc?.uniqueName)) {
                    accounts.push(Object.assign(new LedgerDiscountClass(), {
                        discountValue: acc.discountValue,
                        amount: acc.discountValue,
                        discountType: acc.discountType,
                        isActive: false,
                        particular: acc.linkAccount?.uniqueName,
                        discountUniqueName: acc?.uniqueName,
                        uniqueName: acc?.uniqueName,
                        name: acc.name
                    }));
                }
            });
        }
        this.discountAccounts.set(accounts);
    }

    /**
     * Handles discount input from percentage or fixed value fields
     * Updates default discount and toggles between percentage/value modes
     * 
     * @param type - Discount type ('FIX_AMOUNT' or 'PERCENTAGE')
     * @param val - Input value as string
     */
    public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
        const cleanedValue = String(val || '')?.replace(/[^\d.]/g, '');
        const parsedValue = parseFloat(cleanedValue);
        
        const discount = this.defaultDiscount();
        discount.discountValue = parsedValue;
        discount.amount = discount.discountValue;
        discount.discountType = type;
        if (!val || !cleanedValue) {
            this.discountFromVal.set(true);
            this.discountFromPer.set(true);
            discount.isActive = false;
            this.change();
            return;
        }
        if (type === 'PERCENTAGE') {
            this.discountFromPer.set(true);
            this.discountFromVal.set(false);
        } else {
            this.discountFromPer.set(false);
            this.discountFromVal.set(true);
        }
        discount.isActive = true;
        this.change();
    }

    /**
     * Handles discount change events
     * Calculates total discount and emits update event
     * 
     * @param event - Change event (optional)
     * @param discount - Discount object (optional)
     * @param emitter - Flag to prevent emission (optional)
     */
    public change() {
        this.discountTotal.set(giddhRoundOff(this.generateTotal(), this.giddhBalanceDecimalPlaces()));
        this.discountTotalUpdated.emit(this.discountTotal());
    }

    /**
     * Gets all active discounts
     * Manual discount (without uniqueName) is always included at index 0
     * Other discounts are filtered by isActive condition
     * 
     * @returns Array of active discount accounts
     */
    public getActiveDiscounts(): LedgerDiscountClass[] {
        const accounts = this.discountAccounts();
        if (!accounts?.length) return [];
        
        const result: LedgerDiscountClass[] = [];
        accounts.forEach((discount, index) => {
            if (discount.isActive && discount.uniqueName) {
                result.push(discount);
            }
        });

        return [this.defaultDiscount(), ...result];
    }

    /**
     * Calculates total percentage discount value
     * 
     * @returns Sum of all active percentage discount values
     */
    public getTotalPercentageDiscount(): number {
        return this.getActiveDiscounts()
            .filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
    }

    /**
     * Calculates total fixed amount discount value
     * 
     * @returns Sum of all active fixed amount discount values
     */
    public getTotalFixedDiscount(): number {
        return this.getActiveDiscounts()
            .filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
    }

    /**
     * Generates total discount amount
     * Calculates sum of percentage and fixed amount discounts
     * 
     * @returns Total discount amount
     */
    public generateTotal(): number {
        const percentageListTotal = this.getTotalPercentageDiscount();
        const fixedListTotal = this.getTotalFixedDiscount();

        let perFromAmount = ((percentageListTotal * this.amountForDiscount()) / 100);
        return perFromAmount + fixedListTotal;
    }

    /**
     * TrackBy function for ngFor optimization
     * 
     * @param index - Array index
     * @returns Index value
     */
    public trackByFn(index) {
        return index;
    }

    /**
     * Toggles discount menu open/closed state
     * 
     * @param isCurrentlyOpen - Current state of menu (true if open, false if closed)
     */
    public toggleDiscountMenu(isCurrentlyOpen: boolean = false) {
        if (isCurrentlyOpen) {
            this.discountMenu?.closeMenu();
        } else {
            this.discountMenu?.openMenu();
        }
    }

    /**
     * Emits create new discount event
     */
    protected createNew(): void {
        this.discountMenu.closeMenu();
        this.createNewDiscount.emit(false);
    }
    
    /**
     * Handles menu opened event
     * Saves current discount values for potential restoration
     * Automatically focuses on the input field that has a value
     */
    public handleMenuOpened(): void {
        this.isMenuOpened.set(true);
        this.hideOtherPopups.emit(true);
        this.lastSavedValues.set({
            percentage: this.discountPercentageModal(),
            fixedValue: this.discountFixedValueModal(),
            discounts: this.discountAccountsDetails().map(d => ({ ...d }))
        });

        // Smart focus: Focus on field with value, default to percentage if both are zero
        setTimeout(() => {
            const percentageValue = this.discountPercentageModal();
            const fixedValue = this.discountFixedValueModal();
            
            if (fixedValue > 0) {
                // Focus on fixed value field if it has a value
                const fixedValueInput = document.getElementById('common-discount-value');
                fixedValueInput?.focus();
            } else if (percentageValue > 0) {
                // Focus on percentage field if it has a value
                const percentageInput = document.getElementById('common-discount-percent');
                percentageInput?.focus();
            } else {
                // Default to percentage field if both are zero
                const percentageInput = document.getElementById('common-discount-percent');
                percentageInput?.focus();
            }
        }, 100);
    }
    
    /**
     * Handles menu closed event
     * @param reason - Reason for menu closure
     */
    public handleMenuClosed(reason: MenuCloseReason): void {
        this.isMenuOpened.set(false);
        this.selectedDiscountsEvent.emit(this.getActiveDiscounts());
    }
    
    /**
     * Public method to close discount menu from parent component
     */
    public closeDiscountMenu(): void {
        if (this.discountMenu?.menuOpen) {
            this.discountMenu.closeMenu();
        }
    }

    /**
     * Handles click outside the discount menu to close it
     */
    public onClickOutside(): void {
        if (this.isMenuOpened()) {
            this.closeDiscountMenu();
        }
    }
    
    /**
     * Focuses next checkbox in the list for better keyboard navigation
     * @param target - Current checkbox element
     * @param currentIndex - Current checkbox index
     */
    public focusNextCheckbox(target: any, currentIndex: number): void {
        const nextIndex = currentIndex + 1;
        const nextCheckbox = document.querySelector(`[data-index="${nextIndex}"]`) as HTMLElement;
        if (nextCheckbox) {
            setTimeout(() => nextCheckbox.focus(), 100);
        }
    }

    /**
     * Focuses the discount dropdown input element
     * Used for keyboard navigation from parent components
     */
    public focusDiscountDropdown(): void {
        setTimeout(() => {
            const inputElement = document.getElementById('common-discount') as HTMLElement;
            if (inputElement) {
                inputElement.focus();
            }
        }, 100);
    }

    /**
     * Angular lifecycle hook - component cleanup
     * Completes RxJS subscriptions
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
