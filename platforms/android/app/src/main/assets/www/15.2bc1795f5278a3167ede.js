(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ "../../node_modules/cidr-regex/index.js":
/*!******************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/cidr-regex/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ipRegex = __webpack_require__(/*! ip-regex */ "../../node_modules/ip-regex/index.js");

const v4 = ipRegex.v4().source + "\\/(3[0-2]|[12]?[0-9])";
const v6 = ipRegex.v6().source + "\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])";

const cidr = module.exports = opts => opts && opts.exact ?
  new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
  new RegExp(`(?:${v4})|(?:${v6})`, "g");

cidr.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, "g");
cidr.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, "g");


/***/ }),

/***/ "../../node_modules/ip-regex/index.js":
/*!****************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ip-regex/index.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';

const v6seg = '[0-9a-fA-F]{1,4}';
const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

const ip = module.exports = opts => opts && opts.exact ?
	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
	new RegExp(`(?:${v4})|(?:${v6})`, 'g');

ip.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, 'g');
ip.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, 'g');


/***/ }),

/***/ "../../node_modules/is-cidr/index.js":
/*!***************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/is-cidr/index.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const cidrRegex = __webpack_require__(/*! cidr-regex */ "../../node_modules/cidr-regex/index.js");

const isCidr = module.exports = string => cidrRegex({exact: true}).test(string);
isCidr.v4 = string => cidrRegex.v4({exact: true}).test(string);
isCidr.v6 = string => cidrRegex.v6({exact: true}).test(string);


/***/ }),

/***/ "./src/app/models/api-models/Permission.ts":
/*!*************************************************!*\
  !*** ./src/app/models/api-models/Permission.ts ***!
  \*************************************************/
/*! exports provided: ShareRequestForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShareRequestForm", function() { return ShareRequestForm; });
/**
 * Created by arpit meena on 13-07-2017.
 * Model for create-new-role api request
 * POST call
 * API:: (create-new-role) /company/:companyUniqueName/role
 * used to create new role
 */
var ShareRequestForm = /** @class */ (function () {
    function ShareRequestForm() {
    }
    return ShareRequestForm;
}());



/***/ }),

/***/ "./src/app/models/api-models/settingsTags.ts":
/*!***************************************************!*\
  !*** ./src/app/models/api-models/settingsTags.ts ***!
  \***************************************************/
/*! exports provided: TagRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TagRequest", function() { return TagRequest; });
/**
 * Model for Tag
 */
var TagRequest = /** @class */ (function () {
    function TagRequest() {
        this.name = '';
        this.description = '';
        this.uniqueName = '';
    }
    return TagRequest;
}());



/***/ }),

/***/ "./src/app/settings/Taxes/confirmation/confirmation.model.component.html":
/*!*******************************************************************************!*\
  !*** ./src/app/settings/Taxes/confirmation/confirmation.model.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\">Confirmation </h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n      <div class=\"modal_wrap\">\n        <h3>{{message}}</h3>\n      </div>\n    </form>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"submit\" class=\"btn btn-md btn-success\" (click)=\"onConfirmation()\">Yes</button>\n    <button type=\"submit\" class=\"btn btn-md btn-danger\" (click)=\"onCancel()\">No</button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/Taxes/confirmation/confirmation.model.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/settings/Taxes/confirmation/confirmation.model.component.ts ***!
  \*****************************************************************************/
/*! exports provided: DeleteTaxConfirmationModelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteTaxConfirmationModelComponent", function() { return DeleteTaxConfirmationModelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var DeleteTaxConfirmationModelComponent = /** @class */ (function () {
    function DeleteTaxConfirmationModelComponent() {
        this.userConfirmationEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](false);
    }
    DeleteTaxConfirmationModelComponent.prototype.onConfirmation = function () {
        this.userConfirmationEvent.emit(true);
    };
    DeleteTaxConfirmationModelComponent.prototype.onCancel = function () {
        this.userConfirmationEvent.emit(false);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], DeleteTaxConfirmationModelComponent.prototype, "message", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DeleteTaxConfirmationModelComponent.prototype, "userConfirmationEvent", void 0);
    DeleteTaxConfirmationModelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'delete-tax-confirmation-model',
            template: __webpack_require__(/*! ./confirmation.model.component.html */ "./src/app/settings/Taxes/confirmation/confirmation.model.component.html")
        })
    ], DeleteTaxConfirmationModelComponent);
    return DeleteTaxConfirmationModelComponent;
}());



/***/ }),

/***/ "./src/app/settings/Taxes/setting.taxes.component.html":
/*!*************************************************************!*\
  !*** ./src/app/settings/Taxes/setting.taxes.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\" [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"selectedTax = null;toggleTaxAsidePane()\">\n  <!--  <h1 class=\"section_head pdT0\">Create New Tax</h1>-->\n\n  <!-- region old form -->\n  <!--  <form (ngSubmit)=\"onSubmit(newTaxObj)\" class=\"col-xs-10 row\">-->\n  <!--    <div class=\"row\">-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Select Tax</label><br>-->\n  <!--        <sh-select [forceClearReactive]=\"forceClear$ | async\" [options]=\"taxList\" [isFilterEnabled]=\"false\"-->\n  <!--                   name=\"taxType\" [(ngModel)]=\"newTaxObj.taxType\" [placeholder]=\"'Select Tax'\"-->\n  <!--                   [ItemHeight]=\"33\"></sh-select>-->\n  <!--      </div>-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Unique No.</label><br>-->\n  <!--        <input type=\"text\" [(ngModel)]=\"newTaxObj.taxNumber\" name=\"taxNumber\" placeholder=\"Unique Number\"-->\n  <!--               class=\"form-control\"/>-->\n  <!--      </div>-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Name</label><br>-->\n  <!--        <input type=\"text\" placeholder=\"Name\" [(ngModel)]=\"newTaxObj.name\" name=\"name\" class=\"form-control\"/>-->\n  <!--      </div>-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Linked Account</label><br>-->\n  <!--        <sh-select [forceClearReactive]=\"forceClear$ | async\" [disabled]=\"newTaxObj.taxType != 'others'\"-->\n  <!--                   [isFilterEnabled]=\"true\"-->\n  <!--                   [customFilter]=\"customAccountFilter\" placeholder=\"Select Account\" name=\"account\"-->\n  <!--                   [(ngModel)]=\"newTaxObj.account\" [options]=\"accounts$\"></sh-select>-->\n  <!--      </div>-->\n  <!--    </div>-->\n  <!--    <div class=\"row\">-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>-100 to 100</label><br>-->\n  <!--        <input type=\"number\" [(ngModel)]=\"newTaxObj.taxValue\" name=\"taxValue\" placeholder=\"-100 to 100\" min=\"-100\"-->\n  <!--               max=\"100\" class=\"form-control\"/>-->\n  <!--      </div>-->\n  <!--      &lt;!&ndash;<div class=\"form-group col-xs-3\">-->\n  <!--      <label>Apply Tax From {{newTaxObj.date}}</label><br>-->\n  <!--      <input type=\"date\" [(ngModel)]=\"newTaxObj.date\" name=\"date\" placeholder=\"Date\" class=\"form-control\" />-->\n  <!--      </div>&ndash;&gt;-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Apply Tax From</label>-->\n  <!--        <div class=\"input-group\">-->\n  <!--          &lt;!&ndash; (blur)=\"showFromDatePicker = false;\" &ndash;&gt;-->\n  <!--          <input type=\"text\" name=\"from\" [ngModel]=\"moment(newTaxObj.date).format('DD-MM-YYYY')\"-->\n  <!--                 (focus)=\"showFromDatePicker = true;\" class=\"form-control\" required/>-->\n  <!--          <span class=\"input-group-btn\">-->\n  <!--               <button type=\"button\" class=\"btn btn-default\" (click)=\"showFromDatePicker = !showFromDatePicker\">-->\n  <!--               <i class=\"glyphicon glyphicon-calendar\"></i>-->\n  <!--               </button>-->\n  <!--               </span>-->\n  <!--        </div>-->\n  <!--        <div *ngIf=\"showFromDatePicker\" style=\"position: absolute; z-index:10; min-height:290px;\">-->\n  <!--          <datepicker name=\"fromDate\" [(ngModel)]=\"newTaxObj.date\"-->\n  <!--                      (selectionDone)=\"showFromDatePicker=!showFromDatePicker\" [showWeeks]=\"false\"></datepicker>-->\n  <!--        </div>-->\n  <!--      </div>-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Tax Duration</label><br>-->\n  <!--        <sh-select placeholder=\"Select Duration\" [forceClearReactive]=\"forceClear$ | async\" name=\"duration\"-->\n  <!--                   [(ngModel)]=\"newTaxObj.duration\" [options]=\"duration\" [ItemHeight]=\"33\"></sh-select>-->\n  <!--      </div>-->\n  <!--      <div class=\"form-group col-xs-3\">-->\n  <!--        <label>Tax Filing Date</label>-->\n  <!--        <sh-select placeholder=\"Select Date\" [forceClearReactive]=\"forceClear$ | async\"-->\n  <!--                   [customSorting]=\"customDateSorting\" name=\"duration\" [(ngModel)]=\"newTaxObj.taxFileDate\"-->\n  <!--                   [options]=\"days\" [ItemHeight]=\"33\"></sh-select>-->\n  <!--      </div>-->\n  <!--    </div>-->\n  <!--    <div class=\"row\">-->\n  <!--      <div class=col-xs-12>-->\n  <!--        <button type=\"submit\" class=\"btn btn-success\">Add</button>-->\n  <!--        <button type=\"button\" (click)=\"onCancel()\" class=\"btn btn-danger\">Cancel</button>-->\n  <!--      </div>-->\n  <!--    </div>-->\n  <!--  </form>-->\n  <!-- endregion -->\n\n  <div style=\"display: flex;justify-content: space-between\">\n    <h1 class=\"section_head pdT1\" style=\"margin: 0;padding: 0;line-height: 2;\">Added Taxes</h1>\n    <button class=\"btn btn-success mrR0\" [tooltip]=\"'Create New Tax'\"\n      (click)=\"selectedTax = null;toggleTaxAsidePane($event)\">\n      <i class=\"fa fa-plus\"></i>\n      Add New Tax\n    </button>\n  </div>\n\n  <div class=\"col-xs-12 pdT2\">\n\n    <div class=\"row\">\n\n\n\n      <div class=\"table-responsive\">\n\n        <table class=\"table table-bordered basic mrB onMobileView\">\n\n          <thead>\n            <tr>\n              <th>S. No.</th>\n              <th>Tax#</th>\n              <th>Name</th>\n              <th>Linked Account</th>\n              <th>Applied From</th>\n              <th>Tax Percentage</th>\n              <th>File Date</th>\n              <th>Duration</th>\n              <th>Type</th>\n              <th class=\"text-center\">Action</th>\n              <!--<th>Applied Till</th>-->\n            </tr>\n\n          </thead>\n\n          <tbody *ngIf=\"availableTaxes.length\">\n\n            <tr *ngFor=\"let tax of availableTaxes; let i = index\">\n\n              <td data-title=\"#\">{{i + 1}}</td>\n              <td *ngIf=\"!taxToEdit[i]\" data-title=\"Tax\">{{tax.taxNumber}}</td>\n              <td *ngIf=\"taxToEdit[i]\" data-title=\"Tax\">{{tax.taxNumber}}</td>\n              <td *ngIf=\"!taxToEdit[i]\" data-title=\"Name\">{{tax.name}}</td>\n              <td *ngIf=\"taxToEdit[i]\" data-title=\"Name\">{{tax.name}}</td>\n              <td *ngIf=\"!tax.accounts[0] && !taxToEdit[i]\">--</td>\n              <td *ngIf=\"tax.accounts[0] && !taxToEdit[i]\" data-title=\"Linked Account\">\n                <p *ngFor=\"let acc of tax.accounts;\">\n                  {{acc.name}}\n                </p>\n              </td>\n\n              <td *ngIf=\"tax.accounts[0] && taxToEdit[i]\" data-title=\"Linked Account\">\n                <p *ngFor=\"let acc of availableTaxes[i].accounts; let ind = index\">\n                  <input [disabled]=\"true\" class=\"form-control\" type=\"text\" [(ngModel)]=\"acc.name\"\n                    name=\"acc_0_name{{i}}_{{ind}}\">\n                </p>\n              </td>\n\n              <td *ngIf=\"!tax.taxDetail || !tax.taxDetail.length\">--</td>\n              <td *ngIf=\"tax.taxDetail && tax.taxDetail.length && !taxToEdit[i]\" data-title=\"Applied From\">\n                <div *ngFor=\"let t of tax.taxDetail\">\n                  {{moment(t.date).format('DD-MM-YYYY')}}\n                </div>\n              </td>\n\n              <td *ngIf=\"tax.taxDetail && tax.taxDetail.length && taxToEdit[i]\" data-title=\"Applied From\">\n                <div *ngFor=\"let t of tax.taxDetail; let j = index; let last = last\" class=\"mrB1\">\n                  <!-- <input type=\"text\" class=\"form-control\" [(ngModel)]=\"t.date\" name=\"tax_date_{{i}}_{{j}}\"> -->\n                  <div class=\"input-group\">\n                    <input type=\"text\" [ngModel]=\"moment(t.date).format('DD-MM-YYYY')\" name=\"tax_date_{{i}}_{{j}}\"\n                      (focus)=\"showDatePickerInTable = true;\" class=\"form-control\" required />\n                    <span class=\"input-group-btn\">\n                      <button type=\"button\" class=\"btn btn-default\"\n                        (click)=\"showDatePickerInTable = !showDatePickerInTable\">\n                        <i class=\"glyphicon glyphicon-calendar\"></i>\n                      </button>\n                    </span>\n                  </div>\n\n                  <div *ngIf=\"showDatePickerInTable && taxToEdit[i]\"\n                    style=\"position: absolute; z-index:10; min-height:290px;\">\n                    <datepicker name=\"tableDate{{i}}_{{j}}\" [(ngModel)]=\"t.date\"\n                      (selectionDone)=\"showDatePickerInTable=!showDatePickerInTable\" [showWeeks]=\"false\"></datepicker>\n                  </div>\n                </div>\n              </td>\n\n              <td *ngIf=\"!tax.taxDetail || !tax.taxDetail.length\">--</td>\n\n              <td *ngIf=\"tax.taxDetail && tax.taxDetail.length && !taxToEdit[i]\" data-title=\"Tax Percentage\">\n                <div *ngFor=\"let t of tax.taxDetail\">\n                  {{t.taxValue}}\n                </div>\n              </td>\n\n              <td *ngIf=\"tax.taxDetail && tax.taxDetail.length && taxToEdit[i]\">\n                <div class=\"input-group mrB1\" *ngFor=\"let t of tax.taxDetail; let j = index; let last = last\">\n                  <input type=\"text\" class=\"form-control\" [(ngModel)]=\"t.taxValue\" name=\"tax_taxValue_{{i}}_{{j}}\">\n                  <span *ngIf=\"!last\" (click)=\"removeDateAndPercentage(i, j)\" class=\"input-group-addon cursor-pointer\">\n                    <i class=\"fa fa-minus cursor-pointer\" aria-hidden=\"true\"></i>\n                  </span>\n                  <span *ngIf=\"last\" (click)=\"addMoreDateAndPercentage(i)\" class=\"input-group-addon cursor-pointer\">\n                    <i class=\"fa fa-plus cursor-pointer\" aria-hidden=\"true\"></i>\n                  </span>\n                </div>\n              </td>\n\n              <td *ngIf=\"!taxToEdit[i]\" data-title=\"File Date\">{{tax.taxFileDate}}</td>\n\n              <td *ngIf=\"taxToEdit[i]\">\n                <div class=\"custom-select pos-rel\">\n                  <sh-select [options]=\"days\" [isFilterEnabled]=\"false\" [(ngModel)]=\"availableTaxes[i].taxFileDate\"\n                    name=\"tfd{{i}}\" [placeholder]=\"'Select'\" [ItemHeight]=\"33\"></sh-select>\n                </div>\n              </td>\n\n              <td data-title=\"Duration\">\n                <div class=\"custom-select pos-rel\">\n                  <sh-select [options]=\"duration\" [disabled]=\"true\" [isFilterEnabled]=\"false\"\n                    [(ngModel)]=\"availableTaxes[i].duration\" name=\"duration{{i}}\" [placeholder]=\"'Select'\"\n                    [ItemHeight]=\"33\"></sh-select>\n                </div>\n              </td>\n\n              <td data-title=\"Type\">{{tax.taxType ? tax.taxType : 'Others'}}</td>\n\n              <td class=\"text-center ico-btn\" data-title=\"Action\">\n\n                <div class=\"d-flex\">\n                  <button (click)=\"selectedTax = tax;toggleTaxAsidePane()\" type=\"button\" class=\"btn btn-xs\">\n                    <i class=\"fa fa-pencil\" aria-hidden=\"true\" tooltip=\"Edit\"></i>\n                  </button>\n\n                  <button *ngIf=\"!taxToEdit[i]\" type=\"button\" class=\"btn btn-xs\" (click)=\"deleteTax(tax);\">\n                    <i class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i>\n                  </button>\n                </div>\n\n                <!--              <button *ngIf=\"taxToEdit[i]\" type=\"button\" class=\"btn btn-xs\"-->\n                <!--                      (click)=\"updateTax(i); taxToEdit[i] = false\">-->\n                <!--                <i class=\"fa fa-check\" aria-hidden=\"true\"-->\n                <!--                   tooltip=\"Save\"></i>-->\n                <!--              </button>-->\n\n                <!--              <button *ngIf=\"taxToEdit[i]\" type=\"button\" class=\"btn btn-xs\"-->\n                <!--                      (click)=\"reloadTaxList(); taxToEdit[i] = false\">-->\n                <!--                <i class=\"fa fa-times\" aria-hidden=\"true\"-->\n                <!--                   tooltip=\"Reset\"></i>-->\n                <!--              </button>-->\n\n              </td>\n            </tr>\n          </tbody>\n          <tbody *ngIf=\"!availableTaxes.length\" class=\"onMobileView noRecords\">\n            <tr>\n              <td colspan=\"10\" class=\"text-center empty_table\">\n                <h1>No Record Found !!</h1>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- region open tax aside -->\n<div class=\"aside-overlay\" *ngIf=\"taxAsideMenuState === 'in'\"></div>\n<aside-menu-create-tax-component [class]=\"taxAsideMenuState\" [tax]=\"selectedTax\" *ngIf=\"taxAsideMenuState === 'in'\"\n  [@slideInOut]=\"taxAsideMenuState\" (closeEvent)=\"toggleTaxAsidePane()\"></aside-menu-create-tax-component>\n<!-- endregion -->\n\n\n<!-- region delete Tax confirmation model -->\n<div bsModal #taxConfirmationModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <!-- modal-liq90 class is removed for now-->\n    <div class=\"modal-content\">\n      <delete-tax-confirmation-model [message]=\"confirmationMessage\" (userConfirmationEvent)=\"userConfirmation($event)\">\n      </delete-tax-confirmation-model>\n    </div>\n  </div>\n</div>\n<!-- endregion -->\n"

/***/ }),

/***/ "./src/app/settings/Taxes/setting.taxes.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/settings/Taxes/setting.taxes.component.ts ***!
  \***********************************************************/
/*! exports provided: SettingTaxesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingTaxesComponent", function() { return SettingTaxesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_settings_taxes_settings_taxes_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/settings/taxes/settings.taxes.action */ "./src/app/actions/settings/taxes/settings.taxes.action.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
















var taxesType = [
    { label: 'GST', value: 'GST' },
    { label: 'InputGST', value: 'InputGST' },
    { label: 'Others', value: 'others' }
];
var taxDuration = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Half-Yearly', value: 'HALFYEARLY' },
    { label: 'Yearly', value: 'YEARLY' }
];
var SettingTaxesComponent = /** @class */ (function () {
    function SettingTaxesComponent(router, store, _companyActions, _accountService, _settingsTaxesActions, _toaster) {
        this.router = router;
        this.store = store;
        this._companyActions = _companyActions;
        this._accountService = _accountService;
        this._settingsTaxesActions = _settingsTaxesActions;
        this._toaster = _toaster;
        this.availableTaxes = [];
        this.newTaxObj = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_10__["TaxResponse"]();
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_8__;
        this.days = [];
        this.records = []; // This array is just for generating dynamic ngModel
        this.taxToEdit = []; // It is for edit toogle
        this.showFromDatePicker = false;
        this.showDatePickerInTable = false;
        this.selectedTax = null;
        this.taxList = taxesType;
        this.duration = taxDuration;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.taxAsideMenuState = 'out';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        for (var i = 1; i <= 31; i++) {
            var day = i.toString();
            this.days.push({ label: day, value: day });
        }
        this.store.dispatch(this._companyActions.getTax());
    }
    SettingTaxesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.select(function (p) { return p.company; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.taxes) {
                _this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["map"](o.taxes, function (tax) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["each"](tax.taxDetail, function (t) {
                        t.date = moment_moment__WEBPACK_IMPORTED_MODULE_8__(t.date, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
                    });
                });
                _this.onCancel();
                _this.availableTaxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o.taxes);
            }
        });
        this.getFlattenAccounts('');
        this.store.select(function (st) { return st.general.addAndManageClosed; }).subscribe(function (bool) {
            if (bool) {
                _this.getFlattenAccounts('');
            }
        });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.isTaxCreatedSuccessfully; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) {
            if (result && _this.taxAsideMenuState === 'in') {
                _this.toggleTaxAsidePane();
            }
        });
    };
    SettingTaxesComponent.prototype.onSubmit = function (data) {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](data);
        dataToSave.taxDetail = [{
                taxValue: dataToSave.taxValue,
                date: dataToSave.date
            }];
        if (dataToSave.taxType === 'others') {
            if (!dataToSave.accounts) {
                dataToSave.accounts = [];
            }
            this.accounts$.forEach(function (obj) {
                if (obj.value === dataToSave.account) {
                    var accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
                }
            });
        }
        dataToSave.date = moment_moment__WEBPACK_IMPORTED_MODULE_8__(dataToSave.date).format('DD-MM-YYYY');
        dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
        dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];
        if (dataToSave.duration) {
            this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
        }
        else {
            this._toaster.errorToast('Please select tax duration.', 'Validation');
        }
    };
    SettingTaxesComponent.prototype.deleteTax = function (taxToDelete) {
        this.newTaxObj = taxToDelete;
        this.selectedTax = this.availableTaxes.find(function (tax) { return tax.uniqueName === taxToDelete.uniqueName; });
        this.confirmationMessage = "Are you sure want to delete " + this.selectedTax.name + "?";
        this.confirmationFor = 'delete';
        this.taxConfirmationModel.show();
    };
    SettingTaxesComponent.prototype.updateTax = function (taxIndex) {
        var selectedTax = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTaxes[taxIndex]);
        this.newTaxObj = selectedTax;
        this.confirmationMessage = "Are you sure want to update " + selectedTax.name + "?";
        this.confirmationFor = 'edit';
        this.taxConfirmationModel.show();
    };
    SettingTaxesComponent.prototype.onCancel = function () {
        this.newTaxObj = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_10__["TaxResponse"]();
    };
    SettingTaxesComponent.prototype.userConfirmation = function (userResponse) {
        this.taxConfirmationModel.hide();
        if (userResponse) {
            if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTaxesActions.DeleteTax(this.newTaxObj.uniqueName));
            }
            else if (this.confirmationFor === 'edit') {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["each"](this.newTaxObj.taxDetail, function (tax) {
                    tax.date = moment_moment__WEBPACK_IMPORTED_MODULE_8__(tax.date).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
                });
                this.store.dispatch(this._settingsTaxesActions.UpdateTax(this.newTaxObj));
            }
        }
    };
    SettingTaxesComponent.prototype.addMoreDateAndPercentage = function (taxIndex) {
        var taxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTaxes);
        taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
        this.availableTaxes = taxes;
    };
    SettingTaxesComponent.prototype.removeDateAndPercentage = function (parentIndex, childIndex) {
        var taxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTaxes);
        taxes[parentIndex].taxDetail.splice(childIndex, 1);
        this.availableTaxes = taxes;
    };
    SettingTaxesComponent.prototype.reloadTaxList = function () {
        var _this = this;
        this.store.select(function (p) { return p.company; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (o) {
            if (o.taxes) {
                _this.onCancel();
                _this.availableTaxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o.taxes);
            }
        });
    };
    SettingTaxesComponent.prototype.getFlattenAccounts = function (value) {
        var _this = this;
        var query = value || '';
        // get flattern accounts
        this._accountService.GetFlattenAccounts(query, '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(100), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var accounts_1 = [];
                data.body.results.map(function (d) {
                    accounts_1.push({ label: d.name + " - (" + d.uniqueName + ")", value: d.uniqueName });
                    // `${d.name} (${d.uniqueName})`
                });
                _this.accounts$ = accounts_1;
            }
        });
    };
    SettingTaxesComponent.prototype.customAccountFilter = function (term, item) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    };
    SettingTaxesComponent.prototype.customDateSorting = function (a, b) {
        return (parseInt(a.label) - parseInt(b.label));
    };
    SettingTaxesComponent.prototype.toggleTaxAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.taxAsideMenuState = this.taxAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    SettingTaxesComponent.prototype.toggleBodyClass = function () {
        if (this.taxAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('taxConfirmationModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_13__["ModalDirective"])
    ], SettingTaxesComponent.prototype, "taxConfirmationModel", void 0);
    SettingTaxesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'setting-taxes',
            template: __webpack_require__(/*! ./setting.taxes.component.html */ "./src/app/settings/Taxes/setting.taxes.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_15__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: ["\n  @media(max-width:768px){\n    .custom-select {\n      width: 120px;\n    }\n    .table-responsive>.table>tbody>tr>td, .table-responsive>.table>tbody>tr>th, .table-responsive>.table>tfoot>tr>td, .table-responsive>.table>tfoot>tr>th, .table-responsive>.table>thead>tr>td, .table-responsive>.table>thead>tr>th {\n    white-space: initial !important;\n}\n.table-responsive{\n  border:none !important;\n  padding: 0 3px;\n}\n.box {\n  padding: 0;\n  background-color: transparent;\n\n  }\n  .basic {\n    background: transparent;\n}\n.col-xs-12.pdT2,.section_head{\n  padding-top:0;\n}\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__["CompanyActions"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_12__["AccountService"],
            _actions_settings_taxes_settings_taxes_action__WEBPACK_IMPORTED_MODULE_11__["SettingsTaxesActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_14__["ToasterService"]])
    ], SettingTaxesComponent);
    return SettingTaxesComponent;
}());



/***/ }),

/***/ "./src/app/settings/Trigger/setting.trigger.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/settings/Trigger/setting.trigger.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n  <h1 class=\"section_head pdT0\">Create New Trigger</h1>\n  <div class=\"row\">\n    <form (ngSubmit)=\"onSubmit(newTriggerObj)\" class=\"col-sm-10 col-xs-12 \">\n      <div class=\"row\">\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Name</label><br>\n          <input type=\"text\" placeholder=\"Name\" autocomplete=\"off\" [(ngModel)]=\"newTriggerObj.name\" name=\"name\"\n            class=\"form-control\" />\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Select Entity Type</label><br>\n          <sh-select (onClear)=\"onResetEntityType()\" (selected)=\"onEntityTypeSelected($event)\"\n            [forceClearReactive]=\"forceClear$ | async\" [options]=\"entityList\" [isFilterEnabled]=\"false\"\n            name=\"entityType\" [(ngModel)]=\"newTriggerObj.entity\" [placeholder]=\"'Select Entity Type'\" [ItemHeight]=\"33\">\n          </sh-select>\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Select Entity</label><br>\n          <sh-select [disabled]=\"!newTriggerObj.entity\" [forceClearReactive]=\"forceClearEntityList$ | async\"\n            [options]=\"entityOptions$ | async\" name=\"entityOptions\" [(ngModel)]=\"newTriggerObj.entityUniqueName\"\n            [placeholder]=\"'Select Entity'\" [ItemHeight]=\"33\"></sh-select>\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Scope</label><br>\n          <sh-select [forceClearReactive]=\"forceClear$ | async\" [isFilterEnabled]=\"true\" placeholder=\"Select Scope\"\n            name=\"scope\" [(ngModel)]=\"newTriggerObj.scope\" [options]=\"scopeList\" (selected)=\"onSelectScope($event)\">\n            <option>selected</option>\n          </sh-select>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Filter</label><br>\n          <sh-select [forceClearReactive]=\"forceClearFilterList$ | async\" [options]=\"filterList\"\n            [isFilterEnabled]=\"true\" name=\"filter\" [(ngModel)]=\"newTriggerObj.filter\" [placeholder]=\"'Select Filter'\"\n            [ItemHeight]=\"33\">\n          </sh-select>\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Action</label><br>\n          <sh-select [forceClearReactive]=\"forceClear$ | async\" [isFilterEnabled]=\"true\" placeholder=\"Select Action\"\n            name=\"action\" [(ngModel)]=\"newTriggerObj.action\" [options]=\"actionList\"></sh-select>\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Value</label><br>\n          <input type=\"number\" [(ngModel)]=\"newTriggerObj.value\" name=\"value\" placeholder=\"Value\" class=\"form-control\"\n            [disabled]=\"newTriggerObj.scope === 'closing balance'\" />\n        </div>\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>URL</label><br>\n          <input type=\"text\" [(ngModel)]=\"newTriggerObj.url\" name=\"url\" placeholder=\"URL\" class=\"form-control\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"form-group col-sm-3 col-xs-12\">\n          <label>Description</label><br>\n          <textarea class=\"form-control\" [(ngModel)]=\"newTriggerObj.description\" name=\"description\"></textarea>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=col-xs-12>\n          <button type=\"submit\" class=\"btn btn-success\">Add</button>\n          <button type=\"button\" (click)=\"onCancel()\" class=\"btn btn-danger\">Cancel</button>\n        </div>\n      </div>\n    </form>\n  </div>\n  <div class=\"col-xs-12 pdT2\">\n    <div class=\"row\">\n      <h1 class=\"section_head pdT1\">Added Triggers</h1>\n      <div class=\"table-responsive\">\n        <table class=\"table table-bordered basic mrB onMobileView\">\n          <thead>\n            <tr>\n              <th>S. No.</th>\n              <th>Name</th>\n              <th>Entity type</th>\n              <th>Entity</th>\n              <th>Scope</th>\n              <th>Filter</th>\n              <th>Action</th>\n              <th>Value</th>\n              <th>URL</th>\n              <th>Description</th>\n              <th class=\"text-center\">Action</th>\n            </tr>\n          </thead>\n          <tbody *ngIf=\"availableTriggers.length\">\n            <tr *ngFor=\"let trigger of availableTriggers; let i = index\">\n              <td data-title=\"S. No.\">{{i+1}}</td>\n              <td data-title=\"Name\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.name}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.name\">\n              </td>\n              <td data-title=\"Entity Type\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.entity}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.entity\">\n              </td>\n              <td data-title=\"Entity\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.entityUniqueName}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.entityUniqueName\">\n              </td>\n              <td data-title=\"Scope\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.scope}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.scope\">\n              </td>\n              <td data-title=\"Filter\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.filter}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.filter\">\n              </td>\n              <td data-title=\"Action\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.action}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.action\">\n              </td>\n              <td data-title=\"Value\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.value}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.value\">\n              </td>\n              <td data-title=\"URL\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.url}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.url\">\n              </td>\n              <td data-title=\"Description\">\n                <span *ngIf=\"!triggerToEdit[i]\">{{trigger.description}}</span>\n                <input *ngIf=\"triggerToEdit[i]\" class=\"form-control\" type=\"text\" name=\"name_{{i}}\"\n                  [(ngModel)]=\"trigger.description\">\n              </td>\n\n              <td class=\"text-center ico-btn\" data-title=\"Action\">\n                <button *ngIf=\"!triggerToEdit[i]\" type=\"button\" class=\"btn btn-xs\"\n                  (click)=\"triggerToEdit = [];triggerToEdit[i] = true\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"\n                    tooltip=\"Edit\"></i></button>\n                <button *ngIf=\"!triggerToEdit[i]\" type=\"button\" class=\"btn btn-xs\" (click)=\"deleteTax(trigger);\"><i\n                    class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i></button>\n                <button *ngIf=\"triggerToEdit[i]\" type=\"button\" class=\"btn btn-xs\"\n                  (click)=\"updateTrigger(i); triggerToEdit[i] = false\"><i class=\"fa fa-check\" aria-hidden=\"true\"\n                    tooltip=\"Save\"></i></button>\n                <button *ngIf=\"triggerToEdit[i]\" type=\"button\" class=\"btn btn-xs\" (click)=\"triggerToEdit[i] = false\"><i\n                    class=\"fa fa-times\" aria-hidden=\"true\" tooltip=\"Reset\"></i></button>\n              </td>\n            </tr>\n          </tbody>\n          <tbody *ngIf=\"!availableTriggers.length\" class=\"onMobileView noRecords\">\n            <tr>\n              <td colspan=\"11\" class=\"text-center empty_table\">\n                <h1>No Record Found !! {{availableTriggers}}</h1>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n\n</div>\n<!-- Trigger Confirmation Model model -->\n<div bsModal #triggerConfirmationModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <!-- modal-liq90 class is removed for now-->\n    <div class=\"modal-content\">\n      <delete-tax-confirmation-model [message]=\"confirmationMessage\" (userConfirmationEvent)=\"userConfirmation($event)\">\n      </delete-tax-confirmation-model>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/Trigger/setting.trigger.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/settings/Trigger/setting.trigger.component.ts ***!
  \***************************************************************/
/*! exports provided: SettingTriggerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingTriggerComponent", function() { return SettingTriggerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_settings_triggers_settings_triggers_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../actions/settings/triggers/settings.triggers.actions */ "./src/app/actions/settings/triggers/settings.triggers.actions.ts");















