import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { AccountRequestV2 } from 'apps/web-giddh/src/app/models/api-models/Account';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { GroupsWithAccountsResponse } from 'apps/web-giddh/src/app/models/api-models/GroupsWithAccounts';
import { LedgerActions } from 'apps/web-giddh/src/app/actions/ledger/ledger.actions';
import { States } from 'apps/web-giddh/src/app/models/api-models/Company';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { IFlattenGroupsAccountsDetail } from 'apps/web-giddh/src/app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'quickAccount',
    templateUrl: 'quickAccount.component.html'
})

export class QuickAccountComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public needAutoFocus: boolean = false;
    @Output() public closeQuickAccountModal: EventEmitter<any> = new EventEmitter();
    @ViewChild('groupDDList', { static: true }) public groupDDList: any;
    public groupsArrayStream$: Observable<GroupsWithAccountsResponse[]>;
    public flattenGroupsArray: IOption[] = [];
    public statesStream$: Observable<States[]>;
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public isQuickAccountInProcess$: Observable<boolean>;
    public isQuickAccountCreatedSuccessfully$: Observable<boolean>;
    public showGstBox: boolean = false;
    public newAccountForm: FormGroup;
    public comingFromDiscountList: boolean = false;
    public states: any[] = [];

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _fb: FormBuilder, private _groupService: GroupService, private _toaster: ToasterService,
        private ledgerAction: LedgerActions, private store: Store<AppState>) {
        this.isQuickAccountInProcess$ = this.store.pipe(select(p => p.ledger.isQuickAccountInProcess), takeUntil(this.destroyed$));
        this.isQuickAccountCreatedSuccessfully$ = this.store.pipe(select(p => p.ledger.isQuickAccountCreatedSuccessfully), takeUntil(this.destroyed$));
        this.groupsArrayStream$ = this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$));

        // bind state sources
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                });
                this.statesSource$ = observableOf(this.states);
            }
        });
    }

    public ngOnInit() {
        this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result.status === 'success') {
                let groupsListArray: IOption[] = [];
                result.body.results = this.removeFixedGroupsFromArr(result.body.results);
                result.body.results.forEach(a => {
                    groupsListArray.push({ label: a.groupName, value: a.groupUniqueName });
                });
                this.flattenGroupsArray = groupsListArray;

                // coming from discount list set hardcoded discount list
                if (this.comingFromDiscountList) {
                    // "uniqueName":"discount"
                    this.newAccountForm.get('groupUniqueName')?.patchValue('discount');
                }
            }
        });
        
        this.newAccountForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            uniqueName: ['', [Validators.required]],
            groupUniqueName: [''],
            openingBalanceDate: [],
            addresses: this._fb.array([
                this._fb.group({
                    gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
                    stateCode: [{ value: '', disabled: false }]
                })
            ]),
        });
        this.isQuickAccountCreatedSuccessfully$.subscribe(a => {
            if (a) {
                this.closeQuickAccountModal.emit(true);
                this.store.dispatch(this.ledgerAction.resetQuickAccountModal());
            }
        });
    }

    public ngAfterViewInit() {
        if (this.needAutoFocus) {
            setTimeout(() => {
                this.groupDDList.inputFilter?.nativeElement.click();
            }, 500);
        }
    }

    public generateUniqueName() {
        let control = this.newAccountForm.get('name');
        let uniqueControl = this.newAccountForm.get('uniqueName');
        let unqName = control.value;
        unqName = unqName?.replace(/ |,|\//g, '');
        unqName = unqName.toLowerCase();
        if (unqName?.length >= 1) {
            let unq = '';
            let text = '';
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let i = 0;
            while (i < 3) {
                text += chars.charAt(Math.floor(Math.random() * chars?.length));
                i++;
            }
            unq = unqName + text;
            uniqueControl?.patchValue(unq);
        } else {
            uniqueControl?.patchValue('');
        }
    }

    public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent) {
        let gstVal: string = gstForm.get('gstNumber').value;
        if (gstVal?.length >= 2) {
            this.statesSource$.pipe(take(1)).subscribe(state => {
                let s = state.find(st => st.value === gstVal.substr(0, 2));
                statesEle.disabled = true;
                if (s) {
                    gstForm.get('stateCode')?.patchValue(s.value);
                } else {
                    gstForm.get('stateCode')?.patchValue(null);
                    this._toaster.clearAllToaster();
                    if (!gstForm.get('gstNumber')?.valid) {
                        this._toaster.warningToast('Invalid GSTIN.');
                    }
                }
            });
        } else {
            statesEle.disabled = false;
            gstForm.get('stateCode')?.patchValue(null);
        }
    }

    public checkSelectedGroup(options: IOption) {
        this.groupsArrayStream$.subscribe(data => {
            if (data?.length) {
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
        return data?.filter(da => {
            return !(fixedArr.indexOf(da?.groupUniqueName) > -1);
        });
    }

    public submit() {
        let createAccountRequest: AccountRequestV2 = cloneDeep(this.newAccountForm.value);
        if (!this.showGstBox) {
            delete createAccountRequest.addresses;
        }
        this.store.dispatch(this.ledgerAction.createQuickAccountV2(this.newAccountForm.value?.groupUniqueName, createAccountRequest));
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof QuickAccountComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
