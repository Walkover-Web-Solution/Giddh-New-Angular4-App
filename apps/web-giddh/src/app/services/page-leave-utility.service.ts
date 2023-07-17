import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { LocaleService } from "./locale.service";
import { CommonActions } from "../actions/common.actions";
import { AppState } from "../store";
import { Store } from "@ngrx/store";

@Injectable()
export class PageLeaveUtilityService {
    constructor(
        private dialog: MatDialog,
        private localeService: LocaleService,
        private commonAction: CommonActions,
        private store: Store<AppState>
    ) {

    }

    /**
     * Opens confirmation dialog
     *
     * @returns {*}
     * @memberof PageLeaveUtilityService
     */
    public openDialog(saveGlobalUnsavedChange: boolean = true): any {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.localeService.translate("app_unsaved_changes.title"),
                body: this.localeService.translate("app_unsaved_changes.content"),
                ok: this.localeService.translate("app_unsaved_changes.yes"),
                cancel: this.localeService.translate("app_unsaved_changes.no"),
                permanentlyDeleteMessage: ' '
            },
            panelClass: 'page-leave-confirmation-modal',
            backdropClass: 'page-leave-confirmation-modal-backdrop',
            width: '585px'
        });

        this.addBrowserConfirmationDialog(saveGlobalUnsavedChange);

        dialogRef.afterOpened().subscribe(() => {
            document.querySelector("body")?.classList?.add("page-leave-confirmation-modal-wrapper");
        });

        dialogRef.afterClosed().subscribe((action) => {
            document.querySelector("body")?.classList?.remove("page-leave-confirmation-modal-wrapper");
            if (action) {
                this.removeBrowserConfirmationDialog();
            }
        });

        return dialogRef;
    }

    /**
     * Removes browser leave confirmation popup
     *
     * @memberof PageLeaveUtilityService
     */
    public removeBrowserConfirmationDialog(): void {
        this.store.dispatch(this.commonAction.hasUnsavedChanges(false));
        document.querySelector("body").removeAttribute("onbeforeunload");
        document.querySelector("body").classList?.remove("page-leave-confirmation-modal-wrapper");
    }

    /**
     * Adds browser leave confirmation popup
     *
     * @memberof PageLeaveUtilityService
     */
    public addBrowserConfirmationDialog(saveGlobalUnsavedChange: boolean = true): void {
        if (saveGlobalUnsavedChange) {
            this.store.dispatch(this.commonAction.hasUnsavedChanges(true));
        }
        document.querySelector("body").setAttribute("onbeforeunload", "return 'true';");
    }

    /**
     * Shows page leave confirmation
     *
     * @private
     * @param {Function} callback
     * @memberof PageLeaveUtilityService
     */
    public confirmPageLeave(callback: Function, saveGlobalUnsavedChange: boolean = true): void {
        let dialogRef = this.openDialog(saveGlobalUnsavedChange);

        dialogRef.afterClosed().subscribe((action) => {
            if (action) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}