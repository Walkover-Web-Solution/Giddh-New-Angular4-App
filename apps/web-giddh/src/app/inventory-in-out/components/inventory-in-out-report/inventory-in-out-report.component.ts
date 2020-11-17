import { Component, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InventoryReportActions } from '../../../actions/inventory/inventory.report.actions';
import { InventoryFilter, InventoryReport } from '../../../models/api-models/Inventory-in-out';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'invetory-in-out-report',
    templateUrl: './inventory-in-out-report.component.html',
    styleUrls: ['./inventory-in-out-report.component.scss']
})

export class InventoryInOutReportComponent implements OnDestroy {
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
    public inventoryReport: InventoryReport;
    public filter: InventoryFilter = {};
    public stockOptions: IOption[] = [];
    public startDate: string = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
    public endDate: string = moment().format(GIDDH_DATE_FORMAT);
    public uniqueName: string;
    public type: string;
    public COMPARISON_FILTER = [
        { label: 'Greater Than', value: '>' },
        { label: 'Less Than', value: '<' },
        { label: 'Greater Than or Equals', value: '>=' },
        { label: 'Less Than or Equals', value: '<=' },
        { label: 'Equals', value: '=' }
    ];
    public PERSON_FILTER = [
        { label: 'Sender', value: 'Sender' },
        { label: 'Receiver', value: 'Receiver' }
    ];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _router: ActivatedRoute,
        private inventoryReportActions: InventoryReportActions,
        private _store: Store<AppState>) {

        this._router.params.pipe(takeUntil(this.destroyed$)).subscribe(p => {
            this.uniqueName = p.uniqueName;
            this.type = p.type;
            this.filter = {};
            if (this.type === 'person') {
                this.filter.includeSenders = true;
                this.filter.includeReceivers = true;
                this.filter.receivers = [this.uniqueName];
                this.filter.senders = [this.uniqueName];
                this.applyFilters(1, true);
            } else {
                this.applyFilters(1, false);
            }
        });
        this._store.pipe(select(p => p.inventoryInOutState.inventoryReport), takeUntil(this.destroyed$)).subscribe(p => this.inventoryReport = p);
        this._store.pipe(select(p => ({ stocksList: p.inventory.stocksList, inventoryUsers: p.inventoryInOutState.inventoryUsers })), takeUntil(this.destroyed$)).subscribe(p => p.inventoryUsers && p.stocksList &&
                (this.stockOptions = p.stocksList.results.map(r => ({ label: r.name, value: r.uniqueName, additional: 'stock' }))
                    .concat(p.inventoryUsers.map(r => ({ label: r.name, value: r.uniqueName, additional: 'person' })))));
    }

    public dateSelected(val) {
        const { startDate, endDate } = val.picker;
        this.startDate = startDate.format(GIDDH_DATE_FORMAT);
        this.endDate = endDate.format(GIDDH_DATE_FORMAT);
    }

    public searchChanged(val: IOption) {
        this.filter.senders =
            this.filter.receivers = [];
        this.uniqueName = val.value;
        this.type = val.additional;
    }

    public compareChanged(option: IOption) {
        this.filter = {};
        switch (option.value) {
            case '>':
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = false;
                break;
            case '<':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = true;
                break;
            case '<=':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = true;
                break;
            case '>=':
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '=':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case 'Sender':
                this.filter.senders = [this.uniqueName];
                this.filter.includeReceivers = false;
                this.filter.includeSenders = true;
                this.filter.receivers = [];
                break;
            case 'Receiver':
                this.filter.senders = [];
                this.filter.includeSenders = false;
                this.filter.includeReceivers = true;
                this.filter.receivers = [this.uniqueName];
                break;
        }
    }

    public applyFilters(page: number, applyFilter: boolean = true) {
        this._store.dispatch(this.inventoryReportActions
            .genReport(this.uniqueName, this.startDate, this.endDate, page, 10, applyFilter ? this.filter : null));
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof InventoryInOutReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();       
	}
}
