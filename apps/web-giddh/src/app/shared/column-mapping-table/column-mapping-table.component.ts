import {
    ChangeDetectionStrategy,
    Component,
    input,
    output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MappingRowModel } from '../../bank-reconciliation/utility/bank-reconciliation.model';

/**
 * Reusable column mapping table component.
 * Displays a mapping row with dropdowns, original column headers,
 * and up to 10 sample data rows from an uploaded file.
 * Used wherever a user needs to map file columns to system fields.
 */
@Component({
    selector: 'column-mapping-table',
    templateUrl: './column-mapping-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormFieldsModule,
    ]
})
export class ColumnMappingTableComponent {
    /** Mapping rows containing column headers and available Giddh field options */
    readonly mappingRows = input.required<MappingRowModel[]>();

    /** Sample data rows from the uploaded file for preview */
    readonly previewRows = input.required<Array<Array<{ columnNumber: string; columnValue: string }>>>();

    /** Account unique name to display in the info bar */
    readonly accountUniqueName = input<string>('');

    /** From date to display in the info bar */
    readonly fromDate = input<string>('');

    /** To date to display in the info bar */
    readonly toDate = input<string>('');

    /** Whether an API call is in progress */
    readonly isLoading = input<boolean>(false);

    /** Locale data specific to the host page */
    readonly localeData = input<Record<string, string>>({});

    /** Common locale data shared across the app */
    readonly commonLocaleData = input<Record<string, string>>({});

    /** Emitted when user selects a Giddh field for a column */
    readonly giddhFieldSelected = output<{ value: string; index: number }>();

    /** Emitted when user clicks the Cancel button */
    readonly cancel = output<void>();

    /** Emitted when user clicks the Reconcile / Process button */
    readonly reconcile = output<void>();

    /**
     * Returns the cell value for a given column number from a data row.
     *
     * @param {Array<{ columnNumber: string; columnValue: string }>} dataRow - The data row
     * @param {number} columnNumber - The column number to look up
     * @returns {string} The cell value or empty string if not found
     */
    protected getCellValue(dataRow: Array<{ columnNumber: string; columnValue: string }>, columnNumber: number): string {
        return dataRow?.find(cell => cell.columnNumber === String(columnNumber))?.columnValue ?? '';
    }

    /**
     * Handles Giddh field selection from a dropdown and emits the event upward.
     *
     * @param {string | undefined} value - The selected Giddh field value
     * @param {number} index - The column index in mappingRows
     */
    protected onFieldSelected(value: string | undefined, index: number): void {
        this.giddhFieldSelected.emit({ value: value ?? '', index });
    }
}
