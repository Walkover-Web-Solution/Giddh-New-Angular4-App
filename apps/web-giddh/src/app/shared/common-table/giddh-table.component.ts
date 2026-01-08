import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ColumnDefinition } from './giddh-table.component.const';
@Component({
    selector: 'giddh-table',
    templateUrl: './giddh-table.component.html',
    styleUrls: ['./giddh-table.component.scss']
})

export class GiddhTableComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds the table data */
    @Input() tableDataSource: any[] = [];
    /**
     * Configuration for table columns.
     * 
     * Each key represents a column, and its value is an array with the following structure:
     * 
     * [0] Header Name (string): The label to be displayed in the table header, often tied to localization keys.
     * [1] Visibility (boolean): Determines if the column should be shown (true) or hidden (false).
     * [2] Give Class (string): This class is applied to the header, footer, and secondary header.
     * [3] Clickable (boolean): Defines whether the column data is clickable (true) or static (false).
     */
    @Input() columnDefinitions: Record<string, ColumnDefinition> = {};
    /** Holds the total count for each column */
    @Input() tableSecondaryHeader: Record<string, number | string> = {};
    /** Determines if the total count row should be displayed */
    public isShowSecondaryHeader: boolean = false;
    /** Holds the total count for each column */
    @Input() footerRow: Record<string, number | string> = {};
    /** Controls whether the total count appears at the top or bottom of the table */
    public showFooterRow: boolean = false;
    /** Emits click item event  */
    @Output() handleClickEvent: EventEmitter<any> = new EventEmitter();
    /** Holds the total count for visible column */
    public topHeaderColumns: string[] = [];
    /** This will use for displayed table columns */
    public displayedColumns: string[] = [];
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() { }

    /**
     * Initializes the component variables and settings
     *
     * @memberof GiddhTableComponent
     */
    public ngOnInit(): void {
        this.isShowSecondaryHeader = !!Object.keys(this.tableSecondaryHeader).length;
        this.showFooterRow = !!Object.keys(this.footerRow).length;
    }

    /**
     * Determines if a column is clickable based on its definition
     *
     * @param {string} column - Column key
     * @returns {boolean} - True if the column is clickable, otherwise false
     * @memberof GiddhTableComponent
     */
    public isClickableColumn(column: string): boolean {
        return this.columnDefinitions?.[column]?.[3];
    }

    /**
     * Retrieves the header label for a column, supporting localization fallback
     *
     * @param {string} column - Column key
     * @returns {string} - Localized or default header label
     * @memberof GiddhTableComponent
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
     * @memberof GiddhTableComponent
     */
    public trimColumn(column: string): string {
        return column?.trim() ?? '';
    }

    /**
     * Updates displayed columns based on column definitions (runs on input changes)
     *
     * @memberof GiddhTableComponent
     */
    public ngOnChanges(): void {
        this.topHeaderColumns = [];
        this.displayedColumns = [];
        Object.entries(this.columnDefinitions).forEach(([key, value]) => {
            if (Array.isArray(value) && value?.[1]) {
                if (this.isShowSecondaryHeader) {
                    this.topHeaderColumns.push(key + ' ');
                }
                this.displayedColumns.push(key);
            }
        });
    }

    /**
    * Checks if a given value is a string
    *
    * @param {any} value - Value to check
    * @returns {boolean} - True if value is a number, otherwise false
    * @memberof GiddhTableComponent
    */
    public isNumber(value: any): boolean {
        return !isNaN(value);
    }

    /**
     * Unsubscribes from all the subscriptions
     *
     * @memberof GiddhTableComponent
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
     * @memberof GiddhTableComponent
     */
    public handleClick(item: any, column: string): void {
        this.handleClickEvent.emit({ columnName: column, item: item });
    }
}
