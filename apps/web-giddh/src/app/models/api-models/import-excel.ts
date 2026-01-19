import { CommonPaginatedRequest } from './Invoice';

/**
 * HeaderItem interface definition
 * Defines the structure and contract for HeaderItem objects
 */
export interface HeaderItem {
    columnNumber: string;
    columnHeader: string;
}

/**
 * Headers interface definition
 * Defines the structure and contract for Headers objects
 */
export interface Headers {
    items: HeaderItem[];
    numColumns: number;
}

/**
 * Mappings class
 * Implements Mappings functionality
 */
export class Mappings {
    public columnNumber: number;
    public columnHeader: string;
    public mappedColumn: string;
}

/**
 * MapValue interface definition
 * Defines the structure and contract for MapValue objects
 */
export interface MapValue {
    columnNumber?: string;
    columnValue: string;
    valid: boolean;
}

/**
 * DataItem interface definition
 * Defines the structure and contract for DataItem objects
 */
export interface DataItem {
    row: MapValue[];
    rowNumber: number;
}

/**
 * ResponseData interface definition
 * Defines the structure and contract for ResponseData objects
 */
export interface ResponseData {
    numRows: number;
    totalRows: number;
    items: DataItem[];
}

/**
 * RequestData interface definition
 * Defines the structure and contract for RequestData objects
 */
export interface RequestData {
    numRows: number;
    totalRows: number;
    items: DataItem[];
}

/**
 * ImportExcelResponseData interface definition
 * Defines the structure and contract for ImportExcelResponseData objects
 */
export interface ImportExcelResponseData {
    headers: Headers;
    mappings: Mappings[];
    data: ResponseData;
    giddhHeaders?: string[];
    isHeaderProvided?: boolean;
    sameDebitCreditAmountColumn?: boolean;
    requestId?: any;
    accountUniqueName?: string;
}

/**
 * ImportExcelRequestData interface definition
 * Defines the structure and contract for ImportExcelRequestData objects
 */
export interface ImportExcelRequestData {
    headers: Headers;
    mappings: Mappings[];
    data: RequestData;
    giddhHeaders?: string[];
    isHeaderProvided?: boolean;
    branchUniqueName?: string;
}

/**
 * ImportExcelProcessResponseData class
 * Implements ImportExcelProcessResponseData functionality
 */
export class ImportExcelProcessResponseData {
    public message: string;
    public response: string;
    public failureCount: number;
    public successCount: number;
    public requestId: string;
    public status: string;
}

/**
 * ImportExcelStatusResponse class
 * Implements ImportExcelStatusResponse functionality
 */
export class ImportExcelStatusResponse {
    public requestId: string;
    public fileName: string;
    public entity: string;
    public fileBase64: string;
    public status: string;
    public totalRows: number;
    public successRows: number;
    public processDate: string;
    public submittedBy: string;
    public branch?: any;
}

/**
 * ImportExcelStatusPaginatedResponse class
 * Implements ImportExcelStatusPaginatedResponse functionality
 */
export class ImportExcelStatusPaginatedResponse extends CommonPaginatedRequest {
    public results: ImportExcelStatusResponse[];

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        /**
         * Handles super functionality
         */
        super();
        this.totalItems = 0;
    }
}

/**
 * UploadExceltableResponse interface definition
 * Defines the structure and contract for UploadExceltableResponse objects
 */
export interface UploadExceltableResponse {
    message: string;
    response: string;
    failureCount: number;
    successCount: number;
}

/**
 * ImportExcelRequestStates enumeration
 * Defines constant values for ImportExcelRequestStates
 */
export enum ImportExcelRequestStates {
    Default,
    UploadFileInProgress,
    UploadFileError,
    UploadFileSuccess,
    ProcessImportInProgress,
    ProcessImportSuccess,
    ProcessImportError,
    ImportStatusInProcess,
    ImportStatusSuccess,
    ImportStatusError
}

/**
 * ImportExcelState interface definition
 * Defines the structure and contract for ImportExcelState objects
 */
export interface ImportExcelState {
    requestState: ImportExcelRequestStates;
    importExcelData?: ImportExcelResponseData;
    importResponse?: ImportExcelProcessResponseData;
    importStatus: ImportExcelStatusPaginatedResponse;
}