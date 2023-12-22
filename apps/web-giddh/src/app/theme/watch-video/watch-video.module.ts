import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WatchVideoComponent } from './watch-video.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateDirectiveModule } from '../translate/translate.directive.module';

@NgModule({
    declarations: [WatchVideoComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateDirectiveModule
    ],
    exports: [
        WatchVideoComponent
    ],
})
export class WatchVideoModule {
}
