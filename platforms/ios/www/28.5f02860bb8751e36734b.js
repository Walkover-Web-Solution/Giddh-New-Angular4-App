(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ "./src/app/manufacturing/edit/mf.edit.component.html":
/*!***********************************************************!*\
  !*** ./src/app/manufacturing/edit/mf.edit.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"manufacture\" class=\"clearfix\">\n  <!--<div>\n      {{ manufacturingDetails | json }}\n  </div>-->\n\n  <!-- page Title -->\n  <div class=\"top_bar col-xs-12 clearfix bdrB\">\n    <h1 class=\"section_title d-inline-block\"><strong>Manufacture of Product</strong><label *ngIf=\"isUpdateCase\"\n                                                                                           class=\"mrL2\">No.\n      {{manufacturingDetails.voucherNumber}}</label></h1>\n    <button class=\"btn btn-default pull-right\" (click)=\"goBackToListPage()\" type=\"button\">Back</button>\n  </div>\n\n  <!-- form -->\n  <div class=\"col-xs-12 mrT2\">\n    <div class=\"row\">\n      <form class=\"mrB2 container pull-left\" name=\"manufaturingForm\" #manufaturingForm=\"ngForm\">\n        <div class=\"row\">\n          <div class=\"col-xs-4\">\n            <div class=\"form-group\">\n              <label class=\"d-block\">Product Name</label>\n              <sh-select [options]=\"stockListDropDown$ | async\" [disabled]=\"isUpdateCase\"\n                         (selected)=\"getStocksWithRate($event)\" [(ngModel)]=\"manufacturingDetails.stockUniqueName\"\n                         name=\"stockUniqueName\" placeholder=\"--Select product--\" [ItemHeight]=\"33\">\n              </sh-select>\n            </div>\n          </div>\n          <div class=\"col-xs-3 row\">\n            <div class=\"form-group pos-rel\">\n              <label class=\"d-block\">Quantity</label>\n              <input type=\"text\" class=\"form-control\" [disabled]=\"!manufacturingDetails.stockUniqueName\"\n                     decimalDigitsDirective [DecimalPlaces]=\"4\"\n                     (keyup)=\"onQuantityChange(manufacturingDetails.manufacturingMultipleOf)\"\n                     [(ngModel)]=\"manufacturingDetails.manufacturingMultipleOf\" name=\"manufacturingMultipleOf\"/>\n              <small class=\"pos-abs\" style=\"right:0;\">Multiple of <span *ngIf=\"manufacturingDetails.multipleOf\">{{manufacturingDetails.multipleOf | json}}</span>\n              </small>\n            </div>\n          </div>\n          <div class=\"col-xs-3\">\n\n            <div class=\"form-group mrR1\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"showFromDatePicker=false;\">\n              <label class=\"d-block\">Date</label>\n              <div class=\"input-group\">\n                <input type=\"text\" name=\"from\" [ngModel]=\"moment(manufacturingDetails.date).format('DD-MM-YYYY')\"\n                       (focus)=\"showFromDatePicker = true;\" class=\"form-control\" required/>\n                <span class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-default\"\n                                            (click)=\"showFromDatePicker = !showFromDatePicker\">\n                                    <i class=\"glyphicon glyphicon-calendar\"></i>\n                                    </button>\n                                </span>\n              </div>\n              <div *ngIf=\"showFromDatePicker\" style=\"position: absolute; z-index:10; min-height:290px;\">\n                <ul class=\"my-dropdown-menu calendar-dropdown\">\n                  <li>\n                    <datepicker name=\"fromDate\" (click)=\"$event.stopPropagation()\"\n                                [(ngModel)]=\"manufacturingDetails.date\"\n                                (selectionDone)=\"showFromDatePicker=!showFromDatePicker\"\n                                [showWeeks]=\"false\"></datepicker>\n                  </li>\n                  <li class=\"pd1 clearfix pdT pdB\">\n                                        <span class=\"btn-group pull-left\">\n                                        <button type=\"button\" class=\"btn btn-xs btn-primary mrR\"\n                                                (click)=\"setToday();showFromDatePicker = false;\">Today</button>\n                                        <button type=\"button\" class=\"btn btn-xs btn-success\"\n                                                (click)=\"showFromDatePicker = false\">Done</button>\n                                    </span>\n                    <button type=\"button\" class=\"btn btn-xs btn-link pull-right\"\n                            (click)=\"clearDate();showFromDatePicker = false;\">Clear\n                    </button>\n                  </li>\n\n                </ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n\n  <!-- form end -->\n\n  <!--  -->\n  <div class=\"col-xs-12 clearfix\" *ngIf=\"manufacturingDetails.stockUniqueName\">\n\n    <div class=\"box clearfix\">\n      <!-- right column / add more resources -->\n      <div class=\"col-xs-6 source bdrR pdL0\">\n        <h1 class=\"section_head\">Source(Consumption)</h1>\n        <section class=\"linkstock\">\n          <table class=\"col-xs-12 linkStockTbl\" *ngIf=\"manufacturingDetails\">\n            <thead>\n            <tr>\n              <th colspan=\"2\">Product Name</th>\n              <th>Quantity</th>\n              <th>Unit</th>\n              <th>Rate</th>\n              <th>Amount</th>\n              <th>&nbsp;</th>\n            </tr>\n            </thead>\n            <tbody *ngIf=\"manufacturingDetails\">\n            <tr *ngFor=\"let stock of manufacturingDetails.linkedStocks; let i = index;\">\n              <td colspan=\"2\"><span class=\"hr\"></span>{{ stock.stockUniqueName }}</td>\n              <td>{{ stock.quantity | number:'1.0-4'}}</td>\n              <td *ngIf=\"stock.manufacturingUnit; else unitCode\">{{ stock.manufacturingUnit }}</td>\n              <ng-template #unitCode>\n                <td>{{ stock.stockUnitCode }}</td>\n              </ng-template>\n              <!--<td><input type=\"text\" [(ngModel)]=\"stock.quantity\" name=\"quantity_{{i}}\"></td>-->\n              <td>{{ stock.rate | number:'1.0-4'}}</td>\n              <!--<td><input type=\"text\" [(ngModel)]=\"stock.rate\" name=\"rate_{{i}}\"></td>-->\n              <td>{{ stock.amount | number:'1.0-2'}}</td>\n              <td class=\"action\"><i class=\"fa fa-times\" (click)=\"removeConsumptionItem(i)\" aria-hidden=\"true\"></i>\n              </td>\n            </tr>\n\n            <tr *ngIf=\"toggleAddLinkedStocks\" class=\"new-row\">\n              <td colspan=\"2\">\n                <span class=\"hr\"></span>\n                <!-- <div class=\"custom-select pos-rel\"> -->\n                <!-- <select class=\"form-control\" >\n                        <option value=\"\" [selected]=\"true\">-Select-</option>\n                        <option [ngValue]=\"stock.value\" *ngFor=\"let stock of allStocksDropDown$ | async\" >{{ stock.label }}</option>\n                    </select>\n                    <span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span> -->\n                <!-- </div> -->\n                <sh-select [forceClearReactive]=\"needForceClearProductList$ | async\" placeholder=\"--Select--\"\n                           [options]=\"allStocksDropDown$ | async\" name=\"linkedStocks.stockUniqueName\"\n                           [(ngModel)]=\"linkedStocks.stockUniqueName\" required #linkedStockList=\"ngModel\"\n                           (selected)=\"getStockUnit(linkedStocks.stockUniqueName, linkedStocks.quantity)\"\n                           [ItemHeight]=\"33\"></sh-select>\n              </td>\n              <td>\n                <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"4\" required class=\"form-control text-right\"\n                       (blur)=\"getStockUnit(linkedStocks.stockUniqueName, linkedStocks.quantity)\"\n                       [(ngModel)]=\"linkedStocks.quantity\" #linkedStockQuantity=\"ngModel\">\n              </td>\n              <td><input type=\"text\" class=\"form-control text-right\" [(ngModel)]=\"linkedStocks.manufacturingUnit\"\n                         [disabled]=\"true\"></td>\n              <!--<td *ngIf=\"!isUpdateCase\">{{linkedStocks.stockUnitCode }}</td>\n              <td *ngIf=\"isUpdateCase\">{{linkedStocks.manufacturingUnit || linkedStocks.stockUnitCode}}</td>-->\n\n              <td><input type=\"number\" [disabled]=\"true\" required class=\"form-control text-right\"\n                         [(ngModel)]=\"linkedStocks.rate\" #linkedStockRate=\"ngModel\"></td>\n              <td> {{ getCalculatedAmount(linkedStockQuantity, linkedStockRate) | number:'1.0-2' }}</td>\n              <!--<td><input type=\"number\" required class=\"form-control\" [(ngModel)]=\"linkedStocks.amount\" #linkedStockAmount=\"ngModel\"></td>-->\n\n              <td class=\"action\">\n                <button [disabled]=\"linkedStockQuantity.invalid || linkedStockRate.invalid || linkedStockList.invalid\"\n                        (click)=\"addConsumption(linkedStocks, $event)\" class=\"ico-btn pd0\"><i\n                  class=\"fa fa-plus text-danger\" aria-hidden=\"true\"></i></button>\n              </td>\n            </tr>\n\n            <tr>\n              <td colspan=\"7\">\n                <button class=\"btn-link\" (click)=\"toggleAddLinkedStocks = !toggleAddLinkedStocks\">Add New</button>\n              </td>\n            </tr>\n            </tbody>\n            <tfoot class=\"bdrT pdT2 pdB2 bdrB\">\n            <tr>\n              <th colspan=\"2\">Total:</th>\n              <th class=\"text-right\"> {{ getTotal('linkedStocks', 'quantity') | number:'1.0-4' }}</th>\n              <th></th>\n              <th></th>\n              <th class=\"text-right\"> {{ getTotal('linkedStocks', 'amount') | number:'1.0-2' }}</th>\n              <th></th>\n            </tr>\n            </tfoot>\n          </table>\n        </section>\n      </div>\n      <!-- end right column -->\n\n      <!-- left column / total cost table -->\n      <div class=\"col-xs-5 mrL2\">\n        <div class=\"form_title\">\n          <p>Total Cost</p>\n        </div>\n        <form class=\"form-theme clearfix\" name=\"expenseForm\">\n          <div class=\"mrB2 clearfix\">\n            <p class=\"col-xs-9 pd0\">Total Consumption Cost:</p>\n            <p class=\"col-xs-3 text-right\">{{ getTotal('linkedStocks', 'amount') | number:'1.0-2' }}</p>\n          </div>\n          <table class=\"width100\">\n            <thead class=\"tcaption\">\n            <tr>\n              <td class=\"cp btn-link\" (click)=\"toggleAddExpenses = !toggleAddExpenses\"\n                  tooltip=\"Add A/C where expense entries will be done.\" placement=\"top\" colspan=\"5\"><i\n                class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Expense\n              </td>\n            </tr>\n            </thead>\n            <tbody *ngIf=\"manufacturingDetails && liabilityGroupAccounts$ | async\">\n            <tr *ngFor=\"let expense of manufacturingDetails.otherExpenses; let i = index;\">\n              <td colspan=\"1\">\n                <div class=\"custom-select pos-rel\">\n                  <select class=\"form-control cp\">\n                    <option (value)=\"expense.baseAccount.uniqueName\">{{ getAccountName(expense.baseAccount.uniqueName,\n                      'liabilityGroupAccounts') | async }}\n                    </option>\n                  </select>\n                  <span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span>\n                </div>\n              </td>\n              <td class=\"text-center\">\n                <label class=\"pdR\">to</label>\n              </td>\n              <td>\n                <div class=\"custom-select pos-rel\">\n                  <select class=\"form-control cp\">\n                    <option (value)=\"expense.baseAccount.uniqueName\">{{\n                      getAccountName(expense.transactions[0].account.uniqueName, 'expenseGroupAccounts') | async }}\n                    </option>\n                  </select>\n                  <span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span>\n                </div>\n              </td>\n              <td class=\"text-right\">\n                <div class=\"pd\">{{ expense.transactions[0].amount }}</div>\n              </td>\n              <td class=\"text-center\"><i class=\"fa fa-times\" aria-hidden=\"true\" (click)=\"removeExpenseItem(i)\"></i></td>\n            </tr>\n\n            <tr *ngIf=\"toggleAddExpenses\">\n              <td colspan=\"1\">\n                <sh-select [forceClearReactive]=\"needForceClear$ | async\" (selected)=\"addExpense(otherExpenses)\"\n                           [options]=\"liabilityGroupAccounts$ | async\"\n                           [(ngModel)]=\"otherExpenses.transactionAccountUniqueName\" name=\"baseAccountUniqueName\"\n                           [placeholder]=\"'Liability/Asset A/c'\" [ItemHeight]=\"33\"></sh-select>\n              </td>\n              <td class=\"text-center\">\n                <label class=\"pd\">to</label>\n              </td>\n              <td>\n                <div class=\"custom-select pos-rel\">\n                  <sh-select [forceClearReactive]=\"needForceClear$ | async\" (selected)=\"addExpense(otherExpenses)\"\n                             [options]=\"expenseGroupAccounts$ | async\" [(ngModel)]=\"otherExpenses.baseAccountUniqueName\"\n                             name=\"baseAccountUniqueName\" [placeholder]=\"'Expense A/c'\" [ItemHeight]=\"33\"></sh-select>\n                </div>\n              </td>\n              <!--|| transactionAccountUniqueName.invalid  || baseAccountUniqueName.invalid-->\n              <td class=\"text-right w100\">\n                <div class=\"pd\"><input type=\"text\" (blur)=\"addExpense(otherExpenses)\" decimalDigitsDirective\n                                       [DecimalPlaces]=\"2\" required placeholder=\"Amount\"\n                                       [(ngModel)]=\"otherExpenses.transactionAmount\" name=\"transactionAmount\"\n                                       class=\"form-control text-right\" #transactionAmount=\"ngModel\"></div>\n              </td>\n              <td>\n                <button [disabled]=\"transactionAmount.invalid\" (click)=\"addExpense(otherExpenses)\"\n                        style=\"margin-top: 12px;\" class=\"ico-btn pd0\"><i class=\"fa fa-plus text-danger\"\n                                                                         aria-hidden=\"true\"></i></button>\n              </td>\n            </tr>\n            </tbody>\n          </table>\n          <div class=\"bdrT clearfix pdT1 mrT1 mrB1\">\n            <span class=\"col-xs-7 pd0\"><strong>Total Manufacturing Expense:</strong></span>\n            <span\n              class=\"col-xs-5 text-right\"><strong>{{ getTotal('otherExpenses', 'amount') | number:'1.0-2' }}</strong></span>\n          </div>\n          <div class=\"mrB1 clearfix\">\n            <span class=\"col-xs-7 pd0\"><strong>Grand Total:</strong></span>\n            <span class=\"col-xs-5 text-right\"><strong>{{ (getTotal('otherExpenses', 'amount') + getTotal('linkedStocks', 'amount')) | number:'1.0-2' }}</strong></span>\n          </div>\n          <div class=\"mrB1 clearfix\">\n            <span class=\"col-xs-7 pd0\"><strong>Cost per {{selectedProductName}}:</strong></span>\n            <span class=\"col-xs-5 text-right\"><strong>{{ getCostPerProduct() | number:'1.0-2'}}</strong></span>\n          </div>\n          <div class=\"pull-right mrT1 clearfix\" *ngIf=\"!isUpdateCase\">\n            <button type=\"submit\" class=\"btn btn-sm btn-success\" (click)=\"createEntry();\">Save</button>\n            <button type=\"button\" class=\"btn btn-sm btn-primary\" (click)=\"goBackToListPage()\">Cancel</button>\n          </div>\n          <div class=\"pull-right mrT1 clearfix\" *ngIf=\"isUpdateCase\">\n            <button type=\"submit\" class=\"btn btn-sm btn-success\" (click)=\"updateEntry()\">Update</button>\n            <button type=\"button\" class=\"btn btn-sm btn-danger\" (click)=\"deleteEntry()\">Delete</button>\n          </div>\n        </form>\n      </div>\n      <!-- end left column -->\n\n    </div>\n  </div>\n</section>\n\n<!--delete manufacturing confirmation modal -->\n<div bsModal #manufacturingConfirmationModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <!-- modal-liq90 class is removed for now-->\n    <div class=\"modal-content\">\n      <delete-manufacturing-confirmation-modal\n        (closeModelEvent)=\"closeConfirmationPopup($event)\"></delete-manufacturing-confirmation-modal>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/manufacturing/edit/mf.edit.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/manufacturing/edit/mf.edit.component.ts ***!
  \*********************************************************/
/*! exports provided: MfEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MfEditComponent", function() { return MfEditComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _actions_manufacturing_manufacturing_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../actions/manufacturing/manufacturing.actions */ "./src/app/actions/manufacturing/manufacturing.actions.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _models_interfaces_stocksItem_interface__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../models/interfaces/stocksItem.interface */ "./src/app/models/interfaces/stocksItem.interface.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _models_interfaces_manufacturing_interface__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../models/interfaces/manufacturing.interface */ "./src/app/models/interfaces/manufacturing.interface.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_17__);


















var MfEditComponent = /** @class */ (function () {
    function MfEditComponent(store, manufacturingActions, inventoryAction, _groupService, _location, _inventoryService, _accountService, _toasty) {
        var _this = this;
        this.store = store;
        this.manufacturingActions = manufacturingActions;
        this.inventoryAction = inventoryAction;
        this._groupService = _groupService;
        this._location = _location;
        this._inventoryService = _inventoryService;
        this._accountService = _accountService;
        this._toasty = _toasty;
        this.consumptionDetail = [];
        this.isUpdateCase = false;
        this.otherExpenses = {};
        this.toggleAddExpenses = false;
        this.toggleAddLinkedStocks = false;
        this.linkedStocks = new _models_interfaces_stocksItem_interface__WEBPACK_IMPORTED_MODULE_9__["IStockItemDetail"]();
        this.expenseGroupAccounts = [];
        this.liabilityGroupAccounts = [];
        this.showFromDatePicker = false;
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_11__;
        this.initialQuantityObj = [];
        this.needForceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.needForceClearProductList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.options = {
            multiple: false,
            placeholder: 'Select'
        };
        this.initialQuantity = 1;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.store.dispatch(this.inventoryAction.GetManufacturingCreateStock());
        this.store.dispatch(this.inventoryAction.GetStock());
        this.groupsList$ = this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.manufacturingDetails = new _models_interfaces_manufacturing_interface__WEBPACK_IMPORTED_MODULE_13__["ManufacturingItemRequest"]();
        this.initializeOtherExpenseObj();
        // Update/Delete condition
        this.store.select(function (p) { return p.manufacturing; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.stockToUpdate) {
                _this.isUpdateCase = true;
                var manufacturingObj_1 = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](o.reportData.results.find(function (stock) { return stock.uniqueName === o.stockToUpdate; }));
                if (manufacturingObj_1) {
                    _this.selectedProductName = manufacturingObj_1.stockName + " (" + manufacturingObj_1.stockUniqueName + ")";
                    manufacturingObj_1.quantity = manufacturingObj_1.manufacturingQuantity;
                    manufacturingObj_1.date = moment_moment__WEBPACK_IMPORTED_MODULE_11__(manufacturingObj_1.date, 'DD-MM-YYYY').toDate();
                    manufacturingObj_1.multipleOf = (manufacturingObj_1.manufacturingQuantity / manufacturingObj_1.manufacturingMultipleOf);
                    // delete manufacturingObj.manufacturingQuantity;
                    manufacturingObj_1.linkedStocks.forEach(function (item) {
                        // console.log('the manufacturingObj.manufacturingMultipleOf is:', manufacturingObj.manufacturingMultipleOf);
                        item.quantity = (item.manufacturingQuantity / manufacturingObj_1.manufacturingMultipleOf);
                        // console.log('item.qu is :', item.quantity);
                        // // delete item.manufacturingQuantity;
                    });
                    if (!_this.initialQuantityObj.length) {
                        _this.initialQuantityObj = manufacturingObj_1.linkedStocks;
                    }
                    // manufacturingObj.activeStockGroupUniqueName = o.activeStockGroup;
                    _this.manufacturingDetails = manufacturingObj_1;
                    _this.onQuantityChange(manufacturingObj_1.manufacturingMultipleOf);
                }
            }
        });
        // Get group with accounts
        this.groupsList$.subscribe(function (data) {
            if (data && data.length) {
                var GroupWithAccResponse_1 = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](data);
                _this._accountService.GetFlattenAccounts('', '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(_this.destroyed$)).subscribe(function (response) {
                    if (response.status === 'success') {
                        var flattenGroupResponse_1 = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](response.body.results);
                        _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["forEach"](GroupWithAccResponse_1, function (d) {
                            _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["forEach"](flattenGroupResponse_1, function (acc) {
                                if (d.category === 'expenses' || d.category === 'liabilities' || d.category === 'assets') {
                                    var matchedAccIndex = acc.parentGroups.findIndex(function (account) { return account.uniqueName === d.uniqueName; });
                                    if (matchedAccIndex > -1) {
                                        if (d.category === 'expenses') {
                                            _this.expenseGroupAccounts.push({ label: acc.name + " (" + acc.uniqueName + ")", value: acc.uniqueName });
                                        }
                                        if (d.category === 'liabilities' || d.category === 'assets') {
                                            _this.liabilityGroupAccounts.push({ label: acc.name + " (" + acc.uniqueName + ")", value: acc.uniqueName });
                                        }
                                    }
                                }
                            });
                        });
                        _this.expenseGroupAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_this.expenseGroupAccounts);
                        _this.liabilityGroupAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_this.liabilityGroupAccounts);
                    }
                });
            }
        });
        this.manufacturingDetails.quantity = 1;
    }
    MfEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isUpdateCase) {
            var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(manufacturingDetailsObj.stockUniqueName));
        }
        // dispatch stockList request
        this.store.select(function (p) { return p.inventory; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (_this.isUpdateCase && o.activeStock && o.activeStock.manufacturingDetails) {
                var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](_this.manufacturingDetails);
                manufacturingDetailsObj.multipleOf = o.activeStock.manufacturingDetails.manufacturingMultipleOf;
                _this.manufacturingDetails = manufacturingDetailsObj;
            }
        });
        // get manufacturing stocks
        this.stockListDropDown$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_17__["createSelector"])([function (state) { return state.inventory.manufacturingStockListForCreateMF; }], function (manufacturingStockListForCreateMF) {
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](manufacturingStockListForCreateMF);
            var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](_this.manufacturingDetails);
            if (data) {
                if (data.results) {
                    var units = data.results;
                    return units.map(function (unit) {
                        var alreadyPushedElementindx = manufacturingDetailsObj.linkedStocks.findIndex(function (obj) { return obj.stockUniqueName === unit.uniqueName; });
                        if (alreadyPushedElementindx > -1) {
                            return { label: " " + unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName, isAlreadyPushed: true };
                        }
                        else {
                            return { label: " " + unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName, isAlreadyPushed: false };
                        }
                    });
                }
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        // get All stocks
        this.allStocksDropDown$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_17__["createSelector"])([function (state) { return state.inventory.stocksList; }], function (allStocks) {
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](allStocks);
            var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](_this.manufacturingDetails);
            if (data) {
                if (data.results) {
                    var units = data.results;
                    return units.map(function (unit) {
                        var alreadyPushedElementindx = manufacturingDetailsObj.linkedStocks.findIndex(function (obj) { return obj.stockUniqueName === unit.uniqueName; });
                        if (alreadyPushedElementindx > -1) {
                            return { label: " " + unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName, isAlreadyPushed: true };
                        }
                        else {
                            return { label: " " + unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName, isAlreadyPushed: false };
                        }
                    });
                }
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        // get stock with rate details
        this.store.select(function (p) { return p.manufacturing; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](_this.manufacturingDetails);
            if (!_this.isUpdateCase) {
                if (o.stockWithRate && o.stockWithRate.manufacturingDetails) {
                    // In create only
                    var manufacturingDetailsObjData = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](o.stockWithRate.manufacturingDetails);
                    manufacturingDetailsObj.linkedStocks = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](o.stockWithRate.manufacturingDetails.linkedStocks);
                    // this.initialQuantityObj = manufacturingDetailsObj.linkedStocks;
                    // manufacturingDetailsObj.multipleOf = _.cloneDeep(o.stockWithRate.manufacturingDetails.manufacturingMultipleOf);
                    manufacturingDetailsObj.multipleOf = (manufacturingDetailsObjData.manufacturingQuantity / manufacturingDetailsObjData.manufacturingMultipleOf);
                    manufacturingDetailsObj.manufacturingQuantity = manufacturingDetailsObjData.manufacturingQuantity;
                    manufacturingDetailsObj.manufacturingMultipleOf = manufacturingDetailsObjData.manufacturingMultipleOf;
                }
                else {
                    manufacturingDetailsObj.linkedStocks = [];
                    manufacturingDetailsObj.multipleOf = null;
                }
                _this.manufacturingDetails = manufacturingDetailsObj;
                _this.onQuantityChange(1);
            }
        });
    };
    MfEditComponent.prototype.getStocksWithRate = function (data) {
        this.selectedProductName = data.label;
        this.manufacturingDetails.manufacturingMultipleOf = 1;
        if (data.value) {
            var selectedValue = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](data.value);
            this.selectedProduct = selectedValue;
            var manufacturingObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            // manufacturingObj.stockUniqueName = selectedValue;
            manufacturingObj.uniqueName = selectedValue;
            this.manufacturingDetails = manufacturingObj;
            this.store.dispatch(this.manufacturingActions.GetStockWithRate(manufacturingObj.stockUniqueName));
        }
    };
    MfEditComponent.prototype.initializeOtherExpenseObj = function () {
        this.otherExpenses.baseAccountUniqueName = '';
        this.otherExpenses.transactionAccountUniqueName = '';
    };
    MfEditComponent.prototype.goBackToListPage = function () {
        this._location.back();
    };
    MfEditComponent.prototype.addConsumption = function (data, ev) {
        if (data.amount > 0 && data.rate && data.stockUniqueName && data.quantity) {
            var val = {
                amount: data.amount,
                rate: data.rate,
                stockName: data.stockUniqueName,
                stockUniqueName: data.stockUniqueName,
                quantity: data.quantity
                // stockUnitCode: 'm' // TODO: Remove hardcoded value
            };
            if (this.isUpdateCase) {
                val.stockUnitCode = data.manufacturingUnit;
            }
            else {
                val.stockUnitCode = data.stockUnitCode;
            }
            var manufacturingObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            if (manufacturingObj.linkedStocks) {
                manufacturingObj.linkedStocks.push(val);
            }
            else {
                manufacturingObj.linkedStocks = [val];
            }
            // manufacturingObj.stockUniqueName = this.selectedProduct;
            this.manufacturingDetails = manufacturingObj;
            this.linkedStocks = new _models_interfaces_stocksItem_interface__WEBPACK_IMPORTED_MODULE_9__["IStockItemDetail"]();
            this.needForceClearProductList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        }
        else if (ev) {
            this._toasty.errorToast('Can not add raw material, amount is 0');
        }
    };
    MfEditComponent.prototype.removeConsumptionItem = function (indx) {
        if (indx > -1) {
            this.manufacturingDetails.linkedStocks.splice(indx, 1);
        }
    };
    MfEditComponent.prototype.addExpense = function (data) {
        if (data && data.transactionAccountUniqueName && data.baseAccountUniqueName && data.transactionAmount) {
            var objToPush = {
                baseAccount: {
                    uniqueName: data.transactionAccountUniqueName
                },
                transactions: [
                    {
                        account: {
                            uniqueName: data.baseAccountUniqueName
                        },
                        amount: data.transactionAmount
                    }
                ]
            };
            var manufacturingObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            if (manufacturingObj.otherExpenses) {
                manufacturingObj.otherExpenses.push(objToPush);
            }
            else {
                manufacturingObj.otherExpenses = [objToPush];
            }
            // manufacturingObj.manufacturingMultipleOf = manufacturingObj.manufacturingMultipleOf;
            this.manufacturingDetails = manufacturingObj;
            this.otherExpenses = {};
            this.needForceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
            this.initializeOtherExpenseObj();
        }
    };
    MfEditComponent.prototype.removeExpenseItem = function (indx) {
        if (indx > -1) {
            this.manufacturingDetails.otherExpenses.splice(indx, 1);
        }
    };
    MfEditComponent.prototype.createEntry = function () {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
        dataToSave.stockUniqueName = this.selectedProduct;
        dataToSave.date = moment_moment__WEBPACK_IMPORTED_MODULE_11__(dataToSave.date).format('DD-MM-YYYY');
        dataToSave.linkedStocks.forEach(function (obj) {
            obj.manufacturingUnit = obj.stockUnitCode;
            obj.manufacturingQuantity = obj.quantity;
            // delete obj.stockUnitCode;
            // delete obj.quantity;
        });
        // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
        // dataToSave.multipleOf = dataToSave.quantity;
        // delete dataToSave.manufacturingMultipleOf;
        this.store.dispatch(this.manufacturingActions.CreateMfItem(dataToSave));
    };
    MfEditComponent.prototype.updateEntry = function () {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
        dataToSave.date = moment_moment__WEBPACK_IMPORTED_MODULE_11__(dataToSave.date).format('DD-MM-YYYY');
        // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
        // dataToSave.multipleOf = dataToSave.quantity;
        // dataToSave.manufacturingUniqueName =
        this.store.dispatch(this.manufacturingActions.UpdateMfItem(dataToSave));
    };
    MfEditComponent.prototype.deleteEntry = function () {
        this.manufacturingConfirmationModal.show();
    };
    MfEditComponent.prototype.getTotal = function (from, field) {
        var total = 0;
        var manufacturingDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
        if (from === 'linkedStocks' && this.manufacturingDetails.linkedStocks) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["forEach"](manufacturingDetails.linkedStocks, function (item) { return total = total + Number(item[field]); });
        }
        if (from === 'otherExpenses' && this.manufacturingDetails.otherExpenses) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["forEach"](manufacturingDetails.otherExpenses, function (item) { return total = total + Number(item.transactions[0][field]); });
        }
        return total;
    };
    MfEditComponent.prototype.getCostPerProduct = function () {
        var manufacturingDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
        var quantity;
        if (manufacturingDetails.multipleOf) {
            quantity = manufacturingDetails.manufacturingMultipleOf * manufacturingDetails.multipleOf;
        }
        else {
            quantity = manufacturingDetails.manufacturingMultipleOf;
        }
        quantity = (quantity && quantity > 0) ? quantity : 1;
        var amount = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
        var cost = (amount / quantity);
        if (!isNaN(cost)) {
            return cost;
        }
        return 0;
    };
    MfEditComponent.prototype.closeConfirmationPopup = function (userResponse) {
        if (userResponse) {
            var manufacturingObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            this.store.dispatch(this.manufacturingActions.DeleteMfItem({
                stockUniqueName: manufacturingObj.stockUniqueName,
                manufacturingUniqueName: manufacturingObj.uniqueName
            }));
        }
        this.manufacturingConfirmationModal.hide();
    };
    MfEditComponent.prototype.getCalculatedAmount = function (quantity, rate) {
        if (quantity.model && rate.model) {
            var amount = quantity.model * rate.model;
            this.linkedStocks.amount = amount;
            return amount;
        }
        return 0;
    };
    MfEditComponent.prototype.onQuantityChange = function (val) {
        var _this = this;
        var value = val;
        var manufacturingObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
        if (!this.initialQuantityObj.length) {
            this.initialQuantityObj = [];
            manufacturingObj.linkedStocks.forEach(function (o) {
                _this.initialQuantityObj.push(o);
            });
        }
        if (value && !isNaN(value)) {
            value = parseFloat(value);
        }
        else {
            value = 1;
        }
        if (manufacturingObj && manufacturingObj.linkedStocks) {
            manufacturingObj.linkedStocks.forEach(function (stock) {
                var selectedStock = _this.initialQuantityObj.find(function (obj) { return obj.stockUniqueName === stock.stockUniqueName; });
                if (selectedStock) {
                    stock.quantity = selectedStock.quantity * value;
                    stock.amount = stock.quantity * stock.rate;
                }
            });
            this.manufacturingDetails = manufacturingObj;
        }
    };
    MfEditComponent.prototype.getStockUnit = function (selectedItem, itemQuantity) {
        var _this = this;
        if (selectedItem && itemQuantity && Number(itemQuantity) > 0) {
            var manufacturingDetailsObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](this.manufacturingDetails);
            this._inventoryService.GetStockUniqueNameWithDetail(selectedItem).subscribe(function (res) {
                if (res.status === 'success') {
                    var unitCode = res.body.stockUnit.code;
                    var data = {
                        stockUniqueName: selectedItem,
                        quantity: itemQuantity,
                        stockUnitCode: unitCode,
                        rate: null,
                        amount: null
                    };
                    _this.linkedStocks.manufacturingUnit = unitCode;
                    _this.linkedStocks.stockUnitCode = unitCode;
                    _this._inventoryService.GetRateForStoke(selectedItem, data).subscribe(function (response) {
                        if (response.status === 'success') {
                            _this.linkedStocks.rate = _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"](response.body.rate);
                            setTimeout(function () {
                                _this.addConsumption(_this.linkedStocks);
                            }, 10);
                        }
                    });
                }
            });
        }
        else {
            this.linkedStocks.manufacturingUnit = null;
            this.linkedStocks.stockUnitCode = null;
            this.linkedStocks.rate = null;
        }
    };
    MfEditComponent.prototype.setToday = function () {
        this.manufacturingDetails.date = String(moment_moment__WEBPACK_IMPORTED_MODULE_11__());
    };
    MfEditComponent.prototype.clearDate = function () {
        this.manufacturingDetails.date = '';
    };
    MfEditComponent.prototype.getAccountName = function (uniqueName, category) {
        var name;
        if (category === 'liabilityGroupAccounts') {
            this.liabilityGroupAccounts$.subscribe(function (data) {
                var account = data.find(function (acc) { return acc.value === uniqueName; });
                if (account) {
                    name = account.label;
                }
            });
        }
        else if (category === 'expenseGroupAccounts') {
            this.expenseGroupAccounts$.subscribe(function (data) {
                var account = data.find(function (acc) { return acc.value === uniqueName; });
                if (account) {
                    name = account.label;
                }
            });
        }
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(name);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('manufacturingConfirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_14__["ModalDirective"])
    ], MfEditComponent.prototype, "manufacturingConfirmationModal", void 0);
    MfEditComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            template: __webpack_require__(/*! ./mf.edit.component.html */ "./src/app/manufacturing/edit/mf.edit.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_manufacturing_manufacturing_actions__WEBPACK_IMPORTED_MODULE_7__["ManufacturingActions"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__["InventoryAction"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_12__["GroupService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_15__["InventoryService"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_16__["AccountService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"]])
    ], MfEditComponent);
    return MfEditComponent;
}());



