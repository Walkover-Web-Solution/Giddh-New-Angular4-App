(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

/***/ "../../node_modules/ng2-order-pipe/dist/index.js":
/*!***************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ng2-order-pipe/dist/index.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * Created by vadimdez on 20/01/2017.
 */
__export(__webpack_require__(/*! ./src/ng2-order.module */ "../../node_modules/ng2-order-pipe/dist/src/ng2-order.module.js"));
__export(__webpack_require__(/*! ./src/ng2-order.pipe */ "../../node_modules/ng2-order-pipe/dist/src/ng2-order.pipe.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../node_modules/ng2-order-pipe/dist/src/ng2-order.module.js":
/*!******************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ng2-order-pipe/dist/src/ng2-order.module.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by vadimdez on 20/01/2017.
 */
var core_1 = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
var ng2_order_pipe_1 = __webpack_require__(/*! ./ng2-order.pipe */ "../../node_modules/ng2-order-pipe/dist/src/ng2-order.pipe.js");
var Ng2OrderModule = (function () {
    function Ng2OrderModule() {
    }
    return Ng2OrderModule;
}());
Ng2OrderModule = __decorate([
    core_1.NgModule({
        declarations: [ng2_order_pipe_1.Ng2OrderPipe],
        exports: [ng2_order_pipe_1.Ng2OrderPipe]
    })
], Ng2OrderModule);
exports.Ng2OrderModule = Ng2OrderModule;
//# sourceMappingURL=ng2-order.module.js.map

/***/ }),

/***/ "../../node_modules/ng2-order-pipe/dist/src/ng2-order.pipe.js":
/*!****************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ng2-order-pipe/dist/src/ng2-order.pipe.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
var Ng2OrderPipe = Ng2OrderPipe_1 = (function () {
    function Ng2OrderPipe() {
    }
    Ng2OrderPipe.prototype.transform = function (value, expression, reverse) {
        if (!value) {
            return value;
        }
        var isArray = value instanceof Array;
        if (isArray) {
            return this.sortArray(value, expression, reverse);
        }
        if (typeof value === 'object') {
            return this.transformObject(value, expression, reverse);
        }
        return value;
    };
    /**
     * Sort array
     *
     * @param value
     * @param expression
     * @param reverse
     * @returns {any[]}
     */
    Ng2OrderPipe.prototype.sortArray = function (value, expression, reverse) {
        var array = value.sort(function (a, b) {
            if (!expression) {
                return a > b ? 1 : -1;
            }
            return a[expression] > b[expression] ? 1 : -1;
        });
        if (reverse) {
            return array.reverse();
        }
        return array;
    };
    /**
     * Transform Object
     *
     * @param value
     * @param expression
     * @param reverse
     * @returns {any[]}
     */
    Ng2OrderPipe.prototype.transformObject = function (value, expression, reverse) {
        var parsedExpression = Ng2OrderPipe_1.parseExpression(expression);
        var lastPredicate = parsedExpression.pop();
        var oldValue = Ng2OrderPipe_1.getValue(value, parsedExpression);
        if (!(oldValue instanceof Array)) {
            parsedExpression.push(lastPredicate);
            lastPredicate = null;
            oldValue = Ng2OrderPipe_1.getValue(value, parsedExpression);
        }
        if (!oldValue) {
            return value;
        }
        var newValue = this.transform(oldValue, lastPredicate, reverse);
        Ng2OrderPipe_1.setValue(value, newValue, parsedExpression);
        return value;
    };
    /**
     * Parse expression, split into items
     * @param expression
     * @returns {string[]}
     */
    Ng2OrderPipe.parseExpression = function (expression) {
        expression = expression.replace(/\[(\w+)\]/g, '.$1');
        expression = expression.replace(/^\./, '');
        return expression.split('.');
    };
    /**
     * Get value by expression
     *
     * @param object
     * @param expression
     * @returns {any}
     */
    Ng2OrderPipe.getValue = function (object, expression) {
        for (var i = 0, n = expression.length; i < n; ++i) {
            var k = expression[i];
            if (!(k in object)) {
                return;
            }
            object = object[k];
        }
        return object;
    };
    /**
     * Set value by expression
     *
     * @param object
     * @param value
     * @param expression
     */
    Ng2OrderPipe.setValue = function (object, value, expression) {
        var i;
        for (i = 0; i < expression.length - 1; i++) {
            object = object[expression[i]];
        }
        object[expression[i]] = value;
    };
    return Ng2OrderPipe;
}());
Ng2OrderPipe = Ng2OrderPipe_1 = __decorate([
    core_1.Pipe({
        name: 'orderBy'
    })
], Ng2OrderPipe);
exports.Ng2OrderPipe = Ng2OrderPipe;
var Ng2OrderPipe_1;
//# sourceMappingURL=ng2-order.pipe.js.map

/***/ }),

/***/ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/contact/advanceSearch/contactAdvanceSearch.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n\n  <div class=\"modal-header themeBg pd2 pdL2 pdR2 clearfix\" style=\"background-color: #525252\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\">Advance Search </h3>\n    <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onCancel()\"></i>\n  </div>\n\n  <div class=\"modal-body pdL2 pdR2 clearfix\" id=\"export-body\">\n\n    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n\n      <!--region invoice-->\n      <div class=\"modal_wrap mrB2\">\n\n        <div class=\"row mt-2 mb-2\">\n\n          <div class=\"col-xs-12 col-sm-4\">\n            <label>Select Category</label>\n          </div>\n\n          <div class=\"col-xs-12 col-sm-8\">\n\n            <sh-select placeholder=\"Select\" name=\"entryCategory\" [options]=\"categoryOptions\" [ItemHeight]=\"33\"\n              [(ngModel)]=\"request.category\"></sh-select>\n          </div>\n        </div>\n\n        <div class=\"row mt-2 mb-2\">\n\n          <div class=\"col-xs-12 col-sm-4\">\n            <label>Amount</label>\n          </div>\n\n          <div class=\"col-xs-12 col-sm-8\">\n\n            <div class=\"\">\n\n              <div class=\"col-xs-8\" style=\"padding-left: 0\">\n                <sh-select placeholder=\"Select\" name=\"entryTotalBy\" [options]=\"filtersForEntryTotal\" [ItemHeight]=\"33\"\n                  [(ngModel)]=\"request.amountType\"></sh-select>\n              </div>\n\n              <div class=\"col-xs-4\" style=\"padding: 0\">\n                <input class=\"form-control\" placeholder=\"00\" name=\"total\" [(ngModel)]=\"request.amount\">\n\n              </div>\n\n            </div>\n\n          </div>\n        </div>\n\n      </div>\n      <!--endregion-->\n\n      <div class=\"pull-right\">\n        <button type=\"submit\" class=\"btn btn-md btn-success mrR1\" (click)=\"save()\">Search</button>\n        <button type=\"submit\" class=\"btn btn-md btn-danger\" (click)=\"onCancel()\">Cancel</button>\n      </div>\n\n    </form>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/contact/advanceSearch/contactAdvanceSearch.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/contact/advanceSearch/contactAdvanceSearch.component.ts ***!
  \*************************************************************************/
/*! exports provided: ContactAdvanceSearchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactAdvanceSearchComponent", function() { return ContactAdvanceSearchComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/api-models/Contact */ "./src/app/models/api-models/Contact.ts");




var COMPARISON_FILTER = [
    { label: 'Equals', value: 'Equals' },
    { label: 'Greater Than', value: 'GreaterThan' },
    { label: 'Less Than', value: 'LessThan' },
    { label: 'Exclude', value: 'Exclude' }
];
var CATEGORY_OPTIONS_FOR_CUSTOMER = [
    { label: 'Opening Balance', value: 'openingBalance' },
    { label: 'Sales', value: 'sales' },
    { label: 'Receipts', value: 'receipt' },
    { label: 'Closing Balance (Due amount)', value: 'closingBalance' }
];
var CATEGORY_OPTIONS_FOR_AGING_REPORT = [
    //{label: 'Future Due', value: 'futureDue'},
    { label: 'Total Due', value: 'totalDue' },
];
var ContactAdvanceSearchComponent = /** @class */ (function () {
    function ContactAdvanceSearchComponent() {
        this.applyAdvanceSearchEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.closeModelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.advanceSearch4 = 'customer';
        this.request = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_3__["ContactAdvanceSearchCommonModal"]();
        this.filtersForEntryTotal = COMPARISON_FILTER;
    }
    ContactAdvanceSearchComponent.prototype.ngOnInit = function () {
    };
    ContactAdvanceSearchComponent.prototype.ngOnChanges = function () {
        console.log(this.advanceSearch4);
        this.categoryOptions = this.advanceSearch4 === 'customer' ? CATEGORY_OPTIONS_FOR_CUSTOMER : CATEGORY_OPTIONS_FOR_AGING_REPORT;
    };
    ContactAdvanceSearchComponent.prototype.reset = function () {
        if (this.allSelects) {
            this.allSelects.forEach(function (sh) {
                sh.clear();
            });
        }
        this.request = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_3__["ContactAdvanceSearchCommonModal"]();
    };
    ContactAdvanceSearchComponent.prototype.save = function () {
        this.applyAdvanceSearchEvent.emit(this.request);
        this.closeModelEvent.emit();
    };
    ContactAdvanceSearchComponent.prototype.onCancel = function () {
        this.closeModelEvent.emit(true);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ContactAdvanceSearchComponent.prototype, "applyAdvanceSearchEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ContactAdvanceSearchComponent.prototype, "closeModelEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ContactAdvanceSearchComponent.prototype, "advanceSearch4", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_3__["ContactAdvanceSearchCommonModal"])
    ], ContactAdvanceSearchComponent.prototype, "request", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"])(_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_2__["ShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["QueryList"])
    ], ContactAdvanceSearchComponent.prototype, "allSelects", void 0);
    ContactAdvanceSearchComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-contact-advance-search-component',
            template: __webpack_require__(/*! ./contactAdvanceSearch.component.html */ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.html"),
            styles: [__webpack_require__(/*! ./contactAdvanceSearch.component.scss */ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ContactAdvanceSearchComponent);
    return ContactAdvanceSearchComponent;
}());



/***/ }),

/***/ "./src/app/contact/aging-dropdown/aging.dropdown.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/contact/aging-dropdown/aging.dropdown.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"top-aging-table-top1\" (clickOutside)=\"closeAging($event)\" [clickOutsideEnabled]=\"true\"\n  [delayClickOutsideInit]=\"true\">\n  <div class=\"row\">\n    <div class=\"col-md-3 col-sm-3 col-xs-6\">\n      <p>First interval</p>\n      <div class=\"top-aging-table-box\">\n        <span>0 -</span>\n        <input class=\"input-design\" name=\"opt_4th\" type=\"number\" digitsOnlyDirective (blur)=\"saveAgingDropdown()\"\n          [(ngModel)]=\"options.fourth\" (click)=\"$event.stopPropagation()\" />\n        <!-- <input type=\"number\" value=\"30\"> -->\n      </div>\n    </div>\n    <div class=\"col-md-3 col-sm-3 col-xs-6\">\n      <p>Second interval</p>\n      <div class=\"top-aging-table-box\">\n        <span>{{options.fourth+1}} -</span>\n        <input class=\"input-design\" name=\"opt_4th\" type=\"number\" digitsOnlyDirective [(ngModel)]=\"options.fifth\"\n          (blur)=\"saveAgingDropdown()\" (click)=\"$event.stopPropagation()\" />\n        <!-- <input type=\"number\" value=\"30\"> -->\n      </div>\n    </div>\n    <div class=\"col-md-3 col-sm-3 col-xs-6\">\n      <p>Third interval</p>\n      <div class=\"top-aging-table-box\">\n        <span>{{options.fifth+1}} -</span>\n        <input class=\"input-design\" name=\"opt_4th\" digitsOnlyDirective type=\"number\" [(ngModel)]=\"options.sixth\"\n          (blur)=\"saveAgingDropdown()\" (click)=\"$event.stopPropagation()\" />\n        <!-- <input type=\"number\" value=\"30\"> -->\n      </div>\n    </div>\n    <div class=\"col-md-3 col-sm-3 col-xs-6\">\n      <p>Last interval</p>\n      <div class=\"top-aging-table-box\">\n        <span>+{{options.sixth+1}}</span>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/contact/aging-dropdown/aging.dropdown.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/contact/aging-dropdown/aging.dropdown.component.ts ***!
  \********************************************************************/
/*! exports provided: AgingDropdownComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AgingDropdownComponent", function() { return AgingDropdownComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_aging_report_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions/aging-report.actions */ "./src/app/actions/aging-report.actions.ts");







var AgingDropdownComponent = /** @class */ (function () {
    function AgingDropdownComponent(store, _toasty, _toaster, _agingReportActions) {
        this.store = store;
        this._toasty = _toasty;
        this._toaster = _toaster;
        this._agingReportActions = _agingReportActions;
        this.showComponent = true;
        this.closeEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
        //
        this.setDueRangeRequestInFlight$ = this.store.select(function (s) { return s.agingreport.setDueRangeRequestInFlight; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AgingDropdownComponent.prototype.ngOnInit = function () {
        //
    };
    AgingDropdownComponent.prototype.ngOnDestroy = function () {
        // this.closeEvent.emit(this.options);
    };
    AgingDropdownComponent.prototype.closeAgingDropDown = function () {
        this.store.dispatch(this._agingReportActions.CloseDueRange());
    };
    AgingDropdownComponent.prototype.saveAgingDropdown = function () {
        var valid = true;
        if (this.options.fourth >= (this.options.fifth || this.options.sixth)) {
            this.showToaster();
            valid = false;
        }
        if ((this.options.fifth >= this.options.sixth) || (this.options.fifth <= this.options.fourth)) {
            this.showToaster();
            valid = false;
        }
        if (this.options.sixth <= (this.options.fourth || this.options.fifth)) {
            this.showToaster();
            valid = false;
        }
        if (valid) {
            this.store.dispatch(this._agingReportActions.CreateDueRange({ range: [this.options.fourth.toString(), this.options.fifth.toString(), this.options.sixth.toString()] }));
        }
        this.closeAgingDropDown();
    };
    AgingDropdownComponent.prototype.closeAging = function (e) {
        this.closeAgingDropDown();
    };
    AgingDropdownComponent.prototype.showToaster = function () {
        this._toasty.errorToast('4th column must be less than 5th and 5th must be less than 6th');
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AgingDropdownComponent.prototype, "showComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AgingDropdownComponent.prototype, "closeEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AgingDropdownComponent.prototype, "options", void 0);
    AgingDropdownComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aging-dropdown',
            template: __webpack_require__(/*! ./aging.dropdown.component.html */ "./src/app/contact/aging-dropdown/aging.dropdown.component.html"),
            styles: ["\n    .li-design {\n      display: flex;\n      padding: 5px;\n      border: none;\n    }\n\n    .lable-design {\n      width: 60%;\n    }\n\n    .input-design {\n      width: 40%;\n    }\n\n    .depth {\n      z-index: 0 !important;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"], _actions_aging_report_actions__WEBPACK_IMPORTED_MODULE_6__["AgingReportActions"]])
    ], AgingDropdownComponent);
    return AgingDropdownComponent;
}());



/***/ }),

