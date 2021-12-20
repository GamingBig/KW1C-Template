import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString } from "vscode";
import * as extraHTMLFile from "../extra Options/extraHTML.json";

export function htmlCompletion(context: ExtensionContext){
    
    var extraHTML = JSON.parse(JSON.stringify(extraHTMLFile))

    return languages.registerCompletionItemProvider('html', {
		
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
            // Dont suggest when something has been typed
            if(document.lineCount > 3){
                return undefined;
            }
            
            // Get trigger from settings
            var configuration = workspace.getConfiguration("kw1c-template");
            var trigger = configuration.triggerWord
            
			var extraHtmlConfig = configuration.htmlExtras
			var htmlSnippet = extraHTML[extraHtmlConfig].join("\n")
			
			// Get the users' name from settings.
			let userName = configuration.Name
			htmlSnippet = htmlSnippet.replace("{userName}", userName)

			const htmlCompletion = new CompletionItem(trigger);
			htmlCompletion.insertText = new SnippetString(
				htmlSnippet
			);
			htmlCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [htmlCompletion];
		}
    })
}