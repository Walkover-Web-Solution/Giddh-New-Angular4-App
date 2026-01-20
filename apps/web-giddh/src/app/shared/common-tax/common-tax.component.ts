import { Component, OnDestroy, OnInit, ChangeDetectorRef, input, output, signal, computed, effect, ViewChild, HostListener, ElementRef } from '@angular/core';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { ITaxControlData, ITaxDetail } from '../../models/interfaces/tax.interface';
import { giddhRoundOff } from '../helpers/helperFunctions';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import { cloneDeep, isEqual, orderBy } from '../../lodash-optimized';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { A11yModule } from '@angular/cdk/a11y';

/**
 * Common Tax Component
 * 
 * A reusable component for tax selection and calculation in vouchers, ledger entries, and invoices.
 * Supports both mat-form-field and input-style rendering with comprehensive tax management features.
 * 
 * Features:
 * - Multiple tax selection with mat-select
 * - Inclusive/Exclusive tax calculation
 * - Date-based tax filtering
 * - Tax type restrictions
 * - Advance receipt tax handling
 * - Keyboard navigation support
 * - Error validation for mandatory taxes
 * 
 * @example
 * <common-tax
 *   [taxes]="companyTaxesList"
 *   [applicableTaxes]="selectedTaxes"
 *   [totalForTax]="amount"
 *   [showMatFormField]="true"
 *   [isMandatory]="true"
 *   [showError]="hasError"
 *   (selectedTaxEvent)="onTaxSelected($event)"
 *   (taxAmountSumEvent)="onTaxAmountChange($event)"
 * ></common-tax>
 */
@Component({
    selector: 'common-tax',
    templateUrl: './common-tax.component.html',
    styleUrls: ['./common-tax.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatMenuModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTooltipModule,
        NgxMaskModule,
        FormFieldsModule,
        A11yModule
    ]
})
export class CommonTaxComponent implements OnDestroy, OnInit {
    // ==================== INPUT PROPERTIES ====================
    /** Whether the tax selection is read-only */
    public readonly = input<boolean>(false);
    /** Locale data for translations */
    public commonLocaleData = input<any>({});
    /** Date for filtering taxes based on applicability */
    public date = input<string>('');
    /** List of all available taxes */
    public taxes = input<any[]>([]);
    /** Currently selected/applicable taxes (can be string[] or object[]) */
    public applicableTaxes = input<any[]>([]);
    /** Custom heading text for the tax field */
    public customHeading = input<string>('');
    /** Whether tax selection is mandatory */
    public isMandatory = input<boolean>(false);
    /** Whether to show error state */
    public showError = input<boolean>(false);
    /** Total amount on which tax should be calculated */
    public totalForTax = input<number>(0);
    /** Custom tax types to include in the filter */
    public customTaxTypesForTaxFilter = input<string[]>([]);
    /** Tax types to exclude (e.g., ['tdsrc', 'tdspay', 'tcspay', 'tcsrc']) */
    public exceptTaxTypes = input<string[]>([]);
    /** Maximum number of taxes that can be selected (0 = unlimited) */
    public allowedSelection = input<number>(0);
    /** Allowed selection per tax type (e.g., { type: ['gst'], count: 1 }) */
    public allowedSelectionOfAType = input<{ type: string[], count: number }>();
    /** Prefix for tax amount display (e.g., currency symbol) */
    public prefixInput = input<string>('');
    /** Suffix for tax amount display */
    public suffixInput = input<string>('');
    /** Whether to show as mat-form-field (true) or input-style (false) */
    public showMatFormField = input<boolean>(false);
    /** Whether to calculate tax inclusively */
    public calculateTaxInclusively = input<boolean>(false);
    /** Whether this is an advance receipt entry */
    public isAdvanceReceipt = input<boolean>();
    /** Whether to show backdrop when dropdown opens */
    public hasBackdrop = input<boolean>(true);
    /** Whether to show "Create New" option in dropdown */
    public showCreateNew = input<boolean>(false);
    /** Input mask format for tax amount display */
    public mask = input<string>();

