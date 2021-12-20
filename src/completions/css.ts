import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString } from "vscode";
import * as extraCSSFile from "../extra Options/extraCSS.json";

export function cssCompletion(context: ExtensionContext){
    
    var extraCSS = JSON.parse(JSON.stringify(extraCSSFile))

    return languages.registerCompletionItemProvider("css", {
		
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
            // Dont suggest when something has been typed
            if(document.lineCount > 3){
                return undefined;
            }

            // Get trigger from settings
            var configuration = workspace.getConfiguration("kw1c-template");
            var trigger = configuration.triggerWord

			var extraCssConfig = configuration.cssExtras
			var cssSnippet = extraCSS[extraCssConfig].join("\n")

			// Get the users' name from settings.
			let userName = configuration.Name
			cssSnippet = cssSnippet.replace("{userName}", userName)

			const cssCompletion = new CompletionItem(trigger);
			cssCompletion.insertText = new SnippetString(cssSnippet);
			cssCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [cssCompletion];
		}
	});
}