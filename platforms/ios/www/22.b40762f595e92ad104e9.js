(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ "../../node_modules/ng-contenteditable/ng-contenteditable.umd.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ng-contenteditable/ng-contenteditable.umd.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js"), __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js")) :
	undefined;
}(this, (function (exports,core,forms) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ContenteditableDirective = /** @class */ (function () {
    function ContenteditableDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.propValueAccessor = 'textContent';
    }
    /**
     * @return {?}
     */
    ContenteditableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.propValueAccessor = this.propValueAccessor;
    };
    /**
     * @return {?}
     */
    ContenteditableDirective.prototype.callOnChange = /**
     * @return {?}
     */
    function () {
        if (typeof this.onChange === 'function') {
            this.onChange(this.elementRef.nativeElement[this.propValueAccessor]);
        }
    };
    /**
     * @return {?}
     */
    ContenteditableDirective.prototype.callOnTouched = /**
     * @return {?}
     */
    function () {
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
    };
    /**
     * Writes a new value to the element.
     * This method will be called by the forms API to write
     * to the view when programmatic (model -> view) changes are requested.
     *
     * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
     */
    /**
     * Writes a new value to the element.
     * This method will be called by the forms API to write
     * to the view when programmatic (model -> view) changes are requested.
     *
     * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
     * @param {?} value
     * @return {?}
     */
    ContenteditableDirective.prototype.writeValue = /**
     * Writes a new value to the element.
     * This method will be called by the forms API to write
     * to the view when programmatic (model -> view) changes are requested.
     *
     * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
     * @param {?} value
     * @return {?}
     */
    function (value) {
        /** @type {?} */
        var normalizedValue = value == null ? '' : value;
        this.renderer.setProperty(this.elementRef.nativeElement, this.propValueAccessor, normalizedValue);
    };
    /**
     * Registers a callback function that should be called when
     * the control's value changes in the UI.
     *
     * This is called by the forms API on initialization so it can update
     * the form model when values propagate from the view (view -> model).
     */
    /**
     * Registers a callback function that should be called when
     * the control's value changes in the UI.
     *
     * This is called by the forms API on initialization so it can update
     * the form model when values propagate from the view (view -> model).
     * @param {?} fn
     * @return {?}
     */
    ContenteditableDirective.prototype.registerOnChange = /**
     * Registers a callback function that should be called when
     * the control's value changes in the UI.
     *
     * This is called by the forms API on initialization so it can update
     * the form model when values propagate from the view (view -> model).
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * Registers a callback function that should be called when the control receives a blur event.
     * This is called by the forms API on initialization so it can update the form model on blur.
     */
    /**
     * Registers a callback function that should be called when the control receives a blur event.
     * This is called by the forms API on initialization so it can update the form model on blur.
     * @param {?} fn
     * @return {?}
     */
    ContenteditableDirective.prototype.registerOnTouched = /**
     * Registers a callback function that should be called when the control receives a blur event.
     * This is called by the forms API on initialization so it can update the form model on blur.
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /**
     * This function is called by the forms API when the control status changes to or from "DISABLED".
     * Depending on the value, it should enable or disable the appropriate DOM element.
     */
    /**
     * This function is called by the forms API when the control status changes to or from "DISABLED".
     * Depending on the value, it should enable or disable the appropriate DOM element.
     * @param {?} isDisabled
     * @return {?}
     */
    ContenteditableDirective.prototype.setDisabledState = /**
     * This function is called by the forms API when the control status changes to or from "DISABLED".
     * Depending on the value, it should enable or disable the appropriate DOM element.
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        if (isDisabled) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
            this.removeDisabledState = this.renderer.listen(this.elementRef.nativeElement, 'keydown', this.listenerDisabledState);
        }
        else {
            if (this.removeDisabledState) {
                this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
                this.removeDisabledState();
            }
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ContenteditableDirective.prototype.listenerDisabledState = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
    };
    ContenteditableDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[contenteditable]',
                    providers: [
                        { provide: forms.NG_VALUE_ACCESSOR, useExisting: core.forwardRef(function () { return ContenteditableDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    ContenteditableDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.Renderer2 }
    ]; };
    ContenteditableDirective.propDecorators = {
        propValueAccessor: [{ type: core.Input }],
        callOnChange: [{ type: core.HostListener, args: ['input',] }],
        callOnTouched: [{ type: core.HostListener, args: ['blur',] }]
    };
    return ContenteditableDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ContenteditableModule = /** @class */ (function () {
    function ContenteditableModule() {
    }
    ContenteditableModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        ContenteditableDirective
                    ],
                    exports: [
                        ContenteditableDirective
                    ]
                },] },
    ];
    return ContenteditableModule;
}());

exports.ContenteditableModule = ContenteditableModule;
exports.ContenteditableDirective = ContenteditableDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./src/app/create/components/header/create.header.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/create/components/header/create.header.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header>\n  <div class=\"container-fluid\">\n    <a class=\"navbar-brand\" href=\"/\">\n      <img src=\"{{imgPath}}giddh-logo-white.png\" alt=\"Giddh | online accounting software\" class=\"logo\"/>\n    </a>\n    <ul class=\"nav navbar-nav pull-right\">\n      <li>\n        <a href=\"/app/signup\">Sign up</a>\n      </li>\n      <li>\n        <a href=\"/app\">Login</a>\n      </li>\n    </ul>\n  </div>\n</header>\n"

/***/ }),

/***/ "./src/app/create/components/header/create.header.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/create/components/header/create.header.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "header {\n  background: #27273b;\n  padding: 10px 0; }\n  header .navbar-brand {\n    height: auto;\n    padding: 0; }\n  header .navbar-brand img {\n      max-width: 140px; }\n  header .navbar-nav {\n    margin-top: 2px; }\n  header .navbar-nav li a {\n      color: #fff;\n      padding: 10px 15px; }\n  header .navbar-nav li a:hover {\n        background: #ff5f00;\n        border-radius: 2px; }\n"

/***/ }),

/***/ "./src/app/create/components/header/create.header.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/create/components/header/create.header.component.ts ***!
  \*********************************************************************/
/*! exports provided: CreateInvoiceHeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateInvoiceHeaderComponent", function() { return CreateInvoiceHeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");




var CreateInvoiceHeaderComponent = /** @class */ (function () {
    function CreateInvoiceHeaderComponent(meta) {
        this.meta = meta;
        this.imgPath = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        this.meta.updateTag({ name: 'description', content: 'Forget about the painful and tedious ways to create custom invoice. Giddh offers the best accounting software to create your own invoice online easily for small businesses. You can create invoice bill online anytime and anywhere. 24/7 Customer Support! Start your free trial today!' });
        //
    }
    CreateInvoiceHeaderComponent.prototype.ngOnInit = function () {
        this.imgPath =  false ? undefined : "http://test.giddh.com/" + "app/" + 'assets/images/';
    };
    CreateInvoiceHeaderComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateInvoiceHeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'create-invoice-header',
            template: __webpack_require__(/*! ./create.header.component.html */ "./src/app/create/components/header/create.header.component.html"),
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].Emulated,
            styles: [__webpack_require__(/*! ./create.header.component.scss */ "./src/app/create/components/header/create.header.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"]])
    ], CreateInvoiceHeaderComponent);
    return CreateInvoiceHeaderComponent;
}());



/***/ }),

/***/ "./src/app/create/components/invoice/invoice.component.html":
/*!******************************************************************!*\
  !*** ./src/app/create/components/invoice/invoice.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<create-invoice-header>\n</create-invoice-header>\n\n\n<section>\n  <div class=\"inv_header\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <!-- <div class=\"col-sm-12 text-center\">\n            <h1 class=\"text-center\">Follow three easy steps below to create Invoice</h1>\n        </div> -->\n        <div class=\"col-sm-12 text-center\">\n          <create-invoice-steps></create-invoice-steps>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"inv_content\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <div>\n          <div class=\"col-xs-4\">\n            <div class=\"template-options\">\n              <a [routerLink]=\"['/create-invoice/invoice/t001']\">\n                <h4>Template 1</h4>\n                <figure>\n                  <div class=\"overlay\">\n                    <button class=\"btn btn-default btn-select\">select</button>\n                  </div>\n                  <img src=\"{{imgPath}}Outside Invoice Sample.jpg\" class=\"template_img\"/>\n                </figure>\n              </a>\n            </div>\n          </div>\n          <!-- <div class=\"col-xs-4\">\n    <div class=\"template-options\">\n        <a [routerLink]=\"['/create-invoice/invoice/t001']\">\n          <h4>Template 2</h4>\n          <figure>\n              <div class=\"overlay\">\n                  <button class=\"btn btn-default btn-select\">select</button>\n                </div>\n              <img src=\"{{imgPath}}Outside Invoice Sample.jpg\" class=\"template_img\" />\n         </figure>\n        </a>\n    </div>\n</div>\n<div class=\"col-xs-4\">\n      <div class=\"template-options\">\n        <a [routerLink]=\"['/create-invoice/invoice/t001']\">\n          <h4>Template 3</h4>\n          <figure>\n              <div class=\"overlay\">\n                  <button class=\"btn btn-default btn-select\">select</button>\n                </div>\n              <img src=\"{{imgPath}}Outside Invoice Sample.jpg\" class=\"template_img\" />\n         </figure>\n        </a>\n      </div>\n    </div> -->\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/create/components/invoice/invoice.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/create/components/invoice/invoice.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".inv_header {\n  background: #FFF8EB; }\n  .inv_header h1 {\n    font-size: 20px;\n    color: #333333;\n    font-family: 'LatoWeb';\n    padding: 0;\n    border-bottom: 1px solid #333333;\n    display: inline-block;\n    margin: 28px 0; }\n  .inv_header span {\n    color: #E14D26;\n    border-bottom: 1px solid #E14D26;\n    display: inline-block;\n    font-family: 'LatoWeb';\n    font-size: 20px;\n    line-height: 21px;\n    padding: 0;\n    margin: 28px 0; }\n  .inv_content {\n  background: #fff;\n  padding-bottom: 20px; }\n  .template-options {\n  margin-top: 26px;\n  position: relative;\n  overflow: hidden; }\n  .template-options figure {\n    position: relative; }\n  .template-options figure .template_img {\n      width: 100%; }\n  .template-options h4 {\n    margin-bottom: 7px; }\n  .template-options .overlay {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    display: none;\n    background: rgba(0, 0, 0, 0.85); }\n  .template-options .overlay .btn-select {\n      position: relative;\n      top: 50%;\n      left: 50%;\n      transform: translateX(-50%);\n      background: #E6E6E6;\n      color: #F26122;\n      font-size: 16px; }\n  .template-options:hover .overlay {\n    display: block; }\n"

/***/ }),

