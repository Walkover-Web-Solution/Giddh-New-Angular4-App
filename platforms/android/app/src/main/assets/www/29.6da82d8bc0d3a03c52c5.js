(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[29],{

/***/ "./src/app/audit-logs/audit-logs.component.html":
/*!******************************************************!*\
  !*** ./src/app/audit-logs/audit-logs.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n  <div class=\"row\">\n    <div class=\"col-xs-3 max350\">\n      <!--sidebar-->\n      <audit-logs-sidebar></audit-logs-sidebar>\n      <!--/sidebar-->\n    </div>\n    <div class=\"col-xs-9\">\n      <audit-logs-grid></audit-logs-grid>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/audit-logs/audit-logs.component.ts":
/*!****************************************************!*\
  !*** ./src/app/audit-logs/audit-logs.component.ts ***!
  \****************************************************/
/*! exports provided: AuditLogsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsComponent", function() { return AuditLogsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");







var AuditLogsComponent = /** @class */ (function () {
    function AuditLogsComponent(store, companyActions) {
        this.store = store;
        this.companyActions = companyActions;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
    }
    AuditLogsComponent.prototype.ngOnInit = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'audit-logs';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    AuditLogsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    AuditLogsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'audit-logs',
            template: __webpack_require__(/*! ./audit-logs.component.html */ "./src/app/audit-logs/audit-logs.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_5__["CompanyActions"]])
    ], AuditLogsComponent);
    return AuditLogsComponent;
}());



/***/ }),

/***/ "./src/app/audit-logs/audit-logs.module.ts":
/*!*************************************************!*\
  !*** ./src/app/audit-logs/audit-logs.module.ts ***!
  \*************************************************/
/*! exports provided: AuditLogsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsModule", function() { return AuditLogsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _components_audit_logs_grid_audit_logs_grid_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/audit-logs-grid/audit-logs-grid.component */ "./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.ts");
/* harmony import */ var _components_sidebar_components_audit_logs_sidebar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/sidebar-components/audit-logs.sidebar.component */ "./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.ts");
/* harmony import */ var _audit_logs_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./audit-logs.component */ "./src/app/audit-logs/audit-logs.component.ts");
/* harmony import */ var _audit_logs_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./audit-logs.routing.module */ "./src/app/audit-logs/audit-logs.routing.module.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");











var AuditLogsModule = /** @class */ (function () {
    function AuditLogsModule() {
    }
    AuditLogsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            declarations: [
                // Components / Directives/ Pipes
                _audit_logs_component__WEBPACK_IMPORTED_MODULE_6__["AuditLogsComponent"],
                _components_sidebar_components_audit_logs_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["AuditLogsSidebarComponent"],
                _components_audit_logs_grid_audit_logs_grid_component__WEBPACK_IMPORTED_MODULE_4__["AuditLogsGridComponent"]
            ],
            exports: [
                _audit_logs_component__WEBPACK_IMPORTED_MODULE_6__["AuditLogsComponent"],
                _components_sidebar_components_audit_logs_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["AuditLogsSidebarComponent"]
            ],
            providers: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _audit_logs_routing_module__WEBPACK_IMPORTED_MODULE_7__["AuditLogsRoutingModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_8__["DatepickerModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_8__["BsDatepickerModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_9__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_10__["ShSelectModule"]
            ],
        })
    ], AuditLogsModule);
    return AuditLogsModule;
}());



/***/ }),

/***/ "./src/app/audit-logs/audit-logs.routing.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/audit-logs/audit-logs.routing.module.ts ***!
  \*********************************************************/
/*! exports provided: AuditLogsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsRoutingModule", function() { return AuditLogsRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _audit_logs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./audit-logs.component */ "./src/app/audit-logs/audit-logs.component.ts");





var AuditLogsRoutingModule = /** @class */ (function () {
    function AuditLogsRoutingModule() {
    }
    AuditLogsRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _audit_logs_component__WEBPACK_IMPORTED_MODULE_4__["AuditLogsComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AuditLogsRoutingModule);
    return AuditLogsRoutingModule;
}());



/***/ }),

