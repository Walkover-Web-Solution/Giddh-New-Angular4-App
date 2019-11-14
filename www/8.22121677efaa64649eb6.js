(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "../../node_modules/ng2-pdfjs-viewer/ng2-pdfjs-viewer.umd.js":
/*!***************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ng2-pdfjs-viewer/ng2-pdfjs-viewer.umd.js ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js"), __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js")) :
	undefined;
}(this, (function (exports,core,common) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PdfJsViewerComponent = /** @class */ (function () {
    function PdfJsViewerComponent() {
        this.onBeforePrint = new core.EventEmitter();
        this.onAfterPrint = new core.EventEmitter();
        this.onDocumentLoad = new core.EventEmitter();
        this.onPageChange = new core.EventEmitter();
        this.externalWindow = false;
        this.showSpinner = true;
        this.openFile = true;
        this.download = true;
        this.viewBookmark = true;
        this.print = true;
        this.fullScreen = true;
        //@Input() public showFullScreen: boolean;
        this.find = true;
        this.useOnlyCssZoom = false;
        this.errorOverride = false;
        this.errorAppend = true;
        this.diagnosticLogs = true;
    }
    Object.defineProperty(PdfJsViewerComponent.prototype, "page", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.PDFViewerApplication) {
                return this.PDFViewerApplication.page;
            }
            else {
                if (this.diagnosticLogs)
                    console.warn("Document is not loaded yet!!!. Try to retrieve page# after full load.");
            }
        },
        set: /**
         * @param {?} _page
         * @return {?}
         */
        function (_page) {
            this._page = _page;
            if (this.PDFViewerApplication) {
                this.PDFViewerApplication.page = this._page;
            }
            else {
                if (this.diagnosticLogs)
                    console.warn("Document is not loaded yet!!!. Try to set page# after full load. Ignore this warning if you are not setting page# using '.' notation. (E.g. pdfViewer.page = 5;)");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfJsViewerComponent.prototype, "pdfSrc", {
        get: /**
         * @return {?}
         */
        function () {
            return this._src;
        },
        set: /**
         * @param {?} _src
         * @return {?}
         */
        function (_src) {
            this._src = _src;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfJsViewerComponent.prototype, "PDFViewerApplicationOptions", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var pdfViewerOptions = null;
            if (this.externalWindow) {
                if (this.viewerTab) {
                    pdfViewerOptions = this.viewerTab.PDFViewerApplicationOptions;
                }
            }
            else {
                if (this.iframe.nativeElement.contentWindow) {
                    pdfViewerOptions = this.iframe.nativeElement.contentWindow.PDFViewerApplicationOptions;
                }
            }
            return pdfViewerOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfJsViewerComponent.prototype, "PDFViewerApplication", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var pdfViewer = null;
            if (this.externalWindow) {
                if (this.viewerTab) {
                    pdfViewer = this.viewerTab.PDFViewerApplication;
                }
            }
            else {
                if (this.iframe.nativeElement.contentWindow) {
                    pdfViewer = this.iframe.nativeElement.contentWindow.PDFViewerApplication;
                }
            }
            return pdfViewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} viewerEvent
     * @return {?}
     */
    PdfJsViewerComponent.prototype.receiveMessage = /**
     * @param {?} viewerEvent
     * @return {?}
     */
    function (viewerEvent) {
        if (viewerEvent.data && viewerEvent.data.viewerId && viewerEvent.data.event) {
            /** @type {?} */
            var viewerId = viewerEvent.data.viewerId;
            /** @type {?} */
            var event_1 = viewerEvent.data.event;
            /** @type {?} */
            var param = viewerEvent.data.param;
            if (this.viewerId == viewerId) {
                if (this.onBeforePrint && event_1 == "beforePrint") {
                    this.onBeforePrint.emit();
                }
                else if (this.onAfterPrint && event_1 == "afterPrint") {
                    this.onAfterPrint.emit();
                }
                else if (this.onDocumentLoad && event_1 == "pagesLoaded") {
                    this.onDocumentLoad.emit(param);
                }
                else if (this.onPageChange && event_1 == "pageChange") {
                    this.onPageChange.emit(param);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    PdfJsViewerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        window.addEventListener("message", this.receiveMessage.bind(this), false);
        if (!this.externalWindow) { // Load pdf for embedded views
            this.loadPdf();
        }
    };
    /**
     * @return {?}
     */
    PdfJsViewerComponent.prototype.refresh = /**
     * @return {?}
     */
    function () {
        this.loadPdf();
    };
    /**
     * @private
     * @return {?}
     */
    PdfJsViewerComponent.prototype.loadPdf = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._src) {
            return;
        }
        // console.log(`Tab is - ${this.viewerTab}`);
        // if (this.viewerTab) {
        //   console.log(`Status of window - ${this.viewerTab.closed}`);
        // }
        if (this.externalWindow && (typeof this.viewerTab === 'undefined' || this.viewerTab.closed)) {
            this.viewerTab = window.open('', '_blank', this.externalWindowOptions || '');
            if (this.viewerTab == null) {
                if (this.diagnosticLogs)
                    console.error("ng2-pdfjs-viewer: For 'externalWindow = true'. i.e opening in new tab to work, pop-ups should be enabled.");
                return;
            }
            if (this.showSpinner) {
                this.viewerTab.document.write("\n          <style>\n          .loader {\n            position: fixed;\n            left: 40%;\n            top: 40%;\n            border: 16px solid #f3f3f3;\n            border-radius: 50%;\n            border-top: 16px solid #3498db;\n            width: 120px;\n            height: 120px;\n            animation: spin 2s linear infinite;\n          }\n          @keyframes spin {\n            0% {\n              transform: rotate(0deg);\n            }\n            100% {\n              transform: rotate(360deg);\n            }\n          }\n          </style>\n          <div class=\"loader\"></div>\n        ");
            }
        }
        /** @type {?} */
        var fileUrl;
        //if (typeof this.src === "string") {
        //  fileUrl = this.src;
        //}
        if (this._src instanceof Blob) {
            fileUrl = encodeURIComponent(URL.createObjectURL(this._src));
        }
        else if (this._src instanceof Uint8Array) {
            /** @type {?} */
            var blob = new Blob([this._src], { type: "application/pdf" });
            fileUrl = encodeURIComponent(URL.createObjectURL(blob));
        }
        else {
            fileUrl = this._src;
        }
        /** @type {?} */
        var viewerUrl;
        if (this.viewerFolder) {
            viewerUrl = this.viewerFolder + "/web/viewer.html";
        }
        else {
            viewerUrl = "assets/pdfjs/web/viewer.html";
        }
        viewerUrl += "?file=" + fileUrl;
        if (typeof this.viewerId !== 'undefined') {
            viewerUrl += "&viewerId=" + this.viewerId;
        }
        if (typeof this.onBeforePrint !== 'undefined') {
            viewerUrl += "&beforePrint=true";
        }
        if (typeof this.onAfterPrint !== 'undefined') {
            viewerUrl += "&afterPrint=true";
        }
        if (typeof this.onDocumentLoad !== 'undefined') {
            viewerUrl += "&pagesLoaded=true";
        }
        if (typeof this.onPageChange !== 'undefined') {
            viewerUrl += "&pageChange=true";
        }
        if (this.downloadFileName) {
            if (!this.downloadFileName.endsWith(".pdf")) {
                this.downloadFileName += ".pdf";
            }
            viewerUrl += "&fileName=" + this.downloadFileName;
        }
        if (typeof this.openFile !== 'undefined') {
            viewerUrl += "&openFile=" + this.openFile;
        }
        if (typeof this.download !== 'undefined') {
            viewerUrl += "&download=" + this.download;
        }
        if (this.startDownload) {
            viewerUrl += "&startDownload=" + this.startDownload;
        }
        if (typeof this.viewBookmark !== 'undefined') {
            viewerUrl += "&viewBookmark=" + this.viewBookmark;
        }
        if (typeof this.print !== 'undefined') {
            viewerUrl += "&print=" + this.print;
        }
        if (this.startPrint) {
            viewerUrl += "&startPrint=" + this.startPrint;
        }
        if (typeof this.fullScreen !== 'undefined') {
            viewerUrl += "&fullScreen=" + this.fullScreen;
        }
        // if (this.showFullScreen) {
        //   viewerUrl += `&showFullScreen=${this.showFullScreen}`;
        // }
        if (typeof this.find !== 'undefined') {
            viewerUrl += "&find=" + this.find;
        }
        if (this.lastPage) {
            viewerUrl += "&lastpage=" + this.lastPage;
        }
        if (this.rotatecw) {
            viewerUrl += "&rotatecw=" + this.rotatecw;
        }
        if (this.rotateccw) {
            viewerUrl += "&rotateccw=" + this.rotateccw;
        }
        if (this.cursor) {
            viewerUrl += "&cursor=" + this.cursor;
        }
        if (this.scroll) {
            viewerUrl += "&scroll=" + this.scroll;
        }
        if (this.spread) {
            viewerUrl += "&spread=" + this.spread;
        }
        if (this.locale) {
            viewerUrl += "&locale=" + this.locale;
        }
        if (this.useOnlyCssZoom) {
            viewerUrl += "&useOnlyCssZoom=" + this.useOnlyCssZoom;
        }
        if (this._page || this.zoom || this.nameddest || this.pagemode)
            viewerUrl += "#";
        if (this._page) {
            viewerUrl += "&page=" + this._page;
        }
        if (this.zoom) {
            viewerUrl += "&zoom=" + this.zoom;
        }
        if (this.nameddest) {
            viewerUrl += "&nameddest=" + this.nameddest;
        }
        if (this.pagemode) {
            viewerUrl += "&pagemode=" + this.pagemode;
        }
        if (this.errorOverride || this.errorAppend) {
            viewerUrl += "&errorMessage=" + this.errorMessage;
            if (this.errorOverride) {
                viewerUrl += "&errorOverride=" + this.errorOverride;
            }
            if (this.errorAppend) {
                viewerUrl += "&errorAppend=" + this.errorAppend;
            }
        }
        if (this.externalWindow) {
            this.viewerTab.location.href = viewerUrl;
        }
        else {
            this.iframe.nativeElement.src = viewerUrl;
        }
        // console.log(`
        //   pdfSrc = ${this.pdfSrc}
        //   fileUrl = ${fileUrl}
        //   externalWindow = ${this.externalWindow}
        //   downloadFileName = ${this.downloadFileName}
        //   viewerFolder = ${this.viewerFolder}
        //   openFile = ${this.openFile}
        //   download = ${this.download}
        //   startDownload = ${this.startDownload}
        //   viewBookmark = ${this.viewBookmark}
        //   print = ${this.print}
        //   startPrint = ${this.startPrint}
        //   fullScreen = ${this.fullScreen}
        //   find = ${this.find}
        //   lastPage = ${this.lastPage}
        //   rotatecw = ${this.rotatecw}
        //   rotateccw = ${this.rotateccw}
        //   cursor = ${this.cursor}
        //   scrollMode = ${this.scroll}
        //   spread = ${this.spread}
        //   page = ${this.page}
        //   zoom = ${this.zoom}
        //   nameddest = ${this.nameddest}
        //   pagemode = ${this.pagemode}
        //   pagemode = ${this.errorOverride}
        //   pagemode = ${this.errorAppend}
        //   pagemode = ${this.errorMessage}
        // `);
    };
    PdfJsViewerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ng2-pdfjs-viewer',
                    template: "<iframe [hidden]=\"externalWindow || (!externalWindow && !pdfSrc)\" #iframe width=\"100%\" height=\"100%\"></iframe>"
                },] },
    ];
    PdfJsViewerComponent.propDecorators = {
        iframe: [{ type: core.ViewChild, args: ['iframe',] }],
        viewerId: [{ type: core.Input }],
        onBeforePrint: [{ type: core.Output }],
        onAfterPrint: [{ type: core.Output }],
        onDocumentLoad: [{ type: core.Output }],
        onPageChange: [{ type: core.Output }],
        viewerFolder: [{ type: core.Input }],
        externalWindow: [{ type: core.Input }],
        showSpinner: [{ type: core.Input }],
        downloadFileName: [{ type: core.Input }],
        openFile: [{ type: core.Input }],
        download: [{ type: core.Input }],
        startDownload: [{ type: core.Input }],
        viewBookmark: [{ type: core.Input }],
        print: [{ type: core.Input }],
        startPrint: [{ type: core.Input }],
        fullScreen: [{ type: core.Input }],
        find: [{ type: core.Input }],
        zoom: [{ type: core.Input }],
        nameddest: [{ type: core.Input }],
        pagemode: [{ type: core.Input }],
        lastPage: [{ type: core.Input }],
        rotatecw: [{ type: core.Input }],
        rotateccw: [{ type: core.Input }],
        cursor: [{ type: core.Input }],
        scroll: [{ type: core.Input }],
        spread: [{ type: core.Input }],
        locale: [{ type: core.Input }],
        useOnlyCssZoom: [{ type: core.Input }],
        errorOverride: [{ type: core.Input }],
        errorAppend: [{ type: core.Input }],
        errorMessage: [{ type: core.Input }],
        diagnosticLogs: [{ type: core.Input }],
        externalWindowOptions: [{ type: core.Input }],
        page: [{ type: core.Input }],
        pdfSrc: [{ type: core.Input }]
    };
    return PdfJsViewerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PdfJsViewerModule = /** @class */ (function () {
    function PdfJsViewerModule() {
    }
    /**
     * @return {?}
     */
    PdfJsViewerModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: PdfJsViewerModule
        };
    };
    PdfJsViewerModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [
                        PdfJsViewerComponent
                    ],
                    exports: [
                        PdfJsViewerComponent
                    ]
                },] },
    ];
    return PdfJsViewerModule;
}());

exports.PdfJsViewerModule = PdfJsViewerModule;
exports.PdfJsViewerComponent = PdfJsViewerComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));


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



/***/ }),

/***/ "./src/app/models/api-models/proforma.ts":
/*!***********************************************!*\
  !*** ./src/app/models/api-models/proforma.ts ***!
  \***********************************************/
/*! exports provided: ProformaFilter, ProformaResponse, ProformaItem, ProformaGetRequest, ProformaDownloadRequest, ProformaUpdateActionRequest, EstimateGetVersionByVersionNoRequest, ProformaGetAllVersionRequest, ProformaGetAllVersionsResponse, ProformaVersionItem, PreviousInvoicesVm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaFilter", function() { return ProformaFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaResponse", function() { return ProformaResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaItem", function() { return ProformaItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaGetRequest", function() { return ProformaGetRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaDownloadRequest", function() { return ProformaDownloadRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaUpdateActionRequest", function() { return ProformaUpdateActionRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EstimateGetVersionByVersionNoRequest", function() { return EstimateGetVersionByVersionNoRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaGetAllVersionRequest", function() { return ProformaGetAllVersionRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaGetAllVersionsResponse", function() { return ProformaGetAllVersionsResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaVersionItem", function() { return ProformaVersionItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreviousInvoicesVm", function() { return PreviousInvoicesVm; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _BaseResponse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseResponse */ "./src/app/models/api-models/BaseResponse.ts");
/* harmony import */ var _recipt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./recipt */ "./src/app/models/api-models/recipt.ts");
/* harmony import */ var _Invoice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Invoice */ "./src/app/models/api-models/Invoice.ts");




var ProformaFilter = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaFilter, _super);
    function ProformaFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaFilter;
}(_recipt__WEBPACK_IMPORTED_MODULE_2__["InvoiceReceiptFilter"]));

var ProformaResponse = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaResponse, _super);
    function ProformaResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaResponse;
}(_BaseResponse__WEBPACK_IMPORTED_MODULE_1__["CommonPaginatedResponse"]));

var ProformaItem = /** @class */ (function () {
    function ProformaItem() {
    }
    return ProformaItem;
}());

var ProformaGetRequest = /** @class */ (function () {
    function ProformaGetRequest() {
    }
    return ProformaGetRequest;
}());

var ProformaDownloadRequest = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaDownloadRequest, _super);
    function ProformaDownloadRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaDownloadRequest;
}(ProformaGetRequest));

var ProformaUpdateActionRequest = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaUpdateActionRequest, _super);
    function ProformaUpdateActionRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaUpdateActionRequest;
}(ProformaGetRequest));

var EstimateGetVersionByVersionNoRequest = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](EstimateGetVersionByVersionNoRequest, _super);
    function EstimateGetVersionByVersionNoRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EstimateGetVersionByVersionNoRequest;
}(ProformaGetRequest));

var ProformaGetAllVersionRequest = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaGetAllVersionRequest, _super);
    function ProformaGetAllVersionRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaGetAllVersionRequest;
}(_Invoice__WEBPACK_IMPORTED_MODULE_3__["CommonPaginatedRequest"]));

var ProformaGetAllVersionsResponse = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ProformaGetAllVersionsResponse, _super);
    function ProformaGetAllVersionsResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ProformaGetAllVersionsResponse;
}(_BaseResponse__WEBPACK_IMPORTED_MODULE_1__["CommonPaginatedResponse"]));

var ProformaVersionItem = /** @class */ (function () {
    function ProformaVersionItem() {
    }
    return ProformaVersionItem;
}());

var PreviousInvoicesVm = /** @class */ (function () {
    function PreviousInvoicesVm() {
    }
    return PreviousInvoicesVm;
}());



/***/ }),

/***/ "./src/app/models/api-models/recipt.ts":
/*!*********************************************!*\
  !*** ./src/app/models/api-models/recipt.ts ***!
  \*********************************************/
/*! exports provided: InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptRequestParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvoiceReceiptFilter", function() { return InvoiceReceiptFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReceiptVoucherDetailsRequest", function() { return ReceiptVoucherDetailsRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReciptRequestParams", function() { return ReciptRequestParams; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Invoice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Invoice */ "./src/app/models/api-models/Invoice.ts");


var InvoiceReceiptFilter = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](InvoiceReceiptFilter, _super);
    function InvoiceReceiptFilter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLastInvoicesRequest = false;
        return _this;
    }
    return InvoiceReceiptFilter;
}(_Invoice__WEBPACK_IMPORTED_MODULE_1__["InvoiceFilterClassForInvoicePreview"]));

var ReceiptVoucherDetailsRequest = /** @class */ (function () {
    function ReceiptVoucherDetailsRequest() {
    }
    return ReceiptVoucherDetailsRequest;
}());

var ReciptRequestParams = /** @class */ (function () {
    function ReciptRequestParams() {
    }
    return ReciptRequestParams;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane()\">X</button>\n  <div class=\"aside-body flexy-child\" *ngIf=\"!hideFirstStep\">\n    <div class=\"pd1 alC\">\n      <button class=\"btn btn-lg btn-primary\" (click)=\"toggleStockPane()\">Add Product</button>\n    </div>\n    <div class=\"pd1 alC\">\n      <button class=\"btn btn-lg btn-primary\" (click)=\"toggleServicePane()\">Add Service</button>\n    </div>\n  </div>\n\n  <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddStockOpen\">\n    <sales-create-stock (closeAsideEvent)=\"closeAsidePane($event)\"\n                        (animateAside)=\"animateAside($event)\"></sales-create-stock>\n  </div>\n  <div class=\"aside-body flexy-child-1\" *ngIf=\"isAddServiceOpen\">\n    <create-account-service (closeAsideEvent)=\"closeAsidePane($event)\"></create-account-service>\n  </div>\n</div>\n \n\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: fixed;\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  max-width: 580px;\n  z-index: 1045; }\n\n:host.shifted {\n  right: 500px; }\n\n#close {\n  display: none; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: -41px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n.aside-pane {\n  display: -webkit-box;\n  display: flex;\n  width: 100%;\n  max-width: 580px; }\n\n.flexy-child {\n  -webkit-box-flex: 1;\n          flex-grow: 1;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center; }\n\n.flexy-child-1 {\n  -webkit-box-flex: 1;\n          flex-grow: 1; }\n\n:host .aside-pane {\n  width: 100%;\n  max-width: 580px; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/component.ts ***!
  \*************************************************************************************/
/*! exports provided: AsideMenuProductServiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuProductServiceComponent", function() { return AsideMenuProductServiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");




var AsideMenuProductServiceComponent = /** @class */ (function () {
    function AsideMenuProductServiceComponent(store) {
        this.store = store;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"](true);
        this.animatePAside = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        // public
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        this.hideFirstStep = false;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        // constructor methods
    }
    AsideMenuProductServiceComponent.prototype.toggleStockPane = function () {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    };
    AsideMenuProductServiceComponent.prototype.toggleServicePane = function () {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    };
    AsideMenuProductServiceComponent.prototype.closeAsidePane = function (e) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        if (e) {
            //
        }
        else {
            this.closeAsideEvent.emit();
        }
    };
    AsideMenuProductServiceComponent.prototype.animateAside = function (e) {
        this.animatePAside.emit(e);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuProductServiceComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuProductServiceComponent.prototype, "animatePAside", void 0);
    AsideMenuProductServiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'aside-menu-product-service',
            template: __webpack_require__(/*! ./component.html */ "./src/app/proforma-invoice/components/aside-menu-product-service/component.html"),
            styles: [__webpack_require__(/*! ./component.scss */ "./src/app/proforma-invoice/components/aside-menu-product-service/component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], AsideMenuProductServiceComponent);
    return AsideMenuProductServiceComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.html":
/*!**********************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.html ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header pd2 pdL2 pdR2 clearfix\">\n  <h3 class=\"modal-title bg\" id=\"modal-title\">Create Account</h3>\n  <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"closeCreateAcModal()\"></i>\n</div>\n<div class=\"modal-body\">\n\n  <form name=\"addAcForm\" [formGroup]=\"addAcForm\" novalidate>\n\n    <div class=\"row\">\n      <div class=\"form-group col-xs-6\">\n        <label>Name<span class=\"required\">*</span></label>\n        <input type=\"text\" name=\"name\" (change)=\"generateUniqueName()\" class=\"form-control\" formControlName=\"name\"\n               style=\"background-image: url(data:image/png;base64:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=);\">\n      </div>\n\n      <div class=\"form-group col-xs-6\">\n        <label>Unique Name<span class=\"required\">*</span></label>\n        <input type=\"text\" name=\"uniqueName\" UniqueNameDirective formControlName=\"uniqueName\" class=\"form-control\">\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"form-group col-xs-6\">\n        <label>Opening Balance</label>\n        <input type=\"text\" maxLength=\"21\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n               formControlName=\"openingBalance\">\n      </div>\n      <div class=\"form-group col-xs-6\">\n        <label>Opening Balance Type</label>\n        <select class=\"form-control\" formControlName=\"openingBalanceType\">\n          <option value=\"CREDIT\">Credit</option>\n          <option value=\"DEBIT\">Debit</option>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-xs-6 form-group\">\n        <label class=\"d-block\">HSN</label>\n        <div class=\"input-group\">\n                    <span class=\"input-group-addon\">\n            <input type=\"radio\" class=\"\" formControlName=\"hsnOrSac\" value='hsn' name=\"hsnOrSac\">\n          </span>\n          <input type=\"text\" class=\"form-control\" digitsOnlyDirective formControlName=\"hsnNumber\" class=\"form-control\"\n                 name=\"hsnNumber\" maxLength=\"10\">\n        </div>\n      </div>\n      <div class=\"col-xs-6 form-group\">\n        <label class=\"d-block\">SAC</label>\n        <div class=\"input-group\">\n                    <span class=\"input-group-addon\">\n            <input type=\"radio\" class=\"\" formControlName=\"hsnOrSac\" value='sac' name=\"hsnOrSac\"/>\n          </span>\n          <input type=\"text\" digitsOnlyDirective formControlName=\"sacNumber\" class=\"form-control \" name=\"sacNumber\"\n                 maxLength=\"10\">\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"form-group col-xs-12 text-right mrT2\">\n        <button type=\"submit\" class=\"btn btn-md btn-success mrR\" [ladda]=\"createAccountInProcess$ | async\"\n                (click)=\"addAcFormSubmit()\" [disabled]=\"addAcForm.invalid\">Save\n        </button>\n        <button (click)=\"addAcFormReset()\" class=\"btn btn-md btn-primary\">Cancel</button>\n      </div>\n    </div>\n\n  </form>\n</div>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.ts":
/*!********************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.ts ***!
  \********************************************************************************************************************************/
/*! exports provided: PURCHASE_GROUPS, SALES_GROUPS, CreateAccountModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PURCHASE_GROUPS", function() { return PURCHASE_GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SALES_GROUPS", function() { return SALES_GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountModalComponent", function() { return CreateAccountModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_helpers_customValidationHelper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/helpers/customValidationHelper */ "./src/app/shared/helpers/customValidationHelper.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");










var PURCHASE_GROUPS = ['operatingcost']; // purchases
var SALES_GROUPS = ['revenuefromoperations']; // sales
var CreateAccountModalComponent = /** @class */ (function () {
    function CreateAccountModalComponent(_fb, _store, _salesActions, _accountsAction) {
        this._fb = _fb;
        this._store = _store;
        this._salesActions = _salesActions;
        this._accountsAction = _accountsAction;
        this.actionFired = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.selectedGroup = null;
        // private
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__["ReplaySubject"](1);
        this.isAccountNameAvailable$ = this._store.select(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this._store.select(function (state) { return state.groupwithaccounts.createAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this._store.select(function (state) { return state.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    CreateAccountModalComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateAccountModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        // init ac form
        this.initAcForm();
        // utility to enable disable HSN/SAC
        this.addAcForm.get('hsnOrSac').valueChanges.subscribe(function (a) {
            var hsn = _this.addAcForm.get('hsnNumber');
            var sac = _this.addAcForm.get('sacNumber');
            if (a === 'hsn') {
                // hsn.reset();
                sac.reset();
                hsn.enable();
                sac.disable();
            }
            else {
                // sac.reset();
                hsn.reset();
                sac.enable();
                hsn.disable();
            }
        });
        // listen for add account success
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.addAcFormReset();
                _this.closeCreateAcModal();
                if (_this.gType === 'Sales') {
                    _this._store.dispatch(_this._salesActions.getFlattenAcOfSales({ groupUniqueNames: ['sales'] }));
                }
                else if (_this.gType === 'Purchase') {
                    _this._store.dispatch(_this._salesActions.getFlattenAcOfPurchase({ groupUniqueNames: ['purchases'] }));
                }
            }
        });
    };
    CreateAccountModalComponent.prototype.initAcForm = function () {
        this.addAcForm = this._fb.group({
            name: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].maxLength(100)])],
            uniqueName: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]],
            openingBalanceType: ['CREDIT'],
            openingBalance: [0, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].compose([_shared_helpers_customValidationHelper__WEBPACK_IMPORTED_MODULE_7__["digitsOnly"]])],
            hsnOrSac: [null],
            hsnNumber: [{ value: null, disabled: false }],
            sacNumber: [{ value: null, disabled: false }]
        });
    };
    CreateAccountModalComponent.prototype.generateUniqueName = function () {
        var _this = this;
        var val = this.addAcForm.controls['name'].value;
        val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_8__["uniqueNameInvalidStringReplace"])(val);
        if (val) {
            this._store.dispatch(this._accountsAction.getAccountUniqueName(val));
            this.isAccountNameAvailable$.subscribe(function (a) {
                if (a) {
                    _this.addAcForm.patchValue({ uniqueName: val });
                }
                else {
                    var num = 1;
                    _this.addAcForm.patchValue({ uniqueName: val + num });
                }
            });
        }
        else {
            this.addAcForm.patchValue({ uniqueName: null });
        }
    };
    CreateAccountModalComponent.prototype.addAcFormSubmit = function () {
        var formObj = this.addAcForm.value;
        if (this.gType === 'Sales') {
            this.selectedGroup = 'sales';
        }
        else if (this.gType === 'Purchase') {
            this.selectedGroup = 'purchases';
        }
        this._store.dispatch(this._accountsAction.createAccountV2(this.selectedGroup, formObj));
    };
    CreateAccountModalComponent.prototype.addAcFormReset = function () {
        this.addAcForm.reset();
        this.closeCreateAcModal();
    };
    CreateAccountModalComponent.prototype.closeCreateAcModal = function () {
        this.addAcForm.reset();
        this.actionFired.emit();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], CreateAccountModalComponent.prototype, "gType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], CreateAccountModalComponent.prototype, "actionFired", void 0);
    CreateAccountModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'create-account-modal',
            template: __webpack_require__(/*! ./create.account.modal.html */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.html"),
            styles: ["\n    .form-group label {\n      margin-bottom: 5px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_9__["SalesActions"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_4__["AccountsAction"]])
    ], CreateAccountModalComponent);
    return CreateAccountModalComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.html":
/*!**************************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.html ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"fake_header\">\n  <h2>Create Service</h2>\n</div>\n\n<div class=\"row\">\n  <div class=\"form-group col-xs-12\">\n    <label class=\"mrB1\">Select Group</label>\n    <div class=\"ng-select-wrap liq\">\n      <ng-select placeholder=\"Sales Group\" filterPlaceholder=\"Type to search...\" name=\"flatAccountWGroupsList\"\n                 [(ngModel)]=\"activeGroupUniqueName\"\n                 [options]=\"flatAccountWGroupsList$ | async\" style=\"width:100%\">\n        <ng-template #optionTemplate let-option=\"option\">\n          <div class=\"account-list-item\">{{option?.label}}</div>\n          <div class=\"account-list-item fs12\">{{option?.value}}</div>\n        </ng-template>\n      </ng-select>\n    </div>\n  </div>\n</div>\n\n<form *ngIf=\"activeGroupUniqueName\" name=\"addAcForm\" [formGroup]=\"addAcForm\" novalidate>\n\n  <div class=\"row\">\n    <div class=\"form-group col-xs-6\">\n      <label>Name\n        <span class=\"required\">*</span>\n      </label>\n      <input type=\"text\" name=\"name\" (change)=\"generateUniqueName()\" class=\"form-control\" formControlName=\"name\"\n             style=\"background-image: url(data:image/png;base64:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=);\">\n    </div>\n\n    <div class=\"form-group col-xs-6\">\n      <label>Unique Name\n        <span class=\"required\">*</span>\n      </label>\n      <input type=\"text\" name=\"uniqueName\" UniqueNameDirective formControlName=\"uniqueName\" class=\"form-control\">\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"form-group col-xs-6\">\n      <label>Opening Balance</label>\n      <input type=\"text\" maxLength=\"21\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n             formControlName=\"openingBalance\">\n    </div>\n    <div class=\"form-group col-xs-6\">\n      <label>Opening Balance Type</label>\n      <select class=\"form-control\" formControlName=\"openingBalanceType\">\n        <option value=\"CREDIT\">Credit</option>\n        <option value=\"DEBIT\">Debit</option>\n      </select>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <!-- <div class=\"col-xs-6 form-group\">\n      <label class=\"d-block\">HSN</label>\n      <div class=\"input-group\">\n        <span class=\"input-group-addon\">\n          <input type=\"radio\" class=\"\" formControlName=\"hsnOrSac\" value='hsn' name=\"hsnOrSac\">\n        </span>\n        <input type=\"text\" class=\"form-control\" digitsOnlyDirective formControlName=\"hsnNumber\" class=\"form-control\" name=\"hsnNumber\"\n          maxLength=\"10\">\n      </div>\n    </div> -->\n    <div class=\"col-xs-6 form-group\">\n      <label class=\"d-block\">SAC</label>\n      <input type=\"text\" digitsOnlyDirective formControlName=\"sacNumber\" class=\"form-control \" name=\"sacNumber\"\n             maxLength=\"10\">\n      <!-- <div class=\"input-group\">\n        <span class=\"input-group-addon\">\n          <input type=\"radio\" class=\"\" formControlName=\"hsnOrSac\" value='sac' name=\"hsnOrSac\" />\n        </span>\n      </div> -->\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"form-group col-xs-12 text-right mrT2\">\n      <button type=\"submit\" class=\"btn btn-md btn-success mrR\" [ladda]=\"createAccountInProcess$ | async\"\n              (click)=\"addAcFormSubmit()\"\n              [disabled]=\"addAcForm.invalid\">Save\n      </button>\n      <button (click)=\"closeCreateAcModal()\" class=\"btn btn-md btn-primary\">Cancel</button>\n    </div>\n  </div>\n\n</form>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.ts":
/*!************************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.ts ***!
  \************************************************************************************************************************************/
/*! exports provided: PURCHASE_GROUPS, SALES_GROUPS, CreateAccountServiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PURCHASE_GROUPS", function() { return PURCHASE_GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SALES_GROUPS", function() { return SALES_GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountServiceComponent", function() { return CreateAccountServiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/helpers */ "./src/app/shared/helpers/index.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");














var PURCHASE_GROUPS = ['operatingcost']; // purchases
var SALES_GROUPS = ['revenuefromoperations']; // sales
var CreateAccountServiceComponent = /** @class */ (function () {
    function CreateAccountServiceComponent(_fb, _toasty, _store, _groupService, _salesActions, _accountService, _accountsAction) {
        this._fb = _fb;
        this._toasty = _toasty;
        this._store = _store;
        this._groupService = _groupService;
        this._salesActions = _salesActions;
        this._accountService = _accountService;
        this._accountsAction = _accountsAction;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
        // private
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.isAccountNameAvailable$ = this._store.select(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this._store.select(function (state) { return state.groupwithaccounts.createAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this._store.select(function (state) { return state.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    CreateAccountServiceComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    CreateAccountServiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        // init ac form
        this.initAcForm();
        // utility to enable disable HSN/SAC
        this.addAcForm.get('hsnOrSac').valueChanges.subscribe(function (a) {
            var hsn = _this.addAcForm.get('hsnNumber');
            var sac = _this.addAcForm.get('sacNumber');
            if (a === 'hsn') {
                // hsn.reset();
                sac.reset();
                hsn.enable();
                sac.disable();
            }
            else {
                // sac.reset();
                hsn.reset();
                sac.enable();
                hsn.disable();
            }
        });
        // get groups list
        this._groupService.GetGroupsWithAccounts('').subscribe(function (res) {
            var result = [];
            if (res.status === 'success' && res.body.length > 0) {
                var revenueGrp = _lodash_optimized__WEBPACK_IMPORTED_MODULE_3__["find"](res.body, { uniqueName: 'revenuefromoperations' });
                var flatGrps = _this._groupService.flattenGroup([revenueGrp], []);
                if (flatGrps && flatGrps.length) {
                    flatGrps.filter(function (f) { return f.uniqueName !== 'revenuefromoperations'; }).forEach(function (grp) {
                        result.push({ label: grp.name, value: grp.uniqueName });
                    });
                }
            }
            _this.flatAccountWGroupsList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(result);
        });
    };
    CreateAccountServiceComponent.prototype.initAcForm = function () {
        this.addAcForm = this._fb.group({
            name: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].maxLength(100)])],
            uniqueName: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            openingBalanceType: ['CREDIT'],
            openingBalance: [0, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].compose([_shared_helpers__WEBPACK_IMPORTED_MODULE_8__["digitsOnly"]])],
            hsnOrSac: ['sac'],
            hsnNumber: [{ value: null, disabled: false }],
            sacNumber: [{ value: null, disabled: false }]
        });
    };
    CreateAccountServiceComponent.prototype.generateUniqueName = function () {
        var _this = this;
        var val = this.addAcForm.controls['name'].value;
        val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_9__["uniqueNameInvalidStringReplace"])(val);
        if (val) {
            this._store.dispatch(this._accountsAction.getAccountUniqueName(val));
            this.isAccountNameAvailable$.subscribe(function (a) {
                if (a) {
                    _this.addAcForm.patchValue({ uniqueName: val });
                }
                else {
                    var num = 1;
                    _this.addAcForm.patchValue({ uniqueName: val + num });
                }
            });
        }
        else {
            this.addAcForm.patchValue({ uniqueName: null });
        }
    };
    CreateAccountServiceComponent.prototype.addAcFormSubmit = function () {
        var _this = this;
        var formObj = this.addAcForm.value;
        this._accountService.CreateAccountV2(formObj, this.activeGroupUniqueName).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toasty.successToast('A/c created successfully.');
                _this.closeCreateAcModal();
                // this._store.dispatch(this._salesActions.getFlattenAcOfSales({groupUniqueNames: ['sales']}));
                _this._store.dispatch(_this._salesActions.createServiceAcSuccess({ name: res.body.name, uniqueName: res.body.uniqueName }));
            }
            else {
                _this._toasty.errorToast(res.message, res.code);
            }
        });
    };
    CreateAccountServiceComponent.prototype.closeCreateAcModal = function () {
        this.addAcForm.reset();
        this.closeAsideEvent.emit();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"])
    ], CreateAccountServiceComponent.prototype, "closeAsideEvent", void 0);
    CreateAccountServiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'create-account-service',
            template: __webpack_require__(/*! ./create.account.service.html */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.html"),
            styles: ["\n      .form-group label {\n          margin-bottom: 5px;\n      }\n\n      .fake_header {\n          border-bottom: 1px solid #ddd;\n          padding-bottom: 15px;\n          margin-bottom: 15px;\n          font-size: 20px;\n      }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_13__["ToasterService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_11__["GroupService"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_10__["SalesActions"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_12__["AccountService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_6__["AccountsAction"]])
    ], CreateAccountServiceComponent);
    return CreateAccountServiceComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.html":
/*!******************************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.html ***!
  \******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header pd2 pdL2 pdR2 clearfix\">\n    <h3 class=\"modal-title bg\" id=\"modal-title\">Create New Group</h3>\n    <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"closeCreateGroupModal()\"></i>\n</div>\n<div class=\"modal-body\">\n    <form name=\"addStockGroupForm\" autocomplete=\"off\" [formGroup]=\"addStockGroupForm\" novalidate>\n        <div class=\"row\">\n            <div class=\"form-group col-xs-6\">\n                <label>Name<span class=\"required\">*</span></label>\n                <input type=\"text\" name=\"name\" (change)=\"generateUniqueName()\" class=\"form-control\" formControlName=\"name\" autocomplete=\"off\" style=\"background-image: url(data:image/png;base64:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=);\">\n            </div>\n\n            <div class=\"form-group col-xs-6\">\n                <label>Unique Name<span class=\"required\">*</span></label>\n                <input type=\"text\" autocomplete=\"off\" name=\"uniqueName\" UniqueNameDirective formControlName=\"uniqueName\" class=\"form-control\">\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"form-group col-xs-12\">\n                <label>Parent Group</label>\n                <select class=\"form-control\" formControlName=\"parentStockGroupUniqueName\">\n          <option [ngValue]=\"null\">Select</option>\n          <option *ngFor=\"let unit of stockGroups$ | async;\" [ngValue]=\"unit.value\">{{unit.label}}</option>\n        </select>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"form-group col-xs-12\">\n                <div class=\"checkbox\">\n                    <label for=\"isSelfParentUpdt\"><input type=\"checkbox\" formControlName=\"isSelfParent\" id=\"isSelfParentUpdt\"\n                                               name=\"parentStockGroup\">Assign as a Parent Group</label>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"form-group col-xs-12 text-right mrT2\">\n                <button type=\"submit\" class=\"btn btn-md btn-success mrR\" [ladda]=\"isAddStockGroupInProcess\" (click)=\"addStockGroupFormSubmit()\" [disabled]=\"addStockGroupForm.invalid\">Save\n        </button>\n                <button (click)=\"addStockGroupFormReset()\" class=\"btn btn-md btn-primary\">Cancel</button>\n            </div>\n        </div>\n    </form>\n</div>"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.ts":
/*!****************************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.ts ***!
  \****************************************************************************************************************************************/
/*! exports provided: SalesAddStockGroupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesAddStockGroupComponent", function() { return SalesAddStockGroupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");












var SalesAddStockGroupComponent = /** @class */ (function () {
    function SalesAddStockGroupComponent(_store, _fb, _inventoryService, _inventoryActions, _sideBarAction, _toasty, _salesActions) {
        this._store = _store;
        this._fb = _fb;
        this._inventoryService = _inventoryService;
        this._inventoryActions = _inventoryActions;
        this._sideBarAction = _sideBarAction;
        this._toasty = _toasty;
        this._salesActions = _salesActions;
        this.actionFired = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
        // public
        this.isAddStockGroupInProcess = false;
        this.stockGroups$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        // private
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.isGroupNameAvailable$ = this._store.select(function (state) { return state.inventory.isGroupNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    SalesAddStockGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        // init stock group form
        this.addStockGroupForm = this._fb.group({
            name: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            uniqueName: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            parentStockGroupUniqueName: [{ value: null, disabled: true }, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            isSelfParent: [true]
        });
        // enable disable parentGroup select
        this.addStockGroupForm.controls['isSelfParent'].valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.addStockGroupForm.controls['parentStockGroupUniqueName'].reset();
                _this.addStockGroupForm.controls['parentStockGroupUniqueName'].disable();
            }
            else {
                _this.addStockGroupForm.controls['parentStockGroupUniqueName'].enable();
                _this.addStockGroupForm.setErrors({ groupNameInvalid: true });
            }
        });
        // get groups list and assign values
        this._store.select(function (state) { return state.sales.hierarchicalStockGroups; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.stockGroups$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(o);
            }
            else {
                _this.getStockGroups();
            }
        });
    };
    // generate uniquename
    SalesAddStockGroupComponent.prototype.generateUniqueName = function () {
        var _this = this;
        var val = this.addStockGroupForm.controls['name'].value;
        val = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_8__["uniqueNameInvalidStringReplace"])(val);
        if (val) {
            this._store.dispatch(this._sideBarAction.GetGroupUniqueName(val));
            this.isGroupNameAvailable$.subscribe(function (a) {
                if (a !== null && a !== undefined) {
                    if (a) {
                        _this.addStockGroupForm.patchValue({ uniqueName: val });
                    }
                    else {
                        _this.addStockGroupForm.patchValue({ uniqueName: val + 1 });
                    }
                }
                else {
                    _this.addStockGroupForm.patchValue({ uniqueName: val + 1 });
                }
            });
        }
        else {
            this.addStockGroupForm.patchValue({ uniqueName: null });
        }
    };
    // get all stock groups and flatten it and use in dom
    SalesAddStockGroupComponent.prototype.getStockGroups = function () {
        this._store.dispatch(this._salesActions.getGroupsListForSales());
    };
    SalesAddStockGroupComponent.prototype.addStockGroupFormSubmit = function () {
        var _this = this;
        this.isAddStockGroupInProcess = true;
        var formObj = this.addStockGroupForm.value;
        this._inventoryService.CreateStockGroup(formObj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            var data = res;
            var o;
            if (data.status === 'success') {
                o = {
                    name: data.body.name,
                    uniqueName: data.body.uniqueName
                };
                _this._toasty.successToast('Stock group Created Successfully');
                _this.getStockGroups();
                _this.addStockGroupFormReset();
                _this.closeCreateGroupModal();
                _this._store.dispatch(_this._salesActions.createStockGroupSuccess(o));
            }
            else {
                _this._toasty.errorToast(data.message, data.code);
            }
            _this.isAddStockGroupInProcess = false;
        });
    };
    SalesAddStockGroupComponent.prototype.addStockGroupFormReset = function () {
        this.addStockGroupForm.reset();
        this.closeCreateGroupModal();
    };
    SalesAddStockGroupComponent.prototype.closeCreateGroupModal = function () {
        this.actionFired.emit({ action: 'close' });
    };
    SalesAddStockGroupComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"])
    ], SalesAddStockGroupComponent.prototype, "actionFired", void 0);
    SalesAddStockGroupComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'sales-add-group-modal',
            template: __webpack_require__(/*! ./create.stock.group.modal.html */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _services_inventory_service__WEBPACK_IMPORTED_MODULE_6__["InventoryService"],
            _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_7__["InventoryAction"],
            _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_9__["SidebarAction"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_10__["ToasterService"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_11__["SalesActions"]])
    ], SalesAddStockGroupComponent);
    return SalesAddStockGroupComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.html":
