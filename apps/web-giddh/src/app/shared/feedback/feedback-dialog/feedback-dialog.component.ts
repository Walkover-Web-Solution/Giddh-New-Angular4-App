import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackService } from '../feedback.service';

@Component({
    selector: 'feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule
    ]
})
export class FeedbackDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<FeedbackDialogComponent>);
    private readonly feedbackService = inject(FeedbackService);

    /** Feedback text input value */
    public readonly feedbackText = signal<string>('');

    /** Loading state while submitting */
    public readonly loading = signal<boolean>(false);

    /** Success state after submission accepted */
    public readonly success = signal<boolean>(false);

    /** Error message to display plainly */
    public readonly errorMessage = signal<string>('');

    /**
     * Submits feedback text to Steward
     */
    public sendFeedback(): void {
        const text = this.feedbackText().trim();
        if (!text || this.loading()) {
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.feedbackService.submitFeedback(text).subscribe({
            next: (response) => {
                this.loading.set(false);
                if (response.status === 202 || (response.status >= 200 && response.status < 300)) {
                    this.success.set(true);
                } else {
                    this.errorMessage.set('Unexpected response from server. Please try again.');
                }
            },
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                if (err.status === 429) {
                    this.errorMessage.set('Too many requests at once. Please try again shortly.');
                } else {
                    const plainError = err.error?.message || err.message || 'Unable to send feedback. Please try again.';
                    this.errorMessage.set(plainError);
                }
            }
        });
    }

    /**
     * Closes the dialog
     */
    public closeDialog(): void {
        this.dialogRef.close(this.success());
    }
}
