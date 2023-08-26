import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Option } from './option';
import { OptionList } from './option-list';

@Component({
    selector: 'select-dropdown',
    templateUrl: './select-dropdown.component.html',
    styleUrls: ['./select-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectDropdownComponent
    implements AfterViewInit, OnChanges, OnInit, OnDestroy {

    @Input() public filterEnabled: boolean;
    @Input() public highlightColor: string;
    @Input() public highlightTextColor: string;
    @Input() public left: number;
    @Input() public multiple: boolean;
    @Input() public isTypeAheadMode: boolean;
    @Input() public notFoundMsg: string;
    @Input() public noResultLinkEnabled: boolean;
    @Input() public optionList: OptionList;
    @Input() public top: number;
    @Input() public width: number;
    @Input() public placeholder: string;
    @Input() public optionTemplate: TemplateRef<any>;
    /** True when pagination should be enabled */
    @Input() isPaginationEnabled: boolean;
    /** True if the compoonent should be used as dynamic search component instead of static search */
    @Input() public enableDynamicSearch: boolean;

    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    @Output() public optionClicked = new EventEmitter<Option>();
    @Output() public optionsListClick = new EventEmitter<null>();
    @Output() public singleFilterClick = new EventEmitter<null>();
    @Output() public singleFilterFocus = new EventEmitter<null>();
    @Output() public singleFilterInput = new EventEmitter<string>();
    @Output() public singleFilterKeydown = new EventEmitter<any>();
    @Output() public noResultClicked = new EventEmitter<null>();
    /** Emits dynamic searched query */
    @Output() public dynamicSearchedQuery: EventEmitter<string> = new EventEmitter();

    @ViewChild('filterInput', { static: false }) public filterInput: any;
    @ViewChild('optionsList', { static: true }) public optionsList: any;

    public disabledColor: string = '#fff';
    public disabledTextColor: string = '9e9e9e';
    /** To unsubscrible the listener */
    public scrollListener: any;

    /** To unsubscribe from the dynamic search query subscription */
    private stopDynamicSearch$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private renderer: Renderer2
    ) { }

    public ngOnInit() {
        this.optionsReset();
        this.scrollListener = this.renderer.listen(this.optionsList?.nativeElement, 'scroll', () => {
            if (this.isPaginationEnabled) {
                // Scrolled to bottom
                if ((this.optionsList?.nativeElement?.scrollHeight - this.optionsList?.nativeElement?.scrollTop) === this.optionsList?.nativeElement?.clientHeight) {
                    this.scrollEnd.emit();
                }
            }
        });
    }

    public ngOnChanges(changes: any) {
        if (changes.hasOwnProperty('optionList')) {
            this.optionsReset();
        }
    }

    /**
     * Releases the occupied sources
     *
     * @memberof SelectDropdownComponent
     */
    public ngOnDestroy(): void {
        if (this.scrollListener) {
            this.scrollListener();
        }
        this.stopDynamicSearch$.next(true);
        this.stopDynamicSearch$.complete();
    }

    public ngAfterViewInit() {
        this.moveHighlightedIntoView();
        if ((!this.multiple && !this.isTypeAheadMode) && this.filterEnabled) {
            this.filterInput?.nativeElement.focus();
        }
        this.subscribeToQueryChange();
    }

    public onOptionsListClick() {
        this.optionsListClick.emit(null);
    }

    public onSingleFilterClick() {
        this.singleFilterClick.emit(null);
    }

    public onSingleFilterInput(event: any) {
        if (!this.enableDynamicSearch) {
            this.singleFilterInput.emit(event.target?.value);
        }
    }

    public onSingleFilterKeydown(event: any) {
        this.singleFilterKeydown.emit(event);
    }

    public onSingleFilterFocus() {
        this.singleFilterFocus.emit(null);
    }

    public onOptionsWheel(event: any) {
        this.handleOptionsWheel(event);
    }

    public onOptionMouseover(option: Option) {
        this.optionList.highlightOption(option);
    }

    public onOptionClick(option: Option) {
        this.optionClicked.emit(option);
    }

    public onNoResultClick() {
        this.noResultClicked.emit();
    }

    /** View. **/

    public getOptionStyle(option: Option): any {
        if (option.highlighted) {
            let style: any = {};

            if (typeof this.highlightColor !== 'undefined') {
                style['background-color'] = this.highlightColor;
            }
            if (typeof this.highlightTextColor !== 'undefined') {
                style['color'] = this.highlightTextColor;
            }
            return style;
        } else {
            return {};
        }
    }

    public moveHighlightedIntoView() {

        let list = this.optionsList?.nativeElement;
        let listHeight = list.offsetHeight;

        let itemIndex = this.optionList.getHighlightedIndex();

        if (itemIndex > -1) {
            let item = list.children[0].children[itemIndex];
            let itemHeight = item.offsetHeight;

            let itemTop = itemIndex * itemHeight;
            let itemBottom = itemTop + itemHeight;

            let viewTop = list.scrollTop;
            let viewBottom = viewTop + listHeight;

            if (itemBottom > viewBottom) {
                list.scrollTop = itemBottom - listHeight;
            } else if (itemTop < viewTop) {
                list.scrollTop = itemTop;
            }
        }
    }

    /**
     * Subscribes to query change for dynamic search
     *
     * @memberof SelectComponent
     */
    public subscribeToQueryChange(): void {
        if (this.enableDynamicSearch) {
            fromEvent(this.filterInput?.nativeElement, 'input').pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.stopDynamicSearch$)).subscribe((event: any) => {
                this.dynamicSearchedQuery.emit(event?.target?.value?.trim());
            });
        }
    }

    /** Initialization. **/

    private optionsReset() {
        this.optionList.filter('');
        this.optionList.highlight();
    }

    private handleOptionsWheel(e: any) {
        let div = this.optionsList?.nativeElement;
        let atTop = div.scrollTop === 0;
        let atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

        if (atTop && e.deltaY < 0) {
            e.preventDefault();
        } else if (atBottom && e.deltaY > 0) {
            e.preventDefault();
        }
    }
}
