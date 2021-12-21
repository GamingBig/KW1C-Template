import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString, WorkspaceConfiguration, ConfigurationChangeEvent } from "vscode";
import * as extraHTMLFile from "../extra Options/HTMLOptions.json";

export function htmlCompletion(context: ExtensionContext, config: WorkspaceConfiguration){
    
    var extraHTML = JSON.parse(JSON.stringify(extraHTMLFile))

	// reload config if it changes
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		config = workspace.getConfiguration("kw1c-template")
	})


    return languages.registerCompletionItemProvider('html', {
		
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
            // Dont suggest when something has been typed
            if(document.lineCount > 3){
                return undefined;
            }
            
            // Get trigger from settings
            var configuration = workspace.getConfiguration("kw1c-template");
            var trigger = config.triggerWord
            
			var extraHtmlConfig = config.htmlExtras
			var addTime = config.addTime
			var htmlSnippet = extraHTML[extraHtmlConfig].join("\n")
			
			// Get the users' name from settings.
			let userName = config.Name
			// Modify snippet
			htmlSnippet = htmlSnippet.replace("{userName}", userName)
				// Dont add time
			if (!addTime) {
				htmlSnippet = htmlSnippet.replace(" $CURRENT_HOUR:$CURRENT_MINUTE", "")
			}

			const htmlCompletion = new CompletionItem(trigger);
			htmlCompletion.insertText = new SnippetString(
				htmlSnippet
			);
			htmlCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [htmlCompletion];
		}
    })
}