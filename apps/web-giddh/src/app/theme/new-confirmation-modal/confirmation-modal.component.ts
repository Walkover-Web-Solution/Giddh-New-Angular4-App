import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'new-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * NewConfirmationModalComponent component
 * Handles newconfirmationmodal functionality and user interactions
 */
export class NewConfirmationModalComponent {
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
     * @param {*} response
     * @memberof NewConfirmationModalComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef.close(response);
    }
}
