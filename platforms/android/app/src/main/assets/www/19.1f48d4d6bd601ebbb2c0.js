(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[19],{

/***/ "./src/app/import-excel/import-excel.component.html":
/*!**********************************************************!*\
  !*** ./src/app/import-excel/import-excel.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/import-excel/import-excel.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/import-excel/import-excel.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".steps_wizard {\n  padding: 30px 0;\n  background: #fff;\n  text-align: center;\n  display: -webkit-box;\n  display: flex;\n  justify-content: space-around; }\n  .steps_wizard li {\n    padding-bottom: 0;\n    padding: 0 15px;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n            flex-direction: column;\n    width: auto;\n    position: relative;\n    -webkit-box-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n            align-items: center; }\n  .steps_wizard li > label {\n      width: 30px;\n      height: 30px;\n      border: 2px solid #dcdcdc;\n      border-radius: 100%;\n      -webkit-transition: background-color 1s;\n      transition: background-color 1s;\n      background-color: #ffffff;\n      position: relative;\n      color: #969696;\n      line-height: 100%;\n      -webkit-box-align: center;\n              align-items: center;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-pack: center;\n              justify-content: center; }\n  .upload_excel {\n  display: -webkit-box;\n  display: flex;\n  height: 320px;\n  position: relative;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center; }\n  .max500 {\n  max-width: 500px; }\n  .uploader_label {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  cursor: pointer; }\n  #csvUploadInput {\n  visibility: hidden; }\n  .upload_icon {\n  font-size: 62px;\n  float: none;\n  color: #e2e2e2; }\n  .sample_file-btn {\n  z-index: 9;\n  position: relative; }\n  .dashed_bdr {\n  border: 2px dashed #d9d9d9; }\n  .import_type {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center; }\n  .import_type li {\n  list-style: none;\n  width: 320px;\n  height: 150px;\n  text-align: center;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  margin: 0 15px;\n  border: 1px solid #d9d9d9;\n  background: #fafafa;\n  padding: 15px;\n  cursor: pointer;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease; }\n  .import_type h2 {\n  margin-bottom: 30px; }\n  .import_type li:hover {\n  border: 1px solid #ff5e01;\n  -webkit-transform: scale(1.01);\n          transform: scale(1.01); }\n  .lead {\n  font-size: 36px;\n  margin-bottom: 10px; }\n  .has-error .form-control {\n  border-color: red !important; }\n"

/***/ }),

/***/ "./src/app/import-excel/import-excel.component.ts":
/*!********************************************************!*\
  !*** ./src/app/import-excel/import-excel.component.ts ***!
  \********************************************************/
/*! exports provided: ImportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportComponent", function() { return ImportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apps/web-giddh/src/app/models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var apps_web_giddh_src_app_actions_company_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/company.actions */ "./src/app/actions/company.actions.ts");






var ImportComponent = /** @class */ (function () {
    function ImportComponent(store, _companyActions) {
        this.store = store;
        this._companyActions = _companyActions;
        //
    }
    ImportComponent.prototype.ngOnInit = function () {
        //
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_4__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'import';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    };
    ImportComponent.prototype.ngAfterViewInit = function () {
        //
    };
    ImportComponent.prototype.ngOnDestroy = function () {
        //
    };
    ImportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'import-excel',
            template: __webpack_require__(/*! ./import-excel.component.html */ "./src/app/import-excel/import-excel.component.html"),
            styles: [__webpack_require__(/*! ./import-excel.component.scss */ "./src/app/import-excel/import-excel.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], apps_web_giddh_src_app_actions_company_actions__WEBPACK_IMPORTED_MODULE_5__["CompanyActions"]])
    ], ImportComponent);
    return ImportComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/import-excel.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/import-excel/import-excel.module.ts ***!
  \*****************************************************/
/*! exports provided: ImportExcelModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportExcelModule", function() { return ImportExcelModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _import_excel_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./import-excel.component */ "./src/app/import-excel/import-excel.component.ts");
/* harmony import */ var _import_excel_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./import-excel.routing.module */ "./src/app/import-excel/import-excel.routing.module.ts");
/* harmony import */ var _import_type_select_import_type_select_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./import-type-select/import-type-select.component */ "./src/app/import-excel/import-type-select/import-type-select.component.ts");
/* harmony import */ var _import_process_import_process_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./import-process/import-process.component */ "./src/app/import-excel/import-process/import-process.component.ts");
/* harmony import */ var _map_excel_data_map_excel_data_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./map-excel-data/map-excel-data.component */ "./src/app/import-excel/map-excel-data/map-excel-data.component.ts");
/* harmony import */ var _upload_file_upload_file_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./upload-file/upload-file.component */ "./src/app/import-excel/upload-file/upload-file.component.ts");
/* harmony import */ var _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./import-wizard/import-wizard.component */ "./src/app/import-excel/import-wizard/import-wizard.component.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "../../node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var _upload_success_upload_success_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./upload-success/upload-success.component */ "./src/app/import-excel/upload-success/upload-success.component.ts");
/* harmony import */ var _import_report_import_report_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./import-report/import-report.component */ "./src/app/import-excel/import-report/import-report.component.ts");

















var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var ImportExcelModule = /** @class */ (function () {
    function ImportExcelModule() {
    }
    ImportExcelModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            declarations: [
                // Components / Directives/ Pipes
                _import_excel_component__WEBPACK_IMPORTED_MODULE_4__["ImportComponent"],
                _import_type_select_import_type_select_component__WEBPACK_IMPORTED_MODULE_6__["ImportTypeSelectComponent"],
                _import_process_import_process_component__WEBPACK_IMPORTED_MODULE_7__["ImportProcessComponent"],
                _map_excel_data_map_excel_data_component__WEBPACK_IMPORTED_MODULE_8__["MapExcelDataComponent"],
                _upload_file_upload_file_component__WEBPACK_IMPORTED_MODULE_9__["UploadFileComponent"],
                _upload_success_upload_success_component__WEBPACK_IMPORTED_MODULE_15__["UploadSuccessComponent"],
                _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_10__["ImportWizardComponent"],
                _import_report_import_report_component__WEBPACK_IMPORTED_MODULE_16__["ImportReportComponent"]
            ],
            exports: [_import_excel_component__WEBPACK_IMPORTED_MODULE_4__["ImportComponent"]],
            providers: [{
                    provide: ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_14__["PERFECT_SCROLLBAR_CONFIG"],
                    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
                }],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _import_excel_routing_module__WEBPACK_IMPORTED_MODULE_5__["ImportExcelRoutingModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_11__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_12__["ShSelectModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__["TooltipModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__["BsDropdownModule"],
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_14__["PerfectScrollbarModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__["PaginationModule"]
            ],
        })
    ], ImportExcelModule);
    return ImportExcelModule;
}());



/***/ }),

/***/ "./src/app/import-excel/import-excel.routing.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/import-excel/import-excel.routing.module.ts ***!
  \*************************************************************/
