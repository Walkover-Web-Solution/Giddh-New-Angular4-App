import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { ChildGroup } from '../../../../models/api-models/Search';

@Component({
  selector: '[bs-grid-row]',  // <home></home>
  template: `
    <div class="row pl-grid-row" [trial-accordion]="groupDetail" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)" [ngClass]="{'isHidden': !groupDetail.isVisible }">
      <div class="col-xs-4  group" [innerHTML]="groupDetail.groupName | uppercase | highlight:search" [ngStyle]="{'padding-left': padding+'px'}"></div>
      <div class="col-xs-4  group text-right">
        <span> {{groupDetail.closingBalance.amount | number:'1.2-2'}}{{groupDetail.closingBalance | recType}} </span>
      </div>
      <div class="col-xs-4  group text-right">
        <span>{{groupDetail.forwardedBalance.amount | number:'1.2-2'}}{{groupDetail.forwardedBalance | recType}} </span>
      </div>
    </div>
    <ng-container  *ngFor="let account of groupDetail.accounts">
        <section class="row row-2 account pl-grid-row" *ngIf="account.isVisible || account.isCreated" [ngClass]="{'isHidden': !account.isVisible }">
          <div class="row"*ngIf="account.name && (account.closingBalance.amount !== 0 || account.openingBalance.amount !== 0)">
            <div class="col-xs-4  account" [ngStyle]="{'padding-left': (padding+20)+'px'}" [innerHTML]="account.name | lowercase  | highlight:search"></div>
            <div class="col-xs-4  account text-right">
              <span>{{account.closingBalance.amount | number:'1.2-2'}}{{account.closingBalance | recType}}</span>
            </div>
            <div class="col-xs-4  account text-right">
              <span>{{account.openingBalance.amount | number:'1.2-2'}}{{account.openingBalance | recType}}</span>
            </div>
          </div>
        </section>
    </ng-container>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BsGridRowComponent implements OnInit, OnChanges {
  @Input() public groupDetail: ChildGroup;
  @Input() public search: string;
  @Input() public padding: string;

  constructor() {
    //
  }
  public ngOnChanges(changes: SimpleChanges) {
    //
  }
  public ngOnInit() {
    //
  }
}
