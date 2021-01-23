const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require('tailwindcss/plugin')


module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: [
      "./src/**/*.{ts,tsx,html}",
    ],
    options: {
      // whitelistPatterns: [/^bg-/, /^text-/],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["\"Nunito Sans\"", ...defaultTheme.fontFamily.sans]
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        }
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['active'],
      cursor: ['disabled'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addBase, config }) {
      addBase({
        'body': { color: config('theme.colors.gray.800') },
      })
    }),
  ],
}
