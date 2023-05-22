import { NgModule } from '@angular/core';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { TallysyncRoutingModule } from './tallysync.routing.module';
import { SharedModule } from './../shared/shared.module';
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
