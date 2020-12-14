import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { createSelector } from 'reselect';
import { Observable, ReplaySubject } from 'rxjs';
import { distinct, takeUntil } from 'rxjs/operators';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
import { ManufacturingActions } from '../../actions/manufacturing/manufacturing.actions';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as _ from '../../lodash-optimized';
import { StocksResponse } from '../../models/api-models/Inventory';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { MfStockSearchRequestClass } from '../manufacturing.utility';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './../../shared/helpers/defaultDateFormat';
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
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* To check page is not inventory page */
    public isInventoryPage: boolean = false;
	public activeStockGroup: string;
	private universalDate: Date[];
	private isUniversalDateApplicable: boolean = false;
	private lastPage: number = 0;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>,
		private manufacturingActions: ManufacturingActions,
		private inventoryAction: InventoryAction,
		private router: Router, public bsConfig: BsDatepickerConfig, private generalService: GeneralService, private modalService: BsModalService) {
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
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
				this.getReportDataOnFresh();
			}
		})), takeUntil(this.destroyed$)).subscribe();
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

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof AuditLogsFormComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AuditLogsFormComponent
     */
    public dateSelectedCallback(value?: any): void {
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.mfStockSearchRequest.from = this.fromDate;
			this.mfStockSearchRequest.to = this.toDate;
        }
    }
}