/***/ }),

/***/ "./src/app/manufacturing/edit/modal/confirmation.model.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/manufacturing/edit/modal/confirmation.model.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header themeBg pd2 pdL2 pdR2 clearfix\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\">Confirmation </h3>\n    <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onCancel()\"></i>\n  </div>\n  <div class=\"modal-body pdT5 pdB5 pdL2 pdR2 clearfix\" id=\"export-body\">\n    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n      <div class=\"modal_wrap mrB2\">\n        <h3>Are you sure want to delete this manufacturing entry?</h3>\n        <div class=\"pull-right mrT5\">\n          <button type=\"submit\" class=\"btn btn-md btn-success mrR1\" (click)=\"onConfirmation()\">Yes</button>\n          <button type=\"submit\" class=\"btn btn-md btn-primary\" (click)=\"onCancel()\">No</button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/manufacturing/edit/modal/confirmation.model.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/manufacturing/edit/modal/confirmation.model.component.ts ***!
  \**************************************************************************/
/*! exports provided: DeleteManufacturingConfirmationModelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteManufacturingConfirmationModelComponent", function() { return DeleteManufacturingConfirmationModelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var DeleteManufacturingConfirmationModelComponent = /** @class */ (function () {
    function DeleteManufacturingConfirmationModelComponent() {
        this.closeModelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
    }
    DeleteManufacturingConfirmationModelComponent.prototype.onConfirmation = function () {
        this.closeModelEvent.emit(true);
    };
    DeleteManufacturingConfirmationModelComponent.prototype.onCancel = function () {
        this.closeModelEvent.emit(false);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DeleteManufacturingConfirmationModelComponent.prototype, "closeModelEvent", void 0);
    DeleteManufacturingConfirmationModelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'delete-manufacturing-confirmation-modal',
            template: __webpack_require__(/*! ./confirmation.model.component.html */ "./src/app/manufacturing/edit/modal/confirmation.model.component.html")
        })
    ], DeleteManufacturingConfirmationModelComponent);
    return DeleteManufacturingConfirmationModelComponent;
}());



