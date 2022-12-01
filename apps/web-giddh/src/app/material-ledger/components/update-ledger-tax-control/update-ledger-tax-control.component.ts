import {
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
import { ITaxDetail } from '../../../models/interfaces/tax.interface';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { difference, orderBy } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';

export const TAX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => UpdateLedgerTaxControlComponent),
    multi: true
};

export class UpdateLedgerTaxData {
    public particular: INameUniqueName = { name: '', uniqueName: '' };
    public amount: number = 0;
}

@Component({
    selector: 'update-ledger-tax-control',
    templateUrl: 'update-ledger-tax-control.component.html',
    styleUrls: [`./update-ledger-tax-control.component.scss`],
    providers: [TAX_CONTROL_VALUE_ACCESSOR]
})
export class UpdateLedgerTaxControlComponent implements OnDestroy, OnChanges {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public date: string;
    @Input() public taxes: TaxResponse[];
    @Input() public applicableTaxes: any[];
    @Input() public taxRenderData: TaxControlData[];
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

    @Output() public isApplicableTaxesEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
    @Output() public selectedTaxEvent: EventEmitter<UpdateLedgerTaxData[]> = new EventEmitter();
    @Output() public hideOtherPopups: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** Tax input field */
    @ViewChild('taxInputElement', { static: true }) public taxInputElement: ElementRef;

    public sum: number = 0;
    public formattedTotal: string;
    private selectedTaxes: UpdateLedgerTaxData[] = [];

    constructor(private generalService: GeneralService) {

    }

    public ngOnChanges(changes: SimpleChanges) {
        if ('applicableTaxes' in changes || 'date' in changes) {
            const hasApplicableTaxesChanged = changes['applicableTaxes'] && changes['applicableTaxes'].currentValue !== changes['applicableTaxes'].previousValue;
            if (hasApplicableTaxesChanged) {
                this.taxRenderData = [];
            }
            const hasDateChanged = changes['date'] && changes['date'].currentValue !== changes['date'].previousValue && dayjs(changes['date'].currentValue, GIDDH_DATE_FORMAT).isValid();
            if (hasApplicableTaxesChanged || hasDateChanged) {
                this.sum = 0;
                this.prepareTaxObject();
                this.change();
            }
        }

        if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue ||
            changes['isAdvanceReceipt'] && changes['isAdvanceReceipt'].currentValue !== changes['isAdvanceReceipt'].previousValue) {
            this.calculateInclusiveOrExclusiveFormattedTax();
            this.taxAmountSumEvent.emit(this.sum);
        }
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
            const index = this.taxRenderData.findIndex(f => f?.uniqueName === tax?.uniqueName);
            // if tax is already prepared then only check if it's checked or not on basis of applicable taxes
            if (index > -1) {
                if (this.date && tax.taxDetail && tax.taxDetail.length) {
                    this.taxRenderData[index].amount =
                        (dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)) || dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT)) ?
                            tax.taxDetail[0].taxValue : 0;
                }
            } else {
                let taxObj = new TaxControlData();
                taxObj.name = tax?.name;
                taxObj.type = tax?.taxType;
                taxObj.uniqueName = tax?.uniqueName;
                if (this.date) {
                    let taxObject = orderBy(tax.taxDetail, (p: ITaxDetail) => {
                        return dayjs(p.date, GIDDH_DATE_FORMAT);
                    }, 'desc');
                    let exactDate = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT).isSame(dayjs(this.date, GIDDH_DATE_FORMAT)));
                    if (exactDate && exactDate.length > 0) {
                        taxObj.amount = exactDate[0].taxValue;
                    } else {
                        let filteredTaxObject = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT) < dayjs(this.date, GIDDH_DATE_FORMAT));
                        if (filteredTaxObject && filteredTaxObject.length > 0) {
                            taxObj.amount = filteredTaxObject[0].taxValue;
                        } else {
                            taxObj.amount = 0;
                        }
                    }
                } else {
                    taxObj.amount = tax.taxDetail[0].taxValue;
                }
                taxObj.isChecked = (this.applicableTaxes && (this.applicableTaxes.indexOf(tax?.uniqueName) > -1));
                this.taxRenderData.push(taxObj);
            }
        });
        if (this.taxRenderData?.length) {
            this.taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
        }
    }

    public toggleTaxPopup(action: boolean) {
        this.showTaxPopup = action;
    }

    public trackByFn(index) {
        return index;
    }

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

        if (this.allowedSelection > 0) {
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
        if (this.allowedSelectionOfAType && this.allowedSelectionOfAType.type && this.allowedSelectionOfAType.type.length) {
            this.allowedSelectionOfAType.type.forEach(taxType => {
                const selectedTaxes = this.taxRenderData?.filter(appliedTaxes => (appliedTaxes.isChecked && taxType === appliedTaxes.type));

                if (selectedTaxes && selectedTaxes.length >= this.allowedSelectionOfAType.count) {
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
                let singleSelectedTax = this.taxRenderData?.filter((tax) => tax.isChecked && tax.type !== 'gstcess');
                const atleastSingleTaxSelected: boolean = singleSelectedTax && singleSelectedTax.length !== 0;
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
        });

        this.taxAmountSumEvent.emit(this.sum);
        this.selectedTaxEvent.emit(this.selectedTaxes);

        let diff: boolean;
        if (this.selectedTaxes && this.selectedTaxes.length > 0) {
            let taxDifference = difference(this.selectedTaxes, this.applicableTaxes);
            diff = taxDifference && taxDifference.length > 0;
        } else {
            diff = this.applicableTaxes && this.applicableTaxes.length > 0;
        }

        if (diff) {
            this.isApplicableTaxesEvent.emit(false);
        } else {
            this.isApplicableTaxesEvent.emit(true);
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
        let focussableElements = '.entrypanel input[type=text]:not([disabled]),.entrypanel [tabindex]:not([disabled]):not([tabindex="-1"])';
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
        if (this.isAdvanceReceipt) {
            // Inclusive tax calculation
            this.formattedTotal = `${giddhRoundOff((this.totalForTax * this.sum) / (100 + this.sum), 2)}`;
        } else {
            // Exclusive tax calculation
            this.formattedTotal = `${giddhRoundOff(((this.totalForTax * this.sum) / 100), 2)}`;
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
}
