import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageComponent } from './page.component';
// COMMENTED OUT - MISSING: import { HeaderModule } from "../shared/header/header.module";

@NgModule({
    declarations: [
        PageComponent
    ],
    imports: [
        CommonModule,
        RouterModule
        // COMMENTED OUT - MISSING: HeaderModule,
    ],
    exports: [
        PageComponent
    ]
})
export class PageModule { }