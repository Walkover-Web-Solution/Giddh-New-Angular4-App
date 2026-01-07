
// Create: apps/web-giddh/src/app/shared/services/froala-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FroalaLoaderService {
    private froalaLoaded = false;
    
    async loadFroala() {
        if (!this.froalaLoaded) {
            const [froalaModule, pluginsModule] = await Promise.all([
                import('froala-editor/js/froala_editor.pkgd.min.js'),
                import('froala-editor/js/plugins.pkgd.min.js')
            ]);
            this.froalaLoaded = true;
            return { froalaModule, pluginsModule };
        }
    }
}

// Update template-froala.component.ts:
// Replace static imports with:
// await this.froalaLoader.loadFroala();
