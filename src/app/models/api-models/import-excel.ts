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

export interface Mappings {
  columnNumber: number;
  columnHeader: string;
  mappedColumn: string;
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
}

export interface ImportExcelRequestData {
  headers: Headers;
  mappings: Mappings[];
  data: RequestData;
  giddhHeaders?: string[];
  mandatoryHeaders?: string[];
}

export interface UploadExceltableResponse {
  message: string;
  response: string;
  failureCount: number;
  successCount: number;
}
