import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'greaterThan'},
  {label: 'Less Than', value: 'lessThan'},
  {label: 'Greater Than or Equals', value: 'greaterThanOrEquals'},
  {label: 'Less Than or Equals', value: 'lessThanOrEquals'},
  {label: 'Equals', value: 'equals'}
];


@Component({
  selector: 'app-contact-advance-search-component',
  templateUrl: './contactAdvanceSearch.component.html',
  styleUrls: [`./contactAdvanceSearch.component.scss`]
})

export class ContactAdvanceSearchComponent implements OnInit {
  @Output() public applyFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;

  constructor() {
  }

  ngOnInit() {
  }

  public save() {
    this.applyFilterEvent.emit();
    this.closeModelEvent.emit();
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
}
