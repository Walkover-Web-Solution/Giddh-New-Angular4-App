(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "./src/app/sales/discount-list/discountList.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/sales/discount-list/discountList.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span (clickOutside)=\"hideDiscountMenu()\" (click)=\"$event.stopPropagation()\">\n\n    <a id=\"discount\">\n      <div class=\"multi-select adjust\">\n        <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" name=\"\" class=\"form-control text-right cursor-pointer\"\n               [(ngModel)]=\"discountSum\" readonly (blur)=\"discountInputBlur($event)\"\n               (focus)=\"toggleDiscountMenu()\"/>\n        <span class=\"caret cp\" (click)=\"toggleDiscountMenu()\"></span>\n      </div>\n    </a>\n\n  <div class=\"my-dropdown-menu pd\" (click)=\"$event.stopPropagation()\"\n       style=\"padding: 10px;\" [ngStyle]=\"{'display': isMenuOpen ? 'block': 'none'}\" #disInptEle>\n\n    <div>\n\n      <div class=\"d-flex mb-1\">\n\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Percent</label>\n\n        <div class=\"pos-rel\">\n          <input type=\"text\" class=\"form-control text-right cursor-pointer\"\n                 [disabled]=\"!discountFromPer\"\n                 decimalDigitsDirective [DecimalPlaces]=\"2\"\n                 [(ngModel)]=\"discountPercentageModal\"\n                 (blur)=\"discountFromInput('PERCENTAGE', $event.target.value)\"\n                 name=\"discountFromPer\"\n                 style=\"width: 100px;padding-right: 20px !important;\">\n        <i class=\"fa fa-percent pos-abs\" style=\"top: 9px;right: 6px;color: #acb0b9;\"></i>\n        </div>\n\n      </div>\n\n      <div class=\"d-flex mb-1\">\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Value</label>\n        <input type=\"text\" class=\"form-control text-right  cursor-pointer\"\n               [disabled]=\"!discountFromVal\"\n               decimalDigitsDirective [DecimalPlaces]=\"2\"\n               [(ngModel)]=\"discountFixedValueModal\"\n               (blur)=\"discountFromInput('FIX_AMOUNT', $event.target.value)\"\n               name=\"discountFromVal\"\n               style=\"width: 100px\">\n      </div>\n\n    </div>\n\n    <div class=\"d-flex flex-col\" style=\"justify-content: center\" *ngIf=\"discountAccountsDetails.length > 1\">\n      <span class=\"or-line\">AND</span>\n    </div>\n\n    <div *ngIf=\"discountAccountsDetails.length > 1\">\n       <ul style=\"list-style: none;overflow: auto;max-height: 100px\">\n\n       <ng-container *ngFor=\"let discount of discountAccountsDetails;trackBy: trackByFn; let idx = index\">\n         <li *ngIf=\"idx > 0\" class=\"customItem cp\">\n          <label class=\"checkbox oh width100 m0\" (click)=\"$event.stopPropagation()\">\n            <input class=\"pull-left\" name=\"tax_{{idx}}\" type=\"checkbox\" [(ngModel)]=\"discount.isActive\"\n                   (change)=\"change()\"\n                   (click)=\"$event.stopPropagation()\"\n            />\n            <span class=\"pull-left ellp cp\">{{discount.name}}</span>\n          </label>\n         </li>\n       </ng-container>\n  </ul>\n    </div>\n  </div>\n\n</span>\n\n"

/***/ }),

/***/ "./src/app/sales/discount-list/discountList.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/sales/discount-list/discountList.component.ts ***!
  \***************************************************************/
/*! exports provided: DiscountListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscountListComponent", function() { return DiscountListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/api-models/SettingsDiscount */ "./src/app/models/api-models/SettingsDiscount.ts");








