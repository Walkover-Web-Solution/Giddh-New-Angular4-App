import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaxResponse } from '../../models/api-models/Company';
import { ITaxDetail } from '../../models/interfaces/tax.interface';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { AppState } from '../../store';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { isEqual, orderBy } from '../../lodash-optimized';
import { GeneralService } from '../../services/general.service';

export const TAX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => TaxControlComponent),
    multi: true
};

export class TaxControlData {
    public name?: string;
    public uniqueName: string;
    public amount?: number;
    public isChecked?: boolean;
    public isDisabled?: boolean;
    public type?: string;
    public calculationMethod?: string;
}

@Component({
    selector: 'tax-control',
    templateUrl: 'tax-control.component.html',
    styleUrls: ['./tax-control.component.scss'],
    providers: [TAX_CONTROL_VALUE_ACCESSOR]
})

export class TaxControlComponent implements OnInit, OnDestroy, OnChanges {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public date: string;
    @Input() public taxes: TaxResponse[];
    @Input() public applicableTaxes: string[] = [];
    @Input() public taxRenderData: TaxControlData[];
    @Input() public showHeading: boolean = true;
    /** Custom heading to be applied to tax control header */
    @Input() public customHeading: string = '';
    /** True, if mandatory asterisk needs to be displayed */
    @Input() public isMandatory: boolean = false;
    @Input() public showTaxPopup: boolean = false;
    @Input() public totalForTax: number = 0;
    @Input() public rootClass: string = 'ledger-panel';

    @Input() public customTaxTypesForTaxFilter: string[] = [];
    @Input() public exceptTaxTypes: string[] = [];
    @Input() public allowedSelection: number = 0;
    @Input() public allowedSelectionOfAType: { type: string[], count: number };
    @Input() public maskInput: string;
    @Input() public prefixInput: string;
    @Input() public suffixInput: string;
    /** True, if current transaction is advance receipt
     * Required for inclusive tax rate calculation
    */
    @Input() public isAdvanceReceipt: boolean;

    @Output() public isApplicableTaxesEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
    @Output() public selectedTaxEvent: EventEmitter<string[]> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();


    @ViewChild('taxInputElement', { static: false }) public taxInputElement: ElementRef;

    public taxSum: number = 0;
    public taxTotalAmount: number = 0;
    public giddhBalanceDecimalPlaces: number = 2;
    private selectedTaxes: string[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private cdr: ChangeDetectorRef,
        private store: Store<AppState>,
        private generalService: GeneralService
    ) { }

    public ngOnInit(): void {
        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
        if (this.taxes) {
            this.prepareTaxObject();
            this.change();
            this.cdr.detectChanges();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        // change
        if ('date' in changes && changes.date.currentValue !== changes.date.previousValue) {
            this.date = (typeof changes['date'].currentValue === "object") ? dayjs(changes['date'].currentValue).format(GIDDH_DATE_FORMAT) : changes['date'].currentValue;
            if (dayjs(changes['date'].currentValue, GIDDH_DATE_FORMAT).isValid()) {
                this.taxSum = 0;
                this.prepareTaxObject();
                this.change();
            }
        }

        if ('applicableTaxes' in changes && (Array.isArray(changes.applicableTaxes.currentValue)) && !isEqual(changes.applicableTaxes.currentValue, changes.applicableTaxes.previousValue)) {
            this.prepareTaxObject();
            this.change();
        }

        if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue) {
            this.calculateInclusiveOrExclusiveTaxes();
        }
        if (changes['isAdvanceReceipt'] && changes['isAdvanceReceipt'].currentValue !== changes['isAdvanceReceipt'].previousValue) {
            this.change();
        }

        if ('taxes' in changes && changes && (Array.isArray(changes.taxes.currentValue))) {
            this.prepareTaxObject();
            this.change();
        }

        this.cdr.detectChanges();
    }