/***/ "./src/app/create/components/invoice/invoice.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/create/components/invoice/invoice.component.ts ***!
  \****************************************************************/
/*! exports provided: CreateInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateInvoiceComponent", function() { return CreateInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");




var CreateInvoiceComponent = /** @class */ (function () {
    function CreateInvoiceComponent(_router) {
        this._router = _router;
        this.imgPath = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
    }
    CreateInvoiceComponent.prototype.ngOnInit = function () {
        this.imgPath =  false ? undefined : "http://test.giddh.com/" + "app/" + 'assets/images/templates/';
        this._router.navigate(['/create-invoice/invoice/t001']); // Remove this line when you have multiple templates
    };
    CreateInvoiceComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'create-invoice',
            template: __webpack_require__(/*! ./invoice.component.html */ "./src/app/create/components/invoice/invoice.component.html"),
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].Emulated,
            styles: [__webpack_require__(/*! ./invoice.component.scss */ "./src/app/create/components/invoice/invoice.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], CreateInvoiceComponent);
    return CreateInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/create/components/invoice/templates/letter/letter.template.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/letter/letter.template.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form #invoiceForm=\"ngForm\" novalidate [formGroup]=\"CreateInvoiceForm\" class=\"container-fluid form-container\">\n  <div class=\"row\">\n    <div class=\"container\">\n      <section class=\"form-inline\">\n        <!-- end genaral detail -->\n        <div class=\"col-xs-12\">\n          <div class=\"collapse-pane clearfix\">\n            <div class=\"collapse-pane-heading\">\n              <div class=\"ico-box-wrap\" (click)=\"isOthrDtlCollapsed = !isOthrDtlCollapsed\">\n                <div class=\"ico-box\">\n                  <span [ngClass]=\"isOthrDtlCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                </div>\n                <div class=\"ico-head\">Sender’s Details</div>\n              </div>\n            </div>\n            <div [collapse]=\"isOthrDtlCollapsed\" class=\"clearfix pdL3 pdR3 col-xs-12 mr0\">\n              <div class=\"row mt13\" formGroupName=\"companyDetails\">\n                <!-- <div class=\"form-group col-xs-2\">\n          <label>Ship Date</label>\n          <input formControlName=\"shippingDate\" type=\"text\" [placeholder]=\"giddhDateFormat\" bsDatepicker class=\"form-control\" [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" />\n      </div>\n      <div class=\"form-group col-xs-2\">\n          <label>Ship Via</label>\n          <input  type=\"text\" class=\"form-control\" />\n      </div>\n      <div class=\"form-group col-xs-2\">\n          <label>Tracking No.</label>\n          <input type=\"text\" class=\"form-control\" />\n      </div> -->\n                <div class=\"col-xs-6\">\n                  <div class=\"row\">\n                    <div class=\"form-group col-xs-8\"\n                         [ngClass]=\"{ 'has-error': isFormSubmitted && CreateInvoiceForm.controls['companyDetails'].get('name').invalid }\">\n                      <label>Sender’s Name <sup>*</sup></label>\n                      <input type=\"text\" class=\"form-control\" formControlName=\"name\" class=\"form-control\"/>\n                    </div>\n                    <ng-container formGroupName=\"companyGstDetails\">\n                      <div class=\"form-group col-xs-4\">\n                        <label>State</label>\n                        <sh-select #stateEl formControlName=\"stateCode\" class=\"splSales\"\n                                   [options]=\"statesSource$ | async\" [width]=\"139\"></sh-select>\n                      </div>\n                      <div class=\"mrT2 pull-left width100\">\n                        <div class=\"form-group col-xs-8\">\n                          <label>PAN</label>\n                          <input type=\"text\" class=\"form-control\" formControlName=\"panNumber\"/>\n                        </div>\n                        <div class=\"form-group col-xs-4\">\n                          <label>GSTIN</label>\n                          <input type=\"text\" class=\"form-control\" formControlName=\"gstNumber\"\n                                 (keyup)=\"getStateCode('senderInfo', stateEl);\"/>\n                        </div>\n                      </div>\n                    </ng-container>\n                  </div>\n                </div>\n                <div class=\"col-xs-4\">\n                  <div class=\"form-group width100\">\n                    <label>Sender’s address</label>\n                    <textarea class=\"form-control\" formControlName=\"address\" rows=\"5\"></textarea>\n                  </div>\n                </div>\n\n                <div class=\"clearfix\"></div>\n\n\n                <!-- <ng-container formGroupName=\"customFields\">\n          <div class=\"form-group col-xs-2\">\n              <label>Field 1</label>\n              <input type=\"text\" formControlName=\"customField1\" class=\"form-control\" />\n          </div>\n          <div class=\"form-group col-xs-2\">\n              <label>Field 2</label>\n              <input type=\"text\" formControlName=\"customField2\" class=\"form-control\" />\n          </div>\n          <div class=\"form-group col-xs-2\">\n              <label>Field 3</label>\n              <input type=\"text\" formControlName=\"customField3\" class=\"form-control\" />\n          </div>\n      </ng-container> -->\n              </div>\n            </div>\n          </div>\n        </div>\n        <!-- end other details collapse pane -->\n\n        <div class=\"col-xs-12\">\n          <div class=\"collapse-pane clearfix\">\n            <div class=\"collapse-pane-heading\">\n              <div class=\"ico-box-wrap\" (click)=\"isCustDtlCollapsed = !isCustDtlCollapsed\">\n                <div class=\"ico-box\">\n                  <span [ngClass]=\"isCustDtlCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                </div>\n                <div class=\"ico-head\">Customer Details</div>\n              </div>\n            </div>\n            <div [collapse]=\"isCustDtlCollapsed\" class=\"clearfix pdL3 pdR3 col-xs-12 mr0\">\n              <div class=\"row mt13\" formGroupName=\"userDetails\">\n                <!-- commented by sagar sir -->\n                <div class=\"form-group col-xs-4\"\n                     [ngClass]=\"{'has-error': isFormSubmitted && CreateInvoiceForm.controls['userDetails'].get('userCompanyName').invalid }\">\n                  <label>Attention to\n                    <sup>*</sup>\n                  </label>\n                  <input placeholder=\"Customer name\" type=\"text\" formControlName=\"userCompanyName\"\n                         class=\"form-control\"/>\n                </div>\n                <div class=\"form-group col-xs-2\">\n                  <label>Country</label>\n                  <!-- <input placeholder=\"Customer name\" type=\"text\" formControlName=\"userCompanyName\" class=\"form-control\" [ngClass]=\"{'has-error': isFormSubmitted && CreateInvoiceForm.controls['userDetails'].get('userCompanyName').invalid }\"\n/> -->\n                  <sh-select class=\"sh-form_control\" formControlName=\"countryCode\" [options]=\"countrySource\"\n                             [ngClass]=\"{ 'has-error': isFormSubmitted && CreateInvoiceForm.controls['userDetails'].get('countryCode').invalid }\"></sh-select>\n                </div>\n\n                <div class=\"form-group col-xs-2\">\n                  <label>Mobile No.</label>\n                  <input digitsOnlyDirective placeholder=\"9198XXXXXXXX\" type=\"text\" formControlName=\"userMobileNumber\"\n                         class=\"form-control\"/>\n                </div>\n                <!-- <div class=\"form-group col-xs-3\">\n                        <label>Customer Name</label>\n                        <input type=\"text\" class=\"form-control\" formControlName=\"userName\" [ngClass]=\"{'has-error': isFormSubmitted && CreateInvoiceForm.controls['userDetails'].get('userName').invalid }\">\n                    </div> -->\n                <div class=\"form-group col-xs-2\">\n                  <label>Email Id</label>\n                  <input type=\"email\" placeholder=\"someone@example.com\" formControlName=\"userEmail\"\n                         class=\"form-control\"/>\n                </div>\n\n              </div>\n            </div>\n          </div>\n        </div>\n\n\n        <!-- end general details collapse pane -->\n        <div class=\"col-xs-12\">\n          <div class=\"collapse-pane clearfix\">\n            <div class=\"collapse-pane-heading\">\n              <div class=\"ico-box-wrap\" (click)=\"isMlngAddrCollapsed = !isMlngAddrCollapsed\">\n                <div class=\"ico-box\">\n                  <span [ngClass]=\"isMlngAddrCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                </div>\n                <div class=\"ico-head\">Mailing Details</div>\n              </div>\n            </div>\n            <div [collapse]=\"isMlngAddrCollapsed\" class=\"clearfix pdL3 pdR3 col-xs-12 mr0\">\n              <div class=\"row mt13\">\n                <div formGroupName=\"userDetails\">\n                  <div class=\"\"\n                       [ngClass]=\"{'col-xs-6':CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN', 'col-xs-4': CreateInvoiceForm.controls['userDetails'].get('countryCode').value !== 'IN' }\">\n                    <div class=\"row\" formGroupName=\"billingDetails\">\n                      <div class=\"form-group\"\n                           [ngClass]=\"{'col-xs-8':CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN', 'col-xs-12': CreateInvoiceForm.controls['userDetails'].get('countryCode').value !== 'IN' }\">\n                        <label>Billing Address</label>\n                        <textarea formControlName=\"address\" (keyup)=\"autoFillShippingDetails()\" class=\"form-control\"\n                                  rows=\"{{ CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN' ? 5 : 3}}\"></textarea>\n                      </div>\n                      <div class=\"form-group col-xs-4\"\n                           *ngIf=\"CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN'\">\n                        <div>\n                          <label>State</label>\n                          <sh-select formControlName=\"stateCode\" (selected)=\"autoFillShippingDetails()\" #statesBilling\n                                     class=\"splSales\" [options]=\"statesSource$ | async\" [width]=\"139\"></sh-select>\n                        </div>\n                        <div class=\"mrT2\">\n                          <label>GSTIN</label>\n                          <input formControlName=\"gstNumber\" maxLength=\"15\" type=\"text\" class=\"form-control\"\n                                 (keyup)=\"getStateCode('billingDetails', statesBilling); autoFillShippingDetails()\"/>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"\"\n                       [ngClass]=\"{'col-xs-6':CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN', 'col-xs-4': CreateInvoiceForm.controls['userDetails'].get('countryCode').value !== 'IN' }\">\n                    <div class=\"row\" formGroupName=\"shippingDetails\">\n                      <div class=\"form-group\"\n                           [ngClass]=\"{'col-xs-8':CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN', 'col-xs-12': CreateInvoiceForm.controls['userDetails'].get('countryCode').value !== 'IN' }\">\n                        <label style=\"width:340px;\">\n                          <input type=\"checkbox\" (change)=\"autoFillShippingDetails()\"\n                                 formControlName=\"autoFillShipping\"> Shipping Address Same as Billing Address</label>\n                        <textarea formControlName=\"address\"\n                                  [readonly]=\"CreateInvoiceForm.get('userDetails')['controls']['shippingDetails'].get('autoFillShipping').value\"\n                                  class=\"form-control\"\n                                  rows=\"{{ CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN' ? 5 : 3}}\"></textarea>\n                      </div>\n                      <div class=\"form-group col-xs-4\"\n                           *ngIf=\"CreateInvoiceForm.controls['userDetails'].get('countryCode').value === 'IN'\">\n                        <div>\n                          <label>State</label>\n                          <sh-select formControlName=\"stateCode\"\n                                     [disabled]=\"CreateInvoiceForm.controls['userDetails'].get('shippingDetails').controls['autoFillShipping'].value\"\n                                     #statesShipping class=\"splSales\" [options]=\"statesSource$ | async\"></sh-select>\n                        </div>\n                        <div class=\"mrT2\">\n                          <label>GSTIN</label>\n                          <input formControlName=\"gstNumber\"\n                                 [readonly]=\"CreateInvoiceForm.controls['userDetails'].get('shippingDetails').controls['autoFillShipping'].value\"\n                                 maxLength=\"15\" type=\"text\" class=\"form-control\"\n                                 (keyup)=\"getStateCode('shippingDetails', statesShipping)\"\n                          />\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- end row -->\n            </div>\n          </div>\n        </div>\n\n        <!-- end mailing address collapse pane -->\n\n        <!-- start general detail -->\n        <div class=\"col-xs-12\">\n          <div class=\"collapse-pane clearfix\">\n            <div class=\"collapse-pane-heading\">\n              <div class=\"ico-box-wrap\" (click)=\"isGenDtlCollapsed = !isGenDtlCollapsed\">\n                <div class=\"ico-box\">\n                  <span [ngClass]=\"isGenDtlCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                </div>\n                <span class=\"ico-head\">Invoice Details</span>\n              </div>\n\n            </div>\n            <div [collapse]=\"isGenDtlCollapsed\" class=\"clearfix pdL3 pdR3 col-xs-12 mr0\">\n              <div class=\"row mt13\">\n                <!-- <div class=\"form-group col-xs-4\">\n    <label>Attention to</label>\n    <input type=\"text\" name=\"accountDetails.attention\" class=\"form-control\" [(ngModel)]=\"invFormData.accountDetails.attentionTo\" />\n</div> -->\n                <!-- <div class=\"col-xs-6\">\n    <div class=\"row\">\n        <ng-container formGroupName=\"companyDetails\">\n            <div class=\"form-group col-xs-6\">\n                <label>Company name <sup>*</sup></label>\n                <input type=\"text\" class=\"form-control\" formControlName=\"name\" [ngClass]=\"{ 'has-error': isFormSubmitted && CreateInvoiceForm.controls['companyDetails'].get('name').invalid }\" />\n            </div>\n        </ng-container>\n\n        <div class=\"form-group col-xs-6\" formGroupName=\"userDetails\">\n            <label>Country <sup>*</sup></label>\n            <sh-select class=\"sh-form_control\" formControlName=\"countryCode\" [options]=\"countrySource\" [ngClass]=\"{ 'has-error': isFormSubmitted && CreateInvoiceForm.controls['userDetails'].get('countryCode').invalid }\"></sh-select>\n        </div>\n        <ng-container formGroupName=\"companyDetails\">\n            <div class=\"form-group col-xs-12\">\n                <label>Address</label>\n                <textarea class=\"form-control\" formControlName=\"address\" rows=\"3\"></textarea>\n            </div>\n        </ng-container>\n    </div>\n</div> -->\n                <div class=\"col-xs-12\">\n                  <div class=\"row\">\n                    <ng-container formGroupName=\"invoiceDetails\">\n                      <div class=\"form-group col-xs-2\"\n                           [ngClass]=\"{ 'has-error': isFormSubmitted && CreateInvoiceForm.controls['invoiceDetails'].get('invoiceNumber').invalid }\">\n                        <label>Invoice Number\n                          <sup>*</sup>\n                        </label>\n                        <input type=\"text\" class=\"form-control\" formControlName=\"invoiceNumber\"/>\n                      </div>\n                      <div class=\"form-group col-xs-2\">\n                        <label>Invoice Date</label>\n                        <input type=\"text\" [placeholder]=\"giddhDateFormat\" formControlName=\"invoiceDate\"\n                               class=\"form-control\" bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\">\n                      </div>\n                      <div class=\"form-group col-xs-2\">\n                        <label>Due Date</label>\n                        <input type=\"text\" [placeholder]=\"giddhDateFormat\" formControlName=\"dueDate\"\n                               class=\"form-control\" bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"/>\n                      </div>\n                    </ng-container>\n                    <ng-container formGroupName=\"other\">\n                      <div class=\"form-group col-xs-2\">\n                        <label>Ship Date</label>\n                        <input type=\"text\" [placeholder]=\"giddhDateFormat\" formControlName=\"shippingDate\"\n                               class=\"form-control\" bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"/>\n                      </div>\n                      <div class=\"form-group col-xs-2\">\n                        <label>Ship Via</label>\n                        <input type=\"text\" class=\"form-control\" formControlName=\"shippedVia\"/>\n                      </div>\n                      <div class=\"form-group col-xs-2\">\n                        <label>Tracking No.</label>\n                        <input type=\"text\" class=\"form-control\" formControlName=\"trackingNumber\"/>\n                      </div>\n                    </ng-container>\n\n                  </div>\n                </div>\n\n\n              </div>\n            </div>\n          </div>\n        </div>\n      </section>\n    </div>\n  </div>\n  <div class=\"row mrT\">\n    <section class=\"clearfix pd1 pdB2 mrB2 whiteBg\">\n      <div class=\"container\">\n        <table class=\"table\" formArrayName=\"entries\">\n          <thead>\n          <tr>\n            <td>#</td>\n            <td>Date</td>\n            <td>Description</td>\n            <td class=\"text-right\">Quantity</td>\n            <td class=\"text-right\">Rate</td>\n            <td class=\"text-right\">Discount</td>\n            <td class=\"text-right\">Tax</td>\n            <td class=\"text-right\">Amount</td>\n          </tr>\n          </thead>\n          <tbody\n            *ngFor=\"let entry of CreateInvoiceForm.get('entries')['controls']; let entryIdx = index; let first = first; let last = last\">\n          <tr [formGroupName]=\"entryIdx\">\n            <td>{{ entryIdx+1 }}</td>\n            <td width=\"128px\">\n              <input type=\"text\" formControlName=\"entryDate\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                     class=\"form-control text-left\" [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"/>\n            </td>\n            <td>\n              <input type=\"text\" formControlName=\"description\" placeholder=\"Description\" class=\"form-control\"/>\n            </td>\n            <td width=\"93px\">\n              <input type=\"text\" (keyup)=\"processRateAndQuantity(entryIdx)\" formControlName=\"quantity\"\n                     placeholder=\"Quantity\" class=\"form-control text-right\"/>\n            </td>\n            <td width=\"100px\">\n              <input type=\"text\" (keyup)=\"processRateAndQuantity(entryIdx)\" formControlName=\"rate\" placeholder=\"Rate\"\n                     class=\"form-control  text-right\"/>\n            </td>\n            <td width=\"100px\">\n              <input type=\"text\" (keyup)=\"calculateAndSetTotal()\" formControlName=\"discount\" placeholder=\"Discount\"\n                     class=\"form-control  text-right\"/>\n            </td>\n            <td width=\"100px\">\n              <input type=\"text\" (keyup)=\"processTax(entryIdx)\" formControlName=\"tax\" placeholder=\"Tax\"\n                     class=\"form-control  text-right\"/>\n            </td>\n            <td width=\"108px\">\n              <input type=\"text\" (keyup)=\"calculateAndSetTotal()\" formControlName=\"amount\" placeholder=\"Amount\"\n                     class=\"form-control  text-right\"/>\n            </td>\n            <!-- <td>\n<div class=\"\">\n<input type=\"text\" [hidden]=\"transaction.hsnOrSac !== 'hsn'\" readonly maxLength=\"10\" placeholder=\"HSN/SAC\" name=\"transaction.hsnNumber_{{entryIdx}}\"\n  class=\"form-control text-right\" [(ngModel)]=\"transaction.hsnNumber\" />\n<input type=\"text\" [hidden]=\"transaction.hsnOrSac !== 'sac'\" readonly maxLength=\"10\" placeholder=\"HSN/SAC\" name=\"transaction.sacNumber_{{entryIdx}}\"\n  class=\"form-control text-right\" [(ngModel)]=\"transaction.sacNumber\" />\n</div>\n</td> -->\n\n            <!-- show/hide fields -->\n            <!-- <td class=\"nested-table-wrap\">\n<table width=\"100%\" cellspacing=\"0\" cellspadding=\"0\">\n<tbody>\n  <tr>\n    <td *ngIf=\"transaction.isStockTxn\">\n      <table class=\"nested-table\" width=\"100%\" cellspacing=\"0\" cellspadding=\"0\">\n        <tbody>\n          <tr>\n            <td width=\"25%\">\n              <input type=\"number\" (keyup)=\"txnChangeOccurred()\" (ngModelChange)=\"transaction.setAmount(entry)\" placeholder=\"Quantity\"\n                name=\"transaction.quantity_{{entryIdx}}\" class=\"form-control text-right\" [(ngModel)]=\"transaction.quantity\"\n              />\n            </td>\n            <td width=\"25%\">\n              <select class=\"form-control\" name=\"transaction.stockUnit_{{entryIdx}}\" [(ngModel)]=\"transaction.stockUnit\">\n                <option *ngFor=\"let stock of transaction.stockList\" [ngValue]=\"stock.id\">{{stock.text}}</option>\n              </select>\n            </td>\n            <td width=\"25%\">\n              <input type=\"number\" (ngModelChange)=\"transaction.setAmount(entry)\" (keyup)=\"txnChangeOccurred()\" placeholder=\"Rate\" name=\"transaction.rate_{{entryIdx}}\"\n                class=\"form-control text-right\" [(ngModel)]=\"transaction.rate\" />\n            </td>\n            <td width=\"25%\">\n              <input type=\"number\" disabled=\"true\" name=\"transaction.amount_{{entryIdx}}\" class=\"form-control text-right\" [(ngModel)]=\"transaction.amount\"\n              />\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </td>\n    <td *ngIf=\"!transaction.isStockTxn\">\n      <table class=\"nested-table\" width=\"100%\" cellspacing=\"0\" cellspadding=\"0\">\n        <tbody>\n          <tr>\n            <td width=\"25%\">\n              <input type=\"text\" disabled=\"true\" class=\"form-control text-right\" />\n            </td>\n            <td width=\"25%\">\n              <input type=\"text\" disabled=\"true\" class=\"form-control text-right\" />\n            </td>\n            <td width=\"25%\">\n              <input type=\"text\" disabled=\"true\" class=\"form-control text-right\" />\n            </td>\n            <td width=\"25%\">\n              <input type=\"number\" (ngModelChange)=\"transaction.setAmount(entry)\" (keyup)=\"txnChangeOccurred()\" placeholder=\"Amount\" name=\"transaction.amount_{{entryIdx}}\"\n                class=\"form-control text-right\" [(ngModel)]=\"transaction.amount\" />\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </td>\n  </tr>\n</tbody>\n</table>\n</td> -->\n            <!-- <td> -->\n            <!-- <discount-list (selectedDiscountItems)=\"selectedDiscountEvent($event, transaction, entry)\"></discount-list> -->\n            <!-- </td> -->\n            <!-- <td>\n<input type=\"number\" name=\"transaction.taxableValue_{{entryIdx}}\" class=\"form-control text-right\" readonly [(ngModel)]=\"transaction.taxableValue\" />\n</td> -->\n            <!-- <td class=\"tax-list-dd-wrap dropdown-container\"> -->\n            <!-- <sales-tax-list\nclass=\"salesTax\"\n[showTaxPopup]=\"false\"\n[taxes]=\"companyTaxesList$ | async\"\n[applicableTaxes]=\"transaction.applicableTaxes\"\n[taxListAutoRender]=\"transaction.taxRenderData\"\n(selectedTaxEvent)=\"selectedTaxEvent($event, entry)\"\n(taxAmountSumEvent)=\"taxAmountEvent($event, transaction, entry)\">\n</sales-tax-list> -->\n            <!-- </td> -->\n            <!-- <td>\n<input type=\"number\" name=\"transaction.total_{{entryIdx}}\" class=\"form-control text-right\" readonly [(ngModel)]=\"transaction.total\"\n/>\n</td>-->\n            <td class=\"action-panel-td alR\">\n                                <span class=\"cp\" *ngIf=\"last\" (click)=\"addBlankRow()\">\n                  <i class=\"icon-add\" aria-hidden=\"true\"></i>\n                </span>\n              <span class=\"cp\" *ngIf=\"!last\" (click)=\"removeTransaction(entryIdx)\">\n                  <i class=\"icon-cross\" aria-hidden=\"true\"></i>\n                </span>\n            </td>\n          </tr>\n          </tbody>\n        </table>\n\n        <!-- sub total and total calc -->\n        <table class=\"table\">\n          <tbody>\n          <tr>\n            <td width=\"50%\" formGroupName=\"other\">\n              <div class=\"col-xs-8 pdT1\">\n                <label class=\"mrB1\">Message</label>\n                <textarea style=\"height:140px\" class=\"form-control\" formControlName=\"note2\"></textarea>\n              </div>\n            </td>\n            <td width=\"50%\" formGroupName=\"uiCalculation\">\n              <section class=\"tableSec\">\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">Total Amount</div>\n                  <div class=\"tableCell figureCell\">{{CreateInvoiceForm.controls['uiCalculation'].get('subTotal').value\n                    | number:'1.2-2'}}\n                  </div>\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">Discount</div>\n                  <div class=\"tableCell figureCell\">\n                    {{CreateInvoiceForm.controls['uiCalculation'].get('totalDiscount').value | number:'1.2-2'}}\n                  </div>\n\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">Taxable Value</div>\n                  <div class=\"tableCell figureCell\">\n                    {{CreateInvoiceForm.controls['uiCalculation'].get('totalTaxableValue').value | number:'1.2-2'}}\n                  </div>\n\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">Tax</div>\n                  <div class=\"tableCell figureCell\">\n                    {{CreateInvoiceForm.controls['uiCalculation'].get('gstTaxesTotal').value | number:'1.2-2'}}\n                  </div>\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">\n                    <strong>Total</strong>\n                  </div>\n                  <div class=\"tableCell figureCell\">\n                    <strong>{{CreateInvoiceForm.controls['uiCalculation'].get('grandTotal').value |\n                      number:'1.2-2'}}</strong>\n                  </div>\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">Deposit</div>\n                  <div class=\"tableCell figureCell\">\n                    <input type=\"number\" placeholder=\"Amount\" class=\"form-control\" formControlName=\"depositAmount\"/>\n                  </div>\n                </div>\n                <div class=\"tableRow\">\n                  <div class=\"tableCell\">\n                    <strong>Balance Due</strong>\n                  </div>\n                  <div class=\"tableCell figureCell\">\n                    <strong>{{CreateInvoiceForm.controls['uiCalculation'].get('balanceDue').value |\n                      number:'1.2-2'}}</strong>\n                  </div>\n                </div>\n              </section>\n            </td>\n          </tr>\n          </tbody>\n        </table>\n      </div>\n      <!-- end -->\n    </section>\n  </div>\n\n</form>\n\n\n<section class=\"\">\n  <section id=\"actionPane\" class=\"text-center\">\n    <div class=\"container\">\n      <div class=\"pull-right pr\">\n        <!-- <button type=\"button\" (click)=\"resetInvoiceForm(invoiceForm)\" class=\"btn btn-danger\">Clear</button>\n  <button type=\"button\" (click)=\"triggerSubmitInvoiceForm(invoiceForm)\" class=\"btn btn-default\">Generate {{toggleActionText}} &amp; Update A/c</button> -->\n        <button type=\"submit\" class=\"btn btn-success\" (click)=\"onSubmitInvoiceForm(invoiceForm)\">Generate Invoice\n        </button>\n      </div>\n    </div>\n  </section>\n</section>\n<div bsModal #invoicePreviewModal=\"bs-modal\" [config]=\"{ keyboard: true }\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\" style=\"height: 100%;\">\n    <div *ngIf=\"base64Data\" class=\"modal-content\">\n      <iframe width=\"100%\" height=\"600px\" name=\"plugin\" [attr.src]=\"base64Data\" type=\"application/pdf\"></iframe>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/create/components/invoice/templates/letter/letter.template.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/letter/letter.template.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#template-3 .logo-wrap {\n  width: 120px; }\n  #template-3 .logo-wrap figure {\n    height: 50px;\n    overflow: hidden; }\n  #template-3 .logo {\n  max-width: 120px;\n  width: 100%;\n  max-height: 75px;\n  -o-object-fit: contain;\n     object-fit: contain; }\n  #template-3 .item {\n  table-layout: fixed !important; }\n  #template-3 .item tbody tr td {\n    text-align: right;\n    padding: 3px 0; }\n  #template-3 .item thead tr th {\n    text-align: right;\n    padding: 14px 0;\n    border: 0;\n    border-bottom: 1px solid #666666;\n    line-height: 1.2rem;\n    font-weight: bold; }\n  #template-3 .item tfoot tr th {\n    padding: 0px 0; }\n  #template-3 .item tfoot tr:last-child th {\n    border: 0;\n    border-top: 1px solid #666666;\n    padding: 4px 0;\n    line-height: 1.2rem;\n    vertical-align: middle; }\n  #template-3 .meta {\n  margin: 20px 0; }\n  #template-3 .meta h4 {\n    font-weight: bold;\n    font-size: 18px;\n    line-height: 19px; }\n  #template-3 .product-table {\n  background: #df49270d;\n  position: relative;\n  padding-bottom: 10px; }\n  #template-3 .product-table:before {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    content: ' ';\n    left: -20px;\n    width: 105.1%;\n    z-index: -1; }\n  #template-3 .product-table tbody tr:last-child td {\n    padding-bottom: 50px; }\n  #template-3 .product-table tfoot tr:last-child th {\n    border-top: 0; }\n  #template-3 .product-table tfoot tr:last-child th:last-child {\n      border-top: 1px solid #666666;\n      border-bottom: 4px double #666666; }\n  #template-3 .inwords {\n  color: #939393; }\n  #template-3 .tax-table p {\n  color: #595959; }\n  #template-3 .tax-table tfoot th {\n  font-weight: bold; }\n  #template-3 .subfooter {\n  margin-top: 100px; }\n  #template-3 .subfooter h1 {\n    font-size: 24px;\n    margin: 10px 0 0; }\n  #template-3 .subfooter .normal {\n    font-size: 12px;\n    vertical-align: baseline; }\n  #template-3 .vmiddle {\n  vertical-align: middle; }\n  #template-3 .note {\n  margin-top: 20px;\n  padding-left: 15px; }\n  #template-3 .note li {\n    list-style-type: initial; }\n  /**\n# margin mixin pass direction and number\n*/\n  /**\n# padding mixin pass direction and number\n*/\n  .whiteBg {\n  background-color: white; }\n  .cp, .collapse-pane .collapse-pane-heading .ico-box-wrap,\n.collapse-pane .collapse-pane-heading .ico-head {\n  cursor: pointer; }\n  .mrT27 {\n  margin-top: 27px; }\n  .wid90p {\n  width: 91.66666667%; }\n  .flex-row {\n  display: flex; }\n  .flex-row .flex-row-child {\n    align-self: center;\n    flex-grow: 0; }\n  .pure-css-select-wrapper {\n  position: relative;\n  display: block;\n  width: 20em;\n  height: 3em;\n  line-height: 3;\n  overflow: hidden;\n  border-radius: .25em;\n  /* Reset Select */\n  /* Arrow */\n  /* Transition */ }\n  .pure-css-select-wrapper select {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    -ms-appearance: none;\n    outline: 0;\n    box-shadow: none;\n    border: 0 !important;\n    background: transparent;\n    background-image: none;\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    padding: 0 0 0 .5em;\n    cursor: pointer; }\n  .pure-css-select-wrapper select::-ms-expand {\n    display: none; }\n  .pure-css-select-wrapper::after {\n    content: '\\25BC';\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    padding: 0 1em;\n    color: #cccccc;\n    pointer-events: none; }\n  .pure-css-select-wrapper:hover::after {\n    color: #bbbbbb; }\n  .pure-css-select-wrapper::after {\n    transition: .25s all ease; }\n  .form-group .form-control {\n  border-radius: 3px; }\n  .form-group textarea.form-control {\n  resize: none; }\n  .form-group label {\n  display: block;\n  font-weight: 400;\n  margin-bottom: 5px; }\n  .form-group.size_175 input:not([type='checkbox']),\n.form-group.size_175 select,\n.form-group.size_175 textarea {\n  width: 175px; }\n  .form-group.size_240 input:not([type='checkbox']),\n.form-group.size_240 select,\n.form-group.size_240 textarea {\n  width: 240px; }\n  .form-group.size_340 input:not([type='checkbox']),\n.form-group.size_340 select,\n.form-group.size_340 textarea {\n  width: 340px; }\n  .form-group.size_380 input:not([type='checkbox']),\n.form-group.size_380 select,\n.form-group.size_380 textarea {\n  width: 380px; }\n  .form-group.noMarg {\n  margin: 0; }\n  .form-group .form-control.voucher-selector {\n  width: 200px;\n  text-transform: capitalize; }\n  .form-inline .form-group {\n  vertical-align: top; }\n  .form-inline .form-control {\n  width: 100%; }\n  #actionPane {\n  height: 80px;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n  position: fixed;\n  padding: 20px 0;\n  background-color: #444; }\n  .dropup .dropdown-menu {\n  left: -80px; }\n  .collapse-pane {\n  padding: 7px 0; }\n  .collapse-pane .collapse-pane-heading {\n    margin-bottom: 0px;\n    color: #fe5f00;\n    display: flex;\n    align-items: center;\n    height: 30px; }\n  .collapse-pane .collapse-pane-heading .ico-box-wrap,\n    .collapse-pane .collapse-pane-heading .ico-head {\n      align-self: stretch;\n      display: flex;\n      align-items: center; }\n  .collapse-pane .collapse-pane-heading .ico-box {\n      border: 1px solid #fe5f00;\n      width: 20px;\n      height: 20px;\n      margin-right: 10px;\n      border-radius: 3px;\n      align-self: center;\n      display: flex;\n      justify-content: center; }\n  .collapse-pane .collapse-pane-heading .ico-box span {\n        align-self: center;\n        font-size: 12px; }\n  .action-panel-td {\n  width: 80px; }\n  .action-panel-td span {\n    padding: 5px;\n    display: inline-block; }\n  .nested-table-wrap {\n  padding: 8px 0; }\n  .nested-table th,\n.nested-table td {\n  padding: 0 8px; }\n  .list-item {\n  font-size: 14px; }\n  .fs12 {\n  font-size: 12px; }\n  .fs11 {\n  font-size: 11px; }\n  .tableSec {\n  display: table;\n  width: 100%;\n  font-size: 14px; }\n  .tableSec .tableRow {\n    display: table-row;\n    vertical-align: top; }\n  .tableSec .tableRow .tableCell {\n      vertical-align: middle;\n      text-align: right;\n      padding-bottom: 7px;\n      display: table-cell; }\n  .tableSec .tableRow .figureCell {\n      width: 200px;\n      padding-right: 80px; }\n  .tableSec .tableRow .figureCell input {\n        width: 100px;\n        float: right;\n        text-align: right; }\n  .table tbody + tbody {\n  border: 0; }\n  ng-select.splSales {\n  width: 100%; }\n  [data-field=\"HSN/SAC\"],\n[data-field=\"Qty.\"],\n[data-field=\"Unit\"],\n[data-field=\"Rate\"],\n[data-field=\"Amount\"],\n[data-field=\"Discount\"],\n[data-field=\"Taxable\"],\n[data-field=\"Tax\"],\n[data-field=\"Total\"],\n[data-field=\"S.No\"] {\n  text-align: right; }\n  .table > thead > tr th {\n  font-weight: 100; }\n  .salesTax .taxInput {\n  text-align: right; }\n  :host ::ng-deep .form-inline sh-select .form-control {\n  width: 100%; }\n  .form-container {\n  margin-bottom: 80px; }\n  .mt13 {\n  margin-top: 13px; }\n  .mt30 {\n  margin-top: 30px; }\n  :host ::ng-deep .has-error .form-control {\n  border-color: red !important; }\n"

/***/ }),

/***/ "./src/app/create/components/invoice/templates/letter/letter.template.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/letter/letter.template.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: LetterTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LetterTemplateComponent", function() { return LetterTemplateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _create_http_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../create-http-service */ "./src/app/create/create-http-service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../shared/helpers/countryWithCodes */ "./src/app/shared/helpers/countryWithCodes.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");















var LetterTemplateComponent = /** @class */ (function () {
    function LetterTemplateComponent(_sanitizer, _createHttpService, _toasty, fb, store, generalAction) {
        this._sanitizer = _sanitizer;
        this._createHttpService = _createHttpService;
        this._toasty = _toasty;
        this.fb = fb;
        this.store = store;
        this.generalAction = generalAction;
        this.closeAndDestroyComponent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isGenDtlCollapsed = false;
        this.isMlngAddrCollapsed = false;
        this.isOthrDtlCollapsed = false;
        this.isCustDtlCollapsed = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.name = 'August 09, 2017';
        this.name1 = 'GSTIN: 11AAAAAA000A1Z0';
        this.name2 = 'PAN: AAACW9768L';
        this.base64Data = '';
        this.css = "  <style>\n  .logo-wrap {\n    width: 120px;\n  }\n  figure {\n      height: 50px;\n      overflow: hidden;\n    }\n</style>";
        this.typeaheadNoResultsOfCustomer = false;
        this.pageList = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VOUCHER_TYPE_LIST"];
        this.selectedPage = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VOUCHER_TYPE_LIST"][0].value;
        this.updateAccount = false;
        this.countrySource = [];
        this.giddhDateFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"];
        this.giddhDateFormatUI = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT_UI"];
        this.autoFillShipping = true;
        this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        this.isFormSubmitted = false;
        this.isIndia = false;
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VoucherClass"]();
        this.setCreateInvoiceForm();
    }
    LetterTemplateComponent.prototype.readUrl = function (event) {
        var _this = this;
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (item) {
                _this.logoPath = item.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    LetterTemplateComponent.prototype.clearUploadedImg = function () {
        this.logoPath = null;
    };
    LetterTemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch(this.generalAction.getAllState());
        this.data = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VoucherClass"]();
        // bind countries
        _shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_12__["contriesWithCodes"].map(function (c) {
            _this.countrySource.push({ value: c.countryflag, label: c.countryflag + " - " + c.countryName });
        });
        // bind state sources
        this.store.select(function (p) { return p.general.states; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (states) {
            var arr = [];
            if (states) {
                states.map(function (d) {
                    arr.push({ label: d.code + " - " + d.name, value: d.code });
                });
            }
            _this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(arr);
        });
        this.CreateInvoiceForm.get('uiCalculation').get('depositAmount').valueChanges.subscribe(function (val) {
            var data = _.cloneDeep(_this.CreateInvoiceForm.value);
            var totalAmountWithTax = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.amount)) ? 0 : parseFloat(entry.amount); });
            var balanceDue = totalAmountWithTax - val;
            _this.CreateInvoiceForm.get('uiCalculation').get('balanceDue').patchValue(balanceDue);
        });
    };
    LetterTemplateComponent.prototype.ngOnDestroy = function () {
        //
    };
    LetterTemplateComponent.prototype.emitTemplateData = function (data) {
        var _this = this;
        this.isFormSubmitted = true;
        this.isGenDtlCollapsed = false;
        this.isMlngAddrCollapsed = false;
        this.isOthrDtlCollapsed = false;
        this.isCustDtlCollapsed = false;
        if (this.CreateInvoiceForm.valid) {
            this._createHttpService.Generate(data).subscribe(function (response) {
                if (response.status === 'success') {
                    _this.base64Data = _this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.body);
                    _this.invoicePreviewModal.show();
                }
                else if (response.status === 'error') {
                    _this._toasty.errorToast(response.message, response.code);
                }
            });
        }
        else {
            this._toasty.errorToast('Please fill are red marked fields.', 'Validation check');
        }
    };
    LetterTemplateComponent.prototype.doDestroy = function () {
        this.closeAndDestroyComponent.emit(true);
    };
    /////// Taken from Sales ////////
    LetterTemplateComponent.prototype.onSubmitInvoiceForm = function (f) {
        var data = _.cloneDeep(this.CreateInvoiceForm.value);
        // console.log('data is :', data.invoiceDetails.dueDate);
        data.invoiceDetails.dueDate = data.invoiceDetails.dueDate ? moment__WEBPACK_IMPORTED_MODULE_10__(data.invoiceDetails.dueDate).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"]) : '';
        data.invoiceDetails.invoiceDate = data.invoiceDetails.invoiceDate ? moment__WEBPACK_IMPORTED_MODULE_10__(data.invoiceDetails.invoiceDate).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"]) : '';
        data.other.shippingDate = data.other.shippingDate ? moment__WEBPACK_IMPORTED_MODULE_10__(data.other.shippingDate).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"]) : '';
        data.entries.forEach(function (entry) {
            entry.entryDate = entry.entryDate ? moment__WEBPACK_IMPORTED_MODULE_10__(entry.entryDate).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"]) : '';
        });
        data.userDetails.billingDetails.address = data.userDetails.billingDetails.address ? [data.userDetails.billingDetails.address] : null;
        data.userDetails.shippingDetails.address = data.userDetails.shippingDetails.address ? [data.userDetails.shippingDetails.address] : null;
        data.companyDetails.address = data.companyDetails.address ? [data.companyDetails.address] : null;
        data.companyDetails.companyGstDetails.address = data.companyDetails.companyGstDetails.address ? [data.companyDetails.companyGstDetails.address] : null;
        // console.log('data after conversion is :', data);
        this.emitTemplateData(data);
    };
    LetterTemplateComponent.prototype.convertDateForAPI = function (val) {
        if (val) {
            try {
                return moment__WEBPACK_IMPORTED_MODULE_10__(val).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_11__["GIDDH_DATE_FORMAT"]);
            }
            catch (error) {
                return '';
            }
        }
        else {
            return '';
        }
    };
    LetterTemplateComponent.prototype.resetInvoiceForm = function (f) {
        f.form.reset();
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VoucherClass"]();
        // toggle all collapse
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = true;
    };
    LetterTemplateComponent.prototype.addBlankRow = function () {
        this.calculateAndSetTotal();
        var transactionEntries = this.CreateInvoiceForm.controls['entries'];
        transactionEntries.push(this.returnArrayData());
    };
    LetterTemplateComponent.prototype.calculateAndSetTotal = function () {
        var data = _.cloneDeep(this.CreateInvoiceForm.value);
        var totalAmount = 0;
        data.entries.forEach(function (entry) {
            totalAmount = totalAmount + (entry.quantity * entry.rate) - (entry.discount); // Amount without tax
        });
        var totalQuantity = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.quantity)) ? 0 : parseFloat(entry.quantity); });
        var totalRate = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.rate)) ? 0 : parseFloat(entry.rate); });
        var totalAmountWithTax = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.amount)) ? 0 : parseFloat(entry.amount); });
        var totalDiscount = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.discount)) ? 0 : parseFloat(entry.discount); });
        var gstTaxesTotal = _.sumBy(data.entries, function (entry) { return isNaN(parseFloat(entry.tax)) ? 0 : parseFloat(entry.tax); });
        this.CreateInvoiceForm.get('uiCalculation').get('subTotal').patchValue(totalAmount);
        this.CreateInvoiceForm.get('uiCalculation').get('totalTaxableValue').patchValue(totalAmount);
        this.CreateInvoiceForm.get('uiCalculation').get('grandTotal').patchValue(totalAmountWithTax);
        this.CreateInvoiceForm.get('uiCalculation').get('totalDiscount').patchValue(totalDiscount);
        this.CreateInvoiceForm.get('uiCalculation').get('gstTaxesTotal').patchValue(gstTaxesTotal);
    };
    LetterTemplateComponent.prototype.autoFillShippingDetails = function () {
        // auto fill shipping address
        // this.autoFillShipping
        // this.CreateInvoiceForm.get('userDetails').get('shippingDetails').get('autoFillShipping').value
        if (this.CreateInvoiceForm.get('userDetails').get('shippingDetails').get('autoFillShipping').value) {
            var billingDetails = this.CreateInvoiceForm.get('userDetails').get('billingDetails').value;
            this.CreateInvoiceForm.get('userDetails').get('shippingDetails').patchValue(billingDetails);
            // this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
        }
    };
    LetterTemplateComponent.prototype.removeTransaction = function (entryIdx) {
        var transactionEntries = this.CreateInvoiceForm.controls['entries'];
        if (transactionEntries.length > 1) {
            transactionEntries.removeAt(entryIdx);
        }
        else {
            this._toasty.warningToast('Unable to delete a single transaction');
        }
        this.calculateAndSetTotal();
    };
    ////////// Reactive form //////////////
    LetterTemplateComponent.prototype.returnArrayData = function () {
        return this.fb.group({
            entryDate: '',
            description: '',
            quantity: 0,
            rate: 0,
            discount: 0,
            tax: 0,
            amount: 0
        });
    };
    LetterTemplateComponent.prototype.setCreateInvoiceForm = function () {
        this.CreateInvoiceForm = this.fb.group({
            entries: this.fb.array([this.returnArrayData()]),
            userDetails: this.fb.group({
                countryCode: ['IN', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
                userName: [''],
                userEmail: '',
                userMobileNumber: '',
                userCompanyName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
                billingDetails: this.fb.group({
                    gstNumber: null,
                    address: null,
                    stateCode: null,
                    stateName: null,
                    panNumber: null
                }),
                shippingDetails: this.fb.group({
                    autoFillShipping: false,
                    gstNumber: null,
                    address: null,
                    stateCode: null,
                    stateName: null,
                    panNumber: null
                })
            }),
            companyDetails: this.fb.group({
                name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
                address: null,
                companyGstDetails: this.fb.group({
                    gstNumber: null,
                    address: null,
                    stateCode: null,
                    stateName: null,
                    panNumber: null
                })
            }),
            signature: this.fb.group({
                slogan: null,
                ownerName: '',
                signatureImage: null
            }),
            invoiceDetails: this.fb.group({
                invoiceNumber: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
                invoiceDate: null,
                dueDate: null
            }),
            other: this.fb.group({
                senderAddress: null,
                note1: null,
                note2: null,
                shippingDate: null,
                shippedVia: null,
                trackingNumber: null,
                customFields: this.fb.group({
                    customField1: null,
                    customFieldLabel1: null,
                    customField2: null,
                    customFieldLabel2: null,
                    customField3: null,
                    customFieldLabel3: null
                })
            }),
            uiCalculation: this.fb.group({
                subTotal: 0,
                totalDiscount: 0,
                totalTaxableValue: 0,
                gstTaxesTotal: 0,
                grandTotal: 0,
                dueAmount: null,
                balanceDue: 0,
                depositAmount: 0
            })
        });
    };
    LetterTemplateComponent.prototype.getStateCode = function (type, statesEle) {
        var _this = this;
        var allData = _.cloneDeep(this.CreateInvoiceForm.value);
        var gstVal;
        if (type === 'senderInfo') {
            gstVal = allData.companyDetails.companyGstDetails.gstNumber;
        }
        else {
            gstVal = allData.userDetails[type].gstNumber;
        }
        // let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
        if (gstVal.length >= 2) {
            this.statesSource$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (st) {
                var s = st.find(function (item) { return item.value === gstVal.substr(0, 2); });
                if (s) {
                    if (type === 'senderInfo') {
                        _this.CreateInvoiceForm.get('companyDetails').get('companyGstDetails').get('stateCode').patchValue(s.value);
                    }
                    else {
                        _this.CreateInvoiceForm.get('userDetails').get(type).get('stateCode').patchValue(s.value);
                    }
                }
                else {
                    _this.invFormData.accountDetails[type].stateCode = null;
                    _this._toasty.clearAllToaster();
                    _this._toasty.warningToast('Invalid GSTIN.');
                }
                statesEle.disabled = true;
            });
        }
        else {
            statesEle.disabled = false;
            this.invFormData.accountDetails[type].stateCode = null;
        }
    };
    LetterTemplateComponent.prototype.setAmount = function (entry) {
        var _this = this;
        // delaying due to ngModel change
        setTimeout(function () {
            _this.taxableValue = _this.getTaxableValue(entry);
            var tax = _this.getTotalTaxOfEntry(entry.taxes);
            _this.total = _this.getTransactionTotal(tax, entry);
        }, 500);
    };
    /**
     * @param entry: SalesEntryClass object
     * @return taxable value after calculation
     * @scenerio one -- without stock entry -- amount - discount = taxableValue
     * @scenerio two -- stock entry { rate*qty -(discount) = taxableValue}
     */
    LetterTemplateComponent.prototype.getTaxableValue = function (entry) {
        var count = 0;
        if (this.quantity && this.rate) {
            this.amount = this.rate * this.quantity;
            count = this.checkForInfinity((this.rate * this.quantity) - this.getTotalDiscount(entry.discounts));
        }
        else {
            count = this.checkForInfinity(this.amount - this.getTotalDiscount(entry.discounts));
        }
        return count;
    };
    /**
     * @return numeric value
     * @param discountArr collection of discount items
     */
    LetterTemplateComponent.prototype.getTotalDiscount = function (discountArr) {
        var count = 0;
        if (discountArr.length > 0) {
            _.forEach(discountArr, function (item) {
                count += Math.abs(item.amount);
            });
        }
        return count;
    };
    LetterTemplateComponent.prototype.checkForInfinity = function (value) {
        return (value === Infinity) ? 0 : value;
    };
    LetterTemplateComponent.prototype.getTotalTaxOfEntry = function (taxArr) {
        var count = 0;
        if (taxArr.length > 0) {
            _.forEach(taxArr, function (item) {
                count += item.amount;
            });
            return this.checkForInfinity(count);
        }
        else {
            return count;
        }
    };
    LetterTemplateComponent.prototype.getTransactionTotal = function (tax, entry) {
        var count = 0;
        if (tax > 0) {
            var a = this.getTaxableValue(entry) * (tax / 100);
            a = this.checkForInfinity(a);
            var b = _.cloneDeep(this.getTaxableValue(entry));
            count = a + b;
        }
        else {
            count = _.cloneDeep(this.getTaxableValue(entry));
        }
        return Number(count.toFixed(2));
    };
    LetterTemplateComponent.prototype.sayHello = function () {
        alert('Hello');
    };
    LetterTemplateComponent.prototype.processRateAndQuantity = function (indx) {
        var transactionEntries = this.CreateInvoiceForm.controls['entries'];
        var data = _.cloneDeep(transactionEntries.value);
        var selectedRow = data[indx];
        selectedRow.amount = selectedRow.quantity * selectedRow.rate;
        data[indx] = selectedRow;
        transactionEntries.patchValue(data);
        this.calculateAndSetTotal();
    };
    LetterTemplateComponent.prototype.processTax = function (indx) {
        var transactionEntries = this.CreateInvoiceForm.controls['entries'];
        var data = _.cloneDeep(transactionEntries.value);
        var selectedRow = data[indx];
        selectedRow.amount = selectedRow.quantity * selectedRow.rate;
        // selectedRow.amount = selectedRow.amount + ((selectedRow.amount * selectedRow.tax) / 100);
        data[indx] = selectedRow;
        transactionEntries.patchValue(data);
        this.calculateAndSetTotal();
    };
    LetterTemplateComponent.prototype.txnChangeOccurred = function () {
        //
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], LetterTemplateComponent.prototype, "closeAndDestroyComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('invoicePreviewModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["ModalDirective"])
    ], LetterTemplateComponent.prototype, "invoicePreviewModal", void 0);
    LetterTemplateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'letter-template',
            template: __webpack_require__(/*! ./letter.template.component.html */ "./src/app/create/components/invoice/templates/letter/letter.template.component.html"),
            styles: [__webpack_require__(/*! ../template.component.scss */ "./src/app/create/components/invoice/templates/template.component.scss"), __webpack_require__(/*! ./letter.template.component.scss */ "./src/app/create/components/invoice/templates/letter/letter.template.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["DomSanitizer"],
            _create_http_service__WEBPACK_IMPORTED_MODULE_7__["CreateHttpService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_13__["Store"],
            _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_14__["GeneralActions"]])
    ], LetterTemplateComponent);
    return LetterTemplateComponent;
}());