var DiscountListComponent = /** @class */ (function () {
    function DiscountListComponent(store) {
        var _this = this;
        this.store = store;
        this.isMenuOpen = false;
        this.selectedDiscountItems = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.selectedDiscountItemsTotal = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.totalAmount = 0;
        this.discountTotalUpdated = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.discountFromPer = true;
        this.discountFromVal = true;
        this.discountPercentageModal = 0;
        this.discountFixedValueModal = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.discountAccountsList$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.settings.discount.discountList; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.discountAccountsList$.subscribe(function (data) {
            if (data && data.length) {
                _this.prepareDiscountList();
            }
        });
    }
    Object.defineProperty(DiscountListComponent.prototype, "defaultDiscount", {
        get: function () {
            return this.discountAccountsDetails[0];
        },
        enumerable: true,
        configurable: true
    });
    DiscountListComponent.prototype.ngOnInit = function () {
        if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
            this.discountFixedValueModal = this.defaultDiscount.amount;
        }
        else {
            this.discountPercentageModal = this.defaultDiscount.amount;
        }
    };
    DiscountListComponent.prototype.ngOnChanges = function (changes) {
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
            this.prepareDiscountList();
            if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                this.discountFixedValueModal = this.defaultDiscount.amount;
            }
            else {
                this.discountPercentageModal = this.defaultDiscount.amount;
            }
            // this.change();
        }
        if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
            this.change();
        }
    };
    DiscountListComponent.prototype.discountInputBlur = function (event) {
        if (event && event.relatedTarget && this.disInptEle && !this.disInptEle.nativeElement.contains(event.relatedTarget)) {
            this.hideDiscountMenu();
        }
    };
    /**
     * prepare discount obj
     */
    DiscountListComponent.prototype.prepareDiscountList = function () {
        var _this = this;
        var discountAccountsList = [];
        this.discountAccountsList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (d) { return discountAccountsList = d; });
        if (discountAccountsList.length && this.discountAccountsDetails && this.discountAccountsDetails.length) {
            discountAccountsList.forEach(function (acc) {
                var hasItem = _this.discountAccountsDetails.some(function (s) { return s.discountUniqueName === acc.uniqueName; });
                if (!hasItem) {
                    var obj = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_7__["LedgerDiscountClass"]();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount.uniqueName;
                    obj.discountUniqueName = acc.uniqueName;
                    obj.name = acc.name;
                    _this.discountAccountsDetails.push(obj);
                }
            });
        }
    };
    DiscountListComponent.prototype.discountFromInput = function (type, val) {
        this.defaultDiscount.amount = parseFloat(val);
        this.defaultDiscount.discountValue = parseFloat(val);
        this.defaultDiscount.discountType = type;
        this.change();
        if (!val) {
            this.discountFromVal = true;
            this.discountFromPer = true;
            return;
        }
        if (type === 'PERCENTAGE') {
            this.discountFromPer = true;
            this.discountFromVal = false;
        }
        else {
            this.discountFromPer = false;
            this.discountFromVal = true;
        }
    };
    /**
     * on change of discount amount
     */
    DiscountListComponent.prototype.change = function () {
        this.discountTotalUpdated.emit();
    };
    /**
     * generate total of discount amount
     * @returns {number}
     */
    DiscountListComponent.prototype.generateTotal = function () {
        var percentageListTotal = this.discountAccountsDetails.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var fixedListTotal = this.discountAccountsDetails.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var perFromAmount = ((percentageListTotal * this.totalAmount) / 100);
        return perFromAmount + fixedListTotal;
    };
    DiscountListComponent.prototype.trackByFn = function (index) {
        return index; // or item.id
    };
    DiscountListComponent.prototype.hideDiscountMenu = function () {
        this.isMenuOpen = false;
    };
    DiscountListComponent.prototype.toggleDiscountMenu = function () {
        this.isMenuOpen = (!this.isMenuOpen);
    };
    DiscountListComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], DiscountListComponent.prototype, "isMenuOpen", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], DiscountListComponent.prototype, "selectedDiscountItems", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], DiscountListComponent.prototype, "selectedDiscountItemsTotal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('quickAccountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_5__["ElementViewContainerRef"])
    ], DiscountListComponent.prototype, "quickAccountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('quickAccountModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], DiscountListComponent.prototype, "quickAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('disInptEle'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], DiscountListComponent.prototype, "disInptEle", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], DiscountListComponent.prototype, "discountSum", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], DiscountListComponent.prototype, "discountAccountsDetails", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], DiscountListComponent.prototype, "totalAmount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], DiscountListComponent.prototype, "discountTotalUpdated", void 0);
    DiscountListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'discount-list',
            template: __webpack_require__(/*! ./discountList.component.html */ "./src/app/sales/discount-list/discountList.component.html"),
            styles: ["\n      .dropdown-menu > li > a.btn-link {\n          color: #10aae0;\n      }\n\n      :host .dropdown-menu {\n          overflow: auto;\n      }\n\n\n      .dropdown-menu {\n          right: -110px;\n          left: auto;\n          top: 8px;\n      }\n\n      td {\n          vertical-align: middle !important;\n      }\n\n      .customItem:hover {\n          background-color: rgb(244, 245, 248) !important;\n      }\n\n      .customItem {\n          padding: 5px;\n\n      }\n\n      .customItem:hover span {\n          color: rgb(210, 95, 42) !important;\n      }\n\n      .multi-select input.form-control {\n          background-image: unset !important;\n      }\n\n      .multi-select .caret {\n          display: block !important;\n      }\n\n      .multi-select.adjust .caret {\n          right: -2px !important;\n          top: 14px !important;\n      }\n\n      :host {\n          -moz-user-select: none;\n          -webkit-user-select: none;\n          -ms-user-select: none;\n          user-select: none;\n      }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"]])
    ], DiscountListComponent);
    return DiscountListComponent;
}());



