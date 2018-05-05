import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelData, MapHeader } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-select/option.interface';

@Component({
  selector: 'map-excel-data',  // <home></home>
  styleUrls: ['./map-excel-data.component.scss'],
  templateUrl: './map-excel-data.component.html'
})

export class MapExcelDataComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public importData: ImportExcelData;
  @Output() public onNext = new EventEmitter();
  @Output() public onBack = new EventEmitter();

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

  public getMappings() {
    return Object.keys(this.importData.mappings.mappingInfo);
  }

  public getOptionsFromMap(maps: MapHeader[]): IOption[] {
    return maps.map(p => ({value: p.columnHeader, label: p.columnHeader}));
  }
}
