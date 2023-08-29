import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { CommandKComponent, ScrollComponent } from '.';
import { CommandKService } from '../../services/commandk.service';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        TranslateDirectiveModule
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
    ]
})

export class CommandKModule {
    public static forRoot(): ModuleWithProviders<CommandKModule> {
        return {
            ngModule: CommandKModule
        };
    }
}
