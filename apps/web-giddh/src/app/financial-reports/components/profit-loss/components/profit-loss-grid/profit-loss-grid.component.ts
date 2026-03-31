/* OLD IMPLEMENTATION COMMENTED OUT - Replaced with Angular Material table implementation below */
/*
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { FinancialReportsComponentStore } from '../../../../financial-reports.store';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { Configuration } from '../../../../../app.constant';
import { environment } from '../../../../../../environments/environment.generated';
import { each, forEach, indexOf, keys } from '../../../../../lodash-optimized';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
*/

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account, ChildGroup } from 'apps/web-giddh/src/app/models/api-models/Search';
import { ProfitLossData } from 'apps/web-giddh/src/app/models/api-models/tb-pl-bs';
import { ReportType } from 'apps/web-giddh/src/app/multi-currency-reports/multi-currency.const';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { environment } from '../../../../../../environments/environment.generated';
import { Configuration } from '../../../../../app.constant';
import { FinancialReportsComponentStore } from '../../../../financial-reports.store';
import { NewConfirmationModalComponent } from '../../../../../theme/new-confirmation-modal/confirmation-modal.component';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/** Represents a single flattened row in the profit-loss table */
export interface PlTableRow {
    /** Unique identifier for the row */
    id: string;
    /** Display name of the row */
    name: string;
    /** Indentation depth level */
    depth: number;
    /** Row type for styling and logic */
    type: 'section-header' | 'group' | 'account' | 'summary' | 'summary-bold' | 'cogs-item';
    /** Whether this row can be expanded */
    expandable: boolean;
    /** Whether this row is currently expanded */
    expanded: boolean;
    /** Balance data keyed by date range */
    balances: Record<string, { amount: number; type: string } | null>;
    /** Raw ChildGroup or Account reference for checkbox/click actions */
    ref?: any;
    /** Category: 'income' | 'expenses' */
    category?: string;
    /** Whether this row is checked (reconcile) */
    checked?: boolean;
    /** Whether this row should show the reconcile checkbox */
    showCheckbox?: boolean;
    /** True if this is a level-1 group (header-like) */
    isLevel1?: boolean;
    /** True if this row is a COGS sub-item (no checkbox) */
    isSelfCreated?: boolean;
    /** Parent row id for collapse/expand logic */
    parentId?: string | null;
}

