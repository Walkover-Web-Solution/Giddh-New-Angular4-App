(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[21],{

/***/ "./src/app/accounting/accounting-routing.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/accounting/accounting-routing.module.ts ***!
  \*********************************************************/
/*! exports provided: AccountingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingRoutingModule", function() { return AccountingRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _accounting_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./accounting.component */ "./src/app/accounting/accounting.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");





var AccountingRoutingModule = /** @class */ (function () {
    function AccountingRoutingModule() {
    }
    AccountingRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '', component: _accounting_component__WEBPACK_IMPORTED_MODULE_1__["AccountingComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]],
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]]
        })
    ], AccountingRoutingModule);
    return AccountingRoutingModule;
}());



/***/ }),

/***/ "./src/app/accounting/accounting.component.css":
/*!*****************************************************!*\
  !*** ./src/app/accounting/accounting.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host ::ng-deep .parent-Group {\n  padding-left: 0;\n}\n\n:host ::ng-deep .acntAccordion .mainLiAclist .title:before {\n  content: none;\n}\n\n:host ::ng-deep .accountli {\n  margin: 7px;\n  text-transform: capitalize;\n}\n\n:host ::ng-deep .accounts-side-bar {\n  box-shadow: none;\n  overflow: auto;\n  width: 100%;\n}\n\n.custom-input-group-addon {\n  min-width: 40px;\n  border-radius: 0;\n  padding: 0;\n  border: none;\n}\n\n.bg_wrap {\n  background: #f5f5f5;\n}\n\n.entry_table thead th {\n  font-weight: normal;\n  padding: 8px 6px;\n}\n\n.entry_table tbody tr td {\n  padding: 0;\n  border: 0;\n}\n\n.entry_table tbody tr td .form-control {\n  background: transparent !important;\n  border: 0;\n  border-radius: 0 !important;\n  height: 28px;\n  line-height: 28px;\n  padding: 0 6px !important;\n}\n\n.entry_table tbody tr td .form-control.focus:focus {\n  background: #ccc !important;\n}\n\n.activeRow {\n  background: #e5e5e5;\n}\n\n.confirmation_box {\n  background: white;\n  display: inline-block;\n  padding: 20px;\n  width: 230px;\n  position: absolute;\n  right: 280px;\n  z-index: 9;\n  min-height: 135px;\n  margin: 20px 0;\n}\n\n.total_box {\n  padding: 15px 0;\n  border-top: 1px solid;\n  border-bottom: 1px solid;\n  margin: 20px 0;\n  min-width: 250px;\n  font-size: 14px;\n}\n\n.total_box > span {\n  margin: 0 8px;\n  display: inline-block;\n  min-width: 120px;\n}\n\n.appearance_none {\n  background: #e5e5e5 !important;\n  border: 0 !important;\n  font-size: 16px;\n  color: #333333;\n}\n\n.account_listbar {\n  overflow-y: hidden;\n  height: 100vh;\n  width: 250px;\n  background: white;\n  position: absolute;\n  left: -250px;\n  z-index: 0;\n}\n\n.sidebar_menu {\n  min-height: 100vh;\n  background: #262626;\n  color: white;\n  float: right;\n  /* width: 250px; */\n  position: relative;\n}\n\n.menu_list {\n  padding: 15px 0;\n}\n\n.menu_list li {\n  list-style: none\n}\n\n.menu_list li a {\n  color: #fff;\n  padding: 4px 12px;\n  display: block;\n}\n\n.menu_list li a.isHidden {\n  color: #4d4d4d\n}\n\n.sidebar_list {\n  width: 300px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100vh;\n  padding: 0 !important;\n  border: 0;\n  z-index: 0;\n  border-left: 1px solid #d6d6d6;\n}\n\n.sidebar_list h3 {\n  background: #fff;\n}\n\n.label.isActive {\n  font-weight: normal;\n  background: #ddd;\n  color: #333 !important;\n  cursor: auto;\n}\n\ninput[name=\"entryDate\"] {\n  background: transparent !important;\n  border: 0;\n  padding: 0 !important;\n  color: #333;\n  height: auto;\n  width: 100px;\n  font-size: 16px\n}\n\ntextarea[name=\"narration\"] {\n  background: transparent !important;\n  border: 0;\n}\n\ninput[name=\"entryDate\"]:focus,\ntextarea[name=\"narration\"]:focus {\n  background: #e5e5e5 !important;\n}\n\n:host ::ng-deep .menu {\n  box-shadow: none !important;\n}\n\n:host ::ng-deep .item .list-item {\n  border: 0 !important;\n}\n\n:host ::ng-deep .menu {\n  border-left: 0 !important;\n}\n"

/***/ }),

/***/ "./src/app/accounting/accounting.component.html":
/*!******************************************************!*\
  !*** ./src/app/accounting/accounting.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<account-as-voucher [saveEntryOnCtrlA]=\"saveEntryInVoucher\" [openDatePicker]=\"openDatePicker\" [openCreateAccountPopup]=\"openCreateAccountPopupInVoucher\"\n                    [hidden]=\"gridType !== 'voucher'\"></account-as-voucher>\n\n<account-as-invoice [saveEntryOnCtrlA]=\"saveEntryInInvoice\" [openDatePicker]=\"openDatePicker\" [openCreateAccountPopup]=\"openCreateAccountPopupInInvoice\"\n                    [hidden]=\"gridType !== 'invoice'\"></account-as-invoice>\n\n<input type=\"hidden\" [attr.data-gridType]=\"gridType\" id=\"get-grid-type\">\n\n<div class=\"sidebar_menu col-xs-2 pd0\">\n  <accounting-sidebar></accounting-sidebar>\n</div>\n"

/***/ }),

/***/ "./src/app/accounting/accounting.component.ts":
/*!****************************************************!*\
  !*** ./src/app/accounting/accounting.component.ts ***!
  \****************************************************/
/*! exports provided: PAGE_SHORTCUT_MAPPING, PAGES_WITH_CHILD, AccountingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PAGE_SHORTCUT_MAPPING", function() { return PAGE_SHORTCUT_MAPPING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PAGES_WITH_CHILD", function() { return PAGES_WITH_CHILD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingComponent", function() { return AccountingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var apps_web_giddh_src_app_services_account_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apps/web-giddh/src/app/services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _tally_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tally-service */ "./src/app/accounting/tally-service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");










var PAGE_SHORTCUT_MAPPING = [
    {
        keyCode: 118,
        inputForFn: {
            page: 'Journal',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120,
        inputForFn: {
            page: 'Purchase',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119,
        inputForFn: {
            page: 'Sales',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120,
        altKey: true,
        inputForFn: {
            page: 'Debit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119,
        altKey: true,
        inputForFn: {
            page: 'Credit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 116,
        inputForFn: {
            page: 'Payment',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 117,
        inputForFn: {
            page: 'Receipt',
            uniqueName: 'null',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 115,
        inputForFn: {
            page: 'Contra',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    }
];
var PAGES_WITH_CHILD = ['Purchase', 'Sales', 'Credit note', 'Debit note'];
var AccountingComponent = /** @class */ (function () {
    function AccountingComponent(store, companyActions, 
    // private _router: Router,
    // private _keyboardService: KeyboardService,
    _tallyModuleService, _accountService, sidebarAction) {
        var _this = this;
        this.store = store;
        this.companyActions = companyActions;
        this._tallyModuleService = _tallyModuleService;
        this._accountService = _accountService;
        this.sidebarAction = sidebarAction;
        this.gridType = 'voucher';
        this.selectedPage = 'journal';
        this.flattenAccounts = [];
        this.openDatePicker = false;
        this.openCreateAccountPopupInVoucher = false;
        this.openCreateAccountPopupInInvoice = false;
        this.saveEntryInVoucher = false;
        this.saveEntryInInvoice = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__["ReplaySubject"](1);
        this._tallyModuleService.selectedPageInfo.subscribe(function (d) {
            if (d) {
                _this.gridType = d.gridType;
                _this.selectedPage = d.page;
            }
        });
    }
    AccountingComponent.prototype.beforeunloadHandler = function (event) {
        return (event.which || event.keyCode) !== 116;
    };
    AccountingComponent.prototype.handleKeyboardEvent = function (event) {
        var _this = this;
        if (event.ctrlKey && event.which === 65) { // Ctrl + A
            event.preventDefault();
            event.stopPropagation();
            if (this.gridType === 'voucher') {
                this.saveEntryInVoucher = true;
                this.saveEntryInInvoice = false;
            }
            else if (this.gridType === 'invoice') {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = true;
            }
            setTimeout(function () {
                _this.saveEntryInVoucher = false;
                _this.saveEntryInInvoice = false;
            }, 100);
        }
        else if (event.altKey && event.which === 86) { // Handling Alt + V and Alt + I
            var selectedPage = this._tallyModuleService.selectedPageInfo.value;
            if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage.uniqueName,
                    gridType: 'voucher'
                });
            }
            else {
                return;
            }
        }
        else if (event.altKey && event.which === 73) { // Alt + I
            var selectedPage = this._tallyModuleService.selectedPageInfo.value;
            if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage.uniqueName,
                    gridType: 'invoice'
                });
            }
            else {
                return;
            }
        }
        else if (event.altKey && event.which === 67) { // Alt + C
            if (this.gridType === 'voucher') {
                this.openCreateAccountPopupInVoucher = true;
                this.openCreateAccountPopupInInvoice = false;
            }
            else if (this.gridType === 'invoice') {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = true;
            }
            setTimeout(function () {
                _this.openCreateAccountPopupInVoucher = false;
                _this.openCreateAccountPopupInInvoice = false;
            }, 100);
        }
        else {
            var selectedPageIndx = PAGE_SHORTCUT_MAPPING.findIndex(function (page) {
                if (event.altKey) {
                    return page.keyCode === event.which && page.altKey;
                }
                else {
                    return page.keyCode === event.which;
                }
            });
            if (selectedPageIndx > -1) {
                this._tallyModuleService.setVoucher(PAGE_SHORTCUT_MAPPING[selectedPageIndx].inputForFn);
            }
            else if (event.which === 113) { // F2
                this.openDatePicker = !this.openDatePicker;
            }
        }
    };
    AccountingComponent.prototype.ngOnInit = function () {
        var _this = this;
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'accounting-voucher';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (a) {
            if (a && a !== '') {
                _this._accountService.GetFlattenAccounts('', '', '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(_this.destroyed$)).subscribe(function (data) {
                    if (data.status === 'success') {
                        _this.flattenAccounts = data.body.results;
                        _this._tallyModuleService.setFlattenAccounts(data.body.results);
                    }
                });
            }
        });
        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    };
    /**
     * setAccount to send accountObj to service
     */
    AccountingComponent.prototype.setAccount = function (accountObj) {
        //
    };
    /**
     * setStock to send stockObj to service
     */
    AccountingComponent.prototype.setStock = function (stockObj) {
        //
    };
    AccountingComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["HostListener"])('document:keydown', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [KeyboardEvent]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], AccountingComponent.prototype, "beforeunloadHandler", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["HostListener"])('document:keyup', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [KeyboardEvent]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], AccountingComponent.prototype, "handleKeyboardEvent", null);
    AccountingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            template: __webpack_require__(/*! ./accounting.component.html */ "./src/app/accounting/accounting.component.html"),
            styles: [__webpack_require__(/*! ./accounting.component.css */ "./src/app/accounting/accounting.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_5__["CompanyActions"],
            _tally_service__WEBPACK_IMPORTED_MODULE_3__["TallyModuleService"],
            apps_web_giddh_src_app_services_account_service__WEBPACK_IMPORTED_MODULE_2__["AccountService"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__["SidebarAction"]])
    ], AccountingComponent);
    return AccountingComponent;
}());



/***/ }),

/***/ "./src/app/accounting/accounting.module.ts":
/*!*************************************************!*\
  !*** ./src/app/accounting/accounting.module.ts ***!
  \*************************************************/
/*! exports provided: AccountingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingModule", function() { return AccountingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../inventory/inventory.module */ "./src/app/inventory/inventory.module.ts");
/* harmony import */ var _tally_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tally-service */ "./src/app/accounting/tally-service.ts");
/* harmony import */ var _voucher_grid_voucher_grid_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./voucher-grid/voucher-grid.component */ "./src/app/accounting/voucher-grid/voucher-grid.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _invoice_grid_invoice_grid_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./invoice-grid/invoice-grid.component */ "./src/app/accounting/invoice-grid/invoice-grid.component.ts");
/* harmony import */ var _accounting_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./accounting-routing.module */ "./src/app/accounting/accounting-routing.module.ts");
/* harmony import */ var _accounting_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./accounting.component */ "./src/app/accounting/accounting.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var apps_web_giddh_src_app_accounting_keyboard_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! apps/web-giddh/src/app/accounting/keyboard.service */ "./src/app/accounting/keyboard.service.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var apps_web_giddh_src_app_accounting_accouting_sidebar_accounting_sidebar_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/accounting/accouting-sidebar/accounting-sidebar.component */ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! angular2-text-mask */ "../../node_modules/angular2-text-mask/dist/angular2TextMask.js");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(angular2_text_mask__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../theme/ng-virtual-select/virtual-scroll */ "./src/app/theme/ng-virtual-select/virtual-scroll.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var _theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../theme/quick-account-component/quickAccount.module */ "./src/app/theme/quick-account-component/quickAccount.module.ts");
/* harmony import */ var _ng_virtual_list_virtual_list_module__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./ng-virtual-list/virtual-list.module */ "./src/app/accounting/ng-virtual-list/virtual-list.module.ts");
/* harmony import */ var _keyboard_directive__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./keyboard.directive */ "./src/app/accounting/keyboard.directive.ts");


























var AccountingModule = /** @class */ (function () {
    function AccountingModule() {
    }
    AccountingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["NgModule"])({
            declarations: [
                _accounting_component__WEBPACK_IMPORTED_MODULE_7__["AccountingComponent"],
                _invoice_grid_invoice_grid_component__WEBPACK_IMPORTED_MODULE_5__["AccountAsInvoiceComponent"],
                apps_web_giddh_src_app_accounting_accouting_sidebar_accounting_sidebar_component__WEBPACK_IMPORTED_MODULE_18__["AccountingSidebarComponent"],
                _voucher_grid_voucher_grid_component__WEBPACK_IMPORTED_MODULE_3__["AccountAsVoucherComponent"],
                _keyboard_directive__WEBPACK_IMPORTED_MODULE_25__["OnReturnDirective"]
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_11__["RouterModule"], apps_web_giddh_src_app_accounting_accouting_sidebar_accounting_sidebar_component__WEBPACK_IMPORTED_MODULE_18__["AccountingSidebarComponent"]],
            providers: [apps_web_giddh_src_app_accounting_keyboard_service__WEBPACK_IMPORTED_MODULE_16__["KeyboardService"], _tally_service__WEBPACK_IMPORTED_MODULE_2__["TallyModuleService"]],
            imports: [
                _accounting_routing_module__WEBPACK_IMPORTED_MODULE_6__["AccountingRoutingModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_11__["RouterModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_8__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ReactiveFormsModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_12__["DatepickerModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_12__["BsDatepickerModule"].forRoot(),
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_13__["ModalModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_14__["LaddaModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_15__["DecimalDigitsModule"],
                _ng_virtual_list_virtual_list_module__WEBPACK_IMPORTED_MODULE_24__["AVShSelectModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_17__["ClickOutsideModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["TooltipModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["TypeaheadModule"],
                angular2_text_mask__WEBPACK_IMPORTED_MODULE_20__["TextMaskModule"],
                _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_21__["VirtualScrollModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_22__["ElementViewChildModule"],
                _theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_23__["QuickAccountModule"].forRoot(),
                _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_1__["InventoryModule"]
            ],
        })
    ], AccountingModule);
    return AccountingModule;
}());



/***/ }),

/***/ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/accounting/accouting-sidebar/accounting-sidebar.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".account_listbar {\n  overflow-y: hidden;\n  height: 100vh;\n  width: 250px;\n  background: white;\n  position: absolute;\n  left: -250px;\n  z-index: 0;\n}\n\n.appearance_none {\n  background: none !important;\n  border: 0 !important;\n  font-size: 16px;\n  color: #333333;\n}\n\n.sidebar_menu {\n  min-height: 100vh;\n  background: #262626;\n  color: white;\n  float: right;\n  /* width: 250px; */\n  position: relative;\n}\n\n.menu_list {\n  padding: 0;\n}\n\n.menu_list li {\n  list-style: none\n}\n\n.menu_list li a {\n  color: #fff;\n  padding: 7px 12px;\n  display: block;\n  font-size: 14px;\n}\n\n.menu_list li a:hover {\n  background: #333;\n  color: #ff5f00;\n}\n\n.menu_list li a.isHidden {\n  color: #4d4d4d\n}\n\n.activechild {\n  background: #333333;\n  padding-left: 20px;\n}\n\n.activechild > span {\n  margin-right: 2px;\n}\n\n.activeparent {\n  color: #ff5f00 !important;\n}\n\n.dblUnderlined {\n  border-bottom: 3px double;\n}\n"

/***/ }),

/***/ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/accounting/accouting-sidebar/accounting-sidebar.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ul class=\"menu_list\">\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Contra', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Contra'}\">F4: Contra</a></li>\n\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Payment', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Payment'}\">F5: Payment</a></li>\n\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Receipt', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Receipt'}\">F6: Receipt</a></li>\n\n  <!-- \"isHidden\" class  if user is not able to access the module-->\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Journal', 'voucher', null)\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Journal'}\">F7: Journal</a></li>\n\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Sales', 'voucher', 'sales')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Sales'}\">F8: Sales</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Sales', 'voucher', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Sales'}\" [hidden]=\"selectedVoucher !== 'Sales'\"><span\n    class=\"dblUnderlined\">V:</span> As Voucher</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Sales', 'invoice', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Sales'}\" [hidden]=\"selectedVoucher !== 'Sales'\"><span\n    class=\"dblUnderlined\">I:</span> As Invoice</a></li>\n\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Credit note', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Credit note'}\"><span class=\"dblUnderlined\">F8:</span> Credit\n    Note</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Credit note', 'voucher', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Credit note'}\"\n         [hidden]=\"selectedVoucher !== 'Credit note'\"><span class=\"dblUnderlined\">V:</span> As Voucher</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Credit note', 'invoice', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Credit note'}\"\n         [hidden]=\"selectedVoucher !== 'Credit note'\"><span class=\"dblUnderlined\">I:</span> As Invoice</a></li>\n\n\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Purchase', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activeparent: selectedVoucher === 'Purchase'}\">F9: Purchase</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Purchase', 'voucher', 'purchases')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Purchase'}\" [hidden]=\"selectedVoucher !== 'Purchase'\"><span\n    class=\"dblUnderlined\">V:</span> As Voucher</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Purchase', 'invoice', 'purchases')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Purchase'}\" [hidden]=\"selectedVoucher !== 'Purchase'\"><span\n    class=\"dblUnderlined\">I:</span> As Invoice</a></li>\n\n  <li>\n    <a class=\"cp\" (click)=\"setSelectedPage('Debit note', 'voucher', 'purchases')\"\n       [ngClass]=\"{ activeparent: selectedVoucher === 'Debit note'}\"> <span class=\"dblUnderlined\">F9:</span> Debit Note</a>\n  </li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Debit note', 'voucher', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Debit note'}\" [hidden]=\"selectedVoucher !== 'Debit note'\"><span\n    class=\"dblUnderlined\">V:</span>As Voucher</a></li>\n  <li><a class=\"cp\" (click)=\"setSelectedPage('Debit note', 'invoice', 'sales')\"\n         [ngClass]=\"{ activechild: selectedVoucher === 'Debit note'}\" [hidden]=\"selectedVoucher !== 'Debit note'\"><span\n    class=\"dblUnderlined\">I:</span>As Invoice</a></li>\n\n\n</ul>\n"

/***/ }),

/***/ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/accounting/accouting-sidebar/accounting-sidebar.component.ts ***!
  \******************************************************************************/
/*! exports provided: AccountingSidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountingSidebarComponent", function() { return AccountingSidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _tally_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../tally-service */ "./src/app/accounting/tally-service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");






var AccountingSidebarComponent = /** @class */ (function () {
    function AccountingSidebarComponent(_tallyModuleService) {
        this._tallyModuleService = _tallyModuleService;
        this.flyAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"]();
        this.accountSearch = '';
        this.grpUniqueName = '';
        this.showAccountList = true;
        this.selectedVoucher = null;
        this.selectedGrid = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        //
    }
    AccountingSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._tallyModuleService.flattenAccounts.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(2)).subscribe(function (accounts) {
            if (accounts) {
                _this.setSelectedPage('Journal', 'voucher', 'purchases');
            }
        });
        this._tallyModuleService.selectedPageInfo.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) {
            if (p && q) {
                return (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_5__["isEqual"](p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe(function (pageInfo) {
            // && pageInfo.page !== this.selectedVoucher && pageInfo.gridType !== this.selectedGrid
            if (pageInfo) {
                _this.selectedVoucher = pageInfo.page;
                _this.selectedGrid = pageInfo.gridType;
            }
        });
    };
    AccountingSidebarComponent.prototype.ngOnChanges = function (s) {
        if (s.AccountListOpen) {
            this.showAccountList = !this.showAccountList;
        }
    };
    AccountingSidebarComponent.prototype.setSelectedPage = function (pageName, grid, grpUnqName) {
        this._tallyModuleService.setVoucher({
            page: pageName,
            uniqueName: grpUnqName,
            gridType: grid
        });
        this.selectedVoucher = pageName;
        this.selectedGrid = grid;
    };
    AccountingSidebarComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountingSidebarComponent.prototype, "AccountListOpen", void 0);
    AccountingSidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'accounting-sidebar',
            template: __webpack_require__(/*! ./accounting-sidebar.component.html */ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.html"),
            styles: [__webpack_require__(/*! ./accounting-sidebar.component.css */ "./src/app/accounting/accouting-sidebar/accounting-sidebar.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_tally_service__WEBPACK_IMPORTED_MODULE_2__["TallyModuleService"]])
    ], AccountingSidebarComponent);
    return AccountingSidebarComponent;
}());



/***/ }),

