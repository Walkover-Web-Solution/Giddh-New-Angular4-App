(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ "./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.html":
/*!*********************************************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n    <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n    <div class=\"form_header\">\n        <!-- <h2>File GST via-</h2> -->\n        <h2 *ngIf=\"selectedService === 'JIO_GST'\">Jio GST</h2>\n        <h2 *ngIf=\"selectedService === 'TAXPRO' || 'VAYANA'\">Choose Provider (GSP)</h2>\n        <h2 *ngIf=\"selectedService === 'RECONCILE'\">Gst Reconcile</h2>\n    </div>\n    <div class=\"form_body witBg clearfix mrBChldLbl\">\n        <div class=\"form_bg clearfix\">\n\n            <div class=\"form-group\" *ngIf=\"selectedService === 'TAXPRO' || selectedService === 'VAYANA' \">\n                <!-- <h3 class=\"mrB1\">Choose Provider (GSP)</h3> -->\n                <label class=\"mrR1 row pdL1\">\n              <input type=\"radio\" name=\"serviceType\" class=\"radio_theme\" (change)=\"changeProvider('VAYANA')\" [checked]=\"selectedService === 'VAYANA'\"> VAYANA\n            </label>\n\n                <label>\n              <input type=\"radio\" name=\"serviceType\" class=\"radio_theme\" (change)=\"changeProvider('TAXPRO')\" [checked]=\"selectedService === 'TAXPRO'\"> TAX PRO\n            </label>\n            </div>\n\n            <!-- GIO GST -->\n            <form class=\"form-group\" *ngIf=\"selectedService === 'JIO_GST'\">\n                <div class=\"row\">\n                    <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                            <label for=\"jio_user_name\">Username:</label>\n                            <input autocomplete=\"off\" type=\"email\" name=\"username\" class=\"form-control\" id=\"jio_user_name\" [(ngModel)]=\"jioGstForm.uid\">\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                            <label for=\"jio_password\">Password:</label>\n                            <input type=\"password\" name=\"pwd\" class=\"form-control\" id=\"jio_password\" [(ngModel)]=\"jioGstForm.pwd\">\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-xs-12 mrT1\">\n                        <button class=\"btn btn-success\" (click)=\"save(jioGstForm)\">Save</button>\n                        <button class=\"btn btn-default\" (click)=\"closeAsidePane($event)\">Cancel</button>\n                    </div>\n                </div>\n            </form>\n\n            <!-- TAX PRO -->\n            <form class=\"form-group\" *ngIf=\"selectedService === 'TAXPRO' || selectedService === 'VAYANA'\">\n                <div class=\"row\">\n                    <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                            <label for=\"tax_pro_username\">Username:</label>\n                            <input autocomplete=\"off\" type=\"text\" name=\"username\" class=\"form-control\" id=\"tax_pro_username\" [(ngModel)]=\"taxProForm.uid\">\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                            <label for=\"tax_pro_gst_number\">GSTIN:</label>\n                            <input autocomplete=\"off\" type=\"text\" name=\"gstin\" class=\"form-control\" id=\"tax_pro_gst_number\" [(ngModel)]=\"taxProForm.gstin\">\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6\" *ngIf=\"otpSentSuccessFully\">\n                        <div class=\"form-group\">\n                            <label for=\"tax_pro_otp\">OTP:</label>\n                            <input autocomplete=\"off\" type=\"text\" name=\"otp\" class=\"form-control\" id=\"tax_pro_otp\" [(ngModel)]=\"taxProForm.otp\">\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-xs-12 mrT1\">\n                        <button class=\"btn btn-success\" (click)=\"save(taxProForm)\">Save</button>\n                        <button class=\"btn btn-default\" (click)=\"closeAsidePane($event)\">Cancel</button>\n                    </div>\n                </div>\n            </form>\n\n            <!--reconcile-->\n            <form class=\"form-group\" #reconcileFormVM=\"ngForm\" *ngIf=\"selectedService === 'RECONCILE'\">\n                <div class=\"row\">\n\n                    <ng-container *ngIf=\"!(gstAuthenticated$ | async)\">\n                        <ng-container *ngIf=\"!(reconcileOtpSuccess$ | async)\">\n                            <div class=\"col-xs-6\">\n                                <div class=\"form-group\">\n                                    <label for=\"tax_pro_username\">Username:</label>\n                                    <input autocomplete=\"off\" type=\"text\" name=\"username\" class=\"form-control\" id=\"reconcile_username\" [(ngModel)]=\"reconcileForm.uid\">\n                                </div>\n                            </div>\n                        </ng-container>\n\n                        <ng-container *ngIf=\"(reconcileOtpSuccess$ | async)\">\n                            <div class=\"col-xs-6\" *ngIf=\"(reconcileOtpSuccess$ | async)\">\n                                <div class=\"form-group\">\n                                    <label for=\"reconcile_otp\">OTP:</label>\n                                    <input autocomplete=\"off\" type=\"text\" name=\"otp\" class=\"form-control\" id=\"reconcile_otp\" [(ngModel)]=\"reconcileForm.otp\">\n                                </div>\n                            </div>\n                        </ng-container>\n\n                        <ng-container>\n                            <div class=\"col-xs-6\" *ngIf=\"activeCompanyGstNumber\">\n                                <div class=\"form-group\">\n                                    <label for=\"reconcile_otp\">GSTN:</label>\n                                    <input autocomplete=\"off\" type=\"text\" name=\"otp\" class=\"form-control\" id=\"reconcile_gstn\" [value]=\"(companyGst$ | async)\" [disabled]=\"true\">\n                                </div>\n                            </div>\n                        </ng-container>\n                    </ng-container>\n                    <ng-container *ngIf=\"(gstAuthenticated$ | async)\">\n                        <div class=\"col-xs-12\">\n                            <span>\n                Gst No - {{ (companyGst$ | async) }} Verified Successfully\n              </span>\n                        </div>\n                    </ng-container>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-xs-12 mrT1\">\n                        <button class=\"btn btn-success\" (click)=\"generateReconcileOtp(reconcileForm)\" *ngIf=\"!(reconcileOtpSuccess$ | async)\" [ladda]=\"reconcileOtpInProcess$ | async\" [disabled]=\"!reconcileForm.uid\">Submit\n            </button>\n\n                        <button class=\"btn btn-success\" (click)=\"sendReconcileOtp(reconcileForm)\" *ngIf=\"(reconcileOtpSuccess$ | async)\" [ladda]=\"reconcileOtpVerifyInProcess$ | async\" [disabled]=\"!reconcileForm.otp\">Submit\n            </button>\n\n                        <button class=\"btn btn-default\" (click)=\"closeAsidePane($event)\">Cancel</button>\n                    </div>\n                </div>\n            </form>\n            <!--reconcile-->\n        </div>\n\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.ts ***!
  \*******************************************************************************************************/
/*! exports provided: AsideMenuPurchaseInvoiceSettingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuPurchaseInvoiceSettingComponent", function() { return AsideMenuPurchaseInvoiceSettingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_purchase_invoice_purchase_invoice_action__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/purchase-invoice/purchase-invoice.action */ "./src/app/actions/purchase-invoice/purchase-invoice.action.ts");
/* harmony import */ var _actions_gst_reconcile_GstReconcile_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/gst-reconcile/GstReconcile.actions */ "./src/app/actions/gst-reconcile/GstReconcile.actions.ts");
/* harmony import */ var _models_api_models_GstReconcile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../models/api-models/GstReconcile */ "./src/app/models/api-models/GstReconcile.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");