/***/ "./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 class=\"page-title\" *ngIf=\"(logs$ | async).length > 0\"> Audit Logs</h1>\n<br/>\n<section class=\"audit-log\" *ngFor=\"let log of (logs$ | async); let i = index\">\n  <h1>{{log.operationType}}\n    <span\n      *ngIf=\"log && log.accountName && log.accountName != null\"> - {{log.accountName}} ({{log.accountUniqueName}})</span>\n  </h1>\n  <div class=\"mrT border-top-btm clearfix\">\n    <div>\n      <label class=\"pull-left\">Entity:</label>\n      <p class=\"pull-left mrL\">{{log.entityType}}</p>\n    </div>\n    <div>\n      <label class=\"pull-left mrL2\">Date:</label>\n      <p class=\"pull-left mrL\">{{log.createdAt}}</p>\n    </div>\n    <div>\n      <label class=\"pull-left mrL2\">User:</label>\n      <p class=\"pull-left mrL\">{{log.user.name}}</p>\n    </div>\n    <div *ngIf=\"log && log.groupName && log.groupName != null\">\n      <label class=\"pull-left mrL2\">Group:</label>\n      <p class=\"pull-left mrL\">{{log.groupName}}</p>\n    </div>\n    <div>\n      <label class=\"pull-left mrL2\">Company:</label>\n      <p class=\"pull-left mrL\">{{log.companyName}}</p>\n    </div>\n    <div *ngIf=\"log.log && log.log.sharedWith && log.log.sharedWith != undefined && log.log.sharedWith.name.length > 0\">\n      <label class=\"pull-left mrL2\">Shared with:</label>\n      <p class=\"pull-left mrL\">{{log.log.sharedWith.name}}\n        <span\n          ng-if=\"log.log.sharedWith.email && log.log.sharedWith.email != null && log.log.sharedWith.email.length > 0\">\n        | {{log.log.sharedWith.email}}</span>\n      </p>\n    </div>\n    <div *ngIf=\"log && log.log && log.log.description != undefined && log.log.description.length > 0\">\n      <label class=\"pull-left mrL2\">Description:</label>\n      <p class=\"pull-left mrL\">{{log.log.description}}</p>\n    </div>\n  </div>\n\n  <div class=\"mrT\" *ngIf=\"log.log != null && log.log.transactions != undefined && log.log.transactions.length > 0\">\n    <table class=\"table table-bordered \">\n      <thead>\n      <tr>\n        <th class=\"col-xs-3 text-center\">#</th>\n        <th class=\"col-xs-3 text-center\">Date</th>\n        <th class=\"col-xs-3 text-center\">Particular</th>\n        <th class=\"col-xs-3 text-center\">Amount</th>\n        <th class=\"col-xs-3 text-center\">Type</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr *ngFor=\"let transaction of log.log.transactions; let i = index\">\n        <td>{{i + 1}}</td>\n        <td>{{log.log.entryDate}}</td>\n        <td>{{transaction.particular.name}} ({{transaction.particular.uniqueName}})</td>\n        <td>{{transaction.amount| number:'1.2-2'}}</td>\n        <td>{{transaction.type}}</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"mrT text-center\"\n       *ngIf=\"log && log.log && log.log.old != undefined && log.log.updated != undefined && log.log.updated.transactions != undefined\">\n    <label>Updated</label>\n    <table class=\"table table-bordered\">\n      <thead>\n      <tr>\n        <th class=\"col-xs-3 text-center\">#</th>\n        <th class=\"col-xs-3 text-center\">Date</th>\n        <th class=\"col-xs-3 text-center\">Particular</th>\n        <th class=\"col-xs-3 text-center\">Amount</th>\n        <th class=\"col-xs-3 text-center\">Type</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr *ngFor=\"let transaction of log.log.updated.transactions; let i = index\">\n        <td>{{i + 1}}</td>\n        <td>{{log.log.updated.entryDate}}</td>\n        <td>{{transaction.particular.name}} ({{transaction.particular.uniqueName}})</td>\n        <td>{{transaction.amount}}</td>\n        <td>{{transaction.type}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <br>\n    <label>Old</label>\n    <table class=\"table table-bordered\">\n      <thead>\n      <tr>\n        <th class=\"col-xs-3 text-center\">#</th>\n        <th class=\"col-xs-3 text-center\">Date</th>\n        <th class=\"col-xs-3 text-center\">Particular</th>\n        <th class=\"col-xs-3 text-center\">Amount</th>\n        <th class=\"col-xs-3 text-center\">Type</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr *ngFor=\"let transaction of log.log.old.transactions; let i = index\">\n        <td>{{i + 1}}</td>\n        <td>{{log.log.old.entryDate}}</td>\n        <td>{{transaction.particular.name}} ({{transaction.particular.uniqueName}})</td>\n        <td>{{transaction.amount}}</td>\n        <td>{{transaction.type}}</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"mrT text-center\"\n       *ngIf=\"log && log.log && log.log.old != undefined && log.log.updated != undefined && log.log.old.transactions == undefined && log.log.updated.transactions == undefined\">\n    <label>Updated</label>\n    <table class=\"table table-bordered\">\n      <thead>\n      <tr>\n        <th class=\"col-xs-3 text-center\">Opening Balance Date</th>\n        <th class=\"col-xs-2 text-center\">Opening Balance</th>\n        <th class=\"col-xs-3 text-center\">email</th>\n        <th class=\"col-xs-3 text-center\">Name</th>\n        <th class=\"col-xs-4 text-center\">Unique Name</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>{{log.log.updated.openingBalanceDate}}</td>\n        <td>{{log.log.updated.openingBalance}}</td>\n        <td>{{log.log.updated.email}}</td>\n        <td>{{log.log.updated.name}}</td>\n        <td>{{log.log.updated.uniqueName}}</td>\n      </tr>\n      </tbody>\n    </table>\n    <br>\n    <label>Old</label>\n    <table class=\"table table-bordered\">\n      <thead>\n      <tr>\n        <th class=\"col-xs-3 text-center\">Opening Balance Date</th>\n        <th class=\"col-xs-2 text-center\">Opening Balance</th>\n        <th class=\"col-xs-3 text-center\">email</th>\n        <th class=\"col-xs-3 text-center\">Name</th>\n        <th class=\"col-xs-4 text-center\">Unique Name</th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr>\n        <td>{{log.log.old.openingBalanceDate}}</td>\n        <td>{{log.log.old.openingBalance}}</td>\n        <td>{{log.log.old.email}}</td>\n        <td>{{log.log.old.name}}</td>\n        <td>{{log.log.old.uniqueName}}</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n<section class=\"no-logs\" *ngIf=\"(logs$ | async).length < 1\">\n  <div class=\"no-data\">\n    <h1>Sorry, No Logs Found!</h1>\n    <p>You can use the filters on the left to fetch logs.</p>\n  </div>\n</section>\n<button class='btn btn-success pull-left mrT2 mrB2' [ladda]=\"loadMoreInProcess$ | async\" (click)='loadMoreLogs()'\n        *ngIf='(page$ | async) > 0 && (page$ | async) < (totalPages$ | async)'>Load More\n</button>\n"

