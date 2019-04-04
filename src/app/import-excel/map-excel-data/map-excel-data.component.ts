import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
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
  @Output() public onNext = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  public dataModel: DataModel[];
  private importRequestData: ImportExcelRequestData;

  constructor() {
    //
  }

  private _importData: ImportExcelResponseData;

  public get importData(): ImportExcelResponseData {
    return this._importData;
  }

  @Input()
  public set importData(value: ImportExcelResponseData) {
    this.prepareDataModel(value);
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
<<<<<<< HEAD
    this._importData.mappings.mappingInfo[data.field] = val ? [{columnNumber: +val.value, columnHeader: val.label, isSelected: true}] : [];
=======
    if (!val.value) {
      return;
    }

    // filter dataModel options as per selection and for handling duplicate column case
    this.dataModel = this.dataModel.map(m => {
      if (data.field.columnNumber !== m.field.columnNumber) {
        m.options = m.options.filter(f => f.value !== val.value);
      }
      return m;
    });

    // change mapping column header as per selection
    let indexFromMappings = this._importData.mappings.findIndex(f => f.columnNumber === parseInt(data.field.columnNumber));

    if (indexFromMappings > -1) {
      this._importData.mappings[indexFromMappings].mappedColumn = val.value;
    } else {
      this._importData.mappings[indexFromMappings].mappedColumn = null;
    }

    // update mandatoryHeadersModel state
    this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(m => {
      if (this.trimAndLowerCase(val.value) === this.trimAndLowerCase(m.field)) {
        m.selected = true;
      }
      return m;
    });

    // update mandatoryGroupModel state
    this.mandatoryGroupModel = this.mandatoryGroupModel.map(m => {
      m = m.map(inm => {
        if (this.trimAndLowerCase(val.value) === this.trimAndLowerCase(inm.field)) {
          inm.selected = true;
        }
        return inm;
      });
      return m;
    });

    this.updateMandatoryHeadersCounters();
    this.updateMandatoryGroupHeadersCounters();
  }

  public clearSelected(val: IOption, data: DataModel) {
    // update mandatoryHeadersModel state
    this.mandatoryHeadersModel = this.mandatoryHeadersModel.map(m => {
      if (m.field === val.value) {
        m.selected = false;
      }
      return m;
    });

    // update mandatoryGroupModel state
    this.mandatoryGroupModel = this.mandatoryGroupModel.map(m => {
      m = m.map(inm => {
        if (inm.field === val.value) {
          inm.selected = false;
        }
        return inm;
      });
      return m;
    });

    // re-push cleared selection to option
    this.dataModel = this.dataModel.map(m => {
      if (data.field.columnNumber !== m.field.columnNumber) {
        m.options.push(val);
      }
      return m;
    });

    this.updateMandatoryHeadersCounters();
    this.updateMandatoryGroupHeadersCounters();
  }

  public updateMandatoryHeadersCounters() {
    // count selected mandatory headers
    this.mandatoryHeadersCount = this.mandatoryHeadersModel.filter(f => f.selected).length;
  }

  public updateMandatoryGroupHeadersCounters() {
    // count selected mandatory headers
    this.mandatoryGroupHeadersCount = this.mandatoryGroupModel.filter(f => {
      return f.some(s => s.selected);
    }).length;
>>>>>>> b59d99349d2251b60f5802434788854385211aa7
  }

  private prepareDataModel(value: ImportExcelResponseData) {
    const options: IOption[] = value.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field,
        options,
        selected: value.mappings.mappingInfo[field][0].columnNumber.toString()
      }));
  }
}
