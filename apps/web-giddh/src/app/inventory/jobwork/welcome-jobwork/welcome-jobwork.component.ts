import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
    templateUrl: './welcome-jobwork.component.html'
})
export class JobworkWelcomeComponent implements OnDestroy {
    /** Subject to destroy subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
