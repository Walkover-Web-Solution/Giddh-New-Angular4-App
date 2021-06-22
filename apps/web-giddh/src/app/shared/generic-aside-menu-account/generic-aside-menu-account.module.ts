import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { SharedModule } from '../shared.module';
import { GenericAsideMenuAccountComponent } from './generic.aside.menu.account.component';

@NgModule({
    declarations: [GenericAsideMenuAccountComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LaddaModule,
        SelectModule,
        SharedModule
    ],
    exports: [GenericAsideMenuAccountComponent]
})
export class GenericAsideMenuAccountModule {
}
