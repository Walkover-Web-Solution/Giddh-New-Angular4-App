import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { VirtualScrollModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/virtual-scroll';
import { ClickOutsideModule } from 'ng-click-outside';

import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { TaxControlComponent } from './tax-control.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [CommonModule, FormsModule, ClickOutsideModule, VirtualScrollModule, NgxMaskModule.forRoot(),MatMenuModule, MatButtonModule, MatCheckboxModule,MatInputModule, MatFormFieldModule],
    declarations: [TaxControlComponent],
    exports: [TaxControlComponent]
})

export class TaxControlModule { }
