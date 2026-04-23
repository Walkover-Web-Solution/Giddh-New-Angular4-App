/** Represents a leaf-level column header (no children) */
export interface SalesByPersonLeafHeader {
    label: string;
    key: string;
    type?: string;
    sticky?: boolean;
    /** Percentage width (0–100) */
    width?: number;
}

/** Represents a grouped column header with child columns */
export interface SalesByPersonGroupHeader {
    label: string;
    /** Key used to access the nested group object on each row (e.g. "new", "old", "total") */
    key: string;
    children: SalesByPersonLeafHeader[];
    /** Percentage width (0–100) for the whole group */
    width?: number;
}

/** Union type for header entries from the API */
export type SalesByPersonHeader = SalesByPersonLeafHeader | SalesByPersonGroupHeader;

/** A single row in the expanded breakdown sub-table */
export interface SalesByPersonExpandRow {
    label: string;
    clients: number;
    amount: number;
    invoices: number;
    fromDate?: string;
    toDate?: string;
}

/** A main data row returned by the API */
export interface SalesByPersonRow {
    id: string;
    expandable: boolean;
    /** Dynamic group data keyed by the group header key (e.g. row["new"].clients) */
    [key: string]: unknown;
}

/** Summary period info attached to the response */
export interface SalesByPersonSalesFrom {
    label: string;
    fromDate: string;
    toDate: string;
    clients: number;
    amount: number;
    invoices: number;
}

/** Full API response shape for the sales-by-person report */
export interface SalesByPersonResponse {
    headers: SalesByPersonHeader[];
    rows: SalesByPersonRow[];
    salesFrom?: SalesByPersonSalesFrom;
    newSales?: SalesByPersonSalesFrom;
    oldSales?: SalesByPersonSalesFrom;
}

/** Internal flat column definition used by mat-table */
export interface SbpColumnDef {
    /** Unique mat-table column ID */
    colId: string;
    /** Display label for the header cell */
    label: string;
    /** Dot-notation key path to resolve value from a row (e.g. "new.clients") */
    key: string;
    /** Whether clicking this cell should emit an event */
    clickable: boolean;
    /** Which event to emit on click */
    clickType: 'client' | 'invoice' | null;
    /** Top-level group this leaf belongs to (e.g. 'new', 'old', 'total') */
    group: string;
    /** True when this column is a standalone leaf (not part of a group), e.g. Sales Person */
    isLeaf: boolean;
    /** Percentage width for this column (e.g. 10 = 10%) */
    widthPct: number;
}

/** Data group type passed to showClientList — identifies which sales group a cell belongs to */
export enum SbpDataType {
    New = 'new',
    Old = 'old',
    Total = 'total',
    Carried = 'carried'
}

/** Sub-type passed to showClientList — identifies whether the click was on a client or invoice cell */
export enum SbpSubType {
    Client = 'client',
    Invoice = 'invoice'
}

/** Discriminator for the two virtual row types in the flat datasource */
export type SbpRowType = 'data' | 'detail';

/** Sentinel row wrapper used as mat-table datasource items */
export interface SbpFlatRow {
    /** Discriminator to select the correct matRowDef */
    rowType: SbpRowType;
    /** Reference to the underlying data row */
    row: SalesByPersonRow;
}

/** Group header entry for the top-level header row */
export interface SbpGroupDef {
    /** Display label */
    label: string;
    /** Number of leaf columns spanned */
    colspan: number;
    /** Unique tracking key */
    key: string;
    /** Percentage width for this group (e.g. 30 = 30%) */
    widthPct: number;
    /** True when this entry represents a lone leaf column (e.g. Sales Person) */
    isLeaf: boolean;
    /** Child leaf column defs (only populated for group entries, not leaf entries) */
    children: Pick<SbpColumnDef, 'colId' | 'label'>[];
}
