import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, Renderer, SimpleChanges, ViewChild } from '@angular/core';
import { ScrollComponent } from '../virtual-scroll/vscroll';
import { UniversalSearchService, WindowRefService } from '../service';
import { ReplaySubject, Subject } from 'rxjs';
import { cloneDeep, find, findIndex, remove, uniq } from '../../../lodash-optimized';
import { IUlist } from '../../../models/interfaces/ulist.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ALT, BACKSPACE, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { DbService } from '../../../services/db.service';
import { DEFAULT_MENUS } from '../../../models/defaultMenus';

const KEY_FOR_QUERY = 'query';
const DIRECTIONAL_KEYS = [
    LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
];

const SPECIAL_KEYS = [...DIRECTIONAL_KEYS, CAPS_LOCK, TAB, SHIFT, CONTROL, ALT, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, MAC_META
];

// local memory
const LOCAL_MEMORY = {
    charCount: null,
    filteredData: new Map()
};

@Component({
    selector: 'universal-data-list',
    styleUrls: ['./data.list.component.scss'],
    templateUrl: './data.list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @ViewChild('mainEle') public mainEle: ElementRef;
    @ViewChild('searchEle') public searchEle: ElementRef;
    @ViewChild('searchWrapEle') public searchWrapEle: ElementRef;
    @ViewChild('wrapper') public wrapper: ElementRef;
    @ViewChild(ScrollComponent) public virtualScrollElem: ScrollComponent;

    // bot related
    @Input() public preventOutSideClose: boolean = false;
    @Input() public dontShowNoResultMsg: boolean = false;
    @Input() public showChannelCreateBtn: boolean = true;

    // positioning
    @Input() public placement: string;
    @Input() public setParentWidth: boolean = false;
    @Input() public autoFocus: boolean = true;
    @Input() public forceSetAutoFocus: boolean;
    @Input() public forcekey: number;
    @Input() public isFlying: boolean = true;

    /**
     * for hide dropdown on click outside
     * consume comma separated list of tags, classes, ids
     */
    @Input() public listOfTagsWhichHasToExclude: string;
    @Input() public defaultExcludedTags: string = 'input, button, .searchEle, .modal-content, .modal-backdrop';

    // ui related
    @Input() public isOpen: boolean = false;
    @Input() public isMultiple: boolean = false;
    @Input() public ItemHeight: number = 50;
    @Input() public ItemWidth: number = 300;
    // to search bar
    @Input() public searchBoxPlaceholder: string = 'Search...';
    @Input() public visibleItems: number = 10;
    // here will not need to add nativeElement in parent
    @Input() public parentEle: any;

    // broadcasting events
    @Output() public closeEmitter: EventEmitter<boolean | any> = new EventEmitter<boolean | any>();
    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public noResultFoundEmitter: EventEmitter<any> = new EventEmitter<null>();
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    // for setting value in bot input
    @Input() public botValue: string;

    public listOfSelectedGroups: IUlist[];
    public rows: any[] = null;
    public rowsClone: any[] = [];
    public viewPortItems: any[];
    public defaultViewPortItems: any[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private rawSmartComboList: IUlist[] = [];
    private smartList: IUlist[];
    private activeCompany: string;
    private searchSubject: Subject<string> = new Subject();
    private firstTime: boolean = true;
    public close() {
        this.closeEmitter.emit(true);
    }

    constructor(
        private _store: Store<AppState>,
        private renderer: Renderer,
        private zone: NgZone,
        private winRef: WindowRefService,
        private _dbService: DbService,
        private _cdref: ChangeDetectorRef,
        private universalSearchService: UniversalSearchService
    ) {
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {

        // listen on input for searc
        this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
            this.handleSearch(term);
            this._cdref.markForCheck();
        });

        // listen for companies and active company
        this._store.select(p => p.session.companyUniqueName).pipe(take(1)).subscribe((name) => {
            this.activeCompany = name;
        });

        // listen to smart list
        this._store.select(p => p.general.smartCombinedList).pipe(takeUntil(this.destroyed$))
            .subscribe((data: IUlist[]) => {
                if (data) {
                    this.rawSmartComboList = data;
                }
            });

        // listen to smart list
        this._store.select(p => p.general.smartList).pipe(takeUntil(this.destroyed$))
            .subscribe((data: IUlist[]) => {
                if (data) {
                    this.smartList = data;

                    if (this.firstTime) {
                        // init rows
                        this.defaultViewPortItems = DEFAULT_MENUS;
                        this.setValueInRow(DEFAULT_MENUS);
                    }
                    this.firstTime = false;
                }
            });

        // set excluded tags
        if (this.listOfTagsWhichHasToExclude) {
            this.defaultExcludedTags = `${this.defaultExcludedTags}, ${this.listOfTagsWhichHasToExclude}`;
        }

        // due to view init issue using timeout
        setTimeout(() => {
            this.handleClickOnSearchWrapper();
        }, 0);

    }

    // handle mouse event
    public handleMouseEvent(e: any, item: any) {
        this.viewPortItems.forEach(p => p.isHilighted = false);
        item.isHilighted = true;
        // logic to get index by id
        if (item) {
            let idx = findIndex(this.rows, (i => {
                return i.uniqueName === item.uniqueName;
            }));
            if (idx !== -1) {
                this.virtualScrollElem.setLastItemIndex(idx);
            }
        }
    }

    public triggerAddManage() {
        this.newTeamCreationEmitter.emit(true);
    }

    // get initialized on init and return selected item
    public handleHighLightedItemEvent(item: any) {
        // do the thing
    }

    // to hide dropdown on outside click
    public handleOutSideClick(e: any) {
        // if (this.isOpen) {
        //   this.closeEmitter.emit(true);
        //   this.hide();
        // }
    }

    /**
     * if isMultiple then don't close. instead of closing scroll to the item and add class to item
     * @param item
     * closing the dialog after item is selected and other utility is done
     * emit the selected data in both format conditionally [] | {}
     */
    public itemSelected(item: any) {
        this.emitData(item);
    }

    // a toll to add condition before calling final func
    public refreshToll(item: any, key?: number) {
        if (key === UP_ARROW) {
            this.refreshScrollView(item, 'UP');
        } else {
            this.refreshScrollView(item);
        }
    }

    public refreshScrollView(item: any, direction?: string) {
        if (item) {
            this.virtualScrollElem.scrollInto(item, direction);
            this.virtualScrollElem.startupLoop = true;
            this.virtualScrollElem.refresh();
        }
    }

    // getting data from vscroll and assigning data to local var.
    public checkItems(event: { items: any[]; idx: number; }) {
        this.viewPortItems = event.items;
    }

    /**
     * watching over some keys to update UI on data basis
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        // listen for force auto focus
        // if ('forceSetAutoFocus' in changes && changes.forceSetAutoFocus.currentValue) {
        // this.setFocusOnList(this.forcekey);
        // }
    }

    /**
     * function will be used to set element liquid width.
     * according to parent width.
     */
    public setParentWidthFunc() {
        if (this.setParentWidth && this.mainEle) {
            let box: any = this.parentEle.getBoundingClientRect();
            this.ItemWidth = (box.width > this.ItemWidth) ? box.width : this.ItemWidth;
            this.renderer.setElementStyle(this.mainEle.nativeElement, 'width', `${box.width}px`);
            if (this.searchWrapEle) {
                this.renderer.setElementStyle(this.searchWrapEle.nativeElement, 'width', `${box.width}px`);
            }
            if (box.width > 300) {
                this.renderer.setElementClass(this.wrapper.nativeElement, 'wider', true);
            }
        }
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            // set focus conditionally
            if (this.autoFocus) {
                this.handleClickOnSearchWrapper();
            }
            this.doingUIErrands();
        }, 0);
    }

    public doingUIErrands() {
        this.zone.runOutsideAngular(() => {
            if (this.wrapper && this.parentEle) {
                this.setParentWidthFunc();
            }
        });
    }

    // search box related funcs

    // does force reset the cursor to input
    public handleClickOnSearchWrapper(e?: KeyboardEvent) {
        if (this.searchEle) {
            this.searchEle.nativeElement.focus();
        }
    }

    public handleFocus() {
        this.isOpen = true;
    }

    /**
     * main func works after list get focused
     * @param e: KeyBoardEvent
     */
    public onKeydownHandlerOfListEle(e) {
        let key = e.which || e.keyCode;
        if (this.isOpen && DIRECTIONAL_KEYS.indexOf(key) !== -1) {
            e.preventDefault();
            this.refreshToll(this.virtualScrollElem.directionToll(key), key);
        }
        if (this.isOpen && (key === ENTER)) {
            e.preventDefault();
            let item = this.virtualScrollElem.activeItem();
            if (item) {
                this.itemSelected(item);
            }
        }
    }

    /**
     * will be called from search input keydown
     * @param e an event from search input.
     * checking for keys for animation scrolling purpose.
     * checking for enter for capture value.
     */
    public handleKeydown(e: any) {
        let key = e.which || e.keyCode;

        if (key === TAB) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }

        // prevent caret movement and animate selected element
        if (this.isOpen && [UP_ARROW, DOWN_ARROW].indexOf(key) !== -1 && this.virtualScrollElem) {
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
                if (this.searchEle.nativeElement.value) {
                    this.searchEle.nativeElement.value = null;
                } else {
                    // second time pressing escape
                    this.removeItemFromSelectedGroups();
                }
                this.doConditionalSearch();
            }
        }
    }

    public search(e: KeyboardEvent, term: string) {
        let key = e.which || e.keyCode;
        // preventing search operation on arrows key
        if (this.isOpen && SPECIAL_KEYS.indexOf(key) !== -1) {
            return;
        }
        term = term.trim();
        this.searchSubject.next(term);
        if (term === '' || term.length === 0) {
            if (this.isOpen && key === BACKSPACE) {
                e.preventDefault();
                e.stopPropagation();

                // remove item one by one on pressing backspace like gmail
                if (this.listOfSelectedGroups && this.listOfSelectedGroups.length) {
                    if (!LOCAL_MEMORY.charCount) {
                        this.removeItemFromSelectedGroups();
                    }
                    if (LOCAL_MEMORY.charCount === 1) {
                        LOCAL_MEMORY.charCount = null;
                    }
                    // logic search
                    this.doConditionalSearch();
                } else {
                    this.viewPortItems = this.defaultViewPortItems;
                    //this.updateRowsViaSearch(cloneDeep(this.smartList));
                }
            }
        }
    }

    /**
     * will be called from search input keyup
     * @param e an event from search input.
     * filtering data conditionally according to search term.
     */
    public handleSearch(term: string) {
        if (term && term.length > 0) {
            LOCAL_MEMORY.charCount = term.length;
            // open popover again if in case it's not opened
            if (!this.isOpen) {
                this.isOpen = true;
            }
            term = term.toLowerCase();
            let filteredData: any[] = [];
            let d = cloneDeep(this.rawSmartComboList);
            if (this.listOfSelectedGroups && this.listOfSelectedGroups.length) {
                // logic search
                this.doConditionalSearch(term);
                return;
            }
            // search data conditional
            filteredData = this.universalSearchService.filterByTerm(term, d);
            console.log(filteredData);
            this.updateRowsViaSearch(filteredData);

            // emit no result event
            if (filteredData.length === 0) {
                this.noResultFoundEmitter.emit(true);
            }
        }
        // setting width again due to if no data found.
        // the other block (no result) also have to be liquid
        this.setParentWidthFunc();
    }

    // end search portion

    public get getMaxHeight() {
        if (this.rows.length < this.visibleItems) {
            return this.rows.length * this.rowHeight;
        } else {
            return this.visibleItems * this.rowHeight;
        }
    }

    public trackByFn(index, item: IUlist) {
        return item.uniqueName; // unique id corresponding to the item
    }

    /**
     * main function to write data on UI.
     * it will be responsible for notify angular
     * data has been changed by using zone method.
     * calls set width function due to UI change.
     * calls scroll function due to UI change.
     */
    public updateRowsViaSearch(val: any[] = []) {
        this.zone.run(() => {
            this.rows = val;
            this.setParentWidthFunc();
            if (val && val.length > 0 && this.virtualScrollElem) {
                this.virtualScrollElem.startupLoop = true;
                this.virtualScrollElem.refresh();
            }

            console.log(this.rows);
        });
    }

    // usage only by self to making clone of data.
    public setValueInRow(val: any[] = []) {
        this.rowsClone = [];
        this.rowsClone = cloneDeep(val);
        this.rows = cloneDeep(val);

        if (this.winRef) {
            let key = `${KEY_FOR_QUERY}_${this.activeCompany}`;
            let priorTerm: string[] = JSON.parse(sessionStorage.getItem(key));
            if (priorTerm && priorTerm.length > 0) {
                this.listOfSelectedGroups = [];
                this._dbService.getAllItems(this.activeCompany, 'groups').pipe(take(1))
                    .subscribe((groupList: IUlist[]) => {
                        priorTerm.forEach((str: string) => {
                            let o = find(groupList, ['uniqueName', str]);
                            if (o) {
                                this.listOfSelectedGroups.push(o);
                            }
                        });
                        this.listOfSelectedGroups = uniq(this.listOfSelectedGroups);
                        let d = cloneDeep(this.rawSmartComboList);
                        let filteredData: any[] = this.universalSearchService.filterByConditions(d, priorTerm);
                        this.updateRowsViaSearch(filteredData);
                    });
            }
        }
    }

    /**
     * close on outside click
     * expect in case of multiple
     */
    public hide() {
        if (!this.preventOutSideClose) {
            this.isOpen = false;
        } else {
            this.closeEmitter.emit(true);
        }
    }

    // remove item
    public removeItemFromSelectedGroups(item?: IUlist) {
        if (item) {
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
        this.saveValueInSession(this.getPriorTerm());
    }

    /**
     * get a single row height
     */
    private get rowHeight() {
        return this.ItemHeight;
    }

    private captureValueFromList() {
        if (this.virtualScrollElem) {
            let item = this.virtualScrollElem.activeItem();
            if (item) {
                this.itemSelected(item);
            } else if (this.viewPortItems && this.viewPortItems.length === 1) {
                this.itemSelected(this.viewPortItems[0]);
            }
        }
    }

    private saveValueInSession(priorTerm: string[]) {
        try {
            if (this.winRef) {
                let sessionStorage: Storage = this.winRef.nativeWindow.sessionStorage;
                let key = `${KEY_FOR_QUERY}_${this.activeCompany}`;
                sessionStorage.setItem(key, JSON.stringify(priorTerm));
            }
        } catch (error) {
            //
        }
    }

    private getPriorTerm(): string[] {
        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length) {
            return cloneDeep(this.listOfSelectedGroups).map(item => item.uniqueName);
        }
        return [];
    }

    private doConditionalSearch(term?: string) {

        if (!term) {
            LOCAL_MEMORY.charCount = 0;
            this.searchEle.nativeElement.value = null;
        }

        let filteredData: any[] = [];
        let d = cloneDeep(this.rawSmartComboList);
        let priorTerm = this.getPriorTerm();
        // assuming going backwards and forwards
        if (priorTerm && priorTerm.length > 0) {
            // not the first time so send prev. filtered data
            if (priorTerm.length > 1 && LOCAL_MEMORY.filteredData.size > 0) {
                d = LOCAL_MEMORY.filteredData.get(priorTerm.length - 1);
            }
            filteredData = this.universalSearchService.filterByConditions(d, priorTerm, term);
            // setting values into local var
            if (!term) {
                this.saveValueInSession(priorTerm);
                LOCAL_MEMORY.filteredData.set(priorTerm.length, filteredData);
            }
        } else {
            // reset data like init state
            filteredData = cloneDeep(this.smartList);
            // reset local var
            LOCAL_MEMORY.filteredData = new Map();
        }

        this.updateRowsViaSearch(filteredData);
    }

    private emitData(item: IUlist) {
        // emit data in case of direct A/c or Menus
        if (!item.type || (item.type && item.type === 'MENU')) {
            this.selectedItemEmitter.emit(item);
        } else {
            // emit value for save data in db
            if (item.type === 'GROUP') {
                this.groupEmitter.emit(item);
            }
            try {
                this.listOfSelectedGroups.push(item);
            } catch (error) {
                this.listOfSelectedGroups = [];
                this.listOfSelectedGroups.push(item);
            }
            // set focus on search
            this.handleClickOnSearchWrapper();
            // reset ui
            this.virtualScrollElem.refreshView();
            // go for search
            this.doConditionalSearch();
        }

        /**
         * conditional set value in input box
         *
         */
        // if (this.outsideSearch) {
        // let team = this.teamList.find(t => t.id === data.id);
        // if (team) {
        //   if (this.isTeamDirect(team)) {
        //     let d = find(team.users, user => user.id !== this.currentUser.id);
        //     if (d) {
        //       this.searchEle.nativeElement.value = d.username;
        //     }
        //   } else {
        //     this.searchEle.nativeElement.value = team.name;
        //   }
        // }
        // }

        // if (forceHide) {
        //   this.hide();
        // }
    }
}
