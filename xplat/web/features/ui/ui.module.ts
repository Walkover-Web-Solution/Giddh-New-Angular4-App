import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// libs
import { UISharedModule } from '@giddh-workspaces/features';

const MODULES = [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UISharedModule
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [...MODULES],
    exports: [...MODULES]
})
/**
 * UIModule module
 * Implements UIModule functionality
 */
export class UIModule { }
