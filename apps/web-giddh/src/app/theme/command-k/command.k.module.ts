import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommandKComponent } from '.';
import { CommandKService } from '../../services/commandk.service';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        ScrollingModule,
        TranslateDirectiveModule,
        MatListModule,
        MatDialogModule,
        MatButtonModule
    ],
    declarations: [
        CommandKComponent
    ],
    exports: [
        CommandKComponent
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
