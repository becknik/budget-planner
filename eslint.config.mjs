// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const patchedConfig = fixupConfigRules(compat.extends('next/core-web-vitals', 'next/typescript'));

const config = [
  ...patchedConfig,
  perfectionist.configs['recommended-natural'],
  importPlugin.flatConfigs.typescript,
  // importPlugin.flatConfigs.recommended,
  prettierConfigRecommended, // Last since it disables some previously set rules
  {
    rules: {
      '@typescript-eslint/method-signature-style': ['error', 'property'],

      'import/order': [
        'warn',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['builtin', 'type', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'builtin',
              pattern: 'react',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],

      'perfectionist/sort-imports': 0,

      'perfectionist/sort-jsx-props': 'warn',
      'perfectionist/sort-objects': 'warn',
    },
    settings: {
      perfectionist: {
        ignoreCase: false,
        partitionByComment: true,
        type: 'line-length',
      },
    },
  },
];

export default config;
