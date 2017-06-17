import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar/dist';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LayoutComponent, HeaderComponent, FooterComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
