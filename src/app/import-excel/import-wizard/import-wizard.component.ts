import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';

@Component({
  selector: 'import-wizard',  // <home></home>
  styleUrls: ['./import-wizard.component.scss'],
  templateUrl: './import-wizard.component.html'
})

export class ImportWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  public step: number = 1;
  public entity: string;

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _importActions: ImportExcelActions
  ) {
  }

  public ngOnInit() {
    this._activatedRoute.url.subscribe(p => this.entity = p[0].path);
  }

  public ngAfterViewInit(): void {
    //
  }

  public ngOnDestroy() {
    //
  }

  public onFileUpload(file: File) {
    this.store.dispatch(this._importActions.uploadFileRequest(this.entity, file));
    this.step++;
  }

  public onNext() {
    this.step++;
  }

  public onBack() {
    this.step--;
  }
}
