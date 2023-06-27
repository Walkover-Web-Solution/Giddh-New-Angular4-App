import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmModalComponent } from "../theme/new-confirm-modal/confirm-modal.component";

@Injectable()
export class PageLeaveUtilityService {
    constructor(
        private dialog: MatDialog
    ) {

    }

    public openDialog(): any {
        return this.dialog.open(ConfirmModalComponent, {
            data: {
                title: "Confirmation",
                body: 'You have unsaved changes. Do you want to save and leave this page?',
                ok: "Yes",
                cancel: "No",
                permanentlyDeleteMessage: ' '
            }
        });
    }
}