/*!**********************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.html ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form #formDiv name=\"addEditStockForm\" [formGroup]=\"addStockForm\" novalidate=\"\" autocomplete=\"off\"\n  [style.margin-top.px]=\"-15\">\n\n  <section class=\"col-xs-12 col-md-12 col-lg-12\">\n    <div class=\"row\">\n      <div class=\"\">\n        <div class=\"form_header\">\n          <h2 *ngIf=\"!isUpdatingStockForm\">Create Stock</h2>\n          <h2 *ngIf=\"isUpdatingStockForm\">Update Stock</h2>\n        </div>\n\n        <div class=\"\">\n          <section class=\"form_body witBg clearfix mrBChldLbl\">\n            <div class=\"form_bg clearfix\">\n              <div class=\"row\">\n                <div class=\"form-group col-xs-5\">\n                  <label>Under Group</label>\n                  <sh-select #groupDDList [options]=\"groupsData$ | async\" formControlName=\"parentGroup\"\n                    [placeholder]=\"'Select Group'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    (selected)=\"groupSelected($event)\" [isFilterEnabled]=\"true\"\n                    [forceClearReactive]=\"forceClear$ | async\" [notFoundLinkText]=\"'+ Add New'\"\n                    (noResultsClicked)=\"addNewGroupPane()\" [notFoundLink]=\"false\" [dropdownMinHeight]=\"33\"></sh-select>\n                </div>\n                <div class=\"form-group col-xs-5\" *ngIf=\"isUpdatingStockForm\">\n                  <label class=\"d-block\">&nbsp;</label>\n                  <button type=\"button\" class=\"btn btn-default\" (click)=\"moveStock()\"\n                    [disabled]=\"addStockForm.get('parentGroup').value === activeGroup.uniqueName\">Move\n                  </button>\n\n                </div>\n              </div>\n\n              <div class=\"clearfix row\">\n                <div class=\"form-group col-xs-5\">\n                  <label>Stock Name <sup>*</sup></label>\n                  <input type=\"text\" name=\"name\" class=\"form-control\" (change)=\"generateUniqueName()\"\n                    formControlName=\"name\" />\n                </div>\n                <div class=\"form-group col-xs-5\">\n                  <label>Stock Unit <sup>*</sup></label>\n                  <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                    [placeholder]=\"'Choose a parent unit'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                </div>\n              </div>\n              <!-- other details -->\n              <div class=\"row\">\n                <div class=\"col-xs-12\">\n                  <div class=\"form-group toggle-btn mrB\" (click)=\"showOtherDetails = !showOtherDetails\">\n                    <label class=\"cp\">\n                      <i class=\"fa cp\" aria-hidden=\"true\"\n                        [ngClass]=\"{'fa-minus-square-o': showOtherDetails, 'fa-plus-square-o': !showOtherDetails}\"></i>Other\n                      Details\n                    </label>\n                  </div>\n                </div>\n              </div>\n\n              <ng-container *ngIf=\"showOtherDetails\">\n                <div class=\"row\">\n\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Unique Name</label>\n                    <input type=\"text\" name=\"uniqueName\" UniqueNameDirective textCaseChangeDirective\n                      [control]=\"addStockForm.get('uniqueName')\" class=\"form-control\" formControlName=\"uniqueName\">\n                  </div>\n\n\n                  <div class=\"form-group col-xs-4\" [hidden]=\"!(isManageInventory$ | async)\">\n                    <label>HSN Code</label>\n                    <input type=\"text\" class=\"form-control\" maxlength=\"10\" decimalDigitsDirective\n                      formControlName=\"hsnNumber\" />\n                  </div>\n\n                  <!--                  <div class=\"form-group col-xs-4\">-->\n                  <!--                    <label>Discount</label>-->\n                  <!--                    <div class=\"btn-group btn-block\" dropdown>-->\n                  <!--                      <button dropdownToggle type=\"button\"-->\n                  <!--                              class=\"dropdown-toggle form-control text-left\"> Selected-->\n                  <!--                        ({{ addStockForm.get('taxes').value.length }}) <span-->\n                  <!--                          class=\"pull-right\"><span class=\"caret\"></span></span></button>-->\n                  <!--                      <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">-->\n                  <!--                        <li role=\"menuitem\" *ngFor=\"let tax of (companyTaxesList$ | async)\">-->\n                  <!--                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\"><input-->\n                  <!--                            type=\"checkbox\" [checked]=\"tax.isChecked\"-->\n                  <!--                            (click)=\"selectTax($event, tax)\"/> {{tax.name}}</a>-->\n                  <!--                        </li>-->\n                  <!--                        <li *ngIf=\"(companyTaxesList$ | async).length < 1\">-->\n                  <!--                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\">No Tax-->\n                  <!--                            Found</a>-->\n                  <!--                        </li>-->\n                  <!--                      </ul>-->\n                  <!--                    </div>-->\n                  <!--                  </div>-->\n\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Tax</label>\n\n\n\n                    <div class=\"btn-group btn-block\" dropdown>\n                      <button dropdownToggle type=\"button\" class=\"dropdown-toggle form-control text-left\"> Selected\n                        ({{ taxTempArray.length }}) <span class=\"pull-right\"><span class=\"caret\"></span></span></button>\n                      <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                        <li role=\"menuitem\" *ngFor=\"let tax of (companyTaxesList$ | async)\"\n                          [ngClass]=\"{'opacity' : tax.isDisabled}\">\n                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\"><input type=\"checkbox\"\n                              [disabled]=\"tax.isDisabled\" [checked]=\"tax.isChecked\" (click)=\"selectTax($event, tax)\" />\n                            {{tax.name}}</a>\n                        </li>\n                        <li *ngIf=\"(companyTaxesList$ | async).length < 1\">\n                          <a class=\"dropdown-item\" (click)=\"$event.stopPropagation()\">No Tax\n                            Found</a>\n                        </li>\n                      </ul>\n                    </div>\n                  </div>\n\n                </div>\n\n                <div class=\"row\">\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Open. Qty</label>\n                    <input type=\"text\" name=\"openingQuantity\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                      (change)=\"calCulateRate()\" class=\"form-control\" formControlName=\"openingQuantity\">\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Amount</label>\n                    <input type=\"text\" name=\"openingAmount\" (change)=\"calCulateRate()\" decimalDigitsDirective\n                      [DecimalPlaces]=\"2\" class=\"form-control\" formControlName=\"openingAmount\">\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <label>Rate</label>\n                    <input type=\"text\" name=\"stockRate\" formControlName=\"stockRate\" class=\"form-control\"\n                      placeholder=\"Auto calculate\">\n                  </div>\n\n                </div>\n\n                <div class=\"row sku-row\">\n                  <div class=\"form-group col-xs-4\" [hidden]=\"(isManageInventory$ | async)\">\n                    <label>SAC Code</label>\n                    <input type=\"text\" class=\"form-control\" maxlength=\"10\" decimalDigitsDirective\n                      formControlName=\"sacNumber\" />\n                  </div>\n\n\n                  <!-- SKU Code -->\n                  <div class=\"form-group col-xs-4\">\n                    <label>\n                      <span *ngIf=\"!editSKUlabel && !addStockForm.controls['skuCodeHeading'].value\">SKU Code</span>\n                      <span *ngIf=\"!editSKUlabel\">{{addStockForm.controls['skuCodeHeading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Enter\" class=\"label-input\" *ngIf=\"editSKUlabel\"\n                        formControlName=\"skuCodeHeading\" (blur)=\"editSKUlabel=!editSKUlabel\">\n                      <i *ngIf=\"!editSKUlabel\" class=\"fa fa-pencil\" (click)=\"editSKUlabel=!editSKUlabel\"></i>\n                    </label>\n                    <input type=\"text\" name=\"skuCode\" class=\"form-control\" maxlength=\"20\" (keyup)=\"validateSKU($event)\"\n                      formControlName=\"skuCode\">\n                  </div>\n\n\n                  <!-- field 1 -->\n                  <div class=\"form-group col-xs-4\"\n                    *ngIf=\"customField1 || addStockForm.controls['customField1Heading'].value\">\n\n                    <label>\n                      <span\n                        *ngIf=\"!customField1HeadingEditing && !addStockForm.controls['customField1Heading'].value\">Custom\n                        field 1</span>\n                      <span\n                        *ngIf=\"!customField1HeadingEditing\">{{addStockForm.controls['customField1Heading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Custom field 1\" class=\"label-input\"\n                        *ngIf=\"customField1HeadingEditing\" formControlName=\"customField1Heading\"\n                        (blur)=\"customField1HeadingEditing=!customField1HeadingEditing\">\n\n                      <span class=\"pull-right\">\n                        <i *ngIf=\"!customField1HeadingEditing\" class=\"fa fa-pencil\"\n                          (click)=\"customField1HeadingEditing=!customField1HeadingEditing\"></i>\n                        <i class=\"icon-cross text-danger\" (click)=\"removeCustomField('remove', 1)\"></i>\n                      </span>\n                    </label>\n                    <input type=\"text\" name=\"customField1Value\" class=\"form-control\" maxlength=\"30\"\n                      formControlName=\"customField1Value\">\n\n                  </div>\n                  <!-- field 2 -->\n                  <div class=\"form-group col-xs-4\"\n                    *ngIf=\"customField2 || addStockForm.controls['customField2Heading'].value\">\n                    <label>\n                      <span\n                        *ngIf=\"!customField2HeadingEditing && !addStockForm.controls['customField2Heading'].value\">Custom\n                        field 2</span>\n                      <span\n                        *ngIf=\"!customField2HeadingEditing\">{{addStockForm.controls['customField2Heading'].value}}</span>\n                      <input type=\"text\" placeholder=\"Custom field 2\" class=\"label-input\"\n                        *ngIf=\"customField2HeadingEditing\" formControlName=\"customField2Heading\"\n                        (blur)=\"customField2HeadingEditing=!customField2HeadingEditing\">\n\n                      <span class=\"pull-right\">\n                        <i *ngIf=\"!customField2HeadingEditing\" class=\"fa fa-pencil\"\n                          (click)=\"customField2HeadingEditing=!customField2HeadingEditing\"></i>\n                        <i class=\"icon-cross text-danger\" (click)=\"removeCustomField('remove', 2)\"></i>\n\n                      </span>\n                    </label>\n                    <input type=\"text\" name=\"customField2Value\" class=\"form-control\" maxlength=\"30\"\n                      formControlName=\"customField2Value\">\n                  </div>\n                  <!-- field 2 end -->\n                  <div class=\"form-group col-xs-4\">\n                    <div class=\"new-btn\" (click)=\"addCustomField()\" *ngIf=\"!customField2 || !customField1\">+ Custom\n                      field</div>\n                  </div>\n\n                </div>\n\n              </ng-container>\n            </div>\n\n            <div class=\"pdL pdR pdT\">\n              <div class=\"col-xs-6\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"enablePurchase\">\n                    <input type=\"checkbox\" formControlName=\"enablePurchase\" id=\"enablePurchase\"\n                      name=\"enablePurchase\">Purchase Information</label>\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"boldHead\">Account Name</label>\n                  <sh-select [options]=\"purchaseAccountsDropDown$ | async\" formControlName=\"purchaseAccountUniqueName\"\n                    [placeholder]=\"'select purchase account'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                    [disabled]=\"!addStockForm.controls['enablePurchase'].value\"\n                    [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                </div>\n\n                <div class=\"row\">\n                  <div class=\"col-xs-7\">\n                    <label>Unit</label>\n                  </div>\n                  <div class=\"col-xs-4 row\">\n                    <label>Rate</label>\n                  </div>\n                </div>\n\n                <div formArrayName=\"purchaseUnitRates\">\n                  <div class=\"row\"\n                    *ngFor=\"let item of addStockForm.get('purchaseUnitRates')['controls']; let i=index;let f = first; let l = last\">\n                    <div [formGroupName]=\"i\">\n                      <div class=\"form-group col-xs-7 \">\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                          [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"\n                          [disabled]=\"!addStockForm.controls['enablePurchase'].value\"\n                          [forceClearReactive]=\"forceClear$ | async\" [notFoundLinkText]=\"'+ Add New'\"\n                          (noResultsClicked)=\"addNewStockUnit()\" [notFoundLink]=\"true\" [dropdownMinHeight]=\"70\">\n                        </sh-select>\n                      </div>\n                      <div class=\"form-group row col-xs-4\">\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          formControlName=\"rate\" />\n                      </div>\n                    </div>\n                    <div class=\"pull-right mrT unit_add\">\n                      <button class=\"btn-link\" (click)=\"addPurchaseUnitRates(i)\" *ngIf=\"l\"><i\n                          class=\"fa fa-plus add_row\"></i></button>\n                      <button class=\"btn-link\" (click)=\"removePurchaseUnitRates(i)\" *ngIf=\"!l\"><i\n                          class=\"fa fa-times dlet\"></i></button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n\n              <div class=\"col-xs-6\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"enableSales\">\n                    <input type=\"checkbox\" formControlName=\"enableSales\" id=\"enableSales\" name=\"enableSales\">Sales\n                    Information</label>\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"\">Account Name</label>\n                  <sh-select [options]=\"salesAccountsDropDown$ | async\" formControlName=\"salesAccountUniqueName\"\n                    [multiple]=\"false\" [disabled]=\"!addStockForm.controls['enableSales'].value\"\n                    [placeholder]=\"'select sales account'\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\">\n                  </sh-select>\n                </div>\n                <div class=\"row\">\n                  <div class=\"col-xs-7\">\n                    <label>Unit</label>\n                  </div>\n                  <div class=\"col-xs-4 row\">\n                    <label>Rate</label>\n                  </div>\n                </div>\n\n                <div formArrayName=\"saleUnitRates\">\n                  <div class=\"row\"\n                    *ngFor=\"let item of addStockForm.get('saleUnitRates')['controls']; let i=index; let f = first; let l = last\">\n                    <div [formGroupName]=\"i\">\n                      <div class=\"form-group col-xs-7\">\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                          [multiple]=\"false\" [disabled]=\"!addStockForm.controls['enableSales'].value\"\n                          [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\" [forceClearReactive]=\"forceClear$ | async\"\n                          [notFoundLinkText]=\"'+ Add New'\" (noResultsClicked)=\"addNewStockUnit()\" [notFoundLink]=\"true\"\n                          [dropdownMinHeight]=\"70\"></sh-select>\n                        <!--<select2 [data]=\"stockUnitsDropDown$ | async\" [options]=\"UnitDropDownOptions\" formControlName=\"stockUnitCode\"></select2>-->\n                      </div>\n                      <div class=\"form-group row col-xs-4\">\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          formControlName=\"rate\" />\n                      </div>\n                    </div>\n                    <div class=\"pull-right mrT unit_add\">\n                      <button class=\"btn-link\" (click)=\"addSaleUnitRates(i)\" *ngIf=\"l\"><i\n                          class=\"fa fa-plus add_row\"></i></button>\n                      <button class=\"btn-link\" (click)=\"removeSaleUnitRates(i)\" *ngIf=\"!l\"><i\n                          class=\"fa fa-times dlet\"></i></button>\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n            </div>\n\n\n            <div class=\"mrT1 pdL pdR\">\n              <div class=\"col-xs-12\">\n                <div class=\"checkbox\">\n                  <label class=\"\" for=\"isFsStock\">\n                    <input type=\"checkbox\" formControlName=\"isFsStock\" id=\"isFsStock\" [disabled]=\"\" name=\"isFsStock\"> Is\n                    it a finished stock? (Manufacturing/Combo)</label>\n                </div>\n              </div>\n            </div>\n\n\n            <section class=\"mrT2 mrB3 col-xs-12\" *ngIf=\"addStockForm.value.isFsStock\">\n              <div class=\"pdL pdR\">\n                <h1 class=\"section_head bdrB\"><strong>{{addStockForm.controls['name'].value}} (Made\n                    with)</strong></h1>\n                <table class=\"noHover basic width100\">\n                  <tbody formGroupName=\"manufacturingDetails\">\n                    <tr class=\"output_row\">\n                      <td class=\"form-group\">\n                        <label>Output Qty <sup>*</sup></label>\n                        <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                          name=\"manufacturingQuantity\" placeholder=\"Quantity\" formControlName=\"manufacturingQuantity\" />\n                      </td>\n                      <td class=\"form-group\">\n                        <label>Stock Unit <sup>*</sup></label>\n                        <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"manufacturingUnitCode\"\n                          [placeholder]=\"'Select Unit'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                          [forceClearReactive]=\"forceClear$ | async\"></sh-select>\n                      </td>\n                      <td *ngIf=\"addStockForm.controls['manufacturingDetails'].controls['manufacturingQuantity'].value\"\n                        colspan=\"2\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <span class=\"width100\"><strong>= (\n                            {{addStockForm.controls['manufacturingDetails'].controls['manufacturingQuantity'].value}}\n                            {{addStockForm.controls['manufacturingDetails'].controls['manufacturingUnitCode'].value}}\n                            {{addStockForm.controls['name'].value}} )</strong></span>\n                      </td>\n                      <!-- <td colspan=\"1\">&nbsp;</td> -->\n                    </tr>\n                    <tr class=\"noHover bdrT table_label\" style=\"border-color:#ccc;\">\n                      <td [style.width.px]=\"200\"><strong>Input Stock Name</strong></td>\n                      <td><strong>Stock Qty</strong></td>\n                      <td><strong>Stock Unit</strong></td>\n                      <td colspan=\"1\"></td>\n                    </tr>\n\n                    <ng-container formArrayName=\"linkedStocks\">\n                      <tr\n                        *ngFor=\"let list of addStockForm.get('manufacturingDetails')['controls']['linkedStocks'].controls;let i = index; let l = last\"\n                        [formGroupName]=\"i\" class=\"fsstock\">\n                        <td>\n                          <sh-select [options]=\"stockListDropDown$ | async\" formControlName=\"stockUniqueName\"\n                            [multiple]=\"false\" [placeholder]=\"'Select Stock Name'\" [placeholder]=\"'Select Stock'\"\n                            [ItemHeight]=\"33\" (selected)=\"findAddedStock($event?.value, i)\"\n                            [forceClearReactive]=\"forceClearStock$ | async\"></sh-select>\n                        </td>\n\n                        <td>\n                          <input type=\"text\" formControlName=\"quantity\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                            name=\"quantity\" placeholder=\"Enter Quantity\" class=\"form-control\" />\n                        </td>\n                        <td>\n                          <sh-select [options]=\"stockUnitsDropDown$ | async\" formControlName=\"stockUnitCode\"\n                            [multiple]=\"false\" [placeholder]=\"'Select Unit'\" [ItemHeight]=\"33\"\n                            [forceClearReactive]=\"forceClearStockUnit$ | async\"></sh-select>\n                        </td>\n                        <td>\n                          <button class=\"btn-link\" (click)=\"addItemInLinkedStocks(list, i, i)\" *ngIf=\"l\"\n                            [disabled]=\"disableStockButton\"><i class=\"fa fa-plus add_row\"></i></button>\n                          <button class=\"btn-link\" (click)=\"removeItemInLinkedStocks(i)\" *ngIf=\"!l\"><i\n                              class=\"fa fa-times dlet\"></i></button>\n                        </td>\n                      </tr>\n                    </ng-container>\n                  </tbody>\n                </table>\n              </div>\n            </section>\n\n            <div class=\"col-xs-12 text-left\">\n              <div class=\"mrT1 pdL pdR\">\n\n                <button type=\"submit\" *ngIf=\"!isUpdatingStockForm\" [ladda]=\"isStockAddInProcess$ | async\"\n                  (click)=\"submit()\" class=\"btn btn-success\"\n                  [disabled]=\"addStockForm.invalid || disableStockButton\">Save\n                </button>\n                <button type=\"button\" *ngIf=\"isUpdatingStockForm\" [ladda]=\"isStockUpdateInProcess$ | async\"\n                  class=\"btn btn-primary\" (click)=\"update()\"\n                  [disabled]=\"addStockForm.invalid || disableStockButton\">Update\n                </button>\n                <button *ngIf=\"isUpdatingStockForm\" [ladda]=\"isStockDeleteInProcess$ | async\" class=\"btn btn-danger\"\n                  (click)=\"deleteStock()\">Delete Stock\n                </button>\n                <button type=\"button\" *ngIf=\"!isUpdatingStockForm\" (click)=\"resetStockForm()\"\n                  class=\"btn btn-default\">Cancel\n                </button>\n              </div>\n            </div>\n          </section>\n        </div>\n\n\n      </div>\n    </div>\n  </section>\n\n  <div class=\"clearfix\"></div>\n  <!--manufactre details  -->\n\n\n  <div class=\"clearfix\"></div>\n\n\n</form>\n\n<!--ngbusy  -->\n<div [hidden]=\"true\">\n  <!-- *ngIf=\"showLoadingForStockEditInProcess$ | async\" -->\n  <div class=\"ng-busy ng-trigger ng-trigger-flyInOut\" [ngStyle]=\"{\n    'position': 'absolute',\n    'background-color': 'rgba(216, 216, 203, 0.5)',\n    'top': (formDivBoundingRect | async)?.top + 'px',\n    'bottom': (formDivBoundingRect | async)?.bottom + 'px',\n    'left': (formDivBoundingRect | async)?.left + 'px',\n    'right': (formDivBoundingRect | async)?.right + 'px',\n    'height': (formDivBoundingRect | async)?.height + 'px',\n    'width': (formDivBoundingRect | async)?.width + 'px'\n  }\">\n    <div>\n      <div class=\"ng-busy-default-wrapper\">\n        <div class=\"ng-busy-default-sign\">\n          <div class=\"ng-busy-default-spinner\">\n            <div class=\"bar1\"></div>\n            <div class=\"bar2\"></div>\n            <div class=\"bar3\"></div>\n            <div class=\"bar4\"></div>\n            <div class=\"bar5\"></div>\n            <div class=\"bar6\"></div>\n            <div class=\"bar7\"></div>\n            <div class=\"bar8\"></div>\n            <div class=\"bar9\"></div>\n            <div class=\"bar10\"></div>\n            <div class=\"bar11\"></div>\n            <div class=\"bar12\"></div>\n          </div>\n          <div class=\"ng-busy-default-text\">Loading...</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--ngbusy  -->\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.scss":
/*!**********************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.scss ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".output_row > td {\n  padding: 12px 10px 12px 0 !important; }\n\n.basic > tbody > tr > td {\n  padding: 2px 10px 2px 0; }\n\n.table_label td {\n  padding-top: 12px !important; }\n\n.dropdown-menu {\n  max-height: 168px;\n  overflow: auto; }\n\n.sku-row {\n  position: relative; }\n\n.sku-row label {\n    width: 100%; }\n\n.sku-row .label-input {\n    background: none;\n    border: none;\n    max-width: 108px;\n    border-bottom: 1px solid #dddddd; }\n\n.sku-row .item-label {\n    display: inline-block; }\n\n.sku-row .item-label:first-child {\n    max-width: 108px; }\n\n.sku-row .item-label:last-child {\n    text-align: right; }\n\n.sku-row i {\n    margin-left: 10px;\n    padding-bottom: 3px;\n    border-bottom: 1px solid #dddddd; }\n\n.sku-row .new-btn {\n    font-size: 12px;\n    color: #2262d1;\n    padding-top: 30px;\n    cursor: pointer; }\n\n.sku-row .text-danger {\n    color: #F80606; }\n\n.opacity {\n  opacity: 0.5; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.ts":
/*!********************************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.ts ***!
  \********************************************************************************************************************************/
/*! exports provided: SalesAddStockComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesAddStockComponent", function() { return SalesAddStockComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/helpers */ "./src/app/shared/helpers/index.ts");
/* harmony import */ var _models_api_models_Inventory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../models/api-models/Inventory */ "./src/app/models/api-models/Inventory.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../../actions/inventory/customStockUnit.actions */ "./src/app/actions/inventory/customStockUnit.actions.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_inventory_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../../services/inventory.service */ "./src/app/services/inventory.service.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../../../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var _inventory_inv_view_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../../inventory/inv.view.service */ "./src/app/inventory/inv.view.service.ts");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");





















