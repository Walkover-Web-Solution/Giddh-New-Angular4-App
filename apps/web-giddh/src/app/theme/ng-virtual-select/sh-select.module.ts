import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VirtualScrollModule } from './virtual-scroll';
import { ShSelectMenuComponent } from './sh-select-menu.component';
import { ShSelectComponent } from './sh-select.component';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VirtualScrollModule,
        ClickOutsideModule
    ],
    declarations: [
        ShSelectComponent,
        ShSelectMenuComponent
    ],
    exports: [ShSelectComponent]
})

export class ShSelectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ShSelectModule
        };
    }
}
