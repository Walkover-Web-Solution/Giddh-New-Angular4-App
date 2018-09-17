import {
  Component, ChangeDetectionStrategy, OnInit,
  OnDestroy, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, ElementRef, ViewChild,
  Renderer, AfterViewInit, NgZone
} from '@angular/core';
import { ScrollComponent } from '../virtual-scroll/vscroll';
import { UniversalSearchService, WindowRefService } from '../service';
import { ReplaySubject } from 'rxjs';
import { findIndex, cloneDeep } from '../../../lodash-optimized';

const KEYS: any = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40
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
  @ViewChild('wrapper') public wrapper: ElementRef;
  @ViewChild(ScrollComponent) public virtualScrollElem: ScrollComponent;

  // bot related
  @Input() public preventOutSideClose: boolean = false;
  @Input() public dontShowNoResultMsg: boolean = false;
  @Input() public showChannelCreateBtn: boolean = false;

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
  @Input() public defaultExcludedTags: string = 'input, button, .searchEle';

  // ui related
  @Input() public isOpen: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Input() public ItemHeight: number = 38;
  @Input() public ItemWidth: number = 300;
  // to show search bar inside
  @Input() public outsideSearch: boolean = false;
  @Input() public searchBoxPlaceholder: string = 'Search...';
  @Input() public visibleItems: number = 10;
  // here will not need to add nativeElement in parent
  @Input() public parentEle: any;

  // broadcasting events
  @Output() public closeEmitter: EventEmitter<boolean | any> = new EventEmitter<boolean | any>();
  @Output() public selectedItemEmitter: EventEmitter<any | any[]> = new EventEmitter<any | any[]>();
  @Output() public noResultFoundEmitter: EventEmitter<any> = new EventEmitter<null>();
  @Output() public newTeamCreationEmitter: EventEmitter<any> = new EventEmitter<null>();

  // for setting value in bot input
  @Input() public botValue: string;

  public rows: any[] = null;
  public rowsClone: any[] = [];
  public viewPortItems: any[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private keys: any = KEYS;
  constructor(
    private renderer: Renderer,
    private zone: NgZone,
    private winRef: WindowRefService,
    private universalSearchService: UniversalSearchService
  ) {}

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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

  // get initialized on init and return selected item
  public handleHighLightedItemEvent(item: any) {
    // do the thing
  }

  public ngOnInit() {

    // set excluded tags
    if (this.listOfTagsWhichHasToExclude) {
      this.defaultExcludedTags = `${this.defaultExcludedTags}, ${this.listOfTagsWhichHasToExclude}`;
    }

    // init rows
    this.updateRows();

    // due to view init issue using timeout
    setTimeout(() => {
      // set position conditionally
      if (this.wrapper && this.placement === 'bottom') {
        if (this.parentEle) {
          let box: any = this.parentEle.getBoundingClientRect();
          let pos = this.winRef.nativeWindow.innerHeight - box.bottom;
          pos = (pos < box.height) ? box.height : pos;
          this.setParentWidthFunc();
          this.renderer.setElementStyle(this.wrapper.nativeElement, 'bottom', `${pos}px`);
        } else {
          this.renderer.setElementStyle(this.wrapper.nativeElement, 'bottom', '0');
        }
      }
    }, 0);

  }

  // to hide dropdown on outside click
  public handleOutSideClick(e: any) {
    if (this.isOpen) {
      // this.closeEmitter.emit(true);
      this.hide();
    }
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

  /**
   * works when initiated by INPUT
   * @param key : number
   * @param funcName: string to see from which func func is getting called
   */
  public letElapseOnList(key?: number, funcName?: string) {
    if (this.mainEle && this.virtualScrollElem) {
      this.mainEle.nativeElement.focus();
      let item = this.virtualScrollElem.getHighlightedItem();
      if (item) {
        this.refreshToll(item, key);
      }
    }
  }

  /**
   * setting focus conditionally when triggered from outside.
   */
  public setFocusOnList(key?: number) {
    setTimeout(() => {
      if (this.outsideSearch) {
        this.searchEle.nativeElement.focus();
      } else {
        this.letElapseOnList(key, 'setFocusOnList');
      }
    }, 0);
  }

  // a toll to add condition before calling final func
  public refreshToll(item: any, key?: number) {
    if ( key === this.keys.UP) {
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
  public checkItems(event: {items: any[]; idx: number; }) {
    this.viewPortItems = event.items;
  }

  /**
   * main func works after list get focused
   * @param e: KeyBoardEvent
   */
  public onKeydownHandlerOfListEle(e) {
    let key = (e.which) ? e.which : e.keyCode;
    if (this.isOpen && ( key === this.keys.UP || key === this.keys.DOWN || key === this.keys.LEFT || key === this.keys.RIGHT)) {
      e.preventDefault();
      this.refreshToll(this.virtualScrollElem.directionToll(key), key);
    }
    if (this.isOpen && ( key === this.keys.ENTER)) {
      e.preventDefault();
      let item = this.virtualScrollElem.activeItem();
      if (item) {
        this.itemSelected(item);
      }
    }
  }

  /**
   * watching over some keys to update UI on data basis
   * @param changes
   */
  public ngOnChanges(changes: SimpleChanges) {
    // when data is filtered from outside handle
    if ('usersList' in changes && !changes.usersList.firstChange) {
      this.updateRowsViaSearch(changes.usersList.currentValue);
    }

    // listen for force auto focus
    if ('forceSetAutoFocus' in changes && changes.forceSetAutoFocus.currentValue) {
      this.setFocusOnList(this.forcekey);
    }
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
      if (box.width > 300) {
        this.renderer.setElementClass(this.wrapper.nativeElement, 'wider', true);
      }
    }
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      // set focus conditionally
      if (this.autoFocus) {
        this.setFocusOnList();
      }
      this.doingUIErrands();

      // set element value
      if (!this.isMultiple && this.botValue) {
        this.searchEle.nativeElement.value = this.botValue;
      }
    }, 0);
  }

  public doingUIErrands() {
    this.zone.runOutsideAngular(() => {
      // styling fix for parent
      if (this.parentEle) {
        this.renderer.setElementClass(this.parentEle, 'uniParent', true);
      }
      if (this.wrapper && this.parentEle) {
        this.setParentWidthFunc();
      }
    });
  }

  // search box related funcs

  public handleFocus() {
    this.isOpen = true;
  }

  /**
   * will be called from search input keydown
   * @param e an event from search input.
   * checking for keys for animation scrolling purpose.
   * checking for enter for capture value.
   */
  public handleKeydown(e: any) {
    let key = (e.which) ? e.which : e.keyCode;
    // prevent caret movement
    if (this.isOpen && ( key === this.keys.UP || key === this.keys.DOWN || key === this.keys.RIGHT || key === this.keys.LEFT)) {
      event.preventDefault();
      let item = this.virtualScrollElem.directionToll(key);
      if (item) {
        this.refreshToll(item, key);
      }
    }

    if (this.isOpen && ( key === this.keys.ENTER)) {
      e.preventDefault();
      this.captureValueFromList();
    }

    // closing list on
    if (key === this.keys.ESC && this.isOpen) {
      e.preventDefault();
      // e.stopPropagation();
      this.isOpen = false;
      this.searchEle.nativeElement.value = null;
    }
  }

  /**
   * will be called from search input keyup
   * @param e an event from search input.
   * filtering data conditionally according to search term.
   */
  public search(e: any) {
    if (e && e.target.value && e.target.value.length > 0) {
      let term = e.target.value.toLowerCase();
      let filteredData: any[] = [];

      // open popover again
      if (term && term.length > 0 && !this.isOpen ) {
        this.isOpen = true;
      }

      // search data conditional
      filteredData = this.universalSearchService.filterBy(term, this.rowsClone);

      this.updateRowsViaSearch(filteredData);
    } else {
      this.updateRowsViaSearch(cloneDeep(this.rowsClone));
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
    });
  }

  // usage only by self to making clone of data.
  public setValueInRow(val: any[] = []) {
    this.rowsClone = [];
    this.rowsClone = cloneDeep(val);
    this.rows = cloneDeep(val);
  }

  /**
   * used by on init of component
   * assign data conditionally
   * TEAM, EMOJI, HYBRID = TEAM_AND_PERSON, PERSON
   */
  public updateRows() {
    // this.setValueInRow(this.hybridList);
  }

  public handleClose(idx: number) {
    //
  }

  /**
   * close on outside click
   * expect in case of multiple
   */
  public hide() {
    if (this.outsideSearch && !this.preventOutSideClose) {
      this.isOpen = false;
    } else {
      // remove styling from paren
      // if (this.parentEle) {
      //   this.renderer.setElementClass(this.parentEle, 'uniParent', false);
      // }
      this.closeEmitter.emit(true);
    }
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

  private emitData(data: any | any[], forceHide: boolean = true) {
    // data type will be ITeamResponse | any[]
    this.selectedItemEmitter.emit(data);

    /**
     * conditional set value in input box
     *
     */
    if (this.outsideSearch) {
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
    }

    if (forceHide) {
      this.hide();
    }
  }
}
