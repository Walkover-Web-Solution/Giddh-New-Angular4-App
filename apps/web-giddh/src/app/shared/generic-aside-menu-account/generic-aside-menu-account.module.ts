import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { GenericAsideMenuAccountComponent } from './generic.aside.menu.account.component';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [GenericAsideMenuAccountComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        CommonModule,
        LaddaModule,
        SelectModule,
        SharedModule
    ],
    exports: [GenericAsideMenuAccountComponent]
})
export class GenericAsideMenuAccountModule {
}
