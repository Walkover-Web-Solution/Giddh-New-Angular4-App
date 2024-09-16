import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GocardlessCallBackComponent } from './gocardless-callback.component';

@NgModule({
    imports: [
        MatButtonModule,
        CommonModule
    ],
    exports: [GocardlessCallBackComponent
    ],
    declarations: [
        GocardlessCallBackComponent
    ]
})
export class GocardlessCallBackModule { }
