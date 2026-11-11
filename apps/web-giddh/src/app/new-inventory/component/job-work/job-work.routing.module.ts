import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateJobWorkComponent } from './create-job-work/create-job-work.component';
import { ListJobWorkComponent } from './list-job-work/list-job-work.component';
import { JobWorkMainComponent } from './main.component';

const routes: Routes = [
    {
        path: '',
        component: JobWorkMainComponent,
        children: [
            {
                path: 'create',
                component: CreateJobWorkComponent
            },
            {
                path: 'edit/:uniqueName',
                component: CreateJobWorkComponent
            },
            {
                path: 'list',
                component: ListJobWorkComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobWorkRoutingModule {
}
