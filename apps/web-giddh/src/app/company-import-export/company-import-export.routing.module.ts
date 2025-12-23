import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { CompanyImportExportComponent } from './company-import-export.component';

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
export class CompanyImportExportRoutingModule {
}
