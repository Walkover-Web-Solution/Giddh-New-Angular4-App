(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[27],{

/***/ "./src/app/services/apiurls/tally-sync.ts":
/*!************************************************!*\
  !*** ./src/app/services/apiurls/tally-sync.ts ***!
  \************************************************/
/*! exports provided: TALLY_SYNC_API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TALLY_SYNC_API", function() { return TALLY_SYNC_API; });
var TALLY_SYNC_API = {
    INPROGRESS: '/tally_logs/current_day?page=:page&count=20&sort=:sortBy',
    COMPLETED: 'company/:companyUniqueName/tally_logs/completed?from=:from&to=:to&page=:page&count=:count&sort=:sortBy',
    ERROR_LOG: 'company/:companyUniqueName/tally_logs/:tally_logs_id/error_report',
};


/***/ }),

/***/ "./src/app/services/invoice.ui.data.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/services/invoice.ui.data.service.ts ***!
  \*****************************************************/
/*! exports provided: TemplateContentUISectionVisibility, InvoiceUiDataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemplateContentUISectionVisibility", function() { return TemplateContentUISectionVisibility; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceUiDataService", function() { return InvoiceUiDataService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/api-models/Invoice */ "./src/app/models/api-models/Invoice.ts");
/* harmony import */ var _service_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./service.config */ "./src/app/services/service.config.ts");





var TemplateContentUISectionVisibility = /** @class */ (function () {
    function TemplateContentUISectionVisibility() {
        this.header = true;
        this.table = false;
        this.footer = false;
    }
    return TemplateContentUISectionVisibility;
}());

var InvoiceUiDataService = /** @class */ (function () {
    function InvoiceUiDataService(config) {
        this.config = config;
        this.customTemplate = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](new _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_3__["CustomTemplateResponse"]());
        this.isLogoVisible = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.isCompanyNameVisible = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.logoPath = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.selectedSection = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        // Current company real values
        this.companyGSTIN = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.companyPAN = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.fieldsAndVisibility = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this._ = config._;
        _ = config._;
        //
    }
    /**
     * initCustomTemplate
     */
    InvoiceUiDataService.prototype.initCustomTemplate = function (companyUniqueName, companies, defaultTemplate) {
        if (companyUniqueName === void 0) { companyUniqueName = ''; }
        if (companies === void 0) { companies = []; }
        this.isLogoVisible.next(true);
        var uniqueName = companyUniqueName;
        var currentCompany = companies.find(function (company) { return company.uniqueName === uniqueName; });
        if (currentCompany) {
            this.companyName = currentCompany.name;
            this.companyAddress = currentCompany.address;
            if (currentCompany.gstDetails[0]) {
                this.companyGSTIN.next(currentCompany.gstDetails[0].gstNumber);
            }
            if (currentCompany.panNumber) {
                this.companyPAN.next(currentCompany.panNumber);
            }
        }
        this.isCompanyNameVisible.next(true);
        if (defaultTemplate) {
            if (this.companyName) {
                defaultTemplate.sections['header'].data['companyName'].label = this.companyName;
                defaultTemplate.sections['footer'].data['companyName'].label = this.companyName;
                defaultTemplate.sections['footer'].data['companyAddress'].label = this.companyAddress;
            }
            this.BRToNewLine(defaultTemplate);
            this.customTemplate.next(_.cloneDeep(defaultTemplate));
        }
        this.selectedSection.next({
            header: true,
            table: false,
            footer: false
        });
    };
    /**
     * setCustomTemplate
     */
    InvoiceUiDataService.prototype.setCustomTemplate = function (template) {
        template.sections['header'].data['companyName'].label = this.companyName;
        if (template.sections && template.sections.footer.data.companyName) {
            template.sections['footer'].data['companyName'].label = this.companyName;
            //  template.sections['footer'].data['companyAddress'].label = this.companyAddress;
        }
        this.BRToNewLine(template);
        this.customTemplate.next(template);
    };
    /**
     * setLogoVisibility
     */
    InvoiceUiDataService.prototype.setLogoVisibility = function (value) {
        this.isLogoVisible.next(value);
    };
    /**
     * setCompanyNameVisibility
     */
    InvoiceUiDataService.prototype.setCompanyNameVisibility = function (value) {
        this.isCompanyNameVisible.next(value);
    };
    /**
     * setLogoPath
     */
    InvoiceUiDataService.prototype.setLogoPath = function (path) {
        this.logoPath.next(path);
    };
    /**
     * setSelectedSection
     */
    InvoiceUiDataService.prototype.setSelectedSection = function (section) {
        var state = {
            header: false,
            table: false,
            footer: false
        };
        state[section] = true;
        this.selectedSection.next(state);
    };
    /**
     * resetCustomTemplate
     */
    InvoiceUiDataService.prototype.resetCustomTemplate = function () {
        this.customTemplate.next(new _models_api_models_Invoice__WEBPACK_IMPORTED_MODULE_3__["CustomTemplateResponse"]());
    };
    InvoiceUiDataService.prototype.BRToNewLine = function (template) {
        template.sections['footer'].data['message1'].label = template.sections['footer'].data['message1'].label ? template.sections['footer'].data['message1'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        template.sections['footer'].data['companyAddress'].label = template.sections['footer'].data['companyAddress'].label ? template.sections['footer'].data['companyAddress'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        template.sections['footer'].data['slogan'].label = template.sections['footer'].data['slogan'].label ? template.sections['footer'].data['slogan'].label.replace(/<br\s*[\/]?>/gi, '\n') : '';
        // template.sections[2].content[5].label = template.sections[2].content[5].label.replace(/<br\s*[\/]?>/gi, '\n');
        // template.sections[2].content[6].label = template.sections[2].content[6].label.replace(/<br\s*[\/]?>/gi, '\n');
        // template.sections[2].content[9].label = template.sections[2].content[9].label.replace(/<br\s*[\/]?>/gi, '\n');
        return template;
    };
    /**
     * set fields and their visibility
     */
    InvoiceUiDataService.prototype.setFieldsAndVisibility = function (statusObj) {
        this.fieldsAndVisibility.next(statusObj);
    };
    /**
     * setTemplateUniqueName
     */
    InvoiceUiDataService.prototype.setTemplateUniqueName = function (uniqueName, mode, customCreatedTemplates, defaultTemplate) {
        if (customCreatedTemplates === void 0) { customCreatedTemplates = []; }
        if (customCreatedTemplates && customCreatedTemplates.length) {
            var allTemplates = _.cloneDeep(customCreatedTemplates);
            var selectedTemplateIndex = allTemplates.findIndex(function (template) { return template.uniqueName === uniqueName; });
            var selectedTemplate = _.cloneDeep(allTemplates[selectedTemplateIndex]);
            if (selectedTemplate) {
                // &&
                // if (mode === 'create' && (selectedTemplate.sections[0].content[9].field !== 'trackingNumber' || selectedTemplate.sections[1].content[4].field !== 'description') && defaultTemplate) { // this is default(old) template
                //   selectedTemplate.sections = _.cloneDeep(defaultTemplate.sections);
                // }
                if (selectedTemplate.sections['header'].data['companyName'].display) {
                    this.isCompanyNameVisible.next(true);
                }
                if (this.companyName && mode === 'create') {
                    selectedTemplate.sections['footer'].data['companyName'].label = this.companyName;
                }
                if (this.companyAddress) { // due to this on edit mode company address was not pre-filling
                    // selectedTemplate.sections['footer'].data['companyAddress'].label = this.companyAddress;
                }
                selectedTemplate.sections['header'].data['companyName'].label = this.companyName;
                if (!selectedTemplate.logoUniqueName) {
                    this.isLogoVisible.next(false);
                }
                else {
                    this.isLogoVisible.next(true);
                }
                selectedTemplate.sections['header'].data['attentionTo'] = {
                    display: true,
                    label: 'Attention To',
                    field: 'attentionTo',
                    width: null
                };
                // selectedTemplate = this.BRToNewLine(selectedTemplate);
                // console.log('THe selected template is :', selectedTemplate);
                this.BRToNewLine(selectedTemplate);
                this.customTemplate.next(_.cloneDeep(selectedTemplate));
            }
            selectedTemplate.sections['header'].data['attentionTo'] = {
                display: true,
                label: 'Attention To',
                field: 'attentionTo',
                width: null
            };
            // selectedTemplate = this.BRToNewLine(selectedTemplate);
            // console.log('THe selected template is :', selectedTemplate);
            this.customTemplate.next(_.cloneDeep(selectedTemplate));
        }
    };
    InvoiceUiDataService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_service_config__WEBPACK_IMPORTED_MODULE_4__["ServiceConfig"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object])
    ], InvoiceUiDataService);
    return InvoiceUiDataService;
}());



