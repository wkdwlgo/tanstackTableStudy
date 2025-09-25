import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // 무시 폴더
  { ignores: ['dist'] },

  // 베이스 추천 규칙
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React 관련 추천 규칙
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,

  // 우리 프로젝트 공통 규칙
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // import 정렬 & export 정렬
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      // 미사용 import 제거
      'unused-imports/no-unused-imports': 'warn',
    },
  },

  // 마지막에 Prettier와 충돌나는 규칙 끄기
  configPrettier,
]
