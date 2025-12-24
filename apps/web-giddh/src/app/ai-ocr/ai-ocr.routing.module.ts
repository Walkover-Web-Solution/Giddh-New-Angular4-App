import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiOcrComponent } from './ai-ocr.component';

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

export class AiOcrRoutingModule {

}