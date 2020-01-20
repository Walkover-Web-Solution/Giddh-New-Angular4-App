import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VirtualScrollModule } from './virtual-scroll';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { SalesShSelectComponent } from './sh-select.component';
import { SalesShSelectMenuComponent } from './sh-select-menu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VirtualScrollModule,
        ClickOutsideModule
    ],
    declarations: [
        SalesShSelectComponent,
        SalesShSelectMenuComponent
    ],
    exports: [SalesShSelectComponent]
})

export class SalesShSelectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SalesShSelectModule
        };
    }
}