/***/ }),

/***/ "./src/app/services/tally-sync.service.ts":
/*!************************************************!*\
  !*** ./src/app/services/tally-sync.service.ts ***!
  \************************************************/
/*! exports provided: TallySyncService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TallySyncService", function() { return TallySyncService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _httpWrapper_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./httpWrapper.service */ "./src/app/services/httpWrapper.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _catchManager_catchmanger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./catchManager/catchmanger */ "./src/app/services/catchManager/catchmanger.ts");
/* harmony import */ var _general_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _service_config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./service.config */ "./src/app/services/service.config.ts");
/* harmony import */ var _apiurls_tally_sync__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./apiurls/tally-sync */ "./src/app/services/apiurls/tally-sync.ts");








var TallySyncService = /** @class */ (function () {
    function TallySyncService(errorHandler, _http, _generalService, config) {
        this.errorHandler = errorHandler;
        this._http = _http;
        this._generalService = _generalService;
        this.config = config;
    }
    //
    TallySyncService.prototype.getCompletedSync = function (from, to) {
        var _this = this;
        var companyUniqueName = this._generalService.companyUniqueName;
        var url = this.config.apiUrl + _apiurls_tally_sync__WEBPACK_IMPORTED_MODULE_7__["TALLY_SYNC_API"].COMPLETED
            .replace(':companyUniqueName', companyUniqueName)
            .replace(':from', from)
            .replace(':to', to)
            .replace(':page', '1')
            .replace(':count', '20')
            .replace(':sortBy', 'desc');
        return this._http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (res) {
            return res.body;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (e) { return _this.errorHandler.HandleCatch(e); }));
    };
    TallySyncService.prototype.getInProgressSync = function () {
        var _this = this;
        var url = this.config.apiUrl + _apiurls_tally_sync__WEBPACK_IMPORTED_MODULE_7__["TALLY_SYNC_API"].INPROGRESS
            .replace(':page', '1')
            .replace(':count', '20')
            .replace(':sortBy', 'desc');
        return this._http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (res) {
            return res.body;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (e) { return _this.errorHandler.HandleCatch(e); }));
    };
    TallySyncService.prototype.getErrorLog = function (id, companyUniqueName) {
        var _this = this;
        var url = this.config.apiUrl + _apiurls_tally_sync__WEBPACK_IMPORTED_MODULE_7__["TALLY_SYNC_API"].ERROR_LOG
            .replace(':companyUniqueName', companyUniqueName)
            .replace(':tally_logs_id', id);
        return this._http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (res) {
            return res;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (e) {
            return _this.errorHandler.HandleCatch(e);
        }));
    };
    TallySyncService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Inject"])(_service_config__WEBPACK_IMPORTED_MODULE_6__["ServiceConfig"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_catchManager_catchmanger__WEBPACK_IMPORTED_MODULE_4__["ErrorHandler"],
            _httpWrapper_service__WEBPACK_IMPORTED_MODULE_2__["HttpWrapperService"],
            _general_service__WEBPACK_IMPORTED_MODULE_5__["GeneralService"], Object])
    ], TallySyncService);
    return TallySyncService;
}());



