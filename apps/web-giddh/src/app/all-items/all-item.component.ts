import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GeneralActions } from '../actions/general/general.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { GstReport } from '../gst/constants/gst.constant';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { GstReconcileService } from '../services/GstReconcile.service';
import { AllItem } from '../shared/helpers/allItems';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { AppState } from '../store';

@Component({
    selector: 'all-giddh-item',
    templateUrl: './all-item.component.html',
    styleUrls: ['./all-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllGiddhItemComponent implements OnInit, OnDestroy {
    /** Instance of search field */
    @ViewChild('searchField', { static: true }) public searchField: ElementRef;
    /** This will hold all menu items */
    public allItems$: Observable<any[]> = of([]);
    /** This will hold filtered items */
    public filteredItems$: Observable<any[]> = of([]);
    /** This will hold search string */
    public search: any;
    /** Stores the current focused menu item index (on press of Tab key) */
    public menuIndex: number = -1;
    /** Stores the current focused sub-item index (on press of Tab key) */
    public itemIndex: number = -1;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Holds current date period for GST report */
    public currentPeriod: any = {};
    /** this is store actvie company gst number */
    public activeCompanyGstNumber: string;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private groupWithAction: GroupWithAccountsAction,
        private router: Router,
        private store: Store<AppState>,
        private gstReconcileService: GstReconcileService
    ) {

    }

    /**
     * Listens to tab and enter key event to focus the items and navigate
     *
     * @param {KeyboardEvent} event Keyboard event
     * @returns
     * @memberof AllGiddhItemComponent
     */
    @HostListener('document:keydown', ['$event'])
    public handleKeyboardUpEvent(event: KeyboardEvent) {
        let items = [];
        this.filteredItems$.pipe(take(1)).subscribe(filteredItems => {
            if (filteredItems) {
                items = filteredItems;
            }
        });
        if (event.key === 'Tab') {
            if (this.menuIndex === -1 || this.itemIndex === -1) {
                this.menuIndex = 0;
                this.itemIndex = 0;
                return;
            }
            if (event.shiftKey) {
                if (items?.length) {
                    if (items[this.menuIndex]?.items[this.itemIndex - 1]) {
                        this.itemIndex -= 1;
                    } else {
                        this.menuIndex = items[this.menuIndex - 1] ? this.menuIndex - 1 : 0;
                        this.itemIndex = items[this.menuIndex].items?.length - 1;
                    }
                } else {
                    this.menuIndex = 0;
                    this.itemIndex = 0;
                }
            } else {
                if (items?.length) {
                    if (items[this.menuIndex]?.items[this.itemIndex + 1]) {
                        this.itemIndex += 1;
                    } else {
                        this.menuIndex = items[this.menuIndex + 1] ? this.menuIndex + 1 : 0;
                        this.itemIndex = 0;
                    }
                } else {
                    this.menuIndex = 0;
                    this.itemIndex = 0;
                }
            }
            event.preventDefault();
            event.stopPropagation();
        }
        if (event.key === 'Enter' && this.menuIndex !== -1 && this.itemIndex !== -1) {
            const currentFocusedItem = items[this.menuIndex]?.items[this.itemIndex];
            if (currentFocusedItem?.link) {
                this.router.navigate([currentFocusedItem.link], { queryParams: currentFocusedItem.additional });
            } else {
                this.handleItemClick(currentFocusedItem);
            }
        }
    }

    /**
     * Initializes the component
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnInit(): void {
        this.loadTaxDetails();
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.currentPeriod = {
            from: dayjs().startOf('month').format(GIDDH_DATE_FORMAT),
            to: dayjs().endOf('month').format(GIDDH_DATE_FORMAT)
        };

        this.store.dispatch(this.generalActions.getSideMenuItems());
        this.searchField?.nativeElement?.focus();
    }

    /**
     * Releases the occupied memory
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will search the all items
     *
     * @param {*} search
     * @memberof AllGiddhItemComponent
     */
    public searchAllItems(search: any): void {
        this.filteredItems$ = of([]);
        let allItems = [];
        this.allItems$.pipe(take(1)).subscribe(items => allItems = items);
        if (search && search.trim()) {
            let loop = 0;
            let found = false;
            let filteredItems = [];
            allItems?.forEach((items) => {
                found = false;
                if (items?.label?.toLowerCase().includes(search?.trim()?.toLowerCase())) {
                    if (filteredItems[loop] === undefined) {
                        filteredItems[loop] = [];
                    }

                    filteredItems[loop] = items;
                    found = true;
                } else {
                    let itemsFound = [];
                    items?.items?.forEach(item => {
                        if (item?.label?.toLowerCase().includes(search?.trim()?.toLowerCase())) {
                            if (filteredItems[loop] === undefined) {
                                filteredItems[loop] = [];
                            }

                            itemsFound.push(item);
                            found = true;
                        }
                    });

                    if (itemsFound?.length > 0) {
                        filteredItems[loop] = { label: items.label, items: itemsFound };
                    }
                }
                if (found) {
                    loop++;
                }
            });
            this.filteredItems$ = of(filteredItems);
        } else {
            this.filteredItems$ = of(allItems);
        }
    }

    /**
     * Item click handler
     *
     * @param {AllItem} item Menu item
     * @memberof AllGiddhItemComponent
     */
    public handleItemClick(item: AllItem): void {
        if (item.label === this.commonLocaleData?.app_master) {
            this.store.dispatch(this.groupWithAction.OpenAddAndManageFromOutside(''));
        } else if (item?.additional?.isGstMenu === true) {
            this.navigate(item?.additional?.type);
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AllGiddhItemComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.store.pipe(select(appStore => appStore.general.menuItems), takeUntil(this.destroyed$)).subscribe(items => {
                if (items) {
                    this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(response => {
                        const allItems = this.generalService.getVisibleMenuItems("all-items", items, this.localeData?.items, response?.countryV2?.alpha2CountryCode);
                        this.allItems$ = of(allItems);
                        this.filteredItems$ = of(allItems);
                        this.changeDetectorRef.detectChanges();
                    });
                }
            });
        }
    }

    /**
     * Get tax numbers
     *
     * @memberof AllGiddhItemComponent
     */
    public loadTaxDetails(): void {
        this.activeCompanyGstNumber = "";
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                let taxes = response.body;
                if (taxes?.length === 1) {
                    this.activeCompanyGstNumber = taxes[0];
                }
            }
        });
    }

    /**
    * This is navigate menu item
    *
    * @param {string} type Type of GST module
    * @memberof AllGiddhItemComponent
    */
    public navigate(type: string): void {
        if (this.activeCompanyGstNumber) {
            switch (type) {
                case GstReport.Gstr1: case GstReport.Gstr2:
                    this.navigateToOverview(type);
                    break;
                case GstReport.Gstr3b:
                    this.navigateToGstR3B(type);
                    break;
                default: break;
            }
        } else {
            this.router.navigate(['pages', 'gstfiling']);
        }
    }

    /**
     * This will navigate to Gstr1/Gstr2 report
     *
     * @param {string} type
     * @memberof AllGiddhItemComponent
     */
    public navigateToOverview(type: string): void {
        this.router.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * This will navigate to Gstr3b report
     *
     * @param {string} type
     * @memberof AllGiddhItemComponent
     */
    public navigateToGstR3B(type: string): void {
        this.router.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }
}
