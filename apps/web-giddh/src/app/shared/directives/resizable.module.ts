import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableDirective } from './resizable.directive';

/**
 * Handles NgModule functionality
 */
@NgModule({
  imports: [
    CommonModule,
    ResizableDirective
  ],
  exports: [
    ResizableDirective
  ]
})
/**
 * ResizableModule module
 * Implements ResizableModule functionality
 */
export class ResizableModule { }
