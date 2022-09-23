import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { AccountsAction } from '../../../actions/accounts.actions';
import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { MagicLinkRequest } from '../../../models/api-models/Ledger';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/index';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import * as dayjs from 'dayjs';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'share-ledger',
    templateUrl: './share-ledger.component.html',
    styleUrls: ['./share-ledger.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShareLedgerComponent implements OnInit, OnDestroy {
    public email: string;
    public magicLink: string = '';
    public isCopied: boolean = false;
    public activeAccountSharedWith: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private ledgerService: LedgerService,
        private store: Store<AppState>,
        private ledgerActions: LedgerActions,
        private accountActions: AccountsAction,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public inputData) {
    }

    /**
     * Initializes the component
     *
     * @memberof ShareLedgerComponent
     */
    public ngOnInit() {
        this.store.dispatch(this.ledgerActions.sharedAccountWith(this.inputData?.accountUniqueName));
        this.store.pipe(select(state => state.ledger.activeAccountSharedWith), takeUntil(this.destroyed$)).subscribe((data) => {
            this.activeAccountSharedWith = _.cloneDeep(data);
            this.changeDetectorRef.detectChanges();
        });
    }

    public getMagicLink() {
        let magicLinkRequest = new MagicLinkRequest();
        const data = _.cloneDeep(this.inputData?.advanceSearchRequest);
        data.dataToSend.bsRangeValue = [dayjs(this.inputData?.from, GIDDH_DATE_FORMAT).toDate(), dayjs(this.inputData?.to, GIDDH_DATE_FORMAT).toDate()];
        magicLinkRequest.from = dayjs(data.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) ? dayjs(data.dataToSend.bsRangeValue[0]).format(GIDDH_DATE_FORMAT) : dayjs().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        magicLinkRequest.to = dayjs(data.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) ? dayjs(data.dataToSend.bsRangeValue[1]).format(GIDDH_DATE_FORMAT) : dayjs().format(GIDDH_DATE_FORMAT);
        magicLinkRequest.branchUniqueName = this.inputData?.advanceSearchRequest.branchUniqueName || '';
        this.ledgerService.GenerateMagicLink(magicLinkRequest, this.inputData?.accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
            if (resp?.status === 'success') {
                this.magicLink = resp.body.magicLink;
            } else {
                this.magicLink = '';
            }
            this.changeDetectorRef.detectChanges();
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
            entityUniqueName: this.inputData?.accountUniqueName,
        };
        let selectedPermission = 'view';
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
        this.email = '';
        setTimeout(() => {
            this.store.dispatch(this.ledgerActions.sharedAccountWith(this.inputData?.accountUniqueName));
        }, 1000);
    }

    public unShareAccount(entryUniqueName) {
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', this.inputData?.accountUniqueName));
        setTimeout(() => {
            this.store.dispatch(this.ledgerActions.sharedAccountWith(this.inputData?.accountUniqueName));
        }, 1000);
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof ShareLedgerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
