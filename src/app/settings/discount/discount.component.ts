import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GroupService } from '../../services/group.service';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { SettingsDiscountActions } from '../../actions/settings/discount/settings.discount.action';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'setting-discount',
  templateUrl: './discount.component.html'
})

export class DiscountComponent implements OnInit, OnDestroy {
  public discountTypeList: IOption[] = [
    {label: 'as per value', value: 'FIX_AMOUNT'},
    {label: 'as per percent', value: 'PERCENTAGE'}
  ];
  public accounts$: IOption[];
  public createRequest: CreateDiscountRequest = new CreateDiscountRequest();
  public discountList$: Observable<IDiscountList[]>;
  public isDiscountListInProcess$: Observable<boolean>;
  public isDiscountCreateInProcess$: Observable<boolean>;
  public isDiscountCreateSuccess$: Observable<boolean>;
  public isDeleteDiscountInProcess$: Observable<boolean>;
  public isDeleteDiscountSuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _settingsDiscountAction: SettingsDiscountActions,
              private _groupService: GroupService, private store: Store<AppState>) {
    this.getFlattenAccounts();

    this.discountList$ = this.store.select(s => s.settings.discount.discountList).takeUntil(this.destroyed$);
    this.isDiscountListInProcess$ = this.store.select(s => s.settings.discount.isDiscountListInProcess).takeUntil(this.destroyed$);
    this.isDiscountCreateInProcess$ = this.store.select(s => s.settings.discount.isDiscountCreateInProcess).takeUntil(this.destroyed$);
    this.isDiscountCreateSuccess$ = this.store.select(s => s.settings.discount.isDiscountCreateSuccess).takeUntil(this.destroyed$);
    this.isDeleteDiscountInProcess$ = this.store.select(s => s.settings.discount.isDeleteDiscountInProcess).takeUntil(this.destroyed$);
    this.isDeleteDiscountSuccess$ = this.store.select(s => s.settings.discount.isDeleteDiscountSuccess).takeUntil(this.destroyed$);

  }

  public ngOnInit() {
    this.store.dispatch(this._settingsDiscountAction.GetDiscount());

    this.isDiscountCreateSuccess$.subscribe(s => {
      this.createRequest = new CreateDiscountRequest();
    });
  }

  public submit() {
    this.store.dispatch(this._settingsDiscountAction.CreateDiscount(this.createRequest));
  }

  public edit(data: IDiscountList) {
    this.createRequest.type = data.discountType;
    this.createRequest.name = data.name;
    this.createRequest.discountValue = data.discountValue;
    this.createRequest.accountUniqueName = data.linkAccount.uniqueName;
  }

  public delete(uniqueName: string) {
    this.createRequest = new CreateDiscountRequest();
    this.store.dispatch(this._settingsDiscountAction.DeleteDiscount(uniqueName));
  }

  /**
   *
   */
  public getFlattenAccounts() {
    this._groupService.GetGroupsWithAccounts('').subscribe(result => {
      let oCost = result.body.find(b => b.uniqueName === 'operatingcost');
      let discount: GroupsWithAccountsResponse = null;
      if (oCost) {
        discount = oCost.groups.find(f => f.uniqueName === 'discount');

        if (discount) {
          this.accounts$ = discount.accounts.map(dis => {
            return {label: dis.name, value: dis.uniqueName};
          });
        } else {
          this.accounts$ = [];
        }
      } else {
        this.accounts$ = [];
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
