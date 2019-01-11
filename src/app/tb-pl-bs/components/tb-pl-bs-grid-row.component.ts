import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ModalDirective } from 'ngx-bootstrap';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { take, takeUntil } from 'rxjs/operators';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';

@Component({
  selector: '[tb-pl-bs-grid-row]',  // <home></home>
  styleUrls: ['./tb-pl-bs-grid-row.component.scss'],
  template: `
    <div class="row row-2 tb-pl-bs-grid-row" style="overflow: visible;" [trial-accordion]="groupDetail" [hidden]="!groupDetail.isVisible" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)">
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
      <section class="row row-2 account " style="overflow: visible;" *ngIf="account.isVisible || account.isCreated" [hidden]="!account.isVisible"
               (dblclick)="accountInfo(account,$event)" (clickOutside)="hideModal()">
        <div class="row" *ngIf="account.name && (account.closingBalance?.amount !== 0 || account.openingBalance?.amount !== 0 || account.debitTotal || account.creditTotal)">
          <div class="col-xs-4 account" [ngStyle]="{'padding-left': (padding+20)+'px'}">
            <div style="padding: 0px;border-right: 0px;" [innerHTML]="account.name | lowercase | highlight:search">
            </div>
            <!-- AccountInfo -->
            <div *ngIf="account.uniqueName== ModalUniqueName" class="tb-pl-modal-header">
              <div class="tb-pl-modal-header-div">
                <div class="tb-pl-modal-div">
                  <div class="tb-pl-custom-header">
                    <div class="d-flex" style="padding: 0px; border-right:0px;">
                      <div class="tb-pl-padding" style="flex: 1;border-right: 0px;">
                        <h3 class="tb-pl-custom-title">{{accInfo.name}}</h3></div>
                      <div class="tb-pl-padding" (click)="goToAddAndManage()">
                        <img src="./assets/images/path.svg">
                      </div>
                    </div>
                    <div class="custom-detail tb-pl-padding">
                      <h4>{{accInfo.mobileNo}}</h4>
                      <h4>{{accInfo.email}}</h4>
                      <!--<h4></h4>-->
                    </div>
                  </div>
                  <div class="height-82px">
                    <ul class="list-unstyled">
                      <li>
                        <a (click)="entryClicked(account)">Go to Ledger</a>
                      </li>
                      <li>
                        <a href="#">Generate Sales</a>
                      </li>
                      <li>
                        <a href="#">Send SMS</a>
                      </li>
                      <li>
                        <a href="#">Send Email</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-2 account text-right">{{ account.openingBalance?.amount | number:'1.2-2' }} {{account.openingBalance | recType }}
          </div>
          <div class="col-xs-2 account text-right">{{ account.debitTotal | number:'1.2-2' }}</div>
          <div class="col-xs-2 account text-right">{{ account.creditTotal | number:'1.2-2' }}</div>
          <div class="col-xs-2 account text-right">{{ account.closingBalance?.amount | number:'1.2-2' }} {{account.closingBalance | recType }}
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
  @Input() public padding: string;
  public isModalOpen: boolean = false;
  public ModalUniqueName: string = null;
  public accountDetails: IFlattenAccountsResultItem;
  public flattenAccounts$: Observable<IFlattenAccountsResultItem[]>;
  public accInfo: { name: string, email: string, mobileNo: string, uNameStr: string, uniqueName: string };


  constructor(private cd: ChangeDetectorRef, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,) {
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
    let url = location.href + '?returnUrl=ledger/' + acc.uniqueName;
    if (isElectron) {
      let ipcRenderer = (window as any).require('electron').ipcRenderer;
      url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName;
      console.log(ipcRenderer.send('open-url', url));
    } else {
      (window as any).open(url);
    }
  }


  public accountInfo(acc, e: Event) {
    e.stopImmediatePropagation();
    let allAccounts = [];
    this.flattenAccounts$.pipe(
      take(1),
    ).subscribe(s => allAccounts = s);

    if (allAccounts && allAccounts.length) {
      this.accInfo = allAccounts.find(f => f.uniqueName === acc.uniqueName);
      if (this.accInfo.uNameStr.indexOf('currentliabilities, sundrycreditors') > -1 || this.accInfo.uNameStr.indexOf('currentassets, sundrydebtors') > -1) {
        this.isModalOpen = true;
        this.ModalUniqueName = acc.uniqueName;
      } else {
        this.entryClicked(acc);
      }
    }

  }

  public hideModal() {
    this.ModalUniqueName = null;
    this.isModalOpen = false;
  }

  public goToAddAndManage() {
    this.store.dispatch(this.groupWithAccountsAction.setGroupAndAccountsSearchString(this.accInfo.name));
  }

  public trackByFn(index, item: Account) {
    return item;
  }
}
