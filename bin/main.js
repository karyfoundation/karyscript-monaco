require.config({paths: {vs: "..\/node_modules\/monaco-editor\/min\/vs"}}); const theme = {base: "vs", inherit: false, foreground: "f4f4f4", rules: [{token: "keyword", foreground: "B12CA8"}, {token: "string", foreground: "3C8412"}, {token: "comment", foreground: "C7C4C2"}, {token: "holder", foreground: "A56416"}, {token: "identifier", foreground: "3778B7"}, {token: "address", foreground: "C94824"}, {token: "number", foreground: "348ACB"}, {token: "type.identifier", foreground: "A56416"}]}; var collection = [{label: "def func", insertText: "def {{name}}:\n\t{{}}\nend"}, {label: "async func", insertText: "async {{name}}:\n\t{{}}\nend"}, {label: "if", insertText: "if {{condition}}:\n\t{{}}\nend"}, {label: "if else", insertText: "if {{condition}}:\n\t{{}}\nelse\n\t{{}}\nend"}, {label: "unless", insertText: "unless {{condition}}:\n\t{{}}\nend"}, {label: "unless else", insertText: "unless {{condition}}:\n\t{{}}\nelse\n\t{{}}\nend"}, {label: "for up", insertText: "for {{start}} up to {{end}}:\n\t{{}}\nend"}, {label: "for down", insertText: "for {{start}} down to {{end}}:\n\t{{}}\nend"}, {label: "for of", insertText: "for {{x}} of {{y}}:\n\t{{}}\nend"}, {label: "for in", insertText: "for {{x}} in {{y}}:\n\t{{}}\nend"}, {label: "for of when", insertText: "for {{x}} of {{y}} when {{condition}}:\n\t{{}}\nend"}, {label: "for in when", insertText: "for {{x}} in {{y}} when {{condition}}:\n\t{{}}\nend"}]; require(["vs\/editor\/editor.main"], () => { monaco.languages.register({id: "karyscript"}); monaco.languages.setMonarchTokensProvider("karyscript", karyscript_grammar); monaco.editor.defineTheme("karyfoundation", theme); collection = collection.map(x => { x.kind = monaco.languages.CompletionItemKind.Keyword; return x; ;  }); const completion_provider = {provideCompletionItems: () => { return collection; ;  }}; monaco.languages.registerCompletionItemProvider("karyscript", completion_provider); let editor = monaco.editor.create(document.getElementById("container"), {value: "def x = 10", language: "karyscript", theme: "karyfoundation", fontSize: 14, fontFamily: "Hasklig-Semibold", lineHeight: 24});  }); 
//# sourceMappingURL=main.map.js