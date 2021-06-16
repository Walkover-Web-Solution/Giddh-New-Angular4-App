import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
import { GstReport } from '../../gst/constants/gst.constant';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { VAT_SUPPORTED_COUNTRIES } from '../../app.constant';

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

    constructor(
        private router: Router,
        private generalService: GeneralService,
        private store: Store<AppState>
    ) { }

    /**
     * Initializes the component
     *
     * @memberof TaxSidebarComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if(this.vatSupportedCountries.includes(activeCompany.countryV2?.alpha2CountryCode)) {
                    this.showVatMenus = true;
                    this.showGstMenus = false;
                } else {
                    this.showGstMenus = true;
                    this.showVatMenus = false;
                }
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
    * This is navigate menu item
    *
    * @param {string} type Type of GST module
    * @memberof TaxSidebarComponent
    */
    public navigate(type: string): void {
        this.selectedGstModule = type;
        this.navigateEvent.emit(type);
    }

}
