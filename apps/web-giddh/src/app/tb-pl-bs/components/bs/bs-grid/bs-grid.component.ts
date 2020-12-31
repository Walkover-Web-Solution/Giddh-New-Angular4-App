import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { BalanceSheetData } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import * as moment from 'moment/moment';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'bs-grid',
    templateUrl: './bs-grid.component.html',
    styleUrls: [`./bs-grid.component.scss`],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BsGridComponent implements OnInit, OnChanges, OnDestroy {
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
	@ViewChild('searchInputEl', {static: true}) public searchInputEl: ElementRef;
    public bsSearchControl: FormControl = new FormControl();
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
		
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
			if (this.bsData) {
				this.zone.run(() => {
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
				});
			}
		}
	}

	public ngOnInit() {
		this.bsSearchControl.valueChanges.pipe(
			debounceTime(700), takeUntil(this.destroyed$))
			.subscribe((newValue) => {
				this.searchInput = newValue;
				this.searchChange.emit(this.searchInput);

				if (newValue === '') {
					this.showClearSearch = false;
				}
				this.cd.detectChanges();
			});
	}

	public toggleSearch() {
		this.showClearSearch = true;

		setTimeout(() => {
            if(this.searchInputEl && this.searchInputEl.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
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
    
    /**
     * This will destroy all the memory used by this component
     *
     * @memberof BsGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
