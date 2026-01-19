import { Inject, Injectable } from '@angular/core';
import { config, IConfig } from './config';

/**
 * Separators enumeration
 * Defines constant values for Separators
 */
export enum Separators {
    SEPARATOR = 'separator',
    COMMA_SEPARATOR = 'comma_separator',
    DOT_SEPARATOR = 'dot_separator',
    IND_COMMA_SEPARATED = 'ind_comma_separated',
    INT_COMMA_SEPARATED = 'int_comma_separated',
    INT_SPACE_SEPARATED = 'int_space_separated',
    INT_APOSTROPHE_SEPARATED = 'int_apostrophe_separated',
    NOT_SEPARATED = 'not_separated'
}

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * MaskApplierService service
 * Provides maskapplier related business logic and data operations
 */
export class MaskApplierService {
    public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
    public hiddenInput: IConfig['hiddenInput'];
    public showTemplate!: IConfig['showTemplate'];
    public clearIfNotMatch!: IConfig['clearIfNotMatch'];
    public maskExpression: string = '';
    public actualValue: string = '';
    public shownMaskExpression: string = '';
    public maskSpecialCharacters!: IConfig['specialCharacters'];
    public maskAvailablePatterns!: IConfig['patterns'];
    public prefix!: IConfig['prefix'];
    public suffix!: IConfig['suffix'];
    public customPattern!: IConfig['patterns'];
    public ipError?: boolean;
    public showMaskTyped!: IConfig['showMaskTyped'];
    public validation: IConfig['validation'];
    public giddhDecimalPlaces!: number;

    private _shift!: Set<number>;

    /**
     * Handles constructor functionality
     */
    public constructor(@Inject(config) protected _config: IConfig) {
        this._shift = new Set();
        this.clearIfNotMatch = this._config.clearIfNotMatch;
        this.dropSpecialCharacters = this._config.dropSpecialCharacters;
        this.maskSpecialCharacters = this._config!.specialCharacters;
        this.maskAvailablePatterns = this._config.patterns;
        this.prefix = this._config.prefix || '';
        this.suffix = this._config.suffix;
        this.hiddenInput = this._config.hiddenInput;
        this.showMaskTyped = this._config.showMaskTyped;
        this.validation = this._config.validation;
    }

    /**
     * Check if mask expression is a separator type
     */
    private isSeparatorMask(maskExpression: string): boolean {
        return maskExpression.startsWith(Separators.SEPARATOR) ||
               maskExpression.startsWith(Separators.DOT_SEPARATOR) ||
               maskExpression.startsWith(Separators.COMMA_SEPARATOR) ||
               maskExpression.startsWith(Separators.IND_COMMA_SEPARATED) ||
               maskExpression.startsWith(Separators.INT_APOSTROPHE_SEPARATED) ||
               maskExpression.startsWith(Separators.INT_COMMA_SEPARATED) ||
               maskExpression.startsWith(Separators.INT_SPACE_SEPARATED) ||
               maskExpression.startsWith(Separators.NOT_SEPARATED);
    }

