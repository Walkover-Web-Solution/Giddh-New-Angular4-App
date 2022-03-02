import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThermalComponent } from './thermal-pdf.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const THERMAL_ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: ThermalComponent
    },
];

@NgModule({
    declarations: [
        ThermalComponent,
    ],
    imports: [
        RouterModule.forChild(THERMAL_ROUTES),
        FormsModule,
        CommonModule
    ],
    exports: [
        RouterModule ,
        CommonModule       
    ],
    providers: []
})
export class ThermalRoutingModule {
}