var AsideMenuPurchaseInvoiceSettingComponent = /** @class */ (function () {
    function AsideMenuPurchaseInvoiceSettingComponent(store, invoicePurchaseActions, gstReconcileActions) {
        var _this = this;
        this.store = store;
        this.invoicePurchaseActions = invoicePurchaseActions;
        this.gstReconcileActions = gstReconcileActions;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.fireReconcileRequest = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.activeCompanyGstNumber = '';
        this.jioGstForm = {};
        this.taxProForm = {};
        this.reconcileForm = {};
        this.otpSentSuccessFully = false;
        this.defaultGstNumber = null;
        this.companyGst$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])('');
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.store.select(function (p) { return p.invoicePurchase.isTaxProOTPSentSuccessfully; }).subscribe(function (yes) {
            _this.otpSentSuccessFully = yes;
        });
        this.reconcileOtpInProcess$ = this.store.select(function (p) { return p.gstReconcile.isGenerateOtpInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.reconcileOtpSuccess$ = this.store.select(function (p) { return p.gstReconcile.isGenerateOtpSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.reconcileOtpVerifyInProcess$ = this.store.select(function (p) { return p.gstReconcile.isGstReconcileVerifyOtpInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.reconcileOtpVerifySuccess$ = this.store.select(function (p) { return p.gstReconcile.isGstReconcileVerifyOtpSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.gstAuthenticated$ = this.store.select(function (p) { return p.gstR.gstAuthenticated; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.companyGst$ = this.store.select(function (p) { return p.gstR.activeCompanyGst; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.store.select(function (s) { return s.settings.profile; }).subscribe(function (pro) {
            if (pro && pro.gstDetails) {
                var gstNo = pro.gstDetails.filter(function (f) {
                    return f.addressList[0] && f.addressList[0].isDefault === true;
                }).map(function (p) {
                    return p.gstNumber;
                });
                if (gstNo && gstNo[0]) {
                    _this.defaultGstNumber = gstNo[0];
                    _this.taxProForm.gstin = _this.defaultGstNumber;
                }
            }
        });
    }
    AsideMenuPurchaseInvoiceSettingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reconcileOtpVerifySuccess$.subscribe(function (s) {
            if (s) {
                _this.fireReconcileRequest.emit(true);
                _this.closeAsidePane(null);
            }
        });
        this.companyGst$.subscribe(function (a) {
            if (a) {
                _this.taxProForm.gstin = a;
            }
        });
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.ngOnChanges = function (changes) {
        if ('selectedService' in changes && changes['selectedService'].currentValue) {
            // alert('selectedService ' + changes['selectedService'].currentValue);
        }
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    /**
     * save
     */
    AsideMenuPurchaseInvoiceSettingComponent.prototype.save = function (form) {
        var type = _.cloneDeep(this.selectedService);
        form.gsp = type;
        if (type === 'JIO_GST') {
            this.store.dispatch(this.invoicePurchaseActions.SaveJioGst(form));
        }
        else if ((type === 'TAXPRO' || type === 'VAYANA') && !this.otpSentSuccessFully) {
            this.store.dispatch(this.invoicePurchaseActions.SaveGSPSession(form));
        }
        else if ((type === 'TAXPRO' || type === 'VAYANA') && this.otpSentSuccessFully) {
            this.store.dispatch(this.invoicePurchaseActions.SaveGSPSessionWithOTP(form));
        }
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.generateReconcileOtp = function (form) {
        this.store.dispatch(this.gstReconcileActions.GstReconcileOtpRequest(form.uid));
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.sendReconcileOtp = function (form) {
        var model = new _models_api_models_GstReconcile__WEBPACK_IMPORTED_MODULE_6__["VerifyOtpRequest"]();
        model.otp = form.otp;
        this.store.dispatch(this.gstReconcileActions.GstReconcileVerifyOtpRequest(model));
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.changeProvider = function (provider) {
        this.selectedService = _.cloneDeep(provider);
        this.otpSentSuccessFully = false;
        this.taxProForm.otp = '';
    };
    AsideMenuPurchaseInvoiceSettingComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuPurchaseInvoiceSettingComponent.prototype, "selectedService", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuPurchaseInvoiceSettingComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuPurchaseInvoiceSettingComponent.prototype, "fireReconcileRequest", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuPurchaseInvoiceSettingComponent.prototype, "activeCompanyGstNumber", void 0);
    AsideMenuPurchaseInvoiceSettingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'aside-menu-account',
            template: __webpack_require__(/*! ./aside-menu-purchase-invoice-setting.component.html */ "./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      max-width:480px;\n      width: 100%;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -33px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      max-width:480px;\n      width: 100%;\n      padding: 0;\n      background: #fff;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _actions_purchase_invoice_purchase_invoice_action__WEBPACK_IMPORTED_MODULE_4__["InvoicePurchaseActions"],
            _actions_gst_reconcile_GstReconcile_actions__WEBPACK_IMPORTED_MODULE_5__["GstReconcileActions"]])
    ], AsideMenuPurchaseInvoiceSettingComponent);
    return AsideMenuPurchaseInvoiceSettingComponent;
}());



/***/ }),

/***/ "./src/app/purchase/purchase-invoice/purchase.invoice.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/purchase.invoice.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".section_title {\n    padding: 15px 0;\n}\n\n.input-err {\n    border-color: #ce1b1b;\n}\n\n.input-warn {\n    border-color: #f2e200;\n}\n\n.btn-generate {\n    margin-top: 4px;\n    color: #fff;\n    background: #ff5f00;\n}\n\n.btn-generate:disabled {\n    color: #ff5f00;\n    background: #e5e5e5;\n}\n\n.search-form .input-group-btn {\n    width: 35px;\n    font-size: inherit;\n    border: 1px solid #d6d6d6;\n    text-align: center;\n    color: #999999;\n    background: #fff;\n    border-right: 0;\n    vertical-align: middle;\n    line-height: 32px;\n}\n\n.search-form .form-control {\n    border-left: 0;\n}\n\n.open>.pageListDD {\n    display: inline-block;\n    min-width: 200px;\n    width: 100%;\n    max-height: 180px;\n    overflow: auto;\n    padding-left: 7px;\n}\n\n.dd-options:hover {\n    color: rgb(211, 95, 41);\n}\n\n.bt-border-1px {\n    border-bottom: 1px solid gainsboro;\n}\n\n.tr-td-div>td div {\n    padding: 4px 0px;\n}\n\n/* #settingTab .nav-tabs>li.active>a {\n    color: #ff5f00;\n    background: transparent;\n    border: 0;\n    border-bottom: 1px solid #ff5f00;\n} */\n\n/*.ranges:nth-of-type(2) {\n    display: none !important;\n}*/\n\n.return-body .main-wrapper {\n    background-color: #f5f5f5;\n    padding: 0;\n    border-right: 1px solid #eee;\n}\n\n.return-content {\n    padding: 31px 4% 15px;\n    background-color: #fff;\n}\n\n.btn-primary,\n.btn-primary.disabled,\n.btn-primary.disabled.active,\n.btn-primary.disabled:active,\n.btn-primary.disabled:focus,\n.btn-primary.disabled:hover,\n.btn-primary[disabled],\n.btn-primary[disabled].active,\n.btn-primary[disabled]:active,\n.btn-primary[disabled]:focus,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary,\nfieldset[disabled] .btn-primary.active,\nfieldset[disabled] .btn-primary:active,\nfieldset[disabled] .btn-primary:focus,\nfieldset[disabled] .btn-primary:hover .btn-primary[disabled],\n.btn-primary.disabled,\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary,\n.receipt-wrapper .doc-checkbox:checked,\n.doc-actions {\n    color: #fff;\n    background-color: #ea795b;\n    border-color: #ea795b;\n}\n\n.btn,\n.btn-sm,\n.btn-xs {\n    border-radius: 3px;\n}\n\n.btn {\n    display: inline-block;\n    padding: 5px 12px;\n    margin-bottom: 0;\n    cursor: pointer;\n    border: 1px solid transparent;\n    white-space: nowrap;\n    -o-user-select: none;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\nsvg.icon.icon-xxlg-md {\n    height: 40px;\n    width: 40px;\n}\n\n.return-content .return-top {\n    display: inline-block;\n    margin-left: 1%;\n}\n\n.text-middle {\n    vertical-align: middle;\n}\n\n.return-content:not(:first-child) {\n    margin: 22px 0;\n}\n\n.return-content .return-filed {\n    background-color: #00B177;\n}\n\n.text-uppercase {\n    text-transform: uppercase;\n}\n\n.text-muted {\n    color: #777;\n}\n\n.return-content .content-graph {\n    padding: 35px 0;\n}\n\nsvg.icon.gstr-icon {\n    width: 42px;\n    height: 42px;\n}\n\n.return-content .sales-colm {\n    width: 32%;\n    display: inline-block;\n    vertical-align: text-top;\n}\n\n.font-xs {\n    font-size: 12px;\n}\n\n.return-body b {\n    font-weight: 600;\n}\n\n.return-content .line {\n    margin: 5px 18px;\n    border-bottom: 1px solid #ededed;\n}\n\n.return-content .line::before {\n    content: '';\n    display: block;\n    width: 9px;\n    height: 9px;\n    border-radius: 5px;\n    background-color: #ededed;\n    position: relative;\n    top: 5px;\n    right: 19px;\n}\n\n.return-content .count a {\n    color: #0f6bde;\n}\n\n.font-xxxlarge {\n    font-size: 24px;\n}\n\n.return-content .count a {\n    color: #0f6bde;\n}\n\n.bottom-action,\n.tax-engine a,\n.tax-engine a>.dropdown {\n    cursor: pointer;\n}\n\n.return-content .line-gradient {\n    -webkit-border-image: -webkit-gradient(linear, left top, right top, color-stop(0, #eee), color-stop(30%, #eee), color-stop(60%, #fff));\n    -webkit-border-image: linear-gradient(to right, #eee 0, #eee 30%, #fff 60%);\n         -o-border-image: linear-gradient(to right, #eee 0, #eee 30%, #fff 60%);\n            border-image: -webkit-gradient(linear, left top, right top, color-stop(0, #eee), color-stop(30%, #eee), color-stop(60%, #fff));\n            border-image: linear-gradient(to right, #eee 0, #eee 30%, #fff 60%);\n    border-image-slice: 1;\n}\n\n.return-content .purchase-colm {\n    width: 24%;\n    display: inline-block;\n}\n\nsvg.icon {\n    width: 16px;\n    height: 16px;\n    fill: currentColor;\n}\n\n.text-overdue {\n    color: #eb6100;\n}\n\nsvg.icon.icon-xxlg-md {\n    height: 40px;\n    width: 40px;\n}\n\n.content-disabled {\n    opacity: .5;\n    position: relative;\n    cursor: not-allowed;\n}\n\n.return-content:last-child {\n    margin-bottom: 0;\n}\n\n.btn-default {\n    color: #333;\n    background-color: #f5f5f5;\n    border-color: #ddd;\n}\n\n.return-body .notification {\n    padding-top: 25px;\n    background: #fff;\n}\n\n.filing-demo-video {\n    padding: 10px;\n    display: block;\n    border-radius: 2px;\n    margin-bottom: 12px;\n}\n\n.filing-demo-video .video-thumbnail {\n    display: inline-block;\n}\n\n.filing-demo-video .video-thumbnail>svg {\n    width: 60px;\n    height: 40px;\n}\n\n.filing-demo-video .video-desc {\n    display: inline-block;\n    padding-left: 10px;\n}\n\n.font-medium {\n    font-size: 15px;\n}\n\n.label-default {\n    background-color: #999;\n}\n\nhr {\n    margin-top: 20px;\n    margin-bottom: 20px;\n    border-top: 1px solid #eee;\n}\n\n.filing-due-date {\n    margin: 10px 0 25px;\n}\n\n.filing-due-date .return-details {\n    margin-top: 10px;\n    border: 1px solid #eee;\n    border-radius: 4px;\n}\n\n.filing-due-date .return-details>table {\n    width: 100%;\n    font-size: 13px;\n}\n\n.filing-due-date .return-details>table>tbody>tr>td:first-child {\n    padding: 10px 15px;\n    vertical-align: top;\n}\n\n.filing-due-date .return-details>table>tbody>tr>td:first-child:before {\n    content: \" \";\n    width: 4px;\n    height: 4px;\n    border-radius: 50%;\n    display: inline-block;\n    margin-right: 6px;\n    vertical-align: middle;\n    background-color: #41aaff;\n}\n\n.filing-due-date .return-details>table>tbody>tr>td:last-child {\n    padding: 10px 15px;\n    text-align: right;\n}\n\n.filing-due-date {\n    margin: 10px 0 25px;\n}\n\n.return-body .notification .notify-title {\n    font-size: 13px;\n    color: #999;\n}\n\n.return-body .notification .activity-graph {\n    padding: 20px 0 25px;\n}\n\n.return-body .notification .activity-graph .notify {\n    position: relative;\n    padding-bottom: 30px;\n}\n\n.return-body .notification .activity-graph .notify:not(:last-child)::before {\n    content: '';\n    position: absolute;\n    top: 14px;\n    left: 4px;\n    bottom: 5px;\n    height: 75%;\n    border-left: 1px solid #e4e4e4;\n}\n\n.return-body .notification .activity-graph .notify-circle {\n    width: 9px;\n    height: 9px;\n    border-radius: 50%;\n    background-color: #2A85FB;\n    display: inline-block;\n    margin-right: 15px;\n    margin-top: 4px;\n}\n\n.return-body .notification .activity-graph .notify-content {\n    display: inline-block;\n    width: 90%;\n}\n\n.return-body .notification .activity-graph h4 {\n    line-height: 1.5;\n    margin-bottom: 2px;\n    margin-top: 10px;\n}\n\n.notify label.font-xs.text-muted strong {\n    font-weight: 600;\n    color: #777 !important;\n}\n\n.font-normal {\n    font-size: 13px;\n    color: #777;\n}\n\n.return-body .notification .faq-list {\n    padding: 10px 0 10px 20px;\n}\n\n.return-body .notification .faq-list li {\n    padding: 6px 10px;\n    color: #428bca;\n    font-size: 13px;\n}\n\n.return-body .notification .faq-list li a:hover {\n    color: #005BD0;\n}\n\n#c-tab ::ng-deep .nav-tabs>li.active>a,\n.nav-tabs>li.active>a:focus,\n.nav-tabs>li.active>a:hover {\n    color: #555;\n    cursor: default;\n    background-color: #fff;\n    border: 2px solid #ddd;\n    border-right: 0 !important;\n    border-left: 0 !important;\n    border-top: 0 !important;\n    border-bottom-color: #025cff;\n}\n\n.daterangePicker {\n    position: absolute;\n    opacity: 0;\n    right: -160px;\n    top: 0;\n    /* visibility: hidden; */\n    pointer-events: none;\n}\n\n:host ::ng-deep .daterangepicker.opensright:after,\n:host ::ng-deep .daterangepicker.opensright:before {\n    content: none;\n}\n\n.rotate-90 {\n    -webkit-transform: rotate(-90deg);\n            transform: rotate(-90deg);\n}"

/***/ }),

/***/ "./src/app/purchase/purchase-invoice/purchase.invoice.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/purchase.invoice.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"purchaseInvoice\" class=\"container-fluid mrT2\">\n    <form class=\"\">\n        <div class=\"\">\n            <div class=\"form-group max250 pull-left mrR1\">\n                <label>GSTR Form</label>\n                <div class=\"btn-group btn-block\" dropdown>\n                    <button dropdownToggle type=\"button\" data-toggle=\"dropdown\" class=\"form-control text-left\">\n            <span *ngIf=\"!selectedGstrType.name\">-- Select GSTR --</span>\n            <span *ngIf=\"selectedGstrType.name\">{{selectedGstrType.name}}</span>\n            <span class=\"pull-right\">\n                            <i class=\"fa fa-caret-down\"></i>\n                        </span>\n          </button>\n                    <ul *dropdownMenu class=\"dropdown-menu pageListDD\" role=\"menu\">\n                        <li (click)=\"onSelectGstrOption(item);\" class=\"cp dd-options\" *ngFor=\"let item of gstrOptions\">\n                            {{item.name}}\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <div class=\"form-group max250 pull-left mrR1\" [hidden]=\"!selectedGstrType.name\">\n                <ng-container *ngIf=\"!showSingleDatePicker\">\n                    <label class=\"d-block\">From - to</label>\n                    <div class=\"btn-group  dropdown\" dropdown [autoClose]=\"false\" container=\"body\" *ngIf=\"!showSingleDatePicker\" #periodDropdown=\"bs-dropdown\">\n                        <button id=\"button-nested\" dropdownToggle type=\"button\" class=\"form-control dropdown clearfix list-title filter-by return-sel font-large dropdown-toggle\" aria-controls=\"dropdown-nested\">\n                                            {{selectedDateForGSTR1.from}} - {{selectedDateForGSTR1.to}}\n                        <span class=\"caret\"></span></button>\n                        <ul id=\"dropdown-nested\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-nested\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"periodDropdown.hide();showGSTR1DatePicker=false\">\n                            <li role=\"menuitem\" dropdown triggers=\"'click'\" placement=\"right\" [autoClose]=\"false\" container=\"body\" #monthWise=\"bs-dropdown\">\n                                <a dropdownToggle class=\"dropdown-item dropdown-toggle cp\" (click)=\"false\">\n                                    Month Wise\n                                    <div class=\"pull-right\">\n                                        <span class=\"caret rotate-90\"></span>\n                                    </div>\n                                    </a>\n                                <ul *dropdownMenu class=\"dropdown-menu\" role=\"menu\">\n                                    <li role=\"menuitem\">\n                                        <a class=\"dropdown-item\" href=\"javascript:void(0)\">\n                                            <datepicker [(ngModel)]=\"selectedMonth\" [datepickerMode]=\"'month'\" name=\"fromDate\" (click)=\"$event.stopPropagation()\" [showWeeks]=\"false\" [minMode]=\"'month'\" (selectionDone)=\"monthChanged($event, true);monthWise.hide()\"></datepicker>\n                                        </a>\n                                    </li>\n                                </ul>\n                            </li>\n                            <li role=\"menuitem\">\n                                <a class=\"dropdown-item\" href=\"javascript:void(0)\" (click)=\"monthWise.hide()\">\n                                    <label for=\"daterangeInput\" class=\"d-block cp\">Custom Range \n                                    <div class=\"pull-right\">\n                                        <span class=\"caret rotate-90\"></span>\n                                    </div>\n                                    </label>\n                                    <input id=\"daterangeInput\" type=\"text\" name=\"daterangeInput\" [options]=\"{'autoApply': true}\" #dateRangePickerCmp daterangepicker class=\"form-control daterangePicker\" (applyDaterangepicker)=\"monthChanged($event, 'range')\" />\n                                </a>\n                            </li>\n                        </ul>\n                    </div>\n                </ng-container>\n                <div class=\"\">\n                    <!-- <ng-container *ngIf=\"!showSingleDatePicker\">\n                        \n                        <input type=\"text\" name=\"daterangeInput\" #dateRangePickerCmp daterangepicker [options]=\"datePickerOptions$ | async\" (applyDaterangepicker)=\"monthChanged($event)\" class=\"form-control\" />\n                    </ng-container> -->\n                    <ng-container *ngIf=\"showSingleDatePicker\">\n                        <label>Month</label>\n\n                        <div class=\"input-group\">\n                            <!--  -->\n                            <input type=\"text\" name=\"from\" [value]=\"moment(selectedMonth).format('MMMM-YYYY')\" (focus)=\"showGSTR1DatePicker = true;\" class=\"form-control\" required/>\n                            <span class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-default\"\n                                    (click)=\"showGSTR1DatePicker = !showGSTR1DatePicker\">\n                                <i class=\"glyphicon glyphicon-calendar\"></i>\n                            </button>\n                        </span>\n                        </div>\n                        <div *ngIf=\"showGSTR1DatePicker\" style=\"position: absolute; z-index:10; min-height:290px;\">\n                            <ul class=\"my-dropdown-menu calendar-dropdown\">\n                                <li>\n                                    <datepicker [datepickerMode]=\"'month'\" name=\"fromDate\" (click)=\"$event.stopPropagation()\" [showWeeks]=\"false\" [minMode]=\"'month'\" (selectionDone)=\"monthChanged($event, true)\" [(ngModel)]=\"selectedMonth\"></datepicker>\n                                    <!-- [(ngModel)]=\"selectedDateForGSTR1\" -->\n                                    <!-- <datepicker [datepickerMode]=\"'month'\" name=\"fromDate\" (click)=\"$event.stopPropagation()\" (selectionDone)=\"showGSTR1DatePicker=!showGSTR1DatePicker;monthChanged($event)\" [showWeeks]=\"false\" [minMode]=\"'month'\"></datepicker> -->\n                                </li>\n                                <li class=\"pd1 clearfix pdT pdB\">\n                                    <span class=\"btn-group pull-left\">\n                                        <button type=\"button\" class=\"btn btn-xs btn-primary mrR\" (click)=\"setCurrentMonth();showGSTR1DatePicker = false;\">Reset</button>\n                                        <button type=\"button\" class=\"btn btn-xs btn-success\" (click)=\"showGSTR1DatePicker = false\">Done</button>\n                                    </span>\n                                    <!-- <button type=\"button\" class=\"btn btn-xs btn-link pull-right\" (click)=\"clearDate();showGSTR1DatePicker = false;\">Clear</button> -->\n                                </li>\n                            </ul>\n                        </div>\n                    </ng-container>\n\n                    <!-- <div class=\"input-group\">\n                        <input type=\"text\" name=\"from\" [ngModel]=\"moment(selectedDateForGSTR1).format('MM-YYYY')\" (focus)=\"showGSTR1DatePicker = true;\" class=\"form-control\" required/>\n                        <span class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-default\"\n                                    (click)=\"showGSTR1DatePicker = !showGSTR1DatePicker\">\n                                <i class=\"glyphicon glyphicon-calendar\"></i>\n                            </button>\n                        </span>\n                    </div> -->\n                    <!-- <div *ngIf=\"showGSTR1DatePicker\" style=\"position: absolute; z-index:10; min-height:290px;\">\n                        <ul class=\"my-dropdown-menu calendar-dropdown\">\n                            <li>\n                                <datepicker [datepickerMode]=\"'month'\" name=\"fromDate\" (click)=\"$event.stopPropagation()\" [(ngModel)]=\"selectedDateForGSTR1\" (selectionDone)=\"showGSTR1DatePicker=!showGSTR1DatePicker;monthChanged($event)\" [showWeeks]=\"false\" [minMode]=\"'month'\"></datepicker>\n                            </li>\n                            <li class=\"pd1 clearfix pdT pdB\">\n                                <span class=\"btn-group pull-left\">\n                                    <button type=\"button\" class=\"btn btn-xs btn-primary mrR\" (click)=\"setCurrentMonth();showGSTR1DatePicker = false;\">Reset</button>\n                                    <button type=\"button\" class=\"btn btn-xs btn-success\" click)=\"showGSTR1DatePicker = false\">Done</button>\n                                </span>\n                                <button type=\"button\" class=\"btn btn-xs btn-link pull-right\" (click)=\"clearDate();showGSTR1DatePicker = false;\">Clear</button>\n                            </li>\n                        </ul>\n                    </div> -->\n                </div>\n            </div>\n            <div class=\"form-group max250 pull-left mrR1\" *ngIf=\"selectedGstrType.name === 'GSTR3B'\">\n                <label>Email <i class='fa fa-info-circle' tooltip-placement=\"top\"\n                        tooltip=\"If no email id is provided, email will be by default sent to you/company creator\"></i></label>\n                <input type=\"text\" name=\"userEmail\" [(ngModel)]=\"userEmail\" class=\"form-control\" required autocomplete=\"off\" placeholder=\"Email address\" />\n            </div>\n            <!-- comment by mustafa for GSTR2\n    <div class=\"form-group col-xs-2\" [hidden]=\"!selectedGstrType || selectedGstrType=='GSTR1'\">\n        <label>Report</label>\n        <div class=\"btn-group btn-block\" dropdown>\n            <button dropdownToggle type=\"button\" data-toggle=\"dropdown\" class=\"form-control text-left btn-block dropdown-toggle\">-- Select Report --<span class=\"select_drop pull-right mrT1\"><i class=\"fa fa-caret-down\"></i></span>\n </button>\n            <ul *dropdownMenu class=\"dropdown-menu pageListDD\" role=\"menu\">\n                <li class=\"cp\" *ngFor=\"let item of purchaseReportOptions\">\n                    {{item.name}}\n                </li>\n            </ul>\n        </div>\n    </div>\n    -->\n            <!-- hide due to unused\n    <div class=\"form-group inline\" *ngIf=\"selectedGstrType.name\">\n        <br />\n       <button [disabled]=\"!selectedGstrType.name || selectedGstrType.name =='GSTR1'\" class=\"btn btn-success\">GO</button>\n\n    </div>\n-->\n            <div class=\"form-group max250 pull-left\" *ngIf=\"selectedGstrType.name\">\n                <label class=\"d-block\">&nbsp;</label>\n                <div class=\"\">\n                    <div [hidden]=\"isDownloadingFileInProgress\" class=\"btn-group\" dropdown [isDisabled]=\"!selectedGstrType.name\">\n                        <button dropdownToggle type=\"button\" data-toggle=\"dropdown\" class=\"form-control text-left\"> File\n              {{ selectedGstrType.name }}\n              <span class=\"pull-right mrL4\">\n                                <i class=\"fa fa-caret-down\"></i>\n                            </span>\n            </button>\n                        <ul *dropdownMenu class=\"dropdown-menu pd\" role=\"menu\" style=\"width: 200px;\">\n                            <li class=\"cp dd-options\" *ngIf=\"selectedGstrType.name !== 'GSTR3B'\" (click)=\"onDownloadSheetGSTR(selectedGstrType.uniqueName);\">Download Sheet\n                            </li>\n                            <li class=\"cp dd-options text-danger\" *ngIf=\"selectedGstrType.name === 'GSTR1'\" (click)=\"onDownloadSheetGSTR('gstr1-error-export');\">Download Error Sheet\n                            </li>\n                            <li class=\"cp dd-options text-danger\" *ngIf=\"selectedGstrType.name === 'GSTR2'\" (click)=\"onDownloadSheetGSTR('gstr2-error-export');\">Download Error Sheet\n                            </li>\n                            <li class=\"cp dd-options\" *ngIf=\"selectedGstrType.name === 'GSTR1'\" (click)=\"fileJioGstReturn('JIO_GST');\">File GSTR1 using Jio GST\n                            </li>\n                            <li class=\"cp dd-options\" *ngIf=\"selectedGstrType.name === 'GSTR1'\" (click)=\"fileJioGstReturn('TAXPRO');\">File GSTR1 using Tax Pro\n                            </li>\n                            <li class=\"cp dd-options\" *ngIf=\"selectedGstrType.name === 'GSTR3B'\" (click)=\"emailSheet(false)\">Email Sheet\n                            </li>\n                            <li class=\"cp dd-options\" *ngIf=\"selectedGstrType.name === 'GSTR3B'\" (click)=\"emailSheet(true)\">Email With Detail Sheet\n                            </li>\n                            <!-- <li class=\"cp dd-options\">Use JIOGST API</li> -->\n                            <!--<li class=\"cursor-pointer dd-options\" *ngFor=\"let item of fileGstrOptions\" (click)=\"onDownloadSheetGSTR();\">{{item.name}}</li>-->\n                        </ul>\n                    </div>\n                    <small [hidden]=\"!isDownloadingFileInProgress\" class=\"inline primary_clr\"> Downloading...</small>\n                </div>\n            </div>\n            <!-- hide due to unused -->\n            <div class=\"form-group pull-right\" *ngIf=\"selectedGstrType.name === 'GSTR1'\">\n                <label class=\"d-block\">&nbsp;</label>\n                <button class=\"btn btn-default pull-right primary_clr\" (click)=\"toggleSettingAsidePane($event, 'JIO_GST');\"><i\n          class=\"fa fa-cog\" aria-hidden=\"true\"></i> Jio GST\n        </button>\n                <span style=\"margin: 5px 10px;\" class=\"pull-right\">OR</span>\n                <button class=\"btn btn-default pull-right primary_clr\" (click)=\"toggleSettingAsidePane($event, 'TAXPRO');\"><i\n          class=\"fa fa-cog\" aria-hidden=\"true\"></i> Tax Pro\n        </button>\n            </div>\n\n        </div>\n    </form>\n    <!-- Top filter end  -->\n\n    <!--!selectedGstrType.name || selectedGstrType.name == 'GSTR1' || selectedGstrType.name  -->\n\n    <div class=\"col-xs-12\" *ngIf=\"selectedGstrType.name == 'GSTR2'\">\n        <div class=\"row\">\n            <h1 class=\"section_title\"> <strong>Purchase Report </strong> <small>(To file your GST return, all missing data needs to be filled properly)</small> </h1>\n        </div>\n    </div>\n    <div class=\"box clearfix\" *ngIf=\"selectedGstrType.name == 'GSTR2'\">\n        <!-- filter -->\n        <div class=\"col-xs-12\">\n            <div class=\"row\">\n                <form class=\"col-xs-10\">\n                    <div class=\"row\">\n                        <div class=\"form-group col-xs-2\">\n                            <div class=\"row\">\n                                <label>Date Range</label>\n                                <br>\n                                <input type=\"text\" name=\"dateInput\" daterangepicker (selected)=\"selectedDate($event, mainInput)\" [options]=\"datePickerOptions\" class=\"form-control date-range-picker\" />\n                            </div>\n                        </div>\n                        <div class=\"form-group col-xs-2\">\n                            <label>Other Filters</label>\n                            <div class=\"btn-group btn-block\" dropdown>\n                                <button dropdownToggle type=\"button\" data-toggle=\"dropdown\" class=\"form-control text-left btn-block dropdown-toggle\"> Filter <span class=\"select_drop pull-right mrT1\"> <i class=\"fa fa-caret-down\"></i> </span> </button>\n                                <ul *dropdownMenu class=\"dropdown-menu pageListDD\" role=\"menu\">\n                                    <li *ngFor=\"let item of otherFilters\">\n                                        <label>\n                      <input type=\"checkbox\">\n                      {{item.name}}</label>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                        <div class=\"form-group inline\" *ngIf=\"selectedGstrType\"> <br />\n                            <button type=\"button\" class=\"btn btn-success\">GO</button>\n                            <a class=\"btn btn-link\">Reset</a> </div>\n                        <button (click)=\"onUpdate()\" class=\"btn btn-generate pull-right\" [disabled]=\"!generateInvoiceArr.length\">Generate <br />\n            Purchase Invoice</button>\n                    </div>\n                </form>\n\n                <!-- search form  -->\n                <form class=\"col-xs-2 pull-right search-form\">\n                    <br />\n                    <div class=\"row\">\n                        <div class=\"input-group col-xs-12 pull-right\"> <span class=\"input-group-btn\"><i class=\"glyphicon glyphicon-search\"></i></span>\n                            <input type=\"text\" (keyup)=\"filterPurchaseInvoice(searchBox.value)\" #searchBox class=\"form-control\" placeholder=\"Search\">\n                        </div>\n                        <!-- /input-group -->\n                    </div>\n                </form>\n            </div>\n        </div>\n        <!-- filter end  -->\n\n        <!-- table  -->\n        <table class=\"table basic table-bordered\">\n            <thead>\n                <tr>\n                    <th>&nbsp;</th>\n                    <th>Date</th>\n                    <th>Particulars</th>\n                    <th>Account</th>\n                    <th> <span (click)=\"sortInvoicesBy('gstin')\" class=\"cursor-pointer\">GSTIN <i class=\"fa fa-sort\" aria-hidden=\"true\"></i> </span> </th>\n                    <th> <span (click)=\"sortInvoicesBy('invoiceNo')\" class=\"cursor-pointer\">Invoice No. <i class=\"fa fa-sort\" aria-hidden=\"true\"></i> </span> </th>\n                    <th>Voucher No.</th>\n                    <th>Entry</th>\n                    <th class=\"text-right\">Taxable Value</th>\n                    <!-- <th *ngIf=\"isReverseChargeSelected\" class=\"text-right\">Select Tax</th> -->\n                    <th class=\"text-right\">IGST</th>\n                    <th class=\"text-right\">CGST</th>\n                    <th class=\"text-right\">SGST</th>\n                    <th class=\"text-right\">UTGST</th>\n                    <th class=\"text-right\">GSTR2</th>\n                    <th class=\"text-right\">ITC</th>\n                    <th class=\"text-right\">Action</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let invoice of allPurchaseInvoices.items; let i = index\">\n                    <td class=\"text-center\"><input type=\"checkbox\" (click)=\"generateInvoice(invoice, $event);\" [disabled]=\"invoice.entryType !== 'reverse charge' || invoice.invoiceGenerated || invoice.taxes[0]\" /></td>\n                    <td [innerHTML]=\"invoice.entryDate | highlight: searchBox.value\"></td>\n                    <td [innerHTML]=\"invoice.particular | highlight: searchBox.value\"></td>\n                    <td [innerHTML]=\"invoice.account.name | highlight: searchBox.value\"></td>\n                    <td><input type=\"text\" class=\"form-control\" maxlength=\"15\" minlength=\"15\" [(ngModel)]=\"invoice.account.gstIn\" disabled=\"true\" />\n\n                        <!-- <small class=\"danger\" *ngIf=\"invoice.account.gstIn != null && invoice.account.gstIn.length != 15\">Invalid GSTIN</small> --></td>\n                    <td><input type=\"text\" class=\"form-control\" minlength=\"1\" maxlength=\"16\" [(ngModel)]=\"invoice.invoiceNumber\" [disabled]=\"invoice.invoiceGenerated || (selectedRowIndex != i && editMode) || !selectedRowIndex || invoice.entryType == 'reverse charge'\"\n                        /></td>\n                    <td>{{invoice.voucherNo}}</td>\n                    <td class=\"select text-center\">\n                        <div *ngIf=\"timeCounter == 10 || selectedRowIndex != i\" class=\"custom-select pos-rel\">\n                            <select [(ngModel)]=\"invoice.entryType\" name=\"entryType\" class=\"form-control cp\" (change)=\"onChangeEntryType(i, invoice.entryType, invoice.account.uniqueName);\" [disabled]=\"invoice.invoiceGenerated || invoice.taxes[0] || (selectedRowIndex != i && editMode) || (invoice.invoiceNumber && invoice.invoiceNumber.length) || selectedRowIndex == null \">\n                <option value=\"\" [selected]=\"invoice.invoiceNumber\">None selected</option>\n                <option value=\"composite\" *ngIf=\"invoice.account.gstIn != null && invoice.account.gstIn.length == 15\"> Composite </option>\n                <option value=\"reverse charge\" *ngIf=\"!(invoice.account.gstIn?.length >0 || ( invoice.igstAmount!='0' || invoice.cgstAmount!='0')) && !invoice.invoiceNumber\"> Reverse Charge</option>\n              </select>\n                            <span class=\"select_drop\"> <i class=\"fa fa-caret-down\"></i> </span> </div>\n                        <button *ngIf=\"(timeCounter != 10 && selectedRowIndex == i && invoice.invoiceNumber) || (timeCounter != 10 && selectedRowIndex == i && !invoice.invoiceNumber)\" (click)=\"onUndoEntryTypeChange(i, invoice)\" class=\"btn btn-link\">Undo in {{timeCounter}}s</button>\n                        <div class=\"btn-group btn-block mrT\" dropdown (onShown)=\"onDDShown()\" (onHidden)=\"onDDHidden(invoice.entryUniqueName, invoice.account.uniqueName)\" *ngIf=\"isReverseChargeSelected && invoice.entryType == 'reverse charge' && !invoice.invoiceGenerated && !invoice.invoiceNumber && selectedRowIndex == i\"\n                            [autoClose]=\"false\">\n                            <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\" [disabled]=\"selectedRowIndex != i\"> {{dropdownHeading}} <span class=\"select_drop pull-right mrT1\"> <i class=\"fa fa-caret-down\"></i> </span> </button>\n                            <ul id=\"pageListDD\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\">\n                                <!-- <li>\n                                        <label>\n                                    <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" (click)=\"selectAllTaxes($event)\" [(ngModel)]=\"invoice.isAllTaxSelected\"> Select all\n                                </label>\n                                    </li> -->\n                                <li *ngFor=\"let tax of allTaxes; let idx = index\">\n                                    <label> {{ invoice.taxes[0] }} \n                    <!--(click)=\"selectTax($event, tax)\" [(ngModel)]=\"tax.isSelected\"  -->\n                    <input type=\"checkbox\" name=\"invoiceTax\" class=\"invoiceTax\" (click)=\"selectTax($event, tax, i)\" [checked]=\"tax.uniqueName === invoice.taxes[0] || tax.uniqueName === invoice.taxes[1]\">\n                    {{ tax.name}} </label>\n                                </li>\n                            </ul>\n                        </div>\n                    </td>\n                    <td class=\"text-right\">{{invoice.taxableValue}}</td>\n                    <!-- <td class=\"form-group\" *ngIf=\"isReverseChargeSelected\">\n    \n                    </td> -->\n                    <td class=\"text-right\">{{invoice.igstAmount}}</td>\n                    <td class=\"text-right\">{{invoice.cgstAmount}}</td>\n                    <td class=\"text-right\">{{invoice.sgstAmount}}</td>\n                    <td class=\"text-right\">{{invoice.utgstAmount}}</td>\n                    <td class=\"text-center\"><input type=\"checkbox\" (click)=\"updateOncheck(invoice, 'sendToGstr2', $event.target.checked);\" [(ngModel)]=\"invoice.sendToGstr2\" [disabled]=\"!editMode || (selectedRowIndex != i && editMode)\" /></td>\n                    <td class=\"text-center\"><input type=\"checkbox\" (click)=\"updateOncheck(invoice, 'availItc', $event.target.checked);\" [(ngModel)]=\"invoice.availItc\" [disabled]=\"!editMode || (selectedRowIndex != i && editMode)\" /></td>\n                    <td class=\"text-center ico-btn\"><button class=\"btn btn-xs\" type=\"button\" [disabled]=\"\" *ngIf=\"!editMode || (selectedRowIndex != i && editMode)\" (click)=\"editRow(i)\"> <i aria-hidden=\"true\" class=\"fa fa-pencil\"></i> </button>\n                        <button class=\"btn btn-xs\" type=\"button\" (click)=\"updateEntry(invoice)\" *ngIf=\"selectedRowIndex == i && editMode\"> <i aria-hidden=\"true\" class=\"fa fa-check\"></i> </button></td>\n                </tr>\n            </tbody>\n            <tbody *ngIf=\"allPurchaseInvoices.count === 0\">\n                <tr>\n                    <td colspan=\"16\" class=\"text-center empty_table\">\n                        <h1>No Record Found !!</h1>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n\n        <!-- <pagination [totalItems]=\"ledgersData.totalPages\" [(ngModel)]=\"ledgersData.page\" [maxSize]=\"5\" class=\"pagination-sm\" [boundaryLinks]=\"true\" [itemsPerPage]=\"1\" [rotate]=\"false\" (pageChanged)=\"pageChanged($event)\"></pagination> -->\n        <div class=\"center-block text-center\" *ngIf=\"allPurchaseInvoices.count > 0\">\n            <pagination [totalItems]=\"allPurchaseInvoices.totalItems\" [(ngModel)]=\"allPurchaseInvoices.page\" [maxSize]=\"5\" class=\"pagination-sm\" [boundaryLinks]=\"true\" [rotate]=\"false\" (pageChanged)=\"pageChanged($event)\"> </pagination>\n        </div>\n    </div>\n\n    <!-- commented due to not tested yet \n    <div class=\"col-xs-12\" *ngIf=\"selectedGstrType.name == 'GSTR2'\">\n    <div class=\"row\">\n      <h1 class=\"section_title\">\n        <strong>Reconciliations </strong>\n        <small>(To file your GST return, all missing data needs to be filled properly)</small>\n        <button class=\"btn isActive btn-sm pull-right\" style=\"margin-bottom: 10px\"\n                (click)=\"toggleSettingAsidePane($event, 'RECONCILE');\">Pull from GSTN\n        </button>\n      </h1>\n    </div>\n  </div> -->\n\n    <!-- reconcile -->\n    <!-- commented due to not tested yet \n    <div class=\"box clearfix\" *ngIf=\"selectedGstrType.name == 'GSTR2'\">\n    <div class=\"col-xs-12\">\n\n      <alert type=\"info\" [dismissible]=\"true\" *ngIf=\"(gstFoundOnGiddh$ | async) === false\">\n        <strong>Warning!</strong> GST No, Not found for this company. Please update the GSTIN by updating company\n        setting profile\n      </alert>\n\n      <div class=\"row\">\n        <tabset #staticTabs id=\"c-tab\">\n          <tab heading=\"{{'Missing in GSTN (' + (gstNotFoundOnPortalData$ | async)?.count + ')' }}\"\n               (select)=\"reconcileTabChanged('NOT_ON_PORTAL')\">\n            <div>\n              <reconcileDesign [data]=\"(gstNotFoundOnPortalData$ | async)?.data\">\n              </reconcileDesign>\n\n              <div style=\"display: flex;justify-content: center\">\n                <div element-view-container-ref\n                     #pgGstNotFoundOnPortal=\"elementviewcontainerref\">\n                </div>\n              </div>\n            </div>\n            <div class=\"row\" *ngIf=\"(gstNotFoundOnPortalData$ | async)?.count === 0\">\n              <h3 class=\"text-center\">NO DATA</h3>\n            </div>\n          </tab>\n          <tab heading=\"{{'Missing in Giddh (' + (gstNotFoundOnGiddhData$ | async)?.count + ')'}}\"\n               (select)=\"reconcileTabChanged('NOT_ON_GIDDH')\">\n            <div>\n              <reconcileDesign [data]=\"(gstNotFoundOnGiddhData$ | async)?.data\">\n              </reconcileDesign>\n              <div style=\"display: flex;justify-content: center\">\n                <div\n                  element-view-container-ref #pgGstNotFoundOnGiddh=\"elementviewcontainerref\">\n                </div>\n              </div>\n            </div>\n            <div class=\"row\" *ngIf=\"(gstNotFoundOnGiddhData$ | async)?.count === 0\">\n              <h3 class=\"text-center\">NO DATA</h3>\n            </div>\n\n\n          </tab>\n          <tab heading=\"{{'Partially Matched (' + (gstPartiallyMatchedData$ | async)?.count + ')'}}\"\n               (select)=\"reconcileTabChanged('PARTIALLY_MATCHED')\">\n            <div>\n\n              <reconcileDesign [data]=\"(gstPartiallyMatchedData$ | async)?.data\">\n              </reconcileDesign>\n\n              <div style=\"display: flex;justify-content: center\">\n                <div element-view-container-ref #pgPartiallyMatched=\"elementviewcontainerref\">\n                </div>\n              </div>\n            </div>\n            <div class=\"row\" *ngIf=\"(gstPartiallyMatchedData$ | async)?.count === 0\">\n              <h3 class=\"text-center\">NO DATA</h3>\n            </div>\n\n          </tab>\n          <tab heading=\"{{'Matched (' + (gstMatchedData$ | async)?.count + ')'}}\"\n               (select)=\"reconcileTabChanged('MATCHED')\">\n            <div>\n              <reconcileDesign [data]=\"(gstMatchedData$ | async)?.data\">\n              </reconcileDesign>\n\n              <div style=\"display: flex;justify-content: center\">\n                <div element-view-container-ref #pgMatched=\"elementviewcontainerref\">\n                </div>\n              </div>\n            </div>\n            <div class=\"row\" *ngIf=\"(gstMatchedData$ | async)?.count === 0\">\n              <h3 class=\"text-center\">NO DATA</h3>\n            </div>\n\n\n          </tab>\n        </tabset>\n\n      </div>\n    </div>\n\n  </div> -->\n    <!-- reconcile -->\n\n    <div class=\"aside-overlay\" *ngIf=\"accountAsideMenuState === 'in'\" (click)=\"toggleSettingAsidePane($event)\"></div>\n    <aside-menu-account [selectedService]=\"selectedServiceForGSTR1\" [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\" (fireReconcileRequest)=\"fireGstReconcileRequest('NOT_ON_PORTAL')\" (closeAsideEvent)=\"toggleSettingAsidePane($event)\"></aside-menu-account>\n</section>\n<!-- <div class=\"form-group col-xs-2\">\n    <button class=\"btn btn-success\" (click)=\"toggleSettingAsidePane($event);\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i> Settings</button>\n</div> -->"

/***/ }),

/***/ "./src/app/purchase/purchase-invoice/purchase.invoice.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/purchase.invoice.component.ts ***!
  \*************************************************************************/
/*! exports provided: PurchaseInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PurchaseInvoiceComponent", function() { return PurchaseInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_purchase_invoice_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/purchase-invoice.service */ "./src/app/services/purchase-invoice.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_purchase_invoice_purchase_invoice_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/purchase-invoice/purchase-invoice.action */ "./src/app/actions/purchase-invoice/purchase-invoice.action.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _models_api_models_Account__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../models/api-models/Account */ "./src/app/models/api-models/Account.ts");
/* harmony import */ var _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../models/api-models/Invoice */ "./src/app/models/api-models/Invoice.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _actions_gst_reconcile_GstReconcile_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../actions/gst-reconcile/GstReconcile.actions */ "./src/app/actions/gst-reconcile/GstReconcile.actions.ts");
/* harmony import */ var ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ngx-bootstrap/alert */ "../../node_modules/ngx-bootstrap/alert/index.js");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");























var otherFiltersOptions = [
    { name: 'GSTIN Empty', uniqueName: 'GSTIN Empty' },
    { name: 'GSTIN Filled', uniqueName: 'GSTIN Filled' },
    { name: 'Invoice Empty', uniqueName: 'Invoice Empty' },
    { name: 'Invoice Filled', uniqueName: 'Invoice Filled' }
];
var gstrOptions = [
    { name: 'GSTR1', uniqueName: 'gstr1-excel-export' },
    { name: 'GSTR2', uniqueName: 'gstr2-excel-export' },
    { name: 'GSTR3B', uniqueName: 'gstr3-excel-export' }
];
var purchaseReportOptions = [
    { name: 'Credit Note', uniqueName: 'Credit Note' },
    { name: 'Debit Note', uniqueName: 'Debit Note' }
];
var fileGstrOptions = [
    { name: 'Download Sheet', uniqueName: 'Download Sheet' },
    { name: 'Use JIOGST API', uniqueName: 'Use JIOGST API' }
];
var PurchaseInvoiceComponent = /** @class */ (function () {
    function PurchaseInvoiceComponent(router, location, store, invoicePurchaseActions, toasty, companyActions, purchaseInvoiceService, accountService, _reconcileActions, componentFactoryResolver, settingsProfileActions) {
        var _this = this;
        this.router = router;
        this.location = location;
        this.store = store;
        this.invoicePurchaseActions = invoicePurchaseActions;
        this.toasty = toasty;
        this.companyActions = companyActions;
        this.purchaseInvoiceService = purchaseInvoiceService;
        this.accountService = accountService;
        this._reconcileActions = _reconcileActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this.settingsProfileActions = settingsProfileActions;
        this.allPurchaseInvoices = new _services_purchase_invoice_service__WEBPACK_IMPORTED_MODULE_8__["IInvoicePurchaseResponse"]();
        this.allTaxes = [];
        this.selectedDateForGSTR1 = {};
        this.selectedEntryTypeValue = '';
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_6__;
        this.selectedGstrType = { name: '', uniqueName: '' };
        this.showGSTR1DatePicker = false;
        this.accountAsideMenuState = 'out';
        this.dropdownHeading = 'Select taxes';
        this.isSelectedAllTaxes = false;
        this.purchaseInvoiceObject = new _services_purchase_invoice_service__WEBPACK_IMPORTED_MODULE_8__["IInvoicePurchaseItem"]();
        this.purchaseInvoiceRequestObject = new _services_purchase_invoice_service__WEBPACK_IMPORTED_MODULE_8__["GeneratePurchaseInvoiceRequest"]();
        this.gstrOptions = gstrOptions;
        this.isDownloadingFileInProgress = false;
        this.timeCounter = 10; // Max number of seconds to wait
        this.selectedRowIndex = null;
        this.isReverseChargeSelected = false;
        this.generateInvoiceArr = [];
        this.invoiceSelected = false;
        this.editMode = false;
        this.pageChnageState = false;
        this.userEmail = '';
        this.reconcileActiveTab = 'NOT_ON_PORTAL';
        this.datePickerOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(null);
        this.singleDatePickerOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(null);
        this.showSingleDatePicker = false;
        this.selectedRangeType = '';
        this.isMonthSelected = false;
        this.selectedMonth = moment_moment__WEBPACK_IMPORTED_MODULE_6__(new Date());
        this.undoEntryTypeChange = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_10__["ReplaySubject"](1);
        this.purchaseInvoiceObject.TaxList = [];
        this.purchaseInvoiceRequestObject.entryUniqueName = [];
        this.purchaseInvoiceRequestObject.taxes = [];
        this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (c) {
            if (c) {
                _this.activeCompanyUniqueName = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](c);
            }
        });
        this.store.select(function (p) { return p.session.companies; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (c) {
            if (c.length) {
                var companies = _this.companies = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](c);
                if (_this.activeCompanyUniqueName) {
                    var activeCompany = companies.find(function (o) { return o.uniqueName === _this.activeCompanyUniqueName; });
                    if (activeCompany && activeCompany.gstDetails[0]) {
                        _this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
                    }
                    else {
                        // this.toasty.errorToast('GST number not found.');
                    }
                }
            }
            else {
                _this.store.dispatch(_this.companyActions.RefreshCompanies());
            }
        });
        this.gstReconcileInvoiceRequestInProcess$ = this.store.select(function (s) { return s.gstReconcile.isGstReconcileInvoiceInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstAuthenticated$ = this.store.select(function (p) { return p.gstR.gstAuthenticated; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstFoundOnGiddh$ = this.store.select(function (p) { return p.gstReconcile.gstFoundOnGiddh; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstNotFoundOnGiddhData$ = this.store.select(function (p) { return p.gstReconcile.gstReconcileData.notFoundOnGiddh; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstNotFoundOnPortalData$ = this.store.select(function (p) { return p.gstReconcile.gstReconcileData.notFoundOnPortal; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstMatchedData$ = this.store.select(function (p) { return p.gstReconcile.gstReconcileData.matched; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.gstPartiallyMatchedData$ = this.store.select(function (p) { return p.gstReconcile.gstReconcileData.partiallyMatched; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.store.select(function (p) { return p.company.dateRangePickerConfig; }).pipe().subscribe(function (a) {
            var gstr1DatePicker = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](a);
            gstr1DatePicker.opens = 'right';
            delete gstr1DatePicker.ranges['This Month to Date'];
            delete gstr1DatePicker.ranges['This Financial Year to Date'];
            delete gstr1DatePicker.ranges['This Year to Date'];
            delete gstr1DatePicker.ranges['Last Financial Year'];
            delete gstr1DatePicker.ranges['Last Year'];
            delete gstr1DatePicker.ranges['This Quarter to Date'];
            _this.datePickerOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](gstr1DatePicker));
            _this.selectedDateForGSTR1 = {
                from: moment_moment__WEBPACK_IMPORTED_MODULE_6__(a.startDate._d).format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"]),
                to: moment_moment__WEBPACK_IMPORTED_MODULE_6__(a.endDate._d).format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"])
            };
            var singleDatePickerOptions = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](gstr1DatePicker);
            singleDatePickerOptions.singleDatePicker = true;
            singleDatePickerOptions.startView = 'months';
            singleDatePickerOptions.minViewMode = 'months';
            _this.singleDatePickerOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(singleDatePickerOptions);
            _this.datePickerOptions = gstr1DatePicker;
        });
        this.setCurrentMonth();
    }
    PurchaseInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        var paginationRequest = new _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_16__["CommonPaginatedRequest"]();
        paginationRequest.page = 1;
        this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices(paginationRequest));
        this.store.select(function (p) { return p.invoicePurchase; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.purchaseInvoices && o.purchaseInvoices.items) {
                _this.allPurchaseInvoices = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o.purchaseInvoices);
                _this.allPurchaseInvoicesBackup = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o.purchaseInvoices);
            }
            _this.isDownloadingFileInProgress = o.isDownloadingFile;
            if (o.invoiceGenerateSuccess) {
                _this.generateInvoiceArr = [];
                var event_1 = { itemsPerPage: 10, page: _this.allPurchaseInvoices.page };
                _this.pageChanged(event_1);
            }
        });
        this.store.dispatch(this.invoicePurchaseActions.GetTaxesForThisCompany());
        this.store.select(function (p) { return p.invoicePurchase; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.taxes && o.taxes.length) {
                _this.allTaxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o.taxes);
            }
        });
        this.gstNotFoundOnGiddhData$.subscribe(function (s) {
            _this.loadReconcilePaginationComponent(s, 'NOT_ON_GIDDH');
        });
        this.gstNotFoundOnPortalData$.subscribe(function (s) {
            _this.loadReconcilePaginationComponent(s, 'NOT_ON_PORTAL');
        });
        this.gstPartiallyMatchedData$.subscribe(function (s) {
            _this.loadReconcilePaginationComponent(s, 'PARTIALLY_MATCHED');
        });
        this.gstMatchedData$.subscribe(function (s) {
            _this.loadReconcilePaginationComponent(s, 'MATCHED');
        });
        this.gstAuthenticated$.subscribe(function (s) {
            if (!s) {
                // commented due to not tested yet
                // this.toggleSettingAsidePane(null, 'RECONCILE');
            }
            else {
                //  means user logged in gst portal
            }
        });
    };
    PurchaseInvoiceComponent.prototype.selectedDate = function (value, dateInput) {
        // console.log('value is :', value);
        // console.log('dateInput is :', dateInput);
        // dateInput.start = value.start;
        // dateInput.end = value.end;
    };
    /**
     * filterPurchaseInvoice
     */
    PurchaseInvoiceComponent.prototype.filterPurchaseInvoice = function (searchString) {
        this.allPurchaseInvoices.items = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.allPurchaseInvoicesBackup.items);
        if (searchString) {
            var isValidInput = true;
            var patt_1;
            searchString = searchString.replace(/\\/g, '\\\\');
            try {
                patt_1 = new RegExp(searchString);
            }
            catch (e) {
                isValidInput = false;
            }
            if (isValidInput) {
                var allPurchaseInvoices = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.allPurchaseInvoices);
                allPurchaseInvoices.items = allPurchaseInvoices.items.filter(function (invoice) {
                    return (patt_1.test(invoice.account.gstIn) || patt_1.test(invoice.entryUniqueName) || patt_1.test(invoice.account.name) || patt_1.test(invoice.entryDate) || patt_1.test(invoice.invoiceNumber) || patt_1.test(invoice.particular));
                });
                this.allPurchaseInvoices = allPurchaseInvoices;
            }
        }
    };
    /**
     * sortInvoicesBy
     */
    PurchaseInvoiceComponent.prototype.sortInvoicesBy = function (filedName) {
        var allPurchaseInvoices = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.allPurchaseInvoices);
        allPurchaseInvoices.items = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["sortBy"](allPurchaseInvoices.items, [filedName]);
        this.allPurchaseInvoices = allPurchaseInvoices;
    };
    /**
     * onSelectGstrOption
     */
    PurchaseInvoiceComponent.prototype.onSelectGstrOption = function (gstrType) {
        this.selectedGstrType = gstrType;
        if (gstrType.name !== 'GSTR1') {
            this.showSingleDatePicker = true;
        }
        else {
            this.showSingleDatePicker = false;
        }
        if (gstrType.name === 'GSTR2') {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            this.fireGstReconcileRequest('NOT_ON_PORTAL');
        }
        if (gstrType.name === 'GSTR2' || gstrType.name === 'GSTR3B') {
            this.setCurrentMonth();
        }
    };
    PurchaseInvoiceComponent.prototype.monthChanged = function (ev, isMonth) {
        if (ev && ev.picker) {
            var dates = {
                from: moment_moment__WEBPACK_IMPORTED_MODULE_6__(ev.picker.startDate._d).format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"]),
                to: moment_moment__WEBPACK_IMPORTED_MODULE_6__(ev.picker.endDate._d).format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"])
            };
            this.selectedDateForGSTR1 = dates;
            this.isMonthSelected = false;
            this.selectedMonth = moment_moment__WEBPACK_IMPORTED_MODULE_6__(new Date());
        }
        else {
            var dates = {
                from: moment_moment__WEBPACK_IMPORTED_MODULE_6__(ev).startOf('month').format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"]),
                to: moment_moment__WEBPACK_IMPORTED_MODULE_6__(ev).endOf('month').format(apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"])
            };
            this.selectedDateForGSTR1 = dates;
            this.selectedMonth = ev;
            this.isMonthSelected = true;
            this.selectedDateForGSTR1.monthYear = moment_moment__WEBPACK_IMPORTED_MODULE_6__(ev).format('MM-YYYY');
        }
        if (this.selectedGstrType.name === 'GSTR2') {
            this.fireGstReconcileRequest(this.reconcileActiveTab, ev);
        }
    };
    /**
     * onUpdate
     */
    PurchaseInvoiceComponent.prototype.onUpdate = function () {
        if (this.generateInvoiceArr.length === 1) {
            var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.generateInvoiceArr[0]);
            var tax = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.generateInvoiceArr[0].taxes[1]);
            if (!tax) {
                this.toasty.errorToast('Minimum 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
                return false;
            }
            dataToSave.taxes[0] = tax;
            dataToSave.taxes.splice(1, 1);
            if (dataToSave.taxes.length > 1) {
                this.toasty.errorToast('Only 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
                return false;
            }
            else if (dataToSave.taxes.length < 1) {
                this.toasty.errorToast('Minimum 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
                return false;
            }
            this.store.dispatch(this.invoicePurchaseActions.GeneratePurchaseInvoice(dataToSave));
        }
        else {
            return;
        }
    };
    /**
     * onSelectRow
     */
    PurchaseInvoiceComponent.prototype.onSelectRow = function (indx) {
        this.selectedRowIndex = indx;
    };
    PurchaseInvoiceComponent.prototype.arrayBufferToBase64 = function (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    /**
     * onDownloadSheetGSTR
     */
    PurchaseInvoiceComponent.prototype.onDownloadSheetGSTR = function (typeOfSheet) {
        if (this.selectedDateForGSTR1) {
            var check = moment_moment__WEBPACK_IMPORTED_MODULE_6__(this.selectedDateForGSTR1, 'YYYY/MM/DD');
            var monthToSend = check.format('MM') + '-' + check.format('YYYY');
            if (this.activeCompanyGstNumber) {
                if (typeOfSheet === 'gstr1-excel-export' || 'gstr2-excel-export') {
                    this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1Sheet(this.selectedDateForGSTR1, this.activeCompanyGstNumber, typeOfSheet, this.selectedGstrType.name));
                }
                else if (typeOfSheet === 'gstr1-error-export' || 'gstr2-error-export') {
                    this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1ErrorSheet(this.selectedDateForGSTR1, this.activeCompanyGstNumber, typeOfSheet, this.selectedGstrType.name));
                }
            }
            else {
                this.toasty.errorToast('GST number not found.');
            }
        }
        else {
            this.toasty.errorToast('Please select month');
        }
    };
    PurchaseInvoiceComponent.prototype.setCurrentMonth = function () {
        this.selectedDateForGSTR1.monthYear = moment_moment__WEBPACK_IMPORTED_MODULE_6__().format('MM-YYYY');
    };
    PurchaseInvoiceComponent.prototype.clearDate = function () {
        this.selectedDateForGSTR1.monthYear = moment_moment__WEBPACK_IMPORTED_MODULE_6__();
    };
    /**
     * onChangeEntryType
     */
    PurchaseInvoiceComponent.prototype.onChangeEntryType = function (indx, value, accUniqName) {
        var _this = this;
        // console.log(value);
        clearInterval(this.intervalId);
        this.timeCounter = 10;
        if (indx > -1 && (value === 'composite' || value === '')) {
            this.selectedRowIndex = indx;
            this.selectedEntryTypeValue = value;
            this.isReverseChargeSelected = false;
            this.intervalId = setInterval(function () {
                // console.log('running...');
                _this.timeCounter--;
                _this.checkForCounterValue(_this.timeCounter);
            }, 1000);
        }
        else if (value === 'reverse charge') {
            this.isReverseChargeSelected = true;
            this.selectedRowIndex = indx;
            this.intervalId = setInterval(function () {
                _this.timeCounter--;
                _this.checkForCounterValue(_this.timeCounter);
            }, 1000);
            // this.selectTax({ target: { checked: true } }, selectedTax);
        }
    };
    /**
     * checkForCounterValue
     */
    PurchaseInvoiceComponent.prototype.checkForCounterValue = function (counterValue) {
        if (this.intervalId && (counterValue === 0 || this.undoEntryTypeChange) && this.intervalId._state === 'running') {
            clearInterval(this.intervalId);
            this.timeCounter = 10;
            if (!this.undoEntryTypeChange) {
                this.updateEntryType(this.selectedRowIndex, this.selectedEntryTypeValue);
            }
            this.undoEntryTypeChange = false;
        }
    };
    /**
     * onUndoEntryTypeChange
     */
    PurchaseInvoiceComponent.prototype.onUndoEntryTypeChange = function (idx, itemObj) {
        this.undoEntryTypeChange = true;
        // console.log(idx, itemObj);
        if (this.allPurchaseInvoices.items[idx].invoiceNumber === this.allPurchaseInvoicesBackup.items[idx].invoiceNumber) {
            this.allPurchaseInvoices.items[idx].entryType = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.allPurchaseInvoicesBackup.items[idx].entryType);
            this.selectedRowIndex = idx;
            if (this.allPurchaseInvoices.items[idx].entryType !== 'reverse charge') {
                this.isReverseChargeSelected = false;
            }
        }
    };
    PurchaseInvoiceComponent.prototype.getDefaultGstAddress = function (addresses) {
        if (addresses.length > 0) {
            return addresses.findIndex(function (o) { return o.isDefault; });
        }
        else {
            return false;
        }
    };
    /**
     * updateEntryType
     */
    PurchaseInvoiceComponent.prototype.updateEntryType = function (indx, value) {
        var _this = this;
        if (indx > -1 && (value === 'composite' || value === '')) {
            var account_1 = new _models_api_models_Account__WEBPACK_IMPORTED_MODULE_15__["AccountRequestV2"]();
            var defaultGstObj_1 = new _models_api_models_Account__WEBPACK_IMPORTED_MODULE_15__["IAccountAddress"]();
            var isComposite_1;
            if (value === 'composite') {
                isComposite_1 = true;
            }
            else if (value === '') {
                isComposite_1 = false;
            }
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.allPurchaseInvoices.items);
            var selectedRow = data[indx];
            var selectedAccName = selectedRow.account.uniqueName;
            this.accountService.GetAccountDetailsV2(selectedAccName).subscribe(function (accDetails) {
                var addressesArr = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](accDetails.body.addresses);
                var defaultAddressIdx = _this.getDefaultGstAddress(addressesArr);
                var accountData = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](accDetails.body);
                defaultGstObj_1 = accountData.addresses[defaultAddressIdx];
                if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["isNumber"](defaultAddressIdx) && isComposite_1 !== defaultGstObj_1.isComposite) {
                    account_1.name = accountData.name;
                    account_1.uniqueName = accountData.uniqueName;
                    account_1.hsnNumber = accountData.hsnNumber;
                    account_1.country = accountData.country;
                    account_1.sacNumber = accountData.sacNumber;
                    account_1.addresses = accountData.addresses;
                    account_1.addresses[defaultAddressIdx].isComposite = isComposite_1;
                    var parentGroup = accountData.parentGroups[accountData.parentGroups.length - 1];
                    var reqObj = {
                        groupUniqueName: parentGroup.uniqueName,
                        accountUniqueName: account_1.uniqueName
                    };
                    _this.accountService.UpdateAccountV2(account_1, reqObj).subscribe(function (res) {
                        if (res.status === 'success') {
                            _this.toasty.successToast('Entry type changed successfully.');
                        }
                        else {
                            _this.toasty.errorToast(res.message, res.code);
                        }
                    });
                }
                else {
                    return;
                }
            });
        }
    };
    /**
     * toggleSettingAsidePane
     */
    PurchaseInvoiceComponent.prototype.toggleSettingAsidePane = function (event, selectedService) {
        if (event) {
            event.preventDefault();
        }
        if (selectedService === 'RECONCILE') {
            var checkIsAuthenticated_1;
            this.gstAuthenticated$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (auth) { return checkIsAuthenticated_1 = auth; });
            if (checkIsAuthenticated_1) {
                this.fireGstReconcileRequest(this.reconcileActiveTab, this.selectedDateForGSTR1, 1, true);
                return;
            }
        }
        if (selectedService) {
            this.selectedServiceForGSTR1 = selectedService;
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
    };
    /**
     * SelectAllTaxes
     */
    PurchaseInvoiceComponent.prototype.selectAllTaxes = function (event) {
        if (event.target.checked) {
            this.purchaseInvoiceObject.isAllTaxSelected = true;
            this.allTaxes.forEach(function (tax) { return tax.isSelected = true; });
            this.purchaseInvoiceObject.TaxList = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["clone"](this.allTaxes);
        }
        else {
            this.isSelectedAllTaxes = false;
            this.allTaxes.forEach(function (tax) { return tax.isSelected = false; });
            this.purchaseInvoiceObject.TaxList = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["clone"](this.allTaxes);
        }
    };
    /**
     * KeepCountofSelectedOptions
     */
    PurchaseInvoiceComponent.prototype.makeCount = function () {
        var count = 0;
        var purchaseInvoiceObject = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.purchaseInvoiceObject);
        purchaseInvoiceObject.TaxList.forEach(function (tax) {
            if (tax.isSelected) {
                count += 1;
            }
        });
        this.purchaseInvoiceObject = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](purchaseInvoiceObject);
        return count;
    };
    /**
     * selectTaxOption
     */
    PurchaseInvoiceComponent.prototype.selectTax = function (event, tax, idx) {
        if (event.target.checked) {
            // console.log(tax);
            this.allPurchaseInvoices.items[idx].taxes[1] = tax.uniqueName;
            // this.allPurchaseInvoices[idx].taxes[0] = tax.uniqueName;
            // console.log(this.allPurchaseInvoices.items[idx]);
        }
        else {
            event.preventDefault();
            this.toasty.errorToast('Minimun 1 tax should be selected.');
            return;
        }
    };
    /**
     * toggle dropdown heading
     */
    PurchaseInvoiceComponent.prototype.onDDShown = function () {
        this.dropdownHeading = 'Selected Taxes';
    };
    /**
     * toggle dropdown heading
     */
    PurchaseInvoiceComponent.prototype.onDDHidden = function (uniqueName, accountUniqueName) {
        var taxUniqueNames = [];
        this.dropdownHeading = 'Select Taxes';
        var purchaseInvoiceRequestObject = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.purchaseInvoiceRequestObject);
        var purchaseInvoiceObject = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.purchaseInvoiceObject);
        purchaseInvoiceRequestObject.entryUniqueName.push(uniqueName);
        purchaseInvoiceRequestObject.taxes = purchaseInvoiceObject.TaxList;
        for (var _i = 0, _a = purchaseInvoiceRequestObject.taxes; _i < _a.length; _i++) {
            var tax = _a[_i];
            taxUniqueNames.push(tax.uniqueName);
        }
    };
    /**
     * ngOnDestroy
     */
    PurchaseInvoiceComponent.prototype.ngOnDestroy = function () {
        // Call the Update Entry Type API
        // If user change the page and counter is running...
        if (this.intervalId && this.intervalId._state === 'running') {
            this.updateEntryType(this.selectedRowIndex, this.selectedEntryTypeValue);
        }
        this.store.dispatch(this._reconcileActions.ResetGstReconcileState());
    };
    /**
     * generateInvoice
     */
    PurchaseInvoiceComponent.prototype.generateInvoice = function (item, event) {
        if (event.target.checked) {
            this.generateInvoiceArr[0] = item; // temporary fix for single invoice generate
            this.invoiceSelected = true;
        }
        else {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["remove"](this.generateInvoiceArr, function (obj) { return obj.entryUniqueName === item.entryUniqueName; });
            this.invoiceSelected = false;
        }
        // console.log(this.generateInvoiceArr);
    };
    /**
     * editRow
     */
    PurchaseInvoiceComponent.prototype.editRow = function (idx) {
        this.selectedRowIndex = idx;
        this.editMode = true;
        // console.log(idx);
    };
    /**
     * updateEntry
     */
    PurchaseInvoiceComponent.prototype.updateEntry = function (invoiceObj) {
        // console.log(invoiceObj);
        var invoice = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](invoiceObj);
        var dataToSave = {
            accountUniqueName: invoice.account.uniqueName,
            voucherNo: invoice.invoiceNumber,
            ledgerUniqname: invoice.entryUniqueName,
            sendToGstr2: invoice.sendToGstr2,
            availItc: invoice.availItc
        };
        this.store.dispatch(this.invoicePurchaseActions.UpdatePurchaseEntry(dataToSave));
        this.editMode = false;
        this.selectedRowIndex = null;
    };
    PurchaseInvoiceComponent.prototype.pageChanged = function (event) {
        this.resetStateOnPageChange();
        var paginationRequest = new _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_16__["CommonPaginatedRequest"]();
        paginationRequest.page = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](event.page);
        this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices(paginationRequest));
    };
    PurchaseInvoiceComponent.prototype.reconcileTabChanged = function (action) {
        this.reconcileActiveTab = action;
        this.fireGstReconcileRequest(action);
    };
    PurchaseInvoiceComponent.prototype.reconcilePageChanged = function (event, action) {
        this.fireGstReconcileRequest(action, this.selectedDateForGSTR1, event.page);
    };
    /**
     * resetStateOnPageChange
     */
    PurchaseInvoiceComponent.prototype.resetStateOnPageChange = function () {
        this.timeCounter = 10;
        clearInterval(this.intervalId);
        this.pageChnageState = true;
        this.generateInvoiceArr = [];
        this.selectedRowIndex = null;
        this.editMode = false;
    };
    /**
     * COMMENTED DUE TO PHASE-2
     * validateGstin
     */
    // public validateGstin(val, idx) {
    //   if (val && val.length === 15) {
    //     let code = val.substr(0, 2);
    //     console.log(code);
    //     let Gststate = this.stateList.filter((obj) => obj.code === code);
    //     if (_.isEmpty(Gststate)) {
    //       this.toasty.errorToast(val + ' Invalid GSTIN Number.');
    //     }
    //     console.log(Gststate);
    //   } else if (val) {
    //     this.toasty.errorToast(val + ' Invalid GSTIN Number.');
    //     console.log(idx);
    //   }
    // }
    /**
     * updateOncheck
     */
    PurchaseInvoiceComponent.prototype.updateOncheck = function (invoiceObj, key, value) {
        var invoice = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](invoiceObj) || {};
        invoice[key] = value;
        console.log(invoice);
        if (invoice.entryUniqueName) {
            this.updateEntry(invoice);
            /* commented for later use
            this.store.dispatch(this.invoicePurchaseActions.UpdateInvoice(invoiceObj));
            */
        }
    };
    PurchaseInvoiceComponent.prototype.emailSheet = function (isDownloadDetailSheet) {
        var check = moment_moment__WEBPACK_IMPORTED_MODULE_6__(this.selectedMonth, 'MM-YYYY');
        var monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (!monthToSend) {
            this.toasty.errorToast('Please select a month');
        }
        else if (!this.activeCompanyGstNumber) {
            this.toasty.errorToast('No GST Number found for selected company');
        }
        else {
            this.store.dispatch(this.invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    };
    /**
     * fileJioGstReturn
     */
    PurchaseInvoiceComponent.prototype.fileJioGstReturn = function (Via) {
        var check = moment_moment__WEBPACK_IMPORTED_MODULE_6__(this.selectedDateForGSTR1, 'YYYY/MM/DD');
        var monthToSend = check.format('MM') + '-' + check.format('YYYY');
        if (this.activeCompanyGstNumber) {
            this.store.dispatch(this.invoicePurchaseActions.FileJioGstReturn(this.selectedDateForGSTR1, this.activeCompanyGstNumber, Via));
        }
        else {
            this.toasty.errorToast('GST number not found.');
        }
    };
    PurchaseInvoiceComponent.prototype.fireGstReconcileRequest = function (action, selectedDateForGSTR1, page, refresh) {
        if (selectedDateForGSTR1 === void 0) { selectedDateForGSTR1 = this.selectedDateForGSTR1; }
        if (page === void 0) { page = 1; }
        if (refresh === void 0) { refresh = false; }
        // commented due to not tested yet by alok sir
        // this.store.dispatch(this._reconcileActions.GstReconcileInvoiceRequest(
        //   this.moment(selectedDateForGSTR1).format('MMYYYY'), action, page.toString(), refresh)
        // );
    };
    PurchaseInvoiceComponent.prototype.loadReconcilePaginationComponent = function (s, action) {
        var _this = this;
        if (s.count === 0) {
            return;
        }
        if (action !== this.reconcileActiveTab) {
            return;
        }
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["PaginationComponent"]);
        var viewContainerRef = null;
        switch (this.reconcileActiveTab) {
            case 'NOT_ON_GIDDH':
                viewContainerRef = this.pgGstNotFoundOnGiddh.viewContainerRef;
                break;
            case 'NOT_ON_PORTAL':
                viewContainerRef = this.pgGstNotFoundOnPortal.viewContainerRef;
                break;
            case 'MATCHED':
                viewContainerRef = this.pgMatched.viewContainerRef;
                break;
            case 'PARTIALLY_MATCHED':
                viewContainerRef = this.pgPartiallyMatched.viewContainerRef;
                break;
        }
        viewContainerRef.remove();
        var componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);
        var componentInstance = componentInstanceView.instance;
        componentInstance.totalItems = s.data.totalItems;
        componentInstance.itemsPerPage = s.data.count;
        componentInstance.maxSize = 5;
        componentInstance.writeValue(s.data.page);
        componentInstance.boundaryLinks = true;
        componentInstance.pageChanged.subscribe(function (e) {
            _this.reconcilePageChanged(e, _this.reconcileActiveTab);
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('pgGstNotFoundOnPortal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"])
    ], PurchaseInvoiceComponent.prototype, "pgGstNotFoundOnPortal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('pgGstNotFoundOnGiddh'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"])
    ], PurchaseInvoiceComponent.prototype, "pgGstNotFoundOnGiddh", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('pgPartiallyMatched'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"])
    ], PurchaseInvoiceComponent.prototype, "pgPartiallyMatched", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('pgMatched'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"])
    ], PurchaseInvoiceComponent.prototype, "pgMatched", void 0);
    PurchaseInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'invoice-purchase',
            template: __webpack_require__(/*! ./purchase.invoice.component.html */ "./src/app/purchase/purchase-invoice/purchase.invoice.component.html"),
            providers: [
                {
                    provide: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsDropdownConfig"], useValue: { autoClose: true },
                },
                {
                    provide: ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_19__["AlertConfig"], useValue: {}
                }
            ],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["transition"])('in <=> out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_17__["animate"])('400ms ease-in-out')),
                ]),
            ],
            styles: [__webpack_require__(/*! ./purchase.invoice.component.css */ "./src/app/purchase/purchase-invoice/purchase.invoice.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["Location"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"],
            _actions_purchase_invoice_purchase_invoice_action__WEBPACK_IMPORTED_MODULE_11__["InvoicePurchaseActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_12__["ToasterService"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__["CompanyActions"],
            _services_purchase_invoice_service__WEBPACK_IMPORTED_MODULE_8__["PurchaseInvoiceService"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_14__["AccountService"],
            _actions_gst_reconcile_GstReconcile_actions__WEBPACK_IMPORTED_MODULE_18__["GstReconcileActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ComponentFactoryResolver"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_21__["SettingsProfileActions"]])
    ], PurchaseInvoiceComponent);
    return PurchaseInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<perfect-scrollbar [scrollIndicators]=\"true\" fxFlex=\"auto\" [config]=\"{suppressScrollX: false, suppressScrollY: false}\">\n    <table class=\"table\" style=\"width: 2000px\">\n        <thead style=\"font-size: 14px;\">\n            <tr>\n                <th><input class=\"ng-tns-c22-2 ng-untouched ng-pristine ng-valid\" type=\"checkbox\"></th>\n                <th>VENDOR DETAILS</th>\n                <th>ACCOUNT NAME</th>\n                <th>INVOICE NUMBER</th>\n                <th>TRANSATION DATE</th>\n                <th>PLACE OF SUPPLY</th>\n                <th class=\"text-right\">TAXABLE AMOUNT</th>\n                <th class=\"text-right\">IGST</th>\n                <th class=\"text-right\">CGST</th>\n                <th class=\"text-right\">SGST</th>\n                <th class=\"text-right\">CESS</th>\n                <th class=\"text-right\">TOTAL AMOUNT</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr class=\"bt-border-1px  tr-td-div\" *ngFor=\"let item of data?.results\">\n                <td><input class=\"ng-tns-c22-2 ng-untouched ng-pristine ng-valid\" type=\"checkbox\"></td>\n                <td>\n                    <div>\n                        <span>{{ item.ctin }} </span>\n                    </div>\n                </td>\n                <td>\n                    <div>{{ item.accountName }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.accountName !== item.dataInGiddh.accountName}\">{{ item.dataInGiddh.accountName }}\n                    </div>\n\n                </td>\n                <td>\n                    <div>{{ item.invoiceNumber }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.invoiceNumber !== item.dataInGiddh.invoiceNumber}\">\n                        {{ item.dataInGiddh.invoiceNumber }}\n                    </div>\n\n                </td>\n                <td>\n                    <div>{{ item.invoiceDate }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.invoiceDate !== item.dataInGiddh.invoiceDate}\">\n                        {{ item.dataInGiddh.invoiceDate }}\n                    </div>\n\n\n                </td>\n                <td>\n                    <div>{{ item.placeOfSupply }} ({{item.stateCode}})</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.placeOfSupply !== item.dataInGiddh.placeOfSupply}\">\n                        {{ item.dataInGiddh.placeOfSupply }} ({{ item.dataInGiddh.stateCode }})\n                    </div>\n\n\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.taxableAmount }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.taxableAmount !== item.dataInGiddh.taxableAmount}\">\n                        <i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.taxableAmount }}\n                    </div>\n\n\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.igst }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.igst !== item.dataInGiddh.igst}\">\n                        <i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.igst }}\n                    </div>\n\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.cgst }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.cgst !== item.dataInGiddh.cgst}\">\n                        <i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.cgst }}\n                    </div>\n\n\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.sgst }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.sgst !== item.dataInGiddh.sgst}\"><i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.sgst }}\n                    </div>\n\n\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.cess }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.cess !== item.dataInGiddh.cess}\">\n                        <i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.cess }}\n                    </div>\n                </td>\n                <td class=\"text-right\">\n                    <div><i class=\"fa fa-inr\"></i> {{ item.grandTotal }}</div>\n                    <div *ngIf=\"item.dataInGiddh\" [ngClass]=\"{ 'text-danger': item.grandTotal !== item.dataInGiddh.grandTotal}\">\n                        <i class=\"fa fa-inr\"></i> {{ item.dataInGiddh.grandTotal }}\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</perfect-scrollbar>"

