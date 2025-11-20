import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';
import { BankStatementComponentStore } from '../../store/bank-statement.store';
import { EmailForwardingResponse } from '../../models/email-forwarding.model';
import { ToasterService } from '../../../services/toaster.service';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss'],
    providers: [BankStatementComponentStore]
})
export class DataListComponent implements OnInit, OnDestroy {
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
        'uniqueName',
        'originalEmail',
        'status',
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

    constructor(
        private router: Router,
        private bankStatementStore: BankStatementComponentStore,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private generalService: GeneralService
    ) {
     }

    /**
     * Component initialization
     * 
     * @memberof DataListComponent
     */
    public ngOnInit(): void {
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
                this.router.navigate(['pages', 'bank-statement', 'create'], { queryParams: { forwardedMail } });
            }
        });
    }

    /**
     * Sets up subscriptions for store observables
     * 
     * @private
     * @memberof DataListComponent
     */
    private setupSubscriptions(): void {
        this.bankStatementStore.emailForwardingList$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((emailForwardingList) => {
            if (emailForwardingList) {
                if (emailForwardingList?.length  === 0) {
                    this.router.navigate(['pages/bank-statement/onboarding']);
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
     * @memberof DataListComponent
     */
    private loadEmailForwardingData(): void {
        this.isLoading = true;
        this.bankStatementStore.getAllEmailForwarding();
    }

    /**
     * Navigates to create new email forwarding configuration
     * 
     * @memberof DataListComponent
     */
    public createNew(): void {
        if (this.isLoading) {
            return;
        }
        this.bankStatementStore.generateEmail();
    }

    /**
     * Copies email to clipboard
     * 
     * @param {string} email - Email to copy
     * @memberof DataListComponent
     */
    public copyEmail(email: string): void {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                this.toaster.showSnackBar('success', 'Email copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy email:', err);
                this.toaster.showSnackBar('error', 'Failed to copy email');
            });
        }
    }

    /**
     * Deletes email forwarding configuration
     * 
     * @param {string} uniqueName - Email forwarding unique name
     * @memberof DataListComponent
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
     * @memberof DataListComponent
     */
    public editStatement(element: EmailForwardingResponse): void {
        const queryParams = { forwardedMail: element.forwardedMail};
        if (element && element.confirmationData?.length > 0) {
            queryParams['step'] = 2;
        } else {
            queryParams['step'] = 3;
        }
        this.router.navigate([`/pages/bank-statement/edit/${element.uniqueName}`], { queryParams });
    }

    
    /**
     * Component cleanup
     * 
     * @memberof DataListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}