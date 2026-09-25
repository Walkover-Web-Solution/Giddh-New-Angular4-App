import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReplaySubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { ToasterService } from '../../services/toaster.service';
import { VoucherService } from '../../services/voucher.service';
import { AmountFieldComponentModule } from '../../shared/amount-field/amount-field.module';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { KeyboardShortutModule } from '../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { GiddhDatePipe } from '../../shared/pipes/giddh-date.pipe';
import { AttachmentsModule } from '../../theme/attachments/attachments.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';

/** Dialog input for linked invoice history */
export interface LinkedInvoiceDialogData {
    voucherUniqueName: string;
    localeData: Record<string, string>;
    commonLocaleData: Record<string, string>;
}

/** Amount shape from business-document history API */
interface LinkedInvoiceAmount {
    amountForAccount: number;
    amountForCompany: number;
}

/** Source/target entity from history steps */
interface LinkedInvoiceEntity {
    entityType: string;
    uniqueName: string;
    name: string;
    number: string;
    type: string;
    date: string;
    status: string;
    amount?: LinkedInvoiceAmount;
}

/** Single history step from API */
interface LinkedInvoiceStep {
    id: number;
    createdAt: string;
    relationType: string;
    isActive: boolean;
    source?: LinkedInvoiceEntity;
    target?: LinkedInvoiceEntity;
}

/** Mapped row for the linked invoice table */
interface LinkedInvoiceRow {
    id: number;
    date: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    uniqueName: string;
    voucherType: string;
}

/** Payload expected by attachments preview dialog */
interface LinkedInvoiceAttachmentItem {
    voucherNumber: string;
    invoiceNumber: string;
    voucherUniqueName: string;
    uniqueName: string;
    voucherGeneratedType: string;
    salesBifurcation: boolean;
}

@Component({
    selector: 'linked-invoice-dialog',
    templateUrl: './linked-invoice-dialog.component.html',
    styleUrls: ['./linked-invoice-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        A11yModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatTooltipModule,
        AmountFieldComponentModule,
        AttachmentsModule,
        GiddhPageLoaderModule,
        KeyboardShortutModule,
        GiddhDatePipe,
        TranslateDirectiveModule
    ]
})
export class LinkedInvoiceDialogComponent implements OnInit, OnDestroy {
    private readonly destroyed$ = new ReplaySubject<boolean>(1);
    private readonly dialogRef = inject(MatDialogRef<LinkedInvoiceDialogComponent>);
    private readonly dialog = inject(MatDialog);
    private readonly voucherService = inject(VoucherService);
    private readonly toaster = inject(ToasterService);
    private readonly serviceConfig = inject<IServiceConfigArgs>(ServiceConfig, { optional: true });
    readonly dialogData = inject<LinkedInvoiceDialogData>(MAT_DIALOG_DATA);
    private readonly attachmentsTemplate = viewChild<TemplateRef<unknown>>('attachments');

    /** Common locale JSON */
    readonly commonLocaleData = signal<Record<string, string>>(this.dialogData?.commonLocaleData ?? {});
    /** Feature locale JSON */
    readonly localeData = signal<Record<string, string>>(this.dialogData?.localeData ?? {});
    /** Loading state */
    readonly isLoading = signal(true);
    /** All mapped linked invoice rows */
    readonly linkedInvoices = signal<LinkedInvoiceRow[]>([]);
    /** Active search text */
    readonly searchText = signal('');
    /** Whether clear/reset filter is shown */
    readonly showClearFilter = signal(false);
    /** Images folder path */
    readonly imgPath = signal(this.serviceConfig?.IMG_PATH ?? '');
    /** Selected invoice for attachments preview */
    readonly selectedItem = signal<LinkedInvoiceAttachmentItem | null>(null);
    /** Search control */
    readonly searchValue = new FormControl<string>('', { nonNullable: true });
    /** Table columns */
    readonly displayedColumns: string[] = ['date', 'invoiceNumber', 'customerName', 'amount'];

    /** Filtered rows based on search */
    readonly filteredLinkedInvoices = computed(() => {
        const query = this.searchText().trim().toLowerCase();
        const rows = this.linkedInvoices();
        if (!query) {
            return rows;
        }
        return rows.filter((row) => {
            const amountText = String(row.amount ?? '');
            return (
                row.invoiceNumber?.toLowerCase().includes(query) ||
                row.customerName?.toLowerCase().includes(query) ||
                amountText.includes(query)
            );
        });
    });

