import { URL } from "url";
import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString, WorkspaceConfiguration, ConfigurationChangeEvent, CompletionItemKind, ConfigurationTarget } from "vscode";
import * as extraCSSFile from "../extra Options/CSSOptions.json";

export function cssCompletion(context: ExtensionContext, config: WorkspaceConfiguration) {
	var extraCSS = JSON.parse(JSON.stringify(extraCSSFile));

	// reload config if it changes
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		config = workspace.getConfiguration("kw1c-template");
	});

	return languages.registerCompletionItemProvider("css", {
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
			// Dont suggest when something has been typed
			if (position.line > 2) {
				return undefined;
			}

			// Get trigger from settings
			var trigger = config.triggerWord;

			var extraCssConfig = config['Extras: CSS'];
			var addTime = config.addTime;
			var cssSnippet = extraCSS[extraCssConfig].join("\n");

			// Get the users' name from settings.
			let userName = config.Name;
			// Modify snippet
			cssSnippet = cssSnippet.replace("{DefaultHead}", extraCSS["defaultHead"].join("\n"));
			cssSnippet = cssSnippet.replace("{userName}", userName);
			// Dont add time
			if (!addTime) {
				cssSnippet = cssSnippet.replace(" $CURRENT_HOUR:$CURRENT_MINUTE", "");
			}

			const cssCompletion = new CompletionItem(trigger, CompletionItemKind.Constant);
			cssCompletion.insertText = new SnippetString(cssSnippet);
			cssCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [cssCompletion];
		},
	});
}
