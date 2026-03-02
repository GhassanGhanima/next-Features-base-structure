import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// Shared color tokens
const colors = {
  // Primary
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    DEFAULT: "#0ea5e9",
  },
  // Secondary
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    DEFAULT: "#a855f7",
  },
  // Accent
  accent: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    DEFAULT: "#d946ef",
  },
  // Neutral
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
    DEFAULT: "#737373",
  },
  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    DEFAULT: "#22c55e",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    DEFAULT: "#f59e0b",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    DEFAULT: "#ef4444",
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    DEFAULT: "#3b82f6",
  },
  // CSS variables for dark mode
  background: "var(--background)",
  foreground: "var(--foreground)",
};

// Spacing scale (8px base unit system)
const spacing = {
  0: "0",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px",
  112: "448px",
  128: "512px",
  144: "576px",
  160: "640px",
  176: "704px",
  192: "768px",
  208: "832px",
  224: "896px",
  240: "960px",
  256: "1024px",
  288: "1152px",
  320: "1280px",
  360: "1440px",
  400: "1600px",
  // Container queries
  "container-sm": "640px",
  "container-md": "768px",
  "container-lg": "1024px",
  "container-xl": "1280px",
  "container-2xl": "1536px",
};

// Border radius scale
const borderRadius = {
  none: "0",
  sm: "2px",
  DEFAULT: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px",
  // Custom radius
  button: "6px",
  card: "12px",
  modal: "16px",
  pill: "9999px",
};

// Font sizes scale (type scale)
const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.05em" }],
  sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
  base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
  lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
  xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.02em" }],
  "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
  "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.03em" }],
  "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
  "5xl": ["3rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
  "6xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
  "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.05em" }],
  "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.05em" }],
  "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.05em" }],
  // Display sizes
  "display-xs": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
  "display-sm": ["1.875rem", { lineHeight: "2.375rem", letterSpacing: "-0.02em" }],
  "display-md": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
  "display-lg": ["3rem", { lineHeight: "3.75rem", letterSpacing: "-0.03em" }],
  "display-xl": ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.03em" }],
  "display-2xl": ["4.5rem", { lineHeight: "5.5rem", letterSpacing: "-0.04em" }],
};

// Font weights scale
const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
  // Semantic weights
  body: "400",
  heading: "600",
  strong: "700",
};

// Letter spacing
const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
  // Custom
  "label-tight": "-0.02em",
  "label-wide": "0.05em",
};

// Line height
const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
  // Custom
  heading: "1.2",
  body: "1.6",
  caption: "1.4",
};

// Box shadow
const boxShadow = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  // Semantic shadows
  card: "0 2px 8px -2px rgb(0 0 0 / 0.1)",
  "card-hover": "0 8px 16px -4px rgb(0 0 0 / 0.12)",
  button: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  "button-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  dropdown: "0 4px 12px -2px rgb(0 0 0 / 0.15)",
  tooltip: "0 4px 8px -2px rgb(0 0 0 / 0.2)",
};

// Z-index scale
const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  max: 9999,
};

// Transition duration
const transitionDuration = {
  DEFAULT: "150ms",
  fast: "100ms",
  normal: "150ms",
  slow: "300ms",
  slower: "500ms",
};

// Transition timing functions
const transitionTimingFunction = {
  DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
  linear: "linear",
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  // Custom
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  "out-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "in-sine": "cubic-bezier(0.12, 0, 0.39, 0)",
};

// Animation keyframes
const keyframes = {
  fade: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  "fade-in": {
    from: { opacity: "0", transform: "translateY(-10px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "fade-out": {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
  "slide-in-right": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" },
  },
  "slide-in-left": {
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0)" },
  },
  "slide-in-up": {
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0)" },
  },
  "slide-in-down": {
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0)" },
  },
  scale: {
    from: { transform: "scale(0)" },
    to: { transform: "scale(1)" },
  },
  "scale-in": {
    from: { transform: "scale(0.9)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
  },
  spin: {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  ping: {
    "0%, 100%": { transform: "scale(1)", opacity: "1" },
    "75%, 100%": { transform: "scale(2)", opacity: "0" },
  },
  pulse: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0.5" },
  },
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-25%)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-1000px 0" },
    "100%": { backgroundPosition: "1000px 0" },
  },
};

// Animation durations
const animation = {
  none: "none",
  spin: "spin 1s linear infinite",
  ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  bounce: "bounce 1s infinite",
  fade: "fade 150ms ease-out",
  "fade-in": "fade-in 200ms ease-out",
  "fade-out": "fade-out 150ms ease-in",
  "slide-in-right": "slide-in-right 200ms ease-out",
  "slide-in-left": "slide-in-left 200ms ease-out",
  "slide-in-up": "slide-in-up 200ms ease-out",
  "slide-in-down": "slide-in-down 200ms ease-out",
  scale: "scale 200ms ease-out",
  "scale-in": "scale-in 200ms ease-out",
  shimmer: "shimmer 2s linear infinite",
};

