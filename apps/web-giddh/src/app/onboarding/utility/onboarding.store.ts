
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";

export interface OnboardingComponentState  {
}

export const DEFAULT_ONBOARDING_STATE: OnboardingComponentState = {
};

@Injectable()
export class OnboardingComponentStore extends ComponentStore<OnboardingComponentState> implements OnDestroy  {

    constructor(
        private store: Store<AppState>
    ) {
        super(DEFAULT_ONBOARDING_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);

 }
