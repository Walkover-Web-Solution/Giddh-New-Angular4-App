import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
    selector: 'gocardless-callback',
    styleUrls: ['./gocardless-callback.component.scss'],
    templateUrl: './gocardless-callback.component.html'
})

export class GocardlessCallBackComponent implements OnInit, OnDestroy {
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for open window */
    public openedWindow: Window | null = null;

    constructor(private route: ActivatedRoute
    ) {
    }

    /**
     * Initializes the component
     *
     * @memberof GocardlessCallBackComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params?.id) {
                // this.closeWindow();
            }
        });
    }

    /**
     * This will close the current window
     *
     * @memberof BuyPlanComponent
     */
    public closeWindow(): void {
        this.openedWindow.close();
        this.openedWindow = null;
    }


    /**
    * Releases memory
    *
    * @memberof GocardlessCallBackComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
