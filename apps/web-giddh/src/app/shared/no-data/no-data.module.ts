import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NoDataComponent } from "./no-data.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [NoDataComponent],
    imports: [CommonModule],
    exports: [NoDataComponent]
})
/**
 * NoDataModule module
 * Implements NoDataModule functionality
 */
export class NoDataModule {}
