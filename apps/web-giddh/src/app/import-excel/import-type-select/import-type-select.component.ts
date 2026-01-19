import { select, Store } from '@ngrx/store';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ImportStatementComponent } from '../../ledger/components/import-statement/import-statement.component';
import { MatDialog } from '@angular/material/dialog';
import { VoucherType } from '../../ledger/components/import-statement/import-statement.const';
import { ServiceConfig } from '../../services/service.config';
import { Configuration } from '../../app.constant';
import { environment } from '../../../environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'import-type-select',
    templateUrl: './import-type-select.component.html',
    styleUrls: ['./import-type-select.component.scss'],
    standalone: false
})

/**
 * ImportTypeSelectComponent component
 * Handles importtypeselect functionality and user interactions
 */
export class ImportTypeSelectComponent implements OnInit, OnDestroy {
    /** True if current organization is branch */
    public isBranch: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds a reference to the `VoucherType` enum */
    public voucherType: typeof VoucherType = VoucherType; // Commented out due to missing import
    /** Holds images folder path */
    public imgPath: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        public dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig
    ) {
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
