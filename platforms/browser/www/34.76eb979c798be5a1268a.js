(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ "./src/app/models/api-models/new-vs-old-invoices.ts":
/*!**********************************************************!*\
  !*** ./src/app/models/api-models/new-vs-old-invoices.ts ***!
  \**********************************************************/
/*! exports provided: NewVsOldInvoicesRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewVsOldInvoicesRequest", function() { return NewVsOldInvoicesRequest; });
var NewVsOldInvoicesRequest = /** @class */ (function () {
    function NewVsOldInvoicesRequest() {
    }
    return NewVsOldInvoicesRequest;
}());



/***/ }),

/***/ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.html":
/*!************************************************************************!*\
  !*** ./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n    <div class=\"top_bar clearfix\">\n        <div class=\"form-inline\">\n\n            <form #carried=\"ngForm\" (ngSubmit)=\"go(carried)\">\n                <div class=\"pull-left\">\n                    <div class=\"form-group mrR1 max500\">\n                        <label>Select Year</label>\n                        <sh-select placeholder=\"Search Year...\" [multiple]='false' name=\"selectedYear\" [(ngModel)]=\"selectedYear\" #SelectYear=\"ngModel\" [options]=\"yearOptions\" required></sh-select>\n                        <div class=\"h-25px\" style=\"color: red;\">\n                            <!--<div *ngIf=\"SelectYear.invalid\">please select year</div>-->\n                        </div>\n                    </div>\n\n\n                    <div class=\"form-group mrR1 max500\">\n                        <label>Select Type</label>\n                        <sh-select placeholder=\"Search Type...\" [multiple]='false' name=\"selectedType\" [(ngModel)]=\"selectedType\" #SelectType=\"ngModel\" [options]=\"GetTypeOptions\" required (selected)=\"ChangingValue($event)\"></sh-select>\n                        <div class=\"h-25px\" style=\"color: red;\">\n                            <div *ngIf=\"SelectType.invalid\">please select type</div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group mrR1 max500\" *ngIf=\"selectedType==='month'\">\n                        <label>Select Month</label>\n                        <sh-select placeholder=\"Search Month...\" [multiple]='false' name=\"selectedmonth\" [(ngModel)]=\"selectedmonth\" #SelectMonth=\"ngModel\" [options]=\"monthOptions\" required [customSorting]=\"customMonthSorting\"></sh-select>\n                        <div class=\"h-25px\" style=\"color: red;\">\n                            <div *ngIf=\"SelectMonth.invalid\">please select month</div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group mrR1 max500\" *ngIf=\"selectedType==='quater'\">\n                        <label>Select Quater</label>\n                        <sh-select placeholder=\"Search Quater...\" [multiple]='false' name=\"selectedQuater\" [(ngModel)]=\"selectedQuater\" #SelectQuater=\"ngModel\" [options]=\"quaterOptions\" required></sh-select>\n                        <div class=\"h-25px\" style=\"color: red;\">\n                            <div *ngIf=\"SelectQuater.invalid\">please select quater</div>\n                        </div>\n                    </div>\n                    <div class=\"btn-group\">\n                        <div style=\"margin-top: 20px\">\n                            <div>\n                                <button class=\"btn btn-success\" type=\"submit\" [disabled]=\"carried.invalid\">\n                  Go\n                </button>\n                            </div>\n                            <div class=\"h-25px\"></div>\n                        </div>\n                    </div>\n                </div>\n            </form>\n\n\n            <!--<div class=\"pull-left\">-->\n            <!--<div class=\"form-group mrR1 max500\">-->\n            <!--<sh-select placeholder=\"Search Year...\" [multiple]='false' name=\"names\" [(ngModel)]=\"selectedYear\"-->\n            <!--[options]=\"yearOptions\"></sh-select>-->\n            <!--</div>-->\n            <!--<div class=\"form-group mrR1 max500\">-->\n            <!--<sh-select placeholder=\"Search type...\" [multiple]='false' name=\"names\" [(ngModel)]=\"selectedType\"-->\n            <!--[options]=\"GetTypeOptions\"></sh-select>-->\n            <!--</div>-->\n            <!--<div class=\"form-group mrR1 max500\" *ngIf=\"selectedType==='month'\">-->\n            <!--<sh-select placeholder=\"Search Month...\" [multiple]='false' name=\"names\" [(ngModel)]=\"selectedmonth\"-->\n            <!--[options]=\"monthOptions\"></sh-select>-->\n            <!--</div>-->\n            <!--<div class=\"form-group mrR1 max500\" *ngIf=\"selectedType==='quater'\">-->\n            <!--<sh-select placeholder=\"Search Quater...\" [multiple]='false' name=\"names\" [(ngModel)]=\"selectedQuater\"-->\n            <!--[options]=\"quaterOptions\"></sh-select>-->\n            <!--</div>-->\n            <!--<div class=\"btn-group\">-->\n            <!--<button class=\"btn btn-success\" type=\"button\" (click)=\"go()\">-->\n            <!--Go-->\n            <!--</button>-->\n            <!--</div>-->\n            <!--</div>-->\n\n        </div>\n    </div>\n\n    <div style=\"display: flex;\" *ngIf=\"selectedType==='month'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{columnName }} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex;\" *ngIf=\"selectedType==='month'\">\n        <div class=\"divTable\" style=\"background-color: #E5E5E5;\">\n            <div>\n                <h3 class=\"h3-heading\">Bifurcation of clients in {{columnName}} </h3>\n            </div>\n            <div class=\"divRow\" style=\"margin: 30px 0\">\n                <div class=\"divCell\" style=\"font-size: 16px;font-weight: bold\">From new Clients</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\" style=\"margin: 30px 0\">\n                <div class=\"divCell\" style=\"font-size: 16px;font-weight: bold\">From old Clients</div>\n                <div class=\"divCell align-end\">{{clientTotal}}</div>\n                <div class=\"divCell align-end\">{{crdTotal}}</div>\n                <div class=\"divCell align-end\">{{invTotal}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex;margin-top: 30px \" *ngIf=\"selectedType==='month'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex;margin-top: 30px\" *ngIf=\"selectedType==='month'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n\n    <div style=\"display: flex;\" *ngIf=\"selectedType==='quater'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{columnName }} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{clientAllTotal}}</div>\n                <div class=\"divCell align-end\">{{totalAmount}}</div>\n                <div class=\"divCell align-end\">{{invoiceCountAll}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex;\" *ngIf=\"selectedType==='quater'\">\n        <div class=\"divTable\" style=\"background-color: #E5E5E5;\">\n            <div>\n                <h3 class=\"h3-heading\">Bifurcation of clients in {{columnName}} </h3>\n            </div>\n            <div class=\"divRow\" style=\"margin: 30px 0\">\n                <div class=\"divCell\" style=\"font-size: 16px;font-weight: bold\">From new Clients</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.newSales.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\" style=\"margin: 30px 0\">\n                <div class=\"divCell\" style=\"font-size: 16px;font-weight: bold\">From old Clients</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.totalSales.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.invoiceCount}}</div>\n            </div>\n            <div class=\"divRow\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.month}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex; margin-top: 30px\" *ngIf=\"selectedType==='quater'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n    <div style=\"display: flex;margin-top: 30px\" *ngIf=\"selectedType==='quater'\">\n        <div class=\"divTable\">\n            <div class=\"headRow\">\n                <div class=\"divCell\">Sales from</div>\n                <div class=\"divCell align-end\">Clients</div>\n                <div class=\"divCell align-end\">Amount</div>\n                <div class=\"divCell align-end\">No.of Invoices</div>\n            </div>\n            <div class=\"divRow\" style=\"font-weight: bold\">\n                <div class=\"divCell\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}} {{selectedYear}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</div>\n                <div class=\"divCell align-end\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.invoiceCount}}</div>\n            </div>\n        </div>\n    </div>\n</div>\n<!--<table class=\"table basic table-bordered\">-->\n<!--<thead>-->\n<!--<tr>-->\n<!--<th colspan=\"3\" class=\"text-center\">Total</th>-->\n<!--<th colspan=\"3\" class=\"text-center\">{{columnName}}(New Customer)</th>-->\n<!--<th colspan=\"4\" class=\"text-center\">Carried</th>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<th [style.width.%]=\"5\">Amt</th>-->\n<!--<th [style.width.%]=\"10\">Inv Count</th>-->\n<!--<th [style.width.%]=\"15\">Customer Count</th>-->\n<!--<th [style.width.%]=\"5\">Amt</th>-->\n<!--<th [style.width.%]=\"10\">Inv Count</th>-->\n<!--<th [style.width.%]=\"15\">Customer Count</th>-->\n<!--<th [style.width.%]=\"5\">Amt</th>-->\n<!--<th [style.width.%]=\"10\">Inv Count</th>-->\n<!--<th [style.width.%]=\"15\">Customer Count</th>-->\n<!--<th [style.width.%]=\"10\">Month</th>-->\n<!--</tr>-->\n<!--</thead>-->\n<!--<tbody>-->\n<!--<tr *ngIf=\"selectedType==='month'\">-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"5\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.totalSales.total}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"10\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.totalSales.invoiceCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"15\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.totalSales.uniqueCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"5\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.newSales.total}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"10\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.newSales.invoiceCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"15\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.newSales.uniqueCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.carriedSales\" [style.width.%]=\"40\" colspan=\"4\"-->\n<!--style=\"vertical-align: top!important; margin: 0px; padding: 0px;\">-->\n<!--<table [style.width.%]=\"100\">-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\">{{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[0]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[1]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[2]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[3]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[3]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[4]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[4]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"></td>-->\n<!--</tr>-->\n<!--<tr style=\"border-top: 1px solid gainsboro;\">-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\">{{ crdTotal }}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{ invTotal }}</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\">Total</td>-->\n<!--</tr>-->\n<!--</table>-->\n<!--</th>-->\n<!--</tr>-->\n\n<!--<tr *ngIf=\"selectedType==='quater'\">-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"5\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.totalSales.total}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"10\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.totalSales.invoiceCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.totalSales\" [style.width.%]=\"15\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.totalSales.uniqueCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"5\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.newSales.total}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"10\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ |-->\n<!--async)?.newSales.invoiceCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.newSales\" [style.width.%]=\"15\"-->\n<!--style=\"vertical-align: top!important;\">-->\n<!--{{(NewVsOldInvoicesData$ | async)?.newSales.uniqueCount}}-->\n<!--</th>-->\n<!--<th [hidden]=\"!(NewVsOldInvoicesData$ | async)?.carriedSales\" [style.width.%]=\"40\" colspan=\"4\"-->\n<!--style=\"vertical-align: top!important; margin: 0px; padding: 0px;\">-->\n<!--<table [style.width.%]=\"100\">-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\">{{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[0]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[0]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[1]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[1]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.total}}</td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ |-->\n<!--async)?.carriedSales[2]?.invoiceCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\">{{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.uniqueCount}}-->\n<!--</td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"> {{(NewVsOldInvoicesData$ | async)?.carriedSales[2]?.month}}</td>-->\n<!--</tr>-->\n<!--<tr>-->\n<!--<td [style.width.%]=\"13.5\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"23.9\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"39\" class=\"pad-8\"></td>-->\n<!--<td [style.width.%]=\"24\" class=\"pad-8\"></td>-->\n<!--</tr>-->\n<!--<tr style=\"border-top: 1px solid gainsboro;\">-->\n<!--<td [style.width.%]=\"13.5\">{{ crdTotal }}</td>-->\n<!--<td [style.width.%]=\"23.9\"> {{ invTotal }}</td>-->\n<!--<td [style.width.%]=\"39\"></td>-->\n<!--<td [style.width.%]=\"24\">Total</td>-->\n<!--</tr>-->\n<!--</table>-->\n<!--</th>-->\n<!--</tr>-->\n<!--</table>-->"

/***/ }),

