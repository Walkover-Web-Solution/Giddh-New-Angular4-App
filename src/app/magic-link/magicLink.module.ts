import { ShSelectModule } from './../theme/ng-virtual-select/sh-select.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../theme/ng-select/ng-select';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { MagicLinkComponent } from 'app/magic-link/magic-link.component';
import { FilterPipe } from 'app/magic-link/search.pipe';
import { Daterangepicker } from 'app/theme/ng2-daterangepicker/daterangepicker.module';
import { TooltipModule } from 'ngx-bootstrap';
import { MagicLinkService } from 'app/services/magic-link.service';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    MagicLinkComponent,
    FilterPipe
  ],
  exports: [RouterModule],
  providers: [MagicLinkService],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    DatepickerModule,
    BsDatepickerModule.forRoot(),
    ModalModule,
    LaddaModule,
    DecimalDigitsModule,
    ClickOutsideModule,
    Daterangepicker,
    TooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: MagicLinkComponent
      }
    ])
  ],
})
export class MagicLinkModule {
}
