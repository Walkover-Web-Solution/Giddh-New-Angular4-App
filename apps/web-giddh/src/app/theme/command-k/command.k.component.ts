import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Output, Renderer, ViewChild, Input, EventEmitter } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ALT, BACKSPACE, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { ScrollComponent } from './virtual-scroll/vscroll';
import { GeneralService } from '../../services/general.service';
import { CommandKService } from '../../services/commandk.service';
import { CommandKRequest } from '../../models/api-models/Common';
import { remove } from '../../lodash-optimized';

const DIRECTIONAL_KEYS = [
    LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
];

const SPECIAL_KEYS = [...DIRECTIONAL_KEYS, CAPS_LOCK, TAB, SHIFT, CONTROL, ALT, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, MAC_META];

@Component({
    selector: 'command-k',
    styleUrls: ['./command.k.component.scss'],
    templateUrl: './command.k.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommandKComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('mainEle') public mainEle: ElementRef;
    @ViewChild('searchEle') public searchEle: ElementRef;
    @ViewChild('searchWrapEle') public searchWrapEle: ElementRef;
    @ViewChild('wrapper') public wrapper: ElementRef;
    @ViewChild(ScrollComponent) public virtualScrollElem: ScrollComponent;

    @Input() public preventOutSideClose: boolean = false;
    @Input() public dontShowNoResultMsg: boolean = false;
    @Input() public showChannelCreateBtn: boolean = true;

    @Input() public isOpen: boolean = false;
    @Input() public defaultExcludedTags: string = 'input, button, .searchEle, .modal-content, .modal-backdrop';
    @Input() public placement: string;
    @Input() public setParentWidth: boolean = false;
    @Input() public parentEle: any;
    @Input() public ItemHeight: number = 50;
    @Input() public ItemWidth: number = 300;
    @Input() public visibleItems: number = 10;

    @Output() public closeEmitter: EventEmitter<boolean | any> = new EventEmitter<boolean | any>();
    @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
    @Output() public groupEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public noResultFoundEmitter: EventEmitter<any> = new EventEmitter<null>();
    @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

    private searchSubject: Subject<string> = new Subject();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public searchedItems: any[] = [];
    public listOfSelectedGroups: any[] = [];
    public noResultsFound: boolean = false;
    public commandKRequestParams: CommandKRequest = {
        page: 1,
        q: '',
        group: ''
    };

    constructor(
        private renderer: Renderer,
        private zone: NgZone,
        private _generalService: GeneralService,
        private _commandKService: CommandKService,
        private _cdref: ChangeDetectorRef
    ) {
        this.searchCommandK();
    }

    /**
     * Initializes the component
     *
     * @memberof CommandKComponent
     */
    public ngOnInit(): void {
        // listen on input for search
        this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
            this.commandKRequestParams.q = term;
            this.searchCommandK();
            this._cdref.markForCheck();
        });
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
        this.zone.runOutsideAngular(() => {
            if (this.wrapper && this.parentEle) {
                this.initSetParentWidth();
            }
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof CommandKComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function sets the width of container inside the modal
     *
     * @memberof CommandKComponent
     */
    public initSetParentWidth(): void {
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

    /**
     * This function will get called if any item get selected
     *
     * @param {*} item
     * @memberof CommandKComponent
     */
    public itemSelected(item: any): void {
        // emit data in case of direct A/c or Menus
        if (!item.type || (item.type && (item.type === 'MENU' || item.type === 'ACCOUNT'))) {
            if (item.type === 'MENU') {
                item.uniqueName = item.route;
            }
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

            this.searchEle.nativeElement.value = null;

            // set focus on search
            this.focusInSearchBox();
        }
    }

    /**
     * This function will get called if we want to create a/c or group
     *
     * @memberof CommandKComponent
     */
    public triggerAddManage(): void {
        this.newTeamCreationEmitter.emit(true);
    }

    /**
     * This function will call the api to search items
     *
     * @memberof CommandKComponent
     */
    public searchCommandK(): void {
        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            let lastGroup = this._generalService.getLastElement(this.listOfSelectedGroups);
            this.commandKRequestParams.group = lastGroup.uniqueName;
        } else {
            this.commandKRequestParams.group = "";
        }

        this._commandKService.searchCommandK(this.commandKRequestParams).subscribe((res) => {
            if (res && res.body && res.body.results && res.body.results.length > 0) {
                this.searchedItems = res.body.results;
                this.noResultsFound = false;
                this._cdref.detectChanges();
            } else {
                this.searchedItems = [];
                this.noResultsFound = true;
                this._cdref.detectChanges();
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

    /**
     * This function will get called if clicked outside of modal
     *
     * @param {*} e
     * @memberof CommandKComponent
     */
    public handleOutSideClick(e: any): void {

    }

    /**
     * This function will get called if pressed enter on any item
     *
     * @private
     * @memberof CommandKComponent
     */
    private captureValueFromList(): void {
        if (this.virtualScrollElem) {
            let item = this.virtualScrollElem.activeItem();
            if (item) {
                this.itemSelected(item);
            } else if (this.searchedItems && this.searchedItems.length === 1) {
                this.itemSelected(this.searchedItems[0]);
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
            }
        }

        if (this.isOpen && key === BACKSPACE) {
            if (!this.searchEle.nativeElement.value && this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
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
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
    }

    /**
     * This function calls the function to refresh the scroll view
     *
     * @param {*} item
     * @param {number} [key]
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
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
     * @memberof CommandKComponent
     */
    public initSearch(e: KeyboardEvent, term: string): void {
        let key = e.which || e.keyCode;
        // preventing search operation on arrows key
        if (this.isOpen && SPECIAL_KEYS.indexOf(key) !== -1) {
            return;
        }
        term = term.trim();
        this.searchSubject.next(term);
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
        // no need to do anything in the function
    }

    /**
     * This function returns the uniquename of item
     *
     * @param {*} index
     * @param {*} item
     * @returns uniqueName
     * @memberof CommandKComponent
     */
    public trackByFn(index, item: any) {
        return item.uniqueName; // unique id corresponding to the item
    }
}
