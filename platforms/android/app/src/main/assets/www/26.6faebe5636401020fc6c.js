(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[26],{

/***/ "./src/app/shared/helpers/pipes/durationPipe/duration.module.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/durationPipe/duration.module.ts ***!
  \**********************************************************************/
/*! exports provided: DurationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DurationModule", function() { return DurationModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _duration_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./duration.pipe */ "./src/app/shared/helpers/pipes/durationPipe/duration.pipe.ts");



var DurationModule = /** @class */ (function () {
    function DurationModule() {
    }
    DurationModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [],
            exports: [_duration_pipe__WEBPACK_IMPORTED_MODULE_2__["DurationPipe"]],
            declarations: [_duration_pipe__WEBPACK_IMPORTED_MODULE_2__["DurationPipe"]],
        })
    ], DurationModule);
    return DurationModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/durationPipe/duration.pipe.ts":
/*!********************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/durationPipe/duration.pipe.ts ***!
  \********************************************************************/
/*! exports provided: DurationPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DurationPipe", function() { return DurationPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


// tslint:disable-next-line:pipe-naming
var DurationPipe = /** @class */ (function () {
    function DurationPipe() {
    }
    DurationPipe.prototype.transform = function (text, search) {
        // let duration = moment.duration(moment().diff(moment(text)));
        // console.log('duration', duration);
        // let hours = duration.asHours();
        // console.log('duration', hours);
        // console.log(moment(hours));
        // console.log(moment(text).format('LLL'));
    };
    DurationPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'duration' })
    ], DurationPipe);
    return DurationPipe;
}());



/***/ }),

/***/ "./src/app/userDetails/components/company/user-details-company.component.css":
/*!***********************************************************************************!*\
  !*** ./src/app/userDetails/components/company/user-details-company.component.css ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".company-box h3 {\n  white-space: normal;\n  width: 94%;\n  word-break: break-word;\n}\n"

/***/ }),

/***/ "./src/app/userDetails/components/company/user-details-company.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/userDetails/components/company/user-details-company.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix bg-none\">\n  <div class=\"row\" *ngIf=\"!(isGetAllRequestInProcess$ | async)\">\n    <div class=\"col-md-4 col-sm-6\" *ngFor=\"let company of companies\">\n      <div class=\"company-box\">\n        <div class=\"clearfix relative\">\n          <h3>{{company.name}}</h3>\n          <div class=\"btn-group d-inline-block custom-dropdown\" dropdown placement=\"bottom right\">\n            <button id=\"button-alignment\" dropdownToggle type=\"button\" class=\"dropdown-toggle\" aria-controls=\"dropdown-alignment\">\n              <span class=\"icon-dots-three-vertical\"></span>\n            </button>\n            <ul id=\"dropdown-alignment\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"button-alignment\">\n              <li role=\"menuitem\">\n                <a class=\"dropdown-item\" href=\"javascript:void(0)\">Edit</a>\n              </li>\n              <li role=\"menuitem\">\n                <a class=\"dropdown-item\" href=\"javascript:void(0)\" (click)=\"openModal(template, company)\">Delete</a>\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"inner-company-box clearfix\">\n          <ul>\n              <li>\n                <span>Unique Name:</span> {{company.uniqueName}} </li>\n            <li>\n              <span>Created On: </span> {{company.createdAt}}</li>\n            <li>\n              <span>Address: </span>\n              {{company.address}}\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-4 col-sm-6\">\n      <div class=\"company-box text-center align-item-center\">\n        <button type=\"button\" (click)=\"createNewCompany()\" class=\"btn btn-blue\">Create  New</button>\n      </div>\n    </div>\n\n    <ng-template #template>\n      <div class=\"modal-header\">\n        <h3 class=\"modal-title pull-left\">Delete Company</h3>\n        <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n      <div class=\"modal-body pd-3\">\n        <p class=\"mb-2\">Are you sure you want to permanently delete <strong>{{selectedCmp.name}}</strong> ?</p>\n\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"confirmDelete()\" >Ok</button>\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"declineDelete()\" >Cancel</button>\n      </div>\n    </ng-template>\n    <!--add company new modal  -->\n    <div bsModal #addCompanyNewModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: false}\" class=\"modal fade\"\n         role=\"dialog\" (onHidden)=\"hideAddCompanyModal()\">\n      <div class=\"modal-dialog modal-lg\">\n        <div class=\"modal-content\">\n          <ng-template element-view-container-ref #companynewadd=elementviewcontainerref>\n          </ng-template>\n        </div>\n      </div>\n    </div>\n  </div>\n  <!--loading-->\n  <div *ngIf=\"(isGetAllRequestInProcess$ | async)\" class=\"no-data mrT2 d-flex\"\n       style=\"justify-content: center;align-items: center;margin-top:125px;margin-bottom: 105px;\">\n    <div class=\"giddh-spinner vertical-center-spinner\"></div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/userDetails/components/company/user-details-company.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/userDetails/components/company/user-details-company.component.ts ***!
  \**********************************************************************************/
/*! exports provided: UserDetailsCompanyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsCompanyComponent", function() { return UserDetailsCompanyComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _shared_header_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/header/components */ "./src/app/shared/header/components/index.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");










var UserDetailsCompanyComponent = /** @class */ (function () {
    function UserDetailsCompanyComponent(modalService, store, componentFactoryResolver, _companyActions, groupWithAccountsAction) {
        this.modalService = modalService;
        this.store = store;
        this.componentFactoryResolver = componentFactoryResolver;
        this._companyActions = _companyActions;
        this.groupWithAccountsAction = groupWithAccountsAction;
        //array holding list of companies to be displayed on UI
        this.companies = [];
        //observable for giddh spinner
        this.isGetAllRequestInProcess$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(true);
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.companies$ = this.store.select(function (p) { return p.session.companies; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isGetAllRequestInProcess$ = this.store.select(function (p) { return p.company.isCompanyActionInProgress; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    UserDetailsCompanyComponent.prototype.openModal = function (template, selectedCompany) {
        this.selectedCmp = selectedCompany;
        this.modalRef = this.modalService.show(template);
    };
    UserDetailsCompanyComponent.prototype.confirmDelete = function () {
        this.store.dispatch(this._companyActions.DeleteCompany(this.selectedCmp.uniqueName));
        this.hideModal();
    };
    UserDetailsCompanyComponent.prototype.declineDelete = function () {
        this.hideModal();
    };
    UserDetailsCompanyComponent.prototype.hideModal = function () {
        this.modalRef.hide();
    };
    UserDetailsCompanyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.companies$.subscribe(function (a) {
            if (a) {
                _this.companies = _this.filterCompanyOnRole(a);
            }
        });
    };
    UserDetailsCompanyComponent.prototype.createNewCompany = function () {
        this.showAddCompanyModal();
    };
    UserDetailsCompanyComponent.prototype.showAddCompanyModal = function () {
        this.loadAddCompanyNewUiComponent();
        this.addCompanyNewModal.show();
    };
    UserDetailsCompanyComponent.prototype.hideAddCompanyModal = function () {
        this.addCompanyNewModal.hide();
    };
    UserDetailsCompanyComponent.prototype.filterCompanyOnRole = function (a) {
        var filteredData = a.filter(function (element) { return element.userEntityRoles.some(function (subElement) { return subElement.entity.entity === "COMPANY"; }); });
        return filteredData;
    };
    UserDetailsCompanyComponent.prototype.loadAddCompanyNewUiComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_shared_header_components__WEBPACK_IMPORTED_MODULE_7__["CompanyAddNewUiComponent"]);
        var viewContainerRef = this.companynewadd.viewContainerRef;
        viewContainerRef.clear();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.closeCompanyModal.subscribe(function (a) {
            _this.hideAddCompanyModal();
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('addCompanyNewModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], UserDetailsCompanyComponent.prototype, "addCompanyNewModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('companynewadd'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_8__["ElementViewContainerRef"])
    ], UserDetailsCompanyComponent.prototype, "companynewadd", void 0);
    UserDetailsCompanyComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'user-detail-company',
            template: __webpack_require__(/*! ./user-details-company.component.html */ "./src/app/userDetails/components/company/user-details-company.component.html"),
            styles: [__webpack_require__(/*! ./user-details-company.component.css */ "./src/app/userDetails/components/company/user-details-company.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsModalService"], _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ComponentFactoryResolver"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__["CompanyActions"],
            _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_9__["GroupWithAccountsAction"]])
    ], UserDetailsCompanyComponent);
    return UserDetailsCompanyComponent;
}());



/***/ }),

