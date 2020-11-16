import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import { AccountsAction } from './../../../actions/accounts.actions';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { MagicLinkRequest } from '../../../models/api-models/Ledger';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import * as moment from 'moment/moment';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'share-ledger',
    templateUrl: './shareLedger.component.html',
    styles: [`
    .btn-success:disabled {
      color: #fff !important;
    }
  `]
})
export class ShareLedgerComponent implements OnInit, OnDestroy {
    @Input() public accountUniqueName: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Input() public advanceSearchRequest: any;
    @Output() public closeShareLedgerModal: EventEmitter<boolean> = new EventEmitter();
    public email: string;
    public magicLink: string = '';
    public isCopied: boolean = false;
    public activeAccountSharedWith: any[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _ledgerService: LedgerService, private store: Store<AppState>, private _ledgerActions: LedgerActions, private accountActions: AccountsAction) {
    }

    public ngOnInit() {

    }

    public checkAccountSharedWith() {
        this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
        this.store.pipe(select(state => state.ledger.activeAccountSharedWith), takeUntil(this.destroyed$)).subscribe((data) => {
            this.activeAccountSharedWith = _.cloneDeep(data);
        });
    }

    public getMagicLink() {
        let magicLinkRequest = new MagicLinkRequest();
        const data = _.cloneDeep(this.advanceSearchRequest);
        data.dataToSend.bsRangeValue = [moment(this.from, GIDDH_DATE_FORMAT).toDate(), moment(this.to, GIDDH_DATE_FORMAT).toDate()];
        magicLinkRequest.from = moment(data.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? moment(data.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : moment().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        magicLinkRequest.to = moment(data.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? moment(data.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : moment().format(GIDDH_DATE_FORMAT);
        this._ledgerService.GenerateMagicLink(magicLinkRequest, this.accountUniqueName).subscribe(resp => {
            if (resp.status === 'success') {
                this.magicLink = resp.body.magicLink;
            } else {
                this.magicLink = '';
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

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
