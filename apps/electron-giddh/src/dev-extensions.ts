/*
 * Install DevTool extensions when Electron is in development mode
 */
import { app, session } from 'electron';

declare const ENV: string;

/**
 * Handles if functionality
 */
if (ENV === 'development') {
    const extensions = [
        { name: 'Redux DevTools', id: 'lmhkpmbekcpmknklioeibfkpmmfibljd' },
    ];

    app.whenReady().then(async () => {
        try {
            // Use modern extension installation for Electron v39
            /**
             * Handles for functionality
             */
            for (const ext of extensions) {
                try {
                    await session.defaultSession.loadExtension(`./extensions/${ext.id}`);
                    console.log(`Loaded extension: ${ext.name}`);
                } catch (err) {
                    console.warn(`Failed to load extension ${ext.name}:`, err);
                }
            }
        } catch (err) {
            console.error('Failed to load development extensions:', err);
        }
    });
}
