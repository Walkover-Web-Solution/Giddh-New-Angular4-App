import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { SelectTableColumnComponent } from './select-table-column.component';

@NgModule({
    declarations: [SelectTableColumnComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule
    ],
    exports: [SelectTableColumnComponent]
})
export class SelectTableColumnModule { }
