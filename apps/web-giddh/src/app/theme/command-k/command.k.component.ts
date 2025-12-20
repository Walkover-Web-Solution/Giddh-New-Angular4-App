import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, Input, EventEmitter } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW, BACKSPACE, TAB, RIGHT_ARROW, LEFT_ARROW, CAPS_LOCK, SHIFT, CONTROL, ALT, MAC_WK_CMD_LEFT, MAC_META, MAC_WK_CMD_RIGHT } from '@angular/cdk/keycodes';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GeneralService } from '../../services/general.service';
import { CommandKService } from '../../services/commandk.service';
import { CommandKRequest } from '../../models/api-models/Common';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { findIndex, indexOf, remove } from '../../lodash-optimized';

const DIRECTIONAL_KEYS = [
    LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
];

const SPECIAL_KEYS = [...DIRECTIONAL_KEYS, CAPS_LOCK, TAB, SHIFT, CONTROL, ALT, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, MAC_META];

@Component({
    selector: 'command-k',
    standalone: false,
    styleUrls: ['./command.k.component.scss'],
    templateUrl: './command.k.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandKComponent implements OnInit, OnDestroy, AfterViewInit {

    /** Reference to the main element. */
    @ViewChild('mainEle', { static: true }) public mainEle: ElementRef;
    /** Reference to the search input element. */
    @ViewChild('searchEle', { static: false }) public searchEle: ElementRef;
    /** Reference to the search wrapper element. */
    @ViewChild('searchWrapEle', { static: true }) public searchWrapEle: ElementRef;
    /** Reference to the wrapper element. */
    @ViewChild('wrapper', { static: true }) public wrapper: ElementRef;
    /** Reference to the CDK virtual scroll viewport. */
    @ViewChild('virtualScrollViewport', { static: false }) public virtualScrollViewport: CdkVirtualScrollViewport;

    /** Prevents closing the popup when clicking outside. */
    @Input() public preventOutSideClose: boolean = false;
    /** Prevents showing the 'No Results Found' message. */
    @Input() public dontShowNoResultMsg: boolean = false;
    /** Determines if the create channel button is shown. */
    @Input() public showChannelCreateBtn: boolean = true;

    /** Controls the visibility of the popup. */
    @Input() public isOpen: boolean = true;
    /** If true, sets the width of the popup to match the parent element. */
    @Input() public setParentWidth: boolean = false;
    /** Reference to the parent element for width calculation. */
    @Input() public parentEle: any;
    /** Height of each item in the list. */
    @Input() public ItemHeight: number = 52;
    /** Width of each item in the list. */
    @Input() public ItemWidth: number = 300;
    /** Number of items visible in the viewport. */
    @Input() public visibleItems: number = 10;

    /** Emits the selected item. */
    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    /** Emits when the dialog is closed. */
    @Output() public closeDailogEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    /** Emits the selected group. */
    @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
    /** Emits when a new team creation is requested. */
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    /** Subject for handling search input with debounce. */
    private searchSubject: Subject<string> = new Subject();
    /** ReplaySubject to signal component destruction. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** Array of items returned from the search. */
    public searchedItems: any[] = [];
    /** List of currently selected groups. */
    public listOfSelectedGroups: any[] = [];
    /** True if no results are found from the search. */
    public noResultsFound: boolean = false;
    /** Index of the currently highlighted item in the list. */
    public highlightedItem: number = 0;
    /** True if more items can be loaded. */
    public allowLoadMore: boolean = false;
    /** True if a data loading operation is in progress. */
    public isLoading: boolean = false;
    /** True if the component has been initialized. */
    private isInitialized: boolean = false;
    /** Stores the last scroll top position. */
    private lastScrollTop: number = 0;
    /** Unique name of the active company. */
    public activeCompanyUniqueName: any = '';
    /** Parameters for Command-K API requests. */
    public commandKRequestParams: CommandKRequest = {
        page: 1,
        q: '',
        group: '',
        totalPages: 1,
        isMobile: false
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        private commandKService: CommandKService,
        private changeDetection: ChangeDetectorRef,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private generalAction: GeneralActions
    ) {
        this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$)).subscribe(res => {
            this.activeCompanyUniqueName = res;
        });
    }

    /**
     * Initializes the component
     *
     * @memberof CommandKComponent
     */
    public ngOnInit(): void {
        // listen on input for search
        this.searchSubject.pipe(
            debounceTime(300),
            takeUntil(this.destroyed$)
        ).subscribe((term: string) => {
            this.commandKRequestParams.page = 1;
            this.commandKRequestParams.q = term;
            this.searchCommandK(true);
            this.changeDetection.markForCheck();
        });

        document.querySelector("body")?.classList?.add("cmd-k");

        // Initialize search only once
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.searchSubject.next("");
        }
    }

    /**
     * This function gets called after view initializes and will
     * set focus in search box and will call function to adjust the width of container
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
     */
    public doingUIErrands(): void {
        if (this.wrapper && this.parentEle) {
            this.initSetParentWidth();
        }
    }

    /**
     * Closes Master Page
     *
     * @memberof CommandKComponent
     */
    public closeMaster(): void {
        this.store.dispatch(this.generalAction.addAndManageClosed());
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        document.querySelector('body')?.classList?.remove('master-page');
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof CommandKComponent
     */
    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("cmd-k");
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * This function sets the width of container inside the modal
     *
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
     */
    public itemSelected(item: any, event?:any): void {
        if (event && (event.ctrlKey || event.metaKey)){
            this.closeDailogEmitter.emit();
            return ;
        }else if(event && event.type ==="click"){
            event.preventDefault();
        }
       // emit data in case of direct A/c or Menus
        if (!item.type || (item.type && (item.type === 'MENU' || item.type === 'ACCOUNT'))) {
            if (item.type === 'MENU') {
                item.uniqueName = item.route;
            }
            this.selectedItemEmitter.emit(item);
        } else {
            // emit value for save data in db
            if (item.type === 'GROUP') {
                this.commandKRequestParams.q = "";
                this.groupEmitter.emit(item);
            }

            try {
                this.listOfSelectedGroups.push(item);
            } catch (error) {
                this.listOfSelectedGroups = [];
                this.listOfSelectedGroups.push(item);
            }

            this.searchEle.nativeElement.value = null;

            // set focus on search
            this.focusInSearchBox();
            this.searchCommandK(true);
        }
        this.closeMaster();
    }

    /**
     * This function will get called if we want to create a/c or group
     *
     * @param {string} entity
     * @memberof CommandKComponent
     */
    public triggerAddManage(entity: string): void {
        if(this.listOfSelectedGroups?.length > 0) {
            this.newTeamCreationEmitter.emit([entity, this.listOfSelectedGroups[this.listOfSelectedGroups.length - 1]]);
        } else {
            this.newTeamCreationEmitter.emit([entity, ""]);
        }
    }

    /**
     * This function will call the api to search items
     *
     * @memberof CommandKComponent
     */
    public searchCommandK(resetItems: boolean): void | boolean {
        if (this.isLoading) {
            return false;
        }

        if (resetItems) {
            this.searchedItems = [];
            this.lastScrollTop = 0; // Reset scroll position for new search
        }

        this.isLoading = true;

        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            let lastGroup = this.generalService.getLastElement(this.listOfSelectedGroups);
            this.commandKRequestParams.group = lastGroup?.uniqueName;
        } else {
            this.commandKRequestParams.group = "";
        }

        this.commandKService.searchCommandK(this.commandKRequestParams, this.activeCompanyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;

            if (res && res.body && res.body.results && res.body.results.length > 0) {

                // Create new array reference for proper change detection
                this.searchedItems = [...(this.searchedItems || []), ...res.body.results];

                if (this.commandKRequestParams.page === 1) {
                    this.highlightedItem = 0;
                }
                this.noResultsFound = false;
                this.commandKRequestParams.totalPages = res.body.totalPages;
                // Only allow load more if there are more pages available
                this.allowLoadMore = this.commandKRequestParams.page < this.commandKRequestParams.totalPages;


                // Force change detection and viewport refresh
                this.changeDetection.detectChanges();

                // Refresh virtual scroll viewport if available
                setTimeout(() => {
                    // Preserve scroll position when loading more data (not initial search)
                    const preservePosition = this.commandKRequestParams.page > 1;
                    this.refreshVirtualScrollViewport(preservePosition);
                    this.changeDetection.detectChanges();
                }, 0);
            } else {
                if (this.searchedItems?.length === 0) {
                    this.noResultsFound = true;
                    this.allowLoadMore = false;
                }
                this.changeDetection.detectChanges();
            }

            this.initSetParentWidth();
        });
    }

    /**
     * This function will get called if pressed enter on any item
     *
     * @private
     * @memberof CommandKComponent
     */
    private captureValueFromList(): void {
        if (this.searchedItems && this.searchedItems.length > 0) {
            let item = this.searchedItems[this.highlightedItem] || this.searchedItems[0];
            if (item) {
                this.itemSelected(item);
                if (item.type === 'GROUP') {
                    this.searchedItems = [];
                }
            }
        }
    }

    /**
     * This function will set the list to open on focus of search box
     *
     * @memberof CommandKComponent
     */
    public handleFocus(): void {
        this.isOpen = true;
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} e
     * @memberof CommandKComponent
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
                    // reset search/query and refresh results when clearing via ESC
                    this.searchSubject.next("");
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
     * @memberof CommandKComponent
     */
    public removeItemFromSelectedGroups(item?: any): void {
        if (item) {
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o?.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
        this.searchSubject.next("");
    }

    /**
     * Handles keyboard navigation for up/down arrows
     *
     * @param {number} key - The key code (UP_ARROW or DOWN_ARROW)
     * @memberof CommandKComponent
     */
    public handleKeyboardNavigation(key: number): void {
        if (!this.virtualScrollViewport || !this.searchedItems || this.searchedItems.length === 0) {
            return;
        }

        const viewport = this.virtualScrollViewport.getElementRef().nativeElement;
        const scrollTop = viewport.scrollTop; // current scroll position
        const itemHeight = this.ItemHeight;

        // Number of items currently hidden above the viewport
        const itemsAbove = Math.ceil(scrollTop / itemHeight);
        const visibleItems = Math.ceil(viewport.clientHeight / itemHeight); // number of items visible in viewport

        // Update highlighted item
        if (key === DOWN_ARROW) {
            this.highlightedItem = Math.min(this.highlightedItem + 1, this.searchedItems.length - 1);
        } else if (key === UP_ARROW) {
            this.highlightedItem = Math.max(this.highlightedItem - 1, 0);
        }

        let targetIndex = itemsAbove;

        // If highlighted item is above viewport, scroll up
        if (this.highlightedItem < itemsAbove) {
            targetIndex = this.highlightedItem;
        }
        // If highlighted item is below viewport, scroll down
        else if (this.highlightedItem >= itemsAbove + visibleItems) {
            targetIndex = this.highlightedItem - visibleItems + 1;
        }
        this.virtualScrollViewport.scrollToIndex(targetIndex, 'instant');
    }

    /**
     * This function will init search on keyup of search box
     *
     * @param {KeyboardEvent} e
     * @param {string} term
     * @returns {void}
     * @memberof CommandKComponent
     */
    public initSearch(e: KeyboardEvent, term: string): void {
        let key = e.which || e.keyCode;
        // preventing search operation on arrows key
        if (this.isOpen && SPECIAL_KEYS?.indexOf(key) !== -1) {
            return;
        }

        term = term ? term.trim() : "";

        // Only emit if term is different from current query to prevent duplicates
        if (this.commandKRequestParams.q !== term) {
            this.searchSubject.next(term);
        }
    }

    /**
     * This function puts the focus in search box
     *
     * @param {KeyboardEvent} [e]
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
     */
    public trackByFn(index: number, item: any) {
        // Use a combination of uniqueName and index for better tracking
        const trackId = item?.uniqueName || `item-${index}`;
        return trackId;
    }


    /**
     * Handles scroll index change for CDK virtual scroll
     *
     * @param {number} index
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
     */
    private loadMoreData(): void {

        if (this.allowLoadMore && !this.isLoading) {
            if (this.commandKRequestParams.page < this.commandKRequestParams.totalPages) {
                this.commandKRequestParams.page++;
                this.searchCommandK(false);
            }
        }
    }

    /**
     * This will return the last route name from the page route string
     *
     * @param {string} route
     * @returns {string}
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
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
     * Handles item mouse move
     */
    public onItemMouseMove(index: number): void {
        this.highlightedItem = index;
    }

    /**
     * Handles item click
     */
    public onItemClick(item: any, event: Event): void {
        this.itemSelected(item, event);
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

            this.changeDetection.detectChanges();

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

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
