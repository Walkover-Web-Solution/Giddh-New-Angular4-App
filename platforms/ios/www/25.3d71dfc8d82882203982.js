(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[25],{

/***/ "./src/app/permissions/capitalize.pipe.ts":
/*!************************************************!*\
  !*** ./src/app/permissions/capitalize.pipe.ts ***!
  \************************************************/
/*! exports provided: CapitalizePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CapitalizePipe", function() { return CapitalizePipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var CapitalizePipe = /** @class */ (function () {
    function CapitalizePipe() {
    }
    CapitalizePipe.prototype.transform = function (value) {
        if (value) {
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
        return value;
    };
    CapitalizePipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            // tslint:disable-next-line:pipe-naming
            name: 'capitalize'
        })
    ], CapitalizePipe);
    return CapitalizePipe;
}());



/***/ }),

/***/ "./src/app/permissions/components/confirmation/confirmation.model.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/permissions/components/confirmation/confirmation.model.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header clearfix\">\n    <h3>Confirmation</h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  </div>\n\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n      <h3>Are you sure want to delete <b *ngIf=\"selectedRoleForDelete\">{{selectedRoleForDelete.name}}</b>?</h3>\n      <div class=\"text-right mrT4 clearfix\">\n        <button type=\"submit\" class=\"btn btn-sm btn-success\" (click)=\"onConfirmation()\">Yes</button>\n        <button type=\"submit\" class=\"btn btn-sm btn-danger\" (click)=\"onCancel()\">No</button>\n      </div>\n    </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/permissions/components/confirmation/confirmation.model.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/permissions/components/confirmation/confirmation.model.component.ts ***!
  \*************************************************************************************/
/*! exports provided: DeleteRoleConfirmationModelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteRoleConfirmationModelComponent", function() { return DeleteRoleConfirmationModelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var DeleteRoleConfirmationModelComponent = /** @class */ (function () {
    function DeleteRoleConfirmationModelComponent() {
        this.confirmDeleteEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.closeModelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
    }
    DeleteRoleConfirmationModelComponent.prototype.onConfirmation = function () {
        this.confirmDeleteEvent.emit(true);
    };
    DeleteRoleConfirmationModelComponent.prototype.onCancel = function () {
        this.closeModelEvent.emit(true);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], DeleteRoleConfirmationModelComponent.prototype, "selectedRoleForDelete", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DeleteRoleConfirmationModelComponent.prototype, "confirmDeleteEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DeleteRoleConfirmationModelComponent.prototype, "closeModelEvent", void 0);
    DeleteRoleConfirmationModelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'delete-role-confirmation-model',
            template: __webpack_require__(/*! ./confirmation.model.component.html */ "./src/app/permissions/components/confirmation/confirmation.model.component.html")
        })
    ], DeleteRoleConfirmationModelComponent);
    return DeleteRoleConfirmationModelComponent;
}());



/***/ }),

/***/ "./src/app/permissions/components/details/permission.details.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/permissions/components/details/permission.details.component.ts ***!
  \********************************************************************************/
/*! exports provided: PermissionDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionDetailsComponent", function() { return PermissionDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/permission/permission.action */ "./src/app/actions/permission/permission.action.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _permission_utility__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../permission.utility */ "./src/app/permissions/permission.utility.ts");
/* harmony import */ var apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! apps/web-giddh/src/app/services/toaster.service */ "./src/app/services/toaster.service.ts");











