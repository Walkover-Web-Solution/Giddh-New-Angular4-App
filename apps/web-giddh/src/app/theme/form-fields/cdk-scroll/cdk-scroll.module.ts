import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkScrollComponent } from './cdk-scroll.component';

@NgModule({
  imports: [
    CommonModule, ScrollingModule
  ],
  declarations: [CdkScrollComponent],
  exports: [CdkScrollComponent],
})
export class CdkScrollModule { }
