import { AppState } from './../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from './../../../../services/general.service';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { REMOVE_TRAILING_ZERO_REGEX } from 'apps/web-giddh/src/app/app.constant';
import { giddhRoundOff } from '../../helperFunctions';

@Pipe({ name: 'giddhCurrency', pure: true, standalone: false })

export class GiddhCurrencyPipe implements OnDestroy, PipeTransform {
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public _currencyNumberType: string;
    public currencyDecimalType: number;

    constructor(private store: Store<AppState>, private _generalService: GeneralService) {
        if (!this._generalService.isCurrencyPipeLoaded) {
            this.store.pipe(select(p => p.settings.profile), distinctUntilKeyChanged('balanceDisplayFormat'), takeUntil(this.destroyed$)).subscribe((o) => {
                if (o && o.name) {
                    this._currencyNumberType = o.balanceDisplayFormat ? o.balanceDisplayFormat : 'IND_COMMA_SEPARATED';
                    this.currencyDecimalType = o.balanceDecimalPlaces ? o.balanceDecimalPlaces : 0;
                    if (this.currencyDecimalType) {
                        localStorage.setItem('currencyDecimalType', this.currencyDecimalType?.toString());
                    }
                    if (this._currencyNumberType) {
                        localStorage.setItem('currencyNumberType', this._currencyNumberType);
                    }
                    this._generalService.isCurrencyPipeLoaded = true;
                }
            });
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Tranforms the current value as per the user preference
     *
     * @param {number} input Input value to be transformed
     * @param {number} [customDecimalPlaces] Custom decimal places to be used
     * @returns {string} Transformed value
     * @memberof GiddhCurrencyPipe
     */
    public transform(input: number, customDecimalPlaces?: number, shouldRemoveTrailingZeros?: boolean): string {
        if (input == null) {
            return;
        }

        const transformContext = this.initializeTransformContext(input, customDecimalPlaces);

        // Handle simple numbers (3 digits or less)
        if (transformContext.result[0]?.length <= 3) {
            return this.handleSimpleNumber(transformContext, shouldRemoveTrailingZeros);
        }

        // Handle complex numbers (more than 3 digits)
        return this.handleComplexNumber(transformContext, shouldRemoveTrailingZeros);
    }

    /**
     * Initialize transformation context with common variables
     */
    private initializeTransformContext(input: number, customDecimalPlaces?: number): any {
        const result = input?.toString()?.split('.');
        const currencyType = this._currencyNumberType ? this._currencyNumberType : localStorage.getItem('currencyNumberType');
        const digitAfterDecimallocal: number = parseInt(localStorage.getItem('currencyDecimalType')) || 0;
        const digitAfterDecimal: number = customDecimalPlaces ? Number(customDecimalPlaces) :
                                         this.currencyDecimalType ? this.currencyDecimalType : digitAfterDecimallocal;

        return {
            result,
            currencyType,
            digitAfterDecimal
        };
    }

    /**
     * Handle simple numbers (3 digits or less)
     */
    private handleSimpleNumber(context: any, shouldRemoveTrailingZeros: boolean): string {
        const { result, digitAfterDecimal } = context;

        if (!result[0]?.toString()?.includes('-')) {
            return this.formatSimplePositiveNumber(result, digitAfterDecimal, shouldRemoveTrailingZeros);
        } else {
            return this.formatSimpleNegativeNumber(result, digitAfterDecimal, shouldRemoveTrailingZeros);
        }
    }

    /**
     * Format simple positive number
     */
    private formatSimplePositiveNumber(result: string[], digitAfterDecimal: number, shouldRemoveTrailingZeros: boolean): string {
        let op = result[0]?.toString();

        if (result?.length > 1) {
            if (digitAfterDecimal !== 0) {
                result[1] = (result[1]?.length < 4) ? result[1] + '0000' : result[1];
                op += '.' + result[1];
                op = String(giddhRoundOff(op, digitAfterDecimal));
            }
        } else {
            op += this.getDecimalPadding(digitAfterDecimal);
        }

        return shouldRemoveTrailingZeros ? op?.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : op;
    }

    /**
     * Format simple negative number
     */
    private formatSimpleNegativeNumber(result: string[], digitAfterDecimal: number, shouldRemoveTrailingZeros: boolean): string {
        let op = '-' + result[0].substring(1);

        if (result?.length > 1) {
            if (digitAfterDecimal !== 0) {
                result[1] = (result[1]?.length < 4) ? result[1] + '0000' : result[1];
                op += '.' + result[1];
                op = String(giddhRoundOff(op, digitAfterDecimal));
            }
        } else {
            op += this.getDecimalPadding(digitAfterDecimal);
        }

        return shouldRemoveTrailingZeros ? op?.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : op;
    }

    /**
     * Get decimal padding based on decimal places
     */
    private getDecimalPadding(digitAfterDecimal: number): string {
        switch (digitAfterDecimal) {
            case 2: return '.00';
            case 3: return '.000';
            case 4: return '.0000';
            default: return '';
        }
    }

    /**
     * Handle complex numbers (more than 3 digits)
     */
    private handleComplexNumber(context: any, shouldRemoveTrailingZeros: boolean): string {
        const { result, currencyType, digitAfterDecimal } = context;

        const lastThree = result[0].substring(result[0]?.length - 3);
        const otherNumbers = result[0].substring(0, result[0]?.length - 3);
        const afterdecDigit = this.processDecimalPart(result, digitAfterDecimal);

        const finaloutput = this.applyCurrencyFormatting(currencyType, otherNumbers, lastThree, afterdecDigit);

        return shouldRemoveTrailingZeros ? finaloutput?.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : finaloutput;
    }

    /**
     * Process decimal part for complex numbers
     */
    private processDecimalPart(result: string[], digitAfterDecimal: number): string | null {
        if (result?.length > 1) {
            if (digitAfterDecimal !== 0) {
                result[1] = (result[1]?.length < 4) ? result[1] + '0000' : result[1];
                const dummyNumber = '1.' + result[1];
                const roundedNumber = String(giddhRoundOff(dummyNumber, digitAfterDecimal));
                const tempResult = roundedNumber?.split('.');
                return tempResult[1];
            }
        } else {
            switch (digitAfterDecimal) {
                case 2: return '00';
                case 3: return '000';
                case 4: return '0000';
                default: return null;
            }
        }
        return null;
    }

    /**
     * Apply currency formatting based on type
     */
    private applyCurrencyFormatting(currencyType: string, otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        switch (currencyType) {
            case 'IND_COMMA_SEPARATED':
                return this.formatIndianComma(otherNumbers, lastThree, afterdecDigit);
            case 'INT_COMMA_SEPARATED':
                return this.formatInternationalComma(otherNumbers, lastThree, afterdecDigit);
            case 'INT_SPACE_SEPARATED':
                return this.formatSpaceSeparated(otherNumbers, lastThree, afterdecDigit);
            case 'INT_APOSTROPHE_SEPARATED':
                return this.formatApostropheSeparated(otherNumbers, lastThree, afterdecDigit);
            default:
                return this.formatDefaultComma(otherNumbers, lastThree, afterdecDigit);
        }
    }

    /**
     * Format with Indian comma separation (2-digit groups)
     */
    private formatIndianComma(otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        if (!otherNumbers) return '';

        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ',' + lastThree;
        }
        let output = otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        if (afterdecDigit) {
            output += '.' + afterdecDigit;
        }
        return output;
    }

    /**
     * Format with international comma separation (3-digit groups)
     */
    private formatInternationalComma(otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ',' + lastThree;
        }
        let output = otherNumbers?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
        if (afterdecDigit) {
            output += '.' + afterdecDigit;
        }
        return output;
    }

    /**
     * Format with space separation
     */
    private formatSpaceSeparated(otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ' ' + lastThree;
        }
        let output = otherNumbers?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + lastThree;
        if (afterdecDigit) {
            output += '.' + afterdecDigit;
        }
        return output;
    }

    /**
     * Format with apostrophe separation
     */
    private formatApostropheSeparated(otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = '\'' + lastThree;
        }
        let output = otherNumbers?.replace(/\B(?=(\d{3})+(?!\d))/g, "\'") + lastThree;
        if (afterdecDigit) {
            output += '.' + afterdecDigit;
        }
        return output;
    }

    /**
     * Format with default comma separation
     */
    private formatDefaultComma(otherNumbers: string, lastThree: string, afterdecDigit: string | null): string {
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ',' + lastThree;
        }
        let output = otherNumbers?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
        if (afterdecDigit) {
            output += '.' + afterdecDigit;
        }
        return output;
    }
}