/*! exports provided: ImportExcelRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportExcelRoutingModule", function() { return ImportExcelRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _import_excel_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./import-excel.component */ "./src/app/import-excel/import-excel.component.ts");
/* harmony import */ var _import_type_select_import_type_select_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./import-type-select/import-type-select.component */ "./src/app/import-excel/import-type-select/import-type-select.component.ts");
/* harmony import */ var _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./import-wizard/import-wizard.component */ "./src/app/import-excel/import-wizard/import-wizard.component.ts");
/* harmony import */ var _import_report_import_report_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./import-report/import-report.component */ "./src/app/import-excel/import-report/import-report.component.ts");







var ImportExcelRoutingModule = /** @class */ (function () {
    function ImportExcelRoutingModule() {
    }
    ImportExcelRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _import_excel_component__WEBPACK_IMPORTED_MODULE_3__["ImportComponent"], children: [
                            { path: '', redirectTo: 'select' },
                            { path: 'select', component: _import_type_select_import_type_select_component__WEBPACK_IMPORTED_MODULE_4__["ImportTypeSelectComponent"] },
                            { path: 'group', component: _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__["ImportWizardComponent"] },
                            { path: 'account', component: _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__["ImportWizardComponent"] },
                            { path: 'entries', component: _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__["ImportWizardComponent"] },
                            { path: 'trial-balance', component: _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__["ImportWizardComponent"] },
                            { path: 'stock', component: _import_wizard_import_wizard_component__WEBPACK_IMPORTED_MODULE_5__["ImportWizardComponent"] },
                            { path: 'import-report', component: _import_report_import_report_component__WEBPACK_IMPORTED_MODULE_6__["ImportReportComponent"] }
                        ]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], ImportExcelRoutingModule);
    return ImportExcelRoutingModule;
}());



/***/ }),

/***/ "./src/app/import-excel/import-process/import-process.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/import-process/import-process.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Review Field start-->\n<div class=\"reviewData\">\n  <div class=\"text-right\">\n    <div class=\"action_btn\">\n      <button class=\"btn btn-default\" (click)=\"onBack.emit()\">Back</button>\n      <button class=\"btn btn-success\" [disabled]=\"!importDisable\" [ladda]=\"isLoading\" (click)=\"save()\">Import</button>\n    </div>\n  </div>\n  <div class=\"data_overview\" [perfectScrollbar]=\"config\">\n\n    <table class=\"table basic table-bordered mrT1\">\n\n      <thead>\n\n        <tr>\n          <th *ngFor=\"let col of userHeader\">{{col}}</th>\n        </tr>\n\n      </thead>\n\n      <tbody>\n\n        <tr *ngFor=\"let item of importData.data.items\">\n          <td *ngFor=\"let row of item.row\">\n            <div class=\"ellp\" container=\"body\" [tooltip]=\"row.columnValue\">{{row.columnValue}}</div>\n          </td>\n        </tr>\n\n      </tbody>\n\n    </table>\n\n  </div>\n\n</div>\n<!-- Review Field end-->\n"

/***/ }),

/***/ "./src/app/import-excel/import-process/import-process.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/import-process/import-process.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  table-layout: fixed; }\n\n.basic > thead > tr > th {\n  width: 140px;\n  white-space: inherit; }\n\n.basic > thead > tr > th > .heads div:first-child {\n  max-width: 75%;\n  float: left; }\n\n.data_overview {\n  width: 100%;\n  overflow-x: scroll;\n  min-height: 300px;\n  position: relative; }\n\n.dropdown-menu {\n  max-height: 200px;\n  overflow-y: scroll; }\n\n.dropdown-menu li a {\n  padding: 6px 10px;\n  color: rgba(0, 0, 0, 0.8); }\n\n.action_btn {\n  right: 15px; }\n\n.edit_column {\n  opacity: 0.3; }\n\n.basic > thead > tr > th:hover .edit_column {\n  opacity: 1; }\n\n.basic > thead > tr > th {\n  border: 1px solid #ccc; }\n"

/***/ }),

/***/ "./src/app/import-excel/import-process/import-process.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/import-process/import-process.component.ts ***!
  \*************************************************************************/
