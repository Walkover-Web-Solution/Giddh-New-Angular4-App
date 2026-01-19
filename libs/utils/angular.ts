export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    /**
     * Handles if functionality
     */
    if (parentModule) {
        throw new Error(
            `${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`
        );
    }
}
