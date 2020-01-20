import { ModuleWithProviders, NgModule } from '@angular/core';
import { Select2Component } from './select2.component';

export { Select2OptionData, Select2TemplateFunction } from './select2.interface';

export { Select2Component } from './select2.component';

@NgModule({
    declarations: [Select2Component],
    exports: [Select2Component]
})
export class Select2Module {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: Select2Module,
            providers: []
        };
    }
}
