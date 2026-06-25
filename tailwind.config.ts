import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#8B0000', // Alias for easy usage
                'primary-red': '#8B0000', // Deep Bordeaux
                'primary-foreground': '#ffffff',
                'primary-gold': '#C5A059', // Matte Gold
                'primary-blue': '#1E3A5F', // Keeping as accent/legacy
                'bg-warm': '#fdfbf7',
                'text-main': '#1A202C', // Dark Anthracite
                'text-muted': '#4A5568', // Metallic Gray
                'border-muted': '#e2e8f0',

                // shadcn/ui semantic tokens (light theme)
                'background': '#ffffff',
                'foreground': '#1A202C',
                'card': '#ffffff',
                'card-foreground': '#1A202C',
                'popover': '#ffffff',
                'popover-foreground': '#1A202C',
                'secondary': '#f1f5f9',
                'secondary-foreground': '#1A202C',
                'muted': '#f1f5f9',
                'muted-foreground': '#64748b',
                'accent': '#f1f5f9',
                'accent-foreground': '#1A202C',
                'destructive': '#dc2626',
                'destructive-foreground': '#ffffff',
                'border': '#e2e8f0',
                'input': '#e2e8f0',
                'ring': '#8B0000',
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
