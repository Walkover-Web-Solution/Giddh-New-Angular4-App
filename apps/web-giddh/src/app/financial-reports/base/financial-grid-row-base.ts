import { ChangeDetectorRef, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FinancialReportsComponentStore } from '../financial-reports.store';
import { TlPlService } from '../../services/tl-pl.service';
import { ChildGroup } from '../../models/api-models/Search';

/**
 * Base class for financial report grid row components
 * Provides shared lifecycle methods and change detection logic
 * Used by grid-row, balance-sheet-grid-row, and profit-loss-grid-row components
 */
@Directive()
export abstract class FinancialGridRowBase implements OnInit, OnChanges, OnDestroy {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    
    protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        protected cd: ChangeDetectorRef,
        protected financialReportsComponentStore: FinancialReportsComponentStore,
        protected tlPlService: TlPlService
    ) {}

    /**
     * Component lifecycle hook
     * Subscribes to tailed report success status
     */
    public ngOnInit(): void {
        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.tlPlService.isReportTailed$.next(true);
            }
        });
    }

    /**
     * Handles input property changes
     * Triggers change detection when groupDetail or search changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    /**
     * Component lifecycle hook
     * Cleans up subscriptions
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
