import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IOption } from '../../../../../theme/ng-select/option.interface';
import { AppState } from '../../../../../store';
import { GroupService } from '../../../../../services/group.service';
import { AccountsAction } from '../../../../../actions/accounts.actions';
import { AccountRequestV2 } from '../../../../../models/api-models/Account';
import { IFlattenGroupsAccountsDetail } from '../../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { GroupsWithAccountsResponse } from '../../../../../models/api-models/GroupsWithAccounts';

const GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];

@Component({
	selector: 'ledger-aside-pane-account',
	styleUrls: ['./ledger-aside.pane.account.component.scss'],
	templateUrl: './ledger-aside.pane.account.component.html'
})
export class LedgerAsidePaneAccountComponent implements OnInit, OnDestroy {

	@Input() public activeGroupUniqueName: string;
	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	public select2Options: Select2Options = {
		multiple: false,
		width: '100%',
		placeholder: 'Select Group',
		allowClear: true
	};
	public isGstEnabledAcc: boolean = false;
	public isHsnSacEnabledAcc: boolean = false;
	public fetchingAccUniqueName$: Observable<boolean>;
	public isAccountNameAvailable$: Observable<boolean>;
	public createAccountInProcess$: Observable<boolean>;
	public flattenGroupsArray: IOption[] = [];
	public groupsArrayStream$: Observable<GroupsWithAccountsResponse[]>;
	public isDebtorCreditor: boolean = false;

	// private below
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
		private accountsAction: AccountsAction,
		private _groupService: GroupService
	) {
		this.groupsArrayStream$ = this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$));
		// account-add component's property
		this.fetchingAccUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.fetchingAccUniqueName), takeUntil(this.destroyed$));
		this.isAccountNameAvailable$ = this.store.pipe(select(state => state.groupwithaccounts.isAccountNameAvailable), takeUntil(this.destroyed$));
		this.createAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountInProcess), takeUntil(this.destroyed$));
	}

	public ngOnInit() {
		this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').subscribe(result => {
			if (result.status === 'success') {
				// this.groupsArrayStream$ = Observable.of(result.body.results);
				let groupsListArray: IOption[] = [];
                result.body.results = this.removeFixedGroupsFromArr(result.body.results);
                if(result.body.results && result.body.results.length > 0) {
                    result.body.results.forEach(a => {
                        let parentgroup = a.accountDetails && a.accountDetails.length > 0 ? a.accountDetails[0].parentGroups : [];
                        groupsListArray.push({ label: a.groupName, value: a.groupUniqueName, additional: parentgroup });
                    });
                }
				this.flattenGroupsArray = groupsListArray;
			}
		});
	}

	public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
		this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
	}

	public closeAsidePane(event) {
		this.closeAsideEvent.emit(event);
	}

	public checkSelectedGroup(options: IOption) {
		this.groupsArrayStream$.subscribe(data => {
			if (data && data.length) {
				let accountCategory = this.flattenGroup(data, options.value, null);
				this.isGstEnabledAcc = accountCategory === 'assets' || accountCategory === 'liabilities';
				this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
			}
		});
	}
	public isGroupSelected(event) {
		if (event) {
			this.activeGroupUniqueName = event;
			this.groupsArrayStream$.subscribe(data => {
				if (data && data.length) {
					let accountCategory = this.flattenGroup(data, event, null);
					this.isGstEnabledAcc = accountCategory === 'assets' || accountCategory === 'liabilities';
					this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
				}
			});
		}
	}

	public removeFixedGroupsFromArr(data: IFlattenGroupsAccountsDetail[]) {
		const fixedArr = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost',
			'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
		return data.filter(da => {
			return !(fixedArr.indexOf(da.groupUniqueName) > -1);
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

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
