import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';
import { SelectDropdownComponent } from './select-dropdown.component';

export * from './option.interface';
export * from './select.component';

@NgModule({
    declarations: [
        SelectComponent,
        SelectDropdownComponent
    ],
    exports: [
        SelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class SelectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SelectModule,
            providers: []
        };
    }
}
