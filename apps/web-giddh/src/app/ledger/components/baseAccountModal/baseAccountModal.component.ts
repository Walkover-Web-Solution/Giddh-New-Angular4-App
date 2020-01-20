import { AccountsAction } from '../../../actions/accounts.actions';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { AccountService } from '../../../services/account.service';
import { ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';

@Component({
    selector: 'base-account',
    templateUrl: './baseAccountModal.component.html',
    styles: [`
    .bg_grey {
        background: #eaebed;
    }
    `]
})
export class BaseAccountComponent implements OnInit {
    @Input() public accountUniqueName: string = '';
    // @Input() public from: string = '';
    // @Input() public to: string = '';
    @Output() public closeBaseAccountModal: EventEmitter<boolean> = new EventEmitter();
    @Output() public updateBaseAccount: EventEmitter<any> = new EventEmitter();
    @Input() public flattenAccountList: any;
    public changedAccountUniq: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _ledgerService: LedgerService, private _accountService: AccountService,
        private store: Store<AppState>, private _ledgerActions: LedgerActions, private accountActions: AccountsAction) {

    }

    public ngOnInit() {
        //
    }

    public changeBaseAccount(item) {
        if (item) {
            this.changedAccountUniq = item.value;
        }
        // this.updateBaseAccount.emit(this.accountUniqueName);
    }

    public saveBaseAccount() {
        this.updateBaseAccount.emit(this.changedAccountUniq);
    }
}
