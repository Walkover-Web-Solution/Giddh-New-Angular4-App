import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, EmbeddedViewRef, Input, NgZone, OnChanges, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

const dde: any = document.documentElement;
const matchingFunction = dde.matches ? 'matches' :
    dde.matchesSelector ? 'matchesSelector' :
        dde.webkitMatches ? 'webkitMatches' :
            dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
                dde.msMatches ? 'msMatches' :
                    dde.msMatchesSelector ? 'msMatchesSelector' :
                        dde.mozMatches ? 'mozMatches' :
                            dde.mozMatchesSelector ? 'mozMatchesSelector' : null;

const closestElement = (el: Node, selector: string): HTMLElement => {
    while (el !== document.documentElement && el != null && !el[matchingFunction](selector)) {
        el = el.parentNode;
    }

    if (el && el[matchingFunction](selector)) {
        return el as HTMLElement;
    } else {
        return null;
    }
};

const getWindowScroll = () => {
    if ('pageYOffset' in window) {
        return {
            scrollTop: pageYOffset,
            scrollLeft: pageXOffset
        };
    } else {
        let sx;
        let sy;
        const d = document;
        const r = d.documentElement;
        const b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return {
            scrollTop: sy,
            scrollLeft: sx
        };
    }
};

const getClientSize = (element: Node | Window, sizeProp: string): number => {
    if (element === window) {
        return sizeProp === 'clientWidth' ? window.innerWidth : window.innerHeight;
    } else {
        return element[sizeProp];
    }
};

const getScrollPos = (element: Node | Window, scrollProp: string): number => {
    return element === window ? getWindowScroll()[scrollProp] : element[scrollProp];
};

const getScrollOffset = (vsElement: HTMLElement, scrollElement: HTMLElement | Window, isHorizontal: boolean): number => {
    const vsPos = vsElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
    const scrollPos = scrollElement === window ? 0 : (scrollElement as HTMLElement).getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
    return vsPos - scrollPos + (scrollElement === window ? getWindowScroll() : scrollElement)[isHorizontal ? 'scrollLeft' : 'scrollTop'];
};

function nextElementSibling(el: any) {
    if (el.nextElementSibling) {
        return el.nextElementSibling;
    }

    do {
        el = el.nextSibling;
    } while (el && el.nodeType !== 1);

    return el;
}

@Directive({
    selector: '[vsFor]',
    exportAs: 'vsFor'
})

export class VsForDirective implements OnChanges, AfterViewInit, OnDestroy {
    public originalLength: number;
    public before: HTMLElement;
    public after: HTMLElement;
    public view: EmbeddedViewRef<any>;
    public parent: HTMLElement;
    // tslint:disable-next-line:variable-name
    public __autoSize: boolean;
    // tslint:disable-next-line:variable-name
    public __options: any;
    public scrollParent: HTMLElement;
    public clientSize: string;
    public offsetSize: string;
    public scrollPos: string;
    public totalSize: number;
    public sizesCumulative: number[];
    public sizes: number[];
    public elementSize: number;
    public startIndex: number;
    public endIndex: number;
    public _prevStartIndex: number;
    public _prevEndIndex: number;
    public _minStartIndex: number;
    public _maxEndIndex: number;
    public onWindowResize: any;
    public onZone: any;
    @Input()
    public vsForSize: any;
    @Input()
    public vsForOffsetBefore = 0;
    @Input()
    public vsForOffsetAfter = 0;
    @Input()
    public vsForExcess = 2;
    @Input()
    public vsForScrollParent: string;
    @Input()
    public vsForAutoresize: boolean;
    @Input()
    public vsForHorizontal = false;
    @Input()
    public vsForTagName = 'div';

    constructor(private _element: ElementRef,
        private _viewContainer: ViewContainerRef,
        private _templateRef: TemplateRef<any>,
        private _ngZone: NgZone,
        private _changeDetectorRef: ChangeDetectorRef) {
        let _prevClientSize: number;
        const reinitOnClientHeightChange = () => {
            if (!this.scrollParent) {
                return;
            }

            const ch = getClientSize(this.scrollParent, this.clientSize);
            if (ch !== _prevClientSize) {
                _prevClientSize = ch;
                this._ngZone.run(() => {
                    this.refresh();
                });
            } else {
                _prevClientSize = ch;
            }
        };

        this.onZone = this._ngZone.onStable.subscribe(reinitOnClientHeightChange);
    }

    public _originalCollection: any[] = [];

    get originalCollection() {
        return this._originalCollection;
    }

    @Input('vsFor')
    set originalCollection(value: any[]) {
        this._originalCollection = value || [];
        if (this.scrollParent) {
            this.refresh();
        } else {
            this.postDigest(this.refresh.bind(this));
        }
    }

