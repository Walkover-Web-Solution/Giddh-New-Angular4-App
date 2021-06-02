import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { TallysyncRoutingModule } from './tallysync.routing.module';

@NgModule({
    declarations: [],
    imports: [
        TallysyncRoutingModule,
        DigitsOnlyModule,
        SharedModule
    ],
    exports: [
        TallysyncRoutingModule
    ]
})
export class TallysyncModule {
}
