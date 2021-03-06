import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';

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
    public isDisabledCalMethod: boolean = false;
    public taxesOptions: IOption[] = [];
    public selectedTaxUniqueName: string;

    public calculationMethodOptions: IOption[];

    constructor() {
    }

    ngOnInit() {
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

    ngOnChanges(changes: SimpleChanges): void {
        if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
            this.otherTaxesModal = changes.otherTaxesModal.currentValue;
            if (this.otherTaxesModal.appliedOtherTax) {
                this.selectedTaxUniqueName = this.otherTaxesModal.appliedOtherTax.uniqueName;
                this.applyTax({ label: this.otherTaxesModal.appliedOtherTax.name, value: this.otherTaxesModal.appliedOtherTax.uniqueName });
            }
        }

    }

    public applyTax(tax: IOption) {
        if (tax && tax.value) {
            this.otherTaxesModal.appliedOtherTax = { name: tax.label, uniqueName: tax.value };
            let taxType = this.taxes.find(f => f.uniqueName === tax.value).taxType;
            this.isDisabledCalMethod = ['tdsrc', 'tdspay'].includes(taxType);
        }
    }

    public onClear() {
        this.otherTaxesModal.appliedOtherTax = null;
        this.isDisabledCalMethod = false;
        this.otherTaxesModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
    }

    public saveTaxes() {
        this.applyTaxes.emit(this.otherTaxesModal);
    }
}