/***/ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.css":
/*!**********************************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".select-plan-block .your-account span {\n  color: #9B9B9B;\n  font-size: 14px;\n  padding: 4px 0;\n  display: inline-block;\n}\n.select-plan-block {\n  margin-bottom: 40px;\n}\n.welcome-msg {\n  position: relative;\n}\n.note-wrap {\n  position: fixed;\n  bottom: 30px;\n  width: 100%;\n  color: #707070;\n  padding: 10px;\n}\n.choose-ur-plan {\n  height: calc(100vh - 320px);\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.payment-log-list > li {\n  padding: 7px 0;\n}\n.payment-log-list {\n  list-style-type: none;\n  font-size: 14px;\n  color: #666666;\n}\n.payment-log-list {\n  list-style-type: none;\n  font-size: 14px;\n  color: #666666;\n}\n.payment-log-list > li {\n  padding: 0px 0 20px 10px;\n  border-left: 1px dashed #666666;\n  position: relative;\n  line-height: 10px;\n}\n.payment-log-list > li:last-child {\n  padding-bottom: 0px;\n}\n.payment-log-list > li:after {\n  position: relative;\n  width: 10px;\n  height: 10px;\n  background: #f4f5f8;\n  content: '';\n  display: block;\n  position: absolute;\n  left: -5px;\n  top: 0px;\n  border-radius: 90px;\n  border: 1px solid #666666;\n}\n.accountAsideMenuState2 {\n  position: fixed;\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  max-width: 480px;\n  width: 100%;\n  z-index: 1045;\n}\n.aside-overlay {\n  z-index: 999;\n}\n@media only screen and (max-width: 767px) {\n  .note-wrap {\n    position: relative;\n    bottom: 0px;\n  }\n  .choose-ur-plan {\n    height: initial;\n  }\n}"

/***/ }),

/***/ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"welcome-msg pt-2 \">\n    <div class=\"row\">\n        <div class=\"col-md-9\">\n            <p class=\"mb-2\">Hi {{logedInUser?.name}} !</p>\n            <p class=\"mb-3\">Please select a subscription for your company <strong>“{{this.currentCompany}}”.</strong></p>\n        </div>\n        <div class=\"col-md-3 text-right xs-left\">\n            <a (click)=\"backClicked()\" class=\"btn btn-default pr-3 pl-3 mb-2\">Back</a>\n        </div>\n    </div>\n    <div *ngIf=\"!isSwitchPlanInProcess\" class=\"choose-ur-plan\">\n        <div class=\"row\">\n            <div class=\"col-sm-9\">\n                <div class=\"row\">\n                    <ng-container *ngFor=\"let item of SubscriptionPlans; let i=index\">\n                        <!-- Free plans -->\n                        <ng-container *ngIf=\"!item?.planDetails?.amount && !item.subscriptionId\">\n                            <div class=\"col-sm-4\">\n                                <div class=\"select-plan-block\">\n                                    {{item?.planDetails?.name}}\n                                    <div class=\"your-account\">\n\n                                        <!-- <div class=\"row\">\n                                                    <div class=\"col-xs-6\">\n                                                        <span>\n                      Subscription ID\n                    </span>\n                                                    </div>\n                                                    <div class=\"col-xs-6\">\n                                                        <p>\n                                                            -\n                                                        </p>\n                                                    </div>\n                                                </div> -->\n\n                                        <!--  -->\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Price\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p *ngIf=\"item?.planDetails?.amount\">\n                                                    {{item?.planDetails?.amount | number}}\n                                                </p>\n                                                <p *ngIf=\"!item?.planDetails?.amount\">\n                                                    FREE\n                                                </p>\n                                            </div>\n                                        </div>\n                                        <!--  -->\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Total Companies\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p class=\"\">\n                                                    {{item?.planDetails?.companiesLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Transactions Limit\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{item?.planDetails?.transactionLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Renewal\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{item?.planDetails?.duration }} {{item?.planDetails?.durationUnit}}(s)\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-12\">\n                                                <button class=\"btn btn-primary mrT1 mrB2\" (click)=\"choosePlan(item);\" [ladda]=\"this.isUpdateCompanyInProgress$ | async\">Select Plan</button>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                </div>\n\n                            </div>\n                        </ng-container>\n                        <!-- new plan after free -->\n                        <ng-container *ngIf=\"item?.planDetails?.amount && !item.subscriptionId\">\n                            <div class=\"col-sm-4\">\n                                <div class=\"select-plan-block\">\n                                    {{item?.planDetails?.name}}\n                                    <div class=\"your-account\">\n\n                                        <!-- <div class=\"row\">\n                                                    <div class=\"col-xs-6\">\n                                                        <span>\n                      Subscription ID\n                    </span>\n                                                    </div>\n                                                    <div class=\"col-xs-6\">\n                                                        <p>\n                                                            -\n                                                        </p>\n                                                    </div>\n                                                </div> -->\n\n                                        <!--  -->\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Price\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{item?.planDetails?.amount | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n                                        <!--  -->\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Total Companies\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p class=\"\">\n                                                    {{item?.planDetails?.companiesLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Transactions Limit\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{item?.planDetails?.transactionLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Renewal\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{item?.planDetails?.duration}} {{item?.planDetails?.durationUnit}}(s)\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-12\">\n                                                <button class=\"btn btn-success mrT1 mrB2\" (click)=\"buyPlanClicked(item)\">Buy Plan</button>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                </div>\n\n                            </div>\n                        </ng-container>\n                    </ng-container>\n                </div>\n                <div class=\"row\">\n                    <ng-container *ngFor=\"let paidItem of SubscriptionPlans\">\n                        <ng-container *ngIf=\"paidItem?.subscriptionId && paidItem?.totalCompanies!==paidItem?.planDetails?.companiesLimit\">\n\n                            <div class=\"col-sm-4\">\n                                <div class=\"select-plan-block\">\n                                    {{paidItem?.planDetails?.name}}\n                                    <div class=\"your-account\">\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription ID\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{paidItem.subscriptionId}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <!--  -->\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Price\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{paidItem?.planDetails?.amount | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n                                        <!--  -->\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Total Companies\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p class=\"\">\n                                                    {{ paidItem?.totalCompanies | number}} out of {{ paidItem?.planDetails?.companiesLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Transactions Limit\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{paidItem?.planDetails?.transactionLimit | number}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-6\">\n                                                <span>\n                      Subscription Renewal\n                    </span>\n                                            </div>\n                                            <div class=\"col-xs-6\">\n                                                <p>\n                                                    {{paidItem?.expiry}}\n                                                </p>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"row\">\n                                            <div class=\"col-xs-12\">\n                                                <button class=\"btn btn-primary mrT1 mrB2\" (click)=\"choosePlan(paidItem)\" [ladda]=\"this.isUpdateCompanyInProgress$ | async\">Select Plan</button>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                </div>\n\n                            </div>\n                        </ng-container>\n                    </ng-container>\n                </div>\n            </div>\n\n            <div class=\"col-sm-3\">\n                <div class=\"activation-key\">\n                    <label>Activation Key</label>\n                    <input type=\"text\" name=\"licenceKey\" class=\"form-control mrT1\" placeholder=\"Enter activation key\">\n                </div>\n                <div class=\"activation-btn\">\n                    <button class=\"btn btn-green mrT1\" disabled> Activate</button>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div *ngIf=\"isSwitchPlanInProcess\">\n        <div class=\"no-data mrT2 d-flex\" style=\"justify-content: center;align-items: center;margin-top:125px;margin-bottom: 105px;\">\n            <div class=\"giddh-spinner vertical-center-spinner\"></div>\n        </div>\n    </div>\n    <div class=\"note-wrap\">\n        <p>Note:</p>\n        <p>* revenue more than 12 and less than 20 lacs</p>\n    </div>\n</div>\n\n\n\n<!-- asid bar start -->\n<!-- <div class=\"aside-overlay\"></div>\n  <div class=\"accountAsideMenuState2\">\n    <div class=\"aside-pane\">\n      <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n      <div class=\"aside-header mb-\">\n          <h3 class=\"aside-title\">Payment Log</h3>\n      </div>\n      <div class=\"aside-body\">\n        <div class=\"select-plan-block pt-2\">\n          <p class=\"mb-2\">Plan 2 <span class=\"text-light\">(Current Plan)</span></p>\n          <div class=\"your-account\">\n          <div class=\"row\">\n          <div class=\"col-xs-6\">\n          <span> Subscription ID </span></div>\n          <div class=\"col-xs-6\">\n          <p> 8978 </p></div></div>\n          <div class=\"row\">\n            <div class=\"col-xs-6\">\n            <span> Subscription Price </span></div>\n            <div class=\"col-xs-6\">\n            <p> - 4000/- pa </p></div>\n          </div>\n          <div class=\"row\">\n          <div class=\"col-xs-6\">\n          <span> Total Companies </span></div>\n          <div class=\"col-xs-6\">\n          <p class=\"\">\n          2 out of 10 </p></div></div>\n          <div class=\"row\">\n            <div class=\"col-xs-6\">\n            <span> Transactions Limit </span></div>\n            <div class=\"col-xs-6\">\n            <p> 40,000 </p></div></div>\n            <div class=\"row\">\n            <div class=\"col-xs-6\">\n            <span> Subscription Renewal </span></div>\n            <div class=\"col-xs-6\">\n            <p> Yearly </p></div></div>\n            <div class=\"row mt-1\">\n            <div class=\"col-xs-12\">\n              <ul class=\"payment-log-list mt-3\">\n                <li>17-10-2018, plan subscribed paid $2,000 by 83XXXXXXXXX98</li>\n                <li>05-10-2018, amount $2,000 paid by 83XXXXXXXXX98</li>\n                <li>27-09-2018, plan subscribed paid $2,000 by 83XXXXXXXXX98</li>\n              </ul>\n            </div>\n            </div>\n          </div>\n          </div>\n      </div>\n    </div>\n  </div> -->\n<!-- asid bar end -->\n"

