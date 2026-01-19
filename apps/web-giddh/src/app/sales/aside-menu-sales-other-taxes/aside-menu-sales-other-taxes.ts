import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { cloneDeep } from '../../lodash-optimized';
import { IOption } from '../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-aside-menu-sales-other-taxes',
    templateUrl: './aside-menu-sales-other-taxes.html',
    styleUrls: [`./aside-menu-sales-other-taxes.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

/**
 * AsideMenuSalesOtherTaxes class
 * Implements AsideMenuSalesOtherTaxes functionality
 */
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
    /** Holds calculation method name */
    public calculationMethodLabel: string = '';
    /** This will hold default data of other taxes */
    public defaultOtherTaxesModal: SalesOtherTaxesModal;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit(): void {
        this.calculationMethodOptions = [
            { label: this.commonLocaleData?.app_on_taxable_value, value: 'OnTaxableAmount' },
            { label: this.commonLocaleData?.app_on_total_value, value: 'OnTotalAmount' },
        ];
        this.calculationMethodLabel = this.calculationMethodOptions.find(method => method.value === this.defaultOtherTaxesModal.tcsCalculationMethod).label;

        this.taxesOptions = this.taxes
            ?.filter(f => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType))
            .map(m => {
                return { label: m.name, value: m?.uniqueName };
            })
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
            this.otherTaxesModal = changes.otherTaxesModal.currentValue;
            this.defaultOtherTaxesModal = cloneDeep(changes.otherTaxesModal.currentValue);

            /**
             * Handles if functionality
             */
            if (this.defaultOtherTaxesModal.appliedOtherTax) {
                this.selectedTaxUniqueName = this.defaultOtherTaxesModal.appliedOtherTax?.uniqueName;
                this.applyTax({ label: this.defaultOtherTaxesModal.appliedOtherTax?.name, value: this.defaultOtherTaxesModal.appliedOtherTax?.uniqueName });
            }
        }
    }

    /**
     * Handles applyTax functionality
     */
    public applyTax(tax: IOption): void {
        /**
         * Handles if functionality
         */
        if (tax && tax.value) {
            this.defaultOtherTaxesModal.appliedOtherTax = { name: tax.label, uniqueName: tax.value };
            /**
             * Handles if functionality
             */
            if (!this.selectedTaxUniqueName) {
                let taxType = this.taxes.find(f => f?.uniqueName === tax.value).taxType;
                const isTdsTax = ['tdsrc', 'tdspay'].includes(taxType);
                /**
                 * Handles if functionality
                 */
                if (!isTdsTax) {
                    this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTotalAmount;
                } else {
                    this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
                }
            }
        }
    }

    /**
     * Handles clear event
     */
    public onClear(): void {
        this.defaultOtherTaxesModal.appliedOtherTax = null;
        this.defaultOtherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
    }

    /**
     * Saves taxes data
     */
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
