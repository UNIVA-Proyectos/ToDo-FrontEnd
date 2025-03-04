module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { 
      varsIgnorePattern: '^_|^(memo|Outlet|Chip|isSameMonth|DialogActions|ListItemSecondaryAction|ListItemText|faPaperclip|faXmark|faBars|faCheck|collection|addDoc|query|where|getDocs|orderBy|deleteDoc|WarningIcon|errorDelete|deleteComment|getPriorityIcon|TextField|customIcon|data|Divider|ListItemAvatar|ChevronRightIcon|userProfile|loading|handleNotificationsClick|handleProfileClick|Tooltip|Fade|FormControl|InputLabel|Select|MenuItem|faCalendarAlt|faTags|showAIHelper|setShowAIHelper|priorities|getDoc|Link|isDarkMode|IconButton|format|es|useEffect|faTags|Icon|codigosPais|formatPhoneNumber|width|height|generatePreview|onSnapshot|updateSharedUserInfo)$',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'error',
    'no-case-declarations': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
