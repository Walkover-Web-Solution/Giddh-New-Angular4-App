import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { VirtualScrollModule } from '../../theme/ng-virtual-select/virtual-scroll';
import { AVShSelectComponent } from './virtual-list.component';
import { AVAccountListComponent } from './virtual-list-menu.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { KeyboardShortutModule } from '../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VirtualScrollModule,
        ClickOutsideModule,
        ScrollingModule,
        MatListModule,
        KeyboardShortutModule
    ],
    declarations: [
        AVShSelectComponent,
        AVAccountListComponent
    ],
    exports: [AVShSelectComponent]
})

export class AVShSelectModule {
    public static forRoot(): ModuleWithProviders<AVShSelectModule> {
        return {
            ngModule: AVShSelectModule
        };
    }
}
