import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../models/api-models/Sales';

@Component({
  selector: 'app-aside-menu-sales-other-taxes',
  templateUrl: './aside-menu-sales-other-taxes.html',
  styleUrls: [`./aside-menu-sales-other-taxes.scss`]
})

export class AsideMenuSalesOtherTaxes implements OnInit, OnChanges {
  @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();
  @Input() public isSalesInvoice: boolean = true;
  @Input() public selectedAcc: string;
  @Input() public otherTaxesModal: SalesOtherTaxesModal;
  @Output() public applyTaxes: EventEmitter<SalesOtherTaxesModal> = new EventEmitter();
  public showCessTaxes: boolean = false;
  public allowedTaxTypes: string[] = ['tcsrc', 'tcspay'];

  public calculationMethodOptions: IOption[] = [
    {label: 'On Taxable Value (Amt - Dis)', value: 'OnTaxableAmount'},
    {label: 'On Total Value (Taxable + Gst)', value: 'OnTotalAmount'},
  ];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isSalesInvoice' in changes && changes.isSalesInvoice.currentValue !== changes.isSalesInvoice.previousValue) {
      this.prepareTaxTypes();
    }

    if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
      if (this.otherTaxesModal.appliedCessTaxes && this.otherTaxesModal.appliedCessTaxes.length > 0) {
        this.showCessTaxes = true;
      }
    }
  }

  public applyTax(taxes: string[], isCessTax: boolean = false) {
    if (isCessTax) {
      this.otherTaxesModal.appliedCessTaxes = taxes;
    } else {
      this.otherTaxesModal.appliedTdsTcsTaxes = taxes;
    }
  }

  private prepareTaxTypes() {
    this.allowedTaxTypes = this.isSalesInvoice ? ['tcsrc', 'tcspay'] : ['tdsrc', 'tdspay'];
  }

  public saveTaxes() {
    this.applyTaxes.emit(this.otherTaxesModal);
  }
}
