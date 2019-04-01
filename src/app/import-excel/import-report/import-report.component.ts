import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelStatusPaginatedResponse } from '../../models/api-models/import-excel';
import { of, ReplaySubject } from 'rxjs';
import { ImportExcelRequestStates } from '../../store/import-excel/import-excel.reducer';
import { catchError, takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageChangedEvent } from 'ngx-bootstrap';
import { ImportExcelService } from '../../services/import-excel.service';
import { base64ToBlob } from '../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'import-report',
  templateUrl: './import-report.component.html',
  styleUrls: [`./import-report.component.scss`]
})

export class ImportReportComponent implements OnInit, OnDestroy {
  public importStatusResponse: ImportExcelStatusPaginatedResponse;
  public importRequestStatus: ImportExcelRequestStates;
  public importPaginatedRequest: CommonPaginatedRequest = new CommonPaginatedRequest();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _router: Router, private store: Store<AppState>, private _importActions: ImportExcelActions,
              private _importExcelService: ImportExcelService, private _toaster: ToasterService) {
    this.store.pipe(select(s => s.importExcel.importStatus), takeUntil(this.destroyed$)).subscribe(s => {
      this.importStatusResponse = s;
    });

    this.store.pipe(select(s => s.importExcel.requestState), takeUntil(this.destroyed$)).subscribe(s => {
      this.importRequestStatus = s;
    });

    this.importPaginatedRequest.page = 1;
    this.importPaginatedRequest.count = 10;
  }

  public ngOnInit() {
    this.getStatus();
  }

  public importFiles() {
    this._router.navigate(['pages', 'import']);
  }

  public pageChanged(event: PageChangedEvent) {
    this.importPaginatedRequest.page = event.page;
    this.getStatus();
  }

  public getStatus() {
    this.store.dispatch(this._importActions.ImportStatusRequest(this.importPaginatedRequest));
  }

  public downloadItem(requestId: string) {
    this._importExcelService.importStatusDetails(requestId).pipe(
      catchError(err => {
        if (err && err.error) {
          this._toaster.errorToast(err.error.message);
        }
        return of(err);
      })
    ).subscribe(s => {
      if (s && s.status === 'success') {
        let blob = base64ToBlob(s.body.fileBase64, 'application/vnd.ms-excel', 512);
        return saveAs(blob, s.body.fileName);
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
