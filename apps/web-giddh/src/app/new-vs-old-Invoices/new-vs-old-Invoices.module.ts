import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, ModalModule, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';
import { NewVsOldInvoicesRoutingModule } from './new-vs-old-Invoices.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

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
        LaddaModule,
        ShSelectModule,
        TabsModule,
        BsDropdownModule,
        TooltipModule,
        SharedModule,
        SelectModule.forRoot(),
        ModalModule,
        PaginationModule
    ],
    providers: []
})

export class NewVsOldInvoicesModule {

}