/***/ }),

/***/ "./src/app/create/components/invoice/templates/sample/sample.template.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/sample/sample.template.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 alC\">\n      <h1>Hello from Sample Template</h1>\n    </div>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/create/components/invoice/templates/sample/sample.template.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/sample/sample.template.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: SampleTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SampleTemplateComponent", function() { return SampleTemplateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");



var SampleTemplateComponent = /** @class */ (function () {
    function SampleTemplateComponent() {
        this.closeAndDestroyComponent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        console.log("hello from sampleTemplateComponent");
    }
    SampleTemplateComponent.prototype.ngOnInit = function () {
        //
    };
    SampleTemplateComponent.prototype.ngOnDestroy = function () {
        //
    };
    SampleTemplateComponent.prototype.doDestroy = function () {
        this.closeAndDestroyComponent.emit(true);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SampleTemplateComponent.prototype, "closeAndDestroyComponent", void 0);
    SampleTemplateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sample-template',
            template: __webpack_require__(/*! ./sample.template.component.html */ "./src/app/create/components/invoice/templates/sample/sample.template.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SampleTemplateComponent);
    return SampleTemplateComponent;
}());



/***/ }),

/***/ "./src/app/create/components/invoice/templates/template.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/template.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"text-center\">\n  <create-invoice-header></create-invoice-header>\n</div>\n\n<section>\n  <div class=\"inv_header\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <!-- <div class=\"col-sm-12 text-center\">\n            <h1 class=\"text-center\">Follow three easy steps below to create Invoice</h1>\n        </div> -->\n        <div class=\"col-sm-12 text-center\">\n          <create-invoice-steps></create-invoice-steps>\n        </div>\n      </div>\n    </div>\n  </div>\n\n\n  <!-- <section class=\"container\">\n<div class=\"row\">\n  <div class=\"col-xs-12 alC\">\n    <div class=\"pr mrB4 clearfix mrT2\"> -->\n  <!-- <div class=\"alL col-xs-7\">\n        <h1 class=\"fs18 bdrD inline lh42\">\n          <a [routerLink]=\"['/create-invoice/invoice']\">\n            <i class=\"glyphicon glyphicon-arrow-left cp\"></i> Template LETTER\n          </a>\n        </h1>\n      </div> -->\n  <!-- <div class=\"col-sm-12 text-center\">\n          <create-invoice-steps></create-invoice-steps>\n     </div> -->\n  <!-- </div>\n  </div>\n</div>\n</section> -->\n\n\n  <section class=\"\">\n    <div class=\"\">\n      <div class=\"\">\n        <div element-view-container-ref #letterTemplateComponent=\"elementviewcontainerref\"></div>\n        <div *ngIf=\"templateId === 't002'\">You'll enjoy {{TEMPLATES[1]}} template</div>\n        <div *ngIf=\"templateId === 't003'\">You'll enjoy {{TEMPLATES[2]}} template</div>\n        <!-- download, emial, save -->\n        <!-- <div class=\"\">\n  <div class=\"clearfix\">\n    <button class=\"btn btn-primary mrB1\">Download</button>\n  </div>\n  <div class=\"clearfix\">\n    <button class=\"btn btn-success mrB1\">Send Email</button>\n  </div>\n  <button class=\"btn btn-success\">Save</button> for future reference\n</div> -->\n      </div>\n    </div>\n  </section>\n\n\n  <!-- send email modal -->\n  <div bsModal class=\"modal fade\" role=\"dialog\">\n    <div class=\"modal-dialog modal-md\">\n      <div class=\"modal-content\">\n        <div id=\"shareModal\">\n          <div id=\"share-modal\" class=\"\">\n            <div class=\"modal-header\">\n              <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">×</span>\n              <h3>Share Invoice</h3>\n            </div>\n            <div class=\"modal-body mrB4\" id=\"SharePop\">\n              <div class=\"modal_wrap\">\n                <div class=\"form-group add-mailer\">\n                  <!--share invoice from-->\n                  <form name=\"shareInvoiceForm\" novalidate=\"\" class=\"\" autocomplete=\"off\">\n                    <div class=\"form-group\">\n                      <label class=\"d-block\">From</label>\n                      <input name=\"fromEmail\" type=\"email\" required placeholder=\"Email ID\" class=\"form-control\"\n                             pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$\">\n                    </div>\n                    <div>\n                      <label class=\"d-block\">To</label>\n                      <input name=\"toEmail\" type=\"email\" required placeholder=\"Email ID\" class=\"form-control\"\n                             pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$\">\n                    </div>\n                    <div class=\"clearfix mrT1\">\n                      <button class=\"btn btn-success btn-md pull-right\" type=\"submit\">Send</button>\n                    </div>\n                  </form>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n"

