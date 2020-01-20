import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BalanceSheetData } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import * as moment from 'moment/moment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
	selector: 'bs-grid',  // <home></home>
	templateUrl: './bs-grid.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BsGridComponent implements OnInit, AfterViewInit, OnChanges {
	public noData: boolean;
	public showClearSearch: boolean = false;
	@Input() public search: string = '';
	@Input() public bsData: BalanceSheetData;
	@Input() public padding: string;
	public moment = moment;
	@Input() public expandAll: boolean;
	@Input() public searchInput: string = '';
	@Input() public from: string = '';
	@Input() public to: string = '';
	@Output() public searchChange = new EventEmitter<string>();
	@ViewChild('searchInputEl') public searchInputEl: ElementRef;
	public bsSearchControl: FormControl = new FormControl();

	constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
		//
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
			//
			if (this.bsData) {
				// this.cd.detach();
				this.zone.run(() => {
					// if (!this.search) {
					if (this.bsData) {
						this.toggleVisibility(this.bsData.assets, changes.expandAll.currentValue);
						this.toggleVisibility(this.bsData.liabilities, changes.expandAll.currentValue);
						// always make first level visible ....
						if (this.bsData.liabilities) {
							_.each(this.bsData.liabilities, (grp: any) => {
								if (grp.isIncludedInSearch) {
									grp.isVisible = true;
									_.each(grp.accounts, (acc: any) => {
										if (acc.isIncludedInSearch) {
											acc.isVisible = true;
										}
									});
								}
							});
						}
						if (this.bsData.assets) {
							_.each(this.bsData.assets, (grp: any) => {
								if (grp.isIncludedInSearch) {
									grp.isVisible = true;
									_.each(grp.accounts, (acc: any) => {
										if (acc.isIncludedInSearch) {
											acc.isVisible = true;
										}
									});
								}
							});
						}

					}
					this.cd.detectChanges();
					// } else if (this.search && this.search.length < 3) {
					//   if (this.plData.liabilities) {
					//     this.plData.liabilities.forEach(p => p.isVisible = true);
					//   }
					//   if (this.plData.assets) {
					//     this.plData.assets.forEach(p => p.isVisible = true);
					//   }
					// }

				});

				// this.plData = _.cloneDeep(this.plData);
				// this.cd.detectChanges();
			}
		}
	}

	public ngOnInit() {
		this.bsSearchControl.valueChanges.pipe(
			debounceTime(700))
			.subscribe((newValue) => {
				this.searchInput = newValue;
				this.searchChange.emit(this.searchInput);

				if (newValue === '') {
					this.showClearSearch = false;
				}
				this.cd.detectChanges();
			});
	}

	public ngAfterViewInit() {
		//
	}

	public toggleSearch() {
		this.showClearSearch = true;

		setTimeout(() => {
			this.searchInputEl.nativeElement.focus();
		}, 200);
	}

	public clickedOutside(event, el) {
		if (this.bsSearchControl.value !== null && this.bsSearchControl.value !== '') {
			return;
		}

		if (this.childOf(event.target, el)) {
			return;
		} else {
			this.showClearSearch = false;
		}
	}

	/* tslint:disable */
	public childOf(c, p) {
		while ((c = c.parentNode) && c !== p) {
		}
		return !!c;
	}

	private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
		_.each(data, (grp: ChildGroup) => {
			if (grp.isIncludedInSearch) {
				grp.isCreated = true;
				grp.isVisible = isVisible;
				_.each(grp.accounts, (acc: Account) => {
					if (acc.isIncludedInSearch) {
						acc.isCreated = true;
						acc.isVisible = isVisible;
					}
				});
				this.toggleVisibility(grp.childGroups, isVisible);
			}
		});
	}
}
