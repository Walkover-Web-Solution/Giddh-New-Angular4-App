import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, ExistingProvider, forwardRef, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectDropdownComponent } from './select-dropdown.component';
import { IOption } from './option.interface';
import { Option } from './option';
import { OptionList } from './option-list';

export const SELECT_VALUE_ACCESSOR: ExistingProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
};

@Component({
    selector: 'ng-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [SELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})

export class SelectComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit {

    // Data input.
    @Input() public options: IOption[] = [];

    // Functionality settings.
    @Input() public allowClear: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public multiple: boolean = false;
    @Input() public noFilter: number = 0;
    @Input() public notFoundLink: boolean = false;
    @Input() public isTypeAheadMode: boolean = false;

    // Style settings.
    @Input() public highlightColor: string = '#f4f5f8';
    @Input() public highlightTextColor: string = '#d25f2a';

    // Text settings.
    @Input() public notFoundMsg: string = 'No results found';
    @Input() public placeholder: string = '';
    @Input() public filterPlaceholder: string = '';
    @Input() public label: string = '';

    // Output events.
    @Output() public opened = new EventEmitter<null>();
    @Output() public closed = new EventEmitter<null>();
    @Output() public selected = new EventEmitter<IOption>();
    @Output() public deselected = new EventEmitter<IOption | IOption[]>();
    @Output() public focus = new EventEmitter<null>();
    @Output() public blur = new EventEmitter<null>();
    @Output() public noOptionsFound = new EventEmitter<string>();
    @Output() public noResultsClicked = new EventEmitter<null>();
    @Output() public viewInitEvent = new EventEmitter<any>();

    @ViewChild('selection') public selectionSpan: ElementRef;
    @ViewChild('dropdown') public dropdown: SelectDropdownComponent;
    @ViewChild('filterInput') public filterInput: ElementRef;

    @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;

    // View state variables.
    public optionList: OptionList = new OptionList([]);
    public placeholderView: string = '';
    public hasFocus: boolean = false;
    public isOpen: boolean = false;
    public filterEnabled: boolean = true;
    public isBelow: boolean = true;

    // Width and position for the dropdown container.
    public width: number;
    public top: number;
    public left: number;
    public onChange = (_: any) => {
        //
    }
    public onTouched = () => {
        //
    }
    private filterInputWidth: number = 1;
    private isDisabled: boolean = false;
    private clearClicked: boolean = false;
    // private showTypeAheadInput: boolean = false;
    private selectContainerClicked: boolean = false;
    private focused: boolean = false;
    private optionListClicked: boolean = false;
    private optionClicked: boolean = false;
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

    constructor(private hostElement: ElementRef) {
    }

    private _value: any[] = [];

    /** Value. **/

    get value(): string | string[] {
        return this.multiple ? this._value : this._value[0];
    }

    set value(v: string | string[]) {
        if (typeof v === 'undefined' || v === null || v === '') {
            v = [];
        } else if (typeof v === 'string') {
            v = [v];
        } else if (!Array.isArray(v)) {
            throw new TypeError('Value must be a string or an array.');
        }

        this.optionList.value = v;
        this._value = v;
        this.updateState();
    }

    /** Event handlers. **/

    public ngOnInit() {
        this.placeholderView = this.placeholder;
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.handleInputChanges(changes);
    }

    public ngAfterViewInit() {
        this.updateState();
        this.viewInitEvent.emit();
    }

    @HostListener('window:blur')
    public onWindowBlur() {
        this._blur();
    }

    @HostListener('window:click')
    public onWindowClick() {
        if (!this.selectContainerClicked &&
            (!this.optionListClicked || (this.optionListClicked && this.optionClicked))) {
            this.closeDropdown(this.optionClicked);
            if (!this.optionClicked) {
                this._blur();
            }
        }
        this.clearClicked = false;
        this.selectContainerClicked = false;
        this.optionListClicked = false;
        this.optionClicked = false;
    }

    @HostListener('window:resize')
    public onWindowResize() {
        this.updateWidth();
    }

    public onSelectContainerClick(event: any) {
        this.selectContainerClicked = true;
        if (!this.focused) {
            this.processMyLogic();
        }
        this.focused = false;
    }

    public onSelectContainerFocus() {
        let initialFocusValue = this.hasFocus;
        this._focus();
        if (!initialFocusValue) {
            this.processMyLogic();
            this.focused = true;
        }
    }

    public processMyLogic() {
        if (this.isTypeAheadMode) {
            if (this.optionList.hasSelected) {
                this.isOpen = false;
                this.filter(this.optionList.selection[0].label);
            }
        } else {
            if (!this.clearClicked) {
                this.toggleDropdown();
            }
        }
    }

    public onSelectContainerKeydown(event: any) {
        this.handleSelectContainerKeydown(event);
    }

    public onOptionsListClick() {
        this.optionListClicked = true;
    }

    public onDropdownOptionClicked(option: Option) {
        this.optionClicked = true;
        this.multiple ? this.toggleSelectOption(option) : this.selectOption(option);
    }

    public onSingleFilterClick() {
        this.selectContainerClicked = true;
    }

    public onSingleFilterFocus() {
        this._focus();
    }

    public onFilterInput(term: string) {
        this.filter(term);
    }

    public onSingleFilterKeydown(event: any) {
        this.handleSingleFilterKeydown(event);
    }

    public onMultipleFilterKeydown(event: any) {
        this.handleMultipleFilterKeydown(event);
    }

    public onMultipleFilterKeyup(event: any) {
        this.handleMultipleFilterKeyup(event);
    }

    public onMultipleFilterFocus(event: any) {
        this._focus();
    }

    public onTypeAheadFilterFocus() {
        let initialFocusValue = this.hasFocus;
        this._focus();
        if (!initialFocusValue) {
            this.processMyLogic();
            this.focused = true;
        }
        // this._focus();
    }

    public onTypeAheadFilterKeydown(event: any) {
        this.handleMultipleFilterKeydown(event);
    }

    public onTypeAheadFilterKeyup(event: any) {
        this.handleMultipleFilterKeyup(event);
    }

    public onClearSelectionClick(event: any) {
        this.clearClicked = true;
        this.clearSelection();
        this.closeDropdown(true);
    }

    public onDeselectOptionClick(option: Option) {
        this.clearClicked = true;
        this.deselectOption(option);
    }

    public onNoResultClicked() {
        this.noResultsClicked.emit(null);
    }

    /** API. **/

    // TODO fix issues with global click/key handler that closes the dropdown.
    public open() {
        this.openDropdown();
    }

    public close() {
        this.closeDropdown(false);
    }

    public clear() {
        this.clearSelection();
    }

    public select(value: string | string[]) {
        this.writeValue(value);
    }

    /** ControlValueAccessor interface methods. **/

    public writeValue(value: any) {
        this.value = value;
    }

    public registerOnChange(fn: (_: any) => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    /** View. **/

    public _blur() {
        if (this.hasFocus) {
            this.hasFocus = false;
            this.onTouched();
            this.blur.emit(null);
        }
    }

    public _focus() {
        if (!this.hasFocus) {
            this.hasFocus = true;
            this.focus.emit(null);
        }
    }

    public _focusSelectContainer() {
        this.selectionSpan.nativeElement.focus();
    }

    /** Input change handling. **/

    private handleInputChanges(changes: SimpleChanges) {
        let optionsChanged: boolean = changes.hasOwnProperty('options');
        let noFilterChanged: boolean = changes.hasOwnProperty('noFilter');
        let placeholderChanged: boolean = changes.hasOwnProperty('placeholder');

        if (optionsChanged) {
            this.updateOptionList(changes.options.currentValue);
        }
        if (optionsChanged || noFilterChanged) {
            this.updateFilterEnabled();
        }
        if (placeholderChanged) {
            this.updateState();
        }
    }

    private updateOptionList(options: IOption[]) {
        this.optionList = new OptionList(options);
        this.optionList.value = this._value;
    }

    private updateFilterEnabled() {
        this.filterEnabled = this.optionList.options.length >= this.noFilter;
    }

    private valueChanged() {
        this._value = this.optionList.value;
        this.updateState();
        this.onChange(this.value);
    }

    private updateState() {
        this.placeholderView = this.optionList.hasSelected ? '' : this.placeholder;
        this.updateFilterWidth();
    }

    /** Select. **/

    private selectOption(option: Option) {
        if (!option.selected && !option.disabled) {
            this.optionList.select(option, this.multiple, this.isTypeAheadMode);

            this.valueChanged();
            this.selected.emit(option.wrappedOption);
        }
    }

    private deselectOption(option: Option) {
        if (option.selected) {
            this.optionList.deselect(option);
            this.valueChanged();
            this.deselected.emit(option.wrappedOption);

            setTimeout(() => {
                if (this.multiple) {
                    this.updatePosition();
                    this.optionList.highlight();
                    if (this.isOpen) {
                        this.dropdown.moveHighlightedIntoView();
                    }
                }
            });
        }
    }

    private clearSelection() {
        let selection: Option[] = this.optionList.selection;
        if (selection.length > 0) {
            this.optionList.clearSelection();
            this.valueChanged();

            if (selection.length === 1) {
                this.deselected.emit(selection[0].wrappedOption);
            } else {
                this.deselected.emit(selection.map(option => option.wrappedOption));
            }
        }
    }

    private clearSelectionManually() {
        let selection: Option[] = this.optionList.selection;
        if (selection.length > 0) {
            if (selection.length === 1) {
                this.deselected.emit(selection[0].wrappedOption);
            } else {
                this.deselected.emit(selection.map(option => option.wrappedOption));
            }
            this.optionList.clearSelection();
            // this.valueChanged();
        }
    }

    private toggleSelectOption(option: Option) {
        option.selected ? this.deselectOption(option) : this.selectOption(option);
    }

    private selectHighlightedOption() {
        let option: Option = this.optionList.highlightedOption;
        if (option !== null) {
            this.selectOption(option);
            this.closeDropdown(true);
        }
    }

    private deselectLast() {
        let sel: Option[] = this.optionList.selection;

        if (sel.length > 0) {
            let option: Option = sel[sel.length - 1];
            this.deselectOption(option);
            if (!this.isTypeAheadMode) {
                this.setMultipleFilterInput(option.label + ' ');
            }
        }
    }

    /** Dropdown. **/

    private toggleDropdown() {
        if (!this.isDisabled) {
            this.isOpen ? this.closeDropdown(true) : this.openDropdown();
        }
    }

    private openDropdown() {
        if (!this.isOpen) {
            this.updateWidth();
            this.updatePosition();
            this.isOpen = true;
            if ((this.multiple || this.isTypeAheadMode) && this.filterEnabled) {
                this.filterInput.nativeElement.focus();
            }
            this.opened.emit(null);
        }
    }

    private closeDropdown(focus: boolean) {
        if (this.isOpen) {
            this.clearFilterInput();
            this.updateFilterWidth();
            this.isOpen = false;
            if (focus) {
                this._focusSelectContainer();
            }
            this.closed.emit(null);
        }
    }

    /** Filter. **/

    private filter(term: string) {
        if (this.multiple || this.isTypeAheadMode) {
            if (!this.isOpen) {
                this.openDropdown();
            }
            this.updateFilterWidth();
        }
        setTimeout(() => {
            let hasShown: boolean = this.optionList.filter(term);
            if (!hasShown) {
                this.noOptionsFound.emit(term);
            }
        });
    }

    private clearFilterInput() {
        if (this.multiple && this.filterEnabled) {
            this.filterInput.nativeElement.value = '';
        } else if (this.isTypeAheadMode && this.filterEnabled) {
            this.filterInput.nativeElement.value = this.optionList.selection.length > 0 ? this.optionList.selection[0].label : '';
        }
    }

    private setMultipleFilterInput(value: string) {
        if (this.filterEnabled) {
            this.filterInput.nativeElement.value = value;
        }
    }

    private handleSelectContainerKeydown(event: any) {
        let key = event.which;

        if (this.isOpen) {
            if (key === this.KEYS.ESC || (key === this.KEYS.UP && event.altKey)) {
                this.closeDropdown(true);
            } else if (key === this.KEYS.TAB) {
                this.closeDropdown(event.shiftKey);
                this._blur();
            } else if (key === this.KEYS.ENTER) {
                this.selectHighlightedOption();
            } else if (key === this.KEYS.UP) {
                this.optionList.highlightPreviousOption();
                this.dropdown.moveHighlightedIntoView();
                if (!this.filterEnabled) {
                    event.preventDefault();
                }
            } else if (key === this.KEYS.DOWN) {
                this.optionList.highlightNextOption();
                this.dropdown.moveHighlightedIntoView();
                if (!this.filterEnabled) {
                    event.preventDefault();
                }
            }
        } else {
            // DEPRICATED --> SPACE
            if (key === this.KEYS.ENTER || key === this.KEYS.SPACE ||
                (key === this.KEYS.DOWN && event.altKey)) {

                /* FIREFOX HACK:
                 *
                 * The setTimeout is added to prevent the enter keydown event
                 * to be triggered for the filter input field, which causes
                 * the dropdown to be closed again.
                 */
                setTimeout(() => {
                    this.openDropdown();
                });
            } else if (key === this.KEYS.TAB) {
                this._blur();
            }
        }

    }

    private handleMultipleFilterKeydown(event: any) {
        let key = event.which;
        if (key === this.KEYS.BACKSPACE) {
            if (this.optionList.hasSelected && this.filterEnabled &&
                (this.filterInput.nativeElement.value === '' && !this.isTypeAheadMode)) {
                this.deselectLast();
            } else if (this.optionList.hasSelected && this.filterEnabled &&
                (this.filterInput.nativeElement.value === '' || (this.filterInput.nativeElement.value.length === 1 && this.isTypeAheadMode))) {
                this.clearSelectionManually();
            }
        }
    }

    private handleMultipleFilterKeyup(event: any) {
        // let key = event.which;
        // if (key === this.KEYS.BACKSPACE) {
        //   if (this.optionList.hasSelected && this.filterEnabled &&
        //     (this.filterInput.nativeElement.value === '' || (this.filterInput.nativeElement.value.length === 1 && this.isTypeAheadMode))) {
        //     this.deselectLast();
        //   }
        // }
    }

    private handleSingleFilterKeydown(event: any) {
        let key = event.which;

        if (key === this.KEYS.ESC || key === this.KEYS.TAB
            || key === this.KEYS.UP || key === this.KEYS.DOWN
            || key === this.KEYS.ENTER) {
            this.handleSelectContainerKeydown(event);
        }
    }

    private updateWidth() {
        this.width = this.selectionSpan.nativeElement.getBoundingClientRect().width;
    }

    private updatePosition() {
        const hostRect = this.hostElement.nativeElement.getBoundingClientRect();
        const spanRect = this.selectionSpan.nativeElement.getBoundingClientRect();
        this.left = spanRect.left - hostRect.left;
        this.top = (spanRect.top - hostRect.top) + spanRect.height;
    }

    private updateFilterWidth() {
        if (typeof this.filterInput !== 'undefined') {
            let value: string = this.filterInput.nativeElement.value;
            this.filterInputWidth = value.length === 0 ?
                1 + this.placeholderView.length * 10 : 1 + value.length * 10;
        }
    }
}