var SalesAddStockComponent = /** @class */ (function () {
    function SalesAddStockComponent(store, route, sideBarAction, _fb, inventoryAction, _accountService, customStockActions, ref, _toasty, _inventoryService, companyActions, invoiceActions, invViewService, cdr, _generalActions) {
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
        this._generalActions = _generalActions;
        this.addStock = false;
        this.autoFocusInChild = false;
        this.stockUnitsDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
        this.formDivBoundingRect = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
        this.animateAside = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
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
    SalesAddStockComponent.prototype.ngOnInit = function () {
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
            sacNumber: [''],
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
                _this.groupUniqueName = a.stockGroup.uniqueName;
                if (a.customField1Value) {
                    _this.customField1 = true;
                }
                if (a.customField2Value) {
                    _this.customField2 = true;
                }
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
                _this.addStockForm.get('taxes').patchValue('');
                _this.store.dispatch(_this._generalActions.getFlattenAccount());
                _this.store.dispatch(_this.inventoryAction.resetCreateStockFlags());
                _this.closeAsidePane();
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
    SalesAddStockComponent.prototype.addCustomField = function () {
        if (!this.customField1) {
            this.customField1 = true;
            return;
        }
        this.customField2 = true;
    };
    SalesAddStockComponent.prototype.actionCustomField = function (index) {
        if (index === 1) {
            this.customField1HeadingEditing = !this.customField1HeadingEditing;
        }
        else {
            this.customField2HeadingEditing = !this.customField2HeadingEditing;
        }
    };
    SalesAddStockComponent.prototype.removeCustomField = function (type, index) {
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
    SalesAddStockComponent.prototype.initUnitAndRates = function () {
        // initialize our controls
        return this._fb.group({
            rate: [''],
            stockUnitCode: ['']
        });
    };
    // add purchaseUnitRates controls
    SalesAddStockComponent.prototype.addPurchaseUnitRates = function (i, item) {
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
    SalesAddStockComponent.prototype.removePurchaseUnitRates = function (i) {
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
    SalesAddStockComponent.prototype.addSaleUnitRates = function (i, item) {
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
    SalesAddStockComponent.prototype.removeSaleUnitRates = function (i) {
        // remove address from the list
        var control = this.addStockForm.controls['saleUnitRates'];
        if (control.length > 1) {
            control.removeAt(i);
        }
        else {
            control.controls[0].reset();
        }
    };
    SalesAddStockComponent.prototype.ngAfterViewInit = function () {
        if (this.groupUniqueName) {
            // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
        }
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        manufacturingDetailsContorl.disable();
    };
    // generate uniquename
    SalesAddStockComponent.prototype.generateUniqueName = function () {
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
    SalesAddStockComponent.prototype.calCulateRate = function () {
        var quantity = this.addStockForm.value.openingQuantity;
        var amount = this.addStockForm.value.openingAmount;
        if (quantity && amount) {
            this.addStockForm.patchValue({ stockRate: (amount / quantity).toFixed(4) });
        }
        else if (!quantity || !amount) {
            this.addStockForm.controls['stockRate'].patchValue('');
        }
    };
    SalesAddStockComponent.prototype.initialIManufacturingDetails = function () {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['', _shared_helpers__WEBPACK_IMPORTED_MODULE_8__["digitsOnly"]]
        });
    };
    SalesAddStockComponent.prototype.addItemInLinkedStocks = function (item, i, lastIdx) {
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
    SalesAddStockComponent.prototype.editItemInLinkedStocks = function (item, i) {
        this.editLinkedStockIdx = i;
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        var last = control.controls.length - 1;
        control.disable();
        control.controls[i].enable();
        control.controls[last].enable();
        this.editModeForLinkedStokes = true;
    };
    SalesAddStockComponent.prototype.updateItemInLinkedStocks = function (item, i) {
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        control.controls[i].patchValue(item);
        this.editLinkedStockIdx = null;
        this.editModeForLinkedStokes = false;
        var last = control.controls.length;
        control.disable();
        control.controls[last - 1].enable();
    };
    SalesAddStockComponent.prototype.removeItemInLinkedStocks = function (i) {
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        var manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'];
        var control = manufacturingDetailsContorl.controls['linkedStocks'];
        control.removeAt(i);
    };
    SalesAddStockComponent.prototype.checkIfLinkedStockIsUnique = function (v) {
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
    // close pane
    SalesAddStockComponent.prototype.closeAsidePane = function () {
        this.closeAsideEvent.emit();
    };
    SalesAddStockComponent.prototype.resetStockForm = function () {
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
        //this.closeAsideEvent.emit({action: 'first'});
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
    SalesAddStockComponent.prototype.submit = function () {
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
    SalesAddStockComponent.prototype.getParentGroupData = function () {
        var _this = this;
        // parentgroup data
        var flattenData = [];
        this._inventoryService.GetGroupsWithStocksFlatten().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                _this.flattenDATA(data.body.results, flattenData);
                _this.groupsData$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flattenData);
                _this.setActiveGroupOnCreateStock();
            }
        });
    };
    SalesAddStockComponent.prototype.setActiveGroupOnCreateStock = function () {
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
    SalesAddStockComponent.prototype.flattenDATA = function (rawList, parents) {
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
    SalesAddStockComponent.prototype.groupSelected = function (event) {
        var selected;
        // this.generateUniqueName();
        this.groupsData$.subscribe(function (p) {
            selected = p.find(function (q) { return q.value === event.value; });
        });
        // this.activeGroup = selected;
    };
    SalesAddStockComponent.prototype.ngOnDestroy = function () {
        // this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * findAddedStock
     */
    SalesAddStockComponent.prototype.findAddedStock = function (uniqueName, i) {
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
    SalesAddStockComponent.prototype.removeBlankLinkedStock = function (linkedStocks) {
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
    SalesAddStockComponent.prototype.validateLinkedStock = function (item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    };
    SalesAddStockComponent.prototype.addNewGroupPane = function () {
        this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
    };
    SalesAddStockComponent.prototype.addNewStockUnit = function () {
        this.store.dispatch(this.inventoryAction.OpenCustomUnitPane(true));
    };
    SalesAddStockComponent.prototype.validateSKU = function (e) {
        var pattern = new RegExp("^[a-zA-Z0-9]+$");
        var isOk = pattern.test(e.key);
        if (!isOk) {
            var val = this.addStockForm.get('skuCode').value;
            val = val.substr(0, (val.length - 1));
            this.addStockForm.get('skuCode').patchValue(val);
            return;
        }
    };
    /**
     * ngOnChanges
     */
    SalesAddStockComponent.prototype.ngOnChanges = function (s) {
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
    SalesAddStockComponent.prototype.selectTax = function (e, tax) {
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
    SalesAddStockComponent.prototype.mapSavedTaxes = function (taxes) {
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
    SalesAddStockComponent.prototype.moveStock = function () {
        if (this.addStockForm.get('parentGroup').value !== this.activeGroup.uniqueName) {
            this.store.dispatch(this.inventoryAction.MoveStock(this.activeGroup, this.stockUniqueName, this.addStockForm.get('parentGroup').value));
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesAddStockComponent.prototype, "addStock", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesAddStockComponent.prototype, "autoFocusInChild", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('formDiv'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], SalesAddStockComponent.prototype, "formDiv", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('groupDDList'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesAddStockComponent.prototype, "groupDDList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"])
    ], SalesAddStockComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"])
    ], SalesAddStockComponent.prototype, "animateAside", void 0);
    SalesAddStockComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'sales-create-stock',
            template: __webpack_require__(/*! ./sales.create.stock.component.html */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.html"),
            styles: [__webpack_require__(/*! ./sales.create.stock.component.scss */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_6__["SidebarAction"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormBuilder"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_10__["InventoryAction"], _services_account_service__WEBPACK_IMPORTED_MODULE_12__["AccountService"],
            _actions_inventory_customStockUnit_actions__WEBPACK_IMPORTED_MODULE_13__["CustomStockUnitAction"], _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__["ToasterService"], _services_inventory_service__WEBPACK_IMPORTED_MODULE_16__["InventoryService"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_17__["CompanyActions"], _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_18__["InvoiceActions"],
            _inventory_inv_view_service__WEBPACK_IMPORTED_MODULE_19__["InvViewService"], _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"], _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_20__["GeneralActions"]])
    ], SalesAddStockComponent);
    return SalesAddStockComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.html":
/*!************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"addBulkItemmodal\">\n\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n\n      <div class=\"modal-header\">\n        <h4 class=\"modal-title pull-left\">Add bulk items</h4>\n        <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"closeEvent.emit()\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n\n      <div class=\"modal-body\">\n\n        <div class=\"row\">\n\n          <!-- region left side -->\n          <div class=\"col-md-6 col-sm-6\">\n            <div class=\"leftContent\">\n\n              <div class=\"searchBox\">\n                <input type=\"text\" placeholder=\"Search stock\" #searchElement>\n              </div>\n\n              <div class=\"productList\">\n\n                <perfect-scrollbar>\n\n                  <div class=\"singleProductWrapper cp\" *ngFor=\"let item of filteredData\"\n                       (click)=\"addItemToSelectedArr(item)\">\n                    <h5>{{ item.name }}</h5>\n                    <p>\n                      <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                      <span class=\"rateStock\"><label>Rate:</label> </span>{{ item.rate }}\n                    </p>\n                  </div>\n\n                </perfect-scrollbar>\n\n              </div>\n\n            </div>\n          </div>\n          <!-- endregion-->\n\n          <!-- region right side -->\n          <div class=\"col-md-6 pl-0 col-sm-6\">\n\n            <div class=\"rightContent\">\n\n              <h4>Selected Stocks <span class=\"selectdStockNumber\">({{ selectedItems.length }})</span></h4>\n              <hr>\n\n              <div class=\"rightSideWrapper\">\n                <perfect-scrollbar>\n                  <div class=\"wrapSelectedStocks\" *ngFor=\"let item of selectedItems\">\n                    <div class=\"singleSelectdStock clearfix d-flex\">\n\n                      <div class=\"\" style=\"flex: 1\">\n                        <div class=\"stockName\">\n                          <p>{{ item.name }}</p>\n                        </div>\n                      </div>\n\n                      <div class=\"d-flex\" style=\"align-items: center\">\n\n                        <div class=\"input-group\">\n\n                      <span class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-default btn-number\" (click)=\"alterQuantity(item, 'minus')\">\n                          <span class=\"fa fa-minus\"></span>\n                        </button>\n                      </span>\n\n                          <input type=\"number\" name=\"quantity\" class=\"form-control input-number\" value=\"1\" min=\"1\"\n                                 [(ngModel)]=\"item.quantity\">\n\n                          <span class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-default btn-number\" (click)=\"alterQuantity(item)\">\n                          <span class=\"fa fa-plus\"></span>\n                        </button>\n                      </span>\n\n                        </div>\n\n                        <span (click)=\"removeSelectedItem(item.uniqueName)\">\n                      <i class=\"fa fa-times\"></i>\n                    </span>\n                      </div>\n\n                    </div>\n                  </div>\n                </perfect-scrollbar>\n              </div>\n\n              <div class=\"temapletFooter\">\n\n                <hr>\n\n                <div class=\"btn-group bulkItemBtnGroup\">\n                  <button class=\"btn btn-sm btn-success\" type=\"button\"\n                          (click)=\"saveItemsEvent.emit(selectedItems);closeEvent.emit()\">\n                    Add\n                  </button>\n                  <button class=\"btn btn-sm btn-primary\" type=\"button\"\n                          (click)=\"closeEvent.emit()\">Cancel\n                  </button>\n                </div>\n\n              </div>\n\n            </div>\n          </div>\n          <!-- endregion-->\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.scss":
/*!************************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.scss ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* ADD BULK ITEM */\n.addBulkItemmodal.modal-dialog {\n  width: 870px !important;\n  margin: 30px auto; }\n.searchBox input[type=\"text\"] {\n  outline: none;\n  width: 100%;\n  height: 34px !important; }\n.rateStock {\n  margin-left: 10px; }\n.addBulkItemmodal .singleProductWrapper {\n  margin-bottom: 20px;\n  padding: 4px; }\n.addBulkItemmodal .singleProductWrapper:hover {\n    background-color: #e5e5e5;\n    color: #FF5F00; }\n.addBulkItemmodal .singleProductWrapper:hover h5 {\n    color: #FF5F00; }\n.stockName {\n  max-width: 240px;\n  width: 100%;\n  vertical-align: middle; }\n.addBulkItemmodal .singleProductWrapper h5 {\n  color: #333333;\n  font-size: 14px; }\n.addBulkItemmodal .singleProductWrapper p {\n  font-size: 12px;\n  padding-top: 4px; }\n.addBulkItemmodal .productList {\n  padding-top: 15px;\n  height: 600px;\n  overflow-y: auto; }\n.addBulkItemmodal .rightContent span.selectdStockNumber {\n  font-size: 20px; }\n.addBulkItemmodal .rightContent h4 {\n  font-size: 14px; }\n.addBulkItemmodal .rightContent hr {\n  color: black;\n  border-color: #ccc;\n  margin: 10px -15px;\n  margin-left: -15px; }\n.addBulkItemmodal .pl-0 {\n  padding-left: 0; }\n.addBulkItemmodal .singleSelectdStock p {\n  font-size: 14px; }\n.addBulkItemmodal .wrapSelectedStocks {\n  margin-top: 15px;\n  padding-right: 20px; }\n.addBulkItemmodal .input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n  width: 138px; }\n.addBulkItemmodal input.form-control.input-number {\n  width: 60px !important;\n  text-align: center;\n  height: 28px !important; }\n.addBulkItemmodal .input-group .input-group-btn .btn {\n  background: #fff;\n  border-left: 1px solid #ccc; }\n.addBulkItemmodal .btn {\n  padding: 3px 13px; }\n.addBulkItemmodal .input-group-btn .fa {\n  color: #C6C6C6; }\n.addBulkItemmodal .singleSelectdStock {\n  margin-bottom: 20px; }\n.addBulkItemmodal .leftContent {\n  border-right: 1px solid #ddd;\n  padding-right: 15px; }\n.addBulkItemmodal .modal-title {\n  font-size: 22px !important;\n  color: #fff; }\n.table-custom-invoice .salesTax .dropdown-menu-right li label {\n  padding-left: 10px; }\n.temapletFooter {\n  position: fixed;\n  bottom: 15px;\n  width: 100%;\n  max-width: 418px; }\n.rightSideWrapper {\n  height: 600px;\n  overflow-y: auto;\n  padding-bottom: 60px; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: ProformaAddBulkItemsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaAddBulkItemsComponent", function() { return ProformaAddBulkItemsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");






var ProformaAddBulkItemsComponent = /** @class */ (function () {
    function ProformaAddBulkItemsComponent(_cdr, _toaster) {
        this._cdr = _cdr;
        this._toaster = _toaster;
        this.data = [];
        this.closeEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.saveItemsEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.normalData = [];
        this.filteredData = [];
        this.selectedItems = [];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
    }
    ProformaAddBulkItemsComponent.prototype.ngOnInit = function () {
        var _this = this;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(this.searchElement.nativeElement, 'input').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (e) { return e.target.value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            _this.filteredData = _this.normalData.filter(function (item) {
                return item.name.toLowerCase().includes(res.toLowerCase()) || item.uniqueName.toLowerCase().includes(res.toLowerCase());
            });
            _this._cdr.markForCheck();
        });
        this.parseDataToDisplay(this.data);
    };
    ProformaAddBulkItemsComponent.prototype.parseDataToDisplay = function (data) {
        var arr = [];
        data
            .filter(function (f) { return f.additional && f.additional.stock; })
            .forEach(function (option) {
            var item = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["SalesAddBulkStockItems"]();
            item.name = option.label;
            item.uniqueName = option.value;
            item.rate = 0;
            if (option.additional.stock.accountStockDetails.unitRates && option.additional.stock.accountStockDetails.unitRates.length) {
                item.rate = option.additional.stock.accountStockDetails.unitRates[0].rate;
                item.stockUnitCode = option.additional.stock.accountStockDetails.unitRates[0].stockUnitCode;
            }
            arr.push(item);
        });
        this.normalData = arr;
        this.filteredData = arr;
    };
    ProformaAddBulkItemsComponent.prototype.addItemToSelectedArr = function (item) {
        var index = this.selectedItems.findIndex(function (f) { return f.uniqueName === item.uniqueName; });
        if (index > -1) {
            this._toaster.warningToast('this item is already selected please increase it\'s quantity');
        }
        else {
            this.selectedItems.push(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item));
        }
    };
    ProformaAddBulkItemsComponent.prototype.removeSelectedItem = function (uniqueName) {
        this.selectedItems = this.selectedItems.filter(function (f) { return f.uniqueName !== uniqueName; });
    };
    ProformaAddBulkItemsComponent.prototype.alterQuantity = function (item, mode) {
        if (mode === void 0) { mode = 'plus'; }
        if (mode === 'plus') {
            item.quantity++;
        }
        else {
            if (item.quantity === 1) {
                return;
            }
            item.quantity--;
        }
    };
    ProformaAddBulkItemsComponent.prototype.ngOnChanges = function (changes) {
        //
    };
    ProformaAddBulkItemsComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], ProformaAddBulkItemsComponent.prototype, "data", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('searchElement'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], ProformaAddBulkItemsComponent.prototype, "searchElement", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaAddBulkItemsComponent.prototype, "closeEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaAddBulkItemsComponent.prototype, "saveItemsEvent", void 0);
    ProformaAddBulkItemsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-add-bulk-items-component',
            template: __webpack_require__(/*! ./proforma-add-bulk-items.component.html */ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            styles: [__webpack_require__(/*! ./proforma-add-bulk-items.component.scss */ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_5__["ToasterService"]])
    ], ProformaAddBulkItemsComponent);
    return ProformaAddBulkItemsComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.html":
/*!**********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.html ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"gst-treatment-wrapper\" (click)=\"clickInside($event)\">\n\n  <div class=\"gst-treatment-header d-flex\">\n\n    <span style=\"flex: 1\">Gst Treatment</span>\n\n    <span class=\"cp\" (click)=\"closeEvent.emit()\">\n        <i class=\"fa fa-times\"></i>\n    </span>\n  </div>\n\n  <div class=\"gst-treatment-body\">\n\n    <form class=\"\" name=\"gstTreatmentForm\" novalidate=\"\">\n      <div class=\"container-fluid mrT1\">\n\n        <div class=\"\">\n\n          <div class=\"form-group\">\n            <label>Party Type</label>\n            <sh-select [options]=\"[]\" [showClear]=\"false\"></sh-select>\n          </div>\n\n          <div class=\"form-group\" style=\"margin-bottom: 5px\">\n            <label>GSTIN*</label>\n            <input class=\"form-control\" placeholder=\"Enter Unique Name\" type=\"text\">\n          </div>\n\n          <div class=\"d-flex\" style=\"justify-content: flex-end\">\n            <span style=\"font-size: 12px\" class=\"cp aquaColor\">\n              <a href=\"javascript: void 0\">Validate</a>\n            </span>\n          </div>\n        </div>\n\n\n        <div class=\"mt-2\">\n          <button class=\"btn btn-success\">\n            Save\n          </button>\n\n          <button class=\"btn btn-add btn-default\" (click)=\"closeEvent.emit()\">\n            Cancel\n          </button>\n        </div>\n\n      </div>\n    </form>\n\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.scss":
/*!**********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.scss ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".gst-treatment-wrapper {\n  background-color: #fff;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);\n  height: 290px; }\n  .gst-treatment-wrapper .gst-treatment-header {\n    background-color: #E2E2E2;\n    padding: 8px 10px;\n    border-bottom: 1px solid #CCCCCC; }\n  .gst-treatment-body {\n  padding: 5px; }\n  .gst-treatment-body label {\n  font-size: 12px;\n  margin-bottom: 7px; }\n  .btn-success {\n  background: #28ab00;\n  color: #fff; }\n  .aquaColor a {\n  color: #0C8FE6;\n  font-size: 12px; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.ts":
/*!********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: ProformaGstTreatmentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaGstTreatmentComponent", function() { return ProformaGstTreatmentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ProformaGstTreatmentComponent = /** @class */ (function () {
    function ProformaGstTreatmentComponent() {
        this.closeEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    ProformaGstTreatmentComponent.prototype.ngOnInit = function () {
    };
    ProformaGstTreatmentComponent.prototype.clickInside = function (event) {
        event.preventDefault();
        event.stopPropagation(); // <- that will stop propagation on lower layers
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaGstTreatmentComponent.prototype, "closeEvent", void 0);
    ProformaGstTreatmentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-gst-treatment-component',
            template: __webpack_require__(/*! ./proforma-gst-treatment.component.html */ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            styles: [__webpack_require__(/*! ./proforma-gst-treatment.component.scss */ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ProformaGstTreatmentComponent);
    return ProformaGstTreatmentComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.html":
/*!**********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.html ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"previuos-estimate-wrapper\" (click)=\"clickInside($event)\">\n  <ul style=\"list-style: none\">\n    <perfect-scrollbar>\n      <li *ngFor=\"let item of data\" (click)=\"onInvoiceSelected(item)\">\n        <div class=\"d-flex\" style=\"justify-content: space-between; padding: 4px;\">\n\n          <div style=\"display: flex;flex-direction: column\">\n            <span class=\"left-txtOrange\">{{ item.versionNumber }}</span>\n            <span class=\"left-txtOrange\">{{ item.date }} ( {{ item.account?.name }} )</span>\n          </div>\n\n          <span>{{ item.grandTotal }}</span>\n\n        </div>\n      </li>\n    </perfect-scrollbar>\n  </ul>\n</div>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.scss":
/*!**********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.scss ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".previuos-estimate-wrapper ul {\n  background-color: #fff;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);\n  padding: 5px;\n  height: 210px;\n  overflow-y: auto; }\n  .previuos-estimate-wrapper ul li {\n    font-size: 12px;\n    border-bottom: 1px solid #ddd;\n    padding-right: 12px; }\n  .previuos-estimate-wrapper ul li:hover {\n      background-color: #e5e5e5; }\n  .previuos-estimate-wrapper ul li:hover .left-txtOrange {\n      color: #FF5F00; }\n  .previuos-estimate-wrapper ul li:last-child {\n      border-bottom: none; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.ts":
/*!********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: ProformaLastInvoicesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaLastInvoicesComponent", function() { return ProformaLastInvoicesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ProformaLastInvoicesComponent = /** @class */ (function () {
    function ProformaLastInvoicesComponent() {
        this.invoiceSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.data = [];
    }
    ProformaLastInvoicesComponent.prototype.ngOnInit = function () {
    };
    ProformaLastInvoicesComponent.prototype.onInvoiceSelected = function (item) {
        this.invoiceSelected.emit({ accountUniqueName: item.account.uniqueName, invoiceNo: item.versionNumber });
    };
    ProformaLastInvoicesComponent.prototype.clickInside = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaLastInvoicesComponent.prototype, "invoiceSelected", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], ProformaLastInvoicesComponent.prototype, "data", void 0);
    ProformaLastInvoicesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-last-invoices-component',
            template: __webpack_require__(/*! ./proforma-last-invoices.component.html */ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.html"),
            styles: [__webpack_require__(/*! ./proforma-last-invoices.component.scss */ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ProformaLastInvoicesComponent);
    return ProformaLastInvoicesComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header themeBg pd2 pdL2 pdR2 clearfix\" style=\"background-color: #525252\">\n  <h3 class=\"modal-title bg\" id=\"modal-title\">Print Voucher </h3>\n  <i aria-hidden=\"true\" class=\"fa fa-times text-right close_modal\" (click)=\"cancelEvent.emit()\"></i>\n</div>\n\n<div class=\"modal-body\">\n\n  <div class=\"invoice-image-section\">\n\n    <div *ngIf=\"isVoucherDownloading\" style=\"display:flex;justify-content: center;align-items: center;height: 100%\">\n      <div class=\"giddh-spinner vertical-center-spinner\" style=\"top: 0\"></div>\n    </div>\n\n    <div *ngIf=\"isVoucherDownloadError && !isVoucherDownloading\" class=\"error\">\n              <span>\n                Invoice Preview is not available right now!Please try again..\n              </span>\n    </div>\n\n    <ng2-pdfjs-viewer [downloadFileName]=\"'invoice.pdf'\" [openFile]=\"false\" [viewBookmark]=\"false\"\n                      [download]=\"true\">\n    </ng2-pdfjs-viewer>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".invoice-image-section {\n  text-align: center;\n  background-color: #fff;\n  margin-bottom: 35px;\n  z-index: -9;\n  height: 73vh; }\n  .invoice-image-section .error {\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n            align-items: center;\n    height: 100%;\n    font-size: 36px;\n    max-width: 60%;\n    margin: 0 auto;\n    color: #ff0d0d; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: ProformaPrintInPlaceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaPrintInPlaceComponent", function() { return ProformaPrintInPlaceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng2-pdfjs-viewer */ "../../node_modules/ng2-pdfjs-viewer/ng2-pdfjs-viewer.umd.js");
/* harmony import */ var ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/api-models/proforma */ "./src/app/models/api-models/proforma.ts");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_proforma_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/proforma.service */ "./src/app/services/proforma.service.ts");
/* harmony import */ var _services_receipt_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/receipt.service */ "./src/app/services/receipt.service.ts");









var ProformaPrintInPlaceComponent = /** @class */ (function () {
    function ProformaPrintInPlaceComponent(_toasty, _proformaService, _receiptService) {
        this._toasty = _toasty;
        this._proformaService = _proformaService;
        this._receiptService = _receiptService;
        this.voucherType = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VoucherTypeEnum"].sales;
        this.cancelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.isVoucherDownloading = false;
        this.isVoucherDownloadError = false;
    }
    ProformaPrintInPlaceComponent.prototype.ngOnInit = function () {
        if (this.selectedItem) {
            this.downloadVoucher('base64');
        }
    };
    ProformaPrintInPlaceComponent.prototype.downloadVoucher = function (fileType) {
        var _this = this;
        if (fileType === void 0) { fileType = ''; }
        this.isVoucherDownloading = true;
        this.isVoucherDownloadError = false;
        if (this.voucherType === 'sales') {
            var model = {
                voucherType: this.voucherType,
                voucherNumber: [this.selectedItem.voucherNumber]
            };
            var accountUniqueName = this.selectedItem.uniqueName;
            //
            this._receiptService.DownloadVoucher(model, accountUniqueName, false).subscribe(function (result) {
                if (result) {
                    _this.pdfViewer.pdfSrc = result;
                    _this.selectedItem.blob = result;
                    _this.pdfViewer.showSpinner = true;
                    _this.pdfViewer.refresh();
                    _this.printVoucher();
                    _this.isVoucherDownloadError = false;
                }
                else {
                    _this.isVoucherDownloadError = true;
                    _this._toasty.errorToast('Something went wrong please try again!');
                }
                _this.isVoucherDownloading = false;
            }, function (err) {
                _this._toasty.errorToast(err.message);
                _this.isVoucherDownloading = false;
                _this.isVoucherDownloadError = true;
            });
        }
        else {
            var request = new _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_3__["ProformaDownloadRequest"]();
            request.fileType = fileType;
            request.accountUniqueName = this.selectedItem.uniqueName;
            if (this.voucherType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_4__["VoucherTypeEnum"].generateProforma) {
                request.proformaNumber = this.selectedItem.voucherNumber;
            }
            else {
                request.estimateNumber = this.selectedItem.voucherNumber;
            }
            this._proformaService.download(request, this.voucherType).subscribe(function (result) {
                if (result && result.status === 'success') {
                    var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__["base64ToBlob"])(result.body, 'application/pdf', 512);
                    _this.pdfViewer.pdfSrc = blob;
                    _this.selectedItem.blob = blob;
                    _this.pdfViewer.showSpinner = true;
                    _this.pdfViewer.refresh();
                    _this.printVoucher();
                    _this.isVoucherDownloadError = false;
                }
                else {
                    _this._toasty.errorToast(result.message, result.code);
                    _this.isVoucherDownloadError = true;
                }
                _this.isVoucherDownloading = false;
            }, function (err) {
                _this._toasty.errorToast(err.message);
                _this.isVoucherDownloading = false;
                _this.isVoucherDownloadError = true;
            });
        }
    };
    ProformaPrintInPlaceComponent.prototype.printVoucher = function () {
        if (this.pdfViewer && this.pdfViewer.pdfSrc) {
            this.pdfViewer.startPrint = true;
            this.pdfViewer.refresh();
            this.pdfViewer.startPrint = false;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ProformaPrintInPlaceComponent.prototype, "voucherType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ProformaPrintInPlaceComponent.prototype, "selectedItem", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_2__["PdfJsViewerComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_2__["PdfJsViewerComponent"])
    ], ProformaPrintInPlaceComponent.prototype, "pdfViewer", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaPrintInPlaceComponent.prototype, "cancelEvent", void 0);
    ProformaPrintInPlaceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-print-in-place-component',
            template: __webpack_require__(/*! ./proforma-print-in-place.component.html */ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.html"),
            styles: [__webpack_require__(/*! ./proforma-print-in-place.component.scss */ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_toaster_service__WEBPACK_IMPORTED_MODULE_6__["ToasterService"], _services_proforma_service__WEBPACK_IMPORTED_MODULE_7__["ProformaService"], _services_receipt_service__WEBPACK_IMPORTED_MODULE_8__["ReceiptService"]])
    ], ProformaPrintInPlaceComponent);
    return ProformaPrintInPlaceComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice-renderer.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice-renderer.component.ts ***!
  \*************************************************************************/
/*! exports provided: ProformaInvoiceRendererComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaInvoiceRendererComponent", function() { return ProformaInvoiceRendererComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var ProformaInvoiceRendererComponent = /** @class */ (function () {
    function ProformaInvoiceRendererComponent() {
    }
    ProformaInvoiceRendererComponent.prototype.ngOnInit = function () {
    };
    ProformaInvoiceRendererComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-invoice-renderer-component',
            template: "<router-outlet></router-outlet>"
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ProformaInvoiceRendererComponent);
    return ProformaInvoiceRendererComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice.component.html":
/*!******************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- region page change menu -->\n<div class=\"form-group mrB mrT2 clearfix\">\n\n  <div class=\"col-xs-12 clearfix\">\n\n    <div class=\"btn-group\" dropdown>\n\n      <button id=\"button1-basic\" dropdownToggle type=\"button\" class=\"btn spcl_dropdown dropdown-toggle\"\n        aria-controls=\"dropdown-basic\">\n        {{invoiceType | titlecase}} <small *ngIf=\"invoiceType==='estimates'\">(Beta)</small>\n        <span class=\"caret\" *ngIf=\"!isUpdateMode\"></span>\n      </button>\n\n      <ul id=\"dropdown1-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n        <ng-container *ngIf=\"!isUpdateMode\">\n          <li role=\"menuitem\" (click)=\"pageChanged(item.value, item.additional.label)\" *ngFor=\"let item of pageList\">\n            <a class=\"dropdown-item cp\">{{ item.additional?.label }}</a>\n          </li>\n        </ng-container>\n      </ul>\n    </div>\n\n  </div>\n\n</div>\n<!-- endregion -->\n\n<!-- region update mode loader-->\n<ng-container *ngIf=\"isUpdateDataInProcess\">\n\n  <div class=\"loaderClass\">\n    <div class=\"giddh-spinner vertical-center-spinner\"></div>\n  </div>\n\n</ng-container>\n<!--endregion-->\n\n<!-- region main form -->\n<div [hidden]=\"(isUpdateMode && isUpdateDataInProcess) || (isLastInvoiceCopied && isUpdateDataInProcess)\">\n  <form #invoiceForm=\"ngForm\" novalidate autocomplete=\"off\"\n    [ngClass]=\"{ 'customerInvoiceForm' : !invFormData.voucherDetails.customerName, 'cusomerInvoiceFormPurchase': isPurchaseInvoice } \">\n\n    <div class=\"clearfix\" [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"addAccountFromShortcut()\">\n\n      <div class=\"clearfix wrapperCustomerTable  pdT2\">\n        <!-- region customer and address section -->\n        <div class=\" customerInvoiceTable\">\n\n          <div class=\"inner-container\">\n            <!-- region customer section -->\n            <div class=\"clearfix\">\n\n              <div class=\"row\">\n                <!-- region customer name -->\n                <div class=\" col-sm-2\">\n                  <label>{{!isPurchaseInvoice ? 'Customer' : 'Vendor'}} Name *</label>\n                </div>\n                <!-- endregion -->\n\n                <!-- region customer dropdown -->\n                <div class=\"col-sm-7 selectCustomerName\">\n\n                  <div class=\"clearfix d-flex\" style=\"flex-direction: column\">\n                    <div class=\"d-flex\">\n\n                      <!-- region if not cashinvoice show customer dropdown -->\n                      <ng-container *ngIf=\"!isCashInvoice\">\n                        <sales-sh-select style=\"width:62.7%; float: left;\" name=\"voucherDetails.customerName\"\n                          #customerNameDropDown [options]=\"customerAcList$ | async\"\n                          [(ngModel)]=\"invFormData.voucherDetails.customerUniquename\"\n                          [customFilter]=\"customMoveGroupFilter\" (noOptionsFound)=\"noResultsForCustomer($event)\"\n                          (selected)=\"onSelectCustomer($event)\" [placeholder]=\"customerPlaceHolder\"\n                          [notFoundLink]=\"true\" [doNotReset]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                          [isFilterEnabled]=\"true\" (noResultsClicked)=\"addNewAccount()\" [multiple]=\"false\"\n                          [ItemHeight]=\"67\" [notFoundLinkText]=\"customerNotFoundText\"\n                          (keyup)=\"resetCustomerName($event)\" (onClear)=\"resetCustomerName(null)\"\n                          [disabled]=\"isUpdateMode\">\n\n                          <ng-template #optionTemplate let-option=\"option\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.value }}</div>\n                            </a>\n                          </ng-template>\n\n                          <ng-template #notFoundLinkTemplate>\n                            <a href=\"javascript:void(0)\" class=\"list-item\" [keyboardShortcut]=\"'alt+c'\"\n                              style=\"width:100%; display: flex;justify-content: space-between;\">\n                              <div class=\"item\">{{ customerNotFoundText }}</div>\n                              <div class=\"item\">Alt+C</div>\n                            </a>\n                          </ng-template>\n\n                        </sales-sh-select>\n                      </ng-container>\n                      <!-- endregion -->\n\n                      <!-- region if not cashinvoice show customer dropdown -->\n                      <ng-container *ngIf=\"isCashInvoice\">\n                        <input type=\"text\" name=\"voucherDetails.customerName\" class=\"form-control cashInvoiceInput\"\n                          [(ngModel)]=\"invFormData.voucherDetails.customerName\" [readOnly]=\"isUpdateMode\">\n                      </ng-container>\n                      <!-- endregion -->\n\n                      <!-- region previous details -->\n                      <div class=\"d-flex cp aquaColor\" #copyPreviousEstimate\n                        *ngIf=\"invFormData.voucherDetails.customerName && lastInvoices.length\"\n                        style=\"align-items: center;margin-left: 2%\">\n                        <a href=\"javascript: void 0\" (click)=\"showLastEstimateModal = !showLastEstimateModal\">\n                          <i class=\"fa fa-files-o\"></i>\n                          Copy Previous Invoices\n                          <!-- {{ invoiceType | voucherTypeToNamePipe | titlecase}} -->\n                        </a>\n\n                        <ng-container *ngTemplateOutlet=\"lastEstimateModal;context:{ $implicit: showLastEstimateModal}\">\n                        </ng-container>\n\n                      </div>\n                      <!-- endregion -->\n                    </div>\n\n                    <!-- region Unregistered Business / customer details -->\n                    <div class=\"d-flex aquaColor\" *ngIf=\"invFormData.voucherDetails.customerName\">\n\n                      <!--                      <span style=\"margin-right: 5px\" class=\"cp aquaColor\" #unregisteredBusiness>-->\n                      <!--                        <a href=\"javascript:void 0\" (click)=\"showGstTreatmentModal = !showGstTreatmentModal\">-->\n                      <!--                          Unregistered Business-->\n                      <!--                        </a>-->\n                      <!--                      </span>-->\n\n                      <ng-container *ngTemplateOutlet=\"gstTreatmentModal;context:{ $implicit: showGstTreatmentModal}\">\n                      </ng-container>\n\n                      <!--                      <p style=\"margin-right: 5px; color: #A9A9A9;\">|</p>-->\n\n                      <span style=\"margin-right: 5px\" class=\"cp aquaColor\" *ngIf=\"!isCashInvoice && !isUpdateMode\">\n                        <a href=\"javascript:void 0\" (click)=\"getCustomerDetails()\">Customer Details</a>\n                      </span>\n                    </div>\n                    <!-- endregion -->\n                  </div>\n\n                </div>\n                <!-- endregion -->\n\n              </div>\n            </div>\n            <!-- endregion -->\n\n            <!-- region customer address section -->\n            <div class=\"row\">\n\n              <div class=\"col-sm-9 col-sm-offset-2\">\n                <ng-container>\n\n                  <section class=\"form-inline\"\n                    [ngClass]=\"{' billing-addressWrap' : !invFormData.voucherDetails.customerName }\">\n\n                    <div class=\" wrap-billing-address clearfix\">\n\n                      <div class=\"row\">\n                        <!-- region billing address -->\n                        <div class=\"col-sm-6\">\n\n                          <div class=\"form-group\">\n                            <label>Billing Address</label>\n\n                            <div class=\"billing-address clearfix\">\n\n                              <textarea name=\"billingDetails.address\" class=\"form-control\"\n                                (keyup)=\"autoFillShippingDetails()\" rows=\"3\" autocomplete=\"off\"\n                                [(ngModel)]=\"invFormData.accountDetails.billingDetails.address[0]\" autofocus=\"off\"\n                                aria-autocomplete=\"none\"></textarea>\n\n                              <div class=\"\">\n                                <div class=\"col-sm-3 pd mrB1\">\n                                  <label class=\"salesCountryLabel\">\n                                    {{ customerCountryName }}\n                                  </label>\n                                </div>\n\n                                <div class=\"col-sm-5 pd mrB1\">\n                                  <sales-sh-select [placeholder]=\"'State'\" class=\"select-bdr-bottom\"\n                                    (selected)=\"autoFillShippingDetails()\" #statesBilling [showBottomBorderOnly]=\"true\"\n                                    [options]=\"statesSource\" name=\"billingDetails.stateCode\"\n                                    [(ngModel)]=\"invFormData.accountDetails.billingDetails.stateCode\">\n                                  </sales-sh-select>\n                                </div>\n\n                                <div class=\"col-sm-4 pd mrB1\">\n                                  <!-- <label>GSTIN</label> -->\n                                  <input maxLength=\"15\" autocomplete=\"None\" type=\"text\" name=\"billingDetails.gstNumber\"\n                                    class=\"form-control input-custom\"\n                                    [(ngModel)]=\"invFormData.accountDetails.billingDetails.gstNumber\"\n                                    (keyup)=\"getStateCode('billingDetails', statesBilling); autoFillShippingDetails()\"\n                                    placeholder=\"GSTIN\" />\n                                </div>\n                              </div>\n\n                            </div>\n                          </div>\n\n                        </div>\n                        <!-- endregion -->\n\n                        <!-- region shipping address -->\n                        <div class=\"col-sm-6\">\n\n                          <div class=\"form-group p0 width100\">\n                            <label>\n                              <input type=\"checkbox\" autocomplete=\"None\" (change)=\"autoFillShippingDetails()\"\n                                name=\"autoFillShipping\" [(ngModel)]=\"autoFillShipping\"> Shipping Address Same as Billing\n                              Address\n                            </label>\n\n                            <div class=\"billing-address\" [ngClass]=\"{'disabled': autoFillShipping}\">\n\n                              <textarea [readonly]=\"autoFillShipping\" name=\"shippingDetails.address\"\n                                class=\"form-control\" [(ngModel)]=\"invFormData.accountDetails.shippingDetails.address[0]\"\n                                rows=\"3\" autocomplete=\"off\"></textarea>\n\n                              <div class=\"clearfix\">\n\n                                <div class=\"form-group\">\n\n                                  <div class=\"col-sm-3 pd mrB1\">\n                                    <div class=\"form-group\">\n\n                                      <label class=\"salesCountryLabel\">\n                                        {{ customerCountryName }}\n                                      </label>\n                                    </div>\n                                  </div>\n\n                                  <div class=\"col-sm-5 pd mrB1\">\n\n                                    <sales-sh-select [disabled]=\"autoFillShipping\" [placeholder]=\"'State'\"\n                                      class=\"select-bdr-bottom\" #statesShipping [showBottomBorderOnly]=\"true\"\n                                      [options]=\"statesSource\" name=\"shippingDetails.stateCode\"\n                                      [(ngModel)]=\"invFormData.accountDetails.shippingDetails.stateCode\">\n                                    </sales-sh-select>\n                                  </div>\n\n                                  <div class=\"col-sm-4 pd mrB1\">\n\n                                    <input [readonly]=\"autoFillShipping\" autocomplete=\"None\" maxLength=\"15\" type=\"text\"\n                                      name=\"shippingDetails.gstNumber\" class=\"form-control input-custom\"\n                                      [(ngModel)]=\"invFormData.accountDetails.shippingDetails.gstNumber\"\n                                      (keyup)=\"getStateCode('shippingDetails', statesShipping)\" placeholder=\"GSTIN\" />\n                                  </div>\n\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                        <!-- endregion -->\n                      </div>\n\n                    </div>\n\n                  </section>\n                </ng-container>\n              </div>\n            </div>\n            <!-- endregion -->\n          </div>\n\n          <!-- region balance due -->\n          <div class=\"col-sm-3 balanceDueAbs\" *ngIf=\"isSalesInvoice || isProformaInvoice || isEstimateInvoice\">\n\n            <div class=\"text-right\">\n              <p class=\"fs20 b pbR1\">\n                <span\n                  class=\"balance-due\">{{isProformaInvoice || isEstimateInvoice ? 'Total Amount' : 'Balance Due'}}</span>\n                <span class=\"sp-rupees\">Rs {{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</span>\n              </p>\n            </div>\n\n          </div>\n          <!-- endregion -->\n        </div>\n        <!-- endregion -->\n\n        <!-- region attention to, email, mobile, voucher section -->\n        <div class=\"customerInvoiceTable bg-white pdB2 pdT2\">\n          <div class=\"inner-container\">\n\n            <!-- region attention to -->\n            <div class=\"row\">\n\n              <div class=\"col-sm-2\">\n                <label>Attention to</label>\n              </div>\n\n              <div class=\"col-sm-9\">\n                <div class=\" pl0 m-r-15 col-sm-6\">\n\n                  <input type=\"text\" name=\"accountDetails.attention\" placeholder=\"Attention to\"\n                    class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.attentionTo\" />\n                </div>\n              </div>\n\n            </div>\n            <!-- endregion-->\n\n            <!-- region email -->\n            <div class=\"row mTB1\">\n              <div class=\"col-sm-2\">\n                <label>Email Id</label>\n              </div>\n              <div class=\"col-sm-9\">\n                <div class=\"col-sm-6 pl-0\">\n                  <input type=\"email\" placeholder=\"someone@example.com\" name=\"accountDetails.email\"\n                    class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.email\" />\n                </div>\n              </div>\n            </div>\n\n            <!-- endregion-->\n\n            <!-- region mobile no -->\n            <div class=\"row mTB1\">\n\n              <div class=\"col-sm-2\">\n                <label>Mobile Number</label>\n              </div>\n\n              <div class=\"col-sm-9\">\n                <div class=\"col-sm-6 pl-0\">\n                  <input digitsOnlyDirective placeholder=\"9198XXXXXXXX\" type=\"text\" name=\"accountDetails.mobileNumber\"\n                    class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.mobileNumber\" />\n                </div>\n              </div>\n            </div>\n            <!-- endregion-->\n\n            <!-- region invoice no, invoice date, Expiry date -->\n            <div class=\"row mTB1\">\n\n              <div class=\"col-sm-2\">\n                <label> {{ invoiceNoLabel }}</label>\n              </div>\n\n              <div class=\"col-sm-9\">\n\n                <div class=\"col-sm-6 pl-0\">\n                  <input type=\"text\" name=\"accountDetails.invoiceNum\" class=\"form-control invoiceDate attentionTo\"\n                    [ngClass]=\"{'dateinvoice': !isPurchaseInvoice }\" [disabled]=\"isUpdateMode\"\n                    [(ngModel)]=\"invFormData.voucherDetails.voucherNumber\" />\n                </div>\n\n                <div class=\"col-sm-6 invoiceDateDueDate\">\n                  <div class=\"form-inline\">\n\n                    <div class=\"form-group\">\n                      <label>{{ invoiceDateLabel }}</label>\n\n                      <input type=\"text\" [placeholder]=\"giddhDateFormat\" #voucherDate=\"ngModel\" name=\"voucherDate\"\n                        class=\"form-control dateinvoice\" bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                        [(ngModel)]=\"invFormData.voucherDetails.voucherDate\" [disabled]=\"isUpdateMode\"\n                        [class.invalid-inp]=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\" />\n                      <p class=\"text-danger\" *ngIf=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\">\n                        Invalid Date\n                      </p>\n\n                    </div>\n\n                    <div class=\"form-group m-l-10\"\n                      *ngIf=\"isSalesInvoice || isPurchaseInvoice || isProformaInvoice || isEstimateInvoice\">\n                      <label>{{ invoiceDueDateLabel }}</label>\n\n                      <input type=\"text\" [placeholder]=\"giddhDateFormat\" #dueDate=\"ngModel\" name=\"dueDate\"\n                        class=\"form-control dateinvoice\" bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                        [(ngModel)]=\"invFormData.voucherDetails.dueDate\"\n                        [class.invalid-inp]=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\" />\n                      <p class=\"text-danger\" *ngIf=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\">Invalid\n                        Date</p>\n\n                    </div>\n\n                  </div>\n                </div>\n\n              </div>\n\n            </div>\n            <!-- endregion -->\n\n          </div>\n        </div>\n        <!-- endregion -->\n\n      </div>\n    </div>\n\n    <!-- region search_customer image -->\n    <ng-container *ngIf=\"isSalesInvoice || isPurchaseInvoice || !isCashInvoice\">\n      <img src=\"assets/images/new/search_customer.svg\" class=\"img-responsive tip_img \"\n        *ngIf=\"!invFormData.voucherDetails.customerName\" />\n    </ng-container>\n    <ng-container *ngIf=\"isCashInvoice\">\n      <img src=\"assets/images/new/search_customer_Cash Invoice.svg\" class=\"img-responsive  cashinvoice_tipImg tip_img \"\n        *ngIf=\"!invFormData.voucherDetails.customerName\" />\n    </ng-container>\n    <!-- endregion -->\n\n    <!-- region entries table -->\n    <ng-container>\n\n      <!-- region normal view -->\n      <section class=\"staticInvoiceTable salseInvoicetable clearfix mrB2 whiteBg container-fluid ng-tns-c8-0\"\n        *ngIf=\"!isMobileView\">\n\n        <table class=\"table table-custom-invoice  basic\">\n          <thead>\n\n            <tr>\n\n              <th *ngFor=\"let item of theadArrReadOnly;\" [hidden]=\"!item.display\">\n                {{item.label}}\n              </th>\n\n            </tr>\n          </thead>\n\n          <tbody *ngFor=\"let entry of invFormData.entries; let entryIdx = index; let first = first; let last = last\"\n            (clickOutside)=\"activeIndx = null\" [exclude]=\"'.entriesTr'\">\n\n            <ng-container *ngFor=\"let transaction of entry.transactions;\">\n\n              <!-- region static entries-->\n              <tr (click)=\"setActiveIndx(entryIdx);$event.stopPropagation()\" [hidden]=\"activeIndx === entryIdx\"\n                class=\"entriesTr\">\n\n                <td>{{ entryIdx + 1 }}</td>\n\n                <td>\n                  <div class=\"productName\">\n                    <label *ngIf=\"!transaction.accountName\" class=\"selectAccountLabel\">Click to Select\n                      Account</label> {{transaction.accountName}}\n                    <span *ngIf=\"transaction.stockDetails?.uniqueName\">({{transaction.stockDetails?.name}})</span>\n\n                  </div>\n\n                  <div class=\"skuNumber\">\n                    <label>SKU:</label>Number\n                  </div>\n\n                  <div class=\"discription\">\n                    {{transaction.description}}\n\n                  </div>\n                  <p class=\"small text-muted sku_and_customfields\" *ngIf=\"transaction.sku_and_customfields\">\n                    {{transaction.sku_and_customfields}}</p>\n                  <div class=\"dateHsnCode\">\n\n                    <div class=\"row\">\n\n                      <div class=\"col-xs-6\" *ngIf=\"entry.entryDate\">\n                        <div class=\"entryDate\">\n                          <label>Entry Date: </label> {{entry.entryDate | date: 'dd-MM-yyyy'}}\n                          <span class=\"edit-icon cp\" *ngIf=\"!isUpdateMode\">\n                            <img src=\"assets/images/edit-pencilicon.svg\">\n                          </span>\n\n                        </div>\n                      </div>\n\n                      <div class=\"col-xs-6\" *ngIf=\"transaction.hsnNumber\">\n                        <div class=\"hsnCode text-right\">\n                          <label>HSN/SAC:</label>\n                          <span>\n                            {{transaction.hsnNumber}}\n                            <span class=\"edit-icon cp\">\n                              <img src=\"assets/images/edit-pencilicon.svg\">\n                            </span>\n                          </span>\n                        </div>\n                      </div>\n\n                    </div>\n                  </div>\n\n                </td>\n                <td class=\"text-right\">\n                  {{transaction.quantity}} {{transaction.stockUnit}}\n                </td>\n                <td class=\"text-right\">\n                  {{transaction.rate | number:'1.2-2'}}\n                </td>\n                <td class=\"text-right\">\n                  {{transaction.amount | number:'1.2-2'}}\n                </td>\n                <td>\n                  <div class=\" text-right\">\n                    {{ entry.discountSum | number:'1.2-2'}}\n                  </div>\n                </td>\n                <td class=\"text-right\">{{(entry.taxSum + entry.cessSum) | number:'1.2-2'}}</td>\n                <td class=\"text-right\">\n                  <div style=\"display: flex;flex-direction: column;\">\n                    <span>{{transaction.total | number:'1.2-2'}}</span>\n                    <span *ngIf=\"entry.isOtherTaxApplicable\">\n                      {{ entry.otherTaxModal?.appliedOtherTax?.name }} : {{ entry.otherTaxSum }}\n                    </span>\n                  </div>\n                </td>\n                <td class=\"text-center\" style=\"width:3%;\">\n\n                  <span class=\"cp\" (click)=\"removeTransaction(entryIdx)\"\n                    *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                    <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n                  </span>\n                </td>\n              </tr>\n\n              <!-- endregion -->\n\n              <!-- region dynamic entries-->\n              <tr [hidden]=\"activeIndx !== entryIdx\" class=\"entriesTr\" (click)=\"$event.stopPropagation();\">\n                <td>{{ entryIdx + 1 }}</td>\n                <td>\n\n                  <div class=\"productName\">\n                    <div class=\"ng-select-wrap\">\n                      <sh-select [options]=\"salesAccounts$ | async\" [(ngModel)]=\"transaction.fakeAccForSelect2\"\n                        name=\"transaction.fakeAccForSelect2_{{entryIdx}}\"\n                        (selected)=\"onSelectSalesAccount($event,transaction, entry)\" [placeholder]=\"'Select A/cc'\"\n                        [notFoundLink]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                        (noResultsClicked)=\"onNoResultsClicked(entryIdx)\" [multiple]=\"false\" [ItemHeight]=\"67\"\n                        (onClear)=\"onClearSalesAccount(transaction)\" [useInBuiltFilterForFlattenAc]=\"true\">\n\n                        <ng-template #optionTemplate let-option=\"option\">\n                          <ng-container *ngIf=\"!option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                            </a>\n                          </ng-container>\n                          <ng-container *ngIf=\"option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                              <div class=\"item_stock\">Stock: {{ option.additional?.stock.uniqueName }}</div>\n                            </a>\n                          </ng-container>\n                        </ng-template>\n                      </sh-select>\n                    </div>\n                  </div>\n\n                  <div class=\"\" *ngIf=\"transaction.fakeAccForSelect2\">\n                    <div class=\"skuNumber\">\n                      <label>SKU:</label>Number\n                    </div>\n\n                    <div class=\"discription\">\n                      <textarea type=\"text\" placeholder=\"Add Description\" name=\"transaction.description_{{entryIdx}}\"\n                        class=\"form-control\" [(ngModel)]=\"transaction.description\">\n                  </textarea>\n                      <p class=\"small text-muted sku_and_customfields\" *ngIf=\"transaction.sku_and_customfields\">\n                        {{transaction.sku_and_customfields}}</p>\n                    </div>\n\n                    <!-- region entry date/ hsncode -->\n                    <div class=\"dateHsnCode\">\n\n                      <div class=\"row\">\n                        <div class=\"col-xs-6\">\n                          <div class=\"entryDate\">\n                            <label>Entry Date: </label>\n\n                            <span *ngIf=\"!isUpdateMode\">\n                              <input type=\"text\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                                name=\"transaction.date_{{entryIdx}}\" class=\"form-control text-left\"\n                                [(ngModel)]=\"entry.entryDate\" [disabled]=\"isUpdateMode\"\n                                [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" #dp=\"bsDatepicker\" />\n                              <span class=\"edit-icon cp\" (click)=\"dp.toggle()\" [attr.aria-expanded]=\"dp.isOpen\">\n                                <img src=\"assets/images/edit-pencilicon.svg\">\n                              </span>\n                            </span>\n\n                            <span *ngIf=\"isUpdateMode\">\n                              {{ entry.entryDate | date: 'dd-MM-yyyy'}}\n                            </span>\n\n                          </div>\n                        </div>\n\n                        <div class=\"col-xs-6\">\n                          <div class=\"wrap-hsnBox\">\n                            <div class=\"hsnCode text-right\" (click)=\"hsnDropdownShow=!hsnDropdownShow\">\n                              <label>HSN/SAC:</label>\n                              <span>\n                                {{transaction.hsnNumber }}\n                                <span *ngIf=\"!transaction.hsnNumber\" class=\"updateText\">Update\n                                </span>\n                                <span class=\"edit-icon cp\">\n                                  <img src=\"assets/images/edit-pencilicon.svg\">\n                                </span>\n                              </span>\n                            </div>\n\n\n                            <div class=\"hsnCodeDropdown\" *ngIf=\"hsnDropdownShow\">\n                              <label>HSN/SAC</label>\n                              <input type=\"text\" maxLength=\"10\" placeholder=\"HSN/SAC Number\"\n                                name=\"transaction.hsnNumber_{{entryIdx}}\" class=\"\"\n                                [(ngModel)]=\"transaction.hsnNumber\" /> <a>\n                                <!--                            <i class=\"fa fa-search\"></i> -->\n                              </a>\n                              <div class=\"btngroup m-t-10\">\n                                <button class=\"btn btn-sm btn-success\" type=\"button\"\n                                  (click)=\"hsnDropdownShow=!hsnDropdownShow\">Save\n                                </button>\n                                <button class=\"btn btn-sm btn-primary\" type=\"button\"\n                                  (click)=\"hsnDropdownShow=!hsnDropdownShow\">Cancel\n                                </button>\n                              </div>\n\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n\n                    </div>\n                    <!-- endregion -->\n                  </div>\n                </td>\n\n                <td class=\"text-right\">\n                  <input type=\"text\" [disabled]=\"!transaction.isStockTxn\"\n                    (blur)=\"calculateStockEntryAmount(transaction); calculateWhenTrxAltered(entry, transaction);\"\n                    placeholder=\"Quantity\" decimalDigitsDirective name=\"transaction.quantity_{{entryIdx}}\"\n                    class=\"form-control text-right\" [(ngModel)]=\"transaction.quantity\" />\n\n                  <select class=\"form-control\" [disabled]=\"!transaction.isStockTxn\"\n                    name=\"transaction.stockUnit_{{entryIdx}}\" [(ngModel)]=\"transaction.stockUnit\"\n                    (ngModelChange)=\"onChangeUnit(transaction, $event);transaction.setAmount(entry)\">\n                    <option *ngFor=\"let stock of transaction.stockList\" [ngValue]=\"stock.id\">{{stock.text}}\n                    </option>\n                  </select>\n                </td>\n\n                <td class=\"text-right\">\n                  <input type=\"text\" [disabled]=\"!transaction.isStockTxn\"\n                    (blur)=\"calculateStockEntryAmount(transaction);calculateWhenTrxAltered(entry, transaction)\"\n                    placeholder=\"Rate\" decimalDigitsDirective name=\"transaction.rate_{{entryIdx}}\"\n                    class=\"form-control transaction-rate text-right\" [(ngModel)]=\"transaction.rate\" />\n\n                </td>\n\n                <td class=\"text-right\">\n                  <input type=\"text\" [disabled]=\"transaction.isStockTxn\"\n                    (blur)=\"calculateWhenTrxAltered(entry, transaction)\" placeholder=\"Amount\"\n                    name=\"transaction.amount_{{entryIdx}}\" class=\"form-control text-right\"\n                    [(ngModel)]=\"transaction.amount\" decimalDigitsDirective />\n                </td>\n\n                <td>\n                  <div class=\"text-right\">\n\n                    <discount-control-component #discountComponent [discountMenu]=\"false\"\n                      [discountAccountsDetails]=\"entry.discounts\" [discountSum]=\"entry.discountSum\"\n                      [showHeaderText]=\"false\" (hideOtherPopups)=\"closeTaxControlPopup()\"\n                      (discountTotalUpdated)=\"calculateWhenTrxAltered(entry, transaction)\">\n                    </discount-control-component>\n\n                  </div>\n                </td>\n\n                <td class=\"pos-rel dropdown-container\">\n\n                  <tax-control [taxes]=\"companyTaxesList\" [date]=\"entry.entryDate\" [taxRenderData]=\"entry.taxes\"\n                    [totalForTax]=\"transaction.taxableValue\" [applicableTaxes]=\"transaction.applicableTaxes\"\n                    [exceptTaxTypes]=\"exceptTaxTypes\"\n                    [allowedSelectionOfAType]=\"[{ type: ['GST', 'commongst', 'InputGST'], count:1 }]\"\n                    [showHeading]=\"false\" [rootClass]=\"'salseInvoicetable'\"\n                    (taxAmountSumEvent)=\"calculateWhenTrxAltered(entry, transaction)\"\n                    (hideOtherPopups)=\"closeDiscountPopup()\"></tax-control>\n                </td>\n                <td class=\"text-right\">\n\n                  <input type=\"text\" name=\"transaction.total_{{entryIdx}}\" class=\"form-control text-right\"\n                    [(ngModel)]=\"transaction.total\" readonly decimalDigitsDirective [DecimalPlaces]=\"2\" />\n\n                  <div class=\"wrap-otherTax\">\n                    <input type=\"checkbox\" class=\"other-taxes-checkobx\" [(ngModel)]=\"entry.isOtherTaxApplicable\"\n                      *ngIf=\"!entry.isOtherTaxApplicable\" name=\"entry.isOtherTaxApplicable_{{entryIdx}}\"\n                      id=\"entry.isOtherTaxApplicable_{{entryIdx}}\"\n                      (ngModelChange)=\"toggleOtherTaxesAsidePane(entry.isOtherTaxApplicable, entryIdx)\">\n                    <label for=\"entry.isOtherTaxApplicable_{{entryIdx}}\" *ngIf=\"!entry.isOtherTaxApplicable\"\n                      class=\"otherTaxLable\" style=\"font-size:13px;vertical-align: middle\">Other Tax?</label>\n                  </div>\n                  <div *ngIf=\"entry.isOtherTaxApplicable\" class=\"mrT1\">\n\n                    <span>\n\n                      <div style=\"display: flex;align-items: center\">\n                        <span style=\"margin-right: 5px\">\n                          <a href=\"javascript: void 0\" (click)=\"toggleOtherTaxesAsidePane(true, entryIdx)\">\n                            <img src=\"assets/images/edit-pencilicon.svg\">\n                          </a>\n                        </span>\n\n                        <input class=\"text-right otherTaxsinput\" disabled=\"disabled\" [(ngModel)]=\"entry.otherTaxSum\"\n                          name=\"entry.otherTaxesSum\" />\n                      </div>\n\n                      <p style=\"margin-top: 5px; font-size: 12px; text-transform: capitalize;\">\n                        {{ entry.otherTaxModal?.appliedOtherTax?.name}}</p>\n                    </span>\n\n                  </div>\n\n                  <ng-container *ngTemplateOutlet=\"otherTaxesModal;context: {$implicit: entry }\"></ng-container>\n                </td>\n                <td class=\"action-panel-td text-center\" style=\"width:3%;\">\n\n                  <span class=\"cp\" (click)=\"removeTransaction(entryIdx)\"\n                    *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                    <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n                  </span>\n                </td>\n              </tr>\n              <!-- endregion -->\n\n            </ng-container>\n\n          </tbody>\n\n          <!-- region add bulk items -->\n          <div class=\"p-4 aquaColor add-line-bulk-item\" style=\"width: max-content;\">\n            <a class=\"\" href=\"javascript:void 0\" (click)=\"addBlankRow(null)\">+ Add New Line</a>\n            <span style=\"font-size:14px; color: #c5c5c5;\"> | </span>\n            <a class=\"\" (click)=\"showBulkItemModal = true; bulkItemsModal.show()\" href=\"javascript:void 0\">+ Add\n              Bulk\n              Entries</a>\n          </div>\n          <!-- endregion -->\n\n          <tfoot>\n\n            <tr>\n\n              <td colspan=\"4\">\n\n                <!-- region other details-->\n                <div class=\"\">\n\n                  <div class=\"collapse-pane clearfix\">\n\n                    <div class=\"collapse-pane-heading\" (click)=\"isOthrDtlCollapsed = !isOthrDtlCollapsed\">\n\n                      <div class=\"ico-box-wrap\">\n                        <div class=\"ico-box\">\n                          <span [ngClass]=\"isOthrDtlCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                        </div>\n                      </div>\n\n                      <div class=\"ico-head\">Other Details</div>\n                    </div>\n\n                    <div [collapse]=\"isOthrDtlCollapsed\" class=\"clearfix max-600 pdL3 mr0\">\n\n                      <div class=\"row\">\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" #shippingDate=\"ngModel\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                            name=\"shippingDate\" [(ngModel)]=\"invFormData.templateDetails.other.shippingDate\"\n                            class=\"form-control\" [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                            placeholder=\"Ship Date\"\n                            [class.invalid-inp]=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\" />\n                          <p class=\"text-danger\"\n                            *ngIf=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\">Invalid\n                            Date</p>\n                        </div>\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" name=\"shippedVia\"\n                            [(ngModel)]=\"invFormData.templateDetails.other.shippedVia\" class=\"form-control\"\n                            placeholder=\"Ship Via\" />\n                        </div>\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" name=\"trackingNumber\"\n                            [(ngModel)]=\"invFormData.templateDetails.other.trackingNumber\" class=\"form-control\"\n                            placeholder=\"Tracking No.\" />\n                        </div>\n\n                      </div>\n\n                      <div class=\"row\">\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" name=\"customField1\"\n                            [(ngModel)]=\"invFormData.templateDetails.other.customField1\" class=\"form-control\"\n                            placeholder=\"Field 1\" />\n                        </div>\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" name=\"customField2\"\n                            [(ngModel)]=\"invFormData.templateDetails.other.customField2\" class=\"form-control\"\n                            placeholder=\"Field 2\" />\n                        </div>\n\n                        <div class=\"form-group col-xs-4\">\n                          <input type=\"text\" name=\"customField3\"\n                            [(ngModel)]=\"invFormData.templateDetails.other.customField3\" class=\"form-control\"\n                            placeholder=\"Field 3\" />\n                        </div>\n\n                      </div>\n\n                    </div>\n\n                  </div>\n                </div>\n                <!-- endregion -->\n\n                <!-- region note/messages -->\n                <div class=\"pdT1 pl0 max-600\" *ngIf=\"!isPurchaseInvoice\">\n\n                  <label class=\"mrB1\">Note</label>\n                  <textarea style=\"height:120px !important\" class=\"form-control\" name=\"message2\"\n                    [(ngModel)]=\"invFormData.templateDetails.other.message2\">\n                </textarea>\n                </div>\n                <!-- endregion -->\n\n                <!-- region attachment -->\n                <div class=\"pdT1 pl0 max-600 pos-rel\" *ngIf=\"isPurchaseInvoice\">\n\n                  <label class=\"mrB1\"><i class=\"glyphicon glyphicon-paperclip\"></i> Attachment</label>\n\n                  <label class=\"custom-file-label form-control cp pos-rel\" for=\"invoiceFile\">\n                    <em *ngIf=\"!selectedFileName\">Drag/Drop file or click here</em>\n                    <em *ngIf=\"selectedFileName\" class=\"text-success\">{{selectedFileName}}</em>\n                    <span class=\"text-success\"><i class=\"fa fa-check\" *ngIf=\"selectedFileName\"></i></span>\n                    <input type=\"file\" name=\"invoiceFile\" id=\"invoiceFile\" [options]=\"fileUploadOptions\" ngFileSelect\n                      [uploadInput]=\"uploadInput\" (uploadOutput)=\"onUploadOutput($event)\"\n                      (change)=\"onFileChange($event.target)\" droppable=\"true\">\n                  </label>\n\n                </div>\n                <!-- endregion -->\n\n              </td>\n              <!-- region total section -->\n              <td colspan=\"4\">\n\n                <section class=\"tableSec form-group\">\n\n                  <div class=\"tableRow\">\n                    <div class=\"tableCell\">Total Amount</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.subTotal | number:'1.2-2'}}</div>\n                  </div>\n\n                  <div class=\"tableRow\">\n                    <div class=\"tableCell\">Discount</div>\n                    <div class=\"tableCell figureCell\">\n                      -{{invFormData.voucherDetails.totalDiscount | number:'1.2-2'}}</div>\n                  </div>\n\n                  <div class=\"tableRow\">\n                    <div class=\"tableCell\">Taxable Value</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.totalTaxableValue | number:'1.2-2'}}\n                    </div>\n                  </div>\n\n                  <div class=\"tableRow\">\n                    <div class=\"tableCell\">Tax</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.gstTaxesTotal | number:'1.2-2'}}\n                    </div>\n                  </div>\n\n                  <div class=\"tableRow\">\n                    <div class=\"tableCell\">CESS</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.cessTotal | number:'1.2-2'}}\n                    </div>\n                  </div>\n                  <div class=\"tableRow\" *ngIf=\"calculatedRoundOff > 0 || calculatedRoundOff < 0\">\n\n                    <div class=\"tableCell\">\n                      Round Off\n                      <!-- {{invFormData.voucherDetails.roundOff && invFormData.voucherDetails.roundOff.balanceType && invFormData.voucherDetails.roundOff.balanceType === 'CREDIT' ? '(-)' : '(+)'}} -->\n                    </div>\n\n                    <div class=\"tableCell figureCell\">\n                      {{calculatedRoundOff | number:'1.2-2'}}\n                    </div>\n\n                  </div>\n\n                  <div class=\"tableRow\">\n\n                    <div class=\"tableCell\">\n                      <strong>Total</strong>\n                    </div>\n\n                    <div class=\"tableCell figureCell\">\n                      <strong>{{invFormData.voucherDetails.grandTotal | number:'1.2-2'}}</strong>\n                    </div>\n\n                  </div>\n\n                  <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tcsTotal > 0\">\n                    <div class=\"tableCell\">TCS</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.tcsTotal | number:'1.2-2'}}</div>\n                  </div>\n\n                  <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tdsTotal > 0\">\n                    <div class=\"tableCell\">TDS</div>\n                    <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.tdsTotal | number:'1.2-2'}}</div>\n                  </div>\n\n                  <!--region balance due for non-purchase-->\n                  <div class=\"tableRow\" *ngIf=\"isSalesInvoice || isCashInvoice\">\n\n                    <div class=\"tableCell depositeSection\">\n\n                      <div class=\"btn-group\">\n\n                        <div (click)=\"clickedInside($event)\" id=\"deposit-dropdown\" class=\"form-group pd1\">\n                          <p>Deposit</p>\n                          <ul>\n                            <!--                          <li role=\"menuitem\">-->\n                            <li role=\"menuitem\" class=\"mrT1 \">\n                              <div class=\"clearfix paymentMode\">\n\n                                <sh-select class=\"pull-right \" name=\"depositAccountUniqueName\"\n                                  [options]=\"bankAccounts$ | async\" [(ngModel)]=\"depositAccountUniqueName\"\n                                  (selected)=\"onSelectPaymentMode($event)\" [placeholder]=\"'Select Account'\"\n                                  [notFoundLink]=\"false\" [forceClearReactive]=\"forceClear$ | async\" [multiple]=\"false\"\n                                  [ItemHeight]=\"33\" [useInBuiltFilterForIOptionTypeItems]=\"true\" class=\"text-left\">\n                                  <ng-template #optionTemplate1 let-option=\"option\">\n                                    <a href=\"javascript:void(0)\" class=\"list-item\"\n                                      style=\"border-bottom: 1px solid #ccc;\">\n                                      <div class=\"item\">{{ option.label }}</div>\n                                      <div class=\"item_unq\">{{ option.value }}</div>\n                                    </a>\n                                  </ng-template>\n                                </sh-select>\n                                <label class=\"pull-right\">Payment Mode</label>\n                              </div>\n                            </li>\n\n                            <li class=\"clearfix mrT1\" *ngIf=\"isSalesInvoice\">\n                              <input type=\"text\" (blur)=\"calculateBalanceDue()\" placeholder=\"Amount\" name=\"dueAmount\"\n                                class=\"form-control amountField pull-right max100\" decimalDigitsDirective\n                                [(ngModel)]=\"depositAmount\" />\n                              <label class=\"pull-right\">Amount</label>\n                            </li>\n\n                            <li class=\"clearfix mrT1\" *ngIf=\"isCashInvoice\">\n                              <span class=\"amountField pull-right max100 amountFiledCash\">\n                                {{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</span>\n                              <label class=\"pull-right\">Amount</label>\n                            </li>\n\n                            <li class=\"clearfix mrT1\" *ngIf=\"isSalesInvoice\">\n                              <strong\n                                class=\"pull-right balanceDueText\">{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</strong>\n                              <strong class=\"pull-right\">Balance Due</strong>\n                            </li>\n\n                          </ul>\n                        </div>\n\n                      </div>\n                    </div>\n\n                    <!--                  <div class=\"tableCell figureCell\">-->\n                    <!--                    {{depositAmount | number:'1.2-2'}}-->\n                    <!--                  </div>-->\n                  </div>\n                  <!--endregion-->\n\n                  <!-- region balance due for purchase -->\n                  <div class=\"tableRow\" *ngIf=\"isPurchaseInvoice\">\n                    <div class=\"tableCell\">\n                      <strong>Balance Due</strong>\n                    </div>\n                    <div class=\"tableCell figureCell\">\n                      <strong>{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</strong>\n                    </div>\n                  </div>\n                  <!-- endregion -->\n\n\n                </section>\n              </td>\n              <!-- endregion -->\n\n              <td></td>\n\n            </tr>\n          </tfoot>\n\n        </table>\n\n      </section>\n      <!-- endregion -->\n\n      <!-- region mobile view  -->\n      <div class=\"showInMobile\" *ngIf=\"isMobileView\">\n\n        <div class=\"card-invoiceTable-wrapper\"\n          *ngFor=\"let entry of invFormData.entries; let entryIdx = index; let first = first; let last = last\">\n\n          <ng-container *ngFor=\"let transaction of entry.transactions;\">\n            <!-- region static entry -->\n            <div class=\"card-invoiceTable\" [hidden]=\"activeIndx === entryIdx\">\n              <div class=\"row\">\n\n                <div class=\"col-xs-12\">\n\n                  <div class=\"single-card-row\">\n\n                    <div class=\"productName\">\n                      <label class=\"card-label\">Product/Service Description</label>\n                      <label *ngIf=\"!transaction.accountName\" class=\"selectAccountLabel\">Click to Select\n                        Account</label>\n                      <p>{{transaction.accountName}}</p>\n                      <span *ngIf=\"transaction.stockDetails?.uniqueName\">({{transaction.stockDetails?.name}})</span>\n                    </div>\n\n                    <p class=\"discription\">\n                      {{transaction.description}}\n                    </p>\n                    <p class=\"small text-muted sku_and_customfields\" *ngIf=\"transaction.sku_and_customfields\">\n                      {{transaction.sku_and_customfields}}</p>\n\n                    <div class=\"dateHsnCode\">\n                      <div class=\"row\">\n\n                        <div class=\"col-xs-6\" *ngIf=\"entry.entryDate\">\n                          <div class=\"entryDate\">\n                            <label>Entry Date: {{entry.entryDate | date: 'dd-MM-yyyy'}} </label>\n                          </div>\n                        </div>\n\n                        <div class=\"col-xs-6\" *ngIf=\"transaction.hsnNumber\">\n                          <div class=\"hsnCode text-right\">\n                            <label>HSN/SAC:\n                              {{transaction.hsnNumber}}</label>\n                          </div>\n\n                        </div>\n\n                      </div>\n                    </div>\n\n                  </div>\n\n                </div>\n\n              </div>\n\n              <div class=\"row\">\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"qty-unit\">\n                      <label class=\"card-label\">Qty/Unit</label>\n                      <p>{{transaction.quantity}} {{transaction.stockUnit}}</p>\n                    </div>\n                  </div>\n\n                </div>\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"card-rate\">\n                      <label class=\"card-label\">Rate</label>\n                      <p> {{transaction.rate}}</p>\n                    </div>\n                  </div>\n\n                </div>\n\n              </div>\n\n              <div class=\"row\">\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"card-amount\">\n                      <label class=\"card-label\">Amount</label>\n                      <p> {{transaction.amount | number:'1.2-2'}}</p>\n                    </div>\n                  </div>\n\n                </div>\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"card-discount\">\n                      <label class=\"card-label\">Discount</label>\n                      <p> {{ entry.discountSum }}</p>\n                    </div>\n                  </div>\n\n                </div>\n\n              </div>\n\n              <div class=\"row\">\n\n                <div class=\"col-xs-6\">\n                  <div class=\"single-card-row\">\n                    <div class=\"card-tax\">\n                      <label class=\"card-label\">Tax</label>\n                      <p>{{entry.taxSum}}%</p>\n                    </div>\n                  </div>\n                </div>\n\n                <div class=\"col-xs-6\">\n                  <div class=\"single-card-row\">\n                    <div class=\"card-total\">\n                      <label class=\"card-label\">Total</label>\n                      <p>{{transaction.total | number:'1.2-2'}}</p>\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n\n              <div class=\"edit-card\" (click)=\"activeIndx = entryIdx\">\n                <img src=\"assets/images/edit-pencilicon.svg\">\n              </div>\n\n              <div class=\"del-card\" (click)=\"removeTransaction(entryIdx)\"\n                *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n              </div>\n\n            </div>\n            <!-- endregion -->\n\n            <!-- region dynamic entry -->\n            <div class=\"card-invoiceTable edit-card-invoiceTable\" [hidden]=\"activeIndx !== entryIdx\">\n              <div class=\"row\">\n                <div class=\"col-xs-12\">\n                  <div class=\"single-card-row\">\n                    <div class=\"productName\">\n                      <label class=\"card-label\">Product/Service Description</label>\n                      <div class=\"ng-select-wrap\">\n                        <sh-select [options]=\"salesAccounts$ | async\" [(ngModel)]=\"transaction.fakeAccForSelect2\"\n                          name=\"transaction.fakeAccForSelect2_{{entryIdx}}\"\n                          (selected)=\"onSelectSalesAccount($event,transaction, entry)\" [placeholder]=\"'Select A/cc'\"\n                          [notFoundLink]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                          (noResultsClicked)=\"onNoResultsClicked(entryIdx)\" [multiple]=\"false\" [ItemHeight]=\"67\"\n                          [useInBuiltFilterForFlattenAc]=\"true\">\n\n                          <ng-template #optionTemplate let-option=\"option\">\n                            <ng-container *ngIf=\"!option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                              </a>\n                            </ng-container>\n                            <ng-container *ngIf=\"option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                                <div class=\"item_stock\">Stock: {{ option.additional?.stock.uniqueName }}</div>\n                              </a>\n                            </ng-container>\n                          </ng-template>\n                        </sh-select>\n                      </div>\n                      <div class=\"\" *ngIf=\"transaction.fakeAccForSelect2\">\n                        <div class=\"skuNumber\">\n                          <label>SKU:</label>Number\n                        </div>\n                        <div class=\"discription\">\n                          <textarea type=\"text\" placeholder=\"Add Description\"\n                            name=\"transaction.description_{{entryIdx}}\" class=\"form-control\"\n                            [(ngModel)]=\"transaction.description\"></textarea>\n                          <p class=\"small text-muted sku_and_customfields\" *ngIf=\"transaction.sku_and_customfields\">\n                            {{transaction.sku_and_customfields}}</p>\n                        </div>\n\n                        <!-- region entry date/ hsncode -->\n                        <div class=\"dateHsnCode\">\n                          <div class=\"row\">\n                            <div class=\"col-xs-6\">\n                              <div class=\"entryDate\">\n                                <label>Entry Date: </label>\n                                <span>\n                                  <input type=\"text\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                                    name=\"transaction.date_{{entryIdx}}\" [disabled]=\"isUpdateMode\"\n                                    class=\"form-control text-left\" [(ngModel)]=\"entry.entryDate\"\n                                    [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" #dp=\"bsDatepicker\" />\n                                  <span class=\"edit-icon cp\" (click)=\"dp.toggle()\" *ngIf=\"!isUpdateMode\"\n                                    [attr.aria-expanded]=\"dp.isOpen\">\n                                    <img src=\"assets/images/edit-pencilicon.svg\">\n                                  </span>\n                                </span>\n                              </div>\n                            </div>\n                            <div class=\"col-xs-6\">\n                              <div class=\"wrap-hsnBox\">\n                                <div class=\"hsnCode text-right\" (click)=\"hsnDropdownShow=!hsnDropdownShow\">\n                                  <label>HSN/SAC:</label>\n                                  <span>\n                                    <!-- <input type=\"text\" [hidden]=\"transaction.hsnOrSac !== 'hsn'\" maxLength=\"10\" placeholder=\"HSN Number\"\n                                        name=\"transaction.hsnNumber_{{entryIdx}}\" class=\"form-control text-right\"\n                                        [(ngModel)]=\"transaction.hsnNumber\"/> -->\n                                    {{transaction.hsnNumber }} <span *ngIf=\"!transaction.hsnNumber\"\n                                      class=\"updateText\">Update</span>\n                                    <span class=\"edit-icon cp\">\n                                      <img src=\"assets/images/edit-pencilicon.svg\">\n                                    </span>\n                                  </span>\n\n                                </div>\n\n\n                                <div class=\"hsnCodeDropdown\" *ngIf=\"hsnDropdownShow\">\n                                  <label>HSN/SAC</label>\n                                  <input type=\"text\" maxLength=\"10\" placeholder=\"HSN Number\"\n                                    name=\"transaction.hsnNumber_{{entryIdx}}\" class=\"\"\n                                    [(ngModel)]=\"transaction.hsnNumber\" /> <a><i class=\"fa fa-search\"></i> </a>\n                                  <div class=\"btn-group\">\n                                    <button class=\"btn btn-sm btn-success\" type=\"button\"\n                                      (click)=\"hsnDropdownShow=!hsnDropdownShow\">Save\n                                    </button>\n                                    <button class=\"btn btn-sm btn-primary\" type=\"button\"\n                                      (click)=\"hsnDropdownShow=!hsnDropdownShow\">Cancel\n                                    </button>\n                                  </div>\n\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                        <!-- endregion -->\n\n                      </div>\n\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"row\">\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"qty-unit\">\n\n                      <div class=\"row\">\n\n                        <div class=\"col-xs-6\" style=\"padding-right:0;\">\n                          <label class=\"card-label text-right\">Qty</label>\n                          <input type=\"text\" [disabled]=\"!transaction.isStockTxn\" [maxLength]=\"5\"\n                            (blur)=\"calculateStockEntryAmount(transaction); calculateWhenTrxAltered(entry, transaction);\"\n                            placeholder=\"Quantity\" decimalDigitsDirective name=\"transaction.quantity_{{entryIdx}}\"\n                            class=\"form-control text-right\" [(ngModel)]=\"transaction.quantity\" />\n                        </div>\n                        <div class=\"col-xs-6\">\n                          <label class=\"card-label text-right\">Unit</label>\n                          <select class=\"form-control\" [disabled]=\"!transaction.isStockTxn\"\n                            name=\"transaction.stockUnit_{{entryIdx}}\" [(ngModel)]=\"transaction.stockUnit\"\n                            (ngModelChange)=\"onChangeUnit(transaction, $event);transaction.setAmount(entry)\">\n                            <option *ngFor=\"let stock of transaction.stockList\" [ngValue]=\"stock.id\">{{stock.text}}\n                            </option>\n                          </select>\n                        </div>\n                      </div>\n\n                    </div>\n                  </div>\n\n                </div>\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n\n                    <div class=\"card-rate\">\n                      <label class=\"card-label text-right\">Rate</label>\n                      <input type=\"text\" [disabled]=\"!transaction.isStockTxn\"\n                        (blur)=\"calculateStockEntryAmount(transaction);calculateWhenTrxAltered(entry, transaction)\"\n                        placeholder=\"Rate\" decimalDigitsDirective name=\"transaction.rate_{{entryIdx}}\"\n                        class=\"form-control transaction-rate text-right\" [(ngModel)]=\"transaction.rate\" />\n                    </div>\n\n                  </div>\n\n                </div>\n              </div>\n\n              <div class=\"row\">\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n\n                    <div class=\"card-amount\">\n\n                      <label class=\"card-label text-right\">Amount</label>\n                      <input type=\"text\" [disabled]=\"transaction.isStockTxn\"\n                        (blur)=\"calculateWhenTrxAltered(entry, transaction)\" placeholder=\"Amount\"\n                        name=\"transaction.amount_{{entryIdx}}\" class=\"form-control text-right\"\n                        [(ngModel)]=\"transaction.amount\" decimalDigitsDirective />\n                    </div>\n\n                  </div>\n                </div>\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n\n                    <div class=\"card-discount\">\n                      <label class=\"card-label text-right\">Discount</label>\n                      <div class=\"text-right\">\n\n                        <discount-control-component #discountComponent [discountMenu]=\"false\"\n                          [discountAccountsDetails]=\"entry.discounts\" [discountSum]=\"entry.discountSum\"\n                          [showHeaderText]=\"false\" (discountTotalUpdated)=\"calculateWhenTrxAltered(entry, transaction)\">\n                        </discount-control-component>\n\n                      </div>\n                    </div>\n\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"row\">\n\n                <div class=\"col-xs-6\">\n\n                  <div class=\"single-card-row\">\n                    <div class=\"card-tax\">\n                      <label class=\"card-label text-right\">Tax</label>\n\n                      <tax-control [taxes]=\"companyTaxesList\" [date]=\"entry.entryDate\" [taxRenderData]=\"entry.taxes\"\n                        [showHeading]=\"false\" [applicableTaxes]=\"transaction.applicableTaxes\"\n                        [exceptTaxTypes]=\"['tdsrc', 'tdspay','tcspay', 'tcsrc']\"\n                        [allowedSelectionOfAType]=\"[{ type: ['GST', 'commongst', 'InputGST'], count:1 }]\"\n                        [rootClass]=\"'salseInvoicetable'\"\n                        (taxAmountSumEvent)=\"calculateWhenTrxAltered(entry, transaction)\"\n                        (hideOtherPopups)=\"closeDiscountPopup()\"></tax-control>\n\n                    </div>\n                  </div>\n                </div>\n\n                <div class=\"col-xs-6\">\n                  <div class=\"single-card-row\">\n                    <div class=\"card-total\">\n                      <label class=\"card-label text-right\">Total</label>\n                      <input type=\"text\" name=\"transaction.total_{{entryIdx}}\" class=\"form-control text-right\"\n                        [(ngModel)]=\"transaction.total\" readonly decimalDigitsDirective [DecimalPlaces]=\"2\" />\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n\n              <div class=\"saveCard-data\">\n                <i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i>\n              </div>\n\n              <div class=\"del-card\" (click)=\"removeTransaction(entryIdx)\"\n                *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n              </div>\n\n            </div>\n            <!-- endregion -->\n          </ng-container>\n\n        </div>\n\n        <div class=\"add-btn\" (click)=\"addBlankRow(null)\">\n          <button class=\"btn btn-sm btn-success\">Add More</button>\n        </div>\n\n        <div class=\"otherDetail-card\">\n\n          <div class=\"\">\n            <div class=\"collapse-pane clearfix\">\n\n              <div class=\"collapse-pane-heading\" (click)=\"isOthrDtlCollapsed = !isOthrDtlCollapsed\">\n                <div class=\"ico-box-wrap\">\n                  <div class=\"ico-box\">\n                    <span [ngClass]=\"isOthrDtlCollapsed ? 'icon-add' : 'icon-minus'\" aria-hidden=\"true\"></span>\n                  </div>\n                </div>\n                <div class=\"ico-head\">Other Details</div>\n              </div>\n\n              <div [collapse]=\"isOthrDtlCollapsed\" class=\"clearfix max-600  mr0\">\n\n                <div class=\"row\">\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" #shippingDate=\"ngModel\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                      name=\"shippingDate\" [(ngModel)]=\"invFormData.templateDetails.other.shippingDate\"\n                      class=\"form-control\" [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" placeholder=\"Ship Date\"\n                      [class.invalid-inp]=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\" />\n                    <p class=\"text-danger\" *ngIf=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\">\n                      Invalid Date</p>\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" name=\"shippedVia\" [(ngModel)]=\"invFormData.templateDetails.other.shippedVia\"\n                      class=\"form-control\" placeholder=\"Ship Via\" />\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" name=\"trackingNumber\"\n                      [(ngModel)]=\"invFormData.templateDetails.other.trackingNumber\" class=\"form-control\"\n                      placeholder=\"Tracking No.\" />\n                  </div>\n\n                </div>\n\n                <div class=\"row\">\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" name=\"customField1\" [(ngModel)]=\"invFormData.templateDetails.other.customField1\"\n                      class=\"form-control\" placeholder=\"Field 1\" />\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" name=\"customField2\" [(ngModel)]=\"invFormData.templateDetails.other.customField2\"\n                      class=\"form-control\" placeholder=\"Field 2\" />\n                  </div>\n\n                  <div class=\"form-group col-xs-4\">\n                    <input type=\"text\" name=\"customField3\" [(ngModel)]=\"invFormData.templateDetails.other.customField3\"\n                      class=\"form-control\" placeholder=\"Field 3\" />\n                  </div>\n\n                </div>\n\n              </div>\n\n            </div>\n\n            <div class=\"pdT1 pl0 max-600\" *ngIf=\"!isPurchaseInvoice\">\n              <label class=\"mrB1\">Message</label>\n              <textarea style=\"height:120px\" class=\"form-control\" name=\"message2\"\n                [(ngModel)]=\"invFormData.templateDetails.other.message2\"></textarea>\n            </div>\n\n          </div>\n        </div>\n\n        <div class=\"total-amountDiscription\">\n\n          <section class=\"tableSec form-group\">\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">Total Amount</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.subTotal | number:'1.2-2'}}</div>\n            </div>\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">Discount</div>\n              <div class=\"tableCell figureCell\">-{{invFormData.voucherDetails.totalDiscount | number:'1.2-2'}}</div>\n            </div>\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">Taxable Value</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.totalTaxableValue | number:'1.2-2'}}\n              </div>\n            </div>\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">Tax</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.gstTaxesTotal | number:'1.2-2'}}</div>\n            </div>\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">CESS</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.cessTotal | number:'1.2-2'}}\n              </div>\n            </div>\n\n            <div class=\"tableRow\">\n              <div class=\"tableCell\">\n                <strong>Total</strong>\n              </div>\n\n              <div class=\"tableCell figureCell\">\n                <strong>{{invFormData.voucherDetails.grandTotal | number:'1.2-2'}}</strong>\n              </div>\n            </div>\n\n            <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tcsTotal > 0\">\n              <div class=\"tableCell\">TCS</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.tcsTotal | number:'1.2-2'}}</div>\n            </div>\n\n            <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tdsTotal > 0\">\n              <div class=\"tableCell\">TDS</div>\n              <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.tdsTotal | number:'1.2-2'}}</div>\n            </div>\n\n            <div class=\"tableRow\" *ngIf=\"toggleFieldForSales && isCustomerSelected && !isPurchaseInvoice\">\n              <div class=\"tableCell\">\n\n                <div class=\"btn-group\">\n                  <button type=\"button\" class=\"btn btn-default dropdown-toggle\"\n                    aria-controls=\"deposit-dropdown_dropdown_mobile\">\n                    Deposit\n                  </button>\n\n                  <ul (click)=\"clickedInside($event)\" id=\"deposit-dropdown_mobile\" *ngIf=\"dropdownisOpen\"\n                    class=\"dropdown-menu form-group pd1\" role=\"menu\" aria-labelledby=\"button-dropup\">\n                    <span class=\"caret\"></span>\n\n                    <li role=\"menuitem\">\n                      <div class=\"\">\n                        <label>Amount</label>\n                        <input type=\"number\" (blur)=\"calculateBalanceDue()\" placeholder=\"Amount\" name=\"dueAmount\"\n                          class=\"form-control max100\" decimalDigitsDirective [(ngModel)]=\"depositAmount\" />\n                      </div>\n                    </li>\n\n                    <li role=\"menuitem\" class=\"mrT1\">\n\n                      <div class=\"\">\n\n                        <label>Payment Mode</label>\n                        <sh-select name=\"depositAccountUniqueName\" [options]=\"bankAccounts$ | async\"\n                          [(ngModel)]=\"depositAccountUniqueName\" (selected)=\"onSelectPaymentMode($event)\"\n                          [placeholder]=\"'Select Account'\" [notFoundLink]=\"false\"\n                          [forceClearReactive]=\"forceClear$ | async\" [multiple]=\"false\" [ItemHeight]=\"33\"\n                          [useInBuiltFilterForIOptionTypeItems]=\"true\" class=\"text-left\">\n                          <ng-template #optionTemplate1 let-option=\"option\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.value }}</div>\n                            </a>\n                          </ng-template>\n                        </sh-select>\n\n                      </div>\n\n                    </li>\n                  </ul>\n\n                </div>\n\n              </div>\n\n              <div class=\"tableCell figureCell\" (click)=\"dropdownisOpen = true\">\n                {{depositAmount | number:'1.2-2'}}\n              </div>\n            </div>\n\n            <div class=\"tableRow\" *ngIf=\"toggleFieldForSales\">\n              <div class=\"tableCell\">\n                <strong>Balance Due</strong>\n              </div>\n              <div class=\"tableCell figureCell\">\n                <strong>{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</strong>\n              </div>\n            </div>\n\n          </section>\n\n        </div>\n      </div>\n      <!-- endregion -->\n\n    </ng-container>\n    <!-- endregion -->\n\n    <!-- region submit actions-->\n    <section class=\"clearfix\">\n\n      <section id=\"actionPane\" class=\"text-center\">\n\n        <div class=\"col-xs-12\">\n\n          <!-- region generate mode -->\n          <div class=\"pull-right pr\" *ngIf=\"!isUpdateMode\">\n            <button type=\"button\" (click)=\"resetInvoiceForm(invoiceForm)\"\n              class=\"btn btn-danger d-inline-block v-align-middle\">Clear\n            </button>\n\n            <!-- region purchase invoice -->\n            <span class=\"d-inline-block v-align-middle\" *ngIf=\"isPurchaseInvoice\">\n              <button type=\"button\" (click)=\"triggerSubmitInvoiceForm(invoiceForm, true)\" class=\"btn btn-default\"\n                *ngIf=\"isCustomerSelected\">Save &amp; Update A/c\n              </button>\n              <button type=\"button\" (click)=\"doAction(0);triggerSubmitInvoiceForm(invoiceForm, false)\"\n                class=\"btn btn-default\">Save\n              </button>\n            </span>\n            <!-- endregion -->\n\n            <!-- region non purchase -->\n            <span class=\"d-inline-block v-align-middle\"\n              *ngIf=\"!isPurchaseInvoice && (!isProformaInvoice  && !isEstimateInvoice)\">\n\n              <button type=\"button\" (click)=\"triggerSubmitInvoiceForm(invoiceForm, true)\" class=\"btn btn-default\"\n                *ngIf=\"isCustomerSelected\" [disabled]=\"invoiceForm.invalid\">Generate {{invoiceType | titlecase}}\n                &amp; Update A/c\n              </button>\n\n              <div class=\"btn-group\" dropdown [dropup]=\"true\">\n\n                <button type=\"button\" (click)=\"doAction(0);triggerSubmitInvoiceForm(invoiceForm, false)\"\n                  class=\"btn btn-default\" [disabled]=\"invoiceForm.invalid\">Generate {{invoiceType | titlecase}}\n                </button>\n\n                <button id=\"button-split\" type=\"button\" dropdownToggle\n                  class=\"btn btn-default dropdown-toggle dropdown-toggle-split\" aria-controls=\"dropdown-split\"\n                  *ngIf=\"invoiceType === 'sales'\" [disabled]=\"invoiceForm.invalid\">\n                  <span class=\"caret\"></span>\n                  <span class=\"sr-only\">Split button!</span>\n                </button>\n\n                <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"\n                  aria-labelledby=\"button-basic\">\n                  <!--                      <li role=\"menuitem\">-->\n                  <!--                          <a class=\"dropdown-item cp\"-->\n                  <!--                             (click)=\"doAction(1);triggerSubmitInvoiceForm(invoiceForm, false)\">Generate & Close</a>-->\n                  <!--                      </li>-->\n\n                  <li role=\"menuitem\">\n                    <a class=\"dropdown-item cp\"\n                      (click)=\"doAction(2);triggerSubmitInvoiceForm(invoiceForm, false)\">Create & Send</a>\n                  </li>\n\n                  <li role=\"menuitem\">\n                    <a class=\"dropdown-item cp\"\n                      (click)=\"doAction(3);triggerSubmitInvoiceForm(invoiceForm, false)\">Create & Print</a>\n                  </li>\n\n                  <li role=\"menuitem\" (click)=\"doAction(4);triggerSubmitInvoiceForm(invoiceForm, false)\">\n                    <a class=\"dropdown-item cp\">Generate & Recurring</a>\n                  </li>\n                </ul>\n              </div>\n            </span>\n            <!-- endregion -->\n\n            <!-- region proforma/estimates -->\n            <span class=\"d-inline-block v-align-middle\" *ngIf=\"isProformaInvoice || isEstimateInvoice\">\n\n              <div class=\"btn-group\" dropdown [dropup]=\"true\">\n\n                <button type=\"button\" (click)=\"doAction(0);triggerSubmitInvoiceForm(invoiceForm, false)\"\n                  class=\"btn btn-default\" [disabled]=\"invoiceForm.invalid\">Create\n                </button>\n\n                <button id=\"button-split2\" type=\"button\" dropdownToggle\n                  class=\"btn btn-default dropdown-toggle dropdown-toggle-split\" aria-controls=\"dropdown-split\"\n                  [disabled]=\"invoiceForm.invalid\">\n                  <span class=\"caret\"></span>\n                  <span class=\"sr-only\">Split button!</span>\n                </button>\n\n                <ul id=\"dropdown-basic2\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"\n                  aria-labelledby=\"button-basic\">\n                  <li role=\"menuitem\">\n                    <a class=\"dropdown-item cp\"\n                      (click)=\"doAction(2);triggerSubmitInvoiceForm(invoiceForm, false)\">Create & Send</a>\n                  </li>\n\n                  <li role=\"menuitem\">\n                    <a class=\"dropdown-item cp\"\n                      (click)=\"doAction(3);triggerSubmitInvoiceForm(invoiceForm, false)\">Create & Print</a>\n                  </li>\n\n                  <!--                      <li role=\"menuitem\">-->\n                  <!--                          <a class=\"dropdown-item cp\"-->\n                  <!--                             (click)=\"doAction(6);triggerSubmitInvoiceForm(invoiceForm, false)\">Save as Draft</a>-->\n                  <!--                      </li>-->\n                </ul>\n              </div>\n            </span>\n            <!-- endregion -->\n\n          </div>\n          <!-- endregion -->\n\n          <!-- region update mode -->\n          <div class=\"pull-right pr\" *ngIf=\"isUpdateMode\">\n\n            <button type=\"button\" class=\"btn btn-danger d-inline-block v-align-middle\" (click)=\"cancelUpdate()\">Cancel\n            </button>\n\n            <button type=\"button\" class=\"btn btn-default\" (click)=\"submitUpdateForm(invoiceForm)\"\n              [disabled]=\"invoiceForm.invalid\">\n              <span>Update {{invoiceType | titlecase}}</span>\n            </button>\n          </div>\n          <!-- endregion -->\n\n        </div>\n      </section>\n    </section>\n    <!-- endregion -->\n\n  </form>\n</div>\n<!-- endregion-->\n\n<!-- region models section -->\n<!-- open account aside -->\n<div class=\"aside-overlay\" *ngIf=\"accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in' ||\n     asideMenuStateForRecurringEntry === 'in' || asideMenuStateForOtherTaxes === 'in'\"></div>\n\n<generic-aside-menu-account [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\"\n  (closeAsideEvent)=\"toggleAccountAsidePane($event)\"\n  [selectedGrpUniqueName]=\"selectedGrpUniqueNameForAddEditAccountModal\"\n  [keyboardShortcut]=\"{'esc':accountAsideMenuState ==='in'}\" *ngIf=\"accountAsideMenuState === 'in'\"\n  [selectedAccountUniqueName]=\"selectedCustomerForDetails\" (onShortcutPress)=\"toggleAccountAsidePane()\"\n  (addEvent)=\"addNewSidebarAccount($event)\" (updateEvent)=\"updateSidebarAccount($event)\"></generic-aside-menu-account>\n\n<!--&lt;!&ndash; open product service aside &ndash;&gt;-->\n<aside-menu-product-service [class]=\"asideMenuStateForProductService\" [@slideInOut]=\"asideMenuStateForProductService\"\n  (closeAsideEvent)=\"onNoResultsClicked()\" (animatePAside)=\"getActionFromAside($event)\"></aside-menu-product-service>\n\n<app-aside-recurring-entry [voucherType]=\"invoiceType\" [voucherNumber]=\"voucherNumber\"\n  [class]=\"asideMenuStateForRecurringEntry\" [@slideInOut]=\"asideMenuStateForRecurringEntry\"\n  (closeAsideEvent)=\"toggleRecurringAsidePane('out')\"></app-aside-recurring-entry>\n\n\n<!-- region bulk items -->\n<div bsModal #bulkItemsModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 2000;\"\n  [config]=\"{ animated: true,keyboard: false,backdrop: false,ignoreBackdropClick: true }\">\n\n  <ng-container *ngIf=\"showBulkItemModal\">\n    <proforma-add-bulk-items-component [data]=\"salesAccounts$ | async\" (saveItemsEvent)=\"addBulkStockItems($event)\"\n      (closeEvent)=\"bulkItemsModal.hide()\"></proforma-add-bulk-items-component>\n  </ng-container>\n\n</div>\n<!-- endregion -->\n\n<!-- region last estimate modal-->\n<ng-template #lastEstimateModal let-show>\n  <div *ngIf=\"show\" class=\"lastEstimateModal\">\n    <proforma-last-invoices-component [data]=\"lastInvoices\" (invoiceSelected)=\"getLastInvoiceDetails($event)\">\n    </proforma-last-invoices-component>\n  </div>\n</ng-template>\n<!-- endregion -->\n\n<!-- region gst treatment modal-->\n<ng-template #gstTreatmentModal let-show>\n  <div *ngIf=\"show\" class=\"gstTreatmentModal\">\n    <proforma-gst-treatment-component (closeEvent)=\"showGstTreatmentModal = false\"></proforma-gst-treatment-component>\n  </div>\n</ng-template>\n<!-- endregion -->\n\n<ng-template let-entry #otherTaxesModal>\n  <app-aside-menu-other-taxes *ngIf=\"asideMenuStateForOtherTaxes === 'in'\" [class]=\"asideMenuStateForOtherTaxes\"\n    [taxes]=\"companyTaxesList\" [otherTaxesModal]=\"entry.otherTaxModal\" [@slideInOut]=\"asideMenuStateForOtherTaxes\"\n    (closeModal)=\"toggleOtherTaxesAsidePane(true, null)\"\n    (applyTaxes)=\"calculateOtherTaxes($event);toggleOtherTaxesAsidePane(true, null);calculateAffectedThingsFromOtherTaxChanges()\">\n  </app-aside-menu-other-taxes>\n</ng-template>\n\n<!-- create Group modal -->\n<section *ngIf=\"showCreateGroupModal\">\n  <div bsModal #createGroupModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [keyboardShortcut]=\"'esc'\"\n    (onShortcutPress)=\"closeCreateGroupModal()\" [config]=\"modalConfig\">\n    <div class=\"modal-dialog modal-md\">\n      <div class=\"modal-content\">\n        <sales-add-group-modal (actionFired)=\"closeCreateGroupModal($event)\"></sales-add-group-modal>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- create Ac modal -->\n<section *ngIf=\"showCreateAcModal\">\n  <div bsModal #createAcModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [config]=\"modalConfig\">\n    <div class=\"modal-dialog modal-md\">\n      <div class=\"modal-content\">\n        <create-account-modal [gType]=\"createAcCategory\" (actionFired)=\"closeCreateAcModal()\"></create-account-modal>\n      </div>\n    </div>\n  </div>\n</section>\n<!-- endregion -->\n\n<!-- region send email popup -->\n<div bsModal #sendEmailModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\"\n  [config]=\"modalConfig\">\n\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n\n      <ng-container *ngIf=\"actionAfterGenerateORUpdate === 2\">\n        <app-send-email-invoice-component [voucherType]=\"invoiceType\" (successEvent)=\"sendEmail($event)\"\n          (cancelEvent)=\"cancelEmailModal()\"></app-send-email-invoice-component>\n      </ng-container>\n\n    </div>\n  </div>\n\n</div>\n<!-- endregion -->\n\n<!-- region print voucher popup -->\n<div bsModal #printVoucherModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\"\n  [config]=\"modalConfig\">\n\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n\n      <ng-container *ngIf=\"actionAfterGenerateORUpdate === 3 && (invoiceNo && accountUniqueName)\">\n        <proforma-print-in-place-component [voucherType]=\"invoiceType\"\n          [selectedItem]=\"{ voucherNumber: invoiceNo, uniqueName: accountUniqueName }\"\n          (cancelEvent)=\"cancelPrintModal()\"></proforma-print-in-place-component>\n      </ng-container>\n\n    </div>\n  </div>\n\n</div>\n<!-- endregion -->\n"

/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n# margin mixin pass direction and number\n*/\n/**\n# padding mixin pass direction and number\n*/\n.whiteBg {\n  background-color: white; }\n.cp, .collapse-pane .collapse-pane-heading {\n  cursor: pointer; }\n.mrT27 {\n  margin-top: 27px; }\n.wid90p {\n  width: 91.66666667%; }\n.flex-row {\n  display: -webkit-box;\n  display: flex; }\n.flex-row .flex-row-child {\n    align-self: center;\n    -webkit-box-flex: 0;\n            flex-grow: 0; }\n.pure-css-select-wrapper {\n  position: relative;\n  display: block;\n  width: 20em;\n  height: 3em;\n  line-height: 3;\n  overflow: hidden;\n  border-radius: .25em;\n  /* Reset Select */\n  /* Arrow */\n  /* Transition */ }\n.pure-css-select-wrapper select {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    -ms-appearance: none;\n    outline: 0;\n    box-shadow: none;\n    border: 0 !important;\n    background: transparent;\n    background-image: none;\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    padding: 0 0 0 .5em;\n    cursor: pointer; }\n.pure-css-select-wrapper select::-ms-expand {\n    display: none; }\n.pure-css-select-wrapper::after {\n    content: '\\25BC';\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    padding: 0 1em;\n    color: #cccccc;\n    pointer-events: none; }\n.pure-css-select-wrapper:hover::after {\n    color: #bbbbbb; }\n.pure-css-select-wrapper::after {\n    -webkit-transition: .25s all ease;\n    transition: .25s all ease; }\n.form-group .form-control {\n  border-radius: 3px; }\n.form-group textarea.form-control {\n  resize: none;\n  padding-left: 7px !important; }\n.form-group label {\n  display: block;\n  font-weight: 400;\n  margin-bottom: 0px; }\n.form-group.size_175 input:not([type='checkbox']),\n.form-group.size_175 select,\n.form-group.size_175 textarea {\n  width: 175px; }\n.form-group.size_240 input:not([type='checkbox']),\n.form-group.size_240 select,\n.form-group.size_240 textarea {\n  width: 240px; }\n.form-group.size_340 input:not([type='checkbox']),\n.form-group.size_340 select,\n.form-group.size_340 textarea {\n  width: 340px; }\n.form-group.size_380 input:not([type='checkbox']),\n.form-group.size_380 select,\n.form-group.size_380 textarea {\n  width: 380px; }\n.form-group.noMarg {\n  margin: 0; }\n.form-group .form-control.voucher-selector {\n  width: 200px;\n  text-transform: capitalize; }\n.form-inline .form-group {\n  vertical-align: top; }\n.form-inline .form-control {\n  width: 100%; }\n#actionPane {\n  width: 100%;\n  position: relative;\n  float: left;\n  padding: 20px 0;\n  background-color: #cccccc; }\n.dropup .dropdown-menu li a:hover {\n  color: #ff5e01;\n  background: #f4f5f8; }\n.dropup.show {\n  display: inline-block !important; }\n.collapse-pane {\n  padding: 0 0; }\n.collapse-pane .collapse-pane-heading {\n    margin-bottom: 0px;\n    color: #6d6d6d;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-align: center;\n            align-items: center;\n    height: 30px; }\n.collapse-pane .collapse-pane-heading .ico-box-wrap,\n    .collapse-pane .collapse-pane-heading .ico-head {\n      align-self: stretch;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-align: center;\n              align-items: center; }\n.collapse-pane .collapse-pane-heading .ico-box {\n      border: 1px solid #6d6d6d;\n      width: 20px;\n      height: 20px;\n      margin-right: 10px;\n      border-radius: 3px;\n      align-self: center;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-pack: center;\n              justify-content: center; }\n.collapse-pane .collapse-pane-heading .ico-box span {\n        align-self: center;\n        font-size: 12px; }\n.action-panel-td {\n  width: 80px;\n  padding: 0 !important; }\n.action-panel-td span {\n    padding: 5px;\n    display: inline-block; }\n.nested-table-wrap {\n  padding: 8px 0; }\n.nested-table th,\n.nested-table td {\n  padding: 0 8px; }\n.list-item {\n  font-size: 14px; }\n.fs12 {\n  font-size: 12px; }\n.fs11 {\n  font-size: 11px; }\n.tableSec {\n  display: table;\n  width: 100%; }\n.tableSec .tableRow {\n    display: table-row;\n    vertical-align: top; }\n.tableSec .tableRow .tableCell {\n      vertical-align: middle;\n      text-align: right;\n      padding-bottom: 7px;\n      display: table-cell; }\n.tableSec .tableRow .figureCell {\n      width: 140px;\n      padding-right: 0; }\n.tableSec .tableRow .figureCell input {\n        width: 100px;\n        float: right;\n        text-align: right; }\n.table tbody + tbody {\n  border: 0; }\nng-select.splSales {\n  width: 100%; }\n[data-field=\"HSN/SAC\"],\n[data-field=\"Quanity/Unit\"],\n[data-field=\"Unit\"],\n[data-field=\"Rate\"],\n[data-field=\"Amount\"],\n[data-field=\"Discount\"],\n[data-field=\"Taxable\"],\n[data-field=\"Tax\"],\n[data-field=\"Total\"],\n[data-field=\"S.No\"] {\n  text-align: right; }\n[data-field=\"Action\"] {\n  text-align: center; }\n.table > thead > tr th {\n  font-weight: 100; }\n.salesTax .taxInput {\n  text-align: right; }\n.billing-address {\n  background: #fff;\n  border: 1px solid #d6d6d6;\n  padding: 5px;\n  padding-bottom: 10px; }\n.billing-address.disabled {\n    background: #eee; }\n.billing-address textarea {\n    border: none;\n    width: 100%;\n    line-height: 18px;\n    height: auto !important;\n    overflow: hidden; }\n.billing-address :focus {\n    outline: none !important; }\ntextarea:focus {\n  outline: none;\n  box-shadow: none; }\n.input-custom {\n  border: none;\n  border-bottom: 1px solid #ddd; }\n.pl0 {\n  padding-left: 0; }\n.balance-due {\n  display: block;\n  color: #6b6c72;\n  line-height: 1.2rem;\n  font-size: 14px;\n  font-weight: 500; }\n.sp-rupees {\n  display: block;\n  font-size: 26px; }\n.table-custom-invoice > thead > tr > th {\n  border: 1px solid #c7c7c7 !important;\n  padding: 10px 8px;\n  white-space: nowrap;\n  text-align: right; }\n.table-custom-invoice > thead > tr > th:first-child {\n    text-align: left; }\n.table-custom-invoice > thead > tr > th:nth-child(2) {\n    text-align: left;\n    white-space: normal;\n    width: 350px; }\n.table-custom-invoice > thead > tr > th:nth-child(3) {\n    white-space: normal;\n    width: 90px; }\n.table-custom-invoice > thead > tr > th:last-child {\n    vertical-align: middle !important; }\n.table-custom-invoice > tbody > tr > td {\n  border: 1px solid #c7c7c7 !important;\n  padding: 10px 8px;\n  white-space: nowrap; }\n.table-custom-invoice > tbody > tr > td:last-child {\n    vertical-align: middle !important; }\n.table-custom-invoice > tbody > tr > td:nth-child(2) {\n    white-space: normal;\n    width: 350px; }\n.table-custom-invoice > tbody > tr > td:nth-child(3) {\n    white-space: normal;\n    width: 90px; }\n.row-active {\n  box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.1); }\n.max-600 {\n  max-width: 600px; }\n.spcl_dropdown {\n  border: 0 !important;\n  background: transparent !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  font-size: 24px;\n  padding: 0; }\n.disabled {\n  background: #eee;\n  pointer-events: none;\n  opacity: 0.7; }\n.tip_img {\n  max-width: 375px;\n  left: 198px;\n  position: absolute;\n  top: 70px;\n  z-index: 99; }\n.tip_img.for_purchase_invoice {\n  top: 230px; }\n#deposit-dropdown, #deposit-dropdown-normal {\n  right: 98px;\n  top: 50%;\n  left: inherit;\n  width: 282px;\n  background: #f4f5f8;\n  display: block; }\n#deposit-dropdown .caret, #deposit-dropdown-normal .caret {\n  border-top: 7px dashed #d0d0d3;\n  border-right: 7px solid transparent;\n  border-left: 7px solid transparent;\n  right: -15px;\n  position: absolute;\n  top: 47%;\n  background: #f4f5f8;\n  -webkit-transform: rotate(-90deg) translateY(-50%);\n          transform: rotate(-90deg) translateY(-50%); }\n#invoiceFile {\n  position: absolute;\n  top: 0;\n  opacity: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  width: 100%; }\n.custom-file-label {\n  height: 60px;\n  max-width: 330px;\n  text-align: center;\n  line-height: 45px; }\n.custom-file-label em {\n  top: -7px;\n  position: absolute;\n  width: 100%;\n  left: 0; }\n#actionPane #dropdown-basic, #actionPane #dropdown-basic2 {\n  -webkit-transform: translateY(0) !important;\n          transform: translateY(0) !important; }\n.change-template {\n  position: relative;\n  margin-bottom: 40px; }\n.modal-invoice-footer {\n  position: absolute;\n  background: rgba(112, 112, 112, 0.92);\n  bottom: 0;\n  width: 100%;\n  color: #fff;\n  padding: 10px;\n  text-align: center; }\n.modal-invoice-footer .btn {\n  background: #A7A7A7;\n  font-size: 12px;\n  border-radius: 90px;\n  padding: 1px 6px;\n  vertical-align: middle;\n  margin-right: 0px;\n  -webkit-transition: .5s all ease;\n  transition: .5s all ease;\n  color: #fff; }\n.modal-invoice-footer .btn:hover {\n  background: #229E2B;\n  color: #fff; }\n.sales-invoice-modal .modal-body perfect-scrollbar {\n  height: 200px; }\n.modal-invoice-footer ul > li > input {\n  display: none; }\n.modal-invoice-footer ul > li > input:checked + label {\n  background: #229E2B;\n  color: #fff; }\n.add-entryAgainst {\n  display: none; }\n.other-options {\n  color: #A9A9A9;\n  padding-top: 5px; }\n.other-options a {\n  color: #0C8FE6;\n  font-size: 12px; }\n.form-control {\n  height: 34px !important; }\nform label {\n  font-size: 14px; }\n.billing-address .selectedVal {\n  border: none !important;\n  padding-right: 2px !important;\n  background-color: transparent !important;\n  border-bottom: 1px solid #c7c7c7 !important;\n  height: 28px; }\ninput.form-control.selectedVal.cp.bottom-border-only.ng-star-inserted, .collapse-pane input.form-control.selectedVal.bottom-border-only.ng-star-inserted.collapse-pane-heading {\n  background-color: transparent !important;\n  padding-left: 0 !important; }\n.billing-address textarea,\n.billing-address input {\n  background-color: transparent !important;\n  background: transparent !important;\n  padding-left: 0 !important; }\n.billing-address input.form-control {\n  padding-left: 0 !important; }\n.billing-address input.form-control.selectedVal.cp.bottom-border-only.ng-star-inserted, .billing-address .collapse-pane input.form-control.selectedVal.bottom-border-only.ng-star-inserted.collapse-pane-heading, .collapse-pane .billing-address input.form-control.selectedVal.bottom-border-only.ng-star-inserted.collapse-pane-heading {\n  background: transparent !important;\n  padding-left: 0 !important; }\n.billingaddresFull p {\n  font-size: 14px;\n  color: #666666;\n  margin-bottom: 5px; }\n.wrappAdress {\n  margin-top: 8px; }\n.billing-address .form-group {\n  display: block; }\n.change-label {\n  color: #0C8FE6; }\n.wrap-invoiceNumberDetails .form-group {\n  display: block !important; }\n.wrap-invoiceNumberDetails .invoiceDate {\n  max-width: 100% !important; }\n.bg-white {\n  background-color: #fff;\n  margin: 0 0; }\n.wrap-inputField {\n  margin-bottom: 10px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center; }\n.mb20 {\n  margin-bottom: 20px; }\n.discription textarea {\n  border: 1px solid #ccc;\n  width: 100%;\n  min-height: 55px;\n  margin-top: 10px; }\n.salseInvoicetable table input[disabled] {\n  cursor: default;\n  background-color: #EEEEEE;\n  border: 1px solid #ccc;\n  padding: 5px;\n  width: 100%; }\n.salseInvoicetable table.basic td {\n  vertical-align: top !important; }\ninput[type=\"text\"] {\n  outline: none;\n  width: 100%;\n  height: 34px !important; }\na.copyInvoice {\n  color: #3597EC;\n  margin-left: 10px; }\na.copyInvoice img {\n  margin-right: 6px; }\n.invoiceDateDueDate .form-group,\n.invoiceDateDueDate label {\n  display: inline-block !important; }\n.invoiceDateDueDate label {\n  padding-right: 10px; }\n.p-0 {\n  padding: 0; }\n.shipping-address textarea {\n  border-bottom: 1px solid #ccc !important; }\n.mb-0 {\n  margin-bottom: 0 !important; }\n.entryDate label {\n  font-size: 12px; }\n.entryDate input {\n  border: none;\n  display: inline-block;\n  width: 80px;\n  background: transparent !important;\n  height: 25px !important;\n  font-size: 12px; }\n.entryDate input:focus {\n  background-color: transparent; }\n.hsnCode.text-right {\n  padding-top: 3px;\n  font-size: 12px; }\n.hsnCode label {\n  font-size: 12px; }\n.entryDate {\n  font-size: 12px; }\n.skuNumber,\n.skuNumber label {\n  font-size: 12px !important;\n  display: none; }\n.add-bulk-items {\n  font-size: 12px;\n  padding-bottom: 0;\n  color: #0C8FE6; }\n.otherDetailTable th,\n.otherDetailTable td,\n.otherDetailTable tr,\n.otherDetailTable tbody {\n  border-top: none !important; }\n.add-bulk-items a {\n  cursor: pointer; }\n.hsnCode input {\n  display: inline-block !important;\n  height: 20px !important;\n  border: none;\n  padding: 0px 5px !important;\n  vertical-align: middle;\n  line-height: 0;\n  width: 88px !important;\n  font-size: 12px;\n  background-color: transparent !important; }\n.salseInvoicetable .form-control {\n  margin-bottom: 5px; }\nspan.edit-icon {\n  line-height: 10px;\n  vertical-align: top;\n  position: relative;\n  top: -2px; }\n.salseInvoicetable th:nth-child(2) {\n  width: 35%; }\n.wrap-hsnBox {\n  position: relative; }\n.hsnCodeDropdown {\n  position: absolute;\n  background-color: #fff;\n  border: 1px solid #c7c7c7;\n  border-radius: 3px;\n  width: 100%;\n  min-width: 250px;\n  left: auto;\n  top: 31px;\n  padding: 8px;\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  right: 0;\n  z-index: 4; }\n.hsnCodeDropdown label {\n  font-size: 12px !important;\n  margin-bottom: 5px;\n  display: block; }\n.hsnCodeDropdown input {\n  width: 100%;\n  height: 28px !important;\n  padding: 5px;\n  max-width: 200px;\n  border: 1px solid #c7c7c7; }\n.hsnCodeDropdown input::-webkit-input-placeholder,\n.hsnCodeDropdown input::-webkit-input-placeholder {\n  color: #C6C6C6; }\n.hsnCodeDropdown input::placeholder,\n.hsnCodeDropdown input::-webkit-input-placeholder {\n  color: #C6C6C6; }\n.hsnCodeDropdown a {\n  display: inline-block;\n  text-align: center;\n  color: #CCCCCC;\n  padding: 5px 8px;\n  font-size: 16px; }\n.hsnCodeDropdown .btn-group {\n  margin-top: 5px; }\n.hsnCodeDropdown button.btn.btn-sm.btn-success,\n.bulkItemBtnGroup button.btn.btn-sm.btn-success {\n  background-color: #28AB00;\n  color: #fff; }\n.temapletFooter {\n  position: fixed;\n  bottom: 15px;\n  width: 100%;\n  max-width: 418px; }\n.updateText {\n  color: #0C8FE6;\n  padding: 0 5px; }\n.selectAccountLabel {\n  font-size: 14px;\n  color: #c7c7c7;\n  padding-bottom: 3px; }\n.btn-group .dropdown-toggle {\n  margin-right: 0; }\n.wrap-customer {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center; }\n.form-group input[type=\"checkbox\"] {\n  position: relative;\n  top: 0;\n  height: 15px !important; }\n.wrap-billing-address label {\n  margin-bottom: 5px; }\n.customerInvoiceTable tr,\n.customerInvoiceTable td,\n.customerInvoiceTable tbody {\n  border: none !important; }\ntable.table.customerInvoiceTable {\n  margin-bottom: 0;\n  width: 100%; }\n.wrapperCustomerTable {\n  overflow-x: hidden !important;\n  min-height: 470px; }\n.customerInvoiceTable td {\n  padding: 8px 15px; }\n.invoiceDateDueDate input {\n  width: 112px !important; }\nsection.staticInvoiceTable {\n  padding-top: 20px;\n  margin-top: -20px; }\n.invoiceDateDueDate {\n  position: absolute;\n  width: 100%;\n  left: 0;\n  margin-left: 48%; }\n.m-l-10 {\n  margin-left: 10px; }\n.mTB1 {\n  margin-top: 10px; }\n.customerInvoiceTable {\n  padding-left: 15px; }\n.wrap-billing-address.clearfix {\n  margin-top: 10px;\n  margin-bottom: 5px; }\n.customerInvoiceTable.bg-white {\n  margin-top: 10px; }\n.customerInvoiceTable section.billing-addressWrap {\n  padding-top: 60px; }\n.inner-container {\n  max-width: 1120px;\n  width: 100%; }\nsection.newtable {\n  background-color: #e5e5e5;\n  margin-bottom: 30px;\n  margin: 0 15px 30px; }\n.newtable .thead {\n  border-right: 1px solid #c7c7c7;\n  padding: 8px 10px; }\n.newtable .thead:first-child {\n  padding-left: 30px; }\n.newtable .row > div {\n  padding: 0; }\n.customerInvoiceTable label {\n  line-height: 2.3; }\n.table-custom-invoice.table > tfoot > tr > td {\n  border-top: none; }\n.cashinvoice_tipImg.tip_img {\n  max-width: 215px; }\n@media (min-width: 768px) {\n  .table.customerInvoiceTable .form-group {\n    display: block;\n    margin-bottom: 0; }\n  .form-inline .wrap-billing-address .form-group {\n    display: block !important; } }\n@media (max-width: 767px) {\n  .invoiceDateDueDate[_ngcontent-c7] {\n    position: static;\n    width: 100%;\n    left: 0;\n    margin-left: -13px;\n    margin-top: 10px; } }\n.card-invoiceTable-wrapper {\n  max-width: 400px;\n  width: 100%;\n  background-color: #fff;\n  margin: 20px 0;\n  border-radius: 3px;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1); }\n.single-card-row label.card-label {\n  font-size: 14px !important;\n  font-weight: 500;\n  display: block; }\n.single-card-row {\n  padding: 5px 0; }\n.single-card-row p {\n  color: #666;\n  font-size: 14px; }\n.card-invoiceTable {\n  padding: 10px 15px;\n  position: relative; }\n.del-card {\n  position: absolute;\n  right: 15px;\n  top: 11px;\n  color: #f00;\n  font-size: 18px; }\n.edit-card img {\n  width: 12px; }\n.edit-card {\n  position: absolute;\n  top: 10px;\n  right: 40px; }\n.single-card-row .col-xs-6, .single-card-row .col-xs-12 {\n  padding-left: 10px;\n  padding-right: 10px; }\n.card-invoiceTable .dateHsnCode {\n  padding-left: 5px;\n  padding-right: 5px; }\n.card-invoiceTable .qty-unit .row {\n  padding-left: 5px;\n  padding-right: 5px; }\n.otherDetail-card {\n  max-width: 400px;\n  margin: 20px 0;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);\n  background-color: #fff;\n  padding: 15px 20px;\n  border-radius: 3px; }\n.otherDetail-card .collapse-pane .col-xs-4 {\n  padding-left: 10px;\n  padding-right: 10px; }\n.otherDetail-card .collapse-pane-heading {\n  padding-bottom: 20px; }\n.total-amountDiscription {\n  max-width: 400px;\n  width: 100%; }\n.total-amountDiscription {\n  max-width: 400px;\n  width: 100%; }\n.saveCard-data {\n  position: absolute;\n  top: 10px;\n  right: 40px;\n  color: #0C8FE6; }\n@media (max-width: 768px) {\n  .staticInvoiceTable.salseInvoicetable {\n    display: none; } }\n@media (min-width: 768px) {\n  .table.customerInvoiceTable .form-group {\n    display: block;\n    margin-bottom: 0; } }\nx .salesCountryLabel {\n  margin-bottom: 0;\n  vertical-align: middle;\n  line-height: 2.4;\n  border-bottom: 1px solid #ddd;\n  padding-left: 6px;\n  border-bottom-color: #d6d6d6; }\n.loaderClass {\n  height: calc(100% - 150px);\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n  min-height: 80vh; }\n/* ADD BULK ITEM */\n.addBulkItemmodal.modal-dialog {\n  width: 870px !important;\n  margin: 30px auto; }\n.addBulkItemmodal .singleProductWrapper {\n  margin-bottom: 20px; }\n.addBulkItemmodal .singleProductWrapper h5 {\n  color: #333333;\n  font-size: 14px; }\n.addBulkItemmodal .singleProductWrapper p {\n  font-size: 12px;\n  padding-top: 4px; }\n.addBulkItemmodal .productList {\n  padding-top: 15px;\n  height: 600px;\n  overflow-y: auto; }\n.addBulkItemmodal .rightContent span.selectdStockNumber {\n  font-size: 20px; }\n.addBulkItemmodal .rightContent h4 {\n  font-size: 14px; }\n.addBulkItemmodal .rightContent hr {\n  color: black;\n  border-color: #ccc;\n  margin: 10px -15px;\n  margin-left: -15px; }\n.addBulkItemmodal .pl-0 {\n  padding-left: 0; }\n.addBulkItemmodal .singleSelectdStock p {\n  font-size: 14px; }\n.addBulkItemmodal .wrapSelectedStocks {\n  margin-top: 15px; }\n.addBulkItemmodal .input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n  width: 138px; }\n.addBulkItemmodal input.form-control.input-number {\n  width: 60px !important;\n  text-align: center;\n  height: 28px !important; }\n.addBulkItemmodal .input-group .input-group-btn .btn {\n  background: #fff;\n  border-left: 1px solid #ccc; }\n.addBulkItemmodal .btn {\n  padding: 3px 13px; }\n.addBulkItemmodal .input-group-btn .fa {\n  color: #C6C6C6; }\n.addBulkItemmodal .singleSelectdStock {\n  margin-bottom: 20px; }\n.addBulkItemmodal .leftContent {\n  border-right: 1px solid #ddd;\n  padding-right: 15px; }\n.addBulkItemmodal .modal-title {\n  font-size: 22px !important;\n  color: #fff; }\n.table-custom-invoice .salesTax .dropdown-menu-right li label {\n  padding-left: 10px; }\n.lastEstimateModal {\n  min-width: 230px;\n  position: absolute;\n  top: 30px;\n  z-index: 10; }\n.gstTreatmentModal {\n  min-width: 240px;\n  position: absolute;\n  top: 60px;\n  z-index: 10;\n  border: 1px solid #C7C7C7; }\n.gst-treatment-header > span {\n  font-size: 14px; }\n.aquaColor a {\n  color: #0C8FE6;\n  font-size: 12px; }\n.aquaColor i {\n  font-size: 16px; }\n.balanceDueAbs {\n  position: absolute;\n  right: 0;\n  top: 0; }\n.customerInvoiceTable {\n  position: relative; }\n.p-4.aquaColor.add-line-bulk-item {\n  position: relative;\n  height: 33px;\n  width: 470% !important; }\n.table-custom-invoice > thead > tr > th:first-child {\n  max-width: 40px;\n  width: 40px;\n  min-width: 40px; }\n.table-custom-invoice > tbody > tr > td:first-child {\n  max-width: 40px;\n  width: 40px;\n  min-width: 40px; }\ntable.table.table-custom-invoice.basic {\n  max-width: 1025px;\n  width: 100%; }\n.customerInvoiceForm {\n  position: relative; }\n.customerInvoiceForm::before {\n  position: absolute;\n  content: '';\n  left: 0;\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n  top: 80px;\n  opacity: 0.6;\n  z-index: 99;\n  background: #F7F8FA; }\n@media (min-width: 768px) {\n  .table.customerInvoiceTable .form-group {\n    display: block;\n    margin-bottom: 0; } }\n.cashInvoiceInput {\n  max-width: 440px !important;\n  width: 100% !important; }\n.depositeSection {\n  -webkit-transform: translateX(140px);\n          transform: translateX(140px); }\n#deposit-dropdown li {\n  list-style: none; }\n.amountField, .balanceDueText {\n  max-width: 129px !important;\n  margin-left: 20px; }\n#deposit-dropdown p {\n  text-align: left; }\n.sku_and_customfields {\n  white-space: normal;\n  font-size: 12px !important; }\n"

/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice.component.ts ***!
  \****************************************************************/
/*! exports provided: ProformaInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaInvoiceComponent", function() { return ProformaInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _services_sales_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/sales.service */ "./src/app/services/sales.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../actions/settings/discount/settings.discount.action */ "./src/app/actions/settings/discount/settings.discount.action.ts");
/* harmony import */ var _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../actions/invoice/receipt/receipt.actions */ "./src/app/actions/invoice/receipt/receipt.actions.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _sales_discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../sales/discount-list/discountList.component */ "./src/app/sales/discount-list/discountList.component.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../shared/helpers/universalValidations */ "./src/app/shared/helpers/universalValidations.ts");
/* harmony import */ var _app_constant__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../services/apiurls/ledger.api */ "./src/app/services/apiurls/ledger.api.ts");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/cdk/layout */ "../../node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _actions_proforma_proforma_actions__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../actions/proforma/proforma.actions */ "./src/app/actions/proforma/proforma.actions.ts");
/* harmony import */ var _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../models/api-models/proforma */ "./src/app/models/api-models/proforma.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _models_api_models_recipt__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../models/api-models/recipt */ "./src/app/models/api-models/recipt.ts");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../theme/tax-control/tax-control.component */ "./src/app/theme/tax-control/tax-control.component.ts");
/* harmony import */ var _services_general_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../services/general.service */ "./src/app/services/general.service.ts");








































var THEAD_ARR_READONLY = [
    {
        display: true,
        label: '#'
    },
    {
        display: true,
        label: 'Product/Service  Description '
    },
    {
        display: true,
        label: 'Qty/Unit'
    },
    {
        display: true,
        label: 'Rate'
    },
    {
        display: true,
        label: 'Amount'
    },
    {
        display: true,
        label: 'Discount'
    },
    {
        display: true,
        label: 'Tax'
    },
    {
        display: true,
        label: 'Total'
    },
    {
        display: true,
        label: ''
    }
];
var ProformaInvoiceComponent = /** @class */ (function () {
    function ProformaInvoiceComponent(modalService, store, accountService, salesAction, companyActions, router, ledgerActions, salesService, _toasty, _generalActions, _invoiceActions, _settingsDiscountAction, route, invoiceReceiptActions, invoiceActions, _settingsProfileActions, _zone, _breakpointObserver, _cdr, proformaActions, _ledgerService, _generalService) {
        var _this = this;
        this.modalService = modalService;
        this.store = store;
        this.accountService = accountService;
        this.salesAction = salesAction;
        this.companyActions = companyActions;
        this.router = router;
        this.ledgerActions = ledgerActions;
        this.salesService = salesService;
        this._toasty = _toasty;
        this._generalActions = _generalActions;
        this._invoiceActions = _invoiceActions;
        this._settingsDiscountAction = _settingsDiscountAction;
        this.route = route;
        this.invoiceReceiptActions = invoiceReceiptActions;
        this.invoiceActions = invoiceActions;
        this._settingsProfileActions = _settingsProfileActions;
        this._zone = _zone;
        this._breakpointObserver = _breakpointObserver;
        this._cdr = _cdr;
        this.proformaActions = proformaActions;
        this._ledgerService = _ledgerService;
        this._generalService = _generalService;
        this.isPurchaseInvoice = false;
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.invoiceType = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].sales;
        this.cancelVoucherUpdate = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.isSalesInvoice = true;
        this.isCashInvoice = false;
        this.isProformaInvoice = false;
        this.isEstimateInvoice = false;
        this.isUpdateMode = false;
        this.isLastInvoiceCopied = false;
        this.customerCountryName = '';
        this.hsnDropdownShow = false;
        this.customerPlaceHolder = 'Select Customer';
        this.customerNotFoundText = 'Add Customer';
        this.invoiceNoLabel = 'Invoice #';
        this.invoiceDateLabel = 'Invoice Date';
        this.invoiceDueDateLabel = 'Invoice Due Date';
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = false;
        this.typeaheadNoResultsOfCustomer = false;
        this.salesAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(null);
        this.accountAsideMenuState = 'out';
        this.asideMenuStateForProductService = 'out';
        this.asideMenuStateForRecurringEntry = 'out';
        this.asideMenuStateForOtherTaxes = 'out';
        this.theadArrReadOnly = THEAD_ARR_READONLY;
        this.companyTaxesList = [];
        this.showCreateAcModal = false;
        this.showCreateGroupModal = false;
        this.createAcCategory = null;
        this.countrySource = [];
        this.statesSource = [];
        this.autoFillShipping = true;
        this.toggleFieldForSales = true;
        this.depositAmount = 0;
        this.depositAmountAfterUpdate = 0;
        this.giddhDateFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"];
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])({ status: false });
        this.calculatedRoundOff = 0;
        // modals related
        this.modalConfig = {
            animated: true,
            keyboard: false,
            backdrop: 'static',
            ignoreBackdropClick: true
        };
        this.pageList = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VOUCHER_TYPE_LIST"];
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_25__;
        this.GIDDH_DATE_FORMAT = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"];
        this.isCustomerSelected = false;
        this.dropdownisOpen = false;
        this.lastInvoices = [];
        this.isFileUploading = false;
        this.selectedFileName = '';
        this.file = null;
        this.invoiceDataFound = false;
        this.isUpdateDataInProcess = false;
        this.isMobileView = false;
        this.showBulkItemModal = false;
        this.showLastEstimateModal = false;
        this.showGstTreatmentModal = false;
        this.selectedCustomerForDetails = null;
        this.selectedGrpUniqueNameForAddEditAccountModal = '';
        this.actionAfterGenerateORUpdate = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generate;
        this.isMultiCurrencyAllowed = false;
        this.fetchedConvertedRate = 0;
        this.isAddBulkItemInProcess = false;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_19__["ReplaySubject"](1);
        this.updateAccount = false;
        this.sundryDebtorsAcList = [];
        this.sundryCreditorsAcList = [];
        this.prdSerAcListForDeb = [];
        this.prdSerAcListForCred = [];
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this._settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.companyActions.getTax());
        this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
        this.store.dispatch(this._invoiceActions.getInvoiceSetting());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherClass"]();
        this.companyUniqueName$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.session.companyUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.activeAccount$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.groupwithaccounts.activeAccount; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.newlyCreatedAc$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.groupwithaccounts.newlyCreatedAccount; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.newlyCreatedStockAc$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.newlyCreatedStockAc; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.flattenAccountListStream$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.general.flattenAccounts; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.acDtl; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.sessionKey$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.session.user.session.id; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.companyName$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.session.companyUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.createAccountSuccess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.createdAccountDetails$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.createdAccountDetails; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.updatedAccountDetails$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.updatedAccountDetails; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.updateAccountSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.sales.updateAccountSuccess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.generateVoucherSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.proforma.isGenerateSuccess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.updateVoucherSuccess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.proforma.isUpdateProformaSuccess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.lastGeneratedVoucherNo$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.proforma.lastGeneratedVoucherDetails; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.lastInvoices$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.receipt.lastVouchers; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.lastProformaInvoices$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.proforma.lastVouchers; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) {
            if (!_this.isProformaInvoice && !_this.isEstimateInvoice) {
                return s.receipt.voucher;
            }
            else {
                return s.proforma.activeVoucher;
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$));
        this.exceptTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
    }
    ProformaInvoiceComponent.prototype.ngAfterViewInit = function () {
        if (!this.isUpdateMode) {
            this.toggleBodyClass();
        }
        // fristElementToFocus to focus on customer search box
        setTimeout(function () {
            // tslint:disable-next-line:prefer-for-of
            var firstElementToFocus = $('.fristElementToFocus');
            //for (let i = 0; i < firstElementToFocus.length; i++) {
            //if (firstElementToFocus[i].tabIndex === 0) {
            firstElementToFocus[0].focus();
            //}
            // }
        }, 200);
        // this.fristElementToFocus.nativeElement.focus(); // not working
    };
    ProformaInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.invoiceNo = '';
        this.isUpdateMode = false;
        // get user country from his profile
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.settings.profile; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (profile) {
            if (profile) {
                _this.customerCountryName = profile.country;
                _this.companyCurrency = profile.baseCurrency || 'INR';
                _this.isMultiCurrencyAllowed = profile.isMultipleCurrency;
            }
            else {
                _this.customerCountryName = '';
                _this.companyCurrency = 'INR';
                _this.isMultiCurrencyAllowed = false;
            }
        });
        this.route.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (parmas) {
            if (parmas['invoiceType']) {
                if (_this.invoiceType !== parmas['invoiceType']) {
                    _this.invoiceType = parmas['invoiceType'];
                    _this.prepareInvoiceTypeFlags();
                    _this.saveStateDetails();
                    _this.resetInvoiceForm(_this.invoiceForm);
                    _this.makeCustomerList();
                    _this.getAllLastInvoices();
                }
                _this.invoiceType = parmas['invoiceType'];
                _this.prepareInvoiceTypeFlags();
                _this.saveStateDetails();
            }
            if (parmas['invoiceType'] && parmas['accUniqueName']) {
                _this.accountUniqueName = parmas['accUniqueName'];
                _this.isUpdateMode = false;
                _this.invoiceType = parmas['invoiceType'];
                _this.prepareInvoiceTypeFlags();
                _this.getAccountDetails(parmas['accUniqueName']);
            }
            if (parmas['invoiceNo'] && parmas['accUniqueName'] && parmas['invoiceType']) {
                // for edit mode from url
                _this.accountUniqueName = parmas['accUniqueName'];
                _this.invoiceNo = parmas['invoiceNo'];
                _this.isUpdateMode = true;
                _this.isUpdateDataInProcess = true;
                _this.prepareInvoiceTypeFlags();
                _this.toggleFieldForSales = (!(_this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].debitNote || _this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].creditNote));
                if (!_this.isProformaInvoice && !_this.isEstimateInvoice) {
                    _this.store.dispatch(_this.invoiceReceiptActions.GetVoucherDetails(_this.accountUniqueName, {
                        invoiceNumber: _this.invoiceNo,
                        voucherType: _this.parseVoucherType(_this.invoiceType)
                    }));
                }
                else {
                    var obj = new _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_33__["ProformaGetRequest"]();
                    obj.accountUniqueName = _this.accountUniqueName;
                    if (_this.isProformaInvoice) {
                        obj.proformaNumber = _this.invoiceNo;
                    }
                    else {
                        obj.estimateNumber = _this.invoiceNo;
                    }
                    _this.store.dispatch(_this.proformaActions.getProformaDetails(obj, _this.invoiceType));
                }
            }
            else {
                // for edit mode direct from @Input
                if (_this.accountUniqueName && _this.invoiceNo && _this.invoiceType) {
                    _this.store.dispatch(_this._generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + _this.invoiceType));
                    _this.getVoucherDetailsFromInputs();
                }
            }
            _this.getAllLastInvoices();
        });
        // bind state sources
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.general.states; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (states) {
            var arr = [];
            if (states) {
                states.forEach(function (d) {
                    arr.push({ label: "" + d.name, value: d.code });
                });
            }
            _this.statesSource = arr;
        });
        // get account details and set it to local var
        this.selectedAccountDetails$.subscribe(function (o) {
            if (o && !_this.isUpdateMode) {
                _this.assignAccountDetailsValuesInForm(o);
            }
        });
        // get tax list and assign values to local vars
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.taxes; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.companyTaxesList = o;
                _this.theadArrReadOnly.forEach(function (item) {
                    // show tax label
                    if (item.label === 'Tax') {
                        item.display = true;
                    }
                    return item;
                });
            }
            else {
                _this.companyTaxesList = [];
            }
        });
        // listen for new add account utils
        this.newlyCreatedAc$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && _this.accountAsideMenuState === 'in') {
                var item = {
                    label: o.name,
                    value: o.uniqueName
                };
                _this.onSelectCustomer(item);
            }
        });
        // create account success then hide aside pane
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o && _this.accountAsideMenuState === 'in') {
                _this.toggleAccountAsidePane();
            }
        });
        // listen for universal date
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.session.applicationDate; })).subscribe(function (dateObj) {
            if (dateObj) {
                try {
                    _this.universalDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(dateObj[1]).toDate();
                    _this.assignDates();
                }
                catch (e) {
                    _this.universalDate = new Date();
                }
            }
        });
        if (!this.isUpdateMode) {
            this.addBlankRow(null);
        }
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.invoice.settings; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (setting) {
            if (setting && (setting.invoiceSettings || setting.proformaSettings || setting.estimateSettings)) {
                if (_this.isSalesInvoice) {
                    _this.invFormData.voucherDetails.dueDate = setting.invoiceSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.invoiceSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
                else if (_this.isProformaInvoice) {
                    _this.invFormData.voucherDetails.dueDate = setting.proformaSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.proformaSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
                else {
                    _this.invFormData.voucherDetails.dueDate = setting.estimateSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.estimateSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
            }
        });
        this.uploadInput = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.fileUploadOptions = { concurrency: 0 };
        //region combine get voucher details && all flatten A/c's && create account and update account success from sidebar
        Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["combineLatest"])([this.flattenAccountListStream$, this.voucherDetails$, this.createAccountIsSuccess$, this.updateAccountSuccess$])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["auditTime"])(700))
            .subscribe(function (results) {
            var bankaccounts = [];
            // create mode because voucher details are not available
            if (results[0]) {
                var flattenAccounts = results[0];
                // assign flatten A/c's
                _this.sundryDebtorsAcList = [];
                _this.sundryCreditorsAcList = [];
                _this.prdSerAcListForDeb = [];
                _this.prdSerAcListForCred = [];
                flattenAccounts.forEach(function (item) {
                    if (item.parentGroups.some(function (p) { return p.uniqueName === 'sundrydebtors'; })) {
                        _this.sundryDebtorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    if (item.parentGroups.some(function (p) { return p.uniqueName === 'sundrycreditors'; })) {
                        _this.sundryCreditorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    if (item.parentGroups.some(function (p) { return p.uniqueName === 'bankaccounts' || p.uniqueName === 'cash'; })) {
                        bankaccounts.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    if (item.parentGroups.some(function (p) { return p.uniqueName === 'otherincome' || p.uniqueName === 'revenuefromoperations'; })) {
                        if (item.stocks) {
                            // normal entry
                            _this.prdSerAcListForDeb.push({ value: item.uniqueName, label: item.name, additional: item });
                            // stock entry
                            item.stocks.map(function (as) {
                                _this.prdSerAcListForDeb.push({
                                    value: item.uniqueName + "#" + as.uniqueName,
                                    label: item.name + " (" + as.name + ")",
                                    additional: Object.assign({}, item, { stock: as })
                                });
                            });
                        }
                        else {
                            _this.prdSerAcListForDeb.push({ value: item.uniqueName, label: item.name, additional: item });
                        }
                    }
                    if (item.parentGroups.some(function (p) { return p.uniqueName === 'operatingcost' || p.uniqueName === 'indirectexpenses'; })) {
                        if (item.stocks) {
                            // normal entry
                            _this.prdSerAcListForCred.push({ value: item.uniqueName, label: item.name, additional: item });
                            // stock entry
                            item.stocks.map(function (as) {
                                _this.prdSerAcListForCred.push({
                                    value: item.uniqueName + "#" + as.uniqueName,
                                    label: item.name + " (" + as.name + ")",
                                    additional: Object.assign({}, item, { stock: as })
                                });
                            });
                        }
                        else {
                            _this.prdSerAcListForCred.push({ value: item.uniqueName, label: item.name, additional: item });
                        }
                    }
                });
                _this.makeCustomerList();
                /*
                  find and select customer from accountUniqueName basically for account-details-modal popup. only applicable when invoice no
                  is not available. if invoice no is there then it should be update mode
                */
                if (_this.accountUniqueName && !_this.invoiceNo) {
                    if (!_this.isCashInvoice) {
                        _this.customerAcList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (data) {
                            if (data && data.length) {
                                var item = data.find(function (f) { return f.value === _this.accountUniqueName; });
                                if (item) {
                                    _this.invFormData.voucherDetails.customerName = item.label;
                                    _this.invFormData.voucherDetails.customerUniquename = item.value;
                                    _this.isCustomerSelected = true;
                                    _this.invFormData.accountDetails.name = '';
                                }
                            }
                        });
                    }
                    else {
                        _this.invFormData.voucherDetails.customerName = _this.invFormData.accountDetails.name;
                        _this.invFormData.voucherDetails.customerUniquename = _this.invFormData.accountDetails.uniqueName;
                    }
                }
                bankaccounts = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["orderBy"](bankaccounts, 'label');
                _this.bankAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(bankaccounts);
                if (_this.invFormData.accountDetails && !_this.invFormData.accountDetails.uniqueName) {
                    if (bankaccounts) {
                        if (bankaccounts.length > 0) {
                            _this.invFormData.accountDetails.uniqueName = 'cash';
                        }
                        else if (bankaccounts.length === 1) {
                            _this.depositAccountUniqueName = 'cash';
                        }
                    }
                }
                _this.depositAccountUniqueName = 'cash';
            }
            // update mode because voucher details is available
            if (results[0] && results[1]) {
                var obj = void 0;
                if (_this.isLastInvoiceCopied) {
                    // if last invoice is copied then create new Voucher and copy only needed things not all things
                    obj = _this.invFormData;
                }
                else {
                    if ([_models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].sales, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].creditNote, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].debitNote].includes(_this.invoiceType)) {
                        obj = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"])(results[1]);
                    }
                    else {
                        obj = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"])(results[1].voucher);
                    }
                }
                if (obj.voucherDetails) {
                    // if last invoice is copied then don't copy customer/vendor name and it's details
                    if (!_this.isLastInvoiceCopied) {
                        // assign account details uniqueName because we are using accounts uniqueName not name
                        if (!obj.voucherDetails.cashInvoice) {
                            obj.voucherDetails.customerUniquename = obj.accountDetails.uniqueName;
                        }
                        else {
                            _this.isCashInvoice = true;
                            _this.isSalesInvoice = false;
                            _this.invoiceType = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].cash;
                            obj.voucherDetails.customerUniquename = obj.voucherDetails.customerName;
                            _this.depositAccountUniqueName = obj.accountDetails.uniqueName;
                        }
                    }
                    if (_this.isLastInvoiceCopied) {
                        // if it's copied from last invoice then copy all entries && depositEntry from result we got in voucher details api
                        var result = void 0;
                        if (!_this.isProformaInvoice && !_this.isEstimateInvoice) {
                            result = (results[1]);
                        }
                        else {
                            result = (results[1]).voucher;
                        }
                        obj.entries = result.entries;
                        obj.depositEntry = result.depositEntry || result.depositEntryToBeUpdated;
                        obj.templateDetails = result.templateDetails;
                    }
                    if (obj.entries.length) {
                        obj.entries = _this.parseEntriesFromResponse(obj.entries, results[0]);
                    }
                    _this.depositAmountAfterUpdate = (obj.voucherDetails.grandTotal - obj.voucherDetails.balance) || 0;
                    _this.autoFillShipping = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["isEqual"])(obj.accountDetails.billingDetails, obj.accountDetails.shippingDetails);
                    // Getting from api old data "depositEntry" so here updating key with "depositEntryToBeUpdated"
                    // if (obj.depositEntry || obj.depositEntryToBeUpdated) {
                    //   if (obj.depositEntry) {
                    //     obj.depositEntryToBeUpdated = obj.depositEntry;
                    //     delete obj.depositEntry;
                    //   }
                    //   this.depositAmount = _.get(obj.depositEntryToBeUpdated, 'transactions[0].amount', 0);
                    //   this.depositAccountUniqueName = _.get(obj.depositEntryToBeUpdated, 'transactions[0].particular.uniqueName', '');
                    // }
                    // if last invoice is copied then don't copy voucherDate and dueDate
                    if (!_this.isLastInvoiceCopied) {
                        // convert date object
                        if (_this.isProformaInvoice) {
                            obj.voucherDetails.voucherDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(obj.voucherDetails.proformaDate, 'DD-MM-YYYY').toDate();
                            obj.voucherDetails.voucherNumber = obj.voucherDetails.proformaNumber;
                        }
                        else if (_this.isEstimateInvoice) {
                            obj.voucherDetails.voucherDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(obj.voucherDetails.estimateDate, 'DD-MM-YYYY').toDate();
                            obj.voucherDetails.voucherNumber = obj.voucherDetails.estimateNumber;
                        }
                        else {
                            obj.voucherDetails.voucherDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(obj.voucherDetails.voucherDate, 'DD-MM-YYYY').toDate();
                        }
                        if (obj.voucherDetails.dueDate) {
                            obj.voucherDetails.dueDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(obj.voucherDetails.dueDate, 'DD-MM-YYYY').toDate();
                        }
                    }
                    _this.isCustomerSelected = true;
                    _this.invoiceDataFound = true;
                    _this.invFormData = obj;
                }
                else {
                    _this.invoiceDataFound = false;
                }
                _this.isUpdateDataInProcess = false;
            }
            // create account success then close sidebar, and add customer details
            if (results[2]) {
                // toggle sidebar if it's open
                if (_this.accountAsideMenuState === 'in') {
                    _this.toggleAccountAsidePane();
                }
                var tempSelectedAcc_1;
                _this.createdAccountDetails$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (acc) { return tempSelectedAcc_1 = acc; });
                if (_this.customerNameDropDown) {
                    _this.customerNameDropDown.clear();
                }
                if (tempSelectedAcc_1) {
                    _this.invFormData.voucherDetails.customerName = tempSelectedAcc_1.name;
                    _this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc_1.uniqueName;
                    _this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"](tempSelectedAcc_1);
                    _this.isCustomerSelected = true;
                    // reset customer details so we don't have conflicts when we create voucher second time
                    _this.store.dispatch(_this.salesAction.resetAccountDetailsForSales());
                }
                else {
                    _this.isCustomerSelected = false;
                }
            }
            // update account success then close sidebar, and update customer details
            if (results[3]) {
                // toggle sidebar if it's open
                if (_this.accountAsideMenuState === 'in') {
                    _this.toggleAccountAsidePane();
                }
                var tempSelectedAcc_2;
                _this.updatedAccountDetails$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (acc) { return tempSelectedAcc_2 = acc; });
                if (tempSelectedAcc_2) {
                    _this.invFormData.voucherDetails.customerUniquename = null;
                    _this.invFormData.voucherDetails.customerName = tempSelectedAcc_2.name;
                    _this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"](tempSelectedAcc_2);
                    _this.isCustomerSelected = true;
                    setTimeout(function () { return _this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc_2.uniqueName; }, 500);
                    // reset customer details so we don't have conflicts when we create voucher second time
                    _this.store.dispatch(_this.salesAction.resetAccountDetailsForSales());
                }
                else {
                    _this.isCustomerSelected = false;
                }
            }
            _this.calculateBalanceDue();
            _this.calculateTotalDiscount();
            _this.calculateTotalTaxSum();
            _this._cdr.detectChanges();
        });
        // endregion
        // listen for newly added stock and assign value
        Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["combineLatest"])(this.newlyCreatedStockAc$, this.salesAccounts$).subscribe(function (resp) {
            var o = resp[0];
            var acData = resp[1];
            if (o && acData) {
                var result = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["find"](acData, function (item) { return item.additional.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName; });
                if (result && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["isUndefined"](_this.innerEntryIdx)) {
                    _this.invFormData.entries[_this.innerEntryIdx].transactions[0].fakeAccForSelect2 = result.value;
                    _this.onSelectSalesAccount(result, _this.invFormData.entries[_this.innerEntryIdx].transactions[0], _this.invFormData.entries[_this.innerEntryIdx]);
                }
            }
        });
        this._breakpointObserver
            .observe(['(max-width: 768px)'])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$))
            .subscribe(function (st) {
            _this.isMobileView = st.matches;
        });
        this.bulkItemsModal.onHidden.subscribe(function () {
            _this.showBulkItemModal = false;
        });
        this.generateVoucherSuccess$.subscribe(function (result) {
            if (result) {
                var lastGenVoucher_1 = { voucherNo: '', accountUniqueName: '' };
                _this.lastGeneratedVoucherNo$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (s) { return lastGenVoucher_1 = s; });
                _this.invoiceNo = lastGenVoucher_1.voucherNo;
                _this.accountUniqueName = lastGenVoucher_1.accountUniqueName;
                _this.postResponseAction(_this.invoiceNo);
                _this.resetInvoiceForm(_this.invoiceForm);
                if (!_this.isUpdateMode) {
                    _this.getAllLastInvoices();
                }
            }
        });
        this.updateVoucherSuccess$.subscribe(function (result) {
            if (result) {
                _this.doAction(_models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].updateSuccess);
                _this.postResponseAction(_this.invoiceNo);
            }
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["combineLatest"])([
            this.lastInvoices$, this.lastProformaInvoices$
        ])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$))
            .subscribe(function (result) {
            var arr = [];
            if (!_this.isProformaInvoice && !_this.isEstimateInvoice) {
                if (result[0]) {
                    result[0] = result[0];
                    result[0].items.forEach(function (item) {
                        arr.push({
                            versionNumber: item.voucherNumber, date: item.voucherDate, grandTotal: item.grandTotal,
                            account: { name: item.account.name, uniqueName: item.account.uniqueName }
                        });
                    });
                }
            }
            else {
                if (result[1]) {
                    result[1] = result[1];
                    result[1].results.forEach(function (item) {
                        arr.push({
                            versionNumber: _this.isProformaInvoice ? item.proformaNumber : item.estimateNumber,
                            date: _this.isProformaInvoice ? item.proformaDate : item.estimateDate,
                            grandTotal: item.grandTotal,
                            account: { name: item.customerName, uniqueName: item.customerUniqueName }
                        });
                    });
                }
            }
            _this.lastInvoices = arr.slice();
        });
    };
    ProformaInvoiceComponent.prototype.assignDates = function () {
        var date = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](this.universalDate);
        this.invFormData.voucherDetails.voucherDate = date;
        this.invFormData.entries.forEach(function (entry) {
            entry.transactions.forEach(function (txn) {
                if (!txn.accountUniqueName) {
                    entry.entryDate = date;
                }
            });
        });
    };
    ProformaInvoiceComponent.prototype.makeCustomerList = function () {
        // if (this.isCashInvoice) {
        //   return;
        // }
        if (!(this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].debitNote || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].purchase)) {
            this.customerAcList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["orderBy"](this.sundryDebtorsAcList, 'label'));
            this.salesAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["orderBy"](this.prdSerAcListForDeb, 'label'));
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrydebtors';
        }
        else {
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrycreditors';
            this.customerAcList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["orderBy"](this.sundryCreditorsAcList, 'label'));
            this.salesAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["orderBy"](this.prdSerAcListForCred, 'label'));
        }
    };
    ProformaInvoiceComponent.prototype.pageChanged = function (val, label) {
        this.router.navigate(['pages', 'proforma-invoice', 'invoice', val]);
        // this.invoiceType = val as VoucherTypeEnum;
        // this.prepareInvoiceTypeFlags();
        // this.makeCustomerList();
        // this.toggleFieldForSales = (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.creditNote));
        //
        // this.getAllLastInvoices();
        // this.resetInvoiceForm(this.invoiceForm);
        //
        // this.saveStateDetails();
    };
    ProformaInvoiceComponent.prototype.prepareInvoiceTypeFlags = function () {
        this.isSalesInvoice = this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].sales;
        this.isCashInvoice = this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].cash;
        this.isPurchaseInvoice = this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].purchase;
        this.isProformaInvoice = this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].proforma || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].generateProforma;
        this.isEstimateInvoice = this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].estimate || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].generateEstimate;
        // special case when we double click on account name and that accountUniqueName is cash then we have to mark as Cash Invoice
        if (this.isSalesInvoice) {
            if (this.accountUniqueName === 'cash') {
                this.isSalesInvoice = false;
                this.isCashInvoice = true;
            }
        }
        if (!this.isCashInvoice) {
            this.customerPlaceHolder = "Select " + (!this.isPurchaseInvoice ? 'Customer' : 'Vendor');
            this.customerNotFoundText = "Add " + (!this.isPurchaseInvoice ? 'Customer' : 'Vendor');
        }
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.invoiceNoLabel = this.isProformaInvoice ? 'Proforma #' : 'Estimate #';
            this.invoiceDateLabel = this.isProformaInvoice ? 'Proforma Date' : 'Estimate Date';
            this.invoiceDueDateLabel = 'Expiry Date';
        }
        else {
            this.invoiceNoLabel = !this.isPurchaseInvoice ? 'Invoice #' : 'Purchase Invoice #';
            this.invoiceDateLabel = 'Invoice Date';
            this.invoiceDueDateLabel = !this.isPurchaseInvoice ? 'Due Date' : 'Balance Due Date';
        }
        //---------------------//
        // if sales,cash,estimate,proforma invoice then apply 'GST' taxes remove 'InputGST'
        if (this.isSalesInvoice || this.isCashInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            this.exceptTaxTypes.push('InputGST');
            this.exceptTaxTypes = this.exceptTaxTypes.filter(function (ele) {
                return ele !== 'GST';
            });
        }
        // if purchase invoice then apply 'InputGST' taxes remove 'GST'
        if (this.isPurchaseInvoice) {
            this.exceptTaxTypes.push('GST');
            this.exceptTaxTypes = this.exceptTaxTypes.filter(function (ele) {
                return ele !== 'InputGST';
            });
        }
        //---------------------//
    };
    ProformaInvoiceComponent.prototype.getAllFlattenAc = function () {
        // call to get flatten account from store
        this.store.dispatch(this._generalActions.getFlattenAccount());
    };
    ProformaInvoiceComponent.prototype.assignAccountDetailsValuesInForm = function (data) {
        // toggle all collapse
        this.isGenDtlCollapsed = false;
        this.isMlngAddrCollapsed = false;
        this.isOthrDtlCollapsed = false;
        // auto fill all the details
        this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"](data);
    };
    ProformaInvoiceComponent.prototype.getStateCode = function (type, statesEle) {
        var gstVal = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](this.invFormData.accountDetails[type].gstNumber);
        if (gstVal.length >= 2) {
            var s = this.statesSource.find(function (item) { return item.value === gstVal.substr(0, 2); });
            if (s) {
                this.invFormData.accountDetails[type].stateCode = s.value;
            }
            else {
                this.invFormData.accountDetails[type].stateCode = null;
                this._toasty.clearAllToaster();
                this._toasty.warningToast('Invalid GSTIN.');
            }
            statesEle.disabled = true;
        }
        else {
            statesEle.disabled = false;
            this.invFormData.accountDetails[type].stateCode = null;
        }
    };
    ProformaInvoiceComponent.prototype.resetInvoiceForm = function (f) {
        var _this = this;
        f.form.reset();
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherClass"]();
        this.depositAccountUniqueName = 'cash';
        this.typeaheadNoResultsOfCustomer = false;
        // toggle all collapse
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = false;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_19__["of"])({ status: true });
        this.isCustomerSelected = false;
        this.selectedFileName = '';
        this.assignDates();
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.invoice.settings; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (setting) {
            if (setting && (setting.invoiceSettings || setting.proformaSettings || setting.estimateSettings)) {
                if (_this.isSalesInvoice) {
                    _this.invFormData.voucherDetails.dueDate = setting.invoiceSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.invoiceSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
                else if (_this.isProformaInvoice) {
                    _this.invFormData.voucherDetails.dueDate = setting.proformaSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.proformaSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
                else {
                    _this.invFormData.voucherDetails.dueDate = setting.estimateSettings.duePeriod ?
                        moment_moment__WEBPACK_IMPORTED_MODULE_25__().add(setting.estimateSettings.duePeriod, 'days').toDate() : moment_moment__WEBPACK_IMPORTED_MODULE_25__().toDate();
                }
            }
        });
    };
    ProformaInvoiceComponent.prototype.triggerSubmitInvoiceForm = function (f, isUpdate) {
        this.updateAccount = isUpdate;
        this.onSubmitInvoiceForm(f);
    };
    ProformaInvoiceComponent.prototype.autoFillShippingDetails = function () {
        // auto fill shipping address
        if (this.autoFillShipping) {
            this.invFormData.accountDetails.shippingDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](this.invFormData.accountDetails.billingDetails);
        }
    };
    ProformaInvoiceComponent.prototype.convertDateForAPI = function (val) {
        if (val) {
            try {
                return moment_moment__WEBPACK_IMPORTED_MODULE_25__(val).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"]);
            }
            catch (error) {
                return '';
            }
        }
        else {
            return '';
        }
    };
    ProformaInvoiceComponent.prototype.onSubmitInvoiceForm = function (f) {
        var _this = this;
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](this.invFormData);
        if (data.accountDetails.billingDetails.gstNumber) {
            if (!this.isValidGstIn(data.accountDetails.billingDetails.gstNumber)) {
                this._toasty.errorToast('Invalid gst no in Billing Address! Please fix and try again');
                return;
            }
            if (!this.autoFillShipping) {
                if (!this.isValidGstIn(data.accountDetails.shippingDetails.gstNumber)) {
                    this._toasty.errorToast('Invalid gst no in Shipping Address! Please fix and try again');
                    return;
                }
            }
        }
        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            if (moment_moment__WEBPACK_IMPORTED_MODULE_25__(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment_moment__WEBPACK_IMPORTED_MODULE_25__(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        }
        else {
            delete data.voucherDetails.dueDate;
        }
        data.entries = data.entries.filter(function (entry, indx) {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                _this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });
        data.entries = data.entries.map(function (entry) {
            // filter active discounts
            entry.discounts = entry.discounts.filter(function (dis) { return dis.isActive; });
            // filter active taxes
            entry.taxes = entry.taxes.filter(function (tax) { return tax.isChecked; });
            return entry;
        });
        if (!data.accountDetails.uniqueName) {
            data.accountDetails.uniqueName = 'cash';
        }
        var txnErr;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                }
                else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!_shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_27__["EMAIL_REGEX_PATTERN"].test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
        }
        // replace /n to br for (shipping and billing)
        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }
        // convert date object
        if (this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].generateProforma || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].proforma) {
            data.voucherDetails.proformaDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        else if (this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].generateEstimate || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].estimate) {
            data.voucherDetails.estimateDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        else {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);
        // check for valid entries and transactions
        if (data.entries) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["forEach"](data.entries, function (entry) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["forEach"](entry.transactions, function (txn) {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = _this.convertDateForAPI(entry.entryDate);
                    txn.convertedAmount = _this.fetchedConvertedRate > 0 ? Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])((Number(txn.amount) * _this.fetchedConvertedRate), 2) : 0;
                    // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                    if (_this.isLastInvoiceCopied) {
                        if (txn.stockList && txn.stockList.length) {
                            txn.accountUniqueName = txn.accountUniqueName.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName.indexOf('#')) : txn.accountUniqueName;
                            txn.fakeAccForSelect2 = txn.accountUniqueName.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2.indexOf('#')) : txn.fakeAccForSelect2;
                        }
                    }
                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        _this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    }
                    else {
                        txnErr = false;
                    }
                });
            });
        }
        else {
            this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
            return;
        }
        // if txn has errors
        if (txnErr) {
            return false;
        }
        // set voucher type
        data.entries = data.entries.map(function (entry) {
            entry.voucherType = _this.parseVoucherType(_this.invoiceType);
            entry.taxList = entry.taxes.map(function (m) { return m.uniqueName; });
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;
            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }
            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });
        var obj = {
            voucher: data,
            updateAccountDetails: this.updateAccount
        };
        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                action: 'paid',
                amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            }
            else {
                obj.depositAccountUniqueName = data.accountDetails.uniqueName;
            }
        }
        else {
            obj.depositAccountUniqueName = '';
        }
        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.parseVoucherType(this.invoiceType);
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.generateProforma(obj));
        }
        else {
            this.salesService.generateGenericItem(obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$)).subscribe(function (response) {
                if (response.status === 'success') {
                    // reset form and other
                    _this.resetInvoiceForm(f);
                    _this.voucherNumber = response.body.voucherDetails.voucherNumber;
                    _this.invoiceNo = _this.voucherNumber;
                    _this.accountUniqueName = response.body.accountDetails.uniqueName;
                    if (_this.isPurchaseInvoice) {
                        _this._toasty.successToast("Entry created successfully");
                    }
                    else {
                        _this._toasty.successToast("Entry created successfully with Voucher Number: " + _this.voucherNumber);
                    }
                    _this.postResponseAction(_this.invoiceNo);
                }
                else {
                    _this._toasty.errorToast(response.message, response.code);
                }
                _this.updateAccount = false;
            }, (function (error1) {
                _this._toasty.errorToast('Something went wrong! Try again');
            }));
        }
    };
    ProformaInvoiceComponent.prototype.onNoResultsClicked = function (idx) {
        if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["isUndefined"](idx)) {
            this.getAllFlattenAc();
        }
        else {
            this.innerEntryIdx = idx;
        }
        this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    ProformaInvoiceComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in' || this.asideMenuStateForRecurringEntry === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    ProformaInvoiceComponent.prototype.toggleOtherTaxesAsidePane = function (modalBool, index) {
        if (index === void 0) { index = null; }
        if (!modalBool) {
            var entry = this.invFormData.entries[this.activeIndx];
            if (entry) {
                entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesModal"]();
                entry.otherTaxSum = 0;
            }
            return;
        }
        else {
            if (index !== null) {
                // this.selectedEntry = cloneDeep(this.invFormData.entries[index]);
            }
        }
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    ProformaInvoiceComponent.prototype.checkForInfinity = function (value) {
        return (value === Infinity) ? 0 : value;
    };
    ProformaInvoiceComponent.prototype.calculateTotalDiscountOfEntry = function (entry, trx, calculateEntryTotal) {
        if (calculateEntryTotal === void 0) { calculateEntryTotal = true; }
        var percentageListTotal = entry.discounts.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var fixedListTotal = entry.discounts.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var perFromAmount = ((percentageListTotal * trx.amount) / 100);
        entry.discountSum = perFromAmount + fixedListTotal;
        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
        trx.taxableValue = Number(trx.amount) - entry.discountSum;
    };
    ProformaInvoiceComponent.prototype.calculateEntryTaxSum = function (entry, trx, calculateEntryTotal) {
        if (calculateEntryTotal === void 0) { calculateEntryTotal = true; }
        var taxPercentage = 0;
        var cessPercentage = 0;
        entry.taxes.filter(function (f) { return f.isChecked; }).forEach(function (tax) {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            }
            else {
                taxPercentage += tax.amount;
            }
        });
        entry.taxSum = ((taxPercentage * (trx.amount - entry.discountSum)) / 100);
        entry.cessSum = ((cessPercentage * (trx.amount - entry.discountSum)) / 100);
        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
    };
    ProformaInvoiceComponent.prototype.calculateStockEntryAmount = function (trx) {
        trx.amount = Number(trx.quantity) * Number(trx.rate);
    };
    ProformaInvoiceComponent.prototype.calculateEntryTotal = function (entry, trx) {
        trx.total = ((trx.amount - entry.discountSum) + (entry.taxSum + entry.cessSum));
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    };
    ProformaInvoiceComponent.prototype.calculateWhenTrxAltered = function (entry, trx) {
        trx.amount = Number(trx.amount);
        this.calculateTotalDiscountOfEntry(entry, trx, false);
        this.calculateEntryTaxSum(entry, trx, false);
        this.calculateEntryTotal(entry, trx);
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
        this.calculateBalanceDue();
    };
    ProformaInvoiceComponent.prototype.calculateTotalDiscount = function () {
        var discount = 0;
        this.invFormData.entries.forEach(function (f) {
            discount += f.discountSum;
        });
        this.invFormData.voucherDetails.totalDiscount = discount;
    };
    ProformaInvoiceComponent.prototype.calculateTotalTaxSum = function () {
        var taxes = 0;
        var cess = 0;
        this.invFormData.entries.forEach(function (f) {
            taxes += f.taxSum;
        });
        this.invFormData.entries.forEach(function (f) {
            cess += f.cessSum;
        });
        this.invFormData.voucherDetails.gstTaxesTotal = taxes;
        this.invFormData.voucherDetails.cessTotal = cess;
        this.invFormData.voucherDetails.totalTaxableValue = this.invFormData.voucherDetails.subTotal - this.invFormData.voucherDetails.totalDiscount;
    };
    ProformaInvoiceComponent.prototype.calculateTcsTdsTotal = function () {
        var tcsSum = 0;
        var tdsSum = 0;
        this.invFormData.entries.forEach(function (entry) {
            tcsSum += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
            tdsSum += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
        });
        this.invFormData.voucherDetails.tcsTotal = tcsSum;
        this.invFormData.voucherDetails.tdsTotal = tdsSum;
    };
    ProformaInvoiceComponent.prototype.calculateBalanceDue = function () {
        var count = 0;
        this.invFormData.entries.forEach(function (f) {
            count += f.transactions.reduce(function (pv, cv) {
                return pv + cv.total;
            }, 0);
        });
        this.invFormData.voucherDetails.balanceDue =
            ((count + this.invFormData.voucherDetails.tcsTotal) - this.invFormData.voucherDetails.tdsTotal) - Number(this.depositAmount) - Number(this.depositAmountAfterUpdate);
        this.invFormData.voucherDetails.balanceDue = this.invFormData.voucherDetails.balanceDue + this.calculatedRoundOff;
    };
    ProformaInvoiceComponent.prototype.calculateSubTotal = function () {
        var count = 0;
        this.invFormData.entries.forEach(function (f) {
            count += f.transactions.reduce(function (pv, cv) {
                return pv + Number(cv.amount);
            }, 0);
        });
        this.invFormData.voucherDetails.subTotal = count;
    };
    ProformaInvoiceComponent.prototype.calculateGrandTotal = function () {
        var calculatedGrandTotal = 0;
        calculatedGrandTotal = this.invFormData.voucherDetails.grandTotal = this.invFormData.entries.reduce(function (pv, cv) {
            return pv + cv.transactions.reduce(function (pvt, cvt) { return pvt + cvt.total; }, 0);
        }, 0);
        //Save the Grand Total for Edit
        if (calculatedGrandTotal > 0) {
            this.calculatedRoundOff = Math.round(calculatedGrandTotal) - calculatedGrandTotal;
            calculatedGrandTotal = calculatedGrandTotal + this.calculatedRoundOff;
        }
        this.invFormData.voucherDetails.grandTotal = calculatedGrandTotal;
    };
    ProformaInvoiceComponent.prototype.generateTotalAmount = function (txns) {
        var _this = this;
        var res = 0;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["forEach"](txns, function (txn) {
            if (txn.quantity && txn.rate) {
                res += _this.checkForInfinity(txn.rate) * _this.checkForInfinity(txn.quantity);
            }
            else {
                res += Number(_this.checkForInfinity(txn.amount));
            }
        });
        return res;
    };
    ProformaInvoiceComponent.prototype.generateTotalTaxAmount = function (txns) {
        var _this = this;
        var res = 0;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["forEach"](txns, function (txn) {
            if (txn.total === 0) {
                res += 0;
            }
            else {
                res += _this.checkForInfinity((txn.total - txn.taxableValue));
            }
        });
        return res;
    };
    ProformaInvoiceComponent.prototype.onSelectSalesAccount = function (selectedAcc, txn, entry) {
        var _this = this;
        if (selectedAcc.value && selectedAcc.additional.uniqueName) {
            var o = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](selectedAcc.additional);
            // check if we have quantity in additional object. it's for only bulk add mode
            txn.quantity = o.quantity ? o.quantity : null;
            txn.applicableTaxes = [];
            txn.sku_and_customfields = null;
            // description with sku and custom fields
            // if ((o.stock) && (this.isCashInvoice || this.isSalesInvoice || this.isPurchaseInvoice)) {
            // condition removed as SKU Code need to be displayed in all case.
            if ((o.stock)) {
                var description = [];
                var skuCodeHeading = o.stock.skuCodeHeading ? o.stock.skuCodeHeading : 'SKU Code';
                if (o.stock.skuCode) {
                    description.push(skuCodeHeading + ':' + o.stock.skuCode);
                }
                var customField1Heading = o.stock.customField1Heading ? o.stock.customField1Heading : 'Custom field 1';
                if (o.stock.customField1Value) {
                    description.push(customField1Heading + ':' + o.stock.customField1Value);
                }
                var customField2Heading = o.stock.customField2Heading ? o.stock.customField2Heading : 'Custom field 2';
                if (o.stock.customField2Value) {
                    description.push(customField2Heading + ':' + o.stock.customField2Value);
                }
                txn.sku_and_customfields = description.join(', ');
            }
            //------------------------
            // assign taxes and create fluctuation
            if (o.stock && o.stock.stockTaxes) {
                o.stock.stockTaxes.forEach(function (t) {
                    var tax = _this.companyTaxesList.find(function (f) { return f.uniqueName === t; });
                    if (tax) {
                        switch (tax.taxType) {
                            case 'tcsrc':
                            case 'tcspay':
                            case 'tdsrc':
                            case 'tdspay':
                                entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                                entry.isOtherTaxApplicable = true;
                                break;
                            default:
                                txn.applicableTaxes.push(t);
                                break;
                        }
                    }
                });
            }
            else {
                // assign taxes for non stock accounts
                txn.applicableTaxes = o.applicableTaxes;
            }
            txn.accountName = o.name;
            txn.accountUniqueName = o.uniqueName;
            if (o.stocks && o.stock) {
                // set rate auto
                txn.rate = null;
                var obj = {
                    id: o.stock.stockUnit.code,
                    text: o.stock.stockUnit.name
                };
                txn.stockList = [];
                if (o.stock && o.stock.accountStockDetails.unitRates.length) {
                    txn.stockList = this.prepareUnitArr(o.stock.accountStockDetails.unitRates);
                    txn.stockUnit = txn.stockList[0].id;
                    txn.rate = txn.stockList[0].rate;
                }
                else {
                    txn.stockList.push(obj);
                    txn.stockUnit = o.stock.stockUnit.code;
                }
                txn.stockDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["omit"](o.stock, ['accountStockDetails', 'stockUnit']);
                txn.isStockTxn = true;
            }
            else {
                txn.isStockTxn = false;
                txn.stockUnit = null;
                txn.stockDetails = null;
                txn.stockList = [];
                // reset fields
                txn.rate = null;
                txn.quantity = null;
                txn.amount = 0;
                txn.taxableValue = 0;
            }
            txn.sacNumber = null;
            txn.hsnNumber = null;
            if (txn.stockDetails && txn.stockDetails.hsnNumber) {
                txn.hsnNumber = txn.stockDetails.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (txn.stockDetails && txn.stockDetails.sacNumber) {
                txn.sacNumber = txn.stockDetails.sacNumber;
                txn.hsnOrSac = 'sac';
            }
            if (!o.stock && o.hsnNumber) {
                txn.hsnNumber = o.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (!o.stock && o.sacNumber) {
                txn.sacNumber = o.sacNumber;
                txn.hsnOrSac = 'sac';
            }
            return txn;
            // }
            // });
            // });
        }
        else {
            txn.isStockTxn = false;
            txn.amount = 0;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'sac';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];
            return txn;
        }
    };
    ProformaInvoiceComponent.prototype.onClearSalesAccount = function (txn) {
        txn.applicableTaxes = [];
        txn.quantity = null;
        txn.isStockTxn = false;
        txn.stockUnit = null;
        txn.stockDetails = null;
        txn.stockList = [];
        txn.rate = null;
        txn.quantity = null;
        txn.amount = null;
        txn.taxableValue = null;
        txn.sacNumber = null;
        txn.hsnNumber = null;
    };
    ProformaInvoiceComponent.prototype.noResultsForCustomer = function (e) {
        this.typeaheadNoResultsOfCustomer = e;
    };
    ProformaInvoiceComponent.prototype.onSelectCustomer = function (item) {
        var _this = this;
        this.typeaheadNoResultsOfCustomer = false;
        if (item.value) {
            this.invFormData.voucherDetails.customerName = item.label;
            this.getAccountDetails(item.value);
            this.isCustomerSelected = true;
            this.invFormData.accountDetails.name = '';
            if (item.additional && item.additional.currency && item.additional.currency !== this.companyCurrency && this.isMultiCurrencyAllowed) {
                this._ledgerService.GetCurrencyRate(this.companyCurrency, item.additional.currency)
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["catchError"])(function (err) {
                    _this.fetchedConvertedRate = 0;
                    return err;
                }))
                    .subscribe(function (res) {
                    var rate = res.body;
                    if (rate) {
                        _this.fetchedConvertedRate = rate;
                    }
                }, (function (error1) {
                    _this.fetchedConvertedRate = 0;
                }));
            }
        }
    };
    ProformaInvoiceComponent.prototype.onSelectBankCash = function (item) {
        if (item.value) {
            this.invFormData.accountDetails.name = item.label;
            this.getAccountDetails(item.value);
        }
    };
    ProformaInvoiceComponent.prototype.getAccountDetails = function (accountUniqueName) {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    };
    ProformaInvoiceComponent.prototype.toggleAccountAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    ProformaInvoiceComponent.prototype.toggleRecurringAsidePane = function (toggle) {
        if (toggle) {
            if (toggle === 'out' && this.asideMenuStateForRecurringEntry !== 'out') {
                this.router.navigate(['/pages', 'invoice', 'recurring']);
            }
            this.asideMenuStateForRecurringEntry = toggle;
        }
        else {
            this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
        }
        this.toggleBodyClass();
    };
    ProformaInvoiceComponent.prototype.addBlankRow = function (txn) {
        if (!txn) {
            var entry = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesEntryClass"]();
            if (this.isUpdateMode) {
                entry.entryDate = this.invFormData.entries[0] ? this.invFormData.entries[0].entryDate : this.universalDate || new Date();
                entry.isNewEntryInUpdateMode = true;
            }
            else {
                entry.entryDate = this.universalDate || new Date();
            }
            this.invFormData.entries.push(entry);
        }
        else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this._toasty.warningToast('Product/Service can\'t be empty');
                return;
            }
            var entry = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesEntryClass"]();
            this.invFormData.entries.push(entry);
            // setTimeout(() => {
            this.activeIndx = this.invFormData.entries.length ? this.invFormData.entries.length - 1 : 0;
            // }, 10);
        }
    };
    ProformaInvoiceComponent.prototype.removeTransaction = function (entryIdx) {
        if (this.invFormData.entries.length > 1) {
            if (this.activeIndx === entryIdx) {
                this.activeIndx = null;
            }
            this.invFormData.entries = this.invFormData.entries.filter(function (entry, index) { return entryIdx !== index; });
        }
        else {
            this._toasty.warningToast('Unable to delete a single transaction');
        }
    };
    ProformaInvoiceComponent.prototype.taxAmountEvent = function (txn, entry) {
        txn.setAmount(entry);
        this.calculateBalanceDue();
    };
    ProformaInvoiceComponent.prototype.selectedDiscountEvent = function (txn, entry) {
        // call taxableValue method
        txn.setAmount(entry);
        this.calculateBalanceDue();
    };
    // get action type from aside window and open respective modal
    ProformaInvoiceComponent.prototype.getActionFromAside = function (e) {
        var _this = this;
        if (e.type === 'groupModal') {
            this.showCreateGroupModal = true;
            // delay just for ng cause
            setTimeout(function () {
                _this.createGroupModal.show();
            }, 1000);
        }
        else {
            this.showCreateAcModal = true;
            this.createAcCategory = e.type;
            // delay just for ng cause
            setTimeout(function () {
                _this.createAcModal.show();
            }, 1000);
        }
    };
    ProformaInvoiceComponent.prototype.closeCreateGroupModal = function (e) {
        this.createGroupModal.hide();
    };
    ProformaInvoiceComponent.prototype.customMoveGroupFilter = function (term, item) {
        var newItem = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item);
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        }
        else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    };
    ProformaInvoiceComponent.prototype.closeCreateAcModal = function () {
        this.createAcModal.hide();
    };
    ProformaInvoiceComponent.prototype.closeDiscountPopup = function () {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    };
    ProformaInvoiceComponent.prototype.closeTaxControlPopup = function () {
        if (this.taxControlComponent) {
            this.taxControlComponent.showTaxPopup = false;
        }
    };
    ProformaInvoiceComponent.prototype.setActiveIndx = function (indx) {
        setTimeout(function () {
            var focused = $('.focused');
            if (focused && focused[indx]) {
                $('.focused')[indx].focus();
            }
        }, 200);
        this.activeIndx = indx;
    };
    ProformaInvoiceComponent.prototype.doAction = function (action) {
        this.actionAfterGenerateORUpdate = action;
    };
    ProformaInvoiceComponent.prototype.postResponseAction = function (voucherNo) {
        switch (this.actionAfterGenerateORUpdate) {
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generate: {
                this.getAllLastInvoices();
                this.depositAccountUniqueName = '';
                this.depositAmount = 0;
                break;
            }
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generateAndClose: {
                this.router.navigate(['/pages', 'invoice', 'preview']);
                break;
            }
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generateAndPrint: {
                // this.fireActionAfterGenOrUpdVoucher(voucherNo, ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint);
                // this.router.navigate(['/pages', 'invoice', 'preview', this.parseVoucherType(this.invoiceType)]);
                this.printVoucherModal.show();
                break;
            }
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generateAndSend: {
                this.sendEmailModal.show();
                // this.fireActionAfterGenOrUpdVoucher(voucherNo, ActionTypeAfterVoucherGenerateOrUpdate.generateAndSend);
                break;
            }
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].updateSuccess: {
                this.updateVoucherSuccess();
                break;
            }
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].generateAndRecurring: {
                this.toggleRecurringAsidePane();
                break;
            }
        }
    };
    ProformaInvoiceComponent.prototype.resetCustomerName = function (event) {
        // console.log(event);
        if (event) {
            if (!event.target.value) {
                this.invFormData.voucherDetails.customerName = null;
                this.invFormData.voucherDetails.customerUniquename = null;
                this.isCustomerSelected = false;
                this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"]();
                this.invFormData.accountDetails.uniqueName = 'cash';
                // if we are in update mode and someone changes customer name then we should reset the voucher details
                if (this.isUpdateMode) {
                    this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                }
            }
        }
        else {
            this.invFormData.voucherDetails.customerName = null;
            this.invFormData.voucherDetails.tempCustomerName = null;
            this.isCustomerSelected = false;
            this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"]();
            this.invFormData.accountDetails.uniqueName = 'cash';
            // if we are in update mode and someone changes customer name then we should reset the voucher details
            if (this.isUpdateMode) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            }
        }
    };
    ProformaInvoiceComponent.prototype.ngOnChanges = function (s) {
        if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
            this.pageChanged(_models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].purchase, 'Purchase');
            this.isSalesInvoice = false;
        }
        if ('accountUniqueName' in s && s.accountUniqueName.currentValue && (s.accountUniqueName.currentValue !== s.accountUniqueName.previousValue)) {
            this.isCashInvoice = s.accountUniqueName.currentValue === 'cash';
        }
    };
    ProformaInvoiceComponent.prototype.onSelectPaymentMode = function (event) {
        if (event && event.value) {
            if (this.isCashInvoice) {
                this.invFormData.accountDetails.name = event.label;
                this.invFormData.accountDetails.uniqueName = event.value;
            }
            this.depositAccountUniqueName = event.value;
        }
        else {
            this.depositAccountUniqueName = '';
        }
    };
    ProformaInvoiceComponent.prototype.clickedInside = function ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // <- that will stop propagation on lower layers
    };
    ProformaInvoiceComponent.prototype.clickedOutside = function (event) {
        if (this.copyPreviousEstimate && this.copyPreviousEstimate.nativeElement && !this.copyPreviousEstimate.nativeElement.contains(event.target)) {
            this.showLastEstimateModal = false;
        }
        if (this.unregisteredBusiness && this.unregisteredBusiness.nativeElement && !this.unregisteredBusiness.nativeElement.contains(event.target)) {
            this.showGstTreatmentModal = false;
        }
    };
    ProformaInvoiceComponent.prototype.prepareUnitArr = function (unitArr) {
        var unitArray = [];
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["forEach"](unitArr, function (item) {
            unitArray.push({ id: item.stockUnitCode, text: item.stockUnitCode, rate: item.rate });
        });
        return unitArray;
    };
    ProformaInvoiceComponent.prototype.onChangeUnit = function (txn, selectedUnit) {
        if (!event) {
            return;
        }
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["find"](txn.stockList, function (o) {
            if (o.id === selectedUnit) {
                return txn.rate = o.rate;
            }
        });
    };
    ProformaInvoiceComponent.prototype.onUploadOutput = function (output) {
        if (output.type === 'allAddedToQueue') {
            var sessionKey_1 = null;
            var companyUniqueName_1 = null;
            this.sessionKey$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (a) { return sessionKey_1 = a; });
            this.companyName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (a) { return companyUniqueName_1 = a; });
            var event_1 = {
                type: 'uploadAll',
                url: _app_constant__WEBPACK_IMPORTED_MODULE_28__["Configuration"].ApiUrl + _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_29__["LEDGER_API"].UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName_1),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName_1 },
                headers: { 'Session-Id': sessionKey_1 },
            };
            this.uploadInput.emit(event_1);
        }
        else if (output.type === 'start') {
            this.isFileUploading = true;
        }
        else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.invFormData.entries[0].attachedFile = output.file.response.body.uniqueName;
                this.invFormData.entries[0].attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            }
            else {
                this.isFileUploading = false;
                this.invFormData.entries[0].attachedFile = '';
                this.invFormData.entries[0].attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    };
    ProformaInvoiceComponent.prototype.cancelUpdate = function () {
        this.cancelVoucherUpdate.emit(true);
    };
    ProformaInvoiceComponent.prototype.onFileChange = function (event) {
        this.file = event.files.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        }
        else {
            this.selectedFileName = '';
        }
    };
    ProformaInvoiceComponent.prototype.addBulkStockItems = function (items) {
        this.isAddBulkItemInProcess = true;
        var salesAccs = [];
        this.salesAccounts$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (data) { return salesAccs = data; });
        var _loop_1 = function (item) {
            var salesItem = salesAccs.find(function (f) { return f.value === item.uniqueName; });
            if (salesItem) {
                // add quantity to additional because we are using quantity from bulk modal so we have to pass it to onSelectSalesAccount
                salesItem.additional = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, salesItem.additional, { quantity: item.quantity });
                var lastIndex = -1;
                var blankItemIndex = this_1.invFormData.entries.findIndex(function (f) { return !f.transactions[0].accountUniqueName; });
                if (blankItemIndex > -1) {
                    lastIndex = blankItemIndex;
                    this_1.invFormData.entries[lastIndex] = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesEntryClass"]();
                }
                else {
                    this_1.invFormData.entries.push(new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesEntryClass"]());
                    lastIndex = this_1.invFormData.entries.length - 1;
                }
                this_1.activeIndx = lastIndex;
                this_1.invFormData.entries[lastIndex].entryDate = this_1.universalDate;
                this_1.invFormData.entries[lastIndex].transactions[0].fakeAccForSelect2 = salesItem.value;
                this_1.invFormData.entries[lastIndex].isNewEntryInUpdateMode = true;
                this_1.onSelectSalesAccount(salesItem, this_1.invFormData.entries[lastIndex].transactions[0], this_1.invFormData.entries[lastIndex]);
                this_1.calculateStockEntryAmount(this_1.invFormData.entries[lastIndex].transactions[0]);
                this_1.calculateWhenTrxAltered(this_1.invFormData.entries[lastIndex], this_1.invFormData.entries[lastIndex].transactions[0]);
            }
        };
        var this_1 = this;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            _loop_1(item);
        }
    };
    ProformaInvoiceComponent.prototype.addNewSidebarAccount = function (item) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    };
    ProformaInvoiceComponent.prototype.updateSidebarAccount = function (item) {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    };
    ProformaInvoiceComponent.prototype.addNewAccount = function () {
        this.selectedCustomerForDetails = null;
        this.invFormData.voucherDetails.customerName = null;
        this.invFormData.voucherDetails.customerUniquename = null;
        this.isCustomerSelected = false;
        this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["AccountDetailsClass"]();
        this.toggleAccountAsidePane();
    };
    ProformaInvoiceComponent.prototype.getCustomerDetails = function () {
        this.selectedCustomerForDetails = this.invFormData.accountDetails.uniqueName;
        this.toggleAccountAsidePane();
    };
    ProformaInvoiceComponent.prototype.addAccountFromShortcut = function () {
        this.toggleAccountAsidePane();
    };
    ProformaInvoiceComponent.prototype.submitUpdateForm = function (f) {
        var _this = this;
        var result = this.prepareDataForApi();
        if (!result) {
            return;
        }
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.updateProforma(result));
        }
        else {
            this.salesService.updateVoucher(result).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["takeUntil"])(this.destroyed$))
                .subscribe(function (response) {
                if (response.status === 'success') {
                    // reset form and other
                    _this.resetInvoiceForm(f);
                    _this._toasty.successToast('Voucher updated Successfully');
                    _this.store.dispatch(_this.invoiceReceiptActions.updateVoucherDetailsAfterVoucherUpdate(response));
                    _this.doAction(_models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].updateSuccess);
                    _this.postResponseAction(_this.invoiceNo);
                    _this.depositAccountUniqueName = '';
                    _this.depositAmount = 0;
                    _this.isUpdateMode = false;
                }
                else {
                    _this._toasty.errorToast(response.message, response.code);
                }
                _this.updateAccount = false;
            }, function (err) {
                _this._toasty.errorToast('Something went wrong! Try again');
            });
        }
    };
    ProformaInvoiceComponent.prototype.prepareDataForApi = function () {
        var _this = this;
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_26__["cloneDeep"](this.invFormData);
        if (data.accountDetails.billingDetails.gstNumber) {
            if (!this.isValidGstIn(data.accountDetails.billingDetails.gstNumber)) {
                this._toasty.errorToast('Invalid gst no in Billing Address! Please fix and try again');
                return;
            }
            if (!this.autoFillShipping) {
                if (!this.isValidGstIn(data.accountDetails.shippingDetails.gstNumber)) {
                    this._toasty.errorToast('Invalid gst no in Shipping Address! Please fix and try again');
                    return;
                }
            }
        }
        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            if (moment_moment__WEBPACK_IMPORTED_MODULE_25__(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment_moment__WEBPACK_IMPORTED_MODULE_25__(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        }
        else {
            delete data.voucherDetails.dueDate;
        }
        data.entries = data.entries.filter(function (entry, indx) {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                _this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });
        data.entries = data.entries.map(function (entry) {
            // filter active discounts
            entry.discounts = entry.discounts.filter(function (dis) { return dis.isActive; });
            // filter active taxes
            entry.taxes = entry.taxes.filter(function (tax) { return tax.isChecked; });
            return entry;
        });
        var txnErr;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                }
                else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!_shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_27__["EMAIL_REGEX_PATTERN"].test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
            delete data.accountDetails.billingDetails['stateName'];
            delete data.accountDetails.shippingDetails['stateName'];
        }
        // replace /n to br for (shipping and billing)
        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }
        // convert date object
        if (this.isProformaInvoice) {
            data.voucherDetails.proformaDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        else if (this.isEstimateInvoice) {
            data.voucherDetails.estimateDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        else {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);
        // check for valid entries and transactions
        if (data.entries) {
            data.entries.forEach(function (entry) {
                entry.transactions.forEach(function (txn) {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(entry.entryDate, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"]);
                    if (_this.isUpdateMode) {
                        // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                        if (txn.stockList && txn.stockList.length) {
                            txn.accountUniqueName = txn.accountUniqueName.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName.indexOf('#')) : txn.accountUniqueName;
                            txn.fakeAccForSelect2 = txn.accountUniqueName.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2.indexOf('#')) : txn.fakeAccForSelect2;
                        }
                    }
                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        _this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    }
                    else {
                        txnErr = false;
                    }
                });
            });
        }
        else {
            this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
            return;
        }
        // if txn has errors
        if (txnErr) {
            return null;
        }
        // set voucher type
        data.entries = data.entries.map(function (entry) {
            entry.voucherType = _this.parseVoucherType(_this.invoiceType);
            entry.taxList = entry.taxes.map(function (m) { return m.uniqueName; });
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;
            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }
            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });
        var obj = {
            voucher: data,
            updateAccountDetails: this.updateAccount
        };
        if (this.isUpdateMode) {
            obj.entryUniqueNames = data.entries.map(function (m) { return m.uniqueName; });
        }
        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                // action: 'paid',
                amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            }
            else {
                obj.depositAccountUniqueName = data.accountDetails.uniqueName;
            }
        }
        else {
            obj.depositAccountUniqueName = '';
        }
        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.parseVoucherType(this.invoiceType);
        return obj;
    };
    ProformaInvoiceComponent.prototype.getAllLastInvoices = function () {
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            var filterRequest = new _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_33__["ProformaFilter"]();
            filterRequest.sortBy = this.isProformaInvoice ? 'proformaDate' : 'estimateDate';
            filterRequest.sort = 'desc';
            filterRequest.count = 5;
            filterRequest.isLastInvoicesRequest = true;
            this.store.dispatch(this.proformaActions.getAll(filterRequest, this.isProformaInvoice ? 'proformas' : 'estimates'));
        }
        else {
            var request = new _models_api_models_recipt__WEBPACK_IMPORTED_MODULE_35__["InvoiceReceiptFilter"]();
            request.sortBy = 'voucherDate';
            request.sort = 'desc';
            request.count = 5;
            request.isLastInvoicesRequest = true;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.parseVoucherType(this.invoiceType)));
        }
    };
    ProformaInvoiceComponent.prototype.getLastInvoiceDetails = function (obj) {
        this.accountUniqueName = obj.accountUniqueName;
        this.invoiceNo = obj.invoiceNo;
        this.isLastInvoiceCopied = true;
        this.showLastEstimateModal = false;
        this.getVoucherDetailsFromInputs();
    };
    ProformaInvoiceComponent.prototype.calculateOtherTaxes = function (modal, entryObj) {
        var entry;
        entry = entryObj ? entryObj : this.invFormData.entries[this.activeIndx];
        var taxableValue = 0;
        var totalTaxes = 0;
        if (!entry) {
            return;
        }
        if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            var tax = this.companyTaxesList.find(function (ct) { return ct.uniqueName === modal.appliedOtherTax.uniqueName; });
            if (['tcsrc', 'tcspay'].includes(tax.taxType)) {
                if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                }
                else if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesCalculationMethodEnum"].OnTotalAmount) {
                    var rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                }
                entry.otherTaxType = 'tcs';
            }
            else {
                taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                entry.otherTaxType = 'tds';
            }
            totalTaxes += tax.taxDetail[0].taxValue;
            entry.otherTaxSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])(((taxableValue * totalTaxes) / 100), 2);
            entry.otherTaxModal = modal;
        }
        else {
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesModal"]();
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
        }
        // this.selectedEntry = null;
    };
    ProformaInvoiceComponent.prototype.calculateAffectedThingsFromOtherTaxChanges = function () {
        this.calculateTcsTdsTotal();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    };
    ProformaInvoiceComponent.prototype.sendEmail = function (request) {
        if (this.isEstimateInvoice || this.isProformaInvoice) {
            var req = new _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_33__["ProformaGetRequest"]();
            req.accountUniqueName = this.accountUniqueName;
            if (this.isProformaInvoice) {
                req.proformaNumber = this.invoiceNo;
            }
            else {
                req.estimateNumber = this.invoiceNo;
            }
            req.emailId = request.split(',');
            this.store.dispatch(this.proformaActions.sendMail(req, this.invoiceType));
        }
        else {
            request = request;
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.accountUniqueName, {
                emailId: request.email.split(','),
                voucherNumber: [this.invoiceNo],
                voucherType: this.invoiceType,
                typeOfInvoice: request.invoiceType ? request.invoiceType : []
            }));
        }
        this.cancelEmailModal();
    };
    ProformaInvoiceComponent.prototype.cancelEmailModal = function () {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.sendEmailModal.hide();
    };
    ProformaInvoiceComponent.prototype.cancelPrintModal = function () {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.printVoucherModal.hide();
    };
    ProformaInvoiceComponent.prototype.getVoucherDetailsFromInputs = function () {
        if (!this.isLastInvoiceCopied) {
            this.getAccountDetails(this.accountUniqueName);
        }
        this.isUpdateMode = !this.isLastInvoiceCopied;
        this.isUpdateDataInProcess = true;
        this.prepareInvoiceTypeFlags();
        this.toggleFieldForSales = (!(this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].debitNote || this.invoiceType === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].creditNote));
        if (!this.isProformaInvoice && !this.isEstimateInvoice) {
            this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(this.accountUniqueName, {
                invoiceNumber: this.invoiceNo,
                voucherType: this.parseVoucherType(this.invoiceType)
            }));
        }
        else {
            var obj = new _models_api_models_proforma__WEBPACK_IMPORTED_MODULE_33__["ProformaGetRequest"]();
            obj.accountUniqueName = this.accountUniqueName;
            if (this.isProformaInvoice) {
                obj.proformaNumber = this.invoiceNo;
            }
            else {
                obj.estimateNumber = this.invoiceNo;
            }
            this.store.dispatch(this.proformaActions.getProformaDetails(obj, this.invoiceType));
        }
    };
    ProformaInvoiceComponent.prototype.parseEntriesFromResponse = function (entries, flattenAccounts) {
        var _this = this;
        return entries.map(function (entry, index) {
            _this.activeIndx = index;
            entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesModal"]();
            entry.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_25__(entry.entryDate, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_24__["GIDDH_DATE_FORMAT"]).toDate();
            entry.discounts = _this.parseDiscountFromResponse(entry);
            entry.transactions = entry.transactions.map(function (trx) {
                entry.otherTaxModal.itemLabel = trx.stockDetails && trx.stockDetails.name ? trx.accountName + '(' + trx.stockDetails.name + ')' : trx.accountName;
                var newTrxObj = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesTransactionItemClass"]();
                newTrxObj.accountName = trx.accountName;
                newTrxObj.amount = trx.amount;
                newTrxObj.description = trx.description;
                newTrxObj.stockDetails = trx.stockDetails;
                newTrxObj.taxableValue = trx.taxableValue;
                newTrxObj.hsnNumber = trx.hsnNumber;
                newTrxObj.isStockTxn = trx.isStockTxn;
                newTrxObj.applicableTaxes = entry.taxList;
                // check if stock details is available then assign uniquename as we have done while creating option
                if (trx.isStockTxn) {
                    newTrxObj.accountUniqueName = trx.accountUniqueName + "#" + trx.stockDetails.uniqueName;
                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName + "#" + trx.stockDetails.uniqueName;
                    // stock unit assign process
                    // get account from flatten account
                    var selectedAcc = flattenAccounts.find(function (d) {
                        return (d.uniqueName === trx.accountUniqueName);
                    });
                    if (selectedAcc) {
                        // get stock from flatten account
                        var stock = selectedAcc.stocks.find(function (s) { return s.uniqueName === trx.stockDetails.uniqueName; });
                        if (stock && newTrxObj) {
                            // description with sku and custom fields
                            newTrxObj.sku_and_customfields = null;
                            if (_this.isCashInvoice || _this.isSalesInvoice || _this.isPurchaseInvoice) {
                                var description = [];
                                var skuCodeHeading = stock.skuCodeHeading ? stock.skuCodeHeading : 'SKU Code';
                                if (stock.skuCode) {
                                    description.push(skuCodeHeading + ':' + stock.skuCode);
                                }
                                var customField1Heading = stock.customField1Heading ? stock.customField1Heading : 'Custom field 1';
                                if (stock.customField1Value) {
                                    description.push(customField1Heading + ':' + stock.customField1Value);
                                }
                                var customField2Heading = stock.customField2Heading ? stock.customField2Heading : 'Custom field 2';
                                if (stock.customField2Value) {
                                    description.push(customField2Heading + ':' + stock.customField2Value);
                                }
                                newTrxObj.sku_and_customfields = description.join(', ');
                            }
                            //------------------------
                            var stockUnit = {
                                id: stock.stockUnit.code,
                                text: stock.stockUnit.name
                            };
                            newTrxObj.stockList = [];
                            if (stock.accountStockDetails.unitRates.length) {
                                newTrxObj.stockList = _this.prepareUnitArr(stock.accountStockDetails.unitRates);
                            }
                            else {
                                newTrxObj.stockList.push(stockUnit);
                            }
                        }
                    }
                    newTrxObj.quantity = trx.quantity;
                    newTrxObj.rate = trx.rate;
                    newTrxObj.stockUnit = trx.stockUnit;
                }
                else {
                    newTrxObj.accountUniqueName = trx.accountUniqueName;
                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName;
                }
                _this.calculateTotalDiscountOfEntry(entry, trx, false);
                _this.calculateEntryTaxSum(entry, trx);
                return newTrxObj;
            });
            // tcs tax calculation
            if (entry.tcsTaxList && entry.tcsTaxList.length) {
                entry.isOtherTaxApplicable = true;
                entry.otherTaxModal.tcsCalculationMethod = entry.tcsCalculationMethod;
                entry.otherTaxType = 'tcs';
                var tax = _this.companyTaxesList.find(function (f) { return f.uniqueName === entry.tcsTaxList[0]; });
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                    var taxableValue = 0;
                    if (entry.otherTaxModal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount) {
                        taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    }
                    else if (entry.otherTaxModal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesCalculationMethodEnum"].OnTotalAmount) {
                        var rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                        taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                    }
                    entry.otherTaxSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])(((taxableValue * tax.taxDetail[0].taxValue) / 100), 2);
                }
            }
            else if (entry.tdsTaxList && entry.tdsTaxList.length) {
                // tds tax calculation
                entry.isOtherTaxApplicable = true;
                entry.otherTaxModal.tcsCalculationMethod = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount;
                entry.otherTaxType = 'tds';
                var tax = _this.companyTaxesList.find(function (f) { return f.uniqueName === entry.tdsTaxList[0]; });
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                    var taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    entry.otherTaxSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])(((taxableValue * tax.taxDetail[0].taxValue) / 100), 2);
                }
            }
            entry.taxes = [];
            entry.cessSum = 0;
            return entry;
        });
    };
    ProformaInvoiceComponent.prototype.parseDiscountFromResponse = function (entry) {
        var discountArray = [];
        var defaultDiscountIndex = entry.tradeDiscounts.findIndex(function (f) { return !f.discount.uniqueName; });
        if (defaultDiscountIndex > -1) {
            discountArray.push({
                discountType: entry.tradeDiscounts[defaultDiscountIndex].discount.discountType,
                amount: entry.tradeDiscounts[defaultDiscountIndex].discount.discountValue,
                discountValue: entry.tradeDiscounts[defaultDiscountIndex].discount.discountValue,
                discountUniqueName: entry.tradeDiscounts[defaultDiscountIndex].discount.uniqueName,
                name: entry.tradeDiscounts[defaultDiscountIndex].discount.name,
                particular: entry.tradeDiscounts[defaultDiscountIndex].account.uniqueName,
                isActive: true
            });
        }
        else {
            discountArray.push({
                discountType: 'FIX_AMOUNT',
                amount: 0,
                name: '',
                particular: '',
                isActive: true,
                discountValue: 0
            });
        }
        entry.tradeDiscounts.forEach(function (f, ind) {
            if (ind !== defaultDiscountIndex) {
                discountArray.push({
                    discountType: f.discount.discountType,
                    amount: f.discount.discountValue,
                    name: f.discount.name,
                    particular: f.account.uniqueName,
                    isActive: true,
                    discountValue: f.discount.discountValue,
                    discountUniqueName: f.discount.uniqueName
                });
            }
        });
        return discountArray;
    };
    ProformaInvoiceComponent.prototype.isValidGstIn = function (no) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]$/g.test(no);
    };
    ProformaInvoiceComponent.prototype.parseVoucherType = function (voucher) {
        // return sales because we don't have cash as voucher type in api so we have to handle it manually
        if (voucher === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].cash) {
            return _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["VoucherTypeEnum"].sales;
        }
        return voucher;
    };
    ProformaInvoiceComponent.prototype.updateVoucherSuccess = function () {
        this.fireActionAfterGenOrUpdVoucher(this.invoiceNo, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_17__["ActionTypeAfterVoucherGenerateOrUpdate"].updateSuccess);
        this.cancelVoucherUpdate.emit(true);
    };
    ProformaInvoiceComponent.prototype.fireActionAfterGenOrUpdVoucher = function (voucherNo, action) {
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.setVoucherForDetails(voucherNo, action));
        }
        else {
            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(voucherNo, action));
        }
    };
    ProformaInvoiceComponent.prototype.saveStateDetails = function () {
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_18__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_23__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'proforma-invoice/invoice/' + this.invoiceType;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this.store.dispatch(this._generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + this.invoiceType));
    };
    ProformaInvoiceComponent.prototype.ngOnDestroy = function () {
        if (!this.isProformaInvoice && !this.isEstimateInvoice) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        }
        else {
            this.store.dispatch(this.proformaActions.resetActiveVoucher());
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], ProformaInvoiceComponent.prototype, "isPurchaseInvoice", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ProformaInvoiceComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ProformaInvoiceComponent.prototype, "invoiceNo", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ProformaInvoiceComponent.prototype, "invoiceType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_20__["ElementViewContainerRef"])
    ], ProformaInvoiceComponent.prototype, "elementViewContainerRef", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('createGroupModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], ProformaInvoiceComponent.prototype, "createGroupModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('createAcModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], ProformaInvoiceComponent.prototype, "createAcModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('bulkItemsModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], ProformaInvoiceComponent.prototype, "bulkItemsModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('sendEmailModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], ProformaInvoiceComponent.prototype, "sendEmailModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('printVoucherModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ModalDirective"])
    ], ProformaInvoiceComponent.prototype, "printVoucherModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('copyPreviousEstimate'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], ProformaInvoiceComponent.prototype, "copyPreviousEstimate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('unregisteredBusiness'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], ProformaInvoiceComponent.prototype, "unregisteredBusiness", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('invoiceForm', { read: _angular_forms__WEBPACK_IMPORTED_MODULE_21__["NgForm"] }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_21__["NgForm"])
    ], ProformaInvoiceComponent.prototype, "invoiceForm", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('discountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _sales_discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_22__["DiscountListComponent"])
    ], ProformaInvoiceComponent.prototype, "discountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_37__["TaxControlComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_37__["TaxControlComponent"])
    ], ProformaInvoiceComponent.prototype, "taxControlComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('customerNameDropDown'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_31__["ShSelectComponent"])
    ], ProformaInvoiceComponent.prototype, "customerNameDropDown", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], ProformaInvoiceComponent.prototype, "cancelVoucherUpdate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('document:click', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], ProformaInvoiceComponent.prototype, "clickedOutside", null);
    ProformaInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'proforma-invoice-component',
            template: __webpack_require__(/*! ./proforma-invoice.component.html */ "./src/app/proforma-invoice/proforma-invoice.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./proforma-invoice.component.scss */ "./src/app/proforma-invoice/proforma-invoice.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsModalService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_5__["AccountService"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_6__["SalesActions"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_7__["CompanyActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["Router"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__["LedgerActions"],
            _services_sales_service__WEBPACK_IMPORTED_MODULE_10__["SalesService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_11__["ToasterService"],
            _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_12__["GeneralActions"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_13__["InvoiceActions"],
            _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_14__["SettingsDiscountActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_8__["ActivatedRoute"],
            _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_15__["InvoiceReceiptActions"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_13__["InvoiceActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_16__["SettingsProfileActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"],
            _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_30__["BreakpointObserver"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"],
            _actions_proforma_proforma_actions__WEBPACK_IMPORTED_MODULE_32__["ProformaActions"],
            _services_ledger_service__WEBPACK_IMPORTED_MODULE_36__["LedgerService"],
            _services_general_service__WEBPACK_IMPORTED_MODULE_38__["GeneralService"]])
    ], ProformaInvoiceComponent);
    return ProformaInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice.module.ts ***!
  \*************************************************************/
/*! exports provided: ProformaInvoiceModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaInvoiceModule", function() { return ProformaInvoiceModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./proforma-invoice.component */ "./src/app/proforma-invoice/proforma-invoice.component.ts");
/* harmony import */ var _proforma_invoice_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./proforma-invoice.routing.module */ "./src/app/proforma-invoice/proforma-invoice.routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/helpers/directives/keyboardShortcut/keyboardShortut.module */ "./src/app/shared/helpers/directives/keyboardShortcut/keyboardShortut.module.ts");
/* harmony import */ var _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../theme/sales-ng-virtual-select/sh-select.module */ "./src/app/theme/sales-ng-virtual-select/sh-select.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var ngx_uploader__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-uploader */ "../../node_modules/ngx-uploader/fesm5/ngx-uploader.js");
/* harmony import */ var _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../shared/helpers/directives/digitsOnly/digitsOnly.module */ "./src/app/shared/helpers/directives/digitsOnly/digitsOnly.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _shared_aside_menu_recurring_entry_aside_menu_recurringEntry_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module */ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module.ts");
/* harmony import */ var _components_proforma_add_bulk_items_proforma_add_bulk_items_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/proforma-add-bulk-items/proforma-add-bulk-items.component */ "./src/app/proforma-invoice/components/proforma-add-bulk-items/proforma-add-bulk-items.component.ts");
/* harmony import */ var _components_proforma_last_invoices_proforma_last_invoices_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/proforma-last-invoices/proforma-last-invoices.component */ "./src/app/proforma-invoice/components/proforma-last-invoices/proforma-last-invoices.component.ts");
/* harmony import */ var _components_proforma_gst_treatment_proforma_gst_treatment_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/proforma-gst-treatment/proforma-gst-treatment.component */ "./src/app/proforma-invoice/components/proforma-gst-treatment/proforma-gst-treatment.component.ts");
/* harmony import */ var _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../theme/tax-control/tax-control.module */ "./src/app/theme/tax-control/tax-control.module.ts");
/* harmony import */ var _theme_discount_control_discount_control_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../theme/discount-control/discount-control.module */ "./src/app/theme/discount-control/discount-control.module.ts");
/* harmony import */ var _proforma_invoice_renderer_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./proforma-invoice-renderer.component */ "./src/app/proforma-invoice/proforma-invoice-renderer.component.ts");
/* harmony import */ var _shared_generic_aside_menu_account_generic_aside_menu_account_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../shared/generic-aside-menu-account/generic-aside-menu-account.module */ "./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts");
/* harmony import */ var _components_aside_menu_product_service_components_create_stock_sales_create_stock_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/aside-menu-product-service/components/create-stock/sales.create.stock.component */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock/sales.create.stock.component.ts");
/* harmony import */ var _components_aside_menu_product_service_components_create_stock_group_modal_create_stock_group_modal__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal.ts");
/* harmony import */ var _components_aside_menu_product_service_components_create_account_modal_create_account_modal__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/aside-menu-product-service/components/create-account-modal/create.account.modal */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-modal/create.account.modal.ts");
/* harmony import */ var _components_aside_menu_product_service_components_create_account_service_create_account_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./components/aside-menu-product-service/components/create-account-service/create.account.service */ "./src/app/proforma-invoice/components/aside-menu-product-service/components/create-account-service/create.account.service.ts");
/* harmony import */ var _components_aside_menu_product_service_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./components/aside-menu-product-service/component */ "./src/app/proforma-invoice/components/aside-menu-product-service/component.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _shared_send_email_invoice_send_email_invoice_module__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../shared/send-email-invoice/send-email-invoice.module */ "./src/app/shared/send-email-invoice/send-email-invoice.module.ts");
/* harmony import */ var _shared_header_pipe_voucherTypeToNamePipe_voucherTypeToNamePipe_module__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module */ "./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module.ts");
/* harmony import */ var _components_proforma_print_inplace_proforma_print_in_place_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/proforma-print-inplace/proforma-print-in-place.component */ "./src/app/proforma-invoice/components/proforma-print-inplace/proforma-print-in-place.component.ts");
/* harmony import */ var ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ng2-pdfjs-viewer */ "../../node_modules/ng2-pdfjs-viewer/ng2-pdfjs-viewer.umd.js");
/* harmony import */ var ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_32__);

































