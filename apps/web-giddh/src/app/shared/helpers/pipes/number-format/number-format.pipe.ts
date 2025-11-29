import { AppState } from './../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { giddhRoundOff } from '../../helperFunctions';
import { NUMBER_FORMAT_LOCALE_MAP, COUNTRY_LOCALE_MAP } from '../../../../app.constant';

@Pipe({ name: 'giddhNumberFormat', pure: true })

export class GiddhNumberFormatPipe implements OnDestroy, PipeTransform {
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public companyDecimalPlaces: number = 2;
    private locale: string = 'en-IN'; // Default locale

    constructor(private store: Store<AppState>) {
        this.store.pipe(select(p => p.settings.profile), distinctUntilKeyChanged('balanceDisplayFormat'), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && profile.name) {
                this.companyDecimalPlaces = profile.balanceDecimalPlaces ? profile.balanceDecimalPlaces : 2;
                if (this.companyDecimalPlaces) {
                    localStorage.setItem('currencyDecimalType', this.companyDecimalPlaces?.toString());
                }

                // Set locale based on balance display format
                const displayFormat = profile.balanceDisplayFormat || 'IND_COMMA_SEPARATED';
                this.locale = this.getLocaleFromDisplayFormat(displayFormat);
                localStorage.setItem('companyLocale', this.locale);
                localStorage.setItem('currencyNumberType', displayFormat);
            }
        });
    }

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
        return NUMBER_FORMAT_LOCALE_MAP[displayFormat] || 'en-IN';
    }

    /**
     * Maps country code to appropriate locale
     *
     * @private
     * @param {string} countryCode Two-letter country code (e.g., 'IN', 'US', 'FR')
     * @returns {string} Locale string (e.g., 'en-IN', 'en-US', 'fr-FR')
     * @memberof GiddhNumberFormatPipe
     */
    private getLocaleFromCountryCode(countryCode: string): string {
        return COUNTRY_LOCALE_MAP[countryCode?.toUpperCase()] || 'en-IN';
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
            parseInt(localStorage.getItem('currencyDecimalType') || '2');

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
