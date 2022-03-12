import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
import { GstReport } from '../../gst/constants/gst.constant';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import { GstReconcileService } from '../../services/GstReconcile.service';
import { OrganizationType } from '../../models/user-login-state';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import * as moment from 'moment';

@Component({
    selector: 'tax-sidebar',
    templateUrl: './tax-sidebar.component.html',
    styleUrls: ['tax-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaxSidebarComponent implements OnInit, OnDestroy {
    /** this is store mobile screen boolean value */
    public isMobileScreen: boolean = true;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** this is store navigate event */
    @Output() public navigateEvent: EventEmitter<string> = new EventEmitter();
    /** this is store actvie company gst number */
    @Input() public activeCompanyGstNumber: string;
    /** Stores the selected GST module */
    @Input() public selectedGstModule: string = 'dashboard';
    /** True if tax sidebar is included on gst module */
    @Input() public isGstModule: boolean = false;
    /** True if month filter is selected */
    @Input() public isMonthSelected: boolean;

    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if we need to show GST menus */
    public showGstMenus: boolean = false;
    /** True if we need to show VAT menus */
    public showVatMenus: boolean = false;
    /* This will hold list of vat supported countries */
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Holds current date period for GST report */
    public currentPeriod: any = {};
    /** Observable to get current GST period  */
    public getCurrentPeriod$: Observable<any> = of(null);

    constructor(
        private router: Router,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private gstReconcileService: GstReconcileService,
        private changeDetectionRef: ChangeDetectorRef
    ) { }

    /**
     * Initializes the component
     *
     * @memberof TaxSidebarComponent
     */
    public ngOnInit(): void {
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.getCurrentPeriod$ = this.store.pipe(select(store => store.gstR.currentPeriod), take(1));

        this.loadTaxDetails();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (this.vatSupportedCountries.includes(activeCompany.countryV2?.alpha2CountryCode)) {
                    this.showVatMenus = true;
                    this.showGstMenus = false;
                } else {
                    this.showGstMenus = true;
                    this.showVatMenus = false;
                }
            }
        });

        this.getCurrentPeriod$.subscribe(period => {
            if (period && period.from) {
                const date = {
                    startDate: moment(period.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                    endDate: moment(period.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
                };
                if (date.startDate === period.from && date.endDate === period.to) {
                    this.isMonthSelected = true;
                } else {
                    this.isMonthSelected = false;
                }
                this.currentPeriod = {
                    from: period.from,
                    to: period.to
                };
            } else {
                this.currentPeriod = {
                    from: moment().startOf('month').format(GIDDH_DATE_FORMAT),
                    to: moment().endOf('month').format(GIDDH_DATE_FORMAT)
                };
                this.isMonthSelected = true;
            }
        });
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof TaxSidebarComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
    * This will close the settings popup if clicked outside and is mobile screen
    *
    * @param {*} [event]
    * @memberof TaxSidebarComponent
    */
    public closeAsidePaneIfMobile(event?): void {
        if (this.isMobileScreen && event && event.target.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        }
    }

    /**
    * This will navigate the user to previous page
    *
    * @memberof TaxSidebarComponent
    */
    public goToPreviousPage(): void {
        if (this.generalService.getSessionStorage("previousPage") && !this.router.url.includes("/dummy")) {
            this.router.navigateByUrl(this.generalService.getSessionStorage("previousPage"));
        } else {
            this.router.navigate(['/pages/home']);
        }
    }

    /**
     * Get tax numbers
     *
     * @memberof TaxSidebarComponent
     */
    public loadTaxDetails(): void {
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                const taxes = response.body;
                if(!this.activeCompanyGstNumber && taxes?.length === 1) {
                    this.activeCompanyGstNumber = taxes[0];
                }
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
    * This is navigate menu item
    *
    * @param {string} type Type of GST module
    * @memberof TaxSidebarComponent
    */
    public navigate(type: string): void {
        this.selectedGstModule = type;

        if (this.isGstModule) {
            this.navigateEvent.emit(type);
        } else {
            switch (type) {
                case GstReport.Gstr1: case GstReport.Gstr2:
                    this.navigateToOverview(type);
                    break;
                case GstReport.Gstr3b:
                    this.navigateToGstR3B(type);
                    break;
                default: break;
            }
        }
    }

    /**
     * This will navigate to Gstr1/Gstr2 report
     *
     * @param {string} type
     * @memberof TaxSidebarComponent
     */
    public navigateToOverview(type: string): void {
        this.router.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * This will navigate to Gstr3b report
     *
     * @param {string} type
     * @memberof TaxSidebarComponent
     */
    public navigateToGstR3B(type: string): void {
        this.router.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }
}
