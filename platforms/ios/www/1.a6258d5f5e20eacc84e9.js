(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts":
/*!**************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts ***!
  \**************************************************************************/
/*! exports provided: CurrencyModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CurrencyModule", function() { return CurrencyModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _currencyType_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./currencyType.pipe */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.pipe.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");




var CurrencyModule = /** @class */ (function () {
    function CurrencyModule() {
    }
    CurrencyModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [],
            exports: [_currencyType_pipe__WEBPACK_IMPORTED_MODULE_1__["GiddhCurrencyPipe"]],
            declarations: [_currencyType_pipe__WEBPACK_IMPORTED_MODULE_1__["GiddhCurrencyPipe"]],
            providers: [_services_general_service__WEBPACK_IMPORTED_MODULE_2__["GeneralService"]]
        })
    ], CurrencyModule);
    return CurrencyModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.pipe.ts":
/*!************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/currencyPipe/currencyType.pipe.ts ***!
  \************************************************************************/
/*! exports provided: GiddhCurrencyPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GiddhCurrencyPipe", function() { return GiddhCurrencyPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var apps_web_giddh_src_app_actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");







var GiddhCurrencyPipe = /** @class */ (function () {
    function GiddhCurrencyPipe(_currencyType, store, settingsProfileActions, _generalService) {
        var _this = this;
        this._currencyType = _currencyType;
        this.store = store;
        this.settingsProfileActions = settingsProfileActions;
        this._generalService = _generalService;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        if (!this._generalService.isCurrencyPipeLoaded) {
            this._generalService.isCurrencyPipeLoaded = true;
            this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["distinctUntilKeyChanged"])('balanceDisplayFormat')).subscribe(function (o) {
                if (o && o.name) {
                    _this._currencyNumberType = o.balanceDisplayFormat ? o.balanceDisplayFormat : 'IND_COMMA_SEPARATED';
                    _this._currencyDesimalType = o.balanceDecimalPlaces ? o.balanceDecimalPlaces : 0;
                    if (_this._currencyDesimalType) {
                        localStorage.setItem('currencyDesimalType', _this._currencyDesimalType.toString());
                    }
                    if (_this._currencyNumberType) {
                        localStorage.setItem('currencyNumberType', _this._currencyNumberType);
                    }
                }
                else {
                    _this.getInitialProfileData();
                }
            });
        }
    }
    GiddhCurrencyPipe.prototype.ngOnInit = function () {
        this.getInitialProfileData();
    };
    GiddhCurrencyPipe.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    GiddhCurrencyPipe.prototype.getInitialProfileData = function () {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    };
    GiddhCurrencyPipe.prototype.transform = function (input) {
        if (input == null) {
            return;
        }
        var result = input.toString().split('.');
        // let finaloutput;
        // let currencyType = this._currencyNumberType;
        // let digitAfterDecimal: number = this._currencyDesimalType;
        // let lastThree;
        var finaloutput;
        var currencyType = this._currencyNumberType ? this._currencyNumberType : localStorage.getItem('currencyNumberType');
        var digitAfterDecimallocal = parseInt(localStorage.getItem('currencyDesimalType'));
        digitAfterDecimallocal = digitAfterDecimallocal ? digitAfterDecimallocal : 0;
        var digitAfterDecimal = this._currencyDesimalType ? this._currencyDesimalType : digitAfterDecimallocal;
        var lastThree;
        var afterdecDigit = null;
        // currencyType=(currencyType==null)?((this._currencyType.currencyType!=null)? this._currencyType.currencyType : '10,000,000'):'10,000,000';
        if (result[0].length <= 3) {
            if (!result[0].toString().includes('-')) {
                var op = result[0].toString();
                if (result.length > 1) {
                    if (digitAfterDecimal !== 0) {
                        result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                        op += '.' + result[1].substring(0, digitAfterDecimal);
                    }
                }
                else {
                    if (digitAfterDecimal === 2) {
                        op += '.' + '00';
                    }
                    if (digitAfterDecimal === 4) {
                        op += '.' + '0000';
                    }
                }
                return op;
            }
            else {
                var op = '-' + result[0].substring(1);
                if (result.length > 1) {
                    if (digitAfterDecimal !== 0) {
                        result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                        op += '.' + result[1].substring(0, digitAfterDecimal);
                    }
                }
                else {
                    if (digitAfterDecimal === 2) {
                        op += '.' + '00';
                    }
                    if (digitAfterDecimal === 4) {
                        op += '.' + '0000';
                    }
                }
                return op;
            }
        }
        else {
            lastThree = result[0].substring(result[0].length - 3);
            if (result.length > 1) {
                if (digitAfterDecimal !== 0) {
                    result[1] = (result[1].length < 4) ? result[1] + '0000' : result[1];
                    afterdecDigit = result[1].substring(0, digitAfterDecimal);
                }
            }
            else {
                if (digitAfterDecimal === 2) {
                    afterdecDigit = '00';
                }
                if (digitAfterDecimal === 4) {
                    afterdecDigit = '0000';
                }
            }
        }
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        switch (currencyType) {
            case 'IND_COMMA_SEPARATED':
                if (otherNumbers) {
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = ',' + lastThree;
                    }
                    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
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
            case 'INT_COMMA_SEPARATED':
                {
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = ',' + lastThree;
                    }
                    var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
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
            case 'INT_SPACE_SEPARATED':
                {
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = ' ' + lastThree;
                    }
                    var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + lastThree;
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
            case 'INT_APOSTROPHE_SEPARATED':
                {
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = '\'' + lastThree;
                    }
                    var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, "\'") + lastThree;
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
            default:
                {
                    // var lastThree = result[0].substring(result[0].length - 3);
                    // var otherNumbers = result[0].substring(0, result[0].length - 3);
                    if (otherNumbers !== '' && otherNumbers !== '-') {
                        lastThree = ',' + lastThree;
                    }
                    var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
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
        return finaloutput;
    };
    GiddhCurrencyPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Pipe"])({ name: 'giddhCurrency', pure: true }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_general_service__WEBPACK_IMPORTED_MODULE_5__["GeneralService"], _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], apps_web_giddh_src_app_actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_1__["SettingsProfileActions"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_5__["GeneralService"]])
    ], GiddhCurrencyPipe);
    return GiddhCurrencyPipe;
}());



/***/ })

}]);