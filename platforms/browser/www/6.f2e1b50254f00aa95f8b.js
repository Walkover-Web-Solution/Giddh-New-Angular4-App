(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./src/app/theme/account-detail-modal/account-detail-modal.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/theme/account-detail-modal/account-detail-modal.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- AccountInfo -->\n<div *ngIf=\"isModalOpen\" class=\"p-modal-tolltip\">\n    <div class=\"tb-pl-modal-header\" style=\"padding: 0 !important;\">\n\n        <div class=\"account-detail-modal-header-div\">\n\n            <div class=\"account-detail-modal-div\">\n\n                <div class=\"account-detail-custom-header\">\n\n                    <div class=\"d-flex\" style=\"padding: 0px; border-right:0px;\">\n\n                        <div class=\"account-detail-padding\" style=\"flex: 1;border-right: 0px;\">\n                            <h3 class=\"account-detail-custom-title\">{{accInfo?.name}}</h3>\n                        </div>\n\n                        <div class=\"account-detail-padding\" (click)=\"performActions(0)\">\n                            <img src=\"./assets/images/path.svg\">\n                        </div>\n\n                    </div>\n\n                    <div class=\"custom-detail account-detail-padding\">\n                        <h4>{{accInfo?.mobileNo}}</h4>\n                        <h4>{{accInfo?.email}}</h4>\n                        <!--<h4></h4>-->\n                    </div>\n\n                </div>\n\n                <div class=\"height-82px\">\n\n                    <ul class=\"list-unstyled\">\n\n                        <li class=\"li-link\">\n                            <a href=\"javascript: void 0\" (click)=\"performActions(1)\">Go to Ledger</a>\n                        </li>\n\n                        <li class=\"li-link\">\n                            <a href=\"javascript: void 0\" (click)=\"performActions(2)\">Generate Invoice</a>\n                        </li>\n\n                        <li class=\"li-link\">\n                            <a href=\"javascript: void 0\" (click)=\"performActions(3, $event)\">Send SMS</a>\n                        </li>\n\n                        <li class=\"li-link\">\n                            <a href=\"javascript: void 0\" (click)=\"performActions(4, $event)\">Send Email</a>\n                        </li>\n\n                    </ul>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n</div>\n\n\n<!--Modal for Mail/SMS-->\n<div class=\"modal fade noBrdRdsModal\" tabindex=\"-1\" bsModal #mailModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\" (click)=\"$event.stopPropagation()\">\n    <div class=\"modal-dialog modal-md\" style=\"margin:auto;margin-top: 200px\">\n\n        <div class=\"modal-content\" style=\"padding: 8px 8px 8px 8px;\">\n\n            <div class=\"noBrdRdsModal\" style=\"padding: 8px 8px 8px 8px;\">\n\n                <div class=\"modal-header themeBg pdL2 pdR2 clearfix\" style=\"padding: 8px 8px 8px 8px;\">\n                    <h3 class=\"modal-title bg\" id=\"modal-title\">{{messageBody.header.set}}</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" (click)=\"mailModal.hide()\">×</span>\n                    <!-- <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" ></i> -->\n                </div>\n\n                <div class=\"modal-body pdL2 pdR2 clearfix\" style=\"padding: 0px !important;\">\n                    <h1 class=\"mrB1\" *ngIf=\"messageBody.type == 'Email'\" style=\"margin-top:15px;\">Enter Subject:</h1>\n                    <input *ngIf=\"messageBody.type == 'Email'\" class=\"form-control mrB1\" #subject [(ngModel)]=\"messageBody.subject\" type=\"text\" placeholder=\"Enter subject here\" />\n                    <h1 class=\"mrB1\" style=\"margin-top:15px;\">Type message body:</h1>\n                    <textarea #messageBox [(ngModel)]=\"messageBody.msg\" class=\"form-control\" rows=\"4\" style=\"resize:none;\" placeholder=\"start typing your message here\"></textarea>\n                    <small class=\"mrT mrB grey\" style=\"margin-top:15px;display: block\">Tip: Click on the tabs below to insert data\n            in your message body. Anything\n            followed by '%s_' represents the position where actual data will be placed.\n          </small>\n\n                    <div class=\"row mrT2\" style=\"border: unset;margin-top: 20px;\">\n                        <ul class=\"list-inline pills\">\n                            <li *ngFor=\"let val of dataVariables\" (click)=\"addValueToMsg(val)\" style=\"padding: 5px 10px !important;\">{{val.name}}</li>\n                        </ul>\n                    </div>\n                    <div class=\"mrT4\">\n                        <button class=\"btn btn-sm btn-success pull-right mrL1\" (click)=\"send()\">{{messageBody.btn.set}}</button>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/theme/account-detail-modal/account-detail-modal.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/theme/account-detail-modal/account-detail-modal.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".account-detail-modal-header {\n  position: absolute;\n  top: 20px;\n  left: 30%;\n  right: auto;\n  z-index: 1;\n  margin: 0;\n  background: white;\n  width: 50%;\n  padding: 1px;\n  box-shadow: 1px 0 9px grey; }\n\n.account-detail-modal-header-div {\n  padding: 0;\n  border-radius: 0; }\n\n.account-detail-modal-div {\n  height: 100%;\n  padding: 0; }\n\n.account-detail-custom-header {\n  border-right: 0;\n  padding: 11px 10px 10px 10px;\n  width: 100%;\n  background: #ffece094;\n  white-space: initial; }\n\n.account-detail-custom-title {\n  font-family: LatoWebBold !important;\n  font-size: 16px !important; }\n\n.account-detail-padding {\n  padding: 1px;\n  text-transform: none !important; }\n\n.custom-detail h4 {\n  color: #707070;\n  margin-top: 7px;\n  font-size: 14px !important;\n  font-family: latoWeb !important; }\n\n.height-82px {\n  padding: 10px 10px 15px 10px;\n  border-top: 1px solid #C7C7C7; }\n\nul.list-unstyled li {\n  margin-top: 7px; }\n\nul.list-unstyled li a {\n  color: black; }\n\n.p-modal-tolltip {\n  display: block;\n  position: absolute;\n  background-color: white;\n  z-index: 1000;\n  width: 257px;\n  border: 1px solid #b4afaf;\n  border-radius: 4px;\n  box-shadow: 0 7px 24px #00000038; }\n\n.model-position {\n  float: right;\n  right: -234px; }\n\n.li-link {\n  margin-top: 15px !important; }\n\n.li-link a:hover {\n    color: #ff4700 !important; }\n\nul.pills {\n  white-space: initial; }\n"

/***/ }),

