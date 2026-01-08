import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';

/**
 * Directive that makes any element focusable and clickable via keyboard navigation
 * Automatically adds tabindex, role, and CDK focus monitoring
 * Executes provided function on Enter and Space key press
 *
 * Usage:
 * <div appFocusableClick [clickFunction]="myFunction" [clickArgs]="[arg1, arg2]">Content</div>
 *
 * @export
 * @class FocusableClickDirective
 */
@Directive({
    selector: '[appFocusableClick]',
    standalone: true
})
export class FocusableClickDirective implements OnInit, OnDestroy {

    /**
     * Function to execute when Enter or Space is pressed
     *
     * @type {Function}
     * @memberof FocusableClickDirective
     */
    @Input() public clickFunction: Function;

    /**
     * Arguments to pass to the click function
     *
     * @type {any[]}
     * @memberof FocusableClickDirective
     */
    @Input() public clickArgs: any[] = [];

    /**
     * Component context for executing statements (optional)
     * Pass 'this' from your component to enable statement execution
     *
     * @type {any}
     * @memberof FocusableClickDirective
     */
    @Input() public componentContext: any;

    /**
     * String of statements to execute (alternative to clickFunction)
     * Example: "func1(); func2(); xyzVar = true"
     *
     * @type {string}
     * @memberof FocusableClickDirective
     */
    @Input() public clickStatements: string;

    /**
     * Creates an instance of FocusableClickDirective
     *
     * @param {ElementRef} elementRef - Reference to the host element
     * @param {FocusMonitor} focusMonitor - CDK Focus Monitor service
     * @memberof FocusableClickDirective
     */
    constructor(
        private elementRef: ElementRef,
        private focusMonitor: FocusMonitor
    ) {}

    /**
     * Initialize the directive - set up accessibility attributes and focus monitoring
     *
     * @memberof FocusableClickDirective
     */
    public ngOnInit(): void {
        const element = this.elementRef.nativeElement;

        // Add accessibility attributes
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');

        // Add cursor pointer style if not already present
        if (!element.style.cursor) {
            element.style.cursor = 'pointer';
        }

        // Start monitoring focus on this element
        this.focusMonitor.monitor(element);
    }

    /**
     * Cleanup - stop monitoring focus
     *
     * @memberof FocusableClickDirective
     */
    public ngOnDestroy(): void {
        this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    }

    /**
     * Handle keydown events for Enter and Space keys
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof FocusableClickDirective
     */
    @HostListener('keydown.enter', ['$event'])
    @HostListener('keydown.space', ['$event'])
    public onKeyboardActivate(event: KeyboardEvent): void {
        // Prevent default behavior (form submission, page scroll, etc.)
        event.preventDefault();
        event.stopPropagation();

        // Execute the provided click function
        this.executeClickFunction();
    }

    /**
     * Execute the provided click function or statements
     *
     * @private
     * @memberof FocusableClickDirective
     */
    private executeClickFunction(): void {
        try {
            // Priority 1: Execute statements if provided
            if (this.clickStatements && this.componentContext) {
                this.executeStatements();
                return;
            }

            // Priority 2: Execute function if provided
            if (this.clickFunction && typeof this.clickFunction === 'function') {
                this.clickFunction.apply(this.componentContext || null, this.clickArgs);
                return;
            }

        } catch (error) {

        }
    }

    /**
     * Execute multiple statements in the component context
     *
     * @private
     * @memberof FocusableClickDirective
     */
    private executeStatements(): void {
        if (!this.componentContext) {

            return;
        }

        try {
            // Split statements by semicolon and execute each one
            const statements = this.clickStatements.split(';').map(s => s.trim()).filter(s => s);

            for (const statement of statements) {
                this.executeStatement(statement);
            }
        } catch (error) {

        }
    }

    /**
     * Execute a single statement in the component context
     *
     * @private
     * @param {string} statement - Statement to execute
     * @memberof FocusableClickDirective
     */
    private executeStatement(statement: string): void {
        try {
            // Handle function calls like "func1()" or "func1(arg1, arg2)"
            if (statement.includes('(') && statement.includes(')')) {
                const funcMatch = statement.match(/(\w+)\((.*?)\)/);
                if (funcMatch) {
                    const [, funcName, argsString] = funcMatch;
                    if (typeof this.componentContext[funcName] === 'function') {
                        // Parse arguments if any
                        const args = argsString ? this.parseArguments(argsString) : [];
                        this.componentContext[funcName].apply(this.componentContext, args);
                    }
                }
            }
            // Handle assignments like "xyzVar = true"
            else if (statement.includes('=')) {
                const [varName, value] = statement.split('=').map(s => s.trim());
                this.componentContext[varName] = this.parseValue(value);
            }
            // Handle simple method calls without parentheses
            else {
                if (typeof this.componentContext[statement] === 'function') {
                    this.componentContext[statement].call(this.componentContext);
                }
            }
        } catch (error) {

        }
    }

    /**
     * Parse function arguments from string
     *
     * @private
     * @param {string} argsString - Arguments string
     * @returns {any[]}
     * @memberof FocusableClickDirective
     */
    private parseArguments(argsString: string): any[] {
        if (!argsString.trim()) return [];

        try {
            // Simple parsing for basic types
            return argsString.split(',').map(arg => this.parseValue(arg.trim()));
        } catch (error) {

            return [];
        }
    }

    /**
     * Parse a value from string to appropriate type
     *
     * @private
     * @param {string} value - Value to parse
     * @returns {any}
     * @memberof FocusableClickDirective
     */
    private parseValue(value: string): any {
        value = value.trim();

        // Boolean values
        if (value === 'true') return true;
        if (value === 'false') return false;

        // Null/undefined
        if (value === 'null') return null;
        if (value === 'undefined') return undefined;

        // Numbers
        if (!isNaN(Number(value)) && value !== '') return Number(value);

        // Strings (remove quotes if present)
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }

        // Component property reference
        if (this.componentContext && this.componentContext.hasOwnProperty(value)) {
            return this.componentContext[value];
        }

        // Return as string if nothing else matches
        return value;
    }
}
