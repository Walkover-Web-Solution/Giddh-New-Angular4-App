(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ "./src/app/theme/quick-account-component/quickAccount.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/theme/quick-account-component/quickAccount.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form novalidate name=\"newAccountModelForm\" [formGroup]=\"newAccountForm\" class=\"newAccounform\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title\">Create New Account</h3>\n  </div>\n  <div class=\"modal-body\">\n    <div class=\"clearfix\" *ngIf=\"!comingFromDiscountList\">\n      <label>Select Group</label>\n      <sh-select #groupDDList [options]=\"flattenGroupsArray\" [isFilterEnabled]=\"true\" formControlName=\"groupUniqueName\"\n                 (selected)=\"checkSelectedGroup($event)\" [placeholder]=\"'Select Group'\"></sh-select>\n    </div>\n    <div class=\"clearfix\" *ngIf=\"comingFromDiscountList\">\n      <label>Selected Group: Discount</label>\n    </div>\n    <div class=\"clearfix mrT1\">\n      <label>Account Name</label>\n      <input class=\"form-control\" required name=\"account\" (blur)=\"generateUniqueName();\" type=\"text\"\n             formControlName=\"name\" placeholder=\"Enter Account Name\">\n    </div>\n    <div class=\"clearfix mrT1 pdR2 pos-rel\">\n      <label>Account Unique Name</label>\n      <input class=\"form-control\" required name=\"accUnqName\" type=\"text\" formControlName=\"uniqueName\"\n             [control]=\"newAccountForm.get('uniqueName')\"\n             textCaseChangeDirective placeholder=\"Enter Account Unique Name\">\n      <i class=\"glyphicon glyphicon-random pos-abs\" style=\"right:0px;top:30px;color:green\"\n         [tooltip]=\"'Auto Generate UniqueName'\"\n         [placement]=\"'top'\" container=\"body\" (click)=\"generateUniqueName()\"></i>\n    </div>\n    <section *ngIf=\"showGstBox\" formArrayName=\"addresses\">\n      <div *ngFor=\"let gst of newAccountForm.get('addresses')['controls']; let i = index;\" [formGroupName]=\"i\">\n        <div class=\"row mrT1\">\n          <div class=\"col-xs-12\">\n            <label>GSTIN</label>\n            <input type=\"text\" name=\"gstNumber\" formControlName=\"gstNumber\" (keyup)=\"getStateCode(gst, states)\"\n                   maxlength=\"15\" class=\"form-control\">\n          </div>\n        </div>\n        <div class=\"row mrT1\">\n          <div class=\"col-xs-12\">\n            <label>State code</label>\n            <sh-select #states [isFilterEnabled]=\"true\" [options]=\"statesSource$ | async\" [placeholder]=\"'Select State'\"\n                       formControlName=\"stateCode\"></sh-select>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <div class=\"modal-footer\">\n    <button class=\"btn btn-success\" [ladda]=\"isQuickAccountInProcess$ | async\" (click)=\"submit()\"\n            [disabled]=\"newAccountForm.invalid\">Create\n    </button>\n    <button class=\"btn btn-default\" (click)=\"closeQuickAccountModal.emit(true)\">Cancel</button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/theme/quick-account-component/quickAccount.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/theme/quick-account-component/quickAccount.component.ts ***!
  \*************************************************************************/
/*! exports provided: QuickAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickAccountComponent", function() { return QuickAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var apps_web_giddh_src_app_services_group_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! apps/web-giddh/src/app/services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var apps_web_giddh_src_app_services_companyService_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! apps/web-giddh/src/app/services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var apps_web_giddh_src_app_actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var apps_web_giddh_src_app_actions_general_general_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! apps/web-giddh/src/app/services/toaster.service */ "./src/app/services/toaster.service.ts");












