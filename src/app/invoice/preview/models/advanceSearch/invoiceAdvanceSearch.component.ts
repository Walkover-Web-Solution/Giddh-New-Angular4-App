import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { InvoiceFilterClassForInvoicePreview } from '../../../../models/api-models/Invoice';

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'greaterThan'},
  {label: 'Less Than', value: 'lessThan'},
  {label: 'Greater Than or Equals', value: 'greaterThanOrEquals'},
  {label: 'Less Than or Equals', value: 'lessThanOrEquals'},
  {label: 'Equals', value: 'equals'}
];

const PREVIEW_OPTIONS = [
  {label: 'Paid', value: 'paid'},
  {label: 'Unpaid', value: 'unpaid'},
  {label: 'Hold', value: 'hold'},
  {label: 'Cancel', value: 'cancel'},
  {label: 'Create Credit Note', value: 'createCreditNote'},
  {label: 'Generate E-way Bill', value: 'generateE-wayBill'}
];

const DUE_DATE_OPTIONS = [
  {label: 'On', value: 'on'},
  {label: 'After', value: 'after'},
  {label: 'Before', value: 'before'},
];

@Component({
  selector: 'invoice-advance-search-component',
  templateUrl: './invoiceAdvanceSearch.component.html',
  styleUrls: [`./invoiceAdvanceSearch.component.scss`]
})

export class InvoiceAdvanceSearchComponent implements OnInit {
  @Input() public type: 'invoice' | 'drcr' | 'receipt';
  @Output() public applyFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public statusDropdownOptions: IOption[] = PREVIEW_OPTIONS;
  public dueDateOptions: IOption[] = DUE_DATE_OPTIONS;

  public request: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public save() {
    this.applyFilterEvent.emit();
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
