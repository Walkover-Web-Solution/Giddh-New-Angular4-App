(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "../../node_modules/ngx-uploader/fesm5/ngx-uploader.js":
/*!*********************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ngx-uploader/fesm5/ngx-uploader.js ***!
  \*********************************************************************************************************/
/*! exports provided: UploadStatus, NgFileDropDirective, NgFileSelectDirective, humanizeBytes, NgUploaderService, NgxUploaderModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadStatus", function() { return UploadStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgFileDropDirective", function() { return NgFileDropDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgFileSelectDirective", function() { return NgFileSelectDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "humanizeBytes", function() { return humanizeBytes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgUploaderService", function() { return NgUploaderService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxUploaderModule", function() { return NgxUploaderModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");





/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
var UploadStatus = {
    Queue: 0,
    Uploading: 1,
    Done: 2,
    Cancelled: 3,
};
UploadStatus[UploadStatus.Queue] = 'Queue';
UploadStatus[UploadStatus.Uploading] = 'Uploading';
UploadStatus[UploadStatus.Done] = 'Done';
UploadStatus[UploadStatus.Cancelled] = 'Cancelled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} bytes
 * @return {?}
 */
function humanizeBytes(bytes) {
    if (bytes === 0) {
        return '0 Byte';
    }
    /** @type {?} */
    var k = 1024;
    /** @type {?} */
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    /** @type {?} */
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
var NgUploaderService = /** @class */ (function () {
    function NgUploaderService(concurrency, contentTypes, maxUploads) {
        if (concurrency === void 0) { concurrency = Number.POSITIVE_INFINITY; }
        if (contentTypes === void 0) { contentTypes = ['*']; }
        if (maxUploads === void 0) { maxUploads = Number.POSITIVE_INFINITY; }
        var _this = this;
        this.queue = [];
        this.serviceEvents = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.uploadScheduler = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.subs = [];
        this.contentTypes = contentTypes;
        this.maxUploads = maxUploads;
        this.uploadScheduler
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function (upload) { return _this.startUpload(upload); }, concurrency))
            .subscribe(function (uploadOutput) { return _this.serviceEvents.emit(uploadOutput); });
    }
    /**
     * @param {?} incomingFiles
     * @return {?}
     */
    NgUploaderService.prototype.handleFiles = /**
     * @param {?} incomingFiles
     * @return {?}
     */
    function (incomingFiles) {
        var _this = this;
        var _a;
        /** @type {?} */
        var allowedIncomingFiles = [].reduce.call(incomingFiles, function (acc, checkFile, i) {
            /** @type {?} */
            var futureQueueLength = acc.length + _this.queue.length + 1;
            if (_this.isContentTypeAllowed(checkFile.type) && futureQueueLength <= _this.maxUploads) {
                acc = acc.concat(checkFile);
            }
            else {
                /** @type {?} */
                var rejectedFile = _this.makeUploadFile(checkFile, i);
                _this.serviceEvents.emit({ type: 'rejected', file: rejectedFile });
            }
            return acc;
        }, []);
        (_a = this.queue).push.apply(_a, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"])([].map.call(allowedIncomingFiles, function (file, i) {
            /** @type {?} */
            var uploadFile = _this.makeUploadFile(file, i);
            _this.serviceEvents.emit({ type: 'addedToQueue', file: uploadFile });
            return uploadFile;
        })));
        this.serviceEvents.emit({ type: 'allAddedToQueue' });
    };
    /**
     * @param {?} input
     * @return {?}
     */
    NgUploaderService.prototype.initInputEvents = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var _this = this;
        return input.subscribe(function (event) {
            switch (event.type) {
                case 'uploadFile':
                    /** @type {?} */
                    var uploadFileIndex = _this.queue.findIndex(function (file) { return file === event.file; });
                    if (uploadFileIndex !== -1 && event.file) {
                        _this.uploadScheduler.next({ file: _this.queue[uploadFileIndex], event: event });
                    }
                    break;
                case 'uploadAll':
                    /** @type {?} */
                    var files = _this.queue.filter(function (file) { return file.progress.status === UploadStatus.Queue; });
                    files.forEach(function (file) { return _this.uploadScheduler.next({ file: file, event: event }); });
                    break;
                case 'cancel':
                    /** @type {?} */
                    var id_1 = event.id || null;
                    if (!id_1) {
                        return;
                    }
                    /** @type {?} */
                    var index = _this.subs.findIndex(function (sub) { return sub.id === id_1; });
                    if (index !== -1 && _this.subs[index].sub) {
                        _this.subs[index].sub.unsubscribe();
                        /** @type {?} */
                        var fileIndex = _this.queue.findIndex(function (file) { return file.id === id_1; });
                        if (fileIndex !== -1) {
                            _this.queue[fileIndex].progress.status = UploadStatus.Cancelled;
                            _this.serviceEvents.emit({ type: 'cancelled', file: _this.queue[fileIndex] });
                        }
                    }
                    break;
                case 'cancelAll':
                    _this.subs.forEach(function (sub) {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                        }
                        /** @type {?} */
                        var file = _this.queue.find(function (uploadFile) { return uploadFile.id === sub.id; });
                        if (file) {
                            file.progress.status = UploadStatus.Cancelled;
                            _this.serviceEvents.emit({ type: 'cancelled', file: file });
                        }
                    });
                    break;
                case 'remove':
                    if (!event.id) {
                        return;
                    }
                    /** @type {?} */
                    var i = _this.queue.findIndex(function (file) { return file.id === event.id; });
                    if (i !== -1) {
                        /** @type {?} */
                        var file = _this.queue[i];
                        _this.queue.splice(i, 1);
                        _this.serviceEvents.emit({ type: 'removed', file: file });
                    }
                    break;
                case 'removeAll':
                    if (_this.queue.length) {
                        _this.queue = [];
                        _this.serviceEvents.emit({ type: 'removedAll' });
                    }
                    break;
            }
        });
    };
    /**
     * @param {?} upload
     * @return {?}
     */
    NgUploaderService.prototype.startUpload = /**
     * @param {?} upload
     * @return {?}
     */
    function (upload) {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (observer) {
            /** @type {?} */
            var sub = _this.uploadFile(upload.file, upload.event)
                .subscribe(function (output) {
                observer.next(output);
            }, function (err) {
                observer.error(err);
                observer.complete();
            }, function () {
                observer.complete();
            });
            _this.subs.push({ id: upload.file.id, sub: sub });
        });
    };
    /**
     * @param {?} file
     * @param {?} event
     * @return {?}
     */
    NgUploaderService.prototype.uploadFile = /**
     * @param {?} file
     * @param {?} event
     * @return {?}
     */
    function (file, event) {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (observer) {
            /** @type {?} */
            var url = event.url || '';
            /** @type {?} */
            var method = event.method || 'POST';
            /** @type {?} */
            var data = event.data || {};
            /** @type {?} */
            var headers = event.headers || {};
            /** @type {?} */
            var xhr = new XMLHttpRequest();
            /** @type {?} */
            var time = new Date().getTime();
            /** @type {?} */
            var progressStartTime = (file.progress.data && file.progress.data.startTime) || time;
            /** @type {?} */
            var speed = 0;
            /** @type {?} */
            var eta = null;
            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    /** @type {?} */
                    var percentage = Math.round((e.loaded * 100) / e.total);
                    /** @type {?} */
                    var diff = new Date().getTime() - time;
                    speed = Math.round(e.loaded / diff * 1000);
                    progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                    eta = Math.ceil((e.total - e.loaded) / speed);
                    file.progress = {
                        status: UploadStatus.Uploading,
                        data: {
                            percentage: percentage,
                            speed: speed,
                            speedHuman: humanizeBytes(speed) + "/s",
                            startTime: progressStartTime,
                            endTime: null,
                            eta: eta,
                            etaHuman: _this.secondsToHuman(eta)
                        }
                    };
                    observer.next({ type: 'uploading', file: file });
                }
            }, false);
            xhr.upload.addEventListener('error', function (e) {
                observer.error(e);
                observer.complete();
            });
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    /** @type {?} */
                    var speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                    file.progress = {
                        status: UploadStatus.Done,
                        data: {
                            percentage: 100,
                            speed: speedAverage,
                            speedHuman: humanizeBytes(speedAverage) + "/s",
                            startTime: progressStartTime,
                            endTime: new Date().getTime(),
                            eta: eta,
                            etaHuman: _this.secondsToHuman(eta || 0)
                        }
                    };
                    file.responseStatus = xhr.status;
                    try {
                        file.response = JSON.parse(xhr.response);
                    }
                    catch (e) {
                        file.response = xhr.response;
                    }
                    file.responseHeaders = _this.parseResponseHeaders(xhr.getAllResponseHeaders());
                    observer.next({ type: 'done', file: file });
                    observer.complete();
                }
            };
            xhr.open(method, url, true);
            xhr.withCredentials = event.withCredentials ? true : false;
            try {
                /** @type {?} */
                var uploadFile_1 = /** @type {?} */ (file.nativeFile);
                /** @type {?} */
                var uploadIndex = _this.queue.findIndex(function (outFile) { return outFile.nativeFile === uploadFile_1; });
                if (_this.queue[uploadIndex].progress.status === UploadStatus.Cancelled) {
                    observer.complete();
                }
                Object.keys(headers).forEach(function (key) { return xhr.setRequestHeader(key, headers[key]); });
                /** @type {?} */
                var bodyToSend = void 0;
                if (event.includeWebKitFormBoundary !== false) {
                    Object.keys(data).forEach(function (key) { return file.form.append(key, data[key]); });
                    file.form.append(event.fieldName || 'file', uploadFile_1, uploadFile_1.name);
                    bodyToSend = file.form;
                }
                else {
                    bodyToSend = uploadFile_1;
                }
                _this.serviceEvents.emit({ type: 'start', file: file });
                xhr.send(bodyToSend);
            }
            catch (e) {
                observer.complete();
            }
            return function () {
                xhr.abort();
            };
        });
    };
    /**
     * @param {?} sec
     * @return {?}
     */
    NgUploaderService.prototype.secondsToHuman = /**
     * @param {?} sec
     * @return {?}
     */
    function (sec) {
        return new Date(sec * 1000).toISOString().substr(11, 8);
    };
    /**
     * @return {?}
     */
    NgUploaderService.prototype.generateId = /**
     * @return {?}
     */
    function () {
        return Math.random().toString(36).substring(7);
    };
    /**
     * @param {?} contentTypes
     * @return {?}
     */
    NgUploaderService.prototype.setContentTypes = /**
     * @param {?} contentTypes
     * @return {?}
     */
    function (contentTypes) {
        if (typeof contentTypes != 'undefined' && contentTypes instanceof Array) {
            if (contentTypes.find(function (type) { return type === '*'; }) !== undefined) {
                this.contentTypes = ['*'];
            }
            else {
                this.contentTypes = contentTypes;
            }
            return;
        }
        this.contentTypes = ['*'];
    };
    /**
     * @return {?}
     */
    NgUploaderService.prototype.allContentTypesAllowed = /**
     * @return {?}
     */
    function () {
        return this.contentTypes.find(function (type) { return type === '*'; }) !== undefined;
    };
    /**
     * @param {?} mimetype
     * @return {?}
     */
    NgUploaderService.prototype.isContentTypeAllowed = /**
     * @param {?} mimetype
     * @return {?}
     */
    function (mimetype) {
        if (this.allContentTypesAllowed()) {
            return true;
        }
        return this.contentTypes.find(function (type) { return type === mimetype; }) !== undefined;
    };
    /**
     * @param {?} file
     * @param {?} index
     * @return {?}
     */
    NgUploaderService.prototype.makeUploadFile = /**
     * @param {?} file
     * @param {?} index
     * @return {?}
     */
    function (file, index) {
        return {
            fileIndex: index,
            id: this.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            form: new FormData(),
            progress: {
                status: UploadStatus.Queue,
                data: {
                    percentage: 0,
                    speed: 0,
                    speedHuman: humanizeBytes(0) + "/s",
                    startTime: null,
                    endTime: null,
                    eta: null,
                    etaHuman: null
                }
            },
            lastModifiedDate: file.lastModifiedDate,
            sub: undefined,
            nativeFile: file
        };
    };
    /**
     * @param {?} httpHeaders
     * @return {?}
     */
    NgUploaderService.prototype.parseResponseHeaders = /**
     * @param {?} httpHeaders
     * @return {?}
     */
    function (httpHeaders) {
        if (!httpHeaders) {
            return;
        }
        return httpHeaders.split('\n')
            .map(function (x) { return x.split(/: */, 2); })
            .filter(function (x) { return x[0]; })
            .reduce(function (ac, x) {
            ac[x[0]] = x[1];
            return ac;
        }, {});
    };
    return NgUploaderService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgFileDropDirective = /** @class */ (function () {
    function NgFileDropDirective(elementRef) {
        this.elementRef = elementRef;
        this.stopEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        this.uploadOutput = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    NgFileDropDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._sub = [];
        /** @type {?} */
        var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        /** @type {?} */
        var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        /** @type {?} */
        var maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
        this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads);
        this.el = this.elementRef.nativeElement;
        this._sub.push(this.upload.serviceEvents.subscribe(function (event) {
            _this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
        this.el.addEventListener('drop', this.stopEvent, false);
        this.el.addEventListener('dragenter', this.stopEvent, false);
        this.el.addEventListener('dragover', this.stopEvent, false);
    };
    /**
     * @return {?}
     */
    NgFileDropDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._sub.forEach(function (sub) { return sub.unsubscribe(); });
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgFileDropDirective.prototype.onDrop = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.stopPropagation();
        e.preventDefault();
        /** @type {?} */
        var event = { type: 'drop' };
        this.uploadOutput.emit(event);
        this.upload.handleFiles(e.dataTransfer.files);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgFileDropDirective.prototype.onDragOver = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!e) {
            return;
        }
        /** @type {?} */
        var event = { type: 'dragOver' };
        this.uploadOutput.emit(event);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    NgFileDropDirective.prototype.onDragLeave = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (!e) {
            return;
        }
        /** @type {?} */
        var event = { type: 'dragOut' };
        this.uploadOutput.emit(event);
    };
    NgFileDropDirective.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"], args: [{
                    selector: '[ngFileDrop]'
                },] },
    ];
    /** @nocollapse */
    NgFileDropDirective.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }
    ]; };
    NgFileDropDirective.propDecorators = {
        options: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"] }],
        uploadInput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"] }],
        uploadOutput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"] }],
        onDrop: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"], args: ['drop', ['$event'],] }],
        onDragOver: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"], args: ['dragover', ['$event'],] }],
        onDragLeave: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"], args: ['dragleave', ['$event'],] }]
    };
    return NgFileDropDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgFileSelectDirective = /** @class */ (function () {
    function NgFileSelectDirective(elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        this.fileListener = function () {
            if (_this.el.files) {
                _this.upload.handleFiles(_this.el.files);
            }
        };
        this.uploadOutput = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    NgFileSelectDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._sub = [];
        /** @type {?} */
        var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        /** @type {?} */
        var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        /** @type {?} */
        var maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
        this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads);
        this.el = this.elementRef.nativeElement;
        this.el.addEventListener('change', this.fileListener, false);
        this._sub.push(this.upload.serviceEvents.subscribe(function (event) {
            _this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
    };
    /**
     * @return {?}
     */
    NgFileSelectDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.el) {
            this.el.removeEventListener('change', this.fileListener, false);
            this._sub.forEach(function (sub) { return sub.unsubscribe(); });
        }
    };
    NgFileSelectDirective.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"], args: [{
                    selector: '[ngFileSelect]'
                },] },
    ];
    /** @nocollapse */
    NgFileSelectDirective.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }
    ]; };
    NgFileSelectDirective.propDecorators = {
        options: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"] }],
        uploadInput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"] }],
        uploadOutput: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"] }]
    };
    return NgFileSelectDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgxUploaderModule = /** @class */ (function () {
    function NgxUploaderModule() {
    }
    NgxUploaderModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"], args: [{
                    declarations: [NgFileDropDirective, NgFileSelectDirective],
                    exports: [NgFileDropDirective, NgFileSelectDirective]
                },] },
    ];
    return NgxUploaderModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtdXBsb2FkZXIvbGliL2ludGVyZmFjZXMudHMiLCJuZzovL25neC11cGxvYWRlci9saWIvbmd4LXVwbG9hZGVyLmNsYXNzLnRzIiwibmc6Ly9uZ3gtdXBsb2FkZXIvbGliL25nLWZpbGUtZHJvcC5kaXJlY3RpdmUudHMiLCJuZzovL25neC11cGxvYWRlci9saWIvbmctZmlsZS1zZWxlY3QuZGlyZWN0aXZlLnRzIiwibmc6Ly9uZ3gtdXBsb2FkZXIvbGliL25neC11cGxvYWRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkZXJPcHRpb25zIHtcbiAgY29uY3VycmVuY3k6IG51bWJlcjtcbiAgYWxsb3dlZENvbnRlbnRUeXBlcz86IHN0cmluZ1tdO1xuICBtYXhVcGxvYWRzPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2JGaWxlIGV4dGVuZHMgQmxvYiB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gVXBsb2FkU3RhdHVzIHtcbiAgUXVldWUsXG4gIFVwbG9hZGluZyxcbiAgRG9uZSxcbiAgQ2FuY2VsbGVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkUHJvZ3Jlc3Mge1xuICBzdGF0dXM6IFVwbG9hZFN0YXR1cztcbiAgZGF0YT86IHtcbiAgICBwZXJjZW50YWdlOiBudW1iZXI7XG4gICAgc3BlZWQ6IG51bWJlcjtcbiAgICBzcGVlZEh1bWFuOiBzdHJpbmc7XG4gICAgc3RhcnRUaW1lOiBudW1iZXIgfCBudWxsO1xuICAgIGVuZFRpbWU6IG51bWJlciB8IG51bGw7XG4gICAgZXRhOiBudW1iZXIgfCBudWxsO1xuICAgIGV0YUh1bWFuOiBzdHJpbmcgfCBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZpbGUge1xuICBpZDogc3RyaW5nO1xuICBmaWxlSW5kZXg6IG51bWJlcjtcbiAgbGFzdE1vZGlmaWVkRGF0ZTogRGF0ZTtcbiAgbmFtZTogc3RyaW5nO1xuICBzaXplOiBudW1iZXI7XG4gIHR5cGU6IHN0cmluZztcbiAgZm9ybTogRm9ybURhdGE7XG4gIHByb2dyZXNzOiBVcGxvYWRQcm9ncmVzcztcbiAgcmVzcG9uc2U/OiBhbnk7XG4gIHJlc3BvbnNlU3RhdHVzPzogbnVtYmVyO1xuICBzdWI/OiBTdWJzY3JpcHRpb24gfCBhbnk7XG4gIG5hdGl2ZUZpbGU/OiBGaWxlO1xuICByZXNwb25zZUhlYWRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVwbG9hZE91dHB1dCB7XG4gIHR5cGU6ICdhZGRlZFRvUXVldWUnIHwgJ2FsbEFkZGVkVG9RdWV1ZScgfCAndXBsb2FkaW5nJyB8ICdkb25lJyB8ICdzdGFydCcgfCAnY2FuY2VsbGVkJyB8ICdkcmFnT3ZlcidcbiAgICAgIHwgJ2RyYWdPdXQnIHwgJ2Ryb3AnIHwgJ3JlbW92ZWQnIHwgJ3JlbW92ZWRBbGwnIHwgJ3JlamVjdGVkJztcbiAgZmlsZT86IFVwbG9hZEZpbGU7XG4gIG5hdGl2ZUZpbGU/OiBGaWxlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVwbG9hZElucHV0IHtcbiAgdHlwZTogJ3VwbG9hZEFsbCcgfCAndXBsb2FkRmlsZScgfCAnY2FuY2VsJyB8ICdjYW5jZWxBbGwnIHwgJ3JlbW92ZScgfCAncmVtb3ZlQWxsJztcbiAgdXJsPzogc3RyaW5nO1xuICBtZXRob2Q/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xuICBmaWVsZE5hbWU/OiBzdHJpbmc7XG4gIGZpbGVJbmRleD86IG51bWJlcjtcbiAgZmlsZT86IFVwbG9hZEZpbGU7XG4gIGRhdGE/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IEJsb2IgfTtcbiAgaGVhZGVycz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gIGluY2x1ZGVXZWJLaXRGb3JtQm91bmRhcnk/OiBib29sZWFuOyAvLyBJZiBmYWxzZSwgb25seSB0aGUgZmlsZSBpcyBzZW5kIHRyb3VnaCB4aHIuc2VuZCAoV2ViS2l0Rm9ybUJvdW5kYXJ5IGlzIG9taXQpXG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG4iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBVcGxvYWRGaWxlLCBVcGxvYWRPdXRwdXQsIFVwbG9hZElucHV0LCBVcGxvYWRTdGF0dXMsIEJsb2JGaWxlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuaXplQnl0ZXMoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XG4gIGlmIChieXRlcyA9PT0gMCkge1xuICAgIHJldHVybiAnMCBCeXRlJztcbiAgfVxuXG4gIGNvbnN0IGsgPSAxMDI0O1xuICBjb25zdCBzaXplczogc3RyaW5nW10gPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ107XG4gIGNvbnN0IGk6IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coaykpO1xuXG4gIHJldHVybiBwYXJzZUZsb2F0KChieXRlcyAvIE1hdGgucG93KGssIGkpKS50b0ZpeGVkKDIpKSArICcgJyArIHNpemVzW2ldO1xufVxuXG5leHBvcnQgY2xhc3MgTmdVcGxvYWRlclNlcnZpY2Uge1xuICBxdWV1ZTogVXBsb2FkRmlsZVtdO1xuICBzZXJ2aWNlRXZlbnRzOiBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PjtcbiAgdXBsb2FkU2NoZWR1bGVyOiBTdWJqZWN0PHsgZmlsZTogVXBsb2FkRmlsZSwgZXZlbnQ6IFVwbG9hZElucHV0IH0+O1xuICBzdWJzOiB7IGlkOiBzdHJpbmcsIHN1YjogU3Vic2NyaXB0aW9uIH1bXTtcbiAgY29udGVudFR5cGVzOiBzdHJpbmdbXTtcbiAgbWF4VXBsb2FkczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmN1cnJlbmN5OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksIGNvbnRlbnRUeXBlczogc3RyaW5nW10gPSBbJyonXSwgbWF4VXBsb2FkczogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PigpO1xuICAgIHRoaXMudXBsb2FkU2NoZWR1bGVyID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLnN1YnMgPSBbXTtcbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IGNvbnRlbnRUeXBlcztcbiAgICB0aGlzLm1heFVwbG9hZHMgPSBtYXhVcGxvYWRzO1xuXG4gICAgdGhpcy51cGxvYWRTY2hlZHVsZXJcbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcCh1cGxvYWQgPT4gdGhpcy5zdGFydFVwbG9hZCh1cGxvYWQpLCBjb25jdXJyZW5jeSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUodXBsb2FkT3V0cHV0ID0+IHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHVwbG9hZE91dHB1dCkpO1xuICB9XG5cbiAgaGFuZGxlRmlsZXMoaW5jb21pbmdGaWxlczogRmlsZUxpc3QpOiB2b2lkIHtcbiAgICBjb25zdCBhbGxvd2VkSW5jb21pbmdGaWxlczogRmlsZVtdID0gW10ucmVkdWNlLmNhbGwoaW5jb21pbmdGaWxlcywgKGFjYzogRmlsZVtdLCBjaGVja0ZpbGU6IEZpbGUsIGk6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgZnV0dXJlUXVldWVMZW5ndGggPSBhY2MubGVuZ3RoICsgdGhpcy5xdWV1ZS5sZW5ndGggKyAxO1xuICAgICAgaWYgKHRoaXMuaXNDb250ZW50VHlwZUFsbG93ZWQoY2hlY2tGaWxlLnR5cGUpICYmIGZ1dHVyZVF1ZXVlTGVuZ3RoIDw9IHRoaXMubWF4VXBsb2Fkcykge1xuICAgICAgICBhY2MgPSBhY2MuY29uY2F0KGNoZWNrRmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZWplY3RlZEZpbGU6IFVwbG9hZEZpbGUgPSB0aGlzLm1ha2VVcGxvYWRGaWxlKGNoZWNrRmlsZSwgaSk7XG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ3JlamVjdGVkJywgZmlsZTogcmVqZWN0ZWRGaWxlIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdKTtcblxuICAgIHRoaXMucXVldWUucHVzaCguLi5bXS5tYXAuY2FsbChhbGxvd2VkSW5jb21pbmdGaWxlcywgKGZpbGU6IEZpbGUsIGk6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgdXBsb2FkRmlsZTogVXBsb2FkRmlsZSA9IHRoaXMubWFrZVVwbG9hZEZpbGUoZmlsZSwgaSk7XG4gICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdhZGRlZFRvUXVldWUnLCBmaWxlOiB1cGxvYWRGaWxlIH0pO1xuICAgICAgcmV0dXJuIHVwbG9hZEZpbGU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQoeyB0eXBlOiAnYWxsQWRkZWRUb1F1ZXVlJyB9KTtcbiAgfVxuXG4gIGluaXRJbnB1dEV2ZW50cyhpbnB1dDogRXZlbnRFbWl0dGVyPFVwbG9hZElucHV0Pik6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIGlucHV0LnN1YnNjcmliZSgoZXZlbnQ6IFVwbG9hZElucHV0KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgY2FzZSAndXBsb2FkRmlsZSc6XG4gICAgICAgICAgY29uc3QgdXBsb2FkRmlsZUluZGV4ID0gdGhpcy5xdWV1ZS5maW5kSW5kZXgoZmlsZSA9PiBmaWxlID09PSBldmVudC5maWxlKTtcbiAgICAgICAgICBpZiAodXBsb2FkRmlsZUluZGV4ICE9PSAtMSAmJiBldmVudC5maWxlKSB7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZFNjaGVkdWxlci5uZXh0KHsgZmlsZTogdGhpcy5xdWV1ZVt1cGxvYWRGaWxlSW5kZXhdLCBldmVudDogZXZlbnQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cGxvYWRBbGwnOlxuICAgICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5xdWV1ZS5maWx0ZXIoZmlsZSA9PiBmaWxlLnByb2dyZXNzLnN0YXR1cyA9PT0gVXBsb2FkU3RhdHVzLlF1ZXVlKTtcbiAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4gdGhpcy51cGxvYWRTY2hlZHVsZXIubmV4dCh7IGZpbGU6IGZpbGUsIGV2ZW50OiBldmVudCB9KSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6XG4gICAgICAgICAgY29uc3QgaWQgPSBldmVudC5pZCB8fCBudWxsO1xuICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3Vicy5maW5kSW5kZXgoc3ViID0+IHN1Yi5pZCA9PT0gaWQpO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgdGhpcy5zdWJzW2luZGV4XS5zdWIpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic1tpbmRleF0uc3ViLnVuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGVJbmRleCA9IHRoaXMucXVldWUuZmluZEluZGV4KGZpbGUgPT4gZmlsZS5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYgKGZpbGVJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgdGhpcy5xdWV1ZVtmaWxlSW5kZXhdLnByb2dyZXNzLnN0YXR1cyA9IFVwbG9hZFN0YXR1cy5DYW5jZWxsZWQ7XG4gICAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2NhbmNlbGxlZCcsIGZpbGU6IHRoaXMucXVldWVbZmlsZUluZGV4XSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NhbmNlbEFsbCc6XG4gICAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHtcbiAgICAgICAgICAgIGlmIChzdWIuc3ViKSB7XG4gICAgICAgICAgICAgIHN1Yi5zdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMucXVldWUuZmluZCh1cGxvYWRGaWxlID0+IHVwbG9hZEZpbGUuaWQgPT09IHN1Yi5pZCk7XG4gICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICBmaWxlLnByb2dyZXNzLnN0YXR1cyA9IFVwbG9hZFN0YXR1cy5DYW5jZWxsZWQ7XG4gICAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2NhbmNlbGxlZCcsIGZpbGU6IGZpbGUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlbW92ZSc6XG4gICAgICAgICAgaWYgKCFldmVudC5pZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnF1ZXVlLmZpbmRJbmRleChmaWxlID0+IGZpbGUuaWQgPT09IGV2ZW50LmlkKTtcbiAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLnF1ZXVlW2ldO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdyZW1vdmVkJywgZmlsZTogZmlsZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlbW92ZUFsbCc6XG4gICAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdyZW1vdmVkQWxsJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGFydFVwbG9hZCh1cGxvYWQ6IHsgZmlsZTogVXBsb2FkRmlsZSwgZXZlbnQ6IFVwbG9hZElucHV0IH0pOiBPYnNlcnZhYmxlPFVwbG9hZE91dHB1dD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLnVwbG9hZEZpbGUodXBsb2FkLmZpbGUsIHVwbG9hZC5ldmVudClcbiAgICAgICAgLnN1YnNjcmliZShvdXRwdXQgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLm5leHQob3V0cHV0KTtcbiAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zdWJzLnB1c2goeyBpZDogdXBsb2FkLmZpbGUuaWQsIHN1Yjogc3ViIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdXBsb2FkRmlsZShmaWxlOiBVcGxvYWRGaWxlLCBldmVudDogVXBsb2FkSW5wdXQpOiBPYnNlcnZhYmxlPFVwbG9hZE91dHB1dD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBldmVudC51cmwgfHwgJyc7XG4gICAgICBjb25zdCBtZXRob2QgPSBldmVudC5tZXRob2QgfHwgJ1BPU1QnO1xuICAgICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGEgfHwge307XG4gICAgICBjb25zdCBoZWFkZXJzID0gZXZlbnQuaGVhZGVycyB8fCB7fTtcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICBjb25zdCB0aW1lOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGxldCBwcm9ncmVzc1N0YXJ0VGltZTogbnVtYmVyID0gKGZpbGUucHJvZ3Jlc3MuZGF0YSAmJiBmaWxlLnByb2dyZXNzLmRhdGEuc3RhcnRUaW1lKSB8fCB0aW1lO1xuICAgICAgbGV0IHNwZWVkID0gMDtcbiAgICAgIGxldCBldGE6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGU6IFByb2dyZXNzRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKChlLmxvYWRlZCAqIDEwMCkgLyBlLnRvdGFsKTtcbiAgICAgICAgICBjb25zdCBkaWZmID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lO1xuICAgICAgICAgIHNwZWVkID0gTWF0aC5yb3VuZChlLmxvYWRlZCAvIGRpZmYgKiAxMDAwKTtcbiAgICAgICAgICBwcm9ncmVzc1N0YXJ0VGltZSA9IChmaWxlLnByb2dyZXNzLmRhdGEgJiYgZmlsZS5wcm9ncmVzcy5kYXRhLnN0YXJ0VGltZSkgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgZXRhID0gTWF0aC5jZWlsKChlLnRvdGFsIC0gZS5sb2FkZWQpIC8gc3BlZWQpO1xuXG4gICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IHtcbiAgICAgICAgICAgIHN0YXR1czogVXBsb2FkU3RhdHVzLlVwbG9hZGluZyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgcGVyY2VudGFnZTogcGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgc3BlZWQ6IHNwZWVkLFxuICAgICAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKHNwZWVkKX0vc2AsXG4gICAgICAgICAgICAgIHN0YXJ0VGltZTogcHJvZ3Jlc3NTdGFydFRpbWUsXG4gICAgICAgICAgICAgIGVuZFRpbWU6IG51bGwsXG4gICAgICAgICAgICAgIGV0YTogZXRhLFxuICAgICAgICAgICAgICBldGFIdW1hbjogdGhpcy5zZWNvbmRzVG9IdW1hbihldGEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIG9ic2VydmVyLm5leHQoeyB0eXBlOiAndXBsb2FkaW5nJywgZmlsZTogZmlsZSB9KTtcbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgIG9ic2VydmVyLmVycm9yKGUpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgIGNvbnN0IHNwZWVkQXZlcmFnZSA9IE1hdGgucm91bmQoZmlsZS5zaXplIC8gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gcHJvZ3Jlc3NTdGFydFRpbWUpICogMTAwMCk7XG4gICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IHtcbiAgICAgICAgICAgIHN0YXR1czogVXBsb2FkU3RhdHVzLkRvbmUsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMCxcbiAgICAgICAgICAgICAgc3BlZWQ6IHNwZWVkQXZlcmFnZSxcbiAgICAgICAgICAgICAgc3BlZWRIdW1hbjogYCR7aHVtYW5pemVCeXRlcyhzcGVlZEF2ZXJhZ2UpfS9zYCxcbiAgICAgICAgICAgICAgc3RhcnRUaW1lOiBwcm9ncmVzc1N0YXJ0VGltZSxcbiAgICAgICAgICAgICAgZW5kVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgIGV0YTogZXRhLFxuICAgICAgICAgICAgICBldGFIdW1hbjogdGhpcy5zZWNvbmRzVG9IdW1hbihldGEgfHwgMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZmlsZS5yZXNwb25zZVN0YXR1cyA9IHhoci5zdGF0dXM7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmlsZS5yZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBmaWxlLnJlc3BvbnNlID0geGhyLnJlc3BvbnNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpbGUucmVzcG9uc2VIZWFkZXJzID0gdGhpcy5wYXJzZVJlc3BvbnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7IHR5cGU6ICdkb25lJywgZmlsZTogZmlsZSB9KTtcblxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBldmVudC53aXRoQ3JlZGVudGlhbHMgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVwbG9hZEZpbGUgPSA8QmxvYkZpbGU+ZmlsZS5uYXRpdmVGaWxlO1xuICAgICAgICBjb25zdCB1cGxvYWRJbmRleCA9IHRoaXMucXVldWUuZmluZEluZGV4KG91dEZpbGUgPT4gb3V0RmlsZS5uYXRpdmVGaWxlID09PSB1cGxvYWRGaWxlKTtcblxuICAgICAgICBpZiAodGhpcy5xdWV1ZVt1cGxvYWRJbmRleF0ucHJvZ3Jlc3Muc3RhdHVzID09PSBVcGxvYWRTdGF0dXMuQ2FuY2VsbGVkKSB7XG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKSk7XG5cbiAgICAgICAgbGV0IGJvZHlUb1NlbmQ7XG5cbiAgICAgICAgaWYgKGV2ZW50LmluY2x1ZGVXZWJLaXRGb3JtQm91bmRhcnkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4gZmlsZS5mb3JtLmFwcGVuZChrZXksIGRhdGFba2V5XSkpO1xuICAgICAgICAgIGZpbGUuZm9ybS5hcHBlbmQoZXZlbnQuZmllbGROYW1lIHx8ICdmaWxlJywgdXBsb2FkRmlsZSwgdXBsb2FkRmlsZS5uYW1lKTtcbiAgICAgICAgICBib2R5VG9TZW5kID0gZmlsZS5mb3JtO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHlUb1NlbmQgPSB1cGxvYWRGaWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQoeyB0eXBlOiAnc3RhcnQnLCBmaWxlOiBmaWxlIH0pO1xuICAgICAgICB4aHIuc2VuZChib2R5VG9TZW5kKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgc2Vjb25kc1RvSHVtYW4oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRGF0ZShzZWMgKiAxMDAwKS50b0lTT1N0cmluZygpLnN1YnN0cigxMSwgOCk7XG4gIH1cblxuICBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KTtcbiAgfVxuXG4gIHNldENvbnRlbnRUeXBlcyhjb250ZW50VHlwZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBjb250ZW50VHlwZXMgIT0gJ3VuZGVmaW5lZCcgJiYgY29udGVudFR5cGVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGlmIChjb250ZW50VHlwZXMuZmluZCgodHlwZTogc3RyaW5nKSA9PiB0eXBlID09PSAnKicpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jb250ZW50VHlwZXMgPSBbJyonXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGVudFR5cGVzID0gY29udGVudFR5cGVzO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IFsnKiddO1xuICB9XG5cbiAgYWxsQ29udGVudFR5cGVzQWxsb3dlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50VHlwZXMuZmluZCgodHlwZTogc3RyaW5nKSA9PiB0eXBlID09PSAnKicpICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0NvbnRlbnRUeXBlQWxsb3dlZChtaW1ldHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWxsQ29udGVudFR5cGVzQWxsb3dlZCgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLmZpbmQoKHR5cGU6IHN0cmluZykgPT4gdHlwZSA9PT0gbWltZXR5cGUpICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBtYWtlVXBsb2FkRmlsZShmaWxlOiBGaWxlLCBpbmRleDogbnVtYmVyKTogVXBsb2FkRmlsZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGVJbmRleDogaW5kZXgsXG4gICAgICBpZDogdGhpcy5nZW5lcmF0ZUlkKCksXG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICBzaXplOiBmaWxlLnNpemUsXG4gICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICBmb3JtOiBuZXcgRm9ybURhdGEoKSxcbiAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgIHN0YXR1czogVXBsb2FkU3RhdHVzLlF1ZXVlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgICAgICBzcGVlZDogMCxcbiAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKDApfS9zYCxcbiAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXG4gICAgICAgICAgZW5kVGltZTogbnVsbCxcbiAgICAgICAgICBldGE6IG51bGwsXG4gICAgICAgICAgZXRhSHVtYW46IG51bGxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGxhc3RNb2RpZmllZERhdGU6IGZpbGUubGFzdE1vZGlmaWVkRGF0ZSxcbiAgICAgIHN1YjogdW5kZWZpbmVkLFxuICAgICAgbmF0aXZlRmlsZTogZmlsZVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHBhcnNlUmVzcG9uc2VIZWFkZXJzKGh0dHBIZWFkZXJzOiBCeXRlU3RyaW5nKSB7XG4gICAgaWYgKCFodHRwSGVhZGVycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaHR0cEhlYWRlcnMuc3BsaXQoJ1xcbicpXG4gICAgICAubWFwKHggPT4geC5zcGxpdCgvOiAqLywgMikpXG4gICAgICAuZmlsdGVyKHggPT4geFswXSlcbiAgICAgIC5yZWR1Y2UoKGFjLCB4KSA9PiB7XG4gICAgICAgIGFjW3hbMF1dID0geFsxXTtcbiAgICAgICAgcmV0dXJuIGFjO1xuICAgICAgfSwge30pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBPbkRlc3Ryb3ksIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVXBsb2FkT3V0cHV0LCBVcGxvYWRJbnB1dCwgVXBsb2FkZXJPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE5nVXBsb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtdXBsb2FkZXIuY2xhc3MnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0ZpbGVEcm9wXSdcbn0pXG5leHBvcnQgY2xhc3MgTmdGaWxlRHJvcERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgb3B0aW9uczogVXBsb2FkZXJPcHRpb25zO1xuICBASW5wdXQoKSB1cGxvYWRJbnB1dDogRXZlbnRFbWl0dGVyPFVwbG9hZElucHV0PjtcbiAgQE91dHB1dCgpIHVwbG9hZE91dHB1dDogRXZlbnRFbWl0dGVyPFVwbG9hZE91dHB1dD47XG5cbiAgdXBsb2FkOiBOZ1VwbG9hZGVyU2VydmljZTtcbiAgZWw6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgX3N1YjogU3Vic2NyaXB0aW9uW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLnVwbG9hZE91dHB1dCA9IG5ldyBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PigpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc3ViID0gW107XG4gICAgY29uc3QgY29uY3VycmVuY3kgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmNvbmN1cnJlbmN5IHx8IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBjb25zdCBhbGxvd2VkQ29udGVudFR5cGVzID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbGxvd2VkQ29udGVudFR5cGVzIHx8IFsnKiddO1xuICAgIGNvbnN0IG1heFVwbG9hZHMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heFVwbG9hZHMgfHwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIHRoaXMudXBsb2FkID0gbmV3IE5nVXBsb2FkZXJTZXJ2aWNlKGNvbmN1cnJlbmN5LCBhbGxvd2VkQ29udGVudFR5cGVzLCBtYXhVcGxvYWRzKTtcblxuICAgIHRoaXMuZWwgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIHRoaXMuX3N1Yi5wdXNoKFxuICAgICAgdGhpcy51cGxvYWQuc2VydmljZUV2ZW50cy5zdWJzY3JpYmUoKGV2ZW50OiBVcGxvYWRPdXRwdXQpID0+IHtcbiAgICAgICAgdGhpcy51cGxvYWRPdXRwdXQuZW1pdChldmVudCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAodGhpcy51cGxvYWRJbnB1dCBpbnN0YW5jZW9mIEV2ZW50RW1pdHRlcikge1xuICAgICAgdGhpcy5fc3ViLnB1c2godGhpcy51cGxvYWQuaW5pdElucHV0RXZlbnRzKHRoaXMudXBsb2FkSW5wdXQpKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLnN0b3BFdmVudCwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgdGhpcy5zdG9wRXZlbnQsIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5zdG9wRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1Yi5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBzdG9wRXZlbnQgPSAoZTogRXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25Ecm9wKGU6IGFueSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZXZlbnQ6IFVwbG9hZE91dHB1dCA9IHsgdHlwZTogJ2Ryb3AnIH07XG4gICAgdGhpcy51cGxvYWRPdXRwdXQuZW1pdChldmVudCk7XG4gICAgdGhpcy51cGxvYWQuaGFuZGxlRmlsZXMoZS5kYXRhVHJhbnNmZXIuZmlsZXMpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25EcmFnT3ZlcihlOiBFdmVudCkge1xuICAgIGlmICghZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50OiBVcGxvYWRPdXRwdXQgPSB7IHR5cGU6ICdkcmFnT3ZlcicgfTtcbiAgICB0aGlzLnVwbG9hZE91dHB1dC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pXG4gIHB1YmxpYyBvbkRyYWdMZWF2ZShlOiBFdmVudCkge1xuICAgIGlmICghZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50OiBVcGxvYWRPdXRwdXQgPSB7IHR5cGU6ICdkcmFnT3V0JyB9O1xuICAgIHRoaXMudXBsb2FkT3V0cHV0LmVtaXQoZXZlbnQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVwbG9hZE91dHB1dCwgVXBsb2FkZXJPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IE5nVXBsb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtdXBsb2FkZXIuY2xhc3MnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0ZpbGVTZWxlY3RdJ1xufSlcbmV4cG9ydCBjbGFzcyBOZ0ZpbGVTZWxlY3REaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IFVwbG9hZGVyT3B0aW9ucztcbiAgQElucHV0KCkgdXBsb2FkSW5wdXQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICBAT3V0cHV0KCkgdXBsb2FkT3V0cHV0OiBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PjtcblxuICB1cGxvYWQ6IE5nVXBsb2FkZXJTZXJ2aWNlO1xuICBlbDogSFRNTElucHV0RWxlbWVudDtcblxuICBfc3ViOiBTdWJzY3JpcHRpb25bXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHRoaXMudXBsb2FkT3V0cHV0ID0gbmV3IEV2ZW50RW1pdHRlcjxVcGxvYWRPdXRwdXQ+KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zdWIgPSBbXTtcbiAgICBjb25zdCBjb25jdXJyZW5jeSA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY29uY3VycmVuY3kgfHwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGNvbnN0IGFsbG93ZWRDb250ZW50VHlwZXMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmFsbG93ZWRDb250ZW50VHlwZXMgfHwgWycqJ107XG4gICAgY29uc3QgbWF4VXBsb2FkcyA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubWF4VXBsb2FkcyB8fCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgdGhpcy51cGxvYWQgPSBuZXcgTmdVcGxvYWRlclNlcnZpY2UoY29uY3VycmVuY3ksIGFsbG93ZWRDb250ZW50VHlwZXMsIG1heFVwbG9hZHMpO1xuXG4gICAgdGhpcy5lbCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5maWxlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIHRoaXMuX3N1Yi5wdXNoKFxuICAgICAgdGhpcy51cGxvYWQuc2VydmljZUV2ZW50cy5zdWJzY3JpYmUoKGV2ZW50OiBVcGxvYWRPdXRwdXQpID0+IHtcbiAgICAgICAgdGhpcy51cGxvYWRPdXRwdXQuZW1pdChldmVudCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAodGhpcy51cGxvYWRJbnB1dCBpbnN0YW5jZW9mIEV2ZW50RW1pdHRlcikge1xuICAgICAgdGhpcy5fc3ViLnB1c2godGhpcy51cGxvYWQuaW5pdElucHV0RXZlbnRzKHRoaXMudXBsb2FkSW5wdXQpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5lbCl7XG4gICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuZmlsZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICB0aGlzLl9zdWIuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cbiAgfVxuXG4gIGZpbGVMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5lbC5maWxlcykge1xuICAgICAgdGhpcy51cGxvYWQuaGFuZGxlRmlsZXModGhpcy5lbC5maWxlcyk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdGaWxlRHJvcERpcmVjdGl2ZSB9IGZyb20gJy4vbmctZmlsZS1kcm9wLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOZ0ZpbGVTZWxlY3REaXJlY3RpdmUgfSBmcm9tICcuL25nLWZpbGUtc2VsZWN0LmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW05nRmlsZURyb3BEaXJlY3RpdmUsIE5nRmlsZVNlbGVjdERpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtOZ0ZpbGVEcm9wRGlyZWN0aXZlLCBOZ0ZpbGVTZWxlY3REaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIE5neFVwbG9hZGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBYUUsUUFBSztJQUNMLFlBQVM7SUFDVCxPQUFJO0lBQ0osWUFBUzs7MEJBSFQsS0FBSzswQkFDTCxTQUFTOzBCQUNULElBQUk7MEJBQ0osU0FBUzs7Ozs7Ozs7OztBQ1hYLHVCQUE4QixLQUFhO0lBQ3pDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtRQUNmLE9BQU8sUUFBUSxDQUFDO0tBQ2pCOztJQUVELElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQzs7SUFDZixJQUFNLEtBQUssR0FBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O0lBQ2hFLElBQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUQsT0FBTyxVQUFVLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6RTtBQUVE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