/***/ "./src/app/accounting/invoice-grid/invoice-grid.component.css":
/*!********************************************************************!*\
  !*** ./src/app/accounting/invoice-grid/invoice-grid.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mx-300 {\n  max-width: 300px;\n}\n\n.mx-350 {\n  max-width: 350px;\n}\n\n.appearance_none:focus {\n  background: #ccc !important;\n}\n\n.appearance_none {\n  background: #e5e5e5 !important;\n}\n\n.max-height28 {\n  max-height: 28px;\n}\n\n.form-inline .form-control {\n  font-size: 14px;\n  padding: 2px 7px !important;\n  text-transform: capitalize;\n  /* height: 24px;\n  line-height: 24px; */\n}\n\n.lh24 {\n  line-height: 24px;\n}\n\n.mx-300 label {\n  width: 130px;\n}\n\n.mx-350 label {\n  width: 160px;\n}\n"

/***/ }),

/***/ "./src/app/accounting/invoice-grid/invoice-grid.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/accounting/invoice-grid/invoice-grid.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-10\">\n  <div class=\"col-xs-12 bg_wrap\">\n    <div class=\"row\">\n      <div class=\"clearfix pdT2\">\n\n        <div class=\"d-flex\">\n          <span class=\"btn label isActive\">{{data.voucherType}}</span>\n\n          <input type=\"text\" [(ngModel)]=\"data.invoiceNumberAgainstVoucher\" [disabled]=\"!isCustomInvoice\"\n                 name=\"invoiceNumberAgainstVoucher\" placeholder=\"Invoice No\"\n                 class=\"text-center appearance_none\" style=\"width: 128px\"/>\n        </div>\n\n        <div class=\"pull-right text-right mrB1\">\n          <input type=\"text\" onReturn #dateField [textMask]=\"{mask: dateMask, guide: true}\" [(ngModel)]=\"entryDate\"\n                 name=\"entryDate\" (blur)=\"dateEntered();\" placeholder=\"DD-MM-YYYY\"\n                 class=\"form-control text-right invoice-date-field\"/> {{ displayDay\n          }}\n        </div>\n      </div>\n\n      <!-- invoice num -->\n      <div class=\"clearfix form-inline mrB\">\n        <div class=\"mx-350 form-group\" [hidden]=\"isSalesInvoiceSelected\">\n          <!-- decimalDigitsDirective -->\n          <label>{{ invoiceNoHeading }}:</label> <input type=\"text\" placeholder=\"Invoice no.\"\n                                                        [(ngModel)]=\"data.invoiceNumberAgainstVoucher\"\n                                                        class=\"form-control max-height28 appearance_none\"\n                                                        style=\"max-width:200px\" [disabled]=\"isSalesInvoiceSelected\"\n        />\n        </div>\n\n        <!-- key not available in request\n    <div class=\"mx-300 form-group\" (clickOutside)=\"showInvoiceDate=false;\">\n    <span>Date: </span>\n    <input type=\"text\" [ngModel]=\"moment(entryDate).format('DD-MM-YYYY')\" decimalDigitsDirective readonly (focus)=\"showInvoiceDate = true;\" class=\"form-control appearance_none max-height28\" />\n    <div *ngIf=\"showInvoiceDate\" style=\"position: absolute; z-index:10; min-height:290px;\">\n        <datepicker [(ngModel)]=\"entryDate\" (selectionDone)=\"setInvoiceDate($event)\" [showWeeks]=\"false\"></datepicker>\n    </div>\n</div> -->\n      </div>\n      <!-- /invoice num -->\n\n\n      <!-- party acc name -->\n      <div class=\"mx-350 clearfix form-inline mrB\">\n        <div class=\"form-group\">\n          <label>Party A/c Name: <sup>*</sup></label>\n          <!-- #creditor -->\n          <input #partyAccNameInputField name=\"party_name\" type=\"text\" placeholder=\"Party account\"\n                 class=\"form-control max-height28 appearance_none upper-fields\"\n                 (input)=\"onPartyAccFocusInput($event);selectedField='account';focusedField = 'partyAcc';\"\n                 (keyup)=\"searchAccount($event?.target?.value)\" (keydown)=\"detectKey($event)\"\n                 [(ngModel)]=\"creditorAcc.name\"\n                 (focus)=\"onPartyAccFocus($event);selectedField='account';focusedField = 'partyAcc';\"\n                 (blur)=\"onPartyAccBlur();selectedField=null;focusedField = null;filterByText = ''\"\n                 style=\"max-width:200px;\"/>\n        </div>\n        <!-- [hidden]=\"!isPurchaseInvoiceSelected\" -->\n        <div class=\"form-group\" style=\"margin-top: 5px;\" *ngIf=\"isPurchaseInvoiceSelected\">\n          <label>Ledger name:<sup>*</sup></label>\n          <input name=\"ledger_name\" type=\"text\"  placeholder=\"Ledger name\"\n                 class=\"form-control max-height28 appearance_none upper-fields\" style=\"max-width:200px\"\n                 (input)=\"onPartyAccFocusInput($event, 'purchases');selectedField='account';focusedField = 'ledgerName';\"\n                 (keyup)=\"searchAccount($event?.target?.value)\" (keydown)=\"detectKey($event)\"\n                 [(ngModel)]=\"debtorAcc.name\"\n                 (focus)=\"onPartyAccFocus($event,'purchases');selectedField='account';focusedField = 'ledgerName';\"\n                 (blur)=\"onPartyAccBlur();selectedField=null;focusedField = null;filterByText = ''\"/>\n        </div>\n      </div>\n      <!-- /party acc name -->\n\n      <!-- operating cost acc only -->\n      <!-- No need for purchase ledger, as discussed with alok\n    <div class=\"mx-300 clearfix form-inline mrB\">\n    <div class=\"form-group\">\n        <label>Purchase Ledger:<sup>*</sup></label> <input type=\"text\" #debtor placeholder=\"Purchase account\" (focus)=\"accountType = 'debitor'\" [(ngModel)]=\"debtorAcc.name\" (focus)=\"getFlattenGrpAccounts('purchases', true)\" (blur)=\"showAccountList=false;selectedInput=debtor\"\n            class=\"form-control max-height28 appearance_none\" style=\"max-width:200px\" />\n    </div>\n</div> -->\n      <!-- /operating cost acc only -->\n\n\n      <!--  purchase as INVOICE -->\n      <div class=\"clearfix mrT1\" [style.min-height.vh]=\"61\">\n        <div class=\"table-responsive bdrT\">\n          <table class=\"table entry_table\">\n            <thead>\n            <tr>\n              <th style=\"width:70%;\">Name of Item</th>\n              <th class=\"text-right\">Quantity</th>\n              <th class=\"text-right\">Rate</th>\n              <th class=\"text-left\">Per</th>\n              <th class=\"text-right\">Amount</th>\n            </tr>\n            </thead>\n            <br/>\n            <!-- stock entry  -->\n            <tbody (clickOutside)=\"hideListItems()\">\n            <ng-container *ngFor=\"let transaction of stocksTransaction;let i=index;let l=last\">\n              <ng-container>\n                <tr\n                  [ngClass]=\"{'activeRow': (isSelectedRow && selectedRowIdx === i) || (!selectedRowIdx && !isSelectedRow && i == 0)}\">\n                  <!-- (blur)=\"onStockItemBlur($event, qty);\" showStockList.next(false)\" -->\n                  <td><input onReturn id=\"first_element_{{i}}_{{i}}\" type=\"text\"\n                             class=\"form-control select-stock-in-invoice\" [(ngModel)]=\"transaction.inventory.stock.name\"\n                             (ngModelChange)=\"searchStock($event);changeStock(i, transaction?.inventory?.stock?.name)\"\n                             [ngClass]=\"{'focus': isSelectedRow && selectedRowIdx === i}\"\n                             (focus)=\"onPartyAccBlur();onStockFocus($event, i)\"\n                             (blur)=\"onStockItemBlur($event, qty);filterByText = ''\" (keydown)=\"detectKey($event)\"/>\n                  </td>\n                  <td>\n                    <input onReturn type=\"text\" class=\"form-control text-right\" #qty\n                           [(ngModel)]=\"transaction.inventory.quantity\" (ngModelChange)=\"changeQuantity(i, $event)\"\n                           (focus)=\"selectRow(true,i, null); hideListItems();\"\n                           [ngClass]=\"{'focus': isSelectedRow && selectedRowIdx === i}\"\n                           decimalDigitsDirective [DecimalPlaces]=\"2\" [disabled]=\"!transaction.inventory.stock.name\"/>\n                  </td>\n                  <td>\n                    <input onReturn type=\"text\" class=\"form-control text-right\"\n                           [(ngModel)]=\"transaction.inventory.unit.rate\" (ngModelChange)=\"changePrice(i,$event)\"\n                           (focus)=\"selectRow(true,i,null)\" [ngClass]=\"{'focus': isSelectedRow && selectedRowIdx === i}\"\n                           decimalDigitsDirective\n                           [DecimalPlaces]=\"2\" [disabled]=\"!transaction.inventory.stock.name\"/>\n                  </td>\n                  <td>\n                    <input type=\"text\" class=\"form-control text-left\"\n                           [(ngModel)]=\"transaction.inventory.unit.stockUnitCode\" [readonly]=\"true\"\n                           (focus)=\"selectRow(true,i)\" [disabled]=\"!transaction.inventory.stock.name\"/>\n                  </td>\n                  <td>\n                    <input onReturn type=\"text\" class=\"form-control text-right\" #toAmountField id=\"stock_{{i}}\"\n                           [(ngModel)]=\"transaction.inventory.amount\" (ngModelChange)=\"amountChanged(i)\"\n                           (focus)=\"selectRow(true,i);addNewStock(transaction.inventory.amount,transaction, i)\"\n                           (keydown.Tab)=\"addNewStock(transaction.inventory.amount,transaction, i)\"\n                           [ngClass]=\"{'focus': isSelectedRow && selectedRowIdx === i}\" decimalDigitsDirective\n                           [DecimalPlaces]=\"2\" [disabled]=\"!transaction.inventory.stock.name\"\n                           (blur)=\"checkIfEnteredAmountIsZero(transaction.inventory.amount, i, 'stock')\"/>\n                  </td>\n                </tr>\n              </ng-container>\n            </ng-container>\n            <tr *ngIf=\"stockTotal\">\n              <td colspan=\"4\"></td>\n              <td class>\n                <input type=\"text\" [value]=\"stockTotal\" readonly disabled class=\"form-control text-right\"/>\n                <div class=\"bdrB\"></div>\n              </td>\n            </tr>\n            <br/>\n            <!-- accounts entry -->\n            <!--  -->\n            <ng-container *ngFor=\"let transaction of accountsTransaction;let i=index;let l=last\">\n              <tr [ngClass]=\"{'activeRow': isSelectedRow && selectedAccIdx === i}\">\n                <td colspan=\"2\"><input data-accountlistid=\"i\" onReturn type=\"text\"\n                                       class=\"form-control invoice-account-field\" #particular\n                                       [(ngModel)]=\"transaction.selectedAccount.account\"\n                                       (ngModelChange)=\"searchAccount($event);\"\n                                       (focus)=\"selectedAccIdx=i; onAccountFocus($event, i)\"\n                                       [ngClass]=\"{'focus': isSelectedRow && selectedAccIdx === i}\"\n                                       (keydown)=\"detectKey($event, i === 0)\" (blur)=\"onAccountBlur(particular)\"/></td>\n                <td>\n                  <input onReturn type=\"text\" class=\"form-control text-right\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                         [(ngModel)]=\"transaction.rate\" (ngModelChange)=\"calculateRate(i, transaction?.rate)\"\n                         (focus)=\"selectedAccIdx=i; hideListItems()\"\n                         [ngClass]=\"{'focus': isSelectedRow && selectedAccIdx === i}\"\n                         [disabled]=\"!transaction.selectedAccount.account\"/>\n                </td>\n                <td><input onReturn type=\"text\" *ngIf=\"transaction.rate\" class=\"form-control\" [value]=\"'%'\" disabled\n                           readonly/></td>\n                <td>\n                  <!-- (change)=\"changeTotal(i, transaction.amount)\" -->\n                  <input type=\"text\" id=\"account_{{i}}\" class=\"form-control text-right\" decimalDigitsDirective\n                         [DecimalPlaces]=\"2\" [(ngModel)]=\"transaction.amount\"\n                         (keyup.Enter)=\"selectedAccIdx=i;addNewAccount(transaction.amount, l)\"\n                         [ngClass]=\"{'focus': isSelectedRow && selectedAccIdx === i}\"\n                         [disabled]=\"!transaction.selectedAccount.account\"\n                         (blur)=\"checkIfEnteredAmountIsZero(transaction.amount, i, 'account')\" onReturn/>\n                </td>\n              </tr>\n            </ng-container>\n            </tbody>\n          </table>\n        </div>\n      </div>\n      <!--  purchase as INVOICE -->\n      <div class=\"clearfix\">\n        <div class=\"col-xs-4\">\n          <div class=\"form-group\">\n            <label>Narration:</label>\n            <textarea #narrationBox onReturn id=\"invoice-narration\" class=\"form-control appearance_none\"\n                      name=\"narration\" (keyup.enter)=\"openConfirmBox(submitButton)\"\n                      (keydown.tab)=\"openConfirmBox(submitButton)\" [(ngModel)]=\"data.description\" resize=\"false\"\n                      rows=\"6\"></textarea>\n          </div>\n        </div>\n\n        <div [hidden]=\"!showConfirmationBox\" class=\"confirmation_box bdr text-center pd2\">\n          <div class=\"\">\n            <h1>Accept?</h1>\n            <div class=\"pdT2\">\n              <button class=\"btn btn-primary\" #submitButton (keyup)=\"keyUpOnSubmitButton($event)\"\n                      (click)=\"saveEntry();\">Yes\n              </button>\n              <button class=\"btn btn-default\" #resetButton (keyup)=\"keyUpOnResetButton($event)\">No</button>\n              <br/>\n              <button class=\"btn btn-link mrT1\" (click)=\"refreshEntry();\">Reset</button>\n            </div>\n          </div>\n        </div>\n        <div class=\"total_box text-right pull-right\">\n          <span><strong>{{ stockTotal + accountsTotal | number: '1.2-2' }}</strong></span>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"sidebar_list form-control\" [hidden]=\"!showLedgerAccountList\">\n    <h3 class=\"pd1 bdrB primary_clr\" *ngIf=\"selectedField === 'account'\">List of Ledger Accounts</h3>\n    <h3 class=\"pd1 bdrB primary_clr\" *ngIf=\"selectedField === 'stock'\">List of Stock Items</h3>\n    <!-- (noToggleClick)=\"toggleSelected($event)\" (noResultClicked)=\"noResultsClicked.emit(); hide()\" [noResultLinkEnabled]=\"notFoundLink\" [notFoundMsg]=\"notFoundMsg\" [notFoundLinkText]=\"notFoundLinkText\" [ItemHeight]=\"ItemHeight\" [NoFoundMsgHeight]=\"NoFoundMsgHeight\" [NoFoundLinkHeight]=\"NoFoundLinkHeight\" [dropdownMinHeight]=\"dropdownMinHeight\"-->\n    <accounting-virtual-list [keydownUpInput]=\"keyUpDownEvent\" [filterText]=\"filterByText\" [options]=\"inputForList\"\n                             [showList]=\"showLedgerAccountList\" [isFilterEnabled]=\"true\"\n                             (selected)=\"onItemSelected($event)\" [(ngModel)]=\"currentSelectedValue\"\n                             [placeholder]=\"'Select Option'\"\n                             [notFoundLink]=\"true\" (noResultsClicked)=\"showQuickAccountModal()\" [multiple]=\"false\"\n                             [ItemHeight]=\"33\"></accounting-virtual-list>\n  </div>\n\n</div>\n\n<!--quick account popup -->\n<div bsModal #quickAccountModal=\"bs-modal\" [config]=\"{ backdrop: false }\" class=\"modal\" role=\"dialog\">\n  <div class=\"modal-dialog modal-sm\" style=\"width: 298px\">\n    <div class=\"modal-content\">\n      <div element-view-container-ref #quickAccountComponent=\"elementviewcontainerref\"></div>\n    </div>\n  </div>\n</div>\n\n<div class=\"aside-overlay\" (click)=\"closeCreateStock($event)\" *ngIf=\"asideMenuStateForProductService === 'in'\"></div>\n<aside-inventory-stock-group [autoFocus]=\"autoFocusStockGroupField\" (closeAsideEvent)=\"closeCreateStock()\"\n                             [class]=\"asideMenuStateForProductService\"\n                             [@slideInOut]=\"asideMenuStateForProductService\"></aside-inventory-stock-group>\n"

/***/ }),

/***/ "./src/app/accounting/invoice-grid/invoice-grid.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/accounting/invoice-grid/invoice-grid.component.ts ***!
  \*******************************************************************/
/*! exports provided: AccountAsInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountAsInvoiceComponent", function() { return AccountAsInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _tally_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../tally-service */ "./src/app/accounting/tally-service.ts");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _theme_ng2_vs_for_ng2_vs_for__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../theme/ng2-vs-for/ng2-vs-for */ "./src/app/theme/ng2-vs-for/ng2-vs-for.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _keyboard_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../keyboard.service */ "./src/app/accounting/keyboard.service.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var apps_web_giddh_src_app_actions_fly_accounts_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/fly-accounts.actions */ "./src/app/actions/fly-accounts.actions.ts");
/* harmony import */ var apps_web_giddh_src_app_ledger_ledger_vm__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! apps/web-giddh/src/app/ledger/ledger.vm */ "./src/app/ledger/ledger.vm.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var apps_web_giddh_src_app_actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");
/* harmony import */ var _models_api_models_Account__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../models/api-models/Account */ "./src/app/models/api-models/Account.ts");
/* harmony import */ var _theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../theme/quick-account-component/quickAccount.component */ "./src/app/theme/quick-account-component/quickAccount.component.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");


























