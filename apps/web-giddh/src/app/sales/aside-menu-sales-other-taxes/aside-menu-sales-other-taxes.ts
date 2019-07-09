import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';
import { TaxResponse } from '../../models/api-models/Company';
import { matchTimestamp } from 'ngx-bootstrap/chronos/parse/regex';

@Component({
  selector: 'app-aside-menu-sales-other-taxes',
  templateUrl: './aside-menu-sales-other-taxes.html',
  styleUrls: [`./aside-menu-sales-other-taxes.scss`]
})

export class AsideMenuSalesOtherTaxes implements OnInit, OnChanges {
  @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
  @Input() public otherTaxesModal: SalesOtherTaxesModal;
  @Input() public allowedTaxTypes: string[] = ['tcsrc', 'tcspay'];
  @Input() public taxes: TaxResponse[] = [];
  @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
  public showCessTaxes: boolean = false;
  public isDisabledCalMethod: boolean = false;
  public selectedTaxName = '';

  public calculationMethodOptions: IOption[] = [
    {label: 'On Taxable Value (Amt - Dis)', value: 'OnTaxableAmount'},
    {label: 'On Total Value (Taxable + Gst + Cess)', value: 'OnTotalAmount'},
  ];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
      if (this.otherTaxesModal.appliedCessTaxes && this.otherTaxesModal.appliedCessTaxes.length > 0) {
        this.showCessTaxes = true;
      }

      if (this.otherTaxesModal.appliedTdsTcsTaxes && this.otherTaxesModal.appliedTdsTcsTaxes.length > 0) {
        this.selectedTaxName = this.taxes.filter(f => f.uniqueName === this.otherTaxesModal.appliedTdsTcsTaxes[0]).map(m => m.name).toString();
      }
    }

    if ('allowedTaxTypes' in changes && changes.allowedTaxTypes.currentValue !== changes.allowedTaxTypes.previousValue) {
      this.isDisabledCalMethod = this.allowedTaxTypes.some(s => ['tdsrc', 'tdspay'].includes(s));
      if (this.isDisabledCalMethod) {
        this.otherTaxesModal.tdsTcsCalcMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
      }
    }
  }

  public applyTax(taxes: string[], isCessTax: boolean = false) {
    this.selectedTaxName = this.taxes.filter(f => f.uniqueName === taxes[0]).map(m => m.name).toString();
    if (isCessTax) {
      this.otherTaxesModal.appliedCessTaxes = taxes;
    } else {
      this.otherTaxesModal.appliedTdsTcsTaxes = taxes;
    }
  }

  public saveTaxes() {
    this.applyTaxes.emit(this.otherTaxesModal);
  }
}