/***/ }),

/***/ "./src/app/create/components/invoice/templates/template.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/template.component.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h4 {\n  font-size: 18px; }\n\n.bdrD {\n  border-bottom: 2px dotted #000; }\n\n.lh42 {\n  line-height: 42px; }\n\n/*\n* common styles related to all templates\n*/\n\n:host {\n  display: block; }\n\n.invoice_area {\n  max-width: 8.3in;\n  float: left; }\n\n.invoice_sidebar {\n  float: left;\n  margin-left: 30px; }\n\n.invoice_sidebar .form-group {\n    margin-bottom: 20px; }\n\n.invoice_sidebar .form-group .form-control {\n      background: #fff !important;\n      border: 1px solid #d6d6d6;\n      border-radius: 2px !important;\n      padding: 6px !important;\n      outline: 0;\n      color: rgba(0, 0, 0, 0.6);\n      box-shadow: none;\n      height: 34px;\n      font-size: 14px;\n      line-height: 1.42857143; }\n\n.invoice_sidebar .btn {\n    padding: 6px 16px;\n    border: 0;\n    border-radius: 2px;\n    font-size: 14px;\n    display: inline-block;\n    margin-bottom: 0;\n    font-weight: 400;\n    line-height: 1.42857143;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    cursor: pointer; }\n\n.invoice_sidebar .btn-primary {\n    background: #e5e5e5;\n    color: #ff5f00; }\n\n[id^=template-] {\n  font: 12px/1 'Open Sans', sans-serif;\n  overflow: auto;\n  background: #fff;\n  border: 1px solid #bfbfbf;\n  max-width: 8.3in;\n  width: 100%;\n  margin: 0 auto; }\n\n[id^=template-] * {\n    border: 1px solid transparent;\n    box-sizing: content-box;\n    color: #262626;\n    font-family: inherit;\n    font-size: inherit;\n    font-style: inherit;\n    font-weight: inherit;\n    line-height: inherit;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    text-decoration: none;\n    vertical-align: top; }\n\n[id^=template-] *:focus {\n      outline: 0;\n      border: 1px solid #ddd !important; }\n\n[id^=template-] header {\n    border-bottom: 1px solid #000;\n    padding: 20px 0;\n    margin: 0 10px; }\n\n[id^=template-] footer {\n    margin-top: 7px;\n    border-top: 2px solid #df4927;\n    padding: 10px 0 0;\n    line-height: 20px; }\n\n[id^=template-] .pos-rel {\n    position: relative; }\n\n[id^=template-] .pos-abs {\n    position: absolute; }\n\n[id^=template-] .primary-clr {\n    color: #df4927; }\n\n[id^=template-] .text-center {\n    text-align: center; }\n\n[id^=template-] .vbottom {\n    vertical-align: bottom; }\n\n[id^=template-] .grey_txt {\n    color: #939393; }\n\n[id^=template-] .btn-link {\n    color: #10aae0;\n    text-decoration: underline; }\n\n[id^=template-] .text-right {\n    text-align: right; }\n\n[id^=template-] .text-left {\n    text-align: left !important; }\n\n[id^=template-] .pull-right {\n    float: right; }\n\n[id^=template-] .pull-left {\n    float: left; }\n\n[id^=template-] .pull-center {\n    float: center; }\n\n[id^=template-] .mrL2 {\n    margin-left: 20px; }\n\n[id^=template-] .mrB2 {\n    margin-bottom: 20px; }\n\n[id^=template-] .mrB1 {\n    margin-bottom: 10px; }\n\n[id^=template-] .bdrB {\n    border-bottom: 1px solid #666666; }\n\n[id^=template-] .pdRL3 {\n    padding-right: 30px !important;\n    padding-left: 30px !important; }\n\n[id^=template-] .cp {\n    cursor: pointer; }\n\n[id^=template-] strong {\n    font-weight: bold; }\n\n[id^=template-] table {\n    width: 100%;\n    table-layout: fixed;\n    line-height: 20px;\n    border-collapse: inherit; }\n\n#upload_logo {\n  opacity: 0;\n  position: absolute; }\n\n#upload_label {\n  padding-left: 15px;\n  background: #f6f7f7;\n  width: auto;\n  display: inline-block;\n  line-height: 50px;\n  font-size: 16px;\n  color: #df4927;\n  border: 1px solid #df4927; }\n\n.paper_clip {\n  background: url('/./assets/images/paper-clip.png');\n  width: 28px;\n  float: right;\n  background-repeat: no-repeat;\n  height: 50px;\n  background-position: center;\n  margin-left: 15px !important;\n  padding: 0 15px !important;\n  border-left: 1px solid #df4927 !important; }\n\n.inv_header {\n  background: #FFF8EB; }\n\n.inv_header h1 {\n    font-size: 20px;\n    color: #333333;\n    font-family: 'LatoWeb';\n    padding: 0;\n    border-bottom: 1px solid #333333;\n    display: inline-block;\n    margin: 28px 0; }\n\n.inv_header span {\n    color: #E14D26;\n    border-bottom: 1px solid #E14D26;\n    display: inline-block;\n    font-family: 'LatoWeb';\n    font-size: 20px;\n    line-height: 21px;\n    padding: 0;\n    margin: 28px 0 28px 2px; }\n\n.head_inv {\n  font-size: 16px;\n  color: #333;\n  padding: 7px 0;\n  border-bottom: 1px solid #BFBFBF;\n  margin-top: 20px; }\n\n.mb20 {\n  margin-bottom: 20px; }\n"