var TransactionsType = [
    { label: 'By', value: 'Debit' },
    { label: 'To', value: 'Credit' },
];
var CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];
var AccountAsInvoiceComponent = /** @class */ (function () {
    function AccountAsInvoiceComponent(_accountService, _ledgerActions, store, _keyboardService, flyAccountActions, _toaster, _router, _salesActions, _tallyModuleService, componentFactoryResolver, inventoryService, inventoryAction, invoiceActions) {
        var _this = this;
        this._accountService = _accountService;
        this._ledgerActions = _ledgerActions;
        this.store = store;
        this._keyboardService = _keyboardService;
        this.flyAccountActions = flyAccountActions;
        this._toaster = _toaster;
        this._router = _router;
        this._salesActions = _salesActions;
        this._tallyModuleService = _tallyModuleService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.inventoryService = inventoryService;
        this.inventoryAction = inventoryAction;
        this.invoiceActions = invoiceActions;
        this.showAccountList = new _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"]();
        this.showStockList = new _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"]();
        // public showAccountList: boolean = true;
        this.TransactionType = 'by';
        this.data = new apps_web_giddh_src_app_ledger_ledger_vm__WEBPACK_IMPORTED_MODULE_15__["BlankLedgerVM"]();
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.showConfirmationBox = false;
        this.moment = moment__WEBPACK_IMPORTED_MODULE_13__;
        this.accountSearch = '';
        this.navigateURL = CustomShortcode;
        this.showInvoiceDate = false;
        // public purchaseType: string = 'invoice';
        this.groupUniqueName = 'purchases';
        this.filterByGrp = false;
        this.accountsTransaction = [];
        this.stocksTransaction = [];
        this.creditorAcc = {};
        this.debtorAcc = {};
        this.stockTotal = null;
        this.accountsTotal = null;
        this.gridType = 'invoice';
        this.isPartyACFocused = false;
        this.displayDay = '';
        this.dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.filterByText = '';
        this.showLedgerAccountList = false;
        this.currentSelectedValue = '';
        this.invoiceNoHeading = 'Supplier Invoice No';
        this.isSalesInvoiceSelected = false; // need to hide `invoice no.` field in sales
        this.isPurchaseInvoiceSelected = false; // need to show `Ledger name` field in purchase
        this.asideMenuStateForProductService = 'out';
        this.autoFocusStockGroupField = false;
        this.isCustomInvoice = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__["ReplaySubject"](1);
        this.taxesToRemember = [];
        this.isAccountListFiltered = false;
        this.allFlattenAccounts = [];
        // this.data.transactions.inventory = [];
        this._keyboardService.keyInformation.subscribe(function (key) {
            _this.watchKeyboardEvent(key);
        });
        // this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));
        this._tallyModuleService.selectedPageInfo.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) {
            if (p && q) {
                return (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["isEqual"](p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe(function (d) {
            if (d && d.gridType === 'invoice') {
                _this.data.voucherType = d.page;
                _this.gridType = d.gridType;
                setTimeout(function () {
                    _this.dateField.nativeElement.focus();
                }, 50);
                if (d.page === 'Debit note' || d.page === 'Credit note') {
                    _this.invoiceNoHeading = 'Original invoice number';
                }
                else {
                    _this.invoiceNoHeading = 'Supplier Invoice No';
                }
                if (d.page === 'Sales') {
                    _this.isSalesInvoiceSelected = true;
                }
                else {
                    _this.isSalesInvoiceSelected = false;
                }
                if (d.page === 'Purchase') {
                    _this.isPurchaseInvoiceSelected = true;
                }
                else {
                    _this.isPurchaseInvoiceSelected = false;
                }
            }
            else if (d && _this.data.transactions) {
                _this.gridType = d.gridType;
                _this.data.transactions = _this.prepareDataForVoucher();
                _this._tallyModuleService.requestData.next(_this.data);
            }
        });
        this._tallyModuleService.requestData.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) {
            if (p && q) {
                return (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["isEqual"](p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe(function (data) {
            if (data) {
                _this.data = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](data);
                if (_this.gridType === 'invoice') {
                    _this.prepareDataForInvoice(_this.data);
                }
            }
        });
        this.companyTaxesList$ = this.store.select(function (p) { return p.company.taxes; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
    }
    AccountAsInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        // dispatch stocklist request
        this.store.dispatch(this.inventoryAction.GetStock());
        this.store.select(function (p) { return p.ledger.ledgerCreateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this._toaster.successToast('Entry created successfully', 'Success');
                _this.refreshEntry();
                _this.data.description = '';
                _this.dateField.nativeElement.focus();
                _this.taxesToRemember = [];
            }
        });
        this.entryDate = moment__WEBPACK_IMPORTED_MODULE_13__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        // this.refreshEntry();
        // this.data.transactions[this.data.transactions.length - 1].inventory.push(this.initInventory());
        this._tallyModuleService.filteredAccounts.subscribe(function (accounts) {
            if (accounts) {
                var accList_1 = [];
                accounts.forEach(function (acc) {
                    accList_1.push({ label: acc.name + " (" + acc.uniqueName + ")", value: acc.uniqueName, additional: acc });
                });
                _this.flattenAccounts = accList_1;
                _this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](_this.flattenAccounts);
            }
        });
        this.createStockSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (yesOrNo) {
            if (yesOrNo) {
                _this.closeCreateStock();
            }
        });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_10__["select"])(function (s) { return s.invoice.settings; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (result) {
            if (result && result.invoiceSettings) {
                _this.isCustomInvoice = result.invoiceSettings.useCustomInvoiceNumber;
            }
            else {
                _this.isCustomInvoice = false;
            }
        });
    };
    AccountAsInvoiceComponent.prototype.ngOnChanges = function (c) {
        if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
            this.dateField.nativeElement.focus();
        }
        if ('newSelectedAccount' in c && c.newSelectedAccount.currentValue !== c.newSelectedAccount.previousValue) {
            this.setAccount(c.newSelectedAccount.currentValue);
        }
        if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
            if (c.openCreateAccountPopup.currentValue) {
                if (this.focusedField) {
                    this.showQuickAccountModal();
                }
                else {
                    this.asideMenuStateForProductService = 'in';
                    this.autoFocusStockGroupField = true;
                }
            }
        }
        if ('saveEntryOnCtrlA' in c && c.saveEntryOnCtrlA.currentValue !== c.saveEntryOnCtrlA.previousValue) {
            if (c.saveEntryOnCtrlA.currentValue) {
                this.saveEntry();
            }
        }
    };
    /**
     * addNewRow() to push new object
     */
    AccountAsInvoiceComponent.prototype.addNewRow = function (type) {
        var entryObj = {
            amount: null,
            particular: '',
            applyApplicableTaxes: false,
            isInclusiveTax: false,
            type: 'by',
            taxes: [],
            total: null,
            discounts: [],
            inventory: {},
            selectedAccount: {
                name: '',
                uniqueName: ''
            }
        };
        if (type === 'stock') {
            var stockEntry = entryObj;
            stockEntry.inventory = this.initInventory();
            this.stocksTransaction.push(stockEntry);
        }
        else if (type === 'account') {
            this.accountsTransaction.push(entryObj);
        }
    };
    /**
     * initInventory
     */
    AccountAsInvoiceComponent.prototype.initInventory = function () {
        return {
            unit: {
                stockUnitCode: '',
                code: '',
                rate: null,
            },
            quantity: null,
            stock: {
                uniqueName: '',
                name: '',
            },
            amount: null
        };
    };
    /**
     * selectRow() on entryObj focus/blur
     */
    AccountAsInvoiceComponent.prototype.selectRow = function (type, stkIdx) {
        this.isSelectedRow = type;
        this.selectedRowIdx = stkIdx;
        this.showLedgerAccountList = false;
        // this.selectedAccIdx = accIdx;
    };
    /**
     * selectAccountRow() on entryObj focus/blur
     */
    AccountAsInvoiceComponent.prototype.selectAccountRow = function (type, idx) {
        // this.isSelectedRow = type;
        // this.selectedAccIdx = idx;
        // this.selectedRowIdx = null;
    };
    /**
     * getFlattenGrpAccounts
     */
    AccountAsInvoiceComponent.prototype.getFlattenGrpAccounts = function (groupUniqueName, filter) {
        // this.showAccountList.emit(true);
        this.groupUniqueName = groupUniqueName ? groupUniqueName : this.groupUniqueName;
        this.filterByGrp = filter;
        this.showStockList.emit(false);
    };
    /**
     * selectEntryType() to validate Type i.e BY/TO
     */
    AccountAsInvoiceComponent.prototype.selectEntryType = function (transactionObj, val, idx) {
        if (val.length === 2 && (val.toLowerCase() !== 'to' && val.toLowerCase() !== 'by')) {
            this._toaster.errorToast("Spell error, you can only use 'To/By'");
            transactionObj.type = 'DEBIT';
        }
        else {
            transactionObj.type = val;
        }
    };
    AccountAsInvoiceComponent.prototype.onStockItemBlur = function (ev, elem) {
        // this.selectedInput = elem;
        // this.showLedgerAccountList = false;
        // if (!this.stockSearch) {
        //   this.searchStock('');
        //   this.stockSearch = '';
        // }
    };
    AccountAsInvoiceComponent.prototype.onAccountFocus = function (ev, indx) {
        var _this = this;
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        // this.selectedField = 'account';
        this.selectedAccIdx = indx;
        // this.showLedgerAccountList = true;
        this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.flattenAccounts);
        this.selectedField = 'account';
        if (this.isAccountListFiltered) {
            this.refreshAccountListData();
        }
        // this.selectedParticular = elem;
        // this.selectRow(true, indx);
        // this.filterAccount(trxnType);
        setTimeout(function () {
            _this.showLedgerAccountList = true;
        }, 200);
    };
    AccountAsInvoiceComponent.prototype.onAccountBlur = function (ele) {
        this.selectedInput = ele;
        this.showLedgerAccountList = false;
        this.filterByText = '';
        // if (ev.target.value === 0) {
        //   ev.target.focus();
        //   ev.preventDefault();
        // }
    };
    /**
     * setAccount` in particular, on accountList click
     */
    AccountAsInvoiceComponent.prototype.setAccount = function (acc) {
        var _this = this;
        var idx = this.selectedAccIdx;
        if (acc) {
            if (this.accountType === 'creditor') {
                setTimeout(function () {
                    if (_this.focusedField === 'ledgerName') {
                        _this.debtorAcc = acc;
                    }
                    else if (_this.focusedField === 'partyAcc') {
                        _this.creditorAcc = acc;
                    }
                }, 10);
                return this.accountType = null;
            }
            else if (this.accountType === 'debitor') {
                this.debtorAcc = acc;
            }
            if (this.selectedAccIdx > -1) {
                var accModel = {
                    name: acc.name,
                    UniqueName: acc.uniqueName,
                    groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
                    account: acc.name
                };
                this.accountsTransaction[idx].particular = accModel.UniqueName;
                this.accountsTransaction[idx].selectedAccount = accModel;
                this.accountsTransaction[idx].stocks = acc.stocks;
            }
            setTimeout(function () {
                // this.selectedInput.focus();
                _this.showAccountList.emit(false);
            }, 50);
        }
        else {
            this.accountsTransaction.splice(idx, 1);
            if (!idx) {
                this.addNewRow('account');
            }
        }
    };
    /**
     * searchAccount in accountList
     */
    AccountAsInvoiceComponent.prototype.searchAccount = function (str) {
        this.filterByText = str;
    };
    /**
     * searchStock
     */
    AccountAsInvoiceComponent.prototype.searchStock = function (str) {
        // this.stockSearch = str;
        this.filterByText = str;
    };
    /**
     * addNewStock
     */
    AccountAsInvoiceComponent.prototype.addNewStock = function (amount, transactionObj, idx) {
        var lastIdx = this.stocksTransaction.length - 1;
        if (amount) {
            transactionObj.amount = Number(amount);
        }
        if (amount && !transactionObj.inventory.stock && !transactionObj.inventory.stock.name) {
            this._toaster.errorToast("Stock can't be blank");
            return;
        }
        if (idx === lastIdx) {
            this.addNewRow('stock');
        }
        //
    };
    /**
     * openConfirmBox() to save entry
     */
    AccountAsInvoiceComponent.prototype.openConfirmBox = function (submitBtnEle) {
        this.showLedgerAccountList = false;
        this.showStockList.emit(false);
        this.showConfirmationBox = true;
        if (this.data.description.length > 1) {
            this.data.description = this.data.description.replace(/(?:\r\n|\r|\n)/g, '');
            setTimeout(function () {
                submitBtnEle.focus();
            }, 100);
        }
    };
    /**
     * refreshEntry
     */
    AccountAsInvoiceComponent.prototype.refreshEntry = function () {
        this.stocksTransaction = [];
        this.accountsTransaction = [];
        this.showConfirmationBox = false;
        this.showAccountList.emit(false);
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.addNewRow('stock');
        this.addNewRow('account');
        this.data.entryDate = moment__WEBPACK_IMPORTED_MODULE_13__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        this.entryDate = moment__WEBPACK_IMPORTED_MODULE_13__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        this.creditorAcc = {};
        this.debtorAcc = {};
        this.stockTotal = null;
        this.accountsTotal = null;
        this.data.description = '';
        this.dateField.nativeElement.focus();
        this.data.invoiceNumberAgainstVoucher = null;
    };
    /**
     * after init
     */
    AccountAsInvoiceComponent.prototype.ngAfterViewInit = function () {
        //
    };
    /**
     * ngOnDestroy() on component destroy
     */
    AccountAsInvoiceComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * setInvoiceDate
     */
    AccountAsInvoiceComponent.prototype.setInvoiceDate = function (date) {
        this.showInvoiceDate = !this.showInvoiceDate;
    };
    /**
     * watchMenuEvent
     */
    AccountAsInvoiceComponent.prototype.watchKeyboardEvent = function (event) {
        if (event) {
            var navigateTo = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["find"](this.navigateURL, function (o) { return o.code === event.key; });
            if (navigateTo) {
                this._router.navigate(['accounting', navigateTo.route]);
            }
        }
    };
    /**
     * removeBlankTransaction
     */
    AccountAsInvoiceComponent.prototype.removeBlankTransaction = function (transactions) {
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](transactions, function (obj) {
            if (obj && !obj.particular && !obj.amount) {
                transactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["without"](transactions, obj);
            }
        });
        return transactions;
    };
    /**
     * validateTransaction
     */
    AccountAsInvoiceComponent.prototype.validateTransaction = function (transactions) {
        var transactionArr = this.removeBlankTransaction(transactions);
        return transactionArr;
    };
    /**
     * onSelectStock
     */
    AccountAsInvoiceComponent.prototype.onSelectStock = function (item) {
        var _this = this;
        if (item) {
            var idx = this.selectedRowIdx;
            var entryItem = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](item);
            this.prepareEntry(entryItem, idx);
            setTimeout(function () {
                // this.selectedInput.focus();
                _this.showStockList.emit(false);
            }, 50);
        }
        else {
            this.stocksTransaction.splice(this.selectedRowIdx);
            if (!this.selectedRowIdx) {
                this.addNewRow('stock');
            }
        }
    };
    /**
     * prepareEntry
     */
    AccountAsInvoiceComponent.prototype.prepareEntry = function (item, stkIdx) {
        var defaultUnit = {
            stockUnitCode: item.stockUnit.name,
            code: item.stockUnit.code,
            rate: 0
        };
        // if (item.accountStockDetails.unitRates.length) {
        // this.stocksTransaction[stkIdx].inventory.unit = item.accountStockDetails.unitRates[0];
        this.stocksTransaction[stkIdx].inventory.unit.rate = item.amount / item.openingQuantity;
        // this.stocksTransaction[stkIdx].inventory.unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
        this.stocksTransaction[stkIdx].inventory.unit.code = item.stockUnit.code;
        this.stocksTransaction[stkIdx].inventory.unit.stockUnitCode = item.stockUnit.name;
        // } else if (!item.accountStockDetails.unitRates.length) {
        //   this.stocksTransaction[stkIdx].inventory.unit = defaultUnit;
        // }
        // this.stocksTransaction[stkIdx].particular = item.accountStockDetails.accountUniqueName;
        this.stocksTransaction[stkIdx].inventory.stock = { name: item.name, uniqueName: item.uniqueName };
        // this.stocksTransaction[stkIdx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
        // this.stocksTransaction[stkIdx].selectedAccount.name = item.accountStockDetails.name;
    };
    /**
     * calculateAmount
     */
    AccountAsInvoiceComponent.prototype.changeQuantity = function (idx, val) {
        var i = this.selectedRowIdx;
        this.stocksTransaction[i].inventory.quantity = Number(val);
        this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        this.amountChanged(idx);
    };
    /**
     * changePrice
     */
    AccountAsInvoiceComponent.prototype.changePrice = function (idx, val) {
        var i = this.selectedRowIdx;
        this.stocksTransaction[i].inventory.unit.rate = Number(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](val));
        this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        this.amountChanged(idx);
    };
    /**
     * amountChanged
     */
    AccountAsInvoiceComponent.prototype.amountChanged = function (idx) {
        var i = this.selectedRowIdx;
        if (this.stocksTransaction[i] && this.stocksTransaction[idx].inventory.stock && this.stocksTransaction[i].inventory.quantity) {
            if (this.stocksTransaction[i].inventory.quantity) {
                this.stocksTransaction[i].inventory.unit.rate = Number((this.stocksTransaction[i].inventory.amount / this.stocksTransaction[i].inventory.quantity).toFixed(2));
            }
        }
        this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
        var stockTotal = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["sumBy"](this.stocksTransaction, function (o) { return Number(o.inventory.amount); });
        this.stockTotal = stockTotal;
    };
    AccountAsInvoiceComponent.prototype.calculateRate = function (idx, val) {
        if (val) {
            this.accountsTransaction[idx].amount = Number(this.stockTotal * val / 100);
        }
        this.calculateAmount();
    };
    AccountAsInvoiceComponent.prototype.changeTotal = function (idx, val) {
        if (val) {
            this.accountsTransaction[idx].rate = null;
        }
        this.calculateAmount();
    };
    /**
     * calculateAmount
     */
    AccountAsInvoiceComponent.prototype.calculateAmount = function () {
        var Total = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["sumBy"](this.accountsTransaction, function (o) { return Number(o.amount); });
        this.accountsTotal = Total;
    };
    /**
     * changeStock
     */
    AccountAsInvoiceComponent.prototype.changeStock = function (idx, val) {
        var i = this.selectedRowIdx;
        if (!val) {
            if (this.stocksTransaction[i].inventory && this.stocksTransaction[i].inventory.length) {
                this.stocksTransaction[i].inventory.splice(idx, 1);
            }
            // this.showStockList.emit(false);
            // if (!this.data.transactions.length) {
            //   this.addNewRow('stock');
            // }
            this.amountChanged(idx);
        }
    };
    /**
     * saveEntry
     */
    AccountAsInvoiceComponent.prototype.saveEntry = function () {
        var _this = this;
        if (!this.creditorAcc.uniqueName) {
            this._toaster.errorToast("Party A/c Name can't be blank.");
            return setTimeout(function () { return _this.partyAccNameInputField.nativeElement.focus(); }, 200);
        }
        var data = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.data);
        data.generateInvoice = data.invoiceNumberAgainstVoucher ? !!data.invoiceNumberAgainstVoucher.trim() : false;
        // let idx = 0;
        data.transactions = this.prepareDataForVoucher();
        data = this._tallyModuleService.prepareRequestForAPI(data);
        data.transactions = this.validateTransaction(data.transactions);
        var accUniqueName = this.creditorAcc.uniqueName;
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](data.transactions, function (element) {
            element.type = (element.type === 'by') ? 'debit' : 'credit';
        });
        if (data.voucherType === 'Sales') {
            apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](data.transactions, function (element) {
                if (!element.particular) {
                    element.particular = 'sales';
                }
                element.type = 'debit';
            });
        }
        else if (data.voucherType === 'Purchase') {
            apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](data.transactions, function (element) {
                if (!element.particular) {
                    element.particular = 'purchases';
                }
                element.type = 'credit';
            });
        }
        else if (data.voucherType === 'Credit note') {
            apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](data.transactions, function (element) {
                if (!element.particular) {
                    element.particular = 'sales';
                }
                element.type = 'credit';
            });
        }
        else if (data.voucherType === 'Debit note') {
            apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](data.transactions, function (element) {
                if (!element.particular) {
                    element.particular = 'purchases';
                }
                element.type = 'debit';
            });
        }
        // if (data.voucherType === 'Sales') {
        //   _.forEach(data.transactions, (element: any) => {
        //     if (!element.particular) {
        //       element.particular = 'sales';
        //     }
        //   });
        // }
        this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
        // data.transactions = this.validateTransaction(data.transactions, 'stock');
        // let accountsTransaction = this.validateTransaction(this.accountsTransaction, 'account');
        // if (!data.transactions.length) {
        //   return this._toaster.errorToast('Atleast 1 stock entry required.');
        // }
        // let transactions = _.concat(data.transactions, accountsTransaction);
        // console.log(transactions);
        // if (this.totalCreditAmount === this.totalDebitAmount) {
        //   let accUniqueName: string = this.creditorAcc.uniqueName;
        //   this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
        //   this.showStockList.next(false);
        // } else {
        //   this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
        // }
    };
    AccountAsInvoiceComponent.prototype.prepareDataForInvoice = function (data) {
        var stocksTransaction = [];
        var accountsTransaction = [];
        var filterData = this._tallyModuleService.prepareRequestForAPI(data);
        if (filterData.transactions.length) {
            apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](filterData.transactions, function (o, i) {
                if (o.inventory && o.inventory.amount) {
                    stocksTransaction.push(o);
                }
                else {
                    o.inventory = {};
                    accountsTransaction.push(o);
                }
            });
            this.accountsTransaction = accountsTransaction;
            this.stocksTransaction = stocksTransaction;
            if (!stocksTransaction.length) {
                this.addNewRow('stock');
            }
            if (!accountsTransaction.length) {
                this.addNewRow('account');
            }
        }
    };
    AccountAsInvoiceComponent.prototype.prepareDataForVoucher = function () {
        var transactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["concat"](apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.accountsTransaction), apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.stocksTransaction));
        //  let result = _.chain(transactions).groupBy('particular').value();
        transactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["orderBy"](transactions, 'type');
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](transactions, function (obj, idx) {
            var inventoryArr = [];
            if (obj.inventory && obj.inventory.amount) {
                inventoryArr.push(obj.inventory);
                obj.inventory = inventoryArr;
            }
            else {
                obj.inventory = inventoryArr;
            }
        });
        //  console.log(transactions);
        return transactions;
    };
    // public detectKey(ev) {
    //   if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
    //    this.arrowInput = { key: ev.keyCode };
    //   }
    // }
    AccountAsInvoiceComponent.prototype.detectKey = function (ev, isFirstAccountField) {
        if (isFirstAccountField === void 0) { isFirstAccountField = false; }
        this.keyUpDownEvent = ev;
        if (ev && ev.which === 8 && isFirstAccountField) {
            if (ev.target && (ev.target.getAttribute('data-changed') === 'false' || ev.target.value === '')) {
                var indx = this.stocksTransaction.length - 1;
                var stockEle = document.getElementById("stock_" + (indx - 1));
                return stockEle.focus();
            }
        }
        // if (ev.keyCode === 27) {
        //  this.deleteRow(this.selectedRowIdx);
        // }
        // if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
        //  this.arrowInput = { key: ev.keyCode };
        // }
    };
    /**
     * hideListItems
     */
    AccountAsInvoiceComponent.prototype.hideListItems = function () {
        if (!this.isPartyACFocused) {
            this.showStockList.emit(false);
            this.showAccountList.emit(false);
        }
    };
    AccountAsInvoiceComponent.prototype.dateEntered = function () {
        var date = moment__WEBPACK_IMPORTED_MODULE_13__(this.entryDate, 'DD-MM-YYYY');
        if (moment__WEBPACK_IMPORTED_MODULE_13__(date).format('dddd') !== 'Invalid date') {
            this.displayDay = moment__WEBPACK_IMPORTED_MODULE_13__(date).format('dddd');
        }
        else {
            this.displayDay = '';
        }
    };
    AccountAsInvoiceComponent.prototype.onStockFocus = function (ev, indx) {
        this.selectedStockInputField = ev.target;
        this.showConfirmationBox = false;
        this.selectRow(true, indx);
        this.selectedField = 'stock';
        this.getFlattenGrpofAccounts(this.groupUniqueName);
    };
    /**
     * getFlattenGrpofAccounts
     */
    AccountAsInvoiceComponent.prototype.getFlattenGrpofAccounts = function (parentGrpUnqName, q, forceRefresh, focusTargetElement) {
        var _this = this;
        if (forceRefresh === void 0) { forceRefresh = false; }
        if (focusTargetElement === void 0) { focusTargetElement = false; }
        if (this.allStocks && this.allStocks.length && !forceRefresh) {
            this.sortStockItems(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.allStocks));
        }
        else {
            this.inventoryService.GetStocks().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
                if (data.status === 'success') {
                    _this.sortStockItems(data.body.results);
                    _this.allStocks = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](data.body.results);
                    if (focusTargetElement) {
                        _this.selectedStockInputField.focus();
                    }
                }
            });
        }
        // const reqArray = parentGrpUnqName ? [parentGrpUnqName] : [];
        // this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: reqArray }, '', q).takeUntil(this.destroyed$).subscribe(data => {
        //   if (data.status === 'success') {
        //     this.sortStockItems(data.body.results);
        //   } else {
        //     // this.noResult = true;
        //   }
        // });
    };
    /**
     * sortStockItems
     */
    // public sortStockItems(ItemArr) {
    //   let stockAccountArr: IOption[] = [];
    //   _.forEach(ItemArr, (obj: any) => {
    //     if (obj.stocks) {
    //       _.forEach(obj.stocks, (stock: any) => {
    //         stock.accountStockDetails.name = obj.name;
    //         stockAccountArr.push({
    //           label: `${stock.name} (${stock.uniqueName})`,
    //           value: stock.uniqueName,
    //           additional: stock
    //         });
    //       });
    //     }
    //   });
    //   // console.log(stockAccountArr, 'stocks');
    //   this.stockList = stockAccountArr;
    //   this.inputForList = _.cloneDeep(this.stockList);
    //   setTimeout(() => {
    //     this.showLedgerAccountList = true;
    //   }, 200);
    // }
    AccountAsInvoiceComponent.prototype.sortStockItems = function (ItemArr) {
        var _this = this;
        var stockAccountArr = [];
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forEach"](ItemArr, function (obj) {
            stockAccountArr.push({
                label: obj.name + " (" + obj.uniqueName + ")",
                value: obj.uniqueName,
                additional: obj
            });
        });
        // console.log(stockAccountArr, 'stocks');
        this.stockList = stockAccountArr;
        this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](this.stockList);
        setTimeout(function () {
            _this.showLedgerAccountList = true;
        }, 200);
    };
    AccountAsInvoiceComponent.prototype.onItemSelected = function (ev) {
        var _this = this;
        setTimeout(function () {
            _this.currentSelectedValue = '';
            _this.showLedgerAccountList = false;
        }, 200);
        if (ev.value === 'createnewitem') {
            return this.showQuickAccountModal();
        }
        if (this.selectedField === 'account') {
            this.setAccount(ev.additional);
            setTimeout(function () {
                var accIndx = _this.accountsTransaction.findIndex(function (acc) { return acc.selectedAccount.UniqueName === ev.value; });
                var indexInTaxesToRemember = _this.taxesToRemember.findIndex(function (t) { return t.taxUniqueName === ev.value; });
                if (indexInTaxesToRemember > -1 && accIndx > -1) {
                    var rate = _this.taxesToRemember[indexInTaxesToRemember].taxValue;
                    _this.accountsTransaction[accIndx].rate = rate;
                    _this.calculateRate(accIndx, rate);
                }
            }, 100);
        }
        else if (this.selectedField === 'stock') {
            var stockUniqueName_1 = ev.value;
            var taxIndex = this.taxesToRemember.findIndex(function (i) { return i.stockUniqueName === stockUniqueName_1; });
            if (taxIndex === -1) {
                this.inventoryService.GetStockUniqueNameWithDetail(stockUniqueName_1).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (stockFullDetails) {
                    if (stockFullDetails && stockFullDetails.body.taxes && stockFullDetails.body.taxes.length) {
                        _this.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (taxes) {
                            stockFullDetails.body.taxes.forEach(function (tax) {
                                // let selectedTaxAcc = this.allFlattenAccounts.find((acc) => acc.uniqueName === tax);
                                // if (selectedTaxAcc) {
                                // let acc = selectedTaxAcc;
                                // let accModel = {
                                //   name: acc.name,
                                //   UniqueName: acc.uniqueName,
                                //   groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
                                //   account: acc.name
                                // };
                                // this.accountsTransaction[0].particular = accModel.UniqueName;
                                // this.accountsTransaction[0].selectedAccount = accModel;
                                // this.accountsTransaction[0].stocks = acc.stocks;
                                // }
                                var selectedTax = taxes.find(function (t) { return t.uniqueName === tax; });
                                var taxTotalValue = 0;
                                if (selectedTax) {
                                    selectedTax.taxDetail.forEach(function (st) {
                                        taxTotalValue += st.taxValue;
                                    });
                                }
                                var taxIndx = _this.taxesToRemember.findIndex(function (i) { return i.taxUniqueName === tax; });
                                if (taxIndx === -1) {
                                    _this.taxesToRemember.push({ stockUniqueName: stockUniqueName_1, taxUniqueName: tax, taxValue: taxTotalValue });
                                }
                            });
                        });
                    }
                    // this.companyTaxesList$.pipe(take(1)).subscribe((taxes: TaxResponse[]) => {
                    //   console.log('TaxResponse areee :', taxes);
                    //   taxes.find((tax) => tax.uniqueName === );
                    //   this.taxesToRemember.push({ stockUniqueName, taxValue:   });
                    // });
                });
            }
            this.onSelectStock(ev.additional);
        }
        else if (this.selectedField === 'partyAcc') {
            this.setAccount(ev.additional);
        }
    };
    AccountAsInvoiceComponent.prototype.loadQuickAccountComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_20__["QuickAccountComponent"]);
        var viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        var componentInstance = componentRef.instance;
        componentInstance.needAutoFocus = true;
        componentInstance.closeQuickAccountModal.subscribe(function (a) {
            _this.hideQuickAccountModal();
            componentInstance.needAutoFocus = false;
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
            _this.dateField.nativeElement.focus();
            if (_this.selectedAccountInputField) {
                _this.selectedAccountInputField.value = '';
            }
        });
        componentInstance.isQuickAccountCreatedSuccessfully$.subscribe(function (status) {
            if (status) {
                _this.refreshAccountListData(null, true);
            }
        });
    };
    AccountAsInvoiceComponent.prototype.showQuickAccountModal = function () {
        if (this.selectedField === 'account') {
            this.loadQuickAccountComponent();
            this.quickAccountModal.show();
        }
        else if (this.selectedField === 'stock') {
            this.asideMenuStateForProductService = 'in'; // selectedEle.getAttribute('data-changed')
            // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
            // this.selectedStockInputField = selectedField;
            this.autoFocusStockGroupField = true;
        }
    };
    AccountAsInvoiceComponent.prototype.hideQuickAccountModal = function () {
        this.quickAccountModal.hide();
    };
    AccountAsInvoiceComponent.prototype.onPartyAccFocusInput = function (ev, accCategory) {
        var _this = this;
        if (accCategory === void 0) { accCategory = null; }
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        this.accountType = 'creditor';
        this.isPartyACFocused = true;
        this.selectedField = 'partyAcc';
        setTimeout(function () {
            _this.currentSelectedValue = '';
            _this.showLedgerAccountList = true;
            _this.filterByText = '';
        }, 10);
    };
    AccountAsInvoiceComponent.prototype.onPartyAccFocus = function (ev, accCategory) {
        var _this = this;
        if (accCategory === void 0) { accCategory = null; }
        this.selectedAccountInputField = ev.target;
        this.showConfirmationBox = false;
        this.getFlattenGrpAccounts(null, false);
        this.refreshAccountListData(accCategory);
        this.accountType = 'creditor';
        this.isPartyACFocused = true;
        this.selectedField = 'partyAcc';
        setTimeout(function () {
            _this.currentSelectedValue = '';
            _this.showLedgerAccountList = true;
            _this.filterByText = '';
        }, 10);
    };
    AccountAsInvoiceComponent.prototype.onPartyAccBlur = function (needRefreshAccounts) {
        if (needRefreshAccounts === void 0) { needRefreshAccounts = false; }
        // this.showAccountList.emit(false);
        // selectedInput=creditor;
        // this.isPartyACFocused = false;
        // setTimeout(() => {
        //   this.currentSelectedValue = '';
        //   this.showLedgerAccountList = false;
        // }, 200);
        this.filterByText = '';
        this.currentSelectedValue = '';
        this.showLedgerAccountList = false;
        if (needRefreshAccounts) {
            this.refreshAccountListData();
        }
    };
    AccountAsInvoiceComponent.prototype.closeCreateStock = function () {
        this.asideMenuStateForProductService = 'out';
        this.autoFocusStockGroupField = false;
        // after creating stock, get all stocks again
        this.selectedStockInputField.value = '';
        this.filterByText = '';
        // this.partyAccNameInputField.nativeElement.focus();
        this.dateField.nativeElement.focus();
        this.getFlattenGrpofAccounts(null, null, true, true);
    };
    AccountAsInvoiceComponent.prototype.addNewAccount = function (val, lastIdx) {
        if (val && lastIdx) {
            this.addNewRow('account');
        }
    };
    AccountAsInvoiceComponent.prototype.checkIfEnteredAmountIsZero = function (amount, indx, transactionType) {
        if (!Number(amount)) {
            if (transactionType === 'stock') {
                if (indx === 0) {
                    this.dateField.nativeElement.focus();
                }
                else {
                    var stockEle = document.getElementById("stock_" + (indx - 1));
                    stockEle.focus();
                }
                this.stocksTransaction.splice(indx, 1);
            }
            else if (transactionType === 'account') {
                if (indx === 0) {
                    this.dateField.nativeElement.focus();
                }
                else {
                    var accountEle = document.getElementById("account_" + (indx - 1));
                    accountEle.focus();
                }
                this.accountsTransaction.splice(indx, 1);
            }
        }
    };
    AccountAsInvoiceComponent.prototype.keyUpOnSubmitButton = function (e) {
        var _this = this;
        if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
            return setTimeout(function () { return _this.resetButton.nativeElement.focus(); }, 50);
        }
        if (e && (e.keyCode === 8 || e.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 50);
        }
    };
    AccountAsInvoiceComponent.prototype.keyUpOnResetButton = function (e) {
        var _this = this;
        if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
            return setTimeout(function () { return _this.submitButton.nativeElement.focus(); }, 50);
        }
        if (e && (e.keyCode === 13 || e.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 50);
        }
    };
    // public keyUpOnSubmitButton(e) {
    //   if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
    //     return setTimeout(() => this.resetButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 8 || e.which === 8)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }
    // public keyUpOnResetButton(e) {
    //   if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
    //     return setTimeout(() => this.submitButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 13 || e.which === 13)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }
    AccountAsInvoiceComponent.prototype.deleteRow = function (idx) {
        this.stocksTransaction.splice(idx, 1);
        if (!idx) {
            this.addNewRow('stock');
        }
    };
    AccountAsInvoiceComponent.prototype.refreshAccountListData = function (groupUniqueName, needToFocusSelectedInputField) {
        var _this = this;
        if (groupUniqueName === void 0) { groupUniqueName = null; }
        if (needToFocusSelectedInputField === void 0) { needToFocusSelectedInputField = false; }
        this.store.select(function (p) { return p.session.companyUniqueName; }).subscribe(function (a) {
            if (a && a !== '') {
                _this._accountService.GetFlattenAccounts('', '', '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(_this.destroyed$)).subscribe(function (data) {
                    if (data.status === 'success') {
                        _this.allFlattenAccounts = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](data.body.results);
                        if (groupUniqueName) {
                            var filteredAccounts = data.body.results.filter(function (acc) { return acc.parentGroups.findIndex(function (g) { return g.uniqueName === groupUniqueName; }) > -1; });
                            _this._tallyModuleService.setFlattenAccounts(filteredAccounts);
                            _this.isAccountListFiltered = true;
                        }
                        else {
                            _this._tallyModuleService.setFlattenAccounts(data.body.results);
                            _this.isAccountListFiltered = false;
                        }
                        if (needToFocusSelectedInputField) {
                            _this.selectedAccountInputField.focus();
                        }
                    }
                });
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsInvoiceComponent.prototype, "saveEntryOnCtrlA", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsInvoiceComponent.prototype, "openDatePicker", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsInvoiceComponent.prototype, "openCreateAccountPopup", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Account__WEBPACK_IMPORTED_MODULE_19__["AccountResponse"])
    ], AccountAsInvoiceComponent.prototype, "newSelectedAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"])
    ], AccountAsInvoiceComponent.prototype, "showAccountList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"])
    ], AccountAsInvoiceComponent.prototype, "showStockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('quickAccountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__["ElementViewContainerRef"])
    ], AccountAsInvoiceComponent.prototype, "quickAccountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('quickAccountModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], AccountAsInvoiceComponent.prototype, "quickAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChildren"])(_theme_ng2_vs_for_ng2_vs_for__WEBPACK_IMPORTED_MODULE_4__["VsForDirective"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["QueryList"])
    ], AccountAsInvoiceComponent.prototype, "columnView", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('particular'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AccountAsInvoiceComponent.prototype, "accountField", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('dateField'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ElementRef"])
    ], AccountAsInvoiceComponent.prototype, "dateField", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('manageGroupsAccountsModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], AccountAsInvoiceComponent.prototype, "manageGroupsAccountsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('partyAccNameInputField'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ElementRef"])
    ], AccountAsInvoiceComponent.prototype, "partyAccNameInputField", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('submitButton'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ElementRef"])
    ], AccountAsInvoiceComponent.prototype, "submitButton", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('resetButton'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ElementRef"])
    ], AccountAsInvoiceComponent.prototype, "resetButton", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('narrationBox'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ElementRef"])
    ], AccountAsInvoiceComponent.prototype, "narrationBox", void 0);
    AccountAsInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Component"])({
            selector: 'account-as-invoice',
            template: __webpack_require__(/*! ./invoice-grid.component.html */ "./src/app/accounting/invoice-grid/invoice-grid.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./invoice-grid.component.css */ "./src/app/accounting/invoice-grid/invoice-grid.component.css"), __webpack_require__(/*! ../accounting.component.css */ "./src/app/accounting/accounting.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_8__["AccountService"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__["LedgerActions"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_10__["Store"],
            _keyboard_service__WEBPACK_IMPORTED_MODULE_6__["KeyboardService"],
            apps_web_giddh_src_app_actions_fly_accounts_actions__WEBPACK_IMPORTED_MODULE_14__["FlyAccountsActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"],
            apps_web_giddh_src_app_actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_18__["SalesActions"],
            _tally_service__WEBPACK_IMPORTED_MODULE_2__["TallyModuleService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_11__["ComponentFactoryResolver"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_22__["InventoryService"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_23__["InventoryAction"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_25__["InvoiceActions"]])
    ], AccountAsInvoiceComponent);
    return AccountAsInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/accounting/keyboard.directive.ts":
/*!**************************************************!*\
  !*** ./src/app/accounting/keyboard.directive.ts ***!
  \**************************************************/
/*! exports provided: OnReturnDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnReturnDirective", function() { return OnReturnDirective; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var KEY_CODE_CONSTANTS = {
    ENTER: 13,
    SPACE: 32,
    BACKSPACE: 8,
    ESC: 27,
    ARROW_DOWN: 40,
    ARROW_UP: 38
};
var OnReturnDirective = /** @class */ (function () {
    function OnReturnDirective(_el) {
        var _this = this;
        this._el = _el;
        this.clickCount = 0;
        this.activeIndx = null;
        this.fieldToActivate = null;
        this.isOtherKeyPressed = false;
        this.el = this._el;
        setTimeout(function () {
            _this.clickCount = 0;
        }, 2500);
    }
    OnReturnDirective.prototype.onKeyDown = function (e) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        if ((e.which === KEY_CODE_CONSTANTS.ENTER || e.keyCode === KEY_CODE_CONSTANTS.ENTER) || (e.which === KEY_CODE_CONSTANTS.BACKSPACE || e.keyCode === KEY_CODE_CONSTANTS.BACKSPACE) || (e.which === KEY_CODE_CONSTANTS.SPACE || e.keyCode === KEY_CODE_CONSTANTS.SPACE) || (e.which === KEY_CODE_CONSTANTS.ESC || e.keyCode === KEY_CODE_CONSTANTS.ESC) || (e.which === KEY_CODE_CONSTANTS.ARROW_DOWN || e.keyCode === KEY_CODE_CONSTANTS.ARROW_DOWN) || (e.which === KEY_CODE_CONSTANTS.ARROW_UP || e.keyCode === KEY_CODE_CONSTANTS.ARROW_UP)) {
            var selectedEle_1 = e.target;
            var allElements_1 = window.document.querySelectorAll('input[onReturn][type="text"], textarea[onReturn]');
            var nodeList = Array.from(allElements_1);
            var indx_1 = nodeList.findIndex(function (ele) { return ele === selectedEle_1; });
            // nodeList[indx + 1].focus();
            if (e.which === KEY_CODE_CONSTANTS.ENTER || e.keyCode === KEY_CODE_CONSTANTS.ENTER) {
                if (e.ctrlKey) {
                    return selectedEle_1.setAttribute('data-changed', true);
                }
                else {
                    selectedEle_1.setAttribute('data-changed', false);
                }
                var target_1 = allElements_1[indx_1 + 1];
                if (this.selectedField && this.selectedField === allElements_1[indx_1] && allElements_1[indx_1].value === '') {
                    // detect by or to
                    var activatedRow = window.document.querySelectorAll('tr.activeRow');
                    var rowEntryType = activatedRow[0].children[0].children[0].value;
                    if (rowEntryType === 'by') {
                        target_1 = allElements_1[indx_1 + 4];
                    }
                    else if (rowEntryType === 'to') {
                        target_1 = allElements_1[indx_1 + 5];
                    }
                }
                else if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('stock-field') && this.selectedField !== allElements_1[indx_1]) {
                    this.selectedField = allElements_1[indx_1];
                }
                else if (target_1 && target_1.classList.contains('debit-credit')) {
                    target_1 = allElements_1[indx_1 + 2];
                }
                else if (allElements_1[indx_1 + 1] && allElements_1[indx_1 + 1].classList.contains('byTo') && allElements_1[indx_1 + 1].disabled) {
                    target_1 = allElements_1[indx_1 + 2];
                }
                else if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('select-stock-in-invoice')) {
                    if (this.activeIndx === indx_1) {
                        target_1 = allElements_1[indx_1 + 1];
                        if (target_1.disabled) {
                            target_1 = allElements_1[indx_1 + 4];
                        }
                        this.activeIndx = null;
                        return target_1.focus();
                    }
                    else {
                        return this.activeIndx = indx_1;
                    }
                }
                else if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('invoice-account-field')) {
                    if (this.activeIndx === indx_1) {
                        target_1 = allElements_1[indx_1 + 1];
                        return setTimeout(function () {
                            if (target_1.disabled && allElements_1[indx_1].value.trim() === '') {
                                return document.getElementById('invoice-narration').focus();
                            }
                            else {
                                _this.activeIndx = null;
                                return target_1.focus();
                            }
                        }, 100);
                    }
                    else {
                        return this.activeIndx = indx_1;
                    }
                }
                if (target_1) {
                    if (target_1.disabled) {
                        target_1 = allElements_1[indx_1 + 2];
                    }
                    if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('upper-fields')) {
                        setTimeout(function () {
                            target_1.focus();
                        }, 210);
                    }
                    else {
                        if (target_1.value === 'NaN' || target_1.value === 0) {
                            target_1.value = '';
                        }
                        if (this.clickCount > 1) {
                            // focus Narration
                            this.clickCount = 0;
                            return document.getElementById('narration').focus();
                        }
                        if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('from-or-to-acc')) {
                            this.clickCount++;
                        }
                        target_1.focus();
                    }
                }
            }
            else if (e.which === KEY_CODE_CONSTANTS.BACKSPACE || e.keyCode === KEY_CODE_CONSTANTS.BACKSPACE) {
                var target = allElements_1[indx_1 - 1];
                var activatedRow = window.document.querySelectorAll('tr.activeRow');
                var rowEntryType = activatedRow[0].children[0].children[0].value;
                if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('debit-credit')) {
                    if (rowEntryType === 'by') {
                        target = allElements_1[indx_1 - 4];
                    }
                    else if (rowEntryType === 'to') {
                        target = allElements_1[indx_1 - 5];
                    }
                }
                else if (allElements_1[indx_1] && allElements_1[indx_1].classList.contains('byTo')) {
                    if (target.disabled) {
                        target = allElements_1[indx_1 - 2];
                    }
                }
                else if (allElements_1[indx_1 - 1] && allElements_1[indx_1 - 1].classList.contains('byTo') && allElements_1[indx_1 - 1].disabled) {
                    target = allElements_1[indx_1 - 2];
                }
                // } else if (allElements[indx] && allElements[indx].classList.contains('account-amount-field')) {
                //   return target.focus();
                // }
                // && !this.isOtherKeyPressed && this.selectedField !== target
                if (target && e.target.value.length === e.target.selectionEnd) {
                    if (selectedEle_1.getAttribute('data-changed') === 'false' || selectedEle_1.value.trim() === '') {
                        e.preventDefault();
                        if (target.disabled) {
                            // console.log('yes if');
                            target = allElements_1[indx_1 - 2];
                            if (target.disabled) {
                                target = allElements_1[indx_1 - 3];
                            }
                            return target.focus();
                        }
                        else {
                            return target.focus();
                        }
                    }
                }
            }
            else if (e.which === KEY_CODE_CONSTANTS.SPACE || e.keyCode === KEY_CODE_CONSTANTS.SPACE) {
                var target = allElements_1[indx_1];
                if (target) {
                    // target.value = ''; // No need to make the field empty
                }
            }
            else if (e.which === KEY_CODE_CONSTANTS.ESC) {
                var gridType = window.document.getElementById('get-grid-type').getAttribute('data-gridType');
                if (gridType === 'invoice') {
                    var invDateField = nodeList.find(function (ele) { return ele.classList.contains('invoice-date-field'); });
                    invDateField.focus();
                }
                else if (gridType === 'voucher') {
                    var vouDateField = nodeList.find(function (ele) { return ele.classList.contains('voucher-date-field'); });
                    vouDateField.focus();
                }
                return setTimeout(function () {
                    selectedEle_1.focus();
                }, 100);
            }
            else if (e.which === KEY_CODE_CONSTANTS.ARROW_UP || e.which === KEY_CODE_CONSTANTS.ARROW_DOWN) {
                if (selectedEle_1.getAttribute('data-changed') === 'false') {
                    selectedEle_1.value = '';
                    return selectedEle_1.setAttribute('data-changed', true);
                }
            }
        }
        else if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode >= 65 && e.keyCode <= 90) {
            var selectedEle = e.target;
            // const allElements: any = window.document.querySelectorAll('input[onReturn][type="text"]');
            // const nodeList = Array.from(allElements);
            // const indx = nodeList.findIndex((ele) => ele === selectedEle);
            selectedEle.setAttribute('data-changed', true);
            // if (this.selectedField === allElements[indx]) {
            //   this.isOtherKeyPressed = true;
            // } else {
            //   this.isOtherKeyPressed = false;
            //   this.selectedField = allElements[indx];
            // }
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], OnReturnDirective.prototype, "onReturn", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('keydown', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], OnReturnDirective.prototype, "onKeyDown", null);
    OnReturnDirective = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
            selector: '[onReturn]'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], OnReturnDirective);
    return OnReturnDirective;
}());



