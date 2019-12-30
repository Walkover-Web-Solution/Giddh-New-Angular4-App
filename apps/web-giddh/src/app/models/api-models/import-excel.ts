import { CommonPaginatedRequest } from './Invoice';

export interface HeaderItem {
	columnNumber: string;
	columnHeader: string;
}

export interface Headers {
	items: HeaderItem[];
	numColumns: number;
}

export interface MapHeader {
	columnNumber: number;
	columnHeader: string;
	isSelected: boolean;
}

export interface MappingInfo {
	uniqueName: MapHeader[];
	name: MapHeader[];
	description: MapHeader[];
	parentGroupUniqueName: MapHeader[];
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

export interface DataResult {
	results: DataItem[];
	page: number;
	count: number;
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
	mandatoryHeaders?: string[];
	groupMandatoryHeaders: string[][];
	isHeaderProvided?: boolean;
}

export interface ImportExcelRequestData {
	headers: Headers;
	mappings: Mappings[];
	data: RequestData;
	giddhHeaders?: string[];
	mandatoryHeaders?: string[];
	groupMandatoryHeaders: string[][];
	isHeaderProvided?: boolean;
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
}

export class ImportExcelStatusPaginatedResponse extends CommonPaginatedRequest {
	public results: ImportExcelStatusResponse[];
}

export interface UploadExceltableResponse {
	message: string;
	response: string;
	failureCount: number;
	successCount: number;
}