/***/ }),

/***/ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: SubscriptionsPlansComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubscriptionsPlansComponent", function() { return SubscriptionsPlansComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");












var SubscriptionsPlansComponent = /** @class */ (function () {
    function SubscriptionsPlansComponent(modalService, _generalService, _authenticationService, store, _route, companyActions, settingsProfileActions, _toast) {
        var _this = this;
        this.modalService = modalService;
        this._generalService = _generalService;
        this._authenticationService = _authenticationService;
        this.store = store;
        this._route = _route;
        this.companyActions = companyActions;
        this.settingsProfileActions = settingsProfileActions;
        this._toast = _toast;
        this.SubscriptionPlans = [];
        this.SubscriptionRequestObj = {
            planUniqueName: '',
            subscriptionId: '',
            userUniqueName: '',
            licenceKey: ''
        };
        this.isSwitchPlanInProcess = false;
        this.isSubscriptionPlanShow = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && !_.isEmpty(o)) {
                var companyInfo = _.cloneDeep(o);
                _this.currentCompany = companyInfo.name;
            }
        });
        this.isUpdateCompanyInProgress$ = this.store.select(function (s) { return s.settings.updateProfileInProgress; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isUpdateCompanySuccess$ = this.store.select(function (s) { return s.settings.updateProfileSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    SubscriptionsPlansComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._authenticationService.getAllUserSubsciptionPlans().subscribe(function (res) {
            _this.SubscriptionPlans = res.body;
        });
        if (this._generalService.user) {
            this.logedInUser = this._generalService.user;
        }
        // this.isUpdateCompanySuccess$.subscribe(p => {
        //   if (p) {
        //     this._toast.successToast("Plan changed successfully");
        //   }
        // });
        this.isUpdateCompanyInProgress$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (inProcess) {
            _this.isSwitchPlanInProcess = inProcess;
        });
    };
    SubscriptionsPlansComponent.prototype.ngOnDestroy = function () { };
    SubscriptionsPlansComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template);
    };
    SubscriptionsPlansComponent.prototype.openModalTwo = function (modalTwo) {
        this.modalRef = this.modalService.show(modalTwo);
    };
    SubscriptionsPlansComponent.prototype.backClicked = function () {
        this.isSubscriptionPlanShow.emit(true);
    };
    SubscriptionsPlansComponent.prototype.buyPlanClicked = function (plan) {
        this._route.navigate(['billing-detail', 'buy-plan']);
        this.store.dispatch(this.companyActions.selectedPlan(plan));
    };
    SubscriptionsPlansComponent.prototype.patchProfile = function (obj) {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    };
    SubscriptionsPlansComponent.prototype.choosePlan = function (plan) {
        this.SubscriptionRequestObj.userUniqueName = this.logedInUser.uniqueName;
        if (plan.subscriptionId) { // bought plan
            this.SubscriptionRequestObj.subscriptionId = plan.subscriptionId;
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj });
        }
        else if (!plan.subscriptionId) { // free plan
            this.SubscriptionRequestObj.planUniqueName = plan.planDetails.uniqueName;
            this.patchProfile({ subscriptionRequest: this.SubscriptionRequestObj });
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SubscriptionsPlansComponent.prototype, "isSubscriptionPlanShow", void 0);
    SubscriptionsPlansComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'subscriptions-plans',
            template: __webpack_require__(/*! ./subscriptions-plans.component.html */ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.html"),
            styles: [__webpack_require__(/*! ./subscriptions-plans.component.css */ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsModalService"], _services_general_service__WEBPACK_IMPORTED_MODULE_6__["GeneralService"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_7__["AuthenticationService"], _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__["CompanyActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_8__["SettingsProfileActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__["ToasterService"]])
    ], SubscriptionsPlansComponent);
    return SubscriptionsPlansComponent;
}());



/***/ }),

/***/ "./src/app/userDetails/components/subscriptions/subscriptions.component.css":
/*!**********************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions/subscriptions.component.css ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".transaction-list .box {\n    height: 400px;\n    overflow-y: auto;\n}\n\n.campanien-list ul {\n    list-style-type: none;\n    height: 300px;\n    overflow-y: auto;\n}\n\n.transaction-list .campanien-list {\n    min-height: 0;\n}\n\n.subscription-table th {\n    padding: 15px !important;\n    font-family: 'LatoWebMedium' !important;\n}\n\n.subscription-table tbody tr td,\n.head-title {\n    border: 0px;\n    font-size: 15px;\n    padding: 15px !important;\n    font-family: inherit !important;\n}\n\n.transection-popup {\n    position: absolute;\n    right: 0;\n    top: -60px;\n    background: #FFF7F7;\n    font-size: 14px;\n    padding: 12px;\n    border-radius: 3px;\n    border: 1px solid #E01B1B;\n}\n\n.subscription-dropdown {\n    /* overflow: hidden; */\n    display: block;\n    clear: both;\n    padding-bottom: 25px;\n}\n\n.subscription-dropdown .btn {\n    border: 1px solid #C4C0C0;\n    width: 342px;\n    text-align: left;\n    background: white;\n}\n\n.subscription-dropdown .btn .caret {\n    margin-top: 9px;\n    float: right;\n}\n\n.subscription-dropdown .dropdown-menu {\n    width: 342px;\n    margin-top: 9px;\n    max-height: 300px;\n    overflow-y: auto;\n}\n\n.subscription-dropdown .dropdown-menu li {\n    padding: 5px 4px;\n    border-bottom: 1px solid #e6e6e6;\n    -webkit-transition: .5s all ease;\n    transition: .5s all ease;\n}\n\n.subscription-dropdown li a {\n    display: block;\n    -webkit-box-align: center;\n            align-items: center;\n    position: relative;\n    padding-right: 60px;\n}\n\n.subscription-dropdown li:hover a,\n.subscription-dropdown li:hover {\n    background: #f1f1f1;\n    color: #FF5F00;\n}\n\n.subscription-dropdown li:hover a strong {\n    color: #FF5F00;\n}\n\n.subscription-dropdown .dropdown-menu li a span {\n    position: absolute;\n    top: 40%;\n    right: 8px;\n}\n\n@media only screen and (max-width: 767px) {\n    .transection-popup {\n        position: relative;\n        top: 0px;\n    }\n}"

/***/ }),

