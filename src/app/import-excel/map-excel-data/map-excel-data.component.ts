import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'map-excel-data',  // <home></home>
  styleUrls: ['./map-excel-data.component.scss'],
  templateUrl: './map-excel-data.component.html'
})

export class MapExcelDataComponent implements OnInit, OnDestroy, AfterViewInit {
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
}
