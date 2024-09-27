import { ReplaySubject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'call-back-page',
    templateUrl: './call-back-page.component.html',
    styleUrls: ['./call-back-page.component.scss']
})
export class CallBackPageComponent implements OnDestroy {
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold broadcast event */
    public broadcast: any;
    constructor(private router: Router, private route: ActivatedRoute) {
        this.closePopup();
    }

    /**
   * Close window popup
   *
   * @memberof CallBackPageComponent
   */
    public closePopup(): void {
        if (this.router.url === '/pages/user-details/subscription/call-back') {
            this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams: any) => {
                if (queryParams.success) {
                    this.setBroadcastEvent(true);
                } else {
                    this.setBroadcastEvent(false);
                }
                window.close();
            });
        }
    }

    /**
 * This will be used to set a broadcast event to call the api for capture order.
 *
 * @memberof CallBackPageComponent
 */
    public setBroadcastEvent(type: boolean): void {
        this.broadcast = new BroadcastChannel("call-back-subscription");
        this.broadcast.postMessage({ success: type });
    }

    /**
     * Release the memory
     *
     * @memberof CallBackPageComponent
     */
    public ngOnDestroy(): void {
        this.broadcast?.close();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
