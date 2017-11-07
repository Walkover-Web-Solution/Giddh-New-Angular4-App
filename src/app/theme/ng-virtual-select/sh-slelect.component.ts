/**
 * Created by yonifarin on 12/3/16.
 */
import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, Renderer, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operator/filter';
import { IOption } from './sh-options.interface';

// noinspection TsLint
@ Component({
  selector: 'sh-select',
  template: `
    <div class="header" [class.sh-select-disabled]="disabled" [class.inline]="mode==='inline'"
         (click)="show()" [class.open]="isOpen" tabindex="0" (focus)="show()" (blur)="hide($event)">
      <input type="text"
             #inputFilter
             tabindex="0"
             [hidden]="!isOpen"
             (click)="show()"
             [placeholder]="placeholder"
             [(ngModel)]="filter"
             (ngModelChange)="updateFilter($event)">
      <div (click)="show(); $event.stopPropagation()"

           *ngIf="!isOpen">
        {{selectedValues?.length ?
        (isMultiselect ?
          selectedValues?.length + ' Selected'
          : (selectedValues[0].label))
        : placeholder}}
      </div>
      <i class="close icon clear"
         *ngIf="showClear && selectedValues.length > 0"
         (click)="clear(); $event.stopPropagation()"></i>
    </div>
    <sh-select-menu [isOpen]="isOpen"
                    [rows]="rows"
                    [selectedValues]="selectedValues"
                    [optionTemplate]="optionTemplate"
                    (noToggleClick)="toggleSelected($event)"></sh-select-menu>`,
  styles: [`:host {
    display: block;
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    font-family: 'RobotoDraft', 'Roboto', 'Helvetica Neue, Helvetica, Arial', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 1.0rem;
    line-height: 2rem;
    letter-spacing: 0.01rem;
    color: #212121;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  .header {
    width: 100%;
    margin: 0 !important;
    padding: 2px 30px 2px 10px;
    box-sizing: border-box;
    background-color: white;
    font-size: 1.0em;
    border-radius: 2px;
    border: 1px solid rgba(34, 36, 38, .15);
    vertical-align: middle;
    cursor: pointer;
  }

  .header.inline {
    background-color: transparent;
    width: max-content;
    border: none;
  }

  .header.open {
    border-radius: 2px 2px 0 0;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15);
    border-bottom: none;
  }

  div {
    display: block;
  }

  input[type="text"] {
    border: none !important;
    vertical-align: middle !important;
    width: 100%;
    margin: 0 !important;
    padding: 0px !important;
    box-sizing: border-box;
    background-color: white;
    font-size: 1.0rem !important;
    line-height: 2rem !important;
    letter-spacing: 0.01rem !important;
    font-family: 'RobotoDraft', 'Roboto', 'Helvetica Neue, Helvetica, Arial', sans-serif;
    font-style: normal !important;
    font-weight: 300 !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;;
    text-rendering: optimizeLegibility !important;;
  }

  input[type="text"] {
    outline: none;
  }

  [hidden] {
    display: none;
  }

  i.close.icon.clear::after {
    content: "✕";
    padding-right: 8px;
    font-weight: 800;
    color: gray;
  }

  i.close.icon.clear:hover::after {
    color: red;
  }

  .clear {
    position: absolute;
    right: 2px;
    padding-left: 2px;
    padding-right: 2px;
    top: 3px;
    cursor: pointer;
  }

  .sh-select-disabled {
    background-color: #e3e3e3;
    color: darkgray;
    cursor: not-allowed;
  }

  `],
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

    this.propagateChange(this._selectedValues);
    this.selected.emit(this._selectedValues);
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
    this.propagateChange(this._selectedValues);
    this.selected.emit(this._selectedValues);
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
}

export function ShSelectProvider(): any {
  return forwardRef(() => ShSelectComponent);
}