/***/ }),

/***/ "./src/app/accounting/keyboard.service.ts":
/*!************************************************!*\
  !*** ./src/app/accounting/keyboard.service.ts ***!
  \************************************************/
/*! exports provided: KeyboardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyboardService", function() { return KeyboardService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");



var KeyboardService = /** @class */ (function () {
    function KeyboardService() {
        this.keyInformation = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
    }
    KeyboardService.prototype.setKey = function (event) {
        this.keyInformation.next(event);
    };
    KeyboardService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])()
    ], KeyboardService);
    return KeyboardService;
}());



/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.css":
/*!****************************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list-menu.component.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".menu {\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  background-color: white;\n  width: 100%;\n  overflow: auto;\n  box-sizing: border-box;\n  z-index: 999;\n  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15);\n  border-bottom: 1px solid rgba(34, 36, 38, .15);\n  border-left: 1px solid rgba(34, 36, 38, .15);\n  border-right: 1px solid rgba(34, 36, 38, .15);\n  border-radius: 0 0 2px 2px;\n  min-width: -webkit-max-content;\n  min-width: -moz-max-content;\n  min-width: max-content;\n  margin-top: 1px;\n  min-height: 100%;\n}\n\n.item {\n  /* padding: 4px; */\n  cursor: pointer;\n  white-space: normal;\n  word-break: normal;\n  display: table;\n  width: 100%;\n  text-transform: capitalize;\n}\n\n.item:hover {\n  background-color: rgb(244, 245, 248);\n  color: rgb(210, 95, 42);\n}\n\n.item.selected {\n  background-color: rgb(244, 245, 248);\n  color: rgb(210, 95, 42);\n}\n\n.item.hilighted {\n  background-color: rgb(244, 245, 248);\n  color: rgb(210, 95, 42);\n}\n\n.item > a {\n  padding: 6px 10px;\n}\n\n.no-result-link > a {\n  color: #10aae0 !important;\n}\n\n#noresult:hover {\n  background: transparent;\n}\n\n:host ::ng-deep .total-padding {\n  height: calc(100vh - 52px) !important;\n}\n"

/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list-menu.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"menu\" *ngIf=\"isOpen && _rows\" style=\"background-color: white\">\n  <!--virtual-->\n  <virtual-scroll #v [items]=\"_rows\" (update)=\"viewPortItems = $event\"\n    [childHeight]=\"viewPortItems?.length === 0?41:undefined\" [selectedValues]=\"selectedValues\"\n    [NoFoundMsgHeight]=\"NoFoundMsgHeight\" [NoFoundLinkHeight]=\"NoFoundLinkHeight\"\n    [noResultLinkEnabled]=\"noResultLinkEnabled\">\n\n    <div id=\"noresult\"\n      *ngIf=\"viewPortItems?.length === 0 || (viewPortItems?.length === 1 && viewPortItems[0].value === 'createnewitem')\"\n      class=\"item\" [style.height.px]=\"noResultLinkEnabled ? NoFoundMsgHeight : (NoFoundMsgHeight - 20)\">\n      <a href=\"javascript:void(0);\">{{notFoundMsg}}</a>\n    </div>\n\n    <div class=\"item\" *ngFor=\"let row of viewPortItems\" [class.selected]=\"selectedValues?.indexOf(row) !== -1\"\n      [class.hilighted]=\"row.isHilighted\" (mousedown)=\"toggleSelected(row)\" [style.height.px]=\"ItemHeight\">\n      <ng-template [ngTemplateOutletContext]=\"{option: row}\" [ngTemplateOutlet]=\"optionTemplate\"></ng-template>\n      <ng-container *ngIf=\"!optionTemplate\">\n        <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n          <div class=\"item\">{{row.label}}</div>\n        </a>\n      </ng-container>\n    </div>\n\n    <div class=\"item no-result-link\" *ngIf=\"viewPortItems?.length === 0 && noResultLinkEnabled\"\n      [style.height.px]=\"NoFoundLinkHeight\">\n      <a class=\"btn-link\" href=\"javascript:void(0)\"\n        (mousedown)=\"$event.stopPropagation();noResultClicked.emit()\">{{notFoundLinkText}}</a>\n    </div>\n\n  </virtual-scroll>\n\n</div>\n"

/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list-menu.component.ts ***!
  \***************************************************************************/
/*! exports provided: AVAccountListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVAccountListComponent", function() { return AVAccountListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../theme/ng-virtual-select/virtual-scroll */ "./src/app/theme/ng-virtual-select/virtual-scroll.ts");