/*! exports provided: ImportProcessComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportProcessComponent", function() { return ImportProcessComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");



var ImportProcessComponent = /** @class */ (function () {
    function ImportProcessComponent() {
        this.onSubmit = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onBack = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.config = { suppressScrollX: false, suppressScrollY: false };
        this.userHeader = [];
        this.importDisable = true;
        //
    }
    Object.defineProperty(ImportProcessComponent.prototype, "importData", {
        get: function () {
            return this._importData;
        },
        set: function (value) {
            var _this = this;
            this.userHeader = [];
            this.rawImportData = value;
            var clonedValues = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_2__["cloneDeep"])(value);
            clonedValues.data.items = clonedValues.data.items.filter(function (item) {
                item.row = item.row.filter(function (ro) { return clonedValues.mappings.some(function (s) { return s.columnNumber === parseInt(ro.columnNumber); }); });
                return item;
            });
            this._importData = clonedValues;
            // prepare table header from mappings.mappedColumn and first sortBy columnNumber
            Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_2__["sortBy"])(clonedValues.mappings, ['columnNumber']).forEach(function (f) { return _this.userHeader.push(f.mappedColumn); });
        },
        enumerable: true,
        configurable: true
    });
    ImportProcessComponent.prototype.save = function () {
        var data = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.importData.data, { items: this.importData.data.items });
        this.onSubmit.emit(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.importData, { data: data }));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object])
    ], ImportProcessComponent.prototype, "importData", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ImportProcessComponent.prototype, "onSubmit", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ImportProcessComponent.prototype, "onBack", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], ImportProcessComponent.prototype, "isLoading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ImportProcessComponent.prototype, "entity", void 0);
    ImportProcessComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'import-process',
            template: __webpack_require__(/*! ./import-process.component.html */ "./src/app/import-excel/import-process/import-process.component.html"),
            styles: [__webpack_require__(/*! ./import-process.component.scss */ "./src/app/import-excel/import-process/import-process.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ImportProcessComponent);
    return ImportProcessComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/import-report/import-report.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/import-report/import-report.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"padd15\">\n\n  <div class=\"d-flex\" style=\"flex-direction: column\">\n    <div class=\"text-right\">\n      <button class=\"btn btn-blue\" style=\"margin: 0 !important;\" (click)=\"importFiles()\">Import Files</button>\n    </div>\n\n    <div class=\"mt-2\" style=\"height: 68vh; overflow-y: auto;\">\n\n      <div class=\"no-data h-100\" *ngIf=\"!importStatusResponse?.results?.length\">\n        <h2>No Import Status Available.</h2>\n      </div>\n\n      <div class=\"row\" style=\"margin: 0\">\n\n        <div class=\"col-xs-6 mb-2\" *ngFor=\"let item of importStatusResponse.results\">\n\n          <div class=\"r-card\">\n\n            <i class=\"hover-orange\" style=\"position: absolute;right: 15px;cursor: pointer;z-index: 2;\"\n               (click)=\"downloadItem(item)\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"13.333\" height=\"15\" viewBox=\"0 0 13.333 15\"\n                   class=\"svg_hover_orange\">\n                <path class=\"\"\n                      d=\"M77.9,363.333H91.233V365H77.9Zm10-5-3.333,3.333-3.333-3.333h2.5V350H85.4v8.333Z\"\n                      transform=\"translate(-77.9 -350)\"/>\n              </svg>\n            </i>\n\n            <div class=\"row\">\n\n              <div class=\"col-xs-3\">\n                <label class=\"text-gray\">File Name:</label>\n              </div>\n\n              <div class=\"col-xs-9\">{{ item?.fileName }}</div>\n\n            </div>\n\n            <div class=\"row mt-2\">\n\n              <div class=\"col-xs-3\">\n                <label class=\"text-gray\">Status:</label>\n              </div>\n\n              <div class=\"col-xs-9\"><span class=\"text-or\">{{ item?.status }}</span></div>\n\n            </div>\n\n            <div class=\"row mt-2\">\n\n              <div class=\"col-xs-3\">\n                <label class=\"text-gray\">Dated:</label>\n              </div>\n              <div class=\"col-xs-9\">{{ item?.processDate }}</div>\n\n            </div>\n\n            <div class=\"row mt-2\">\n\n              <div class=\"col-xs-3\">\n                <label class=\"text-gray\">Submitted By:</label>\n              </div>\n              <div class=\"col-xs-9\">{{ item?.submittedBy }}</div>\n\n            </div>\n\n          </div>\n        </div>\n\n      </div>\n    </div>\n\n    <div style=\"display: flex; justify-content: center;\" [hidden]=\"importStatusResponse.totalItems <= 0\">\n      <pagination [totalItems]=\"importStatusResponse.totalItems\" [(ngModel)]=\"importPaginatedRequest.page\"\n                  [maxSize]=\"5\" class=\"pagination-sm\" [boundaryLinks]=\"true\"\n                  [itemsPerPage]=\"importStatusResponse.count\" [rotate]=\"false\"\n                  (pageChanged)=\"pageChanged($event)\"></pagination>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/import-excel/import-report/import-report.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/import-report/import-report.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".r-card {\n  padding: 16px;\n  background-color: white;\n  box-shadow: 0px 3px 7px #00000026;\n  border-radius: 2px;\n  position: relative;\n  padding-right: 30px; }\n  .r-card label.text-gray {\n    color: #646464; }\n  .text-or {\n  color: #FF5F00 !important; }\n  .svg_hover_orange:hover {\n  fill: #FF5F00 !important; }\n"

/***/ }),

/***/ "./src/app/import-excel/import-report/import-report.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/import-excel/import-report/import-report.component.ts ***!
  \***********************************************************************/
/*! exports provided: ImportReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportReportComponent", function() { return ImportReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/import-excel/import-excel.actions */ "./src/app/actions/import-excel/import-excel.actions.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/api-models/Invoice */ "./src/app/models/api-models/Invoice.ts");
/* harmony import */ var _services_import_excel_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/import-excel.service */ "./src/app/services/import-excel.service.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_12__);













var ImportReportComponent = /** @class */ (function () {
    function ImportReportComponent(_router, store, _importActions, _importExcelService, _toaster) {
        var _this = this;
        this._router = _router;
        this.store = store;
        this._importActions = _importActions;
        this._importExcelService = _importExcelService;
        this._toaster = _toaster;
        this.importPaginatedRequest = new _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_7__["CommonPaginatedRequest"]();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(function (s) { return s.importExcel.importStatus; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s && s.results) {
                s.results = s.results.map(function (res) {
                    res.processDate = moment__WEBPACK_IMPORTED_MODULE_12__["utc"](res.processDate, 'YYYY-MM-DD hh:mm:ss a').local().format('DD-MM-YYYY hh:mm:ss a');
                    return res;
                });
            }
            _this.importStatusResponse = s;
        });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(function (s) { return s.importExcel.requestState; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.importRequestStatus = s;
        });
        this.importPaginatedRequest.page = 1;
        this.importPaginatedRequest.count = 10;
    }
    ImportReportComponent.prototype.ngOnInit = function () {
        this.getStatus();
    };
    ImportReportComponent.prototype.importFiles = function () {
        this._router.navigate(['pages', 'import']);
    };
    ImportReportComponent.prototype.pageChanged = function (event) {
        this.importPaginatedRequest.page = event.page;
        this.getStatus();
    };
    ImportReportComponent.prototype.getStatus = function () {
        this.store.dispatch(this._importActions.ImportStatusRequest(this.importPaginatedRequest));
    };
    ImportReportComponent.prototype.downloadItem = function (item) {
        var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_9__["base64ToBlob"])(item.fileBase64, 'application/vnd.ms-excel', 512);
        return Object(file_saver__WEBPACK_IMPORTED_MODULE_11__["saveAs"])(blob, item.fileName);
    };
    ImportReportComponent.prototype.resetStoreData = function () {
        this.store.dispatch(this._importActions.resetImportExcelState());
    };
    ImportReportComponent.prototype.ngOnDestroy = function () {
        this.resetStoreData();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    ImportReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'import-report',
            template: __webpack_require__(/*! ./import-report.component.html */ "./src/app/import-excel/import-report/import-report.component.html"),
            styles: [__webpack_require__(/*! ./import-report.component.scss */ "./src/app/import-excel/import-report/import-report.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__["ImportExcelActions"],
            _services_import_excel_service__WEBPACK_IMPORTED_MODULE_8__["ImportExcelService"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__["ToasterService"]])
    ], ImportReportComponent);
    return ImportReportComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/import-type-select/import-type-select.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/import-excel/import-type-select/import-type-select.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"col-xs-12\">\n  <div class=\"pd2 mrT2\">\n    <div class=\"text-center mrT2 mrB2\">\n      <h1 class=\"lead\">Have data in CSV or Excel files?</h1>\n      <h4>It’s easy to import from your computer</h4>\n      <a href=\"javascript:void 0\" class=\"text-link-2 mt-1 d-block text-center\"\n         [routerLink]=\"['/pages','import', 'import-report']\"\n      >Previous Imports</a>\n    </div>\n    <!--Buttons-->\n    <ul class=\"import_type row mrB2 mrT4 pdT4\">\n\n      <li>\n        <a class=\"text-link-2\" [routerLink]=\"['/pages','import','group']\">\n          <img src=\"assets/images/new/group-import.svg\"/>\n          <h2>Groups</h2>\n        </a>\n\n      </li>\n\n      <li>\n        <a class=\"text-link-2\" [routerLink]=\"['/pages','import','account']\">\n          <img src=\"assets/images/new/acc-import.svg\"/>\n          <h2>Accounts</h2>\n        </a>\n      </li>\n\n      <li>\n        <a class=\"text-link-2\" [routerLink]=\"['/pages','import','stock']\">\n          <img src=\"assets/images/new/Inventory-13.svg\"/>\n          <h2>Inventory</h2>\n        </a>\n      </li>\n\n      <li>\n        <a class=\"text-link-2\" [routerLink]=\"['/pages','import','entries']\">\n          <img src=\"assets/images/new/entries-import.svg\"/>\n          <h2>Entries</h2>\n        </a>\n      </li>\n\n      <li>\n        <a class=\"text-link-2\" [routerLink]=\"['/pages','import','trial-balance']\">\n          <img src=\"assets/images/new/tb-import.svg\"/>\n          <h2>Trial Balance</h2>\n        </a>\n\n      </li>\n\n    </ul>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/import-excel/import-type-select/import-type-select.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/import-excel/import-type-select/import-type-select.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".import_type {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.import_type li {\n  list-style: none;\n  width: 225px;\n  text-align: center;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  margin: 0 25px;\n  border: 1px solid #d9d9d9;\n  background: #fafafa;\n  cursor: pointer;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n  color: initial;\n  border-radius: 2px;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.import_type h2 {\n  margin-bottom: 20px;\n  margin-top: 20px;\n  font-size: 14px; }\n\n.import_type li:hover {\n  border: 1px solid #ff5e01; }\n\n.lead {\n  font-size: 36px;\n  margin-bottom: 10px; }\n\n.has-error .form-control {\n  border-color: red !important; }\n\n.import_type img {\n  max-width: 90px; }\n\n.import_type > li > a {\n  display: block;\n  padding: 30px 40px;\n  width: 100%; }\n\n.text-link-2 {\n  color: #0C8FE6 !important; }\n\n.text-link-2:hover {\n    color: #0C8FE6 !important; }\n"

/***/ }),

/***/ "./src/app/import-excel/import-type-select/import-type-select.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/import-excel/import-type-select/import-type-select.component.ts ***!
  \*********************************************************************************/
/*! exports provided: ImportTypeSelectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportTypeSelectComponent", function() { return ImportTypeSelectComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/import-excel/import-excel.actions */ "./src/app/actions/import-excel/import-excel.actions.ts");





