import { take, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenGroupsAccountItem, IFlattenGroupsAccountsDetail, IFlattenGroupsAccountsDetailItem } from '../../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FlyAccountsActions } from '../../../../actions/fly-accounts.actions';
import * as _ from '../../../../lodash-optimized';

@Component({
	selector: 'accounts-side-bar',
	templateUrl: './accounts-side-bar.component.html',
	styleUrls: ['./accounts-side-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsSideBarComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public flyAccounts: boolean;
	@Input() public search: string;
	@Input() public noGroups: boolean;
	@Input() public isGroupToggle: boolean;
	@Input() public isRouter: boolean;

	public flatAccountWGroupsList: IFlattenGroupsAccountsDetail[];
	public Items: IFlattenGroupsAccountItem[];
	public ItemsSRC: IFlattenGroupsAccountItem[];
	public isFlyAccountInProcess$: Observable<boolean>;
	public companyList$: Observable<any>;
	public showAccountList: boolean = true;
	@Output() public openAddAndManage: EventEmitter<boolean> = new EventEmitter();
	@Output() public onSelectItem: EventEmitter<boolean> = new EventEmitter();

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private store: Store<AppState>, private _flyAccountActions: FlyAccountsActions, private cd: ChangeDetectorRef) {
		this.store.select(state => {
			return state.flyAccounts.flattenGroupsAccounts;
		}).pipe(takeUntil(this.destroyed$)).subscribe(p => {
			this.flatAccountWGroupsList = _.cloneDeep(p);
			this.Items = _.flatten(_.map(this.flatAccountWGroupsList, (g: IFlattenGroupsAccountsDetail): IFlattenGroupsAccountItem[] => {
				let r: IFlattenGroupsAccountItem[] = [{
					Name: g.groupName,
					UniqueName: g.groupUniqueName,
					isGroup: true,
					isOpen: false,
					groupUniqueName: null,
				}];
				if (g.accountDetails) {
					let accs = _.map(g.accountDetails, (a: IFlattenGroupsAccountsDetailItem): IFlattenGroupsAccountItem => {
						return {
							Name: a.name,
							UniqueName: a.uniqueName,
							isGroup: false,
							isOpen: false,
							groupUniqueName: g.groupUniqueName
						} as IFlattenGroupsAccountItem;
					});
					r[0].accounts = accs;
				} else {
					r[0].accounts = [];
				}
				return r;
			}));
			this.ItemsSRC = _.flatten(_.map(this.flatAccountWGroupsList, (g: IFlattenGroupsAccountsDetail): IFlattenGroupsAccountItem[] => {
				let r: IFlattenGroupsAccountItem[] = [{
					Name: g.groupName,
					UniqueName: g.groupUniqueName,
					isGroup: true,
					isOpen: false,
					groupUniqueName: null,
				}];
				if (g.accountDetails) {
					let accs = _.map(g.accountDetails, (a: IFlattenGroupsAccountsDetailItem): IFlattenGroupsAccountItem => {
						return {
							Name: a.name,
							UniqueName: a.uniqueName,
							isGroup: false,
							isOpen: false,
							groupUniqueName: g.groupUniqueName
						} as IFlattenGroupsAccountItem;
					});
					r[0].accounts = accs;
					r = r.concat(accs);
				} else {
					r[0].accounts = [];
				}
				return r;
			}));
			if (this.search && this.search.length > 0) {
				this.toggleNoGroups(true);
			}
			// this.noGroups = this.noGroups;
			// this.toggleAccounts(this._noGroups);
			// this._noGroups = true;
		});
		this.isFlyAccountInProcess$ = this.store.select(s => s.flyAccounts.isFlyAccountInProcess).pipe(takeUntil(this.destroyed$));

		this.companyList$ = this.store.select(state => {
			return state.session.companies;
		}).pipe(takeUntil(this.destroyed$));
	}

	public ngOnChanges(s: SimpleChanges) {
		if (s.noGroups && !s.noGroups.firstChange && s.noGroups.currentValue !== s.noGroups.previousValue) {
			this.toggleNoGroups(s.noGroups.currentValue);
		}
		if (s.search && !s.search.firstChange && s.search.currentValue !== s.search.previousValue) {
			// this.searchAccount(s.search.currentValue);
		}
		if (s.isGroupToggle) {
			this.toggleNoGroups(s.noGroups.currentValue);
		}
	}

	public ngOnInit() {
		this.store.select(p => p.session.companyUniqueName).pipe(take(1)).subscribe(a => {
			if (a && a !== '') {
				this.store.dispatch(this._flyAccountActions.GetflatAccountWGroups());
			}
		});
	}

	public searchAccount(s: string) {
		this.Items = _.cloneDeep(this.ItemsSRC);
		if (s === '') {
			this.Items = _.cloneDeep(this.ItemsSRC);
			this.cd.detectChanges();
		} else {
			for (let index = 0; index < this.Items.length; index++) {
				let a = this.Items[index];
				if (!a.isGroup) {
					if (a.Name.indexOf(s) === -1 && a.UniqueName.indexOf(s) === -1) {
						this.Items.splice(index, 1);
						index = index - 1;
					}
				} else {
					a.isOpen = true;
					if (index > 0 && this.Items[index - 1].isGroup) {
						this.Items.splice(index - 1, 1);
						index = index - 1;
					}
				}
			}
			if (this.Items[this.Items.length - 1].isGroup) {
				this.Items.splice(this.Items.length - 1, 1);
			}
			this.Items = _.cloneDeep(this.Items);
			this.cd.detectChanges();
		}
	}

	public toggleNoGroups(noGroups: boolean) {
		// this.flatAccountWGroupsList.forEach(p => {
		//   p.isOpen = noGroups;
		// });
		if (noGroups) {
			/// open all Groups
			for (let index = 0; index < this.Items.length; index++) {
				let a = this.Items[index];
				if (a.isGroup && !a.isOpen) {
					this.Items[index].isOpen = true;
					let accs = _.cloneDeep(this.Items[index].accounts);
					this.Items.splice(index + 1, 0, ...accs);
				}
			}
		} else {
			// close all groups
			for (let index = 0; index < this.Items.length; index++) {
				let a = this.Items[index];
				if (a.isGroup && a.isOpen) {
					this.Items[index].isOpen = false;
					this.Items.splice(index + 1, a.accounts.length);
				}
			}
		}
		this.Items = _.cloneDeep(this.Items);
		if (!this.cd['destroyed']) {
			this.cd.detectChanges();
		}
	}

	public goToManageGroups() {
		this.openAddAndManage.emit(true);
	}

	public ngOnDestroy() {
		this.store.dispatch(this._flyAccountActions.ResetflatAccountWGroups());
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public getSize(item: IFlattenGroupsAccountItem, index) {
		if (item.isGroup) {
			return 37;
		}
		return 32;
	}

	public toggleGroup(group: IFlattenGroupsAccountItem, index, event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (group.isOpen) {
			this.Items[index].isOpen = false;
			this.Items.splice(index + 1, group.accounts.length);
		} else {
			this.Items[index].isOpen = true;
			let accs = _.cloneDeep(this.Items[index].accounts);
			this.Items.splice(index + 1, 0, ...accs);
		}
		this.Items = _.cloneDeep(this.Items);
		this.cd.detectChanges();
	}
}
