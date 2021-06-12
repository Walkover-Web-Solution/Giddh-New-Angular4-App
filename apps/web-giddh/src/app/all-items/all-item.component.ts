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
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { GeneralService } from '../services/general.service';
import { AllItem } from '../shared/helpers/allItems';
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

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private groupWithAction: GroupWithAccountsAction,
        private router: Router,
        private store: Store<AppState>
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
                if (items.length) {
                    if (items[this.menuIndex].items[this.itemIndex - 1]) {
                        this.itemIndex -= 1;
                    } else {
                        this.menuIndex = items[this.menuIndex - 1] ? this.menuIndex - 1 : 0;
                        this.itemIndex = items[this.menuIndex].items.length - 1;
                    }
                } else {
                    this.menuIndex = 0;
                    this.itemIndex = 0;
                }
            } else {
                if (items.length) {
                    if (items[this.menuIndex].items[this.itemIndex + 1]) {
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
            if (currentFocusedItem) {
                this.router.navigate([currentFocusedItem.link], { queryParams: currentFocusedItem.additional });
            }
        }
    }

    /**
     * Initializes the component
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.generalActions.getSideMenuItems());
        this.searchField?.nativeElement?.focus();
        this.saveLastState();
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
            allItems.forEach((items) => {
                found = false;
                if (items.label.toLowerCase().includes(search.trim().toLowerCase())) {
                    if (filteredItems[loop] === undefined) {
                        filteredItems[loop] = [];
                    }

                    filteredItems[loop] = items;
                    found = true;
                } else {
                    let itemsFound = [];
                    items.items.forEach(item => {
                        if (item.label.toLowerCase().includes(search.trim().toLowerCase())) {
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
        }
    }

    /**
     * Saves the last state
     *
     * @private
     * @memberof AllGiddhItemComponent
     */
    private saveLastState(): void {
        let state = 'giddh-all-items';
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = this.generalService.companyUniqueName;
        stateDetailsRequest.lastState = `/pages/${state}`;

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
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
                    const allItems = this.generalService.getVisibleMenuItems("all-items", items, this.localeData?.items);
                    this.allItems$ = of(allItems);
                    this.filteredItems$ = of(allItems);
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }
}
