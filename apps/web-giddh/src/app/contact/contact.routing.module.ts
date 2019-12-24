import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ContactComponent } from './contact.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ContactComponent,
                redirectTo: 'customer',
                pathMatch: 'full'
            },
            { path: ':type', component: ContactComponent },
        ])
    ],
    exports: [RouterModule]
})
export class ContactRoutingModule {
}
