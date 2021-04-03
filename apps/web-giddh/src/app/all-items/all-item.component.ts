import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../actions/company.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { ALL_ITEMS, AllItem } from '../shared/helpers/allItems';
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
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private groupWithAction: GroupWithAccountsAction,
        private store: Store<AppState>
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(appStore => appStore.general.menuItems), takeUntil(this.destroyed$)).subscribe(items => {
            if (items) {
                const allItems = this.generalService.getVisibleMenuItems(items, ALL_ITEMS, this.generalService.currentOrganizationType === OrganizationType.Branch);
                this.allItems$ = of(allItems);
                this.filteredItems$ = of(allItems);
                this.changeDetectorRef.detectChanges();
            }
        });
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
        if (item.label === 'Master') {
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
}