var ImportTypeSelectComponent = /** @class */ (function () {
    function ImportTypeSelectComponent(store, _router, _importExcelActions) {
        this.store = store;
        this._router = _router;
        this._importExcelActions = _importExcelActions;
    }
    ImportTypeSelectComponent.prototype.ngOnInit = function () {
        this.store.dispatch(this._importExcelActions.resetImportExcelState());
    };
    ImportTypeSelectComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'import-type-select',
            template: __webpack_require__(/*! ./import-type-select.component.html */ "./src/app/import-excel/import-type-select/import-type-select.component.html"),
            styles: [__webpack_require__(/*! ./import-type-select.component.scss */ "./src/app/import-excel/import-type-select/import-type-select.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__["ImportExcelActions"]])
    ], ImportTypeSelectComponent);
    return ImportTypeSelectComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/import-wizard/import-wizard.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/import-wizard/import-wizard.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid clearfix\">\n  <div class=\"top_bar\" *ngIf=\"step <= 3\">\n    <h2 class=\"section_title\" *ngIf=\"step === 1\"></h2>\n    <h2 class=\"section_title\" *ngIf=\"step === 2\">Map Fields</h2>\n    <h2 class=\"section_title\" *ngIf=\"step === 3\">Import Data</h2>\n  </div>\n</div>\n\n<div class=\"clearfix col-xs-12\">\n  <div class=\"col-xs-12 p0\">\n    <div class=\"clearfix mrT2\">\n      <div [ngSwitch]=\"step\">\n\n        <ng-container *ngSwitchCase=\"1\">\n          <upload-file [isLoading]=\"isUploadInProgress\" [entity]=\"entity\"\n                       (onFileUpload)=\"onFileUpload($event)\"></upload-file>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"2\">\n          <map-excel-data [importData]=\"excelState?.importExcelData\"\n                          [entity]=\"entity\"\n                          (onNext)=\"mappingDone(excelState?.importExcelData)\"\n                          (onBack)=\"onBack()\"></map-excel-data>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"3\">\n          <import-process [entity]=\"entity\" [isLoading]=\"excelState?.requestState === 4\" [importData]=\"mappedData\"\n                          (onSubmit)=\"onSubmit($event)\"\n                          (onBack)=\"onBack()\"></import-process>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"4\">\n          <upload-success (onContinueUpload)=\"onContinueUpload($event)\"\n                          (onShowReport)=\"showReport()\"\n                          [UploadExceltableResponse]=\"UploadExceltableResponse\"></upload-success>\n        </ng-container>\n        \n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/import-excel/import-wizard/import-wizard.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/import-wizard/import-wizard.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".steps_wizard {\n  padding: 30px 70px;\n  background: #fff;\n  text-align: center;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: justify;\n          justify-content: space-between;\n  overflow: hidden;\n  position: relative; }\n  .steps_wizard li {\n    padding-bottom: 0;\n    padding: 0;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n            flex-direction: column;\n    width: auto;\n    position: relative;\n    -webkit-box-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n            align-items: center; }\n  .steps_wizard li > label {\n      width: 30px;\n      height: 30px;\n      border: 2px solid #dcdcdc;\n      border-radius: 100%;\n      -webkit-transition: background-color 1s;\n      transition: background-color 1s;\n      background-color: #ffffff;\n      position: relative;\n      color: #969696;\n      line-height: 100%;\n      -webkit-box-align: center;\n              align-items: center;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-pack: center;\n              justify-content: center; }\n  .steps_wizard li.active > label {\n  background: #ff5e01;\n  color: #fff; }\n  .steps_wizard:before {\n  content: ' ';\n  position: absolute;\n  border-top: 2px solid #ddd;\n  right: 0;\n  left: 0;\n  top: 40%;\n  width: calc(100% - 172px);\n  margin: 0 auto; }\n"

/***/ }),

/***/ "./src/app/import-excel/import-wizard/import-wizard.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/import-excel/import-wizard/import-wizard.component.ts ***!
  \***********************************************************************/
/*! exports provided: ImportWizardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportWizardComponent", function() { return ImportWizardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/import-excel/import-excel.actions */ "./src/app/actions/import-excel/import-excel.actions.ts");
/* harmony import */ var _store_import_excel_import_excel_reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../store/import-excel/import-excel.reducer */ "./src/app/store/import-excel/import-excel.reducer.ts");
/* harmony import */ var apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! apps/web-giddh/src/app/services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");









