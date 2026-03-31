/* OLD IMPLEMENTATION COMMENTED OUT - Row logic is now inlined in ProfitLossGridComponent */
/*
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { FinancialReportsComponentStore } from 'apps/web-giddh/src/app/financial-reports/financial-reports.store';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { TlPlService } from 'apps/web-giddh/src/app/services/tl-pl.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Configuration } from '../../../../../../../app.constant';

@Component({
selector: '[profit-loss-grid-row]',
    templateUrl: './profit-loss-grid-row.component.html',
    styleUrls: ['./profit-loss-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
export class ProfitLossGridRowComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Input() public plHeaders: any[];
    @Input() public expandAll: boolean;
    @Input() public isExpandToggledDuringSearch: boolean;
    private currentUrl: string = "";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private cd: ChangeDetectorRef, private router: Router, private financialReportsComponentStore: FinancialReportsComponentStore, private tlPlService: TlPlService, private generalService: GeneralService) {
        this.currentUrl = this.router.url;
    }

    public ngOnInit(): void {
        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.tlPlService.isReportTailed$.next(true);
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    public entryClicked(acc: any): void { }
    public trackByFn(index, item: Account): string { return item?.uniqueName; }
    public getKeys(obj: Record<string, any> | null | undefined): string[] | [] { return obj ? Object.keys(obj) : []; }
    public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void { }
    public ngOnDestroy(): void { this.destroyed$.next(true); this.destroyed$.complete(); }
}
*/

import { Component } from '@angular/core';
import { ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';

/** Stub component - kept for module compatibility. All row rendering is now handled by ProfitLossGridComponent. */
@Component({
    selector: '[profit-loss-grid-row]',
    template: '',
    standalone: false
})
export class ProfitLossGridRowComponent {
    public groupDetail: ChildGroup;
}
