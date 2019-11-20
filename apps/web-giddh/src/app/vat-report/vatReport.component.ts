import {Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {takeUntil, take} from 'rxjs/operators';
import {ChangeDetectorRef, Component, OnDestroy, OnInit,} from '@angular/core';
import {Router} from '@angular/router';
import {VatReportRequest} from '../models/api-models/Vat';
import * as _ from '../lodash-optimized';
import {Store, select} from '@ngrx/store';
import {AppState} from '../store';
import {GeneralService} from '../services/general.service';
import {ToasterService} from '../services/toaster.service';
import {GeneralActions} from '../actions/general/general.actions';
import {VatService} from "../services/vat.service";
import * as moment from 'moment/moment';
import {createSelector} from "reselect";
import {GIDDH_DATE_FORMAT} from "../shared/helpers/defaultDateFormat";

@Component({
	selector: 'app-vat-report',
	styleUrls: ['./vatReport.component.scss'],
	templateUrl: './vatReport.component.html'
})

export class VatReportComponent implements OnInit, OnDestroy {
	public vatReport: any[] = [];
	public activeCompanyUniqueName$: Observable<string>;
	public activeCompany: any;
	public universalDate$: Observable<any>;
	public datePickerOptions: any;
	public moment = moment;
	public currentDateRangePickerValue: Date[] = [];
	public fromDate: string = '';
	public toDate: string = '';
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	vatReportsTwo = [
		{
			No: '1a',
			items: 'Standard rated supplies in Abu Dhabi',
			amount: 'AED 10,000',
			vatAmount: 123,
			Adjustment: 'AED 1,000'
		},
		{No: '1a', items: 'Standard rated supplies in Dubai', amount: 'AED 10,000', vatAmount: 123, Adjustment: '-'}
	];

	constructor(private store: Store<AppState>, private vatService: VatService, private _router: Router, private _generalService: GeneralService, private _toasty: ToasterService, private _generalActions: GeneralActions, private cdRef: ChangeDetectorRef) {
		this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
		this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), (takeUntil(this.destroyed$)));
	}

	public ngOnInit() {
		this.store.pipe(select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
			if (dateObj) {
				let universalDate = _.cloneDeep(dateObj);
				this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
				this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
				this.currentDateRangePickerValue = [universalDate[0], universalDate[1]];
			}
		})), (takeUntil(this.destroyed$))).subscribe();

		this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
			this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
				if (!res) {
					return;
				}
				res.forEach(cmp => {
					if (cmp.uniqueName === activeCompanyName) {
						this.activeCompany = cmp;

						if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
							this.activeCompany.addresses = [_.find(this.activeCompany.addresses, (tax) => tax.isDefault)];
							this.getVatReport();
						}
					}
				});
			});
		});
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public getVatReport() {
		if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
			let vatReportRequest = new VatReportRequest();
			vatReportRequest.from = this.fromDate;
			vatReportRequest.to = this.toDate;
			vatReportRequest.taxNumber = this.activeCompany.addresses[0].taxNumber;

			this.vatReport = [];

			this.vatService.GetVatReport(vatReportRequest).subscribe((res) => {
				if (res.status === 'success') {
					this.vatReport = res.body.sections;
					this.cdRef.detectChanges();
				}
			});
		}
	}

	public getFilterDate(dates: any) {
		if (dates !== null) {
			this.fromDate = moment(dates[0]).format(GIDDH_DATE_FORMAT);
			this.toDate = moment(dates[1]).format(GIDDH_DATE_FORMAT);
			this.getVatReport();
		}
	}
}