    public _slicedCollection: any[] = [];

    get slicedCollection() {
        return this._slicedCollection;
    }

    set slicedCollection(value: any[]) {
        this._slicedCollection = value;
        if (this.view) {
            this.view.context.vsCollection = this._slicedCollection;
        }
    }

    public ngOnChanges() {
        if (this.scrollParent) {
            this.refresh();
        } else {
            this.postDigest(this.refresh.bind(this));
        }
    }

    public postDigest(fn: any) {
        const subscription: any = this._ngZone.onStable.subscribe(() => {
            fn();
            subscription.unsubscribe();
        });
    }

    public initPlaceholders() {
        this.before = document.createElement(this.vsForTagName);
        this.before.className = 'vsFor-before';
        this.after = document.createElement(this.vsForTagName);
        this.after.className = 'vsFor-after';
        this.parent.insertBefore(this.before, this.parent.childNodes[0]);
        this.parent.appendChild(this.after);

        if (this.vsForHorizontal) {
            this.before.style.height = '100%';
            this.after.style.height = '100%';
        } else {
            this.before.style.width = '100%';
            this.after.style.width = '100%';
        }
    }

    public ngAfterViewInit() {
        this.view = this._viewContainer.createEmbeddedView(this._templateRef);
        this.parent = nextElementSibling(this._element.nativeElement);

        this.initPlaceholders();
        this.vsForHorizontal = false;
        this.__autoSize = true;
        this.__options = {};
        this.clientSize = this.vsForHorizontal ? 'clientWidth' : 'clientHeight';
        this.offsetSize = this.vsForHorizontal ? 'offsetWidth' : 'offsetHeight';
        this.scrollPos = this.vsForHorizontal ? 'scrollLeft' : 'scrollTop';

        this.scrollParent = (this.vsForScrollParent) ? closestElement(this.parent, this.vsForScrollParent) : this.parent;

        this.elementSize = getClientSize(this.scrollParent, this.clientSize) || 50;

        this.totalSize = 0;

        if (typeof this.vsForSize !== 'undefined') {
            this.sizesCumulative = [];
        }

        this.startIndex = 0;
        this.endIndex = 0;

        this.scrollParent.addEventListener('scroll', () => {
            this.updateInnerCollection();
        });

        this.onWindowResize = () => {
            if (this.vsForAutoresize) {
                this.__autoSize = true;
                this._ngZone.run(() => {
                    this.setAutoSize();
                });
            } else {
                this._ngZone.run(() => {
                    this.updateInnerCollection();
                });
            }
        };

        window.addEventListener('resize', this.onWindowResize);
    }

    public ngOnDestroy() {
        if (this.onWindowResize) {
            window.removeEventListener('resize', this.onWindowResize);
        }

        if (this.onZone) {
            this.onZone.unsubscribe();
        }
    }

    public refresh() {
        if (!this.originalCollection || this.originalCollection.length < 1) {
            this.slicedCollection = [];
            this.originalLength = 0;
            this.updateTotalSize(0);
            this.sizesCumulative = [0];
        } else {
            this.originalLength = this.originalCollection.length;
            if (typeof this.vsForSize !== 'undefined') {
                this.sizes = this.originalCollection.map((item, index) => {
                    if (typeof this.vsForSize === 'function') {
                        return this.vsForSize(item, index);
                    } else {
                        return +this.vsForSize; // number or string
                    }
                });
                let sum = 0;
                this.sizesCumulative = this.sizes.map((size) => {
                    const res = sum;
                    sum += size;
                    return res;
                });
                this.sizesCumulative.push(sum);
            } else {
                this.__autoSize = true;
                this.postDigest(this.setAutoSize.bind(this));
            }
        }

        this.reinitialize();
    }

    public updateTotalSize(size: number) {
        this.totalSize = this.vsForOffsetBefore + size + this.vsForOffsetAfter;
    }

    public reinitialize() {
        this._prevStartIndex = void 0;
        this._prevEndIndex = void 0;
        this._minStartIndex = this.originalLength;
        this._maxEndIndex = 0;

        this.updateTotalSize(typeof this.vsForSize !== 'undefined' ?
            this.sizesCumulative[this.originalLength] :
            this.elementSize * this.originalLength
        );
        this.updateInnerCollection();
    }

    public setAutoSize() {
        if (typeof this.vsForSize !== 'undefined') {
            this._ngZone.run(() => {
                this.refresh();
            });
        } else if (this.__autoSize) {
            let gotSomething = false;
            if (this.parent.offsetHeight || this.parent.offsetWidth) { // element is visible
                const child = this.parent.children[1];

                if (child[this.offsetSize]) {
                    gotSomething = true;
                    this.elementSize = child[this.offsetSize];
                }
            }

            if (gotSomething) {
                this.__autoSize = false;
                this._ngZone.run(() => {
                    this.reinitialize();
                });
            }
        }
    }

