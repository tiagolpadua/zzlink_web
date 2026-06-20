import { fileURLToPath } from 'node:url'
import path from 'node:path'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import unicorn from 'eslint-plugin-unicorn'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript strict + stylistic rules (requires type info)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Unicorn recommended — opinionated but widely adopted best practices
  unicorn.configs.recommended,

  // Project-wide TypeScript parser config
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },

  // Source files — project-specific rules
  {
    files: ['src/**/*.ts', 'src/**/*.d.ts'],
    rules: {
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'prefer-const': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Unicorn overrides — too aggressive for a small vanilla TS project
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      // Alpine.js components use `this` intentionally inside object literals
      'unicorn/no-this-outside-of-class': 'off',
      // Assigning to window.zzlink is the Alpine global registration pattern
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/prefer-global-this': 'off',
      // File naming follows Vite/TS conventions
      'unicorn/name-replacements': 'off',
    },
  },

  // Config files — no type-checking needed, relax strictness
  {
    files: ['*.config.ts', '*.config.js'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      'no-console': 'off',
      'unicorn/prefer-module': 'off',
    },
  },

  // Prettier: disable formatting rules that conflict, then enforce via plugin
  // Must come last so it overrides any formatting rules above
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Global ignores
  {
    ignores: ['dist/', 'node_modules/', 'src/**/*.js'],
  },
)
