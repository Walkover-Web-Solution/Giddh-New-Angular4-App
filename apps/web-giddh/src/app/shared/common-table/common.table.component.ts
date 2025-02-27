import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ColumnDefinition } from './common.table.component.const';
@Component({
    selector: 'common-table-component',
    templateUrl: './common.table.component.html',
    styleUrls: ['./common.table.component.scss']
})

export class CommonTableComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds the table data */
    @Input() tableData: any = [];
    /**
     * Configuration for table columns.
     * 
     * Each key represents a column, and its value is an array with the following structure:
     * 
     * [0] Header Name (string): The label to be displayed in the table header, often tied to localization keys.
     * [1] Visibility (boolean): Determines if the column should be shown (true) or hidden (false).
     * [2] Clickable (boolean): Defines whether the column data is clickable (true) or static (false).
     */
    @Input() columnDefinitions: Record<string, ColumnDefinition> = {};
    /** Holds the total count for each column */
    @Input() columnTotalCounts: Record<string, number | string> = {};
    /** Determines if the total count row should be displayed */
    @Input() isTotalCountVisible: boolean = false;
    /** Controls whether the total count appears at the top or bottom of the table */
    @Input() isTotalCountAtTop: boolean = false;
    /** Emits click item event  */
    @Output() clickOnItemEvent: EventEmitter<any> = new EventEmitter();
    /** Holds the total count for visible column */
    public topHeaderColumns: string[] = [];
    /** This will use for displayed table columns */
    public displayedColumns: string[] = [];
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {}

    /**
     * Initializes the component variables and settings
     *
     * @memberof CommonTableComponent
     */
    public ngOnInit(): void {}

    /**
     * Determines if a column is clickable based on its definition
     *
     * @param {string} column - Column key
     * @returns {boolean} - True if the column is clickable, otherwise false
     * @memberof CommonTableComponent
     */
    public isClickableColumn(column: string): boolean {
        return this.columnDefinitions?.[column]?.length >= 3 && this.columnDefinitions?.[column][2];
    }

    /**
     * Retrieves the header label for a column, supporting localization fallback
     *
     * @param {string} column - Column key
     * @returns {string} - Localized or default header label
     * @memberof CommonTableComponent
     */
    public getHeaderLabel(column: string): string {
        const key = this.columnDefinitions?.[column]?.[0];
        return this.localeData?.[key] ?? this.commonLocaleData?.[key] ?? key ?? '-';
    }

    /**
     * Trims whitespace from a column key
     *
     * @param {string} column - Column key
     * @returns {string} - Trimmed column key
     * @memberof CommonTableComponent
     */
    public trimColumn(column: string): string {
        return column?.trim() ?? '';
    }

    /**
     * Updates displayed columns based on column definitions (runs on input changes)
     *
     * @memberof CommonTableComponent
     */
    public ngOnChanges(): void {
        this.topHeaderColumns = [];
        this.displayedColumns = [];
        Object.entries(this.columnDefinitions).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length >= 1 && value[1]) {
                this.topHeaderColumns.push(key + ' ');
                this.displayedColumns.push(key);
            }
        });
    }

     /**
     * Checks if a given value is a string
     *
     * @param {any} value - Value to check
     * @returns {boolean} - True if value is a string, otherwise false
     * @memberof CommonTableComponent
     */
     public isString(value: any): boolean {
        return typeof value === 'string';
    }

    /**
     * Unsubscribes from all the subscriptions
     *
     * @memberof CommonTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Emits an event when a clickable item is selected
     *
     * @param {any} item - The clicked item data
     * @param {string} column - The column associated with the clicked item
     * @memberof CommonTableComponent
     */
    public clickOnItem(item: any, column: string): void {
        this.clickOnItemEvent.emit({ columnName: column, item: item });
    }
}
