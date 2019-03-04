import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist';
import { cloneDeep } from '../../lodash-optimized';

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

  public get importData(): ImportExcelRequestData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelRequestData) {
    this.prepareDataModel(value);
    // this.prepareData(value);
    this._importData = value;
  }

  @Output() public onSubmit = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  @Input() public entity: string;
  public editHeaderIdx: number = null;
  public dataModel: DataModel[];
  public config: PerfectScrollbarConfigInterface = {suppressScrollX: false, suppressScrollY: false};
  public options: IOption[];

  private _importData: ImportExcelRequestData;

  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
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
      let col1: number =  parseInt((data.selected));
      let col2: number = parseInt(val.value);
    if (val && val.label) {
      let currentCol;
      let currentColHeading;
      let newCol;
      let newColHeading;
      Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
        if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.selected)) {
          currentCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
          currentColHeading = f;
        }

        if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(val.value)) {
          newCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
          newColHeading = f;
        }
      });

      if (this._importData.mappings.mappingInfo[currentColHeading][0]) {
        this._importData.mappings.mappingInfo[currentColHeading][0].columnNumber = newCol[0].columnNumber;
      } else {
        this._importData.mappings.mappingInfo[currentColHeading][0].columnNumber = '';
      }

      if (this._importData.mappings.mappingInfo[newColHeading][0]) {
        this._importData.mappings.mappingInfo[newColHeading][0].columnNumber = currentCol[0].columnNumber;
      } else {
        this._importData.mappings.mappingInfo[newColHeading][0].columnNumber = '';
      }
      // this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];

       this.options = this._importData.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
       this.options[col1].value = col2.toString();
       this.options[col2].value = col1.toString();
      this.dataModel = Object.keys(this._importData.mappings.mappingInfo)
        .map(field => ({
          field: this._importData.mappings.mappingInfo[field][0].columnHeader,
          options: this.options,
          selected: this._importData.mappings.mappingInfo[field][0].columnNumber.toString(),
          columnNumber: this._importData.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
        })).sort((a, b) => +a.columnNumber - +b.columnNumber);
    }
    this.editHeaderIdx = null;
  }

// public columnSelected(val: IOption, data: DataModel, idx) {
//     console.log('val datamodel', val , data, this._importData);
//     if (val && val.label) {
//       let currentCol;
//       let currentColHeading;
//       let newCol;
//       let newColHeading;
//       Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
//         if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.selected)) {
//           currentCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
//           currentColHeading = f;

//         }

//         if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(val.value)) {
//           newCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
//           newColHeading = f;

//         }
//       });
//     delete this._importData.mappings.mappingInfo[currentColHeading];
//      delete this._importData.mappings.mappingInfo[newColHeading];
//       this._importData.mappings.mappingInfo[currentColHeading] = newCol;
//       this._importData.mappings.mappingInfo[newColHeading] = currentCol;

//       // if (this._importData.mappings.mappingInfo[currentColHeading][0]) {
//       //   this._importData.mappings.mappingInfo[currentColHeading][0].columnNumber = newCol[0].columnNumber;
//       // } else {
//       //   this._importData.mappings.mappingInfo[currentColHeading][0].columnNumber = '';
//       // }

//       // if (this._importData.mappings.mappingInfo[newColHeading][0]) {
//       //   this._importData.mappings.mappingInfo[newColHeading][0].columnNumber = currentCol[0].columnNumber;
//       // } else {
//       //   this._importData.mappings.mappingInfo[newColHeading][0].columnNumber = '';
//       // }
//       // this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];

//       const options: IOption[] = this._importData.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
//       this.dataModel = Object.keys(this._importData.mappings.mappingInfo)
//         .map(field => ({
//           field: this._importData.mappings.mappingInfo[field][0].columnHeader,
//           options,
//           selected: this._importData.mappings.mappingInfo[field][0].columnNumber.toString(),
//           columnNumber: this._importData.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
//         })).sort((a, b) => +a.columnNumber - +b.columnNumber);
//     }
//     this.editHeaderIdx = null;
//   }

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
