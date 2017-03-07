
//
// ─── CONFIGURING ────────────────────────────────────────────────────────────────
//

    (require/config [
        paths: [
            vs: '../node_modules/monaco-editor/min/vs'
        ]
    ])

//
// ─── THEME ──────────────────────────────────────────────────────────────────────
//

    fix theme = [
        base: 'vs'
	    inherit: off
        foreground: 'f4f4f4'
	    rules: [
            [ token: 'keyword', foreground: 'B12CA8' ]
            [ token: 'string', foreground: '3C8412' ]
            [ token: 'comment', foreground: 'C7C4C2' ]
            [ token: 'holder', foreground: 'A56416' ]
            [ token: 'identifier', foreground: '3778B7' ]
            [ token: 'address', foreground: 'C94824' ]
            [ token: 'number', foreground: '348ACB' ]
        ]
    ]

//
// ─── COMPLETION DATA ────────────────────────────────────────────────────────────
//

    def collection = 
        | label         | insertText                                            |
        |---------------|-------------------------------------------------------|
        | "def"         | 'def {{name}}:\n\t{{}}\nend'                          |
        | "if"          | 'if {{condition}}:\n\t{{}}\nend'                      |
        | "if else"     | 'if {{condition}}:\n\t{{}}\nelse\n\t{{}}\nend'        |

//
// ─── REQUIRE ────────────────────────────────────────────────────────────────────
//

    @element = (document/getElementById "container")
    @settings = [
        value:          "def x = 10"
        language:       "karyscript"
        theme:          "karyfoundation"
        fontSize:       14
        fontFamily:     "Hasklig-Semibold"
        lineHeight:     24
    ]

    @procedure = do
        // language
        (monaco/languages/register [id: 'karyscript' ])
        (monaco/languages/setMonarchTokensProvider "karyscript" karyscript-grammar)

        // theme
        (monaco/editor/defineTheme "karyfoundation" theme)

        // completion
        collection = (collection/map to x do
                        x/kind = monaco/languages/CompletionItemKind/Keyword
                        return x 
                      end)

        fix completion-provider = [
            provideCompletionItems: do
                return collection
            end
        ]

        (monaco/languages/registerCompletionItemProvider 'karyscript' completion-provider)

        // done generating the repo
        def editor = (monaco/editor/create @element @settings)
    end

    @path = ['vs/editor/editor.main']
    (require @path @procedure)

// ────────────────────────────────────────────────────────────────────────────────

