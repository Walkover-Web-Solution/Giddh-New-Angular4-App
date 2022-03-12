import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GiddhLoaderComponent } from './giddh-loader/giddh-loader.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
      GiddhLoaderComponent
    ],
    exports: [
      GiddhLoaderComponent
    ],
})
export class UiGiddhLoaderModule {}