var QuickAccountComponent = /** @class */ (function () {
    function QuickAccountComponent(_fb, _groupService, _companyService, _toaster, ledgerAction, store, _generalActions) {
        var _this = this;
        this._fb = _fb;
        this._groupService = _groupService;
        this._companyService = _companyService;
        this._toaster = _toaster;
        this.ledgerAction = ledgerAction;
        this.store = store;
        this._generalActions = _generalActions;
        this.needAutoFocus = false;
        this.closeQuickAccountModal = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
        this.flattenGroupsArray = [];
        this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        this.showGstBox = false;
        this.comingFromDiscountList = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.isQuickAccountInProcess$ = this.store.select(function (p) { return p.ledger.isQuickAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isQuickAccountCreatedSuccessfully$ = this.store.select(function (p) { return p.ledger.isQuickAccountCreatedSuccessfully; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.groupsArrayStream$ = this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.statesStream$ = this.store.select(function (p) { return p.general.states; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').subscribe(function (result) {
            if (result.status === 'success') {
                var groupsListArray_1 = [];
                result.body.results = _this.removeFixedGroupsFromArr(result.body.results);
                result.body.results.forEach(function (a) {
                    groupsListArray_1.push({ label: a.groupName, value: a.groupUniqueName });
                });
                _this.flattenGroupsArray = groupsListArray_1;
                // coming from discount list set hardcoded discount list
                if (_this.comingFromDiscountList) {
                    // "uniqueName":"discount"
                    _this.newAccountForm.get('groupUniqueName').patchValue('discount');
                }
            }
        });
        this.statesStream$.subscribe(function (data) {
            var states = [];
            if (data) {
                data.map(function (d) {
                    states.push({ label: d.code + " - " + d.name, value: d.code });
                });
            }
            _this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(states);
        }, function (err) {
            // console.log(err);
        });
    }
    QuickAccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.newAccountForm = this._fb.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].maxLength(100)])],
            uniqueName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            groupUniqueName: [''],
            openingBalanceDate: [],
            addresses: this._fb.array([
                this._fb.group({
                    gstNumber: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].maxLength(15)])],
                    stateCode: [{ value: '', disabled: false }]
                })
            ]),
        });
        this.isQuickAccountCreatedSuccessfully$.subscribe(function (a) {
            if (a) {
                _this.closeQuickAccountModal.emit(true);
                _this.store.dispatch(_this._generalActions.getFlattenAccount());
                _this.store.dispatch(_this.ledgerAction.resetQuickAccountModal());
            }
        });
    };
    QuickAccountComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.needAutoFocus) {
            setTimeout(function () {
                _this.groupDDList.inputFilter.nativeElement.click();
            }, 500);
        }
    };
    QuickAccountComponent.prototype.generateUniqueName = function () {
        var control = this.newAccountForm.get('name');
        var uniqueControl = this.newAccountForm.get('uniqueName');
        var unqName = control.value;
        unqName = unqName.replace(/ |,|\//g, '');
        unqName = unqName.toLowerCase();
        if (unqName.length >= 1) {
            var unq = '';
            var text = '';
            var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var i = 0;
            while (i < 3) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
                i++;
            }
            unq = unqName + text;
            uniqueControl.patchValue(unq);
        }
        else {
            uniqueControl.patchValue('');
        }
    };
    QuickAccountComponent.prototype.getStateCode = function (gstForm, statesEle) {
        var _this = this;
        var gstVal = gstForm.get('gstNumber').value;
        if (gstVal.length >= 2) {
            this.statesSource$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (state) {
                var s = state.find(function (st) { return st.value === gstVal.substr(0, 2); });
                statesEle.disabled = true;
                if (s) {
                    gstForm.get('stateCode').patchValue(s.value);
                }
                else {
                    gstForm.get('stateCode').patchValue(null);
                    _this._toaster.clearAllToaster();
                    _this._toaster.warningToast('Invalid GSTIN.');
                }
            });
        }
        else {
            statesEle.disabled = false;
            gstForm.get('stateCode').patchValue(null);
        }
    };
    QuickAccountComponent.prototype.checkSelectedGroup = function (options) {
        var _this = this;
        this.groupsArrayStream$.subscribe(function (data) {
            if (data.length) {
                var accountCategory = _this.flattenGroup(data, options.value, null);
                _this.showGstBox = accountCategory === 'assets' || accountCategory === 'liabilities';
            }
        });
    };
    QuickAccountComponent.prototype.flattenGroup = function (rawList, groupUniqueName, category) {
        for (var _i = 0, rawList_1 = rawList; _i < rawList_1.length; _i++) {
            var raw = rawList_1[_i];
            if (raw.uniqueName === groupUniqueName) {
                return raw.category;
            }
            if (raw.groups) {
                var AccountOfCategory = this.flattenGroup(raw.groups, groupUniqueName, raw);
                if (AccountOfCategory) {
                    return AccountOfCategory;
                }
            }
        }
    };
    QuickAccountComponent.prototype.removeFixedGroupsFromArr = function (data) {
        var fixedArr = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost',
            'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
        return data.filter(function (da) {
            return !(fixedArr.indexOf(da.groupUniqueName) > -1);
        });
    };
    QuickAccountComponent.prototype.submit = function () {
        var createAccountRequest = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["cloneDeep"](this.newAccountForm.value);
        if (!this.showGstBox) {
            delete createAccountRequest.addresses;
        }
        this.store.dispatch(this.ledgerAction.createQuickAccountV2(this.newAccountForm.value.groupUniqueName, createAccountRequest));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], QuickAccountComponent.prototype, "needAutoFocus", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"])
    ], QuickAccountComponent.prototype, "closeQuickAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('groupDDList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], QuickAccountComponent.prototype, "groupDDList", void 0);
    QuickAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'quickAccount',
            template: __webpack_require__(/*! ./quickAccount.component.html */ "./src/app/theme/quick-account-component/quickAccount.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"], apps_web_giddh_src_app_services_group_service__WEBPACK_IMPORTED_MODULE_6__["GroupService"],
            apps_web_giddh_src_app_services_companyService_service__WEBPACK_IMPORTED_MODULE_7__["CompanyService"], apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_11__["ToasterService"],
            apps_web_giddh_src_app_actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__["LedgerActions"], _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"], apps_web_giddh_src_app_actions_general_general_actions__WEBPACK_IMPORTED_MODULE_10__["GeneralActions"]])
    ], QuickAccountComponent);
    return QuickAccountComponent;
}());



