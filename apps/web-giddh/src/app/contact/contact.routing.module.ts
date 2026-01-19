import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactPreviewComponent } from './preview/preview.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                redirectTo: 'customer',
                pathMatch: 'full'
            },
            { path: ':type', component: ContactComponent },
            { path: ':type/:accountUniqueName', component: ContactPreviewComponent },
        ])
    ],
    exports: [RouterModule]
})
/**
 * ContactRoutingModule module
 * Implements ContactRoutingModule functionality
 */
export class ContactRoutingModule {
}
