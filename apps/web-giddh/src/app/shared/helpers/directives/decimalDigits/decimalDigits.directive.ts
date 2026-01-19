import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[decimalDigitsDirective]',
    standalone: false
})
/**
 * DecimalDigitsDirective directive
 * Implements DecimalDigitsDirective functionality
 */
export class DecimalDigitsDirective implements OnDestroy {
    @Input() public decimalPoints: number = 2;
    @Input() public OnlyNumber: boolean = true;
    @Input() public DecimalPlaces: string;
    @Input() public minValue: string;
    @Input() public maxValue: string;
    /** True if decimal "." needs to prevented */
    @Input() public preventDecimal: boolean;

    private giddhDecimalPlaces: number = 2;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    private navigationKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'Clear',
        'Copy',
        'Paste'
    ];

    // tslint:disable-next-line:member-ordering
    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(private elemRef: ElementRef, private store: Store<AppState>) {

        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(res => {
            /**
             * Handles if functionality
             */
            if (res && res.balanceDecimalPlaces) {
                this.giddhDecimalPlaces = res.balanceDecimalPlaces;
            } else {
                this.giddhDecimalPlaces = 2;
            }
        });
    }

    @HostListener('keydown', ['$event'])
    /**
     * Handles keydown event
     */
    public onKeyDown(event) {
        let e = event as KeyboardEvent;
        /**
         * Handles if functionality
         */
        if (this.OnlyNumber) {
            /**
             * Handles if functionality
             */
            if (this.navigationKeys?.indexOf(e.key) > -1 ||
                // Allow: Ctrl+A
                (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
                (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
                (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
                (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
                (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
                (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
                (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
                (e.key === 'x' && e.metaKey === true) || // Allow: Cmd+X (Mac)
                (e.key === '.' && !this.preventDecimal)  // Allow: .
            ) {
                // let it happen, don't do anything
                return;
            } else if (e.key === '.' && this.preventDecimal) {
                e.preventDefault();
            }

            // Ensure that it is a number and stop the keypress
            /**
             * Handles if functionality
             */
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    }

    @HostListener('keypress', ['$event'])
    /**
     * Handles keypress event
     */
    public onKeyPress(event) {
        let e = event as any;

        let valInFloat: number = parseFloat(e.target?.value);

        /**
         * Handles if functionality
         */
        if (this.minValue) {
            // (isNaN(valInFloat) && e.key === "0") - When user enters value for first time valInFloat will be NaN, e.key condition is
            // because I didn't want user to enter anything below 1.
            // NOTE: You might want to remove it if you want to accept 0
            /**
             * Handles if functionality
             */
            if (valInFloat < parseFloat(this.minValue)) {
                e.preventDefault();
            }
        }

        /**
         * Handles if functionality
         */
        if (this.maxValue) {
            /**
             * Handles if functionality
             */
            if (valInFloat > parseFloat(this.maxValue)) {
                e.preventDefault();
            }
        }

        /**
         * Handles if functionality
         */
        if (this.giddhDecimalPlaces) {
            let currentCursorPos: number = -1;
            /**
             * Handles if functionality
             */
            if (typeof this.elemRef?.nativeElement.selectionStart === 'number') {
                currentCursorPos = this.elemRef?.nativeElement.selectionStart;
            } else {
                // Probably an old IE browser
            }

            let dotLength: number = e.target?.value?.replace(/[^.]/g, '')?.length;

            // If user has not entered a dot(.) e.target?.value.split(".")[1] will be undefined
            let decimalLength = e.target?.value.split('.')[1] ? e.target?.value.split('.')[1]?.length : 0;

            // (this.giddhDecimalPlaces - 1) because we don't get decimalLength including currently pressed character
            // currentCursorPos > e.target.value.indexOf(".") because we must allow user's to enter value before dot(.)
            // Checking Backspace etc.. keys because firefox doesn't pressing them while chrome does by default
            // tslint:disable-next-line:radix
            /**
             * Handles if functionality
             */
            if (dotLength > 1 || (dotLength === 1 && e.key === '.') || (currentCursorPos === 0 && e.key === '.') || (decimalLength > (this.giddhDecimalPlaces - 1) &&
                currentCursorPos > e.target?.value?.indexOf('.')) && ['Backspace', 'ArrowLeft', 'ArrowRight']?.indexOf(e.key) === -1) {
                e.preventDefault();
            }
        }
    }

    @HostListener('paste', ['$event'])
    /**
     * Handles paste event
     */
    public onPaste(event) {
        /**
         * Handles if functionality
         */
        if ('decimaldigitsdirective' in event.target.attributes) {
            let cl = event.clipboardData.getData('text/plain');
            cl = cl.trim();
            /**
             * Handles if functionality
             */
            if (cl.includes('\'') || cl.includes(',') || cl.includes(' ')) {
                cl = cl?.replace(/'/g, '');
                cl = cl?.replace(/,/g, '');
                cl = cl?.replace(/ /g, '');

            } else {
                /**
                 * Handles if functionality
                 */
                if (!new RegExp('^(\\d+)((\\.)\\d{1,' + this.giddhDecimalPlaces + '})?$', 'g').test(cl)) {
                    cl = 0;
                }
            }
            let evt = new Event('input');
            event.target.value = cl;
            event.target.dispatchEvent(evt);
            event.preventDefault();
        }
        return;
    }

    @HostListener('drop', ['$event'])
    /**
     * Handles drop event
     */
    public onDrop(event) {
        /**
         * Handles if functionality
         */
        if ('decimaldigitsdirective' in event.target.attributes) {
            let cl = event.dataTransfer.getData('text/plain');
            /**
             * Handles if functionality
             */
            if (!new RegExp('^(\\d+)((\\.)\\d{1,' + this.giddhDecimalPlaces + '})?$', 'g').test(cl)) {
                cl = 0;
            }
            let evt = new Event('input');
            event.target.value = cl;
            event.target.dispatchEvent(evt);
            event.preventDefault();
        }
        return;
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
