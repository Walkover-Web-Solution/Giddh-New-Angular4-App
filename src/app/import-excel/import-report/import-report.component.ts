import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelStatusPaginatedResponse, ImportExcelStatusResponse } from '../../models/api-models/import-excel';
import { ReplaySubject } from 'rxjs';
import { ImportExcelRequestStates } from '../../store/import-excel/import-excel.reducer';
import { takeUntil } from 'rxjs/operators';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PageChangedEvent } from 'ngx-bootstrap';
import { ImportExcelService } from '../../services/import-excel.service';
import { base64ToBlob } from '../../shared/helpers/helperFunctions';
import { ToasterService } from '../../services/toaster.service';
import { saveAs } from 'file-saver';

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

  public downloadItem(item: ImportExcelStatusResponse) {
    let blob = base64ToBlob(item.fileBase64, 'application/vnd.ms-excel', 512);
    return saveAs(blob, item.fileName);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
 
  }
  displayBlock = true;

  // importDatas = [
  //   {
  //     DateTime: "05-02-2019, 11:22:22",
  //     fileName: "Accounts_Jan_2019.Xls" ,
  //     submittedBy: "Shubhendra Agrawal" ,
  //     status : "In-Progress 120/290 Processed9:12",
  //     download : " - "
  //   },
  //   {
  //     DateTime: "07-02-2019, 11:22:22",
  //     fileName: "Accounts_Jan_2019.Xls" ,
  //     submittedBy: "Shubhendra Agrawal" ,
  //     status : "In-Progress 120/290 Processed9:12",
  //     download : " - "
  //   },
  //   {
  //     DateTime: "05-02-2019, 11:22:22",
  //     fileName: "Accounts_Jan_2019.Xls" ,
  //     submittedBy: "Shubhendra Agrawal" ,
  //     status : "In-Progress 120/290 Processed9:12",
  //     download : " - "
  //   },
  //   {
  //     DateTime: "05-02-2019, 11:22:22",
  //     fileName: "Accounts_Jan_2019.Xls" ,
  //     submittedBy: "Shubhendra Agrawal" ,
  //     status : "In-Progress 120/290 Processed9:12",
  //     download : " - "
  //   }
  
     
  //   ]
   // public showProcess = ' done ';
 


}
