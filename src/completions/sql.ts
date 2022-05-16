import { URL } from "url";
import { ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, workspace, CompletionItem, SnippetString, MarkdownString, WorkspaceConfiguration, ConfigurationChangeEvent, CompletionItemKind, ConfigurationTarget } from "vscode";
import * as extraSqlFile from "../extra Options/SQLOptions.json";

export function sqlCompletion(context: ExtensionContext, config: WorkspaceConfiguration) {
	var extraSql = JSON.parse(JSON.stringify(extraSqlFile));

	// reload config if it changes
	workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
		config = workspace.getConfiguration("kw1c-template");
	});

	return languages.registerCompletionItemProvider("sql", {
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
			// Dont suggest when something has been typed
			if (position.line > 2) {
				return undefined;
			}

			// Get trigger from settings
			var trigger = config.triggerWord;

			var extraSqlConfig = config["Extras: SQL"];
			var addTime = config.addTime;
			var sqlSnippet = extraSql[extraSqlConfig].join("\n");

			// Get the users' name from settings.
			let userName = config.Name;
			// Modify snippet
			sqlSnippet = sqlSnippet.replace("{DefaultHead}", extraSql["defaultHead"].join("\n"));
			sqlSnippet = sqlSnippet.replace("{userName}", userName);
			// Dont add time
			if (!addTime) {
				sqlSnippet = sqlSnippet.replace(" $CURRENT_HOUR:$CURRENT_MINUTE", "");
			}

			const sqlCompletion = new CompletionItem(trigger, CompletionItemKind.Constant);
			sqlCompletion.insertText = new SnippetString(sqlSnippet);
			sqlCompletion.documentation = new MarkdownString("Inserts a snippet so you can get on with coding your project.");

			return [sqlCompletion];
		},
	});
}
