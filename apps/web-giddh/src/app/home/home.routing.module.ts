import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent }
        ])
    ],
    exports: [RouterModule]
})
/**
 * HomeRoutingModule module
 * Implements HomeRoutingModule functionality
 */
export class HomeRoutingModule {
}