/***/ }),

/***/ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">Recurring Account</h3>\n  </div>\n  <div class=\"aside-body\">\n    <form [formGroup]=\"form\">\n      <div class=\"row pdT2\">\n        <div class=\"col-xs-4 form-group\">\n          <label class=\"mrB1\">Start Date<span class=\"text-danger\">*</span></label>\n          <input name=\"dateRange\" formControlName=\"nextCronDate\" type=\"text\" autocomplete=\"off\" class=\"form-control\"\n                 bsDatepicker [minDate]=\"today\" [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n        </div>\n\n        <div class=\"col-xs-4 form-group\" *ngIf=\"!IsNotExpirable\">\n          <label class=\"mrB1\">End Date<span class=\"text-danger\">*</span></label>\n          <input name=\"dateRange\" formControlName=\"cronEndDate\" type=\"text\" autocomplete=\"off\" [minDate]=\"maxEndDate\"\n                 class=\"form-control\" bsDatepicker [bsConfig]=\"{dateInputFormat: 'DD-MM-YYYY'}\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <input [checked]=\"IsNotExpirable\" (change)=\"isExpirableChanged($event.target)\" type=\"checkbox\"/> Never expire\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"mrB1\">Interval<span class=\"text-danger\">*</span></label>\n        <ng-select placeholder=\"Select Interval\" filterPlaceholder=\"Type to search...\" formControlName=\"duration\"\n                   name=\"duration\" [options]=\"intervalOptions\" style=\"width:100%\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n      </div>\n\n      <div class=\"clearfix text-right\" *ngIf=\"mode === 'create'\">\n        <button class=\"btn btn-sm\" (click)=\"closeAsidePane($event)\">Cancel</button>\n        <button class=\"btn btn-success btn-sm\" [ladda]=\"isLoading\" (click)=\"saveRecurringInvoice()\">Save</button>\n      </div>\n      <div class=\"clearfix text-right\" *ngIf=\"mode === 'update'\">\n        <button class=\"btn btn-danger btn-sm\" [ladda]=\"isDeleteLoading\" (click)=\"deleteInvoice()\">Delete</button>\n        <button class=\"btn btn-success btn-sm\" [ladda]=\"isLoading\" (click)=\"saveRecurringInvoice()\">Update</button>\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: fixed;\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 400px;\n  z-index: 1045; }\n\n#close {\n  display: none; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: -41px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  width: 400px; }\n"

/***/ }),

/***/ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.ts ***!
  \******************************************************************************************/
/*! exports provided: AsideMenuRecurringEntryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuRecurringEntryComponent", function() { return AsideMenuRecurringEntryComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");








var AsideMenuRecurringEntryComponent = /** @class */ (function () {
    function AsideMenuRecurringEntryComponent(_store, _fb, _toaster, _invoiceActions) {
        var _this = this;
        this._store = _store;
        this._fb = _fb;
        this._toaster = _toaster;
        this._invoiceActions = _invoiceActions;
        this.today = new Date();
        this.maxEndDate = new Date();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.mode = 'create';
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.today.setDate(this.today.getDate() + 1);
        this.form = this._fb.group({
            voucherNumber: [this.voucherNumber, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required],
            duration: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required],
            nextCronDate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required],
            cronEndDate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required],
        });
        this.form.controls.nextCronDate.valueChanges.subscribe(function (p) {
            _this.maxEndDate = p;
            var cronEndDate = _this.form.value.cronEndDate;
            var end = moment__WEBPACK_IMPORTED_MODULE_5__(cronEndDate, cronEndDate instanceof Date ? null : 'DD-MM-YYYY');
            var next = moment__WEBPACK_IMPORTED_MODULE_5__(p);
            if (end.isValid() && next.isAfter(end)) {
                _this.form.controls.cronEndDate.patchValue('');
            }
        });
    }
    AsideMenuRecurringEntryComponent.prototype.ngOnChanges = function (changes) {
        // console.log(changes);
        if (changes.voucherNumber) {
            this.form.controls.voucherNumber.patchValue(this.voucherNumber);
        }
        if (this.invoice) {
            this.form.patchValue({
                voucherNumber: this.invoice.voucherNumber,
                duration: this.invoice.duration.toLowerCase(),
                nextCronDate: this.invoice.nextCronDate && moment__WEBPACK_IMPORTED_MODULE_5__(this.invoice.nextCronDate, 'DD-MM-YYYY').toDate(),
                cronEndDate: this.invoice.cronEndDate && moment__WEBPACK_IMPORTED_MODULE_5__(this.invoice.cronEndDate, 'DD-MM-YYYY').toDate()
            });
            if (!this.invoice.cronEndDate) {
                this.isExpirableChanged({ checked: true });
            }
        }
    };
    AsideMenuRecurringEntryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.intervalOptions = [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Halfyearly', value: 'halfyearly' },
            { label: 'Yearly', value: 'yearly' },
            { label: 'Monthly', value: 'monthly' }
        ];
        this.timeOptions = [
            { label: '1st', value: '1' },
            { label: '2nd', value: '2' },
            { label: '3rd', value: '3' },
            { label: '4th', value: '4' },
            { label: '5th', value: '5' },
        ];
        this._store.select(function (p) { return p.invoice.recurringInvoiceData; })
            .subscribe(function (p) {
            _this.isLoading = p.isRequestInFlight;
            _this.isDeleteLoading = p.isDeleteRequestInFlight;
            if (p.isRequestSuccess) {
                _this.closeAsidePane(null);
            }
        });
    };
    AsideMenuRecurringEntryComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
        this.ngOnDestroy();
    };
    AsideMenuRecurringEntryComponent.prototype.deleteInvoice = function () {
        this.isDeleteLoading = true;
        this._store.dispatch(this._invoiceActions.deleteRecurringInvoice(this.invoice.uniqueName));
    };
    AsideMenuRecurringEntryComponent.prototype.isExpirableChanged = function (_a) {
        var checked = _a.checked;
        this.IsNotExpirable = checked;
        if (checked) {
            this.form.controls.cronEndDate.setValidators([]);
        }
        else {
            this.form.controls.cronEndDate.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required);
        }
        this.form.controls.cronEndDate.updateValueAndValidity();
    };
    AsideMenuRecurringEntryComponent.prototype.saveRecurringInvoice = function () {
        // console.log(this.form.value);
        if (this.mode === 'update') {
            if (this.form.controls.cronEndDate.invalid) {
                this._toaster.errorToast('Date should be greater than today');
                return;
            }
        }
        else {
            if (this.form.invalid) {
                this._toaster.errorToast('All * fields should be valid and filled');
                return;
            }
        }
        if (this.form.controls.cronEndDate.valid && this.form.controls.voucherNumber.valid && this.form.controls.duration.valid && !this.isLoading) {
            this.isLoading = true;
            var cronEndDate = this.IsNotExpirable ? '' : this.getFormattedDate(this.form.value.cronEndDate);
            var nextCronDate = this.getFormattedDate(this.form.value.nextCronDate);
            var invoiceModel = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.invoice, this.form.value, { cronEndDate: cronEndDate, nextCronDate: nextCronDate });
            if (this.voucherType) {
                invoiceModel.voucherType = this.voucherType;
            }
            if (this.mode === 'update') {
                this._store.dispatch(this._invoiceActions.updateRecurringInvoice(invoiceModel));
            }
            else {
                this._store.dispatch(this._invoiceActions.createRecurringInvoice(invoiceModel));
            }
        }
        else {
            this._toaster.errorToast('All * fields should be valid and filled');
        }
    };
    AsideMenuRecurringEntryComponent.prototype.getFormattedDate = function (date) {
        return moment__WEBPACK_IMPORTED_MODULE_5__(date, date instanceof Date ? null : 'DD-MM-YYYY').format('DD-MM-YYYY');
    };
    AsideMenuRecurringEntryComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuRecurringEntryComponent.prototype, "voucherNumber", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuRecurringEntryComponent.prototype, "voucherType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuRecurringEntryComponent.prototype, "mode", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AsideMenuRecurringEntryComponent.prototype, "invoice", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuRecurringEntryComponent.prototype, "closeAsideEvent", void 0);
    AsideMenuRecurringEntryComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-aside-recurring-entry',
            template: __webpack_require__(/*! ./aside.menu.recurringEntry.component.html */ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.html"),
            styles: [__webpack_require__(/*! ./aside.menu.recurringEntry.component.scss */ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_3__["InvoiceActions"]])
    ], AsideMenuRecurringEntryComponent);
    return AsideMenuRecurringEntryComponent;
}());



