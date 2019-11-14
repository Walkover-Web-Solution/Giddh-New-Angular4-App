import {take, takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Options} from 'highcharts';
import {ActiveFinancialYear, CompanyResponse} from '../../../models/api-models/Company';
import {Observable, ReplaySubject} from 'rxjs';
import {IChildGroups, IRevenueChartClosingBalanceResponse} from '../../../models/interfaces/dashboard.interface';
import {HomeActions} from '../../../actions/home/home.actions';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/roots';
import * as moment from 'moment/moment';
import {RevenueGraphDataRequest} from "../../../models/api-models/Dashboard";
import {GIDDH_DATE_FORMAT} from '../../../shared/helpers/defaultDateFormat';

@Component({
	selector: 'revenue-chart',
	templateUrl: 'revenue-chart.component.html',
	styleUrls: ['revenue-chart.component.scss', '../../home.component.scss']
})

export class RevenueChartComponent implements OnInit, OnDestroy {
	@Input() public refresh: boolean = false;
	public requestInFlight: boolean = false;
	public options: Options;
	public activeFinancialYear: ActiveFinancialYear;
	public lastFinancialYear: ActiveFinancialYear;
	public companies$: Observable<CompanyResponse[]>;
	public activeCompanyUniqueName$: Observable<string>;
	@Input() public revenueChartData: Observable<IRevenueChartClosingBalanceResponse>;
	public revenueGraphTypes: any[] = [];
	public activeGraphType: any;
	public graphParams: any = {
		currentFrom: '',
		currentTo: '',
		previousFrom: '',
		previousTo: '',
		interval: 'daily',
		type: '',
		uniqueName: '',
		refresh: false
	};
	public moment = moment;
	public currentData: any[] = [];
	public previousData: any[] = [];
	public summaryData: any = {totalCurrent: 0, totalLast: 0, highest: 0, lowest: 0};
	public activeCompany: any = {};
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
		this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
		this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));

		let getCurrentWeekStartEndDate = this.getWeekStartEndDate(new Date());
		let getPreviousWeekStartEndDate = this.getWeekStartEndDate(moment(getCurrentWeekStartEndDate[0]).subtract(1, 'days'));

		this.graphParams.currentFrom = moment(getCurrentWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
		this.graphParams.currentTo = moment(getCurrentWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);
		this.graphParams.previousFrom = moment(getPreviousWeekStartEndDate[0]).format(GIDDH_DATE_FORMAT);
		this.graphParams.previousTo = moment(getPreviousWeekStartEndDate[1]).format(GIDDH_DATE_FORMAT);

		this.getRevenueGraphTypes();
	}

	public ngOnInit() {
		// get activeFinancialYear and lastFinancialYear
		this.companies$.subscribe(c => {
			if (c) {
				let activeCompany: CompanyResponse;
				this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
					activeCompany = c.find(p => p.uniqueName === a);
					if (activeCompany) {
						this.activeCompany = activeCompany;
					}
				});
			}
		});
	}

	public refreshChart() {
		this.graphParams.refresh = true;
		this.getRevenueGraphData();
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public getRevenueGraphTypes() {
		this.store.pipe(select(s => s.home.revenueGraphTypes), takeUntil(this.destroyed$)).subscribe(res => {
			if (res && res.length > 0) {
				Object.keys(res).forEach(key => {
					if (key === "0") {
						this.activeGraphType = res[key];
						this.graphParams.uniqueName = this.activeGraphType['uniqueName'];
						this.graphParams.type = this.activeGraphType['type'];
					}
					this.revenueGraphTypes.push({uniqueName: res[key].uniqueName, type: res[key].type});
				});

				this.getRevenueGraphData();
			} else {
				this.store.dispatch(this._homeActions.GetRevenueGraphTypes());
			}
		});
	}

	public getRevenueGraphData() {
		this.store.pipe(select(s => s.home.revenueGraphData), takeUntil(this.destroyed$)).subscribe(res => {
			console.log(res);
			if (res && res.balances) {
				if (res.balances !== null) {
					Object.keys(res.balances).forEach(key => {
						this.currentData.push(res.balances[key].current.closingBalance.amount);
						this.previousData.push(res.balances[key].current.closingBalance.amount);
					});
				}

				if (res.currentClosingBalance !== null && res.currentClosingBalance.amount !== null) {
					this.summaryData.totalCurrent = res.currentClosingBalance.amount;
				} else {
					this.summaryData.totalCurrent = 0;
				}

				if (res.previousClosingBalance !== null && res.previousClosingBalance.amount !== null) {
					this.summaryData.totalLast = res.previousClosingBalance.amount;
				} else {
					this.summaryData.totalLast = 0;
				}

				if (res.currentClosingBalance !== null && res.currentClosingBalance.amount !== null) {
					this.summaryData.highest = res.currentClosingBalance.amount;
				} else {
					this.summaryData.highest = 0;
				}

				if (res.currentClosingBalance !== null && res.currentClosingBalance.amount !== null) {
					this.summaryData.lowest = res.currentClosingBalance.amount;
				} else {
					this.summaryData.lowest = 0;
				}

				this.generateChart();
			} else {
				let revenueGraphDataRequest = new RevenueGraphDataRequest();
				revenueGraphDataRequest = this.graphParams;
				this.store.dispatch(this._homeActions.GetRevenueGraphData(revenueGraphDataRequest));
			}
		});
	}

	public getWeekStartEndDate(date) {
		// If no date object supplied, use current date
		let now = date ? new Date(date) : new Date();

		// set time to some convenient value
		now.setHours(0, 0, 0, 0);

		// Get the previous Sunday
		let sunday = new Date(now);
		sunday.setDate(sunday.getDate() - sunday.getDay() + 0);

		// Get next Saturday
		let saturday = new Date(now);
		saturday.setDate(saturday.getDate() - saturday.getDay() + 6);

		// Return array of date objects
		return [sunday, saturday];
	}

	public generateChart() {
		this.options = {
			chart: {
				type: 'column',
				height: '256px'
			},
			colors: ['#0CB1AF', '#087E7D'],
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			series: [{
				name: '',
				data: this.currentData
			}, {
				name: '',
				data: this.previousData
			}
			],
			legend: {
				enabled: false
			}
		};

		this.requestInFlight = false;
	}
}
