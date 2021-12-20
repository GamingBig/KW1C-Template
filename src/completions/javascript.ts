import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString } from "vscode";

export function jsCompletion(context: ExtensionContext){

    return languages.registerCompletionItemProvider("javascript", {
		
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
            // Dont suggest when something has been typed
            if(document.lineCount > 3){
                return undefined;
            }

            // Get trigger from settings
            var configuration = workspace.getConfiguration("kw1c-template");
            var trigger = configuration.triggerWord

			// Get the users' name from settings.
			let userName = configuration.Name

			const jsCompletion = new CompletionItem(trigger);
			jsCompletion.insertText = new SnippetString(
			'/*\n' +
				'\tAuteur: '+userName+'\n' +
				'\tAanmaakdatum: $CURRENT_DATE/$CURRENT_MONTH/$CURRENT_YEAR $CURRENT_HOUR:$CURRENT_MINUTE\n' +
			'\n' +
				'\tOmschrijving: ${3:Omschrijving}\n' +
			'*/\n' +
			'\n' +
			'$0'
			);
			jsCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [jsCompletion];
		}
    })
}