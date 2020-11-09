import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';

@Component({
    selector: 'app-aside-menu-sales-other-taxes',
    templateUrl: './aside-menu-sales-other-taxes.html',
    styleUrls: [`./aside-menu-sales-other-taxes.scss`]
})

export class AsideMenuSalesOtherTaxes implements OnInit, OnChanges {
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
    @Input() public otherTaxesModal: SalesOtherTaxesModal;
    @Input() public taxes: TaxResponse[] = [];
    @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
    public isDisabledCalMethod: boolean = false;
    public taxesOptions: IOption[] = [];
    public selectedTaxUniqueName: string;

    public calculationMethodOptions: IOption[] = [
        { label: 'On Taxable Value (Amt - Dis)', value: 'OnTaxableAmount' },
        { label: 'On Total Value (Taxable + Gst + Cess)', value: 'OnTotalAmount' },
    ];

    constructor() {
    }

    ngOnInit() {
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
