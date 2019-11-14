(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ "./src/app/reports/components/report-dashboard/reports.dashboard.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/reports/components/report-dashboard/reports.dashboard.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid pt-2 pb-2\">\n    <div class=\"row mb-2\">\n        <div class=\"col-md-2 col-xs-4\">\n            <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" placeholder=\"Search Report\">\n            </div>\n        </div>\n    </div>\n    <div class=\"clearfix reports-main\">\n        <div class=\"row\">\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n                <p>Business Overview</p>\n                <p><a href=\"javascript:void(0)\">Cash Flow Statement</a></p>\n            </div>\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n                <p>Transactions Overview</p>\n                <p><a href=\"javascript:void(0)\" (click)=\"openDetailedSalesReport()\">Sales Register</a></p>\n                <p><a href=\"javascript:void(0)\">Purchase Register</a></p>\n                <p><a href=\"javascript:void(0)\">Cash Register</a></p>\n            </div>\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n                <p>Receivables/Payables</p>\n                <p><a href=\"javascript:void(0)\">Aging Report</a></p>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n                <p>Custom Report</p>\n                <p><a href=\"javascript:void(0)\">Custom Graphical Report</a></p>\n            </div>\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n                <p>Sales</p>\n                <p><a href=\"javascript:void(0)\">Sales Register</a></p>\n                <p><a href=\"javascript:void(0)\">Item Wise Sales </a></p>\n                <p><a href=\"javascript:void(0)\">Customer Wise Sales</a></p>\n            </div>\n            <div class=\"col-md-4 col-sm-4 mb-2\">\n            </div>\n        </div>\n    </div>\n\n</div>"

/***/ }),

/***/ "./src/app/reports/components/report-dashboard/reports.dashboard.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/reports/components/report-dashboard/reports.dashboard.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".reports-main p > a {\n  font-weight: normal;\n  color: #2680EB; }\n\n.reports-main p {\n  margin-bottom: 10px;\n  font-size: 14px;\n  font-weight: 600; }\n"

/***/ }),

/***/ "./src/app/reports/components/report-dashboard/reports.dashboard.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/reports/components/report-dashboard/reports.dashboard.component.ts ***!
  \************************************************************************************/
/*! exports provided: ReportsDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsDashboardComponent", function() { return ReportsDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");



var ReportsDashboardComponent = /** @class */ (function () {
    function ReportsDashboardComponent(router) {
        this.router = router;
    }
    ReportsDashboardComponent.prototype.ngOnInit = function () {
    };
    ReportsDashboardComponent.prototype.openDetailedSalesReport = function () {
        this.router.navigate(['/pages/reports/reports-details']);
    };
    ReportsDashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reports-dashboard',
            template: __webpack_require__(/*! ./reports.dashboard.component.html */ "./src/app/reports/components/report-dashboard/reports.dashboard.component.html"),
            styles: [__webpack_require__(/*! ./reports.dashboard.component.scss */ "./src/app/reports/components/report-dashboard/reports.dashboard.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ReportsDashboardComponent);
    return ReportsDashboardComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/report-details-components/report.details.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/reports/components/report-details-components/report.details.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid font-14\">\n    <div class=\"clearfix mt-2 mb-2\">\n        <ul class=\"list-inline d-inline-block middle nav-report\">\n            <li class=\"active\"><a href=\"javascript:void(0)\" (click)=\"goToDashboard()\">Report</a> <span class=\"d-inline-block pl-1\"> ></span></li>\n            <li><a href=\"javascript:void(0)\">Sales Register</a></li>\n        </ul>\n\n\n    </div>\n\n    <div class=\"row font-12\">\n        <div class=\"col-xs-2\">\n            <sh-select [options]=\"financialOptions\" [isFilterEnabled]=\"true\" [placeholder]=\"activeFinacialYr.uniqueName\" name=\"currentActiveFinacialYear\" [(ngModel)]='currentActiveFinacialYear.value' [showClear]=\"false\" (selected)=\"selectFinancialYearOption($event)\"\n                [ItemHeight]=\"33\"></sh-select>\n        </div>\n        <div class=\"col-xs-2\">\n\n            <div class=\"btn-group\" dropdown placement=\"bottom left\">\n                <div class=\"btn-group\" dropdown [autoClose]=\"true\" container=\"body\">\n                    <button id=\"button-nested\" dropdownToggle type=\"button\" class=\"btn  dropdown-toggle\" aria-controls=\"dropdown-nested\"> {{selectedType}}<span class=\"caret\"></span>\n          </button>\n                    <ul id=\"dropdown-nested\" *dropdownMenu class=\"dropdown-menu \" role=\"menu\" aria-labelledby=\"button-nested\">\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle (click)=\"populateRecords('monthly')\" class=\"dropdown-item dropdown-toggle cursor-pointer\">Monthly</a>\n                        </li>\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle (click)=\"populateRecords('quarterly')\" class=\"dropdown-item dropdown-toggle cursor-pointer\">Quarterly</a>\n                        </li>\n                        <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                            <a dropdownToggle class=\"dropdown-item dropdown-toggle cursor-pointer\" (click)=\"false\">Weekly <span\n                  style=\"margin-left: 80px\" class=\"caret\"></span></a>\n                            <ul class=\"dropdown-menu reportDropdown\" style=\" top: 0px !important;\" role=\"menu\">\n                                <li role=\"menuitem\" *ngFor=\"let month of monthNames\"><a (click)=\"populateRecords('weekly', month)\" class=\"dropdown-item\">{{month | slice:0:3}}</a></li>\n                            </ul>\n                        </li>\n\n                    </ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-xs-2\">\n            <!--<input type=\"text\" placeholder=\"Custom Range\" class=\"form-control\" (bsValueChange)=\"bsValueChange($event)\" bsDaterangepicker>-->\n        </div>\n\n    </div>\n    <br/>\n    <reports-table-component [reportRespone]=\"reportRespone\" [salesRegisterTotal]=\"salesRegisterTotal\">\n    </reports-table-component>\n\n    <!-- <div class=\"clearfix\">\n    <reports-graph-component></reports-graph-component>\n  </div> -->\n\n</div>\n"

/***/ }),

/***/ "./src/app/reports/components/report-details-components/report.details.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/reports/components/report-details-components/report.details.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".width-160 {\n  width: 160px; }\n\n.width-170 {\n  width: 170px; }\n\n.radio_theme:before {\n  content: ' ';\n  width: 14px;\n  height: 14px;\n  top: 0;\n  right: 0; }\n\n.radio_theme {\n  height: 14px;\n  width: 14px; }\n\n.radio_theme:checked:after {\n  content: ' ';\n  left: 4px;\n  bottom: 4px; }\n\n.btn-group {\n  display: block;\n  width: 100%;\n  text-align: left; }\n\n.btn.dropdown-toggle {\n  width: 100%;\n  text-align: left;\n  border: 1px solid #C4C0C0;\n  padding-left: 7px !important; }\n\n.btn.dropdown-toggle .caret {\n  position: absolute;\n  right: 10px;\n  top: 14px;\n  color: #A9A9A9;\n  border-right: 6px solid transparent;\n  border-left: 6px solid transparent;\n  border-top: 6px dashed; }\n\n.reportDropdown li {\n  float: left;\n  width: 51px; }\n\n.reportDropdown {\n  min-width: 210px; }\n\nul#dropdown-nested {\n  min-width: 254px; }\n\nul#dropdown-nested li .caret {\n  float: right;\n  margin-top: 8px; }\n\n.reportDropdown {\n  left: 100% !important; }\n\n#dropdown-nested li .caret {\n  float: right;\n  margin-top: 8px;\n  -webkit-transform: rotate(-94deg);\n          transform: rotate(-94deg);\n  border-right: 6px solid transparent;\n  border-left: 6px solid transparent;\n  border-top: 6px dashed;\n  color: #A9A9A9; }\n"

/***/ }),

/***/ "./src/app/reports/components/report-details-components/report.details.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/reports/components/report-details-components/report.details.component.ts ***!
  \******************************************************************************************/
/*! exports provided: ReportsDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsDetailsComponent", function() { return ReportsDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../models/api-models/Reports */ "./src/app/models/api-models/Reports.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");













