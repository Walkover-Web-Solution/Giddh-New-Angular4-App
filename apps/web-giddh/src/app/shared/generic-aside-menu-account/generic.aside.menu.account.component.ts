import { Observable, of, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';

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
    /** True, if new service is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isServiceCreation is true, then directly 'activeGroupUniqueName' will be
     * used to fetch groups
    */
    @Input() public isServiceCreation: boolean;
    /** True, if new customer/vendor account is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isCustomerCreation is true, then directly 'activeGroupUniqueName' will be
     * used to fetch groups
    */
    @Input() public isCustomerCreation: boolean;

	// private below
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
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
			this.activeGroupUniqueName = event.value;
		}
	}

	public ngOnChanges(s: SimpleChanges) {

		if ('selectedGrpUniqueName' in s && s.selectedGrpUniqueName.currentValue !== s.selectedGrpUniqueName.previousValue) {
            this.isCustomerCreation = true;
            this.activeGroupUniqueName = s.selectedGrpUniqueName.currentValue;
            this.flatAccountWGroupsList$ = of(null);
            this.flatAccountWGroupsList = undefined;
        }

        if('selectedGroupUniqueName' in s && s.selectedGroupUniqueName.currentValue !== s.selectedGroupUniqueName.previousValue) {
            // get groups list
            this.isServiceCreation = true;
            this.flatAccountWGroupsList$ = of(null);
            this.flatAccountWGroupsList = undefined;
            if (this.selectedGroupUniqueName === 'purchase') {
                this.activeGroupUniqueName = 'operatingcost';
            } else {
                this.activeGroupUniqueName = 'revenuefromoperations';
            }
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
