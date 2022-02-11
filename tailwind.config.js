const path = require('path')
const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        path.resolve(__dirname, './node_modules/litepie-datepicker/**/*.js'),
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'litepie-primary': colors.blue, // color system for light mode
                'litepie-secondary': colors.coolGray, // color system for dark mode
                blue: {
                    900: '#1c1cbe',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
