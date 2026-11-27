import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { ASIDE_PANE_CONFIG } from 'apps/web-giddh/src/app/app.constant';
import {
    JobWorkActionRequest,
    JobWorkActionType,
    JobWorkBatch,
    JobWorkExpenseLine,
    JobWorkScrapLine,
    ScrapRetainedBy
} from 'apps/web-giddh/src/app/models/api-models/JobWork';
import {
    BatchSelectDialogResult,
    VoucherSelectedBatch
} from 'apps/web-giddh/src/app/models/interfaces/batch-report.interface';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { JobWorkService } from 'apps/web-giddh/src/app/services/job-work.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { AppState } from 'apps/web-giddh/src/app/store';
import { BatchSelectDialogComponent } from 'apps/web-giddh/src/app/vouchers/batch-select-dialog/batch-select-dialog.component';
import * as dayjs from 'dayjs';
import { take } from 'rxjs/operators';

export type JobWorkActionDialogMode = Extract<JobWorkActionType, 'RETURN' | 'MARK_SCRAP' | 'ADJUST'>;

export interface JobWorkActionDialogData {
    action: JobWorkActionDialogMode;
    uniqueName: string;
    row?: Record<string, unknown>;
    localeData: Record<string, string>;
    commonLocaleData: Record<string, string>;
}

interface ReturnLine {
    lineRole: 'OUTPUT' | 'INPUT';
    stockUniqueName: string;
    variantUniqueName: string;
    stockName: string;
    variantName: string;
    unitName: string;
    unitCode: string;
    inventoryType: string;
    quantity: number;
    maxQuantity: number;
    rate: number;
    amount: number;
    batches: JobWorkBatch[];
    selected: boolean;
}

interface ScrapLine {
    stockUniqueName: string;
    variantUniqueName: string;
    stockName: string;
    variantName: string;
    unitCode: string;
    inventoryType: string;
    quantity: number;
    rate: number;
    amount: number;
    batches: JobWorkBatch[];
    retainedBy: ScrapRetainedBy;
    selected: boolean;
}

interface ExpenseLine {
    fromAccountUniqueName: string;
    toAccountUniqueName: string;
    fromAccountName: string;
    toAccountName: string;
    tax: string;
    amount: number;
    taxAmount: number;
}

