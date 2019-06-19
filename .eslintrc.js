module.exports = {
  root: true,
  globals: {
    wx: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    "browser": true,
    "es6": true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy', '.wxml']
  },
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    "quotes": [1, "single"],
    "semi": 2,
    "max-len": [1, 150, 2],
    "arrow-body-style": [1, "as-needed"],
    "comma-dangle": [2, "never"],
    "object-curly-spacing": 0,
    "no-console": 1,
    "no-param-reassign": [1, {
      "props": false
    }],
    "consistent-return": 1,
    "no-alert": 0, //禁止使用alert confirm prompt
    "no-array-constructor": 2, //禁止使用数组构造器
    "no-bitwise": 0, //禁止使用按位运算符
    "no-caller": 1, //禁止使用arguments.caller或arguments.callee
    "no-catch-shadow": 2, //禁止catch子句参数与外部作用域变量同名
    "no-class-assign": 2, //禁止给类赋值
    "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-constant-condition": 2, //禁止在条件中使用常量表达式 if(true) if(1)
    "no-continue": 0, //禁止使用continue
    "no-control-regex": 2, //禁止在正则表达式中使用控制字符
    "no-delete-var": 2, //不能对var声明的变量使用delete操作符
    "no-div-regex": 1, //不能使用看起来像除法的正则表达式/=foo/
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-dupe-args": 2, //函数参数不能重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-else-return": 2, //如果if语句里面有return,后面不能跟else语句
    "no-empty": 2, //块语句中的内容不能为空
    "no-empty-character-class": 2, //正则表达式中的[]内容不能为空
    // "no-empty-label": 2,//禁止使用空label
    "no-eq-null": 2, //禁止对null使用==或!=运算符
    "no-eval": 1, //禁止使用eval
    "no-ex-assign": 2, //禁止给catch语句中的异常参数赋值
    "no-extend-native": 2, //禁止扩展native对象
    "no-extra-bind": 2, //禁止不必要的函数绑定
    "no-extra-boolean-cast": 2, //禁止不必要的bool转换
    "no-extra-parens": 2, //禁止非必要的括号
    "no-extra-semi": 2, //禁止多余的冒号
    "no-fallthrough": 1, //禁止switch穿透
    "no-floating-decimal": 2, //禁止省略浮点数中的0 .5 3.
    "no-func-assign": 2, //禁止重复的函数声明
    "no-implicit-coercion": 1, //禁止隐式转换
    "no-implied-eval": 2, //禁止使用隐式eval
    "no-inner-declarations": [2, "functions"], //禁止在块语句中使用声明（变量或函数）
    "no-invalid-regexp": 2, //禁止无效的正则表达式
    "no-invalid-this": 2, //禁止无效的this，只能用在构造器，类，对象字面量
    "no-irregular-whitespace": 2, //不能有不规则的空格
  }
}
