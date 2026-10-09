import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "copy-particular-dialog",
    templateUrl: "./copy-particular-dialog.component.html",
    styleUrls: ["./copy-particular-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class CopyParticularDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        private changeDetection: ChangeDetectorRef,
        private dialogRef: MatDialogRef<CopyParticularDialogComponent>
    ) { }

    /**
     * Triggers change detection to refresh the dialog view.
     *
     * @memberof CopyParticularDialogComponent
     */
    public refreshView(): void {
        this.changeDetection.detectChanges();
    }

    /**
     * Closes the dialog after preventing default browser behavior.
     *
     * @param {Event} [event]
     * @memberof CopyParticularDialogComponent
     */
    public closeDialog(event?: Event): void {
        event?.preventDefault();
        this.dialogRef.close();
    }
}