    /**
     * Check if input value contains invalid characters for separator masks
     */
    private hasInvalidCharacters(inputValue: string): boolean {
        return !!(inputValue.match('[wа-яА-Я]') ||
                 inputValue.match('[ЁёА-я]') ||
                 inputValue.match('[a-z]|[A-Z]') ||
                 inputValue.match(/[-@#!$%\\^&*()_£¬+|~=`{}\[\]:";<>?\/]/));
    }

    /**
     * Process input value for basic separator mask
     */
    private processSeparatorInput(inputValue: string): string {
        /**
         * Handles if functionality
         */
        if (
            inputValue.includes(',') &&
            inputValue?.endsWith(',') &&
            inputValue?.indexOf(',') !== inputValue.lastIndexOf(',')
        ) {
            inputValue = inputValue.substring(0, inputValue?.length - 1);
        }
        return inputValue?.replace('.', ' ');
    }

    /**
     * Process input value for dot separator mask
     */
    private processDotSeparatorInput(inputValue: string): string {
        /**
         * Handles if functionality
         */
        if (
            inputValue?.indexOf('.') !== -1 &&
            inputValue?.indexOf('.') === inputValue.lastIndexOf('.') &&
            (inputValue?.indexOf('.') > 3 || inputValue?.length < 6)
        ) {
            inputValue = inputValue?.replace('.', ',');
        }
        return inputValue?.length > 1 && inputValue[0] === '0' && inputValue[1] !== ','
            ? inputValue.slice(1, inputValue?.length)
            : inputValue;
    }

    /**
     * Process input value for comma separator mask
     */
    private processCommaSeparatorInput(inputValue: string): string {
        return inputValue?.length > 1 && inputValue[0] === '0' && inputValue[1] !== '.'
            ? inputValue.slice(1, inputValue?.length)
            : inputValue;
    }

    /**
     * Process separator formatting with validation and precision
     */
    private processSeparatorFormatting(inputValue: string, precision: number): string {
        /**
         * Handles if functionality
         */
        if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:.";<>?\/]/)) {
            inputValue = inputValue.substring(0, inputValue?.length - 1);
        }
        inputValue = this.checkInputPrecision(inputValue, precision, ',');
        const strForSep = inputValue?.replace(/\s/g, '');
        return this.separator(strForSep, ' ', ',', precision);
    }

    /**
     * Process dot separator formatting with validation and precision
     */
    private processDotSeparatorFormatting(inputValue: string, precision: number): string {
        /**
         * Handles if functionality
         */
        if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:\s";<>?\/]/)) {
            inputValue = inputValue.substring(0, inputValue?.length - 1);
        }
        inputValue = this.checkInputPrecision(inputValue, precision, ',');
        const strForSep = inputValue?.replace(/\./g, '');
        return this.separator(strForSep, '.', ',', precision);
    }

    /**
     * Process comma separator formatting with validation and precision
     */
    private processCommaSeparatorFormatting(inputValue: string, precision: number): string {
        const strForSep = inputValue?.replace(/,/g, '');
        return this.separator(strForSep, ',', '.', precision);
    }

    /**
     * Process Indian comma separated formatting with custom precision
     */
    private processIndCommaSeparatedFormatting(inputValue: string, precision: number): string {
        inputValue = this.checkInputPrecisionForCustomInput(inputValue, this.giddhDecimalPlaces, '.');
        const strForSep = inputValue?.replace(/,/g, '');
        return this.currencySeparator(strForSep, ',', '.', precision, true);
    }

    // tslint:disable-next-line:no-any
    /**
     * Handles applyMaskWithPattern functionality
     */
    public applyMaskWithPattern(inputValue: string, maskAndPattern: [string, IConfig['patterns']]): string {
        const [mask, customPattern] = maskAndPattern;
        this.customPattern = customPattern;
        return this.applyMask(inputValue, mask);
    }

    /**
     * Handles applyMask functionality
     */
    public applyMask(
        inputValue: string,
        maskExpression: string,
        position: number = 0,
        cb: Function = () => {
        },
    ): string {
        /**
         * Handles if functionality
         */
        if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
            return '';
        }
        let cursor: number = 0;
        let result: string = ``;
        let multi: boolean = false;
        let backspaceShift: boolean = false;
        let shift: number = 1;
        let stepBack: boolean = false;
        this.prefix = this.prefix || '';

        /**
         * Handles if functionality
         */
        if (inputValue.slice(0, this.prefix?.length) === this.prefix) {
            inputValue = inputValue.slice(this.prefix?.length, inputValue?.length);
        }
        const inputArray: string[] = inputValue?.toString()?.split('');
        /**
         * Handles if functionality
         */
        if (maskExpression === 'IP') {
            this.ipError = !!(inputArray?.filter((i: string) => i === '.')?.length < 3 && inputArray?.length < 7);
            maskExpression = '099.099.099.099';
        }
        /**
         * Handles if functionality
         */
        if (maskExpression.startsWith('percent')) {
            /**
             * Handles if functionality
             */
            if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
                inputValue = this._checkInput(inputValue);
                const precision: number = this.getPrecision(maskExpression);
                inputValue = this.checkInputPrecision(inputValue, precision, '.');
            }
            /**
             * Handles if functionality
             */
            if (inputValue?.indexOf('.') > 0 && !this.percentage(inputValue.substring(0, inputValue?.indexOf('.')))) {
                const base: string = inputValue.substring(0, inputValue?.indexOf('.') - 1);
                inputValue = `${base}${inputValue.substring(inputValue?.indexOf('.'), inputValue?.length)}`;
            }
            /**
             * Handles if functionality
             */
            if (this.percentage(inputValue)) {
                result = inputValue;
            } else {
                result = inputValue.substring(0, inputValue?.length - 1);
            }
        } else if (this.isSeparatorMask(maskExpression)) {
            /**
             * Handles if functionality
             */
            if (this.hasInvalidCharacters(inputValue)) {
                inputValue = this._checkInput(inputValue);
            }
            let precision: number = this.getPrecision(maskExpression);
            let strForSep: string;
            /**
             * Handles if functionality
             */
            if (maskExpression.startsWith(Separators.SEPARATOR)) {
                inputValue = this.processSeparatorInput(inputValue);
            }
            /**
             * Handles if functionality
             */
            if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
                inputValue = this.processDotSeparatorInput(inputValue);
            }
            /**
             * Handles if functionality
             */
            if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
                inputValue = this.processCommaSeparatorInput(inputValue);
            }

            /**
             * Handles if functionality
             */
            if (maskExpression.startsWith(Separators.SEPARATOR)) {
                result = this.processSeparatorFormatting(inputValue, precision);
            } else if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
                result = this.processDotSeparatorFormatting(inputValue, precision);
            } else if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
                result = this.processCommaSeparatorFormatting(inputValue, precision);
            } else if (maskExpression.startsWith(Separators.IND_COMMA_SEPARATED)) {
                result = this.processIndCommaSeparatedFormatting(inputValue, precision);
            } else if (maskExpression.startsWith(Separators.INT_SPACE_SEPARATED)) {
                inputValue = this.checkInputPrecisionForCustomInput(inputValue, this.giddhDecimalPlaces, '.');
                strForSep = inputValue?.replace(/[ ,']/g, '');
                result = this.currencySeparator(strForSep, ' ', '.', precision);
            } else if (maskExpression.startsWith(Separators.INT_COMMA_SEPARATED)) {
                inputValue = this.checkInputPrecisionForCustomInput(inputValue, this.giddhDecimalPlaces, '.');
                strForSep = inputValue?.replace(/,/g, '');
                result = this.currencySeparator(strForSep, ',', '.', precision);
            } else if (maskExpression.startsWith(Separators.INT_APOSTROPHE_SEPARATED)) {
                inputValue = this.checkInputPrecisionForCustomInput(inputValue, this.giddhDecimalPlaces, '.');
                strForSep = inputValue?.replace(/[ ,']/g, '');
                result = this.currencySeparator(strForSep, '\'', '.', precision);
            } else if (maskExpression.startsWith(Separators.NOT_SEPARATED)) {
                inputValue = this.checkInputPrecision(inputValue, precision, ',');
                strForSep = inputValue;
                result = strForSep;
            }

            const commaShift: number = result?.indexOf(',') - inputValue?.indexOf(',');
            let shiftStep: number = result?.length - inputValue?.length;

            // position shifting issue fixed for custom separators
            /**
             * Handles if functionality
             */
            if (!(maskExpression.startsWith(Separators.IND_COMMA_SEPARATED) ||
                maskExpression.startsWith(Separators.INT_APOSTROPHE_SEPARATED) ||
                maskExpression.startsWith(Separators.INT_COMMA_SEPARATED) ||
                maskExpression.startsWith(Separators.INT_SPACE_SEPARATED))) {
                /**
                 * Handles if functionality
                 */
                if (shiftStep > 0 && result[position] !== ',') {
                    backspaceShift = true;
                    let _shift: number = 0;
                    do {
                        this._shift.add(position + _shift);
                        _shift++;
                    } while (_shift < shiftStep);
                } else if (
                    (commaShift !== 0 && position > 0 && !(result?.indexOf(',') >= position && position > 3)) ||
                    (!(result?.indexOf('.') >= position && position > 3) && shiftStep <= 0)
                ) {
                    this._shift.clear();
                    backspaceShift = true;
                    shift = shiftStep;
                    position += shiftStep;
                    this._shift.add(position);
                } else {
                    this._shift.clear();
                }
            } else {
                let shiftCustomOperator: string;
                /**
                 * Handles switch functionality
                 */
                switch (maskExpression) {
                    case Separators.IND_COMMA_SEPARATED:
                    case Separators.INT_COMMA_SEPARATED:
                        shiftCustomOperator = ',';
                        break;
                    case Separators.INT_APOSTROPHE_SEPARATED:
                        shiftCustomOperator = '\'';
                        break;
                    case Separators.INT_SPACE_SEPARATED:
                        shiftCustomOperator = ' ';
                        break;
                    case Separators.NOT_SEPARATED:
                        shiftCustomOperator = '';
                        break;
                }
                let resultSpecialCharLength: number = (result.match(new RegExp(shiftCustomOperator, 'g')) || [])?.length;
                let inputSpecialCharLength: number = (inputValue.match(new RegExp(shiftCustomOperator, 'g')) || [])?.length;

                // if new separator character added to result then shift cursor by special character length
                /**
                 * Handles if functionality
                 */
                if (resultSpecialCharLength > inputSpecialCharLength) {
                    this._shift.add(position + (resultSpecialCharLength - inputSpecialCharLength));
                    position += resultSpecialCharLength - inputSpecialCharLength;
                } else {
                    // this means back space has been pressed, clear shift and mark back shift as true
                    this._shift.clear();
                    backspaceShift = true;
                    shift = shiftStep;
                    position += shiftStep;
                    this._shift.add(position);
                }
            }

        } else {
            /**
             * Handles for functionality
             */
            for (
                // tslint:disable-next-line
                let i: number = 0, inputSymbol: string = inputArray[0];
                i < inputArray?.length;
                i++, inputSymbol = inputArray[i]
            ) {
                /**
                 * Handles if functionality
                 */
                if (cursor === maskExpression?.length) {
                    break;
                }
                /**
                 * Handles if functionality
                 */
                if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
                    result += inputSymbol;
                    cursor += 2;
                } else if (
                    maskExpression[cursor + 1] === '*' &&
                    multi &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])
                ) {
                    result += inputSymbol;
                    cursor += 3;
                    multi = false;
                } else if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor]) &&
                    maskExpression[cursor + 1] === '*'
                ) {
                    result += inputSymbol;
                    multi = true;
                } else if (
                    maskExpression[cursor + 1] === '?' &&
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])
                ) {
                    result += inputSymbol;
                    cursor += 3;
                } else if (
                    this._checkSymbolMask(inputSymbol, maskExpression[cursor]) ||
                    (this.hiddenInput &&
                        this.maskAvailablePatterns[maskExpression[cursor]] &&
                        this.maskAvailablePatterns[maskExpression[cursor]].symbol === inputSymbol)
                ) {
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor] === 'H') {
                        /**
                         * Handles if functionality
                         */
                        if (Number(inputSymbol) > 2) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray?.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix?.length || 0);
                            i--;
                            continue;
                        }
                    }
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor] === 'h') {
                        /**
                         * Handles if functionality
                         */
                        if (result === '2' && Number(inputSymbol) > 3) {
                            cursor += 1;
                            i--;
                            continue;
                        }
                    }
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor] === 'm') {
                        /**
                         * Handles if functionality
                         */
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray?.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix?.length || 0);
                            i--;
                            continue;
                        }
                    }
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor] === 's') {
                        /**
                         * Handles if functionality
                         */
                        if (Number(inputSymbol) > 5) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray?.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix?.length || 0);
                            i--;
                            continue;
                        }
                    }
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor - 1] === 'd') {
                        /**
                         * Handles if functionality
                         */
                        if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 31 || inputValue[cursor] === '/') {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray?.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix?.length || 0);
                            i--;
                            continue;
                        }
                    }
                    /**
                     * Handles if functionality
                     */
                    if (maskExpression[cursor] === 'M') {
                        /**
                         * Handles if functionality
                         */
                        if (
                            (inputValue[cursor - 1] === '/' &&
                                (Number(inputValue.slice(cursor, cursor + 2)) > 12 ||
                                    inputValue[cursor + 1] === '/')) ||
                            (Number(inputValue.slice(cursor - 1, cursor + 1)) > 12 ||
                                /**
                                 * Handles Number functionality
                                 */
                                Number(inputValue.slice(0, 2)) > 31 ||
                                (Number(inputValue[cursor - 1]) > 1 && inputValue[cursor - 2] === '/'))
                        ) {
                            cursor += 1;
                            const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                                ? inputArray?.length
                                : cursor;
                            this._shift.add(shiftStep + this.prefix?.length || 0);
                            i--;
                            continue;
                        }
                    }

                    result += inputSymbol;
                    cursor++;
                } else if (this.maskSpecialCharacters?.indexOf(maskExpression[cursor]) !== -1) {
                    result += maskExpression[cursor];
                    cursor++;
                    const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor))
                        ? inputArray?.length
                        : cursor;
                    this._shift.add(shiftStep + this.prefix?.length || 0);
                    i--;
                } else if (
                    this.maskSpecialCharacters?.indexOf(inputSymbol) > -1 &&
                    this.maskAvailablePatterns[maskExpression[cursor]] &&
                    this.maskAvailablePatterns[maskExpression[cursor]].optional
                ) {
                    cursor++;
                    i--;
                } else if (
                    this.maskExpression[cursor + 1] === '*' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.maskExpression[cursor + 1] === '?' &&
                    this._findSpecialChar(this.maskExpression[cursor + 2]) &&
                    this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] &&
                    multi
                ) {
                    cursor += 3;
                    result += inputSymbol;
                } else if (
                    this.showMaskTyped &&
                    this.maskSpecialCharacters?.indexOf(inputSymbol) < 0 &&
                    inputSymbol !== '_'
                ) {
                    stepBack = true;
                }
            }
        }
        /**
         * Handles if functionality
         */
        if (
            result?.length + 1 === maskExpression?.length &&
            this.maskSpecialCharacters?.indexOf(maskExpression[maskExpression?.length - 1]) !== -1
        ) {
            result += maskExpression[maskExpression?.length - 1];
        }

        let newPosition: number = position + 1;

        /**
         * Handles while functionality
         */
        while (this._shift.has(newPosition)) {
            shift++;
            newPosition++;
        }

        let actualShift: number = this._shift.has(position) ? shift : 0;
        /**
         * Handles if functionality
         */
        if (stepBack) {
            actualShift--;
        }
        /**
         * Handles cb functionality
         */
        cb(actualShift, backspaceShift);
        /**
         * Handles if functionality
         */
        if (shift < 0) {
            this._shift.clear();
        }
        let res: string = this.suffix ? `${this.prefix}${result}${this.suffix}` : `${this.prefix}${result}`;
        /**
         * Handles if functionality
         */
        if (result?.length === 0) {
            res = `${this.prefix}${result}`;
        }
        return res;
    }

    /**
     * Handles _findSpecialChar functionality
     */
    public _findSpecialChar(inputSymbol: string): undefined | string {
        return this.maskSpecialCharacters.find((val: string) => val === inputSymbol);
    }

    /**
     * Handles _checkSymbolMask functionality
     */
    protected _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
        this.maskAvailablePatterns = this.customPattern ? this.customPattern : this.maskAvailablePatterns;
        /**
         * Handles return functionality
         */
        return (
            this.maskAvailablePatterns[maskSymbol] &&
            this.maskAvailablePatterns[maskSymbol].pattern &&
            this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol)
        );
    }

    /**
     * Handles separator functionality
     */
    private separator = (str: string, char: string, decimalChar: string, precision: number) => {
        str += '';
        const x: string[] = str.split(decimalChar);
        const decimals: string = x?.length > 1 ? `${decimalChar}${x[1]}` : '';
        let res: string = x[0];
        const rgx: RegExp = /(\d+)(\d{3})/;
        /**
         * Handles while functionality
         */
        while (rgx.test(res)) {
            res = res?.replace(rgx, '$1' + char + '$2');
        }
        /**
         * Handles if functionality
         */
        if (precision === undefined) {
            return res + decimals;
        } else if (precision === 0) {
            return res;
        }
        return res + decimals.substr(0, precision + 1);
    };

    /**
     * convert string in currency like 3-3-3 3 3 3 3,3,3 3'3'3
     * @param str string of number
     * @param char by which string will be separated
     * @param decimalChar decimal character symbol
     * @param precision number of decimal character allowed
     * @param indFormat indian format or not ( 2 for indian and 3 for others)
     */
    private currencySeparator = (str: string, char: string, decimalChar: string, precision: number,
        indFormat: boolean = false) => {
        str += '';
        const x: string[] = str.split(decimalChar);
        const decimals: string = x?.length > 1 ? `${decimalChar}${x[1]}` : '';
        const baseNum: string = x[0];
        let lastThree: string = baseNum.substring(baseNum?.length - 3);
        const otherNumbers: string = baseNum.substring(0, baseNum?.length - 3);
        /**
         * Handles if functionality
         */
        if (otherNumbers !== '') {
            lastThree = char + lastThree;
        }
        const res: string = (indFormat ? otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, char) :
            otherNumbers?.replace(/\B(?=(\d{3})+(?!\d))/g, char)) + lastThree;
        /**
         * Handles if functionality
         */
        if (precision === undefined) {
            return res + decimals;
        } else if (precision === 0) {
            return res;
        }
        return res + decimals.substr(0, precision + 1);
    };

    /**
     * Handles percentage functionality
     */
    private percentage = (str: string): boolean => {
        return Number(str) >= 0 && Number(str) <= 100;
    };

    /**
     * Retrieves precision data
     */
    private getPrecision = (maskExpression: string): number => {
        const x: string[] = maskExpression.split('.');
        /**
         * Handles if functionality
         */
        if (x?.length > 1) {
            return Number(x[x?.length - 1]);
        }
        return Infinity;
    };

    /**
     * Handles checkInputPrecision functionality
     */
    private checkInputPrecision = (inputValue: string, precision: number, decimalMarker: string): string => {
        /**
         * Handles if functionality
         */
        if (precision < Infinity) {
            let precisionRegEx: RegExp;

            // Sanitize precision to prevent ReDoS attacks
            const safePrecision = Math.max(0, Math.min(20, parseInt(String(precision), 10) || 0));

            /**
             * Handles if functionality
             */
            if (decimalMarker === '.') {
                precisionRegEx = new RegExp(`\\.\\d{${safePrecision}}.*$`);
            } else if (decimalMarker === ',') {
                precisionRegEx = new RegExp(`,\\d{${safePrecision}}.*$`);
            }

            const precisionMatch: RegExpMatchArray | null = inputValue.match(precisionRegEx);
            /**
             * Handles if functionality
             */
            if (precisionMatch && precisionMatch[0]?.length - 1 > precision) {
                inputValue = inputValue.substring(0, inputValue?.length - 1);
            } else if (precision === 0 && inputValue?.endsWith(decimalMarker)) {
                inputValue = inputValue.substring(0, inputValue?.length - 1);
            }
        }
        return inputValue;
    };

    /**
     * for removing extra decimal places
     * @param inputValue actual value
     * @param precision number of decimals
     * @param decimalMarker symbol
     */
    private checkInputPrecisionForCustomInput = (inputValue: string, precision: number, decimalMarker: string): string => {
        /**
         * Handles if functionality
         */
        if (precision < Infinity) {
            let precisionRegEx: RegExp;

            const splitter = inputValue.split(decimalMarker);
            /**
             * Handles if functionality
             */
            if (precision === 0) {
                inputValue = splitter[0];
            } else {
                /**
                 * Handles if functionality
                 */
                if (splitter[1]) {
                    // decimal points are grater then allowed then replace
                    /**
                     * Handles if functionality
                     */
                    if (splitter[1]?.length > precision) {
                        splitter[1] = splitter[1].substr(0, precision);
                        inputValue = splitter.join('.');
                    } else {
                        // add necessary decimal points
                        // let missingPoints = precision - splitter[1]?.length;
                        // while (missingPoints) {
                        //   splitter[1] = splitter[1] + '0';
                        //   missingPoints--;
                        // }
                        // inputValue = splitter.join('.');
                    }
                } else {
                    // if no decimal points then add missing
                    // let missingPoints = precision;
                    // splitter[1] = '';
                    // while (missingPoints) {
                    //   splitter[1] = splitter[1] + '0';
                    //   missingPoints--;
                    // }
                    // inputValue = splitter.join('.');
                }
            }
        }
        return inputValue;
    };

    /**
     * remove any unsupported character from string
     * @param str actual string
     * @private
     */
    private _checkInput(str: string): string {
        return str
            .split('')
            .filter((i: string) => i.match('\\d') || i === '.' || i === ',')
            .join('');
    }

    // tslint:disable-next-line: max-file-line-count
}