/***/ }),

/***/ "./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.ts ***!
  \************************************************************************************/
/*! exports provided: AuditLogsGridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsGridComponent", function() { return AuditLogsGridComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_audit_logs_audit_logs_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/audit-logs/audit-logs.actions */ "./src/app/actions/audit-logs/audit-logs.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");







var AuditLogsGridComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function AuditLogsGridComponent(store, _auditLogsActions) {
        this.store = store;
        this._auditLogsActions = _auditLogsActions;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.loadMoreInProcess$ = this.store.select(function (p) { return p.auditlog.LoadMoreInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.logs$ = this.store.select(function (p) { return p.auditlog.logs; });
        this.size$ = this.store.select(function (p) { return p.auditlog.size; });
        this.totalElements$ = this.store.select(function (p) { return p.auditlog.totalElements; });
        this.totalPages$ = this.store.select(function (p) { return p.auditlog.totalPages; });
        this.page$ = this.store.select(function (p) { return p.auditlog.CurrectPage; });
        //
    }
    AuditLogsGridComponent.prototype.ngOnInit = function () {
        //
    };
    AuditLogsGridComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    AuditLogsGridComponent.prototype.loadMoreLogs = function () {
        var _this = this;
        this.store.select(function (p) { return p.auditlog; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (r) {
            var request = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](r.CurrectLogsRequest);
            var page = r.CurrectPage + 1;
            _this.store.dispatch(_this._auditLogsActions.LoadMoreLogs(request, page));
        });
    };
    AuditLogsGridComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'audit-logs-grid',
            template: __webpack_require__(/*! ./audit-logs-grid.component.html */ "./src/app/audit-logs/components/audit-logs-grid/audit-logs-grid.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_audit_logs_audit_logs_actions__WEBPACK_IMPORTED_MODULE_2__["AuditLogsActions"]])
    ], AuditLogsGridComponent);
    return AuditLogsGridComponent;
}());



