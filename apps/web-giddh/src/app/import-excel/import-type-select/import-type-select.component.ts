import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ImportStatementComponent } from '../../ledger/components/import-statement/import-statement.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'import-type-select',
    styleUrls: ['./import-type-select.component.scss'],
    templateUrl: './import-type-select.component.html'
})

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

    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        public dialog: MatDialog,
    ) {
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
    }

    public ngOnInit() {
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
            }
        });
    }

    /**
     * This will show the bank statement upload modal
     *
     * @memberof LedgerComponent
     */
    public showUploadBankStatementModal(): void {
        let dialogRef = this.dialog.open(ImportStatementComponent, {
            width: '630px',
            data: {
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            },
            role: 'alertdialog',
            ariaLabel: 'import'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                console.log(response);
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
