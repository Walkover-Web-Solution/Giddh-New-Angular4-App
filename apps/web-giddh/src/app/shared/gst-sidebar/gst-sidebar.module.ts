import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GstrSidebarComponent } from './gst-sidebar.component';

@NgModule({
    declarations: [GstrSidebarComponent],
    imports: [
        RouterModule

    ],
    exports: [GstrSidebarComponent]
})
export class GstrSidebarModule {
}