/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.css":
/*!****************************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".menu {\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  background-color: white;\n  width: 100%;\n  overflow: auto;\n  box-sizing: border-box;\n  z-index: 100;\n  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15);\n  border-bottom: 1px solid rgba(34, 36, 38, .15);\n  border-left: 1px solid rgba(34, 36, 38, .15);\n  border-right: 1px solid rgba(34, 36, 38, .15);\n  border-top: 1px solid rgba(34, 36, 38, .15);\n  border-radius: 0 0 2px 2px;\n  min-width: -webkit-max-content;\n  min-width: -moz-max-content;\n  min-width: max-content;\n  margin-top: 1px;\n}\n\n.item {\n  /* padding: 4px; */\n  cursor: pointer;\n  white-space: inherit;\n  display: table;\n  width: 100%;\n  word-break: break-word;\n}\n\n.item:hover {\n  background-color: rgb(244, 245, 248);\n  color: #ff5f00;\n}\n\n.item.selected {\n  background-color: rgb(244, 245, 248);\n  color: #ff5f00;\n}\n\n.item.hilighted {\n  background-color: rgb(244, 245, 248);\n  color: #ff5f00;\n}\n\n.item > a {\n  padding: 6px;\n}\n\n.no-result-link > a {\n  color: #10aae0 !important;\n}\n\n#noresult:hover {\n  background: transparent;\n}\n\n.no-result-link {\n  top: 0;\n  z-index: 99;\n  background: #fff;\n  width: calc(100% - 15px);\n}\n\n.no-result-link{\n  width: 100%;\n}\n\n.no-result-link a.btn-link{\n  width: 100%;\n  border-bottom: 1px solid #ccc;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-pack: justify;\n            justify-content: space-between;\n    padding: 5px;\n}\n"

/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"menu\" *ngIf=\"isOpen && _rows\" style=\"background-color: white\" [style.min-height.px]=\"dropdownMinHeight\"\n     [style.max-height.px]=\"viewPortItems?.length !== 0? ItemHeight*(viewPortItems ? viewPortItems.length : 5)+10 : ItemHeight\">\n\n  <!-- *ngIf=\"viewPortItems?.length === 0 && noResultLinkEnabled\" -->\n  <div *ngIf=\"noResultLinkEnabled && !showLabelOnly\" class=\"item no-result-link\"\n       [style.height.px]=\"NoFoundLinkHeight\">\n    <a class=\"btn-link item\" href=\"javascript:void(0);\" (click)=\"$event.stopPropagation();noResultClicked.emit()\">\n      <ng-container [ngTemplateOutlet]=\"noResultLinkTemplate? noResultLinkTemplate: defaultTemplate\"></ng-container>\n      <ng-template #defaultTemplate>\n        {{notFoundLinkText}}\n      </ng-template>\n    </a>\n  </div>\n\n  <!--virtual-->\n  <virtual-scroll #v [items]=\"_rows\" (update)=\"viewPortItems = $event\" [style.max-height.px]=\"ItemHeight*4\"\n                  [childHeight]=\"viewPortItems?.length === 0?41:undefined\" [selectedValues]=\"selectedValues\"\n                  [NoFoundMsgHeight]=\"NoFoundMsgHeight\" [NoFoundLinkHeight]=\"NoFoundLinkHeight\"\n                  [noResultLinkEnabled]=\"noResultLinkEnabled\" [salesShSelectPading]=\"salesShSelectPading\">\n\n\n    <div class=\"item\" *ngFor=\"let row of viewPortItems\" [class.selected]=\"selectedValues?.indexOf(row) !== -1\"\n         [class.hilighted]=\"row.isHilighted\" (click)=\"toggleSelected(row)\" [style.height.px]=\"ItemHeight\">\n      <ng-template [ngTemplateOutletContext]=\"{option: row}\" [ngTemplateOutlet]=\"optionTemplate\"></ng-template>\n      <ng-container *ngIf=\"!optionTemplate\">\n        <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n          <div class=\"item\">{{row.label}}</div>\n        </a>\n      </ng-container>\n    </div>\n\n    <div id=\"noresult\" *ngIf=\"viewPortItems?.length === 0\" class=\"item\"\n         [style.height.px]=\"noResultLinkEnabled ? NoFoundMsgHeight : (NoFoundMsgHeight - 20)\">\n      <a href=\"javascript:void(0);\">{{notFoundMsg}}</a>\n    </div>\n\n  </virtual-scroll>\n\n</div>\n"

/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.ts ***!
  \***************************************************************************/
/*! exports provided: SalesShSelectMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesShSelectMenuComponent", function() { return SalesShSelectMenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _virtual_scroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./virtual-scroll */ "./src/app/theme/sales-ng-virtual-select/virtual-scroll.ts");



