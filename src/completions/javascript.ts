import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString, WorkspaceConfiguration, ConfigurationChangeEvent, CompletionItemKind } from "vscode";
import * as extraJSFile from "../extra Options/JSOptions.json";

export function jsCompletion(context: ExtensionContext, config: WorkspaceConfiguration) {
	var extraJS = JSON.parse(JSON.stringify(extraJSFile));
	// reload config if it changes
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		config = workspace.getConfiguration("kw1c-template");
	});

	return languages.registerCompletionItemProvider(["javascript", "typescript"], {
		async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
			// Dont suggest when something has been typed
			if (position.line > 2) {
				return undefined;
			}

			// Get trigger from settings
			var trigger = config.triggerWord;

			var extraJsConfig = config['Extras: Javascript'];
			var addTime = config.addTime;
			// Get the users' name from settings.
			let userName = config.Name;
			var jsSnippet = extraJS[extraJsConfig].join("\n");
			// Modify snippet
			jsSnippet = jsSnippet.replace("{DefaultHead}", extraJS["defaultHead"].join("\n"));
			jsSnippet = jsSnippet.replace("{userName}", userName);
			// Dont add time
			if (!addTime) {
				jsSnippet = jsSnippet.replace(" $CURRENT_HOUR:$CURRENT_MINUTE", "");
			}

			const jsCompletion = new CompletionItem(trigger, CompletionItemKind.Constant);
			jsCompletion.insertText = new SnippetString(jsSnippet);
			jsCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [jsCompletion];
		},
	});
}
