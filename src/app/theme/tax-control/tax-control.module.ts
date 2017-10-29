import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxControlComponent } from './tax-control.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule, FormsModule],
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