var entityType = [
    { label: 'Company', value: 'company' },
    { label: 'Group', value: 'group' },
    { label: 'Account', value: 'account' }
];
var actionType = [
    { label: 'Webhook', value: 'webhook' }
];
var filterType = [
    { label: 'Amount Greater Than', value: 'amountGreaterThan' },
    { label: 'Amount Less Than', value: 'amountSmallerThan' },
    { label: 'Amount Equals', value: 'amountEquals' },
    { label: 'Description Equals', value: 'descriptionEquals' },
    { label: 'Add', value: 'add' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' }
];
var scopeList = [
    // G0-1393--Invoive and Entry not implemented from API 
    //{label: 'Invoice', value: 'invoice'},
    //{label: 'Entry', value: 'entry'},
    { label: 'Closing Balance', value: 'closing balance' }
];
var taxDuration = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Half-Yearly', value: 'HALFYEARLY' },
    { label: 'Yearly', value: 'YEARLY' }
];
var SettingTriggerComponent = /** @class */ (function () {
    function SettingTriggerComponent(router, store, _companyActions, _accountService, _settingsTriggersActions, _toaster) {
        this.router = router;
        this.store = store;
        this._companyActions = _companyActions;
        this._accountService = _accountService;
        this._settingsTriggersActions = _settingsTriggersActions;
        this._toaster = _toaster;
        this.availableTriggers = [];
        this.newTriggerObj = {};
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_8__;
        this.days = [];
        this.records = []; // This array is just for generating dynamic ngModel
        this.taxToEdit = []; // It is for edit toogle
        this.showFromDatePicker = false;
        this.showDatePickerInTable = false;
        this.triggerToEdit = []; // It is for edit toogle
        this.entityList = entityType;
        this.filterList = filterType;
        this.actionList = actionType;
        this.scopeList = scopeList;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.forceClearEntityList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.forceClearFilterList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        for (var i = 1; i <= 31; i++) {
            var day = i.toString();
            this.days.push({ label: day, value: day });
        }
        this.store.dispatch(this._settingsTriggersActions.GetTriggers());
    }
    SettingTriggerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.select(function (p) { return p.settings.triggers; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
                _this.availableTriggers = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](o);
            }
        });
        this.getFlattenAccounts('');
        this.store.select(function (state) { return state.general.addAndManageClosed; }).subscribe(function (bool) {
            if (bool) {
                _this.getFlattenAccounts('');
            }
        });
        this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (groups) {
            if (groups) {
                var groupsRes_1 = [];
                groups.map(function (d) {
                    groupsRes_1.push({ label: d.name + " - (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.groups = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](groupsRes_1);
            }
        });
        this.store.select(function (p) { return p.session.companies; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (companies) {
            if (companies) {
                var companiesRes_1 = [];
                companies.map(function (d) {
                    companiesRes_1.push({ label: d.name + " - (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.companies = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](companiesRes_1);
            }
        });
    };
    SettingTriggerComponent.prototype.onSubmit = function (data) {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](data);
        if (!dataToSave.name) {
            this._toaster.errorToast('Please enter trigger name.', 'Validation');
            return;
        }
        if (!dataToSave.entity) {
            this._toaster.errorToast('Please select entity type.', 'Validation');
            return;
        }
        if (!dataToSave.entityUniqueName) {
            this._toaster.errorToast('Please select an entity.', 'Validation');
            return;
        }
        if (!dataToSave.scope) {
            this._toaster.errorToast('Please select a scope.', 'Validation');
            return;
        }
        if (!dataToSave.filter) {
            this._toaster.errorToast('Please select a filter.', 'Validation');
            return;
        }
        if (!dataToSave.action) {
            this._toaster.errorToast('Please select an action.', 'Validation');
            return;
        }
        if (!dataToSave.value && this.newTriggerObj.scope !== 'closing balance') {
            this._toaster.errorToast('Please enter value.', 'Validation');
            return;
        }
        else {
            delete dataToSave['value'];
        }
        if (!dataToSave.url) {
            this._toaster.errorToast('Please enter URL.', 'Validation');
            return;
        }
        this.store.dispatch(this._settingsTriggersActions.CreateTrigger(dataToSave));
    };
    SettingTriggerComponent.prototype.deleteTax = function (taxToDelete) {
        this.newTriggerObj = taxToDelete;
        this.selectedTax = this.availableTriggers.find(function (tax) { return tax.uniqueName === taxToDelete.uniqueName; }).name;
        this.confirmationMessage = "Are you sure want to delete " + this.selectedTax + "?";
        this.confirmationFor = 'delete';
        this.triggerConfirmationModel.show();
    };
    SettingTriggerComponent.prototype.updateTrigger = function (taxIndex) {
        var selectedTrigger = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTriggers[taxIndex]);
        this.newTriggerObj = selectedTrigger;
        this.confirmationMessage = "Are you sure want to update " + selectedTrigger.name + "?";
        this.confirmationFor = 'edit';
        this.triggerConfirmationModel.show();
    };
    SettingTriggerComponent.prototype.onCancel = function () {
        this.newTriggerObj = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_10__["TaxResponse"]();
    };
    SettingTriggerComponent.prototype.userConfirmation = function (userResponse) {
        this.triggerConfirmationModel.hide();
        if (userResponse) {
            if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTriggersActions.DeleteTrigger(this.newTriggerObj.uniqueName));
            }
            else if (this.confirmationFor === 'edit') {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["each"](this.newTriggerObj.taxDetail, function (tax) {
                    tax.date = moment_moment__WEBPACK_IMPORTED_MODULE_8__(tax.date).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
                });
                this.store.dispatch(this._settingsTriggersActions.UpdateTrigger(this.newTriggerObj));
            }
        }
    };
    SettingTriggerComponent.prototype.addMoreDateAndPercentage = function (taxIndex) {
        var taxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTriggers);
        taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
        this.availableTriggers = taxes;
    };
    SettingTriggerComponent.prototype.removeDateAndPercentage = function (parentIndex, childIndex) {
        var taxes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_7__["cloneDeep"](this.availableTriggers);
        taxes[parentIndex].taxDetail.splice(childIndex, 1);
        this.availableTriggers = taxes;
    };
    /**
     *
     */
    SettingTriggerComponent.prototype.getFlattenAccounts = function (value) {
        var _this = this;
        var query = value || '';
        // get flattern accounts
        this._accountService.GetFlattenAccounts(query, '').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(100), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var accounts_1 = [];
                data.body.results.map(function (d) {
                    accounts_1.push({ label: d.name + " - (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.accounts = accounts_1;
            }
        });
    };
    SettingTriggerComponent.prototype.customAccountFilter = function (term, item) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    };
    SettingTriggerComponent.prototype.customDateSorting = function (a, b) {
        return (parseInt(a.label) - parseInt(b.label));
    };
    SettingTriggerComponent.prototype.onEntityTypeSelected = function (ev) {
        this.forceClearEntityList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        if (ev.value === 'account') {
            this.entityOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(this.accounts);
        }
        else if (ev.value === 'group') {
            this.entityOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(this.groups);
        }
        else if (ev.value === 'company') {
            this.entityOptions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(this.companies);
        }
    };
    SettingTriggerComponent.prototype.onResetEntityType = function () {
        this.newTriggerObj.entityType = '';
        this.forceClearEntityList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
    };
    /**
     * onSelectScope
     */
    SettingTriggerComponent.prototype.onSelectScope = function (event) {
        if (event.value === 'closing balance') {
            this.onSelectClosingBalance();
            if ((this.newTriggerObj.filter === 'amountGreaterThan') || (this.newTriggerObj.filter === 'amountSmallerThan')) {
                return;
            }
            else {
                this.forceClearFilterList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
            }
        }
        else {
            this.filterList = filterType;
        }
    };
    SettingTriggerComponent.prototype.onSelectClosingBalance = function () {
        this.filterList = [
            { label: 'Amount Greater Than', value: 'amountGreaterThan' },
            { label: 'Amount Less Than', value: 'amountSmallerThan' },
        ];
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('triggerConfirmationModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["ModalDirective"])
    ], SettingTriggerComponent.prototype, "triggerConfirmationModel", void 0);
    SettingTriggerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'setting-trigger',
            template: __webpack_require__(/*! ./setting.trigger.component.html */ "./src/app/settings/Trigger/setting.trigger.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_9__["CompanyActions"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_11__["AccountService"],
            _actions_settings_triggers_settings_triggers_actions__WEBPACK_IMPORTED_MODULE_14__["SettingsTriggersActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_13__["ToasterService"]])
    ], SettingTriggerComponent);
    return SettingTriggerComponent;
}());



/***/ }),

/***/ "./src/app/settings/branch/branch.component.css":
/*!******************************************************!*\
  !*** ./src/app/settings/branch/branch.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-horizontal .control-label {\n    text-align: left;\n}\n\n.dropdown-menu {\n    padding: 10px;\n    max-height: 162px;\n    overflow-y: scroll;\n}\n\n.dropdown-menu li {\n    margin-bottom: 5px;\n}\n\n.custom-multi-select li {\n    background: #f1f1f1;\n    color: white;\n    margin: 4px;\n    padding: 2px 10px;\n    font-size: 14px;\n    border-radius: 3px;\n    cursor: pointer;\n}\n\n@media(max-width:375px){\n  .grey_clr button.btn.btn-default {\n    margin-left: 0;\n    margin-top: 5px;\n}\n}\n"

/***/ }),

/***/ "./src/app/settings/branch/branch.component.html":
/*!*******************************************************!*\
  !*** ./src/app/settings/branch/branch.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"\" *ngIf=\"!parentCompanyName && (branches$ | async)?.length > 0\">\n  <h3 class=\"section_head mrT2 grey_clr\">Add branch under <strong class=\"primary_clr\">{{ currentBranch }} <span\n        *ngIf=\"currentBranchNameAlias\">( {{currentBranchNameAlias}} )</span></strong> headquarter.\n    <button class=\"btn btn-default mrL1\" (click)=\"openAddBranchModal()\">Add Branch</button>\n  </h3>\n</div>\n\n<div class=\"\" *ngIf=\"(branches$ | async)?.length > 0\">\n  <div class=\"row\">\n    <div class=\"col-sm-6 col-xs-12 branch\" *ngFor=\"let branch of branches$ | async\">\n      <div class=\"box clearfix mrB2\">\n        <div class=\"mrB1 pdB bdrB clearfix pos-rel\">\n          <h1 class=\"fs18 txtCpc\">{{branch.name}} <span *ngIf=\"branch.nameAlias\">({{branch.nameAlias}} )</span> </h1>\n          <!-- <h1 *ngIf=\"branch.nameAlias\" class=\"fs18 txtCpc\">{{branch.name}} ({{branch.nameAlias}} ) </h1> -->\n          <button class=\"pull-right btn btn-default btn-xs pos-abs\"\n            (click)=\"removeBranch(branch.uniqueName, branch.name)\">\n            <i class=\"fa fa-trash-o\"></i> Remove\n          </button>\n        </div>\n        <section class=\"form-horizontal\">\n          <div class=\"form-group\">\n            <label class=\"control-label col-sm-2\">Address</label>\n            <div class=\"col-sm-10\">\n              <input type=\"text\" class=\"form-control\" placeholder=\"Address\" disabled [value]=\"branch.address\" />\n            </div>\n          </div>\n          <div class=\"form-group mrB\">\n            <label class=\"control-label col-sm-2\">GSTIN</label>\n            <div class=\"col-sm-4\">\n              <input type=\"text\" class=\"form-control\" placeholder=\"GSTIN\" disabled\n                [value]=\"branch?.gstDetails[0]?.gstNumber\" />\n            </div>\n          </div>\n          <!-- This feature is not available right now -->\n          <!-- <div class=\"form-group\">\n          <label class=\"control-label col-sm-2\">Sync data to Branches</label>\n          <div class=\"col-sm-10\">\n              <sh-select [placeholder]=\"'Select data to sync'\" [options]=\"dataSyncOption\" [multiple]=\"true\"></sh-select>\n          </div>\n      </div> -->\n        </section>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"container\" *ngIf=\"(branches$ | async)?.length < 1\">\n  <div class=\"col-xs-6 col-xs-offset-3  text-center\">\n    <div class=\"illustration_box\">\n      <img src=\"assets/images/new/branch-Illus.png\" />\n      <div class=\"\" *ngIf=\"!parentCompanyName\">\n        <h3 class=\"lead mrT2 fs18\">Add branch under <strong class=\"primary_clr txtCpc\">{{ currentBranch }} <span\n              *ngIf=\"currentBranchNameAlias\">( {{currentBranchNameAlias}} )</span></strong> headquarter.\n        </h3>\n        <button class=\"btn btn-default mrL1 btn-lg\" (click)=\"openAddBranchModal()\">Add Branch</button>\n      </div>\n      <div class=\"\" *ngIf=\"parentCompanyName\">\n        <h3 class=\"lead mrT2 fs18\">This is a branch of <strong class=\"primary_clr txtCpc\">{{ parentCompanyName\n          }}</strong> headquarter.</h3>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n<!-- add branch modal -->\n<div bsModal #branchModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: true}\" tabindex=\"-1\" class=\"modal fade\"\n  role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header clearfix\">\n        <h3>Add Branch</h3>\n        <span aria-hidden=\"true\" class=\"close\" (click)=\"hideAddBranchModal()\" data-dismiss=\"modal\">×</span>\n      </div>\n      <div style=\"height: 228px;\" class=\"modal-body\">\n        <div>\n          <label>Select companies who are your branch</label>\n          <div class=\"btn-group btn-block\" dropdown>\n            <button dropdownToggle (click)=\"getAllBranches()\" type=\"button\"\n              class=\"form-control text-left btn-block dropdown-toggle\">\n              <span *ngIf=\"!selectedCompaniesUniquename.length\"> Select Branch </span><span\n                *ngIf=\"selectedCompaniesUniquename.length\">{{selectedCompaniesUniquename.length}} selected</span><span\n                class=\"select_drop pull-right mrT1\"><i class=\"fa fa-caret-down\"></i></span>\n            </button>\n            <ul *dropdownMenu class=\"dropdown-menu width100\" role=\"menu\">\n              <li>\n                <input type=\"checkbox\" (click)=\"selectAllCompanies($event)\" [checked]=\"isAllSelected$ | async\" /> Select\n                all\n              </li>\n              <li *ngFor=\"let cmp of companies$ | async\">\n                <input type=\"checkbox\" [checked]=\"selectedCompaniesUniquename.indexOf(cmp.uniqueName) !== -1\"\n                  (click)=\"checkUncheckMe(cmp, $event)\" /> {{cmp.name}} <span *ngIf=\"cmp.nameAlias\">\n                  ({{cmp.nameAlias}})</span>\n              </li>\n            </ul>\n\n\n          </div>\n        </div>\n        <div style=\"margin-top: 5px;\">\n          <ul class=\"list-inline custom-multi-select\">\n            <li *ngFor=\"let cmp of selectedCompaniesName\">\n              <a style=\"color: gray\">\n                {{cmp.name}} <span *ngIf=\"cmp.nameAlias\"> ({{cmp.nameAlias}})</span><span class=\"pdL\"\n                  (click)=\"checkUncheckMe(cmp,$event)\">×</span>\n              </a>\n            </li>\n\n          </ul>\n\n        </div>\n        <div>\n          <span>Or</span>\n          <button class=\"btn-link\" (click)=\"openCreateCompanyModal()\">Create Branch</button>\n        </div>\n      </div>\n      <div class=\"modal-footer clearfix\">\n        <button (click)=\"createBranches()\" class=\"btn btn-sm btn-success\">Save</button>\n        <button (click)=\"hideAddBranchModal()\" class=\"btn btn-sm btn-danger\">Cancel</button>\n      </div>\n      <!-- modal footer -->\n    </div>\n  </div>\n</div>\n\n<!--add company modal  -->\n\n\n<div bsModal #addCompanyModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: 'true'}\" tabindex=\"-1\"\n  class=\"modal fade openPoup\" role=\"dialog\" (onHidden)=\"onHide()\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <ng-template element-view-container-ref #companyadd=elementviewcontainerref>\n      </ng-template>\n    </div>\n  </div>\n</div>\n\n\n<!-- add branch modal -->\n<div bsModal #confirmationModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: 'true'}\" tabindex=\"-1\"\n  class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header clearfix\">\n        <h3>Confirmation</h3>\n        <span aria-hidden=\"true\" class=\"close\" (click)=\"onUserConfirmation(false)\" data-dismiss=\"modal\">×</span>\n      </div>\n      <div class=\"modal-body\" [innerHTML]=\"confirmationMessage\">\n      </div>\n      <div class=\"modal-footer clearfix\">\n        <button (click)=\"onUserConfirmation(true)\" class=\"btn btn-sm btn-success\">Yes</button>\n        <button (click)=\"onUserConfirmation(false)\" class=\"btn btn-sm btn-danger\">No</button>\n      </div>\n      <!-- modal footer -->\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/branch/branch.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/settings/branch/branch.component.ts ***!
  \*****************************************************/
/*! exports provided: IsyncData, BranchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsyncData", function() { return IsyncData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BranchComponent", function() { return BranchComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_header_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/header/components */ "./src/app/shared/header/components/index.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");













var IsyncData = [
    { label: 'Debtors', value: 'debtors' },
    { label: 'Creditors', value: 'creditors' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Taxes', value: 'taxes' },
    { label: 'Bank', value: 'bank' }
];
var BranchComponent = /** @class */ (function () {
    function BranchComponent(store, settingsBranchActions, componentFactoryResolver, companyActions, settingsProfileActions) {
        var _this = this;
        this.store = store;
        this.settingsBranchActions = settingsBranchActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this.companyActions = companyActions;
        this.settingsProfileActions = settingsProfileActions;
        this.dataSyncOption = IsyncData;
        this.currentBranch = null;
        this.currentBranchNameAlias = null;
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.confirmationMessage = '';
        this.parentCompanyName = null;
        this.selectedBranch = null;
        this.isBranch = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["isEmpty"](o)) {
                var companyInfo = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](o);
                _this.currentBranch = companyInfo.name;
                _this.currentBranchNameAlias = companyInfo.nameAlias;
            }
        });
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_3__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.settings.branches; }, function (state) { return state.settings.parentCompany; }], function (companies, branches, parentCompany) {
            if (branches) {
                if (branches.results.length) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](branches.results, function (branch) {
                        if (branch.gstDetails && branch.gstDetails.length) {
                            branch.gstDetails = [_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["find"](branch.gstDetails, function (gst) { return gst.addressList && gst.addressList[0] && gst.addressList[0].isDefault; })];
                        }
                    });
                    _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["orderBy"](branches.results, 'name'));
                }
                else if (branches.results.length === 0) {
                    _this.branches$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
                }
            }
            if (companies && companies.length && branches) {
                var companiesWithSuperAdminRole_1 = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](companies, function (cmp) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](cmp.userEntityRoles, function (company) {
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
                _this.companies$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["orderBy"](companiesWithSuperAdminRole_1, 'name'));
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
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe();
    }
    BranchComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('branch component');
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.session.createBranchUserStoreRequestObj; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            if (res) {
                if (res.isBranch) {
                    _this.isBranch = res.isBranch;
                }
            }
        });
    };
    BranchComponent.prototype.ngAfterViewInit = function () {
        if (this.isBranch) {
            this.openCreateCompanyModal();
        }
    };
    BranchComponent.prototype.openCreateCompanyModal = function () {
        this.loadAddCompanyComponent();
        this.hideAddBranchModal();
        this.addCompanyModal.show();
    };
    BranchComponent.prototype.hideAddCompanyModal = function () {
        this.addCompanyModal.hide();
    };
    BranchComponent.prototype.hideCompanyModalAndShowAddAndManage = function () {
        this.addCompanyModal.hide();
    };
    BranchComponent.prototype.loadAddCompanyComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_shared_header_components__WEBPACK_IMPORTED_MODULE_9__["CompanyAddComponent"]);
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
    BranchComponent.prototype.openAddBranchModal = function () {
        this.branchModal.show();
    };
    BranchComponent.prototype.onHide = function () {
        console.log('creat company modal is closed.');
        // let companyUniqueName = null;
        // this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
        // let stateDetailsRequest = new StateDetailsRequest();
        // stateDetailsRequest.companyUniqueName = companyUniqueName;
        // stateDetailsRequest.lastState = 'settings';
        // this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    BranchComponent.prototype.hideAddBranchModal = function () {
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        this.branchModal.hide();
    };
    BranchComponent.prototype.selectAllCompanies = function (ev) {
        var _this = this;
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        if (ev.target.checked) {
            this.companies$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (companies) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](companies, function (company) {
                    _this.selectedCompaniesUniquename.push(company.uniqueName);
                    _this.selectedCompaniesName.push(company);
                });
            });
        }
        this.isAllCompaniesSelected();
    };
    BranchComponent.prototype.checkUncheckMe = function (cmp, ev) {
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
    BranchComponent.prototype.createBranches = function () {
        var dataToSend = { childCompanyUniqueNames: this.selectedCompaniesUniquename };
        this.store.dispatch(this.settingsBranchActions.CreateBranches(dataToSend));
        this.hideAddBranchModal();
    };
    BranchComponent.prototype.removeBranch = function (branchUniqueName, companyName) {
        this.selectedBranch = branchUniqueName;
        this.confirmationMessage = "Are you sure want to remove <b>" + companyName + "</b>?";
        this.confirmationModal.show();
    };
    BranchComponent.prototype.onUserConfirmation = function (yesOrNo) {
        if (yesOrNo && this.selectedBranch) {
            this.store.dispatch(this.settingsBranchActions.RemoveBranch(this.selectedBranch));
        }
        else {
            this.selectedBranch = null;
        }
        this.confirmationModal.hide();
    };
    BranchComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    BranchComponent.prototype.getAllBranches = function () {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
    };
    BranchComponent.prototype.isAllCompaniesSelected = function () {
        var _this = this;
        this.companies$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (companies) {
            if (companies.length === _this.selectedCompaniesUniquename.length) {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(true);
            }
            else {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('branchModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["ModalDirective"])
    ], BranchComponent.prototype, "branchModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('addCompanyModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["ModalDirective"])
    ], BranchComponent.prototype, "addCompanyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('companyadd'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_10__["ElementViewContainerRef"])
    ], BranchComponent.prototype, "companyadd", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('confirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["ModalDirective"])
    ], BranchComponent.prototype, "confirmationModal", void 0);
    BranchComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'setting-branch',
            template: __webpack_require__(/*! ./branch.component.html */ "./src/app/settings/branch/branch.component.html"),
            providers: [{ provide: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["BsDropdownConfig"], useValue: { autoClose: false } }],
            styles: [__webpack_require__(/*! ./branch.component.css */ "./src/app/settings/branch/branch.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_12__["SettingsBranchActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ComponentFactoryResolver"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_11__["CompanyActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_7__["SettingsProfileActions"]])
    ], BranchComponent);
    return BranchComponent;
}());



/***/ }),

/***/ "./src/app/settings/bunch/bunch.component.css":
/*!****************************************************!*\
  !*** ./src/app/settings/bunch/bunch.component.css ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-horizontal .control-label {\n  text-align: left;\n}\n\n.dropdown-menu {\n  padding: 10px;\n  max-height: 200px;\n  overflow-y: scroll;\n}\n\n.dropdown-menu li {\n  margin-bottom: 5px;\n}\n\n.bunch_list li {\n  position: relative;\n  padding: 5px 15px;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n\n.bunch_list li:hover {\n  color: #ff5e01;\n  background: #f4f5f8;\n}\n\n.company_action {\n  right: 15px;\n  top: 50%;\n  opacity: 0;\n  z-index: -1;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n\n.bunch_parent .panel-body {\n  /* height: 245px;\n  max-height: 245px; */\n  overflow: auto;\n  padding: 0;\n  padding-bottom: 52px;\n}\n\n.bunch_parent {\n  position: relative;\n}\n\n.footer-btn {\n  bottom: 0;\n  padding: 10px 15px;\n  width: 100%;\n  text-align: right;\n  right: 0;\n  left: 0;\n  background: #f4f5f8;\n}\n\n.bunch_list li:hover .company_action {\n  z-index: 1;\n  opacity: 1;\n}\n\n.btn-link {\n  padding-left: 0;\n}\n"

/***/ }),

/***/ "./src/app/settings/bunch/bunch.component.html":
/*!*****************************************************!*\
  !*** ./src/app/settings/bunch/bunch.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"clearfix mrT2\">\n  <h3 class=\"section_head inline\">Groups</h3>\n  <button class=\"btn btn-primary mrL1\" (click)=\"openAddBunchModal()\">Create Group</button>\n</div>\n\n<div class=\"row mrT2\">\n  <div class=\"col-xs-3\" *ngFor=\"let bunch of allBunches; let i = index; let l = last\">\n    <div class=\"box bunch_parent clearfix\">\n      <div class=\"\">\n        <!--  -->\n        <div (click)=\"getBunchCompany(bunch)\" class=\"cp\">{{bunch.name}}</div>\n        <div class=\"text-right clearfix\">\n          <button type=\"button\" class=\"btn btn-link pull-left\" (click)=\"openAddCompanyModal(bunch)\">+ Add Company\n          </button>\n          <button type=\"button\" class=\"btn btn-xs\" (click)=\"update(bunch)\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"\n                                                                              tooltip=\"Edit\"></i> Edit\n          </button>\n          <button type=\"button\" class=\"btn btn-xs\" (click)=\"deleteBunch(bunch.uniqueName)\"><i class=\"fa fa-trash\"\n                                                                                              aria-hidden=\"true\"\n                                                                                              tooltip=\"Delete\"></i>\n            Delete\n          </button>\n        </div>\n      </div>\n      <!-- <div class=\"panel-body\">\n          <perfect-scrollbar class=\"scrClass\" wheel-propagation=\"true\" wheel-speed=\"1\" min-scrollbar-length=\"0\" [scrollIndicators]=\"true\">\n              <ul class=\"list-unstyled bunch_list\">\n                  <li>\n                      <div>\n                          Walkover Web solution Pvt Ltd.\n                      </div>\n                      <span class=\"company_action pos-abs\">\n                      <button type=\"button\" class=\"btn btn-xs \"><i class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i></button>\n                  </span>\n                  </li>\n              </ul>\n          </perfect-scrollbar>\n\n          <div class=\"pos-abs footer-btn\">\n              <button class=\"btn btn-default\">+ Add Company</button>\n          </div>\n      </div> -->\n    </div>\n  </div>\n</div>\n<!--end of row  -->\n\n\n<!--add bunch modal  -->\n<div bsModal #bunchModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: false}\" class=\"modal fade\" role=\"dialog\"\n     (onHidden)=\"onHide()\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <create-bunch-component [mode]=\"mode\" [formData]=\"selectedBunch\" (closeModalEvent)=\"hideBunchModal()\"\n                              (saveDataEvent)=\"saveBunch($event)\"></create-bunch-component>\n    </div>\n  </div>\n</div>\n\n<!--add company modal  -->\n<div bsModal #addCompanyModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: false}\" class=\"modal fade\"\n     role=\"dialog\" (onHidden)=\"onHide()\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <add-bunch-company [companiesList]=\"companies$ | async\" [activeBunch]=\"selectedBunch\"\n                         (closeModalEvent)=\"hideAddCompanyModal()\"\n                         (saveDataEvent)=\"AddBunchCompany($event)\"></add-bunch-company>\n    </div>\n  </div>\n</div>\n\n<!--get bunch company modal  -->\n<div bsModal #getBunchCompanyModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: false}\" class=\"modal fade\"\n     role=\"dialog\" (onHidden)=\"onHide()\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <get-companies [activeBunch]=\"selectedBunch\" [selectedBunch]=\"selectedBunchCompany\"\n                     (closeModalEvent)=\"hideGetBunchCompanyModal()\"\n                     (deleteCompanyEvent)=\"RemoveCompany($event)\"></get-companies>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/bunch/bunch.component.ts":
/*!***************************************************!*\
  !*** ./src/app/settings/bunch/bunch.component.ts ***!
  \***************************************************/
/*! exports provided: IsyncData, BunchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsyncData", function() { return IsyncData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BunchComponent", function() { return BunchComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/settings/branch/settings.branch.action */ "./src/app/actions/settings/branch/settings.branch.action.ts");
/* harmony import */ var _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../services/settings.bunch.service */ "./src/app/services/settings.bunch.service.ts");













var IsyncData = [
    { label: 'Debtors', value: 'debtors' },
    { label: 'Creditors', value: 'creditors' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Taxes', value: 'taxes' },
    { label: 'Bank', value: 'bank' }
];
var BunchComponent = /** @class */ (function () {
    function BunchComponent(store, settingsBranchActions, componentFactoryResolver, companyActions, settingsProfileActions, _settingsBunchService, _toasterService) {
        var _this = this;
        this.store = store;
        this.settingsBranchActions = settingsBranchActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this.companyActions = companyActions;
        this.settingsProfileActions = settingsProfileActions;
        this._settingsBunchService = _settingsBunchService;
        this._toasterService = _toasterService;
        this.dataSyncOption = IsyncData;
        this.currentBranch = null;
        this.selectedCompanies = [];
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.confirmationMessage = '';
        this.parentCompanyName = null;
        this.selectedBranch = null;
        this.allBunches = [];
        this.selectedBunch = {};
        this.selectedBunchCompany = [];
        this.mode = 'create';
        this.activeBunchCompanies = {};
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["isEmpty"](o)) {
                var companyInfo = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](o);
                _this.currentBranch = companyInfo.name;
            }
        });
        this.getAllBunch();
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches());
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_3__["createSelector"])([function (state) { return state.session.companies; }, function (state) { return state.settings.branches; }, function (state) { return state.settings.parentCompany; }], function (companies, branches, parentCompany) {
            if (companies && companies.length && branches) {
                var companiesWithSuperAdminRole_1 = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](companies, function (cmp) {
                    _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"](cmp.userEntityRoles, function (company) {
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
                _this.companies$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["orderBy"](companiesWithSuperAdminRole_1, 'name'));
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe();
    }
    BunchComponent.prototype.ngOnInit = function () {
        // console.log('bunch component');
    };
    BunchComponent.prototype.openAddCompanyModal = function (grp) {
        this.selectedBunch = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](grp);
        this.addCompanyModal.show();
    };
    BunchComponent.prototype.hideAddCompanyModal = function () {
        this.addCompanyModal.hide();
    };
    BunchComponent.prototype.openGetBunchCompanyModal = function () {
        this.getBunchCompanyModal.show();
    };
    BunchComponent.prototype.hideGetBunchCompanyModal = function () {
        this.getBunchCompanyModal.hide();
    };
    BunchComponent.prototype.openAddBunchModal = function () {
        this.bunchModal.show();
    };
    BunchComponent.prototype.hideBunchModal = function () {
        this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.selectedBunch = {};
        this.bunchModal.hide();
        this.mode = 'create';
    };
    BunchComponent.prototype.onHide = function () {
        // console.log('creat company modal is closed.');
    };
    /**
     * getAllBunch
     */
    BunchComponent.prototype.getAllBunch = function () {
        var _this = this;
        this._settingsBunchService.GetAllBunches().subscribe(function (res) {
            if (res && res.status === 'success') {
                _this.allBunches = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](res.body.bunchResources);
                // console.log(res);
            }
        });
    };
    /**
     * createBunch
     */
    BunchComponent.prototype.createBunch = function (data) {
        var _this = this;
        this._settingsBunchService.CreateBunch(data).subscribe(function (res) {
            if (res && res.status === 'success') {
                _this.allBunches.push(res.body);
                _this.hideBunchModal();
                // console.log(res);
            }
        });
    };
    /**
     * save Bunch
     */
    BunchComponent.prototype.saveBunch = function (data) {
        var dataToSend = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](data);
        if (this.mode === 'create' || !this.mode) {
            this.createBunch(dataToSend);
        }
        else {
            this.updateBunch(dataToSend);
        }
    };
    /**
     * update
     */
    BunchComponent.prototype.update = function (bunch) {
        this.mode = 'update';
        this.selectedBunch = bunch;
        this.openAddBunchModal();
    };
    /**
     * updateBunch
     */
    BunchComponent.prototype.updateBunch = function (data) {
        var _this = this;
        this._settingsBunchService.UpdateBunch(data, data.uniqueName).subscribe(function (res) {
            if (res && res.status === 'success') {
                _this._toasterService.successToast(res.status);
                _this.getAllBunch();
                _this.hideBunchModal();
                // console.log(res);
            }
        });
    };
    /**
     * delete bunch
     */
    BunchComponent.prototype.deleteBunch = function (bunchUniqueName) {
        var _this = this;
        var uniqueName = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](bunchUniqueName);
        this._settingsBunchService.RemoveBunch(uniqueName).subscribe(function (res) {
            if (res && res.status === 'success') {
                _this._toasterService.successToast(res.body);
                _this.getAllBunch();
                // console.log(res);
            }
            else {
                _this._toasterService.errorToast(res.message);
            }
        });
    };
    /**
     * getBunch
     */
    BunchComponent.prototype.getBunchCompany = function (bunch) {
        var _this = this;
        this.selectedBunch = bunch;
        this._settingsBunchService.GetCompanies(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](bunch.uniqueName)).subscribe(function (res) {
            if (res && res.status === 'success') {
                if (res.body.companies && res.body.companies.length) {
                    _this.selectedBunchCompany = res.body;
                    _this.getBunchCompanyModal.show();
                }
                else {
                    _this._toasterService.errorToast('No company added');
                }
            }
        });
    };
    /**
     * save company
     */
    BunchComponent.prototype.AddBunchCompany = function (data) {
        var _this = this;
        if (data.length) {
            this._settingsBunchService.AddCompanies(data, this.selectedBunch.uniqueName).subscribe(function (res) {
                if (res && res.status === 'success') {
                    _this._toasterService.successToast(res.body);
                    _this.hideAddCompanyModal();
                }
            });
        }
        else {
            this.hideAddCompanyModal();
        }
    };
    /**
     * save company
     */
    BunchComponent.prototype.RemoveCompany = function (data) {
        var _this = this;
        if (data.length) {
            this._settingsBunchService.RemoveCompanies(data, this.selectedBunch.uniqueName).subscribe(function (res) {
                if (res && res.status === 'success') {
                    _this._toasterService.successToast(res.body);
                    _this.hideGetBunchCompanyModal();
                }
            });
        }
        else {
            this.hideGetBunchCompanyModal();
        }
    };
    BunchComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    BunchComponent.prototype.isAllCompaniesSelected = function () {
        var _this = this;
        this.companies$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (companies) {
            if (companies.length === _this.selectedCompanies.length) {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(true);
            }
            else {
                _this.isAllSelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('bunchModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], BunchComponent.prototype, "bunchModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('addCompanyModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], BunchComponent.prototype, "addCompanyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('getBunchCompanyModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], BunchComponent.prototype, "getBunchCompanyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ViewChild"])('confirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], BunchComponent.prototype, "confirmationModal", void 0);
    BunchComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'setting-bunch',
            template: __webpack_require__(/*! ./bunch.component.html */ "./src/app/settings/bunch/bunch.component.html"),
            providers: [{ provide: ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["BsDropdownConfig"], useValue: { autoClose: false } }],
            styles: [__webpack_require__(/*! ./bunch.component.css */ "./src/app/settings/bunch/bunch.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_settings_branch_settings_branch_action__WEBPACK_IMPORTED_MODULE_11__["SettingsBranchActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ComponentFactoryResolver"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_10__["CompanyActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_8__["SettingsProfileActions"],
            _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_12__["SettingsBunchService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"]])
    ], BunchComponent);
    return BunchComponent;
}());



/***/ }),

/***/ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.css":
/*!*********************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.css ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".dropdown-menu li label {\n  padding: 5px 0;\n  display: block;\n  cursor: pointer;\n}\n\n.dropdown-menu {\n  width: 100%;\n  box-shadow: none;\n  border-radius: 0;\n  min-width: 200px;\n  max-height: 180px;\n  overflow: auto;\n}\n"

/***/ }),

/***/ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.html":
/*!**********************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\">{{ activeBunch.name }}</h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n\n\n    <div class=\"form-group\" *ngIf=\"companiesList && companiesList.length\">\n\n      <div class=\"btn-group btn-block\" dropdown #companyListDropdown=\"bs-dropdown\" [autoClose]=\"false\"\n           (clickOutside)=\"hideListItems()\">\n        <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\">\n          Chosse company to add in group <span class=\"select_drop pull-right mrT1\"><i\n          class=\"fa fa-caret-down\"></i></span>\n        </button>\n        <ul id=\"\" *dropdownMenu class=\"dropdown-menu pdL1 pdR1\" role=\"menu\" aria-labelledby=\"button-triggers-manual\">\n          <li>\n            <label>\n              <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" (click)=\"selectAllPages($event)\"\n                     [(ngModel)]=\"isAllCompanySelected\"> Select all\n            </label>\n          </li>\n          <li *ngFor=\"let item of companiesList; let i = index\">\n            <label>\n              <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"item.isSelected\"> {{ item.name\n              }}\n            </label>\n          </li>\n        </ul>\n      </div>\n      <!-- <div class=\"btn-group btn-block\" dropdown #companyListDropdown=\"bs-dropdown\" [autoClose]=\"false\" (clickOutside)=\"hideListItems()\">\n          <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\">\n          Chosse company to add in group <span class=\"select_drop pull-right mrT1\"><i class=\"fa fa-caret-down\"></i></span>\n</button>\n          <ul id=\"pageListDD\" *dropdownMenu class=\"dropdown-menu pdL1 pdR1\" role=\"menu\">\n              <li>\n                  <label>\n      <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" (click)=\"selectAllPages($event)\" [(ngModel)]=\"isAllCompanySelected\"> Select all\n  </label>\n              </li>\n              <li *ngFor=\"let item of companiesList; let i = index\">\n                  <label>\n      <input type=\"checkbox\" [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"item.isSelected\"> {{ item.name }}\n  </label>\n              </li>\n\n          </ul>\n\n      </div> -->\n    </div>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"submit\" class=\"btn btn-success\" (click)=\"save()\">Save</button>\n    <button type=\"reset\" class=\"btn btn-danger\" (click)=\"onCancel()\">Cancel</button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.ts ***!
  \********************************************************************************************/
/*! exports provided: BunchAddCompanyModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BunchAddCompanyModalComponent", function() { return BunchAddCompanyModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/settings.bunch.service */ "./src/app/services/settings.bunch.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");







var BunchAddCompanyModalComponent = /** @class */ (function () {
    function BunchAddCompanyModalComponent(_fb, _toaster, _settingsBunchService) {
        this._fb = _fb;
        this._toaster = _toaster;
        this._settingsBunchService = _settingsBunchService;
        this.activeBunch = {};
        this.companiesList = [];
        this.closeModalEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](false);
        this.saveDataEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](null);
        this.isAllCompanySelected = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
    }
    BunchAddCompanyModalComponent.prototype.selectAllPages = function (event) {
        if (event.target.checked) {
            this.isAllCompanySelected = true;
            this.companiesList.forEach(function (item) { return item.isSelected = true; });
        }
        else {
            this.isAllCompanySelected = false;
            this.companiesList.forEach(function (item) { return item.isSelected = false; });
        }
    };
    /**
     * save
     */
    BunchAddCompanyModalComponent.prototype.save = function () {
        var dataToSend = [];
        _.forEach(this.companiesList, function (obj) {
            if (obj.isSelected) {
                dataToSend.push(obj.uniqueName);
            }
        });
        this.saveDataEvent.emit(_.cloneDeep(dataToSend));
    };
    BunchAddCompanyModalComponent.prototype.onCancel = function () {
        this.closeModalEvent.emit(true);
    };
    /**
     * hideDropdown
     */
    BunchAddCompanyModalComponent.prototype.hideListItems = function () {
        this.companyListDropdown.hide();
    };
    /**
     * ngOnChanges
     */
    BunchAddCompanyModalComponent.prototype.ngOnChanges = function (s) {
        //
    };
    BunchAddCompanyModalComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BunchAddCompanyModalComponent.prototype, "activeBunch", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], BunchAddCompanyModalComponent.prototype, "companiesList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], BunchAddCompanyModalComponent.prototype, "closeModalEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], BunchAddCompanyModalComponent.prototype, "saveDataEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('companyListDropdown'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["BsDropdownDirective"])
    ], BunchAddCompanyModalComponent.prototype, "companyListDropdown", void 0);
    BunchAddCompanyModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'add-bunch-company',
            template: __webpack_require__(/*! ./bunch-add-company.component.html */ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.html"),
            styles: [__webpack_require__(/*! ./bunch-add-company.component.css */ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"],
            _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__["SettingsBunchService"]])
    ], BunchAddCompanyModalComponent);
    return BunchAddCompanyModalComponent;
}());