var ImportWizardComponent = /** @class */ (function () {
    function ImportWizardComponent(store, _router, _activatedRoute, _importActions, _cdRef, _toaster) {
        var _this = this;
        this.store = store;
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._importActions = _importActions;
        this._cdRef = _cdRef;
        this._toaster = _toaster;
        this.step = 1;
        this.isUploadInProgress = false;
        this.UploadExceltableResponse = {
            failureCount: 0,
            message: '',
            response: '',
            successCount: 0
        };
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_7__["ReplaySubject"](1);
        this.dataChanged = function (excelState) {
            _this.excelState = excelState;
            // if file uploaded successfully
            if (excelState.requestState === _store_import_excel_import_excel_reducer__WEBPACK_IMPORTED_MODULE_5__["ImportExcelRequestStates"].UploadFileSuccess) {
                _this.step++;
                // this.onNext(excelState.importExcelData);
            }
            // if import is done successfully
            if (excelState.requestState === _store_import_excel_import_excel_reducer__WEBPACK_IMPORTED_MODULE_5__["ImportExcelRequestStates"].ProcessImportSuccess) {
                // if rows grater then 400 rows show report page
                if (_this.excelState.importResponse.message) {
                    _this._toaster.successToast(_this.excelState.importResponse.message);
                    _this.showReport();
                }
                else {
                    // go to import success page
                    _this.step++;
                    _this.UploadExceltableResponse = _this.excelState.importResponse;
                }
            }
            if (_this.excelState.importResponse) {
                _this.UploadExceltableResponse = _this.excelState.importResponse;
            }
            _this.isUploadInProgress = excelState.requestState === _store_import_excel_import_excel_reducer__WEBPACK_IMPORTED_MODULE_5__["ImportExcelRequestStates"].UploadFileInProgress;
        };
    }
    ImportWizardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.url.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["takeUntil"])(this.destroyed$)).subscribe(function (p) { return _this.entity = p[0].path; });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(function (p) { return p.importExcel; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["takeUntil"])(this.destroyed$))
            .subscribe(this.dataChanged);
    };
    ImportWizardComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    ImportWizardComponent.prototype.onFileUpload = function (file) {
        this.store.dispatch(this._importActions.uploadFileRequest(this.entity, file));
    };
    ImportWizardComponent.prototype.onContinueUpload = function (e) {
        this._router.navigate(['/pages/import/select']);
    };
    ImportWizardComponent.prototype.onNext = function (importData) {
        this.mappedData = importData;
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    };
    ImportWizardComponent.prototype.mappingDone = function (importData) {
        this.step++;
        this.onNext(importData);
    };
    ImportWizardComponent.prototype.onBack = function () {
        this.step--;
    };
    ImportWizardComponent.prototype.showReport = function () {
        this._router.navigate(['/pages', 'import', 'import-report']);
    };
    ImportWizardComponent.prototype.onSubmit = function (data) {
        this.store.dispatch(this._importActions.processImportRequest(this.entity, data));
    };
    ImportWizardComponent.prototype.resetStoreData = function () {
        this.store.dispatch(this._importActions.resetImportExcelState());
    };
    ImportWizardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'import-wizard',
            template: __webpack_require__(/*! ./import-wizard.component.html */ "./src/app/import-excel/import-wizard/import-wizard.component.html"),
            styles: [__webpack_require__(/*! ./import-wizard.component.scss */ "./src/app/import-excel/import-wizard/import-wizard.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_4__["ImportExcelActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"],
            apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_6__["ToasterService"]])
    ], ImportWizardComponent);
    return ImportWizardComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/map-excel-data/map-excel-data.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/map-excel-data/map-excel-data.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Map Field start-->\n<div class=\"row mr0\" style=\"padding-bottom: 51px;\">\n  <div class=\"col-sm-8\">\n    <div class=\"mapFields\">\n      <strong>The best match to each field on the selected file have been auto-selected.</strong>\n\n      <div class=\"w-58pr\">\n\n        <div class=\"checkbox d-flex mt-2\">\n          <input type=\"checkbox\" name=\"isHeaderProvided\" id=\"isHeaderProvided\"\n                 [(ngModel)]=\"importData.isHeaderProvided\"> Is Header Provided ?\n        </div>\n\n        <div class=\"row mt-2 d-flex\">\n          <div class=\"col-xs-6\">\n            <small class=\"text-light-2\">Imported File Fields</small>\n          </div>\n          <div class=\"col-xs-6\">\n            <small class=\"text-light-2\">Giddh Fields</small>\n          </div>\n        </div>\n\n        <div class=\"row mt-2 d-flex\" *ngFor=\"let data of dataModel\">\n          <div class=\"col-xs-6 d-flex\" style=\"align-items:center\"><label>{{data.field.columnHeader}}</label></div>\n\n          <div class=\"col-xs-6\">\n\n            <sh-select\n              [options]=\"data.options\" class=\"pull-left mrR1\"\n              [placeholder]=\"'Select Field'\"\n              [(ngModel)]=\"data.selected\"\n              (selected)=\"columnSelected($event,data)\"\n              (onClear)=\"clearSelected($event, data)\"\n              (previousChange)=\"clearSelected($event, data)\"\n              [showClear]=\"true\"\n            ></sh-select>\n\n          </div>\n        </div>\n\n      </div>\n\n      <div class=\"mt-5\">\n        <button class=\"btn btn-default\" (click)=\"onBack.emit()\">Back</button>\n        <button class=\"btn btn-success\" (click)=\"mapExcelData()\">Next</button>\n      </div>\n\n    </div>\n  </div>\n\n\n</div>\n\n<div class=\"right-bar\">\n\n  <!-- filed mapping -->\n  <div>\n\n    <div>\n      <p>Mandatory fields to create <span class=\"text-or\">{{ entity | titlecase }}</span> in Giddh are:\n        <span>\n      <span [ngStyle]=\"{'color': mandatoryHeadersCount === mandatoryHeadersModel.length ? '#00b503' : '#adadad'}\">\n      {{ mandatoryHeadersCount }}</span>/{{ mandatoryHeadersModel.length }} done.</span>\n        &nbsp;<span *ngIf=\"mandatoryHeadersCount === mandatoryHeadersModel.length\"\n                    style=\"color: #00b503\">Successful.</span>\n      </p>\n    </div>\n\n    <div class=\"row mt-2 d-flex\" *ngFor=\"let manField of mandatoryHeadersModel\">\n\n      <div class=\"col-xs-8\"><label class=\"font-12px\">{{ manField.field | titlecase}}</label></div>\n\n      <div class=\"col-xs-4\">\n        <img src=\"{{imgPath}}checked.png\" *ngIf=\"manField.selected\" width=\"20\" height=\"20\"/>\n        <img src=\"{{imgPath}}unchecked.png\" *ngIf=\"!manField.selected\" width=\"20\" height=\"20\"/>\n      </div>\n\n    </div>\n\n  </div>\n\n  <!-- group mapping -->\n\n  <div *ngIf=\"mandatoryGroupModel.length\" style=\"margin-top: 50px\">\n\n    <div>\n      <p>At least one field from each group should be selected to create <span\n        class=\"text-or\">{{ entity | titlecase }}</span> in\n        Giddh <span>\n        <span\n          [ngStyle]=\"{'color': mandatoryGroupHeadersCount === mandatoryGroupModel.length ? '#00b503' : '#adadad'}\">{{ mandatoryGroupHeadersCount }}</span>/{{ mandatoryGroupModel.length }}\n          done.</span>\n        &nbsp;<span *ngIf=\"mandatoryGroupHeadersCount === mandatoryGroupModel.length\"\n                    style=\"color: #00b503\">Successful.</span>\n      </p>\n    </div>\n\n    <div *ngFor=\"let grp of mandatoryGroupModel\" class=\"group-card\">\n\n      <div class=\"row d-flex inner-row\" *ngFor=\"let g of grp\">\n\n        <div class=\"col-xs-8\"><label class=\"font-12px\">{{ g.field | titlecase}}</label></div>\n\n        <div class=\"col-xs-4\">\n          <img src=\"{{imgPath}}checked.png\" *ngIf=\"g.selected\" width=\"20\" height=\"20\"/>\n          <img src=\"{{imgPath}}unchecked.png\" *ngIf=\"!g.selected\" width=\"20\" height=\"20\"/>\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n<!-- Map Field end -->\n"