/***/ "./src/app/userDetails/components/subscriptions/subscriptions.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions/subscriptions.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"this.subscriptions.length\">\n    <div *ngIf=\"!isPlanShow\">\n        <div class=\"clearfix mrT2\">\n            <div class=\"row\">\n                <div class=\"col-md-3 col-sm-6\">\n                    <div class=\"form-group\">\n                        <label class=\"d-block mb-1\">Select Subscribed Plan</label>\n                        <div class=\"btn-group d-block subscription-dropdown mb-2\" dropdown>\n                            <button id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn dropdown-toggle\" aria-controls=\"dropdown-basic\">\n                           {{seletedUserPlans?.planDetails?.name}} <span class=\"caret\"></span>\n                            </button>\n                            <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n                                <li *ngIf=\"subscriptions.length==0\">No results found</li>\n                                <li *ngFor=\"let item of subscriptions\" role=\"menuitem\" class=\"cursor-pointer\">\n                                    <a (click)=\"selectedSubscriptionPlan(item);\">\n                                        <div class=\"clearfix\">\n                                            <p><strong>{{item?.planDetails?.name}}</strong> </p>\n\n                                            <p>Subscribed on {{item?.startedAt}} </p>\n                                            <p>Companies: {{item?.totalCompanies}} out of {{item?.planDetails?.companiesLimit}} </p>\n                                        </div>\n                                        <span class=\"text-warning\" *ngIf=\"item?.status==='trial'\">{{item?.status | titlecase}}</span>\n                                        <span class=\"text-success\" *ngIf=\"item?.status==='active'\">{{item?.status | titlecase}}</span>\n                                        <span class=\"text-danger\" *ngIf=\"item?.status==='expired'\">{{item?.status | titlecase}}</span>\n                                    </a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-9 col-sm-6 text-right xs-left\">\n                    <!-- *ngIf=\"seletedUserPlans?.additionalCharges >0\" -->\n                    <button type=\"button\" *ngIf=\"seletedUserPlans?.additionalCharges >0\" (click)=\"GoToBillingDetails();\" class=\"btn btn-blue mt-2\">Pay Now</button>\n                    <button type=\"button\" (click)=\"isPlanShow=true\" class=\"btn btn-green mt-2\">Buy New Plan</button>\n                </div>\n            </div>\n\n\n            <div class=\"row\">\n                <div class=\"col-md-3\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table table-no-border mb-0\">\n                            <tr>\n                                <th>Subscription ID</th>\n                                <td>{{seletedUserPlans?.subscriptionId}}</td>\n                            </tr>\n                            <tr>\n                                <th> Subscription Price</th>\n                                <td>{{seletedUserPlans?.planDetails?.amount | number}}</td>\n                            </tr>\n                            <tr>\n                                <th>Total Companies</th>\n                                <td>{{ seletedUserPlans?.totalCompanies | number}} out of {{ seletedUserPlans?.planDetails?.companiesLimit | number}}</td>\n                            </tr>\n                            <tr>\n                                <th>Transactions Limit</th>\n                                <td>{{seletedUserPlans?.planDetails?.transactionLimit | number}}</td>\n                            </tr>\n                            <tr>\n                                <th> Validity</th>\n                                <td>{{seletedUserPlans?.planDetails?.duration}} {{seletedUserPlans?.planDetails?.durationUnit}}</td>\n                            </tr>\n                        </table>\n                    </div>\n\n                    <div class=\"clearfix mb-2\">\n                        <button type=\"button\" class=\"btn btn-primary\" (click)=\"isPlanShow=true\">Change Plan</button>\n                        <button type=\"button\" (click)=\"isPlanShow=true\" class=\"btn btn-blue\">Payment Log</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"clearfix mrT2 relative\">\n            <div class=\"transection-popup mb-1\" *ngIf=\"seletedUserPlans?.additionalCharges >0\">\n                <p>You have crossed transactions limit of your </p>\n                <p><strong>Professional Plan subscribed on {{seletedUserPlans?.startedAt}}!</strong></p>\n                <p><small>Please renew your plan or pay now to continue subscription.</small></p>\n            </div>\n\n            <h2 class=\"subscription-title\" *ngIf=\"subscriptions\">Professional Plan <span *ngIf=\"seletedUserPlans?.startedAt\">({{seletedUserPlans?.startedAt}})</span></h2>\n            <div class=\"row\">\n                <div class=\"col-sm-7 transaction-list\">\n                    <div class=\"box clearfix mrT2 no-padding\">\n                        <div class=\"table-responsive\">\n                            <table class=\"table basic mr0 subscription-table\">\n                                <thead>\n                                    <tr>\n                                        <!-- <th>Date</th> <span class=\"text-light-2\">(previous+current)</span>-->\n                                        <th>Transactions</th>\n                                        <th>Balance</th>\n                                        <th>Additional Charges</th>\n                                    </tr>\n                                </thead>\n                                <tbody *ngIf=\"seletedUserPlans\">\n                                    <tr>\n                                        <!-- <td class=\"professional-name\">{{ moment(transaction.from, 'DD-MM-YYYY').format('MMM - YY')}}</td> -->\n                                        <td>{{ seletedUserPlans?.totalTransactions ? seletedUserPlans?.totalTransactions : 0 }}</td>\n                                        <!-- <span class=\"text-light ml-05\">({{transaction.previousTransactionCount}}+{{transaction.currentTransactionCount}})</span> -->\n                                        <td>{{ seletedUserPlans?.balance? seletedUserPlans?.balance: 0 }}</td>\n                                        <td class=\"text-danger\">{{ seletedUserPlans?.additionalCharges? seletedUserPlans?.additionalCharges: 0 }}</td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                        </div>\n                    </div>\n\n                    <div class=\"mrT2\">\n                        <p><small>* Additional charges on transactions above 40,000 @ 0.10 Rs. per transaction</small></p>\n                        <p><small>* Each month includes previous month's transactions</small></p>\n                    </div>\n                </div>\n\n\n                <div class=\"col-sm-5 transaction-list\">\n                    <div class=\"box2 clearfix mrT2\">\n                        <div class=\"head-title\">\n                            <h3>Companies Name + Total Transactions (till today)</h3>\n                        </div>\n                        <div class=\"clearfix\">\n                            <div class=\"mt-1 mb-1 mr-2 ml-2\">\n                                <input type=\"search\" class=\"form-control\" [(ngModel)]=\"srchString\" (ngModelChange)=\"filterCompanyList($event)\" placeholder=\"Search Company here\">\n                            </div>\n                            <div class=\"campanien-list\" *ngIf=\"subscriptions\">\n                                <ul>\n                                    <li *ngFor=\"let company of selectedPlanCompanies \"><a href=\"javascript:void(0)\" (click)=\"openModal(template, company, subscriptions[0])\">{{company.name}}<span>{{company.transactions}}</span></a></li>\n                                </ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</ng-container>\n<div *ngIf=\"!this.subscriptions.length\">\n    <div class=\"no-data mrT2 d-flex\" style=\"justify-content: center;align-items: center;margin-top:125px;margin-bottom: 105px;\">\n        <div class=\"giddh-spinner vertical-center-spinner\"></div>\n    </div>\n</div>\n\n\n\n<!-- Modal start -->\n<!-- <ng-template #template>\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n\n    <div class=\"modal-body\">\n        <div class=\"modal-list mrB1\">\n            <ul>\n                <li>\n                    <h3 class=\"\">Company Name:</h3> {{ modalRef.content.company.name }}\n                </li>\n                <li>\n                    <h3 class=\"\">Plan:</h3> {{ modalRef.content.subscription.plan.planName }} ({{ modalRef.content.subscription.subscribedOn }})\n                </li>\n                <li>\n                    <h3 class=\"\">Status:</h3> <a href=\"javascript:void(0)\" class=\"text-green\">{{ subscriptionStatus[modalRef.content.subscription.status] }}</a>\n                </li>\n            </ul>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table basic mr0 \">\n                <thead>\n                    <tr>\n                        <th>Date</th>\n                        <th>Company's Transactions <span class=\"d-block text-light-2\">(previous+current)</span></th>\n                        <th>Plan's Transactions<span class=\"d-block text-light-2\">(previous+current)</span></th>\n                    </tr>\n\n                    <tr *ngFor=\"let companyTransaction of companyTransactions\">\n                        <td>{{ moment(companyTransaction.from, 'DD-MM-YYYY').format('MMM') }}</td>\n                        <td>{{ companyTransaction.totalTransactionCount }} ({{companyTransaction.previousTransactionCount}}+{{companyTransaction.currentTransactionCount}})</td>\n                        <td>{{ companyTransaction.totalPlanTransactionCount }} ({{companyTransaction.previousPlanTransactionCount}}+{{companyTransaction.currentPlanTransactionCount}})</td>\n                    </tr>\n\n                </thead>\n            </table>\n        </div>\n\n    </div>\n</ng-template> -->\n<!-- Modal end -->\n\n<!-- <div *ngIf=\"!isOn\">dfadfsasdf</div>\n\n<button label=\"Results\" (click)=\"isOn= true\">Results</button> -->\n\n\n<subscriptions-plans *ngIf=\"isPlanShow\" (isSubscriptionPlanShow)=\"isSubscriptionPlanShow($event)\"></subscriptions-plans>"

