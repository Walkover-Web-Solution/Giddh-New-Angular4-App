import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxControlComponent } from './tax-control.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [CommonModule, FormsModule, ClickOutsideModule],
  declarations: [TaxControlComponent],
  exports: [TaxControlComponent]
})

export class TaxControlModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TaxControlModule,
      providers: []
    };
  }
}
