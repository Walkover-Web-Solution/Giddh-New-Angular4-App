/**
 * Created by yonifarin on 12/3/16.
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { concat, includes, startsWith } from 'apps/web-giddh/src/app/lodash-optimized';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ReplaySubject, takeUntil } from 'rxjs';

const FLATTEN_SEARCH_TERM = 'flatten';

// noinspection TsLint
@Component({
    selector: 'accounting-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AVShSelectProvider(),
            multi: true
        }
    ]
})
export class AVShSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
    @Input() public idEl: string = '';
    @Input() public placeholder: string = '';
    @Input() public multiple: boolean = false;
    @Input() public mode: 'default' | 'inline' = 'default';
    @Input() public showClear: boolean = false;
    @Input() public forceClearReactive: IForceClear;
    @Input() public disabled: boolean;
    @Input() public notFoundMsg: string;
    @Input() public notFoundLinkText: string;
    @Input() public notFoundLink: boolean = false;
    @Input() public isFilterEnabled: boolean = true;
    @Input() public width: string = 'auto';
    @Input() public ItemHeight: number = 41;
    @Input() public NoFoundMsgHeight: number = 35;
    @Input() public NoFoundLinkHeight: number = 35;
    @Input() public dropdownMinHeight: number = 35;
    @Input() public customFilter: (term: string, options: IOption) => boolean;
    @Input() public customSorting: (a: IOption, b: IOption) => number;
    @Input() public useInBuiltFilterForFlattenAc: boolean = false;
    @Input() public useInBuiltFilterForIOptionTypeItems: boolean = false;
    @Input() public doNotReset: boolean = false;
    @Input() public showList: boolean = false;
    @Input() public filterText: string = '';
    @Input() public keydownUpInput: KeyboardEvent;
    /** True when pagination should be enabled */
    @Input() isPaginationEnabled: boolean;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    @ViewChild('inputFilter', { static: false }) public inputFilter: ElementRef;
    @ViewChild('mainContainer', { static: true }) public mainContainer: ElementRef;
    @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;
    @ViewChild('dd', { static: true }) public ele: ElementRef;
    @Output() public onHide: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public onShow: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public onClear: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public selected = new EventEmitter<any>();
    @Output() public noOptionsFound = new EventEmitter<boolean>();
    @Output() public noResultsClicked = new EventEmitter<null>();
    @Output() public viewInitEvent = new EventEmitter<any>();
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    public rows: IOption[] = [];
    public isOpen: boolean = true;
    public filter: string = '';
    public filteredData: IOption[] = [];
    public _selectedValues: IOption[] = [];
    public _options: IOption[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected index  */
    public selectedIndex: number = -1;
    /** True if api call in progress  */
    public loadMoreInProgress: boolean = false;
    /** Emits the typing event  */
    @Output() public typingEvent: EventEmitter<string> = new EventEmitter();
    /** Keys. **/
    private KEYS: any = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        UP: 38,
        DOWN: 40
    };

    constructor(private cdRef: ChangeDetectorRef, private scrollDispatcher: ScrollDispatcher, private eleRef: ElementRef) {
    }

    get options(): IOption[] {
        return this._options;
    }

    @Input() set options(val: IOption[]) {
        this._options = val;
        this.updateRows(val);
    }

    get selectedValues(): any[] {
        return this._selectedValues;
    }

    set selectedValues(val: any[]) {
        if (!val) {
            val = [];
        }

        if (!Array.isArray(val)) {
            val = [val];
        }
        if (val.length > 0 && this.rows) {
            this._selectedValues = this.rows.filter((f: any) => val?.findIndex(p => p === f.label || p === f?.value) !== -1);
        } else {
            this._selectedValues = val;
        }
    }

    /**
     * on click outside the view close the menu
     * @param event
     */
    // @HostListener('window:mouseup', ['$event'])
    // public onDocumentClick(event) {
    //   if (this.isOpen && !this.element.nativeElement.contains(event.target)) {
    //     this.isOpen = true;
    //     if (this.selectedValues && this.selectedValues.length === 1 && !this.multiple) {
    //       this.filter = this.selectedValues[0].label;
    //     } else if (this.doNotReset && this.filter !== '') {
    //       this.propagateChange(this.filter);
    //     } else {
    //       this.clearFilter();
    //     }
    //     this.onHide.emit();
    //   }
    // }

    public updateRows(val: IOption[] = []) {
        this.rows = val;
        this.loadMoreInProgress = false;
        this.cdRef.detectChanges();
    }

    public filterByIOption(array: IOption[], term: string, action: string = 'default') {

        let filteredArr: any[];
        let startsWithArr: any[];
        let includesArr: any[] = [];

        filteredArr = this.getFilteredArrOfIOptionItems(array, term, action);

        startsWithArr = filteredArr?.filter(function (item) {
            if (startsWith(item.label.toLocaleLowerCase(), term) || startsWith(item?.value.toLocaleLowerCase(), term)) {
                return item;
            } else {
                includesArr.push(item);
            }
        });
        startsWithArr = startsWithArr.sort((a, b) => a.label?.length - b.label?.length);
        includesArr = includesArr.sort((a, b) => a.label?.length - b.label?.length);

        return concat(startsWithArr, includesArr);
    }

    public getFilteredArrOfIOptionItems(array: IOption[], term: string, action: string) {
        if (action === FLATTEN_SEARCH_TERM) {
            return array?.filter((item) => {
                let mergedAccounts = item.additional && item.additional.mergedAccounts ?
                    _.cloneDeep(item.additional.mergedAccounts.split(',').map(a => a.trim().toLocaleLowerCase())) : '';
                return _.includes(item.label.toLocaleLowerCase(), term) || _.includes(item.additional?.uniqueName.toLocaleLowerCase(), term) || _.includes(mergedAccounts, term);
            });
        } else {
            return array?.filter((item: IOption) => {
                return includes(item.label.toLocaleLowerCase(), term) || includes(item?.value.toLocaleLowerCase(), term);
            });
        }
    }

    public updateFilter(filterProp) {
        const lowercaseFilter = filterProp.toLocaleLowerCase();
        if (this.useInBuiltFilterForFlattenAc && this._options) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter, FLATTEN_SEARCH_TERM);
        } else if (this._options && this.useInBuiltFilterForIOptionTypeItems) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter);
        } else {
            let filteredData = this._options ? this._options.filter(item => {
                if (this.customFilter) {
                    return this.customFilter(lowercaseFilter, item);
                }
                return !lowercaseFilter || (item.label).toLocaleLowerCase()?.indexOf(lowercaseFilter) !== -1;
            }) : [];

            if (this.customSorting) {
                this.filteredData = filteredData.sort(this.customSorting);
            } else {
                this.filteredData = filteredData.sort((a, b) => a.label?.length - b.label?.length);
            }
        }
        if (this.filteredData?.length === 0) {
            // this.noOptionsFound.emit(true);
            this.updateRows([{
                label: this.commonLocaleData?.app_create_new,
                value: 'createnewitem'
            }]);
        } else {
            this.updateRows(this.filteredData);
        }
    }

    public clearFilter() {
        if (this.filter === '') {
            return;
        }

        this.filter = '';
        if (this.isFilterEnabled) {
            this.updateFilter(this.filter);
        }
    }

    public setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    public toggleSelected(item) {
        let callChanges: boolean = true;
        if (!item) {
            return;
        }
        this.clearFilter();

        if (!this.multiple) {
            if (this._selectedValues[0] && this._selectedValues[0].value === item?.value) {
                callChanges = false;
            }
        }

        if (this.multiple) {
            this.selectMultiple(item);
        } else {
            this.selectSingle(item);
        }

        if (callChanges) {
            this.onChange();
        }
    }

    public selectSingle(item) {
        this._selectedValues.splice(0, this.rows?.length);
        this._selectedValues.push(item);
        this.hide();
    }

    public selectMultiple(item) {
        if (this.selectedValues?.indexOf(item) === -1) {
            this.selectedValues.push(item);
        } else {
            this.selectedValues.splice(this.selectedValues?.indexOf(item), 1);
        }
    }

    public focusFilter() {
        if (this.isFilterEnabled && this.filter && this.filter !== '') {
            // this.updateFilter(this.filter);
        }
        setTimeout(() => {
            (this.inputFilter?.nativeElement as any)['focus'].apply(this.inputFilter?.nativeElement);
        }, 0);
    }

    public show() {
        if (this.isOpen || this.disabled) {
            return;
        }

        this.isOpen = true;
        // this.focusFilter();
        this.onShow.emit();
        this.cdRef.markForCheck();
    }

    /**
     * This will be use for keyboard handler
     *
     * @param {*} event
     * @memberof AVShSelectComponent
     */
    public keydownUp(event: any): void {
        const elements = this.eleRef?.nativeElement?.querySelectorAll('.list-item');
        let key = event.which;
        if (this.isOpen) {
            if (key === this.KEYS.ESC || key === this.KEYS.TAB || (key === this.KEYS.UP && event.altKey)) {
                this.hide();
            } else if (key === this.KEYS.ENTER) {
                const selectedElement = elements[this.selectedIndex];
                const anchorElement = selectedElement?.firstChild as HTMLElement;
                anchorElement?.click();
            } else if (key === this.KEYS.UP) {
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            } else if (key === this.KEYS.DOWN) {
                event.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.rows.length - 1);
            }
            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    if (index === this.selectedIndex) {
                        element.classList.add('hilighted');
                    } else {
                        element.classList.remove('hilighted');
                    }
                });
                elements[this.selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
        this.cdRef.detectChanges();
    }

    public hide(event?) {
        if (event) {
            if (event.relatedTarget && (!this.ele?.nativeElement.contains(event.relatedTarget))) {
                this.isOpen = false;
                if (this.selectedValues && this.selectedValues.length === 1) {
                    this.filter = this.selectedValues[0].label;
                } else {
                    this.clearFilter();
                }
                this.onHide.emit();
            }
        } else if (this.isOpen && this.doNotReset && this.filter !== '') {
            this.isOpen = false;
            this.propagateChange(this.filter);
            this.onHide.emit();
        } else {
            this.isOpen = false;
            if (this.selectedValues && this.selectedValues.length === 1) {
                this.filter = this.selectedValues[0].label;
            } else {
                this.clearFilter();
            }
            this.onHide.emit();
        }
        this.cdRef.markForCheck();
    }

    public filterInputBlur(event) {
        if (event.relatedTarget && this.ele?.nativeElement) {
            if (this.ele?.nativeElement.contains(event.relatedTarget)) {
                return false;
            } else if (this.doNotReset && event && event.target && event.target.value) {
                return false;
            } else {
                this.hide();
            }
        }
    }

    public clear() {
        if (this.disabled) {
            return;
        }

        this.selectedValues = [];
        this.onChange();
        this.clearFilter();
        this.onClear.emit();
        this.hide();
    }

    public ngOnInit() {
        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event && event?.getDataLength() - event?.getRenderedRange().end < 20 && !this.loadMoreInProgress) {
                this.loadMoreInProgress = true;
                this.scrollEnd.emit()
                this.cdRef.detectChanges();
            }
        });
    }

    public ngAfterViewInit() {
        this.viewInitEvent.emit(true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('forceClearReactive' in changes && !changes.forceClearReactive.firstChange) {
            if (this.forceClearReactive?.status) {
                this.filter = '';
                this.clear();
            }
        }
        if ('showList' in changes && changes.showList.currentValue !== changes.showList.previousValue) {
            if (changes.showList.currentValue) {
                this.selectedIndex = 0;
                this.show();
            } else if (!changes.showList.currentValue) {
                this.filter = this.selectedValues[0] ? this.selectedValues[0].label : '';
                this.hide();
            }
        }
        if ('keydownUpInput' in changes && changes.keydownUpInput.currentValue !== changes.keydownUpInput.previousValue) {
            this.keydownUp(changes.keydownUpInput.currentValue);
        }
    }

    //////// ControlValueAccessor imp //////////

    public writeValue(value: any) {
        this.selectedValues = value;
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    }

    public propagateChange(_: any) {
        //
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
        //
    }

    public clearSingleSelection(event, option: IOption) {
        event.stopPropagation();
        this.selectedValues = this.selectedValues?.filter(f => f?.value !== option?.value).map(p => p?.value);
        this.onChange();
    }

    public onChange() {
        if (this.multiple) {
            let newValues: string[];
            newValues = this._selectedValues.map(p => p?.value);
            this.propagateChange(newValues);
            this.selected.emit(this._selectedValues);
        } else {
            let newValue: IOption;
            if (this.selectedValues?.length > 0) {
                newValue = this.selectedValues[0];
            }
            if (!newValue) {
                newValue = {
                    value: null,
                    label: null,
                    additional: null
                };
            }
            this.filter = newValue.label;
            this.propagateChange(newValue?.value);
            this.selected.emit(newValue);
        }
    }

    /**
     * This will be use for key down events for list items highlighting
     *
     * @param {KeyboardEvent} event
     * @memberof AVShSelectComponent
     */
    public handleKeyDown(event: KeyboardEvent): void {

    }

    /**
     * Handles new column added usually when group/link is clicked
     *
     * @param {*} [element]
     * @param {*} [navigation]
     * @memberof AVShSelectComponent
     */
    public onColAdd(element?: any, navigation?: any): void {
        setTimeout(() => {
            navigation.add(element?.nativeElement);
            navigation.nextVertical();
        }, 200);
    }

    /**
     * Initializes navigator
     *
     * @param {*} [navigator]
     * @param {*} [element]
     * @memberof AVShSelectComponent
     */
    public initNavigator(navigator?: any, element?: any): void {
        navigator.add(element);
    }

}

export function AVShSelectProvider(): any {
    return forwardRef(() => AVShSelectComponent);
}

