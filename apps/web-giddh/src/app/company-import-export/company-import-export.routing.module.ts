import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { CompanyImportExportComponent } from './company-import-export.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: CompanyImportExportComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * CompanyImportExportRoutingModule module
 * Implements CompanyImportExportRoutingModule functionality
 */
export class CompanyImportExportRoutingModule {
}
