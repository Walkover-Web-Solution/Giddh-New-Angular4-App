import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CompanyActions } from '../actions/company.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { cloneDeep } from '../lodash-optimized';
import { StateDetailsRequest } from '../models/api-models/Company';
import { GeneralService } from '../services/general.service';
import { AllItem, ALL_ITEMS } from "../shared/helpers/allItems";
import { AppState } from '../store';

@Component({
    selector: 'all-giddh-item',
    templateUrl: './all-item.component.html',
    styleUrls: ['./all-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllGiddhItemComponent implements OnInit {
    /** Instance of search field */
    @ViewChild('searchField', { static: true }) public searchField: ElementRef;
    /** This will hold all menu items */
    public allItems: any[] = [];
    /** This will hold filtered items */
    public filteredItems: any[] = [];
    /** This will hold search string */
    public search: any;

    constructor(
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private groupWithAction: GroupWithAccountsAction,
        private store: Store<AppState>,
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnInit(): void {
        this.allItems = cloneDeep(ALL_ITEMS);
        this.filteredItems = this.allItems;
        this.searchField?.nativeElement?.focus();
        this.saveLastState();
    }

    /**
     * This will search the all items
     *
     * @param {*} search
     * @memberof AllGiddhItemComponent
     */
    public searchAllItems(search: any): void {
        this.filteredItems = [];

        if (search && search.trim()) {
            let loop = 0;
            let found = false;
            this.allItems.forEach((items) => {
                found = false;
                if (items.label.toLowerCase().includes(search.trim().toLowerCase())) {
                    if (this.filteredItems[loop] === undefined) {
                        this.filteredItems[loop] = [];
                    }

                    this.filteredItems[loop] = items;
                    found = true;
                } else {
                    let itemsFound = [];
                    items.items.forEach(item => {
                        if (item.label.toLowerCase().includes(search.trim().toLowerCase())) {
                            if (this.filteredItems[loop] === undefined) {
                                this.filteredItems[loop] = [];
                            }

                            itemsFound.push(item);
                            found = true;
                        }
                    });

                    if (itemsFound?.length > 0) {
                        this.filteredItems[loop] = { label: items.label, items: itemsFound };
                    }
                }
                if (found) {
                    loop++;
                }
            });
        } else {
            this.filteredItems = this.allItems;
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
