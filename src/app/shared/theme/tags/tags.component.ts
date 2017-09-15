import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy,
  Output, SimpleChanges, ViewChild, ViewEncapsulation, Renderer, OnInit, forwardRef
} from '@angular/core';
import { NgControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TAGS_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-forward-ref
  useExisting: forwardRef(() => TagsComponent),
  multi: true
};

@Component({
  selector: 'tags-input',
  templateUrl: './tags.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TAGS_INPUT_VALUE_ACCESSOR],
})

export class TagsComponent implements AfterViewInit, OnInit, ControlValueAccessor {

  @ViewChild('tags') public tags: ElementRef;

  // items for tagsmanager drop down
  @Input() public prefilled: any[];

  // class for tagsmanager
  @Input() public tagClass: string = 'success';

  // value for tagsmanager
  @Input() public value: string;

  public element: JQuery = undefined;
  public hiddenElement: JQuery = undefined;
  public check: boolean = false;

  constructor() {
    //
  }

  // tslint:disable-next-line:no-empty
  public onChangeCb: (_: any) => void = (e) => { };
  // tslint:disable-next-line:no-empty
  public onTouchedCb: () => void = () => { };

  public writeValue(value: any): void {
    if (value !== undefined && value !== '' && this.element !== undefined) {
      this.element.val(value);
    }
  }

  public registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit() {
    this.element = jQuery(this.tags.nativeElement);
    this.initPlugin();
  }

  public initPlugin() {
    let _this = this;
    if (!(this.element as any).tagsManager) {
      if (!this.check) {
        this.check = true;
        // console.log('Please add TagsManager library (js file) to the project.');
      }

      return;
    }
    (this.element as any).tagsManager({ prefilled: this.value, tagsContainer: '.tags', tagClass: 'tm-tag-' + this.tagClass });
    // set initial value
    this.onChangeCb(this.value);

    // get hiddenelement and update value of current element
    this.hiddenElement = jQuery(this.element.next('input:hidden'));
    this.hiddenElement.change(() => {
      _this.onChangeCb(_this.hiddenElement.val());
    });
  }
}