/***/ }),

/***/ "./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.ts ***!
  \****************************************************************************************/
/*! exports provided: ReconcileDesignComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReconcileDesignComponent", function() { return ReconcileDesignComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_GstReconcile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/api-models/GstReconcile */ "./src/app/models/api-models/GstReconcile.ts");



var ReconcileDesignComponent = /** @class */ (function () {
    function ReconcileDesignComponent() {
        this.data = null;
    }
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_GstReconcile__WEBPACK_IMPORTED_MODULE_2__["GstReconcileInvoiceDetails"])
    ], ReconcileDesignComponent.prototype, "data", void 0);
    ReconcileDesignComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reconcileDesign',
            template: __webpack_require__(/*! ./reconcileDesign.component.html */ "./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.html")
        })
    ], ReconcileDesignComponent);
    return ReconcileDesignComponent;
}());



/***/ }),

/***/ "./src/app/purchase/purchase.component.html":
/*!**************************************************!*\
  !*** ./src/app/purchase/purchase.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/purchase/purchase.component.ts":
/*!************************************************!*\
  !*** ./src/app/purchase/purchase.component.ts ***!
  \************************************************/
/*! exports provided: PurchaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PurchaseComponent", function() { return PurchaseComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");


/**
 * Created by kunalsaxena on 9/1/17.
 */




