import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ExpenseResults } from '../../../models/api-models/Expences';

@Component({
    selector: 'app-filter-list',
    templateUrl: './filter-list.component.html',
    styleUrls: ['./filter-list.component.scss'],
})

export class FilterListComponent implements OnInit, OnChanges {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public expensesDetailedItems: ExpenseResults[];
    @Input() public selectedRowItem: string;
    @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
    public monthNames = [];
    public selectedItem: ExpenseResults;

    constructor() {

    }

    /**
     * Initializes the component
     *
     * @memberof FilterListComponent
     */
    public ngOnInit(): void {
        this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];

        if (this.expensesDetailedItems?.length > 0) {
            _.map(this.expensesDetailedItems, (resp: ExpenseResults) => {
                resp.entryDate = this.getDateToDMY(resp.entryDate);
            });
        }
    }

    /**
     * Formats date in D M Y Format
     *
     * @param {*} selectedDate
     * @returns {*}
     * @memberof FilterListComponent
     */
    public getDateToDMY(selectedDate: any): any {
        let date = selectedDate?.split('-');
        if (date?.length === 3) {
            let month = this.monthNames[parseInt(date[1]) - 1]?.substr(0, 3);
            let year = date[2]?.substr(0, 4);
            return date[0] + ' ' + month + ' ' + year;
        } else {
            return selectedDate;
        }
    }

    /**
     * Updates the variables if data updated from parent
     *
     * @param {SimpleChanges} changes
     * @memberof FilterListComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedRowItem']) {
            this.selectedItem = changes['selectedRowItem'].currentValue;
        }
    }

    /**
     * Shows item's preview on click of item and opens in edit mode
     *
     * @param {ExpenseResults} item
     * @memberof FilterListComponent
     */
    public editExpense(item: ExpenseResults): void {
        this.selectedItem = item;
        this.selectedDetailedRowInput.emit(item);
    }
}
