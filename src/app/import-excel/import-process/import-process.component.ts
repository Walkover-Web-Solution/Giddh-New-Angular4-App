import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist';
import { sortBy } from '../../lodash-optimized';

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
    this.userHeader = [];
    this._importData = value;

    // prepare table header from mappings.mappedColumn and first sortBy columnNumber
    sortBy(value.mappings, ['columnNumber']).forEach(f => this.userHeader.push(f.mappedColumn));
  }

  @Output() public onSubmit = new EventEmitter<ImportExcelRequestData>();
  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  @Input() public entity: string;
  public config: PerfectScrollbarConfigInterface = {suppressScrollX: false, suppressScrollY: false};
  public options: IOption[];
  public userHeader: string[] = [];
  public importDisable: boolean = true;

  private _importData: ImportExcelRequestData;

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

  public save() {
    const data = {...this.importData.data, items: this.importData.data.items};
    this.onSubmit.emit({...this.importData, data});
  }
}
