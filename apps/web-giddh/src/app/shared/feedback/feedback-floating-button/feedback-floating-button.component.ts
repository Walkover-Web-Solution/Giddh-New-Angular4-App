import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackService } from '../feedback.service';

/** Position of the floating button, in pixels from the viewport's top left corner */
interface FeedbackButtonPosition {
    x: number;
    y: number;
}

/** Local storage key holding the button's last position */
const POSITION_STORAGE_KEY = 'feedbackFloatingButtonPosition';

/** Distance (px) the pointer must move before a press counts as a drag rather than a click */
const DRAG_THRESHOLD = 4;

/** Gap (px) kept between the button and the viewport edges */
const EDGE_GAP = 8;

@Component({
    selector: 'feedback-floating-button',
    templateUrl: './feedback-floating-button.component.html',
    styleUrls: ['./feedback-floating-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTooltipModule]
})
export class FeedbackFloatingButtonComponent {
    public readonly feedbackService = inject(FeedbackService);

    /** Wrapper element, measured to keep the button inside the viewport */
    private readonly wrapper = viewChild<ElementRef<HTMLElement>>('wrapper');

    /** True if floating button should be shown (configured and signed-in user) */
    public readonly showFloatingButton = computed(() => this.feedbackService.isConfigured() && this.feedbackService.isLoggedIn());

    /** Current position; null keeps the default bottom-right placement */
    public readonly position = signal<FeedbackButtonPosition | null>(this.readStoredPosition());

    /** True while the button is being dragged */
    public readonly isDragging = signal<boolean>(false);

    /** Pointer press details for the drag in progress */
    private pressStart: { pointerX: number; pointerY: number; offsetX: number; offsetY: number } | null = null;

    /** True when the last press moved far enough to count as a drag, so its click is ignored */
    private suppressClick = false;

    /**
     * Starts tracking a possible drag
     */
    public onPointerDown(event: PointerEvent): void {
        if (event.button !== 0) {
            return;
        }
        const element = this.wrapper()?.nativeElement;
        if (!element) {
            return;
        }
        const rect = element.getBoundingClientRect();
        this.pressStart = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };
        this.suppressClick = false;
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    }

    /**
     * Moves the button with the pointer once past the drag threshold
     */
    public onPointerMove(event: PointerEvent): void {
        if (!this.pressStart) {
            return;
        }
        if (!this.isDragging()) {
            const moved = Math.hypot(event.clientX - this.pressStart.pointerX, event.clientY - this.pressStart.pointerY);
            if (moved < DRAG_THRESHOLD) {
                return;
            }
            this.isDragging.set(true);
        }
        event.preventDefault();
        this.position.set(this.clamp({
            x: event.clientX - this.pressStart.offsetX,
            y: event.clientY - this.pressStart.offsetY
        }));
    }

    /**
     * Ends the drag and saves the position
     */
    public onPointerUp(event: PointerEvent): void {
        if (!this.pressStart) {
            return;
        }
        (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
        this.pressStart = null;
        if (this.isDragging()) {
            this.isDragging.set(false);
            this.suppressClick = true;
            this.storePosition(this.position());
        }
    }

    /**
     * Opens feedback dialog, unless the press was a drag
     */
    public openFeedback(): void {
        if (this.suppressClick) {
            this.suppressClick = false;
            return;
        }
        this.feedbackService.openFeedbackDialog();
    }

    /**
     * Keeps the button inside the viewport when the window is resized
     */
    @HostListener('window:resize')
    public onWindowResize(): void {
        const current = this.position();
        if (current) {
            this.position.set(this.clamp(current));
        }
    }

    /**
     * Restricts a position to the visible viewport
     */
    private clamp(position: FeedbackButtonPosition): FeedbackButtonPosition {
        const element = this.wrapper()?.nativeElement;
        const width = element?.offsetWidth ?? 0;
        const height = element?.offsetHeight ?? 0;
        const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
        const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
        return {
            x: Math.min(Math.max(position.x, EDGE_GAP), maxX),
            y: Math.min(Math.max(position.y, EDGE_GAP), maxY)
        };
    }

    /**
     * Reads the last saved position from local storage
     */
    private readStoredPosition(): FeedbackButtonPosition | null {
        try {
            const stored = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY) ?? 'null');
            if (stored && Number.isFinite(stored.x) && Number.isFinite(stored.y)) {
                // Pull a position saved on a larger screen back into view
                return {
                    x: Math.min(Math.max(stored.x, EDGE_GAP), Math.max(EDGE_GAP, window.innerWidth - 140)),
                    y: Math.min(Math.max(stored.y, EDGE_GAP), Math.max(EDGE_GAP, window.innerHeight - 60))
                };
            }
        } catch {
            // Storage unavailable or value malformed: fall back to the default placement
        }
        return null;
    }

    /**
     * Saves the position to local storage
     */
    private storePosition(position: FeedbackButtonPosition | null): void {
        if (!position) {
            return;
        }
        try {
            localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ x: Math.round(position.x), y: Math.round(position.y) }));
        } catch {
            // Storage unavailable: the position simply is not remembered
        }
    }
}
