import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilingComponent } from './filing/filing.component';
import { NgModule } from '@angular/core';
import { GstComponent } from './gst.component';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';

const GST_ROUTES: Routes = [
    { path: '', component: GstComponent },
    { path: 'gstR3', component: FileGstR3Component },
    {
        path: 'filing-return', component: FilingComponent,
        children: [
            { path: '', component: FilingComponent },
            { path: 'transaction', component: FilingComponent },
        ]
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(GST_ROUTES),
        CurrencyModule,
    ],
    exports: [
        RouterModule,
        FormsModule,
        CommonModule,
    ]
})
export class GstRoutingModule { }
