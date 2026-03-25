/**
 * Enum representing the current view state of the bank reconciliation page
 */
export enum ReconciliationView {
    Upload = 'upload',
    Mapping = 'mapping',
    List = 'list'
}

/**
 * Enum for supported file types in reconciliation upload
 */
export enum ReconciliationFileType {
    PDF = 'pdf',
    XLSX = 'xlsx',
    XLS = 'xls',
    CSV = 'csv'
}

/**
 * Interface for a single column header from the uploaded file
 */
export interface ReconciliationColumnHeader {
    /** Zero-based column index as string */
    columnNumber: string;
    /** Original column header text from the file */
    columnHeader: string;
}

/**
 * Interface for upload API response body
 */
export interface ReconciliationUploadResponse {
    /** Unique request ID for subsequent process call */
    requestId: string;
    /** Detected file type */
    fileType: string;
    /** Column headers extracted from the file */
    headers: {
        items: ReconciliationColumnHeader[];
        numColumns: number;
    };
    /** Sample data rows from the file */
    data: {
        items: any[];
    };
    /** Giddh field names available for mapping */
    giddhHeaders: string[];
    /** Auto-detected from date */
    fromDate: string;
    /** Auto-detected to date */
    toDate: string;
    /** Auto-detected account unique name */
    accountUniqueName: string;
}

/**
 * Interface for a single column mapping entry
 */
export interface ReconciliationMapping {
    /** Original column header from the file */
    columnHeader: string;
    /** Zero-based column number */
    columnNumber: number;
    /** Giddh field name this column maps to */
    mappedColumn: string;
}

/**
 * Interface for the process API request body
 */
export interface ReconciliationProcessRequest {
    /** Request ID from the upload response */
    requestId: string;
    /** Column mappings configured by the user */
    mappings: ReconciliationMapping[];
}

/**
 * Interface for a single reconciliation list item
 */
export interface ReconciliationListItem {
    /** Unique request ID */
    requestId: string;
    /** Account unique name used for reconciliation */
    accountUniqueName: string;
    /** Internal account ID */
    accountId: number;
    /** Detected file type */
    fileType: string;
    /** Original uploaded file name */
    fileName: string;
    /** URL to download the uploaded file */
    uploadFilePath: string;
    /** Current processing status */
    status: string;
    /** User who initiated the reconciliation */
    user: {
        name: string;
        uniqueName: string;
        id: number;
        email: string;
    };
    /** Date the reconciliation was submitted */
    date: string;
    /** Expiry date for download links */
    expireAt: string;
    /** Auto-detected from date in the statement */
    detectedFromDate: string;
    /** Auto-detected to date in the statement */
    detectedToDate: string;
    /** URL to download the reconciled output file */
    reconciledFilePath?: string;
}

/**
 * Interface for the get-all API response body
 */
export interface ReconciliationListResponse {
    items: ReconciliationListItem[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
}

/**
 * Interface for pagination + filter request parameters
 */
export interface ReconciliationRequest {
    /** Current page number (1-based) */
    page: number;
    /** Items per page */
    count: number;
    /** Total items from last response */
    totalItems: number;
    /** Filter from date (DD-MM-YYYY) */
    from: string;
    /** Filter to date (DD-MM-YYYY) */
    to: string;
}

/**
 * Model for a mapped column row in the UI table
 */
export interface MappingRowModel {
    /** Original column header from file */
    columnHeader: string;
    /** Zero-based column number */
    columnNumber: number;
    /** Currently selected Giddh field */
    selectedGiddhField: string;
    /** Available Giddh field options (filtered out already selected) */
    availableOptions: Array<{ label: string; value: string }>;
}
