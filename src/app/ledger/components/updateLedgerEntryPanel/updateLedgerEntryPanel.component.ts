import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IOption } from '../../../shared/theme/index';

@Component({
  selector: 'update-ledger-entry-panel',
  templateUrl: './updateLedgerEntryPanel.component.html',
  styleUrls: ['./updateLedgerEntryPanel.component.css']
})
export class UpdateLedgerEntryPanelComponent implements OnInit, OnDestroy {
  public accountUniqueName: string;
  public entryUniqueName$: Observable<string>;
  public selectedLedger: LedgerResponse = new LedgerResponse();
  public voucherTypeList: IOption[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _ledgerService: LedgerService, private route: ActivatedRoute) {
    this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).takeUntil(this.destroyed$);
    this.voucherTypeList = [{
      label: 'Sales',
      value: 'sal'
    }, {
      label: 'Purchases',
      value: 'pur'
    }, {
      label: 'Receipt',
      value: 'rcpt'
    }, {
      label: 'Payment',
      value: 'pay'
    }, {
      label: 'Journal',
      value: 'jr'
    }, {
      label: 'Contra',
      value: 'cntr'
    }, {
      label: 'Debit Note',
      value: 'debit note'
    }, {
      label: 'Credit Note',
      value: 'credit note'
    }];
  }

  public ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.accountUniqueName = params['accountUniqueName'];
    });

    this.entryUniqueName$.distinctUntilChanged().subscribe(entryName => {
      if (entryName) {
        this._ledgerService.GetLedgerTransactionDetails(this.accountUniqueName, entryName).subscribe(resp => {
          if (resp.status === 'success') {
            this.selectedLedger = resp.body;
          }
        });
      }
    });
  }
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
