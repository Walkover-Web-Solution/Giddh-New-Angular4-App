import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { ToasterService } from '../services/toaster.service';
import { GeneralService } from '../services/general.service';
import { AllReportsService } from './utility/all-reports.service';
import { FilterOption, ReportItem } from './utility/all-reports.model';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';

/** UI-facing shape of a report category rendered as a chip/card */
interface CategoryDefinition {
    /** URL-safe key, e.g. 'cash-flow' */
    key: string;
    /** Human readable label from API */
    label: string;
    /** CSS icon class or SVG filename */
    icon: string;
    /** Icon foreground color */
    color: string;
    /** Icon badge background color */
    bgColor: string;
    /** Raw report `name` values that belong to this category */
    reports: string[];
}

/** Canonical category names as returned by the API (`filterOption.name`) */
export enum ReportCategoryName {
    ALL = 'All',
    SALES = 'Sales',
    PURCHASE = 'Purchase',
    CUSTOMERS = 'Customers',
    FINANCIAL = 'Financial',
    ACCOUNTING = 'Accounting',
    INVENTORY = 'Inventory',
    CASH_FLOW = 'Cash Flow'
}

@Component({
    selector: 'app-all-reports',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule,
        MatCardModule,
        HamburgerMenuModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ],
    templateUrl: './all-reports.component.html',
    styleUrls: ['./all-reports.component.scss']
})
export class AllReportsComponent implements OnInit, OnDestroy {
    /** Service that fetches reports and manages favorites */
    private allReportsService = inject(AllReportsService);
    /** Toast notification service */
    private toaster = inject(ToasterService);
    /** Angular router used for navigation to reports */
    private router = inject(Router);
    /** Current activated route (used for query params) */
    private route = inject(ActivatedRoute);
    /** General service for common utilities */
    private generalService = inject(GeneralService);
    /** RxJS unsubscribe stream for component teardown */
    private destroy$ = new Subject<void>();

    /** True while the initial API call is in flight */
    public isLoading = signal<boolean>(false);
    /** Full list of reports merged with favorites */
    public allReports = signal<ReportItem[]>([]);
    /** Reports marked as favorite by the user */
    public favorites = signal<ReportItem[]>([]);
    /** Currently active category key (e.g. 'all', 'sales') */
    public activeCategory = signal<string>('all');
    /** Filter options received from API */
    public filterOptions = signal<FilterOption[]>([]);

    /** Locale data loaded via appTranslate directive from assets/locale/all-reports/{lang}.json */
    public localeData: any = {};
    /** Common locale data shared across the app */
    public commonLocaleData: any = {};

    /**
     * Per-report display metadata (title, description, icon) keyed by report `name`.
     *
     * @returns {Record<string, { title: string; description: string; icon: string }>}
     * @memberof AllReportsComponent
     */
    public get reportDescriptions(): Record<string, { title: string; description: string; icon: string }> {
        return this.localeData?.reportDescriptions || {};
    }

    /** Visual metadata per category name (keyed by API `filterOption.name`) */
    private readonly categoryMeta: Record<ReportCategoryName, { icon: string; color: string; bgColor: string }> = {
        [ReportCategoryName.ALL]:       { icon: 'icon-reports', color: '#6559ff', bgColor: '#f0eeff' },
        [ReportCategoryName.SALES]:     { icon: 'icon-register-new', color: '#3b82f6', bgColor: '#eaf5ff' },
        [ReportCategoryName.PURCHASE]:  { icon: 'icon-vendor', color: '#22c55e', bgColor: '#eaf9ef' },
        [ReportCategoryName.CUSTOMERS]: { icon: 'icon-customer', color: '#ff8a4c', bgColor: '#fff4ec' },
        [ReportCategoryName.FINANCIAL]: { icon: 'icon-tax-new', color: '#6366f1', bgColor: '#eef2ff' },
        [ReportCategoryName.ACCOUNTING]:{ icon: 'icon-reports', color: '#0ea5e9', bgColor: '#eaf5ff' },
        [ReportCategoryName.INVENTORY]: { icon: 'icon-inventory', color: '#8b5cf6', bgColor: '#f3f0ff' },
        [ReportCategoryName.CASH_FLOW]: { icon: 'icon-cash-flow-statement', color: '#ef4444', bgColor: '#ffecec' }
    };

    /** Categories derived from API `filterOption`, prefixed with the "All" pseudo-category */
    public categories = computed<CategoryDefinition[]>(() => {
        const allMeta = this.categoryMeta[ReportCategoryName.ALL];
        const allDef: CategoryDefinition = { key: 'all', label: ReportCategoryName.ALL, icon: allMeta.icon, color: allMeta.color, bgColor: allMeta.bgColor, reports: [] };
        const dynamic: CategoryDefinition[] = this.filterOptions().map(opt => {
            const meta = this.categoryMeta[opt.name as ReportCategoryName] || { icon: 'icon-reports', color: '#6559ff', bgColor: '#f0eeff' };
            return {
                key: this.toKey(opt.name),
                label: opt.name,
                icon: meta.icon,
                color: meta.color,
                bgColor: meta.bgColor,
                reports: opt.reports || []
            };
        });
        return [allDef, ...dynamic];
    });

    /**
     * Build a URL-safe key from a category name (e.g. "Cash Flow" -> "cash-flow").
     *
     * @param {string} name Raw category name
     * @returns {string} Lower-cased, hyphen-separated key
     * @memberof AllReportsComponent
     */
    private toKey(name: string): string {
        return (name || '').toLowerCase().trim().replace(/\s+/g, '-');
    }

