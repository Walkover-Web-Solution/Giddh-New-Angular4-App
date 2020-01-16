import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import * as _ from '../../../../../lodash-optimized';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsAction } from '../../../../../actions/accounts.actions';
import { AppState } from '../../../../../store';
import { Store } from '@ngrx/store';
import { digitsOnly } from '../../../../../shared/helpers';
import { uniqueNameInvalidStringReplace } from '../../../../../shared/helpers/helperFunctions';
import { SalesActions } from '../../../../../actions/sales/sales.action';
import { GroupService } from '../../../../../services/group.service';
import { GroupResponse } from '../../../../../models/api-models/Group';
import { AccountService } from '../../../../../services/account.service';
import { ToasterService } from '../../../../../services/toaster.service';
import { IOption } from '../../../../../theme/ng-select/option.interface';

export const PURCHASE_GROUPS = ['operatingcost']; // purchases
export const SALES_GROUPS = ['revenuefromoperations']; // sales

@Component({
    selector: 'create-account-service',
    templateUrl: 'create.account.service.html',
    styleUrls: [`./create.account.service.scss`]
})

export class CreateAccountServiceComponent implements OnInit, OnDestroy {

    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
    @Input() public selectedVoucherType: string;

    // public
    public addAcForm: FormGroup;
    public isAccountNameAvailable$: Observable<boolean>;
    public flatGroupsList$: Observable<IOption[]>;
    public createAccountInProcess$: Observable<boolean>;
    public createAccountIsSuccess$: Observable<boolean>;
    public flatAccountWGroupsList$: Observable<IOption[]>;
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
        this.isAccountNameAvailable$ = this._store.select(state => state.groupwithaccounts.isAccountNameAvailable).pipe(takeUntil(this.destroyed$));
        this.createAccountInProcess$ = this._store.select(state => state.groupwithaccounts.createAccountInProcess).pipe(takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this._store.select(state => state.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));
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
                sac.reset();
                hsn.enable();
                sac.disable();
            } else {
                hsn.reset();
                sac.enable();
                hsn.disable();
            }
        });

        // get groups list
        this._groupService.GetGroupsWithAccounts('').subscribe((res: any) => {
            let result: IOption[] = [];
            this.flatAccountWGroupsList$ = observableOf([]);
            if (res.status === 'success' && res.body.length > 0) {
                if (this.selectedVoucherType === 'purchase') {
                    let revenueGrp = _.find(res.body, { uniqueName: 'operatingcost' });
                    let flatGrps = this._groupService.flattenGroup([revenueGrp], []);
                    if (flatGrps && flatGrps.length) {
                        flatGrps.filter(f => f.uniqueName !== 'operatingcost').forEach((grp: GroupResponse) => {
                            result.push({ label: grp.name, value: grp.uniqueName });
                        });
                    }
                } else {
                    let revenueGrp = _.find(res.body, { uniqueName: 'revenuefromoperations' });
                    let flatGrps = this._groupService.flattenGroup([revenueGrp], []);
                    if (flatGrps && flatGrps.length) {
                        flatGrps.filter(f => f.uniqueName !== 'revenuefromoperations').forEach((grp: GroupResponse) => {
                            result.push({ label: grp.name, value: grp.uniqueName });
                        });
                    }
                }
            }
            this.flatAccountWGroupsList$ = observableOf(result);
        });

    }

    public initAcForm(): void {
        this.addAcForm = this._fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            uniqueName: [null, [Validators.required]],
            openingBalanceType: ['CREDIT'],
            openingBalance: [0, Validators.compose([digitsOnly])],
            hsnOrSac: ['sac'],
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
        } else {
            this.addAcForm.patchValue({ uniqueName: null });
        }

    }

    public addAcFormSubmit() {
        let formObj = this.addAcForm.value;
        this._accountService.CreateAccountV2(formObj, this.activeGroupUniqueName).subscribe((res) => {
            if (res.status === 'success') {
                this._toasty.successToast('A/c created successfully.');
                this.closeCreateAcModal();
                this._store.dispatch(this._salesActions.createServiceAcSuccess({ name: res.body.name, uniqueName: res.body.uniqueName }));
            } else {
                this._toasty.errorToast(res.message, res.code);
            }
        });
    }

    public closeCreateAcModal() {
        this.addAcForm.reset();
        this.closeAsideEvent.emit();
    }
}
