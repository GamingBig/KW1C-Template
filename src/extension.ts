import { commands, env, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Uri, window, workspace } from "vscode";

// Import all completion files
import { jsCompletion } from "./completions/javascript";
import { htmlCompletion } from "./completions/html";
import { cssCompletion } from "./completions/css";
import { colorize } from "./colorize/colorize";

export function activate(context: ExtensionContext) {
	var config = workspace.getConfiguration("kw1c-template");

	//! Ask user to input their name
	if (config.Name == "You can add your name in settings.") {
		var msgBox = window.showInformationMessage(
			"Do you want to input your name to add to the template? (Recommended)",
			{
				detail: "This will be used to automatically add your name when ever you add the template to your project.",
			},
			...["Sure", "No"]
		);
		msgBox.then((selection) => {
			if (selection == "Sure") {
				window.showInputBox({
					title: "Please enter your name (first and last)",
					ignoreFocusOut: true,
					prompt: "This will be used to automatically add your name when ever you add the template to your project."
				}).then((value) => {
					if (value == undefined) {
						window.showInformationMessage("You can always change your name in settings.");
					} else {
						config.update("Name", value, true);
						window.showInformationMessage("You can always change your name in settings.");
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
	statusBarItem.command = "\u200b"
	statusBarIcon(window.activeTextEditor?.document, statusBarItem);
	window.onDidChangeActiveTextEditor((event) => {
		if (event) {
			statusBarIcon(event.document, statusBarItem);
		}
	});

	//! Activate colorizer
	colorize(context)

	//! Easter egg
	const egg = commands.registerCommand("\u200b", ()=>{
		window.showInformationMessage("Easter egg.", ...["Nice"]).then((res) => {
			if (res == "Nice") {
				env.openExternal(Uri.parse("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
			}
		})
	})
	
	//! Get all completions
	const cssCompletionItem = cssCompletion(context, config),
		jsCompletionItem = jsCompletion(context, config),
		htmlCompletionItem = htmlCompletion(context, config);
	
	
	//! Push all subscriptions
	context.subscriptions.push(cssCompletionItem,
		jsCompletionItem,
		htmlCompletionItem,
		statusBarItem,
		egg
	);
}

function statusBarIcon(document: TextDocument | undefined, statusBarItem: StatusBarItem) {
	if (document && ["css", "javascript", "html"].includes(document.languageId || "")) {
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}
