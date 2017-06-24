import { GroupWithAccountsAction } from './../../../../services/actions/groupwithaccounts.actions';
import { GroupResponse, GroupCreateRequest } from './../../../../models/api-models/Group';
import { IGroup } from './../../../../models/interfaces/group.interface';
import { IAccountsInfo } from './../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from './../../../../models/interfaces/groupsWithAccounts.interface';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'account-operations',
  templateUrl: './account-operations.component.html',
})
export class AccountOperationsComponent implements OnInit {
  // tslint:disable-next-line:no-empty
  public subGroupForm: FormGroup;
  public groupDetailForm: FormGroup;
  public moveGroupForm: FormGroup;
  public shareGroupForm: FormGroup;
  public showGroupForm: boolean = false;
  public activeGroup$: Observable<GroupResponse>;

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.subGroupForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      desc: ['', Validators.required]
    });

    this.moveGroupForm = this._fb.group({
      moveto: ['', Validators.required]
    });

    this.shareGroupForm = this._fb.group({
      userEmail: ['', [Validators.required, Validators.email]]
    });

    this.activeGroup$.subscribe((a) => {
      if (a) {
        this.showGroupForm = true;
        this.groupDetailForm.patchValue({name: a.name, uniqueName: a.uniqueName, description: a.description});
      } else {
        this.showGroupForm = false;
      }
    });
  }

  public async addNewGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();

    let grpObject = new GroupCreateRequest();
    grpObject.parentGroupUniqueName = activeGrp.uniqueName;
    grpObject.description = this.subGroupForm.controls['desc'].value;
    grpObject.name = this.subGroupForm.controls['name'].value;
    grpObject.uniqueName = this.subGroupForm.controls['uniqueName'].value;

    this.store.dispatch(this.groupWithAccountsAction.createGroup(grpObject));
    this.subGroupForm.reset();
  }
}
