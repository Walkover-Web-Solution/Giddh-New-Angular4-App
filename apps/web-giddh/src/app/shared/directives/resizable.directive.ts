import { Directive, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UiSettingsService } from '../../services/ui-settings.service';

/**
 * A reusable Angular directive that adds drag-to-resize functionality to any element
 * with per-page width persistence using localStorage.
 *
 * Features:
 * - Drag to resize with min/max constraints and 3px drag threshold
 * - Click to toggle between current and default width
 * - Per-page persistence using moduleName identifier
 * - Responsive behavior that adapts to window size changes
 * - Performance optimized with requestAnimationFrame and pointer capture
 *
 * @example
 * ```html
 * <div appResizable
 *      resizableTarget=".left-panel"
 *      [minWidth]="300"
 *      [maxWidthRatio]="0.5"
 *      [defaultWidthRatio]="0.4"
 *      [moduleName]="'contact-preview'"
 *      class="container">
 *   <div class="left-panel">Resizable content</div>
 *   <div class="right-panel flex-grow-1">Fixed content</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[appResizable]',
  standalone: true
})
export class ResizableDirective implements OnInit, OnDestroy {
  /** CSS selector for the target element to resize. If empty, uses first child element */
  @Input() resizableTarget: string = '';

  /** Minimum width in pixels */
  @Input() minWidth: number = 250;

  /** Maximum width as ratio of window width (0.75 = 75%) */
  @Input() maxWidthRatio: number = 0.75;

  /** Default width as ratio of window width (0.4 = 40%) */
  @Input() defaultWidthRatio: number = 0.4;

  /** Width of the resizer handle in pixels */
  @Input() resizerWidth: number = 6;

  /** Unique identifier for per-page width storage */
  @Input() moduleName: string = 'default';

  private isResizing = false;
  private startX = 0;
  private startWidth = 0;
  private newWidth = 0;
  private targetElement: HTMLElement | null = null;
  private resizerElement: HTMLElement | null = null;
  private justFinishedDrag = false;
  private dragStarted = false;
  private dragThreshold = 3;
  private uiSettingsService = inject(UiSettingsService);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Angular lifecycle hook - Initialize the directive
   */
  ngOnInit(): void {
    // Initialize last window width
    this.lastWindowWidth = window.innerWidth;

    this.createResizer();
    this.initializeEventListeners();
    this.setInitialWidth();
  }

  /**
   * Angular lifecycle hook - Clean up resources
   */
  ngOnDestroy(): void {
    this.removeEventListeners();

    // Clean up resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  /**
   * Creates the resizer element and attaches it to the DOM
   * @private
   */
  private createResizer(): void {
    // Find target element
    if (this.resizableTarget) {
      this.targetElement = this.el.nativeElement.querySelector(this.resizableTarget);
    } else {
      this.targetElement = this.el.nativeElement.firstElementChild as HTMLElement;
    }

    if (!this.targetElement) {
      return;
    }

    // Create resizer element
    this.resizerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.resizerElement, 'resizer');
    this.renderer.setStyle(this.resizerElement, 'width', `${this.resizerWidth}px`);
    this.renderer.setStyle(this.resizerElement, 'cursor', 'col-resize');
    this.renderer.setStyle(this.resizerElement, 'background', 'var(--color-medium-gray)');
    this.renderer.setStyle(this.resizerElement, 'position', 'relative');
    this.renderer.setStyle(this.resizerElement, 'flex-shrink', '0');
    this.renderer.setAttribute(this.resizerElement, 'title', 'Click to toggle, Drag to resize');

    // Add hover effect
    this.renderer.listen(this.resizerElement, 'mouseenter', () => {
      this.renderer.setStyle(this.resizerElement, 'background', 'var(--theme-primary-color)');
    });

    this.renderer.listen(this.resizerElement, 'mouseleave', () => {
      this.renderer.setStyle(this.resizerElement, 'background', 'var(--color-medium-gray)');
    });

    // Insert resizer after target element
    this.renderer.insertBefore(
      this.targetElement.parentNode,
      this.resizerElement,
      this.targetElement.nextSibling
    );

    // Add event listeners to resizer
    this.renderer.listen(this.resizerElement, 'mousedown', (event) => this.startResize(event));
    this.renderer.listen(this.resizerElement, 'click', (event) => this.toggleResize(event));
  }

  /**
   * Initializes global event listeners for mouse/pointer events and window resize
   * @private
   */
  private initializeEventListeners(): void {
    // Use both mouse and pointer events for better compatibility and tracking
    document.addEventListener('pointermove', this.onMouseMove, { passive: false });
    document.addEventListener('pointerup', this.stopResize, { passive: false });
    window.addEventListener('resize', this.onWindowResize, { passive: true });
  }

  /**
   * Removes all global event listeners to prevent memory leaks
   * @private
   */
  private removeEventListeners(): void {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.stopResize);
    window.removeEventListener('resize', this.onWindowResize);
  }

  /**
   * Sets the initial width of the target element based on saved or default ratio
   * @private
   */
  private setInitialWidth(): void {
    if (!this.targetElement) {
      return;
    }

    const savedWidthRatio = this.uiSettingsService.getResizableWidth(this.moduleName);

    const widthRatio = savedWidthRatio || this.defaultWidthRatio;
    const initialWidth = window.innerWidth * widthRatio;

    this.renderer.setStyle(this.targetElement, 'width', `${initialWidth}px`);
    this.renderer.setStyle(this.targetElement, 'flex-shrink', '0');
    this.newWidth = initialWidth;
  }

  /**
   * Initiates the resize operation on mousedown
   * @private
   * @param event - Mouse event from mousedown
   */
  private startResize(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.targetElement) return;

    this.isResizing = true;
    this.dragStarted = false; // Reset drag detection
    this.startX = event.clientX;
    this.startWidth = this.targetElement.offsetWidth;

    // Don't change cursor immediately - wait for actual drag movement
    document.body.style.userSelect = 'none';
  }

  /**
   * Handles mouse movement during resize operation with drag threshold detection
   * @private
   * @param event - Mouse move event
   */
  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing || !this.targetElement) return;

    event.preventDefault();
    event.stopPropagation();

    const delta = event.clientX - this.startX;

    // Check if we've moved enough to consider this a drag (not just a click)
    if (!this.dragStarted && Math.abs(delta) > this.dragThreshold) {
      this.dragStarted = true;

      // Now we know it's a drag, so set the cursor and pointer events
      document.body.style.cursor = 'col-resize';
      document.body.style.pointerEvents = 'none';

      // Enable pointer capture for better tracking
      if (this.resizerElement && this.resizerElement.setPointerCapture) {
        try {
          this.resizerElement.setPointerCapture((event as any).pointerId);
        } catch (e) {

        }
      }
    }

    // Only update width if we've started dragging
    if (this.dragStarted) {
      let newWidth = this.startWidth + delta;
      const maxWidth = window.innerWidth * this.maxWidthRatio;
      this.newWidth = Math.max(this.minWidth, Math.min(newWidth, maxWidth));

      // Use requestAnimationFrame for smoother updates during fast dragging
      requestAnimationFrame(() => {
        if (this.targetElement && this.isResizing) {
          this.renderer.setStyle(this.targetElement, 'width', `${this.newWidth}px`);
          this.renderer.setStyle(this.targetElement, 'flex-shrink', '0');
        }
      });
    }
  };

  /**
   * Stops the resize operation and saves width if dragging occurred
   * @private
   */
  private stopResize = (): void => {
    if (this.isResizing) {
      this.isResizing = false;

      if (this.dragStarted) {
        const widthRatio = this.newWidth / window.innerWidth;
        this.uiSettingsService.setResizableWidth(this.moduleName, widthRatio);

        this.justFinishedDrag = true;
        setTimeout(() => {
          this.justFinishedDrag = false;
        }, 100);
      }

      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';

      if (this.resizerElement && this.resizerElement.releasePointerCapture) {
        try {
        } catch (e) {
        }
      }

      this.dragStarted = false;
    }
  };

  private resizeTimeout: any;
  private lastWindowWidth: number = 0;

  /**
   * Handles window resize events with debouncing and ratio validation
   * @private
   */
  private onWindowResize = (): void => {
    if (!this.targetElement) return;

    // Only process if window width actually changed significantly
    const currentWindowWidth = window.innerWidth;
    if (Math.abs(currentWindowWidth - this.lastWindowWidth) < 10) {
      return; // Ignore small changes
    }

    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.lastWindowWidth = currentWindowWidth;

      const savedRatio = this.uiSettingsService.getResizableWidth(this.moduleName);
      const currentRatio = savedRatio || this.defaultWidthRatio;

      const newMinRatio = this.minWidth / currentWindowWidth;

      let targetWidth: number;

      if (currentRatio < newMinRatio) {
        targetWidth = currentWindowWidth * newMinRatio;
      } else if (currentRatio > this.maxWidthRatio) {
        targetWidth = currentWindowWidth * this.maxWidthRatio;
      } else {
        targetWidth = currentWindowWidth * currentRatio;
      }

      this.renderer.setStyle(this.targetElement, 'width', `${targetWidth}px`);
      this.newWidth = targetWidth;

      if (currentRatio < newMinRatio || currentRatio > this.maxWidthRatio) {
        const finalRatio = targetWidth / currentWindowWidth;
        this.uiSettingsService.setResizableWidth(this.moduleName, finalRatio);
      }
    }, 150);
  };

  /**
   * Toggles between current and default width on click
   * @private
   * @param event - Mouse click event
   */
  private toggleResize(event: MouseEvent): void {
    setTimeout(() => {
      if (this.isResizing || !this.targetElement || this.justFinishedDrag) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const currentRatio = this.newWidth > 0 ? (this.newWidth / window.innerWidth) : this.defaultWidthRatio;
      const targetWidth = window.innerWidth * currentRatio;

      this.renderer.setStyle(this.targetElement, 'width', `${targetWidth}px`);
      this.renderer.setStyle(this.targetElement, 'flex-shrink', '0');

      this.uiSettingsService.setResizableWidth(this.moduleName, currentRatio);
      this.newWidth = targetWidth;
    }, 50);
  }

}
