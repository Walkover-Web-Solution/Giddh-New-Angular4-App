(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./src/app/inventory/components/add-group-components/inventory.addgroup.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory/components/add-group-components/inventory.addgroup.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"\" autocomplete=\"off\" [style.margin-top.px]=\"-15\">\n  <div class=\"\">\n    <section class=\"clearfix\">\n      <div class=\"form_header\">\n        <h2 *ngIf=\"addGroup\">Create Group</h2>\n        <h2 *ngIf=\"!addGroup\">Update Group</h2>\n      </div>\n      <form name=\"updateStockGroup\" class=\"form_body\" [formGroup]=\"addGroupForm\" novalidate=\"\">\n        <div class=\"form_bg clearfix\">\n          <div class=\"row\">\n            <div class=\"form-group col-xs-6\">\n              <label>Name <sup>*</sup></label>\n              <input type=\"text\" name=\"name\" (change)=\"generateUniqueName()\" class=\"form-control\"\n                     formControlName=\"name\"/>\n            </div>\n            <div class=\"form-group col-xs-6\">\n              <label>Unique Name <sup>*</sup></label>\n              <input type=\"text\" name=\"uniqueName\" UniqueNameDirective textCaseChangeDirective\n                     [control]=\"addGroupForm.get('uniqueName')\" (blur)=\"validateUniqueName($event?.target?.value)\"\n                     formControlName=\"uniqueName\" class=\"form-control\">\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-xs-6\">\n              <div class=\"pdB1\" [hidden]=\"defaultGrpActive\">\n                <label for=\"isSelfParentUpdt\">\n                  <input type=\"checkbox\" formControlName=\"isSubGroup\" id=\"isSelfParentUpdt\" name=\"parentStockGroup\">Is\n                  it a sub group?</label>\n              </div>\n              <div class=\"form-group\">\n                <label>Parent Group</label>\n                <sh-select [options]=\"groupsData$ | async\" formControlName=\"parentStockGroupUniqueName\"\n                           [disabled]=\"!addGroupForm.get('isSubGroup').value\" [placeholder]=\"'Select Parent Group'\"\n                           [multiple]=\"false\" (selected)=\"groupSelected($event)\" [ItemHeight]=\"33\"\n                           [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n              </div>\n            </div>\n          </div>\n          <div class=\"clearfix text-left mrB\">\n            <div *ngIf=\"addGroup\">\n              <button type=\"submit\" class=\"btn btn-success\" [ladda]=\"isAddNewGroupInProcess$ | async\"\n                      (click)=\"addNewGroup()\" [disabled]=\"addGroupForm.invalid\">Save\n              </button>\n              <button type=\"reset\" class=\"btn btn-primary\">Cancel</button>\n            </div>\n            <div *ngIf=\"!addGroup\">\n              <button type=\"submit\" [disabled]=\"addGroupForm.invalid || defaultGrpActive\"\n                      [ladda]=\"isUpdateGroupInProcess$ | async\" class=\"btn btn-success\" (click)=\"updateGroup()\">Update\n              </button>\n              <button type=\"submit\" class=\"btn btn-danger\" [ladda]=\"isDeleteGroupInProcess$ | async\"\n                      (click)=\"removeGroup()\" *ngIf=\"canDeleteGroup\" [disabled]=\"defaultGrpActive\">Delete\n              </button>\n            </div>\n          </div>\n        </div>\n      </form>\n    </section>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory/components/add-group-components/inventory.addgroup.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/inventory/components/add-group-components/inventory.addgroup.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: InventoryAddGroupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryAddGroupComponent", function() { return InventoryAddGroupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_12__);













var InventoryAddGroupComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function InventoryAddGroupComponent(store, route, sideBarAction, _fb, _inventoryService, inventoryActions, router) {
        var _this = this;
        this.store = store;
        this.route = route;
        this.sideBarAction = sideBarAction;
        this._fb = _fb;
        this._inventoryService = _inventoryService;
        this.inventoryActions = inventoryActions;
        this.router = router;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.defaultGrpActive = false;
        this.canDeleteGroup = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.fetchingGrpUniqueName$ = this.store.select(function (state) { return state.inventory.fetchingGrpUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isGroupNameAvailable$ = this.store.select(function (state) { return state.inventory.isGroupNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeGroup$ = this.store.select(function (state) { return state.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createGroupSuccess$ = this.store.select(function (state) { return state.inventory.createGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isAddNewGroupInProcess$ = this.store.select(function (state) { return state.inventory.isAddNewGroupInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isUpdateGroupInProcess$ = this.store.select(function (state) { return state.inventory.isUpdateGroupInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isDeleteGroupInProcess$ = this.store.select(function (state) { return state.inventory.isDeleteGroupInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.manageInProcess$ = this.store.select(function (s) { return s.inventory.inventoryAsideState; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (state) {
            if (state.inventory.groupsWithStocks === null) {
                _this.store.dispatch(_this.sideBarAction.GetGroupsWithStocksHierarchyMin());
            }
        });
    }
    InventoryAddGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get all groups
        this.getParentGroupData();
        // subscribe to url
        this.sub = this.route.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (params) {
            _this.groupUniqueName = params['groupUniqueName'];
        });
        // add group form
        this.addGroupForm = this._fb.group({
            name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
            uniqueName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
            parentStockGroupUniqueName: [{ value: '', disabled: true }, [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
            isSubGroup: [false]
        });
        // enable disable parentGroup select
        this.addGroupForm.controls['isSubGroup'].valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.addGroupForm.controls['parentStockGroupUniqueName'].enable();
            }
            else {
                _this.addGroupForm.controls['parentStockGroupUniqueName'].reset();
                _this.addGroupForm.controls['parentStockGroupUniqueName'].disable();
                _this.addGroupForm.setErrors({ groupNameInvalid: true });
                _this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
            }
        });
        // fetching uniquename boolean
        this.fetchingGrpUniqueName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (f) {
            if (f) {
                _this.addGroupForm.controls['uniqueName'].disable();
            }
            else {
                _this.addGroupForm.controls['uniqueName'].enable();
            }
        });
        // check if active group is available if then fill form else reset form
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
            if (a && !_this.addGroup) {
                var updGroupObj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__["StockGroupRequest"]();
                updGroupObj.name = a.name;
                updGroupObj.uniqueName = a.uniqueName;
                if (updGroupObj.uniqueName === 'maingroup') {
                    _this.addGroupForm.controls['uniqueName'].disable();
                    _this.defaultGrpActive = true;
                }
                else {
                    _this.addGroupForm.controls['uniqueName'].enable();
                    _this.defaultGrpActive = false;
                }
                if (a.parentStockGroup) {
                    _this.selectedGroup = { label: a.parentStockGroup.name, value: a.parentStockGroup.uniqueName };
                    // updGroupObj.parentStockGroupUniqueName = this.selectedGroup.value;
                    _this.parentStockSearchString = a.parentStockGroup.uniqueName;
                    updGroupObj.isSubGroup = true;
                }
                else {
                    updGroupObj.parentStockGroupUniqueName = '';
                    _this.parentStockSearchString = '';
                    updGroupObj.isSubGroup = false;
                    _this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
                }
                _this.addGroupForm.patchValue(updGroupObj);
                if (a.parentStockGroup) {
                    _this.addGroupForm.patchValue({ parentStockGroupUniqueName: { label: a.parentStockGroup.name, value: a.parentStockGroup.uniqueName } });
                }
            }
            else {
                if (a) {
                    _this.addGroupForm.patchValue({ isSubGroup: true, parentStockGroupUniqueName: { label: a.name, value: a.uniqueName } });
                }
                else {
                    _this.addGroupForm.patchValue({ name: '', uniqueName: '', isSubGroup: false });
                }
                _this.parentStockSearchString = '';
            }
            if (a && a.stocks.length > 0) {
                _this.canDeleteGroup = false;
            }
            else {
                _this.canDeleteGroup = true;
            }
        });
        // reset add form and get all groups data
        this.createGroupSuccess$.subscribe(function (d) {
            if (d) {
                if (_this.addGroup) {
                    _this.addGroupForm.reset();
                }
                _this.getParentGroupData();
                // this.router.navigate(['/pages', 'inventory', 'add-group']);
            }
        });
        this.manageInProcess$.subscribe(function (s) {
            if (!s.isOpen) {
                // console.log('s:', s);
                _this.addGroupForm.reset();
            }
        });
    };
    InventoryAddGroupComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) {
            if (_this.groupUniqueName && a && a.uniqueName === _this.groupUniqueName) {
                //
            }
            else {
                if (_this.groupUniqueName) {
                    _this.store.dispatch(_this.sideBarAction.GetInventoryGroup(_this.groupUniqueName));
                }
            }
        });
    };
    InventoryAddGroupComponent.prototype.getParentGroupData = function () {
        var _this = this;
        // parentgroup data
        this._inventoryService.GetGroupsWithStocksFlatten().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var flattenData = [];
                _this.flattenDATA(data.body.results, flattenData);
                _this.groupsData$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flattenData);
            }
        });
    };
    InventoryAddGroupComponent.prototype.flattenDATA = function (rawList, parents) {
        var _this = this;
        if (parents === void 0) { parents = []; }
        rawList.map(function (p) {
            if (p) {
                var newOption = { label: '', value: '' };
                newOption.label = p.name;
                newOption.value = p.uniqueName;
                parents.push(newOption);
                if (p.childStockGroups && p.childStockGroups.length > 0) {
                    _this.flattenDATA(p.childStockGroups, parents);
                }
            }
        });
    };
    InventoryAddGroupComponent.prototype.ngOnDestroy = function () {
        // this.store.dispatch(this.inventoryActions.resetActiveGroup());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    // group selected
    InventoryAddGroupComponent.prototype.groupSelected = function (event) {
        var selected;
        this.groupsData$.subscribe(function (p) {
            selected = p.find(function (q) { return q.value === event.value; });
        });
        this.selectedGroup = selected;
        this.addGroupForm.updateValueAndValidity();
    };
    // if there's no matched result
    InventoryAddGroupComponent.prototype.onGroupResult = function () {
        this.addGroupForm.setErrors({ groupNameInvalid: true });
    };
    // generate uniquename
    InventoryAddGroupComponent.prototype.generateUniqueName = function () {
        var _this = this;
        var activeGrp = null;
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (ag) { return activeGrp = ag; });
        // if updating group don't generate uniqueName
        if (!this.addGroup) {
            return;
        }
        var val = this.addGroupForm.controls['name'].value;
        val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_11__["uniqueNameInvalidStringReplace"])(val);
        // if val then check for uniqueName is available or not
        if (val) {
            this.store.dispatch(this.sideBarAction.GetGroupUniqueName(val));
            this.isGroupNameAvailable$.subscribe(function (a) {
                if (a !== null && a !== undefined) {
                    if (a) {
                        _this.addGroupForm.patchValue({ uniqueName: val });
                    }
                    else {
                        var num = 1;
                        _this.addGroupForm.patchValue({ uniqueName: val + num });
                    }
                }
            });
        }
        else {
            this.addGroupForm.patchValue({ uniqueName: '' });
        }
    };
    InventoryAddGroupComponent.prototype.addNewGroup = function () {
        var stockRequest = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__["StockGroupRequest"]();
        var uniqueNameField = this.addGroupForm.get('uniqueName');
        uniqueNameField.patchValue(uniqueNameField.value.replace(/ /g, '').toLowerCase());
        stockRequest = this.addGroupForm.value;
        if (this.addGroupForm.value.isSubGroup && this.selectedGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
        }
        if (!stockRequest.isSubGroup) {
            stockRequest.isSubGroup = false;
        }
        if (lodash__WEBPACK_IMPORTED_MODULE_12__["isObject"](stockRequest.parentStockGroupUniqueName)) {
            var uniqName = lodash__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName.value;
        }
        this.store.dispatch(this.inventoryActions.addNewGroup(stockRequest));
    };
    InventoryAddGroupComponent.prototype.updateGroup = function () {
        var _this = this;
        var stockRequest = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__["StockGroupRequest"]();
        var activeGroup = null;
        var uniqueNameField = this.addGroupForm.get('uniqueName');
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return activeGroup = a; });
        uniqueNameField.patchValue(uniqueNameField.value.replace(/ /g, '').toLowerCase());
        stockRequest = this.addGroupForm.value;
        if (this.addGroupForm.value.isSubGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
        }
        if (lodash__WEBPACK_IMPORTED_MODULE_12__["isObject"](stockRequest.parentStockGroupUniqueName)) {
            var uniqName = lodash__WEBPACK_IMPORTED_MODULE_12__["cloneDeep"](stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName.value;
        }
        this.store.dispatch(this.inventoryActions.updateGroup(stockRequest, activeGroup.uniqueName));
        this.store.select(function (p) { return p.inventory.isUpdateGroupInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(function (p) { return !p; })).subscribe(function (a) {
            _this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (b) { return activeGroup = b; });
            // this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            //   this.router.navigate(['/pages', 'inventory', 'group', activeGroup.uniqueName, 'stock-report']);
            // });
        });
    };
    InventoryAddGroupComponent.prototype.removeGroup = function () {
        var activeGroup = null;
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return activeGroup = a; });
        this.store.dispatch(this.inventoryActions.removeGroup(activeGroup.uniqueName));
        this.addGroupForm.reset();
        this.router.navigateByUrl('/pages/inventory');
    };
    /**
     * validateUniqueName
     */
    InventoryAddGroupComponent.prototype.validateUniqueName = function (unqName) {
        if (unqName) {
            var val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_11__["uniqueNameInvalidStringReplace"])(unqName);
            this.addGroupForm.patchValue({ uniqueName: val });
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InventoryAddGroupComponent.prototype, "addGroup", void 0);
    InventoryAddGroupComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'inventory-add-group',
            template: __webpack_require__(/*! ./inventory.addgroup.component.html */ "./src/app/inventory/components/add-group-components/inventory.addgroup.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__["SidebarAction"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_8__["InventoryService"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__["InventoryAction"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], InventoryAddGroupComponent);
    return InventoryAddGroupComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory/components/add-stock-components/inventory.addstock.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form #formDiv name=\"addEditStockForm\" [formGroup]=\"addStockForm\" novalidate=\"\" autocomplete=\"off\"\n  [style.margin-top.px]=\"-15\">\n\n  <section class=\"col-xs-12 col-md-12 col-lg-12\">\n    <div class=\"row\">\n      <div class=\"\">\n        <div class=\"form_header\">\n          <h2 *ngIf=\"!isUpdatingStockForm\">Create Stock</h2>\n          <h2 *ngIf=\"isUpdatingStockForm\">Update Stock</h2>\n        </div>\n\n        <div class=\"\">\n          <section class=\"form_body witBg clearfix mrBChldLbl\">\n            <div class=\"form_bg clearfix\">\n              <div class=\"row\">\n                <div class=\"form-group col-xs-5\">\n                  <label>Under Group</label>\n                  <sh-select #groupDDList [options]=\"groupsData$ | async\" formControlName=\"parentGroup\"\n                    [placeholder]=\"'Select Group'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    (selected)=\"groupSelected($event)\" [isFilterEnabled]=\"true\"\n                    [forceClearReactive]=\"forceClear$ | async\" [notFoundLinkText]=\"'+ Add New'\"\n                    (noResultsClicked)=\"addNewGroupPane()\" [notFoundLink]=\"false\" [dropdownMinHeight]=\"33\"></sh-select>\n                </div>\n                <div class=\"form-group col-xs-5\" *ngIf=\"isUpdatingStockForm\">\n                  <label class=\"d-block\">&nbsp;</label>\n                  <button type=\"button\" class=\"btn btn-default\" (click)=\"moveStock()\"\n                    [disabled]=\"addStockForm.get('parentGroup').value === activeGroup.uniqueName\">Move\n                  </button>\n\n                </div>\n              </div>\n\n              <div class=\"clearfix row\">\n                <div class=\"form-group col-xs-5\">\n                  <label>Stock Name <sup>*</sup></label>\n                  <input type=\"text\" name=\"name\" class=\"form-control\" (change)=\"generateUniqueName()\"\n                    formControlName=\"name\" />\n                </div>\n                <div class=\"form-group col-xs-5\">\n                  <label>Stock Unit <sup>*</sup></label>\n                  <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                    [placeholder]=\"'Choose a parent unit'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                </div>\n              </div>\n              <!-- other details -->\n              <div class=\"row\">\n                <div class=\"col-xs-12\">\n                  <div class=\"form-group toggle-btn mrB\" (click)=\"showOtherDetails = !showOtherDetails\">\n                    <label class=\"cp\">\n                      <i class=\"fa cp\" aria-hidden=\"true\"\n                        [ngClass]=\"{'fa-minus-square-o': showOtherDetails, 'fa-plus-square-o': !showOtherDetails}\"></i>Other\n                      Details\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <ng-container *ngIf=\"showOtherDetails\">\n                <div class=\"row\">\n                  <div class=\"form-group col-xs-4\">\n                    <label>Unique Name</label>\n                    <input type=\"text\" name=\"uniqueName\" UniqueNameDirective textCaseChangeDirective\n                      [control]=\"addStockForm.get('uniqueName')\" class=\"form-control\" formControlName=\"uniqueName\">\n                  </div>\n                  <div class=\"form-group col-xs-4\" [hidden]=\"!(isManageInventory$ | async)\">\n                    <label>HSN Code</label>\n                    <input type=\"text\" class=\"form-control\" maxlength=\"10\" decimalDigitsDirective\n                      formControlName=\"hsnNumber\" />\n                  </div>\n\n                  <!--                  <div class=\"form-group col-xs-4\">-->\n                  <!--                    <label>Discount</label>-->\n                  <!--                    <div class=\"btn-group btn-block\" dropdown>-->\n                  <!--                      <button dropdownToggle type=\"button\"-->\n                  <!--                              class=\"dropdown-toggle form-control text-left\"> Selected-->\n                  <!--                        ({{ addStockForm.get('taxes').value.length }}) <span-->\n                  <!--                          class=\"pull-right\"><span class=\"caret\"></span></span></button>-->\n                  <!--                      <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">-->\n                  <!--                        <li role=\"menuitem\" *ngFor=\"let tax of (companyTaxesList$ | async)\">-->\n                  <!--                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\"><input-->\n                  <!--                            type=\"checkbox\" [checked]=\"tax.isChecked\"-->\n                  <!--                            (click)=\"selectTax($event, tax)\"/> {{tax.name}}</a>-->\n                  <!--                        </li>-->\n                  <!--                        <li *ngIf=\"(companyTaxesList$ | async).length < 1\">-->\n                  <!--                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\">No Tax-->\n                  <!--                            Found</a>-->\n                  <!--                        </li>-->\n                  <!--                      </ul>-->\n                  <!--                    </div>-->\n                  <!--                  </div>-->\n\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Tax</label>\n\n\n\n                    <div class=\"btn-group btn-block\" dropdown>\n                      <button dropdownToggle type=\"button\" class=\"dropdown-toggle form-control text-left\"> Selected\n                        ({{ taxTempArray.length }}) <span class=\"pull-right\"><span class=\"caret\"></span></span></button>\n                      <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                        <li role=\"menuitem\" *ngFor=\"let tax of (companyTaxesList$ | async)\"\n                          [ngClass]=\"{'opacity' : tax.isDisabled}\">\n                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\"><input type=\"checkbox\"\n                              [disabled]=\"tax.isDisabled\" [checked]=\"tax.isChecked\" (click)=\"selectTax($event, tax)\" />\n                            {{tax.name}}</a>\n                        </li>\n                        <li *ngIf=\"(companyTaxesList$ | async).length < 1\">\n                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\">No Tax\n                            Found</a>\n                        </li>\n                      </ul>\n                    </div>\n                  </div>\n\n                </div>\n\n                <div class=\"row\">\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Open. Qty</label>\n                    <input type=\"text\" name=\"openingQuantity\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                      (change)=\"calCulateRate()\" class=\"form-control\" formControlName=\"openingQuantity\">\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Amount</label>\n                    <input type=\"text\" name=\"openingAmount\" (change)=\"calCulateRate()\" decimalDigitsDirective\n                      [DecimalPlaces]=\"2\" class=\"form-control\" formControlName=\"openingAmount\">\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Rate</label>\n                    <input type=\"text\" name=\"stockRate\" formControlName=\"stockRate\" class=\"form-control\"\n                      placeholder=\"Auto calculate\">\n                  </div>\n\n                </div>\n\n                <div class=\"row sku-row\">\n                  <div class=\"form-group col-xs-4\" [hidden]=\"(isManageInventory$ | async)\">\n                    <label>SAC Code</label>\n                    <input type=\"text\" class=\"form-control\" maxlength=\"10\"\n                      formControlName=\"sacNumber\" decimalDigitsDirective/>\n                  </div>\n\n\n                  <!-- SKU Code -->\n                  <div class=\"form-group col-xs-4\">\n                    <label>\n                      <span *ngIf=\"!editSKUlabel && !addStockForm.controls['skuCodeHeading'].value\">SKU Code</span>\n                      <span *ngIf=\"!editSKUlabel\">{{addStockForm.controls['skuCodeHeading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Enter\" class=\"label-input\" *ngIf=\"editSKUlabel\"\n                        formControlName=\"skuCodeHeading\" (blur)=\"editSKUlabel=!editSKUlabel\">\n                      <i *ngIf=\"!editSKUlabel\" class=\"fa fa-pencil\" (click)=\"editSKUlabel=!editSKUlabel\"></i>\n                    </label>\n                    <input type=\"text\" name=\"skuCode\" class=\"form-control\" maxlength=\"20\" \n                      formControlName=\"skuCode\" (keyup)=\"validateSKU($event)\" >\n                  </div>\n\n\n                  <!-- field 1 -->\n                  <div class=\"form-group col-xs-4\"\n                    *ngIf=\"customField1 || addStockForm.controls['customField1Heading'].value\">\n\n                    <label>\n                      <span\n                        *ngIf=\"!customField1HeadingEditing && !addStockForm.controls['customField1Heading'].value\">Custom\n                        field 1</span>\n                      <span\n                        *ngIf=\"!customField1HeadingEditing\">{{addStockForm.controls['customField1Heading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Custom field 1\" class=\"label-input\"\n                        *ngIf=\"customField1HeadingEditing\" formControlName=\"customField1Heading\"\n                        (blur)=\"customField1HeadingEditing=!customField1HeadingEditing\">\n\n                      <span class=\"pull-right\">\n                        <i *ngIf=\"!customField1HeadingEditing\" class=\"fa fa-pencil\"\n                          (click)=\"customField1HeadingEditing=!customField1HeadingEditing\"></i>\n                        <i class=\"icon-cross text-danger\" (click)=\"removeCustomField('remove', 1)\"></i>\n                      </span>\n                    </label>\n                    <input type=\"text\" name=\"customField1Value\" class=\"form-control\" maxlength=\"30\"\n                      formControlName=\"customField1Value\">\n\n                  </div>\n                  <!-- field 2 -->\n                  <div class=\"form-group col-xs-4\"\n                    *ngIf=\"customField2 || addStockForm.controls['customField2Heading'].value\">\n                    <label>\n                      <span\n                        *ngIf=\"!customField2HeadingEditing && !addStockForm.controls['customField2Heading'].value\">Custom\n                        field 2</span>\n                      <span\n                        *ngIf=\"!customField2HeadingEditing\">{{addStockForm.controls['customField2Heading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Custom field 2\" class=\"label-input\"\n                        *ngIf=\"customField2HeadingEditing\" formControlName=\"customField2Heading\"\n                        (blur)=\"customField2HeadingEditing=!customField2HeadingEditing\">\n\n                      <span class=\"pull-right\">\n                        <i *ngIf=\"!customField2HeadingEditing\" class=\"fa fa-pencil\"\n                          (click)=\"customField2HeadingEditing=!customField2HeadingEditing\"></i>\n                        <i class=\"icon-cross text-danger\" (click)=\"removeCustomField('remove', 2)\"></i>\n                      </span>\n                    </label>\n                    <input type=\"text\" name=\"customField2Value\" class=\"form-control\" maxlength=\"30\"\n                      formControlName=\"customField2Value\">\n                  </div>\n                  <!-- field 2 end -->\n                  <div class=\"form-group col-xs-4\">\n                    <div class=\"new-btn\" (click)=\"addCustomField()\" *ngIf=\"!customField2 || !customField1\">+ Custom\n                      field</div>\n                  </div>\n\n                </div>\n\n              </ng-container>\n            </div>\n\n            <div class=\"pdL pdR pdT\">\n              <div class=\"col-xs-6\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"enablePurchase\">\n                    <input type=\"checkbox\" formControlName=\"enablePurchase\" id=\"enablePurchase\"\n                      name=\"enablePurchase\">Purchase Information</label>\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"boldHead\">Account Name</label>\n                  <sh-select [options]=\"purchaseAccountsDropDown$ | async\" formControlName=\"purchaseAccountUniqueName\"\n                    [placeholder]=\"'select purchase account'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    [disabled]=\"!addStockForm.controls['enablePurchase'].value\"\n                    [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                </div>\n\n                <div class=\"row\">\n                  <div class=\"col-xs-7\">\n                    <label>Unit</label>\n                  </div>\n                  <div class=\"col-xs-4 row\">\n                    <label>Rate</label>\n                  </div>\n                </div>\n\n                <div formArrayName=\"purchaseUnitRates\">\n                  <div class=\"row\"\n                    *ngFor=\"let item of addStockForm.get('purchaseUnitRates')['controls']; let i=index;let f = first; let l = last\">\n                    <div [formGroupName]=\"i\">\n                      <div class=\"form-group col-xs-7 \">\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                          [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"\n                          [disabled]=\"!addStockForm.controls['enablePurchase'].value\"\n                          [forceClearReactive]=\"forceClear$ | async\" [notFoundLinkText]=\"'+ Add New'\"\n                          (noResultsClicked)=\"addNewStockUnit()\" [notFoundLink]=\"true\" [dropdownMinHeight]=\"70\">\n                        </sh-select>\n                      </div>\n                      <div class=\"form-group row col-xs-4\">\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          formControlName=\"rate\" />\n                      </div>\n                    </div>\n                    <div class=\"pull-right mrT unit_add\">\n                      <button class=\"btn-link\" (click)=\"addPurchaseUnitRates(i)\" *ngIf=\"l\"><i\n                          class=\"fa fa-plus add_row\"></i></button>\n                      <button class=\"btn-link\" (click)=\"removePurchaseUnitRates(i)\" *ngIf=\"!l\"><i\n                          class=\"fa fa-times dlet\"></i></button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n\n              <div class=\"col-xs-6\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"enableSales\">\n                    <input type=\"checkbox\" formControlName=\"enableSales\" id=\"enableSales\" name=\"enableSales\">Sales\n                    Information</label>\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"\">Account Name</label>\n                  <sh-select [options]=\"salesAccountsDropDown$ | async\" formControlName=\"salesAccountUniqueName\"\n                    [multiple]=\"false\" [disabled]=\"!addStockForm.controls['enableSales'].value\"\n                    [placeholder]=\"'select sales account'\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\">\n                  </sh-select>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-xs-7\">\n                    <label>Unit</label>\n                  </div>\n                  <div class=\"col-xs-4 row\">\n                    <label>Rate</label>\n                  </div>\n                </div>\n\n                <div formArrayName=\"saleUnitRates\">\n                  <div class=\"row\"\n                    *ngFor=\"let item of addStockForm.get('saleUnitRates')['controls']; let i=index; let f = first; let l = last\">\n                    <div [formGroupName]=\"i\">\n                      <div class=\"form-group col-xs-7\">\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                          [multiple]=\"false\" [disabled]=\"!addStockForm.controls['enableSales'].value\"\n                          [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"\n                          [notFoundLinkText]=\"'+ Add New'\" (noResultsClicked)=\"addNewStockUnit()\" [notFoundLink]=\"true\"\n                          [dropdownMinHeight]=\"70\"></sh-select>\n                        <!--<select2 [data]=\"stockUnitsDropDown$ | async\" [options]=\"UnitDropDownOptions\" formControlName=\"stockUnitCode\"></select2>-->\n                      </div>\n                      <div class=\"form-group row col-xs-4\">\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          formControlName=\"rate\" />\n                      </div>\n                    </div>\n                    <div class=\"pull-right mrT unit_add\">\n                      <button class=\"btn-link\" (click)=\"addSaleUnitRates(i)\" *ngIf=\"l\"><i\n                          class=\"fa fa-plus add_row\"></i></button>\n                      <button class=\"btn-link\" (click)=\"removeSaleUnitRates(i)\" *ngIf=\"!l\"><i\n                          class=\"fa fa-times dlet\"></i></button>\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n            </div>\n\n\n            <div class=\"mrT1 pdL pdR\">\n              <div class=\"col-xs-12\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"isFsStock\">\n                    <input type=\"checkbox\" formControlName=\"isFsStock\" id=\"isFsStock\" [disabled]=\"\" name=\"isFsStock\"> Is\n                    it a finished stock? (Manufacturing/Combo)</label>\n                </div>\n              </div>\n            </div>\n\n\n            <section class=\"mrT2 mrB3 col-xs-12\" *ngIf=\"addStockForm.value.isFsStock\">\n              <div class=\"pdL pdR\">\n                <h1 class=\"section_head bdrB\"><strong>{{addStockForm.controls['name'].value}} (Made\n                    with)</strong></h1>\n                <table class=\"noHover basic width100\">\n                  <tbody formGroupName=\"manufacturingDetails\">\n                    <tr class=\"output_row\">\n                      <td class=\"form-group\">\n                        <label>Output Qty <sup>*</sup></label>\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          name=\"manufacturingQuantity\" placeholder=\"Quantity\" formControlName=\"manufacturingQuantity\" />\n                      </td>\n                      <td class=\"form-group\">\n                        <label>Stock Unit <sup>*</sup></label>\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"manufacturingUnitCode\"\n                          [placeholder]=\"'Select Unit'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                          [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                      </td>\n                      <td *ngIf=\"addStockForm.controls['manufacturingDetails'].controls['manufacturingQuantity'].value\"\n                        colspan=\"2\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <span class=\"width100\"><strong>= (\n                            {{addStockForm.controls['manufacturingDetails'].controls['manufacturingQuantity'].value}}\n                            {{addStockForm.controls['manufacturingDetails'].controls['manufacturingUnitCode'].value}}\n                            {{addStockForm.controls['name'].value}} )</strong></span>\n                      </td>\n                      <!-- <td colspan=\"1\">&nbsp;</td> -->\n                    </tr>\n                    <tr class=\"noHover bdrT table_label\" style=\"border-color:#ccc;\">\n                      <td [style.width.px]=\"200\"><strong>Input Stock Name</strong></td>\n                      <td><strong>Stock Qty</strong></td>\n                      <td><strong>Stock Unit</strong></td>\n                      <td colspan=\"1\"></td>\n                    </tr>\n\n                    <ng-container formArrayName=\"linkedStocks\">\n                      <tr\n                        *ngFor=\"let list of addStockForm.get('manufacturingDetails')['controls']['linkedStocks'].controls;let i = index; let l = last\"\n                        [formGroupName]=\"i\" class=\"fsstock\">\n                        <td>\n                          <sh-select [options]=\"stockListDropDown$ | async\" formControlName=\"stockUniqueName\"\n                            [multiple]=\"false\" [placeholder]=\"'Select Stock Name'\" [placeholder]=\"'Select Stock'\"\n                            [ItemHeight]=\"33\" (selected)=\"findAddedStock($event?.value, i)\"\n                            [forceClearReactive]=\"forceClearStock$ | async\"></sh-select>\n                        </td>\n\n                        <td>\n                          <input type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                            name=\"quantity\" placeholder=\"Enter Quantity\" class=\"form-control\" />\n                        </td>\n                        <td>\n                          <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                            [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"\n                            [forceClearReactive]=\"forceClearStockUnit$ | async\"></sh-select>\n                        </td>\n                        <td>\n                          <button class=\"btn-link\" (click)=\"addItemInLinkedStocks(list, i, i)\" *ngIf=\"l\"\n                            [disabled]=\"disableStockButton\"><i class=\"fa fa-plus add_row\"></i></button>\n                          <button class=\"btn-link\" (click)=\"removeItemInLinkedStocks(i)\" *ngIf=\"!l\"><i\n                              class=\"fa fa-times dlet\"></i></button>\n                        </td>\n                      </tr>\n                    </ng-container>\n                  </tbody>\n                </table>\n              </div>\n            </section>\n\n            <div class=\"col-xs-12 text-left\">\n              <div class=\"mrT1 pdL pdR\">\n\n                <button type=\"submit\" *ngIf=\"!isUpdatingStockForm\" [ladda]=\"isStockAddInProcess$ | async\"\n                  (click)=\"submit()\" class=\"btn btn-success\"\n                  [disabled]=\"addStockForm.invalid || disableStockButton\">Save\n                </button>\n                <button type=\"button\" *ngIf=\"isUpdatingStockForm\" [ladda]=\"isStockUpdateInProcess$ | async\"\n                  class=\"btn btn-primary\" (click)=\"update()\"\n                  [disabled]=\"addStockForm.invalid || disableStockButton\">Update\n                </button>\n                <button *ngIf=\"isUpdatingStockForm\" [ladda]=\"isStockDeleteInProcess$ | async\" class=\"btn btn-danger\"\n                  (click)=\"deleteStock()\">Delete Stock\n                </button>\n                <button type=\"button\" *ngIf=\"!isUpdatingStockForm\" (click)=\"resetStockForm()\"\n                  class=\"btn btn-default\">Cancel\n                </button>\n              </div>\n            </div>\n          </section>\n        </div>\n\n\n      </div>\n    </div>\n  </section>\n\n  <div class=\"clearfix\"></div>\n  <!--manufactre details  -->\n\n\n  <div class=\"clearfix\"></div>\n\n\n</form>\n\n<!--ngbusy  -->\n<div [hidden]=\"true\">\n  <!-- *ngIf=\"showLoadingForStockEditInProcess$ | async\" -->\n  <div class=\"ng-busy ng-trigger ng-trigger-flyInOut\" [ngStyle]=\"{\n    'position': 'absolute',\n    'background-color': 'rgba(216, 216, 203, 0.5)',\n    'top': (formDivBoundingRect | async)?.top + 'px',\n    'bottom': (formDivBoundingRect | async)?.bottom + 'px',\n    'left': (formDivBoundingRect | async)?.left + 'px',\n    'right': (formDivBoundingRect | async)?.right + 'px',\n    'height': (formDivBoundingRect | async)?.height + 'px',\n    'width': (formDivBoundingRect | async)?.width + 'px'\n  }\">\n    <div>\n      <div class=\"ng-busy-default-wrapper\">\n        <div class=\"ng-busy-default-sign\">\n          <div class=\"ng-busy-default-spinner\">\n            <div class=\"bar1\"></div>\n            <div class=\"bar2\"></div>\n            <div class=\"bar3\"></div>\n            <div class=\"bar4\"></div>\n            <div class=\"bar5\"></div>\n            <div class=\"bar6\"></div>\n            <div class=\"bar7\"></div>\n            <div class=\"bar8\"></div>\n            <div class=\"bar9\"></div>\n            <div class=\"bar10\"></div>\n            <div class=\"bar11\"></div>\n            <div class=\"bar12\"></div>\n          </div>\n          <div class=\"ng-busy-default-text\">Loading...</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--ngbusy  -->\n"

/***/ }),

/***/ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.scss":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory/components/add-stock-components/inventory.addstock.component.scss ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".output_row > td {\n  padding: 12px 10px 12px 0 !important; }\n\n.basic > tbody > tr > td {\n  padding: 2px 10px 2px 0; }\n\n.table_label td {\n  padding-top: 12px !important; }\n\n.dropdown-menu {\n  max-height: 168px;\n  overflow: auto; }\n\n.sku-row {\n  position: relative; }\n\n.sku-row label {\n    width: 100%; }\n\n.sku-row .label-input {\n    background: none;\n    border: none;\n    max-width: 108px;\n    border-bottom: 1px solid #dddddd; }\n\n.sku-row .item-label {\n    display: inline-block; }\n\n.sku-row .item-label:first-child {\n    max-width: 108px; }\n\n.sku-row .item-label:last-child {\n    text-align: right; }\n\n.sku-row i {\n    margin-left: 10px;\n    padding-bottom: 3px;\n    border-bottom: 1px solid #dddddd; }\n\n.sku-row .new-btn {\n    font-size: 12px;\n    color: #2262d1;\n    padding-top: 30px;\n    cursor: pointer; }\n\n.sku-row .text-danger {\n    color: #F80606; }\n\n.opacity {\n  opacity: 0.5; }\n"

/***/ }),

/***/ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/inventory/components/add-stock-components/inventory.addstock.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: InventoryAddStockComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryAddStockComponent", function() { return InventoryAddStockComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/helpers */ "./src/app/shared/helpers/index.ts");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../actions/inventory/customStockUnit.actions */ "./src/app/actions/inventory/customStockUnit.actions.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");




















var InventoryAddStockComponent = /** @class */ (function () {
    function InventoryAddStockComponent(store, route, sideBarAction, _fb, inventoryAction, _accountService, customStockActions, ref, _toasty, _inventoryService, companyActions, invoiceActions, invViewService, cdr) {
        var _this = this;
        this.store = store;
        this.route = route;
        this.sideBarAction = sideBarAction;
        this._fb = _fb;
        this.inventoryAction = inventoryAction;
        this._accountService = _accountService;
        this.customStockActions = customStockActions;
        this.ref = ref;
        this._toasty = _toasty;
        this._inventoryService = _inventoryService;
        this.companyActions = companyActions;
        this.invoiceActions = invoiceActions;
        this.invViewService = invViewService;
        this.cdr = cdr;
        this.addStock = false;
        this.autoFocusInChild = false;
        this.stockUnitsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
        this.formDivBoundingRect = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.isUpdatingStockForm = false;
        this.editModeForLinkedStokes = false;
        this.showManufacturingItemsError = false;
        this.editLinkedStockIdx = null;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.forceClearStock$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.forceClearStockUnit$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.disableStockButton = false;
        this.addNewStock = false;
        this.customFieldsArray = [];
        this.taxTempArray = [];
        this.editSKUlabel = false;
        this.customField1HeadingEditing = false;
        this.customField2HeadingEditing = false;
        this.customField1 = false;
        this.customField2 = false;
        this.tdstcsTypes = ['tdsrc', 'tcsrc', 'tdspay', 'tcspay'];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.fetchingStockUniqueName$ = this.store.select(function (state) { return state.inventory.fetchingStockUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isStockNameAvailable$ = this.store.select(function (state) { return state.inventory.isStockNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeGroup$ = this.store.select(function (s) { return s.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeStock$ = this.store.select(function (s) { return s.inventory.activeStock; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isStockAddInProcess$ = this.store.select(function (s) { return s.inventory.isStockAddInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isStockUpdateInProcess$ = this.store.select(function (s) { return s.inventory.isStockUpdateInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isStockDeleteInProcess$ = this.store.select(function (s) { return s.inventory.isStockDeleteInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.showLoadingForStockEditInProcess$ = this.store.select(function (s) { return s.inventory.showLoadingForStockEditInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createGroupSuccess$ = this.store.select(function (s) { return s.inventory.createGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.manageInProcess$ = this.store.select(function (s) { return s.inventory.inventoryAsideState; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this.companyActions.getTax());
        this.companyTaxesList$ = this.store.select(function (p) { return p.company.taxes; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.invoiceSetting$ = this.store.select(function (p) { return p.invoice.settings; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.select(function (state) { return state.inventory.stockUnits; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (p) {
            if (p && p.length) {
                var units = p;
                var unitArr = units.map(function (unit) {
                    return { label: unit.name + " (" + unit.code + ")", value: unit.code };
                });
                _this.stockUnitsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(unitArr);
            }
        });
        this.getParentGroupData();
    }
    InventoryAddStockComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get all groups
        this.formDivBoundingRect.next({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: 0,
            width: 0
        });
        // dispatch stocklist request
        this.store.dispatch(this.inventoryAction.GetStock());
        // dispatch stockunit request
        this.store.dispatch(this.customStockActions.GetStockUnit());
        // subscribe getActiveView parameters
        this.invViewService.getActiveView().subscribe(function (v) {
            _this.groupUniqueName = v.groupUniqueName;
            _this.groupName = v.stockName;
            _this.stockUniqueName = v.stockUniqueName;
            _this.activeGroup = v;
            if (_this.groupUniqueName && _this.stockUniqueName) {
                _this.store.dispatch(_this.sideBarAction.GetInventoryStock(_this.stockUniqueName, _this.groupUniqueName));
            }
        });
        this.stockListDropDown$ = this.store.select(function (p) {
            if (p.inventory.stocksList) {
                if (p.inventory.stocksList.results) {
                    var units = p.inventory.stocksList.results;
                    return units.map(function (unit) {
                        return { label: unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName };
                    });
                }
            }
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        // get all stock units
        // this.stockUnitsDropDown$ = this.store.select(p => {
        // }).takeUntil(this.destroyed$);
        // add stock form
        this.addStockForm = this._fb.group({
            name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].minLength(2)]],
            uniqueName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].minLength(2)]],
            stockUnitCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
            openingQuantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["decimalDigits"]],
            skuCode: [''],
            skuCodeHeading: [''],
            customField1Heading: [''],
            customField1Value: [''],
            customField2Heading: [''],
            customField2Value: [''],
            stockRate: [{ value: '', disabled: true }],
            openingAmount: [''],
            enableSales: [true],
            enablePurchase: [true],
            purchaseAccountUniqueName: [''],
            salesAccountUniqueName: [''],
            purchaseUnitRates: this._fb.array([
                this.initUnitAndRates()
            ]),
            saleUnitRates: this._fb.array([
                this.initUnitAndRates()
            ]),
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required, _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["digitsOnly"]]],
                manufacturingUnitCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["digitsOnly"]],
                linkedStockUnitCode: [''],
            }, { validator: _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["stockManufacturingDetailsValidator"] }),
            isFsStock: [false],
            parentGroup: [''],
            hsnNumber: [''],
            sacNumber: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].pattern('^$|^[A-Za-z0-9]+')],
            taxes: [[]]
        });
        this.taxTempArray = [];
        // subscribe isFsStock for disabling manufacturingDetails
        this.addStockForm.controls['isFsStock'].valueChanges.subscribe(function (v) {
            var manufacturingDetailsContorl = _this.addStockForm.controls['manufacturingDetails'];
            if (v) {
                manufacturingDetailsContorl.enable();
            }
            else {
                manufacturingDetailsContorl.disable();
            }
        });
        // subscribe enablePurchase checkbox for enable/disable unit/rate
        this.addStockForm.controls['enablePurchase'].valueChanges.subscribe(function (a) {
            var purchaseUnitRatesControls = _this.addStockForm.controls['purchaseUnitRates'];
            if (a) {
                purchaseUnitRatesControls.enable();
                // console.log(a);
            }
            else {
                purchaseUnitRatesControls.disable();
            }
        });
        // subscribe enableSales checkbox for enable/disable unit/rate
        this.addStockForm.controls['enableSales'].valueChanges.subscribe(function (a) {
            var saleUnitRatesControls = _this.addStockForm.controls['saleUnitRates'];
            if (a) {
                saleUnitRatesControls.enable();
                // console.log(a);
            }
            else {
                saleUnitRatesControls.disable();
            }
        });
        // get purchase accounts
        this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['purchases'] }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var purchaseAccounts_1 = [];
                data.body.results.map(function (d) {
                    purchaseAccounts_1.push({ label: d.name + " (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.purchaseAccountsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(purchaseAccounts_1);
            }
        });
        // get sales accounts
        this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['sales'] }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var salesAccounts_1 = [];
                data.body.results.map(function (d) {
                    salesAccounts_1.push({ label: d.name + " (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.salesAccountsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(salesAccounts_1);
            }
        });
        // subscribe active stock if available fill form
        this.activeStock$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
            if (a && !_this.addStock) {
                _this.stockUniqueName = a.uniqueName;
                _this.isUpdatingStockForm = true;
                _this.addStockForm.patchValue({
                    name: a.name, uniqueName: a.uniqueName,
                    stockUnitCode: a.stockUnit ? a.stockUnit.code : '', openingQuantity: a.openingQuantity,
                    openingAmount: a.openingAmount,
                    hsnNumber: a.hsnNumber,
                    skuCode: a.skuCode,
                    skuCodeHeading: a.skuCodeHeading,
                    customField1Heading: a.customField1Heading,
                    customField1Value: a.customField1Value,
                    customField2Heading: a.customField2Heading,
                    customField2Value: a.customField2Value,
                    sacNumber: a.sacNumber,
                    parentGroup: a.stockGroup.uniqueName
                });
                if (a.customField1Value) {
                    _this.customField1 = true;
                }
                if (a.customField2Value) {
                    _this.customField2 = true;
                }
                _this.groupUniqueName = a.stockGroup.uniqueName;
                if (!_this.activeGroup) {
                    _this.activeGroup = { uniqueName: a.stockGroup.uniqueName };
                }
                else {
                    _this.activeGroup.uniqueName = a.stockGroup.uniqueName;
                }
                _this.calCulateRate();
                var purchaseUnitRatesControls = _this.addStockForm.controls['purchaseUnitRates'];
                if (a.purchaseAccountDetails) {
                    _this.addStockForm.patchValue({ purchaseAccountUniqueName: a.purchaseAccountDetails.accountUniqueName });
                    // render purchase unit rates
                    a.purchaseAccountDetails.unitRates.map(function (item, i) {
                        _this.addPurchaseUnitRates(i, item);
                    });
                    purchaseUnitRatesControls.enable();
                    _this.addStockForm.controls['enablePurchase'].patchValue(true);
                }
                else {
                    _this.addStockForm.controls['enablePurchase'].patchValue(false);
                    purchaseUnitRatesControls.disable();
                }
                var saleUnitRatesControls = _this.addStockForm.controls['saleUnitRates'];
                if (a.salesAccountDetails) {
                    _this.addStockForm.patchValue({ salesAccountUniqueName: a.salesAccountDetails.accountUniqueName });
                    // render sale unit rates
                    a.salesAccountDetails.unitRates.map(function (item, i) {
                        _this.addSaleUnitRates(i, item);
                    });
                    saleUnitRatesControls.enable();
                    _this.addStockForm.controls['enableSales'].patchValue(true);
                }
                else {
                    saleUnitRatesControls.disable();
                    _this.addStockForm.controls['enableSales'].patchValue(false);
                }
                // if manufacturingDetails is avilable
                if (a.manufacturingDetails) {
                    _this.addStockForm.patchValue({
                        isFsStock: true,
                        manufacturingDetails: {
                            manufacturingQuantity: a.manufacturingDetails.manufacturingQuantity,
                            manufacturingUnitCode: a.manufacturingDetails.manufacturingUnitCode
                        }
                    });
                    a.manufacturingDetails.linkedStocks.map(function (item, i) {
                        _this.addItemInLinkedStocks(item, i, a.manufacturingDetails.linkedStocks.length - 1);
                    });
                }
                else {
                    _this.addStockForm.patchValue({ isFsStock: false });
                }
                _this.companyTaxesList$.subscribe(function (tax) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](tax, function (o) {
                        o.isChecked = false;
                        o.isDisabled = false;
                    });
                });
                _this.taxTempArray = [];
                if (a.taxes.length) {
                    _this.mapSavedTaxes(a.taxes);
                }
                _this.store.dispatch(_this.inventoryAction.hideLoaderForStock());
                // this.addStockForm.controls['parentGroup'].disable();
            }
            else {
                _this.isUpdatingStockForm = false;
            }
        });
        this.companyTaxesList$.subscribe(function (tax) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](tax, function (o) {
                o.isChecked = false;
                o.isDisabled = false;
            });
        });
        this.cdr.detectChanges();
        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(function (s) {
            if (s) {
                _this.resetStockForm();
                _this.store.dispatch(_this.inventoryAction.GetStock());
                if (_this.activeGroup) {
                    _this.addStockForm.get('parentGroup').patchValue(_this.activeGroup.uniqueName);
                }
                _this.taxTempArray = [];
                _this.companyTaxesList$.subscribe(function (taxes) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](taxes, function (o) {
                        o.isChecked = false;
                        o.isDisabled = false;
                    });
                });
                _this.addStockForm.get('taxes').patchValue('');
            }
        });
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.activeGroup = s;
                _this.groupUniqueName = s.uniqueName;
                _this.activeGroup.uniqueName = s.uniqueName;
                _this.addStockForm.get('parentGroup').patchValue(_this.activeGroup.uniqueName);
            }
            else {
                _this.activeGroup = null;
            }
        });
        this.createGroupSuccess$.subscribe(function (s) {
            if (s) {
                _this.getParentGroupData();
            }
        });
        setTimeout(function () {
            _this.addStockForm.controls['enableSales'].patchValue(false);
            _this.addStockForm.controls['enablePurchase'].patchValue(false);
        }, 100);
        this.manageInProcess$.subscribe(function (s) {
            if (!s.isOpen) {
                // console.log('s:', s);
                _this.addStockForm.reset();
            }
        });
        this.invoiceSetting$.subscribe(function (a) {
            if (a && a.companyInventorySettings) {
                _this.isManageInventory$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(a.companyInventorySettings.manageInventory);
            }
        });
    };
    InventoryAddStockComponent.prototype.validateSKU = function (e) {
        var pattern = new RegExp("^[a-zA-Z0-9]+$");
        var isOk = pattern.test(e.key);
        if (!isOk) {
            var val = this.addStockForm.get('skuCode').value;
            val = val.substr(0, (val.length - 1));
            this.addStockForm.get('skuCode').patchValue(val);
            return;
        }
    };
    InventoryAddStockComponent.prototype.addCustomField = function () {
        if (!this.customField1) {
            this.customField1 = true;
            return;
        }
        this.customField2 = true;
    };
    InventoryAddStockComponent.prototype.actionCustomField = function (index) {
        if (index === 1) {
            this.customField1HeadingEditing = !this.customField1HeadingEditing;
        }
        else {
            this.customField2HeadingEditing = !this.customField2HeadingEditing;
        }
    };
    InventoryAddStockComponent.prototype.removeCustomField = function (type, index) {
        if (type === 'remove' && index === 1) {
            this.customField1 = false;
            this.addStockForm.get('customField1Value').patchValue('');
            this.addStockForm.get('customField1Heading').patchValue('');
        }
        if (type === 'remove' && index === 2) {
            this.customField2 = false;
            this.addStockForm.get('customField2Value').patchValue('');
            this.addStockForm.get('customField2Heading').patchValue('');
        }
    };
    // initial unitandRates controls
    InventoryAddStockComponent.prototype.initUnitAndRates = function () {
        // initialize our controls
        return this._fb.group({
            rate: [''],
            stockUnitCode: ['']
        });
    };
    // add purchaseUnitRates controls
    InventoryAddStockComponent.prototype.addPurchaseUnitRates = function (i, item) {
        var purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'];
        var control = this.addStockForm.controls['purchaseUnitRates'];
        // add purchaseUnitRates to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i].patchValue(item);
            }
            else {
                control.push(this.initUnitAndRates());
                setTimeout(function () {
                    control.controls[i].patchValue(item);
                }, 200);
            }
        }
        else {
            if (purchaseUnitRatesControls.controls[i].value.rate && purchaseUnitRatesControls.controls[i].value.stockUnitCode) {
                control.push(this.initUnitAndRates());
            }
        }
    };
    // remove purchaseUnitRates controls
    InventoryAddStockComponent.prototype.removePurchaseUnitRates = function (i) {
        // remove address from the list
        var control = this.addStockForm.controls['purchaseUnitRates'];
        if (control.length > 1) {
            control.removeAt(i);
        }
        else {
            control.controls[0].reset();
        }
    };
    // add saleUnitRates controls
    InventoryAddStockComponent.prototype.addSaleUnitRates = function (i, item) {
        var saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'];
        var control = this.addStockForm.controls['saleUnitRates'];
        // add saleUnitRates to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i].patchValue(item);
            }
            else {
                control.push(this.initUnitAndRates());
                setTimeout(function () {
                    control.controls[i].patchValue(item);
                }, 200);
            }
        }
        else {
            if (saleUnitRatesControls.controls[i].value.rate && saleUnitRatesControls.controls[i].value.stockUnitCode) {
                control.push(this.initUnitAndRates());
            }
        }
    };
    // remove saleUnitRates controls
    InventoryAddStockComponent.prototype.removeSaleUnitRates = function (i) {
        // remove address from the list
        var control = this.addStockForm.controls['saleUnitRates'];
        if (control.length > 1) {
            control.removeAt(i);
        }
        else {
            control.controls[0].reset();
        }
    };
    InventoryAddStockComponent.prototype.ngAfterViewInit = function () {
        if (this.groupUniqueName) {
            // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
        }
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        manufacturingDetailsContorl.disable();
    };
    // generate uniquename
    InventoryAddStockComponent.prototype.generateUniqueName = function () {
        var _this = this;
        if (this.isUpdatingStockForm) {
            return true;
        }
        var groupName = null;
        var val = this.addStockForm.controls['name'].value;
        if (val) {
            val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_14__["uniqueNameInvalidStringReplace"])(val);
        }
        if (val) {
            this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(val));
            this.isStockNameAvailable$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
                if (a !== null && a !== undefined) {
                    if (a) {
                        _this.addStockForm.patchValue({ uniqueName: val });
                    }
                    else {
                        var num = 1;
                        _this.addStockForm.patchValue({ uniqueName: val + num });
                    }
                }
            });
        }
        else {
            this.addStockForm.patchValue({ uniqueName: '' });
        }
    };
    // calculate rate
    InventoryAddStockComponent.prototype.calCulateRate = function () {
        var quantity = this.addStockForm.value.openingQuantity;
        var amount = this.addStockForm.value.openingAmount;
        if (quantity && amount) {
            this.addStockForm.patchValue({ stockRate: (amount / quantity).toFixed(4) });
        }
        else if (!quantity || !amount) {
            this.addStockForm.controls['stockRate'].patchValue('');
        }
    };
    InventoryAddStockComponent.prototype.initialIManufacturingDetails = function () {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["digitsOnly"]]
        });
    };
    InventoryAddStockComponent.prototype.addItemInLinkedStocks = function (item, i, lastIdx) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var frmgrp = this.initialIManufacturingDetails();
        if (item) {
            if (item.controls) {
                var isValid = this.validateLinkedStock(item.value);
                if (isValid) {
                    control.controls[i] = item;
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
    InventoryAddStockComponent.prototype.editItemInLinkedStocks = function (item, i) {
        this.editLinkedStockIdx = i;
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var last = control.controls.length - 1;
        control.disable();
        control.controls[i].enable();
        control.controls[last].enable();
        this.editModeForLinkedStokes = true;
    };
    InventoryAddStockComponent.prototype.updateItemInLinkedStocks = function (item, i) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        control.controls[i].patchValue(item);
        this.editLinkedStockIdx = null;
        this.editModeForLinkedStokes = false;
        var last = control.controls.length;
        control.disable();
        control.controls[last - 1].enable();
    };
    InventoryAddStockComponent.prototype.removeItemInLinkedStocks = function (i) {
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        control.removeAt(i);
    };
    InventoryAddStockComponent.prototype.checkIfLinkedStockIsUnique = function (v) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var linkedStokes = control.value;
        if (linkedStokes) {
            var el = linkedStokes.find(function (a) { return a.stockUniqueName === v.value; });
            if (el) {
                manufacturingDetailsContorl.controls['linkedStockUniqueName'].setValue(el.stockUniqueName);
                manufacturingDetailsContorl.controls['linkedStockUnitCode'].setValue(el.stockUnitCode);
                manufacturingDetailsContorl.controls['linkedQuantity'].setValue(el.quantity);
                return true;
            }
        }
        return true;
    };
    InventoryAddStockComponent.prototype.resetStockForm = function () {
        var _this = this;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        this.forceClearStock$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        this.forceClearStockUnit$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        var activeStock = null;
        this.activeStock$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return activeStock = a; });
        var purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'];
        var saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'];
        var manufacturingDetailsContorls = this.addStockForm.controls['manufacturingDetails'];
        var linkedStocksControls = manufacturingDetailsContorls.controls['linkedStocks'];
        if (purchaseUnitRatesControls.controls.length > 1) {
            purchaseUnitRatesControls.controls = purchaseUnitRatesControls.controls.splice(1);
        }
        if (saleUnitRatesControls.length > 1) {
            saleUnitRatesControls.controls = saleUnitRatesControls.controls.splice(1);
        }
        if (linkedStocksControls.length > 1) {
            linkedStocksControls.controls = [];
            linkedStocksControls.push(this.initialIManufacturingDetails());
        }
        this.addStockForm.reset();
        if (activeStock && !this.addStock) {
            this.isUpdatingStockForm = true;
            this.addStockForm.patchValue({
                name: activeStock.name,
                uniqueName: activeStock.uniqueName,
                stockUnitCode: activeStock.stockUnit ? activeStock.stockUnit.code : '',
                openingQuantity: activeStock.openingQuantity,
                openingAmount: activeStock.openingAmount
            });
            if (activeStock.purchaseAccountDetails) {
                this.addStockForm.patchValue({ purchaseAccountUniqueName: activeStock.purchaseAccountDetails.accountUniqueName });
                // render unit rates
                activeStock.purchaseAccountDetails.unitRates.map(function (item, i) {
                    _this.addPurchaseUnitRates(i, item);
                });
            }
            if (activeStock.salesAccountDetails) {
                this.addStockForm.patchValue({ salesAccountUniqueName: activeStock.salesAccountDetails.accountUniqueName });
                // render unit rates
                activeStock.salesAccountDetails.unitRates.map(function (item, i) {
                    _this.addSaleUnitRates(i, item);
                });
            }
            // if manufacturingDetails is avilable
            if (activeStock.manufacturingDetails) {
                this.addStockForm.patchValue({
                    isFsStock: true,
                    manufacturingDetails: {
                        manufacturingQuantity: activeStock.manufacturingDetails.manufacturingQuantity,
                        manufacturingUnitCode: activeStock.manufacturingDetails.manufacturingUnitCode
                    }
                });
                activeStock.manufacturingDetails.linkedStocks.map(function (item, i) {
                    _this.addItemInLinkedStocks(item, i, activeStock.manufacturingDetails.linkedStocks.length - 1);
                });
            }
            else {
                this.addStockForm.patchValue({ isFsStock: false });
            }
        }
    };
    // submit form
    InventoryAddStockComponent.prototype.submit = function () {
        var _this = this;
        var stockObj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__["CreateStockRequest"]();
        var uniqueName = this.addStockForm.get('uniqueName');
        uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());
        this.addStockForm.get('uniqueName').enable();
        var formObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["cloneDeep"](this.addStockForm.value);
        stockObj.name = formObj.name;
        stockObj.uniqueName = formObj.uniqueName;
        stockObj.stockUnitCode = formObj.stockUnitCode;
        stockObj.openingAmount = formObj.openingAmount;
        stockObj.openingQuantity = formObj.openingQuantity;
        stockObj.hsnNumber = formObj.hsnNumber;
        stockObj.sacNumber = formObj.sacNumber;
        stockObj.skuCode = formObj.skuCode;
        stockObj.skuCodeHeading = formObj.skuCodeHeading;
        stockObj.customField1Heading = formObj.customField1Heading;
        stockObj.customField1Value = formObj.customField1Value;
        stockObj.customField2Heading = formObj.customField2Heading;
        stockObj.customField2Value = formObj.customField2Value;
        if (formObj.enablePurchase) {
            formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter(function (pr) {
                // Aditya: In inventory while creating purchase and sales unit and rate are mandatory error issue
                // return pr.stockUnitCode && pr.rate;
                return pr.stockUnitCode || pr.rate;
            });
            stockObj.purchaseAccountDetails = {
                accountUniqueName: formObj.purchaseAccountUniqueName,
                unitRates: formObj.purchaseUnitRates
            };
        }
        if (formObj.enableSales) {
            formObj.saleUnitRates = formObj.saleUnitRates.filter(function (pr) {
                // Aditya: In inventory while creating purchase and sales unit and rate are mandatory error issue
                // return pr.stockUnitCode && pr.rate;
                return pr.stockUnitCode || pr.rate;
            });
            stockObj.salesAccountDetails = {
                accountUniqueName: formObj.salesAccountUniqueName,
                unitRates: formObj.saleUnitRates
            };
        }
        stockObj.isFsStock = formObj.isFsStock;
        stockObj.taxes = formObj.taxes;
        if (stockObj.isFsStock) {
            formObj.manufacturingDetails.linkedStocks = this.removeBlankLinkedStock(formObj.manufacturingDetails.linkedStocks);
            stockObj.manufacturingDetails = {
                manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
                manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
                linkedStocks: formObj.manufacturingDetails.linkedStocks
            };
        }
        else {
            stockObj.manufacturingDetails = null;
        }
        var parentSelected = false;
        // if (!_.isString && formObj.parentGroup.value) {
        //   formObj.parentGroup = formObj.parentGroup.value;
        //   parentSelected = true;
        // }
        var defaultGrpisExist = false;
        if (formObj.parentGroup) {
            parentSelected = true;
        }
        else {
            this.groupsData$.subscribe(function (p) {
                if (p) {
                    defaultGrpisExist = p.findIndex(function (q) { return q.value === 'maingroup'; }) > -1;
                    if (defaultGrpisExist) {
                        formObj.parentGroup = 'maingroup';
                    }
                }
            });
        }
        if (!formObj.parentGroup) {
            var stockRequest = {
                name: 'Main Group',
                uniqueName: 'maingroup'
            };
            formObj.parentGroup = stockRequest.uniqueName;
            this.store.dispatch(this.inventoryAction.addNewGroup(stockRequest));
        }
        else {
            if (typeof (formObj.parentGroup) === 'object') {
                formObj.parentGroup = formObj.parentGroup.value;
            }
            this.store.dispatch(this.inventoryAction.createStock(stockObj, formObj.parentGroup));
        }
        this.createGroupSuccess$.subscribe(function (s) {
            if (s && formObj.parentGroup) {
                _this.store.dispatch(_this.inventoryAction.createStock(stockObj, formObj.parentGroup));
            }
        });
    };
    InventoryAddStockComponent.prototype.update = function () {
        var stockObj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__["CreateStockRequest"]();
        var uniqueName = this.addStockForm.get('uniqueName');
        uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());
        this.addStockForm.get('uniqueName').enable();
        var formObj = this.addStockForm.value;
        stockObj.name = formObj.name;
        stockObj.uniqueName = formObj.uniqueName.toLowerCase();
        stockObj.stockUnitCode = formObj.stockUnitCode;
        stockObj.openingAmount = formObj.openingAmount;
        stockObj.openingQuantity = formObj.openingQuantity;
        stockObj.hsnNumber = formObj.hsnNumber;
        stockObj.sacNumber = formObj.sacNumber;
        stockObj.taxes = formObj.taxes;
        stockObj.skuCode = formObj.skuCode;
        stockObj.skuCode = formObj.skuCode;
        stockObj.skuCodeHeading = formObj.skuCodeHeading;
        stockObj.customField1Heading = formObj.customField1Heading;
        stockObj.customField1Value = formObj.customField1Value;
        stockObj.customField2Heading = formObj.customField2Heading;
        stockObj.customField2Value = formObj.customField2Value;
        if (formObj.enablePurchase) {
            formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter(function (pr) {
                return pr.stockUnitCode && pr.rate;
            });
            stockObj.purchaseAccountDetails = {
                accountUniqueName: formObj.purchaseAccountUniqueName,
                unitRates: formObj.purchaseUnitRates
            };
        }
        if (formObj.enableSales) {
            formObj.saleUnitRates = formObj.saleUnitRates.filter(function (pr) {
                return pr.stockUnitCode && pr.rate;
            });
            stockObj.salesAccountDetails = {
                accountUniqueName: formObj.salesAccountUniqueName,
                unitRates: formObj.saleUnitRates
            };
        }
        stockObj.isFsStock = formObj.isFsStock;
        if (stockObj.isFsStock) {
            formObj.manufacturingDetails.linkedStocks = this.removeBlankLinkedStock(formObj.manufacturingDetails.linkedStocks);
            stockObj.manufacturingDetails = {
                manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
                manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
                linkedStocks: formObj.manufacturingDetails.linkedStocks
            };
        }
        else {
            stockObj.manufacturingDetails = null;
        }
        this.store.dispatch(this.inventoryAction.updateStock(stockObj, this.groupUniqueName, this.stockUniqueName));
    };
    InventoryAddStockComponent.prototype.deleteStock = function () {
        this.store.dispatch(this.inventoryAction.removeStock(this.groupUniqueName, this.stockUniqueName));
    };
    InventoryAddStockComponent.prototype.getParentGroupData = function () {
        var _this = this;
        // parentgroup data
        var flattenData = [];
        this._inventoryService.GetGroupsWithStocksFlatten().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                _this.flattenDATA(data.body.results, flattenData);
                _this.groupsData$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flattenData);
                // this.setActiveGroupOnCreateStock(); // G0-321
            }
        });
    };
    InventoryAddStockComponent.prototype.setActiveGroupOnCreateStock = function () {
        var _this = this;
        this.groupsData$.subscribe(function (p) {
            var selected = p.find(function (q) { return q.value === _this.groupUniqueName; });
            if (selected) {
                _this.addStockForm.get('parentGroup').patchValue({
                    label: selected.label,
                    value: selected.value
                });
            }
        });
    };
    InventoryAddStockComponent.prototype.flattenDATA = function (rawList, parents) {
        var _this = this;
        if (parents === void 0) { parents = []; }
        rawList.map(function (p) {
            if (p) {
                var newOption = { label: '', value: '' };
                newOption.label = p.name;
                newOption.value = p.uniqueName;
                parents.push(newOption);
                if (p.childStockGroups && p.childStockGroups.length > 0) {
                    _this.flattenDATA(p.childStockGroups, parents);
                }
            }
        });
    };
    // group selected
    InventoryAddStockComponent.prototype.groupSelected = function (event) {
        var selected;
        // this.generateUniqueName();
        this.groupsData$.subscribe(function (p) {
            selected = p.find(function (q) { return q.value === event.value; });
        });
        // this.activeGroup = selected;
    };
    // public autoGroupSelect(grpname) {
    //   if (grpname) {
    //     this.groupsData$.subscribe(p => {
    //     let selected = p.find(q => q.value === grpname);
    //       if (selected) {
    //       this.addStockForm.patchValue({ parentGroup: selected.value });
    //       } else {
    //         this.addStockForm.patchValue({ parentGroup: null });
    //       }
    //     });
    //   }
    // }
    InventoryAddStockComponent.prototype.ngOnDestroy = function () {
        // this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * findAddedStock
     */
    InventoryAddStockComponent.prototype.findAddedStock = function (uniqueName, i) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var count = 0;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](control.controls, function (o) {
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
            this.disableStockButton = false;
        }
    };
    /**
     * removeBlankLinkedStock
     */
    InventoryAddStockComponent.prototype.removeBlankLinkedStock = function (linkedStocks) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var rawArr = control.getRawValue();
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](rawArr, function (o, i) {
            if (!o.quantity || !o.stockUniqueName || !o.stockUnitCode) {
                rawArr = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["without"](rawArr, o);
                control.removeAt(i);
            }
        });
        linkedStocks = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["cloneDeep"](rawArr);
        return linkedStocks;
    };
    /**
     * validateLinkedStock
     */
    InventoryAddStockComponent.prototype.validateLinkedStock = function (item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    };
    InventoryAddStockComponent.prototype.addNewGroupPane = function () {
        this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
    };
    InventoryAddStockComponent.prototype.addNewStockUnit = function () {
        this.store.dispatch(this.inventoryAction.OpenCustomUnitPane(true));
    };
    /**
     * ngOnChanges
     */
    InventoryAddStockComponent.prototype.ngOnChanges = function (s) {
        var _this = this;
        if (s.addStock && s.addStock.currentValue) {
            if (this.addStockForm) {
                this.addStockForm.reset();
                this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
                this.addStockForm.controls['parentGroup'].enable();
                if (this.activeGroup) {
                    this.addStockForm.get('parentGroup').patchValue(this.activeGroup.uniqueName);
                }
                else {
                    this.groupsData$.subscribe(function (p) {
                        if (p) {
                            var defaultGrpisExist = p.findIndex(function (q) { return q.value === 'maingroup'; }) > -1;
                            if (defaultGrpisExist) {
                                _this.addStockForm.get('parentGroup').patchValue('maingroup');
                            }
                        }
                    });
                }
                this.isUpdatingStockForm = false;
            }
        }
        if (s.autoFocusInChild && s.autoFocusInChild.currentValue) {
            this.groupDDList.inputFilter.nativeElement.click();
        }
    };
    /**
     * selectTax
     */
    InventoryAddStockComponent.prototype.selectTax = function (e, tax) {
        var _this = this;
        if (tax.taxType !== 'gstcess') {
            var index = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["findIndex"](this.taxTempArray, function (o) { return o.taxType === tax.taxType; });
            if (index > -1 && e.target.checked) {
                this.companyTaxesList$.subscribe(function (taxes) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](taxes, function (o) {
                        if (o.taxType === tax.taxType) {
                            o.isChecked = false;
                            o.isDisabled = true;
                        }
                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (o.taxType === 'tcsrc' || o.taxType === 'tdsrc' || o.taxType === 'tcspay' || o.taxType === 'tdspay') {
                                o.isChecked = false;
                                o.isDisabled = true;
                            }
                        }
                    });
                });
            }
            if (index < 0 && e.target.checked) {
                this.companyTaxesList$.subscribe(function (taxes) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](taxes, function (o) {
                        if (o.taxType === tax.taxType) {
                            o.isChecked = false;
                            o.isDisabled = true;
                        }
                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (o.taxType === 'tcsrc' || o.taxType === 'tdsrc' || o.taxType === 'tcspay' || o.taxType === 'tdspay') {
                                o.isChecked = false;
                                o.isDisabled = true;
                            }
                        }
                        if (o.uniqueName === tax.uniqueName) {
                            tax.isChecked = true;
                            tax.isDisabled = false;
                            _this.taxTempArray.push(tax);
                        }
                    });
                });
            }
            else if (index > -1 && e.target.checked) {
                tax.isChecked = true;
                tax.isDisabled = false;
                this.taxTempArray = this.taxTempArray.filter(function (ele) {
                    return tax.taxType !== ele.taxType;
                });
                this.taxTempArray.push(tax);
            }
            else {
                var idx = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["findIndex"](this.taxTempArray, function (o) { return o.uniqueName === tax.uniqueName; });
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
                this.companyTaxesList$.subscribe(function (taxes) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["forEach"](taxes, function (o) {
                        if (o.taxType === tax.taxType) {
                            o.isDisabled = false;
                        }
                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (o.taxType === 'tcsrc' || o.taxType === 'tdsrc' || o.taxType === 'tcspay' || o.taxType === 'tdspay') {
                                o.isDisabled = false;
                            }
                        }
                    });
                });
            }
        }
        else {
            if (e.target.checked) {
                this.taxTempArray.push(tax);
                tax.isChecked = true;
            }
            else {
                var idx = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["findIndex"](this.taxTempArray, function (o) { return o.uniqueName === tax.uniqueName; });
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
            }
        }
        this.addStockForm.get('taxes').patchValue(this.taxTempArray.map(function (m) { return m.uniqueName; }));
    };
    /**
     * mapSavedTaxes
     */
    InventoryAddStockComponent.prototype.mapSavedTaxes = function (taxes) {
        var _this = this;
        var taxToMap = [];
        var e = { target: { checked: true } };
        var common = this.companyTaxesList$.subscribe(function (a) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["filter"](a, function (tax) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["find"](taxes, function (unq) {
                    if (unq === tax.uniqueName) {
                        return taxToMap.push(tax);
                    }
                });
            });
        });
        taxToMap.map(function (tax, i) {
            _this.selectTax(e, tax);
        });
    };
    /**
     * moveStock
     */
    InventoryAddStockComponent.prototype.moveStock = function () {
        if (this.addStockForm.get('parentGroup').value !== this.activeGroup.uniqueName) {
            this.store.dispatch(this.inventoryAction.MoveStock(this.activeGroup, this.stockUniqueName, this.addStockForm.get('parentGroup').value));
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InventoryAddStockComponent.prototype, "addStock", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InventoryAddStockComponent.prototype, "autoFocusInChild", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('formDiv'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], InventoryAddStockComponent.prototype, "formDiv", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('groupDDList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InventoryAddStockComponent.prototype, "groupDDList", void 0);
    InventoryAddStockComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'inventory-add-stock',
            template: __webpack_require__(/*! ./inventory.addstock.component.html */ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.html"),
            styles: [__webpack_require__(/*! ./inventory.addstock.component.scss */ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__["SidebarAction"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__["InventoryAction"], _services_account_service__WEBPACK_IMPORTED_MODULE_12__["AccountService"],
            _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_13__["CustomStockUnitAction"], _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__["ToasterService"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_16__["InventoryService"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_17__["CompanyActions"], _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_18__["InvoiceActions"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_19__["InvViewService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"]])
    ], InventoryAddStockComponent);
    return InventoryAddStockComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n\n  <div>\n    <ng-container>\n      <branch-transfer-note [stockList]=\"stockList$ | async\" [userList]=\"userList$ | async\"\n        [stockUnits]=\"stockUnits$ | async\" [branchList]=\"branches$ | async\"  [currentCompany]=\"currentCompany\" [isLoading]=\"isLoading\" (onSave)=\"onSave($event)\" (onCancel)=\"onCancel()\">\n      </branch-transfer-note>\n    </ng-container>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host.in {\n  left: auto;\n  top: 0;\n  right: 0;\n  width: 100%;\n  max-width: 580px;\n  z-index: 1045;\n  display: block;\n  position: fixed;\n  -webkit-transition: 400ms ease-in-out;\n  transition: 400ms ease-in-out; }\n\n:host.out {\n  display: none;\n  -webkit-transform: translate3d(100%, 0px, 0px);\n          transform: translate3d(100%, 0px, 0px);\n  -webkit-transition: 400ms ease-in-out;\n  transition: 400ms ease-in-out; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: auto;\n  right: 572px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  width: 100%;\n  max-width: 580px;\n  background: #fff;\n  width: 100%;\n  padding: 0px; }\n\n.flexy-child {\n  -webkit-box-flex: 1;\n          flex-grow: 1;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.flexy-child-1 {\n  -webkit-box-flex: 1;\n          flex-grow: 1; }\n\n.vmiddle {\n  position: absolute;\n  top: 50%;\n  bottom: 0;\n  left: 0;\n  display: table;\n  width: 100%;\n  right: 0;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  text-align: center;\n  margin: 0 auto; }\n\n:host.in #back {\n  display: block;\n  position: fixed;\n  left: none;\n  right: 572px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n.btn-lg {\n  min-width: 155px;\n  background: #fff3ec;\n  color: #ff5f00;\n  border-radius: 0px;\n  box-shadow: none; }\n\n.btn-lg:hover {\n  background: #ff5f00;\n  color: #ffffff;\n  box-shadow: 0px 4px 4px -3px #afabab;\n  border-radius: 0px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: AsideBranchTransferPaneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideBranchTransferPaneComponent", function() { return AsideBranchTransferPaneComponent; });
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
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");














var AsideBranchTransferPaneComponent = /** @class */ (function () {
    function AsideBranchTransferPaneComponent(_store, _inventoryAction, _inventoryEntryAction, _generalService, _inventoryUserAction, _customStockActions, settingsBranchActions) {
        this._store = _store;
        this._inventoryAction = _inventoryAction;
        this._inventoryEntryAction = _inventoryEntryAction;
        this._generalService = _generalService;
        this._inventoryUserAction = _inventoryUserAction;
        this._customStockActions = _customStockActions;
        this.settingsBranchActions = settingsBranchActions;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.selectedAsideView = 'mainview';
        this.isSaveClicked = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this._store.dispatch(this._inventoryAction.GetStock());
        // dispatch stockunit request
        this._store.dispatch(this._customStockActions.GetStockUnit());
        this._store.dispatch(this._inventoryUserAction.getAllUsers());
        this.entrySuccess$ = this._store.select(function (s) { return s.inventoryInOutState.entrySuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsideBranchTransferPaneComponent.prototype.ngOnChanges = function (changes) {
        //
    };
    AsideBranchTransferPaneComponent.prototype.ngOnInit = function () {
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
        this.entrySuccess$.subscribe(function (s) {
            if (s && _this.isSaveClicked) {
                _this.closeAsidePane(s);
                _this.isSaveClicked = false;
            }
        });
        // tslint:disable-next-line:no-shadowed-variable
        this._store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_12__["createSelector"])([function (state) { return state.settings.branches; }], function (branches) {
            if (branches && branches.results.length > 0) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["each"](branches.results, function (branch) {
                    if (branch.gstDetails && branch.gstDetails.length) {
                        branch.gstDetails = [_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["find"](branch.gstDetails, function (gst) { return gst.addressList && gst.addressList[0] && gst.addressList[0].isDefault; })];
                    }
                });
                _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["orderBy"](branches.results, 'name'));
            }
            else if (branches && branches.results.length === 0) {
                _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(null);
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe();
        // tslint:disable-next-line:no-shadowed-variable
        this._store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(Object(reselect__WEBPACK_IMPORTED_MODULE_12__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.session.companyUniqueName; }], function (companies, uniqueName) {
            if (!companies) {
                return;
            }
            return companies.find(function (cmp) {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                }
                else {
                    return false;
                }
            });
        })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (selectedCmp) {
            if (selectedCmp) {
                _this.currentCompany = selectedCmp;
            }
        });
    };
    AsideBranchTransferPaneComponent.prototype.onCancel = function () {
        this.closeAsidePane();
    };
    AsideBranchTransferPaneComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit();
    };
    AsideBranchTransferPaneComponent.prototype.onSave = function (entry, reciever) {
        this.isSaveClicked = true;
        this._store.dispatch(this._inventoryEntryAction.addNewTransferEntry(entry, reciever));
    };
    AsideBranchTransferPaneComponent.prototype.createAccount = function (value) {
        this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideBranchTransferPaneComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideBranchTransferPaneComponent.prototype, "selectedAsideView", void 0);
    AsideBranchTransferPaneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-branch-transfer-pane',
            template: __webpack_require__(/*! ./aside-branch-transfer-pane.component.html */ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./aside-branch-transfer-pane.component.scss */ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _actions_inventory_inventory_entry_actions__WEBPACK_IMPORTED_MODULE_7__["InventoryEntryActions"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_8__["GeneralService"],
            _actions_inventory_inventory_users_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryUsersActions"],
            _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_9__["CustomStockUnitAction"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_13__["SettingsBranchActions"]])
    ], AsideBranchTransferPaneComponent);
    return AsideBranchTransferPaneComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.html":
/*!******************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.html ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n  <div class=\"aside-body row\">\n    <inventory-custom-stock #customStock [isAsideClose]=\"asideClose\"></inventory-custom-stock>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: AsideCustomStockComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideCustomStockComponent", function() { return AsideCustomStockComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");





var AsideCustomStockComponent = /** @class */ (function () {
    function AsideCustomStockComponent(store) {
        this.store = store;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.createCustomStockSuccess$ = this.store.select(function (s) { return s.inventory.createCustomStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsideCustomStockComponent.prototype.ngOnInit = function () {
        this.asideClose = false;
    };
    AsideCustomStockComponent.prototype.closeAsidePane = function (event) {
        var _this = this;
        this.closeAsideEvent.emit();
        this.asideClose = true;
        setTimeout(function () {
            _this.asideClose = false;
        }, 500);
    };
    AsideCustomStockComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideCustomStockComponent.prototype, "closeAsideEvent", void 0);
    AsideCustomStockComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-custom-stock',
            template: __webpack_require__(/*! ./aside-custom-stock.component.html */ "./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      max-width:580px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 100%;\n      max-width:580px;\n      background: #fff;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]])
    ], AsideCustomStockComponent);
    return AsideCustomStockComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/aside-inventory.components/aside-inventory.components.html":
/*!*************************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-inventory.components/aside-inventory.components.html ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane()\">X</button>\n  <!-- <div class=\"aside-header\" *ngIf=\"!hideFirstStep\">\n      <h1 class=\"mrB2\">Product/Service Information</h1>\n      <h3 class=\"aside-title\">Select a type:</h3>\n  </div>\n\n  <div class=\"aside-body vmiddle\" *ngIf=\"!hideFirstStep\">\n      <div class=\"pd1 alC\">\n          <button class=\"btn btn-lg btn-primary\" (click)=\"openStockPane()\">Create Stock</button>\n      </div>\n      <div class=\"pd1 alC\">\n          <button class=\"btn btn-lg btn-primary\" (click)=\"toggleGroupPane()\">Create Group</button>\n      </div>\n  </div> -->\n\n  <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddGroupOpen\">\n    <inventory-add-group [addGroup]=\"addGroup\" (closeAsideEvent)=\"closeAsidePane($event)\"></inventory-add-group>\n  </div>\n  <div class=\"aside-body flexy-child-1 row\" *ngIf=\"!isAddGroupOpen\">\n    <inventory-add-stock [autoFocusInChild]=\"autoFocusOnChild\" [addStock]=\"addStock\" (closeAsideEvent)=\"closeAsidePane($event)\"></inventory-add-stock>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-inventory.components/aside-inventory.components.ts":
/*!***********************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-inventory.components/aside-inventory.components.ts ***!
  \***********************************************************************************************/
/*! exports provided: AsideInventoryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideInventoryComponent", function() { return AsideInventoryComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");






var AsideInventoryComponent = /** @class */ (function () {
    function AsideInventoryComponent(store, inventoryAction) {
        this.store = store;
        this.inventoryAction = inventoryAction;
        this.autoFocus = false;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.animatePaneAside = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        // @Input() public openGroupPane: boolean;
        // public
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.hideFirstStep = false;
        this.autoFocusOnChild = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.openGroupAsidePane$ = this.store.select(function (s) { return s.inventory.showNewGroupAsidePane; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createGroupSuccess$ = this.store.select(function (s) { return s.inventory.createGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.manageInProcess$ = this.store.select(function (s) { return s.inventory.inventoryAsideState; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.removeStockSuccess$ = this.store.select(function (s) { return s.inventory.deleteStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.removeGroupSuccess$ = this.store.select(function (s) { return s.inventory.deleteGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.UpdateStockSuccess$ = this.store.select(function (s) { return s.inventory.UpdateStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.UpdateGroupSuccess$ = this.store.select(function (s) { return s.inventory.UpdateGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.MoveStockSuccess$ = this.store.select(function (s) { return s.inventory.moveStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsideInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.manageInProcess$.subscribe(function (s) {
            if (s.isOpen && s.isGroup) {
                _this.isAddGroupOpen = true;
                _this.isAddStockOpen = false;
                if (s.isUpdate) {
                    _this.addGroup = false;
                }
                else {
                    _this.addGroup = true;
                }
            }
            else if (s.isOpen && !s.isGroup) {
                _this.isAddGroupOpen = false;
                _this.isAddStockOpen = true;
                if (s.isUpdate) {
                    _this.addStock = false;
                }
                else {
                    _this.addStock = true;
                }
            }
        });
        this.createGroupSuccess$.subscribe(function (d) {
            if (d && _this.isAddGroupOpen) {
                _this.closeAsidePane();
            }
        });
        this.createStockSuccess$.subscribe(function (d) {
            if (d && _this.isAddStockOpen) {
                _this.closeAsidePane();
            }
        });
        // subscribe createStockSuccess for resting form
        this.removeStockSuccess$.subscribe(function (s) {
            if (s && _this.isAddStockOpen) {
                _this.closeAsidePane();
            }
        });
        this.removeGroupSuccess$.subscribe(function (s) {
            if (s && _this.isAddGroupOpen) {
                _this.closeAsidePane();
            }
        });
        this.UpdateStockSuccess$.subscribe(function (s) {
            if (s && _this.isAddStockOpen) {
                _this.closeAsidePane();
            }
        });
        this.UpdateGroupSuccess$.subscribe(function (s) {
            if (s && _this.isAddGroupOpen) {
                _this.closeAsidePane();
            }
        });
        this.MoveStockSuccess$.subscribe(function (s) {
            if (s && _this.isAddStockOpen) {
                _this.closeAsidePane();
            }
        });
    };
    AsideInventoryComponent.prototype.openGroupPane = function () {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
    };
    AsideInventoryComponent.prototype.openStockPane = function () {
        this.hideFirstStep = true;
        this.isAddStockOpen = true;
    };
    AsideInventoryComponent.prototype.closeAsidePane = function (e) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.addGroup = false;
        this.addStock = false;
        if (e) {
            //
        }
        else {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
            this.closeAsideEvent.emit();
            var objToSend = { isOpen: false, isGroup: false, isUpdate: false };
            this.store.dispatch(this.inventoryAction.ManageInventoryAside(objToSend));
        }
    };
    AsideInventoryComponent.prototype.animateAside = function (e) {
        this.animatePaneAside.emit(e);
    };
    AsideInventoryComponent.prototype.ngOnChanges = function (c) {
        if (c.autoFocus && c.autoFocus.currentValue) {
            this.autoFocusOnChild = true;
        }
        else {
            this.autoFocusOnChild = false;
        }
    };
    AsideInventoryComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AsideInventoryComponent.prototype, "autoFocus", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideInventoryComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideInventoryComponent.prototype, "animatePaneAside", void 0);
    AsideInventoryComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-inventory-stock-group',
            template: __webpack_require__(/*! ./aside-inventory.components.html */ "./src/app/inventory/components/aside-inventory.components/aside-inventory.components.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      max-width:580px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 100%;\n      max-width:580px;\n      background: #fff;\n    }\n\n    .aside-pane {\n      width: 100%;\n    }\n\n    .flexy-child {\n      flex-grow: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n\n    .flexy-child-1 {\n      flex-grow: 1;\n    }\n\n    .vmiddle {\n      position: absolute;\n      top: 50%;\n      bottom: 0;\n      left: 0;\n      display: table;\n      width: 100%;\n      right: 0;\n      transform: translateY(-50%);\n      text-align: center;\n      margin: 0 auto;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"]])
    ], AsideInventoryComponent);
    return AsideInventoryComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/aside-pane/aside-pane.components.html":
/*!****************************************************************************!*\
  !*** ./src/app/inventory/components/aside-pane/aside-pane.components.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n    <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane()\" *ngIf=\"!hideFirstScreen\">X</button>\n    <button id=\"back\" class=\"btn btn-primary\" (click)=\"backButtonPressed()\" *ngIf=\"hideFirstScreen\"><i\n      class=\"fa fa-arrow-left\"></i></button>\n  \n    <div class=\"aside-body flexy-child vmiddle\" *ngIf=\"!hideFirstScreen\" vr-item>\n      <div class=\"pd1 alC\">\n        <button class=\"btn btn-lg btn-primary\" (click)=\"toggleStockPane()\">Create Stock</button>\n      </div>\n      <div class=\"pd1 alC\">\n        <button class=\"btn btn-lg btn-primary\" (click)=\"toggleGroupPane()\">Create Group</button>\n      </div>\n      <div class=\"pd1 alC\">\n        <button class=\"btn btn-lg btn-primary\" (click)=\"toggleUnitPane()\">Create Unit</button>\n      </div>\n      <div class=\"pd1 alC\">\n        <button class=\"btn btn-lg btn-primary\" (click)=\"toggleImport()\">Import Stock</button>\n      </div>\n    </div>\n  \n    <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddStockOpen\">\n        <inventory-add-stock [autoFocusInChild]=\"autoFocusOnChild\" [addStock]=\"true\" (closeAsideEvent)=\"closeAsidePane($event)\"></inventory-add-stock>\n    </div>\n    <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddGroupOpen\">\n        <inventory-add-group [addGroup]=\"true\" (closeAsideEvent)=\"closeAsidePane($event)\"></inventory-add-group>\n    </div>\n    <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddUnitOpen\">\n        <inventory-custom-stock></inventory-custom-stock>\n    </div>\n  </div>\n  \n"

/***/ }),

/***/ "./src/app/inventory/components/aside-pane/aside-pane.components.scss":
/*!****************************************************************************!*\
  !*** ./src/app/inventory/components/aside-pane/aside-pane.components.scss ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host.in {\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  max-width: 580px;\n  z-index: 1045;\n  position: fixed;\n  display: block; }\n\n:host.out {\n  display: none; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: auto;\n  right: 572px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  width: 100%;\n  max-width: 580px;\n  background: #fff; }\n\n.aside-pane {\n  width: 100%; }\n\n.flexy-child {\n  -webkit-box-flex: 1;\n          flex-grow: 1;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.flexy-child-1 {\n  -webkit-box-flex: 1;\n          flex-grow: 1; }\n\n.vmiddle {\n  position: absolute;\n  top: 50%;\n  bottom: 0;\n  left: 0;\n  display: table;\n  width: 100%;\n  right: 0;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  text-align: center;\n  margin: 0 auto; }\n\n:host.in #back {\n  display: block;\n  position: fixed;\n  left: none;\n  right: 572px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n.btn-lg {\n  min-width: 140px;\n  background: #fff3ec;\n  color: #ff5f00;\n  border-radius: 0px;\n  box-shadow: none; }\n\n.btn-lg:hover {\n  background: #ff5f00;\n  color: #ffffff;\n  box-shadow: 0px 4px 4px -3px #afabab;\n  border-radius: 0px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-pane/aside-pane.components.ts":
/*!**************************************************************************!*\
  !*** ./src/app/inventory/components/aside-pane/aside-pane.components.ts ***!
  \**************************************************************************/
/*! exports provided: AsidePaneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsidePaneComponent", function() { return AsidePaneComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");








var AsidePaneComponent = /** @class */ (function () {
    function AsidePaneComponent(store, inventoryAction, _router) {
        this.store = store;
        this.inventoryAction = inventoryAction;
        this._router = _router;
        this.autoFocus = false;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.animatePaneAside = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        // @Input() public openGroupPane: boolean;
        // public
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.isAddUnitOpen = false;
        this.hideFirstScreen = false;
        this.hideFirstStep = false;
        this.autoFocusOnChild = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createGroupSuccess$ = this.store.select(function (state) { return state.inventory.createGroupSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createCustomStockSuccess$ = this.store.select(function (s) { return s.inventory.createCustomStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsidePaneComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createStockSuccess$.subscribe(function (s) {
            if (s) {
                _this.hideFirstScreen = false;
                _this.isAddStockOpen = false;
            }
        });
        this.createGroupSuccess$.subscribe(function (s) {
            if (s) {
                _this.hideFirstScreen = false;
                _this.isAddGroupOpen = false;
            }
        });
        this.createCustomStockSuccess$.subscribe(function (s) {
            if (s) {
                // this.hideFirstScreen = false;
                // this.isAddUnitOpen = false;
            }
        });
    };
    AsidePaneComponent.prototype.toggleStockPane = function () {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    };
    AsidePaneComponent.prototype.toggleGroupPane = function () {
        this.hideFirstScreen = true;
        this.isAddGroupOpen = false;
        this.isAddGroupOpen = !this.isAddGroupOpen;
    };
    AsidePaneComponent.prototype.toggleUnitPane = function () {
        this.hideFirstScreen = true;
        this.isAddUnitOpen = false;
        this.isAddUnitOpen = !this.isAddUnitOpen;
    };
    AsidePaneComponent.prototype.toggleImport = function () {
        this.closeAsidePane();
        this._router.navigate(['pages', 'import', 'stock']);
    };
    AsidePaneComponent.prototype.backButtonPressed = function () {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.isAddUnitOpen = false;
    };
    AsidePaneComponent.prototype.closeAsidePane = function (e) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddGroupOpen = false;
        this.isAddUnitOpen = false;
        this.addGroup = false;
        this.addStock = false;
        if (e) {
            //
        }
        else {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
            this.closeAsideEvent.emit();
            var objToSend = { isOpen: false, isGroup: false, isUpdate: false };
            this.store.dispatch(this.inventoryAction.ManageInventoryAside(objToSend));
        }
    };
    AsidePaneComponent.prototype.animateAside = function (e) {
        this.animatePaneAside.emit(e);
    };
    AsidePaneComponent.prototype.ngOnChanges = function (c) {
        if (c.autoFocus && c.autoFocus.currentValue) {
            this.autoFocusOnChild = true;
        }
        else {
            this.autoFocusOnChild = false;
        }
    };
    AsidePaneComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], AsidePaneComponent.prototype, "autoFocus", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsidePaneComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsidePaneComponent.prototype, "animatePaneAside", void 0);
    AsidePaneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-pane',
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["animate"])('400ms ease-in-out'))
                ]),
            ],
            template: __webpack_require__(/*! ./aside-pane.components.html */ "./src/app/inventory/components/aside-pane/aside-pane.components.html"),
            styles: [__webpack_require__(/*! ./aside-pane.components.scss */ "./src/app/inventory/components/aside-pane/aside-pane.components.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"]])
    ], AsidePaneComponent);
    return AsidePaneComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\"\n    *ngIf=\"selectedAsideView=='mainview'\">X</button>\n  <button id=\"back\" class=\"btn btn-primary\" (click)=\"backButtonPressed()\" *ngIf=\"selectedAsideView!='mainview'\"><i\n      class=\"fa fa-arrow-left\"></i></button>\n  <div [ngSwitch]=\"selectedAsideView\">\n    <ng-container *ngSwitchCase=\"'inward'\">       \n      <transfer-inward-note [stockList]=\"stockList$ | async\" [userList]=\"userList$ | async\"\n        [stockUnits]=\"stockUnits$ | async\" [isLoading]=\"isLoading\" (onSave)=\"onSave($event)\" (onCancel)=\"onCancel()\">\n      </transfer-inward-note>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'outward'\">\n      \n      <transfer-outward-note [stockList]=\"stockList$ | async\" [userList]=\"userList$ | async\"\n      [stockUnits]=\"stockUnits$ | async\" [isLoading]=\"isLoading\" (onSave)=\"onSave($event)\" (onCancel)=\"onCancel()\">\n      </transfer-outward-note>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'transfer'\">\n      \n      <transfer-notes [stockList]=\"stockList$ | async\" [userList]=\"userList$ | async\"\n      [stockUnits]=\"stockUnits$ | async\" [isLoading]=\"isLoading\" (onSave)=\"onSave($event.entry,$event.user)\" (onCancel)=\"onCancel()\">\n      </transfer-notes>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'createStock'\">\n      <div class=\"pdT1\">\n        <inventory-add-stock [addStock]=\"true\" (closeAsideEvent)=\"onCancel()\"></inventory-add-stock>\n      </div>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'createAccount'\">\n      <transfer-inventory-user (onSave)=\"createAccount($event)\" (onCancel)=\"onCancel()\"></transfer-inventory-user>\n    </ng-container>\n    <ng-container *ngSwitchDefault>\n      <div class=\"aside-body flexy-child vmiddle\" vr-item>\n        <div class=\"pd1 alC\">\n          <button type=\"button\" class=\"btn btn-lg btn-primary\" (click)=\"selectView('inward')\">Inward Note</button>\n        </div>\n        <div class=\"pd1 alC\">\n          <button type=\"button\" class=\"btn btn-lg btn-primary\" (click)=\"selectView('outward')\">Outward Note</button>\n        </div>\n        <div class=\"pd1 alC\">\n          <button type=\"button\" class=\"btn btn-lg btn-primary\" (click)=\"selectView('transfer')\">Transfer Note</button>\n        </div>\n        <div class=\"pd1 alC\">\n          <button type=\"button\" class=\"btn btn-lg btn-primary\" (click)=\"selectView('createStock')\">Create Stock</button>\n        </div>\n        <div class=\"pd1 alC\">\n          <button type=\"button\" class=\"btn btn-lg btn-primary\" (click)=\"selectView('createAccount')\">Create\n            Account</button>\n        </div>\n      </div>      \n    </ng-container>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.scss":
/*!*********************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.scss ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host.in {\n  left: auto;\n  top: 0;\n  right: 0;\n  max-width: 480px;\n  width: 100%;\n  z-index: 1045;\n  display: block;\n  position: fixed;\n  -webkit-transition: 400ms ease-in-out;\n  transition: 400ms ease-in-out; }\n\n:host.out {\n  display: none;\n  -webkit-transform: translate3d(100%, 0px, 0px);\n          transform: translate3d(100%, 0px, 0px);\n  -webkit-transition: 400ms ease-in-out;\n  transition: 400ms ease-in-out; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: auto;\n  right: 472px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  max-width: 480px;\n  width: 100%;\n  background: #fff;\n  width: 100%;\n  padding: 0px; }\n\n.flexy-child {\n  -webkit-box-flex: 1;\n          flex-grow: 1;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.flexy-child-1 {\n  -webkit-box-flex: 1;\n          flex-grow: 1; }\n\n.vmiddle {\n  position: absolute;\n  top: 50%;\n  bottom: 0;\n  left: 0;\n  display: table;\n  width: 100%;\n  right: 0;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  text-align: center;\n  margin: 0 auto; }\n\n:host.in #back {\n  display: block;\n  position: fixed;\n  left: none;\n  right: 472px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n.btn-lg {\n  min-width: 155px;\n  background: #fff3ec;\n  color: #ff5f00;\n  border-radius: 0px;\n  box-shadow: none; }\n\n.btn-lg:hover {\n  background: #ff5f00;\n  color: #ffffff;\n  box-shadow: 0px 4px 4px -3px #afabab;\n  border-radius: 0px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: AsideTransferPaneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideTransferPaneComponent", function() { return AsideTransferPaneComponent; });
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
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");











var AsideTransferPaneComponent = /** @class */ (function () {
    function AsideTransferPaneComponent(_store, _inventoryAction, _inventoryEntryAction, _generalService, _inventoryUserAction, _customStockActions) {
        this._store = _store;
        this._inventoryAction = _inventoryAction;
        this._inventoryEntryAction = _inventoryEntryAction;
        this._generalService = _generalService;
        this._inventoryUserAction = _inventoryUserAction;
        this._customStockActions = _customStockActions;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.selectedAsideView = 'mainview';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this._store.dispatch(this._inventoryAction.GetStock());
        // dispatch stockunit request
        this._store.dispatch(this._customStockActions.GetStockUnit());
        this._store.dispatch(this._inventoryUserAction.getAllUsers());
        this.createStockSuccess$ = this._store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.entrySuccess$ = this._store.select(function (s) { return s.inventoryInOutState.entrySuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    AsideTransferPaneComponent.prototype.ngOnChanges = function (changes) {
        //
    };
    AsideTransferPaneComponent.prototype.ngOnInit = function () {
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
                _this.selectedAsideView = 'mainview';
                var objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                _this._store.dispatch(_this._inventoryAction.ManageInventoryAside(objToSend));
            }
        });
        this.entrySuccess$.subscribe(function (s) {
            if (s) {
                _this.selectedAsideView = 'mainview';
                var objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                _this._store.dispatch(_this._inventoryAction.ManageInventoryAside(objToSend));
            }
        });
    };
    AsideTransferPaneComponent.prototype.onCancel = function () {
        this.closeAsidePane();
    };
    AsideTransferPaneComponent.prototype.selectView = function (view) {
        this.selectedAsideView = view;
    };
    AsideTransferPaneComponent.prototype.backButtonPressed = function () {
        this.selectedAsideView = 'mainview';
    };
    AsideTransferPaneComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit();
    };
    AsideTransferPaneComponent.prototype.onSave = function (entry, reciever) {
        this._store.dispatch(this._inventoryEntryAction.addNewEntry(entry, reciever));
    };
    AsideTransferPaneComponent.prototype.createAccount = function (value) {
        this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], AsideTransferPaneComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideTransferPaneComponent.prototype, "selectedAsideView", void 0);
    AsideTransferPaneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'aside-transfer-pane',
            template: __webpack_require__(/*! ./aside-transfer-pane.component.html */ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_10__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./aside-transfer-pane.component.scss */ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _actions_inventory_inventory_entry_actions__WEBPACK_IMPORTED_MODULE_7__["InventoryEntryActions"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_8__["GeneralService"],
            _actions_inventory_inventory_users_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryUsersActions"],
            _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_9__["CustomStockUnitAction"]])
    ], AsideTransferPaneComponent);
    return AsideTransferPaneComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/branch/branchHeader/branch.header.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/components/branch/branchHeader/branch.header.component.ts ***!
  \*************************************************************************************/
/*! exports provided: BranchHeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchHeaderComponent", function() { return BranchHeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");




var BranchHeaderComponent = /** @class */ (function () {
    function BranchHeaderComponent(_store) {
        var _this = this;
        this._store = _store;
        this.branchAsideMenuState = 'out';
        this._store.select(function (s) { return s.inventory.showBranchScreenSidebar; }).subscribe(function (bool) {
            _this.toggleBranchAsidePane();
        });
    }
    BranchHeaderComponent.prototype.ngOnInit = function () {
        //
    };
    BranchHeaderComponent.prototype.toggleBodyClass = function () {
        if (this.branchAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    BranchHeaderComponent.prototype.toggleBranchAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.branchAsideMenuState = this.branchAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    BranchHeaderComponent.prototype.ngOnDestroy = function () {
        //
    };
    BranchHeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'branch-header',
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
            template: "\n    <div class=\"aside-overlay\" *ngIf=\"branchAsideMenuState === 'in'\"></div>\n    <branch-destination *ngIf=\"branchAsideMenuState === 'in'\" [class]=\"branchAsideMenuState\"\n                        [@slideInOut]=\"branchAsideMenuState\"></branch-destination>\n  "
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], BranchHeaderComponent);
    return BranchHeaderComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane()\">X</button>\n  <div class=\"aside-body row\">\n\n    <div class=\"form_header\">\n      <div>\n        <h3 class=\"\">\n          <span>Transfer</span>\n          <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'destination' }\"\n         (click)=\"modeChanged('destination')\">Destination</a>\n      /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n        </h3>\n\n      </div>\n    </div>\n\n    <div class=\"form_body witBg clearfix mrBChldLbl\">\n      <div class=\"form_bg clearfix\">\n        <form [formGroup]=\"form\" class=\"form-group\">\n\n          <div class=\"row\">\n            <div class=\"col-xs-6 form-group\">\n              <label>Date <sup>*</sup></label>\n              <input name=\"dateRange\" formControlName=\"transferDate\" type=\"text\" autocomplete=\"off\"\n                     class=\"form-control\" bsDatepicker [minDate]=\"today\" [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n              <span *ngIf=\"transferDate.invalid && (transferDate.dirty || transferDate.touched)\">\n              <span *ngIf=\"transferDate?.errors && transferDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n              </span>\n            </div>\n\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-xs-6 form-group\">\n              <label>Source <sup>*</sup></label>\n              <sh-select [options]=\"branches\" [multiple]=\"false\" [placeholder]=\"'Select Source'\" #sourceSelect\n                         (selected)=\"sourceChanged($event)\"\n                         formControlName=\"source\"></sh-select>\n              <span\n                *ngIf=\"source.invalid && (source.dirty || source.touched)\">\n              <span\n                *ngIf=\"source?.errors && source?.errors['required']\"\n                class=\"text-danger\">Please select Source.</span>\n              </span>\n            </div>\n\n            <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'destination'\">\n              <label>Product Name <sup>*</sup></label>\n              <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\"\n                         formControlName=\"productName\" (selected)=\"productChanged($event)\"></sh-select>\n              <span\n                *ngIf=\"productName.invalid && (productName.dirty || productName.touched)\">\n              <span\n                *ngIf=\"productName.errors && productName.errors['required']\"\n                class=\"text-danger\">Please select Product.</span>\n              </span>\n            </div>\n\n            <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'product'\">\n              <label>Destination <sup>*</sup></label>\n              <sh-select [options]=\"otherBranches\" [multiple]=\"false\" [disabled]=\"!(source.value)\"\n                         [placeholder]=\"'Select Destination'\" formControlName=\"destination\"></sh-select>\n              <span\n                *ngIf=\"destination.invalid && (destination.dirty || destination.touched)\">\n              <span\n                *ngIf=\"destination.errors && destination.errors['required']\"\n                class=\"text-danger\">Please select Destination.</span>\n              </span>\n            </div>\n\n          </div>\n\n          <div class=\"\" style=\"display: flex\">\n\n            <div class=\"\" *ngIf=\"mode === 'destination'\" style=\"margin-right: 20%\">\n              <label class=\"fs14\">Destination <sup>*</sup></label>\n            </div>\n            <div class=\"\" *ngIf=\"mode === 'product'\" style=\"margin-right: 24%\">\n              <label class=\"fs14\">Product <sup>*</sup></label>\n            </div>\n\n            <div class=\"\" style=\"margin-right: 9%\">\n              <label class=\"fs14\">Qty. <sup>*</sup></label>\n            </div>\n            <div class=\"\" style=\"margin-right: 9%\">\n              <label class=\"fs14\">Unit <sup>*</sup></label>\n            </div>\n            <div class=\"\" style=\"margin-right: 9%\">\n              <label class=\"fs14\">Rate <sup>*</sup></label>\n            </div>\n            <div class=\"\">\n              <label class=\"fs14\">Value <sup>*</sup></label>\n            </div>\n          </div>\n\n\n          <div class=\"row\" formArrayName=\"transfers\"\n               *ngFor=\"let item of transfers.controls; let i = index;let first = first;let last = last\">\n            <div [formGroupName]=\"i\">\n\n              <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'destination'\">\n                <sh-select [options]=\"otherBranches\" [multiple]=\"false\" [placeholder]=\"'Select Destination'\"\n                           [ItemHeight]=\"'33'\" formControlName=\"entityDetails\"\n                           [disabled]=\"!(source.value) || !(productName.value)\"></sh-select>\n                <span [hidden]=\"(item.get('entityDetails')?.value)\"\n                      class=\"text-danger\">Please select Destination.</span>\n              </div>\n\n              <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'product'\">\n                <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\"\n                           [ItemHeight]=\"'33'\" formControlName=\"entityDetails\" (selected)=\"productChanged($event, item)\"\n                           [disabled]=\"!(source.value) || !(destination.value)\"></sh-select>\n                <span [hidden]=\"(item.get('entityDetails')?.value)\"\n                      class=\"text-danger\">Please select Product.</span>\n              </div>\n\n              <div style=\"display: flex\">\n                <!-- <label class=\"mrB1\">Quantity</label> -->\n                <!--<div>-->\n                <div class=\"form-group\" style=\"margin-right: 2%;\">\n                  <input name=\"\" type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [minValue]=\"1\"\n                         (change)=\"valueChanged(item)\" class=\"form-control\">\n                </div>\n\n                <div class=\"form-group\" style=\"margin-right: 2%;\" *ngIf=\"mode === 'destination'\">\n                  <input name=\"\" type=\"text\" formControlName=\"stockUnit\" class=\"form-control\">\n                </div>\n\n                <div class=\"form-group\" style=\"margin-right: 2%;\" *ngIf=\"mode === 'product'\">\n                  <input name=\"\" type=\"text\" formControlName=\"stockUnit\" class=\"form-control\">\n                </div>\n\n\n                <div class=\"form-group\" style=\"margin-right: 2%;\" *ngIf=\"mode === 'destination'\">\n                  <input name=\"\" type=\"text\" formControlName=\"rate\" decimalDigitsDirective [minValue]=\"1\"\n                         (change)=\"valueChanged(item)\" class=\"form-control\">\n                </div>\n\n                <div class=\"form-group\" style=\"margin-right: 2%;\" *ngIf=\"mode === 'product'\">\n                  <input name=\"\" type=\"text\" formControlName=\"rate\" (change)=\"valueChanged(item)\" decimalDigitsDirective\n                         [minValue]=\"1\" class=\"form-control\">\n                </div>\n\n                <div class=\"form-group\" style=\"margin-right: 2%;\">\n                  <input name=\"\" type=\"text\" formControlName=\"value\" [readonly]=\"true\" class=\"form-control\">\n                </div>\n\n                <div class=\"mrT\" style=\"margin-right: 2%;\">\n                  <button class=\"btn-link\" (click)=\"addEntry(transfers.controls[i])\" *ngIf=\"last\">\n                    <i class=\"fa fa-plus add_row\"></i>\n                  </button>\n                  <button class=\"btn-link\" (click)=\"deleteEntry(i)\" *ngIf=\"!last\">\n                    <i class=\"fa fa-times dlet\"></i>\n                  </button>\n                </div>\n                <!--</div>-->\n              </div>\n\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-lg-12 form-group\">\n              <label>Description</label>\n              <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n            </div>\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-xs-12 text-left mrT1\">\n              <button class=\"btn btn-default\" (click)=\"closeAsidePane()\">Cancel</button>\n              <button class=\"btn btn-success\" [ladda]=\"(isBranchCreationInProcess$ | async)\" [disabled]=\"form.invalid\"\n                      (click)=\"save()\">Save\n              </button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: BranchTransferComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchTransferComponent", function() { return BranchTransferComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../models/api-models/BranchTransfer */ "./src/app/models/api-models/BranchTransfer.ts");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");












var BranchTransferComponent = /** @class */ (function () {
    function BranchTransferComponent(_fb, _store, _inventoryAction, sidebarAction) {
        var _this = this;
        this._fb = _fb;
        this._store = _store;
        this._inventoryAction = _inventoryAction;
        this.sidebarAction = sidebarAction;
        this.mode = 'destination';
        this.today = new Date();
        this.stockListBackUp = [];
        this.selectedProduct = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__["ReplaySubject"](1);
        this._store.dispatch(this._inventoryAction.GetAllLinkedStocks());
        this.initializeForm();
        this.isBranchCreationInProcess$ = this._store.select(function (state) { return state.inventoryBranchTransfer.isBranchTransferInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isBranchCreationSuccess$ = this._store.select(function (state) { return state.inventoryBranchTransfer.isBranchTransferSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this._store.select(function (state) { return state.inventoryBranchTransfer.linkedStocks; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (branches) {
            if (branches) {
                if (branches.results.length) {
                    _this.branches = _this.linkedStocksVM(branches.results).map(function (b) { return ({ label: b.name, value: b.uniqueName, additional: b }); });
                    _this.otherBranches = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](_this.branches);
                }
            }
        });
    }
    Object.defineProperty(BranchTransferComponent.prototype, "transferDate", {
        get: function () {
            return this.form.get('transferDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferComponent.prototype, "source", {
        get: function () {
            return this.form.get('source');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferComponent.prototype, "productName", {
        get: function () {
            return this.form.get('productName');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferComponent.prototype, "destination", {
        get: function () {
            return this.form.get('destination');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferComponent.prototype, "transfers", {
        get: function () {
            return this.form.get('transfers');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: true,
        configurable: true
    });
    BranchTransferComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._store
            .select(function (p) { return p.inventory.stocksList && p.inventory.stocksList.results; }).subscribe(function (s) {
            if (s) {
                _this.stockListBackUp = s;
                _this.stockListOptions = s.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
            }
        });
        this.isBranchCreationSuccess$.subscribe(function (s) {
            if (s) {
                _this.closeAsidePane();
            }
        });
    };
    BranchTransferComponent.prototype.linkedStocksVM = function (data) {
        var finalArr = [];
        data.forEach(function (d) {
            finalArr.push(new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["LinkedStocksVM"](d.name, d.uniqueName));
            if (d.warehouses.length) {
                finalArr.push.apply(finalArr, d.warehouses.map(function (w) { return new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["LinkedStocksVM"](w.name, w.uniqueName, true); }));
            }
        });
        return finalArr;
    };
    BranchTransferComponent.prototype.modeChanged = function (mode) {
        this.mode = mode;
        this.selectedProduct = null;
        this.transferDate.reset();
        this.sourceSelect.clear();
        this.initializeForm();
        if (mode === 'destination') {
            this.destination.clearValidators();
            this.productName.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        }
        else {
            this.productName.clearValidators();
            this.destination.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        }
    };
    BranchTransferComponent.prototype.initializeForm = function () {
        this.form = this._fb.group({
            transferDate: [moment__WEBPACK_IMPORTED_MODULE_4__().format('DD-MM-YYYY'), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            source: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            productName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            destination: [''],
            transfers: this._fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required),
            description: ['']
        });
        this.addEntry();
    };
    BranchTransferComponent.prototype.addEntry = function (control) {
        if (control) {
            if (!control.valid) {
                return;
            }
            else if (!(control.get('entityDetails').value)) {
                return;
            }
        }
        var items = this.form.get('transfers');
        var rate = 1;
        var stockUnit = '';
        if (this.mode === 'destination' && this.selectedProduct) {
            rate = this.selectedProduct.rate;
            stockUnit = this.selectedProduct.stockUnit.code;
        }
        var transfer = this._fb.group({
            entityDetails: [''],
            quantity: [1, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            rate: [rate, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            stockUnit: [stockUnit, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            value: [1],
        });
        items.push(transfer);
    };
    BranchTransferComponent.prototype.sourceChanged = function (option) {
        if (!option.value) {
            return;
        }
        this.otherBranches = this.branches.filter(function (oth) { return oth.value !== option.value; });
        this._store.dispatch(this._inventoryAction.GetStock(option.value));
    };
    BranchTransferComponent.prototype.productChanged = function (option, item) {
        var _this = this;
        if (this.mode === 'destination') {
            this.selectedProduct = this.stockListBackUp.find(function (slb) {
                return slb.uniqueName === option.value;
            });
            this.transfers.controls.map(function (trn) {
                trn.get('stockUnit').patchValue(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["get"](_this.selectedProduct, 'stockUnit.code'));
                trn.get('rate').patchValue(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["get"](_this.selectedProduct, 'rate', 1));
                _this.valueChanged(trn);
            });
        }
        else {
            this.selectedProduct = null;
            var selectedProduct = this.stockListBackUp.find(function (slb) {
                return slb.uniqueName === option.value;
            });
            var stockUnit = item.get('stockUnit');
            var rate = item.get('rate');
            stockUnit.patchValue(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["get"](selectedProduct, 'stockUnit.code'));
            rate.patchValue(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["get"](selectedProduct, 'rate', 1));
        }
    };
    BranchTransferComponent.prototype.valueChanged = function (item) {
        var quantity = item.get('quantity');
        var rate = item.get('rate');
        var value = item.get('value');
        value.patchValue(parseFloat(quantity.value) * parseFloat(rate.value));
    };
    BranchTransferComponent.prototype.deleteEntry = function (index) {
        var items = this.form.get('transfers');
        items.removeAt(index);
    };
    BranchTransferComponent.prototype.closeAsidePane = function () {
        this._store.dispatch(this._inventoryAction.ResetBranchTransferState());
        this.modeChanged('destination');
        this._store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(false));
        // this.closeAsideEvent.emit();
    };
    BranchTransferComponent.prototype.save = function () {
        var _this = this;
        if (this.form.valid) {
            var value = void 0;
            if (this.mode === 'destination') {
                value = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["TransferDestinationRequest"]();
                value.source = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["BranchTransferEntity"](this.source.value, this.getEntityType(this.source.value));
                value.description = this.description.value;
                value.product = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["BranchTransferEntity"](this.productName.value, 'stock');
                value.transferDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');
                var rawValues = this.transfers.getRawValue();
                rawValues.map(function (rv) {
                    delete rv['value'];
                    rv.entityDetails = {
                        uniqueName: rv.entityDetails,
                        entity: _this.getEntityType(rv.entityDetails)
                    };
                });
                value.transfers = rawValues;
            }
            else {
                value = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["TransferProductsRequest"]();
                value.source = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["BranchTransferEntity"](this.source.value, this.getEntityType(this.source.value));
                value.description = this.description.value;
                value.destination = new _models_api_models_BranchTransfer__WEBPACK_IMPORTED_MODULE_10__["BranchTransferEntity"](this.destination.value, this.getEntityType(this.destination.value));
                value.transferDate = moment__WEBPACK_IMPORTED_MODULE_4__(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');
                var rawValues = this.transfers.getRawValue();
                rawValues.map(function (rv) {
                    delete rv['value'];
                    rv.entityDetails = {
                        uniqueName: rv.entityDetails,
                        entity: 'stock'
                    };
                });
                value.transfers = rawValues;
            }
            this._store.dispatch(this._inventoryAction.CreateBranchTransfer(value));
        }
    };
    BranchTransferComponent.prototype.getEntityType = function (uniqueName) {
        var result = this.branches.find(function (f) { return f.value === uniqueName; });
        return result.additional.isWareHouse ? 'warehouse' : 'company';
    };
    BranchTransferComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('sourceSelect'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_9__["ShSelectComponent"])
    ], BranchTransferComponent.prototype, "sourceSelect", void 0);
    BranchTransferComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'branch-destination',
            template: __webpack_require__(/*! ./branch.transfer.component.html */ "./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      max-width:580px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 100%;\n      max-width:580px;\n      background: #fff;\n    }\n\n    .aside-pane {\n      width: 100%;\n    }\n\n    .flexy-child {\n      flex-grow: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n\n    .flexy-child-1 {\n      flex-grow: 1;\n    }\n\n    .vmiddle {\n      position: absolute;\n      top: 50%;\n      bottom: 0;\n      left: 0;\n      display: table;\n      width: 100%;\n      right: 0;\n      transform: translateY(-50%);\n      text-align: center;\n      margin: 0 auto;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"], _ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryAction"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_11__["SidebarAction"]])
    ], BranchTransferComponent);
    return BranchTransferComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.html":
/*!***************************************************************************************************!*\
  !*** ./src/app/inventory/components/custom-stock-components/inventory.customstock.component.html ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"\" style=\"margin-top: -15px;\">\n    <section class=\"\">\n        <div class=\"\">\n            <div class=\"form_header\">\n                <h2 *ngIf=\"!editMode\">Create Unit</h2>\n                <h2 *ngIf=\"editMode\">Modify Unit</h2>\n            </div>\n\n            <form #customUnitForm=\"ngForm\" name=\"customUnitForm\" class=\"form_body\" novalidate>\n                <div class=\"form_bg clearfix\">\n                    <div class=\"row\">\n                        <div class=\"form-group col-xs-6\">\n                            <label>Unit Name<sup>*</sup></label>\n                            <sh-select [options]=\"stockUnitsList\" #unitName name=\"name\" [(ngModel)]=\"customUnitObj.name\" *ngIf=\"country == 'india'\" [placeholder]=\"'Select unit'\" (selected)=\"setUnitName($event?.label)\" [ItemHeight]=\"33\" (onClear)=\"clearUnit()\" [forceClearReactive]=\"forceClear$ | async\"\n                                [doNotReset]=\"true\" (noOptionsFound)=\"noUnitFound(unitName)\" [notFoundMsg]=\"'Type to create custom unit'\"></sh-select>\n                            <input placeholder=\"Unit name\" type=\"text\" class=\"form-control\" name=\"name\" [(ngModel)]=\"customUnitObj.name\" required *ngIf=\"country != 'india'\" (change)=\"checkIfUnitIsExist()\">\n                        </div>\n\n                        <div class=\"form-group col-xs-6\">\n                            <label>Unit Code<sup>*</sup></label>\n                            <!-- [disabled]=\"country === 'india' || (isStockUnitCodeAvailable$ | async)\" -->\n                            <input placeholder=\"Unique name\" type=\"text\" name=\"code\" [(ngModel)]=\"customUnitObj.code\" class=\"form-control\" required/>\n                        </div>\n\n                        <div class=\"form-group col-xs-5\">\n                            <label>Parent Unit</label>\n                            <sh-select [options]=\"stockUnitsDropDown$ | async\" name=\"parentStockUnit\" [placeholder]=\"'Choose a parent unit'\" [(ngModel)]=\"customUnitObj.parentStockUnitCode\" (selected)=\"change($event?.value)\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                        </div>\n\n                        <div class=\"form-group col-xs-3\">\n                            <div class=\"row\">\n                                <label class=\"width100 d-block\">&nbsp;</label>\n                                <div class=\"checkbox square-switch\">\n                                    <input type=\"checkbox\" id=\"isDivide\" [checked]=\"isDivide\" (change)=\"isDivide = !isDivide\" />\n                                    <label for=\"isDivide\">\n                                    <span class=\"pull-left width100 text-left\" *ngIf=\"isDivide\"><img src=\"./assets/images/divide-ico.svg\" /> Divide</span>\n                                    <span class=\"pull-right width100 text-right\" *ngIf=\"!isDivide\"><img src=\"./assets/images/multiply.svg\" [style.width.px]=\"11\" /> Multiply</span>\n                                    </label>\n                                </div>\n                                <!-- <div class=\"btn-group unit_action\" role=\"group\" aria-label=\"...\">\n                                    <button type=\"button\" class=\"btn btn-default\" [ngClass]=\"{'isSelected': isDivide}\" (click)=\"changeType(true)\"><img src=\"./assets/images/divide-ico.svg\" /></button>\n                                    <button type=\"button\" class=\"btn btn-default\" [ngClass]=\"{'isSelected': !isDivide}\" (click)=\"changeType(false)\"><img src=\"./assets/images/multiply.svg\" /></button>\n                                </div> -->\n                            </div>\n                        </div>\n\n                        <div class=\"form-group col-xs-4\">\n                            <label>Qty. per Unit<sup>*</sup></label>\n                            <input placeholder=\"Quantity\" type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"4\" [(ngModel)]=\"customUnitObj.quantityPerUnit\" name=\"quantityPerUnit\" class=\"form-control\" required>\n                        </div>\n                        <div class=\"grey_clr col-xs-12 mrB2 multiply\" *ngIf=\"customUnitObj.name && customUnitObj.quantityPerUnit && !isDivide\">1 {{customUnitObj?.name}} = {{customUnitObj?.quantityPerUnit}} {{customUnitObj?.parentStockUnit?.name}} </div>\n                        <div class=\"grey_clr col-xs-12 mrB2 division\" *ngIf=\"customUnitObj.name && customUnitObj.quantityPerUnit && isDivide\">\n                            <span class=\"mrR\">1 {{customUnitObj?.name}}</span> <span class=\"mrR fs18\">=</span>\n                            <div class=\"text-center\">\n                                1 {{customUnitObj.parentStockUnit?.name}}\n                                <div class=\"hr\"></div> {{customUnitObj?.quantityPerUnit}}\n                            </div>\n                        </div>\n\n                    </div>\n                    <div class=\"row mrB\">\n                        <div class=\"col-xs-12\" *ngIf=\"!editMode\">\n                            <button type=\"submit\" class=\"btn btn-sm btn-success\" (click)=\"saveUnit()\" [disabled]=\"customUnitForm.invalid\" [ladda]=\"createCustomStockInProcess$ | async\">Save\n              </button>\n                            <button type=\"submit\" class=\"btn btn-sm btn-danger\" (click)=\"clearFields()\">Clear</button>\n                        </div>\n\n                        <div class=\"col-xs-12\" *ngIf=\"editMode\">\n                            <button type=\"submit\" class=\"btn btn-sm btn-success\" (click)=\"saveUnit()\" [disabled]=\"customUnitForm.invalid\">Update\n              </button>\n                            <button type=\"submit\" class=\"btn btn-sm btn-danger\" (click)=\"clearFields()\">Cancel</button>\n                        </div>\n                    </div>\n\n                </div>\n            </form>\n\n\n            <div class=\"mrT2 col-xs-12 clearfix\">\n                <table class=\"table basic\">\n                    <thead>\n                        <tr>\n                            <th>Unit Name</th>\n                            <th>Parent Unit</th>\n                            <th class=\"text-right\">Qty per Unit</th>\n                            <th>&nbsp;</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n\n                        <tr *ngFor=\"let item of stockUnit$ | async\">\n                            <td>{{item.name}} ({{item.code}})</td>\n                            <td>{{item.parentStockUnit?.name}} <span *ngIf=\"!item.parentStockUnit?.name\">-</span></td>\n                            <td class=\"text-right\">{{item.displayQuantityPerUnit}}</td>\n                            <td class=\"action ico-btn\">\n                                <button class=\"btn-default btn-xs\" [disabled]=\"editMode\" (click)=\"editUnit(item)\"><i\n                class=\"fa fa-pencil\"></i></button>\n                                <button class=\"btn-default btn-xs\" [disabled]=\"editMode\" [ladda]=\"(deleteCustomStockInProcessCode$ | async)?.indexOf(item.code) > -1\" (click)=\"deleteUnit(item.code)\"><i class=\"fa fa-trash\"></i></button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </section>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.scss":
/*!***************************************************************************************************!*\
  !*** ./src/app/inventory/components/custom-stock-components/inventory.customstock.component.scss ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".square-switch input[type=\"checkbox\"]:checked ~ label {\n  background: initial;\n  color: initial; }\n\n.square-switch img {\n  top: -1px;\n  position: relative; }\n\n.division {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center; }\n\n.division > div {\n  display: inline-block;\n  width: auto;\n  padding: 0 7px; }\n\n.hr {\n  border-bottom: 2px solid #ddd;\n  margin: 3px 0; }\n"

/***/ }),

/***/ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.ts":
/*!*************************************************************************************************!*\
  !*** ./src/app/inventory/components/custom-stock-components/inventory.customstock.component.ts ***!
  \*************************************************************************************************/
/*! exports provided: InventoryCustomStockComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryCustomStockComponent", function() { return InventoryCustomStockComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/customStockUnit.actions */ "./src/app/actions/inventory/customStockUnit.actions.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _stock_unit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./stock-unit */ "./src/app/inventory/components/custom-stock-components/stock-unit.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");













var InventoryCustomStockComponent = /** @class */ (function () {
    function InventoryCustomStockComponent(store, customStockActions, inventoryAction, sidebarAction, settingsProfileActions) {
        var _this = this;
        this.store = store;
        this.customStockActions = customStockActions;
        this.inventoryAction = inventoryAction;
        this.sidebarAction = sidebarAction;
        this.settingsProfileActions = settingsProfileActions;
        this.stockUnitsList = _stock_unit__WEBPACK_IMPORTED_MODULE_10__["StockUnits"];
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.isDivide = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.customUnitObj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__["StockUnitRequest"]();
        this.stockUnit$ = this.store.select(function (p) { return p.inventory.stockUnits; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isStockUnitCodeAvailable$ = this.store.select(function (state) { return state.inventory.isStockUnitCodeAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.select(function (state) { return state.inventory.stockUnits; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (p) {
            if (p && p.length) {
                var units = p;
                var unitArr = units.map(function (unit) {
                    return { label: unit.name + " (" + unit.code + ")", value: unit.code };
                });
                _this.stockUnitsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(unitArr);
            }
        });
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (!_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["isEmpty"](o)) {
                _this.companyProfile = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o);
                if (_this.companyProfile.country) {
                    _this.country = _this.companyProfile.country.toLocaleLowerCase();
                    if (_this.country && _this.country === 'india') {
                        _this.isIndia = true;
                    }
                }
                else {
                    _this.country = 'india';
                    _this.isIndia = true;
                }
            }
            else {
                _this.store.dispatch(_this.settingsProfileActions.GetProfileInfo());
            }
        });
        this.activeGroupUniqueName$ = this.store.select(function (s) { return s.inventory.activeGroupUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createCustomStockInProcess$ = this.store.select(function (s) { return s.inventory.createCustomStockInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateCustomStockInProcess$ = this.store.select(function (s) { return s.inventory.updateCustomStockInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.deleteCustomStockInProcessCode$ = this.store.select(function (s) { return s.inventory.deleteCustomStockInProcessCode; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createCustomStockSuccess$ = this.store.select(function (s) { return s.inventory.createCustomStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    InventoryCustomStockComponent.prototype.ngOnInit = function () {
        var _this = this;
        var activeGroup = null;
        this.activeGroupUniqueName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return activeGroup = a; });
        if (activeGroup) {
            this.store.dispatch(this.sidebarAction.OpenGroup(activeGroup));
        }
        // this.store.dispatch(this.inventoryAction.resetActiveGroup());
        this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.store.dispatch(this.customStockActions.GetStockUnit());
        // this.stockUnit$.subscribe(p => this.clearFields());
        this.createCustomStockSuccess$.subscribe(function (a) {
            if (a) {
                _this.clearFields();
                _this.selectedUnitName = null;
            }
        });
        this.updateCustomStockInProcess$.subscribe(function (a) {
            if (!a) {
                _this.clearFields();
                _this.selectedUnitName = null;
            }
        });
    };
    InventoryCustomStockComponent.prototype.saveUnit = function () {
        var customUnitObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["clone"](this.customUnitObj);
        if (!this.editMode) {
            if (this.isIndia && this.selectedUnitName) {
                customUnitObj.name = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.selectedUnitName);
            }
            if (this.isDivide) {
                customUnitObj.quantityPerUnit = 1 * _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            }
            else {
                customUnitObj.quantityPerUnit = 1 / _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            }
            this.store.dispatch(this.customStockActions.CreateStockUnit(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj)));
        }
        else {
            if (this.isDivide) {
                customUnitObj.quantityPerUnit = 1 * _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            }
            else {
                customUnitObj.quantityPerUnit = 1 / _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            }
            this.store.dispatch(this.customStockActions.UpdateStockUnit(_lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](customUnitObj), this.editCode));
            this.customUnitObj.name = null;
        }
    };
    InventoryCustomStockComponent.prototype.deleteUnit = function (code) {
        this.store.dispatch(this.customStockActions.DeleteStockUnit(code));
    };
    InventoryCustomStockComponent.prototype.editUnit = function (item) {
        this.customUnitObj = Object.assign({}, item);
        this.setUnitName(this.customUnitObj.name);
        if (item.displayQuantityPerUnit) {
            this.customUnitObj.quantityPerUnit = item.displayQuantityPerUnit;
        }
        if (this.customUnitObj.parentStockUnit) {
            this.customUnitObj.parentStockUnitCode = item.parentStockUnit.code;
        }
        this.editCode = item.code;
        this.editMode = true;
    };
    InventoryCustomStockComponent.prototype.clearFields = function () {
        this.customUnitObj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__["StockUnitRequest"]();
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        this.customUnitObj.parentStockUnitCode = null;
        this.editMode = false;
        this.editCode = '';
        this.isDivide = false;
    };
    InventoryCustomStockComponent.prototype.change = function (v) {
        var _this = this;
        this.stockUnit$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["find"])(function (p) {
            var unit = p.find(function (q) { return q.code === v; });
            if (unit !== undefined) {
                _this.customUnitObj.parentStockUnit = unit;
                return true;
            }
        })).subscribe();
    };
    InventoryCustomStockComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        // this.clearFields();
    };
    InventoryCustomStockComponent.prototype.setUnitName = function (name) {
        var unit = this.stockUnitsList.filter(function (obj) { return obj.value === name || obj.label === name; });
        if (unit !== undefined && unit.length > 0) {
            this.customUnitObj.code = unit[0].value;
            this.customUnitObj.name = unit[0].value;
            this.selectedUnitName = unit[0].label;
            this.checkIfUnitIsExist();
        }
    };
    InventoryCustomStockComponent.prototype.ngOnChanges = function (changes) {
        if (this.isAsideClose) {
            this.clearFields();
        }
    };
    /**
     * clearUnit
     */
    InventoryCustomStockComponent.prototype.clearUnit = function () {
        var _this = this;
        setTimeout(function () {
            _this.customUnitObj.code = '';
        }, 100);
    };
    /**
     * checkIfUnitIsExist
     */
    InventoryCustomStockComponent.prototype.checkIfUnitIsExist = function () {
        var _this = this;
        if (this.editMode) {
            return true;
        }
        var groupName = null;
        var val = this.customUnitObj.code;
        if (val && this.stockUnitsList.includes({ label: val, value: val })) {
            val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_12__["uniqueNameInvalidStringReplace"])(val);
        }
        if (val) {
            this.store.dispatch(this.customStockActions.GetStockUnitByName(val));
            this.isStockUnitCodeAvailable$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
                if (a !== null && a !== undefined) {
                    if (a) {
                        _this.customUnitObj.code = val;
                    }
                    else {
                        var num = 1;
                        _this.customUnitObj.code = val + num;
                    }
                }
            });
        }
        else {
            this.customUnitObj.code = '';
        }
    };
    /**
     * noUnitFound
     */
    InventoryCustomStockComponent.prototype.noUnitFound = function (selectElem) {
        if (selectElem) {
            var val = selectElem.filter;
            this.customUnitObj.name = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](val);
            this.selectedUnitName = '';
            if (!this.editMode && val) {
                val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_12__["uniqueNameInvalidStringReplace"])(val);
                this.customUnitObj.code = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](val);
            }
        }
    };
    /**
     * changeType
     */
    InventoryCustomStockComponent.prototype.changeType = function (ev) {
        this.isDivide = ev;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], InventoryCustomStockComponent.prototype, "isAsideClose", void 0);
    InventoryCustomStockComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'inventory-custom-stock',
            template: __webpack_require__(/*! ./inventory.customstock.component.html */ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.html"),
            styles: [__webpack_require__(/*! ./inventory.customstock.component.scss */ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_6__["CustomStockUnitAction"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_8__["InventoryAction"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__["SidebarAction"], _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_11__["SettingsProfileActions"]])
    ], InventoryCustomStockComponent);
    return InventoryCustomStockComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/custom-stock-components/stock-unit.ts":
/*!****************************************************************************!*\
  !*** ./src/app/inventory/components/custom-stock-components/stock-unit.ts ***!
  \****************************************************************************/
/*! exports provided: StockUnits */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockUnits", function() { return StockUnits; });
var StockUnits = [
    {
        label: 'Bags',
        value: 'BAG'
    },
    {
        label: 'Bale',
        value: 'BAL'
    },
    {
        label: 'Bundles',
        value: 'BDL'
    },
    {
        label: 'Buckles',
        value: 'BKL'
    },
    {
        label: 'Billion of units',
        value: 'BOU'
    },
    {
        label: 'Box',
        value: 'BOX'
    },
    {
        label: 'Bottles',
        value: 'BTL'
    },
    {
        label: 'Bunches',
        value: 'BUN'
    },
    {
        label: 'Cans',
        value: 'CAN'
    },
    {
        label: 'Cubic meters',
        value: 'CBM'
    },
    {
        label: 'Cubic Centimeters',
        value: 'CCM'
    },
    {
        label: 'Centimeters',
        value: 'CMS'
    },
    {
        label: 'Cartons',
        value: 'CTN'
    },
    {
        label: 'Dozens',
        value: 'DOZ'
    },
    {
        label: 'Drums',
        value: 'DRM'
    },
    {
        label: 'Great Gross',
        value: 'GGK'
    },
    {
        label: 'Grammes',
        value: 'GMS'
    },
    {
        label: 'Gross',
        value: 'GRS'
    },
    {
        label: 'Gross Yards',
        value: 'GYD'
    },
    {
        label: 'Kilograms',
        value: 'KGS'
    },
    {
        label: 'Kilolitre',
        value: 'KLR'
    },
    {
        label: 'Kilometre',
        value: 'KME'
    },
    {
        label: 'Mililitre',
        value: 'MLT'
    },
    {
        label: 'Meters',
        value: 'MTR'
    },
    {
        label: 'Metric Ton',
        value: 'MTS'
    },
    {
        label: 'Numbers',
        value: 'NOS'
    },
    {
        label: 'Packs',
        value: 'PAC'
    },
    {
        label: 'Pieces',
        value: 'PCS'
    },
    {
        label: 'Pairs',
        value: 'PRS'
    },
    {
        label: 'Quintal',
        value: 'QTL'
    },
    {
        label: 'Rolls',
        value: 'ROL'
    },
    {
        label: 'Sets',
        value: 'SET'
    },
    {
        label: 'Square Feet',
        value: 'SQF'
    },
    {
        label: 'Square Meters',
        value: 'SQM'
    },
    {
        label: 'Square Yards',
        value: 'SQY'
    },
    {
        label: 'Tablets',
        value: 'TBS'
    },
    {
        label: 'Ten Gross',
        value: 'TGM'
    },
    {
        label: 'Thousands',
        value: 'THD'
    },
    {
        label: 'Tonnes',
        value: 'TON'
    },
    {
        label: 'Tubes',
        value: 'TUB'
    },
    {
        label: 'US Gallons',
        value: 'UGS'
    },
    {
        label: 'Units',
        value: 'UNT'
    },
    {
        label: 'Yards',
        value: 'YDS'
    },
    {
        label: 'Others',
        value: 'OTH'
    }
];


/***/ }),

/***/ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.html":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n    <div>\n        <h3 class=\"\">\n            <span>Transfer</span>\n            <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'receiver' }\"\n         (click)=\"modeChanged('receiver')\">Destination</a> /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n        </h3>\n\n    </div>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n    <div class=\"form_bg clearfix\">\n        <form [formGroup]=\"form\" class=\"form-group\">\n            <div class=\"row\">\n                <div class=\"col-xs-4 form-group\">\n                    <label>Date <sup>*</sup></label>\n                    <input name=\"dateRange\" formControlName=\"transferDate\" type=\"text\" autocomplete=\"off\" class=\"form-control\" bsDatepicker [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n                    <span *ngIf=\"transferDate.invalid && (transferDate.dirty || transferDate.touched)\">\n                <span *ngIf=\"transferDate?.errors && transferDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n                </div>\n            </div>\n            <div class=\"row\" *ngIf=\"mode === 'receiver'\">\n                <div class=\"col-xs-6 form-group\">\n                    <label>Source <sup>*</sup></label>\n                    <sh-select [options]=\"branchListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Source'\" formControlName=\"inventorySource\" (selected)=\"userChanged($event, null, 'source')\"></sh-select>\n                    <!-- <span *ngIf=\"inventoryUser.invalid\">\n    <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n          class=\"text-danger\">Please select Sender.</span>\n          </span> -->\n                </div>\n\n                <div class=\"col-xs-6 form-group\">\n                    <label>Product Name <sup>*</sup></label>\n                    <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" [disabled]=\"stock.disabled\" formControlName=\"stock\" (selected)=\"stockChanged($event, false, 'product')\"></sh-select>\n                    <!-- <span *ngIf=\"stock.invalid\">\n    <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n          </span> -->\n                </div>\n            </div>\n            <div class=\"row\" *ngIf=\"mode === 'product'\">\n                <div class=\"col-xs-6 form-group\">\n                    <label>Source <sup>*</sup></label>\n                    <sh-select [options]=\"branchListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Source'\" formControlName=\"inventorySource\" (selected)=\"userChanged($event, null, 'source')\"></sh-select>\n                    <!-- <span *ngIf=\"inventoryUser.invalid\">\n    <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n          class=\"text-danger\">Please select Source.</span>\n          </span> -->\n                </div>\n\n                <div class=\"col-xs-6 form-group\">\n                    <label>Destination <sup>*</sup></label>\n                    <sh-select [options]=\"branchListOptions\" #shDestination [multiple]=\"false\" [placeholder]=\"'Select Destination'\" formControlName=\"inventoryDestination\" (selected)=\"userChanged($event, null, 'destination')\"></sh-select>\n                    <!-- <span *ngIf=\"inventoryUser.invalid\">\n    <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n          class=\"text-danger\">Please select Destination.</span>\n          </span> -->\n                </div>\n            </div>\n\n            <table class=\"entry-table\">\n                <tr>\n                    <th width=\"150\">\n                        <label *ngIf=\"mode === 'receiver'\" class=\"fs14\">Destination <sup>*</sup></label>\n                        <label *ngIf=\"mode === 'product'\" class=\"fs14\">Product Name <sup>*</sup></label>\n                    </th>\n                    <th width=\"120\"><label class=\"fs14\">Unit<sup>*</sup></label></th>\n                    <th><label class=\"fs14\">Qty<sup>*</sup></label></th>\n                    <th><label class=\"fs14\">Rate<sup>*</sup></label></th>\n                    <th><label class=\"fs14\">Value <sup>*</sup></label></th>\n                    <th></th>\n                </tr>\n                <tr formArrayName=\"transfers\" *ngFor=\"let item of transfers.controls; let i = index;let first = first;let last = last\">\n                    <ng-container [formGroupName]=\"i\">\n                        <td width=\"160\">\n                            <sh-select *ngIf=\"mode === 'receiver'\" [options]=\"branchListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Destination'\" (selected)=\"userChanged($event,i)\" formControlName=\"inventoryUser\" [ItemHeight]=\"'33'\"></sh-select>\n                            <sh-select *ngIf=\"mode === 'product'\" [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" (selected)=\"stockChanged($event,i)\" [ItemHeight]=\"'33'\" formControlName=\"stock\"></sh-select>\n                        </td>\n                        <td width=\"100\">\n                            <sh-select [options]=\"stockUnitsOptions\" [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\" [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n                        </td>\n                        <td><input name=\"\" type=\"text\" (keyup)=\"calculateAmount(i, 'qty')\" placeholder=\"Qty\" formControlName=\"quantity\" class=\"form-control\"></td>\n                        <td><input name=\"\" type=\"text\" (keyup)=\"calculateAmount(i, 'rate')\" placeholder=\"Rate\" formControlName=\"rate\" class=\"form-control\"></td>\n                        <td><input name=\"\" type=\"text\" [readonly]=\"true\" placeholder=\"Value\" formControlName=\"totalValue\" class=\"form-control\"></td>\n                        <td>\n                            <button class=\"btn-link\" (click)=\"addTransactionItem(transfers.controls[i])\" *ngIf=\"last\">\n                <i class=\"fa fa-plus add_row\"></i>\n              </button>\n                            <button class=\"btn-link\" (click)=\"deleteTransactionItem(i)\" *ngIf=\"!last\">\n                <i class=\"fa fa-times dlet\"></i>\n              </button>\n                        </td>\n                    </ng-container>\n                </tr>\n\n            </table>\n\n\n            <ng-container *ngIf=\"mode === 'receiver'\">\n                <div class=\"row\">\n\n                    <div class=\"mrT1 pdL pdR\">\n                        <div class=\"col-xs-12\">\n                            <div class=\"checkbox\">\n                                <label class=\"\" for=\"isManufactured\">\n                  <input type=\"checkbox\" formControlName=\"isManufactured\" id=\"isManufactured\" name=\"isManufactured\"> Is\n                  it\n                  a\n                  finished stock? (Manufacturing/Combo)</label>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <section class=\"col-xs-12\" *ngIf=\"form.value.isManufactured\">\n                        <div class=\"\">\n                            <h1 class=\"section_head bdrB\"><strong>{{form.controls['stock'].value}} (Made with)</strong></h1>\n\n                            <div formGroupName=\"manufacturingDetails\">\n\n                                <div class=\"row\" style=\"padding-top: 5px\">\n                                    <div class=\"col-xs-4\">\n                                        <label class=\"fs14\">Output Qty <sup>*</sup></label>\n                                    </div>\n                                    <div class=\"col-xs-5\">\n                                        <label class=\"fs14\">Stock Unit <sup>*</sup></label>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4 form-group\">\n                                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"manufacturingQuantity\" placeholder=\"Quantity\" formControlName=\"manufacturingQuantity\" />\n                                    </div>\n\n                                    <div class=\"col-xs-5 form-group\">\n                                        <sh-select [options]=\"stockUnitsOptions\" formControlName=\"manufacturingUnitCode\" [placeholder]=\"'Select Unit'\" [multiple]=\"false\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                                    </div>\n\n                                    <div class=\"col-xs-3\" style=\"display: flex;align-items: center;height: 30px\" *ngIf=\"manufacturingDetails.controls['manufacturingQuantity'].value\">\n                                        <label>&nbsp;</label>\n                                        <span class=\"d-block\"><strong>= ( {{manufacturingDetails.controls['manufacturingQuantity'].value}} {{manufacturingDetails.controls['manufacturingUnitCode'].value}} {{stock.value}}\n                      )</strong></span>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4\">\n                                        <strong>Input Stock Name</strong>\n                                    </div>\n                                    <div class=\"col-xs-3\">\n                                        <strong>Stock Qty</strong>\n                                    </div>\n                                    <div class=\"col-xs-4\">\n                                        <strong>Stock Unit</strong>\n                                    </div>\n                                </div>\n\n                                <ng-container formArrayName=\"linkedStocks\">\n                                    <div class=\"row\" *ngFor=\"let list of manufacturingDetails['controls']['linkedStocks'].controls;let i = index; let l = last\" [formGroupName]=\"i\">\n\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockListOptions\" formControlName=\"stockUniqueName\" [multiple]=\"false\" [placeholder]=\"'Select Stock Name'\" [ItemHeight]=\"33\" (selected)=\"findAddedStock($event?.value, i)\"></sh-select>\n                                        </div>\n                                        <div class=\"col-xs-3 form-group\">\n                                            <input type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"quantity\" placeholder=\"Enter Quantity\" class=\"form-control\" />\n                                        </div>\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockUnitsOptions\" formControlName=\"stockUnitCode\" [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"></sh-select>\n                                        </div>\n                                        <div class=\"pull-right mrT unit_add\">\n                                            <button class=\"btn-link\" (click)=\"addItemInLinkedStocks(list, i, i)\" *ngIf=\"l\" [disabled]=\"disableStockButton\"><i class=\"fa fa-plus add_row\"></i></button>\n                                            <button class=\"btn-link\" (click)=\"removeItemInLinkedStocks(i)\" *ngIf=\"!l\"><i\n                        class=\"fa fa-times dlet\"></i></button>\n                                        </div>\n\n\n                                    </div>\n                                </ng-container>\n\n                            </div>\n                        </div>\n                    </section>\n\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-lg-12 form-group\">\n                        <label>Description</label>\n                        <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n                    </div>\n                </div>\n            </ng-container>\n\n            <div class=\"row\">\n                <div class=\"col-xs-12 text-left mrT1\">\n                    <p *ngIf=\"errorMessage\" class=\"mrB1 text-danger\">{{errorMessage}}</p>\n                    <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n                    <button class=\"btn btn-success\" [ladda]=\"isLoading\" (click)=\"save()\">Save</button>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.scss ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".pad-10-5 {\n  padding: 10px 5px; }\n\n.entry-table td {\n  padding-right: 5px;\n  padding-bottom: 5px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: BranchTransferNoteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchTransferNoteComponent", function() { return BranchTransferNoteComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/helpers */ "./src/app/shared/helpers/index.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");












var BranchTransferNoteComponent = /** @class */ (function () {
    function BranchTransferNoteComponent(_fb, _toasty, _inventoryService, _zone, _store) {
        this._fb = _fb;
        this._toasty = _toasty;
        this._inventoryService = _inventoryService;
        this._zone = _zone;
        this._store = _store;
        this.onCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSave = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { dateInputFormat: 'DD-MM-YYYY' };
        this.mode = 'product';
        this.today = new Date();
        this.editLinkedStockIdx = null;
        this.editModeForLinkedStokes = false;
        this.disableStockButton = false;
        this.InventoryEntryValue = {};
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__["ReplaySubject"](1);
        this.initializeForm(true);
        this.entrySuccess$ = this._store.select(function (s) { return s.inventoryInOutState.entrySuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_9__["takeUntil"])(this.destroyed$));
    }
    Object.defineProperty(BranchTransferNoteComponent.prototype, "transferDate", {
        get: function () {
            return this.form.get('transferDate');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "inventoryUser", {
        get: function () {
            return this.form.get('inventoryUser');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "inventorySource", {
        get: function () {
            return this.form.get('inventorySource');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "inventoryDestination", {
        get: function () {
            return this.form.get('inventoryDestination');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "stock", {
        get: function () {
            return this.form.get('stock');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "transfers", {
        get: function () {
            return this.form.get('transfers');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "manufacturingDetails", {
        get: function () {
            return this.form.get('manufacturingDetails');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BranchTransferNoteComponent.prototype, "isManufactured", {
        get: function () {
            return this.form.get('isManufactured');
        },
        enumerable: true,
        configurable: true
    });
    BranchTransferNoteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.InventoryEntryValue.transactions = [];
        this.InventoryEntryValue.source = {
            uniqueName: null,
            entity: null
        };
        this.InventoryEntryValue.destination = {
            uniqueName: null,
            entity: null
        };
        this.InventoryEntryValue.product = {
            uniqueName: null,
            entity: null
        };
        this.manufacturingDetails.disable();
        this.isManufactured.valueChanges.subscribe(function (val) {
            _this.manufacturingDetails.reset();
            val ? _this.manufacturingDetails.enable() : _this.manufacturingDetails.disable();
        });
        this.entrySuccess$.subscribe(function (s) {
            if (s) {
                _this.modeChanged(_this.mode);
            }
        });
    };
    BranchTransferNoteComponent.prototype.ngAfterViewInit = function () {
        this.setSource();
    };
    BranchTransferNoteComponent.prototype.setSource = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.currentCompany.uniqueName) {
                _this.InventoryEntryValue.source.uniqueName = _this.currentCompany.uniqueName;
                _this.InventoryEntryValue.source.entity = 'company';
                _this.inventorySource.patchValue(_this.currentCompany.uniqueName);
            }
        });
    };
    BranchTransferNoteComponent.prototype.initializeForm = function (initialRequest) {
        if (initialRequest === void 0) { initialRequest = false; }
        this.form = this._fb.group({
            transferDate: [moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            transfers: this._fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required),
            description: [''],
            inventoryUser: [],
            inventoryDestination: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            inventorySource: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
            stock: [],
            entityDetails: [],
            isManufactured: [false],
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
                manufacturingUnitCode: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['',],
                linkedStockUnitCode: [''],
            }, { validator: _shared_helpers__WEBPACK_IMPORTED_MODULE_4__["stockManufacturingDetailsValidator"] })
        });
        if (initialRequest) {
            this.addTransactionItem();
        }
    };
    BranchTransferNoteComponent.prototype.initialIManufacturingDetails = function () {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['',]
        });
    };
    BranchTransferNoteComponent.prototype.modeChanged = function (mode) {
        if (this.mode === mode) {
            return;
        }
        this.mode = mode;
        this.form.reset();
        this.transferDate.patchValue(moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'));
        this.transfers.controls = this.transfers.controls.filter(function (trx) { return false; });
        this.setSource();
        if (this.mode === 'receiver') {
            this.inventorySource.clearValidators();
            this.stock.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.inventoryUser.clearValidators();
            this.inventoryUser.updateValueAndValidity();
            this.inventoryDestination.clearValidators();
            this.inventoryDestination.updateValueAndValidity();
        }
        else {
            this.inventoryDestination.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.inventorySource.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
            this.stock.clearValidators();
            this.stock.updateValueAndValidity();
        }
        this.addTransactionItem();
    };
    BranchTransferNoteComponent.prototype.ngOnChanges = function (changes) {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(function (p) { return ({ label: p.name + " (" + p.code + ")", value: p.code }); });
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
        if (changes.branchList && this.branchList) {
            this.branchListOptions = this.branchList.map(function (p) { return ({ label: p.name, value: p.uniqueName }); });
        }
    };
    BranchTransferNoteComponent.prototype.addTransactionItem = function (control) {
        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            this.errorMessage = "Please fill all (*)mandatory fields";
            this.hideMessage();
            return;
        }
        var items = this.transfers;
        var value = items.length > 0 ? items.at(0).value : {
            quantity: '',
            rate: '',
            totalValue: '',
            inventoryUser: '',
            entityDetails: '',
            stock: '',
            stockUnit: '',
        };
        var transaction = this._fb.group({
            quantity: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            totalValue: [''],
            rate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'receiver' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            stock: [this.mode === 'receiver' ? value.stock : '', this.mode === 'product' ? [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required] : []],
            entityDetails: [],
            stockUnit: [this.mode === 'receiver' ? value.stockUnit : '', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        transaction.updateValueAndValidity();
        items.push(transaction);
    };
    BranchTransferNoteComponent.prototype.deleteTransactionItem = function (index) {
        var items = this.form.get('transfers');
        items.removeAt(index);
    };
    BranchTransferNoteComponent.prototype.userChanged = function (option, index, type) {
        var items = this.form.get('transfers');
        if (type === 'source') {
            this.InventoryEntryValue.source.uniqueName = option.value;
            this.InventoryEntryValue.source.entity = 'company';
        }
        if (type === 'destination') {
            this.InventoryEntryValue.destination.uniqueName = option.value;
            this.InventoryEntryValue.destination.entity = 'company';
        }
        if (this.InventoryEntryValue.source.uniqueName === this.InventoryEntryValue.destination.uniqueName) {
            this._toasty.errorToast('Source and Destination can\'t be same!');
            this.shDestination.clear();
            return;
        }
        if (this.mode === 'receiver' && type !== 'source') {
            var stockItem = this.branchListOptions.find(function (p) { return p.value === option.value; });
            var entityDetails_1 = {
                uniqueName: stockItem ? stockItem.value : null,
                entity: this.mode === 'receiver' ? 'company' : 'stock'
            };
            if (index) {
                var control = items.at(index);
                control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { entityDetails: entityDetails_1 }));
                control.get('stockUnit').patchValue(this.stockUnitCode);
            }
            else {
                items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { entityDetails: entityDetails_1 })); });
            }
        }
        else {
            if (index) {
                var control = items.at(index);
                control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value));
            }
            else {
                items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value)); });
            }
        }
    };
    BranchTransferNoteComponent.prototype.stockChanged = function (option, index, type) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var items, stockItem, stock, stockUnit, entityDetails, stockDetails, mfd_1, e_1, control;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.transfers;
                        stockItem = this.stockList.find(function (p) { return p.uniqueName === option.value; });
                        stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
                        stockUnit = stockItem ? stockItem.stockUnit.code : null;
                        entityDetails = {
                            uniqueName: stockItem ? stockItem.uniqueName : null,
                            entity: this.mode === 'receiver' ? 'company' : 'stock'
                        };
                        if (!(stockItem && this.mode === 'receiver')) return [3 /*break*/, 4];
                        if (type) {
                            this.InventoryEntryValue.product.uniqueName = option.value;
                            this.InventoryEntryValue.product.entity = type;
                            this.stockUnitCode = stockUnit;
                        }
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
                        if (index || index === 0) {
                            control = items.at(index);
                            control.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, control.value, { entityDetails: entityDetails }));
                            control.get('stockUnit').patchValue(stockUnit);
                        }
                        else {
                            items.controls.forEach(function (c) { return c.patchValue(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, c.value, { entityDetails: entityDetails })); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * findAddedStock
     */
    BranchTransferNoteComponent.prototype.findAddedStock = function (uniqueName, i) {
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
    BranchTransferNoteComponent.prototype.calculateAmount = function (index, type) {
        var items = this.transfers;
        var control = items.at(index);
        if (type === 'qty' && control.value.quantity) {
            control.get('quantity').patchValue(this.removeExtraChar(control.value.quantity));
        }
        if (type === 'rate' && control.value.rate) {
            control.get('rate').patchValue(this.removeExtraChar(control.value.rate));
        }
        if (control.value && control.value.quantity && control.value.rate) {
            control.get('totalValue').patchValue((parseFloat(control.value.quantity) * parseFloat(control.value.rate)).toFixed(2));
        }
    };
    BranchTransferNoteComponent.prototype.removeExtraChar = function (val) {
        return val.replace(/[^0-9.]/g, "");
    };
    BranchTransferNoteComponent.prototype.addItemInLinkedStocks = function (item, i, lastIdx) {
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
    BranchTransferNoteComponent.prototype.removeItemInLinkedStocks = function (i) {
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
    BranchTransferNoteComponent.prototype.validateLinkedStock = function (item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    };
    BranchTransferNoteComponent.prototype.hideMessage = function () {
        var _this = this;
        setTimeout(function () {
            _this.errorMessage = null;
        }, 2000);
    };
    BranchTransferNoteComponent.prototype.save = function () {
        var _this = this;
        if (this.form.invalid) {
            this.errorMessage = "Please fill all (*)mandatory fields";
            this.hideMessage();
        }
        if (this.form.valid) {
            var rawValues = this.transfers.getRawValue();
            rawValues.map(function (rv) {
                rv.stockUnit = rv.stockUnit;
                delete rv.inventoryUser;
                delete rv.stock;
                return rv;
            });
            if (this.mode === 'receiver') {
                this.InventoryEntryValue.transferProducts = false;
            }
            else {
                this.InventoryEntryValue.transferProducts = true;
            }
            this.InventoryEntryValue.transferDate = moment__WEBPACK_IMPORTED_MODULE_3__(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');
            this.InventoryEntryValue.description = this.description.value;
            this.InventoryEntryValue.transfers = rawValues;
            if (this.mode === 'receiver') {
                this.InventoryEntryValue.transfers = this.InventoryEntryValue.transfers.map(function (trx) {
                    var linkedStocks = _this.removeBlankLinkedStock(_this.manufacturingDetails.controls.linkedStocks);
                    trx.manufacturingDetails = {
                        manufacturingQuantity: _this.manufacturingDetails.value.manufacturingQuantity,
                        manufacturingUnitCode: _this.manufacturingDetails.value.manufacturingUnitCode,
                        linkedStocks: linkedStocks.map(function (l) { return l; }),
                    };
                    return trx;
                });
                this.InventoryEntryValue.isManufactured = this.isManufactured.value;
            }
            console.log("this.InventoryEntryValue", this.InventoryEntryValue);
            this.onSave.emit(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.InventoryEntryValue));
        }
    };
    BranchTransferNoteComponent.prototype.getStockDetails = function (stockItem) {
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
    BranchTransferNoteComponent.prototype.removeBlankLinkedStock = function (linkedStocks) {
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
    ], BranchTransferNoteComponent.prototype, "onCancel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BranchTransferNoteComponent.prototype, "onSave", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BranchTransferNoteComponent.prototype, "stockList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BranchTransferNoteComponent.prototype, "stockUnits", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BranchTransferNoteComponent.prototype, "userList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BranchTransferNoteComponent.prototype, "branchList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], BranchTransferNoteComponent.prototype, "isLoading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Company__WEBPACK_IMPORTED_MODULE_7__["CompanyResponse"])
    ], BranchTransferNoteComponent.prototype, "currentCompany", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('shDestination'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_11__["ShSelectComponent"])
    ], BranchTransferNoteComponent.prototype, "shDestination", void 0);
    BranchTransferNoteComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'branch-transfer-note',
            template: __webpack_require__(/*! ./branch-transfer-note.component.html */ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.html"),
            styles: [__webpack_require__(/*! ./branch-transfer-note.component.scss */ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__["InventoryService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _ngrx_store__WEBPACK_IMPORTED_MODULE_10__["Store"]])
    ], BranchTransferNoteComponent);
    return BranchTransferNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.html":
/*!**************************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <h2 class=\"\">Create Account</h2>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" autocomplete=\"off\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6\">\n          <label>Name</label>\n          <input type=\"text\" formControlName=\"name\" class=\"form-control\"/>\n        </div>\n\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n      <!-- <div class=\"row\">\n  <div class=\"col-lg-3 form-group mrR1\">\n    <label class=\"d-block\">&nbsp;</label>\n    <button class=\"btn btn-sm\" (click)=\"onCancel.emit($event)\">Cancel</button>\n  </div>\n\n  <div class=\"col-lg-3 form-group mrR1\">\n    <label class=\"d-block\">&nbsp;</label>\n    <button class=\"btn btn-success btn-sm\" [ladda]=\"isLoading\" (click)=\"save()\">Save</button>\n  </div>\n</div> -->\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.ts ***!
  \************************************************************************************************/
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
            selector: 'transfer-inventory-user',
            template: __webpack_require__(/*! ./transfer-inventory-user.component.html */ "./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.html"),
            styles: ["\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], InventoryUserComponent);
    return InventoryUserComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/forms/inward-note/inward-note.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/inventory/components/forms/inward-note/inward-note.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n    <div>\n        <h3 class=\"\">\n            <span>Inward Note</span>\n            <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'sender' }\"\n         (click)=\"modeChanged('sender')\">Senders</a>\n      /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n        </h3>\n\n    </div>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n    <div class=\"form_bg clearfix\">\n        <form [formGroup]=\"form\" class=\"form-group\">\n            <div class=\"row\">\n                <div class=\"col-xs-6 form-group\">\n                    <label>Date <sup>*</sup></label>\n                    <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\" class=\"form-control\" bsDatepicker [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n                    <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n                </div>\n\n                <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'sender'\">\n                    <label>Product Name <sup>*</sup></label>\n                    <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" [disabled]=\"stock.disabled\" formControlName=\"stock\" (selected)=\"stockChanged($event)\"></sh-select>\n                    <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n                </div>\n\n                <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'product'\">\n                    <label>Sender <sup>*</sup></label>\n                    <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Sender'\" formControlName=\"inventoryUser\" (selected)=\"userChanged($event)\"></sh-select>\n                    <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Sender.</span>\n                    </span> -->\n                </div>\n\n            </div>\n\n            <div class=\"row\">\n                <div class=\"col-xs-4\" *ngIf=\"mode === 'sender'\">\n                    <label class=\"fs14\">Sender <sup>*</sup></label>\n                </div>\n                <div class=\"col-xs-4\" *ngIf=\"mode === 'product'\">\n                    <label class=\"fs14\">Product Name <sup>*</sup></label>\n                </div>\n\n                <div class=\"col-xs-4\">\n                    <label class=\"fs14\">Unit<sup>*</sup></label>\n                </div>\n\n                <div class=\"col-xs-4\">\n                    <label class=\"fs14\">Quantity <sup>*</sup></label>\n                </div>\n            </div>\n\n\n            <div class=\"row\" formArrayName=\"transactions\" *ngFor=\"let item of transactions.controls; let i = index;let first = first;let last = last\">\n                <div [formGroupName]=\"i\">\n\n                    <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'sender'\">\n                        <!-- <label class=\"mrB1\">Sender</label> -->\n                        <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Sender'\" (selected)=\"userChanged($event,i)\" formControlName=\"inventoryUser\" [ItemHeight]=\"'33'\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('inventoryUser')?.errors?.required\"\n                  class=\"text-danger\">Please select Sender.</span> -->\n                    </div>\n                    <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'product'\">\n                        <!-- <label class=\"mrB1\">Product Name</label> -->\n                        <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\" (selected)=\"stockChanged($event,i)\" [ItemHeight]=\"'33'\" formControlName=\"stock\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('stock')?.errors?.required\" class=\"text-danger\">Please select Product.</span> -->\n                    </div>\n\n                    <div class=\"col-xs-4 form-group\">\n                        <sh-select [options]=\"stockUnitsOptions\" [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\" [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n                        <!-- <span [hidden]=\"!item.get('stockUnit')?.errors?.required\" class=\"text-danger\">Please select Unit.</span> -->\n                    </div>\n\n                    <div class=\"col-xs-4 form-group\">\n                        <!-- <label class=\"mrB1\">Quantity</label> -->\n                        <div class=\"row\">\n                            <div class=\"col-xs-10\">\n                                <input name=\"\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n                            </div>\n\n\n                            <div class=\"pull-right mrT unit_add\">\n                                <button class=\"btn-link\" (click)=\"addTransactionItem(transactions.controls[i])\" *ngIf=\"last\">\n                  <i class=\"fa fa-plus add_row\"></i>\n                </button>\n                                <button class=\"btn-link\" (click)=\"deleteTransactionItem(i)\" *ngIf=\"!last\">\n                  <i class=\"fa fa-times dlet\"></i>\n                </button>\n                            </div>\n                        </div>\n                        <!-- <span [hidden]=\"!item.get('quantity')?.errors?.required\" class=\"text-danger\">Please enter quantity.</span> -->\n                    </div>\n\n                </div>\n            </div>\n\n            <ng-container *ngIf=\"mode === 'sender'\">\n                <div class=\"row\">\n\n                    <div class=\"mrT1 pdL pdR\">\n                        <div class=\"col-xs-12\">\n                            <div class=\"checkbox\">\n                                <label class=\"\" for=\"isManufactured\">\n                  <input type=\"checkbox\" formControlName=\"isManufactured\" id=\"isManufactured\" name=\"isManufactured\"> Is\n                  it\n                  a\n                  finished stock? (Manufacturing/Combo)</label>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <section class=\"col-xs-12\" *ngIf=\"form.value.isManufactured\">\n                        <div class=\"\">\n                            <h1 class=\"section_head bdrB\"><strong>{{form.controls['stock'].value}} (Made with)</strong></h1>\n\n                            <div formGroupName=\"manufacturingDetails\">\n\n                                <div class=\"row\" style=\"padding-top: 5px\">\n                                    <div class=\"col-xs-4\">\n                                        <label class=\"fs14\">Output Qty <sup>*</sup></label>\n                                    </div>\n                                    <div class=\"col-xs-5\">\n                                        <label class=\"fs14\">Stock Unit <sup>*</sup></label>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4 form-group\">\n                                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"manufacturingQuantity\" placeholder=\"Quantity\" formControlName=\"manufacturingQuantity\" />\n                                    </div>\n\n                                    <div class=\"col-xs-5 form-group\">\n                                        <sh-select [options]=\"stockUnitsOptions\" formControlName=\"manufacturingUnitCode\" [placeholder]=\"'Select Unit'\" [multiple]=\"false\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                                    </div>\n\n                                    <div class=\"col-xs-3\" style=\"display: flex;align-items: center;height: 30px\" *ngIf=\"manufacturingDetails.controls['manufacturingQuantity'].value\">\n                                        <label>&nbsp;</label>\n                                        <span class=\"d-block\"><strong>= ( {{manufacturingDetails.controls['manufacturingQuantity'].value}} {{manufacturingDetails.controls['manufacturingUnitCode'].value}} {{stock.value}} )</strong></span>\n                                    </div>\n                                </div>\n\n                                <div class=\"row\">\n                                    <div class=\"col-xs-4\">\n                                        <strong>Input Stock Name</strong>\n                                    </div>\n                                    <div class=\"col-xs-3\">\n                                        <strong>Stock Qty</strong>\n                                    </div>\n                                    <div class=\"col-xs-4\">\n                                        <strong>Stock Unit</strong>\n                                    </div>\n                                </div>\n\n                                <ng-container formArrayName=\"linkedStocks\">\n                                    <div class=\"row\" *ngFor=\"let list of manufacturingDetails['controls']['linkedStocks'].controls;let i = index; let l = last\" [formGroupName]=\"i\">\n\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockListOptions\" formControlName=\"stockUniqueName\" [multiple]=\"false\" [placeholder]=\"'Select Stock Name'\" [ItemHeight]=\"33\" (selected)=\"findAddedStock($event?.value, i)\"></sh-select>\n                                        </div>\n                                        <div class=\"col-xs-3 form-group\">\n                                            <input type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [DecimalPlaces]=\"4\" name=\"quantity\" placeholder=\"Enter Quantity\" class=\"form-control\" />\n                                        </div>\n                                        <div class=\"col-xs-4 form-group\">\n                                            <sh-select [options]=\"stockUnitsOptions\" formControlName=\"stockUnitCode\" [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"></sh-select>\n                                        </div>\n                                        <div class=\"pull-right mrT unit_add\">\n                                            <button class=\"btn-link\" (click)=\"addItemInLinkedStocks(list, i, i)\" *ngIf=\"l\" [disabled]=\"disableStockButton\"><i class=\"fa fa-plus add_row\"></i></button>\n                                            <button class=\"btn-link\" (click)=\"removeItemInLinkedStocks(i)\" *ngIf=\"!l\"><i\n                        class=\"fa fa-times dlet\"></i></button>\n                                        </div>\n\n\n                                    </div>\n                                </ng-container>\n\n                            </div>\n                        </div>\n                    </section>\n\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-lg-12 form-group\">\n                        <label>Description</label>\n                        <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n                    </div>\n                </div>\n            </ng-container>\n\n            <div class=\"row\">\n                <div class=\"col-xs-12 text-left mrT1\">\n                    <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n                    <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/inventory/components/forms/inward-note/inward-note.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/inventory/components/forms/inward-note/inward-note.component.ts ***!
  \*********************************************************************************/
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
            selector: 'transfer-inward-note',
            template: __webpack_require__(/*! ./inward-note.component.html */ "./src/app/inventory/components/forms/inward-note/inward-note.component.html"),
            styles: ["\n    .pad-10-5 {\n      padding: 10px 5px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__["InventoryService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]])
    ], InwardNoteComponent);
    return InwardNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/forms/outward-note/outward-note.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/outward-note/outward-note.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <div>\n    <h3 class=\"\">\n      <span>Outward Note</span>\n      <span class=\"pull-right fs14\">Multiple\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'receiver' }\"\n         (click)=\"modeChanged('receiver')\">Receivers</a>\n      /\n      <a href=\"javascript:void(0)\" [ngClass]=\"{'text-link': mode === 'product' }\"\n         (click)=\"modeChanged('product')\">Products</a>\n      </span>\n    </h3>\n\n  </div>\n</div>\n\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Date <sup>*</sup></label>\n          <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\"\n                 class=\"form-control\" bsDatepicker [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\"/>\n          <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n        </div>\n\n        <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'receiver'\">\n          <label class=\"mrB1\">Product Name <sup>*</sup></label>\n          <sh-select [options]=\"stockListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Product'\"\n                     formControlName=\"stock\"\n                     (selected)=\"stockChanged($event)\"></sh-select>\n          <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\" *ngIf=\"mode === 'product'\">\n          <label class=\"mrB1\">Receiver <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Receiver'\"\n                     formControlName=\"inventoryUser\"\n                     (selected)=\"userChanged($event)\"></sh-select>\n          <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Receiver.</span>\n                    </span> -->\n        </div>\n\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-4\" *ngIf=\"mode === 'receiver'\">\n          <label class=\"fs14\">Receiver <sup>*</sup></label>\n        </div>\n        <div class=\"col-xs-4\" *ngIf=\"mode === 'product'\">\n          <label class=\"fs14\">Product Name <sup>*</sup></label>\n        </div>\n\n        <div class=\"col-xs-4\">\n          <label class=\"fs14\">Unit<sup>*</sup></label>\n        </div>\n\n        <div class=\"col-xs-4\">\n          <label class=\"fs14\">Quantity <sup>*</sup></label>\n        </div>\n      </div>\n\n      <div class=\"row\" formArrayName=\"transactions\"\n           *ngFor=\"let item of transactions.controls; let i = index;let first = first;let last = last\">\n        <div [formGroupName]=\"i\">\n\n          <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'receiver'\">\n            <!-- <label class=\"mrB1\">Receiver</label> -->\n            <sh-select [options]=\"userListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Receiver'\"\n                       (selected)=\"userChanged($event,i)\" formControlName=\"inventoryUser\"\n                       [ItemHeight]=\"'33'\"></sh-select>\n            <!-- <span [hidden]=\"!item.controls['inventoryUser'].errors?.required\"\n                  class=\"text-danger\">Please select Receiver.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\" *ngIf=\"mode === 'product'\">\n            <!-- <label class=\"mrB1\">Product Name</label> -->\n            <sh-select [options]=\"stockListOptions\" [multiple]=\"false\" [placeholder]=\"'Select Product'\"\n                       (selected)=\"stockChanged($event,i)\" [ItemHeight]=\"'33'\" formControlName=\"stock\"></sh-select>\n            <!-- <span [hidden]=\"!item.controls['stock'].errors?.required\"\n                  class=\"text-danger\">Please select Product.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\">\n            <sh-select [options]=\"stockUnitsOptions\"\n                       [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\"\n                       [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n            <!-- <span [hidden]=\"!item.get('stockUnit')?.errors?.required\" class=\"text-danger\">Please select Unit.</span> -->\n          </div>\n\n          <div class=\"col-xs-4 form-group\">\n            <!-- <label class=\"mrB1\">Quantity</label> -->\n\n            <div class=\"row\">\n              <div class=\"col-xs-10\">\n                <input name=\"\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n              </div>\n\n\n              <div class=\"pull-right mrT unit_add\">\n                <button class=\"btn-link\" (click)=\"addTransactionItem(transactions.controls[i])\" *ngIf=\"last\">\n                  <i class=\"fa fa-plus add_row\"></i>\n                </button>\n                <button class=\"btn-link\" (click)=\"deleteTransactionItem(i)\" *ngIf=\"!last\">\n                  <i class=\"fa fa-times dlet\"></i>\n                </button>\n              </div>\n            </div>\n            <!-- <span [hidden]=\"!item.controls['quantity'].errors?.required\"\n                  class=\"text-danger\">Please enter quantity.</span> -->\n            <!--\n<div class=\"input-group\">\n  <input name=\"dateRange\" type=\"text\" formControlName=\"quantity\" class=\"form-control\">\n  <span [hidden]=\"!item.controls['quantity'].errors?.required\" class=\"text-danger\">Please enter quantity.</span>\n</div> -->\n          </div>\n          <!-- <div class=\"col-lg-2 form-group pdT2\">\n  <a (click)=\"addTransactionItem()\">\n    <i class=\"fa fa-plus\" *ngIf=\"first || !last\"></i>\n  </a>\n  <a (click)=\"deleteTransactionItem(i)\">\n    <i class=\"fa fa-close\" *ngIf=\"!first && last\"></i>\n  </a>\n</div> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-lg-12 form-group\">\n          <label>Description</label>\n          <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea>\n          <!-- <div class=\"input-group\">\n  <input name=\"dateRange\" formControlName=\"description\" type=\"text\" class=\"form-control\">\n</div> -->\n        </div>\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/forms/outward-note/outward-note.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/inventory/components/forms/outward-note/outward-note.component.ts ***!
  \***********************************************************************************/
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
            selector: 'transfer-outward-note',
            template: __webpack_require__(/*! ./outward-note.component.html */ "./src/app/inventory/components/forms/outward-note/outward-note.component.html"),
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], OutwardNoteComponent);
    return OutwardNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/forms/transfer-note/transfer-note.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/transfer-note/transfer-note.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"form_header\">\n  <h2 class=\"\">Transfer Note</h2>\n</div>\n<div class=\"form_body witBg clearfix mrBChldLbl\">\n  <div class=\"form_bg clearfix\">\n    <form [formGroup]=\"form\" class=\"form-group\">\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Date <sup>*</sup></label>\n          <input name=\"dateRange\" formControlName=\"inventoryEntryDate\" type=\"text\" autocomplete=\"off\"\n                 class=\"form-control\" bsDatepicker [bsConfig]=\" {dateInputFormat: 'DD-MM-YYYY'}\">\n          <span *ngIf=\"inventoryEntryDate.invalid && (inventoryEntryDate.dirty || inventoryEntryDate.touched)\">\n              <span *ngIf=\"inventoryEntryDate?.errors && inventoryEntryDate?.errors['required']\" class=\"text-danger\">Please select Date.</span>\n                    </span>\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Product Name <sup>*</sup></label>\n          <sh-select [options]=\"stockListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Product'\"\n                     (selected)=\"stockChanged($event)\"\n                     [ItemHeight]=\"'33'\"\n                     formControlName=\"stock\"></sh-select>\n          <!-- <span *ngIf=\"stock.invalid\">\n              <span *ngIf=\"stock?.errors && stock?.errors['required']\" class=\"text-danger\">Please select Product.</span>\n                    </span> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Sender's Name <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Sender'\"\n                     formControlName=\"inventoryUser\"\n                     [ItemHeight]=\"'33'\"></sh-select>\n          <!-- <span *ngIf=\"inventoryUser.invalid\">\n              <span *ngIf=\"inventoryUser?.errors && inventoryUser?.errors['required']\"\n                    class=\"text-danger\">Please select Sender.</span>\n                    </span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Receiver's Name <sup>*</sup></label>\n          <sh-select [options]=\"userListOptions\"\n                     [multiple]=\"false\"\n                     [placeholder]=\"'Select Receiver'\"\n                     (selected)=\"recieverUniqueName = $event.value\"\n                     [ItemHeight]=\"'33'\"></sh-select>\n          <!-- <span [hidden]=\"recieverUniqueName\" class=\"text-danger\">Please select Receiver.</span> -->\n        </div>\n      </div>\n\n\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Quantity <sup>*</sup></label>\n          <input name=\"dateRange\" type=\"text\" class=\"form-control\" formControlName=\"quantity\"\n                 [placeholder]=\"'Enter Quantity'\"/>\n          <!-- <span *ngIf=\"quantity?.errors && quantity.errors['required']\"\n                class=\"text-danger\">Please enter quantity.</span> -->\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>Unit <sup>*</sup></label>\n          <sh-select [options]=\"stockUnitsOptions\"\n                     [placeholder]=\"'Choose unit'\" formControlName=\"stockUnit\"\n                     [multiple]=\"false\" [ItemHeight]=\"33\"></sh-select>\n          <!-- <span *ngIf=\"stockUnit?.errors && stockUnit.errors['required']\" class=\"text-danger\">Please select Unit.</span> -->\n        </div>\n\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-lg-8 form-group\">\n          <label class=\"mrB1\">Description</label>\n          <input name=\"dateRange\" formControlName=\"description\" type=\"text\" class=\"form-control\">\n          <!-- <textarea formControlName=\"description\" type=\"text\" class=\"form-control\"></textarea> -->\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 text-left mrT1\">\n          <button class=\"btn btn-default\" (click)=\"onCancel.emit($event)\">Cancel</button>\n          <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"form.invalid\" (click)=\"save()\">Save</button>\n        </div>\n      </div>\n\n\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/forms/transfer-note/transfer-note.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/components/forms/transfer-note/transfer-note.component.ts ***!
  \*************************************************************************************/
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
            selector: 'transfer-notes',
            template: __webpack_require__(/*! ./transfer-note.component.html */ "./src/app/inventory/components/forms/transfer-note/transfer-note.component.html"),
            styles: ["\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], TransferNoteComponent);
    return TransferNoteComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.html":
/*!****************************************************************************************************!*\
  !*** ./src/app/inventory/components/group-stock-report-component/group.stockreport.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"h100\">\n  <div class=\"d-flex mb-2\" style=\"display:none;\">\n    <!-- enable branch selection after implimentation from api-->\n    <div class=\"d-flex\">\n      <div style=\"width: 230px;margin-right: 15px;\">\n        <div class=\"select-style middle\">\n          <sh-select placeholder=\"Select Branch\" name=\"entity\" [(ngModel)]=\"selectedEntity\"\n            (selected)=\"selectEntity($event)\" [options]=\"entities$ | async\" [ItemHeight]=\"33\"></sh-select>\n          <!-- html dropdown <select class=\"form-control\" (change)=\"selectEntity($event.target.value)\">\n            <option value=\"headquarter\">{{(selectedCompany$ | async)?.name}}</option>\n            <option value=\"warehouse\">Warehouse</option>\n            <option *ngFor=\"let entity of entities$ | async\" value=\"{{entity.uniqueName}}\">\n              {{entity.name}}\n            </option>\n            <option value=\"allEntity\">All Entities</option>\n          </select> -->\n        </div>\n      </div>\n      <!-- <div style=\"width: 230px;\">\n        <div class=\"select-style middle\">\n          <select class=\"form-control\" [disabled]=\"isWarehouse\" (change)=\"selectTransactionType($event.target.value)\">\n            <option *ngFor=\"let ttype of transactionTypes\" value=\"{{ttype.uniqueName}}\">\n              {{ttype.name}}\n            </option>\n          </select>\n        </div>\n      </div> -->\n    </div>\n  </div>\n  <div class=\"fb__1-container mrB1\">\n    <div class=\"d-flex\" style=\"justify-content: space-between;width: 100%\">\n      <div class=\"d-flex\" style=\"align-items: center\">\n        <h2 class=\"mr-2\" style=\"font-size: 20px;font-weight: bold; text-transform:capitalize;\" *ngIf=\"groupStockReport\">\n          <span>{{groupStockReport.stockGroupName}}</span> (Group)</h2>\n        <button class=\"btn btn-link btn-link-2\" (click)=\"onOpenAdvanceSearch()\" style=\"padding-left:0px;\">Advance\n          Search</button>\n        <i *ngIf=\"isFilterCorrect\" class=\"fa fa-refresh ml-1 cp\" (click)=\"resetFilter()\"></i>\n      </div>\n      <div class=\"clearfix\">\n\n        <div class=\"btn-group \" dropdown [autoClose]=\"true\" placement=\"bottom right\">\n          <button id=\"button-alignment\" dropdownToggle type=\"button\" class=\"btn-link mrT cp mr-1 dropdown-toggle\"\n            aria-controls=\"dropdown-alignment\">\n            <i class=\"icon-download\"></i> Download\n          </button>\n          <ul id=\"dropdown-alignment\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right dropdown-menu-download\"\n            role=\"menu\" aria-labelledby=\"button-alignment\">\n            <li role=\"menuitem\" (click)=\"downloadAllInventoryReports('group', 'csv')\"><a class=\"dropdown-item\">CSV</a>\n            </li>\n            <li role=\"menuitem\" (click)=\"downloadAllInventoryReports('group', 'xlsx')\"><a class=\"dropdown-item\">XLS</a>\n            </li>\n          </ul>\n        </div>\n        <button class=\"btn btn-blue\" *ngIf=\"branchAvailable\" data-toggle=\"tooltip\" tooltip=\"Alt+P\"\n          (click)=\"toggleTransferAsidePane()\">New Transfer</button>\n        <button class=\"btn btn-blue\" data-toggle=\"tooltip\" tooltip=\"Alt+i\" (click)=\"toggleAsidePane()\">Create\n          New</button>\n      </div>\n    </div>\n  </div>\n\n  <section>\n    <table class=\"table basic table-border inventoryStockTable\"\n      [ngClass]=\"{'mB100': groupStockReport && groupStockReport.stockReport && groupStockReport.stockReport.length>6}\">\n      <thead>\n        <tr>\n          <!-- in case of all entity with group -->\n          <th colspan=\"4\" class=\"bdrR\" width=\"30%\" style=\"padding: 0 !important;\"\n            *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\">\n            <!-- in case of all entity with group -->\n          <th colspan=\"2\" class=\"bdrR\" width=\"17%\" *ngIf=\"GroupStockReportRequest.branchDetails!='allEntity'\">\n            <div class=\"d-flex\">\n              <input type=\"text\" #dateRangePickerCmp name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n                class=\"form-control stock-input\" (applyDaterangepicker)=\"selectedDate($event)\" />\n            </div>\n          </th>\n          <th class=\"text-center bdrR bdrB\" width=\"20%\" colspan=\"2\">Opening stock</th>\n          <th class=\"text-center bdrR bdrB\" width=\"20%\" colspan=\"2\">Inwards</th>\n          <th class=\"text-center bdrR bdrB\" width=\"20%\" colspan=\"2\">Outwards</th>\n          <th class=\"text-center bdrB\" width=\"20%\" colspan=\"2\">Closing Stock</th>\n        </tr>\n        <tr class=\"bdrT\">\n          <th colspan=\"2\" class=\"bdrR td_in_searchBox max-width-140\"\n            (clickOutside)=\"clickedOutside($event,null, 'product')\">\n            <div [hidden]=\"showProductSearch\">\n              <span>Product Name</span>\n              <i class=\"icon-search\" (click)=\"showProductSearchBox()\"></i>\n            </div>\n\n            <div class=\"input-container\" [hidden]=\"!showProductSearch\">\n              <input type=\"text\" placeholder=\"Search Product\" class=\"w100\" #productName\n                [formControl]=\"productUniqueNameInput\" />\n              <i class=\"icon-search\" (click)=\"showProductSearch = false;\"></i>\n            </div>\n          </th>\n          <!-- in case of all entity with group -->\n          <th colspan=\"2\" class=\"bdrR td_in_searchBox max-width-140\"\n            *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\"\n            (clickOutside)=\"clickedOutside($event,null, 'source')\">\n            <div [hidden]=\"showSourceSearch\">\n              <span>Source</span>\n              <i class=\"icon-search\" (click)=\"showSourceSearchBox()\"></i>\n            </div>\n\n            <div class=\"input-container\" [hidden]=\"!showSourceSearch\">\n              <input type=\"text\" placeholder=\"Source\" class=\"w100\" #sourceName [formControl]=\"sourceUniqueNameInput\" />\n              <i class=\"icon-search\" (click)=\"showSourceSearch = false;\"></i>\n            </div>\n          </th>\n          <!-- in case of all entity with group end -->\n          <th class=\"text-right brNone\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Qty</div>\n              <div class=\"icon-pointer\">\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'OPENING_STOCK_QTY'\"\n                  (click)=\"sortButtonClicked('asc', 'OPENING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OPENING_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'OPENING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OPENING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'OPENING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n          <th class=\"text-right\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Value</div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'OPENING_STOCK_VALUE'\"\n                  (click)=\"sortButtonClicked('asc', 'OPENING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OPENING_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'OPENING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OPENING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'OPENING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OPENING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n          <th class=\"text-right brNone\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Qty</div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'INWARDS_STOCK_QTY'\"\n                  (click)=\"sortButtonClicked('asc', 'INWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'INWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'INWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'INWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'INWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n          <th class=\"text-right\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Value</div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'INWARDS_STOCK_VALUE'\"\n                  (click)=\"sortButtonClicked('asc', 'INWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'INWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'INWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'INWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'INWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'INWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n          <th class=\"text-right brNone\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill \">Qty </div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'OUTWARDS_STOCK_QTY'\"\n                  (click)=\"sortButtonClicked('asc', 'OUTWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'OUTWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'OUTWARDS_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n          <th class=\"text-right\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Value</div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'OUTWARDS_STOCK_VALUE'\"\n                  (click)=\"sortButtonClicked('asc', 'OUTWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'OUTWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'OUTWARDS_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'OUTWARDS_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n          <th class=\"text-right brNone\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Qty </div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'CLOSING_STOCK_QTY'\"\n                  (click)=\"sortButtonClicked('asc', 'CLOSING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'CLOSING_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'CLOSING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_QTY' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'CLOSING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'CLOSING_STOCK_QTY')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_QTY' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n          <th class=\"text-right\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Value</div>\n              <div class=\"icon-pointer\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy !== 'CLOSING_STOCK_VALUE'\"\n                  (click)=\"sortButtonClicked('asc', 'CLOSING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'CLOSING_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'CLOSING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_VALUE' && GroupStockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"GroupStockReportRequest.sortBy === 'CLOSING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'CLOSING_STOCK_VALUE')\"\n                  [ngClass]=\"{'activeTextColor': GroupStockReportRequest.sortBy === 'CLOSING_STOCK_VALUE' && GroupStockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n        </tr>\n      </thead>\n      <tbody *ngIf=\"groupStockReport && groupStockReport.count > 0\">\n        <tr *ngFor=\"let txn of groupStockReport.stockReport\">\n          <ng-container *ngIf=\"txn.openingBalance || txn.inwards || txn.outwards || txn.closingBalance\">\n            <td class=\"bdrB bdrR\" colspan=\"2\">{{txn.stockName}}\n              <span class=\"unit-badge pull-right text-light\">{{txn.openingBalance?.stockUnit}}</span>\n            </td>\n            <!-- in case of all entity with group -->\n            <td colspan=\"2\" class=\"bdrB bdrR max-width-140\" *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\">\n              {{txn.stockName}}\n            </td>\n            <!-- in case of all entity with group end -->\n            <td class=\"bdrB bdrR text-right brNone\">\n              <span [ngClass]=\"{'text-danger': txn.openingBalance?.quantity<0 }\">{{txn.openingBalance?.quantity}}</span>\n            </td>\n            <td class=\"bdrB bdrR text-right\">{{txn.openingBalance?.amount}}</td>\n\n            <td class=\"bdrB bdrR text-right brNone\">\n              <span [ngClass]=\"{'text-danger': txn.inwards?.quantity<0 }\">{{txn.inwards?.quantity}}</span>\n            </td>\n            <td class=\"bdrB bdrR text-right\">{{txn.inwards?.amount}}</td>\n\n            <td class=\"bdrB bdrR text-right brNone\">\n              {{txn.outwards?.quantity}}\n            </td>\n            <td class=\"bdrB bdrR text-right\">{{txn.outwards?.amount}}</td>\n\n            <td class=\"bdrB bdrR text-right brNone\">\n              <span [ngClass]=\"{'text-danger': txn.closingBalance?.quantity<0 }\">{{txn.closingBalance?.quantity}}</span>\n            </td>\n            <td class=\"bdrB bdrR text-right\">{{txn.closingBalance?.amount}}</td>\n\n          </ng-container>\n        </tr>\n\n      </tbody>\n\n      <tbody *ngIf=\"!groupStockReport\">\n        <!-- in case of all entity with group -->\n        <tr>\n          <td colspan=\"10\" class=\"text-center empty_table\">\n            <!--loading-->\n            <div class=\"mrT2 d-flex\" style=\"justify-content: center;align-items: center; min-height: 200px;\">\n              <div class=\"giddh-spinner vertical-center-spinner\"></div>\n            </div>\n          </td>\n        </tr>\n      </tbody>\n      <tbody *ngIf=\"groupStockReport && groupStockReport.count < 1\">\n        <tr>\n          <!-- in case of all entity with group -->\n          <td colspan=\"10\" *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\" class=\"text-center empty_table\">\n          <td colspan=\"10\" *ngIf=\"GroupStockReportRequest.branchDetails!='allEntity'\" class=\"text-center empty_table\">\n            <!-- in case of all entity with group -->\n            <img src=\"assets/images/search-data-not-found.svg\" />\n            <h1>No Report Found !!</h1>\n          </td>\n        </tr>\n      </tbody>\n      <tfoot *ngIf=\"groupStockReport && groupStockReport.totalPages > 1\">\n        <tr>\n          <td colspan=\"10\" class=\"text-center\">\n            <pagination [totalItems]=\"groupStockReport.totalPages\" [(ngModel)]=\"groupStockReport.page\" [maxSize]=\"6\"\n              class=\"pagination-sm\" [boundaryLinks]=\"true\" [itemsPerPage]=\"1\" [rotate]=\"false\"\n              (pageChanged)=\"pageChanged($event)\"></pagination>\n          </td>\n        </tr>\n      </tfoot>\n    </table>\n\n\n    <!-- sticky Footer -->\n    <section class=\"mt-5\"\n      *ngIf=\"groupStockReport && groupStockReport.stockReport && groupStockReport.stockReport.length>0\">\n      <!-- <span>{{activeGroupName}} Value:</span> -->\n      <div class=\"sticky-footer stickyFooterSaleAmount\">\n        <div class=\"innerContentFooter\">\n          <div class=\"row\">\n\n            <div class=\"col-sm-2 pr-0\">\n              <div class=\"row\">\n                <div class=\"col-xs-10 p0\">\n                  <h4 class=\"text-light\">\n                    <div *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\">Transaction Count</div>\n                    <div class=\"mt-2\" *ngIf=\"GroupStockReportRequest.branchDetails!=='allEntity'\">Product Count</div>\n                  </h4>\n                </div>\n                <div class=\"col-xs-2 p0\">\n                  <h4 class=\"text-orange text-left\">\n                    <div *ngIf=\"GroupStockReportRequest.branchDetails==='allEntity'\">\n                      <span class=\"text-orange\"\n                        *ngIf=\"groupStockReport.totalItems\">&nbsp;{{groupStockReport.totalItems}}</span>\n                    </div>\n                    <div class=\"mt-2\" *ngIf=\"GroupStockReportRequest.branchDetails!=='allEntity'\">\n                      <span class=\"text-orange\"\n                        *ngIf=\"groupStockReport.totalItems\">&nbsp;{{groupStockReport.totalItems}}</span>\n                    </div>\n                  </h4>\n                </div>\n              </div>\n              <div class=\"row\" *ngIf=\"groupStockReport.openingBalance.transactionCount\">\n                <div class=\"col-xs-10 p0\">\n                  <h4>Inward</h4>\n                </div>\n                <div class=\"col-xs-2 p0\">\n                  <h4>&nbsp;<span>{{groupStockReport.InwardBalance.transactionCount}}</span></h4>\n                </div>\n              </div>\n              <div class=\"row\" *ngIf=\"groupStockReport.outwardBalance.transactionCount\">\n                <div class=\"col-xs-10 p0\">\n                  <h4>Outward</h4>\n                </div>\n                <div class=\"col-xs-2 p0\">\n                  <h4>&nbsp;<span>{{groupStockReport.outwardBalance.transactionCount}}</span></h4>\n                </div>\n              </div>\n            </div>\n            <div class=\"col-sm-10\">\n              <div class=\"flex-col\">\n                <div class=\"cont\">\n                  <h4 class=\"text-light\">Opening Value</h4>\n                  <h2>{{groupStockReport.openingBalance.amount}}</h2>\n                  <h4 *ngIf=\"groupStockReport.openingBalance.quantity\">\n                    ({{groupStockReport.openingBalance.quantity}}\n                    {{groupStockReport.openingBalance.stockUnit}})</h4>\n                </div>\n\n              </div>\n              <div class=\"flex-col\">\n\n              </div>\n              <div class=\"flex-col\">\n                <div class=\"cont\">\n                  <h4 class=\"text-light\">Inward Value</h4>\n                  <h2>{{groupStockReport.inwardBalance.amount}}</h2>\n                  <h4 *ngIf=\"groupStockReport.inwardBalance.quantity\">\n                    ({{groupStockReport.inwardBalance.quantity}}\n                    {{groupStockReport.inwardBalance.stockUnit}})</h4>\n                </div>\n              </div>\n              <div class=\"flex-col\">\n\n              </div>\n              <div class=\"flex-col\">\n                <div class=\"cont\">\n                  <h4 class=\"text-light\">Outward Value</h4>\n                  <h2>{{groupStockReport.outwardBalance.amount}}</h2>\n                  <h4 *ngIf=\"groupStockReport.outwardBalance.quantity\">\n                    ({{groupStockReport.outwardBalance.quantity}}\n                    {{groupStockReport.outwardBalance.stockUnit}})</h4>\n                </div>\n              </div>\n              <div class=\"flex-col\">\n\n              </div>\n              <div class=\"flex-col\">\n                <div class=\"cont\">\n                  <h4 class=\"text-light\">Closing Value</h4>\n                  <h2 class=\"text-orange\">{{groupStockReport.closingBalance.amount}}</h2>\n                  <h4 class=\"text-orange\" *ngIf=\"groupStockReport.closingBalance.quantity\">\n                    ({{groupStockReport.closingBalance.quantity}}\n                    {{groupStockReport.closingBalance.stockUnit}})</h4>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n  </section>\n\n\n</section>\n<!-- aside new stock/group/unit pane -->\n<div class=\"aside-overlay\" *ngIf=\"asidePaneState === 'in'\"></div>\n<aside-pane [class]=\"asidePaneState\" [@slideInOut]=\"asidePaneState\" (closeAsideEvent)=\"toggleAsidePane()\"></aside-pane>\n<!-- aside new stock/group/unit -->\n\n<!-- aside inwards/outwards/transfer pane -->\n<div class=\"aside-overlay\" *ngIf=\"asideTransferPaneState === 'in'\"></div>\n<aside-branch-transfer-pane *ngIf=\"asideTransferPaneState === 'in'\" [class]=\"asideTransferPaneState\"\n  [@slideInOut]=\"asideTransferPaneState\" (closeAsideEvent)=\"toggleTransferAsidePane()\"></aside-branch-transfer-pane>\n<!-- aside inwards/outwards/transfer pane -->\n\n\n<!-- Advance search popup -->\n<div bsModal #advanceSearchModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header themeBg clearfix\">\n        <h3 class=\"modal-title bg\" id=\"modal-title\">Advance Search</h3>\n        <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"advanceSearchAction('cancel')\">×</span>\n      </div>\n      <div class=\"modal-body clearfix\" *ngIf=\"showAdvanceSearchModal\">\n        <form action=\"\" [formGroup]=\"advanceSearchForm\">\n          <div class=\"row\">\n            <div class=\"col-sm-4\">Date Range</div>\n            <div class=\"col-sm-8\">\n              <div class=\"input-group\">\n                <input type=\"text\" name=\"daterangeInput1\" daterangepicker [options]=\"datePickerOptions\"\n                  class=\"form-control\" (applyDaterangepicker)=\"selectedDate($event, 'advance')\" />\n                <div class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar bg-white\"></span></div>\n              </div>\n            </div>\n          </div>\n          <div class=\"row mrT2\">\n            <div class=\"col-sm-4\">Select Category</div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\">\n                <sh-select [options]=\"CategoryOptions\" (onClear)=\"clearShSelect('filterCategory')\" [multiple]=\"false\"\n                  [placeholder]=\"'Select Category'\" #shCategory formControlName=\"filterCategory\"\n                  (selected)=\"onDDElementSelect($event, 'filterCategory')\"></sh-select>\n              </div>\n            </div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\">\n                <sh-select [options]=\"CategoryTypeOptions\" (onClear)=\"clearShSelect('filterCategoryType')\"\n                  [multiple]=\"false\" [placeholder]=\"'Select Type'\" #shCategoryType formControlName=\"filterCategoryType\"\n                  (selected)=\"onDDElementSelect($event, 'filterCategoryType')\"></sh-select>\n              </div>\n            </div>\n          </div>\n          <div class=\"row mrT2\">\n            <div class=\"col-sm-4\">Value</div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\">\n                <sh-select [options]=\"FilterValueCondition\" (onClear)=\"clearShSelect('filterValueCondition')\"\n                  [multiple]=\"false\" [placeholder]=\"'Select Type'\" #shValueCondition\n                  formControlName=\"filterValueCondition\" (selected)=\"onDDElementSelect($event, 'filterValueCondition')\">\n                </sh-select>\n              </div>\n            </div>\n            <div class=\"col-sm-4\">\n              <input type=\"text\" class=\"form-control\" (keyup)=\"mapAdvFilters()\" placeholder=\"Amount\" maxlength=\"16\"\n                formControlName=\"filterAmount\">\n              <small *ngIf=\"advanceSearchForm.controls['filterAmount'].invalid\" class=\"text-danger\">input number\n                only</small>\n            </div>\n          </div>\n\n          <div class=\"row mrT4 mrB3\">\n            <div class=\"col-xs-12 text-right\">\n              <button class=\"btn btn-success\" type=\"button\"\n                [disabled]=\"!isFilterCorrect || !GroupStockReportRequest.condition || !GroupStockReportRequest.entity || !GroupStockReportRequest.value || !GroupStockReportRequest.number\"\n                (click)=\"advanceSearchAction('search')\">Search</button>\n              <button class=\"btn btn-danger\" type=\"button\" (click)=\"advanceSearchAction('clear')\">Clear</button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- Advance  search popup -->\n"

/***/ }),

/***/ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.scss":
/*!****************************************************************************************************!*\
  !*** ./src/app/inventory/components/group-stock-report-component/group.stockreport.component.scss ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".bdrT {\n  border-color: #ccc; }\n\n:host ::ng-deep .fb__1-container {\n  -webkit-box-pack: start;\n          justify-content: flex-start; }\n\n:host ::ng-deep .fb__1-container .form-group {\n  margin-right: 10px;\n  margin-bottom: 0; }\n\n:host ::ng-deep .fb__1-container .date-range-picker {\n  min-width: 150px; }\n\na:hover {\n  text-decoration: none; }\n\n.flex-container {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n          flex-direction: row;\n  -webkit-box-align: start;\n          align-items: flex-start;\n  flex-flow: row wrap; }\n\ntable {\n  table-layout: fixed; }\n\n/* .table.basic tbody tr td {\n    background-color: #fff;\n}\n\n.table.basic .table tbody tr td {\n    border: none;\n} */\n\n.mh18_img img {\n  max-height: 20px;\n  cursor: pointer; }\n\n/*\n.table.basic>tbody>tr>td>table tbody tr td {\n    padding: 5px 0;\n}\n\ntfoot {\n    background: #fff;\n} */\n\n.flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-right: 2px; }\n\n.d-flex {\n  display: -webkit-box;\n  display: flex; }\n\n/*td-in-searchbox_style*/\n\n.max-width-140 {\n  max-width: 140px; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox div span {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-left: 8px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox .input-container {\n  position: relative; }\n\n.td_in_searchBox .input-container input {\n  min-height: 36px;\n  width: 100%;\n  padding: 6px;\n  padding-right: 40px; }\n\n.td_in_searchBox .input-container i {\n  position: absolute;\n  right: 0px;\n  top: 8px; }\n\n.basic > tbody > tr > td,\n.basic > thead > tr > th {\n  padding: 8px; }\n\n.basic > thead > tr > th {\n  border-right: 1px solid #cdcdcd; }\n\n.icon-pointer .glyphicon {\n  cursor: pointer; }\n\n.icon-pointer .glyphicon:hover {\n  color: #ff5f00; }\n\n.td_in_searchBox div i:hover {\n  color: #ff5f00; }\n\n.dropdown-menu > li > a:hover {\n  color: #ff5e01;\n  background: #f4f5f8; }\n\n.stock-input {\n  background-color: transparent !important;\n  border-bottom: 1px dotted black !important;\n  border: none;\n  width: auto;\n  padding: 0 !important;\n  height: auto;\n  text-align: center;\n  min-width: 155px; }\n\n.footer-tr td {\n  background-color: #e5e5e5; }\n\n.total-footer {\n  background-color: white;\n  display: -webkit-box;\n  display: flex; }\n\n.total-footer .footitem {\n    padding: 41px; }\n\n.total-footer .footitem h2 {\n      color: #8f9091;\n      font-size: 20px;\n      margin-bottom: 10px; }\n\n.total-footer .footitem h1 {\n      font-size: 32px; }\n\n.modal-content {\n  border-radius: 0px;\n  margin-top: 200px; }\n\n.btn-download {\n  font-size: 14px; }\n\n.btn-group.open.show {\n  display: inline-block !important; }\n\n.dropdown-menu.dropdown-menu-download {\n  min-width: 110px;\n  border-radius: 0px; }\n\n.dropdown-menu-download li {\n  cursor: pointer; }\n\n.capitalize {\n  text-transform: capitalize; }\n\n.table-border {\n  border: 1px solid #c6c6c6; }\n\n.bdrN {\n  border: none !important; }\n\n.unit-badge {\n  display: inline-block;\n  min-width: 30px;\n  text-align: left;\n  padding-left: 3px;\n  text-transform: lowercase; }\n\n.icon-pointer .fa-long-arrow-up,\n.icon-pointer .fa-long-arrow-down {\n  line-height: 20px;\n  width: 15px;\n  color: #a9a9a9; }\n\n.icon-pointer .activeTextColor {\n  color: #ff5200; }\n\n.stickyFooterSaleAmount .innerContentFooter {\n  padding-left: 0;\n  padding-right: 80px;\n  min-height: 60px; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col {\n    display: -webkit-inline-box;\n    display: inline-flex;\n    -webkit-box-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n            align-items: center;\n    vertical-align: middle; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col:nth-child(odd) {\n    min-width: 105px; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col:nth-child(even) {\n    min-width: 55px; }\n\n.stickyFooterSaleAmount .innerContentFooter .operators {\n    font-size: 39px;\n    color: #8f9091; }\n\n.stickyFooterSaleAmount .innerContentFooter h2 {\n    font-size: 18px;\n    line-height: 20px; }\n\n.stickyFooterSaleAmount .innerContentFooter h3 {\n    font-size: 14px;\n    line-height: 20px; }\n\n.stickyFooterSaleAmount .innerContentFooter h4 {\n    font-size: 14px;\n    line-height: 20px; }\n\n@media only screen and (max-width: 768px) {\n    .stickyFooterSaleAmount .innerContentFooter .flex-col {\n      display: block; }\n      .stickyFooterSaleAmount .innerContentFooter .flex-col .operators {\n        text-align: right; } }\n\n.select-style select {\n  width: 100% !important; }\n\n/*\n.select-style:before{\n  z-index: 1;\n}*/\n\n.text-orange {\n  color: #ff5f00; }\n\n.btn-link-2 {\n  color: #0c8fe6; }\n\n.mB100 {\n  margin-bottom: 100px; }\n\nth.brNone, td.brNone {\n  border-right: none !important; }\n\n.inventoryStockTable td {\n  white-space: inherit; }\n"

/***/ }),

/***/ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.ts":
/*!**************************************************************************************************!*\
  !*** ./src/app/inventory/components/group-stock-report-component/group.stockreport.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: InventoryGroupStockReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryGroupStockReportComponent", function() { return InventoryGroupStockReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/stocks-report.actions */ "./src/app/actions/inventory/stocks-report.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");





















var InventoryGroupStockReportComponent = /** @class */ (function () {
    function InventoryGroupStockReportComponent(store, route, sideBarAction, stockReportActions, router, inventoryService, fb, _toasty, inventoryAction, settingsBranchActions, invViewService, cdr) {
        var _this = this;
        this.store = store;
        this.route = route;
        this.sideBarAction = sideBarAction;
        this.stockReportActions = stockReportActions;
        this.router = router;
        this.inventoryService = inventoryService;
        this.fb = fb;
        this._toasty = _toasty;
        this.inventoryAction = inventoryAction;
        this.settingsBranchActions = settingsBranchActions;
        this.invViewService = invViewService;
        this.cdr = cdr;
        this.today = new Date();
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_12__;
        this.asidePaneState = 'out';
        this.asideTransferPaneState = 'out';
        this.isWarehouse = false;
        this.showAdvanceSearchIcon = false;
        this.showProductSearch = false;
        this.showSourceSearch = false;
        this.productUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.sourceUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.selectedEntity = null;
        this.filterCategory = null;
        this.filterCategoryType = null;
        this.filterValueCondition = null;
        this.isFilterCorrect = false;
        this.groupUniqueNameFromURL = null;
        this._DDMMYYYY = 'DD-MM-YYYY';
        this.transactionTypes = [
            { id: 1, uniqueName: 'purchase_sale', name: 'Purchase & Sales' },
            { id: 2, uniqueName: 'transfer', name: 'Transfer' },
            { id: 3, uniqueName: 'all', name: 'All Transactions' },
        ];
        this.CategoryOptions = [
            {
                value: "inwards",
                label: "Inwards",
                disabled: false
            },
            {
                value: "outwards",
                label: "Outwards",
                disabled: false
            },
            {
                value: "Opening Stock",
                label: "Opening Stock",
                disabled: false
            },
            {
                value: "Closing Stock",
                label: "Closing Stock",
                disabled: false
            }
        ];
        this.CategoryTypeOptions = [
            {
                value: "quantity",
                label: "Quantity",
                disabled: false
            },
            {
                value: "value",
                label: "Value",
                disabled: false
            }
        ];
        this.FilterValueCondition = [
            {
                value: "EQUALS",
                label: "Equals",
                disabled: false
            },
            {
                value: "GREATER_THAN",
                label: "Greater than",
                disabled: false
            },
            {
                value: "LESS_THAN",
                label: "Less than",
                disabled: false
            },
            {
                value: "NOT_EQUALS",
                label: "Excluded",
                disabled: false
            }
        ];
        this.datePickerOptions = {
            hideOnEsc: true,
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
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(1, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 7 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(6, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 30 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(29, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 6 Months': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(6, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 1 Year': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(12, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ]
            },
            startDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(1, 'month'),
            endDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__()
        };
        this.showAdvanceSearchModal = false;
        this.branchAvailable = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.groupStockReport$ = this.store.select(function (p) { return p.inventory.groupStockReport; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["publishReplay"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["refCount"])());
        this.GroupStockReportRequest = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__["GroupStockReportRequest"]();
        this.activeGroup$ = this.store.select(function (state) { return state.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$));
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$));
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
            if (a) {
                var stockGroup = _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](a);
                var stockList_1 = [];
                _this.activeGroupName = stockGroup.name;
                stockGroup.stocks.forEach(function (stock) {
                    stockList_1.push({ label: stock.name + " (" + stock.uniqueName + ")", value: stock.uniqueName });
                });
                _this.stockList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(stockList_1);
                if (_this.GroupStockReportRequest && !_this.GroupStockReportRequest.stockGroupUniqueName) {
                    _this.GroupStockReportRequest.stockGroupUniqueName = stockGroup.uniqueName;
                }
            }
        });
        // tslint:disable-next-line:no-shadowed-variable
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_16__["createSelector"])([function (state) { return state.settings.branches; }], function (branches) {
            if (branches && branches.results.length > 0) {
                _this.branchAvailable = true;
            }
            else {
                _this.branchAvailable = false;
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe();
    }
    InventoryGroupStockReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get view from sidebar while clicking on group/stock
        var len = document.location.pathname.split('/').length;
        this.groupUniqueNameFromURL = document.location.pathname.split('/')[len - 2];
        if (this.groupUniqueNameFromURL && len === 6) {
            this.groupUniqueName = this.groupUniqueNameFromURL;
            this.initReport();
        }
        this.invViewService.getActiveView().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe(function (v) {
            if (!v.isOpen) {
                _this.activeGroupName = v.name;
                _this.groupUniqueName = v.groupUniqueName;
                if (_this.groupUniqueName) {
                    if (_this.groupUniqueName) {
                        _this.initReport();
                    }
                    if (_this.dateRangePickerCmp) {
                        //this.dateRangePickerCmp.nativeElement.value = `${this.GroupStockReportRequest.from} - ${this.GroupStockReportRequest.to}`;
                    }
                }
            }
        });
        this.groupStockReport$.subscribe(function (res) {
            _this.groupStockReport = res;
            _this.cdr.detectChanges();
        });
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[0]).format(_this._DDMMYYYY);
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[1]).format(_this._DDMMYYYY);
                _this.getGroupReport(true);
            }
        });
        this.selectedCompany$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_16__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.session.companyUniqueName; }], function (companies, uniqueName) {
            if (!companies) {
                return;
            }
            var selectedCmp = companies.find(function (cmp) {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                }
                else {
                    return false;
                }
            });
            if (!selectedCmp) {
                return;
            }
            if (selectedCmp) {
                //console.log(selectedCmp);
            }
            _this.selectedCmp = selectedCmp;
            _this.getAllBranch();
            return selectedCmp;
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$));
        this.selectedCompany$.subscribe();
        this.productUniqueNameInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.isFilterCorrect = true;
                _this.GroupStockReportRequest.stockName = s;
                _this.getGroupReport(true);
                if (s === '') {
                    _this.showProductSearch = false;
                }
            }
        });
        this.sourceUniqueNameInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.isFilterCorrect = true;
                _this.GroupStockReportRequest.source = s;
                _this.getGroupReport(true);
                if (s === '') {
                    _this.showProductSearch = false;
                }
            }
        });
        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].pattern('[-0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
            filterCategoryType: [''],
            filterValueCondition: ['']
        });
    };
    InventoryGroupStockReportComponent.prototype.handleKeyboardEvent = function (event) {
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.toggleAsidePane();
        }
        if (event.altKey && event.which === 80 && this.branchAvailable) { // Alt + P
            event.preventDefault();
            event.stopPropagation();
            this.toggleTransferAsidePane();
        }
    };
    InventoryGroupStockReportComponent.prototype.initReport = function () {
        // this.fromDate = moment().subtract(1, 'month').format(this._DDMMYYYY);
        // this.toDate = moment().format(this._DDMMYYYY);
        // this.GroupStockReportRequest.from = moment().add(-1, 'month').format(this._DDMMYYYY);
        // this.GroupStockReportRequest.to = moment().format(this._DDMMYYYY);
        // this.datePickerOptions.startDate = moment().add(-1, 'month').toDate();
        // this.datePickerOptions.endDate = moment().toDate();
        this.GroupStockReportRequest.page = 1;
        this.GroupStockReportRequest.stockGroupUniqueName = this.groupUniqueName || '';
        this.GroupStockReportRequest.stockUniqueName = '';
        this.groupUniqueNameFromURL = null;
        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.GroupStockReportRequest)));
    };
    InventoryGroupStockReportComponent.prototype.getGroupReport = function (resetPage) {
        this.GroupStockReportRequest.from = this.fromDate || null;
        this.GroupStockReportRequest.to = this.toDate || null;
        this.invViewService.setActiveDate(this.GroupStockReportRequest.from, this.GroupStockReportRequest.to);
        if (resetPage) {
            this.GroupStockReportRequest.page = 1;
        }
        if (!this.GroupStockReportRequest.stockGroupUniqueName) {
            return;
        }
        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.GroupStockReportRequest)));
    };
    /**
     * getAllBranch
     */
    InventoryGroupStockReportComponent.prototype.getAllBranch = function () {
        var _this = this;
        //this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_16__["createSelector"])([function (state) { return state.settings.branches; }], function (entities) {
            if (entities) {
                if (entities.results.length) {
                    if (_this.selectedCmp && entities.results.findIndex(function (p) { return p.uniqueName === _this.selectedCmp.uniqueName; }) === -1) {
                        _this.selectedCmp['label'] = _this.selectedCmp.name;
                        entities.results.push(_this.selectedCmp);
                    }
                    entities.results.forEach(function (element) {
                        element['label'] = element.name;
                    });
                    _this.entities$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["orderBy"](entities.results, 'name'));
                }
                else if (entities.results.length === 0) {
                    _this.entities$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
                }
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(this.destroyed$)).subscribe();
    };
    InventoryGroupStockReportComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    InventoryGroupStockReportComponent.prototype.ngAfterViewInit = function () {
        this.store.select(function (p) { return p.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["take"])(1)).subscribe(function (a) {
            if (!a) {
                // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
            }
        });
    };
    InventoryGroupStockReportComponent.prototype.goToManageGroup = function () {
        if (this.groupUniqueName) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, true, true);
            // this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName]);
        }
    };
    InventoryGroupStockReportComponent.prototype.nextPage = function () {
        this.GroupStockReportRequest.page++;
        this.getGroupReport(false);
    };
    InventoryGroupStockReportComponent.prototype.prevPage = function () {
        this.GroupStockReportRequest.page--;
        this.getGroupReport(false);
    };
    InventoryGroupStockReportComponent.prototype.closeFromDate = function (e) {
        if (this.showFromDatePicker) {
            this.showFromDatePicker = false;
        }
    };
    InventoryGroupStockReportComponent.prototype.closeToDate = function (e) {
        if (this.showToDatePicker) {
            this.showToDatePicker = false;
        }
    };
    InventoryGroupStockReportComponent.prototype.selectedDate = function (value, from) {
        this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(value.picker.startDate).format(this._DDMMYYYY);
        this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(value.picker.endDate).format(this._DDMMYYYY);
        this.pickerSelectedFromDate = value.picker.startDate;
        this.pickerSelectedToDate = value.picker.endDate;
        if (!from) {
            this.isFilterCorrect = true;
            this.getGroupReport(true);
        }
    };
    InventoryGroupStockReportComponent.prototype.filterFormData = function () {
        this.getGroupReport(true);
    };
    /**
     * setInventoryAsideState
     */
    InventoryGroupStockReportComponent.prototype.setInventoryAsideState = function (isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: isOpen, isGroup: isGroup, isUpdate: isUpdate }));
    };
    InventoryGroupStockReportComponent.prototype.pageChanged = function (event) {
        this.GroupStockReportRequest.page = event.page;
        this.getGroupReport(false);
    };
    InventoryGroupStockReportComponent.prototype.DownloadGroupReports = function (type) {
        this.GroupStockReportRequest.reportDownloadType = type;
        this._toasty.infoToast('Upcoming feature');
        // this.inventoryService.DownloadGroupReport(this.GroupStockReportRequest, this.groupUniqueName).subscribe(d => {
        //   if (d.status === 'success') {
        //     if (type === 'xls') {
        //       let blob = base64ToBlob(d.body, 'application/xls', 512);
        //       return saveAs(blob, `${this.groupUniqueName}.xlsx`);
        //     } else {
        //       let blob = base64ToBlob(d.body, 'application/csv', 512);
        //       return saveAs(blob, `${this.groupUniqueName}.csv`);
        //     }
        //   } else {
        //     this._toasty.errorToast(d.message);
        //   }
        // });
    };
    // region asidemenu toggle
    InventoryGroupStockReportComponent.prototype.toggleBodyClass = function () {
        if (this.asidePaneState === 'in' || this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    InventoryGroupStockReportComponent.prototype.toggleAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asidePaneState = this.asidePaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    // new transfer aside pane
    InventoryGroupStockReportComponent.prototype.toggleTransferAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    // From Entity Dropdown
    InventoryGroupStockReportComponent.prototype.selectEntity = function (option) {
        this._toasty.infoToast('Upcoming feature');
        this.GroupStockReportRequest.branchDetails = option.label;
        // if (option.value === 'warehouse') { // enable after new api for this 'inventoryEntity' key
        //   this.isWarehouse = true;
        // } else {
        //   this.isWarehouse = false;
        // }
        // this.getGroupReport(true);
    };
    // From inventory type Dropdown
    InventoryGroupStockReportComponent.prototype.selectTransactionType = function (inventoryType) {
        this.GroupStockReportRequest.transactionType = inventoryType;
        this.getGroupReport(true);
    };
    InventoryGroupStockReportComponent.prototype.sortButtonClicked = function (type, columnName) {
        if (this.GroupStockReportRequest.sort !== type || this.GroupStockReportRequest.sortBy !== columnName) {
            this.GroupStockReportRequest.sort = type;
            this.GroupStockReportRequest.sortBy = columnName;
        }
        this.isFilterCorrect = true;
        this.getGroupReport(true);
    };
    InventoryGroupStockReportComponent.prototype.clickedOutside = function (event, el, fieldName) {
        if (fieldName === 'product') {
            if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'source') {
            if (this.sourceUniqueNameInput.value !== null && this.sourceUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        }
        else {
            if (fieldName === 'product') {
                this.showProductSearch = false;
            }
            else if (fieldName === 'source') {
                this.showSourceSearch = false;
            }
        }
    };
    /* tslint:disable */
    InventoryGroupStockReportComponent.prototype.childOf = function (c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    };
    // focus on click search box
    InventoryGroupStockReportComponent.prototype.showProductSearchBox = function () {
        var _this = this;
        this.showProductSearch = !this.showProductSearch;
        setTimeout(function () {
            _this.productName.nativeElement.focus();
            _this.productName.nativeElement.value = null;
        }, 200);
    };
    InventoryGroupStockReportComponent.prototype.showSourceSearchBox = function () {
        var _this = this;
        this.showSourceSearch = !this.showSourceSearch;
        setTimeout(function () {
            _this.sourceName.nativeElement.focus();
            _this.sourceName.nativeElement.value = null;
        }, 200);
    };
    //******* Advance search modal *******//
    InventoryGroupStockReportComponent.prototype.resetFilter = function () {
        var _this = this;
        this.isFilterCorrect = false;
        this.GroupStockReportRequest.sort = 'asc';
        this.GroupStockReportRequest.sortBy = null;
        this.GroupStockReportRequest.entity = null;
        this.GroupStockReportRequest.value = null;
        this.GroupStockReportRequest.condition = null;
        this.GroupStockReportRequest.number = null;
        this.showSourceSearch = false;
        this.showProductSearch = false;
        this.GroupStockReportRequest.stockName = null;
        this.GroupStockReportRequest.source = null;
        this.productName.nativeElement.value = null;
        if (this.sourceName) {
            this.sourceName.nativeElement.value = null;
        }
        this.advanceSearchForm.controls['filterAmount'].setValue(null);
        //Reset Date with universal date
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[0]).format(_this._DDMMYYYY);
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[1]).format(_this._DDMMYYYY);
            }
        });
        //Reset Date
        this.getGroupReport(true);
    };
    InventoryGroupStockReportComponent.prototype.onOpenAdvanceSearch = function () {
        this.showAdvanceSearchModal = true;
        this.advanceSearchModel.show();
    };
    InventoryGroupStockReportComponent.prototype.advanceSearchAction = function (type) {
        if (type === 'cancel') {
            this.showAdvanceSearchModal = false;
            this.clearModal();
            this.advanceSearchModel.hide(); // change request : to only reset fields
            return;
        }
        else if (type === 'clear') {
            this.clearModal();
            return;
        }
        if (this.isFilterCorrect) {
            this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.datePickerOptions, { startDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__(this.pickerSelectedFromDate).toDate(), endDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__(this.pickerSelectedToDate).toDate() });
            this.showAdvanceSearchModal = false;
            this.advanceSearchModel.hide(); // change request : to only reset fields
            this.getGroupReport(true);
        }
    };
    InventoryGroupStockReportComponent.prototype.clearModal = function () {
        if (this.GroupStockReportRequest.number || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.entity) {
            this.shCategory.clear();
            this.shCategoryType.clear();
            this.shValueCondition.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);
            this.GroupStockReportRequest.number = null;
            this.getGroupReport(true);
        }
        if (this.GroupStockReportRequest.sortBy || this.GroupStockReportRequest.stockName || this.GroupStockReportRequest.source || this.productName.nativeElement.value) {
            // do something...
        }
        else {
            this.isFilterCorrect = false;
        }
    };
    /**
     * onDDElementSelect
     */
    InventoryGroupStockReportComponent.prototype.clearShSelect = function (type) {
        switch (type) {
            case 'filterCategory': // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = null;
                this.GroupStockReportRequest.entity = null;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = null;
                this.GroupStockReportRequest.value = null;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = null;
                this.GroupStockReportRequest.condition = null;
                break;
        }
        this.mapAdvFilters();
    };
    InventoryGroupStockReportComponent.prototype.onDDElementSelect = function (event, type) {
        switch (type) {
            case 'filterCategory': // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = event.value;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = event.value;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = event.value;
                break;
        }
        this.mapAdvFilters();
    };
    InventoryGroupStockReportComponent.prototype.downloadAllInventoryReports = function (reportType, reportFormat) {
        var _this = this;
        console.log('Called : download', reportType, 'format', reportFormat);
        var obj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_5__["InventoryDownloadRequest"]();
        if (this.GroupStockReportRequest.stockGroupUniqueName) {
            obj.stockGroupUniqueName = this.GroupStockReportRequest.stockGroupUniqueName;
        }
        if (this.GroupStockReportRequest.stockUniqueName) {
            obj.stockUniqueName = this.GroupStockReportRequest.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        this.inventoryService.downloadAllInventoryReports(obj)
            .subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.infoToast(res.body);
            }
            else {
                _this._toasty.errorToast(res.message);
            }
        });
    };
    InventoryGroupStockReportComponent.prototype.mapAdvFilters = function () {
        if (this.filterCategory) { // entity = Opening Stock, inwards, outwards, Closing Stock 
            this.GroupStockReportRequest.entity = this.filterCategory;
        }
        if (this.filterCategoryType) { // value = quantity/value 
            this.GroupStockReportRequest.value = this.filterCategoryType;
        }
        if (this.filterValueCondition) { // condition = GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS 
            this.GroupStockReportRequest.condition = this.filterValueCondition;
        }
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) { // number=1 {any number given by user}
            this.GroupStockReportRequest.number = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
        }
        else {
            this.GroupStockReportRequest.number = null;
        }
        if (this.GroupStockReportRequest.source || this.GroupStockReportRequest.sortBy || this.productName.nativeElement.value || this.GroupStockReportRequest.entity || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.number) {
            this.isFilterCorrect = true;
        }
        else {
            this.isFilterCorrect = false;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('dateRangePickerCmp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ElementRef"])
    ], InventoryGroupStockReportComponent.prototype, "dateRangePickerCmp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('advanceSearchModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_17__["ModalDirective"])
    ], InventoryGroupStockReportComponent.prototype, "advanceSearchModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])("productName"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ElementRef"])
    ], InventoryGroupStockReportComponent.prototype, "productName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])("sourceName"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ElementRef"])
    ], InventoryGroupStockReportComponent.prototype, "sourceName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('advanceSearchForm'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], InventoryGroupStockReportComponent.prototype, "formValues", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('shCategory'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryGroupStockReportComponent.prototype, "shCategory", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('shCategoryType'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryGroupStockReportComponent.prototype, "shCategoryType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ViewChild"])('shValueCondition'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryGroupStockReportComponent.prototype, "shValueCondition", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["HostListener"])('document:keyup', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [KeyboardEvent]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], InventoryGroupStockReportComponent.prototype, "handleKeyboardEvent", null);
    InventoryGroupStockReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_8__["Component"])({
            selector: 'invetory-group-stock-report',
            template: __webpack_require__(/*! ./group.stockreport.component.html */ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./group.stockreport.component.scss */ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["ActivatedRoute"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__["SidebarAction"],
            _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_6__["StockReportActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_2__["InventoryService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_1__["ToasterService"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_14__["InventoryAction"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_18__["SettingsBranchActions"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_19__["InvViewService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_8__["ChangeDetectorRef"]])
    ], InventoryGroupStockReportComponent);
    return InventoryGroupStockReportComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/header-components/inventory-header-component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/inventory/components/header-components/inventory-header-component.ts ***!
  \**************************************************************************************/
/*! exports provided: InventoryHearderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryHearderComponent", function() { return InventoryHearderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");








var InventoryHearderComponent = /** @class */ (function () {
    function InventoryHearderComponent(router, store, inventoryAction) {
        this.router = router;
        this.store = store;
        this.inventoryAction = inventoryAction;
        this.accountAsideMenuState = 'out';
        this.asideMenuStateForProductService = 'out';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.openGroupStockAsidePane$ = this.store.select(function (s) { return s.inventory.showNewGroupAsidePane; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.openCustomUnitAsidePane$ = this.store.select(function (s) { return s.inventory.showNewCustomUnitAsidePane; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    InventoryHearderComponent.prototype.ngOnInit = function () {
        var _this = this;
        // get activeGroup
        this.activeGroupName$ = this.store.select(function (s) { return s.inventory.activeGroupUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.openGroupStockAsidePane$.subscribe(function (s) {
            if (s) {
                _this.toggleGroupStockAsidePane();
            }
        });
        this.openCustomUnitAsidePane$.subscribe(function (s) {
            if (s) {
                _this.toggleCustomUnitAsidePane();
            }
        });
    };
    InventoryHearderComponent.prototype.goToAddGroup = function () {
        // this.store.dispatch(this.inventoryAction.resetActiveGroup());
        this.router.navigate(['/pages', 'inventory', 'add-group']);
    };
    InventoryHearderComponent.prototype.goToAddStock = function () {
        this.store.dispatch(this.inventoryAction.resetActiveStock());
        var groupName = null;
        this.activeGroupName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return groupName = s; });
        this.router.navigate(['/pages', 'inventory', 'add-group', groupName, 'add-stock']);
    };
    InventoryHearderComponent.prototype.toggleCustomUnitAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    InventoryHearderComponent.prototype.toggleGroupStockAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    InventoryHearderComponent.prototype.toggleBodyClass = function () {
        if (this.accountAsideMenuState === 'in' || this.asideMenuStateForProductService === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    /**
     * setInventoryAsideState
     */
    InventoryHearderComponent.prototype.setInventoryAsideState = function (isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: isOpen, isGroup: isGroup, isUpdate: isUpdate }));
    };
    InventoryHearderComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    InventoryHearderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'inventory-header',
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_7__["animate"])('400ms ease-in-out'))
                ]),
            ],
            template: "\n    <!--<div class=\"stock-bar inline pull-right\">\n      <div class=\"\">\n        <div class=\"pull-right\">\n          <button (click)=\"toggleCustomUnitAsidePane($event)\" type=\"button\" class=\"btn btn-link\">Custom Stock Unit</button>\n          <button (click)=\"toggleGroupStockAsidePane($event);setInventoryAsideState(true, true, false)\" type=\"button\" class=\"btn btn-default\">Create Group</button>\n          <button (click)=\"toggleGroupStockAsidePane($event);setInventoryAsideState(true, false, false)\" type=\"button\" class=\"btn btn-default\">Create Stock</button>\n        </div>\n      </div>\n    </div>-->\n    <div class=\"aside-overlay\" *ngIf=\"accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'\"></div>\n    <aside-custom-stock [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\" (closeAsideEvent)=\"toggleCustomUnitAsidePane($event)\"\n                        (onShortcutPress)=\"toggleCustomUnitAsidePane()\"></aside-custom-stock>\n    <aside-inventory-stock-group [autoFocus]=\"false\" [class]=\"asideMenuStateForProductService\" [@slideInOut]=\"asideMenuStateForProductService\" (closeAsideEvent)=\"toggleGroupStockAsidePane($event)\"\n                                 (onShortcutPress)=\"toggleGroupStockAsidePane()\"></aside-inventory-stock-group>\n  ",
            styles: ["\n  "]
        })
        // <button type="button" class="btn btn-default" (click)="goToAddGroup()">Add Group</button>
        // <button type="button" *ngIf="activeGroupName$ | async" class="btn btn-default" (click)="goToAddStock()">Add Stock</button>
        // [routerLink]="['custom-stock']"
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"]])
    ], InventoryHearderComponent);
    return InventoryHearderComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/in-out-stock-list.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/in-out-stock-list.component.ts ***!
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
            selector: 'in-out-stock-list',
            template: "\n    <ul class=\"list-unstyled  stock-grp-list clearfix\" *ngIf=\"stockList\">\n      <li routerLinkActive=\"active\" *ngFor=\"let s of stockList\"><a [routerLink]=\"['/pages','inventory-in-out','stock',s.uniqueName]\"> {{s.name}}</a></li>\n    </ul>\n  ",
            styles: ["\n    .active > a {\n      color: #d35f29 !important;\n    }\n  "]
        })
    ], InOutStockListComponent);
    return InOutStockListComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/inventory.sidebar.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"inventory-sidebar\" class=\"sidebar p0 pull-left\" #sidebar [ngClass]=\"{'invisible': (groupsWithStocks$ | async)?.length==0 && isSearching==false}\">\n    <div class=\"h100 clearfix\">\n        <div class=\"padd15\" style=\"position: relative\">\n            <input class=\"form-control\" style=\"padding-left: 32px !important; width:205px; display: inline-block;\" type=\"search\" placeholder=\"Search Stock/Group\" #search>\n            <i class=\"fa fa-search text-light-2\" style=\"position: absolute;top: 26px;left: 25px;\"></i>\n            <div class=\"btn-group\" dropdown placement=\"bottom left\">\n                <div class=\"btn-group\" dropdown [autoClose]=\"true\" container=\"body\">\n                    <button id=\"button-nested\" dropdownToggle type=\"button\" class=\"btn btn-primary dropdown-toggle\" aria-controls=\"dropdown-nested\"> <i class=\"fa fa-ellipsis-v\"></i> <span class=\"caret\"></span>\n          </button>\n                    <ul id=\"dropdown-nested\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-nested\">\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle class=\"dropdown-item dropdown-toggle\">Download all groups wise</a>\n                            <ul class=\"dropdown-menu\" role=\"menu\">\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('allgroup', 'xlsx')\" href=\"\">XLS</a></li>\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('allgroup', 'csv')\" href=\"\">CSV</a></li>\n                            </ul>\n                        </li>\n                        <!--                        <li role=\"menuitem\" dropdown triggers=\"mouseover\" placement=\"right\" container=\"body\" *ngIf=\"groupUniqueName\">-->\n                        <!--                            <a dropdownToggle class=\"dropdown-item dropdown-toggle\">Download groups</a>-->\n                        <!--                            <ul *dropdownMenu class=\"dropdown-menu\" role=\"menu\">-->\n                        <!--                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('group', 'xlsx')\" href=\"\">XLS</a></li>-->\n                        <!--                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('group', 'csv')\" href=\"\">CSV</a></li>-->\n                        <!--                            </ul>-->\n                        <!--                        </li>-->\n\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle class=\"dropdown-item dropdown-toggle\">Download all stock wise</a>\n                            <ul class=\"dropdown-menu\" role=\"menu\">\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('allstock', 'xlsx')\" href=\"\">XLS</a></li>\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('allstock', 'csv')\" href=\"\">CSV</a></li>\n                            </ul>\n                        </li>\n                        <!--                        <li role=\"menuitem\" dropdown triggers=\"mouseover\" placement=\"right\" container=\"body\" *ngIf=\"stockUniqueName\">-->\n                        <!--                            <a dropdownToggle class=\"dropdown-item dropdown-toggle\">Download stock</a>-->\n                        <!--                            <ul *dropdownMenu class=\"dropdown-menu\" role=\"menu\">-->\n                        <!--                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('stock', 'xlsx')\" href=\"\">XLS</a></li>-->\n                        <!--                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('stock', 'csv')\" href=\"\">CSV</a></li>-->\n                        <!--                            </ul>-->\n                        <!--                        </li>-->\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle class=\"dropdown-item dropdown-toggle\" (click)=\"false\">Download all account wise <span\n                  class=\"caret\"></span></a>\n                            <ul class=\"dropdown-menu\" role=\"menu\">\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('account', 'xlsx')\" href=\"\">XLS</a></li>\n                                <li role=\"menuitem\"><a class=\"dropdown-item\" (click)=\"false\" (click)=\"downloadAllInventoryReports('account', 'csv')\" href=\"\">CSV</a></li>\n                            </ul>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n        <!-- <div class=\"pd1\">\n      <button class=\"btn isActive btn-sm\" id=\"warehouseBtn\" type=\"button\" (click)=\"showBranchScreen()\">Branch Transfer</button>\n    </div> -->\n        <stockgrp-list class=\"parent-Group\" [Groups]='groupsWithStocks$ | async'>\n        </stockgrp-list>\n    </div>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/inventory.sidebar.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".invisible {\n  visibility: hidden; }\n\n.parent-Group > ul > li ul li div {\n  color: #8a8a8a; }\n\n.btn-group.show {\n  display: inline-block !important; }\n\n.btn-group > .btn:first-child {\n  margin-left: 8px;\n  margin-top: -3px;\n  background: none;\n  color: #707070;\n  padding: 6px;\n  margin-right: 0px !important; }\n\n.dropdown-menu > li > a:hover {\n  background: #e5e5e5;\n  cursor: pointer; }\n\n.dropdown-menu > li > a {\n  color: #ff5200; }\n\nspan.caret {\n  display: none; }\n\n#inventory-sidebar {\n  background: #fff;\n  min-height: 100vh;\n  width: 260px !important;\n  padding-bottom: 220px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/inventory.sidebar.component.ts ***!
  \****************************************************************************************/
/*! exports provided: InventorySidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventorySidebarComponent", function() { return InventorySidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");












var InventorySidebarComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function InventorySidebarComponent(store, sidebarAction, inventoryAction, router, inventoryService, invViewService, _toasty) {
        this.store = store;
        this.sidebarAction = sidebarAction;
        this.inventoryAction = inventoryAction;
        this.router = router;
        this.inventoryService = inventoryService;
        this.invViewService = invViewService;
        this._toasty = _toasty;
        this.isSearching = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.groupsWithStocks$ = this.store.select(function (s) { return s.inventory.groupsWithStocks; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.sidebarRect = window.screen.height;
        // console.log(this.sidebarRect);
    }
    InventorySidebarComponent.prototype.resizeEvent = function () {
        this.sidebarRect = window.screen.height;
    };
    // @HostListener('window:load', ['$event'])
    InventorySidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.invViewService.getActiveDate().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (v) {
            _this.fromDate = v.from;
            _this.toDate = v.to;
        });
        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    };
    InventorySidebarComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.groupsWithStocks$.subscribe();
        this.invViewService.getActiveView().subscribe(function (v) {
            _this.groupUniqueName = v.groupUniqueName;
            _this.stockUniqueName = v.stockUniqueName;
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(this.search.nativeElement, 'input').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(500), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (e) { return e.target.value; }))
            .subscribe(function (val) {
            if (val) {
                _this.isSearching = true;
            }
            _this.store.dispatch(_this.sidebarAction.SearchGroupsWithStocks(val));
        });
    };
    InventorySidebarComponent.prototype.showBranchScreen = function () {
        // this.store.dispatch(this.inventoryAction.ResetInventoryState());
        this.store.dispatch(this.sidebarAction.ShowBranchScreen(true));
        this.store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(true));
        // this.router.navigate(['inventory']);
    };
    InventorySidebarComponent.prototype.downloadAllInventoryReports = function (reportType, reportFormat) {
        var _this = this;
        console.log('Called : download', reportType, 'format', reportFormat);
        var obj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_10__["InventoryDownloadRequest"]();
        if (this.groupUniqueName) {
            obj.stockGroupUniqueName = this.groupUniqueName;
        }
        if (this.stockUniqueName) {
            obj.stockUniqueName = this.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        this.inventoryService.downloadAllInventoryReports(obj)
            .subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.infoToast(res.body);
            }
            else {
                _this._toasty.errorToast(res.message);
            }
        });
    };
    InventorySidebarComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('search'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], InventorySidebarComponent.prototype, "search", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('sidebar'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], InventorySidebarComponent.prototype, "sidebar", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["HostListener"])('window:resize'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], InventorySidebarComponent.prototype, "resizeEvent", null);
    InventorySidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'inventory-sidebar',
            template: __webpack_require__(/*! ./inventory.sidebar.component.html */ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.html"),
            styles: [__webpack_require__(/*! ./inventory.sidebar.component.scss */ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_5__["SidebarAction"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryAction"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_9__["InventoryService"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_11__["InvViewService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__["ToasterService"]])
    ], InventorySidebarComponent);
    return InventorySidebarComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/stockList.component.scss":
/*!**********************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/stockList.component.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".stock-items .active {\n  background-color: #fff3ec; }\n\n.stock-items .active a .span {\n  color: #d35f29 !important; }\n\n.span {\n  color: black;\n  font-size: 14px; }\n\n.in-list {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center; }\n\n.in-list .btn {\n  line-height: 14px !important; }\n"

/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/stockList.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/stockList.component.ts ***!
  \********************************************************************************/
/*! exports provided: StockListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockListComponent", function() { return StockListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");








var StockListComponent = /** @class */ (function () {
    function StockListComponent(store, route, _router, inventoryAction, sideBarAction, invViewService) {
        this.store = store;
        this.route = route;
        this._router = _router;
        this.inventoryAction = inventoryAction;
        this.sideBarAction = sideBarAction;
        this.invViewService = invViewService;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.activeGroup$ = this.store.select(function (p) { return p.inventory.activeGroup; });
        this.activeStockUniqueName$ = this.store.select(function (p) { return p.inventory.activeStockUniqueName; });
    }
    StockListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.groupUniqueName = params['groupUniqueName'];
        });
        if (this.Groups.stocks) {
            // this.Groups.stocks = [];
            this.Groups.stocks = _.orderBy(this.Groups.stocks, ['name']);
        }
    };
    StockListComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    StockListComponent.prototype.OpenStock = function (item, e) {
        // console.log('OpenStock', item);
        this.invViewService.setActiveView('stock', item.name, item.uniqueName, this.Groups.uniqueName, true);
        e.stopPropagation();
        this.stockUniqueName = item.uniqueName;
        this.store.dispatch(this.sideBarAction.GetInventoryStock(item.uniqueName, this.Groups.uniqueName));
        // setTimeout(() => {
        this._router.navigate(['/pages', 'inventory', 'stock', this.Groups.uniqueName, 'report', item.uniqueName]);
        // }, 700);
    };
    StockListComponent.prototype.goToManageStock = function (stock) {
        if (stock && stock.uniqueName) {
            this.store.dispatch(this.inventoryAction.showLoaderForStock());
            this.store.dispatch(this.sideBarAction.GetInventoryStock(stock.uniqueName, this.Groups.uniqueName));
            // this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            // this.setInventoryAsideState(true, false, true);
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: true, isGroup: false, isUpdate: true }));
        }
    };
    /**
     * setInventoryAsideState
     */
    StockListComponent.prototype.setInventoryAsideState = function (isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: isOpen, isGroup: isGroup, isUpdate: isUpdate }));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], StockListComponent.prototype, "Stocks", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], StockListComponent.prototype, "Groups", void 0);
    StockListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'stock-list',
            template: "\n    <ul class=\"list-unstyled stock-items clearfix\" [hidden]=\"!Groups.isOpen\">\n      <li class=\"clearfix \" *ngFor=\"let item of Groups.stocks\" style=\"padding: 0px\">\n        <div class=\"in-list\" [ngClass]=\"{'active':  (activeStockUniqueName$ | async) === item.uniqueName}\">\n          <a (click)=\"OpenStock(item, $event)\" style=\"display: flex;align-items: center;flex: 1;color: black;justify-content: space-between\" class=\"d-flex\">\n            <span class=\"span\">{{item.name}}</span>\n            <span class=\"d-block\" *ngIf=\"item.count\" style=\"margin-right: 12px;\" [hidden]=\"(activeStockUniqueName$ | async) === item.uniqueName\">\n         {{item.count}}</span>\n          </a>\n          <button class=\"btn btn-link btn-xs pull-right\" (click)=\"goToManageStock(item)\" *ngIf=\"(activeStockUniqueName$ | async) === item.uniqueName\">\n            <i class=\"fa fa-pencil\" style=\"color: #FF5F00 !important;\"> </i>\n          </button>\n        </div>\n      </li>\n    </ul>\n  ",
            styles: [__webpack_require__(/*! ./stockList.component.scss */ "./src/app/inventory/components/sidebar-components/stockList.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__["SidebarAction"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_7__["InvViewService"]])
    ], StockListComponent);
    return StockListComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/stockgrplist.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/stockgrplist.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ul class=\"list-unstyled stock-grp-list clearfix\">\n  <li class=\"clearfix main-group\" [ngClass]=\"{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}\"\n    *ngFor=\"let grp of Groups\" style=\"padding: 0 !important;padding-left: 0 !important;\">\n    <div class=\"item-group\"\n      [ngClass]=\"{'active': grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && !(activeStockUniqueName$ | async)}\">\n      <a (click)=\"OpenGroup(grp, $event)\" style=\"display: flex;align-items: center;flex: 1;color: black;\"\n        class=\"d-flex\">\n        <a [routerLink]=\"[ 'group', grp.uniqueName, 'report' ]\" class=\"text-black\">{{grp.name}}</a>\n        <i (click)=\"OpenGroup(grp, $event)\" style=\"margin:0 15px;font-size: 9px\" class=\"icon-arrow-down pr\"\n          [ngClass]=\"{'open': grp.isOpen}\"></i>\n      </a>\n      <!-- *ngIf=\"grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && (activeStockUniqueName$ | async)\" -->\n      <span class=\"pull-right\">\n        <!-- *ngIf=\"grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName)\" -->\n        <button class=\"btn btn-link btn-xs pull-right\" (click)=\"goToManageGroup(grp)\"\n          *ngIf=\"grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName) && !(activeStockUniqueName$ | async)\">\n          <i class=\"fa fa-pencil\" style=\"color: #FF5F00 !important;\"> </i>\n        </button>\n      </span>\n    </div>\n    <div>\n      <stock-list [Groups]='grp'>\n      </stock-list>\n      <stockgrp-list [Groups]='grp.childStockGroups' *ngIf=\"grp.childStockGroups.length > 0 && grp.isOpen\">\n      </stockgrp-list>\n    </div>\n  </li>\n  <li class=\"no-data-box text-center text-light\" *ngIf=\"Groups && Groups.length<=0\">\n    <img src=\"assets/images/search-data-not-found.svg\" /><br>\n    No Data Found</li>\n</ul>\n"

/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/stockgrplist.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/stockgrplist.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".active {\n  color: #d35f29 !important; }\n\n.stock-grp-list li > i:focus {\n  outline: 0; }\n\n.grp_open {\n  background: white; }\n\n.grp_open li {\n  border: 0; }\n\n.btn-link {\n  padding-top: 0 !important; }\n\n.stock-grp-list .active a,\ns.tock-grp-list .active i {\n  color: #ff5f00 !important; }\n\n.stock-grp-list .active {\n  background-color: #fff3ec; }\n\n.item-group {\n  padding: 12px 20px;\n  padding-right: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  max-height: 41px; }\n\n.main-group div > stockgrp-list .item-group {\n  padding: 8px 0 8px 35px !important; }\n\n.main-group div > stock-list ::ng-deep.in-list {\n  padding: 8px 0 8px 35px; }\n\nstock-list ::ng-deep.in-list a div {\n  color: black !important; }\n\n.text-black {\n  color: #000000; }\n\n.item-group {\n  text-transform: unset !important; }\n\n.no-data-box {\n  border-top: 1px solid #e0e0e0 !important; }\n\n.stock-grp-list li .btn {\n  line-height: 14px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/sidebar-components/stockgrplist.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/inventory/components/sidebar-components/stockgrplist.component.ts ***!
  \***********************************************************************************/
/*! exports provided: StockgrpListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockgrpListComponent", function() { return StockgrpListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");









var StockgrpListComponent = /** @class */ (function () {
    function StockgrpListComponent(store, route, sideBarAction, inventoryAction, invViewService) {
        this.store = store;
        this.route = route;
        this.sideBarAction = sideBarAction;
        this.inventoryAction = inventoryAction;
        this.invViewService = invViewService;
        this.activeGroup = null;
        this.activeStock = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.activeGroup$ = this.store.select(function (p) { return p.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.activeStock$ = this.store.select(function (p) { return p.inventory.activeStock; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.select(function (p) { return p.inventory.activeGroupUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.activeStockUniqueName$ = this.store.select(function (p) { return p.inventory.activeStockUniqueName; });
    }
    StockgrpListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activeGroup$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
            if (a) {
                _this.activeGroup = a;
            }
        });
        this.activeStock$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (a) {
            if (a) {
                _this.activeStock = a;
            }
        });
    };
    StockgrpListComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    StockgrpListComponent.prototype.OpenGroup = function (grp, e) {
        this.invViewService.setActiveView('group', grp.name, null, grp.uniqueName, grp.isOpen);
        e.stopPropagation();
        //this.store.dispatch(this.sideBarAction.ShowBranchScreen(false));
        if (grp.isOpen) {
            this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
        }
        else {
            this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp.uniqueName));
        }
        // this.store.dispatch(this.inventoryAction.resetActiveStock());
        // if (grp.isOpen) {
        //   this.store.dispatch(this.sideBarAction.OpenGroup(grp.uniqueName));
        //   this.store.dispatch(this.inventoryAction.resetActiveStock());
        // } else {
        //   // this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp.uniqueName));
        //   this.store.dispatch(this.inventoryAction.resetActiveStock());
        // }
    };
    StockgrpListComponent.prototype.goToManageGroup = function (grp) {
        if (grp.uniqueName) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, true, true);
        }
    };
    /**
     * setInventoryAsideState
     */
    StockgrpListComponent.prototype.setInventoryAsideState = function (isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: isOpen, isGroup: isGroup, isUpdate: isUpdate }));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], StockgrpListComponent.prototype, "Groups", void 0);
    StockgrpListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'stockgrp-list',
            template: __webpack_require__(/*! ./stockgrplist.component.html */ "./src/app/inventory/components/sidebar-components/stockgrplist.component.html"),
            styles: [__webpack_require__(/*! ./stockgrplist.component.scss */ "./src/app/inventory/components/sidebar-components/stockgrplist.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_4__["SidebarAction"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_7__["InventoryAction"], _inv_view_service__WEBPACK_IMPORTED_MODULE_8__["InvViewService"]])
    ], StockgrpListComponent);
    return StockgrpListComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.html":
/*!**************************************************************************************************!*\
  !*** ./src/app/inventory/components/stock-report-component/inventory.stockreport.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"h100\">\n  <form [formGroup]=\"entityAndInventoryTypeForm\" class=\"form-inline mrB1\">\n    <div class=\"pr d-flex mb-2\" style=\"justify-content: space-between\" style=\"display:none;\">\n      <!-- enable branch selection after implimentation from api-->\n      <div class=\"d-flex\">\n        <div style=\"width: 230px;margin-right: 15px;\">\n          <div class=\"select-style middle\">\n            <sh-select placeholder=\"Select Branch\" formControlName=\"selectedEntity\" (selected)=\"selectEntity($event)\"\n              [(ngModel)]=\"selectedEntity\" [options]=\"entities$ | async\" [ItemHeight]=\"33\"></sh-select>\n            <!-- html dropdown <select class=\"form-control\" formControlName=\"selectedEntity\" [(ngModel)]=\"selectedEntity\"\n              (change)=\"selectEntity($event.target.value)\">\n              <option value=\"headquarter\">{{(selectedCompany$ | async)?.name}}</option>\n              <option *ngFor=\"let entity of entities$ | async\" value=\"{{entity.uniqueName}}\">\n                {{entity.name}}\n              </option>\n              <option value=\"allEntity\">All Entities</option>\n            </select> -->\n          </div>\n        </div>\n        <!-- <div style=\"width: 230px;\">\n          <div class=\"select-style middle\">\n            <select class=\"form-control\" [disabled]=\"isWarehouse\" formControlName=\"selectedTransactionType\"\n              [(ngModel)]=\"selectedTransactionType\" (change)=\"selectTransactionType($event.target.value)\">\n              <option *ngFor=\"let ttype of transactionTypes\" value=\"{{ttype.uniqueName}}\">\n                {{ttype.name}}\n              </option>\n            </select>\n          </div>\n        </div> -->\n      </div>\n\n    </div>\n\n    <div class=\"d-flex\" style=\"justify-content: space-between\">\n      <div class=\"d-flex\" style=\"align-items: center\">\n        <h2 style=\"font-size: 20px;font-weight: bold;text-transform:capitalize;\">\n          <span *ngIf=\"stockReport && stockReport.stockUnit\">\n            {{stockReport.stockName}}</span> (Stock)</h2>\n        <button class=\"btn btn-link btn-link-2 ml-2\" (click)=\"onOpenAdvanceSearch()\">Advance Search</button>\n        <i class=\"fa fa-refresh ml-1 cp\" *ngIf=\"isFilterCorrect\" (click)=\"resetFilter(true)\"></i>\n      </div>\n      <div>\n\n        <div class=\"btn-group btn-download\" dropdown [autoClose]=\"true\" placement=\"bottom right\">\n          <button id=\"button-alignment\" dropdownToggle type=\"button\" class=\"btn-link mrT cp mr-1 dropdown-toggle\"\n            aria-controls=\"dropdown-alignment\">\n            <i class=\"icon-download\"></i> Download\n          </button>\n          <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-right dropdown-menu-download\" role=\"menu\"\n            aria-labelledby=\"button-alignment\">\n            <li role=\"menuitem\" (click)=\"downloadAllInventoryReports('stock', 'csv')\"><a class=\"dropdown-item\">CSV</a>\n            </li>\n            <li role=\"menuitem\" (click)=\"downloadAllInventoryReports('stock', 'xlsx')\"><a class=\"dropdown-item\">XLS</a>\n            </li>\n          </ul>\n        </div>\n\n        <button class=\"btn btn-blue\" (click)=\"toggleAsidePane()\" data-toggle=\"tooltip\" tooltip=\"Alt+i\"\n          style=\"margin-right: 0 !important;\">Create New</button>\n      </div>\n    </div>\n  </form>\n\n  <section>\n    <table class=\"table basic table-border\"\n      [ngClass]=\"{'mB100': stockReport && stockReport.transactions && stockReport.transactions.length>6}\">\n      <thead>\n        <tr>\n          <th colspan=\"3\" width=\"40%\">\n            <div class=\"d-flex\">\n              <input type=\"text\" #dateRangePickerCmp name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n                class=\"form-control stock-input\" (applyDaterangepicker)=\"selectedDate($event)\" />\n            </div>\n          </th>\n          <th colspan=\"4\" width=\"40%\" class=\"text-center bdrR bdrB\">Transactions</th>\n          <th colspan=\"1\" width=\"10%\" class=\"bdrL text-center\">Closing Stock</th>\n        </tr>\n        <tr class=\"bdrT\">\n          <th width=\"100\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill\">Date</div>\n              <div class=\"icon-pointer\">\n                <!-- <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"\n                  (click)=\"sortButtonClicked('asc', 'entry_date')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"\n                  (click)=\"sortButtonClicked('desc', 'entry_date')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'desc'}\">\n                </div> -->\n\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up text-right \" *ngIf=\"stockReportRequest.sortBy !== 'entry_date'\"\n                  (click)=\"sortButtonClicked('asc', 'entry_date')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down text-right\"\n                  *ngIf=\"stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'entry_date')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up text-right \"\n                  *ngIf=\"stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'entry_date')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'entry_date' && stockReportRequest.sort === 'asc'}\">\n                </div>\n\n              </div>\n            </div>\n          </th>\n\n          <th class=\"bdrR bdrB\" width=\"14%\">\n            <div class=\"btn-group btn-group-voucher-type\" dropdown placement=\"bottom right\">\n              <button id=\"button-alignment\" dropdownToggle type=\"button\" class=\"btn-link cp p-0 dropdown-toggle c-3 p0\"\n                aria-controls=\"dropdown-alignment\">Voucher Type\n                <i class=\"fa fa-ellipsis-v pull-right text-light-2\" aria-hidden=\"true\"></i>\n              </button>\n              <ul id=\"dropdown-alignment\" *dropdownMenu class=\"dropdown-menu  dropdown-menu-right voucher-type\"\n                role=\"menu\" aria-labelledby=\"button-alignment\">\n                <li role=\"menuitem dropdown-item\" *ngFor=\"let item of VOUCHER_TYPES\">\n                  <label><input type=\"checkbox\" [(ngModel)]=\"item.checked\"\n                      (click)=\"filterByCheck(item.value, $event.target.checked)\" />\n                    {{item.label}}</label></li>\n              </ul>\n            </div>\n          </th>\n          <th class=\"td_in_searchBox\" width=\"15%\" (clickOutside)=\"clickedOutside($event,null, 'account')\">\n            <div [hidden]=\"showAccountSearch\">\n              <span>Account Name</span>\n              <i class=\"icon-search\" (click)=\"showAccountSearchBox()\"></i>\n            </div>\n            <div class=\"input-container\" [hidden]=\"!showAccountSearch\">\n              <input type=\"text\" placeholder=\"Search Account\" class=\"w100\" #accountName\n                [formControl]=\"accountUniqueNameInput\" />\n              <i class=\"icon-search\" (click)=\"showAccountSearch = false;\"></i>\n            </div>\n          </th>\n\n          <th class=\"bdrR\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill text-right\">Inwards</div>\n              <div class=\"icon-pointer text-right\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'inward_quantity'\"\n                  (click)=\"sortButtonClicked('asc', 'inward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'inward_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down\"\n                  *ngIf=\"stockReportRequest.sortBy === 'inward_quantity' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'inward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'inward_quantity' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up\"\n                  *ngIf=\"stockReportRequest.sortBy === 'inward_quantity' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'inward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'inward_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n\n          <th class=\"bdrR\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill text-right\">Outwards</div>\n              <div class=\"icon-pointer text-right\">\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'outward_quantity'\"\n                  (click)=\"sortButtonClicked('asc', 'outward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'outward_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down\"\n                  *ngIf=\"stockReportRequest.sortBy === 'outward_quantity' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'outward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'outward_quantity' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up\"\n                  *ngIf=\"stockReportRequest.sortBy === 'outward_quantity' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'outward_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'outward_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n              </div>\n            </div>\n          </th>\n\n          <th class=\"bdrR\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill text-right\">Rate</div>\n              <div class=\"icon-pointer text-right\">\n\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'rate'\"\n                  (click)=\"sortButtonClicked('asc', 'rate')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down \"\n                  *ngIf=\"stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'rate')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up\"\n                  *ngIf=\"stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'rate')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!--\n                <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"\n                  (click)=\"sortButtonClicked('asc', 'rate')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"\n                  (click)=\"sortButtonClicked('desc', 'rate')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'rate' && stockReportRequest.sort === 'desc'}\">\n                </div> -->\n              </div>\n            </div>\n          </th>\n\n          <th class=\" bdrR\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill text-right\">Value</div>\n              <div class=\"icon-pointer text-right\">\n\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'transaction_val'\"\n                  (click)=\"sortButtonClicked('asc', 'transaction_val')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'transaction_val' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down \"\n                  *ngIf=\"stockReportRequest.sortBy === 'transaction_val' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'transaction_val')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'transaction_val' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up\"\n                  *ngIf=\"stockReportRequest.sortBy === 'transaction_val' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'transaction_val')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'transaction_val' && stockReportRequest.sort === 'asc'}\">\n                </div>\n\n              </div>\n            </div>\n          </th>\n\n          <th class=\"bdrR text-center\">\n            <div class=\"d-flex\">\n              <div class=\"flex-fill text-right\">Qty</div>\n              <div class=\"icon-pointer text-right\">\n\n                <!-- default -->\n                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'closing_quantity'\"\n                  (click)=\"sortButtonClicked('asc', 'closing_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n                <!-- after sort click -->\n                <div class=\"fa fa-long-arrow-down \"\n                  *ngIf=\"stockReportRequest.sortBy === 'closing_quantity' && stockReportRequest.sort === 'desc'\"\n                  (click)=\"sortButtonClicked('asc', 'closing_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_quantity' && stockReportRequest.sort === 'desc'}\">\n                </div>\n                <div class=\"fa fa-long-arrow-up\"\n                  *ngIf=\"stockReportRequest.sortBy === 'closing_quantity' && stockReportRequest.sort === 'asc'\"\n                  (click)=\"sortButtonClicked('desc', 'closing_quantity')\"\n                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_quantity' && stockReportRequest.sort === 'asc'}\">\n                </div>\n\n              </div>\n            </div>\n          </th>\n\n          <!--          <th class=\"bdrL \">-->\n          <!--            <div class=\"d-flex\">-->\n          <!--              <div class=\"flex-fill\"> Value</div>-->\n          <!--              <div class=\"icon-pointer text-right\">-->\n\n          <!--                &lt;!&ndash; default &ndash;&gt;-->\n          <!--                <div class=\"fa fa-long-arrow-up\" *ngIf=\"stockReportRequest.sortBy !== 'closing_val'\"-->\n          <!--                  (click)=\"sortButtonClicked('asc', 'closing_val')\"-->\n          <!--                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_val' && stockReportRequest.sort === 'asc'}\">-->\n          <!--                </div>-->\n          <!--                &lt;!&ndash; after sort click &ndash;&gt;-->\n          <!--                <div class=\"fa fa-long-arrow-down\"-->\n          <!--                  *ngIf=\"stockReportRequest.sortBy === 'closing_val' && stockReportRequest.sort === 'desc'\"-->\n          <!--                  (click)=\"sortButtonClicked('asc', 'closing_val')\"-->\n          <!--                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_val' && stockReportRequest.sort === 'desc'}\">-->\n          <!--                </div>-->\n          <!--                <div class=\"fa fa-long-arrow-up\"-->\n          <!--                  *ngIf=\"stockReportRequest.sortBy === 'closing_val' && stockReportRequest.sort === 'asc'\"-->\n          <!--                  (click)=\"sortButtonClicked('desc', 'closing_val')\"-->\n          <!--                  [ngClass]=\"{'activeTextColor': stockReportRequest.sortBy === 'closing_val' && stockReportRequest.sort === 'asc'}\">-->\n          <!--                </div>-->\n\n          <!--              </div>-->\n          <!--            </div>-->\n          <!--          </th>-->\n\n        </tr>\n      </thead>\n      <tbody *ngIf=\"stockReport\">\n        <tr *ngFor=\"let txn of stockReport.transactions\">\n          <td class=\"bdrR\">{{txn.entryDate}}</td>\n          <td class=\"bdrR {{txn.voucherType}}\">{{txn.voucherType}}</td>\n          <td class=\"bdrR\">{{txn.account?.name}}</td>\n          <td class=\"text-right bdrR\">\n            <span *ngIf=\"txn.type == 'dr'\">\n              {{txn.quantity}}\n            </span>\n            <span *ngIf=\"txn.type == 'dr'\" class=\"unit-badge\">\n              {{txn.stockUnit}}\n            </span>\n            <span *ngIf=\"txn.type == 'cr'\">-</span>\n          </td>\n\n          <td class=\"text-right bdrR\">\n            <span *ngIf=\"txn.type == 'cr'\">\n              {{txn.quantity}}\n            </span>\n            <span *ngIf=\"txn.type == 'cr'\" class=\"unit-badge\">\n              {{txn.stockUnit}}\n            </span>\n            <span *ngIf=\"txn.type == 'dr'\">-</span>\n          </td>\n\n          <td class=\"text-right bdrR\" [ngClass]=\"txn.type === 'cr'? 'cr' : 'dr' \">{{txn.rate}}</td>\n          <td class=\"text-right bdrR\" [ngClass]=\"txn.type === 'cr'? 'cr' : 'dr' \">\n            {{txn.amount}}\n          </td>\n          <td class=\"text-right bdrR\">\n            {{txn.closingQuantity}}<span class=\"unit-badge\">{{stockReport.stockUnit}}</span>\n          </td>\n          <!--          <td class=\"text-right bdrR\">-->\n          <!--            {{txn.closingQuantity}}-->\n          <!--          </td>-->\n        </tr>\n      </tbody>\n\n      <tbody *ngIf=\"!stockReport\">\n        <!-- in case of all entity with group -->\n        <tr>\n          <td colspan=\"10\" class=\"text-center empty_table\">\n            <!--loading-->\n            <div class=\"mrT2 d-flex\" style=\"justify-content: center;align-items: center; min-height: 200px;\">\n              <div class=\"giddh-spinner vertical-center-spinner\"></div>\n            </div>\n          </td>\n        </tr>\n      </tbody>\n\n      <tbody *ngIf=\"stockReport && stockReport.count < 1\" class=\"table-border\">\n        <tr>\n          <td colspan=\"10\" class=\"text-center empty_table\">\n            <img src=\"assets/images/search-data-not-found.svg\" />\n            <h1>No Report Found !!</h1>\n          </td>\n        </tr>\n      </tbody>\n      <tfoot *ngIf=\"stockReport && stockReport.totalPages > 1\">\n        <tr>\n          <td colspan=\"10\" class=\"text-center\">\n            <pagination [totalItems]=\"stockReport.totalPages\" [(ngModel)]=\"stockReport.page\" [maxSize]=\"6\"\n              class=\"pagination-sm\" [boundaryLinks]=\"true\" [itemsPerPage]=\"1\" [rotate]=\"false\"\n              (pageChanged)=\"pageChanged($event)\"></pagination>\n          </td>\n        </tr>\n      </tfoot>\n    </table>\n  </section>\n\n\n\n  <!-- sticky Footer -->\n  <section class=\"mt-5\" *ngIf=\"stockReport && stockReport.transactions && stockReport.transactions.length>0\">\n    <!-- <span>{{activeGroupName}} Value:</span> -->\n    <div class=\"sticky-footer stickyFooterSaleAmount\">\n      <div class=\"innerContentFooter\">\n\n        <div class=\"row\">\n          <div class=\"col-sm-2 pr-0\">\n            <div class=\"row\">\n              <div class=\"col-xs-10 p0\">\n                <h4 class=\"text-light\">Transaction Count</h4>\n              </div>\n              <div class=\"col-xs-2 p0\">\n                <h4 class=\"text-orange text-left\">\n                  &nbsp;{{stockReport.inwardBalance.transactionCount + stockReport.outwardBalance.transactionCount}}\n                </h4>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-xs-10 p0\">\n                <h4>Inward</h4>\n              </div>\n              <div class=\"col-xs-2 p0\">\n                <h4 class=\"text-left\">\n                  &nbsp;<span\n                    *ngIf=\"stockReport.inwardBalance.transactionCount\">{{stockReport.inwardBalance.transactionCount}}</span><span\n                    *ngIf=\"!stockReport.inwardBalance.transactionCount\">0</span>\n                </h4>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-xs-10 p0\">\n                <h4>Outward</h4>\n              </div>\n              <div class=\"col-xs-2 p0\">\n                <h4 class=\"text-left\">\n                  &nbsp;<span\n                    *ngIf=\"stockReport.outwardBalance.transactionCount\">{{stockReport.outwardBalance.transactionCount}}</span><span\n                    *ngIf=\"!stockReport.outwardBalance.transactionCount\">0</span></h4>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"col-sm-9\">\n            <div class=\"flex-col\">\n              <div class=\"cont\">\n                <h4 class=\"text-light\">Opening</h4>\n                <h2>{{stockReport.openingBalance.amount}}</h2>\n                <h4>({{stockReport.openingBalance.quantity}}\n                  {{stockReport.openingBalance.stockUnit}})</h4>\n              </div>\n\n            </div>\n            <div class=\"flex-col\">\n              <!--              <div class=\"text-center operators\">+</div>-->\n            </div>\n            <div class=\"flex-col\">\n              <div class=\"cont\">\n                <h4 class=\"text-light\">Inward</h4>\n                <h2>{{stockReport.inwardBalance.amount}}</h2>\n                <h4>({{stockReport.inwardBalance.quantity}}\n                  {{stockReport.inwardBalance.stockUnit}})</h4>\n              </div>\n            </div>\n            <div class=\"flex-col\">\n              <!--              <div class=\"text-center operators\">-</div>-->\n            </div>\n            <div class=\"flex-col\">\n              <div class=\"cont\">\n                <h4 class=\"text-light\">Outward</h4>\n                <h2>{{stockReport.outwardBalance.amount}}</h2>\n                <h4>({{stockReport.outwardBalance.quantity}}\n                  {{stockReport.outwardBalance.stockUnit}})</h4>\n              </div>\n            </div>\n            <div class=\"flex-col\">\n              <!--              <div class=\"text-center operators\">=</div>-->\n            </div>\n            <div class=\"flex-col\">\n              <div class=\"cont\">\n                <h4 class=\"text-light\">Closing Stock </h4>\n                <h2 class=\"text-orange\">{{stockReport.closingBalance.amount}}</h2>\n                <h4>({{stockReport.closingBalance.quantity}}\n                  {{stockReport.closingBalance.stockUnit}})</h4>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n</section>\n<!-- aside menu section -->\n<div class=\"aside-overlay\" *ngIf=\"asideMenuState === 'in'\"></div>\n<aside-pane [class]=\"asideMenuState\" [@slideInOut]=\"asideMenuState\" (closeAsideEvent)=\"toggleAsidePane()\"></aside-pane>\n<!-- aside menu section -->\n\n<!-- Advance search popup -->\n<div bsModal #advanceSearchModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header themeBg clearfix\">\n        <h3 class=\"modal-title bg\" id=\"modal-title\">Advance Search</h3>\n        <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"advanceSearchAction('cancel')\">×</span>\n      </div>\n      <div class=\"modal-body Advance-Search clearfix\" *ngIf=\"advanceSearchModalShow\">\n        <form action=\"\" [formGroup]=\"advanceSearchForm\">\n          <div class=\"row\">\n            <div class=\"col-sm-4\">Date Range</div>\n            <div class=\"col-sm-8\">\n              <div class=\"input-group\">\n                <input type=\"text\" name=\"daterangeInput1\" daterangepicker [options]=\"datePickerOptions\"\n                  class=\"form-control\" (applyDaterangepicker)=\"selectedDate($event, 'advance')\" />\n                <div class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar bg-white\"></span></div>\n              </div>\n            </div>\n          </div>\n          <div class=\"row mrT2\">\n            <div class=\"col-sm-4\">Select Category</div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\">\n                <sh-select [options]=\"CategoryOptions\" (onClear)=\"clearShSelect('filterCategory')\" [multiple]=\"false\"\n                  [placeholder]=\"'Select Category'\" #shCategory formControlName=\"filterCategory\"\n                  (selected)=\"onDDElementSelect($event, 'filterCategory')\"></sh-select>\n              </div>\n            </div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\" *ngIf=\"stockReportRequest.param!=='qty_closing'\">\n                <sh-select [options]=\"CategoryTypeOptions\" (onClear)=\"clearShSelect('filterCategoryType')\"\n                  [multiple]=\"false\" [placeholder]=\"'Select Type'\" #shCategoryType formControlName=\"filterCategoryType\"\n                  (selected)=\"onDDElementSelect($event, 'filterCategoryType')\"></sh-select>\n              </div>\n              <input *ngIf=\"stockReportRequest.param==='qty_closing'\" readonly type=\"text\" class=\"form-control\"\n                value=\"Quantity\" />\n            </div>\n          </div>\n          <div class=\"row mrT2\">\n            <div class=\"col-sm-4\">Value</div>\n            <div class=\"col-sm-4\">\n              <div class=\"select-style middle\">\n                <sh-select [options]=\"FilterValueCondition\" (onClear)=\"clearShSelect('filterValueCondition')\"\n                  [multiple]=\"false\" [placeholder]=\"'Select Type'\" #shValueCondition\n                  formControlName=\"filterValueCondition\" (selected)=\"onDDElementSelect($event, 'filterValueCondition')\">\n                </sh-select>\n              </div>\n            </div>\n            <div class=\"col-sm-4\">\n              <input type=\"text\" class=\"form-control\" (keyup)=\"mapAdvFilters()\" placeholder=\"Amount\" maxlength=\"16\"\n                formControlName=\"filterAmount\">\n              <small *ngIf=\"advanceSearchForm.controls['filterAmount'].invalid\" class=\"text-danger\">input number\n                only\n              </small>\n            </div>\n          </div>\n\n          <div class=\"row mrT4 mrB3\">\n            <div class=\"col-xs-12 text-right\">\n              <button class=\"btn btn-success\" type=\"button\"\n                [disabled]=\"!isFilterCorrect || !stockReportRequest.param || !stockReportRequest.expression || !stockReportRequest.val\"\n                (click)=\"advanceSearchAction('search')\">Search\n              </button>\n              <button class=\"btn btn-danger\" type=\"button\" (click)=\"advanceSearchAction('clear')\">Clear</button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- Advance  search popup -->\n"

/***/ }),

/***/ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.scss":
/*!**************************************************************************************************!*\
  !*** ./src/app/inventory/components/stock-report-component/inventory.stockreport.component.scss ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".bdrT {\n  border-color: #ccc; }\n\n.flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto; }\n\n.d-flex {\n  display: -webkit-box;\n  display: flex; }\n\n/*td-in-searchbox_style*/\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox div span {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-left: 8px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox .input-container {\n  position: relative; }\n\n.td_in_searchBox .input-container input {\n  min-height: 38px;\n  width: 100%;\n  padding: 8px;\n  padding-right: 40px;\n  border: 0px; }\n\n.td_in_searchBox .input-container i {\n  position: absolute;\n  right: 0px;\n  top: 9px; }\n\n.basic > thead > tr > th {\n  border-right: 1px solid #cdcdcd; }\n\n.icon-pointer .glyphicon {\n  cursor: pointer; }\n\n.icon-pointer .glyphicon:hover {\n  color: #ff5f00; }\n\n.td_in_searchBox div i:hover {\n  color: #ff5f00; }\n\n.dropdown-menu > li > a:hover {\n  color: #ff5e01;\n  background: #f4f5f8; }\n\n.stock-input {\n  background-color: transparent !important;\n  border-bottom: 1px dotted black !important;\n  border: none;\n  width: auto;\n  padding: 0 !important;\n  height: auto;\n  text-align: center;\n  min-width: 155px; }\n\n.footer-tr td {\n  background-color: #e5e5e5; }\n\n.total-footer {\n  background-color: white;\n  display: -webkit-box;\n  display: flex; }\n\n.total-footer .footitem {\n    padding: 41px; }\n\n.total-footer .footitem h2 {\n      color: #8f9091;\n      font-size: 20px;\n      margin-bottom: 10px; }\n\n.total-footer .footitem h1 {\n      font-size: 32px; }\n\n.Journal_Voucher {\n  color: #c4c0c0; }\n\n.Transfer {\n  color: #ff5f00; }\n\n.Purchase {\n  color: #0c8fe6; }\n\n.Sales {\n  color: #229e2b; }\n\n.Journal_Voucher {\n  color: #c4c0c0; }\n\n/* class name same as what we are getting data */\n\n.TRANSFER {\n  color: #ff5f00; }\n\n.PURCHASE {\n  color: #0c8fe6; }\n\n.SALES {\n  color: #229e2b; }\n\n.MANUFACTURE {\n  color: #ff5f00; }\n\n.JOURNAL {\n  color: #19c2d0; }\n\n.CREDIT {\n  color: #0467a8; }\n\n.DEBIT {\n  color: #f6b232; }\n\n.modal-content {\n  border-radius: 0px;\n  margin-top: 200px; }\n\n.btn-download {\n  font-size: 14px; }\n\n.btn-group.open.show {\n  display: inline-block !important; }\n\n.dropdown-menu.dropdown-menu-download {\n  min-width: 110px;\n  border-radius: 0px; }\n\n.dropdown-menu-download li {\n  cursor: pointer; }\n\n/* voucher type DDL */\n\n.c-3 {\n  color: #333333; }\n\n.btn-group-voucher-type {\n  width: 100%; }\n\n.btn-group-voucher-type button {\n    text-align: left;\n    width: 100%; }\n\n.btn-group-voucher-type button:focus, .btn-group-voucher-type button:hover {\n      text-decoration: none; }\n\n.btn-group-voucher-type .pull-right {\n    margin-top: 5px; }\n\n.voucher-type {\n  width: 115%;\n  right: -7.5% !important;\n  top: 118% !important;\n  border-radius: 0px;\n  padding: 0px; }\n\n.voucher-type input[type=\"checkbox\"]:after {\n    border: 1px solid #cccccc;\n    width: 15px;\n    height: 15px;\n    top: 2px; }\n\n.voucher-type input[type=\"checkbox\"]:before {\n    top: 5px;\n    width: 9px;\n    height: 5px;\n    border: 1px solid #ff5f00;\n    border-top-style: none;\n    border-right-style: none; }\n\n.voucher-type li {\n    color: #333333;\n    padding: 3px 7px !important;\n    font-size: 12px; }\n\n.voucher-type li:last-child {\n    border: none;\n    padding-bottom: 6px !important; }\n\nbutton[aria-expanded=\"true\"] i {\n  color: #ff5f00; }\n\n/* voucher type DDL */\n\n.capitalize {\n  text-transform: capitalize; }\n\n.table-border {\n  border: 1px solid #c6c6c6; }\n\n.bdrN {\n  border: none !important; }\n\n.unit-badge {\n  display: inline-block;\n  min-width: 30px;\n  text-align: left;\n  padding-left: 3px;\n  text-transform: lowercase; }\n\n.icon-pointer .fa-long-arrow-up,\n.icon-pointer .fa-long-arrow-down {\n  line-height: 20px;\n  width: 15px;\n  color: #a9a9a9; }\n\n.icon-pointer .activeTextColor {\n  color: #ff5200; }\n\n.stickyFooterSaleAmount .innerContentFooter {\n  padding-left: 260px;\n  padding-right: 80px;\n  min-height: 60px; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col {\n    display: -webkit-inline-box;\n    display: inline-flex;\n    -webkit-box-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n            align-items: center;\n    vertical-align: middle; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col:nth-child(odd) {\n    min-width: 120px; }\n\n.stickyFooterSaleAmount .innerContentFooter .flex-col:nth-child(even) {\n    min-width: 50px; }\n\n.stickyFooterSaleAmount .innerContentFooter .operators {\n    font-size: 39px;\n    color: #8f9091; }\n\n.stickyFooterSaleAmount .innerContentFooter h2 {\n    font-size: 18px;\n    line-height: 20px; }\n\n.stickyFooterSaleAmount .innerContentFooter h3 {\n    font-size: 14px;\n    line-height: 20px; }\n\n.stickyFooterSaleAmount .innerContentFooter h4 {\n    font-size: 14px;\n    line-height: 20px; }\n\n.select-style select {\n  width: 100% !important; }\n\n.text-orange {\n  color: #ff5f00; }\n\n.bg-white {\n  background: white; }\n\n.btn-link-2 {\n  color: #0c8fe6; }\n\n.mB100 {\n  margin-bottom: 100px; }\n"

/***/ }),

/***/ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory/components/stock-report-component/inventory.stockreport.component.ts ***!
  \************************************************************************************************/
/*! exports provided: InventoryStockReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryStockReportComponent", function() { return InventoryStockReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/stocks-report.actions */ "./src/app/actions/inventory/stocks-report.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");





















var InventoryStockReportComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function InventoryStockReportComponent(store, route, sideBarAction, stockReportActions, router, _toasty, inventoryService, fb, inventoryAction, settingsBranchActions, invViewService, cdr) {
        this.store = store;
        this.route = route;
        this.sideBarAction = sideBarAction;
        this.stockReportActions = stockReportActions;
        this.router = router;
        this._toasty = _toasty;
        this.inventoryService = inventoryService;
        this.fb = fb;
        this.inventoryAction = inventoryAction;
        this.settingsBranchActions = settingsBranchActions;
        this.invViewService = invViewService;
        this.cdr = cdr;
        this.today = new Date();
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_12__;
        this.activeStockName = null;
        this.asideMenuState = 'out';
        this.isWarehouse = false;
        this.selectedEntity = 'all';
        this.selectedTransactionType = 'all';
        this.showAdvanceSearchIcon = false;
        this.accountUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.showAccountSearch = false;
        this.entityAndInventoryTypeForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormGroup"]({});
        this.filterCategory = null;
        this.filterCategoryType = null;
        this.filterValueCondition = null;
        this.isFilterCorrect = false;
        this.stockUniqueNameFromURL = null;
        this._DDMMYYYY = 'DD-MM-YYYY';
        this.transactionTypes = [
            { uniqueName: 'purchase_and_sales', name: 'Purchase & Sales' },
            { uniqueName: 'transfer', name: 'Transfer' },
            { uniqueName: 'all', name: 'All Transactions' },
        ];
        this.VOUCHER_TYPES = [
            {
                "value": "SALES",
                "label": "Sales",
                "checked": true
            },
            {
                "value": "PURCHASE",
                "label": "Purchase",
                "checked": true
            },
            {
                "value": "MANUFACTURING",
                "label": "Manufacturing",
                "checked": true
            },
            {
                "value": "TRANSFER",
                "label": "Transfer",
                "checked": true
            },
            {
                "value": "JOURNAL",
                "label": "Journal Voucher",
                "checked": true
            },
            {
                "value": "CREDIT_NOTE",
                "label": "Credit Note",
                "checked": true
            },
            {
                "value": "DEBIT_NOTE",
                "label": "Debit Note",
                "checked": true
            }
        ];
        this.CategoryOptions = [
            {
                value: "dr",
                label: "Inwards",
                disabled: false
            },
            {
                value: "cr",
                label: "Outwards",
                disabled: false
            },
            {
                value: "dr",
                label: "Opening Stock",
                disabled: false
            },
            {
                value: "cr",
                label: "Closing Stock",
                disabled: false
            }
        ];
        this.CategoryTypeOptions = [
            {
                value: "qty",
                label: "Quantity",
                disabled: false
            },
            {
                value: "amt",
                label: "Amount",
                disabled: false
            }
        ];
        this.FilterValueCondition = [
            {
                value: "equal",
                label: "Equals",
                disabled: false
            },
            {
                value: "greater_than",
                label: "Greater than",
                disabled: false
            },
            {
                value: "less_than",
                label: "Less than",
                disabled: false
            },
            {
                value: "not_equals",
                label: "Excluded",
                disabled: false
            }
        ];
        this.datePickerOptions = {
            hideOnEsc: true,
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
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(1, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 7 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(6, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 30 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(29, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 6 Months': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(6, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ],
                'Last 1 Year': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(12, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_12__()
                ]
            },
            startDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__().subtract(30, 'days'),
            endDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__()
        };
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_10__["ReplaySubject"](1);
        this.advanceSearchModalShow = false;
        this.stockReport$ = this.store.select(function (p) { return p.inventory.stockReport; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["publishReplay"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["refCount"])());
        this.stockReportRequest = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_4__["StockReportRequest"]();
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$));
        this.entityAndInventoryTypeForm = this.fb.group({
            selectedEntity: ['allEntity'],
            selectedTransactionType: ['all']
        });
    }
    InventoryStockReportComponent.prototype.findStockNameFromId = function (grps, stockUniqueName) {
        if (grps && grps.length > 0) {
            for (var _i = 0, grps_1 = grps; _i < grps_1.length; _i++) {
                var key = grps_1[_i];
                if (key.stocks && key.stocks.length > 0) {
                    var index = key.stocks.findIndex(function (p) { return p.uniqueName === stockUniqueName; });
                    if (index === -1) {
                        var result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
                        if (result !== '') {
                            return result;
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        this.activeStockName = key.stocks[index].name;
                        return key.stocks[index].name;
                    }
                }
                else {
                    var result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
                    if (result !== '') {
                        return result;
                    }
                    else {
                        continue;
                    }
                }
            }
            return '';
        }
        return '';
    };
    InventoryStockReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.route.firstChild) {
            this.route.firstChild.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1)).subscribe(function (s) {
                if (s) {
                    _this.groupUniqueName = s.groupUniqueName;
                    _this.stockUniqueName = s.stockUniqueName;
                    _this.initReport();
                }
            });
        }
        // get view from sidebar while clicking on group/stock
        this.invViewService.getActiveView().subscribe(function (v) {
            _this.initVoucherType();
            _this.groupUniqueName = v.groupUniqueName;
            _this.stockUniqueName = v.stockUniqueName;
            _this.selectedEntity = 'allEntity';
            _this.selectedTransactionType = 'all';
            if (_this.groupUniqueName) {
                _this.store.dispatch(_this.sideBarAction.SetActiveStock(_this.stockUniqueName));
                if (_this.groupUniqueName && _this.stockUniqueName) {
                    _this.store.select(function (p) {
                        return _this.findStockNameFromId(p.inventory.groupsWithStocks, _this.stockUniqueName);
                    }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1)).subscribe(function (p) { return _this.activeStock$ = p; });
                    _this.initReport();
                }
            }
        });
        this.stockReport$.subscribe(function (res) {
            _this.stockReport = res;
            _this.cdr.detectChanges();
        });
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[0]).format(_this._DDMMYYYY);
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[1]).format(_this._DDMMYYYY);
                _this.getStockReport(true);
            }
        });
        this.selectedCompany$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_16__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.session.companyUniqueName; }], function (companies, uniqueName) {
            if (!companies) {
                return;
            }
            var selectedCmp = companies.find(function (cmp) {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                }
                else {
                    return false;
                }
            });
            if (!selectedCmp) {
                return;
            }
            if (selectedCmp) {
                // console.log(selectedCmp);
            }
            _this.getAllBranch();
            return selectedCmp;
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$));
        this.selectedCompany$.subscribe();
        this.accountUniqueNameInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.isFilterCorrect = true;
                _this.stockReportRequest.accountName = s;
                _this.getStockReport(true);
                if (s === '') {
                    _this.showAccountSearch = false;
                }
            }
        });
        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].pattern('[-0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
            filterCategoryType: [''],
            filterValueCondition: ['']
        });
        this.resetFilter(false);
    };
    InventoryStockReportComponent.prototype.handleKeyboardEvent = function (event) {
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.toggleAsidePane();
        }
    };
    InventoryStockReportComponent.prototype.initReport = function () {
        // this.fromDate = moment().add(-1, 'month').format(this._DDMMYYYY);
        // this.toDate = moment().format(this._DDMMYYYY);
        // this.stockReportRequest.from = moment().add(-1, 'month').format(this._DDMMYYYY);
        // this.stockReportRequest.to = moment().format(this._DDMMYYYY);
        // this.datePickerOptions.startDate = moment().add(-1, 'month').toDate();
        // this.datePickerOptions.endDate = moment().toDate();
        this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
        this.stockReportRequest.stockUniqueName = this.stockUniqueName;
        this.stockReportRequest.transactionType = 'all';
        this.store.dispatch(this.stockReportActions.GetStocksReport(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.stockReportRequest)));
    };
    InventoryStockReportComponent.prototype.getStockReport = function (resetPage) {
        this.stockReportRequest.from = this.fromDate || null;
        this.stockReportRequest.to = this.toDate || null;
        this.invViewService.setActiveDate(this.stockReportRequest.from, this.stockReportRequest.to);
        if (resetPage) {
            this.stockReportRequest.page = 1;
        }
        if (!this.stockReportRequest.stockGroupUniqueName || !this.stockReportRequest.stockUniqueName) {
            return;
        }
        if (!this.stockReportRequest.expression || !this.stockReportRequest.param || !this.stockReportRequest.val) {
            delete this.stockReportRequest.expression;
            delete this.stockReportRequest.param;
            delete this.stockReportRequest.val;
        }
        this.store.dispatch(this.stockReportActions.GetStocksReport(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["cloneDeep"](this.stockReportRequest)));
    };
    /**
     * getAllBranch
     */
    InventoryStockReportComponent.prototype.getAllBranch = function () {
        var _this = this;
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_16__["createSelector"])([function (state) { return state.settings.branches; }], function (entities) {
            if (entities) {
                if (entities.results.length) {
                    if (_this.selectedCmp && entities.results.findIndex(function (p) { return p.uniqueName === _this.selectedCmp.uniqueName; }) === -1) {
                        _this.selectedCmp['label'] = _this.selectedCmp.name;
                        entities.results.push(_this.selectedCmp);
                    }
                    entities.results.forEach(function (element) {
                        element['label'] = element.name;
                    });
                    _this.entities$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_13__["orderBy"](entities.results, 'name'));
                }
                else if (entities.results.length === 0) {
                    _this.entities$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_10__["of"])(null);
                }
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe();
    };
    InventoryStockReportComponent.prototype.initVoucherType = function () {
        var _this = this;
        // initialization for voucher type array inially all selected
        this.stockReportRequest.voucherTypes = [];
        this.VOUCHER_TYPES.forEach(function (element) {
            element.checked = true;
            _this.stockReportRequest.voucherTypes.push(element.value);
        });
    };
    InventoryStockReportComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    InventoryStockReportComponent.prototype.ngAfterViewInit = function () {
        this.store.select(function (p) { return p.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1)).subscribe(function (a) {
            if (!a) {
                // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
            }
        });
    };
    InventoryStockReportComponent.prototype.goToManageStock = function () {
        if (this.groupUniqueName && this.stockUniqueName) {
            this.store.dispatch(this.inventoryAction.showLoaderForStock());
            this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, false, true);
            // this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName, 'add-stock', this.stockUniqueName]);
        }
    };
    InventoryStockReportComponent.prototype.nextPage = function () {
        this.stockReportRequest.page++;
        this.getStockReport(false);
    };
    InventoryStockReportComponent.prototype.prevPage = function () {
        this.stockReportRequest.page--;
        this.getStockReport(false);
    };
    InventoryStockReportComponent.prototype.closeFromDate = function (e) {
        if (this.showFromDatePicker) {
            this.showFromDatePicker = false;
        }
    };
    InventoryStockReportComponent.prototype.closeToDate = function (e) {
        if (this.showToDatePicker) {
            this.showToDatePicker = false;
        }
    };
    InventoryStockReportComponent.prototype.selectedDate = function (value, from) {
        this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(value.picker.startDate).format(this._DDMMYYYY);
        this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(value.picker.endDate).format(this._DDMMYYYY);
        this.pickerSelectedFromDate = value.picker.startDate;
        this.pickerSelectedToDate = value.picker.endDate;
        if (!from) {
            this.isFilterCorrect = true;
            this.getStockReport(true);
        }
    };
    /**
     * setInventoryAsideState
     */
    InventoryStockReportComponent.prototype.setInventoryAsideState = function (isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: isOpen, isGroup: isGroup, isUpdate: isUpdate }));
    };
    InventoryStockReportComponent.prototype.pageChanged = function (event) {
        this.stockReportRequest.page = event.page;
        this.getStockReport(false);
    };
    InventoryStockReportComponent.prototype.sortButtonClicked = function (type, columnName) {
        if (this.stockReportRequest.sort !== type || this.stockReportRequest.sortBy !== columnName) {
            this.stockReportRequest.sort = type;
            this.stockReportRequest.sortBy = columnName;
            this.getStockReport(true);
        }
        this.isFilterCorrect = true;
    };
    InventoryStockReportComponent.prototype.filterByCheck = function (type, event) {
        var idx = this.stockReportRequest.voucherTypes.indexOf('ALL');
        if (idx !== -1) {
            this.initVoucherType();
        }
        if (event && type) {
            this.stockReportRequest.voucherTypes.push(type);
        }
        else {
            var index = this.stockReportRequest.voucherTypes.indexOf(type);
            if (index !== -1) {
                this.stockReportRequest.voucherTypes.splice(index, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes.length > 0 && this.stockReportRequest.voucherTypes.length < this.VOUCHER_TYPES.length) {
            idx = this.stockReportRequest.voucherTypes.indexOf('ALL');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
            idx = this.stockReportRequest.voucherTypes.indexOf('NONE');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes.length === this.VOUCHER_TYPES.length) {
            this.stockReportRequest.voucherTypes = ['ALL'];
        }
        if (this.stockReportRequest.voucherTypes.length === 0) {
            this.stockReportRequest.voucherTypes = ['NONE'];
        }
        this.getStockReport(true);
        this.isFilterCorrect = true;
    };
    InventoryStockReportComponent.prototype.clickedOutside = function (event, el, fieldName) {
        if (fieldName === 'account') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        }
        else {
            if (fieldName === 'account') {
                this.showAccountSearch = false;
            }
        }
    };
    /* tslint:disable */
    InventoryStockReportComponent.prototype.childOf = function (c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    };
    InventoryStockReportComponent.prototype.downloadStockReports = function (type) {
        this.stockReportRequest.reportDownloadType = type;
        this._toasty.infoToast('Upcoming feature');
        // this.inventoryService.DownloadStockReport(this.stockReportRequest, this.stockUniqueName, this.groupUniqueName)
        //   .subscribe(d => {
        //     if (d.status === 'success') {
        //       if (type == 'xls') {
        //         let blob = base64ToBlob(d.body, 'application/xls', 512);
        //         return saveAs(blob, `${this.stockUniqueName}.xlsx`);
        //       } else {
        //         let blob = base64ToBlob(d.body, 'application/csv', 512);
        //         return saveAs(blob, `${this.stockUniqueName}.csv`);
        //       }
        //     } else {
        //       this._toasty.errorToast(d.message);
        //     }
        //   });
    };
    // region asidemenu toggle
    InventoryStockReportComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    InventoryStockReportComponent.prototype.toggleAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    // From Entity Dropdown
    InventoryStockReportComponent.prototype.selectEntity = function (option) {
        this._toasty.infoToast('Upcoming feature');
        // this.stockReportRequest.branchDetails = option;
        // if (option.value === 'warehouse') {
        //   this.isWarehouse = true;
        // } else {
        //   this.isWarehouse = false;
        // }
        // this.getStockReport(true);
    };
    // From inventory type Dropdown
    InventoryStockReportComponent.prototype.selectTransactionType = function (inventoryType) {
        this.stockReportRequest.transactionType = inventoryType;
        this.getStockReport(true);
    };
    // focus on click search box
    InventoryStockReportComponent.prototype.showAccountSearchBox = function () {
        var _this = this;
        this.showAccountSearch = !this.showAccountSearch;
        setTimeout(function () {
            _this.accountName.nativeElement.focus();
            _this.accountName.nativeElement.value = null;
        }, 200);
    };
    //******* Advance search modal *******//
    InventoryStockReportComponent.prototype.resetFilter = function (isReset) {
        var _this = this;
        this.isFilterCorrect = false;
        this.stockReportRequest.sort = null;
        this.stockReportRequest.sortBy = null;
        this.stockReportRequest.accountName = null;
        this.showAccountSearch = false;
        this.stockReportRequest.val = null;
        this.stockReportRequest.param = null;
        this.stockReportRequest.expression = null;
        if (this.accountName) {
            this.accountName.nativeElement.value = null;
        }
        this.initVoucherType();
        this.advanceSearchForm.controls['filterAmount'].setValue(null);
        //Reset Date with universal date
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.fromDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[0]).format(_this._DDMMYYYY);
                _this.toDate = moment_moment__WEBPACK_IMPORTED_MODULE_12__(a[1]).format(_this._DDMMYYYY);
            }
        });
        //Reset Date
        if (isReset) {
            this.getStockReport(true);
        }
    };
    InventoryStockReportComponent.prototype.onOpenAdvanceSearch = function () {
        this.advanceSearchModalShow = true;
        this.advanceSearchModel.show();
    };
    InventoryStockReportComponent.prototype.advanceSearchAction = function (type) {
        if (type === 'cancel') {
            this.advanceSearchModalShow = true;
            this.clearModal();
            this.advanceSearchModel.hide();
            return;
        }
        else if (type === 'clear') {
            this.clearModal();
            return;
        }
        if (this.isFilterCorrect) {
            this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.datePickerOptions, { startDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__(this.pickerSelectedFromDate).toDate(), endDate: moment_moment__WEBPACK_IMPORTED_MODULE_12__(this.pickerSelectedToDate).toDate() });
            this.advanceSearchModalShow = false;
            this.advanceSearchModel.hide();
            this.getStockReport(true);
        }
    };
    InventoryStockReportComponent.prototype.clearModal = function () {
        if (this.stockReportRequest.param || this.stockReportRequest.val || this.stockReportRequest.expression) {
            this.shCategory.clear();
            if (this.shCategoryType) {
                this.shCategoryType.clear();
            }
            this.shValueCondition.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);
            this.getStockReport(true);
        }
        if (this.stockReportRequest.sortBy || this.stockReportRequest.accountName || this.accountName.nativeElement.value) {
            // do something...
        }
        else {
            this.isFilterCorrect = false;
        }
    };
    /**
     * onDDElementSelect
     */
    InventoryStockReportComponent.prototype.clearShSelect = function (type) {
        switch (type) {
            case 'filterCategory': // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = null;
                this.stockReportRequest.val = null;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = null;
                this.stockReportRequest.param = null;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = null;
                this.stockReportRequest.expression = null;
                break;
        }
        this.mapAdvFilters();
    };
    InventoryStockReportComponent.prototype.onDDElementSelect = function (event, type) {
        switch (type) {
            case 'filterCategory': // inwards/outwards/opening/closing
                this.filterCategory = event.value;
                break;
            case 'filterCategoryType': // value/quantity
                this.filterCategoryType = event.value;
                break;
            case 'filterValueCondition': // =, <, >, !
                this.filterValueCondition = event.value;
                break;
        }
        if (type === 'filterCategory' && event.label === 'Closing Stock') {
            this.stockReportRequest.param = 'qty_closing';
            this.filterCategoryType = null;
        }
        else if (type === 'filterCategory' && event.label !== 'Closing Stock') {
            this.stockReportRequest.param = null;
        }
        else {
        }
        this.mapAdvFilters(this.stockReportRequest.param);
    };
    InventoryStockReportComponent.prototype.downloadAllInventoryReports = function (reportType, reportFormat) {
        var _this = this;
        console.log('Called : download', reportType, 'format', reportFormat);
        var obj = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_4__["InventoryDownloadRequest"]();
        if (this.stockReportRequest.stockGroupUniqueName) {
            obj.stockGroupUniqueName = this.stockReportRequest.stockGroupUniqueName;
        }
        if (this.stockReportRequest) {
            obj.stockUniqueName = this.stockReportRequest.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        this.inventoryService.downloadAllInventoryReports(obj)
            .subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.infoToast(res.body);
            }
            else {
                _this._toasty.errorToast(res.message);
            }
        });
    };
    InventoryStockReportComponent.prototype.mapAdvFilters = function (param) {
        if (!param) {
            if (this.filterCategoryType && this.filterCategory) { // creating value for key parma like "qty_cr", "amt_cr"
                this.stockReportRequest.param = this.filterCategoryType + '_' + this.filterCategory;
            }
        }
        if (this.filterValueCondition) { // expressions less_than, greator_than etc
            this.stockReportRequest.expression = this.filterValueCondition;
        }
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) {
            this.stockReportRequest.val = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
        }
        else {
            this.stockReportRequest.val = null;
        }
        if (this.stockReportRequest.sortBy || this.stockReportRequest.accountName || this.accountName.nativeElement.value || this.stockReportRequest.param || this.stockReportRequest.expression || this.stockReportRequest.val) {
            this.isFilterCorrect = true;
        }
        else {
            this.isFilterCorrect = false;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('advanceSearchModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_18__["ModalDirective"])
    ], InventoryStockReportComponent.prototype, "advanceSearchModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('accountName'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ElementRef"])
    ], InventoryStockReportComponent.prototype, "accountName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('shCategory'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryStockReportComponent.prototype, "shCategory", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('shCategoryType'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryStockReportComponent.prototype, "shCategoryType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('shValueCondition'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_20__["ShSelectComponent"])
    ], InventoryStockReportComponent.prototype, "shValueCondition", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["HostListener"])('document:keyup', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [KeyboardEvent]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], InventoryStockReportComponent.prototype, "handleKeyboardEvent", null);
    InventoryStockReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["Component"])({
            selector: 'invetory-stock-report',
            template: __webpack_require__(/*! ./inventory.stockreport.component.html */ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./inventory.stockreport.component.scss */ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_8__["SidebarAction"],
            _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_5__["StockReportActions"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_1__["ToasterService"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_2__["InventoryService"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormBuilder"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_14__["InventoryAction"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_17__["SettingsBranchActions"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_19__["InvViewService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_7__["ChangeDetectorRef"]])
    ], InventoryStockReportComponent);
    return InventoryStockReportComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/update-group-component/inventory.updategroup.component.html":
/*!**************************************************************************************************!*\
  !*** ./src/app/inventory/components/update-group-component/inventory.updategroup.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-6 col-md-6 col-lg-4\">\n  <div class=\"row\">\n    <inventory-add-group [addGroup]=\"false\"></inventory-add-group>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/components/update-group-component/inventory.updategroup.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/inventory/components/update-group-component/inventory.updategroup.component.ts ***!
  \************************************************************************************************/
/*! exports provided: InventoryUpdateGroupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryUpdateGroupComponent", function() { return InventoryUpdateGroupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var InventoryUpdateGroupComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function InventoryUpdateGroupComponent() {
        //
    }
    InventoryUpdateGroupComponent.prototype.ngOnInit = function () {
        //
    };
    InventoryUpdateGroupComponent.prototype.ngOnDestroy = function () {
        //
    };
    InventoryUpdateGroupComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'inventory-update-group',
            template: __webpack_require__(/*! ./inventory.updategroup.component.html */ "./src/app/inventory/components/update-group-component/inventory.updategroup.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], InventoryUpdateGroupComponent);
    return InventoryUpdateGroupComponent;
}());



/***/ }),

/***/ "./src/app/inventory/components/welcome-inventory/welcome-inventory.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/inventory/components/welcome-inventory/welcome-inventory.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-6 col-xs-offset-3 text-center\">\n  <div class=\"illustration_box\">\n    <img src=\"assets/images/new/Inventory_welcome.svg\"/>\n    <h3 class=\"mrT1 fs18\"><strong>Manage your Inventory!</strong></h3>\n    <p class=\"mrT1\">Add & Manage product in the inventory</p>\n    <button class=\"btn btn-blue mrT2\" (click)=\"toggleAsidePane()\">Start</button>\n  </div>\n</div>\n\n<!-- aside menu section -->\n<div class=\"aside-overlay\" *ngIf=\"asideMenuState === 'in'\"></div>\n<aside-pane [class]=\"asideMenuState\" [@slideInOut]=\"asideMenuState\" (closeAsideEvent)=\"toggleAsidePane()\"></aside-pane>\n<!-- aside menu section -->"

/***/ }),

/***/ "./src/app/inventory/components/welcome-inventory/welcome-inventory.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/inventory/components/welcome-inventory/welcome-inventory.component.ts ***!
  \***************************************************************************************/
/*! exports provided: InventoryWelcomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryWelcomeComponent", function() { return InventoryWelcomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");




var InventoryWelcomeComponent = /** @class */ (function () {
    function InventoryWelcomeComponent() {
        this.asideMenuState = 'out';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        //
    }
    InventoryWelcomeComponent.prototype.ngOnInit = function () {
        //
    };
    // region asidemenu toggle
    InventoryWelcomeComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    InventoryWelcomeComponent.prototype.toggleAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    InventoryWelcomeComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    InventoryWelcomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'welcome-inventory',
            template: __webpack_require__(/*! ./welcome-inventory.component.html */ "./src/app/inventory/components/welcome-inventory/welcome-inventory.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out'))
                ]),
            ]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], InventoryWelcomeComponent);
    return InventoryWelcomeComponent;
}());



/***/ }),

/***/ "./src/app/inventory/inv.view.service.ts":
/*!***********************************************!*\
  !*** ./src/app/inventory/inv.view.service.ts ***!
  \***********************************************/
/*! exports provided: InvViewService, ViewSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvViewService", function() { return InvViewService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewSubject", function() { return ViewSubject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");



var InvViewService = /** @class */ (function () {
    function InvViewService() {
        this.viewSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.viewJobworkSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.viewDateSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
    }
    InvViewService.prototype.setActiveView = function (View, StockName, StockUniqueName, GroupUniqueName, groupIsOpen) {
        this.viewSubject.next({ view: View, stockName: StockName, stockUniqueName: StockUniqueName, groupUniqueName: GroupUniqueName, isOpen: groupIsOpen });
    };
    InvViewService.prototype.setJobworkActiveView = function (View, UniqueName, Name) {
        this.viewJobworkSubject.next({ view: View, uniqueName: UniqueName, name: Name });
    };
    InvViewService.prototype.setActiveDate = function (from, to) {
        this.viewDateSubject.next({ from: from, to: to });
    };
    InvViewService.prototype.clearMessage = function (type) {
        if (type === 'stock_group') {
            this.viewSubject.next();
        }
        else if (type === 'jobwork') {
            this.viewJobworkSubject.next();
        }
    };
    InvViewService.prototype.getActiveView = function () {
        return this.viewSubject.asObservable();
    };
    InvViewService.prototype.getJobworkActiveView = function () {
        return this.viewJobworkSubject.asObservable();
    };
    InvViewService.prototype.getActiveDate = function () {
        return this.viewDateSubject.asObservable();
    };
    InvViewService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' })
    ], InvViewService);
    return InvViewService;
}());

var ViewSubject = /** @class */ (function () {
    function ViewSubject() {
    }
    return ViewSubject;
}());



/***/ }),

/***/ "./src/app/inventory/inventory.component.html":
/*!****************************************************!*\
  !*** ./src/app/inventory/inventory.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div style=\"min-height:100%;\">\n  <div class=\"inventory-controll\">\n\n    <tabset #inventoryStaticTabs>\n\n      <tab heading=\"Inventory\" (select)=\"redirectUrlToActiveTab('inventory', $event)\" [active]=\"activeTabIndex === 0\">\n        <!--sidebar-->\n        <ng-container *ngIf=\"activeTabIndex === 0\">\n          <inventory-sidebar></inventory-sidebar>\n          <!--/sidebar-->\n\n          <section class=\"rightBar\">\n            <!-- uiView: inventory-detail -->\n            <section class=\"container-fluid  clearfix pdT2\">\n\n              <div *ngIf=\"activeView === 'stock'\">\n                <invetory-stock-report></invetory-stock-report>\n              </div>\n              <div *ngIf=\"activeView === 'group'\">\n                <invetory-group-stock-report></invetory-group-stock-report>\n              </div>\n              <div *ngIf=\"!activeView\">\n                <welcome-inventory></welcome-inventory>\n              </div>\n              <inventory-header>\n              </inventory-header>\n            </section>\n          </section>\n        </ng-container>\n\n      </tab>\n\n      <tab heading=\"Job Work\" (select)=\"redirectUrlToActiveTab('jobwork', $event)\" [active]=\"activeTabIndex === 1\">\n\n        <ng-container *ngIf=\"activeTabIndex === 1\">\n          <jobwork></jobwork>\n        </ng-container>\n\n      </tab>\n\n \n      <tab heading=\"Manufacturing\" (select)=\"redirectUrlToActiveTab('manufacturing', $event)\" [active]=\"activeTabIndex === 2\">\n  \n        <ng-container *ngIf=\"activeTabIndex === 2\">\n          <manufacturing></manufacturing>\n        </ng-container>\n\n      </tab>\n\n    </tabset>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/inventory/inventory.component.scss":
/*!****************************************************!*\
  !*** ./src/app/inventory/inventory.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".inventory-controll ::ng-deep.nav > li > a {\n  padding: 2px 0px !important;\n  margin-right: 25px !important; }\n\n.inventory-controll ::ng-deep.nav > li > a {\n  border-bottom: 2px solid transparent !important;\n  color: black !important;\n  border-top: transparent !important;\n  border-right: transparent !important;\n  border-left: transparent !important; }\n\n.inventory-controll ::ng-deep.nav.nav-tabs {\n  padding: 10px 0px 0 15px !important; }\n\n.inventory-controll ::ng-deep.nav-tabs > li > a:hover {\n  border-color: transparent !important; }\n\n.inventory-controll ::ng-deep.nav-tabs > ::ng-deep li.active > a, .nav-tabs > ::ng-deep li.active > a:focus, ::ng-deep.nav-tabs > li.active > a:hover {\n  color: #ff5200 !important;\n  border-bottom: 2px solid #ff5f00 !important;\n  cursor: pointer !important;\n  background-color: unset !important;\n  border-top: transparent !important;\n  border-right: transparent !important;\n  border-left: transparent !important; }\n\n.inventory-controll .nav-tabs > li > a:hover {\n  color: #ff5200 !important;\n  border-bottom: 2px solid #ff5f00 !important; }\n\n.navbar {\n  min-height: auto;\n  margin-bottom: 10px; }\n\n.inventory-controll ::ng-deep.nav > li > a:focus, ::ng-deep.nav > li > a:hover {\n  background-color: unset !important; }\n\n.rightBar {\n  width: calc(100% - 260px); }\n"

/***/ }),

/***/ "./src/app/inventory/inventory.component.ts":
/*!**************************************************!*\
  !*** ./src/app/inventory/inventory.component.ts ***!
  \**************************************************/
/*! exports provided: IsyncData, InventoryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsyncData", function() { return IsyncData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryComponent", function() { return InventoryComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _shared_header_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../shared/header/components */ "./src/app/shared/header/components/index.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../actions/inventory/stocks-report.actions */ "./src/app/actions/inventory/stocks-report.actions.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_21__);






















var IsyncData = [
    { label: 'Debtors', value: 'debtors' },
    { label: 'Creditors', value: 'creditors' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Taxes', value: 'taxes' },
    { label: 'Bank', value: 'bank' }
];
var InventoryComponent = /** @class */ (function () {
    function InventoryComponent(store, _inventoryAction, _companyActions, invoiceActions, settingsBranchActions, componentFactoryResolver, companyActions, settingsProfileActions, invViewService, router, route, stockReportActions, sideBarAction) {
        var _this = this;
        this.store = store;
        this._inventoryAction = _inventoryAction;
        this._companyActions = _companyActions;
        this.invoiceActions = invoiceActions;
        this.settingsBranchActions = settingsBranchActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this.companyActions = companyActions;
        this.settingsProfileActions = settingsProfileActions;
        this.invViewService = invViewService;
        this.router = router;
        this.route = route;
        this.stockReportActions = stockReportActions;
        this.sideBarAction = sideBarAction;
        this.dataSyncOption = IsyncData;
        this.currentBranch = null;
        this.currentBranchNameAlias = null;
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(false);
        this.confirmationMessage = '';
        this.parentCompanyName = null;
        this.selectedBranch = null;
        this.activeTab = 'inventory';
        this.activeView = null;
        this.activeTabIndex = 0;
        this.currentUrl = null;
        this.firstDefaultActiveGroup = null;
        this.firstDefaultActiveGroupName = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.currentUrl = this.router.url;
        if (this.currentUrl.indexOf('group') > 0) {
            this.activeView = "group";
        }
        else if (this.currentUrl.indexOf('stock') > 0) {
            this.activeView = "stock";
        }
        else {
            this.activeView = null;
        }
        this.activeStock$ = this.store.select(function (p) { return p.inventory.activeStock; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.activeGroup$ = this.store.select(function (p) { return p.inventory.activeGroup; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.groupsWithStocks$ = this.store.select(function (s) { return s.inventory.groupsWithStocks; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["isEmpty"](o)) {
                var companyInfo = _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["cloneDeep"](o);
                _this.currentBranch = companyInfo.name;
                _this.currentBranchNameAlias = companyInfo.nameAlias;
            }
        });
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_8__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.settings.branches; }, function (state) { return state.settings.parentCompany; }], function (companies, branches, parentCompany) {
            if (branches) {
                if (branches.results.length) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["each"](branches.results, function (branch) {
                        if (branch.gstDetails && branch.gstDetails.length) {
                            branch.gstDetails = [_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["find"](branch.gstDetails, function (gst) { return gst.addressList && gst.addressList[0] && gst.addressList[0].isDefault; })];
                        }
                    });
                    _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["orderBy"](branches.results, 'name'));
                }
                else if (branches.results.length === 0) {
                    _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(null);
                }
            }
            if (companies && companies.length && branches) {
                var companiesWithSuperAdminRole_1 = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["each"](companies, function (cmp) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["each"](cmp.userEntityRoles, function (company) {
                        if (company.entity.entity === 'COMPANY' && company.role.uniqueName === 'super_admin') {
                            if (branches && branches.results.length) {
                                var existIndx = branches.results.findIndex(function (b) { return b.uniqueName === cmp.uniqueName; });
                                if (existIndx === -1) {
                                    companiesWithSuperAdminRole_1.push(cmp);
                                }
                            }
                            else {
                                companiesWithSuperAdminRole_1.push(cmp);
                            }
                        }
                    });
                });
                _this.companies$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["orderBy"](companiesWithSuperAdminRole_1, 'name'));
            }
            if (parentCompany) {
                setTimeout(function () {
                    _this.parentCompanyName = parentCompany.name;
                }, 10);
            }
            else {
                setTimeout(function () {
                    _this.parentCompanyName = null;
                }, 10);
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe();
        // get view from sidebar while clicking on group/stock
        this.invViewService.getActiveView().subscribe(function (v) {
            _this.activeView = v.view;
        });
    }
    InventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isBranchVisible$ = this.store.select(function (s) { return s.inventory.showBranchScreen; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        document.querySelector('body').classList.add('inventorypage');
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.activeTabIndex = this.router.url.indexOf('jobwork') > -1 ? 1 : this.router.url.indexOf('manufacturing') > -1 ? 2 : 0;
        // if (this.router.url.indexOf('jobwork') > 0) {
        //   this.activeTabIndex = 1;
        //   this.redirectUrlToActiveTab('jobwork', null, 1, this.currentUrl);
        //   // get view from sidebar while clicking on group/stock
        //   this.invViewService.getJobworkActiveView().subscribe(v => {
        //     this.activeView = v.view;
        //   });
        // }
        // if (this.router.url.indexOf('manufacturing') > 0) {
        //   this.activeTabIndex = 2;
        //   this.redirectUrlToActiveTab('manufacturing', null, 2, this.currentUrl);
        // }
        this.router.events.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s instanceof _angular_router__WEBPACK_IMPORTED_MODULE_17__["NavigationEnd"]) {
                var index = s.url.indexOf('jobwork') > -1 ? 1 : s.url.indexOf('manufacturing') > -1 ? 2 : 0;
                if (_this.activeTabIndex !== index) {
                    _this.activeTabIndex = index;
                    _this.saveLastState();
                }
            }
        });
    };
    InventoryComponent.prototype.ngOnDestroy = function () {
        this.store.dispatch(this._inventoryAction.ResetInventoryState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
        //document.querySelector('body').classList.remove('inventoryPage');
    };
    InventoryComponent.prototype.ngAfterViewInit = function () {
        this.setDefaultGroup();
    };
    InventoryComponent.prototype.setDefaultGroup = function () {
        // for first time load, show first group report
        var _this = this;
        this.groupsWithStocks$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(2)).subscribe(function (a) {
            if (a && !_this.activeView) {
                _this.GroupStockReportRequest = new _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_3__["GroupStockReportRequest"]();
                var firstElement = a[0];
                if (firstElement) {
                    _this.GroupStockReportRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_21__().add(-1, 'month').format('DD-MM-YYYY');
                    _this.GroupStockReportRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_21__().format('DD-MM-YYYY');
                    _this.GroupStockReportRequest.stockGroupUniqueName = firstElement.uniqueName;
                    _this.activeView = 'group';
                    _this.firstDefaultActiveGroup = firstElement.uniqueName;
                    _this.firstDefaultActiveGroupName = firstElement.name;
                    _this.store.dispatch(_this.sideBarAction.GetInventoryGroup(firstElement.uniqueName)); // open first default group
                    _this.store.dispatch(_this.stockReportActions.GetGroupStocksReport(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["cloneDeep"](_this.GroupStockReportRequest))); // open first default group
                }
            }
        });
    };
    InventoryComponent.prototype.openCreateCompanyModal = function () {
        this.loadAddCompanyComponent();
        // this.addCompanyModal.show();
    };
    InventoryComponent.prototype.redirectUrlToActiveTab = function (type, event, activeTabIndex, currentUrl) {
        var _this = this;
        if (event) {
            if (!(event instanceof ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabDirective"])) {
                return;
            }
        }
        if (currentUrl) {
            this.router.navigateByUrl(this.currentUrl);
        }
        else {
            switch (type) {
                case 'inventory':
                    this.router.navigate(['/pages', 'inventory'], { relativeTo: this.route });
                    this.activeTabIndex = 0;
                    if (this.firstDefaultActiveGroup) {
                        this.invViewService.setActiveView('group', this.firstDefaultActiveGroupName, null, this.firstDefaultActiveGroup, true);
                        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.firstDefaultActiveGroup)); // open first default group
                    }
                    break;
                case 'jobwork':
                    this.router.navigate(['/pages', 'inventory', 'jobwork'], { relativeTo: this.route });
                    this.activeTabIndex = 1;
                    break;
                case 'manufacturing':
                    this.router.navigate(['/pages', 'inventory', 'manufacturing'], { relativeTo: this.route });
                    this.activeTabIndex = 2;
                    break;
            }
        }
        setTimeout(function () {
            if (activeTabIndex) {
                _this.inventoryStaticTabs.tabs[activeTabIndex].active = true;
            }
            else {
                _this.inventoryStaticTabs.tabs[_this.activeTabIndex].active = true;
            }
        });
    };
    InventoryComponent.prototype.hideAddCompanyModal = function () {
        // this.addCompanyModal.hide();
    };
    InventoryComponent.prototype.hideCompanyModalAndShowAddAndManage = function () {
        // this.addCompanyModal.hide();
    };
    InventoryComponent.prototype.loadAddCompanyComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_shared_header_components__WEBPACK_IMPORTED_MODULE_13__["CompanyAddComponent"]);
        var viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.createBranch = true;
        componentRef.instance.closeCompanyModal.subscribe(function (a) {
            _this.hideAddCompanyModal();
        });
        componentRef.instance.closeCompanyModalAndShowAddManege.subscribe(function (a) {
            _this.hideCompanyModalAndShowAddAndManage();
        });
    };
    InventoryComponent.prototype.openAddBranchModal = function () {
        this.branchModal.show();
    };
    InventoryComponent.prototype.onHide = function () {
        console.log('creat company modal is closed.');
        // let companyUniqueName = null;
        // this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
        // let stateDetailsRequest = new StateDetailsRequest();
        // stateDetailsRequest.companyUniqueName = companyUniqueName;
        // stateDetailsRequest.lastState = 'settings';
        // this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    InventoryComponent.prototype.hideAddBranchModal = function () {
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(false);
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        this.branchModal.hide();
    };
    InventoryComponent.prototype.selectAllCompanies = function (ev) {
        var _this = this;
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        if (ev.target.checked) {
            this.companies$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (companies) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["each"](companies, function (company) {
                    _this.selectedCompaniesUniquename.push(company.uniqueName);
                    _this.selectedCompaniesName.push(company);
                });
            });
        }
        this.isAllCompaniesSelected();
    };
    InventoryComponent.prototype.checkUncheckMe = function (cmp, ev) {
        if (ev.target.checked) {
            if (this.selectedCompaniesUniquename.indexOf(cmp.uniqueName) === -1) {
                this.selectedCompaniesUniquename.push(cmp.uniqueName);
            }
            if (cmp.name) {
                this.selectedCompaniesName.push(cmp);
            }
        }
        else {
            var indx = this.selectedCompaniesUniquename.indexOf(cmp.uniqueName);
            this.selectedCompaniesUniquename.splice(indx, 1);
            var idx = this.selectedCompaniesName.indexOf(cmp);
            this.selectedCompaniesName.splice(idx, 1);
        }
        this.isAllCompaniesSelected();
    };
    InventoryComponent.prototype.createBranches = function () {
        var dataToSend = { childCompanyUniqueNames: this.selectedCompaniesUniquename };
        this.store.dispatch(this.settingsBranchActions.CreateBranches(dataToSend));
        this.hideAddBranchModal();
    };
    InventoryComponent.prototype.removeBranch = function (branchUniqueName, companyName) {
        this.selectedBranch = branchUniqueName;
        this.confirmationMessage = "Are you sure want to remove <b>" + companyName + "</b>?";
        this.confirmationModal.show();
    };
    InventoryComponent.prototype.onUserConfirmation = function (yesOrNo) {
        if (yesOrNo && this.selectedBranch) {
            this.store.dispatch(this.settingsBranchActions.RemoveBranch(this.selectedBranch));
        }
        else {
            this.selectedBranch = null;
        }
        this.confirmationModal.hide();
    };
    InventoryComponent.prototype.getAllBranches = function () {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
    };
    InventoryComponent.prototype.isAllCompaniesSelected = function () {
        var _this = this;
        this.companies$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (companies) {
            if (companies.length === _this.selectedCompaniesUniquename.length) {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(true);
            }
            else {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])(false);
            }
        });
    };
    InventoryComponent.prototype.saveLastState = function () {
        var companyUniqueName = null;
        var state = this.activeTabIndex === 0 ? 'inventory' : this.activeTabIndex === 1 ? 'inventory/jobwork' : 'inventory/manufacturing';
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_9__["select"])(function (c) { return c.session.companyUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_2__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = "/pages/" + state;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('branchModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], InventoryComponent.prototype, "branchModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('addCompanyModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], InventoryComponent.prototype, "addCompanyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('companyadd'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_14__["ElementViewContainerRef"])
    ], InventoryComponent.prototype, "companyadd", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('confirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], InventoryComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('inventoryStaticTabs'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["TabsetComponent"])
    ], InventoryComponent.prototype, "inventoryStaticTabs", void 0);
    InventoryComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["Component"])({
            selector: 'inventory',
            template: __webpack_require__(/*! ./inventory.component.html */ "./src/app/inventory/inventory.component.html"),
            providers: [{ provide: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsDropdownConfig"], useValue: { autoClose: false } }],
            styles: [__webpack_require__(/*! ./inventory.component.scss */ "./src/app/inventory/inventory.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_1__["InventoryAction"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_15__["CompanyActions"], _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_4__["InvoiceActions"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_16__["SettingsBranchActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_10__["ComponentFactoryResolver"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_15__["CompanyActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_12__["SettingsProfileActions"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_18__["InvViewService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_17__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_17__["ActivatedRoute"],
            _actions_inventory_stocks_report_actions__WEBPACK_IMPORTED_MODULE_20__["StockReportActions"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_19__["SidebarAction"]])
    ], InventoryComponent);
    return InventoryComponent;
}());



/***/ }),

/***/ "./src/app/inventory/inventory.module.ts":
/*!***********************************************!*\
  !*** ./src/app/inventory/inventory.module.ts ***!
  \***********************************************/
/*! exports provided: InventoryModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryModule", function() { return InventoryModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../shared/helpers/pipes/currencyPipe/currencyType.module */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _inventory_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./inventory.routing.module */ "./src/app/inventory/inventory.routing.module.ts");
/* harmony import */ var _inventory_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./inventory.component */ "./src/app/inventory/inventory.component.ts");
/* harmony import */ var _components_header_components_inventory_header_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/header-components/inventory-header-component */ "./src/app/inventory/components/header-components/inventory-header-component.ts");
/* harmony import */ var _components_sidebar_components_inventory_sidebar_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/sidebar-components/inventory.sidebar.component */ "./src/app/inventory/components/sidebar-components/inventory.sidebar.component.ts");
/* harmony import */ var _components_add_group_components_inventory_addgroup_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/add-group-components/inventory.addgroup.component */ "./src/app/inventory/components/add-group-components/inventory.addgroup.component.ts");
/* harmony import */ var _components_add_stock_components_inventory_addstock_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/add-stock-components/inventory.addstock.component */ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.ts");
/* harmony import */ var _components_custom_stock_components_inventory_customstock_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/custom-stock-components/inventory.customstock.component */ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.ts");
/* harmony import */ var _components_stock_report_component_inventory_stockreport_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/stock-report-component/inventory.stockreport.component */ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.ts");
/* harmony import */ var _components_sidebar_components_stockgrplist_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/sidebar-components/stockgrplist.component */ "./src/app/inventory/components/sidebar-components/stockgrplist.component.ts");
/* harmony import */ var _components_sidebar_components_stockList_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/sidebar-components/stockList.component */ "./src/app/inventory/components/sidebar-components/stockList.component.ts");
/* harmony import */ var _components_update_group_component_inventory_updategroup_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/update-group-component/inventory.updategroup.component */ "./src/app/inventory/components/update-group-component/inventory.updategroup.component.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "../../node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _inventory_components_aside_custom_stock_components_aside_custom_stock_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../inventory/components/aside-custom-stock.components/aside-custom-stock.component */ "./src/app/inventory/components/aside-custom-stock.components/aside-custom-stock.component.ts");
/* harmony import */ var _inventory_components_aside_inventory_components_aside_inventory_components__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../inventory/components/aside-inventory.components/aside-inventory.components */ "./src/app/inventory/components/aside-inventory.components/aside-inventory.components.ts");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var _shared_helpers_directives_textCaseChange_textCaseChange_module__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../shared/helpers/directives/textCaseChange/textCaseChange.module */ "./src/app/shared/helpers/directives/textCaseChange/textCaseChange.module.ts");
/* harmony import */ var _components_group_stock_report_component_group_stockreport_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./components/group-stock-report-component/group.stockreport.component */ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.ts");
/* harmony import */ var _components_welcome_inventory_welcome_inventory_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/welcome-inventory/welcome-inventory.component */ "./src/app/inventory/components/welcome-inventory/welcome-inventory.component.ts");
/* harmony import */ var _components_branch_branchTransfer_branch_transfer_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/branch/branchTransfer/branch.transfer.component */ "./src/app/inventory/components/branch/branchTransfer/branch.transfer.component.ts");
/* harmony import */ var _components_branch_branchHeader_branch_header_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./components/branch/branchHeader/branch.header.component */ "./src/app/inventory/components/branch/branchHeader/branch.header.component.ts");
/* harmony import */ var _inventory_jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../inventory/jobwork/jobwork.component */ "./src/app/inventory/jobwork/jobwork.component.ts");
/* harmony import */ var _inventory_jobwork_welcome_jobwork_welcome_jobwork_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../inventory/jobwork/welcome-jobwork/welcome-jobwork.component */ "./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.ts");
/* harmony import */ var _inventory_components_aside_pane_aside_pane_components__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../inventory/components/aside-pane/aside-pane.components */ "./src/app/inventory/components/aside-pane/aside-pane.components.ts");
/* harmony import */ var _inventory_components_aside_transfer_pane_aside_transfer_pane_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../inventory/components/aside-transfer-pane/aside-transfer-pane.component */ "./src/app/inventory/components/aside-transfer-pane/aside-transfer-pane.component.ts");
/* harmony import */ var _inventory_components_aside_branch_transfer_pane_aside_branch_transfer_pane_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component */ "./src/app/inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var _components_sidebar_components_in_out_stock_list_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./components/sidebar-components/in-out-stock-list.component */ "./src/app/inventory/components/sidebar-components/in-out-stock-list.component.ts");
/* harmony import */ var _components_forms_inventory_user_transfer_inventory_user_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./components/forms/inventory-user/transfer-inventory-user.component */ "./src/app/inventory/components/forms/inventory-user/transfer-inventory-user.component.ts");
/* harmony import */ var _components_forms_transfer_note_transfer_note_component__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./components/forms/transfer-note/transfer-note.component */ "./src/app/inventory/components/forms/transfer-note/transfer-note.component.ts");
/* harmony import */ var _components_forms_branch_transfer_branch_transfer_note_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/forms/branch-transfer/branch-transfer-note.component */ "./src/app/inventory/components/forms/branch-transfer/branch-transfer-note.component.ts");
/* harmony import */ var _components_forms_inward_note_inward_note_component__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./components/forms/inward-note/inward-note.component */ "./src/app/inventory/components/forms/inward-note/inward-note.component.ts");
/* harmony import */ var _components_forms_outward_note_outward_note_component__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./components/forms/outward-note/outward-note.component */ "./src/app/inventory/components/forms/outward-note/outward-note.component.ts");
/* harmony import */ var _jobwork_sidebar_components_jobwork_sidebar_component__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./jobwork/sidebar-components/jobwork.sidebar.component */ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.ts");
/* harmony import */ var _manufacturing_manufacturing_component__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./manufacturing/manufacturing.component */ "./src/app/inventory/manufacturing/manufacturing.component.ts");













































var InventoryModule = /** @class */ (function () {
    function InventoryModule() {
    }
    InventoryModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["NgModule"])({
            declarations: [
                // Components / Directives/ Pipes
                _inventory_component__WEBPACK_IMPORTED_MODULE_6__["InventoryComponent"],
                _components_sidebar_components_inventory_sidebar_component__WEBPACK_IMPORTED_MODULE_8__["InventorySidebarComponent"],
                _components_add_group_components_inventory_addgroup_component__WEBPACK_IMPORTED_MODULE_9__["InventoryAddGroupComponent"],
                _components_add_stock_components_inventory_addstock_component__WEBPACK_IMPORTED_MODULE_10__["InventoryAddStockComponent"],
                _components_header_components_inventory_header_component__WEBPACK_IMPORTED_MODULE_7__["InventoryHearderComponent"],
                _components_custom_stock_components_inventory_customstock_component__WEBPACK_IMPORTED_MODULE_11__["InventoryCustomStockComponent"],
                _components_stock_report_component_inventory_stockreport_component__WEBPACK_IMPORTED_MODULE_12__["InventoryStockReportComponent"],
                _components_sidebar_components_stockgrplist_component__WEBPACK_IMPORTED_MODULE_13__["StockgrpListComponent"],
                _components_sidebar_components_stockList_component__WEBPACK_IMPORTED_MODULE_14__["StockListComponent"],
                _inventory_components_aside_custom_stock_components_aside_custom_stock_component__WEBPACK_IMPORTED_MODULE_23__["AsideCustomStockComponent"],
                _inventory_components_aside_inventory_components_aside_inventory_components__WEBPACK_IMPORTED_MODULE_24__["AsideInventoryComponent"],
                _components_update_group_component_inventory_updategroup_component__WEBPACK_IMPORTED_MODULE_15__["InventoryUpdateGroupComponent"],
                _components_group_stock_report_component_group_stockreport_component__WEBPACK_IMPORTED_MODULE_27__["InventoryGroupStockReportComponent"],
                _components_welcome_inventory_welcome_inventory_component__WEBPACK_IMPORTED_MODULE_28__["InventoryWelcomeComponent"],
                _components_branch_branchTransfer_branch_transfer_component__WEBPACK_IMPORTED_MODULE_29__["BranchTransferComponent"],
                _components_branch_branchHeader_branch_header_component__WEBPACK_IMPORTED_MODULE_30__["BranchHeaderComponent"],
                _inventory_jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_31__["JobworkComponent"],
                _inventory_jobwork_welcome_jobwork_welcome_jobwork_component__WEBPACK_IMPORTED_MODULE_32__["JobworkWelcomeComponent"],
                _inventory_components_aside_pane_aside_pane_components__WEBPACK_IMPORTED_MODULE_33__["AsidePaneComponent"],
                _inventory_components_aside_transfer_pane_aside_transfer_pane_component__WEBPACK_IMPORTED_MODULE_34__["AsideTransferPaneComponent"],
                _inventory_components_aside_branch_transfer_pane_aside_branch_transfer_pane_component__WEBPACK_IMPORTED_MODULE_35__["AsideBranchTransferPaneComponent"],
                _components_sidebar_components_in_out_stock_list_component__WEBPACK_IMPORTED_MODULE_37__["InOutStockListComponent"],
                _components_forms_inventory_user_transfer_inventory_user_component__WEBPACK_IMPORTED_MODULE_38__["InventoryUserComponent"],
                _components_forms_transfer_note_transfer_note_component__WEBPACK_IMPORTED_MODULE_39__["TransferNoteComponent"],
                _components_forms_branch_transfer_branch_transfer_note_component__WEBPACK_IMPORTED_MODULE_40__["BranchTransferNoteComponent"],
                _components_forms_inward_note_inward_note_component__WEBPACK_IMPORTED_MODULE_41__["InwardNoteComponent"],
                _components_forms_outward_note_outward_note_component__WEBPACK_IMPORTED_MODULE_42__["OutwardNoteComponent"],
                _jobwork_sidebar_components_jobwork_sidebar_component__WEBPACK_IMPORTED_MODULE_43__["JobworkSidebarComponent"],
                _manufacturing_manufacturing_component__WEBPACK_IMPORTED_MODULE_44__["ManufacturingComponent"]
            ],
            exports: [
                _inventory_component__WEBPACK_IMPORTED_MODULE_6__["InventoryComponent"],
                _components_sidebar_components_inventory_sidebar_component__WEBPACK_IMPORTED_MODULE_8__["InventorySidebarComponent"],
                _components_add_group_components_inventory_addgroup_component__WEBPACK_IMPORTED_MODULE_9__["InventoryAddGroupComponent"],
                _components_add_stock_components_inventory_addstock_component__WEBPACK_IMPORTED_MODULE_10__["InventoryAddStockComponent"],
                _components_header_components_inventory_header_component__WEBPACK_IMPORTED_MODULE_7__["InventoryHearderComponent"],
                _components_custom_stock_components_inventory_customstock_component__WEBPACK_IMPORTED_MODULE_11__["InventoryCustomStockComponent"],
                _components_stock_report_component_inventory_stockreport_component__WEBPACK_IMPORTED_MODULE_12__["InventoryStockReportComponent"],
                _components_sidebar_components_stockgrplist_component__WEBPACK_IMPORTED_MODULE_13__["StockgrpListComponent"],
                _components_sidebar_components_stockList_component__WEBPACK_IMPORTED_MODULE_14__["StockListComponent"],
                _inventory_components_aside_custom_stock_components_aside_custom_stock_component__WEBPACK_IMPORTED_MODULE_23__["AsideCustomStockComponent"],
                _inventory_components_aside_inventory_components_aside_inventory_components__WEBPACK_IMPORTED_MODULE_24__["AsideInventoryComponent"],
                _components_update_group_component_inventory_updategroup_component__WEBPACK_IMPORTED_MODULE_15__["InventoryUpdateGroupComponent"],
                _components_group_stock_report_component_group_stockreport_component__WEBPACK_IMPORTED_MODULE_27__["InventoryGroupStockReportComponent"],
                _components_welcome_inventory_welcome_inventory_component__WEBPACK_IMPORTED_MODULE_28__["InventoryWelcomeComponent"],
                _components_branch_branchTransfer_branch_transfer_component__WEBPACK_IMPORTED_MODULE_29__["BranchTransferComponent"],
                _inventory_jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_31__["JobworkComponent"],
                _inventory_jobwork_welcome_jobwork_welcome_jobwork_component__WEBPACK_IMPORTED_MODULE_32__["JobworkWelcomeComponent"],
                _inventory_components_aside_pane_aside_pane_components__WEBPACK_IMPORTED_MODULE_33__["AsidePaneComponent"],
                _inventory_components_aside_transfer_pane_aside_transfer_pane_component__WEBPACK_IMPORTED_MODULE_34__["AsideTransferPaneComponent"],
                _inventory_components_aside_branch_transfer_pane_aside_branch_transfer_pane_component__WEBPACK_IMPORTED_MODULE_35__["AsideBranchTransferPaneComponent"],
                _components_sidebar_components_in_out_stock_list_component__WEBPACK_IMPORTED_MODULE_37__["InOutStockListComponent"],
                _components_forms_inventory_user_transfer_inventory_user_component__WEBPACK_IMPORTED_MODULE_38__["InventoryUserComponent"],
                _components_forms_transfer_note_transfer_note_component__WEBPACK_IMPORTED_MODULE_39__["TransferNoteComponent"],
                _components_forms_branch_transfer_branch_transfer_note_component__WEBPACK_IMPORTED_MODULE_40__["BranchTransferNoteComponent"],
                _components_forms_inward_note_inward_note_component__WEBPACK_IMPORTED_MODULE_41__["InwardNoteComponent"],
                _components_forms_outward_note_outward_note_component__WEBPACK_IMPORTED_MODULE_42__["OutwardNoteComponent"],
                _jobwork_sidebar_components_jobwork_sidebar_component__WEBPACK_IMPORTED_MODULE_43__["JobworkSidebarComponent"],
                _manufacturing_manufacturing_component__WEBPACK_IMPORTED_MODULE_44__["ManufacturingComponent"]
            ],
            providers: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _inventory_routing_module__WEBPACK_IMPORTED_MODULE_5__["InventoryRoutingModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_17__["TooltipModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__["DatepickerModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_18__["LaddaModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_19__["DecimalDigitsModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_20__["ShSelectModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_21__["SharedModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["ModalModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_25__["Daterangepicker"],
                _shared_helpers_directives_textCaseChange_textCaseChange_module__WEBPACK_IMPORTED_MODULE_26__["TextCaseChangeModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["BsDropdownModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__["BsDatepickerModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["PaginationModule"],
                _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__["CurrencyModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["TabsModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_36__["ClickOutsideModule"]
            ],
            entryComponents: [
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_22__["PaginationComponent"]
            ],
        })
    ], InventoryModule);
    return InventoryModule;
}());



/***/ }),

/***/ "./src/app/inventory/inventory.routing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/inventory/inventory.routing.module.ts ***!
  \*******************************************************/
/*! exports provided: InventoryRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryRoutingModule", function() { return InventoryRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _inventory_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inventory.component */ "./src/app/inventory/inventory.component.ts");
/* harmony import */ var _components_add_stock_components_inventory_addstock_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/add-stock-components/inventory.addstock.component */ "./src/app/inventory/components/add-stock-components/inventory.addstock.component.ts");
/* harmony import */ var _components_custom_stock_components_inventory_customstock_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/custom-stock-components/inventory.customstock.component */ "./src/app/inventory/components/custom-stock-components/inventory.customstock.component.ts");
/* harmony import */ var _components_stock_report_component_inventory_stockreport_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/stock-report-component/inventory.stockreport.component */ "./src/app/inventory/components/stock-report-component/inventory.stockreport.component.ts");
/* harmony import */ var _components_update_group_component_inventory_updategroup_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/update-group-component/inventory.updategroup.component */ "./src/app/inventory/components/update-group-component/inventory.updategroup.component.ts");
/* harmony import */ var _components_group_stock_report_component_group_stockreport_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/group-stock-report-component/group.stockreport.component */ "./src/app/inventory/components/group-stock-report-component/group.stockreport.component.ts");
/* harmony import */ var _components_welcome_inventory_welcome_inventory_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/welcome-inventory/welcome-inventory.component */ "./src/app/inventory/components/welcome-inventory/welcome-inventory.component.ts");
/* harmony import */ var _jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./jobwork/jobwork.component */ "./src/app/inventory/jobwork/jobwork.component.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _manufacturing_manufacturing_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./manufacturing/manufacturing.component */ "./src/app/inventory/manufacturing/manufacturing.component.ts");













var InventoryRoutingModule = /** @class */ (function () {
    function InventoryRoutingModule() {
    }
    InventoryRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _inventory_component__WEBPACK_IMPORTED_MODULE_3__["InventoryComponent"],
                        children: [
                            // { path: '', pathMatch: 'full', redirectTo: 'add-stock' },
                            // { path: 'add-group', pathMatch: 'full', component: InventoryUpdateGroupComponent },
                            { path: 'add-group/:groupUniqueName', pathMatch: 'full', component: _components_update_group_component_inventory_updategroup_component__WEBPACK_IMPORTED_MODULE_7__["InventoryUpdateGroupComponent"] },
                            // { path: 'add-stock', pathMatch: 'full', component: InventoryAddStockComponent },
                            { path: 'add-group/:groupUniqueName/add-stock/:stockUniqueName', component: _components_add_stock_components_inventory_addstock_component__WEBPACK_IMPORTED_MODULE_4__["InventoryAddStockComponent"] },
                            { path: 'stock/:groupUniqueName/report/:stockUniqueName', component: _components_stock_report_component_inventory_stockreport_component__WEBPACK_IMPORTED_MODULE_6__["InventoryStockReportComponent"] },
                            { path: 'group/:groupUniqueName/report', component: _components_group_stock_report_component_group_stockreport_component__WEBPACK_IMPORTED_MODULE_8__["InventoryGroupStockReportComponent"] },
                            { path: 'custom-stock', component: _components_custom_stock_components_inventory_customstock_component__WEBPACK_IMPORTED_MODULE_5__["InventoryCustomStockComponent"] },
                            { path: '', pathMatch: 'full', component: _components_welcome_inventory_welcome_inventory_component__WEBPACK_IMPORTED_MODULE_9__["InventoryWelcomeComponent"] },
                            { path: 'jobwork', component: _jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_10__["JobworkComponent"] },
                            { path: 'jobwork/:type/:uniqueName', component: _jobwork_jobwork_component__WEBPACK_IMPORTED_MODULE_10__["JobworkComponent"] },
                            { path: 'manufacturing', component: _manufacturing_manufacturing_component__WEBPACK_IMPORTED_MODULE_12__["ManufacturingComponent"] },
                        ],
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
            providers: [_inv_view_service__WEBPACK_IMPORTED_MODULE_11__["InvViewService"]]
        })
    ], InventoryRoutingModule);
    return InventoryRoutingModule;
}());



/***/ }),

/***/ "./src/app/inventory/jobwork/jobwork.component.html":
/*!**********************************************************!*\
  !*** ./src/app/inventory/jobwork/jobwork.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div style=\"min-height:100%;\">\n  <!--sidebar-->\n\n  <jobwork-sidebar></jobwork-sidebar>\n  <!--/sidebar-->\n  <div class=\"rightBar\" *ngIf=\"showWelcomePage\">\n    <welcome-jobwork></welcome-jobwork>\n  </div>\n  <section class=\"rightBar\" *ngIf=\"!showWelcomePage\">\n    <section class=\"container-fluid clearfix pdT2\">\n      <section class=\"h100\">\n        <div class=\"fb__1-container row\">\n          <div class=\"col-md-8 form-inline\">\n            <h2 class=\"mr-2 ReportInfo\"\n                style=\"display: inline-block; font-size: 20px;font-weight: bold;text-transform:capitalize;\">\n              <span *ngIf=\"type==='stock'\" class=\"ReportInfo\">{{nameStockOrPerson}}</span>&nbsp;<span\n              *ngIf=\"type==='stock'\">(Transaction Log)</span>\n\n              <span *ngIf=\"type==='person'\" class=\"ReportInfo\"><span>{{nameStockOrPerson}}</span></span>\n            </h2>\n            <div class=\"form-group\" style=\"margin-top: -7px;\">\n              <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n                     class=\"form-control date-range-picker\" (applyDaterangepicker)=\"dateSelected($event)\"/>\n            </div>\n\n            <div class=\"form-group\">\n              <button class=\"btn btn-link btn-link-2\" (click)=\"onOpenAdvanceSearch()\">Advance\n                Search\n              </button>\n              <i class=\"fa fa-refresh cp\" *ngIf=\"isFilterCorrect\" (click)=\"resetFilter()\"></i>\n            </div>\n          </div>\n          <div class=\"col-md-4\">\n            <div class=\"pull-right\">\n              <div class=\"btn-group \" dropdown placement=\"bottom right\">\n                <button id=\"buttonalignment\" dropdownToggle type=\"button\"\n                        class=\"btn-link mrB cp mr-1 dropdown-toggle\" aria-controls=\"dropdown-alignment\">\n                  <i class=\"icon-download\"></i> Download\n                </button>\n                <ul id=\"dropdown-alignment\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\"\n                    role=\"menu\" aria-labelledby=\"button-alignment\">\n                  <li role=\"menuitem\" (click)=\"downloadJobworkReport('csv')\"><a\n                    class=\"dropdown-item\">Download CSV</a></li>\n                  <li role=\"menuitem\" (click)=\"downloadJobworkReport('xls')\"><a\n                    class=\"dropdown-item\">Download XLS</a></li>\n                </ul>\n              </div>\n\n              <button class=\"btn btn-blue\" data-toggle=\"tooltip\" tooltip=\"Alt+i\"\n                      (click)=\"toggleTransferAsidePane()\">Create\n                New\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <section style=\"margin-top: 15px\">\n          <div class=\"table-responsive\">\n          <table class=\"table basic table-border m-0\">\n            <thead>\n            <tr>\n              <th class=\"bdrR\" width=\"120\">\n                <div class=\"d-flex\">\n                  <div class=\"flex-fill\"> Date</div>\n                  <div class=\"icon-pointer\">\n                    <!-- default -->\n                    <div class=\"fa fa-long-arrow-up text-right \"\n                         *ngIf=\"filter.sortBy !== 'entry_date'\"\n                         (click)=\"sortButtonClicked('asc', 'entry_date')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'entry_date' && filter.sort === 'asc'}\">\n                    </div>\n                    <!-- after sort click -->\n                    <div class=\"fa fa-long-arrow-down text-right\"\n                         *ngIf=\"filter.sortBy === 'entry_date' && filter.sort === 'desc'\"\n                         (click)=\"sortButtonClicked('asc', 'entry_date')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'entry_date' && filter.sort === 'desc'}\">\n                    </div>\n                    <div class=\"fa fa-long-arrow-up text-right \"\n                         *ngIf=\"filter.sortBy === 'entry_date' && filter.sort === 'asc'\"\n                         (click)=\"sortButtonClicked('desc', 'entry_date')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'entry_date' && filter.sort === 'asc'}\">\n                    </div>\n                  </div>\n                </div>\n              </th>\n              <th class=\"bdrR td_in_searchBox\" *ngIf=\"type ==='person'\" width=\"15%\"\n                  (clickOutside)=\"clickedOutside($event,null, 'product')\">\n                <div [hidden]=\"showProductSearch\">\n                  <span>Product Name</span>\n                  <!-- <i class=\"icon-search\" (click)=\"showSearchBox('product')\"></i> -->\n                </div>\n                <!-- <div class=\"input-container\" [hidden]=\"!showProductSearch\">\n                    <input type=\"text\" #productName placeholder=\"Product Name\" class=\"w100\"\n                        [formControl]=\"productUniqueNameInput\" />\n                    <i class=\"icon-search\" (click)=\"showProductSearch = false;\"></i>\n                </div> -->\n              </th>\n              <th class=\"bdrR bdrB\" *ngIf=\"type ==='stock'\" width=\"15%\">\n                <div class=\"btn-group btn-group-voucher-type\" dropdown placement=\"bottom right\">\n                  <button id=\"button-alignment\" dropdownToggle type=\"button\"\n                          class=\"btn-link cp p-0 dropdown-toggle c-3 p0\"\n                          aria-controls=\"dropdown-alignment\">Voucher Type\n                    <i class=\"fa fa-ellipsis-v pull-right text-light-2\" aria-hidden=\"true\"></i>\n                  </button>\n                  <ul id=\"dropdown-alignment\" *dropdownMenu\n                      class=\"dropdown-menu  dropdown-menu-right voucher-type\" role=\"menu\"\n                      aria-labelledby=\"button-alignment\">\n                    <li role=\"menuitem dropdown-item\" *ngFor=\"let item of VOUCHER_TYPES\">\n                      <label><input type=\"checkbox\" [(ngModel)]=\"item.checked\"\n                                    (click)=\"filterByCheck(item.value, $event.target.checked)\"/>\n                        {{item.label}}</label></li>\n                  </ul>\n                </div>\n              </th>\n              <th class=\"bdrR bdrB td_in_searchBox\" width=\"15%\"\n                  (clickOutside)=\"clickedOutside($event,null, 'sender')\">\n                <div [hidden]=\"showSenderSearch\">\n                  <span>Sender's Name</span>\n                  <i class=\"icon-search\" (click)=\"showSearchBox('sender')\"></i>\n                </div>\n                <div class=\"input-container\" [hidden]=\"!showSenderSearch\">\n                  <input type=\"text\" #senderName placeholder=\"Sender's Name\" class=\"w100\"\n                         [formControl]=\"senderUniqueNameInput\"/>\n                  <i class=\"icon-search\" (click)=\"showSenderSearch = false;\"></i>\n                </div>\n              </th>\n              <th class=\"bdrR bdrB td_in_searchBox\" width=\"15%\"\n                  (clickOutside)=\"clickedOutside($event,null, 'receiver')\">\n                <div [hidden]=\"showReceiverSearch\">\n                  <span>Receiver's Name</span>\n                  <i class=\"icon-search\" (click)=\"showSearchBox('receiver')\"></i>\n                </div>\n                <div class=\"input-container\" [hidden]=\"!showReceiverSearch\">\n                  <input type=\"text\" #receiverName placeholder=\"Receiver's Name\" class=\"w100\"\n                         [formControl]=\"receiverUniqueNameInput\"/>\n                  <i class=\"icon-search\" (click)=\"showReceiverSearch = false;\"></i>\n                </div>\n              </th>\n              <th class=\"bdrR bdrB\">Description</th>\n              <th class=\"text-right bdrB\" width=\"140\">\n                <div class=\"d-flex\">\n                  <div class=\"flex-fill mr-1\">Trading Qty</div>\n                  <div class=\"icon-pointer\">\n                    <!-- default -->\n                    <div class=\"fa fa-long-arrow-up text-right \"\n                         *ngIf=\"filter.sortBy !== 'QUANTITY'\"\n                         (click)=\"sortButtonClicked('asc', 'QUANTITY')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'QUANTITY' && filter.sort === 'asc'}\">\n                    </div>\n                    <!-- after sort click -->\n                    <div class=\"fa fa-long-arrow-down text-right\"\n                         *ngIf=\"filter.sortBy === 'QUANTITY' && filter.sort === 'desc'\"\n                         (click)=\"sortButtonClicked('asc', 'QUANTITY')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'QUANTITY' && filter.sort === 'desc'}\">\n                    </div>\n                    <div class=\"fa fa-long-arrow-up text-right \"\n                         *ngIf=\"filter.sortBy === 'QUANTITY' && filter.sort === 'asc'\"\n                         (click)=\"sortButtonClicked('desc', 'QUANTITY')\"\n                         [ngClass]=\"{'activeTextColor': filter.sortBy === 'QUANTITY' && filter.sort === 'asc'}\">\n                    </div>\n                  </div>\n                </div>\n              </th>\n            </tr>\n            </thead>\n\n            <tbody *ngIf=\"inventoryReport && inventoryReport.transactions.length>0\">\n            <tr *ngFor=\"let txn of inventoryReport.transactions; let idx = index\">\n              <td class=\"bdrR\">{{txn.date}}</td>\n              <td class=\"bdrR\" *ngIf=\"type ==='person'\">{{txn.stock.name}}</td>\n              <td class=\"bdrR\" *ngIf=\"type ==='stock'\">\n                <!-- in case of stock type -->\n                <span class=\"{{txn.jobWorkTransactionType}}\">{{txn.jobWorkTransactionType}}</span>\n              </td>\n              <td class=\"bdrR\">{{txn.sender.name}}</td>\n              <td class=\"bdrR\">{{txn.receiver.name}}</td>\n              <td class=\"bdrR\" (click)='updateDescriptionIdx = idx'>\n                <ng-container *ngIf='updateDescriptionIdx != idx'>\n                  {{txn.description}}\n                </ng-container>\n                <ng-container *ngIf='updateDescriptionIdx === idx'>\n                  <input type=\"text\" class='form-control' maxlength='100' autofocus=\"true\"\n                         placeholder=\"Enter Description\" [(ngModel)]='txn.description'\n                         (blur)='updateDescription(txn)'/>\n                </ng-container>\n              </td>\n              <td class=\"text-right bdrR\">{{txn.quantity}}<span\n                class=\"unit-badge\">{{txn.stockUnit.code}}</span></td>\n            </tr>\n            </tbody>\n            <!-- <tfoot>\n                <tr>\n                    <td colspan=\"5\">\n                        Total\n                    </td>\n                    <td colspan=\"2\">\n                        60,000\n                    </td>\n                </tr>\n            </tfoot> -->\n            <tbody *ngIf=\"inventoryReport && inventoryReport.transactions.length<=0 || !inventoryReport\">\n            <tr>\n              <td colspan=\"7\" class=\"text-center empty_table\">\n                <img src=\"assets/images/search-data-not-found.svg\"/>\n                <h1>No Report Found !!</h1>\n              </td>\n            </tr>\n            </tbody>\n            <tfoot *ngIf=\"inventoryReport?.totalPages > 1\">\n            <tr>\n              <td colspan=\"7\">\n                <div class=\"alC\">\n                  <pagination [maxSize]=\"6\" [totalItems]=\"inventoryReport.totalItems\" [(ngModel)]=\"inventoryReport.page\"\n                              [itemsPerPage]=\"6\" (pageChanged)=\"applyFilters($event.page)\"\n                              class=\"pagination-sm\" [boundaryLinks]=\"true\" [rotate]=\"false\"></pagination>\n                </div>\n              </td>\n            </tr>\n            </tfoot>\n          </table>\n        </div>\n        </section>\n      </section>\n    </section>\n  </section>\n</div>\n\n\n<!-- aside inwards/outwards/transfer pane -->\n<div class=\"aside-overlay\" *ngIf=\"asideTransferPaneState === 'in'\"></div>\n<aside-transfer-pane [class]=\"asideTransferPaneState\" [@slideInOut]=\"asideTransferPaneState\"\n                     (closeAsideEvent)=\"toggleTransferAsidePane()\"></aside-transfer-pane>\n<!-- aside inwards/outwards/transfer pane -->\n\n<!-- Advance search popup -->\n<div bsModal #advanceSearchModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header themeBg clearfix\">\n        <h3 class=\"modal-title bg\" id=\"modal-title\">Advance Search</h3>\n        <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\"\n              (click)=\"advanceSearchAction('cancel')\">×</span>\n      </div>\n      <div class=\"modal-body clearfix\">\n        <form action=\"\" [formGroup]=\"advanceSearchForm\">\n\n          <div class=\"row mrT2\">\n            <div class=\"col-md-4\">Trading Qty.</div>\n            <div class=\"col-md-4\">\n              <sh-select name=\"entity\" (onClear)=\"clearShSelect('comparisionFilter')\" [options]=\"COMPARISON_FILTER\"\n                         (selected)=\"compareChanged($event)\"\n                         [placeholder]=\"'Select'\" #comparisionFilter [multiple]=\"false\"></sh-select>\n            </div>\n            <div class=\"col-md-4\">\n              <input type=\"text\" (keyup)=\"checkFilters()\" class=\"form-control\" placeholder=\"Quantity\"\n                     maxlength=\"10\" formControlName=\"filterAmount\">\n              <small *ngIf=\"advanceSearchForm.controls['filterAmount'].invalid\" class=\"text-danger\">input\n                number\n                only\n              </small>\n            </div>\n          </div>\n          <div class=\"row mrT4 mrB3\">\n            <div class=\"col-xs-12 text-right\">\n              <button class=\"btn btn-success\" type=\"button\" [disabled]=\"!isFilterCorrect && !filter.quantity\"\n                      (click)=\"advanceSearchAction('search')\">Search\n              </button>\n              <button class=\"btn btn-danger\" type=\"button\"\n                      (click)=\"advanceSearchAction('clear')\">Clear\n              </button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- Advance  search popup -->\n"

/***/ }),

/***/ "./src/app/inventory/jobwork/jobwork.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/inventory/jobwork/jobwork.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".btn-group.open.show {\n  display: inline-block !important; }\n\n.bdrT {\n  border-color: #ccc; }\n\n:host ::ng-deep .fb__1-container {\n  -webkit-box-pack: start;\n          justify-content: flex-start; }\n\n:host ::ng-deep .fb__1-container .form-group {\n  margin-right: 10px;\n  margin-bottom: 0; }\n\n:host ::ng-deep .fb__1-container .date-range-picker {\n  min-width: 140px;\n  font-weight: bolder;\n  border-bottom: 1px dotted #707070;\n  padding-bottom: 2px !important; }\n\n.flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox div span {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-left: 13px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox .input-container input {\n  height: 100%;\n  width: 100%;\n  padding: 10px 13px;\n  padding-right: 40px;\n  border: 0px;\n  margin-top: 0px; }\n\n.td_in_searchBox .input-container i {\n  position: absolute;\n  right: 0px;\n  top: 10px; }\n\n.table-border {\n  border: 1px solid #c6c6c6; }\n\n.basic > thead > tr > th {\n  border-right: 1px solid #cdcdcd; }\n\n.icon-pointer .glyphicon {\n  cursor: pointer; }\n\n.icon-pointer .glyphicon:hover {\n  color: #ff5f00; }\n\n.td_in_searchBox div i:hover {\n  color: #ff5f00; }\n\n/* class name same as what we are getting data */\n\n.Inward.Note {\n  color: #229e2b; }\n\n.Outward.Note {\n  color: #0C8FE6; }\n\n.Transfer.Note {\n  color: #666666; }\n\n/* voucher type DDL */\n\n.c-3 {\n  color: #333333; }\n\n.btn-group-voucher-type {\n  width: 100%; }\n\n.btn-group-voucher-type button {\n    text-align: left;\n    width: 100%; }\n\n.btn-group-voucher-type button:focus, .btn-group-voucher-type button:hover {\n      text-decoration: none; }\n\n.btn-group-voucher-type .pull-right {\n    margin-top: 5px; }\n\n.btn-group-voucher-type button i.fa.fa-ellipsis-v {\n  position: absolute;\n  right: 0; }\n\n.voucher-type {\n  width: 115%;\n  right: -7.5% !important;\n  top: 118% !important;\n  border-radius: 0px;\n  padding: 0px; }\n\n.voucher-type input[type=\"checkbox\"]:after {\n    border: 1px solid #cccccc;\n    width: 15px;\n    height: 15px;\n    top: 2px; }\n\n.voucher-type input[type=\"checkbox\"]:before {\n    top: 5px;\n    width: 9px;\n    height: 5px;\n    border: 1px solid #ff5f00;\n    border-top-style: none;\n    border-right-style: none; }\n\n.voucher-type li {\n    color: #333333;\n    padding: 3px 7px !important;\n    font-size: 12px; }\n\n.voucher-type li:last-child {\n    border: none;\n    padding-bottom: 6px !important; }\n\nbutton[aria-expanded=\"true\"] i {\n  color: #ff5f00; }\n\n/* voucher type DDL */\n\n.modal-content {\n  border-radius: 0px;\n  margin-top: 200px; }\n\n.rightBar {\n  width: calc(100% - 260px); }\n\n.unit-badge {\n  display: inline-block;\n  min-width: 40px;\n  text-align: left;\n  padding-left: 3px;\n  text-transform: lowercase; }\n\n.icon-pointer .fa-long-arrow-up,\n.icon-pointer .fa-long-arrow-down {\n  line-height: 20px;\n  width: 15px;\n  color: #a9a9a9; }\n\n.icon-pointer .activeTextColor {\n  color: #ff5200; }\n\n.dropdown-menu > li > a:hover {\n  cursor: pointer;\n  color: #ff5f00; }\n"

/***/ }),

/***/ "./src/app/inventory/jobwork/jobwork.component.ts":
/*!********************************************************!*\
  !*** ./src/app/inventory/jobwork/jobwork.component.ts ***!
  \********************************************************/
/*! exports provided: JobworkComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobworkComponent", function() { return JobworkComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_inventory_report_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/inventory/inventory.report.actions */ "./src/app/actions/inventory/inventory.report.actions.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../theme/ng2-daterangepicker/daterangepicker.component */ "./src/app/theme/ng2-daterangepicker/daterangepicker.component.ts");
















var JobworkComponent = /** @class */ (function () {
    function JobworkComponent(_router, router, inventoryReportActions, inventoryService, _toasty, fb, invViewService, _store, cdr) {
        var _this = this;
        this._router = _router;
        this.router = router;
        this.inventoryReportActions = inventoryReportActions;
        this.inventoryService = inventoryService;
        this._toasty = _toasty;
        this.fb = fb;
        this.invViewService = invViewService;
        this._store = _store;
        this.cdr = cdr;
        this.asideTransferPaneState = 'out';
        this.senderUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.receiverUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.productUniqueNameInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]();
        this.showWelcomePage = true;
        this.showSenderSearch = false;
        this.showReceiverSearch = false;
        this.showProductSearch = false;
        this.updateDescriptionIdx = null;
        this._DDMMYYYY = 'DD-MM-YYYY';
        // modal advance search
        this.isFilterCorrect = false;
        this.COMPARISON_FILTER = [
            { label: 'Equals', value: '=' },
            { label: 'Greater Than', value: '>' },
            { label: 'Less Than', value: '<' },
            { label: 'Exclude', value: '!' }
        ];
        this.VOUCHER_TYPES = [
            {
                "value": "Inward note",
                "label": "Inward note",
                "checked": true
            },
            {
                "value": "Outward Note",
                "label": "Outward Note",
                "checked": true
            },
            {
                "value": "Transfer Note",
                "label": "Transfer Note",
                "checked": true
            }
        ];
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
        this.startDate = moment__WEBPACK_IMPORTED_MODULE_2__().subtract(30, 'days').format(this._DDMMYYYY);
        this.endDate = moment__WEBPACK_IMPORTED_MODULE_2__().format(this._DDMMYYYY);
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_12__["ReplaySubject"](1);
        this.stocksList$ = this._store.select(function (s) { return s.inventory.stocksList && s.inventory.stocksList.results; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.inventoryUsers$ = this._store.select(function (s) { return s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        this.universalDate$ = this._store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$));
        // on reload page
        var len = document.location.pathname.split('/').length;
        if (len === 6) {
            this.uniqueName = document.location.pathname.split('/')[len - 1];
            this.type = document.location.pathname.split('/')[len - 2];
            if (this.uniqueName && this.type === 'stock' || this.type === 'person') {
                this.showWelcomePage = false;
                this.applyFilters(1, true);
            }
            else {
                this.showWelcomePage = true;
            }
        }
        // get view from sidebar while clicking on person/stock
        this.invViewService.getJobworkActiveView().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe(function (v) {
            _this.initVoucherType();
            _this.showWelcomePage = false;
            _this.type = v.view;
            _this.nameStockOrPerson = v.name;
            if (v.uniqueName) {
                _this.uniqueName = v.uniqueName;
                var length_1 = document.location.pathname.split('/').length;
                if (!v.uniqueName && length_1 === 6) {
                    _this.uniqueName = document.location.pathname.split('/')[length_1 - 1];
                }
                if (_this.uniqueName) {
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
                }
            }
            else {
                if (_this.type === 'person') {
                    _this.inventoryUsers$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (res) {
                        if (res && res.length > 0) {
                            var firstElement = res[0];
                            _this.showWelcomePage = false;
                            _this.nameStockOrPerson = firstElement.name;
                            _this.uniqueName = firstElement.uniqueName;
                            _this.filter.includeSenders = true;
                            _this.filter.includeReceivers = true;
                            _this.filter.receivers = [_this.uniqueName];
                            _this.filter.senders = [_this.uniqueName];
                            _this.applyFilters(1, true);
                        }
                        else {
                            _this.showWelcomePage = true;
                        }
                    });
                }
                else {
                    _this.stocksList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (res) {
                        if (res && res.length > 0) {
                            var firstElement = res[0];
                            _this.showWelcomePage = false;
                            _this.nameStockOrPerson = firstElement.name;
                            _this.uniqueName = firstElement.uniqueName;
                            _this.applyFilters(1, false);
                        }
                        else {
                            _this.showWelcomePage = true;
                        }
                    });
                }
            }
        });
        this.inventoryReport$ = this._store.select(function (p) { return p.inventoryInOutState.inventoryReport; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["publishReplay"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["refCount"])());
        this._store.select(function (p) { return ({
            stocksList: p.inventory.stocksList,
            inventoryUsers: p.inventoryInOutState.inventoryUsers
        }); }).subscribe(function (p) { return p.inventoryUsers && p.stocksList &&
            (_this.stockOptions = p.stocksList.results.map(function (r) { return ({ label: r.name, value: r.uniqueName, additional: 'stock' }); })
                .concat(p.inventoryUsers.map(function (r) { return ({ label: r.name, value: r.uniqueName, additional: 'person' }); }))); });
    }
    JobworkComponent.prototype.ngOnInit = function () {
        var _this = this;
        // initialization for voucher type array initially all selected
        this.initVoucherType();
        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].pattern('[0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
        });
        this.senderUniqueNameInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.filter.senderName = s;
            _this.isFilterCorrect = true;
            _this.applyFilters(1, true);
            if (s === '') {
                _this.showSenderSearch = false;
            }
        });
        this.receiverUniqueNameInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.filter.receiverName = s;
            _this.isFilterCorrect = true;
            _this.applyFilters(1, true);
            if (s === '') {
                _this.showReceiverSearch = false;
            }
        });
        // this.productUniqueNameInput.valueChanges.pipe(  // enable after api change for product search
        //   debounceTime(700),
        //   distinctUntilChanged(),
        //   takeUntil(this.destroyed$)
        // ).subscribe(s => {
        //   this.filter.productName = s;
        //   this.applyFilters(1, true);
        //   if (s === '') {
        //     this.showReceiverSearch = false;
        //   }
        // });
        // on load first time
        this.stocksList$.subscribe(function (res) {
            if (res && res.length > 0) {
                var firstElement = res[0];
                if (!_this.type) {
                    _this.showWelcomePage = false;
                    _this.type = 'stock';
                    _this.nameStockOrPerson = firstElement.name;
                    _this.uniqueName = firstElement.uniqueName;
                    _this._store.dispatch(_this.inventoryReportActions.genReport(firstElement.uniqueName, _this.startDate, _this.endDate, 1, 6, _this.filter));
                }
            }
            else {
                _this.showWelcomePage = true;
            }
        });
        this.universalDate$.subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.startDate = moment__WEBPACK_IMPORTED_MODULE_2__(a[0]).format(_this._DDMMYYYY);
                _this.endDate = moment__WEBPACK_IMPORTED_MODULE_2__(a[1]).format(_this._DDMMYYYY);
                _this.applyFilters(1, true);
            }
        });
        this.inventoryReport$.subscribe(function (res) {
            _this.inventoryReport = res;
            _this.cdr.detectChanges();
        });
    };
    JobworkComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    JobworkComponent.prototype.initVoucherType = function () {
        var _this = this;
        // initialization for voucher type array inially all selected
        this.filter.jobWorkTransactionType = [];
        this.VOUCHER_TYPES.forEach(function (element) {
            element.checked = true;
            _this.filter.jobWorkTransactionType.push(element.value);
        });
    };
    JobworkComponent.prototype.dateSelected = function (val) {
        var _a = val.picker, startDate = _a.startDate, endDate = _a.endDate;
        this.startDate = startDate.format(this._DDMMYYYY);
        this.endDate = endDate.format(this._DDMMYYYY);
        this.isFilterCorrect = true;
        this.applyFilters(1, true);
    };
    /**
     * updateDescription
     */
    JobworkComponent.prototype.updateDescription = function (txn) {
        var _this = this;
        this.updateDescriptionIdx = null;
        this.inventoryService.updateDescription(txn.uniqueName, txn.description).subscribe(function (res) {
            if (res.status === 'success') {
                _this.updateDescriptionIdx = null;
            }
            else {
                txn.description = null;
            }
        });
    };
    // focus on click search box
    JobworkComponent.prototype.showSearchBox = function (type) {
        var _this = this;
        if (type === 'sender') {
            this.showSenderSearch = !this.showSenderSearch;
            setTimeout(function () {
                _this.senderName.nativeElement.focus();
                _this.senderName.nativeElement.value = null;
            }, 100);
        }
        else if (type === 'receiver') {
            this.showReceiverSearch = !this.showReceiverSearch;
            setTimeout(function () {
                _this.receiverName.nativeElement.focus();
                _this.receiverName.nativeElement.value = null;
            }, 100);
        }
        else if (type === 'product') {
            this.showProductSearch = !this.showProductSearch;
            setTimeout(function () {
                _this.receiverName.nativeElement.focus();
                _this.receiverName.nativeElement.value = null;
            }, 100);
        }
    };
    JobworkComponent.prototype.compareChanged = function (option) {
        switch (option.value) {
            case '>':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = false;
                break;
            case '<':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = true;
                break;
            case '<=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = true;
                break;
            case '>=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '!':
                this.filter.quantityNotEquals = true;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
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
        this.checkFilters();
    };
    JobworkComponent.prototype.handleKeyboardEvent = function (event) {
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.toggleTransferAsidePane();
        }
    };
    // new transfer aside pane
    JobworkComponent.prototype.toggleTransferAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    JobworkComponent.prototype.toggleBodyClass = function () {
        if (this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    JobworkComponent.prototype.applyFilters = function (page, applyFilter) {
        if (applyFilter === void 0) { applyFilter = true; }
        if (!this.uniqueName) {
            return;
        }
        if (this.type === 'stock' && applyFilter) {
            this.filter.senders = null;
            this.filter.receivers = null;
        }
        this._store.dispatch(this.inventoryReportActions
            .genReport(this.uniqueName, this.startDate, this.endDate, page, 6, applyFilter ? this.filter : null));
        this.cdr.detectChanges();
    };
    // ******* Advance search modal *******//
    JobworkComponent.prototype.resetFilter = function () {
        var _this = this;
        this.filter.senderName = null;
        this.filter.receiverName = null;
        this.showSenderSearch = false;
        this.showReceiverSearch = false;
        this.showProductSearch = false;
        this.senderName.nativeElement.value = null;
        this.receiverName.nativeElement.value = null;
        if (this.productName) {
            this.productName.nativeElement.value = null;
        }
        //advanceSearchAction modal filter
        this.comparisionFilter.clear();
        this.advanceSearchForm.controls['filterAmount'].setValue(null);
        this.filter.sort = null;
        this.filter.sortBy = null;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = false;
        //Reset Date
        this.universalDate$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["take"])(1)).subscribe(function (a) {
            if (a) {
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: a[0], endDate: a[1] });
                _this.startDate = moment__WEBPACK_IMPORTED_MODULE_2__(a[0]).format(_this._DDMMYYYY);
                _this.endDate = moment__WEBPACK_IMPORTED_MODULE_2__(a[1]).format(_this._DDMMYYYY);
            }
        });
        //Reset Date
        // initialization for voucher type array initially all selected
        this.initVoucherType();
        this.isFilterCorrect = false;
        this.applyFilters(1, true);
    };
    JobworkComponent.prototype.onOpenAdvanceSearch = function () {
        this.advanceSearchModel.show();
    };
    JobworkComponent.prototype.advanceSearchAction = function (type) {
        if (type === 'clear') {
            this.comparisionFilter.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);
            if (this.filter.senderName || this.filter.receiverName || this.senderName.nativeElement.value || this.receiverName.nativeElement.value
                || this.filter.sortBy || this.filter.sort || this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) {
                // do something...
            }
            else {
                this.isFilterCorrect = false;
            }
            return;
        }
        else if (type === 'cancel') {
            if (this.filter.senderName || this.filter.receiverName || this.senderName.nativeElement.value || this.receiverName.nativeElement.value
                || this.filter.sortBy || this.filter.sort || this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) {
                // do something...
            }
            else {
                this.isFilterCorrect = false;
            }
            this.advanceSearchModel.hide();
            return;
        }
        else {
            if (this.advanceSearchForm.controls['filterAmount'].value) {
                this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
            }
            this.advanceSearchModel.hide();
            this.applyFilters(1, true);
        }
    };
    JobworkComponent.prototype.checkFilters = function () {
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) {
            this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
        }
        else {
            this.filter.quantity = null;
        }
        if ((this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) && this.filter.quantity) {
            this.isFilterCorrect = true;
        }
    };
    // ************************************//
    // Sort filter code here
    JobworkComponent.prototype.sortButtonClicked = function (type, columnName) {
        if (this.filter.sort !== type || this.filter.sortBy !== columnName) {
            this.filter.sort = type;
            this.filter.sortBy = columnName;
            this.isFilterCorrect = true;
            this.applyFilters(1, true);
        }
    };
    JobworkComponent.prototype.clearShSelect = function (type) {
        this.filter.quantityGreaterThan = null;
        this.filter.quantityEqualTo = null;
        this.filter.quantityLessThan = null;
    };
    JobworkComponent.prototype.filterByCheck = function (type, event) {
        var idx = this.filter.jobWorkTransactionType.indexOf('ALL');
        if (idx !== -1) {
            this.initVoucherType();
        }
        if (event && type) {
            this.filter.jobWorkTransactionType.push(type);
        }
        else {
            var index = this.filter.jobWorkTransactionType.indexOf(type);
            if (index !== -1) {
                this.filter.jobWorkTransactionType.splice(index, 1);
            }
        }
        if (this.filter.jobWorkTransactionType.length > 0 && this.filter.jobWorkTransactionType.length < this.VOUCHER_TYPES.length) {
            idx = this.filter.jobWorkTransactionType.indexOf('ALL');
            if (idx !== -1) {
                this.filter.jobWorkTransactionType.splice(idx, 1);
            }
            idx = this.filter.jobWorkTransactionType.indexOf('NONE');
            if (idx !== -1) {
                this.filter.jobWorkTransactionType.splice(idx, 1);
            }
        }
        if (this.filter.jobWorkTransactionType.length === this.VOUCHER_TYPES.length) {
            this.filter.jobWorkTransactionType = ['ALL'];
        }
        if (this.filter.jobWorkTransactionType.length === 0) {
            this.filter.jobWorkTransactionType = ['NONE'];
        }
        this.isFilterCorrect = true;
        this.applyFilters(1, true);
    };
    // ************************************//
    JobworkComponent.prototype.clickedOutside = function (event, el, fieldName) {
        if (fieldName === 'product') {
            if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'sender') {
            if (this.senderUniqueNameInput.value !== null && this.senderUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'receiver') {
            if (this.receiverUniqueNameInput.value !== null && this.receiverUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        }
        else {
            if (fieldName === 'sender') {
                this.showSenderSearch = false;
            }
            else if (fieldName === 'receiver') {
                this.showReceiverSearch = false;
            }
            else if (fieldName === 'product') {
                this.showProductSearch = false;
            }
        }
    };
    /* tslint:disable */
    JobworkComponent.prototype.childOf = function (c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    };
    JobworkComponent.prototype.downloadJobworkReport = function (format) {
        var _this = this;
        if (!this.uniqueName) {
            return;
        }
        if (this.type === 'stock') {
            this.filter.senders = null;
            this.filter.receivers = null;
        }
        this.inventoryService.downloadJobwork(this.uniqueName, this.type, format, this.startDate, this.endDate, this.filter)
            .subscribe(function (d) {
            if (d.status === 'success') {
                _this._toasty.infoToast(d.body);
            }
            else {
                _this._toasty.errorToast(d.message);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('advanceSearchModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["ModalDirective"])
    ], JobworkComponent.prototype, "advanceSearchModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('senderName'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], JobworkComponent.prototype, "senderName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('receiverName'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], JobworkComponent.prototype, "receiverName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('productName'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], JobworkComponent.prototype, "productName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('comparisionFilter'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_14__["ShSelectComponent"])
    ], JobworkComponent.prototype, "comparisionFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_theme_ng2_daterangepicker_daterangepicker_component__WEBPACK_IMPORTED_MODULE_15__["DaterangePickerComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng2_daterangepicker_daterangepicker_component__WEBPACK_IMPORTED_MODULE_15__["DaterangePickerComponent"])
    ], JobworkComponent.prototype, "datePicker", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('document:keyup', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [KeyboardEvent]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], JobworkComponent.prototype, "handleKeyboardEvent", null);
    JobworkComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'jobwork',
            template: __webpack_require__(/*! ./jobwork.component.html */ "./src/app/inventory/jobwork/jobwork.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_6__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./jobwork.component.scss */ "./src/app/inventory/jobwork/jobwork.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _actions_inventory_inventory_report_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryReportActions"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_9__["InventoryService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__["ToasterService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormBuilder"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_13__["InvViewService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]])
    ], JobworkComponent);
    return JobworkComponent;
}());



/***/ }),

/***/ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"inventory-sidebar\" class=\"sidebar pull-left\" #sidebar>\n  <div class=\"h100 clearfix\">\n    <div class=\"padd15\">\n      <div class=\"form-group width-sidebar-form-control\">\n        <div class=\"select-style middle\">\n          <select class=\"form-control\" (change)=\"selectReportType($event.target.value)\" [value]='reportType'>\n            <option value=\"stock\">Stock Report</option>\n            <option value=\"person\">Person Report</option>\n          </select>\n        </div>\n      </div>\n      <div style=\"position: relative\">\n        <input class=\"form-control width-sidebar-form-control-search\" type=\"search\" placeholder=\"Search {{reportType}}\"\n          [(ngModel)]=\"nameSearch\" #search>\n        <i class=\"fa fa-search text-light-2\" style=\"position: absolute;top: 10px;left: 11px;\"></i>\n        <!--<div class=\"btn-group\" dropdown placement=\"bottom right\">\n          <button id=\"button-alignment\" dropdownToggle type=\"button\" class=\"btn btn-primary dropdown-toggle\"\n            aria-controls=\"dropdown-alignment\">\n            <i class=\"fa fa-ellipsis-v\"></i> <span class=\"caret\"></span>\n          </button>\n          <ul id=\"dropdown-alignment\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"\n            aria-labelledby=\"button-alignment\">\n            <li role=\"menuitem\" (click)=\"downloadAllInventoryReports()\"><a class=\"dropdown-item\">Download All\n                Inventory</a></li>\n          </ul>\n        </div>-->\n      </div>\n    </div>\n    <div>\n      <ul *ngIf=\"reportType==='stock' && stocksList\" class=\"list-unstyled stock-grp-list clearfix\">\n        <li *ngFor=\"let s of stocksList\" [ngClass]=\"{'active': uniqueName === s.uniqueName}\" (click)=\"showReport(s)\"><a\n            href=\"javascript:void(0);\">{{s.name}}</a></li>\n        <li class=\"no-data-box text-center text-light\" *ngIf=\"stocksList && stocksList.length<=0\">\n            <img src=\"assets/images/search-data-not-found.svg\"/><br>\n            No Data Found</li>\n      </ul>\n      <ul *ngIf=\"reportType==='person' && inventoryUsers\" class=\"list-unstyled stock-grp-list clearfix\">\n        <li *ngFor=\"let p of inventoryUsers\" [ngClass]=\"{'active': uniqueName === p.uniqueName}\"\n          (click)=\"showReport(p)\"><a href=\"javascript:void(0);\">{{p.name}}</a></li>\n        <li class=\"no-data-box text-center text-light\" *ngIf=\"inventoryUsers && inventoryUsers.length<=0\">\n            <img src=\"assets/images/search-data-not-found.svg\"/><br>\n            No Data Found</li>\n      </ul>\n    </div>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".parent-Group > ul > li ul li div {\n  color: #8a8a8a; }\n\n.btn-group.show {\n  display: inline-block !important; }\n\n.btn-group > .btn:first-child {\n  margin-left: 8px;\n  margin-top: -3px;\n  background: none;\n  color: #707070;\n  padding: 6px;\n  margin-right: 0px !important; }\n\n.dropdown-menu > li > a:hover {\n  background: #e5e5e5;\n  cursor: pointer; }\n\n.dropdown-menu > li > a {\n  color: #ff5200; }\n\nspan.caret {\n  display: none; }\n\n#inventory-sidebar {\n  background: #fff;\n  min-height: 100vh;\n  width: 260px; }\n\n.stock-grp-list > li:hover {\n  background: #fff3ec; }\n\n.stock-grp-list > li.active {\n  background: #fff3ec; }\n\n.stock-grp-list > li > a:hover {\n  color: #333333; }\n\n:host ::ng-deep .nav-tabs > li {\n  width: 50%;\n  text-align: center;\n  background: #f5f5f5; }\n\n.width-sidebar-form-control {\n  width: 205px; }\n\n.width-sidebar-form-control-search {\n  padding-left: 32px !important;\n  width: 205px;\n  display: inline-block; }\n\n.btn-link-2 {\n  color: #0C8FE6; }\n\n.no-data-box {\n  border-top: 1px solid #e0e0e0 !important; }\n"

/***/ }),

/***/ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.ts ***!
  \***********************************************************************************/
/*! exports provided: JobworkSidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobworkSidebarComponent", function() { return JobworkSidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _inv_view_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../services/inventory.service */ "./src/app/services/inventory.service.ts");











var JobworkSidebarComponent = /** @class */ (function () {
    /**
     * TypeScript public modifiers
     */
    function JobworkSidebarComponent(store, _router, _inventoryAction, sideBarAction, invViewService, inventoryService, _toasty, router) {
        var _this = this;
        this.store = store;
        this._router = _router;
        this._inventoryAction = _inventoryAction;
        this.sideBarAction = sideBarAction;
        this.invViewService = invViewService;
        this.inventoryService = inventoryService;
        this._toasty = _toasty;
        this.router = router;
        this.reportType = 'stock';
        this.uniqueName = null;
        this.nameSearch = null;
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
    }
    JobworkSidebarComponent.prototype.resizeEvent = function () {
        this.sidebarRect = window.screen.height;
    };
    JobworkSidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.stocksList$.subscribe(function (res) {
            _this.stocksList = res;
        });
        this.inventoryUsers$.subscribe(function (res) {
            _this.inventoryUsers = res;
        });
        if (this.router.url.indexOf('person') > 0 && this.router.url.indexOf('jobwork') > 0) {
            this.reportType = 'person';
        }
        else {
            this.reportType = 'stock';
        }
    };
    JobworkSidebarComponent.prototype.selectReportType = function (reportType) {
        this.reportType = reportType;
        this.selectFirstElementRecord();
        this.invViewService.setJobworkActiveView(reportType);
    };
    JobworkSidebarComponent.prototype.showReport = function (data) {
        this.uniqueName = data.uniqueName;
        this.invViewService.setJobworkActiveView(this.reportType, data.uniqueName, data.name);
        this.router.navigate(['/pages', 'inventory', 'jobwork', this.reportType, data.uniqueName]);
    };
    JobworkSidebarComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["fromEvent"])(this.search.nativeElement, 'input').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (e) { return e.target.value; }))
            .subscribe(function (val) {
            if (_this.reportType === 'stock') {
                _this.stocksList$.subscribe(function (res) {
                    _this.stocksList = res;
                });
                if (val) {
                    _this.stocksList = Object.assign([], _this.stocksList).filter(function (item) { return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1; });
                }
            }
            else if (_this.reportType === 'person') {
                _this.inventoryUsers$.subscribe(function (res) {
                    _this.inventoryUsers = res;
                });
                if (val) {
                    _this.inventoryUsers = Object.assign([], _this.inventoryUsers).filter(function (item) { return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1; });
                }
            }
        });
        setTimeout(function () {
            _this.selectFirstElementRecord();
        }, 300);
    };
    JobworkSidebarComponent.prototype.selectFirstElementRecord = function () {
        var _this = this;
        if (this.reportType === 'stock') {
            this.stocksList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (res) {
                if (res && res.length > 0) {
                    var firstElement = res[0];
                    _this.uniqueName = firstElement.uniqueName;
                }
            });
        }
        else {
            this.inventoryUsers$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (res) {
                if (res && res.length > 0) {
                    var firstElement = res[0];
                    _this.uniqueName = firstElement.uniqueName;
                }
            });
        }
    };
    JobworkSidebarComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('search'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], JobworkSidebarComponent.prototype, "search", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('sidebar'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], JobworkSidebarComponent.prototype, "sidebar", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('window:resize'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], JobworkSidebarComponent.prototype, "resizeEvent", null);
    JobworkSidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'jobwork-sidebar',
            template: __webpack_require__(/*! ./jobwork.sidebar.component.html */ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.html"),
            styles: [__webpack_require__(/*! ./jobwork.sidebar.component.scss */ "./src/app/inventory/jobwork/sidebar-components/jobwork.sidebar.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_5__["InventoryAction"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_7__["SidebarAction"],
            _inv_view_service__WEBPACK_IMPORTED_MODULE_8__["InvViewService"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_10__["InventoryService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], JobworkSidebarComponent);
    return JobworkSidebarComponent;
}());



/***/ }),

/***/ "./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-6 col-xs-offset-3  text-center\">\n    <div class=\"illustration_box\">\n      <img src=\"assets/images/new/Inventory_welcome.svg\"/>\n      <h3 class=\"mrT1 fs18\"><strong>Job Work</strong></h3>\n      <p class=\"mrT1\">Add & Manage product in the inventory</p>\n      <button class=\"btn btn-blue mrT2\" (click)=\"toggleTransferAsidePane()\">Start</button>\n    </div>\n  </div>\n  \n\n<!-- aside inwards/outwards/transfer pane -->\n<div class=\"aside-overlay\" *ngIf=\"asideTransferPaneState === 'in'\"></div>\n<aside-transfer-pane [class]=\"asideTransferPaneState\" [@slideInOut]=\"asideTransferPaneState\"\n  (closeAsideEvent)=\"toggleTransferAsidePane()\"></aside-transfer-pane>\n<!-- aside inwards/outwards/transfer pane -->"

/***/ }),

/***/ "./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.ts ***!
  \********************************************************************************/
/*! exports provided: JobworkWelcomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobworkWelcomeComponent", function() { return JobworkWelcomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");




var JobworkWelcomeComponent = /** @class */ (function () {
    function JobworkWelcomeComponent() {
        this.asideTransferPaneState = 'out';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        //
    }
    JobworkWelcomeComponent.prototype.ngOnInit = function () {
        //
    };
    // new transfer aside pane
    JobworkWelcomeComponent.prototype.toggleTransferAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    JobworkWelcomeComponent.prototype.toggleBodyClass = function () {
        if (this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    JobworkWelcomeComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    JobworkWelcomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'welcome-jobwork',
            template: __webpack_require__(/*! ./welcome-jobwork.component.html */ "./src/app/inventory/jobwork/welcome-jobwork/welcome-jobwork.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(0, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({
                        transform: 'translate3d(100%, 0, 0);'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('400ms ease-in-out'))
                ]),
            ]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], JobworkWelcomeComponent);
    return JobworkWelcomeComponent;
}());



/***/ }),

/***/ "./src/app/inventory/manufacturing/manufacturing.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/inventory/manufacturing/manufacturing.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"rightBar\">\n    <div class=\"col-xs-6 col-xs-offset-4  text-center\">\n        <div class=\"illustration_box\">\n            <img src=\"assets/images/Manufacturing_welcome.svg\" />\n            <h3 class=\"mrT1 fs18\"><strong>Manufacturing</strong></h3>\n            <p class=\"mrT1\">Add & Manage product in the inventory</p>\n            <p class=\"mrT1\">Coming soon...</p>\n            <button class=\"btn btn-blue mrT2\">Start</button>\n        </div>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/inventory/manufacturing/manufacturing.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/inventory/manufacturing/manufacturing.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".illustration_box {\n  margin-top: 200px; }\n"

/***/ }),

/***/ "./src/app/inventory/manufacturing/manufacturing.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/inventory/manufacturing/manufacturing.component.ts ***!
  \********************************************************************/
/*! exports provided: ManufacturingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManufacturingComponent", function() { return ManufacturingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ManufacturingComponent = /** @class */ (function () {
    function ManufacturingComponent() {
    }
    ManufacturingComponent.prototype.ngOnInit = function () { };
    ManufacturingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'manufacturing',
            template: __webpack_require__(/*! ./manufacturing.component.html */ "./src/app/inventory/manufacturing/manufacturing.component.html"),
            styles: [__webpack_require__(/*! ./manufacturing.component.scss */ "./src/app/inventory/manufacturing/manufacturing.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ManufacturingComponent);
    return ManufacturingComponent;
}());



/***/ }),

/***/ "./src/app/models/api-models/BranchTransfer.ts":
/*!*****************************************************!*\
  !*** ./src/app/models/api-models/BranchTransfer.ts ***!
  \*****************************************************/
/*! exports provided: BranchTransfersArray, BranchTransferEntity, TransferDestinationRequest, TransferProductsRequest, BranchTransferResponse, LinkedStocksResponse, LinkedStocksVM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchTransfersArray", function() { return BranchTransfersArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchTransferEntity", function() { return BranchTransferEntity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransferDestinationRequest", function() { return TransferDestinationRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransferProductsRequest", function() { return TransferProductsRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchTransferResponse", function() { return BranchTransferResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkedStocksResponse", function() { return LinkedStocksResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkedStocksVM", function() { return LinkedStocksVM; });
var BranchTransfersArray = /** @class */ (function () {
    function BranchTransfersArray(entityDetails, quantity, stockUnit, rate) {
        this.entityDetails = entityDetails;
        this.quantity = quantity;
        this.stockUnit = stockUnit;
        this.rate = rate;
        //
    }
    return BranchTransfersArray;
}());

var BranchTransferEntity = /** @class */ (function () {
    function BranchTransferEntity(uniqueName, entity) {
        this.uniqueName = uniqueName;
        this.entity = entity;
        //
    }
    return BranchTransferEntity;
}());

var TransferDestinationRequest = /** @class */ (function () {
    function TransferDestinationRequest() {
        this.transferProducts = false;
    }
    return TransferDestinationRequest;
}());

var TransferProductsRequest = /** @class */ (function () {
    function TransferProductsRequest() {
        this.transferProducts = true;
    }
    return TransferProductsRequest;
}());

var BranchTransferResponse = /** @class */ (function () {
    function BranchTransferResponse() {
    }
    return BranchTransferResponse;
}());

var LinkedStocksResponse = /** @class */ (function () {
    function LinkedStocksResponse() {
    }
    return LinkedStocksResponse;
}());

var LinkedStocksVM = /** @class */ (function () {
    function LinkedStocksVM(name, uniqueName, isWareHouse) {
        if (isWareHouse === void 0) { isWareHouse = false; }
        this.name = name;
        this.uniqueName = uniqueName;
        this.isWareHouse = isWareHouse;
    }
    return LinkedStocksVM;
}());



/***/ }),

/***/ "./src/app/models/api-models/Inventory.ts":
/*!************************************************!*\
  !*** ./src/app/models/api-models/Inventory.ts ***!
  \************************************************/
/*! exports provided: StockGroupRequest, StockGroupResponse, StocksResponse, StockUnitResponse, StockReportResponse, StockReportRequest, GroupStockReportRequest, AdvanceFilterOptions, StockDetailResponse, CreateStockRequest, StockUnitRequest, GroupStockReportResponse, InventoryDownloadRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockGroupRequest", function() { return StockGroupRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockGroupResponse", function() { return StockGroupResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StocksResponse", function() { return StocksResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockUnitResponse", function() { return StockUnitResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockReportResponse", function() { return StockReportResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockReportRequest", function() { return StockReportRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupStockReportRequest", function() { return GroupStockReportRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvanceFilterOptions", function() { return AdvanceFilterOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockDetailResponse", function() { return StockDetailResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateStockRequest", function() { return CreateStockRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StockUnitRequest", function() { return StockUnitRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupStockReportResponse", function() { return GroupStockReportResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryDownloadRequest", function() { return InventoryDownloadRequest; });
/*
 * Model for Create Stock Group api request
 * POST call
 * API:: (Create Stock Group) company/:companyUniqueName/stock-group
 * response will be hash as StockGroupResponse
 */
var StockGroupRequest = /** @class */ (function () {
    function StockGroupRequest() {
    }
    return StockGroupRequest;
}());

/**
 * Model for Create Stock Group api response
 * API:: (Create Stock Group) company/:companyUniqueName/stock-group
 */
var StockGroupResponse = /** @class */ (function () {
    function StockGroupResponse() {
    }
    return StockGroupResponse;
}());

/**
 * Model for Stocks api response
 * API:: (Stocks) company/:companyUniqueName/stock-group/stocks
 * response will ne a hash containing StocksResponse
 */
var StocksResponse = /** @class */ (function () {
    function StocksResponse() {
    }
    return StocksResponse;
}());

/**
 * Model for Delete Stock-Group api response
 * DELETE call
 * from ui we are makingcall to delete-stockgrp api whereas from node it is directed to stock-unit api
 * API:: (Delete Stock-Group) company/:companyUniqueName/stock-group/:stockGroupUniqueName
 * Response will be a string message in body
 */
/**
 * Model for units types api response
 * from ui we are makingcall to units types api whereas from node it is directed to stock-unit api
 * GET call
 * API:: (units types) company/:companyUniqueName/stock-unit
 * Response will be a array of StockUnitResponse
 */
var StockUnitResponse = /** @class */ (function () {
    function StockUnitResponse() {
    }
    return StockUnitResponse;
}());

/**
 * Model for stock-report api response
 * GET call
 * API:: (stock-report) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2?from=:from&to=:to&count=:count&page=:page
 * you can pass query parameters in this as:
 * 1) from => date string
 * 2) to => date string,
 * 3) page => number,
 * 4) stockUniqueName => string
 * 5)stockGroupUniqueName string
 * 6)count => number which is sent 10
 * Response will be a array of StockUnitResponse
 * the field stockUnitQtyMap contains a hash depending on the stockUnit
 * if stock unit is 'kg' stockUnitQtyMap contains {kg: 1}
 * for hour stockUnitQtyMap contains {hr: 1} etc
 */
var StockReportResponse = /** @class */ (function () {
    function StockReportResponse() {
    }
    return StockReportResponse;
}());

var StockReportRequest = /** @class */ (function () {
    function StockReportRequest() {
        this.from = '';
        this.to = '';
        this.count = 20;
        this.page = 1;
    }
    return StockReportRequest;
}());

var GroupStockReportRequest = /** @class */ (function () {
    function GroupStockReportRequest() {
        this.from = '';
        this.to = '';
        this.count = 20;
        this.page = 1;
    }
    return GroupStockReportRequest;
}());

var AdvanceFilterOptions = /** @class */ (function () {
    function AdvanceFilterOptions() {
    }
    return AdvanceFilterOptions;
}());

/**
 * Model for stock-detail api response
 * GET call
 * API:: (stock-detail) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName
 * Response will be hash containing StockDetailResponse
 */
var StockDetailResponse = /** @class */ (function () {
    function StockDetailResponse() {
    }
    return StockDetailResponse;
}());

/*
 * Model for create-stock api request
 * POST call
 * API:: (create-stock) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock
 * its response will be hash as StockDetailResponse
 */
var CreateStockRequest = /** @class */ (function () {
    function CreateStockRequest() {
    }
    return CreateStockRequest;
}());

/*
 * Model for create-stock-unit api request
 * POST call
 * API:: (create-stock-unit) company/:companyUniqueName/stock-unit
 * used to create custom stock units
 * its response will be hash as StockUnitResponse
 */
var StockUnitRequest = /** @class */ (function () {
    function StockUnitRequest() {
    }
    return StockUnitRequest;
}());

/*
 * Delete stock api
 * DELETE call
 * API:: (Delete stock) company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName
 * its response will be string in body
 */
/*
 * Delete custom stock unit api
 * DELETE call
 * API:: (Delete custom stock unit) company/:companyUniqueName/stock-unit/:uName
 * uname stands for unique name of custom unit
 * its response will be string in body
 */
var GroupStockReportResponse = /** @class */ (function () {
    function GroupStockReportResponse() {
    }
    return GroupStockReportResponse;
}());

var InventoryDownloadRequest = /** @class */ (function () {
    function InventoryDownloadRequest() {
        this.format = '';
        this.from = '';
        this.to = '';
    }
    return InventoryDownloadRequest;
}());



/***/ })

}]);