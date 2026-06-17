import { Component, Inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { take } from 'rxjs';
import { signal } from '@angular/core';
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
export class WalletTransactionListComponent {
    /** Subscription ID from dialog data */
    public subscriptionId = signal<string>('');
    /** Transaction list data source */
    public dataSource = new MatTableDataSource<any>([]);
    /** Display columns for table */
    public displayedColumns: string[] = ['createdAt', 'amount'];
    /** Transaction list loading state */
    public isLoading = signal<boolean>(false);
    /** Current page for pagination */
    public currentPage = signal<number>(0);
    /** Page size for pagination */
    public pageSize = signal<number>(PAGINATION_LIMIT);
    /** Holds page Size Options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Total transaction count */
    public totalTransactions = signal<number>(0);
    /** Locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Paginator reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private walletService: WalletService,
        private toasterService: ToasterService,
        private dialogRef: MatDialogRef<WalletTransactionListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.subscriptionId.set(data?.subscriptionId || '');
        
        // Load wallet logs on init
        this.getWalletLogs();
    }

    /**
     * Fetches wallet transaction logs with pagination
     */
    private getWalletLogs(): void {
        this.isLoading.set(true);
        
        const params = {
            page: this.currentPage() + 1,
            count: this.pageSize()
        };

        this.walletService.getWalletLogs(this.subscriptionId(), params)
            .pipe(take(1))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && Array.isArray(response?.body?.results)) {
                        this.dataSource.data = response.body.results;
                        this.totalTransactions.set(response?.body?.totalItems || 0);
                    } else {
                        this.dataSource.data = [];
                        this.totalTransactions.set(0);
                    }
                    this.isLoading.set(false);
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Handles pagination change
     * @param event - Pagination event
     */
    public onPageChange(event: PageEvent): void {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.getWalletLogs();
    }

    /**
     * Closes the dialog
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }
}