/***/ }),

/***/ "./src/app/theme/quick-account-component/quickAccount.module.ts":
/*!**********************************************************************!*\
  !*** ./src/app/theme/quick-account-component/quickAccount.module.ts ***!
  \**********************************************************************/
/*! exports provided: QuickAccountModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickAccountModule", function() { return QuickAccountModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var apps_web_giddh_src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _quickAccount_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./quickAccount.component */ "./src/app/theme/quick-account-component/quickAccount.component.ts");
/* harmony import */ var apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");










var QuickAccountModule = /** @class */ (function () {
    function QuickAccountModule() {
    }
    QuickAccountModule_1 = QuickAccountModule;
    QuickAccountModule.forRoot = function () {
        return {
            ngModule: QuickAccountModule_1,
            providers: []
        };
    };
    var QuickAccountModule_1;
    QuickAccountModule = QuickAccountModule_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_4__["ClickOutsideModule"],
                apps_web_giddh_src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_5__["SharedModule"],
                apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_7__["ShSelectModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["TooltipModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_9__["LaddaModule"]
            ],
            declarations: [_quickAccount_component__WEBPACK_IMPORTED_MODULE_6__["QuickAccountComponent"]],
            entryComponents: [_quickAccount_component__WEBPACK_IMPORTED_MODULE_6__["QuickAccountComponent"]]
        })
    ], QuickAccountModule);
    return QuickAccountModule;
}());



/***/ })

}]);