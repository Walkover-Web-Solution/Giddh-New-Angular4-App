import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChildGroup } from '../../models/api-models/Search';

@Component({
  selector: '[tb-pl-bs-grid-row]',  // <home></home>
  template: `
    <div class="row row-2 tb-pl-bs-grid-row" [ngClass]="{'isHidden': !groupDetail.isVisible}"  [trial-accordion]="groupDetail" *ngIf="groupDetail.groupName">
      <div class="col-xs-4 group" [ngStyle]="{'padding-left': padding+'px'}" [innerHTML]="groupDetail.groupName | uppercase | highlight:search"></div>
      <div class="col-xs-2 group text-right">{{ groupDetail.forwardedBalance?.amount | number:'1.2-2' }}
        {{groupDetail.forwardedBalance | recType }}
      </div>
      <div class="col-xs-2 group text-right">{{ groupDetail.debitTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.creditTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.closingBalance?.amount | number:'1.2-2' }}
        {{groupDetail.closingBalance | recType }}
      </div>
    </div>
    <section class="row row-2 account " *ngFor="let account of groupDetail.accounts"
             [ngClass]="{'isHidden': !account.isVisible }">
      <div class="row">
        <div class="col-xs-4 account" [ngStyle]="{'padding-left': (padding+20)+'px'}" [innerHTML]="account.name | lowercase | highlight:search" ></div>
        <div class="col-xs-2 account text-right">{{ account.openingBalance?.amount | number:'1.2-2' }}
          {{account.openingBalance | recType }}
        </div>
        <div class="col-xs-2 account text-right">{{ account.debitTotal | number:'1.2-2' }}</div>
        <div class="col-xs-2 account text-right">{{ account.creditTotal | number:'1.2-2' }}</div>
        <div class="col-xs-2 account text-right">{{ account.closingBalance?.amount | number:'1.2-2' }}
          {{account.closingBalance | recType }}
        </div>
      </div>
    </section>
    <ng-content></ng-content>

  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TlPlGridRowComponent implements OnInit {
  @Input() public groupDetail: ChildGroup;
  @Input() public search: string;
  @Input() public padding: string;
  public visible: boolean = true;

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
