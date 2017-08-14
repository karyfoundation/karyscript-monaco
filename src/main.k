

zone KaryScriptMonaco:

    //
    // ─── INFORMATION ────────────────────────────────────────────────────────────────
    //

        mut editor

    //
    // ─── CONFIGURING ────────────────────────────────────────────────────────────────
    //

        (require/config [
            paths: [
                vs: './node_modules/monaco-editor/min/vs'
            ]
        ])

    //
    // ─── THEME ──────────────────────────────────────────────────────────────────────
    //

        object theme:
            base:       'vs'
            inherit:    off
            foreground: 'f7f7f7'
            rules:      | token             | foreground    |
                        |-------------------|---------------|
                        | 'keyword'         | 'B052A1'      |
                        | 'string'          | '3C8412'      |
                        | 'comment'         | 'cccccc'      |
                        | 'holder'          | 'A56416'      |
                        | 'identifier'      | '3778B7'      |
                        | 'address'         | 'A56416'      |
                        | 'number'          | '348ACB'      |
                        | 'type.identifier' | 'A56416'      |
                        | 'function.name'   | 'C94824'      |
            end

    //
    // ─── COMPLETION DATA ────────────────────────────────────────────────────────────
    //

        mut collection = 
            | label         | insertText                                            |
            |---------------|-------------------------------------------------------|
            | "def func"    | 'def {{name}}:\n\t{{}}\nend'                          |
            | "async func"  | 'async {{name}}:\n\t{{}}\nend'                        |
            | "if"          | 'if {{condition}}:\n\t{{}}\nend'                      |
            | "if else"     | 'if {{condition}}:\n\t{{}}\nelse\n\t{{}}\nend'        |
            | "unless"      | 'unless {{condition}}:\n\t{{}}\nend'                  |
            | "unless else" | 'unless {{condition}}:\n\t{{}}\nelse\n\t{{}}\nend'    |
            | "for up"      | 'for {{start}} up to {{end}}:\n\t{{}}\nend'           |
            | "for down"    | 'for {{start}} down to {{end}}:\n\t{{}}\nend'         |
            | "for of"      | 'for {{x}} of {{y}}:\n\t{{}}\nend'                    |
            | "for in"      | 'for {{x}} in {{y}}:\n\t{{}}\nend'                    |
            | "for of when" | 'for {{x}} of {{y}} when {{condition}}:\n\t{{}}\nend' |
            | "for in when" | 'for {{x}} in {{y}} when {{condition}}:\n\t{{}}\nend' |

    //
    // ─── INITIALIZER ────────────────────────────────────────────────────────────────
    //

        // holders
        @settings = [
            value:          ""
            language:       "karyscript"
            theme:          "karyfoundation"
            fontSize:       14
            fontFamily:     "Hasklig-Semibold"
            fontLigatures:  on
            lineHeight:     28
        ]

        @procedure = do
            // language
            (monaco/languages/register [ id: 'karyscript' ])
            (monaco/languages/setMonarchTokensProvider "karyscript" karyscript-grammar)

            // theme
            (monaco/editor/defineTheme "karyfoundation" theme)

            // completion
            collection /= (map to x do
                            x/kind = monaco/languages/CompletionItemKind/Keyword
                            return x
                        end)

            object completion-provider:
                provideCompletionItems: do
                    return collection
                end
            end

            (monaco/languages/registerCompletionItemProvider 'karyscript' completion-provider)

            // done generating the repo
            @element = (document/getElementById containerId)
            editor = (monaco/editor/create @element @settings)

            (KaryFoundation/Monaco/AddSupportingMonacoTools editor)
        end

        // body
        usable def Init containerId:
            // setup
            @path = ['vs/editor/editor.main']
            (require @path @procedure)

            // a simple event
            (setup-events)

            // and done, giving user our pointer
            return editor
        end

    //
    // ─── SET EVENTS ─────────────────────────────────────────────────────────────────
    //

        def setup-events:    
            window/onresize = do
                if editor != ufo:
                    (editor/layout)
                end
            end
        end

    // ────────────────────────────────────────────────────────────────────────────────

end
