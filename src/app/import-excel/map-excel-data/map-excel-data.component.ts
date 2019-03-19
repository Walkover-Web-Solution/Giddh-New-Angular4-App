import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HeaderItem, ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-select/option.interface';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}

class MandatoryHeaders {
  public field: string;
  public selected: false;
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
    // this.prepareMandatoryHeaders(value, this.dataModel);
    this._importData = value;
  }

  @Output() public onNext = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  public dataModel: DataModel[];
  public mandatoryHeadersModel: MandatoryHeaders[] = [];
  private importRequestData: ImportExcelRequestData;

  private _importData: ImportExcelResponseData;

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
    // debugger;
    this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];
  }

  private prepareDataModel(value: ImportExcelResponseData) {
    const options: IOption[] = value.giddhHeaders.map(p => {
      let colFromHeader = value.headers.items.find(f => f.columnHeader === p);
      return {label: p, value: colFromHeader ? colFromHeader.columnNumber : ''};
    });
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = value.headers.items.map((field: HeaderItem) => ({
      field: field.columnHeader,
      options,
      selected: field.columnNumber.toString()
    }));
  }

  private prepareMandatoryHeaders(value: ImportExcelResponseData, data: DataModel[]) {
    value.mandatoryHeaders.forEach(f => {
      let index = this.mandatoryHeadersModel.findIndex(fi => fi.field === f);
      if (index > -1) {
        this.mandatoryHeadersModel[index].selected = value.mappings.mappingInfo[f].length ? value.mappings.mappingInfo[f][0].isSelected : false;
      } else {
        this.mandatoryHeadersModel.push({field: f, selected: value.mappings.mappingInfo[f].length ? value.mappings.mappingInfo[f][0].isSelected : false});
      }
    });
  }
}
