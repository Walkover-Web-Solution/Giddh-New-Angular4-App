import { select, Store } from '@ngrx/store';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subscription } from 'rxjs';
// import { ImportStatementComponent } from '../../ledger/components/import-statement/import-statement.component';
import { MatDialog } from '@angular/material/dialog';
// import { VoucherType } from '../../ledger/components/import-statement/import-statement.const';
import { ServiceConfig } from '../../services/service.config';
import { Configuration } from '../../app.constant';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'import-type-select',
    templateUrl: './import-type-select.component.html',
    styleUrls: ['./import-type-select.component.scss'],
    standalone: false
})

export class ImportTypeSelectComponent implements OnInit, OnDestroy {
    /** True if current organization is branch */
    public isBranch: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds a reference to the `VoucherType` enum */
    // public voucherType: typeof VoucherType = VoucherType; // Commented out due to missing import
    public voucherType = {
        AccountWise: 'AccountWise',
        VoucherWise: 'VoucherWise'
    };
    /** Holds images folder path */
    public imgPath: string = "";

    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        public dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig
    ) {
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
    }

    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
            }
        });
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof ImportTypeSelectComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
