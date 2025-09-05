import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from 'apps/web-giddh/src/app/shared/shared.module';
import { QuickAccountComponent } from './quickAccount.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        SharedModule,
        MatTooltipModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        })
    ],
    declarations: [QuickAccountComponent]
})

export class QuickAccountModule { }
