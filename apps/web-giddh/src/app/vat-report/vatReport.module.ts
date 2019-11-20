import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VatReportRoutingModule } from './vatReport.routing.module';
import { VatReportComponent } from './vatReport.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import {CurrencyModule} from "../shared/helpers/pipes/currencyPipe/currencyType.module";

@NgModule({
    declarations: [
        VatReportComponent
    ],
    providers: [

    ],
    imports: [
        VatReportRoutingModule,
        TabsModule,
        CommonModule,
        TooltipModule,
        BsDatepickerModule,
        CurrencyModule
    ],
    exports: [
        VatReportRoutingModule
    ]
})
export class VarReportModule {
}