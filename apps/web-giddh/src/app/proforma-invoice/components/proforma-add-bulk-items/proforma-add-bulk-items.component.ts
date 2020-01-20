import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SalesAddBulkStockItems } from '../../../models/api-models/Sales';
import { ToasterService } from '../../../services/toaster.service';

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

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _cdr: ChangeDetectorRef, private _toaster: ToasterService) {
	}

	ngOnInit() {
		fromEvent(this.searchElement.nativeElement, 'input').pipe(
			distinctUntilChanged(),
			debounceTime(300),
			map((e: any) => e.target.value),
			takeUntil(this.destroyed$)
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

		data
			.filter(f => f.additional && f.additional.stock)
			.forEach(option => {
				let item = new SalesAddBulkStockItems();
				item.name = option.label;
				item.uniqueName = option.value;
				item.rate = 0;

				if (option.additional.stock.accountStockDetails.unitRates && option.additional.stock.accountStockDetails.unitRates.length) {
					item.rate = option.additional.stock.accountStockDetails.unitRates[0].rate;
					item.stockUnitCode = option.additional.stock.accountStockDetails.unitRates[0].stockUnitCode;
				}
				arr.push(item);
			});

		this.normalData = arr;
		this.filteredData = arr;
	}

	addItemToSelectedArr(item: SalesAddBulkStockItems) {
		let index = this.selectedItems.findIndex(f => f.uniqueName === item.uniqueName);
		if (index > -1) {
			this._toaster.warningToast('this item is already selected please increase it\'s quantity');
		} else {
			this.selectedItems.push({ ...item });
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
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