/***/ "./src/app/contact/aging-report/aging-report.component.html":
/*!******************************************************************!*\
  !*** ./src/app/contact/aging-report/aging-report.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n\n  <div class=\"top_bar clearfix\">\n\n    <div class=\"form-inline\">\n\n      <div class=\"pull-left d-flex wrapsearchingAging\">\n\n        <div class=\"form-group max250\">\n          <input type=\"text\" placeholder=\"Name/amount\" class=\"form-control\" [(ngModel)]=\"searchStr\"\n            (ngModelChange)=\"searchStr$.next($event)\" style=\"width:210px\" />\n        </div>\n\n        <div class=\"mrL1 cp\">\n\n          <span style=\"line-height: 2.1;\">\n            <a href=\"javascript: void 0\" (click)=\"toggleAdvanceSearchPopup()\">\n              Advance Search\n              <i class=\"fa fa-caret-down\"></i>\n            </a>\n          </span>\n\n          <span style=\"line-height: 2.1\" class=\"ml-1\" *ngIf=\"isAdvanceSearchApplied\">\n            <a class=\"cp\" href=\"javascript: void 0\" (click)=\"resetAdvanceSearch()\">\n              <i aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\" style=\"color: #333333\"\n                tooltip=\"Reset Filter\"></i>\n            </a>\n          </span>\n\n        </div>\n\n      </div>\n\n      <div class=\"btn-group plus-btn pull-right\">\n\n        <button class=\"btn btn-blue\" style=\"margin-right: 5px\" (click)=\"creteNewCustomerEvent.emit(true)\">\n          + New Customer\n        </button>\n\n      </div>\n\n    </div>\n  </div>\n\n  <div class=\"contact-main agingPage \">\n    <div class=\" pdB2 mrB1 onMobileView mobilecardwrapper\">\n\n\n      <div *ngIf=\"!isMobileScreen\">\n        <perfect-scrollbar fxFlex=\"auto\" [scrollIndicators]=\"true\">\n          <ng-container *ngTemplateOutlet='mainTable'></ng-container>\n        </perfect-scrollbar>\n      </div>\n\n      <div *ngIf=\"isMobileScreen\">\n\n        <div class=\"text-center top-aging-table-top pd1\">\n          <p (click)=\"openAgingDropDown()\"><strong>Due in Last days </strong></p>\n          <aging-dropdown *ngIf=\"setDueRangeOpen$|async\" [options]=\"agingDropDownoptions\"\n            (closeEvent)=\"closeAgingDropDownop($event)\"></aging-dropdown>\n        </div>\n        <ng-container *ngTemplateOutlet='mainTable'></ng-container>\n      </div>\n\n\n\n\n    </div>\n  </div>\n</div>\n\n<div class=\"result-total\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">\n      <div class=\"custumerRightWrap\">\n        <div class=\"text-right xs-left pl-2 pr-2\">\n          <h4 class=\"mb-1 pr-1\">Result Total </h4>\n        </div>\n        <div class=\"bg-white customer-right clearfix\" style=\"width: 100%;\">\n          <table style=\"float: right; width: auto;\" class=\"text-right\">\n            <tr>\n              <td>\n                <p>Upcoming</p>\n                <h3>{{getFutureTotalDue()| giddhCurrency }}/-</h3>\n              </td>\n\n              <td>\n                <p>Due</p>\n                <h3>{{getTotalDue()| giddhCurrency}}/-</h3>\n              </td>\n            </tr>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--region advance_search Modal-->\n<div bsModal #advanceSearch=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [config]=\"modalConfig\" tabindex=\"-1\">\n\n  <div class=\"modal-dialog\">\n\n    <div class=\"modal-content\">\n      <app-contact-advance-search-component [request]=\"commonRequest\" [advanceSearch4]=\"'agingReport'\"\n        (applyAdvanceSearchEvent)=\"applyAdvanceSearch($event)\" (closeModelEvent)=\"toggleAdvanceSearchPopup()\">\n      </app-contact-advance-search-component>\n    </div>\n\n  </div>\n\n</div>\n<!-- endregion -->\n\n<!-- region sorting template -->\n<ng-template #sortingTemplate let-col>\n  <div class=\"icon-pointer cp\">\n    <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sort(col, 'asc')\" *ngIf=\"key !== col\"\n      [ngClass]=\"{'activeTextColor': key === col && order === 'asc'}\"></div>\n\n    <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sort(col, 'desc')\"\n      *ngIf=\"key === col && order === 'asc'\" [ngClass]=\"{'activeTextColor': key === col && order === 'asc'}\"></div>\n\n    <div class=\"fa fa-long-arrow-down text-light-2 d-block font-xxs\" *ngIf=\"key === col && order === 'desc'\"\n      (click)=\"sort(col, 'asc')\" [ngClass]=\"{'activeTextColor': key === col && order === 'desc'}\"></div>\n  </div>\n</ng-template>\n<!-- endregion -->\n\n<ng-template #mainTable>\n  <table class=\"table basic table-bordered aging-table table-aging-report\">\n    <thead>\n      <tr class=\"aging-table-top\">\n        <td></td>\n        <td></td>\n        <td></td>\n        <td colspan=\"4\" class=\"text-center top-aging-table-top\">\n          <p><strong>Due in Last days </strong>\n            <!-- <span class=\"italic underline\">-->\n            <!--   <input type=\"text\" name=\"daterangeInputs\" daterangepicker [options]=\"datePickerOptions\"-->\n            <!--      (hideDaterangepicker)=\"selectedDate($event)\" (applyDaterangepicker)=\"selectedDate($event)\"-->\n            <!--      class=\"form-control date-range-picker\"/>-->\n            <!-- </span>-->\n          </p>\n\n          <aging-dropdown *ngIf=\"setDueRangeOpen$|async\" [options]=\"agingDropDownoptions\"\n            (closeEvent)=\"closeAgingDropDownop($event)\"></aging-dropdown>\n\n\n        </td>\n        <td></td>\n      </tr>\n\n\n      <tr>\n\n        <th>Customer Name\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'name'}\"></ng-container>\n        </th>\n\n        <th>Parent Group\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'group'}\"></ng-container>\n        </th>\n\n        <th class=\"text-right pr-3\">Upcoming Due\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'futureDueAmount'}\">\n          </ng-container>\n        </th>\n\n        <th class=\"italic unbold underline pr-3 text-right\">\n          <span (click)=\"openAgingDropDown()\">0-{{(agingDropDownoptions$| async)?.fourth}} Days</span>\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'range0'}\"></ng-container>\n        </th>\n\n        <th class=\"italic text-right pr-3 unbold underline\">\n          <span (click)=\"openAgingDropDown()\">\n            {{(agingDropDownoptions$| async)?.fourth + 1}}-{{((agingDropDownoptions$| async)?.fifth)}} Days </span>\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'range1'}\"></ng-container>\n        </th>\n\n        <th class=\"italic text-right pr-3 unbold underline\">\n          <span (click)=\"openAgingDropDown()\">\n            {{((agingDropDownoptions$| async)?.fifth + 1)}}-{{((agingDropDownoptions$| async)?.sixth)}} Days </span>\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'range2'}\"></ng-container>\n        </th>\n\n        <th class=\"italic text-right pr-3 unbold underline\">\n          <span (click)=\"openAgingDropDown()\">{{(agingDropDownoptions$| async)?.sixth + 1 }}+ Days </span>\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'range3'}\"></ng-container>\n        </th>\n\n        <th class=\"text-right pr-3\">Total Due\n          <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'totalDueAmount'}\">\n          </ng-container>\n        </th>\n\n      </tr>\n\n    </thead>\n\n    <tbody>\n\n      <ng-container *ngFor=\"let entry of (dueAmountReportData$ | async)?.results\">\n\n        <tr *ngIf=\"(dueAmountReportData$ | async)?.results?.length\">\n          <td data-title=\"name\">{{ entry.name }}</td>\n          <td data-title=\"groupName\">{{ entry.groupName }}</td>\n          <td data-title=\"dueAmount\" class=\"text-right\">{{ entry.futureDueAmount |giddhCurrency}}</td>\n          <td attr.data-title=\"0 - {{ (agingDropDownoptions$| async)?.fourth }} Days\" class=\"text-right\">\n            {{ entry.currentAndPastDueAmount[0].dueAmount |giddhCurrency }}</td>\n          <td attr.data-title='{{(agingDropDownoptions$| async)?.fourth + 1}}\n          -{{((agingDropDownoptions$| async)?.fifth)}} Days' class=\"text-right\"> <span\n              (click)=\"openAgingDropDown()\">{{ entry.currentAndPastDueAmount[1].dueAmount |giddhCurrency}}</span>\n          </td>\n          <td attr.data-title=\"{{((agingDropDownoptions$| async)?.fifth + 1)}}\n          -{{((agingDropDownoptions$| async)?.sixth)}} Days\" class=\"text-right\">\n            {{ entry.currentAndPastDueAmount[2].dueAmount |giddhCurrency}}</td>\n          <td attr.data-title=\"{{(agingDropDownoptions$| async)?.sixth + 1 }}+ Days \" class=\"text-right\">\n            {{ entry.currentAndPastDueAmount[3].dueAmount |giddhCurrency}}</td>\n          <td data-title=\"totalDueAmount\" class=\"text-right\"> {{ entry.totalDueAmount |giddhCurrency}}</td>\n        </tr>\n\n      </ng-container>\n\n      <ng-container *ngIf=\"!(dueAmountReportData$ | async)?.results?.length\">\n        <tr>\n          <td colspan=\"8\" class=\"text-center empty_table\">\n            <h1>No Record Found !!</h1>\n          </td>\n        </tr>\n      </ng-container>\n\n    </tbody>\n\n\n  </table>\n\n  <div *ngIf=\"(dueAmountReportData$ | async)?.totalItems>=20\" class=\"paginationWrapper\">\n\n\n    <div class=\"xs-pl-0\">\n      <div class=\"alC\" style=\"text-align: center;\">\n        <div id=\"pagination\" element-view-container-ref #paginationChild=elementviewcontainerref></div>\n      </div>\n    </div>\n\n\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/contact/aging-report/aging-report.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/contact/aging-report/aging-report.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".dropdown-menu > li > a {\n  padding: 2px 10px; }\n\n.dis {\n  display: flex; }\n\n.pd1 {\n  padding: 5px; }\n\n.icon-pointer {\n  position: absolute;\n  right: 10px;\n  top: 31%; }\n\n.icon-pointer .glyphicon:hover {\n  color: #FF5F00 !important; }\n\n.icon-pointer .activeTextColor {\n  color: #FF5F00 !important; }\n\n.icon-pointer .d-block.font-xxs.glyphicon.glyphicon-triangle-top {\n  line-height: 0.5;\n  height: 8px; }\n\n.icon-pointer .font-xxs {\n  font-size: 12px; }\n\n.aging-table {\n  max-width: 1170px;\n  width: 100%; }\n\n.paginationWrapper {\n  max-width: 1171px;\n  width: 100%; }\n\n.customer-right table {\n  float: right;\n  width: auto; }\n\n@media (min-width: 769px) {\n  .onMobileView > .top-aging-table-top {\n    display: none; } }\n\n@media (max-width: 768px) {\n  .custumerRightWrap h4.mb-1.pdR2 {\n    margin-bottom: 0; }\n  .contact-main .table-aging-report {\n    margin-top: 0 !important; }\n  .customer-right table tr td {\n    padding: 0px 15px;\n    color: #707070; }\n  .result-total {\n    position: fixed;\n    bottom: 0;\n    background-color: #fff;\n    text-align: left;\n    float: none;\n    width: 100%;\n    z-index: 1;\n    padding-top: 10px; }\n  .custumerRightWrap {\n    padding-bottom: 10px;\n    padding: 0 15px 10px; } }\n\n@media (max-width: 575px) {\n  .custumerRightWrap h4.mb-1.pdR2 {\n    margin-bottom: 10px;\n    padding-left: 15px; }\n  .customer-right table {\n    float: none !important;\n    width: 100% !important;\n    text-align: left; }\n  .customer-right table tr td {\n    padding: 0 15px; }\n  .customer-right table tr td p {\n    font-size: 14px;\n    margin-bottom: 2px;\n    float: left;\n    width: 110px; }\n  .customer-right table tr td h3 {\n    font-size: 14px;\n    padding-bottom: 7px; }\n  .customer-right table tr td {\n    margin-bottom: 5px; }\n  .customer-right table tr td {\n    padding: 0px 5px;\n    color: #707070;\n    width: 100%;\n    display: block; }\n  .customer-right {\n    background: #fff;\n    padding: 0;\n    float: none; }\n  .custumerRightWrap .text-right {\n    text-align: left !important;\n    padding-left: 5px !important; }\n  .customer-right table tr td p {\n    font-size: 14px;\n    margin-bottom: 2px;\n    float: left;\n    width: 110px; }\n  .customer-right table tr td h3 {\n    font-size: 14px; }\n  .top-aging-table-top {\n    padding: 3px !important;\n    font-size: 14px; } }\n\n@media (max-width: 540px) {\n  .wrapsearchingAging .max250 {\n    max-width: 200px !important; }\n  .wrapsearchingAging .max250 input {\n    width: 100% !important; }\n  .wrapsearchingAging {\n    float: none !important;\n    justify-content: space-between; }\n  .btn-group.plus-btn {\n    float: none;\n    width: 100%; }\n  .btn-group.plus-btn button {\n    float: none;\n    width: 100%; } }\n\n@media (max-width: 320px) {\n  .wrapsearchingAging .max250 {\n    max-width: 150px !important; } }\n\n.table-aging-report {\n  min-height: 300px;\n  margin-top: 0 !important; }\n"

/***/ }),

/***/ "./src/app/contact/aging-report/aging-report.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/contact/aging-report/aging-report.component.ts ***!
  \****************************************************************/
/*! exports provided: AgingReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AgingReportComponent", function() { return AgingReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/Contact */ "./src/app/models/api-models/Contact.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_aging_report_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions/aging-report.actions */ "./src/app/actions/aging-report.actions.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _services_contact_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/contact.service */ "./src/app/services/contact.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! apps/web-giddh/src/app/models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/cdk/layout */ "../../node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_15__);
















var AgingReportComponent = /** @class */ (function () {
    function AgingReportComponent(store, _toasty, router, _agingReportActions, _contactService, _breakpointObserver, componentFactoryResolver) {
        var _this = this;
        this.store = store;
        this._toasty = _toasty;
        this.router = router;
        this._agingReportActions = _agingReportActions;
        this._contactService = _contactService;
        this._breakpointObserver = _breakpointObserver;
        this.componentFactoryResolver = componentFactoryResolver;
        this.totalDueSelectedOption = '0';
        this.totalDueAmount = 0;
        this.includeName = false;
        this.names = [];
        this.sundryDebtorsAccountsForAgingReport = [];
        this.totalDueAmounts = [];
        this.totalFutureDueAmounts = [];
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_15__;
        this.key = 'name';
        this.order = 'asc';
        this.filter = '';
        this.config = { suppressScrollX: false, suppressScrollY: false };
        this.searchStr$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__["Subject"]();
        this.searchStr = '';
        this.isMobileScreen = false;
        this.modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: 'static',
            ignoreBackdropClick: true
        };
        this.isAdvanceSearchApplied = false;
        this.agingAdvanceSearchModal = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__["AgingAdvanceSearchModal"]();
        this.commonRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__["ContactAdvanceSearchCommonModal"]();
        this.creteNewCustomerEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__["ReplaySubject"](1);
        this.agingDropDownoptions$ = this.store.select(function (s) { return s.agingreport.agingDropDownoptions; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$));
        this.dueAmountReportRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__["DueAmountReportQueryRequest"]();
        this.setDueRangeOpen$ = this.store.select(function (s) { return s.agingreport.setDueRangeOpen; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$));
        this.getDueAmountreportData();
        this.store.select(function (p) { return p.company.dateRangePickerConfig; }).pipe().subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = a;
            }
        });
        this.createAccountIsSuccess$ = this.store.select(function (s) { return s.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$));
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$));
    }
    AgingReportComponent.prototype.getDueAmountreportData = function () {
        var _this = this;
        this.store.select(function (s) { return s.agingreport.data; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data && data.results) {
                _this.dueAmountReportRequest.page = data.page;
                setTimeout(function () { return _this.loadPaginationComponent(data); }); // Pagination issue fix
                _this.totalDueAmounts = [];
                _this.totalFutureDueAmounts = [];
                for (var _i = 0, _a = data.results; _i < _a.length; _i++) {
                    var dueAmount = _a[_i];
                    _this.totalDueAmounts.push(dueAmount.totalDueAmount);
                    _this.totalFutureDueAmounts.push(dueAmount.futureDueAmount);
                }
            }
            _this.dueAmountReportData$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_9__["of"])(data);
            if (data) {
                lodash__WEBPACK_IMPORTED_MODULE_7__["map"](data.results, function (obj) {
                    obj.depositAmount = obj.currentAndPastDueAmount[0].dueAmount;
                    obj.dueAmount1 = obj.currentAndPastDueAmount[1].dueAmount;
                    obj.dueAmount2 = obj.currentAndPastDueAmount[2].dueAmount;
                    obj.dueAmount3 = obj.currentAndPastDueAmount[3].dueAmount;
                });
            }
        });
    };
    AgingReportComponent.prototype.go = function () {
        this.store.dispatch(this._agingReportActions.GetDueReport(this.agingAdvanceSearchModal, this.dueAmountReportRequest));
    };
    AgingReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions.startDate = a[0];
                _this.datePickerOptions.endDate = a[1];
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_15__(a[0]).format('DD-MM-YYYY');
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_15__(a[1]).format('DD-MM-YYYY');
            }
        });
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_13__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'aging-report';
        this.go();
        // this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.store.dispatch(this._agingReportActions.GetDueRange());
        this.agingDropDownoptions$.subscribe(function (p) {
            _this.agingDropDownoptions = lodash__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](p);
        });
        this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
        this.searchStr$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["debounceTime"])(1000), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["distinctUntilChanged"])()).subscribe(function (term) {
            _this.dueAmountReportRequest.q = term;
            _this.go();
        });
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["takeUntil"])(this.destroyed$)).subscribe(function (yes) {
            if (yes) {
                _this.getSundrydebtorsAccounts(_this.fromDate, _this.toDate);
            }
        });
        this._breakpointObserver
            .observe(['(max-width: 768px)'])
            .subscribe(function (state) {
            _this.isMobileScreen = state.matches;
            _this.getDueAmountreportData();
        });
    };
    AgingReportComponent.prototype.openAgingDropDown = function () {
        this.store.dispatch(this._agingReportActions.OpenDueRange());
    };
    AgingReportComponent.prototype.closeAgingDropDownop = function (options) {
        //
    };
    AgingReportComponent.prototype.hideListItems = function () {
        this.filterDropDownList.hide();
    };
    AgingReportComponent.prototype.pageChangedDueReport = function (event) {
        this.dueAmountReportRequest.page = event.page;
        this.go();
    };
    AgingReportComponent.prototype.loadPaginationComponent = function (s) {
        var _this = this;
        var transactionData = null;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["PaginationComponent"]);
        if (this.paginationChild && this.paginationChild.viewContainerRef) {
            var viewContainerRef = this.paginationChild.viewContainerRef;
            viewContainerRef.remove();
            var componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
            viewContainerRef.insert(componentInstanceView.hostView);
            var componentInstance = componentInstanceView.instance;
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = s.count;
            componentInstance.maxSize = 5;
            componentInstance.writeValue(s.page);
            componentInstance.boundaryLinks = true;
            componentInstance.pageChanged.subscribe(function (e) {
                _this.pageChangedDueReport(e);
            });
        }
    };
    AgingReportComponent.prototype.getFutureTotalDue = function () {
        return this.totalFutureDueAmounts.reduce(function (a, b) { return a + b; }, 0);
    };
    AgingReportComponent.prototype.getTotalDue = function () {
        return this.totalDueAmounts.reduce(function (a, b) { return a + b; }, 0);
    };
    AgingReportComponent.prototype.selectedDate = function (value) {
        this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_15__(value.picker.startDate).format('DD-MM-YYYY');
        this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_15__(value.picker.endDate).format('DD-MM-YYYY');
        if (value.event.type === 'hide') {
            this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
        }
    };
    AgingReportComponent.prototype.resetAdvanceSearch = function () {
        this.agingAdvanceSearchModal = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__["AgingAdvanceSearchModal"]();
        this.commonRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_2__["ContactAdvanceSearchCommonModal"]();
        this.isAdvanceSearchApplied = false;
        this.go();
    };
    AgingReportComponent.prototype.applyAdvanceSearch = function (request) {
        this.commonRequest = request;
        this.agingAdvanceSearchModal.totalDueAmount = request.amount;
        if (request.category === 'totalDue') {
            //this.agingAdvanceSearchModal.includeTotalDueAmount = true;
            switch (request.amountType) {
                case 'GreaterThan':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = true;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
                case 'LessThan':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = true;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
                case 'Exclude':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = false;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = true;
                    break;
                case 'Equals':
                    this.agingAdvanceSearchModal.totalDueAmountGreaterThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountLessThan = false;
                    this.agingAdvanceSearchModal.totalDueAmountEqualTo = true;
                    this.agingAdvanceSearchModal.totalDueAmountNotEqualTo = false;
                    break;
            }
        }
        else {
            // Code here for Future Due category
            this.agingAdvanceSearchModal.includeTotalDueAmount = false;
        }
        this.isAdvanceSearchApplied = true;
        this.go();
    };
    AgingReportComponent.prototype.sort = function (key, ord) {
        if (ord === void 0) { ord = 'asc'; }
        if (key.includes('range')) {
            this.dueAmountReportRequest.rangeCol = parseInt(key.replace('range', ''));
            this.dueAmountReportRequest.sortBy = 'range';
        }
        else {
            this.dueAmountReportRequest.rangeCol = null;
            this.dueAmountReportRequest.sortBy = key;
        }
        this.key = key;
        this.order = ord;
        this.dueAmountReportRequest.sort = ord;
        this.go();
    };
    AgingReportComponent.prototype.toggleAdvanceSearchPopup = function () {
        this.advanceSearch.toggle();
    };
    AgingReportComponent.prototype.getSundrydebtorsAccounts = function (fromDate, toDate, count) {
        var _this = this;
        if (count === void 0) { count = 200000; }
        this._contactService.GetContacts(fromDate, toDate, 'sundrydebtors', 1, 'false', count).subscribe(function (res) {
            if (res.status === 'success') {
                _this.sundryDebtorsAccountsForAgingReport = lodash__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](res.body.results).map(function (p) { return ({
                    label: p.name,
                    value: p.uniqueName
                }); });
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('advanceSearch'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["ModalDirective"])
    ], AgingReportComponent.prototype, "advanceSearch", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('paginationChild'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_11__["ElementViewContainerRef"])
    ], AgingReportComponent.prototype, "paginationChild", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('filterDropDownList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["BsDropdownDirective"])
    ], AgingReportComponent.prototype, "filterDropDownList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AgingReportComponent.prototype, "creteNewCustomerEvent", void 0);
    AgingReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'aging-report',
            template: __webpack_require__(/*! ./aging-report.component.html */ "./src/app/contact/aging-report/aging-report.component.html"),
            styles: [__webpack_require__(/*! ./aging-report.component.scss */ "./src/app/contact/aging-report/aging-report.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_4__["ToasterService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"], _actions_aging_report_actions__WEBPACK_IMPORTED_MODULE_6__["AgingReportActions"],
            _services_contact_service__WEBPACK_IMPORTED_MODULE_8__["ContactService"],
            _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_14__["BreakpointObserver"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]])
    ], AgingReportComponent);
    return AgingReportComponent;
}());



/***/ }),