    public updateInnerCollection() {
        const $scrollPosition = getScrollPos(this.scrollParent, this.scrollPos);
        const $clientSize = getClientSize(this.scrollParent, this.clientSize);

        const scrollOffset = this.parent === this.scrollParent ? 0 : getScrollOffset(
            this.parent,
            this.scrollParent,
            this.vsForHorizontal
        );

        // tslint:disable-next-line:variable-name
        let __startIndex = this.startIndex;
        // tslint:disable-next-line:variable-name
        let __endIndex = this.endIndex;

        if (typeof this.vsForSize !== 'undefined') {
            __startIndex = 0;
            while (this.sizesCumulative[__startIndex] < $scrollPosition - this.vsForOffsetBefore - scrollOffset) {
                __startIndex++;
            }
            if (__startIndex > 0) {
                __startIndex--;
            }

            // Adjust the start index according to the excess
            __startIndex = Math.max(
                Math.floor(__startIndex - this.vsForExcess / 2),
                0
            );

            __endIndex = __startIndex;
            while (this.sizesCumulative[__endIndex] < $scrollPosition - this.vsForOffsetBefore - scrollOffset + $clientSize) {
                __endIndex++;
            }

            // Adjust the end index according to the excess
            __endIndex = Math.min(
                Math.ceil(__endIndex + this.vsForExcess / 2),
                this.originalLength
            );
        } else {
            __startIndex = Math.max(
                Math.floor(
                    ($scrollPosition - this.vsForOffsetBefore - scrollOffset) / this.elementSize
                ) - this.vsForExcess / 2,
                0
            );

            __endIndex = Math.min(
                __startIndex + Math.ceil(
                    $clientSize / this.elementSize
                ) + this.vsForExcess,
                this.originalLength
            );
        }

        this._minStartIndex = Math.min(__startIndex, this._minStartIndex);
        this._maxEndIndex = Math.max(__endIndex, this._maxEndIndex);

        this.startIndex = this.__options.latch ? this._minStartIndex : __startIndex;
        this.endIndex = this.__options.latch ? this._maxEndIndex : __endIndex;

        let digestRequired = false;
        if (this._prevStartIndex == null) {
            digestRequired = true;
        } else if (this._prevEndIndex == null) {
            digestRequired = true;
        }

        if (!digestRequired) {
            if (this.__options.hunked) {
                if (Math.abs(this.startIndex - this._prevStartIndex) >= this.vsForExcess / 2 ||
                    (this.startIndex === 0 && this._prevStartIndex !== 0)) {
                    digestRequired = true;
                } else if (Math.abs(this.endIndex - this._prevEndIndex) >= this.vsForExcess / 2 ||
                    (this.endIndex === this.originalLength && this._prevEndIndex !== this.originalLength)) {
                    digestRequired = true;
                }
            } else {
                digestRequired = this.startIndex !== this._prevStartIndex ||
                    this.endIndex !== this._prevEndIndex;
            }
        }

        if (digestRequired) {
            this.slicedCollection = this.originalCollection.slice(this.startIndex, this.endIndex);
            if (this.view) {
                this.view.context.vsStartIndex = this.startIndex;
            }

            this._prevStartIndex = this.startIndex;
            this._prevEndIndex = this.endIndex;

            const o1 = this._getOffset(0);
            const o2 = this._getOffset(this.slicedCollection.length);
            const total = this.totalSize;
            const layoutProp = this.vsForHorizontal ? 'width' : 'height';

            this.before.style[layoutProp] = o1 + 'px';
            this.after.style[layoutProp] = (total - o2) + 'px';
            this._changeDetectorRef.markForCheck();
        }

        return digestRequired;
    }

    public scrollToElement(itemIndex: number) {
        this.sizes = this.originalCollection.map((item, index) => {
            if (typeof this.vsForSize === 'function') {
                return this.vsForSize(item, index);
            } else if (this.vsForSize) {
                return +this.vsForSize; // number or string
            } else {
                return +this.elementSize;
            }
        });
        let sum = 0;
        this.sizesCumulative = this.sizes.map((size) => {
            const res = sum;
            sum += size;
            return res;
        });
        this.sizesCumulative.push(sum);
        let size1 = this.sizesCumulative[itemIndex];
        this.parent.scrollTop = size1;
        this.updateInnerCollection();
    }

    public _getOffset(index: number) {
        if (typeof this.vsForSize !== 'undefined') {
            return this.sizesCumulative[index + this.startIndex] + this.vsForOffsetBefore;
        }

        return (index + this.startIndex) * this.elementSize + this.vsForOffsetBefore;
    }
}
