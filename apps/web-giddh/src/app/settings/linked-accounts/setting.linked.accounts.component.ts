import { takeUntil } from 'rxjs/operators';
import { IOption } from './../../theme/ng-select/option.interface';
import { Store } from '@ngrx/store';
import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { Observable, of, ReplaySubject } from 'rxjs';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsLinkedAccountsService } from '../../services/settings.linked.accounts.service';
import { SettingsLinkedAccountsActions } from '../../actions/settings/linked-accounts/settings.linked.accounts.action';
import { IEbankAccount } from '../../models/api-models/SettingsLinkedAccounts';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { DomSanitizer } from '@angular/platform-browser';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'setting-linked-accounts',
    templateUrl: './setting.linked.accounts.component.html',
    styles: [`
    .bank_delete {
      right: 0;
      bottom: 0;
    }
  `]
})
export class SettingLinkedAccountsComponent implements OnInit, OnDestroy {

    @ViewChild('connectBankModel') public connectBankModel: ModalDirective;
    @ViewChild('confirmationModal') public confirmationModal: ModalDirective;
    @ViewChild('yodleeFormHTML') public yodleeFormHTML: HTMLFormElement;
    @ViewChild('yodleeIframe') public yodleeIframe: HTMLIFrameElement;

    public iframeSource: string = null;
    public ebankAccounts: BankAccountsResponse[] = [];
    public accounts$: IOption[];
    public confirmationMessage: string;
    public dateToUpdate: string;
    public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
    public yodleeForm: FormGroup;
    public companyUniqueName: string;
    public selectedProvider: string;
    public isRefreshWithCredentials: boolean = true;
    public providerAccountId: string = null;
    public needReloadingLinkedAccounts$: Observable<boolean> = of(false);
    public selectedBank: any = null;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private selectedAccount: IEbankAccount;
    private actionToPerform: string;
    private dataToUpdate: object;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
        private settingsLinkedAccountsActions: SettingsLinkedAccountsActions,
        private _accountService: AccountService,
        private _sanitizer: DomSanitizer,
        private _fb: FormBuilder,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
        private _generalService: GeneralService
    ) {
        this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.companyUniqueName = this._generalService.companyUniqueName;
        this.needReloadingLinkedAccounts$ = this.store.select(s => s.settings.linkedAccounts.needReloadingLinkedAccounts).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {

        this.yodleeForm = this._fb.group({
            rsession: ['', [Validators.required]],
            app: ['', [Validators.required]],
            redirectReq: [true, [Validators.required]],
            token: ['', Validators.required],
            extraParams: ['', Validators.required]
        });

        this.store.select(p => p.settings).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.linkedAccounts && o.linkedAccounts.bankAccounts) {
                this.ebankAccounts = _.cloneDeep(o.linkedAccounts.bankAccounts);
            }
        });

        this.store.select(p => p.settings.linkedAccounts.needReloadingLinkedAccounts).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (this.isRefreshWithCredentials) {
                this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });

        this.store.select(p => p.settings.linkedAccounts.iframeSource).pipe(takeUntil(this.destroyed$)).subscribe((source) => {
            if (source) {
                // this.iframeSource = _.clone(source);
                this.connectBankModel.show();
                this.connectBankModel.config.ignoreBackdropClick = true;
            }
        });

        this.flattenAccountsStream$.subscribe(data => {
            if (data) {
                let accounts: IOption[] = [];
                data.map(d => {
                    accounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
                });
                this.accounts$ = accounts;
            }
        });

        this.needReloadingLinkedAccounts$.subscribe(a => {
            // if (a && this.isRefreshWithCredentials) {
            //   this.closeModal();
            // }
            if (a) {
                this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });
    }

    public getInitialEbankInfo() {
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    }

    public connectBank(selectedProvider?, providerAccountId?) {
        // get token info
        if (selectedProvider) {
            this.selectedProvider = selectedProvider;
            this.isRefreshWithCredentials = false;
            this.providerAccountId = providerAccountId;
        }
        this.connectBankModel.show();
        this.connectBankModel.config.ignoreBackdropClick = true;
    }

    /**
     * yodleeBank
     */
    public yodleeBank() {
        this._settingsLinkedAccountsService.GetYodleeToken().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                if (data.body.user) {
                    let token = _.cloneDeep(data.body.user.accessTokens[0]);
                    this.yodleeForm.patchValue({
                        rsession: data.body.rsession,
                        app: token.appId,
                        redirectReq: true,
                        token: token.value,
                        extraParams: ['callback=' + this.config.appUrl + 'app/yodlee-success.html?companyUniqueName=' + this.companyUniqueName]
                    });
                    this.yodleeFormHTML.nativeElement.submit();
                    this.connectBankModel.show();
                }
            }
        });
    }

    public closeModal() {
        this.connectBankModel.hide();
        this.iframeSource = undefined;
        this.selectedProvider = null;
        this.isRefreshWithCredentials = true;
        this.providerAccountId = null;
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    }

    public closeConfirmationModal(isUserAgree: boolean) {
        if (isUserAgree) {
            let accountId = this.selectedAccount.itemAccountId;
            let accountUniqueName = '';
            if (this.selectedAccount.giddhAccount && this.selectedAccount.giddhAccount.uniqueName) {
                accountUniqueName = this.selectedAccount.giddhAccount.uniqueName;
            }
            switch (this.actionToPerform) {
                case 'DeleteAddedBank':
                    let deleteWithAccountId = true;
                    if (this.selectedBank.status !== 'ALREADY_ADDED') {
                        accountId = this.selectedAccount.providerAccount.providerAccountId;
                        deleteWithAccountId = false;
                    }
                    this.store.dispatch(this.settingsLinkedAccountsActions.DeleteBankAccount(accountId, deleteWithAccountId));
                    break;
                case 'UpdateDate':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UpdateDate(this.dateToUpdate, accountId));
                    break;
                case 'LinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.LinkBankAccount(this.dataToUpdate, accountId));
                    break;
                case 'UnlinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UnlinkBankAccount(accountId, accountUniqueName));
                    break;
            }
        }

        this.confirmationModal.hide();
        this.selectedAccount = null;
        this.actionToPerform = null;
    }

    public onRefreshAccounts() {
        this.store.dispatch(this.settingsLinkedAccountsActions.RefreshAllAccounts());
    }

    public onReconnectAccount(account) {
        this.store.dispatch(this.settingsLinkedAccountsActions.ReconnectAccount(account.loginId));
    }

    public onDeleteAddedBank(bankName, account, bank) {
        if (bankName && account) {
            this.selectedBank = _.cloneDeep(bank);
            this.selectedAccount = _.cloneDeep(account);
            this.confirmationMessage = `Are you sure you want to delete ${bankName} ? All accounts linked with the same bank will be deleted.`;
            this.actionToPerform = 'DeleteAddedBank';
            this.confirmationModal.show();
        } else {
        //
        }
    }

    public onRefreshToken(account, isUpdateAccount) {
        if (isUpdateAccount) {
            if (!this.providerAccountId) {
                this.providerAccountId = account.providerAccountId;
                delete account['providerAccountId'];
            }
            // this.selectedProvider = this.providerAccountId;
            this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(this.providerAccountId, account));
            return;
        }
        this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(account.providerAccount.providerAccountId, {}));
    }

    public onAccountSelect(account, data) {
        if (data && data.value) {
            // Link bank account
            this.dataToUpdate = {
                itemAccountId: account.itemAccountId,
                uniqueName: data.value
            };

            this.selectedAccount = _.cloneDeep(account);
            this.confirmationMessage = `Are you sure you want to link ${data.value} ?`;
            this.actionToPerform = 'LinkAccount';
            this.confirmationModal.show();
        }
    }

    public onUnlinkBankAccount(account) {
        this.selectedAccount = _.cloneDeep(account);
        this.confirmationMessage = `Are you sure you want to unlink ${account.giddhAccount.name} ?`;
        this.actionToPerform = 'UnlinkAccount';
        this.confirmationModal.show();
    }

    public onUpdateDate(date, account) {
        this.dateToUpdate = moment(date).format('DD-MM-YYYY');

        this.selectedAccount = _.cloneDeep(account);
        this.confirmationMessage = `Do you want to get ledger entries for this account from ${this.dateToUpdate} ?`;
        this.actionToPerform = 'UpdateDate';
        this.confirmationModal.show();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
