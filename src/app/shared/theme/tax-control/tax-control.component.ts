import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TaxResponse } from '../../../models/api-models/Company';
import * as moment from 'moment';
import * as _ from 'lodash';

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
    .tax-dropdown-menu {
      position: absolute;
      /*top: 100%;*/
      left: 0;
      z-index: 1000;
      min-width: 160px;
      padding: 5px 0;
      margin: 2px 0 0;
      font-size: 14px;
      text-align: left;
      list-style: none;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ccc;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 4px;
      -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
      box-shadow: 0 6px 12px rgba(0, 0, 0, .175)
    }
  `],
  providers: [TAX_CONTROL_VALUE_ACCESSOR]
})
export class TaxControlComponent implements OnInit {

  @Input() public taxes: TaxResponse[];
  @Input() public applicableTaxes: any[];
  @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
  @Output() public selectedTaxesEvent: EventEmitter<string[]> = new EventEmitter();

  public taxRenderData: TaxControlData[] = [];
  public showTaxPopup: boolean = false;
  public sum: number = 0;
  public selectedTaxes: string[] = [];

  constructor() {
    //
  }

  public ngOnInit(): void {
    this.sum = 0;
    this.prepareTaxObject();
    this.change();
  }

  /**
   * prepare taxObject as per needed
   */
  public prepareTaxObject() {
    this.taxRenderData = [];
    this.taxes.map(tx => {
      let taxObj = new TaxControlData();
      taxObj.name = tx.name;
      taxObj.uniqueName = tx.uniqueName;
      taxObj.amount = tx.taxDetail[0].taxValue;
      taxObj.isChecked = this.applicableTaxes.indexOf(tx.uniqueName) > -1;
      this.taxRenderData.push(taxObj);
    });
  }

  /**
   * select/deselect tax checkbox
   */
  public change() {
    this.selectedTaxes = [];
    this.sum = this.calculateSum();
    this.selectedTaxes = this.generateSelectedTaxes();
    this.selectedTaxesEvent.emit(this.selectedTaxes);
    this.taxAmountSumEvent.emit(this.sum);
  }

  private isTaxApplicable(tax): boolean {
    const today = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY', true).valueOf();
    let isApplicable = false;
    _.each(tax.taxDetail, (det) => {
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
}