/***/ }),

/***/ "./src/app/audit-logs/components/sidebar-components/Vm.ts":
/*!****************************************************************!*\
  !*** ./src/app/audit-logs/components/sidebar-components/Vm.ts ***!
  \****************************************************************/
/*! exports provided: AuditLogsSidebarVM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsSidebarVM", function() { return AuditLogsSidebarVM; });
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_0__);

var AuditLogsSidebarVM = /** @class */ (function () {
    function AuditLogsSidebarVM() {
        this.options = {
            multiple: false,
            width: '100%',
            placeholder: 'Select Option',
            allowClear: true
        };
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_0__;
        this.maxDate = moment_moment__WEBPACK_IMPORTED_MODULE_0__().toDate();
        this.filters = [
            { label: 'All', value: 'All' },
            { label: 'create', value: 'create' },
            { label: 'delete', value: 'delete' },
            { label: 'share', value: 'share' },
            { label: 'unshare', value: 'unshare' },
            { label: 'move', value: 'move' },
            { label: 'merge', value: 'merge' },
            { label: 'unmerge', value: 'unmerge' },
            { label: 'delete-all', value: 'delete-all' },
            { label: 'update', value: 'update' },
            { label: 'master-import', value: 'master-import' },
            { label: 'daybook-import', value: 'daybook-import' },
            { label: 'ledger-excel-import', value: 'ledger-excel-import' }
        ];
        this.entities = [
            { label: 'All', value: 'All' },
            { label: 'company', value: 'company' },
            { label: 'group', value: 'group' },
            { label: 'account', value: 'account' },
            { label: 'ledger', value: 'ledger' },
            { label: 'voucher', value: 'voucher' },
            { label: 'logs', value: 'logs' },
            { label: 'invoice', value: 'invoice' },
        ];
        this.dateOptions = [{ label: 'Date Range', value: '1' }, { label: 'Entry/Log Date', value: '0' }];
        this.showLogDatePicker = false;
        this.canManageCompany = false;
        this.selectedOperation = '';
        this.selectedEntity = '';
        this.selectedUserUnq = '';
        this.selectedAccountUnq = '';
        this.selectedGroupUnq = '';
        this.logOrEntry = 'entryDate';
        this.selectedDateOption = '0';
    }
    AuditLogsSidebarVM.prototype.reset = function () {
        this.showLogDatePicker = false;
        this.canManageCompany = false;
        this.selectedOperation = '';
        this.selectedEntity = '';
        this.selectedUserUnq = '';
        this.selectedAccountUnq = '';
        this.selectedGroupUnq = '';
        this.selectedFromDate = moment_moment__WEBPACK_IMPORTED_MODULE_0__().toDate();
        this.selectedToDate = moment_moment__WEBPACK_IMPORTED_MODULE_0__().toDate();
        this.selectedLogDate = moment_moment__WEBPACK_IMPORTED_MODULE_0__().toDate();
        this.selectedEntryDate = moment_moment__WEBPACK_IMPORTED_MODULE_0__().toDate();
        this.logOrEntry = 'entryDate';
        this.selectedDateOption = '';
    };
    return AuditLogsSidebarVM;
}());