/***/ "./src/app/contact/aside-menu-account/aside.menu.account.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/contact/aside-menu-account/aside.menu.account.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">Create Account</h3>\n  </div>\n\n  <div class=\"aside-body\">\n    <div class=\"form-group pdT2\">\n\n      <label class=\"mrB1\">Select Group</label>\n\n      <div class=\"ng-select-wrap liq\">\n        <ng-select placeholder=\"Select Group\" filterPlaceholder=\"Type to search...\" name=\"activeGroupUniqueName\"\n                   [(ngModel)]=\"activeGroupUniqueName\"\n                   [options]=\"flatGroupsOptions\" style=\"width:100%\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n      </div>\n\n    </div>\n\n    <account-add-new *ngIf=\"activeGroupUniqueName && !isUpdateAccount\" [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                     [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                     [isAccountNameAvailable$]=\"isAccountNameAvailable$\"\n                     [createAccountInProcess$]=\"createAccountInProcess$\"\n                     (submitClicked)=\"addNewAcSubmit($event)\" [isGstEnabledAcc]=\"isGstEnabledAcc\"\n                     [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\" [showBankDetail]=\"showBankDetail\">\n    </account-add-new>\n\n    <account-update-new *ngIf=\"activeGroupUniqueName && isUpdateAccount\" [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                        [isGstEnabledAcc]=\"isGstEnabledAcc\" [activeAccount$]=\"activeAccount$\"\n                        [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\" [updateAccountInProcess$]=\"updateAccountInProcess$\"\n                        [accountDetails]=\"accountDetails\" [updateAccountIsSuccess$]=\"updateAccountIsSuccess$\"\n                        (deleteClicked)=\"showDeleteAccountModal()\" (submitClicked)=\"updateAccount($event)\"\n                        [showBankDetail]=\"showBankDetail\" [showVirtualAccount]=\"showVirtualAccount\"\n                        [isDebtorCreditor]=\"isDebtorCreditor\"></account-update-new>\n\n  </div>\n</div>\n\n<!--delete Account modal  -->\n<div bsModal #deleteAccountModal=\"bs-modal\" class=\"modal fade aaa\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <confirm-modal [title]=\"'Delete Account'\" [body]=\"'Are you sure you want to delete this Account?'\"\n                     (cancelCallBack)=\"hideDeleteAccountModal()\" (successCallBack)=\"deleteAccount()\">\n      </confirm-modal>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/contact/aside-menu-account/aside.menu.account.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/contact/aside-menu-account/aside.menu.account.component.ts ***!
  \****************************************************************************/
/*! exports provided: AsideMenuAccountInContactComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuAccountInContactComponent", function() { return AsideMenuAccountInContactComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");










var GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];
var AsideMenuAccountInContactComponent = /** @class */ (function () {
    function AsideMenuAccountInContactComponent(store, groupService, accountsAction, _groupWithAccountsAction, _generalActions) {
        this.store = store;
        this.groupService = groupService;
        this.accountsAction = accountsAction;
        this._groupWithAccountsAction = _groupWithAccountsAction;
        this._generalActions = _generalActions;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"](true);
        this.getUpdateList = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isGstEnabledAcc = true; // true only for groups will not under other
        this.isHsnSacEnabledAcc = false; // true only for groups under revenuefromoperations || otherincome || operatingcost || indirectexpenses
        this.isDebtorCreditor = true; // in case of sundrycreditors or sundrydebtors
        this.showVirtualAccount = false;
        this.showBankDetail = false;
        this.accountDetails = '';
        this.breadcrumbUniquePath = [];
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        // account-add component's property
        this.fetchingAccUniqueName$ = this.store.select(function (state) { return state.groupwithaccounts.fetchingAccUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.select(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this.store.select(function (state) { return state.groupwithaccounts.createAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeAccount$ = this.store.select(function (state) { return state.groupwithaccounts.activeAccount; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeGroup$ = this.store.select(function (state) { return state.groupwithaccounts.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.virtualAccountEnable$ = this.store.select(function (state) { return state.invoice.settings; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateAccountInProcess$ = this.store.select(function (state) { return state.groupwithaccounts.updateAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateAccountIsSuccess$ = this.store.select(function (state) { return state.groupwithaccounts.updateAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.deleteAccountSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.groupwithaccounts.isDeleteAccSuccess; })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.groupList$ = this.store.select(function (state) { return state.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.flattenGroups$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.general.flattenGroups; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    AsideMenuAccountInContactComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch(this._generalActions.getFlattenGroupsReq());
        if (this.isUpdateAccount && this.activeAccountDetails) {
            this.accountDetails = this.activeAccountDetails;
            this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(this.activeAccountDetails.name));
            this.store.dispatch(this.accountsAction.getAccountDetails(this.activeAccountDetails.uniqueName));
        }
        this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';
        this.activeGroup$.subscribe(function (a) {
            if (a) {
                _this.virtualAccountEnable$.subscribe(function (s) {
                    if (s && s.companyCashFreeSettings && s.companyCashFreeSettings.autoCreateVirtualAccountsForDebtors && _this.breadcrumbUniquePath[1] === 'sundrydebtors') {
                        _this.showVirtualAccount = true;
                    }
                    else {
                        _this.showVirtualAccount = false;
                    }
                });
            }
        });
        this.flattenGroups$.subscribe(function (flattenGroups) {
            if (flattenGroups) {
                var items = flattenGroups.filter(function (grps) {
                    return grps.groupUniqueName === _this.activeGroupUniqueName || grps.parentGroups.some(function (s) { return s.uniqueName === _this.activeGroupUniqueName; });
                }).map(function (m) {
                    return {
                        value: m.groupUniqueName, label: m.groupName
                    };
                });
                _this.flatGroupsOptions = items;
            }
        });
        this.deleteAccountSuccess$.subscribe(function (res) {
            if (res) {
                _this.getUpdateList.emit(_this.activeGroupUniqueName);
                _this.store.dispatch(_this.accountsAction.resetDeleteAccountFlags());
            }
        });
    };
    AsideMenuAccountInContactComponent.prototype.addNewAcSubmit = function (accRequestObject) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
        this.getUpdateList.emit(this.activeGroupUniqueName);
    };
    AsideMenuAccountInContactComponent.prototype.closeAsidePane = function (event) {
        this.ngOnDestroy();
        this.closeAsideEvent.emit(event);
    };
    AsideMenuAccountInContactComponent.prototype.showDeleteAccountModal = function () {
        this.deleteAccountModal.show();
    };
    AsideMenuAccountInContactComponent.prototype.hideDeleteAccountModal = function () {
        this.deleteAccountModal.hide();
    };
    AsideMenuAccountInContactComponent.prototype.deleteAccount = function () {
        var activeGrpName = this.activeGroupUniqueName;
        this.store.dispatch(this.accountsAction.deleteAccount(this.activeAccountDetails.uniqueName, activeGrpName));
        this.hideDeleteAccountModal();
        // this.getUpdateList.emit(activeGrpName);
    };
    AsideMenuAccountInContactComponent.prototype.updateAccount = function (accRequestObject) {
        this.store.dispatch(this.accountsAction.updateAccountV2(accRequestObject.value, accRequestObject.accountRequest));
        this.hideDeleteAccountModal();
        this.getUpdateList.emit(this.activeGroupUniqueName);
    };
    AsideMenuAccountInContactComponent.prototype.makeGroupListFlatwithLessDtl = function (rawList) {
        var obj;
        obj = _.map(rawList, function (item) {
            obj = {};
            obj.name = item.name;
            obj.uniqueName = item.uniqueName;
            obj.synonyms = item.synonyms;
            obj.parentGroups = item.parentGroups;
            return obj;
        });
        return obj;
    };
    AsideMenuAccountInContactComponent.prototype.flattenGroup = function (rawList, parents) {
        var _this = this;
        if (parents === void 0) { parents = []; }
        var listofUN;
        listofUN = _.map(rawList, function (listItem) {
            var newParents;
            var result;
            newParents = _.union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            if (listItem.groups.length > 0) {
                result = _this.flattenGroup(listItem.groups, newParents);
                result.push(_.omit(listItem, 'groups'));
            }
            else {
                result = _.omit(listItem, 'groups');
            }
            return result;
        });
        return _.flatten(listofUN);
    };
    AsideMenuAccountInContactComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuAccountInContactComponent.prototype, "activeGroupUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AsideMenuAccountInContactComponent.prototype, "isUpdateAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AsideMenuAccountInContactComponent.prototype, "activeAccountDetails", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], AsideMenuAccountInContactComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], AsideMenuAccountInContactComponent.prototype, "getUpdateList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('deleteAccountModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__["ModalDirective"])
    ], AsideMenuAccountInContactComponent.prototype, "deleteAccountModal", void 0);
    AsideMenuAccountInContactComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'aside-menu-account',
            template: __webpack_require__(/*! ./aside.menu.account.component.html */ "./src/app/contact/aside-menu-account/aside.menu.account.component.html"),
            styles: ["\n      :host {\n          position: fixed;\n          left: auto;\n          top: 0;\n          right: 0;\n          bottom: 0;\n          max-width: 480px;\n          width: 100%;\n          z-index: 1045;\n      }\n\n\n      :host.in #close {\n          display: block;\n          position: fixed;\n          left: -41px;\n          top: 0;\n          z-index: 5;\n          border: 0;\n          border-radius: 0;\n      }\n\n      :host .container-fluid {\n          padding-left: 0;\n          padding-right: 0;\n      }\n\n      :host .aside-pane {\n          max-width: 480px;\n          width: 100%;\n      }\n\n      @media (max-width: 575px) {\n          :host {\n              max-width: 275px;\n              width: 100%;\n          }\n\n      }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_6__["GroupService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__["AccountsAction"],
            _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_8__["GroupWithAccountsAction"],
            _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_9__["GeneralActions"]])
    ], AsideMenuAccountInContactComponent);
    return AsideMenuAccountInContactComponent;
}());



/***/ }),

/***/ "./src/app/contact/contact.component.html":
/*!************************************************!*\
  !*** ./src/app/contact/contact.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<tabset #staticTabs class=\"custom-tabs \" [ngClass]=\"{'hide-header': activeTab === 'vendor'}\">\n\n    <!-- region Customer/Vendor -->\n    <tab heading=\"Customer\" (select)=\"tabSelected(activeTab === 'vendor' ? 'vendor' : 'customer')\" [active]=\"activeTab !== 'aging-report'\">\n        <div class=\"container-fluid\">\n\n            <div class=\"top_bar clearfix\">\n                <div class=\"form-inline\">\n                    <div class=\"dis pull-left mrR1\">\n\n                        <div *ngIf=\"activeTab !== 'aging'\" class=\"btn-group\" #filterDropDownList=\"bs-dropdown\" dropdown [autoClose]=\"false\" (clickOutside)=\"hideListItems()\" [tooltip]=\"'Enable / Disable Column'\" [placement]=\"'right'\">\n                            <i dropdownToggle class=\"icon-options pd cp fs20\"></i>\n\n                            <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-left\" role=\"menu\" [style.width.px]=\"'200'\">\n\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.parentGroup\" (ngModelChange)=\"columnFilter($event, 'parentGroup')\" [(ngModel)]=\"showFieldFilter.parentGroup\" /> Parent Group\n                                    </a>\n                                </li>\n\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.openingBalance\" (ngModelChange)=\"columnFilter($event, 'openingBalance')\" [(ngModel)]=\"showFieldFilter.openingBalance\" /> Opening\n                                    </a>\n                                </li>\n\n                                <!--                <li role=\"menuitem\" *ngIf=\"activeTab === 'customer'\">-->\n                                <!--                  <a class=\"dropdown-item\">-->\n                                <!--                    <input type=\"checkbox\" name=\"field_filter.debitTotal\"-->\n                                <!--                      (ngModelChange)=\"columnFilter($event, 'debitTotal')\" [(ngModel)]=\"showFieldFilter.debitTotal\" />-->\n                                <!--                    Sales-->\n                                <!--                  </a>-->\n                                <!--                </li>-->\n\n                                <!--                <li role=\"menuitem\" *ngIf=\"activeTab === 'customer'\">-->\n                                <!--                  <a class=\"dropdown-item\">-->\n                                <!--                    <input type=\"checkbox\" name=\"field_filter.creditTotal\"-->\n                                <!--                      (ngModelChange)=\"columnFilter($event, 'creditTotal')\" [(ngModel)]=\"showFieldFilter.creditTotal\" />-->\n                                <!--                    Receipt-->\n                                <!--                  </a>-->\n                                <!--                </li>-->\n\n                                <!--                <li role=\"menuitem\" *ngIf=\"activeTab === 'vendor'\">-->\n                                <!--                  <a class=\"dropdown-item\">-->\n                                <!--                    <input type=\"checkbox\" name=\"field_filter.debitTotal\"-->\n                                <!--                      (ngModelChange)=\"columnFilter($event, 'debitTotal')\" [(ngModel)]=\"showFieldFilter.debitTotal\" />-->\n                                <!--                    Purchase-->\n                                <!--                  </a>-->\n                                <!--                </li>-->\n\n                                <!--                <li role=\"menuitem\" *ngIf=\"activeTab === 'vendor'\">-->\n                                <!--                  <a class=\"dropdown-item\">-->\n                                <!--                    <input type=\"checkbox\" name=\"field_filter.creditTotal\"-->\n                                <!--                      (ngModelChange)=\"columnFilter($event, 'creditTotal')\" [(ngModel)]=\"showFieldFilter.creditTotal\" />-->\n                                <!--                    Payment-->\n                                <!--                  </a>-->\n                                <!--                </li>-->\n\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.mobile\" (ngModelChange)=\"columnFilter($event, 'mobile')\" [(ngModel)]=\"showFieldFilter.mobile\" /> Mobile No.</a>\n                                </li>\n\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.email\" (ngModelChange)=\"columnFilter($event, 'email')\" [(ngModel)]=\"showFieldFilter.email\" /> Email Id</a>\n                                </li>\n\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.state\" (ngModelChange)=\"columnFilter($event, 'state')\" [(ngModel)]=\"showFieldFilter.state\" /> State</a>\n                                </li>\n\n                                <!-- <li role=\"menuitem\">\n  <a class=\"dropdown-item\">\n    <input type=\"checkbox\" name=\"field_filter.closingBalance\"\n           [(ngModel)]=\"showFieldFilter.closingBalance\"/>Amt. Due\n  </a>\n</li> -->\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.gstin\" (ngModelChange)=\"columnFilter($event, 'gstin')\" [(ngModel)]=\"showFieldFilter.gstin\" /> GSTIN</a>\n                                </li>\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item\">\n                                        <input type=\"checkbox\" name=\"field_filter.comment\" (ngModelChange)=\"columnFilter($event, 'comment')\" [(ngModel)]=\"showFieldFilter.comment\" /> Comment\n                                    </a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                    <div class=\"pull-left header-left\">\n\n\n                        <div class=\"form-group max250\" *ngIf=\"activeTab !== 'aging'\">\n                            <input type=\"text\" placeholder=\"Name/Email/Mobile\" class=\"form-control\" [(ngModel)]=\"searchStr\" (ngModelChange)=\"searchStr$.next($event)\" style=\"width:210px\" />\n                        </div>\n\n                    </div>\n\n                    <div class=\"btn-group plus-btn pull-right onDesktopView\">\n                        <button *ngIf=\"activeTab == 'customer'\" class=\"btn btn-blue\" style=\"margin-right: 5px\" (click)=\"openAddAndManage('customer')\">\n              + New Customer\n            </button>\n                        <button *ngIf=\"activeTab == 'vendor'\" class=\"btn btn-blue \" (click)=\"openAddAndManage('vendor')\">\n              + New Vendor\n            </button>\n                    </div>\n                    <div class=\"customer-footer-box pull-right \">\n\n                        <div class=\"clearfix\">\n                            <span class=\"pull-left mrR1 totalContacts\">\n                <h5>\n                  <span *ngIf=\"!selectedCheckedContacts.length\" class=\"numbertotal\">{{Totalcontacts}}</span>\n                            <span *ngIf=\"selectedCheckedContacts.length>0\" class=\"numbertotal\">{{selectedCheckedContacts.length}}</span> Contacts\n                            </h5>\n                            </span>\n                            <div class=\"btn-group moreBtn\" dropdown>\n                                <button id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn btn-default dropdown-toggle\" aria-controls=\"dropdown-basic\">\n                  More <span class=\"caret\"></span>\n                </button>\n                                <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n                                    <li role=\"menuitem\" (click)=\"openEmailDialog();\">Email</li>\n                                    <li role=\"menuitem\" (click)=\"openSmsDialog();\">SMS</li>\n                                    <li role=\"menuitem\" (click)=\"downloadCSV();\">Download CSV</li>\n                                </ul>\n                            </div>\n                        </div>\n\n                    </div>\n\n                    <div class=\"btn-group plus-btn pull-right onMobileView\">\n                        <button *ngIf=\"activeTab == 'customer'\" class=\"btn btn-blue\" style=\"margin-right: 5px\" (click)=\"openAddAndManage('customer')\">\n              + New Customer\n            </button>\n                        <button *ngIf=\"activeTab == 'vendor'\" class=\"btn btn-blue \" (click)=\"openAddAndManage('vendor')\">\n              + New Vendor\n            </button>\n                    </div>\n\n\n                </div>\n            </div>\n\n\n            <div class=\"text-center top-aging-table-top pd1\" *ngIf=\"isMobileScreen\">\n                <p><strong>Due as on </strong> <span class=\"italic underline\">\n            <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n              (hideDaterangepicker)=\"selectedDate($event)\" (applyDaterangepicker)=\"selectedDate($event)\"\n              class=\"form-control date-range-picker\" />\n          </span></p>\n            </div>\n\n            <div class=\"contact-main customerPage onMobileView\">\n\n                <div class=\"table-responsive pdB2 mrB1\">\n\n                    <div class=\"\">\n\n                        <div *ngIf=\"!isMobileScreen\">\n                            <perfect-scrollbar fxFlex=\"auto\" [scrollIndicators]=\"true\">\n                                <ng-container *ngTemplateOutlet='mainTable'></ng-container>\n                            </perfect-scrollbar>\n                        </div>\n\n                        <div *ngIf=\"isMobileScreen\">\n\n                            <!-- <div class=\"text-center top-aging-table-top pd1\">\n                <p><strong>Due as on </strong> <span class=\"italic underline\">\n                    <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n                           (hideDaterangepicker)=\"selectedDate($event)\" (applyDaterangepicker)=\"selectedDate($event)\"\n                           class=\"form-control date-range-picker\"/>\n                  </span></p>\n              </div> -->\n                            <ng-container *ngTemplateOutlet='mainTable'></ng-container>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"clearfix pagination-main\">\n            <div class=\" mt-5 mb-100px\">\n                <div class=\"\">\n                    <div class=\"custumerRightWrap clearfix\">\n                        <div class=\"text-right\">\n                            <h4 class=\"mb-1 pdR2\">Result Total</h4>\n                        </div>\n\n                        <div class=\"bg-white clearfix\">\n                            <div class=\"customer-right clearfix\" style=\"width: 100%;\">\n                                <table class=\"text-right\">\n                                    <tr>\n                                        <td>\n                                            <p *ngIf=\"activeTab === 'vendor'\">Purchase</p>\n                                            <p *ngIf=\"activeTab === 'customer'\">Sales</p>\n                                            <h3>{{totalSales |giddhCurrency }}/-</h3>\n                                        </td>\n                                        <td>\n                                            <p *ngIf=\"activeTab === 'vendor'\">Payment</p>\n                                            <p *ngIf=\"activeTab === 'customer'\">Receipt</p>\n                                            <h3>{{totalReceipts | giddhCurrency}}/-</h3>\n                                        </td>\n                                        <td>\n                                            <p>Due</p>\n                                            <h3>{{totalDue | giddhCurrency}}/-</h3>\n                                        </td>\n\n                                    </tr>\n\n                                </table>\n                            </div>\n\n                        </div>\n                    </div>\n\n                </div>\n\n\n            </div>\n        </div>\n    </tab>\n    <!-- endregion -->\n\n    <!-- region Aging Report -->\n    <tab heading=\"Aging Report\" (select)=\"tabSelected('aging-report')\" [active]=\"activeTab === 'aging-report'\">\n        <!--    <div *ngIf=\"activeTab === 'aging'\">-->\n        <aging-report (creteNewCustomerEvent)=\"openAddAndManage('customer')\"></aging-report>\n        <!--    </div>-->\n    </tab>\n    <!-- endregion -->\n</tabset>\n\n<!-- region Pay now modal -->\n<div bsModal #payNowModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n\n    <div class=\"modal-dialog modal-md\" *ngIf=\"cashFreeAvailableBalance\">\n        <div class=\"modal-content\">\n            <div *ngIf=\"selectedAccForPayment\">\n                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n                    <h3 class=\"modal-title bg\" id=\"modal-title-pay-now\">Pay to {{selectedAccForPayment.name}} </h3>\n                    <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onPaymentModalCancel()\"></i>\n                </div>\n                <div class=\"modal-body pdL2 pdR2 clearfix\" id=\"export-body-pay-now\">\n                    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n                        <div class=\"modal_wrap mrB2\">\n                            <h3 class=\"text-right mr2\">Amount Due Rs: {{selectedAccForPayment.closingBalance?.amount}}</h3>\n                            <h3 class=\"mrB2\">\n                                <b>Pay through Cash Free</b>\n                            </h3>\n                            <h4 *ngIf=\"cashFreeAvailableBalance\">\n                                <small>Balance in account Rs. {{cashFreeAvailableBalance}}</small>\n                            </h4>\n                            <input #amountBox type=\"number\" class=\"form-control\">\n                        </div>\n                        <div>\n                            <button [disabled]=\"!amountBox.value\" type=\"submit\" class=\"btn btn-md btn-success btn-block\" (click)=\"onConfirmation(amountBox.value)\">Pay\n              </button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"modal-dialog modal-small\" *ngIf=\"!cashFreeAvailableBalance\">\n        <div class=\"modal-content\">\n            <div *ngIf=\"selectedAccForPayment\">\n                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n                    <h3 class=\"modal-title bg\" id=\"modal-title\">Add Cashfree details</h3>\n                    <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onPaymentModalCancel()\"></i>\n                </div>\n                <div class=\"modal-body pdL2 pdR2 clearfix\" id=\"export-body\">\n                    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\" (submit)=\"submitCashfreeDetail(payoutObj)\">\n                        <div class=\"form-group col-xs-12\">\n                            <div class=\"row\">\n                                <label>Client Id\n                  <span class=\"required\">*</span>\n                </label>\n                                <input class=\"form-control\" type=\"text\" placeholder=\"Client Id\" name=\"payoutForm.userName\" [(ngModel)]=\"payoutObj.userName\" required autocomplete=\"off\">\n                            </div>\n                        </div>\n                        <div class=\"form-group col-xs-12\">\n                            <div class=\"row\">\n                                <label>Client Secret Key\n                  <span class=\"required\">*</span>\n                </label>\n                                <input class=\"form-control\" type=\"password\" placeholder=\"Client Secret key\" name=\"payoutForm.password\" [(ngModel)]=\"payoutObj.password\" required autocomplete=\"off\">\n                            </div>\n                        </div>\n                        <div class=\"form-group col-xs-12\">\n                            <div class=\"row\">\n                                <label>Link Account</label>\n                                <sh-select placeholder=\"Link Account\" name=\"payoutObj.account\" [(ngModel)]=\"payoutObj.fakeAccObj\" [options]=\"bankAccounts$ | async\" (selected)=\"selectCashfreeAccount($event, payoutObj)\"></sh-select>\n                            </div>\n                        </div>\n                        <div class=\"form-group col-xs-12\">\n                            <div class=\"row\">\n                                <input type=\"checkbox\" [(ngModel)]=\"payoutObj.autoCapturePayment\" name=\"payoutObj.autoCapturePayment\" /> Automatic capture on payment\n                            </div>\n                        </div>\n                        <input type=\"submit\" class=\"btn btn-success\" value=\"Save\">\n                        <input type=\"button\" class=\"btn btn-warning\" value=\"Cancel\" (click)=\"onPaymentModalCancel()\">\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n<!--endregion-->\n\n<!-- region Modal for Mail/SMS for vendore-->\n<div *ngIf=\"activeTab === 'vendor'\" class=\"modal fade noBrdRdsModal\" tabindex=\"-1\" bsModal #mailModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <div class=\"noBrdRdsModal\">\n                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n                    <h3 class=\"modal-title bg\" id=\"modal-title-mail-vendor\">{{messageBody.header.set}}</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"mailModal.hide()\">×</span>\n                    <!-- <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" ></i> -->\n                </div>\n                <div class=\"modal-body pdL2 pdR2 clearfix\">\n                    <h1 class=\"mrB1\" *ngIf=\"messageBody.type == 'Email'\">Enter Subject:</h1>\n                    <input *ngIf=\"messageBody.type == 'Email'\" class=\"form-control mrB1\" #subject [(ngModel)]=\"messageBody.subject\" type=\"text\" placeholder=\"Enter subject here\" />\n                    <h1 class=\"mrB1\">Type message body:</h1>\n                    <textarea #messageBox [(ngModel)]=\"messageBody.msg\" class=\"form-control\" rows=\"4\" style=\"resize:none;\" placeholder=\"start typing your message here\"></textarea>\n                    <small class=\"mrT mrB grey\">Tip: Click on the tabs below to insert data in your message body. Anything\n            followed by '%s_' represents the position where actual data will be placed.\n          </small>\n\n                    <div class=\"row mrT2\">\n                        <ul class=\"list-inline pills\">\n                            <li *ngFor=\"let val of dataVariables\" (click)=\"addValueToMsg(val)\">{{val.name}}</li>\n                        </ul>\n                    </div>\n                    <div class=\"mrT4\">\n                        <button class=\"btn btn-sm btn-success pull-right mrL1\" (click)=\"send('sundrycreditors')\">{{messageBody.btn.set}}</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!--endregion-->\n\n<!--region Modal for Mail/SMS for customer-->\n<div *ngIf=\"activeTab === 'customer'\" class=\"modal fade noBrdRdsModal\" tabindex=\"-1\" bsModal #mailModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n\n    <div class=\"modal-dialog modal-md\">\n\n        <div class=\"modal-content\">\n\n            <div class=\"noBrdRdsModal\">\n\n                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n                    <h3 class=\"modal-title bg\" id=\"modal-title-mail-customer\">{{messageBody.header.set}}</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"mailModal.hide()\">×</span>\n                    <!-- <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" ></i> -->\n                </div>\n\n                <div class=\"modal-body pdL2 pdR2 clearfix\">\n\n                    <h1 class=\"mrB1\" *ngIf=\"messageBody.type == 'Email'\">Enter Subject:</h1>\n                    <input *ngIf=\"messageBody.type == 'Email'\" class=\"form-control mrB1\" #subject [(ngModel)]=\"messageBody.subject\" type=\"text\" placeholder=\"Enter subject here\" />\n\n                    <h1 class=\"mrB1\">Type message body:</h1>\n                    <textarea #messageBox [(ngModel)]=\"messageBody.msg\" class=\"form-control\" rows=\"4\" style=\"resize:none;\" placeholder=\"start typing your message here\"></textarea>\n                    <small class=\"mrT mrB grey\">Tip: Click on the tabs below to insert data in your message body. Anything\n            followed by '%s_' represents the position where actual data will be placed.\n          </small>\n\n                    <div class=\"row mrT2\">\n                        <ul class=\"list-inline pills\">\n                            <li *ngFor=\"let val of dataVariables\" (click)=\"addValueToMsg(val)\">{{val.name}}</li>\n                        </ul>\n                    </div>\n\n                    <div class=\"mrT4\">\n                        <button class=\"btn btn-sm btn-success pull-right mrL1\" (click)=\"send('sundrydebtors')\">{{messageBody.btn.set}}</button>\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n</div>\n<!--endregion-->\n\n<div class=\"aside-overlay\" *ngIf=\"accountAsideMenuState === 'in'\"></div>\n<div class=\"abc \" *ngIf=\"accountAsideMenuState === 'in'\">\n    <aside-menu-account [activeGroupUniqueName]=\"selectedGroupForCreateAcc\" [activeAccountDetails]=\"activeAccountDetails\" [isUpdateAccount]=\"isUpdateAccount\" class=\"accountAsideMenuState2 transinherit\" [@slideInOut]=\"accountAsideMenuState\" (closeAsideEvent)=\"toggleAccountAsidePane($event)\"\n        (getUpdateList)=\"getUpdatedList($event)\"></aside-menu-account>\n</div>\n\n<div class=\"aside-overlay\" *ngIf=\"paymentAsideMenuState === 'in'\"></div>\n<div class=\"abc vendorPayNow\" *ngIf=\"paymentAsideMenuState === 'in'\">\n    <payment-aside class=\"accountAsideMenuState2 transinherit\" [selectedAccForPayment]=\"selectedAccForPayment\" (closeAsideEvent)=\"togglePaymentPane($event)\">\n    </payment-aside>\n</div>\n\n<ng-template #mainTable>\n\n    <div class=\"onMobileView mobilecardwrapper vendorPage\">\n        <table class=\"table basic table-bordered aging-table marginBottom260\" *ngIf=\"activeTab !== 'aging'\">\n            <thead>\n                <tr class=\"aging-table-top\">\n                    <td></td>\n                    <td *ngIf=\"showFieldFilter.parentGroup\"></td>\n                    <td [attr.colspan]=\"tableColsPan\" class=\"text-center top-aging-table-top\">\n                        <p><strong>Due as on </strong> <span class=\"italic underline\">\n                <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n                  (hideDaterangepicker)=\"selectedDate($event)\" (applyDaterangepicker)=\"selectedDate($event)\"\n                  class=\"form-control date-range-picker\" />\n              </span></p>\n                    </td>\n                    <td *ngIf=\"activeTab === 'vendor' && isICICIIntegrated\"></td>\n                    <td class=\"text-lovercase\" *ngIf=\"showFieldFilter.email\"></td>\n                    <td *ngIf=\"showFieldFilter.mobile\"></td>\n                    <td *ngIf=\"showFieldFilter.gstin\"></td>\n                    <td *ngIf=\"showFieldFilter.state\"></td>\n                    <td *ngIf=\"showFieldFilter.comment\"></td>\n                </tr>\n\n                <tr>\n                    <th>\n                        <span class=\"inline table-checkbox\">\n              <label></label>\n              <input type=\"checkbox\" *ngIf=\"selectedCheckedContacts.length\" [(ngModel)]=\"allSelectionModel\"\n                (ngModelChange)=\"toggleAllSelection(allSelectionModel)\" />\n            </span>\n                        <span>Name</span>\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'name'}\">\n                        </ng-container>\n                    </th>\n\n                    <th *ngIf=\"showFieldFilter.parentGroup\">Parent group\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'group'}\">\n                        </ng-container>\n                    </th>\n\n                    <th class=\"text-right  pr-3\" *ngIf=\"showFieldFilter.openingBalance\">Opening\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'openingBalance'}\">\n                        </ng-container>\n                    </th>\n\n                    <th class=\"text-right  pr-3\">\n                        {{ activeTab === 'customer' ? 'Sales' : 'Purchase' }}\n                        <ng-container *ngIf=\"activeTab === 'customer'\">\n                            <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'debitTotal'}\">\n                            </ng-container>\n                        </ng-container>\n                        <ng-container *ngIf=\"activeTab === 'vendor'\">\n                            <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'creditTotal'}\">\n                            </ng-container>\n                        </ng-container>\n                    </th>\n\n                    <th class=\"text-right  pr-3\">\n                        {{ activeTab === 'customer' ? 'Receipt' : 'Payment' }}\n                        <ng-container *ngIf=\"activeTab === 'customer'\">\n                            <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'creditTotal'}\">\n                            </ng-container>\n                        </ng-container>\n                        <ng-container *ngIf=\"activeTab === 'vendor'\">\n                            <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'debitTotal'}\">\n                            </ng-container>\n                        </ng-container>\n                    </th>\n\n                    <th class=\"text-right  pr-3\"> Closing\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'amountDue'}\">\n                        </ng-container>\n                    </th>\n\n                    <th *ngIf=\"showFieldFilter.email\">\n                        <div class=\"d-flex\">\n                            <div class=\"flex-fill\">\n                                Email\n                            </div>\n                            <div class=\"icon-pointer cursor-pointer iconSearch\">\n                                <!--                        <i class=\"icon-search\"></i>-->\n                            </div>\n                        </div>\n\n                    </th>\n\n                    <th *ngIf=\"showFieldFilter.mobile\">Mobile No.</th>\n\n                    <th *ngIf=\"showFieldFilter.gstin\">GSTIN\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'gstin'}\">\n                        </ng-container>\n                    </th>\n\n                    <th *ngIf=\"showFieldFilter.state\">State\n                        <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'state'}\">\n                        </ng-container>\n                    </th>\n\n                    <th *ngIf=\"showFieldFilter.comment\">Comment</th>\n\n                    <th *ngIf=\"activeTab === 'vendor' && isICICIIntegrated\">Action</th>\n\n                </tr>\n\n            </thead>\n\n            <tbody>\n                <ng-container *ngIf=\"activeTab === 'customer'\">\n\n                    <tr *ngFor=\"let account of sundryDebtorsAccounts;let idx = index\">\n                        <td class=\"pos-rel WordWrap customerName cursor-pointer\" (clickOutside)=\"dropdown.hide()\" (dblclick)=\"dropdown.show()\" data-title=\"Customer\">\n                            <span class=\"inline table-checkbox\">\n                <label></label>\n                <input type=\"checkbox\" (click)=\"selectAccount($event, account.uniqueName)\"\n                  [(ngModel)]=\"account.isSelected\"\n                  [ngClass]=\"{'checkbox_visible': (selectedCheckedContacts.length || isMobileScreen), 'pos-abs': !selectedCheckedContacts.length}\" />\n              </span> {{account.name}}\n                            <div dropdown #dropdown=\"bs-dropdown\" container=\"body\" [autoClose]=\"false\" class=\"icon-ellipse\">\n                                <a id=\"edit-model-basic\" dropdownToggle class=\"dropdown-toggle icon-dots-three-vertical pull-right\" aria-controls=\"dropdown-basic\" (click)=\"dropdown.show()\">\n\n                                </a>\n\n                                <div id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right wd00\" role=\"menu\" aria-labelledby=\"edit-model-basic\">\n                                    <div class=\"tb-pl-modal-header p-modal-tolltip\" style=\"padding: 0 !important;\">\n\n                                        <div class=\"account-detail-modal-header-div selection-none\">\n\n                                            <div class=\"account-detail-modal-div\">\n\n                                                <div class=\"account-detail-custom-header selection-none-header\">\n\n                                                    <div class=\"d-flex\" style=\"padding: 0px; border-right:0px;\">\n\n                                                        <div class=\"account-detail-padding\" style=\"flex: 1;border-right: 0px;\">\n                                                            <h3 class=\"account-detail-custom-title word-break\"><span (click)=\"performActions(0, account)\">{{account?.name}}</span></h3>\n                                                        </div>\n\n                                                        <div class=\"account-detail-padding\" (click)=\"updateCustomerAcc('customer', account);\">\n                                                            <img src=\"./assets/images/path.svg\">\n                                                        </div>\n\n                                                    </div>\n\n                                                    <div class=\"custom-detail account-detail-padding\">\n                                                        <h4>{{account?.mobileNo}}</h4>\n                                                        <h4>{{account?.email}}</h4>\n                                                        <h4>{{account?.gstIn}}</h4>\n                                                    </div>\n\n                                                </div>\n\n                                                <div class=\"height-82px\">\n\n                                                    <ul class=\"list-unstyled\">\n\n                                                        <li class=\"li-link\" *ngIf=\"!isMobileScreen\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(1, account)\">Go to\n                                Ledger</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(2, account)\">Generate\n                                Invoice</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(3, account, $event )\">Send\n                                SMS</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(4, account, $event)\">Send\n                                Email</a>\n                                                        </li>\n\n                                                    </ul>\n\n                                                </div>\n\n                                            </div>\n\n                                        </div>\n\n                                    </div>\n                                </div>\n\n\n                                <!--Modal for Mail/SMS-->\n                                <div class=\"modal fade noBrdRdsModal\" tabindex=\"-1\" bsModal #mailModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\" (click)=\"$event.stopPropagation()\">\n                                    <div class=\"modal-dialog modal-md\" style=\"margin:auto;margin-top: 200px\">\n\n                                        <div class=\"modal-content\" style=\"padding: 8px 8px 8px 8px;\">\n\n                                            <div class=\"noBrdRdsModal\" style=\"padding: 8px 8px 8px 8px;\">\n\n                                                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\" style=\"padding: 8px 8px 8px 8px;\">\n                                                    <h3 class=\"modal-title bg\" id=\"modal-title\">{{messageBody.header.set}}</h3>\n                                                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"mailModal.hide()\">×</span>\n                                                </div>\n\n                                                <div class=\"modal-body pdL2 pdR2 clearfix\" style=\"padding: 0px !important;\">\n                                                    <h1 class=\"mrB1\" *ngIf=\"messageBody.type == 'Email'\" style=\"margin-top:15px;\">Enter Subject:\n                                                    </h1>\n                                                    <input *ngIf=\"messageBody.type == 'Email'\" class=\"form-control mrB1\" #subject [(ngModel)]=\"messageBody.subject\" type=\"text\" placeholder=\"Enter subject here\" />\n                                                    <h1 class=\"mrB1\" style=\"margin-top:15px;\">Type message body:</h1>\n                                                    <textarea #messageBox [(ngModel)]=\"messageBody.msg\" class=\"form-control\" rows=\"4\" style=\"resize:none;\" placeholder=\"start typing your message here\"></textarea>\n                                                    <small class=\"mrT mrB grey\" style=\"margin-top:15px;display: block\">Tip: Click on the\n                            tabs below to insert data\n                            in your message body. Anything\n                            followed by '%s_' represents the position where actual data will be placed.\n                          </small>\n\n                                                    <div class=\"row mrT2\" style=\"border: unset;margin-top: 20px;\">\n                                                        <ul class=\"list-inline pills\">\n                                                            <li *ngFor=\"let val of dataVariables\" (click)=\"addValueToMsg(val)\" style=\"padding: 5px 10px !important;\">{{val.name}}</li>\n                                                        </ul>\n                                                    </div>\n                                                    <div class=\"mrT4\">\n                                                        <button class=\"btn btn-sm btn-success pull-right mrL1\" (click)=\"send('sundrydebtors')\">{{messageBody.btn.set}}</button>\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                        </div>\n\n                                    </div>\n                                </div>\n                                <!-- </ul> -->\n\n                            </div>\n\n                        </td>\n                        <td class=\"WordWrap \" data-title=\"Parent Group\" *ngIf=\"showFieldFilter.parentGroup\">\n                            {{account.groupUniqueName}}</td>\n                        <td class=\"WordWrap text-right pr-3 \" data-title=\"Opening\" *ngIf=\"showFieldFilter.openingBalance\">\n                            {{account.openingBalance?.amount |giddhCurrency}}\n                        </td>\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Sales\">\n                            {{account.debitTotal |giddhCurrency}} </td>\n\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Receipts\">\n                            {{account.creditTotal |giddhCurrency}}\n                        </td>\n\n\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Closing\">{{account.closingBalance?.amount |giddhCurrency}}\n                        </td>\n                        <td class=\"text-lowercase WordWrap \" *ngIf=\"showFieldFilter.email\" data-title=\"Email\">\n                            {{account.email || '-' }}</td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.mobile \" data-title=\"Mobile No\">{{account.mobileNo || '-'}}\n                        </td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.gstin \" data-title=\"GSTIN\">{{account.gstIn || '-' }}</td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.state \" data-title=\"State\">{{account?.state?.name || '-'}}</td>\n                        <td *ngIf='showFieldFilter.comment' (click)='updateCommentIdx = idx' data-title=\" Comment\">\n                            <ng-container *ngIf='updateCommentIdx != idx'>\n                                {{account.comment || '-' }}\n                            </ng-container>\n                            <ng-container *ngIf='updateCommentIdx === idx'>\n                                <textarea class='form-control' maxlength='100' autofocus=\"true \" placeholder=\"Enter comment here \" [(ngModel)]='account.comment' (blur)='updateComment(account)'></textarea>\n                            </ng-container>\n\n                        </td>\n\n                    </tr>\n                    <!---->\n                    <tr *ngIf=\"!(sundryDebtorsAccounts).length \">\n                        <td colspan=\"11\" class=\"text-center empty_table \">\n                            <h1>No Record Found !!</h1>\n                        </td>\n                    </tr>\n\n                </ng-container>\n\n                <ng-container *ngIf=\"activeTab==='vendor' \">\n\n                    <tr *ngFor=\"let account of sundryCreditorsAccounts; let idx=index \">\n                        <td class=\"pos-rel WordWrap customerName vendorCustomerName cursor-pointer\" data-title=\"Vendor\" (clickOutside)=\"dropdown.hide()\" (dblclick)=\"dropdown.show()\">\n                            <span class=\"inline table-checkbox \">\n                <label></label>\n                <input type=\"checkbox\" (click)=\"selectAccount($event, account.uniqueName) \"\n                  [(ngModel)]=\"account.isSelected \"\n                  [ngClass]=\"{ 'checkbox_visible': (selectedCheckedContacts.length || isMobileScreen), 'pos-abs': !selectedCheckedContacts.length} \" />\n              </span>{{account.name}}\n                            <div dropdown #dropdown=\"bs-dropdown\" container=\"body\" [autoClose]=\"false\" class=\"icon-ellipse\">\n                                <a id=\"edit-model-basic2\" dropdownToggle class=\"dropdown-toggle icon-dots-three-vertical pull-right\" aria-controls=\"dropdown-basic2\" (click)=\"dropdown.show()\">\n\n                                </a>\n\n                                <div id=\"dropdown-basic2\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right wd00\" role=\"menu\" aria-labelledby=\"edit-model-basic2\">\n                                    <div class=\"tb-pl-modal-header p-modal-tolltip\" style=\"padding: 0 !important;\">\n\n                                        <div class=\"account-detail-modal-header-div selection-none\">\n\n                                            <div class=\"account-detail-modal-div\">\n\n                                                <div class=\"account-detail-custom-header selection-none-header\">\n\n                                                    <div class=\"d-flex\" style=\"padding: 0px; border-right:0px;\">\n\n                                                        <div class=\"account-detail-padding\" style=\"flex: 1;border-right: 0px;\">\n                                                            <h3 class=\"account-detail-custom-title word-break\"><span (click)=\"performActions(0, account)\">{{account?.name}}</span></h3>\n                                                        </div>\n\n                                                        <div class=\"account-detail-padding\" (click)=\"updateCustomerAcc('vendor', account);\">\n                                                            <img src=\"./assets/images/path.svg\">\n                                                        </div>\n\n                                                    </div>\n\n                                                    <div class=\"custom-detail account-detail-padding\">\n                                                        <h4>{{account?.mobileNo}}</h4>\n                                                        <h4>{{account?.email}}</h4>\n                                                        <h4>{{account?.gstIn}}</h4>\n                                                    </div>\n\n                                                </div>\n\n                                                <div class=\"height-82px\">\n\n                                                    <ul class=\"list-unstyled\">\n\n                                                        <li class=\"li-link\" *ngIf=\"!isMobileScreen\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(1, account)\">Go to\n                                Ledger</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\" *ngIf=\"!isMobileScreen\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(2, account)\">Generate\n                                Invoice</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(3, account, $event )\">Send\n                                SMS</a>\n                                                        </li>\n\n                                                        <li class=\"li-link\">\n                                                            <a href=\"javascript: void 0\" (click)=\"performActions(4, account, $event)\">Send\n                                Email</a>\n                                                        </li>\n\n                                                    </ul>\n\n                                                </div>\n\n                                            </div>\n\n                                        </div>\n\n                                    </div>\n                                </div>\n\n\n                                <!--Modal for Mail/SMS-->\n                                <div class=\"modal fade noBrdRdsModal\" tabindex=\"-1\" bsModal #mailModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\" (click)=\"$event.stopPropagation()\">\n                                    <div class=\"modal-dialog modal-md\" style=\"margin:auto;margin-top: 200px\">\n\n                                        <div class=\"modal-content\" style=\"padding: 8px 8px 8px 8px;\">\n\n                                            <div class=\"noBrdRdsModal\" style=\"padding: 8px 8px 8px 8px;\">\n\n                                                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\" style=\"padding: 8px 8px 8px 8px;\">\n                                                    <h3 class=\"modal-title bg\" id=\"modal-title\">{{messageBody.header.set}}</h3>\n                                                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"mailModal.hide()\">×</span>\n                                                </div>\n\n                                                <div class=\"modal-body pdL2 pdR2 clearfix\" style=\"padding: 0px !important;\">\n                                                    <h1 class=\"mrB1\" *ngIf=\"messageBody.type == 'Email'\" style=\"margin-top:15px;\">Enter Subject:\n                                                    </h1>\n                                                    <input *ngIf=\"messageBody.type == 'Email'\" class=\"form-control mrB1\" #subject [(ngModel)]=\"messageBody.subject\" type=\"text\" placeholder=\"Enter subject here\" />\n                                                    <h1 class=\"mrB1\" style=\"margin-top:15px;\">Type message body:</h1>\n                                                    <textarea #messageBox [(ngModel)]=\"messageBody.msg\" class=\"form-control\" rows=\"4\" style=\"resize:none;\" placeholder=\"start typing your message here\"></textarea>\n                                                    <small class=\"mrT mrB grey\" style=\"margin-top:15px;display: block\">Tip: Click on the\n                            tabs below to insert data\n                            in your message body. Anything\n                            followed by '%s_' represents the position where actual data will be placed.\n                          </small>\n\n                                                    <div class=\"row mrT2\" style=\"border: unset;margin-top: 20px;\">\n                                                        <ul class=\"list-inline pills\">\n                                                            <li *ngFor=\"let val of dataVariables\" (click)=\"addValueToMsg(val)\" style=\"padding: 5px 10px !important;\">{{val.name}}</li>\n                                                        </ul>\n                                                    </div>\n                                                    <div class=\"mrT4\">\n                                                        <button class=\"btn btn-sm btn-success pull-right mrL1\" (click)=\"send('sundrycreditors')\">{{messageBody.btn.set}}</button>\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                        </div>\n\n                                    </div>\n                                </div>\n                                <!-- </ul> -->\n\n                            </div>\n                        </td>\n                        <td class=\"WordWrap\" data-title=\"Parent Group\" *ngIf=\"showFieldFilter.parentGroup\">\n                            <div class=\"table-email\">{{account.groupUniqueName}}</div>\n                        </td>\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Opening\" *ngIf=\"showFieldFilter.openingBalance\">\n                            {{account.openingBalance?.amount |giddhCurrency}}\n                        </td>\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Purchase\">\n                            {{account.creditTotal |giddhCurrency}}</td>\n\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Payment\">\n                            {{account.debitTotal |giddhCurrency}}</td>\n\n\n                        <td class=\"WordWrap text-right pr-3\" data-title=\"Closing\">{{account.closingBalance?.amount |giddhCurrency}}\n                        </td>\n                        <td class=\"WordWrap text-lowercase \" *ngIf=\"showFieldFilter.email \" data-title=\"Email\">\n                            <div class=\"table-email \">{{account.email || '-' }}</div>\n                        </td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.mobile \" data-title=\"Mobile No.\">{{account.mobileNo || '-' }}\n                        </td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.gstin \" data-title=\"GSTIN\">{{account.gstIn || '-' }}</td>\n                        <td class=\"WordWrap \" *ngIf=\"showFieldFilter.state \" data-title=\"State\">{{account?.state?.name}}</td>\n                        <td *ngIf='showFieldFilter.comment' (click)='updateCommentIdx = idx' data-title=\"Comment\">\n                            <ng-container *ngIf='updateCommentIdx != idx'>\n                                {{account.comment || '-'}}\n                            </ng-container>\n                            <ng-container *ngIf='updateCommentIdx === idx'>\n                                <textarea class='form-control' maxlength='100' [(ngModel)]='account.comment' (blur)='updateComment(account)'></textarea>\n                            </ng-container>\n\n                        </td>\n\n                        <td data-title=\"Action\" *ngIf=\"isICICIIntegrated\">\n                            <button *ngIf=\"account.hasBankDetails \" class=\"btn btn-small btn-success \" (click)=\"openPaymentAside(account)\">Pay Now\n              </button>\n                            <button *ngIf=\"!account.hasBankDetails \" class=\"btn btn-small btn-success \" (click)=\"updateCustomerAcc('vendor', account)\">Add Bank Detail\n              </button>\n\n                        </td>\n                    </tr>\n\n                    <tr *ngIf=\"!(sundryCreditorsAccounts).length \">\n                        <td colspan=\"12 \" class=\"text-center empty_table \">\n                            <h1>No Record Found !!</h1>\n                        </td>\n                    </tr>\n\n                </ng-container>\n            </tbody>\n\n\n        </table>\n    </div>\n\n    <div colspan=\"100%\" class=\"xs-pl-0 paginationWrapper\">\n        <div *ngIf=\"activeTab === 'customer' && sundryDebtorsAccountsBackup.results && sundryDebtorsAccountsBackup.results.length && Totalcontacts>=20\">\n            <div class=\"alC  \">\n                <pagination [totalItems]=\"sundryDebtorsAccountsBackup.totalPages\" [(ngModel)]=\"sundryDebtorsAccountsBackup.page\" [maxSize]=\"5\" class=\"pagination-sm\" [boundaryLinks]=\"true\" [itemsPerPage]=\"1\" [rotate]=\"false\" (pageChanged)=\"pageChanged($event)\">\n                </pagination>\n            </div>\n        </div>\n\n        <div *ngIf=\"activeTab === 'vendor' && sundryCreditorsAccountsBackup.results && sundryCreditorsAccountsBackup.results.length && Totalcontacts>=20\">\n            <div class=\"alC \">\n                <pagination [totalItems]=\"sundryCreditorsAccountsBackup.totalPages\" [(ngModel)]=\"sundryCreditorsAccountsBackup.page\" [maxSize]=\"5\" class=\"pagination-sm\" [boundaryLinks]=\"true\" [itemsPerPage]=\"1\" [rotate]=\"false\" (pageChanged)=\"pageChanged($event)\">\n                </pagination>\n            </div>\n        </div>\n    </div>\n\n</ng-template>\n\n\n<!-- region sorting template -->\n<ng-template #sortingTemplate let-col>\n    <div class=\"icon-pointer cp\">\n        <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sort(col, 'asc')\" *ngIf=\"key !== col\" [ngClass]=\"{'activeTextColor': key === col && order === 'asc'}\"></div>\n\n        <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sort(col, 'desc')\" *ngIf=\"key === col && order === 'asc'\" [ngClass]=\"{'activeTextColor': key === col && order === 'asc'}\"></div>\n\n        <div class=\"fa fa-long-arrow-down text-light-2 d-block font-xxs\" *ngIf=\"key === col && order === 'desc'\" (click)=\"sort(col, 'asc')\" [ngClass]=\"{'activeTextColor': key === col && order === 'desc'}\"></div>\n    </div>\n</ng-template>\n<!-- endregion -->\n"

/***/ }),

/***/ "./src/app/contact/contact.component.scss":
/*!************************************************!*\
  !*** ./src/app/contact/contact.component.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".dropdown-menu > li > a {\n  padding: 2px 10px; }\n\n.dis {\n  display: flex; }\n\n.pd1 {\n  padding: 5px; }\n\n.aging-table > tbody > tr input[type=\"checkbox\"] {\n  position: absolute !important;\n  opacity: 0; }\n\n.aging-table > tbody > tr:hover input[type=\"checkbox\"] {\n  position: relative !important;\n  opacity: 1; }\n\n.checkbox_visible {\n  opacity: 1 !important;\n  position: relative !important; }\n\n.icon-pointer {\n  position: absolute;\n  right: 10px;\n  top: 31%; }\n\n.icon-pointer.iconSearch {\n  top: 30%;\n  color: #A9A9A9; }\n\n.icon-pointer .glyphicon:hover {\n  color: #FF5F00 !important; }\n\n.icon-pointer .activeTextColor {\n  color: #FF5F00 !important;\n  opacity: 1 !important; }\n\n.icon-pointer .d-block.font-xxs.glyphicon.glyphicon-triangle-top {\n  line-height: 0.5;\n  height: 8px; }\n\n.icon-pointer .font-xxs {\n  font-size: 12px; }\n\n.account-detail-modal-header {\n  position: absolute;\n  top: 20px;\n  left: 30%;\n  right: auto;\n  z-index: 1;\n  margin: 0;\n  background: white;\n  width: 50%;\n  padding: 1px;\n  box-shadow: 1px 0 9px grey; }\n\n.account-detail-modal-header-div {\n  padding: 0;\n  border-radius: 0; }\n\n.account-detail-modal-div {\n  height: 100%;\n  padding: 0; }\n\n.account-detail-custom-header {\n  border-right: 0;\n  padding: 11px 10px 10px 10px;\n  width: 100%;\n  background: #ffece094; }\n\n.account-detail-custom-title {\n  font-family: LatoWebBold !important;\n  font-size: 16px !important; }\n\n.account-detail-padding {\n  padding: 1px;\n  text-transform: none !important; }\n\n.custom-detail h4 {\n  color: #707070;\n  margin-top: 7px;\n  font-size: 14px !important;\n  font-family: latoWeb !important; }\n\n.height-82px {\n  padding: 10px 10px 15px 10px;\n  border-top: 1px solid #C7C7C7; }\n\nul.list-unstyled li {\n  margin-top: 7px; }\n\nul.list-unstyled li a {\n  color: black; }\n\n.p-modal-tolltip {\n  display: block;\n  position: absolute;\n  background-color: white;\n  z-index: 1000;\n  width: 257px;\n  border: 1px solid #b4afaf;\n  border-radius: 4px;\n  box-shadow: 0 7px 24px #00000038;\n  top: -2px; }\n\n.wd00 {\n  min-width: 0px !important;\n  min-height: 0px !important; }\n\n.model-position {\n  float: right;\n  right: -234px; }\n\n.li-link {\n  margin-top: 15px !important;\n  font-family: 'LatoWebMedium'; }\n\n.li-link:first-child {\n    margin-top: 0 !important; }\n\n.li-link a:hover {\n    color: #ff4700 !important; }\n\n.transinherit {\n  transform: inherit !important; }\n\ntr:first-child td.pos-rel.WordWrap.customerName.cursor-pointer {\n  border-top: none; }\n\ntd.pos-rel.WordWrap.customerName.cursor-pointer {\n  border-bottom: none;\n  height: 37px;\n  line-height: 1.4;\n  border-right: none;\n  max-width: 332px;\n  position: relative !important;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  position: relative !important;\n  padding-right: 35px; }\n\ntd.pos-rel.WordWrap.customerName.vendorCustomerName.cursor-pointer {\n  height: 50px;\n  line-height: 2.4;\n  border-right: none; }\n\ntr:last-child td.pos-rel.WordWrap.customerName.cursor-pointer, tr:last-child td.pos-rel.WordWrap.customerName.vendorCustomerName.cursor-pointer {\n  border-bottom: 1px solid #ddd !important; }\n\n.customerName .icon-ellipse {\n  position: absolute;\n  right: 10px;\n  top: 10px; }\n\n.pos-rel.WordWrap .icon-dots-three-vertical {\n  transform: rotate(90deg);\n  font-size: 20px;\n  vertical-align: middle;\n  display: none;\n  color: #333333; }\n\n.pos-rel.WordWrap:hover .icon-dots-three-vertical {\n  display: block;\n  line-height: 1; }\n\n.pos-rel.WordWrap.vendorCustomerName:hover .icon-dots-three-vertical {\n  line-height: 1.6; }\n\n.custumerRightWrap {\n  padding-right: 0; }\n\ntr.aging-table-top td {\n  width: 320px; }\n\n.aging-table {\n  max-width: 1170px;\n  width: 100%; }\n\n.table-aging-report {\n  max-width: 1170px;\n  width: 100%; }\n\n#dropdown-basics {\n  position: fixed !important;\n  background: red;\n  bottom: initial; }\n\n.btn-group.moreBtn.open.show {\n  display: inline-block !important; }\n\n.moreBtn li {\n  padding: 5px;\n  cursor: default; }\n\n.moreBtn li:hover {\n  background-color: #E5E5E5;\n  color: #ff5f00; }\n\n.btn-primary.active, .btn-primary:active, .open > .dropdown-toggle.btn-primary {\n  color: #333;\n  background-color: #E7E7E8;\n  border-color: #E7E7E8;\n  box-shadow: none !important; }\n\n.customer-right table {\n  float: right;\n  width: auto; }\n\n@media (max-width: 768px) {\n  .custumerRightWrap h4.mb-1.pdR2 {\n    margin-bottom: 0; }\n  tr:last-child td.pos-rel.WordWrap.customerName.cursor-pointer, tr:last-child td.pos-rel.WordWrap.customerName.vendorCustomerName.cursor-pointer {\n    border-bottom: none !important; }\n  .table-responsive {\n    border: none !important; }\n  .aging-table .table-checkbox {\n    top: 5px; }\n  .p-modal-tolltip {\n    left: auto !important;\n    right: -24px !important; }\n  .pos-rel.WordWrap .icon-dots-three-vertical {\n    transform: rotate(0deg); }\n  .onDesktopView.btn-group {\n    display: none; }\n  .custumerRightWrap {\n    padding-right: 0;\n    position: fixed;\n    bottom: 0;\n    width: 100%;\n    background: #fff;\n    padding: 10px 5px;\n    z-index: 1; }\n  td.pos-rel.WordWrap.customerName.cursor-pointer, td.pos-rel.WordWrap.customerName.vendorCustomerName.cursor-pointer {\n    max-width: 100%;\n    white-space: inherit;\n    line-height: 1.5; }\n  .pos-rel.WordWrap.vendorCustomerName .icon-dots-three-vertical {\n    position: relative;\n    top: -5px;\n    line-height: 1 !important; }\n  .aging-table tr:hover .vendorCustomerName .table-checkbox {\n    top: 5px; } }\n\n@media (max-width: 767px) {\n  .btn-group.plus-btn {\n    float: none;\n    width: 100%; }\n  .btn-group.plus-btn button {\n    width: 100%; }\n  .customer-footer-box {\n    padding-bottom: 10px;\n    float: right !important; }\n  .header-left .form-group {\n    vertical-align: bottom !important;\n    margin-bottom: 5px; }\n  .customer-footer-box {\n    padding-top: 0; } }\n\n@media (max-width: 575px) {\n  .customer-footer-box {\n    padding-bottom: 10px;\n    float: none !important; }\n  .custumerRightWrap h4.mb-1.pdR2 {\n    margin-bottom: 10px; }\n  .customer-right {\n    background: #fff;\n    padding: 0 15px;\n    float: left;\n    width: 100%; }\n  .customer-right table {\n    width: 100%; }\n  .customer-right table tr td {\n    padding: 15px;\n    color: #707070;\n    width: 100%;\n    display: table;\n    text-align: left;\n    margin-bottom: 5px; }\n  .customer-right table tr td p {\n    font-size: 14px;\n    margin-bottom: 2px;\n    float: left;\n    width: 110px; }\n  .customer-right table tr td h3 {\n    font-size: 14px;\n    padding-bottom: 7px; }\n  .custumerRightWrap h4 {\n    text-align: left !important;\n    padding-left: 15px; }\n  .customer-footer-box {\n    padding-top: 10px; }\n  .pos-rel.WordWrap .icon-dots-three-vertical {\n    display: block; }\n  .top-aging-table-top {\n    padding: 3px !important;\n    font-size: 14px; } }\n\n@media (max-width: 414px) {\n  .top-aging-table-top {\n    padding: 0;\n    font-size: 14px; } }\n\n@media (min-width: 768px) {\n  .onMobileView.btn-group {\n    display: none; }\n  .onDesktopView.btn-group {\n    display: block; } }\n\n.td_in_searchBox div {\n  display: flex; }\n\n.td_in_searchBox div span {\n  flex: 1 1 auto;\n  padding-left: 8px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox .input-container {\n  position: relative; }\n\n.td_in_searchBox .input-container input {\n  min-height: 38px;\n  width: 100%;\n  padding: 8px;\n  padding-right: 40px;\n  border: 0px; }\n\n.td_in_searchBox .input-container i {\n  position: absolute;\n  right: 0px;\n  top: 9px; }\n"

/***/ }),

