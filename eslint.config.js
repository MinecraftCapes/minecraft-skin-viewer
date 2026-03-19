import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            'prefer-const': [
                'error',
                {
                    destructuring: 'any',
                    ignoreReadBeforeAssign: false,
                },
            ],
        },
    },
    pluginJs.configs.recommended,
    eslintPluginPrettierRecommended,
]