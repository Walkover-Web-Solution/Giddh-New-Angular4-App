import { Store } from '@ngrx/store';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';

@Component({
  selector: 'map-excel-data',  // <home></home>
  styleUrls: ['./map-excel-data.component.scss'],
  templateUrl: './map-excel-data.component.html'
})

export class MapExcelDataComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onNext = new EventEmitter();
  @Output() public onBack = new EventEmitter();

  constructor(
    private store: Store<AppState>,
    private _router: Router,
  ) {
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
