import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllGiddhItemComponent } from './all-item.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([ { path: '',
        component: AllGiddhItemComponent },
        { path: 'giddh-all-items',
        component: AllGiddhItemComponent }
    
        ])
    ],

    exports: [
        RouterModule
    ]


})
/**
 * AllItemRoutingModule module
 * Implements AllItemRoutingModule functionality
 */
export class AllItemRoutingModule {
}