var PermissionDetailsComponent = /** @class */ (function () {
    function PermissionDetailsComponent(router, activatedRoute, store, _location, permissionActions, _toaster) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.store = store;
        this._location = _location;
        this.permissionActions = permissionActions;
        this._toaster = _toaster;
        this.newRole = {};
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.pageName = '';
        this.store.select(function (p) { return p.permission; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (permission) {
            _this.allRoles = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](permission.roles);
            _this.singlePageForFreshStart = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](_this.allRoles, function (o) {
                return o.uniqueName === 'super_admin';
            });
            _this.adminPageObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](_this.allRoles, function (o) {
                return o.uniqueName === 'admin';
            });
            _this.viewPageObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](_this.allRoles, function (o) {
                return o.uniqueName === 'view';
            });
            _this.rawDataForAllRoles = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](_this.singlePageForFreshStart.scopes[0].permissions);
            _this.allRolesOfPage = _this.getAllRolesOfPageReady(_lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](_this.rawDataForAllRoles));
            _this.newRole = permission.newRole;
            _this.pageList = permission.pages;
        });
        this.addUpdateRoleInProcess$ = this.store.select(function (p) { return p.permission.addUpdateRoleInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    PermissionDetailsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    PermissionDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // listener for add update role case
        this.addUpdateRoleInProcess$.subscribe(function (result) {
            if (result) {
                // un comment below code to redirect
                _this.router.navigate(['/pages/permissions/list']);
            }
        });
        if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["isEmpty"](this.newRole)) {
            this.router.navigate(['/pages/permissions/list']);
        }
        else if (this.newRole.isUpdateCase) {
            var roleObj = new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewRoleClass"](this.newRole.name, this.setScopeForCurrentRole(), false, this.newRole.uniqueName, this.newRole.isUpdateCase);
            this.roleObj = this.handleShareSituation(roleObj);
        }
        else {
            this.roleObj = new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewRoleClass"](this.newRole.name, this.setScopeForCurrentRole(), this.newRole.isFresh, this.checkForRoleUniqueName());
        }
    };
    PermissionDetailsComponent.prototype.handleShareSituation = function (roleObj) {
        var shareScopes = ['SHRALL', 'SHRLWR', 'SHRSM'];
        roleObj.scopes.forEach(function (role) {
            if (role.name === 'SHARE') {
                role.permissions = role.permissions.filter(function (p) {
                    return shareScopes.indexOf(p.code) > -1;
                });
                if (role.permissions.length < 3) {
                    shareScopes.forEach(function (s) {
                        var indexOfAbsentScope = role.permissions.findIndex(function (p) { return p.code === s; });
                        if (indexOfAbsentScope === -1) {
                            role.permissions.push(new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewPermissionObj"](s, false));
                        }
                    });
                }
            }
        });
        return roleObj;
    };
    PermissionDetailsComponent.prototype.addNewPage = function (page) {
        if (page && !this.checkForAlreadyExistInPageArray(page)) {
            var pageObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.singlePageForFreshStart.scopes, function (o) { return o.name === page; });
            pageObj.permissions = pageObj.permissions.map(function (o) {
                return o = new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewPermissionObj"](o.code, false);
            });
            this.roleObj.scopes.push(pageObj);
        }
    };
    PermissionDetailsComponent.prototype.removePageFromScope = function (page) {
        this.roleObj.scopes.splice(this.roleObj.scopes.findIndex(function (o) { return o.name === page; }), 1);
    };
    PermissionDetailsComponent.prototype.checkForAlreadyExistInPageArray = function (page) {
        var idx = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["findIndex"](this.roleObj.scopes, function (o) {
            return o.name === page;
        });
        if (idx !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    PermissionDetailsComponent.prototype.goToRoles = function () {
        this._location.back();
    };
    PermissionDetailsComponent.prototype.getScopeDataReadyForAPI = function (data) {
        var arr;
        arr = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](data.scopes, function (page) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["remove"](page.permissions, function (o) { return !o.isSelected; });
        });
        return _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["filter"](arr, function (o) { return o.permissions.length > 0; });
    };
    PermissionDetailsComponent.prototype.addNewRole = function () {
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        if (data.scopes.length < 1) {
            return this._toaster.errorToast('At least 1 scope should selected.');
        }
        this.store.dispatch(this.permissionActions.CreateRole(data));
    };
    PermissionDetailsComponent.prototype.updateRole = function () {
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.roleObj);
        data.scopes = this.getScopeDataReadyForAPI(data);
        this.store.dispatch(this.permissionActions.UpdateRole(data));
    };
    PermissionDetailsComponent.prototype.getAllRolesOfPageReady = function (arr) {
        return arr.map(function (o) {
            return o = new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewPermissionObj"](o.code, false);
        });
    };
    PermissionDetailsComponent.prototype.setScopeForCurrentRole = function () {
        if (this.newRole.isFresh) {
            // fresh role logic here
            return this.generateFreshUI();
        }
        else {
            // copy role scenario
            return this.generateUIFromExistedRole();
        }
    };
    PermissionDetailsComponent.prototype.generateUIFromExistedRole = function () {
        var _this = this;
        var pRole = this.newRole.uniqueName;
        var res = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.allRoles, function (o) {
            return o.uniqueName === pRole;
        });
        if (res) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](res.scopes, function (obj) {
                obj.permissions = obj.permissions.map(function (o) {
                    return o = new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewPermissionObj"](o.code, true);
                });
                if (obj.permissions.length < 6 && obj.name !== 'SHARE') {
                    obj.permissions = _this.pushNonExistRoles(obj.permissions, _this.getAllRolesOfPageReady(_lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](_this.rawDataForAllRoles)));
                }
                var count = 0;
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](obj.permissions, function (o) {
                    if (o.isSelected) {
                        count += 1;
                    }
                });
                if (count === obj.permissions.length) {
                    obj.selectAll = true;
                }
            });
            return res.scopes;
        }
    };
    PermissionDetailsComponent.prototype.pushNonExistRoles = function (arr1, arr2) {
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](arr1, function (o) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["remove"](arr2, function (item) {
                return item.code === o.code;
            });
        });
        return _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["concat"](arr1, arr2);
    };
    PermissionDetailsComponent.prototype.generateFreshUI = function () {
        var arr = [];
        var allRoles = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.singlePageForFreshStart.scopes);
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](this.newRole.pageList, function (item) {
            if (item.isSelected) {
                var res = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](allRoles, function (o) { return o.name === item.name; });
                if (res) {
                    res.permissions = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["map"](res.permissions, function (o) { return new _permission_utility__WEBPACK_IMPORTED_MODULE_9__["NewPermissionObj"](o.code, false); });
                    arr.push(res);
                }
            }
        });
        return arr;
    };
    PermissionDetailsComponent.prototype.checkForIsFixed = function () {
        return !this.newRole.isFresh;
    };
    PermissionDetailsComponent.prototype.checkForRoleUniqueName = function () {
        if (this.newRole.isFresh) {
            return null;
        }
        else {
            return this.newRole.uniqueName;
        }
    };
    PermissionDetailsComponent.prototype.getNameByCode = function (code) {
        var result;
        switch (code) {
            case 'VW':
                result = 'view';
                break;
            case 'UPDT':
                result = 'edit';
                break;
            case 'DLT':
                result = 'delete';
                break;
            case 'ADD':
                result = 'create';
                break;
            case 'SHR':
                result = 'share';
                break;
            case 'VWDLT':
                result = 'view delete';
                break;
            case 'SHRLWR':
                result = 'Share Lower';
                break;
            case 'SHRALL':
                result = 'Share All';
                break;
            case 'SHRSM':
                result = 'Share Same';
                break;
            case 'CMT':
                result = 'Comment';
                break;
            default:
                result = '';
        }
        return result;
    };
    PermissionDetailsComponent.prototype.isHavePermission = function (pageName, item, type) {
        var page;
        if (pageName === 'SHARE') {
            return false;
        }
        if (type === 'admin') {
            page = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.adminPageObj.scopes, function (o) { return o.name === pageName; });
        }
        else {
            page = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.viewPageObj.scopes, function (o) { return o.name === pageName; });
        }
        if (page) {
            var access = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](page.permissions, function (p) { return p.code === item.code; });
            // && access.isSelected
            if (access) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
    };
    PermissionDetailsComponent.prototype.toggleItems = function (pageName, event) {
        var res = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.roleObj.scopes, function (o) { return o.name === pageName; });
        if (res) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["map"](res.permissions, function (o) { return o.isSelected = event.target.checked ? true : false; });
        }
    };
    PermissionDetailsComponent.prototype.toggleItem = function (pageName, item, event) {
        var res = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](this.roleObj.scopes, function (o) { return o.name === pageName; });
        if (event.target.checked) {
            var idx = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["findIndex"](res.permissions, function (o) { return o.isSelected === false; });
            if (idx !== -1) {
                return res.selectAll = false;
            }
            else {
                return res.selectAll = true;
            }
        }
        else {
            return res.selectAll = false;
        }
    };
    PermissionDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./permission.details.html */ "./src/app/permissions/components/details/permission.details.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"],
            _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_7__["PermissionActions"],
            apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_10__["ToasterService"]])
    ], PermissionDetailsComponent);
    return PermissionDetailsComponent;
}());



