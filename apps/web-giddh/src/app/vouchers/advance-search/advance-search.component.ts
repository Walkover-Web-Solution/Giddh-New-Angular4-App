import { Component, Input, OnInit } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  /* This will hold local JSON data */
  @Input() public localeData: any = {};
  /* This will hold common JSON data */
  @Input() public commonLocaleData: any = {};
  public dateOptions: IOption[] = [];
  public filtersForEntryTotal: IOption[] = [];
  public statusDropdownOptions: IOption[] = [];
  public eInvoiceStatusDropdownOptions: IOption[] = [];
  constructor() { }

  ngOnInit() {
    this.dateOptions = [
      { label: 'on', value: 'on' },
      { label: 'after', value: 'after' },
      { label: 'before', value: 'before' },
    ];
    this.filtersForEntryTotal = [
      { label: 'Greater Than', value: 'greaterThan' },
      { label: 'Less Than', value: 'lessThan' },
      { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
      { label: 'Less Than or Equasl', value: 'lessThanOrEquals' },
      { label: 'Equals', value: 'equals' }
    ];
    this.statusDropdownOptions = [
      { label: 'Paid', value: 'paid' },
      { label: 'Partially Paid', value: 'partial-paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Hold', value: 'hold' },
      { label: 'Cancel', value: 'cancel' },
    ];
    this.eInvoiceStatusDropdownOptions = [
      { label: 'Pushed', value: 'pushed' },
      { label: 'Pushed', value: 'pushed' }
    ];
  }
}
