import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GoToBranchComponent } from './go-to-branch.component';

@NgModule({
    declarations: [GoToBranchComponent],
    imports: [MatButtonModule],
    exports: [GoToBranchComponent]
})
export class GoToBranchModule {}
