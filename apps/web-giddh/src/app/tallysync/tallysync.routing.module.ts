import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { TallysyncComponent } from './tallysync.component';


const _ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: TallysyncComponent
    },
    { path: 'tallysync', canActivate: [NeedsAuthentication] },
];

@NgModule({
    imports: [
        RouterModule.forChild(_ROUTES),
    ],
    exports: [
        RouterModule
    ]
})
export class TallysyncRoutingModule {
}
