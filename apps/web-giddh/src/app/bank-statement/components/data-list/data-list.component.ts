import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';
import { BankStatementComponentStore } from '../../store/bank-statement.store';
import { EmailForwardingResponse } from '../../models/email-forwarding.model';
import { ToasterService } from '../../../services/toaster.service';

// Using EmailForwardingResponse interface from models

/**
 * Data list component for email forwarding configurations
 * Displays a table of all email forwarding setups with filtering and pagination
 * 
 * @export
 * @class DataListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
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

    /** Data source for the material table */
    public dataSource: MatTableDataSource<EmailForwardingResponse> = new MatTableDataSource();

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

    /**
     * Creates an instance of DataListComponent
     * 
     * @param {Router} router - Angular router service
     * @param {BankStatementComponentStore} bankStatementStore - Bank statement store
     * @param {ToasterService} toaster - Toaster service
     * @memberof DataListComponent
     */
    constructor(
        private router: Router,
        private bankStatementStore: BankStatementComponentStore,
        private toaster: ToasterService
    ) { }

    /**
     * Component initialization
     * 
     * @memberof DataListComponent
     */
    public ngOnInit(): void {
        this.initializeTable();
        this.loadEmailForwardingData();
        this.setupSubscriptions();
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

    /**
     * Initializes the material table with pagination and sorting
     * 
     * @private
     * @memberof DataListComponent
     */
    private initializeTable(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Custom filter predicate for searching
        this.dataSource.filterPredicate = (data: EmailForwardingResponse, filter: string) => {
            const searchStr = filter.toLowerCase();
            return data.forwardedMail.toLowerCase().includes(searchStr) ||
                   (data.account?.name || '').toLowerCase().includes(searchStr) ||
                   data.uniqueName.toLowerCase().includes(searchStr) ||
                   (data.confirmationData?.[0]?.originalEmail || '').toLowerCase().includes(searchStr);
        };
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
            console.log('Email forwarding list received:', emailForwardingList);
            if (emailForwardingList) {
                this.dataSource.data = emailForwardingList;
                this.isLoading = false;
                console.log('Data source updated with:', this.dataSource.data);
            }
        });

        this.bankStatementStore.isLoading$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((isLoading) => {
            console.log('Loading state changed:', isLoading);
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
        console.log('Loading email forwarding data...');
        this.isLoading = true;
        this.bankStatementStore.getAllEmailForwarding({ page: 1, count: 50 });
    }

    /**
     * Handles pagination events
     * 
     * @param {PageEvent} event - Pagination event
     * @memberof DataListComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        // In real implementation, you would call API with new page parameters
    }

    /**
     * Applies search filter to the table
     * 
     * @param {Event} event - Input event
     * @memberof DataListComponent
     */
    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchFilter = filterValue;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
     * Navigates to create new email forwarding configuration
     * 
     * @memberof DataListComponent
     */
    public createNew(): void {
        this.router.navigate(['pages/bank-statement/onboarding']);
    }

    /**
     * Navigates to edit email forwarding configuration
     * 
     * @param {string} uniqueName - Email forwarding unique name
     * @memberof DataListComponent
     */
    public editStatement(uniqueName: string): void {
        this.router.navigate(['pages/bank-statement/create'], { queryParams: { uniqueName } });
    }

    /**
     * Views email forwarding configuration details
     * 
     * @param {EmailForwardingResponse} statement - Email forwarding data
     * @memberof DataListComponent
     */
    public viewStatement(statement: EmailForwardingResponse): void {
        // Implement view logic
        console.log('Viewing email forwarding:', statement);
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
     * @param {EmailForwardingResponse} statement - Email forwarding data
     * @memberof DataListComponent
     */
    public deleteStatement(statement: EmailForwardingResponse): void {
        if (confirm('Are you sure you want to delete this email forwarding configuration?')) {
            this.bankStatementStore.deleteEmailForwarding(statement.uniqueName);
        }
    }

    /**
     * Gets status badge class for styling
     * 
     * @param {string} status - Email forwarding status
     * @returns {string} CSS class name
     * @memberof DataListComponent
     */
    public getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'status-completed';
            case 'inactive':
                return 'status-pending';
            case 'pending':
                return 'status-processing';
            case 'failed':
                return 'status-failed';
            default:
                return 'status-completed'; // Default to active
        }
    }
}
