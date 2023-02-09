import { Component, ContentChild, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

export interface ChangeEvent {
    start?: number;
    end?: number;
}

interface IUpdateEmit {
    items: any[];
    idx: number;
}

@Component({
    selector: 'commandk-virtual-scroll',
    template: `
    <div class="total-padding" #shim></div>
    <div class="scrollable-content" #content>
      <ng-content></ng-content>
    </div>
  `,
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '[style.overflow-y]': "parentScroll ? 'hidden' : 'auto'"
    },
    styles: [`
    :host {
      overflow: hidden;
      position: relative;
	    display: block;
      -webkit-overflow-scrolling: touch;
    }
    .scrollable-content {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
    }
    .total-padding {
      width: 1px;
      opacity: 0;
    }
  `]
})

export class ScrollComponent implements OnInit, OnChanges, OnDestroy {

    @Output() public update: EventEmitter<IUpdateEmit> = new EventEmitter<IUpdateEmit>();
    @Output() public change: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();
    @Output() public start: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();
    @Output() public end: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();
    @Output() public highLightedItemEmitter: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('content', { read: ElementRef, static: true }) public contentElementRef: ElementRef;
    @ViewChild('shim', { read: ElementRef, static: true }) public shimElementRef: ElementRef;
    @ContentChild('container') public containerElementRef: ElementRef;

    @Input() public items: any[] = [];
    @Input() public scrollbarWidth: number;
    @Input() public scrollbarHeight: number;
    @Input() public childWidth: number;
    @Input() public childHeight: number;
    @Input() public bufferAmount: number = 0;
    @Input() public scrollAnimationTime: number = 0;
    @Input() public doNotCheckAngularZone: boolean = true;

    public viewPortItems: any[];
    public previousStart: number;
    public previousEnd: number;
    public startupLoop: boolean = true;

    @Input()
    set parentScroll(element: Element | Window) {
        if (this._parentScroll === element) {
            return;
        }
        this._parentScroll = element;
        this.addParentEventHandlers(this._parentScroll);
    }

    get parentScroll(): Element | Window {
        return this._parentScroll;
    }

    private disposeScrollHandler: () => void | undefined;
    private disposeResizeHandler: () => void | undefined;

    // make count for prev hightlighted item
    private lastActiveItemIdx: number = 0;

    /** Cache of the last scroll height to prevent setting CSS when not needed. */
    private lastScrollHeight = -1;

    private _parentScroll: Element | Window;

    constructor(
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) { }

    public refreshHandler = () => { this.refresh(); };

    public ngOnInit() {
        this.scrollbarWidth = 0;
        this.scrollbarHeight = 0;

        if (!this.parentScroll) {
            this.addParentEventHandlers(this.element?.nativeElement);
        }

        setTimeout(() => {
            this.highLightedItemEmitter.emit(this.activeItem());
        }, 500);
    }

    /**
     * important while destroying component
     * resetting some vars.
     */
    public ngOnDestroy() {
        this.lastActiveItemIdx = 0;
        this.items.forEach(p => p.isHilighted = false);
        this.removeParentEventHandlers();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.previousStart = undefined;
        this.previousEnd = undefined;
        const items = (changes as any).items || {};
        if ((changes as any).items !== undefined && items.previousValue === undefined || (items.previousValue !== undefined && items.previousValue?.length === 0)) {
            this.startupLoop = true;
        }
        this.refresh();
    }

