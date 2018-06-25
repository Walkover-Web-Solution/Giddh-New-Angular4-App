import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { TaxResponse } from 'app/models/api-models/Company';
import { ITaxList } from 'app/models/api-models/Sales';
import { findIndex, forEach, indexOf, each, find } from 'app/lodash-optimized';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ITaxDetail } from 'app/models/interfaces/tax.interface';

@Component({
  selector: 'sales-tax-list',
  templateUrl: './sales.tax.list.component.html',
  styles: [`
    :host .dropdown-menu{
      min-width: 200px;
      height: inherit;
      padding: 0;
      overflow: auto;
    }
    :host .fake-disabled-label{
      cursor: not-allowed;
      opacity: .5;
    }
    .form-control[readonly] {
      background: #fff !important;
    }
    `],
  providers: []
})

export class SalesTaxListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public taxes: TaxResponse[];
  @Input() public applicableTaxes: any[];
  @Input() public taxListAutoRender: ITaxList[];
  @Input() public showTaxPopup: boolean = false;
  @Output() public selectedTaxEvent: EventEmitter<string[]> = new EventEmitter();
  @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
  @ViewChild('taxListUl') public taxListUl: ElementRef;

  public sum: number = 0;
  public taxList: ITaxList[] = [];
  public selectedTax: string[] = [];
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnDestroy() {
    this.taxAmountSumEvent.unsubscribe();
    this.selectedTaxEvent.unsubscribe();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnInit(): void {
    this.makeTaxList();
    this.distendFn();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if ('taxes' in changes && changes.taxes.currentValue !== changes.taxes.previousValue) {
      this.makeTaxList();
      this.distendFn();
    }

    if ('taxListAutoRender' in changes && changes.taxListAutoRender.currentValue !== changes.taxListAutoRender.previousValue) {
      this.distendFn();
    }

    if ('applicableTaxes' in changes && changes.applicableTaxes.currentValue !== changes.applicableTaxes.previousValue) {
      this.applicableTaxesFn();
    }
  }

  /**
   * imp to use multiple elements
   */
  public trackByFn(index) {
    return index;
  }

  public reCalculate() {
    this.distendFn();
  }

  public taxInputBlur(event) {
    if (event && event.relatedTarget && !this.taxListUl.nativeElement.contains(event.relatedTarget)) {
      this.toggleTaxPopup(false);
    }
  }

  /**
   * hide menus on outside click of span
   */
  public toggleTaxPopup(action: boolean) {
    this.showTaxPopup = action;
  }

  private distendFn() {
    // set values
    this.sum = this.calculateSum();
    this.selectedTax = this.getSelectedTaxes();

    // emit events
    this.selectedTaxEvent.emit(this.selectedTax);
    this.taxAmountSumEvent.emit(this.sum);
  }

  private applicableTaxesFn() {
    if (this.applicableTaxes && this.applicableTaxes.length > 0) {
      this.taxList.map((item: ITaxList) => {
        item.isChecked = (indexOf(this.applicableTaxes, item.uniqueName) !== -1) ? this.getIsTaxApplicable(item.uniqueName) : false;
        item.isDisabled = false;
        return item;
      });
    }else {
      this.taxList.map((item: ITaxList) => {
        item.isChecked = false;
        item.isDisabled = false;
        return item;
      });
    }
    this.distendFn();
  }

  private getIsTaxApplicable(tax: string) {
    let o: TaxResponse = find(this.taxes, (item: TaxResponse) => item.uniqueName === tax );
    if (o) {
      return this.isTaxApplicable(o);
    } else {
      return false;
    }
  }

  /**
   * calculate sum of selected tax amount
   * @returns {number}
   */
  private calculateSum() {
    return this.taxList.reduce((pv, cv) => {
      return cv.isChecked ? pv + cv.amount : pv;
    }, 0);
  }

  /**
   * generate an array of string, contains selected tax uniqueNames
   * @returns {string[]}
   */
  private getSelectedTaxes(): string[] {
    return this.taxList.filter(p => p.isChecked).map(p => p.uniqueName);
  }

  private isTaxApplicable(tax: TaxResponse): boolean {
    const today = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY', true).valueOf();
    let isApplicable = false;
    each(tax.taxDetail, (det: ITaxDetail) => {
      if (today >= moment(det.date, 'DD-MM-YYYY', true).valueOf()) {
        return isApplicable = true;
      }
    });
    return isApplicable;
  }

  /**
   * make tax list
   */
  private makeTaxList() {
    this.taxList = [];
    if (this.taxes && this.taxes.length > 0) {
      this.taxes.forEach((tax: TaxResponse) => {
        let item: ITaxList = {
          name: tax.name,
          uniqueName: tax.uniqueName,
          isChecked: this.getItemIsCheckedOrNot(tax.uniqueName),
          amount: tax.taxDetail[0].taxValue,
          isDisabled: !this.isTaxApplicable(tax)
        };
        this.taxList.push(item);
      });
    }
  }

  /**
   * return true
   */
  private getItemIsCheckedOrNot(uniqueName: string): boolean {
    if (this.taxListAutoRender && this.taxListAutoRender.length > 0) {
      let idx = findIndex(this.taxListAutoRender, (tax: ITaxList) => tax.uniqueName === uniqueName );
      return (idx !== -1) ? true : false;
    }else {
      return false;
    }
  }
}
