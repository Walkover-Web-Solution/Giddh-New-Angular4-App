import { app, BrowserWindow, EventEmitter, WebContents } from 'electron';

export interface WindowEvent {
  sender: BrowserWindow;
}

export interface WebContentsEvent {
  sender: WebContents;
}

function isEnvTrue(v: string): boolean {
  return v != null && (v.length === 0 || v === 'true');
}

const isLogEvent = isEnvTrue(process.env.LOG_EVENTS);

function addHandler(emitter: EventEmitter, event: string, handler: (...args: any[]) => void) {
  if (isLogEvent) {
    emitter.on(event, (...args: any[]) => {
      console.log('%s %s', event, args);
      handler.apply(this, args);
    });
  } else {
    emitter.on(event, handler);
  }
}

export class WebContentsSignal {
  constructor(private emitter: WebContents) {
  }

  public navigated(handler: (event: WebContentsEvent, url: string) => void): WebContentsSignal {
    addHandler(this.emitter, 'did-navigate', handler);
    return this;
  }

  public navigatedInPage(handler: (event: WebContentsEvent, url: string) => void): WebContentsSignal {
    addHandler(this.emitter, 'did-navigate-in-page', handler);
    return this;
  }

  public frameLoaded(handler: (event: any, isMainFrame: boolean) => void): WebContentsSignal {
    addHandler(this.emitter, 'did-frame-finish-load', handler);
    return this;
  }
}

export class AppSignal {
  private emitter = app;

  public windowBlurred(handler: (event: any, window: BrowserWindow) => void): AppSignal {
    addHandler(this.emitter, 'browser-window-blur', handler);
    return this;
  }

  public windowFocused(handler: (event: any, window: BrowserWindow) => void): AppSignal {
    addHandler(this.emitter, 'browser-window-focus', handler);
    return this;
  }
}
