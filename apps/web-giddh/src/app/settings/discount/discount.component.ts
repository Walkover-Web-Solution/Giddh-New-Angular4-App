import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { Observable, ReplaySubject } from 'rxjs';
import { GroupService } from '../../services/group.service';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { SettingsDiscountActions } from '../../actions/settings/discount/settings.discount.action';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'setting-discount',
	templateUrl: './discount.component.html',
	styleUrls: ['./discount.component.scss'],
	animations: [
		trigger('slideInOut', [
			state('in', style({
				transform: 'translate3d(0, 0, 0)'
			})),
			state('out', style({
				transform: 'translate3d(100%, 0, 0)'
			})),
			transition('in => out', animate('400ms ease-in-out')),
			transition('out => in', animate('400ms ease-in-out'))
		]),
	]
})

export class DiscountComponent implements OnInit, OnDestroy {
	@ViewChild('discountConfirmationModel') public discountConfirmationModel: ModalDirective;
	public discountTypeList: IOption[] = [
		{ label: 'as per value', value: 'FIX_AMOUNT' },
		{ label: 'as per percent', value: 'PERCENTAGE' }
	];
	public accounts$: IOption[];
	public createRequest: CreateDiscountRequest = new CreateDiscountRequest();
	public deleteRequest: string = null;
	public discountList$: Observable<IDiscountList[]>;
	public isDiscountListInProcess$: Observable<boolean>;
	public isDiscountCreateInProcess$: Observable<boolean>;
	public isDiscountCreateSuccess$: Observable<boolean>;
	public isDiscountUpdateInProcess$: Observable<boolean>;
	public isDiscountUpdateSuccess$: Observable<boolean>;
	public isDeleteDiscountInProcess$: Observable<boolean>;
	public isDeleteDiscountSuccess$: Observable<boolean>;
	public accountAsideMenuState: string = 'out';

	private createAccountIsSuccess$: Observable<boolean>;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _settingsDiscountAction: SettingsDiscountActions,
		private _groupService: GroupService, private store: Store<AppState>) {
		this.getFlattenAccounts();

		this.discountList$ = this.store.select(s => s.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
		this.isDiscountListInProcess$ = this.store.select(s => s.settings.discount.isDiscountListInProcess).pipe(takeUntil(this.destroyed$));
		this.isDiscountCreateInProcess$ = this.store.select(s => s.settings.discount.isDiscountCreateInProcess).pipe(takeUntil(this.destroyed$));
		this.isDiscountCreateSuccess$ = this.store.select(s => s.settings.discount.isDiscountCreateSuccess).pipe(takeUntil(this.destroyed$));
		this.isDiscountUpdateInProcess$ = this.store.select(s => s.settings.discount.isDiscountUpdateInProcess).pipe(takeUntil(this.destroyed$));
		this.isDiscountUpdateSuccess$ = this.store.select(s => s.settings.discount.isDiscountUpdateSuccess).pipe(takeUntil(this.destroyed$));
		this.isDeleteDiscountInProcess$ = this.store.select(s => s.settings.discount.isDeleteDiscountInProcess).pipe(takeUntil(this.destroyed$));
		this.isDeleteDiscountSuccess$ = this.store.select(s => s.settings.discount.isDeleteDiscountSuccess).pipe(takeUntil(this.destroyed$));
		this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));

	}

	public ngOnInit() {
		this.store.dispatch(this._settingsDiscountAction.GetDiscount());

		this.isDiscountCreateSuccess$.subscribe(s => {
			this.createRequest = new CreateDiscountRequest();
		});

		this.isDiscountUpdateSuccess$.subscribe(s => {
			this.createRequest = new CreateDiscountRequest();
		});

		this.isDeleteDiscountSuccess$.subscribe(d => {
			this.createRequest = new CreateDiscountRequest();
			this.deleteRequest = null;
		});

		this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
			if (yes) {
				if (this.accountAsideMenuState === 'in') {
					this.toggleAccountAsidePane();
					this.getFlattenAccounts();
				}
			}
		});
	}

	public toggleAccountAsidePane(event?): void {
		if (event) {
			event.preventDefault();
		}
		this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
		this.toggleBodyClass();
	}

	public toggleBodyClass() {
		if (this.accountAsideMenuState === 'in') {
			document.querySelector('body').classList.add('fixed');
		} else {
			document.querySelector('body').classList.remove('fixed');
		}
	}

	public submit() {
		if (this.createRequest.discountUniqueName) {
			this.store.dispatch(this._settingsDiscountAction.UpdateDiscount(this.createRequest, this.createRequest.discountUniqueName));
		} else {
			this.store.dispatch(this._settingsDiscountAction.CreateDiscount(this.createRequest));
		}
	}

	public edit(data: IDiscountList) {
		this.createRequest.type = data.discountType;
		this.createRequest.name = data.name;
		this.createRequest.discountValue = data.discountValue;
		this.createRequest.accountUniqueName = data.linkAccount.uniqueName;
		this.createRequest.discountUniqueName = data.uniqueName;
	}

	public showDeleteDiscountModal(uniqueName: string) {
		this.deleteRequest = uniqueName;
		this.discountConfirmationModel.show();
	}

	public hideDeleteDiscountModal() {
		this.deleteRequest = null;
		this.discountConfirmationModel.hide();
	}

	public delete() {
		this.store.dispatch(this._settingsDiscountAction.DeleteDiscount(this.deleteRequest));
		this.hideDeleteDiscountModal();
	}

    /**
     *
     */
	public getFlattenAccounts() {
		this._groupService.GetGroupsWithAccounts('').subscribe(result => {
			if (result) {
                  let operatingCost = null;
                if(result.body) {
                 operatingCost = result.body.find(b => b.uniqueName === 'operatingcost');
                }
				let discount: GroupsWithAccountsResponse = null;
				if (operatingCost) {
					discount = operatingCost.groups.find(f => f.uniqueName === 'discount');

					if (discount) {
						this.accounts$ = discount.accounts.map(dis => {
							return { label: dis.name, value: dis.uniqueName };
						});
					} else {
						this.accounts$ = [];
					}
				} else {
					this.accounts$ = [];
				}
			}
		});
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