/***/ }),

/***/ "./src/app/userDetails/components/subscriptions/subscriptions.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/userDetails/components/subscriptions/subscriptions.component.ts ***!
  \*********************************************************************************/
/*! exports provided: SubscriptionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubscriptionsComponent", function() { return SubscriptionsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_userSubscriptions_subscriptions_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/userSubscriptions/subscriptions.action */ "./src/app/actions/userSubscriptions/subscriptions.action.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");









var SubscriptionsComponent = /** @class */ (function () {
    function SubscriptionsComponent(store, _subscriptionsActions, modalService, _route, activeRoute) {
        this.store = store;
        this._subscriptionsActions = _subscriptionsActions;
        this.modalService = modalService;
        this._route = _route;
        this.activeRoute = activeRoute;
        this.subscriptions = [];
        this.isPlanShow = false;
        this.srchString = '';
        this.moment = moment__WEBPACK_IMPORTED_MODULE_7__;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
        this.subscriptions$ = this.store.select(function (s) { return s.subscriptions.subscriptions; })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    SubscriptionsComponent.prototype.ngOnInit = function () {
        // this.getSubscriptionList();
        var _this = this;
        this.subscriptions$.subscribe(function (userSubscriptions) {
            _this.subscriptions = userSubscriptions;
            if (_this.subscriptions.length > 0) {
                _this.seletedUserPlans = _this.subscriptions[0];
                if (_this.seletedUserPlans.companiesWithTransactions)
                    _this.selectedPlanCompanies = _this.seletedUserPlans.companiesWithTransactions;
            }
        });
        this.activeRoute.queryParams.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (val) {
            if (val.isPlanPage) {
                _this.isPlanShow = true;
            }
        });
    };
    SubscriptionsComponent.prototype.ngAfterViewInit = function () {
        if (this.subscriptions.length > 0) {
            this.seletedUserPlans = this.subscriptions[0];
            if (this.seletedUserPlans.companiesWithTransactions)
                this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
        }
    };
    SubscriptionsComponent.prototype.GoToBillingDetails = function () {
        this._route.navigate(['billing-detail', 'buy-plan']);
    };
    SubscriptionsComponent.prototype.selectedSubscriptionPlan = function (subsciption) {
        if (subsciption) {
            this.seletedUserPlans = subsciption;
            if (this.seletedUserPlans.companiesWithTransactions)
                this.selectedPlanCompanies = this.seletedUserPlans.companiesWithTransactions;
        }
    };
    SubscriptionsComponent.prototype.isSubscriptionPlanShow = function (event) {
        if (event) {
            this.isPlanShow = !event;
        }
    };
    SubscriptionsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SubscriptionsComponent.prototype.filterCompanyList = function (ev) {
        var companies = [];
        companies = this.seletedUserPlans.companiesWithTransactions;
        var filterd = companies.filter(function (cmp) {
            return cmp.name.toLowerCase().includes(ev.toLowerCase());
        });
        this.selectedPlanCompanies = filterd;
    };
    SubscriptionsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'subscriptions',
            template: __webpack_require__(/*! ./subscriptions.component.html */ "./src/app/userDetails/components/subscriptions/subscriptions.component.html"),
            styles: [__webpack_require__(/*! ./subscriptions.component.css */ "./src/app/userDetails/components/subscriptions/subscriptions.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _actions_userSubscriptions_subscriptions_action__WEBPACK_IMPORTED_MODULE_6__["SubscriptionsActions"],
            ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsModalService"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["ActivatedRoute"]])
    ], SubscriptionsComponent);
    return SubscriptionsComponent;
}());



/***/ }),

/***/ "./src/app/userDetails/userDetails.component.html":
/*!********************************************************!*\
  !*** ./src/app/userDetails/userDetails.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-12\" id=\"settingTab\">\n    <!-- start of tab set -->\n    <tabset #staticTabs>\n\n        <!-- start auth tab tab -->\n        <tab heading=\"Auth Key\">\n            <div class=\"box clearfix mrT2\">\n                <h1 class=\"section_head pdT0\">Main Auth-key</h1>\n                <form name=\"authKeyForm\" #authKeyForm=\"ngForm\" novalidate role=\"form\">\n                    <div class=\"form-group col-xs-6\">\n                        <div class=\"row\">\n                            <input id=\"authKey\" class=\"form-control\" name=\"userAuthKey\" [(ngModel)]=\"userAuthKey\" [readonly]=\"true\" />\n                        </div>\n                    </div>\n                    <div class=\"form-group clearfix\">\n                        <button class=\"btn btn-default\" (click)=\"regenerateKey()\">Regenerate Auth Key</button>\n                        <a class=\"btn btn-link\" href=\"https://developers.giddh.com/collection/giddh-api-integration/46/pages/140\" target=\"_blank\">Documentation</a>\n                    </div>\n                </form>\n            </div>\n        </tab>\n        <!-- end of auth tab tab -->\n        <tab heading=\"Mobile Number\" select=\"getUserDetails()\">\n            <div class=\"box clearfix mrT2\">\n                <form class=\"\" name=\"mobileForm\" novalidate>\n                    <h1 class=\"section_head\">Add/Edit Mobile Number</h1>\n                    <div class=\"mrT\">\n                        <!-- ng-minlength=\"10\" pattern=\"/^[0-9]{1,10}$/\"  -->\n                        <input decimalDigitsDirective maxlength=\"10\" class=\"form-control max350 pull-left \" type=\"text\" ng-required=\"true\" placeholder=\"9998899988\" name=\"mobileForm.phoneNumber\" [(ngModel)]=\"phoneNumber\" />\n                        <button class=\"btn btn-success btn-sm mrL1\" [ladda]=\"isAddNewMobileNoInProcess$ | async\" (click)=\"addNumber(phoneNumber)\">Add\n            </button>\n                    </div>\n                    <p class=\"mrT1\">\n                        <b>Note: </b>Format should be like 9898989898</p>\n                </form>\n\n                <div class=\"pd2 clearfix\" *ngIf=\"showVerificationBox\" style=\"padding-top:0;\">\n                    <hr>\n                    <h1 class=\"mrT2\">Enter verification Code</h1>\n                    <div class=\"max350 mrT\">\n                        <input class=\"form-control\" type=\"text\" placeholder=\"Verification Code\" [(ngModel)]=\"oneTimePassword\" />\n                    </div>\n                    <button class=\"btn btn-success mrT\" [ladda]=\"isVerifyAddNewMobileNoInProcess$ | async\" (click)=\"verifyNumber()\">Verify\n          </button>\n                </div>\n                <section class=\"row\">\n                    <div class=\"container adjust-width pull-left\">\n                        <div class=\"row\">\n                            <div class=\"col-sm-12 mrT1\">\n                                <button class=\"btn btn-link btn-xs\" (click)=\"expandLongCode = !expandLongCode\">\n                  <i class=\"icon-plus\" [ngClass]=\"{'icon-minus':expandLongCode}\"></i> Long Code Hints (Long code no. :\n                  9229224424)\n                </button>\n                                <div class=\"longcode-details\" *ngIf=\"expandLongCode\">\n                                    <figure>\n                                        <h1 class=\"section_head\">Accounts</h1>\n                                        <ul>\n                                            <li>\n                                                <h2>Case 1:</h2>\n                                                <div class=\"cases\">\n                                                    <p>SMS format : Keyword accountName/uniqueName</p>\n                                                    <p>Example : Giddh1 federal bank</p>\n                                                    <p>This will return balance details of particular account. With last five transactions.</p>\n                                                </div>\n                                            </li>\n                                            <li>\n                                                <h2>Case 2:</h2>\n                                                <div class=\"cases\">\n                                                    <p>SMS format : Keyword accountName/uniqueName all</p>\n                                                    <p>Example : Giddh1 federal all</p>\n                                                    <p>This will return balance of all matched accounts.</p>\n                                                </div>\n                                            </li>\n                                        </ul>\n                                    </figure>\n                                    <figure>\n                                        <h1 class=\"section_head\">Groups</h1>\n                                        <ul>\n                                            <li>\n                                                <h2>Case 1:</h2>\n                                                <div class=\"cases\">\n                                                    <p>SMS format : Keyword group groupName/uniqueName</p>\n                                                    <p>Example : Giddh1 group sundry_debtors</p>\n                                                    <p>This will return balance details of all matched group. And closing balance of all subgroups (with closing balance only).</p>\n                                                </div>\n                                            </li>\n                                        </ul>\n                                    </figure>\n                                    <figure>\n                                        <h1 class=\"section_head\">Net worth</h1>\n                                        <ul>\n                                            <li>\n                                                <h2>Case 1</h2>\n                                                <div class=\"cases\">\n                                                    <p>SMS format : Keyword networth</p>\n                                                    <p>Example : Giddh1 networth</p>\n                                                    <p>This will return net worth of last six months.</p>\n                                                </div>\n                                            </li>\n                                        </ul>\n                                    </figure>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </section>\n\n                <div class=\"mrT2\">\n                    <!--two way auth-->\n                    <h1 class=\"section_head\"><input type=\"checkbox\" (change)=\"changeTwoWayAuth()\" [(ngModel)]=\"twoWayAuth\" /> Two Way Authentication</h1>\n                    <p class=\"grey\" *ngIf=\"twoWayAuth\">You will need to enter verification code at the time of login.</p>\n                </div>\n            </div>\n        </tab>\n        <!-- end of Mobile Number tab tab -->\n\n        <!-- start session tab tab -->\n        <tab heading=\"Session\" [active]=\"\">\n            <div class=\"box clearfix mrT2\">\n                <h1 class=\"section_head pdT0\">Activity History</h1>\n                <button class=\"btn btn-primary\" (click)=\"clearAllSession()\">Delete All</button>\n                <p class=\"grey_clr\">Access and manage your activity history details from anywhere at anytime. This will help you to monitor all your account access.</p>\n                <div class=\"max900 row mrT1\">\n                    <table class=\"table-bordered basic table\">\n                        <thead>\n                            <tr>\n                                <th>IP Address</th>\n                                <th>Signin Date</th>\n                                <th>Signin Time</th>\n                                <th>Duration (DD/HH/MM/SS)</th>\n                                <th>Browser Agent</th>\n                                <th class=\"text-center\">Action</th>\n                            </tr>\n                        </thead>\n                        <tbody *ngIf=\"userSessionList.length\">\n                            <!-- <tr>\n                <td>111.118.250.236</td>\n                <td>02/04/2018</td>\n                <td>11:22:00</td>\n                <td>0d:01:55:02</td>\n                <td>Chrome</td>\n                <td class=\"ico-btn text-center\">\n                </td>\n            </tr> -->\n                            <tr *ngFor=\"let session of userSessionList\">\n                                <td>{{ session.ipAddress }}</td>\n                                <td>{{ moment(session.createdAt).format('DD/MM/YYYY') }}</td>\n                                <td>{{ moment(session.createdAt).format('LTS') }}</td>\n                                <td>{{moment(session.createdAt).subtract(moment(), 'days')}}</td>\n                                <td> {{ session.userAgent }}</td>\n                                <td class=\"ico-btn text-center\">\n                                    <span *ngIf=\"userSessionId === session.sessionId\">Current</span>\n                                    <button type=\"button\" class=\"btn btn-xs\" (click)=\"deleteSession(session.sessionId)\" *ngIf=\"userSessionId !== session.sessionId\">\n                  <i class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i>\n                </button>\n                                </td>\n                            </tr>\n\n                        </tbody>\n                        <tbody *ngIf=\"!userSessionList.length\">\n                            <tr>\n                                <td colspan=\"6\" class=\"text-center empty_table\">\n                                    <h1>No Record Found !!</h1>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </tab>\n\n        <tab heading=\"Subscription\" [active]=\"\">\n            <subscriptions></subscriptions>\n        </tab>\n\n        <tab heading=\"Company\">\n            <user-detail-company></user-detail-company>\n        </tab>\n        <!-- end of session tab -->\n\n    </tabset>\n    <!-- end of tab set -->\n</div>"

/***/ }),

