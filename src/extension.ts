import { ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, window, workspace } from "vscode";

// Import all completion files
import { jsCompletion } from "./completions/javascript";
import { htmlCompletion } from "./completions/html";
import { cssCompletion } from "./completions/css";

export function activate(context: ExtensionContext) {
	var config = workspace.getConfiguration("kw1c-template");

	//! Ask user to input their name
	if (config.Name == "You can add your name in settings.") {
		var msgBox = window.showInformationMessage("Do you want to input your name to add to the template? (Reccomended)", ...["Sure", "No"]);
		msgBox.then((selection) => {
			if (selection == "Sure") {
				window.showInputBox().then((value) => {
					if (value == undefined) {
						window.showInformationMessage("You can always change your name in settings.");
					} else {
						config.update("Name", value, true);
					}
				});
			} else if (selection == "No") {
				window.showInformationMessage("You can always change your name in settings.");
			}
		});
	}

	//! Make Statusbar icon
	var statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, -1);
	statusBarItem.name = "KW1C Template Active";
	statusBarItem.text = "KW1C";
	statusBarIcon(window.activeTextEditor?.document, statusBarItem);
	window.onDidChangeActiveTextEditor((event) => {
		if (event) {
			statusBarIcon(event.document, statusBarItem);
		}
	});

	//! Get all completions
	const cssCompletionItem = cssCompletion(context, config),
		jsCompletionItem = jsCompletion(context, config),
		htmlCompletionItem = htmlCompletion(context, config);
	// Push all completions
	context.subscriptions.push(cssCompletionItem,
		jsCompletionItem,
		htmlCompletionItem,
		statusBarItem
	);
}

function statusBarIcon(document: TextDocument | undefined, statusBarItem: StatusBarItem) {
	if (document && ["css", "javascript", "html"].includes(document.languageId || "")) {
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}