/***/ }),

/***/ "./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 class=\"page-title\" style=\"margin-left:0; margin-bottom:15px;\">\n  Apply Log Filters</h1>\n<div class=\"clearfix mrT2\">\n  <label>Filter By:</label>\n  <sh-select [options]=\"vm.dateOptions\" [isFilterEnabled]=\"true\" [placeholder]=\"'Select Option'\"\n             [(ngModel)]=\"vm.selectedDateOption\"></sh-select>\n  <!--<select2 [data]=\"vm.dateOptions\" [options]=\"vm.options\" [value]=\"vm.selectedDateOption\" (valueChanged)=\"selectDateOption($event)\"></select2>-->\n</div>\n\n<div class=\"clearfix mrT2\" *ngIf=\"vm.selectedDateOption == '1'\">\n  <label>From date</label>\n  <input type=\"text\" name=\"from\" [placeholder]=\"giddhDateFormat\" #fromdp=\"bsDatepicker\" bsDatepicker\n         [(ngModel)]=\"vm.selectedFromDate\" class=\"form-control\"/>\n\n</div>\n\n<div class=\"clearfix mrT2\" *ngIf=\"vm.selectedDateOption == '1'\">\n  <label>To date</label>\n  <input type=\"text\" name=\"to\" [placeholder]=\"giddhDateFormat\" #todp=\"bsDatepicker\" bsDatepicker\n         [(ngModel)]=\"vm.selectedToDate\"\n         class=\"form-control\"/>\n\n</div>\n\n<div class=\"clearfix mrT2\" *ngIf=\"vm.selectedDateOption == '0'\">\n  <!-- <label>Select Log Date or Entry Date</label> -->\n  <div class=\"row\" style=\"margin-left:0\">\n    <p class=\"input-group pull-left\" for=\"entryDate\">\n      <label>Entry Date\n        <input id=\"entryDate\" type=\"radio\" name=\"entryDate\" [(ngModel)]=\"vm.logOrEntry\" value=\"entryDate\"/>\n      </label>\n    </p>\n    <p class=\"input-group pull-left mrL2\" for=\"logDate\">\n      <label>Log Date\n        <input id=\"logDate\" type=\"radio\" name=\"logDate\" [(ngModel)]=\"vm.logOrEntry\" value=\"logDate\"/>\n      </label>\n    </p>\n    <br/>\n  </div>\n\n  <div class=\"input-group\">\n    <input type=\"text\" name=\"logdate\" [placeholder]=\"giddhDateFormat\" #logdate=\"bsDatepicker\" bsDatepicker\n           [(ngModel)]=\"vm.selectedLogDate\" class=\"form-control\" [placement]=\"'right'\"/>\n  </div>\n\n</div>\n\n<div class=\"clearfix mrT2\">\n  <label>Select Operation</label>\n  <!-- <input type=\"text\" class=\"form-control\" /> -->\n  <sh-select [options]=\"vm.filters\" [placeholder]=\"'Select Option'\" [(ngModel)]=\"vm.selectedOperation\"></sh-select>\n  <!--<select2 [data]=\"vm.filters\" [options]=\"vm.options\" [value]=\"vm.selectedOperation\" (valueChanged)=\"selectOperationOption($event)\"></select2>-->\n</div>\n\n<div class=\"clearfix mrT2\">\n  <label>Select Entity</label>\n  <sh-select [options]=\"vm.entities\" [isFilterEnabled]=\"true\" [placeholder]=\"'Select Option'\"\n             [(ngModel)]=\"vm.selectedEntity\"></sh-select>\n  <!--<select2 [data]=\"vm.entities\" [options]=\"vm.options\" [value]=\"vm.selectedEntity\" (valueChanged)=\"selectEntityOption($event)\"></select2>-->\n</div>\n\n<div class=\"clearfix mrT2\">\n  <label>Select Account</label>\n  <sh-select [options]=\"vm.accounts$ | async\" [isFilterEnabled]=\"true\" [placeholder]=\"'Select Option'\"\n             [customFilter]=\"genralCustomFilter\" [(ngModel)]=\"vm.selectedAccountUnq\"></sh-select>\n  <!--<select2 [data]=\"vm.accounts$ | async\" [options]=\"vm.options\" [value]=\"vm.selectedAccountUnq\" (valueChanged)=\"selectAccount($event)\"></select2>-->\n</div>\n\n<div class=\"clearfix mrT2\">\n  <label>Select Group</label>\n  <sh-select [options]=\"vm.groups$ | async\" [isFilterEnabled]=\"true\" [placeholder]=\"'Select Option'\"\n             [customFilter]=\"genralCustomFilter\" [(ngModel)]=\"vm.selectedGroupUnq\"></sh-select>\n  <!--<select2 [data]=\"vm.groups$ | async\" [options]=\"vm.options\" [value]=\"vm.selectedGroupUnq\" (valueChanged)=\"selectGroup($event)\"></select2>-->\n</div>\n\n\n<div class=\"clearfix mrT2\">\n  <label>Select User</label>\n  <sh-select [options]=\"vm.users$ | async\" [customFilter]=\"customUserFilter\" [isFilterEnabled]=\"true\"\n             [placeholder]=\"'Select Option'\" [(ngModel)]=\"vm.selectedUserUnq\"></sh-select>\n  <!--<select2 [data]=\"vm.users$ | async\" [options]=\"vm.options\" [value]=\"vm.selectedUserUnq\" (valueChanged)=\"selectUser($event)\"></select2>-->\n</div>\n\n<button class='btn btn-success pull-left mrT2' [ladda]=\"vm.getLogsInprocess$ | async\" (click)='getLogfilters()'>Get Logs\n</button>\n<button class=\"btn btn-warning pull-left mrT2 mrL\" (click)=\"resetFilters()\">Reset</button>\n\n<br/>\n"