/***/ }),

/***/ "./src/app/permissions/components/details/permission.details.html":
/*!************************************************************************!*\
  !*** ./src/app/permissions/components/details/permission.details.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"single_role\" *ngIf=\"roleObj\">\n\n\n  <div class=\"pd3 pdT1 pdB1 bdrB clearfix text-center\">\n    <span class=\"lead\">{{ newRole.name }}</span>\n    <button class=\"btn btn-md btn-primary pull-left\" (click)=\"goToRoles()\">Back</button>\n    <button *ngIf=\"!newRole.isUpdateCase\" class=\"btn btn-md btn-success pull-right\" (click)=\"addNewRole()\">Save</button>\n    <button *ngIf=\"newRole.isUpdateCase\" [disabled]=\"newRole.isFixed\" class=\"btn btn-md btn-success pull-right\"\n            (click)=\"updateRole()\">Update\n    </button>\n  </div>\n\n  <section class=\"pd3\">\n    <!--*ngIf=\"roleObj.isUpdateCase\"-->\n    <div class=\"row mrB2\">\n      <div class=\"col-xs-12 form-inline\">\n        <div class=\"form-group custom-select pos-rel\">\n          <select class=\"form-control\" [disabled]=\"newRole.isFixed\" required [(ngModel)]=\"pageName\" name=\"pageName\">\n            <option value=\"\">--Select Pages--</option>\n            <option [disabled]=\"checkForAlreadyExistInPageArray(page)\" *ngFor=\"let page of pageList;\" [ngValue]=\"page\">\n              {{page}}\n            </option>\n          </select>\n          <!--<span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span>-->\n        </div>\n        <div class=\"form-group\">\n          <button class=\"btn btn-success\" (click)=\"addNewPage(pageName)\" [disabled]=\"!pageName\">Add</button>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-4\" *ngFor=\"let page of roleObj.scopes; let idx = index\">\n        <div class=\"panel panel-default\">\n          <div class=\"panel-heading\">\n            {{ page.name }}\n            <!--roleObj.isUpdateCase -->\n            <!-- <i  class=\"fa fa-times  text-danger\" aria-hidden=\"true\" ></i> -->\n            <a class=\"close pull-right\" href=\"javascript:void(0);\" (click)=\"removePageFromScope(page.name)\"\n               *ngIf=\"!newRole.isFixed\">×</a>\n          </div>\n          <div class=\"panel-body pd0\">\n            <table class=\"table basic\">\n              <thead>\n              <tr>\n                <th>{{ newRole.name }}</th>\n                <th class=\"text-center\">Admin</th>\n                <th class=\"text-center\">View</th>\n              </tr>\n              </thead>\n              <tbody>\n              <tr>\n                <td colspan=\"100%\">\n                  <input id=\"{{page.name}}+_{{idx}}\" [disabled]=\"newRole.isFixed\" name=\"{{page.name}}+_{{idx}}\"\n                         (change)=\"toggleItems(page.name, $event)\" type=\"checkbox\" [(ngModel)]=\"page.selectAll\"/>\n                  <label for=\"{{page.name}}+_{{idx}}\"> Select All</label>\n                </td>\n              </tr>\n              <tr *ngFor=\"let item of page.permissions | mySortBy : ['code']; let i = index\">\n                <ng-container *ngIf=\"item.code !== 'SHR'\">\n                  <td>\n                    <input id=\"{{item.code}}+{{idx}}+{{i}}\" [disabled]=\"newRole.isFixed\"\n                           (change)=\"toggleItem(page.name, item, $event)\" type=\"checkbox\" name=\"{{item.code}}_{{i}}\"\n                           [(ngModel)]=\"item.isSelected\"/>\n                    <label for=\"{{item.code}}+{{idx}}+{{i}}\"> {{getNameByCode(item.code)}}</label>\n                  </td>\n                  <td class=\"text-center\">\n                    <i class=\"fa\" [ngClass]=\"isHavePermission(page.name, item, 'admin') ? 'fa-check' : 'fa-times'\"\n                       aria-hidden=\"true\"></i>\n                  </td>\n                  <td class=\"text-center\">\n                    <i class=\"fa\" [ngClass]=\"isHavePermission(page.name, item, 'view') ? 'fa-check' : 'fa-times'\"\n                       aria-hidden=\"true\"></i>\n                  </td>\n                </ng-container>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    </div>\n    <!--end of row  -->\n\n  </section>\n\n</section>\n"

/***/ }),

