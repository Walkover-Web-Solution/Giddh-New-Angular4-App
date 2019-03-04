import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TaxResponse } from '../../../models/api-models/Company';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { ITaxDetail } from '../../../models/interfaces/tax.interface';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { TaxControlData } from '../../../theme/tax-control/tax-control.component';

export const TAX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-forward-ref
  useExisting: forwardRef(() => UpdateLedgerTaxControlComponent),
  multi: true
};

export class UpdateLedgerTaxData {
  public particular: INameUniqueName = {name: '', uniqueName: ''};
  public amount: number = 0;
}

@Component({
  selector: 'update-ledger-tax-control',
  templateUrl: 'updateLedger-tax-control.component.html',
  styleUrls: [`./updateLedger-tax-control.component.scss`],
  providers: [TAX_CONTROL_VALUE_ACCESSOR]
})
export class UpdateLedgerTaxControlComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public date: string;
  @Input() public taxes: TaxResponse[];
  @Input() public applicableTaxes: any[];
  @Input() public taxRenderData: TaxControlData[];
  @Input() public showHeading: boolean = true;
  @Input() public showTaxPopup: boolean = false;
  @Input() public totalForTax: number = 0;
  @Output() public isApplicableTaxesEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
  @Output() public selectedTaxEvent: EventEmitter<UpdateLedgerTaxData[]> = new EventEmitter();

  public sum: number = 0;
  public formattedTotal: string;
  private selectedTaxes: UpdateLedgerTaxData[] = [];

  constructor() {
    //
  }

  public ngOnInit(): void {
    // this.sum = 0;
    // this.prepareTaxObject();
    // this.change();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['applicableTaxes'] && changes['applicableTaxes'].currentValue !== changes['applicableTaxes'].previousValue) {
      this.taxRenderData = [];
      this.sum = 0;
      this.prepareTaxObject();
      this.change();
    }

    if (changes['date'] && changes['date'].currentValue !== changes['date'].previousValue) {
      if (moment(changes['date'].currentValue, 'DD-MM-YYYY').isValid()) {
        this.sum = 0;
        this.prepareTaxObject();
        this.change();
      }
    }

    if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue) {
      this.formattedTotal = `${this.manualRoundOff((this.totalForTax * this.sum) / 100)} (${this.sum})`;
    }
  }

  /**
   * prepare taxObject as per needed
   */
  public prepareTaxObject() {
    // if updating don't recalculate
    if (this.taxRenderData.length) {
      return;
    }
    this.taxes.map(tx => {
      let taxObj = new TaxControlData();
      taxObj.name = tx.name;
      taxObj.uniqueName = tx.uniqueName;
      if (this.date) {
        let taxObject = _.orderBy(tx.taxDetail, (p: ITaxDetail) => {
          return moment(p.date, 'DD-MM-YYYY');
        }, 'desc');
        let exactDate = taxObject.filter(p => moment(p.date, 'DD-MM-YYYY').isSame(moment(this.date, 'DD-MM-YYYY')));
        if (exactDate.length > 0) {
          taxObj.amount = exactDate[0].taxValue;
        } else {
          let filteredTaxObject = taxObject.filter(p => moment(p.date, 'DD-MM-YYYY') < moment(this.date, 'DD-MM-YYYY'));
          if (filteredTaxObject.length > 0) {
            taxObj.amount = filteredTaxObject[0].taxValue;
          } else {
            taxObj.amount = 0;
          }
        }
      } else {
        taxObj.amount = tx.taxDetail[0].taxValue;
      }
      taxObj.isChecked = (this.applicableTaxes && (this.applicableTaxes.indexOf(tx.uniqueName) > -1));
      // if (taxObj.amount && taxObj.amount > 0) {
      this.taxRenderData.push(taxObj);
      // }
    });
  }

  public toggleTaxPopup(action: boolean) {
    this.showTaxPopup = action;
  }

  public trackByFn(index) {
    return index; // or item.id
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
    this.formattedTotal = `${this.manualRoundOff((this.totalForTax * this.sum) / 100)} (${this.sum})`;
    this.selectedTaxes = this.generateSelectedTaxes();
    this.taxAmountSumEvent.emit(this.sum);
    this.selectedTaxEvent.emit(this.selectedTaxes);

    let diff: boolean;
    if (this.selectedTaxes.length > 0) {
      diff = _.difference(this.selectedTaxes, this.applicableTaxes).length > 0;
    } else {
      diff = this.applicableTaxes.length > 0;
    }

    if (diff) {
      this.isApplicableTaxesEvent.emit(false);
    } else {
      this.isApplicableTaxesEvent.emit(true);
    }
  }

  private isTaxApplicable(tax): boolean {
    const today = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY', true).valueOf();
    let isApplicable = false;
    _.each(tax.taxDetail, (det: any) => {
      if (today >= moment(det.date, 'DD-MM-YYYY', true).valueOf()) {
        return isApplicable = true;
      }
    });
    return isApplicable;
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
    return this.taxRenderData.filter(p => p.isChecked).map(p => {
      let tax = new UpdateLedgerTaxData();
      tax.particular.name = p.name;
      tax.particular.uniqueName = p.uniqueName;
      tax.amount = p.amount;
      return tax;
    });
  }

  private manualRoundOff(num: number) {
    return Math.round(num * 100) / 100;
  }
}