/***/ }),

/***/ "./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.ts ***!
  \******************************************************************************************/
/*! exports provided: AuditLogsSidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuditLogsSidebarComponent", function() { return AuditLogsSidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _models_api_models_Logs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/api-models/Logs */ "./src/app/models/api-models/Logs.ts");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _Vm__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Vm */ "./src/app/audit-logs/components/sidebar-components/Vm.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_audit_logs_audit_logs_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../actions/audit-logs/audit-logs.actions */ "./src/app/actions/audit-logs/audit-logs.actions.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
















var AuditLogsSidebarComponent = /** @class */ (function () {
    function AuditLogsSidebarComponent(store, _fb, _accountService, _groupService, _companyService, _auditLogsActions, bsConfig) {
        var _this = this;
        this.store = store;
        this._fb = _fb;
        this._accountService = _accountService;
        this._groupService = _groupService;
        this._companyService = _companyService;
        this._auditLogsActions = _auditLogsActions;
        this.bsConfig = bsConfig;
        this.giddhDateFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_7__["GIDDH_DATE_FORMAT"];
        this.giddhDateFormatUI = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_7__["GIDDH_DATE_FORMAT_UI"];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.bsConfig.dateInputFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_7__["GIDDH_DATE_FORMAT"];
        this.bsConfig.rangeInputFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_7__["GIDDH_DATE_FORMAT"];
        this.bsConfig.showWeekNumbers = false;
        this.vm = new _Vm__WEBPACK_IMPORTED_MODULE_12__["AuditLogsSidebarVM"]();
        this.vm.getLogsInprocess$ = this.store.select(function (p) { return p.auditlog.getLogInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.vm.groupsList$ = this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.vm.selectedCompany = this.store.select(function (state) {
            if (!state.session.companies) {
                return;
            }
            return state.session.companies.find(function (cmp) {
                return cmp.uniqueName === state.session.companyUniqueName;
            });
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.vm.user$ = this.store.select(function (state) {
            if (state.session.user) {
                return state.session.user.user;
            }
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this._accountService.GetFlattenAccounts('', '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var accounts_1 = [];
                data.body.results.map(function (d) {
                    accounts_1.push({ label: d.name, value: d.uniqueName });
                });
                _this.vm.accounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(accounts_1);
            }
        });
        var selectedCompany = null;
        var loginUser = null;
        this.vm.selectedCompany.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (c) { return selectedCompany = c; });
        this.vm.user$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (c) { return loginUser = c; });
        this._companyService.getComapnyUsers().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var users_1 = [];
                data.body.map(function (d) {
                    users_1.push({ label: d.userName, value: d.userUniqueName, additional: d });
                });
                _this.vm.canManageCompany = true;
                _this.vm.users$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(users_1);
            }
            else {
                _this.vm.canManageCompany = false;
            }
        });
    }
    AuditLogsSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.vm.groupsList$.subscribe(function (data) {
            if (data && data.length) {
                var accountList = _this.flattenGroup(data, []);
                var groups_1 = [];
                accountList.map(function (d) {
                    groups_1.push({ label: d.name, value: d.uniqueName });
                });
                _this.vm.groups$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(groups_1);
            }
        });
        this.vm.reset();
    };
    AuditLogsSidebarComponent.prototype.flattenGroup = function (rawList, parents) {
        var _this = this;
        if (parents === void 0) { parents = []; }
        var listofUN;
        listofUN = _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["map"](rawList, function (listItem) {
            var newParents;
            var result;
            newParents = _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["union"]([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            if (listItem.groups.length > 0) {
                result = _this.flattenGroup(listItem.groups, newParents);
                result.push(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["omit"](listItem, 'groups'));
            }
            else {
                result = _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["omit"](listItem, 'groups');
            }
            return result;
        });
        return _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["flatten"](listofUN);
    };
    AuditLogsSidebarComponent.prototype.ngOnDestroy = function () {
        this.vm.reset();
        this.store.dispatch(this._auditLogsActions.ResetLogs());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    AuditLogsSidebarComponent.prototype.selectDateOption = function (v) {
        this.vm.selectedDateOption = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.selectEntityOption = function (v) {
        this.vm.selectedEntity = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.selectOperationOption = function (v) {
        this.vm.selectedOperation = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.selectAccount = function (v) {
        this.vm.selectedAccountUnq = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.clearDate = function (model) {
        this.vm[model] = '';
    };
    AuditLogsSidebarComponent.prototype.setToday = function (model) {
        this.vm[model] = new Date();
    };
    AuditLogsSidebarComponent.prototype.selectGroup = function (v) {
        this.vm.selectedGroupUnq = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.selectUser = function (v) {
        this.vm.selectedUserUnq = v.value || '';
    };
    AuditLogsSidebarComponent.prototype.getLogfilters = function () {
        var reqBody = new _models_api_models_Logs__WEBPACK_IMPORTED_MODULE_3__["LogsRequest"]();
        // reqBody.fromDate = this.vm.selectedFromDate ? moment(this.vm.selectedFromDate).format('DD-MM-YYYY') : '';
        // reqBody.toDate = this.vm.selectedToDate ? moment(this.vm.selectedToDate).format('DD-MM-YYYY') : '';
        reqBody.operation = this.vm.selectedOperation === 'All' ? '' : this.vm.selectedOperation;
        reqBody.entity = this.vm.selectedEntity === 'All' ? '' : this.vm.selectedEntity;
        // reqBody.entryDate = this.vm.selectedLogDate ? moment(this.vm.selectedLogDate).format('DD-MM-YYYY') : '';
        reqBody.userUniqueName = this.vm.selectedUserUnq;
        reqBody.accountUniqueName = this.vm.selectedAccountUnq;
        reqBody.groupUniqueName = this.vm.selectedGroupUnq;
        if (this.vm.selectedDateOption === '0') {
            reqBody.fromDate = null;
            reqBody.toDate = null;
            if (this.vm.logOrEntry === 'logDate') {
                reqBody.logDate = this.vm.selectedLogDate ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.vm.selectedLogDate).format('DD-MM-YYYY') : '';
                reqBody.entryDate = null;
            }
            else if (this.vm.logOrEntry === 'entryDate') {
                reqBody.entryDate = this.vm.selectedLogDate ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.vm.selectedLogDate).format('DD-MM-YYYY') : '';
                reqBody.logDate = null;
            }
        }
        else {
            reqBody.logDate = null;
            reqBody.entryDate = null;
            reqBody.fromDate = this.vm.selectedFromDate ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.vm.selectedFromDate).format('DD-MM-YYYY') : '';
            reqBody.toDate = this.vm.selectedToDate ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.vm.selectedToDate).format('DD-MM-YYYY') : '';
        }
        this.store.dispatch(this._auditLogsActions.GetLogs(reqBody, 1));
    };
    AuditLogsSidebarComponent.prototype.customUserFilter = function (term, item) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase().indexOf(term) > -1));
    };
    AuditLogsSidebarComponent.prototype.genralCustomFilter = function (term, item) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    };
    AuditLogsSidebarComponent.prototype.resetFilters = function () {
        this.vm.reset();
        this.store.dispatch(this._auditLogsActions.ResetLogs());
    };
    AuditLogsSidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_9__["Component"])({
            selector: 'audit-logs-sidebar',
            template: __webpack_require__(/*! ./audit-logs.sidebar.component.html */ "./src/app/audit-logs/components/sidebar-components/audit-logs.sidebar.component.html"),
            styles: ["\n    .ps {\n      overflow: visible !important\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormBuilder"], _services_account_service__WEBPACK_IMPORTED_MODULE_6__["AccountService"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_5__["GroupService"], _services_companyService_service__WEBPACK_IMPORTED_MODULE_4__["CompanyService"], _actions_audit_logs_audit_logs_actions__WEBPACK_IMPORTED_MODULE_14__["AuditLogsActions"], ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_15__["BsDatepickerConfig"]])
    ], AuditLogsSidebarComponent);
    return AuditLogsSidebarComponent;
}());



/***/ }),

/***/ "./src/app/models/api-models/Logs.ts":
/*!*******************************************!*\
  !*** ./src/app/models/api-models/Logs.ts ***!
  \*******************************************/
/*! exports provided: LogsRequest, LogsResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogsRequest", function() { return LogsRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogsResponse", function() { return LogsResponse; });
/**
 * Model for Audit Logs api request
 * API:: (Audit Logs) company/:companyUniqueName/logs?page=:page
 * Audit Logs API details
 * In Request Payload, either
 * A.   "fromDate" and "toDate" params will be sent    OR
 * B.   "logDate"   OR
 * C.   "entryDate"
 * NOTE:: entity options value can be  [ group, company, account, ledger, voucher, logs, invoice, proforma, company_settings ]
 * NOTE:: its response will be a hash containing a key logs
 */
var LogsRequest = /** @class */ (function () {
    function LogsRequest() {
    }
    return LogsRequest;
}());

/**
 * Model for Audit Logs api response
 * API:: (Audit Logs) company/:companyUniqueName/logs?page=:page
 */
var LogsResponse = /** @class */ (function () {
    function LogsResponse() {
    }
    return LogsResponse;
}());



/***/ })

}]);