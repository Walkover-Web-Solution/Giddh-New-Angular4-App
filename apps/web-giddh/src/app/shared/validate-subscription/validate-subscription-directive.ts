import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../store";

@Directive({
    selector: '[validateSubscription]'
})

export class ValidateSubscriptionDirective implements OnInit, OnDestroy {
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private elementRef: ElementRef
    ) {

    }

    /**
     * Initializes the directive and checks subscription
     * If subscription has expired, disables all input fields and links
     *
     * @memberof ValidateSubscriptionDirective
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response?.subscription?.status === "expired") {
                const inputElements = this.elementRef.nativeElement?.querySelectorAll("input,button");
                if (inputElements?.length > 0) {
                    inputElements?.forEach(element => {
                        element?.setAttribute("disabled", "disabled");
                    });
                }

                const linkSwitchElements = this.elementRef.nativeElement?.querySelectorAll("a:not(.nav-link),.bootstrap-switch-wrapper");
                if (linkSwitchElements?.length > 0) {
                    linkSwitchElements?.forEach(element => {
                        element?.classList?.add("click-disabled");
                    });
                }
            }
        });
    }

    /**
     * Unsubscribes from the listeners
     *
     * @memberof ValidateSubscriptionDirective
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}