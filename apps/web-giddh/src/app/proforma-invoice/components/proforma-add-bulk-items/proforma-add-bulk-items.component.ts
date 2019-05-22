import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SalesAddBulkStockItems } from '../../../models/api-models/Sales';

@Component({
  selector: 'proforma-add-bulk-items-component',
  templateUrl: './proforma-add-bulk-items.component.html',
  styleUrls: [`./proforma-add-bulk-items.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProformaAddBulkItemsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data: IOption[] = [];
  @ViewChild('searchElement') public searchElement: ElementRef;
  @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() public saveItemsEvent: EventEmitter<SalesAddBulkStockItems[]> = new EventEmitter();

  public normalData: SalesAddBulkStockItems[] = [];
  public filteredData: SalesAddBulkStockItems[] = [];
  public selectedItems: SalesAddBulkStockItems[] = [];

  constructor(private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    fromEvent(this.searchElement.nativeElement, 'input').pipe(
      distinctUntilChanged(),
      debounceTime(300),
      map((e: any) => e.target.value)
    ).subscribe((res: string) => {
      this.filteredData = this.normalData.filter(item => {
        return item.name.toLowerCase().includes(res.toLowerCase()) || item.uniqueName.toLowerCase().includes(res.toLowerCase());
      });
      this._cdr.markForCheck();
    });

    this.parseDataToDisplay(this.data);
  }

  parseDataToDisplay(data: IOption[]) {
    let arr: SalesAddBulkStockItems[] = [];

    data.filter(f => f.additional && f.additional.stock).forEach(option => {
      let item = new SalesAddBulkStockItems();
      item.name = option.label;
      item.uniqueName = option.value;

      if (option.additional.stock.accountStockDetails.unitRates && option.additional.stock.accountStockDetails.unitRates.length) {
        item.rate = option.additional.stock.accountStockDetails.unitRates[0].rate;
      }
      arr.push(item);
    });

    this.normalData = arr;
    this.filteredData = arr;
  }

  addItemToSelectedArr(item: SalesAddBulkStockItems) {
    let index = this.selectedItems.findIndex(f => f.uniqueName === item.uniqueName);
    if (index > -1) {
      this.selectedItems[index].quantity++;
    } else {
      this.selectedItems.push({...item});
    }
  }

  removeSelectedItem(uniqueName: string) {
    this.selectedItems = this.selectedItems.filter(f => f.uniqueName !== uniqueName);
  }

  alterQuantity(item: SalesAddBulkStockItems, mode: 'plus' | 'minus' = 'plus') {
    if (mode === 'plus') {
      item.quantity++;
    } else {
      if (item.quantity === 1) {
        return;
      }
      item.quantity--;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  ngOnDestroy(): void {
    //
  }
}
