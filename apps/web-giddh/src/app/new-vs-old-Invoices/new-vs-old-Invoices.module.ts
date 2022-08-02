import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';
import { NewVsOldInvoicesRoutingModule } from './new-vs-old-Invoices.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';

@NgModule({
    declarations: [
        NewVsOldInvoicesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ElementViewChildModule,
        NewVsOldInvoicesRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        SharedModule,
        SelectModule.forRoot(),
        ModalModule,
        PaginationModule.forRoot(),
        CurrencyModule
    ],
    providers: []
})

export class NewVsOldInvoicesModule {

}
