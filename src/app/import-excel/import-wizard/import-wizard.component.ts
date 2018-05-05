import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';

@Component({
  selector: 'import-wizard',  // <home></home>
  styleUrls: ['./import-wizard.component.scss'],
  templateUrl: './import-wizard.component.html'
})

export class ImportWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  public step: number = 1;

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

  public onNext() {
    this.step++;
  }

  public onBack() {
    this.step--;
  }
}
