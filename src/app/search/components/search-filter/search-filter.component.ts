import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SearchDataSet } from '../../../models/api-models/Search';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../shared/helpers/customValidationHelper';

@Component({
  selector: 'search-filter',  // <home></home>
  templateUrl: './search-filter.component.html'
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Output() public searchQuery = new EventEmitter<SearchDataSet[]>();
  @Output() public isFiltered = new EventEmitter<boolean>();
  @Output() public createCsv = new EventEmitter();
  @Output() public openEmailDialog = new EventEmitter();
  @Output() public openSmsDialog = new EventEmitter();
  public queryTypes = [
    { name: 'Closing', uniqueName: 'closingBalance' },
    { name: 'Opening', uniqueName: 'openingBalance' },
    { name: 'Cr. total', uniqueName: 'creditTotal' },
    { name: 'Dr. total', uniqueName: 'debitTotal' }
  ];
  public queryDiffers = [
    'Less',
    'Greater',
    'Equals',
  ];

  public balType = [
    { name: 'CR', uniqueName: 'CREDIT' },
    { name: 'DR', uniqueName: 'DEBIT' }
  ];
  public searchQueryForm: FormGroup;
  public searchDataSet: FormArray;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder) {
    this.searchQueryForm = this.fb.group({
      searchQuery: this.fb.array([this.fb.group({
        queryType: ['', Validators.required],
        balType: ['CREDIT', Validators.required],
        queryDiffer: ['', Validators.required],
        amount: ['', [Validators.required, digitsOnly]],
      })])
    });
    this.searchDataSet = this.searchQueryForm.controls['searchQuery'] as FormArray;

  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public filterData() {
    this.isFiltered.emit(true);
    console.log(this.searchDataSet.value);
    this.searchQuery.emit(this.searchQueryForm.value.searchQuery);
  }

  public addSearchRow() {
    this.searchDataSet.push(this.fb.group({
      queryType: ['', Validators.required],
      balType: ['CREDIT', Validators.required],
      queryDiffer: ['', Validators.required],
      amount: ['', Validators.required],
    }));

  }

  public resetQuery() {
    this.searchDataSet.controls = [];
    this.addSearchRow();
    this.isFiltered.emit(false);
  }

  public removeSearchRow() {
    let arr = this.searchQueryForm.controls['searchQuery'] as FormArray;
    arr.removeAt(-1);
  }

}