/***/ }),

/***/ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module.ts ***!
  \***************************************************************************************/
/*! exports provided: AsideMenuRecurringEntryModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuRecurringEntryModule", function() { return AsideMenuRecurringEntryModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _aside_menu_recurringEntry_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./aside.menu.recurringEntry.component */ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");








// import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { PaginationModule  } from 'ngx-bootstrap/pagination';
// import { CollapseModule } from 'ngx-bootstrap/collapse';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { PopoverModule } from 'ngx-bootstrap/popover';
var AsideMenuRecurringEntryModule = /** @class */ (function () {
    function AsideMenuRecurringEntryModule() {
    }
    AsideMenuRecurringEntryModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_aside_menu_recurringEntry_component__WEBPACK_IMPORTED_MODULE_2__["AsideMenuRecurringEntryComponent"]],
            imports: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_4__["BsDatepickerModule"].forRoot(), _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"], _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_6__["SelectModule"], angular2_ladda__WEBPACK_IMPORTED_MODULE_7__["LaddaModule"]],
            exports: [_aside_menu_recurringEntry_component__WEBPACK_IMPORTED_MODULE_2__["AsideMenuRecurringEntryComponent"]]
        })
    ], AsideMenuRecurringEntryModule);
    return AsideMenuRecurringEntryModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/universalValidations.ts":
/*!********************************************************!*\
  !*** ./src/app/shared/helpers/universalValidations.ts ***!
  \********************************************************/
/*! exports provided: EMAIL_REGEX_PATTERN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMAIL_REGEX_PATTERN", function() { return EMAIL_REGEX_PATTERN; });
var EMAIL_REGEX_PATTERN = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;


/***/ }),

/***/ "./src/app/theme/tax-control/tax-control.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/theme/tax-control/tax-control.module.ts ***!
  \*********************************************************/
/*! exports provided: TaxControlModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TaxControlModule", function() { return TaxControlModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _tax_control_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tax-control.component */ "./src/app/theme/tax-control/tax-control.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var apps_web_giddh_src_app_theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/ng-virtual-select/virtual-scroll */ "./src/app/theme/ng-virtual-select/virtual-scroll.ts");







var TaxControlModule = /** @class */ (function () {
    function TaxControlModule() {
    }
    TaxControlModule_1 = TaxControlModule;
    TaxControlModule.forRoot = function () {
        return {
            ngModule: TaxControlModule_1,
            providers: []
        };
    };
    var TaxControlModule_1;
    TaxControlModule = TaxControlModule_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], ng_click_outside__WEBPACK_IMPORTED_MODULE_5__["ClickOutsideModule"], apps_web_giddh_src_app_theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_6__["VirtualScrollModule"]],
            declarations: [_tax_control_component__WEBPACK_IMPORTED_MODULE_3__["TaxControlComponent"]],
            exports: [_tax_control_component__WEBPACK_IMPORTED_MODULE_3__["TaxControlComponent"]]
        })
    ], TaxControlModule);
    return TaxControlModule;
}());



/***/ })

}]);