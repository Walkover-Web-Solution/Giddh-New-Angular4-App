import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
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
    @Input() thresholdPercent = 0.8;
    @Output('optionsScroll') scroll = new EventEmitter<IAutoCompleteScrollEvent>();
    private destroyed$: Subject<void> = new Subject();

    constructor(public autoComplete: MatAutocomplete) {
        this.autoComplete.opened
            .pipe(
                tap(() => {
                    setTimeout(() => {
                        this.removeScrollEventListener();
                        this.autoComplete.panel.nativeElement.addEventListener(
                            'scroll',
                            this.onScroll.bind(this)
                        );
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

    private removeScrollEventListener(): void {
        if (this.autoComplete?.panel) {
            this.autoComplete.panel.nativeElement.removeEventListener(
                'scroll',
                this.onScroll
            );
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        this.removeScrollEventListener();
    }

    public onScroll(event: Event): void {
        if (this.thresholdPercent === undefined) {
            this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
        } else {
            const scrollTop = (event.target as HTMLElement).scrollTop;
            const scrollHeight = (event.target as HTMLElement).scrollHeight;
            const elementHeight = (event.target as HTMLElement).clientHeight;
            const atBottom = scrollHeight - (scrollTop + elementHeight) <= 50;
            if (atBottom) {
                this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
            }
        }
    }
}