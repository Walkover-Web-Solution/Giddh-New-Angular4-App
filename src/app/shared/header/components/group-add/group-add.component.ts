import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { GroupCreateRequest, GroupResponse } from '../../../../models/api-models/Group';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';

@Component({
  selector: 'group-add',
  templateUrl: 'group-add.component.html'
})

export class GroupAddComponent implements OnInit, OnDestroy {
  public activeGroup$: Observable<GroupResponse>;
  public groupDetailForm: FormGroup;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public showAddNewGroup$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.showAddNewGroup$ = this.store.select(state => state.groupwithaccounts.showAddNewGroup).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['']
    });
  }

  public generateUniqueName() {
    let val: string = this.groupDetailForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);
    if (val) {
      this.store.dispatch(this.groupWithAccountsAction.getGroupUniqueName(val));

      this.isGroupNameAvailable$.subscribe(a => {
        if (a !== null && a !== undefined) {
          if (a) {
            this.groupDetailForm.patchValue({uniqueName: val});
          } else {
            let num = 1;
            this.groupDetailForm.patchValue({uniqueName: val + num});
          }
        }
      });
    } else {
      this.groupDetailForm.patchValue({uniqueName: ''});
    }
  }

  public async addNewGroup() {
    let activeGrp = await this.activeGroup$.first().toPromise();
    let grpObject: GroupCreateRequest;
    grpObject = this.groupDetailForm.value as GroupCreateRequest;
    this.groupDetailForm.get('uniqueName').setValue(grpObject.uniqueName.toLowerCase());
    grpObject.uniqueName = grpObject.uniqueName.toLowerCase();
    grpObject.parentGroupUniqueName = activeGrp.uniqueName;

    this.store.dispatch(this.groupWithAccountsAction.createGroup(grpObject));
    this.groupDetailForm.reset();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
