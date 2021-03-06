// Create your own language definition here
// You can safely look at other samples without losing modifications.
// Modifications are not saved on browser refresh/close though -- copy often!
karyscript_grammar = {
  tokenPostfix: '.k',

  keywords: [
    'end', 'def', 'unless', 'also', 'and', 'or', 'not', 'ufo', 'sub', 'mul', 'div', 'sum',
    'pow', 'mod', 'on', 'off', 'true', 'false', 'yes', 'no', 'not', 'cat', 'print', 'nan',
    'fix', 'use', 'up', 'down', 'to', 'via', 'clone', 'zone', 'when', 'is', 'isnt',
    'out', 'let', 'var', 'const', 'class', 'function', 'import', 'from', 'for', 'of', 'in',
    'while', 'continue', 'debugger', 'delete', 'do', 'export', 'extends', 'if', 'else',
    'switch', 'case', 'default', 'try', 'catch', 'finally', 'NaN', 'null', 'undefined',
    'typeof', 'instanceof', 'new', 'return', 'super', 'throw', 'void', 'with', 'yield',
    'async', 'object', 'array', 'mut'
  ],

  // define our own brackets as '<' and '>' do not match in javascript
  brackets: [
    ['{','}','bracket.curly'],
    ['[',']','bracket.square']
  ],


  // symbols and stuff
  symbols:  /[~!@#%\^&*-+=|\\:`<>.?\/]+/,
  escapes:  /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
  exponent: /[eE][\-+]?[0-9]+/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  tokenizer: {
    root: [

      // address
      [/([a-zK-Z_$@][\w\-$]*\/)+/, 'address'],

      // identifier
      [/[a-zA-Z0-9_$@][\w-$]*/, { cases: { '@keywords' : { cases: { 'def': { token: 'keyword', next: '@functionName' }
                                                  , '@default': 'keyword' }},
                                    '@default': 'identifier' } }],
      [/[A-Z][\w-\$]*/, 'type.identifier' ],  // to show class names nicely

      // holders
      [/@[a-zA-Z0-9_$@][\w-$]*/, 'holder'],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an operator)
      [/\/(?=([^\\\/]|\\.)+\/)[gmiys]*/, {
        token: 'regexp.slash', bracket: '@open', next: '@regexp'}],

      // delimiters
      [/[{}\[\]]/, '@brackets'],
      [/[,\/]/, 'delimiter'],

      [ /\(/, {
        token: 'bracket.parenthesis', bracket: '@open', next: '@functionName'
      }],

      [ /\)/, {
        token: 'bracket.parenthesis', bracket: '@close'
      }],

      // numbers
      [/\d+\.\d*(@exponent)?/, 'number.float'],
      [/\.\d+(@exponent)?/, 'number.float'],
      [/\d+@exponent/, 'number.float'],
      [/0[xX][\da-fA-F]+/, 'number.hex'],
      [/0[0-7]+/, 'number.octal'],
      [/\d+/, 'number'],

      // strings: recover on non-terminated strings
      [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
      [/"/,  'string', '@string."' ],
      [/'/,  'string', '@string.\'' ],
    ],

    functionName: [ [ /[a-zA-Z0-9_$@][\w-$\/]*/, 'function.name', '@pop'] ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/,       'comment', '@comment' ],
      [/\/\/.*$/,    'comment'],
    ],

    comment: [
      [/[^\/*]+/, 'comment' ],
      [/\/\*/,    'comment.invalid' ],
      ["\\*/",    'comment', '@pop' ],
      [/[\/*]/,   'comment' ],
    ],

    string: [
      [/[^\\"'#]+/, 'string'],
      [/#/,        'keyword.bracket.parenthesis', '@interpolated' ],
      [/@escapes/, 'string.escape'],
      [/\\./,      'string.escape.invalid'],
      [/["']/,     { cases: { '$#==$S2' : { token: 'string', next: '@pop' },
                              '@default': 'string' }} ],
    ],


    // interpolated sequence
    interpolated: [
      [/[\(]/, { token: 'bracket.parenthesis', bracket: '@open', switchTo: '@interpolated_compound' }],
    ],

    // any code
    interpolated_compound: [
      [/[\)]/, { token: 'bracket.parenthesis', bracket: '@close', next: '@pop'} ],
      { include: '@root' },
    ],


    // We match regular expression quite precisely
    regexp: [
      [/(\{)(\d+(?:,\d*)?)(\})/, ['@brackets.regexp.escape.control', 'regexp.escape.control', '@brackets.regexp.escape.control'] ],
      [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['@brackets.regexp.escape.control',{ token: 'regexp.escape.control', next: '@regexrange'}]],
      [/(\()(\?:|\?=|\?!)/, ['@brackets.regexp.escape.control','regexp.escape.control'] ],
      [/[()]/,        '@brackets.regexp.escape.control'],
      [/@regexpctl/,  'regexp.escape.control'],
      [/[^\\\/]/,     'regexp' ],
      [/@regexpesc/,  'regexp.escape' ],
      [/\\\./,        'regexp.invalid' ],
      ['/',           { token: 'regexp.slash', bracket: '@close'}, '@pop' ],
    ],

    regexrange: [
      [/-/,     'regexp.escape.control'],
      [/\^/,    'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [/\]/,    '@brackets.regexp.escape.control', '@pop'],
    ],
  },
};