/***/ }),

/***/ "./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\" *ngIf=\"mode === 'create' || !mode\">Create Group </h3>\n    <h3 class=\"modal-title bg\" id=\"modal-title\" *ngIf=\"mode === 'update'\">Update Group </h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <form name=\"newRole\" [formGroup]=\"addBunchForm\" novalidate class=\"\" autocomplete=\"off\">\n      <div class=\"row\">\n        <div class=\"col-xs-6 form-group\">\n          <label>Name <sup>*</sup></label>\n          <input type=\"text\" class=\"form-control\" formControlName=\"name\" (blur)=\"generateUniqueName()\"/>\n        </div>\n\n        <div class=\"col-xs-6 form-group\">\n          <label>UniqueName <sup>*</sup></label>\n          <input type=\"text\" class=\"form-control\" formControlName=\"uniqueName\"/>\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-xs-12 form-group\">\n          <label>Description</label>\n          <textarea class=\"form-control\" formControlName=\"description\"></textarea>\n        </div>\n      </div>\n    </form>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"submit\" class=\"btn btn-success\" (click)=\"createBunch()\">Save</button>\n    <button type=\"reset\" class=\"btn btn-danger\" (click)=\"onCancel()\">Cancel</button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.ts ***!
  \****************************************************************************************/
/*! exports provided: CreateBunchModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateBunchModalComponent", function() { return CreateBunchModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/settings.bunch.service */ "./src/app/services/settings.bunch.service.ts");





var CreateBunchModalComponent = /** @class */ (function () {
    function CreateBunchModalComponent(_fb, _toaster, _settingsBunchService) {
        this._fb = _fb;
        this._toaster = _toaster;
        this._settingsBunchService = _settingsBunchService;
        this.formData = {};
        this.closeModalEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](false);
        this.saveDataEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](null);
        this.addBunchForm = this._fb.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            uniqueName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            description: [''],
        });
    }
    /**
     * create
     */
    CreateBunchModalComponent.prototype.createBunch = function () {
        var dataToSend = _.cloneDeep(this.addBunchForm.value);
        this.saveDataEvent.emit(dataToSend);
        // this._settingsBunchService.CreateBunch(dataToSend);
    };
    CreateBunchModalComponent.prototype.onCancel = function () {
        this.addBunchForm.reset();
        this.closeModalEvent.emit(true);
    };
    CreateBunchModalComponent.prototype.generateUniqueName = function () {
        var control = this.addBunchForm.get('name');
        var uniqueControl = this.addBunchForm.get('uniqueName');
        var unqName = control.value;
        unqName = unqName.replace(/ |,|\//g, '');
        unqName = unqName.toLowerCase();
        if (unqName.length >= 1) {
            var unq = '';
            var text = '';
            var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var i = 0;
            while (i < 3) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
                i++;
            }
            unq = unqName + text;
            uniqueControl.patchValue(unq);
        }
        else {
            uniqueControl.patchValue('');
        }
    };
    /**
     * ngOnChanges
     */
    CreateBunchModalComponent.prototype.ngOnChanges = function (s) {
        if (s && s.mode && s.mode.currentValue === 'update') {
            this.addBunchForm.patchValue({
                name: s.formData.currentValue.name,
                uniqueName: s.formData.currentValue.uniqueName,
                description: s.formData.currentValue.description
            });
        }
        else {
            this.addBunchForm.reset();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], CreateBunchModalComponent.prototype, "mode", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], CreateBunchModalComponent.prototype, "formData", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], CreateBunchModalComponent.prototype, "closeModalEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], CreateBunchModalComponent.prototype, "saveDataEvent", void 0);
    CreateBunchModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'create-bunch-component',
            template: __webpack_require__(/*! ./create-bunch.component.html */ "./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"],
            _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__["SettingsBunchService"]])
    ], CreateBunchModalComponent);
    return CreateBunchModalComponent;
}());



/***/ }),

/***/ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.css":
/*!*******************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/get-companies/get-companies.component.css ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".modal-body {\n  padding: 15px 0;\n}\n\n.bunch_list li {\n  position: relative;\n  padding: 5px 15px;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n\n.bunch_list li:hover {\n  color: #ff5e01;\n  background: #f4f5f8;\n}\n\n.company_action {\n  right: 15px;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n\n.bunch_list {\n  height: 245px;\n  max-height: 245px;\n  overflow: auto;\n  padding: 0;\n  padding-bottom: 52px;\n}\n\n.bunch_parent {\n  position: relative;\n}\n\n.footer-btn {\n  bottom: 0;\n  padding: 10px 15px;\n  width: 100%;\n  text-align: right;\n  right: 0;\n  left: 0;\n  background: #f4f5f8;\n}\n\n.bunch_list li:hover .company_action {\n  z-index: 1;\n  opacity: 1;\n}\n"

/***/ }),

/***/ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/get-companies/get-companies.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\"> List of {{ activeBunch.name }} group companies</h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <ng-container *ngIf=\"selectedBunch.companies && selectedBunch.companies.length\">\n      <perfect-scrollbar class=\"scrClass\" wheel-propagation=\"true\" wheel-speed=\"1\" min-scrollbar-length=\"0\"\n                         [scrollIndicators]=\"true\">\n        <ul class=\"list-unstyled bunch_list\">\n          <li *ngFor=\"let item of selectedBunch.companies; let i = index\">\n            <div>\n              {{item.name}}\n            </div>\n            <span class=\"company_action pos-abs\">\n                            <button type=\"button\" class=\"btn btn-xs\" (click)=\"deleteCompany(item.uniqueName)\"><i\n                              class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i></button>\n                        </span>\n          </li>\n        </ul>\n      </perfect-scrollbar>\n    </ng-container>\n  </div>\n  <!-- <div class=\"modal-footer\">\n      <button type=\"submit\" class=\"btn btn-success\" (click)=\"createBunch()\">Save</button>\n      <button type=\"reset\" class=\"btn btn-danger\" (click)=\"onCancel()\">Cancel</button>\n  </div> -->\n</div>\n"

/***/ }),

/***/ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/settings/bunch/components-modal/get-companies/get-companies.component.ts ***!
  \******************************************************************************************/
/*! exports provided: GetBunchModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBunchModalComponent", function() { return GetBunchModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/settings.bunch.service */ "./src/app/services/settings.bunch.service.ts");





var GetBunchModalComponent = /** @class */ (function () {
    function GetBunchModalComponent(_fb, _toaster, _settingsBunchService) {
        this._fb = _fb;
        this._toaster = _toaster;
        this._settingsBunchService = _settingsBunchService;
        this.activeBunch = {};
        this.selectedBunch = {};
        this.closeModalEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](false);
        this.deleteCompanyEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](null);
        this.saveDataEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](null);
    }
    /**
     * deleteCompany
     */
    GetBunchModalComponent.prototype.deleteCompany = function (companyUniqueName) {
        this.deleteCompanyEvent.emit([companyUniqueName]);
    };
    /**
     * create
     */
    GetBunchModalComponent.prototype.createBunch = function () {
        var dataToSend = [];
        this.saveDataEvent.emit(dataToSend);
        // this._settingsBunchService.CreateBunch(dataToSend);
    };
    GetBunchModalComponent.prototype.onCancel = function () {
        this.closeModalEvent.emit(true);
    };
    /**
     * ngOnChanges
     */
    GetBunchModalComponent.prototype.ngOnChanges = function (s) {
        //
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GetBunchModalComponent.prototype, "activeBunch", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GetBunchModalComponent.prototype, "selectedBunch", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], GetBunchModalComponent.prototype, "closeModalEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], GetBunchModalComponent.prototype, "deleteCompanyEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], GetBunchModalComponent.prototype, "saveDataEvent", void 0);
    GetBunchModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'get-companies',
            template: __webpack_require__(/*! ./get-companies.component.html */ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.html"),
            styles: [__webpack_require__(/*! ./get-companies.component.css */ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"],
            _services_settings_bunch_service__WEBPACK_IMPORTED_MODULE_4__["SettingsBunchService"]])
    ], GetBunchModalComponent);
    return GetBunchModalComponent;
}());



/***/ }),

/***/ "./src/app/settings/discount/discount.component.html":
/*!***********************************************************!*\
  !*** ./src/app/settings/discount/discount.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n  <div class=\"row\">\n    <h1 class=\"section_head pdT0 col-xs-6\">Create Discount</h1>\n  </div>\n\n  <form #discountForm=\"ngForm\" novalidate (submit)=\"submit()\">\n    <div class=\"row \">\n      <div class=\"form-group col-sm-6 col-md-2 col-xs-12\">\n        <label>Select Discount</label><br>\n        <sh-select [options]=\"discountTypeList\" [isFilterEnabled]=\"false\" name=\"type\" [(ngModel)]=\"createRequest.type\"\n          [placeholder]=\"'Select Type'\" [ItemHeight]=\"33\"></sh-select>\n      </div>\n\n\n      <ng-container *ngIf=\"createRequest.type\">\n        <div class=\"form-group col-sm-6 col-md-2 col-xs-12\">\n          <label>Name</label>\n          <input type=\"text\" [(ngModel)]=\"createRequest.name\" name=\"name\" placeholder=\"Name\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-group col-sm-6 col-md-2 col-xs-12\">\n          <label>Value</label>\n          <input type=\"text\" [(ngModel)]=\"createRequest.discountValue\" name=\"value\" placeholder=\"Value\"\n            class=\"form-control\" />\n        </div>\n\n        <div class=\"form-group col-sm-6 col-md-2 col-xs-12\">\n          <label>Linked Accounts</label>\n          <sh-select [isFilterEnabled]=\"true\" [notFoundLink]=\"true\" name=\"account\"\n            [(ngModel)]=\"createRequest.accountUniqueName\" [placeholder]=\"'Select Discount'\"\n            [showNotFoundLinkAsDefault]=\"true\" [options]=\"accounts$\" [ItemHeight]=\"'max-content'\"\n            (noResultsClicked)=\"toggleAccountAsidePane($event)\">\n          </sh-select>\n        </div>\n\n        <div class=\"col-sm-6 col-md-2 col-xs-12 form-group d-flex\" style=\"align-items: flex-end\">\n          <label class=\"d-block\"></label>\n          <button type=\"submit\" class=\"btn btn-success\" *ngIf=\"!(createRequest.discountUniqueName)\"\n            [ladda]=\"isDiscountCreateInProcess$ | async\" style=\"height: 34px\">Add\n          </button>\n          <button type=\"submit\" class=\"btn btn-success\" *ngIf=\"createRequest.discountUniqueName\"\n            [ladda]=\"isDiscountUpdateInProcess$ | async\" style=\"height: 34px\">Update\n          </button>\n        </div>\n      </ng-container>\n\n    </div>\n  </form>\n\n  <div class=\" \">\n    <div class=\"row\">\n\n      <div class=\" col-sm-12 col-md-4 col-xs-12\">\n\n        <table class=\"table table-bordered basic mrB  onMobileView\">\n\n          <thead>\n            <tr>\n              <th [style.width.px]=\"'50'\">#</th>\n              <th>Name</th>\n              <th class=\"text-center\">Action</th>\n            </tr>\n          </thead>\n\n          <tbody>\n            <tr *ngFor=\"let discount of discountList$ | async; let i = index\">\n              <td data-title=\"#\">{{ i + 1 }}</td>\n              <td data-title=\"Name\"> {{ discount.name }}</td>\n              <td data-title=\"Action\">\n                <span (click)=\"edit(discount)\" class=\"btn btn-xs\">\n                  <i class=\"fa fa-pencil\"></i>\n                </span>\n                <span (click)=\"showDeleteDiscountModal(discount.uniqueName)\" class=\"btn btn-xs\">\n                  <i class=\"fa fa-trash\"></i>\n                </span>\n              </td>\n            </tr>\n          </tbody>\n\n          <tbody *ngIf=\"!(discountList$ | async).length\" class=\"onMobileView noRecords\">\n            <tr>\n              <td colspan=\"3\" class=\"text-center empty_table\">\n                <h1>No Discount Found !!</h1>\n              </td>\n            </tr>\n          </tbody>\n\n        </table>\n\n      </div>\n\n    </div>\n  </div>\n\n</div>\n\n<!-- open account aside -->\n<div class=\"aside-overlay\" *ngIf=\"accountAsideMenuState === 'in'\"></div>\n<aside-menu-account [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\"\n  (closeAsideEvent)=\"toggleAccountAsidePane($event)\" [activeGroupUniqueName]=\"'discount'\"></aside-menu-account>\n\n<!--delete discount confirmation model -->\n<div bsModal #discountConfirmationModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <!-- modal-liq90 class is removed for now-->\n    <div class=\"modal-content\">\n      <confirm-modal [body]=\"'Do You Really Want to Delete This Discount'\" (successCallBack)=\"delete()\"\n        (cancelCallBack)=\"hideDeleteDiscountModal()\"></confirm-modal>\n      <!--<delete-tax-confirmation-model [message]=\"confirmationMessage\" (userConfirmationEvent)=\"userConfirmation($event)\"></delete-tax-confirmation-model>-->\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/discount/discount.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/settings/discount/discount.component.ts ***!
  \*********************************************************/
/*! exports provided: DiscountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscountComponent", function() { return DiscountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/api-models/SettingsDiscount */ "./src/app/models/api-models/SettingsDiscount.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions/settings/discount/settings.discount.action */ "./src/app/actions/settings/discount/settings.discount.action.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");










var DiscountComponent = /** @class */ (function () {
    function DiscountComponent(_settingsDiscountAction, _groupService, store) {
        this._settingsDiscountAction = _settingsDiscountAction;
        this._groupService = _groupService;
        this.store = store;
        this.discountTypeList = [
            { label: 'as per value', value: 'FIX_AMOUNT' },
            { label: 'as per percent', value: 'PERCENTAGE' }
        ];
        this.createRequest = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_3__["CreateDiscountRequest"]();
        this.deleteRequest = null;
        this.accountAsideMenuState = 'out';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.getFlattenAccounts();
        this.discountList$ = this.store.select(function (s) { return s.settings.discount.discountList; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDiscountListInProcess$ = this.store.select(function (s) { return s.settings.discount.isDiscountListInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDiscountCreateInProcess$ = this.store.select(function (s) { return s.settings.discount.isDiscountCreateInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDiscountCreateSuccess$ = this.store.select(function (s) { return s.settings.discount.isDiscountCreateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDiscountUpdateInProcess$ = this.store.select(function (s) { return s.settings.discount.isDiscountUpdateInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDiscountUpdateSuccess$ = this.store.select(function (s) { return s.settings.discount.isDiscountUpdateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDeleteDiscountInProcess$ = this.store.select(function (s) { return s.settings.discount.isDeleteDiscountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isDeleteDiscountSuccess$ = this.store.select(function (s) { return s.settings.discount.isDeleteDiscountSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(function (s) { return s.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    DiscountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.isDiscountCreateSuccess$.subscribe(function (s) {
            _this.createRequest = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_3__["CreateDiscountRequest"]();
        });
        this.isDiscountUpdateSuccess$.subscribe(function (s) {
            _this.createRequest = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_3__["CreateDiscountRequest"]();
        });
        this.isDeleteDiscountSuccess$.subscribe(function (d) {
            _this.createRequest = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_3__["CreateDiscountRequest"]();
            _this.deleteRequest = null;
        });
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (yes) {
            if (yes) {
                if (_this.accountAsideMenuState === 'in') {
                    _this.toggleAccountAsidePane();
                    _this.getFlattenAccounts();
                }
            }
        });
    };
    DiscountComponent.prototype.toggleAccountAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    DiscountComponent.prototype.toggleBodyClass = function () {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    DiscountComponent.prototype.submit = function () {
        if (this.createRequest.discountUniqueName) {
            this.store.dispatch(this._settingsDiscountAction.UpdateDiscount(this.createRequest, this.createRequest.discountUniqueName));
        }
        else {
            this.store.dispatch(this._settingsDiscountAction.CreateDiscount(this.createRequest));
        }
    };
    DiscountComponent.prototype.edit = function (data) {
        this.createRequest.type = data.discountType;
        this.createRequest.name = data.name;
        this.createRequest.discountValue = data.discountValue;
        this.createRequest.accountUniqueName = data.linkAccount.uniqueName;
        this.createRequest.discountUniqueName = data.uniqueName;
    };
    DiscountComponent.prototype.showDeleteDiscountModal = function (uniqueName) {
        this.deleteRequest = uniqueName;
        this.discountConfirmationModel.show();
    };
    DiscountComponent.prototype.hideDeleteDiscountModal = function () {
        this.deleteRequest = null;
        this.discountConfirmationModel.hide();
    };
    DiscountComponent.prototype.delete = function () {
        this.store.dispatch(this._settingsDiscountAction.DeleteDiscount(this.deleteRequest));
        this.hideDeleteDiscountModal();
    };
    /**
     *
     */
    DiscountComponent.prototype.getFlattenAccounts = function () {
        var _this = this;
        this._groupService.GetGroupsWithAccounts('').subscribe(function (result) {
            var oCost = result.body.find(function (b) { return b.uniqueName === 'operatingcost'; });
            var discount = null;
            if (oCost) {
                discount = oCost.groups.find(function (f) { return f.uniqueName === 'discount'; });
                if (discount) {
                    _this.accounts$ = discount.accounts.map(function (dis) {
                        return { label: dis.name, value: dis.uniqueName };
                    });
                }
                else {
                    _this.accounts$ = [];
                }
            }
            else {
                _this.accounts$ = [];
            }
        });
    };
    DiscountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])('discountConfirmationModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["ModalDirective"])
    ], DiscountComponent.prototype, "discountConfirmationModel", void 0);
    DiscountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'setting-discount',
            template: __webpack_require__(/*! ./discount.component.html */ "./src/app/settings/discount/discount.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_9__["animate"])('400ms ease-in-out'))
                ]),
            ]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_6__["SettingsDiscountActions"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_5__["GroupService"], _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"]])
    ], DiscountComponent);
    return DiscountComponent;
}());



/***/ }),

/***/ "./src/app/settings/financial-year/financial-year.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/settings/financial-year/financial-year.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n  <!--<div>\n  {{ financialYearObj | json }}\n</div>-->\n  <form>\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <h1 class=\"section_head\">Financial Year(s) - {{ currentCompanyName }}</h1>\n\n        <div class=\"row\">\n          <div class=\"col-sm-7 col-xs-12 \">\n            <table class=\"table-bordered basic table financial-year onMobileView\">\n              <thead>\n                <tr>\n                  <th>Sr. No.</th>\n                  <th>From</th>\n                  <th>To</th>\n                  <th>Lock Status</th>\n                </tr>\n              </thead>\n              <tbody *ngIf=\"financialYearObj && financialYearObj.financialYears\">\n                <tr *ngFor=\"let financialYear of financialYearObj.financialYears; let i = index\">\n                  <td data-title=\"#\">{{i+1}}</td>\n                  <td data-title=\"From\">{{financialYear.financialYearStarts}}</td>\n                  <td data-title=\"#To\">{{financialYear.financialYearEnds}}</td>\n                  <td data-title=\"Lock Status\" *ngIf=\"currentCompanyFinancialYearUN != financialYear.uniqueName\"\n                    class=\"status\">\n                    <span *ngIf=\"financialYear.isLocked\"><i class=\"fa fa-toggle-off fa-2x cp\" aria-hidden=\"true\"\n                        (click)=\"lockUnlockFinancialYear(financialYear);\"></i> <label>Locked</label></span>\n                    <span *ngIf=\"!financialYear.isLocked\"><i class=\"fa fa-toggle-on fa-2x cp\" aria-hidden=\"true\"\n                        (click)=\"lockUnlockFinancialYear(financialYear);\"></i> <label>Unlocked</label></span>\n                  </td>\n                  <td data-title=\"Lock Status\" *ngIf=\"currentCompanyFinancialYearUN == financialYear.uniqueName\">\n                    Current Financial Year (can not be locked)\n                  </td>\n                </tr>\n              </tbody>\n              <tbody *ngIf=\"!financialYearObj || !financialYearObj.financialYears.length\"\n                class=\"onMobileView noRecords\">\n                <tr>\n                  <td colspan=\"4\" class=\"text-center empty_table\">\n                    <h1>No Record Found !!</h1>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n\n\n\n        <hr class=\"clearfix\">\n\n        <div class=\"financialYearField row\">\n          <div class=\"form-group mrT1 col-md-4 col-sm-12 clearfix\">\n            <label>Switch Financial Year</label>\n            <div class=\"row\">\n              <span class=\" col-sm-7 col-xs-12\">\n                <sh-select placeholder=\"Select Financial Year\" name=\"currentCompanyFinancialYearUN\"\n                  [ngModel]=\"currentCompanyFinancialYearUN\" [options]=\"financialOptions\"\n                  (selected)=\"selectFinancialYearOption($event)\" [width]=\"'100%'\"  >\n                </sh-select>\n              </span>\n              <span class=\"col-sm-4 col-xs-12\">\n                <button class=\"btn btn-success btn-sm \" (click)=\"switchFY()\">Save</button>\n              </span>\n            </div>\n          </div>\n\n          <div class=\"form-group col-md-4 col-sm-12 mrT1 mrB clearfix\">\n            <label>Add Financial Year</label>\n            <div class=\"row\">\n              <span class=\" col-sm-7 col-xs-12 \">\n                <sh-select placeholder=\"Select Financial Year\" [options]=\"yearOptions\" (selected)=\"selectYear($event)\">\n                </sh-select>\n              </span>\n              <div class=\"col-sm-4 col-xs-12\">\n                <button class=\"btn btn-success btn-sm \" (click)=\"addFY()\">Save</button>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"form-group mrT1 col-md-4 col-sm-12 mrB clearfix\">\n            <label>Financial Year Period</label>\n            <div class=\"row\">\n              <span class=\"col-sm-7 col-xs-12 \">\n                <sh-select name=\"selectedFYPeriod\" [ngModel]=\"selectedFYPeriod\" placeholder=\"Financial Year Period\"\n                  (selected)=\"selectFYPeriod($event)\" [options]=\"FYPeriodOptions\">\n                </sh-select>\n              </span>\n              <div class=\"col-sm-4 col-xs-12\">\n                <button class=\"btn btn-success btn-sm \" (click)=\"updateFYPeriod()\">Save</button>\n              </div>\n            </div>\n          </div>\n        </div>\n\n\n      </div>\n    </div>\n  </form>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/financial-year/financial-year.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/settings/financial-year/financial-year.component.ts ***!
  \*********************************************************************/
/*! exports provided: FinancialYearComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FinancialYearComponent", function() { return FinancialYearComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_settings_financial_year_financial_year_action__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../actions/settings/financial-year/financial-year.action */ "./src/app/actions/settings/financial-year/financial-year.action.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_11__);












var FinancialYearComponent = /** @class */ (function () {
    function FinancialYearComponent(router, store, settingsFinancialYearActions, _companyActions, _toasty) {
        this.router = router;
        this.store = store;
        this.settingsFinancialYearActions = settingsFinancialYearActions;
        this._companyActions = _companyActions;
        this._toasty = _toasty;
        this.financialOptions = [];
        this.yearOptions = [];
        this.FYPeriodOptions = [
            { label: 'JAN-DEC', value: 'JAN-DEC' },
            { label: 'APR-MAR', value: 'APR-MAR' },
            { label: 'JULY-JULY', value: 'JULY-JULY' }
        ];
        this.options = {
            multiple: false,
            width: '300px',
            placeholder: 'Select Option',
            allowClear: true
        };
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
    }
    FinancialYearComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_11__["createSelector"])([function (state) { return state.settings.refreshCompany; }], function (o) {
            if (o) {
                _this.store.dispatch(_this._companyActions.RefreshCompanies());
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe();
        this.store.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s.session) {
                _this.currentCompanyUniqueName = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](s.session.companyUniqueName);
            }
            if (_this.currentCompanyUniqueName && s.session.companies) {
                var companies = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](s.session.companies);
                var comp = companies.find(function (c) { return c.uniqueName === _this.currentCompanyUniqueName; });
                if (comp) {
                    _this.currentCompanyName = comp.name;
                    _this.currentCompanyFinancialYearUN = comp.activeFinancialYear.uniqueName;
                    _this.financialOptions = comp.financialYears.map(function (q) {
                        return { label: q.uniqueName, value: q.uniqueName };
                    });
                }
            }
        });
    };
    FinancialYearComponent.prototype.setYearRange = function () {
        var endYear = moment_moment__WEBPACK_IMPORTED_MODULE_7__().year(); // moment().subtract(1, 'year').year();
        var startYear = moment_moment__WEBPACK_IMPORTED_MODULE_7__().subtract(7, 'year').year(); // moment().subtract(7, 'year').year();
        var yearArray = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["range"](startYear, endYear);
        this.yearOptions = yearArray.map(function (q) {
            return { label: q, value: q };
        });
    };
    FinancialYearComponent.prototype.getInitialFinancialYearData = function () {
        var _this = this;
        this.setYearRange();
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_11__["createSelector"])([function (state) { return state.settings.financialYears; }], function (o) {
            _this.setYearRange();
            if (o) {
                // Arpit: Sagar told me to remove this filter
                _this.financialYearObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](o);
                // let yearOptions = _.cloneDeep(this.yearOptions);
                // o.financialYears.forEach((fYear) => {
                //   let year = moment(fYear.financialYearStarts, GIDDH_DATE_FORMAT).year();
                //   let yearIndx = yearOptions.findIndex((y: any) => y.value === year);
                //   if (yearIndx !== -1) {
                //     yearOptions.splice(yearIndx, 1);
                //   }
                // });
                // this.yearOptions = _.cloneDeep(yearOptions);
            }
            else if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["isNull"](o)) {
                // this.store.dispatch(this._companyActions.RefreshCompanies()); // for card G0-1477
                _this.store.dispatch(_this.settingsFinancialYearActions.GetAllFinancialYears());
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe();
    };
    FinancialYearComponent.prototype.lockUnlockFinancialYear = function (financialYear) {
        var year = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](financialYear);
        var dataToSend = {
            lockAll: true,
            uniqueName: year.uniqueName
        };
        financialYear.isLocked = !financialYear.isLocked;
        if (financialYear.isLocked) {
            this.store.dispatch(this.settingsFinancialYearActions.LockFinancialYear(dataToSend));
        }
        else {
            this.store.dispatch(this.settingsFinancialYearActions.UnlockFinancialYear(dataToSend));
        }
    };
    FinancialYearComponent.prototype.selectFinancialYearOption = function (data) {
        this.selectedFinancialYearUN = data.value;
    };
    FinancialYearComponent.prototype.selectYear = function (data) {
        this.selectedYear = data.value;
    };
    FinancialYearComponent.prototype.selectFYPeriod = function (ev) {
        this.selectedFYPeriod = ev ? ev.value : null;
    };
    FinancialYearComponent.prototype.updateFYPeriod = function () {
        if (this.selectedFYPeriod) {
            this.store.dispatch(this.settingsFinancialYearActions.UpdateFinancialYearPeriod(this.selectedFYPeriod));
        }
    };
    FinancialYearComponent.prototype.switchFY = function () {
        if (this.selectedFinancialYearUN) {
            this.store.dispatch(this.settingsFinancialYearActions.SwitchFinancialYear(this.selectedFinancialYearUN));
            this.store.dispatch(this._companyActions.RefreshCompanies());
        }
    };
    FinancialYearComponent.prototype.addFY = function () {
        if (this.selectedYear) {
            this.store.dispatch(this.settingsFinancialYearActions.AddFinancialYear(this.selectedYear));
        }
    };
    FinancialYearComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'financial-year',
            template: __webpack_require__(/*! ./financial-year.component.html */ "./src/app/settings/financial-year/financial-year.component.html"),
            styles: ["\n  @media(max-width:767px){\n    .financialYearField .btn {\n      margin-top: 5px;\n  }\n  }\n\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _actions_settings_financial_year_financial_year_action__WEBPACK_IMPORTED_MODULE_9__["SettingsFinancialYearActions"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_10__["CompanyActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_8__["ToasterService"]])
    ], FinancialYearComponent);
    return FinancialYearComponent;
}());



/***/ }),