var ReportsDetailsComponent = /** @class */ (function () {
    function ReportsDetailsComponent(router, store, companyActions, companyService, _toaster) {
        this.router = router;
        this.store = store;
        this.companyActions = companyActions;
        this.companyService = companyService;
        this._toaster = _toaster;
        this.bsValue = new Date();
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__["ReplaySubject"](1);
        this.salesRegisterTotal = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.selectedType = 'monthly';
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_10__;
        this.datePickerOptions = {
            hideOnEsc: true,
            // parentEl: '#dp-parent',
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
                'This Month to Date': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().startOf('month'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__()
                ],
                'This Quarter to Date': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter(moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter()).startOf('quarter'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__()
                ],
                'This Financial Year to Date': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().startOf('year').subtract(9, 'year'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__()
                ],
                'This Year to Date': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().startOf('year'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__()
                ],
                'Last Month': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().subtract(1, 'month').startOf('month'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().subtract(1, 'month').endOf('month')
                ],
                'Last Quater': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter(moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter()).subtract(1, 'quarter').startOf('quarter'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter(moment_moment__WEBPACK_IMPORTED_MODULE_10__().quarter()).subtract(1, 'quarter').endOf('quarter')
                ],
                'Last Financial Year': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().startOf('year').subtract(10, 'year'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().endOf('year').subtract(10, 'year')
                ],
                'Last Year': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().startOf('year').subtract(1, 'year'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_10__().endOf('year').subtract(1, 'year')
                ]
            },
            startDate: moment_moment__WEBPACK_IMPORTED_MODULE_10__().subtract(30, 'days'),
            endDate: moment_moment__WEBPACK_IMPORTED_MODULE_10__(),
        };
        this.financialOptions = [];
        this.setCurrentFY();
    }
    // @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;
    ReportsDetailsComponent.prototype.ngOnInit = function () {
    };
    ReportsDetailsComponent.prototype.goToDashboard = function () {
        this.router.navigate(['/pages/reports']);
    };
    ReportsDetailsComponent.prototype.filterReportResp = function (response) {
        var _this = this;
        var reportModelArray = [];
        var index = 1;
        var indexMonths = 0;
        var weekCount = 1;
        var reportsModelCombined = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
        _.forEach(response, function (item) {
            var reportsModel = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
            reportsModel.sales = item.creditTotal;
            reportsModel.returns = item.debitTotal;
            reportsModel.netSales = item.closingBalance.amount;
            reportsModel.cumulative = item.balance.amount;
            reportsModel.from = item.from;
            reportsModel.to = item.to;
            var mdyFrom = item.from.split('-');
            var mdyTo = item.to.split('-');
            var dateDiff = _this.datediff(_this.parseDate(mdyFrom), _this.parseDate(mdyTo));
            if (dateDiff <= 8) {
                _this.salesRegisterTotal.sales += item.creditTotal;
                _this.salesRegisterTotal.returns += item.debitTotal;
                _this.salesRegisterTotal.netSales = item.closingBalance.amount;
                _this.salesRegisterTotal.cumulative += item.balance.amount;
                _this.salesRegisterTotal.particular = _this.selectedMonth + " " + mdyFrom[2];
                reportsModel.particular = 'Week' + weekCount++;
                reportModelArray.push(reportsModel);
            }
            else if (dateDiff <= 31) {
                _this.salesRegisterTotal.sales += item.creditTotal;
                _this.salesRegisterTotal.returns += item.debitTotal;
                _this.salesRegisterTotal.netSales = item.closingBalance.amount;
                _this.salesRegisterTotal.cumulative += item.balance.amount;
                reportsModel.particular = _this.monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2];
                indexMonths++;
                reportsModelCombined.sales += item.creditTotal;
                reportsModelCombined.returns += item.debitTotal;
                reportsModelCombined.netSales = item.closingBalance.amount;
                reportsModelCombined.cumulative += item.balance.amount;
                reportModelArray.push(reportsModel);
                if (indexMonths % 3 === 0) {
                    reportsModelCombined.particular = 'Quarter ' + indexMonths / 3;
                    reportsModelCombined.reportType = 'combined';
                    reportModelArray.push(reportsModelCombined);
                    reportsModelCombined = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
                }
            }
            else if (dateDiff <= 93) {
                _this.salesRegisterTotal.sales += item.creditTotal;
                _this.salesRegisterTotal.returns += item.debitTotal;
                _this.salesRegisterTotal.netSales = item.closingBalance.amount;
                _this.salesRegisterTotal.cumulative += item.balance.amount;
                reportsModel.particular = _this.formatParticular(mdyTo, mdyFrom, index, _this.monthNames);
                reportModelArray.push(reportsModel);
                index++;
            }
        });
        return reportModelArray;
    };
    // new Date("dateString") is browser-dependent and discouraged, so we'll write
    // a simple parse function for U.S. date format (which does no error checking)
    ReportsDetailsComponent.prototype.parseDate = function (mdy) {
        return new Date(mdy[2], mdy[1], mdy[0]);
    };
    ReportsDetailsComponent.prototype.datediff = function (first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    };
    ReportsDetailsComponent.prototype.setCurrentFY = function () {
        var _this = this;
        // set financial years based on company financial year
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(Object(reselect__WEBPACK_IMPORTED_MODULE_8__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.session.companyUniqueName; }], function (companies, uniqueName) {
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
        })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_9__["takeUntil"])(this.destroyed$)).subscribe(function (selectedCmp) {
            if (selectedCmp) {
                _this.selectedCompany = selectedCmp;
                _this.financialOptions = selectedCmp.financialYears.map(function (q) {
                    return { label: q.uniqueName, value: q.uniqueName };
                });
                _this.currentActiveFinacialYear = _this.financialOptions[0];
                _this.activeFinacialYr = selectedCmp.activeFinancialYear;
                _this.populateRecords('monthly');
                _this.salesRegisterTotal.particular = _this.activeFinacialYr.uniqueName;
            }
        });
    };
    ReportsDetailsComponent.prototype.selectFinancialYearOption = function (v) {
        if (v.value) {
            var financialYear = this.selectedCompany.financialYears.find(function (p) { return p.uniqueName === v.value; });
            this.activeFinacialYr = financialYear;
            this.populateRecords(this.interval, this.selectedMonth);
        }
    };
    ReportsDetailsComponent.prototype.populateRecords = function (interval, month) {
        var _this = this;
        this.interval = interval;
        var startDate = this.activeFinacialYr.financialYearStarts.toString();
        var endDate = this.activeFinacialYr.financialYearEnds.toString();
        if (month) {
            this.selectedMonth = month;
            var startEndDate = this.getDateFromMonth(this.monthNames.indexOf(this.selectedMonth) + 1);
            startDate = startEndDate.firstDay;
            endDate = startEndDate.lastDay;
        }
        else {
            this.selectedMonth = null;
        }
        this.selectedType = interval.charAt(0).toUpperCase() + interval.slice(1);
        var request = {
            to: endDate,
            from: startDate,
            interval: interval,
        };
        this.companyService.getSalesRegister(request).subscribe(function (res) {
            if (res.status === 'error') {
                _this._toaster.errorToast(res.message);
            }
            else {
                _this.salesRegisterTotal = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
                _this.salesRegisterTotal.particular = _this.activeFinacialYr.uniqueName;
                _this.reportRespone = _this.filterReportResp(res.body);
            }
        });
    };
    ReportsDetailsComponent.prototype.formatParticular = function (mdyTo, mdyFrom, index, monthNames) {
        return 'Quarter ' + index + " (" + monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2] + "-" + monthNames[parseInt(mdyTo[1]) - 1] + " " + mdyTo[2] + ")";
    };
    ReportsDetailsComponent.prototype.bsValueChange = function (event) {
        var _this = this;
        if (event) {
            var request = {
                to: moment_moment__WEBPACK_IMPORTED_MODULE_10__(event[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_12__["GIDDH_DATE_FORMAT"]),
                from: moment_moment__WEBPACK_IMPORTED_MODULE_10__(event[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_12__["GIDDH_DATE_FORMAT"]),
                interval: 'monthly',
            };
            this.companyService.getSalesRegister(request).subscribe(function (res) {
                if (res.status === 'error') {
                    _this._toaster.errorToast(res.message);
                }
                else {
                    _this.salesRegisterTotal = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_6__["ReportsModel"]();
                    _this.salesRegisterTotal.particular = _this.activeFinacialYr.uniqueName;
                    _this.reportRespone = _this.filterReportResp(res.body);
                }
            });
        }
    };
    ReportsDetailsComponent.prototype.getDateFromMonth = function (selectedMonth) {
        var mdyFrom = this.activeFinacialYr.financialYearStarts.split('-');
        var mdyTo = this.activeFinacialYr.financialYearEnds.split('-');
        var startDate;
        if (mdyFrom[1] > selectedMonth) {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyTo[2];
        }
        else {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyFrom[2];
        }
        var startDateSplit = startDate.split('-');
        var dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        var month = (dt.getMonth() + 1).toString(), year = dt.getFullYear();
        // GET THE FIRST AND LAST DATE OF THE MONTH.
        //let firstDay = new Date(year, month , 0).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
        //let lastDay = new Date(year, month + 1, 1).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        var firstDay = '01-' + (month) + '-' + year;
        var lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;
        return { firstDay: firstDay, lastDay: lastDay };
    };
    ReportsDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reports-details-component',
            template: __webpack_require__(/*! ./report.details.component.html */ "./src/app/reports/components/report-details-components/report.details.component.html"),
            styles: [__webpack_require__(/*! ./report.details.component.scss */ "./src/app/reports/components/report-details-components/report.details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_4__["CompanyActions"], _services_companyService_service__WEBPACK_IMPORTED_MODULE_5__["CompanyService"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"]])
    ], ReportsDetailsComponent);
    return ReportsDetailsComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/report-graph-component/report.graph.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/reports/components/report-graph-component/report.graph.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <button (click)=\"add()\">Add Point!</button>\n<div [chart]=\"chart\"></div> -->"

/***/ }),

/***/ "./src/app/reports/components/report-graph-component/report.graph.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/reports/components/report-graph-component/report.graph.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/reports/components/report-graph-component/report.graph.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/reports/components/report-graph-component/report.graph.component.ts ***!
  \*************************************************************************************/
