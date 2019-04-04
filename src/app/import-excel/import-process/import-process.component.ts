import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist';
<<<<<<< HEAD
import { cloneDeep, indexOf } from '../../lodash-optimized';
import { ToasterService } from 'app/services/toaster.service';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}
=======
import { sortBy } from '../../lodash-optimized';
>>>>>>> b59d99349d2251b60f5802434788854385211aa7

// interface DataModel {
//   field: string;
//   columnNumber: number;
// }

@Component({
  selector: 'import-process',
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
<<<<<<< HEAD
=======

    // prepare table header from mappings.mappedColumn and first sortBy columnNumber
    sortBy(value.mappings, ['columnNumber']).forEach(f => this.userHeader.push(f.mappedColumn));
>>>>>>> b59d99349d2251b60f5802434788854385211aa7
  }

  @Output() public onSubmit = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  @Input() public entity: string;
  public editHeaderIdx: number = null;
  public dataModel: DataModel[];
  public config: PerfectScrollbarConfigInterface = {suppressScrollX: false, suppressScrollY: false};
  public options: IOption[];
  public userHeader: string[] = [];
  public userGiddhHeader: string[] = [];
  public DuplicateGiddhHeaders: string[] = [];
  public importDisable: boolean = true;

  private _importData: ImportExcelRequestData;

<<<<<<< HEAD
  constructor(private store: Store<AppState>,  private _toaster: ToasterService) {
=======
  constructor() {
    //
>>>>>>> b59d99349d2251b60f5802434788854385211aa7
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

// public columnSelected(val: IOption, data: DataModel, idx) {
//     if (val && val.label) {
//       let currentCol;
//       let currentColHeading;
//       let newCol;
//       let newColHeading;
// debugger;
//       Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
//         if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.selected)) {
//           currentCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
//           currentColHeading = f;
//             this._importData.mappings.mappingInfo[val.label] = cloneDeep(this._importData.mappings.mappingInfo[f]);
//         }
//       });

//       //    if (f.toString() === val.label) {
//       //     newCol = cloneDeep(this._importData.mappings.mappingInfo[f]);
//       //     newColHeading = f.toString();

//       //   } else {
//       //     this._importData.mappings.mappingInfo[val.label] = cloneDeep(currentCol);

//       //     // delete this._importData.mappings.mappingInfo[data.field];
//       //   }
//       // });
//       //   if (newColHeading && newCol && currentColHeading && currentCol && currentColHeading !== newColHeading ) {
//       // let temp =  this._importData.mappings.mappingInfo[currentColHeading];
//       // this._importData.mappings.mappingInfo[currentColHeading] =  cloneDeep(this._importData.mappings.mappingInfo[newColHeading]);
//       // this._importData.mappings.mappingInfo[newColHeading] =  cloneDeep(temp);
//       //   }

//       // this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];

//       // const options: IOption[] = this._importData.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
//       let i: number = 0;
//      const options = this._importData.giddhHeaders.map(p => ({value: (i++).toString() , label: p.toString()}));
//       this.dataModel = Object.keys(this._importData.mappings.mappingInfo)
//         .map(field => ({
//           field: field.toString(),
//           options,
//           selected: this._importData.mappings.mappingInfo[field][0].columnNumber.toString(),
//           columnNumber: this._importData.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
//         })).sort((a, b) => +a.columnNumber - +b.columnNumber);
//     }

//     this.editHeaderIdx = null;
//   }
public columnSelected(val: IOption, data: DataModel, idx) {
  this.userGiddhHeader = [];
    if (val && val.label) {

       Object.keys(this._importData.mappings.mappingInfo).forEach(f => {
        if (this._importData.mappings.mappingInfo[f][0].columnNumber === parseInt(data.selected)) {
            delete this._importData.mappings.mappingInfo[f];
        }
        });
      this._importData.mappings.mappingInfo[val.label] = [{columnNumber: +data.selected, columnHeader: val.label, isSelected: true}];
      this.dataModel[idx].field = val.label;

    }
   this.dataModel.forEach(f => { this.userGiddhHeader.push(f.field); });
   let usersGiddhHeader = this.userGiddhHeader;
    this.DuplicateGiddhHeaders = this.userGiddhHeader.filter(function( item, index) {
  return usersGiddhHeader.indexOf(item) !== usersGiddhHeader.lastIndexOf(item) && usersGiddhHeader.indexOf(item) === index;
});
if (this.DuplicateGiddhHeaders.length) {
  this._toaster.warningToast( '"' + this.DuplicateGiddhHeaders[0] + '"' + ' is duplicate header in sheet');
  this.importDisable = false;
} else {
   this.importDisable = true;
}
console.log('this._importData' , this._importData.mappings);
    this.editHeaderIdx = null;
  }

     public editColumn(obj, idx) {
    this.editHeaderIdx = idx;
  }

  private prepareDataModel(value: ImportExcelResponseData) {
   // const options: IOption[] = value.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
 value.headers.items.forEach(p => this.userHeader.push(p.columnHeader));
    let i: number = 0;
     const options = value.giddhHeaders.map(p => ({value: (i++).toString() , label: p.toString()}));
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field: field.toString(),
        options,
        selected: value.mappings.mappingInfo[field][0].columnNumber.toString(),
        columnNumber: value.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
      }
      )).sort((a, b) => +a.columnNumber - +b.columnNumber);
  }

  // private prepareData(value: ImportExcelRequestData) {
  //   this.dataModel = Object.keys(value.mappings.mappingInfo)
  //     .map(field => ({
  //       field,
  //       columnNumber: value.mappings.mappingInfo[field].find(p => p.isSelected).columnNumber
  //     })).sort((a, b) => {console.log(a, b); return +a.columnNumber - +b.columnNumber; });
  // }
}