/***/ }),

/***/ "./src/app/create/components/invoice/templates/template.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/create/components/invoice/templates/template.component.ts ***!
  \***************************************************************************/
/*! exports provided: CreateInvoiceTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateInvoiceTemplateComponent", function() { return CreateInvoiceTemplateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _letter_letter_template_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./letter/letter.template.component */ "./src/app/create/components/invoice/templates/letter/letter.template.component.ts");








var TEMPLATES = ['LETTER', 'CLASSIC', 'ROYAL'];
var TEMPLATES_ID = ['t001', 't002', 't003'];
var CreateInvoiceTemplateComponent = /** @class */ (function () {
    function CreateInvoiceTemplateComponent(_route, _router, componentFactoryResolver) {
        this._route = _route;
        this._router = _router;
        this.componentFactoryResolver = componentFactoryResolver;
        this.TEMPLATES_ID = TEMPLATES_ID;
        this.TEMPLATES = TEMPLATES;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        //
    }
    CreateInvoiceTemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('CreateInvoiceTemplateComponent loaded');
        // check if route params exist else redirect to dashboard
        this._route.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (params) {
            if (params['templateId'] && (_lodash_optimized__WEBPACK_IMPORTED_MODULE_5__["indexOf"](TEMPLATES_ID, params['templateId']) !== -1)) {
                _this.templateId = params['templateId'];
                _this.loadComponents();
            }
            else {
                _this._router.navigate(['/create-invoice/invoice']);
            }
        });
    };
    CreateInvoiceTemplateComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateInvoiceTemplateComponent.prototype.loadLetterTemplateComponent = function () {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_letter_letter_template_component__WEBPACK_IMPORTED_MODULE_7__["LetterTemplateComponent"]);
        var viewContainerRef = this.letterTemplateComponent.viewContainerRef;
        viewContainerRef.remove();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        var componentInstance = componentRef.instance;
        componentInstance.closeAndDestroyComponent.subscribe(function (data) {
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
        });
    };
    CreateInvoiceTemplateComponent.prototype.loadComponents = function () {
        switch (this.templateId) {
            case TEMPLATES_ID[0]: {
                console.log("loading template " + TEMPLATES[0] + " with template Id " + TEMPLATES_ID[0]);
                this.loadLetterTemplateComponent();
                break;
            }
            case TEMPLATES_ID[2]: {
                console.log("Hurry " + TEMPLATES_ID[1]);
                break;
            }
            case TEMPLATES_ID[3]: {
                console.log("Hurry " + TEMPLATES_ID[2]);
                break;
            }
            default:
                break;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('letterTemplateComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_6__["ElementViewContainerRef"])
    ], CreateInvoiceTemplateComponent.prototype, "letterTemplateComponent", void 0);
    CreateInvoiceTemplateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./template.component.html */ "./src/app/create/components/invoice/templates/template.component.html"),
            styles: [__webpack_require__(/*! ./template.component.scss */ "./src/app/create/components/invoice/templates/template.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ComponentFactoryResolver"]])
    ], CreateInvoiceTemplateComponent);
    return CreateInvoiceTemplateComponent;
}());



