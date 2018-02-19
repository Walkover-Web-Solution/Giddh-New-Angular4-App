import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AVAccountListComponent } from './sh-select-menu.component';
import { AVShSelectComponent } from './sh-select.component';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { VirtualScrollModule } from '../../theme/ng-virtual-select/virtual-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VirtualScrollModule,
    ClickOutsideModule
  ],
  declarations: [
    AVShSelectComponent,
    AVAccountListComponent
  ],
  exports: [AVShSelectComponent]
})

export class AVShSelectModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AVShSelectModule
    };
  }
}