/***/ "./src/app/settings/integration/setting.integration.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/settings/integration/setting.integration.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"clearfix\">\n  <tabset class=\"tab-integraton\">\n    <tab>\n      <ng-template tabHeading>\n        <span class=\"icon-chat2\"></span> SMS\n      </ng-template>\n\n      <div class=\"box clearfix\">\n        <h3 class=\"fs20 mrB2\">MSG91</h3>\n        <form #msgform=\"ngForm\" (ngSubmit)=\"onSubmitMsgform(msgform)\" class=\"smsForm\">\n          <section ngModelGroup=\"smsFormObj\" #smsFormObjCtrl=\"ngModelGroup\">\n            <div class=\"row\">\n              <div class=\"form-group col-sm-4 col-md-3\">\n\n                <label>Auth Key</label>\n                <br>\n                <input type=\"text\" placeholder=\"Enter auth-key\" class=\"form-control\" [ngModel]=\"smsFormObj.authKey\"\n                  name=\"authKey\" required />\n\n              </div>\n              <div class=\"form-group col-sm-4 col-md-3\">\n                <label>Sender ID</label>\n                <br>\n                <input type=\"text\" placeholder=\"Enter sender Id\" class=\"form-control\" [ngModel]=\"smsFormObj.senderId\"\n                  name=\"senderId\" required />\n              </div>\n              <div class=\"form-group col-sm-4 col-md-3\">\n                <div class=\"empty-label\">\n                  <label>&nbsp;</label>\n                  <br>\n                  <button type=\"submit\" class=\"btn btn-success mrR1\" [disabled]=\"smsFormObjCtrl.invalid\">Save</button>\n                </div>\n              </div>\n            </div>\n          </section>\n        </form>\n      </div>\n    </tab>\n\n    <tab>\n      <ng-template tabHeading>\n        <span class=\"icon-mail\"></span> Email\n      </ng-template>\n\n\n      <div class=\"box clearfix mb-2\">\n        <h3 class=\"section_head\">Gmail Integration</h3>\n        <div class=\"d-flex\">\n        <a *ngIf=\"!(isGmailIntegrated$ | async)\" class=\"btn btn-primary\" [href]=\"gmailAuthCodeUrl$ | async\">Connect with\n          Gmail</a>\n        <h4 style=\"align-self: center\" *ngIf=\"(isGmailIntegrated$ | async)\" class=\"text-success\">Gmail integrated successfully.</h4>\n        <button style=\"margin-left: 20px\" *ngIf=\"(isGmailIntegrated$ | async)\" class=\"btn btn-danger\" (click)=\"removegmailintegration.toggle()\">Remove Account</button>\n      </div>\n      </div>\n\n      <!--remove account integration confirmation modal-->\n      <div bsModal #removegmailintegration=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n        <div class=\"modal-dialog modal-lg\">\n          <div class=\"modal-content\">\n            <confirm-modal [title]=\"'Remove Gmail Integration'\" [body]=\"'Are you sure you want to remove gmail account?'\"\n              (cancelCallBack)=\"removegmailintegration.toggle()\" (successCallBack)=\"removeGmailAccount();removegmailintegration.toggle()\"></confirm-modal>\n          </div>\n        </div>\n      </div>\n\n\n\n      <div class=\"box clearfix\">\n        <h3 class=\"fs20 mrB2\">SendGrid</h3>\n        <form #emailform=\"ngForm\" (ngSubmit)=\"onSubmitEmailform(emailform)\" class=\"\">\n          <div class=\"row\">\n            <div class=\"form-group col-sm-4 col-md-3\">\n\n              <label>Auth Key</label>\n              <br>\n              <input type=\"text\" placeholder=\"Enter auth-key\" class=\"form-control\" [ngModel]=\"emailFormObj.authKey\"\n                name=\"authKey\" required />\n\n            </div>\n            <div class=\"form-group col-sm-4 col-md-3\">\n              <label>Email Subject</label>\n              <br>\n              <input type=\"text\" placeholder=\"Enter email subject\" class=\"form-control\" [ngModel]=\"emailFormObj.subject\"\n                name=\"subject\" required />\n            </div>\n            <div class=\"form-group col-sm-4 col-md-3 empty-label\">\n\n              <label>&nbsp;</label>\n              <br>\n              <button type=\"submit\" class=\"btn btn-success mrR1\" [disabled]=\"emailform.invalid\">Save</button>\n\n            </div>\n          </div>\n\n        </form>\n      </div>\n\n    </tab>\n\n    <tab>\n      <ng-template tabHeading>\n        <span class=\"icon-card\"></span> Collection\n      </ng-template>\n\n\n\n      <!-- <h3 class=\"section_head mrT2\">Invoice PaymentPaymentPayment</h3> -->\n      <div class=\"box clearfix mb-2\">\n        <h3 class=\"fs20 mrB2\">Razorpay Details</h3>\n        <form #razorPayform=\"ngForm\" novalidate class=\"\">\n          <div class=\"row\">\n            <div class=\"form-group col-sm-4 col-xs-12\">\n\n              <label>Key Id\n                <span class=\"required\">*</span>\n              </label>\n              <input class=\"form-control\" type=\"text\" placeholder=\"Key Id\" name=\"razorPayObj.userName\"\n                [(ngModel)]=\"razorPayObj.userName\" required autocomplete=\"off\">\n\n            </div>\n            <div class=\"form-group col-sm-4 col-xs-12\">\n              <label>Secret\n                <span class=\"required\">*</span>\n              </label>\n              <input class=\"form-control\" type=\"password\" placeholder=\"Secret key\" name=\"razorPayObj.password\"\n                [(ngModel)]=\"razorPayObj.password\" required autocomplete=\"off\">\n            </div>\n          </div>\n          <div class=\"\">\n            <div class=\"row\">\n              <div class=\"form-group col-sm-4 col-xs-12\">\n                <div class=\"\">\n                  <label>Link Account</label>\n                  <div class=\"input-group\">\n                    <sh-select *ngIf=\"razorPayObj.account\" placeholder=\"Link Account\" name=\"razorPayObj.account\"\n                      [(ngModel)]=\"razorPayObj.account.uniqueName\" [options]=\"accounts$ | async\"\n                      (selected)=\"selectAccount($event)\"></sh-select>\n                    <div class=\"input-group-addon cp\">\n                      <span (click)=\"unlinkAccountFromRazorPay()\" class=\"glyphicon glyphicon-trash\"></span>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"form-group col-sm-4 col-xs-12 mrT1 empty-label\" id=\"inlnImg\">\n                <label>&nbsp;</label>\n                <br>\n                <input type=\"checkbox\" [(ngModel)]=\"razorPayObj.autoCapturePayment\" name=\"autoCapturePayment\" />\n                Automatic capture on payment\n              </div>\n            </div>\n          </div>\n\n\n          <div class=\"row\">\n            <div class=\"col-xs-12 form-group \">\n              <button *ngIf=\"!updateRazor\" class=\"btn btn-success\" [disabled]=\"razorPayform.invalid\"\n                (click)=\"saveRazorPayDetails()\">Save</button>\n              <button *ngIf=\"updateRazor\" class=\"btn btn-success\" [disabled]=\"razorPayform.invalid\"\n                (click)=\"updateRazorPayDetails()\">Update</button>\n              <button *ngIf=\"updateRazor\" class=\"btn btn-danger\" (click)=\"deleteRazorPayDetails()\">Delete</button>\n            </div>\n          </div>\n        </form>\n      </div>\n\n\n\n\n      <!-- <h3 class=\"section_head mrT2\">Cashfree Integration</h3> -->\n      <div class=\"clearfix mb-2\">\n\n        <div class=\"box clearfix mb-2\">\n          <h3 class=\"fs20 mrB2\">Smart Payout</h3>\n\n          <form #payoutForm=\"ngForm\" novalidate class=\"\">\n            <div class=\"row\">\n              <div class=\"form-group col-sm-4 col-xs-12\">\n\n                <label>Client Id\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"text\" placeholder=\"Client Id\" name=\"payoutForm.userName\"\n                  [(ngModel)]=\"payoutObj.userName\" required autocomplete=\"off\">\n              </div>\n\n              <div class=\"form-group col-sm-4 col-xs-12\">\n                <label>Client Secret Key\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"password\" placeholder=\"Client Secret key\" name=\"payoutForm.password\"\n                  [(ngModel)]=\"payoutObj.password\" required autocomplete=\"off\">\n              </div>\n            </div>\n            <div class=\"\">\n              <div class=\"row\">\n                <div class=\"form-group col-sm-4 col-xs-12\">\n                  <div class=\"\">\n                    <label>Link Account</label>\n                    <sh-select placeholder=\"Link Account\" name=\"payoutObj.account\" [(ngModel)]=\"payoutObj.fakeAccObj\"\n                      [options]=\"bankAccounts$ | async\" (selected)=\"selectCashfreeAccount($event, payoutObj)\">\n                    </sh-select>\n                  </div>\n                </div>\n                <div class=\"form-group col-sm-4 col-xs-12 mrT1 empty-label\">\n                  <label>&nbsp;</label>\n                  <br>\n                  <input type=\"checkbox\" [(ngModel)]=\"payoutObj.autoCapturePayment\" name=\"payoutObj.autoCapturePayment\"\n                    [checked]=\"autoCollectObj.account?.uniqueName\" /> Automatic capture on payment\n                </div>\n\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col-xs-12 form-group \">\n                <button *ngIf=\"!payoutAdded\" class=\"btn btn-success\" [disabled]=\"payoutForm.invalid\"\n                  (click)=\"submitCashfreeDetail(payoutObj)\">Save\n                </button>\n                <button *ngIf=\"payoutAdded\" class=\"btn btn-success\" [disabled]=\"payoutForm.invalid\"\n                  (click)=\"updateCashfreeDetail(payoutObj)\">Update\n                </button>\n                <button *ngIf=\"payoutAdded\" class=\"btn btn-danger\" (click)=\"deleteCashFreeAccount()\">Delete</button>\n                <!--  -->\n              </div>\n            </div>\n          </form>\n        </div>\n\n\n        <div class=\"box clearfix mb-2\">\n          <h3 class=\"fs20 mrB2\">Auto Collect</h3>\n          <form #autoCollectform=\"ngForm\" novalidate class=\"\">\n            <div class=\"row\">\n              <div class=\"form-group col-sm-4 col-xs-12\">\n\n                <label>Client Id\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"text\" placeholder=\"Client Id\" name=\"autoCollectform.userName\"\n                  [(ngModel)]=\"autoCollectObj.userName\" required autocomplete=\"off\">\n\n              </div>\n              <div class=\"form-group col-sm-4 col-xs-12\">\n                <label>Client Secret Key\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"password\" placeholder=\"Client Secret key\"\n                  name=\"autoCollectform.password\" [(ngModel)]=\"autoCollectObj.password\" required autocomplete=\"off\">\n              </div>\n            </div>\n            <div class=\"\">\n              <div class=\"row\">\n                <div class=\"form-group col-sm-4 col-xs-12\">\n                  <div class=\"\">\n                    <label>Link Account</label>\n                    <sh-select placeholder=\"Link Account\" name=\"autoCollectObj.account\"\n                      [(ngModel)]=\"autoCollectObj.fakeAccObj\" [options]=\"bankAccounts$ | async\"\n                      (selected)=\"selectCashfreeAccount($event, autoCollectObj)\"></sh-select>\n                  </div>\n                </div>\n                <div class=\"form-group col-sm-4 col-xs-12 mrT1 empty-label\">\n                  <label>&nbsp;</label>\n                  <br>\n                  <input type=\"checkbox\" [(ngModel)]=\"autoCollectObj.autoCapturePayment\"\n                    name=\"autoCollectObj.autoCapturePayment\" [checked]=\"autoCollectObj.account?.uniqueName\" /> Automatic\n                  capture on payment\n                </div>\n\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"col-xs-12 form-group \">\n                <button type=\"submit\" *ngIf=\"!autoCollectAdded\" class=\"btn btn-success\"\n                  [disabled]=\"autoCollectform.invalid\" (click)=\"submitAutoCollect(autoCollectObj)\">Save\n                </button>\n                <button type=\"submit\" *ngIf=\"autoCollectAdded\" class=\"btn btn-success\"\n                  [disabled]=\"autoCollectform.invalid\" (click)=\"updateAutoCollect(autoCollectObj)\">Update\n                </button>\n                <button type=\"reset\" *ngIf=\"autoCollectAdded\" class=\"btn btn-danger\"\n                  (click)=\"deleteAutoCollect()\">Delete\n                </button>\n                <!--  -->\n              </div>\n            </div>\n          </form>\n        </div>\n\n\n        <div class=\"box clearfix mb-2\">\n          <h3 class=\"fs20 mrB2\">Payment Gateway</h3>\n          <form #paymentGatewayForm=\"ngForm\" novalidate class=\"\">\n            <div class=\"row\">\n              <div class=\"form-group col-sm-4 col-xs-12\">\n\n                <label>Client Id\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"text\" placeholder=\"Client Id\" name=\"paymentGateway.userName\"\n                  [(ngModel)]=\"paymentGateway.userName\" required autocomplete=\"off\">\n\n              </div>\n              <div class=\"form-group col-sm-4 col-xs-12\">\n                <label>Client Secret Key\n                  <span class=\"required\">*</span>\n                </label>\n                <input class=\"form-control\" type=\"password\" placeholder=\"Client Secret key\"\n                  name=\"paymentGateway.password\" [(ngModel)]=\"paymentGateway.password\" required autocomplete=\"off\">\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-xs-12 form-group \">\n                <button *ngIf=\"!paymentGatewayAdded\" class=\"btn btn-success\" [disabled]=\"paymentGatewayForm.invalid\"\n                  (click)=\"submitPaymentGateway(paymentGateway)\">Save\n                </button>\n                <button *ngIf=\"paymentGatewayAdded\" class=\"btn btn-success\" [disabled]=\"paymentGatewayForm.invalid\"\n                  (click)=\"updatePaymentGateway(paymentGateway)\">Update\n                </button>\n                <button *ngIf=\"paymentGatewayAdded\" type=\"reset\" class=\"btn btn-danger\"\n                  (click)=\"deletePaymentGateway()\">\n                  Delete\n                </button>\n                <!-- *ngIf=\"autoCollectAdded\" -->\n              </div>\n            </div>\n          </form>\n        </div>\n      </div>\n\n    </tab>\n\n    <tab>\n      <ng-template tabHeading>\n        <span class=\"icon-ecomm\"></span> E-Comm\n      </ng-template>\n\n\n\n\n      <div class=\"box clearfix\">\n        <h3 class=\"section_head mb-2\">Amazon Seller</h3>\n        <form #formDiv name=\"amazonSellerForm\" [formGroup]=\"amazonSellerForm\" novalidate=\"\" autocomplete=\"off\">\n          <ng-container formArrayName=\"sellers\">\n            <ng-container\n              *ngFor=\"let item of amazonSellerForm.get('sellers')['controls']; let i=index;let f = first; let l = last\">\n              <div class=\"clearfix\" [formGroupName]=\"i\">\n                <!-- <div class=\"mrR1 pull-left\" [ngClass]=\"{'mrT3': f}\">\n                            <input type=\"checkbox\" />\n                        </div>  -->\n\n                <div class=\"row\">\n                  <div class=\"form-group col-sm-2 col-xs-12\">\n\n                    <label *ngIf=\"f\">Seller Id<span class=\"required\">*</span></label>\n                    <input class=\"form-control\" type=\"text\" placeholder=\"Seller Id\" required autocomplete=\"off\"\n                      formControlName=\"sellerId\" [disabled]=\"i !== amazonEditItemIdx\" />\n\n                  </div>\n                  <div class=\"form-group col-sm-2 col-xs-12\">\n                    <label *ngIf=\"f\">Access Key<span class=\"required\">*</span></label>\n                    <input class=\"form-control\" type=\"text\" placeholder=\"Access key\" required autocomplete=\"off\"\n                      formControlName=\"accessKey\" [disabled]=\"i !== amazonEditItemIdx\" />\n                  </div>\n                  <div class=\"form-group col-sm-3 col-xs-12 \">\n                    <label *ngIf=\"f\">AuthToken<span class=\"required\">*</span></label>\n                    <input class=\"form-control\" type=\"text\" placeholder=\"AuthToken key\" required autocomplete=\"off\"\n                      formControlName=\"mwsAuthToken\" [disabled]=\"i !== amazonEditItemIdx\" />\n                  </div>\n\n\n                  <div class=\"form-group col-sm-3 col-xs-9\">\n                    <label *ngIf=\"f\">Secret Key<span class=\"required\">*</span></label>\n                    <input class=\"form-control\" type=\"text\" placeholder=\"Secret key\" required autocomplete=\"off\"\n                      formControlName=\"secretKey\" [disabled]=\"i !== amazonEditItemIdx\" />\n                  </div>\n                  <div class=\"pull-left\">\n                    <div [ngClass]=\"{'mt-27': f}\">\n                      <button type=\"button\" class=\"btn btn-default\" (click)=\"saveAmazonSeller(item)\" *ngIf=\"l\"><i\n                          class=\"fa fa-check\"></i></button>\n                      <button type=\"button\" class=\"btn btn-default\" (click)=\"updateAmazonSeller(item)\"\n                        *ngIf=\"i === amazonEditItemIdx && !l\"><i class=\"fa fa-check\"></i></button>\n                      <button type=\"button\" class=\"btn btn-default\" (click)=\"editAmazonSeller(i)\"\n                        *ngIf=\"i !== amazonEditItemIdx && !l\"><i class=\"fa fa-edit\"></i></button>\n                      <button type=\"button\" class=\"btn btn-danger\"\n                        (click)=\"deleteAmazonSeller(item.get('sellerId').value, i)\" *ngIf=\"!l\"><i\n                          class=\"fa fa-trash-o\"></i></button>\n                    </div>\n                  </div>\n                </div>\n\n\n              </div>\n            </ng-container>\n          </ng-container>\n        </form>\n\n        <div class=\"row mt-1\">\n          <div class=\"col-xs-12 form-group \">\n            <!-- <button class=\"btn btn-success\" (click)=\"saveAmazonSeller()\">Save</button> -->\n            <button class=\"btn btn-success\" (click)=\"addAmazonSellerRow()\">Add more</button>\n            <!-- <button class=\"btn btn-danger\">Delete</button> -->\n          </div>\n        </div>\n      </div>\n\n\n    </tab>\n    <tab>\n      <ng-template tabHeading>\n        <span class=\"icon-payment\"></span> Payment\n      </ng-template>\n      <div *ngFor=\"let regAcc of registeredAccount; let ind=index\">\n        <div class=\"box clearfix\">\n          <div style=\"clear: both\">\n            <h2 style=\"float: left; font-size: 20px\">ICICI Bank</h2>\n            <button type=\"button\" style=\"float: right; margin-right: 5px\" class=\"btn btn-danger mrR1\"\n              (click)=\"deRegisterForm(regAcc)\">Remove</button>\n          </div>\n          <br />\n          <br />\n          <div class=\"form-group col-sm-4 col-md-3\">\n            <div class=\"row\">\n              <label>Corporate ID <span class=\"required\">*</span></label>\n              <br>\n              <input type=\"text\" placeholder=\"Enter Corporate ID\" class=\"form-control\"\n                [ngModel]=\"regAcc.iciciCorporateDetails.corpId\" disabled />\n            </div>\n          </div>\n          <div class=\"form-group col-sm-4 col-md-3\">\n            <label>User ID <span class=\"required\">*</span></label>\n            <br>\n            <input type=\"text\" placeholder=\"Enter User ID\" class=\"form-control\"\n              [ngModel]=\"regAcc.iciciCorporateDetails.userId\" disabled />\n          </div>\n          <div class=\"form-group col-sm-4 col-md-3\">\n            <label>Account Number <span class=\"required\">*</span></label>\n            <br>\n            <input type=\"text\" placeholder=\"Enter Account Number\" class=\"form-control\"\n              [ngModel]=\"regAcc.iciciCorporateDetails.accountNo\" disabled />\n          </div>\n          <div class=\"form-group col-sm-4 col-md-3\">\n            <label>Accounts <span class=\"required\">*</span></label>\n            <br>\n            <sh-select [options]=\"(accounts$ | async)\" name=\"accountUniqueName\" [(ngModel)]=\"regAcc.account.name\"\n              [placeholder]=\"'Select Account'\" [ItemHeight]=\"33\" autocomplete=\"off\">\n            </sh-select>\n          </div>\n          <div class=\"row\">\n            <div class=\"form-group col-sm-3 col-md-3\">\n              <label>&nbsp;</label>\n              <br>\n              <button type=\"button\" class=\"btn btn-success mrR1\"\n                (click)=\"updateICICDetails(regAcc, ind)\">Update</button>\n            </div>\n          </div>\n\n          <div style=\"display: inline\" *ngIf=\"(isPaymentUpdationSuccess$ | async) && ind === selecetdUpdateIndex\">\n            <div class=\"row\">\n              <div>Congratulations!! A request has been sent to your account, go to <a href=\"https://www.icicibank.com/\"\n                  target=\"_blank\">ICICI portal</a> and accept it.</div>\n            </div>\n            <div class=\"row\">\n              <div style=\"color: gray\">Once it is done you can link your ICICI account/s and make payment directly\n                through GIDDH.</div>\n            </div>\n          </div>\n        </div>\n        <br />\n      </div>\n      <div *ngIf=\"openNewRegistration\" class=\"box clearfix\">\n        <h3 class=\"fs20 mrB2\">ICICI Bank</h3>\n        <form #paymentForm=\"ngForm\" (ngSubmit)=\"onSubmitPaymentform(paymentForm)\" class=\"row\">\n          <div class=\"form-group col-sm-3 col-md-2\">\n            <div class=\"\">\n              <label>Corporate ID <span class=\"required\">*</span></label>\n              <br>\n              <input type=\"text\" placeholder=\"Enter Corporate ID\" class=\"form-control\" [ngModel]=\"paymentFormObj.corpId\"\n                name=\"corpId\" required autocomplete=\"off\" />\n            </div>\n          </div>\n          <div class=\"form-group col-sm-3 col-md-2\">\n            <label>User ID <span class=\"required\">*</span></label>\n            <br>\n            <input type=\"text\" placeholder=\"Enter User ID\" class=\"form-control\" [ngModel]=\"paymentFormObj.userId\"\n              name=\"userId\" required autocomplete=\"off\" />\n          </div>\n          <div class=\"form-group col-sm-3 col-md-2\">\n            <label>Account Number <span class=\"required\">*</span></label>\n            <br>\n            <input type=\"text\" placeholder=\"Enter Account Number\" class=\"form-control\"\n              [ngModel]=\"paymentFormObj.accountNo\" name=\"accountNo\" required autocomplete=\"off\" />\n          </div>\n          <div class=\"form-group col-sm-3 col-md-2\">\n            <label>Accounts <span class=\"required\">*</span></label>\n            <br>\n            <sh-select [options]=\"(accounts$ | async)\" name=\"accountUniqueName\"\n              [(ngModel)]=\"paymentFormObj.accountUniqueName\" [placeholder]=\"'Select Account'\" [ItemHeight]=\"33\"\n              autocomplete=\"off\">\n            </sh-select>\n          </div>\n          <div class=\"form-group col-sm-3 col-md-3\">\n            <div class=\"empty-label\">\n              <label>&nbsp;</label>\n              <br>\n              <button type=\"submit\" class=\"btn btn-success mrR1\" [disabled]=\"paymentForm.invalid\">Submit</button>\n            </div>\n          </div>\n        </form>\n\n        <div *ngIf=\"(isPaymentAdditionSuccess$ | async)\">\n          <div style=\"display: inline-block\" class=\"row\">\n            <div>Congratulations!! A request has been sent to your account, go to <a href=\"https://www.icicibank.com/\"\n                target=\"_blank\">ICICI portal</a> and accept it.</div>\n          </div>\n          <div class=\"row\">\n            <div style=\"color: gray\">Once it is done you can link your ICICI account/s and make payment directly through\n              GIDDH.</div>\n          </div>\n        </div>\n      </div>\n      <button type=\"button\" *ngIf=\"!openNewRegistration || (isPaymentAdditionSuccess$ | async)\"\n        style=\" margin-right: 5px\" class=\"btn btn-blue mrR1\" (click)=\"openNewRegistartionForm()\">Add More ID</button>\n    </tab>\n\n  </tabset>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/integration/setting.integration.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/settings/integration/setting.integration.component.ts ***!
  \***********************************************************************/
/*! exports provided: SettingIntegrationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingIntegrationComponent", function() { return SettingIntegrationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../actions/settings/settings.integration.action */ "./src/app/actions/settings/settings.integration.action.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../models/api-models/SettingsIntegraion */ "./src/app/models/api-models/SettingsIntegraion.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");














var SettingIntegrationComponent = /** @class */ (function () {
    function SettingIntegrationComponent(router, store, settingsIntegrationActions, accountService, toasty, _companyActions, _fb) {
        this.router = router;
        this.store = store;
        this.settingsIntegrationActions = settingsIntegrationActions;
        this.accountService = accountService;
        this.toasty = toasty;
        this._companyActions = _companyActions;
        this._fb = _fb;
        this.smsFormObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["SmsKeyClass"]();
        this.emailFormObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["EmailKeyClass"]();
        this.paymentFormObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["PaymentClass"]();
        this.razorPayObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["RazorPayClass"]();
        this.payoutObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
        this.autoCollectObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
        this.paymentGateway = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
        this.amazonSeller = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["AmazonSellerClass"]();
        this.updateRazor = false;
        this.paymentGatewayAdded = false;
        this.autoCollectAdded = false;
        this.payoutAdded = false;
        this.gmailAuthCodeUrl$ = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.gmailAuthCodeStaticUrl = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
        this.isSellerAdded = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.isSellerUpdate = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.flattenAccountsStream$ = this.store.select(function (s) { return s.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl("http://test.giddh.com/")).replace(':client_id', this.getGoogleCredentials("http://test.giddh.com/").GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(this.gmailAuthCodeStaticUrl);
        this.isSellerAdded = this.store.select(function (s) { return s.settings.amazonState.isSellerSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isSellerUpdate = this.store.select(function (s) { return s.settings.amazonState.isSellerUpdated; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isGmailIntegrated$ = this.store.select(function (s) { return s.settings.isGmailIntegrated; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isPaymentAdditionSuccess$ = this.store.select(function (s) { return s.settings.isPaymentAdditionSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isPaymentUpdationSuccess$ = this.store.select(function (s) { return s.settings.isPaymentUpdationSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    SettingIntegrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        //logic to switch to payment tab if coming from vedor tabs add payment
        if (this.selectedTabParent) {
            this.selectTab(this.selectedTabParent);
        }
        // getting all page data of integration page
        this.store.select(function (p) { return p.settings.integration; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            // set sms form data
            if (o.smsForm) {
                _this.smsFormObj = o.smsForm;
            }
            // set email form data
            if (o.emailForm) {
                _this.emailFormObj = o.emailForm;
            }
            //set payment form data
            if (o.paymentForm) {
                _this.paymentFormObj = o.paymentForm;
            }
            // set razor pay form data
            if (o.razorPayForm) {
                _this.razorPayObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o.razorPayForm);
                _this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
                _this.updateRazor = true;
            }
            else {
                _this.setDummyData();
                _this.updateRazor = false;
            }
            // set cashfree form data
            if (o.payoutForm && o.payoutForm.userName) {
                _this.payoutObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o.payoutForm);
                // this.payoutObj.password = 'YOU_ARE_NOT_ALLOWED';
                _this.payoutAdded = true;
            }
            else {
                _this.payoutObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
                _this.payoutAdded = false;
            }
            if (o.autoCollect && o.autoCollect.userName) {
                _this.autoCollectObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o.autoCollect);
                // this.autoCollectObj.password = 'YOU_ARE_NOT_ALLOWED';
                _this.autoCollectAdded = true;
            }
            else {
                _this.autoCollectObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
                _this.autoCollectAdded = false;
            }
            if (o.paymentGateway && o.paymentGateway.userName) {
                _this.paymentGateway = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o.paymentGateway);
                _this.paymentGatewayAdded = true;
            }
            else {
                _this.paymentGateway = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["CashfreeClass"]();
                _this.paymentGatewayAdded = false;
            }
            if (o.amazonSeller && o.amazonSeller.length) {
                _this.amazonSellerRes = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o.amazonSeller);
                _this.amazonSellerForm.controls['sellers'].patchValue(_this.amazonSellerRes);
                // this.amazonSellerForm.controls['sellers'].disable();
                _this.addAmazonSellerRow();
            }
        });
        this.flattenAccountsStream$.subscribe(function (data) {
            if (data) {
                var accounts_1 = [];
                var bankAccounts_1 = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["forEach"](data, function (item) {
                    accounts_1.push({ label: item.name, value: item.uniqueName });
                    var findBankIndx = item.parentGroups.findIndex(function (grp) { return grp.uniqueName === 'bankaccounts'; });
                    if (findBankIndx !== -1) {
                        bankAccounts_1.push({ label: item.name, value: item.uniqueName });
                    }
                });
                _this.accounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(accounts_1);
                _this.bankAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(accounts_1);
            }
        });
        this.amazonSellerForm = this._fb.group({
            sellers: this._fb.array([
                this.initAmazonReseller()
            ])
        });
        this.isSellerAdded.subscribe(function (a) {
            if (a) {
                _this.addAmazonSellerRow();
            }
        });
        this.isSellerUpdate.subscribe(function (a) {
            if (a) {
                // console.log('isSellerUpdate', a);
                _this.amazonEditItemIdx = null;
                _this.store.dispatch(_this.settingsIntegrationActions.GetAmazonSellers());
            }
        });
        //logic to get all registered account for integration tab
        this.store.dispatch(this._companyActions.getAllRegistrations());
        this.store.select(function (p) { return p.company; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.account) {
                _this.registeredAccount = o.account;
                if (_this.registeredAccount && _this.registeredAccount.length === 0) {
                    _this.openNewRegistration = true;
                }
            }
        });
    };
    SettingIntegrationComponent.prototype.getInitialData = function () {
        this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
        this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
        this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
        this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
        this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
    };
    SettingIntegrationComponent.prototype.setDummyData = function () {
        this.razorPayObj.userName = '';
        this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.razorPayObj.account = { name: null, uniqueName: null };
        this.razorPayObj.autoCapturePayment = true;
    };
    SettingIntegrationComponent.prototype.onSubmitMsgform = function (f) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveSMSKey(f.value.smsFormObj));
        }
    };
    SettingIntegrationComponent.prototype.onSubmitEmailform = function (f) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SaveEmailKey(f.value));
        }
    };
    SettingIntegrationComponent.prototype.onSubmitPaymentform = function (f) {
        if (f.valid) {
            this.store.dispatch(this.settingsIntegrationActions.SavePaymentInfo(f.value));
        }
    };
    SettingIntegrationComponent.prototype.toggleCheckBox = function () {
        return this.razorPayObj.autoCapturePayment = !this.razorPayObj.autoCapturePayment;
    };
    SettingIntegrationComponent.prototype.selectAccount = function (event) {
        var _this = this;
        if (event.value) {
            this.accounts$.subscribe(function (arr) {
                var res = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["find"](arr, function (o) { return o.value === event.value; });
                if (res) {
                    _this.razorPayObj.account.name = res.text;
                }
            });
        }
    };
    SettingIntegrationComponent.prototype.saveRazorPayDetails = function () {
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.SaveRazorPayDetails(data));
    };
    SettingIntegrationComponent.prototype.updateRazorPayDetails = function () {
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.razorPayObj);
        this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
    };
    SettingIntegrationComponent.prototype.unlinkAccountFromRazorPay = function () {
        if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account.uniqueName) {
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.razorPayObj);
            data.account.uniqueName = null;
            data.account.name = null;
            this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
        }
        else {
            this.toasty.warningToast('You don\'t have any account linked with Razorpay.');
        }
    };
    SettingIntegrationComponent.prototype.deleteRazorPayDetails = function () {
        this.store.dispatch(this.settingsIntegrationActions.DeleteRazorPayDetails());
    };
    SettingIntegrationComponent.prototype.removeGmailAccount = function () {
        this.store.dispatch(this.settingsIntegrationActions.RemoveGmailIntegration());
    };
    SettingIntegrationComponent.prototype.selectCashfreeAccount = function (event, objToApnd) {
        var accObj = {
            name: event.label,
            uniqueName: event.value
        };
        objToApnd.account = accObj;
    };
    SettingIntegrationComponent.prototype.submitCashfreeDetail = function (f) {
        if (f.userName && f.password) {
            var objToSend = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](f);
            this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
        }
    };
    SettingIntegrationComponent.prototype.deleteCashFreeAccount = function () {
        this.store.dispatch(this.settingsIntegrationActions.DeleteCashfreeDetails());
    };
    SettingIntegrationComponent.prototype.updateCashfreeDetail = function (f) {
        if (f.userName && f.password) {
            var objToSend = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateCashfreeDetails(objToSend));
        }
    };
    SettingIntegrationComponent.prototype.submitAutoCollect = function (f) {
        if (f.userName && f.password) {
            var objToSend = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](f);
            this.store.dispatch(this.settingsIntegrationActions.AddAutoCollectUser(objToSend));
        }
    };
    SettingIntegrationComponent.prototype.updateAutoCollect = function (f) {
        if (f.userName && f.password) {
            var objToSend = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](f);
            this.store.dispatch(this.settingsIntegrationActions.UpdateAutoCollectUser(objToSend));
        }
    };
    SettingIntegrationComponent.prototype.deleteAutoCollect = function () {
        this.store.dispatch(this.settingsIntegrationActions.DeleteAutoCollectUser());
    };
    /**
     * submitPaymentGateway
     */
    SettingIntegrationComponent.prototype.submitPaymentGateway = function (f) {
        if (f.userName && f.password) {
            this.store.dispatch(this.settingsIntegrationActions.AddPaymentGateway(f));
        }
    };
    /**
     * UpdatePaymentGateway
     */
    SettingIntegrationComponent.prototype.updatePaymentGateway = function (f) {
        if (f.userName && f.password) {
            this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentGateway(f));
        }
    };
    /**
     * DeletePaymentGateway
     */
    SettingIntegrationComponent.prototype.deletePaymentGateway = function () {
        this.store.dispatch(this.settingsIntegrationActions.DeletePaymentGateway());
    };
    /**
     * saveAmazonSeller
     */
    SettingIntegrationComponent.prototype.saveAmazonSeller = function (obj) {
        var sellers = [];
        sellers.push(_lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](obj.value));
        this.store.dispatch(this.settingsIntegrationActions.AddAmazonSeller(sellers));
    };
    /**
     * updateAmazonSeller
     */
    SettingIntegrationComponent.prototype.updateAmazonSeller = function (obj) {
        if (!obj.value.sellerId) {
            return;
        }
        var sellerObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](obj.value);
        delete sellerObj['secretKey'];
        this.store.dispatch(this.settingsIntegrationActions.UpdateAmazonSeller(sellerObj));
    };
    /**
     * deleteAmazonSeller
     */
    SettingIntegrationComponent.prototype.deleteAmazonSeller = function (sellerId, idx) {
        var seller = this.amazonSellerRes.findIndex(function (o) { return o.sellerId === sellerId; });
        if (seller > -1) {
            this.store.dispatch(this.settingsIntegrationActions.DeleteAmazonSeller(sellerId));
            this.removeAmazonSeller(idx);
        }
        else {
            this.removeAmazonSeller(idx);
        }
    };
    // initial initAmazonReseller controls
    SettingIntegrationComponent.prototype.initAmazonReseller = function () {
        // initialize our controls
        return this._fb.group({
            sellerId: [''],
            mwsAuthToken: [''],
            accessKey: [''],
            secretKey: ['']
        });
    };
    SettingIntegrationComponent.prototype.addAmazonSellerRow = function (i, item) {
        var AmazonSellerControl = this.amazonSellerForm.controls['sellers'];
        var control = this.amazonSellerForm.controls['sellers'];
        if (item) {
            if (control.controls[i]) {
                control.controls[i].patchValue(item);
                if (control.controls[i].value.sellerId) {
                    control.controls[i].disable();
                }
            }
            else {
                control.push(this.initAmazonReseller());
                setTimeout(function () {
                    control.controls[i].patchValue(item);
                    if (control.controls[i].value.sellerId) {
                        control.controls[i].disable();
                    }
                }, 200);
            }
        }
        else {
            var arr = control.value;
            if (!control.value[arr.length - 1].sellerId) {
                return;
            }
            control.push(this.initAmazonReseller());
        }
    };
    // remove amazon Seller controls
    SettingIntegrationComponent.prototype.removeAmazonSeller = function (i) {
        // remove address from the list
        var control = this.amazonSellerForm.controls['sellers'];
        if (control.length > 1) {
            control.removeAt(i);
        }
        else {
            control.controls[0].reset();
        }
    };
    /**
     * editAmazonSeller
     */
    SettingIntegrationComponent.prototype.editAmazonSeller = function (idx) {
        this.enableDisableAmazonControl(idx, 'enable');
        this.amazonEditItemIdx = idx;
    };
    /**
     * enableDisableAmazonControl
     */
    SettingIntegrationComponent.prototype.enableDisableAmazonControl = function (idx, type) {
        var control = this.amazonSellerForm.controls['sellers'];
        if (type === 'enable') {
            control.controls[idx].enable();
        }
        else {
            control.controls[idx].disable();
        }
    };
    SettingIntegrationComponent.prototype.getRedirectUrl = function (baseHref) {
        if (baseHref.indexOf('dev.giddh.com') > -1) {
            return 'http://dev.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('test.giddh.com') > -1) {
            return 'http://test.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('stage.giddh.com') > -1) {
            return 'http://stage.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('localapp.giddh.com') > -1) {
            return 'http://localapp.giddh.com:3000/pages/settings?tab=integration';
        }
        else {
            return 'https://giddh.com/app/pages/settings?tab=integration';
        }
    };
    SettingIntegrationComponent.prototype.getGoogleCredentials = function (baseHref) {
        if (baseHref === 'https://giddh.com/' || false) {
            return {
                GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com'
            };
        }
        else {
            return {
                GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com'
            };
        }
    };
    SettingIntegrationComponent.prototype.selectTab = function (id) {
        this.integrationTab.tabs[id].active = true;
    };
    SettingIntegrationComponent.prototype.openNewRegistartionForm = function () {
        this.paymentFormObj = new _models_api_models_SettingsIntegraion__WEBPACK_IMPORTED_MODULE_9__["PaymentClass"]();
        //logic to get all registered account for integration tab
        this.store.dispatch(this._companyActions.getAllRegistrations());
        this.openNewRegistration = true;
    };
    SettingIntegrationComponent.prototype.deRegisterForm = function (regAcc) {
        this.store.dispatch(this.settingsIntegrationActions.RemovePaymentInfo(regAcc.iciciCorporateDetails.URN));
    };
    SettingIntegrationComponent.prototype.updateICICDetails = function (regAcc, index) {
        this.selecetdUpdateIndex = index;
        var requestData = {
            URN: regAcc.iciciCorporateDetails.URN,
            accountUniqueName: regAcc.account.uniqueName
        };
        this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentInfo(requestData));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SettingIntegrationComponent.prototype, "selectedTabParent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('integrationTab'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["TabsetComponent"])
    ], SettingIntegrationComponent.prototype, "integrationTab", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('removegmailintegration'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_12__["ModalDirective"])
    ], SettingIntegrationComponent.prototype, "removegmailintegration", void 0);
    SettingIntegrationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'setting-integration',
            template: __webpack_require__(/*! ./setting.integration.component.html */ "./src/app/settings/integration/setting.integration.component.html"),
            styles: ["\n#inlnImg img {\nmax-height: 18px;\n}\n\n.fs18 {\nfont-weight: bold;\n}\n\n.pdBth20 {\npadding: 0 20px;\n}\n\n@media(max-waidth:768px){\n\n  .empty-label label , .empty-label br{\n    display:none;\n  }\n}\n\n@media(max-width:767px){\n#inlnImg {\nmargin-top: 0;\n}\n#inlnImg label , .inlnImg label {\nmargin: 0;\ndisplay: none;\n}\n\n}\n"]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_7__["SettingsIntegrationActions"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_10__["AccountService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__["ToasterService"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__["CompanyActions"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"]])
    ], SettingIntegrationComponent);
    return SettingIntegrationComponent;
}());



/***/ }),

/***/ "./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"\">\n  <div class=\"modal-header\">\n    <h3 class=\"\" id=\"modal-title\">Confirmation </h3>\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n    <!-- <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onCancel()\"></i> -->\n  </div>\n  <div class=\"modal-body clearfix\" id=\"export-body\">\n    <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n      <div class=\"\">\n        <h3>{{message}}</h3>\n      </div>\n    </form>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"submit\" class=\"btn btn-md btn-success\" (click)=\"onConfirmation()\">Yes</button>\n    <button type=\"submit\" class=\"btn btn-md btn-danger\" (click)=\"onCancel()\">No</button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: SettingLinkedAccountsConfirmationModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingLinkedAccountsConfirmationModalComponent", function() { return SettingLinkedAccountsConfirmationModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var SettingLinkedAccountsConfirmationModalComponent = /** @class */ (function () {
    function SettingLinkedAccountsConfirmationModalComponent() {
        this.closeModelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
    }
    SettingLinkedAccountsConfirmationModalComponent.prototype.onConfirmation = function () {
        this.closeModelEvent.emit(true);
    };
    SettingLinkedAccountsConfirmationModalComponent.prototype.onCancel = function () {
        this.closeModelEvent.emit(false);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SettingLinkedAccountsConfirmationModalComponent.prototype, "message", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SettingLinkedAccountsConfirmationModalComponent.prototype, "closeModelEvent", void 0);
    SettingLinkedAccountsConfirmationModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'setting-l-acc-confirmation-modal',
            template: __webpack_require__(/*! ./confirmation.modal.component.html */ "./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.html")
        })
    ], SettingLinkedAccountsConfirmationModalComponent);
    return SettingLinkedAccountsConfirmationModalComponent;
}());



/***/ }),

/***/ "./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.html":
/*!***********************************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n  <!-- <i class=\"fa fa-times text-right close_modal\" data-dismiss=\"modal\" aria-hidden=\"true\"  aria-label=\"Close\"></i> -->\n  <h3 class=\"\">Connect Banks</h3>\n</div>\n<div id=\"myFrame\" class=\"modal-body clearfix\">\n  <div class=\"\" *ngIf=\"step === 1\">\n    <div class=\"form-group\">\n      <label>Search Provider <sup>*</sup></label>\n      <input [ngbTypeahead]=\"dataSource\" type=\"text\" [(ngModel)]=\"selectedProvider.name\" name=\"providers\"\n        [resultTemplate]=\"rt\" (selectItem)=\"typeaheadOnSelect($event)\" class=\"form-control\" autocomplete=\"off\" required\n        maxlength=\"50\" placeholder=\"Search Provider\" pattern=\"^[^\\s]+(\\s+[^\\s]+)*$\">\n\n      <ng-template #rt let-r=\"result\" let-t=\"term\">\n        <span (keyup.enter)=\"typeaheadOnSelect(r)\"> <span class=\"provider_ico\"><img src=\"{{r.favicon}}\" /></span>\n          {{ r.name }} <label *ngIf=\"r.countryISOCode\">({{r.countryISOCode}})</label></span>\n      </ng-template>\n    </div>\n    <button class=\"btn btn-success btn-sm\" (click)=\"onSelectProvider()\" [disabled]=\"!selectedProvider.id\">Next</button>\n  </div>\n\n  <div class=\"\" *ngIf=\"step === 2\">\n    <h4 class=\"lead grey_clr\">{{ selectedProvider.name }}</h4>\n    <form #formDiv name=\"loginForm\" [formGroup]=\"loginForm\" novalidate=\"\" autocomplete=\"off\"\n      (ngSubmit)=\"onSubmitLoginForm()\">\n      <div formArrayName=\"row\" class=\"row\">\n        <div class=\"col-xs-12\"\n          *ngFor=\"let item of loginForm.get('row')['controls']; let i=index;let f = first; let l = last\">\n          <div [formGroupName]=\"i\" class=\"form-group\">\n            <ng-container formArrayName=\"field\">\n              <ng-container *ngFor=\"let fields of item.get('field').controls; let idx=index;\">\n                <ng-container [formGroupName]=\"idx\">\n                  <label> {{item.get('label').value}} <sup\n                      *ngIf=\"fields.get('isOptional').value === 'false'\">*</sup></label>\n                  <input [type]=\"fields.get('type').value\" [required]=\"fields.get('isOptional').value === 'false'\"\n                    [disabled]=\"fields.get('valueEditable').value === 'false'\" class=\"form-control\"\n                    formControlName=\"value\"\n                    *ngIf=\"fields.get('type').value !== 'option' && fields.get('id').value !== 'image' && fields.get('type').value !== 'checkbox' && fields.get('type').value !== 'radio'\" />\n                  <select class=\"form-control\" *ngIf=\"fields.get('type').value === 'option'\" formControlName=\"value\">\n                    <option [ngValue]=\"null\" [selected]=\"true\">Select Type</option>\n                    <option *ngFor=\"let list of fields.get('option')?.value\" [ngValue]=\"list.optionValue\">\n                      {{list.displayText}}\n                    </option>\n                  </select>\n                  <ng-container *ngIf=\"fields.get('id').value === 'image'\">\n                    <img class=\"img-responsive max150\" [src]=\"base64StringForModel\" />\n                    <label>Enter above text</label>\n                    <input [type]=\"fields.get('type').value\" formControlName=\"value\"\n                      [required]=\"fields.get('isOptional').value === 'false'\" class=\"form-control\" />\n                  </ng-container>\n                </ng-container>\n              </ng-container>\n            </ng-container>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"btn btn-default btn-sm\" type=\"button\" (click)=\"resetBankForm()\" [disabled]=\"bankSyncInProgress\"\n        *ngIf=\"isRefreshWithCredentials\">\n        Back\n      </button>\n      <button class=\"btn btn-success btn-sm\" type=\"submit\" *ngIf=\"isRefreshWithCredentials\"\n        [disabled]=\"bankSyncInProgress\">Submit</button>\n      <button class=\"btn btn-success btn-sm\" type=\"button\" *ngIf=\"!isRefreshWithCredentials\"\n        (click)=\"refreshAccount(loginForm)\" [disabled]=\"bankSyncInProgress\">Update</button>\n      <small *ngIf=\"bankSyncInProgress\" class=\"grey_clr clearfix mrT2 col-xs-12 row\">Status: <span\n          class=\"primary_clr\">Authenticating..</span>\n        <!-- <p>You can wait or check again in 15-20 min</p> -->\n      </small>\n    </form>\n  </div>\n  <!-- <p class=\"text-center\" *ngIf=\"isIframeLoading; else frame\">Loading...</p>\n  <ng-template #frame>\n      <iframe id=\"player\" *ngIf=\"url\" class=\"embed-responsive-item\" [src]=\"url\" frameborder=\"0\"></iframe>\n  </ng-template> -->\n</div>\n\n<div class=\"modal-footer text-center\">\n  <div class=\"row\">\n    <div class=\"text-left col-xs-12 col-sm-8\">\n      <small><i class=\"fa fa-lock\"></i> At giddh, the privacy and security of your information are top priorites.\n      </small>\n    </div>\n    <div class=\"text-right col-xs-12 col-sm-4\">\n      <img src=\"https://ssl.comodo.com/images/trusted-site-seal.png\" alt=\"Comodo Trusted Site Seal\" width=\"113\"\n        height=\"59\" style=\"border: 0px;\">\n    </div>\n  </div>\n  <!-- <br> <span style=\"font-weight:bold; font-size:7pt\"><a href=\"https://ssl.comodo.com\">SSL Certificate</a></span><br> -->\n</div>\n"

/***/ }),