/***/ }),

/***/ "./src/app/create/components/nav/create.steps.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/create/components/nav/create.steps.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group mrT2\">\n  <p class=\"steps-block\">\n        <span class=\"sp-template\">\n      <button type=\"button\" (click)=\"setStep('one')\" class=\"btn\"\n              [ngClass]=\"{'active': (stage === 'one' || stage === 'two') }\">1</button>\n      <br>\n      <span [ngClass]=\"{'label-active': (stage === 'one' || stage === 'two')}\">Select Template</span>\n        </span>\n    <span class=\"v_line\" [ngClass]=\"{'active': stage === 'two'}\"></span>\n  </p>\n  <p class=\"steps-block\">\n        <span class=\"sp-template\">\n      <button type=\"button\" (click)=\"setStep('two')\" class=\"btn\" [ngClass]=\"{'active': stage === 'two'}\"\n              [disabled]=\"stage === 'one'\">2</button>\n      <br> <span [ngClass]=\"{'label-active': (stage === 'two' || stage === 'three')}\">Create Invoice</span>\n        </span>\n    <span class=\"v_line\" [ngClass]=\"{'active': stage === 'three'}\"></span>\n  </p>\n  <p class=\"steps-block\">\n        <span class=\"sp-template\">\n      <button type=\"button\" (click)=\"setStep('three')\" class=\"btn\" [ngClass]=\"{'active': stage === 'three'}\"\n              [disabled]=\"stage === 'one' || stage === 'two'\">3</button>\n      <br> Export Invoices\n    </span>\n  </p>\n</div>\n"

