import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { allItems } from "../shared/helpers/allItems";

@Component({
    selector: 'all-giddh-item',
    templateUrl: './all-item.component.html',
    styleUrls: ['./all-item.component.scss'],

})

export class AllGiddhItemComponent implements OnInit {
    /** Instance of search field */
    @ViewChild('searchField', {static: true}) public searchField: ElementRef;
    /** This will hold all menu items */
    public allItems: any[] = [];
    /** This will hold filtered items */
    public filteredItems: any[] = [];
    /** This will hold search string */
    public search: any;
    
    constructor() {

    }

    /**
     * Initializes the component
     *
     * @memberof AllGiddhItemComponent
     */
    public ngOnInit(): void {
        if(allItems) {
            let loop = 0;
            Object.keys(allItems).forEach(key => {
                this.allItems[loop] = [];
                this.allItems[loop]['label'] = Object.keys(allItems[key])[0];
                this.allItems[loop]['items'] = allItems[key][this.allItems[loop]['label']];
                loop++;
            });

            this.filteredItems = this.allItems;
        }
        this.searchField?.nativeElement?.focus();
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

                    if(itemsFound?.length > 0) {
                        this.filteredItems[loop] = {label: items.label, items: itemsFound};
                    }
                }
                if(found) {
                    loop++;
                }
            });
        } else {
            this.filteredItems = this.allItems;
        }
    }
}