var AVAccountListComponent = /** @class */ (function () {
    function AVAccountListComponent() {
        this.notFoundLinkText = 'Create New';
        this.noToggleClick = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noResultClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.math = Math;
    }
    Object.defineProperty(AVAccountListComponent.prototype, "rows", {
        set: function (val) {
            if (this.virtualScrollElm) {
                // this.virtualScrollElm.scrollInto(this._rows[0]);
            }
            this._rows = val;
            if (this.virtualScrollElm) {
                this.virtualScrollElm.refresh();
            }
        },
        enumerable: true,
        configurable: true
    });
    AVAccountListComponent.prototype.ngOnChanges = function (changes) {
        // if (changes['isOpen'] && changes['isOpen'].currentValue) {
        //   this.dyHeight = Number(window.getComputedStyle(this.listContainer.nativeElement).height);
        // }
    };
    AVAccountListComponent.prototype.toggleSelected = function (row) {
        this.noToggleClick.emit(row);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], AVAccountListComponent.prototype, "selectedValues", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVAccountListComponent.prototype, "isOpen", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], AVAccountListComponent.prototype, "optionTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVAccountListComponent.prototype, "notFoundMsg", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVAccountListComponent.prototype, "notFoundLinkText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVAccountListComponent.prototype, "noResultLinkEnabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVAccountListComponent.prototype, "ItemHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVAccountListComponent.prototype, "NoFoundMsgHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVAccountListComponent.prototype, "NoFoundLinkHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVAccountListComponent.prototype, "dropdownMinHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AVAccountListComponent.prototype, "noToggleClick", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVAccountListComponent.prototype, "noResultClicked", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_2__["VirtualScrollComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_2__["VirtualScrollComponent"])
    ], AVAccountListComponent.prototype, "virtualScrollElm", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('listContainer'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AVAccountListComponent.prototype, "listContainer", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Array])
    ], AVAccountListComponent.prototype, "rows", null);
    AVAccountListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'virtual-list-menu',
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            template: __webpack_require__(/*! ./virtual-list-menu.component.html */ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.html"),
            styles: [__webpack_require__(/*! ./virtual-list-menu.component.css */ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.css")]
        })
    ], AVAccountListComponent);
    return AVAccountListComponent;
}());



/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  position: relative;\n}\n\n/* .header {\n    width: 100%;\n    margin: 0 !important;\n    padding: 2px 30px 2px 10px;\n    box-sizing: border-box;\n    background-color: white;\n    font-size: 1.0em;\n    border-radius: 2px;\n    border: 1px solid rgba(34, 36, 38, .15);\n    vertical-align: middle;\n    cursor: pointer;\n} */\n\n.header:hover {\n  cursor: text;\n}\n\n.header.inline {\n  background-color: transparent;\n  width: -webkit-max-content;\n  width: -moz-max-content;\n  width: max-content;\n  border: none;\n}\n\n.header.open {\n  border-radius: 2px 2px 0 0;\n  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15);\n  border-bottom: none;\n}\n\n.header:focus {\n  outline: 0;\n}\n\ndiv {\n  display: block;\n}\n\n/* input[type=\"text\"] {\n    border: none !important;\n    vertical-align: middle !important;\n    width: 100%;\n    margin: 0 !important;\n    padding: 0px !important;\n    box-sizing: border-box;\n    background-color: white;\n    font-size: 1.0rem !important;\n    line-height: 2rem !important;\n    letter-spacing: 0.01rem !important;\n    font-family: 'RobotoDraft', 'Roboto', 'Helvetica Neue, Helvetica, Arial', sans-serif;\n    font-style: normal !important;\n    font-weight: 300 !important;\n    -webkit-font-smoothing: antialiased !important;\n    -moz-osx-font-smoothing: grayscale !important;\n    text-rendering: optimizeLegibility !important;\n} */\n\ninput[type=\"text\"] {\n  outline: none;\n}\n\n[hidden] {\n  display: none;\n}\n\ni.close.icon.clear::after {\n  content: \"✕\";\n  padding-right: 8px;\n  font-weight: 800;\n  color: gray;\n}\n\ni.close.icon.clear:hover::after {\n  color: red;\n}\n\n.clear {\n  position: absolute;\n  right: 2px;\n  padding-left: 2px;\n  padding-right: 2px;\n  top: 47%;\n  cursor: pointer;\n  font-size: 25px;\n  font-weight: 500;\n  line-height: 100%;\n  opacity: .5;\n  color: black;\n  transform: translateY(-50%);\n}\n\n.sh-select-disabled {\n  background-color: #e3e3e3;\n  color: darkgray;\n  cursor: not-allowed;\n}\n\n.chip {\n  display: inline-block;\n  padding: 0 7px;\n  height: 30px;\n  font-size: 14px;\n  line-height: 30px;\n  border-radius: 4px;\n  background-color: #f4f5f8;\n  margin: 0px 0 4px 4px;\n  /* color: white; */\n}\n\n.chipClosebtn {\n  padding-left: 10px;\n  font-weight: 500;\n  float: right;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: .6;\n}\n\n.chipClosebtn:hover {\n  font-weight: 700;\n  opacity: .5;\n  color: black;\n}\n\n.sh-select-disabled .selectedVal,\n.sh-select-disabled .form-control {\n  background: #eee !important;\n  pointer-events: none;\n  cursor: not-allowed;\n}\n\n.selectedVal {\n  border: 1px solid #d6d6d6 !important;\n  padding-right: 22px !important;\n  background: #fff !important;\n}\n\n.header.open > input[type=\"text\"] {\n  border-color: #d6d6d6;\n}\n\n.header .bdr > input[type=\"text\"] {\n  border: 0;\n}\n"

/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list.component.html":
/*!************************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #dd [style.width]=\"width\">\n  <!-- <div class=\"header\" #mainContainer [class.sh-select-disabled]=\"disabled\" [class.inline]=\"mode==='inline'\" (click)=\"show($event)\" [class.open]=\"isOpen\" tabindex=\"0\" (focus)=\"show($event)\" (blur)=\"hide($event)\" (keydown)=\"keydownUp($event)\"> -->\n\n\n  <!--region multiple-->\n  <!-- <div *ngIf=\"multiple\" [ngClass]=\"{'has-item':selectedValues?.length}\" style=\"background: white;\" class=\"bdr\">\n          <ng-container *ngIf=\"selectedValues?.length\">\n              <span class=\"chip\" *ngFor=\"let sl of selectedValues\">\n                  {{ sl.label }}\n                  <span class=\"chipClosebtn\" (mousedown)=\"clearSingleSelection($event, sl)\" (click)=\"clearSingleSelection($event, sl)\">&times;</span>\n              </span>\n          </ng-container>\n          <input type=\"text\" style=\"opacity: 0 !important;position: absolute\" class=\"pdL1\" [ngClass]=\"{'hasValue':filter?.length}\" #inputFilter (click)=\"show($event);\" (blur)=\"filterInputBlur($event)\" [placeholder]=\"selectedValues?.length > 0 ? filter : placeholder\" [(ngModel)]=\"filter\" (ngModelChange)=\"updateFilter($event)\">\n      </div> -->\n  <!--endregion-->\n\n  <!--region single-->\n  <!-- <input type=\"text\" class=\"form-control\" #inputFilter tabindex=\"0\" *ngIf=\"!multiple\" [hidden]=\"((!isOpen || !isFilterEnabled))\" (click)=\"show($event);\" (blur)=\"filterInputBlur($event)\" [placeholder]=\"placeholder\" [(ngModel)]=\"filter\" (ngModelChange)=\"updateFilter($event)\"\n          style=\"padding-right: 22px !important;opacity: 0;position: absolute\"> -->\n\n  <!-- <div (click)=\"show($event);\" *ngIf=\"((!isOpen || !isFilterEnabled) && !multiple)\">\n          <ng-container *ngIf=\"selectedValues?.length\">\n              <div *ngIf=\"!multiple\">\n                  <input type=\"text\" readonly value=\"{{selectedValues[0].label}}\" class=\"form-control selectedVal cp\" />\n              </div>\n          </ng-container>\n          <ng-container *ngIf=\"!selectedValues?.length\">\n              <input type=\"text\" class=\"form-control\" [placeholder]=\"placeholder\" [value]=\"filter\" style=\"padding-right: 22px !important;\" />\n          </ng-container>\n      </div> -->\n  <!--endregion-->\n\n  <!-- </div> -->\n  <!-- <span class=\"clear\" *ngIf=\"showClear && selectedValues.length > 0\" (click)=\"$event.stopPropagation();clear();\">&times;</span> -->\n  <virtual-list-menu #menuEle [isOpen]=\"isOpen\" [rows]=\"rows\" [selectedValues]=\"selectedValues\"\n                     [optionTemplate]=\"optionTemplate\" (noToggleClick)=\"toggleSelected($event)\"\n                     (noResultClicked)=\"noResultsClicked.emit(); hide()\" [noResultLinkEnabled]=\"notFoundLink\"\n                     [notFoundMsg]=\"notFoundMsg\" [notFoundLinkText]=\"notFoundLinkText\" [ItemHeight]=\"ItemHeight\"\n                     [NoFoundMsgHeight]=\"NoFoundMsgHeight\" [NoFoundLinkHeight]=\"NoFoundLinkHeight\"\n                     [dropdownMinHeight]=\"dropdownMinHeight\"></virtual-list-menu>\n</div>\n"

/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list.component.ts ***!
  \**********************************************************************/
/*! exports provided: AVShSelectComponent, AVShSelectProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVShSelectComponent", function() { return AVShSelectComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVShSelectProvider", function() { return AVShSelectProvider; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _virtual_list_menu_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./virtual-list-menu.component */ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.ts");

/**
 * Created by yonifarin on 12/3/16.
 */




var FLATTEN_SEARCH_TERM = 'flatten';
// noinspection TsLint
var AVShSelectComponent = /** @class */ (function () {
    function AVShSelectComponent(element, renderer, cdRef) {
        this.element = element;
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.idEl = '';
        this.placeholder = 'Type to filter';
        this.multiple = false;
        this.mode = 'default';
        this.showClear = false;
        this.notFoundMsg = 'No results found';
        this.notFoundLinkText = 'Create New';
        this.notFoundLink = false;
        this.isFilterEnabled = true;
        this.width = 'auto';
        this.ItemHeight = 41;
        this.NoFoundMsgHeight = 30;
        this.NoFoundLinkHeight = 30;
        this.dropdownMinHeight = 35;
        this.useInBuiltFilterForFlattenAc = false;
        this.useInBuiltFilterForIOptionTypeItems = false;
        this.doNotReset = false;
        this.showList = false;
        this.filterText = '';
        this.onHide = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onShow = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onClear = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.selected = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noOptionsFound = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noResultsClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.viewInitEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.rows = [];
        this.isOpen = true;
        this.filter = '';
        this.filteredData = [];
        this._selectedValues = [];
        this._options = [];
        /** Keys. **/
        this.KEYS = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            UP: 38,
            DOWN: 40
        };
    }
    Object.defineProperty(AVShSelectComponent.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (val) {
            this._options = val;
            this.updateRows(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AVShSelectComponent.prototype, "selectedValues", {
        get: function () {
            return this._selectedValues;
        },
        set: function (val) {
            if (!val) {
                val = [];
            }
            if (!Array.isArray(val)) {
                val = [val];
            }
            if (val.length > 0 && this.rows) {
                this._selectedValues = this.rows.filter(function (f) { return val.findIndex(function (p) { return p === f.label || p === f.value; }) !== -1; });
            }
            else {
                this._selectedValues = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * on click outside the view close the menu
     * @param event
     */
    // @HostListener('window:mouseup', ['$event'])
    // public onDocumentClick(event) {
    //   if (this.isOpen && !this.element.nativeElement.contains(event.target)) {
    //     this.isOpen = true;
    //     if (this.selectedValues && this.selectedValues.length === 1 && !this.multiple) {
    //       this.filter = this.selectedValues[0].label;
    //     } else if (this.doNotReset && this.filter !== '') {
    //       this.propagateChange(this.filter);
    //     } else {
    //       this.clearFilter();
    //     }
    //     this.onHide.emit();
    //   }
    // }
    AVShSelectComponent.prototype.updateRows = function (val) {
        if (val === void 0) { val = []; }
        this.rows = val;
    };
    AVShSelectComponent.prototype.filterByIOption = function (array, term, action) {
        if (action === void 0) { action = 'default'; }
        var filteredArr;
        var startsWithArr;
        var includesArr = [];
        filteredArr = this.getFilteredArrOfIOptionItems(array, term, action);
        startsWithArr = filteredArr.filter(function (item) {
            if (Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["startsWith"])(item.label.toLocaleLowerCase(), term) || Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["startsWith"])(item.value.toLocaleLowerCase(), term)) {
                return item;
            }
            else {
                includesArr.push(item);
            }
        });
        startsWithArr = startsWithArr.sort(function (a, b) { return a.label.length - b.label.length; });
        includesArr = includesArr.sort(function (a, b) { return a.label.length - b.label.length; });
        return Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["concat"])(startsWithArr, includesArr);
    };
    AVShSelectComponent.prototype.getFilteredArrOfIOptionItems = function (array, term, action) {
        if (action === FLATTEN_SEARCH_TERM) {
            return array.filter(function (item) {
                var mergedAccounts = _.cloneDeep(item.additional.mergedAccounts.split(',').map(function (a) { return a.trim().toLocaleLowerCase(); }));
                return _.includes(item.label.toLocaleLowerCase(), term) || _.includes(item.additional.uniqueName.toLocaleLowerCase(), term) || _.includes(mergedAccounts, term);
            });
        }
        else {
            return array.filter(function (item) {
                return Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["includes"])(item.label.toLocaleLowerCase(), term) || Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["includes"])(item.value.toLocaleLowerCase(), term);
            });
        }
    };
    AVShSelectComponent.prototype.updateFilter = function (filterProp) {
        var _this = this;
        var lowercaseFilter = filterProp.toLocaleLowerCase();
        if (this.useInBuiltFilterForFlattenAc && this._options) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter, FLATTEN_SEARCH_TERM);
        }
        else if (this._options && this.useInBuiltFilterForIOptionTypeItems) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter);
        }
        else {
            var filteredData = this._options ? this._options.filter(function (item) {
                if (_this.customFilter) {
                    return _this.customFilter(lowercaseFilter, item);
                }
                return !lowercaseFilter || (item.label).toLocaleLowerCase().indexOf(lowercaseFilter) !== -1;
            }) : [];
            if (this.customSorting) {
                this.filteredData = filteredData.sort(this.customSorting);
            }
            else {
                this.filteredData = filteredData.sort(function (a, b) { return a.label.length - b.label.length; });
            }
        }
        if (this.filteredData.length === 0) {
            // this.noOptionsFound.emit(true);
            this.updateRows([{
                    label: 'Create new',
                    value: 'createnewitem'
                }]);
        }
        else {
            this.updateRows(this.filteredData);
        }
    };
    AVShSelectComponent.prototype.clearFilter = function () {
        if (this.filter === '') {
            return;
        }
        this.filter = '';
        if (this.isFilterEnabled) {
            this.updateFilter(this.filter);
        }
    };
    AVShSelectComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    AVShSelectComponent.prototype.toggleSelected = function (item) {
        var callChanges = true;
        if (!item) {
            return;
        }
        this.clearFilter();
        if (!this.multiple) {
            if (this._selectedValues[0] && this._selectedValues[0].value === item.value) {
                callChanges = false;
            }
        }
        if (this.multiple) {
            this.selectMultiple(item);
        }
        else {
            this.selectSingle(item);
        }
        if (callChanges) {
            this.onChange();
        }
    };
    AVShSelectComponent.prototype.selectSingle = function (item) {
        this._selectedValues.splice(0, this.rows.length);
        this._selectedValues.push(item);
        this.hide();
    };
    AVShSelectComponent.prototype.selectMultiple = function (item) {
        if (this.selectedValues.indexOf(item) === -1) {
            this.selectedValues.push(item);
        }
        else {
            this.selectedValues.splice(this.selectedValues.indexOf(item), 1);
        }
    };
    AVShSelectComponent.prototype.focusFilter = function () {
        var _this = this;
        if (this.isFilterEnabled && this.filter && this.filter !== '') {
            // this.updateFilter(this.filter);
        }
        setTimeout(function () {
            _this.renderer.invokeElementMethod(_this.inputFilter.nativeElement, 'focus');
        }, 0);
    };
    AVShSelectComponent.prototype.show = function () {
        var _this = this;
        if (this.isOpen || this.disabled) {
            return;
        }
        this.isOpen = true;
        // this.focusFilter();
        this.onShow.emit();
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
            var item = this.rows.find(function (p) { return p.value === (_this._selectedValues.length > 0 ? _this._selectedValues[0] : (_this.rows.length > 0 ? _this.rows[0].value : null)); });
            if (item !== null) {
                this.menuEle.virtualScrollElm.scrollInto(item);
            }
        }
        this.cdRef.markForCheck();
    };
    AVShSelectComponent.prototype.keydownUp = function (event) {
        var key = event.which;
        if (this.isOpen) {
            if (key === this.KEYS.ESC || key === this.KEYS.TAB || (key === this.KEYS.UP && event.altKey)) {
                this.hide();
            }
            else if (key === this.KEYS.ENTER) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getHighlightedOption();
                    if (item !== null) {
                        this.toggleSelected(item);
                    }
                }
                // this.selectHighlightedOption();
            }
            else if (key === this.KEYS.UP) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getPreviousHilightledOption();
                    if (item !== null) {
                        // this.toggleSelected(item);
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
                // this.optionList.highlightPreviousOption();
                // this.dropdown.moveHighlightedIntoView();
                // if (!this.filterEnabled) {
                //   event.preventDefault();
                // }
            }
            else if (key === this.KEYS.DOWN) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getNextHilightledOption();
                    if (item !== null) {
                        // this.toggleSelected(item);
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
                // ----
                // this.optionList.highlightNextOption();
                // this.dropdown.moveHighlightedIntoView();
                // if (!this.filterEnabled) {
                //   event.preventDefault();
                // }
            }
        }
        this.cdRef.detectChanges();
    };
    AVShSelectComponent.prototype.hide = function (event) {
        if (event) {
            if (event.relatedTarget && (!this.ele.nativeElement.contains(event.relatedTarget))) {
                this.isOpen = false;
                if (this.selectedValues && this.selectedValues.length === 1) {
                    this.filter = this.selectedValues[0].label;
                }
                else {
                    this.clearFilter();
                }
                this.onHide.emit();
            }
        }
        else if (this.isOpen && this.doNotReset && this.filter !== '') {
            this.isOpen = false;
            this.propagateChange(this.filter);
            this.onHide.emit();
        }
        else {
            this.isOpen = false;
            if (this.selectedValues && this.selectedValues.length === 1) {
                this.filter = this.selectedValues[0].label;
            }
            else {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getHighlightedOption();
                    if (item !== null) {
                        this.toggleSelected(item);
                    }
                }
                else {
                    this.clearFilter();
                }
            }
            this.onHide.emit();
        }
        this.cdRef.markForCheck();
    };
    AVShSelectComponent.prototype.filterInputBlur = function (event) {
        if (event.relatedTarget && this.ele.nativeElement) {
            if (this.ele.nativeElement.contains(event.relatedTarget)) {
                return false;
            }
            else if (this.doNotReset && event && event.target && event.target.value) {
                return false;
            }
            else {
                this.hide();
            }
        }
    };
    AVShSelectComponent.prototype.clear = function () {
        if (this.disabled) {
            return;
        }
        this.selectedValues = [];
        this.onChange();
        this.clearFilter();
        this.onClear.emit();
        this.hide();
    };
    AVShSelectComponent.prototype.ngOnInit = function () {
        //
    };
    AVShSelectComponent.prototype.ngAfterViewInit = function () {
        this.viewInitEvent.emit(true);
    };
    AVShSelectComponent.prototype.ngOnChanges = function (changes) {
        if ('forceClearReactive' in changes && !changes.forceClearReactive.firstChange) {
            if (this.forceClearReactive.status) {
                this.filter = '';
                this.clear();
            }
        }
        if ('showList' in changes && changes.showList.currentValue !== changes.showList.previousValue) {
            if (changes.showList.currentValue) {
                this.show();
            }
            else if (!changes.showList.currentValue) {
                this.filter = this.selectedValues[0] ? this.selectedValues[0].label : '';
                this.hide();
            }
        }
        if ('filterText' in changes && changes.filterText.currentValue !== changes.filterText.previousValue) {
            this.updateFilter(changes.filterText.currentValue);
        }
        if ('keydownUpInput' in changes && changes.keydownUpInput.currentValue !== changes.keydownUpInput.previousValue) {
            this.keydownUp(changes.keydownUpInput.currentValue);
        }
    };
    //////// ControlValueAccessor imp //////////
    AVShSelectComponent.prototype.writeValue = function (value) {
        this.selectedValues = value;
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    };
    AVShSelectComponent.prototype.propagateChange = function (_) {
        //
    };
    AVShSelectComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    AVShSelectComponent.prototype.registerOnTouched = function () {
        //
    };
    AVShSelectComponent.prototype.clearSingleSelection = function (event, option) {
        event.stopPropagation();
        this.selectedValues = this.selectedValues.filter(function (f) { return f.value !== option.value; }).map(function (p) { return p.value; });
        this.onChange();
    };
    AVShSelectComponent.prototype.onChange = function () {
        if (this.multiple) {
            var newValues = void 0;
            newValues = this._selectedValues.map(function (p) { return p.value; });
            this.propagateChange(newValues);
            this.selected.emit(this._selectedValues);
        }
        else {
            var newValue = void 0;
            if (this.selectedValues.length > 0) {
                newValue = this.selectedValues[0];
            }
            if (!newValue) {
                newValue = {
                    value: null,
                    label: null,
                    additional: null
                };
            }
            this.filter = newValue.label;
            this.propagateChange(newValue.value);
            this.selected.emit(newValue);
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "idEl", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "placeholder", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "multiple", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "mode", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "showClear", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVShSelectComponent.prototype, "forceClearReactive", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "disabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "notFoundMsg", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "notFoundLinkText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "notFoundLink", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "isFilterEnabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "width", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVShSelectComponent.prototype, "ItemHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVShSelectComponent.prototype, "NoFoundMsgHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVShSelectComponent.prototype, "NoFoundLinkHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], AVShSelectComponent.prototype, "dropdownMinHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function)
    ], AVShSelectComponent.prototype, "customFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function)
    ], AVShSelectComponent.prototype, "customSorting", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "useInBuiltFilterForFlattenAc", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "useInBuiltFilterForIOptionTypeItems", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "doNotReset", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AVShSelectComponent.prototype, "showList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AVShSelectComponent.prototype, "filterText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", KeyboardEvent)
    ], AVShSelectComponent.prototype, "keydownUpInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('inputFilter'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AVShSelectComponent.prototype, "inputFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mainContainer'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AVShSelectComponent.prototype, "mainContainer", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('menuEle'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _virtual_list_menu_component__WEBPACK_IMPORTED_MODULE_4__["AVAccountListComponent"])
    ], AVShSelectComponent.prototype, "menuEle", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ContentChild"])('optionTemplate'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], AVShSelectComponent.prototype, "optionTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dd'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], AVShSelectComponent.prototype, "ele", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AVShSelectComponent.prototype, "onHide", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AVShSelectComponent.prototype, "onShow", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AVShSelectComponent.prototype, "onClear", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVShSelectComponent.prototype, "selected", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVShSelectComponent.prototype, "noOptionsFound", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVShSelectComponent.prototype, "noResultsClicked", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AVShSelectComponent.prototype, "viewInitEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Array])
    ], AVShSelectComponent.prototype, "options", null);
    AVShSelectComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'accounting-virtual-list',
            template: __webpack_require__(/*! ./virtual-list.component.html */ "./src/app/accounting/ng-virtual-list/virtual-list.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            providers: [
                {
                    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"],
                    useExisting: AVShSelectProvider(),
                    multi: true
                }
            ],
            styles: [__webpack_require__(/*! ./virtual-list.component.css */ "./src/app/accounting/ng-virtual-list/virtual-list.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]])
    ], AVShSelectComponent);
    return AVShSelectComponent;
}());

