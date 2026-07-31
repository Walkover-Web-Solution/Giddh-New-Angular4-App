/** Single aging bucket value returned by the API (per stock row and in totals). */
export interface StockAgingBucket {
    range: string;
    quantity: number;
    value: number;
}

/** One row in the aging report (per stock). */
export interface StockAgingRow {
    stockName: string;
    stockUnitCode: string;
    totalQty: number;
    totalAmount: number;
    buckets: StockAgingBucket[];
}

/** Aggregate totals shown in the summary cards and the footer row. */
export interface StockAgingTotals {
    totalQuantity: number;
    totalValue: number;
    buckets: StockAgingBucket[];
}

/** Paginated `items` payload wrapping the report rows. */
export interface StockAgingItemsPage {
    results: StockAgingRow[];
    page: number;
    totalItems: number;
}

/** Response body of the stock aging report API. */
export interface StockAgingReportBody {
    totals?: StockAgingTotals;
    items?: StockAgingItemsPage;
}

/** Sort state for a bucket Qty/Value column. */
export interface BucketSortState {
    sortBy: 'qty' | 'value';
    sort: 'asc' | 'desc';
    interval: string;
    intervalIndex: number;
}

/** Precomputed column ids for a single aging bucket. */
export interface BucketColumn {
    range: string;
    qtyColId: string;
    valueColId: string;
}

/** Cached percentage widths for the mat-table columns. */
export interface ColumnWidths {
    sr: number;
    stockName: number;
    uom: number;
    base: number;
    bucketGroup: number;
}