var ProformaInvoiceModule = /** @class */ (function () {
    function ProformaInvoiceModule() {
    }
    ProformaInvoiceModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _proforma_invoice_routing_module__WEBPACK_IMPORTED_MODULE_3__["ProformaInvoiceRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_6__["ShSelectModule"],
                _shared_helpers_directives_keyboardShortcut_keyboardShortut_module__WEBPACK_IMPORTED_MODULE_7__["KeyboardShortutModule"],
                _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_8__["SalesShSelectModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["BsDatepickerModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_10__["DecimalDigitsModule"],
                // SalesModule,
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["CollapseModule"],
                ngx_uploader__WEBPACK_IMPORTED_MODULE_11__["NgxUploaderModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["BsDropdownModule"],
                _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_12__["DigitsOnlyModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__["SharedModule"],
                _shared_aside_menu_recurring_entry_aside_menu_recurringEntry_module__WEBPACK_IMPORTED_MODULE_14__["AsideMenuRecurringEntryModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalModule"],
                _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_18__["TaxControlModule"],
                _theme_discount_control_discount_control_module__WEBPACK_IMPORTED_MODULE_19__["DiscountControlModule"],
                _shared_generic_aside_menu_account_generic_aside_menu_account_module__WEBPACK_IMPORTED_MODULE_21__["GenericAsideMenuAccountModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_27__["LaddaModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_28__["SelectModule"].forRoot(),
                _shared_send_email_invoice_send_email_invoice_module__WEBPACK_IMPORTED_MODULE_29__["SendEmailInvoiceModule"],
                _shared_header_pipe_voucherTypeToNamePipe_voucherTypeToNamePipe_module__WEBPACK_IMPORTED_MODULE_30__["VoucherTypeToNamePipeModule"],
                ng2_pdfjs_viewer__WEBPACK_IMPORTED_MODULE_32__["PdfJsViewerModule"]
            ],
            exports: [_proforma_invoice_component__WEBPACK_IMPORTED_MODULE_2__["ProformaInvoiceComponent"]],
            declarations: [
                _proforma_invoice_renderer_component__WEBPACK_IMPORTED_MODULE_20__["ProformaInvoiceRendererComponent"],
                _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_2__["ProformaInvoiceComponent"],
                _components_proforma_add_bulk_items_proforma_add_bulk_items_component__WEBPACK_IMPORTED_MODULE_15__["ProformaAddBulkItemsComponent"],
                _components_proforma_last_invoices_proforma_last_invoices_component__WEBPACK_IMPORTED_MODULE_16__["ProformaLastInvoicesComponent"],
                _components_proforma_gst_treatment_proforma_gst_treatment_component__WEBPACK_IMPORTED_MODULE_17__["ProformaGstTreatmentComponent"],
                _components_aside_menu_product_service_components_create_stock_sales_create_stock_component__WEBPACK_IMPORTED_MODULE_22__["SalesAddStockComponent"],
                _components_aside_menu_product_service_components_create_stock_group_modal_create_stock_group_modal__WEBPACK_IMPORTED_MODULE_23__["SalesAddStockGroupComponent"],
                _components_aside_menu_product_service_components_create_account_modal_create_account_modal__WEBPACK_IMPORTED_MODULE_24__["CreateAccountModalComponent"],
                _components_aside_menu_product_service_components_create_account_service_create_account_service__WEBPACK_IMPORTED_MODULE_25__["CreateAccountServiceComponent"],
                _components_aside_menu_product_service_component__WEBPACK_IMPORTED_MODULE_26__["AsideMenuProductServiceComponent"],
                _components_proforma_print_inplace_proforma_print_in_place_component__WEBPACK_IMPORTED_MODULE_31__["ProformaPrintInPlaceComponent"]
            ],
            providers: [],
        })
    ], ProformaInvoiceModule);
    return ProformaInvoiceModule;
}());



