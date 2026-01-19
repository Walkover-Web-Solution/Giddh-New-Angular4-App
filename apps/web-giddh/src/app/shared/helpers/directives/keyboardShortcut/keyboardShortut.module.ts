import { NgModule } from '@angular/core';
import { KeyboardShortcutDirective } from './keyboardShortcut.directive';
import { NavigationWalkerDirective } from './navigationWalker.directive';
import { NgInitDirective } from './ng-init.directive';

/**
 * Handles NgModule functionality
 */
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
/**
 * KeyboardShortutModule module
 * Implements KeyboardShortutModule functionality
 */
export class KeyboardShortutModule {
    //
}
