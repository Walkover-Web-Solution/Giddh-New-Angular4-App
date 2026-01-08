import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';
import { EmailForwardingResponse } from '../../models/email-forwarding.model';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { GeneralService } from '../../../services/general.service';
import { EmailForwardingComponentStore } from '../../store/email-forwarding.store';
import { Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster.service';

@Component({
selector: 'email-forwarding-list',
    templateUrl: './list.component.html',
    styles: [``],
    providers: [EmailForwardingComponentStore],
    standalone: false
})
export class ListComponent implements OnInit, OnDestroy {
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Reference to material paginator */
    @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
    /** Reference to material sort */
    @ViewChild(MatSort, { static: true }) public sort: MatSort;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Data source for the material table */
    public dataSource: EmailForwardingResponse[] = [];
    /** Columns to display in the table */
    public displayedColumns: string[] = [
        'forwardedMail',
        'bankAccountName',
        'originalEmail',
        'actions'
    ];
    /** Loading state for async operations */
    public isLoading: boolean = false;
    /** Page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Current page index */
    public pageIndex: number = 0;
    /** Search filter value */
    public searchFilter: string = '';
    /** Company unique name */  
    private companyUniqueName: string = '';
    /** Branch unique name */  
    private branchUniqueName: string = '';

    constructor(
        private router: Router,
        private bankStatementStore: EmailForwardingComponentStore,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private toaster: ToasterService
    ) {
     }

    /**
     * Component initialization
     * 
     * @memberof ListComponent
     */
    public ngOnInit(): void {
        this.companyUniqueName = this.generalService.companyUniqueName;
        this.branchUniqueName = this.generalService.currentBranchUniqueName;
        this.loadEmailForwardingData();
        this.setupSubscriptions();
        this.bankStatementStore.deleteEmailForwardingIsSuccess$.pipe(filter(Boolean),
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.loadEmailForwardingData();
        });

        this.bankStatementStore.generatedEmail$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((forwardedMail: string | null) => {
            if (forwardedMail) {
                this.router.navigate(['pages/email-forwarding/create'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName, forwardedMail } });
            }
        });
    }

    /**
     * Sets up subscriptions for store observables
     * 
     * @private
     * @memberof ListComponent
     */
    private setupSubscriptions(): void {
        this.bankStatementStore.emailForwardingList$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((emailForwardingList) => {
            if (emailForwardingList) {
                if (emailForwardingList.length === 0) {
                    this.router.navigate(['pages/email-forwarding/onboarding'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
                }
                this.dataSource = emailForwardingList;
                this.isLoading = false;
            }
        });

        this.bankStatementStore.isLoading$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }

    /**
     * Loads email forwarding data
     * 
     * @private
     * @memberof ListComponent
     */
    private loadEmailForwardingData(): void {
        this.isLoading = true;
        this.bankStatementStore.getAllEmailForwarding();
    }

    /**
     * Navigates to create new email forwarding configuration
     * 
     * @memberof ListComponent
     */
    public createNew(): void {
        if (this.isLoading) {
            return;
        }
        this.bankStatementStore.generateEmail();
    }

    /**
     * Deletes email forwarding configuration
     * 
     * @param {string} uniqueName - Email forwarding unique name
     * @memberof ListComponent
     */
    public deleteStatement(uniqueName: string): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            disableClose: true,
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.commonLocaleData?.app_permanently_delete_message,
                    this.commonLocaleData
                )
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.bankStatementStore.deleteEmailForwarding(uniqueName);
            }
        });
    }

    /**
     * Navigates to edit email forwarding configuration
     * 
     * @param {EmailForwardingResponse} element - Email forwarding data
     * @memberof ListComponent
     */
    public editStatement(element: EmailForwardingResponse): void {
        const queryParams = { companyUniqueName: this.companyUniqueName, forwardedMail: element.forwardedMail};
        if (element && element.confirmationData?.length > 0) {
            queryParams['step'] = 2;
        } else {
            queryParams['step'] = 3;
        }
        queryParams['branchUniqueName'] = this.branchUniqueName;
        this.router.navigate([`/pages/email-forwarding/edit/${element.uniqueName}`], { queryParams });
    }

    /**
     * Handles forwarded mail copy action and shows snackbar notification
     *
     * @public
     * @param {MouseEvent} event - Click event from the copy button
     * @returns {void}
     * @memberof ListComponent
     */
    public onCopyForwardedMail(event: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }
        this.toaster.showSnackBar("info", this.commonLocaleData?.app_copied);
    }

    /**
     * Component cleanup
     * 
     * @memberof ListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}