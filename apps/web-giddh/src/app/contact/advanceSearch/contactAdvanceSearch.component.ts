import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { ContactAdvanceSearchCommonModal } from '../../models/api-models/Contact';

@Component({
    selector: 'app-contact-advance-search-component',
    templateUrl: './contactAdvanceSearch.component.html',
    styleUrls: [`./contactAdvanceSearch.component.scss`]
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
    @ViewChildren(ShSelectComponent) public allSelects: QueryList<ShSelectComponent>;

    public filtersForEntryTotal: IOption[];
    public categoryOptions: IOption[];

    constructor() {

    }

    public ngOnInit(): void {
        this.filtersForEntryTotal = [
            { label: this.commonLocaleData?.app_comparision_filters.equals, value: 'Equals' },
            { label: this.commonLocaleData?.app_comparision_filters.greater_than, value: 'GreaterThan' },
            { label: this.commonLocaleData?.app_comparision_filters.less_than, value: 'LessThan' },
            { label: this.commonLocaleData?.app_comparision_filters.exclude, value: 'Exclude' }
        ];
    }

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

    public reset() {
        if (this.allSelects) {
            this.allSelects.forEach(sh => {
                sh.clear();
            })
        }
        this.request = new ContactAdvanceSearchCommonModal();
    }

    public save() {
        this.applyAdvanceSearchEvent.emit(this.request);
        this.closeModelEvent.emit();
    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }
}
