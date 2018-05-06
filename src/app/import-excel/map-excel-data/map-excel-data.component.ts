import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelData, MapHeader } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-select/option.interface';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}

@Component({
  selector: 'map-excel-data',  // <home></home>
  styleUrls: ['./map-excel-data.component.scss'],
  templateUrl: './map-excel-data.component.html'
})

export class MapExcelDataComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onNext = new EventEmitter();
  @Output() public onBack = new EventEmitter();
  public dataModel: DataModel[];
  private _importData: ImportExcelData;
  public get importData(): ImportExcelData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelData) {
    this.prepareDataModel(value);
    this._importData = value;
  }

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

  public columnSelected(val: IOption, data: DataModel) {
    console.log(val);
    const mapping: MapHeader[] = this._importData.mappings.mappingInfo[data.field];
    mapping.find(p => p.columnNumber === +val.value).isSelected = true;
  }

  private prepareDataModel(value: ImportExcelData) {
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field,
        options: value.mappings.mappingInfo[field]
          .map(p => ({value: p.columnNumber, label: p.columnHeader})),
        selected: value.mappings.mappingInfo[field].find(p => p.isSelected)
      }));
  }
}