/*! exports provided: ReportsGraphComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsGraphComponent", function() { return ReportsGraphComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ReportsGraphComponent = /** @class */ (function () {
    function ReportsGraphComponent() {
        this.bsValue = new Date();
    }
    ReportsGraphComponent.prototype.ngOnInit = function () {
    };
    ReportsGraphComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reports-graph-component',
            template: __webpack_require__(/*! ./report.graph.component.html */ "./src/app/reports/components/report-graph-component/report.graph.component.html"),
            styles: [__webpack_require__(/*! ./report.graph.component.scss */ "./src/app/reports/components/report-graph-component/report.graph.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ReportsGraphComponent);
    return ReportsGraphComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/report-table-components/report.table.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/reports/components/report-table-components/report.table.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"responsive\">\n    <table class=\"table basic table-bordered\">\n        <thead>\n            <tr>\n                <th>Particular <a href=\"javascript:void(0)\" class=\"d-inline-block\"><i class=\"pull-right icon-collapse\"></i></a>\n                </th>\n                <th class=\"width-200px\">\n                    <div class=\"d-flex\">\n                        <div class=\"flex-fill text-right \">\n                            Sales\n                        </div>\n\n                    </div>\n                </th>\n                <th class=\"width-200px\">\n                    <div class=\"d-flex\">\n                        <div class=\"flex-fill text-right \">\n                            Return\n                        </div>\n\n                    </div>\n                </th>\n                <th class=\"width-200px\">\n                    <div class=\"d-flex\">\n                        <div class=\"flex-fill text-right \">\n                            Net Sales\n                        </div>\n\n                    </div>\n                </th>\n                <th class=\"width-200px\">\n                    <div class=\"d-flex\">\n                        <div class=\"flex-fill text-right \">\n                            Cumulative\n                        </div>\n\n                    </div>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr *ngFor=\"let item of reportRespone\" [ngClass]=\"{'bgChange': item.reportType === 'combined'}\">\n                <td><a class=\"cursor-pointer\" (click)=\"GotoDetailedSales(item)\">{{item.particular}}</a></td>\n                <td class=\"text-right\">{{item.sales | giddhCurrency}}</td>\n                <td class=\"text-right\">{{item.returns | giddhCurrency}}</td>\n                <td class=\"text-right\">{{item.cumulative | giddhCurrency}}</td>\n                <td class=\"text-right\">{{item.netSales | giddhCurrency}}</td>\n            </tr>\n        </tbody>\n\n        <tfoot class=\"bold\">\n            <tr>\n                <th><a href=\"javascript:void(0)\">{{salesRegisterTotal.particular }}</a></th>\n                <th class=\"text-right\">{{salesRegisterTotal.sales | giddhCurrency}}</th>\n                <th class=\"text-right\">{{salesRegisterTotal.returns | giddhCurrency}}</th>\n                <th class=\"text-right\">{{salesRegisterTotal.cumulative | giddhCurrency}}</th>\n                <th class=\"text-right\">{{salesRegisterTotal.netSales | giddhCurrency}}</th>\n            </tr>\n        </tfoot>\n    </table>\n</div>"

/***/ }),

/***/ "./src/app/reports/components/report-table-components/report.table.component.scss":
/*!****************************************************************************************!*\
  !*** ./src/app/reports/components/report-table-components/report.table.component.scss ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto; }\n\n.basic > tbody > tr:hover td > a {\n  color: #FF5F00; }\n\n.basic > tbody > tr > td, .basic > thead > tr > th, .basic > tfoot > tr > th {\n  padding: 10px 14px; }\n\n.basic > tfoot > tr > th {\n  background: #E3E3E3; }\n\n.table-active {\n  background: #F0F0F1; }\n\n.width-200px {\n  width: 200px; }\n\n.basic > tbody > tr > td > a {\n  color: #0C8FE6; }\n\n.particular[_ngcontent-c9] {\n  float: right;\n  margin-top: 2px;\n  font-size: 19px;\n  color: #333333; }\n\n.bgChange {\n  background: #F0F0F1; }\n"

/***/ }),

/***/ "./src/app/reports/components/report-table-components/report.table.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/reports/components/report-table-components/report.table.component.ts ***!
  \**************************************************************************************/
/*! exports provided: ReportsTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsTableComponent", function() { return ReportsTableComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../actions/groupwithaccounts.actions */ "./src/app/actions/groupwithaccounts.actions.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");






var ReportsTableComponent = /** @class */ (function () {
    function ReportsTableComponent(store, _groupWithAccountsAction, _router) {
        this.store = store;
        this._groupWithAccountsAction = _groupWithAccountsAction;
        this._router = _router;
        this.messageBody = {
            header: {
                email: 'Send Email',
                sms: 'Send Sms',
                set: ''
            },
            btn: {
                email: 'Send Email',
                sms: 'Send Sms',
                set: '',
            },
            type: '',
            msg: '',
            subject: ''
        };
        this.activeTab = 'customer';
    }
    ReportsTableComponent.prototype.ngOnInit = function () {
    };
    ReportsTableComponent.prototype.performActions = function (type, account, event) {
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(account.name));
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
                break;
            case 1: // go to ledger
                this.goToRoute('ledger', "/" + this.fromDate + "/" + this.toDate, account.uniqueName);
                break;
            case 2: // go to sales or purchase
                this.purchaseOrSales = this.activeTab === 'customer' ? 'sales' : 'purchase';
                if (this.purchaseOrSales === 'purchase') {
                    this.goToRoute('purchase/create', '', account.uniqueName);
                }
                else {
                    this.goToRoute('sales', '', account.uniqueName);
                }
                break;
            case 3: // send sms
                if (event) {
                    event.stopPropagation();
                }
                this.openSmsDialog();
                break;
            case 4: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openEmailDialog();
                break;
            default:
                break;
        }
    };
    ReportsTableComponent.prototype.goToRoute = function (part, additionalParams, accUniqueName) {
        if (additionalParams === void 0) { additionalParams = ''; }
        var url = location.href + ("?returnUrl=" + part + "/" + accUniqueName);
        if (additionalParams) {
            url = "" + url + additionalParams;
        }
        if (false) { var ipcRenderer; }
        else {
            window.open(url);
        }
    };
    // Open Modal for SMS
    ReportsTableComponent.prototype.openSmsDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    };
    // Open Modal for Email
    ReportsTableComponent.prototype.openEmailDialog = function () {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    };
    ReportsTableComponent.prototype.GotoDetailedSales = function (item) {
        var from = item.from;
        var to = item.to;
        var aa = this.activeFinacialYr;
        if (from != null && to != null) {
            this._router.navigate(['pages', 'reports', 'sales-detailed-expand'], { queryParams: { from: from, to: to } });
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], ReportsTableComponent.prototype, "reportRespone", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ReportsTableComponent.prototype, "activeFinacialYr", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ReportsTableComponent.prototype, "salesRegisterTotal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mailModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_4__["ModalDirective"])
    ], ReportsTableComponent.prototype, "mailModal", void 0);
    ReportsTableComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reports-table-component',
            template: __webpack_require__(/*! ./report.table.component.html */ "./src/app/reports/components/report-table-components/report.table.component.html"),
            styles: [__webpack_require__(/*! ./report.table.component.scss */ "./src/app/reports/components/report-table-components/report.table.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], _actions_groupwithaccounts_actions__WEBPACK_IMPORTED_MODULE_3__["GroupWithAccountsAction"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], ReportsTableComponent);
    return ReportsTableComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/sales-register-component/sales.register.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-component/sales.register.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid font-14\">\n  <div class=\"row mt-2\">\n    <div class=\"col-xs-6\">\n      <div class=\"clearfix pt-05\">\n        \n        <div class=\"d-inline-block\">\n          <div class=\"btn-group d-block\" dropdown>\n            <a href=\"javascript:void(0)\" id=\"button-basic\" dropdownToggle type=\"button\" class=\"dropdown-icon d-inline-block\"\n              aria-controls=\"dropdown-basic\">\n              <i class=\"icon-path\"></i>\n            </a>\n            <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Voucher Type</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Voucher No.</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Product/Service</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Qty-Rate</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Value</a>\n              </li>\n\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Discount</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Tax</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Round Off</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Tax on Freight</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Freight</a>\n              </li>\n              <li>\n                <a href=\"javascript:void(0)\" class=\"dropdown-item\"> \n                <input type=\"checkbox\">\n                Net Sales</a>\n              </li>\n            </ul>\n          </div>\n        </div>\n\n        <ul class=\"list-head list-inline d-inline-block middle\">\n          <li><a href=\"#\">Report</a> <span class=\"d-inline-block pl-1\"> ></span></li>\n          <li><a href=\"#\">Sales Register</a> <span class=\"d-inline-block pl-1\"> ></span></li>\n          <li>\n            <div class=\"select-style width-200 select-year\">\n              <select name=\"\">\n                <option value=\"\">August 2017</option>\n                <option value=\"\">Weekly</option>\n                <option value=\"\">Custom Range</option>\n              </select>\n            </div>\n          </li>\n\n          <li>\n            <div class=\"select-style width-200\">\n              <select name=\"\">\n                <option value=\"\">Monthly</option>\n                <option value=\"\">Weekly</option>\n                <option value=\"\">Custom Range</option>\n              </select>\n            </div>\n          </li>\n          <li>\n            <a href=\"javascript:void(0)\" class=\"exand-icon d-inline-block middle\"><i class=\"icon-expand\"></i></a>\n          </li>\n        </ul>\n\n        \n\n      </div>\n    </div>\n\n    <div class=\"col-xs-6 text-right\">\n      <button type=\"button\" class=\"btn btn-blue\">+ New Invoice</button>\n    </div>\n  </div>\n\n    <div class=\"clearfix\">\n      <sales-ragister-details></sales-ragister-details>\n    </div>\n\n    <!-- <div class=\"clearfix\">\n      <sales-register-expand></sales-register-expand>\n    </div> -->\n  </div>"

/***/ }),

