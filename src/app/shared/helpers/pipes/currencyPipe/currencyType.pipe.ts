import { SettingsProfileActions } from 'app/actions/settings/profile/settings.profile.action';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from './../../../../services/general.service';
import { Pipe, PipeTransform } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
@Pipe({name: 'giddhCurrency'})

export class GiddhCurrencyPipe implements  OnInit, OnDestroy , PipeTransform {

    public settingsProfileActions: SettingsProfileActions;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public _currencyNumberType: string;
    public _currencyDesimalType: number;

constructor(private _currencyType: GeneralService,  private store: Store<AppState>) {

this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe( (o) => {

    if ( o ) {
        this._currencyNumberType = o.balanceDisplayFormat ? o.balanceDisplayFormat : 'IND_COMMA_SEPARATED';
        this._currencyDesimalType = o.balanceDecimalPlaces ? o.balanceDecimalPlaces : 0 ;
    } else {
        this.getInitialProfileData();
    }
});
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
public transform(input: number) {
if (input == null) {
return ;
}
let result = input.toString().split('.');
let finaloutput ;
let currencyType = this._currencyNumberType;
let digitAfterDecimal: number = this._currencyDesimalType;
let lastThree;
// currencyType=(currencyType==null)?((this._currencyType.currencyType!=null)? this._currencyType.currencyType : '10,000,000'):'10,000,000';
if ( result[0].length <= 3 ) {
    if (!result[0].toString().includes('-')) {
    let op = result[0].toString();
    if (result.length > 1) {
        if (digitAfterDecimal !== 0) {
            op += '.' + result[1].substring(0, digitAfterDecimal);
        }
    } else {
        if (digitAfterDecimal !== 0) {
            op += '.' + '00';
        }
    }

    return op;
} else {
    let op = '-' + result[0].substring(1);
    if (result.length > 1) {
        if (digitAfterDecimal !== 0) {
            op += '.' + result[1].substring(0, digitAfterDecimal);
        }
    } else {
        if (digitAfterDecimal !== 0) {
            op += '.' + '00';
        }
    }

    return op;
}
} else {
 lastThree = result[0].substring(result[0].length - 3);
}
let otherNumbers = result[0].substring(0, result[0].length - 3);

switch (currencyType) {
case 'IND_COMMA_SEPARATED':
if ( otherNumbers) {
if ( otherNumbers !== '' && otherNumbers !== '-') {
    lastThree = ',' + lastThree;
}
let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
if (result.length > 1) {
    if (digitAfterDecimal !== 0) {
        output += '.' + result[1].substring(0, digitAfterDecimal);
    }
} else {
    if (digitAfterDecimal !== 0) {
        output += '.' + '00';
    }
}
finaloutput = output ;
}
break;
case 'INT_COMMA_SEPARATED':
{

if (otherNumbers != ''&& otherNumbers!='-')
lastThree = ',' + lastThree;
let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;

if (result.length > 1) {
    if (digitAfterDecimal !== 0) {
        output += '.' + result[1].substring(0, digitAfterDecimal);
    }
    } else {
        if (digitAfterDecimal !== 0) {
            output += '.' + '00';
        }
    }
finaloutput = output ;

}
break;

case 'INT_SPACE_SEPARATED': {


if (otherNumbers != ''&& otherNumbers!='-')
lastThree = ' ' + lastThree;
let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + lastThree;

if (result.length > 1) {
    if (digitAfterDecimal !== 0) {
        output += '.' + result[1].substring(0, digitAfterDecimal);
    }
} else {
        if (digitAfterDecimal !== 0) {
            output += '.' + '00';
        }
    }
finaloutput = output ;

}break;
case 'INT_APOSTROPHE_SEPARATED': {


if (otherNumbers != ''&& otherNumbers!='-')
lastThree = '\'' + lastThree;
let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, "\'") + lastThree;

if (result.length > 1) {
    if (digitAfterDecimal !== 0) {
        output += '.' + result[1].substring(0, digitAfterDecimal);
    }
    } else {
        if (digitAfterDecimal !== 0) {
            output += '.' + '00';
        }
    }
finaloutput = output ;

}
break;

default: {
// var lastThree = result[0].substring(result[0].length - 3);
// var otherNumbers = result[0].substring(0, result[0].length - 3);
if (otherNumbers != '' && otherNumbers != '-')
lastThree = ',' + lastThree;
let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;

if (result.length > 1) {
    if (digitAfterDecimal !== 0) {
        output += '.' + result[1].substring(0, digitAfterDecimal);
    }
    } else {
        if (digitAfterDecimal !== 0) {
            output += '.' + '00';
        }
    }
finaloutput = output ;

}
break;
}
return finaloutput;

}

}
