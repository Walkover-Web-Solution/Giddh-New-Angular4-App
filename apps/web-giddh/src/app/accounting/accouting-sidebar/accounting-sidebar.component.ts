import { distinctUntilChanged, take } from 'rxjs/operators';
import { IPageInfo, TallyModuleService } from './../tally-service';
import { ReplaySubject } from 'rxjs';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'accounting-sidebar',
    templateUrl: './accounting-sidebar.component.html',
    styleUrls: ['./accounting-sidebar.component.scss']
})

export class AccountingSidebarComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public AccountListOpen: boolean;

    public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public isGroupToggle: boolean;
    public accountSearch: string = '';
    public grpUniqueName: string = '';
    public showAccountList: boolean = true;
    public selectedVoucher: string = null;
    public selectedGrid: string = null;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _tallyModuleService: TallyModuleService) {
        //
    }

    public ngOnInit() {
        this._tallyModuleService.flattenAccounts.pipe(take(2)).subscribe((accounts) => {
            if (accounts) {
                this.setSelectedPage('Journal', 'voucher', 'purchases');
            }
        });

        this._tallyModuleService.selectedPageInfo.pipe(distinctUntilChanged((p, q) => {
            if (p && q) {
                return (_.isEqual(p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe((pageInfo: IPageInfo) => {
            // && pageInfo.page !== this.selectedVoucher && pageInfo.gridType !== this.selectedGrid
            if (pageInfo) {
                this.selectedVoucher = pageInfo.page;
                this.selectedGrid = pageInfo.gridType;
            }
        });
    }

    public ngOnChanges(s) {
        if (s.AccountListOpen) {
            this.showAccountList = !this.showAccountList;
        }
    }

    public setSelectedPage(pageName: string, grid: string, grpUnqName: string) {
        this._tallyModuleService.setVoucher({
            page: pageName,
            uniqueName: grpUnqName,
            gridType: grid
        });
        this.selectedVoucher = pageName;
        this.selectedGrid = grid;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