/***/ "./src/app/reports/components/sales-register-component/sales.register.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-component/sales.register.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".dropdown-icon {\n  line-height: 0px;\n  font-size: 20px;\n  margin-right: 15px;\n  color: #666666;\n  vertical-align: middle; }\n\n.width-200 {\n  width: 200xp; }\n\n.select-year select {\n  background: none;\n  border: 0px; }\n\n.select-style select {\n  height: 30px !important;\n  padding: 5px 22px 5px 7px !important; }\n\n.exand-icon {\n  background: #E5E5E5;\n  width: 30px;\n  height: 30px;\n  text-align: center;\n  line-height: 33px;\n  vertical-align: middle;\n  display: inline-block;\n  font-size: 17px;\n  color: #FF5F00;\n  margin-left: 5px; }\n\n.list-head > li {\n  vertical-align: middle; }\n"

/***/ }),

/***/ "./src/app/reports/components/sales-register-component/sales.register.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-component/sales.register.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: SalesRegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesRegisterComponent", function() { return SalesRegisterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var SalesRegisterComponent = /** @class */ (function () {
    function SalesRegisterComponent() {
        this.bsValue = new Date();
    }
    SalesRegisterComponent.prototype.ngOnInit = function () {
    };
    SalesRegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sales-ragister-component',
            template: __webpack_require__(/*! ./sales.register.component.html */ "./src/app/reports/components/sales-register-component/sales.register.component.html"),
            styles: [__webpack_require__(/*! ./sales.register.component.scss */ "./src/app/reports/components/sales-register-component/sales.register.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SalesRegisterComponent);
    return SalesRegisterComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-details-component/sales.register.details.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"responsive mt-2\">\n  <table class=\"table basic table-bordered\">\n    <thead>\n      <tr>\n        <th class=\"widtn-100\">\n          <div  class=\"d-flex\">\n            <div class=\"flex-fill pr-1\">\n              Date\n            </div>\n            <div class=\"icon-pointer\">\n              <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"></div>\n              <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"></div>\n            </div>\n          </div>\n        </th>\n\n        <th class=\"td_in_searchBox\">\n          <div>\n            <span> Account</span><i class=\"icon-search\"></i>\n          </div>\n        </th>\n        \n        <th class=\"width-160\">\n        <div class=\"d-flex\">\n          <div class=\"flex-fill pr-1\">\n            Voucher Type\n          </div>\n          <div class=\"icon-pointer\">\n            <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"></div>\n            <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"></div>\n          </div>\n        </div>\n        </th>\n        \n        <th class=\"td_in_searchBox width-160\">\n          <div>\n            <span> Number</span><i class=\"icon-search\"></i>\n          </div>\n          <!-- <div class=\"input-container\">\n            <input class=\"w100\" placeholder=\"Search Report No.\" type=\"text\">\n          </div> -->\n        </th>\n\n        <th class=\"width-160\">\n          <div  class=\"d-flex\">\n            <div class=\"flex-fill text-right pr-1\">\n                Sales\n            </div>\n            <div class=\"icon-pointer\">\n              <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"></div>\n              <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"></div>\n            </div>\n          </div>\n          </th>\n\n          <th class=\"width-160\">\n          <div  class=\"d-flex\">\n            <div class=\"flex-fill text-right pr-1\">\n                Return\n            </div>\n            <div class=\"icon-pointer\">\n              <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"></div>\n              <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"></div>\n            </div>\n          </div>\n          </th>\n\n          <th class=\"width-160\">\n          <div  class=\"d-flex\">\n            <div class=\"flex-fill text-right pr-1\">\n                Net Sales\n            </div>\n            <div class=\"icon-pointer\">\n              <div class=\"glyphicon glyphicon-triangle-top text-light-2 d-block font-xxs\"></div>\n              <div class=\"glyphicon glyphicon-triangle-bottom text-light-2 d-block font-xxs\"></div>\n            </div>\n          </div>\n          </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let item of items\">\n        <td>{{item.date}}</td>\n        \n        <td>\n        <div class=\"btn-group ac-detail\" dropdown>\n          <a href=\"javascript:void(0)\" id=\"button-basic\" dropdownToggle aria-controls=\"dropdown-basic\">\n          {{item.account}}\n          </a>\n\n          <div id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu p-modal-tolltip\"\n            role=\"menu\" aria-labelledby=\"button-basic\">\n            <div class=\"account-detail-custom-header\">\n              <div class=\"d-flex\">\n                <div class=\"account-detail-padding\" style=\"flex: 1;border-right: 0px;\">\n                  <h3 class=\"account-detail-custom-title word-break\">\n                    <span>Mehta & Sons</span>\n                  </h3>\n                </div>\n                <div class=\"account-detail-padding\">\n                  <a href=\"javascript:void(0)\"><img src=\"./assets/images/path.svg\"></a>\n                </div>\n              </div>\n              <div class=\"custom-detail account-detail-padding\">\n                <h4>9876543210</h4>\n                <h4>mehta&sons@gmail.com</h4>\n                <h4>23ABCDE1234F2Z5</h4>\n              </div>\n            </div>\n            <div class=\"height-82px\">\n              <ul class=\"list-unstyled\">\n                <li class=\"li-link\"><a href=\"javascript: void 0\">Go to Ledger</a></li>\n                <li class=\"li-link\"><a href=\"javascript: void 0\">Generate Invoice</a></li>\n                <li class=\"li-link\"><a href=\"javascript: void 0\">Send SMS</a></li>\n                <li class=\"li-link\"><a href=\"javascript: void 0\">Send Email</a></li>\n              </ul>\n            </div>\n          </div>\n        </div>\n        </td>\n        <td>{{item.voucherType}}</td>\n        <td><a href=\"javascript:void(0)\">{{item.Number}}</a></td>\n        <td class=\"text-right\">{{item.sales}}</td>\n        <td class=\"text-right\">{{item.return}}</td>\n        <td class=\"text-right\">{{item.netSales}}</td>\n      </tr>\n    </tbody>\n  </table>\n  </div>\n\n<div class=\"text-center\">\n  <pagination [totalItems]=\"30\"></pagination>\n</div>"

/***/ }),

/***/ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-details-component/sales.register.details.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto; }\n\n.basic > tbody > tr:hover td > a {\n  color: #FF5F00; }\n\n.basic > tbody > tr > td, .basic > thead > tr > th, .basic > tfoot > tr > th {\n  padding: 10px 14px; }\n\n.basic > tfoot > tr > th {\n  background: #E3E3E3; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox div span {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-left: 8px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox .input-container input {\n  height: 41px;\n  width: 100%;\n  padding: 11px;\n  padding-right: 40px; }\n\n.p-modal-tolltip {\n  position: absolute;\n  background-color: white;\n  z-index: 1000;\n  width: 257px;\n  border: 1px solid #b4afaf;\n  border-radius: 4px;\n  box-shadow: 0 7px 24px #00000038; }\n\n.account-detail-modal-div {\n  height: 100%;\n  padding: 0; }\n\n.account-detail-custom-header {\n  border-right: 0;\n  padding: 11px 10px 10px 10px;\n  width: 100%;\n  background: #ffece094; }\n\n.account-detail-custom-title {\n  font-family: LatoWebBold !important;\n  font-size: 16px !important; }\n\n.account-detail-padding {\n  padding: 1px;\n  text-transform: none !important; }\n\n.account-detail-padding {\n  padding: 1px;\n  text-transform: none !important; }\n\n.custom-detail h4 {\n  color: #707070;\n  margin-top: 7px;\n  font-size: 14px !important;\n  font-family: latoWeb !important; }\n\n.height-82px {\n  padding: 10px 10px 15px 10px;\n  border-top: 1px solid #C7C7C7; }\n\nul.list-unstyled li a {\n  color: black; }\n\n.li-link {\n  margin-top: 15px !important; }\n\n.btn-group > a {\n  color: #333333; }\n\n.ac-detail, .ac-detail a {\n  display: block; }\n"

/***/ }),

/***/ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/reports/components/sales-register-details-component/sales.register.details.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: SalesRegisterDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesRegisterDetailsComponent", function() { return SalesRegisterDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var SalesRegisterDetailsComponent = /** @class */ (function () {
    function SalesRegisterDetailsComponent() {
        this.bsValue = new Date();
        this.items = [
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
            { date: '1 Aug 17', account: 'Walkover web solutions pvt. Ltd.', voucherType: 'Sales', Number: 201902043, sales: 2300, return: 2300, netSales: 2300 },
        ];
    }
    SalesRegisterDetailsComponent.prototype.ngOnInit = function () {
    };
    SalesRegisterDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sales-ragister-details',
            template: __webpack_require__(/*! ./sales.register.details.component.html */ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.html"),
            styles: [__webpack_require__(/*! ./sales.register.details.component.scss */ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SalesRegisterDetailsComponent);
    return SalesRegisterDetailsComponent;
}());



/***/ }),