    public refresh(forceViewportUpdate: boolean = false) {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.calculateItems(forceViewportUpdate));
        });
    }

    /**
     * main function which calls from outside
     * ${item} will be an object
     * ${direction} is for up and down purpose.
     * working: this function will take element reference
     * from the passed item and calculate dimensions, position, offset etc.
     * and then finally make an animation
     * it will also cancel previous animation if it is in progress
     */
    public scrollInto(item: any, direction?: string) {

        let el: Element = this.parentScroll instanceof Window ? document.body : this.parentScroll || this.element?.nativeElement;
        let index: number = (this.items || [])?.indexOf(item);
        if (index < 0 || index >= (this.items || [])?.length) {
            return;
        }

        let d = this.calculateDimensions();
        let scrollTop = (Math.floor(index / d.itemsPerRow) * d.childHeight) - (d.childHeight * Math.min(index, (d.itemsPerCol - 1)));

        /**
         * logic to make scrolling works like slack
         */

        if (direction && d.itemsPerRow > 1) {
            if (index > (this.previousStart + d.itemsPerCol)) {
                scrollTop = el.scrollTop;
            } else {
                scrollTop = el.scrollTop - d.childHeight;
            }
        }

        // going up
        if (direction && d.itemsPerRow === 1) {
            if (this.lastActiveItemIdx >= this.previousStart) {
                scrollTop = el.scrollTop;
            } else {
                scrollTop = el.scrollTop - d.childHeight;
            }
        }

        // handle direction down when user goes up and comes down again
        if (!direction && d.itemsPerRow === 1) {
            if (this.lastActiveItemIdx >= this.previousEnd - d.itemsPerRow) {
                // do nothing
            } else {
                scrollTop = el.scrollTop;
            }
        }

        // check if scroll position is not the multiplication of element height
        if ((scrollTop / d.childHeight) % 1 !== 0) {
            let int = Math.floor(scrollTop / d.childHeight);
            let it = (direction) ? int : int + 1;
            scrollTop = it * d.childHeight;
        }

        // to make row is highlighted for ui purpose
        // it will make an effect
        this.items.forEach(p => p.isHilighted = false);
        item.isHilighted = true;
        // end

        // totally disable animate
        if (!this.scrollAnimationTime) {
            el.scrollTop = scrollTop;
            return;
        }
    }

    /**
     * to get current active items.
     * usage: if you need to get current selected row
     */
    public activeItem(): any {
        let index = this.getHighLightedItemIndex();
        // due to 0 is not consider
        return (index || index === 0) ? this.items[index] : null;
    }

    /**
     * to get current active items.
     * usage: if you need to get current selected row
     */
    public makeItemSelected(): any {
        let index = this.getHighLightedItemIndex();
        let d = this.activeItem();
        if (d) {
            this.items.map((item: any, idx: number) => {
                if (idx === index) {
                    item.isSelected = (item.isSelected) ? false : true;
                }
                return item;
            });
        }
    }

    // set last itme index from mouse event
    public setLastItemIndex(idx: number) {
        this.lastActiveItemIdx = idx;
    }

    /**
     * param: ${direction} for up and down purpose.
     * index will be calculated and conditionally return
     * the item by adding or subtracting
     */
    public getHighlightedItem(direction?: string): any {
        let index = this.getHighLightedItemIndex();
        if (index === -1) {
            if (this.lastActiveItemIdx > 0 && this.lastActiveItemIdx < this.items?.length) {
                index = (direction) ? (this.lastActiveItemIdx - 1) : (this.lastActiveItemIdx + 1);
            } else {
                index = 0;
            }
            this.lastActiveItemIdx = index;
        } else if (index === 0 && direction) {
            this.lastActiveItemIdx = index;
        } else {
            let last = this.items?.length - 1;
            this.lastActiveItemIdx = (direction) ? (index - 1) : (index < last) ? (index + 1) : last;
        }
        return this.items[this.lastActiveItemIdx];
    }

    public refreshView() {
        if (this.items) {
            this.lastActiveItemIdx = null;
            this.items.map(p => p.isHilighted = false);
        }
    }

    public getHighLightedItemIndex(): number {
        if (this.items) {
            return this.items.findIndex(p => p.isHilighted);
        } else {
            return null;
        }
    }

    public directionToll(key: number): any {
        if (!this.items) {
            return false;
        }
        let item;
        let d = this.calculateDimensions();
        // EMOJI case inline list case
        if (d.itemsPerRow > 1) {
            let index = this.getHighLightedItemIndex();
            switch (key) {
                // left arrow
                case 37: {
                    item = this.prevElem(index, d);
                    break;
                }
                // RIGHT arrow
                case 39: {
                    item = this.nextElem(index, d);
                    break;
                }
                // down arrow
                case 40: {
                    item = this.jumpToNextRow(index, d);
                    break;
                }
                // up arrow
                case 38: {
                    item = this.backToPrevRow(index, d);
                    break;
                }
            }
        } else {
            // block list case
            switch (key) {
                // up arrow
                case 38: {
                    item = this.getHighlightedItem('prev');
                    break;
                }
                // down arrow
                case 40: {
                    item = this.getHighlightedItem();
                    break;
                }
            }
        }
        this.highLightedItemEmitter.emit(item);
        return item;
    }

    private prevElem(index: number, d: any) {
        if (index < this.items?.length) {
            return this.items[index - 1];
        } else {
            return this.items[0];
        }
    }

    private nextElem(index: number, d: any) {
        if (index < this.items?.length) {
            return this.items[index + 1];
        } else {
            return this.items[0];
        }
    }

    private backToPrevRow(index: number, d: any) {
        if (index < this.items?.length && index !== 0) {
            let idx = index - d.itemsPerRow;
            if (idx > 0) {
                return this.items[idx];
            } else {
                return this.items[0];
            }
        } else {
            return this.items[0];
        }
    }

    private jumpToNextRow(index: number, d: any) {
        if (index < (this.items?.length - 1)) {
            let idx = index + d.itemsPerRow;
            let last = this.items?.length - 1;
            if (idx > last) {
                return this.items[last];
            } else {
                return this.items[idx];
            }
        } else {
            return this.items[0];
        }
    }

    // end©©

    private addParentEventHandlers(parentScroll: Element | Window) {
        this.removeParentEventHandlers();
        if (parentScroll) {
            this.zone.runOutsideAngular(() => {
                this.disposeScrollHandler =
                    this.renderer.listen(parentScroll, 'scroll', this.refreshHandler);
                if (parentScroll instanceof Window) {
                    this.disposeScrollHandler =
                        this.renderer.listen('window', 'resize', this.refreshHandler);
                }
            });
        }
    }

    private removeParentEventHandlers() {
        if (this.disposeScrollHandler) {
            this.disposeScrollHandler();
            this.disposeScrollHandler = undefined;
        }
        if (this.disposeResizeHandler) {
            this.disposeResizeHandler();
            this.disposeResizeHandler = undefined;
        }
    }

    private countItemsPerRow() {
        let offsetTop;
        let itemsPerRow;
        let children = this.contentElementRef?.nativeElement.children;
        for (itemsPerRow = 0; itemsPerRow < children?.length; itemsPerRow++) {
            // tslint:disable-next-line:curly
            if (offsetTop !== undefined && offsetTop !== children[itemsPerRow].offsetTop) break;
            offsetTop = children[itemsPerRow].offsetTop;
        }
        return itemsPerRow;
    }

    private getElementsOffset(): number {
        let offsetTop = 0;
        if (this.containerElementRef && this.containerElementRef?.nativeElement) {
            offsetTop += this.containerElementRef?.nativeElement.offsetTop;
        }
        if (this.parentScroll) {
            offsetTop += this.element?.nativeElement.offsetTop;
        }
        return offsetTop;
    }

    private calculateDimensions() {
        let el: Element = this.parentScroll instanceof Window ? document.body : this.parentScroll || this.element?.nativeElement;
        let items = this.items || [];
        let itemCount = items?.length;
        let viewWidth = el.clientWidth - this.scrollbarWidth;
        let viewHeight = el.clientHeight - this.scrollbarHeight;

        let contentDimensions;
        if (this.childWidth === undefined || this.childHeight === undefined) {
            let content = this.contentElementRef?.nativeElement;
            if (this.containerElementRef && this.containerElementRef?.nativeElement) {
                content = this.containerElementRef?.nativeElement;
            }
            contentDimensions = content.children[0] ? content.children[0].getBoundingClientRect() : {
                width: viewWidth,
                height: viewHeight
            };
        }
        let childWidth = this.childWidth || contentDimensions.width;
        let childHeight = this.childHeight || contentDimensions.height;

        let itemsPerRow = Math.max(1, this.countItemsPerRow());
        let itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth));
        let itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));
        let elScrollTop = this.parentScroll instanceof Window
            ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
            : el.scrollTop;
        let scrollTop = Math.max(0, elScrollTop);
        const scrollHeight = childHeight * Math.ceil(itemCount / itemsPerRow);
        if (itemsPerCol === 1 && Math.floor(scrollTop / scrollHeight * itemCount) + itemsPerRowByCalc >= itemCount) {
            itemsPerRow = itemsPerRowByCalc;
        }

        if (scrollHeight !== this.lastScrollHeight) {
            this.renderer.setStyle(this.shimElementRef?.nativeElement, 'height', `${scrollHeight}px`);
            this.lastScrollHeight = scrollHeight;
        }

        return {
            itemCount,
            viewWidth,
            viewHeight,
            childWidth,
            childHeight,
            itemsPerRow,
            itemsPerCol,
            itemsPerRowByCalc,
            scrollHeight,
        };
    }

    private getScrollElement(): HTMLElement {
        // tslint:disable-next-line:max-line-length
        return this.parentScroll instanceof Window ? document.scrollingElement || document.documentElement || document.body : this.parentScroll || this.element?.nativeElement;
    }

    private getScrollPosition(): number {
        let windowScrollValue;
        if (this.parentScroll instanceof Window) {
            windowScrollValue = window['pageYOffset'];
        }

        return windowScrollValue || this.getScrollElement()['scrollTop'] || 0;
    }

    private calculateItems(forceViewportUpdate: boolean = false) {
        if (!this.doNotCheckAngularZone) {
            NgZone.assertNotInAngularZone();
        }
        let d = this.calculateDimensions();
        let items = this.items || [];
        let offsetTop = this.getElementsOffset();
        let elScrollTop = this.getScrollPosition();
        if (elScrollTop > d.scrollHeight) {
            elScrollTop = d.scrollHeight + offsetTop;
        }
        let scrollTop = Math.max(0, elScrollTop - offsetTop);
        let indexByScrollTop = Math.round((scrollTop / d.scrollHeight) * (d.itemCount / d.itemsPerRow));
        let end = Math.min(d.itemCount, (indexByScrollTop * d.itemsPerRow) + (d.itemsPerRow * (d.itemsPerCol + 1)));

        let maxStartEnd = end;
        const modEnd = end % d.itemsPerRow;
        if (modEnd) {
            maxStartEnd = end + d.itemsPerRow - modEnd;
        }
        let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
        let start = Math.min(maxStart, (indexByScrollTop * d.itemsPerRow));

        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= this.bufferAmount;
        start = Math.max(0, start);
        end += this.bufferAmount;
        end = Math.min(items?.length, end);
        if (start !== this.previousStart || end !== this.previousEnd || forceViewportUpdate === true) {

            this.zone.run(() => {
                // update the scroll list
                let _end = end >= 0 ? end : 0; // To prevent from accidentally selecting the entire array with a negative 1 (-1) in the end position.
                this.viewPortItems = items.slice(start, _end);
                // looping again due to some issues
                this.viewPortItems.map((t: any, index: number) => {
                    t.isHilighted = (index === this.lastActiveItemIdx - start) ? true : false;
                    return t;
                });
                let o: IUpdateEmit = {
                    items: this.viewPortItems,
                    idx: this.lastActiveItemIdx
                };
                this.update.emit(o);

                // emit 'start' event
                if (start !== this.previousStart && this.startupLoop === false) {
                    this.start.emit({ start, end });
                }

                // emit 'end' event
                if (end !== this.previousEnd && this.startupLoop === false) {
                    this.end.emit({ start, end });
                }

                this.previousStart = start;
                this.previousEnd = end;

                if (this.startupLoop === true) {
                    this.refresh();
                } else {
                    this.change.emit({ start, end });
                }
            });

        } else if (this.startupLoop === true) {
            this.startupLoop = false;
            this.refresh();
        }
    }
}
