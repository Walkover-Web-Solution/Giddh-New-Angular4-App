/**
 * Created by yonifarin on 12/3/16.
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, Renderer, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption } from './sh-options.interface';
import { SalesShSelectMenuComponent } from './sh-select-menu.component';
import { concat, includes, startsWith } from 'apps/web-giddh/src/app/lodash-optimized';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';

const FLATTEN_SEARCH_TERM = 'flatten';

// noinspection TsLint
@Component({
    selector: 'sales-sh-select',
    templateUrl: './sh-select.component.html',
    styleUrls: ['./sh-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ShSelectProvider(),
            multi: true
        }
    ]
})
export class SalesShSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
    @Input() public idEl: string = '';
    @Input() public placeholder: string = 'Type to filter';
    @Input() public multiple: boolean = false;
    @Input() public mode: 'default' | 'inline' = 'default';
    @Input() public showClear: boolean = false;
    @Input() public forceClearReactive: IForceClear;
    @Input() public disabled: boolean;
    @Input() public notFoundMsg: string = 'No results found';
    @Input() public notFoundLinkText: string = 'Create New';
    @Input() public notFoundLink: boolean = false;
    @ContentChild('notFoundLinkTemplate') public notFoundLinkTemplate: TemplateRef<any>;
    @Input() public isFilterEnabled: boolean = true;
    @Input() public width: string = 'auto';
    @Input() public ItemHeight: number = 41;
    @Input() public NoFoundMsgHeight: number = 30;
    @Input() public NoFoundLinkHeight: number = 30;
    @Input() public dropdownMinHeight: number = 35;
    @Input() public customFilter: (term: string, options: IOption) => boolean;
    @Input() public customSorting: (a: IOption, b: IOption) => number;
    @Input() public useInBuiltFilterForFlattenAc: boolean = false;
    @Input() public useInBuiltFilterForIOptionTypeItems: boolean = false;
    @Input() public doNotReset: boolean = false;
    @Input() public showLabelOnly: boolean = false;
    @Input() public showBottomBorderOnly: boolean = false;
    @Input() public salesShSelectPading: number = 0;
    @Input() public tabIndex: number = 0;
    @Input() public fixedValue: string = "";

    @ViewChild('inputFilter') public inputFilter: ElementRef;
    @ViewChild('mainContainer') public mainContainer: ElementRef;
    @ViewChild('menuEle') public menuEle: SalesShSelectMenuComponent;
    @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;
    @ViewChild('dd') public ele: ElementRef;
    @Output() public onHide: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public onShow: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public onClear: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() public selected = new EventEmitter<any>();
    @Output() public noOptionsFound = new EventEmitter<boolean>();
    @Output() public noResultsClicked = new EventEmitter<null>();
    @Output() public viewInitEvent = new EventEmitter<any>();
    public rows: IOption[] = [];
    public isOpen: boolean;
    public filter: string = '';
    public filteredData: IOption[] = [];
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

    constructor(private element: ElementRef, private renderer: Renderer, private cdRef: ChangeDetectorRef) {
    }

    public _options: IOption[] = [];

    get options(): IOption[] {
        return this._options;
    }

    @Input() set options(val: IOption[]) {
        this._options = val;
        this.updateRows(val);
    }

    public _selectedValues: IOption[] = [];

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
            this._selectedValues = this.rows.filter((f: any) => val.findIndex(p => p === f.label || p === f.value) !== -1);
        } else {
            this._selectedValues = val;
        }
    }

    /**
     * on click outside the view close the menu
     * @param event
     */
    @HostListener('window:mouseup', ['$event'])
    public onDocumentClick(event) {
        if (this.isOpen && !this.element.nativeElement.contains(event.target)) {
            this.isOpen = false;
            if (this.selectedValues && this.selectedValues.length === 1 && !this.multiple) {
                this.filter = this.selectedValues[0].label;
            } else if (this.doNotReset && this.filter !== '') {
                this.propagateChange(this.filter);
            } else {
                this.clearFilter();

                if (this.fixedValue) {
                    this.filter = this.fixedValue;
                }
            }
            this.onHide.emit();
        }
    }

    public updateRows(val: IOption[] = []) {
        this.rows = val;
    }

    public filterByIOption(array: IOption[], term: string, action: string = 'default') {

        let filteredArr: any[];
        let startsWithArr: any[];
        let includesArr: any[] = [];

        filteredArr = this.getFilteredArrOfIOptionItems(array, term, action);

        startsWithArr = filteredArr.filter(function (item) {
            if (startsWith(item.label.toLocaleLowerCase(), term) || startsWith(item.value.toLocaleLowerCase(), term)) {
                return item;
            } else {
                includesArr.push(item);
            }
        });
        startsWithArr = startsWithArr.sort((a, b) => a.label.length - b.label.length);
        includesArr = includesArr.sort((a, b) => a.label.length - b.label.length);

        return concat(startsWithArr, includesArr);
    }

    public getFilteredArrOfIOptionItems(array: IOption[], term: string, action: string) {
        if (action === FLATTEN_SEARCH_TERM) {
            return array.filter((item) => {
                let mergedAccounts = _.cloneDeep(item.additional.mergedAccounts.split(',').map(a => a.trim().toLocaleLowerCase()));
                return _.includes(item.label.toLocaleLowerCase(), term) || _.includes(item.additional.uniqueName.toLocaleLowerCase(), term) || _.includes(mergedAccounts, term);
            });
        } else {
            return array.filter((item: IOption) => {
                return includes(item.label.toLocaleLowerCase(), term) || includes(item.value.toLocaleLowerCase(), term);
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
                return !lowercaseFilter || (item.label).toLocaleLowerCase().indexOf(lowercaseFilter) !== -1;
            }) : [];

            if (this.customSorting) {
                this.filteredData = filteredData.sort(this.customSorting);
            } else {
                this.filteredData = filteredData.sort((a, b) => a.label.length - b.label.length);
            }
        }
        if (this.filteredData.length === 0) {
            this.noOptionsFound.emit(true);
        }
        this.updateRows(this.filteredData);
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
            if (this._selectedValues[0] && this._selectedValues[0].value === item.value) {
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
        this._selectedValues.splice(0, this.rows.length);
        this._selectedValues.push(item);
        this.hide();
    }

    public selectMultiple(item) {
        if (this.selectedValues.indexOf(item) === -1) {
            this.selectedValues.push(item);
        } else {
            this.selectedValues.splice(this.selectedValues.indexOf(item), 1);
        }
    }

    public show(e: any) {
        if (this.isOpen || this.disabled) {
            return;
        }

        this.isOpen = true;
        this.onShow.emit();
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
            let item = this.rows.find(p => p.value === (this._selectedValues.length > 0 ? this._selectedValues[0] : (this.rows.length > 0 ? this.rows[0].value : null)));
            if (item !== null) {
                this.menuEle.virtualScrollElm.scrollInto(item);
            }
        }
        this.cdRef.markForCheck();

        setTimeout(() => {
            this.inputFilter.nativeElement.focus();
        }, 500);
    }

    public keydownUp(event) {
        let key = event.which;
        if (this.isOpen) {
            if (key === this.KEYS.ESC || key === this.KEYS.TAB || (key === this.KEYS.UP && event.altKey)) {
                this.hide();
            } else if (key === this.KEYS.ENTER) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    let item = this.menuEle.virtualScrollElm.getHighlightedOption();
                    if (item !== null) {
                        this.toggleSelected(item);
                    }
                }
            } else if (key === this.KEYS.UP) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    let item = this.menuEle.virtualScrollElm.getPreviousHilightledOption();
                    if (item !== null) {
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
            } else if (key === this.KEYS.DOWN) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    let item = this.menuEle.virtualScrollElm.getNextHilightledOption();
                    if (item !== null) {
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
            }
        }
        this.cdRef.detectChanges();
    }

    public hide(event?) {
        if (event) {
            if (event.relatedTarget && (!this.ele.nativeElement.contains(event.relatedTarget))) {
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
        if (event.relatedTarget && this.ele.nativeElement) {
            if (this.ele.nativeElement.contains(event.relatedTarget)) {
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
        //
    }

    public ngAfterViewInit() {
        this.viewInitEvent.emit(true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('forceClearReactive' in changes && !changes.forceClearReactive.firstChange) {
            if (this.forceClearReactive.status) {
                this.filter = '';
                this.clear();

                if (this.fixedValue) {
                    this.filter = this.fixedValue;
                }
            }
        }

        if ('fixedValue' in changes) {
            if (changes.fixedValue && changes.fixedValue.currentValue) {
                this.filter = changes.fixedValue.currentValue;
                this.writeValue(this.filter);
            }
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
        this.selectedValues = this.selectedValues.filter(f => f.value !== option.value).map(p => p.value);
        this.onChange();
    }

    public onChange() {
        if (this.multiple) {
            let newValues: string[];
            newValues = this._selectedValues.map(p => p.value);
            this.propagateChange(newValues);
            this.selected.emit(this._selectedValues);
        } else {
            let newValue: IOption;
            if (this.selectedValues.length > 0) {
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
            this.propagateChange(newValue.value);
            this.selected.emit(newValue);
        }
    }

    public selectText(ev) {
        ev.target.setSelectionRange(0, ev.target.value.length);
    }

    public openListIfNotOpened(ev) {
        if (!this.isOpen) {
            this.filter = ev.target.value;
            this.show(ev);
            setTimeout(() => {
                this.renderer.invokeElementMethod(this.inputFilter.nativeElement, 'focus');
            }, 10);
        }
    }
}

export function ShSelectProvider(): any {
    return forwardRef(() => SalesShSelectComponent);
}
