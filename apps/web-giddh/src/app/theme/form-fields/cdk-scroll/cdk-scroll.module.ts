import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CDKScrollComponent } from "./cdk-scroll.component";
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
    declarations: [CDKScrollComponent],
    imports: [CommonModule, ScrollingModule],
    exports: [CDKScrollComponent],
})
export class CDKScrollModule {}
