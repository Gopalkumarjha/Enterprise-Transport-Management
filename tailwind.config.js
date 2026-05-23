export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        graphite: '#111827',
        steel: '#475569',
        mint: '#12b981',
        signal: '#2563eb',
        amberline: '#f59e0b'
      },
      boxShadow: {
        panel: '0 18px 45px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
