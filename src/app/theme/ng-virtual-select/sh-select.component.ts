/**
 * Created by yonifarin on 12/3/16.
 */
import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, Renderer, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IOption } from './sh-options.interface';

// noinspection TsLint
@ Component({
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
  @Input() public isMultiselect: boolean = false;
  @Input() public mode: 'default' | 'inline' = 'default';
  @Input() public showClear: boolean = true;
  @Input() public disabled: boolean;
  @Input() public notFoundMsg: string = 'No results found';
  @Input() public notFoundLink: boolean = false;
  @ViewChild('inputFilter') public inputFilter: ElementRef;
  @ContentChild('optionTemplate') public optionTemplate: TemplateRef<any>;

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

    this._selectedValues = val;
  }

  constructor(private element: ElementRef,
              private renderer: Renderer) {
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
    this.filteredData = this._options.filter(item =>
      !lowercaseFilter || (item.label).toLowerCase().indexOf(lowercaseFilter) !== -1);
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
    this.updateFilter(this.filter);
  }

  public toggleSelected(item) {
    if (!item) {
      return;
    }
    this.clearFilter();

    if (this.isMultiselect) {
      this.selectMultiple(item);
    } else {
      this.selectSingle(item);
    }

    this.onChange();
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
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.inputFilter.nativeElement, 'focus');
    }, 0);
  }

  public show() {
    if (this.isOpen || this.disabled) {
      return;
    }

    this.isOpen = true;
    this.focusFilter();
    this.onShow.emit();
  }

  public hide(event?) {
    if (event && event.relatedTarget) {
      if ((event.relatedTarget !== this.inputFilter.nativeElement)) {
        this.isOpen = false;
        this.clearFilter();
        this.onHide.emit();
      }
    } else {
      this.isOpen = false;
      this.clearFilter();
      this.onHide.emit();
    }
  }

  public clear() {
    if (this.disabled) {
      return;
    }

    this.selectedValues = [];
    this.onChange();
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

  public onChange() {
    if (this.isMultiselect) {
      this.propagateChange(this._selectedValues);
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
      this.propagateChange(newValue.value);
      this.selected.emit(newValue);
    }
  }
}

export function ShSelectProvider(): any {
  return forwardRef(() => ShSelectComponent);
}
