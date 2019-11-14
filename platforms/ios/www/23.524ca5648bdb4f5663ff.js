(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[23],{

/***/ "./src/app/inventory-in-out/components/aside-menu/aside-menu.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/aside-menu/aside-menu.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n  <div [ngSwitch]=\"selectedAsideView\">\n    <ng-container *ngSwitchCase=\"'inward'\">\n      <inward-note [stockList]=\"stockList$ | async\"\n                   [userList]=\"userList$ | async\"\n                   [stockUnits]=\"stockUnits$ | async\"\n                   [isLoading]=\"isLoading\" (onSave)=\"onSave($event)\"\n                   (onCancel)=\"onCancel()\"></inward-note>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'outward'\">\n      <outward-note [stockList]=\"stockList$ | async\"\n                    [userList]=\"userList$ | async\"\n                    [isLoading]=\"isLoading\"\n                    [stockUnits]=\"stockUnits$ | async\"\n                    (onSave)=\"onSave($event)\"\n                    (onCancel)=\"onCancel()\"></outward-note>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'transfer'\">\n      <transfer-note [stockList]=\"stockList$ | async\"\n                     [userList]=\"userList$ | async\"\n                     [stockUnits]=\"stockUnits$ | async\"\n                     [isLoading]=\"isLoading\"\n                     (onSave)=\"onSave($event.entry,$event.user)\"\n                     (onCancel)=\"onCancel()\"></transfer-note>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'createStock'\">\n      <div class=\"pdT1\">\n        <inventory-add-stock [addStock]=\"true\" (closeAsideEvent)=\"onCancel()\"></inventory-add-stock>\n      </div>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'createAccount'\">\n      <inventory-user (onSave)=\"createAccount($event)\" (onCancel)=\"onCancel()\"></inventory-user>\n    </ng-container>\n    <!-- <ng-container *ngSwitchDefault>\n\n        <div class=\"aside-header\">\n            <h3 class=\"aside-title\">Select Type</h3>\n        </div>\n        <div class=\"aside-body\">\n            <div class=\"buttons-container\">\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"view='inward'\">Inward Note</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"view='outward'\">Outward Note</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"view='transfer'\">Transfer Note</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"view='createStock'\">Create Stock</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"view='createAccount'\">Create Account</button>\n            </div>\n        </div>\n    </ng-container> -->\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/aside-menu/aside-menu.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/aside-menu/aside-menu.component.ts ***!
  \********************************************************************************/
/*! exports provided: AsideMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuComponent", function() { return AsideMenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _actions_inventory_inventory_users_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/inventory.users.actions */ "./src/app/actions/inventory/inventory.users.actions.ts");
/* harmony import */ var _actions_inventory_inventory_entry_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/inventory/inventory.entry.actions */ "./src/app/actions/inventory/inventory.entry.actions.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/inventory/customStockUnit.actions */ "./src/app/actions/inventory/customStockUnit.actions.ts");










var AsideMenuComponent = /** @class */ (function () {
    function AsideMenuComponent(_store, _inventoryAction, _inventoryEntryAction, _generalService, _inventoryUserAction, _customStockActions) {
        this._store = _store;
        this._inventoryAction = _inventoryAction;
        this._inventoryEntryAction = _inventoryEntryAction;
        this._generalService = _generalService;
        this._inventoryUserAction = _inventoryUserAction;
        this._customStockActions = _customStockActions;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.view = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this._store.dispatch(this._inventoryAction.GetStock());
        // dispatch stockunit request
        this._store.dispatch(this._customStockActions.GetStockUnit());
        this._store.dispatch(this._inventoryUserAction.getAllUsers());
        this.createStockSuccess$ = this._store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsideMenuComponent.prototype.ngOnChanges = function (changes) {
        //
    };
    AsideMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.stockList$ = this._store
            .select(function (p) { return p.inventory.stocksList && p.inventory.stocksList.results; });
        this.stockUnits$ = this._store
            .select(function (p) { return p.inventory.stockUnits; });
        this.userList$ = this._store
            .select(function (p) { return p.inventoryInOutState.inventoryUsers.filter(function (o) { return o.uniqueName !== _this._generalService.companyUniqueName; }); });
        this._store
            .select(function (p) { return p.inventoryInOutState.entryInProcess; })
            .subscribe(function (p) { return _this.isLoading = p; });
        this._store
            .select(function (p) { return p.inventoryInOutState.userSuccess; })
            .subscribe(function (p) { return p && _this.closeAsidePane(p); });
        this.createStockSuccess$.subscribe(function (s) {
            if (s) {
                _this.closeAsidePane(s);
                var objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                _this._store.dispatch(_this._inventoryAction.ManageInventoryAside(objToSend));
            }
        });
    };
    AsideMenuComponent.prototype.onCancel = function () {
        this.view = '';
        this.closeAsidePane();
    };
    AsideMenuComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit();
        this.view = '';
    };
    AsideMenuComponent.prototype.onSave = function (entry, reciever) {
        this._store.dispatch(this._inventoryEntryAction.addNewEntry(entry, reciever));
    };
    AsideMenuComponent.prototype.createAccount = function (value) {
        this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideMenuComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuComponent.prototype, "selectedAsideView", void 0);
    AsideMenuComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-menu',
            template: __webpack_require__(/*! ./aside-menu.component.html */ "./src/app/inventory-in-out/components/aside-menu/aside-menu.component.html"),
            styles: ["\n    .buttons-container {\n      display: flex;\n      justify-content: center;\n      flex-direction: column;\n      align-items: center;\n      height: 100vh;\n    }\n\n    .buttons-container > * {\n      margin: 20px;\n    }\n\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      max-width:480px;\n      width: 100%;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      max-width:480px;\n      width: 100%;\n      padding: 0;\n      background: #fff;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _actions_inventory_inventory_entry_actions__WEBPACK_IMPORTED_MODULE_7__["InventoryEntryActions"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_8__["GeneralService"],
            _actions_inventory_inventory_users_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryUsersActions"],
            _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_9__["CustomStockUnitAction"]])
    ], AsideMenuComponent);
    return AsideMenuComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.html":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <h2 class=\"\">Create Account</h2>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" autocomplete=\"off\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6\">\n          <label>Name</label>\n          <input type=\"text\" formControlName=\"name\" class=\"form-control\"/>\n        </div>\n\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n      <!-- <div class=\"row\">\n  <div class=\"col-lg-3 form-group mrR1\">\n    <label class=\"d-block\">&nbsp;</label>\n    <button class=\"btn btn-sm\" (click)=\"onCancel.emit($event)\">Cancel</button>\n  </div>\n\n  <div class=\"col-lg-3 form-group mrR1\">\n    <label class=\"d-block\">&nbsp;</label>\n    <button class=\"btn btn-success btn-sm\" [ladda]=\"isLoading\" (click)=\"save()\">Save</button>\n  </div>\n</div> -->\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: InventoryUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryUserComponent", function() { return InventoryUserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);




