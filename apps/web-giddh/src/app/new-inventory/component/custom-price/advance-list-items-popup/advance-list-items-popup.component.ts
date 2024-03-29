import { ALT, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ReplaySubject, Subject, debounceTime, takeUntil } from "rxjs";
import { ScrollComponent } from "./virtual-scroll/vscroll";

const DIRECTIONAL_KEYS = [
    LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
];
const SPECIAL_KEYS = [...DIRECTIONAL_KEYS, CAPS_LOCK, TAB, SHIFT, CONTROL, ALT, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, MAC_META];

@Component({
    selector: "items-list-popup",
    templateUrl: "./advance-list-items-popup.component.html",
    styleUrls: ["./advance-list-items-popup.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceListItemsPopupComponent implements OnInit, OnDestroy {
    @ViewChild('mainEle', { static: true }) public mainEle: ElementRef;
    @ViewChild('searchEle', { static: false }) public searchEle: ElementRef;
    @ViewChild('searchWrapEle', { static: true }) public searchWrapEle: ElementRef;
    @ViewChild('wrapper', { static: true }) public wrapper: ElementRef;
    @ViewChild(ScrollComponent, { static: false }) public virtualScrollElem: ScrollComponent;

    @Input() public preventOutSideClose: boolean = false;
    @Input() public dontShowNoResultMsg: boolean = false;
    @Input() public showChannelCreateBtn: boolean = true;
    @Input() public apiData: any = {};
    @Input() public isOpen: boolean = true;
    @Input() public defaultExcludedTags: string = 'input, button, .searchEle, .modal-content, .modal-backdrop';
    @Input() public placement: string;
    @Input() public setParentWidth: boolean = false;
    @Input() public parentEle: any;
    @Input() public ItemHeight: number = 38;
    @Input() public ItemWidth: number = 300;
    @Input() public visibleItems: number = 14;

    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public closeDailogEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public noResultFoundEmitter: EventEmitter<any> = new EventEmitter<null>();
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    private searchSubject: Subject<string> = new Subject();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public searchedItems: any[] = [];
    public listOfSelectedGroups: any[] = [];
    public noResultsFound: boolean = false;
    public highlightedItem: number = 0;
    public allowLoadMore: boolean = false;
    public isLoading: boolean = false;
    public activeCompanyUniqueName: any = '';
    public apiRequestParams: any = {
        page: 1,
        query: '',
        group: '',
        type: '',
        count: PAGINATION_LIMIT
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private renderer: Renderer2,
        private zone: NgZone,
        private inventoryService: InventoryService,
        private cdref: ChangeDetectorRef
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
            count: this.apiData?.count
        };
        // listen on input for search
        this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroyed$)).subscribe(term => {
            this.apiRequestParams.page = 1;
            this.apiRequestParams.query = term;
            this.searchItems(true);
            this.cdref.markForCheck();
        });

        this.searchSubject.next("");
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
        this.zone.runOutsideAngular(() => {
            if (this.wrapper && this.parentEle) {
                this.initSetParentWidth();
            }
        });
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
        if (this.setParentWidth && this.mainEle) {
            let box: any = this.parentEle.getBoundingClientRect();
            this.ItemWidth = (box.width > this.ItemWidth) ? box.width : this.ItemWidth;
            this.renderer.setStyle(this.mainEle?.nativeElement, 'width', `${box.width}px`);
            if (this.searchWrapEle) {
                this.renderer.setStyle(this.searchWrapEle?.nativeElement, 'width', `${box.width}px`);
            }
            if (box.width > 300) {
                this.renderer.setStyle(this.wrapper?.nativeElement, 'wider', true);
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
        this.selectedItemEmitter.emit({ item: item, type: this.apiData?.type });
        this.searchEle.nativeElement.value = null;
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
        }

        this.isLoading = true;

        if (this.apiRequestParams?.type === 'users') {
            this.inventoryService.getFlattenAccountsList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;

                if (res && res.body && res.body.results && res.body.results.length > 0) {
                    let length = (this.searchedItems) ? this.searchedItems.length : 0;
                    res.body.results.forEach((key, index) => {
                        key.loop = length + index;
                        this.searchedItems.push(key);
                    });
                    this.highlightedItem = 0;
                    this.noResultsFound = false;
                    this.allowLoadMore = true;
                    this.apiRequestParams.totalPages = res.body.totalPages;
                    this.cdref.detectChanges();
                } else {
                    if (this.searchedItems?.length === 0) {
                        this.noResultsFound = true;
                        this.allowLoadMore = false;
                    }
                    this.cdref.detectChanges();
                }

                this.initSetParentWidth();

                if (this.virtualScrollElem) {
                    let item = this.virtualScrollElem.directionToll(40);
                    if (item) {
                        this.refreshToll(item, 40);
                    }
                }
            });
        } else if (this.apiRequestParams?.type === 'stocks') {
            this.inventoryService.getStockList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;

                if (res && res.body && res.body.results && res.body.results.length > 0) {
                    let length = (this.searchedItems) ? this.searchedItems.length : 0;
                    res.body.results.forEach((key, index) => {
                        key.loop = length + index;
                        this.searchedItems.push(key);
                    });
                    this.highlightedItem = 0;
                    this.noResultsFound = false;
                    this.allowLoadMore = true;
                    this.apiRequestParams.totalPages = res.body.totalPages;
                    this.cdref.detectChanges();
                } else {
                    if (this.searchedItems?.length === 0) {
                        this.noResultsFound = true;
                        this.allowLoadMore = false;
                    }
                    this.cdref.detectChanges();
                }

                this.initSetParentWidth();

                if (this.virtualScrollElem) {
                    let item = this.virtualScrollElem.directionToll(40);
                    if (item) {
                        this.refreshToll(item, 40);
                    }
                }
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
        if (this.virtualScrollElem) {
            let item = this.virtualScrollElem.activeItem();
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

        // prevent caret movement and animate selected element
        if (this.isOpen && [UP_ARROW, DOWN_ARROW]?.indexOf(key) !== -1 && this.virtualScrollElem) {
            e.preventDefault();
            let item = this.virtualScrollElem.directionToll(key);
            if (item) {
                this.refreshToll(item, key);
            }
        }

        if (this.isOpen && (key === ENTER)) {
            e.preventDefault();
            e.stopPropagation();
            this.captureValueFromList();
        }
    }

    /**
     * This function calls the function to refresh the scroll view
     *
     * @param {*} item
     * @param {number} [key]
     * @memberof AdvanceListItemsPopupComponent
     */
    public refreshToll(item: any, key?: number): void {
        if (key === UP_ARROW) {
            this.refreshScrollView(item, 'UP');
        } else {
            this.refreshScrollView(item);
        }
    }

    /**
     * This function refreshes the scroll view
     *
     * @param {*} item
     * @param {string} [direction]
     * @memberof AdvanceListItemsPopupComponent
     */
    public refreshScrollView(item: any, direction?: string): void {
        if (item) {
            this.virtualScrollElem.scrollInto(item, direction);
            this.virtualScrollElem.startupLoop = true;
            this.virtualScrollElem.refresh();
        }
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
        term = term.trim();
        this.searchSubject.next(term);
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
        // no need to do anything in the function
        this.highlightedItem = item?.loop;
    }

    /**
     * This function returns the uniquename of item
     *
     * @param {*} index
     * @param {*} item
     * @returns uniqueName
     * @memberof AdvanceListItemsPopupComponent
     */
    public trackByFn(index, item: any) {
        return item?.uniqueName; // unique id corresponding to the item
    }

    /**
     * This function is used to highlight the hovered item
     *
     * @param {number} index
     * @memberof AdvanceListItemsPopupComponent
     */
    public highlightItem(index: number) {
        this.highlightedItem = index;
        this.searchedItems.forEach(searchItem => searchItem.isHilighted = false);
        this.searchedItems[index].isHilighted = true;
    }

    /**
     * This function is used to unhighlight the selected item
     *
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public unhighlightItem() {
        this.highlightedItem = -1;
    }

    /**
     * This function will load more records on scroll
     *
     * @param {*} event
     * @memberof AdvanceListItemsPopupComponent
     */
    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        // visible height + pixel scrolled >= total height - 200 (deducted 200 to load list little earlier before user reaches to end)
        if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 800)) {
            if (this.allowLoadMore && !this.isLoading) {
                if (this.apiRequestParams.page + 1 <= this.apiRequestParams.totalPages) {
                    this.apiRequestParams.page++;
                    this.searchItems(false);
                }
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
}