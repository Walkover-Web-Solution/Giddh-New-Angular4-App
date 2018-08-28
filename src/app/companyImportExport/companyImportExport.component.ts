import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'company-import-export-component',
  templateUrl: 'company-import-export.component.html',
  styles: [`
    .backup-data {
      padding: 10px 0px;
      border-bottom: 1px solid #6d6d6d;
      font-weight: 500;
      color: black;
    }

    .main-container-import-export {
      height: 70vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .export-card {
      padding: 40px 67px;
      margin-right: 15px;
      box-shadow: 0px 2px 18px gainsboro;
      border-radius: 8px;
      border: 2px solid gray;
    }

    .import-card {
      padding: 40px 67px;
      margin-left: 15px;
      box-shadow: 0px 2px 18px gainsboro;
      border-radius: 8px;
      border: 2px solid gray;
    }

    .selected {
      box-shadow: 0px 2px 18px #0095ff70 !important;
      border-color: #84b1ff !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompanyImportExportComponent implements OnInit {
  public mode: 'import' | 'export' = 'export';
  public isFirstScreen: boolean = true;

  constructor(private _cdr: ChangeDetectorRef) {
    //
  }

  public ngOnInit() {
    //
  }

  public setActiveTab(mode: 'import' | 'export') {
    this.mode = mode;
    this.isFirstScreen = false;
    this._cdr.detectChanges();
  }

  public back() {
    this.isFirstScreen = true;
  }
}
