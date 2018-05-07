import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData } from '../../models/api-models/import-excel';

interface DataModel {
  field: string;
  columnNumber: number;
}

@Component({
  selector: 'import-process',  // <home></home>
  styleUrls: ['./import-process.component.scss'],
  templateUrl: './import-process.component.html'
})

export class ImportProcessComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onSubmit = new EventEmitter<ImportExcelRequestData>();

  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  public dataModel: DataModel[];
  private _importData: ImportExcelRequestData;

  public get importData(): ImportExcelRequestData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelRequestData) {
    this.prepareData(value);
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

  public selectAll(value) {
    this._importData.data.items.forEach(p => p.setImport = value);
  }

  private prepareData(value: ImportExcelRequestData) {
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field,
        columnNumber: value.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
      })).sort((a, b) => +a.columnNumber - +b.columnNumber);
  }
}
