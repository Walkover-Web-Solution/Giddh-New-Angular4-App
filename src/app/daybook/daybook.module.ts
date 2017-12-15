import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DaybookRoutingModule } from './daybook.routing.module';
import { DaybookComponent } from './daybook.component';

@NgModule({
  declarations: [DaybookComponent],
  providers: [],
  imports: [CommonModule, FormsModule, DaybookRoutingModule],
})
export class DaybookModule {
}
