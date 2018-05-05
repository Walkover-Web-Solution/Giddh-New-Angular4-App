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

export interface Data {
  numRows: number;
  totalRows: number;
  items: DataItem[];
}

export interface ImportExcelData {
  headers: Headers;
  mappings: Mappings;
  data: Data;
}
