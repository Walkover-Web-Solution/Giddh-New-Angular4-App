import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment/moment';
import * as _ from '../lodash-optimized';
import { Router } from '@angular/router';

@Component({
  selector: 'import-excel',  // <home></home>
  styleUrls: ['./import-excel.component.scss'],
  templateUrl: './import-excel.component.html'
})

export class ImportComponent implements OnInit, OnDestroy, AfterViewInit {

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
