import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkScrollComponent } from './cdk-scroll.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        CommonModule, ScrollingModule
    ],
    declarations: [CdkScrollComponent],
    exports: [ScrollingModule, CdkScrollComponent]
})
/**
 * CdkScrollModule module
 * Implements CdkScrollModule functionality
 */
export class CdkScrollModule { }
