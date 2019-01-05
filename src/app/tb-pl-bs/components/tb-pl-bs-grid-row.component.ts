import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Account, ChildGroup } from '../../models/api-models/Search';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: '[tb-pl-bs-grid-row]',  // <home></home>
  styleUrls: ['./tb-pl-bs-grid-row.component.scss'],
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

    <!-- AccountInfo -->
      <div *ngIf="isModalOpen" class="tb-pl-modal-header">
        <div class="tb-pl-modal-header-div">
          <div class="tb-pl-modal-div">
            <div class="tb-pl-custom-header">
              <div class="d-flex" style="padding: 0px;">
                <div class="tb-pl-padding" style="flex: 1;">
                  <h3 class="tb-pl-custom-title" >Apple</h3></div>
                <div class="tb-pl-padding">
                  <img src="http://localapp.giddh.com:3000/assets/images/path.svg">
                </div>
              </div>
              <div class="custom-detail tb-pl-padding">
                <h4>7894561238</h4>
                <h4>yash@gmail.com</h4>
                <h4>147852963111</h4>
              </div>
            </div>
            <div class="height-82px">
              <ul class="list-unstyled">
                <li>
                  <a href="#">Go to Ledger</a>
                </li>
                <li >
                  <a  href="#">Generate Sales</a>
                </li>
                <li >
                  <a  href="#">Send SMS</a>
                </li>
                <li >
                  <a  href="#">Send Email</a>
                </li>
              </ul>
            </div>
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
    this.isModalOpen = true;

  }

  public hideModal() {
    this.isModalOpen = false;
  }

  public trackByFn(index, item: Account) {
    return item;
  }
}