/***/ }),

/***/ "./src/app/tallysync/completed/completed.component.html":
/*!**************************************************************!*\
  !*** ./src/app/tallysync/completed/completed.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-container>\n  <form (ngSubmit)=\"getReport()\" [formGroup]=\"filterForm\">\n    <div class=\"row form\">\n      <div class=\"col-md-3 form-group company\">\n        <label>Company</label>\n        <sh-select [options]=\"CompanyList\" [multiple]=\"false\" [placeholder]=\"'Select Company'\" #shCompany\n                   formControlName=\"filterCompany\"\n                   (selected)=\"onDDElementCompanySelect($event)\"></sh-select>\n      </div>\n      <div class=\"col-md-1 form-group date\">\n        <label>Date</label>\n        <input name=\"filterDate\" formControlName=\"filterDate\" type=\"text\" autocomplete=\"off\"\n               class=\"form-control\" [maxDate]=\"maxDate\" bsDatepicker (bsValueChange)=\"onValueChange($event)\"\n               [bsConfig]=\" {dateInputFormat: 'D-MMM-YYYY'}\">\n\n      </div>\n      <div class=\"col-md-2 form-group interval\">\n        <label>Time</label>\n        <sh-select [options]=\"timeInterval\" [multiple]=\"false\" [placeholder]=\"'Select Interval'\" #shTimeInterval\n                   formControlName=\"filterTimeInterval\"\n                   (selected)=\"onDDElementTimeRangeSelect($event)\"></sh-select>\n      </div>\n      <div class=\"col-md-2 form-group\">\n        <button class=\"m-t-20 btn btn-success\" type=\"submit\">Go</button>\n      </div>\n    </div>\n  </form>\n\n  <div class=\"no-data\" *ngIf=\"!completedData?.length\">\n    <h1>No entries found</h1>\n  </div>\n\n\n  <div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\" *ngIf=\"completedData?.length\">\n    <div class=\"panel panel-default\" *ngFor=\"let row of completedData;\">\n      <div class=\"panel-heading\">\n        <span class=\"m-r-15\">{{row.company.name}}</span>\n        <small class=\"m-r-15\">Last Import on {{row.dateString}}</small>\n        <small class=\"running\"><i class=\"fa fa-circle\"></i> {{row.status}}</small>\n      </div>\n      <div class=\"panel-body\">\n        <ul class=\"list-group\">\n          <li class=\"list-group-item\">\n            <div class=\"clearfix\">\n              <div class=\"col-sm-2 col-xs-12\">\n                <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                <span>Groups</span>\n              </div>\n              <div class=\"col-sm-6 col-xs-8\">\n                <small><em>{{row.totalSavedGroups}}/{{row.totalTallyGroups}}</em></small>\n                <div class=\"progress\">\n                  <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedGroups\" aria-valuemin=\"0\"\n                       aria-valuemax=\"100\"\n                       [ngStyle]=\"{'width': row.groupsPercent}\">>\n                    <span class=\"sr-only\">{{row.groupsPercent}} Complete</span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-sm-4 col-xs-4 text-success\">\n                <div class=\"status\">\n                  <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.groupsPercent}} Complete</small>\n                  <small class=\"text-danger\" *ngIf=\"row.tallyErrorGroups>0\">{{row.groupsErrorPercent}} error occured\n                  </small>\n                </div>\n              </div>\n            </div>\n          </li>\n          <li class=\"list-group-item\">\n            <div class=\"clearfix\">\n              <div class=\"col-sm-2 col-xs-12\">\n                <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                <span>Accounts</span>\n              </div>\n              <div class=\"col-sm-6 col-xs-8\">\n                <small><em>{{row.totalSavedAccounts}}/{{row.totalTallyAccounts}}</em></small>\n                <div class=\"progress\">\n                  <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedAccounts\" aria-valuemin=\"0\"\n                       aria-valuemax=\"100\"\n                       [ngStyle]=\"{'width': row.accountsPercent}\">\n                    <span class=\"sr-only\">{{row.accountsPercent}} Complete</span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-sm-4 col-xs-4 text-success\">\n                <div class=\"status\">\n                  <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.accountsPercent}} Complete</small>\n                  <small class=\"text-danger\" *ngIf=\"row.tallyErrorAccounts>0\">{{row.accountsErrorPercent}} error\n                    occured\n                  </small>\n                </div>\n              </div>\n            </div>\n          </li>\n          <li class=\"list-group-item\">\n            <div class=\"clearfix\">\n              <div class=\"col-sm-2 col-xs-12\">\n                <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                <span>Entries</span>\n              </div>\n              <div class=\"col-sm-6 col-xs-8\">\n                <small><em>{{row.totalSavedEntries}}/{{row.totalTallyEntries}}</em></small>\n                <div class=\"progress\">\n                  <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedEntries\" aria-valuemin=\"0\"\n                       aria-valuemax=\"100\" [ngStyle]=\"{'width': row.entriesPercent}\">\n                    <span class=\"sr-only\">{{row.entriesPercent}} Complete</span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-sm-4 col-xs-4 text-success\">\n                <div class=\"status\">\n                  <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.entriesPercent}} Complete</small>\n                  <small class=\"text-danger\" *ngIf=\"row.tallyErrorEntries>0\">{{row.entriesErrorPercent}} error occured\n                  </small>\n                </div>\n              </div>\n            </div>\n          </li>\n        </ul>\n      </div>\n      <div class=\"panel-footer\" *ngIf=\"row.tallyErrorEntries>0 || row.tallyErrorAccounts>0 || row.tallyErrorGroups>0\">\n        <span class=\"m-r-15\">Error Report:</span>\n        <a class=\"running\" (click)=\"downloadLog(row)\">{{row.company.name}}-error-log.csv</a>\n      </div>\n    </div>\n  </div>\n\n</ng-container>\n"

/***/ }),

