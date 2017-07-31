import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ManufacturingComponent
  ],
  exports: [],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ManufacturingModule {
}
