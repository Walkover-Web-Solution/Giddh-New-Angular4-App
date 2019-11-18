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

@Component({
    selector: 'generic-aside-menu-account',
    styles: [`
      :host {
          position: fixed;
          left: auto;
          top: 0;
          right: 0;
          bottom: 0;
          max-width: 760px;
          width: 100%;
          z-index: 99999;
      }
        .aside-pane{
            padding:0 !important;
    }

      :host.in #close {
            display: block;
   position: absolute;
    right: 0;
    top: 16px;
    z-index: 5;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #fff;
      }

      :host .container-fluid {
          padding-left: 0;
          padding-right: 0;
      }

      :host .aside-pane {
          max-width: 760px;
          width: 100%;
      }
.aside-body{
    padding:0 15px;
}
 .aside-pane-form {
       background-color: #fff;
       box-shadow: 0px 3px 6px #0000001A;
       padding: 15px 15px;
        height: calc(100vh - 90px);
       overflow: scroll;
       position: relative;
       margin-top:15px;
   }



    @media(max-width:575px){
    :host {
      max-width: 370px;
    }
    :host .aside-pane {
      max-width: 370px;
    }
}
@media(max-width:375px){
  :host {
    max-width: 310px;
  }
  :host .aside-pane {
      max-width: 310px;
    }
}
@media(max-width:320px){
  :host {
    max-width: 280px;
  }
  :host .aside-pane {
      max-width: 280px;
      }
}

  `],
    templateUrl: './generic.aside.menu.account.component.html'
})
export class GenericAsideMenuAccountComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public selectedGrpUniqueName: string;
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
    public isDebtorCreditor: boolean = false;


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
            return { label: m.groupName, value: m.groupUniqueName };
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
