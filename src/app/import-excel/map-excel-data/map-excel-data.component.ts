import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HeaderItem, ImportExcelRequestData, ImportExcelResponseData, Mappings } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-select/option.interface';
import { cloneDeep } from '../../lodash-optimized';

interface DataModel {
  field: HeaderItem;
  options: IOption[];
  selected: string;
}

class MandatoryHeaders {
  public field: string;
  public selected: boolean;
}

@Component({
  selector: 'map-excel-data',  // <home></home>
  styleUrls: ['./map-excel-data.component.scss'],
  templateUrl: './map-excel-data.component.html'
})

export class MapExcelDataComponent implements OnInit, OnDestroy, AfterViewInit {

  public get importData(): ImportExcelResponseData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelResponseData) {
    this.prepareDataModel(value);
    this.prepareMandatoryHeaders(value);
    this._importData = value;
    this._clonedMappings = cloneDeep(value.mappings);
  }

  @Output() public onNext = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  public dataModel: DataModel[];
  public mandatoryHeadersModel: MandatoryHeaders[] = [];
  public mandatoryHeadersCount: number = 0;
  private importRequestData: ImportExcelRequestData;

  private _importData: ImportExcelResponseData;
  private _clonedMappings: Mappings;

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit(): void {
    //
  }

  public ngOnDestroy() {
    //
  }

  public mapExcelData() {
    this.importRequestData = {
      ...this._importData,
      data: {
        items: this._importData.data.items
          .map(p => ({...p, row: p.row.map((value, index) => ({...value, columnNumber: index.toString()}))}))
        , numRows: 0, totalRows: 0
      }
    };
    this.onNext.emit(this.importRequestData);
  }

  public columnSelected(val: IOption, data: DataModel) {
    if (!val.value) {
      return;
    }
    let findedColumn;
    Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
      if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.field.columnNumber)) {
        findedColumn = cloneDeep(this._importData.mappings.mappingInfo[f]);
        this._importData.mappings.mappingInfo[f][0].isSelected = false;
      }
    });
    this._importData.mappings.mappingInfo[val.value] = findedColumn;
    this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(m => {
      if (val.value === m.field) {
        m.selected = true;
      }
      return m;
    });
    this.updateMandatoryHeadersCounters();
    // this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];
  }

  public clearSelected(data: DataModel) {

    let originalFindedColumn;
    let originalKey;

    // get key from original mappings
    Object.keys(this._clonedMappings.mappingInfo).forEach(f => {
      if (this._clonedMappings.mappingInfo[f][0].columnNumber === parseInt(data.field.columnNumber)) {
        originalKey = f;
        originalFindedColumn = cloneDeep(this._clonedMappings.mappingInfo[f]);
      }
    });

    // set replaced mapping to isSelected false
    Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
      if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.field.columnNumber) && this._importData.mappings.mappingInfo[f][0].isSelected) {
        this._importData.mappings.mappingInfo[f][0].isSelected = false;
      }
    });

    // replace to original mappings
    this._importData.mappings.mappingInfo[originalKey] = originalFindedColumn;

    this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(m => {
      if (data.field.columnHeader === m.field) {
        m.selected = true;
      }
      return m;
    });
    this.updateMandatoryHeadersCounters();
  }

  public updateMandatoryHeadersCounters() {
    this.mandatoryHeadersCount = this.mandatoryHeadersModel.filter(f => f.selected).length;
  }

  private prepareDataModel(value: ImportExcelResponseData) {
    const options: IOption[] = value.giddhHeaders.map(p => {
      // let colFromHeader = value.headers.items.find(f => f.columnHeader === p);
      return {label: p, value: p};
    });
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = value.headers.items.map((field: HeaderItem) => ({
      field,
      options,
      selected: null
    }));
  }

  private prepareMandatoryHeaders(value: ImportExcelResponseData) {
    this.mandatoryHeadersModel = [];
    value.mandatoryHeaders.forEach(f => {
      this.mandatoryHeadersModel.push({field: f, selected: false});
    });
  }
}
