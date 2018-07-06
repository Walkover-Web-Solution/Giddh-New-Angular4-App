import { ChangeDetectionStrategy, SimpleChanges, Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ChildGroup, Account } from '../../models/api-models/Search';

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
  <section class="row row-2 account " *ngIf="account.isVisible || account.isCreated" [hidden]="!account.isVisible">
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

<ng-content></ng-content>
`
})
export class TlPlGridRowComponent implements OnInit, OnChanges {
  @Input() public groupDetail: ChildGroup;
  @Input() public search: string;
  @Input() public padding: string;

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
  public trackByFn(index, item: Account) {
    return item;
  }
}
