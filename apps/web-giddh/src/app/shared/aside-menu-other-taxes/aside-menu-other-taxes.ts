import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { ReplaySubject } from 'rxjs';
import { cloneDeep } from '../../lodash-optimized';
import { IOption } from '../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-aside-menu-other-taxes',
    templateUrl: './aside-menu-other-taxes.html',
    styleUrls: ['./aside-menu-other-taxes.scss'],
    host: { 'class': 'app-aside-menu-other-taxes' },
    standalone: false
})
/**
 * AsideMenuOtherTaxes class
 * Implements AsideMenuOtherTaxes functionality
 */
export class AsideMenuOtherTaxes implements OnInit, OnChanges, OnDestroy {
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
    @Input() public otherTaxesModal: SalesOtherTaxesModal;
    @Input() public taxes: TaxResponse[] = [];
    @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
    public taxesOptions: IOption[] = [];
    public selectedTaxUniqueName: string;
    public calculationMethodOptions: IOption[] = [];
    /** To unsubscribe from subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This will hold default data of other taxes */
    public defaultOtherTaxesModal: SalesOtherTaxesModal;
    /** Selected calculation method label */
    public selectedCalculationMethod: any;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
    ) {
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit(): void {
        document.querySelector("body").classList.add("aside-menu-othertax-open");
        this.addZindexCdkOverlay();
        this.taxesOptions = this.taxes
            ?.filter(f => ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType))
            .map(m => {
                return { label: m.name, value: m?.uniqueName };
            })

        this.calculationMethodOptions = [
            { label: this.commonLocaleData?.app_on_taxable_value, value: 'OnTaxableAmount' },
            { label: this.commonLocaleData?.app_on_total_value, value: 'OnTotalAmount' }
        ];

        this.selectedCalculationMethod = this.calculationMethodOptions?.filter(method => method?.value === this.otherTaxesModal?.tcsCalculationMethod);
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
                this.selectedTaxUniqueName = this.defaultOtherTaxesModal.appliedOtherTax.uniqueName;
                this.applyTax({ label: this.defaultOtherTaxesModal.appliedOtherTax.name, value: this.defaultOtherTaxesModal.appliedOtherTax.uniqueName });
            }

            /**
             * Handles if functionality
             */
            if (this.calculationMethodOptions?.length > 0) {
                this.selectedCalculationMethod = this.calculationMethodOptions?.filter(method => method?.value === this.otherTaxesModal.tcsCalculationMethod);
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
        if (tax && tax?.value) {
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
     * Unsubscribes to listeners
     *
     * @memberof AsideMenuOtherTaxes
     */
    public ngOnDestroy(): void {
        document.querySelector("body").classList.remove("aside-menu-othertax-open");
        this.removeZindexCdkOverlay();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Close the aside-menu-modal
     *
     * @memberof AsideMenuOtherTaxes
     */
    public closeTaxesModal(event: any): void {
        /**
         * Handles if functionality
         */
        if (event?.target?.className?.indexOf("option") === -1) {
            this.closeModal.emit(true);
        }
    }

    /**
     * This will use for onCalculate tax method
     *
     * @param {IOption} tax
     * @memberof AsideMenuOtherTaxes
     */
    public onCalculateTax(tax: IOption): void {
        /**
         * Handles if functionality
         */
        if (tax && tax.value) {
            this.defaultOtherTaxesModal.tcsCalculationMethod = (tax.value === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) ? SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount : SalesOtherTaxesCalculationMethodEnum.OnTotalAmount;
        }
    }

    /**
     * Adds Z-index class to cdk-overlay element
     *
     * @memberof AsideMenuOtherTaxes
     */
    public addZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.add('cdk-overlay-container-z-index');
    }

    /**
     * Removes Z-index class to cdk-overlay element
     *
     * @memberof AsideMenuOtherTaxes
     */
    public removeZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.remove('cdk-overlay-container-z-index');
    }
}
