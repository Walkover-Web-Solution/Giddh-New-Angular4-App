import { Injectable } from '@angular/core';
import { APP_DEFAULT_TITLE, DEFAULT_TOASTER_OPTIONS } from '../app.constant';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToasterService {

    constructor(private _toaster: ToastrService) {

    }

    public successToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.success(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public errorToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.error(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public warningToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.warning(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public infoToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.info(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public clearAllToaster(): void {
        this._toaster.clear();
    }
}
