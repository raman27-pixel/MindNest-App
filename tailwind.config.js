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
        clay: {
          bg: '#F4F7FB',
          card: '#FFFFFF',
          sidebar: '#EDF2F7',
          text: '#1E2330',
          muted: '#627084',
          border: '#E1E7F0',
        },
        saathi: {
          primary: '#0E8765',
          primaryHover: '#0B6D52',
          primaryDark: '#08533E',
          teal: '#0E8765',
          softBlue: '#E6F0FA',
          softGreen: '#E6F5EF',
          softPeach: '#FDEEE9',
          softLavender: '#F0EEFD',
          softYellow: '#FEF8E7',
          background: '#F4F7FB',
          card: '#FFFFFF',
          text: '#1E2330',
          subtext: '#627084',
        },
        mindnest: {
          primary: '#0E8765',
          primaryHover: '#0B6D52',
          secondary: '#1A9D7C',
          secondaryHover: '#137E63',
          accent: '#FF8A65',
          background: '#F4F7FB',
          card: '#FFFFFF',
          success: '#0E8765',
          warning: '#F2994A',
          alert: '#EB5757',
          text: '#1E2330',
          subtext: '#627084',
        }
      },
      borderRadius: {
        'clay-sm': '16px',
        'clay-md': '20px',
        'clay-btn': '22px',
        'clay-card': '26px',
        'clay-panel': '32px',
        'clay-pill': '9999px',
      },
      boxShadow: {
        'clay-sm': '4px 4px 10px rgba(180, 192, 210, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.95)',
        'clay-card': '6px 8px 20px rgba(160, 178, 200, 0.28), -6px -8px 20px rgba(255, 255, 255, 0.95)',
        'clay-btn': '4px 6px 14px rgba(14, 135, 101, 0.25), -4px -4px 12px rgba(255, 255, 255, 0.9)',
        'clay-inset': 'inset 3px 3px 6px rgba(160, 178, 200, 0.25), inset -3px -3px 6px rgba(255, 255, 255, 0.85)',
        'clay-hover': '8px 12px 24px rgba(140, 160, 185, 0.35), -8px -8px 20px rgba(255, 255, 255, 0.95)',
        'clay-primary': '4px 6px 16px rgba(14, 135, 101, 0.35), -4px -4px 14px rgba(255, 255, 255, 0.85)',
        'clay-teal': '4px 6px 16px rgba(14, 135, 101, 0.35), -4px -4px 14px rgba(255, 255, 255, 0.85)',
      },
      fontSize: {
        'patient-heading': ['36px', '44px'],
        'patient-subheading': ['28px', '36px'],
        'patient-body': ['22px', '32px'],
        'patient-btn': ['20px', '28px'],
        'caregiver-heading': ['28px', '34px'],
        'caregiver-body': ['16px', '24px'],
      }
    },
  },
  plugins: [],
}
