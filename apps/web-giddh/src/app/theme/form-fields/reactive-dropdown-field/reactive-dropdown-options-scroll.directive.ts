import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
    autoComplete: MatAutocomplete;
    scrollEvent: Event;
}

@Directive({
    selector: 'mat-autocomplete[optionsScroll]',
    exportAs: 'mat-autocomplete[optionsScroll]'
})

export class OptionsScrollDirective implements OnDestroy {
    /** Will emit only if dynamic search is enabled */
    @Input() public enableDynamicSearch: boolean = false;
    /** Will emit scroll event if reached end of list */
    @Output('optionsScroll') scroll: EventEmitter<IAutoCompleteScrollEvent> = new EventEmitter<IAutoCompleteScrollEvent>();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public autoComplete: MatAutocomplete) {
        this.autoComplete.opened
            .pipe(
                tap(() => {
                    setTimeout(() => {
                        this.removeScrollEventListener();
                        if (this.enableDynamicSearch) {
                            this.autoComplete?.panel?.nativeElement?.addEventListener(
                                'scroll',
                                this.onScroll.bind(this)
                            );
                        }
                    }, 0);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();

        this.autoComplete.closed
            .pipe(
                tap(() => this.removeScrollEventListener()),
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
        if (this.enableDynamicSearch) {
            const scrollTop = (event.target as HTMLElement).scrollTop;
            const scrollHeight = (event.target as HTMLElement).scrollHeight;
            const elementHeight = (event.target as HTMLElement).clientHeight;
            const atBottom = scrollHeight - (scrollTop + elementHeight) <= 150;
            if (atBottom) {
                this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
            }
        }
    }
}