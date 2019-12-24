import { FileGstR2Component } from './gstR2/gstR2.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilingComponent } from './filing/filing.component';
import { FileGstR1Component } from './gstR1/gstR1.component';
import { NgModule } from '@angular/core';
import { GstComponent } from './gst.component';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const GST_ROUTES: Routes = [
    { path: '', component: GstComponent },
    { path: 'gstR1', component: FileGstR1Component },
    { path: 'gstR2', component: FileGstR2Component },
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
    ],
    exports: [
        RouterModule,
        FormsModule,
        CommonModule,
    ]
})
export class GstRoutingModule { }