var InventoryUserComponent = /** @class */ (function () {
    // public inventoryEntryDateValid;
    function InventoryUserComponent(_fb) {
        this._fb = _fb;
        this.onCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSave = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.today = new Date();
        var transaction = this._fb.group({
            type: ['SENDER', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            quantity: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            inventoryUser: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            stock: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            stockUnit: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.form = this._fb.group({
            name: ['']
        });
    }
    Object.defineProperty(InventoryUserComponent.prototype, "inventoryEntryDate", {
        get: function () {
            return this.form.get('inventoryEntryDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InventoryUserComponent.prototype, "transactions", {
        get: function () {
            return this.form.get('transactions');
        },
        enumerable: true,
        configurable: true
    });
    InventoryUserComponent.prototype.ngOnInit = function () {
        // this.inventoryEntryDateValid = this.form.get('inventoryEntryDate').errors?.required
    };
    InventoryUserComponent.prototype.ngOnChanges = function (changes) {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
    };
    InventoryUserComponent.prototype.userChanged = function (option, index) {
        if (index === void 0) { index = -1; }
        var items = this.form.get('transactions');
        var user = this.userList.find(function (p) { return p.uniqueName === option.value; });
        var inventoryUser = user ? { uniqueName: user.uniqueName } : null;
        if (index >= 0) {
            var control = items.at(index);
            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { inventoryUser: inventoryUser }));
        }
        else {
            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { inventoryUser: inventoryUser })); });
        }
    };
    InventoryUserComponent.prototype.stockChanged = function (option, index) {
        if (index === void 0) { index = -1; }
        var items = this.form.get('transactions');
        var stockItem = this.stockList.find(function (p) { return p.uniqueName === option.value; });
        var stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
        var stockUnit = stockItem ? { code: stockItem.stockUnit.code } : null;
        if (index >= 0) {
            var control = items.at(index);
            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { stock: stock, stockUnit: stockUnit }));
        }
        else {
            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { stock: stock, stockUnit: stockUnit })); });
        }
    };
    InventoryUserComponent.prototype.quantityChanged = function (event) {
        var items = this.form.get('transactions');
        items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { quantity: event.target.value })); });
    };
    InventoryUserComponent.prototype.save = function () {
        if (this.form.valid) {
            var inventoryEntryDate = moment__WEBPACK_IMPORTED_MODULE_3__(this.form.value.transferDate).format('DD-MM-YYYY');
            this.onSave.emit(this.form.value);
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InventoryUserComponent.prototype, "onCancel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InventoryUserComponent.prototype, "onSave", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InventoryUserComponent.prototype, "stockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InventoryUserComponent.prototype, "userList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InventoryUserComponent.prototype, "isLoading", void 0);
    InventoryUserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inventory-user',
            template: __webpack_require__(/*! ./inventory-user.component.html */ "./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.html"),
            styles: ["\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], InventoryUserComponent);
    return InventoryUserComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n    <div>\n        <h3 class=\"\">\n            <span>Inward Note</span>\n            <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'sender' }\"\n         (click)=\"modeChanged('sender')\">Senders</a>\n      /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n        </h3>\n\n    </div>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n    <div class=\"form_bg clearfix\">\n        <form [formGroup]=\"form\" class=\"form-group\">\n            <div class=\"row\">\n                <div class=\"col-xs-6 form-group\">\n                    <label>Date <sup>*</sup></label>\n                    <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\" class=\"form-control\" bsDatepicker [minDate]=\"today\" [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n                    <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n                </div>\n\n                <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'sender'\">\n                    <label>Product Name <sup>*</sup></label>\n                    <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" [disabled]=\"stock.disabled\" formControlName=\"stock\" (selected)=\"stockChanged($event)\"></sh-select>\n                    <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n                </div>\n\n                <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'product'\">\n                    <label>Sender <sup>*</sup></label>\n                    <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Sender'\" formControlName=\"inventoryUser\" (selected)=\"userChanged($event)\"></sh-select>\n                    <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Sender.</span>\n                    </span> -->\n                </div>\n\n            </div>\n\n            <div class=\"row\">\n                <div class=\"col-xs-4\" *ngIf=\"mode === 'sender'\">\n                    <label class=\"fs14\">Sender <sup>*</sup></label>\n                </div>\n                <div class=\"col-xs-4\" *ngIf=\"mode === 'product'\">\n                    <label class=\"fs14\">Product Name <sup>*</sup></label>\n                </div>\n\n                <div class=\"col-xs-4\">\n                    <label class=\"fs14\">Unit<sup>*</sup></label>\n                </div>\n\n                <div class=\"col-xs-4\">\n                    <label class=\"fs14\">Quantity <sup>*</sup></label>\n                </div>\n            </div>\n\n\n            <div class=\"row\" formArrayName=\"transactions\" *ngFor=\"let item of transactions.controls; let i = index;let first = first;let last = last\">\n                <div [formGroupName]=\"i\">\n\n                    <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'sender'\">\n                        <!-- <label class=\"mrB1\">Sender</label> -->\n                        <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Sender'\" (selected)=\"userChanged($event,i)\" formControlName=\"inventoryUser\" [ItemHeight]=\"'33'\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('inventoryUser')?.errors?.required\"\n                  class=\"text-danger\">Please select Sender.</span> -->\n                    </div>\n                    <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'product'\">\n                        <!-- <label class=\"mrB1\">Product Name</label> -->\n                        <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" (selected)=\"stockChanged($event,i)\" [ItemHeight]=\"'33'\" formControlName=\"stock\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('stock')?.errors?.required\" class=\"text-danger\">Please select Product.</span> -->\n                    </div>\n\n                    <div class=\"col-xs-4 form-group\">\n                        <sh-select [options]=\"stockUnitsOptions\" [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\" [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('stockUnit')?.errors?.required\" class=\"text-danger\">Please select Unit.</span> -->\n                    </div>\n\n                    <div class=\"col-xs-4 form-group\">\n                        <!-- <label class=\"mrB1\">Quantity</label> -->\n                        <div class=\"row\">\n                            <div class=\"col-xs-10\">\n                                <input name=\"\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n                            </div>\n\n\n                            <div class=\"pull-right mrT unit_add\">\n                                <button class=\"btn-link\" (click)=\"addTransactionItem(transactions.controls[i])\" *ngIf=\"last\">\n                  <i class=\"fa fa-plus add_row\"></i>\n                </button>\n                                <button class=\"btn-link\" (click)=\"deleteTransactionItem(i)\" *ngIf=\"!last\">\n                  <i class=\"fa fa-times dlet\"></i>\n                </button>\n                            </div>\n                        </div>\n                        <!-- <span [hidden]=\"!item.get('quantity')?.errors?.required\" class=\"text-danger\">Please enter quantity.</span> -->\n                    </div>\n\n                </div>\n            </div>\n\n            <ng-container *ngIf=\"mode === 'sender'\">\n                <div class=\"row\">\n\n                    <div class=\"mrT1 pdL pdR\">\n                        <div class=\"col-xs-12\">\n                            <div class=\"checkbox\">\n                                <label class=\"\" for=\"isManufactured\">\n                  <input type=\"checkbox\" formControlName=\"isManufactured\" id=\"isManufactured\" name=\"isManufactured\"> Is\n                  it\n                  a\n                  finished stock? (Manufacturing/Combo)</label>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <section class=\"col-xs-12\" *ngIf=\"form.value.isManufactured\">\n                        <div class=\"\">\n                            <h1 class=\"section_head bdrB\"><strong>{{form.controls['stock'].value}} (Made with)</strong></h1>\n\n                            <div formGroupName=\"manufacturingDetails\">\n\n                                <div class=\"row\" style=\"padding-top: 5px\">\n                                    <div class=\"col-xs-4\">\n                                        <label class=\"fs14\">Output Qty <sup>*</sup></label>\n                                    </div>\n                                    <div class=\"col-xs-5\">\n                                        <label class=\"fs14\">Stock Unit <sup>*</sup></label>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4 form-group\">\n                                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"manufacturingQuantity\" placeholder=\"Quantity\" formControlName=\"manufacturingQuantity\" />\n                                    </div>\n\n                                    <div class=\"col-xs-5 form-group\">\n                                        <sh-select [options]=\"stockUnitsOptions\" formControlName=\"manufacturingUnitCode\" [placeholder]=\"'Select Unit'\" [multiple]=\"false\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                                    </div>\n\n                                    <div class=\"col-xs-3\" style=\"display: flex;align-items: center;height: 30px\" *ngIf=\"manufacturingDetails.controls['manufacturingQuantity'].value\">\n                                        <label>&nbsp;</label>\n                                        <span class=\"d-block\"><strong>= ( {{manufacturingDetails.controls['manufacturingQuantity'].value}} {{manufacturingDetails.controls['manufacturingUnitCode'].value}} {{stock.value}} )</strong></span>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4\">\n                                        <strong>Input Stock Name</strong>\n                                    </div>\n                                    <div class=\"col-xs-3\">\n                                        <strong>Stock Qty</strong>\n                                    </div>\n                                    <div class=\"col-xs-4\">\n                                        <strong>Stock Unit</strong>\n                                    </div>\n                                </div>\n\n                                <ng-container formArrayName=\"linkedStocks\">\n                                    <div class=\"row\" *ngFor=\"let list of manufacturingDetails['controls']['linkedStocks'].controls;let i = index; let l = last\" [formGroupName]=\"i\">\n\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockListOptions\" formControlName=\"stockUniqueName\" [multiple]=\"false\" [placeholder]=\"'Select Stock Name'\" [ItemHeight]=\"33\" (selected)=\"findAddedStock($event?.value, i)\"></sh-select>\n                                        </div>\n                                        <div class=\"col-xs-3 form-group\">\n                                            <input type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"quantity\" placeholder=\"Enter Quantity\" class=\"form-control\" />\n                                        </div>\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockUnitsOptions\" formControlName=\"stockUnitCode\" [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"></sh-select>\n                                        </div>\n                                        <div class=\"pull-right mrT unit_add\">\n                                            <button class=\"btn-link\" (click)=\"addItemInLinkedStocks(list, i, i)\" *ngIf=\"l\" [disabled]=\"disableStockButton\"><i class=\"fa fa-plus add_row\"></i></button>\n                                            <button class=\"btn-link\" (click)=\"removeItemInLinkedStocks(i)\" *ngIf=\"!l\"><i\n                        class=\"fa fa-times dlet\"></i></button>\n                                        </div>\n\n\n                                    </div>\n                                </ng-container>\n\n                            </div>\n                        </div>\n                    </section>\n\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-lg-12 form-group\">\n                        <label>Description</label>\n                        <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n                    </div>\n                </div>\n            </ng-container>\n\n            <div class=\"row\">\n                <div class=\"col-xs-12 text-left mrT1\">\n                    <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n                    <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.ts ***!
  \****************************************************************************************/
/*! exports provided: InwardNoteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InwardNoteComponent", function() { return InwardNoteComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/helpers */ "./src/app/shared/helpers/index.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/inventory.service */ "./src/app/services/inventory.service.ts");







var InwardNoteComponent = /** @class */ (function () {
    function InwardNoteComponent(_fb, _toasty, _inventoryService, _zone) {
        this._fb = _fb;
        this._toasty = _toasty;
        this._inventoryService = _inventoryService;
        this._zone = _zone;
        this.onCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSave = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.mode = 'sender';
        this.today = new Date();
        this.editLinkedStockIdx = null;
        this.editModeForLinkedStokes = false;
        this.disableStockButton = false;
        this.initializeForm(true);
    }
    Object.defineProperty(InwardNoteComponent.prototype, "inventoryEntryDate", {
        get: function () {
            return this.form.get('inventoryEntryDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "inventoryUser", {
        get: function () {
            return this.form.get('inventoryUser');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "stock", {
        get: function () {
            return this.form.get('stock');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "transactions", {
        get: function () {
            return this.form.get('transactions');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "manufacturingDetails", {
        get: function () {
            return this.form.get('manufacturingDetails');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InwardNoteComponent.prototype, "isManufactured", {
        get: function () {
            return this.form.get('isManufactured');
        },
        enumerable: true,
        configurable: true
    });
    InwardNoteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.manufacturingDetails.disable();
        this.isManufactured.valueChanges.subscribe(function (val) {
            _this.manufacturingDetails.reset();
            val ? _this.manufacturingDetails.enable() : _this.manufacturingDetails.disable();
        });
    };
    InwardNoteComponent.prototype.initializeForm = function (initialRequest) {
        if (initialRequest === void 0) { initialRequest = false; }
        this.form = this._fb.group({
            inventoryEntryDate: [moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            transactions: this._fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required),
            description: [''],
            inventoryUser: [''],
            stock: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            isManufactured: [false],
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _shared_helpers__WEBPACK_IMPORTED_MODULE_4__["digitsOnly"]]],
                manufacturingUnitCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_4__["digitsOnly"]],
                linkedStockUnitCode: [''],
            }, { validator: _shared_helpers__WEBPACK_IMPORTED_MODULE_4__["stockManufacturingDetailsValidator"] })
        });
        if (initialRequest) {
            this.addTransactionItem();
        }
    };
    InwardNoteComponent.prototype.initialIManufacturingDetails = function () {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_4__["digitsOnly"]]
        });
    };
    InwardNoteComponent.prototype.modeChanged = function (mode) {
        this.mode = mode;
        this.form.reset();
        this.inventoryEntryDate.patchValue(moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'));
        this.transactions.controls = this.transactions.controls.filter(function (trx) { return false; });
        if (this.mode === 'sender') {
            this.stock.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.inventoryUser.clearValidators();
            this.inventoryUser.updateValueAndValidity();
        }
        else {
            this.inventoryUser.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.stock.clearValidators();
            this.stock.updateValueAndValidity();
        }
        this.addTransactionItem();
    };
    InwardNoteComponent.prototype.ngOnChanges = function (changes) {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(function (p) { return ({ label: p.name + " (" + p.code + ")", value: p.code }); });
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
    };
    InwardNoteComponent.prototype.addTransactionItem = function (control) {
        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            return;
        }
        var items = this.transactions;
        var value = items.length > 0 ? items.at(0).value : {
            type: '',
            quantity: '',
            inventoryUser: '',
            stock: '',
            stockUnit: '',
        };
        var transaction = this._fb.group({
            type: ['SENDER', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            quantity: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'sender' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            stock: [this.mode === 'sender' ? value.stock : '', this.mode === 'product' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            stockUnit: [this.mode === 'sender' ? value.stockUnit : '', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        transaction.updateValueAndValidity();
        items.push(transaction);
    };
    InwardNoteComponent.prototype.deleteTransactionItem = function (index) {
        var items = this.form.get('transactions');
        items.removeAt(index);
    };
    InwardNoteComponent.prototype.userChanged = function (option, index) {
        var items = this.form.get('transactions');
        var user = this.userList.find(function (p) { return p.uniqueName === option.value; });
        var inventoryUser = user ? { uniqueName: user.uniqueName } : null;
        if (index >= 0) {
            var control = items.at(index);
            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { inventoryUser: inventoryUser }));
        }
        else {
            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { inventoryUser: inventoryUser })); });
        }
    };
    InwardNoteComponent.prototype.stockChanged = function (option, index) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var items, stockItem, stock, stockUnit, stockDetails, mfd_1, e_1, control;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.transactions;
                        stockItem = this.stockList.find(function (p) { return p.uniqueName === option.value; });
                        stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
                        stockUnit = stockItem ? stockItem.stockUnit.code : null;
                        if (!(stockItem && this.mode === 'sender')) return [3 /*break*/, 4];
                        this.stock.disable();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getStockDetails(stockItem)];
                    case 2:
                        stockDetails = _a.sent();
                        this._zone.run(function () {
                            _this.stock.enable();
                        });
                        if (stockDetails.body && stockDetails.body.manufacturingDetails) {
                            mfd_1 = stockDetails.body.manufacturingDetails;
                            this.isManufactured.patchValue(true);
                            this.manufacturingDetails.patchValue({
                                manufacturingQuantity: mfd_1.manufacturingQuantity,
                                manufacturingUnitCode: mfd_1.manufacturingUnitCode
                            });
                            mfd_1.linkedStocks.map(function (item, i) {
                                _this.addItemInLinkedStocks(item, i, mfd_1.linkedStocks.length - 1);
                            });
                        }
                        else {
                            this.isManufactured.patchValue(false);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this._zone.run(function () {
                            _this.stock.enable();
                        });
                        this._toasty.errorToast('something went wrong. please try again!');
                        return [3 /*break*/, 4];
                    case 4:
                        if (index >= 0) {
                            control = items.at(index);
                            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { stock: stock, stockUnit: stockUnit }));
                        }
                        else {
                            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { stock: stock, stockUnit: stockUnit })); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * findAddedStock
     */
    InwardNoteComponent.prototype.findAddedStock = function (uniqueName, i) {
        var manufacturingDetailsContorl = this.manufacturingDetails;
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var count = 0;
        _.forEach(control.controls, function (o) {
            if (o.value.stockUniqueName === uniqueName) {
                count++;
            }
        });
        if (count > 1) {
            this._toasty.errorToast('Stock already added.');
            this.disableStockButton = true;
            return;
        }
        else {
            var stockItem = this.stockList.find(function (p) { return p.uniqueName === uniqueName; });
            var stockUnit = stockItem ? stockItem.stockUnit.code : null;
            control.at(i).get('stockUnitCode').patchValue(stockUnit);
            this.disableStockButton = false;
        }
    };
    InwardNoteComponent.prototype.addItemInLinkedStocks = function (item, i, lastIdx) {
        var manufacturingDetailsContorl = this.manufacturingDetails;
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var frmgrp = this.initialIManufacturingDetails();
        if (item) {
            if (item.controls) {
                var isValid = this.validateLinkedStock(item.value);
                if (isValid) {
                    // control.controls[i] = item;
                }
                else {
                    return this._toasty.errorToast('All fields are required.');
                }
            }
            else {
                var isValid = this.validateLinkedStock(item);
                if (isValid) {
                    frmgrp.patchValue(item);
                    control.controls[i] = frmgrp;
                }
                else {
                    return this._toasty.errorToast('All fields are required.');
                }
            }
            if (i === lastIdx) {
                control.controls.push(this.initialIManufacturingDetails());
            }
        }
    };
    InwardNoteComponent.prototype.removeItemInLinkedStocks = function (i) {
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        var manufacturingDetailsContorl = this.manufacturingDetails;
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        control.removeAt(i);
    };
    /**
     * validateLinkedStock
     */
    InwardNoteComponent.prototype.validateLinkedStock = function (item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    };
    InwardNoteComponent.prototype.save = function () {
        var _this = this;
        if (this.form.valid) {
            var rawValues = this.transactions.getRawValue();
            rawValues.map(function (rv) {
                rv.stockUnit = { code: rv.stockUnit };
                return rv;
            });
            var value = {
                inventoryEntryDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                description: this.description.value,
                transactions: rawValues,
            };
            // if (this.mode === 'sender') {
            //   value.transactions = value.transactions.map(trx => {
            //     trx.manufacturingDetails = {
            //       manufacturingQuantity: this.manufacturingDetails.value.manufacturingQuantity,
            //       manufacturingUnitCode: this.manufacturingDetails.value.manufacturingUnitCode,
            //       linkedStocks: this.manufacturingDetails.value.linkedStocks,
            //     };
            //     return trx;
            //   });
            //   value.isManufactured = this.isManufactured.value;
            // }
            if (this.mode === 'sender') {
                value.transactions = value.transactions.map(function (trx) {
                    var linkedStocks = _this.removeBlankLinkedStock(_this.manufacturingDetails.controls.linkedStocks);
                    trx.manufacturingDetails = {
                        manufacturingQuantity: _this.manufacturingDetails.value.manufacturingQuantity,
                        manufacturingUnitCode: _this.manufacturingDetails.value.manufacturingUnitCode,
                        linkedStocks: linkedStocks.map(function (l) { return l; }),
                    };
                    return trx;
                });
                value.isManufactured = this.isManufactured.value;
            }
            this.onSave.emit(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, value));
        }
    };
    InwardNoteComponent.prototype.getStockDetails = function (stockItem) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._inventoryService.GetStockDetails(stockItem.stockGroup.uniqueName, stockItem.uniqueName).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * removeBlankLinkedStock
     */
    InwardNoteComponent.prototype.removeBlankLinkedStock = function (linkedStocks) {
        var manufacturingDetailsContorl = this.manufacturingDetails;
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var rawArr = control.getRawValue();
        _.forEach(rawArr, function (o, i) {
            if (!o.quantity || !o.stockUniqueName || !o.stockUnitCode) {
                rawArr = _.without(rawArr, o);
                control.removeAt(i);
            }
        });
        linkedStocks = _.cloneDeep(rawArr);
        return linkedStocks;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InwardNoteComponent.prototype, "onCancel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InwardNoteComponent.prototype, "onSave", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InwardNoteComponent.prototype, "stockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InwardNoteComponent.prototype, "stockUnits", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InwardNoteComponent.prototype, "userList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InwardNoteComponent.prototype, "isLoading", void 0);
    InwardNoteComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inward-note',
            template: __webpack_require__(/*! ./inward-note.component.html */ "./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.html"),
            styles: ["\n    .pad-10-5 {\n      padding: 10px 5px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__["InventoryService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]])
    ], InwardNoteComponent);
    return InwardNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <div>\n    <h3 class=\"\">\n      <span>Outward Note</span>\n      <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'receiver' }\"\n         (click)=\"modeChanged('receiver')\">Receivers</a>\n      /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n    </h3>\n\n  </div>\n</div>\n\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Date <sup>*</sup></label>\n          <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\"\n                 class=\"form-control\" bsDatepicker [minDate]=\"today\" [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\"/>\n          <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n        </div>\n\n        <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'receiver'\">\n          <label class=\"mrB1\">Product Name <sup>*</sup></label>\n          <sh-select [options]=\"stockListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Product'\"\n                     formControlName=\"stock\"\n                     (selected)=\"stockChanged($event)\"></sh-select>\n          <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'product'\">\n          <label class=\"mrB1\">Receiver <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Receiver'\"\n                     formControlName=\"inventoryUser\"\n                     (selected)=\"userChanged($event)\"></sh-select>\n          <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Receiver.</span>\n                    </span> -->\n        </div>\n\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-4\" *ngIf=\"mode === 'receiver'\">\n          <label class=\"fs14\">Receiver <sup>*</sup></label>\n        </div>\n        <div class=\"col-xs-4\" *ngIf=\"mode === 'product'\">\n          <label class=\"fs14\">Product Name <sup>*</sup></label>\n        </div>\n\n        <div class=\"col-xs-4\">\n          <label class=\"fs14\">Unit<sup>*</sup></label>\n        </div>\n\n        <div class=\"col-xs-4\">\n          <label class=\"fs14\">Quantity <sup>*</sup></label>\n        </div>\n      </div>\n\n      <div class=\"row\" formArrayName=\"transactions\"\n           *ngFor=\"let item of transactions.controls; let i = index;let first = first;let last = last\">\n        <div [formGroupName]=\"i\">\n\n          <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'receiver'\">\n            <!-- <label class=\"mrB1\">Receiver</label> -->\n            <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Receiver'\"\n                       (selected)=\"userChanged($event,i)\" formControlName=\"inventoryUser\"\n                       [ItemHeight]=\"'33'\"></sh-select>\n            <!-- <span [hidden]=\"!item.controls['inventoryUser'].errors?.required\"\n                  class=\"text-danger\">Please select Receiver.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'product'\">\n            <!-- <label class=\"mrB1\">Product Name</label> -->\n            <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\"\n                       (selected)=\"stockChanged($event,i)\" [ItemHeight]=\"'33'\" formControlName=\"stock\"></sh-select>\n            <!-- <span [hidden]=\"!item.controls['stock'].errors?.required\"\n                  class=\"text-danger\">Please select Product.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\">\n            <sh-select [options]=\"stockUnitsOptions\"\n                       [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\"\n                       [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n            <!-- <span [hidden]=\"!item.get('stockUnit')?.errors?.required\" class=\"text-danger\">Please select Unit.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\">\n            <!-- <label class=\"mrB1\">Quantity</label> -->\n\n            <div class=\"row\">\n              <div class=\"col-xs-10\">\n                <input name=\"\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n              </div>\n\n\n              <div class=\"pull-right mrT unit_add\">\n                <button class=\"btn-link\" (click)=\"addTransactionItem(transactions.controls[i])\" *ngIf=\"last\">\n                  <i class=\"fa fa-plus add_row\"></i>\n                </button>\n                <button class=\"btn-link\" (click)=\"deleteTransactionItem(i)\" *ngIf=\"!last\">\n                  <i class=\"fa fa-times dlet\"></i>\n                </button>\n              </div>\n            </div>\n            <!-- <span [hidden]=\"!item.controls['quantity'].errors?.required\"\n                  class=\"text-danger\">Please enter quantity.</span> -->\n            <!--\n<div class=\"input-group\">\n  <input name=\"dateRange\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n  <span [hidden]=\"!item.controls['quantity'].errors?.required\" class=\"text-danger\">Please enter quantity.</span>\n</div> -->\n          </div>\n          <!-- <div class=\"col-lg-2 form-group pdT2\">\n  <a (click)=\"addTransactionItem()\">\n    <i class=\"fa fa-plus\" *ngIf=\"first || !last\"></i>\n  </a>\n  <a (click)=\"deleteTransactionItem(i)\">\n    <i class=\"fa fa-close\" *ngIf=\"!first && last\"></i>\n  </a>\n</div> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-lg-12 form-group\">\n          <label>Description</label>\n          <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n          <!-- <div class=\"input-group\">\n  <input name=\"dateRange\" formControlName=\"description\" type=\"text\" class=\"form-control\">\n</div> -->\n        </div>\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.ts ***!
  \******************************************************************************************/