/***/ }),

/***/ "./src/app/manufacturing/manufacturing.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/manufacturing/manufacturing.component.ts ***!
  \**********************************************************/
/*! exports provided: ManufacturingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManufacturingComponent", function() { return ManufacturingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");







var ManufacturingComponent = /** @class */ (function () {
    function ManufacturingComponent(store, companyActions) {
        this.store = store;
        this.companyActions = companyActions;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        //
    }
    ManufacturingComponent.prototype.ngOnInit = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'manufacturing';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    ManufacturingComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    ManufacturingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: '<router-outlet></router-outlet>'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__["CompanyActions"]])
    ], ManufacturingComponent);
    return ManufacturingComponent;
}());



/***/ }),

/***/ "./src/app/manufacturing/manufacturing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/manufacturing/manufacturing.module.ts ***!
  \*******************************************************/
/*! exports provided: ManufacturingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManufacturingModule", function() { return ManufacturingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _manufacturing_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./manufacturing.component */ "./src/app/manufacturing/manufacturing.component.ts");
/* harmony import */ var _report_mf_report_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./report/mf.report.component */ "./src/app/manufacturing/report/mf.report.component.ts");
/* harmony import */ var _edit_mf_edit_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit/mf.edit.component */ "./src/app/manufacturing/edit/mf.edit.component.ts");
/* harmony import */ var _manufacturing_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./manufacturing.routing.module */ "./src/app/manufacturing/manufacturing.routing.module.ts");
/* harmony import */ var _edit_modal_confirmation_model_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit/modal/confirmation.model.component */ "./src/app/manufacturing/edit/modal/confirmation.model.component.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_17__);


















