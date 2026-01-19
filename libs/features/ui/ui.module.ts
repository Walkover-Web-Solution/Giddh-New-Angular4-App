import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PIPES } from './pipes';

const MODULES = [TranslateModule];

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [...MODULES],
    declarations: [...PIPES],
    exports: [...MODULES, ...PIPES]
})
/**
 * UISharedModule module
 * Implements UISharedModule functionality
 */
export class UISharedModule { }
