import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { GroupCreateRequest, GroupResponse } from '../../../../models/api-models/Group';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { ToasterService } from '../../../../services/toaster.service';
import { GeneralService } from 'app/services/general.service';

@Component({
  selector: 'group-add',
  templateUrl: 'group-add.component.html'
})

export class GroupAddComponent implements OnInit, OnDestroy {
  @Input() public path: string[] = [];
  public activeGroupUniqueName$: Observable<string>;
  public groupDetailForm: FormGroup;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public showAddNewGroup$: Observable<boolean>;
  public isCreateGroupInProcess$: Observable<boolean>;
  public isCreateGroupSuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private _generalServices: GeneralService) {
    this.activeGroupUniqueName$ = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).takeUntil(this.destroyed$);
    this.showAddNewGroup$ = this.store.select(state => state.groupwithaccounts.showAddNewGroup).takeUntil(this.destroyed$);
    this.fetchingGrpUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.groupwithaccounts.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.isCreateGroupInProcess$ = this.store.select(state => state.groupwithaccounts.isCreateGroupInProcess).takeUntil(this.destroyed$);
    this.isCreateGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isCreateGroupSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.groupDetailForm = this._fb.group({
      name: ['', Validators.required],
      uniqueName: ['', Validators.required],
      description: ['']
    });

    this.isCreateGroupSuccess$.distinctUntilChanged().subscribe(a => {
      if (a) {
        this.groupDetailForm.reset();
      }
    });

    this.groupDetailForm.get('name').valueChanges.debounceTime(100).subscribe(name => {
      let val: string = name;
      val = uniqueNameInvalidStringReplace(val);
      if (val) {
        this.store.dispatch(this.groupWithAccountsAction.getGroupUniqueName(val));
        this.isGroupNameAvailable$.subscribe(a => {
          if (a !== null && a !== undefined) {
            if (a) {
              this.groupDetailForm.patchValue({ uniqueName: val });
            } else {
              let num = 1;
              this.groupDetailForm.patchValue({ uniqueName: val + num });
            }
          }
        });
      } else {
        this.groupDetailForm.patchValue({ uniqueName: '' });
      }
    });
  }

  // public generateUniqueName() {
  //   let val: string = this.groupDetailForm.controls['name'].value;
  //   val = uniqueNameInvalidStringReplace(val);
  //   if (val) {
  //     this.store.dispatch(this.groupWithAccountsAction.getGroupUniqueName(val));

  //     this.isGroupNameAvailable$.subscribe(a => {
  //       if (a !== null && a !== undefined) {
  //         if (a) {
  //           this.groupDetailForm.patchValue({ uniqueName: val });
  //         } else {
  //           let num = 1;
  //           this.groupDetailForm.patchValue({ uniqueName: val + num });
  //         }
  //       }
  //     });
  //   } else {
  //     this.groupDetailForm.patchValue({ uniqueName: '' });
  //   }
  // }

  public addNewGroup() {
    let activeGrpUniqueName: string;
    let uniqueName = this.groupDetailForm.get('uniqueName');
    uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());

    this.activeGroupUniqueName$.take(1).subscribe(a => activeGrpUniqueName = a);

    let grpObject: GroupCreateRequest;
    grpObject = this.groupDetailForm.value as GroupCreateRequest;
    grpObject.uniqueName = grpObject.uniqueName;
    grpObject.parentGroupUniqueName = activeGrpUniqueName;
    grpObject.path = this.path;
    // add bredcrum to payload
    this.store.dispatch(this.groupWithAccountsAction.createGroup(grpObject));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