var SalesShSelectMenuComponent = /** @class */ (function () {
    function SalesShSelectMenuComponent() {
        this.notFoundLinkText = 'Create New';
        this.showLabelOnly = false;
        this.salesShSelectPading = 0;
        this.noToggleClick = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noResultClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.math = Math;
    }
    Object.defineProperty(SalesShSelectMenuComponent.prototype, "rows", {
        set: function (val) {
            if (this.virtualScrollElm) {
                // this.virtualScrollElm.scrollInto(this._rows[0]);
            }
            this._rows = val;
            if (this.virtualScrollElm) {
                this.virtualScrollElm.refresh();
            }
        },
        enumerable: true,
        configurable: true
    });
    SalesShSelectMenuComponent.prototype.ngOnChanges = function (changes) {
        // if (changes['isOpen'] && changes['isOpen'].currentValue) {
        //   this.dyHeight = Number(window.getComputedStyle(this.listContainer.nativeElement).height);
        // }
    };
    SalesShSelectMenuComponent.prototype.toggleSelected = function (row) {
        this.noToggleClick.emit(row);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], SalesShSelectMenuComponent.prototype, "selectedValues", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectMenuComponent.prototype, "isOpen", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], SalesShSelectMenuComponent.prototype, "optionTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectMenuComponent.prototype, "notFoundMsg", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectMenuComponent.prototype, "notFoundLinkText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectMenuComponent.prototype, "noResultLinkEnabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], SalesShSelectMenuComponent.prototype, "noResultLinkTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectMenuComponent.prototype, "ItemHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectMenuComponent.prototype, "NoFoundMsgHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectMenuComponent.prototype, "NoFoundLinkHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectMenuComponent.prototype, "dropdownMinHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectMenuComponent.prototype, "showLabelOnly", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectMenuComponent.prototype, "salesShSelectPading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesShSelectMenuComponent.prototype, "noToggleClick", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectMenuComponent.prototype, "noResultClicked", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_virtual_scroll__WEBPACK_IMPORTED_MODULE_2__["VirtualScrollComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _virtual_scroll__WEBPACK_IMPORTED_MODULE_2__["VirtualScrollComponent"])
    ], SalesShSelectMenuComponent.prototype, "virtualScrollElm", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('listContainer'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesShSelectMenuComponent.prototype, "listContainer", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Array])
    ], SalesShSelectMenuComponent.prototype, "rows", null);
    SalesShSelectMenuComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sh-select-menu',
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            template: __webpack_require__(/*! ./sh-select-menu.component.html */ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.html"),
            styles: [__webpack_require__(/*! ./sh-select-menu.component.css */ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.css")]
        })
    ], SalesShSelectMenuComponent);
    return SalesShSelectMenuComponent;
}());