/***/ "./src/app/userDetails/userDetails.component.ts":
/*!******************************************************!*\
  !*** ./src/app/userDetails/userDetails.component.ts ***!
  \******************************************************/
/*! exports provided: UserDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsComponent", function() { return UserDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../models/api-models/loginModels */ "./src/app/models/api-models/loginModels.ts");
/* harmony import */ var _actions_login_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/login.action */ "./src/app/actions/login.action.ts");
/* harmony import */ var _actions_userSubscriptions_subscriptions_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../actions/userSubscriptions/subscriptions.action */ "./src/app/actions/userSubscriptions/subscriptions.action.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_session_action__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../actions/session.action */ "./src/app/actions/session.action.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");



















var UserDetailsComponent = /** @class */ (function () {
    function UserDetailsComponent(store, _toasty, _loginAction, _loginService, loginAction, _subscriptionsActions, _companyService, _companyActions, router, _sessionAction, _route, modalService) {
        this.store = store;
        this._toasty = _toasty;
        this._loginAction = _loginAction;
        this._loginService = _loginService;
        this.loginAction = loginAction;
        this._subscriptionsActions = _subscriptionsActions;
        this._companyService = _companyService;
        this._companyActions = _companyActions;
        this.router = router;
        this._sessionAction = _sessionAction;
        this._route = _route;
        this.modalService = modalService;
        this.userAuthKey = '';
        this.expandLongCode = false;
        this.twoWayAuth = false;
        this.phoneNumber = '';
        this.oneTimePassword = '';
        this.countryCode = '';
        this.showVerificationBox = false;
        this.amount = 0;
        this.discount = 0;
        this.payStep2 = false;
        this.payStep3 = false;
        this.isHaveCoupon = false;
        this.couponcode = '';
        this.payAlert = [];
        this.directPay = false;
        this.disableRazorPay = false;
        this.coupRes = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_11__["GetCouponResp"]();
        this.selectedCompany = null;
        this.user = null;
        this.apiTabActivated = false;
        this.userSessionList = [];
        this.moment = moment__WEBPACK_IMPORTED_MODULE_16__;
        this.giddhDateFormatUI = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT_UI"];
        this.userSessionId = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.contactNo$ = this.store.select(function (s) {
            if (s.session.user) {
                return s.session.user.user.contactNo;
            }
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.countryCode$ = this.store.select(function (s) {
            if (s.session.user) {
                return s.session.user.countryCode;
            }
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isAddNewMobileNoInProcess$ = this.store.select(function (s) { return s.login.isAddNewMobileNoInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isAddNewMobileNoSuccess$ = this.store.select(function (s) { return s.login.isAddNewMobileNoSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isVerifyAddNewMobileNoInProcess$ = this.store.select(function (s) { return s.login.isVerifyAddNewMobileNoInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isVerifyAddNewMobileNoSuccess$ = this.store.select(function (s) { return s.login.isVerifyAddNewMobileNoSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.userSessionResponse$ = this.store.select(function (s) { return s.userLoggedInSessions.Usersession; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.authenticateTwoWay$ = this.store.select(function (s) {
            if (s.session.user) {
                return s.session.user.user.authenticateTwoWay;
            }
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    UserDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.queryParams.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (val) {
            if (val && val.tab && val.tabIndex) {
                _this.selectTab(val.tabIndex);
            }
        });
        this.router.events
            .subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_14__["NavigationEnd"]) {
                if (event.urlAfterRedirects.indexOf('/profile') !== -1) {
                    _this.apiTabActivated = false;
                }
                else {
                    _this.apiTabActivated = true;
                }
            }
        });
        //  this.getSubscriptionList();     // commented due todesign and API get changed
        // console.log(RazorPay);
        this.contactNo$.subscribe(function (s) { return _this.phoneNumber = s; });
        this.countryCode$.subscribe(function (s) { return _this.countryCode = s; });
        this.isAddNewMobileNoSuccess$.subscribe(function (s) { return _this.showVerificationBox = s; });
        this.isVerifyAddNewMobileNoSuccess$.subscribe(function (s) {
            if (s) {
                _this.oneTimePassword = '';
                _this.showVerificationBox = false;
            }
        });
        this.authenticateTwoWay$.subscribe(function (s) { return _this.twoWayAuth = s; });
        this.store.dispatch(this.loginAction.FetchUserDetails());
        this._loginService.GetAuthKey().subscribe(function (a) {
            if (a.status === 'success') {
                _this.userAuthKey = a.body.authKey;
            }
            else {
                _this._toasty.errorToast(a.message, a.status);
            }
        });
        this.store.select(function (s) { return s.subscriptions.companies; })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$))
            .subscribe(function (s) { return _this.companies = s; });
        this.store.select(function (s) { return s.subscriptions.companyTransactions; })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$))
            .subscribe(function (s) { return _this.companyTransactions = s; });
        this.store.select(function (s) { return s.session; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (session) {
            var companyUniqueName;
            if (session.companyUniqueName) {
                companyUniqueName = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"])(session.companyUniqueName);
            }
            if (session.companies && session.companies.length) {
                var companies = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"])(session.companies);
                _this.selectedCompany = companies.find(function (company) { return company.uniqueName === companyUniqueName; });
            }
            if (session.user) {
                _this.user = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"])(session.user.user);
                _this.userSessionId = _.cloneDeep(session.user.session.id);
            }
        });
        var cmpUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return cmpUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_11__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = cmpUniqueName;
        stateDetailsRequest.lastState = 'user-details';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.userSessionResponse$.subscribe(function (s) {
            if (s && s.length) {
                _this.userSessionList = s;
            }
            else {
                _this.store.dispatch(_this._sessionAction.getAllSession());
            }
        });
    };
    UserDetailsComponent.prototype.addNumber = function (no) {
        this.oneTimePassword = '';
        var mobileRegex = /^[0-9]{1,10}$/;
        if (mobileRegex.test(no) && (no.length === 10)) {
            var request = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_6__["SignupWithMobile"]();
            request.countryCode = Number(this.countryCode) || 91;
            request.mobileNumber = this.phoneNumber;
            this.store.dispatch(this._loginAction.AddNewMobileNo(request));
        }
        else {
            this._toasty.errorToast('Please enter number in format: 9998899988');
        }
    };
    UserDetailsComponent.prototype.verifyNumber = function () {
        var request = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_6__["VerifyMobileModel"]();
        request.countryCode = Number(this.countryCode) || 91;
        request.mobileNumber = this.phoneNumber;
        request.oneTimePassword = this.oneTimePassword;
        this.store.dispatch(this._loginAction.VerifyAddNewMobileNo(request));
    };
    // public getSubscriptionList() {
    //   this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
    //   this.store.select(s => s.subscriptions.subscriptions)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe(s => {
    //       if (s && s.length) {
    //         this.subscriptions = s;
    //         this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesList(s && s[0]));
    //         this.store.dispatch(this._subscriptionsActions.SubscribedUserTransactions(s && s[0]));
    //         this.store.select(s => s.subscriptions.transactions)
    //           .pipe(takeUntil(this.destroyed$))
    //           .subscribe(s => this.transactions = s);
    //       }
    //     });
    // }
    UserDetailsComponent.prototype.changeTwoWayAuth = function () {
        var _this = this;
        this._loginService.SetSettings({ authenticateTwoWay: this.twoWayAuth }).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.successToast(res.body);
            }
            else {
                _this._toasty.errorToast(res.message);
            }
        });
    };
    UserDetailsComponent.prototype.addMoneyInWallet = function () {
        if (this.amount < 100) {
            this._toasty.warningToast('You cannot make payment', 'Warning');
        }
        else {
            this.payStep2 = true;
        }
    };
    UserDetailsComponent.prototype.resetSteps = function () {
        this.amount = 0;
        this.payStep2 = false;
        this.payStep3 = false;
        this.isHaveCoupon = false;
    };
    UserDetailsComponent.prototype.redeemCoupon = function () {
        var _this = this;
        this._companyService.getCoupon(this.couponcode).subscribe(function (res) {
            if (res.status === 'success') {
                _this.coupRes = res.body;
                switch (res.body.type) {
                    case 'balance_add':
                        _this.directPay = true;
                        _this.disableRazorPay = true;
                        break;
                    case 'cashback':
                        break;
                    case 'cashback_discount':
                        _this.discount = 0;
                        break;
                    case 'discount':
                        break;
                    case 'discount_amount':
                        break;
                    default:
                        _this._toasty.warningToast('Something went wrong', 'Warning');
                }
            }
            else {
                _this._toasty.errorToast(res.message, res.status);
                _this.payAlert.push({ msg: res.message, type: 'warning' });
            }
        });
    };
    UserDetailsComponent.prototype.checkDiffAndAlert = function (type) {
        this.directPay = false;
        switch (type) {
            case 'cashback_discount':
                this.disableRazorPay = false;
                return this.payAlert.push({ msg: "Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. {$scope.cbDiscount}" });
            case 'cashback':
                if (this.amount < this.coupRes.value) {
                    this.disableRazorPay = true;
                    return this.payAlert.push({ msg: "Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. " + this.coupRes.value });
                }
                else {
                    this.disableRazorPay = false;
                    return this.payAlert.push({ type: 'success', msg: "Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. " + this.coupRes.value });
                }
            case 'discount':
                var diff = this.amount - this.discount;
                if (diff < 100) {
                    this.disableRazorPay = true;
                    return this.payAlert.push({ msg: "After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. " + diff });
                }
                else {
                    this.disableRazorPay = false;
                    return this.payAlert.push({ type: 'success', msg: "Hurray you have availed a discount of Rs. " + this.discount + ". Now payable amount is Rs. " + diff });
                }
            case 'discount_amount':
                diff = this.amount - this.discount;
                if (diff < 100) {
                    this.disableRazorPay = true;
                    return this.payAlert.push({ msg: "After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. " + diff });
                }
                else if (this.amount < this.coupRes.value) {
                    this.disableRazorPay = true;
                    return this.payAlert.push({ msg: "Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. " + this.coupRes.value });
                }
                else {
                    this.disableRazorPay = false;
                    return this.payAlert.push({ type: 'success', msg: "Hurray you have availed a discount of Rs. " + this.discount + ". Now payable amount is Rs. " + diff });
                }
        }
    };
    UserDetailsComponent.prototype.closeAlert = function (index) {
        this.payAlert.splice(index, 1);
    };
    UserDetailsComponent.prototype.regenerateKey = function () {
        var _this = this;
        this._loginService.RegenerateAuthKey().subscribe(function (a) {
            if (a.status === 'success') {
                _this.userAuthKey = a.body.authKey;
            }
            else {
                _this._toasty.errorToast(a.message, a.status);
            }
        });
    };
    UserDetailsComponent.prototype.payWithRazor = function () {
        var options = {
            key: 'rzp_live_rM2Ub3IHfDnvBq',
            amount: this.amount,
            name: 'Giddh',
            description: this.selectedCompany.name + " Subscription for Giddh",
            // tslint:disable-next-line:max-line-length
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAtCAMAAAAwerGLAAAAA3NCSVQICAjb4U/gAAAAXVBMVEX////HPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyB24UK9AAAAH3RSTlMAEREiIjMzRERVVWZmd3eIiJmZqqq7u8zM3d3u7v//6qauNwAAAAlwSFlzAAAK8AAACvABQqw0mAAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAA/BJREFUWIXdme2CqiAQhlsjInN1ouSYy3r/l3lAvpFK0raz5/1FSPgwwMyAm81/oe2xObVte2oO23ejzNSuuX47XZtl3Kik5aQS1xTpYlHZ4vPat9+xzrsn+0LA+mEYIKgkwETdQOTzEjpRxAuRt1NkqdPHU72RYVQIDaqycMWFzIevJLNYJM8ZG5XSktHyIDXXpKi+LIdubiBLHZ/rstIrIRBzpN1S6JPH2DZSbRY1DLyK68gDaLYQ2tn5fDB1H8d2NrU06hB7ghnQ3QLmgzVyuH73f8yDB+sahgTgDGj2PPPW7MHPySMzBdf7PgQLFB5Xvhb6rMC+9olnR03d3O+ipDBxuS+F3muuFLOjzg+OL4Vub60NJe1YTtn9vhJ6p/fgrecfOh3JjoyvhG4eTf9x4vZEOGMMAiACF/ejqIAxRkNoVFPGLn0MjUXTy8THP5Iy5Dmjhc4bBgaSDcv3+t6jAD4YWWjMbJ0PPcZ6oa7IYt4qOx7uNPlUTcxPYUFeEUtGNqUagsETxuwB1HMDLaMPBaARtFPeQlGT/zVjXDv3fskyoo6WFmvDvRYJWCoLhbc8xH84MSPyoTktEYZUPL2r5v42HHX1J6M30bfzLOmgO1tyGxGJUu1IHbReFXJ4Wcv6NCN2tF4bYrNk8PJlC125fNRBX9yKT3oPMsSZ9wO1E2hUi/1c+zujSUJXKWgPykJLQxvfkoRGi6G1b/BTzRhavatMQXt7ykL7DdN+eik0tRu6TkK73AgSaxqnoGF16GhNV54bsk42GFhvdk3v5cOGVYL2r4eOvEfvQdsYF3gPOdnSf0l3bTM7A4087xVAm+GtA30I/DT2Hb7pPfTTajJ6GTum0Bvu3m+hiTeSdaDDiEgCaP2iKCJuEJVoXd05agtN3VgsdMGdqdfxHmFmkYS+lZ1AYCrmOhijH2J2M48OicneSsmPLXTv3poH3fiTn1oeUZYnUji4iNxivCFSTZCk4iVBBnDomd4cvRxLodKijul8pQPZjSxV8j9YTk9HJmnsHYX59HQjRvl0zb0Wyrwm61PWsr9UQsSRoxa/VP/UTSm4xCnH1MHJZerywpNLHUyFyh0IaKk/EHl3xCnG/FJb61XdaOGCdlDhcXK00KY0xRzo8IzogovqJDojcj3RjCVuvX5S4Wk8DOPRaRy7JxvUZeZmqyq690DgEqb43iM490lXlrN71tX8GyYU7BdwMfsNmn+XxyPovBPHupp9awr+7ovO2z+uuffTYh335nxAcp3r6pr7JQDzgdfS0xKqwsRbdeObSxPfLGE/aGbeV7xAM79uFWCx6duZN/O/I2J5twTVv4A8Sn+xbX7PF9vfob+6UM+V7KGTkAAAAABJRU5ErkJggg==",
            prefill: {
                name: this.user.name,
                email: this.user.email,
                contact: this.user.contactNo
            },
            notes: {
                address: this.selectedCompany.address
            },
            theme: {
                color: '#449d44'
            },
            modal: {}
        };
        options.handler = (function (response) {
            //
        });
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    UserDetailsComponent.prototype.selectTab = function (id) {
        this.staticTabs.tabs[id].active = true;
    };
    UserDetailsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * deleteSession
     */
    UserDetailsComponent.prototype.deleteSession = function (sessionId) {
        this.store.dispatch(this._sessionAction.deleteSession(sessionId));
    };
    UserDetailsComponent.prototype.clearAllSession = function () {
        this.store.dispatch(this._sessionAction.deleteAllSession());
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('staticTabs'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_18__["TabsetComponent"])
    ], UserDetailsComponent.prototype, "staticTabs", void 0);
    UserDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'user-details',
            template: __webpack_require__(/*! ./userDetails.component.html */ "./src/app/userDetails/userDetails.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"],
            _actions_login_action__WEBPACK_IMPORTED_MODULE_7__["LoginActions"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_9__["AuthenticationService"],
            _actions_login_action__WEBPACK_IMPORTED_MODULE_7__["LoginActions"],
            _actions_userSubscriptions_subscriptions_action__WEBPACK_IMPORTED_MODULE_8__["SubscriptionsActions"],
            _services_companyService_service__WEBPACK_IMPORTED_MODULE_10__["CompanyService"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__["CompanyActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_14__["Router"],
            _actions_session_action__WEBPACK_IMPORTED_MODULE_15__["SessionActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_14__["ActivatedRoute"],
            ngx_bootstrap__WEBPACK_IMPORTED_MODULE_18__["BsModalService"]])
    ], UserDetailsComponent);
    return UserDetailsComponent;
}());



/***/ }),

/***/ "./src/app/userDetails/userDetails.module.ts":
/*!***************************************************!*\
  !*** ./src/app/userDetails/userDetails.module.ts ***!
  \***************************************************/
/*! exports provided: UserDetailsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsModule", function() { return UserDetailsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _userDetails_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./userDetails.routing.module */ "./src/app/userDetails/userDetails.routing.module.ts");
/* harmony import */ var _userDetails_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./userDetails.component */ "./src/app/userDetails/userDetails.component.ts");
/* harmony import */ var ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/tabs */ "../../node_modules/ngx-bootstrap/tabs/index.js");
/* harmony import */ var ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/alert */ "../../node_modules/ngx-bootstrap/alert/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "../../node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var _shared_helpers_pipes_durationPipe_duration_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../shared/helpers/pipes/durationPipe/duration.module */ "./src/app/shared/helpers/pipes/durationPipe/duration.module.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var _components_subscriptions_subscriptions_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/subscriptions/subscriptions.component */ "./src/app/userDetails/components/subscriptions/subscriptions.component.ts");
/* harmony import */ var _userDetails_pipe__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./userDetails.pipe */ "./src/app/userDetails/userDetails.pipe.ts");
/* harmony import */ var _components_company_user_details_company_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/company/user-details-company.component */ "./src/app/userDetails/components/company/user-details-company.component.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "../../node_modules/ngx-bootstrap/dropdown/index.js");
/* harmony import */ var _components_subscriptions_plans_subscriptions_plans_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/subscriptions-plans/subscriptions-plans.component */ "./src/app/userDetails/components/subscriptions-plans/subscriptions-plans.component.ts");














