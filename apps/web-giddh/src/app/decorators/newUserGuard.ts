import { take } from 'rxjs/operators';
import { VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { AppState } from '../store';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * NewUserAuthGuard class
 * Implements NewUserAuthGuard functionality
 */
export class NewUserAuthGuard  {
    private user: VerifyEmailResponseModel;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(public _router: Router, private store: Store<AppState>) {
    }

    /**
     * Handles canActivate functionality
     */
    public canActivate() {
        this.store.pipe(take(1)).subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s.session.user) {
                this.user = s.session.user;
            }
        });
        /**
         * Handles if functionality
         */
        if (this.user && this.user.session && this.user.session.id) {
            return true;
        } else {
            return false;
        }
    }
}
