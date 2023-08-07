import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { CommandKComponent, ScrollComponent } from '.';
import { CommandKService } from '../../services/commandk.service';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY: true
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        PerfectScrollbarModule,
        TranslateDirectiveModule,
        MatListModule,
        MatDialogModule,
        MatButtonModule
    ],
    declarations: [
        CommandKComponent,
        ScrollComponent
    ],
    exports: [
        CommandKComponent,
        ScrollComponent
    ],
    providers: [
        CommandKService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})

export class CommandKModule {
    public static forRoot(): ModuleWithProviders<CommandKModule> {
        return {
            ngModule: CommandKModule
        };
    }
}