/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  position: relative;\n}\n\n/* .header {\n    width: 100%;\n    margin: 0 !important;\n    padding: 2px 30px 2px 10px;\n    box-sizing: border-box;\n    background-color: white;\n    font-size: 1.0em;\n    border-radius: 2px;\n    border: 1px solid rgba(34, 36, 38, .15);\n    vertical-align: middle;\n    cursor: pointer;\n} */\n\n.header:hover {\n  cursor: text;\n}\n\n.header.inline {\n  background-color: transparent;\n  width: -webkit-max-content;\n  width: -moz-max-content;\n  width: max-content;\n  border: none;\n}\n\n.header.open {\n  border-radius: 2px 2px 0 0;\n  /* box-shadow: 0 2px 3px 0 rgba(34, 36, 38, .15); */\n  border-bottom: none;\n  line-height: auto;\n}\n\n.header:focus {\n  outline: 0;\n}\n\ndiv {\n  display: block;\n}\n\n/* input[type=\"text\"] {\n    border: none !important;\n    vertical-align: middle !important;\n    width: 100%;\n    margin: 0 !important;\n    padding: 0px !important;\n    box-sizing: border-box;\n    background-color: white;\n    font-size: 1.0rem !important;\n    line-height: 2rem !important;\n    letter-spacing: 0.01rem !important;\n    font-family: 'RobotoDraft', 'Roboto', 'Helvetica Neue, Helvetica, Arial', sans-serif;\n    font-style: normal !important;\n    font-weight: 300 !important;\n    -webkit-font-smoothing: antialiased !important;\n    -moz-osx-font-smoothing: grayscale !important;\n    text-rendering: optimizeLegibility !important;\n} */\n\ninput[type=\"text\"] {\n  outline: none;\n  width: 100%;\n}\n\n[hidden] {\n  display: none;\n}\n\ni.close.icon.clear::after {\n  content: \"✕\";\n  padding-right: 8px;\n  font-weight: 800;\n  color: gray;\n}\n\ni.close.icon.clear:hover::after {\n  color: red;\n}\n\n.clear {\n    position: absolute;\n    right: 2px;\n    padding-left: 2px;\n    padding-right: 2px;\n    top: 15px;\n    cursor: pointer;\n    font-size: 25px;\n    font-weight: 500;\n    line-height: 100%;\n    opacity: .5;\n    color: black;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n  }\n\n.sh-select-disabled {\n  background-color: #e3e3e3;\n  color: darkgray;\n  cursor: not-allowed;\n}\n\n.chip {\n  display: inline-block;\n  padding: 0 7px;\n  height: 30px;\n  font-size: 14px;\n  line-height: 30px;\n  border-radius: 4px;\n  background-color: #f4f5f8;\n  margin: 0px 0 4px 4px;\n  /* color: white; */\n}\n\n.chipClosebtn {\n  padding-left: 10px;\n  font-weight: 500;\n  float: right;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: .6;\n}\n\n.chipClosebtn:hover {\n  font-weight: 700;\n  opacity: .5;\n  color: black;\n}\n\n.sh-select-disabled .selectedVal,\n.sh-select-disabled .form-control {\n  background: #eee !important;\n  pointer-events: none;\n  cursor: not-allowed;\n}\n\n.selectedVal {\n  border: 1px solid #d6d6d6 !important;\n  padding-right: 5px !important;\n  background: #fff !important;\n}\n\n.header.open > input[type=\"text\"] {\n  border-color: #d6d6d6;\n}\n\n.header .bdr > input[type=\"text\"] {\n  border: 0;\n}\n\n.header .bdr > input[type=\"text\"]::-webkit-input-placeholder {\n  color: #c1c1c1 !important;\n}\n\n.header .bdr > input[type=\"text\"]::-moz-placeholder {\n  color: #c1c1c1 !important;\n}\n\n.header .bdr > input[type=\"text\"]:-ms-input-placeholder {\n  color: #c1c1c1 !important;\n}\n\n.header .bdr > input[type=\"text\"]:-moz-placeholder {\n  color: #c1c1c1 !important;\n}\n\n.toggle {\n  position: absolute;\n  right: 0;\n  border: 1px solid #ddd;\n  height: 100%;\n  width: 28px;\n  text-align: center;\n  line-height: 32px;\n  vertical-align: middle;\n  top: 0;\n  bottom: 0;\n  cursor: pointer;\n  background: #f4f5f8;\n  color: #686868;\n  font-size: 16px;\n}\n\nbutton.form-control:focus {\n  border-color: #ddd !important;\n}\n\n.label-btn {\n  border: 0 !important;\n  background: transparent !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  font-size: 20px;\n  color: #393a3d;\n}\n\n.toggle:hover {\n  background: #eee;\n}\n\n.label-toggle {\n  border: 0 !important;\n  background: transparent !important;\n  border-radius: 0;\n}\n\n.bottom-border-only {\n  border: none !important;\n  border-bottom: 1px solid #d6d6d6 !important;\n  border-radius: 0 !important;\n}\n\n.Advance-Search .header {\n  position: relative;\n}\n \n"

/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select.component.html":
/*!************************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #dd [style.width]=\"width\" class=\"pr\">\n  <!-- (click)=\"show($event)\" -->\n  <div class=\"header\" #mainContainer [class.sh-select-disabled]=\"disabled\" [class.inline]=\"mode==='inline'\"\n    [class.open]=\"isOpen\" (focus)=\"show($event)\" (blur)=\"hide($event)\" (keydown)=\"keydownUp($event)\">\n\n\n    <!--region multiple-->\n    <div *ngIf=\"multiple\" [ngClass]=\"{'has-item':selectedValues?.length}\" style=\"background: white;\" class=\"bdr\">\n      <ng-container *ngIf=\"selectedValues?.length\">\n        <span class=\"chip\" *ngFor=\"let sl of selectedValues\">\n          {{ sl.label }}\n          <span class=\"chipClosebtn\" (mousedown)=\"clearSingleSelection($event, sl)\"\n            (click)=\"clearSingleSelection($event, sl)\">&times;</span>\n        </span>\n      </ng-container>\n      <!-- (click)=\"show($event);\" -->\n      <input type=\"text\" class=\"pdL1\"\n        [ngClass]=\"{'hasValue':filter?.length, 'bottom-border-only' : showBottomBorderOnly}\" #inputFilter tabindex=\"0\"\n        (blur)=\"filterInputBlur($event)\" [placeholder]=\"selectedValues?.length > 0 ? filter : placeholder\"\n        [(ngModel)]=\"filter\" (ngModelChange)=\"updateFilter($event)\">\n    </div>\n    <!--endregion-->\n\n    <!--region single-->\n    <!-- <b *ngIf=\"!multiple && showLabelOnly\" [hidden]=\"((!isOpen || !isFilterEnabled))\">{{selectedValues[0]?.label}}</b> -->\n    <button class=\"label-btn form-control text-left\" *ngIf=\"!multiple && showLabelOnly\"\n      [hidden]=\"((!isOpen || !isFilterEnabled))\">{{selectedValues[0]?.label}}\n    </button>\n\n    <input type=\"text\" [ngClass]=\"{'bottom-border-only' : showBottomBorderOnly}\" class=\"form-control\" #inputFilter\n      *ngIf=\"!multiple && !showLabelOnly\" [hidden]=\"((!isOpen || !isFilterEnabled))\" (blur)=\"filterInputBlur($event)\"\n      [placeholder]=\"placeholder\" [(ngModel)]=\"filter\" (ngModelChange)=\"updateFilter($event)\"\n      style=\"padding-right: 28px !important;\">\n\n    <!-- (click)=\"show($event);\" -->\n    <div *ngIf=\"((!isOpen || !isFilterEnabled) && !multiple)\">\n      <ng-container *ngIf=\"selectedValues?.length\">\n        <div *ngIf=\"!multiple\">\n          <button class=\"form-control label-btn text-left\" *ngIf=\"showLabelOnly\">{{selectedValues[0]?.label}}</button>\n          <input type=\"text\" *ngIf=\"!showLabelOnly\" [ngClass]=\"{'bottom-border-only' : showBottomBorderOnly}\"\n            (input)=\"openListIfNotOpened($event)\" (click)=\"selectText($event);\" type=\"text\"\n            value=\"{{selectedValues[0].label}}\" class=\"form-control selectedVal cp\" />\n        </div>\n      </ng-container>\n      <ng-container *ngIf=\"!selectedValues?.length\">\n        <input type=\"text\" [ngClass]=\"{'bottom-border-only' : showBottomBorderOnly}\" *ngIf=\"!showLabelOnly\"\n          [tabindex]=\"tabIndex\" class=\"fristElementToFocus form-control\" name=\"filter2\" [(ngModel)]=\"filter\"\n          (input)=\"openListIfNotOpened($event)\" [placeholder]=\"placeholder\" [value]=\"filter\"\n          style=\"padding-right: 28px !important;\" />\n      </ng-container>\n    </div>\n    <!--endregion-->\n\n    <!-- *ngIf=\"!isOpen && selectedValues.length === 0\" -->\n    <!-- <div class=\"toggle\" [ngClass]=\"{ 'label-toggle':showBottomBorderOnly}\" *ngIf=\"isOpen\" (click)=\"hide();\"><i class=\"fa fa-caret-up\"></i></div>\n    <div class=\"toggle\" [ngClass]=\"{ 'label-toggle':showBottomBorderOnly}\" *ngIf=\"!isOpen\" (click)=\"show($event)\"><i class=\"fa fa-caret-down\"></i></div> -->\n\n  </div>\n\n  <!-- <span class=\"clear\" *ngIf=\"showClear && selectedValues.length > 0\" (click)=\"$event.stopPropagation();clear();\">&times;</span> -->\n  <sh-select-menu #menuEle [showLabelOnly]=\"showLabelOnly\" [isOpen]=\"isOpen\" [rows]=\"rows\"\n    [selectedValues]=\"selectedValues\" [optionTemplate]=\"optionTemplate\" (noToggleClick)=\"toggleSelected($event)\"\n    (noResultClicked)=\"noResultsClicked.emit(); hide()\" [noResultLinkEnabled]=\"notFoundLink\" [notFoundMsg]=\"notFoundMsg\"\n    [notFoundLinkText]=\"notFoundLinkText\" [ItemHeight]=\"ItemHeight\" [NoFoundMsgHeight]=\"NoFoundMsgHeight\"\n    [NoFoundLinkHeight]=\"NoFoundLinkHeight\" [noResultLinkTemplate]=\"notFoundLinkTemplate\"\n    [dropdownMinHeight]=\"dropdownMinHeight\" [salesShSelectPading]=\"salesShSelectPading\"></sh-select-menu>\n</div>"

/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select.component.ts ***!
  \**********************************************************************/
/*! exports provided: SalesShSelectComponent, ShSelectProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesShSelectComponent", function() { return SalesShSelectComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShSelectProvider", function() { return ShSelectProvider; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _sh_select_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sh-select-menu.component */ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.ts");
/* harmony import */ var apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apps/web-giddh/src/app/lodash-optimized */ "./src/app/lodash-optimized.ts");