@Component({
    selector: 'job-work-action-dialog',
    templateUrl: './job-work-action-dialog.component.html',
    styleUrls: ['./job-work-action-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class JobWorkActionDialogComponent implements OnInit {
    /** Dialog ref */
    private readonly dialogRef = inject(MatDialogRef<JobWorkActionDialogComponent>);
    /** Mat dialog */
    private readonly dialog = inject(MatDialog);
    /** App store */
    private readonly store = inject(Store<AppState>);
    /** Destroy ref */
    private readonly destroyRef = inject(DestroyRef);
    /** Job work API */
    private readonly jobWorkService = inject(JobWorkService);
    /** Toaster */
    private readonly toasterService = inject(ToasterService);
    /** Dialog input data */
    public readonly data = inject<JobWorkActionDialogData>(MAT_DIALOG_DATA);
    /** Feature locale */
    public readonly localeData = signal<Record<string, string>>({});
    /** Common locale */
    public readonly commonLocaleData = signal<Record<string, string>>({});
    /** Order load flag */
    public readonly isLoading = signal(true);
    /** Save in progress */
    public readonly isSubmitting = signal(false);
    /** Warehouse unique name */
    public readonly warehouseUniqueName = signal('');
    /** Warehouse display name */
    public readonly warehouseName = signal('');
    /** Batch tracking on */
    public readonly batchTrackingEnabled = signal(false);
    /** Return table lines */
    public readonly returnLines = signal<ReturnLine[]>([]);
    /** Scrap table lines */
    public readonly scrapLines = signal<ScrapLine[]>([]);
    /** Adjust expense lines */
    public readonly expenseLines = signal<ExpenseLine[]>([]);
    /** Capitalize job work cost */
    public readonly increaseAssetValue = signal(true);
    /** Claim ITC toggle */
    public readonly claimItc = signal(true);
    /** Dialog title from locale */
    public readonly title = computed(() => {
        const locale = this.localeData();
        if (this.data.action === 'RETURN') {
            return locale['record_return'] || '';
        }
        if (this.data.action === 'MARK_SCRAP') {
            return locale['mark_scrap'] || '';
        }
        return locale['make_adjustment'] || '';
    });
    /** All return rows selected */
    public readonly allReturnSelected = computed(() => {
        const lines = this.returnLines();
        return lines.length > 0 && lines.every(line => line.selected);
    });
    /** Some return rows selected */
    public readonly someReturnSelected = computed(() => {
        const lines = this.returnLines();
        return lines.some(line => line.selected) && !lines.every(line => line.selected);
    });
    /** All scrap rows selected */
    public readonly allScrapSelected = computed(() => {
        const lines = this.scrapLines();
        return lines.length > 0 && lines.every(line => line.selected);
    });
    /** Some scrap rows selected */
    public readonly someScrapSelected = computed(() => {
        const lines = this.scrapLines();
        return lines.some(line => line.selected) && !lines.every(line => line.selected);
    });

    /**
     * Seeds locale and loads the job work order.
     *
     * @memberof JobWorkActionDialogComponent
     */
    public ngOnInit(): void {
        this.localeData.set(this.data.localeData || {});
        this.commonLocaleData.set(this.data.commonLocaleData || {});
        this.store.pipe(
            select(state => state.inventory.inventorySettings),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(settings => {
            if (settings) {
                this.batchTrackingEnabled.set(!!settings?.batchManagement?.enabled);
            }
        });
        this.loadOrder();
    }

    /**
     * Closes the dialog without saving.
     *
     * @memberof JobWorkActionDialogComponent
     */
    public close(): void {
        this.dialogRef.close(false);
    }

    /**
     * Posts RETURN / MARK_SCRAP / ADJUST and closes on success.
     *
     * @memberof JobWorkActionDialogComponent
     */
    public submit(): void {
        if (this.isSubmitting()) {
            return;
        }
        const payload = this.buildPayload();
        if (!payload) {
            return;
        }
        this.isSubmitting.set(true);
        this.jobWorkService.action(payload).pipe(take(1)).subscribe({
            next: (response) => {
                this.isSubmitting.set(false);
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.successMessage());
                    this.dialogRef.close(true);
                    return;
                }
                this.toasterService.errorToast(response?.message);
            },
            error: () => {
                this.isSubmitting.set(false);
            }
        });
    }

    /**
     * Selects or clears all return lines.
     *
     * @param {boolean} checked
     * @memberof JobWorkActionDialogComponent
     */
    public toggleSelectAllReturn(checked: boolean): void {
        this.returnLines.update(lines => lines.map(line => ({ ...line, selected: checked })));
    }

    /**
     * Updates one return line selection.
     *
     * @param {ReturnLine} row
     * @param {boolean} selected
     * @memberof JobWorkActionDialogComponent
     */
    public setReturnSelected(row: ReturnLine, selected: boolean): void {
        this.returnLines.update(lines =>
            lines.map(line => this.isSameReturnLine(line, row) ? { ...line, selected } : line)
        );
    }

    /**
     * Selects or clears all scrap lines.
     *
     * @param {boolean} checked
     * @memberof JobWorkActionDialogComponent
     */
    public toggleSelectAllScrap(checked: boolean): void {
        this.scrapLines.update(lines => lines.map(line => ({ ...line, selected: checked })));
    }

    /**
     * Updates one scrap line selection.
     *
     * @param {ScrapLine} row
     * @param {boolean} selected
     * @memberof JobWorkActionDialogComponent
     */
    public setScrapSelected(row: ScrapLine, selected: boolean): void {
        this.scrapLines.update(lines =>
            lines.map(line => this.isSameScrapLine(line, row) ? { ...line, selected } : line)
        );
    }

    /**
     * Casts job-work batches for batch-chip-list.
     *
     * @param {JobWorkBatch[]} [batches]
     * @returns {VoucherSelectedBatch[]}
     * @memberof JobWorkActionDialogComponent
     */
    public getJobWorkBatches(batches?: JobWorkBatch[]): VoucherSelectedBatch[] {
        return (Array.isArray(batches) ? batches : []) as VoucherSelectedBatch[];
    }

    /**
     * Opens batch select limited to the return line's document batches.
     *
     * @param {ReturnLine} row
     * @param {Event} [event]
     * @memberof JobWorkActionDialogComponent
     */
    public openReturnBatchDialog(row: ReturnLine, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        const preBatches = this.toFixedBatches(this.getJobWorkBatches(row.batches));
        if (!this.batchTrackingEnabled() || !row.selected || !row.stockUniqueName || !preBatches.length) {
            return;
        }
        this.openBatchSelectDialog({
            stockName: row.stockName || row.stockUniqueName,
            stockUniqueName: row.stockUniqueName,
            variantUniqueName: row.variantUniqueName,
            variantName: row.variantName,
            unitCode: row.unitCode || row.unitName,
            inventoryType: row.inventoryType,
            lineQuantity: Number(row.quantity) || Number(row.maxQuantity) || 0,
            selectedBatches: preBatches,
            fixedBatches: preBatches,
            isInbound: true,
            onResult: (result) => {
                this.returnLines.update(lines =>
                    lines.map(line => {
                        if (!this.isSameReturnLine(line, row)) {
                            return line;
                        }
                        const quantity = result.overrideLineQuantity
                            ? result.allocatedQuantity
                            : line.quantity;
                        return {
                            ...line,
                            batches: result.batches ?? [],
                            quantity,
                            amount: (Number(quantity) || 0) * (Number(line.rate) || 0)
                        };
                    })
                );
            }
        });
    }

    /**
     * Opens batch select limited to the scrap line's document batches.
     *
     * @param {ScrapLine} row
     * @param {Event} [event]
     * @memberof JobWorkActionDialogComponent
     */
    public openScrapBatchDialog(row: ScrapLine, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        const preBatches = this.toFixedBatches(this.getJobWorkBatches(row.batches));
        if (!this.batchTrackingEnabled() || !row.selected || !row.stockUniqueName || !preBatches.length) {
            return;
        }
        this.openBatchSelectDialog({
            stockName: row.stockName || row.stockUniqueName,
            stockUniqueName: row.stockUniqueName,
            variantUniqueName: row.variantUniqueName,
            variantName: row.variantName,
            unitCode: row.unitCode,
            inventoryType: row.inventoryType,
            lineQuantity: Number(row.quantity) || 0,
            selectedBatches: preBatches,
            fixedBatches: preBatches,
            isInbound: true,
            onResult: (result) => {
                this.scrapLines.update(lines =>
                    lines.map(line => {
                        if (!this.isSameScrapLine(line, row)) {
                            return line;
                        }
                        const quantity = result.overrideLineQuantity
                            ? result.allocatedQuantity
                            : line.quantity;
                        return {
                            ...line,
                            batches: result.batches ?? [],
                            quantity,
                            amount: (Number(quantity) || 0) * (Number(line.rate) || 0)
                        };
                    })
                );
            }
        });
    }

    /**
     * Opens BatchSelectDialog with optional fixedBatches.
     *
     * @private
     * @param {*} options
     * @memberof JobWorkActionDialogComponent
     */
    private openBatchSelectDialog(options: {
        stockName: string;
        stockUniqueName: string;
        variantUniqueName: string;
        variantName: string;
        unitCode: string;
        inventoryType: string;
        lineQuantity: number;
        selectedBatches: VoucherSelectedBatch[];
        fixedBatches: VoucherSelectedBatch[];
        isInbound: boolean;
        onResult: (result: BatchSelectDialogResult) => void;
    }): void {
        this.dialog.open(BatchSelectDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                stockName: options.stockName,
                stockUniqueName: options.stockUniqueName,
                variantUniqueName: options.variantUniqueName,
                variantName: options.variantName,
                hasVariants: !!options.variantUniqueName,
                inventoryType: options.inventoryType || 'PRODUCT',
                warehouseName: this.warehouseName(),
                warehouseUniqueName: this.warehouseUniqueName(),
                unitCode: options.unitCode,
                lineQuantity: options.lineQuantity,
                selectedBatches: cloneDeep(options.selectedBatches),
                fixedBatches: cloneDeep(options.fixedBatches),
                localeData: this.localeData(),
                commonLocaleData: this.commonLocaleData(),
                isInbound: options.isInbound
            }
        }).afterClosed().pipe(take(1)).subscribe((result?: BatchSelectDialogResult) => {
            if (!result) {
                return;
            }
            options.onResult(result);
        });
    }

    /**
     * Maps line batches for fixed batch-select (document batches only).
     *
     * @private
     * @param {VoucherSelectedBatch[]} batches
     * @returns {VoucherSelectedBatch[]}
     * @memberof JobWorkActionDialogComponent
     */
    private toFixedBatches(batches: VoucherSelectedBatch[]): VoucherSelectedBatch[] {
        return (batches || [])
            .filter(batch => !!batch?.uniqueName || !!batch?.name)
            .map(batch => {
                const quantity = Number(batch.quantity) || 0;
                return {
                    ...batch,
                    uniqueName: batch.uniqueName || '',
                    name: batch.name || batch.batchNumber || '',
                    batchNumber: batch.batchNumber || batch.name || '',
                    quantity,
                    availableQuantity: Number(batch.availableQuantity) || quantity
                };
            });
    }

    /**
     * Loads job work order GET and maps lines for the action.
     *
     * @private
     * @memberof JobWorkActionDialogComponent
     */
    private loadOrder(): void {
        this.isLoading.set(true);
        this.jobWorkService.get(this.data.uniqueName).pipe(take(1)).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response?.status !== 'success' || !response.body) {
                    this.toasterService.errorToast(response?.message);
                    this.dialogRef.close(false);
                    return;
                }
                const body = response.body as Record<string, unknown>;
                this.resolveWarehouse(body);
                if (this.data.action === 'RETURN') {
                    this.mapReturnLines(body);
                } else if (this.data.action === 'MARK_SCRAP') {
                    this.mapScrapLines(body);
                } else {
                    this.mapExpenseLines(body);
                }
            },
            error: () => {
                this.isLoading.set(false);
                this.dialogRef.close(false);
            }
        });
    }

    /**
     * Maps OUTPUT/INPUT document items into return lines.
     *
     * @private
     * @param {Record<string, unknown>} body
     * @memberof JobWorkActionDialogComponent
     */
    private mapReturnLines(body: Record<string, unknown>): void {
        const documentItems = (body['documentItems'] as Array<Record<string, unknown>>) || [];
        const lines = documentItems
            .filter(item => item['lineRole'] === 'OUTPUT' || item['lineRole'] === 'INPUT')
            .map(item => this.mapDocumentItemToReturnLine(item))
            .filter(item => !!item.stockUniqueName);
        lines.sort((a, b) => {
            if (a.lineRole === b.lineRole) {
                return 0;
            }
            return a.lineRole === 'OUTPUT' ? -1 : 1;
        });
        this.returnLines.set(lines);
        if (!lines.length) {
            this.toasterService.errorToast(this.localeData()['return_items_missing']);
            this.dialogRef.close(false);
        }
    }

    /**
     * Maps scrap document / detail rows into scrap lines.
     *
     * @private
     * @param {Record<string, unknown>} body
     * @memberof JobWorkActionDialogComponent
     */
    private mapScrapLines(body: Record<string, unknown>): void {
        const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
        const defaultRetainedBy = (details['scrapRetainedBy'] as ScrapRetainedBy)
            || (body['scrapRetainedBy'] as ScrapRetainedBy)
            || 'COMPANY';
        const detailScraps = (details['scraps'] as Array<Record<string, unknown>>) || [];
        const documentItems = (body['documentItems'] as Array<Record<string, unknown>>) || [];
        const scrapItems = documentItems.filter(item => item['lineRole'] === 'SCRAP');

        const lines = scrapItems.length
            ? scrapItems
                .map(item => this.mapDocumentItemToScrapLine(item, detailScraps, defaultRetainedBy))
                .filter(item => !!item.stockUniqueName)
            : detailScraps
                .map(row => this.mapDetailScrapToScrapLine(row, defaultRetainedBy))
                .filter(item => !!item.stockUniqueName);

        this.scrapLines.set(lines);
        if (!lines.length) {
            this.toasterService.errorToast(this.localeData()['scrap_items_missing']);
            this.dialogRef.close(false);
        }
    }

    /**
     * Maps expense rows and ITC flags for adjust.
     *
     * @private
     * @param {Record<string, unknown>} body
     * @memberof JobWorkActionDialogComponent
     */
    private mapExpenseLines(body: Record<string, unknown>): void {
        const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
        const increaseAssetValue = (details['increaseAssetValue'] ?? body['increaseAssetValue']) !== false;
        const claimItcValue = details['claimItc'] ?? body['claimItc'];
        this.increaseAssetValue.set(increaseAssetValue);
        this.claimItc.set(
            claimItcValue === undefined || claimItcValue === null
                ? increaseAssetValue
                : !!claimItcValue
        );

        const detailExpenses = (details['expenses'] as Array<Record<string, unknown>>) || [];
        const rootExpenses = (body['expenses'] as Array<Record<string, unknown>>) || [];
        const source = detailExpenses.length ? detailExpenses : rootExpenses;
        const lines = source
            .map(row => this.mapExpenseRow(row))
            .filter(row => !!row.fromAccountUniqueName && !!row.toAccountUniqueName);

        this.expenseLines.set(lines);
        if (!lines.length) {
            this.toasterService.errorToast(this.localeData()['expense_items_missing']);
            this.dialogRef.close(false);
        }
    }

    /**
     * Builds the action API payload from selected lines.
     *
     * @private
     * @returns {JobWorkActionRequest | null}
     * @memberof JobWorkActionDialogComponent
     */
    private buildPayload(): JobWorkActionRequest | null {
        if (this.data.action === 'RETURN') {
            const items = this.returnLines()
                .filter(line => line.selected && !!line.stockUniqueName && Number(line.quantity) > 0)
                .map(line => ({
                    lineRole: line.lineRole,
                    stockUniqueName: line.stockUniqueName,
                    variantUniqueName: line.variantUniqueName,
                    quantity: Number(line.quantity) || 0,
                    batches: line.batches
                }));
            if (!items.length) {
                this.toasterService.errorToast(this.localeData()['return_items_missing']);
                return null;
            }
            return {
                action: 'RETURN',
                uniqueName: this.data.uniqueName,
                date: dayjs().format(GIDDH_DATE_FORMAT),
                warehouseUniqueName: this.warehouseUniqueName(),
                isFinal: false,
                items
            };
        }

        if (this.data.action === 'MARK_SCRAP') {
            const scraps: JobWorkScrapLine[] = this.scrapLines()
                .filter(line => line.selected && !!line.stockUniqueName && Number(line.quantity) > 0)
                .map(line => ({
                    stockUniqueName: line.stockUniqueName,
                    variantUniqueName: line.variantUniqueName,
                    quantity: Number(line.quantity) || 0,
                    batches: line.batches,
                    retainedBy: line.retainedBy
                }));
            if (!scraps.length) {
                this.toasterService.errorToast(this.localeData()['scrap_items_missing']);
                return null;
            }
            return {
                action: 'MARK_SCRAP',
                uniqueName: this.data.uniqueName,
                date: dayjs().format(GIDDH_DATE_FORMAT),
                warehouseUniqueName: this.warehouseUniqueName(),
                scraps
            };
        }

        const expenses: JobWorkExpenseLine[] = this.expenseLines()
            .filter(line => !!line.fromAccountUniqueName && !!line.toAccountUniqueName && Number(line.amount) > 0)
            .map(line => ({
                fromAccountUniqueName: line.fromAccountUniqueName,
                toAccountUniqueName: line.toAccountUniqueName,
                tax: line.tax || '',
                amount: Number(line.amount) || 0,
                taxAmount: Number(line.taxAmount) || 0
            }));
        if (!expenses.length) {
            this.toasterService.errorToast(this.localeData()['expense_items_missing']);
            return null;
        }
        return {
            action: 'ADJUST',
            uniqueName: this.data.uniqueName,
            increaseAssetValue: this.increaseAssetValue(),
            claimItc: this.claimItc(),
            expenses
        };
    }

    /**
     * Success toast copy for the current action.
     *
     * @private
     * @returns {string}
     * @memberof JobWorkActionDialogComponent
     */
    private successMessage(): string {
        const locale = this.localeData();
        if (this.data.action === 'RETURN') {
            return locale['return_recorded'] || '';
        }
        if (this.data.action === 'MARK_SCRAP') {
            return locale['scrap_marked'] || '';
        }
        return locale['adjustment_saved'] || '';
    }

    /**
     * Resolves warehouse name/uniqueName from GET body or list row.
     *
     * @private
     * @param {Record<string, unknown>} body
     * @memberof JobWorkActionDialogComponent
     */
    private resolveWarehouse(body: Record<string, unknown>): void {
        const warehouse = body['warehouse'] as { uniqueName?: string; name?: string } | undefined;
        const row = this.data.row || {};
        const rowWarehouse = row['warehouse'] as { uniqueName?: string; name?: string } | undefined;
        this.warehouseUniqueName.set(
            warehouse?.uniqueName
            || (body['warehouseUniqueName'] as string)
            || rowWarehouse?.uniqueName
            || (row['warehouseUniqueName'] as string)
            || ''
        );
        this.warehouseName.set(
            warehouse?.name
            || (body['warehouseName'] as string)
            || rowWarehouse?.name
            || (row['warehouseName'] as string)
            || ''
        );
    }

    /**
     * Maps one document item to a return line.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @returns {ReturnLine}
     * @memberof JobWorkActionDialogComponent
     */
    private mapDocumentItemToReturnLine(item: Record<string, unknown>): ReturnLine {
        const stock = item['stock'] as {
            uniqueName?: string;
            name?: string;
            inventoryType?: string;
        } | undefined;
        const variant = item['variant'] as { uniqueName?: string; name?: string } | undefined;
        const stockUnit = item['stockUnit'] as {
            name?: string;
            uniqueName?: string;
            code?: string;
        } | undefined;
        const lineRole = item['lineRole'] as 'OUTPUT' | 'INPUT';
        const orderedQty = Number(item['quantity']) || 0;
        const remainingAtJobworker = Number(item['remainingAtJobworker']) || 0;
        const finishedReceived = Number(item['finishedReceivedQuantity']) || 0;
        const unusedReturned = Number(item['unusedReturnedQuantity']) || 0;
        const remainingToReceive = orderedQty - finishedReceived;
        let returnableQty = 0;
        if (lineRole === 'INPUT') {
            if (unusedReturned > 0) {
                returnableQty = unusedReturned;
            } else if (remainingAtJobworker > 0) {
                returnableQty = remainingAtJobworker;
            } else if (orderedQty > 0) {
                returnableQty = orderedQty;
            }
        } else if (remainingAtJobworker > 0) {
            returnableQty = remainingAtJobworker;
        } else if (remainingToReceive > 0) {
            returnableQty = remainingToReceive;
        } else if (finishedReceived <= 0 && orderedQty > 0) {
            returnableQty = orderedQty;
        }
        const rate = Number(item['rate']) || 0;
        return {
            lineRole,
            stockUniqueName: stock?.uniqueName || (item['stockUniqueName'] as string) || '',
            variantUniqueName: variant?.uniqueName || (item['variantUniqueName'] as string) || '',
            stockName: stock?.name || (item['stockName'] as string) || '',
            variantName: variant?.name || (item['variantName'] as string) || '',
            unitName: stockUnit?.name || stockUnit?.uniqueName || '',
            unitCode: stockUnit?.code || stockUnit?.name || '',
            inventoryType: stock?.inventoryType || (item['inventoryType'] as string) || 'PRODUCT',
            quantity: returnableQty,
            maxQuantity: returnableQty,
            rate,
            amount: Number(item['amount']) || (rate * returnableQty) || 0,
            batches: this.mapItemBatches(item),
            selected: true
        };
    }

    /**
     * Maps a SCRAP document item to a scrap line.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @param {Array<Record<string, unknown>>} detailScraps
     * @param {ScrapRetainedBy} defaultRetainedBy
     * @returns {ScrapLine}
     * @memberof JobWorkActionDialogComponent
     */
    private mapDocumentItemToScrapLine(
        item: Record<string, unknown>,
        detailScraps: Array<Record<string, unknown>>,
        defaultRetainedBy: ScrapRetainedBy
    ): ScrapLine {
        const stock = item['stock'] as {
            uniqueName?: string;
            name?: string;
            inventoryType?: string;
        } | undefined;
        const variant = item['variant'] as { uniqueName?: string; name?: string } | undefined;
        const stockUnit = item['stockUnit'] as { code?: string; name?: string } | undefined;
        const stockUniqueName = stock?.uniqueName || (item['stockUniqueName'] as string) || '';
        const variantUniqueName = variant?.uniqueName || (item['variantUniqueName'] as string) || '';
        const detailScrap = detailScraps.find(row => {
            const detailStock = (row['stockUniqueName'] as string) || '';
            const detailVariant = (row['variantUniqueName'] as string) || '';
            if (detailStock !== stockUniqueName) {
                return false;
            }
            if (detailVariant && variantUniqueName) {
                return detailVariant === variantUniqueName;
            }
            return !detailVariant && !variantUniqueName;
        });

        const quantity = Number(item['quantity']) || Number(detailScrap?.['quantity']) || 0;
        const rate = Number(item['rate']) || Number(detailScrap?.['rate']) || 0;
        return {
            stockUniqueName,
            variantUniqueName,
            stockName: stock?.name || (detailScrap?.['stockName'] as string) || '',
            variantName: variant?.name || (detailScrap?.['variantName'] as string) || '',
            unitCode: stockUnit?.code || stockUnit?.name || '',
            inventoryType: stock?.inventoryType || (item['inventoryType'] as string) || 'PRODUCT',
            quantity,
            rate,
            amount: Number(item['amount']) || Number(detailScrap?.['amount']) || (rate * quantity) || 0,
            batches: this.mapItemBatches(item, detailScrap),
            retainedBy: (item['retainedBy'] as ScrapRetainedBy)
                || (detailScrap?.['retainedBy'] as ScrapRetainedBy)
                || defaultRetainedBy,
            selected: true
        };
    }

    /**
     * Maps a jobWorkDetails.scraps row to a scrap line.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @param {ScrapRetainedBy} defaultRetainedBy
     * @returns {ScrapLine}
     * @memberof JobWorkActionDialogComponent
     */
    private mapDetailScrapToScrapLine(
        row: Record<string, unknown>,
        defaultRetainedBy: ScrapRetainedBy
    ): ScrapLine {
        const quantity = Number(row['quantity']) || 0;
        const rate = Number(row['rate']) || 0;
        return {
            stockUniqueName: (row['stockUniqueName'] as string) || '',
            variantUniqueName: (row['variantUniqueName'] as string) || '',
            stockName: (row['stockName'] as string) || '',
            variantName: (row['variantName'] as string) || '',
            unitCode: (row['stockUnitCode'] as string) || '',
            inventoryType: (row['inventoryType'] as string) || 'PRODUCT',
            quantity,
            rate,
            amount: Number(row['amount']) || (rate * quantity) || 0,
            batches: this.mapItemBatches(row),
            retainedBy: (row['retainedBy'] as ScrapRetainedBy) || defaultRetainedBy,
            selected: true
        };
    }

    /**
     * Maps one expense row for adjust.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @returns {ExpenseLine}
     * @memberof JobWorkActionDialogComponent
     */
    private mapExpenseRow(row: Record<string, unknown>): ExpenseLine {
        const fromAccount = row['fromAccount'] as { uniqueName?: string; name?: string } | undefined;
        const toAccount = row['toAccount'] as { uniqueName?: string; name?: string } | undefined;
        return {
            fromAccountUniqueName: fromAccount?.uniqueName || (row['fromAccountUniqueName'] as string) || '',
            toAccountUniqueName: toAccount?.uniqueName || (row['toAccountUniqueName'] as string) || '',
            fromAccountName: fromAccount?.name || (row['fromAccountName'] as string) || '',
            toAccountName: toAccount?.name || (row['toAccountName'] as string) || '',
            tax: (row['tax'] as string) || '',
            amount: Number(row['amount']) || 0,
            taxAmount: Number(row['taxAmount']) || 0
        };
    }

    /**
     * True when two return lines share role/stock/variant.
     *
     * @private
     * @param {ReturnLine} a
     * @param {ReturnLine} b
     * @returns {boolean}
     * @memberof JobWorkActionDialogComponent
     */
    private isSameReturnLine(a: ReturnLine, b: ReturnLine): boolean {
        return a.lineRole === b.lineRole
            && a.stockUniqueName === b.stockUniqueName
            && a.variantUniqueName === b.variantUniqueName;
    }

    /**
     * True when two scrap lines share stock/variant.
     *
     * @private
     * @param {ScrapLine} a
     * @param {ScrapLine} b
     * @returns {boolean}
     * @memberof JobWorkActionDialogComponent
     */
    private isSameScrapLine(a: ScrapLine, b: ScrapLine): boolean {
        return a.stockUniqueName === b.stockUniqueName
            && a.variantUniqueName === b.variantUniqueName;
    }

    /**
     * Maps batches[] or singular batch from GET rows.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @param {Record<string, unknown>} [fallback]
     * @returns {JobWorkBatch[]}
     * @memberof JobWorkActionDialogComponent
     */
    private mapItemBatches(
        item: Record<string, unknown>,
        fallback?: Record<string, unknown>
    ): JobWorkBatch[] {
        const source = item['batches'] ?? fallback?.['batches'];
        if (Array.isArray(source) && source.length) {
            return source.map((batch: Record<string, unknown>) => ({
                uniqueName: (batch['uniqueName'] as string) || '',
                name: (batch['name'] as string) || '',
                quantity: Number(batch['quantity']) || 0
            }));
        }
        const singular = (item['batch'] || fallback?.['batch']) as {
            uniqueName?: string;
            name?: string;
            quantity?: number;
        } | undefined;
        if (singular?.uniqueName || singular?.name) {
            return [{
                uniqueName: singular.uniqueName || '',
                name: singular.name || '',
                quantity: Number(singular.quantity) || 0
            }];
        }
        return [];
    }
}