/***/ "./src/app/contact/contact.component.ts":
/*!**********************************************!*\
  !*** ./src/app/contact/contact.component.ts ***!
  \**********************************************/
/*! exports provided: ContactComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactComponent", function() { return ContactComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_dashboard_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/dashboard.service */ "./src/app/services/dashboard.service.ts");
/* harmony import */ var _services_contact_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../services/contact.service */ "./src/app/services/contact.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../models/api-models/SettingsIntegraion */ "./src/app/models/api-models/SettingsIntegraion.ts");
/* harmony import */ var _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../actions/settings/settings.integration.action */ "./src/app/actions/settings/settings.integration.action.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../models/api-models/Contact */ "./src/app/models/api-models/Contact.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/cdk/layout */ "../../node_modules/@angular/cdk/esm5/layout.es5.js");


























var CustomerType = [
    { label: 'Customer', value: 'customer' },
    { label: 'Vendor', value: 'vendor' }
];
var ContactComponent = /** @class */ (function () {
    function ContactComponent(store, _toasty, router, _companyServices, _toaster, _dashboardService, _contactService, settingsIntegrationActions, _companyActions, componentFactoryResolver, _groupWithAccountsAction, _cdRef, _generalService, _route, _generalAction, _router, _breakPointObservar) {
        var _this = this;
        this.store = store;
        this._toasty = _toasty;
        this.router = router;
        this._companyServices = _companyServices;
        this._toaster = _toaster;
        this._dashboardService = _dashboardService;
        this._contactService = _contactService;
        this.settingsIntegrationActions = settingsIntegrationActions;
        this._companyActions = _companyActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this._groupWithAccountsAction = _groupWithAccountsAction;
        this._cdRef = _cdRef;
        this._generalService = _generalService;
        this._route = _route;
        this._generalAction = _generalAction;
        this._router = _router;
        this._breakPointObservar = _breakPointObservar;
        this.flattenAccounts = [];
        this.sundryDebtorsAccountsBackup = {};
        this.sundryDebtorsAccountsForAgingReport = [];
        this.sundryDebtorsAccounts = [];
        this.sundryCreditorsAccountsBackup = {};
        this.sundryCreditorsAccounts = [];
        this.activeTab = '';
        this.accountAsideMenuState = 'out';
        this.paymentAsideMenuState = 'out';
        this.selectedGroupForCreateAcc = 'sundrydebtors';
        this.payoutObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_13__["CashfreeClass"]();
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_19__;
        this.selectAllVendor = false;
        this.selectAllCustomer = false;
        this.selectedCheckedContacts = [];
        this.selectedAllContacts = [];
        this.allSelectionModel = false;
        this.LOCAL_STORAGE_KEY_FOR_TABLE_COLUMN = 'showTableColumn';
        this.localStorageKeysForFilters = { customer: 'customerFilterStorage', vendor: 'vendorFilterStorage' };
        this.isMobileScreen = false;
        this.modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: 'static',
            ignoreBackdropClick: true
        };
        this.isICICIIntegrated = false;
        // public modalUniqueName: string;
        // public showAsideOverlay = true;
        // sorting
        this.key = 'name'; // set default
        this.order = 'asc';
        this.showFieldFilter = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["CustomerVendorFiledFilter"]();
        this.updateCommentIdx = null;
        this.searchStr$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.searchStr = '';
        this.messageBody = {
            header: {
                email: 'Send Email',
                sms: 'Send Sms',
                set: ''
            },
            btn: {
                email: 'Send Email',
                sms: 'Send Sms',
                set: '',
            },
            type: '',
            msg: '',
            subject: ''
        };
        this.dataVariables = [
            {
                name: 'Opening Balance',
                value: '%s_OB',
            },
            {
                name: 'Closing Balance',
                value: '%s_CB',
            },
            {
                name: 'Credit Total',
                value: '%s_CT',
            },
            {
                name: 'Debit Total',
                value: '%s_DT',
            },
            {
                name: 'From Date',
                value: '%s_FD',
            },
            {
                name: 'To Date',
                value: '%s_TD',
            },
            {
                name: 'Magic Link',
                value: '%s_ML',
            },
            {
                name: 'Account Name',
                value: '%s_AN',
            },
        ];
        this.isAllChecked = false;
        this.selectedItems = [];
        this.totalSales = 0;
        this.totalDue = 0;
        this.totalReceipts = 0;
        this.Totalcontacts = 0;
        this.isUpdateAccount = false;
        this.isAdvanceSearchApplied = false;
        this.advanceSearchRequestModal = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["ContactAdvanceSearchModal"]();
        this.commonRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["ContactAdvanceSearchCommonModal"]();
        this.tableColsPan = 3;
        this.checkboxInfo = {
            selectedPage: 1
        };
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        this.searchLoader$ = this.store.select(function (p) { return p.search.searchLoader; });
        this.dueAmountReportRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["DueAmountReportQueryRequest"]();
        this.createAccountIsSuccess$ = this.store.select(function (s) { return s.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$));
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$));
        // this.flattenAccountsStream$ = this.store.pipe(select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {
        //   return s;
        // }), (takeUntil(this.destroyed$))));
        this.store.select(function (p) { return p.company.dateRangePickerConfig; }).pipe().subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = a;
            }
        });
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions.startDate = a[0];
                _this.datePickerOptions.endDate = a[1];
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(a[0]).format('DD-MM-YYYY');
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(a[1]).format('DD-MM-YYYY');
                //  this.getAccounts(this.fromDate, this.toDate,this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
            }
        });
        if (this.datePickerOptions) {
            this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(this.datePickerOptions.startDate).format('DD-MM-YYYY');
            this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(this.datePickerOptions.endDate).format('DD-MM-YYYY');
        }
        this.flattenAccountsStream$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["select"])(function (s) { return s.general.flattenAccounts; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$));
        this.store.select(function (s) { return s.agingreport.data; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data && data.results) {
                _this.dueAmountReportRequest.page = data.page;
                _this.loadPaginationComponent(data);
            }
            _this.dueAmountReportData$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(data);
        });
        this.store.dispatch(this._companyActions.getAllRegistrations());
    }
    ContactComponent.prototype.sort = function (key, ord) {
        if (ord === void 0) { ord = 'asc'; }
        this.key = key;
        this.order = ord;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'false', 20, this.searchStr, key, ord);
    };
    ContactComponent.prototype.ngOnInit = function () {
        var _this = this;
        // localStorage supported
        if (window.localStorage) {
            var showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
            if (showColumnObj) {
                this.showFieldFilter = showColumnObj;
                this.setTableColspan();
            }
        }
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_22__["createSelector"])([function (states) { return states.session.applicationDate; }], function (dateObj) {
            if (dateObj) {
                var universalDate = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](dateObj);
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: moment_moment__WEBPACK_IMPORTED_MODULE_19__(universalDate[0], 'DD-MM-YYYY').toDate(), endDate: moment_moment__WEBPACK_IMPORTED_MODULE_19__(universalDate[1], 'DD-MM-YYYY').toDate() });
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(universalDate[0]).format('DD-MM-YYYY');
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(universalDate[1]).format('DD-MM-YYYY');
                _this.getAccounts(_this.fromDate, _this.toDate, _this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, _this.searchStr);
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe();
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe(function (yes) {
            if (yes) {
                if (_this.accountAsideMenuState === 'in') {
                    _this.toggleAccountAsidePane();
                    _this.getAccounts(_this.fromDate, _this.toDate, _this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, _this.searchStr);
                }
            }
        });
        this.getCashFreeBalance();
        this.flattenAccountsStream$.subscribe(function (data) {
            if (data) {
                var accounts_1 = [];
                var bankAccounts_1 = [];
                lodash__WEBPACK_IMPORTED_MODULE_15__["forEach"](data, function (item) {
                    accounts_1.push({ label: item.name, value: item.uniqueName });
                    var findBankIndx = item.parentGroups.findIndex(function (grp) { return grp.uniqueName === 'bankaccounts'; });
                    if (findBankIndx !== -1) {
                        bankAccounts_1.push({ label: item.name, value: item.uniqueName });
                    }
                });
                _this.bankAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(accounts_1);
            }
        });
        this.searchStr$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(1000), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])())
            .subscribe(function (term) {
            _this.searchStr = term;
            if (_this.activeTab === 'customer') {
                _this.getAccounts(_this.fromDate, _this.toDate, 'sundrydebtors', null, null, 'true', 20, term, _this.key, _this.order);
            }
            else {
                _this.getAccounts(_this.fromDate, _this.toDate, 'sundrycreditors', null, null, 'true', 20, term, _this.key, _this.order);
            }
        });
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(function (result) {
            _this.isMobileScreen = result.matches;
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([this._route.params, this._route.queryParams])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) {
            var params = result[0];
            var queryParams = result[1];
            if (params) {
                if (params['type'] === 'customer') {
                    _this.setActiveTab(params['type'], 'sundrydebtors');
                }
                else if (params['type'] === 'vendor') {
                    _this.setActiveTab(params['type'], 'sundrycreditors');
                }
                else {
                    _this.setActiveTab('aging-report', '');
                }
                if (queryParams && queryParams.tab) {
                }
            }
        });
        // this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
        //   if (val && val.tab && val.tabIndex) {
        //     let tabIndex = Number(val.tabIndex);
        //     if (this.staticTabs && this.staticTabs.tabs) {
        //       if (val.tab === 'aging-report' && tabIndex === 1) {
        //         this.setActiveTab('aging-report', '');
        //         this.staticTabs.tabs[tabIndex].active = true;
        //       } else if (val.tab === 'vendor' && tabIndex === 0) {
        //         this.setActiveTab('vendor', 'sundrycreditors');
        //         this.staticTabs.tabs[tabIndex].active = true;
        //       } else {
        //         this.setActiveTab('customer', 'sundrydebtors');
        //         this.staticTabs.tabs[0].active = true;
        //       }
        //     }
        //   }
        // });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["select"])(function (p) { return p.company.isAccountInfoLoading; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) {
            //ToDo logic to stop loader
            // if (result && this.taxAsideMenuState === 'in') {
            //   this.toggleTaxAsidePane();
            // }
        });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["select"])(function (p) { return p.company.account; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$))
            .subscribe(function (res) {
            if (res && Array.isArray(res)) {
                _this.isICICIIntegrated = res.length > 0;
            }
            else {
                _this.isICICIIntegrated = false;
            }
        });
    };
    ContactComponent.prototype.ngOnChanges = function (changes) {
    };
    ContactComponent.prototype.performActions = function (type, account, event) {
        this.selectedCheckedContacts = [];
        this.selectedCheckedContacts.push(account.uniqueName);
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(account.name));
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
                break;
            case 1: // go to ledger
                this.goToRoute('ledger', "/" + this.fromDate + "/" + this.toDate, account.uniqueName);
                break;
            case 2: // go to sales or purchase
                this.purchaseOrSales = this.activeTab === 'customer' ? 'sales' : 'purchase';
                if (this.purchaseOrSales === 'purchase') {
                    this.goToRoute('proforma-invoice/invoice/purchase', '', account.uniqueName);
                }
                else {
                    var isCashInvoice = account.uniqueName === 'cash';
                    this.goToRoute("proforma-invoice/invoice/" + (isCashInvoice ? 'cash' : 'sales'), '', account.uniqueName);
                }
                break;
            case 3: // send sms
                if (event) {
                    event.stopPropagation();
                }
                this.openSmsDialog();
                break;
            case 4: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openEmailDialog();
                break;
            default:
                break;
        }
    };
    ContactComponent.prototype.goToRoute = function (part, additionalParams, accUniqueName) {
        if (additionalParams === void 0) { additionalParams = ''; }
        var url = location.href + ("?returnUrl=" + part + "/" + accUniqueName);
        if (additionalParams) {
            url = "" + url + additionalParams;
        }
        if (false) { var ipcRenderer; }
        else {
            window.open(url);
        }
    };
    // public openUpdatemodel(account: any) {
    //   console.log(' open', this.fromDate, this.toDate);
    //   this.modalUniqueName = account.uniqueName;
    // }
    // public closeModel(account: any) {
    //     this.modalUniqueName = '';
    // }
    ContactComponent.prototype.tabSelected = function (tabName) {
        this.searchStr = '';
        this.selectedCheckedContacts = [];
        if (tabName !== this.activeTab) {
            this.activeTab = tabName;
            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
            this.store.dispatch(this._generalAction.setAppTitle("/pages/contact/" + tabName));
            if (this.activeTab !== 'aging-report') {
                this.setStateDetails(this.activeTab + "?tab=" + this.activeTab + "&tabIndex=0");
            }
            else {
                this.setStateDetails(this.activeTab + "?tab=" + this.activeTab + "&tabIndex=1");
            }
            this.router.navigate(['pages/contact/', tabName], { replaceUrl: true });
        }
    };
    ContactComponent.prototype.setActiveTab = function (tabName, type) {
        this.tabSelected(tabName);
        this.searchStr = '';
        if (tabName === 'vendor') {
            this.getAccounts(this.fromDate, this.toDate, type, null, null, 'true', 20, '');
        }
        this.showFieldFilter = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["CustomerVendorFiledFilter"]();
        var showColumnObj = JSON.parse(localStorage.getItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer']));
        if (showColumnObj) {
            this.showFieldFilter = showColumnObj;
            this.setTableColspan();
        }
        // if (this.activeTab !== 'aging-report') {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
        // } else {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
        // }
    };
    ContactComponent.prototype.ngOnDestroy = function () {
        // if (this.activeTab !== 'aging-report') {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=0`);
        // } else {
        //   this.setStateDetails(`${this.activeTab}?tab=${this.activeTab}&tabIndex=1`);
        // }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    ContactComponent.prototype.detectChanges = function () {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    };
    ContactComponent.prototype.updateCustomerAcc = function (openFor, account) {
        this.activeAccountDetails = account;
        this.isUpdateAccount = true;
        this.selectedGroupForCreateAcc = account ? account.groupUniqueName : openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.toggleAccountAsidePane();
    };
    ContactComponent.prototype.openAddAndManage = function (openFor) {
        this.isUpdateAccount = false;
        this.selectedGroupForCreateAcc = openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.toggleAccountAsidePane();
    };
    ContactComponent.prototype.openPaymentAside = function (acc) {
        this.selectedAccForPayment = acc;
        this.togglePaymentPane();
    };
    ContactComponent.prototype.toggleAccountAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    ContactComponent.prototype.togglePaymentPane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.paymentAsideMenuState = this.paymentAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    ContactComponent.prototype.getUpdatedList = function (grpName) {
        var _this = this;
        setTimeout(function () {
            if (grpName) {
                if (_this.accountAsideMenuState === 'in') {
                    _this.toggleAccountAsidePane();
                    _this.getAccounts(_this.fromDate, _this.toDate, _this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
                }
            }
        }, 1000);
    };
    ContactComponent.prototype.toggleBodyClass = function () {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    ContactComponent.prototype.payNow = function (acc) {
        this.selectedAccForPayment = acc;
        this.payNowModal.show();
    };
    ContactComponent.prototype.onPaymentModalCancel = function () {
        this.payNowModal.hide();
    };
    ContactComponent.prototype.onConfirmation = function (amountToPay) {
        var _this = this;
        var payNowData = {
            accountUniqueName: this.selectedAccForPayment.uniqueName,
            amount: Number(amountToPay),
            description: ''
        };
        this._contactService.payNow(payNowData).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.successToast('Payment done successfully with reference id: ' + res.body.referenceId);
            }
            else {
                _this._toasty.errorToast(res.message, res.code);
            }
        });
    };
    ContactComponent.prototype.selectCashfreeAccount = function (event, objToApnd) {
        var accObj = {
            name: event.label,
            uniqueName: event.value
        };
        objToApnd.account = accObj;
    };
    ContactComponent.prototype.submitCashfreeDetail = function (f) {
        if (f && f.userName && f.password) {
            var objToSend = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        }
        else {
            this._toasty.errorToast('Please enter Cashfree details.', 'Validation');
            return;
        }
    };
    ContactComponent.prototype.pageChanged = function (event) {
        var selectedGrp = this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
        this.selectedCheckedContacts = [];
        this.getAccounts(this.fromDate, this.toDate, selectedGrp, event.page, 'pagination', 'true', 20, this.searchStr, this.key, this.order);
    };
    ContactComponent.prototype.hideListItems = function () {
        this.filterDropDownList.hide();
    };
    /**
     * updateComment
     */
    ContactComponent.prototype.updateComment = function (account) {
        if (account.comment) {
            var canUpdate = this.canUpdateComment(account.uniqueName, account.comment);
            if (canUpdate) {
                this.addComment(account);
            }
            else {
                this.updateCommentIdx = null;
            }
        }
        else {
            var canDelete = this.canDeleteComment(account.uniqueName);
            if (canDelete) {
                this.deleteComment(account.uniqueName);
            }
            else {
                this.updateCommentIdx = null;
            }
        }
    };
    /**
     * deleteComment
     */
    ContactComponent.prototype.deleteComment = function (accountUniqueName) {
        var _this = this;
        setTimeout(function () {
            _this._contactService.deleteComment(accountUniqueName).subscribe(function (res) {
                if (res.status === 'success') {
                    _this.updateCommentIdx = null;
                }
            });
        }, 500);
    };
    /**
     * canDeleteComment
     */
    ContactComponent.prototype.canDeleteComment = function (accountUniqueName) {
        var account;
        if (this.activeTab === 'customer') {
            account = lodash__WEBPACK_IMPORTED_MODULE_15__["find"](this.sundryDebtorsAccountsBackup.results, function (o) {
                return o.uniqueName === accountUniqueName;
            });
        }
        else {
            account = lodash__WEBPACK_IMPORTED_MODULE_15__["find"](this.sundryCreditorsAccountsBackup.results, function (o) {
                return o.uniqueName === accountUniqueName;
            });
        }
        if (account.comment) {
            account.comment = '';
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * canDeleteComment
     */
    ContactComponent.prototype.canUpdateComment = function (accountUniqueName, comment) {
        var account;
        if (this.activeTab === 'customer') {
            account = lodash__WEBPACK_IMPORTED_MODULE_15__["find"](this.sundryDebtorsAccountsBackup.results, function (o) {
                return o.uniqueName === accountUniqueName;
            });
        }
        else {
            account = lodash__WEBPACK_IMPORTED_MODULE_15__["find"](this.sundryCreditorsAccountsBackup.results, function (o) {
                return o.uniqueName === accountUniqueName;
            });
        }
        if (account.comment !== comment) {
            account.comment = comment;
            return true;
        }
        else {
            return false;
        }
    };
    ContactComponent.prototype.addComment = function (account) {
        var _this = this;
        setTimeout(function () {
            _this._contactService.addComment(account.comment, account.uniqueName).subscribe(function (res) {
                if (res.status === 'success') {
                    _this.updateCommentIdx = null;
                    account.comment = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](res.body.description);
                    _this.updateInList(account.uniqueName, account.comment);
                }
            });
        }, 500);
    };
    // Add Selected Value to Message Body
    ContactComponent.prototype.addValueToMsg = function (val) {
        this.typeInTextarea(val.value);
        // this.messageBody.msg += ` ${val.value} `;
    };
    ContactComponent.prototype.typeInTextarea = function (newText) {
        var el = this.messageBox.nativeElement;
        var start = el.selectionStart;
        var end = el.selectionEnd;
        var text = el.value;
        var before = text.substring(0, start);
        var after = text.substring(end, text.length);
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + newText.length;
        el.focus();
        this.messageBody.msg = el.value;
    };
    // Open Modal for Email
    ContactComponent.prototype.openEmailDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    };
    // Open Modal for SMS
    ContactComponent.prototype.openSmsDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    };
    // Send Email/Sms for Accounts
    ContactComponent.prototype.send = function (groupsUniqueName) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var request, temp;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                request = {
                    data: {
                        subject: this.messageBody.subject,
                        message: this.messageBody.msg,
                        accounts: lodash__WEBPACK_IMPORTED_MODULE_15__["uniq"](this.selectedCheckedContacts),
                    },
                    params: {
                        from: this.fromDate,
                        to: this.toDate,
                        groupUniqueName: groupsUniqueName
                    }
                };
                // uncomment it
                // request.data = Object.assign({} , request.data, this.formattedQuery);
                if (this.messageBody.btn.set === 'Send Email') {
                    return [2 /*return*/, this._companyServices.sendEmail(request)
                            .subscribe(function (r) {
                            r.status === 'success' ? _this._toaster.successToast(r.body) : _this._toaster.errorToast(r.message);
                            _this.checkboxInfo = {
                                selectedPage: 1
                            };
                            _this.selectedItems = [];
                            _this.isAllChecked = false;
                        })];
                }
                else if (this.messageBody.btn.set === 'Send Sms') {
                    temp = request;
                    delete temp.data['subject'];
                    return [2 /*return*/, this._companyServices.sendSms(temp)
                            .subscribe(function (r) {
                            r.status === 'success' ? _this._toaster.successToast(r.body) : _this._toaster.errorToast(r.message);
                            _this.checkboxInfo = {
                                selectedPage: 1
                            };
                            _this.selectedItems = [];
                            _this.isAllChecked = false;
                        })];
                }
                this.mailModal.hide();
                return [2 /*return*/];
            });
        });
    };
    /**
     * updateInList
     */
    ContactComponent.prototype.updateInList = function (accountUniqueName, comment) {
        if (this.activeTab === 'customer') {
            //
        }
    };
    ContactComponent.prototype.pageChangedDueReport = function (event) {
        this.dueAmountReportRequest.page = event.page;
    };
    ContactComponent.prototype.loadPaginationComponent = function (s) {
        var _this = this;
        var transactionData = null;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["PaginationComponent"]);
        if (this.paginationChild && this.paginationChild.viewContainerRef) {
            var viewContainerRef = this.paginationChild.viewContainerRef;
            viewContainerRef.remove();
            var componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
            viewContainerRef.insert(componentInstanceView.hostView);
            var componentInstance = componentInstanceView.instance;
            componentInstance.totalItems = s.count * s.totalPages;
            componentInstance.itemsPerPage = s.count;
            componentInstance.maxSize = 5;
            componentInstance.writeValue(s.page);
            componentInstance.boundaryLinks = true;
            componentInstance.pageChanged.subscribe(function (e) {
                _this.pageChangedDueReport(e);
            });
        }
    };
    ContactComponent.prototype.selectedDate = function (value) {
        this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(value.picker.startDate).format('DD-MM-YYYY');
        this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_19__(value.picker.endDate).format('DD-MM-YYYY');
        if (value.event.type === 'hide') {
            this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, this.searchStr);
            this.detectChanges();
        }
    };
    ContactComponent.prototype.toggleAllSelection = function (action) {
        if (action) {
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(function (m) {
                    m.isSelected = action;
                    return m;
                });
                this.selectedCheckedContacts = this.sundryDebtorsAccounts.map(function (m) { return m.uniqueName; });
            }
            else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(function (m) {
                    m.isSelected = action;
                    return m;
                });
                this.selectedCheckedContacts = this.sundryCreditorsAccounts.map(function (m) { return m.uniqueName; });
            }
        }
        else {
            this.selectedCheckedContacts = [];
            if (this.activeTab === 'customer') {
                this.sundryDebtorsAccounts = this.sundryDebtorsAccounts.map(function (m) {
                    m.isSelected = action;
                    return m;
                });
            }
            else {
                this.sundryCreditorsAccounts = this.sundryCreditorsAccounts.map(function (m) {
                    m.isSelected = action;
                    return m;
                });
            }
        }
    };
    ContactComponent.prototype.toggleAdvanceSearchPopup = function () {
        this.advanceSearch.toggle();
    };
    ContactComponent.prototype.selectAccount = function (ev, uniqueName) {
        // this.selectedcus = true;
        if (ev.target.checked) {
            this.selectedCheckedContacts.push(uniqueName);
            // this.selectCustomer = true;
        }
        else {
            // this.selectCustomer = false;
            var itemIndx = this.selectedCheckedContacts.findIndex(function (item) { return item === uniqueName; });
            this.selectedCheckedContacts.splice(itemIndx, 1);
            if (this.selectedCheckedContacts.length === 0) {
                this.selectAllCustomer = false;
                this.selectAllVendor = false;
                this.selectedWhileHovering = '';
            }
            // this.lc.selectedTxnUniqueName = null;
            // this.store.dispatch(this._ledgerActions.DeSelectGivenEntries([uniqueName]));
        }
    };
    ContactComponent.prototype.resetAdvanceSearch = function () {
        this.advanceSearchRequestModal = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["ContactAdvanceSearchModal"]();
        this.commonRequest = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["ContactAdvanceSearchCommonModal"]();
        this.isAdvanceSearchApplied = false;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
    };
    ContactComponent.prototype.applyAdvanceSearch = function (request) {
        this.commonRequest = request;
        this.advanceSearchRequestModal = new _models_api_models_Contact__WEBPACK_IMPORTED_MODULE_16__["ContactAdvanceSearchModal"]();
        var category = request.category;
        if (category === 'openingBalance') {
            this.advanceSearchRequestModal.openingBalanceType = 'debit'; // default
            this.advanceSearchRequestModal.openingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        }
        else if (category === 'closingBalance') {
            this.advanceSearchRequestModal.closingBalanceType = 'debit'; // default
            this.advanceSearchRequestModal.closingBalance = request.amount;
            this.setAmountType(category, request.amountType);
        }
        else if (category === 'sales') {
            this.advanceSearchRequestModal.debitTotal = request.amount;
            category = 'debitTotal';
            this.setAmountType(category, request.amountType);
        }
        else if (category === 'receipt') {
            category = 'creditTotal';
            this.advanceSearchRequestModal.creditTotal = request.amount;
            this.setAmountType(category, request.amountType);
        }
        else {
        }
        switch (request.amountType) {
            case 'GreaterThan':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = true;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'LessThan':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = true;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'Equals':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = true;
                this.advanceSearchRequestModal[category + 'NotEqual'] = false;
                break;
            case 'Exclude':
                this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
                this.advanceSearchRequestModal[category + 'LessThan'] = false;
                this.advanceSearchRequestModal[category + 'Equal'] = false;
                this.advanceSearchRequestModal[category + 'NotEqual'] = true;
                break;
        }
        console.log('advanceSearchRequestModal', this.advanceSearchRequestModal);
        this.isAdvanceSearchApplied = true;
        this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
    };
    ContactComponent.prototype.setAmountType = function (category, amountType) {
        this.advanceSearchRequestModal[category + 'GreaterThan'] = false;
        this.advanceSearchRequestModal[category + 'LessThan'] = false;
        this.advanceSearchRequestModal[category + 'Equal'] = false;
        this.advanceSearchRequestModal[category + 'NotEqual'] = false;
    };
    // Save CSV File with data from Table...
    ContactComponent.prototype.downloadCSV = function () {
        var _this = this;
        if (this.activeTab === 'customer') {
            this.groupUniqueName = 'sundrydebtors';
        }
        else {
            this.groupUniqueName = 'sundrycreditors';
        }
        var request = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: this.selectedCheckedContacts,
            },
            params: {
                from: this.fromDate,
                to: this.toDate,
                groupUniqueName: this.groupUniqueName
            }
        };
        this._companyServices.downloadCSV(request).subscribe(function (res) {
            _this.searchLoader$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(false);
            if (res.status === 'success') {
                var blobData = _this.base64ToBlob(res.body, 'text/csv', 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_20__["saveAs"])(blobData, _this.groupUniqueName + ".csv");
            }
        });
    };
    ContactComponent.prototype.base64ToBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        var offset = 0;
        while (offset < byteCharacters.length) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            var i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    };
    ContactComponent.prototype.getAccounts = function (fromDate, toDate, groupUniqueName, pageNumber, requestedFrom, refresh, count, query, sortBy, order) {
        var _this = this;
        if (count === void 0) { count = 20; }
        if (sortBy === void 0) { sortBy = ''; }
        if (order === void 0) { order = 'asc'; }
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';
        this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order, this.advanceSearchRequestModal).subscribe(function (res) {
            if (res.status === 'success') {
                _this.totalDue = res.body.closingBalance.amount || 0;
                _this.totalSales = (_this.activeTab === 'customer' ? res.body.creditTotal : res.body.debitTotal) || 0;
                _this.totalReceipts = (_this.activeTab === 'customer' ? res.body.debitTotal : res.body.creditTotal) || 0;
                _this.selectedAllContacts = [];
                _this.Totalcontacts = 0;
                for (var _i = 0, _a = res.body.results; _i < _a.length; _i++) {
                    var resp = _a[_i];
                    _this.selectedAllContacts.push(resp.uniqueName);
                }
                if (groupUniqueName === 'sundrydebtors') {
                    _this.sundryDebtorsAccountsBackup = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](res.body);
                    _this.Totalcontacts = res.body.totalItems;
                    lodash__WEBPACK_IMPORTED_MODULE_15__["map"](res.body.results, function (obj) {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    _this.sundryDebtorsAccounts = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](res.body.results);
                    //  console.log('res.body.results', res.body.results);
                }
                else {
                    _this.Totalcontacts = res.body.totalItems;
                    _this.sundryCreditorsAccountsBackup = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](res.body);
                    lodash__WEBPACK_IMPORTED_MODULE_15__["map"](res.body.results, function (obj) {
                        obj.closingBalanceAmount = obj.closingBalance.amount;
                        obj.openingBalanceAmount = obj.openingBalance.amount;
                        if (obj && obj.state) {
                            obj.stateName = obj.state.name;
                        }
                    });
                    _this.sundryCreditorsAccounts = lodash__WEBPACK_IMPORTED_MODULE_15__["cloneDeep"](res.body.results);
                }
                _this.detectChanges();
            }
        });
    };
    ContactComponent.prototype.editCustomerPosition = function (ev) {
        var offset = $('#edit-model-basic').position();
        if (offset) {
            var exactPositionTop = offset.top;
            var exactPositionLeft = offset.left;
            $('#edit-model-basic').css('top', exactPositionTop);
        }
    };
    ContactComponent.prototype.columnFilter = function (event, column) {
        // if (event && column) {
        this.showFieldFilter[column] = event;
        this.setTableColspan();
        if (window.localStorage) {
            localStorage.setItem(this.localStorageKeysForFilters[this.activeTab === 'vendor' ? 'vendor' : 'customer'], JSON.stringify(this.showFieldFilter));
        }
        // }
    };
    ContactComponent.prototype.getCashFreeBalance = function () {
        var _this = this;
        this._contactService.GetCashFreeBalance().subscribe(function (res) {
            if (res.status === 'success') {
                _this.cashFreeAvailableBalance = res.body.availableBalance;
            }
        });
    };
    ContactComponent.prototype.setTableColspan = function () {
        var _this = this;
        var balancesColsArr = ['openingBalance'];
        var length = Object.keys(this.showFieldFilter).filter(function (f) { return _this.showFieldFilter[f]; }).filter(function (f) { return balancesColsArr.includes(f); }).length;
        this.tableColsPan = length > 0 ? 4 : 3;
    };
    /*
    * Register Account navigation
    * */
    ContactComponent.prototype.registerAccount = function () {
        this.router.navigate(['settings'], { queryParams: { tab: 'integration', tabIndex: 1, subTab: 4 } });
    };
    ContactComponent.prototype.setStateDetails = function (url) {
        // save last state with active tab
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = "contact/" + url;
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('payNowModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["ModalDirective"])
    ], ContactComponent.prototype, "payNowModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('filterDropDownList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["BsDropdownDirective"])
    ], ContactComponent.prototype, "filterDropDownList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('paginationChild'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_17__["ElementViewContainerRef"])
    ], ContactComponent.prototype, "paginationChild", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('staticTabs'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["TabsetComponent"])
    ], ContactComponent.prototype, "staticTabs", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('mailModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["ModalDirective"])
    ], ContactComponent.prototype, "mailModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('messageBox'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], ContactComponent.prototype, "messageBox", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('advanceSearch'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["ModalDirective"])
    ], ContactComponent.prototype, "advanceSearch", void 0);
    ContactComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'contact-detail',
            template: __webpack_require__(/*! ./contact.component.html */ "./src/app/contact/contact.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_18__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./contact.component.scss */ "./src/app/contact/contact.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__["ToasterService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"],
            _services_companyService_service__WEBPACK_IMPORTED_MODULE_1__["CompanyService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__["ToasterService"],
            _services_dashboard_service__WEBPACK_IMPORTED_MODULE_10__["DashboardService"],
            _services_contact_service__WEBPACK_IMPORTED_MODULE_11__["ContactService"],
            _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_14__["SettingsIntegrationActions"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_8__["CompanyActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ComponentFactoryResolver"],
            _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_21__["GroupWithAccountsAction"],
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"], _services_general_service__WEBPACK_IMPORTED_MODULE_24__["GeneralService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"], _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_23__["GeneralActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"], _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_25__["BreakpointObserver"]])
    ], ContactComponent);
    return ContactComponent;
}());



