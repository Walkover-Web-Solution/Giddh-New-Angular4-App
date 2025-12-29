import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableDirective } from './resizable.directive';

@NgModule({
  declarations: [
    ResizableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ResizableDirective
  ]
})
export class ResizableModule { }
