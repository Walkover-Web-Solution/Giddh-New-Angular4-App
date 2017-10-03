import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { MagicLinkRequest } from '../../../models/api-models/Ledger';
import { ShareAccountRequest, AccountSharedWithResponse } from '../../../models/api-models/Account';
import { AccountService } from '../../../services/account.service';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';

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
  public activeAccountSharedWith$: Observable<AccountSharedWithResponse[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private _ledgerService: LedgerService, private _accountService: AccountService,
    private store: Store<AppState>, private _ledgerActions: LedgerActions) {
    this.activeAccountSharedWith$ = this.store.select(state => state.ledger.activeAccountSharedWith).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
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
    let accObject = new ShareAccountRequest();
    accObject.role = 'view_only';
    accObject.user = this.email;
    this.store.dispatch(this._ledgerActions.shareAccount(accObject, this.accountUniqueName));
    this.email = '';
  }

  public async unShareAccount(val) {
    this.store.dispatch(this._ledgerActions.unShareAccount(val, this.accountUniqueName));
  }
}
