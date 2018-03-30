/**
 * Created by apple on 16/7/23.
 */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// Inspired by https://github.com/airbnb/javascript but less opinionated.

// We use eslint-loader so even warnings are very visibile.
// This is why we only use "WARNING" level for potential errors,
// and we don't use "ERROR" level at all.

// In the future, we might create a separate list of rules for production.
// It would probably be more strict.

var WARNING = 1;

module.exports = {
  root: true,

  parser: "babel-eslint",

  plugins: ["jest" /*, 'import'*/],

  env: {
    es6: true,
    commonjs: true,
    browser: true
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true
    }
  },

  settings: {
    "import/ignore": [
      "node_modules",
      "\\.(json|css|jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$"
    ],
    "import/extensions": [".js"],
    "import/resolver": {
      node: {
        extensions: [".js", ".json"]
      }
    }
  },

  rules: {
    // http://eslint.org/docs/rules/
    "array-callback-return": WARNING,
    "default-case": [WARNING, { commentPattern: "^no default$" }],
    "dot-location": [WARNING, "property"],
    eqeqeq: [WARNING, "allow-null"],
    "guard-for-in": WARNING,
    "new-cap": [WARNING, { newIsCap: true }],
    "new-parens": WARNING,
    "no-array-constructor": WARNING,
    "no-caller": WARNING,
    "no-cond-assign": [WARNING, "always"],
    "no-const-assign": WARNING,
    "no-control-regex": WARNING,
    "no-delete-var": WARNING,
    "no-dupe-args": WARNING,
    "no-dupe-class-members": WARNING,
    "no-dupe-keys": WARNING,
    "no-duplicate-case": WARNING,
    "no-empty-character-class": WARNING,
    "no-empty-pattern": WARNING,
    "no-eval": WARNING,
    "no-ex-assign": WARNING,
    "no-extend-native": WARNING,
    "no-extra-bind": WARNING,
    "no-extra-label": WARNING,
    "no-fallthrough": WARNING,
    "no-func-assign": WARNING,
    "no-implied-eval": WARNING,
    "no-invalid-regexp": WARNING,
    "no-iterator": WARNING,
    "no-label-var": WARNING,
    "no-labels": [WARNING, { allowLoop: false, allowSwitch: false }],
    "no-lone-blocks": WARNING,
    "no-loop-func": WARNING,
    "no-mixed-operators": [
      WARNING,
      {
        groups: [
          ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"]
        ],
        allowSamePrecedence: false
      }
    ],
    "no-multi-str": WARNING,
    "no-native-reassign": WARNING,
    "no-negated-in-lhs": WARNING,
    "no-new-func": WARNING,
    "no-new-object": WARNING,
    "no-new-symbol": WARNING,
    "no-new-wrappers": WARNING,
    "no-obj-calls": WARNING,
    "no-octal": WARNING,
    "no-octal-escape": WARNING,
    "no-redeclare": WARNING,
    "no-regex-spaces": WARNING,
    "no-restricted-syntax": [WARNING, "LabeledStatement", "WithStatement"],
    "no-return-assign": WARNING,
    "no-script-url": WARNING,
    "no-self-assign": WARNING,
    "no-self-compare": WARNING,
    "no-sequences": WARNING,
    "no-shadow-restricted-names": WARNING,
    "no-sparse-arrays": WARNING,
    "no-this-before-super": WARNING,
    "no-throw-literal": WARNING,
    "no-undef": WARNING,
    "no-unexpected-multiline": WARNING,
    "no-unreachable": WARNING,
    "no-unused-expressions": WARNING,
    "no-unused-labels": WARNING,
    "no-unused-vars": [WARNING, { vars: "local", args: "none" }],
    "no-use-before-define": [WARNING, "nofunc"],
    "no-useless-computed-key": WARNING,
    "no-useless-concat": WARNING,
    "no-useless-constructor": WARNING,
    "no-useless-escape": WARNING,
    "no-useless-rename": [
      WARNING,
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false
      }
    ],
    "no-with": WARNING,
    "no-whitespace-before-property": WARNING,
    "operator-assignment": [WARNING, "always"],
    radix: WARNING,
    "require-yield": WARNING,
    "rest-spread-spacing": [WARNING, "never"],
    strict: [WARNING, "never"],
    "unicode-bom": [WARNING, "never"],
    "use-isnan": WARNING,
    "valid-typeof": WARNING,
  }
};