/***/ "./src/app/permissions/components/list/permission-list.html":
/*!******************************************************************!*\
  !*** ./src/app/permissions/components/list/permission-list.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid clearfix\" *ngIf=\"allRoles.length > 0\">\n\n  <div class=\"col-xs-12 mrT2 pd0 role clearfix\" *ngFor=\"let role of allRoles\">\n    <div class=\"col-xs-3 pd0 rolehead cp\">\n            <span class=\"vcenter\">\n        <h1>{{role.name}}</h1>\n        <div class=\"text-center mrT2 onHover\">\n          <button *ngIf=\"!role.isFixed\" class=\"btn btn-sm btn-primary\" (click)=\"updateRole(role);\">Edit</button>\n          <button *ngIf=\"!role.isFixed\" class=\"btn btn-sm btn-danger\" (click)=\"deleteRole(role);\">Delete</button>\n          <button *ngIf=\"role.isFixed\" class=\"btn btn-sm btn-primary\" (click)=\"updateRole(role);\">View</button>\n        </div>\n      </span>\n    </div>\n    <div class=\"col-xs-9\">\n      <ul>\n        <li *ngFor=\"let item of role.scopes\">{{ item.name | capitalize }}</li>\n      </ul>\n    </div>\n  </div>\n\n  <div class=\"col-xs-12 mrT2 mrB2 role text-center clearfix pd4 new_box\">\n    <h1 class=\"inline-block cursor-pointer\" (click)=\"openPermissionModal()\">+ Add New Role</h1>\n  </div>\n\n</div>\n\n<!--add and manage role model -->\n<div bsModal #permissionModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <permission-model (closeEvent)=\"closePopupEvent($event)\"></permission-model>\n    </div>\n  </div>\n</div>\n\n<!--delete role confirmation model -->\n<div bsModal #permissionConfirmationModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <!-- modal-liq90 class is removed for now-->\n    <div class=\"modal-content\">\n      <delete-role-confirmation-model [selectedRoleForDelete]=\"selectedRoleForDelete\"\n                                      (confirmDeleteEvent)=\"deleteConfirmedRole()\"\n                                      (closeModelEvent)=\"closeConfirmationPopup()\"></delete-role-confirmation-model>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/permissions/components/list/permission.component.css":
/*!**********************************************************************!*\
  !*** ./src/app/permissions/components/list/permission.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".role {\n  background: #f1f1f2;\n  border: 1px solid #c2cdd3;\n}\n\n.role ul {\n  padding: 2rem;\n  float: left;\n  width: 100%;\n}\n\n.role ul li {\n  display: inline-block;\n  float: left;\n  width: 100px;\n}\n\n.inline-block {\n  display: inline-block;\n}\n\n#headsList .caret {\n  top: 9px;\n  position: relative;\n}\n\n#single_role table {\n  background: #f1f1f2;\n  outline: 1px solid #c2cdd3;\n}\n\n#single_role td {\n  border-bottom: 1px solid #c2cdd3;\n}\n\n#single_role thead th {\n  color: #010101 !important;\n  font-weight: 400;\n  text-align: center;\n}\n\n#single_role tbody tr td:first-child,\n#single_role thead th:first-child {\n  color: #858585;\n  text-align: left;\n  border-right: 1px solid #c2cdd3;\n}\n\n#single_role tbody tr td:first-child input[type=checkbox]:checked:after {\n  background: #d4602a;\n  border-color: #d4602a;\n}\n\n.headName {\n  padding: 13px;\n  background: #d4602a;\n  color: #fff;\n  position: relative;\n}\n\n#single_role tbody td,\n#single_role thead td {\n  text-align: center;\n}\n\n#single_role tbody tr:first-child {\n  background: #ffffff;\n}\n\n#single_role thead th:first-child {\n  padding-left: 18px;\n}\n\n.role_title {\n  font-size: 2rem;\n  position: relative;\n  width: calc(100% - 220px);\n  margin: 0 auto;\n  top: 48px;\n  text-align: center;\n}\n\n.new_col {\n  background: #f1f1f2;\n  border: 1px solid #c2cdd3;\n}\n\n.rolehead {\n  background: #fff;\n  min-height: 166px;\n  outline: 1px solid #d4602a;\n  display: table;\n}\n\n.rolehead h1 {\n  height: 100%;\n  text-align: center;\n  width: 100%;\n  font-size: 1.5rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.role ul li {\n  width: 25%;\n  color: #858585;\n  padding: 6px 0;\n}\n\n.not-allowed {\n  color: #c7c9c9 !important;\n}\n\n.new_box h1 {\n  font-size: 2.5rem;\n  color: #858585;\n}\n\n.dropdown_select.open > .dropdown-menu {\n  display: block;\n  width: 100%;\n  max-height: 200px;\n  overflow-y: scroll;\n  border-radius: 0;\n}\n\n.dropdown_select .dropdown-menu li {\n  padding: 6px 0;\n}\n\n#single_role input[type=checkbox]:checked:after {\n  background: #d4602a;\n  border-color: #d4602a;\n}\n\n#headsList {\n  box-shadow: none;\n}\n\n#single_role tbody tr td:nth-child(1n +2) input[type=checkbox]:before {\n  border-color: #000;\n}\n\n#single_role tbody tr td:nth-child(1n +2) input[type=checkbox]:checked:after {\n  background: #f1f1f2;\n  border-color: #f1f1f2;\n  content: '';\n}\n\n#single_role tbody tr td:nth-child(1n +2) input[type=checkbox]:checked:before {\n  content: \"\\f00c\";\n  font-family: FontAwesome;\n  border: none;\n  transition: none;\n  transform: none;\n}\n\n#single_role tbody tr td:nth-child(1n +2) input[type=checkbox]:after {\n  content: \"\\f00d\";\n  font-family: FontAwesome;\n  background: #f1f1f2;\n  border-color: #f1f1f2;\n}\n\n.rolehead .vcenter {\n  max-width: 100px;\n  padding: 0 18px;\n}\n"

/***/ }),

