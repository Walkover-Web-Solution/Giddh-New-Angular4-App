import { ReplaySubject, takeUntil } from 'rxjs';
import { CallBackPageComponentStore } from './utility/call-back-page.store';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'call-back-page',
    templateUrl: './call-back-page.component.html',
    styleUrls: ['./call-back-page.component.scss'],
    providers: [CallBackPageComponentStore]
})
export class CallBackPageComponent implements OnInit {
    /** Holds Store Call Back API success state as observable*/
    public callBackSuccess$ = this.componentStore.select(state => state.callBackSuccess);
    /** Holds Store Call Back API in progress state as observable*/
    public callBackInProgress$ = this.componentStore.select(state => state.callBackInProgress);
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        private componentStore: CallBackPageComponentStore
    ) {
        this.componentStore.windowCallBack('subscription');
    }

    /**
     * Initializes the component
     *
     * @memberof CallBackPageComponent
     */
    public ngOnInit(): void {
        this.callBackSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response === 'PAYPAL') {
                if (window.opener) {
                    window.close();
                }
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof CallBackPageComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
