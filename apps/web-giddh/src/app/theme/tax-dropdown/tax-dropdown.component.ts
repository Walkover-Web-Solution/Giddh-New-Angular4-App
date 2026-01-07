import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatMenuTrigger, MenuCloseReason } from "@angular/material/menu";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { ReplaySubject, takeUntil } from "rxjs";
import { AppState } from "../../store";
import { Store, select } from "@ngrx/store";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { isEqual } from "../../lodash-optimized";

@Component({
    selector: "tax-dropdown",
    templateUrl: "./tax-dropdown.component.html",
    styleUrls: ["./tax-dropdown.component.scss"],
    standalone: false
})
export class TaxDropdownComponent implements OnChanges {
    @Input() public taxesList: any[] = [];
    /** List of selected taxes */
    @Input() public selectedTaxesList: any[] = [];
    /** Amount for taxes */
    @Input() public amount: any;
    /** Account currency */
    @Input() public currency: any;
    /** Account currency */
    @Input() public date: any;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True, if current transaction tax needed to be calculated inclusively
     * Required for inclusive tax rate calculation for advance receipt
    */
    @Input() public calculateTaxInclusively: boolean;
    /** Holds true if tax needs to be calculated */
    @Input() public calculateTax: boolean;
    /** Emitter for create new tax selected */
    @Output() public createNewTax: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emitter for selected taxes */
    @Output() public selectedTaxes: EventEmitter<any> = new EventEmitter<any>();
    /** Emitter for taxes total */
    @Output() public totalTax: EventEmitter<any> = new EventEmitter<any>();
    /** Emitter for close tax dropdown */
    @Output() public closeTaxDropdown: EventEmitter<any> = new EventEmitter<any>();
    /** Form Group for tax form */
    public taxForm: FormGroup;
    /** Total tax amount */
    public totalTaxAmount: number = 0;
    /** Default decimal places */
    private balanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Element ref for mat menu */
    @ViewChild('taxMenuTrigger') public taxMenuTrigger: MatMenuTrigger;
    /** Element ref for tax input */
    @ViewChild('taxInput') public taxInput: ElementRef<HTMLInputElement>;
    /** Stores last saved form values when menu opens */
    private lastSavedFormValues: any = null;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<AppState>
    ) {
        this.taxForm = this.formBuilder.group({
            taxes: this.formBuilder.array([])
        });

        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.balanceDecimalPlaces) {
                this.balanceDecimalPlaces = response.balanceDecimalPlaces;
            } else {
                this.balanceDecimalPlaces = 2;
            }
        });
    }

    /**
     * Lifecycle hook for input value changes
     *
     * @param {SimpleChanges} changes
     * @memberof TaxDropdownComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.calculateTaxInclusively) {
            if (changes?.amount?.firstChange && ((!isEqual(changes?.selectedTaxesList?.currentValue, changes?.selectedTaxesList?.previousValue)) || (!isEqual(changes?.taxesList?.currentValue, changes?.taxesList?.previousValue)))) {
                if (this.taxesList?.length) {
                    this.addTaxesInFormAndEnableDisableTaxes();
                }
            } else if (!isEqual(changes?.taxesList?.currentValue, changes?.taxesList?.previousValue) && changes?.taxesList?.currentValue?.length > 0) {
                this.addTaxesInForm();
            }
        } else {
            if ((!isEqual(changes?.selectedTaxesList?.currentValue, changes?.selectedTaxesList?.previousValue)) || (!isEqual(changes?.taxesList?.currentValue, changes?.taxesList?.previousValue)) || (!isEqual(changes?.amount?.currentValue, changes?.amount?.previousValue))) {
                if (this.taxesList?.length) {
                    this.addTaxesInFormAndEnableDisableTaxes();
                }
            }
        }

        if (changes?.calculateTax?.currentValue) {
            this.calculateTaxAmount(true);
        }
    }

    /**
     * Adds tax in form group and enable/disable taxes
     *
     * @private
     * @memberof TaxDropdownComponent
     */
    private addTaxesInFormAndEnableDisableTaxes(): void {
        this.addTaxesInForm();
        this.enableDisableTaxes();
    }

    /**
     * Adds tax in form group
     *
     * @memberof TaxDropdownComponent
     */
    public addTaxesInForm(): void {
        const taxes = this.taxForm.get('taxes') as FormArray;
        taxes?.clear();

        this.taxesList?.forEach(tax => {
            const isTaxSelected = this.selectedTaxesList?.filter(selectedTax => selectedTax?.uniqueName === tax.uniqueName);
            tax.isChecked = isTaxSelected?.length > 0;
            taxes.push(this.getTaxFormGroup(tax));
        });
    }

    /**
     * Returns tax form group
     *
     * @private
     * @param {*} tax
     * @return {*}  {FormGroup}
     * @memberof TaxDropdownComponent
     */
    private getTaxFormGroup(tax: any): FormGroup {
        return this.formBuilder.group({
            name: [tax?.name],
            uniqueName: [tax?.uniqueName],
            taxType: [tax?.taxType],
            taxDetail: [tax?.taxDetail?.length ? tax?.taxDetail[0] : null],
            isChecked: [tax?.isChecked ?? false],
            disableForDate: [tax?.disableForDate ?? false],
            calculationMethod: ['OnTaxableAmount']
        });
    }

    /**
     * Enable/disable taxes based on same tax type or tax date not applicable
     *
     * @memberof TaxDropdownComponent
     */
    public enableDisableTaxes(): void {
        const selectedTaxTypes = [];
        let taxes = this.taxForm.get('taxes') as FormArray;
        for (let i = 0; i < taxes.length; i++) {
            taxes.controls[i]?.enable();
            taxes.controls[i]?.get('disableForDate')?.patchValue(false);

            if (taxes.controls[i]?.get('isChecked')?.value) {
                selectedTaxTypes[taxes.controls[i]?.get('taxType')?.value] = taxes.controls[i]?.get('uniqueName')?.value;
            }
        }

        for (let i = 0; i < taxes.length; i++) {
            if (selectedTaxTypes[taxes.controls[i]?.get('taxType')?.value] && selectedTaxTypes[taxes.controls[i]?.get('taxType')?.value] !== taxes.controls[i]?.get('uniqueName')?.value) {
                taxes.controls[i]?.disable();
                taxes.controls[i]?.get('disableForDate')?.patchValue(false);
            } else if (dayjs(taxes.controls[i]?.get('taxDetail')?.value?.date, GIDDH_DATE_FORMAT) > dayjs(this.date, GIDDH_DATE_FORMAT)) {
                taxes.controls[i]?.get('disableForDate')?.patchValue(true);
                taxes.controls[i]?.disable();
            }
        }

        this.calculateTaxAmount();
    }

    /** 
     * Calculates tax amount
     *
     * @private
     * @param {boolean} [calculateTax=false]
     * @memberof TaxDropdownComponent
     */
    private calculateTaxAmount(calculateTax: boolean = false): void {
        this.totalTaxAmount = 0;

        const taxes = this.taxForm.get('taxes') as FormArray;
        for (let i = 0; i < taxes.length; i++) {
            if (taxes.controls[i]?.get('isChecked')?.value) {
                const taxRate = Number(taxes.controls[i].get('taxDetail')?.value?.taxValue);
                if (this.calculateTaxInclusively && !calculateTax) {
                    // Inclusive tax rate
                    this.totalTaxAmount += (Number(this.amount) * (taxRate / 100))
                        / (1 + (taxRate / 100));
                } else {
                    // Exclusive tax rate
                    this.totalTaxAmount += ((taxRate / 100) * Number(this.amount));
                }
            }
        }

        this.totalTaxAmount = giddhRoundOff(this.totalTaxAmount, this.balanceDecimalPlaces);
        this.emitSelectedTaxes();
    }

    /**
     * Emits selected tax and total tax
     *
     * @private
     * @memberof TaxDropdownComponent
     */
    private emitSelectedTaxes(): void {
        const taxes = this.taxForm.get('taxes') as FormArray;
        this.selectedTaxes.emit(taxes.value?.filter(tax => tax.isChecked));
        this.totalTax.emit(this.totalTaxAmount);
    }

    /**
     * Emits create new tax event
     *
     * @memberof TaxDropdownComponent
     */
    public createNew(): void {
        this.createNewTax.emit();
    }

    /**
     * Handles menu opened event and saves current form values
     *
     * @memberof TaxDropdownComponent
     */
    public handleMenuOpened(): void {
        this.lastSavedFormValues = {
            taxes: this.taxForm.get('taxes')?.value
        };
    }

    /**
     * Handles menu closed event and resets menu state
     *
     * @param reason The reason the menu was closed
     * @memberof TaxDropdownComponent
     */
    public handleMenuClosed(reason: MenuCloseReason): void {
        if (!reason) return;
        
        const isClosedByEscape = reason === 'keydown';
        if (isClosedByEscape && this.lastSavedFormValues) {
            const taxesArray = this.taxForm.get('taxes') as FormArray;
            this.lastSavedFormValues.taxes?.forEach((tax: any) => {
                const index = taxesArray?.controls?.findIndex(control => control.value.uniqueName === tax.uniqueName);
                if (index > -1) {
                    taxesArray.controls[index].patchValue(tax);
                }
            });
            
            this.calculateTaxAmount(true);
        }
        this.lastSavedFormValues = null;
    }

    /**
     * Close tax menu
     *
     * @memberof TaxDropdownComponent
     */
    public closeTaxMenu(): void {
        this.taxMenuTrigger?.closeMenu();
    }

    /**
     * Emits close tax dropdown event with the trigger element
     *
     * @memberof TaxDropdownComponent
     */
    protected emitCloseTaxDropdown(): void {
        // Always emit close event for focus management
        setTimeout(() => {
            const triggerElement = this.taxInput?.nativeElement || null;
            const syntheticEvent = {
                target: triggerElement
            };
            this.closeTaxDropdown.emit(syntheticEvent);
        }, 50);
    }

    /**
     * Focuses the next available checkbox in the tax list
     *
     * @param {HTMLElement} currentElement - The currently focused checkbox element
     * @param {number} currentIndex - The index of the current checkbox
     * @memberof TaxDropdownComponent
     */
    public focusNextCheckbox(currentElement: HTMLElement, currentIndex: number): void {
        setTimeout(() => {
            // Find the tax wrapper container
            const taxWrapper = document.querySelector('.discount-checkbox-wrapper');
            if (taxWrapper) {
                // Get all mat-checkbox elements (Angular Material checkboxes)
                const checkboxes = taxWrapper.querySelectorAll('mat-checkbox');
                
                if (checkboxes.length > 0) {
                    const nextIndex = currentIndex + 1;
                    
                    if (nextIndex < checkboxes.length) {
                        // Focus next checkbox - target the actual input element inside mat-checkbox
                        const nextCheckbox = checkboxes[nextIndex] as HTMLElement;
                        const inputElement = nextCheckbox.querySelector('input[type="checkbox"]') as HTMLElement;
                        if (inputElement) {
                            inputElement.focus();
                        } else {
                            nextCheckbox.focus();
                        }
                    } else {
                        // If at the end, try to focus "Create New" button or cycle back to first checkbox
                        const createNewButton = document.querySelector('.create-new span[tabindex="0"]');
                        if (createNewButton) {
                            (createNewButton as HTMLElement)?.focus();
                        } else if (checkboxes.length > 0) {
                            // Cycle back to first checkbox
                            const firstCheckbox = checkboxes[0] as HTMLElement;
                            const firstInputElement = firstCheckbox.querySelector('input[type="checkbox"]') as HTMLElement;
                            if (firstInputElement) {
                                firstInputElement.focus();
                            } else {
                                firstCheckbox.focus();
                            }
                        }
                    }
                }
            }
        }, 150);
    }
}