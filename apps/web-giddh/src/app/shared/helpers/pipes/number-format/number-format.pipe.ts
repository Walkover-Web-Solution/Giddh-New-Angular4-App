import { AppState } from './../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from './../../../../services/general.service';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { giddhRoundOff } from '../../helperFunctions';

@Pipe({ name: 'giddhNumberFormat', pure: true })

export class GiddhNumberFormatPipe implements OnDestroy, PipeTransform {
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public companyDecimalPlaces: number = 2;
    private locale: string = 'en-IN'; // Default locale

    constructor(private store: Store<AppState>, private _generalService: GeneralService) {
        this.store.pipe(select(p => p.settings.profile), distinctUntilKeyChanged('balanceDisplayFormat'), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && profile.name) {
                this.companyDecimalPlaces = profile.balanceDecimalPlaces ? profile.balanceDecimalPlaces : 2;
                if (this.companyDecimalPlaces) {
                    localStorage.setItem('currencyDecimalType', this.companyDecimalPlaces?.toString());
                }

                // Set locale based on balance display format
                const displayFormat = profile.balanceDisplayFormat || 'IND_COMMA_SEPARATED';
                this.locale = this.getLocaleFromDisplayFormat(displayFormat);
                console.log('Locale set to:', this.locale, 'from format:', displayFormat);
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
     * @param {string} displayFormat Display format type (e.g., 'IND_COMMA_SEPARATED', 'INT_COMMA_SEPARATED')
     * @returns {string} Locale string (e.g., 'en-IN', 'en-US', 'fr-FR')
     * @memberof GiddhNumberFormatPipe
     */
    private getLocaleFromDisplayFormat(displayFormat: string): string {
        const formatLocaleMap: { [key: string]: string } = {
            'IND_COMMA_SEPARATED': 'en-IN',        // Indian format: 12,34,567.89
            'INT_COMMA_SEPARATED': 'en-US',        // International comma: 1,234,567.89
            'INT_SPACE_SEPARATED': 'fr-FR',        // Space separated: 1 234 567,89
            'INT_APOSTROPHE_SEPARATED': 'de-CH'    // Apostrophe separated: 1'234'567.89
        };

        return formatLocaleMap[displayFormat] || 'en-IN'; // Default to en-IN
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

        // Get locale from localStorage if not set in component or use default
        let formatLocale = this.locale;
        if (!formatLocale) {
            const storedLocale = localStorage.getItem('companyLocale');
            if (storedLocale) {
                formatLocale = storedLocale;
            } else {
                // Fallback: get locale from stored display format
                const storedDisplayFormat = localStorage.getItem('currencyNumberType');
                formatLocale = storedDisplayFormat ? this.getLocaleFromDisplayFormat(storedDisplayFormat) : 'en-IN';
            }
        }

        // Get decimal places from localStorage if not set in component
        let decimalPlaces = customDecimalPlaces;
        if (decimalPlaces === undefined) {
            decimalPlaces = this.companyDecimalPlaces;
            if (decimalPlaces === undefined) {
                const storedDecimalPlaces = localStorage.getItem('currencyDecimalType');
                decimalPlaces = storedDecimalPlaces ? parseInt(storedDecimalPlaces) : 2;
            }
        }

        // Round the number to the specified decimal places
        const roundedValue = giddhRoundOff(value, decimalPlaces);

        try {
            // Use Intl.NumberFormat for locale-specific formatting
            const formatter = new Intl.NumberFormat(formatLocale, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
                useGrouping: true
            });

            return formatter.format(roundedValue);
        } catch (error) {
            // Fallback to basic formatting if locale is not supported
            console.warn(`Locale ${formatLocale} not supported, falling back to basic formatting`);
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
        const parts = roundedValue.toString().split('.');

        // Add thousand separators
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Ensure decimal places
        if (decimalPlaces > 0) {
            if (parts.length === 1) {
                parts[1] = '0'.repeat(decimalPlaces);
            } else {
                parts[1] = parts[1].padEnd(decimalPlaces, '0').substring(0, decimalPlaces);
            }
            return parts.join('.');
        }

        return parts[0];
    }
}
