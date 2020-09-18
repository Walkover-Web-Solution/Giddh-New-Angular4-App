import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'company-import-export-component',
    templateUrl: 'company-import-export.component.html',
    styleUrls: [`company-import-export.component.scss`],
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
