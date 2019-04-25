import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxControlComponent } from './tax-control.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { VirtualScrollModule }  from 'apps/web-giddh/src/app/theme/ng-virtual-select/virtual-scroll';

@NgModule({
  imports: [CommonModule, FormsModule, ClickOutsideModule, VirtualScrollModule],
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