/***/ }),

/***/ "./src/app/proforma-invoice/proforma-invoice.routing.module.ts":
/*!*********************************************************************!*\
  !*** ./src/app/proforma-invoice/proforma-invoice.routing.module.ts ***!
  \*********************************************************************/
/*! exports provided: ProformaInvoiceRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProformaInvoiceRoutingModule", function() { return ProformaInvoiceRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./proforma-invoice.component */ "./src/app/proforma-invoice/proforma-invoice.component.ts");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _proforma_invoice_renderer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./proforma-invoice-renderer.component */ "./src/app/proforma-invoice/proforma-invoice-renderer.component.ts");






var routes = [
    {
        path: '',
        component: _proforma_invoice_renderer_component__WEBPACK_IMPORTED_MODULE_5__["ProformaInvoiceRendererComponent"],
        children: [
            {
                path: '', redirectTo: 'invoice/proformas', pathMatch: 'full'
            },
            {
                path: 'invoice/:invoiceType', component: _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_3__["ProformaInvoiceComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName', component: _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_3__["ProformaInvoiceComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName/:invoiceNo', component: _proforma_invoice_component__WEBPACK_IMPORTED_MODULE_3__["ProformaInvoiceComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_4__["NeedsAuthentication"]]
            }
        ]
    }
];
var ProformaInvoiceRoutingModule = /** @class */ (function () {
    function ProformaInvoiceRoutingModule() {
    }
    ProformaInvoiceRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
            declarations: [],
        })
    ], ProformaInvoiceRoutingModule);
    return ProformaInvoiceRoutingModule;
}());