/***/ "./src/app/theme/account-detail-modal/account-detail-modal.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/theme/account-detail-modal/account-detail-modal.component.ts ***!
  \******************************************************************************/
/*! exports provided: AccountDetailModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountDetailModalComponent", function() { return AccountDetailModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");










var AccountDetailModalComponent = /** @class */ (function () {
    function AccountDetailModalComponent(store, _companyServices, _toaster, _groupWithAccountsAction, _router) {
        this.store = store;
        this._companyServices = _companyServices;
        this._toaster = _toaster;
        this._groupWithAccountsAction = _groupWithAccountsAction;
        this._router = _router;
        this.isModalOpen = false;
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
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.flattenAccountsStream$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(function (s) { return s.general.flattenAccounts; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$));
    }
    AccountDetailModalComponent.prototype.ngOnInit = function () {
        //
    };
    AccountDetailModalComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['accountUniqueName'] && changes['accountUniqueName'].currentValue
            && (changes['accountUniqueName'].currentValue !== changes['accountUniqueName'].previousValue)) {
            this.flattenAccountsStream$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["take"])(1)).subscribe(function (data) {
                if (data && data.length) {
                    _this.accInfo = data.find(function (f) { return f.uniqueName === changes['accountUniqueName'].currentValue; });
                    var creditorsString = 'currentliabilities, sundrycreditors';
                    _this.purchaseOrSales = _this.accInfo.uNameStr.indexOf(creditorsString) > -1 ? 'purchase' : 'sales';
                }
            });
        }
    };
    AccountDetailModalComponent.prototype.performActions = function (type, event) {
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(this.accInfo.name));
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(this.accInfo.name));
                break;
            case 1: // go to ledger
                this.goToRoute('ledger', "/" + this.from + "/" + this.to);
                break;
            case 2: // go to sales or purchase
                if (this.purchaseOrSales === 'purchase') {
                    this.goToRoute('proforma-invoice/invoice/purchase');
                }
                else {
                    // special case, because we don't have cash invoice as voucher type at api side so we are handling it ui side
                    var isCashInvoice = this.accountUniqueName === 'cash';
                    this.goToRoute("proforma-invoice/invoice/" + (isCashInvoice ? 'cash' : 'sales'));
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
    // Open Modal for Email
    AccountDetailModalComponent.prototype.openEmailDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    };
    // Open Modal for SMS
    AccountDetailModalComponent.prototype.openSmsDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    };
    // Add Selected Value to Message Body
    AccountDetailModalComponent.prototype.addValueToMsg = function (val) {
        this.typeInTextarea(val.value);
        // this.messageBody.msg += ` ${val.value} `;
    };
    AccountDetailModalComponent.prototype.typeInTextarea = function (newText) {
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
    // Send Email/Sms for Accounts
    AccountDetailModalComponent.prototype.send = function () {
        var _this = this;
        var request = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: [this.accInfo.uniqueName],
            },
            params: {
                from: this.from,
                to: this.to,
                groupUniqueName: this.accInfo.parentGroups[this.accInfo.parentGroups.length - 1].uniqueName
            }
        };
        if (this.messageBody.btn.set === 'Send Email') {
            return this._companyServices.sendEmail(request)
                .subscribe(function (r) {
                r.status === 'success' ? _this._toaster.successToast(r.body) : _this._toaster.errorToast(r.message);
            });
        }
        else if (this.messageBody.btn.set === 'Send Sms') {
            var temp = request;
            delete temp.data['subject'];
            return this._companyServices.sendSms(temp)
                .subscribe(function (r) {
                r.status === 'success' ? _this._toaster.successToast(r.body) : _this._toaster.errorToast(r.message);
            });
        }
        this.mailModal.hide();
    };
    AccountDetailModalComponent.prototype.goToRoute = function (part, additionalParams) {
        if (additionalParams === void 0) { additionalParams = ''; }
        var url = location.href + ("?returnUrl=" + part + "/" + this.accountUniqueName);
        if (additionalParams) {
            url = "" + url + additionalParams;
        }
        if (false) { var ipcRenderer; }
        else {
            window.open(url);
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountDetailModalComponent.prototype, "isModalOpen", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AccountDetailModalComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AccountDetailModalComponent.prototype, "from", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AccountDetailModalComponent.prototype, "to", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mailModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], AccountDetailModalComponent.prototype, "mailModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('messageBox'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AccountDetailModalComponent.prototype, "messageBox", void 0);
    AccountDetailModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: '[account-detail-modal-component]',
            template: __webpack_require__(/*! ./account-detail-modal.component.html */ "./src/app/theme/account-detail-modal/account-detail-modal.component.html"),
            styles: [__webpack_require__(/*! ./account-detail-modal.component.scss */ "./src/app/theme/account-detail-modal/account-detail-modal.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], _services_companyService_service__WEBPACK_IMPORTED_MODULE_6__["CompanyService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"], _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_8__["GroupWithAccountsAction"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"]])
    ], AccountDetailModalComponent);
    return AccountDetailModalComponent;
}());



/***/ }),

/***/ "./src/app/theme/account-detail-modal/account-detail-modal.module.ts":
/*!***************************************************************************!*\
  !*** ./src/app/theme/account-detail-modal/account-detail-modal.module.ts ***!
  \***************************************************************************/
/*! exports provided: AccountDetailModalModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountDetailModalModule", function() { return AccountDetailModalModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _account_detail_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./account-detail-modal.component */ "./src/app/theme/account-detail-modal/account-detail-modal.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");






var AccountDetailModalModule = /** @class */ (function () {
    function AccountDetailModalModule() {
    }
    AccountDetailModalModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalModule"]],
            exports: [_account_detail_modal_component__WEBPACK_IMPORTED_MODULE_2__["AccountDetailModalComponent"]],
            declarations: [_account_detail_modal_component__WEBPACK_IMPORTED_MODULE_2__["AccountDetailModalComponent"]],
            providers: [],
        })
    ], AccountDetailModalModule);
    return AccountDetailModalModule;
}());



/***/ })

}]);