    /** Reports filtered by active category, excluding items already in favorites */
    public filteredReports = computed(() => {
        const cat = this.activeCategory();
        const favSet = new Set(this.favorites().map(f => f.uniqueName));
        const nonFavorite = this.allReports().filter(r => !favSet.has(r.uniqueName));
        if (cat === 'all') {
            return nonFavorite;
        }
        const def = this.categories().find(c => c.key === cat);
        if (!def) return nonFavorite;
        return nonFavorite.filter(r => def.reports.includes(r.name));
    });

    /** Category groups rendered as cards under All Reports (excludes the 'all' pseudo-category) */
    public categoryGroups = computed(() => {
        const all = this.allReports();
        return this.categories()
            .filter(c => c.key !== 'all')
            .map(cat => ({
                category: cat,
                reports: all.filter(r => cat.reports.includes(r.name))
            }));
    });

    /** Current category label for display */
    public currentCategoryLabel = computed(() => {
        const cat = this.activeCategory();
        const def = this.categories().find(c => c.key === cat);
        return def?.label;
    });

    /** Set of favorite unique names for fast lookup */
    public favoriteSet = computed(() => new Set(this.favorites().map(f => f.uniqueName)));

    /**
     * Subscribes to route params and triggers report load.
     *
     * @returns {void}
     * @memberof AllReportsComponent
     */
    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const category = params['category'] || 'all';
            this.activeCategory.set(category);
        });
        this.loadReports();
    }

    /**
     * Emits on destroy stream and cleans up all subscriptions.
     *
     * @returns {void}
     * @memberof AllReportsComponent
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Loads reports and favorites from the API and merges them.
     *
     * @returns {void}
     * @memberof AllReportsComponent
     */
    private loadReports(): void {
        this.isLoading.set(true);
        this.allReportsService.getAllReports().pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
                if (res?.status === 'success' && res.body) {
                    const reportList = res.body.reportList || [];
                    const favoriteList = res.body.favoriteReportList || [];
                    const filterOption: FilterOption[] = res.body.filterOption || [];
                    this.filterOptions.set(filterOption);
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

    /**
     * Selects a category chip and syncs it to the URL query params.
     *
     * @param {string} key Category key to activate
     * @returns {void}
     * @memberof AllReportsComponent
     */
    public selectCategory(key: string): void {
        this.activeCategory.set(key);
        this.generalService.updateActivatedRouteQueryParams({ category: key === 'all' ? null : key });
    }

    /**
     * Returns the display title for a raw report name (locale-aware, with fallback).
     *
     * @param {string} name Raw report name (e.g. TRIAL_BALANCE)
     * @returns {string} Localized title or title-cased fallback
     * @memberof AllReportsComponent
     */
    public displayName(name: string): string {
        if (!name) return '';
        const meta = this.reportDescriptions[name];
        if (meta?.title) return meta.title;
        return name.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    /**
     * Returns the description for a report, falling back to its category label.
     *
     * @param {ReportItem} report Report item
     * @returns {string} Description text
     * @memberof AllReportsComponent
     */
    public reportDescription(report: ReportItem): string {
        return this.reportDescriptions[report?.name]?.description || this.categoryLabel(report);
    }

    /**
     * Returns the category label (e.g. "Sales Reports") for a given report.
     *
     * @param {ReportItem} report Report item
     * @returns {string} Category label suffixed with " Reports"
     * @memberof AllReportsComponent
     */
    public categoryLabel(report: ReportItem): string {
        const cat = this.categories().find(c => c.key !== 'all' && c.reports.includes(report.name));
        return cat ? `${cat.label} Reports` : 'Reports';
    }

    /**
     * Returns the category key for a report (drives per-category color accents).
     *
     * @param {ReportItem} report Report item
     * @returns {string} Category key or empty string
     * @memberof AllReportsComponent
     */
    public reportCategoryKey(report: ReportItem): string {
        const cat = this.categories().find(c => c.key !== 'all' && c.reports.includes(report?.name));
        return cat ? cat.key : '';
    }

    /**
     * Returns the category definition for a given category key.
     *
     * @param {string} report Category key
     * @returns {CategoryDefinition | undefined} Matching definition, if any
     * @memberof AllReportsComponent
     */
    public reportCategory(report: string): CategoryDefinition | undefined {
        return this.categories().find(c => c.key === report);
    }

    /**
     * Returns the icon (CSS class or SVG filename) for a report card.
     *
     * @param {ReportItem} report Report item
     * @returns {string} Icon identifier
     * @memberof AllReportsComponent
     */
    public categoryIcon(report: ReportItem): string {
        const meta = this.reportDescriptions[report?.name];
        if (meta?.icon) return meta.icon;
        const cat = this.categories().find(c => c.key !== 'all' && c.reports.includes(report.name));
        return cat ? cat.icon : 'icon-reports';
    }

    /**
     * Returns true when the icon value refers to an SVG asset filename.
     *
     * @param {string} icon Icon identifier
     * @returns {boolean} True if it ends with `.svg`
     * @memberof AllReportsComponent
     */
    public isSvgIcon(icon: string): boolean {
        return typeof icon === 'string' && icon.toLowerCase().endsWith('.svg');
    }

    /**
     * Checks if a report is currently marked as favorite.
     *
     * @param {ReportItem} report Report item
     * @returns {boolean} True if favorited
     * @memberof AllReportsComponent
     */
    public isFavorite(report: ReportItem): boolean {
        return this.favoriteSet().has(report.uniqueName);
    }

    /**
     * Toggles a report's favorite state and persists it to the API (with rollback on failure).
     *
     * @param {Event} event Originating DOM event (its propagation is stopped)
     * @param {ReportItem} report Report to toggle
     * @returns {void}
     * @memberof AllReportsComponent
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
     * Navigates to the report page derived from its `uniqueName` (path + optional query params).
     *
     * @param {ReportItem} report Report to open
     * @returns {void}
     * @memberof AllReportsComponent
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