/***/ }),

/***/ "./src/app/create/components/nav/create.steps.component.scss":
/*!*******************************************************************!*\
  !*** ./src/app/create/components/nav/create.steps.component.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-group .steps-block {\n  display: inline-block; }\n  .form-group .steps-block .sp-template {\n    display: inline-block;\n    vertical-align: top;\n    font-size: 18px;\n    color: #D5C8B6; }\n  .form-group .steps-block .sp-template span.active {\n      color: #1C3361; }\n  .form-group .steps-block .label-active {\n    color: #222; }\n  .form-group .btn {\n  width: 30px;\n  height: 30px;\n  text-align: center;\n  display: inline-block;\n  background: transparent;\n  border: 1px solid #D5C8B6;\n  border-radius: 100%;\n  line-height: 15px;\n  padding: 0;\n  font-size: 20px;\n  color: #D5C8B6;\n  margin-bottom: 6px; }\n  .form-group .btn.active {\n    background: #ff5f00 !important;\n    border-color: #ff5f00;\n    color: #fff; }\n  .form-group .v_line {\n  height: 1px;\n  width: 40px;\n  display: inline-block;\n  border-bottom: 8px dotted #D5C8B6;\n  margin: 0 58px; }\n  .form-group .v_line.active {\n    border-color: #ff5f00; }\n"

/***/ }),

