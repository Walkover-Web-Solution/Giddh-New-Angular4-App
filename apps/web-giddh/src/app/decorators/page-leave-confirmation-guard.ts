
import { Injectable } from '@angular/core';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { CommonActions } from '../actions/common.actions';
import { reject } from '../lodash-optimized';

/**
 * ComponentCanDeactivate interface definition
 * Defines the structure and contract for ComponentCanDeactivate objects
 */
export interface ComponentCanDeactivate {
    /**
     * Handles canDeactivate functionality
     */
    canDeactivate: () => Promise<boolean> | boolean;
}

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * PageLeaveConfirmationGuard class
 * Implements PageLeaveConfirmationGuard functionality
 */
export class PageLeaveConfirmationGuard  {
    /** Maintains if we can by pass all unsaved changes */
    private bypassAllUnsavedChanges: boolean = false;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private store: Store<AppState>,
        private commonAction: CommonActions
    ) {
        this.store.pipe(select(state => state.common.bypassAllUnsavedChanges)).subscribe(response => {
            this.bypassAllUnsavedChanges = response;
        });
    }

    /**
     * Handles canDeactivate functionality
     */
    public canDeactivate(component: any): Promise<boolean> | boolean {
        /**
         * Handles if functionality
         */
        if (!this.bypassAllUnsavedChanges && component?.showPageLeaveConfirmation) {
            return new Promise<boolean>((resolve, reject) => {
                let dialogRef = this.pageLeaveUtilityService.openDialog();

                dialogRef.afterClosed().subscribe((action) => {
                    /**
                     * Handles if functionality
                     */
                    if (action) {
                        /**
                         * Handles resolve functionality
                         */
                        resolve(true);
                    } else {
                        /**
                         * Handles reject functionality
                         */
                        reject(false);
                    }
                });
            }).catch((e) => {
                return e;
            });
        } else {
            this.store.dispatch(this.commonAction.bypassUnsavedChanges(false));
            return true;
        }
    }
}