var ManufacturingModule = /** @class */ (function () {
    function ManufacturingModule() {
    }
    ManufacturingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["NgModule"])({
            declarations: [
                _manufacturing_component__WEBPACK_IMPORTED_MODULE_6__["ManufacturingComponent"],
                _report_mf_report_component__WEBPACK_IMPORTED_MODULE_7__["MfReportComponent"],
                _edit_mf_edit_component__WEBPACK_IMPORTED_MODULE_8__["MfEditComponent"],
                _edit_modal_confirmation_model_component__WEBPACK_IMPORTED_MODULE_10__["DeleteManufacturingConfirmationModelComponent"]
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"]],
            providers: [],
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _manufacturing_routing_module__WEBPACK_IMPORTED_MODULE_9__["ManufacturingRoutingModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_12__["PaginationModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_11__["DatepickerModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_11__["BsDatepickerModule"].forRoot(),
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_13__["ModalModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_14__["LaddaModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_15__["SelectModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_16__["DecimalDigitsModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__["ShSelectModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_17__["ClickOutsideModule"]
            ],
        })
    ], ManufacturingModule);
    return ManufacturingModule;
}());



/***/ }),

/***/ "./src/app/manufacturing/manufacturing.routing.module.ts":
/*!***************************************************************!*\
  !*** ./src/app/manufacturing/manufacturing.routing.module.ts ***!
  \***************************************************************/