/***/ "./src/app/tallysync/completed/completed.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/tallysync/completed/completed.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".panel {\n  box-shadow: none; }\n  .panel .running {\n    color: #0FA6E9; }\n  .panel .panel-heading {\n    background: #E6E6E6; }\n  .panel .panel-footer {\n    padding: 10px 15px;\n    background-color: transparent; }\n  .panel .panel-body {\n    color: #707070;\n    background: transparent;\n    padding: 15px 0px 0px 0px; }\n  .panel .panel-body .progress {\n      box-shadow: none;\n      height: 5px;\n      margin-bottom: 0px;\n      border: #DFDFDF 1px solid; }\n  .panel .panel-body .progress-bar {\n      background: #BEBEBE;\n      border: 1px solid #BEBEBE;\n      box-shadow: none; }\n  .panel .panel-body .list-group {\n      margin-bottom: 0px; }\n  .panel .panel-body .list-group .list-group {\n        margin-top: 0px;\n        padding-left: 30px; }\n  .panel .panel-body .list-group-item {\n      border: none;\n      padding-right: 0px;\n      background-color: transparent; }\n  .panel .panel-body .list-group-item .status {\n        margin-top: 9px; }\n  .panel .panel-body .list-group-item .status small {\n          font-size: 14px; }\n  .panel .text-success {\n    color: #63B214; }\n  .form .company {\n  width: 205px;\n  padding-right: 0px; }\n  .form .date {\n  width: 115px;\n  padding-right: 0px; }\n  .form .interval {\n  width: 180px;\n  padding-right: 0px; }\n"

/***/ }),

/***/ "./src/app/tallysync/completed/completed.component.ts":
/*!************************************************************!*\
  !*** ./src/app/tallysync/completed/completed.component.ts ***!
  \************************************************************/
/*! exports provided: CompletedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompletedComponent", function() { return CompletedComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/tally-sync.service */ "./src/app/services/tally-sync.service.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_11__);












