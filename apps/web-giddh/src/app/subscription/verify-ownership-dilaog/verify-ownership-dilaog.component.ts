import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferComponent } from '../transfer/transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { SubscriptionComponentStore } from '../utility/subscription.store';

@Component({
    selector: 'verify-ownership-dilaog',
    templateUrl: './verify-ownership-dilaog.component.html',
    styleUrls: ['./verify-ownership-dilaog.component.scss'],
    providers: [SubscriptionComponentStore]
})
export class VerifyOwnershipDialogComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Veirfy Ownership In progress API success state as observable*/
    public verifyOwnershipInProgress$ = this.componentStore.select(state => state.verifyOwnershipInProgress);
    /** HoldsVeirfy Ownership  API success state as observable*/
    public verifyOwnershipSuccess$ = this.componentStore.select(state => state.verifyOwnershipSuccess);

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private componentStore: SubscriptionComponentStore
    ) { }

    /**
     * Initializes the component by subscribing to route parameters and verifying ownership.
     * Navigates to the subscription page upon successful ownership verification.
     *
     * @memberof VerifyOwnershipDialogComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params) {
                this.verifyOwnership(params.requestId);
            }
        });

        this.verifyOwnershipSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });
    }

    /**
     * Verifies ownership of a resource using the provided ID.
     *
     * @param id - The ID used to verify ownership.
     * @memberof VerifyOwnershipDialogComponent
     */
    public verifyOwnership(id: any): void {
        this.componentStore.verifyOwnership(id);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Completes the subject indicating component destruction.
     *
     * @memberof VerifyOwnershipDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
