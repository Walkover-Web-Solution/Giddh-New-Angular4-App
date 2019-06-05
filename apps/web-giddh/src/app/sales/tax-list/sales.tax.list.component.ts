import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaxResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { ITaxList } from 'apps/web-giddh/src/app/models/api-models/Sales';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs';
import { ITaxDetail } from 'apps/web-giddh/src/app/models/interfaces/tax.interface';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { takeUntil } from 'rxjs/operators';
import * as _ from '../../lodash-optimized';

@Component({
  selector: 'sales-tax-list',
  templateUrl: './sales.tax.list.component.html',
  styles: [`
    :host .dropdown-menu {
      min-width: 200px;
      height: inherit;
      padding: 0;
      overflow: auto;
    }

    :host .fake-disabled-label {
      cursor: not-allowed;
      opacity: .5;
    }

    /*.form-control[readonly] {*/
    /*  background: #fff !important;*/
    /*}*/

    .taxItem {
      margin: 0;
      float: left;
      padding: 6px;
      text-transform: capitalize;
    }
  `],
  providers: [],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class SalesTaxListComponent implements OnInit, OnDestroy, OnChanges {

  public taxes: TaxResponse[];
  @Input() public applicableTaxes: string[];
  @Input() public showTaxPopup: boolean = false;
  @Input() public date: string;
  @Input() public taxSum: number;
  @Output() public selectedTaxEvent: EventEmitter<string[]> = new EventEmitter();
  @Output() public taxAmountSumEvent: EventEmitter<number> = new EventEmitter();
  @Output() public closeOtherPopupEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('taxListUl') public taxListUl: ElementRef;

  public taxList: ITaxList[] = [];
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    //

    // get tax list and assign values to local vars
    this.store.pipe(select(p => p.company.taxes), takeUntil(this.destroyed$)).subscribe((o: TaxResponse[]) => {
      if (o) {
        this.taxes = o;
        this.makeTaxList();
      } else {
        this.taxes = [];
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('applicableTaxes' in changes && changes.applicableTaxes.currentValue !== changes.applicableTaxes.previousValue) {
      this.applicableTaxesFn();
    }

    if ('totalAmount' in changes && (
      changes.totalAmount.currentValue !== changes.totalAmount.previousValue && !changes.totalAmount.isFirstChange())
    ) {
      // this.sum = this.calculateSum();
      this.taxAmountSumEvent.emit(this.taxSum);
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
    this.closeOtherPopupEvent.emit(true);
    this.showTaxPopup = action;
  }

  private distendFn() {
    // set values
    // this.sum = this.calculateSum();
    this.selectedTaxEvent.emit(this.getSelectedTaxes());
    this.taxAmountSumEvent.emit(this.taxSum);
  }

  private applicableTaxesFn() {
    if (this.applicableTaxes && this.applicableTaxes.length > 0) {
      this.taxList.map((item: ITaxList) => {
        item.isChecked = this.applicableTaxes.some(s => item.uniqueName === s);
        item.isDisabled = false;
        return item;
      });
    } else {
      this.taxList.map((item: ITaxList) => {
        item.isChecked = false;
        item.isDisabled = false;
        return item;
      });
    }
    this.distendFn();
  }

  /**
   * generate an array of string, contains selected tax uniqueNames
   * @returns {string[]}
   */
  private getSelectedTaxes(): string[] {
    return this.taxList.filter(p => p.isChecked).map(p => p.uniqueName);
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
          isChecked: false,
          amount: tax.taxDetail[0].taxValue,
          isDisabled: false
        };

        // if entry date is present then check it's amount
        if (this.date) {
          let taxObject = _.orderBy(tax.taxDetail, (p: ITaxDetail) => {
            return moment(p.date, 'DD-MM-YYYY');
          }, 'desc');
          let exactDate = taxObject.filter(p => moment(p.date, 'DD-MM-YYYY').isSame(moment(this.date, 'DD-MM-YYYY')));
          if (exactDate.length > 0) {
            item.amount = exactDate[0].taxValue;
          } else {
            let filteredTaxObject = taxObject.filter(p => moment(p.date, 'DD-MM-YYYY').isAfter(moment(this.date, 'DD-MM-YYYY')));
            if (filteredTaxObject.length > 0) {
              item.amount = filteredTaxObject[0].taxValue;
            } else {
              item.amount = 0;
            }
          }
        }
        this.taxList.push(item);
      });
    }
  }
}