/***/ "./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.ts":
/*!*********************************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.ts ***!
  \*********************************************************************************************/
/*! exports provided: ConnectBankModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectBankModalComponent", function() { return ConnectBankModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_settings_linked_accounts_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/settings.linked.accounts.service */ "./src/app/services/settings.linked.accounts.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");









var ConnectBankModalComponent = /** @class */ (function () {
    function ConnectBankModalComponent(sanitizer, _settingsLinkedAccountsService, _fb, _toaster, store) {
        var _this = this;
        this.sanitizer = sanitizer;
        this._settingsLinkedAccountsService = _settingsLinkedAccountsService;
        this._fb = _fb;
        this._toaster = _toaster;
        this.store = store;
        this.modalCloseEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](false);
        this.refreshAccountEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](null);
        this.providerId = '';
        this.isRefreshWithCredentials = true;
        this.providerAccountId = null;
        this.url = null;
        this.iframeSrc = '';
        this.isIframeLoading = false;
        this.selectedProvider = {};
        this.step = 1;
        this.cancelRequest = false;
        this.needReloadingLinkedAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(false);
        this.isElectron = false;
        this.base64StringForModel = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.needReloadingLinkedAccounts$ = this.store.select(function (s) { return s.settings.linkedAccounts.needReloadingLinkedAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.dataSource = function (text$) {
            return text$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(function (term) {
                if (term.startsWith(' ', 0)) {
                    return [];
                }
                return _this._settingsLinkedAccountsService.SearchBank(_this.selectedProvider.name).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (e) {
                    return [];
                }));
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (res) {
                if (res.status === 'success') {
                    var data = res.body.provider;
                    _this.dataSourceBackup = res;
                    return data;
                }
            }));
        };
        this.loginForm = this.initLoginForm();
        this.needReloadingLinkedAccounts$.subscribe(function (a) {
            if (a && _this.isRefreshWithCredentials) {
                _this.resetBankForm();
            }
        });
    }
    /**
     * initLoginForm
     */
    ConnectBankModalComponent.prototype.initLoginForm = function () {
        return this._fb.group({
            id: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            forgotPasswordUrL: [''],
            loginHelp: [''],
            formType: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            row: this._fb.array([
                this.rowArray()
            ]),
        });
    };
    ConnectBankModalComponent.prototype.ngOnChanges = function (changes) {
        // this.isIframeLoading = true;
        // if (changes.sourceOfIframe.currentValue) {
        //   this.iframeSrc = this.sourceOfIframe;
        //   this.isIframeLoading = false;
        //   this.getIframeUrl(this.iframeSrc);
        // }
        if (changes.providerId && changes.providerId.currentValue) {
            this.step = 2;
            this.providerId = _.cloneDeep(changes.providerId.currentValue);
            this.getProviderLoginForm(this.providerId);
        }
    };
    ConnectBankModalComponent.prototype.getIframeUrl = function (path) {
        if (!this.url) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        }
    };
    ConnectBankModalComponent.prototype.onCancel = function () {
        this.modalCloseEvent.emit(true);
        this.iframeSrc = undefined;
        this.loginForm.reset();
        this.step = 1;
        this.selectedProvider = {};
        this.bankSyncInProgress = false;
        this.cancelRequest = true;
        this.bankSyncInProgress = false;
        this.isRefreshWithCredentials = true;
    };
    ConnectBankModalComponent.prototype.typeaheadOnSelect = function (e) {
        var _this = this;
        setTimeout(function () {
            if (e.item) {
                _this.selectedProvider = e.item;
            }
        }, 20);
    };
    // initial rowArray controls
    ConnectBankModalComponent.prototype.rowArray = function () {
        // initialize our controls
        return this._fb.group({
            id: [''],
            label: [''],
            form: [''],
            fieldRowChoice: [''],
            field: this._fb.array([
                this.fieldArray()
            ]),
        });
    };
    ConnectBankModalComponent.prototype.fieldArray = function () {
        // initialize our controls
        return this._fb.group({
            id: [''],
            name: [''],
            maxLength: [''],
            type: [''],
            value: [null],
            isOptional: [false],
            valueEditable: [true],
            option: []
        });
    };
    // add addInputRow controls
    ConnectBankModalComponent.prototype.addInputRow = function (i, item) {
        var inputRowControls = this.loginForm.controls['row'];
        var control = this.loginForm.controls['row'];
        // add addInputRow to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i].patchValue(item);
            }
            else {
                control.push(this.rowArray());
                setTimeout(function () {
                    control.controls[i].patchValue(item);
                }, 200);
            }
        }
        else {
            if (inputRowControls.controls[i].value.rate && inputRowControls.controls[i].value.stockUnitCode) {
                control.push(this.rowArray());
            }
        }
    };
    ConnectBankModalComponent.prototype.onSelectProvider = function () {
        var inputRowControls = this.loginForm.controls['row'];
        if (inputRowControls.controls.length > 1) {
            inputRowControls.controls = inputRowControls.controls.splice(1);
        }
        this.getProviderLoginForm(this.selectedProvider.id);
    };
    /**
     * getProviderLoginForm
     */
    ConnectBankModalComponent.prototype.getProviderLoginForm = function (providerId) {
        var _this = this;
        this.loginForm.reset();
        this._settingsLinkedAccountsService.GetLoginForm(providerId).subscribe(function (a) {
            if (a && a.status === 'success') {
                var response = _.cloneDeep(a.body.loginForm[0]);
                _this.createLoginForm(response);
                _this.step = 2;
            }
        });
    };
    /**
     * onSubmitLoginForm
     */
    ConnectBankModalComponent.prototype.onSubmitLoginForm = function () {
        var _this = this;
        var objToSend = {
            loginForm: []
        };
        objToSend.loginForm.push(this.loginForm.value);
        this._settingsLinkedAccountsService.AddProvider(_.cloneDeep(objToSend), this.selectedProvider.id).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toaster.successToast(res.body);
                var providerId = res.body.replace(/[^0-9]+/ig, '');
                if (providerId) {
                    _this.cancelRequest = false;
                    _this.getBankSyncStatus(providerId);
                }
                else {
                    _this.onCancel();
                }
            }
            else {
                _this._toaster.errorToast(res.message);
                _this.onCancel();
            }
        });
    };
    /**
     * getBankSyncStatus
     */
    ConnectBankModalComponent.prototype.getBankSyncStatus = function (providerId) {
        var _this = this;
        var validateProvider;
        this._settingsLinkedAccountsService.GetBankSyncStatus(providerId).subscribe(function (res) {
            if (res.status === 'success' && res.body.providerAccount && res.body.providerAccount.length) {
                _this.bankSyncInProgress = true;
                validateProvider = _this.validateProviderResponse(res.body.providerAccount[0]);
                console.log('getBankSyncStatus...', validateProvider, _this.cancelRequest);
                if (!validateProvider && !_this.cancelRequest) {
                    setTimeout(function () {
                        _this.getBankSyncStatus(providerId);
                    }, 2000);
                }
            }
        });
    };
    /**
     * validateProviderResponse
     */
    ConnectBankModalComponent.prototype.validateProviderResponse = function (provider) {
        var status = provider.status.toLowerCase();
        if (status === 'success' || status === 'failed') {
            if (status === 'failed') {
                this._toaster.errorToast('Authentication Failed');
            }
            this.bankSyncInProgress = false;
            this.onCancel();
            return true;
        }
        else if (status === 'user_input_required' || status === 'addl_authentication_required') {
            var response = _.cloneDeep(provider.loginForm[0]);
            this.providerId = provider.id;
            if (response.formType === 'image') {
                this.bypassSecurityTrustResourceUrl(response.row[0].field[0].value);
            }
            response.row[0].field[0].value = '';
            this.createLoginForm(response);
            this.isRefreshWithCredentials = false;
            this.bankSyncInProgress = false;
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * resetBankForm
     */
    ConnectBankModalComponent.prototype.resetBankForm = function () {
        this.step = 1;
        this.selectedProvider = {};
    };
    /**
     * refreshAccount
     */
    ConnectBankModalComponent.prototype.refreshAccount = function (ev) {
        var objToSend = {
            loginForm: [],
            providerAccountId: this.providerId
        };
        objToSend.loginForm.push(this.loginForm.value);
        this.refreshAccountEvent.emit(objToSend);
        this.getBankSyncStatus(this.providerAccountId);
    };
    /**
     * createLoginForm
     */
    ConnectBankModalComponent.prototype.createLoginForm = function (response) {
        var _this = this;
        this.loginForm = this.initLoginForm();
        this.loginForm.patchValue({
            id: response.id,
            forgotPasswordUrL: response.forgotPasswordUrL,
            loginHelp: response.loginHelp,
            formType: response.formType,
        });
        response.row.map(function (item, i) {
            _this.addInputRow(i, item);
        });
    };
    /**
     * bypassSecurityTrustResourceUrl
     */
    ConnectBankModalComponent.prototype.bypassSecurityTrustResourceUrl = function (val) {
        var str = 'data:application/pdf;base64,' + val;
        // console.log('chala');
        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ConnectBankModalComponent.prototype, "sourceOfIframe", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], ConnectBankModalComponent.prototype, "modalCloseEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], ConnectBankModalComponent.prototype, "refreshAccountEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ConnectBankModalComponent.prototype, "providerId", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], ConnectBankModalComponent.prototype, "isRefreshWithCredentials", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], ConnectBankModalComponent.prototype, "providerAccountId", void 0);
    ConnectBankModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'connect-bank-modal',
            template: __webpack_require__(/*! ./connect.bank.modal.component.html */ "./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.html"),
            styles: ["iframe {\n    width: 100%;\n    height: 400px;\n  }\n\n  .connect-page .page-title {\n    margin-top: 0;\n  }\n\n  .provider_ico {\n    margin-right: 10px;\n    max-width: 16px;\n    max-height: 16px;\n    float: left;\n    object-fit: contain;\n  }\n\n  .provider_ico img {\n    width: 100%;\n    height: auto;\n  }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"],
            _services_settings_linked_accounts_service__WEBPACK_IMPORTED_MODULE_5__["SettingsLinkedAccountsService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"]])
    ], ConnectBankModalComponent);
    return ConnectBankModalComponent;
}());



/***/ }),

/***/ "./src/app/settings/linked-accounts/setting.linked.accounts.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/setting.linked.accounts.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n    <h1 class=\"section_head pdT0\">Add Bank Account</h1>\n    <div>\n        <button (click)=\"connectBank()\" class=\"btn btn-primary\">Connect Bank</button>\n    </div>\n    <div class=\"mrT1\">\n        <p> NOTE: In case you do not see your bank listed in Added Accounts even after getting a success message, please check again after some time.</p>\n        <div class=\"clearfix mrT2\">\n            <small><i class=\"fa fa-lock\"></i> At giddh, the privacy and security of your information are top priorites.\n      </small>\n            <img src=\"https://ssl.comodo.com/images/trusted-site-seal.png\" alt=\"Comodo Trusted Site Seal\" width=\"113\" height=\"59\" style=\"border: 0px;\" />\n        </div>\n    </div>\n    <div [hidden]=\"true\">\n        <form action='https://node.developer.yodlee.com/authenticate/restserver' #yodleeFormHTML method='post' id='rsessionPost' target=\"yodlee_fastlink\" [formGroup]=\"yodleeForm\">\n            <input type='text' name='rsession' placeholder='rsession' formControlName=\"rsession\" id='rsession' />\n            <input type='text' name='app' placeholder='FinappId' formControlName=\"app\" id='finappId' />\n            <input type='text' name='redirectReq' placeholder='true/false' formControlName=\"redirectReq\" />\n            <input type='text' name='token' placeholder='token' id='token' formControlName=\"token\" />\n            <input type='text' name=\"extraParams\" formControlName=\"extraParams\" placeholer='Extra Params' id='extraParams' />\n            <button type=\"submit\">Submit</button>\n        </form>\n    </div>\n</div>\n\n<div class=\"box clearfix mrT2\" *ngIf='ebankAccounts && ebankAccounts.length'>\n    <div class=\"\">\n        <!-- <button class=\"btn btn-primary btn-sm pull-right\" (click)=\"onRefreshAccounts()\">Refresh</button> -->\n        <h1 class=\"section_head pdT0\">Added Accounts</h1>\n        <div class=\"col-xs-12 mrT1\">\n            <!-- ================= saltedge accounts =================\n      <section *ngFor=\"let acc of ebankAccounts; let accIdx = index\" class=\"clearfix bank-account\" [ngClass]=\"{'mrB4': accIdx != ebankAccounts.length-1 }\">\n          <h3 class=\"subHead bdrB\">\n              <button class=\"no-btn fs20\" tooltip=\"Delete Bank\" placement=\"top\" (click)=\"onDeleteAddedBank(acc.siteName, acc.accounts[0])\"><i class=\"fa fa-trash-o\"></i></button> {{acc.siteName}}\n              <button class=\"btn btn-link mrL1\" tooltip=\"Refresh\" placement=\"top\" (click)=\"onRefreshToken(acc.accounts[accIdx])\"><i class=\"fa fa-refresh\"></i> Refresh</button>\n          </h3>\n          <aside class=\"body\">\n              <aside [attachOutsideOnClick]=\"true\" (clickOutside)=\"card.isDatePickerOpen = false\" class=\"account-card\" *ngFor=\"let card of acc.accounts; let i = index\">\n                  <aside class=\"title\">{{card.name}}</aside>\n                  <div class=\"reconnectDiv text-center\" *ngIf=\"card.reconnect\">\n                      <div class=\"vmiddle\">\n                          <button class=\"btn btn-sm btn-default\" (click)=\"onReconnectAccount(card)\">Reconnect</button>\n                          <button class=\"btn btn-sm btn-danger\" (click)=\"onDeleteAddedBank(acc.siteName, card)\">Delete</button>\n                      </div>\n                  </div>\n                  <div class=\"account-number\">\n                      <b>Account</b>: {{card.accountNumber}}\n                  </div>\n                  <div class=\"account-date clearfix\">\n                      <b>Entries From</b>: <label for=\"date_{{accIdx}}_{{i}}\" class=\"cp\">{{card.transactionDate | date}}</label>\n                      <a href=\"javascript:void(0)\" (click)=\"card.isDatePickerOpen = !card.isDatePickerOpen\">\n                          <input [(ngModel)]=\"card.transactionDate\" name=\"transactionDate_{{accIdx}}_{{i}}\" id=\"date_{{accIdx}}_{{i}}\" />\n                      </a>\n                      <div style=\"position: absolute; z-index:10; min-height:290px;\">\n                          <datepicker *ngIf=\"card.isDatePickerOpen\" name=\"fromDate\" [(ngModel)]=\"card.transactionDate\" (selectionDone)=\"onUpdateDate($event, card)\" [showWeeks]=\"true\">\n                          </datepicker>\n                      </div>\n                  </div>\n                  <div class=\"balance text-left\">\n                      {{card.currencyCode}} {{card.amount}}\n                  </div>\n                  <small class=\"with\" *ngIf=\"card.linkedAccount\">\n                    Linked with: {{card.linkedAccount.name}} ({{card.linkedAccount.uniqueName}})\n                </small>\n                  <div class=\"select-account form-group\" *ngIf=\"card.showAccList\">\n                      <div class=\"ng-select-wrap\">\n                          <sh-select [options]=\"accounts$\" (selected)=\"onAccountSelect(card, $event)\" [placeholder]=\"'Select Account'\" [ItemHeight]=\"33\">\n                          </sh-select>\n                      </div>\n                  </div>\n                  <button class=\"btn btn-default pull-right\" *ngIf=\"card.showAccList\" [disabled]=\"card.reconnect\" (click)=\"card.showAccList = false\">Not Now</button>\n                  <button class=\"btn btn-primary\" *ngIf=\"card.linkedAccount == null && !card.showAccList\" [disabled]=\"card.reconnect\" (click)=\"card.showAccList = true;\">Link Account</button>\n                  <button class=\"btn btn-danger mrT1\" *ngIf=\"card.linkedAccount && card.linkedAccount.name.length > 0\" [disabled]=\"card.reconnect\" (click)=\"onUnlinkBankAccount(card)\">Unlink Account</button>\n              </aside>\n          </aside>\n      </section>\n      ================= saltedge accounts ================= -->\n\n            <section *ngFor=\"let acc of ebankAccounts; let accIdx = index\" class=\"clearfix bank-account\" [ngClass]=\"{'mrB4': accIdx != ebankAccounts.length-1 }\">\n                <h3 class=\"subHead bdrB\">\n                    {{acc.siteName}}\n                    <button class=\"btn btn-link mrL1\" tooltip=\"Refresh\" placement=\"top\" (click)=\"onRefreshToken(acc.yodleeAccounts[0], false)\" *ngIf=\"acc.status !== 'FAILED'\">\n            <i class=\"fa fa-refresh\"></i> Refresh\n          </button>\n                    <button class=\"btn btn-link mrL1\" tooltip=\"Refresh\" placement=\"top\" (click)=\"connectBank(acc.siteId, acc.yodleeAccounts[0].providerAccount.providerAccountId)\" *ngIf=\"acc.status === 'FAILED'\">\n                <i class=\"fa fa-refresh\"></i> Refresh\n              </button>\n                </h3>\n                <aside class=\"body\">\n                    <aside [attachOutsideOnClick]=\"true\" (clickOutside)=\"card.isDatePickerOpen = false\" class=\"account-card\" *ngFor=\"let card of acc.yodleeAccounts; let i = index\">\n\n                        <aside class=\"title\">{{card.accountName}}</aside>\n                        <ng-container *ngIf=\"acc.status !== 'FAILED'\">\n                            <div class=\"account-number\">\n                                <b>Account</b>: {{card.accountNumber}}\n                            </div>\n                            <div class=\"account-date clearfix\">\n                                <b>Entries From</b>:\n                                <label for=\"date_{{accIdx}}_{{i}}\" class=\"cp\">{{card.transactionDate | date}}</label>\n                                <a href=\"javascript:void(0)\" (click)=\"card.isDatePickerOpen = !card.isDatePickerOpen\">\n                                    <input [(ngModel)]=\"card.transactionDate\" name=\"transactionDate_{{accIdx}}_{{i}}\" id=\"date_{{accIdx}}_{{i}}\" />\n                                </a>\n                                <div style=\"position: absolute; z-index:10; min-height:290px;\">\n                                    <datepicker *ngIf=\"card.isDatePickerOpen\" name=\"fromDate\" [(ngModel)]=\"card.transactionDate\" (selectionDone)=\"onUpdateDate($event, card)\" [showWeeks]=\"true\">\n                                    </datepicker>\n                                </div>\n                            </div>\n                            <div class=\"balance text-left\">\n                                {{card.balanceCurrencyCode}} {{card.balance}}\n                            </div>\n                            <small class=\"with\" *ngIf=\"card.giddhAccount\">\n              Linked with: {{card.giddhAccount.name}} ({{card.giddhAccount.uniqueName}})\n            </small>\n                            <div class=\"select-account form-group\" *ngIf=\"card.showAccList\">\n                                <div class=\"ng-select-wrap\">\n                                    <sh-select [options]=\"accounts$\" (selected)=\"onAccountSelect(card, $event)\" [placeholder]=\"'Select Account'\" [ItemHeight]=\"33\">\n                                    </sh-select>\n                                </div>\n                            </div>\n                            <div class=\"clearfix\">\n                                <button class=\"btn btn-default\" *ngIf=\"card.showAccList\" (click)=\"card.showAccList = false\">Not Now\n              </button>\n                                <button class=\"btn btn-primary\" *ngIf=\"card.giddhAccount == null && !card.showAccList\" (click)=\"card.showAccList = true;\">Link Account\n              </button>\n                                <button class=\"btn btn-danger mrT1\" *ngIf=\"card.giddhAccount && card.giddhAccount.name.length > 0\" (click)=\"onUnlinkBankAccount(card)\">Unlink Account\n              </button>\n                                <!-- <button class=\"btn btn-danger mrT1\" (click)=\"onDeleteAddedBank(acc.siteName, card)\">Delete Account</button> -->\n                                <!-- (click)=\"onDeleteAddedBank(acc.siteName, acc.yodleeAccounts[0])\" -->\n                            </div>\n                            <button class=\"no-btn fs20 pos-abs bank_delete\" tooltip=\"Delete Bank\" placement=\"top\" (click)=\"onDeleteAddedBank(acc.siteName, card, acc)\">\n              <i class=\"fa fa-trash-o\"></i>\n            </button>\n                        </ng-container>\n\n                        <ng-container *ngIf=\"acc.status === 'FAILED'\">\n                            <div class=\"account-number\">\n                                <b>Provider Id</b>: {{card.providerAccount.providerAccountId}}\n                            </div>\n                            <p class=\"mrT2\">Status: <span class=\"text-danger fs14\"><i class=\"fa fa-exclamation-circle\"></i> {{acc.status}}</span></p>\n                            <p>Reason: {{acc.reason}}</p>\n                            <div class=\"balance text-left\">\n                                {{card.balanceCurrencyCode}} {{card.balance}}\n                            </div>\n                            <div class=\"clearfix mrT2\">\n\n                                <!-- by aditya -->\n                                <!-- <button class=\"btn btn-default\" *ngIf=\"!acc.isRefreshWithCredentials\" (click)=\"onRefreshToken(card)\">Reconnect</button> -->\n                                <!-- *ngIf=\"acc.isRefreshWithCredentials\" -->\n\n                                <!-- <button class=\"btn btn-default\" (click)=\"connectBank(acc.siteId,    card.providerAccount.providerAccountId)\">Try Again</button> -->\n                            </div>\n                            <button class=\"no-btn fs20 pos-abs bank_delete\" tooltip=\"Delete Bank\" placement=\"top\" (click)=\"onDeleteAddedBank(acc.siteName, card, acc)\">\n                                <i class=\"fa fa-trash-o\"></i>\n                            </button>\n                        </ng-container>\n\n                        <ng-container *ngIf=\"acc.status === 'ALREADY_ADDED' && card.status !== 'SUCCESS'\">\n                            <div class=\"account-number\">\n                                <b>Provider Id</b>: {{card.providerAccount.providerAccountId}}\n                            </div>\n                            <p class=\"mrT2\">Status: <span class=\"text-danger fs14\"><i class=\"fa fa-exclamation-circle\"></i> {{acc.status}}</span></p>\n                            <p>Reason: {{acc.reason}}</p>\n                            <div class=\"clearfix mrT2\" *ngIf=\"acc.status === 'ALREADY_ADDED'\">\n                                <button class=\"btn btn-default\" *ngIf=\"card.status !== 'INCORRECT_CREDENTIALS'\" (click)=\"onRefreshToken(card)\">Reconnect</button>\n                                <button class=\"btn btn-default\" *ngIf=\"card.status === 'INCORRECT_CREDENTIALS'\" (click)=\"connectBank(acc.siteId, card.providerAccount.providerAccountId)\">Try Again</button>\n                            </div>\n                            <div class=\"clearfix mrT2\" *ngIf=\"acc.status !== 'ALREADY_ADDED'\">\n                                <button class=\"btn btn-default\" *ngIf=\"acc.status !== 'INCORRECT_CREDENTIALS'\" (click)=\"onRefreshToken(card)\">Reconnect</button>\n                                <button class=\"btn btn-default\" *ngIf=\"acc.status === 'INCORRECT_CREDENTIALS'\" (click)=\"connectBank(acc.siteId, card.providerAccount.providerAccountId)\">Try Again</button>\n                            </div>\n                        </ng-container>\n                    </aside>\n                </aside>\n            </section>\n        </div>\n    </div>\n</div>\n<!-- Connect-Bank-Modal -->\n<!-- <div bsModal #connectBankModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <iframe id='yodlee_fastlink' #yodleeIframe name='yodlee_fastlink' frameBorder='0' width=\"100%\" height=\"400px\" (modalCloseEvent)=\"closeModal()\"></iframe>\n            <connect-bank-modal [sourceOfIframe]=\"iframeSource\" (modalCloseEvent)=\"closeModal()\"></connect-bank-modal>\n        </div>\n    </div>\n</div> -->\n\n<div bsModal #connectBankModel=\"bs-modal\" class=\"modal fade\" role=\"dialog\" tabindex=\"-1\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <connect-bank-modal (modalCloseEvent)=\"closeModal()\" [providerId]=\"selectedProvider\" [isRefreshWithCredentials]=\"isRefreshWithCredentials\" (refreshAccountEvent)=\"onRefreshToken($event, true)\" [providerAccountId]=\"providerAccountId\"></connect-bank-modal>\n        </div>\n    </div>\n</div>\n\n<!-- Confirmation Modal -->\n<div bsModal #confirmationModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <setting-l-acc-confirmation-modal [message]=\"confirmationMessage\" (closeModelEvent)=\"closeConfirmationModal($event)\"></setting-l-acc-confirmation-modal>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/settings/linked-accounts/setting.linked.accounts.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/settings/linked-accounts/setting.linked.accounts.component.ts ***!
  \*******************************************************************************/
/*! exports provided: SettingLinkedAccountsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingLinkedAccountsComponent", function() { return SettingLinkedAccountsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_settings_linked_accounts_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/settings.linked.accounts.service */ "./src/app/services/settings.linked.accounts.service.ts");
/* harmony import */ var _actions_settings_linked_accounts_settings_linked_accounts_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/settings/linked-accounts/settings.linked.accounts.action */ "./src/app/actions/settings/linked-accounts/settings.linked.accounts.action.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_service_config__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/service.config */ "./src/app/services/service.config.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../services/general.service */ "./src/app/services/general.service.ts");
















var SettingLinkedAccountsComponent = /** @class */ (function () {
    function SettingLinkedAccountsComponent(router, store, _settingsLinkedAccountsService, settingsLinkedAccountsActions, _accountService, _sanitizer, _fb, config, _generalService) {
        this.router = router;
        this.store = store;
        this._settingsLinkedAccountsService = _settingsLinkedAccountsService;
        this.settingsLinkedAccountsActions = settingsLinkedAccountsActions;
        this._accountService = _accountService;
        this._sanitizer = _sanitizer;
        this._fb = _fb;
        this.config = config;
        this._generalService = _generalService;
        this.iframeSource = null;
        this.ebankAccounts = [];
        this.isRefreshWithCredentials = true;
        this.providerAccountId = null;
        this.needReloadingLinkedAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_5__["of"])(false);
        this.selectedBank = null;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
        this.flattenAccountsStream$ = this.store.select(function (s) { return s.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.companyUniqueName = this._generalService.companyUniqueName;
        this.needReloadingLinkedAccounts$ = this.store.select(function (s) { return s.settings.linkedAccounts.needReloadingLinkedAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    SettingLinkedAccountsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.yodleeForm = this._fb.group({
            rsession: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_13__["Validators"].required]],
            app: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_13__["Validators"].required]],
            redirectReq: [true, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__["Validators"].required]],
            token: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_13__["Validators"].required],
            extraParams: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_13__["Validators"].required]
        });
        this.store.select(function (p) { return p.settings; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.linkedAccounts && o.linkedAccounts.bankAccounts) {
                // console.log('Found');
                _this.ebankAccounts = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](o.linkedAccounts.bankAccounts);
            }
        });
        this.store.select(function (p) { return p.settings.linkedAccounts.needReloadingLinkedAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (_this.isRefreshWithCredentials) {
                _this.store.dispatch(_this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });
        this.store.select(function (p) { return p.settings.linkedAccounts.iframeSource; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (source) {
            if (source) {
                // this.iframeSource = _.clone(source);
                _this.connectBankModel.show();
                _this.connectBankModel.config.ignoreBackdropClick = true;
            }
        });
        this.flattenAccountsStream$.subscribe(function (data) {
            if (data) {
                var accounts_1 = [];
                data.map(function (d) {
                    accounts_1.push({ label: d.name + " (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.accounts$ = accounts_1;
            }
        });
        this.needReloadingLinkedAccounts$.subscribe(function (a) {
            // if (a && this.isRefreshWithCredentials) {
            //   this.closeModal();
            // }
            if (a) {
                _this.store.dispatch(_this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });
    };
    SettingLinkedAccountsComponent.prototype.getInitialEbankInfo = function () {
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    };
    SettingLinkedAccountsComponent.prototype.connectBank = function (selectedProvider, providerAccountId) {
        // get token info
        if (selectedProvider) {
            this.selectedProvider = selectedProvider;
            this.isRefreshWithCredentials = false;
            this.providerAccountId = providerAccountId;
        }
        this.connectBankModel.show();
        this.connectBankModel.config.ignoreBackdropClick = true;
    };
    /**
     * yodleeBank
     */
    SettingLinkedAccountsComponent.prototype.yodleeBank = function () {
        var _this = this;
        this._settingsLinkedAccountsService.GetYodleeToken().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                if (data.body.user) {
                    var token = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](data.body.user.accessTokens[0]);
                    _this.yodleeForm.patchValue({
                        rsession: data.body.rsession,
                        app: token.appId,
                        redirectReq: true,
                        token: token.value,
                        extraParams: ['callback=' + _this.config.appUrl + 'app/yodlee-success.html?companyUniqueName=' + _this.companyUniqueName]
                    });
                    _this.yodleeFormHTML.nativeElement.submit();
                    _this.connectBankModel.show();
                }
            }
        });
    };
    SettingLinkedAccountsComponent.prototype.closeModal = function () {
        this.connectBankModel.hide();
        this.iframeSource = undefined;
        this.selectedProvider = null;
        this.isRefreshWithCredentials = true;
        this.providerAccountId = null;
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    };
    SettingLinkedAccountsComponent.prototype.closeConfirmationModal = function (isUserAgree) {
        if (isUserAgree) {
            var accountId = this.selectedAccount.itemAccountId;
            var accountUniqueName = '';
            if (this.selectedAccount.giddhAccount && this.selectedAccount.giddhAccount.uniqueName) {
                accountUniqueName = this.selectedAccount.giddhAccount.uniqueName;
            }
            switch (this.actionToPerform) {
                case 'DeleteAddedBank':
                    var deleteWithAccountId = true;
                    if (this.selectedBank.status !== 'ALREADY_ADDED') {
                        accountId = this.selectedAccount.providerAccount.providerAccountId;
                        deleteWithAccountId = false;
                    }
                    this.store.dispatch(this.settingsLinkedAccountsActions.DeleteBankAccount(accountId, deleteWithAccountId));
                    break;
                case 'UpdateDate':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UpdateDate(this.dateToUpdate, accountId));
                    break;
                case 'LinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.LinkBankAccount(this.dataToUpdate, accountId));
                    break;
                case 'UnlinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UnlinkBankAccount(accountId, accountUniqueName));
                    break;
            }
        }
        this.confirmationModal.hide();
        this.selectedAccount = null;
        this.actionToPerform = null;
    };
    SettingLinkedAccountsComponent.prototype.onRefreshAccounts = function () {
        this.store.dispatch(this.settingsLinkedAccountsActions.RefreshAllAccounts());
    };
    SettingLinkedAccountsComponent.prototype.onReconnectAccount = function (account) {
        this.store.dispatch(this.settingsLinkedAccountsActions.ReconnectAccount(account.loginId));
    };
    SettingLinkedAccountsComponent.prototype.onDeleteAddedBank = function (bankName, account, bank) {
        if (bankName && account) {
            this.selectedBank = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](bank);
            this.selectedAccount = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](account);
            this.confirmationMessage = "Are you sure you want to delete " + bankName + " ? All accounts linked with the same bank will be deleted.";
            this.actionToPerform = 'DeleteAddedBank';
            this.confirmationModal.show();
        }
        else {
            console.log('No account found');
        }
    };
    SettingLinkedAccountsComponent.prototype.onRefreshToken = function (account, isUpdateAccount) {
        if (isUpdateAccount) {
            if (!this.providerAccountId) {
                this.providerAccountId = account.providerAccountId;
                delete account['providerAccountId'];
            }
            // this.selectedProvider = this.providerAccountId;
            this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(this.providerAccountId, account));
            return;
        }
        this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(account.providerAccount.providerAccountId, {}));
    };
    SettingLinkedAccountsComponent.prototype.onAccountSelect = function (account, data) {
        if (data && data.value) {
            // Link bank account
            this.dataToUpdate = {
                itemAccountId: account.itemAccountId,
                uniqueName: data.value
            };
            this.selectedAccount = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](account);
            this.confirmationMessage = "Are you sure you want to link " + data.value + " ?";
            this.actionToPerform = 'LinkAccount';
            this.confirmationModal.show();
        }
    };
    SettingLinkedAccountsComponent.prototype.onUnlinkBankAccount = function (account) {
        this.selectedAccount = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](account);
        this.confirmationMessage = "Are you sure you want to unlink " + account.giddhAccount.name + " ?";
        this.actionToPerform = 'UnlinkAccount';
        this.confirmationModal.show();
    };
    SettingLinkedAccountsComponent.prototype.onUpdateDate = function (date, account) {
        this.dateToUpdate = moment_moment__WEBPACK_IMPORTED_MODULE_7__(date).format('DD-MM-YYYY');
        this.selectedAccount = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](account);
        this.confirmationMessage = "Do you want to get ledger entries for this account from " + this.dateToUpdate + " ?";
        this.actionToPerform = 'UpdateDate';
        this.confirmationModal.show();
    };
    SettingLinkedAccountsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('connectBankModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], SettingLinkedAccountsComponent.prototype, "connectBankModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('confirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], SettingLinkedAccountsComponent.prototype, "confirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('yodleeFormHTML'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", HTMLFormElement)
    ], SettingLinkedAccountsComponent.prototype, "yodleeFormHTML", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('yodleeIframe'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", HTMLIFrameElement)
    ], SettingLinkedAccountsComponent.prototype, "yodleeIframe", void 0);
    SettingLinkedAccountsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'setting-linked-accounts',
            template: __webpack_require__(/*! ./setting.linked.accounts.component.html */ "./src/app/settings/linked-accounts/setting.linked.accounts.component.html"),
            styles: ["\n    .bank_delete {\n      right: 0;\n      bottom: 0;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](7, Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Optional"])()), tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](7, Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Inject"])(_services_service_config__WEBPACK_IMPORTED_MODULE_14__["ServiceConfig"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _services_settings_linked_accounts_service__WEBPACK_IMPORTED_MODULE_10__["SettingsLinkedAccountsService"],
            _actions_settings_linked_accounts_settings_linked_accounts_action__WEBPACK_IMPORTED_MODULE_11__["SettingsLinkedAccountsActions"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_8__["AccountService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__["DomSanitizer"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormBuilder"], Object, _services_general_service__WEBPACK_IMPORTED_MODULE_15__["GeneralService"]])
    ], SettingLinkedAccountsComponent);
    return SettingLinkedAccountsComponent;
}());



