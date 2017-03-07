
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
            [ token: 'holder', foreground: 'C18000' ]
            [ token: 'identifier', foreground: '348ACB' ]
            [ token: 'address', foreground: 'CD4602' ]
            [ token: 'number', foreground: '348ACB' ]
        ]
    ]

//
// ─── REQUIRE ────────────────────────────────────────────────────────────────────
//

    @element = (document/getElementById "container")
    @settings = [
        value:      "def x = 10"
        language:   "karyscript"
        theme:      "karyfoundation"
        fontSize:   14
    ]

    @procedure = do
        // language
        (monaco/languages/register [id: 'karyscript' ])
        (monaco/languages/setMonarchTokensProvider "karyscript" karyscript-grammar)

        // theme
        (monaco/editor/defineTheme "karyfoundation" theme)

        def editor = (monaco/editor/create @element @settings)
    end

    @path = ['vs/editor/editor.main']
    (require @path @procedure)

// ────────────────────────────────────────────────────────────────────────────────

