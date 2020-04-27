import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { take } from 'rxjs/operators';

@Component({
    selector: '[tb-pl-bs-grid-row]',  // <home></home>
    styleUrls: ['./tb-pl-bs-grid-row.component.scss'],
    template: `
    <div class="row row-2 tb-pl-bs-grid-row" style="overflow: visible;" [trial-accordion]="groupDetail" [hidden]="!groupDetail.isVisible" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)">
      <div class="col-xs-4 group" [ngStyle]="{'padding-left': padding+'px'}" [innerHTML]="groupDetail.groupName | uppercase | highlight:search"></div>
      <div class="col-xs-2 group text-right">{{ groupDetail.forwardedBalance?.amount | giddhCurrency }} {{groupDetail.forwardedBalance | recType }}
      </div>
      <div class="col-xs-2 group text-right">{{ groupDetail.debitTotal | giddhCurrency }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.creditTotal | giddhCurrency }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.closingBalance?.amount | giddhCurrency }} {{groupDetail.closingBalance | recType }}
      </div>
    </div>
    <ng-container *ngFor="let account of groupDetail.accounts;trackBy: trackByFn">
      <!-- <section class="row row-2 account " [ngClass]="{'isHidden': !account.isVisible }"> -->
      <section class="row row-2 account " style="overflow: visible;" *ngIf="account.isVisible || account.isCreated" [hidden]="!account.isVisible"
               (dblclick)="accountInfo(account,$event)" (clickOutside)="hideModal()">

        <div class="row" style="height: 35px !important;" *ngIf="account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal)">
          <div class="col-xs-4 account no-select" [ngStyle]="{'padding-left': (padding+20)+'px'}">

            <div style="padding: 0px;border-right: 0px;" [innerHTML]="account.name | lowercase | highlight:search">
            </div>

            <span account-detail-modal-component *ngIf="modalUniqueName && modalUniqueName === account.uniqueName" [shouldShowGenerateInvoice]="false"
                  [accountUniqueName]="account.uniqueName" [isModalOpen]="account.uniqueName === modalUniqueName"
                  [from]="from" [to]="to">
            </span>

          </div>
          <div class="col-xs-2 account text-right">{{ account.openingBalance?.amount | giddhCurrency }} {{account.openingBalance | recType }}
          </div>
          <div class="col-xs-2 account text-right">{{ account.debitTotal | giddhCurrency }}</div>
          <div class="col-xs-2 account text-right">{{ account.creditTotal | giddhCurrency }}</div>
          <div class="col-xs-2 account text-right">{{ account.closingBalance?.amount | giddhCurrency }} {{account.closingBalance | recType }}
          </div>
        </div>

      </section>
    </ng-container>

    <ng-content></ng-content>
  `
})
export class TlPlGridRowComponent implements OnInit, OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public from: string;
    @Input() public to: string;
    @Input() public padding: string;
    public modalUniqueName: string = null;
    public accountDetails: IFlattenAccountsResultItem;
    public flattenAccounts$: Observable<IFlattenAccountsResultItem[]>;

    constructor(private cd: ChangeDetectorRef, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
        this.flattenAccounts$ = this.store.pipe(select(s => s.general.flattenAccounts));
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    public ngOnInit() {
        //  this.accountDetails.map(f=> f.parentGroups.find(e=> e.name === this.groupDetail.groupName));
    }

  public entryClicked(acc) {
    let url = location.href + '?returnUrl=ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
    if (isElectron) {
      let ipcRenderer = (window as any).require('electron').ipcRenderer;
      url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
      ipcRenderer.send('open-url', url);
    }else if(isCordova){
        //todo: entry Clicked
    } else {
      (window as any).open(url);
    }
  }

    public accountInfo(acc, e: Event) {
        this.flattenAccounts$.pipe(
            take(1),
        ).subscribe(data => {
            if (data && data.length) {
                let account = data.find(f => f.uniqueName === acc.uniqueName);
                if (account) {
                    let creditorsString = 'currentliabilities, sundrycreditors';
                    let debtorsString = 'currentassets, sundrydebtors';
                    if (account.uNameStr.indexOf(creditorsString) > -1 || account.uNameStr.indexOf(debtorsString) > -1) {
                        this.modalUniqueName = account.uniqueName;
                    } else {
                        this.modalUniqueName = '';
                        this.entryClicked(acc);
                    }
                } else {
                    this.modalUniqueName = '';
                    this.entryClicked(acc);
                }
            }
        });
    }

    public hideModal() {
        this.modalUniqueName = null;
    }

    public trackByFn(index, item: Account) {
        return item;
    }
}
