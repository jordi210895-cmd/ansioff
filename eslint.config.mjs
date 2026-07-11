import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'android/.gradle/**',
    'android/build/**',
    'android/app/build/**',
    'android/app/src/main/assets/public/**',
    'ios/build/**',
    'ios/App/App/public/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]);
