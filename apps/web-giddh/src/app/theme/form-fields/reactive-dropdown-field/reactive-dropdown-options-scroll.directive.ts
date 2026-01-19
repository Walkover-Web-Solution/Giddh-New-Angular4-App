import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

/**
 * IAutoCompleteScrollEvent interface definition
 * Defines the structure and contract for IAutoCompleteScrollEvent objects
 */
export interface IAutoCompleteScrollEvent {
    autoComplete: MatAutocomplete;
    scrollEvent: Event;
}

/**
 * Handles Directive functionality
 */
@Directive({
    selector: 'mat-autocomplete[optionsScroll]',
    exportAs: 'mat-autocomplete[optionsScroll]',
    standalone: false
})

/**
 * OptionsScrollDirective directive
 * Implements OptionsScrollDirective functionality
 */
export class OptionsScrollDirective implements OnDestroy {
    /** Will emit only if dynamic search is enabled */
    @Input() public enableDynamicSearch: boolean = false;
    /** Will emit scroll event if reached end of list */
    @Output('optionsScroll') scroll: EventEmitter<IAutoCompleteScrollEvent> = new EventEmitter<IAutoCompleteScrollEvent>();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(public autoComplete: MatAutocomplete) {
        this.autoComplete.opened
            .pipe(
                /**
                 * Handles tap functionality
                 */
                tap(() => {
                    /**
                     * Sets timeout value
                     */
                    setTimeout(() => {
                        this.removeScrollEventListener();
                        /**
                         * Handles if functionality
                         */
                        if (this.enableDynamicSearch && this.autoComplete?.panel?.nativeElement) {
                            /**
                             * Handles fromEvent functionality
                             */
                            fromEvent(this.autoComplete.panel.nativeElement, 'scroll')
                                .pipe(
                                    /**
                                     * Handles debounceTime functionality
                                     */
                                    debounceTime(200),
                                    /**
                                     * Handles takeUntil functionality
                                     */
                                    takeUntil(this.destroyed$)
                                )
                                .subscribe((event) => {
                                    this.onScroll(event as HTMLElementEventMap['scroll']);
                                });
                        }
                    }, 0);
                }),
                /**
                 * Handles takeUntil functionality
                 */
                takeUntil(this.destroyed$)
            )
            .subscribe();

        this.autoComplete.closed
            .pipe(
                /**
                 * Handles tap functionality
                 */
                tap(() => this.removeScrollEventListener()),
                /**
                 * Handles takeUntil functionality
                 */
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    /**
     * Removes scroll event listener
     *
     * @private
     * @memberof OptionsScrollDirective
     */
    private removeScrollEventListener(): void {
        /**
         * Handles if functionality
         */
        if (this.autoComplete?.panel) {
            this.autoComplete.panel.nativeElement.removeEventListener(
                'scroll',
                this.onScroll
            );
        }
    }

    /**
     * Lifecycle hook for destroy method
     *
     * @memberof OptionsScrollDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.removeScrollEventListener();
    }

    /**
     * Handles on scroll event
     *
     * @param {Event} event
     * @memberof OptionsScrollDirective
     */
    public onScroll(event: Event): void {
        /**
         * Handles if functionality
         */
        if (this.enableDynamicSearch) {
            const scrollTop = (event.target as HTMLElement).scrollTop;
            const scrollHeight = (event.target as HTMLElement).scrollHeight;
            const elementHeight = (event.target as HTMLElement).clientHeight;
            const atBottom = scrollHeight - (scrollTop + elementHeight) <= 150;
            /**
             * Handles if functionality
             */
            if (atBottom) {
                this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
            }
        }
    }
}