/***/ }),

/***/ "./src/app/settings/permissions/form/form.component.html":
/*!***************************************************************!*\
  !*** ./src/app/settings/permissions/form/form.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form name=\"permissionForm\" [formGroup]=\"permissionForm\" [ngClass]=\"{'permissionForm': isHorizntl}\"\n      (ngSubmit)=\"submitPermissionForm()\">\n\n  <div class=\"form-group\" style=\"margin-left:0;\">\n    <label *ngIf=\"isLblShow\">Unique Name/Email ID</label>\n    <input type=\"text\" name=\"emailId\" formControlName=\"emailId\" placeholder=\"Unique Name/Email ID\"\n           class=\"form-control \"/>\n  </div>\n\n  <div class=\"form-group\">\n    <label *ngIf=\"isLblShow\">Role Name</label>\n    <!-- <select name=\"roleUniqueName\" formControlName=\"roleUniqueName\" class=\"form-control \">\n        <option [value]=\"role.uniqueName\" *ngFor=\"let role of allRoles\">{{role.name}}</option>\n    </select> -->\n    <sh-select placeholder=\"Select role\" formControlName=\"roleUniqueName\" [options]=\"allRoles\"></sh-select>\n  </div>\n\n  <!-- time span -->\n  <div class=\"form-group\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"methodForToggleSection('timeSpanSection')\">\n    <label *ngIf=\"isLblShow\">Time Span</label>\n    <div class=\"btn-group\" [ngClass]=\"{'open': showTimeSpan, 'btn-group-liq': !isHorizntl}\">\n      <button (click)=\"showTimeSpan = !showTimeSpan\" type=\"button\" class=\"form-control text-left \">\n        {{selectedTimeSpan}}\n        <span class=\"pull-right\"><span class=\"fa fa-caret-down\"></span></span>\n      </button>\n      <section class=\"dropdown-menu custom_dropdown mrB1\" [ngClass]=\"{'open': showTimeSpan}\">\n\n        <div class=\"clearfix pd1 option_box\">\n          <label class=\"radio-inline pd0\">\n            <input type=\"radio\" name=\"periodOptions\" formControlName=\"periodOptions\" value=\"daterange\"\n                   class=\"radio_theme\"> Date Range\n          </label>\n          <label class=\"radio-inline pd0\">\n            <input type=\"radio\" name=\"periodOptions\" formControlName=\"periodOptions\" value=\"pastperiod\"\n                   class=\"radio_theme\"> Past Period\n          </label>\n        </div>\n\n        <section class=\"periods container-fluid mrB1\" *ngIf=\"permissionForm.get('periodOptions').value === 'daterange'\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <label>From - To</label>\n              <input name=\"DateRangePicker\" [bsValue]=\"dateRangePickerValue\" (bsValueChange)=\"onSelectDateRange($event)\"\n                     placeholder=\"Date range picker\" type=\"text\" class=\"form-control\" bsDaterangepicker>\n\n              <!-- <input class=\"form-control \" name=\"from\" formControlName=\"from\" type=\"text\" placeholder=\"DD-MM-YYYY\" /> -->\n            </div>\n            <!-- <div class=\"col-xs-6\">\n                <label>To</label>\n                <input class=\"form-control \" name=\"to\" formControlName=\"to\" type=\"text\" placeholder=\"DD-MM-YYYY\" />\n            </div> -->\n          </div>\n        </section>\n\n        <section class=\"periods container-fluid mrB1\"\n                 *ngIf=\"permissionForm.get('periodOptions').value === 'pastperiod'\">\n          <label>Select Past Period</label>\n          <div class=\"row\">\n            <div class=\"col-xs-6\">\n              <input class=\"form-control \" name=\"duration\" digitsOnlyDirective formControlName=\"duration\" type=\"number\"\n                     placeholder=\"Number\"/>\n            </div>\n            <div class=\"col-xs-6 pdL0 lh34\">\n              Days\n            </div>\n          </div>\n        </section>\n\n      </section>\n    </div>\n  </div>\n  <!-- time span end -->\n\n  <div class=\"form-group\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"methodForToggleSection('rangeSpanSection')\">\n    <label *ngIf=\"isLblShow\">IP Addresses</label>\n    <div class=\"btn-group \" [ngClass]=\"{'open': showIPWrap, 'btn-group-liq': !isHorizntl}\">\n      <button (click)=\"showIPWrap = !showIPWrap\" type=\"button\" class=\"form-control text-left \">\n        {{selectedIPRange}}\n        <span class=\"pull-right\"><span class=\"fa fa-caret-down\"></span></span>\n      </button>\n      <section class=\"dropdown-menu custom_dropdown\" role=\"menu\" [ngClass]=\"{'open': showIPWrap}\">\n        <div class=\"clearfix option_box pd1\">\n          <label class=\"radio-inline pd0\">\n            <input type=\"radio\" class=\"radio_theme\" name=\"ipOptions\" formControlName=\"ipOptions\" value=\"cidr_range\">\n            CIDR Range\n          </label>\n          <label class=\"radio-inline pd0\">\n            <input type=\"radio\" class=\"radio_theme\" name=\"ipOptions\" formControlName=\"ipOptions\" value=\"ip_address\"> IP\n            Address\n          </label>\n        </div>\n\n        <section formArrayName=\"allowedCidrs\" class=\"iprange container-fluid\"\n                 *ngIf=\"permissionForm.get('ipOptions').value === 'cidr_range'\">\n          <div class=\"row mrB1\"\n               *ngFor=\"let item of permissionForm.get('allowedCidrs')['controls']; let i = index; let l = last\"\n               [formGroupName]=\"i\">\n            <div class=\"col-xs-11\">\n              <input class=\"form-control \" name=\"item_{{i}}\" formControlName=\"range\" type=\"text\"\n                     placeholder=\"192.168.1.0/24\"/>\n            </div>\n            <div class=\"pull-left lh34\">\n              <i *ngIf=\"!l\" (click)=\"delRow('allowedCidrs', i, $event)\" class=\"fa fa-trash-o cursor-pointer\"></i>\n              <i *ngIf=\"l\" (click)=\"addNewRow('allowedCidrs', item, $event)\" class=\"fa fa-plus cursor-pointer\"></i>\n            </div>\n          </div>\n        </section>\n\n        <section formArrayName=\"allowedIps\" class=\"iprange container-fluid\"\n                 *ngIf=\"permissionForm.get('ipOptions').value === 'ip_address'\">\n          <div class=\"row mrB1\"\n               *ngFor=\"let item of permissionForm.get('allowedIps')['controls']; let i = index; let l = last\"\n               [formGroupName]=\"i\">\n            <div class=\"col-xs-11\">\n              <input class=\"form-control \" decimalDigitsDirective name=\"item_{{i}}\" formControlName=\"range\" type=\"text\"\n                     placeholder=\"192.168.1.0\"/>\n            </div>\n            <div class=\"pull-left lh34\">\n              <i *ngIf=\"!l\" (click)=\"delRow('allowedIps', i, $event)\" class=\"fa fa-trash-o cursor-pointer\"></i>\n              <i *ngIf=\"l\" (click)=\"addNewRow('allowedIps', item, $event)\" class=\"fa fa-plus cursor-pointer\"></i>\n            </div>\n          </div>\n        </section>\n\n      </section>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <button [ladda]=\"createPermissionInProcess$ | async\" [disabled]=\"permissionForm.invalid\" class=\"btn btn-success\">\n      <span *ngIf=\"!isUpdtCase\">Add</span>\n      <span *ngIf=\"isUpdtCase\">Update</span>\n    </button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/settings/permissions/form/form.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/settings/permissions/form/form.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".btn-group.btn-group-liq {\n  width: 100%; }\n\n.custom_dropdown {\n  width: 300px;\n  border-radius: 0;\n  margin: 0px 0;\n  margin-top: 0px;\n  box-shadow: none;\n  -webkit-transition: all 0.7s ease;\n  transition: all 0.7s ease;\n  background: #fff !important;\n  opacity: 1;\n  box-shadow: 0px 2px 6px #ddd;\n  padding: 0; }\n\n.custom_dropdown.open {\n  -webkit-transform: translateY(5px);\n          transform: translateY(5px); }\n\n.lh34 {\n  line-height: 34px; }\n\n.form-group > label {\n  margin-bottom: 5px; }\n\n.permissionForm .form-group {\n  width: 188px;\n  display: inline-block;\n  margin: 0 10px;\n  position: relative; }\n\n.permissionForm .form-group .btn-group {\n    width: 188px; }\n\n.periods label {\n  margin-bottom: 5px; }\n\n.permissionForm .btn-group.open .dropdown-toggle {\n  box-shadow: none;\n  background: transparent; }\n\n.custom_dropdown > li > a {\n  padding: 6px; }\n\n.custom_dropdown > li > a:focus,\n.custom_dropdown > li > a:hover {\n  background: #d9d9d9 !important; }\n\n.custom_dropdown .caret {\n  -webkit-transform: rotate(-90deg);\n          transform: rotate(-90deg); }\n\n@media (max-width: 1024px) {\n  .permissionForm .form-group {\n    margin-left: 0;\n    margin-top: 5px; }\n    .permissionForm .form-group .btn-group {\n      width: 188px; } }\n\n@media (max-width: 575px) {\n  .permissionForm .form-group {\n    width: 100%;\n    display: block;\n    margin-top: 5px;\n    position: relative; }\n    .permissionForm .form-group .btn-group {\n      width: 100%; } }\n"

/***/ }),

/***/ "./src/app/settings/permissions/form/form.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/settings/permissions/form/form.component.ts ***!
  \*************************************************************/
/*! exports provided: SettingPermissionFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingPermissionFormComponent", function() { return SettingPermissionFormComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var is_cidr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! is-cidr */ "../../node_modules/is-cidr/index.js");
/* harmony import */ var is_cidr__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(is_cidr__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Permission__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../models/api-models/Permission */ "./src/app/models/api-models/Permission.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../actions/permission/permission.action */ "./src/app/actions/permission/permission.action.ts");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _services_settings_permission_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../services/settings.permission.service */ "./src/app/services/settings.permission.service.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_14__);















// some local const
var DATE_RANGE = 'daterange';
var PAST_PERIOD = 'pastperiod';
var IP_ADDR = 'ip_address';
var CIDR_RANGE = 'cidr_range';
var SettingPermissionFormComponent = /** @class */ (function () {
    function SettingPermissionFormComponent(_settingsPermissionService, _permissionActions, _accountsAction, _toasty, store, _fb) {
        this._settingsPermissionService = _settingsPermissionService;
        this._permissionActions = _permissionActions;
        this._accountsAction = _accountsAction;
        this._toasty = _toasty;
        this.store = store;
        this._fb = _fb;
        this.onSubmitForm = new _angular_core__WEBPACK_IMPORTED_MODULE_5__["EventEmitter"](null);
        this.showTimeSpan = false;
        this.showIPWrap = false;
        this.allRoles = [];
        this.selectedTimeSpan = 'Date Range';
        this.selectedIPRange = 'IP Address';
        this.dateRangePickerValue = [];
        // private methods
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.createPermissionInProcess$ = this.store.select(function (p) { return p.permission.createPermissionInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    SettingPermissionFormComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SettingPermissionFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.userdata) {
            var from = moment__WEBPACK_IMPORTED_MODULE_14__(this.userdata.from, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_2__["GIDDH_DATE_FORMAT"]);
            var to = moment__WEBPACK_IMPORTED_MODULE_14__(this.userdata.to, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_2__["GIDDH_DATE_FORMAT"]);
            this.dateRangePickerValue = [from._d, to._d];
            this.initAcForm(this.userdata);
        }
        else {
            this.initAcForm();
        }
        // reset form
        this.createPermissionInProcess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (val) {
            if (val) {
                _this.permissionForm.reset();
                _this.initAcForm();
            }
        });
        // get roles
        this.store.select(function (s) { return s.permission; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (p) {
            if (p && p.roles) {
                var roles = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["cloneDeep"](p.roles);
                var allRoleArray_1 = [];
                roles.forEach(function (role) {
                    allRoleArray_1.push({
                        label: role.name,
                        value: role.uniqueName
                    });
                });
                _this.allRoles = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["cloneDeep"](allRoleArray_1);
            }
            else {
                _this.store.dispatch(_this._permissionActions.GetRoles());
            }
        });
        // utitlity
        this.permissionForm.get('periodOptions').valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["debounceTime"])(100)).subscribe(function (val) {
            _this.togglePeriodOptionsVal(val);
        });
        this.permissionForm.get('ipOptions').valueChanges.subscribe(function (val) {
            _this.toggleIpOptVal(val);
        });
    };
    SettingPermissionFormComponent.prototype.toggleIpOptVal = function (val) {
        if (val === IP_ADDR) {
            this.selectedIPRange = 'IP Address';
        }
        else if (val === CIDR_RANGE) {
            this.selectedIPRange = 'CIDR Range';
        }
    };
    SettingPermissionFormComponent.prototype.onSelectDateRange = function (ev) {
        if (ev && ev.length) {
            var from = moment__WEBPACK_IMPORTED_MODULE_14__(ev[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_2__["GIDDH_DATE_FORMAT"]);
            var to = moment__WEBPACK_IMPORTED_MODULE_14__(ev[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_2__["GIDDH_DATE_FORMAT"]);
            this.permissionForm.patchValue({ from: from, to: to });
        }
    };
    SettingPermissionFormComponent.prototype.togglePeriodOptionsVal = function (val) {
        if (val === DATE_RANGE) {
            this.selectedTimeSpan = 'Date Range';
        }
        else if (val === PAST_PERIOD) {
            this.selectedTimeSpan = 'Past Period';
            this.dateRangePickerValue = [];
            if (this.permissionForm) {
                this.permissionForm.patchValue({ from: null, to: null });
            }
        }
    };
    SettingPermissionFormComponent.prototype.getPeriodFromData = function (data) {
        if (data.from && data.to) {
            this.togglePeriodOptionsVal(DATE_RANGE);
            return [DATE_RANGE];
        }
        if (data.duration && data.period) {
            this.togglePeriodOptionsVal(PAST_PERIOD);
            return [PAST_PERIOD];
        }
        return [DATE_RANGE];
    };
    SettingPermissionFormComponent.prototype.getIPOptsFromData = function (data) {
        if (data.allowedIps.length > 0) {
            this.toggleIpOptVal(IP_ADDR);
            return [IP_ADDR];
        }
        if (data.allowedCidrs.length > 0) {
            this.toggleIpOptVal(CIDR_RANGE);
            return [CIDR_RANGE];
        }
        return [IP_ADDR];
    };
    SettingPermissionFormComponent.prototype.initAcForm = function (data) {
        var _this = this;
        if (data) {
            this.permissionForm = this._fb.group({
                uniqueName: [data.uniqueName],
                emailId: [data.emailId, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].maxLength(150)])],
                entity: ['company'],
                roleUniqueName: [data.roleUniqueName, [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
                periodOptions: this.getPeriodFromData(data),
                from: [data.from],
                to: [data.to],
                duration: [data.duration],
                period: [null],
                ipOptions: this.getIPOptsFromData(data),
                allowedIps: this._fb.array([]),
                allowedCidrs: this._fb.array([])
            });
            var allowedIps_1 = this.permissionForm.get('allowedIps');
            var allowedCidrs_1 = this.permissionForm.get('allowedCidrs');
            if (data.allowedIps.length > 0) {
                apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["forEach"](data.allowedIps, function (val) {
                    allowedIps_1.push(_this.initRangeForm(val));
                });
            }
            else {
                allowedIps_1.push(this.initRangeForm());
            }
            if (data.allowedCidrs.length > 0) {
                apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["forEach"](data.allowedCidrs, function (val) {
                    allowedCidrs_1.push(_this.initRangeForm(val));
                });
            }
            else {
                allowedCidrs_1.push(this.initRangeForm());
            }
        }
        else {
            this.permissionForm = this._fb.group({
                emailId: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].maxLength(150)])],
                entity: ['company'],
                roleUniqueName: ['admin', [_angular_forms__WEBPACK_IMPORTED_MODULE_7__["Validators"].required]],
                periodOptions: [DATE_RANGE],
                from: [null],
                to: [null],
                duration: [null],
                period: [null],
                ipOptions: [CIDR_RANGE],
                allowedIps: this._fb.array([]),
                allowedCidrs: this._fb.array([])
            });
            var allowedIps = this.permissionForm.get('allowedIps');
            var allowedCidrs = this.permissionForm.get('allowedCidrs');
            allowedCidrs.push(this.initRangeForm());
            allowedIps.push(this.initRangeForm());
        }
    };
    SettingPermissionFormComponent.prototype.initRangeForm = function (val) {
        return this._fb.group({
            range: (val) ? [val] : [null]
        });
    };
    SettingPermissionFormComponent.prototype.validateIPaddress = function (ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        return false;
    };
    SettingPermissionFormComponent.prototype.addNewRow = function (type, item, e) {
        e.stopPropagation();
        var errFound = false;
        var msg;
        var arow = this.permissionForm.get(type);
        for (var _i = 0, _a = arow.controls; _i < _a.length; _i++) {
            var control = _a[_i];
            var val = control.get('range').value;
            if (apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["isNull"](val) || apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["isEmpty"](val)) {
                errFound = true;
                msg = undefined;
            }
            // match with regex
            if (type === 'allowedIps') {
                if (!this.validateIPaddress(val)) {
                    errFound = true;
                    msg = 'Invalid IP Address';
                }
            }
            // match cidr
            if (type === 'allowedCidrs') {
                if (!is_cidr__WEBPACK_IMPORTED_MODULE_4___default()(val)) {
                    errFound = true;
                    msg = 'Invalid CIDR Range';
                }
            }
        }
        if (errFound) {
            this._toasty.warningToast(msg || 'Field Cannot be empty');
        }
        else {
            arow.push(this.initRangeForm());
        }
    };
    SettingPermissionFormComponent.prototype.delRow = function (type, i, e) {
        e.stopPropagation();
        var arow = this.permissionForm.get(type);
        arow.removeAt(i);
    };
    SettingPermissionFormComponent.prototype.submitPermissionForm = function () {
        var _this = this;
        var obj = {};
        var form = apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["cloneDeep"](this.permissionForm.value);
        var CidrArr = [];
        var IpArr = [];
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["forEach"](form.allowedCidrs, function (n) {
            if (n.range) {
                CidrArr.push(n.range);
            }
        });
        apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["forEach"](form.allowedIps, function (n) {
            if (n.range) {
                IpArr.push(n.range);
            }
        });
        if (CidrArr.length > 0) {
            IpArr = [];
        }
        if (IpArr.length > 0) {
            CidrArr = [];
        }
        form.allowedCidrs = CidrArr;
        form.allowedIps = IpArr;
        if (this.selectedTimeSpan === 'Past Period') {
            if (form.duration) {
                form.period = 'day';
            }
            else {
                form.period = null;
            }
            form.from = null;
            form.to = null;
        }
        else {
            form.period = null;
            form.duration = null;
        }
        obj.action = (this.isUpdtCase) ? 'update' : 'create';
        this.dateRangePickerValue = [];
        obj.data = form;
        if (obj.action === 'create') {
            this.store.dispatch(this._accountsAction.shareEntity(form, form.roleUniqueName));
            this.onSubmitForm.emit(obj);
        }
        else if (obj.action === 'update') {
            if ((obj.data.from && obj.data.from) === 'Invalid date' || (obj.data.to && obj.data.to) === 'Invalid date') {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this._settingsPermissionService.UpdatePermission(form).subscribe(function (res) {
                if (res.status === 'success') {
                    _this._toasty.successToast('Permission Updated Successfully!');
                }
                else {
                    _this._toasty.warningToast(res.message, res.code);
                }
                _this.onSubmitForm.emit(obj);
            });
        }
    };
    SettingPermissionFormComponent.prototype.methodForToggleSection = function (id) {
        if (id === 'timeSpanSection') {
            if (this.showTimeSpan) {
                this.showTimeSpan = false;
            }
        }
        if (id === 'rangeSpanSection') {
            if (this.showIPWrap) {
                this.showIPWrap = false;
            }
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Permission__WEBPACK_IMPORTED_MODULE_9__["ShareRequestForm"])
    ], SettingPermissionFormComponent.prototype, "userdata", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SettingPermissionFormComponent.prototype, "isHorizntl", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SettingPermissionFormComponent.prototype, "isUpdtCase", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SettingPermissionFormComponent.prototype, "isLblShow", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_5__["EventEmitter"])
    ], SettingPermissionFormComponent.prototype, "onSubmitForm", void 0);
    SettingPermissionFormComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'setting-permission-form',
            template: __webpack_require__(/*! ./form.component.html */ "./src/app/settings/permissions/form/form.component.html"),
            styles: [__webpack_require__(/*! ./form.component.scss */ "./src/app/settings/permissions/form/form.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_settings_permission_service__WEBPACK_IMPORTED_MODULE_13__["SettingsPermissionService"],
            _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_11__["PermissionActions"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_12__["AccountsAction"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__["ToasterService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"]])
    ], SettingPermissionFormComponent);
    return SettingPermissionFormComponent;
}());



/***/ }),

/***/ "./src/app/settings/permissions/setting.permission.component.html":
/*!************************************************************************!*\
  !*** ./src/app/settings/permissions/setting.permission.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\" pdT2 pdB2\">\n  <h3 class=\"mrB1\"><strong>Give Permission to:</strong></h3>\n  <setting-permission-form [userdata]=\"null\" [isLblShow]=\"false\" [isUpdtCase]=\"false\" [isHorizntl]=\"true\"\n    (onSubmitForm)=\"submitPermissionForm($event)\"></setting-permission-form>\n</div>\n\n<div class=\" \">\n  <h3 class=\"mrB1\"><strong>Users</strong></h3>\n\n\n  <div class=\"box\" *ngIf=\"currentUser\">\n    <div *ngFor=\"let usrGrp of usersList\">\n      <div class=\"user_list\">\n        <div class=\"row\">\n          <div class=\"col-md-2 col-sm-6 col-xs-12 user\">\n            <div class=\"ellp\">\n              <div class=\"ellp\"><i class=\"fa fa-user pdR1\"></i>{{usrGrp.name}}</div>\n              <small class=\"mrL2\">{{usrGrp.rows[0].emailId}}</small>\n            </div>\n          </div>\n          <div class=\"col-md-10 col-sm-6 col-xs-12\">\n            <div class=\"row\">\n              <div class=\"permission_list\">\n                <div class=\"col-md-10 col-sm-10 col-xs-12 permission\" *ngFor=\"let user of usrGrp.rows; let i = index\">\n\n                  <div class=\"col-md-3 col-sm-12 col-xs-12\">\n                    <div class=\"form-group\"><input class=\"form-control\" [value]=\"user.roleName\" disabled /></div>\n                  </div>\n\n                  <div class=\"col-md-3 col-sm-5 col-xs-5\" *ngIf=\"user.from || user.period\">\n                    <div class=\"form-group\">\n                      <input *ngIf=\"user.from && user.to\" class=\"form-control\" value=\"{{user.from}} - {{user.to}}\"\n                        disabled />\n                      <input *ngIf=\"user.period && user.duration\" class=\"form-control\"\n                        value=\"Past &nbsp;{{user.duration}} &nbsp; {{user.period}}S\" disabled />\n                    </div>\n                  </div>\n\n                  <div class=\"col-md-3 col-sm-5 col-xs-5\" *ngIf=\"user.ipsStr || user.cidrsStr\">\n                    <div class=\"form-group\">\n                      <input *ngIf=\"user.ipsStr\" class=\"form-control\" [value]=\"user.ipsStr\" disabled />\n                      <input *ngIf=\"user.cidrsStr\" class=\"form-control\" [value]=\"user.cidrsStr\" disabled />\n                    </div>\n                  </div>\n\n                  <div class=\"ico-btn pull-left col-md-2 col-sm-12 col-xs-12 mrT\">\n                    <button class=\"btn btn-xs\" type=\"button\" [hidden]=\"usrGrp.rows[0].isLoggedInUser\"\n                      (click)=\"showModalForEdit(user)\"><i aria-hidden=\"true\" class=\"fa fa-pencil\"></i></button>\n                    <button class=\"btn btn-xs\" type=\"button\" [hidden]=\"usrGrp.rows[0].isLoggedInUser\"\n                      (click)=\"onRevokePermission(user.uniqueName)\"><i aria-hidden=\"true\"\n                        class=\"fa fa-trash-o\"></i></button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- create Ac modal -->\n\n<div bsModal #editUserModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [config]=\"modalConfig\"\n  *ngIf=\"showEditUserModal\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header pd2 pdL2 pdR2 clearfix\">\n        <h3 class=\"modal-title bg\" id=\"modal-title\">Edit User</h3>\n        <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"closeEditUserModal()\"></i>\n      </div>\n      <div class=\"modal-body\">\n        <setting-permission-form [userdata]=\"selectedUser\" [isLblShow]=\"true\" [isUpdtCase]=\"true\" [isHorizntl]=\"false\"\n          (onSubmitForm)=\"submitPermissionForm($event)\"></setting-permission-form>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/permissions/setting.permission.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/settings/permissions/setting.permission.component.ts ***!
  \**********************************************************************/
/*! exports provided: SettingPermissionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingPermissionComponent", function() { return SettingPermissionComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/general.service */ "./src/app/services/general.service.ts");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/permission/permission.action */ "./src/app/actions/permission/permission.action.ts");
/* harmony import */ var _actions_settings_permissions_settings_permissions_action__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/settings/permissions/settings.permissions.action */ "./src/app/actions/settings/permissions/settings.permissions.action.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");













var SettingPermissionComponent = /** @class */ (function () {
    function SettingPermissionComponent(_settingsPermissionActions, _permissionActions, _accountsAction, store, _fb, _toasty, _generalService) {
        var _this = this;
        this._settingsPermissionActions = _settingsPermissionActions;
        this._permissionActions = _permissionActions;
        this._accountsAction = _accountsAction;
        this.store = store;
        this._fb = _fb;
        this._toasty = _toasty;
        this._generalService = _generalService;
        this.sharedWith = [];
        // modals related
        this.showEditUserModal = false;
        this.modalConfig = {
            animated: true,
            keyboard: false,
            backdrop: 'static',
            ignoreBackdropClick: true
        };
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__["ReplaySubject"](1);
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["select"])(function (s) { return s.session.user; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (result) {
            if (result && result.user) {
                _this._generalService.user = result.user;
                _this.loggedInUserEmail = result.user.email;
            }
        });
    }
    SettingPermissionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.select(function (s) { return s.settings.usersWithCompanyPermissions; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                var data = _.cloneDeep(s);
                var sortedArr = _.groupBy(_this.prepareDataForUI(data), 'emailId');
                var arr_1 = [];
                Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_12__["forIn"])(sortedArr, function (value) {
                    if (value[0].emailId === _this.loggedInUserEmail) {
                        value[0].isLoggedInUser = true;
                    }
                    arr_1.push({ name: value[0].userName, rows: value });
                });
                _this.usersList = _.sortBy(arr_1, ['name']);
            }
        });
    };
    SettingPermissionComponent.prototype.getInitialData = function () {
        var _this = this;
        this.store.dispatch(this._permissionActions.GetRoles());
        this.store.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) {
            _this.selectedCompanyUniqueName = s.session.companyUniqueName;
            _this.store.dispatch(_this._settingsPermissionActions.GetUsersWithPermissions(_this.selectedCompanyUniqueName));
            if (s.session.user) {
                _this.currentUser = s.session.user.user;
            }
        });
    };
    SettingPermissionComponent.prototype.prepareDataForUI = function (data) {
        return data.map(function (o) {
            if (o.allowedCidrs && o.allowedCidrs.length > 0) {
                o.cidrsStr = o.allowedCidrs.toString();
            }
            else {
                o.cidrsStr = null;
            }
            if (o.allowedIps && o.allowedIps.length > 0) {
                o.ipsStr = o.allowedIps.toString();
            }
            else {
                o.ipsStr = null;
            }
            return o;
        });
    };
    SettingPermissionComponent.prototype.submitPermissionForm = function (e) {
        if (e.action === 'update') {
            this.closeEditUserModal();
        }
        this.waitAndReloadCompany();
    };
    SettingPermissionComponent.prototype.onRevokePermission = function (assignRoleEntryUniqueName) {
        if (assignRoleEntryUniqueName) {
            this.store.dispatch(this._accountsAction.unShareEntity(assignRoleEntryUniqueName, 'company', this.selectedCompanyUniqueName));
            this.waitAndReloadCompany();
        }
    };
    SettingPermissionComponent.prototype.showModalForEdit = function (user) {
        var _this = this;
        this.selectedUser = user;
        this.showEditUserModal = true;
        setTimeout(function () { return _this.editUserModal.show(); }, 700);
    };
    SettingPermissionComponent.prototype.closeEditUserModal = function () {
        var _this = this;
        this.editUserModal.hide();
        setTimeout(function () { return _this.showEditUserModal = false; }, 700);
    };
    SettingPermissionComponent.prototype.waitAndReloadCompany = function () {
        var _this = this;
        setTimeout(function () {
            _this.store.dispatch(_this._settingsPermissionActions.GetUsersWithPermissions(_this.selectedCompanyUniqueName));
        }, 2000);
    };
    SettingPermissionComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ViewChild"])('editUserModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["ModalDirective"])
    ], SettingPermissionComponent.prototype, "editUserModal", void 0);
    SettingPermissionComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_7__["Component"])({
            selector: 'setting-permission',
            template: __webpack_require__(/*! ./setting.permission.component.html */ "./src/app/settings/permissions/setting.permission.component.html"),
            styles: ["\n  @media(max-width:767px){\n    .user{\n      padding-bottom:7px;\n    }\n  }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_actions_settings_permissions_settings_permissions_action__WEBPACK_IMPORTED_MODULE_5__["SettingsPermissionActions"],
            _actions_permission_permission_action__WEBPACK_IMPORTED_MODULE_4__["PermissionActions"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_3__["AccountsAction"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_2__["GeneralService"]])
    ], SettingPermissionComponent);
    return SettingPermissionComponent;
}());



/***/ }),

