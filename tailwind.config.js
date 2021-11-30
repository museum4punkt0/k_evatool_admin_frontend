module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {},
        },
    },
    variants: {
        extend: {
            cursor: ['disabled'],
            textOpacity: ['disabled'],
            textColor: ['disabled'],
            opacity: ['disabled'],
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
