import { Observable, of, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { GroupService } from '../../services/group.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { GroupResponse } from '../../models/api-models/Group';

@Component({
	selector: 'generic-aside-menu-account',
	styleUrls: [`./generic.aside.menu.account.component.scss`],
	templateUrl: './generic.aside.menu.account.component.html'
})
export class GenericAsideMenuAccountComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public selectedGrpUniqueName: string;
    /** This will hold group unique name */
    @Input() public selectedGroupUniqueName: string;
	@Input() public selectedAccountUniqueName: string;
	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Output() public addEvent: EventEmitter<AddAccountRequest> = new EventEmitter();
	@Output() public updateEvent: EventEmitter<UpdateAccountRequest> = new EventEmitter();

	private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
	public flatAccountWGroupsList$: Observable<IOption[]>;
	public flatAccountWGroupsList: IOption[];
	public activeGroupUniqueName: string;
	public isGstEnabledAcc: boolean = true;
	public isHsnSacEnabledAcc: boolean = false;
	public fetchingAccUniqueName$: Observable<boolean>;
	public isAccountNameAvailable$: Observable<boolean>;
	public createAccountInProcess$: Observable<boolean>;
	public updateAccountInProcess$: Observable<boolean>;
    public showBankDetail: boolean = false;
    /** this will hold if it's debtor/creditor */
    @Input() public isDebtorCreditor: boolean = true;
    /** this will hold if it's bank account */
    @Input() public isBankAccount: boolean = true;


	// private below
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
		private groupService: GroupService,
		private accountsAction: AccountsAction
	) {
		// account-add component's property
		this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));
		this.fetchingAccUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.fetchingAccUniqueName), takeUntil(this.destroyed$));
		this.isAccountNameAvailable$ = this.store.pipe(select(state => state.groupwithaccounts.isAccountNameAvailable), takeUntil(this.destroyed$));
		this.createAccountInProcess$ = this.store.pipe(select(state => state.sales.createAccountInProcess), takeUntil(this.destroyed$));
		this.updateAccountInProcess$ = this.store.pipe(select(state => state.sales.updateAccountInProcess), takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		//
		this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';
	}

	public addNewAcSubmit(accRequestObject: AddAccountRequest) {
		this.addEvent.emit(accRequestObject);
	}

	public updateAccount(accRequestObject: UpdateAccountRequest) {
		this.updateEvent.emit(accRequestObject);
	}

	public closeAsidePane(event) {
		this.closeAsideEvent.emit(event);
	}

	public getGroups(grpUniqueName) {
		let flattenGroups: IFlattenGroupsAccountsDetail[] = [];
		this.flattenGroups$.pipe(take(1)).subscribe(data => flattenGroups = data || []);
		let items = flattenGroups.filter(grps => {
			return grps.groupUniqueName === grpUniqueName || grps.parentGroups.some(s => s.uniqueName === grpUniqueName);
		});

		let flatGrps: IOption[] = items.map(m => {
			return { label: m.groupName, value: m.groupUniqueName, additional: m.parentGroups };
		});

		this.flatAccountWGroupsList$ = of(flatGrps);
		this.flatAccountWGroupsList = flatGrps;
		this.activeGroupUniqueName = grpUniqueName;
	}
	public isGroupSelected(event) {
		if (event) {
			this.activeGroupUniqueName = event;
		}
	}

	public ngOnChanges(s: SimpleChanges) {

		if ('selectedGrpUniqueName' in s && s.selectedGrpUniqueName.currentValue !== s.selectedGrpUniqueName.previousValue) {
			this.getGroups(s.selectedGrpUniqueName.currentValue);
        }
        
        if('selectedGroupUniqueName' in s && s.selectedGroupUniqueName.currentValue !== s.selectedGroupUniqueName.previousValue) {
            // get groups list
            this.groupService.GetGroupsWithAccounts('').subscribe((res: any) => {
                let result: IOption[] = [];
                this.flatAccountWGroupsList$ = of([]);
                if (res.status === 'success' && res.body.length > 0) {
                    if (this.selectedGroupUniqueName === 'purchase') {
                        let revenueGrp = _.find(res.body, { uniqueName: 'operatingcost' });
                        let flatGrps = this.groupService.flattenGroup([revenueGrp], []);
                        if (flatGrps && flatGrps.length) {
                            flatGrps.filter(fgroup => fgroup.uniqueName !== 'operatingcost').forEach((grp: GroupResponse) => {
                                result.push({ label: grp.name, value: grp.uniqueName });
                            });
                        }
                    } else {
                        let revenueGrp = _.find(res.body, { uniqueName: 'revenuefromoperations' });
                        let flatGrps = this.groupService.flattenGroup([revenueGrp], []);
                        if (flatGrps && flatGrps.length) {
                            flatGrps.filter(fgroup => fgroup.uniqueName !== 'revenuefromoperations').forEach((grp: GroupResponse) => {
                                result.push({ label: grp.name, value: grp.uniqueName });
                            });
                        }
                    }
                }
                this.flatAccountWGroupsList$ = of(result);
                this.flatAccountWGroupsList = result;
                this.activeGroupUniqueName = this.selectedGroupUniqueName;
            });
        }

		if ('selectedAccountUniqueName' in s) {
			let value = s.selectedAccountUniqueName;
			if (value.currentValue && value.currentValue !== value.previousValue) {
				this.store.dispatch(this.accountsAction.getAccountDetails(s.selectedAccountUniqueName.currentValue));
			}
		}
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
