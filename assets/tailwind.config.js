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
        sans: ["\"Comic Mono\"", "sans-serif"]
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
    minWidth: {
       '0': '0',
       'xs': '20rem',
       'sm': '24rem',
       'md': '28rem',
       'lg': '32rem',
       'xl': '36rem',
       '2xl': '42rem',
       '1/4': '25%',
       '1/2': '50%',
       '3/4': '75%',
       'full': '100%',
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
        'body': { color: config('theme.colors.gray.700') },
      })
    }),
  ],
}
