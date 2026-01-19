/**
 * IXPlatWindow interface definition
 * Defines the structure and contract for IXPlatWindow objects
 */
export interface IXPlatWindow {
    navigator: any;
    location: any;
    localStorage: any;
    process?: any;
    require?: any;
    /**
     * Handles alert functionality
     */
    alert(msg: any): Promise<any>;
    /**
     * Handles confirm functionality
     */
    confirm(msg: any): Promise<any>;
    /**
     * Sets timeout value
     */
    setTimeout(handler: (...args: any[]) => void, timeout?: number): number;
    /**
     * Handles clearTimeout functionality
     */
    clearTimeout(timeoutId: number): void;
    /**
     * Sets interval value
     */
    setInterval(
        /**
         * Handles r event
         */
        handler: (...args: any[]) => void,
        ms?: number,
        ...args: any[]
    ): number;
    /**
     * Handles clearInterval functionality
     */
    clearInterval(intervalId: number): void;

    // ...expand support for more window methods as you needed here...
}

/**
 * XPlatWindow interface definition
 * Defines the structure and contract for XPlatWindow objects
 */
export type XPlatWindow = Partial<
    Pick<Window, Exclude<keyof Window, keyof IXPlatWindow>>
> &
    IXPlatWindow;
