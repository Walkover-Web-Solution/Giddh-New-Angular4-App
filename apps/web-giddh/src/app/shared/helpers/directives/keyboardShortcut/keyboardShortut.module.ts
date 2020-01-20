import { NgModule } from '@angular/core';
import { KeyboardShortcutDirective } from './keyboardShortcut.directive';
import { NavigationWalkerDirective } from './navigationWalker.directive';
import { NgInitDirective } from './ng-init.directive';

@NgModule({
    imports: [],
    declarations: [
        KeyboardShortcutDirective,
        NavigationWalkerDirective,
        NgInitDirective,
    ],
    exports: [
        KeyboardShortcutDirective,
        NavigationWalkerDirective,
        NgInitDirective,
    ]
})
export class KeyboardShortutModule {
    //
}
