import { NgModule } from "@angular/core";
import { TrimPipe } from "./trim.pipe";

@NgModule({
    declarations: [TrimPipe],
    exports: [TrimPipe]
})
export class TrimPipeModule {}