var PurchaseComponent = /** @class */ (function () {
    function PurchaseComponent(store, _companyActions) {
        this.store = store;
        this._companyActions = _companyActions;
        // console.log('Hi this is purchase component');
    }
    PurchaseComponent.prototype.ngOnInit = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'purchase';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    };
    PurchaseComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./purchase.component.html */ "./src/app/purchase/purchase.component.html"),
            styles: ["\n    .invoice-bg {\n      background-color: #f4f5f8;\n      padding: 20px;\n    }\n\n    .invoice-nav.navbar-nav > li > a {\n      padding: 6px 30px;\n      font-size: 14px;\n      color: #333;\n      background-color: #e6e6e6\n    }\n\n    .invoice-nav.navbar-nav > li > a:hover {\n      background-color: #ff5f00;\n      color: #fff;\n    }\n\n    .invoice-nav.navbar-nav > li > a.active {\n      background-color: #fff;\n      color: #ff5f00;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__["CompanyActions"]])
    ], PurchaseComponent);
    return PurchaseComponent;
}());



/***/ }),

/***/ "./src/app/purchase/purchase.module.ts":
/*!*********************************************!*\
  !*** ./src/app/purchase/purchase.module.ts ***!
  \*********************************************/
/*! exports provided: PurchaseModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PurchaseModule", function() { return PurchaseModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "../../node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _purchase_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./purchase.routing.module */ "./src/app/purchase/purchase.routing.module.ts");
/* harmony import */ var _purchase_invoice_purchase_invoice_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./purchase-invoice/purchase.invoice.component */ "./src/app/purchase/purchase-invoice/purchase.invoice.component.ts");
/* harmony import */ var _purchase_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./purchase.component */ "./src/app/purchase/purchase.component.ts");
/* harmony import */ var _purchase_invoice_aside_menu_aside_menu_purchase_invoice_setting_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component */ "./src/app/purchase/purchase-invoice/aside-menu/aside-menu-purchase-invoice-setting.component.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap/collapse */ "../../node_modules/ngx-bootstrap/collapse/index.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "../../node_modules/ngx-bootstrap/dropdown/index.js");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _shared_helpers_pipes_highlightPipe_highlight_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../shared/helpers/pipes/highlightPipe/highlight.module */ "./src/app/shared/helpers/pipes/highlightPipe/highlight.module.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _purchase_invoice_reconcileDesign_reconcileDesign_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./purchase-invoice/reconcileDesign/reconcileDesign.component */ "./src/app/purchase/purchase-invoice/reconcileDesign/reconcileDesign.component.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "../../node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");



