/*! exports provided: ManufacturingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManufacturingRoutingModule", function() { return ManufacturingRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _manufacturing_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manufacturing.component */ "./src/app/manufacturing/manufacturing.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _edit_mf_edit_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit/mf.edit.component */ "./src/app/manufacturing/edit/mf.edit.component.ts");
/* harmony import */ var _report_mf_report_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./report/mf.report.component */ "./src/app/manufacturing/report/mf.report.component.ts");







var ManufacturingRoutingModule = /** @class */ (function () {
    function ManufacturingRoutingModule() {
    }
    ManufacturingRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '', component: _manufacturing_component__WEBPACK_IMPORTED_MODULE_1__["ManufacturingComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]],
                        children: [
                            { path: '', redirectTo: 'report', pathMatch: 'full' },
                            { path: 'report', component: _report_mf_report_component__WEBPACK_IMPORTED_MODULE_6__["MfReportComponent"] },
                            { path: 'edit', component: _edit_mf_edit_component__WEBPACK_IMPORTED_MODULE_5__["MfEditComponent"] }
                            // { path: 'add-group', pathMatch: 'full', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication] },
                            // { path: 'add-group/:groupUniqueName', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication], },
                            // { path: 'add-group/:groupUniqueName/add-stock', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
                            // { path: 'add-group/:groupUniqueName/add-stock/:stockUniqueName', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
                            // { path: 'add-group/:groupUniqueName/stock-report/:stockUniqueName', component: InventoryStockReportComponent, canActivate: [NeedsAuthentication] },
                            // { path: 'custom-stock', component: InventoryCustomStockComponent, canActivate: [NeedsAuthentication] },
                        ]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]]
        })
    ], ManufacturingRoutingModule);
    return ManufacturingRoutingModule;
}());



