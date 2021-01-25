import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MfEditComponent } from './edit/mf.edit.component';
import { DeleteManufacturingConfirmationModelComponent } from './edit/modal/confirmation.model.component';
import { ManufacturingComponent } from './manufacturing.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { SharedModule } from '../shared/shared.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { MfReportComponent } from './report/mf.report.component';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';

@NgModule({
    declarations: [
        ManufacturingComponent,
        MfEditComponent,
        MfReportComponent,
        DeleteManufacturingConfirmationModelComponent
    ],
    exports: [
        RouterModule,
        MfReportComponent
    ],
    providers: [],
    imports: [
        ManufacturingRoutingModule,
        DatepickerWrapperModule,
        SharedModule,
        HamburgerMenuComponentModule,
        RouterModule
    ],
})
export class ManufacturingModule {
}
