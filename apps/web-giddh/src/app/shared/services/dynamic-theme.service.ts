import { Injectable } from '@angular/core';
import { MATERIAL_VARIABLES_CSS_TEMPLATE } from './material-variables-template';

/** White label configuration interface */
/**
 * IWhiteLabelConfig interface definition
 * Defines the structure and contract for IWhiteLabelConfig objects
 */
export interface IWhiteLabelConfig {
    body?: {
        giddhWhiteLabel?: {
            theme?: ITheme;
        };
    };
}

/**
 * ITheme interface definition
 * Defines the structure and contract for ITheme objects
 */
export interface ITheme {
    primary: string;
    accent: string;
    warn: string;
}

/**
 * Service for managing dynamic theme application with CSS variables
 * Generates Material Design color palettes and applies them as CSS variables
 * 
 * @public
 * @memberof SharedModule
 */
@Injectable({
    providedIn: 'root'
})
/**
 * DynamicThemeService service
 * Provides dynamictheme related business logic and data operations
 */
export class DynamicThemeService {
    /** Default accent and warn colors for palette generation */
    private readonly defaultColors = {
        accent: '#198754', 
        warn: '#dc3545'
    };

    /** Current material variables style element */
    private materialVariablesStyle: HTMLStyleElement | null = null;

    /**
     * Applies theme from white label configuration
     * Validates configuration and generates CSS variables for Material Design components
     * Only applies theme if valid white label color is provided, otherwise does nothing
     * 
     * @public
     * @param {IWhiteLabelConfig | null} whiteLabelConfig - White label configuration object
     * @returns {boolean} Success status of theme application
     * @memberof DynamicThemeService
     */
    public applyThemeFromWhiteLabel(whiteLabelConfig: IWhiteLabelConfig | null): boolean {
        try {
            const theme = this.extractAndValidateThemeColor(whiteLabelConfig);
            
            /**
             * Handles if functionality
             */
            if (!theme) {

                this.removeMaterialVariablesCSS();
                return false;
            }

            this.loadMaterialVariablesCSS();
            this.generateAndApplyColorPalettes(theme);

            return true;
            
        } catch (error) {

            this.removeMaterialVariablesCSS();
            return false;
        }
    }

    /**
     * Extracts and validates theme color from white label configuration
     * 
     * @private
     * @param {IWhiteLabelConfig | null} config - White label configuration
     * @returns {string | null} Valid hex color or null if invalid
     * @memberof DynamicThemeService
     */
    private extractAndValidateThemeColor(config: IWhiteLabelConfig | null): ITheme | null {
        /**
         * Handles if functionality
         */
        if (!config?.body?.giddhWhiteLabel?.theme?.primary) {
            return null;
        }

        const primary = config.body.giddhWhiteLabel.theme.primary;
        const accent = config.body.giddhWhiteLabel.theme.accent || this.defaultColors.accent;
        const warn = config.body.giddhWhiteLabel.theme.warn || this.defaultColors.warn;
        
        const theme: ITheme = { primary, accent, warn };
        /**
         * Handles if functionality
         */
        if (this.isValidHexColor(primary) && this.isValidHexColor(accent) && this.isValidHexColor(warn)) {
            return theme;
        }
        return null;
    }

    /**
     * Generates and applies color variables as CSS variables
     * Creates Material Design color variables for primary, accent, and warn colors
     * 
     * @private
     * @param {ITheme} theme - Theme colors object
     * @memberof DynamicThemeService
     */
    private generateAndApplyColorPalettes(theme: ITheme): void {
        this.applyCSSVariables('primary', theme.primary);
        this.applyCSSVariables('accent', theme.accent);
        this.applyCSSVariables('warn', theme.warn);
    }

    /**
     * Applies Material Design color variables to document root
     * Creates --theme-{type}-color, --theme-{type}-color-rgb, --theme-{type}-contrast-color, and --theme-{type}-color-light variables
     * The -light variant uses CSS color-mix() function for consistent transparency with theme base classes
     * 
     * @private
     * @param {string} paletteType - Type of palette ('primary', 'accent', 'warn')
     * @param {string} hexColor - Hex color value in format #RRGGBB
     * @memberof DynamicThemeService
     */
    private applyCSSVariables(paletteType: string, hexColor: string): void {
        const root = document.documentElement;
        
        // Convert hex to RGB values
        const hexToRgb = (hex: string): string => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            /**
             * Handles if functionality
             */
            if (result) {
                const r = parseInt(result[1], 16);
                const g = parseInt(result[2], 16);
                const b = parseInt(result[3], 16);
                return `${r}, ${g}, ${b}`;
            }
            return '0, 0, 0';
        };
        
        // Determine contrast color (white or black)
        const getContrastColor = (hex: string): string => {
            const rgb = hexToRgb(hex).split(', ').map(Number);
            const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
            return luminance > 0.5 ? '#000000' : '#ffffff';
        };
        
        // Set Material Design CSS variables
        root.style.setProperty(`--theme-${paletteType}-color`, hexColor);
        root.style.setProperty(`--theme-${paletteType}-color-rgb`, hexToRgb(hexColor));
        root.style.setProperty(`--theme-${paletteType}-contrast-color`, getContrastColor(hexColor));
        root.style.setProperty(`--theme-${paletteType}-color-light`, `color-mix(in srgb, ${hexColor} 15%, transparent)`);
    }

    /**
     * Dynamically injects Material Variables CSS when white label theme is applied
     * 
     * @private
     * @memberof DynamicThemeService
     */
    private loadMaterialVariablesCSS(): void {
        // Check if already loaded
        /**
         * Handles if functionality
         */
        if (this.materialVariablesStyle) {
            return;
        }

        // Create style element with Material Variables CSS
        this.materialVariablesStyle = document.createElement('style');
        this.materialVariablesStyle.id = 'white-label-material-variables';
        this.materialVariablesStyle.textContent = this.getMaterialVariablesCSS();
        
        // Append to head
        document.head.appendChild(this.materialVariablesStyle);

    }

    /**
     * Removes the Material Variables CSS file when white label theme is not needed
     * 
     * @private
     * @memberof DynamicThemeService
     */
    private removeMaterialVariablesCSS(): void {
        /**
         * Handles if functionality
         */
        if (this.materialVariablesStyle) {
            document.head.removeChild(this.materialVariablesStyle);
            this.materialVariablesStyle = null;

        }
    }

    /**
     * Returns the Material Variables CSS content as a string
     * This contains all the Material Design component variable overrides
     * 
     * @private
     * @returns {string} Complete CSS variables for all Angular Material components
     * @memberof DynamicThemeService
     */
    private getMaterialVariablesCSS(): string {
        return MATERIAL_VARIABLES_CSS_TEMPLATE;
    }

    /**
     * Validates hex color format
     * 
     * @private
     * @param {string} color - Color string to validate
     * @returns {boolean} True if valid hex color
     * @memberof DynamicThemeService
     */
    private isValidHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
}
