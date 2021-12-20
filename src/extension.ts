// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, workspace, TextDocument, Position, CancellationToken, CompletionContext, CompletionItem, SnippetString, MarkdownString, languages } from "vscode";

// Import all completion files
import { jsCompletion } from "./completions/javascript";
import { htmlCompletion } from "./completions/html";
import { cssCompletion } from "./completions/css";

export function activate(context: ExtensionContext) {
	
	context.subscriptions.push(
		cssCompletion(context),
		jsCompletion(context),
		htmlCompletion(context)
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
