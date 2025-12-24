import { Injectable } from '@angular/core';
import { APP_DEFAULT_TITLE, DEFAULT_TOASTER_OPTIONS, DEFAULT_TOASTER_OPTIONS_WITH_HTML } from '../app.constant';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { SnackbarComponent } from '../theme/snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {

    constructor(private toaster: ToastrService, private snackBar: MatSnackBar) {

    }

    public successToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this.toaster.success(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    /**
     * This function is used to show success message with html
     *
     * @param {string} msg
     * @param {string} [title=APP_DEFAULT_TITLE]
     * @memberof ToasterService
     */
    public successToastWithHtml(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this.toaster.success(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS_WITH_HTML));
    }

    public errorToast(msg: string, title: string = APP_DEFAULT_TITLE, params?: any): void {
        if (params) {
            params = { timeOut: params };
            this.toaster.error(msg, title, Object.assign({}, { ...DEFAULT_TOASTER_OPTIONS, ...params }));
        } else {
            this.toaster.error(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
        }
    }

    public warningToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this.toaster.warning(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public warningToastWithTime(timeout: number, msg: string, title: string = APP_DEFAULT_TITLE): void {
        let defaultToasterOptions = DEFAULT_TOASTER_OPTIONS_WITH_HTML;
        defaultToasterOptions.timeOut = timeout;
        this.toaster.warning(msg, title, Object.assign({}, defaultToasterOptions));
    }

    public infoToast(msg: string, title: string = APP_DEFAULT_TITLE): void {
        this.toaster.info(msg, title, Object.assign({}, DEFAULT_TOASTER_OPTIONS));
    }

    public clearAllToaster(): void {
        this.toaster.clear();
    }

    /**
     * This will show snack bar for alert messages
     *
     * @param {string} type
     * @param {string} message
     * @param {string} [title=APP_DEFAULT_TITLE]
     * @memberof ToasterService
     */
    public showSnackBar(type: string, message: string, title: string = APP_DEFAULT_TITLE): void {
        // Use Material Snack Bar as fallback since SnackbarComponent is commented out
        const config = {
            duration: 5000,
            horizontalPosition: 'center' as const,
            verticalPosition: 'top' as const,
            panelClass: [`snackbar-${type}`]
        };

        // Show message with title if provided
        const displayMessage = title && title !== APP_DEFAULT_TITLE ? `${title}: ${message}` : message;

        this.snackBar.open(displayMessage, 'Close', config);

        // Keep console log for debugging
        console.log(`${type}: ${title} - ${message}`);
    }
}
