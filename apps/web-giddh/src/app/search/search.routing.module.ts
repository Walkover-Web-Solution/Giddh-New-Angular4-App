import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SearchComponent } from './search.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SearchComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class SearchRoutingModule {
}
