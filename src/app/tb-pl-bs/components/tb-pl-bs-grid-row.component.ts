import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: '[tb-pl-bs-grid-row]',  // <home></home>
  template: `
    <div class="row row-2 tb-pl-bs-grid-row" [trial-accordion]="groupDetail" [hidden]="!groupDetail.isVisible" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)">
      <div class="col-xs-4 group" [ngStyle]="{'padding-left': padding+'px'}" [innerHTML]="groupDetail.groupName | uppercase | highlight:search"></div>
      <div class="col-xs-2 group text-right">{{ groupDetail.forwardedBalance?.amount | number:'1.2-2' }} {{groupDetail.forwardedBalance | recType }}
      </div>
      <div class="col-xs-2 group text-right">{{ groupDetail.debitTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.creditTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.closingBalance?.amount | number:'1.2-2' }} {{groupDetail.closingBalance | recType }}
      </div>
    </div>
    <ng-container *ngFor="let account of groupDetail.accounts;trackBy: trackByFn">
      <!-- <section class="row row-2 account " [ngClass]="{'isHidden': !account.isVisible }"> -->
      <section class="row row-2 account " *ngIf="account.isVisible || account.isCreated" [hidden]="!account.isVisible"
               (dblclick)="accountInfo(account)">
        <div class="row" *ngIf="account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal)">
          <div class="col-xs-4 account" [ngStyle]="{'padding-left': (padding+20)+'px'}" [innerHTML]="account.name | lowercase | highlight:search"></div>
          <div class="col-xs-2 account text-right">{{ account.openingBalance?.amount | number:'1.2-2' }} {{account.openingBalance | recType }}
          </div>
          <div class="col-xs-2 account text-right">{{ account.debitTotal | number:'1.2-2' }}</div>
          <div class="col-xs-2 account text-right">{{ account.creditTotal | number:'1.2-2' }}</div>
          <div class="col-xs-2 account text-right">{{ account.closingBalance?.amount | number:'1.2-2' }} {{account.closingBalance | recType }}
          </div>
        </div>
      </section>
    </ng-container>

    <div bsModal #AccountInfoModal="bs-modal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg" style="position: absolute; top: 450px; left: 260px; width: 260px;">
        <div class="modal-content" style="padding: 0px;border-radius: 0px;height: 215px;">
          <accountInfoModal [title]="'Account Info'" [body]="accName" (cancelCallBack)="hideModal()" (successCallBack)="accountInfo()">
          </accountInfoModal>
        </div>
      </div>
    </div>
    <ng-content></ng-content>
  `
})
export class TlPlGridRowComponent implements OnInit, OnChanges {
  @Input() public groupDetail: ChildGroup;
  @Input() public search: string;
  @Input() public padding: string;
  public isModalOpen: boolean = false;
  public accName: string;
  public accMoNumber: string;
  public accEmail: string;

  @ViewChild('AccountInfoModal') public AccountInfoModal: ModalDirective;

  constructor(private cd: ChangeDetectorRef) {
    //
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
    //
  }

  public entryClicked(acc) {
    let url = location.href + '?returnUrl=ledger/' + acc.uniqueName;
    if (isElectron) {
      let ipcRenderer = (window as any).require('electron').ipcRenderer;
      url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName;
      console.log(ipcRenderer.send('open-url', url));
    } else {
      (window as any).open(url);
    }
  }

  public accountInfo(acc) {
    this.AccountInfoModal.show();
    this.accName = acc.name;
   // this.hideModal();
  }

  public hideModal() {
    this.AccountInfoModal.hide();
  }

  public trackByFn(index, item: Account) {
    return item;
  }
}
