import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../giddh-page-loader/giddh-page-loader.module";
import { RevisionHistoryComponent } from "./revision-history.component";

@NgModule({
    declarations: [
        RevisionHistoryComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        PaginationModule.forRoot()
    ],
    exports: [
        RevisionHistoryComponent
    ]
})
export class RevisionHistoryModule {

}