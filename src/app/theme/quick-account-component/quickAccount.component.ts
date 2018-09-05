import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import * as _ from 'app/lodash-optimized';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'app/services/group.service';
import { CompanyService } from 'app/services/companyService.service';
import { AccountRequestV2 } from 'app/models/api-models/Account';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { GroupsWithAccountsResponse } from 'app/models/api-models/GroupsWithAccounts';
import { LedgerActions } from 'app/actions/ledger/ledger.actions';
import { GeneralActions } from 'app/actions/general/general.actions';
import { States } from 'app/models/api-models/Company';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { IFlattenGroupsAccountsDetail } from 'app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'quickAccount',
  templateUrl: 'quickAccount.component.html'
})

export class QuickAccountComponent implements OnInit {
  @Output() public closeQuickAccountModal: EventEmitter<any> = new EventEmitter();
  public groupsArrayStream$: Observable<GroupsWithAccountsResponse[]>;
  public flattenGroupsArray: IOption[] = [];
  public statesStream$: Observable<States[]>;
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public isQuickAccountInProcess$: Observable<boolean>;
  public isQuickAccountCreatedSuccessfully$: Observable<boolean>;
  public showGstBox: boolean = false;
  public newAccountForm: FormGroup;
  public comingFromDiscountList: boolean = false;

  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private _groupService: GroupService,
              private _companyService: CompanyService, private _toaster: ToasterService,
              private ledgerAction: LedgerActions, private store: Store<AppState>, private _generalActions: GeneralActions) {
    this.isQuickAccountInProcess$ = this.store.select(p => p.ledger.isQuickAccountInProcess).pipe(takeUntil(this.destroyed$));
    this.isQuickAccountCreatedSuccessfully$ = this.store.select(p => p.ledger.isQuickAccountCreatedSuccessfully).pipe(takeUntil(this.destroyed$));
    this.groupsArrayStream$ = this.store.select(p => p.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
    this.statesStream$ = this.store.select(p => p.general.states).pipe(takeUntil(this.destroyed$));
    this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').subscribe(result => {
      if (result.status === 'success') {
        let groupsListArray: IOption[] = [];
        result.body.results = this.removeFixedGroupsFromArr(result.body.results);
        result.body.results.forEach(a => {
          groupsListArray.push({label: a.groupName, value: a.groupUniqueName});
        });
        this.flattenGroupsArray = groupsListArray;

        // coming from discount list set hardcoded discount list
        if (this.comingFromDiscountList) {
          // "uniqueName":"discount"
          this.newAccountForm.get('groupUniqueName').patchValue('discount');
        }
      }
    });
    this.statesStream$.subscribe((data) => {
      let states: IOption[] = [];
      if (data) {
        data.map(d => {
          states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = observableOf(states);
    }, (err) => {
      // console.log(err);
    });
  }

  public ngOnInit() {
    this.newAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      groupUniqueName: [''],
      openingBalanceDate: [],
      addresses: this._fb.array([
        this._fb.group({
          gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
          stateCode: [{value: '', disabled: false}]
        })
      ]),
    });
    this.isQuickAccountCreatedSuccessfully$.subscribe(a => {
      if (a) {
        this.closeQuickAccountModal.emit(true);
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this.ledgerAction.resetQuickAccountModal());
      }
    });
  }

  public generateUniqueName() {
    let control = this.newAccountForm.get('name');
    let uniqueControl = this.newAccountForm.get('uniqueName');
    let unqName = control.value;
    unqName = unqName.replace(/ |,|\//g, '');
    unqName = unqName.toLowerCase();
    if (unqName.length >= 1) {
      let unq = '';
      let text = '';
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let i = 0;
      while (i < 3) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
        i++;
      }
      unq = unqName + text;
      uniqueControl.patchValue(unq);
    } else {
      uniqueControl.patchValue('');
    }
  }

  public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent) {
    let gstVal: string = gstForm.get('gstNumber').value;
    if (gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.disabled = true;
        if (s) {
          gstForm.get('stateCode').patchValue(s.value);
        } else {
          gstForm.get('stateCode').patchValue(null);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.disabled = false;
      gstForm.get('stateCode').patchValue(null);
    }
  }

  public checkSelectedGroup(options: IOption) {
    this.groupsArrayStream$.subscribe(data => {
      if (data.length) {
        let accountCategory = this.flattenGroup(data, options.value, null);
        this.showGstBox = accountCategory === 'assets' || accountCategory === 'liabilities';
      }
    });
  }

  public flattenGroup(rawList: GroupsWithAccountsResponse[], groupUniqueName: string, category: any) {
    for (let raw of rawList) {
      if (raw.uniqueName === groupUniqueName) {
        return raw.category;
      }

      if (raw.groups) {
        let AccountOfCategory = this.flattenGroup(raw.groups, groupUniqueName, raw);
        if (AccountOfCategory) {
          return AccountOfCategory;
        }
      }
    }
  }

  public removeFixedGroupsFromArr(data: IFlattenGroupsAccountsDetail[]) {
    const fixedArr = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost',
      'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
    return data.filter(da => {
      return !(fixedArr.indexOf(da.groupUniqueName) > -1);
    });
  }

  public submit() {
    let createAccountRequest: AccountRequestV2 = _.cloneDeep(this.newAccountForm.value);
    if (!this.showGstBox) {
      delete createAccountRequest.addresses;
    }
    this.store.dispatch(this.ledgerAction.createQuickAccountV2(this.newAccountForm.value.groupUniqueName, createAccountRequest));
  }
}
