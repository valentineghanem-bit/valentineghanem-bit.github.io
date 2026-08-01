module.exports = {
  darkMode: 'class',
  content: [
    './*.{html,md}',
    './**/*.{html,md,js,yml}'
  ],
  theme: {
    extend: {
      colors: {
        mint: '#34D399',
        crimson: '#EF4444',
        brandDark: '#0B1120',
        cardDark: '#1E293B',
        emeraldDeep: '#064E3B'
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    }
  },
  plugins: []
};