/***/ }),

/***/ "./src/app/import-excel/map-excel-data/map-excel-data.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/map-excel-data/map-excel-data.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".max500 {\n  max-width: 500px; }\n\n.right-bar {\n  position: absolute;\n  top: -49px;\n  background-color: white;\n  right: -15px;\n  height: unset;\n  width: 310px;\n  padding: 15px;\n  bottom: 0; }\n\n.w-58pr {\n  width: 58%; }\n\n.text-or {\n  color: #FF5F00; }\n\ninput.green-checkbox[type=\"checkbox\"]:after {\n  left: -3px !important;\n  border: 0px solid transparent !important;\n  background-color: #E6E6E6;\n  border-radius: 27px !important; }\n\ninput.green-checkbox[type=\"checkbox\"]:before {\n  border: 2px solid #ffffff !important;\n  border-top-style: none !important;\n  border-right-style: none !important;\n  left: 0px !important; }\n\n.font-12px {\n  font-size: 12px; }\n\ninput.green-checkbox[type=\"checkbox\"]:checked:after {\n  background-color: #2DAA4A !important; }\n\n.group-card {\n  border: 1px solid #bdbdbd;\n  padding: 0 13px;\n  border-radius: 4px;\n  margin: 15px 0; }\n\n.group-card .inner-row {\n    margin: 15px -13px !important; }\n"

/***/ }),

/***/ "./src/app/import-excel/map-excel-data/map-excel-data.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/map-excel-data/map-excel-data.component.ts ***!
  \*************************************************************************/
/*! exports provided: MapExcelDataComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapExcelDataComponent", function() { return MapExcelDataComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_import_excel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/import-excel */ "./src/app/models/api-models/import-excel.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");






