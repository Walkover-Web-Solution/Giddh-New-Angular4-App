import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as dayjs from 'dayjs';
import { TaxResponse } from '../../../models/api-models/Company';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { ITaxControlData, ITaxDetail } from '../../../models/interfaces/tax.interface';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { difference, orderBy } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { HIGH_RATE_FIELD_PRECISION } from '../../../app.constant';

export const TAX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => UpdateLedgerTaxControlComponent),
    multi: true
};

/**
 * UpdateLedgerTaxData component
 * Handles updateledgertaxdata functionality and user interactions
 */
export class UpdateLedgerTaxData {
    public particular: INameUniqueName = { name: '', uniqueName: '' };
    public amount: number = 0;
}

/**
 * Handles Component functionality
 */
@Component({
    selector: 'update-ledger-tax-control',
    templateUrl: 'update-ledger-tax-control.component.html',
    styleUrls: [`./update-ledger-tax-control.component.scss`],
    providers: [TAX_CONTROL_VALUE_ACCESSOR],
    standalone:false
})
/**
 * UpdateLedgerTaxControlComponent component
 * Handles updateledgertaxcontrol functionality and user interactions
 */
export class UpdateLedgerTaxControlComponent implements OnDestroy, OnChanges, AfterViewInit {

    /** True if field is readonly */
    @Input() public readonly: boolean = false;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public date: string;
    @Input() public taxes: TaxResponse[];
    @Input() public applicableTaxes: any[];
    @Input() public taxRenderData: ITaxControlData[];
    @Input() public showHeading: boolean = true;
    @Input() public showTaxPopup: boolean = false;
    @Input() public totalForTax: number = 0;
    /** Custom heading to be applied to tax control header */
    @Input() public customHeading: string = '';
    /** True, if mandatory asterisk needs to be displayed */
    @Input() public isMandatory: boolean = false;

    @Input() public customTaxTypesForTaxFilter: string[] = [];
    @Input() public exceptTaxTypes: string[] = [];
    @Input() public allowedSelection: number = 0;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    @Input() public allowedSelectionOfAType: { type: string[], count: number };
    /** True, if current transaction is advance receipt
     * Required for inclusive tax rate calculation
    */
    @Input() public isAdvanceReceipt: boolean;
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;
    @Input() public giddhBalanceDecimalPlaces: number = 2;

    @Output() public isApplicableTaxesEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
    @Output() public selectedTaxEvent: EventEmitter<UpdateLedgerTaxData[]> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** Tax input field */
    @ViewChild('taxInputElement', { static: true }) public taxInputElement: ElementRef;