/***/ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.ts ***!
  \**********************************************************************/
/*! exports provided: NewVsOldInvoicesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewVsOldInvoicesComponent", function() { return NewVsOldInvoicesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_new_vs_old_invoices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/api-models/new-vs-old-invoices */ "./src/app/models/api-models/new-vs-old-invoices.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_new_vs_old_invoices_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/new-vs-old-invoices.actions */ "./src/app/actions/new-vs-old-invoices.actions.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! apps/web-giddh/src/app/models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");










var NewVsOldInvoicesComponent = /** @class */ (function () {
    function NewVsOldInvoicesComponent(store, _NewVsOldInvoicesActions, componentFactoryResolver, _companyActions, _toasty) {
        this.store = store;
        this._NewVsOldInvoicesActions = _NewVsOldInvoicesActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this._companyActions = _companyActions;
        this._toasty = _toasty;
        this.GetTypeOptions = [{ label: 'Month', value: 'month' }, { label: 'Quater', value: 'quater' }];
        this.monthOptions = [{ label: 'January', value: '01' }, { label: 'February', value: '02' }, { label: 'March', value: '03' }, { label: 'April', value: '04' }, { label: 'May', value: '05' }, { label: 'June', value: '06' }, { label: 'July', value: '07' }, { label: 'August', value: '08' }, { label: 'September', value: '09' }, { label: 'October', value: '10' }, { label: 'November', value: '11' }, { label: 'December', value: '12' }];
        this.quaterOptions = [{ label: 'Q1', value: '01' }, { label: 'Q2', value: '02' }, { label: 'Q3', value: '03' }, { label: 'Q4', value: '04' }];
        this.selectedQuater = '';
        this.yearOptions = [{ label: '2014', value: '2014' }, { label: '2015', value: '2015' }, { label: '2016', value: '2016' }, { label: '2017', value: '2017' }, { label: '2018', value: '2018' }, { label: '2019', value: '2019' }, { label: '2020', value: '2020' }];
        this.columnName = '';
        this.crdTotal = 0;
        this.invTotal = 0;
        this.clientTotal = 0;
        this.newSalesClientTotal = 0;
        this.totalSalesClientTotal = 0;
        this.clientAllTotal = 0;
        this.newSalesAmount = 0;
        this.totalSalesAmount = 0;
        this.totalAmount = 0;
        this.newSalesInvCount = 0;
        this.totalSalesInvCount = 0;
        this.invoiceCountAll = 0;
        this.searchFilterData = null;
        this.NewVsOldInvoicesQueryRequest = new _models_api_models_new_vs_old_invoices__WEBPACK_IMPORTED_MODULE_2__["NewVsOldInvoicesRequest"]();
        this.NewVsOldInvoicesData$ = this.store.select(function (s) { return s.newVsOldInvoices.data; });
        this.isRequestSuccess$ = this.store.select(function (s) { return s.newVsOldInvoices.requestInSuccess; });
    }
    NewVsOldInvoicesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_9__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new apps_web_giddh_src_app_models_api_models_Company__WEBPACK_IMPORTED_MODULE_8__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'new-vs-old-invoices';
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.isRequestSuccess$.subscribe(function (s) {
            if (s) {
                if (_this.NewVsOldInvoicesQueryRequest.type === 'month' && _this.selectedmonth) {
                    _this.columnName = _this.monthOptions.find(function (f) { return f.value === _this.selectedmonth; }).label;
                }
                else if (_this.NewVsOldInvoicesQueryRequest.type === 'quater' && _this.selectedQuater) {
                    _this.columnName = _this.quaterOptions.find(function (f) { return f.value === _this.selectedQuater; }).label;
                }
            }
        });
        this.NewVsOldInvoicesData$.subscribe(function (s) {
            if (s) {
                _this.crdTotal = s.carriedSales.reduce(function (p, c) {
                    return p + c.total;
                }, 0);
                _this.invTotal = s.carriedSales.reduce(function (p, c) {
                    return p + c.invoiceCount;
                }, 0);
                _this.clientTotal = s.carriedSales.reduce(function (p, c) {
                    return p + c.uniqueCount;
                }, 0);
                _this.newSalesClientTotal = s.newSales.uniqueCount;
                _this.totalSalesClientTotal = s.totalSales.uniqueCount;
                // this.clientAllTotal = this.clientTotal + this.newSalesClientTotal + this.totalSalesClientTotal;
                _this.clientAllTotal = s.totalSales.uniqueCount;
                _this.newSalesAmount = s.newSales.total;
                _this.totalSalesAmount = s.totalSales.total;
                // this.totalAmount = this.crdTotal + this.newSalesAmount + this.totalSalesAmount;
                _this.totalAmount = s.totalSales.total;
                _this.newSalesInvCount = s.newSales.invoiceCount;
                _this.totalSalesInvCount = s.totalSales.invoiceCount;
                // this.invoiceCountAll = this.invTotal + this.newSalesInvCount + this.totalSalesInvCount;
                _this.invoiceCountAll = s.totalSales.invoiceCount;
            }
            else {
                _this.clientAllTotal = 0;
                _this.totalAmount = 0;
                _this.invoiceCountAll = 0;
            }
        });
        this.selectedYear = (new Date()).getFullYear().toString();
    };
    NewVsOldInvoicesComponent.prototype.ChangingValue = function (event) {
        this.selectedmonth = null;
        this.selectedQuater = null;
        this.store.dispatch(this._NewVsOldInvoicesActions.GetResponseNull());
    };
    NewVsOldInvoicesComponent.prototype.go = function (form) {
        // if (!this.selectedYear) {
        //   this.showErrorToast('please select year');
        //   return;
        // }
        //
        // if (!this.selectedType) {
        //   this.showErrorToast('please select type');
        //   return;
        // }
        //
        // if (this.selectedType && this.selectedType === 'month' && !(this.selectedmonth)) {
        //   this.showErrorToast('please select month');
        //   return;
        // }
        //
        // if (this.selectedType && this.selectedType === 'quater' && !(this.selectedQuater)) {
        //   this.showErrorToast('please select quater');
        //   return;
        // }
        this.NewVsOldInvoicesQueryRequest.type = this.selectedType;
        if (this.NewVsOldInvoicesQueryRequest.type === 'month') {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        }
        else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }
        this.store.dispatch(this._NewVsOldInvoicesActions.GetNewVsOldInvoicesRequest(this.NewVsOldInvoicesQueryRequest));
    };
    NewVsOldInvoicesComponent.prototype.showErrorToast = function (msg) {
        this._toasty.errorToast(msg);
    };
    NewVsOldInvoicesComponent.prototype.ngOnDestroy = function () {
        //
    };
    NewVsOldInvoicesComponent.prototype.customMonthSorting = function (a, b) {
        return (parseInt(a.value) - parseInt(b.value));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('paginationChild'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_5__["ElementViewContainerRef"])
    ], NewVsOldInvoicesComponent.prototype, "paginationChild", void 0);
    NewVsOldInvoicesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'new-vs-old-invoices',
            template: __webpack_require__(/*! ./new-vs-old-Invoices.component.html */ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.html"),
            styles: ["\n    .h-25px {\n      height: 25px;\n    }\n\n    .pad-8 {\n      padding: 8px;\n    }\n\n    .divTable {\n      display: table;\n      width: 50%;\n      background-color: white;\n      padding: 15px 30px;\n    }\n\n    .h3-heading {\n      text-align: center;\n      margin: 20px 0;\n      font-weight: bold;\n      font-size: 20px;\n    }\n\n    .divRow {\n      display: flex;\n      margin-top: 10px;\n      width: auto;\n    }\n\n    .headRow {\n      display: flex;\n    }\n\n    .divCell {\n      float: left;\n      display: table-column;\n      width: 150px;\n      background-color: #ffffff00;\n      font-size: 14px;\n    }\n\n    .align-end {\n      text-align: end;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_new_vs_old_invoices_actions__WEBPACK_IMPORTED_MODULE_4__["NewVsOldInvoicesActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__["CompanyActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"]])
    ], NewVsOldInvoicesComponent);
    return NewVsOldInvoicesComponent;
}());



