import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { LocaleService } from "./locale.service";
import { CommonActions } from "../actions/common.actions";
import { AppState } from "../store";
import { Store } from "@ngrx/store";
import { remove } from '../lodash-optimized';
import { Configuration } from '../app.constant';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * PageLeaveUtilityService service
 * Provides pageleaveutility related business logic and data operations
 */
export class PageLeaveUtilityService {
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
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
            backdropClass: ['page-leave-confirmation-modal-backdrop', 'cdk-overlay-dark-backdrop'],
            width: '585px',
            disableClose: false
        });

        this.addBrowserConfirmationDialog(saveGlobalUnsavedChange);

        dialogRef.afterOpened().subscribe(() => {
            document.querySelector("body")?.classList?.add("page-leave-confirmation-modal-wrapper");
        });

        dialogRef.afterClosed().subscribe((action) => {
            document.querySelector("body")?.classList?.remove("page-leave-confirmation-modal-wrapper");
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                /**
                 * Handles if functionality
                 */
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        (window as any).electronAPI.send('has-unsaved-changes', false);
                        electronIpcAvailable = true;
                    } catch (ipcError) {

                    }
                }

                // Try legacy electron require (fallback)
                /**
                 * Handles if functionality
                 */
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        /**
                         * Handles if functionality
                         */
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            electron.ipcRenderer.send('has-unsaved-changes', false);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {

                    }
                }

                // Fallback to regular browser behavior if IPC not available
                /**
                 * Handles if functionality
                 */
                if (!electronIpcAvailable) {

                    window.onbeforeunload = null;
                }
            } catch (error) {

                window.onbeforeunload = null;
            }
        } else {
            window.onbeforeunload = null;
        }
        document.querySelector("body").classList?.remove("page-leave-confirmation-modal-wrapper");
    }

    /**
     * Adds browser leave confirmation popup
     *
     * @memberof PageLeaveUtilityService
     */
    public addBrowserConfirmationDialog(saveGlobalUnsavedChange: boolean = true): void {
        /**
         * Handles if functionality
         */
        if (saveGlobalUnsavedChange) {
            this.store.dispatch(this.commonAction.hasUnsavedChanges(true));
        }

        /**
         * Handles if functionality
         */
        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                /**
                 * Handles if functionality
                 */
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        (window as any).electronAPI.send('has-unsaved-changes', true);
                        electronIpcAvailable = true;
                    } catch (ipcError) {

                    }
                }

                // Try legacy electron require (fallback)
                /**
                 * Handles if functionality
                 */
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        /**
                         * Handles if functionality
                         */
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            electron.ipcRenderer.send('has-unsaved-changes', true);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {

                    }
                }

                // Fallback to regular browser behavior if IPC not available
                /**
                 * Handles if functionality
                 */
                if (!electronIpcAvailable) {

                    window.onbeforeunload = () => 'true';
                }
            } catch (error) {

                window.onbeforeunload = () => 'true';
            }
        } else {
            window.onbeforeunload = () => 'true';
        }

    }

    /**
     * Opens confirmation dialog without automatic cleanup
     * Used when external code needs to handle cleanup manually
     *
     * @returns {*}
     * @memberof PageLeaveUtilityService
     */
    public openDialogWithoutAutoCleanup(saveGlobalUnsavedChange: boolean = true): any {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.localeService.translate("app_unsaved_changes.title"),
                body: this.localeService.translate("app_unsaved_changes.content"),
                ok: this.localeService.translate("app_unsaved_changes.yes"),
                cancel: this.localeService.translate("app_unsaved_changes.no"),
                permanentlyDeleteMessage: ' '
            },
            panelClass: 'page-leave-confirmation-modal',
            backdropClass: ['page-leave-confirmation-modal-backdrop', 'cdk-overlay-dark-backdrop'],
            width: '585px',
            disableClose: false
        });

        this.addBrowserConfirmationDialog(saveGlobalUnsavedChange);

        dialogRef.afterOpened().subscribe(() => {
            document.querySelector("body")?.classList?.add("page-leave-confirmation-modal-wrapper");
        });

        // No afterClosed subscription - let the calling code handle everything
        return dialogRef;
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
            /**
             * Handles if functionality
             */
            if (action) {
                /**
                 * Handles callback functionality
                 */
                callback(true);
            } else {
                /**
                 * Handles callback functionality
                 */
                callback(false);
            }
        });
    }
}