/***/ }),

/***/ "./src/app/contact/contact.module.ts":
/*!*******************************************!*\
  !*** ./src/app/contact/contact.module.ts ***!
  \*******************************************/
/*! exports provided: ContactModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactModule", function() { return ContactModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/helpers/pipes/currencyPipe/currencyType.module */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/tabs */ "../../node_modules/ngx-bootstrap/tabs/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "../../node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var _contact_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./contact.component */ "./src/app/contact/contact.component.ts");
/* harmony import */ var _contact_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./contact.routing.module */ "./src/app/contact/contact.routing.module.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _aside_menu_account_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./aside-menu-account/aside.menu.account.component */ "./src/app/contact/aside-menu-account/aside.menu.account.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../shared/helpers/directives/digitsOnly/digitsOnly.module */ "./src/app/shared/helpers/directives/digitsOnly/digitsOnly.module.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var ng2_order_pipe__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ng2-order-pipe */ "../../node_modules/ng2-order-pipe/dist/index.js");
/* harmony import */ var ng2_order_pipe__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(ng2_order_pipe__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _shared_helpers_pipes_ghSortByPipe_ghSortByPipe_module__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../shared/helpers/pipes/ghSortByPipe/ghSortByPipe.module */ "./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.module.ts");
/* harmony import */ var _advanceSearch_contactAdvanceSearch_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./advanceSearch/contactAdvanceSearch.component */ "./src/app/contact/advanceSearch/contactAdvanceSearch.component.ts");
/* harmony import */ var _aging_report_aging_report_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./aging-report/aging-report.component */ "./src/app/contact/aging-report/aging-report.component.ts");
/* harmony import */ var _aging_dropdown_aging_dropdown_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./aging-dropdown/aging.dropdown.component */ "./src/app/contact/aging-dropdown/aging.dropdown.component.ts");
/* harmony import */ var _payment_aside_payment_aside_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./payment-aside/payment-aside.component */ "./src/app/contact/payment-aside/payment-aside.component.ts");
/* harmony import */ var _shared_generic_aside_menu_account_generic_aside_menu_account_module__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../shared/generic-aside-menu-account/generic-aside-menu-account.module */ "./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts");























 // importing the module for table column sort


