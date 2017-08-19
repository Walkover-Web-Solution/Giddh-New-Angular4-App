import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChildGroup } from '../../../../models/api-models/Search';

@Component({
  selector: '[pl-grid-row]',  // <home></home>
  template: `
    <!-- filter:filterTBSearch:index:data  -->
    <!-- |  tbsearch:keyWord | filter:filterTBSearch:tbsearch -->
    <div class="row pl-grid-row" [trial-accordion]="groupDetail" *ngIf="groupDetail.groupName">
      <div class="col-xs-3  group">{{ groupDetail.groupName | uppercase}}</div>
      <div class="col-xs-3  group">2.0</div>
      <!-- ng-bind-html="groupDetail.closingBalance.amount | uppercase" -->
      <div class="col-xs-3  group text-right">
        <span> {{groupDetail.closingBalance.amount | number:'1.2-2'}}{{groupDetail.closingBalance | recType}} </span>
      </div>
      <div class="col-xs-3  group text-right">
        <span>{{groupDetail.forwardedBalance.amount | number:'1.2-2'}}{{groupDetail.forwardedBalance | recType}} </span>
      </div>
    </div>
    <section class="row row-2 account pl-grid-row" *ngFor="let account of groupDetail.accounts"
             [ngClass]="{'isHidden': !account.isVisible }">
      <div class="row" trial-accordion *ngIf="account.name">
        <div class="col-xs-3  group" [ngStyle]="{'padding-left':'10px'}">{{ account.name | uppercase}}</div>
        <!-- ng-bind-html="groupDetail.closingBalance.amount | uppercase" -->
        <div class="col-xs-3  group text-right">
          <span>{{account.closingBalance.amount | number:'1.2-2'}}{{account.closingBalance | recType}}</span>
        </div>
        <div class="col-xs-3  group text-right">
          <span>{{account.openingBalance.amount | number:'1.2-2'}}{{account.openingBalance | recType}}</span>
        </div>
      </div>
    </section>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlGridRowComponent implements OnInit {
  @Input() public groupDetail: ChildGroup;

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
