import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { createSelector } from 'reselect';
import { Observable, ReplaySubject } from 'rxjs';
import { distinct, take, takeUntil } from 'rxjs/operators';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
import { ManufacturingActions } from '../../actions/manufacturing/manufacturing.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import * as _ from '../../lodash-optimized';
import { StocksResponse } from '../../models/api-models/Inventory';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { MfStockSearchRequestClass } from '../manufacturing.utility';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { IOption } from './../../theme/ng-select/option.interface';

const filter1 = [
	{ label: 'Greater', value: 'greaterThan' },
	{ label: 'Less Than', value: 'lessThan' },
	{ label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
	{ label: 'Less Than or Equals', value: 'lessThanOrEquals' },
	{ label: 'Equals', value: 'equals' }
];

const filter2 = [
	{ label: 'Quantity Inward', value: 'quantityInward' },
	// { name: 'Quantity Outward', uniqueName: 'quantityOutward' },
	{ label: 'Voucher Number', value: 'voucherNumber' }
];

@Component({
	selector: 'manufacturing-report',
	templateUrl: './mf.report.component.html',
	styleUrls: ['./mf.report.component.scss']
})

export class MfReportComponent implements OnInit, OnDestroy {

	public mfStockSearchRequest: IMfStockSearchRequest = new MfStockSearchRequestClass();
	public filtersForSearchBy: IOption[] = filter2;
	public filtersForSearchOperation: IOption[] = filter1;
	public stockListDropDown: IOption[] = [];
	public reportData: StocksResponse = null;
	public isReportLoading$: Observable<boolean>;
	public showFromDatePicker: boolean = false;
	public showToDatePicker: boolean = false;
	public moment = moment;
	public startDate: Date;
    public endDate: Date;
    /* To check page is not inventory page */
    public isInventoryPage: boolean = false;
	public activeStockGroup: string;
	private universalDate: Date[];
	private isUniversalDateApplicable: boolean = false;
	private lastPage: number = 0;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;

	constructor(
        private store: Store<AppState>,
		private manufacturingActions: ManufacturingActions,
		private inventoryAction: InventoryAction,
        private router: Router,
        public bsConfig: BsDatepickerConfig,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions
    ) {
		this.bsConfig.rangeInputFormat = GIDDH_DATE_FORMAT;
		this.mfStockSearchRequest.product = '';
		this.mfStockSearchRequest.searchBy = '';
		this.mfStockSearchRequest.searchOperation = '';
		this.isReportLoading$ = this.store.pipe(select(p => p.manufacturing.isMFReportLoading), takeUntil(this.destroyed$));
	}

	public ngOnInit() {
        this.isInventoryPage = this.router.url.includes('/pages/inventory');
		this.initializeSearchReqObj();
		// Refresh the stock list
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());

		this.store.pipe(select(p => p.inventory.manufacturingStockList), takeUntil(this.destroyed$)).subscribe((o: any) => {
			if (o) {
				if (o.results) {
					this.stockListDropDown = [];
					_.forEach(o.results, (unit: any) => {
						this.stockListDropDown.push({
							label: ` ${unit.name} (${unit.uniqueName})`,
							value: unit.uniqueName,
							additional: unit.stockGroup
						});
					});
				}
			} else {
				this.store.dispatch(this.inventoryAction.GetManufacturingStock());
			}
		});
		this.store.pipe(select(p => p.manufacturing.reportData), takeUntil(this.destroyed$)).subscribe((o: any) => {
			if (o) {
				this.reportData = _.cloneDeep(o);
			}
		});

		// Refresh stock list on company change
		this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$), distinct((val) => val === 'companyUniqueName')).subscribe((value: any) => {
			this.store.dispatch(this.inventoryAction.GetManufacturingStock());
		});

		// Refresh report data according to universal date
		this.store.pipe(select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
			if (dateObj) {
				this.universalDate = _.cloneDeep(dateObj);
				this.mfStockSearchRequest.dateRange = this.universalDate;
				this.isUniversalDateApplicable = true;
				this.getReportDataOnFresh();
			}
        })), takeUntil(this.destroyed$)).subscribe();
        this.store.pipe(
            select(state => state.session.activeCompany), take(1)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.currentCompanyBranches.length > 2;
                let currentBranchUniqueName;
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                    this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                } else {
                    currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                    this.currentBranch = {
                        name: this.activeCompany ? this.activeCompany.name : '',
                        alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                        uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                    };
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });
	}

	public initializeSearchReqObj() {
		this.mfStockSearchRequest.product = '';
		this.mfStockSearchRequest.searchBy = '';
		this.mfStockSearchRequest.searchOperation = '';
		this.mfStockSearchRequest.page = 1;
		this.mfStockSearchRequest.count = 20;
	}

	public goToCreateNewPage() {
		this.store.dispatch(this.manufacturingActions.RemoveMFItemUniqueNameFomStore());
		this.router.navigate(['/pages/manufacturing/edit']);
	}

	public getReports() {
		this.store.dispatch(this.manufacturingActions.GetMfReport(this.mfStockSearchRequest));
		// this.mfStockSearchRequest = new MfStockSearchRequestClass();
		// if (this.isUniversalDateApplicable && this.universalDate) {
		//   this.mfStockSearchRequest.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
		//   this.mfStockSearchRequest.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
		//   this.mfStockSearchRequest.dateRange =  this.universalDate;
		// } else {
		//   this.mfStockSearchRequest.from = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
		//   this.mfStockSearchRequest.to = moment().format(GIDDH_DATE_FORMAT);
		// }
		// this.initializeSearchReqObj();
	}

	public pageChanged(event: any): void {
		if (event.page !== this.lastPage) {
			this.lastPage = event.page;
			let data = _.cloneDeep(this.mfStockSearchRequest);
			data.page = event.page;
			this.store.dispatch(this.manufacturingActions.GetMfReport(data));
		}
	}

	public editMFItem(item) {
		if (item.uniqueName) {
			this.store.dispatch(this.manufacturingActions.SetMFItemUniqueNameInStore(item.uniqueName));
			this.router.navigate(['/pages/manufacturing/edit']);
		}
	}

	public getReportDataOnFresh() {
		let data = _.cloneDeep(this.mfStockSearchRequest);
		if (this.universalDate) {
			data.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
			data.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
		} else {
			data.from = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
			data.to = moment().format(GIDDH_DATE_FORMAT);
		}
		this.store.dispatch(this.manufacturingActions.GetMfReport(data));
	}

	public clearDate(model: string) {
		this.mfStockSearchRequest[model] = '';
	}

	public setToday(model: string) {
		this.mfStockSearchRequest[model] = moment();
	}

	public bsValueChange(event: any) {
		if (event) {
			this.mfStockSearchRequest.from = moment(event[0]).format(GIDDH_DATE_FORMAT);
			this.mfStockSearchRequest.to = moment(event[1]).format(GIDDH_DATE_FORMAT);
		}
	}

	/**
	 * setActiveStockGroup
	 */
	public setActiveStockGroup(event) {
		this.activeStockGroup = event.additional.uniqueName;
    }

    /**
     * Branch change handler
     *
     * @memberof MfReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.mfStockSearchRequest.branchUniqueName = selectedEntity.value;
    }

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
