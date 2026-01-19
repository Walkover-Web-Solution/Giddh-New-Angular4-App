import { AppState } from './../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { giddhRoundOff } from '../../helperFunctions';
import { NUMBER_FORMAT_LOCALE_MAP, DEFAULT_NUMBER_FORMAT_LOCALE, DEFAULT_NUMBER_DISPLAY_FORMAT } from '../../../../app.constant';

/**
 * Handles Pipe functionality
 */
@Pipe({ name: 'giddhNumberFormat', pure: true, standalone: false })

/**
 * GiddhNumberFormatPipe pipe
 * Implements GiddhNumberFormatPipe functionality
 */
export class GiddhNumberFormatPipe implements OnDestroy, PipeTransform {
    /** Subject to handle component destruction and unsubscribe from observables */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Number of decimal places for formatting, derived from company settings */
    public companyDecimalPlaces: number = 2;
    /** Locale string for number formatting (e.g., 'en-IN', 'en-US', 'fr-FR') */
    private locale: string = DEFAULT_NUMBER_FORMAT_LOCALE;

    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>) {
        this.store.pipe(select(state => state.settings.profile), distinctUntilKeyChanged('balanceDisplayFormat'), takeUntil(this.destroyed$)).subscribe((profile) => {
            /**
             * Handles if functionality
             */
            if (profile && profile.name) {
                this.companyDecimalPlaces = profile.balanceDecimalPlaces ? profile.balanceDecimalPlaces : 2;
                /**
                 * Handles if functionality
                 */
                if (this.companyDecimalPlaces) {
                    localStorage.setItem('currencyDecimalType', this.companyDecimalPlaces.toString());
                }

                // Set locale based on balance display format
                const displayFormat = profile.balanceDisplayFormat || DEFAULT_NUMBER_DISPLAY_FORMAT;
                this.locale = this.getLocaleFromDisplayFormat(displayFormat);
                localStorage.setItem('companyLocale', this.locale);
                localStorage.setItem('currencyNumberType', displayFormat);
            }
        });
    }

    /**
     * Cleanup method to unsubscribe from observables
     *
     * @memberof GiddhNumberFormatPipe
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Maps display format to appropriate locale
     *
     * @private
     * @param {string} displayFormat Display format type
     * @returns {string} Locale string
     * @memberof GiddhNumberFormatPipe
     */
    private getLocaleFromDisplayFormat(displayFormat: string): string {
        return NUMBER_FORMAT_LOCALE_MAP[displayFormat] || DEFAULT_NUMBER_FORMAT_LOCALE;
    }


    /**
     * Transforms the number with company decimal places and locale-specific formatting
     *
     * @param {number} value Input number to be transformed
     * @param {number} [customDecimalPlaces] Custom decimal places to override company settings
     * @returns {string} Formatted number string
     * @memberof GiddhNumberFormatPipe
     */
    public transform(value: number, customDecimalPlaces?: number): string {
        /**
         * Handles if functionality
         */
        if (value == null || isNaN(value)) {
            return '';
        }

        // Get locale with fallback chain
        const formatLocale = this.locale ||
            localStorage.getItem('companyLocale') ||
            this.getLocaleFromDisplayFormat(localStorage.getItem('currencyNumberType') || '') ||
            'en-IN';

        // Get decimal places with fallback chain
        const decimalPlaces = customDecimalPlaces ??
            this.companyDecimalPlaces ??
            (parseInt(localStorage.getItem('currencyDecimalType') || '2') || 2);

        const roundedValue = giddhRoundOff(value, decimalPlaces);

        try {
            // Use Intl.NumberFormat for locale-specific formatting
            return new Intl.NumberFormat(formatLocale, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
                useGrouping: true
            }).format(roundedValue);
        } catch {
            // Fallback to basic formatting if locale is not supported
            return this.basicNumberFormat(roundedValue, decimalPlaces);
        }
    }

    /**
     * Basic number formatting fallback
     *
     * @private
     * @param {number} value Number to format
     * @param {number} decimalPlaces Number of decimal places
     * @returns {string} Formatted number string
     * @memberof GiddhNumberFormatPipe
     */
    private basicNumberFormat(value: number, decimalPlaces: number): string {
        const roundedValue = giddhRoundOff(value, decimalPlaces);
        const [integerPart, decimalPart = ''] = roundedValue.toString().split('.');

        // Add thousand separators to integer part
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Handle decimal places
        return decimalPlaces > 0
            ? `${formattedInteger}.${decimalPart.padEnd(decimalPlaces, '0').substring(0, decimalPlaces)}`
            : formattedInteger;
    }
}
