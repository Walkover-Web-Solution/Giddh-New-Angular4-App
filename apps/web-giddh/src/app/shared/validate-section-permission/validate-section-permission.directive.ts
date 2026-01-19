import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../store";

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[validateSectionPermission]',
    standalone: false
})

/**
 * ValidateSectionPermissionDirective directive
 * Implements ValidateSectionPermissionDirective functionality
 */
export class ValidateSectionPermissionDirective implements OnChanges, OnDestroy {
    /** This defines if user has permission or not */
    @Input() public hasPermission: boolean = true;
    /** Taking error message as input */
    @Input() public errorMessage: string = "";
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private store: Store<AppState>) {

    }

    /**
     * Checks permissions and show/hide element
     *
     * @memberof ValidateSectionPermissionDirective
     */
    public ngOnChanges(): void {
        /**
         * Handles if functionality
         */
        if(!this.hasPermission) {
            this.store.pipe(select(state => state.session.commonLocaleData), takeUntil(this.destroyed$)).subscribe((response) => {
                /**
                 * Handles if functionality
                 */
                if (response) {
                    let commonLocaleData = response;
                    /**
                     * Handles if functionality
                     */
                    if(!this.errorMessage) {
                        this.errorMessage = commonLocaleData?.app_giddh_no_permissions;
                    }

                    /**
                     * Handles if functionality
                     */
                    if(!this.elementRef.nativeElement?.parentElement?.querySelector(".giddh-no-permissions-error-message")) {
                        const errorDiv = this.renderer.createElement('div');
                        const errorText = this.renderer.createText(this.errorMessage);
                        this.renderer.appendChild(errorDiv, errorText);
                        this.renderer.addClass(errorDiv, 'giddh-no-permissions-error-message');
                        this.renderer.addClass(errorDiv, 'ml-3');
                        this.renderer.addClass(errorDiv, 'mt-2');
                        this.renderer.addClass(errorDiv, 'no-data');

                        this.renderer.appendChild(this.elementRef.nativeElement?.parentElement, errorDiv);
                    }
                    this.elementRef.nativeElement?.classList?.add('giddh-no-permissions');
                }
            });
        } else {
            this.elementRef.nativeElement?.classList?.remove('giddh-no-permissions');
            this.elementRef.nativeElement?.parentElement?.querySelector(".giddh-no-permissions-error-message")?.remove();
        }
    }

    /**
     * Unsubscribes from the listeners
     *
     * @memberof ValidateSectionPermissionDirective
     */
     public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