    public sum: number = 0;
    public formattedTotal: string;
    private selectedTaxes: UpdateLedgerTaxData[] = [];
    /* Amount should have precision up to 16 digits for better calculation */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** Emitter for create new tax selected */
    @Output() public createNewTax: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emitter for component init */
    @Output() public viewInitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private generalService: GeneralService) {

    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges) {
        /**
         * Handles if functionality
         */
        if ('applicableTaxes' in changes || 'date' in changes) {
            const hasApplicableTaxesChanged = changes['applicableTaxes'] && changes['applicableTaxes'].currentValue !== changes['applicableTaxes'].previousValue;
            /**
             * Handles if functionality
             */
            if (hasApplicableTaxesChanged) {
                this.taxRenderData = [];
            }
            const hasDateChanged = changes['date'] && changes['date'].currentValue !== changes['date'].previousValue && dayjs(changes['date'].currentValue, GIDDH_DATE_FORMAT).isValid();
            /**
             * Handles if functionality
             */
            if (hasApplicableTaxesChanged || hasDateChanged) {
                this.sum = 0;
                this.prepareTaxObject();
                this.change();
            }
        }

        /**
         * Handles if functionality
         */
        if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue ||
            changes['isAdvanceReceipt'] && changes['isAdvanceReceipt'].currentValue !== changes['isAdvanceReceipt'].previousValue) {
            this.calculateInclusiveOrExclusiveFormattedTax();
            this.taxAmountSumEvent.emit(this.sum);
        }

        /**
         * Handles if functionality
         */
        if ('taxes' in changes && changes && (Array.isArray(changes.taxes.currentValue))) {
            this.prepareTaxObject();
            this.change();
        }
    }

    /**
     * prepare taxObject as per needed
     */
    public prepareTaxObject() {

        /**
         * Handles if functionality
         */
        if (this.customTaxTypesForTaxFilter && this.customTaxTypesForTaxFilter.length) {
            this.taxes = this.taxes?.filter(f => this.customTaxTypesForTaxFilter.includes(f.taxType));
        }

        /**
         * Handles if functionality
         */
        if (this.exceptTaxTypes && this.exceptTaxTypes.length) {
            this.taxes = this.taxes?.filter(f => !this.exceptTaxTypes.includes(f.taxType));
        }
        this.taxes.map(tax => {
            const index = this.taxRenderData?.findIndex(f => f?.uniqueName === tax?.uniqueName);
            // if tax is already prepared then only check if it's checked or not on basis of applicable taxes
            /**
             * Handles if functionality
             */
            if (index > -1) {
                /**
                 * Handles if functionality
                 */
                if (this.date && tax.taxDetail && tax.taxDetail.length) {
                    this.taxRenderData[index].amount =
                        (dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)) || dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT)) ?
                            tax.taxDetail[0].taxValue : 0;
                }
            } else {
                let taxObj = new ITaxControlData();
                taxObj.name = tax?.name;
                taxObj.type = tax?.taxType;
                taxObj.uniqueName = tax?.uniqueName;
                /**
                 * Handles if functionality
                 */
                if (this.date) {
                    let taxObject = orderBy(tax.taxDetail, (p: ITaxDetail) => {
                        return dayjs(p.date, GIDDH_DATE_FORMAT);
                    }, 'desc');
                    let exactDate = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)));
                    /**
                     * Handles if functionality
                     */
                    if (exactDate && exactDate.length > 0) {
                        taxObj.amount = exactDate[0].taxValue;
                    } else {
                        let filteredTaxObject = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT));
                        /**
                         * Handles if functionality
                         */
                        if (filteredTaxObject && filteredTaxObject.length > 0) {
                            taxObj.amount = filteredTaxObject[0].taxValue;
                        } else {
                            taxObj.amount = 0;
                        }
                    }
                } else {
                    taxObj.amount = tax.taxDetail[0].taxValue;
                }
                taxObj.isChecked = (this.applicableTaxes && (this.applicableTaxes?.indexOf(tax?.uniqueName) > -1));
                this.taxRenderData.push(taxObj);
            }
        });
        /**
         * Handles if functionality
         */
        if (this.taxRenderData?.length) {
            this.taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
        }
    }

    /**
     * Toggles taxpopup state
     */
    public toggleTaxPopup(action: boolean) {
        this.showTaxPopup = action;
    }

    /**
     * Handles trackByFn functionality
     */
    public trackByFn(index) {
        return index;
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.taxAmountSumEvent.unsubscribe();
        this.isApplicableTaxesEvent.unsubscribe();
        this.selectedTaxEvent.unsubscribe();
    }

    /**
     * select/deselect tax checkbox
     */
    public change() {
        this.selectedTaxes = [];
        this.sum = this.calculateSum();
        this.calculateInclusiveOrExclusiveFormattedTax();
        this.selectedTaxes = this.generateSelectedTaxes();

        /**
         * Handles if functionality
         */
        if (this.allowedSelection > 0) {
            /**
             * Handles if functionality
             */
            if (this.selectedTaxes && this.selectedTaxes.length >= this.allowedSelection) {
                this.taxRenderData = this.taxRenderData.map(m => {
                    m.isDisabled = !m.isChecked;
                    return m;
                });
            } else {
                this.taxRenderData = this.taxRenderData.map(m => {
                    m.isDisabled = m.isDisabled ? false : m.isDisabled;
                    return m;
                });
            }
        }
        /**
         * Handles if functionality
         */
        if (this.allowedSelectionOfAType && this.allowedSelectionOfAType.type && this.allowedSelectionOfAType.type.length) {
            (Array.isArray(this.allowedSelectionOfAType.type) ? this.allowedSelectionOfAType.type : []).forEach(taxType => {
                const selectedTaxes = this.taxRenderData?.filter(appliedTaxes => (appliedTaxes.isChecked && taxType === appliedTaxes.type));

                /**
                 * Handles if functionality
                 */
                if (selectedTaxes && selectedTaxes.length >= this.allowedSelectionOfAType.count) {
                    this.taxRenderData.map((taxesApplied => {
                        /**
                         * Handles if functionality
                         */
                        if (taxType === taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                        return taxesApplied;
                    }));
                } else {
                    this.taxRenderData.map((taxesApplied => {
                        /**
                         * Handles if functionality
                         */
                        if (taxType === taxesApplied.type && taxesApplied.isDisabled) {
                            taxesApplied.isDisabled = false;
                        }
                        return taxesApplied;
                    }));
                }
            });
            /**
             * Handles if functionality
             */
            if (this.isAdvanceReceipt) {
                // In case of advance receipt only a single tax is allowed in addition to CESS
                // Check if atleast a single non-cess tax is selected, if yes, then disable all other taxes
                // except CESS taxes
                let singleSelectedTax = this.taxRenderData?.filter((tax) => tax.isChecked && tax.type !== 'gstcess');
                const atleastSingleTaxSelected: boolean = singleSelectedTax && singleSelectedTax.length !== 0;
                /**
                 * Handles if functionality
                 */
                if (atleastSingleTaxSelected) {
                    this.taxRenderData.map((taxesApplied => {
                        /**
                         * Handles if functionality
                         */
                        if ('gstcess' !== taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                        return taxesApplied;
                    }));
                }
            }
        }
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.taxRenderData?.length) {
                this.taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
            }
        });

        this.taxAmountSumEvent.emit(this.sum);
        this.selectedTaxEvent.emit(this.selectedTaxes);

        let diff: boolean;
        /**
         * Handles if functionality
         */
        if (this.selectedTaxes && this.selectedTaxes.length > 0) {
            let taxDifference = difference(this.selectedTaxes, this.applicableTaxes);
            diff = taxDifference && taxDifference.length > 0;
        } else {
            diff = this.applicableTaxes && this.applicableTaxes.length > 0;
        }

        /**
         * Handles if functionality
         */
        if (diff) {
            this.isApplicableTaxesEvent.emit(false);
        } else {
            this.isApplicableTaxesEvent.emit(true);
        }
    }

    /**
     * Handles focuslastdiv event
     */
    public onFocusLastDiv(el) {
        el.stopPropagation();
        el.preventDefault();
        /**
         * Handles if functionality
         */
        if (!this.showTaxPopup) {
            this.showTaxPopup = true;
            this.hideOtherPopups.emit(true);
            return;
        }
        let focussableElements = '.entrypanel input[type=text]:not([disabled]),.entrypanel [tabindex]:not([disabled]):not([tabindex="-1"])';
        let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
            (element) => {
                // check for visibility while always include the current activeElement
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
            });
        let index = focussable?.indexOf(document.activeElement);
        /**
         * Handles if functionality
         */
        if (index > -1) {
            let nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
        this.toggleTaxPopup(false);
        return false;
    }

    /**
     * Tax input focus handler
     *
     * @memberof TaxControlComponent
     */
    public handleInputFocus(): void {
        this.showTaxPopup = true;
        this.hideOtherPopups.emit(true);
        /**
         * Handles if functionality
         */
        if (this.taxInputElement && this.taxInputElement.nativeElement) {
            this.taxInputElement.nativeElement.classList.remove('error-box');
        }
    }

    /**
     * calculate sum of selected tax amount
     * @returns {number}
     */
    private calculateSum() {
        return this.taxRenderData.reduce((pv, cv) => {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
    }

    /**
     * generate array of selected tax uniqueName
     * @returns {string[]}
     */
    private generateSelectedTaxes(): UpdateLedgerTaxData[] {
        return this.taxRenderData?.filter(p => p.isChecked).map(p => {
            let tax = new UpdateLedgerTaxData();
            tax.particular.name = p?.name;
            tax.particular.uniqueName = p?.uniqueName;
            tax.amount = p?.amount;
            return tax;
        });
    }

    /**
     * Calculates tax inclusively for Advance receipt else exclusively
     *
     * @private
     * @memberof UpdateLedgerTaxControlComponent
     */
    private calculateInclusiveOrExclusiveFormattedTax(): void {
        /**
         * Handles if functionality
         */
        if (this.isAdvanceReceipt) {
            // Inclusive tax calculation
            this.formattedTotal = `${giddhRoundOff((this.totalForTax * this.sum) / (100 + this.sum), this.giddhBalanceDecimalPlaces)}`;
        } else {
            // Exclusive tax calculation
            this.formattedTotal = `${giddhRoundOff(((this.totalForTax * this.sum) / 100), this.giddhBalanceDecimalPlaces)}`;
        }
    }

    /**
     * Adds styling on focused Dropdown List
     *
     * @param {HTMLElement} taxLabel
     * @memberof UpdateLedgerTaxControlComponent
     */
    public taxLabelFocusing(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusIn(taxLabel);
    }

    /**
     * Removes styling from focused Dropdown List
     *
     * @param {HTMLElement} taxLabel
     * @memberof UpdateLedgerTaxControlComponent
     */
    public taxLabelBluring(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusOut(taxLabel);
    }

    /**
     * Emits create new tax event
     *
     * @memberof UpdateLedgerTaxControlComponent
     */
    public createNew(): void {
        this.createNewTax.emit();
    }

    /**
     *  Lifecycle hook that is called after a component's view has been fully initialized.
     *
     * @memberof UpdateLedgerTaxControlComponent
     */
    public ngAfterViewInit(): void {
        this.viewInitEvent.emit(true);
    }
}
