import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { ContactAdvanceSearchModal } from '../../models/api-models/Contact';

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'greaterThan'},
  {label: 'Less Than', value: 'lessThan'},
  {label: 'Greater Than or Equals', value: 'greaterThanOrEquals'},
  {label: 'Less Than or Equals', value: 'lessThanOrEquals'},
  {label: 'Equals', value: 'equals'}
];

const CATEGORY_OPTIONS_FOR_CUSTOMER = [
  {label: 'Opening Balance', value: ''},
  {label: 'Sales', value: ''},
  {label: 'Receipts', value: ''},
  {label: 'Closing Balance(Due amount)', value: ''}
];

const CATEGORY_OPTIONS_FOR_AGING_REPORT = [
  {label: 'UPCOMING Due', value: ''},
  {label: 'Total Due', value: ''},
];


@Component({
  selector: 'app-contact-advance-search-component',
  templateUrl: './contactAdvanceSearch.component.html',
  styleUrls: [`./contactAdvanceSearch.component.scss`]
})

export class ContactAdvanceSearchComponent implements OnInit {
  @Output() public applyAdvanceSearchEvent: EventEmitter<ContactAdvanceSearchModal> = new EventEmitter();
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() public advanceSearch4: 'customer' | 'agingReport' = 'customer';
  @Input() public request: ContactAdvanceSearchModal = new ContactAdvanceSearchModal();
  @ViewChildren(ShSelectComponent) public allSelects: QueryList<ShSelectComponent>;

  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public categoryOptions: IOption[] = this.advanceSearch4 === 'customer' ? CATEGORY_OPTIONS_FOR_CUSTOMER : CATEGORY_OPTIONS_FOR_AGING_REPORT;

  constructor() {
  }

  ngOnInit() {
  }

  public reset() {
    if (this.allSelects) {
      this.allSelects.forEach(sh => {
        sh.clear();
      })
    }
    this.request = new ContactAdvanceSearchModal();
  }

  public save() {
    this.applyAdvanceSearchEvent.emit(this.request);
    this.closeModelEvent.emit();
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