// Container queries
const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      boxShadow,
      zIndex,
      transitionDuration,
      transitionTimingFunction,
      keyframes,
      animation,
      // Extend default theme
      screens: {
        xs: "475px",
        ...defaultTheme.screens,
      },
      // Border width
      borderWidth: {
        0: "0",
        1: "1px",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      // Min/Max widths
      maxWidth: {
        ...spacing,
        "prose": "65ch",
        "screen-sm": "640px",
        "screen-md": "768px",
        "screen-lg": "1024px",
        "screen-xl": "1280px",
        "screen-2xl": "1536px",
      },
      minWidth: {
        ...spacing,
        "prose": "35ch",
      },
      // Aspect ratio
      aspectRatio: {
        video: "16 / 9",
        square: "1 / 1",
        portrait: "3 / 4",
        landscape: "4 / 3",
        wide: "21 / 9",
        golden: "1.618 / 1",
      },
      // Backdrop blur
      backdropBlur: {
        xs: "2px",
      },
      // Gradient colors
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(var(--tw-gradient-stops))",
      },
      // Extend default font family
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

// Export shared class constants for use in components
export const sharedClasses = {
  // Layout
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  "container-sm": "max-w-2xl mx-auto px-4 sm:px-6",
  "container-md": "max-w-4xl mx-auto px-4 sm:px-6",
  "container-lg": "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",

  // Flexbox utilities
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    "col-center": "flex flex-col items-center justify-center",
  },

  // Spacing
  gap: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },

  // Padding
  p: {
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  },

  // Margin
  m: {
    xs: "m-1",
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
    xl: "m-8",
    auto: "m-auto",
  },

  // Typography
  text: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  },

  // Font weights
  font: {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },

  // Colors
  color: {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    muted: "text-neutral-500",
    dark: "text-neutral-900",
    light: "text-neutral-100",
  },

  // Backgrounds
  bg: {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    muted: "bg-neutral-100",
    dark: "bg-neutral-900",
    light: "bg-neutral-50",
  },

  // Borders
  border: {
    base: "border border-neutral-200",
    primary: "border border-primary",
    secondary: "border border-secondary",
    accent: "border border-accent",
  },

  // Border radius
  rounded: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
    button: "rounded-button",
    card: "rounded-card",
    pill: "rounded-pill",
  },

  // Shadows
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    card: "shadow-card",
    "card-hover": "shadow-card-hover",
    button: "shadow-button",
    modal: "shadow-modal",
  },

  // Transitions
  transition: {
    base: "transition-all duration-150 ease-in-out",
    fast: "transition-all duration-100 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
  },

  // Button variants
  button: {
    base: "inline-flex items-center justify-center rounded-button px-4 py-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary",
    accent: "bg-accent text-white hover:bg-accent-600 focus:ring-accent",
    outline: "border-2 border-primary text-primary hover:bg-primary-50 focus:ring-primary",
    ghost: "text-primary hover:bg-primary-50 focus:ring-primary",
    link: "text-primary underline-offset-4 hover:underline focus:ring-primary",
  },

  // Input variants
  input: {
    base: "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
    error: "border-error focus:border-error focus:ring-error/20",
    success: "border-success focus:border-success focus:ring-success/20",
  },

  // Card variants
  card: {
    base: "rounded-card border border-neutral-200 bg-white shadow-card",
    hover: "hover:shadow-card-hover transition-shadow duration-200",
    elevated: "shadow-lg border-neutral-200",
  },

  // Badge variants
  badge: {
    base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    error: "bg-error-100 text-error-700",
    neutral: "bg-neutral-100 text-neutral-700",
  },

  // Alert variants
  alert: {
    base: "rounded-lg p-4",
    info: "bg-info-50 border border-info-200 text-info-800",
    success: "bg-success-50 border border-success-200 text-success-800",
    warning: "bg-warning-50 border border-warning-200 text-warning-800",
    error: "bg-error-50 border border-error-200 text-error-800",
  },

  // Tooltip
  tooltip: {
    base: "z-tooltip rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-tooltip",
  },

  // Modal
  modal: {
    overlay: "fixed inset-0 z-modal bg-neutral-900/50 backdrop-blur-sm",
    content: "fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2 rounded-modal bg-white shadow-modal p-6",
  },

  // Dropdown
  dropdown: {
    base: "z-dropdown rounded-lg border border-neutral-200 bg-white shadow-dropdown p-1",
    item: "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors",
  },
} as const;

// Type inference for shared classes
export type SharedClasses = typeof sharedClasses;
