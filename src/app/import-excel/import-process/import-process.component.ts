import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelRequestData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist';
import { ToasterService } from 'app/services/toaster.service';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}

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
    this.userHeader = [];
    this._importData = value;

    value.headers.items.forEach(f => this.userHeader.push(f.columnHeader));
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

  constructor(private store: Store<AppState>, private _toaster: ToasterService) {
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
