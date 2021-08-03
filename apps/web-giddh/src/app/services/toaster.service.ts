import { Injectable } from '@angular/core';
import { APP_DEFAULT_TITLE, DEFAULT_TOASTER_OPTIONS, DEFAULT_TOASTER_OPTIONS_WITH_HTML } from '../app.constant';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../theme/snackbar/snackbar.component';

@Injectable()
export class ToasterService {

    constructor(private _toaster: ToastrService, private snackBar: MatSnackBar) {

    }

    public successToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.success(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    /**
     * This function is used to show success message with html
     *
     * @param {string} msg
     * @param {string} [title=APP_DEFAULT_TITLE]
     * @memberof ToasterService
     */
    public successToastWithHtml(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this._toaster.success(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS_WITH_HTML));
    }

    public errorToast(msg: string, title: string = APP_DEFAULT_TITLE, params?: any): void {
        if (params) {
            params = { timeOut: params };
            this._toaster.error(msg, title, Object.assign({}, { ...DEFAULT_TOASTER_OPTIONS, ...params }));
        } else {
            this._toaster.error(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
        }
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

    public showSnackBar(type: string, message: string, title: string = APP_DEFAULT_TITLE): void {
        this.snackBar.openFromComponent(SnackBarComponent, {
            data: { title: title, message: message },
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: type,
            duration: 3000
        });
    }
}