//payemnt aside component
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: false,
    suppressScrollY: true
};
var ContactModule = /** @class */ (function () {
    function ContactModule() {
    }
    ContactModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["NgModule"])({
            declarations: [
                _contact_component__WEBPACK_IMPORTED_MODULE_8__["ContactComponent"],
                _aside_menu_account_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_12__["AsideMenuAccountInContactComponent"],
                _advanceSearch_contactAdvanceSearch_component__WEBPACK_IMPORTED_MODULE_21__["ContactAdvanceSearchComponent"],
                _aging_report_aging_report_component__WEBPACK_IMPORTED_MODULE_22__["AgingReportComponent"],
                _aging_dropdown_aging_dropdown_component__WEBPACK_IMPORTED_MODULE_23__["AgingDropdownComponent"],
                _payment_aside_payment_aside_component__WEBPACK_IMPORTED_MODULE_24__["PaymentAsideComponent"]
            ],
            exports: [
                _aside_menu_account_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_12__["AsideMenuAccountInContactComponent"], _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__["CurrencyModule"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _contact_routing_module__WEBPACK_IMPORTED_MODULE_9__["ContactRoutingModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_6__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_10__["ShSelectModule"],
                ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_5__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["BsDropdownModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["TooltipModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__["SharedModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_14__["SelectModule"].forRoot(),
                ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_5__["TabsModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["PaginationModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_15__["ClickOutsideModule"],
                _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_16__["DigitsOnlyModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_17__["ElementViewChildModule"],
                _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__["CurrencyModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_18__["Daterangepicker"],
                ng2_order_pipe__WEBPACK_IMPORTED_MODULE_19__["Ng2OrderModule"],
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_7__["PerfectScrollbarModule"],
                _shared_helpers_pipes_ghSortByPipe_ghSortByPipe_module__WEBPACK_IMPORTED_MODULE_20__["GhSortByPipeModule"],
                _shared_generic_aside_menu_account_generic_aside_menu_account_module__WEBPACK_IMPORTED_MODULE_25__["GenericAsideMenuAccountModule"],
            ],
            entryComponents: [
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["PaginationComponent"]
            ],
            providers: [
                {
                    provide: ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_7__["PERFECT_SCROLLBAR_CONFIG"],
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                }
            ]
        })
    ], ContactModule);
    return ContactModule;
}());



/***/ }),

/***/ "./src/app/contact/contact.routing.module.ts":
/*!***************************************************!*\
  !*** ./src/app/contact/contact.routing.module.ts ***!
  \***************************************************/
/*! exports provided: ContactRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactRoutingModule", function() { return ContactRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _contact_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact.component */ "./src/app/contact/contact.component.ts");





var ContactRoutingModule = /** @class */ (function () {
    function ContactRoutingModule() {
    }
    ContactRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '',
                        canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]],
                        component: _contact_component__WEBPACK_IMPORTED_MODULE_4__["ContactComponent"],
                        redirectTo: 'customer',
                        pathMatch: 'full'
                    },
                    { path: ':type', component: _contact_component__WEBPACK_IMPORTED_MODULE_4__["ContactComponent"] },
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], ContactRoutingModule);
    return ContactRoutingModule;
}());



