import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { VirtualScrollModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/virtual-scroll';
import { ClickOutsideModule } from 'ng-click-outside';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { TaxControlComponent } from './tax-control.component';

@NgModule({
    imports: [CommonModule, FormsModule, ClickOutsideModule, VirtualScrollModule, NgxMaskModule, TooltipModule.forRoot(),MatMenuModule, MatButtonModule, MatCheckboxModule],
    declarations: [TaxControlComponent],
    exports: [TaxControlComponent]
})

export class TaxControlModule { }
