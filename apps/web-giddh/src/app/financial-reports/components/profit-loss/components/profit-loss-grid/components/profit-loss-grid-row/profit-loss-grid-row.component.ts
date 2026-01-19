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
import { LedgerNavigationHelper } from '../../../../../../helpers/ledger-navigation.helper';

/**
 * Handles Component functionality
 */
@Component({
    selector: '[profit-loss-grid-row]',
    templateUrl: './profit-loss-grid-row.component.html',
    styleUrls: ['./profit-loss-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
/**
 * ProfitLossGridRowComponent component
 * Handles profitlossgridrow functionality and user interactions
 */
export class ProfitLossGridRowComponent extends FinancialGridRowBase implements OnInit, OnDestroy {
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';
    /** Profit loss headers array */
    @Input() public plHeaders: any[];
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;
    /** True, when expand all button is toggled while search is enabled */
    @Input() public isExpandToggledDuringSearch: boolean;
    /** Hold current url */
    private currentUrl: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(protected cd: ChangeDetectorRef, private router: Router, protected financialReportsComponentStore: FinancialReportsComponentStore, protected tlPlService: TlPlService, private generalService: GeneralService) {
        /**
         * Handles super functionality
         */
        super(cd, financialReportsComponentStore, tlPlService);
        this.currentUrl = this.router.url;
    }


    /**
     * Entry click handler
     *
     * @param {*} acc
     * @memberof ProfitLossGridRowComponent
     */
    public entryClicked(acc: any): void {
        LedgerNavigationHelper.openLedger(acc, this.from, this.to, this.currentUrl);
    }

    /**
     * Track by function for profit loss item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof ProfitLossGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item?.uniqueName;
    }

    /**
     * Retrieves the keys of an object.
     *
     * @param obj The object whose keys are to be retrieved.
     * @returns An array of strings representing the keys of the object, or an empty array if the input is null or undefined.
     * @memberof ProfitLossGridRowComponent
     */
    public getKeys(obj: Record<string, any> | null | undefined): string[] | [] {
        /**
         * Handles if functionality
         */
        if (obj) {
            return Object.keys(obj);
        } else {
            return [];
        }
    }

    /**
     * Call tailed report api with given account/group unique name
     *
     * @param event MatCheckboxChange event
     * @param accountGroupUniqueName Unique name of account/group
     * @param entityType Type of the entity, either 'account' or 'group'
     * @memberof ProfitLossGridRowComponent
     */
    public onItemChecked(event: MatCheckboxChange, accountGroupUniqueName: string, entityType: 'account' | 'group'): void {
        const model = {
            request: {
                reportType: ReportType.PROFIT_LOSS,
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
     * @memberof ProfitLossGridRowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