@Component({
    selector: 'profit-loss-grid',
    templateUrl: './profit-loss-grid.component.html',
    styleUrls: ['./profit-loss-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialReportsComponentStore],
    standalone: false
})
export class ProfitLossGridComponent implements OnInit, OnChanges, OnDestroy {
    /** Whether there is no data to show */
    public noData: boolean;
    /** Whether the search input is visible */
    public showClearSearch: boolean = false;
    /** Current search string */
    @Input() public search: string = '';
    /** Internal search input value */
    @Input() public searchInput: string = '';
    /** Emits when search changes */
    @Output() public searchChange = new EventEmitter<string>();
    /** Profit/loss data from parent */
    @Input() public plData: ProfitLossData;
    /** COGS data from parent */
    @Input() public cogsData: ChildGroup;
    /** Padding for rows */
    @Input() public padding: string;
    /** Whether all rows should be expanded */
    @Input() public expandAll: boolean;
    /** From date */
    @Input() public from: string = '';
    /** To date */
    @Input() public to: string = '';
    /** Emits when data should be refreshed */
    @Output() public refresh = new EventEmitter<string>();
    /** Reference to search input element */
    @ViewChild('searchInputEl', { static: true }) public searchInputEl: ElementRef;
    /** Search form control */
    public plSearchControl: UntypedFormControl = new UntypedFormControl();
    /** Local locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Hides the data while a new search is refreshing */
    public hideData: boolean;
    /** True when expand all is toggled during search */
    public isExpandToggledDuringSearch: boolean;
    /** Holds images folder path */
    public imgPath: string = '';
    /** Flattened rows for the mat-table */
    public tableRows: PlTableRow[] = [];
    /** Displayed column definitions (first column + one per date header) */
    public displayedColumns: string[] = [];
    /** Whether the reconcile (tally) checkboxes are shown */
    public showTaillyCheckbox: boolean = false;

    /** Returns only the amount columns (displayedColumns minus the 'name' column) */
    public get amountColumns(): string[] {
        return this.displayedColumns.slice(1);
    }

    /** List of checked groups/accounts for bulk uncheck */
    private listOfCheckGroupsAccounts: any[] = [];
    /** Observable to unsubscribe all store listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Set of expanded row ids */
    private expandedIds: Set<string> = new Set();
    /** Set of uniqueNames that are checked (reconcile) - persists across API refreshes */
    private checkedIds: Set<string> = new Set();
    /** Current URL for ledger navigation */
    private currentUrl: string = '';

    constructor(
        private cd: ChangeDetectorRef,
        private financialReportsComponentStore: FinancialReportsComponentStore,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private router: Router,
        @Inject(ServiceConfig) private serviceConfig: any,
    ) {
        this.currentUrl = this.router.url;
    }

    /**
     * Lifecycle hook: initialises subscriptions and builds the table
     *
     * @memberof ProfitLossGridComponent
     */
    public ngOnInit(): void {
        this.imgPath = Configuration.isElectron
            ? 'assets/images/'
            : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';

        this.plSearchControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((newValue) => {
            this.searchInput = newValue;
            this.hideData = true;
            this.searchChange.emit(this.searchInput);
            this.isExpandToggledDuringSearch = false;
            if (newValue === '') {
                this.showClearSearch = false;
            }
            setTimeout(() => {
                this.hideData = false;
                this.buildTableRows();
                this.cd.detectChanges();
            }, 10);
        });

        this.financialReportsComponentStore.tailedReportIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.listOfCheckGroupsAccounts = [];
                setTimeout(() => {
                    this.refresh.emit();
                }, 600);
            }
        });
    }

    /**
     * Lifecycle hook: rebuilds table rows when inputs change
     *
     * @param {SimpleChanges} changes
     * @memberof ProfitLossGridComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.plData || changes.cogsData) {
            this.buildTableRows();
        }
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            this.isExpandToggledDuringSearch = true;
            if (changes.expandAll.currentValue) {
                this.expandAllRows();
            } else {
                this.collapseAllRows();
            }
            this.buildTableRows();
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange) {
            this.buildTableRows();
            this.cd.detectChanges();
        }
    }

    /**
     * Expands all expandable rows by adding all group IDs to expandedIds
     *
     * @private
     * @memberof ProfitLossGridComponent
     */
    private expandAllRows(): void {
        if (!this.plData) return;
        const addAll = (groups: ChildGroup[], prefix = '') => {
            (groups || []).forEach(g => {
                const id = prefix + g.uniqueName;
                this.expandedIds.add(id);
                if (g.childGroups?.length) addAll(g.childGroups, id + '/');
            });
        };
        addAll(this.plData.incArr || []);
        addAll(this.plData.expArr || []);
        if (this.cogsData) {
            this.expandedIds.add(this.cogsData.uniqueName);
        }
    }

    /**
     * Collapses all expandable rows by clearing expandedIds
     *
     * @private
     * @memberof ProfitLossGridComponent
     */
    private collapseAllRows(): void {
        this.expandedIds.clear();
    }

    /**
     * Builds the flat list of PlTableRow objects from plData and cogsData.
     * Called whenever plData or cogsData changes, or expand/collapse/search is triggered.
     *
     * @memberof ProfitLossGridComponent
     */
    public buildTableRows(): void {
        if (!this.plData) {
            this.tableRows = [];
            this.displayedColumns = ['name'];
            return;
        }

        const headers: string[] = this.plData.headers || [];
        this.displayedColumns = ['name', ...headers];

        const rows: PlTableRow[] = [];
        const incomeStatement = this.plData.incomeStatement;
        const search = (this.search || '').toLowerCase().trim();

        const makeBalances = (obj: any): Record<string, { amount: number; type: string } | null> => {
            if (!obj) return {};
            const result: Record<string, { amount: number; type: string } | null> = {};
            headers.forEach(h => {
                result[h] = obj[h] ?? null;
            });
            return result;
        };

        const matchesSearch = (name: string): boolean => {
            if (!search) return true;
            return name?.toLowerCase().includes(search);
        };

        const addGroupRows = (
            groups: ChildGroup[],
            depth: number,
            category: string,
            parentId: string | null
        ): boolean => {
            let hasVisibleChildren = false;
            (groups || []).forEach(grp => {
                const id = (parentId ? parentId + '/' : '') + grp.uniqueName;
                const isExpanded = this.expandedIds.has(id);
                const autoExpand = !!(search && !this.isExpandToggledDuringSearch);
                const nameMatch = matchesSearch(grp.groupName);

                /** Determine if any child matches the search (needed before pushing the group row) */
                let childrenMatchSearch = false;
                if (search) {
                    const checkChildren = (g: ChildGroup): boolean => {
                        if (matchesSearch(g.groupName)) return true;
                        for (const acc of (g.accounts || [])) {
                            if (matchesSearch(acc.name)) return true;
                        }
                        for (const child of (g.childGroups || [])) {
                            if (checkChildren(child)) return true;
                        }
                        return false;
                    };
                    for (const acc of (grp.accounts || [])) {
                        if (matchesSearch(acc.name)) { childrenMatchSearch = true; break; }
                    }
                    if (!childrenMatchSearch) {
                        for (const child of (grp.childGroups || [])) {
                            if (checkChildren(child)) { childrenMatchSearch = true; break; }
                        }
                    }
                }

                const shouldShow = nameMatch || (search && childrenMatchSearch);
                if (!shouldShow) return;

                hasVisibleChildren = true;

                /** Level-1 groups: always expanded, no chevron.
                 *  Deeper groups: expandable only if they have child-groups (not just accounts).
                 *  Accounts are shown by default only for level1 children via expand.
                 */
                const alwaysExpanded = !!grp.level1;
                const hasSubGroups = (grp.childGroups?.length > 0);
                const isExpandable = !alwaysExpanded && hasSubGroups;
                const showChildren = alwaysExpanded || isExpanded || autoExpand;

                /** Push the group row FIRST */
                rows.push({
                    id,
                    name: grp.groupName,
                    depth,
                    type: 'group',
                    expandable: isExpandable,
                    expanded: showChildren,
                    balances: grp.level1 ? {} : makeBalances(grp.closingBalance),
                    ref: grp,
                    category,
                    checked: grp.checked || this.checkedIds.has(grp.uniqueName),
                    showCheckbox: !grp.level1 && !grp.isSelfCreatedGroup,
                    isLevel1: grp.level1,
                    isSelfCreated: grp.isSelfCreatedGroup,
                    parentId,
                });

                /** Then push children if always-expanded, expanded, or search is active */
                if (showChildren) {
                    if (grp.childGroups?.length) {
                        addGroupRows(grp.childGroups, depth + 1, category, id);
                    }
                    if (grp.accounts?.length) {
                        (grp.accounts).forEach(acc => {
                            if (!matchesSearch(acc.name) && !nameMatch) return;
                            rows.push({
                                id: id + '/acc/' + acc.uniqueName,
                                name: acc.name,
                                depth: depth + 1,
                                type: 'account',
                                expandable: false,
                                expanded: false,
                                balances: makeBalances(acc.closingBalance),
                                ref: acc,
                                category,
                                checked: acc.checked || this.checkedIds.has(acc.uniqueName),
                                showCheckbox: true,
                                isSelfCreated: false,
                                parentId: id,
                            });
                        });
                    }
                }
            });
            return hasVisibleChildren;
        };

        /** Revenue section */
        addGroupRows(this.plData.incArr || [], 0, 'income', null);

        /** COGS section - level-1 group, always expanded, no chevron */
        if (this.cogsData) {
            const cogsId = this.cogsData.uniqueName;
            rows.push({
                id: cogsId,
                name: this.cogsData.groupName,
                depth: 0,
                type: 'group',
                expandable: false,
                expanded: true,
                balances: {},
                ref: this.cogsData,
                category: 'expenses',
                showCheckbox: false,
                isLevel1: true,
                parentId: null,
            });
            (this.cogsData.childGroups || []).forEach(item => {
                if (!matchesSearch(item.groupName)) return;
                rows.push({
                    id: cogsId + '/' + item.uniqueName,
                    name: item.groupName,
                    depth: 1,
                    type: 'cogs-item',
                    expandable: false,
                    expanded: false,
                    balances: makeBalances(item.closingBalance),
                    ref: item,
                    category: 'expenses',
                    showCheckbox: false,
                    isSelfCreated: true,
                    parentId: cogsId,
                });
            });
        }
        rows.push({
            id: '__summary_cogs',
            name: this.localeData?.total_cost_of_goods_sold || 'Total Cost Of Goods Sold',
            depth: 0,
            type: 'summary',
            expandable: false,
            expanded: false,
            balances: makeBalances(this.cogsData?.closingBalance),
            parentId: null,
        });

        /** Gross profit row */
        rows.push({
            id: '__summary_gross_profit',
            name: this.localeData?.gross_profit || 'Gross Profit',
            depth: 0,
            type: 'summary-bold',
            expandable: false,
            expanded: false,
            balances: makeBalances(incomeStatement?.grossProfit),
            parentId: null,
        });

        /** Operating expenses section - exclude indirectexpenses (shown separately in Other Expenses) */
        const opExpGroups = (this.plData.expArr || []).filter(g => g.uniqueName !== 'indirectexpenses');
        addGroupRows(opExpGroups, 0, 'expenses', null);
        rows.push({
            id: '__summary_total_opex',
            name: this.localeData?.total_operating_expenses || 'Total Operating Expenses',
            depth: 0,
            type: 'summary',
            expandable: false,
            expanded: false,
            balances: makeBalances(incomeStatement?.operatingExpenses),
            parentId: null,
        });

        /** Operating profit row */
        rows.push({
            id: '__summary_operating_profit',
            name: this.localeData?.operating_profit_loss || 'Operating Profit/Loss (EBIT)',
            depth: 0,
            type: 'summary-bold',
            expandable: false,
            expanded: false,
            balances: makeBalances(incomeStatement?.operatingProfit),
            parentId: null,
        });

        /** Other expenses section - always expanded, no chevron */
        if (incomeStatement?.otherExpenses) {
            const indirectGroup = (this.plData.expArr || []).find(g => g.uniqueName === 'indirectexpenses');
            if (indirectGroup) {
                const indirectId = 'indirectexpenses_other';
                rows.push({
                    id: indirectId,
                    name: indirectGroup.groupName,
                    depth: 0,
                    type: 'group',
                    expandable: false,
                    expanded: true,
                    balances: {},
                    ref: indirectGroup,
                    category: 'expenses',
                    checked: indirectGroup.checked,
                    showCheckbox: false,
                    isLevel1: true,
                    parentId: null,
                });
                addGroupRows(indirectGroup.childGroups || [], 1, 'expenses', indirectId);
                (indirectGroup.accounts || []).forEach(acc => {
                    if (!matchesSearch(acc.name)) return;
                    rows.push({
                        id: indirectId + '/acc/' + acc.uniqueName,
                        name: acc.name,
                        depth: 1,
                        type: 'account',
                        expandable: false,
                        expanded: false,
                        balances: makeBalances(acc.closingBalance),
                        ref: acc,
                        category: 'expenses',
                        checked: acc.checked,
                        showCheckbox: true,
                        parentId: indirectId,
                    });
                });
            }
            rows.push({
                id: '__summary_other_exp',
                name: this.localeData?.total_other_expense || 'Total Other Expenses',
                depth: 0,
                type: 'summary',
                expandable: false,
                expanded: false,
                balances: makeBalances(incomeStatement?.otherExpenses),
                parentId: null,
            });
        }

        /** Income before taxes */
        rows.push({
            id: '__summary_income_before_taxes',
            name: this.localeData?.income_before_taxes || 'Income Before Taxes (EBT)',
            depth: 0,
            type: 'summary-bold',
            expandable: false,
            expanded: false,
            balances: makeBalances(incomeStatement?.incomeBeforeTaxes),
            parentId: null,
        });

        this.tableRows = rows;
        this.cd.markForCheck();
    }

    /**
     * Toggles expansion of a row by adding/removing its ID from expandedIds,
     * then rebuilds the table.
     *
     * @param {PlTableRow} row - The row to toggle
     * @memberof ProfitLossGridComponent
     */
    public toggleRow(row: PlTableRow): void {
        if (!row.expandable) return;
        if (this.expandedIds.has(row.id)) {
            this.expandedIds.delete(row.id);
        } else {
            this.expandedIds.add(row.id);
        }
        row.expanded = this.expandedIds.has(row.id);
        this.buildTableRows();
        this.cd.detectChanges();
    }

    /**
     * Shows the search input and focuses it
     *
     * @memberof ProfitLossGridComponent
     */
    public toggleSearch(): void {
        this.showClearSearch = true;
        setTimeout(() => {
            if (this.searchInputEl?.nativeElement) {
                this.searchInputEl.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * Hides search input when clicking outside if no value present
     *
     * @param {Event} event
     * @param {HTMLElement} el
     * @memberof ProfitLossGridComponent
     */
    public clickedOutside(event: Event, el: HTMLElement): void {
        if (this.plSearchControl?.value !== null && this.plSearchControl?.value !== '') {
            return;
        }
        if (this.childOf(event.target as HTMLElement, el)) {
            return;
        }
        this.showClearSearch = false;
    }

    /**
     * Returns true if c is a descendant of p
     *
     * @param {HTMLElement} c - Child element
     * @param {HTMLElement} p - Parent element
     * @returns {boolean}
     * @memberof ProfitLossGridComponent
     */
    public childOf(c: HTMLElement, p: HTMLElement): boolean {
        let node: HTMLElement = c;
        while ((node = node.parentNode as HTMLElement) && node !== p) { }
        return !!node;
    }

    /**
     * Returns the formatted display amount for a cell.
     * Negative sign is applied when category/type combination needs it.
     *
     * @param {{ amount: number; type: string } | null} balance
     * @param {string} [category]
     * @returns {number}
     * @memberof ProfitLossGridComponent
     */
    public getDisplayAmount(balance: { amount: number; type: string } | null, category?: string): number {
        if (!balance) return 0;
        return balance.amount;
    }

    /**
     * Returns true when a minus sign should prefix the amount
     *
     * @param {{ amount: number; type: string } | null} balance
     * @param {string} [category]
     * @returns {boolean}
     * @memberof ProfitLossGridComponent
     */
    public showMinus(balance: { amount: number; type: string } | null, category?: string): boolean {
        if (!balance || balance.amount === 0) return false;
        if (category === 'income' && balance.type === 'DEBIT') return true;
        if (category === 'expenses' && balance.type === 'CREDIT') return true;
        return false;
    }

    /**
     * Returns true when a minus sign should be shown for income statement summary rows
     *
     * @param {{ amount: number; type: string } | null} balance
     * @param {string} summaryType - 'income' | 'expenses' context
     * @returns {boolean}
     * @memberof ProfitLossGridComponent
     */
    public showSummaryMinus(balance: { amount: number; type: string } | null, summaryType: string): boolean {
        return this.showMinus(balance, summaryType);
    }

    /**
     * Handles reconcile (tally) checkbox change for a group or account
     *
     * @param {MatCheckboxChange} event
     * @param {PlTableRow} row
     * @param {'account' | 'group'} entityType
     * @memberof ProfitLossGridComponent
     */
    public onItemChecked(event: MatCheckboxChange, row: PlTableRow, entityType: 'account' | 'group'): void {
        if (row.ref) row.ref.checked = event.checked;
        row.checked = event.checked;
        if (row.ref?.uniqueName) {
            if (event.checked) {
                this.checkedIds.add(row.ref.uniqueName);
            } else {
                this.checkedIds.delete(row.ref.uniqueName);
            }
        }
        const model = {
            request: {
                reportType: ReportType.PROFIT_LOSS,
                from: this.from,
                to: this.to,
                branchUniqueName: this.generalService.currentBranchUniqueName
            },
            payload: [{ uniqueName: row.ref?.uniqueName, entityType, checked: event.checked }]
        };
        this.financialReportsComponentStore.tailedReportAccountGroup(model);
    }

    /**
     * Opens the confirm dialog to uncheck all reconcile checkboxes
     *
     * @memberof ProfitLossGridComponent
     */
    public openConfirmDialog(): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.commonLocaleData?.app_uncheck_all_item_message,
                    this.commonLocaleData
                )
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.uncheckAll();
            }
        });
    }

    /**
     * Navigates to the ledger page for a given account on double-click
     *
     * @param {PlTableRow} row
     * @memberof ProfitLossGridComponent
     */
    public entryClicked(row: PlTableRow): void {
        if (row.type !== 'account' || !row.ref?.uniqueName) return;
        const acc = row.ref;
        let url = `${location.origin}/pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`;
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}redirectUrl=${encodeURIComponent(this.currentUrl)}`;

        if (Configuration.isElectron) {
            try {
                let used = false;
                if ((window as any).electronAPI?.send) {
                    (window as any).electronAPI.send('open-url', `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`);
                    used = true;
                }
                if (!used && (window as any).require) {
                    const electron = (window as any).require('electron');
                    if (electron?.ipcRenderer?.send) {
                        electron.ipcRenderer.send('open-url', `${location.origin}${location.pathname}#./pages/ledger/${acc.uniqueName}/${this.from}/${this.to}`);
                        used = true;
                    }
                }
                if (!used) (window as any).open(url, '_blank');
            } catch {
                (window as any).open(url, '_blank');
            }
        } else {
            (window as any).open(url, '_blank');
        }
    }

    /**
     * Returns the keys of an object or empty array
     *
     * @param {Record<string, any> | null | undefined} obj
     * @returns {string[]}
     * @memberof ProfitLossGridComponent
     */
    public getKeys(obj: Record<string, any> | null | undefined): string[] {
        return obj ? Object.keys(obj) : [];
    }

    /**
     * TrackBy for mat-table rows
     *
     * @param {number} _index
     * @param {PlTableRow} row
     * @returns {string}
     * @memberof ProfitLossGridComponent
     */
    public trackByRow(_index: number, row: PlTableRow): string {
        return row.id;
    }

    /**
     * TrackBy for column headers
     *
     * @param {number} _index
     * @param {string} col
     * @returns {string}
     * @memberof ProfitLossGridComponent
     */
    public trackByCol(_index: number, col: string): string {
        return col;
    }

    /**
     * Unchecks all reconcile-checked groups/accounts in the grid
     *
     * @private
     * @memberof ProfitLossGridComponent
     */
    private uncheckAll(): void {
        this.checkedIds.clear();
        this.listOfCheckGroupsAccounts = [];
        this.extractCheckedAccountsGroups([...(this.plData?.incArr || []), ...(this.plData?.expArr || [])], 'group');
        setTimeout(() => {
            if (this.listOfCheckGroupsAccounts?.length) {
                const model = {
                    request: {
                        reportType: ReportType.PROFIT_LOSS,
                        from: this.from,
                        to: this.to,
                        branchUniqueName: this.generalService.currentBranchUniqueName
                    },
                    payload: this.listOfCheckGroupsAccounts
                };
                this.financialReportsComponentStore.tailedReportAccountGroup(model);
            }
        }, 400);
    }

    /**
     * Recursively extracts checked accounts/groups for bulk uncheck
     *
     * @param {any[]} groupAccountDetails
     * @param {'group' | 'account'} entityType
     * @private
     * @memberof ProfitLossGridComponent
     */
    private extractCheckedAccountsGroups(groupAccountDetails: any[], entityType: 'group' | 'account'): void {
        (Array.isArray(groupAccountDetails) ? groupAccountDetails : []).forEach(ga => {
            if (ga.checked) {
                this.listOfCheckGroupsAccounts.push({ uniqueName: ga.uniqueName, entityType, checked: false });
            }
            if (ga.childGroups?.length) this.extractCheckedAccountsGroups(ga.childGroups, 'group');
            if (ga.accounts?.length) this.extractCheckedAccountsGroups(ga.accounts, 'account');
        });
    }

    /**
     * Lifecycle hook: releases all subscriptions
     *
     * @memberof ProfitLossGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
