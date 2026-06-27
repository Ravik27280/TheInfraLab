/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Matte palette colors
        matte: {
          bg: '#10232A',      // Deep Space Slate
          steel: '#3D4D55',   // Muted Steel Slate
          gray: '#A79E9C',    // Matte Warm Gray
          cream: '#D3C3B9',   // Soft Warm Cream
          copper: '#B58863',  // Matte Copper/Sand
          black: '#161616',   // Rich Velvet Black
        },
        // Dark mode colors mapped to Matte palette
        dark: {
          bg: '#10232A',
          surface: '#3D4D55',
          card: '#161616',
          border: 'rgba(255, 255, 255, 0.05)',
          text: {
            primary: '#D3C3B9',
            secondary: '#A79E9C',
          }
        },
        // Light mode colors
        light: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: {
            primary: '#0F172A',
            secondary: '#64748B',
          }
        },
        // Primary colors mapped to Matte Copper
        primary: {
          DEFAULT: '#B58863',
          light: '#c49874',
          dark: '#a1744f',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        'app': '12px',
        'app-lg': '16px',
      },
      boxShadow: {
        'app': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'app-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
