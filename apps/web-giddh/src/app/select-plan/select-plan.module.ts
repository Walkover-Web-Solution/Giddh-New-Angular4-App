import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';

import { LayoutModule } from '../shared/layout/layout.module';
import { SelectPlanComponent } from './select-plan.component';

const routes: Array<Route> = [{
    path: '', pathMatch: 'full', component: SelectPlanComponent
}];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        LayoutModule,
        CommonModule,
        LaddaModule,
        ReactiveFormsModule
    ],
    exports: [RouterModule],
    declarations: [SelectPlanComponent]
})
export class SelectPlanModule {}