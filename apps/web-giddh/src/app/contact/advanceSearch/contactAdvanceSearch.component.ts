import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { ContactAdvanceSearchCommonModal } from '../../models/api-models/Contact';

const COMPARISON_FILTER = [
    { label: 'Equals', value: 'Equals' },
    { label: 'Greater Than', value: 'GreaterThan' },
    { label: 'Less Than', value: 'LessThan' },
    { label: 'Exclude', value: 'Exclude' }
];

const CATEGORY_OPTIONS_FOR_CUSTOMER = [
    { label: 'Opening Balance', value: 'openingBalance' },
    { label: 'Sales', value: 'sales' },
    { label: 'Receipts', value: 'receipt' },
    { label: 'Closing Balance (Due amount)', value: 'closingBalance' }
];

const CATEGORY_OPTIONS_FOR_AGING_REPORT = [
    //{label: 'Future Due', value: 'futureDue'},
    { label: 'Total Due', value: 'totalDue' },
];


@Component({
    selector: 'app-contact-advance-search-component',
    templateUrl: './contactAdvanceSearch.component.html',
    styleUrls: [`./contactAdvanceSearch.component.scss`]
})

export class ContactAdvanceSearchComponent implements OnInit, OnChanges {
    @Output() public applyAdvanceSearchEvent: EventEmitter<ContactAdvanceSearchCommonModal> = new EventEmitter();
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() public advanceSearch4: 'customer' | 'agingReport' = 'customer';
    @Input() public request: ContactAdvanceSearchCommonModal = new ContactAdvanceSearchCommonModal();
    @ViewChildren(ShSelectComponent) public allSelects: QueryList<ShSelectComponent>;

    public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
    public categoryOptions: IOption[];

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.categoryOptions = this.advanceSearch4 === 'customer' ? CATEGORY_OPTIONS_FOR_CUSTOMER : CATEGORY_OPTIONS_FOR_AGING_REPORT;
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