/***/ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.html":
/*!********************************************************************************************************!*\
  !*** ./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.html ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"top_bar clearfix\">\n    <div class=\"form-inline\">\n        <div class=\"dis  mrR1 d-inline-block middle\">\n            <div (clickOutside)=\"hideListItems();\" class=\"btn-group\" #filterDropDownList=\"bs-dropdown\" dropdown [autoClose]=\"false\" [placement]=\"'right'\">\n                <i dropdownToggle class=\"icon-options pd cp fs20\"></i>\n                <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-left\" role=\"menu\" [style.width.px]=\"'200'\">\n                    <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"voucherType\" (ngModelChange)=\"columnFilter($event, 'voucherType')\" [(ngModel)]=\"showFieldFilter.voucherType\" /> voucher Type</a>\n                    </li>\n                    <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"voucherNo\" (ngModelChange)=\"columnFilter($event, 'voucherNo')\" [(ngModel)]=\"showFieldFilter.voucherNo\" /> Voucher No.</a>\n                    </li>\n                    <!-- <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"productService\" (ngModelChange)=\"columnFilter($event, 'productService')\" [(ngModel)]=\"showFieldFilter.productService\" /> Product/Service</a>\n                    </li> -->\n                    <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"qtyRate\" (ngModelChange)=\"columnFilter($event, 'qtyRate')\" [(ngModel)]=\"showFieldFilter.qtyRate\" /> Qty-Rate</a>\n                    </li>\n                    <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"discount\" (ngModelChange)=\"columnFilter($event, 'discount')\" [(ngModel)]=\"showFieldFilter.discount\" /> Discount\n                        </a>\n                    </li>\n                    <li role=\"menuitem\">\n                        <a class=\"dropdown-item\">\n                            <input type=\"checkbox\" name=\"tax\" (ngModelChange)=\"columnFilter($event, 'tax')\" [(ngModel)]=\"showFieldFilter.tax\" /> Tax\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"d-inline-block middle\">\n            <ul class=\"list-inline d-inline-block middle nav-report\">\n                <li class=\"active\"><a href=\"javascript:void(0)\" (click)=\"goToDashboard(true)\">Report</a> <span class=\"d-inline-block pl-1\"> ></span></li>\n                <li><a href=\"javascript:void(0)\" (click)=\"goToDashboard(false)\">Sales Register</a><span class=\"d-inline-block pl-1\"> ></span></li>\n            </ul>\n\n\n        </div>\n        <!-- more btn code hide -->\n        <!-- <div class=\"d-inline-block middle\">\n            <div class=\"btn-group moreBtn\" dropdown>\n                <a id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn btn-default dropdown-toggle\" aria-controls=\"dropdown-basic\">\n                  More <span class=\"caret\"></span>\n                    </a>\n                <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n                    <li role=\"menuitem\">Email</li>\n                    <li role=\"menuitem\">SMS</li>\n                    <li role=\"menuitem\">Download CSV</li>\n                </ul>\n            </div>\n        </div> -->\n        <!-- <div class=\"pull-left header-left\">\n\n\n            <div class=\"form-group max250\">\n                <input type=\"text\" placeholder=\"Name/GSTIN/Email/Mobile\" class=\"form-control\" [(ngModel)]=\"searchStr\" (ngModelChange)=\"searchStr$.next($event)\" style=\"width:210px\" />\n            </div>\n\n        </div> -->\n\n\n        <!-- <div class=\"btn-group\" dropdown placement=\"bottom left\">\n      <div class=\"btn-group\" dropdown [autoClose]=\"true\" container=\"body\">\n        <button id=\"button-nested\" dropdownToggle type=\"button\" class=\"btn  dropdown-toggle\"\n          aria-controls=\"dropdown-nested\">August 2017<span class=\"caret\"></span>\n        </button>\n        <ul id=\"dropdown-nested\" *dropdownMenu class=\"dropdown-menu \" role=\"menu\" aria-labelledby=\"button-nested\">\n          <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\" *ngFor=\"let monthYears of monthYear\">\n            <a dropdownToggle class=\"dropdown-item dropdown-toggle\">{{monthYear}}</a>\n          </li>\n\n        </ul>\n      </div>\n    </div> -->\n        <div class=\"btn-group customeMnthSelect\" dropdown>\n            <button id=\"button-custom-html\" dropdownToggle type=\"button\" class=\"btn  dropdown-toggle\" aria-controls=\"dropdown-custom-html\">\n        {{selectedMonth}} <span class=\"caret\"></span>\n      </button>\n            <ul id=\"dropdown-custom-html\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-custom-html\">\n                <ng-container *ngFor=\"let item of monthYear; let i=index;\">\n                    <li role=\"menuitem\"><a class=\"dropdown-item cursor-pointer\" (click)=\"selectedFilterMonth(item,i+1)\">{{item}}</a></li>\n                </ng-container>\n\n            </ul>\n        </div>\n\n\n        <!-- <div class=\"btn-group\" dropdown placement=\"bottom left\">\n            <div class=\"btn-group\" dropdown [autoClose]=\"true\" container=\"body\">\n                <button id=\"button-nested\" dropdownToggle type=\"button\" class=\"btn  dropdown-toggle\" aria-controls=\"dropdown-nested\">select month <span class=\"caret\"></span>\n        </button>\n                <ul id=\"dropdown-nested\" *dropdownMenu class=\"dropdown-menu \" role=\"menu\" aria-labelledby=\"button-nested\">\n                    <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                        <a dropdownToggle (click)=\"populateRecords('monthly')\" class=\"dropdown-item dropdown-toggle\">Monthly</a>\n                    </li>\n                    <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                        <a dropdownToggle (click)=\"populateRecords('quarterly')\" class=\"dropdown-item dropdown-toggle\">Quarterly</a>\n                    </li>\n                    <li role=\"menuitem\" dropdown placement=\"right\" container=\"body\">\n                        <a dropdownToggle class=\"dropdown-item dropdown-toggle\" (click)=\"false\">Weekly <span\n                style=\"margin-left: 80px\" class=\"caret\"></span></a>\n                        <ul class=\"dropdown-menu reportDropdown\" style=\" top: 0px !important;\" role=\"menu\">\n                            <li role=\"menuitem\" *ngFor=\"let month of monthNames\"><a (click)=\"populateRecords('weekly', month)\" class=\"dropdown-item\">{{month | slice:0:3}}</a></li>\n                        </ul>\n                    </li>\n\n                </ul>\n            </div>\n        </div> -->\n\n        <div class=\"form-group\" style=\"margin-right: 10px;\">\n\n            <a class=\"cp\" style=\"color: #FF5F00;\" (click)=\"emitExpand()\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Expand All\" *ngIf=\"!expand\">\n                <img src=\"{{imgPath}}expand.png\" style=\"margin-top: 3px !important;\">\n            </a>\n\n            <a class=\"cp\" style=\"color: #FF5F00;\" (click)=\"emitExpand()\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Collapse All\" *ngIf=\"expand\">\n                <img src=\"{{imgPath}}collapse.png\" style=\"margin-top: 3px !important;\">\n            </a>\n\n        </div>\n\n\n    </div>\n</div>\n\n<ng-container *ngIf=\"(isGetSalesDetailsSuccess$ | async)\">\n    <div class=\"clearfix \">\n        <div class=\"responsive mt-2 \">\n            <table class=\"table basic table-bordered table-middle \">\n                <thead>\n                    <tr>\n                        <th>\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill pr-1 \">\n                                    Date\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'date'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n\n                        <th class=\"td_in_searchBox \">\n                            <div>\n                                <span> Account</span>\n                            </div>\n                        </th>\n                        <!-- <th class=\"td_in_searchBox nowrap\" #searchInvoiceContainer1>\n\n                                <div [hidden]=\"showSearchCustomer\">\n                                    <span> Account</span>\n                                    <i class=\"icon-search\" (click)=\"toggleSearch('customerUniqueName')\"></i>\n                                </div>\n\n\n                                <div class=\"input-container\" [hidden]=\"!showSearchCustomer\">\n                                    <input type=\"text\" placeholder=\"Search account name\" class=\"w100\" #customerSearch [formControl]=\"customerNameInput\" />\n\n                                </div>\n\n                            </th> -->\n\n                        <th *ngIf=\"showFieldFilter.voucherType \">\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill pr-1 \">\n                                    Voucher Type\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'voucherType'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n\n                        <!-- <th *ngIf=\"showFieldFilter.voucherNo \" class=\"td_in_searchBox \">\n                            <div>\n                                <span>Voucher No.</span><i class=\"icon-search \"></i>\n                            </div>\n\n                        </th> -->\n\n                        <th *ngIf=\"showFieldFilter.voucherNo\" class=\"td_in_searchBox nowrap\" style=\"width: 210px;\" #searchInvoiceContainer (clickOutside)=\"clickedOutsideEvent();\">\n\n                            <div [hidden]=\"showSearchInvoiceNo\">\n                                <span>Voucher No</span>\n                                <i class=\"icon-search\" (click)=\"toggleSearch('invoiceNumber')\"></i>\n                            </div>\n\n\n                            <div class=\"input-container\" [hidden]=\"!showSearchInvoiceNo\">\n                                <input type=\"text\" placeholder=\"Search voucher number\" class=\"w100\" #invoiceSearch [formControl]=\"voucherNumberInput\" />\n\n                            </div>\n\n                        </th>\n\n                        <th>\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Sales\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'creditTotal'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n\n                        <th>\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Return\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'debitTotal'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n                        <th *ngIf=\" showFieldFilter.qtyRate \">\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Qty/Unit\n                                </div>\n\n                            </div>\n                        </th>\n                        <th *ngIf=\"showFieldFilter.qtyRate \">\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Rate\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'rate'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n\n                        <th *ngIf=\"showFieldFilter.discount \">\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Discount\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'discountTotal'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n\n                        <th *ngIf=\"showFieldFilter.tax \">\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Tax\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'taxTotal'}\">\n                                </ng-container>\n                            </div>\n                        </th>\n                        <th>\n                            <div class=\"d-flex \">\n                                <div class=\"flex-fill text-right pr-1 \">\n                                    Net Sales\n                                </div>\n                                <ng-container *ngTemplateOutlet=\"sortingTemplate;context: { $implicit: 'netTotal'}\">\n                                </ng-container>\n\n                            </div>\n                        </th>\n                    </tr>\n                </thead>\n                <tbody *ngIf=\"(SalesRegisteDetailedResponse$ | async).items.length\">\n                    <tr *ngFor=\" let item of (SalesRegisteDetailedResponse$ | async).items \">\n                        <td>{{item.date}}</td>\n\n                        <td (dblclick)=\"modalUniqueName=item.uniqueName \" class=\"cp no-dbl-click-select \" (clickOutside)=\"modalUniqueName='' \">\n                            {{item.account.name}}\n                            <div *ngIf=\"modalUniqueName===item.uniqueName \" account-detail-modal-component [accountUniqueName]=\"item.account.uniqueName \" [from]=\"this.from \" [to]=\"this.to \" [isModalOpen]=\"modalUniqueName===item.uniqueName \">\n                            </div>\n                            <ng-container *ngIf=\"expand \">\n                                <ng-container *ngFor=\"let stock of item.stocks \">\n                                    <p>{{stock.stock.name}}</p>\n                                </ng-container>\n                            </ng-container>\n                        </td>\n                        <td *ngIf=\"showFieldFilter.voucherType\" class=\"vertcleAlignTop\">{{item.voucherType}}</td>\n                        <td *ngIf=\"showFieldFilter.voucherNo \" class=\"vertcleAlignTop\"><a href=\"javascript:void(0) \">{{item.voucherNumber}}</a></td>\n                        <td class=\"text-right \">{{item.creditTotal | giddhCurrency}}\n                            <ng-container *ngIf=\"expand \">\n                                <ng-container *ngFor=\"let stock of item.stocks \">\n                                    <p>{{stock.amount | giddhCurrency}}</p>\n                                </ng-container>\n                            </ng-container>\n                        </td>\n                        <td class=\"text-right \">{{item.debitTotal | giddhCurrency}}</td>\n                        <td class=\"text-right \" *ngIf=\"showFieldFilter.qtyRate \">-\n                            <ng-container *ngIf=\"expand \">\n                                <ng-container *ngFor=\"let stock of item.stocks \">\n                                    <p>{{stock.quantity | giddhCurrency}} {{stock.unit.code}}</p>\n                                </ng-container>\n                            </ng-container>\n                        </td>\n                        <td class=\"text-right \" *ngIf=\"showFieldFilter.qtyRate\">-\n                            <ng-container *ngIf=\"expand \">\n                                <ng-container *ngFor=\"let stock of item.stocks \">\n                                    <p>{{stock.rate | giddhCurrency}}</p>\n                                </ng-container>\n                            </ng-container>\n                        </td>\n                        <td *ngIf=\"showFieldFilter.discount \" class=\"text-right \">{{item.discountTotal | giddhCurrency}}</td>\n                        <td *ngIf=\"showFieldFilter.tax \" class=\"text-right \">{{item.taxTotal | giddhCurrency}}</td>\n                        <td class=\"text-right \">{{item.netTotal | giddhCurrency}}</td>\n\n                    </tr>\n                </tbody>\n\n            </table>\n        </div>\n\n        <div class=\"text-center \" *ngIf=\"(SalesRegisteDetailedResponse$ | async).totalItems> 20\">\n            <pagination [totalItems]=\"(SalesRegisteDetailedResponse$ | async).totalItems \" [(ngModel)]=\"getDetailedsalesRequestFilter.page \" [maxSize]=\"5 \" class=\"pagination-sm \" [boundaryLinks]=\"true \" [itemsPerPage]=\"20 \" [rotate]=\"false\n    \" previousText=\"&#9668; \" nextText=\"&#9658; \" (pageChanged)=\"pageChanged($event) \"></pagination>\n        </div>\n    </div>\n    <div class=\"no-data \" *ngIf=\"(SalesRegisteDetailedResponse$ | async).items.length===0 && !(isGetSalesDetailsInProcess$ | async) \">\n        <h1>No entries found within given criteria.</h1>\n        <h1>Do search with some other dates</h1>\n    </div>\n\n\n    <div class=\"clearfix sales-ragister \">\n        <div class=\"col-xs-3 \">\n            <p>Transaction count</p>\n            <p class=\"text-orange \">{{(SalesRegisteDetailedResponse$ | async).totalItems }}</p>\n        </div>\n        <div class=\"col-xs-9 \">\n            <div *ngIf=\"SalesRegisteDetailedItems \" class=\"clearfix main-sale-register-box \">\n\n                <div class=\"sale-register-box text-right\">\n                    <p>Sales</p>\n                    <h4>{{(SalesRegisteDetailedResponse$ | async).creditTotal | giddhCurrency}}</h4>\n                </div>\n                <div class=\"sale-register-box text-right\">\n                    <p>Return</p>\n                    <h4>{{(SalesRegisteDetailedResponse$ | async).debitTotal | giddhCurrency}}</h4>\n                </div>\n                <div class=\"sale-register-box text-right\">\n                    <p>Discount</p>\n                    <h4>{{(SalesRegisteDetailedResponse$ | async).discountTotal | giddhCurrency}}</h4>\n                </div>\n                <div class=\"sale-register-box text-right\">\n                    <p>Total Tax</p>\n                    <h4>{{(SalesRegisteDetailedResponse$ | async).taxTotal | giddhCurrency}}</h4>\n                </div>\n                <!-- <div class=\"sale-register-box \">\n                    <p>Freight</p>\n                    <h4>Freight</h4>\n                </div> -->\n                <div class=\"sale-register-box text-right\">\n                    <p>Net Sales</p>\n                    <h4 class=\"text-orange \">{{(SalesRegisteDetailedResponse$ | async).netTotal.amount | giddhCurrency}}</h4>\n                </div>\n                <!-- <div class=\"sale-register-box \">\n                    <a href=\"# \"><img src=\"assets/images/intercom-chat.png \" alt=\" \"></a>\n                </div> -->\n            </div>\n        </div>\n    </div>\n</ng-container>\n\n<div *ngIf=\"(isGetSalesDetailsInProcess$ | async) \">\n    <div class=\"no-data mrT2 d-flex \" style=\"justify-content: center;align-items: center;margin-top:125px;margin-bottom: 105px; \">\n        <div class=\"giddh-spinner vertical-center-spinner \"></div>\n    </div>\n</div>\n<!-- region sorting template -->\n<ng-template #sortingTemplate let-col>\n    <div class=\"icon-pointer cp\">\n        <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sortbyApi(col, 'asc')\" *ngIf=\"getDetailedsalesRequestFilter.sortBy !== col\" [ngClass]=\"{'activeTextColor': getDetailedsalesRequestFilter.sortBy === col && getDetailedsalesRequestFilter.sort === 'asc'}\">\n        </div>\n\n        <div class=\"fa fa-long-arrow-up text-light-2 d-block font-xxs\" (click)=\"sortbyApi(col, 'desc')\" *ngIf=\"getDetailedsalesRequestFilter.sortBy === col && getDetailedsalesRequestFilter.sort === 'asc'\" [ngClass]=\"{'activeTextColor': getDetailedsalesRequestFilter.sortBy === col && getDetailedsalesRequestFilter.sort === 'asc'}\">\n        </div>\n\n        <div class=\"fa fa-long-arrow-down text-light-2 d-block font-xxs\" *ngIf=\"getDetailedsalesRequestFilter.sortBy === col && getDetailedsalesRequestFilter.sort === 'desc'\" (click)=\"sortbyApi(col, 'asc')\" [ngClass]=\"{'activeTextColor': getDetailedsalesRequestFilter.sortBy === col && getDetailedsalesRequestFilter.sort === 'desc'}\">\n        </div>\n    </div>\n</ng-template>\n<!-- endregion -->\n"

/***/ }),

