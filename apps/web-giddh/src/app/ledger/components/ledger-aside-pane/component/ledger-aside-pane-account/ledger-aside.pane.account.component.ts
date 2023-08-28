import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IOption } from '../../../../../theme/ng-select/option.interface';
import { AppState } from '../../../../../store';
import { AccountsAction } from '../../../../../actions/accounts.actions';
import { AccountRequestV2 } from '../../../../../models/api-models/Account';

@Component({
    selector: 'ledger-aside-pane-account',
    styleUrls: ['./ledger-aside.pane.account.component.scss'],
    templateUrl: './ledger-aside.pane.account.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LedgerAsidePaneAccountComponent implements OnInit, OnDestroy {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
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
    public createAccountInProcess$: Observable<boolean>;
    public flattenGroupsArray: IOption[] = [];
    public isDebtorCreditor: boolean = false;

    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private accountsAction: AccountsAction,
    ) {
        // account-add component's property
        this.createAccountInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountInProcess), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof LedgerAsidePaneAccountComponent
     */
    public ngOnInit(): void {
        this.select2Options.placeholder = this.commonLocaleData?.app_select_group;
    }

    public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
    }

    public closeAsidePane(event) {
        this.closeAsideEvent.emit(event);
    }

    public isGroupSelected(event) {
        if (event) {
            this.activeGroupUniqueName = event.value;
            let accountCategory = event?.additional[0]?.category || '';
            this.isGstEnabledAcc = accountCategory === 'assets' || accountCategory === 'liabilities';
            this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
