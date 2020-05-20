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



    .import-card, .export-card {
      padding: 40px 67px;
      margin: 0 15px;
      border-radius: 2px;
      border: 1px solid $gainsboro;
      background: #fafafa;
      width: 330px;
      text-align: center;
      transition: .5s all ease;
    }

    .selected {
      /*box-shadow: 0px 2px 18px #0095ff70 !important;
      border-color: #84b1ff !important;*/
    }

    .import-export-icon {
      width: 90px;
      height: 90px;
      background: #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 90px;
      font-size: 34px;
      color: #666666;
      margin: 0 auto 20px;
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
        // this._cdr.detectChanges();
    }

    public back() {
        this.isFirstScreen = true;
    }
}
