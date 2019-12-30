import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import { AccountsAction } from './../../../actions/accounts.actions';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { MagicLinkRequest } from '../../../models/api-models/Ledger';
import { AccountService } from '../../../services/account.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import * as moment from 'moment/moment';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'share-ledger',
	templateUrl: './shareLedger.component.html',
	styles: [`
    .btn-success:disabled {
      color: #fff !important;
    }
  `]
})
export class ShareLedgerComponent implements OnInit {
	@Input() public accountUniqueName: string = '';
	// @Input() public from: string = '';
	// @Input() public to: string = '';
	@Input() public advanceSearchRequest: any;
	@Output() public closeShareLedgerModal: EventEmitter<boolean> = new EventEmitter();
	public email: string;
	public magicLink: string = '';
	public isCopied: boolean = false;
	public activeAccountSharedWith: any[] = [];
	public universalDate$: Observable<any>;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _ledgerService: LedgerService, private _accountService: AccountService,
		private store: Store<AppState>, private _ledgerActions: LedgerActions, private accountActions: AccountsAction) {
		this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
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
		const data = _.cloneDeep(this.advanceSearchRequest);
		if (!data.dataToSend.bsRangeValue) {
			this.universalDate$.subscribe(a => {
				if (a) {
					data.dataToSend.bsRangeValue = [moment(a[0], 'DD-MM-YYYY').toDate(), moment(a[1], 'DD-MM-YYYY').toDate()];
				}
			});
		}
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
}
