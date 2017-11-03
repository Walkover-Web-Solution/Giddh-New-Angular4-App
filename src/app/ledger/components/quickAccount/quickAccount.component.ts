import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
import { IOption } from '../../../theme/ng-select/option.interface';
import { Observable } from 'rxjs/Observable';
import { CompanyService } from '../../../services/companyService.service';
import { SelectComponent } from '../../../theme/ng-select/select.component';
import { ToasterService } from '../../../services/toaster.service';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AccountsAction } from '../../../services/actions/accounts.actions';
import { AccountRequestV2 } from '../../../models/api-models/Account';

@Component({
  selector: 'quickAccount',
  templateUrl: 'quickAccount.component.html'
})

export class QuickAccountComponent implements OnInit {
  @Output() public closeQuickAccountModal: EventEmitter<any> = new EventEmitter();
  public groupsArrayStream$: Observable<IFlattenGroupsAccountsDetail[]>;
  public groupsArray: IOption[] = [];
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public newAccountForm: FormGroup;

  constructor(private _fb: FormBuilder, private _groupService: GroupService,
              private _companyService: CompanyService, private _toaster: ToasterService,
              private accountsAction: AccountsAction) {
    this._groupService.GetFlattenGroupsAccounts().subscribe(result => {
      if (result.status === 'success') {
        this.groupsArrayStream$ = Observable.of(result.body.results);
        let groupsListArray: IOption[] = [];
        result.body.results.forEach(a => {
          groupsListArray.push({label: a.groupName, value: a.groupUniqueName});
        });
        this.groupsArray = groupsListArray;
      }
    });
    this._companyService.getAllStates().subscribe((data) => {
      let states: IOption[] = [];
      if (data) {
        data.body.map(d => {
          states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = Observable.of(states);
    }, (err) => {
      // console.log(err);
    });
  }

  public ngOnInit() {
    this.newAccountForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: ['', [Validators.required]],
      gstIn: ['', Validators.compose([Validators.maxLength(15)])],
      stateCode: [{value: '', disabled: false}],
      groupUniqueName: [''],
      openingBalanceDate: []
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

  public getStateCode(statesEle: SelectComponent) {
    let gstVal: string = this.newAccountForm.get('gstIn').value;
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.disabled = true;
        if (s) {
          this.newAccountForm.get('stateCode').patchValue(s.value);
        } else {
          this.newAccountForm.get('stateCode').patchValue(null);
          this._toaster.clearAllToaster();
          this._toaster.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.disabled = false;
      this.newAccountForm.get('stateCode').patchValue(null);
    }
  }

  public checkSelectedGroup(grpUniqueName: string) {
    // let groups: IFlattenGroupsAccountsDetail[] = null;
    // this.groupsArrayStream$.take(1).subscribe(g => groups = g);
    // if (groups && groups.length) {
    //   let findedGroups: IFlattenGroupsAccountsDetail = groups.find(f => f.uniqueName === grpUniqueName);
    //   if (findedGroups && findedGroups)
    // }
  }

  public submit() {
    let createAccountRequest: AccountRequestV2 = _.cloneDeep(this.newAccountForm.value);
    this.accountsAction.createAccountV2(this.newAccountForm.value.groupUniqueName, createAccountRequest);
  }
}
