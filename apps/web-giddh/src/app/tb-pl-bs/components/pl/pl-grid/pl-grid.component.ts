import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import * as moment from 'moment/moment';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'pl-grid',  // <home></home>
	templateUrl: './pl-grid.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [`
    :host ::ng-deep .table-container {
      padding: 0;
    }

    :host ::ng-deep .table-container .profitLoss section div > div {
      padding-left: 8px;
    }

    :host ::ng-deep .basic {
      margin-bottom: 0;
    }

    :host ::ng-deep .table-container thead tr th:first-child {
      border-left: 0;
    }

    :host ::ng-deep .basic > thead > tr > th {
      padding: 8px 8px
    }

    .max-980 {
      max-width: 980px;
      margin: 0 auto;
    }

    :host ::ng-deep .table-container section div .group {
      text-transform: capitalize;
    }

    :host ::ng-deep .table-container div.row {
      border-bottom: 0;
    }
  `]
})
export class PlGridComponent implements OnInit, AfterViewInit, OnChanges {
	public noData: boolean;
	public showClearSearch: boolean = false;
	@Input() public search: string = '';
	@Input() public searchInput: string = '';
	@Output() public searchChange = new EventEmitter<string>();
	@Input() public plData: ProfitLossData;
	@Input() public cogsData: ChildGroup;
	@Input() public padding: string;
	@Input() public expandAll: boolean;
	@Input() public from: string = '';
	@Input() public to: string = '';
	@ViewChild('searchInputEl') public searchInputEl: ElementRef;
	public moment = moment;
	public plSearchControl: FormControl = new FormControl();

	// }

	constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
		//
	}

	public ngOnInit() {
		this.plSearchControl.valueChanges.pipe(
			debounceTime(700),
			distinctUntilChanged())
			.subscribe((newValue) => {
				this.searchInput = newValue;
				this.searchChange.emit(this.searchInput);

				if (newValue === '') {
					this.showClearSearch = false;
				}
				this.cd.detectChanges();
			});
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
			//
			if (this.plData && this.cogsData) {
				// this.cd.detach();
				this.zone.run(() => {
					if (this.plData) {
						this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
						this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
						if (this.plData.incArr) {
							_.each(this.plData.incArr, (grp: any) => {
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
						if (this.plData.expArr) {
							_.each(this.plData.expArr, (grp: any) => {
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

					if (this.cogsData) {
						if (this.cogsData.isIncludedInSearch) {
							if (!this.cogsData.level1) {
								this.cogsData.isOpen = changes.expandAll.currentValue;
							} else {
								this.cogsData.isOpen = true;
							}
							this.toggleVisibility(this.cogsData.childGroups, changes.expandAll.currentValue);
						}

						// this.toggleVisibility(this.cogsData.childGroups, changes.expandAll.currentValue);
						// _.each(this.cogsData.childGroups, (grp: any) => {
						//   if (grp.isIncludedInSearch) {
						//     grp.isVisible = true;
						//     _.each(grp.accounts, (acc: any) => {
						//       if (acc.isIncludedInSearch) {
						//         acc.isVisible = true;
						//       }
						//     });
						//   }
						// });
					}

					this.cd.detectChanges();

				});
			}
		}
	}

	public toggleSearch() {
		this.showClearSearch = true;

		setTimeout(() => {
			this.searchInputEl.nativeElement.focus();
		}, 200);
	}

	// private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
	//   _.each(data, (grp) => {
	//     grp.isVisible = isVisible;
	//     _.each(grp.accounts, (acc) => {
	//       acc.isVisible = isVisible;
	//     });
	//     this.toggleVisibility(grp.childGroups, isVisible);
	//   });

	public ngAfterViewInit() {
		//
	}

	public clickedOutside(event, el) {
		if (this.plSearchControl.value !== null && this.plSearchControl.value !== '') {
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
		let parentGroups = ['operatingcost', 'revenuefromoperations', 'otherincome', 'indirectexpenses'];
		_.each(data, (grp: ChildGroup) => {
			if (grp.isIncludedInSearch) {
				if (!grp.level1) {
					if (parentGroups.indexOf(grp.uniqueName) === -1) {
						grp.isCreated = false;
						grp.isVisible = isVisible;
						grp.isOpen = isVisible;
					} else {
						grp.isOpen = isVisible;
					}
				} else {
					grp.isOpen = true;
				}
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
