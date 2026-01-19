import { NgModule } from "@angular/core";
import { TrimPipe } from "./trim.pipe";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [TrimPipe],
    exports: [TrimPipe]
})
/**
 * TrimPipeModule module
 * Implements TrimPipeModule functionality
 */
export class TrimPipeModule {}
