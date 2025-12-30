import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableDirective } from './resizable.directive';

@NgModule({
  imports: [
    CommonModule,
    ResizableDirective
  ],
  exports: [
    ResizableDirective
  ]
})
export class ResizableModule { }