/***/ "./src/app/permissions/components/list/permission.list.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/permissions/components/list/permission.list.component.ts ***!
  \**************************************************************************/
/*! exports provided: PermissionListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionListComponent", function() { return PermissionListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/permission/permission.action */ "./src/app/actions/permission/permission.action.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _permission_utility__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../permission.utility */ "./src/app/permissions/permission.utility.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../services/general.service */ "./src/app/services/general.service.ts");














var PermissionListComponent = /** @class */ (function () {
    function PermissionListComponent(store, route, companyActions, groupWithAccountsAction, router, permissionActions, _toasty, _generalService) {
        this.store = store;
        this.route = route;
        this.companyActions = companyActions;
        this.groupWithAccountsAction = groupWithAccountsAction;
        this.router = router;
        this.permissionActions = permissionActions;
        this._toasty = _toasty;
        this._generalService = _generalService;
        this.allRoles = [];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_10__["ReplaySubject"](1);
    }
    PermissionListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // This module should be accessible to superuser only
        this.session$ = this.store.select(function (s) {
            return s.session;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.session$.subscribe(function (session) {
            _this.store.select(function (state) { return state.company; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(_this.destroyed$)).subscribe(function (company) {
                if (company && session.companies.length) {
                    var selectedCompany = session.companies.find(function (cmp) {
                        return cmp.uniqueName === session.companyUniqueName;
                    });
                    if (selectedCompany && selectedCompany.uniqueName === session.companyUniqueName) {
                        var superAdminIndx = selectedCompany.userEntityRoles.findIndex(function (entity) { return entity.role.uniqueName === 'super_admin'; });
                        // selectedCompany.userEntityRoles[0].role.uniqueName !== 'super_admin'
                        if (superAdminIndx === -1) {
                            _this.redirectToDashboard();
                        }
                    }
                    else {
                        _this.redirectToDashboard();
                    }
                }
                else {
                    _this.redirectToDashboard();
                }
            });
        });
        this.route.data.subscribe(function (data) { return _this.localState = data.yourData; });
        // Getting roles every time user refresh page
        this.store.dispatch(this.permissionActions.GetRoles());
        this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
        this.store.select(function (p) { return p.permission.roles; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (roles) { return _this.allRoles = roles; });
    };
    PermissionListComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        //    this.store.dispatch(this.permissionActions.RemoveNewlyCreatedRoleFromStore());
    };
    PermissionListComponent.prototype.redirectToDashboard = function () {
        this._toasty.errorToast('You do not have permission to access this module');
        this._generalService.invalidMenuClicked.next({
            next: { type: 'MENU', name: 'Dashboard', uniqueName: '/pages/home' },
            previous: { type: 'MENU', name: 'Permissions', uniqueName: '/pages/permissions/list', isInvalidState: true }
        });
        // this.router.navigateByUrl('/home');
    };
    PermissionListComponent.prototype.closePopupEvent = function (userAction) {
        this.permissionModel.hide();
        if (userAction === 'save') {
            this.router.navigate(['/pages', 'permissions', 'details']);
        }
    };
    PermissionListComponent.prototype.updateRole = function (role) {
        var data = new _permission_utility__WEBPACK_IMPORTED_MODULE_11__["NewRoleClass"](role.name, role.scopes, role.isFixed, role.uniqueName, true);
        this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
        this.router.navigate(['/pages/permissions/details']);
    };
    PermissionListComponent.prototype.deleteRole = function (role) {
        this.selectedRoleForDelete = role;
        this.permissionConfirmationModel.show();
    };
    PermissionListComponent.prototype.deleteConfirmedRole = function () {
        this.permissionConfirmationModel.hide();
        this.store.dispatch(this.permissionActions.DeleteRole(this.selectedRoleForDelete.uniqueName));
    };
    PermissionListComponent.prototype.closeConfirmationPopup = function () {
        this.permissionConfirmationModel.hide();
    };
    PermissionListComponent.prototype.openPermissionModal = function () {
        this.permissionModel.show();
    };
    PermissionListComponent.prototype.hidePermissionModel = function () {
        this.permissionModel.hide();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_7__["ElementViewContainerRef"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_7__["ElementViewContainerRef"])
    ], PermissionListComponent.prototype, "elementViewContainerRef", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('permissionModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], PermissionListComponent.prototype, "permissionModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('permissionConfirmationModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["ModalDirective"])
    ], PermissionListComponent.prototype, "permissionConfirmationModel", void 0);
    PermissionListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./permission-list.html */ "./src/app/permissions/components/list/permission-list.html"),
            styles: [__webpack_require__(/*! ./permission.component.css */ "./src/app/permissions/components/list/permission.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_8__["CompanyActions"],
            _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_6__["GroupWithAccountsAction"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_9__["PermissionActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_12__["ToasterService"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_13__["GeneralService"]])
    ], PermissionListComponent);
    return PermissionListComponent;
}());



/***/ }),

