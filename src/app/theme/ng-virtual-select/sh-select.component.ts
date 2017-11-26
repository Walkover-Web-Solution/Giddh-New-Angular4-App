/**
 * Created by yonifarin on 12/3/16.
 */
import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, Renderer, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption } from './sh-options.interface';
import { ShSelectMenuComponent } from './sh-select-menu.component';

// noinspection TsLint
@Component({
  selector: 'sh-select',
  templateUrl: './sh-select.component.html',
  styleUrls: [`./sh-select.component.css`],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ShSelectProvider(),
      multi: true
    }
  ]
})
export class ShSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() public placeholder: string = 'Type to filter';
  @Input() public multiple: boolean = false;
  @Input() public mode: 'default' | 'inline' = 'default';
  @Input() public showClear: boolean = true;
  @Input() public disabled: boolean;
  @Input() public notFoundMsg: string = 'No results found';
  @Input() public notFoundLink: boolean = false;
  @Input() public isFilterEnabled: boolean = true;
  @Input() public width: string = 'auto';
  @Input() public ItemHeight: number = 41;
  @Input() public customFilter: (term: string, options: IOption) => boolean;

  @ViewChild('inputFilter') public inputFilter: ElementRef;
  @ViewChild('mainContainer') public mainContainer: ElementRef;
  @ViewChild('menuEle') public menuEle: ShSelectMenuComponent;
  @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;
  @ViewChild('dd') public ele: ElementRef;

  @Input() set options(val: IOption[]) {
    this._options = val;
    this.updateRows(val);
  }

  get options(): IOption[] {
    return this._options;
  }

  @Output() public onHide: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() public onShow: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() public onClear: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() public selected = new EventEmitter<any>();
  @Output() public noOptionsFound = new EventEmitter<boolean>();
  @Output() public noResultsClicked = new EventEmitter<null>();
  @Output() public viewInitEvent = new EventEmitter<any>();

  public rows: IOption[] = [];
  public _options: IOption[] = [];
  public isOpen: boolean;
  public filter: string;
  public filteredData: IOption[] = [];
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
    if (val.length > 0) {
      this._selectedValues = this.rows.filter(f => val.findIndex(p => p === f.value) !== -1);
    } else {
      this._selectedValues = val;
    }
  }

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

  constructor(private element: ElementRef, private renderer: Renderer) {
  }

  /**
   * on click outside the view close the menu
   * @param event
   */
  @HostListener('window:mouseup', ['$event'])
  public onDocumentClick(event) {
    if (this.isOpen && !this.element.nativeElement.contains(event.target)) {
      this.hide(event);
    }
  }

  public updateRows(val: IOption[] = []) {
    this.rows = val;
  }

  public updateFilter(filterProp) {
    const lowercaseFilter = filterProp.toLocaleLowerCase();
    this.filteredData = this._options ? this._options.filter(item => {
      if (this.customFilter) {
        return this.customFilter(lowercaseFilter, item);
      }
      return !lowercaseFilter || (item.label).toLowerCase().indexOf(lowercaseFilter) !== -1;
    }) : [];
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

  public focusFilter() {
    if (this.isFilterEnabled && this.filter && this.filter !== '') {
      // this.updateFilter(this.filter);
    }
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.inputFilter.nativeElement, 'focus');
    }, 0);
  }

  public show(e: any) {
    if (this.isOpen || this.disabled) {
      return;
    }

    this.isOpen = true;
    this.focusFilter();
    this.onShow.emit();
    if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
      let item = this.rows.find(p => p.value === (this._selectedValues.length > 0 ? this._selectedValues[0] : (this.rows.length > 0 ? this.rows[0].value : null)));
      if (item !== null) {
        this.menuEle.virtualScrollElm.scrollInto(item);
      }
    }
  }

  public keydownUp(event) {
    let key = event.which;
    if (this.isOpen) {
      if (key === this.KEYS.ESC || (key === this.KEYS.UP && event.altKey)) {
        this.hide();
      } else if (key === this.KEYS.ENTER) {
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
          let item = this.menuEle.virtualScrollElm.getHighlightedOption();
          if (item !== null) {
            this.toggleSelected(item);
          }
        }
        // this.selectHighlightedOption();
      } else if (key === this.KEYS.UP) {
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
          let item = this.menuEle.virtualScrollElm.getPreviousHilightledOption();
          if (item !== null) {
            // this.toggleSelected(item);
            this.menuEle.virtualScrollElm.scrollInto(item);
            event.preventDefault();
          }
        }
        // this.optionList.highlightPreviousOption();
        // this.dropdown.moveHighlightedIntoView();
        // if (!this.filterEnabled) {
        //   event.preventDefault();
        // }
      } else if (key === this.KEYS.DOWN) {
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
          let item = this.menuEle.virtualScrollElm.getNextHilightledOption();
          if (item !== null) {
            // this.toggleSelected(item);
            this.menuEle.virtualScrollElm.scrollInto(item);
            event.preventDefault();
          }
        }
        // ----
        // this.optionList.highlightNextOption();
        // this.dropdown.moveHighlightedIntoView();
        // if (!this.filterEnabled) {
        //   event.preventDefault();
        // }
      }
    }
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
    } else {
      this.isOpen = false;
      if (this.selectedValues && this.selectedValues.length === 1) {
        this.filter = this.selectedValues[0].label;
      } else {
        this.clearFilter();
      }
      this.onHide.emit();
    }
  }

  public filterInputBlur(event) {
    if (event.relatedTarget && this.ele.nativeElement) {
      if (!this.ele.nativeElement.contains(event.relatedTarget)) {
        this.hide();
      }
      // this.hide();
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
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit() {
    this.viewInitEvent.emit(true);
  }

  //////// ControlValueAccessor imp //////////

  public writeValue(value: any) {
    this.selectedValues = value;
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
    // debugger;
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
}

export function ShSelectProvider(): any {
  return forwardRef(() => ShSelectComponent);
}