var CompletedComponent = /** @class */ (function () {
    function CompletedComponent(store, _toaster, _activatedRoute, cdr, fb, tallysyncService) {
        var _this = this;
        this.store = store;
        this._toaster = _toaster;
        this._activatedRoute = _activatedRoute;
        this.cdr = cdr;
        this.fb = fb;
        this.tallysyncService = tallysyncService;
        this.bsConfig = {
            showWeekNumbers: false,
            dateInputFormat: 'DD-MM-YYYY',
            rangeInputFormat: 'DD-MM-YYYY',
            containerClass: 'theme-green myDpClass'
        };
        this.CompanyList = [];
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_3__;
        this.maxDate = new Date(new Date().setDate(new Date().getDate() - 1));
        this.filter = {};
        this.completedData = [];
        this.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.timeInterval = [
            {
                value: '00:00:00-02:00:00',
                label: '00:00 am - 02:00 am'
            },
            {
                value: '02:00:00-04:00:00',
                label: '02:00 am - 04:00 am'
            },
            {
                value: '04:00:00-06:00:00',
                label: '04:00 am - 06:00 am'
            },
            {
                value: '06:00:00-08:00:00',
                label: '06:00 am - 08:00 am'
            },
            {
                value: '08:00:00-10:00:00',
                label: '08:00 am - 10:00 am'
            },
            {
                value: '10:00:00-12:00:00',
                label: '10:00 am - 12:00 pm'
            },
            {
                value: '12:00:00-14:00:00',
                label: '12:00 pm - 02:00 pm'
            },
            {
                value: '14:00:00-16:00:00',
                label: '02:00 pm - 04:00 pm'
            },
            {
                value: '16:00:00-18:00:00',
                label: '04:00 pm - 06:00 pm'
            },
            {
                value: '18:00:00-20:00:00',
                label: '06:00 pm - 08:00 pm'
            },
            {
                value: '20:00:00-22:00:00',
                label: '08:00 pm - 10:00 pm'
            },
            {
                value: '22:00:00-24:00:00',
                label: '10:00 pm - 12:00 pm'
            }
        ];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.filterForm = this.fb.group({
            filterCompany: [''],
            filterTimeInterval: [''],
            filterDate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
        });
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$));
        this.companies$ = this.store.select(function (p) { return p.session.companies; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$));
        // set financial years based on company financial year
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_7__["select"])(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_7__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.session.companyUniqueName; }], function (companies, uniqueName) {
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
        })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$)).subscribe(function (selectedCmp) {
            if (selectedCmp) {
                _this.filterForm.get('filterCompany').patchValue(selectedCmp.uniqueName);
            }
        });
    }
    CompletedComponent.prototype.ngOnInit = function () {
        var _this = this;
        // set universal date
        // this.universalDate$.subscribe(a => {
        //   if (a) {
        //     this.filterForm.get('filterDate').patchValue(moment(a[1]).format('D-MMM-YYYY'));
        //   }
        // });
        // set current company date
        this.companies$.subscribe(function (a) {
            if (a) {
                a.forEach(function (element) {
                    _this.CompanyList.push({ value: element.uniqueName, label: element.name });
                });
            }
        });
        // set initial Data
        this.filterForm.get('filterDate').patchValue(moment_moment__WEBPACK_IMPORTED_MODULE_3__(this.maxDate).format('D-MMM-YYYY'));
        this.filterForm.get('filterTimeInterval').patchValue(this.timeInterval[5].value);
        this.filter.timeRange = this.timeInterval[5].value;
        this.filter.startDate = moment_moment__WEBPACK_IMPORTED_MODULE_3__(this.maxDate).format('DD-MM-YYYY');
        this.getReport();
    };
    CompletedComponent.prototype.getReport = function () {
        var _this = this;
        if (this.filterForm.invalid) {
            this._toaster.errorToast("Please check your filter criteria");
            return;
        }
        // api call here
        this.filter.from = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[0];
        this.filter.to = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[1];
        this.tallysyncService.getCompletedSync(this.filter.from, this.filter.to).subscribe(function (res) {
            if (res && res.results && res.results.length > 0) {
                _this.completedData = res.results;
                _this.completedData.forEach(function (element) {
                    element['dateString'] = _this.prepareDate(element.updatedAt);
                    //completed
                    var tallyGroups = (element.totalSavedGroups * 100) / element.totalTallyGroups;
                    var tallyAccounts = (element.totalSavedAccounts * 100) / element.totalTallyAccounts;
                    var tallyEntries = (element.totalSavedEntries * 100) / element.totalTallyEntries;
                    element['groupsPercent'] = (isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + '%';
                    element['accountsPercent'] = (isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) + '%';
                    element['entriesPercent'] = (isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) + '%';
                    //error
                    var tallyErrorGroups = (element.tallyErrorGroups * 100) / element.totalTallyGroups;
                    var tallyErrorAccounts = (element.tallyErrorAccounts * 100) / element.totalTallyAccounts;
                    var tallyErrorEntries = (element.tallyErrorEntries * 100) / element.totalTallyEntries;
                    element['groupsErrorPercent'] = (isNaN(tallyErrorGroups) ? 0 : tallyErrorGroups).toFixed(2) + '%';
                    element['accountsErrorPercent'] = (isNaN(tallyErrorAccounts) ? 0 : tallyErrorAccounts).toFixed(2) + '%';
                    element['entriesErrorPercent'] = (isNaN(tallyErrorEntries) ? 0 : tallyErrorEntries).toFixed(2) + '%';
                });
            }
        });
        // ===============
    };
    // download
    CompletedComponent.prototype.downloadLog = function (row) {
        var _this = this;
        this.tallysyncService.getErrorLog(row.id, row.company.uniqueName).subscribe(function (res) {
            if (res.status === 'success') {
                var blobData = _this.base64ToBlob(res.body, 'text/csv', 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_11__["saveAs"])(blobData, row.company.name + "-error-log.csv");
            }
            else {
                _this._toaster.errorToast(res.message);
            }
        });
    };
    CompletedComponent.prototype.base64ToBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        var offset = 0;
        while (offset < byteCharacters.length) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            var i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    };
    // download
    CompletedComponent.prototype.prepareDate = function (dateArray) {
        if (dateArray[5] < 10) {
            dateArray[5] = '0' + dateArray[5];
        }
        return 'Last Import on ' + dateArray[2] + ' ' + this.MONTHS[(dateArray[1] - 1)] + ' ' + dateArray[0] + ' @ ' + dateArray[3] + ':' + dateArray[4] + ':' + dateArray[5];
    };
    CompletedComponent.prototype.onDDElementCompanySelect = function (event) {
        this.filter.company = event.value;
    };
    CompletedComponent.prototype.onValueChange = function (event) {
        this.filter.startDate = moment_moment__WEBPACK_IMPORTED_MODULE_3__(event).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_9__["GIDDH_DATE_FORMAT"]);
    };
    CompletedComponent.prototype.onDDElementTimeRangeSelect = function (event) {
        this.filter.timeRange = event.value;
    };
    CompletedComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CompletedComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-completed-preview',
            template: __webpack_require__(/*! ./completed.component.html */ "./src/app/tallysync/completed/completed.component.html"),
            styles: [__webpack_require__(/*! ./completed.component.scss */ "./src/app/tallysync/completed/completed.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"],
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormBuilder"],
            _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_10__["TallySyncService"]])
    ], CompletedComponent);
    return CompletedComponent;
}());



/***/ }),

