import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FinancialGridRowBase } from '../../../../../../base/financial-grid-row-base';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import {
    TRIAL_BALANCE_VIEWPORT_LIMIT,
} from 'apps/web-giddh/src/app/financial-reports/constants/trial-balance-profit.constant';
import { FinancialReportsComponentStore } from 'apps/web-giddh/src/app/financial-reports/financial-reports.store';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { TlPlService } from 'apps/web-giddh/src/app/services/tl-pl.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Configuration } from '../../../../../../../app.constant';
import { includes } from '../../../../../../../lodash-optimized';
import { LedgerNavigationHelper } from '../../../../../../helpers/ledger-navigation.helper';

@Component({
    selector: '[balance-sheet-grid-row]',
    templateUrl: './balance-sheet-grid-row.component.html',
    styleUrls: ['./balance-sheet-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
export class BalanceSheetGridRowComponent extends FinancialGridRowBase implements OnInit, OnDestroy {
    @Input() public padding: string;
    @Input() public from: string = '';
    @Input() public to: string = '';
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /** Hold current url */
    private currentUrl: string = "";

    constructor(protected cd: ChangeDetectorRef, private router: Router, protected financialReportsComponentStore: FinancialReportsComponentStore, protected tlPlService: TlPlService, private generalService: GeneralService) {
        super(cd, financialReportsComponentStore, tlPlService);
        this.currentUrl = this.router.url;
    }


    /**
     * Entry click handler
     *
     * @param {*} acc
     * @memberof BalanceSheetGridRowComponent
     */
    public entryClicked(acc: any): void {
        LedgerNavigationHelper.openLedger(acc, this.from, this.to, this.currentUrl);
    }

    /**
     * Track by function for balance sheet item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof BalanceSheetGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Call tailed report api with given account/group unique name
     *
     * @param event MatCheckboxChange event
     * @param accountGroupUniqueName Unique name of account/group
     * @param entityType Type of the entity, either 'account' or 'group'
     * @memberof BalanceSheetGridRowComponent
     */
    public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void {
        const model = {
            request: {
                reportType: ReportType.BALANCE_SHEET,
                from: this.from,
                to: this.to,
                branchUniqueName: this.generalService.currentBranchUniqueName
            },
            payload: [{ uniqueName: accountGroupUniqueName, entityType: entityType, checked: event.checked }]
        };
        this.financialReportsComponentStore.tailedReportAccountGroup(model);
    }

    /**
     * Releases memory
     *
     * @memberof BalanceSheetGridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
