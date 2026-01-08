import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

const keyMaps = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
};

/**
 * Useful for Navigation using arrow keys
 */
@Directive({
    selector: '[navigationWalker]',
    exportAs: 'navigationWalker'
})
export class NavigationWalkerDirective implements OnInit, OnDestroy {

    @Input() public navigationWalker: { horizontal: string, vertical: string, ignore: string };
    @Input() public enabled: boolean = true;
    @Output() public onUp = new EventEmitter();
    @Output() public onDown = new EventEmitter();
    @Output() public onLeft = new EventEmitter();
    @Output() public onRight = new EventEmitter();
    @Output() public onReset = new EventEmitter();

    public get currentVertical() {
        return this.verticalTreeWalker[this.verticalIndex].currentNode;
    }

    public get currentHorizontal() {
        return this.horizontalTreeWalker[this.horizontalIndex].currentNode;
    }

    private listener: () => void;
    private horizontalTreeWalker: TreeWalker[] = [];
    private horizontalIndex = -1;
    private verticalTreeWalker: TreeWalker[] = [];
    private verticalIndex = -1;
    private result: any[] = [];
    private ignoredEl: any[] = [];

    constructor(private _el: ElementRef, private _renderer: Renderer2) {
    }

    public ngOnInit(): void {
        // create horizontal and vertical walkers and set current nodes
        this.add(this._el?.nativeElement);
    }