/***/ "./src/app/create/components/nav/create.steps.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/create/components/nav/create.steps.component.ts ***!
  \*****************************************************************/
/*! exports provided: CreateInvoiceStepsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateInvoiceStepsComponent", function() { return CreateInvoiceStepsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");





var CreateInvoiceStepsComponent = /** @class */ (function () {
    function CreateInvoiceStepsComponent(_route, _router) {
        this._route = _route;
        this._router = _router;
        this.stage = 'one';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        //
    }
    CreateInvoiceStepsComponent.prototype.setStep = function (id) {
        if (this.stage === id) {
            return;
        }
        this.stage = id;
        console.log('setStep:', id, this.stage);
        if (id === 'one') {
            this._router.navigate(['/create-invoice/invoice']);
        }
    };
    CreateInvoiceStepsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (params) {
            if (params['templateId']) {
                _this.stage = 'two';
            }
            else {
                _this.stage = 'one';
            }
        });
    };
    CreateInvoiceStepsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateInvoiceStepsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'create-invoice-steps',
            template: __webpack_require__(/*! ./create.steps.component.html */ "./src/app/create/components/nav/create.steps.component.html"),
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewEncapsulation"].Emulated,
            styles: [__webpack_require__(/*! ./create.steps.component.scss */ "./src/app/create/components/nav/create.steps.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]])
    ], CreateInvoiceStepsComponent);
    return CreateInvoiceStepsComponent;
}());



/***/ }),

/***/ "./src/app/create/create-http-service.ts":
/*!***********************************************!*\
  !*** ./src/app/create/create-http-service.ts ***!
  \***********************************************/
/*! exports provided: CreateHttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateHttpService", function() { return CreateHttpService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_httpWrapper_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/httpWrapper.service */ "./src/app/services/httpWrapper.service.ts");
/* harmony import */ var _services_service_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/service.config */ "./src/app/services/service.config.ts");
/* harmony import */ var _services_catchManager_catchmanger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/catchManager/catchmanger */ "./src/app/services/catchManager/catchmanger.ts");






var CreateHttpService = /** @class */ (function () {
    function CreateHttpService(_http, config, errorHandler) {
        this._http = _http;
        this.config = config;
        this.errorHandler = errorHandler;
        //
    }
    CreateHttpService.prototype.Generate = function (data) {
        var _this = this;
        return this._http.post(this.config.apiUrl + 'invoices', data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (res) {
            return res;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (e) { return _this.errorHandler.HandleCatch(e); }));
    };
    CreateHttpService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"])(_services_service_config__WEBPACK_IMPORTED_MODULE_4__["ServiceConfig"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_httpWrapper_service__WEBPACK_IMPORTED_MODULE_3__["HttpWrapperService"], Object, _services_catchManager_catchmanger__WEBPACK_IMPORTED_MODULE_5__["ErrorHandler"]])
    ], CreateHttpService);
    return CreateHttpService;
}());



/***/ }),

/***/ "./src/app/create/create.module.ts":
/*!*****************************************!*\
  !*** ./src/app/create/create.module.ts ***!
  \*****************************************/
/*! exports provided: CreateModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateModule", function() { return CreateModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _components_invoice_invoice_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/invoice/invoice.component */ "./src/app/create/components/invoice/invoice.component.ts");
/* harmony import */ var _create_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./create.routing.module */ "./src/app/create/create.routing.module.ts");
/* harmony import */ var _components_invoice_templates_template_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/invoice/templates/template.component */ "./src/app/create/components/invoice/templates/template.component.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var _components_invoice_templates_letter_letter_template_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/invoice/templates/letter/letter.template.component */ "./src/app/create/components/invoice/templates/letter/letter.template.component.ts");
/* harmony import */ var _components_header_create_header_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/header/create.header.component */ "./src/app/create/components/header/create.header.component.ts");
/* harmony import */ var _components_nav_create_steps_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/nav/create.steps.component */ "./src/app/create/components/nav/create.steps.component.ts");
/* harmony import */ var ng_contenteditable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ng-contenteditable */ "../../node_modules/ng-contenteditable/ng-contenteditable.umd.js");
/* harmony import */ var ng_contenteditable__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(ng_contenteditable__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _create_http_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./create-http-service */ "./src/app/create/create-http-service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _components_invoice_templates_sample_sample_template_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/invoice/templates/sample/sample.template.component */ "./src/app/create/components/invoice/templates/sample/sample.template.component.ts");


















var CreateModule = /** @class */ (function () {
    function CreateModule() {
    }
    CreateModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _create_routing_module__WEBPACK_IMPORTED_MODULE_7__["CreateRoutingModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_4__["ModalModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_16__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__["ShSelectModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_9__["ElementViewChildModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["CollapseModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["BsDatepickerModule"].forRoot(),
                ng_contenteditable__WEBPACK_IMPORTED_MODULE_13__["ContenteditableModule"]
            ],
            declarations: [
                _components_invoice_invoice_component__WEBPACK_IMPORTED_MODULE_6__["CreateInvoiceComponent"],
                _components_invoice_templates_template_component__WEBPACK_IMPORTED_MODULE_8__["CreateInvoiceTemplateComponent"],
                _components_nav_create_steps_component__WEBPACK_IMPORTED_MODULE_12__["CreateInvoiceStepsComponent"],
                _components_header_create_header_component__WEBPACK_IMPORTED_MODULE_11__["CreateInvoiceHeaderComponent"],
                _components_invoice_templates_letter_letter_template_component__WEBPACK_IMPORTED_MODULE_10__["LetterTemplateComponent"],
                _components_invoice_templates_sample_sample_template_component__WEBPACK_IMPORTED_MODULE_17__["SampleTemplateComponent"]
            ],
            entryComponents: [
                _components_invoice_templates_letter_letter_template_component__WEBPACK_IMPORTED_MODULE_10__["LetterTemplateComponent"]
            ],
            providers: [
                _create_http_service__WEBPACK_IMPORTED_MODULE_14__["CreateHttpService"]
            ]
        })
    ], CreateModule);
    return CreateModule;
}());



/***/ }),

/***/ "./src/app/create/create.routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/create/create.routing.module.ts ***!
  \*************************************************/
/*! exports provided: CreateRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateRoutingModule", function() { return CreateRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_invoice_invoice_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/invoice/invoice.component */ "./src/app/create/components/invoice/invoice.component.ts");
/* harmony import */ var _components_invoice_templates_template_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/invoice/templates/template.component */ "./src/app/create/components/invoice/templates/template.component.ts");





var CreateRoutingModule = /** @class */ (function () {
    function CreateRoutingModule() {
    }
    CreateRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    { path: '', redirectTo: 'invoice', pathMatch: 'full' },
                    { path: 'invoice', component: _components_invoice_invoice_component__WEBPACK_IMPORTED_MODULE_3__["CreateInvoiceComponent"] },
                    { path: 'invoice/:templateId', component: _components_invoice_templates_template_component__WEBPACK_IMPORTED_MODULE_4__["CreateInvoiceTemplateComponent"] },
                    { path: '**', redirectTo: 'invoice', pathMatch: 'full' }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], CreateRoutingModule);
    return CreateRoutingModule;
}());



/***/ })

}]);