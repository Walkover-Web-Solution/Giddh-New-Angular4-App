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
  numMappings?: number;
  mappingInfo: MappingInfo;
}

export interface MapValue {
  columnNumber: string;
  columnValue: string;
  isValid: boolean;
}

export interface DataItem {
  row: MapValue[];
  rowNumber: number;
  setImport: boolean;
  invalid: boolean;
}

export interface DataResult {
  results: DataItem[];
  page: number;
  count: number;
}

export interface ResponseData {
  numRows: number;
  totalRows: number;
  items: DataResult;
}

export interface RequestData {
  numRows: number;
  totalRows: number;
  items: DataItem[];
}

export interface ImportExcelResponseData {
  headers: Headers;
  mappings: Mappings;
  data: ResponseData;
}

export interface ImportExcelRequestData {
  headers: Headers;
  mappings: Mappings;
  data: RequestData;
}
