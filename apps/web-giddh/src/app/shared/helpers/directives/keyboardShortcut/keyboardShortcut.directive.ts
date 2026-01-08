import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, Injectable } from '@angular/core';

/** Key code mappings for keyboard shortcuts */
const KEY_CODES = {
    backspace: 8, tab: 9, enter: 13, esc: 27, left: 37, up: 38, right: 39, down: 40,
    0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57,
    a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74,
    k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84,
    u: 85, v: 86, w: 87, x: 88, y: 89, z: 90
} as const;

/** Control key mappings */
const CONTROL_KEYS = {
    shift: 'shiftKey',
    ctrl: 'ctrlKey', 
    alt: 'altKey'
} as const;

/** Service to manage dialog priority for nested dialogs */
@Injectable({ providedIn: 'root' })
export class DialogPriorityService {
    /** Stack of active dialog directives (LIFO - Last In, First Out) */
    private dialogStack: KeyboardShortcutDirective[] = [];

    /**
     * Registers a dialog directive to the stack
     * @param directive - The keyboard shortcut directive instance
     */
    register(directive: KeyboardShortcutDirective): void {
        this.dialogStack.push(directive);
    }

    /**
     * Unregisters a dialog directive from the stack
     * @param directive - The keyboard shortcut directive instance
     */
    unregister(directive: KeyboardShortcutDirective): void {
        const index = this.dialogStack.indexOf(directive);
        if (index > -1) {
            this.dialogStack.splice(index, 1);
        }
    }

    /**
     * Gets the topmost (most recent) dialog directive
     * @returns The topmost directive or null if stack is empty
     */
    getTopMostDirective(): KeyboardShortcutDirective | null {
        return this.dialogStack.length > 0 ? this.dialogStack[this.dialogStack.length - 1] : null;
    }
}

@Directive({
    selector: '[keyboardShortcut]'
})
export class KeyboardShortcutDirective implements OnInit, OnDestroy {
    @Input() keyboardShortcut: string | string[] | Record<string, boolean> = '';
    @Input() config: {
        hostOnly?: boolean;
        ignoreHost?: boolean;
        dialogMode?: boolean;
    } = {};
    @Input() host?: HTMLElement;
    @Output() onShortcutPress = new EventEmitter<string>();

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private dialogPriorityService: DialogPriorityService
    ) {}

    /**
     * Initializes the directive and registers for dialog mode if enabled
     */
    ngOnInit(): void {
        if (this.config.dialogMode) {
            this.dialogPriorityService.register(this);
        }
    }

    /**
     * Cleans up and unregisters from dialog priority service
     */
    ngOnDestroy(): void {
        if (this.config.dialogMode) {
            this.dialogPriorityService.unregister(this);
        }
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        // Check if this directive should handle the event
        if (!this.shouldHandleEvent(event)) {
            return;
        }

        // Process the keyboard shortcut
        const shortcuts = this.normalizeShortcuts();
        for (const shortcut of shortcuts) {
            if (this.matchesShortcut(event, shortcut)) {
                this.emitShortcut(event, shortcut);
                break;
            }
        }
    }

    /**
     * Determines if this directive should handle the keyboard event
     */
    private shouldHandleEvent(event: KeyboardEvent): boolean {
        // For dialog mode, only handle if this is the topmost dialog
        if (this.config.dialogMode) {
            const topDirective = this.dialogPriorityService.getTopMostDirective();
            if (topDirective !== this) {
                return false;
            }
        }

        // Check host-based filtering
        const target = event.target as HTMLElement;
        const hostElement = this.host || this.elementRef.nativeElement;

        if (this.config.hostOnly && !hostElement.contains(target)) {
            return false;
        }

        if (this.config.ignoreHost && hostElement.contains(target)) {
            return false;
        }

        return true;
    }

    /**
     * Normalizes shortcuts to array format for consistent processing
     */
    private normalizeShortcuts(): string[] {
        if (Array.isArray(this.keyboardShortcut)) {
            return this.keyboardShortcut;
        }
        
        if (typeof this.keyboardShortcut === 'string') {
            return [this.keyboardShortcut];
        }
        
        if (typeof this.keyboardShortcut === 'object') {
            return Object.keys(this.keyboardShortcut).filter(key => this.keyboardShortcut[key]);
        }
        
        return [];
    }

    /**
     * Checks if the keyboard event matches the given shortcut
     */
    private matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
        if (shortcut.includes('+')) {
            return this.matchesComboShortcut(event, shortcut);
        }
        
        return this.matchesSingleKey(event, shortcut);
    }

    /**
     * Matches combination shortcuts (e.g., 'ctrl+s', 'shift+enter')
     */
    private matchesComboShortcut(event: KeyboardEvent, shortcut: string): boolean {
        const keys = shortcut.split('+');
        return keys.every(key => {
            const controlKey = CONTROL_KEYS[key as keyof typeof CONTROL_KEYS];
            if (controlKey) {
                return event[controlKey as keyof KeyboardEvent] === true;
            }
            return KEY_CODES[key as keyof typeof KEY_CODES] === event.which;
        });
    }

    /**
     * Matches single key shortcuts (e.g., 'esc', 'enter')
     */
    private matchesSingleKey(event: KeyboardEvent, key: string): boolean {
        const keyCode = KEY_CODES[key as keyof typeof KEY_CODES];
        return keyCode === event.which && 
               !event.shiftKey && 
               !event.ctrlKey && 
               !event.altKey;
    }

    /**
     * Emits the shortcut event and prevents default behavior
     */
    private emitShortcut(event: KeyboardEvent, shortcut: string): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.onShortcutPress.emit(shortcut);
    }
}
