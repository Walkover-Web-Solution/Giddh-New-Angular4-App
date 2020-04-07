import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AllModulesComponent } from './all-modules.component';
import { AllModulesRoutingModule } from './all-modules.routing.module';

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
        AllModulesRoutingModule
    ],
})
export class AllModulesModule {
}
