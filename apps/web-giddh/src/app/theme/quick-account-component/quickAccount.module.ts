import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from 'apps/web-giddh/src/app/shared/shared.module';
import { QuickAccountComponent } from './quickAccount.component';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        SharedModule,
        ShSelectModule,
        TooltipModule.forRoot(),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        })
    ],
    declarations: [QuickAccountComponent]
})

export class QuickAccountModule { }
