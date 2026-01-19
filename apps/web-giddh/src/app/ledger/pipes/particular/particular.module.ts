import { NgModule } from '@angular/core';
import { ParticularPipe } from './particular.pipe';

/**
 * Particular pipe module
 *
 * @export
 * @class ParticularPipeModule
 */
@NgModule({
    declarations: [ParticularPipe],
    exports: [ParticularPipe]
})
/**
 * ParticularPipeModule module
 * Implements ParticularPipeModule functionality
 */
export class ParticularPipeModule {}
