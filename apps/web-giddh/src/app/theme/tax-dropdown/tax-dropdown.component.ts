import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
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
    styleUrls: ["./tax-dropdown.component.scss"]
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
    /** Emitter for create new tax selected */
    @Output() public createNewTax: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emitter for selected taxes */
    @Output() public selectedTaxes: EventEmitter<any> = new EventEmitter<any>();
    /** Emitter for taxes total */
    @Output() public totalTax: EventEmitter<any> = new EventEmitter<any>();
    /** Form Group for tax form */
    public taxForm: FormGroup;
    /** Total tax amount */
    public totalTaxAmount: number = 0;
    /** Default decimal places */
    private balanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
        if ((!isEqual(changes?.selectedTaxesList?.currentValue, changes?.selectedTaxesList?.previousValue)) || (!isEqual(changes?.taxesList?.currentValue, changes?.taxesList?.previousValue)) || (!isEqual(changes?.amount?.currentValue, changes?.amount?.previousValue))) {
            if (this.taxesList?.length) {
                this.addTaxesInForm();
                this.enableDisableTaxes();
            }
        }
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
        for (let i = 0; i <= taxes.length; i++) {
            taxes.controls[i]?.enable();
            taxes.controls[i]?.get('disableForDate')?.patchValue(false);

            if (taxes.controls[i]?.get('isChecked')?.value) {
                selectedTaxTypes[taxes.controls[i]?.get('taxType')?.value] = taxes.controls[i]?.get('uniqueName')?.value;
            }
        }

        for (let i = 0; i <= taxes.length; i++) {
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
     * @memberof TaxDropdownComponent
     */
    private calculateTaxAmount(): void {
        this.totalTaxAmount = 0;

        const taxes = this.taxForm.get('taxes') as FormArray;
        for (let i = 0; i <= taxes.length; i++) {
            if (taxes.controls[i]?.get('isChecked')?.value) {
                this.totalTaxAmount += ((Number(taxes.controls[i].get('taxDetail')?.value?.taxValue) / 100) * Number(this.amount));
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
}