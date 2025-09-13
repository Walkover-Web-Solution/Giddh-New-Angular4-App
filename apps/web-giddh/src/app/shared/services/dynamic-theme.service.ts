import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { generateAndApplyTheme } from '../helpers/color-palette-generator';

/**
 * Service for managing dynamic theme application with runtime CSS injection
 * @memberof SharedModule
 */
@Injectable({
    providedIn: 'root'
})
export class DynamicThemeService {
    /** Renderer for DOM manipulation */
    private renderer: Renderer2;
    
    /** Current theme style element */
    private currentThemeStyle: HTMLStyleElement | null = null;

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    /**
     * Generates and injects complete Angular Material theme CSS at runtime
     * @param {string} primaryColor - Primary theme color in hex format
     * @param {string} accentColor - Accent theme color in hex format  
     * @param {string} warnColor - Warning theme color in hex format
     * @public
     */
    public applyRuntimeTheme(primaryColor: string, accentColor?: string, warnColor?: string): void {
        try {
            // Remove existing theme
            if (this.currentThemeStyle) {
                this.renderer.removeChild(document.head, this.currentThemeStyle);
            }

            // Generate complete theme CSS
            const themeCSS = this.generateThemeCSS(primaryColor, accentColor, warnColor);
            
            // Create and inject new theme
            this.currentThemeStyle = this.renderer.createElement('style');
            this.renderer.setAttribute(this.currentThemeStyle, 'id', 'dynamic-material-theme');
            this.renderer.appendChild(this.currentThemeStyle, this.renderer.createText(themeCSS));
            this.renderer.appendChild(document.head, this.currentThemeStyle);

            console.log('Runtime theme applied:', { primaryColor, accentColor, warnColor });
        } catch (error) {
            console.error('Error applying runtime theme:', error);
        }
    }

    /**
     * Generates complete Angular Material theme CSS string
     * @param {string} primaryColor - Primary theme color
     * @param {string} accentColor - Accent theme color
     * @param {string} warnColor - Warning theme color
     * @returns {string} Complete CSS theme string
     * @private
     */
    private generateThemeCSS(primaryColor: string, accentColor?: string, warnColor?: string): string {
        const primary = primaryColor;
        const accent = accentColor || this.generateAccentColor(primaryColor);
        const warn = warnColor || '#f44336';

        return `
            /* Dynamic Angular Material Theme - Generated at Runtime */
            .mat-raised-button.mat-primary {
                background-color: ${primary} !important;
                color: white !important;
            }
            
            .mat-raised-button.mat-accent {
                background-color: ${accent} !important;
                color: white !important;
            }
            
            .mat-raised-button.mat-warn {
                background-color: ${warn} !important;
                color: white !important;
            }
            
            .mat-form-field.mat-focused .mat-form-field-label {
                color: ${primary} !important;
            }
            
            .mat-form-field.mat-focused .mat-form-field-underline .mat-form-field-ripple {
                background-color: ${primary} !important;
            }
            
            .mat-checkbox-checked.mat-primary .mat-checkbox-background {
                background-color: ${primary} !important;
            }
            
            .mat-checkbox-checked.mat-accent .mat-checkbox-background {
                background-color: ${accent} !important;
            }
            
            .mat-radio-button.mat-primary .mat-radio-outer-circle {
                border-color: ${primary} !important;
            }
            
            .mat-radio-button.mat-primary .mat-radio-inner-circle {
                background-color: ${primary} !important;
            }
            
            .mat-slide-toggle.mat-primary .mat-slide-toggle-thumb {
                background-color: ${primary} !important;
            }
            
            .mat-slide-toggle.mat-primary .mat-slide-toggle-bar {
                background-color: ${this.lightenColor(primary, 0.5)} !important;
            }
            
            .mat-progress-bar-fill::after {
                background-color: ${primary} !important;
            }
            
            .mat-progress-spinner circle {
                stroke: ${primary} !important;
            }
        `;
    }

    /**
     * Generates complementary accent color from primary
     * @param {string} primaryColor - Primary color in hex
     * @returns {string} Generated accent color
     * @private
     */
    private generateAccentColor(primaryColor: string): string {
        // Simple complementary color generation
        const hex = primaryColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Generate complementary color
        const compR = 255 - r;
        const compG = 255 - g;
        const compB = 255 - b;
        
        return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
    }

