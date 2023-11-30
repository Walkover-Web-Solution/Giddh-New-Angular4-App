import { ALT, BACKSPACE, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from "@angular/cdk/keycodes";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { GeneralActions } from "apps/web-giddh/src/app/actions/general/general.actions";
import { GroupWithAccountsAction } from "apps/web-giddh/src/app/actions/groupwithaccounts.actions";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { remove } from "apps/web-giddh/src/app/lodash-optimized";
import { CommandKService } from "apps/web-giddh/src/app/services/commandk.service";
import { GeneralService } from "apps/web-giddh/src/app/services/general.service";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { ScrollComponent } from "apps/web-giddh/src/app/theme/command-k";
import { Observable, ReplaySubject, Subject, debounceTime, takeUntil } from "rxjs";

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
    // @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
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
        private store: Store<AppState>,
        private renderer: Renderer2,
        private zone: NgZone,
        private _generalService: GeneralService,
        private _commandKService: CommandKService,
        private _inventoryService: InventoryService,
        private _cdref: ChangeDetectorRef,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private generalAction: GeneralActions,
        private scrollDispatcher: ScrollDispatcher
    ) {
        this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$)).subscribe(res => {
            this.activeCompanyUniqueName = res;
        });
    }

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
            if(term){
                console.log("Search: ", term);
                this.apiRequestParams.page = 1;
                this.apiRequestParams.query = term;
                this.searchCommandK(true);
                this._cdref.markForCheck();
            }
        });

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            // console.log("scrollDispatcher", event);
            
            if (event && (event?.getDataLength() - event?.getRenderedRange().end) < 10 && !this.isLoading && (this.apiRequestParams.totalPages >= this.apiRequestParams.page )) {
                this.apiRequestParams.page++;
                this.getAPIData();
                // this.getAllInvoices(this.unpaidInvoiceListInput.accountUniqueName, this.unpaidInvoiceListInput.range);
            }
        });

        this.searchSubject.next("");
        document.querySelector("body")?.classList?.add("cmd-k");
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
        // if (event && (event.ctrlKey || event.metaKey)) {
        //     this.closeDailogEmitter.emit();
        //     return;
        // } else if (event && event.type === "click") {
        //     event.preventDefault();
        // }
        // emit data in case of direct A/c or Menus
        // if (!item.type || (item.type && (item.type === 'MENU' || item.type === 'ACCOUNT'))) {
        //     if (item.type === 'MENU') {
        //         item.uniqueName = item.route;
        //     }
        //     this.selectedItemEmitter.emit(item);
        // } else {
        //     // emit value for save data in db
        //     if (item.type === 'GROUP') {
        //         this.apiRequestParams.query = "";
        //         this.groupEmitter.emit(item);
        //     }

        //     try {
        //         this.listOfSelectedGroups.push(item);
        //     } catch (error) {
        //         this.listOfSelectedGroups = [];
        //         this.listOfSelectedGroups.push(item);
        //     }

        this.selectedItemEmitter.emit({ item: item, type: this.apiData?.type });
        this.searchEle.nativeElement.value = null;

        // set focus on search
        this.focusInSearchBox();
        this.searchCommandK(true);
        // }

    }

    /**
     * This function will get called if we want to create a/c or group
     *
     * @param {string} entity
     * @memberof AdvanceListItemsPopupComponent
     */
    public triggerAddManage(entity: string): void {
        if (this.listOfSelectedGroups?.length > 0) {
            this.newTeamCreationEmitter.emit([entity, this.listOfSelectedGroups[this.listOfSelectedGroups.length - 1]]);
        } else {
            this.newTeamCreationEmitter.emit([entity, ""]);
        }
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
                if (item.type === 'GROUP') {
                    this.searchedItems = [];
                }
            } else if (this.searchedItems && this.searchedItems.length === 1) {
                this.itemSelected(this.searchedItems[0]);
                if (item.type === 'GROUP') {
                    this.searchedItems = [];
                }
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

    private prevElem(index: number, d: any) {
        if (index < []?.length) {
            return [][index - 1];
        } else {
            return [][0];
        }
    }

    private nextElem(index: number, d: any) {
        if (index < []?.length) {
            return [][index + 1];
        } else {
            return [][0];
        }
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} e
     * @memberof AdvanceListItemsPopupComponent
     */
    public handleKeydown(e: any): void {
        let key = e.which || e.keyCode;

        if ((key === MAC_META || key === CONTROL) && (key === 75 || key === 71)) {
            alert("Close");
            this.closeDailogEmitter.emit();
        }

        if (key === TAB) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // prevent caret movement and animate selected element
        if (this.isOpen && [UP_ARROW, DOWN_ARROW]?.indexOf(key) !== -1 && this.virtualScrollElem) {
            console.log("arrow");

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
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o?.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
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

    // /**
    //  * This function get initialized on init and show selected item
    //  *
    //  * @param {*} item
    //  * @memberof AdvanceListItemsPopupComponent
    //  */
    // public handleHighLightedItemEvent(item: any): void {
    //     // no need to do anything in the function
    //     this.highlightedItem = item?.loop;
    // }

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
     * This function will load more records on scroll
     *
     * @param {*} event
     * @memberof AdvanceListItemsPopupComponent
     */
    // @HostListener('scroll', ['$event'])
    // onScroll(event: any) {
    //     // visible height + pixel scrolled >= total height - 200 (deducted 200 to load list little earlier before user reaches to end)
    //     if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 800)) {
    //         if (this.allowLoadMore && !this.isLoading) {
    //             if (this.apiRequestParams.page + 1 <= this.apiRequestParams.totalPages) {
    //                 this.apiRequestParams.page++;
    //                 this.searchCommandK(false);
    //             }
    //         }
    //     }
    // }

    // /**
    //  * This will return the last route name from the page route string
    //  *
    //  * @param {string} route
    //  * @returns {string}
    //  * @memberof AdvanceListItemsPopupComponent
    //  */
    // public getPageUniqueName(route: string): string {
    //     let string = route?.replace(/\s+/g, '-');
    //     string = string?.replace(/\//g, '-');
    //     string = string?.replace(/^-|-$/g, '');
    //     return string;
    // }

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

    public consoleData(data: any): void {
        console.log(data);
    }

    public getAPIData(search:string = ''): void {
        this.isLoading = true;
        console.log("this.apiRequestParams ", this.apiRequestParams);

        if(this.apiRequestParams.page === 1){
            this.searchedItems = [];
        }

        if (this.apiRequestParams?.type === 'users') {
            this._inventoryService.getFlattenAccountsList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                console.log("getFlattenAccountsList ", res);
                if (res) {
                    this.apiRequestParams.totalPages = res?.body?.totalPages;
                    let length = this.searchedItems ? this.searchedItems.length : 0;
                    let finalResult = [];
                    res?.body?.results.forEach((key, index) => {
                        key.loop = length + index;
                        finalResult.push(key);
                    });
                    this.searchedItems = this.searchedItems.concat(...finalResult);
                }
                this._cdref.detectChanges();

            });
        }
        if (this.apiRequestParams?.type === 'stocks') {
            this._inventoryService.getStockList(this.apiRequestParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                console.log("getStockList ", res);
                if (res) {
                    this.apiRequestParams.totalPages = res?.body?.totalPages;
                    let length = this.searchedItems ? this.searchedItems.length : 0;
                    let finalResult = [];
                    res?.body?.results.forEach((key, index) => {
                        key.loop = length + index;
                        finalResult.push(key);
                    });
                    this.searchedItems = this.searchedItems.concat(...finalResult);
                }
                this._cdref.detectChanges();
            })
        }
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof AdvanceListItemsPopupComponent
     */
    public ngOnDestroy(): void {
        document.querySelector("body")?.classList?.remove("cmd-k");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}