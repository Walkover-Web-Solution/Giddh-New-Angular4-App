import { NgModule } from '@angular/core';
import { ThermalPrintModule } from 'ng-thermal-print';
import { ThermalRoutingModule } from './thermal-pdf.routing.module';

@NgModule({
    declarations: [],
    imports: [
        ThermalRoutingModule,
        ThermalPrintModule
    ],
    exports: [
        ThermalRoutingModule
    ]
})
export class ThermalModule {
}
