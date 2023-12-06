import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WatchVideoComponent } from './watch-video.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [WatchVideoComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [
        WatchVideoComponent
    ],
})
export class WatchVideoModule {
}
