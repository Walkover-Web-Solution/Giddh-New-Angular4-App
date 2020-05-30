import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from './../../../../services/general.service';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { REMOVE_TRAILING_ZERO_REGEX } from 'apps/web-giddh/src/app/app.constant';

@Pipe({ name: 'giddhCurrency', pure: true })

export class GiddhCurrencyPipe implements OnInit, OnDestroy, PipeTransform {

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public _currencyNumberType: string;
    public currencyDecimalType: number;

    constructor(private _currencyType: GeneralService, private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
        private _generalService: GeneralService) {
        if (!this._generalService.isCurrencyPipeLoaded) {
            this._generalService.isCurrencyPipeLoaded = true;
            this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$), distinctUntilKeyChanged('balanceDisplayFormat')).subscribe((o) => {
                if (o && o.name) {
                    this._currencyNumberType = o.balanceDisplayFormat ? o.balanceDisplayFormat : 'IND_COMMA_SEPARATED';
                    this.currencyDecimalType = o.balanceDecimalPlaces ? o.balanceDecimalPlaces : 0;
                    if (this.currencyDecimalType) {
                        localStorage.setItem('currencyDesimalType', this.currencyDecimalType.toString());
                    }
                    if (this._currencyNumberType) {
                        localStorage.setItem('currencyNumberType', this._currencyNumberType);
                    }
                } else {
                    this.getInitialProfileData();
                }
            });
        }
    }

    public ngOnInit() {
        this.getInitialProfileData();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getInitialProfileData() {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
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
        let result = input.toString().split('.');
        // let finaloutput;
        // let currencyType = this._currencyNumberType;
        // let digitAfterDecimal: number = this.currencyDecimalType;
        // let lastThree;
        let finaloutput;
        let currencyType = this._currencyNumberType ? this._currencyNumberType : localStorage.getItem('currencyNumberType');
        let digitAfterDecimallocal: number = parseInt(localStorage.getItem('currencyDesimalType'));
        digitAfterDecimallocal = digitAfterDecimallocal ? digitAfterDecimallocal : 0;
        let digitAfterDecimal: number = customDecimalPlaces ? Number(customDecimalPlaces) : this.currencyDecimalType ? this.currencyDecimalType : digitAfterDecimallocal;
        let lastThree;
        let afterdecDigit = null;
        // currencyType=(currencyType==null)?((this._currencyType.currencyType!=null)? this._currencyType.currencyType : '10,000,000'):'10,000,000';

        if (result[0].length <= 3) {
            if (!result[0].toString().includes('-')) {
                let op = result[0].toString();
                if (result.length > 1) {
                    if (digitAfterDecimal !== 0) {
                        result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                        op += '.' + result[1].substring(0, digitAfterDecimal);
                    }
                } else {
                    if (digitAfterDecimal === 2) {
                        op += '.' + '00';
                    }
                    if (digitAfterDecimal === 4) {
                        op += '.' + '0000';
                    }
                }

                return shouldRemoveTrailingZeros ? op.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : op;;
            } else {
                let op = '-' + result[0].substring(1);
                if (result.length > 1) {
                    if (digitAfterDecimal !== 0) {
                        result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                        op += '.' + result[1].substring(0, digitAfterDecimal);
                    }
                } else {
                    if (digitAfterDecimal === 2) {
                        op += '.' + '00';
                    }
                    if (digitAfterDecimal === 4) {
                        op += '.' + '0000';
                    }
                }

                return shouldRemoveTrailingZeros ? op.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : op;;
            }
        } else {
            lastThree = result[0].substring(result[0].length - 3);
            if (result.length > 1) {
                if (digitAfterDecimal !== 0) {
                    result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                    afterdecDigit = result[1].substring(0, digitAfterDecimal);
                }
            } else {
                if (digitAfterDecimal === 2) {
                    afterdecDigit = '00';
                }
                if (digitAfterDecimal === 4) {
                    afterdecDigit = '0000';
                }
            }
        }
        let otherNumbers = result[0].substring(0, result[0].length - 3);

        switch (currencyType) {
            case 'IND_COMMA_SEPARATED':
                if (otherNumbers) {
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = ',' + lastThree;
                    }
                    let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
                    // if (result.length > 1) {
                    //   if (digitAfterDecimal !== 0) {
                    //     output += '.' + result[1].substring(0, digitAfterDecimal);
                    //   }
                    // } else {
                    //   if (digitAfterDecimal === 2) {
                    //     output += '.' + '00';
                    //   }
                    //   if (digitAfterDecimal === 4) {
                    //     output += '.' + '0000';
                    //   }
                    // }
                    if (afterdecDigit) {
                        output += '.' + afterdecDigit;
                    }
                    finaloutput = output;
                }
                break;
            case 'INT_COMMA_SEPARATED': {

                if (otherNumbers !== '' && otherNumbers !== '-') {
                    lastThree = ',' + lastThree;
                }
                let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;

                // if (result.length > 1) {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + result[1].substring(0, digitAfterDecimal);
                //   }
                // } else {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + '00';
                //   }
                // }
                if (afterdecDigit) {
                    output += '.' + afterdecDigit;
                }
                finaloutput = output;

            }
                break;

            case 'INT_SPACE_SEPARATED': {

                if (otherNumbers !== '' && otherNumbers !== '-') {
                    lastThree = ' ' + lastThree;
                }
                let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + lastThree;

                // if (result.length > 1) {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + result[1].substring(0, digitAfterDecimal);
                //   }
                // } else {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + '00';
                //   }
                // }
                if (afterdecDigit) {
                    output += '.' + afterdecDigit;
                }
                finaloutput = output;

            }
                break;
            case 'INT_APOSTROPHE_SEPARATED': {

                if (otherNumbers !== '' && otherNumbers !== '-') {
                    lastThree = '\'' + lastThree;
                }
                let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, "\'") + lastThree;

                // if (result.length > 1) {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + result[1].substring(0, digitAfterDecimal);
                //   }
                // } else {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + '00';
                //   }
                // }
                if (afterdecDigit) {
                    output += '.' + afterdecDigit;
                }
                finaloutput = output;

            }
                break;

            default: {
                // var lastThree = result[0].substring(result[0].length - 3);
                // var otherNumbers = result[0].substring(0, result[0].length - 3);
                if (otherNumbers !== '' && otherNumbers !== '-') {
                    lastThree = ',' + lastThree;
                }
                let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;

                // if (result.length > 1) {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + result[1].substring(0, digitAfterDecimal);
                //   }
                // } else {
                //   if (digitAfterDecimal !== 0) {
                //     output += '.' + '00';
                //   }
                // }
                if (afterdecDigit) {
                    output += '.' + afterdecDigit;
                }
                finaloutput = output;

            }
                break;
        }
        return shouldRemoveTrailingZeros ? finaloutput.replace(REMOVE_TRAILING_ZERO_REGEX, '$1$2$3') : finaloutput;

    }

}
