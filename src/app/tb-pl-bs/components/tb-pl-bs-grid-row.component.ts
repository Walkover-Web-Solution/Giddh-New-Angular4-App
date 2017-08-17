import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChildGroup } from '../../models/api-models/Search';

@Component({
  selector: '[tb-pl-bs-grid-row]',  // <home></home>
  template: `
    <!-- filter:filterTBSearch:index:data  -->
    <!-- |  tbsearch:keyWord | filter:filterTBSearch:tbsearch -->
    <div class="row" trial-accordion>
      <div class="col-xs-4 group">{{ groupDetail.groupName | uppercase }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.forwardedBalance?.amount | number:'1.2-2' }}
        {{groupDetail.forwardedBalance?.type | titlecase | slice:0:1 }}r.
      </div>
      <div class="col-xs-2 group text-right">{{ groupDetail.debitTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.creditTotal | number:'1.2-2' }}</div>
      <div class="col-xs-2 group text-right">{{ groupDetail.closingBalance?.amount | number:'1.2-2' }}
        {{groupDetail.closingBalance?.type | titlecase | slice:0:1 }}r.
      </div>
    </div>
    <section class="row row-2 account isHidden" *ngFor="let account of groupDetail.accounts" (click)="account.isVisible=!account.isVisible;$event.preventDefault()"  >
      <div class="row">
        <div class="col-xs-4 account" [ngStyle]="{'padding-left':'10px'}">{{account.name | lowercase}}</div>
        <div class="col-xs-2 account text-right">{{ account.openingBalance?.amount | number:'1.2-2' }}
          {{account.openingBalance?.type | titlecase | slice:0:1 }}r.
        </div>
        <div class="col-xs-2 account text-right">{{ account.debitTotal | number:'1.2-2' }}</div>
        <div class="col-xs-2 account text-right">{{ account.creditTotal | number:'1.2-2' }}</div>
        <div class="col-xs-2 account text-right">{{ account.closingBalance?.amount | number:'1.2-2' }}
          {{account.closingBalance?.type | titlecase | slice:0:1 }}r.
        </div>
      </div>
    </section>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TlPlGridRowComponent implements OnInit {
  @Input() public groupDetail: ChildGroup;
  public visible: boolean = true;

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }
}