/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic-aside-menu-account.module.ts ***!
  \****************************************************************************************/
/*! exports provided: GenericAsideMenuAccountModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericAsideMenuAccountModule", function() { return GenericAsideMenuAccountModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./generic.aside.menu.account.component */ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shared.module */ "./src/app/shared/shared.module.ts");









var GenericAsideMenuAccountModule = /** @class */ (function () {
    function GenericAsideMenuAccountModule() {
    }
    GenericAsideMenuAccountModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__["GenericAsideMenuAccountComponent"]],
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsDatepickerModule"].forRoot(),
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_5__["LaddaModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_7__["SelectModule"],
                _shared_module__WEBPACK_IMPORTED_MODULE_8__["SharedModule"]
            ],
            exports: [_generic_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_6__["GenericAsideMenuAccountComponent"]]
        })
    ], GenericAsideMenuAccountModule);
    return GenericAsideMenuAccountModule;
}());



/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">{{selectedAccountUniqueName ? 'Update' : 'Create'}} Account</h3>\n  </div>\n\n  <div class=\"aside-body\">\n\n    <div class=\"form-group pdT2\">\n\n      <label class=\"mrB1\">Select Group</label>\n\n      <div class=\"ng-select-wrap liq\">\n\n        <ng-select placeholder=\"Select Group\" filterPlaceholder=\"Type to search...\" name=\"activeGroupUniqueName\"\n                   [(ngModel)]=\"activeGroupUniqueName\" [options]=\"flatAccountWGroupsList$ | async\" style=\"width:100%\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n\n      </div>\n    </div>\n\n\n    <ng-container *ngIf=\"!selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-add-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                       [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                       [isAccountNameAvailable$]=\"isAccountNameAvailable$\"\n                       [createAccountInProcess$]=\"createAccountInProcess$\" (submitClicked)=\"addNewAcSubmit($event)\"\n                       [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\" [showBankDetail]=\"showBankDetail\">\n      </account-add-new>\n    </ng-container>\n\n    <ng-container *ngIf=\"selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-update-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                          [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                          [createAccountInProcess$]=\"createAccountInProcess$\"\n                          [updateAccountInProcess$]=\"updateAccountInProcess$\"\n                          [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\"\n                          [showDeleteButton]=\"false\" [showBankDetail]=\"showBankDetail\" (submitClicked)=\"updateAccount($event)\"\n      >\n      </account-update-new>\n    </ng-container>\n\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: GenericAsideMenuAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericAsideMenuAccountComponent", function() { return GenericAsideMenuAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");







var GenericAsideMenuAccountComponent = /** @class */ (function () {
    function GenericAsideMenuAccountComponent(store, groupService, accountsAction) {
        this.store = store;
        this.groupService = groupService;
        this.accountsAction = accountsAction;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"](true);
        this.addEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.updateEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isGstEnabledAcc = true;
        this.isHsnSacEnabledAcc = false;
        this.showBankDetail = false;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        // account-add component's property
        this.flattenGroups$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.general.flattenGroups; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.fetchingAccUniqueName$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.fetchingAccUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.createAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.updateAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    GenericAsideMenuAccountComponent.prototype.ngOnInit = function () {
        //
        this.showBankDetail = this.activeGroupUniqueName === 'sundrycreditors';
    };
    GenericAsideMenuAccountComponent.prototype.addNewAcSubmit = function (accRequestObject) {
        this.addEvent.emit(accRequestObject);
    };
    GenericAsideMenuAccountComponent.prototype.updateAccount = function (accRequestObject) {
        this.updateEvent.emit(accRequestObject);
    };
    GenericAsideMenuAccountComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    GenericAsideMenuAccountComponent.prototype.getGroups = function (grpUniqueName) {
        var flattenGroups = [];
        this.flattenGroups$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) { return flattenGroups = data || []; });
        var items = flattenGroups.filter(function (grps) {
            return grps.groupUniqueName === grpUniqueName || grps.parentGroups.some(function (s) { return s.uniqueName === grpUniqueName; });
        });
        var flatGrps = items.map(function (m) {
            return { label: m.groupName, value: m.groupUniqueName };
        });
        this.flatAccountWGroupsList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flatGrps);
        this.activeGroupUniqueName = grpUniqueName;
    };
    GenericAsideMenuAccountComponent.prototype.ngOnChanges = function (s) {
        if ('selectedGrpUniqueName' in s && s.selectedGrpUniqueName.currentValue !== s.selectedGrpUniqueName.previousValue) {
            this.getGroups(s.selectedGrpUniqueName.currentValue);
        }
        if ('selectedAccountUniqueName' in s) {
            var value = s.selectedAccountUniqueName;
            if (value.currentValue && value.currentValue !== value.previousValue) {
                this.store.dispatch(this.accountsAction.getAccountDetails(s.selectedAccountUniqueName.currentValue));
            }
        }
    };
    GenericAsideMenuAccountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], GenericAsideMenuAccountComponent.prototype, "selectedGrpUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], GenericAsideMenuAccountComponent.prototype, "selectedAccountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "addEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], GenericAsideMenuAccountComponent.prototype, "updateEvent", void 0);
    GenericAsideMenuAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'generic-aside-menu-account',
            template: __webpack_require__(/*! ./generic.aside.menu.account.component.html */ "./src/app/shared/generic-aside-menu-account/generic.aside.menu.account.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 480px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 480px;\n    }\n\n    .aside-body {\n      margin-bottom: 80px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_6__["GroupService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__["AccountsAction"]])
    ], GenericAsideMenuAccountComponent);
    return GenericAsideMenuAccountComponent;
}());



