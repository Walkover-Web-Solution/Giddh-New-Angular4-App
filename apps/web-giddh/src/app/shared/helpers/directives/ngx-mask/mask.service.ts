import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import { config, IConfig } from './config';
import { DOCUMENT } from '@angular/common';
import { MaskApplierService, Separators } from './mask-applier.service';

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * MaskService service
 * Provides mask related business logic and data operations
 */
export class MaskService extends MaskApplierService {
    public validation: boolean = true;
    public maskExpression: string = '';
    public isNumberValue: boolean = false;
    public showMaskTyped: boolean = false;
    public maskIsShown: string = '';
    public selStart: number | null = null;
    public selEnd: number | null = null;
    protected _formElement: HTMLInputElement;
    // tslint:disable-next-line
    /**
     * Handles change event
     */
    public onChange = (_: any) => {
    };

    /**
     * Handles constructor functionality
     */
    public constructor(
        // tslint:disable-next-line
        @Inject(DOCUMENT) private document: any,
        @Inject(config) protected _config: IConfig,
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    ) {
        /**
         * Handles super functionality
         */
        super(_config);
        this._formElement = this._elementRef.nativeElement;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    /**
     * Handles applyMask functionality
     */
    public applyMask(
        inputValue: string,
        maskExpression: string,
        position: number = 0,
        cb: Function = () => {
        }
    ): string {
        /**
         * Handles if functionality
         */
        if (!maskExpression) {
            return inputValue;
        }
        this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : '';
        /**
         * Handles if functionality
         */
        if (this.maskExpression === 'IP' && this.showMaskTyped) {
            this.maskIsShown = this.showMaskInInput(inputValue || '#');
        }
        /**
         * Handles if functionality
         */
        if (!inputValue && this.showMaskTyped) {
            this.formControlResult(this.prefix);
            return this.prefix + this.maskIsShown;
        }
        const getSymbol: string = !!inputValue && typeof this.selStart === 'number' ? inputValue[this.selStart] : '';
        let newInputValue: string = '';
        /**
         * Handles if functionality
         */
        if (this.hiddenInput !== undefined) {
            let actualResult: string[] = this.actualValue.split('');
            inputValue !== '' && actualResult?.length
                ? typeof this.selStart === 'number' && typeof this.selEnd === 'number'
                    ? inputValue?.length > actualResult?.length
                        ? actualResult.splice(this.selStart, 0, getSymbol)
                        : inputValue?.length < actualResult?.length
                            ? actualResult?.length - inputValue?.length === 1
                                ? actualResult.splice(this.selStart - 1, 1)
                                : actualResult.splice(this.selStart, this.selEnd - this.selStart)
                            // tslint:disable-next-line:no-unused-expression
                            : null
                    // tslint:disable-next-line:no-unused-expression
                    : null
                : (actualResult = []);
            newInputValue = this.actualValue?.length ? this.shiftTypedSymbols(actualResult.join('')) : inputValue;
        }
        newInputValue = Boolean(newInputValue) && newInputValue?.length ? newInputValue : inputValue;
        const result: string = super.applyMask(newInputValue, maskExpression, position, cb);
        this.actualValue = this.getActualValue(result);

        /**
         * Handles if functionality
         */
        if (
            (this.maskExpression.startsWith(Separators.SEPARATOR) ||
                this.maskExpression.startsWith(Separators.DOT_SEPARATOR)) &&
            this.dropSpecialCharacters === true
        ) {
            this.maskSpecialCharacters = this.maskSpecialCharacters?.filter((item: string) => item !== ',');
        }
        /**
         * Handles if functionality
         */
        if (this.maskExpression.startsWith(Separators.COMMA_SEPARATOR) && this.dropSpecialCharacters === true) {
            this.maskSpecialCharacters = this.maskSpecialCharacters?.filter((item: string) => item !== '.');
        }

        this.formControlResult(result);

        /**
         * Handles if functionality
         */
        if (!this.showMaskTyped) {
            /**
             * Handles if functionality
             */
            if (this.hiddenInput) {
                return result && result?.length ? this.hideInput(result, this.maskExpression) : result;
            }
            return result;
        }
        const resLen: number = result?.length;
        const prefNmask: string = this.prefix + this.maskIsShown;
        return result + (this.maskExpression === 'IP' ? prefNmask : prefNmask.slice(resLen));
    }

    /**
     * Handles applyValueChanges functionality
     */
    public applyValueChanges(position: number = 0, cb: Function = () => {
    }): void {
        this._formElement.value = this.applyMask(this._formElement?.value, this.maskExpression, position, cb);
        /**
         * Handles if functionality
         */
        if (this._formElement === this.document.activeElement) {
            return;
        }
        this.clearIfNotMatchFn();
    }

    /**
     * Hides input element
     */
    public hideInput(inputValue: string, maskExpression: string): string {
        return inputValue
            .split('')
            .map((curr: string, index: number) => {
                /**
                 * Handles if functionality
                 */
                if (
                    this.maskAvailablePatterns &&
                    this.maskAvailablePatterns[maskExpression[index]] &&
                    this.maskAvailablePatterns[maskExpression[index]].symbol
                ) {
                    return this.maskAvailablePatterns[maskExpression[index]].symbol;
                }
                return curr;
            })
            .join('');
    }

    // this function is not necessary, it checks result against maskExpression
    /**
     * Retrieves actualvalue data
     */
    public getActualValue(res: string): string {
        const compare: string[] = res
            .split('')
            .filter(
                (symbol: string, i: number) =>
                    this._checkSymbolMask(symbol, this.maskExpression[i]) ||
                    (this.maskSpecialCharacters.includes(this.maskExpression[i]) && symbol === this.maskExpression[i])
            );
        /**
         * Handles if functionality
         */
        if (compare.join('') === res) {
            return compare.join('');
        }
        return res;
    }

    /**
     * Handles shiftTypedSymbols functionality
     */
    public shiftTypedSymbols(inputValue: string): string {
        let symbolToReplace: string = '';
        const newInputValue: string[] =
            (inputValue &&
                inputValue.split('').map((currSymbol: string, index: number) => {
                    /**
                     * Handles if functionality
                     */
                    if (
                        this.maskSpecialCharacters.includes(inputValue[index + 1]) &&
                        inputValue[index + 1] !== this.maskExpression[index + 1]
                    ) {
                        symbolToReplace = currSymbol;
                        return inputValue[index + 1];
                    }
                    /**
                     * Handles if functionality
                     */
                    if (symbolToReplace?.length) {
                        const replaceSymbol: string = symbolToReplace;
                        symbolToReplace = '';
                        return replaceSymbol;
                    }
                    return currSymbol;
                })) ||
            [];
        return newInputValue.join('');
    }

    /**
     * Shows maskininput element
     */
    public showMaskInInput(inputVal?: string): string {
        /**
         * Handles if functionality
         */
        if (this.showMaskTyped && !!this.shownMaskExpression) {
            /**
             * Handles if functionality
             */
            if (this.maskExpression?.length !== this.shownMaskExpression?.length) {
                throw new Error('Mask expression must match mask placeholder length');
            } else {
                return this.shownMaskExpression;
            }
        } else if (this.showMaskTyped) {
            /**
             * Handles if functionality
             */
            if (inputVal) {
                return this._checkForIp(inputVal);
            }
            return this.maskExpression?.replace(/\w/g, '_');
        }
        return '';
    }

    /**
     * Handles clearIfNotMatchFn functionality
     */
    public clearIfNotMatchFn(): void {
        /**
         * Handles if functionality
         */
        if (
            this.clearIfNotMatch &&
            this.prefix?.length + this.maskExpression?.length + this.suffix?.length !== this._formElement?.value?.length
        ) {
            this.formElementProperty = ['value', ''];
            this.applyMask(this._formElement?.value, this.maskExpression);
        }
    }

    public set formElementProperty([name, value]: [string, string | boolean]) {
        this._renderer.setProperty(this._formElement, name, value);
    }

    /**
     * Handles checkSpecialCharAmount functionality
     */
    public checkSpecialCharAmount(mask: string): number {
        const chars: string[] = mask.split('')?.filter((item: string) => this._findSpecialChar(item));
        return chars?.length;
    }

    /**
     * Handles _checkForIp functionality
     */
    private _checkForIp(inputVal: string): string {
        /**
         * Handles if functionality
         */
        if (inputVal === '#') {
            return '_._._._';
        }
        const arr: string[] = [];
        /**
         * Handles for functionality
         */
        for (let i: number = 0; i < inputVal?.length; i++) {
            /**
             * Handles if functionality
             */
            if (inputVal[i].match('\\d')) {
                arr.push(inputVal[i]);
            }
        }
        /**
         * Handles if functionality
         */
        if (arr?.length <= 3) {
            return '_._._';
        }
        /**
         * Handles if functionality
         */
        if (arr?.length > 3 && arr?.length <= 6) {
            return '_._';
        }
        /**
         * Handles if functionality
         */
        if (arr?.length > 6 && arr?.length <= 9) {
            return '_';
        }
        /**
         * Handles if functionality
         */
        if (arr?.length > 9 && arr?.length <= 12) {
            return '';
        }
        return '';
    }

    /**
     * Handles formControlResult functionality
     */
    private formControlResult(inputValue: string): void {
        /**
         * Handles if functionality
         */
        if (Array.isArray(this.dropSpecialCharacters)) {
            this.onChange(
                this._removeMask(this._removeSuffix(this._removePrefix(inputValue)), this.dropSpecialCharacters)
            );
        } else if (this.dropSpecialCharacters) {
            let result = this._checkSymbols(inputValue);
            this.onChange(result);
        } else {
            this.onChange(this._removeSuffix(this._removePrefix(inputValue)));
        }
    }

    /**
     * Handles _removeMask functionality
     */
    private _removeMask(value: string, specialCharactersForRemove: string[]): string {
        return value ? value?.replace(this._regExpForRemove(specialCharactersForRemove), '') : value;
    }

    /**
     * Handles _removePrefix functionality
     */
    private _removePrefix(value: string): string {
        /**
         * Handles if functionality
         */
        if (!this.prefix) {
            return value;
        }
        return value ? value?.replace(this.prefix, '') : value;
    }

    /**
     * Handles _removeSuffix functionality
     */
    private _removeSuffix(value: string): string {
        /**
         * Handles if functionality
         */
        if (!this.suffix) {
            return value;
        }
        return value ? value?.replace(this.suffix, '') : value;
    }

    /**
     * Handles _regExpForRemove functionality
     */
    private _regExpForRemove(specialCharactersForRemove: string[]): RegExp {
        // Sanitize input to prevent ReDoS attacks
        const sanitizedChars = specialCharactersForRemove
            .filter(item => typeof item === 'string' && item.length <= 10) // Limit length
            .map((item: string) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special chars
            .slice(0, 50); // Limit array size

        /**
         * Handles if functionality
         */
        if (sanitizedChars.length === 0) {
            return /(?!)/; // Return regex that matches nothing
        }

        return new RegExp(sanitizedChars.join('|'), 'gi');
    }

    /**
     * Handles _checkSymbols functionality
     */
    private _checkSymbols(result: string): string | number | undefined | null {
        // TODO should simplify this code
        let separatorValue: number | null = this.testFn(Separators.SEPARATOR, this.maskExpression);
        /**
         * Handles if functionality
         */
        if (separatorValue && this.isNumberValue) {
            return result === ''
                ? result
                : result === ','
                    ? null
                    : this._checkPrecision(
                        this.maskExpression,
                        this._removeMask(
                            this._removeSuffix(this._removePrefix(result)),
                            this.maskSpecialCharacters
                        )?.replace(',', '.')
                    );
        }
        separatorValue = this.testFn(Separators.DOT_SEPARATOR, this.maskExpression);
        /**
         * Handles if functionality
         */
        if (separatorValue && this.isNumberValue) {
            return result === ''
                ? result
                : result === ','
                    ? null
                    : this._checkPrecision(
                        this.maskExpression,
                        this._removeMask(
                            this._removeSuffix(this._removePrefix(result)),
                            this.maskSpecialCharacters
                        )?.replace(',', '.')
                    );
        }
        separatorValue = this.testFn(Separators.COMMA_SEPARATOR, this.maskExpression);
        /**
         * Handles if functionality
         */
        if (separatorValue && this.isNumberValue) {
            return result === ''
                ? result
                : result === '.'
                    ? null
                    : this._checkPrecision(
                        this.maskExpression,
                        this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters)
                    );
        }
        /**
         * Handles if functionality
         */
        if (this.isNumberValue) {
            /**
             * Handles if functionality
             */
            if (this.maskExpression === Separators.IND_COMMA_SEPARATED || this.maskExpression === Separators.INT_APOSTROPHE_SEPARATED ||
                this.maskExpression === Separators.INT_SPACE_SEPARATED || this.maskExpression === Separators.INT_COMMA_SEPARATED) {
                return result === ''
                    ? result
                    : Number(this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters?.filter(f => f !== '.')));
            } else {
                return result === ''
                    ? result
                    : Number(this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters));
            }
        } else if (
            this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters)?.indexOf(
                ','
            ) !== -1
        ) {
            return this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters)?.replace(
                ',',
                '.'
            );
        } else {
            /**
             * Handles if functionality
             */
            if (this.maskExpression === Separators.IND_COMMA_SEPARATED || this.maskExpression === Separators.INT_APOSTROPHE_SEPARATED ||
                this.maskExpression === Separators.INT_SPACE_SEPARATED || this.maskExpression === Separators.INT_COMMA_SEPARATED) {
                return result === ''
                    ? result
                    : this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters?.filter(f => f !== '.'));
            }
            return this._removeMask(this._removeSuffix(this._removePrefix(result)), this.maskSpecialCharacters);
        }
    }

    // TODO should think about helpers
    /**
     * Handles testFn functionality
     */
    private testFn(baseSeparator: string, maskExpretion: string): number | null {
        const matcher: RegExpMatchArray | null = maskExpretion.match(new RegExp(`^${baseSeparator}\\.([^d]*)`));
        return matcher ? Number(matcher[1]) : null;
    }

    /**
     * Handles _checkPrecision functionality
     */
    private _checkPrecision(separatorExpression: string, separatorValue: string): number | string {
        /**
         * Handles if functionality
         */
        if (separatorExpression?.indexOf('2') > 0) {
            return Number(separatorValue).toFixed(this.giddhDecimalPlaces || 2);
        }
        return Number(separatorValue);
    }
}
