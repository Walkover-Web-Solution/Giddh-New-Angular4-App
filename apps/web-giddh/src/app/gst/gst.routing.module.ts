import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilingComponent } from './filing/filing.component';
import { NgModule } from '@angular/core';
import { GstComponent } from './gst.component';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { UnitMappingComponent } from './unit-mapping/unit-mapping.component';
import { FilingStatusComponent } from './filing-status/filing-status.component';
import { GstSettingComponent } from './gst-setting/gst-setting.component';

const GST_ROUTES: Routes = [
    { path: '', component: GstComponent },
    { path: 'gstR3', component: FileGstR3Component },
    {
        path: 'filing-return', component: FilingComponent,
        children: [
            { path: '', component: FilingComponent },
            { path: 'transaction', component: FilingComponent },
            { path: 'hsn-summary', component: FilingComponent },
        ]
    },
    { path: 'unit-mapping', component: UnitMappingComponent },
    { path: 'gst-setting', component: GstSettingComponent },
    { path: 'filing-status', component: FilingStatusComponent }
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(GST_ROUTES),
        GiddhNumberFormatModule
    ],
    exports: [
        RouterModule,
        FormsModule,
        CommonModule,
    ]
})
/**
 * GstRoutingModule module
 * Implements GstRoutingModule functionality
 */
export class GstRoutingModule { }
