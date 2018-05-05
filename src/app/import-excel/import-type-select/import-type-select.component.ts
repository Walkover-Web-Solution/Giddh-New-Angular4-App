import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';

@Component({
  selector: 'import-type-select',  // <home></home>
  styleUrls: ['./import-type-select.component.scss'],
  templateUrl: './import-type-select.component.html'
})

export class ImportTypeSelectComponent implements OnInit, OnDestroy, AfterViewInit {

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
