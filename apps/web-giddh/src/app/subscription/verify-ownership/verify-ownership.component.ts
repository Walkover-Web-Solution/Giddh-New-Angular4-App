import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferComponent } from '../transfer/transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewSubscriptionComponentStore } from './utility/view-subscription.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { SubscriptionComponentStore } from '../utility/subscription.store';

@Component({
    selector: 'verify-ownership',
    templateUrl: './verify-ownership.component.html',
    styleUrls: ['./verify-ownership.component.scss'],
    providers: [SubscriptionComponentStore]
})
export class VerifyOwnershipComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Plan list API success state as observable*/
    public verifyOwnershipInProgress$ = this.componentStore.select(state => state.verifyOwnershipInProgress);
    /** Holds Store Plan list API success state as observable*/
    public verifyOwnershipSuccess$ = this.componentStore.select(state => state.verifyOwnershipSuccess);
    /** Hold the data of activity logs */
    public viewSubscriptionData: any;
    /** Hold the data of activity logs */
    public subscriptionId: any;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private readonly componentStore: SubscriptionComponentStore
    ) { }

    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            console.log(params);
            if (params) {
                this.subscriptionId = params.requestId;
                this.verifyOwnerShip(params.requestId);
            }
        });

        this.verifyOwnershipSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response) {
                this.router.navigate(['/pages/subscription']);
            }
        });
    }

    public verifyOwnerShip(id: any): void {
        this.componentStore.verifyOwnership(id);
    }


}
