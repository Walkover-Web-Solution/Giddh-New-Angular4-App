import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment/moment';
import * as _ from '../../lodash-optimized';
import { TaxResponse } from '../../models/api-models/Company';
import { ITaxDetail } from '../../models/interfaces/tax.interface';
import { ReplaySubject } from 'rxjs';

export const TAX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-forward-ref
  useExisting: forwardRef(() => TaxControlComponent),
  multi: true
};

export class TaxControlData {
  public name: string;
  public uniqueName: string;
  public amount: number;
  public isChecked: boolean;
}

@Component({
  selector: 'tax-control',
  templateUrl: 'tax-control.component.html',
  styles: [`
    .form-control[readonly] {
      background: inherit !important;
    }

    .single-item .dropdown-menu {
      height: 50px !important;
    }

    :host .dropdown-menu {
      min-width: 200px;
      height: inherit;
      padding: 0;
      overflow: auto;
    }

    .fakeLabel {
      cursor: pointer;
      padding: 5px 10px;
      line-height: 24px;
    }
  `],
  providers: [TAX_CONTROL_VALUE_ACCESSOR]
})
export class TaxControlComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public date: string;
  @Input() public taxes: TaxResponse[];
  @Input() public applicableTaxes: any[];
  @Input() public taxRenderData: TaxControlData[];
  @Input() public showHeading: boolean = true;
  @Input() public showTaxPopup: boolean = false;
  @Input() public totalForTax: number = 0;
  @Output() public isApplicableTaxesEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
  @Output() public selectedTaxEvent: EventEmitter<string[]> = new EventEmitter();

  public sum: number = 0;
  public formattedTotal: string;
  private selectedTaxes: string[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit(): void {
    this.sum = 0;
    this.taxRenderData.splice(0, this.taxRenderData.length);
    this.prepareTaxObject();
    this.change();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // change
    if ('date' in changes && changes.date.currentValue !== changes.date.previousValue) {
      if (moment(changes['date'].currentValue, 'DD-MM-YYYY').isValid()) {
        this.sum = 0;
        this.prepareTaxObject();
        this.change();
      }
    }

    // if ('taxes' in changes && changes.taxes.currentValue !== changes.taxes.previousValue) {
    //   this.sum = 0;
    //   this.prepareTaxObject();
    //   this.change();
    // }

    if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue) {
      this.formattedTotal = `${this.manualRoundOff((this.totalForTax * this.sum) / 100)} (${this.sum}%)`;
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
    // let selectedTax = this.taxRenderData.length > 0 ? this.taxRenderData.filter(p => p.isChecked) : [];
    // while (this.taxRenderData.length > 0) {
    //   this.taxRenderData.pop();
    // }
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
      // let oldValue = null;
      // if (selectedTax.findIndex(p => p.uniqueName === tx.uniqueName) > -1) {
      //   oldValue = selectedTax[selectedTax.findIndex(p => p.uniqueName === tx.uniqueName)];
      // }
      taxObj.isChecked = (this.applicableTaxes && (this.applicableTaxes.indexOf(tx.uniqueName) > -1));
      // if (taxObj.amount && taxObj.amount > 0) {
      this.taxRenderData.push(taxObj);
      // }
    });
  }

  public trackByFn(index) {
    return index; // or item.id
  }

  /**
   * hide menus on outside click of span
   */
  public toggleTaxPopup(action: boolean) {
    this.showTaxPopup = action;
  }

  public ngOnDestroy() {
    this.taxAmountSumEvent.unsubscribe();
    this.isApplicableTaxesEvent.unsubscribe();
    this.selectedTaxEvent.unsubscribe();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * select/deselect tax checkbox
   */
  public change() {
    this.selectedTaxes = [];
    this.sum = this.calculateSum();
    this.formattedTotal = `${this.manualRoundOff((this.totalForTax * this.sum) / 100)} (${this.sum}%)`;
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
  private generateSelectedTaxes(): string[] {
    return this.taxRenderData.filter(p => p.isChecked).map(p => p.uniqueName);
  }

  private manualRoundOff(num: number) {
    return Math.round(num * 100) / 100;
  }
}
