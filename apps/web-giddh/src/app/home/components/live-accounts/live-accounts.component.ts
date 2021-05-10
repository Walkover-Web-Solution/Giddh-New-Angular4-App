import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BankAccountsResponse, RefreshBankAccountResponse } from '../../../models/api-models/Dashboard';
import { HomeActions } from '../../../actions/home/home.actions';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'live-accounts',
    templateUrl: 'live-accounts.component.html',
    styleUrls: ['./live-accounts.component.scss'],
})

export class LiveAccountsComponent implements OnInit, OnDestroy {
    public bankAccountsError$: Observable<string>;
    @Input() public refresh: boolean = false;
    @ViewChild('refreshBankAccountModal', { static: true }) public refreshBankAccountModal: ModalDirective;
    public reconnectBankAccount$: Observable<RefreshBankAccountResponse>;
    public refreshBankAccount$: Observable<RefreshBankAccountResponse>;
    public bankAccounts$: Observable<BankAccountsResponse[]>;
    public isGetBankAccountsInProcess$: Observable<boolean>;
    public connectUrl: SafeResourceUrl;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _homeActions: HomeActions, private _sanitizer: DomSanitizer) {
        this.isGetBankAccountsInProcess$ = this.store.pipe(select(p => p.home.isGetBankAccountsInProcess), takeUntil(this.destroyed$));
        this.bankAccounts$ = this.store.pipe(select(p => p.home.BankAccounts), takeUntil(this.destroyed$));
        this.bankAccountsError$ = this.store.pipe(select(p => p.home.getBankAccountError), takeUntil(this.destroyed$));
        this.refreshBankAccount$ = this.store.pipe(select(p => p.home.RefereshBankAccount), takeUntil(this.destroyed$));
        this.reconnectBankAccount$ = this.store.pipe(select(p => p.home.ReConnectBankAccount), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.reload();

        this.refreshBankAccount$.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                if (p.connectUrl) {
                    this.connectUrl = this._sanitizer.bypassSecurityTrustResourceUrl(p.connectUrl);
                    this.refreshBankAccountModal.show();
                }
            }
        });
        this.reconnectBankAccount$.pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                if (p.connectUrl) {
                    this.connectUrl = this._sanitizer.bypassSecurityTrustResourceUrl(p.connectUrl);
                    this.refreshBankAccountModal.show();
                }
            }
        });
    }

    public reload() {
        this.store.dispatch(this._homeActions.GetBankAccount());
    }

    public refreshBank(loginid: string) {
        this.store.dispatch(this._homeActions.RefereshBankAccount(loginid));
    }

    public reconnect(loginid: string) {
        this.store.dispatch(this._homeActions.ReConnectBankAccount(loginid));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
