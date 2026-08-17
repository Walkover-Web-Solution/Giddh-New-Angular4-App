/** Single aging bucket value returned by the API (per stock row and in totals). */
export interface StockAgingBucket {
    range: string;
    quantity: number;
    value: number;
}

/** One row in the aging report (per stock). */
export interface StockAgingRow {
    stockName: string;
    stockUniqueName?: string;
    stockUnitCode: string;
    totalQty: number;
    totalAmount: number;
    buckets: StockAgingBucket[];
    hasVariants?: boolean;
}

/** One variant row returned by the per-stock variants API. */
export interface StockAgingVariantRow {
    variantId?: number;
    variantUniqueName: string;
    variantName: string;
    skuCode?: string | null;
    stockUnitCode: string;
    totalQty: number;
    totalAmount: number;
    buckets: StockAgingBucket[];
}

/** Single transaction shown in the expanded detail panel of a stock row. */
export interface StockAgingTransaction {
    purchaseDate: string | null;
    purchaseInvoice: string;
    purchaseInvoiceUniqueName: string | null;
    warehouse: string;
    qtyInward: number;
    qtyOutward: number;
    balanceQty: number;
    rate: number;
    stockValue: number;
    ageDays: number | null;
    ageBucket: string;
}

/** Paginated `transactions` payload of the stock detail API. */
export interface StockAgingTransactionsPage {
    results: StockAgingTransaction[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    size?: number;
}

/** Aggregate row shown under the transactions of the expanded stock. */
export interface StockAgingTransactionTotals {
    qtyInward: number;
    qtyOutward: number;
    balanceQty: number;
    stockValue: number;
}

/** Response body of the per-stock aging detail API. */
export interface StockAgingDetailsBody {
    itemCode: string;
    itemName: string;
    totalStockQty: number;
    totalStockValue: number;
    bucketSummary: StockAgingBucket[];
    transactions?: StockAgingTransactionsPage;
    total?: StockAgingTransactionTotals;
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

/** Fixed leaf column definition rendered around the bucket group columns. */
export interface StockAgingLeafColumn {
    colId: string;
    label: string;
    isLeaf: boolean;
    align: 'left' | 'center' | 'right';
}

/** Cached percentage widths for the mat-table columns. */
export interface ColumnWidths {
    sr: number;
    stockName: number;
    uom: number;
    base: number;
    bucketGroup: number;
}
