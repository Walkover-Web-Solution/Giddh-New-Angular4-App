import { NgModule } from "@angular/core";
import { ReplaceAllPipe } from "./replaceAll.pipe";

/**
 * ReplaceAll pipe module
 *
 * @export
 * @class ReplaceAllPipeModule
 */
@NgModule({
    declarations: [ReplaceAllPipe],
    exports: [ReplaceAllPipe]
})
export class ReplaceAllPipeModule {}
