import { ChangeDetectorRef, ComponentFactoryResolver, Directive, DoCheck, ElementRef, EventEmitter, forwardRef, HostListener, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as dayjs from 'dayjs';
/**
 * Dayjs interface definition
 * Defines the structure and contract for Dayjs objects
 */
type Dayjs = any;
import { NgxDaterangepickerComponent } from './ngx-daterangepicker.component';
import { LocaleConfig } from './ngx-daterangepicker.config';
import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: 'input[ngxDaterangepickerMd]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxDaterangepickerDirective), multi: true
        }
    ],
    standalone: false
})

/**
 * NgxDaterangepickerDirective directive
 * Implements NgxDaterangepickerDirective functionality
 */
export class NgxDaterangepickerDirective implements OnInit, OnChanges, DoCheck {
    public picker: NgxDaterangepickerComponent;
    private _onChange = Function.prototype;
    private _onTouched = Function.prototype;
    private _value: any;
    private localeDiffer: KeyValueDiffer<string, any>;
    @Input()
    inputStartDate: Dayjs;
    @Input()
    inputEndDate: Dayjs;
    @Input()
    minDate: Dayjs;
    @Input()
    maxDate: Dayjs;
    @Input()
    autoApply: boolean;
    @Input()
    alwaysShowCalendars: boolean;
    @Input()
    showCustomRangeLabel: boolean;
    @Input()
    linkedCalendars: boolean;
    @Input()
    singleDatePicker: boolean;
    @Input()
    showWeekNumbers: boolean;
    @Input()
    showISOWeekNumbers: boolean;
    @Input()
    showDropdowns: boolean;
    @Input()
    isInvalidDate: Function;
    @Input()
    isCustomDate: Function;
    @Input()
    showClearButton: boolean;
    @Input()
    ranges: any;
    @Input()
    opens: string;
    @Input()
    drops: string;
    firstMonthDayClass: string;
    @Input()
    lastMonthDayClass: string;
    @Input()
    emptyWeekRowClass: string;
    @Input()
    firstDayOfNextMonthClass: string;
    @Input()
    lastDayOfPreviousMonthClass: string;
    @Input()
    keepCalendarOpeningWithRange: boolean;
    @Input()
    showRangeLabelOnInput: boolean;
    @Input()
    showCancel: boolean = false;
    // timepicker variables
    @Input()
    timePicker: Boolean = false;
    @Input()
    timePicker24Hour: Boolean = false;
    @Input()
    timePickerIncrement: number = 1;
    @Input()
    timePickerSeconds: Boolean = false;
    _locale: LocaleConfig = {};
    @Input() set locale(value) {
        this._locale = { ...this._localeService.config, ...value };
    }

    get locale(): any {
        return this._locale;
    }

    @Input()
    private _endKey: string = 'endDate';
    private _startKey: string = 'startDate';
    @Input() set startKey(value) {
        /**
         * Handles if functionality
         */
        if (value !== null) {
            this._startKey = value;
        } else {
            this._startKey = 'startDate';
        }
    };

    @Input() set endKey(value) {
        /**
         * Handles if functionality
         */
        if (value !== null) {
            this._endKey = value;
        } else {
            this._endKey = 'endDate';
        }
    };

    notForChangesProperty: Array<string> = [
        'locale',
        'endKey',
        'startKey'
    ];