/***/ }),

/***/ "./src/app/manufacturing/manufacturing.utility.ts":
/*!********************************************************!*\
  !*** ./src/app/manufacturing/manufacturing.utility.ts ***!
  \********************************************************/
/*! exports provided: MfStockSearchRequestClass, LinkedStocks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MfStockSearchRequestClass", function() { return MfStockSearchRequestClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkedStocks", function() { return LinkedStocks; });
var MfStockSearchRequestClass = /** @class */ (function () {
    function MfStockSearchRequestClass() {
    }
    return MfStockSearchRequestClass;
}());

var LinkedStocks = /** @class */ (function () {
    function LinkedStocks() {
    }
    return LinkedStocks;
}());

/*
product( string: uniquename stock ) ,
searchOperation(greaterThan , lessThan, greaterThanOrEquals, lessThanOrEquals, equals),
searchBy (quantityInward , quantityOutward, voucherNumber),
searchValue( any integer number),
from (date string),
to(date string)
*/


/***/ }),

/***/ "./src/app/manufacturing/report/mf.report.component.css":
/*!**************************************************************!*\
  !*** ./src/app/manufacturing/report/mf.report.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mfStockSearchRequestForm .col-xs-1 {\n  width: 11.33333333%;\n}\n\n#mfReportTbl .table .table td {\n  border: none;\n  text-align: center;\n  padding: 1px 0;\n}\n\n#mfReportTbl .table td {\n  vertical-align: top !important;\n  text-transform: capitalize;\n}\n\n#mfReportTbl .table td.noBdr {\n  border: none\n}\n\n.pdBth4 {\n  padding: 0 40px;\n}\n"

/***/ }),

