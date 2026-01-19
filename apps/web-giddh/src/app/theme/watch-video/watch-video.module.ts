import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WatchVideoComponent } from './watch-video.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { A11yModule } from '@angular/cdk/a11y';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [WatchVideoComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        A11yModule
    ],
    exports: [
        WatchVideoComponent
    ],
})
/**
 * WatchVideoModule module
 * Implements WatchVideoModule functionality
 */
export class WatchVideoModule {
}
