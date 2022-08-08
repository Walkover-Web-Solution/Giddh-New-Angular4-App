import { ShSelectModule } from './../theme/ng-virtual-select/sh-select.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TallysyncComponent } from './tallysync.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InprogressComponent } from './inprogress/inprogress.component';
import { CompletedComponent } from './completed/completed.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { InvoiceUiDataService } from '../services/invoice.ui.data.service';
import { SelectModule } from '../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { ElementViewChildModule } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { DecimalDigitsModule } from 'apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TextMaskModule } from 'angular2-text-mask';
import { Daterangepicker } from 'apps/web-giddh/src/app/theme/ng2-daterangepicker/daterangepicker.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { TallySyncService } from "../services/tally-sync.service";
import { SharedModule } from '../shared/shared.module';

const _ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: TallysyncComponent
    },
    { path: 'tallysync', canActivate: [NeedsAuthentication] },
];

@NgModule({
    declarations: [
        TallysyncComponent,
        InprogressComponent,
        CompletedComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TabsModule.forRoot(),
        ReactiveFormsModule,
        ModalModule,
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        RouterModule.forChild(_ROUTES),
        KeyboardShortutModule,
        BsDatepickerModule.forRoot(),
        CollapseModule.forRoot(),
        NgxUploaderModule,
        SelectModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        DatepickerModule,
        BsDropdownModule.forRoot(),
        SalesShSelectModule,
        TextMaskModule,
        Daterangepicker,
        SharedModule
    ],
    exports: [
        RouterModule,
        TooltipModule
    ],
    entryComponents: [TallysyncComponent],
    providers: [InvoiceUiDataService, TallySyncService]
})
export class TallysyncRoutingModule {
}