/***/ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.scss":
/*!********************************************************************************************************!*\
  !*** ./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.scss ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".flex-fill {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto; }\n\n.basic > tbody > tr:hover td > a {\n  color: #FF5F00; }\n\n.basic > tbody > tr > td,\n.basic > thead > tr > th,\n.basic > tfoot > tr > th {\n  padding: 10px 14px; }\n\n.basic > tfoot > tr > th {\n  background: #E3E3E3; }\n\n.td_in_searchBox {\n  padding: 0px !important;\n  position: relative; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox div span {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding-left: 8px; }\n\n.td_in_searchBox div i {\n  margin-top: 3px;\n  color: #8080808c;\n  padding-right: 8px;\n  cursor: pointer; }\n\n.td_in_searchBox div {\n  display: -webkit-box;\n  display: flex; }\n\n.td_in_searchBox .input-container input {\n  height: 41px;\n  width: 100%;\n  padding: 11px;\n  padding-right: 40px; }\n\n.p-modal-tolltip {\n  position: absolute;\n  background-color: white;\n  z-index: 1000;\n  width: 257px;\n  border: 1px solid #b4afaf;\n  border-radius: 4px;\n  box-shadow: 0 7px 24px #00000038; }\n\n.account-detail-modal-div {\n  height: 100%;\n  padding: 0; }\n\n.account-detail-custom-header {\n  border-right: 0;\n  padding: 11px 10px 10px 10px;\n  width: 100%;\n  background: #ffece094; }\n\n.account-detail-custom-title {\n  font-family: LatoWebBold !important;\n  font-size: 16px !important; }\n\n.account-detail-padding {\n  padding: 1px;\n  text-transform: none !important; }\n\n.custom-detail h4 {\n  color: #707070;\n  margin-top: 7px;\n  font-size: 14px !important;\n  font-family: latoWeb !important; }\n\n.height-82px {\n  padding: 10px 10px 15px 10px;\n  border-top: 1px solid #C7C7C7; }\n\nul.list-unstyled li a {\n  color: black; }\n\n.li-link {\n  margin-top: 15px !important; }\n\n.btn-group > a {\n  color: #333333; }\n\n.ac-detail,\n.ac-detail a {\n  display: block; }\n\n.main-sale-register-box .sale-register-box p {\n  color: #8F9091; }\n\n.main-sale-register-box .sale-register-box h4 {\n  font-size: 18px;\n  color: #333333; }\n\n.sales-ragister p {\n  color: #8F9091;\n  margin-bottom: 5px; }\n\n.main-sale-register-box .sale-register-box {\n  width: 100%; }\n\n.main-sale-register-box {\n  display: -webkit-box;\n  display: flex;\n  vertical-align: middle;\n  -webkit-box-align: center;\n          align-items: center; }\n\n.sale-register-box a {\n  display: inline-block; }\n\n.sale-register-box a > img {\n  width: 60px; }\n\n.sale-register {\n  overflow: hidden;\n  display: block;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center; }\n\n.text-orange {\n  color: #FF5F00 !important; }\n\n.sales-ragister {\n  background: #fff;\n  padding: 15px;\n  box-shadow: 0px -3px 6px #d7d7d7;\n  margin-left: -13px;\n  margin-right: -13px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  z-index: 2; }\n\n.responsive {\n  padding: 0 15px; }\n\n#content_wrapper {\n  padding-bottom: 0px !important; }\n\n.basic tbody tr td p {\n  margin-bottom: 10px; }\n\n.basic tbody tr td p:last-child {\n  margin-bottom: 0px; }\n\n.icon-pointe .glyphicon {\n  cursor: pointer; }\n\n.middle {\n  vertical-align: middle; }\n\n.reportDropdown li {\n  float: left;\n  width: 51px; }\n\n.reportDropdown {\n  min-width: 210px; }\n\nul#dropdown-nested {\n  min-width: 254px; }\n\nul#dropdown-nested li .caret {\n  float: right;\n  margin-top: 8px; }\n\n.reportDropdown {\n  left: 100% !important; }\n\n.customeMnthSelect.show {\n  display: inline-block !important; }\n\n.top_bar {\n  padding: 15px; }\n\n.customeMnthSelect li:hover a.dropdown-item {\n  background-color: #E5E5E5;\n  color: #ff5f00; }\n\n.customeMnthSelect button.btn {\n  background: transparent !important;\n  padding-left: 3px;\n  padding-right: 3px; }\n\n.customeMnthSelect button.btn:active,\n.customeMnthSelect button.btn:focus,\n.customeMnthSelect button.btn:hover {\n  background: transparent !important;\n  box-shadow: none !important;\n  outline: none !important; }\n\n.icon-pointer .glyphicon:hover {\n  color: #FF5F00 !important; }\n\n.icon-pointer .activeTextColor {\n  color: #FF5F00 !important;\n  opacity: 1 !important; }\n\n.icon-pointer .d-block.font-xxs.glyphicon.glyphicon-triangle-top {\n  line-height: 0.5;\n  height: 8px; }\n\n.icon-pointer .font-xxs {\n  font-size: 12px; }\n\ntable th {\n  position: relative; }\n\n.icon-pointer {\n  position: absolute;\n  right: 10px;\n  top: 33%; }\n\n.vertcleAlignTop {\n  vertical-align: top !important; }\n\n@media (max-width: 1366px) {\n  .main-sale-register-box {\n    padding-right: 70px; } }\n\n@media (min-width: 1367px) {\n  .main-sale-register-box {\n    display: -webkit-box;\n    display: flex;\n    vertical-align: middle;\n    -webkit-box-align: center;\n            align-items: center;\n    padding-right: 270px; } }\n"

/***/ }),

