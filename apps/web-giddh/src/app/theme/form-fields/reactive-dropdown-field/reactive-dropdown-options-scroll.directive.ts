import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
    autoComplete: MatAutocomplete;
    scrollEvent: Event;
}

@Directive({
    selector: 'mat-autocomplete[optionsScroll]',
    exportAs: 'mat-autocomplete[optionsScroll]'
})

export class OptionsScrollDirective {
    @Input() thresholdPercent = 0.8;
    @Output('optionsScroll') scroll = new EventEmitter<IAutoCompleteScrollEvent>();
    _onDestroy: Subject<void> = new Subject();
    constructor(public autoComplete: MatAutocomplete) {
        console.log('fire');
        this.autoComplete.opened
            .pipe(
                tap(() => {
                    // Note: When autocomplete raises opened, panel is not yet created (by Overlay)
                    // Note: The panel will be available on next tick
                    // Note: The panel wil NOT open if there are no options to display
                    setTimeout(() => {
                        // Note: remove listner just for safety, in case the close event is skipped.
                        this.removeScrollEventListener();
                        this.autoComplete.panel.nativeElement.addEventListener(
                            'scroll',
                            this.onScroll.bind(this)
                        );
                    }, 0);
                }),
                takeUntil(this._onDestroy)
            )
            .subscribe();

        this.autoComplete.closed
            .pipe(
                tap(() => this.removeScrollEventListener()),
                takeUntil(this._onDestroy)
            )
            .subscribe();
    }

    private removeScrollEventListener() {
        console.log("remove");
        if (this.autoComplete?.panel) {
            this.autoComplete.panel.nativeElement.removeEventListener(
                'scroll',
                this.onScroll
            );
        }
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();

        this.removeScrollEventListener();
    }

    onScroll(event: Event) {
        console.log("on scrolllllll");
        if (this.thresholdPercent === undefined) {
            console.log('undefined');
            this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
        } else {
            const scrollTop = (event.target as HTMLElement).scrollTop;
            const scrollHeight = (event.target as HTMLElement).scrollHeight;
            const elementHeight = (event.target as HTMLElement).clientHeight;
            const atBottom = scrollHeight === scrollTop + elementHeight;
            if (atBottom) {
                this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
            }
        }
    }
}