var MandatoryHeaders = /** @class */ (function () {
    function MandatoryHeaders() {
    }
    return MandatoryHeaders;
}());
var MapExcelDataComponent = /** @class */ (function () {
    function MapExcelDataComponent(_toaster) {
        this._toaster = _toaster;
        this.onNext = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onBack = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.mandatoryHeadersModel = [];
        this.mandatoryHeadersCount = 0;
        this.mandatoryGroupModel = [];
        this.mandatoryGroupHeadersCount = 0;
        //
    }
    Object.defineProperty(MapExcelDataComponent.prototype, "importData", {
        get: function () {
            return this._importData;
        },
        set: function (value) {
            this.prepareDataModel(value);
            this.prepareMandatoryHeaders(value);
            this.updateMandatoryHeadersCounters();
            this._importData = value;
            this._clonedMappings = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["cloneDeep"])(value.mappings);
        },
        enumerable: true,
        configurable: true
    });
    MapExcelDataComponent.prototype.ngOnInit = function () {
        this.imgPath =  false ? undefined : "http://test.giddh.com/" + "app/" + 'assets/icon/';
    };
    MapExcelDataComponent.prototype.mapExcelData = function () {
        if (this.mandatoryHeadersCount !== this.mandatoryHeadersModel.length) {
            this._toaster.errorToast('Please Map the mandatory columns..');
            return;
        }
        else {
            // check if group have mandatory fields selected
            if (this.mandatoryGroupModel.length) {
                if (this.mandatoryGroupHeadersCount !== this.mandatoryGroupModel.length) {
                    this._toaster.errorToast('Please Map the mandatory columns..');
                    return;
                }
            }
        }
        this.importRequestData = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._importData, { data: {
                items: this._importData.data.items
                    .map(function (p) {
                    p.row = p.row.map(function (pr, index) {
                        pr.columnNumber = index.toString();
                        return pr;
                    });
                    return p;
                }),
                numRows: 0, totalRows: 0
            } });
        this.onNext.emit(this.importRequestData);
    };
    MapExcelDataComponent.prototype.columnSelected = function (val, data) {
        var _this = this;
        if (!val.value) {
            return;
        }
        // filter dataModel options as per selection and for handling duplicate column case
        this.dataModel = this.dataModel.map(function (m) {
            if (data.field.columnNumber !== m.field.columnNumber) {
                m.options = m.options.filter(function (f) { return f.value !== val.value; });
            }
            return m;
        });
        // change mapping column header as per selection
        var indexFromMappings = this._importData.mappings.findIndex(function (f) { return f.columnNumber === parseInt(data.field.columnNumber); });
        if (indexFromMappings > -1) {
            this._importData.mappings[indexFromMappings].mappedColumn = val.value;
        }
        else {
            var newMapping = new _models_api_models_import_excel__WEBPACK_IMPORTED_MODULE_2__["Mappings"]();
            newMapping.mappedColumn = val.value;
            newMapping.columnNumber = parseInt(data.field.columnNumber);
            newMapping.columnHeader = data.field.columnHeader;
            this._importData.mappings.push(newMapping);
        }
        // update mandatoryHeadersModel state
        this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(function (m) {
            if (_this.trimAndLowerCase(val.value) === _this.trimAndLowerCase(m.field)) {
                m.selected = true;
            }
            return m;
        });
        // update mandatoryGroupModel state
        this.mandatoryGroupModel = this.mandatoryGroupModel.map(function (m) {
            m = m.map(function (inm) {
                if (_this.trimAndLowerCase(val.value) === _this.trimAndLowerCase(inm.field)) {
                    inm.selected = true;
                }
                return inm;
            });
            return m;
        });
        this.updateMandatoryHeadersCounters();
        this.updateMandatoryGroupHeadersCounters();
    };
    MapExcelDataComponent.prototype.clearSelected = function (val, data) {
        // update mandatoryHeadersModel state
        this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(function (m) {
            if (m.field === val.value) {
                m.selected = false;
            }
            return m;
        });
        // update mandatoryGroupModel state
        this.mandatoryGroupModel = this.mandatoryGroupModel.map(function (m) {
            m = m.map(function (inm) {
                if (inm.field === val.value) {
                    inm.selected = false;
                }
                return inm;
            });
            return m;
        });
        // re-push cleared selection to option
        this.dataModel = this.dataModel.map(function (m) {
            if (data.field.columnNumber !== m.field.columnNumber) {
                m.options.push(val);
            }
            return m;
        });
        // change mapping column header as per de-selection
        this._importData.mappings = this._importData.mappings.filter(function (f) { return f.columnNumber !== parseInt(data.field.columnNumber); });
        this.updateMandatoryHeadersCounters();
        this.updateMandatoryGroupHeadersCounters();
    };
    MapExcelDataComponent.prototype.updateMandatoryHeadersCounters = function () {
        // count selected mandatory headers
        this.mandatoryHeadersCount = this.mandatoryHeadersModel.filter(function (f) { return f.selected; }).length;
    };
    MapExcelDataComponent.prototype.updateMandatoryGroupHeadersCounters = function () {
        // count selected mandatory headers
        this.mandatoryGroupHeadersCount = this.mandatoryGroupModel.filter(function (f) {
            return f.some(function (s) { return s.selected; });
        }).length;
    };
    MapExcelDataComponent.prototype.prepareDataModel = function (value) {
        this.dataModel = value.headers.items.map(function (field) {
            var selectedIndex;
            var allMappedColumnHeader = value.mappings.map(function (m) { return m.mappedColumn; });
            var options = [];
            selectedIndex = value.mappings.findIndex(function (f) { return f.columnNumber === parseInt(field.columnNumber); });
            if (selectedIndex > -1) {
                options = value.giddhHeaders.filter(function (f) { return allMappedColumnHeader.filter(function (mf) { return mf !== value.mappings[selectedIndex].mappedColumn; }).indexOf(f) === -1; }).map(function (p) {
                    return { label: p, value: p };
                });
            }
            return {
                field: field,
                options: options,
                selected: selectedIndex > -1 ? value.mappings[selectedIndex].mappedColumn : '',
            };
        });
    };
    MapExcelDataComponent.prototype.prepareMandatoryHeaders = function (value) {
        var _this = this;
        this.mandatoryHeadersModel = [];
        this.mandatoryGroupModel = [];
        value.mandatoryHeaders.forEach(function (f) {
            _this.mandatoryHeadersModel.push({ field: _this.trimAndLowerCase(f), selected: value.mappings.some(function (d) { return _this.trimAndLowerCase(d.mappedColumn) === _this.trimAndLowerCase(f); }) });
        });
        if (value.groupMandatoryHeaders) {
            value.groupMandatoryHeaders.forEach(function (f) {
                _this.mandatoryGroupModel.push(f.map(function (innerF) { return ({
                    field: _this.trimAndLowerCase(innerF),
                    selected: value.mappings.some(function (d) { return _this.trimAndLowerCase(d.mappedColumn) === _this.trimAndLowerCase(innerF); })
                }); }));
            });
        }
    };
    MapExcelDataComponent.prototype.trimAndLowerCase = function (str) {
        if (str === void 0) { str = ''; }
        return str.trim().toLowerCase();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object])
    ], MapExcelDataComponent.prototype, "importData", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], MapExcelDataComponent.prototype, "entity", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], MapExcelDataComponent.prototype, "onNext", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], MapExcelDataComponent.prototype, "onBack", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], MapExcelDataComponent.prototype, "dataModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChildren"])(_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_5__["ShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], MapExcelDataComponent.prototype, "shSelectComponents", void 0);
    MapExcelDataComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'map-excel-data',
            template: __webpack_require__(/*! ./map-excel-data.component.html */ "./src/app/import-excel/map-excel-data/map-excel-data.component.html"),
            styles: [__webpack_require__(/*! ./map-excel-data.component.scss */ "./src/app/import-excel/map-excel-data/map-excel-data.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_toaster_service__WEBPACK_IMPORTED_MODULE_4__["ToasterService"]])
    ], MapExcelDataComponent);
    return MapExcelDataComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/upload-file/upload-file.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/import-excel/upload-file/upload-file.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- upload And Map Content start-->\n<div class=\"uploadAndMapContent\">\n  <h2 class=\"text-center\" style=\"font-size: 32px\"> Import {{ title | titlecase}}</h2>\n  <div class=\"upload_excel max500 center-block box mrT2 dashed_bdr\">\n    <input type=\"file\" id=\"csvUploadInput\" placeholder=\"Upload an EXCEL or CSV file\"\n           (change)=\"onFileChange($event.target.files)\" droppable=\"true\" class=\"form-control\"/>\n    <div class=\"clearfix pos-rel width100\">\n      <div class=\"fileInputWrapper text-center\">\n        <div class=\"clearfix mrB2\">\n          <img src=\"assets/images/new/import_icon.svg\" [style.width.px]=\"100\"/>\n          <!-- <i class=\"fa fa-upload upload_icon\" aria-hidden=\"true\"></i> -->\n        </div>\n        <div class=\"clearfix pdR2 pdL2\">\n          <label class=\"clearfix text-light-2\" style=\"font-size: 14px\">Drop CSV or Excel file to upload</label>\n\n          <div class=\"mrT3\">\n            <label class=\"file-uplod-penal\" for=\"csvUploadInput\"> <span *ngIf=\"!selectedFileName\">Browse file</span>\n              <span *ngIf=\"selectedFileName\" class=\"select-file\">{{selectedFileName}}</span> <span\n                class=\"pull-right select-file\"><i class=\"fa fa-check\" *ngIf=\"selectedFileName\"></i></span></label>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n  <div class=\"max500 center-block mrT clearfix\">\n    <!-- <a  href=\"assets/sample-files/{{entity}}-sample.xlsx\">Download a sample file</a> -->\n\n    <button class=\"btn btn-sm btn-link\" type=\"button\" (click)=\"downloadSampleFile(entity)\">Download a sample Excel file\n    </button>\n    <button class=\"btn btn-sm btn-link pull-right\" type=\"button\" (click)=\"downloadSampleFile(entity, true)\">Download a sample Csv\n      file\n    </button>\n\n    <div class=\"pull-right mrT2\">\n      <button class=\"btn btn-default\" [routerLink]=\"['/pages/import']\">Back</button>\n      <button class=\"btn btn-success\" [ladda]=\"isLoading\" [disabled]=\"file === null\" (click)=\"onFileUpload.emit(file)\">\n        Next\n      </button>\n    </div>\n  </div>\n</div>\n<!-- upload And Map Content end-->\n"

/***/ }),

/***/ "./src/app/import-excel/upload-file/upload-file.component.scss":
/*!*********************************************************************!*\
  !*** ./src/app/import-excel/upload-file/upload-file.component.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".upload_excel {\n  display: -webkit-box;\n  display: flex;\n  height: 320px;\n  position: relative;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.max500 {\n  max-width: 500px; }\n\n.upload_icon {\n  font-size: 62px;\n  float: none;\n  color: #e2e2e2; }\n\n.sample_file-btn {\n  z-index: 9;\n  position: relative; }\n\n.dashed_bdr {\n  border: 2px dashed #d9d9d9; }\n\n.import_type {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.import_type li {\n  list-style: none;\n  width: 320px;\n  height: 150px;\n  text-align: center;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  margin: 0 15px;\n  border: 1px solid #d9d9d9;\n  background: #fafafa;\n  padding: 15px;\n  cursor: pointer;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease; }\n\n.import_type h2 {\n  margin-bottom: 30px; }\n\n.import_type li:hover {\n  border: 1px solid #ff5e01;\n  -webkit-transform: scale(1.01);\n          transform: scale(1.01); }\n\n.lead {\n  font-size: 36px;\n  margin-bottom: 10px; }\n\n.has-error .form-control {\n  border-color: red !important; }\n\n#csvUploadInput {\n  opacity: 0;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  z-index: 2; }\n\n.custom-file-label {\n  left: 0px;\n  top: 0;\n  bottom: 0;\n  z-index: 9;\n  background: #fff;\n  text-align: left;\n  position: absolute;\n  border: 1px solid #d6d6d6;\n  border-radius: 2px !important;\n  padding: 6px 12px !important;\n  outline: 0;\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 14px;\n  width: calc(100% - 95px); }\n\n.select-file {\n  color: #089328; }\n\n.file-uplod-penal {\n  width: 100%;\n  text-align: left;\n  border: 1px solid gainsboro;\n  padding: 8px;\n  border-radius: 4px;\n  color: #CCCCCC; }\n\n.upload_excel:hover .file-uplod-penal {\n  border-color: #FF5F00 !important; }\n"

/***/ }),

