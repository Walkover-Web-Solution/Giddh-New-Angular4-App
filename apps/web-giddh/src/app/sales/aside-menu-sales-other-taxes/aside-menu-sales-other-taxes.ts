import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'app-aside-menu-sales-other-taxes',
    templateUrl: './aside-menu-sales-other-taxes.html',
    styleUrls: [`./aside-menu-sales-other-taxes.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AsideMenuSalesOtherTaxes implements OnInit, OnChanges {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
    @Input() public otherTaxesModal: SalesOtherTaxesModal;
    @Input() public taxes: TaxResponse[] = [];
    @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
    public taxesOptions: IOption[] = [];
    public selectedTaxUniqueName: string;
    public calculationMethodOptions: IOption[];
    /** This will hold default data of other taxes */
    public defaultOtherTaxesModal: SalesOtherTaxesModal;

    constructor() {
    }

    public ngOnInit(): void {
        this.calculationMethodOptions = [
            { label: this.commonLocaleData?.app_on_taxable_value, value: 'OnTaxableAmount' },
            { label: this.commonLocaleData?.app_on_total_value, value: 'OnTotalAmount' },
        ];

        this.taxesOptions = this.taxes
            .filter(f => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType))
            .map(m => {
                return { label: m.name, value: m.uniqueName };
            })
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
            this.otherTaxesModal = changes.otherTaxesModal.currentValue;
            this.defaultOtherTaxesModal = cloneDeep(changes.otherTaxesModal.currentValue);

            if (this.defaultOtherTaxesModal.appliedOtherTax) {
                this.selectedTaxUniqueName = this.defaultOtherTaxesModal.appliedOtherTax.uniqueName;
                this.applyTax({ label: this.defaultOtherTaxesModal.appliedOtherTax.name, value: this.defaultOtherTaxesModal.appliedOtherTax.uniqueName });
            }
        }
    }

    public applyTax(tax: IOption): void {
        if (tax && tax.value) {
            this.defaultOtherTaxesModal.appliedOtherTax = { name: tax.label, uniqueName: tax.value };
            if (!this.selectedTaxUniqueName) {
                let taxType = this.taxes.find(f => f.uniqueName === tax.value).taxType;
                const isTdsTax = ['tdsrc', 'tdspay'].includes(taxType);
                if (!isTdsTax) {
                    this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTotalAmount;
                } else {
                    this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
                }
            }
        }
    }

    public onClear(): void {
        this.defaultOtherTaxesModal.appliedOtherTax = null;
        this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
    }

    public saveTaxes(): void {
        this.otherTaxesModal = cloneDeep(this.defaultOtherTaxesModal);
        this.applyTaxes.emit(this.otherTaxesModal);
    }

    /**
     *Close the aside-menu-modal
     *
     * @memberof AsideMenuSalesOtherTaxes
     */
    public closeTaxesModal(): void {
        this.closeModal.emit(true);
    }
}
