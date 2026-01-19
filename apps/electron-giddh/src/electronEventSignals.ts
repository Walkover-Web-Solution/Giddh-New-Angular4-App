import { app, BrowserWindow, WebContents } from 'electron';

/**
 * WindowEvent interface definition
 * Defines the structure and contract for WindowEvent objects
 */
export interface WindowEvent {
    sender: BrowserWindow;
}

/**
 * WebContentsEvent interface definition
 * Defines the structure and contract for WebContentsEvent objects
 */
export interface WebContentsEvent {
    sender: WebContents;
}

function isEnvTrue(v: string): boolean {
    return v != null && (v.length === 0 || v === 'true');
}

const isLogEvent = isEnvTrue(process.env.LOG_EVENTS);

function addHandler(emitter: any, event: string, handler: (...args: any[]) => void) {
    /**
     * Handles if functionality
     */
    if (isLogEvent) {
        emitter.on(event, (...args: any[]) => {
            handler.apply(this, args);
        });
    } else {
        emitter.on(event, handler);
    }
}

/**
 * WebContentsSignal class
 * Implements WebContentsSignal functionality
 */
export class WebContentsSignal {
    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private emitter: WebContents) {
    }

    /**
     * Handles navigated functionality
     */
    public navigated(handler: (event: WebContentsEvent, url: string) => void): WebContentsSignal {
        /**
         * Handles addHandler functionality
         */
        addHandler(this.emitter, 'did-navigate', handler);
        return this;
    }

    /**
     * Handles navigatedInPage functionality
     */
    public navigatedInPage(handler: (event: WebContentsEvent, url: string) => void): WebContentsSignal {
        /**
         * Handles addHandler functionality
         */
        addHandler(this.emitter, 'did-navigate-in-page', handler);
        return this;
    }

    /**
     * Handles frameLoaded functionality
     */
    public frameLoaded(handler: (event: any, isMainFrame: boolean) => void): WebContentsSignal {
        /**
         * Handles addHandler functionality
         */
        addHandler(this.emitter, 'did-frame-finish-load', handler);
        return this;
    }
}

/**
 * AppSignal class
 * Implements AppSignal functionality
 */
export class AppSignal {
    private emitter = app;

    /**
     * Handles windowBlurred functionality
     */
    public windowBlurred(handler: (event: any, window: BrowserWindow) => void): AppSignal {
        /**
         * Handles addHandler functionality
         */
        addHandler(this.emitter, 'browser-window-blur', handler);
        return this;
    }

    /**
     * Handles windowFocused functionality
     */
    public windowFocused(handler: (event: any, window: BrowserWindow) => void): AppSignal {
        /**
         * Handles addHandler functionality
         */
        addHandler(this.emitter, 'browser-window-focus', handler);
        return this;
    }
}
