import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILedgerAdvanceSearchRequest, Inventory } from './../../../models/api-models/Ledger';
import { CompanyActions } from './../../../services/actions/company.actions';
import { AppState } from './../../../store/roots';
import { Store } from '@ngrx/store';
import { IOption } from './../../../theme/ng-select/option.interface';
import { AccountService } from './../../../services/account.service';
import { AccountResponseV2 } from './../../../models/api-models/Account';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'advance-search-model',
  templateUrl: './advance-search.component.html'
})

export class AdvanceSearchModelComponent implements OnInit {

  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public advanceSearchObject: ILedgerAdvanceSearchRequest = null;
  public advanceSearchForm: FormGroup;
  public showOtherDetails: boolean = false;

  // public activeAccount$: Observable<AccountResponseV2>;
  // public accounts$: Observable<IOption[]>;
  // public selectedAccountForMerge: any = [];
  // public checkModel: string = 'all';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.advanceSearchForm = this.fb.group({
      uniqueNames: this.fb.array([]),
      isInvoiceGenerated: [false],
      amountLessThan: [false],
      includeAmount: [false],
      amountEqualTo: [false],
      amountGreaterThan: [false],
      amount: ['', Validators.required],
      includeDescription: ['', Validators.required],
      description: ['', Validators.required],
      includeTag: ['', Validators.required],
      includeParticulars: ['', Validators.required],
      chequeNumber: ['', Validators.required],
      dateOnCheque: ['', Validators.required],
      tags: this.fb.array([]),
      particulars: this.fb.array([]),
      inventory: this.fb.array([])
    });
  }

  public ngOnInit() {
    //
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  /**
   * onSearch
   */
  public onSearch() {
    console.log('advanceSearchForm is :', this.advanceSearchForm.value);
  }
}
