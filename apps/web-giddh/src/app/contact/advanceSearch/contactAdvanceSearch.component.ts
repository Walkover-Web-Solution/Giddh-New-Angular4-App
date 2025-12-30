import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../app.constant';
import { ContactAdvanceSearchCommonModal } from '../../models/api-models/Contact';

@Component({
    selector: 'app-contact-advance-search-component',
    templateUrl: './contactAdvanceSearch.component.html',
    styleUrls: [`./contactAdvanceSearch.component.scss`],
    standalone:false
})

export class ContactAdvanceSearchComponent implements OnInit, OnChanges {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    @Output() public applyAdvanceSearchEvent: EventEmitter<ContactAdvanceSearchCommonModal> = new EventEmitter();
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() public advanceSearch4: 'customer' | 'agingReport' = 'customer';
    @Input() public request: ContactAdvanceSearchCommonModal = new ContactAdvanceSearchCommonModal();

    /** Filter options for entry total comparison */
    public filtersForEntryTotal: IOption[];
    /** Category options based on search type */
    public categoryOptions: IOption[];

    constructor(
        private dialogRef: MatDialogRef<ContactAdvanceSearchComponent>
    ) {

    }

    public ngOnInit(): void {
        this.filtersForEntryTotal = [
            { label: this.commonLocaleData?.app_comparision_filters.equals, value: 'Equals' },
            { label: this.commonLocaleData?.app_comparision_filters.greater_than, value: 'GreaterThan' },
            { label: this.commonLocaleData?.app_comparision_filters.less_than, value: 'LessThan' },
            { label: this.commonLocaleData?.app_comparision_filters.exclude, value: 'Exclude' }
        ];
    }

    /**
     * Handles changes to input properties and updates category options
     *
     * @memberof ContactAdvanceSearchComponent
     */
    public ngOnChanges() {
        if (this.advanceSearch4 === 'customer') {
            this.categoryOptions = [
                { label: this.localeData?.customer_category_options.opening_balance, value: 'openingBalance' },
                { label: this.localeData?.customer_category_options.sales, value: 'sales' },
                { label: this.localeData?.customer_category_options.receipt, value: 'receipt' },
                { label: this.localeData?.customer_category_options.closing_balance, value: 'closingBalance' }
            ];
        } else {
            this.categoryOptions = [
                { label: this.commonLocaleData?.app_total_due, value: 'totalDue' }
            ];
        }
    }

    /**
     * Resets all form fields and clears selections
     *
     * @memberof ContactAdvanceSearchComponent
     */
    public reset() {
        this.request = new ContactAdvanceSearchCommonModal();
    }

    /**
     * Saves the search criteria and closes the dialog
     *
     * @memberof ContactAdvanceSearchComponent
     */
    public save() {
        this.applyAdvanceSearchEvent.emit(this.request);
        this.dialogRef?.close(this.request);
    }

    /**
     * Cancels the search operation and closes the dialog
     *
     * @memberof ContactAdvanceSearchComponent
     */
    public onCancel() {
        this.closeModelEvent.emit(true);
        this.dialogRef?.close();
    }
}