/***/ }),

/***/ "./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module.ts ***!
  \******************************************************************************************/
/*! exports provided: VoucherTypeToNamePipeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VoucherTypeToNamePipeModule", function() { return VoucherTypeToNamePipeModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _voucherTypeToNamePipe_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./voucherTypeToNamePipe.pipe */ "./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.pipe.ts");



var VoucherTypeToNamePipeModule = /** @class */ (function () {
    function VoucherTypeToNamePipeModule() {
    }
    VoucherTypeToNamePipeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [],
            exports: [_voucherTypeToNamePipe_pipe__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeToNamePipe"]],
            declarations: [_voucherTypeToNamePipe_pipe__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeToNamePipe"]],
            providers: [],
        })
    ], VoucherTypeToNamePipeModule);
    return VoucherTypeToNamePipeModule;
}());



/***/ }),

/***/ "./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.pipe.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.pipe.ts ***!
  \****************************************************************************************/
/*! exports provided: VoucherTypeToNamePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VoucherTypeToNamePipe", function() { return VoucherTypeToNamePipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");



var VoucherTypeToNamePipe = /** @class */ (function () {
    function VoucherTypeToNamePipe() {
    }
    VoucherTypeToNamePipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        switch (value) {
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].cash:
                return 'Cash';
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].creditNote:
                return 'Credit Note';
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].debitNote:
                return 'Debit Note';
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].estimate:
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].generateEstimate:
                return 'Estimate';
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].generateProforma:
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].proforma:
                return 'Proforma';
            case _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].sales:
                return 'Sales';
        }
    };
    VoucherTypeToNamePipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'voucherTypeToNamePipe',
            pure: true
        })
    ], VoucherTypeToNamePipe);
    return VoucherTypeToNamePipe;
}());



