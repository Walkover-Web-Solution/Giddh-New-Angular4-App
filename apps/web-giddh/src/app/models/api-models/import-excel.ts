import { CommonPaginatedRequest } from './Invoice';

export interface HeaderItem {
    columnNumber: string;
    columnHeader: string;
}

export interface Headers {
    items: HeaderItem[];
    numColumns: number;
}

export class Mappings {
    public columnNumber: number;
    public columnHeader: string;
    public mappedColumn: string;
}

export interface MapValue {
    columnNumber?: string;
    columnValue: string;
    valid: boolean;
}

export interface DataItem {
    row: MapValue[];
    rowNumber: number;
}

export interface ResponseData {
    numRows: number;
    totalRows: number;
    items: DataItem[];
}

export interface RequestData {
    numRows: number;
    totalRows: number;
    items: DataItem[];
}

export interface ImportExcelResponseData {
    headers: Headers;
    mappings: Mappings[];
    data: ResponseData;
    giddhHeaders?: string[];
    isHeaderProvided?: boolean;
}

export interface ImportExcelRequestData {
    headers: Headers;
    mappings: Mappings[];
    data: RequestData;
    giddhHeaders?: string[];
    isHeaderProvided?: boolean;
    branchUniqueName?: string;
}

export class ImportExcelProcessResponseData {
    public message: string;
    public response: string;
    public failureCount: number;
    public successCount: number;
    public requestId: string;
    public status: string;
}

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

export class ImportExcelStatusPaginatedResponse extends CommonPaginatedRequest {
    public results: ImportExcelStatusResponse[];

    constructor() {
        super();
        this.totalItems = 0;
    }
}

export interface UploadExceltableResponse {
    message: string;
    response: string;
    failureCount: number;
    successCount: number;
}

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

export interface ImportExcelState {
    requestState: ImportExcelRequestStates;
    importExcelData?: ImportExcelResponseData;
    importResponse?: ImportExcelProcessResponseData;
    importStatus: ImportExcelStatusPaginatedResponse;
}