import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'new-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * ConfirmModalComponent component
 * Handles confirmmodal functionality and user interactions
 */
export class ConfirmModalComponent {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
    }

    /**
     * This will close the dialog and will send response
     *
     * @param {boolean} response
     * @memberof ConfirmModalComponent
     */
    public sendResponse(response: boolean): void {
        this.dialogRef.close(response);
    }
}