/***/ "./src/app/permissions/components/model/permission.model.component.css":
/*!*****************************************************************************!*\
  !*** ./src/app/permissions/components/model/permission.model.component.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".add-new-role-modal .open > #pageListDD {\n  display: inline-block;\n  min-width: 200px;\n  max-height: 180px;\n  overflow: auto;\n}\n\n.dropdown-menu li label {\n  padding: 5px 0;\n  display: block;\n  cursor: pointer;\n}\n"

/***/ }),

/***/ "./src/app/permissions/components/model/permission.model.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/permissions/components/model/permission.model.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"add-new-role-modal\">\n  <div class=\"modal-header clearfix\">\n    <h3>Add Role</h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"closePopupEvent()\">×</span>\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <form #newRoleForm=\"ngForm\" (submit)=\"addNewRole()\" autocomplete=\"off\">\n      <div class=\"\">\n        <div class=\"form-group\">\n          <label>Role Name</label>\n          <input type=\"text\" required name=\"name\" class=\"form-control\" [(ngModel)]=\"newRoleObj.name\"\n                 placeholder=\"Role Name\" #name=\"ngModel\"/>\n        </div>\n        <div class=\"form-group custom-select pos-rel\">\n          <label>Role Type</label>\n          <select class=\"form-control\" required [(ngModel)]=\"newRoleObj.isFresh\" name=\"isFresh\" #isFresh=\"ngModel\">\n            <option [ngValue]=\"true\">Fresh Start</option>\n            <option [ngValue]=\"false\">Copy From Other Role</option>\n          </select>\n          <span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span>\n        </div>\n        <div class=\"form-group\" *ngIf=\"newRoleObj.isFresh\">\n          <div class=\"btn-group btn-block\" dropdown (onShown)=\"onDDShown()\" (onHidden)=\"onDDHidden()\">\n            <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\">\n              {{ dropdownHeading}} <span class=\"select_drop pull-right mrT1\"><i class=\"fa fa-caret-down\"></i></span>\n            </button>\n            <ul id=\"pageListDD\" *dropdownMenu class=\"dropdown-menu pdL1 pdR1\" role=\"menu\">\n              <li>\n                <label>\n                  <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" (click)=\"selectAllPages($event)\"\n                         [(ngModel)]=\"newRoleObj.isSelectedAllPages\"> Select all\n                </label>\n              </li>\n              <li *ngFor=\"let item of newRoleObj.pageList; let i = index\">\n                <label>\n                  <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" (click)=\"selectPage($event)\"\n                         [(ngModel)]=\"item.isSelected\"> {{ item.name | capitalize}}\n                </label>\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"form-group custom-select pos-rel\" *ngIf=\"!newRoleObj.isFresh\">\n          <label>Copy Permission</label>\n          <select class=\"form-control text-capitalize\" name=\"somename\" [(ngModel)]=\"newRoleObj.uniqueName\">\n            <option [ngValue]=\"\">Please Select</option>\n            <option *ngFor=\"let role of allRoles\" [ngValue]=\"role.uniqueName\"> {{ role.name }}</option>\n          </select>\n          <span class=\"select_drop\"><i class=\"fa fa-caret-down\"></i></span>\n        </div>\n        <div class=\"clearfix text-right mrT4\">\n          <button type=\"submit\" class=\"btn btn-sm btn-success\" [disabled]=\"!isFormValid\">Next</button>\n          <button type=\"button\" class=\"btn btn-sm btn-danger\" (click)=\"closePopupEvent()\">Cancel</button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/permissions/components/model/permission.model.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/permissions/components/model/permission.model.component.ts ***!
  \****************************************************************************/
