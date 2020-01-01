import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Output, Renderer, ViewChild, Input, EventEmitter } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ALT, BACKSPACE, CAPS_LOCK, CONTROL, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, MAC_META, MAC_WK_CMD_LEFT, MAC_WK_CMD_RIGHT, RIGHT_ARROW, SHIFT, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { ScrollComponent } from './virtual-scroll/vscroll';
import { GeneralService } from '../../services/general.service';
import { CommandKService } from '../../services/commandk.service';
import { CommandKRequest } from '../../models/api-models/Common';
import { remove } from '../../lodash-optimized';

const KEY_FOR_QUERY = 'query';
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
    public commandKRequestParams: CommandKRequest = {
        page: 1,
        q: '',
        group: ''
    };
    public noResultsFound: boolean = false;

    constructor(
        private renderer: Renderer,
        private zone: NgZone,
        private _generalService: GeneralService,
        private _commandKService: CommandKService,
        private _cdref: ChangeDetectorRef
    ) {
        this.searchCommandK();
    }

    public ngOnInit() {

        // listen on input for search
        this.searchSubject.pipe(debounceTime(400)).subscribe(term => {
            this.commandKRequestParams.q = term;
            this.searchCommandK();
            this._cdref.markForCheck();
        });

        setTimeout(() => {
            this.handleClickOnSearchWrapper();
        }, 0);
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.handleClickOnSearchWrapper();

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

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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

    public itemSelected(item: any) {
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
            this.handleClickOnSearchWrapper();
        }
    }

    public triggerAddManage() {
        this.newTeamCreationEmitter.emit(true);
    }

    public searchCommandK() {
        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            let lastGroup = this._generalService.getLastElement(this.listOfSelectedGroups);
            this.commandKRequestParams.group = lastGroup.uniqueName;
        } else {
            this.commandKRequestParams.group = "";
        }

        this._commandKService.searchCommandK(this.commandKRequestParams).subscribe((res) => {
            if (res && res.body) {
                this.searchedItems = res.body.results;
                this._cdref.detectChanges();
            } else {
                this.searchedItems = [];
                this.noResultsFound = true;
            }

            this.setParentWidthFunc();
        });
    }

    public handleOutSideClick(e: any) {

    }

    private captureValueFromList() {
        if (this.virtualScrollElem) {
            let item = this.virtualScrollElem.activeItem();
            if (item) {
                this.itemSelected(item);
            } else if (this.searchedItems && this.searchedItems.length === 1) {
                this.itemSelected(this.searchedItems[0]);
            }
        }
    }

    public handleFocus() {
        this.isOpen = true;
    }

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
            }
        }

        if (this.isOpen && key === BACKSPACE) {
            if (!this.searchEle.nativeElement.value && this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
                this.removeItemFromSelectedGroups();
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
    public removeItemFromSelectedGroups(item?: any) {
        if (item) {
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
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

    public initSearch(e: KeyboardEvent, term: string) {
        let key = e.which || e.keyCode;
        // preventing search operation on arrows key
        if (this.isOpen && SPECIAL_KEYS.indexOf(key) !== -1) {
            return;
        }
        term = term.trim();
        this.searchSubject.next(term);
    }

    public handleClickOnSearchWrapper(e?: KeyboardEvent) {
        if (this.searchEle) {
            this.searchEle.nativeElement.focus();
        }
    }

    // get initialized on init and return selected item
    public handleHighLightedItemEvent(item: any) {
        // do the thing
    }
}