/**
 * Created by yonifarin on 12/3/16.
 */




var FLATTEN_SEARCH_TERM = 'flatten';
// noinspection TsLint
var SalesShSelectComponent = /** @class */ (function () {
    function SalesShSelectComponent(element, renderer, cdRef) {
        this.element = element;
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.idEl = '';
        this.placeholder = 'Type to filter';
        this.multiple = false;
        this.mode = 'default';
        this.showClear = false;
        this.notFoundMsg = 'No results found';
        this.notFoundLinkText = 'Create New';
        this.notFoundLink = false;
        this.isFilterEnabled = true;
        this.width = 'auto';
        this.ItemHeight = 41;
        this.NoFoundMsgHeight = 30;
        this.NoFoundLinkHeight = 30;
        this.dropdownMinHeight = 35;
        this.useInBuiltFilterForFlattenAc = false;
        this.useInBuiltFilterForIOptionTypeItems = false;
        this.doNotReset = false;
        this.showLabelOnly = false;
        this.showBottomBorderOnly = false;
        this.salesShSelectPading = 0;
        this.tabIndex = 0;
        this.onHide = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onShow = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onClear = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.selected = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noOptionsFound = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.noResultsClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.viewInitEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.rows = [];
        this.filter = '';
        this.filteredData = [];
        /** Keys. **/
        this.KEYS = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            UP: 38,
            DOWN: 40
        };
        this._options = [];
        this._selectedValues = [];
    }
    Object.defineProperty(SalesShSelectComponent.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (val) {
            this._options = val;
            this.updateRows(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SalesShSelectComponent.prototype, "selectedValues", {
        get: function () {
            return this._selectedValues;
        },
        set: function (val) {
            if (!val) {
                val = [];
            }
            if (!Array.isArray(val)) {
                val = [val];
            }
            if (val.length > 0 && this.rows) {
                this._selectedValues = this.rows.filter(function (f) { return val.findIndex(function (p) { return p === f.label || p === f.value; }) !== -1; });
            }
            else {
                this._selectedValues = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * on click outside the view close the menu
     * @param event
     */
    SalesShSelectComponent.prototype.onDocumentClick = function (event) {
        if (this.isOpen && !this.element.nativeElement.contains(event.target)) {
            this.isOpen = false;
            if (this.selectedValues && this.selectedValues.length === 1 && !this.multiple) {
                this.filter = this.selectedValues[0].label;
            }
            else if (this.doNotReset && this.filter !== '') {
                this.propagateChange(this.filter);
            }
            else {
                this.clearFilter();
            }
            this.onHide.emit();
        }
    };
    SalesShSelectComponent.prototype.updateRows = function (val) {
        if (val === void 0) { val = []; }
        this.rows = val;
    };
    SalesShSelectComponent.prototype.filterByIOption = function (array, term, action) {
        if (action === void 0) { action = 'default'; }
        var filteredArr;
        var startsWithArr;
        var includesArr = [];
        filteredArr = this.getFilteredArrOfIOptionItems(array, term, action);
        startsWithArr = filteredArr.filter(function (item) {
            if (Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["startsWith"])(item.label.toLocaleLowerCase(), term) || Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["startsWith"])(item.value.toLocaleLowerCase(), term)) {
                return item;
            }
            else {
                includesArr.push(item);
            }
        });
        startsWithArr = startsWithArr.sort(function (a, b) { return a.label.length - b.label.length; });
        includesArr = includesArr.sort(function (a, b) { return a.label.length - b.label.length; });
        return Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["concat"])(startsWithArr, includesArr);
    };
    SalesShSelectComponent.prototype.getFilteredArrOfIOptionItems = function (array, term, action) {
        if (action === FLATTEN_SEARCH_TERM) {
            return array.filter(function (item) {
                var mergedAccounts = _.cloneDeep(item.additional.mergedAccounts.split(',').map(function (a) { return a.trim().toLocaleLowerCase(); }));
                return _.includes(item.label.toLocaleLowerCase(), term) || _.includes(item.additional.uniqueName.toLocaleLowerCase(), term) || _.includes(mergedAccounts, term);
            });
        }
        else {
            return array.filter(function (item) {
                return Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["includes"])(item.label.toLocaleLowerCase(), term) || Object(apps_web_giddh_src_app_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["includes"])(item.value.toLocaleLowerCase(), term);
            });
        }
    };
    SalesShSelectComponent.prototype.updateFilter = function (filterProp) {
        var _this = this;
        var lowercaseFilter = filterProp.toLocaleLowerCase();
        if (this.useInBuiltFilterForFlattenAc && this._options) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter, FLATTEN_SEARCH_TERM);
        }
        else if (this._options && this.useInBuiltFilterForIOptionTypeItems) {
            this.filteredData = this.filterByIOption(this._options, lowercaseFilter);
        }
        else {
            var filteredData = this._options ? this._options.filter(function (item) {
                if (_this.customFilter) {
                    return _this.customFilter(lowercaseFilter, item);
                }
                return !lowercaseFilter || (item.label).toLocaleLowerCase().indexOf(lowercaseFilter) !== -1;
            }) : [];
            if (this.customSorting) {
                this.filteredData = filteredData.sort(this.customSorting);
            }
            else {
                this.filteredData = filteredData.sort(function (a, b) { return a.label.length - b.label.length; });
            }
        }
        if (this.filteredData.length === 0) {
            this.noOptionsFound.emit(true);
        }
        this.updateRows(this.filteredData);
    };
    SalesShSelectComponent.prototype.clearFilter = function () {
        if (this.filter === '') {
            return;
        }
        this.filter = '';
        if (this.isFilterEnabled) {
            this.updateFilter(this.filter);
        }
    };
    SalesShSelectComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    SalesShSelectComponent.prototype.toggleSelected = function (item) {
        var callChanges = true;
        if (!item) {
            return;
        }
        this.clearFilter();
        if (!this.multiple) {
            if (this._selectedValues[0] && this._selectedValues[0].value === item.value) {
                callChanges = false;
            }
        }
        if (this.multiple) {
            this.selectMultiple(item);
        }
        else {
            this.selectSingle(item);
        }
        if (callChanges) {
            this.onChange();
        }
    };
    SalesShSelectComponent.prototype.selectSingle = function (item) {
        this._selectedValues.splice(0, this.rows.length);
        this._selectedValues.push(item);
        this.hide();
    };
    SalesShSelectComponent.prototype.selectMultiple = function (item) {
        if (this.selectedValues.indexOf(item) === -1) {
            this.selectedValues.push(item);
        }
        else {
            this.selectedValues.splice(this.selectedValues.indexOf(item), 1);
        }
    };
    SalesShSelectComponent.prototype.focusFilter = function () {
        if (this.isFilterEnabled && this.filter && this.filter !== '') {
            // this.updateFilter(this.filter);
        }
        // setTimeout(() => {
        //   this.renderer.invokeElementMethod(this.inputFilter.nativeElement, 'focus');
        // }, 0);
    };
    SalesShSelectComponent.prototype.show = function (e) {
        var _this = this;
        if (this.isOpen || this.disabled) {
            return;
        }
        this.isOpen = true;
        this.focusFilter();
        this.onShow.emit();
        if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
            var item = this.rows.find(function (p) { return p.value === (_this._selectedValues.length > 0 ? _this._selectedValues[0] : (_this.rows.length > 0 ? _this.rows[0].value : null)); });
            if (item !== null) {
                this.menuEle.virtualScrollElm.scrollInto(item);
            }
        }
        this.cdRef.markForCheck();
    };
    SalesShSelectComponent.prototype.keydownUp = function (event) {
        var key = event.which;
        if (this.isOpen) {
            if (key === this.KEYS.ESC || key === this.KEYS.TAB || (key === this.KEYS.UP && event.altKey)) {
                this.hide();
            }
            else if (key === this.KEYS.ENTER) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getHighlightedOption();
                    if (item !== null) {
                        this.toggleSelected(item);
                    }
                }
                // this.selectHighlightedOption();
            }
            else if (key === this.KEYS.UP) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getPreviousHilightledOption();
                    if (item !== null) {
                        // this.toggleSelected(item);
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
                // this.optionList.highlightPreviousOption();
                // this.dropdown.moveHighlightedIntoView();
                // if (!this.filterEnabled) {
                //   event.preventDefault();
                // }
            }
            else if (key === this.KEYS.DOWN) {
                if (this.menuEle && this.menuEle.virtualScrollElm && this.menuEle.virtualScrollElm) {
                    var item = this.menuEle.virtualScrollElm.getNextHilightledOption();
                    if (item !== null) {
                        // this.toggleSelected(item);
                        this.menuEle.virtualScrollElm.scrollInto(item);
                        this.menuEle.virtualScrollElm.startupLoop = true;
                        this.menuEle.virtualScrollElm.refresh();
                        event.preventDefault();
                    }
                }
                // ----
                // this.optionList.highlightNextOption();
                // this.dropdown.moveHighlightedIntoView();
                // if (!this.filterEnabled) {
                //   event.preventDefault();
                // }
            }
        }
        this.cdRef.detectChanges();
    };
    SalesShSelectComponent.prototype.hide = function (event) {
        if (event) {
            if (event.relatedTarget && (!this.ele.nativeElement.contains(event.relatedTarget))) {
                this.isOpen = false;
                if (this.selectedValues && this.selectedValues.length === 1) {
                    this.filter = this.selectedValues[0].label;
                }
                else {
                    this.clearFilter();
                }
                this.onHide.emit();
            }
        }
        else if (this.isOpen && this.doNotReset && this.filter !== '') {
            this.isOpen = false;
            this.propagateChange(this.filter);
            this.onHide.emit();
        }
        else {
            this.isOpen = false;
            if (this.selectedValues && this.selectedValues.length === 1) {
                this.filter = this.selectedValues[0].label;
            }
            else {
                this.clearFilter();
            }
            this.onHide.emit();
        }
        this.cdRef.markForCheck();
    };
    SalesShSelectComponent.prototype.filterInputBlur = function (event) {
        if (event.relatedTarget && this.ele.nativeElement) {
            if (this.ele.nativeElement.contains(event.relatedTarget)) {
                return false;
            }
            else if (this.doNotReset && event && event.target && event.target.value) {
                return false;
            }
            else {
                this.hide();
            }
        }
    };
    SalesShSelectComponent.prototype.clear = function () {
        if (this.disabled) {
            return;
        }
        this.selectedValues = [];
        this.onChange();
        this.clearFilter();
        this.onClear.emit();
        this.hide();
    };
    SalesShSelectComponent.prototype.ngOnInit = function () {
        //
    };
    SalesShSelectComponent.prototype.ngAfterViewInit = function () {
        this.viewInitEvent.emit(true);
    };
    SalesShSelectComponent.prototype.ngOnChanges = function (changes) {
        if ('forceClearReactive' in changes && !changes.forceClearReactive.firstChange) {
            if (this.forceClearReactive.status) {
                this.filter = '';
                this.clear();
            }
        }
    };
    //////// ControlValueAccessor imp //////////
    SalesShSelectComponent.prototype.writeValue = function (value) {
        this.selectedValues = value;
        if (!this.cdRef['destroyed']) {
            this.cdRef.detectChanges();
        }
    };
    SalesShSelectComponent.prototype.propagateChange = function (_) {
        //
    };
    SalesShSelectComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    SalesShSelectComponent.prototype.registerOnTouched = function () {
        //
    };
    SalesShSelectComponent.prototype.clearSingleSelection = function (event, option) {
        event.stopPropagation();
        this.selectedValues = this.selectedValues.filter(function (f) { return f.value !== option.value; }).map(function (p) { return p.value; });
        this.onChange();
    };
    SalesShSelectComponent.prototype.onChange = function () {
        if (this.multiple) {
            var newValues = void 0;
            newValues = this._selectedValues.map(function (p) { return p.value; });
            this.propagateChange(newValues);
            this.selected.emit(this._selectedValues);
        }
        else {
            var newValue = void 0;
            if (this.selectedValues.length > 0) {
                newValue = this.selectedValues[0];
            }
            if (!newValue) {
                newValue = {
                    value: null,
                    label: null,
                    additional: null
                };
            }
            this.filter = newValue.label;
            this.propagateChange(newValue.value);
            this.selected.emit(newValue);
        }
    };
    SalesShSelectComponent.prototype.selectText = function (ev) {
        ev.target.setSelectionRange(0, ev.target.value.length);
    };
    SalesShSelectComponent.prototype.openListIfNotOpened = function (ev) {
        var _this = this;
        if (!this.isOpen) {
            this.filter = ev.target.value;
            this.show(ev);
            setTimeout(function () {
                _this.renderer.invokeElementMethod(_this.inputFilter.nativeElement, 'focus');
            }, 10);
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "idEl", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "placeholder", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "multiple", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "mode", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "showClear", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectComponent.prototype, "forceClearReactive", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "disabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "notFoundMsg", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "notFoundLinkText", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "notFoundLink", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ContentChild"])('notFoundLinkTemplate'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], SalesShSelectComponent.prototype, "notFoundLinkTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "isFilterEnabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesShSelectComponent.prototype, "width", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "ItemHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "NoFoundMsgHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "NoFoundLinkHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "dropdownMinHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function)
    ], SalesShSelectComponent.prototype, "customFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function)
    ], SalesShSelectComponent.prototype, "customSorting", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "useInBuiltFilterForFlattenAc", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "useInBuiltFilterForIOptionTypeItems", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "doNotReset", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "showLabelOnly", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesShSelectComponent.prototype, "showBottomBorderOnly", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "salesShSelectPading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesShSelectComponent.prototype, "tabIndex", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('inputFilter'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesShSelectComponent.prototype, "inputFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mainContainer'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesShSelectComponent.prototype, "mainContainer", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('menuEle'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _sh_select_menu_component__WEBPACK_IMPORTED_MODULE_3__["SalesShSelectMenuComponent"])
    ], SalesShSelectComponent.prototype, "menuEle", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ContentChild"])('optionTemplate'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["TemplateRef"])
    ], SalesShSelectComponent.prototype, "optionTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('dd'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesShSelectComponent.prototype, "ele", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesShSelectComponent.prototype, "onHide", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesShSelectComponent.prototype, "onShow", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesShSelectComponent.prototype, "onClear", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectComponent.prototype, "selected", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectComponent.prototype, "noOptionsFound", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectComponent.prototype, "noResultsClicked", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesShSelectComponent.prototype, "viewInitEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Array])
    ], SalesShSelectComponent.prototype, "options", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('window:mouseup', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], SalesShSelectComponent.prototype, "onDocumentClick", null);
    SalesShSelectComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sales-sh-select',
            template: __webpack_require__(/*! ./sh-select.component.html */ "./src/app/theme/sales-ng-virtual-select/sh-select.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            providers: [
                {
                    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"],
                    useExisting: ShSelectProvider(),
                    multi: true
                }
            ],
            styles: [__webpack_require__(/*! ./sh-select.component.css */ "./src/app/theme/sales-ng-virtual-select/sh-select.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]])
    ], SalesShSelectComponent);
    return SalesShSelectComponent;
}());

