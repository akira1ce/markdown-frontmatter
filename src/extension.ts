import * as vscode from 'vscode';
import { getConfig, isFileTypeSupported } from './config';
import { processFrontmatter } from './frontmatter';

export function activate(context: vscode.ExtensionContext) {
  // Register command for manual update
  const updateCommand = vscode.commands.registerCommand(
    'markdownFrontmatter.update',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
      }

      const config = getConfig();
      if (!config.enable) {
        vscode.window.showWarningMessage('Markdown Frontmatter is disabled');
        return;
      }

      const document = editor.document;
      if (!isFileTypeSupported(document.fileName, config.fileTypes)) {
        vscode.window.showWarningMessage(
          `File type not supported. Supported types: ${config.fileTypes.join(', ')}`
        );
        return;
      }

      const text = document.getText();
      const newText = processFrontmatter(text, document.fileName, config);

      if (text !== newText) {
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        edit.replace(document.uri, fullRange, newText);
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('Frontmatter updated');
      } else {
        vscode.window.showInformationMessage('No changes needed');
      }
    }
  );

  // Register save event listener
  const saveListener = vscode.workspace.onWillSaveTextDocument((event) => {
    const config = getConfig();

    if (!config.enable || !config.updateOnSave) {
      return;
    }

    const document = event.document;
    if (!isFileTypeSupported(document.fileName, config.fileTypes)) {
      return;
    }

    const text = document.getText();
    const newText = processFrontmatter(text, document.fileName, config);

    if (text !== newText) {
      const edit = vscode.TextEdit.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        ),
        newText
      );
      event.waitUntil(Promise.resolve([edit]));
    }
  });

  context.subscriptions.push(updateCommand, saveListener);
}

export function deactivate() {}
