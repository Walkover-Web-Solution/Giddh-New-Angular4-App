import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../store";

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[validateSubscription]',
    standalone: false
})

/**
 * ValidateSubscriptionDirective class
 * Implements ValidateSubscriptionDirective functionality
 */
export class ValidateSubscriptionDirective implements OnInit, OnDestroy {
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
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
            /**
             * Handles if functionality
             */
            if (response && response?.subscription?.status === "expired") {
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    const inputElements = this.elementRef.nativeElement?.querySelectorAll("input,button");
                    /**
                     * Handles if functionality
                     */
                    if (inputElements?.length > 0) {
                        inputElements?.forEach(element => {
                            element?.setAttribute("disabled", "disabled");
                        });
                    }

                    const linkSwitchElements = this.elementRef.nativeElement?.querySelectorAll("a:not(.nav-link),.bootstrap-switch-wrapper");
                    /**
                     * Handles if functionality
                     */
                    if (linkSwitchElements?.length > 0) {
                        linkSwitchElements?.forEach(element => {
                            element?.classList?.add("click-disabled");
                        });
                    }
                }, 50);
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