function AVShSelectProvider() {
    return Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["forwardRef"])(function () { return AVShSelectComponent; });
}


/***/ }),

/***/ "./src/app/accounting/ng-virtual-list/virtual-list.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/accounting/ng-virtual-list/virtual-list.module.ts ***!
  \*******************************************************************/
/*! exports provided: AVShSelectModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVShSelectModule", function() { return AVShSelectModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../theme/ng-virtual-select/virtual-scroll */ "./src/app/theme/ng-virtual-select/virtual-scroll.ts");
/* harmony import */ var _virtual_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./virtual-list.component */ "./src/app/accounting/ng-virtual-list/virtual-list.component.ts");
/* harmony import */ var _virtual_list_menu_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./virtual-list-menu.component */ "./src/app/accounting/ng-virtual-list/virtual-list-menu.component.ts");








var AVShSelectModule = /** @class */ (function () {
    function AVShSelectModule() {
    }
    AVShSelectModule_1 = AVShSelectModule;
    AVShSelectModule.forRoot = function () {
        return {
            ngModule: AVShSelectModule_1
        };
    };
    var AVShSelectModule_1;
    AVShSelectModule = AVShSelectModule_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _theme_ng_virtual_select_virtual_scroll__WEBPACK_IMPORTED_MODULE_5__["VirtualScrollModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_4__["ClickOutsideModule"]
            ],
            declarations: [
                _virtual_list_component__WEBPACK_IMPORTED_MODULE_6__["AVShSelectComponent"],
                _virtual_list_menu_component__WEBPACK_IMPORTED_MODULE_7__["AVAccountListComponent"]
            ],
            exports: [_virtual_list_component__WEBPACK_IMPORTED_MODULE_6__["AVShSelectComponent"]]
        })
    ], AVShSelectModule);
    return AVShSelectModule;
}());



/***/ }),

/***/ "./src/app/accounting/tally-service.ts":
/*!*********************************************!*\
  !*** ./src/app/accounting/tally-service.ts ***!
  \*********************************************/
/*! exports provided: TallyModuleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TallyModuleService", function() { return TallyModuleService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");





var TallyModuleService = /** @class */ (function () {
    function TallyModuleService(_toaster) {
        var _this = this;
        this._toaster = _toaster;
        this.selectedPageInfo = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.flattenAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.cashAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.purchaseAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.bankAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.taxAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.expenseAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.salesAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.filteredAccounts = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.selectedFieldType = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.mappingObj = [{
                purchase: {
                    by: ['cash', 'bank', 'currentliabilities'],
                    to: ['expenses']
                },
                sales: {
                    by: ['currentassets', 'currentliabilities'],
                    to: ['income']
                }
            }];
        // public requestData: BehaviorSubject<any> = new BehaviorSubject(new BlankLedgerVM());
        this.requestData = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](null);
        this.transactionObj = {};
        this.selectedFieldType.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) { return p === q; })).subscribe(function (type) {
            if (type && _this.selectedPageInfo.value) {
                var filteredAccounts = void 0;
                if (_this.selectedPageInfo.value.page === 'Journal') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.flattenAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.flattenAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Purchase') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.cashAccounts.value.concat(_this.bankAccounts.value).concat(_this.taxAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.expenseAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Sales') { // Here 1 thing is pending
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Payment') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.flattenAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value.concat(_this.bankAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Contra') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value.concat(_this.bankAccounts.value).concat(_this.taxAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value.concat(_this.bankAccounts.value).concat(_this.taxAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Receipt') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.cashAccounts.value.concat(_this.bankAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.flattenAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Debit note') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.cashAccounts.value.concat(_this.bankAccounts.value).concat(_this.taxAccounts.value));
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.expenseAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
                if (_this.selectedPageInfo.value.page === 'Credit note') {
                    if (type === 'by') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                    else if (type === 'to') {
                        filteredAccounts = _.cloneDeep(_this.salesAccounts.value);
                        _this.filteredAccounts.next(filteredAccounts);
                    }
                }
            }
            else {
                _this.filteredAccounts.next(_this.flattenAccounts.value);
            }
        });
    }
    TallyModuleService.prototype.setVoucher = function (info) {
        this.selectedPageInfo.next(info);
        this.getAccounts();
    };
    TallyModuleService.prototype.setFlattenAccounts = function (accounts) {
        var cashAccounts = [];
        var purchaseAccounts = [];
        var bankAccounts = [];
        var taxAccounts = [];
        var expenseAccounts = [];
        var salesAccounts = [];
        accounts.forEach(function (acc) {
            var cashAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'cash'; });
            if (cashAccount) {
                cashAccounts.push(acc);
            }
            var purchaseAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses'; });
            if (purchaseAccount) {
                purchaseAccounts.push(acc);
            }
            var bankAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'bankaccounts'; });
            if (bankAccount) {
                bankAccounts.push(acc);
            }
            var taxAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'currentliabilities'; });
            if (taxAccount) {
                taxAccounts.push(acc);
            }
            var expenseAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'indirectexpenses' || pg.uniqueName === 'operatingcost'; });
            if (expenseAccount) {
                expenseAccounts.push(acc);
            }
            // pg.uniqueName === 'income'
            var salesAccount = acc.parentGroups.find(function (pg) { return pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities'; });
            if (salesAccount) {
                salesAccounts.push(acc);
            }
        });
        this.cashAccounts.next(cashAccounts);
        this.purchaseAccounts.next(purchaseAccounts);
        this.bankAccounts.next(bankAccounts);
        this.taxAccounts.next(taxAccounts);
        this.expenseAccounts.next(expenseAccounts);
        this.salesAccounts.next(salesAccounts);
        this.flattenAccounts.next(accounts);
        this.filteredAccounts.next(this.flattenAccounts.value);
    };
    TallyModuleService.prototype.getAccounts = function () {
        var accounts = [];
        if (this.selectedPageInfo.value) {
            // console.log('this.selectedPageInfo.value inside service is :', this.selectedPageInfo.value);
            switch (this.selectedPageInfo.value.page) {
                case 'Journal':
                    // accounts = this.flattenAccounts.value;
                    // As discussed with Manish, Cash and Bank account should not come in Journal entry
                    accounts = this.purchaseAccounts.value.concat(this.expenseAccounts.value).concat(this.taxAccounts.value).concat(this.salesAccounts.value);
                    break;
                case 'Purchase':
                    accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.taxAccounts.value);
                    break;
                case 'Sales':
                    accounts = this.bankAccounts.value.concat(this.cashAccounts.value).concat(this.expenseAccounts.value).concat(this.salesAccounts.value);
                    break;
                case 'Credit note':
                    accounts = this.taxAccounts.value.concat(this.salesAccounts.value);
                    break;
                case 'Debit note':
                    accounts = this.purchaseAccounts.value.concat(this.taxAccounts.value).concat(this.expenseAccounts.value);
                    break;
                case 'Payment':
                    accounts = this.flattenAccounts.value;
                    break;
                case 'Receipt':
                    accounts = this.flattenAccounts.value;
                case 'Contra':
                    accounts = this.cashAccounts.value.concat(this.bankAccounts.value);
                    break;
                default:
                    accounts = this.flattenAccounts.value;
            }
            if (accounts && accounts.length) {
                // const endOfLine = {
                //   uniqueName: '_endoflist',
                //   name: 'End Of List',
                //   parentGroups: []
                // };
                // accounts.unshift(endOfLine);
                this.filteredAccounts.next(accounts);
            }
        }
    };
    TallyModuleService.prototype.prepareRequestForAPI = function (data) {
        var requestObj = _.cloneDeep(data);
        var transactions = [];
        // filter transactions which have selected account
        _.each(requestObj.transactions, function (txn) {
            if (txn.inventory && txn.inventory.length) {
                _.each(txn.inventory, function (inv, i) {
                    var obj = null;
                    obj = _.cloneDeep(txn);
                    if (inv.stock.name && inv.amount) {
                        obj.inventory = inv;
                    }
                    else {
                        delete obj.inventory;
                    }
                    // This line is added after all stocks changes
                    obj.amount = obj.inventory ? obj.inventory.amount : obj.amount;
                    transactions.push(obj);
                });
            }
            else {
                delete txn.inventory;
                transactions.push(txn);
            }
        });
        if (transactions.length) {
            requestObj.transactions = transactions;
        }
        return requestObj;
    };
    TallyModuleService.prototype.validateForData = function (data) {
        // console.log('the data in validation fn is :', data);
        var isValid = true;
        switch (data.voucherType) {
            // case 'Purchase':
            //   let debitAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank' || pg.uniqueName === 'currentliabilities');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (debitAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Purchase (debit side).');
            //   }
            //   break;
            // case 'Sales':
            //   let creditAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'income');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (creditAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one income account is required in Sales (credit side).');
            //   }
            //   break;
            //   case 'Debit note':
            //   let debitNoteAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank' || pg.uniqueName === 'currentliabilities');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (debitNoteAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one credit account is required in Debit note (credit side).');
            //   }
            //   break;
            //   case 'Credit note':
            //   let creditNoteAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'income');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (creditNoteAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Credit note (debit side).');
            //   }
            //   break;
            //   case 'Payment':
            //   let paymentAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank');
            //     if (indx !== -1) {
            //       return trxn.type === 'credit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (paymentAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one credit account is required in Payment (credit side).');
            //   }
            //   break;
            //   case 'Receipt':
            //   let receiptAcc = data.transactions.findIndex((trxn) => {
            //     let indx = trxn.selectedAccount.parentGroups.findIndex((pg) => pg.uniqueName === 'cash' || pg.uniqueName === 'bank');
            //     if (indx !== -1) {
            //       return trxn.type === 'debit' ? true : false;
            //     } else {
            //       return false;
            //     }
            //   });
            //   if (receiptAcc === -1) {
            //     isValid = false;
            //     this._toaster.errorToast('At least one debit account is required in Receipt (debit side).');
            //   }
            //   break;
        }
        return isValid;
    };
    TallyModuleService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_toaster_service__WEBPACK_IMPORTED_MODULE_2__["ToasterService"]])
    ], TallyModuleService);
    return TallyModuleService;
}());



/***/ }),

/***/ "./src/app/accounting/voucher-grid/voucher-grid.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/accounting/voucher-grid/voucher-grid.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-10\">\n    <div class=\"col-xs-12 bg_wrap\">\n        <div class=\"row\">\n            <div class=\"clearfix pdT2\">\n                <span class=\"btn label isActive\">{{requestObj.voucherType}}</span>\n                <div class=\"pull-right text-right mrB1\" (clickOutside)=\"showFromDatePicker = false;\">\n                    <input type=\"text\" onReturn #dateField [textMask]=\"{mask: dateMask, guide: true}\" name=\"entryDate\" [(ngModel)]=\"journalDate\" (blur)=\"dateEntered();\" placeholder=\"DD-MM-YYYY\" class=\"form-control text-right voucher-date-field\" (focus)=\"onDateFieldFocus()\"\n                    /> {{ displayDay }}\n                </div>\n            </div>\n            <!-- invoice num -->\n            <!-- <div class=\"clearfix form-inline mrB2\">\n          <div class=\"mx-300 form-group\">\n              <label>Invoice No:</label> <input type=\"text\" placeholder=\"Invoice no.\" [(ngModel)]=\"requestObj.invoiceNumberAgainstVoucher\" class=\"form-control max-height28 appearance_none\" decimalDigitsDirective style=\"max-width:200px\" />\n          </div>\n      </div> -->\n            <!-- /invoice num -->\n            <div class=\"clearfix\" [style.min-height.vh]=\"61\">\n                <div class=\"table-responsive bdrT\">\n                    <table class=\"table entry_table\">\n                        <thead>\n                            <tr>\n                                <th> &nbsp;</th>\n                                <th>Particulars</th>\n                                <th [style.min-width.px]=\"140\" [style.width.px]=\"140\" class=\"text-right\">Debit</th>\n                                <th [style.min-width.px]=\"140\" [style.width.px]=\"140\" class=\"text-right\">Credit</th>\n                            </tr>\n                        </thead>\n                        <br/>\n                        <tbody (clickOutside)=\"hideListItems()\">\n                            <tr *ngFor=\"let transaction of requestObj.transactions;let i=index;let l=last\" [ngClass]=\"{'activeRow': (isSelectedRow && selectedIdx === i) || (!selectedIdx && !isSelectedRow && i == 0)}\">\n                                <td [style.width.px]=\"40\"><input onReturn type=\"text\" class=\"form-control txtCpc byTo\" [disabled]=\"i === 0 && !isFirstRowDeleted\" (ngModel)=\"transaction.type\" (ngModelChange)=\"selectEntryType(transaction, $event, i)\" (focus)=\"selectRow(true,i);hideListItems()\"\n                                        [ngClass]=\"{'focus': isSelectedRow && selectedIdx === i}\" value=\"{{ transaction.type | lowercase }}\" maxlength=\"2\" /></td>\n                                <td><input onReturn id=\"first_element_{{i}}\" type=\"text\" class=\"form-control from-or-to-acc\" #particular [required]=\"transaction.amount\" [(ngModel)]=\"transaction.selectedAccount.account\" (keyup)=\"searchAccount($event?.target?.value);\"\n                                        (focus)=\"onAccountFocus($event, transaction.type === 'by' ? amountField1 : amountField2, transaction.type, i);\" (blur)=\"onAccountBlur($event);\" [ngClass]=\"{'focus': isSelectedRow && selectedIdx === i}\" (keydown)=\"detectKey($event)\"\n                                        (keydown.Tab)=\"validateAccount(transaction, $event, i)\" (keydown.arrowDown)=\"openCreateAccountPopupIfRequired($event)\">\n                                    <!-- *ngIf=\"transaction.inventory\" -->\n                                    <!-- [hidden]=\"!transaction.stocks\" Alok Sir -->\n                                    <table>\n                                        <tbody>\n                                            <ng-container *ngIf=\"transaction.inventory && transaction.inventory.length\">\n                                                <tr *ngFor=\"let inventory of transaction.inventory;let idx=index;let l=last\" [ngClass]=\"{'activeRow': isSelectedRow && selectedStockIdx === idx && selectedIdx === i}\">\n                                                    <!-- #Item \" -->\n                                                    <td colspan=\"\" [style.width.px]=\"250\"><input onReturn (keydown)=\"detectKey($event)\" (keydown.Tab)=\"addNewEntry(transaction.amount,transaction, i)\" (keyup)=\"searchStock($event?.target?.value);\" type=\"text\" placeholder=\"Type to search stock\"\n                                                            class=\"form-control stock-field\" [(ngModel)]=\"inventory.stock.name\" [ngClass]=\"{'focus': isSelectedRow && selectedStockIdx === idx}\" (focus)=\"onStockFocus($event,idx, i);\" (blur)=\"onStockBlur(qty);\"\n                                                        /></td>\n                                                    <td>\n                                                        <input onReturn [disabled]=\"!inventory.stock.name\" type=\"text\" #qty placeholder=\"Quantity\" class=\"form-control text-right\" [(ngModel)]=\"inventory.quantity\" (ngModelChange)=\"changeQuantity(idx, inventory.quantity)\" [ngClass]=\"{'focus': isSelectedRow && selectedStockIdx === idx}\"\n                                                            decimalDigitsDirective [DecimalPlaces]=\"2\" (focus)=\"selectedIdx = i\" />\n                                                    </td>\n                                                    <td>\n\n                                                        <input onReturn type=\"text\" [disabled]=\"!inventory.stock.name\" placeholder=\"Rate\" class=\"form-control text-right\" [(ngModel)]=\"inventory.unit.rate\" (ngModelChange)=\"changePrice(idx, inventory.unit.rate)\" (focus)=\"selectedStockIdx = idx;selectedIdx = i;\"\n                                                            [ngClass]=\"{'focus': isSelectedRow && selectedStockIdx === idx}\" decimalDigitsDirective [DecimalPlaces]=\"2\" />\n                                                    </td>\n                                                    <td>\n                                                        <input type=\"text\" placeholder=\"Unit\" class=\"form-control text-left\" [(ngModel)]=\"inventory.unit.stockUnitCode\" [readonly]=\"true\" (focus)=\"selectedStockIdx = idx; selectedIdx = i;\" [disabled]=\"!inventory.stock.name\" />\n                                                    </td>\n                                                    <td>\n                                                        <input onReturn type=\"text\" [disabled]=\"!inventory.stock.name\" placeholder=\"Total\" class=\"form-control text-right\" #toAmountField [(ngModel)]=\"inventory.amount\" (focus)=\"selectedStockIdx = idx;selectedIdx = i;\" [ngClass]=\"{'focus': isSelectedRow && selectedStockIdx === idx}\"\n                                                            (ngModelChange)=\"amountChanged(idx)\" (keydown.Tab)=\"validateAndAddNewStock(idx)\" (keyup.Enter)=\"validateAndAddNewStock(idx)\" decimalDigitsDirective [DecimalPlaces]=\"2\" />\n                                                    </td>\n                                                </tr>\n                                            </ng-container>\n                                        </tbody>\n                                    </table>\n                                </td>\n                                <!-- (blur)=\"onAccountBlur();selectRow(false,null)\"  -->\n                                <td>\n                                    <input onReturn [disabled]=\"!transaction.selectedAccount.name || transaction.type !== 'by'\" [hidden]=\"transaction.type !== 'by'\" type=\"text\" class=\"form-control text-right debit-credit\" #byAmountField decimalDigitsDirective #amountField1 [DecimalPlaces]=\"2\"\n                                        [(ngModel)]=\"transaction.amount\" (focus)=\"selectRow(true,i);hideListItems()\" (keydown.Enter)=\"addNewEntry(transaction.amount,transaction, i)\" (blur)=\"addNewEntry(transaction.amount,transaction, i);\" [ngClass]=\"{'focus': isSelectedRow && selectedIdx === i}\"\n                                        [disabled]=\"transaction.stocks && transaction.stocks.length && transaction.amount\" (ngModelChange)=\"calModAmt(transaction.amount, transaction, i)\" />\n                                </td>\n                                <td>\n                                    <input onReturn [disabled]=\"!transaction.selectedAccount.name || transaction.type !== 'to'\" [hidden]=\"transaction.type !== 'to'\" type=\"text\" class=\"form-control text-right debit-credit\" #toAmountField decimalDigitsDirective #amountField2 [DecimalPlaces]=\"2\"\n                                        [(ngModel)]=\"transaction.amount\" (focus)=\"selectRow(true,i);hideListItems()\" (keydown.Enter)=\"addNewEntry(transaction.amount,transaction, i)\" (blur)=\"addNewEntry(transaction.amount,transaction, i);\" [ngClass]=\"{'focus': isSelectedRow && selectedIdx === i}\"\n                                        [disabled]=\"transaction.stocks && transaction.stocks.length  && transaction.amount\" (ngModelChange)=\"calModAmt(transaction.amount, transaction, i)\" />\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n\n            <div class=\"clearfix\">\n                <div class=\"col-xs-4\">\n                    <div class=\"form-group\">\n                        <label>Narration:</label>\n                        <textarea #narrationBox onReturn id=\"narration\" class=\"form-control\" name=\"narration\" (keyup.enter)=\"openConfirmBox(submitButton)\" (keydown.tab)=\"openConfirmBox(submitButton)\" [(ngModel)]=\"requestObj.description\" resize=\"false\" rows=\"6\"></textarea>\n                    </div>\n                </div>\n\n                <div [hidden]=\"!showConfirmationBox\" class=\"confirmation_box bdr text-center pd2\">\n                    <div class=\"\">\n                        <h1>Accept?</h1>\n                        <div class=\"pdT2\">\n                            <button class=\"btn btn-primary\" #submitButton (keyup)=\"keyUpOnSubmitButton($event)\" (click)=\"saveEntry();\">Yes</button>\n                            <button class=\"btn btn-default\" #resetButton (keyup)=\"keyUpOnResetButton($event)\">No</button>\n                            <br/>\n                            <button class=\"btn btn-link mrT1\" (click)=\"refreshEntry();\">Reset</button>\n\n                        </div>\n                    </div>\n                </div>\n                <div class=\"total_box text-right pull-right\">\n                    <span><strong>{{totalDebitAmount | number: '1.2-2' }}</strong></span>\n                    <span><strong>{{totalCreditAmount | number: '1.2-2' }}</strong></span>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"sidebar_list form-control\" [hidden]=\"!showLedgerAccountList\">\n        <h3 class=\"pd1 bdrB primary_clr\" *ngIf=\"selectedField === 'account'\">List of Ledger Accounts</h3>\n        <h3 class=\"pd1 bdrB primary_clr\" *ngIf=\"selectedField === 'stock'\">List of Stock Items</h3>\n        <!-- (noToggleClick)=\"toggleSelected($event)\" (noResultClicked)=\"noResultsClicked.emit(); hide()\" [noResultLinkEnabled]=\"notFoundLink\" [notFoundMsg]=\"notFoundMsg\" [notFoundLinkText]=\"notFoundLinkText\" [ItemHeight]=\"ItemHeight\" [NoFoundMsgHeight]=\"NoFoundMsgHeight\" [NoFoundLinkHeight]=\"NoFoundLinkHeight\" [dropdownMinHeight]=\"dropdownMinHeight\"-->\n        <accounting-virtual-list [keydownUpInput]=\"keyUpDownEvent\" [filterText]=\"filterByText\" [options]=\"inputForList\" [showList]=\"showLedgerAccountList\" [isFilterEnabled]=\"true\" (selected)=\"onItemSelected($event)\" [(ngModel)]=\"currentSelectedValue\" [placeholder]=\"'Select Option'\"\n            [notFoundLink]=\"selectedField === 'account'\" (noResultsClicked)=\"showQuickAccountModal()\" [multiple]=\"false\" [ItemHeight]=\"33\" (noOptionsFound)=\"onNoAccountFound($event)\"></accounting-virtual-list>\n    </div>\n\n</div>\n\n<!--quick account popup -->\n<div bsModal #quickAccountModal=\"bs-modal\" [config]=\"{ backdrop: false }\" class=\"modal\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\" style=\"width: 298px\">\n        <div class=\"modal-content\">\n            <div element-view-container-ref #quickAccountComponent=\"elementviewcontainerref\"></div>\n        </div>\n    </div>\n</div>\n\n\n<!-- Cheque Detail Modal-->\n<div bsModal #chequeEntryModal=\"bs-modal\" [config]=\"{ backdrop: 'static' }\" class=\"modal\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\" style=\"width: 298px\">\n        <div class=\"modal-content\">\n            <form autocomplete=\"off\" novalidate name=\"chequeDetailForm\" [formGroup]=\"chequeDetailForm\" class=\"newAccounform\" (submit)=\"onSubmitChequeDetail()\">\n                <div class=\"modal-header\">\n                    <h3 class=\"modal-title\">Cheque details (if any)</h3>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"clearfix mrT1\">\n                        <label>Cheque Number:</label>\n                        <input #chequeNumberInput class=\"form-control\" required formControlName=\"chequeNumber\" name=\"account\" type=\"text\" placeholder=\"Cheque Number\" (keydown)=\"onCheckNumberFieldKeyDown($event, 'chqNumber')\">\n                    </div>\n                    <div class=\"clearfix mrT1\">\n                        <label>Cheque Clearance Date:</label>\n                        <input #chequeClearanceDateInput [textMask]=\"{mask: dateMask, guide: true}\" class=\"form-control\" formControlName=\"chequeClearanceDate\" name=\"account\" type=\"text\" placeholder=\"Cheque Clearance Date\" (keydown)=\"onCheckNumberFieldKeyDown($event, 'chqDate')\">\n                    </div>\n                </div>\n                <div class=\"modal-footer\">\n                    <!-- [disabled]=\"chequeDetailForm.invalid\" -->\n                    <button #chqFormSubmitBtn type=\"submit\" class=\"btn btn-success\">Create</button>\n                    <button type=\"button\" class=\"btn btn-default\" (click)=\"closeChequeDetailForm()\">Cancel</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n\n<div class=\"aside-overlay\" (click)=\"closeCreateStock($event)\" *ngIf=\"asideMenuStateForProductService === 'in'\"></div>\n<aside-inventory-stock-group [autoFocus]=\"autoFocusStockGroupField\" (closeAsideEvent)=\"closeCreateStock()\" [class]=\"asideMenuStateForProductService\" [@slideInOut]=\"asideMenuStateForProductService\"></aside-inventory-stock-group>"