/***/ "./src/app/manufacturing/report/mf.report.component.html":
/*!***************************************************************!*\
  !*** ./src/app/manufacturing/report/mf.report.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"manufacture\" class=\"clearfix\">\n    <!-- page Title -->\n    <div class=\"top_bar col-xs-12 clearfix bdrB\">\n        <h1 class=\"section_title d-inline-block\"><strong>Mfg. Journal Register</strong></h1>\n        <button class=\"btn isActive pull-right\" (click)=\"goToCreateNewPage()\" type=\"button\">Create Manufacture</button>\n    </div>\n    <!-- form -->\n    <div class=\"col-xs-12\">\n        <div class=\"mfStockSearchRequestForm clearfix\">\n            <form #mfStockSearchRequestForm=\"ngForm\" class=\"col-xs-10 mrT2 mrB\" (submit)=\"getReports()\" autocomplete=\"off\">\n                <div class=\"row\">\n                    <div class=\"form-group col-xs-3\">\n                        <div class=\"row\">\n                            <label class=\"d-block\">Final Product</label>\n                            <sh-select placeholder=\"--Select Product--\" name=\"product\" #productList=\"ngModel\" required [(ngModel)]=\"mfStockSearchRequest.product\" [options]=\"stockListDropDown\" [ItemHeight]=\"33\" (selected)=\"setActiveStockGroup($event)\"></sh-select>\n                        </div>\n                    </div>\n                    <div class=\"form-group col-xs-3\">\n                        <label class=\"d-block\">From - To</label>\n                        <div class=\"input-group\">\n                            <input name=\"dateRange\" #dp placeholder=\"Date range picker\" type=\"text\" class=\"form-control\" [ngModel]=\"mfStockSearchRequest.dateRange\" (bsValueChange)=\"bsValueChange($event)\" bsDaterangepicker required>\n                            <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default\" (click)=\"dp.isOpen = true\"><i\n                                  class=\"glyphicon glyphicon-calendar\"></i></button>\n                            </span>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group col-xs-1\">\n                        <div class=\"row\">\n                            <label class=\"d-block\">Search By</label>\n                            <sh-select placeholder=\"--Select--\" name=\"searchBy\" [(ngModel)]=\"mfStockSearchRequest.searchBy\" [options]=\"filtersForSearchBy\" [ItemHeight]=\"33\"></sh-select>\n                        </div>\n                    </div>\n                    <div class=\"form-group col-xs-2\">\n                        <div class=\"\">\n                            <label class=\"d-block\">Operation</label>\n                            <sh-select placeholder=\"--Select--\" name=\"searchOperation\" [(ngModel)]=\"mfStockSearchRequest.searchOperation\" [options]=\"filtersForSearchOperation\" [ItemHeight]=\"33\"></sh-select>\n                        </div>\n                    </div>\n                    <div class=\"form-group col-xs-1\">\n                        <div class=\"row\">\n                            <label class=\"d-block\">Value</label>\n                            <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"4\" class=\"form-control\" placeholder=\"Value\" name=\"searchValue\" [(ngModel)]=\"mfStockSearchRequest.searchValue\" />\n                        </div>\n                    </div>\n                    <div class=\"form-group pull-left mrL2\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <!-- [disabled]=\"mfStockSearchRequestForm.invalid\" -->\n                        <button class=\"btn btn-success\" type=\"submit\">Go</button>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n    <!-- search form end -->\n    <section *ngIf=\"(isReportLoading$ | async)\" class=\"clearfix mart100 col-xs-12\">\n        <p class=\"lead alC mrT4\">Loading...</p>\n    </section>\n    <div class=\"no-data mart100 col-xs-12\" *ngIf=\"!(isReportLoading$ | async) && reportData && reportData.results.length === 0\">\n        <h1>No entries found within given criteria.</h1>\n        <h1>Do search with some other dates</h1>\n    </div>\n    <section *ngIf=\"!(isReportLoading$ | async) && reportData && reportData.results.length > 0\">\n        <div class=\"\" id=\"mfReportTbl\">\n            <div class=\"col-xs-12\">\n                <table class=\"table basic table-bordered\">\n                    <thead>\n                        <tr>\n                            <th width=\"15%\">Date</th>\n                            <th width=\"10%\">Vch. No.</th>\n                            <th width=\"15%\">Final Product</th>\n                            <th width=\"24%\" class=\"alC\">Raw Products</th>\n                            <th width=\"12%\" class=\"alC\">Product Inwards</th>\n                            <th width=\"24%\" class=\"alC\">Quantity Outwards</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr *ngFor=\"let item of reportData.results\" (dblclick)=\"editMFItem(item)\" class=\"cp\">\n                            <td>{{item.date}}</td>\n                            <td>{{item.voucherNumber}}</td>\n                            <td>{{item.stockName}}</td>\n                            <td colspan=\"3\" class=\"\">\n                                <table class=\"table\">\n                                    <tbody>\n                                        <tr>\n                                            <td width=\"40%\">&nbsp;</td>\n                                            <td width=\"20%\">{{item.manufacturingQuantity}} {{item.manufacturingUnit}}</td>\n                                            <td width=\"40%\">&nbsp;</td>\n                                        </tr>\n                                        <tr *ngFor=\"let row of item.linkedStocks\">\n                                            <td>{{row.stockName}}</td>\n                                            <td>&nbsp;</td>\n                                            <td>{{row.manufacturingQuantity}} {{row.manufacturingUnit}}</td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n                    <div *ngIf=\"reportData?.totalPages > 1\" class=\"paginationWrapper\">\n                        <div class=\"alC\">\n                          <pagination [totalItems]=\"reportData.totalItems\" [(ngModel)]=\"reportData.page\" [maxSize]=\"5\" class=\"pagination-sm\"\n                            [boundaryLinks]=\"true\" [itemsPerPage]=\"20\" [rotate]=\"false\" (pageChanged)=\"pageChanged($event)\"></pagination>\n                        </div>\n                      </div>\n            </div>\n        </div>     \n    </section>\n</section>"

/***/ }),

/***/ "./src/app/manufacturing/report/mf.report.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/manufacturing/report/mf.report.component.ts ***!
  \*************************************************************/
/*! exports provided: MfReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MfReportComponent", function() { return MfReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_manufacturing_manufacturing_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions/manufacturing/manufacturing.actions */ "./src/app/actions/manufacturing/manufacturing.actions.ts");
/* harmony import */ var _manufacturing_utility__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../manufacturing.utility */ "./src/app/manufacturing/manufacturing.utility.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_12__);













