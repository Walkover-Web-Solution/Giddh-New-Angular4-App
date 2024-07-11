import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { TaxAuthorityComponentStore } from './utility/tax-authority.store';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateComponent } from './create/create.component';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';

@Component({
    selector: 'tax-authority',
    templateUrl: './tax-authority.component.html',
    styleUrls: ['./tax-authority.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class TaxAuthorityComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table columns */
    public displayedColumns: string[] = ['name', 'uniqueName', 'description', 'action'];
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Tax Authority List Observable */
    public taxAuthorityList$: Observable<any> = this.componentStore.taxAuthorityList$;

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnInit(): void {
        this.getSalesTaxReport();

        // Subscribe Delete Tax Authority Success
        this.componentStore.deleteTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getSalesTaxReport();
            }
        });
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof TaxAuthorityComponent
    */
    public getSalesTaxReport(): void {
        this.componentStore.getTaxAuthorityList();
    }

    /**
     * Open Create Tax Authority dialog
     *
     * @memberof TaxAuthorityComponent
     */
    public openCreateUpdateTaxAuthorityDialog(isUpdateMode: boolean = false, taxAuthorityInfo?: any): void {
        const dialogConfig: MatDialogConfig = {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                top: '0',
                right: '0'
            },
            data: isUpdateMode ? taxAuthorityInfo : null
        };
        const createUpdateTaxAuthorityDialogRef = this.dialog.open(CreateComponent, dialogConfig);

        createUpdateTaxAuthorityDialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.getSalesTaxReport();
            }
        });
    }

    /**
     * Open Delete Tax Authority confirmation dialog
     *
     * @param {string} uniqueName
     * @memberof TaxAuthorityComponent
     */
    public deleteTaxAuthority(taxAuthorityName: string, uniqueName: string): void {
        this.openConfirmationDialog(taxAuthorityName, uniqueName);
    }

    /**
     * Open confirmation dialog to Tax Authority
     *
     * @private
     * @param {*} request
     * @memberof TaxAuthorityComponent
     */
    private openConfirmationDialog(taxAuthorityName: string, uniqueName: string): void {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.confirm_delete_tax_authority?.replace("[NAME]", taxAuthorityName),
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStore.deleteTaxAuthority(uniqueName);
            }
        });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.asideGstSidebarMenuState === 'out';
    }

}