/***/ }),

/***/ "./src/app/accounting/voucher-grid/voucher-grid.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/accounting/voucher-grid/voucher-grid.component.ts ***!
  \*******************************************************************/
/*! exports provided: AccountAsVoucherComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountAsVoucherComponent", function() { return AccountAsVoucherComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var apps_web_giddh_src_app_services_inventory_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _theme_ng2_vs_for_ng2_vs_for__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../theme/ng2-vs-for/ng2-vs-for */ "./src/app/theme/ng2-vs-for/ng2-vs-for.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _keyboard_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../keyboard.service */ "./src/app/accounting/keyboard.service.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var apps_web_giddh_src_app_actions_fly_accounts_actions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/fly-accounts.actions */ "./src/app/actions/fly-accounts.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var apps_web_giddh_src_app_accounting_tally_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/accounting/tally-service */ "./src/app/accounting/tally-service.ts");
/* harmony import */ var _models_api_models_Account__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../models/api-models/Account */ "./src/app/models/api-models/Account.ts");
/* harmony import */ var _theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../theme/quick-account-component/quickAccount.component */ "./src/app/theme/quick-account-component/quickAccount.component.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");























var TransactionsType = [
    { label: 'By', value: 'Debit' },
    { label: 'To', value: 'Credit' },
];
var CustomShortcode = [
    { code: 'F9', route: 'purchase' }
];
var AccountAsVoucherComponent = /** @class */ (function () {
    function AccountAsVoucherComponent(_accountService, _ledgerActions, store, _keyboardService, flyAccountActions, _toaster, _router, _tallyModuleService, componentFactoryResolver, inventoryService, fb) {
        var _this = this;
        this._accountService = _accountService;
        this._ledgerActions = _ledgerActions;
        this.store = store;
        this._keyboardService = _keyboardService;
        this.flyAccountActions = flyAccountActions;
        this._toaster = _toaster;
        this._router = _router;
        this._tallyModuleService = _tallyModuleService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.inventoryService = inventoryService;
        this.fb = fb;
        this.showAccountList = new _angular_core__WEBPACK_IMPORTED_MODULE_12__["EventEmitter"]();
        this.showLedgerAccountList = false;
        this.selectedInput = 'by';
        this.requestObj = {};
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.showConfirmationBox = false;
        this.moment = moment__WEBPACK_IMPORTED_MODULE_14__;
        this.showFromDatePicker = false;
        this.navigateURL = CustomShortcode;
        this.showStockList = false;
        this.activeIndex = 0;
        this.displayDay = '';
        this.dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.totalDiffAmount = 0;
        this.voucherType = null;
        this.currentSelectedValue = '';
        this.filterByText = '';
        this.asideMenuStateForProductService = 'out';
        this.isFirstRowDeleted = false;
        this.autoFocusStockGroupField = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_10__["ReplaySubject"](1);
        this.isNoAccFound = false;
        this.isComponentLoaded = false;
        this.requestObj.transactions = [];
        this._keyboardService.keyInformation.subscribe(function (key) {
            _this.watchKeyboardEvent(key);
        });
        this._tallyModuleService.selectedPageInfo.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) {
            if (p && q) {
                return (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["isEqual"](p, q));
            }
            if ((p && !q) || (!p && q)) {
                return false;
            }
            return true;
        })).subscribe(function (d) {
            if (d && d.gridType === 'voucher') {
                _this.requestObj.voucherType = d.page;
                setTimeout(function () {
                    // document.getElementById('first_element_0').focus();
                    _this.dateField.nativeElement.focus();
                }, 50);
            }
            else if (d) {
                _this._tallyModuleService.requestData.next(_this.requestObj);
            }
        });
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AccountAsVoucherComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.chequeDetailForm = this.fb.group({
            chequeClearanceDate: [''],
            chequeNumber: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]]
        }),
            this._tallyModuleService.requestData.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(function (p, q) {
                if (p && q) {
                    return (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["isEqual"](p, q));
                }
                if ((p && !q) || (!p && q)) {
                    return false;
                }
                return true;
            })).subscribe(function (data) {
                if (data) {
                    _this.requestObj = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](data);
                }
            });
        this.store.select(function (p) { return p.ledger.ledgerCreateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this._toaster.successToast('Entry created successfully', 'Success');
                _this.refreshEntry();
                _this.store.dispatch(_this._ledgerActions.ResetLedger());
                _this.requestObj.description = '';
                _this.dateField.nativeElement.focus();
            }
        });
        this.refreshEntry();
        // this._tallyModuleService.selectedPageInfo.distinctUntilChanged((p, q) => {
        //   if (p && q) {
        //     return (_.isEqual(p, q));
        //   }
        //   if ((p && !q) || (!p && q)) {
        //     return false;
        //   }
        //   return true;
        //  }).subscribe(() => {
        // });
        this._tallyModuleService.filteredAccounts.subscribe(function (accounts) {
            if (accounts) {
                var accList_1 = [];
                accounts.forEach(function (acc) {
                    accList_1.push({ label: acc.name + " (" + acc.uniqueName + ")", value: acc.uniqueName, additional: acc });
                });
                _this.flattenAccounts = accList_1;
                _this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](_this.flattenAccounts);
            }
        });
        this.createStockSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (yesOrNo) {
            if (yesOrNo) {
                _this.asideMenuStateForProductService = 'out';
                _this.autoFocusStockGroupField = false;
                _this.getStock(null, null, true);
                setTimeout(function () {
                    _this.dateField.nativeElement.focus();
                }, 1000);
            }
        });
    };
    AccountAsVoucherComponent.prototype.ngOnChanges = function (c) {
        if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
            this.showFromDatePicker = c.openDatePicker.currentValue;
            this.dateField.nativeElement.focus();
        }
        if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
            if (c.openCreateAccountPopup.currentValue) {
                this.showQuickAccountModal();
            }
        }
        if ('saveEntryOnCtrlA' in c && c.saveEntryOnCtrlA.currentValue !== c.saveEntryOnCtrlA.previousValue) {
            if (c.saveEntryOnCtrlA.currentValue) {
                this.saveEntry();
            }
        }
    };
    /**
     * newEntryObj() to push new entry object
     */
    AccountAsVoucherComponent.prototype.newEntryObj = function (byOrTo) {
        if (byOrTo === void 0) { byOrTo = 'to'; }
        this.requestObj.transactions.push({
            amount: null,
            particular: '',
            applyApplicableTaxes: false,
            isInclusiveTax: false,
            type: byOrTo,
            taxes: [],
            total: null,
            discounts: [],
            inventory: [],
            selectedAccount: {
                name: '',
                UniqueName: '',
                groupUniqueName: '',
                account: ''
            }
        });
    };
    /**
     * initInventory
     */
    AccountAsVoucherComponent.prototype.initInventory = function () {
        return {
            unit: {
                stockUnitCode: '',
                code: '',
                rate: null,
            },
            quantity: null,
            stock: {
                uniqueName: '',
                name: '',
            },
            amount: null
        };
    };
    /**
     * selectRow() on entryObj focus/blur
     */
    AccountAsVoucherComponent.prototype.selectRow = function (type, idx) {
        this.isSelectedRow = type;
        this.selectedIdx = idx;
        this.showLedgerAccountList = false;
    };
    /**
     * selectEntryType() to validate Type i.e BY/TO
     */
    AccountAsVoucherComponent.prototype.selectEntryType = function (transactionObj, val, idx) {
        val = val.trim();
        if (val.length === 2 && (val.toLowerCase() !== 'to' && val.toLowerCase() !== 'by')) {
            this._toaster.errorToast("Spell error, you can only use 'To/By'");
            transactionObj.type = 'to';
        }
        else {
            transactionObj.type = val;
        }
    };
    /**
     * onAccountFocus() to show accountList
     */
    AccountAsVoucherComponent.prototype.onAccountFocus = function (ev, elem, trxnType, indx) {
        var _this = this;
        this.selectedAccountInputField = ev.target;
        this.selectedField = 'account';
        this.showConfirmationBox = false;
        this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.flattenAccounts);
        this.selectedParticular = elem;
        this.selectRow(true, indx);
        this.filterAccount(trxnType);
        setTimeout(function () {
            _this.showLedgerAccountList = true;
        }, 200);
    };
    AccountAsVoucherComponent.prototype.onStockFocus = function (ev, stockIndx, indx) {
        var _this = this;
        this.selectedStockInputField = ev.target;
        this.showConfirmationBox = false;
        this.selectedStockIdx = stockIndx;
        this.selectedIdx = indx;
        this.getStock(this.groupUniqueName);
        this.getStock();
        this.showLedgerAccountList = true;
        setTimeout(function () {
            _this.selectedField = 'stock';
        }, 100);
    };
    /**
     * onAccountBlur to hide accountList
     */
    AccountAsVoucherComponent.prototype.onAccountBlur = function (ev) {
        this.arrowInput = { key: 0 };
        // this.showStockList.next(true);
        if (this.accountSearch) {
            this.searchAccount('');
            this.accountSearch = '';
        }
        // if (ev.type === 'blur') {
        //   this.showLedgerAccountList = false;
        //   this.showStockList = false;
        // }
        // this.showAccountList.emit(false);
    };
    AccountAsVoucherComponent.prototype.openCreateAccountPopupIfRequired = function (e) {
        if (e && this.isNoAccFound) {
            // this.showQuickAccountModal();
        }
    };
    AccountAsVoucherComponent.prototype.onDateFieldFocus = function () {
        var _this = this;
        setTimeout(function () {
            _this.showLedgerAccountList = false;
            _this.showStockList = false;
        }, 100);
    };
    AccountAsVoucherComponent.prototype.onAmountFieldBlur = function (ev) {
        //
    };
    AccountAsVoucherComponent.prototype.onSubmitChequeDetail = function () {
        var _this = this;
        var chequeDetails = this.chequeDetailForm.value;
        this.requestObj.chequeNumber = chequeDetails.chequeNumber;
        this.requestObj.chequeClearanceDate = chequeDetails.chequeClearanceDate;
        this.closeChequeDetailForm();
        setTimeout(function () {
            _this.selectedParticular.focus();
        }, 10);
    };
    AccountAsVoucherComponent.prototype.closeChequeDetailForm = function () {
        this.chequeEntryModal.hide();
    };
    AccountAsVoucherComponent.prototype.openChequeDetailForm = function (account) {
        var _this = this;
        this.chequeEntryModal.show();
        return setTimeout(function () {
            _this.chequeNumberInput.nativeElement.focus();
        }, 200);
    };
    /**
     * setAccount` in particular, on accountList click
     */
    AccountAsVoucherComponent.prototype.setAccount = function (acc) {
        if (acc.parentGroups.find(function (pg) { return pg.uniqueName === 'bankaccounts'; }) && (!this.requestObj.chequeNumber && !this.requestObj.chequeClearanceDate)) {
            this.openChequeDetailForm(acc);
        }
        var idx = this.selectedIdx;
        var transaction = this.requestObj.transactions[idx];
        if (acc) {
            var accModel = {
                name: acc.name,
                UniqueName: acc.uniqueName,
                groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1].uniqueName,
                account: acc.name,
                parentGroups: acc.parentGroups
            };
            transaction.particular = accModel.UniqueName;
            transaction.selectedAccount = accModel;
            transaction.stocks = acc.stocks;
            // tally difference amount
            transaction.amount = this.calculateDiffAmount(transaction.type);
            transaction.amount = transaction.amount ? transaction.amount : null;
            if (acc) {
                this.groupUniqueName = accModel.groupUniqueName;
                this.selectAccUnqName = acc.uniqueName;
                var len = this.requestObj.transactions[idx].inventory ? this.requestObj.transactions[idx].inventory.length : 0;
                if (!len || this.requestObj.transactions[idx].inventory && this.requestObj.transactions[idx].inventory[len - 1].stock.uniqueName) {
                    this.requestObj.transactions[idx].inventory.push(this.initInventory());
                }
            }
            // Alok Sir
            // if (acc && acc.stocks) {
            //   this.groupUniqueName = accModel.groupUniqueName;
            //   this.selectAccUnqName = acc.uniqueName;
            //   this.requestObj.transactions[idx].inventory.push(this.initInventory());
            // } else if (!acc.stocks) {
            //   setTimeout(() => {
            //     this.selectedParticular.focus();
            //   }, 200);
            // }
        }
        else {
            this.deleteRow(idx);
        }
    };
    /**
     * searchAccount in accountList
     */
    AccountAsVoucherComponent.prototype.searchAccount = function (str) {
        this.filterByText = str;
        // this.accountSearch = str;
    };
    AccountAsVoucherComponent.prototype.searchStock = function (str) {
        this.filterByText = str;
        // this.accountSearch = str;
    };
    AccountAsVoucherComponent.prototype.onStockBlur = function (qty) {
        this.selectedStk = qty;
        this.filterByText = '';
        this.showLedgerAccountList = false;
    };
    /**
     * onAmountField() on amount, event => Blur, Enter, Tab
     */
    AccountAsVoucherComponent.prototype.addNewEntry = function (amount, transactionObj, idx) {
        var indx = idx;
        var reqField = document.getElementById("first_element_" + (idx - 1));
        var lastIndx = this.requestObj.transactions.length - 1;
        if (amount === 0 || amount === '0') {
            if (idx === 0) {
                this.isFirstRowDeleted = true;
            }
            else {
                this.isFirstRowDeleted = false;
            }
            this.requestObj.transactions.splice(indx, 1);
            if (reqField === null) {
                this.dateField.nativeElement.focus();
            }
            else {
                reqField.focus();
            }
            if (!this.requestObj.transactions.length) {
                this.newEntryObj('by');
            }
        }
        else {
            this.calModAmt(amount, transactionObj, indx);
        }
    };
    AccountAsVoucherComponent.prototype.calModAmt = function (amount, transactionObj, indx) {
        var lastIndx = this.requestObj.transactions.length - 1;
        transactionObj.amount = Number(amount);
        transactionObj.total = transactionObj.amount;
        if (indx === lastIndx && this.requestObj.transactions[indx].selectedAccount.name) {
            this.newEntryObj();
        }
        var debitTransactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["filter"](this.requestObj.transactions, function (o) { return o.type === 'by'; });
        this.totalDebitAmount = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["sumBy"](debitTransactions, function (o) { return Number(o.amount); });
        var creditTransactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["filter"](this.requestObj.transactions, function (o) { return o.type === 'to'; });
        this.totalCreditAmount = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["sumBy"](creditTransactions, function (o) { return Number(o.amount); });
    };
    /**
     * openConfirmBox() to save entry
     */
    AccountAsVoucherComponent.prototype.openConfirmBox = function (submitBtnEle) {
        var _this = this;
        this.showLedgerAccountList = false;
        this.showStockList = false;
        if (this.requestObj.transactions.length > 2) {
            this.showConfirmationBox = true;
            if (this.requestObj.description.length > 1) {
                this.requestObj.description = this.requestObj.description.replace(/(?:\r\n|\r|\n)/g, '');
                setTimeout(function () {
                    submitBtnEle.focus();
                }, 100);
            }
        }
        else {
            this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
    };
    /**
     * saveEntry
     */
    AccountAsVoucherComponent.prototype.saveEntry = function () {
        var _this = this;
        var idx = 0;
        var data = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.requestObj);
        var voucherType = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["clone"](data.voucherType);
        data.entryDate = this.journalDate;
        // data.transactions = this.removeBlankTransaction(data.transactions);
        data.transactions = this.validateTransaction(data.transactions);
        if (!data.transactions) {
            return;
        }
        var foundContraEntry = this.validateForContraEntry(data);
        var foundSalesAndBankEntry = this.validateForSalesAndPurchaseEntry(data);
        if (foundContraEntry && data.voucherType !== 'Contra') {
            this._toaster.errorToast('Contra entry (Cash + Bank), not allowed in ' + data.voucherType, 'Error');
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
        if (!foundContraEntry && data.voucherType === 'Contra') {
            this._toaster.errorToast('There should be Cash and Bank entry in contra.', 'Error');
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
        // This suggestion was given by Sandeep
        if (foundSalesAndBankEntry && data.voucherType === 'Journal') {
            this._toaster.errorToast('Sales and Purchase entry not allowed in journal.', 'Error');
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
        if (this.totalCreditAmount === this.totalDebitAmount) {
            if (this.validatePaymentAndReceipt(data)) {
                apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["forEach"](data.transactions, function (element) {
                    element.type = (element.type === 'by') ? 'credit' : 'debit';
                });
                var accUniqueName_1 = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["maxBy"](data.transactions, function (o) { return o.amount; }).selectedAccount.UniqueName;
                var indexOfMaxAmountEntry = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["findIndex"](data.transactions, function (o) { return o.selectedAccount.UniqueName === accUniqueName_1; });
                data.transactions.splice(indexOfMaxAmountEntry, 1);
                data = this._tallyModuleService.prepareRequestForAPI(data);
                this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName_1));
            }
            else {
                var byOrTo = data.voucherType === 'Payment' ? 'to' : 'by';
                this._toaster.errorToast('Please select at least one cash or bank account in ' + byOrTo.toUpperCase(), 'Error');
                setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
            }
        }
        else {
            this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
            setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
    };
    AccountAsVoucherComponent.prototype.validateForContraEntry = function (data) {
        var debitEntryWithCashOrBank = data.transactions.find(function (trxn) { return (trxn.type === 'by' && trxn.selectedAccount.parentGroups.find(function (pg) { return (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash'); })); });
        var creditEntryWithCashOrBank = data.transactions.find(function (trxn) { return (trxn.type === 'to' && trxn.selectedAccount.parentGroups.find(function (pg) { return (pg.uniqueName === 'bankaccounts' || pg.uniqueName === 'cash'); })); });
        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        }
        else {
            return false;
        }
    };
    AccountAsVoucherComponent.prototype.validateForSalesAndPurchaseEntry = function (data) {
        var debitEntryWithCashOrBank = data.transactions.find(function (trxn) { return (trxn.type === 'by' && trxn.selectedAccount.parentGroups.find(function (pg) { return (pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses'); })); });
        var creditEntryWithCashOrBank = data.transactions.find(function (trxn) { return (trxn.type === 'to' && trxn.selectedAccount.parentGroups.find(function (pg) { return (pg.uniqueName === 'revenuefromoperations' || pg.uniqueName === 'currentassets' || pg.uniqueName === 'currentliabilities' || pg.uniqueName === 'purchases' || pg.uniqueName === 'directexpenses'); })); });
        if (debitEntryWithCashOrBank && creditEntryWithCashOrBank) {
            return true;
        }
        else {
            return false;
        }
    };
    AccountAsVoucherComponent.prototype.validatePaymentAndReceipt = function (data) {
        if (data.voucherType === 'Payment' || data.voucherType === 'Receipt') {
            var byOrTo_1 = data.voucherType === 'Payment' ? 'to' : 'by';
            var toAccounts = data.transactions.filter(function (acc) { return acc.type === byOrTo_1; });
            var AccountOfCashOrBank = toAccounts.filter(function (acc) {
                var indexOfCashOrBank = acc.selectedAccount.parentGroups.findIndex(function (pg) { return pg.uniqueName === 'cash' || pg.uniqueName === 'bankaccounts'; });
                return indexOfCashOrBank !== -1 ? true : false;
            });
            return (AccountOfCashOrBank && AccountOfCashOrBank.length) ? true : false;
        }
        else {
            return true; // By pass all other
        }
    };
    /**
     * refreshEntry
     */
    AccountAsVoucherComponent.prototype.refreshEntry = function () {
        var _this = this;
        this.requestObj.transactions = [];
        this.showConfirmationBox = false;
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
        this.requestObj.entryDate = moment__WEBPACK_IMPORTED_MODULE_14__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_4__["GIDDH_DATE_FORMAT"]);
        this.journalDate = moment__WEBPACK_IMPORTED_MODULE_14__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_4__["GIDDH_DATE_FORMAT"]);
        this.requestObj.description = '';
        this.dateField.nativeElement.focus();
        setTimeout(function () {
            _this.newEntryObj();
            _this.requestObj.transactions[0].type = 'by';
        }, 100);
    };
    /**
     * after init
     */
    AccountAsVoucherComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.isComponentLoaded = true;
        setTimeout(function () {
            _this.isNoAccFound = false;
        }, 3000);
        setTimeout(function () {
            _this.refreshEntry();
        }, 200);
    };
    /**
     * ngOnDestroy() on component destroy
     */
    AccountAsVoucherComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * setDate
     */
    AccountAsVoucherComponent.prototype.setDate = function (date) {
        this.showFromDatePicker = !this.showFromDatePicker;
        this.requestObj.entryDate = moment__WEBPACK_IMPORTED_MODULE_14__(date).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_4__["GIDDH_DATE_FORMAT"]);
    };
    /**
     * watchMenuEvent
     */
    AccountAsVoucherComponent.prototype.watchKeyboardEvent = function (event) {
        if (event) {
            var navigateTo = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["find"](this.navigateURL, function (o) { return o.code === event.key; });
            if (navigateTo) {
                this._router.navigate(['accounting', navigateTo.route]);
            }
        }
    };
    /**
     * removeBlankTransaction
     */
    AccountAsVoucherComponent.prototype.removeBlankTransaction = function (transactions) {
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["forEach"](transactions, function (obj, idx) {
            if (obj && !obj.particular && !obj.amount) {
                transactions = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["without"](transactions, obj);
            }
        });
        return transactions;
    };
    /**
     * validateTransaction
     */
    AccountAsVoucherComponent.prototype.validateTransaction = function (transactions) {
        var _this = this;
        var validEntry = this.removeBlankTransaction(transactions);
        var entryIsValid = true;
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["forEach"](validEntry, function (obj, idx) {
            if (obj.particular && !obj.amount) {
                obj.amount = 0;
            }
            else if (obj && !obj.particular) {
                this.entryIsValid = false;
                return false;
            }
        });
        if (entryIsValid) {
            return validEntry;
        }
        else {
            this._toaster.errorToast("Particular can't be blank");
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 500);
        }
    };
    /**
     * openStockList
     */
    AccountAsVoucherComponent.prototype.openStockList = function () {
        this.showLedgerAccountList = false;
        this.showStockList = true;
        // this.showStockList.next(true);
    };
    /**
     * onSelectStock
     */
    AccountAsVoucherComponent.prototype.onSelectStock = function (item) {
        if (item) {
            // console.log(item);
            var idx = this.selectedStockIdx;
            var entryItem = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](item);
            this.prepareEntry(entryItem, this.selectedIdx);
            // setTimeout(() => {
            //   this.selectedStk.focus();
            //   this.showStockList = false;
            // }, 50);
        }
        else {
            this.requestObj.transactions[this.selectedIdx].inventory.splice(this.selectedStockIdx, 1);
        }
    };
    /**
     * prepareEntry
     */
    AccountAsVoucherComponent.prototype.prepareEntry = function (item, idx) {
        var i = this.selectedStockIdx;
        if (item && item.stockUnit) {
            var defaultUnit = {
                stockUnitCode: item.stockUnit.name,
                code: item.stockUnit.code,
                rate: 0
            };
            // this.requestObj.transactions[idx].inventory[i].unit.rate = item.rate;
            //Check if the Unit is initialized
            if (this.requestObj.transactions[idx].inventory[i].unit) {
                this.requestObj.transactions[idx].inventory[i].unit.rate = item.amount / item.openingQuantity; // Kunal
                this.requestObj.transactions[idx].inventory[i].unit.code = item.stockUnit.code;
                this.requestObj.transactions[idx].inventory[i].unit.stockUnitCode = item.stockUnit.name;
            }
            // this.requestObj.transactions[idx].particular = item.accountStockDetails.accountUniqueName;
            this.requestObj.transactions[idx].inventory[i].stock = { name: item.name, uniqueName: item.uniqueName };
            // this.requestObj.transactions[idx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
            this.changePrice(i, this.requestObj.transactions[idx].inventory[i].unit.rate);
        }
    };
    /**
     * changePrice
     */
    AccountAsVoucherComponent.prototype.changePrice = function (idx, val) {
        var i = this.selectedIdx;
        this.requestObj.transactions[i].inventory[idx].unit.rate = !Number.isNaN(val) ? Number(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](val)) : 0;
        this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(2));
        this.amountChanged(idx);
    };
    AccountAsVoucherComponent.prototype.amountChanged = function (invIdx) {
        var i = this.selectedIdx;
        if (this.requestObj.transactions && this.requestObj.transactions[i].inventory[invIdx].stock && this.requestObj.transactions[i].inventory[invIdx].quantity) {
            this.requestObj.transactions[i].inventory[invIdx].unit.rate = Number((this.requestObj.transactions[i].inventory[invIdx].amount / this.requestObj.transactions[i].inventory[invIdx].quantity).toFixed(2));
        }
        var total = this.calculateTransactionTotal(this.requestObj.transactions[i].inventory);
        this.requestObj.transactions[i].total = total;
        this.requestObj.transactions[i].amount = total;
    };
    /**
     * calculateTransactionTotal
     */
    AccountAsVoucherComponent.prototype.calculateTransactionTotal = function (inventory) {
        var total = 0;
        inventory.forEach(function (inv) {
            total = total + Number(inv.amount);
        });
        return total;
    };
    AccountAsVoucherComponent.prototype.changeQuantity = function (idx, val) {
        var i = this.selectedIdx;
        var entry = this.requestObj.transactions[i];
        this.requestObj.transactions[i].inventory[idx].quantity = Number(val);
        this.requestObj.transactions[i].inventory[idx].amount = Number((this.requestObj.transactions[i].inventory[idx].unit.rate * this.requestObj.transactions[i].inventory[idx].quantity).toFixed(2));
        this.amountChanged(idx);
    };
    AccountAsVoucherComponent.prototype.validateAndAddNewStock = function (idx) {
        var i = this.selectedIdx;
        if (this.requestObj.transactions[i].inventory.length - 1 === idx && this.requestObj.transactions[i].inventory[idx].amount) {
            this.requestObj.transactions[i].inventory.push(this.initInventory());
        }
    };
    AccountAsVoucherComponent.prototype.filterAccount = function (byOrTo) {
        if (byOrTo) {
            this._tallyModuleService.selectedFieldType.next(byOrTo);
        }
    };
    AccountAsVoucherComponent.prototype.detectKey = function (ev) {
        this.keyUpDownEvent = ev;
        //  if (ev.keyCode === 27) {
        //   this.deleteRow(this.selectedIdx);
        //  }
        //  if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
        //   this.arrowInput = { key: ev.keyCode };
        //  }
    };
    /**
     * hideListItems
     */
    AccountAsVoucherComponent.prototype.hideListItems = function () {
        // this.showLedgerAccountList = false;
        // this.showStockList = false;
    };
    AccountAsVoucherComponent.prototype.dateEntered = function () {
        var date = moment__WEBPACK_IMPORTED_MODULE_14__(this.journalDate, 'DD-MM-YYYY');
        if (moment__WEBPACK_IMPORTED_MODULE_14__(date).format('dddd') !== 'Invalid date') {
            this.displayDay = moment__WEBPACK_IMPORTED_MODULE_14__(date).format('dddd');
        }
        else {
            this.displayDay = '';
        }
    };
    /**
     * validateAccount
     */
    AccountAsVoucherComponent.prototype.validateAccount = function (transactionObj, ev, idx) {
        var lastIndx = this.requestObj.transactions.length - 1;
        if (idx === lastIndx) {
            return;
        }
        if (!transactionObj.selectedAccount.account) {
            transactionObj.selectedAccount = {};
            transactionObj.amount = 0;
            transactionObj.inventory = [];
            if (idx) {
                this.requestObj.transactions.splice(idx, 1);
            }
            else {
                ev.preventDefault();
            }
            return;
        }
        if (transactionObj.selectedAccount.account !== transactionObj.selectedAccount.name) {
            this._toaster.errorToast('No account found with name ' + transactionObj.selectedAccount.account);
            ev.preventDefault();
            return;
        }
        // console.log(transactionObj, ev);
    };
    AccountAsVoucherComponent.prototype.onItemSelected = function (ev) {
        var _this = this;
        setTimeout(function () {
            _this.currentSelectedValue = '';
            _this.showLedgerAccountList = false;
        }, 200);
        if (ev.value === 'createnewitem') {
            return this.showQuickAccountModal();
        }
        if (this.selectedField === 'account') {
            this.setAccount(ev.additional);
        }
        else if (this.selectedField === 'stock') {
            this.onSelectStock(ev.additional);
        }
    };
    /**
     * getStock
     */
    AccountAsVoucherComponent.prototype.getStock = function (parentGrpUnqName, q, forceRefresh, needToFocusStockInputField) {
        var _this = this;
        if (forceRefresh === void 0) { forceRefresh = false; }
        if (needToFocusStockInputField === void 0) { needToFocusStockInputField = false; }
        if (this.allStocks && this.allStocks.length && !forceRefresh) {
            // this.inputForList = _.cloneDeep(this.allStocks);
            this.sortStockItems(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.allStocks));
        }
        else {
            var reqArray = parentGrpUnqName ? [parentGrpUnqName] : null;
            this.inventoryService.GetStocks().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
                if (data.status === 'success') {
                    _this.allStocks = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](data.body.results);
                    _this.sortStockItems(_this.allStocks);
                    if (needToFocusStockInputField) {
                        _this.selectedStockInputField.value = '';
                        _this.selectedStockInputField.focus();
                    }
                    // this.inputForList = _.cloneDeep(this.allStocks);
                }
                else {
                    // this.noResult = true;
                }
            });
        }
    };
    /**
     * sortStockItems
     */
    AccountAsVoucherComponent.prototype.sortStockItems = function (ItemArr) {
        var stockAccountArr = [];
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["forEach"](ItemArr, function (obj) {
            stockAccountArr.push({
                label: obj.name + " (" + obj.uniqueName + ")",
                value: obj.uniqueName,
                additional: obj
            });
        });
        // console.log(stockAccountArr, 'stocks');
        this.stockList = stockAccountArr;
        this.inputForList = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.stockList);
    };
    AccountAsVoucherComponent.prototype.loadQuickAccountComponent = function () {
        var _this = this;
        this.quickAccountModal.config.backdrop = false;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_20__["QuickAccountComponent"]);
        var viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        var componentInstance = componentRef.instance;
        componentInstance.needAutoFocus = true;
        componentInstance.closeQuickAccountModal.subscribe(function (a) {
            _this.hideQuickAccountModal();
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
            _this.isNoAccFound = false;
            _this.dateField.nativeElement.focus();
        });
        componentInstance.isQuickAccountCreatedSuccessfully$.subscribe(function (status) {
            if (status) {
                _this.refreshAccountListData(true);
            }
        });
    };
    AccountAsVoucherComponent.prototype.showQuickAccountModal = function () {
        // let selectedField = window.document.querySelector('input[onReturn][type="text"][data-changed="true"]');
        // this.selectedAccountInputField = selectedField;
        if (this.selectedField === 'account') {
            this.loadQuickAccountComponent();
            this.quickAccountModal.show();
        }
        else if (this.selectedField === 'stock') {
            this.asideMenuStateForProductService = 'in';
            this.autoFocusStockGroupField = true;
        }
    };
    AccountAsVoucherComponent.prototype.hideQuickAccountModal = function () {
        var _this = this;
        this.quickAccountModal.hide();
        this.dateField.nativeElement.focus();
        return setTimeout(function () {
            _this.selectedAccountInputField.value = '';
            _this.selectedAccountInputField.focus();
        }, 200);
    };
    AccountAsVoucherComponent.prototype.closeCreateStock = function () {
        this.asideMenuStateForProductService = 'out';
        this.autoFocusStockGroupField = false;
        // after creating stock, get all stocks again
        this.filterByText = '';
        this.dateField.nativeElement.focus();
        this.getStock(null, null, true, true);
    };
    AccountAsVoucherComponent.prototype.onCheckNumberFieldKeyDown = function (e, fieldType) {
        var _this = this;
        if (e && (e.keyCode === 13 || e.which === 13)) {
            e.preventDefault();
            e.stopPropagation();
            return setTimeout(function () {
                if (fieldType === 'chqNumber') {
                    _this.chequeClearanceDateInput.nativeElement.focus();
                }
                else if (fieldType === 'chqDate') {
                    _this.chqFormSubmitBtn.nativeElement.focus();
                }
            }, 100);
        }
    };
    AccountAsVoucherComponent.prototype.keyUpOnSubmitButton = function (e) {
        var _this = this;
        if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
            return setTimeout(function () { return _this.resetButton.nativeElement.focus(); }, 50);
        }
        if (e && (e.keyCode === 8 || e.which === 8)) {
            this.showConfirmationBox = false;
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 50);
        }
    };
    AccountAsVoucherComponent.prototype.keyUpOnResetButton = function (e) {
        var _this = this;
        if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
            return setTimeout(function () { return _this.submitButton.nativeElement.focus(); }, 50);
        }
        if (e && (e.keyCode === 13 || e.which === 13)) {
            this.showConfirmationBox = false;
            return setTimeout(function () { return _this.narrationBox.nativeElement.focus(); }, 50);
        }
    };
    AccountAsVoucherComponent.prototype.onNoAccountFound = function (ev) {
        if (ev && this.isComponentLoaded) {
            this.isNoAccFound = true;
        }
    };
    // public onCheckNumberFieldKeyDown(e, fieldType: string) {
    //   if (e && (e.keyCode === 13 || e.which === 13)) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     return setTimeout(() => {
    //       if (fieldType === 'chqNumber') {
    //         this.chequeClearanceDateInput.nativeElement.focus();
    //       } else if (fieldType === 'chqDate') {
    //         this.chqFormSubmitBtn.nativeElement.focus();
    //       }
    //     }, 100);
    //   }
    // }
    // public keyUpOnSubmitButton(e) {
    //   if (e && (e.keyCode === 39 || e.which === 39) || (e.keyCode === 78 || e.which === 78)) {
    //     return setTimeout(() => this.resetButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 8 || e.which === 8)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }
    // public keyUpOnResetButton(e) {
    //   if (e && (e.keyCode === 37 || e.which === 37) || (e.keyCode === 89 || e.which === 89)) {
    //     return setTimeout(() => this.submitButton.nativeElement.focus(), 50);
    //   }
    //   if (e && (e.keyCode === 13 || e.which === 13)) {
    //     this.showConfirmationBox = false;
    //     return setTimeout(() => this.narrationBox.nativeElement.focus(), 50);
    //   }
    // }
    AccountAsVoucherComponent.prototype.deleteRow = function (idx) {
        this.requestObj.transactions.splice(idx, 1);
        if (!idx) {
            this.newEntryObj();
            this.requestObj.transactions[0].type = 'by';
        }
    };
    AccountAsVoucherComponent.prototype.calculateDiffAmount = function (type) {
        if (type === 'by') {
            if (this.totalDebitAmount < this.totalCreditAmount) {
                return this.totalDiffAmount = this.totalCreditAmount - this.totalDebitAmount;
            }
            else {
                return this.totalDiffAmount = 0;
            }
        }
        else if (type === 'to') {
            if (this.totalCreditAmount < this.totalDebitAmount) {
                return this.totalDiffAmount = this.totalDebitAmount - this.totalCreditAmount;
            }
            else {
                return this.totalDiffAmount = 0;
            }
        }
    };
    AccountAsVoucherComponent.prototype.refreshAccountListData = function (needToFocusAccountInputField) {
        var _this = this;
        if (needToFocusAccountInputField === void 0) { needToFocusAccountInputField = false; }
        this.store.select(function (p) { return p.session.companyUniqueName; }).subscribe(function (a) {
            if (a && a !== '') {
                _this._accountService.GetFlattenAccounts('', '', '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(_this.destroyed$)).subscribe(function (data) {
                    if (data.status === 'success') {
                        _this._tallyModuleService.setFlattenAccounts(data.body.results);
                        if (needToFocusAccountInputField) {
                            _this.selectedAccountInputField.value = '';
                            _this.selectedAccountInputField.focus();
                        }
                    }
                });
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsVoucherComponent.prototype, "saveEntryOnCtrlA", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsVoucherComponent.prototype, "openDatePicker", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AccountAsVoucherComponent.prototype, "openCreateAccountPopup", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Account__WEBPACK_IMPORTED_MODULE_19__["AccountResponse"])
    ], AccountAsVoucherComponent.prototype, "newSelectedAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["EventEmitter"])
    ], AccountAsVoucherComponent.prototype, "showAccountList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('quickAccountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__["ElementViewContainerRef"])
    ], AccountAsVoucherComponent.prototype, "quickAccountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('quickAccountModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], AccountAsVoucherComponent.prototype, "quickAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('chequeEntryModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], AccountAsVoucherComponent.prototype, "chequeEntryModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChildren"])(_theme_ng2_vs_for_ng2_vs_for__WEBPACK_IMPORTED_MODULE_5__["VsForDirective"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["QueryList"])
    ], AccountAsVoucherComponent.prototype, "columnView", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('particular'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AccountAsVoucherComponent.prototype, "accountField", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('dateField'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "dateField", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('narrationBox'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "narrationBox", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('chequeNumberInput'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "chequeNumberInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('chequeClearanceDateInput'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "chequeClearanceDateInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('chqFormSubmitBtn'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "chqFormSubmitBtn", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('submitButton'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "submitButton", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('resetButton'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ElementRef"])
    ], AccountAsVoucherComponent.prototype, "resetButton", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ViewChild"])('manageGroupsAccountsModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], AccountAsVoucherComponent.prototype, "manageGroupsAccountsModal", void 0);
    AccountAsVoucherComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_12__["Component"])({
            selector: 'account-as-voucher',
            template: __webpack_require__(/*! ./voucher-grid.component.html */ "./src/app/accounting/voucher-grid/voucher-grid.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_22__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ../accounting.component.css */ "./src/app/accounting/accounting.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_account_service__WEBPACK_IMPORTED_MODULE_9__["AccountService"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_8__["LedgerActions"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_11__["Store"],
            _keyboard_service__WEBPACK_IMPORTED_MODULE_7__["KeyboardService"],
            apps_web_giddh_src_app_actions_fly_accounts_actions__WEBPACK_IMPORTED_MODULE_15__["FlyAccountsActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__["ToasterService"], _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"],
            apps_web_giddh_src_app_accounting_tally_service__WEBPACK_IMPORTED_MODULE_18__["TallyModuleService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_12__["ComponentFactoryResolver"],
            apps_web_giddh_src_app_services_inventory_service__WEBPACK_IMPORTED_MODULE_3__["InventoryService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], AccountAsVoucherComponent);
    return AccountAsVoucherComponent;
}());



/***/ })

}]);