    // ==================== OUTPUT EVENTS ====================
    /** Emits the total tax amount when calculated */
    public taxAmountSumEvent = output<number>();
    /** Emits the array of selected taxes when selection changes */
    public selectedTaxEvent = output<any[]>();
    /** Emits when "Create New Tax" is clicked */
    public createNewTax = output<boolean>();

    // ==================== VIEW CHILDREN ====================
    /** Reference to mat-select when showMatFormField is true */
    @ViewChild('taxSelect') public taxSelect: MatSelect;
    /** Reference to mat-select when showMatFormField is false (input-style) */
    @ViewChild('taxSelectInput') public taxSelectInput: MatSelect;
    
    // ==================== SIGNALS ====================
    /** Flag to track if dropdown is currently open */
    private isDropdownOpen = signal<boolean>(false);
    /** Sum of all selected tax percentages */
    public taxSum = signal<number>(0);
    /** Calculated total tax amount */
    public calculatedTaxAmount = signal<number>(0);
    /** Number of decimal places for balance amounts */
    public giddhBalanceDecimalPlaces = signal<number>(2);
    /** Array of selected tax objects */
    public selectedTaxes = signal<string[]>([]);
    /** Internal array of tax render data with UI state */
    public internalTaxRenderData = signal<any[]>([]);

    // ==================== PRIVATE PROPERTIES ====================
    /** Subject for managing subscriptions */
    private destroyed$ = new ReplaySubject<boolean>(1);
    /** Array of selected tax unique names */
    public selectedTaxUniquenames: string[] = [];
    /** Cache for tracking changes in taxes and applicableTaxes inputs */
    private previousTaxesData: { taxes: any[], applicableTaxes: any[] } = { taxes: null, applicableTaxes: null };
    /**
     * Computed signal that tracks changes in taxes and applicableTaxes inputs
     * Used to detect when these inputs change and trigger re-calculation
     */
    private taxesInputTracker = computed(() => {
        const taxes = this.taxes();
        const applicableTaxes = this.applicableTaxes();
        return { taxes, applicableTaxes };
    });

    /**
     * Getter for tax total amount
     * @returns The calculated total tax amount
     */
    get taxTotalAmount(): number {
        return this.calculatedTaxAmount();
    }

    /**
     * Setter for tax total amount
     * @param value - The tax amount to set
     */
    set taxTotalAmount(value: number) {
        this.calculatedTaxAmount.set(value || 0);
    }