/**
 * Created by kunalsaxena on 9/1/17.
 */
var PurchaseModule = /** @class */ (function () {
    function PurchaseModule() {
    }
    PurchaseModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [_purchase_invoice_purchase_invoice_component__WEBPACK_IMPORTED_MODULE_4__["PurchaseInvoiceComponent"], _purchase_component__WEBPACK_IMPORTED_MODULE_5__["PurchaseComponent"], _purchase_invoice_aside_menu_aside_menu_purchase_invoice_setting_component__WEBPACK_IMPORTED_MODULE_6__["AsideMenuPurchaseInvoiceSettingComponent"], _purchase_invoice_reconcileDesign_reconcileDesign_component__WEBPACK_IMPORTED_MODULE_16__["ReconcileDesignComponent"]],
            imports: [
                _purchase_routing_module__WEBPACK_IMPORTED_MODULE_3__["PurchaseRoutingModule"],
                ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_9__["CollapseModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_8__["PaginationModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_7__["DatepickerModule"],
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_10__["BsDropdownModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_11__["Daterangepicker"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_12__["LaddaModule"],
                _shared_helpers_pipes_highlightPipe_highlight_module__WEBPACK_IMPORTED_MODULE_13__["HighlightModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_1__["TooltipModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_14__["ClickOutsideModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["AlertModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_17__["ElementViewChildModule"],
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_18__["PerfectScrollbarModule"]
            ],
            entryComponents: [
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_8__["PaginationComponent"]
            ],
            exports: [
                _purchase_invoice_aside_menu_aside_menu_purchase_invoice_setting_component__WEBPACK_IMPORTED_MODULE_6__["AsideMenuPurchaseInvoiceSettingComponent"]
            ]
        })
    ], PurchaseModule);
    return PurchaseModule;
}());



