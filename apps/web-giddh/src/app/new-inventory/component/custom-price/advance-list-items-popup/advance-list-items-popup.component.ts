import { ALT, BACKSPACE, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from "@angular/cdk/keycodes";
import { CdkVirtualScrollViewport, ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ReplaySubject, Subject, debounceTime, takeUntil } from "rxjs";

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
    /** Holds Main element Reference */
    @ViewChild('mainEle', { static: true }) public mainEle: ElementRef;
    /** Holds Search element Reference */
    @ViewChild('searchEle', { static: false }) public searchEle: ElementRef;
    /** Holds Search wrapper element Reference */
    @ViewChild('searchWrapEle', { static: true }) public searchWrapEle: ElementRef;
    /** Holds Main dailog Wrapper element Reference */
    @ViewChild('wrapper', { static: true }) public wrapper: ElementRef;
    /** Holds CdkVirtualScrollViewport Reference */
    @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

    @Input() public preventOutSideClose: boolean = false;
    @Input() public dontShowNoResultMsg: boolean = false;
    @Input() public isOpen: boolean = true;
    @Input() public defaultExcludedTags: string = 'input, button, .searchEle, .modal-content, .modal-backdrop';
    @Input() public placement: string;
    @Input() public setParentWidth: boolean = false;
    @Input() public parentEle: any;
    @Input() public ItemHeight: number = 52;
    @Input() public ItemWidth: number = 300;
    @Input() public visibleItems: number = 10;
    @Input() public apiData: any = {};
    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public closeDailogEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public noResultFoundEmitter: EventEmitter<any> = new EventEmitter<null>();
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    /** Holds Search string */
    private searchSubject: Subject<string> = new Subject();
    /** This is used to destroy all subscribed observables and subjects */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds API results */
    public searchedItems: any[] = [];
    /** if api result empty */
    public noResultsFound: boolean = false;
    /** Holds index of item highlighted on hover */
    public highlightedItem: number = 0;
    /** API Loading status */
    public isLoading: boolean = false;
    /** Holds model info to call API */
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
        private cdref: ChangeDetectorRef,
        private scrollDispatcher: ScrollDispatcher
    ) { }

    /**
     * Lifecycle hook for init component
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
        this.getAPIData();
        // listen on input for search
        this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroyed$)).subscribe(term => {
            if (term) {
                this.apiRequestParams.page = 1;
                this.apiRequestParams.query = term;
                this.searchCommandK(true);
                this.cdref.markForCheck();
            }
        });

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event && (event?.getDataLength() - event?.getRenderedRange().end) < 10 && !this.isLoading && (this.apiRequestParams.totalPages > this.apiRequestParams.page)) {
                this.apiRequestParams.page++;
                this.getAPIData();
            }
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
        // set focus on search
        this.focusInSearchBox();
        this.searchCommandK(true);
    }


    /**
     * This function will call the api to search items
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public searchCommandK(resetItems: boolean): void | boolean {
        if (this.isLoading) {
            return false;
        }
        if (resetItems && this.apiRequestParams?.query) {
            this.searchedItems = [];
            this.getAPIData();
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

    /**
     * This will Call API to get All Customer/Vendor or Stock
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public getAPIData(): void {
        this.isLoading = true;
        if (this.apiRequestParams.page === 1) {
            this.searchedItems = [];
        }
        if (this.apiRequestParams?.type === 'users') {
            this.inventoryService.getFlattenAccountsList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                if (res && res?.body?.results.length) {
                    this.apiRequestParams.totalPages = res?.body?.totalPages;
                    let length = this.searchedItems ? this.searchedItems.length : 0;
                    let finalResult = [];
                    res?.body?.results.forEach((key, index) => {
                        key.loop = length + index;
                        finalResult.push(key);
                    });
                    this.searchedItems = this.searchedItems.concat(...finalResult);
                }
                else if (this.apiRequestParams.page === 1) {
                    this.noResultsFound = true;
                }
                this.cdref.detectChanges();

            });
        }
        if (this.apiRequestParams?.type === 'stocks') {
            this.inventoryService.getStockList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                if (res && res?.body?.results.length) {
                    this.apiRequestParams.totalPages = res?.body?.totalPages;
                    let length = this.searchedItems ? this.searchedItems.length : 0;
                    let finalResult = [];
                    res?.body?.results.forEach((key, index) => {
                        key.loop = length + index;
                        finalResult.push(key);
                    });
                    this.searchedItems = this.searchedItems.concat(...finalResult);
                } else {
                    this.noResultsFound = true;
                }
                this.cdref.detectChanges();
            })
        }
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} event
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleKeydown(event: any): void {
        let key = event.which || event.keyCode;
        if (this.highlightedItem >= -1 && this.searchedItems.length > this.highlightedItem) {
            if (this.isOpen && key === 40) {
                event.preventDefault();
                if ((this.searchedItems.length - 1) > this.highlightedItem) {
                    this.highlightedItem++;
                    if (this.highlightedItem > 5) {
                        this.searchedItems.forEach(searchItem => searchItem.isHilighted = false);
                        this.scroll(this.highlightedItem - 4);
                    }
                }
            }
            if (this.isOpen && key === 38) {
                event.preventDefault();
                if (this.highlightedItem > 0) {
                    this.highlightedItem--;
                    if (this.highlightedItem > 5 && this.highlightedItem < (this.searchedItems.length - 1)) {
                        this.searchedItems.forEach(searchItem => searchItem.isHilighted = false);
                        this.scroll(this.highlightedItem - 4);
                    }
                }
            }
            if (this.isOpen && key === 13) {
                event.preventDefault();
                this.itemSelected(this.searchedItems[this.highlightedItem]);
            }
        }
    }

    /**
    * This scroll cdk-scoll at given index
    *
    * @param {number} scrollIndex
    * @memberof AdvanceListItemsPopupComponent
    */
    private scroll(scrollIndex: number) {
        if (!this.isLoading) {
            this.viewPort.scrollToIndex(scrollIndex, 'smooth');
        }
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}