/***/ "./src/app/import-excel/upload-file/upload-file.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/import-excel/upload-file/upload-file.component.ts ***!
  \*******************************************************************/
/*! exports provided: UploadFileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadFileComponent", function() { return UploadFileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");




var UploadFileComponent = /** @class */ (function () {
    function UploadFileComponent(_toaster) {
        this._toaster = _toaster;
        this.onFileUpload = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.file = null;
        this.selectedFileName = '';
        this.selectedType = '';
        //
    }
    UploadFileComponent.prototype.onFileChange = function (file) {
        var validExts = ['csv', 'xls', 'xlsx'];
        var type = this.getExt(file.item(0).name);
        var isValidFileType = validExts.some(function (s) { return type === s; });
        if (!isValidFileType) {
            this._toaster.errorToast('Only XLS files are supported for Import');
            this.selectedFileName = '';
            this.file = null;
            return;
        }
        this.file = file.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        }
        else {
            this.selectedFileName = '';
        }
    };
    UploadFileComponent.prototype.downloadSampleFile = function (entity, isCsv) {
        if (isCsv === void 0) { isCsv = false; }
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var fileUrl, fileName, blob, e_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileUrl = "assets/sample-files/" + entity + "-sample." + (isCsv ? 'csv' : 'xlsx');
                        fileName = entity + "-sample." + (isCsv ? 'csv' : 'xlsx');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(fileUrl).then(function (r) { return r.blob(); })];
                    case 2:
                        blob = _a.sent();
                        Object(file_saver__WEBPACK_IMPORTED_MODULE_2__["saveAs"])(blob, fileName);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log('error while downloading sample file :', e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UploadFileComponent.prototype.getExt = function (path) {
        return (path.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').pop(-1) : 'null';
    };
    UploadFileComponent.prototype.ngOnInit = function () {
        if (this.entity === 'group' || this.entity === 'account') {
            this.title = this.entity + 's';
        }
        else if (this.entity === 'stock') {
            this.title = 'inventories';
        }
        else if (this.entity === 'trial-balance') {
            this.title = 'Trial Balances';
        }
        else {
            this.title = this.entity;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], UploadFileComponent.prototype, "isLoading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], UploadFileComponent.prototype, "entity", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], UploadFileComponent.prototype, "onFileUpload", void 0);
    UploadFileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'upload-file',
            template: __webpack_require__(/*! ./upload-file.component.html */ "./src/app/import-excel/upload-file/upload-file.component.html"),
            styles: [__webpack_require__(/*! ./upload-file.component.scss */ "./src/app/import-excel/upload-file/upload-file.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"]])
    ], UploadFileComponent);
    return UploadFileComponent;
}());



/***/ }),

/***/ "./src/app/import-excel/upload-success/upload-success.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/upload-success/upload-success.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ImportedFileDesign\">\n  <div class=\"ImportedFileDesign-box\">\n    <i class=\"fa fa-exclamation-circle mr-3\"></i>\n    <div class=\"ImportedFileDesign-content\">\n      <div class=\"clearfix\">\n        <h2 class=\"mt-0\">{{UploadExceltableResponse.successCount}} out\n          of {{UploadExceltableResponse.failureCount + UploadExceltableResponse.successCount}} accounts are successfully\n          imported. </h2>\n        <h3>Report of failed accounts will be mailed shortly.</h3>\n\n      </div>\n\n      <div class=\"clearfix mt-4\">\n        <button class=\"btn btn-success\" [routerLink]=\"['/pages/import/select']\" type=\"button\">Continue</button>\n        <a class=\"btn\" (click)=\"downloadImportFile()\">Download Report</a>\n      </div>\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/import-excel/upload-success/upload-success.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/import-excel/upload-success/upload-success.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".ImportedFileDesign {\n  height: calc(100vh - 200px);\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center; }\n\n.ImportedFileDesign-box {\n  display: -webkit-box;\n  display: flex; }\n\n.ImportedFileDesign-box i {\n  font-size: 39px;\n  color: #bfbfbf;\n  float: left; }\n\n.ImportedFileDesign h2 {\n  font-size: 28px;\n  color: black;\n  margin-bottom: 10px; }\n\n.ImportedFileDesign h3 {\n  font-size: 20px;\n  color: #797979; }\n\n.ImportedFileDesign-content {\n  float: right; }\n"

/***/ }),

/***/ "./src/app/import-excel/upload-success/upload-success.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/import-excel/upload-success/upload-success.component.ts ***!
  \*************************************************************************/
/*! exports provided: UploadSuccessComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadSuccessComponent", function() { return UploadSuccessComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/import-excel/import-excel.actions */ "./src/app/actions/import-excel/import-excel.actions.ts");






var UploadSuccessComponent = /** @class */ (function () {
    function UploadSuccessComponent(store, _importActions) {
        this.store = store;
        this._importActions = _importActions;
        this.onShowReport = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onContinueUpload = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.file = null;
        this.selectedType = '';
        //
    }
    UploadSuccessComponent.prototype.downloadImportFile = function () {
        // rows less than 400 download report
        if (!this.UploadExceltableResponse.message && this.UploadExceltableResponse.response) {
            var blob = Object(apps_web_giddh_src_app_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["base64ToBlob"])(this.UploadExceltableResponse.response, 'application/vnd.ms-excel', 512);
            return Object(file_saver__WEBPACK_IMPORTED_MODULE_2__["saveAs"])(blob, "Import-report.csv");
        }
        // rows grater than 400 show import report screen
        if (this.UploadExceltableResponse.message) {
            this.onShowReport.emit(true);
        }
    };
    UploadSuccessComponent.prototype.resetStoreData = function () {
        this.store.dispatch(this._importActions.resetImportExcelState());
    };
    UploadSuccessComponent.prototype.ngOnDestroy = function () {
        this.resetStoreData();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], UploadSuccessComponent.prototype, "UploadExceltableResponse", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], UploadSuccessComponent.prototype, "onShowReport", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], UploadSuccessComponent.prototype, "onContinueUpload", void 0);
    UploadSuccessComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'upload-success',
            template: __webpack_require__(/*! ./upload-success.component.html */ "./src/app/import-excel/upload-success/upload-success.component.html"),
            styles: [__webpack_require__(/*! ./upload-success.component.scss */ "./src/app/import-excel/upload-success/upload-success.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_import_excel_import_excel_actions__WEBPACK_IMPORTED_MODULE_5__["ImportExcelActions"]])
    ], UploadSuccessComponent);
    return UploadSuccessComponent;
}());



/***/ })

}]);