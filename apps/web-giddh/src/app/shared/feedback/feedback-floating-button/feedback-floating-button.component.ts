import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackService } from '../feedback.service';

@Component({
    selector: 'feedback-floating-button',
    templateUrl: './feedback-floating-button.component.html',
    styleUrls: ['./feedback-floating-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTooltipModule]
})
export class FeedbackFloatingButtonComponent {
    public readonly feedbackService = inject(FeedbackService);

    /** True if floating button should be shown (configured, signed-in user AND no sidebar present/visible) */
    public readonly showFloatingButton = computed(() => {
        return this.feedbackService.isConfigured() && this.feedbackService.isLoggedIn() && !this.feedbackService.isSidebarVisible();
    });

    /**
     * Opens feedback dialog
     */
    public openFeedback(): void {
        this.feedbackService.openFeedbackDialog();
    }
}