/***/ }),

/***/ "./src/app/purchase/purchase.routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/purchase/purchase.routing.module.ts ***!
  \*****************************************************/
/*! exports provided: PurchaseRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PurchaseRoutingModule", function() { return PurchaseRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _purchase_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./purchase.component */ "./src/app/purchase/purchase.component.ts");
/* harmony import */ var _purchase_invoice_purchase_invoice_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./purchase-invoice/purchase.invoice.component */ "./src/app/purchase/purchase-invoice/purchase.invoice.component.ts");








/**
 * Created by kunalsaxena on 9/1/17.
 */
var INVOICE_ROUTES = [
    {
        path: '',
        canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_2__["NeedsAuthentication"]],
        component: _purchase_component__WEBPACK_IMPORTED_MODULE_6__["PurchaseComponent"],
        children: [
            { path: '', redirectTo: 'invoice', pathMatch: 'full' },
            { path: 'invoice', component: _purchase_invoice_purchase_invoice_component__WEBPACK_IMPORTED_MODULE_7__["PurchaseInvoiceComponent"] },
        ]
    }
];
var PurchaseRoutingModule = /** @class */ (function () {
    function PurchaseRoutingModule() {
    }
    PurchaseRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["NgModule"])({
            declarations: [],
            imports: [
                // Daterangepicker,
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(INVOICE_ROUTES),
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"],
                // Ng2BootstrapModule,
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
            ],
            providers: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["Location"]]
        })
    ], PurchaseRoutingModule);
    return PurchaseRoutingModule;
}());



/***/ })

}]);