/***/ }),

/***/ "./src/app/contact/payment-aside/payment-aside.component.html":
/*!********************************************************************!*\
  !*** ./src/app/contact/payment-aside/payment-aside.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">Payment</h3>\n  </div>\n  <div class=\"aside-body\">\n    <div class=\"creditors_detail\">\n      <p>{{accountDetails?.name}}</p>\n      <div class=\"contactDetails\">\n        <p class=\"contactNo\">\n          {{accountDetails?.mobileNo}}\n        </p>\n        <p>{{accountDetails?.uniqueName}}</p>\n        <p>{{accountDetails?.addresses[0]?.gstNumber}}</p>\n        <div class=\"row mrB1\">\n          <div class=\"col-sm-6 col-xs-12\">\n            <div class=\"form-group\">\n              <label>Account Number</label>\n              <input class=\"form-control\" [value]=\"accountDetails?.accountBankDetails[0]?.bankAccountNo\" type=\"text\"\n                disabled>\n            </div>\n          </div>\n          <div class=\"col-sm-6 col-xs-12\">\n            <div class=\"form-group\">\n              <label>IFSC Code</label>\n              <input class=\"form-control\" [value]=\"accountDetails?.accountBankDetails[0]?.ifsc\" type=\"text\" disabled>\n            </div>\n          </div>\n        </div>\n        <div class=\"row mrB1\">\n          <div class=\"col-sm-6 col-xs-12\">\n            <div class=\"form-group\">\n              <label>Bank Name</label>\n              <input class=\"form-control\" [value]=\"accountDetails?.accountBankDetails[0]?.bankName\" type=\"text\"\n                disabled>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div>\n      <div>\n        <div class=\"accountDetils\">\n          <div class=\"selectMode\">\n            <form #paymentForm=\"ngForm\" autocomplete=\"off\">\n              <div class=\"row mrB2\">\n                <div class=\"col-sm-6 col-xs-12\">\n                  <div class=\"form-group custom-select pos-rel\">\n                    <label>Select Mode<span class=\"text-danger\">*</span></label>\n                    <div dropdown>\n                      <select class=\"form-control\" [disabled]=\"OTPsent\" [(ngModel)]=\"mode\" name=\"mode\" id=\"mode\">\n                        <option *ngFor=\"let account of registeredAccounts\" [ngValue]=\"account\">{{account.bank}}\n                        </option>\n                      </select>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-sm-3 col-xs-12\">\n                  <div class=\"form-group\">\n                    <label>Amount<span class=\"text-danger\">*</span></label>\n                    <input class=\"form-control\" name=\"amount\" [(ngModel)]=\"amount\" type=\"number\">\n                  </div>\n                </div>\n              </div>\n              <div class=\"row mrB2\">\n                <div class=\"form-group\">\n                  <div class=\"col-sm-9 col-xs-12\">\n                    <label>Remark<span class=\"text-danger\">*</span></label>\n                    <textarea rows=\"5\" autocomplete=\"off\" type=\"text\" class=\"form-control\" placeholder=\"Remark\"\n                      [(ngModel)]=\"remarks\" name=\"remarks\"></textarea>\n                  </div>\n                </div>\n              </div>\n              <div class=\"row mrB1\" *ngIf=\"OTPsent\">\n                <div class=\"col-sm-6 col-xs-12\">\n                  <div class=\"form-group\">\n                    <label>Enter OTP</label>\n                    <input class=\"form-control\" name=\"OTP\" [(ngModel)]=\"OTP\" type=\"number\" maxlength=\"4\">\n                  </div>\n                </div>\n\n                <div class=\"col-sm-6 col-xs-12\">\n                  <div class=\"form-group\">\n                    <label> </label>\n                    <div style=\"margin-top: 15px; cursor: pointer\"><a (click)=\"reSendOTP()\">Resend OTP</a></div>\n                  </div>\n                </div>\n\n              </div>\n              <div class=\"row\">\n                <div class=\"col-sm-12\">\n                  <button *ngIf=\"!OTPsent\" class=\"btn btn-success\" [disabled]=\"!mode || amount===0 || remarks === ''\"\n                    (click)=\"sendOTP()\">Send OTP</button>\n                  <button *ngIf=\"OTPsent\" class=\"btn btn-success\" [disabled]=\"!mode || amount===0 || remarks === ''\"\n                    (click)=\"confirmOTP()\">Confirm</button>\n                </div>\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n"

/***/ }),

/***/ "./src/app/contact/payment-aside/payment-aside.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/contact/payment-aside/payment-aside.component.ts ***!
  \******************************************************************/
/*! exports provided: PaymentAsideComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentAsideComponent", function() { return PaymentAsideComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");










var PaymentAsideComponent = /** @class */ (function () {
    function PaymentAsideComponent(store, _companyActions, accountsAction, _companyService, _toaster) {
        var _this = this;
        this.store = store;
        this._companyActions = _companyActions;
        this.accountsAction = accountsAction;
        this._companyService = _companyService;
        this._toaster = _toaster;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        //Default amount value
        this.amount = 0;
        //variable to check whether OTP is sent to show and hide OTP text field
        this.OTPsent = false;
        //Event emitter to close the Aside panel
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.remarks = '';
        this.userDetails$ = this.store.select(function (p) { return p.session.user; });
        this.userDetails$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["take"])(1)).subscribe(function (p) { return _this.user = p; });
        this.activeAccount$ = this.store.select(function (state) { return state.groupwithaccounts.activeAccount; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$));
    }
    PaymentAsideComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.amount = this.selectedAccForPayment.closingBalance.amount;
        // get all registered account
        this.store.dispatch(this._companyActions.getAllRegistrations());
        //get current registered account on the user
        this.store.select(function (p) { return p.company; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.account) {
                _this.registeredAccounts = o.account;
                if (_this.registeredAccounts.length === 1) {
                    _this.mode = _this.registeredAccounts[0];
                }
            }
        });
        //get selecetd vendors account details
        this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedAccForPayment.uniqueName));
        this.activeAccount$.subscribe(function (acc) {
            if (acc && acc.accountBankDetails) {
                _this.accountDetails = acc;
            }
        });
    };
    /*
    * Close Aside panel view
    *
    * */
    PaymentAsideComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    /*
    * API call to send OTP to user
    *
    * */
    PaymentAsideComponent.prototype.sendOTP = function () {
        var _this = this;
        var request = {
            params: {
                urn: this.mode.iciciCorporateDetails.URN
            }
        };
        this._companyService.getOTP(request).subscribe(function (res) {
            if (res.status === 'success') {
                _this.OTPsent = true;
            }
            else {
                _this._toaster.errorToast(res.message);
            }
        });
    };
    /*
    * API call to send OTP to user
    *
    * */
    PaymentAsideComponent.prototype.reSendOTP = function () {
        var _this = this;
        var request = {
            params: {
                urn: this.mode.iciciCorporateDetails.URN
            }
        };
        this._companyService.getOTP(request).subscribe(function (res) {
            if (res.status === 'success') {
                _this.OTPsent = true;
            }
            else {
                _this._toaster.errorToast(res.message);
            }
        });
    };
    /*
    * API call to confirm OTP received by user
    *
    * */
    PaymentAsideComponent.prototype.confirmOTP = function () {
        var _this = this;
        var bankTransferRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_8__["BankTransferRequest"]();
        bankTransferRequest.amount = this.amount;
        bankTransferRequest.otp = this.OTP;
        bankTransferRequest.URN = this.mode.iciciCorporateDetails.URN;
        bankTransferRequest.payeeName = this.user.user.name;
        bankTransferRequest.transferAccountUniqueName = this.accountDetails.uniqueName;
        bankTransferRequest.remarks = this.remarks;
        this._companyService.confirmOTP(bankTransferRequest).subscribe(function (res) {
            if (res.status === 'success') {
                _this.closeAsidePane();
            }
            else {
                _this._toaster.errorToast(res.message);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], PaymentAsideComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], PaymentAsideComponent.prototype, "selectedAccForPayment", void 0);
    PaymentAsideComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'payment-aside',
            template: __webpack_require__(/*! ./payment-aside.component.html */ "./src/app/contact/payment-aside/payment-aside.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 480px;\n      z-index: 1045;\n      }\n      :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n      }\n\n      :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n      }\n\n      :host .aside-pane {\n      width: 480px;\n      }\n      .aside-header {\n      background-color: #fff;\n      padding: 20px 10px;\n      }\n      .aside-pane {\n      padding: 0;\n      background-color: #fff;\n      }\n      .aside-title {\n      padding-bottom: 0;\n      border-bottom: none;\n      }\n      .creditors_detail {\n      padding: 10px;\n      background-color: #F7F8FA;\n      line-height: 1.6;\n      }\n      .creditors_detail > p {\n      font-size: 16px;\n      color: #2D3B4B;\n      }\n      .creditors_detail span.red-text {\n      color: #FF0000;\n      }\n      .contactDetails p {\n      font-size: 12px;\n      color: #2D3B4B;\n      }\n      .accountDetils {\n      padding: 10px;\n      }\n      form label {\n      font-size:16px;\n      margin-bottom: 5px;\n      }\n      .accountDetils .btn-default{\n      width: 100%;\n      text-align: left;\n      background-color: transparent;\n      border: 1px solid #ccc;\n      }\n      .accountDetils  .btn-group{\n      width: 230px;\n      display: block;\n      text-align: left;\n      }\n      .accountDetils {\n      padding: 10px;\n      }\n      .accountDetils span.caret {\n      position: absolute;\n      right: 20px;\n      top: 14px;\n      }\n\n@media(max-width:575px){\n  :host {\n    width:100%;\n    max-width:320px;\n  }\n  :host .aside-pane {\n    width:100%;\n    max-width:320px;\n    }\n\n\n}\n\n@media(max-width:375px){\n  :host {\n    width:100%;\n    max-width:280px;\n  }\n  :host .aside-pane {\n    width:100%;\n    max-width:280px;\n    }\n}\n\n\n\n    "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__["CompanyActions"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_3__["AccountsAction"],
            _services_companyService_service__WEBPACK_IMPORTED_MODULE_7__["CompanyService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"]])
    ], PaymentAsideComponent);
    return PaymentAsideComponent;
}());



/***/ }),

/***/ "./src/app/models/api-models/Contact.ts":
/*!**********************************************!*\
  !*** ./src/app/models/api-models/Contact.ts ***!
  \**********************************************/
/*! exports provided: DueAmountReportQueryRequest, ContactAdvanceSearchCommonModal, ContactAdvanceSearchModal, AgingAdvanceSearchModal, CustomerAdvanceSearchModal, CustomerVendorFiledFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DueAmountReportQueryRequest", function() { return DueAmountReportQueryRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactAdvanceSearchCommonModal", function() { return ContactAdvanceSearchCommonModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactAdvanceSearchModal", function() { return ContactAdvanceSearchModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AgingAdvanceSearchModal", function() { return AgingAdvanceSearchModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomerAdvanceSearchModal", function() { return CustomerAdvanceSearchModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomerVendorFiledFilter", function() { return CustomerVendorFiledFilter; });
var DueAmountReportQueryRequest = /** @class */ (function () {
    function DueAmountReportQueryRequest() {
        this.q = '';
        this.page = 0;
        this.count = 20;
        this.sortBy = 'name';
        this.sort = 'asc';
        this.rangeCol = 0;
    }
    return DueAmountReportQueryRequest;
}());

var ContactAdvanceSearchCommonModal = /** @class */ (function () {
    function ContactAdvanceSearchCommonModal() {
    }
    return ContactAdvanceSearchCommonModal;
}());

var ContactAdvanceSearchModal = /** @class */ (function () {
    function ContactAdvanceSearchModal() {
    }
    return ContactAdvanceSearchModal;
}());

var AgingAdvanceSearchModal = /** @class */ (function () {
    function AgingAdvanceSearchModal() {
        this.includeTotalDueAmount = false;
        this.totalDueAmountGreaterThan = false;
        this.totalDueAmountLessThan = false;
        this.totalDueAmountEqualTo = false;
        this.totalDueAmountNotEqualTo = false;
    }
    return AgingAdvanceSearchModal;
}());

var CustomerAdvanceSearchModal = /** @class */ (function () {
    function CustomerAdvanceSearchModal() {
        this.openingBalanceType = "debit";
        this.closingBalanceType = "debit";
    }
    return CustomerAdvanceSearchModal;
}());

var CustomerVendorFiledFilter = /** @class */ (function () {
    function CustomerVendorFiledFilter() {
        this.parentGroup = false;
        this.email = false;
        this.mobile = false;
        this.state = false;
        this.gstin = false;
        this.comment = false;
        this.openingBalance = false;
        this.closingBalance = false;
    }
    return CustomerVendorFiledFilter;
}());



/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts ***!
  \****************************************************************************************/
/*! exports provided: GenericAsideMenuAccountModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericAsideMenuAccountModule", function() { return GenericAsideMenuAccountModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./generic.aside.menu.account.component */ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shared.module */ "./src/app/shared/shared.module.ts");









var GenericAsideMenuAccountModule = /** @class */ (function () {
    function GenericAsideMenuAccountModule() {
    }
    GenericAsideMenuAccountModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__["GenericAsideMenuAccountComponent"]],
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsDatepickerModule"].forRoot(),
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_5__["LaddaModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__["SelectModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_8__["SharedModule"]
            ],
            exports: [_generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__["GenericAsideMenuAccountComponent"]]
        })
    ], GenericAsideMenuAccountModule);
    return GenericAsideMenuAccountModule;
}());



/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">{{selectedAccountUniqueName ? 'Update' : 'Create'}} Account</h3>\n  </div>\n\n  <div class=\"aside-body\">\n\n    <div class=\"form-group pdT2\">\n\n      <label class=\"mrB1\">Select Group</label>\n\n      <div class=\"ng-select-wrap liq\">\n\n        <ng-select placeholder=\"Select Group\" filterPlaceholder=\"Type to search...\" name=\"activeGroupUniqueName\"\n                   [(ngModel)]=\"activeGroupUniqueName\" [options]=\"flatAccountWGroupsList$ | async\" style=\"width:100%\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n\n      </div>\n    </div>\n\n\n    <ng-container *ngIf=\"!selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-add-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                       [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                       [isAccountNameAvailable$]=\"isAccountNameAvailable$\"\n                       [createAccountInProcess$]=\"createAccountInProcess$\" (submitClicked)=\"addNewAcSubmit($event)\"\n                       [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\" [showBankDetail]=\"showBankDetail\">\n      </account-add-new>\n    </ng-container>\n\n    <ng-container *ngIf=\"selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-update-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                          [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                          [createAccountInProcess$]=\"createAccountInProcess$\"\n                          [updateAccountInProcess$]=\"updateAccountInProcess$\"\n                          [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\"\n                          [showDeleteButton]=\"false\" [showBankDetail]=\"showBankDetail\" (submitClicked)=\"updateAccount($event)\"\n      >\n      </account-update-new>\n    </ng-container>\n\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: GenericAsideMenuAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericAsideMenuAccountComponent", function() { return GenericAsideMenuAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");







var GenericAsideMenuAccountComponent = /** @class */ (function () {
    function GenericAsideMenuAccountComponent(store, groupService, accountsAction) {
        this.store = store;
        this.groupService = groupService;
        this.accountsAction = accountsAction;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"](true);
        this.addEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.updateEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isGstEnabledAcc = true;
        this.isHsnSacEnabledAcc = false;
        this.showBankDetail = false;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        // account-add component's property
        this.flattenGroups$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.general.flattenGroups; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.fetchingAccUniqueName$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.fetchingAccUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.createAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.updateAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    GenericAsideMenuAccountComponent.prototype.ngOnInit = function () {
        //
        this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';
    };
    GenericAsideMenuAccountComponent.prototype.addNewAcSubmit = function (accRequestObject) {
        this.addEvent.emit(accRequestObject);
    };
    GenericAsideMenuAccountComponent.prototype.updateAccount = function (accRequestObject) {
        this.updateEvent.emit(accRequestObject);
    };
    GenericAsideMenuAccountComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    GenericAsideMenuAccountComponent.prototype.getGroups = function (grpUniqueName) {
        var flattenGroups = [];
        this.flattenGroups$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) { return flattenGroups = data || []; });
        var items = flattenGroups.filter(function (grps) {
            return grps.groupUniqueName === grpUniqueName || grps.parentGroups.some(function (s) { return s.uniqueName === grpUniqueName; });
        });
        var flatGrps = items.map(function (m) {
            return { label: m.groupName, value: m.groupUniqueName };
        });
        this.flatAccountWGroupsList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flatGrps);
        this.activeGroupUniqueName = grpUniqueName;
    };
    GenericAsideMenuAccountComponent.prototype.ngOnChanges = function (s) {
        if ('selectedGrpUniqueName' in s && s.selectedGrpUniqueName.currentValue !== s.selectedGrpUniqueName.previousValue) {
            this.getGroups(s.selectedGrpUniqueName.currentValue);
        }
        if ('selectedAccountUniqueName' in s) {
            var value = s.selectedAccountUniqueName;
            if (value.currentValue && value.currentValue !== value.previousValue) {
                this.store.dispatch(this.accountsAction.getAccountDetails(s.selectedAccountUniqueName.currentValue));
            }
        }
    };
    GenericAsideMenuAccountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], GenericAsideMenuAccountComponent.prototype, "selectedGrpUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], GenericAsideMenuAccountComponent.prototype, "selectedAccountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "addEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "updateEvent", void 0);
    GenericAsideMenuAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'generic-aside-menu-account',
            template: __webpack_require__(/*! ./generic.aside.menu.account.component.html */ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 480px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 480px;\n    }\n\n    .aside-body {\n      margin-bottom: 80px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_6__["GroupService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__["AccountsAction"]])
    ], GenericAsideMenuAccountComponent);
    return GenericAsideMenuAccountComponent;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.module.ts":
/*!**************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.module.ts ***!
  \**************************************************************************/
/*! exports provided: GhSortByPipeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GhSortByPipeModule", function() { return GhSortByPipeModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ghSortByPipe_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ghSortByPipe.pipe */ "./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.pipe.ts");



var GhSortByPipeModule = /** @class */ (function () {
    function GhSortByPipeModule() {
    }
    GhSortByPipeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [],
            exports: [_ghSortByPipe_pipe__WEBPACK_IMPORTED_MODULE_2__["GhSortByPipePipe"]],
            declarations: [_ghSortByPipe_pipe__WEBPACK_IMPORTED_MODULE_2__["GhSortByPipePipe"]],
            providers: []
        })
    ], GhSortByPipeModule);
    return GhSortByPipeModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.pipe.ts":
/*!************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/ghSortByPipe/ghSortByPipe.pipe.ts ***!
  \************************************************************************/
/*! exports provided: GhSortByPipePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GhSortByPipePipe", function() { return GhSortByPipePipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../lodash-optimized */ "./src/app/lodash-optimized.ts");



var GhSortByPipePipe = /** @class */ (function () {
    function GhSortByPipePipe() {
    }
    GhSortByPipePipe.prototype.transform = function (value, column, order) {
        if (order === void 0) { order = ''; }
        if (!value || !column || column === '' || order === '') {
            return value;
        } // no array
        if (value.length <= 1) {
            return value;
        } // array with only one item
        return _lodash_optimized__WEBPACK_IMPORTED_MODULE_2__["orderBy"](value, [column], [order]);
    };
    GhSortByPipePipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'ghSortBy' })
    ], GhSortByPipePipe);
    return GhSortByPipePipe;
}());



/***/ })

}]);