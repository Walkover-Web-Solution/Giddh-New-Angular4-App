import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../store/roots';
import * as _ from '../../../lodash-optimized';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment/moment';
import { SearchRequest } from '../../../models/api-models/Search';
import { SearchActions } from '../../../actions/search.actions';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';

@Component({
	selector: 'search-sidebar',
    templateUrl: './search.sidebar.component.html',
    styleUrls: [`./search.sidebar.component.scss`],
})
export class SearchSidebarComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public pageChangeEvent: any = null;
	@Input() public filterEventQuery: any = null;

	public showFromDatePicker: boolean;
	public showToDatePicker: boolean;
	public toDate: string;
	public fromDate: string;
	public moment = moment;
	public groupName: string;
	public groupUniqueName: string;
	public dataSource = [];
	public groupsList$: Observable<GroupsWithAccountsResponse[]>;
	public typeaheadNoResults: boolean;
	public datePickerOptions: any = {
		locale: {
			applyClass: 'btn-green',
			applyLabel: 'Go',
			fromLabel: 'From',
			format: 'D-MMM-YY',
			toLabel: 'To',
			cancelLabel: 'Cancel',
			customRangeLabel: 'Custom range'
		},
		ranges: {
			'Last 1 Day': [
				moment().subtract(1, 'days'),
				moment()
			],
			'Last 7 Days': [
				moment().subtract(6, 'days'),
				moment()
			],
			'Last 30 Days': [
				moment().subtract(29, 'days'),
				moment()
			],
			'Last 6 Months': [
				moment().subtract(6, 'months'),
				moment()
			],
			'Last 1 Year': [
				moment().subtract(12, 'months'),
				moment()
			]
		},
		startDate: moment().subtract(30, 'days'),
		endDate: moment()
	};
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private paginationPageNumber: number;
    /** This holds giddh date format */
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
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
	/**
	 * TypeScript public modifiers
	 */
	constructor(private store: Store<AppState>, public searchActions: SearchActions, private generalService: GeneralService, private modalService: BsModalService) {
		this.groupsList$ = this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		this.fromDate = moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
		this.toDate = moment().format(GIDDH_DATE_FORMAT);

		// Get source for Group Name Input selection
		this.groupsList$.subscribe(data => {
			if (data && data.length) {
				let accountList = this.flattenGroup(data, []);
				let groups = [];
				accountList.map((d: any) => {
					groups.push({ name: d.name, id: d.uniqueName });
				});
				this.dataSource = groups;
			}
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
	}

	public ngOnChanges(changes: any) {
		if ('pageChangeEvent' in changes && changes['pageChangeEvent'].currentValue) {
			if (changes['pageChangeEvent'].firstChange || (!changes['pageChangeEvent'].previousValue || changes['pageChangeEvent'].currentValue.page !== changes['pageChangeEvent'].previousValue.page)) {
				let page = changes.pageChangeEvent.currentValue.page;
				this.paginationPageNumber = page;
				if (this.filterEventQuery) {
					this.getClosingBalance(false, null, this.paginationPageNumber, this.filterEventQuery);
				} else {
					this.getClosingBalance(false, null, page);
				}

			}
		}

		if ('filterEventQuery' in changes && changes['filterEventQuery'].currentValue) {
			if (changes['filterEventQuery'].firstChange || (!changes['filterEventQuery'].previousValue || changes['filterEventQuery'].currentValue !== changes['filterEventQuery'].previousValue)) {
				this.getClosingBalance(false, null, this.paginationPageNumber, changes['filterEventQuery'].currentValue);
			}
		}
	}

	public getClosingBalance(isRefresh: boolean, event: any, page?: number, searchReqBody?: any) {
		if (this.typeaheadNoResults) {
			this.groupName = '';
			this.groupUniqueName = '';
		}

		let searchRequest: SearchRequest = {
			groupName: this.groupUniqueName,
			refresh: isRefresh,
			toDate: this.toDate,
			fromDate: this.fromDate,
			page: page ? page : 1
		};
		this.store.dispatch(this.searchActions.GetStocksReport(searchRequest, searchReqBody));
		if (event) {
			event.target.blur();
		}
	}

	public changeTypeaheadNoResults(e: boolean): void {
		this.typeaheadNoResults = e;
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public OnSelectGroup(g: TypeaheadMatch) {
		this.groupName = g.item.name;
		this.groupUniqueName = g.item.id;
	}

	public flattenGroup(rawList: any[], parents: any[] = []) {
		let listofUN;
		listofUN = _.map(rawList, (listItem) => {
			let newParents;
			let result;
			newParents = _.union([], parents);
			newParents.push({
				name: listItem.name,
				uniqueName: listItem.uniqueName
			});
			listItem = Object.assign({}, listItem, { parentGroups: [] });
			listItem.parentGroups = newParents;
			if (listItem.groups.length > 0) {
				result = this.flattenGroup(listItem.groups, newParents);
				result.push(_.omit(listItem, 'groups'));
			} else {
				result = _.omit(listItem, 'groups');
			}
			return result;
		});
		return _.flatten(listofUN);
	}

	public selectedDate(value: any) {
		this.fromDate = moment(value.picker.startDate).format(GIDDH_DATE_FORMAT);
		this.toDate = moment(value.picker.endDate).format(GIDDH_DATE_FORMAT);
	}

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof SearchSidebarComponent
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
     * @memberof SearchSidebarComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof SearchSidebarComponent
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
        }
    }
}