/***/ "./src/app/tallysync/inprogress/inprogress.component.html":
/*!****************************************************************!*\
  !*** ./src/app/tallysync/inprogress/inprogress.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-container>\n  <div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n\n    <div class=\"no-data\" *ngIf=\"!progressData?.length\">\n      <h1>No entries found</h1>\n    </div>\n\n    <div *ngIf=\"progressData?.length\">\n      <div class=\"panel panel-default\" *ngFor=\"let row of progressData\">\n        <div class=\"panel-heading\">\n          <span class=\"m-r-15\">{{row.company.name}}</span>\n          <small class=\"m-r-15\">Last Import on {{row.dateString}}</small>\n          <small class=\"running\"><i class=\"fa fa-circle\"></i> {{row.status}}</small>\n        </div>\n        <div class=\"panel-body\">\n          <ul class=\"list-group\">\n            <li class=\"list-group-item\">\n              <div class=\"clearfix\">\n                <div class=\"col-sm-2 col-xs-12\">\n                  <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                  <span>Groups</span>\n                </div>\n                <div class=\"col-sm-6 col-xs-8\">\n                  <small><em>{{row.totalSavedGroups}}/{{row.totalTallyGroups}}</em></small>\n                  <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedGroups\" aria-valuemin=\"0\"\n                         aria-valuemax=\"100\"\n                         [ngStyle]=\"{'width': row.groupsPercent}\">>\n                      <span class=\"sr-only\">{{row.groupsPercent}} Complete</span>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-sm-4 col-xs-4 text-success\">\n                  <div class=\"status\">\n                    <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.groupsPercent}} Complete</small>\n                    <small class=\"text-danger\" *ngIf=\"row.tallyErrorGroups>0\">{{row.groupsErrorPercent}} error occured</small>\n                  </div>\n                </div>\n              </div>\n            </li>\n            <li class=\"list-group-item\">\n              <div class=\"clearfix\">\n                <div class=\"col-sm-2 col-xs-12\">\n                  <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                  <span>Accounts</span>\n                </div>\n                <div class=\"col-sm-6 col-xs-8\">\n                  <small><em>{{row.totalSavedAccounts}}/{{row.totalTallyAccounts}}</em></small>\n                  <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedAccounts\" aria-valuemin=\"0\"\n                         aria-valuemax=\"100\"\n                         [ngStyle]=\"{'width': row.accountsPercent}\">\n                      <span class=\"sr-only\">{{row.accountsPercent}} Complete</span>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-sm-4 col-xs-4 text-success\">\n                  <div class=\"status\">\n                    <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.accountsPercent}} Complete</small>\n                    <small class=\"text-danger\" *ngIf=\"row.tallyErrorAccounts>0\">{{row.accountsErrorPercent}} error occured</small>\n                  </div>\n                </div>\n              </div>\n            </li>\n            <li class=\"list-group-item\">\n              <div class=\"clearfix\">\n                <div class=\"col-sm-2 col-xs-12\">\n                  <img src=\"./../../../assets/images/folder.svg\" height=\"20\" class=\"m-r-10\">\n                  <span>Entries</span>\n                </div>\n                <div class=\"col-sm-6 col-xs-8\">\n                  <small><em>{{row.totalSavedEntries}}/{{row.totalTallyEntries}}</em></small>\n                  <div class=\"progress\">\n                    <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"row.totalSavedEntries\" aria-valuemin=\"0\"\n                         aria-valuemax=\"100\" [ngStyle]=\"{'width': row.entriesPercent}\">\n                      <span class=\"sr-only\">{{row.entriesPercent}} Complete</span>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-sm-4 col-xs-4 text-success\">\n                  <div class=\"status\">\n                    <small class=\"m-r-10\"><i class=\"fa fa-check\"></i>{{row.entriesPercent}} Complete</small>\n                    <small class=\"text-danger\" *ngIf=\"row.tallyErrorEntries>0\">{{row.entriesErrorPercent}} error occured</small>\n                  </div>\n                </div>\n              </div>\n            </li>\n          </ul>\n        </div>\n        <div class=\"panel-footer\" *ngIf=\"row.tallyErrorEntries>0 || row.tallyErrorAccounts>0 || row.tallyErrorGroups>0\"><span class=\"m-r-15\">Error Report:</span>\n          <a class=\"running\" (click)=\"downloadLog(row)\">{{row.company.name}}-error-log.csv</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-container>\n"

/***/ }),

/***/ "./src/app/tallysync/inprogress/inprogress.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/tallysync/inprogress/inprogress.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".panel {\n  box-shadow: none; }\n  .panel .running {\n    color: #0FA6E9; }\n  .panel .panel-heading {\n    background: #E6E6E6; }\n  .panel .panel-footer {\n    padding: 10px 15px;\n    background-color: transparent; }\n  .panel .panel-body {\n    color: #707070;\n    background: transparent;\n    padding: 15px 0px 0px 0px; }\n  .panel .panel-body .progress {\n      box-shadow: none;\n      height: 5px;\n      margin-bottom: 0px;\n      border: #DFDFDF 1px solid; }\n  .panel .panel-body .progress-bar {\n      background: #BEBEBE;\n      border: 1px solid #BEBEBE;\n      box-shadow: none; }\n  .panel .panel-body .list-group {\n      margin-bottom: 0px; }\n  .panel .panel-body .list-group .list-group {\n        margin-top: 0px;\n        padding-left: 30px; }\n  .panel .panel-body .list-group-item {\n      border: none;\n      padding-right: 0px;\n      background-color: transparent; }\n  .panel .panel-body .list-group-item .status {\n        margin-top: 9px; }\n  .panel .panel-body .list-group-item .status small {\n          font-size: 14px; }\n  .panel .text-success {\n    color: #63B214; }\n"

/***/ }),

/***/ "./src/app/tallysync/inprogress/inprogress.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/tallysync/inprogress/inprogress.component.ts ***!
  \**************************************************************/
/*! exports provided: InprogressComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InprogressComponent", function() { return InprogressComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/tally-sync.service */ "./src/app/services/tally-sync.service.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_4__);





