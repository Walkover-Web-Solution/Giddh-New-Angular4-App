import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChildGroup } from '../../../../models/api-models/Search';

@Component({
    selector: '[bs-grid-row]',  // <home></home>
    template: `
    <div class="row pl-grid-row" [trial-accordion]="groupDetail" *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)" [ngClass]="{'isHidden': !groupDetail.isVisible }">
      <div class="col-xs-4  group" [innerHTML]="groupDetail.groupName | uppercase | highlight:search" [ngStyle]="{'padding-left': padding+'px'}"></div>
      <div class="col-xs-4  group text-right">
        <span> {{groupDetail.closingBalance.amount | giddhCurrency}}{{groupDetail.closingBalance | recType}} </span>
      </div>
      <div class="col-xs-4  group text-right">
        <span>{{groupDetail.forwardedBalance.amount | giddhCurrency}}{{groupDetail.forwardedBalance | recType}} </span>
      </div>
    </div>
    <ng-container *ngFor="let account of groupDetail.accounts">
      <section class="row row-2 account pl-grid-row" *ngIf="account.isVisible || account.isCreated" [ngClass]="{'isHidden': !account.isVisible }">
        <div class="row" *ngIf="account.name && (account.closingBalance.amount !== 0 || account.openingBalance.amount !== 0)"
             (dblclick)="entryClicked(account)">
          <div class="col-xs-4  account" [ngStyle]="{'padding-left': (padding+20)+'px'}" [innerHTML]="account.name | lowercase  | highlight:search"></div>
          <div class="col-xs-4  account text-right">
            <span>{{account.closingBalance.amount | giddhCurrency}}{{account.closingBalance | recType}}</span>
          </div>
          <div class="col-xs-4  account text-right">
            <span>{{account.openingBalance.amount | giddhCurrency}}{{account.openingBalance | recType}}</span>
          </div>
        </div>
      </section>
    </ng-container>
    <ng-content></ng-content>
  `,
})
export class BsGridRowComponent implements OnInit, OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public from: string = '';
    @Input() public to: string = '';

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
        let url = location.href + '?returnUrl=ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
            console.log(ipcRenderer.send('open-url', url));
        } else if(isCordova){
            // todo: Entry Click need to be handeled in cordova
        } else {
            (window as any).open(url);
        }

    }
}
