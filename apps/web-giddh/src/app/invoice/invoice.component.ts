import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject } from 'rxjs';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { VoucherTypeEnum } from '../models/api-models/Sales';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../services/general.service';

@Component({
    templateUrl: './invoice.component.html',
    styleUrls: [`./invoice.component.scss`]
})
export class InvoiceComponent implements OnInit, OnDestroy {
    /** Angular Material tab group reference for invoice navigation tabs */
    @ViewChild('staticTabs', { static: true }) public staticTabs: MatTabGroup;

    public selectedVoucherType: VoucherTypeEnum;
    public activeTab: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isMobileView = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will store screen size */
    public isMobileScreen: boolean = false;
    /** Stores the voucher API version of the company */
    public voucherApiVersion: 1 | 2;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _breakPointObservar: BreakpointObserver,
        private generalService: GeneralService
    ) {

        this._breakPointObservar.observe([
            '(max-width: 1023px)',
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result?.breakpoints['(max-width: 1023px)'];
            this.isMobileScreen = result?.breakpoints['(max-width: 767px)'];
        });
    }

    public ngOnInit() {
        combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                let params = result[0];
                let queryParams = result[1];

                if (params) {
                    if (params.voucherType) {
                        if (params.voucherType === 'sales' || params.voucherType === 'debit note' || params.voucherType === 'credit note') {
                            this.selectedVoucherType = params.voucherType;
                        } else if (params.selectedType && params.voucherType) {
                            this.selectedVoucherType = params.selectedType;
                        } else if (!params.selectedType && params.voucherType) {
                            this.selectedVoucherType = params.voucherType;
                        }
                    }
                }
                if (queryParams && queryParams.tab) {
                    if (queryParams.tab && queryParams.tabIndex) {
                        if (this.staticTabs) {
                            this.activeTab = null;
                            setTimeout(() => {
                                this.tabChanged(queryParams.tab, null);
                            }, 500);
                        }
                        this.tabChanged(queryParams.tab, null);
                    } else if (queryParams.tab) {
                        this.activeTab = queryParams.tab;
                    }
                } else {
                    this.activeTab = (params) ? params?.voucherType : "";
                }
            });
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.voucherApiVersion = this.generalService.voucherApiVersion;
            }
        });
    }

    public voucherChanged(tab: string) {
        this.selectedVoucherType = VoucherTypeEnum[tab];
    }

    /**
     *
     *
     * @param {string} tab  this is voucher type
     * @param {*} e   event to set last state
     * @param {string} [type]    selected type only to it for Cr/Dr and sales voucher(common tabs like pending, template and settings)
     * @memberof InvoiceComponent
     */
    /**
     * Handles tab change events from Angular Material tabs
     *
     * @public
     * @param {MatTabChangeEvent} event - Tab change event containing selected index
     * @param {string} tabsetType - Type of tabset ('debitCredit' or 'main')
     * @memberof InvoiceComponent
     */
    public onTabChange(event: MatTabChangeEvent, tabsetType: string): void {
        const tabIndex = event.index;
        let tabName: string;
        let type: string;
        
        if (tabsetType === 'debitCredit') {
            switch (tabIndex) {
                case 0:
                    tabName = 'debit note';
                    this.voucherChanged('debitNote');
                    break;
                case 1:
                    tabName = 'credit note';
                    this.voucherChanged('creditNote');
                    break;
                case 2:
                    tabName = 'pending';
                    type = 'debit note';
                    break;
                case 3:
                    tabName = 'templates';
                    type = 'debit note';
                    break;
                case 4:
                    tabName = 'settings';
                    type = 'debit note';
                    break;
                default:
                    tabName = 'debit note';
            }
        } else {
            switch (tabIndex) {
                case 0:
                    tabName = 'estimates';
                    this.voucherChanged('generateEstimate');
                    break;
                case 1:
                    tabName = 'proformas';
                    this.voucherChanged('generateProforma');
                    break;
                case 2:
                    tabName = 'sales';
                    this.voucherChanged('sales');
                    break;
                case 3:
                    tabName = 'recurring';
                    break;
                case 4:
                    tabName = 'pending';
                    type = 'sales';
                    break;
                case 5:
                    tabName = 'templates';
                    type = 'sales';
                    break;
                case 6:
                    tabName = 'settings';
                    type = 'sales';
                    break;
                default:
                    tabName = 'estimates';
            }
        }
        
        this.tabChanged(tabName, null, type);
    }
    
    /**
     * Gets the tab index based on active tab name and mat-tab-group type
     *
     * @public
     * @param {string} activeTab - Current active tab name
     * @param {string} matTabType - Type of mat-tab-group ('debitCredit' or 'main')
     * @returns {number} Tab index for Angular Material tabs
     * @memberof InvoiceComponent
     */
    public getTabIndex(activeTab: string, matTabType: string): number {
        if (matTabType === 'debitCredit') {
            switch (activeTab) {
                case 'debit note': return 0;
                case 'credit note': return 1;
                case 'pending': return 2;
                case 'templates': return 3;
                case 'settings': return 4;
                default: return 0;
            }
        } else {
            switch (activeTab) {
                case 'estimates': return 0;
                case 'proformas': return 1;
                case 'sales': return 2;
                case 'recurring': return 3;
                case 'pending': return 4;
                case 'templates': return 5;
                case 'settings': return 6;
                default: return 0;
            }
        }
    }
    
    public tabChanged(tab: string, e, type?: string) {
        this.activeTab = tab;
        if (type && tab) {
            this.router.navigate(['pages', 'invoice', 'preview', tab, type]);
        } else {
            this.router.navigate(['pages', 'invoice', 'preview', tab]);
        }
    }
    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof InvoiceComponent
     */
     public getPageHeading(): string {
        let pageHeading = "";

        if (this.isMobileScreen) {
            switch (this.activeTab) {
                case 'debit note':
                    pageHeading = this.localeData?.tabs?.debit_note;
                    break;
                case 'credit note':
                    pageHeading = this.localeData?.tabs?.credit_note;
                    break;
                case 'pending':
                    pageHeading = this.localeData?.tabs?.pending;
                    break;
                case 'templates':
                    pageHeading = this.localeData?.tabs?.templates;
                    break;
                case 'settings':
                    pageHeading = this.localeData?.tabs?.settings;
                    break;
                case 'estimates':
                    pageHeading = this.localeData?.tabs?.estimates;
                    break;
                case 'proformas':
                    pageHeading = this.localeData?.tabs?.proformas;
                    break;
                case 'invoice':
                    pageHeading = this.localeData?.tabs?.invoices;
                    break;
                case 'sales':
                    pageHeading = this.localeData?.tabs?.invoices;
                    break;
                case 'recurring':
                    pageHeading = this.localeData?.tabs?.recurring;
                    break;
            }
        }
        return pageHeading;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
