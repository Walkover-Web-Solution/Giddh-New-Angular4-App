import { GstReconcileActions } from '../../actions/gst-reconcile/GstReconcile.actions';
import { select, Store } from '@ngrx/store';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GstDatePeriod, GstOverViewRequest } from '../../models/api-models/GstReconcile';
import { Observable, of, ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';
import { take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../store';
import { createSelector } from 'reselect';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'filing',
	templateUrl: 'filing.component.html',
	styleUrls: ['filing.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit, OnDestroy {
	@ViewChild('staticTabs') public staticTabs: TabsetComponent;

	public currentPeriod: GstDatePeriod = null;
	public selectedGst: string = null;
	public gstNumber: string = null;
	public activeCompanyGstNumber: string = '';
	public selectedTab: string = '1. Overview';
	public gstAuthenticated$: Observable<boolean>;
	public isTransactionSummary: boolean = false;
	public showTaxPro: boolean = false;
	public fileReturn: {} = { isAuthenticate: false };
	public selectedTabId: number = null;
	public gstFileSuccess$: Observable<boolean> = of(false);
	public fileReturnSucces: boolean = false;

	public gstr1OverviewDataInProgress$: Observable<boolean>;
	public gstr2OverviewDataInProgress$: Observable<boolean>;

	private gstr1OverviewDataFetchedSuccessfully$: Observable<boolean>;
	private gstr2OverviewDataFetchedSuccessfully$: Observable<boolean>;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _cdr: ChangeDetectorRef, private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>, private _gstAction: GstReconcileActions) {
		this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
		this.gstFileSuccess$ = this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$));
		this.gstr1OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
		this.gstr2OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
		this.gstr1OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataInProgress), takeUntil(this.destroyed$));
		this.gstr2OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataInProgress), takeUntil(this.destroyed$));

		this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);

		this.store.pipe(select(createSelector([((s: AppState) => s.session.companies), ((s: AppState) => s.session.companyUniqueName)],
			(companies, uniqueName) => {
				return companies.find(d => d.uniqueName === uniqueName);
			}))
		).subscribe(activeCompany => {
			if (activeCompany) {
				if (activeCompany.addresses && activeCompany.addresses.length) {
					let defaultGst = activeCompany.addresses.find(a => a.isDefault);
					if (defaultGst) {
						this.activeCompanyGstNumber = defaultGst.taxNumber;
					} else {
						this.activeCompanyGstNumber = activeCompany.addresses[0].taxNumber;
					}
					this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
				}
			}
		});
	}

	public ngOnInit() {
		this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
			this.currentPeriod = {
				from: params['from'],
				to: params['to']
			};
			this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
			this.selectedGst = params['return_type'];
			//
			let tab = Number(params['tab']);
			if (tab > -1) {
				this.selectTabFromUrl(tab);
			}
		});

		// get activeCompany gst number
		this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
			this.activeCompanyGstNumber = result;

			let request: GstOverViewRequest = new GstOverViewRequest();
			request.from = this.currentPeriod.from;
			request.to = this.currentPeriod.to;
			request.gstin = this.activeCompanyGstNumber;

			if (this.selectedGst === 'gstr1') {
				this.gstr1OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
					if (!bool) {
						// it means no gstr1 data available or error occurred or user directly navigated to this tab
						this.store.dispatch(this._gstAction.GetOverView('gstr1', request));
					}
				});
			} else {
				this.gstr2OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
					if (!bool) {
						// it means no gstr2 data available or error occurred or user directly navigated to this tab
						this.store.dispatch(this._gstAction.GetOverView('gstr2', request));
					}
				});
			}

			// get session details
			this.store.dispatch(this._gstAction.GetGSPSession(this.activeCompanyGstNumber));
		});
	}

	public selectTab(e, val, tabHeading) {
		this.selectedTab = tabHeading;
		this.isTransactionSummary = this.selectedTab !== '1. Overview';
		this.showTaxPro = val;
		this.fileReturnSucces = false;
		// this._route.navigate(['pages', 'gstfiling', 'filing-return'], {queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: this.selectedTabId}});
	}

	public selectTabFromUrl(tab: number) {
		if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[tab]) {
			this.selectedTabId = tab;
			this.staticTabs.tabs[this.selectedTabId].active = true;
		}
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
