import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ImportExcelData } from '../../models/api-models/import-excel';

@Component({
  selector: 'import-process',  // <home></home>
  styleUrls: ['./import-process.component.scss'],
  templateUrl: './import-process.component.html'
})

export class ImportProcessComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onSubmit = new EventEmitter();
  @Output() public onBack = new EventEmitter();
  @Input() public isLoading: boolean;
  @Input() public importData: ImportExcelData;

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
}
