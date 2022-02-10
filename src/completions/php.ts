import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString, WorkspaceConfiguration, ConfigurationChangeEvent, CompletionItemKind } from "vscode";
import * as extraPHPFile from "../extra Options/PHPOptions.json";

export function phpCompletion(context: ExtensionContext, config: WorkspaceConfiguration) {
	var extraPHP = JSON.parse(JSON.stringify(extraPHPFile));

	// reload config if it changes
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		config = workspace.getConfiguration("kw1c-template");
	});

	return languages.registerCompletionItemProvider("php", {
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
			// Dont suggest when something has been typed
			if (position.line > 2) {
				return undefined;
			}

			// Get trigger from settings
			var trigger = config.triggerWord;

			var extraPhpConfig = config['Extras: PHP'];
			var addTime = config.addTime;
			var phpSnippet:string = extraPHP[extraPhpConfig].join("\n");

			// Get the users' name from settings.
			let userName = config.Name;
			let cssFileLoc = config.defaultCssFile;
			let jsFileLoc = config.defaultJavascriptFile;
			// Modify snippet
			phpSnippet = phpSnippet.replace("{DefaultHead}", extraPHP["defaultHead"].join("\n"));
			phpSnippet = phpSnippet.replace("{userName}", userName);
			phpSnippet = phpSnippet.replace("--cssFileLoc--", cssFileLoc);
			if(config.JavascriptTagInPHP){
				phpSnippet = phpSnippet.replace("--jsFileLoc--", jsFileLoc);
			}else{
				// Remove JS tag
				phpSnippet = phpSnippet.replace(/\${7(.|\r|\n)*\<\/script\>}/g, "")
			}
			if (!config.addLangAttribute) {
				phpSnippet = phpSnippet.replace(" lang=\"nl\"", "")
			}
			// Dont add time
			if (!addTime) {
				phpSnippet = phpSnippet.replace(" $CURRENT_HOUR:$CURRENT_MINUTE", "");
			}

			const phpCompletion = new CompletionItem(trigger, CompletionItemKind.Constant);
			phpCompletion.insertText = new SnippetString(phpSnippet);
			phpCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [phpCompletion];
		},
	});
}
