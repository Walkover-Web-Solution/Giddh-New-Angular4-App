import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'company-import-export-component',
    templateUrl: 'company-import-export.component.html',
    styleUrls: [`company-import-export.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompanyImportExportComponent {
    public mode: 'import' | 'export' = 'export';
    public isFirstScreen: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor() {

    }

    public setActiveTab(mode: 'import' | 'export') {
        this.mode = mode;
        this.isFirstScreen = false;
    }

    public back() {
        this.isFirstScreen = true;
    }
}