import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { CommonActions } from '../actions/common.actions';

export interface ComponentCanDeactivate {
    canDeactivate: () => Promise<boolean> | boolean;
}

@Injectable()
export class PageLeaveConfirmationGuard implements CanDeactivate<ComponentCanDeactivate> {
    /** Maintains if we can by pass all unsaved changes */
    private bypassAllUnsavedChanges: boolean = false;

    constructor(
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private store: Store<AppState>,
        private commonAction: CommonActions
    ) {
        this.store.pipe(select(state => state.common.bypassAllUnsavedChanges)).subscribe(response => {
            this.bypassAllUnsavedChanges = response;
        });
    }

    public canDeactivate(component: any): Promise<boolean> | boolean {
        if (!this.bypassAllUnsavedChanges && component?.showPageLeaveConfirmation) {
            return new Promise<boolean>((resolve, reject) => {
                let dialogRef = this.pageLeaveUtilityService.openDialog();

                dialogRef.afterClosed().subscribe((action) => {
                    if (action) {
                        resolve(true);
                    } else {
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