var InprogressComponent = /** @class */ (function () {
    function InprogressComponent(_toaster, tallysyncService) {
        this._toaster = _toaster;
        this.tallysyncService = tallysyncService;
        this.isPageLoaded = false;
        this.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    InprogressComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isPageLoaded = true;
        this.getCurrentData();
        setInterval(function () {
            if (_this.isPageLoaded) {
                _this.getCurrentData();
            }
        }, 30000);
    };
    InprogressComponent.prototype.ngOnDestroy = function () {
        this.isPageLoaded = false;
    };
    InprogressComponent.prototype.getCurrentData = function () {
        var _this = this;
        this.tallysyncService.getInProgressSync().subscribe(function (res) {
            if (res && res.results && res.results.length > 0) {
                _this.progressData = res.results;
                _this.progressData.forEach(function (element) {
                    element['dateString'] = _this.prepareDate(element.updatedAt);
                    //completed
                    var tallyGroups = (element.totalSavedGroups * 100) / element.totalTallyGroups;
                    var tallyAccounts = (element.totalSavedAccounts * 100) / element.totalTallyAccounts;
                    var tallyEntries = (element.totalSavedEntries * 100) / element.totalTallyEntries;
                    element['groupsPercent'] = (isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + '%';
                    element['accountsPercent'] = (isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) + '%';
                    element['entriesPercent'] = (isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) + '%';
                    //error
                    var tallyErrorGroups = (element.tallyErrorGroups * 100) / element.totalTallyGroups;
                    var tallyErrorAccounts = (element.tallyErrorAccounts * 100) / element.totalTallyAccounts;
                    var tallyErrorEntries = (element.tallyErrorEntries * 100) / element.totalTallyEntries;
                    element['groupsErrorPercent'] = (isNaN(tallyErrorGroups) ? 0 : tallyErrorGroups).toFixed(2) + '%';
                    element['accountsErrorPercent'] = (isNaN(tallyErrorAccounts) ? 0 : tallyErrorAccounts).toFixed(2) + '%';
                    element['entriesErrorPercent'] = (isNaN(tallyErrorEntries) ? 0 : tallyErrorEntries).toFixed(2) + '%';
                });
            }
        });
    };
    // download
    InprogressComponent.prototype.downloadLog = function (row) {
        var _this = this;
        this.tallysyncService.getErrorLog(row.id, row.company.uniqueName).subscribe(function (res) {
            if (res.status === 'success') {
                var blobData = _this.base64ToBlob(res.body, 'text/csv', 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_4__["saveAs"])(blobData, row.company.name + "-error-log.csv");
            }
            else {
                _this._toaster.errorToast(res.message);
            }
        });
    };
    InprogressComponent.prototype.base64ToBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        var offset = 0;
        while (offset < byteCharacters.length) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            var i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    };
    // download
    InprogressComponent.prototype.prepareDate = function (dateArray) {
        if (dateArray[5] < 10) {
            dateArray[5] = '0' + dateArray[5];
        }
        return 'Last Import on ' + dateArray[2] + ' ' + this.MONTHS[(dateArray[1] - 1)] + ' ' + dateArray[0] + ' @ ' + dateArray[3] + ':' + dateArray[4] + ':' + dateArray[5];
    };
    InprogressComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-inprogress-preview',
            template: __webpack_require__(/*! ./inprogress.component.html */ "./src/app/tallysync/inprogress/inprogress.component.html"),
            styles: [__webpack_require__(/*! ./inprogress.component.scss */ "./src/app/tallysync/inprogress/inprogress.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_toaster_service__WEBPACK_IMPORTED_MODULE_2__["ToasterService"], _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_3__["TallySyncService"]])
    ], InprogressComponent);
    return InprogressComponent;
}());



/***/ }),

/***/ "./src/app/tallysync/tallysync.component.html":
/*!****************************************************!*\
  !*** ./src/app/tallysync/tallysync.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"m-l-20 m-r-20 m-t-15\">\n  <div class=\"m-t-15\">\n    <button class=\"btn btn-default\" [ngClass]=\"{'active': activeTab === 'inprogress'}\" (click)=\"tabChanged('inprogress')\">\n      In-Progress\n    </button>\n    <button class=\"btn btn-default\" [ngClass]=\"{'active': activeTab === 'completed'}\" (click)=\"tabChanged('completed')\">\n      Completed\n    </button>\n  </div>\n  <div class=\"m-t-15\" id=\"Tab\">\n    <ng-container *ngIf=\"activeTab === 'inprogress'\">\n      <app-inprogress-preview></app-inprogress-preview>\n    </ng-container>\n\n    <ng-container *ngIf=\"activeTab === 'completed'\">\n      <app-completed-preview></app-completed-preview>\n    </ng-container>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/tallysync/tallysync.component.scss":
/*!****************************************************!*\
  !*** ./src/app/tallysync/tallysync.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".btn-default.active {\n  background: #e5e5e5 !important;\n  color: #ff5f00 !important;\n  box-shadow: none;\n  outline: none; }\n"

/***/ }),

/***/ "./src/app/tallysync/tallysync.component.ts":
/*!**************************************************!*\
  !*** ./src/app/tallysync/tallysync.component.ts ***!
  \**************************************************/