/***/ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.ts":
/*!******************************************************************************************************!*\
  !*** ./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.ts ***!
  \******************************************************************************************************/
/*! exports provided: SalesRegisterExpandComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesRegisterExpandComponent", function() { return SalesRegisterExpandComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../actions/invoice/receipt/receipt.actions */ "./src/app/actions/invoice/receipt/receipt.actions.ts");
/* harmony import */ var _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/api-models/Reports */ "./src/app/models/api-models/Reports.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");










var SalesRegisterExpandComponent = /** @class */ (function () {
    function SalesRegisterExpandComponent(store, invoiceReceiptActions, activeRoute, router, _cd) {
        this.store = store;
        this.invoiceReceiptActions = invoiceReceiptActions;
        this.activeRoute = activeRoute;
        this.router = router;
        this._cd = _cd;
        this.getDetailedsalesRequestFilter = new _models_api_models_Reports__WEBPACK_IMPORTED_MODULE_4__["ReportsDetailedRequestFilter"]();
        // public showSearchCustomer: boolean = false;
        this.showSearchInvoiceNo = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_7__["ReplaySubject"](1);
        this.voucherNumberInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormControl"]();
        // public customerNameInput: FormControl = new FormControl();
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.monthYear = [];
        this.expand = false;
        this.showFieldFilter = {
            voucherType: true,
            voucherNo: true,
            productService: false,
            qtyRate: false,
            value: false,
            discount: false,
            tax: false
        };
        this.bsValue = new Date();
        this.SalesRegisteDetailedResponse$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(function (p) { return p.receipt.SalesRegisteDetailedResponse; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$));
        this.isGetSalesDetailsInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(function (p) { return p.receipt.isGetSalesDetailsInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$));
        this.isGetSalesDetailsSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(function (p) { return p.receipt.isGetSalesDetailsSuccess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$));
    }
    SalesRegisterExpandComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imgPath =  false ? undefined : "http://test.giddh.com/" + "app/" + 'assets/icon/';
        this.getDetailedsalesRequestFilter.page = 1;
        this.getDetailedsalesRequestFilter.count = 20;
        this.getDetailedsalesRequestFilter.q = '';
        this.activeRoute.queryParams.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["take"])(1)).subscribe(function (params) {
            if (params.from && params.to) {
                _this.from = params.from;
                _this.to = params.to;
                _this.getDetailedsalesRequestFilter.from = _this.from;
                _this.getDetailedsalesRequestFilter.to = _this.to;
            }
        });
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
        this.getCurrentMonthYear();
        this.SalesRegisteDetailedResponse$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            if (res) {
                _this.SalesRegisteDetailedItems = res;
                _.map(_this.SalesRegisteDetailedItems.items, function (obj) {
                    obj.date = _this.getDateToDMY(obj.date);
                });
                if (_this.voucherNumberInput.value) {
                    setTimeout(function () {
                        _this.invoiceSearch.nativeElement.focus();
                    }, 200);
                }
            }
            setTimeout(function () { _this.detectChange(); }, 200);
        });
        this.voucherNumberInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.getDetailedsalesRequestFilter.sort = null;
            _this.getDetailedsalesRequestFilter.sortBy = null;
            _this.getDetailedsalesRequestFilter.q = s;
            _this.getDetailedSalesReport(_this.getDetailedsalesRequestFilter);
            if (s === '') {
                _this.showSearchInvoiceNo = false;
            }
        });
    };
    SalesRegisterExpandComponent.prototype.getDetailedSalesReport = function (SalesDetailedfilter) {
        var _this = this;
        setTimeout(function () { _this.detectChange(); }, 200);
        this.store.dispatch(this.invoiceReceiptActions.GetSalesRegistedDetails(SalesDetailedfilter));
    };
    SalesRegisterExpandComponent.prototype.pageChanged = function (ev) {
        if (ev.page === this.getDetailedsalesRequestFilter.page) {
            return;
        }
        this.getDetailedsalesRequestFilter.page = ev.page;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    };
    SalesRegisterExpandComponent.prototype.sortbyApi = function (key, ord) {
        this.getDetailedsalesRequestFilter.sortBy = key;
        this.getDetailedsalesRequestFilter.sort = ord;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    };
    /**
    * emitExpand
    */
    SalesRegisterExpandComponent.prototype.emitExpand = function () {
        this.expand = !this.expand;
    };
    SalesRegisterExpandComponent.prototype.columnFilter = function (event, column) {
        if (event && column) {
            this.showFieldFilter[column] = event;
        }
    };
    SalesRegisterExpandComponent.prototype.hideListItems = function () {
        if (this.filterDropDownList.isOpen) {
            this.filterDropDownList.hide();
        }
    };
    SalesRegisterExpandComponent.prototype.goToDashboard = function (val) {
        if (val) {
            this.router.navigate(['/pages/reports']);
        }
        else {
            this.router.navigate(['/pages/reports', 'reports-details']);
        }
    };
    SalesRegisterExpandComponent.prototype.getDateToDMY = function (selecteddate) {
        var date = selecteddate.split('-');
        if (date.length === 3) {
            var month = this.monthNames[parseInt(date[1]) - 1].substr(0, 3);
            var year = date[2].substr(2, 4);
            return date[0] + ' ' + month + ' ' + year;
        }
        else {
            return selecteddate;
        }
    };
    SalesRegisterExpandComponent.prototype.getCurrentMonthYear = function () {
        var _this = this;
        var currentYearFrom = this.from.split('-')[2];
        var currentYearTo = this.to.split('-')[2];
        var idx = this.from.split('-');
        this.monthYear = [];
        if (currentYearFrom === currentYearTo) {
            this.monthNames.forEach(function (element) {
                _this.monthYear.push(element + ' ' + currentYearFrom);
            });
        }
        this.selectedMonth = this.monthYear[parseInt(idx[1]) - 1];
    };
    SalesRegisterExpandComponent.prototype.selectedFilterMonth = function (monthYridx, i) {
        var date = this.getDateFromMonth(i);
        this.getDetailedsalesRequestFilter.from = date.firstDay;
        this.getDetailedsalesRequestFilter.to = date.lastDay;
        this.getDetailedsalesRequestFilter.q = '';
        this.selectedMonth = monthYridx;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    };
    SalesRegisterExpandComponent.prototype.getDateFromMonth = function (selectedMonth) {
        var mdyFrom = this.from.split('-');
        var mdyTo = this.to.split('-');
        var startDate;
        if (mdyFrom[1] > selectedMonth) {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyTo[2];
        }
        else {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyFrom[2];
        }
        var startDateSplit = startDate.split('-');
        var dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        var month = (dt.getMonth() + 1).toString(), year = dt.getFullYear();
        // GET THE FIRST AND LAST DATE OF THE MONTH.
        //let firstDay = new Date(year, month , 0).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
        //let lastDay = new Date(year, month + 1, 1).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        var firstDay = '01-' + (month) + '-' + year;
        var lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;
        return { firstDay: firstDay, lastDay: lastDay };
    };
    SalesRegisterExpandComponent.prototype.toggleSearch = function (fieldName) {
        var _this = this;
        if (fieldName === 'invoiceNumber') {
            this.showSearchInvoiceNo = true;
            // this.showSearchCustomer = false;
            setTimeout(function () {
                _this.invoiceSearch.nativeElement.focus();
            }, 200);
        }
        // else if (fieldName === 'customerUniqueName') {
        //   this.showSearchCustomer = true;
        //   this.showSearchInvoiceNo = false;
        //   setTimeout(() => {
        //     this.customerSearch.nativeElement.focus();
        //   }, 200);
        // }
        else {
            this.showSearchInvoiceNo = false;
            // this.showSearchCustomer = false;
        }
        this.detectChange();
    };
    SalesRegisterExpandComponent.prototype.clickedOutsideEvent = function () {
        this.showSearchInvoiceNo = false;
    };
    SalesRegisterExpandComponent.prototype.detectChange = function () {
        if (!this._cd['destroyed']) {
            this._cd.detectChanges();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('invoiceSearch'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesRegisterExpandComponent.prototype, "invoiceSearch", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('filterDropDownList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["BsDropdownDirective"])
    ], SalesRegisterExpandComponent.prototype, "filterDropDownList", void 0);
    SalesRegisterExpandComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sales-register-expand',
            template: __webpack_require__(/*! ./sales.register.expand.component.html */ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.html"),
            styles: [__webpack_require__(/*! ./sales.register.expand.component.scss */ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_3__["InvoiceReceiptActions"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]])
    ], SalesRegisterExpandComponent);
    return SalesRegisterExpandComponent;
}());



