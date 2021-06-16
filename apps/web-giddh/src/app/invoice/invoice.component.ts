import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { CompanyActions } from '../actions/company.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { VoucherTypeEnum } from '../models/api-models/Sales';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../services/general.service';
@Component({
    templateUrl: './invoice.component.html',
    styleUrls: [`./invoice.component.scss`]
})
export class InvoiceComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;

    public selectedVoucherType: VoucherTypeEnum;
    public activeTab: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isMobileView = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will store screen size */
    public isMobileScreen: boolean = false;
    /** True, if company supports new voucher version */
    public isNewVoucherVersion: boolean;

    constructor(private store: Store<AppState>,
        private companyActions: CompanyActions,
        private router: Router, private _activatedRoute: ActivatedRoute, private _breakPointObservar: BreakpointObserver,
        private generalService: GeneralService) {

        this._breakPointObservar.observe([
            '(max-width: 1023px)',
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result?.breakpoints['(max-width: 1023px)'];
            this.isMobileScreen = result?.breakpoints['(max-width: 767px)'];
        });
    }

    public ngOnInit() {
        this.isNewVoucherVersion = this.generalService.voucherApiVersion === 2;
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
                        if (this.staticTabs && this.staticTabs.tabs) {
                            /*
                              set active tab to null because we want to reload the tab component
                              case :-
                                      when invoice preview details is on then if someone clicks on sidemenu or navigate using cmd + g then we need to
                                      reload the component
                             */
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
                    this.activeTab = (params) ? params.voucherType : "";
                }
            });
    }

    public voucherChanged(tab: string) {
        this.selectedVoucherType = VoucherTypeEnum[tab];
    }

    /**
     * Saves the last state
     */
    public ngAfterViewInit(): void {
        this.saveLastState(this.activeTab);
    }

    /**
     *
     *
     * @param {string} tab  this is voucher type
     * @param {*} e   event to set last state
     * @param {string} [type]    selected type only to it for Cr/Dr and sales voucher(common tabs like pending, template and settings)
     * @memberof InvoiceComponent
     */
    public tabChanged(tab: string, e, type?: string) {
        this.activeTab = tab;
        if (type && tab) {
            this.router.navigate(['pages', 'invoice', 'preview', tab, type]);
        } else {
            this.router.navigate(['pages', 'invoice', 'preview', tab]);
        }
        if (e && !e.target) {
            this.saveLastState(tab);
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
                case 'pending':
                    pageHeading = this.localeData?.tabs?.pending;
                    break;
                case 'templates':
                    pageHeading = this.localeData?.tabs?.templates;
                    break;
                case 'settings':
                    pageHeading = this.localeData?.tabs?.settings;
                    break;
            }
        }
        return pageHeading;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private saveLastState(state: string) {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `pages/invoice/preview/${state}/${this.selectedVoucherType !== state ? this.selectedVoucherType : ''}`;

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}