var filter1 = [
    { label: 'Greater', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' }
];
var filter2 = [
    { label: 'Quantity Inward', value: 'quantityInward' },
    // { name: 'Quantity Outward', uniqueName: 'quantityOutward' },
    { label: 'Voucher Number', value: 'voucherNumber' }
];
var MfReportComponent = /** @class */ (function () {
    function MfReportComponent(store, manufacturingActions, inventoryAction, router) {
        this.store = store;
        this.manufacturingActions = manufacturingActions;
        this.inventoryAction = inventoryAction;
        this.router = router;
        this.mfStockSearchRequest = new _manufacturing_utility__WEBPACK_IMPORTED_MODULE_7__["MfStockSearchRequestClass"]();
        this.filtersForSearchBy = filter2;
        this.filtersForSearchOperation = filter1;
        this.stockListDropDown = [];
        this.reportData = null;
        this.showFromDatePicker = false;
        this.showToDatePicker = false;
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_10__;
        this.isUniversalDateApplicable = false;
        this.lastPage = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        this.mfStockSearchRequest.product = '';
        this.mfStockSearchRequest.searchBy = '';
        this.mfStockSearchRequest.searchOperation = '';
        this.isReportLoading$ = this.store.select(function (p) { return p.manufacturing.isMFReportLoading; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    MfReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initializeSearchReqObj();
        // Refresh the stock list
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());
        this.store.select(function (p) { return p.inventory.manufacturingStockList; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                if (o.results) {
                    _this.stockListDropDown = [];
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["forEach"](o.results, function (unit) {
                        _this.stockListDropDown.push({ label: " " + unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName, additional: unit.stockGroup });
                    });
                }
            }
            else {
                _this.store.dispatch(_this.inventoryAction.GetManufacturingStock());
            }
        });
        this.store.select(function (p) { return p.manufacturing.reportData; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.reportData = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["cloneDeep"](o);
            }
        });
        // Refresh stock list on company change
        this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinct"])(function (val) { return val === 'companyUniqueName'; })).subscribe(function (value) {
            _this.store.dispatch(_this.inventoryAction.GetManufacturingStock());
        });
        // Refresh report data according to universal date
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_12__["createSelector"])([function (state) { return state.session.applicationDate; }], function (dateObj) {
            if (dateObj) {
                _this.universalDate = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["cloneDeep"](dateObj);
                _this.mfStockSearchRequest.dateRange = _this.universalDate;
                _this.isUniversalDateApplicable = true;
                _this.getReportDataOnFresh();
            }
        })).subscribe();
    };
    MfReportComponent.prototype.initializeSearchReqObj = function () {
        this.mfStockSearchRequest.product = '';
        this.mfStockSearchRequest.searchBy = '';
        this.mfStockSearchRequest.searchOperation = '';
        this.mfStockSearchRequest.page = 1;
        this.mfStockSearchRequest.count = 20;
    };
    MfReportComponent.prototype.goToCreateNewPage = function () {
        this.store.dispatch(this.manufacturingActions.RemoveMFItemUniqueNameFomStore());
        this.router.navigate(['/pages/manufacturing/edit']);
    };
    MfReportComponent.prototype.getReports = function () {
        this.store.dispatch(this.manufacturingActions.GetMfReport(this.mfStockSearchRequest));
        // this.mfStockSearchRequest = new MfStockSearchRequestClass();
        // if (this.isUniversalDateApplicable && this.universalDate) {
        //   this.mfStockSearchRequest.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        //   this.mfStockSearchRequest.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        //   this.mfStockSearchRequest.dateRange =  this.universalDate;
        // } else {
        //   this.mfStockSearchRequest.from = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
        //   this.mfStockSearchRequest.to = moment().format(GIDDH_DATE_FORMAT);
        // }
        // this.initializeSearchReqObj();
    };
    MfReportComponent.prototype.pageChanged = function (event) {
        if (event.page !== this.lastPage) {
            this.lastPage = event.page;
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["cloneDeep"](this.mfStockSearchRequest);
            data.page = event.page;
            this.store.dispatch(this.manufacturingActions.GetMfReport(data));
        }
    };
    MfReportComponent.prototype.editMFItem = function (item) {
        if (item.uniqueName) {
            this.store.dispatch(this.manufacturingActions.SetMFItemUniqueNameInStore(item.uniqueName));
            this.router.navigate(['/pages/manufacturing/edit']);
        }
    };
    MfReportComponent.prototype.getReportDataOnFresh = function () {
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["cloneDeep"](this.mfStockSearchRequest);
        if (this.universalDate) {
            data.from = moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.universalDate[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
            data.to = moment_moment__WEBPACK_IMPORTED_MODULE_10__(this.universalDate[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        }
        else {
            data.from = moment_moment__WEBPACK_IMPORTED_MODULE_10__().subtract(30, 'days').format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
            data.to = moment_moment__WEBPACK_IMPORTED_MODULE_10__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        }
        this.store.dispatch(this.manufacturingActions.GetMfReport(data));
    };
    MfReportComponent.prototype.clearDate = function (model) {
        this.mfStockSearchRequest[model] = '';
    };
    MfReportComponent.prototype.setToday = function (model) {
        this.mfStockSearchRequest[model] = moment_moment__WEBPACK_IMPORTED_MODULE_10__();
    };
    MfReportComponent.prototype.bsValueChange = function (event) {
        if (event) {
            this.mfStockSearchRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_10__(event[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
            this.mfStockSearchRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_10__(event[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        }
    };
    /**
     * setActiveStockGroup
     */
    MfReportComponent.prototype.setActiveStockGroup = function (event) {
        this.activeStockGroup = event.additional.uniqueName;
    };
    MfReportComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    MfReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            template: __webpack_require__(/*! ./mf.report.component.html */ "./src/app/manufacturing/report/mf.report.component.html"),
            styles: [__webpack_require__(/*! ./mf.report.component.css */ "./src/app/manufacturing/report/mf.report.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_manufacturing_manufacturing_actions__WEBPACK_IMPORTED_MODULE_6__["ManufacturingActions"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__["InventoryAction"],
            _angular_router__WEBPACK_IMPORTED_MODULE_11__["Router"]])
    ], MfReportComponent);
    return MfReportComponent;
}());



/***/ }),

/***/ "./src/app/models/interfaces/manufacturing.interface.ts":
/*!**************************************************************!*\
  !*** ./src/app/models/interfaces/manufacturing.interface.ts ***!
  \**************************************************************/
/*! exports provided: COtherExpenses, ManufacturingItemRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COtherExpenses", function() { return COtherExpenses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManufacturingItemRequest", function() { return ManufacturingItemRequest; });
var COtherExpenses = /** @class */ (function () {
    function COtherExpenses() {
    }
    return COtherExpenses;
}());

var ManufacturingItemRequest = /** @class */ (function () {
    function ManufacturingItemRequest() {
    }
    return ManufacturingItemRequest;
}());

/*
product( string: uniquename stock ) ,
searchOperation(greaterThan , lessThan, greaterThanOrEquals, lessThanOrEquals, equals),
searchBy (quantityInward , quantityOutward, voucherNumber),
searchValue( any integer number),
from (date string),
to(date string)
*/


/***/ }),

/***/ "./src/app/models/interfaces/stocksItem.interface.ts":
/*!***********************************************************!*\
  !*** ./src/app/models/interfaces/stocksItem.interface.ts ***!
  \***********************************************************/
/*! exports provided: IStockItemDetail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IStockItemDetail", function() { return IStockItemDetail; });
var IStockItemDetail = /** @class */ (function () {
    function IStockItemDetail() {
    }
    return IStockItemDetail;
}());



/***/ })

}]);