/***/ }),

/***/ "./src/app/shared/send-email-invoice/send-email-invoice.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/shared/send-email-invoice/send-email-invoice.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header themeBg pd2 pdL2 pdR2 clearfix\" style=\"background-color: #525252\">\n  <h3 class=\"modal-title bg\" id=\"modal-title\">Send Mail </h3>\n  <i aria-hidden=\"true\" class=\"fa fa-times text-right close_modal\" (click)=\"cancel()\"></i>\n</div>\n\n<div class=\"modal-body\">\n\n  <div class=\"row mrB1\">\n    <div class=\"col-sm-12\">\n      <input type=\"text\" class=\"form-control\" placeholder=\"Enter email addresses\" [(ngModel)]=\"emailAddresses\">\n    </div>\n  </div>\n\n\n  <div class=\"clearfix\"\n       *ngIf=\"voucherType !== 'proforma' && voucherType !== 'proformas' && voucherType !== 'estimates' && voucherType !== 'estimate'\">\n    <h3 class=\"fs16 mrB\">Invoice Copy</h3>\n    <hr>\n\n    <div class=\"checkbox\">\n      <label>\n        <input type=\"checkbox\" value=\"Transport\" (change)=\"invoiceTypeChanged($event)\" [(ngModel)]=\"isTransport\">\n        Transport\n      </label>\n    </div>\n\n    <div class=\"checkbox\">\n      <label>\n        <input type=\"checkbox\" value=\"Customer\" (change)=\"invoiceTypeChanged($event)\" [(ngModel)]=\"isCustomer\">\n        Customer\n      </label>\n    </div>\n  </div>\n\n\n  <div class=\"row mrT2 mrB1\">\n    <div class=\"col-sm-12\">\n\n      <div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">\n\n        <button type=\"button\" class=\"btn btn-success\"\n                (click)=\"sendEmail()\"\n        >Send\n        </button>\n\n        <button type=\"button\" class=\"btn btn-danger\" (click)=\"cancel()\">Cancel</button>\n\n      </div>\n    </div>\n  </div>\n\n\n</div>\n"

/***/ }),

/***/ "./src/app/shared/send-email-invoice/send-email-invoice.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/app/shared/send-email-invoice/send-email-invoice.component.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/shared/send-email-invoice/send-email-invoice.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/shared/send-email-invoice/send-email-invoice.component.ts ***!
  \***************************************************************************/
/*! exports provided: SendEmailInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendEmailInvoiceComponent", function() { return SendEmailInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");



var SendEmailInvoiceComponent = /** @class */ (function () {
    function SendEmailInvoiceComponent() {
        this.successEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.cancelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.emailAddresses = '';
        this.invoiceType = [];
        this.isTransport = false;
        this.isCustomer = false;
    }
    SendEmailInvoiceComponent.prototype.ngOnInit = function () {
    };
    SendEmailInvoiceComponent.prototype.invoiceTypeChanged = function (event) {
        var val = event.target.value;
        if (event.target.checked) {
            this.invoiceType.push(val);
        }
        else {
            this.invoiceType = this.invoiceType.filter(function (f) { return f !== val; });
        }
    };
    SendEmailInvoiceComponent.prototype.sendEmail = function () {
        if ([_models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].estimate, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].generateEstimate, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].proforma, _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["VoucherTypeEnum"].generateProforma].includes(this.voucherType)) {
            this.successEvent.emit(this.emailAddresses);
        }
        else {
            this.successEvent.emit({ email: this.emailAddresses, invoiceType: this.invoiceType });
        }
        this.cancel();
    };
    SendEmailInvoiceComponent.prototype.cancel = function () {
        this.cancelEvent.emit(true);
        this.resetModal();
    };
    SendEmailInvoiceComponent.prototype.resetModal = function () {
        this.emailAddresses = '';
        this.invoiceType = [];
        this.isTransport = false;
        this.isCustomer = false;
    };
    SendEmailInvoiceComponent.prototype.ngOnDestroy = function () {
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SendEmailInvoiceComponent.prototype, "voucherType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SendEmailInvoiceComponent.prototype, "successEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SendEmailInvoiceComponent.prototype, "cancelEvent", void 0);
    SendEmailInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-send-email-invoice-component',
            template: __webpack_require__(/*! ./send-email-invoice.component.html */ "./src/app/shared/send-email-invoice/send-email-invoice.component.html"),
            styles: [__webpack_require__(/*! ./send-email-invoice.component.scss */ "./src/app/shared/send-email-invoice/send-email-invoice.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SendEmailInvoiceComponent);
    return SendEmailInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/shared/send-email-invoice/send-email-invoice.module.ts":
/*!************************************************************************!*\
  !*** ./src/app/shared/send-email-invoice/send-email-invoice.module.ts ***!
  \************************************************************************/
/*! exports provided: SendEmailInvoiceModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendEmailInvoiceModule", function() { return SendEmailInvoiceModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _send_email_invoice_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./send-email-invoice.component */ "./src/app/shared/send-email-invoice/send-email-invoice.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");





var SendEmailInvoiceModule = /** @class */ (function () {
    function SendEmailInvoiceModule() {
    }
    SendEmailInvoiceModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"]
            ],
            exports: [
                _send_email_invoice_component__WEBPACK_IMPORTED_MODULE_2__["SendEmailInvoiceComponent"]
            ],
            declarations: [
                _send_email_invoice_component__WEBPACK_IMPORTED_MODULE_2__["SendEmailInvoiceComponent"]
            ],
            providers: [],
        })
    ], SendEmailInvoiceModule);
    return SendEmailInvoiceModule;
}());



/***/ }),

/***/ "./src/app/theme/discount-control/discount-control-component.html":
/*!************************************************************************!*\
  !*** ./src/app/theme/discount-control/discount-control-component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div (clickOutside)=\"hideDiscountMenu()\" (click)=\"$event.stopPropagation()\" style=\"position: relative\">\n  <label *ngIf=\"showHeaderText\">Discount</label>\n\n  <a id=\"discount\">\n    <div class=\"multi-select adjust\">\n      <input type=\"text\" decimalDigitsDirective name=\"\" class=\"form-control text-right cursor-pointer\"\n             (focus)=\"discountMenu = true;hideOtherPopups.emit(true)\"\n             [(ngModel)]=\"discountSum\" readonly (blur)=\"discountInputBlur($event)\"\n             style=\"padding-right:22px !important;\"/>\n      <span class=\"caret cp no-select\" (click)=\"discountMenu = true;hideOtherPopups.emit(true)\"></span>\n    </div>\n  </a>\n\n  <div class=\"my-dropdown-menu pd\" (click)=\"$event.stopPropagation()\" style=\"padding: 10px;\"\n       [ngStyle]=\"{'display': discountMenu ? 'block': 'none'}\" #disInptEle>\n\n    <div>\n\n      <div class=\"d-flex mb-1\">\n\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Percent</label>\n\n        <div class=\"pos-rel\">\n          <input type=\"text\" class=\"form-control text-right cursor-pointer\"\n                 [disabled]=\"!discountFromPer\"\n                 decimalDigitsDirective\n                 [(ngModel)]=\"discountPercentageModal\"\n                 (input)=\"discountFromInput('PERCENTAGE', $event)\"\n                 style=\"width: 100px;padding-right: 20px !important;\">\n          <i class=\"fa fa-percent pos-abs\" style=\"top: 9px;right: 6px;color: #acb0b9;\"></i>\n        </div>\n\n      </div>\n\n      <div class=\"d-flex mb-1\">\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Value</label>\n        <input type=\"text\" class=\"form-control text-right cursor-pointer\"\n               [disabled]=\"!discountFromVal\"\n               decimalDigitsDirective\n               [(ngModel)]=\"discountFixedValueModal\"\n               (input)=\"discountFromInput('FIX_AMOUNT', $event)\"\n               style=\"width: 100px\">\n      </div>\n\n    </div>\n\n    <div class=\"d-flex flex-col\" style=\"justify-content: center\" *ngIf=\"discountAccountsDetails.length > 1\">\n      <span class=\"or-line\">AND</span>\n    </div>\n\n    <div *ngIf=\"discountAccountsDetails.length > 1\">\n      <ul style=\"list-style: none;overflow: auto;max-height: 100px\">\n\n        <ng-container *ngFor=\"let discount of discountAccountsDetails;trackBy: trackByFn; let idx = index\">\n          <li *ngIf=\"idx > 0\" class=\"customItem\" style=\"padding: 5px;margin-bottom: 5px;\">\n            <label class=\"checkbox oh width100 p0 m0\" (click)=\"$event.stopPropagation()\">\n              <input class=\"pull-left\" name=\"tax_{{idx}}\" type=\"checkbox\" [(ngModel)]=\"discount.isActive\"\n                     (change)=\"change()\"\n                     (click)=\"$event.stopPropagation()\"\n              />\n              <span class=\"pull-left ellp\">{{discount.name}}</span>\n            </label>\n          </li>\n        </ng-container>\n      </ul>\n    </div>\n  </div>\n  <div tabindex=\"0\" (focus)=\"onFocusLastDiv($event)\"></div>\n</div>\n"

/***/ }),

/***/ "./src/app/theme/discount-control/discount-control.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/theme/discount-control/discount-control.component.ts ***!
  \**********************************************************************/
/*! exports provided: DiscountControlComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscountControlComponent", function() { return DiscountControlComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/SettingsDiscount */ "./src/app/models/api-models/SettingsDiscount.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");






var DiscountControlComponent = /** @class */ (function () {
    function DiscountControlComponent(store) {
        this.store = store;
        this.ledgerAmount = 0;
        this.totalAmount = 0;
        this.showHeaderText = true;
        this.discountTotalUpdated = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.hideOtherPopups = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.discountFromPer = true;
        this.discountFromVal = true;
        this.discountPercentageModal = 0;
        this.discountFixedValueModal = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        this.discountAccountsList$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.settings.discount.discountList; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$));
    }
    Object.defineProperty(DiscountControlComponent.prototype, "defaultDiscount", {
        get: function () {
            return this.discountAccountsDetails[0];
        },
        enumerable: true,
        configurable: true
    });
    DiscountControlComponent.prototype.onFocusLastDiv = function (el) {
        el.stopPropagation();
        el.preventDefault();
        if (!this.discountMenu) {
            this.discountMenu = true;
            this.hideOtherPopups.emit(true);
            return;
        }
        var focussableElements = '.ledger-panel input[type=text]:not([disabled]),.ledger-panel [tabindex]:not([disabled]):not([tabindex="-1"])';
        // if (document.activeElement && document.activeElement.form) {
        var focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements), function (element) {
            // check for visibility while always include the current activeElement
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
        });
        var index = focussable.indexOf(document.activeElement);
        if (index > -1) {
            var nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
        this.hideDiscountMenu();
        return false;
    };
    DiscountControlComponent.prototype.ngOnInit = function () {
        this.prepareDiscountList();
        if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
            this.discountFixedValueModal = this.defaultDiscount.amount;
        }
        else {
            this.discountPercentageModal = this.defaultDiscount.amount;
        }
    };
    DiscountControlComponent.prototype.ngOnChanges = function (changes) {
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
            this.prepareDiscountList();
            if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                this.discountFixedValueModal = this.defaultDiscount.amount;
            }
            else {
                this.discountPercentageModal = this.defaultDiscount.amount;
            }
            // this.change();
            if ('totalAmount' in changes && changes.totalAmount.currentValue !== changes.totalAmount.previousValue) {
                this.change();
            }
        }
    };
    /**
     * prepare discount obj
     */
    DiscountControlComponent.prototype.prepareDiscountList = function () {
        var _this = this;
        var discountAccountsList = [];
        this.discountAccountsList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["take"])(1)).subscribe(function (d) { return discountAccountsList = d; });
        if (discountAccountsList.length) {
            discountAccountsList.forEach(function (acc) {
                var hasItem = _this.discountAccountsDetails.some(function (s) { return s.discountUniqueName === acc.uniqueName; });
                if (!hasItem) {
                    var obj = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_2__["LedgerDiscountClass"]();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount.uniqueName;
                    obj.discountUniqueName = acc.uniqueName;
                    obj.name = acc.name;
                    _this.discountAccountsDetails.push(obj);
                }
            });
        }
    };
    DiscountControlComponent.prototype.discountFromInput = function (type, event) {
        this.defaultDiscount.amount = parseFloat(event.target.value);
        this.defaultDiscount.discountValue = parseFloat(event.target.value);
        this.defaultDiscount.discountType = type;
        this.change();
        if (!event.target.value) {
            this.discountFromVal = true;
            this.discountFromPer = true;
            return;
        }
        if (type === 'PERCENTAGE') {
            this.discountFromPer = true;
            this.discountFromVal = false;
        }
        else {
            this.discountFromPer = false;
            this.discountFromVal = true;
        }
    };
    /**
     * on change of discount amount
     */
    DiscountControlComponent.prototype.change = function () {
        this.discountTotalUpdated.emit();
    };
    DiscountControlComponent.prototype.trackByFn = function (index) {
        return index; // or item.id
    };
    DiscountControlComponent.prototype.hideDiscountMenu = function () {
        this.discountMenu = false;
    };
    DiscountControlComponent.prototype.discountInputBlur = function (event) {
        if (event && event.relatedTarget && this.disInptEle && !this.disInptEle.nativeElement.contains(event.relatedTarget)) {
            this.hideDiscountMenu();
        }
    };
    DiscountControlComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], DiscountControlComponent.prototype, "discountAccountsDetails", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], DiscountControlComponent.prototype, "ledgerAmount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], DiscountControlComponent.prototype, "totalAmount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], DiscountControlComponent.prototype, "showHeaderText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DiscountControlComponent.prototype, "discountTotalUpdated", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], DiscountControlComponent.prototype, "hideOtherPopups", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], DiscountControlComponent.prototype, "discountSum", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('disInptEle'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], DiscountControlComponent.prototype, "disInptEle", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], DiscountControlComponent.prototype, "discountMenu", void 0);
    DiscountControlComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'discount-control-component',
            template: __webpack_require__(/*! ./discount-control-component.html */ "./src/app/theme/discount-control/discount-control-component.html"),
            styles: ["\n    .multi-select input.form-control {\n      background-image: unset !important;\n    }\n\n    .multi-select .caret {\n      display: block !important;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"]])
    ], DiscountControlComponent);
    return DiscountControlComponent;
}());



/***/ }),

/***/ "./src/app/theme/discount-control/discount-control.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/theme/discount-control/discount-control.module.ts ***!
  \*******************************************************************/
/*! exports provided: DiscountControlModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscountControlModule", function() { return DiscountControlModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _discount_control_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./discount-control.component */ "./src/app/theme/discount-control/discount-control.component.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_6__);







var DiscountControlModule = /** @class */ (function () {
    function DiscountControlModule() {
    }
    DiscountControlModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_3__["DecimalDigitsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_6__["ClickOutsideModule"]
            ],
            exports: [
                _discount_control_component__WEBPACK_IMPORTED_MODULE_2__["DiscountControlComponent"]
            ],
            declarations: [_discount_control_component__WEBPACK_IMPORTED_MODULE_2__["DiscountControlComponent"]],
            providers: [],
        })
    ], DiscountControlModule);
    return DiscountControlModule;
}());



/***/ })

}]);