/***/ }),

/***/ "./src/app/reports/reports.component.ts":
/*!**********************************************!*\
  !*** ./src/app/reports/reports.component.ts ***!
  \**********************************************/
/*! exports provided: ReportsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsComponent", function() { return ReportsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ReportsComponent = /** @class */ (function () {
    function ReportsComponent() {
    }
    ReportsComponent.prototype.ngOnInit = function () {
    };
    ReportsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'reports',
            //templateUrl: './reports.component.html',
            template: '<router-outlet></router-outlet>',
            styles: [__webpack_require__(/*! ./components/report-dashboard/reports.dashboard.component.scss */ "./src/app/reports/components/report-dashboard/reports.dashboard.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ReportsComponent);
    return ReportsComponent;
}());



/***/ }),

/***/ "./src/app/reports/reports.module.ts":
/*!*******************************************!*\
  !*** ./src/app/reports/reports.module.ts ***!
  \*******************************************/
/*! exports provided: ReportsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsModule", function() { return ReportsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _reports_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reports.routing.module */ "./src/app/reports/reports.routing.module.ts");
/* harmony import */ var _reports_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reports.component */ "./src/app/reports/reports.component.ts");
/* harmony import */ var _components_report_details_components_report_details_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/report-details-components/report.details.component */ "./src/app/reports/components/report-details-components/report.details.component.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var _components_report_graph_component_report_graph_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/report-graph-component/report.graph.component */ "./src/app/reports/components/report-graph-component/report.graph.component.ts");
/* harmony import */ var _components_report_table_components_report_table_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/report-table-components/report.table.component */ "./src/app/reports/components/report-table-components/report.table.component.ts");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var angular2_highcharts__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! angular2-highcharts */ "../../node_modules/angular2-highcharts/index.js");
/* harmony import */ var angular2_highcharts__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(angular2_highcharts__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _components_sales_register_component_sales_register_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/sales-register-component/sales.register.component */ "./src/app/reports/components/sales-register-component/sales.register.component.ts");
/* harmony import */ var _components_salesRegister_expand_component_sales_register_expand_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/salesRegister-expand-component/sales.register.expand.component */ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.ts");
/* harmony import */ var _components_sales_register_details_component_sales_register_details_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/sales-register-details-component/sales.register.details.component */ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.ts");
/* harmony import */ var _components_report_dashboard_reports_dashboard_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/report-dashboard/reports.dashboard.component */ "./src/app/reports/components/report-dashboard/reports.dashboard.component.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../shared/helpers/pipes/currencyPipe/currencyType.module */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts");
/* harmony import */ var _theme_account_detail_modal_account_detail_modal_module__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../theme/account-detail-modal/account-detail-modal.module */ "./src/app/theme/account-detail-modal/account-detail-modal.module.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_21__);






















// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
var ReportsModule = /** @class */ (function () {
    function ReportsModule() {
    }
    ReportsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _reports_component__WEBPACK_IMPORTED_MODULE_3__["ReportsComponent"],
                _components_report_details_components_report_details_component__WEBPACK_IMPORTED_MODULE_4__["ReportsDetailsComponent"],
                _components_report_graph_component_report_graph_component__WEBPACK_IMPORTED_MODULE_9__["ReportsGraphComponent"],
                _components_report_table_components_report_table_component__WEBPACK_IMPORTED_MODULE_10__["ReportsTableComponent"],
                _components_sales_register_component_sales_register_component__WEBPACK_IMPORTED_MODULE_13__["SalesRegisterComponent"],
                _components_salesRegister_expand_component_sales_register_expand_component__WEBPACK_IMPORTED_MODULE_14__["SalesRegisterExpandComponent"],
                _components_sales_register_details_component_sales_register_details_component__WEBPACK_IMPORTED_MODULE_15__["SalesRegisterDetailsComponent"],
                _components_report_dashboard_reports_dashboard_component__WEBPACK_IMPORTED_MODULE_16__["ReportsDashboardComponent"]
            ],
            exports: [
                _reports_component__WEBPACK_IMPORTED_MODULE_3__["ReportsComponent"],
                _components_report_details_components_report_details_component__WEBPACK_IMPORTED_MODULE_4__["ReportsDetailsComponent"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__["DatepickerModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_8__["Daterangepicker"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_11__["PaginationModule"]
            ],
            providers: [],
            imports: [
                _reports_routing_module__WEBPACK_IMPORTED_MODULE_2__["ReportsRoutingModule"],
                // NgMultiSelectDropDownModule.forRoot(),
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_5__["BsDatepickerModule"].forRoot(),
                _angular_common__WEBPACK_IMPORTED_MODULE_6__["CommonModule"],
                angular2_highcharts__WEBPACK_IMPORTED_MODULE_12__["ChartModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_11__["PaginationModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_17__["ShSelectModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
                _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_19__["CurrencyModule"],
                _theme_account_detail_modal_account_detail_modal_module__WEBPACK_IMPORTED_MODULE_20__["AccountDetailModalModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_21__["ClickOutsideModule"]
            ]
        })
    ], ReportsModule);
    return ReportsModule;
}());



/***/ }),

/***/ "./src/app/reports/reports.routing.module.ts":
/*!***************************************************!*\
  !*** ./src/app/reports/reports.routing.module.ts ***!
  \***************************************************/
/*! exports provided: ReportsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsRoutingModule", function() { return ReportsRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _reports_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reports.component */ "./src/app/reports/reports.component.ts");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _components_report_details_components_report_details_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/report-details-components/report.details.component */ "./src/app/reports/components/report-details-components/report.details.component.ts");
/* harmony import */ var _components_salesRegister_expand_component_sales_register_expand_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/salesRegister-expand-component/sales.register.expand.component */ "./src/app/reports/components/salesRegister-expand-component/sales.register.expand.component.ts");
/* harmony import */ var _components_report_dashboard_reports_dashboard_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/report-dashboard/reports.dashboard.component */ "./src/app/reports/components/report-dashboard/reports.dashboard.component.ts");
/* harmony import */ var _components_sales_register_details_component_sales_register_details_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/sales-register-details-component/sales.register.details.component */ "./src/app/reports/components/sales-register-details-component/sales.register.details.component.ts");









var ReportsRoutingModule = /** @class */ (function () {
    function ReportsRoutingModule() {
    }
    ReportsRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '',
                        canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]],
                        component: _reports_component__WEBPACK_IMPORTED_MODULE_3__["ReportsComponent"],
                        children: [
                            { path: '', redirectTo: 'reports-dashboard', pathMatch: 'full' },
                            { path: 'reports-details', component: _components_report_details_components_report_details_component__WEBPACK_IMPORTED_MODULE_5__["ReportsDetailsComponent"] },
                            { path: 'sales-detailed', component: _components_sales_register_details_component_sales_register_details_component__WEBPACK_IMPORTED_MODULE_8__["SalesRegisterDetailsComponent"] },
                            { path: 'sales-detailed-expand', component: _components_salesRegister_expand_component_sales_register_expand_component__WEBPACK_IMPORTED_MODULE_6__["SalesRegisterExpandComponent"] },
                            { path: 'reports-dashboard', component: _components_report_dashboard_reports_dashboard_component__WEBPACK_IMPORTED_MODULE_7__["ReportsDashboardComponent"] }
                        ]
                    }
                ]),
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], ReportsRoutingModule);
    return ReportsRoutingModule;
}());



/***/ })

}]);