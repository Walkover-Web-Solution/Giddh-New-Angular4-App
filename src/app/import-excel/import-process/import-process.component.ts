import { Store } from '@ngrx/store';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';

@Component({
  selector: 'import-process',  // <home></home>
  styleUrls: ['./import-process.component.scss'],
  templateUrl: './import-process.component.html'
})

export class ImportProcessComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onSubmit = new EventEmitter();
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