    @HostListener('window:keydown', ['$event, ElementRef'])
    public handleKeyDown(event: KeyboardEvent) {
        if (!this.enabled
            || event.shiftKey || event.ctrlKey || event.altKey
            || !this._el?.nativeElement.contains(event.target)) {
            return;
        }

        let ignoredEl = this.ignoredEl.some(s => {
            return s.contains(event.target);
        });

        if (ignoredEl) {
            return;
        }

        // Select nodes according to key pressed.
        if (event.keyCode === keyMaps.down) {
            this.nextVertical(event);
            this.onDown.emit(this.result);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        } else if (event.keyCode === keyMaps.up) {
            this.result[this.verticalIndex].previousVertical = (this.verticalTreeWalker[this.verticalIndex]).currentNode;
            this.result[this.verticalIndex].currentVertical = (this.verticalTreeWalker[this.verticalIndex]).previousNode();
            this.focusNode(this.result[this.verticalIndex].currentVertical, event);
            this.onUp.emit(this.result[this.verticalIndex]);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        } else if (event.keyCode === keyMaps.left) {
            this.previousHorizontal();
            this.onLeft.emit(this.result[this.horizontalIndex]);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        } else if (event.keyCode === keyMaps.right) {
            this.nextHorizontal();
            this.onRight.emit(this.result[this.horizontalIndex]);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

    /**
     * Adds horizontal and vertical treewalkers
     * @param el node reference to set as current node
     */
    public add(el) {
        this.addHorizontal(el);
        this.addVertical(el);
    }

    /**
     * Adds horizontal treewalker
     * @param el node reference to set as current node
     */
    public addHorizontal(el) {
        (this.horizontalTreeWalker[++this.horizontalIndex]) = this.createTreeWalker(this.navigationWalker.horizontal, this.navigationWalker.ignore, el);
        this.result[this.horizontalIndex] = this.result[this.horizontalIndex] || {};
        this.result[this.horizontalIndex].currentHorizontal = el;
    }

    /**
     * Sets vertical treewalker
     * @param el node reference to set as current node
     */
    public setVertical(el) {
        (this.verticalTreeWalker[this.verticalIndex]) = this.createTreeWalker(this.navigationWalker.vertical, this.navigationWalker.ignore, el);
        this.result[this.verticalIndex] = this.result[this.verticalIndex] || {};
        this.result[this.verticalIndex].currentVertical = el;
    }

    /**
     * Sets horizontal treewalker
     * @param el node reference to set as current node
     */
    public setHorizontal(el) {
        (this.horizontalTreeWalker[this.horizontalIndex]) = this.createTreeWalker(this.navigationWalker.horizontal, this.navigationWalker.ignore, el);
        this.result[this.horizontalIndex] = this.result[this.horizontalIndex] || {};
        this.result[this.horizontalIndex].currentHorizontal = el;
    }

    /**
     * Adds vertical treewalker
     * @param el node reference to set as current node
     */
    public addVertical(el) {
        (this.verticalTreeWalker[++this.verticalIndex]) = this.createTreeWalker(this.navigationWalker.vertical, this.navigationWalker.ignore, el);
        this.result[this.verticalIndex] = this.result[this.verticalIndex] || {};
        this.result[this.verticalIndex].currentVertical = el;
    }

    /**
     * remove last horizontal and vertical walkers
     */
    public remove() {
        this.removeHorizontal();
        this.removeVertical();
    }

    /**
     * remove last horizontal walkers
     */
    public removeHorizontal() {
        if (this.horizontalIndex === 0) {
            return;
        }
        this.horizontalTreeWalker.pop();
        this.horizontalIndex--;
    }

    /**
     * remove last vertical walkers
     */
    public removeVertical(focus = true) {
        if (this.verticalIndex === 0) {
            return;
        }
        this.verticalTreeWalker.pop();
        this.verticalIndex--;
        if (focus) {
            this.focusNode(this.verticalTreeWalker[this.verticalIndex].currentNode);
        }
    }

    public nextHorizontal() {
        this.result[this.horizontalIndex].previousHorizontal = (this.horizontalTreeWalker[this.horizontalIndex]).currentNode;
        this.result[this.horizontalIndex].currentHorizontal = (this.horizontalTreeWalker[this.horizontalIndex]).nextNode();
    }

    public previousHorizontal() {
        this.result[this.horizontalIndex].previousHorizontal = (this.horizontalTreeWalker[this.horizontalIndex]).currentNode;
        this.result[this.horizontalIndex].currentHorizontal = (this.horizontalTreeWalker[this.horizontalIndex]).previousNode();
    }

    public nextVertical(event?, node?) {
        this.result[this.verticalIndex].previousVertical = (this.verticalTreeWalker[this.verticalIndex]).currentNode;
        this.result[this.verticalIndex].currentVertical = node || (this.verticalTreeWalker[this.verticalIndex]).nextNode();
        this.focusNode(this.result[this.verticalIndex].currentVertical, event);
    }

    public setEnabled(value: boolean) {
        this.enabled = value;
    }

    private createTreeWalker(attr: string, ignore?: string, el?): TreeWalker {
        return document.createTreeWalker(
            el || this._el?.nativeElement,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node: any) => {
                    if (ignore && node.attributes.getNamedItem(ignore)) {
                        this.ignoredEl.push(node);
                        return NodeFilter.FILTER_REJECT;
                    } else if (node.attributes.getNamedItem(attr)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
    }

    private focusNode(node = this.result[this.verticalIndex].currentVertical, event?: KeyboardEvent) {
        if (!node) {
            return;
        }
        if (event) {
            event.preventDefault();
        }
        if (this.listener) {
            this.listener();
        }
        // @ts-ignore
        node.focus();
        this.listener = this._renderer.listen(node, 'blur', () => this.resetCurrentNode());
    }

    private resetCurrentNode() {
        while (this.verticalIndex > 0) {
            this.removeVertical(false);
        }
        while (this.horizontalIndex > 0) {
            this.removeHorizontal();
        }
        while (this.result?.length > 1) {
            this.result.pop();
        }
        (this.horizontalTreeWalker[this.horizontalIndex]).currentNode = this._el?.nativeElement;
        (this.verticalTreeWalker[this.verticalIndex]).currentNode = this._el?.nativeElement;
        this.onReset.emit();
    }

    /**
     * Releases memory
     *
     * @memberof NavigationWalkerDirective
     */
    public ngOnDestroy(): void {
        if (this.listener) {
            this.listener();
        }
    }
}