function ShSelectProvider() {
    return Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["forwardRef"])(function () { return SalesShSelectComponent; });
}


/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/sh-select.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/sh-select.module.ts ***!
  \*******************************************************************/
/*! exports provided: SalesShSelectModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesShSelectModule", function() { return SalesShSelectModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _virtual_scroll__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./virtual-scroll */ "./src/app/theme/sales-ng-virtual-select/virtual-scroll.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _sh_select_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sh-select.component */ "./src/app/theme/sales-ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _sh_select_menu_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sh-select-menu.component */ "./src/app/theme/sales-ng-virtual-select/sh-select-menu.component.ts");








var SalesShSelectModule = /** @class */ (function () {
    function SalesShSelectModule() {
    }
    SalesShSelectModule_1 = SalesShSelectModule;
    SalesShSelectModule.forRoot = function () {
        return {
            ngModule: SalesShSelectModule_1
        };
    };
    var SalesShSelectModule_1;
    SalesShSelectModule = SalesShSelectModule_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _virtual_scroll__WEBPACK_IMPORTED_MODULE_3__["VirtualScrollModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_5__["ClickOutsideModule"]
            ],
            declarations: [
                _sh_select_component__WEBPACK_IMPORTED_MODULE_6__["SalesShSelectComponent"],
                _sh_select_menu_component__WEBPACK_IMPORTED_MODULE_7__["SalesShSelectMenuComponent"]
            ],
            exports: [_sh_select_component__WEBPACK_IMPORTED_MODULE_6__["SalesShSelectComponent"]]
        })
    ], SalesShSelectModule);
    return SalesShSelectModule;
}());



