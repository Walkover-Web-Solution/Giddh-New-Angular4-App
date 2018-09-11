import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}

// interface DataModel {
//   field: string;
//   columnNumber: number;
// }

@Component({
  selector: 'import-process',  // <home></home>
  styleUrls: ['./import-process.component.scss'],
  templateUrl: './import-process.component.html'
})

export class ImportProcessComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onSubmit = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  @Input() public entity: string;
  public editHeaderIdx: number = null;
  public dataModel: DataModel[];

  constructor() {
    //
  }

  private _importData: ImportExcelRequestData;

  public get importData(): ImportExcelRequestData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelRequestData) {
    this.prepareDataModel(value);
    // this.prepareData(value);
    this._importData = value;
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

  public selectAll(value) {
    this._importData.data.items.forEach(p => p.setImport = value);
  }

  public save() {
    const data = {...this.importData.data, items: this.importData.data.items.filter(p => p.setImport)};
    this.onSubmit.emit({...this.importData, data});
  }

  public columnSelected(val: IOption, data: DataModel, idx) {
    if (val && val.label) {
      this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];
      this.dataModel[idx].field = val.label;
    }
    this.editHeaderIdx = null;
  }

  /**
   * editColumn  */
  public editColumn(obj, idx) {
    this.editHeaderIdx = idx;
  }

  private prepareDataModel(value: ImportExcelResponseData) {
    const options: IOption[] = value.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field: value.mappings.mappingInfo[field][0].columnHeader,
        options,
        selected: value.mappings.mappingInfo[field][0].columnNumber.toString(),
        columnNumber: value.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
      })).sort((a, b) => +a.columnNumber - +b.columnNumber);
  }

  // private prepareData(value: ImportExcelRequestData) {
  //   this.dataModel = Object.keys(value.mappings.mappingInfo)
  //     .map(field => ({
  //       field,
  //       columnNumber: value.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
  //     })).sort((a, b) => {console.log(a, b); return +a.columnNumber - +b.columnNumber; });
  // }
}
