import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Account, ChildGroup } from '../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { SearchService } from '../../services/search.service';

@Component({
    selector: '[tb-pl-bs-grid-row]',  // <home></home>
    styleUrls: ['./tb-pl-bs-grid-row.component.scss'],
    template: `
    <div class="row row-2 tb-pl-bs-grid-row" style="overflow: visible;" [trial-accordion]="groupDetail" [hidden]="!groupDetail.isVisible" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)">
      <div class="col-4 group" [ngStyle]="{'padding-left': padding+'px'}" [innerHTML]="groupDetail.groupName | uppercase | highlight:search"></div>
      <div class="col-2 group text-right">{{ groupDetail.forwardedBalance?.amount | giddhCurrency }} {{groupDetail.forwardedBalance | recType }}
      </div>
      <div class="col-2 group text-right">{{ groupDetail.debitTotal | giddhCurrency }}</div>
      <div class="col-2 group text-right">{{ groupDetail.creditTotal | giddhCurrency }}</div>
      <div class="col-2 group text-right">{{ groupDetail.closingBalance?.amount | giddhCurrency }} {{groupDetail.closingBalance | recType }}
      </div>
    </div>
    <ng-container *ngFor="let account of groupDetail.accounts;trackBy: trackByFn">
      <!-- <section class="row row-2 account " [ngClass]="{'isHidden': !account.isVisible }"> -->
      <section class="row-2 account " style="overflow: visible;" *ngIf="account.isVisible || account.isCreated" [hidden]="!account.isVisible"
               (dblclick)="accountInfo(account,$event)" (clickOutside)="hideModal()" [exclude]="'.row-item'">

        <div class="row row-item" style="height: 35px !important;" *ngIf="account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal)">
          <div class="col-4 account no-select" [ngStyle]="{'padding-left': (padding+20)+'px'}">

            <div style="padding: 0px;border-right: 0px;" [innerHTML]="account.name | lowercase | highlight:search">
            </div>
            <span account-detail-modal-component *ngIf="modalUniqueName && modalUniqueName === account.uniqueName" [shouldShowGenerateInvoice]="false"
                  [accountUniqueName]="account.uniqueName" [isModalOpen]="account.uniqueName === modalUniqueName" [accInfo]="accountDetails"
                  [from]="from" [to]="to">
            </span>
          </div>
          <div class="col-2 account text-right">{{ account.openingBalance?.amount | giddhCurrency }} {{account.openingBalance | recType }}
          </div>
          <div class="col-2 account text-right">{{ account.debitTotal | giddhCurrency }}</div>
          <div class="col-2 account text-right">{{ account.creditTotal | giddhCurrency }}</div>
          <div class="col-2 account text-right">{{ account.closingBalance?.amount | giddhCurrency }} {{account.closingBalance | recType }}
          </div>
        </div>

      </section>
    </ng-container>

    <ng-content></ng-content>
  `
})
export class TlPlGridRowComponent implements OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public from: string;
    @Input() public to: string;
    @Input() public padding: string;
    public modalUniqueName: string = null;
    public accountDetails: IFlattenAccountsResultItem;

    constructor(
        private cd: ChangeDetectorRef,
        private searchService: SearchService
    ) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    public entryClicked(acc) {
        let url = location.href + '?returnUrl=ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
            ipcRenderer.send('open-url', url);
        } else if (isCordova) {
            //todo: entry Clicked
        } else {
            (window as any).open(url);
        }
    }

    public accountInfo(acc, e: Event) {
        this.searchService.loadDetails(acc.uniqueName).subscribe(response => {
            if (response?.body) {
                this.accountDetails = response.body;
                const parentGroups = response.body.parentGroups?.join(', ');
                const creditorsString = 'currentliabilities, sundrycreditors';
                const debtorsString = 'currentassets, sundrydebtors';
                if (parentGroups.indexOf(creditorsString) > -1 || parentGroups.indexOf(debtorsString) > -1) {
                    this.modalUniqueName = response.body.uniqueName;
                } else {
                    this.modalUniqueName = '';
                    this.entryClicked(acc);
                }
                this.cd.detectChanges();
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
