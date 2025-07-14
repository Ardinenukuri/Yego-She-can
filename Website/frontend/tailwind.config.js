/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                black: '#151515',
                white: '#FFFFFF',
                gray: {
                    light: '#F4F7FD',
                    medium: '#828FA3',
                    dark: '#2B2C37',
                    'v-dark': '#20212C',
                },
                #7c34ab: {
                    DEFAULT: '#635FC7',
                    hover: '#A8A4FF',
                    yego: '#6A1B9A',
                },
                red: {
                    DEFAULT: '#EA5555',
                    hover: '#FF9898',
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            fontSize: {
                'xl': ['24px', { lineHeight: '30px', fontWeight: '700' }],
                'lg': ['18px', { lineHeight: '23px', fontWeight: '700' }],
                'md': ['15px', { lineHeight: '19px', fontWeight: '700' }],
                'sm': ['12px', { lineHeight: '15px', fontWeight: '700' }],
                'body-lg': ['13px', { lineHeight: '23px', fontWeight: '500' }],
                'body-md': ['12px', { lineHeight: '15px', fontWeight: '700' }],
            },
        },
    },
    plugins: [],
}