    /**
     * prepare taxObject as per needed
     */
    public prepareTaxObject() {
        if (this.customTaxTypesForTaxFilter && this.customTaxTypesForTaxFilter.length) {
            this.taxes = this.taxes?.filter(f => this.customTaxTypesForTaxFilter.includes(f.taxType));
        }

        if (this.exceptTaxTypes && this.exceptTaxTypes.length) {
            this.taxes = this.taxes?.filter(f => !this.exceptTaxTypes.includes(f.taxType));
        }

        this.taxes.map(tax => {
            let index = this.taxRenderData.findIndex(f => f.uniqueName === tax.uniqueName);

            // if tax is already prepared then only check if it's checked or not on basis of applicable taxes
            if (index > -1) {
                this.taxRenderData[index].isChecked =
                    this.applicableTaxes && this.applicableTaxes.length ? this.applicableTaxes.some(item => item === tax.uniqueName) :
                        this.taxRenderData[index].isChecked ? this.taxRenderData[index].isChecked : false;
                if (this.date && tax.taxDetail && tax.taxDetail.length) {
                    this.taxRenderData[index].amount =
                        (dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)) || dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT)) ?
                            tax.taxDetail[0].taxValue : 0;
                }
            } else {

                let taxObj = new TaxControlData();
                taxObj.name = tax.name;
                taxObj.uniqueName = tax.uniqueName;
                taxObj.type = tax.taxType;

                if (this.date) {
                    let taxObject = orderBy(tax.taxDetail, (p: ITaxDetail) => {
                        return dayjs(p.date, GIDDH_DATE_FORMAT);
                    }, 'desc');
                    let exactDate = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)));
                    if (exactDate?.length > 0) {
                        taxObj.amount = exactDate[0].taxValue;
                    } else {
                        let filteredTaxObject = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT));
                        if (filteredTaxObject?.length > 0) {
                            taxObj.amount = filteredTaxObject[0].taxValue;
                        } else {
                            taxObj.amount = 0;
                        }
                    }
                } else {
                    taxObj.amount = tax.taxDetail[0].taxValue;
                }
                taxObj.isChecked = this.applicableTaxes && this.applicableTaxes.length ? this.applicableTaxes.some(s => s === tax.uniqueName) : false;

                taxObj.isDisabled = false;
                this.taxRenderData.push(taxObj);
            }
        });
        if (this.taxRenderData?.length) {
            this.taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
        }
    }

    public trackByFn(index, tax) {
        return tax.uniqueName; // or item.id
    }

    /**	
    * hide menus on outside click of span	
    */
    public toggleTaxPopup(action: any) {
        this.showTaxPopup = action;
    }


    public ngOnDestroy() {
        this.taxAmountSumEvent.unsubscribe();
        this.isApplicableTaxesEvent.unsubscribe();
        this.selectedTaxEvent.unsubscribe();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * select/deselect tax checkbox
     */
    public change(event?: any) {
        this.selectedTaxes = [];
        this.taxSum = this.calculateSum();
        this.calculateInclusiveOrExclusiveTaxes();
        this.selectedTaxes = this.generateSelectedTaxes();
        if (this.allowedSelection > 0) {
            if (this.selectedTaxes?.length >= this.allowedSelection) {
                this.taxRenderData.map(m => {
                    m.isDisabled = !m.isChecked;
                    return m;
                });
            } else {
                this.taxRenderData.map(m => {
                    m.isDisabled = m.isDisabled ? false : m.isDisabled;
                    return m;
                });
            }
        }

        if (this.allowedSelectionOfAType && this.allowedSelectionOfAType.type?.length) {
            this.allowedSelectionOfAType.type.forEach(taxType => {
                const selectedTaxes = this.taxRenderData?.filter(appliedTaxes => (appliedTaxes.isChecked && taxType === appliedTaxes.type));

                if (selectedTaxes?.length >= this.allowedSelectionOfAType.count) {
                    this.taxRenderData.map((taxesApplied => {
                        if (taxType === taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                        return taxesApplied;
                    }));
                } else {
                    this.taxRenderData.map((taxesApplied => {
                        if (taxType === taxesApplied.type && taxesApplied.isDisabled) {
                            taxesApplied.isDisabled = false;
                        }
                        return taxesApplied;
                    }));
                }
            });
            if (this.isAdvanceReceipt) {
                // In case of advance receipt only a single tax is allowed in addition to CESS
                // Check if atleast a single non-cess tax is selected, if yes, then disable all other taxes
                // except CESS taxes
                const atleastSingleTaxSelected: boolean = this.taxRenderData?.filter((tax) => tax.isChecked && tax.type !== 'gstcess')?.length !== 0;
                if (atleastSingleTaxSelected) {
                    this.taxRenderData.map((taxesApplied => {
                        if ('gstcess' !== taxesApplied.type && !taxesApplied.isChecked) {
                            taxesApplied.isDisabled = true;
                        }
                        return taxesApplied;
                    }));
                }
            }
        }
        setTimeout(() => {
            if (this.taxRenderData?.length) {
                this.taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
            }
        }, 100);
        this.taxAmountSumEvent.emit(this.taxSum);
        if (this.taxRenderData?.length > 0) {
            this.selectedTaxEvent.emit(this.selectedTaxes);
        }
    }

    public onFocusLastDiv(el) {
        el.stopPropagation();
        el.preventDefault();
        if (!this.showTaxPopup) {
            this.showTaxPopup = true;
            this.hideOtherPopups.emit(true);
            return;
        }
        let focussableElements = `.${this.rootClass} input[type=text]:not([disabled]),.${this.rootClass} [tabindex]:not([disabled]):not([tabindex="-1"])`;
        // if (document.activeElement && document.activeElement.form) {
        let focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
            (element) => {
                // check for visibility while always include the current activeElement
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
            });
        let index = focussable.indexOf(document.activeElement);
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
        this.taxInputElement?.nativeElement.classList.remove('error-box');
    }

    /**
     * Enables all the taxes if the item/particular account is changed
     *
     * @memberof TaxControlComponent
     */
    public enableAllTheTaxes(): void {
        if (this.taxRenderData?.length) {
            this.taxRenderData.forEach(tax => tax.isDisabled = false);
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
    private generateSelectedTaxes(): string[] {
        return this.taxRenderData?.filter(p => p.isChecked).map(p => p.uniqueName);
    }

    /**
     * Calculates tax inclusively for Advance receipt else exclusively
     *
     * @private
     * @param {number} totalPercentage Total percentage of tax
     * @memberof TaxControlComponent
     */
    private calculateInclusiveOrExclusiveTaxes(): void {
        if (this.isAdvanceReceipt) {
            // Inclusive tax rate
            this.taxTotalAmount = giddhRoundOff((this.totalForTax * this.taxSum) / (100 + this.taxSum), this.giddhBalanceDecimalPlaces);
        } else {
            // Exclusive tax rate
            this.taxTotalAmount = giddhRoundOff(((this.totalForTax * this.taxSum) / 100), this.giddhBalanceDecimalPlaces);
        }
    }

    /**	
    * Adds styling on focused Dropdown List	
    *	
    * @param {HTMLElement} taxLabel	
    * @memberof TaxControlComponent	
    */
    public taxLabelFocusing(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusIn(taxLabel);
    }
    /**	
     * Removes styling from focused Dropdown List	
     *	
     * @param {HTMLElement} taxLabel	
     * @memberof TaxControlComponent	
     */
    public taxLabelBluring(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusOut(taxLabel);
    }
}
