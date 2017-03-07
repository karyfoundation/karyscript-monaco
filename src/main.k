
//
// ─── CONFIGURING ────────────────────────────────────────────────────────────────
//

    (require/config [
        paths: [
            vs: '../node_modules/monaco-editor/min/vs'
        ]
    ])

//
// ─── REQUIRE ────────────────────────────────────────────────────────────────────
//

    @element = (document/getElementById "container")
    @settings = [
        value:      "var x = 10"
        language:   "javascript"
    ]

    @procedure = do
        def editor = (monaco/editor/create @element @settings)
    end

    @path = ['vs/editor/editor.main']
    (require @path @procedure)

// ────────────────────────────────────────────────────────────────────────────────