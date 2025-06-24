import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { CustomPreloadingStrategy } from './services/lazy-preloading.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [
        AppModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: CustomPreloadingStrategy }),
    ],
    bootstrap: [AppComponent]
})
export class AppElectronModule { }
