import { Component } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { InventoryReportActions } from '../../../actions/inventory/inventory.report.actions';
import { InventoryFilter, InventoryReport } from '../../../models/api-models/Inventory-in-out';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    selector: 'invetory-in-out-report',  // <home></home>
    templateUrl: './inventory-in-out-report.component.html',
    styles: [`
    .bdrT {
      border-color: #ccc;
    }

    :host ::ng-deep .fb__1-container {
      justify-content: flex-start;
    }

    :host ::ng-deep .fb__1-container .form-group {
      margin-right: 10px;
      margin-bottom: 0;
    }

    :host ::ng-deep .fb__1-container .date-range-picker {
      min-width: 150px;
    }
  `]
})
export class InventoryInOutReportComponent {
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
    public startDate: string = moment().subtract(30, 'days').format('DD-MM-YYYY');
    public endDate: string = moment().format('DD-MM-YYYY');
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

    constructor(private _router: ActivatedRoute,
        private inventoryReportActions: InventoryReportActions,
        private _store: Store<AppState>) {

        this._router.params.subscribe(p => {
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
        this._store.select(p => p.inventoryInOutState.inventoryReport)
            .subscribe(p => this.inventoryReport = p);
        this._store.select(p => ({ stocksList: p.inventory.stocksList, inventoryUsers: p.inventoryInOutState.inventoryUsers }))
            .subscribe(p => p.inventoryUsers && p.stocksList &&
                (this.stockOptions = p.stocksList.results.map(r => ({ label: r.name, value: r.uniqueName, additional: 'stock' }))
                    .concat(p.inventoryUsers.map(r => ({ label: r.name, value: r.uniqueName, additional: 'person' })))));
    }

    public dateSelected(val) {
        const { startDate, endDate } = val.picker;
        this.startDate = startDate.format('DD-MM-YYYY');
        this.endDate = endDate.format('DD-MM-YYYY');
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
}
