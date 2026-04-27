import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    input,
    output,
    signal
} from '@angular/core';
import {
    SalesByPersonExpandRow,
    SalesByPersonGroupHeader,
    SalesByPersonHeader,
    SalesByPersonLeafHeader,
    SalesByPersonResponse,
    SalesByPersonRow,
    SbpColumnDef,
    SbpFlatRow,
    SbpGroupDef
} from './sales-by-person.models';

/**
 * Displays a sales-by-person bifurcation report as a mat-table with
 * two-level grouped column headers and per-row expandable detail views.
 * Expand data is loaded via a separate API call when a row is expanded.
 */
@Component({
    selector: 'sales-by-person',
    templateUrl: './sales-by-person.component.html',
    styleUrls: ['./sales-by-person.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesByPersonComponent {
    /** API response containing headers and rows — passed from the parent component */
    readonly data = input<SalesByPersonResponse | null>(null);

    /** Page-specific locale strings (new-old-invoices locale file) */
    readonly localeData = input<Record<string, string>>({});

    /** Common/shared locale strings */
    readonly commonLocaleData = input<Record<string, string>>({});

    /** Emits when a client count cell is clicked */
    readonly clientClick = output<{ row: SalesByPersonRow; group: string }>();

    /** Emits when an invoice count cell is clicked */
    readonly invoiceClick = output<{ row: SalesByPersonRow; group: string }>();

    /** Emits when a client cell in an expand breakdown row is clicked */
    readonly expandClientClick = output<{ row: SalesByPersonRow; expandRow: SalesByPersonExpandRow }>();

    /** Emits when an invoice cell in an expand breakdown row is clicked */
    readonly expandInvoiceClick = output<{ row: SalesByPersonRow; expandRow: SalesByPersonExpandRow }>();

    /**
     * Emits the row ID when a row is expanded for the first time,
     * so the parent can trigger an API call to load expand data.
     */
    readonly expandRow = output<string>();

    /** Flat leaf column definitions derived from input headers */
    protected readonly columnDefs = computed<SbpColumnDef[]>(() => {
        const headers = this.data()?.headers ?? [];
        const defs: SbpColumnDef[] = [];

        /** Total leaf columns across all headers — used for auto width when width is absent */
        const totalLeaves = headers.reduce((sum, h) =>
            sum + (this.isGroupHeader(h) ? h.children.length : 1), 0);

        for (const header of headers) {
            if (this.isGroupHeader(header)) {
                const childCount = header.children.length || 1;
                const groupWidthPct = header.width != null ? header.width : (childCount / totalLeaves) * 100;
                const leafWidthPct = groupWidthPct / childCount;
                const groupKey = header.key;
                for (const child of header.children) {
                    const dotKey = `${groupKey}.${child.key}`;
                    defs.push({
                        colId: dotKey.replace('.', '_'),
                        label: child.label,
                        key: dotKey,
                        clickable: child.key === 'clients' || child.key === 'invoices',
                        clickType: child.key === 'clients' ? 'client' : child.key === 'invoices' ? 'invoice' : null,
                        group: groupKey,
                        isLeaf: false,
                        widthPct: leafWidthPct
                    });
                }
            } else {
                const leaf = header as SalesByPersonLeafHeader;
                defs.push({
                    colId: leaf.key.replace(/\./g, '_'),
                    label: leaf.label,
                    key: leaf.key,
                    clickable: false,
                    clickType: null,
                    group: '',
                    isLeaf: true,
                    widthPct: leaf.width != null ? leaf.width : (1 / totalLeaves) * 100
                });
            }
        }
        return defs;
    });

    /** Column IDs for mat-table [displayedColumns] */
    protected readonly displayedColumns = computed<string[]>(() =>
        this.columnDefs().map(c => c.colId)
    );

    /** Group header definitions for the spanning group header row */
    protected readonly groupDefs = computed<SbpGroupDef[]>(() => {
        const headers = this.data()?.headers ?? [];
        const groups: SbpGroupDef[] = [];

        /** Total leaf columns — used for auto width when width is absent */
        const totalLeaves = headers.reduce((sum, h) =>
            sum + (this.isGroupHeader(h) ? h.children.length : 1), 0);

        for (const header of headers) {
            if (this.isGroupHeader(header)) {
                const children = header.children.map(c => ({
                    colId: `${header.key}_${c.key}`,
                    label: c.label
                }));
                groups.push({
                    label: header.label,
                    colspan: header.children.length,
                    key: header.key,
                    widthPct: header.width != null ? header.width : (header.children.length / totalLeaves) * 100,
                    isLeaf: false,
                    children
                });
            } else {
                const leaf = header as SalesByPersonLeafHeader;
                groups.push({ label: leaf.label, colspan: 1, key: leaf.key, widthPct: leaf.width != null ? leaf.width : (1 / totalLeaves) * 100, isLeaf: true, children: [] });
            }
        }
        return groups;
    });

    /** Total column count used for colspan on expand detail row */
    protected readonly totalColspan = computed<number>(() => this.columnDefs().length);

    /**
     * Flat datasource for mat-table: each data row produces two sentinel rows
     * ('data' and 'detail') so mat-table can render them as separate <tr> elements.
     */
    protected readonly flatRows = computed<SbpFlatRow[]>(() => {
        const rows = this.data()?.rows ?? [];
        const flat: SbpFlatRow[] = [];
        for (const row of rows) {
            flat.push({ rowType: 'data', row });
            if (row.expandable) {
                flat.push({ rowType: 'detail', row });
            }
        }
        return flat;
    });

    /** Row predicate: selects only data sentinel rows */
    protected readonly isDataRow = (_index: number, item: SbpFlatRow): boolean => item.rowType === 'data';

    /** Row predicate: selects only detail sentinel rows */
    protected readonly isDetailRow = (_index: number, item: SbpFlatRow): boolean => item.rowType === 'detail';

    /** Set of currently expanded row IDs */
    private readonly expandedIds = signal(new Set<string>());

    /**
     * Map of row ID → loaded expand rows.
     * Populated externally via loadExpandRows() after the API call completes.
     */
    private readonly expandDataMap = signal(new Map<string, SalesByPersonExpandRow[]>());

    constructor(private readonly cdr: ChangeDetectorRef) {}

    /**
     * Type guard: returns true if the header has children (is a group header).
     *
     * @param {SalesByPersonHeader} header
     * @returns {boolean}
     * @memberof SalesByPersonComponent
     */
    protected isGroupHeader(header: SalesByPersonHeader): header is SalesByPersonGroupHeader {
        return 'children' in header && Array.isArray((header as SalesByPersonGroupHeader).children);
    }

    /**
     * Resolves a dot-notation key path against a row object.
     * Example: resolveKey(row, "new.clients") → row.new.clients
     *
     * @param {SalesByPersonRow} row
     * @param {string} key - Dot-notation path
     * @returns {unknown}
     * @memberof SalesByPersonComponent
     */
    protected resolveKey(row: SalesByPersonRow, key: string): unknown {
        return key.split('.').reduce((obj: any, k) => obj?.[k], row);
    }

    /**
     * Returns true if the given row ID is currently expanded.
     *
     * @param {string} id
     * @returns {boolean}
     * @memberof SalesByPersonComponent
     */
    protected isExpanded(id: string): boolean {
        return this.expandedIds().has(id);
    }

    /**
     * Returns the oldSalesBreakdown rows from the row itself, falling back to
     * any externally loaded expand rows.
     *
     * @param {string} id
     * @returns {SalesByPersonExpandRow[]}
     * @memberof SalesByPersonComponent
     */
    protected getExpandRows(id: string): SalesByPersonExpandRow[] {
        const row = (this.data()?.rows ?? []).find(r => r.id === id);
        const embedded = (row as any)?.oldSalesBreakdown as SalesByPersonExpandRow[] | undefined;
        if (Array.isArray(embedded) && embedded.length > 0) {
            return embedded;
        }
        return this.expandDataMap().get(id) ?? [];
    }

    /**
     * Returns true if expand data is available — either embedded in the row
     * or loaded externally.
     *
     * @param {string} id
     * @returns {boolean}
     * @memberof SalesByPersonComponent
     */
    protected isExpandDataLoaded(id: string): boolean {
        const row = (this.data()?.rows ?? []).find(r => r.id === id);
        const embedded = (row as any)?.oldSalesBreakdown;
        return Array.isArray(embedded) || this.expandDataMap().has(id);
    }

    /**
     * Handles click on a data sentinel row — toggles expand if row is expandable.
     *
     * @param {SbpFlatRow} sentinel
     * @memberof SalesByPersonComponent
     */
    protected onRowClick(sentinel: SbpFlatRow): void {
        if (sentinel.row?.expandable) {
            this.toggleExpand(sentinel.row.id);
        }
    }

    /**
     * Toggles the expanded state of a row.
     * On first expand, emits expandRow so the parent can load data.
     *
     * @param {string} id
     * @memberof SalesByPersonComponent
     */
    protected toggleExpand(id: string): void {
        this.expandedIds.update(set => {
            if (set.has(id)) {
                return new Set<string>();
            }
            if (!this.expandDataMap().has(id)) {
                this.expandRow.emit(id);
            }
            return new Set<string>([id]);
        });
    }

    /**
     * Called by the parent component to supply expand row data for a row ID
     * after the API call completes.
     *
     * @param {string} rowId
     * @param {SalesByPersonExpandRow[]} rows
     * @memberof SalesByPersonComponent
     */
    public loadExpandRows(rowId: string, rows: SalesByPersonExpandRow[]): void {
        this.expandDataMap.update(map => {
            const next = new Map(map);
            next.set(rowId, rows);
            return next;
        });
        this.cdr.markForCheck();
    }

    /**
     * Emits a cell click event (client or invoice).
     *
     * @param {SalesByPersonRow} row
     * @param {SbpColumnDef} col
     * @memberof SalesByPersonComponent
     */
    protected onCellClick(row: SalesByPersonRow, col: SbpColumnDef): void {
        if (col.clickType === 'client') {
            this.clientClick.emit({ row, group: col.group });
        } else if (col.clickType === 'invoice') {
            this.invoiceClick.emit({ row, group: col.group });
        }
    }

}
