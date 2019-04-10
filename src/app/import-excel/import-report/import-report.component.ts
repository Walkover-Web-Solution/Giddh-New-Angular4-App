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
 

  // public downloadAttachedSheet(fileName: string, e: Event) {
  //  e.stopPropagation();
  //  var fileName = "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 "
  //  let blob = atob(fileName);
  //  return saveAs(blob, "pdf");
  // }


  showPdf(base64str) {
     
    const linkSource = 'data:application/xlsx;base64,' + base64str;
    const downloadLink = document.createElement("a");
    const fileName = "error-sheet.xlsx";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

}