/*! exports provided: PermissionModelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionModelComponent", function() { return PermissionModelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "../../node_modules/ngx-bootstrap/dropdown/index.js");
/* harmony import */ var _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/permission/permission.action */ "./src/app/actions/permission/permission.action.ts");
/* harmony import */ var _permission_utility__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../permission.utility */ "./src/app/permissions/permission.utility.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");










var PermissionModelComponent = /** @class */ (function () {
    function PermissionModelComponent(router, store, permissionActions) {
        var _this = this;
        this.router = router;
        this.store = store;
        this.permissionActions = permissionActions;
        this.closeEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.allRoles = [];
        this.newRoleObj = new _permission_utility__WEBPACK_IMPORTED_MODULE_8__["NewRoleFormClass"]();
        this.dropdownHeading = 'Select pages';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
        this.store.select(function (p) { return p.permission; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (p) {
            if (p.roles && p.roles.length) {
                _this.allRoles = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["forEach"](p.roles, function (role) {
                    _this.allRoles.push({ name: role.name, uniqueName: role.uniqueName });
                });
            }
            _this.newRoleObj.pageList = [];
            if (p.pages && p.pages.length) {
                p.pages.forEach(function (page) {
                    _this.newRoleObj.pageList.push({ name: page, isSelected: false });
                });
            }
        });
    }
    Object.defineProperty(PermissionModelComponent.prototype, "isFormValid", {
        get: function () {
            if (this.newRoleObj.name && this.newRoleObj.isFresh && this.makeCount() > 0) {
                return true;
            }
            else if (this.newRoleObj.name && !this.newRoleObj.isFresh && this.newRoleObj.uniqueName) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    PermissionModelComponent.prototype.ngOnInit = function () {
        this.store.dispatch(this.permissionActions.GetAllPages());
        this.newRoleObj.isFresh = true;
    };
    PermissionModelComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    PermissionModelComponent.prototype.closePopupEvent = function () {
        this.closeEvent.emit('close');
    };
    PermissionModelComponent.prototype.onDDShown = function () {
        this.dropdownHeading = 'Close list';
    };
    PermissionModelComponent.prototype.onDDHidden = function () {
        this.dropdownHeading = 'Select pages';
    };
    /**
     * addNewRole
     */
    PermissionModelComponent.prototype.addNewRole = function () {
        if (this.isFormValid) {
            var data = void 0;
            if (this.newRoleObj.isFresh) {
                data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["omit"](this.newRoleObj, 'uniqueName');
            }
            else {
                data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["omit"](this.newRoleObj, 'pageList');
            }
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    };
    PermissionModelComponent.prototype.selectAllPages = function (event) {
        if (event.target.checked) {
            this.newRoleObj.isSelectedAllPages = true;
            this.newRoleObj.pageList.forEach(function (item) { return item.isSelected = true; });
        }
        else {
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList.forEach(function (item) { return item.isSelected = false; });
        }
    };
    PermissionModelComponent.prototype.makeCount = function () {
        var count = 0;
        this.newRoleObj.pageList.forEach(function (item) {
            if (item.isSelected) {
                count += 1;
            }
        });
        return count;
    };
    PermissionModelComponent.prototype.selectPage = function (event) {
        if (event.target.checked) {
            if (this.makeCount() === this.newRoleObj.pageList.length) {
                this.newRoleObj.isSelectedAllPages = true;
            }
        }
        else {
            if (this.makeCount() === this.newRoleObj.pageList.length) {
                this.newRoleObj.isSelectedAllPages = false;
            }
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], PermissionModelComponent.prototype, "closeEvent", void 0);
    PermissionModelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'permission-model',
            template: __webpack_require__(/*! ./permission.model.component.html */ "./src/app/permissions/components/model/permission.model.component.html"),
            providers: [{ provide: ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_6__["BsDropdownConfig"], useValue: { autoClose: false } }],
            styles: [__webpack_require__(/*! ./permission.model.component.css */ "./src/app/permissions/components/model/permission.model.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_7__["PermissionActions"]])
    ], PermissionModelComponent);
    return PermissionModelComponent;
}());



/***/ }),

/***/ "./src/app/permissions/permission-routing-module.ts":
/*!**********************************************************!*\
  !*** ./src/app/permissions/permission-routing-module.ts ***!
  \**********************************************************/
/*! exports provided: PermissionRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionRoutingModule", function() { return PermissionRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _permission_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./permission.component */ "./src/app/permissions/permission.component.ts");
/* harmony import */ var _components_list_permission_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/list/permission.list.component */ "./src/app/permissions/components/list/permission.list.component.ts");
/* harmony import */ var _components_details_permission_details_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/details/permission.details.component */ "./src/app/permissions/components/details/permission.details.component.ts");
/* harmony import */ var _components_confirmation_confirmation_model_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/confirmation/confirmation.model.component */ "./src/app/permissions/components/confirmation/confirmation.model.component.ts");
/* harmony import */ var _components_model_permission_model_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/model/permission.model.component */ "./src/app/permissions/components/model/permission.model.component.ts");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _sort_pipe__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sort.pipe */ "./src/app/permissions/sort.pipe.ts");
/* harmony import */ var _capitalize_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./capitalize.pipe */ "./src/app/permissions/capitalize.pipe.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");