/***/ "./src/app/settings/profile/setting.profile.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/settings/profile/setting.profile.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n  <div class=\"row\">\n    <form (ngSubmit)=\"updateProfile(companyProfileObj)\" class=\"col-lg-10 col-md-11\">\n      <div class=\"row\">\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <label>Company Name</label><br>\n          <input type=\"text\" placeholder=\"Company name\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.name\"\n            name=\"name\" (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\" />\n          <!-- (keydown)=\"keyDownSubject$.next($event)\" -->\n        </div>\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <label>Unique Name</label><br>\n          <input type=\"text\" placeholder=\"Unique Name\" [disabled]=\"true\" class=\"form-control\"\n            [(ngModel)]=\"companyProfileObj.uniqueName\" name=\"uniqueName\"\n            (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\" />\n        </div>\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <label>Email Address</label><br>\n          <input type=\"text\" placeholder=\"Email Address\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.email\"\n            name=\"email\" (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <label>Contact No.</label>\n          <input type=\"text\" placeholder=\"Contact Number\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.contactNo\"\n            #mobileNumberField name=\"contactNo\" (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\" />\n          <!-- commented temporary due to static countryCode  -->\n          <!-- <div class=\"input-group \">\n  <span class=\"input-group-addon\">+{{countryCode}}</span>\n  <input type=\"text\" placeholder=\"Contact Number\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.contactNo\" #mobileNumberField\n    (blur)=\"isValidMobileNumber(mobileNumberField)\" name=\"contactNo\" />\n</div> -->\n        </div>\n        <div class=\"col-lg-3 col-sm-4 col-xs-12 pd0\">\n          <div class=\"form-group col-xs-4 pdR0\">\n            <label>Currency</label><br>\n            <div class=\"custom-select pos-rel\">\n              <sh-select [options]=\"currencySource$ | async\" placeholder=\"Currency\" [isFilterEnabled]=\"true\"\n                name=\"baseCurrency\" [(ngModel)]=\"companyProfileObj.baseCurrency\"\n                (selected)=\"changeEventOfForm('baseCurrency')\"></sh-select>\n            </div>\n            <!-- <input type=\"text\" placeholder=\"Currency\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.baseCurrency\" name=\"baseCurrency\" /> -->\n          </div>\n          <div class=\"form-group col-xs-8\">\n            <div class=\"checkbox pt-26 noMarg\">\n              <label>\n                <input type=\"checkbox\" [(ngModel)]=\"companyProfileObj.isMultipleCurrency\" name=\"isMultiple\"\n                  (change)=\"changeEventOfForm('isMultipleCurrency')\">Multicurrency?\n              </label>\n            </div>\n          </div>\n        </div>\n        <!-- <div class=\"col-lg-3 col-md-4 col-xs-4\">\n                <div class=\"row\">\n                    <div class=\"col-xs-12\">\n                        <div class=\"form-group\">\n                            <label>PAN Number</label><br>\n                            <input type=\"text\" placeholder=\"PAN Number\" maxLength=\"10\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.panNumber\" #panNumberField (blur)=\"isValidPAN(panNumberField)\" name=\"panNumber\" (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\"\n                            />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                            <label>GST Number</label><br>\n                            <input type=\"text\" #gstNumberField placeholder=\"GST Number\" (keyup)=\"setMainState(gstNumberField)\" minlength=\"15\" maxlength=\"15\" (blur)=\"checkGstNumValidation(gstNumberField)\" class=\"form-control\" name=\"gstNumber\" (value)=\"getDefaultGstNumber()\" />\n                        </div>\n                    </div>\n                </div>\n            </div> -->\n        <div class=\"col-lg-3 col-sm-4 col-xs-12\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <div class=\"form-group clearfix\">\n                <label>Inventory Type</label>\n                <div class=\"mrT1\">\n                  <label class=\"radio-inline pd0 w100\">\n                    <input type=\"radio\" class=\"radio_theme cp ml0\"\n                      [checked]=\"CompanySettingsObj?.companyInventorySettings && CompanySettingsObj?.companyInventorySettings?.manageInventory\"\n                      (change)=\"updateInventorySetting(true)\" name=\"inventoryType\" />Product\n                  </label>\n                  <label class=\"radio-inline pd0 mrL2\">\n                    <input type=\"radio\" class=\"radio_theme cp\"\n                      [checked]=\"CompanySettingsObj?.companyInventorySettings && !CompanySettingsObj?.companyInventorySettings?.manageInventory\"\n                      (change)=\"updateInventorySetting(false)\" name=\"inventoryType\" />Service\n                  </label>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <label>Address</label><br>\n          <textarea rows=\"4\" style=\"height: 170px;\" type=\"text\" placeholder=\"Address\" class=\"form-control\"\n            [(ngModel)]=\"companyProfileObj.address\" name=\"address\"\n            (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\"></textarea>\n        </div>\n        <div class=\"form-group col-lg-3 col-sm-4 col-xs-12\">\n          <div class=\"clearfix\">\n            <div class=\"form-group\">\n              <label>Country</label><br>\n              <sh-select placeholder=\"Select Country\" name=\"country_dd\" [(ngModel)]=\"companyProfileObj.country\"\n                [options]=\"countrySource\" [ItemHeight]=\"33\" (selected)=\"checkCountry($event)\"></sh-select>\n              <!-- <input type=\"text\" placeholder=\"Country\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.country\" (ngModelChange)=\"checkCountry($event)\" name=\"country\" /> -->\n            </div>\n\n            <div class=\"form-group select2-parent\">\n              <label>State</label><br>\n              <sh-select placeholder=\"Select state\" name=\"state_dd\" [(ngModel)]=\"companyProfileObj.state\"\n                [options]=\"statesSourceCompany\" [ItemHeight]=\"33\" (selected)=\"selectState($event)\"\n                [hidden]=\"!countryIsIndia\"></sh-select>\n              <input type=\"text\" placeholder=\"State\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.state\"\n                [hidden]=\"countryIsIndia\" name=\"state\" (keydown)=\"pushToUpdate($event);keyDownSubject$.next($event)\" />\n            </div>\n          </div>\n          <!-- Removed city label G0-1822 -->\n          <!-- <div class=\"\">\n            <div class=\"row\">\n              <div class=\"col-xs-6\">\n                <div class=\"\">\n                  <label>City</label><br>\n                  <input [ngbTypeahead]=\"dataSource\" type=\"text\" [resultTemplate]=\"rt\"\n                    (selectItem)=\"typeaheadOnSelect($event)\" [(ngModel)]=\"companyProfileObj.city\" class=\"form-control\"\n                    name=\"city\" autocomplete=\"off\" required maxlength=\"50\" placeholder=\"City\"\n                    pattern=\"^[^\\s]+(\\s+[^\\s]+)*$\">\n                  <ng-template #rt let-r=\"result\" let-t=\"term\">\n                    <span>{{ r }}</span>\n                  </ng-template>-->\n                  <!-- <input type=\"text\" placeholder=\"City\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.city\" name=\"city\" /> -->\n               <!-- </div>\n              </div>\n              <div class=\"col-xs-6\">\n                <div class=\"\">\n                  <label>Pincode</label><br>\n                  <input type=\"text\" placeholder=\"Pincode\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.pincode\"\n                    name=\"pincode\" (blur)=\"savePincode($event)\" />\n                </div>\n              </div>\n            </div>\n          </div> -->\n        </div>\n        <div class=\" col-lg-3 col-sm-4 col-xs-12 \">\n          <div class=\"row \">\n            <div class=\"form-group col-xs-12 col-sm-6 \">\n              <label>Digits After Decimal</label><br>\n              <div class=\"custom-select pos-rel \">\n                <sh-select [options]=\"decimalDigitSource \" placeholder=\"select type \" [isFilterEnabled]=\"true \"\n                  name=\"digitafterdecimal \" [(ngModel)]=\"companyProfileObj.balanceDecimalPlaces\"\n                  (selected)=\"checkDigitAfterDecimal($event) \"></sh-select>\n              </div>\n              <!-- <input type=\"text \" placeholder=\"Currency \" class=\"form-control \" [(ngModel)]=\"companyProfileObj.baseCurrency \" name=\"baseCurrency \" /> -->\n            </div>\n            <div class=\"form-group col-xs-12 col-sm-6 \">\n              <label>Number System</label><br>\n              <div class=\"custom-select pos-rel \">\n                <!-- <sh-select [options]=\"numberSystemSource \" placeholder=\"Select type \" [isFilterEnabled]=\"true \" name=\"numberSystem \" [(ngModel)]=\"companyProfileObj.balanceDisplayFormat \" (selected)=\"checkNumberSystem($event) \"></sh-select> -->\n                <sh-select #shnumberSystemSource [options]=\"numberSystemSource \" name=\"numberSystem \"\n                  [(ngModel)]=\"companyProfileObj.balanceDisplayFormat \" (selected)=\"checkNumberSystem($event) \"\n                  [placeholder]=\" 'Select type'\n                                    \" [ItemHeight]=\"41 \">\n                  <ng-template #optionTemplate let-option=\"option \">\n                    <ng-container>\n                      <a href=\"javascript:void(0) \" class=\"list-item \" style=\"border-bottom: 1px solid #ccc; \">\n                        <p class=\"numberSystem \">{{ option.label }} <span\n                            class=\"pull-right \">{{ option.additional.type}}</span></p>\n                      </a>\n                    </ng-container>\n                  </ng-template>\n                </sh-select>\n              </div>\n              <!-- <input type=\"text \" placeholder=\"Currency \" class=\"form-control \" [(ngModel)]=\"companyProfileObj.baseCurrency \" name=\"baseCurrency \" /> -->\n            </div>\n          </div>\n          <div class=\"form-group \">\n            <div *ngIf=\"companyProfileObj.branchCount>0\" class=\"form-group\">\n              <label>Branch Unique Name</label><br>\n              <div class=\"custom-select pos-rel\">\n                <input type=\"text\" [(ngModel)]=\"companyProfileObj.nameAlias\" placeholder=\"Branch unique name\"\n                  name=\"nameAlias\" class=\"form-control\" (blur)=\"nameAlisPush($event)\"\n                  (keydown)=\"pushToUpdate($event);\" /> </div>\n              <!-- <input type=\"text\" placeholder=\"Currency\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.baseCurrency\" name=\"baseCurrency\" /> -->\n            </div>\n            <div *ngIf=\"companyProfileObj.branchCount==0\" class=\"form-group\">\n              <label>Headquarter Unique Name</label><br>\n              <div class=\"custom-select pos-rel\">\n                <input type=\"text\" [(ngModel)]=\"companyProfileObj.nameAlias\" placeholder=\"Headquarter unique name\"\n                  name=\"nameAlias\" class=\"form-control\" (blur)=\"nameAlisPush($event)\"\n                  (keydown)=\"pushToUpdate($event);\" /> </div>\n              <!-- <input type=\"text\" placeholder=\"Currency\" class=\"form-control\" [(ngModel)]=\"companyProfileObj.baseCurrency\" name=\"baseCurrency\" /> -->\n            </div>\n          </div>\n        </div>\n\n\n      </div>\n\n      <div class=\"row mrB1\" *ngIf=\"companyProfileObj.country && companyProfileObj.country.toLowerCase() === 'india'\">\n        <div class=\"col-xs-12\">\n          <hr>\n          <br />\n          <h3 class=\"mrB1\"> Add <span\n              *ngIf=\"companyProfileObj.gstDetails && companyProfileObj.gstDetails.length >= 1\">More</span> GST Number\n            (Note: Check to set to default)</h3>\n          <button type=\"button\" (click)=\"addGst()\" class=\"btn btn-primary\"><i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\n            Add\n          </button>\n          <div *ngFor=\"let gst of companyProfileObj.gstDetails; let i = index\" class=\"mrT1 company_gst\"\n            [ngClass]=\"{'mrT2': i != gst.length-1, 'bdrB': i != gst.length-1}\">\n            <div class=\"row\">\n              <div class=\"col-lg-3 col-sm-4 col-xs-12\">\n                <div class=\"row\">\n                  <div class=\"col-xs-12\">\n                    <div class=\"form-group\">\n                      <label for=\"\" class=\"d-block\">GSTIN</label>\n                      <div class=\"input-group\">\n                        <div class=\"input-group-addon\">\n                          <input type=\"checkbox\" (click)=\"setGstAsDefault(i, $event)\"\n                            [(ngModel)]=\"gst.addressList[0].isDefault\" name=\"isDefault+{{i}}\" tooltip=\"Default GST\"\n                            placement=\"bottom\" (change)=\"checkGstDetails()\" />\n                        </div>\n                        <input type=\"text\" placeholder=\"GST No.\" minlength=\"15\" maxlength=\"15\" class=\"form-control\"\n                          (keyup)=\"setChildState(gstNumberField, i);\" #gstNumberField\n                          (blur)=\"checkGstNumValidation(gstNumberField);gstKeyDownSubject$.next($event)\"\n                          [(ngModel)]=\"gst.gstNumber\" name=\"newgstNumber+{{i}}\" />\n                        <div class=\"input-group-addon\">\n                          <i class=\"fa fa-trash-o cp\" (click)=\"removeGstEntry(i)\" aria-hidden=\"true\"\n                            style=\"font-size:18px;\" tooltip=\"Delete GST\" placement=\"right\"></i>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"col-xs-12\">\n                    <div class=\"form-group select2-parent\">\n                      <label>State</label><br>\n                      <sh-select [disabled]=\"gst.gstNumber != ''\" (selected)=\"stateSelected($event, i)\"\n                        placeholder=\"Select state\" name=\"newstateCode+{{i}}\" [options]=\"statesSource$ | async\"\n                        [(ngModel)]=\"gst.addressList[0].stateCode\"></sh-select>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-lg-3 col-sm-4 col-xs-12\">\n                <div class=\"form-group\">\n                  <label>Address</label><br>\n                  <textarea rows=\"4\" type=\"text\" placeholder=\"Address\" class=\"form-control\"\n                    [(ngModel)]=\"gst.addressList[0].address\" #gstAddressField name=\"newaddress+{{i}}\"\n                    (keydown)=\"gstKeyDownSubject$.next($event)\"></textarea>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-xs-12 text-center\" *ngIf=\"gstDetailsBackup\">\n            <button type=\"button\" class=\"btn btn-link\" (click)=\"onToggleAllGSTDetails()\">\n              <span *ngIf=\"!showAllGST\">Show more</span>\n              <span *ngIf=\"showAllGST\">Show less</span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <!-- <div class=\"clearfix\">\n            <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!isGstValid || !isPANValid || !isMobileNumberValid\">\n        Update\n      </button>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"onReset()\">Cancel</button>\n        </div> -->\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/profile/setting.profile.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/settings/profile/setting.profile.component.ts ***!
  \***************************************************************/
/*! exports provided: SettingProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingProfileComponent", function() { return SettingProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _services_companyService_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/companyService.service */ "./src/app/services/companyService.service.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_location_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../services/location.service */ "./src/app/services/location.service.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/countryWithCodes */ "./src/app/shared/helpers/countryWithCodes.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_currencyNumberSystem__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/currencyNumberSystem */ "./src/app/shared/helpers/currencyNumberSystem.ts");














var SettingProfileComponent = /** @class */ (function () {
    function SettingProfileComponent(router, store, settingsProfileActions, _companyService, _toasty, _location) {
        var _this = this;
        this.router = router;
        this.store = store;
        this.settingsProfileActions = settingsProfileActions;
        this._companyService = _companyService;
        this._toasty = _toasty;
        this._location = _location;
        this.companyProfileObj = {};
        this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        this.currencySource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        this.addNewGstEntry = false;
        this.newGstObj = {};
        this.states = [];
        this.statesInBackground = [];
        this.isGstValid = false;
        this.isPANValid = false;
        this.isMobileNumberValid = false;
        this.countryCode = '91';
        this.gstDetailsBackup = null;
        this.showAllGST = true;
        this.countryIsIndia = false;
        this.countrySource = [];
        this.statesSourceCompany = [];
        this.keyDownSubject$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.gstKeyDownSubject$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.dataToSave = {};
        this.CompanySettingsObj = {};
        this.numberSystemSource = [];
        this.decimalDigitSource = [];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.stateResponse = null;
        this.stateStream$ = this.store.select(function (s) { return s.general.states; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        apps_web_giddh_src_app_shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_11__["contriesWithCodes"].map(function (c) {
            _this.countrySource.push({ value: c.countryName, label: c.countryflag + " - " + c.countryName });
        });
        this.stateStream$.subscribe(function (data) {
            if (data) {
                _this.stateResponse = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](data);
                data.map(function (d) {
                    _this.states.push({ label: d.code + " - " + d.name, value: d.code });
                    _this.statesInBackground.push({ label: "" + d.name, value: d.code });
                    _this.statesSourceCompany.push({ label: "" + d.name, value: "" + d.name });
                });
            }
            _this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_this.states);
        }, function (err) {
            // console.log(err);
        });
        this.store.select(function (s) { return s.session.currencies; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            var currencies = [];
            if (data) {
                data.map(function (d) {
                    currencies.push({ label: d.code, value: d.code });
                });
            }
            _this.currencySource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(currencies);
        });
        apps_web_giddh_src_app_shared_helpers_currencyNumberSystem__WEBPACK_IMPORTED_MODULE_13__["currencyNumberSystems"].map(function (c) {
            _this.numberSystemSource.push({ value: c.value, label: "" + c.name, additional: c });
        });
        apps_web_giddh_src_app_shared_helpers_currencyNumberSystem__WEBPACK_IMPORTED_MODULE_13__["digitAfterDecimal"].map(function (d) {
            _this.decimalDigitSource.push({ value: d.value, label: d.name });
        });
    }
    SettingProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initProfileObj();
        this.dataSource = function (text$) {
            return text$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (term) {
                if (term.startsWith(' ', 0)) {
                    return [];
                }
                return _this._location.GetCity({
                    QueryString: _this.companyProfileObj.city,
                    AdministratorLevel: undefined,
                    Country: undefined,
                    OnlyCity: true
                }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (e) {
                    return [];
                }));
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) {
                // let data = res.map(item => item.address_components[0].long_name);
                var data = res.map(function (item) { return item.city; });
                _this.dataSourceBackup = res;
                return data;
            }));
        };
        this.keyDownSubject$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(5000), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$))
            .subscribe(function (event) {
            _this.patchProfile(_this.dataToSave);
        });
        this.gstKeyDownSubject$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(3000), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$))
            .subscribe(function (event) {
            if (_this.isGstValid) {
                _this.patchProfile({ gstDetails: _this.companyProfileObj.gstDetails });
            }
        });
    };
    SettingProfileComponent.prototype.getInitialProfileData = function () {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    };
    SettingProfileComponent.prototype.getInventorySettingData = function () {
        this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());
    };
    SettingProfileComponent.prototype.initProfileObj = function () {
        var _this = this;
        this.isGstValid = true;
        this.isPANValid = true;
        this.isMobileNumberValid = true;
        // getting profile info from store
        // distinctUntilKeyChanged('profileRequest')
        this.store.select(function (p) { return p.settings.inventory; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.profileRequest || 1 === 1) {
                var inventorySetting = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o);
                _this.CompanySettingsObj = inventorySetting;
            }
        });
        this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o.profileRequest || 1 === 1) {
                var profileObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](o);
                if (profileObj.contactNo && profileObj.contactNo.indexOf('-') > -1) {
                    profileObj.contactNo = profileObj.contactNo.substring(profileObj.contactNo.indexOf('-') + 1);
                }
                if (profileObj.gstDetails && profileObj.gstDetails.length > 3) {
                    _this.gstDetailsBackup = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](profileObj.gstDetails);
                    _this.showAllGST = false;
                    profileObj.gstDetails = profileObj.gstDetails.slice(0, 3);
                }
                if (profileObj.gstDetails && !profileObj.gstDetails.length) {
                    var newGstObj = {
                        gstNumber: '',
                        addressList: [{
                                stateCode: '',
                                stateName: '',
                                address: '',
                                isDefault: false
                            }]
                    };
                    profileObj.gstDetails.push(newGstObj);
                }
                _this.companyProfileObj = profileObj;
                _this.companyProfileObj.balanceDecimalPlaces = String(profileObj.balanceDecimalPlaces);
                if (profileObj && profileObj.country) {
                    var countryName = profileObj.country.toLocaleLowerCase();
                    if (countryName === 'india') {
                        _this.countryIsIndia = true;
                    }
                }
                _this.checkCountry(false);
                // this.selectState(false);
            }
        });
        this.store.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) {
            if (s.session.user) {
                _this.countryCode = s.session.user.countryCode ? s.session.user.countryCode : '91';
            }
        });
    };
    SettingProfileComponent.prototype.addGst = function () {
        var gstDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.companyProfileObj.gstDetails);
        var gstNumber;
        var isValid;
        if (gstDetails && gstDetails.length) {
            gstNumber = gstDetails[gstDetails.length - 1].gstNumber;
            isValid = (Number(gstNumber.substring(0, 2)) > 37 || Number(gstNumber.substring(0, 2)) < 1 || gstNumber.length !== 15) ? false : true;
        }
        else {
            isValid = true;
        }
        // this.isGstValid
        if (isValid) {
            var companyDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.companyProfileObj);
            var newGstObj = {
                gstNumber: '',
                addressList: [{
                        stateCode: '',
                        stateName: '',
                        address: '',
                        isDefault: false
                    }]
            };
            companyDetails.gstDetails.push(newGstObj);
            this.companyProfileObj = companyDetails;
        }
        else {
            this._toasty.errorToast('Please enter valid GST number to add more GST details.');
        }
    };
    SettingProfileComponent.prototype.stateSelected = function (v, indx) {
        var profileObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.companyProfileObj);
        var selectedStateCode = v.value;
        var selectedState = this.states.find(function (state) { return state.value === selectedStateCode; });
        if (selectedState && selectedState.value) {
            profileObj.gstDetails[indx].addressList[0].stateName = '';
            this.companyProfileObj = profileObj;
            // this.checkGstDetails();
        }
    };
    SettingProfileComponent.prototype.updateProfile = function (data) {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](data);
        if (dataToSave.gstDetails.length > 0) {
            // console.log('dataToSave.gstDetails is :', dataToSave.gstDetails);
            for (var _i = 0, _a = dataToSave.gstDetails; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (!entry.gstNumber && entry.addressList && !entry.addressList[0].stateCode && !entry.addressList[0].address) {
                    dataToSave.gstDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["without"](dataToSave.gstDetails, entry);
                }
            }
        }
        delete dataToSave.financialYears;
        delete dataToSave.activeFinancialYear;
        // dataToSave.contactNo = this.countryCode + '-' + dataToSave.contactNo;
        this.companyProfileObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](dataToSave);
        if (this.gstDetailsBackup) {
            dataToSave.gstDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.gstDetailsBackup);
        }
        // if (this.countryIsIndia) {
        //   dataToSave.state = null;
        // }
        this.store.dispatch(this.settingsProfileActions.UpdateProfile(dataToSave));
    };
    SettingProfileComponent.prototype.updateInventorySetting = function (data) {
        var dataToSaveNew = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.CompanySettingsObj);
        dataToSaveNew.companyInventorySettings = { manageInventory: data };
        this.store.dispatch(this.settingsProfileActions.UpdateInventory(dataToSaveNew));
    };
    SettingProfileComponent.prototype.removeGstEntry = function (indx) {
        var profileObj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.companyProfileObj);
        if (indx > -1) {
            profileObj.gstDetails.splice(indx, 1);
            if (this.gstDetailsBackup) {
                this.gstDetailsBackup.splice(indx, 1);
            }
        }
        this.companyProfileObj = profileObj;
        this.checkGstDetails();
    };
    SettingProfileComponent.prototype.setGstAsDefault = function (indx, ev) {
        if (indx > -1 && ev.target.checked) {
            for (var _i = 0, _a = this.companyProfileObj.gstDetails; _i < _a.length; _i++) {
                var entry = _a[_i];
                entry.addressList[0].isDefault = false;
            }
            if (this.companyProfileObj.gstDetails && this.companyProfileObj.gstDetails[indx] && this.companyProfileObj.gstDetails[indx].addressList && this.companyProfileObj.gstDetails[indx].addressList[0]) {
                this.companyProfileObj.gstDetails[indx].addressList[0].isDefault = true;
            }
        }
    };
    SettingProfileComponent.prototype.getDefaultGstNumber = function () {
        if (this.companyProfileObj && this.companyProfileObj.gstDetails) {
            var profileObj_1 = this.companyProfileObj;
            var defaultGstObjIndx_1;
            profileObj_1.gstDetails.forEach(function (obj, indx) {
                if (profileObj_1.gstDetails[indx] && profileObj_1.gstDetails[indx].addressList[0] && profileObj_1.gstDetails[indx].addressList[0].isDefault) {
                    defaultGstObjIndx_1 = indx;
                }
            });
            // console.log('defaultGstObjIndx is :', defaultGstObjIndx);
            return '';
        }
        return '';
    };
    SettingProfileComponent.prototype.checkGstNumValidation = function (ele) {
        var isInvalid = false;
        if (ele.value) {
            if (ele.value.length !== 15 || (Number(ele.value.substring(0, 2)) < 1) || (Number(ele.value.substring(0, 2)) > 37)) {
                this._toasty.errorToast('Invalid GST number');
                ele.classList.add('error-box');
                this.isGstValid = false;
            }
            else {
                ele.classList.remove('error-box');
                this.isGstValid = true;
                // this.checkGstDetails();
            }
        }
        else {
            ele.classList.remove('error-box');
        }
    };
    SettingProfileComponent.prototype.setMainState = function (ele) {
        this.companyProfileObj.state = Number(ele.value.substring(0, 2));
    };
    SettingProfileComponent.prototype.setChildState = function (ele, index) {
        var stateCode = Number(ele.value.substring(0, 2));
        if (stateCode <= 37) {
            if (stateCode < 10 && stateCode !== 0) {
                stateCode = (stateCode < 10) ? '0' + stateCode.toString() : stateCode.toString();
            }
            else if (stateCode === 0) {
                stateCode = '';
            }
            this.companyProfileObj.gstDetails[index].addressList[0].stateCode = stateCode.toString();
        }
        else {
            this.companyProfileObj.gstDetails[index].addressList[0].stateCode = '';
        }
    };
    /**
     * onReset
     */
    SettingProfileComponent.prototype.onReset = function () {
        this.initProfileObj();
    };
    SettingProfileComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SettingProfileComponent.prototype.isValidPAN = function (ele) {
        var panNumberRegExp = new RegExp(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/g);
        if (ele.value) {
            if (ele.value.match(panNumberRegExp)) {
                ele.classList.remove('error-box');
                this.isPANValid = true;
                this.patchProfile({ panNumber: ele.value });
            }
            else {
                this.isPANValid = false;
                this._toasty.errorToast('Invalid PAN number');
                ele.classList.add('error-box');
            }
        }
    };
    SettingProfileComponent.prototype.isValidMobileNumber = function (ele) {
        if (ele.value) {
            if (ele.value.length > 9 && ele.value.length < 16) {
                ele.classList.remove('error-box');
                this.isMobileNumberValid = true;
            }
            else {
                this.isMobileNumberValid = false;
                this._toasty.errorToast('Invalid Contact number');
                ele.classList.add('error-box');
            }
        }
    };
    SettingProfileComponent.prototype.onToggleAllGSTDetails = function () {
        if ((this.companyProfileObj.gstDetails.length === this.gstDetailsBackup.length) && (this.gstDetailsBackup.length === 3)) {
            this.gstDetailsBackup = null;
        }
        else {
            this.showAllGST = !this.showAllGST;
            if (this.gstDetailsBackup) {
                if (this.showAllGST) {
                    this.companyProfileObj.gstDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.gstDetailsBackup);
                }
                else {
                    this.companyProfileObj.gstDetails = this.companyProfileObj.gstDetails.slice(0, 3);
                }
            }
        }
    };
    /**
     * checkCountry
     */
    SettingProfileComponent.prototype.checkCountry = function (event) {
        if (event) {
            var country = _lodash_optimized__WEBPACK_IMPORTED_MODULE_8__["cloneDeep"](this.companyProfileObj.country || '');
            country = country.toLocaleLowerCase();
            if (event.value === 'India') {
                this.countryIsIndia = true;
                this.companyProfileObj.state = '';
            }
            else {
                this.countryIsIndia = false;
                this.companyProfileObj.state = '';
            }
            this.patchProfile({ country: this.companyProfileObj.country });
        }
    };
    SettingProfileComponent.prototype.selectState = function (event) {
        if (event) {
            this.patchProfile({ state: this.companyProfileObj.state });
        }
    };
    SettingProfileComponent.prototype.changeEventOfForm = function (key) {
        var _a;
        this.patchProfile((_a = {}, _a[key] = this.companyProfileObj[key], _a));
    };
    SettingProfileComponent.prototype.checkGstDetails = function () {
        this.patchProfile({ gstDetails: this.companyProfileObj.gstDetails });
    };
    SettingProfileComponent.prototype.patchProfile = function (obj) {
        for (var member in obj) {
            if (obj[member] === null) {
                obj[member] = '';
            }
        }
        if (obj.contactNo && !this.isMobileNumberValid) {
            delete obj['contactNo'];
        }
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    };
    SettingProfileComponent.prototype.typeaheadOnSelect = function (e) {
        var _this = this;
        this.dataSourceBackup.forEach(function (item) {
            if (item.city === e.item) {
                _this.companyProfileObj.country = item.country;
                _this.patchProfile({ city: _this.companyProfileObj.city });
                // set country and state values
                // try {
                //   item.address_components.forEach(address => {
                //     let stateIdx = _.indexOf(address.types, 'administrative_area_level_1');
                //     let countryIdx = _.indexOf(address.types, 'country');
                //     if (stateIdx !== -1) {
                //       if (this.stateResponse) {
                //         let selectedState = this.stateResponse.find((state: States) => state.name === address.long_name);
                //         if (selectedState) {
                //           this.companyProfileObj.state = selectedState.code;
                //         }
                //       }
                //     }
                //     if (countryIdx !== -1) {
                //       this.companyProfileObj.country = address.long_name;
                //     }
                //   });
                // } catch (e) {
                //   console.log(e);
                // }
            }
        });
    };
    SettingProfileComponent.prototype.pushToUpdate = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.dataToSave[event.target.name] = _this.companyProfileObj[event.target.name];
        }, 100);
    };
    /**
* checkNumberSystem
*/
    SettingProfileComponent.prototype.checkNumberSystem = function (event) {
        if (event) {
            this.patchProfile({ balanceDisplayFormat: this.companyProfileObj.balanceDisplayFormat });
        }
    };
    SettingProfileComponent.prototype.checkDigitAfterDecimal = function (event) {
        if (!event) {
            return;
        }
        this.patchProfile({ balanceDecimalPlaces: this.companyProfileObj.balanceDecimalPlaces });
    };
    SettingProfileComponent.prototype.nameAlisPush = function (event) {
        if (!event) {
            return;
        }
        this.patchProfile({ nameAlias: this.companyProfileObj.nameAlias });
    };
    SettingProfileComponent.prototype.savePincode = function (event) {
        this.patchProfile({ pincode: this.companyProfileObj.pincode });
    };
    SettingProfileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'setting-profile',
            template: __webpack_require__(/*! ./setting.profile.component.html */ "./src/app/settings/profile/setting.profile.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_12__["trigger"])('fadeInAndSlide', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_12__["transition"])(':enter', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_12__["style"])({ opacity: '0', marginTop: '100px' }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_12__["animate"])('.1s ease-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_12__["style"])({ opacity: '1', marginTop: '20px' })),
                    ]),
                ]),
            ],
            styles: [__webpack_require__(/*! ../../shared/header/components/company-add/company-add.component.css */ "./src/app/shared/header/components/company-add/company-add.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_6__["SettingsProfileActions"],
            _services_companyService_service__WEBPACK_IMPORTED_MODULE_7__["CompanyService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"],
            _services_location_service__WEBPACK_IMPORTED_MODULE_10__["LocationService"]])
    ], SettingProfileComponent);
    return SettingProfileComponent;
}());



/***/ }),

/***/ "./src/app/settings/settings.component.css":
/*!*************************************************!*\
  !*** ./src/app/settings/settings.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/settings/settings.component.html":
/*!**************************************************!*\
  !*** ./src/app/settings/settings.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid settings-bg\"\n     [keyboardShortcut]=\"['alt+right', 'alt+left']\"\n     [config]=\"{ignoreHost:true}\"\n     (onShortcutPress)=\"selectTabByShortcut($event)\">\n  <div class=\"row\">\n\n    <div class=\"col-xs-12\" id=\"settingTab\">\n\n      <tabset #staticTabs>\n\n        <tab heading=\"Taxes\" [active]=\"activeTab === 'taxes'\" (select)=\"tabChanged('taxes')\">\n          <setting-taxes></setting-taxes>\n        </tab>\n\n        <tab heading=\"Integration\" (select)=\"integrationSelected($event); tabChanged('integration')\"\n             [active]=\"activeTab === 'integration'\">\n          <setting-integration #integrationComponent selectedTabParent=\"{{selectedChildTab}}\"></setting-integration>\n        </tab>\n\n        <tab heading=\"Linked Accounts\" (select)=\"linkedAccountSelected($event); tabChanged('linked-accounts')\"\n             [active]=\"activeTab === 'linked-accounts'\">\n          <setting-linked-accounts #eBankComp></setting-linked-accounts>\n        </tab>\n\n        <tab heading=\"Profile\" (select)=\"profileSelected($event); tabChanged('profile')\"\n             [active]=\"activeTab === 'profile'\">\n          <setting-profile #profileComponent></setting-profile>\n          <span *ngIf=\"isCompanyProfileUpdated && (isUpdateCompanyInProgress$ | async)\" class=\"auto_save\"\n                style=\"float: right;\"><i class=\"glyphicon glyphicon-refresh mrR fs14 rotate\"></i>Saving...</span>\n          <span *ngIf=\"isCompanyProfileUpdated && !(isUpdateCompanyInProgress$ | async)\" class=\"auto_save\"\n                style=\"float: right;\"><i class=\"glyphicon glyphicon-check mrR fs14\"></i>Saved</span>\n        </tab>\n\n        <tab heading=\"Financial Year\" (select)=\"financialYearSelected($event); tabChanged('financial-year')\"\n             [active]=\"activeTab === 'financial-year'\">\n          <financial-year #financialYearComp></financial-year>\n        </tab>\n\n        <!-- Arpit: Sagar told me to remove this condition from permission tab -->\n        <!-- *ngIf=\"isUserSuperAdmin\" -->\n\n        <tab (select)=\"permissionTabSelected($event); tabChanged('permission')\" heading=\"Permission\"\n             [active]=\"activeTab === 'permission'\">\n          <setting-permission #permissionComp></setting-permission>\n        </tab>\n\n        <tab heading=\"Branch\" [active]=\"activeTab === 'branch'\" (select)=\"tabChanged('branch')\">\n          <setting-branch></setting-branch>\n        </tab>\n\n        <tab heading=\"Tags\" (select)=\"tagsTabSelected($event);tabChanged('tag')\" [active]=\"activeTab === 'tag'\">\n          <setting-tags #tagComp></setting-tags>\n        </tab>\n\n        <tab heading=\"Trigger\" [active]=\"activeTab === 'trigger'\" (select)=\"tabChanged('trigger')\">\n          <setting-trigger></setting-trigger>\n        </tab>\n\n        <tab heading=\"Discount\" [active]=\"activeTab === 'discount'\" (select)=\"tabChanged('discount')\">\n          <setting-discount></setting-discount>\n        </tab>\n        <!--  commented due to under discussion\n\n        -->\n        <tab heading=\"\" (select)=\"tagsTabSelected($event)\">\n          <setting-bunch #bunchComp></setting-bunch>\n        </tab>\n\n      </tabset>\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/settings.component.ts":
/*!************************************************!*\
  !*** ./src/app/settings/settings.component.ts ***!
  \************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apps/web-giddh/src/app/services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _permissions_setting_permission_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./permissions/setting.permission.component */ "./src/app/settings/permissions/setting.permission.component.ts");
/* harmony import */ var _linked_accounts_setting_linked_accounts_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./linked-accounts/setting.linked.accounts.component */ "./src/app/settings/linked-accounts/setting.linked.accounts.component.ts");
/* harmony import */ var _financial_year_financial_year_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./financial-year/financial-year.component */ "./src/app/settings/financial-year/financial-year.component.ts");
/* harmony import */ var _profile_setting_profile_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./profile/setting.profile.component */ "./src/app/settings/profile/setting.profile.component.ts");
/* harmony import */ var _integration_setting_integration_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./integration/setting.integration.component */ "./src/app/settings/integration/setting.integration.component.ts");
/* harmony import */ var apps_web_giddh_src_app_permissions_permission_data_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! apps/web-giddh/src/app/permissions/permission-data.service */ "./src/app/permissions/permission-data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _tags_tags_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./tags/tags.component */ "./src/app/settings/tags/tags.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _bunch_bunch_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./bunch/bunch.component */ "./src/app/settings/bunch/bunch.component.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../actions/settings/settings.integration.action */ "./src/app/actions/settings/settings.integration.action.ts");






















var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(store, companyActions, settingsProfileActions, _permissionDataService, _route, router, _authenticationService, _toast, _generalActions, settingsIntegrationActions) {
        this.store = store;
        this.companyActions = companyActions;
        this.settingsProfileActions = settingsProfileActions;
        this._permissionDataService = _permissionDataService;
        this._route = _route;
        this.router = router;
        this._authenticationService = _authenticationService;
        this._toast = _toast;
        this._generalActions = _generalActions;
        this.settingsIntegrationActions = settingsIntegrationActions;
        this.isUserSuperAdmin = false;
        this.isCompanyProfileUpdated = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
        this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
        this.isUpdateCompanyInProgress$ = this.store.select(function (s) { return s.settings.updateProfileInProgress; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isCompanyProfileUpdated = false;
    }
    Object.defineProperty(SettingsComponent.prototype, "shortcutEnabled", {
        get: function () {
            return document.activeElement === document.body;
        },
        enumerable: true,
        configurable: true
    });
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            if (params['type'] && _this.activeTab !== params['type']) {
                // if active tab is null or undefined then it means component initialized for the first time
                if (!_this.activeTab) {
                    _this.setStateDetails(params['type']);
                }
                _this.activeTab = params['type'];
            }
        });
        this._route.queryParams.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (val) {
            if (val.tab === 'integration' && val.code) {
                _this.saveGmailAuthCode(val.code);
                _this.activeTab = val.tab;
            }
        });
        this.isUpdateCompanyInProgress$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (yes) {
            if (yes) {
                _this.isCompanyProfileUpdated = true;
            }
        });
    };
    /**
     * Selects next tab on `TAB` key Press and previous tab on `SHIFT+TAB` key press.
     * @param key Key that was pressed.
     */
    SettingsComponent.prototype.selectTabByShortcut = function (key) {
        var selectedId = this.staticTabs.tabs.findIndex(function (p) { return p.active; });
        if (key === 'alt+right' && selectedId < this.staticTabs.tabs.length) {
            this.staticTabs.tabs[selectedId + 1].active = true;
        }
        else if (selectedId > 0) {
            this.staticTabs.tabs[selectedId - 1].active = true;
        }
    };
    SettingsComponent.prototype.selectTab = function (id) {
        this.staticTabs.tabs[id].active = true;
    };
    SettingsComponent.prototype.disableEnable = function () {
        this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled;
    };
    SettingsComponent.prototype.profileSelected = function (e) {
        if (e.heading === 'Profile') {
            this.profileComponent.getInitialProfileData();
            this.profileComponent.getInventorySettingData();
        }
    };
    SettingsComponent.prototype.integrationSelected = function (e) {
        if (e.heading === 'Integration') {
            this.integrationComponent.getInitialData();
        }
    };
    SettingsComponent.prototype.financialYearSelected = function (e) {
        this.financialYearComp.getInitialFinancialYearData();
    };
    SettingsComponent.prototype.linkedAccountSelected = function (e) {
        this.eBankComp.getInitialEbankInfo();
    };
    SettingsComponent.prototype.permissionTabSelected = function (e) {
        this.permissionComp.getInitialData();
    };
    SettingsComponent.prototype.tagsTabSelected = function (e) {
        if (e.heading === 'Tags') {
            this.tagComp.getTags();
        }
    };
    SettingsComponent.prototype.bunchTabSelected = function (e) {
        if (e.heading === 'bunch') {
            this.bunchComp.getAllBunch();
        }
    };
    SettingsComponent.prototype.tabChanged = function (tab) {
        this.setStateDetails(tab);
        this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab));
        this.router.navigate(['pages/settings/', tab], { replaceUrl: true });
    };
    SettingsComponent.prototype.saveGmailAuthCode = function (authCode) {
        var _this = this;
        var dataToSave = {
            code: authCode,
            client_secret: this.getGoogleCredentials("http://test.giddh.com/").GOOGLE_CLIENT_SECRET,
            client_id: this.getGoogleCredentials("http://test.giddh.com/").GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl("http://test.giddh.com/")
        };
        this._authenticationService.saveGmailAuthCode(dataToSave).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toast.successToast('Gmail account added successfully.', 'Success');
            }
            else {
                _this._toast.errorToast(res.message, res.code);
            }
            _this.store.dispatch(_this.settingsIntegrationActions.GetGmailIntegrationStatus());
            // this.router.navigateByUrl('/pages/settings?tab=integration&tabIndex=1');
        });
    };
    SettingsComponent.prototype.getRedirectUrl = function (baseHref) {
        if (baseHref.indexOf('dev.giddh.com') > -1) {
            return 'http://dev.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('test.giddh.com') > -1) {
            return 'http://test.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('stage.giddh.com') > -1) {
            return 'http://stage.giddh.com/app/pages/settings?tab=integration';
        }
        else if (baseHref.indexOf('localapp.giddh.com') > -1) {
            return 'http://localapp.giddh.com:3000/pages/settings?tab=integration';
        }
        else {
            return 'https://giddh.com/app/pages/settings?tab=integration';
        }
    };
    SettingsComponent.prototype.getGoogleCredentials = function (baseHref) {
        if (baseHref === 'https://giddh.com/' || false) {
            return {
                GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: 'eWzLFEb_T9VrzFjgE40Bz6_l'
            };
        }
        else {
            return {
                GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: '8htr7iQVXfZp_n87c99-jm7a'
            };
        }
    };
    SettingsComponent.prototype.setStateDetails = function (type) {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_12__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'pages/settings/' + type;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('staticTabs'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["TabsetComponent"])
    ], SettingsComponent.prototype, "staticTabs", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('integrationComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _integration_setting_integration_component__WEBPACK_IMPORTED_MODULE_8__["SettingIntegrationComponent"])
    ], SettingsComponent.prototype, "integrationComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('profileComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _profile_setting_profile_component__WEBPACK_IMPORTED_MODULE_7__["SettingProfileComponent"])
    ], SettingsComponent.prototype, "profileComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('financialYearComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _financial_year_financial_year_component__WEBPACK_IMPORTED_MODULE_6__["FinancialYearComponent"])
    ], SettingsComponent.prototype, "financialYearComp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('eBankComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _linked_accounts_setting_linked_accounts_component__WEBPACK_IMPORTED_MODULE_5__["SettingLinkedAccountsComponent"])
    ], SettingsComponent.prototype, "eBankComp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('permissionComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _permissions_setting_permission_component__WEBPACK_IMPORTED_MODULE_4__["SettingPermissionComponent"])
    ], SettingsComponent.prototype, "permissionComp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('tagComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _tags_tags_component__WEBPACK_IMPORTED_MODULE_16__["SettingsTagsComponent"])
    ], SettingsComponent.prototype, "tagComp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ViewChild"])('bunchComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _bunch_bunch_component__WEBPACK_IMPORTED_MODULE_18__["BunchComponent"])
    ], SettingsComponent.prototype, "bunchComp", void 0);
    SettingsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["Component"])({
            template: __webpack_require__(/*! ./settings.component.html */ "./src/app/settings/settings.component.html"),
            styles: [__webpack_require__(/*! ./settings.component.css */ "./src/app/settings/settings.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_14__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_13__["CompanyActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_15__["SettingsProfileActions"],
            apps_web_giddh_src_app_permissions_permission_data_service__WEBPACK_IMPORTED_MODULE_9__["PermissionDataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_17__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_17__["Router"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_19__["AuthenticationService"],
            apps_web_giddh_src_app_services_toaster_service__WEBPACK_IMPORTED_MODULE_3__["ToasterService"],
            _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_20__["GeneralActions"],
            _actions_settings_settings_integration_action__WEBPACK_IMPORTED_MODULE_21__["SettingsIntegrationActions"]])
    ], SettingsComponent);
    return SettingsComponent;
}());