    /**
     * Initializes dialog and loads linked invoice history
     *
     * @memberof LinkedInvoiceDialogComponent
     */
    public ngOnInit(): void {
        this.loadLinkedInvoices();
        this.searchValue.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((value) => {
                const searchedText = value?.trim() ?? '';
                this.searchText.set(searchedText);
                this.showClearFilter.set(searchedText.length > 0);
            });
    }

    /**
     * Releases subscriptions
     *
     * @memberof LinkedInvoiceDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Closes the dialog
     *
     * @memberof LinkedInvoiceDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Resets search filter
     *
     * @memberof LinkedInvoiceDialogComponent
     */
    public resetFilter(): void {
        this.showClearFilter.set(false);
        this.searchText.set('');
        this.searchValue.setValue('', { emitEvent: false });
    }

    /**
     * Opens attachments preview dialog for the selected linked invoice
     *
     * @param {LinkedInvoiceRow} row
     * @memberof LinkedInvoiceDialogComponent
     */
    public openInvoice(row: LinkedInvoiceRow): void {
        if (!row?.uniqueName) {
            return;
        }

        this.selectedItem.set({
            voucherNumber: row.invoiceNumber,
            invoiceNumber: row.invoiceNumber,
            voucherUniqueName: row.uniqueName,
            uniqueName: row.uniqueName,
            voucherGeneratedType: row.voucherType,
            salesBifurcation: true
        });

        const templateRef = this.attachmentsTemplate();
        if (!templateRef) {
            return;
        }

        this.dialog.open(templateRef, {
            width: '70%',
            height: '790px',
            maxHeight: '90vh',
            role: 'alertdialog',
            ariaLabel: 'linked-invoice-attachments',
            autoFocus: false
        });
    }

    /**
     * Loads linked invoice history from API
     *
     * @private
     * @memberof LinkedInvoiceDialogComponent
     */
    private loadLinkedInvoices(): void {
        const voucherUniqueName = this.dialogData?.voucherUniqueName;
        if (!voucherUniqueName) {
            this.isLoading.set(false);
            return;
        }

        this.isLoading.set(true);
        this.voucherService
            .getBusinessDocumentLinkedInvoiceHistory(voucherUniqueName)
            .pipe(
                takeUntil(this.destroyed$),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: (response) => {
                    if (response?.status === 'success') {
                        this.linkedInvoices.set(this.mapStepsToRows(response?.body?.steps ?? []));
                        return;
                    }
                    this.toaster.showSnackBar('error', response?.message);
                    this.dialogRef.close();
                },
                error: (error) => {
                    this.toaster.showSnackBar('error', error?.message);
                    this.dialogRef.close();
                }
            });
    }

    /**
     * Maps API steps to unique linked invoice rows
     *
     * @private
     * @param {LinkedInvoiceStep[]} steps
     * @return {*}  {LinkedInvoiceRow[]}
     * @memberof LinkedInvoiceDialogComponent
     */
    private mapStepsToRows(steps: LinkedInvoiceStep[]): LinkedInvoiceRow[] {
        const uniqueRows = new Map<string, LinkedInvoiceRow>();

        for (const step of steps) {
            const entity = step.target;
            if (!entity?.number) {
                continue;
            }

            const key = entity.uniqueName || entity.number;
            if (uniqueRows.has(key)) {
                continue;
            }

            uniqueRows.set(key, {
                id: step.id,
                date: this.extractDate(step.createdAt) || entity.date || '',
                invoiceNumber: entity.number,
                customerName: entity.name || '',
                amount: entity.amount?.amountForAccount ?? 0,
                uniqueName: entity.uniqueName || '',
                voucherType: entity.type || ''
            });
        }

        return Array.from(uniqueRows.values());
    }

    /**
     * Extracts DD-MM-YYYY from createdAt datetime string
     *
     * @private
     * @param {string} createdAt
     * @return {*}  {string}
     * @memberof LinkedInvoiceDialogComponent
     */
    private extractDate(createdAt: string): string {
        if (!createdAt) {
            return '';
        }
        return createdAt.split(' ')[0] ?? createdAt;
    }
}