var PERMISSION_ROUTES = [
    { path: '', redirectTo: 'pages/permissions/list', pathMatch: 'full', canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_10__["NeedsAuthentication"]] },
    {
        path: '',
        component: _permission_component__WEBPACK_IMPORTED_MODULE_5__["PermissionComponent"],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'list' },
            {
                path: 'list',
                component: _components_list_permission_list_component__WEBPACK_IMPORTED_MODULE_6__["PermissionListComponent"],
                canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_10__["NeedsAuthentication"]]
            },
            {
                path: 'details',
                component: _components_details_permission_details_component__WEBPACK_IMPORTED_MODULE_7__["PermissionDetailsComponent"],
                canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_10__["NeedsAuthentication"]]
            },
        ]
    }
];
var PermissionRoutingModule = /** @class */ (function () {
    function PermissionRoutingModule() {
    }
    PermissionRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _permission_component__WEBPACK_IMPORTED_MODULE_5__["PermissionComponent"],
                _components_list_permission_list_component__WEBPACK_IMPORTED_MODULE_6__["PermissionListComponent"],
                _components_details_permission_details_component__WEBPACK_IMPORTED_MODULE_7__["PermissionDetailsComponent"],
                _components_model_permission_model_component__WEBPACK_IMPORTED_MODULE_9__["PermissionModelComponent"],
                _components_confirmation_confirmation_model_component__WEBPACK_IMPORTED_MODULE_8__["DeleteRoleConfirmationModelComponent"],
                _sort_pipe__WEBPACK_IMPORTED_MODULE_11__["SortByPipe"],
                _capitalize_pipe__WEBPACK_IMPORTED_MODULE_12__["CapitalizePipe"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(PERMISSION_ROUTES),
                angular2_ladda__WEBPACK_IMPORTED_MODULE_13__["LaddaModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_14__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_14__["BsDropdownModule"]
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"],
                _capitalize_pipe__WEBPACK_IMPORTED_MODULE_12__["CapitalizePipe"]
            ],
            providers: []
        })
    ], PermissionRoutingModule);
    return PermissionRoutingModule;
}());



/***/ }),

/***/ "./src/app/permissions/permission.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/permissions/permission.component.ts ***!
  \*****************************************************/
/*! exports provided: PermissionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionComponent", function() { return PermissionComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");






var PermissionComponent = /** @class */ (function () {
    function PermissionComponent(store, companyActions) {
        this.store = store;
        this.companyActions = companyActions;
    }
    PermissionComponent.prototype.ngOnInit = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'permissions';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    PermissionComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: '<router-outlet></router-outlet>'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_3__["CompanyActions"]])
    ], PermissionComponent);
    return PermissionComponent;
}());



/***/ }),

/***/ "./src/app/permissions/permission.module.ts":
/*!**************************************************!*\
  !*** ./src/app/permissions/permission.module.ts ***!
  \**************************************************/
/*! exports provided: PermissionModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionModule", function() { return PermissionModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _permission_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./permission-routing-module */ "./src/app/permissions/permission-routing-module.ts");





var PermissionModule = /** @class */ (function () {
    function PermissionModule() {
    }
    PermissionModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _permission_routing_module__WEBPACK_IMPORTED_MODULE_4__["PermissionRoutingModule"]
            ]
        })
    ], PermissionModule);
    return PermissionModule;
}());



/***/ }),

/***/ "./src/app/permissions/permission.utility.ts":
/*!***************************************************!*\
  !*** ./src/app/permissions/permission.utility.ts ***!
  \***************************************************/
/*! exports provided: NewRoleClass, NewPermissionObj, NewRoleFormClass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewRoleClass", function() { return NewRoleClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewPermissionObj", function() { return NewPermissionObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewRoleFormClass", function() { return NewRoleFormClass; });
var NewRoleClass = /** @class */ (function () {
    function NewRoleClass(name, scopes, isFixed, uniqueName, isUpdateCase) {
        this.name = name;
        this.scopes = scopes;
        this.isFixed = isFixed;
        this.uniqueName = uniqueName;
        this.isUpdateCase = isUpdateCase;
    }
    return NewRoleClass;
}());

var NewPermissionObj = /** @class */ (function () {
    function NewPermissionObj(code, isSelected) {
        this.code = code;
        this.isSelected = isSelected;
    }
    return NewPermissionObj;
}());

var NewRoleFormClass = /** @class */ (function () {
    function NewRoleFormClass() {
    }
    return NewRoleFormClass;
}());



/***/ }),

/***/ "./src/app/permissions/sort.pipe.ts":
/*!******************************************!*\
  !*** ./src/app/permissions/sort.pipe.ts ***!
  \******************************************/
/*! exports provided: SortByPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SortByPipe", function() { return SortByPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var SortByPipe = /** @class */ (function () {
    function SortByPipe() {
    }
    SortByPipe.prototype.transform = function (array, args) {
        if (array) {
            var sortField_1 = args[0]; // the field we want to sort by
            array.sort(function (a, b) {
                if (a[sortField_1] < b[sortField_1]) {
                    return -1;
                }
                else if (a[sortField_1] > b[sortField_1]) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            return array;
        }
    };
    SortByPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'mySortBy'
        })
    ], SortByPipe);
    return SortByPipe;
}());



/***/ })

}]);