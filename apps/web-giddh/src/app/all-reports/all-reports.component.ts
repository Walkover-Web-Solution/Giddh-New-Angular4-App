import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { ToasterService } from '../services/toaster.service';
import { AllReportsService } from './utility/all-reports.service';
import { ReportItem } from './utility/all-reports.model';

interface CategoryDefinition {
    key: string;
    label: string;
    icon: string;
    /** Icon foreground color */
    color: string;
    /** Icon badge background color */
    bgColor: string;
    reports: string[];
}

@Component({
    selector: 'app-all-reports',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCardModule,
        HamburgerMenuModule
    ],
    templateUrl: './all-reports.component.html',
    styleUrls: ['./all-reports.component.scss']
})
export class AllReportsComponent implements OnInit, OnDestroy {
    private allReportsService = inject(AllReportsService);
    private toaster = inject(ToasterService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroy$ = new Subject<void>();

    public isLoading = signal<boolean>(true);
    public allReports = signal<ReportItem[]>([]);
    public favorites = signal<ReportItem[]>([]);
    public activeCategory = signal<string>('all');

    /** Per-report display metadata (title + description) keyed by report `name` */
    public readonly reportDescriptions: Record<string, { title: string; description: string; icon: string }> = {
        TRIAL_BALANCE: { title: 'Trial Balance', description: 'Download of all credit & debit balances', icon: 'icon-trial-balance-new' },
        BALANCE_SHEET: { title: 'Balance Sheet', description: 'Download BS in Excel, multiple type of exports', icon: 'icon-balance-sheet-new' },
        PROFIT_AND_LOSS: { title: 'Profit & Loss', description: 'Download data in Excel, project wise report', icon: 'icon-proft-loss-new' },
        GST: { title: 'GST', description: 'GST returns, filings and summaries', icon: 'icon-tax-new' },
        DAYBOOK: { title: 'Daybook', description: 'Everyday entries that can be exported', icon: 'icon-daybook-new' },
        SALES_REGISTER: { title: 'Sales Register', description: 'Net & cumulative sales', icon: 'icon-register-new' },
        PURCHASE_REGISTER: { title: 'Purchase Register', description: 'Net & cumulative purchases', icon: 'icon-register-new' },
        COLUMNAR_REPORT: { title: 'Monthly Columnar Report', description: 'Monthly detailed report of each group', icon: 'icon-monthly-columnar-report' },
        AGING_REPORT_SALES: { title: 'Aging Report (Sales)', description: 'Amount Due in previous days & upcoming', icon: 'icon-aging-report-new' },
        AGING_REPORT_PURCHASE: { title: 'Aging Report (Purchase)', description: 'Amount Due in previous days & upcoming', icon: 'icon-aging-report-new' },
        VAT_REPORT: { title: 'VAT Report', description: 'File & review VAT', icon: 'icon-vat1' },
        VAT_OBLIGATION: { title: 'VAT Obligations', description: 'Upcoming VAT filing obligations', icon: 'icon-vat1' },
        VAT_PAYMENT: { title: 'VAT Payments', description: 'History of VAT payments made', icon: 'icon-vat1' },
        VAT_LIABILITIES: { title: 'VAT Liabilities', description: 'Current VAT liabilities and dues', icon: 'icon-vat1' },
        CASH_FLOW_STATEMENT: { title: 'Cash Flow Statement', description: 'Download cash flow report', icon: 'icon-cash-flow-statement' },
        ACCOUNT_WISE: { title: 'Account-wise Report', description: 'Tax report grouped by account', icon: 'icon-vat1' },
        RATE_WISE: { title: 'Rate-wise Report', description: 'Tax report grouped by rate', icon: 'icon-vat1' }
    };

    /** Static category to report name mapping */
    public readonly categories: CategoryDefinition[] = [
        { key: 'all', label: 'All', icon: 'icon-reports', color: '#6559ff', bgColor: '#f0eeff', reports: [] },
        { key: 'sales', label: 'Sales', icon: 'icon-register-new', color: '#3b82f6', bgColor: '#eaf5ff', reports: ['SALES_REGISTER', 'AGING_REPORT_SALES'] },
        { key: 'purchase', label: 'Purchase', icon: 'icon-vendor', color: '#22c55e', bgColor: '#eaf9ef', reports: ['PURCHASE_REGISTER', 'AGING_REPORT_PURCHASE'] },
        { key: 'customers', label: 'Customers', icon: 'icon-customer', color: '#ff8a4c', bgColor: '#fff4ec', reports: ['AGING_REPORT_SALES', 'AGING_REPORT_PURCHASE'] },
        { key: 'financial', label: 'Financial', icon: 'icon-tax-new', color: '#6366f1', bgColor: '#eef2ff', reports: ['TRIAL_BALANCE', 'BALANCE_SHEET', 'PROFIT_AND_LOSS', 'GST', 'VAT_REPORT', 'VAT_OBLIGATION', 'VAT_PAYMENT', 'VAT_LIABILITIES'] },
        { key: 'accounting', label: 'Accounting', icon: 'icon-reports', color: '#0ea5e9', bgColor: '#eaf5ff', reports: ['DAYBOOK', 'COLUMNAR_REPORT', 'ACCOUNT_WISE', 'RATE_WISE'] },
        { key: 'inventory', label: 'Inventory', icon: 'icon-inventory', color: '#8b5cf6', bgColor: '#f3f0ff', reports: [] },
        { key: 'cashflow', label: 'Cash Flow', icon: 'icon-cash-flow-statement', color: '#ef4444', bgColor: '#ffecec', reports: ['CASH_FLOW_STATEMENT'] }
    ];

    /** Reports filtered by active category, excluding items already in favorites */
    public filteredReports = computed(() => {
        const cat = this.activeCategory();
        const favSet = new Set(this.favorites().map(f => f.uniqueName));
        const nonFavorite = this.allReports().filter(r => !favSet.has(r.uniqueName));
        if (cat === 'all') {
            return nonFavorite;
        }
        const def = this.categories.find(c => c.key === cat);
        if (!def) return nonFavorite;
        return nonFavorite.filter(r => def.reports.includes(r.name));
    });

    /** Category groups rendered as cards under All Reports (excludes the 'all' pseudo-category) */
    public categoryGroups = computed(() => {
        const all = this.allReports();
        return this.categories
            .filter(c => c.key !== 'all')
            .map(cat => ({
                category: cat,
                reports: all.filter(r => cat.reports.includes(r.name))
            }));
    });

    /** Current category label for display */
    public currentCategoryLabel = computed(() => {
        const cat = this.activeCategory();
        const def = this.categories.find(c => c.key === cat);
        return def?.label;
    });

    /** Set of favorite unique names for fast lookup */
    public favoriteSet = computed(() => new Set(this.favorites().map(f => f.uniqueName)));

    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const category = params['category'] || 'all';
            this.activeCategory.set(category);
        });
        this.loadReports();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadReports(): void {
        this.isLoading.set(true);
        this.allReportsService.getAllReports().pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
                if (res?.status === 'success' && res.body) {
                    const reportList = res.body.reportList || [];
                    const favoriteList = res.body.favoriteReportList || [];
                    // Merge favorites into the full list so category cards always show the complete set
                    const merged: ReportItem[] = [...reportList];
                    const seen = new Set(merged.map(r => r.uniqueName));
                    favoriteList.forEach(f => {
                        if (!seen.has(f.uniqueName)) {
                            merged.push(f);
                            seen.add(f.uniqueName);
                        }
                    });
                    this.allReports.set(merged);
                    this.favorites.set(favoriteList);
                } else if (res?.message) {
                    this.toaster.errorToast(res.message);
                }
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    public selectCategory(key: string): void {
        this.activeCategory.set(key);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { category: key === 'all' ? null : key },
            queryParamsHandling: 'merge'
        });
    }

    /**
     * Get display name from raw report name (e.g. TRIAL_BALANCE -> Trial Balance)
     */
    public displayName(name: string): string {
        if (!name) return '';
        const meta = this.reportDescriptions[name];
        if (meta?.title) return meta.title;
        return name.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    /** Get description for a report */
    public reportDescription(report: ReportItem): string {
        return this.reportDescriptions[report?.name]?.description || this.categoryLabel(report);
    }

    /**
     * Get category label for a report
     */
    public categoryLabel(report: ReportItem): string {
        const cat = this.categories.find(c => c.key !== 'all' && c.reports.includes(report.name));
        return cat ? `${cat.label} Reports` : 'Reports';
    }

    /** Get category key for a report (used to drive per-category color accents in the UI) */
    public reportCategoryKey(report: ReportItem): string {
        const cat = this.categories.find(c => c.key !== 'all' && c.reports.includes(report?.name));
        return cat ? cat.key : '';
    }

    /** Get the category definition for a report (for direct color usage in templates) */
    public reportCategory(report: string): CategoryDefinition | undefined {
        return this.categories.find(c => c.key === report);
    }

    public categoryIcon(report: ReportItem): string {
        const meta = this.reportDescriptions[report?.name];
        if (meta?.icon) return meta.icon;
        const cat = this.categories.find(c => c.key !== 'all' && c.reports.includes(report.name));
        return cat ? cat.icon : 'icon-reports';
    }

    public isFavorite(report: ReportItem): boolean {
        return this.favoriteSet().has(report.uniqueName);
    }

    /**
     * Toggle a report as favorite and persist to API.
     */
    public toggleFavorite(event: Event, report: ReportItem): void {
        event.stopPropagation();
        const currentFavorites = this.favorites();
        let updated: ReportItem[];
        if (this.isFavorite(report)) {
            updated = currentFavorites.filter(f => f.uniqueName !== report.uniqueName);
        } else {
            updated = [...currentFavorites, { name: report.name, uniqueName: report.uniqueName }];
        }
        this.favorites.set(updated);
        this.allReportsService.saveFavoriteReports(updated).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
                if (res?.status !== 'success') {
                    this.favorites.set(currentFavorites);
                    if (res?.message) this.toaster.errorToast(res.message);
                }
            },
            error: () => this.favorites.set(currentFavorites)
        });
    }

    /**
     * Navigate to the report page from its uniqueName (URL path with optional query params).
     */
    public openReport(report: ReportItem): void {
        if (!report?.uniqueName) return;
        let path = report.uniqueName.trim();
        if (!path.startsWith('/')) path = '/' + path;
        const [urlPath, queryString] = path.split('?');
        const queryParams: Record<string, string> = {};
        if (queryString) {
            queryString.split('&').forEach(pair => {
                const [k, v] = pair.split('=');
                if (k) queryParams[k] = decodeURIComponent(v || '');
            });
        }
        this.router.navigate([urlPath], { queryParams });
    }
}