/***/ }),

/***/ "./src/app/settings/settings.module.ts":
/*!*********************************************!*\
  !*** ./src/app/settings/settings.module.ts ***!
  \*********************************************/
/*! exports provided: SettingsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsModule", function() { return SettingsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _permissions_setting_permission_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./permissions/setting.permission.component */ "./src/app/settings/permissions/setting.permission.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _settings_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./settings.component */ "./src/app/settings/settings.component.ts");
/* harmony import */ var _integration_setting_integration_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./integration/setting.integration.component */ "./src/app/settings/integration/setting.integration.component.ts");
/* harmony import */ var _profile_setting_profile_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./profile/setting.profile.component */ "./src/app/settings/profile/setting.profile.component.ts");
/* harmony import */ var _Taxes_setting_taxes_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Taxes/setting.taxes.component */ "./src/app/settings/Taxes/setting.taxes.component.ts");
/* harmony import */ var _Taxes_confirmation_confirmation_model_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Taxes/confirmation/confirmation.model.component */ "./src/app/settings/Taxes/confirmation/confirmation.model.component.ts");
/* harmony import */ var _settings_routing_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./settings.routing.module */ "./src/app/settings/settings.routing.module.ts");
/* harmony import */ var _linked_accounts_setting_linked_accounts_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./linked-accounts/setting.linked.accounts.component */ "./src/app/settings/linked-accounts/setting.linked.accounts.component.ts");
/* harmony import */ var _linked_accounts_connect_bank_modal_connect_bank_modal_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./linked-accounts/connect-bank-modal/connect.bank.modal.component */ "./src/app/settings/linked-accounts/connect-bank-modal/connect.bank.modal.component.ts");
/* harmony import */ var _linked_accounts_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./linked-accounts/confirmation-modal/confirmation.modal.component */ "./src/app/settings/linked-accounts/confirmation-modal/confirmation.modal.component.ts");
/* harmony import */ var _financial_year_financial_year_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./financial-year/financial-year.component */ "./src/app/settings/financial-year/financial-year.component.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-bootstrap/tabs */ "../../node_modules/ngx-bootstrap/tabs/index.js");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _permissions_form_form_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./permissions/form/form.component */ "./src/app/settings/permissions/form/form.component.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _shared_helpers_pipes_omitBy_omitBy_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../shared/helpers/pipes/omitBy/omitBy.module */ "./src/app/shared/helpers/pipes/omitBy/omitBy.module.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "../../node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _branch_branch_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./branch/branch.component */ "./src/app/settings/branch/branch.component.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var _tags_tags_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./tags/tags.component */ "./src/app/settings/tags/tags.component.ts");
/* harmony import */ var _Trigger_setting_trigger_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./Trigger/setting.trigger.component */ "./src/app/settings/Trigger/setting.trigger.component.ts");
/* harmony import */ var _bunch_bunch_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./bunch/bunch.component */ "./src/app/settings/bunch/bunch.component.ts");
/* harmony import */ var ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ngx-perfect-scrollbar */ "../../node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var _bunch_components_modal_create_bunch_create_bunch_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./bunch/components-modal/create-bunch/create-bunch.component */ "./src/app/settings/bunch/components-modal/create-bunch/create-bunch.component.ts");
/* harmony import */ var _bunch_components_modal_add_company_bunch_add_company_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./bunch/components-modal/add-company/bunch-add-company.component */ "./src/app/settings/bunch/components-modal/add-company/bunch-add-company.component.ts");
/* harmony import */ var _bunch_components_modal_get_companies_get_companies_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./bunch/components-modal/get-companies/get-companies.component */ "./src/app/settings/bunch/components-modal/get-companies/get-companies.component.ts");
/* harmony import */ var _discount_discount_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./discount/discount.component */ "./src/app/settings/discount/discount.component.ts");
/* harmony import */ var _contact_contact_module__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../contact/contact.module */ "./src/app/contact/contact.module.ts");
/* harmony import */ var _theme_confirm_modal__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../theme/confirm-modal */ "./src/app/theme/confirm-modal/index.ts");
/* harmony import */ var _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../shared/helpers/directives/keyboardShortcut/keyboardShortut.module */ "./src/app/shared/helpers/directives/keyboardShortcut/keyboardShortut.module.ts");
/* harmony import */ var _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../shared/helpers/pipes/currencyPipe/currencyType.module */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts");
/* harmony import */ var _shared_aside_menu_create_tax_aside_menu_create_tax_module__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ../shared/aside-menu-create-tax/aside-menu-create-tax.module */ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.module.ts");










// import { SettingsLinkedAccountsComponent } from './linked-accounts/settings.linked-accounts.component';































var SettingsModule = /** @class */ (function () {
    function SettingsModule() {
    }
    SettingsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["NgModule"])({
            declarations: [
                // components here
                _settings_component__WEBPACK_IMPORTED_MODULE_6__["SettingsComponent"],
                _integration_setting_integration_component__WEBPACK_IMPORTED_MODULE_7__["SettingIntegrationComponent"],
                _profile_setting_profile_component__WEBPACK_IMPORTED_MODULE_8__["SettingProfileComponent"],
                _Taxes_setting_taxes_component__WEBPACK_IMPORTED_MODULE_9__["SettingTaxesComponent"],
                // SettingsLinkedAccountsComponent,
                _Taxes_confirmation_confirmation_model_component__WEBPACK_IMPORTED_MODULE_10__["DeleteTaxConfirmationModelComponent"],
                _linked_accounts_setting_linked_accounts_component__WEBPACK_IMPORTED_MODULE_12__["SettingLinkedAccountsComponent"],
                _linked_accounts_connect_bank_modal_connect_bank_modal_component__WEBPACK_IMPORTED_MODULE_13__["ConnectBankModalComponent"],
                _linked_accounts_confirmation_modal_confirmation_modal_component__WEBPACK_IMPORTED_MODULE_14__["SettingLinkedAccountsConfirmationModalComponent"],
                _financial_year_financial_year_component__WEBPACK_IMPORTED_MODULE_15__["FinancialYearComponent"],
                _permissions_setting_permission_component__WEBPACK_IMPORTED_MODULE_2__["SettingPermissionComponent"],
                _permissions_form_form_component__WEBPACK_IMPORTED_MODULE_21__["SettingPermissionFormComponent"],
                _branch_branch_component__WEBPACK_IMPORTED_MODULE_25__["BranchComponent"],
                _discount_discount_component__WEBPACK_IMPORTED_MODULE_35__["DiscountComponent"],
                _tags_tags_component__WEBPACK_IMPORTED_MODULE_28__["SettingsTagsComponent"],
                _Trigger_setting_trigger_component__WEBPACK_IMPORTED_MODULE_29__["SettingTriggerComponent"],
                _bunch_bunch_component__WEBPACK_IMPORTED_MODULE_30__["BunchComponent"],
                _bunch_components_modal_create_bunch_create_bunch_component__WEBPACK_IMPORTED_MODULE_32__["CreateBunchModalComponent"],
                _bunch_components_modal_add_company_bunch_add_company_component__WEBPACK_IMPORTED_MODULE_33__["BunchAddCompanyModalComponent"],
                _bunch_components_modal_get_companies_get_companies_component__WEBPACK_IMPORTED_MODULE_34__["GetBunchModalComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _settings_routing_module__WEBPACK_IMPORTED_MODULE_11__["SettingRountingModule"],
                ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_18__["TabsModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__["DatepickerModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_17__["ModalModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_19__["SelectModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_20__["LaddaModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_22__["ClickOutsideModule"],
                _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_38__["KeyboardShortutModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_16__["BsDatepickerModule"].forRoot(),
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_1__["ShSelectModule"],
                _shared_helpers_pipes_omitBy_omitBy_module__WEBPACK_IMPORTED_MODULE_23__["OmitByKeyPipeModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_24__["NgbTypeaheadModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_26__["BsDropdownModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_27__["ElementViewChildModule"],
                ngx_perfect_scrollbar__WEBPACK_IMPORTED_MODULE_31__["PerfectScrollbarModule"],
                _contact_contact_module__WEBPACK_IMPORTED_MODULE_36__["ContactModule"],
                _theme_confirm_modal__WEBPACK_IMPORTED_MODULE_37__["ConfirmModalModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_26__["TooltipModule"],
                _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_39__["CurrencyModule"],
                _shared_aside_menu_create_tax_aside_menu_create_tax_module__WEBPACK_IMPORTED_MODULE_40__["AsideMenuCreateTaxModule"]
            ]
        })
    ], SettingsModule);
    return SettingsModule;
}());



/***/ }),

/***/ "./src/app/settings/settings.routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/settings/settings.routing.module.ts ***!
  \*****************************************************/
/*! exports provided: SettingRountingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingRountingModule", function() { return SettingRountingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings.component */ "./src/app/settings/settings.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");





var SettingRountingModule = /** @class */ (function () {
    function SettingRountingModule() {
    }
    SettingRountingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '', component: _settings_component__WEBPACK_IMPORTED_MODULE_1__["SettingsComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]], redirectTo: 'taxes'
                    },
                    {
                        path: ':type', component: _settings_component__WEBPACK_IMPORTED_MODULE_1__["SettingsComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]]
        })
    ], SettingRountingModule);
    return SettingRountingModule;
}());



/***/ }),

/***/ "./src/app/settings/tags/tags.component.html":
/*!***************************************************!*\
  !*** ./src/app/settings/tags/tags.component.html ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box clearfix mrT2\">\n  <form>\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <h1 class=\"section_head\">Create Tag</h1>\n        <div class=\"form-group clearfix col-sm-3 col-xs-12\">\n          <form (submit)=\"createTag(newTag)\" class=\"row\">\n            <div>\n              <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" name=\"tagName\" [(ngModel)]=\"newTag.name\"\n                  placeholder=\"Tag Name\" />\n              </div>\n              <div class=\"form-group\">\n                <textarea class=\"form-control\" name=\"tagDescription\" [(ngModel)]=\"newTag.description\"\n                  placeholder=\"Tag Desciption (optional)\"></textarea>\n              </div>\n              <div class=\"mrT1\">\n                <button type=\"submit\" class=\"btn btn-success btn-sm\" [disabled]=\"!newTag.name\">Create</button>\n              </div>\n            </div>\n          </form>\n        </div>\n        <hr class=\"clearfix\">\n        <div class=\"form-group mrT1 clearfix\">\n          <div>\n            <span class=\"pull-left searchTag\">\n              <input type=\"text\" [(ngModel)]=\"searchText\" (keyup)=\"filterData(searchText)\" class=\"form-control\"\n                name=\"search_text\" placeholder=\"Search tag\" />\n            </span>\n            <!-- <div>\n                <button class=\"btn btn-success btn-sm mrL1\" (click)=\"filterData(searchText);\">Search</button>\n            </div> -->\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"tagsTable\">\n            <div class=\"\">\n              <table class=\"table-bordered basic table mrB onMobileView\">\n                <thead>\n                  <tr>\n                    <th>Sr. No.</th>\n                    <th>Tags Name</th>\n                    <th>Tags Description</th>\n                    <th>Action</th>\n                  </tr>\n                </thead>\n                <tbody *ngIf=\"(tags$ | async)\">\n                  <tr *ngFor=\"let tag of tags$ | async; let i = index\">\n                    <td data-title=\"#\">{{i+1}}</td>\n                    <td data-title=\"Tags Name\">\n                      <span *ngIf=\"updateIndex !== i\">{{tag.name}}</span>\n                      <input *ngIf=\"updateIndex === i\" type=\"text\" class=\"form-control\" name=\"name_of_{{i}}\"\n                        [(ngModel)]=\"tag.name\" />\n                    </td>\n                    <td data-title=\"Tags Desciption\">\n                      <div *ngIf=\"updateIndex !== i\">{{tag.description}}</div>\n                      <textarea *ngIf=\"updateIndex === i\" class=\"form-control\" name=\"description_of_{{i}}\"\n                        [(ngModel)]=\"tag.description\"></textarea>\n                    </td>\n                    <td class=\"icon-btn\" data-title=\"Action\">\n                      <button *ngIf=\"updateIndex !== i\" (click)=\"setUpdateIndex(i);\" type=\"button\" class=\"btn btn-xs\"><i\n                          class=\"fa fa-pencil\" aria-hidden=\"true\" tooltip=\"Edit\"></i></button>\n                      <button *ngIf=\"updateIndex !== i\" (click)=\"deleteTag(tag, i);\" type=\"button\" class=\"btn btn-xs\"><i\n                          class=\"fa fa-trash\" aria-hidden=\"true\" tooltip=\"Delete\"></i></button>\n                      <button *ngIf=\"updateIndex === i\" (click)=\"updateTag(tag, i);\" type=\"button\" class=\"btn btn-xs\"><i\n                          class=\"fa fa-check\" aria-hidden=\"true\"></i></button>\n                      <button *ngIf=\"updateIndex === i\" (click)=\"resetUpdateIndex();\" type=\"button\"\n                        class=\"btn btn-xs\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button>\n                    </td>\n                  </tr>\n                </tbody>\n                <tbody *ngIf=\"!(tags$ | async)\" class=\"onMobileView noRecords\">\n                  <tr>\n                    <td colspan=\"4\" class=\"text-center empty_table\">\n                      <h1>No Record Found !!</h1>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n    </div>\n  </form>\n</div>\n\n<!-- add branch modal -->\n<div bsModal #confirmationModal=\"bs-modal\" [config]=\"{backdrop: 'static', keyboard: false}\" class=\"modal fade\"\n  role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header clearfix\">\n        <h3>Confirmation</h3>\n        <span aria-hidden=\"true\" class=\"close\" (click)=\"onUserConfirmation(false)\" data-dismiss=\"modal\">×</span>\n      </div>\n      <div class=\"modal-body\" [innerHTML]=\"confirmationMessage\">\n      </div>\n      <div class=\"modal-footer clearfix\">\n        <button (click)=\"onUserConfirmation(true)\" class=\"btn btn-sm btn-success\">Yes</button>\n        <button (click)=\"onUserConfirmation(false)\" class=\"btn btn-sm btn-danger\">No</button>\n      </div>\n      <!-- modal footer -->\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/settings/tags/tags.component.scss":
/*!***************************************************!*\
  !*** ./src/app/settings/tags/tags.component.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".tagsTable {\n  max-width: 600px;\n  width: 100%; }\n\n.tagsTable td:nth-child(3) {\n  white-space: inherit; }\n\n@media (max-width: 768px) {\n  .tagsTable {\n    max-width: 100%;\n    width: 100%;\n    padding: 0 15px; } }\n"

/***/ }),

/***/ "./src/app/settings/tags/tags.component.ts":
/*!*************************************************!*\
  !*** ./src/app/settings/tags/tags.component.ts ***!
  \*************************************************/
/*! exports provided: SettingsTagsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsTagsComponent", function() { return SettingsTagsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../actions/settings/tag/settings.tag.actions */ "./src/app/actions/settings/tag/settings.tag.actions.ts");
/* harmony import */ var _models_api_models_settingsTags__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../models/api-models/settingsTags */ "./src/app/models/api-models/settingsTags.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");












var SettingsTagsComponent = /** @class */ (function () {
    function SettingsTagsComponent(router, store, settingsTagsActions, _toasty) {
        this.router = router;
        this.store = store;
        this.settingsTagsActions = settingsTagsActions;
        this._toasty = _toasty;
        this.newTag = new _models_api_models_settingsTags__WEBPACK_IMPORTED_MODULE_10__["TagRequest"]();
        this.updateIndex = null;
        this.confirmationMessage = '';
        this.searchText = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
    }
    SettingsTagsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tags$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_8__["createSelector"])([function (state) { return state.settings.tags; }], function (tags) {
            if (tags && tags.length) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["map"](tags, function (tag) {
                    tag.uniqueName = tag.name;
                });
                var tagsData = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["orderBy"](tags, 'name');
                _this.tagsBackup = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](tagsData);
                return tagsData;
            }
            else {
                _this.tagsBackup = null;
                return null;
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    };
    SettingsTagsComponent.prototype.getTags = function () {
        this.store.dispatch(this.settingsTagsActions.GetALLTags());
    };
    SettingsTagsComponent.prototype.createTag = function (tag) {
        this.store.dispatch(this.settingsTagsActions.CreateTag(tag));
        this.newTag = new _models_api_models_settingsTags__WEBPACK_IMPORTED_MODULE_10__["TagRequest"]();
    };
    SettingsTagsComponent.prototype.updateTag = function (tag, indx) {
        this.store.dispatch(this.settingsTagsActions.UpdateTag(tag));
        this.updateIndex = null;
    };
    SettingsTagsComponent.prototype.deleteTag = function (tag) {
        this.newTag = tag;
        this.confirmationMessage = "Are you sure want to delete <b>" + tag.name + "</b>?";
        this.confirmationModal.show();
    };
    SettingsTagsComponent.prototype.setUpdateIndex = function (indx) {
        this.updateIndex = indx;
    };
    SettingsTagsComponent.prototype.resetUpdateIndex = function () {
        this.tags$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](this.tagsBackup));
        this.updateIndex = null;
    };
    SettingsTagsComponent.prototype.onUserConfirmation = function (yesOrNo) {
        this.confirmationModal.hide();
        if (yesOrNo) {
            var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](this.newTag);
            this.store.dispatch(this.settingsTagsActions.DeleteTag(data));
        }
        this.newTag = new _models_api_models_settingsTags__WEBPACK_IMPORTED_MODULE_10__["TagRequest"]();
        this.confirmationMessage = '';
    };
    SettingsTagsComponent.prototype.filterData = function (searchTxt) {
        var tags = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["filter"](this.tagsBackup, function (tag) { return tag.name.includes(searchTxt.toLowerCase()); });
        this.tags$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(tags);
    };
    SettingsTagsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('confirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_11__["ModalDirective"])
    ], SettingsTagsComponent.prototype, "confirmationModal", void 0);
    SettingsTagsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'setting-tags',
            template: __webpack_require__(/*! ./tags.component.html */ "./src/app/settings/tags/tags.component.html"),
            styles: [__webpack_require__(/*! ./tags.component.scss */ "./src/app/settings/tags/tags.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_9__["SettingsTagActions"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"]])
    ], SettingsTagsComponent);
    return SettingsTagsComponent;
}());



/***/ }),

/***/ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\" [keyboardShortcut]=\"'esc'\" (onShortcutPress)=\"closeEvent.emit()\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeEvent.emit()\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">{{ tax && tax.uniqueName ? 'Update ' : 'Create New ' }}Tax</h3>\n  </div>\n\n  <div class=\"aside-body aside-create-tax-component\">\n    <div class=\"form-group pdT2\">\n\n      <form class=\"\" #taxForm=\"ngForm\" (ngSubmit)=\"onSubmit()\">\n        <div class=\"row\">\n\n          <div class=\"form-group col-sm-6 col-xs-12\">\n            <label>Select Tax <span class=\"text-danger\">*</span> </label><br>\n            <sh-select [options]=\"taxList\" name=\"taxType\" [(ngModel)]=\"newTaxObj.taxType\" [placeholder]=\"'Select Tax'\"\n              required [ItemHeight]=\"33\"></sh-select>\n          </div>\n\n\n          <div class=\"form-group col-sm-6 col-xs-12\">\n            <label>Tax Percent <span class=\"text-danger\">*</span> </label><br>\n            <input type=\"number\" [(ngModel)]=\"newTaxObj.taxValue\" name=\"taxValue\" required class=\"form-control\"\n              min=\"-100\" max=\"100\" />\n          </div>\n\n        </div>\n\n        <div class=\"row\">\n\n          <div class=\"form-group col-sm-6 col-xs-12\">\n            <label>Name <span class=\"text-danger\">*</span> </label><br>\n            <input type=\"text\" placeholder=\"Name\" [(ngModel)]=\"newTaxObj.name\" name=\"name\" class=\"form-control\" required\n              (ngModelChange)=\"genUniqueName()\" />\n          </div>\n\n          <div class=\"form-group col-sm-6 col-xs-12\">\n            <label>Unique No. </label><br>\n            <input type=\"text\" [(ngModel)]=\"newTaxObj.taxNumber\" name=\"taxNumber\" placeholder=\"Unique Number\" required\n              class=\"form-control\" />\n          </div>\n\n          <div class=\"form-group col-sm-6 col-xs-12\" *ngIf=\"newTaxObj.taxType === 'tds' || newTaxObj.taxType === 'tcs'\">\n            <label>Select Type <span class=\"text-danger\">*</span> </label><br>\n            <sh-select [options]=\"tdsTcsTaxSubTypes\" name=\"tdsTcsTaxSubTypes\" [(ngModel)]=\"newTaxObj.tdsTcsTaxSubTypes\"\n              [placeholder]=\"'Select Type'\" [ItemHeight]=\"33\" required></sh-select>\n          </div>\n\n        </div>\n\n        <div class=\"row\">\n\n          <div class=\"form-group col-sm-6 col-xs-12\" *ngIf=\"newTaxObj.taxType === 'cess'\">\n            <label>Link Tax</label><br>\n            <sh-select [options]=\"allTaxes\" name=\"linkTax\" [(ngModel)]=\"newTaxObj.taxType\" [placeholder]=\"'Link Tax'\"\n              [ItemHeight]=\"33\"></sh-select>\n          </div>\n\n          <div class=\"form-group col-sm-6 col-xs-12\" *ngIf=\"newTaxObj.taxType === 'others' && !tax\">\n            <label>Linked Account <span class=\"text-danger\">*</span></label><br>\n            <sh-select [customFilter]=\"customAccountFilter\" placeholder=\"Select Account\" name=\"account\"\n              [(ngModel)]=\"newTaxObj.account\" [options]=\"flattenAccountsOptions\"></sh-select>\n          </div>\n\n\n        </div>\n        <div *ngIf=\"tax\" class=\"row\">\n          <div class=\"col-xs-12\">\n            Linked Account\n            <div class=\"custom-tags\">\n              <span *ngFor=\"let acc of newTaxObj.accounts\">\n                {{ acc.name }}\n              </span>\n            </div>\n          </div>\n        </div>\n\n\n        <div *ngIf=\"newTaxObj.taxType === 'cess'\">\n          <input type=\"checkbox\" /> Is any other tax linked to it\n        </div>\n\n        <div class=\"row\">\n\n          <div class=\"form-group col-sm-4 col-xs-12\">\n            <label>Apply Tax From</label>\n            <div class=\"input-group\">\n\n              <input name=\"lastInvoiceDate\" placeholder=\"Daterangepicker\" [(ngModel)]=\"newTaxObj.date\" type=\"text\"\n                [bsConfig]=\"{dateInputFormat:'DD-MM-YYYY', showWeekNumbers: false}\" class=\"form-control\"\n                [outsideClick]=\"true\" bsDatepicker required>\n            </div>\n\n          </div>\n\n          <div class=\"form-group col-sm-4 col-xs-12 \">\n            <label>Tax Duration <span class=\"text-danger\">*</span> </label><br>\n            <sh-select placeholder=\"Select Duration\" name=\"duration\" required [(ngModel)]=\"newTaxObj.duration\"\n              [options]=\"duration\" [ItemHeight]=\"33\"></sh-select>\n          </div>\n\n          <div class=\"form-group col-sm-4 col-xs-12\">\n            <label>Filing Date <span class=\"text-danger\">*</span> </label>\n            <sh-select placeholder=\"Select Date\" [customSorting]=\"customDateSorting\" name=\"taxFileDate\"\n              [(ngModel)]=\"newTaxObj.taxFileDate\" required [options]=\"days\" [ItemHeight]=\"33\"></sh-select>\n          </div>\n\n        </div>\n\n        <div class=\"row\">\n\n          <div class=\"col-xs-12 mrT1\">\n            <button type=\"submit\" class=\"btn btn-success\" *ngIf=\"!tax\" [disabled]=\"taxForm.invalid\"\n              [ladda]=\"isTaxCreateInProcess\">Create\n            </button>\n\n            <button type=\"submit\" class=\"btn btn-success\" *ngIf=\"tax && tax.uniqueName\" [disabled]=\"taxForm.invalid\"\n              [ladda]=\"isUpdateTaxInProcess\">Update\n            </button>\n\n            <button type=\"button\" (click)=\"closeEvent.emit()\" class=\"btn btn-danger\">Cancel</button>\n          </div>\n\n        </div>\n      </form>\n\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: fixed;\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 480px;\n  z-index: 999; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: -41px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  width: 480px; }\n\n.custom-tags {\n  display: -webkit-box;\n  display: flex;\n  padding: 0;\n  margin: 0;\n  flex-wrap: wrap; }\n\n.custom-tags span {\n    border: 1px solid #ddd;\n    padding: 5px 8px;\n    margin: 10px 10px 12px 0px;\n    background-color: #ddd; }\n\n.input-group {\n  width: 100%; }\n\n@media (max-width: 575px) {\n  :host {\n    width: 100%;\n    max-width: 320px; }\n  :host .aside-pane {\n    width: 100%;\n    max-width: 320px; } }\n\n@media (max-width: 375px) {\n  :host {\n    width: 100%;\n    max-width: 280px; }\n  :host .aside-pane {\n    width: 100%;\n    max-width: 280px; } }\n"

/***/ }),

/***/ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.ts ***!
  \*********************************************************************************/
/*! exports provided: AsideMenuCreateTaxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuCreateTaxComponent", function() { return AsideMenuCreateTaxComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _actions_settings_taxes_settings_taxes_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/settings/taxes/settings.taxes.action */ "./src/app/actions/settings/taxes/settings.taxes.action.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");











var AsideMenuCreateTaxComponent = /** @class */ (function () {
    function AsideMenuCreateTaxComponent(store, _settingsTaxesActions, _toaster) {
        this.store = store;
        this._settingsTaxesActions = _settingsTaxesActions;
        this._toaster = _toaster;
        this.closeEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.taxList = [
            { label: 'GST', value: 'gst' },
            { label: 'COMMONGST', value: 'commongst' },
            { label: 'InputGST', value: 'inputgst' },
            { label: 'TDS', value: 'tds' },
            { label: 'TCS', value: 'tcs' },
            { label: 'CESS', value: 'gstcess' },
            { label: 'Others', value: 'others' },
        ];
        this.duration = [
            { label: 'Monthly', value: 'MONTHLY' },
            { label: 'Quarterly', value: 'QUARTERLY' },
            { label: 'Half-Yearly', value: 'HALFYEARLY' },
            { label: 'Yearly', value: 'YEARLY' }
        ];
        this.tdsTcsTaxSubTypes = [
            { label: 'Receivable', value: 'rc' },
            { label: 'Payable', value: 'pay' }
        ];
        this.allTaxes = [];
        this.days = [];
        this.newTaxObj = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_2__["TaxResponse"]();
        this.flattenAccountsOptions = [];
        this.isTaxCreateInProcess = false;
        this.isUpdateTaxInProcess = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        for (var i = 1; i <= 31; i++) {
            this.days.push({ label: i.toString(), value: i.toString() });
        }
        this.newTaxObj.date = moment_moment__WEBPACK_IMPORTED_MODULE_7__().toDate();
    }
    AsideMenuCreateTaxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.general.flattenAccounts; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$))
            .subscribe(function (data) {
            if (data && data.length) {
                var arr_1 = [];
                data.forEach(function (f) {
                    arr_1.push({ label: f.name + " - (" + f.uniqueName + ")", value: f.uniqueName });
                });
                _this.flattenAccountsOptions = arr_1;
            }
        });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.taxes; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$))
            .subscribe(function (taxes) {
            if (taxes && taxes.length) {
                var arr_2 = [];
                taxes.forEach(function (tax) {
                    arr_2.push({ label: tax.name, value: tax.uniqueName });
                });
                _this.allTaxes = arr_2;
            }
        });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.isTaxCreationInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) { return _this.isTaxCreateInProcess = result; });
        this.store
            .pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.isTaxUpdatingInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) { return _this.isUpdateTaxInProcess = result; });
    };
    AsideMenuCreateTaxComponent.prototype.ngOnChanges = function (changes) {
        if ('tax' in changes && changes.tax.currentValue && (changes.tax.currentValue !== changes.tax.previousValue)) {
            var chkIfTDSOrTcs = this.tax.taxType.includes('tcs') || this.tax.taxType.includes('tds');
            var subTyp = void 0;
            if (chkIfTDSOrTcs) {
                subTyp = this.tax.taxType.includes('rc') ? 'rc' : 'pay';
            }
            this.newTaxObj = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.tax, { taxValue: this.tax.taxDetail[0].taxValue, date: moment_moment__WEBPACK_IMPORTED_MODULE_7__(this.tax.taxDetail[0].date).toDate(), tdsTcsTaxSubTypes: subTyp ? subTyp : null, taxType: subTyp ? this.tax.taxType.replace(subTyp, '') : this.tax.taxType, taxFileDate: this.tax.taxFileDate.toString() });
        }
    };
    AsideMenuCreateTaxComponent.prototype.customAccountFilter = function (term, item) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    };
    AsideMenuCreateTaxComponent.prototype.customDateSorting = function (a, b) {
        return (parseInt(a.label) - parseInt(b.label));
    };
    AsideMenuCreateTaxComponent.prototype.genUniqueName = function () {
        var val = this.newTaxObj.name;
        val = Object(_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_10__["uniqueNameInvalidStringReplace"])(val);
        if (val) {
            var isDuplicate = this.allTaxes.some(function (s) { return s.value.toLowerCase().includes(val); });
            if (isDuplicate) {
                this.newTaxObj.taxNumber = val + 1;
            }
            else {
                this.newTaxObj.taxNumber = val;
            }
        }
        else {
            this.newTaxObj.taxNumber = '';
        }
    };
    AsideMenuCreateTaxComponent.prototype.onSubmit = function () {
        var dataToSave = _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["cloneDeep"](this.newTaxObj);
        if (dataToSave.taxType === 'tcs' || dataToSave.taxType === 'tds') {
            if (dataToSave.tdsTcsTaxSubTypes === 'rc') {
                dataToSave.taxType = dataToSave.taxType + "rc";
            }
            else {
                dataToSave.taxType = dataToSave.taxType + "pay";
            }
        }
        dataToSave.taxDetail = [{
                taxValue: dataToSave.taxValue,
                date: dataToSave.date
            }];
        if (dataToSave.taxType === 'others') {
            if (!dataToSave.accounts) {
                dataToSave.accounts = [];
            }
            this.flattenAccountsOptions.forEach(function (obj) {
                if (obj.value === dataToSave.account) {
                    var accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
                }
            });
        }
        dataToSave.date = moment_moment__WEBPACK_IMPORTED_MODULE_7__(dataToSave.date).format('DD-MM-YYYY');
        dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
        dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];
        if (this.tax && this.tax.uniqueName) {
            this.store.dispatch(this._settingsTaxesActions.UpdateTax(dataToSave));
        }
        else {
            this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuCreateTaxComponent.prototype, "closeEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Company__WEBPACK_IMPORTED_MODULE_2__["TaxResponse"])
    ], AsideMenuCreateTaxComponent.prototype, "tax", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], AsideMenuCreateTaxComponent.prototype, "asidePaneState", void 0);
    AsideMenuCreateTaxComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'aside-menu-create-tax-component',
            template: __webpack_require__(/*! ./aside-menu-create-tax.component.html */ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.html"),
            styles: [__webpack_require__(/*! ./aside-menu-create-tax.component.scss */ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"], _actions_settings_taxes_settings_taxes_action__WEBPACK_IMPORTED_MODULE_8__["SettingsTaxesActions"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"]])
    ], AsideMenuCreateTaxComponent);
    return AsideMenuCreateTaxComponent;
}());



/***/ }),

/***/ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.module.ts":
/*!******************************************************************************!*\
  !*** ./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.module.ts ***!
  \******************************************************************************/
/*! exports provided: AsideMenuCreateTaxModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuCreateTaxModule", function() { return AsideMenuCreateTaxModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _aside_menu_create_tax_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./aside-menu-create-tax.component */ "./src/app/shared/aside-menu-create-tax/aside-menu-create-tax.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../helpers/directives/keyboardShortcut/keyboardShortut.module */ "./src/app/shared/helpers/directives/keyboardShortcut/keyboardShortut.module.ts");










var AsideMenuCreateTaxModule = /** @class */ (function () {
    function AsideMenuCreateTaxModule() {
    }
    AsideMenuCreateTaxModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"], _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_5__["ShSelectModule"], angular2_ladda__WEBPACK_IMPORTED_MODULE_6__["LaddaModule"], _helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_7__["DecimalDigitsModule"], ngx_bootstrap__WEBPACK_IMPORTED_MODULE_8__["BsDatepickerModule"], _helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_9__["KeyboardShortutModule"]
            ],
            exports: [_aside_menu_create_tax_component__WEBPACK_IMPORTED_MODULE_2__["AsideMenuCreateTaxComponent"]],
            declarations: [_aside_menu_create_tax_component__WEBPACK_IMPORTED_MODULE_2__["AsideMenuCreateTaxComponent"]],
            providers: [],
        })
    ], AsideMenuCreateTaxModule);
    return AsideMenuCreateTaxModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/currencyNumberSystem.ts":
/*!********************************************************!*\
  !*** ./src/app/shared/helpers/currencyNumberSystem.ts ***!
  \********************************************************/
/*! exports provided: currencyNumberSystems, digitAfterDecimal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currencyNumberSystems", function() { return currencyNumberSystems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "digitAfterDecimal", function() { return digitAfterDecimal; });
var currencyNumberSystems = [
    { value: 'IND_COMMA_SEPARATED', name: '1,00,00,000', type: '2-2-3' },
    { value: 'INT_COMMA_SEPARATED', name: '10,000,000', type: '3-3-3' },
    { value: 'INT_SPACE_SEPARATED', name: '10 000 000', type: '3-3-3' },
    { value: 'INT_APOSTROPHE_SEPARATED', name: '10\’000\’000', type: '3-3-3' }
];
var digitAfterDecimal = [
    { value: '0', name: '0 digit' },
    // {value: '1', name: '1 digit'},
    { value: '2', name: '2 digits' },
    { value: '4', name: '4 digits' }
];


/***/ }),

/***/ "./src/app/shared/helpers/pipes/omitBy/omit.pipe.ts":
/*!**********************************************************!*\
  !*** ./src/app/shared/helpers/pipes/omitBy/omit.pipe.ts ***!
  \**********************************************************/
/*! exports provided: OmitByKeyPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OmitByKeyPipe", function() { return OmitByKeyPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var OmitByKeyPipe = /** @class */ (function () {
    function OmitByKeyPipe() {
    }
    OmitByKeyPipe.prototype.transform = function (data, key, val) {
        if (data && data.length) {
            if (key && val) {
                return data.filter(function (o) { return o[key] !== val; });
            }
            else {
                return data;
            }
        }
    };
    OmitByKeyPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'OmitByKeyPipe', pure: true })
    ], OmitByKeyPipe);
    return OmitByKeyPipe;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/omitBy/omitBy.module.ts":
/*!**************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/omitBy/omitBy.module.ts ***!
  \**************************************************************/
/*! exports provided: OmitByKeyPipeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OmitByKeyPipeModule", function() { return OmitByKeyPipeModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _omit_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./omit.pipe */ "./src/app/shared/helpers/pipes/omitBy/omit.pipe.ts");



var OmitByKeyPipeModule = /** @class */ (function () {
    function OmitByKeyPipeModule() {
    }
    OmitByKeyPipeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [],
            exports: [_omit_pipe__WEBPACK_IMPORTED_MODULE_2__["OmitByKeyPipe"]],
            declarations: [_omit_pipe__WEBPACK_IMPORTED_MODULE_2__["OmitByKeyPipe"]],
        })
    ], OmitByKeyPipeModule);
    return OmitByKeyPipeModule;
}());



/***/ })

}]);