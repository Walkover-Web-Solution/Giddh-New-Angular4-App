
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";

/**
 * OnboardingComponentState interface definition
 * Defines the structure and contract for OnboardingComponentState objects
 */
export interface OnboardingComponentState  {
}

export const DEFAULT_ONBOARDING_STATE: OnboardingComponentState = {
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * OnboardingComponentStore store
 * Manages onboardingcomponent state using NgRx ComponentStore
 */
export class OnboardingComponentStore extends ComponentStore<OnboardingComponentState> implements OnDestroy  {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_ONBOARDING_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);

 }
