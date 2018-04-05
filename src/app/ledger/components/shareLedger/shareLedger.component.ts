import { AccountsAction } from './../../../actions/accounts.actions';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { MagicLinkRequest } from '../../../models/api-models/Ledger';
import { ShareAccountRequest, AccountSharedWithResponse } from '../../../models/api-models/Account';
import { AccountService } from '../../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';

@Component({
  selector: 'share-ledger',
  templateUrl: './shareLedger.component.html'
})
export class ShareLedgerComponent implements OnInit {
  @Input() public accountUniqueName: string = '';
  @Input() public from: string = '';
  @Input() public to: string = '';
  @Output() public closeShareLedgerModal: EventEmitter<boolean> = new EventEmitter();
  public email: string;
  public magicLink: string = '';
  public isCopied: boolean = false;
  public activeAccountSharedWith: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _ledgerService: LedgerService, private _accountService: AccountService,
    private store: Store<AppState>, private _ledgerActions: LedgerActions, private accountActions: AccountsAction) {
  }

  public ngOnInit() {
    //
  }

  public checkAccountSharedWith() {
    this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
    this.store.select(state => state.ledger.activeAccountSharedWith).subscribe((data) => {
      this.activeAccountSharedWith = _.cloneDeep(data);
    });
  }

  public getMagicLink() {
    let magicLinkRequest = new MagicLinkRequest();
    magicLinkRequest.from = this.from;
    magicLinkRequest.to = this.to;
    this._ledgerService.GenerateMagicLink(magicLinkRequest, this.accountUniqueName).subscribe(resp => {
      if (resp.status === 'success') {
        this.magicLink = resp.body.magicLink;
      } else {
        this.magicLink = '';
        console.log(resp);
      }
    });
  }

  public toggleIsCopied() {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
  }

  public shareAccount() {
    let userRole = {
      emailId: this.email,
      entity: 'account',
      entityUniqueName: this.accountUniqueName,
    };
    let selectedPermission = 'view';
    this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
    this.email = '';
    setTimeout(() => {
      this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
    }, 1000);
  }

  public unShareAccount(entryUniqueName, val) {
    this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', this.accountUniqueName));
    setTimeout(() => {
      this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
    }, 1000);
  }

  public clear() {
    this.email = '';
    this.magicLink = '';
    this.isCopied = false;
  }
}
