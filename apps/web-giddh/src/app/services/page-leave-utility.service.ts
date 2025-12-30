import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { LocaleService } from "./locale.service";
import { CommonActions } from "../actions/common.actions";
import { AppState } from "../store";
import { Store } from "@ngrx/store";
import { remove } from '../lodash-optimized';
import { Configuration } from '../app.constant';

@Injectable({
    providedIn: 'root'
})
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
        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        (window as any).electronAPI.send('has-unsaved-changes', false);
                        electronIpcAvailable = true;
                    } catch (ipcError) {
                        console.warn('ElectronAPI send failed:', ipcError);
                    }
                }

                // Try legacy electron require (fallback)
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            electron.ipcRenderer.send('has-unsaved-changes', false);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {
                        console.warn('Electron require failed:', requireError);
                    }
                }

                // Fallback to regular browser behavior if IPC not available
                if (!electronIpcAvailable) {
                    console.warn('Electron IPC not available for page leave utility, using browser fallback');
                    window.onbeforeunload = null;
                }
            } catch (error) {
                console.warn('Electron page leave utility failed, using browser fallback:', error);
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
        if (saveGlobalUnsavedChange) {
            this.store.dispatch(this.commonAction.hasUnsavedChanges(true));
        }

        if (Configuration.isElectron) {
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        (window as any).electronAPI.send('has-unsaved-changes', true);
                        electronIpcAvailable = true;
                    } catch (ipcError) {
                        console.warn('ElectronAPI send failed:', ipcError);
                    }
                }

                // Try legacy electron require (fallback)
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            electron.ipcRenderer.send('has-unsaved-changes', true);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {
                        console.warn('Electron require failed:', requireError);
                    }
                }

                // Fallback to regular browser behavior if IPC not available
                if (!electronIpcAvailable) {
                    console.warn('Electron IPC not available for page leave utility, using browser fallback');
                    window.onbeforeunload = () => 'true';
                }
            } catch (error) {
                console.warn('Electron page leave utility failed, using browser fallback:', error);
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
            if (action) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}