/***/ }),

/***/ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/new-vs-old-Invoices/new-vs-old-Invoices.module.ts ***!
  \*******************************************************************/
/*! exports provided: NewVsOldInvoicesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewVsOldInvoicesModule", function() { return NewVsOldInvoicesModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _new_vs_old_Invoices_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./new-vs-old-Invoices.component */ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.ts");
/* harmony import */ var _new_vs_old_Invoices_routing_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./new-vs-old-Invoices.routing.module */ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.routing.module.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");












var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var NewVsOldInvoicesModule = /** @class */ (function () {
    function NewVsOldInvoicesModule() {
    }
    NewVsOldInvoicesModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _new_vs_old_Invoices_component__WEBPACK_IMPORTED_MODULE_9__["NewVsOldInvoicesComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_11__["ElementViewChildModule"],
                _new_vs_old_Invoices_routing_module__WEBPACK_IMPORTED_MODULE_10__["NewVsOldInvoicesRoutingModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_4__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__["ShSelectModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["TabsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["BsDropdownModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["TooltipModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_8__["SelectModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["PaginationModule"]
            ],
            providers: []
        })
    ], NewVsOldInvoicesModule);
    return NewVsOldInvoicesModule;
}());



/***/ }),

/***/ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.routing.module.ts":
/*!***************************************************************************!*\
  !*** ./src/app/new-vs-old-Invoices/new-vs-old-Invoices.routing.module.ts ***!
  \***************************************************************************/
/*! exports provided: NewVsOldInvoicesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewVsOldInvoicesRoutingModule", function() { return NewVsOldInvoicesRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _new_vs_old_Invoices_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./new-vs-old-Invoices.component */ "./src/app/new-vs-old-Invoices/new-vs-old-Invoices.component.ts");




var NewVsOldInvoicesRoutingModule = /** @class */ (function () {
    function NewVsOldInvoicesRoutingModule() {
    }
    NewVsOldInvoicesRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{
                        path: '', component: _new_vs_old_Invoices_component__WEBPACK_IMPORTED_MODULE_3__["NewVsOldInvoicesComponent"]
                    }])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], NewVsOldInvoicesRoutingModule);
    return NewVsOldInvoicesRoutingModule;
}());



/***/ })

}]);