import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AllModulesComponent } from './all-modules.component';
import { AllModulesRoutingModule } from './all-modules.routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';

@NgModule({
    declarations: [
        AllModulesComponent,
    ],
    exports: [
        AllModulesComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        AllModulesRoutingModule,
        ModalModule,
        ElementViewChildModule,
        SharedModule
    ],
})
export class AllModulesModule {
}
