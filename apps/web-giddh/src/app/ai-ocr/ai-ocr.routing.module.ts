import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiOcrComponent } from './ai-ocr.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'income', pathMatch: 'full' },
            { path: 'ai-ocr', redirectTo: 'income', pathMatch: 'full' },
            { path: ':type', component: AiOcrComponent },
        ])
    ],
    exports: [RouterModule]
})

/**
 * AiOcrRoutingModule module
 * Implements AiOcrRoutingModule functionality
 */
export class AiOcrRoutingModule {

}
