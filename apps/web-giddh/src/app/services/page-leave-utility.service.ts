import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";
import { LocaleService } from "./locale.service";

@Injectable()
export class PageLeaveUtilityService {
    constructor(
        private dialog: MatDialog,
        private localeService: LocaleService
    ) {

    }

    /**
     * Opens confirmation dialog
     *
     * @returns {*}
     * @memberof PageLeaveUtilityService
     */
    public openDialog(): any {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.localeService.translate("app_unsaved_changes.title"),
                body: this.localeService.translate("app_unsaved_changes.content"),
                ok: this.localeService.translate("app_unsaved_changes.yes"),
                cancel: this.localeService.translate("app_unsaved_changes.no"),
                permanentlyDeleteMessage: ' '
            }
        });

        document.querySelector("body").setAttribute("onbeforeunload", "return 'true';");

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
        document.querySelector("body").removeAttribute("onbeforeunload");
        document.querySelector("body").classList?.remove("page-leave-confirmation-modal-wrapper");
    }

    /**
     * Adds browser leave confirmation popup
     *
     * @memberof PageLeaveUtilityService
     */
    public addBrowserConfirmationDialog(): void {
        document.querySelector("body").setAttribute("onbeforeunload", "return 'true';");
    }
}