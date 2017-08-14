var KaryFoundation;
(function (KaryFoundation) {
    var Comment;
    (function (Comment) {
        var Style;
        (function (Style) {
            Style[Style["Section"] = 0] = "Section";
            Style[Style["Ending"] = 1] = "Ending";
        })(Style = Comment.Style || (Comment.Style = {}));
        ;
        function Generate(style, languageCharacter, tabSize, insertSpaces, text, flag) {
            oneLineCommentSign = languageCharacter;
            currentLineString = text;
            currentTabSize = tabSize;
            currentInsertSpacesStatus = insertSpaces;
            processCurrentLine();
            switch (style) {
                case Style.Section:
                    return generateSectionCommentBasedOnIndentation();
                case Style.Ending:
                    return onGenerateLineComment();
                default: return undefined;
            }
        }
        Comment.Generate = Generate;
        var commentLineCharacter = '\u2500';
        var lineFormat = /^\s*([a-z ]|[0-9][0-9\.]*)+\s*$/i;
        var oneLineCommentSign;
        var currentLineString;
        var currentInsertSpacesStatus;
        var currentTabSize;
        var linesFirstSpacing;
        var realIndentationSize;
        var relativeIndentationSize;
        function processCurrentLine() {
            linesFirstSpacing = getFirstSpacingOfTheLine();
            realIndentationSize = getRealIndentationSize();
            relativeIndentationSize = getKFCSRelativeIndentation(realIndentationSize);
        }
        function getFirstSpacingOfTheLine() {
            var tabs = 0;
            var spaces = 0;
            var index = 0;
            while (index < currentLineString.length) {
                switch (currentLineString[index]) {
                    case '\t':
                        tabs++;
                        index++;
                        break;
                    case ' ':
                        spaces++;
                        index++;
                        break;
                    default:
                        return { 'tabs': tabs, 'spaces': spaces };
                }
            }
            return { 'tabs': tabs, 'spaces': spaces };
        }
        function getRealIndentationSize() {
            return linesFirstSpacing.tabs + Math.floor(linesFirstSpacing.spaces / currentTabSize);
        }
        function getKFCSRelativeIndentation(realIndentation) {
            return Math.floor(realIndentation / 2);
        }
        function generateIndentation() {
            return repeat(' ', linesFirstSpacing.spaces) + computeTabs(linesFirstSpacing.tabs);
        }
        function repeat(text, times) {
            var result = '';
            for (var index = 0; index < times; index++) {
                result += text;
            }
            return result;
        }
        function computeTabs(tabs) {
            if (currentInsertSpacesStatus) {
                return repeat(' ', currentTabSize * tabs);
            }
            else {
                return repeat('\t', tabs);
            }
        }
        function generateAdditionalSpacingsForComments() {
            var spacings = "\n" + generateIndentation();
            if (relativeIndentationSize < 2) {
                spacings += computeTabs(1);
            }
            return spacings;
        }
        function generateSectionComment(width) {
            var text = currentLineString.toUpperCase().trim();
            var indentationText = generateIndentation();
            var result = "" + indentationText + oneLineCommentSign + "\n";
            result += "" + indentationText + oneLineCommentSign + " " + repeat(commentLineCharacter, 3) + " " + text + " " + repeat(commentLineCharacter, width - text.length - 5) + "\n";
            result += "" + indentationText + oneLineCommentSign + "\n";
            return result;
        }
        function generateInSectionComments() {
            var text = currentLineString.toUpperCase().trim();
            var indentationText = generateIndentation();
            var result = "" + indentationText + oneLineCommentSign + "\n";
            result += "" + indentationText + oneLineCommentSign + " " + text + "\n";
            result += "" + indentationText + oneLineCommentSign + "\n";
            return result;
        }
        function generateSectionCommentBasedOnIndentation() {
            var comment;
            switch (relativeIndentationSize) {
                case 0:
                    comment = generateSectionComment(80);
                    break;
                case 1:
                    comment = generateSectionComment(65);
                    break;
                default:
                    comment = generateInSectionComments();
                    break;
            }
            return comment + generateAdditionalSpacingsForComments();
        }
        function generateLineComment(width) {
            return "" + generateIndentation() + oneLineCommentSign + " " + repeat(commentLineCharacter, width - 1) + "\n";
        }
        function generateSeparatorComments() {
            return "" + generateIndentation() + oneLineCommentSign + " \u2022 \u2022 \u2022 \u2022 \u2022";
        }
        function onGenerateLineComment() {
            switch (relativeIndentationSize) {
                case 0:
                    return generateLineComment(80);
                case 1:
                    return generateLineComment(65);
                default:
                    return generateSeparatorComments();
            }
        }
    })(Comment = KaryFoundation.Comment || (KaryFoundation.Comment = {}));
})(KaryFoundation || (KaryFoundation = {}));
var KaryFoundation;
(function (KaryFoundation) {
    var Monaco;
    (function (Monaco) {
        function AddSupportingMonacoTools(editor) {
            AddSectionCommentCommand(editor);
            AddLineCommentCommand(editor);
        }
        Monaco.AddSupportingMonacoTools = AddSupportingMonacoTools;
        var lineFormat = /^\s*([a-z ]|[0-9][0-9\.]*)+\s*$/i;
        function AddSectionCommentCommand(editor) {
            editor.addAction({
                id: 'kary-comment-insert-section-comment',
                label: 'Insert Section Comment',
                keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_Y],
                keybindingContext: null,
                enablement: {
                    textFocus: true
                },
                run: function (ed) {
                    ExecuteAddComment(ed, KaryFoundation.Comment.Style.Section);
                    return null;
                }
            });
        }
        function AddLineCommentCommand(editor) {
            editor.addAction({
                id: 'kary-comment-insert-line-comment',
                label: 'Insert Line Comment',
                keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_L],
                keybindingContext: null,
                enablement: {
                    textFocus: true
                },
                run: function (ed) {
                    ExecuteAddComment(ed, KaryFoundation.Comment.Style.Ending);
                    return null;
                }
            });
        }
        function ExecuteAddComment(editor, style) {
            if (KaryFoundation.Comment.Style.Section === style) {
                makeCommentWithFormula(editor, function (line) {
                    return KaryFoundation.Comment.Generate(KaryFoundation.Comment.Style.Section, '//', 4, true, line);
                });
            }
            else {
                makeCommentWithFormula(editor, function (line) {
                    return KaryFoundation.Comment.Generate(KaryFoundation.Comment.Style.Ending, '//', 4, true, line);
                });
            }
        }
        Monaco.ExecuteAddComment = ExecuteAddComment;
        function makeCommentWithFormula(ed, formula) {
            var position = ed.getPosition();
            var line = getLine(ed.getValue(), position.lineNumber);
            var comment = formula(line);
            replaceComment(ed, comment, line.length + 1, position.lineNumber);
            cancelSelection(ed);
        }
        function replaceComment(ed, comment, lineLength, lineNumber) {
            ed.executeEdits("org.karyfoundation.comment-monaco", [{
                    identifier: {
                        major: 0,
                        minor: 0
                    },
                    range: new monaco.Range(lineNumber, 0, lineNumber, lineLength),
                    text: comment,
                    forceMoveMarkers: false
                }]);
        }
        function cancelSelection(ed) {
            var endingPosition = ed.getPosition();
            ed.setSelection({
                startLineNumber: endingPosition.lineNumber,
                startColumn: endingPosition.column,
                endLineNumber: endingPosition.lineNumber,
                endColumn: endingPosition.column,
            });
        }
        function getLine(text, line) {
            return text.split('\n')[line - 1];
        }
    })(Monaco = KaryFoundation.Monaco || (KaryFoundation.Monaco = {}));
})(KaryFoundation || (KaryFoundation = {}));
