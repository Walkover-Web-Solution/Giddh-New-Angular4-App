import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChildGroup } from '../../../../models/api-models/Search';

@Component({
    selector: '[pl-grid-row]',
    template: `
<div class="pl-grid-row row" [trial-accordion]="groupDetail"
    *ngIf="groupDetail.groupName && (groupDetail.isVisible || groupDetail.isCreated)"
    [ngClass]="{'isHidden': !groupDetail.isVisible }">
    <div class="col-8  group" [innerHTML]="groupDetail.groupName | highlight:search"
        [ngStyle]="{'padding-left': padding+'px'}"></div>
    <div class="col-4  bd-rl group pull-right" *ngIf="!groupDetail.level1">
        <div class="row">
            <span class="col-sm-6 col-12 text-right"
                [ngClass]="{'invisible': groupDetail.isOpen && (groupDetail.accounts.length || groupDetail.childGroups.length)}">
                <span
                    *ngIf="groupDetail.category === 'income' && groupDetail.closingBalance.type === 'DEBIT' && groupDetail.closingBalance.amount !== 0">-</span>
                <span
                    *ngIf="groupDetail.category === 'expenses' && groupDetail.closingBalance.type === 'CREDIT' && groupDetail.closingBalance.amount !== 0">-</span>
                <span class="d-inline-flex">
                    <amount-field [amount]="groupDetail.closingBalance.amount" [currencySymbol]="false" [currencyCode]="false">
                    </amount-field>
                </span>
            </span>
            <span class="col-sm-6 col-12 invisible">
                <span class="d-inline-flex">
                    <amount-field [amount]="groupDetail.closingBalance.amount" [currencySymbol]="false" [currencyCode]="false">
                    </amount-field>
                </span>
            </span>
        </div>
    </div>
    <div class="col-4  bd-rl group text-right pull-right pd-1" *ngIf="groupDetail.level1">&nbsp;</div>
            
    </div>
<ng-container *ngFor="let account of groupDetail.accounts">
    <section class=" row-2  pl-grid-row account" [ngClass]="{'isHidden': !account.isVisible }"
        *ngIf="account.isVisible || account.isCreated" (dblclick)="entryClicked(account)">
        <div class="row"
            *ngIf="account.name && (account.closingBalance.amount !== 0 || account.openingBalance.amount !== 0)">
            <div class="col-8" [ngStyle]="{'padding-left': (padding+20)+'px'}"
                [innerHTML]="account.name | lowercase  | highlight:search"></div>
            <div class="col-4 bd-rl text-left pull-right">
                <div class="row d-flex">
                    <span class="col-sm-6 col-12 text-right">
                        <span class="d-inline-flex">
                            <amount-field [amount]="account.closingBalance.amount" [currencySymbol]="false" [currencyCode]="false">
                            </amount-field>
                        </span>
                    </span>
                    <span class="col-sm-6 col-12 invisible">
                        <span class="d-inline-flex">
                            <amount-field [amount]="account.closingBalance.amount" [currencySymbol]="false" [currencyCode]="false">
                            </amount-field>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </section>
</ng-container>
<ng-content></ng-content>
  `,
})
export class PlGridRowComponent implements OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';

    constructor(private cd: ChangeDetectorRef) {
        
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
            console.log(ipcRenderer.send('open-url', url));
        } else if (isCordova) {
            // todo: entry Clicked in Cordova needs to be done.
        } else {
            (window as any).open(url);
        }

    }
}
