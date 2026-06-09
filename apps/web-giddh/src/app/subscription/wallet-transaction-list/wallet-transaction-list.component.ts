import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { WalletService } from '../services/wallet.service';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../app.constant';

@Component({
    selector: 'app-wallet-transaction-list',
    templateUrl: './wallet-transaction-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ]
})
export class WalletTransactionListComponent implements OnInit, OnDestroy {
    /** Subscription ID from dialog data */
    public subscriptionId: string = '';
    /** Transaction list data source */
    public dataSource = new MatTableDataSource<any>([]);
    /** Display columns for table */
    public displayedColumns: string[] = ['createdAt', 'amount', 'remainingBalance', 'operationType'];
    /** Transaction list loading state */
    public isLoading: boolean = false;
    /** Current page for pagination */
    public currentPage: number = 0;
    /** Page size for pagination */
    public pageSize: number = PAGINATION_LIMIT;
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Total transaction count */
    public totalTransactions: number = 0;
    /** Locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Paginator reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    /** Subject for unsubscribing from observables */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private walletService: WalletService,
        private toasterService: ToasterService,
        private cdr: ChangeDetectorRef,
        private dialogRef: MatDialogRef<WalletTransactionListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.subscriptionId = data?.subscriptionId || '';
    }

    /**
     * Angular lifecycle hook - component initialization
     */
    public ngOnInit(): void {
        this.getWalletLogs();
    }

    /**
     * Fetches wallet transaction logs with pagination
     */
    private getWalletLogs(): void {
        this.isLoading = true;
        this.cdr.markForCheck();
        
        const params = {
            page: this.currentPage + 1,
            count: this.pageSize
        };

        this.walletService.getWalletLogs(this.subscriptionId, params)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && Array.isArray(response?.body?.results)) {
                        this.dataSource.data = response.body.results;
                        this.totalTransactions = response?.body?.totalItems;
                    } else {
                        this.dataSource.data = [];
                    }
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Handles pagination change
     * @param event - Pagination event
     */
    public onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getWalletLogs();
    }

    /**
     * Closes the dialog
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Angular lifecycle hook - component destruction
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
