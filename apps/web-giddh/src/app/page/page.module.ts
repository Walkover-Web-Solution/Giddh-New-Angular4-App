import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoaderModule } from '../loader/loader.module';
import { HeaderModule } from '../shared/header/header.module';
import { LayoutModule } from '../shared/layout/layout.module';
import { PageComponent } from './page.component';

const routes: Array<Route> = [{
    path: '', component: PageComponent
}]
@NgModule({
    declarations: [PageComponent],
    imports: [
        HeaderModule,
        LoaderModule,
        LayoutModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule, PageComponent]
})
export class PageModule {

}