/*! exports provided: OutwardNoteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutwardNoteComponent", function() { return OutwardNoteComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);




var OutwardNoteComponent = /** @class */ (function () {
    function OutwardNoteComponent(_fb) {
        this._fb = _fb;
        this.onCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSave = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.mode = 'receiver';
        this.today = new Date();
        this.initializeForm(true);
    }
    Object.defineProperty(OutwardNoteComponent.prototype, "inventoryEntryDate", {
        get: function () {
            return this.form.get('inventoryEntryDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutwardNoteComponent.prototype, "transactions", {
        get: function () {
            return this.form.get('transactions');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutwardNoteComponent.prototype, "inventoryUser", {
        get: function () {
            return this.form.get('inventoryUser');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutwardNoteComponent.prototype, "stock", {
        get: function () {
            return this.form.get('stock');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutwardNoteComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: true,
        configurable: true
    });
    OutwardNoteComponent.prototype.initializeForm = function (initialRequest) {
        if (initialRequest === void 0) { initialRequest = false; }
        this.form = this._fb.group({
            inventoryEntryDate: [moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            transactions: this._fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required),
            description: [''],
            inventoryUser: [''],
            stock: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        if (initialRequest) {
            this.addTransactionItem();
        }
    };
    OutwardNoteComponent.prototype.modeChanged = function (mode) {
        this.mode = mode;
        this.form.reset();
        this.inventoryEntryDate.patchValue(moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'));
        this.transactions.controls = this.transactions.controls.filter(function (trx) { return false; });
        if (this.mode === 'receiver') {
            this.stock.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.inventoryUser.clearValidators();
            this.inventoryUser.updateValueAndValidity();
        }
        else {
            this.inventoryUser.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.stock.clearValidators();
            this.stock.updateValueAndValidity();
        }
        this.addTransactionItem();
    };
    OutwardNoteComponent.prototype.ngOnChanges = function (changes) {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(function (p) { return ({ label: p.name + " (" + p.code + ")", value: p.code }); });
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
    };
    OutwardNoteComponent.prototype.addTransactionItem = function (control) {
        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            return;
        }
        var items = this.form.get('transactions');
        var value = items.length > 0 ? items.at(0).value : {
            type: '',
            quantity: '',
            inventoryUser: '',
            stock: '',
            stockUnit: '',
        };
        var transaction = this._fb.group({
            type: ['RECEIVER', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            quantity: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'receiver' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            stock: [this.mode === 'receiver' ? value.stock : '', this.mode === 'product' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            stockUnit: [this.mode === 'receiver' ? value.stockUnit : '', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        transaction.updateValueAndValidity();
        items.push(transaction);
    };
    OutwardNoteComponent.prototype.deleteTransactionItem = function (index) {
        var items = this.form.get('transactions');
        items.removeAt(index);
    };
    OutwardNoteComponent.prototype.userChanged = function (option, index) {
        var items = this.form.get('transactions');
        var user = this.userList.find(function (p) { return p.uniqueName === option.value; });
        var inventoryUser = user ? { uniqueName: user.uniqueName } : null;
        if (index >= 0) {
            var control = items.at(index);
            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { inventoryUser: inventoryUser }));
        }
        else {
            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { inventoryUser: inventoryUser })); });
        }
    };
    OutwardNoteComponent.prototype.stockChanged = function (option, index) {
        var items = this.transactions;
        var stockItem = this.stockList.find(function (p) { return p.uniqueName === option.value; });
        var stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
        var stockUnit = stockItem ? stockItem.stockUnit.code : null;
        if (index >= 0) {
            var control = items.at(index);
            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { stock: stock, stockUnit: stockUnit }));
        }
        else {
            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { stock: stock, stockUnit: stockUnit })); });
        }
    };
    OutwardNoteComponent.prototype.save = function () {
        if (this.form.valid) {
            var rawValues = this.transactions.getRawValue();
            rawValues.map(function (rv) {
                rv.stockUnit = { code: rv.stockUnit };
                return rv;
            });
            var value = {
                inventoryEntryDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                description: this.description.value,
                transactions: rawValues
            };
            this.onSave.emit(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, value));
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], OutwardNoteComponent.prototype, "onCancel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], OutwardNoteComponent.prototype, "onSave", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], OutwardNoteComponent.prototype, "stockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], OutwardNoteComponent.prototype, "stockUnits", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], OutwardNoteComponent.prototype, "userList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], OutwardNoteComponent.prototype, "isLoading", void 0);
    OutwardNoteComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'outward-note',
            template: __webpack_require__(/*! ./outward-note.component.html */ "./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.html"),
            styles: ["\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], OutwardNoteComponent);
    return OutwardNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.html":
/*!**********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <h2 class=\"\">Transfer Note</h2>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Date <sup>*</sup></label>\n          <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\"\n                 class=\"form-control\" bsDatepicker [minDate]=\"today\" [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n          <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Product Name <sup>*</sup></label>\n          <sh-select [options]=\"stockListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Product'\"\n                     (selected)=\"stockChanged($event)\"\n                     [ItemHeight]=\"'33'\"\n                     formControlName=\"stock\"></sh-select>\n          <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Sender's Name <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Sender'\"\n                     formControlName=\"inventoryUser\"\n                     [ItemHeight]=\"'33'\"></sh-select>\n          <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Sender.</span>\n                    </span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Receiver's Name <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Receiver'\"\n                     (selected)=\"recieverUniqueName = $event.value\"\n                     [ItemHeight]=\"'33'\"></sh-select>\n          <!-- <span [hidden]=\"recieverUniqueName\" class=\"text-danger\">Please select Receiver.</span> -->\n        </div>\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Quantity <sup>*</sup></label>\n          <input name=\"dateRange\" type=\"text\" class=\"form-control\" formControlName=\"quantity\"\n                 [placeholder]=\"'Enter Quantity'\"/>\n          <!-- <span *ngIf=\"quantity?.errors && quantity.errors['required']\"\n                class=\"text-danger\">Please enter quantity.</span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Unit <sup>*</sup></label>\n          <sh-select [options]=\"stockUnitsOptions\"\n                     [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\"\n                     [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n          <!-- <span *ngIf=\"stockUnit?.errors && stockUnit.errors['required']\" class=\"text-danger\">Please select Unit.</span> -->\n        </div>\n\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-lg-8 form-group\">\n          <label class=\"mrB1\">Description</label>\n          <input name=\"dateRange\" formControlName=\"description\" type=\"text\" class=\"form-control\">\n          <!-- <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.ts ***!
  \********************************************************************************************/
/*! exports provided: TransferNoteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransferNoteComponent", function() { return TransferNoteComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);




var TransferNoteComponent = /** @class */ (function () {
    // public inventoryEntryDateValid;
    function TransferNoteComponent(_fb) {
        this._fb = _fb;
        this.onCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSave = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.today = new Date();
        this.form = this._fb.group({
            inventoryEntryDate: [moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            transactions: this._fb.array([]),
            description: [''],
            type: ['SENDER', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            quantity: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            inventoryUser: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            stock: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            stockUnit: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
    }
    Object.defineProperty(TransferNoteComponent.prototype, "inventoryEntryDate", {
        get: function () {
            return this.form.get('inventoryEntryDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "type", {
        get: function () {
            return this.form.get('type');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "quantity", {
        get: function () {
            return this.form.get('quantity');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "inventoryUser", {
        get: function () {
            return this.form.get('inventoryUser');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "stock", {
        get: function () {
            return this.form.get('stock');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "stockUnit", {
        get: function () {
            return this.form.get('stockUnit');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransferNoteComponent.prototype, "transactions", {
        get: function () {
            return this.form.get('transactions');
        },
        enumerable: true,
        configurable: true
    });
    TransferNoteComponent.prototype.ngOnInit = function () {
        //
    };
    TransferNoteComponent.prototype.ngOnChanges = function (changes) {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(function (p) { return ({ label: p.name + " (" + p.code + ")", value: p.code }); });
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
    };
    TransferNoteComponent.prototype.stockChanged = function (option) {
        var stockItem = this.stockList.find(function (p) { return p.uniqueName === option.value; });
        var stockUnit = stockItem ? stockItem.stockUnit.code : null;
        this.form.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.form.value, { stockUnit: stockUnit }));
    };
    TransferNoteComponent.prototype.save = function () {
        if (this.form.valid) {
            var value = {
                inventoryEntryDate: moment__WEBPACK_IMPORTED_MODULE_3__(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                description: this.description.value,
                transactions: [{
                        stock: { uniqueName: this.stock.value },
                        inventoryUser: { uniqueName: this.inventoryUser.value },
                        stockUnit: { code: this.stockUnit.value },
                        type: this.type.value,
                        quantity: this.quantity.value
                    }]
            };
            this.onSave.emit({ entry: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, value), user: { uniqueName: this.recieverUniqueName } });
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], TransferNoteComponent.prototype, "onCancel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], TransferNoteComponent.prototype, "onSave", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], TransferNoteComponent.prototype, "stockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], TransferNoteComponent.prototype, "stockUnits", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], TransferNoteComponent.prototype, "userList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], TransferNoteComponent.prototype, "isLoading", void 0);
    TransferNoteComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'transfer-note',
            template: __webpack_require__(/*! ./transfer-note.component.html */ "./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.html"),
            styles: ["\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], TransferNoteComponent);
    return TransferNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/header-components/inventory-header-component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/header-components/inventory-header-component.ts ***!
  \*********************************************************************************************/
/*! exports provided: InventoryHeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryHeaderComponent", function() { return InventoryHeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");




var InventoryHeaderComponent = /** @class */ (function () {
    function InventoryHeaderComponent(_store) {
        this._store = _store;
        this.asideMenuState = 'out';
        this.selectedAsideView = '';
    }
    InventoryHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._store
            .select(function (p) { return p.inventoryInOutState.entrySuccess; })
            .subscribe(function (p) {
            if (p) {
                _this.toggleGroupStockAsidePane('');
            }
        });
    };
    InventoryHeaderComponent.prototype.toggleGroupStockAsidePane = function (view, event) {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
        this.selectedAsideView = view;
    };
    InventoryHeaderComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    InventoryHeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inventory-inout-header',
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out'))
                ]),
            ],
            template: "\n    <div class=\"inline pull-right\">\n      <div class=\"\">\n        <div class=\"pull-right\">\n\n          <div class=\"btn-group\" dropdown>\n            <button id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\"\n                    aria-controls=\"dropdown-basic\">\n              New <span class=\"caret\"></span>\n            </button>\n            <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu  dropdown-option dropdown-menu-right\"\n                role=\"menu\" aria-labelledby=\"button-basic\">\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"javascript:void(0);\" (click)=\"toggleGroupStockAsidePane('inward', $event)\">Inward Note</a></li>\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"javascript:void(0);\" (click)=\"toggleGroupStockAsidePane('outward', $event)\">Outward Note</a></li>\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"javascript:void(0);\" (click)=\"toggleGroupStockAsidePane('transfer', $event)\">Transfer Note</a></li>\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"javascript:void(0);\" (click)=\"toggleGroupStockAsidePane('createStock', $event)\">Create Stock</a></li>\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"javascript:void(0);\" (click)=\"toggleGroupStockAsidePane('createAccount', $event)\">Create Account</a></li>\n            </ul>\n          </div>\n          <!-- <button (click)=\"toggleGroupStockAsidePane($event)\" type=\"button\" class=\"btn btn-default\">New</button> -->\n        </div>\n      </div>\n    </div>\n    <aside-menu\n      [class]=\"asideMenuState\"\n      [@slideInOut]=\"asideMenuState\"\n      (closeAsideEvent)=\"toggleGroupStockAsidePane('', $event)\" [selectedAsideView]=\"selectedAsideView\"></aside-menu>\n    <div class=\"aside-overlay\" *ngIf=\"asideMenuState === 'in'\"></div>\n    <!-- <aside-custom-stock [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\" (closeAsideEvent)=\"toggleCustomUnitAsidePane($event)\"></aside-custom-stock>-->\n  ",
            styles: ["\n  "]
        })
        // <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
        // <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
        // [routerLink]="['custom-stock']"
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], InventoryHeaderComponent);
    return InventoryHeaderComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.html":
/*!************************************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"h100\">\n  <form class=\"fb__1-container mrB1 sadik\" name=\"groupReportForm\" novalidate (ngSubmit)=\"applyFilters(1)\" #f=\"ngForm\">\n    <div class=\"form-group\">\n      <!-- <label class=\"d-block\">From - To</label> -->\n      <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n             class=\"form-control date-range-picker\"\n             (applyDaterangepicker)=\"dateSelected($event)\"/>\n    </div>\n    <div class=\"form-group\">\n      <sh-select name=\"stockName\"\n                 [options]=\"stockOptions\"\n                 (selected)=\"searchChanged($event)\"\n                 [placeholder]=\"'Type to search stock'\" [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n    </div>\n    <div class=\"form-group\" *ngIf=\"type === 'stock'\">\n      <!--<label class=\"d-block\">Others</label> -->\n      <sh-select name=\"entity\" [options]=\"COMPARISON_FILTER\"\n                 (selected)=\"compareChanged($event)\"\n                 [placeholder]=\"'Select'\" [multiple]=\"false\"></sh-select>\n    </div>\n    <div class=\"form-group\" *ngIf=\"type === 'person'\">\n      <!--<label class=\"d-block\">Others</label> -->\n      <sh-select name=\"entity\" [options]=\"PERSON_FILTER\"\n                 (selected)=\"compareChanged($event)\"\n                 [placeholder]=\"'Select'\" [multiple]=\"false\" ngModel required></sh-select>\n      <span\n        class=\"text-danger\" style=\"position: absolute;margin-top: 2px;\"\n        *ngIf=\"f?.controls?.entity?.errors\">Please Select Filter.</span>\n    </div>\n    <div class=\"form-group max100\" *ngIf=\"type === 'stock'\">\n      <input name=\"number\" type=\"text\" placeholder=\"Number\" [(ngModel)]=\"filter.quantity\" class=\"form-control\"/>\n    </div>\n\n    <div class=\"form-group\">\n      <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!f.valid\">Go</button>\n    </div>\n  </form>\n\n  <section style=\"margin-top: 20px\">\n    <table class=\"table basic\">\n      <thead>\n      <tr>\n        <th class=\"bdrR\">Date</th>\n        <th class=\"bdrR bdrB\">Product Name</th>\n        <th class=\"bdrR bdrB\">Sender's Name</th>\n        <th class=\"bdrR bdrB\">Receiver's Name</th>\n        <th class=\"bdrR bdrB\">Qty</th>\n        <th class=\"bdrR bdrB\">Description</th>\n        <th class=\"bdrR bdrB\" *ngIf=\"type ==='stock'\">Closing Balance</th>\n      </tr>\n      </thead>\n      <tbody *ngIf=\"inventoryReport\">\n      <tr *ngFor=\"let txn of inventoryReport.transactions\">\n        <td class=\"bdrR\">{{txn.date}}</td>\n        <td class=\"bdrR\">{{txn.stock.name}}</td>\n        <td class=\"bdrR\">{{txn.sender.name}}</td>\n        <td class=\"bdrR\">{{txn.receiver.name}}</td>\n        <td class=\"bdrR\">{{txn.quantity}}</td>\n        <td class=\"bdrR\">{{txn.description}}</td>\n        <td class=\"bdrR\" *ngIf=\"type ==='stock'\">{{txn.closingQuantity}}</td>\n      </tr>\n      </tbody>\n      <tbody *ngIf=\"!inventoryReport\">\n      <tr>\n        <td colspan=\"7\" class=\"text-center empty_table\">\n          <h1>No Report Found !!</h1>\n        </td>\n      </tr>\n      </tbody>\n      <tfoot>\n      <tr >\n        <td colspan=\"100%\">\n          <div class=\"alC\" *ngIf=\"inventoryReport?.totalPages > 1\">\n            <pagination [maxSize]=\"5\"\n                        [totalItems]=\"inventoryReport.totalItems\"\n                        [itemsPerPage]=\"10\"\n                        (pageChanged)=\"applyFilters($event.page)\"\n                        class=\"pagination-sm\"\n                        [boundaryLinks]=\"true\"\n                        [rotate]=\"false\"></pagination>\n          </div>\n        </td>\n      </tr>\n      </tfoot>\n    </table>\n  </section>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: InventoryInOutReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryInOutReportComponent", function() { return InventoryInOutReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_inventory_report_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.report.actions */ "./src/app/actions/inventory/inventory.report.actions.ts");






var InventoryInOutReportComponent = /** @class */ (function () {
    function InventoryInOutReportComponent(_router, inventoryReportActions, _store) {
        var _this = this;
        this._router = _router;
        this.inventoryReportActions = inventoryReportActions;
        this._store = _store;
        this.datePickerOptions = {
            locale: {
                applyClass: 'btn-green',
                applyLabel: 'Go',
                fromLabel: 'From',
                format: 'D-MMM-YY',
                toLabel: 'To',
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            ranges: {
                'Last 1 Day': [
                    moment__WEBPACK_IMPORTED_MODULE_2__().subtract(1, 'days'),
                    moment__WEBPACK_IMPORTED_MODULE_2__()
                ],
                'Last 7 Days': [
                    moment__WEBPACK_IMPORTED_MODULE_2__().subtract(6, 'days'),
                    moment__WEBPACK_IMPORTED_MODULE_2__()
                ],
                'Last 30 Days': [
                    moment__WEBPACK_IMPORTED_MODULE_2__().subtract(29, 'days'),
                    moment__WEBPACK_IMPORTED_MODULE_2__()
                ],
                'Last 6 Months': [
                    moment__WEBPACK_IMPORTED_MODULE_2__().subtract(6, 'months'),
                    moment__WEBPACK_IMPORTED_MODULE_2__()
                ],
                'Last 1 Year': [
                    moment__WEBPACK_IMPORTED_MODULE_2__().subtract(12, 'months'),
                    moment__WEBPACK_IMPORTED_MODULE_2__()
                ]
            },
            startDate: moment__WEBPACK_IMPORTED_MODULE_2__().subtract(30, 'days'),
            endDate: moment__WEBPACK_IMPORTED_MODULE_2__()
        };
        this.filter = {};
        this.stockOptions = [];
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_2__().subtract(30, 'days').format('DD-MM-YYYY');
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_2__().format('DD-MM-YYYY');
        this.COMPARISON_FILTER = [
            { label: 'Greater Than', value: '>' },
            { label: 'Less Than', value: '<' },
            { label: 'Greater Than or Equals', value: '>=' },
            { label: 'Less Than or Equals', value: '<=' },
            { label: 'Equals', value: '=' }
        ];
        this.PERSON_FILTER = [
            { label: 'Sender', value: 'Sender' },
            { label: 'Receiver', value: 'Receiver' }
        ];
        this._router.params.subscribe(function (p) {
            _this.uniqueName = p.uniqueName;
            _this.type = p.type;
            _this.filter = {};
            if (_this.type === 'person') {
                _this.filter.includeSenders = true;
                _this.filter.includeReceivers = true;
                _this.filter.receivers = [_this.uniqueName];
                _this.filter.senders = [_this.uniqueName];
                _this.applyFilters(1, true);
            }
            else {
                _this.applyFilters(1, false);
            }
        });
        this._store.select(function (p) { return p.inventoryInOutState.inventoryReport; })
            .subscribe(function (p) { return _this.inventoryReport = p; });
        this._store.select(function (p) { return ({ stocksList: p.inventory.stocksList, inventoryUsers: p.inventoryInOutState.inventoryUsers }); })
            .subscribe(function (p) { return p.inventoryUsers && p.stocksList &&
            (_this.stockOptions = p.stocksList.results.map(function (r) { return ({ label: r.name, value: r.uniqueName, additional: 'stock' }); })
                .concat(p.inventoryUsers.map(function (r) { return ({ label: r.name, value: r.uniqueName, additional: 'person' }); }))); });
    }
    InventoryInOutReportComponent.prototype.dateSelected = function (val) {
        var _a = val.picker, startDate = _a.startDate, endDate = _a.endDate;
        this.startDate = startDate.format('DD-MM-YYYY');
        this.endDate = endDate.format('DD-MM-YYYY');
    };
    InventoryInOutReportComponent.prototype.searchChanged = function (val) {
        this.filter.senders =
            this.filter.receivers = [];
        this.uniqueName = val.value;
        this.type = val.additional;
    };
    InventoryInOutReportComponent.prototype.compareChanged = function (option) {
        this.filter = {};
        switch (option.value) {
            case '>':
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = false;
                break;
            case '<':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = true;
                break;
            case '<=':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = true;
                break;
            case '>=':
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '=':
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case 'Sender':
                this.filter.senders = [this.uniqueName];
                this.filter.includeReceivers = false;
                this.filter.includeSenders = true;
                this.filter.receivers = [];
                break;
            case 'Receiver':
                this.filter.senders = [];
                this.filter.includeSenders = false;
                this.filter.includeReceivers = true;
                this.filter.receivers = [this.uniqueName];
                break;
        }
    };
    InventoryInOutReportComponent.prototype.applyFilters = function (page, applyFilter) {
        if (applyFilter === void 0) { applyFilter = true; }
        this._store.dispatch(this.inventoryReportActions
            .genReport(this.uniqueName, this.startDate, this.endDate, page, 10, applyFilter ? this.filter : null));
    };
    InventoryInOutReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'invetory-in-out-report',
            template: __webpack_require__(/*! ./inventory-in-out-report.component.html */ "./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.html"),
            styles: ["\n    .bdrT {\n      border-color: #ccc;\n    }\n\n    :host ::ng-deep .fb__1-container {\n      justify-content: flex-start;\n    }\n\n    :host ::ng-deep .fb__1-container .form-group {\n      margin-right: 10px;\n      margin-bottom: 0;\n    }\n\n    :host ::ng-deep .fb__1-container .date-range-picker {\n      min-width: 150px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _actions_inventory_inventory_report_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryReportActions"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"]])
    ], InventoryInOutReportComponent);
    return InventoryInOutReportComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.html":
/*!*************************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.html ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"inventory-sidebar\" class=\"sidebar pull-left\" #sidebar>\n  <div class=\"h100 clearfix\">\n    <div class=\"width100 pd1 pdT0\">\n      <input class=\"form-control\" type=\"search\" placeholder=\"Search Stock\" #search>\n    </div>\n    <div id=\"settingTab\">\n      <tabset>\n        <tab heading=\"Stocks\" id=\"tab1\">\n          <inout-stock-list [stockList]=\"stocksList$ | async\"></inout-stock-list>\n        </tab>\n        <tab heading=\"Persons\">\n          <person-list [personList]=\"inventoryUsers$ | async\"></person-list>\n        </tab>\n      </tabset>\n    </div>\n\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.ts":
/*!***********************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.ts ***!
  \***********************************************************************************************/
/*! exports provided: InventoryInOutSidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryInOutSidebarComponent", function() { return InventoryInOutSidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");








var InventoryInOutSidebarComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function InventoryInOutSidebarComponent(store, _router, _inventoryAction, sideBarAction) {
        var _this = this;
        this.store = store;
        this._router = _router;
        this._inventoryAction = _inventoryAction;
        this.sideBarAction = sideBarAction;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.store.dispatch(this._inventoryAction.GetStock());
        this.stocksList$ = this.store.select(function (s) { return s.inventory.stocksList && s.inventory.stocksList.results; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.inventoryUsers$ = this.store.select(function (s) { return s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.sidebarRect = window.screen.height;
        this.store.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (state) {
            if (state.inventory.groupsWithStocks === null) {
                _this.store.dispatch(_this.sideBarAction.GetGroupsWithStocksHierarchyMin());
            }
        });
        // console.log(this.sidebarRect);
    }
    InventoryInOutSidebarComponent.prototype.resizeEvent = function () {
        this.sidebarRect = window.screen.height;
    };
    // @HostListener('window:load', ['$event'])
    InventoryInOutSidebarComponent.prototype.ngOnInit = function () {
        //
    };
    InventoryInOutSidebarComponent.prototype.ngAfterViewInit = function () {
        //
    };
    InventoryInOutSidebarComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('search'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], InventoryInOutSidebarComponent.prototype, "search", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('sidebar'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], InventoryInOutSidebarComponent.prototype, "sidebar", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('window:resize'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], InventoryInOutSidebarComponent.prototype, "resizeEvent", null);
    InventoryInOutSidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'invetory-sidebar',
            template: __webpack_require__(/*! ./inventory.sidebar.component.html */ "./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.html"),
            styles: ["\n    .parent-Group > ul > li ul li div {\n      color: #8a8a8a;\n    }\n\n    #inventory-sidebar {\n      background: #fff;\n      min-height: 100vh;\n    }\n\n    :host ::ng-deep .nav-tabs > li {\n      width: 50%;\n      text-align: center;\n      background: #f5f5f5;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_7__["SidebarAction"]])
    ], InventoryInOutSidebarComponent);
    return InventoryInOutSidebarComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/sidebar-components/person-list.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/sidebar-components/person-list.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: PersonListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonListComponent", function() { return PersonListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var PersonListComponent = /** @class */ (function () {
    function PersonListComponent() {
    }
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], PersonListComponent.prototype, "personList", void 0);
    PersonListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'person-list',
            // [routerLink]="[ 'add-group', grp.uniqueName ]"
            template: "\n    <ul class=\"list-unstyled stock-grp-list clearfix\" *ngIf=\"personList\">\n      <li routerLinkActive=\"active\" *ngFor=\"let p of personList\"><a [routerLink]=\"['/pages','inventory-in-out','person',p.uniqueName]\"> {{p.name}}</a></li>\n      <!-- <li class=\"clearfix\" [ngClass]=\"{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}\" *ngFor=\"let grp of Groups\">\n         <a (click)=\"OpenGroup(grp,$event)\" class=\"pull-left\" [routerLink]=\"[ 'group', grp.uniqueName, 'stock-report' ]\">\n           <div [ngClass]=\"{'active': (activeGroupUniqueName$ | async) === grp.uniqueName}\">{{grp.name}}</div>\n         </a>\n         <i *ngIf=\"grp.childStockGroups.length > 0\" class=\"icon-arrow-down pr\" [ngClass]=\"{'open': grp.isOpen}\" (click)=\"OpenGroup(grp,$event)\" [routerLink]=\"[ 'group', grp.uniqueName, 'stock-report' ]\"></i>\n         <button class=\"btn btn-link btn-xs pull-right\" (click)=\"goToManageGroup(grp)\" *ngIf=\"grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName)\">\n           Edit\n         </button>\n         <stock-list [Groups]='grp'>\n         </stock-list>\n         <stockgrp-list [Groups]='grp.childStockGroups' *ngIf=\"grp.childStockGroups.length > 0 && grp.isOpen\">\n         </stockgrp-list>\n       </li>-->\n    </ul>\n  ",
            styles: ["\n    .active > a {\n      color: #d35f29 !important;\n    }\n\n    .stock-grp-list > li > a, .sub-grp > li > a {\n      text-transform: capitalize;\n    }\n\n    .stock-items > li > a > div {\n      text-transform: capitalize;\n    }\n\n    .stock-grp-list li > i:focus {\n      outline: 0;\n    }\n\n    .grp_open {\n      background: rgb(255, 255, 255);\n    }\n\n    .grp_open li {\n      border: 0;\n    }\n\n    .btn-link {\n      padding-top: 0 !important;\n    }\n  "]
        })
    ], PersonListComponent);
    return PersonListComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/components/sidebar-components/stock-list.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/inventory-in-out/components/sidebar-components/stock-list.component.ts ***!
  \****************************************************************************************/
/*! exports provided: InOutStockListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InOutStockListComponent", function() { return InOutStockListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var InOutStockListComponent = /** @class */ (function () {
    function InOutStockListComponent() {
    }
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], InOutStockListComponent.prototype, "stockList", void 0);
    InOutStockListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inout-stock-list',
            template: "\n    <ul class=\"list-unstyled  stock-grp-list clearfix\" *ngIf=\"stockList\">\n      <li routerLinkActive=\"active\" *ngFor=\"let s of stockList\"><a [routerLink]=\"['/pages','inventory-in-out','stock',s.uniqueName]\"> {{s.name}}</a></li>\n    </ul>\n  ",
            styles: ["\n    .active > a {\n      color: #d35f29 !important;\n    }\n  "]
        })
    ], InOutStockListComponent);
    return InOutStockListComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/inventory-in-out.component.html":
/*!******************************************************************!*\
  !*** ./src/app/inventory-in-out/inventory-in-out.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div style=\"min-height:100%;\">\n  <!-- <div class=\" col-xs-9 clearfix bdrB\">\n  </div> -->\n  <!--sidebar-->\n  <invetory-sidebar></invetory-sidebar>\n  <!--/sidebar-->\n  <section class=\"rightBar ng-scope\">\n    <section class=\"container-fluid clearfix bdrB\">\n      <div class=\"top_bar clearfix\">\n        <h1 class=\"section_title inline\">\n          <strong>Transaction Log</strong></h1>\n        <!-- top row-->\n        <inventory-inout-header></inventory-inout-header>\n        <!-- /top row-->\n      </div>\n    </section>\n    <!-- uiView: inventory-detail -->\n    <section class=\"container-fluid  clearfix pdT2\">\n      <router-outlet></router-outlet>\n    </section>\n  </section>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory-in-out/inventory-in-out.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/inventory-in-out/inventory-in-out.component.ts ***!
  \****************************************************************/
/*! exports provided: InventoryInOutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryInOutComponent", function() { return InventoryInOutComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apps/web-giddh/src/app/models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var apps_web_giddh_src_app_actions_company_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/company.actions */ "./src/app/actions/company.actions.ts");






var InventoryInOutComponent = /** @class */ (function () {
    function InventoryInOutComponent(store, companyActions) {
        this.store = store;
        this.companyActions = companyActions;
        //
    }
    InventoryInOutComponent.prototype.ngOnInit = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'inventory-in-out';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    InventoryInOutComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inventory-in-out',
            template: __webpack_require__(/*! ./inventory-in-out.component.html */ "./src/app/inventory-in-out/inventory-in-out.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], apps_web_giddh_src_app_actions_company_actions__WEBPACK_IMPORTED_MODULE_5__["CompanyActions"]])
    ], InventoryInOutComponent);
    return InventoryInOutComponent;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/inventory-in-out.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/inventory-in-out/inventory-in-out.module.ts ***!
  \*************************************************************/
/*! exports provided: InventoryInOutModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryInOutModule", function() { return InventoryInOutModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _inventory_in_out_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inventory-in-out.routing.module */ "./src/app/inventory-in-out/inventory-in-out.routing.module.ts");
/* harmony import */ var _inventory_in_out_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inventory-in-out.component */ "./src/app/inventory-in-out/inventory-in-out.component.ts");
/* harmony import */ var _components_sidebar_components_stock_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/sidebar-components/stock-list.component */ "./src/app/inventory-in-out/components/sidebar-components/stock-list.component.ts");
/* harmony import */ var _components_sidebar_components_inventory_sidebar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/sidebar-components/inventory.sidebar.component */ "./src/app/inventory-in-out/components/sidebar-components/inventory.sidebar.component.ts");
/* harmony import */ var _components_sidebar_components_person_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/sidebar-components/person-list.component */ "./src/app/inventory-in-out/components/sidebar-components/person-list.component.ts");
/* harmony import */ var _components_header_components_inventory_header_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/header-components/inventory-header-component */ "./src/app/inventory-in-out/components/header-components/inventory-header-component.ts");
/* harmony import */ var _components_inventory_in_out_report_inventory_in_out_report_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/inventory-in-out-report/inventory-in-out-report.component */ "./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var _components_aside_menu_aside_menu_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/aside-menu/aside-menu.component */ "./src/app/inventory-in-out/components/aside-menu/aside-menu.component.ts");
/* harmony import */ var _components_forms_transfer_note_transfer_note_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/forms/transfer-note/transfer-note.component */ "./src/app/inventory-in-out/components/forms/transfer-note/transfer-note.component.ts");
/* harmony import */ var _components_forms_inward_note_inward_note_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/forms/inward-note/inward-note.component */ "./src/app/inventory-in-out/components/forms/inward-note/inward-note.component.ts");
/* harmony import */ var _components_forms_outward_note_outward_note_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/forms/outward-note/outward-note.component */ "./src/app/inventory-in-out/components/forms/outward-note/outward-note.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _components_forms_inventory_user_inventory_user_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/forms/inventory-user/inventory-user.component */ "./src/app/inventory-in-out/components/forms/inventory-user/inventory-user.component.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../inventory/inventory.module */ "./src/app/inventory/inventory.module.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");

























