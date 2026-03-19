import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
    ...pluginVue.configs['flat/strongly-recommended'],
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