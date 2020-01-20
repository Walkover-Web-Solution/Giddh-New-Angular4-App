import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

import { DataListComponent, ScrollComponent, } from '.';
import { UniversalSearchService, WindowRefService } from './service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule
    ],
    declarations: [
        DataListComponent,
        ScrollComponent
    ],
    exports: [
        DataListComponent,
        ScrollComponent
    ],
    entryComponents: [
        DataListComponent,
        ScrollComponent
    ],
    providers: [
        WindowRefService,
        UniversalSearchService
    ]
})

export class UniversalListModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: UniversalListModule
        };
    }
}