var InventoryInOutModule = /** @class */ (function () {
    function InventoryInOutModule() {
        console.log('InventoryInOutModule');
    }
    InventoryInOutModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _inventory_in_out_component__WEBPACK_IMPORTED_MODULE_3__["InventoryInOutComponent"],
                _components_sidebar_components_inventory_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["InventoryInOutSidebarComponent"],
                _components_sidebar_components_person_list_component__WEBPACK_IMPORTED_MODULE_6__["PersonListComponent"],
                _components_sidebar_components_stock_list_component__WEBPACK_IMPORTED_MODULE_4__["InOutStockListComponent"],
                _components_header_components_inventory_header_component__WEBPACK_IMPORTED_MODULE_7__["InventoryHeaderComponent"],
                _components_inventory_in_out_report_inventory_in_out_report_component__WEBPACK_IMPORTED_MODULE_8__["InventoryInOutReportComponent"],
                _components_aside_menu_aside_menu_component__WEBPACK_IMPORTED_MODULE_13__["AsideMenuComponent"],
                _components_forms_transfer_note_transfer_note_component__WEBPACK_IMPORTED_MODULE_14__["TransferNoteComponent"],
                _components_forms_inward_note_inward_note_component__WEBPACK_IMPORTED_MODULE_15__["InwardNoteComponent"],
                _components_forms_outward_note_outward_note_component__WEBPACK_IMPORTED_MODULE_16__["OutwardNoteComponent"],
                _components_forms_inventory_user_inventory_user_component__WEBPACK_IMPORTED_MODULE_21__["InventoryUserComponent"]
            ],
            exports: [],
            providers: [],
            imports: [_inventory_in_out_routing_module__WEBPACK_IMPORTED_MODULE_2__["InventoryInOutRoutingModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_11__["ShSelectModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_12__["PaginationModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_10__["Daterangepicker"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ReactiveFormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_17__["FormsModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_18__["BsDatepickerModule"].forRoot(), _angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"], _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_20__["SelectModule"], angular2_ladda__WEBPACK_IMPORTED_MODULE_19__["LaddaModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["BsDropdownModule"],
                _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_23__["InventoryModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["TabsModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_24__["DecimalDigitsModule"]
            ],
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], InventoryInOutModule);
    return InventoryInOutModule;
}());



/***/ }),

/***/ "./src/app/inventory-in-out/inventory-in-out.routing.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/inventory-in-out/inventory-in-out.routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: InventoryInOutRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryInOutRoutingModule", function() { return InventoryInOutRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _inventory_in_out_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inventory-in-out.component */ "./src/app/inventory-in-out/inventory-in-out.component.ts");
/* harmony import */ var _components_inventory_in_out_report_inventory_in_out_report_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/inventory-in-out-report/inventory-in-out-report.component */ "./src/app/inventory-in-out/components/inventory-in-out-report/inventory-in-out-report.component.ts");





var InventoryInOutRoutingModule = /** @class */ (function () {
    function InventoryInOutRoutingModule() {
    }
    InventoryInOutRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _inventory_in_out_component__WEBPACK_IMPORTED_MODULE_3__["InventoryInOutComponent"],
                        children: [
                            { path: ':type/:uniqueName', component: _components_inventory_in_out_report_inventory_in_out_report_component__WEBPACK_IMPORTED_MODULE_4__["InventoryInOutReportComponent"] },
                        ]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], InventoryInOutRoutingModule);
    return InventoryInOutRoutingModule;
}());



/***/ })

}]);