    /**
     * Constructor
     * Initializes the component with required services and sets up reactive effects
     * 
     * @param cdr - Change detector reference for manual change detection
     */
    constructor(
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {

        effect(() => {
            const inclusively = this.calculateTaxInclusively();
            const totalForTax = this.totalForTax(); 
            if (this.internalTaxRenderData()?.length > 0) {
                this.calculateInclusiveOrExclusiveTaxes();
            }
        }, { allowSignalWrites: true });

        effect(() => {
            const taxData = this.taxesInputTracker();
            const taxesChanged = !isEqual(taxData.taxes, this.previousTaxesData.taxes);
            const applicableTaxesChanged = !isEqual(taxData.applicableTaxes, this.previousTaxesData.applicableTaxes);
            
            if (taxesChanged || applicableTaxesChanged) {
                this.previousTaxesData = { taxes: cloneDeep(taxData.taxes), applicableTaxes: cloneDeep(taxData.applicableTaxes) };
                this.prepareTaxObject();
                this.change();
            }
        }, { allowSignalWrites: true });
    }

    /**
     * Angular lifecycle hook - Component initialization
     * 
     * - Subscribes to profile settings to get balance decimal places
     * - Initializes tax object if taxes are provided
     * - Triggers initial tax calculation
     * 
     * @public
     */
    public ngOnInit(): void {
        if (this.taxes()) {
            this.prepareTaxObject();
            this.change();
        }
    }

    /**
     * Angular lifecycle hook - Component cleanup
     * 
     * Completes all subscriptions to prevent memory leaks
     * 
     * @public
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Helper method to extract unique names from applicableTaxes input
     * 
     * Handles both formats:
     * - string[] - Direct array of unique names
     * - object[] - Array of tax objects with uniqueName property
     * 
     * @private
     * @returns Array of tax unique names
     * 
     * @example
     * // String array format
     * ['tax1', 'tax2'] => ['tax1', 'tax2']
     * 
     * // Object array format
     * [{uniqueName: 'tax1'}, {uniqueName: 'tax2'}] => ['tax1', 'tax2']
     */
    private getApplicableTaxUniqueNames(): string[] {
        const applicableTaxes = this.applicableTaxes();
        if (!applicableTaxes?.length) {
            return [];
        }

        return applicableTaxes.map(item => {
            if (typeof item === 'string') {
                return item;
            } else if (item?.uniqueName) {
                return item.uniqueName;
            }
            return null;
        }).filter(Boolean);
    }

    /**
     * Prepares and processes tax data for rendering
     * 
     * This method:
     * - Filters taxes based on customTaxTypesForTaxFilter and exceptTaxTypes
     * - Applies date-based filtering for tax applicability
     * - Marks taxes as checked based on applicableTaxes input
     * - Updates the internal render data with UI state
     * - Sorts taxes (checked items first)
     * 
     * @public
     * @returns void
     * 
     * @remarks
     * This method is called automatically when:
     * - Component initializes
     * - taxes or applicableTaxes inputs change
     * - Date input changes
     */
    public prepareTaxObject(): void {
        let taxesList = cloneDeep(this.taxes());
        if (!taxesList) {
            return;
        }

        if (this.customTaxTypesForTaxFilter()?.length) {
            taxesList = taxesList.filter(f => this.customTaxTypesForTaxFilter().includes(f.taxType));
        }

        if (this.exceptTaxTypes()?.length) {
            taxesList = taxesList.filter(f => !this.exceptTaxTypes().includes(f.taxType));
        }

        const renderData = [...this.internalTaxRenderData()];
        const applicableTaxUniqueNames = this.getApplicableTaxUniqueNames();
        
        taxesList.forEach(tax => {
            const index = renderData?.findIndex(f => f?.uniqueName === tax?.uniqueName);

            if (index > -1) {
                renderData[index].isChecked = 
                    applicableTaxUniqueNames.length ? 
                    applicableTaxUniqueNames.includes(tax?.uniqueName) :
                    renderData[index].isChecked;
                
                if (this.date() && tax.taxDetail?.length) {
                    const isDateValid = dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date(), GIDDH_DATE_FORMAT)) || 
                                       dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(this.date(), GIDDH_DATE_FORMAT);
                    if (!isDateValid) {
                        renderData[index].isDisabled = true;
                        renderData[index].disableForDate = true;
                    } else {
                        renderData[index].disableForDate = false;
                    }
                }
            } else {
                let taxObj = cloneDeep(tax);
                taxObj.type = taxObj.taxType;

                if (this.date()) {
                    const taxObject = orderBy(tax.taxDetail, (p: ITaxDetail) => {
                        return dayjs(p.date, GIDDH_DATE_FORMAT);
                    }, 'desc');
                    
                    const exactDate = taxObject?.filter(p => 
                        dayjs(p.date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date(), GIDDH_DATE_FORMAT))
                    );
                    
                    if (exactDate?.length > 0) {
                        taxObj.amount = exactDate[0].taxValue;
                        taxObj.disableForDate = false;
                    } else {
                        const filteredTaxObject = taxObject?.filter(p => 
                            dayjs(p.date, GIDDH_DATE_FORMAT) < dayjs(this.date(), GIDDH_DATE_FORMAT)
                        );
                        if (filteredTaxObject?.length === 0) {
                            taxObj.isDisabled = true;
                            taxObj.disableForDate = true;
                        } else {
                            taxObj.disableForDate = false;
                        }
                    }
                } else {
                    taxObj.isDisabled = false;
                    taxObj.disableForDate = false;
                }
                
                taxObj.amount = tax.taxDetail[0].taxValue;
                taxObj.isChecked = applicableTaxUniqueNames.length ? 
                    applicableTaxUniqueNames.includes(tax?.uniqueName) : false;
                
                renderData.push(taxObj);
            }
        });

        if (renderData?.length) {
            renderData.sort((firstTax, secondTax) => 
                (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1)
            );
        }
        
        this.internalTaxRenderData.set(renderData);
        
        this.selectedTaxUniquenames = renderData
            .filter(tax => tax.isChecked)
            .map(tax => tax.uniqueName);

    }

    /**
     * TrackBy function for ngFor optimization
     * 
     * Helps Angular track items in the tax list for better performance
     * 
     * @public
     * @param index - Index of the item in the array
     * @param tax - Tax control data object
     * @returns Unique identifier for the tax item
     */
    public trackByFn(index: number, tax: ITaxControlData): string {
        return tax?.uniqueName;
    }

    /**
     * Programmatically focuses and opens the tax dropdown
     * 
     * Handles both mat-form-field and input-style mat-select instances
     * Uses a 100ms delay to ensure the dropdown opens properly after focus
     * 
     * @public
     * @returns void
     * 
     * @remarks
     * This method is typically called from parent components for keyboard navigation
     */
    public focusTaxDropdown(): void {
        if (this.showMatFormField()) {
            if (this.taxSelect) {
                this.taxSelect.focus();
                setTimeout(() => {
                    this.taxSelect?.open();
                }, 100);
            }
        } else {
            if (this.taxSelectInput) {
                this.taxSelectInput.focus();
                setTimeout(() => {
                    this.taxSelectInput?.open();
                }, 100);
            }
        }
    }

    /**
     * Programmatically opens or closes the tax dropdown
     * 
     * Handles both mat-form-field and input-style mat-select instances
     * 
     * @public
     * @param isOpen - True to open the dropdown, false to close it
     * @returns void
     * 
     * @example
     * // Open the dropdown
     * this.toggleTaxMenu(true);
     * 
     * // Close the dropdown
     * this.toggleTaxMenu(false);
     */
    public toggleTaxMenu(isOpen: boolean = false): void {
        if (this.showMatFormField()) {
            if (this.taxSelect) {
                if (isOpen) {
                    this.taxSelect.open();
                } else {
                    this.taxSelect.close();
                }
            }
        } else {
            if (this.taxSelectInput) {
                if (isOpen) {
                    this.taxSelectInput.open();
                } else {
                    this.taxSelectInput.close();
                }
            }
        }
    }

    /**
     * Handles tax selection changes and updates internal state
     * 
     * This method:
     * - Calculates the sum of selected tax percentages
     * - Calculates inclusive/exclusive tax amounts
     * - Applies selection restrictions (allowedSelection, allowedSelectionOfAType)
     * - Handles advance receipt tax logic
     * - Sorts taxes (checked first, then enabled)
     * - Emits selectedTaxEvent with updated selection
     * 
     * @public
     * @param preventEmit - If true, prevents emitting selectedTaxEvent (default: false)
     * @returns void
     * 
     * @remarks
     * Called automatically when:
     * - User selects/deselects a tax
     * - Tax data is prepared/updated
     * - Total amount changes
     */
    public change(preventEmit?: boolean): void {
        const sum = this.calculateSum();
        this.taxSum.set(sum);
        this.calculateInclusiveOrExclusiveTaxes();
        const selected = this.generateSelectedTaxes();
        this.selectedTaxes.set(selected);

        const renderData = [...this.internalTaxRenderData()];

        if (this.allowedSelection() > 0) {
            if (selected?.length >= this.allowedSelection()) {
                renderData.forEach(tax => {
                    tax.isDisabled = !tax.isChecked;
                });
            } else {
                renderData.forEach(tax => {
                    tax.isDisabled = tax.isDisabled ? false : tax.isDisabled;
                });
            }
        }

        if (this.allowedSelectionOfAType() && this.allowedSelectionOfAType().type?.length) {
            (Array.isArray(this.allowedSelectionOfAType().type) ? this.allowedSelectionOfAType().type : []).forEach(taxType => {
                const selectedTaxes = renderData?.filter(appliedTaxes => (appliedTaxes.isChecked && taxType === appliedTaxes.type));
                if (selectedTaxes?.length >= this.allowedSelectionOfAType().count) {
                    renderData.forEach(taxesApplied => {
                        if (taxType === taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                    });
                } else {
                    renderData.forEach(taxesApplied => {
                        if (taxType === taxesApplied.type && taxesApplied.isDisabled) {
                            if (this.date() && taxesApplied?.taxDetail?.length) {
                                taxesApplied.isDisabled = 
                                    (dayjs(taxesApplied.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date(), GIDDH_DATE_FORMAT)) || 
                                     dayjs(taxesApplied.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(this.date(), GIDDH_DATE_FORMAT)) ?
                                    false : true;
                            } else {
                                taxesApplied.isDisabled = false;
                            }
                        }
                    });
                }
            });

            if (this.isAdvanceReceipt()) {
                const atleastSingleTaxSelected: boolean = renderData?.filter((tax) => tax.isChecked && tax.type !== 'gstcess')?.length !== 0;
                if (atleastSingleTaxSelected) {
                    renderData.forEach(taxesApplied => {
                        if ('gstcess' !== taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                    });
                }
            }
        }
        if (renderData?.length) {
            renderData.sort((firstTax, secondTax) => {
                // First, sort by checked status (checked items first)
                if (firstTax.isChecked !== secondTax.isChecked) {
                    return firstTax.isChecked ? -1 : 1;
                }
                // Then, sort by disabled status (enabled items first)
                if (firstTax.isDisabled !== secondTax.isDisabled) {
                    return firstTax.isDisabled ? 1 : -1;
                }
                return 0;
            });
        }
        this.internalTaxRenderData.set(renderData);
        this.cdr.markForCheck();
        
        if (renderData?.length > 0 && !preventEmit) {
            this.selectedTaxEvent.emit(selected);
        }
    }

    /**
     * Handles mat-select selection change event
     * 
     * Updates the checked state of taxes based on user selection
     * and triggers the change() method to recalculate
     * 
     * @public
     * @param event - Mat-select change event containing selected values
     * @returns void
     * 
     * @remarks
     * This is the event handler bound to (selectionChange) in the template
     */
    public onTaxSelectionChange(event: any): void {
        let selectedUniquenames = event.value || [];
        
        // Check if 'create-new-option' was selected
        if (selectedUniquenames.includes('create-new-option')) {
            // Remove 'create-new-option' from the selected values
            selectedUniquenames = selectedUniquenames.filter((value: string) => value !== 'create-new-option');
            // Update the model to exclude 'create-new-option'
            this.selectedTaxUniquenames = selectedUniquenames;
            this.createNew();
            return;
        }
        
        const renderData = [...this.internalTaxRenderData()];
        
        renderData.forEach(tax => {
            tax.isChecked = selectedUniquenames.includes(tax.uniqueName);
        });
        
        this.internalTaxRenderData.set(renderData);
        this.change();
    }

    /**
     * Enables all taxes by removing disabled state
     * 
     * Useful for resetting tax restrictions after certain operations
     * 
     * @public
     * @returns void
     */
    public enableAllTheTaxes(): void {
        const renderData = this.internalTaxRenderData();
        if (renderData?.length) {
            renderData.forEach(tax => tax.isDisabled = false);
            this.internalTaxRenderData.set([...renderData]);
        }
    }

    /**
     * Calculates the sum of all selected tax percentages
     * 
     * @public
     * @returns Total percentage of all selected taxes
     * 
     * @example
     * // If GST 18% and Cess 2% are selected
     * calculateSum() => 20
     */
    public calculateSum(): number {
        return this.internalTaxRenderData().reduce((pv, cv) => {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
    }

    /**
     * Generates an array of selected tax objects
     * 
     * Filters the internal render data to return only checked taxes
     * 
     * @private
     * @returns Array of selected tax objects
     */
    private generateSelectedTaxes(): any[] {
        return this.internalTaxRenderData()?.filter(p => p.isChecked);
    }

    /**
     * Calculates tax amount based on inclusive or exclusive mode
     * 
     * Formulas:
     * - Inclusive: (total × sum) / (100 + sum)
     * - Exclusive: (total × sum) / 100
     * 
     * Where:
     * - total = totalForTax input value
     * - sum = sum of all selected tax percentages
     * 
     * @private
     * @returns void
     * 
     * @remarks
     * - Result is rounded based on giddhBalanceDecimalPlaces
     * - Emits taxAmountSumEvent with calculated amount
     * 
     * @example
     * // Exclusive: Amount = 100, Tax = 18%
     * // Result: (100 × 18) / 100 = 18
     * 
     * // Inclusive: Amount = 118, Tax = 18%
     * // Result: (118 × 18) / (100 + 18) = 18
     */
    private calculateInclusiveOrExclusiveTaxes(): void {
        const total = this.totalForTax();
        const sum = this.taxSum();
        const decimalPlaces = this.giddhBalanceDecimalPlaces();
        
        if (this.calculateTaxInclusively()) {
            this.taxTotalAmount = giddhRoundOff(
                (total * sum) / (100 + sum), 
                decimalPlaces
            );
        } else {
            this.taxTotalAmount = giddhRoundOff(
                ((total * sum) / 100), 
                decimalPlaces
            );
        }
        
        this.taxAmountSumEvent.emit(this.taxTotalAmount);
    }

    /**
     * Emits event to create a new tax
     * 
     * Triggered when user clicks the "Create New" option in the dropdown
     * 
     * @public
     * @returns void
     */
    public createNew(): void {
        this.createNewTax.emit(true);
    }

    /**
     * Handles mat-select opened/closed state changes
     * Focuses the second option when dropdown opens (skipping "Create New" if present)
     * 
     * @public
     * @param opened - Whether the dropdown is now open
     * @param selectInstance - The MatSelect instance that triggered the event
     */
    public onSelectOpenedChange(opened: boolean, selectInstance: MatSelect): void {
        this.isDropdownOpen.set(opened);
        if (opened) {
            this.focusSecondOption(selectInstance);
        }
    }

    /**
     * Handles document click events to close dropdown when clicking outside
     * Only closes if dropdown is open and click is outside the component
     * 
     * @public
     * @param event - The mouse click event
     */
    @HostListener('document:click', ['$event'])
    public onDocumentClick(event: MouseEvent): void {
        if (!this.isDropdownOpen()) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        
        if (!clickedInside) {
            if (this.taxSelect?.panelOpen) {
                this.taxSelect.close();
            }
            if (this.taxSelectInput?.panelOpen) {
                this.taxSelectInput.close();
            }
            this.isDropdownOpen.set(false);
        }
    }

    /**
     * Focuses on the second option in mat-select dropdown
     * 
     * Skips the "Create New" option (index 0) and focuses on the first actual tax (index 1)
     * Also scrolls the focused option into view for better UX
     * 
     * @private
     * @param selectInstance - Reference to the mat-select instance
     * @returns void
     * 
     * @remarks
     * - Accesses internal Angular Material _keyManager API
     * - Silently handles any errors to prevent breaking the UI
     * - Similar implementation to reactive-dropdown-field component
     */
    private focusSecondOption(selectInstance: MatSelect): void {
        if (selectInstance && (selectInstance as any)._keyManager) {
            try {
                const keyManager = (selectInstance as any)._keyManager;
                const options = keyManager._items;

                // If we have options and showCreateNew is true, focus on index 1 (second option)
                // Index 0 would be the "Create New" option, index 1 is the first tax option
                if (options && options.length > 1) {
                    keyManager.setActiveItem(1);
                }
            } catch (error) {
                // Silently handle any errors
            }
        }
    }
}
