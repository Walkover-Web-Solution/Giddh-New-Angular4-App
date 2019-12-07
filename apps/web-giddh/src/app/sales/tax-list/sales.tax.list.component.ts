import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaxResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { ITaxList } from 'apps/web-giddh/src/app/models/api-models/Sales';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs';
import { ITaxDetail } from 'apps/web-giddh/src/app/models/interfaces/tax.interface';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { takeUntil } from 'rxjs/operators';
import { each } from '../../lodash-optimized';

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

      .multi-select input.form-control {
          background-image: unset !important;
      }

      .multi-select .caret {
          display: block !important;
      }

      .multi-select.adjust .caret {
          right: -2px !important;
          top: 14px !important;
      }

      :host {
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
      }
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
    @Input() public customTaxTypesForTaxFilter: string[] = [];
    @Input() public exceptTaxTypes: string[] = [];
    @Input() public TaxSum: any;
    @Input() public allowedSelection: number = 0;
    @Input() public allowedSelectionOfAType: Array<{ type: string[], count: number }>;
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

        if ('customTaxTypesForTaxFilter' in changes && changes.customTaxTypesForTaxFilter.currentValue !== changes.customTaxTypesForTaxFilter.previousValue) {
            this.makeTaxList();
        }

        if ('exceptTaxTypes' in changes && changes.exceptTaxTypes.currentValue !== changes.exceptTaxTypes.previousValue) {
            this.makeTaxList();
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
        this.allowedSelectionChecker();
        // this.sum = this.calculateSum();
        this.selectedTaxEvent.emit(this.getSelectedTaxes());
        this.taxAmountSumEvent.emit(this.taxSum);
    }

    private applicableTaxesFn() {
        if (this.applicableTaxes && this.applicableTaxes.length > 0) {
            this.taxList.forEach((item: ITaxList) => {
                item.isChecked = this.applicableTaxes.some(s => item.uniqueName === s);
                item.isDisabled = false;
                return item;
            });
        } else {
            this.taxList.forEach((item: ITaxList) => {
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

    private allowedSelectionChecker() {
        if (this.allowedSelection > 0) {
            // if (this.selectedTax.length >= this.allowedSelection) {
            //   this.taxList = this.taxList.map(m => {
            //     m.isDisabled = !m.isChecked;
            //     return m;
            //   });
            // } else {
            //   this.taxList = this.taxList.map(m => {
            //     m.isDisabled = m.isDisabled ? false : m.isDisabled;
            //     return m;
            //   });
            // }
        }

        if (this.allowedSelectionOfAType && this.allowedSelectionOfAType.length) {
            this.allowedSelectionOfAType.forEach(ast => {
                let selectedTaxes = this.taxList.filter(f => f.isChecked).filter(t => ast.type.includes(t.type));

                if (selectedTaxes.length >= ast.count) {
                    this.taxList = this.taxList.map((m => {
                        if (ast.type.includes(m.type) && !m.isChecked) {
                            m.isDisabled = true;
                        }
                        return m;
                    }));
                } else {
                    this.taxList = this.taxList.map((m => {
                        if (ast.type.includes(m.type) && m.isDisabled) {
                            m.isDisabled = false;
                        }
                        return m;
                    }));
                }
            });
        }
    }

    /**
     * make tax list
     */
    private makeTaxList() {
        this.taxList = [];
        if (this.taxes && this.taxes.length > 0) {

            if (this.customTaxTypesForTaxFilter && this.customTaxTypesForTaxFilter.length) {
                this.taxes = this.taxes.filter(f => this.customTaxTypesForTaxFilter.includes(f.taxType));
            }

            if (this.exceptTaxTypes && this.exceptTaxTypes.length) {
                this.taxes = this.taxes.filter(f => !this.exceptTaxTypes.includes(f.taxType));
            }

            this.taxes.forEach((tax: TaxResponse) => {

                let item: ITaxList = {
                    name: tax.name,
                    uniqueName: tax.uniqueName,
                    isChecked: false,
                    amount: tax.taxDetail[0].taxValue,
                    isDisabled: false,
                    type: tax.taxType
                };
                this.taxList.push(item);
            });
            this.allowedSelectionChecker();
        }
    }
}