//import { ModalModule } from 'ngx-bootstrap';






var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var UserDetailsModule = /** @class */ (function () {
    function UserDetailsModule() {
    }
    UserDetailsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            declarations: [
                // Components / Directives/ Pipes
                _userDetails_component__WEBPACK_IMPORTED_MODULE_5__["UserDetailsComponent"],
                _components_subscriptions_subscriptions_component__WEBPACK_IMPORTED_MODULE_14__["SubscriptionsComponent"],
                _userDetails_pipe__WEBPACK_IMPORTED_MODULE_15__["UserDetailsPipe"],
                _components_company_user_details_company_component__WEBPACK_IMPORTED_MODULE_16__["UserDetailsCompanyComponent"],
                _components_subscriptions_plans_subscriptions_plans_component__WEBPACK_IMPORTED_MODULE_19__["SubscriptionsPlansComponent"]
            ],
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _userDetails_routing_module__WEBPACK_IMPORTED_MODULE_4__["UserDetailsRoutingModule"],
                ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_6__["TabsModule"],
                ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_7__["AlertModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_8__["LaddaModule"],
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_9__["PerfectScrollbarModule"],
                _shared_helpers_pipes_durationPipe_duration_module__WEBPACK_IMPORTED_MODULE_10__["DurationModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_11__["DecimalDigitsModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_12__["SharedModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_13__["ElementViewChildModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_17__["ModalModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_18__["BsDropdownModule"].forRoot(),
            ],
            providers: [
                {
                    provide: ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_9__["PERFECT_SCROLLBAR_CONFIG"],
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                }
            ]
        })
    ], UserDetailsModule);
    return UserDetailsModule;
}());



