import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    KeyValueDiffers,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';

import { DaterangepickerConfig } from './config.service';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: "[daterangepicker]",
    standalone: false
})
/**
 * DaterangePickerComponent component
 * Handles daterangepicker functionality and user interactions
 */
export class DaterangePickerComponent implements AfterViewInit, OnDestroy, OnChanges {

    public datePicker: any;

    // daterangepicker properties
    @Input() public options: any = {};

    // daterangepicker events
    @Output() public selected = new EventEmitter();
    @Output() public cancelDaterangepicker = new EventEmitter();
    @Output() public applyDaterangepicker = new EventEmitter();
    @Output() public hideCalendarDaterangepicker = new EventEmitter();
    @Output() public showCalendarDaterangepicker = new EventEmitter();
    @Output() public hideDaterangepicker = new EventEmitter();
    @Output() public showDaterangepicker = new EventEmitter();

    private activeRange: any;
    private targetOptions: any = {};
    private _differ: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private input: ElementRef,
        private config: DaterangepickerConfig,
        private differs: KeyValueDiffers,
        private ngZone: NgZone
    ) {
        this._differ["options"] = differs.find(this.options).create();
        this._differ["settings"] = differs.find(this.config.settings).create();
    }

    /**
     * Handles ngAfterViewInit functionality
     */
    public ngAfterViewInit() {
        this.config.embedCSS();
        this.render();
        this.attachEvents();
    }

    @HostListener("keydown.esc", ["$event"])
    /**
     * Closes 
     */
    public close(e) {
        /**
         * Handles if functionality
         */
        if (!this.options.hideOnEsc) {
            return;
        }
        // Closing the datepicker by mimicking outside click...
        this.datePicker._outsideClickProxy(e.target.ownerDocument);
    }

    /**
     * Handles render functionality
     */
    public render() {
        this.targetOptions = Object.assign({}, this.config.settings, this.options);

        // cast $ to any to avoid jquery type checking
        this.ngZone.runOutsideAngular(() => {
            ($(this.input?.nativeElement) as any).daterangepicker(this.targetOptions, this.callback.bind(this, this.options.startDate, this.options.endDate));
            this.datePicker = ($(this.input?.nativeElement) as any).data('daterangepicker');
        });
    }

    /**
     * Handles attachEvents functionality
     */
    public attachEvents() {
        $(this.input?.nativeElement).on("cancel.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.cancelDaterangepicker.emit(event);
            }
        );

        $(this.input?.nativeElement).on("apply.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.options.chosenLabel = picker.chosenLabel;
                this.applyDaterangepicker.emit(event);
            }
        );

        $(this.input?.nativeElement).on("hideCalendar.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.hideCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input?.nativeElement).on("showCalendar.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.showCalendarDaterangepicker.emit(event);
            }
        );

        $(this.input?.nativeElement).on("hide.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.hideDaterangepicker.emit(event);
            }
        );

        $(this.input?.nativeElement).on("show.daterangepicker",
            (e: any, picker: any) => {
                let event = { event: e, picker };
                this.highlightSelectedFilter(picker);
                this.showDaterangepicker.emit(event);
            }
        );
    }

    /**
     * Handles destroyPicker functionality
     */
    public destroyPicker() {
        try {
            ($(this.input?.nativeElement) as any).data("daterangepicker").remove();
        } catch (e) {
            //
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyPicker();
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if ('options' in changes && changes.options.currentValue && changes.options.currentValue !== changes.options.previousValue) {
            /**
             * Handles if functionality
             */
            if(!changes.options.firstChange) {
                this.render();
            }
            this.attachEvents();
        }
    }

    /**
     * Handles callback functionality
     */
    private callback(start?: any, end?: any, label?: any): void {
        this.activeRange = {
            start,
            end,
            label
        };

        this.selected.emit(this.activeRange);
    }

    /**
     * Highlights the selected filter in date range
     *
     * @private
     * @param {*} picker Date picker instance
     * @memberof DaterangePickerComponent
     */
    private highlightSelectedFilter(picker: any): void {
        const ranges: any = picker.container.find('.ranges li');
        /**
         * Handles if functionality
         */
        if (this.options.chosenLabel) {
            /* Remove active label only if the user has chosen a particular label.
               This is done as the bootstrap-daterangepicker library incorrectly highlights
               the selected filter if the dates for those filters are same. For eg-
               If current month is July and user selects filter 'This Quarter to date' then
               the range picker will highlight 'This month to date' as these two filters have same
               date for July month (July being the first month of third quarter and in 'This Month to date' will
               also begin with July). The library highlights the first matching filter as per the date values
               and breaks the loop which results in wrong filter being highlighted in range picker
            */
            for (const key in Object.keys(ranges)) {
                /**
                 * Handles if functionality
                 */
                if (ranges[key] && ranges[key].textContent === this.options.chosenLabel) {
                    // Remove the active class applied by daterangepicker library
                    ranges.removeClass('active');
                    // Add the active class to the found element
                    picker.container.find('.ranges li:eq(' + key + ')').addClass('active').html();
                    break;
                }
            }
        }
    }
}
