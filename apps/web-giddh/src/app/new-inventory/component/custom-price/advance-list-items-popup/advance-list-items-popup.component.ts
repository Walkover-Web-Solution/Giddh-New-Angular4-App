import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, Input, EventEmitter } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW, BACKSPACE, TAB } from '@angular/cdk/keycodes';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";

const DIRECTIONAL_KEYS = [UP_ARROW, DOWN_ARROW];
const SPECIAL_KEYS = [UP_ARROW, DOWN_ARROW, TAB, ENTER, ESCAPE, BACKSPACE];

@Component({
    selector: "items-list-popup",
    templateUrl: "./advance-list-items-popup.component.html",
    styleUrls: ["./advance-list-items-popup.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdvanceListItemsPopupComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('mainEle', { static: true }) public mainEle: ElementRef;
    @ViewChild('searchEle', { static: false }) public searchEle: ElementRef;
    @ViewChild('searchWrapEle', { static: true }) public searchWrapEle: ElementRef;
    @ViewChild('wrapper', { static: true }) public wrapper: ElementRef;
    @ViewChild('virtualScrollViewport', { static: false }) public virtualScrollViewport: CdkVirtualScrollViewport;

    @Input() public preventOutSideClose: boolean = false;
    @Input() public dontShowNoResultMsg: boolean = false;
    @Input() public showChannelCreateBtn: boolean = true;
    @Input() public apiData: any = {};
    @Input() public isOpen: boolean = true;
    @Input() public setParentWidth: boolean = false;
    @Input() public parentEle: any;
    @Input() public ItemHeight: number = 52;
    @Input() public ItemWidth: number = 300;
    @Input() public visibleItems: number = 10;
    
    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public closeDailogEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    private searchSubject: Subject<string> = new Subject();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public searchedItems: any[] = [];
    public listOfSelectedGroups: any[] = [];
    public noResultsFound: boolean = false;
    public highlightedItem: number = 0;
    public allowLoadMore: boolean = false;
    public isLoading: boolean = false;
    private isInitialized: boolean = false;
    private lastScrollTop: number = 0;
    public activeCompanyUniqueName: any = '';
    public apiRequestParams: any = {
        page: 1,
        query: '',
        group: '',
        type: '',
        count: PAGINATION_LIMIT,
        totalPages: 1
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private inventoryService: InventoryService,
        private _cdref: ChangeDetectorRef
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public ngOnInit(): void {
        this.apiRequestParams = {
            type: this.apiData?.type,
            group: this.apiData?.group,
            page: this.apiData?.page,
            count: this.apiData?.count,
            totalPages: 1
        };
        // listen on input for search
        this.searchSubject.pipe(
            debounceTime(300), 
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((term: string) => {
            this.apiRequestParams.page = 1;
            this.apiRequestParams.query = term;
            this.searchItems(true);
            this._cdref.markForCheck();
        });
        
        // Initialize search only once
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.searchSubject.next("");
        }
    }

    /**
     * This function gets called after view initializes and will
     * set focus in search box and will call function to adjust the width of container
     * @memberof AdvanceListItemsPopupComponent
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInSearchBox();
            this.doingUIErrands();
        }, 0);
    }

    /**
     * This function will check wrapper and parent element and then call function to set the width of container
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public doingUIErrands(): void {
        if (this.wrapper && this.parentEle) {
            this.initSetParentWidth();
        }
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function sets the width of container inside the modal
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public initSetParentWidth(): void {
        if (this.setParentWidth && this.mainEle && this.parentEle) {
            const box = this.parentEle.getBoundingClientRect();
            this.ItemWidth = Math.max(box.width, this.ItemWidth);
            
            if (this.mainEle?.nativeElement) {
                this.mainEle.nativeElement.style.width = `${box.width}px`;
            }
            if (this.searchWrapEle?.nativeElement) {
                this.searchWrapEle.nativeElement.style.width = `${box.width}px`;
            }
            if (this.wrapper?.nativeElement && box.width > 300) {
                this.wrapper.nativeElement.classList.add('wider');
            }
        }
    }

    /**
     * This function will get called if any item get selected
     *
     * @param {*} item
     * @memberof AdvanceListItemsPopupComponent
     */
    public itemSelected(item: any, event?: any): void {              
        if (event && (event.ctrlKey || event.metaKey)){
            this.closeDailogEmitter.emit();
            return ;
        } else if(event && event.type === "click"){
            event.preventDefault();
        }
        
        this.selectedItemEmitter.emit({ item: item, type: this.apiData?.type });
        if (this.searchEle?.nativeElement) {
            this.searchEle.nativeElement.value = null;
        }
    }

    /**
     * This function will call the api to search items
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public searchItems(resetItems: boolean): void | boolean {
        if (this.isLoading) {
            return false;
        }

        if (resetItems) {
            this.searchedItems = [];
            this.lastScrollTop = 0; // Reset scroll position for new search
        }

        this.isLoading = true;

        if (this.apiRequestParams?.type === 'users') {
            this.inventoryService.getFlattenAccountsList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;

                if (res && res.body && res.body.results && res.body.results.length > 0) {
                    // Create new array reference for proper change detection
                    this.searchedItems = [...(this.searchedItems || []), ...res.body.results];
                    
                    if (this.apiRequestParams.page === 1) {
                        this.highlightedItem = 0;
                    }
                    this.noResultsFound = false;
                    this.apiRequestParams.totalPages = res.body.totalPages;
                    // Only allow load more if there are more pages available
                    this.allowLoadMore = this.apiRequestParams.page < this.apiRequestParams.totalPages;

                    // Force change detection and viewport refresh
                    this._cdref.detectChanges();
                    
                    // Refresh virtual scroll viewport if available
                    setTimeout(() => {
                        // Preserve scroll position when loading more data (not initial search)
                        const preservePosition = this.apiRequestParams.page > 1;
                        this.refreshVirtualScrollViewport(preservePosition);
                        this._cdref.detectChanges();
                    }, 0);
                } else {
                    if (this.searchedItems?.length === 0) {
                        this.noResultsFound = true;
                        this.allowLoadMore = false;
                    }
                    this._cdref.detectChanges();
                }

                this.initSetParentWidth();
            });
        } else if (this.apiRequestParams?.type === 'stocks') {
            this.inventoryService.getStockList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;

                if (res && res.body && res.body.results && res.body.results.length > 0) {
                    // Create new array reference for proper change detection
                    this.searchedItems = [...(this.searchedItems || []), ...res.body.results];
                    
                    if (this.apiRequestParams.page === 1) {
                        this.highlightedItem = 0;
                    }
                    this.noResultsFound = false;
                    this.apiRequestParams.totalPages = res.body.totalPages;
                    // Only allow load more if there are more pages available
                    this.allowLoadMore = this.apiRequestParams.page < this.apiRequestParams.totalPages;

                    // Force change detection and viewport refresh
                    this._cdref.detectChanges();
                    
                    // Refresh virtual scroll viewport if available
                    setTimeout(() => {
                        // Preserve scroll position when loading more data (not initial search)
                        const preservePosition = this.apiRequestParams.page > 1;
                        this.refreshVirtualScrollViewport(preservePosition);
                        this._cdref.detectChanges();
                    }, 0);
                } else {
                    if (this.searchedItems?.length === 0) {
                        this.noResultsFound = true;
                        this.allowLoadMore = false;
                    }
                    this._cdref.detectChanges();
                }

                this.initSetParentWidth();
            });
        }
    }

    /**
     * This function will get called if pressed enter on any item
     *
     * @private
     * @memberof AdvanceListItemsPopupComponent
     */
    private captureValueFromList(): void {
        if (this.searchedItems && this.searchedItems.length > 0) {
            let item = this.searchedItems[this.highlightedItem] || this.searchedItems[0];
            if (item) {
                this.itemSelected(item);
            }
        }
    }

    /**
     * This function will set the list to open on focus of search box
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleFocus(): void {
        this.isOpen = true;
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} e
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleKeydown(e: any): void {
        let key = e.which || e.keyCode;

        if (key === TAB) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // prevent caret movement and handle keyboard navigation
        if (this.isOpen && [UP_ARROW, DOWN_ARROW]?.indexOf(key) !== -1) {
            e.preventDefault();
            this.handleKeyboardNavigation(key);
        }

        if (this.isOpen && (key === ENTER)) {
            e.preventDefault();
            e.stopPropagation();
            this.captureValueFromList();
        }

        // closing list on esc press
        if (key === ESCAPE) {
            if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                // first escape
                if (this.searchEle?.nativeElement?.value) {
                    this.searchEle.nativeElement.value = null;
                } else {
                    // second time pressing escape
                    this.removeItemFromSelectedGroups();
                }
            }
        }

        if (this.isOpen && key === BACKSPACE) {
            if (!this.searchEle?.nativeElement?.value && this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
                this.removeItemFromSelectedGroups();
            }
        }
    }

    /**
     * This function will remove the selected groups in decending order
     * if we press backspace in search box
     * @param {*} [item]
     * @memberof AdvanceListItemsPopupComponent
     */
    public removeItemFromSelectedGroups(item?: any): void {
        if (item) {
            this.listOfSelectedGroups = this.listOfSelectedGroups.filter(o => item.uniqueName !== o?.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
    }

    /**
     * Handles keyboard navigation for up/down arrows
     *
     * @param {number} key - The key code (UP_ARROW or DOWN_ARROW)
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleKeyboardNavigation(key: number): void {
        if (!this.searchedItems || this.searchedItems.length === 0) {
            return;
        }

        if (key === UP_ARROW) {
            this.highlightedItem = this.highlightedItem > 0 ? this.highlightedItem - 1 : this.searchedItems.length - 1;
        } else if (key === DOWN_ARROW) {
            this.highlightedItem = this.highlightedItem < this.searchedItems.length - 1 ? this.highlightedItem + 1 : 0;
        }

        // Scroll to the highlighted item
        if (this.virtualScrollViewport) {
            this.virtualScrollViewport.scrollToIndex(this.highlightedItem, 'smooth');
        }

        this.handleHighLightedItemEvent(this.searchedItems[this.highlightedItem]);
    }

    /**
     * This function will init search on keyup of search box
     *
     * @param {KeyboardEvent} e
     * @param {string} term
     * @returns {void}
     * @memberof AdvanceListItemsPopupComponent
     */
    public initSearch(e: KeyboardEvent, term: string): void {
        let key = e.which || e.keyCode;
        // preventing search operation on arrows key
        if (this.isOpen && SPECIAL_KEYS?.indexOf(key) !== -1) {
            return;
        }
        
        term = term ? term.trim() : "";
        
        // Only emit if term is different from current query to prevent duplicates
        if (this.apiRequestParams.query !== term) {
            this.searchSubject.next(term);
        }
    }

    /**
     * This function puts the focus in search box
     *
     * @param {KeyboardEvent} [e]
     * @memberof AdvanceListItemsPopupComponent
     */
    public focusInSearchBox(e?: KeyboardEvent): void {
        if (this.searchEle) {
            this.searchEle.nativeElement.focus();
        }
    }

    /**
     * This function get initialized on init and show selected item
     *
     * @param {*} item
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleHighLightedItemEvent(item: any): void {
        // Update highlighted item index based on the item
        if (item && this.searchedItems) {
            const index = this.searchedItems.findIndex(searchItem => searchItem === item);
            if (index !== -1) {
                this.highlightedItem = index;
            }
        }
    }

    /**
     * This function returns the uniquename of item
     *
     * @param {*} index
     * @param {*} item
     * @returns uniqueName
     * @memberof AdvanceListItemsPopupComponent
     */
    public trackByFn(index: number, item: any) {
        // Use a combination of uniqueName and index for better tracking
        const trackId = item?.uniqueName || `item-${index}`;
        return trackId;
    }

    /**
     * Handles item hover
     */
    public onItemHover(index: number): void {
        this.highlightedItem = index;
    }

    /**
     * Handles item leave
     */
    public onItemLeave(): void {
        // Keep the highlighted item for keyboard navigation
    }

    /**
     * Handles item click
     */
    public onItemClick(item: any, event: Event): void {
        this.itemSelected(item, event);
    }

    /**
     * Handles scroll index change for CDK virtual scroll
     *
     * @param {number} index
     * @memberof AdvanceListItemsPopupComponent
     */
    public onScrolledIndexChange(index: number): void {
        // Load more data when approaching the end
        const threshold = 3; // Load more when 3 items from the end
        if (this.searchedItems && index >= this.searchedItems.length - threshold && this.allowLoadMore && !this.isLoading) {
            this.loadMoreData();
        }
    }

    /**
     * Handles viewport scroll event for infinite loading
     *
     * @param {Event} event
     * @memberof AdvanceListItemsPopupComponent
     */
    public onViewportScroll(event: Event): void {
        const element = event.target as HTMLElement;
        const threshold = 200; // Load more when 200px from bottom
        
        // Track current scroll position
        this.lastScrollTop = element.scrollTop;
        
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold && this.allowLoadMore && !this.isLoading) {
            this.loadMoreData();
        }
    }

    /**
     * Loads more data if conditions are met
     *
     * @private
     * @memberof AdvanceListItemsPopupComponent
     */
    private loadMoreData(): void {

        if (this.allowLoadMore && !this.isLoading) {
            if (this.apiRequestParams.page < this.apiRequestParams.totalPages) {
                this.apiRequestParams.page++;
                this.searchItems(false);
            }
        }
    }

    /**
     * This will return the last route name from the page route string
     *
     * @param {string} route
     * @returns {string}
     * @memberof AdvanceListItemsPopupComponent
     */
    public getPageUniqueName(route: string): string {
        let string = route?.replace(/\s+/g, '-');
        string = string?.replace(/\//g, '-');
        string = string?.replace(/^-|-$/g, '');
        return string;
    }

    /**
     * This will search after paste
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public onPasteInSearch(): void {
        setTimeout(() => {
            if (this.searchEle && this.searchEle.nativeElement) {
                let term = this.searchEle.nativeElement?.value;
                term = (term) ? term.trim() : "";
                this.searchSubject.next(term);
            }
        }, 100);
    }

    // ===== NEW CDK VIRTUAL SCROLL METHODS =====

    /**
     * Gets the viewport height for virtual scroll
     */
    public getViewportHeight(): number {
        if (!this.searchedItems || this.searchedItems.length === 0) {
            return this.ItemHeight;
        }
        const itemCount = Math.min(this.searchedItems.length, this.visibleItems);
        const height = itemCount * this.ItemHeight;
        
        
        return height;
    }

    /**
     * Gets the href for an item
     */
    public getItemHref(item: any): string | null {
        return (item.type === 'MENU' || item.type === 'ACCOUNT') ? item.route : null;
    }

    /**
     * Gets the icon class for an item type
     */
    public getItemIconClass(type: string): string {
        switch (type) {
            case 'MENU':
                return 'icon-bar';
            case 'GROUP':
                return 'icon-group-folder';
            default:
                return 'icon-account';
        }
    }

    /**
     * Gets the ID for an item
     */
    public getItemId(item: any): string {
        const type = item.type?.toLowerCase() || 'item';
        const identifier = item.type === 'MENU' ? this.getPageUniqueName(item.route) : item?.uniqueName;
        return `${type}-${identifier}`;
    }

    /**
     * Refreshes the virtual scroll viewport while preserving scroll position
     */
    private refreshVirtualScrollViewport(preserveScrollPosition: boolean = false): void {
        if (this.virtualScrollViewport) {
            // Use tracked scroll position or get current position
            const currentScrollTop = preserveScrollPosition ? 
                (this.lastScrollTop || this.virtualScrollViewport.getElementRef().nativeElement.scrollTop) : 0;
            
            this.virtualScrollViewport.checkViewportSize();
            
            // Don't reset the rendered range when loading more data
            if (!preserveScrollPosition) {
                const itemCount = Math.min(this.searchedItems?.length || 0, this.visibleItems);
                this.virtualScrollViewport.setRenderedRange({ start: 0, end: itemCount });
            }
            
            this._cdref.detectChanges();
            
            // Restore scroll position if needed (with slight delay for DOM updates)
            if (preserveScrollPosition && currentScrollTop > 0) {
                setTimeout(() => {
                    if (this.virtualScrollViewport) {
                        this.virtualScrollViewport.getElementRef().nativeElement.scrollTop = currentScrollTop;
                        // Update tracked position
                        this.lastScrollTop = currentScrollTop;
                    }
                }, 50);
            }
        }
    }
}
