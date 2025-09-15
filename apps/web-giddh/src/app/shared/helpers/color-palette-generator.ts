/**
 * Color Palette Generator for Dynamic Theming
 * Generates Material Design 2 compatible color palettes from a base hex color
 */

export interface ColorPalette {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
    contrast: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        A100: string;
        A200: string;
        A400: string;
        A700: string;
    };
}


/**
 * Converts hex color to RGB values
 * @param hex - Hex color code (with or without #)
 * @returns RGB object with r, g, b values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Converts RGB values to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts RGB to HSL
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL object
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            default: h = 0;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB object
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * Calculates luminance of a color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Luminance value
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determines if white or black text should be used on a background color
 * @param backgroundColor - Background color in hex format
 * @returns '#ffffff' for white text or '#000000' for black text
 */
function getContrastColor(backgroundColor: string): string {
    const rgb = hexToRgb(backgroundColor);
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generates a color palette shade based on lightness adjustment
 * @param baseColor - Base color in hex format
 * @param lightnessAdjustment - Lightness adjustment percentage (-100 to 100)
 * @returns Generated color in hex format
 */
function generateShade(baseColor: string, lightnessAdjustment: number): string {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Adjust lightness
    let newLightness = hsl.l + lightnessAdjustment;
    newLightness = Math.max(0, Math.min(100, newLightness));
    
    const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generates a complete Material Design 2 color palette from a base hex color
 * @param baseHex - Base color in hex format (e.g., '#1a237e')
 * @returns Complete color palette with all shades and contrast colors
 */
export function generateColorPalette(baseHex: string): ColorPalette {
    // Ensure hex starts with #
    const hex = baseHex.startsWith('#') ? baseHex : `#${baseHex}`;
    
    // Generate all shades based on lightness adjustments
    const palette = {
        50: generateShade(hex, 45),    // Very light
        100: generateShade(hex, 35),   // Light
        200: generateShade(hex, 25),   // Medium-light
        300: generateShade(hex, 15),   // Medium
        400: generateShade(hex, 5),    // Medium-dark
        500: hex,                      // Base color
        600: generateShade(hex, -10),  // Dark
        700: generateShade(hex, -20),  // Darker
        800: generateShade(hex, -30),  // Very dark
        900: generateShade(hex, -40),  // Darkest
        A100: generateShade(hex, 30),  // Accent light
        A200: generateShade(hex, 10),  // Accent medium
        A400: generateShade(hex, -5),  // Accent dark
        A700: generateShade(hex, -15), // Accent darkest
        contrast: {
            50: '#000000',
            100: '#000000',
            200: '#000000',
            300: '#000000',
            400: '#000000',
            500: '#ffffff',
            600: '#ffffff',
            700: '#ffffff',
            800: '#ffffff',
            900: '#ffffff',
            A100: '#000000',
            A200: '#000000',
            A400: '#ffffff',
            A700: '#ffffff',
        }
    };

    // Calculate proper contrast colors for each shade
    Object.keys(palette).forEach(key => {
        if (key !== 'contrast') {
            const shadeKey = key as keyof Omit<ColorPalette, 'contrast'>;
            palette.contrast[shadeKey] = getContrastColor(palette[shadeKey]);
        }
    });

    return palette;
}

/**
 * Updates CSS variables for dynamic theming
 * @param paletteType - Type of palette ('primary', 'accent', 'warn')
 * @param palette - Color palette object
 */
export function updateCSSVariables(paletteType: string, palette: ColorPalette): void {
    const root = document.documentElement;
    
    // Set Angular Material theme variables (--theme-primary-*, --theme-accent-*, --theme-warn-*)
    Object.keys(palette).forEach(shade => {
        if (shade !== 'contrast') {
            const shadeKey = shade as keyof Omit<ColorPalette, 'contrast'>;
            const varName = `--theme-${paletteType}-${shade}`;
            root.style.setProperty(varName, palette[shadeKey]);
            console.log(`Set theme variable: ${varName} = ${palette[shadeKey]}`);
        }
    });
    
    // Set contrast variables for Angular Material theme
    Object.keys(palette.contrast).forEach(shade => {
        const shadeKey = shade as keyof ColorPalette['contrast'];
        const varName = `--theme-${paletteType}-contrast-${shade}`;
        const contrastValue = palette.contrast[shadeKey] === '#000000' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff';
        root.style.setProperty(varName, contrastValue);
        console.log(`Set theme contrast variable: ${varName} = ${contrastValue}`);
    });
}

/**
 * Generates and applies a complete theme from primary, accent, and warn colors
 * @param primaryColor - Primary color in hex format
 * @param accentColor - Accent color in hex format (optional)
 * @param warnColor - Warn color in hex format (optional)
 */
export function generateAndApplyTheme(
    primaryColor: string,
    accentColor?: string,
    warnColor?: string
): void {
    const primaryPalette = generateColorPalette(primaryColor);
    const accentPalette = generateColorPalette(accentColor);
    const warnPalette = generateColorPalette(warnColor);
    
    // Apply to CSS variables
    updateCSSVariables('primary', primaryPalette);
    updateCSSVariables('accent', accentPalette);
    updateCSSVariables('warn', warnPalette);
}