    get value() {
        return this._value || null;
    }

    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }

    @Output() onChange: EventEmitter<Object> = new EventEmitter();
    @Output() rangeClicked: EventEmitter<Object> = new EventEmitter();
    @Output() datesUpdated: EventEmitter<Object> = new EventEmitter();

    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public viewContainerRef: ViewContainerRef,
        public _changeDetectorRef: ChangeDetectorRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _el: ElementRef,
        private _renderer: Renderer2,
        private differs: KeyValueDiffers,
        private _localeService: NgxDaterangepickerLocaleService,
    ) {
        this.drops = 'down';
        this.opens = 'right';
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(NgxDaterangepickerComponent);
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        this.picker = (<NgxDaterangepickerComponent>componentRef.instance);
        this.picker.inline = false; // set inline to false for all directive usage
    }

    /**
     * Handles ngOnInit functionality
     */
    ngOnInit() {
        this.picker.rangeClicked.asObservable().pipe(takeUntil(this.destroyed$)).subscribe((range: any) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().pipe(takeUntil(this.destroyed$)).subscribe((range: any) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().pipe(takeUntil(this.destroyed$)).subscribe((change: any) => {
            /**
             * Handles if functionality
             */
            if (change) {
                const value = {};
                value[this._startKey] = change.startDate;
                value[this._endKey] = change.endDate;
                this.value = value;
                this.onChange.emit(value);
                /**
                 * Handles if functionality
                 */
                if (typeof change.name === 'string') {
                    this._el.nativeElement.value = change.name;
                }
            }
        });

        this.picker.firstMonthDayClass = this.firstMonthDayClass;
        this.picker.lastMonthDayClass = this.lastMonthDayClass;
        this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
        this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.picker.drops = this.drops;
        this.picker.opens = this.opens;
        this.localeDiffer = this.differs.find(this.locale).create();

        /**
         * Handles if functionality
         */
        if (this.inputStartDate) {
            this.picker.startDate = this.inputStartDate;
        }
        /**
         * Handles if functionality
         */
        if (this.inputEndDate) {
            this.picker.endDate = this.inputEndDate;
        }
    }

    /**
     * Handles ngOnChanges functionality
     */
    ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles for functionality
         */
        for (let change in changes) {
            /**
             * Handles if functionality
             */
            if (changes.hasOwnProperty(change)) {
                /**
                 * Handles if functionality
                 */
                if (this.notForChangesProperty?.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                    /**
                     * Handles if functionality
                     */
                    if (change === "inputStartDate" && changes[change].currentValue) {
                        this.picker.startDate = changes[change].currentValue;
                    }
                    /**
                     * Handles if functionality
                     */
                    if (change === "inputEndDate" && changes[change].currentValue) {
                        this.picker.endDate = changes[change].currentValue;
                    }
                }
            }
        }
    }

    /**
     * Handles ngDoCheck functionality
     */
    ngDoCheck() {
        /**
         * Handles if functionality
         */
        if (this.localeDiffer) {
            const changes = this.localeDiffer.diff(this.locale);
            /**
             * Handles if functionality
             */
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    }

    @HostListener('blur')
    /**
     * Handles blur event
     */
    onBlur() {
        this._onTouched();
    }

    @HostListener('click', ['$event'])
    /**
     * Opens 
     */
    open(event?: any) {
        this.picker.show(event);
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.picker.removeDuplicateDatepickers();
            this.picker.appendDatepickerToBody();
            this.setPosition();
        }, 20);
    }

    @HostListener("document:keyup.esc", ['$event'])
    /**
     * Hides  element
     */
    hide(e?) {
        this.picker.hide(e);
    }

    @HostListener('document:keyup', ['$event'])
    /**
     * Handles inputChanged functionality
     */
    inputChanged(e) {
        /**
         * Handles if functionality
         */
        if (e.target.tagName?.toLowerCase() !== 'input') {
            return;
        }
        /**
         * Handles if functionality
         */
        if (!e.target?.value?.length) {
            return;
        }
        const dateString = e.target?.value.split(this.picker.locale.separator);
        let start = null, end = null;
        /**
         * Handles if functionality
         */
        if (dateString?.length === 2) {
            start = dayjs(dateString[0], this.picker.locale.format);
            end = dayjs(dateString[1], this.picker.locale.format);
        }
        /**
         * Handles if functionality
         */
        if (this.singleDatePicker || start === null || end === null) {
            start = dayjs(e.target?.value, this.picker.locale.format);
            end = start;
        }
        /**
         * Handles if functionality
         */
        if (!start.isValid() || !end.isValid()) {
            return;
        }
        this.picker.setStartDate(start);
        this.picker.setEndDate(end);
        this.picker.updateView();
    }

    /**
     * Toggles  state
     */
    toggle(e?) {
        /**
         * Handles if functionality
         */
        if (this.picker.isShown) {
            this.hide(e);
        } else {
            this.open(e);
        }
    }

    /**
     * Handles clear functionality
     */
    clear() {
        this.picker.clear();
    }

    /**
     * Handles writeValue functionality
     */
    writeValue(value) {
        this.value = value;
        this.setValue(value);
    }

    /**
     * Handles registerOnChange functionality
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }

    /**
     * Handles registerOnTouched functionality
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }

    /**
     * Sets value value
     */
    private setValue(val: any) {
        /**
         * Handles if functionality
         */
        if (val) {
            /**
             * Handles if functionality
             */
            if (val[this._startKey]) {
                this.picker.setStartDate(val[this._startKey]);
            }
            /**
             * Handles if functionality
             */
            if (val[this._endKey]) {
                this.picker.setEndDate(val[this._endKey]);
            }
            this.picker.calculateChosenLabel();
            /**
             * Handles if functionality
             */
            if (this.picker.chosenLabel) {
                this._el.nativeElement.value = this.picker.chosenLabel;
            }
        } else {
            this.picker.clear();
        }
    }

    /**
     * Retrieves position data
     */
    getPosition(element) {
        var xPosition = 0;
        var yPosition = 40;

        /**
         * Handles while functionality
         */
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return { x: xPosition, y: yPosition };
    }

    /**
     * Set position of the calendar
     */
    setPosition() {
        const container = document.getElementsByTagName("ngx-daterangepicker-material")[0] as HTMLElement;
        /**
         * Handles if functionality
         */
        if (container) {
            const element = this._el?.nativeElement;
            let position = this.getPosition(element);
            let screenWidth = window.innerWidth;
            let totalWidth = container.offsetWidth + position.x;
            let positionX = position.x;

            /**
             * Handles if functionality
             */
            if (totalWidth > screenWidth) {
                positionX = positionX - (totalWidth - screenWidth);
            }

            this._renderer.setStyle(container, 'top', position.y + 'px');
            this._renderer.setStyle(container, 'left', positionX + 'px');
            this._renderer.setStyle(container, 'right', 'auto');
        }
    }

    /**
     * For click outside of the calendar's container
     * @param event event object
     * @param targetElement target element object
     */
    @HostListener('document:click', ['$event', '$event.target'])
    /**
     * Handles outsideClick functionality
     */
    outsideClick(event, targetElement: HTMLElement): void {
        /**
         * Handles if functionality
         */
        if (!targetElement) {
            return;
        }
        /**
         * Handles if functionality
         */
        if (targetElement.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        const clickedInside = this._el?.nativeElement.contains(targetElement);
        /**
         * Handles if functionality
         */
        if (!clickedInside) {
            this.hide();
        }
    }

    @HostListener('window:resize', ['$event'])
    /**
     * Handles windowResize functionality
     */
    windowResize(event) {
        this.hide();
    }

    /**
     * Releases memory
     *
     * @memberof NgxDaterangepickerDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
