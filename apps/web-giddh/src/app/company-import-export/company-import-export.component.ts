import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
selector: 'company-import-export-component',
    templateUrl: 'company-import-export.component.html',
    styleUrls: [`company-import-export.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

/**
 * CompanyImportExportComponent component
 * Handles companyimportexport functionality and user interactions
 */
export class CompanyImportExportComponent {
    public mode: 'import' | 'export' = 'export';
    public isFirstScreen: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }

    /**
     * Sets activetab value
     */
    public setActiveTab(mode: 'import' | 'export') {
        this.mode = mode;
        this.isFirstScreen = false;
    }

    /**
     * Handles back functionality
     */
    public back() {
        this.isFirstScreen = true;
    }
}