    /**
     * Lightens a color by specified amount
     * @param {string} color - Color in hex format
     * @param {number} amount - Amount to lighten (0-1)
     * @returns {string} Lightened color
     * @private
     */
    private lightenColor(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Applies dynamic theme based on provided colors (CSS Variables approach)
     * @param {string} primaryColor - Primary theme color in hex format
     * @param {string} accentColor - Accent theme color in hex format
     * @param {string} warnColor - Warning theme color in hex format
     * @public
     */
    public applyTheme(primaryColor: string, accentColor?: string, warnColor?: string): void {
        try {
            generateAndApplyTheme(primaryColor, accentColor, warnColor);
            console.log('CSS Variables theme applied:', { primaryColor, accentColor, warnColor });
        } catch (error) {
            console.error('Error applying CSS variables theme:', error);
        }
    }

    /**
     * Default theme configuration for fallback scenarios using Giddh brand colors
     * @private
     */
    private readonly defaultThemeConfig = {
        primary: '#1a237e',    // Giddh Deep Indigo var(--giddh-theme-primary)
        accent: '#ff9933',     // Giddh Orange var(--giddh-theme-accent)
        warn: '#F44336'        // Giddh Red var(--giddh-theme-warn)
    };

    /**
     * Validates hex color format
     * @param {string} color - Color string to validate
     * @returns {boolean} True if valid hex color
     * @private
     */
    private isValidHexColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    /**
     * Safely extracts and validates theme colors from configuration
     * @param {WhiteLabelConfig} config - White label configuration object
     * @returns {ThemeColors} Validated theme colors
     * @private
     */
    private extractThemeColors(config: any): { primary: string; accent: string; warn: string } {
        const whiteLabelData = config?.body?.giddhWhiteLabel;
        
        const primary = this.isValidHexColor(whiteLabelData?.themeColor) 
            ? whiteLabelData.themeColor 
            : this.defaultThemeConfig.primary;
            
        const accent = this.isValidHexColor(whiteLabelData?.accentColor) 
            ? whiteLabelData.accentColor 
            : this.defaultThemeConfig.accent;
            
        const warn = this.isValidHexColor(whiteLabelData?.warnColor) 
            ? whiteLabelData.warnColor 
            : this.defaultThemeConfig.warn;

        return { primary, accent, warn };
    }

    /**
     * Applies theme from white label configuration with proper validation
     * @param {any} whiteLabelConfig - White label configuration object
     * @param {boolean} useRuntimeCSS - Whether to use runtime CSS injection instead of CSS variables
     * @returns {boolean} True if theme was successfully applied
     * @public
     */
    public applyThemeFromConfig(whiteLabelConfig: any, useRuntimeCSS: boolean = false): boolean {
        try {
            if (!whiteLabelConfig) {
                console.warn('No white label configuration provided, using default theme');
                return this.applyDefaultTheme(useRuntimeCSS);
            }

            const { primary, accent, warn } = this.extractThemeColors(whiteLabelConfig);
            
            if (useRuntimeCSS) {
                this.applyRuntimeTheme(primary, accent, warn);
            } else {
                this.applyTheme(primary, accent, warn);
            }

            console.log('Theme applied successfully from configuration:', { primary, accent, warn });
            return true;
            
        } catch (error) {
            console.error('Failed to apply theme from configuration:', error);
            return this.applyDefaultTheme(useRuntimeCSS);
        }
    }

    /**
     * Applies default theme as fallback
     * @param {boolean} useRuntimeCSS - Whether to use runtime CSS injection
     * @returns {boolean} True if default theme was applied
     * @private
     */
    private applyDefaultTheme(useRuntimeCSS: boolean): boolean {
        try {
            const { primary, accent, warn } = this.defaultThemeConfig;
            
            if (useRuntimeCSS) {
                this.applyRuntimeTheme(primary, accent, warn);
            } else {
                this.applyTheme(primary, accent, warn);
            }
            
            console.log('Default theme applied as fallback');
            return true;
        } catch (error) {
            console.error('Failed to apply default theme:', error);
            return false;
        }
    }
}
