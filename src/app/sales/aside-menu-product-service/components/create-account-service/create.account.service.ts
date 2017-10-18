import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AccountRequestV2 } from '../../../../models/api-models/Account';
import { ReplaySubject } from 'rxjs/Rx';
import { digitsOnly } from '../../../../shared/helpers/customValidationHelper';
import { uniqueNameInvalidStringReplace } from '../../../../shared/helpers/helperFunctions';
import { IOption } from '../../../../shared/theme/index';
import { SalesActions } from '../../../../services/actions/sales/sales.action';
import { Select2OptionData } from '../../../../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FIXED_CATEGORY_OF_GROUPS } from '../../../sales.module';
import { GroupService } from '../../../../services/group.service';
import { GroupResponse } from '../../../../models/api-models/Group';
import { AccountService } from '../../../../services/account.service';
import { ToasterService } from '../../../../services/toaster.service';

export const PURCHASE_GROUPS = ['operatingcost']; // purchases
export const SALES_GROUPS = ['revenuefromoperations']; // sales

@Component({
  selector: 'create-account-service',
  templateUrl: 'create.account.service.html',
  styles: [`
    .form-group label{
      margin-bottom:5px;
    }
    .fake_header{
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
      margin-bottom: 15px;
      font-size: 20px;
    }
  `]
})

export class CreateAccountServiceComponent implements OnInit, OnDestroy {

  @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();

  // public
  public addAcForm: FormGroup;
  public isAccountNameAvailable$: Observable<boolean>;
  public flatGroupsList$: Observable<IOption[]>;
  public createAccountInProcess$: Observable<boolean>;
  public createAccountIsSuccess$: Observable<boolean>;
  public flatAccountWGroupsList$: Observable<Select2OptionData[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public activeGroupUniqueName: string;
  // private
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _fb: FormBuilder,
    private _toasty: ToasterService,
    private _store: Store<AppState>,
    private _groupService: GroupService,
    private _salesActions: SalesActions,
    private _accountService: AccountService,
    private _accountsAction: AccountsAction
  ) {
    this.isAccountNameAvailable$ = this._store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this._store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this._store.select(state => state.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
  }
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public ngOnInit(): void {

    // init ac form
    this.initAcForm();

    // utility to enable disable HSN/SAC
    this.addAcForm.get('hsnOrSac').valueChanges.subscribe(a => {
      const hsn: AbstractControl = this.addAcForm.get('hsnNumber');
      const sac: AbstractControl = this.addAcForm.get('sacNumber');
      if (a === 'hsn') {
        // hsn.reset();
        sac.reset();
        hsn.enable();
        sac.disable();
      } else {
        // sac.reset();
        hsn.reset();
        sac.enable();
        hsn.disable();
      }
    });

    // get groups list
    this._groupService.GetGroupSubgroups('revenuefromoperations').subscribe((res: any) => {
      let result: Select2OptionData[] = [];
      if (res.status === 'success' && res.body.length > 0) {
        let flatGrps = this._groupService.flattenGroup(res.body, []);
        _.forEach(flatGrps, (grp: GroupResponse) => {
          result.push({ text: grp.name, id: grp.uniqueName });
        });
      }
      this.flatAccountWGroupsList$ = Observable.of(result);
    });

  }

  public initAcForm(): void {
    this.addAcForm = this._fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      uniqueName: [null, [Validators.required]],
      openingBalanceType: ['CREDIT'],
      openingBalance: [0, Validators.compose([digitsOnly])],
      hsnOrSac: [null],
      hsnNumber: [{ value: null, disabled: false }],
      sacNumber: [{ value: null, disabled: false }]
    });
  }

  public generateUniqueName() {
    let val: string = this.addAcForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);
    if (val) {
      this._store.dispatch(this._accountsAction.getAccountUniqueName(val));
      this.isAccountNameAvailable$.subscribe(a => {
        if (a) {
          this.addAcForm.patchValue({ uniqueName: val });
        } else {
          let num = 1;
          this.addAcForm.patchValue({ uniqueName: val + num });
        }
      });
    }else {
      this.addAcForm.patchValue({ uniqueName: null });
    }

  }

  public addAcFormSubmit() {
    let formObj = this.addAcForm.value;
    this._accountService.CreateAccountV2(formObj, this.activeGroupUniqueName).subscribe((res: any) => {
      if (res.status === 'success') {
        this._toasty.successToast('A/c created successfully.');
        this.closeCreateAcModal();
        this._store.dispatch(this._salesActions.getFlattenAcOfSales({groupUniqueNames: ['sales']}));
      }else {
        this._toasty.errorToast(res.message, res.code);
      }
    });
  }

  public closeCreateAcModal() {
    this.addAcForm.reset();
    this.closeAsideEvent.emit();
  }
}