/***/ }),

/***/ "./src/app/userDetails/userDetails.pipe.ts":
/*!*************************************************!*\
  !*** ./src/app/userDetails/userDetails.pipe.ts ***!
  \*************************************************/
/*! exports provided: UserDetailsPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsPipe", function() { return UserDetailsPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var UserDetailsPipe = /** @class */ (function () {
    function UserDetailsPipe() {
    }
    UserDetailsPipe.prototype.transform = function (items, searchText) {
        if (!items)
            return [];
        if (!searchText)
            return items;
        searchText = searchText.toLowerCase();
        return items.filter(function (it) {
            return it.name.toLowerCase().includes(searchText);
        });
    };
    UserDetailsPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'search'
        })
    ], UserDetailsPipe);
    return UserDetailsPipe;
}());



/***/ }),

/***/ "./src/app/userDetails/userDetails.routing.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/userDetails/userDetails.routing.module.ts ***!
  \***********************************************************/
/*! exports provided: UserDetailsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsRoutingModule", function() { return UserDetailsRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _userDetails_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./userDetails.component */ "./src/app/userDetails/userDetails.component.ts");





var UserDetailsRoutingModule = /** @class */ (function () {
    function UserDetailsRoutingModule() {
    }
    UserDetailsRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _userDetails_component__WEBPACK_IMPORTED_MODULE_4__["UserDetailsComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]],
                        children: [
                            { path: 'profile', component: _userDetails_component__WEBPACK_IMPORTED_MODULE_4__["UserDetailsComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] }
                        ]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], UserDetailsRoutingModule);
    return UserDetailsRoutingModule;
}());



/***/ })

}]);