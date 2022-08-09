import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VirtualScrollModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/virtual-scroll';
import { ClickOutsideModule } from 'ng-click-outside';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { TaxControlComponent } from './tax-control.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [CommonModule, FormsModule, ClickOutsideModule, VirtualScrollModule, NgxMaskModule, TooltipModule, MatMenuModule, MatButtonModule, MatCheckboxModule],
    declarations: [TaxControlComponent],
    exports: [TaxControlComponent]
})

export class TaxControlModule { }