/*! exports provided: TallysyncComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TallysyncComponent", function() { return TallysyncComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");








var TallysyncComponent = /** @class */ (function () {
    function TallysyncComponent(store, companyActions, router, _cd, _activatedRoute) {
        this.store = store;
        this.companyActions = companyActions;
        this.router = router;
        this._cd = _cd;
        this._activatedRoute = _activatedRoute;
        this.activeTab = 'inprogress';
        this.showInvoiceNav = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        //
    }
    TallysyncComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.queryParams.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["delay"])(700)).subscribe(function (a) {
            if (a.tab && a.tabIndex) {
                if (_this.staticTabs && _this.staticTabs.tabs) {
                    _this.staticTabs.tabs[a.tabIndex].active = true;
                    _this.tabChanged(a.tab);
                }
            }
        });
    };
    TallysyncComponent.prototype.pageChanged = function (page) {
        this.showInvoiceNav = ['completed', 'inprogress'].indexOf(page) > -1;
    };
    TallysyncComponent.prototype.tabChanged = function (tab) {
        this.activeTab = tab;
    };
    TallysyncComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('staticTabs'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__["TabsetComponent"])
    ], TallysyncComponent.prototype, "staticTabs", void 0);
    TallysyncComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./tallysync.component.html */ "./src/app/tallysync/tallysync.component.html"),
            styles: [__webpack_require__(/*! ./tallysync.component.scss */ "./src/app/tallysync/tallysync.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__["CompanyActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ChangeDetectorRef"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]])
    ], TallysyncComponent);
    return TallysyncComponent;
}());



/***/ }),

/***/ "./src/app/tallysync/tallysync.module.ts":
/*!***********************************************!*\
  !*** ./src/app/tallysync/tallysync.module.ts ***!
  \***********************************************/
/*! exports provided: TallysyncModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TallysyncModule", function() { return TallysyncModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tallysync_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tallysync.routing.module */ "./src/app/tallysync/tallysync.routing.module.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "../../node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/helpers/directives/digitsOnly/digitsOnly.module */ "./src/app/shared/helpers/directives/digitsOnly/digitsOnly.module.ts");





var TallysyncModule = /** @class */ (function () {
    function TallysyncModule() {
    }
    TallysyncModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            imports: [
                _tallysync_routing_module__WEBPACK_IMPORTED_MODULE_2__["TallysyncRoutingModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbTypeaheadModule"].forRoot(),
                _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_4__["DigitsOnlyModule"]
            ],
            exports: [
                _tallysync_routing_module__WEBPACK_IMPORTED_MODULE_2__["TallysyncRoutingModule"]
            ]
        })
    ], TallysyncModule);
    return TallysyncModule;
}());



/***/ }),

/***/ "./src/app/tallysync/tallysync.routing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/tallysync/tallysync.routing.module.ts ***!
  \*******************************************************/
/*! exports provided: TallysyncRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TallysyncRoutingModule", function() { return TallysyncRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "../../node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var _tallysync_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tallysync.component */ "./src/app/tallysync/tallysync.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _inprogress_inprogress_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./inprogress/inprogress.component */ "./src/app/tallysync/inprogress/inprogress.component.ts");
/* harmony import */ var _completed_completed_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./completed/completed.component */ "./src/app/tallysync/completed/completed.component.ts");
/* harmony import */ var ngx_uploader__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-uploader */ "../../node_modules/ngx-uploader/fesm5/ngx-uploader.js");
/* harmony import */ var _services_invoice_ui_data_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/invoice.ui.data.service */ "./src/app/services/invoice.ui.data.service.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../theme/sales-ng-virtual-select/sh-select.module */ "./src/app/theme/sales-ng-virtual-select/sh-select.module.ts");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! angular2-text-mask */ "../../node_modules/angular2-text-mask/dist/angular2TextMask.js");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(angular2_text_mask__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var apps_web_giddh_src_app_theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../shared/helpers/directives/keyboardShortcut/keyboardShortut.module */ "./src/app/shared/helpers/directives/keyboardShortcut/keyboardShortut.module.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "../../node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../services/tally-sync.service */ "./src/app/services/tally-sync.service.ts");




























var _ROUTES = [
    {
        path: '',
        canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_26__["NeedsAuthentication"]],
        component: _tallysync_component__WEBPACK_IMPORTED_MODULE_8__["TallysyncComponent"]
    },
    { path: 'tallysync', canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_26__["NeedsAuthentication"]] },
];
var TallysyncRoutingModule = /** @class */ (function () {
    function TallysyncRoutingModule() {
    }
    TallysyncRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _tallysync_component__WEBPACK_IMPORTED_MODULE_8__["TallysyncComponent"],
                _inprogress_inprogress_component__WEBPACK_IMPORTED_MODULE_11__["InprogressComponent"],
                _completed_completed_component__WEBPACK_IMPORTED_MODULE_12__["CompletedComponent"]
            ],
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_20__["TabsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ReactiveFormsModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_6__["ModalModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_4__["TooltipModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_5__["PaginationModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(_ROUTES),
                _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_24__["KeyboardShortutModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_7__["BsDatepickerModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_20__["CollapseModule"].forRoot(),
                ngx_uploader__WEBPACK_IMPORTED_MODULE_13__["NgxUploaderModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_15__["SelectModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_16__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__["ShSelectModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_17__["ClickOutsideModule"],
                apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_18__["ElementViewChildModule"],
                apps_web_giddh_src_app_shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_19__["DecimalDigitsModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_7__["DatepickerModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_20__["BsDropdownModule"],
                _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_21__["SalesShSelectModule"],
                angular2_text_mask__WEBPACK_IMPORTED_MODULE_22__["TextMaskModule"],
                apps_web_giddh_src_app_theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_23__["Daterangepicker"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_25__["NgbTypeaheadModule"]
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_4__["TooltipModule"]
            ],
            entryComponents: [_tallysync_component__WEBPACK_IMPORTED_MODULE_8__["TallysyncComponent"]],
            providers: [_services_invoice_ui_data_service__WEBPACK_IMPORTED_MODULE_14__["InvoiceUiDataService"], _services_tally_sync_service__WEBPACK_IMPORTED_MODULE_27__["TallySyncService"]]
        })
    ], TallysyncRoutingModule);
    return TallysyncRoutingModule;
}());



/***/ })

}]);