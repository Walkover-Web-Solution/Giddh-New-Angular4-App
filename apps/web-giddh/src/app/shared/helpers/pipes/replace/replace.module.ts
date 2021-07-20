import { NgModule } from "@angular/core";
import { ReplacePipe } from "./replace.pipe";

/**
 * Replace pipe module
 *
 * @export
 * @class ReplacePipeModule
 */
@NgModule({
    declarations: [ReplacePipe],
    exports: [ReplacePipe]
})
export class ReplacePipeModule {}
