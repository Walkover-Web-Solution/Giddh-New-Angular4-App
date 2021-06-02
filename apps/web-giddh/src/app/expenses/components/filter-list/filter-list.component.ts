import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { Observable, ReplaySubject } from 'rxjs';
import { ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-filter-list',
	templateUrl: './filter-list.component.html',
	styleUrls: ['./filter-list.component.scss'],
})

export class FilterListComponent implements OnInit, OnChanges, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
	public monthNames = [];
	public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
	public getPettycashReportInprocess$: Observable<boolean>;
	public expensesDetailedItems: ExpenseResults[];
	public expensesDetailedItems$: Observable<ExpenseResults[]>;
	public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	@Input() public selectedRowItem: string;
	@Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();

	public selectedItem: ExpenseResults;

	constructor(private store: Store<AppState>,
		private _expenceActions: ExpencesAction) {
		this.pettyCashReportsResponse$ = this.store.pipe(select(p => p.expense.pettycashReport), takeUntil(this.destroyed$));
		this.getPettycashReportInprocess$ = this.store.pipe(select(p => p.expense.getPettycashReportInprocess), takeUntil(this.destroyed$));
	}

	public ngOnInit() {
        this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];
        
		this.pettyCashReportsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
			if (res) {
				this.expensesDetailedItems = res.results;
			}
			if (this.expensesDetailedItems.length > 0) {
				_.map(this.expensesDetailedItems, (resp: ExpenseResults) => {
					resp.entryDate = this.getDateToDMY(resp.entryDate);
				});
			}
        });
	}

	public getDateToDMY(selecteddate) {
		let date = selecteddate.split('-');
		if (date.length === 3) {
			let month = this.monthNames[parseInt(date[1]) - 1]?.substr(0, 3);
			let year = date[2]?.substr(0, 4);
			return date[0] + ' ' + month + ' ' + year;
		} else {
			return selecteddate;
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedRowItem']) {
			this.selectedItem = changes['selectedRowItem'].currentValue;
		}

	}

	public rowClicked(item: ExpenseResults) {
		this.selectedItem = item;
		this.selectedDetailedRowInput.emit(item);
		this.store.dispatch(this._expenceActions.getPettycashEntryRequest(item.uniqueName));
    }

    /**
     * Releases memory
     *
     * @memberof FilterListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
