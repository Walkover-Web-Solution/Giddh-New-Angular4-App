import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';

/**
 * Interface for bank statement data
 */
export interface BankStatementData {
    id: string;
    bankName: string;
    accountNumber: string;
    statementDate: Date;
    fromDate: Date;
    toDate: Date;
    totalTransactions: number;
    reconciledTransactions: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdDate: Date;
}

/**
 * Data list component for bank statements
 * Displays a table of all bank statements with filtering and pagination
 * 
 * @export
 * @class DataListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'app-data-list',
    templateUrl: './data-list.component.html',
    styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, OnDestroy {
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Reference to material paginator */
    @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;

    /** Reference to material sort */
    @ViewChild(MatSort, { static: true }) public sort: MatSort;

    /** Data source for the material table */
    public dataSource: MatTableDataSource<BankStatementData> = new MatTableDataSource();

    /** Columns to display in the table */
    public displayedColumns: string[] = [
        'bankName',
        'accountNumber',
        'statementDate',
        'dateRange',
        'transactions',
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
     * @memberof DataListComponent
     */
    constructor(
        private router: Router
    ) { }

    /**
     * Component initialization
     * 
     * @memberof DataListComponent
     */
    public ngOnInit(): void {
        this.initializeTable();
        this.loadBankStatements();
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
        this.dataSource.filterPredicate = (data: BankStatementData, filter: string) => {
            const searchStr = filter.toLowerCase();
            return data.bankName.toLowerCase().includes(searchStr) ||
                   data.accountNumber.toLowerCase().includes(searchStr) ||
                   data.status.toLowerCase().includes(searchStr);
        };
    }

    /**
     * Loads bank statements data
     * 
     * @private
     * @memberof DataListComponent
     */
    private loadBankStatements(): void {
        this.isLoading = true;
        
        // Mock data - replace with actual service call
        const mockData: BankStatementData[] = [
            {
                id: '1',
                bankName: 'HDFC Bank',
                accountNumber: '****1234',
                statementDate: new Date('2024-11-15'),
                fromDate: new Date('2024-11-01'),
                toDate: new Date('2024-11-15'),
                totalTransactions: 45,
                reconciledTransactions: 42,
                status: 'completed',
                createdDate: new Date('2024-11-16')
            },
            {
                id: '2',
                bankName: 'ICICI Bank',
                accountNumber: '****5678',
                statementDate: new Date('2024-11-10'),
                fromDate: new Date('2024-10-01'),
                toDate: new Date('2024-10-31'),
                totalTransactions: 38,
                reconciledTransactions: 35,
                status: 'processing',
                createdDate: new Date('2024-11-11')
            },
            {
                id: '3',
                bankName: 'SBI',
                accountNumber: '****9012',
                statementDate: new Date('2024-11-05'),
                fromDate: new Date('2024-09-01'),
                toDate: new Date('2024-09-30'),
                totalTransactions: 52,
                reconciledTransactions: 50,
                status: 'completed',
                createdDate: new Date('2024-11-06')
            }
        ];

        // Simulate API delay
        setTimeout(() => {
            this.dataSource.data = mockData;
            this.isLoading = false;
        }, 1000);
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
     * Navigates to create new bank statement
     * 
     * @memberof DataListComponent
     */
    public createNew(): void {
        this.router.navigate(['/bank-statement/create']);
    }

    /**
     * Navigates to edit bank statement
     * 
     * @param {string} id - Bank statement ID
     * @memberof DataListComponent
     */
    public editStatement(id: string): void {
        this.router.navigate(['/bank-statement/edit', id]);
    }

    /**
     * Views bank statement details
     * 
     * @param {BankStatementData} statement - Bank statement data
     * @memberof DataListComponent
     */
    public viewStatement(statement: BankStatementData): void {
        // Implement view logic
        console.log('Viewing statement:', statement);
    }

    /**
     * Downloads bank statement
     * 
     * @param {BankStatementData} statement - Bank statement data
     * @memberof DataListComponent
     */
    public downloadStatement(statement: BankStatementData): void {
        // Implement download logic
        console.log('Downloading statement:', statement);
    }

    /**
     * Deletes bank statement
     * 
     * @param {BankStatementData} statement - Bank statement data
     * @memberof DataListComponent
     */
    public deleteStatement(statement: BankStatementData): void {
        // Implement delete logic with confirmation
        console.log('Deleting statement:', statement);
    }

    /**
     * Gets status badge class for styling
     * 
     * @param {string} status - Statement status
     * @returns {string} CSS class name
     * @memberof DataListComponent
     */
    public getStatusClass(status: string): string {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'processing':
                return 'status-processing';
            case 'pending':
                return 'status-pending';
            case 'failed':
                return 'status-failed';
            default:
                return 'status-default';
        }
    }
}