/***/ }),

/***/ "./src/app/theme/sales-ng-virtual-select/virtual-scroll.ts":
/*!*****************************************************************!*\
  !*** ./src/app/theme/sales-ng-virtual-select/virtual-scroll.ts ***!
  \*****************************************************************/
/*! exports provided: VirtualScrollComponent, VirtualScrollModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VirtualScrollComponent", function() { return VirtualScrollComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VirtualScrollModule", function() { return VirtualScrollModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");



var VirtualScrollComponent = /** @class */ (function () {
    function VirtualScrollComponent(element, renderer) {
        this.element = element;
        this.renderer = renderer;
        this.items = [];
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.change = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.start = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.end = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.startupLoop = true;
    }
    Object.defineProperty(VirtualScrollComponent.prototype, "width", {
        get: function () {
            var el = this.element.nativeElement;
            var viewWidth = el.clientWidth - this.scrollbarWidth;
            return viewWidth;
        },
        enumerable: true,
        configurable: true
    });
    VirtualScrollComponent.prototype.ngOnInit = function () {
        this.onScrollListener = this.renderer.listen(this.element.nativeElement, 'scroll', this.refresh.bind(this));
        this.scrollbarWidth = 0; // this.element.nativeElement.offsetWidth - this.element.nativeElement.clientWidth;
        this.scrollbarHeight = 0; // this.element.nativeElement.offsetHeight - this.element.nativeElement.clientHeight;
    };
    VirtualScrollComponent.prototype.ngOnChanges = function (changes) {
        this.previousStart = undefined;
        this.previousEnd = undefined;
        this.refresh();
    };
    VirtualScrollComponent.prototype.ngOnDestroy = function () {
        // Check that listener has been attached properly:
        // It may be undefined in some cases, e.g. if an exception is thrown, the component is
        // not initialized properly but destroy may be called anyways (e.g. in testing).
        if (this.onScrollListener !== undefined) {
            // this removes the listener
            this.onScrollListener();
        }
    };
    VirtualScrollComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.selectedValues && this.selectedValues.length > 0) {
            var item_1 = this.items.find(function (p) { return p.value === (_this.selectedValues.length > 0 ? _this.selectedValues[0].value : (_this.items.length > 0 ? _this.items[0].value : null)); });
            setTimeout(function () {
                _this.scrollInto(item_1);
            }, 50);
        }
    };
    VirtualScrollComponent.prototype.refresh = function () {
        requestAnimationFrame(this.calculateItems.bind(this));
    };
    VirtualScrollComponent.prototype.scrollInto = function (item) {
        var index = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }
        var d = this.calculateDimensions();
        if ((index + 1) < d.itemsPerCol) {
            this.element.nativeElement.scrollTop = 0;
        }
        else if (((this.items || []).length - d.itemsPerCol) > 0 && ((this.items || []).length - d.itemsPerCol) < index) {
            this.element.nativeElement.scrollTop = Math.floor(((this.items || []).length - d.itemsPerCol) / d.itemsPerRow) * d.childHeight;
        }
        else {
            this.element.nativeElement.scrollTop = Math.floor(index / d.itemsPerRow) * d.childHeight;
        }
        this.items.forEach(function (p) { return p.isHilighted = false; });
        item.isHilighted = true;
        this.refresh();
    };
    VirtualScrollComponent.prototype.getHighlightedOption = function () {
        var index = this.items.findIndex(function (p) { return p.isHilighted; });
        if (index > -1) {
            return this.items[index];
        }
        return null;
    };
    VirtualScrollComponent.prototype.getPreviousHilightledOption = function () {
        var index = this.items.findIndex(function (p) { return p.isHilighted; });
        if (index > 0) {
            return this.items[index - 1];
        }
        else {
            return this.items[0];
        }
    };
    VirtualScrollComponent.prototype.getNextHilightledOption = function () {
        var index = this.items.findIndex(function (p) { return p.isHilighted; });
        if (index < this.items.length) {
            return this.items[index + 1];
        }
        else {
            return this.items[0];
        }
    };
    VirtualScrollComponent.prototype.countItemsPerRow = function () {
        var offsetTop;
        var itemsPerRow;
        var children = this.contentElementRef.nativeElement.children;
        for (itemsPerRow = 0; itemsPerRow < children.length; itemsPerRow++) {
            if (offsetTop !== undefined && offsetTop !== children[itemsPerRow].offsetTop) {
                break;
            }
            offsetTop = children[itemsPerRow].offsetTop;
        }
        return itemsPerRow;
    };
    VirtualScrollComponent.prototype.calculateDimensions = function () {
        var el = this.element.nativeElement;
        var content = this.contentElementRef.nativeElement;
        var items = this.items || [];
        var itemCount = items.length === 0 ? 2 : this.items.length;
        var viewWidth = el.clientWidth - this.scrollbarWidth;
        var viewHeight = el.clientHeight - this.scrollbarHeight;
        var contentDimensions;
        if (this.childWidth === undefined || this.childHeight === undefined) {
            contentDimensions = content.children[0] ? content.children[0].getBoundingClientRect() : {
                width: viewWidth,
                height: viewHeight
            };
        }
        var childWidth = this.childWidth || contentDimensions.width;
        var childHeight = this.childHeight || contentDimensions.height;
        var itemsPerRow = Math.max(1, this.countItemsPerRow());
        var itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth));
        var itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));
        if (itemsPerCol === 1 && Math.floor(el.scrollTop / this.scrollHeight * itemCount) + itemsPerRowByCalc >= itemCount) {
            itemsPerRow = itemsPerRowByCalc;
        }
        return {
            // Total Items
            itemCount: itemCount,
            // Virtual Scroller width -- visible part only
            viewWidth: viewWidth,
            // Virtual Scroller height -- visible part only
            viewHeight: viewHeight,
            // Single Item Width
            childWidth: childWidth,
            // Signle item height
            childHeight: childHeight,
            itemsPerRow: itemsPerRow,
            itemsPerCol: itemsPerCol,
            itemsPerRowByCalc: itemsPerRowByCalc
        };
    };
    VirtualScrollComponent.prototype.calculateItems = function () {
        var el = this.element.nativeElement;
        var d = this.calculateDimensions();
        var items = this.items || [];
        this.scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow;
        if (this.element.nativeElement.scrollTop > this.scrollHeight) {
            this.element.nativeElement.scrollTop = this.scrollHeight;
        }
        var indexByScrollTop = el.scrollTop / this.scrollHeight * d.itemCount / d.itemsPerRow;
        var end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1));
        var maxStartEnd = end;
        var modEnd = end % d.itemsPerRow;
        if (modEnd) {
            maxStartEnd = end + d.itemsPerRow - modEnd;
        }
        var maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
        var start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow);
        this.topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow);
        if (start !== this.previousStart || end !== this.previousEnd) {
            this.update.emit(items.slice(start, end));
            if (start !== this.previousStart && this.startupLoop === false) {
                this.start.emit({ start: start, end: end });
            }
            if (end !== this.previousEnd && this.startupLoop === false) {
                this.end.emit({ start: start, end: end });
            }
            this.previousStart = start;
            this.previousEnd = end;
            if (this.startupLoop === true) {
                this.refresh();
            }
            else {
                this.change.emit({ start: start, end: end });
            }
        }
        else if (this.startupLoop === true) {
            this.update.emit(items.slice(start, end));
            this.startupLoop = false;
            this.refresh();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], VirtualScrollComponent.prototype, "items", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], VirtualScrollComponent.prototype, "selectedValues", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "scrollbarWidth", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "scrollbarHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "childWidth", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "childHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "NoFoundMsgHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "NoFoundLinkHeight", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], VirtualScrollComponent.prototype, "noResultLinkEnabled", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], VirtualScrollComponent.prototype, "update", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], VirtualScrollComponent.prototype, "change", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], VirtualScrollComponent.prototype, "start", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], VirtualScrollComponent.prototype, "end", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('content', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], VirtualScrollComponent.prototype, "contentElementRef", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], VirtualScrollComponent.prototype, "salesShSelectPading", void 0);
    VirtualScrollComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'virtual-scroll',
            template: "\n    <div class=\"total-padding\" [style.height]=\"(items.length === 0 ? noResultLinkEnabled ? NoFoundMsgHeight + NoFoundLinkHeight : NoFoundMsgHeight : scrollHeight) + 'px'\"></div>\n    <div class=\"scrollable-content\" #content [style.transform]=\"'translateY(' + topPadding + 'px)'\" [style.padding-top.px]=\"salesShSelectPading\">\n      <ng-content></ng-content>\n    </div>\n  ",
            styles: ["\n    :host {\n      display: block;\n      overflow: auto;\n      overflow-y: auto;\n      position: relative;\n      -webkit-overflow-scrolling: touch;\n    }\n\n    .scrollable-content {\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      position: absolute;\n    }\n\n    .total-padding {\n      width: 1px;\n      opacity: 0;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer"]])
    ], VirtualScrollComponent);
    return VirtualScrollComponent;
}());

var VirtualScrollModule = /** @class */ (function () {
    function VirtualScrollModule() {
    }
    VirtualScrollModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]],
            exports: [VirtualScrollComponent],
            declarations: [VirtualScrollComponent]
        })
    ], VirtualScrollModule);
    return VirtualScrollModule;
}());



/***/ })

}]);